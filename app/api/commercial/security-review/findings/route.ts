import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, resolveOrganizationContext, AuthError } from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/commercial/security-review/findings?orgSlug=<slug>
 * Returns security findings for the org.
 * Org members see only published findings.
 * Platform admins see all findings.
 */
export async function GET(req: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const orgSlug = searchParams.get('orgSlug')
  if (!orgSlug) return NextResponse.json({ error: 'orgSlug required' }, { status: 400 })

  let ctx
  try {
    ctx = await resolveOrganizationContext(user, orgSlug)
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 403 })
    throw err
  }

  const sc = createServiceClient()
  if (!sc) return NextResponse.json({ error: 'config' }, { status: 500 })

  // Check if user is platform admin
  const { data: userRoles } = await sc
    .from('platform_user_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('status', 'active')

  const isPlatformAdmin = (userRoles || []).some(r => r.role === 'admin' || r.role === 'super_admin')

  let query = sc
    .from('security_findings')
    .select('*')
    .eq('organization_id', ctx.organization.id)

  // Non-admins only see published findings
  if (!isPlatformAdmin) {
    query = query.eq('is_published', true)
  }

  const { data: findings } = await query.order('created_at', { ascending: false })

  return NextResponse.json({ findings: findings || [] })
}

/**
 * POST /api/commercial/security-review/findings
 * Platform admin creates a new finding.
 * Org admin can update remediation status.
 */
export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json()
  const { orgSlug, finding } = body as {
    orgSlug: string
    finding: {
      id?: string
      engagement_id: string
      title: string
      description: string
      severity: string
      status?: string
      category?: string
      affected_component?: string
      evidence_reference?: string
      remediation?: string
      retest_evidence_reference?: string
      retest_notes?: string
      retested_at?: string
      internal_disposition?: string
      is_published?: boolean
      framework_mappings?: Record<string, string[]>
      display_order?: number
    }
  }

  if (!orgSlug || !finding) {
    return NextResponse.json({ error: 'orgSlug and finding required' }, { status: 400 })
  }

  let ctx
  try {
    ctx = await resolveOrganizationContext(user, orgSlug)
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 403 })
    throw err
  }

  const sc = createServiceClient()
  if (!sc) return NextResponse.json({ error: 'config' }, { status: 500 })

  // Check if user is platform admin
  const { data: userRoles } = await sc
    .from('platform_user_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('status', 'active')

  const isPlatformAdmin = (userRoles || []).some(r => r.role === 'admin' || r.role === 'super_admin')

  if (finding.id) {
    // Update existing finding
    const updateFields: Record<string, unknown> = {}

    // Org admins can only update remediation fields (status, retest notes)
    // but cannot set status to retest_verified (reviewer-only)
    if (!isPlatformAdmin) {
      if (finding.status !== undefined && finding.status !== 'retest_verified') updateFields.status = finding.status
      if (finding.retest_notes !== undefined) updateFields.retest_notes = finding.retest_notes
      if (finding.retest_evidence_reference !== undefined) updateFields.retest_evidence_reference = finding.retest_evidence_reference
      if (finding.remediation !== undefined) updateFields.remediation = finding.remediation
    } else {
      // Platform admin can update all fields
      if (finding.title !== undefined) updateFields.title = finding.title
      if (finding.description !== undefined) updateFields.description = finding.description
      if (finding.severity !== undefined) updateFields.severity = finding.severity
      if (finding.status !== undefined) updateFields.status = finding.status
      if (finding.category !== undefined) updateFields.category = finding.category
      if (finding.affected_component !== undefined) updateFields.affected_component = finding.affected_component
      if (finding.evidence_reference !== undefined) updateFields.evidence_reference = finding.evidence_reference
      if (finding.remediation !== undefined) updateFields.remediation = finding.remediation
      if (finding.retest_evidence_reference !== undefined) updateFields.retest_evidence_reference = finding.retest_evidence_reference
      if (finding.retest_notes !== undefined) updateFields.retest_notes = finding.retest_notes
      if (finding.retested_at !== undefined) updateFields.retested_at = finding.retested_at
      if (finding.internal_disposition !== undefined) updateFields.internal_disposition = finding.internal_disposition
      if (finding.is_published !== undefined) updateFields.is_published = finding.is_published
      if (finding.framework_mappings !== undefined) updateFields.framework_mappings = finding.framework_mappings
      if (finding.display_order !== undefined) updateFields.display_order = finding.display_order
    }

    const { data, error } = await sc
      .from('security_findings')
      .update(updateFields)
      .eq('id', finding.id)
      .eq('organization_id', ctx.organization.id)
      .select('*')
      .single()

    if (error) return NextResponse.json({ error: 'failed_to_update' }, { status: 500 })

    // Audit event
    await sc.rpc('write_audit_event', {
      audit_action: 'security_finding.updated',
      audit_entity_type: 'security_finding',
      audit_org_id: ctx.organization.id,
      audit_actor_id: user.id,
      audit_entity_id: finding.id,
      audit_metadata: { fields_updated: Object.keys(updateFields) } as any,
    })

    // Send retest completed email if status indicates retest completion
    if (finding.status && (finding.status === 'retest_verified' || finding.status === 'additional_work_recommended')) {
      try {
        const { data: org } = await sc
          .from('organizations')
          .select('slug')
          .eq('id', ctx.organization.id)
          .single()

        if (org?.slug) {
          const { sendRetestCompletedEmail } = await import('@/lib/email')
          await sendRetestCompletedEmail({
            to: user.email!,
            orgSlug: org.slug,
            findingTitle: data.title,
            result: finding.status === 'retest_verified' ? 'verified' : 'additional_work_recommended',
          })
        }
      } catch (err) {
        console.error('Failed to send retest email:', err)
      }
    }

    return NextResponse.json({ finding: data })
  } else {
    // Create new finding (platform admin only)
    if (!isPlatformAdmin) {
      return NextResponse.json({ error: 'only_admins_can_create_findings' }, { status: 403 })
    }

    const { data, error } = await sc
      .from('security_findings')
      .insert({
        organization_id: ctx.organization.id,
        engagement_id: finding.engagement_id,
        title: finding.title,
        description: finding.description,
        severity: finding.severity,
        status: finding.status || 'finding_open',
        category: finding.category || null,
        affected_component: finding.affected_component || null,
        evidence_reference: finding.evidence_reference || null,
        remediation: finding.remediation || null,
        internal_disposition: finding.internal_disposition || 'confirmed',
        is_published: finding.is_published ?? false,
        framework_mappings: finding.framework_mappings || {},
        display_order: finding.display_order || 0,
      })
      .select('*')
      .single()

    if (error) return NextResponse.json({ error: 'failed_to_create' }, { status: 500 })

    // Audit event
    await sc.rpc('write_audit_event', {
      audit_action: 'security_finding.created',
      audit_entity_type: 'security_finding',
      audit_org_id: ctx.organization.id,
      audit_actor_id: user.id,
      audit_entity_id: data.id,
      audit_metadata: { title: finding.title, severity: finding.severity } as any,
    })

    return NextResponse.json({ finding: data })
  }
}
