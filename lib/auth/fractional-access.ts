import type { OrganizationContext } from './organization-resolver'

/**
 * Result of checking Fractional workspace access state.
 * - 'active': full read/write access
 * - 'readonly': 30-day post-cancellation read/download access
 * - 'expired': access fully expired
 */
export type FractionalAccessState = 'active' | 'readonly' | 'expired'

export interface FractionalAccessResult {
  state: FractionalAccessState
  readonlyUntil: string | null
  message: string | null
}

/**
 * Determine the Fractional workspace access state for an organization.
 *
 * - If the Fractional entitlement is active → 'active'
 * - If the entitlement is expired but within 30 days of valid_until → 'readonly'
 * - Otherwise → 'expired'
 */
export function getFractionalAccessState(ctx: OrganizationContext): FractionalAccessResult {
  const ent = ctx.entitlements.find(
    e => e.offering_key === 'fractional_ai_advisor' || e.offering_key === 'advisory'
  )

  if (!ent) {
    return {
      state: 'expired',
      readonlyUntil: null,
      message: 'No Fractional AI Advisor subscription found.',
    }
  }

  if (ent.effective_status === 'active') {
    return { state: 'active', readonlyUntil: null, message: null }
  }

  // Expired — check 30-day read-only window
  if (ent.effective_status === 'expired' && ent.valid_until) {
    const expiry = new Date(ent.valid_until)
    const thirtyDaysAfter = new Date(expiry.getTime() + 30 * 24 * 60 * 60 * 1000)
    const now = new Date()

    if (now <= thirtyDaysAfter) {
      return {
        state: 'readonly',
        readonlyUntil: thirtyDaysAfter.toISOString(),
        message: `Your Fractional engagement has ended. Your workspace remains available for read/download access until ${thirtyDaysAfter.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.`,
      }
    }
  }

  return {
    state: 'expired',
    readonlyUntil: null,
    message: 'Your Fractional workspace access has expired.',
  }
}

/**
 * Check if mutating operations are allowed.
 * Returns an error response if the workspace is in read-only or expired state.
 */
export function checkMutationAllowed(ctx: OrganizationContext): { allowed: true } | { allowed: false; status: number; error: string; message?: string } {
  const access = getFractionalAccessState(ctx)

  if (access.state === 'active') {
    return { allowed: true }
  }

  if (access.state === 'readonly') {
    return {
      allowed: false,
      status: 403,
      error: 'workspace_readonly',
      message: access.message || 'Workspace is in read-only mode.',
    }
  }

  return {
    allowed: false,
    status: 403,
    error: 'workspace_expired',
    message: access.message || 'Workspace access has expired.',
  }
}
