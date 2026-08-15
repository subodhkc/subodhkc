import { redirect } from 'next/navigation'
import {
  getAuthenticatedUser,
  resolveOrganizationContext,
  requireOfferingAccess,
  AuthError,
  type OrganizationContext,
} from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'
import { AdvisoryWorkspaceClient } from '@/components/app/AdvisoryWorkspaceClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function AdvisoryPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const user = await getAuthenticatedUser()
  if (!user) redirect(`/login?next=/app/${orgSlug}/advisory`)

  let ctx: OrganizationContext | undefined
  try {
    ctx = await resolveOrganizationContext(user, orgSlug)
    // Accept the canonical fractional_ai_advisor key, with backward compat
    // for legacy 'advisory' and 'fractional_ai' entitlements
    try {
      requireOfferingAccess(ctx, 'fractional_ai_advisor')
    } catch {
      requireOfferingAccess(ctx, 'advisory')
    }
  } catch (err) {
    if (err instanceof AuthError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center space-y-2 max-w-sm">
            <h1 className="text-xl font-bold">Access Denied</h1>
            <p className="text-sm text-muted-foreground">{err.message}</p>
            <a href={`/app/${orgSlug}`} className="text-sm text-primary hover:underline block">
              Back to {ctx?.organization.name || orgSlug}
            </a>
          </div>
        </div>
      )
    }
    throw err
  }

  const serviceClient = createServiceClient()

  // Fetch engagements for this org
  let engagements: Array<{
    id: string
    engagement_type: string
    status: string
    starts_at: string | null
    ends_at: string | null
  }> = []

  // Fetch onboarding data
  let onboarding: any = null

  // Fetch decisions
  let decisions: any[] = []

  // Fetch subscription status
  let subscriptionStatus: string | null = null
  let billingPeriodStart: string | null = null
  let billingPeriodEnd: string | null = null

  // Products & platforms
  let products: any[] = []
  let memberToolsEntData: { accessLevel: string; entitlementStatus: string } | null = null

  // Fractional operating records
  let intakeRecords: any[] = []
  let opportunities: any[] = []
  let evidence: any[] = []
  let workingSessions: any[] = []
  let monthlyBriefs: any[] = []
  let priorities: any[] = []
  let actions: any[] = []
  let artifacts: any[] = []
  let outcomes: any[] = []

  if (serviceClient) {
    // Engagements
    const { data: engData } = await serviceClient
      .from('engagements')
      .select('id, engagement_type, status, starts_at, ends_at')
      .eq('organization_id', ctx.organization.id)
      .order('created_at', { ascending: false })

    engagements = (engData || []).map((e: any) => ({
      id: e.id,
      engagement_type: e.engagement_type,
      status: e.status,
      starts_at: e.starts_at,
      ends_at: e.ends_at,
    }))

    // Onboarding
    const { data: onboardingData } = await serviceClient
      .from('fractional_onboarding')
      .select('*')
      .eq('organization_id', ctx.organization.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    onboarding = onboardingData || null

    // Decisions - find the active retainer engagement
    const activeEngagement = engagements.find(
      e => e.engagement_type === 'retainer' && e.status === 'active'
    )

    if (activeEngagement) {
      const { data: decisionData } = await serviceClient
        .from('engagement_decisions')
        .select('id, title, description, status, decision_owner, needed_by, decided_at, created_at')
        .eq('engagement_id', activeEngagement.id)
        .order('created_at', { ascending: false })

      decisions = decisionData || []
    }

    // Subscription status (per-offer key with legacy fallback)
    const { data: subLink } = await serviceClient
      .from('external_system_links')
      .select('external_id, status, metadata')
      .eq('organization_id', ctx.organization.id)
      .eq('system_key', 'stripe_subscription:fractional_ai_advisor')
      .single()

    if (subLink) {
      subscriptionStatus = subLink.status
    } else {
      const { data: legacySub } = await serviceClient
        .from('external_system_links')
        .select('external_id, status')
        .eq('organization_id', ctx.organization.id)
        .eq('system_key', 'stripe_subscription')
        .single()
      if (legacySub) {
        subscriptionStatus = legacySub.status
      }
    }

    // Billing period from Stripe subscription
    if (subLink?.external_id) {
      try {
        const { getStripe } = await import('@/lib/stripe/client')
        const stripe = getStripe()
        if (stripe) {
          const subscription = await stripe.subscriptions.retrieve(subLink.external_id)
          billingPeriodStart = new Date(subscription.current_period_start * 1000).toISOString()
          billingPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString()
        }
      } catch {
        // Stripe not configured or subscription not found
      }
    }

    // Fetch included product entitlements (canonical model)
    const { data: includedEntitlements } = await serviceClient
      .from('included_product_entitlements')
      .select('*')
      .eq('organization_id', ctx.organization.id)
      .order('created_at', { ascending: true })

    const haiecEnt = includedEntitlements?.find(e => e.product_key === 'haiec')
    const kestrelEnt = includedEntitlements?.find(e => e.product_key === 'kestrel')
    const memberToolsEnt = includedEntitlements?.find(e => e.product_key === 'member_tools')

    products = [
      {
        offeringKey: 'haiec',
        name: 'HAIEC',
        description: haiecEnt?.tier_or_plan === 'scan'
          ? 'HAIEC SCAN — AI compliance scanning, governance scorecard, and security assessment.'
          : 'AI compliance and governance platform.',
        externalUrl: 'https://www.haiec.com',
        learnMoreHref: '/solutions/haiec',
        hasEntitlement: !!haiecEnt && haiecEnt.entitlement_status !== 'ended',
        requestStatus: null,
        requestId: null,
        includedEntitlement: haiecEnt ? {
          id: haiecEnt.id,
          tierOrPlan: haiecEnt.tier_or_plan,
          seats: haiecEnt.seats,
          credits: haiecEnt.credits,
          entitlementStatus: haiecEnt.entitlement_status,
          provisioningStatus: haiecEnt.provisioning_status,
          externalUserId: haiecEnt.external_user_id,
          provisioningError: haiecEnt.provisioning_error,
          sourceOfferKey: haiecEnt.source_offer_key,
        } : null,
      },
      {
        offeringKey: 'kestrel',
        name: 'KestrelVoice',
        description: 'Kestrel AI Number Basic — one AI phone number with basic AI answering. 20 monthly credits included.',
        externalUrl: 'https://www.kestrelvoice.com',
        learnMoreHref: '/solutions/kestrelvoice',
        hasEntitlement: !!kestrelEnt && kestrelEnt.entitlement_status !== 'ended',
        requestStatus: null,
        requestId: null,
        includedEntitlement: kestrelEnt ? {
          id: kestrelEnt.id,
          tierOrPlan: kestrelEnt.tier_or_plan,
          seats: kestrelEnt.seats,
          credits: kestrelEnt.credits,
          entitlementStatus: kestrelEnt.entitlement_status,
          provisioningStatus: kestrelEnt.provisioning_status,
          externalUserId: kestrelEnt.external_user_id,
          provisioningError: kestrelEnt.provisioning_error,
          sourceOfferKey: kestrelEnt.source_offer_key,
        } : null,
      },
    ]

    memberToolsEntData = memberToolsEnt ? {
      accessLevel: memberToolsEnt.tier_or_plan,
      entitlementStatus: memberToolsEnt.entitlement_status,
    } : null

    // Fetch all Fractional operating records in parallel
    const activeEng = engagements.find(
      e => e.engagement_type === 'retainer' && e.status === 'active'
    )
    const engagementId = activeEng?.id || null

    const [
      intakeRes, oppRes, evidenceRes, sessionsRes, briefsRes,
      prioritiesRes, actionsRes, artifactsRes, outcomesRes,
    ] = await Promise.all([
      serviceClient.from('fractional_intake_records').select('*').eq('organization_id', ctx.organization.id).order('created_at', { ascending: false }),
      serviceClient.from('fractional_opportunities').select('*').eq('organization_id', ctx.organization.id).order('created_at', { ascending: false }),
      serviceClient.from('fractional_evidence').select('*').eq('organization_id', ctx.organization.id).order('created_at', { ascending: false }),
      serviceClient.from('fractional_working_sessions').select('*').eq('organization_id', ctx.organization.id).order('scheduled_at', { ascending: false }),
      serviceClient.from('fractional_monthly_briefs').select('*').eq('organization_id', ctx.organization.id).order('brief_month', { ascending: false }),
      serviceClient.from('fractional_priorities').select('*').eq('organization_id', ctx.organization.id).order('priority_order', { ascending: true }),
      engagementId
        ? serviceClient.from('engagement_actions').select('*').eq('organization_id', ctx.organization.id).eq('engagement_id', engagementId).order('created_at', { ascending: false })
        : Promise.resolve({ data: null, error: null }),
      engagementId
        ? serviceClient.from('engagement_artifacts').select('*').eq('organization_id', ctx.organization.id).eq('engagement_id', engagementId).order('created_at', { ascending: false })
        : Promise.resolve({ data: null, error: null }),
      engagementId
        ? serviceClient.from('engagement_outcomes').select('*').eq('organization_id', ctx.organization.id).eq('engagement_id', engagementId).order('created_at', { ascending: false })
        : Promise.resolve({ data: null, error: null }),
    ])

    intakeRecords = intakeRes.data || []
    opportunities = oppRes.data || []
    evidence = evidenceRes.data || []
    workingSessions = sessionsRes.data || []
    monthlyBriefs = briefsRes.data || []
    priorities = prioritiesRes.data || []
    actions = actionsRes.data || []
    artifacts = artifactsRes.data || []
    outcomes = outcomesRes.data || []
  }

  return (
    <AdvisoryWorkspaceClient
      user={user}
      ctx={ctx}
      engagements={engagements}
      onboarding={onboarding}
      decisions={decisions}
      subscriptionStatus={subscriptionStatus}
      billingPeriodStart={billingPeriodStart}
      billingPeriodEnd={billingPeriodEnd}
      products={products || []}
      memberToolsIncluded={memberToolsEntData}
      intakeRecords={intakeRecords}
      opportunities={opportunities}
      evidence={evidence}
      workingSessions={workingSessions}
      monthlyBriefs={monthlyBriefs}
      priorities={priorities}
      actions={actions}
      artifacts={artifacts}
      outcomes={outcomes}
    />
  )
}
