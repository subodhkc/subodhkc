import { createServiceClient } from '@/lib/supabase'
import { getOffer, getServiceTerms, type OfferKey } from '@/lib/commercial/offers'

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
      // Terms identification metadata (NOT acceptance — acceptance is recorded at checkout.session.completed)
      terms_version: '2026-08',
      service_schedule_slug: getServiceTerms(offerKey)?.scheduleSlug ?? '',
      service_schedule_version: getServiceTerms(offerKey)?.version ?? '',
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
    consent_collection: {
      terms_of_service: 'required',
    },
  })

  // NOTE: Terms acceptance is NOT recorded here.
  // A created or abandoned checkout must never be recorded as accepted terms.
  // Acceptance is recorded in the webhook handler at checkout.session.completed
  // only after verifying session.consent.terms_of_service === 'accepted'.

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
 * Uses per-offer system keys to support multiple subscriptions per organization.
 */
export async function storeStripeSubscriptionId(
  orgId: string,
  subscriptionId: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  const sc = createServiceClient()
  if (!sc) return

  const offerKey = (metadata?.offer_key as string) || 'default'
  const systemKey = `stripe_subscription:${offerKey}`

  await sc
    .from('external_system_links')
    .upsert(
      {
        organization_id: orgId,
        system_key: systemKey,
        external_id: subscriptionId,
        status: 'active',
        metadata: metadata ?? {},
      },
      { onConflict: 'organization_id,system_key' }
    )
}

/**
 * Get a Stripe subscription ID for a specific offer within an organization.
 * Falls back to legacy generic stripe_subscription key if per-offer key not found.
 */
export async function getStripeSubscriptionId(
  orgId: string,
  offerKey?: string
): Promise<string | null> {
  const sc = createServiceClient()
  if (!sc) return null

  // Try per-offer key first if offerKey is provided
  if (offerKey) {
    const { data } = await sc
      .from('external_system_links')
      .select('external_id')
      .eq('organization_id', orgId)
      .eq('system_key', `stripe_subscription:${offerKey}`)
      .eq('status', 'active')
      .single()

    if (data?.external_id) return data.external_id
  }

  // Fall back to legacy generic key
  const { data: legacy } = await sc
    .from('external_system_links')
    .select('external_id')
    .eq('organization_id', orgId)
    .eq('system_key', 'stripe_subscription')
    .eq('status', 'active')
    .single()

  return legacy?.external_id ?? null
}

/**
 * Record terms acceptance at checkout completion.
 * Called ONLY from the webhook handler at checkout.session.completed
 * after verifying session.consent.terms_of_service === 'accepted'.
 *
 * Stores the terms version, service schedule version, checkout session ID,
 * Stripe customer/subscription IDs, and actual acceptance timestamp.
 * Idempotent — duplicate webhook deliveries will not create duplicate records
 * due to the unique constraint on checkout_session_id.
 */
export async function recordTermsAcceptance(opts: {
  offerKey: OfferKey
  termsVersion: string
  serviceScheduleSlug: string
  serviceScheduleVersion: string
  checkoutSessionId: string
  userId?: string
  organizationId?: string
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  billingPeriod?: string
  consentSource?: string
}): Promise<void> {
  const sc = createServiceClient()
  if (!sc) return

  const {
    offerKey,
    termsVersion,
    serviceScheduleSlug,
    serviceScheduleVersion,
    checkoutSessionId,
    userId,
    organizationId,
    stripeCustomerId,
    stripeSubscriptionId,
    billingPeriod,
    consentSource = 'stripe_checkout',
  } = opts

  try {
    await sc
      .from('terms_acceptance_records')
      .insert({
        offer_key: offerKey,
        terms_version: termsVersion,
        service_schedule_slug: serviceScheduleSlug,
        service_schedule_version: serviceScheduleVersion,
        checkout_session_id: checkoutSessionId,
        user_id: userId || null,
        organization_id: organizationId || null,
        stripe_customer_id: stripeCustomerId || null,
        stripe_subscription_id: stripeSubscriptionId || null,
        billing_period: billingPeriod || null,
        consent_source: consentSource,
        accepted_at: new Date().toISOString(),
      })
  } catch (err) {
    // Unique constraint violation on checkout_session_id means duplicate webhook — safe to ignore
    const errMsg = (err as Error).message || ''
    if (errMsg.includes('duplicate') || errMsg.includes('unique')) {
      console.log('[terms_acceptance] Duplicate webhook delivery for session', checkoutSessionId, '— ignoring')
      return
    }
    console.error('[terms_acceptance] Failed to record acceptance:', err)
  }
}
