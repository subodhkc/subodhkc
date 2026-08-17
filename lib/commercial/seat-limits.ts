import { createServiceClient } from '@/lib/supabase'
import { getOffer, type OfferKey } from '@/lib/commercial/offers'

/**
 * Check if an organization can add a new team member
 * based on the team seat limit of their active subscriptions.
 *
 * IMPORTANT: Organization membership and Advisor service seats are DISTINCT.
 * - Organization members are people in the org (unbounded by commercial seats).
 * - Service seats are members explicitly assigned to an offering via member_offering_roles.
 *
 * This function counts service seats (member_offering_roles), NOT all org members.
 * Adding an org member does NOT consume a service seat unless explicitly assigned.
 */
export async function checkTeamSeatAvailable(orgId: string): Promise<{
  available: boolean
  currentSeats: number
  limit: number | null
  offerKey: OfferKey | null
}> {
  const sc = createServiceClient()
  if (!sc) return { available: true, currentSeats: 0, limit: null, offerKey: null }

  // Check for active entitlements with team seat limits
  const { data: entitlements } = await sc
    .from('organization_entitlements')
    .select(`
      status,
      valid_from,
      valid_until,
      offering_id,
      offerings!inner(offering_key)
    `)
    .eq('organization_id', orgId)
    .eq('status', 'active')

  if (!entitlements || entitlements.length === 0) {
    return { available: true, currentSeats: 0, limit: null, offerKey: null }
  }

  // Find the most restrictive seat limit among active entitlements
  let mostRestrictiveLimit: number | null = null
  let limitingOfferKey: OfferKey | null = null
  let limitingOfferingId: string | null = null

  for (const ent of entitlements as any[]) {
    const offerKey = ent.offerings.offering_key as OfferKey
    const offer = getOffer(offerKey)
    if (!offer || offer.teamSeatLimit === null) continue

    // Check entitlement is currently valid
    const now = new Date()
    if (ent.valid_from && new Date(ent.valid_from) > now) continue
    if (ent.valid_until && new Date(ent.valid_until) <= now) continue

    if (mostRestrictiveLimit === null || offer.teamSeatLimit < mostRestrictiveLimit) {
      mostRestrictiveLimit = offer.teamSeatLimit
      limitingOfferKey = offerKey
      limitingOfferingId = ent.offering_id
    }
  }

  if (mostRestrictiveLimit === null || !limitingOfferingId) {
    return { available: true, currentSeats: 0, limit: null, offerKey: null }
  }

  // Count service seats: member_offering_roles for this offering
  const { data: serviceSeats } = await sc
    .from('member_offering_roles')
    .select('id')
    .eq('organization_id', orgId)
    .eq('offering_id', limitingOfferingId)
    .eq('status', 'active')

  const currentSeats = serviceSeats?.length ?? 0

  return {
    available: currentSeats < mostRestrictiveLimit,
    currentSeats,
    limit: mostRestrictiveLimit,
    offerKey: limitingOfferKey,
  }
}

/**
 * Count active service seats for a specific offering.
 * This is distinct from org membership count.
 */
export async function countServiceSeats(orgId: string, offeringKey: OfferKey): Promise<{
  count: number
  limit: number | null
  available: boolean
}> {
  const sc = createServiceClient()
  if (!sc) return { count: 0, limit: null, available: true }

  const offer = getOffer(offeringKey)
  if (!offer) return { count: 0, limit: null, available: true }

  const { data: offering } = await sc
    .from('offerings')
    .select('id')
    .eq('offering_key', offeringKey)
    .single()

  if (!offering) return { count: 0, limit: offer.teamSeatLimit, available: true }

  const { data: seats } = await sc
    .from('member_offering_roles')
    .select('id')
    .eq('organization_id', orgId)
    .eq('offering_id', offering.id)
    .eq('status', 'active')

  const count = seats?.length ?? 0
  const limit = offer.teamSeatLimit

  return {
    count,
    limit,
    available: limit === null ? true : count < limit,
  }
}

/**
 * Assign a user to a service seat for an offering.
 * Server-authorized — enforces seat limit.
 */
export async function assignServiceSeat(opts: {
  orgId: string
  userId: string
  offeringKey: OfferKey
  role?: string
}): Promise<{ success: boolean; error?: string }> {
  const sc = createServiceClient()
  if (!sc) return { success: false, error: 'Service client unavailable' }

  const { orgId, userId, offeringKey, role = 'member' } = opts

  // Check seat availability
  const seatCheck = await countServiceSeats(orgId, offeringKey)
  if (!seatCheck.available) {
    return { success: false, error: `Seat limit reached (${seatCheck.count}/${seatCheck.limit})` }
  }

  const { data: offering } = await sc
    .from('offerings')
    .select('id')
    .eq('offering_key', offeringKey)
    .single()

  if (!offering) return { success: false, error: 'Offering not found' }

  const { error } = await sc
    .from('member_offering_roles')
    .upsert(
      {
        organization_id: orgId,
        offering_id: offering.id,
        user_id: userId,
        role,
        status: 'active',
      },
      { onConflict: 'organization_id,offering_id,user_id' }
    )

  if (error) return { success: false, error: error.message }
  return { success: true }
}

/**
 * Remove a user from a service seat for an offering.
 * Server-authorized.
 */
export async function removeServiceSeat(opts: {
  orgId: string
  userId: string
  offeringKey: OfferKey
}): Promise<{ success: boolean; error?: string }> {
  const sc = createServiceClient()
  if (!sc) return { success: false, error: 'Service client unavailable' }

  const { orgId, userId, offeringKey } = opts

  const { data: offering } = await sc
    .from('offerings')
    .select('id')
    .eq('offering_key', offeringKey)
    .single()

  if (!offering) return { success: false, error: 'Offering not found' }

  const { error } = await sc
    .from('member_offering_roles')
    .update({ status: 'inactive' })
    .eq('organization_id', orgId)
    .eq('offering_id', offering.id)
    .eq('user_id', userId)

  if (error) return { success: false, error: error.message }
  return { success: true }
}
