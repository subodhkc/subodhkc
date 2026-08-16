/**
 * Customer lifecycle state model.
 * Derives a unified commercial state from scattered tables (entitlements, onboarding, etc.)
 * States: PROSPECT → CHECKOUT_STARTED → ACTIVE_SETUP_REQUIRED → ACTIVE → PAYMENT_ISSUE / CANCEL_AT_PERIOD_END → READ_ONLY → ENDED
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export type CustomerState =
  | 'PROSPECT'
  | 'CHECKOUT_STARTED'
  | 'ACTIVE_SETUP_REQUIRED'
  | 'ACTIVE'
  | 'PAYMENT_ISSUE'
  | 'CANCEL_AT_PERIOD_END'
  | 'READ_ONLY'
  | 'ENDED'

export interface CustomerLifecycleRecord {
  organization_id: string
  offer_key: string | null
  state: CustomerState
  previous_state: string | null
  state_changed_at: string
  entitlement_active: boolean
  onboarding_complete: boolean
  has_included_products: boolean
  cancel_at_period_end: boolean
  period_end: string | null
  readonly_until: string | null
  last_interaction_at: string | null
}

/**
 * Compute the derived customer state from raw data.
 * This is the canonical state derivation logic.
 */
export function deriveCustomerState(input: {
  hasEntitlement: boolean
  entitlementStatus: string | null
  onboardingComplete: boolean
  hasIncludedProducts: boolean
  cancelAtPeriodEnd: boolean
  periodEnd: string | null
  isReadOnly: boolean
  readonlyUntil: string | null
}): CustomerState {
  // No entitlement at all
  if (!input.hasEntitlement || input.entitlementStatus === 'expired' || input.entitlementStatus === 'revoked') {
    // Check if in read-only window
    if (input.isReadOnly && input.readonlyUntil) {
      const now = new Date()
      const until = new Date(input.readonlyUntil)
      if (now < until) return 'READ_ONLY'
    }
    return 'ENDED'
  }

  // Entitlement exists but payment issue
  if (input.entitlementStatus === 'suspended' || input.entitlementStatus === 'past_due') {
    return 'PAYMENT_ISSUE'
  }

  // Active entitlement, cancel at period end
  if (input.cancelAtPeriodEnd) {
    return 'CANCEL_AT_PERIOD_END'
  }

  // Active entitlement but onboarding not complete
  if (input.entitlementStatus === 'active' && !input.onboardingComplete) {
    return 'ACTIVE_SETUP_REQUIRED'
  }

  // Fully active
  if (input.entitlementStatus === 'active') {
    return 'ACTIVE'
  }

  return 'PROSPECT'
}

/**
 * Upsert the customer lifecycle state for an organization.
 * Called by webhook and admin operations.
 */
export async function upsertCustomerLifecycleState(
  sc: ReturnType<typeof createClient>,
  organizationId: string,
  computed: {
    offer_key?: string | null
    state: CustomerState
    entitlement_active?: boolean
    onboarding_complete?: boolean
    has_included_products?: boolean
    cancel_at_period_end?: boolean
    period_end?: string | null
    readonly_until?: string | null
    last_interaction_at?: string | null
  }
): Promise<void> {
  // Fetch previous state for audit
  const { data: existing } = await sc
    .from('customer_lifecycle_states')
    .select('state')
    .eq('organization_id', organizationId)
    .single() as { data: any }

  const previousState = existing?.state || null
  const stateChanged = previousState !== computed.state

  await (sc
    .from('customer_lifecycle_states') as any)
    .upsert({
      organization_id: organizationId,
      offer_key: computed.offer_key || null,
      state: computed.state,
      previous_state: stateChanged ? previousState : undefined,
      state_changed_at: stateChanged ? new Date().toISOString() : undefined,
      entitlement_active: computed.entitlement_active ?? false,
      onboarding_complete: computed.onboarding_complete ?? false,
      has_included_products: computed.has_included_products ?? false,
      cancel_at_period_end: computed.cancel_at_period_end ?? false,
      period_end: computed.period_end || null,
      readonly_until: computed.readonly_until || null,
      last_interaction_at: computed.last_interaction_at || null,
    }, { onConflict: 'organization_id' })
}

/**
 * Compute and upsert the lifecycle state for an organization by querying all relevant tables.
 */
export async function computeAndUpsertLifecycleState(
  sc: ReturnType<typeof createClient>,
  organizationId: string
): Promise<CustomerState> {
  // Fetch entitlement
  const { data: entitlement } = await sc
    .from('organization_entitlements')
    .select('effective_status, source_metadata, valid_until, offering_key')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single() as { data: any }

  // Fetch onboarding
  const { data: onboarding } = await sc
    .from('fractional_onboarding')
    .select('status')
    .eq('organization_id', organizationId)
    .single() as { data: any }

  // Fetch included products
  const { data: products } = await sc
    .from('included_product_entitlements')
    .select('id')
    .eq('organization_id', organizationId)
    .limit(1) as { data: any }

  // Check cancel_at_period_end from Stripe metadata
  const sourceMeta = entitlement?.source_metadata as any
  const cancelAtPeriodEnd = sourceMeta?.cancel_at_period_end || false
  const periodEnd = entitlement?.valid_until || sourceMeta?.period_end || null

  // Check read-only window
  let isReadOnly = false
  let readonlyUntil: string | null = null
  if (periodEnd) {
    const periodEndDate = new Date(periodEnd)
    const thirtyDaysAfter = new Date(periodEndDate.getTime() + 30 * 24 * 60 * 60 * 1000)
    const now = new Date()
    if (now > periodEndDate && now < thirtyDaysAfter) {
      isReadOnly = true
      readonlyUntil = thirtyDaysAfter.toISOString()
    }
  }

  const state = deriveCustomerState({
    hasEntitlement: !!entitlement,
    entitlementStatus: entitlement?.effective_status || null,
    onboardingComplete: onboarding?.status === 'completed',
    hasIncludedProducts: (products?.length || 0) > 0,
    cancelAtPeriodEnd,
    periodEnd,
    isReadOnly,
    readonlyUntil,
  })

  await upsertCustomerLifecycleState(sc, organizationId, {
    offer_key: entitlement?.offering_key || null,
    state,
    entitlement_active: entitlement?.effective_status === 'active',
    onboarding_complete: onboarding?.status === 'completed',
    has_included_products: (products?.length || 0) > 0,
    cancel_at_period_end: cancelAtPeriodEnd,
    period_end: periodEnd,
    readonly_until: readonlyUntil,
  })

  return state
}
