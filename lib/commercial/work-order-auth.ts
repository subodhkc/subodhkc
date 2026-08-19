/**
 * Canonical Work Order access & purchase authority.
 *
 * Single source of truth for:
 *   - who can REQUEST a Work Order (intake / member request)
 *   - who can PURCHASE / approve a Work Order
 *   - whether an organization is eligible to purchase (active Advisor Desk
 *     OR active Fractional entitlement — trialing is NOT sufficient)
 *
 * Routes must call these helpers instead of duplicating role/entitlement
 * logic. This prevents the two checkout paths from diverging again.
 */

import { createServiceClient } from '@/lib/supabase'
import type { AuthenticatedUser, OrganizationContext, OrganizationRole } from '@/lib/auth/organization-resolver'
import type { WorkOrder } from '@/lib/commercial/work-order-types'
import { getWorkOrder } from '@/lib/commercial/work-orders'

export type WorkOrderAuthorityRole =
  | 'org_owner'
  | 'org_admin'
  | 'service_seat_member'
  | 'org_member_no_service'
  | 'platform_admin'
  | 'anonymous'
  | 'not_member'

export interface WorkOrderAuthority {
  role: WorkOrderAuthorityRole
  /** May submit a Work Order request (intake or member request). */
  canRequest: boolean
  /** May approve a member-initiated request (owner/admin only). */
  canApprove: boolean
  /** May complete checkout / pay. */
  canPurchase: boolean
  /** Org has an active Advisor Desk OR active Fractional entitlement. */
  orgEligible: boolean
  reason?: string
}

const ELIGIBLE_OFFER_KEYS = ['ai_advisor_desk', 'fractional_ai_advisor'] as const

/**
 * Resolve the canonical authority for a user within an organization context,
 * with respect to Work Order request/purchase permissions.
 *
 * Rules (locked):
 *   - Platform admin: can request, approve, purchase.
 *   - Org owner/admin: can request, approve, purchase (subject to eligibility).
 *   - Service-seat member (active offering role on ai_advisor_desk or
 *     fractional_ai_advisor): may request, but NOT purchase or approve.
 *   - Plain org member with no service seat: may NOT request, purchase, or
 *     approve Work Order privileges.
 *   - Anonymous: may submit public intake only (canRequest=true at the
 *     intake layer; this helper returns canRequest=false because no org
 *     context exists yet).
 */
export function resolveWorkOrderAuthority(
  ctx: OrganizationContext
): WorkOrderAuthority {
  if (ctx.isPlatformAdmin) {
    return {
      role: 'platform_admin',
      canRequest: true,
      canApprove: true,
      canPurchase: true,
      orgEligible: orgHasActiveAdvisorEntitlement(ctx),
    }
  }

  const role = ctx.organizationRole
  const hasServiceSeat = ctx.offeringRoles.some(
    r => r.status === 'active' && (r.offering_key === 'ai_advisor_desk' || r.offering_key === 'fractional_ai_advisor')
  )
  const orgEligible = orgHasActiveAdvisorEntitlement(ctx)

  if (role === 'owner' || role === 'admin') {
    return {
      role: role === 'owner' ? 'org_owner' : 'org_admin',
      canRequest: true,
      canApprove: true,
      canPurchase: true,
      orgEligible,
    }
  }

  if (hasServiceSeat) {
    return {
      role: 'service_seat_member',
      canRequest: true,
      canApprove: false,
      canPurchase: false,
      orgEligible,
      reason: 'Service-seat members may request Work Orders but only org owners/admins can approve and pay.',
    }
  }

  if (role === 'member') {
    return {
      role: 'org_member_no_service',
      canRequest: false,
      canApprove: false,
      canPurchase: false,
      orgEligible,
      reason: 'A normal org member without an Advisor Desk or Fractional service seat cannot commission Work Orders.',
    }
  }

  return {
    role: 'not_member',
    canRequest: false,
    canApprove: false,
    canPurchase: false,
    orgEligible,
    reason: 'You are not a member of this organization.',
  }
}

/**
 * Check whether an organization context has an ACTIVE (not trialing, not
 * expired) Advisor Desk or Fractional AI Advisor entitlement.
 *
 * This is the canonical eligibility check for Work Order purchase. It must
 * NOT accept trialing.
 */
export function orgHasActiveAdvisorEntitlement(ctx: OrganizationContext): boolean {
  return ctx.entitlements.some(
    e =>
      (e.offering_key === 'ai_advisor_desk' || e.offering_key === 'fractional_ai_advisor') &&
      e.effective_status === 'active'
  )
}

/**
 * Server-side eligibility check by organization id (used by routes that do
 * not have a full OrganizationContext, e.g. the legacy checkout path that
 * resolves org by id). Mirrors orgHasActiveAdvisorEntitlement but queries
 * the DB directly. Trialing is NOT accepted.
 */
export async function orgHasActiveAdvisorEntitlementById(
  organizationId: string
): Promise<boolean> {
  const sc = createServiceClient()
  if (!sc) return false

  const { data: offerings } = await sc
    .from('offerings')
    .select('id, offering_key')
    .in('offering_key', ELIGIBLE_OFFER_KEYS as unknown as string[])

  if (!offerings || offerings.length === 0) return false

  const offeringIds = offerings.map(o => o.id)
  const nowIso = new Date().toISOString()

  const { data: entitlements } = await sc
    .from('organization_entitlements')
    .select('id, status, valid_until, valid_from')
    .eq('organization_id', organizationId)
    .in('offering_id', offeringIds)
    .eq('status', 'active')

  if (!entitlements || entitlements.length === 0) return false

  // Effective-status check: active AND not expired AND not future-dated.
  const now = Date.now()
  for (const e of entitlements) {
    if (e.valid_until && new Date(e.valid_until).getTime() <= now) continue
    if (e.valid_from && new Date(e.valid_from).getTime() > now) continue
    return true
  }
  return false
}

// ============================================
// Checkout authorization (canonical, section A)
// ============================================

export type CheckoutAuthError =
  | 'unauthenticated'
  | 'organization_required'
  | 'organization_not_found'
  | 'organization_inactive'
  | 'membership_missing'
  | 'insufficient_role'
  | 'service_unavailable'
  | 'work_order_not_found'
  | 'work_order_org_mismatch'
  | 'membership_required'
  | 'work_order_not_ready_for_checkout'
  | 'work_order_already_paid'
  | 'scope_not_accepted'
  | 'scope_version_stale'
  | 'price_mismatch'

export interface CheckoutAuthSuccess {
  user: AuthenticatedUser
  organizationId: string
  organizationSlug: string
  workOrder: WorkOrder
  purchaserUserId: string
}

export interface CheckoutAuthFailure {
  code: CheckoutAuthError
  message: string
  status: number
}

/**
 * Canonical server-side Work Order checkout authorization.
 *
 * Every Work Order purchase (legacy blueprint/checkout AND new
 * work-orders/checkout) must route through this function. It validates:
 *   - authenticated user
 *   - organization exists, is active
 *   - purchaser is owner/admin OR platform admin
 *   - org has ACTIVE Advisor Desk OR ACTIVE Fractional entitlement (not trialing)
 *   - Work Order exists, belongs to the organization
 *   - Work Order status is exactly `ready_for_checkout` (NOT awaiting_approval,
 *     NOT awaiting_owner_approval, NOT awaiting_client_acceptance)
 *   - Work Order has an accepted scope and the accepted version is the
 *     current offered version
 *   - accepted price matches the Work Order's checkout price
 *   - Work Order has not already been paid
 *
 * Returns a fail-closed result on any mismatch.
 */
export async function authorizeWorkOrderCheckout(opts: {
  user: AuthenticatedUser
  organizationId: string
  workOrderId: string
  /** Expected price in cents. Defaults to the Work Order's standard_price_cents. */
  expectedPriceCents?: number
}): Promise<CheckoutAuthSuccess | CheckoutAuthFailure> {
  const sc = createServiceClient()
  if (!sc) {
    return { code: 'service_unavailable', message: 'Service client unavailable', status: 500 }
  }

  // 1. Organization exists + active
  const { data: org, error: orgError } = await sc
    .from('organizations')
    .select('id, slug, status')
    .eq('id', opts.organizationId)
    .single()

  if (orgError || !org) {
    return { code: 'organization_not_found', message: 'Organization not found', status: 404 }
  }
  if (org.status !== 'active') {
    return { code: 'organization_inactive', message: 'Organization is not active', status: 403 }
  }

  // 2. Membership + role
  const { data: membership } = await sc
    .from('organization_memberships')
    .select('role, status')
    .eq('organization_id', opts.organizationId)
    .eq('user_id', opts.user.id)
    .eq('status', 'active')
    .single()

  const isPlatformAdmin = opts.user.isPlatformAdmin
  if (!membership && !isPlatformAdmin) {
    return { code: 'membership_missing', message: 'You are not a member of this organization', status: 403 }
  }
  const role = (membership?.role as OrganizationRole) ?? null
  if (role && role !== 'owner' && role !== 'admin' && !isPlatformAdmin) {
    return {
      code: 'insufficient_role',
      message: 'Only organization owners or admins can complete Work Order checkout.',
      status: 403,
    }
  }

  // 3. Eligibility: active Advisor Desk OR active Fractional (NOT trialing)
  const eligible = await orgHasActiveAdvisorEntitlementById(opts.organizationId)
  if (!eligible) {
    return {
      code: 'membership_required',
      message: 'AI Work Orders are available through the AI Advisor relationship.',
      status: 403,
    }
  }

  // 4. Work Order exists + belongs to org
  const wo = await getWorkOrder(opts.workOrderId)
  if (!wo) {
    return { code: 'work_order_not_found', message: 'Work Order not found', status: 404 }
  }
  if (wo.organization_id !== opts.organizationId && !isPlatformAdmin) {
    return { code: 'work_order_org_mismatch', message: 'Work Order does not belong to this organization', status: 404 }
  }
  // Even platform admin cannot checkout a WO for a different org — the
  // payment must be bound to the WO's owning org, not the requester's.
  if (wo.organization_id !== opts.organizationId) {
    return { code: 'work_order_org_mismatch', message: 'Work Order does not belong to this organization', status: 404 }
  }

  // 5. Status must be exactly ready_for_checkout
  if (wo.status === 'paid' || wo.status === 'in_progress' || wo.status === 'delivered' || wo.status === 'completed') {
    return { code: 'work_order_already_paid', message: 'Work Order has already been paid', status: 400 }
  }
  if (wo.status === 'awaiting_approval' || wo.status === 'awaiting_owner_approval' || wo.status === 'awaiting_client_acceptance') {
    return {
      code: 'work_order_not_ready_for_checkout',
      message: `Work Order is ${wo.status.replace(/_/g, ' ')}, not ready for checkout.`,
      status: 400,
    }
  }
  if (wo.status !== 'ready_for_checkout') {
    return {
      code: 'work_order_not_ready_for_checkout',
      message: `Work Order status is ${wo.status}, must be ready_for_checkout.`,
      status: 400,
    }
  }

  // 6. Scope must be accepted and the accepted version must be the current
  // offered version. We check via the scope acceptances + current_scope_version_id.
  if (wo.scope_status !== 'accepted') {
    return { code: 'scope_not_accepted', message: 'Scope has not been accepted by the customer.', status: 400 }
  }

  // If the Work Order uses immutable scope versions, validate the latest
  // acceptance matches the current offered version.
  if (wo.current_scope_version_id) {
    const { data: latestAcceptance } = await sc
      .from('ai_work_order_scope_acceptances')
      .select('scope_version_id, price_cents')
      .eq('work_order_id', opts.workOrderId)
      .order('accepted_at', { ascending: false })
      .limit(1)
      .single()

    if (!latestAcceptance || !latestAcceptance.scope_version_id) {
      return { code: 'scope_version_stale', message: 'No immutable scope acceptance on record.', status: 400 }
    }
    if (latestAcceptance.scope_version_id !== wo.current_scope_version_id) {
      return { code: 'scope_version_stale', message: 'Accepted scope version is no longer the current offered version.', status: 400 }
    }

    // 7. Price match
    const expected = opts.expectedPriceCents ?? wo.standard_price_cents ?? 50000
    if (latestAcceptance.price_cents !== expected) {
      return { code: 'price_mismatch', message: 'Accepted scope price does not match checkout price.', status: 400 }
    }
  }

  return {
    user: opts.user,
    organizationId: org.id,
    organizationSlug: org.slug,
    workOrder: wo,
    purchaserUserId: opts.user.id,
  }
}

/**
 * Whitelist of metadata keys allowed on a Work Order Stripe checkout session.
 * Section L: do not accept arbitrary client metadata as a hidden second schema.
 */
export const WORK_ORDER_CHECKOUT_METADATA_KEYS = [
  'work_order_id',
  'work_order_number',
  'organization_id',
  'user_id',
  'offer_key',
  'qualification_record_id',
  'fit_decision',
  'app_source',
] as const

export type WorkOrderCheckoutMetadataKey = (typeof WORK_ORDER_CHECKOUT_METADATA_KEYS)[number]

/**
 * Sanitize an arbitrary metadata object down to the whitelisted keys.
 * Non-whitelisted keys are dropped. Values are coerced to strings.
 */
export function sanitizeWorkOrderCheckoutMetadata(
  input: Record<string, unknown> | undefined
): Record<string, string> {
  const allowed = new Set<string>(WORK_ORDER_CHECKOUT_METADATA_KEYS)
  const out: Record<string, string> = {}
  if (input) {
    for (const [key, value] of Object.entries(input)) {
      if (!allowed.has(key)) continue
      if (value === undefined || value === null) continue
      out[key] = String(value)
    }
  }
  // Force app_source for routing in the webhook (always present)
  out.app_source = 'subodhkc'
  return out
}
