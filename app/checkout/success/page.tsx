import { redirect } from 'next/navigation'
import { getAuthenticatedUser, getUserOrganizations } from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'
import { getOffer, type OfferKey } from '@/lib/commercial/offers'
import CheckoutSuccessClient from './CheckoutSuccessClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const metadata = {
  title: 'Checkout Complete | Subodh KC',
  description: 'Your purchase is being confirmed.',
  robots: { index: false, follow: false },
}

const OFFER_WORKSPACE_ROUTES: Record<string, string> = {
  ai_advisor_desk: 'advisor-desk',
  fractional_ai_advisor: 'advisory',
  ai_automation_blueprint: 'blueprint',
  ai_security_compliance: 'security-review',
  saas_security_review: 'security-review',
  managed_voice: 'managed-voice',
}

const OFFER_DISPLAY_NAMES: Record<string, string> = {
  ai_advisor_desk: 'AI Advisor for Business',
  fractional_ai_advisor: 'Fractional AI Advisor',
  ai_automation_blueprint: 'AI Work Order',
  ai_security_compliance: 'AI Security & Compliance Review',
  saas_security_review: 'SaaS & AI Security Review',
  managed_voice: 'Managed AI Voice',
}

async function verifySession(sessionId: string) {
  const { getStripe } = await import('@/lib/stripe/client')
  const stripe = getStripe()
  if (!stripe) return null

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer'],
    })
    return session
  } catch {
    return null
  }
}

async function waitForEntitlement(orgId: string, offerKey: string, maxAttempts = 5): Promise<boolean> {
  const sc = createServiceClient()
  if (!sc) return false

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const { data: offering } = await sc
      .from('offerings')
      .select('id')
      .eq('offering_key', offerKey)
      .single()

    if (offering) {
      const { data: entitlement } = await sc
        .from('organization_entitlements')
        .select('id, status')
        .eq('organization_id', orgId)
        .eq('offering_id', offering.id)
        .eq('status', 'active')
        .single()

      if (entitlement) return true
    }

    // Wait 1 second before retrying (webhook may not have processed yet)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  return false
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  if (!session_id) {
    redirect('/')
  }

  const user = await getAuthenticatedUser()
  if (!user) {
    redirect(`/login?next=/checkout/success?session_id=${session_id}`)
  }

  const session = await verifySession(session_id)
  if (!session) {
    return (
      <CheckoutSuccessClient
        status="error"
        offerName=""
        workspaceUrl=""
        message="We could not verify your checkout session. If you were charged, please contact support."
      />
    )
  }

  const offerKey = session.metadata?.offer_key as OfferKey | undefined
  if (!offerKey) {
    return (
      <CheckoutSuccessClient
        status="error"
        offerName=""
        workspaceUrl=""
        message="Checkout session is missing offer information. Please contact support."
      />
    )
  }

  // Skip events from other apps
  const appSource = session.metadata?.app_source
  if (appSource && appSource !== 'subodhkc') {
    redirect('/')
  }

  const offer = getOffer(offerKey)
  const offerName = OFFER_DISPLAY_NAMES[offerKey] || offer?.displayName || offerKey

  // Find the organization from session metadata
  const orgId = session.metadata?.organization_id as string | undefined
  if (!orgId) {
    return (
      <CheckoutSuccessClient
        status="error"
        offerName={offerName}
        workspaceUrl=""
        message="Checkout session is missing organization information. Please contact support."
      />
    )
  }

  // Verify the user belongs to this organization
  const userOrgs = await getUserOrganizations(user)
  const org = userOrgs.find(o => o.id === orgId)
  if (!org) {
    return (
      <CheckoutSuccessClient
        status="error"
        offerName={offerName}
        workspaceUrl=""
        message="You do not have access to the organization associated with this purchase."
      />
    )
  }

  // Wait for webhook to process entitlement
  const entitlementReady = await waitForEntitlement(orgId, offerKey)

  const workspaceSlug = OFFER_WORKSPACE_ROUTES[offerKey] || ''
  const workspaceUrl = workspaceSlug ? `/app/${org.slug}/${workspaceSlug}` : `/app/${org.slug}`

  if (!entitlementReady) {
    // Webhook may have failed or is delayed. Show a pending state.
    return (
      <CheckoutSuccessClient
        status="pending"
        offerName={offerName}
        workspaceUrl={workspaceUrl}
        message="Your payment was successful. We are confirming your access. This usually takes a few seconds. You can continue to your workspace below."
        offerKey={offerKey}
        orgSlug={org.slug}
      />
    )
  }

  return (
    <CheckoutSuccessClient
      status="success"
      offerName={offerName}
      workspaceUrl={workspaceUrl}
      message=""
      offerKey={offerKey}
      orgSlug={org.slug}
    />
  )
}
