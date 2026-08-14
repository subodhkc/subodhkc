import { createServiceClient } from '@/lib/supabase'
import { getOffer, type OfferKey } from '@/lib/commercial/offers'

/**
 * Check if a Stripe webhook event has already been processed.
 * Uses webhook_idempotency table for deduplication.
 */
export async function isEventProcessed(eventId: string): Promise<boolean> {
  const sc = createServiceClient()
  if (!sc) return false

  const { data } = await sc
    .from('webhook_idempotency')
    .select('event_id')
    .eq('event_id', eventId)
    .single()

  return !!data
}

/**
 * Mark a Stripe webhook event as processed.
 */
export async function markEventProcessed(eventId: string): Promise<void> {
  const sc = createServiceClient()
  if (!sc) return

  await sc
    .from('webhook_idempotency')
    .insert({ event_id: eventId })
}

/**
 * Resolve or create an organization for a Stripe customer.
 * Uses customer email to find existing user → org, or creates new.
 */
export async function resolveOrCreateOrganization(opts: {
  customerEmail: string
  customerName?: string
  customerId: string
  userId?: string
}): Promise<{ orgId: string; orgSlug: string; created: boolean } | { error: string }> {
  const sc = createServiceClient()
  if (!sc) return { error: 'Service client unavailable' }

  const { customerEmail, customerName, customerId, userId } = opts

  // If userId provided, find their org
  if (userId) {
    const { data: membership } = await sc
      .from('organization_memberships')
      .select('organization_id, organizations!inner(id, slug)')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single() as any

    const org = membership?.organizations?.[0] ?? membership?.organizations
    if (org?.id) {
      return {
        orgId: org.id,
        orgSlug: org.slug,
        created: false,
      }
    }
  }

  // Look up user by email via profiles table
  const { data: profile } = await sc
    .from('profiles')
    .select('id')
    .eq('email', customerEmail.toLowerCase())
    .single()

  if (profile?.id) {
    const foundUserId = profile.id

    // Check if user already has an org
    const { data: membership } = await sc
      .from('organization_memberships')
      .select('organization_id, organizations!inner(id, slug)')
      .eq('user_id', foundUserId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single() as any

    const org = membership?.organizations?.[0] ?? membership?.organizations
    if (org?.id) {
      // Store Stripe customer ID
      await sc
        .from('external_system_links')
        .upsert(
          {
            organization_id: org.id,
            system_key: 'stripe_customer',
            external_id: customerId,
            status: 'active',
            metadata: {},
          },
          { onConflict: 'organization_id,system_key' }
        )

      return {
        orgId: org.id,
        orgSlug: org.slug,
        created: false,
      }
    }
  }

  // Create new organization
  const baseSlug = (customerName || customerEmail.split('@')[0] || 'org')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 30)

  // Ensure unique slug
  let slug = baseSlug
  let suffix = 1
  while (true) {
    const { data: existing } = await sc
      .from('organizations')
      .select('id')
      .eq('slug', slug)
      .single()
    if (!existing) break
    slug = `${baseSlug}-${suffix++}`
  }

  const resolvedUserId = userId || profile?.id

  const { data: org, error: orgError } = await sc
    .from('organizations')
    .insert({
      name: customerName || customerEmail.split('@')[0],
      slug,
      organization_kind: 'business',
      status: 'active',
      created_by: resolvedUserId || null,
    })
    .select('id, slug')
    .single()

  if (orgError || !org) {
    return { error: `Failed to create organization: ${orgError?.message}` }
  }

  // Add user as owner if we have a user ID
  if (resolvedUserId) {
    await sc
      .from('organization_memberships')
      .insert({
        organization_id: org.id,
        user_id: resolvedUserId,
        role: 'owner',
        status: 'active',
      })
  }

  // Store Stripe customer ID
  await sc
    .from('external_system_links')
    .upsert(
      {
        organization_id: org.id,
        system_key: 'stripe_customer',
        external_id: customerId,
        status: 'active',
        metadata: {},
      },
      { onConflict: 'organization_id,system_key' }
    )

  return { orgId: org.id, orgSlug: org.slug, created: true }
}

/**
 * Activate an entitlement for an organization based on the offer key.
 * Creates offering_role for the user if userId is provided.
 */
export async function activateEntitlement(opts: {
  orgId: string
  offerKey: OfferKey
  userId?: string
  sourceType?: string
  validFrom?: string
  validUntil?: string | null
  metadata?: Record<string, unknown>
}): Promise<{ entitlementId: string } | { error: string }> {
  const sc = createServiceClient()
  if (!sc) return { error: 'Service client unavailable' }

  const { orgId, offerKey, userId, sourceType, validFrom, validUntil, metadata } = opts

  // Find the offering
  const { data: offering } = await sc
    .from('offerings')
    .select('id')
    .eq('offering_key', offerKey)
    .single()

  if (!offering) return { error: `Offering '${offerKey}' not found` }

  // Check for existing entitlement
  const { data: existing } = await sc
    .from('organization_entitlements')
    .select('id, status')
    .eq('organization_id', orgId)
    .eq('offering_id', offering.id)
    .single()

  if (existing) {
    // Reactivate if expired/suspended
    const { data: updated, error } = await sc
      .from('organization_entitlements')
      .update({
        status: 'active',
        source_type: sourceType || 'subscription',
        valid_from: validFrom || new Date().toISOString(),
        valid_until: validUntil ?? null,
        metadata: metadata ?? {},
      })
      .eq('id', existing.id)
      .select('id')
      .single()

    if (error) return { error: error.message }

    // Ensure member_offering_role for the user
    if (userId) {
      await sc
        .from('member_offering_roles')
        .upsert(
          {
            organization_id: orgId,
            offering_id: offering.id,
            user_id: userId,
            role: 'admin',
            status: 'active',
          },
          { onConflict: 'organization_id,offering_id,user_id' }
        )
    }

    return { entitlementId: updated.id }
  }

  // Create new entitlement
  const { data: entitlement, error: entError } = await sc
    .from('organization_entitlements')
    .insert({
      organization_id: orgId,
      offering_id: offering.id,
      status: 'active',
      source_type: sourceType || 'subscription',
      valid_from: validFrom || new Date().toISOString(),
      valid_until: validUntil ?? null,
      metadata: metadata ?? {},
    })
    .select('id')
    .single()

  if (entError || !entitlement) {
    return { error: entError?.message || 'Failed to create entitlement' }
  }

  // Create member_offering_role for the user
  if (userId) {
    await sc
      .from('member_offering_roles')
      .upsert(
        {
          organization_id: orgId,
          offering_id: offering.id,
          user_id: userId,
          role: 'admin',
          status: 'active',
        },
        { onConflict: 'organization_id,offering_id,user_id' }
      )
  }

  return { entitlementId: entitlement.id }
}

/**
 * Deactivate an entitlement (subscription cancelled/expired).
 */
export async function deactivateEntitlement(opts: {
  orgId: string
  offerKey: OfferKey
  reason: string
  validUntil?: string | null
}): Promise<{ success: boolean; error?: string }> {
  const sc = createServiceClient()
  if (!sc) return { success: false, error: 'Service client unavailable' }

  const { orgId, offerKey, reason, validUntil } = opts

  const { data: offering } = await sc
    .from('offerings')
    .select('id')
    .eq('offering_key', offerKey)
    .single()

  if (!offering) return { success: false, error: 'Offering not found' }

  const { error } = await sc
    .from('organization_entitlements')
    .update({
      status: 'expired',
      valid_until: validUntil ?? new Date().toISOString(),
    })
    .eq('organization_id', orgId)
    .eq('offering_id', offering.id)

  if (error) return { success: false, error: error.message }

  return { success: true }
}

/**
 * Record a payment in the payments table.
 */
export async function recordPayment(opts: {
  orgId: string
  offerKey: OfferKey
  stripePaymentIntentId?: string
  stripeChargeId?: string
  amountCents: number
  currency: string
  status: string
  type: 'subscription' | 'one_time'
  engagementId?: string
  metadata?: Record<string, unknown>
}): Promise<{ paymentId: string } | { error: string }> {
  const sc = createServiceClient()
  if (!sc) return { error: 'Service client unavailable' }

  const { data, error } = await sc
    .from('payments')
    .insert({
      organization_id: opts.orgId,
      offer_key: opts.offerKey,
      stripe_payment_intent_id: opts.stripePaymentIntentId ?? null,
      stripe_charge_id: opts.stripeChargeId ?? null,
      amount_cents: opts.amountCents,
      currency: opts.currency,
      status: opts.status,
      type: opts.type,
      engagement_id: opts.engagementId ?? null,
      metadata: opts.metadata ?? {},
    })
    .select('id')
    .single()

  if (error) return { error: error.message }

  return { paymentId: data.id }
}
