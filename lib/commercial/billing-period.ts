import { createServiceClient } from '@/lib/supabase'
import { getCurrentBillingPeriodKey } from '@/lib/commercial/offers'

/**
 * Resolve the current billing period for an organization's AI Advisor Desk subscription.
 *
 * Uses the actual Stripe subscription's current_period_start / current_period_end
 * when available. Falls back to calendar-month key if Stripe is not configured
 * or no subscription is found (e.g. platform admin without a subscription).
 *
 * The period key is formatted as `sub_{unix_timestamp}` so it uniquely identifies
 * a specific billing cycle, not a calendar month. This ensures annual subscribers
 * get distinct period keys for each monthly cycle.
 */
export async function getAdvisorBillingPeriod(orgId: string): Promise<{
  periodKey: string
  periodStart: string | null
  periodEnd: string | null
}> {
  const sc = createServiceClient()
  if (!sc) {
    return { periodKey: getCurrentBillingPeriodKey(), periodStart: null, periodEnd: null }
  }

  // Get the Stripe subscription ID for this org's advisor desk subscription
  // Uses per-offer key to support multiple subscriptions per organization
  const { data: link } = await sc
    .from('external_system_links')
    .select('external_id, metadata')
    .eq('organization_id', orgId)
    .eq('system_key', 'stripe_subscription:ai_advisor_desk')
    .eq('status', 'active')
    .single()

  // Fall back to legacy key for backward compatibility
  if (!link?.external_id) {
    const { data: legacyLink } = await sc
      .from('external_system_links')
      .select('external_id, metadata')
      .eq('organization_id', orgId)
      .eq('system_key', 'stripe_subscription')
      .eq('status', 'active')
      .single()

    if (!legacyLink?.external_id) {
      return { periodKey: getCurrentBillingPeriodKey(), periodStart: null, periodEnd: null }
    }

    return resolvePeriodFromSubscription(legacyLink.external_id)
  }

  return resolvePeriodFromSubscription(link.external_id)
}

async function resolvePeriodFromSubscription(subscriptionId: string): Promise<{
  periodKey: string
  periodStart: string | null
  periodEnd: string | null
}> {
  try {
    const { getStripe } = await import('@/lib/stripe/client')
    const stripe = getStripe()
    if (!stripe) {
      return { periodKey: getCurrentBillingPeriodKey(), periodStart: null, periodEnd: null }
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const periodStart = subscription.current_period_start
    const periodEnd = subscription.current_period_end

    return {
      periodKey: `sub_${periodStart}`,
      periodStart: new Date(periodStart * 1000).toISOString(),
      periodEnd: new Date(periodEnd * 1000).toISOString(),
    }
  } catch {
    // Stripe not configured or subscription not found — fall back to calendar month
    return { periodKey: getCurrentBillingPeriodKey(), periodStart: null, periodEnd: null }
  }
}
