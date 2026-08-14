import { redirect } from 'next/navigation'
import {
  getAuthenticatedUser,
  resolveOrganizationContext,
  AuthError,
  type OrganizationContext,
} from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'
import { SecurityReviewWorkspaceClient } from '@/components/app/SecurityReviewWorkspaceClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const metadata = {
  title: 'Security Review | SubodhKC',
  robots: { index: false, follow: false },
}

export default async function SecurityReviewPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const user = await getAuthenticatedUser()
  if (!user) redirect(`/login?next=/app/${orgSlug}/security-review`)

  let ctx: OrganizationContext | undefined
  try {
    ctx = await resolveOrganizationContext(user, orgSlug)
  } catch (err) {
    if (err instanceof AuthError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center space-y-2 max-w-sm">
            <h1 className="text-xl font-bold">Access Denied</h1>
            <p className="text-sm text-muted-foreground">{err.message}</p>
            <a href={`/app`} className="text-sm text-primary hover:underline block">
              Back to dashboard
            </a>
          </div>
        </div>
      )
    }
    throw err
  }

  // Check for either security review offering
  const hasEntitlement =
    ctx.entitlements.some(
      e =>
        (e.offering_key === 'saas_security_review' || e.offering_key === 'ai_security_compliance') &&
        e.effective_status === 'active'
    ) || ctx.isPlatformAdmin

  if (!hasEntitlement) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-3 max-w-md">
          <h1 className="text-xl font-bold">Security Review</h1>
          <p className="text-sm text-muted-foreground">
            Your organization does not have an active security review.
          </p>
          <a href="/saas-security-review" className="inline-block text-sm text-primary hover:underline">
            Learn about Security Review
          </a>
        </div>
      </div>
    )
  }

  const sc = createServiceClient()
  if (!sc) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">Configuration error. Please try again.</p>
      </div>
    )
  }

  // Determine which offering key
  const securityEntitlement = ctx.entitlements.find(
    e =>
      (e.offering_key === 'saas_security_review' || e.offering_key === 'ai_security_compliance') &&
      e.effective_status === 'active'
  )
  const offeringKey = securityEntitlement?.offering_key || 'saas_security_review'
  const reviewTitle = offeringKey === 'ai_security_compliance'
    ? 'AI Security & Compliance Review'
    : 'SaaS & AI Security Review'

  // Find the security engagement
  const { data: offeringData } = await sc
    .from('offerings')
    .select('id')
    .eq('offering_key', offeringKey)
    .single()

  let engagement: any = null
  if (offeringData) {
    const { data: engOffering } = await sc
      .from('engagement_offerings')
      .select('engagement_id')
      .eq('organization_id', ctx.organization.id)
      .eq('offering_id', offeringData.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (engOffering) {
      const { data: eng } = await sc
        .from('engagements')
        .select('id, engagement_type, status, current_phase, title, statement, starts_at, ends_at')
        .eq('id', engOffering.engagement_id)
        .single()
      engagement = eng
    }
  }

  if (!engagement) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-3 max-w-md">
          <h1 className="text-xl font-bold">{reviewTitle}</h1>
          <p className="text-sm text-muted-foreground">
            Your security review is being set up. Check back shortly.
          </p>
        </div>
      </div>
    )
  }

  // Fetch authorization
  const { data: authorization } = await sc
    .from('security_review_authorizations')
    .select('*')
    .eq('organization_id', ctx.organization.id)
    .eq('engagement_id', engagement.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // Fetch findings
  const { data: findings } = await sc
    .from('security_findings')
    .select('id, title, description, severity, category, affected_component, status, remediation, evidence_reference, retest_notes, retested_at, display_order')
    .eq('organization_id', ctx.organization.id)
    .eq('engagement_id', engagement.id)
    .order('display_order', { ascending: true })

  // Fetch access checklist
  const { data: checklist } = await sc
    .from('security_access_checklists')
    .select('id, checklist_item, item_type, status, notes, display_order')
    .eq('organization_id', ctx.organization.id)
    .eq('engagement_id', engagement.id)
    .order('display_order', { ascending: true })

  // Fetch review records
  const { data: reviewRecords } = await sc
    .from('security_review_records')
    .select('id, title, summary, scope_description, status, published_at, finding_count, critical_count, high_count, medium_count, low_count, informational_count')
    .eq('organization_id', ctx.organization.id)
    .eq('engagement_id', engagement.id)
    .order('created_at', { ascending: false })

  // Fetch coverage areas
  const { data: coverageAreas } = await sc
    .from('security_coverage_areas')
    .select('id, area_key, area_label, status, notes, display_order')
    .eq('organization_id', ctx.organization.id)
    .eq('engagement_id', engagement.id)
    .order('display_order', { ascending: true })

  return (
    <SecurityReviewWorkspaceClient
      user={user}
      ctx={ctx}
      reviewTitle={reviewTitle}
      engagement={engagement}
      authorization={authorization || null}
      findings={findings || []}
      checklist={checklist || []}
      reviewRecords={reviewRecords || []}
      coverageAreas={coverageAreas || []}
    />
  )
}
