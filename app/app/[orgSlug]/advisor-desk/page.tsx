import { redirect } from 'next/navigation'
import {
  getAuthenticatedUser,
  resolveOrganizationContext,
  AuthError,
  type OrganizationContext,
} from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'
import { getOffer } from '@/lib/commercial/offers'
import { listWorkOrdersForOrg, statusLabel, type WorkOrder } from '@/lib/commercial/work-orders'
import { AdvisorDeskWorkspaceClient } from '@/components/app/AdvisorDeskWorkspaceClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const metadata = {
  title: 'AI Advisor Desk | SubodhKC',
  robots: { index: false, follow: false },
}

export default async function AdvisorDeskPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const user = await getAuthenticatedUser()
  if (!user) redirect(`/login?next=/app/${orgSlug}/advisor-desk`)

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

  const offer = getOffer('ai_advisor_desk')
  const hasEntitlement =
    ctx.entitlements.some(
      e => e.offering_key === 'ai_advisor_desk' && e.effective_status === 'active'
    ) || ctx.isPlatformAdmin

  if (!hasEntitlement) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-3 max-w-md">
          <h1 className="text-xl font-bold">AI Advisor Desk</h1>
          <p className="text-sm text-muted-foreground">
            Your organization does not have an active AI Advisor Desk subscription.
          </p>
          <a
            href={offer?.landingPage ?? '/ai-advisor'}
            className="inline-block text-sm text-primary hover:underline"
          >
            Learn about AI Advisor Desk
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

  // Fetch advisor questions
  const { data: questions } = await sc
    .from('advisor_questions')
    .select(`
      id, subject, question, status, advisor_response,
      billing_period_key, created_at, responded_at, context,
      request_category, effort_class, recommended_next_step, recommended_offer_key
    `)
    .eq('organization_id', ctx.organization.id)
    .order('created_at', { ascending: false })

  // Fetch team members
  const { data: members } = await sc
    .from('organization_memberships')
    .select(`
      id, role, status, joined_at,
      user_id
    `)
    .eq('organization_id', ctx.organization.id)
    .eq('status', 'active')
    .order('joined_at', { ascending: true })

  // Fetch profiles for members
  const memberUserIds = (members || []).map(m => m.user_id).filter(Boolean)
  let memberProfiles: Record<string, { email: string; display_name: string | null }> = {}
  if (memberUserIds.length > 0) {
    const { data: profiles } = await sc
      .from('profiles')
      .select('id, email, display_name')
      .in('id', memberUserIds)
    for (const p of profiles || []) {
      memberProfiles[p.id] = { email: p.email, display_name: p.display_name }
    }
  }

  // Fetch subscription status for billing section (per-offer key with legacy fallback)
  let subLink = null
  const { data: perOfferSub } = await sc
    .from('external_system_links')
    .select('external_id, metadata, status')
    .eq('organization_id', ctx.organization.id)
    .eq('system_key', 'stripe_subscription:ai_advisor_desk')
    .single()
  if (perOfferSub) {
    subLink = perOfferSub
  } else {
    const { data: legacySub } = await sc
      .from('external_system_links')
      .select('external_id, metadata, status')
      .eq('organization_id', ctx.organization.id)
      .eq('system_key', 'stripe_subscription')
      .single()
    subLink = legacySub
  }

  // Fetch entitlement for valid_until info
  const advisorEntitlement = ctx.entitlements.find(
    e => e.offering_key === 'ai_advisor_desk'
  )

  // Fetch included product entitlements (canonical model)
  const { data: includedEntitlements } = await sc
    .from('included_product_entitlements')
    .select('*')
    .eq('organization_id', ctx.organization.id)
    .order('created_at', { ascending: true })

  // Build product display from included entitlements
  const haiecEnt = includedEntitlements?.find(e => e.product_key === 'haiec')
  const kestrelEnt = includedEntitlements?.find(e => e.product_key === 'kestrel')
  const memberToolsEnt = includedEntitlements?.find(e => e.product_key === 'member_tools')

  const products = [
    {
      offeringKey: 'haiec',
      name: 'HAIEC',
      description: haiecEnt?.tier_or_plan === 'advisor_essentials'
        ? 'HAIEC Advisor Essentials — AI Law Finder, vendor review, governance scorecard, self-audit, and selected compliance assessments.'
        : 'AI compliance and governance platform.',
      externalUrl: 'https://www.haiec.com',
      learnMoreHref: '/solutions/haiec',
      hasEntitlement: !!haiecEnt && haiecEnt.entitlement_status !== 'ended',
      requestStatus: null,
      requestId: null,
      // New fields for included product model
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

  // Member Tools is shown separately
  const memberToolsIncluded = memberToolsEnt ? {
    accessLevel: memberToolsEnt.tier_or_plan,
    entitlementStatus: memberToolsEnt.entitlement_status,
  } : null

  // Fetch watchlist items
  const { data: watchlistItems } = await sc
    .from('advisor_watchlist_items')
    .select('id, category, title, source, relevance, status, recommended_next_action, is_draft, created_at')
    .eq('organization_id', ctx.organization.id)
    .order('created_at', { ascending: false })

  // Fetch scheduling links for activation call
  const { data: schedulingLinks } = await sc
    .from('scheduling_links')
    .select('id, scheduling_url, status, scheduled_at, link_type')
    .eq('organization_id', ctx.organization.id)
    .eq('link_type', 'activation_call')
    .order('created_at', { ascending: false })
    .limit(1)

  // Fetch lifecycle state for onboarding progress
  const { data: lifecycle } = await sc
    .from('customer_lifecycle_states')
    .select('advisor_onboarding_steps, onboarding_complete')
    .eq('organization_id', ctx.organization.id)
    .single()

  const onboardingSteps = lifecycle?.advisor_onboarding_steps || null
  const onboardingComplete = lifecycle?.onboarding_complete || false

  // Fetch Work Orders for this organization
  const workOrders = await listWorkOrdersForOrg(ctx.organization.id)
  const workOrderSummary = workOrders.map(wo => ({
    id: wo.id,
    workOrderNumber: wo.work_order_number,
    title: wo.title,
    workType: wo.work_type,
    status: wo.status,
    statusLabel: statusLabel(wo.status),
    desiredOutcome: wo.desired_outcome,
    createdAt: wo.created_at,
  }))

  return (
    <AdvisorDeskWorkspaceClient
      user={user}
      ctx={ctx}
      questions={questions || []}
      members={(members || []).map(m => ({
        id: m.id,
        role: m.role,
        userId: m.user_id,
        email: memberProfiles[m.user_id]?.email ?? '',
        fullName: memberProfiles[m.user_id]?.display_name ?? null,
      }))}
      teamSeatLimit={offer?.teamSeatLimit ?? 3}
      subscriptionStatus={subLink?.status ?? null}
      subscriptionMetadata={subLink?.metadata ?? {}}
      entitlementValidUntil={advisorEntitlement?.valid_until ?? null}
      entitlementStatus={advisorEntitlement?.effective_status ?? 'active'}
      products={products}
      memberToolsIncluded={memberToolsIncluded}
      watchlistItems={watchlistItems || []}
      schedulingLink={schedulingLinks?.[0] || null}
      onboardingSteps={onboardingSteps}
      onboardingComplete={onboardingComplete}
      workOrders={workOrderSummary}
    />
  )
}
