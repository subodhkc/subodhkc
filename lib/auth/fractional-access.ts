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
 * S4: Canonical list of offering keys that grant Fractional AI Advisor access.
 * Centralized here so alias checks are NOT spread across pages and routes.
 *
 * Canonical key: 'fractional_ai_advisor'
 * Legacy aliases: 'advisory', 'fractional_ai'
 */
export const FRACTIONAL_OFFERING_KEYS = [
  'fractional_ai_advisor',
  'advisory',
  'fractional_ai',
] as const

export type FractionalOfferingKey = (typeof FRACTIONAL_OFFERING_KEYS)[number]

/**
 * Check if an offering key is a recognized Fractional key (canonical or alias).
 */
export function isFractionalOfferingKey(key: string): boolean {
  return (FRACTIONAL_OFFERING_KEYS as readonly string[]).includes(key)
}

/**
 * Determine the Fractional workspace access state for an organization.
 *
 * S4: This is the CANONICAL access check. Do NOT call
 * requireOfferingAccess(active) before this — that function is a binary
 * active/inactive check and will deny read-only users entirely.
 *
 * - If the Fractional entitlement is active → 'active' (read/write)
 * - If the entitlement is expired but within 30 days of valid_until → 'readonly'
 * - Otherwise → 'expired' (deny)
 */
export function getFractionalAccessState(ctx: OrganizationContext): FractionalAccessResult {
  const ent = ctx.entitlements.find(
    e => isFractionalOfferingKey(e.offering_key)
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
 * Check if the user has ANY Fractional access (active or read-only).
 * Use this for page-level access gates (can the user see the page at all?).
 *
 * S4: This replaces the pattern of calling requireOfferingAccess(active)
 * which denies read-only users entirely.
 */
export function hasFractionalAccess(ctx: OrganizationContext): boolean {
  const access = getFractionalAccessState(ctx)
  return access.state === 'active' || access.state === 'readonly'
}

/**
 * Check if mutating operations are allowed.
 * Returns an error response if the workspace is in read-only or expired state.
 *
 * S4: This is the canonical mutation gate. API routes must call this before
 * any write operation. Read-only users get 403 on mutations.
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
