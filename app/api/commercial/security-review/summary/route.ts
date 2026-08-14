import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, resolveOrganizationContext, AuthError } from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/commercial/security-review/summary?orgSlug=<slug>
 * Returns a buyer-shareable summary of the security review.
 * Only includes published findings, coverage stats, and overall status.
 * This is safe to share with potential buyers/acquirers.
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

  // Get published findings only
  const { data: findings } = await sc
    .from('security_findings')
    .select('id, title, severity, status, is_published, retest_notes, retested_at, created_at')
    .eq('organization_id', ctx.organization.id)
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  // Get coverage areas
  const { data: coverage } = await sc
    .from('security_coverage_areas')
    .select('area_key, area_label, status')
    .eq('organization_id', ctx.organization.id)
    .order('display_order', { ascending: true })

  // Get review record
  const { data: reviewRecord } = await sc
    .from('security_review_records')
    .select('*')
    .eq('organization_id', ctx.organization.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // Build summary
  const findingsBySeverity = {
    critical: (findings || []).filter(f => f.severity === 'critical').length,
    high: (findings || []).filter(f => f.severity === 'high').length,
    medium: (findings || []).filter(f => f.severity === 'medium').length,
    low: (findings || []).filter(f => f.severity === 'low').length,
    informational: (findings || []).filter(f => f.severity === 'informational').length,
  }

  const coverageStats = {
    total: (coverage || []).length,
    verified: (coverage || []).filter(c => c.status === 'verified').length,
    reviewed: (coverage || []).filter(c => c.status === 'reviewed').length,
    pending: (coverage || []).filter(c => c.status === 'pending').length,
    not_applicable: (coverage || []).filter(c => c.status === 'not_applicable').length,
  }

  const remediationStats = {
    total: (findings || []).length,
    remediated: (findings || []).filter(f => f.status === 'retest_verified').length,
    in_progress: (findings || []).filter(f => f.status === 'fix_reported' || f.status === 'ready_for_retest').length,
    pending: (findings || []).filter(f => f.status === 'finding_open').length,
    verified: (findings || []).filter(f => f.status === 'retest_verified').length,
  }

  return NextResponse.json({
    summary: {
      organizationName: ctx.organization.name,
      reviewRecord: reviewRecord || null,
      findings: findings || [],
      findingsBySeverity,
      coverage: coverage || [],
      coverageStats,
      remediationStats,
      overallStatus: reviewRecord?.status || 'in_progress',
      completedAt: reviewRecord?.completed_at || null,
    },
  })
}
