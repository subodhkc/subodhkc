import { createServiceClient, getCurrentUser } from '@/lib/supabase'

export type OrganizationRole = 'owner' | 'admin' | 'member'
export type OfferingRole = 'admin' | 'user' | 'viewer'
export type EntitlementStatus = 'active' | 'suspended' | 'expired' | 'revoked' | 'pending'

export interface OrganizationContext {
  organization: {
    id: string
    name: string
    slug: string
    organization_kind: string
    status: string
  }
  membership: {
    id: string
    role: OrganizationRole
    status: string
  } | null
  organizationRole: OrganizationRole | null
  isPlatformAdmin: boolean
  entitlements: Array<{
    id: string
    offering_key: string
    offering_name: string
    status: string
    effective_status: EntitlementStatus
    valid_from: string
    valid_until: string | null
  }>
  offeringRoles: Array<{
    id: string
    offering_key: string
    offering_name: string
    role: OfferingRole
    status: string
  }>
}

export interface AuthenticatedUser {
  id: string
  email: string | null
  displayName: string | null
  avatarUrl: string | null
  isPlatformAdmin: boolean
}

export type AuthErrorCode =
  | 'unauthenticated'
  | 'unauthorized'
  | 'organization_not_found'
  | 'membership_missing'
  | 'entitlement_missing'
  | 'offering_role_missing'
  | 'invitation_invalid'
  | 'invitation_expired'
  | 'organization_suspended'

export class AuthError extends Error {
  code: AuthErrorCode
  constructor(code: AuthErrorCode, message: string) {
    super(message)
    this.code = code
    this.name = 'AuthError'
  }
}

/**
 * Get the authenticated user with profile data and platform admin status.
 * Returns null if not authenticated.
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const user = await getCurrentUser()
  if (!user) return null

  const serviceClient = createServiceClient()
  if (!serviceClient) return null

  // Get profile
  const { data: profile } = await serviceClient
    .from('profiles')
    .select('display_name, avatar_url')
    .eq('id', user.id)
    .single()

  // Check platform admin
  const { data: platformRole } = await serviceClient
    .from('platform_user_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('role', 'platform_admin')
    .single()

  return {
    id: user.id,
    email: user.email ?? null,
    displayName: profile?.display_name ?? null,
    avatarUrl: profile?.avatar_url ?? null,
    isPlatformAdmin: !!platformRole,
  }
}

/**
 * Require an authenticated user. Throws AuthError if not authenticated.
 */
export async function requireAuth(): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser()
  if (!user) {
    throw new AuthError('unauthenticated', 'Authentication required')
  }
  return user
}

/**
 * Require a platform admin. Throws AuthError if not authenticated or not admin.
 */
export async function requirePlatformAdmin(): Promise<AuthenticatedUser> {
  const user = await requireAuth()
  if (!user.isPlatformAdmin) {
    throw new AuthError('unauthorized', 'Platform admin access required')
  }
  return user
}

/**
 * Resolve the full organization context for an authenticated user.
 * This is the canonical server-side organization resolver.
 * It verifies membership independently - never trusts client-provided org state.
 *
 * @param user - The authenticated user
 * @param orgSlug - The organization slug from the URL/route
 * @returns OrganizationContext with verified membership, entitlements, and offering roles
 * @throws AuthError if organization not found or user is not a member (and not platform admin)
 */
export async function resolveOrganizationContext(
  user: AuthenticatedUser,
  orgSlug: string
): Promise<OrganizationContext> {
  const serviceClient = createServiceClient()
  if (!serviceClient) {
    throw new AuthError('unauthorized', 'Service client not available')
  }

  // 1. Resolve organization by slug
  const { data: org, error: orgError } = await serviceClient
    .from('organizations')
    .select('id, name, slug, organization_kind, status')
    .eq('slug', orgSlug)
    .single()

  if (orgError || !org) {
    throw new AuthError('organization_not_found', `Organization '${orgSlug}' not found`)
  }

  // 2. Check if organization is suspended
  if (org.status === 'suspended' && !user.isPlatformAdmin) {
    throw new AuthError('organization_suspended', 'Organization is suspended')
  }

  // 3. Verify membership (independently of client state)
  const { data: membership } = await serviceClient
    .from('organization_memberships')
    .select('id, role, status')
    .eq('organization_id', org.id)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  // Platform admins can access without membership
  if (!membership && !user.isPlatformAdmin) {
    throw new AuthError('membership_missing', 'You are not a member of this organization')
  }

  // 4. Get entitlements for this organization
  const { data: entitlements } = await serviceClient
    .from('organization_entitlements')
    .select(`
      id,
      status,
      valid_from,
      valid_until,
      offerings!inner(offering_key, name)
    `)
    .eq('organization_id', org.id)

  // 5. Get offering roles for this user in this organization
  const { data: offeringRoles } = await serviceClient
    .from('member_offering_roles')
    .select(`
      id,
      role,
      status,
      offerings!inner(offering_key, name)
    `)
    .eq('organization_id', org.id)
    .eq('user_id', user.id)
    .eq('status', 'active')

  // 6. Compute effective entitlement status
  const now = new Date()
  const processedEntitlements = (entitlements || []).map((e: any) => {
    let effectiveStatus = e.status
    if (e.status === 'active') {
      if (e.valid_until && new Date(e.valid_until) <= now) {
        effectiveStatus = 'expired'
      } else if (e.valid_from && new Date(e.valid_from) > now) {
        effectiveStatus = 'pending'
      }
    }
    return {
      id: e.id,
      offering_key: e.offerings.offering_key,
      offering_name: e.offerings.name,
      status: e.status,
      effective_status: effectiveStatus as EntitlementStatus,
      valid_from: e.valid_from,
      valid_until: e.valid_until,
    }
  })

  return {
    organization: {
      id: org.id,
      name: org.name,
      slug: org.slug,
      organization_kind: org.organization_kind,
      status: org.status,
    },
    membership: membership ? {
      id: membership.id,
      role: membership.role as OrganizationRole,
      status: membership.status,
    } : null,
    organizationRole: (membership?.role as OrganizationRole) ?? null,
    isPlatformAdmin: user.isPlatformAdmin,
    entitlements: processedEntitlements,
    offeringRoles: (offeringRoles || []).map((r: any) => ({
      id: r.id,
      offering_key: r.offerings.offering_key,
      offering_name: r.offerings.name,
      role: r.role as OfferingRole,
      status: r.status,
    })),
  }
}

/**
 * Require access to a specific offering within an organization.
 * Checks: membership + active entitlement + offering role (if required).
 *
 * @param ctx - The organization context from resolveOrganizationContext
 * @param offeringKey - The offering key to check
 * @param requireRole - If true, requires a member_offering_role (not just entitlement)
 */
export function requireOfferingAccess(
  ctx: OrganizationContext,
  offeringKey: string,
  requireRole = true
): void {
  // Platform admins bypass offering checks
  if (ctx.isPlatformAdmin) return

  // Check entitlement exists and is active
  const entitlement = ctx.entitlements.find(
    e => e.offering_key === offeringKey && e.effective_status === 'active'
  )

  if (!entitlement) {
    throw new AuthError('entitlement_missing', `Organization does not have access to ${offeringKey}`)
  }

  // Check offering role if required
  if (requireRole) {
    const role = ctx.offeringRoles.find(
      r => r.offering_key === offeringKey && r.status === 'active'
    )

    if (!role) {
      throw new AuthError(
        'offering_role_missing',
        `You do not have a role for ${offeringKey} in this organization`
      )
    }
  }
}

/**
 * Get all organizations the authenticated user is a member of.
 */
export async function getUserOrganizations(user: AuthenticatedUser) {
  const serviceClient = createServiceClient()
  if (!serviceClient) return []

  const { data: memberships } = await serviceClient
    .from('organization_memberships')
    .select(`
      id,
      role,
      status,
      organizations!inner(id, name, slug, organization_kind, status)
    `)
    .eq('user_id', user.id)
    .eq('status', 'active')

  return (memberships || []).map((m: any) => ({
    id: m.organizations.id,
    name: m.organizations.name,
    slug: m.organizations.slug,
    organization_kind: m.organizations.organization_kind,
    status: m.organizations.status,
    role: m.role as OrganizationRole,
  }))
}
