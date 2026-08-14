import { createServiceClient } from '@/lib/supabase'
import { getOffer, type OfferKey } from '@/lib/commercial/offers'

/**
 * Create a Stripe Checkout Session for a subscription offer.
 */
export async function createSubscriptionCheckout(opts: {
  offerKey: OfferKey
  period: 'monthly' | 'annual'
  successUrl: string
  cancelUrl: string
  customerEmail?: string
  metadata?: Record<string, string>
}): Promise<{ sessionId: string; url: string } | { error: string }> {
  const { getStripe } = await import('@/lib/stripe/client')
  const stripe = getStripe()
  if (!stripe) return { error: 'Stripe not configured' }

  const { offerKey, period, successUrl, cancelUrl, customerEmail, metadata } = opts
  const offer = getOffer(offerKey)
  if (!offer) return { error: 'Invalid offer' }

  const { getStripePriceId } = await import('@/lib/commercial/offers')
  const priceId = getStripePriceId(offerKey, period)
  if (!priceId) return { error: 'Price ID not configured for this offer/period' }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: customerEmail,
    metadata: {
      offer_key: offerKey,
      billing_period: period,
      app_source: 'subodhkc',
      ...metadata,
    },
    subscription_data: {
      metadata: {
        offer_key: offerKey,
        billing_period: period,
        app_source: 'subodhkc',
        ...metadata,
      },
    },
  })

  return { sessionId: session.id, url: session.url! }
}

/**
 * Create a Stripe Checkout Session for a one-time purchase.
 */
export async function createOneTimeCheckout(opts: {
  offerKey: OfferKey
  successUrl: string
  cancelUrl: string
  customerEmail?: string
  metadata?: Record<string, string>
}): Promise<{ sessionId: string; url: string } | { error: string }> {
  const { getStripe } = await import('@/lib/stripe/client')
  const stripe = getStripe()
  if (!stripe) return { error: 'Stripe not configured' }

  const { offerKey, successUrl, cancelUrl, customerEmail, metadata } = opts
  const offer = getOffer(offerKey)
  if (!offer) return { error: 'Invalid offer' }

  const { getStripePriceId } = await import('@/lib/commercial/offers')
  const priceId = getStripePriceId(offerKey, 'one_time')
  if (!priceId) return { error: 'Price ID not configured for this offer' }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: customerEmail,
    metadata: {
      offer_key: offerKey,
      app_source: 'subodhkc',
      ...metadata,
    },
    payment_intent_data: {
      metadata: {
        offer_key: offerKey,
        app_source: 'subodhkc',
        ...metadata,
      },
    },
  })

  return { sessionId: session.id, url: session.url! }
}

/**
 * Cancel a Stripe subscription at the end of the current billing period.
 */
export async function cancelSubscriptionAtPeriodEnd(
  subscriptionId: string
): Promise<{ success: boolean; error?: string }> {
  const { getStripe } = await import('@/lib/stripe/client')
  const stripe = getStripe()
  if (!stripe) return { success: false, error: 'Stripe not configured' }

  try {
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

/**
 * Resolve the Stripe customer ID for an organization from external_system_links.
 */
export async function getStripeCustomerId(orgId: string): Promise<string | null> {
  const sc = createServiceClient()
  if (!sc) return null

  const { data } = await sc
    .from('external_system_links')
    .select('external_id')
    .eq('organization_id', orgId)
    .eq('system_key', 'stripe_customer')
    .eq('status', 'active')
    .single()

  return data?.external_id ?? null
}

/**
 * Store a Stripe customer ID for an organization in external_system_links.
 */
export async function storeStripeCustomerId(orgId: string, customerId: string): Promise<void> {
  const sc = createServiceClient()
  if (!sc) return

  await sc
    .from('external_system_links')
    .upsert(
      {
        organization_id: orgId,
        system_key: 'stripe_customer',
        external_id: customerId,
        status: 'active',
        metadata: {},
      },
      { onConflict: 'organization_id,system_key' }
    )
}

/**
 * Store a Stripe subscription ID for an organization in external_system_links.
 */
export async function storeStripeSubscriptionId(
  orgId: string,
  subscriptionId: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  const sc = createServiceClient()
  if (!sc) return

  await sc
    .from('external_system_links')
    .upsert(
      {
        organization_id: orgId,
        system_key: 'stripe_subscription',
        external_id: subscriptionId,
        status: 'active',
        metadata: metadata ?? {},
      },
      { onConflict: 'organization_id,system_key' }
    )
}

/**
 * Get the Stripe subscription ID for an organization.
 */
export async function getStripeSubscriptionId(orgId: string): Promise<string | null> {
  const sc = createServiceClient()
  if (!sc) return null

  const { data } = await sc
    .from('external_system_links')
    .select('external_id')
    .eq('organization_id', orgId)
    .eq('system_key', 'stripe_subscription')
    .eq('status', 'active')
    .single()

  return data?.external_id ?? null
}
