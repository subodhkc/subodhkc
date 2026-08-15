import { createServiceClient } from '@/lib/supabase'
import type { AuthenticatedUser } from '@/lib/auth/organization-resolver'
import type { OfferKey } from '@/lib/commercial/offers'

export interface PurchaseOrganization {
  id: string
  name: string
  slug: string
  status: string
  role: string
}

export interface PurchaseValidationError {
  code:
    | 'organization_required'
    | 'organization_not_found'
    | 'membership_missing'
    | 'insufficient_role'
    | 'organization_inactive'
    | 'service_unavailable'
  message: string
  status: number
}

export interface PurchaseValidationSuccess {
  organization: PurchaseOrganization
}

/**
 * Validate that an authenticated user can purchase for a specific organization.
 *
 * Checks:
 * 1. Organization exists
 * 2. Organization is active
 * 3. User has active membership
 * 4. User has sufficient role (owner or admin)
 *
 * Never trusts client-provided org state without server-side verification.
 */
export async function validateOrganizationForPurchase(
  user: AuthenticatedUser,
  organizationId: string
): Promise<PurchaseValidationSuccess | PurchaseValidationError> {
  const sc = createServiceClient()
  if (!sc) {
    return {
      code: 'service_unavailable',
      message: 'Service client unavailable',
      status: 500,
    }
  }

  // 1. Verify organization exists
  const { data: org, error: orgError } = await sc
    .from('organizations')
    .select('id, name, slug, status')
    .eq('id', organizationId)
    .single()

  if (orgError || !org) {
    return {
      code: 'organization_not_found',
      message: 'Organization not found',
      status: 404,
    }
  }

  // 2. Verify organization is active
  if (org.status !== 'active') {
    return {
      code: 'organization_inactive',
      message: 'Organization is not active',
      status: 403,
    }
  }

  // 3. Verify user has active membership with sufficient role
  const { data: membership } = await sc
    .from('organization_memberships')
    .select('role, status')
    .eq('organization_id', organizationId)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  if (!membership) {
    // Platform admins can purchase for any org
    if (!user.isPlatformAdmin) {
      return {
        code: 'membership_missing',
        message: 'You are not a member of this organization',
        status: 403,
      }
    }
  } else if (membership.role !== 'owner' && membership.role !== 'admin') {
    return {
      code: 'insufficient_role',
      message: 'Only organization owners or admins can make purchases',
      status: 403,
    }
  }

  return {
    organization: {
      id: org.id,
      name: org.name,
      slug: org.slug,
      status: org.status,
      role: membership?.role ?? 'platform_admin',
    },
  }
}

/**
 * Check if an organization already has an active entitlement for an offer.
 * Used to prevent duplicate subscriptions.
 */
export async function hasActiveEntitlement(
  organizationId: string,
  offerKey: OfferKey
): Promise<boolean> {
  const sc = createServiceClient()
  if (!sc) return false

  const { data: offering } = await sc
    .from('offerings')
    .select('id')
    .eq('offering_key', offerKey)
    .single()

  if (!offering) return false

  const { data: entitlement } = await sc
    .from('organization_entitlements')
    .select('id, status, valid_until')
    .eq('organization_id', organizationId)
    .eq('offering_id', offering.id)
    .eq('status', 'active')
    .single()

  if (!entitlement) return false

  // Check if expired by date
  if (entitlement.valid_until) {
    const expiry = new Date(entitlement.valid_until)
    if (expiry <= new Date()) return false
  }

  return true
}

/**
 * Get all organizations where the user has owner/admin role and org is active.
 * These are the organizations the user is authorized to purchase for.
 */
export async function getPurchaseEligibleOrganizations(
  user: AuthenticatedUser
): Promise<PurchaseOrganization[]> {
  const sc = createServiceClient()
  if (!sc) return []

  let query = sc
    .from('organization_memberships')
    .select(`
      role,
      organizations!inner(id, name, slug, status)
    `)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .in('role', ['owner', 'admin'])

  const { data: memberships } = await query as any

  const orgs: PurchaseOrganization[] = (memberships || [])
    .filter((m: any) => m.organizations?.status === 'active')
    .map((m: any) => ({
      id: m.organizations.id,
      name: m.organizations.name,
      slug: m.organizations.slug,
      status: m.organizations.status,
      role: m.role,
    }))

  // Platform admins can purchase for any org they're a member of
  if (user.isPlatformAdmin) {
    const { data: allMemberships } = await sc
      .from('organization_memberships')
      .select(`
        role,
        organizations!inner(id, name, slug, status)
      `)
      .eq('user_id', user.id)
      .eq('status', 'active') as any

    for (const m of allMemberships || []) {
      if (m.organizations?.status === 'active') {
        const exists = orgs.find(o => o.id === m.organizations.id)
        if (!exists) {
          orgs.push({
            id: m.organizations.id,
            name: m.organizations.name,
            slug: m.organizations.slug,
            status: m.organizations.status,
            role: m.role,
          })
        }
      }
    }
  }

  return orgs
}
