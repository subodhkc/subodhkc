import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { getAuthenticatedUser } from '@/lib/auth/organization-resolver'
import { resolveSchoolContext, SchoolAuthError } from '@/lib/auth/school-resolver'
import { sendGuardianInvitationEmail } from '@/lib/email'
import crypto from 'crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET: List guardians for this site
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orgSlug: string; siteSlug: string }> }
) {
  const { orgSlug, siteSlug } = await params
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  let ctx
  try {
    ctx = await resolveSchoolContext(user, orgSlug, siteSlug)
  } catch (err) {
    if (err instanceof SchoolAuthError) return NextResponse.json({ error: err.code }, { status: 403 })
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  const { data: guardians, error } = await serviceClient
    .from('school_guardians')
    .select(`
      id, email_normalized, display_name, status, created_at, activated_at, revoked_at,
      student_guardian_links(id, student_id, relationship_label, portal_access, self_checkin_allowed, status)
    `)
    .eq('organization_id', ctx.organization.organization.id)
    .eq('school_site_id', ctx.site.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: 'query_failed' }, { status: 500 })

  // Get invitation status
  const guardianIds = (guardians || []).map((g: any) => g.id)
  let invitationsMap: Record<string, any> = {}
  if (guardianIds.length > 0) {
    const { data: invitations } = await serviceClient
      .from('guardian_invitations')
      .select('id, guardian_id, status, created_at, expires_at')
      .in('guardian_id', guardianIds)
      .order('created_at', { ascending: false })

    for (const inv of invitations || []) {
      if (!invitationsMap[inv.guardian_id]) {
        invitationsMap[inv.guardian_id] = inv
      }
    }
  }

  const result = (guardians || []).map((g: any) => ({
    ...g,
    invitation: invitationsMap[g.id] || null,
  }))

  return NextResponse.json({ guardians: result })
}

// POST: Create guardian + student links + send invitation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orgSlug: string; siteSlug: string }> }
) {
  const { orgSlug, siteSlug } = await params
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  let ctx
  try {
    ctx = await resolveSchoolContext(user, orgSlug, siteSlug)
  } catch (err) {
    if (err instanceof SchoolAuthError) return NextResponse.json({ error: err.code }, { status: 403 })
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  if (!ctx.canEditRoster) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
  }

  const body = await request.json()
  const { email, display_name, relationship, student_ids, send_invitation } = body

  if (!email || !student_ids || !Array.isArray(student_ids) || student_ids.length === 0) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
  }

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  const emailNormalized = email.toLowerCase().trim()

  // Check if guardian already exists for this site
  const { data: existing } = await serviceClient
    .from('school_guardians')
    .select('id, status')
    .eq('school_site_id', ctx.site.id)
    .eq('email_normalized', emailNormalized)
    .single()

  let guardianId: string

  if (existing) {
    guardianId = existing.id
    // Reactivate if revoked
    if (existing.status === 'revoked') {
      await serviceClient
        .from('school_guardians')
        .update({ status: 'active', revoked_at: null, updated_at: new Date().toISOString() })
        .eq('id', guardianId)
    }
  } else {
    // Create guardian record
    const { data: guardian, error: guardianError } = await serviceClient
      .from('school_guardians')
      .insert({
        organization_id: ctx.organization.organization.id,
        school_site_id: ctx.site.id,
        email_normalized: emailNormalized,
        display_name: display_name || null,
        status: 'pending',
      })
      .select('id')
      .single()

    if (guardianError) {
      return NextResponse.json({ error: 'create_failed', detail: guardianError.message }, { status: 500 })
    }
    guardianId = guardian.id

    // Audit event
    await serviceClient.from('audit_events').insert({
      organization_id: ctx.organization.organization.id,
      entity_type: 'guardian',
      entity_id: guardianId,
      event_type: 'guardian.created',
      actor_user_id: user.id,
      metadata: { email: emailNormalized, site_id: ctx.site.id },
    })
  }

  // Create student guardian links
  for (const studentId of student_ids) {
    // Verify student belongs to this site
    const { data: student } = await serviceClient
      .from('school_students')
      .select('id')
      .eq('id', studentId)
      .eq('school_site_id', ctx.site.id)
      .eq('organization_id', ctx.organization.organization.id)
      .single()

    if (!student) continue

    // Check if link already exists
    const { data: existingLink } = await serviceClient
      .from('student_guardian_links')
      .select('id, status')
      .eq('guardian_id', guardianId)
      .eq('student_id', studentId)
      .single()

    if (existingLink) {
      if (existingLink.status === 'revoked') {
        await serviceClient
          .from('student_guardian_links')
          .update({ status: 'active', revoked_at: null, relationship_label: relationship || null, updated_at: new Date().toISOString() })
          .eq('id', existingLink.id)
      }
    } else {
      await serviceClient.from('student_guardian_links').insert({
        organization_id: ctx.organization.organization.id,
        school_site_id: ctx.site.id,
        guardian_id: guardianId,
        student_id: studentId,
        relationship_label: relationship || null,
        portal_access: true,
        self_checkin_allowed: false, // Default to disabled per spec
        status: 'active',
      })
    }

    // Audit event
    await serviceClient.from('audit_events').insert({
      organization_id: ctx.organization.organization.id,
      entity_type: 'guardian_student',
      entity_id: `${guardianId}:${studentId}`,
      event_type: 'guardian_student.linked',
      actor_user_id: user.id,
      metadata: { guardian_id: guardianId, student_id: studentId, site_id: ctx.site.id },
    })
  }

  // Send invitation if requested
  let invitationSent = false
  if (send_invitation) {
    const token = crypto.randomBytes(32).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

    // Revoke any existing pending invitations for this guardian
    await serviceClient
      .from('guardian_invitations')
      .update({ status: 'revoked', revoked_at: new Date().toISOString() })
      .eq('guardian_id', guardianId)
      .eq('status', 'pending')

    // Create new invitation
    const { error: invError } = await serviceClient.from('guardian_invitations').insert({
      organization_id: ctx.organization.organization.id,
      school_site_id: ctx.site.id,
      guardian_id: guardianId,
      email: emailNormalized,
      token_hash: tokenHash,
      invited_by: user.id,
      status: 'pending',
    })

    if (!invError) {
      const result = await sendGuardianInvitationEmail({
        to: emailNormalized,
        orgName: ctx.organization.organization.name,
        siteName: ctx.site.name,
        inviterName: user.email || 'School Administrator',
        token,
      })
      invitationSent = result.success

      if (!result.success) {
        // Mark invitation as failed
        await serviceClient
          .from('guardian_invitations')
          .update({ status: 'failed' })
          .eq('guardian_id', guardianId)
          .eq('token_hash', tokenHash)
      }

      // Audit event
      await serviceClient.from('audit_events').insert({
        organization_id: ctx.organization.organization.id,
        entity_type: 'guardian',
        entity_id: guardianId,
        event_type: 'guardian.invited',
        actor_user_id: user.id,
        metadata: { email: emailNormalized, site_id: ctx.site.id, sent: invitationSent },
      })
    }
  }

  return NextResponse.json({ success: true, guardian_id: guardianId, invitation_sent: invitationSent })
}
