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

    // Fetch product access requests for HAIEC, KestrelVoice, etc.
    const { data: productRequests } = await serviceClient
      .from('product_access_requests')
      .select('id, offering_key, status, created_at')
      .eq('organization_id', ctx.organization.id)
      .order('created_at', { ascending: false })

    const activeOfferingKeys = ctx.entitlements
      .filter(e => e.effective_status === 'active')
      .map(e => e.offering_key)

    products = [
      {
        offeringKey: 'haiec',
        name: 'HAIEC',
        description: 'AI compliance and governance platform — evidence-first frameworks for behavioral AI governance.',
        externalUrl: 'https://www.haiec.com',
        learnMoreHref: '/solutions/haiec',
        hasEntitlement: activeOfferingKeys.includes('haiec'),
        requestStatus: productRequests?.find(r => r.offering_key === 'haiec')?.status || null,
        requestId: productRequests?.find(r => r.offering_key === 'haiec')?.id || null,
      },
      {
        offeringKey: 'kestrel',
        name: 'KestrelVoice',
        description: 'AI voice receptionist platform — answers every call, books appointments, runs your front desk 24/7.',
        externalUrl: 'https://www.kestrelvoice.com',
        learnMoreHref: '/solutions/kestrelvoice',
        hasEntitlement: activeOfferingKeys.includes('kestrel'),
        requestStatus: productRequests?.find(r => r.offering_key === 'kestrel')?.status || null,
        requestId: productRequests?.find(r => r.offering_key === 'kestrel')?.id || null,
      },
    ]
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
    />
  )
}
