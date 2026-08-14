import { createServiceClient } from '@/lib/supabase'
import { getOffer, type OfferKey } from '@/lib/commercial/offers'

/**
 * Check if an organization can add a new team member
 * based on the team seat limit of their active subscriptions.
 * Returns true if the seat is available, false if limit is reached.
 */
export async function checkTeamSeatAvailable(orgId: string): Promise<{
  available: boolean
  currentSeats: number
  limit: number | null
  offerKey: OfferKey | null
}> {
  const sc = createServiceClient()
  if (!sc) return { available: true, currentSeats: 0, limit: null, offerKey: null }

  // Get active members
  const { data: members } = await sc
    .from('organization_memberships')
    .select('id')
    .eq('organization_id', orgId)
    .eq('status', 'active')

  const currentSeats = members?.length ?? 0

  // Check for active entitlements with team seat limits
  const { data: entitlements } = await sc
    .from('organization_entitlements')
    .select(`
      status,
      valid_from,
      valid_until,
      offerings!inner(offering_key)
    `)
    .eq('organization_id', orgId)
    .eq('status', 'active')

  if (!entitlements || entitlements.length === 0) {
    return { available: true, currentSeats, limit: null, offerKey: null }
  }

  // Find the most restrictive seat limit among active entitlements
  let mostRestrictiveLimit: number | null = null
  let limitingOfferKey: OfferKey | null = null

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
    }
  }

  if (mostRestrictiveLimit === null) {
    return { available: true, currentSeats, limit: null, offerKey: null }
  }

  return {
    available: currentSeats < mostRestrictiveLimit,
    currentSeats,
    limit: mostRestrictiveLimit,
    offerKey: limitingOfferKey,
  }
}
