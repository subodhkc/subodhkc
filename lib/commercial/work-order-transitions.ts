/**
 * Canonical Work Order state-transition matrix.
 *
 * Single source of truth for which status transitions are valid and which
 * roles are authorized to perform them. The Postgres RPC
 * `transition_work_order_status` mirrors this matrix server-side; this
 * module mirrors it in TypeScript for route-level pre-validation and for
 * tests.
 *
 * Section E: do not rely on individual route authors remembering valid
 * states.
 */

import type { WorkOrderStatus } from '@/lib/commercial/work-order-types'
import type { WorkOrderAuthorityRole } from '@/lib/commercial/work-order-auth'

export type TransitionActor =
  | 'client'
  | 'org_owner_admin'
  | 'advisor_operator'
  | 'platform_admin'
  | 'stripe_fulfillment'

/**
 * Allowed transitions FROM each status. Mirrors the
 * `transition_work_order_status` RPC in migration 0032.
 */
export const ALLOWED_TRANSITIONS: Record<WorkOrderStatus, WorkOrderStatus[]> = {
  draft: ['awaiting_scope', 'cancelled'],
  awaiting_scope: ['awaiting_client_acceptance', 'awaiting_owner_approval', 'cancelled'],
  awaiting_client_acceptance: ['ready_for_checkout', 'awaiting_owner_approval', 'awaiting_scope', 'cancelled'],
  awaiting_approval: ['ready_for_checkout', 'awaiting_owner_approval', 'cancelled'],
  awaiting_owner_approval: ['ready_for_checkout', 'awaiting_scope', 'cancelled'],
  ready_for_checkout: ['payment_pending', 'cancelled'],
  payment_pending: ['paid', 'ready_for_checkout', 'cancelled', 'refunded'],
  paid: ['in_progress', 'scoped', 'cancelled', 'refunded'],
  scoped: ['in_progress', 'cancelled', 'refunded'],
  in_progress: ['needs_client_input', 'in_review', 'delivered', 'cancelled', 'refunded'],
  needs_client_input: ['in_review', 'in_progress', 'cancelled'],
  in_review: ['in_progress', 'delivered', 'cancelled'],
  delivered: ['completed', 'in_review', 'cancelled'],
  completed: [],
  cancelled: [],
  refunded: [],
}

/**
 * Roles authorized to initiate each transition. `stripe_fulfillment` is a
 * system actor used by the webhook. `advisor_operator` covers Subodh and
 * any delegated advisor operator.
 */
export const TRANSITION_AUTHORITY: Partial<Record<WorkOrderStatus, Partial<Record<WorkOrderStatus, TransitionActor[]>>>> = {
  draft: {
    awaiting_scope: ['advisor_operator', 'platform_admin'],
    cancelled: ['org_owner_admin', 'platform_admin'],
  },
  awaiting_scope: {
    awaiting_client_acceptance: ['advisor_operator', 'platform_admin'],
    awaiting_owner_approval: ['org_owner_admin', 'platform_admin'],
    cancelled: ['org_owner_admin', 'platform_admin'],
  },
  awaiting_client_acceptance: {
    ready_for_checkout: ['client', 'org_owner_admin', 'platform_admin'],
    awaiting_owner_approval: ['client', 'platform_admin'],
    awaiting_scope: ['advisor_operator', 'platform_admin'],
    cancelled: ['org_owner_admin', 'platform_admin'],
  },
  awaiting_approval: {
    ready_for_checkout: ['client', 'org_owner_admin', 'platform_admin'],
    awaiting_owner_approval: ['platform_admin'],
    cancelled: ['org_owner_admin', 'platform_admin'],
  },
  awaiting_owner_approval: {
    ready_for_checkout: ['org_owner_admin', 'platform_admin'],
    awaiting_scope: ['advisor_operator', 'platform_admin'],
    cancelled: ['org_owner_admin', 'platform_admin'],
  },
  ready_for_checkout: {
    payment_pending: ['org_owner_admin', 'platform_admin'],
    cancelled: ['org_owner_admin', 'platform_admin'],
  },
  payment_pending: {
    paid: ['stripe_fulfillment'],
    ready_for_checkout: ['org_owner_admin', 'platform_admin'],
    cancelled: ['org_owner_admin', 'platform_admin'],
    refunded: ['platform_admin'],
  },
  paid: {
    in_progress: ['advisor_operator', 'platform_admin'],
    scoped: ['advisor_operator', 'platform_admin'],
    cancelled: ['platform_admin'],
    refunded: ['platform_admin'],
  },
  scoped: {
    in_progress: ['advisor_operator', 'platform_admin'],
    cancelled: ['platform_admin'],
    refunded: ['platform_admin'],
  },
  in_progress: {
    needs_client_input: ['advisor_operator', 'platform_admin'],
    in_review: ['advisor_operator', 'platform_admin'],
    delivered: ['advisor_operator', 'platform_admin'],
    cancelled: ['platform_admin'],
    refunded: ['platform_admin'],
  },
  needs_client_input: {
    in_review: ['client', 'advisor_operator', 'platform_admin'],
    in_progress: ['advisor_operator', 'platform_admin'],
    cancelled: ['org_owner_admin', 'platform_admin'],
  },
  in_review: {
    in_progress: ['advisor_operator', 'platform_admin'],
    delivered: ['advisor_operator', 'platform_admin'],
    cancelled: ['platform_admin'],
  },
  delivered: {
    completed: ['client', 'org_owner_admin', 'platform_admin'],
    in_review: ['advisor_operator', 'platform_admin'],
    cancelled: ['platform_admin'],
  },
  completed: {},
  cancelled: {},
  refunded: {},
}

/**
 * Whether a transition is valid per the matrix.
 */
export function isValidTransition(
  from: WorkOrderStatus,
  to: WorkOrderStatus
): boolean {
  const allowed = ALLOWED_TRANSITIONS[from] || []
  return allowed.includes(to)
}

/**
 * Map a WorkOrderAuthorityRole to the transition actor it represents.
 */
export function authorityToActor(
  role: WorkOrderAuthorityRole
): TransitionActor {
  switch (role) {
    case 'org_owner':
    case 'org_admin':
      return 'org_owner_admin'
    case 'service_seat_member':
    case 'org_member_no_service':
    case 'not_member':
    case 'anonymous':
      return 'client'
    case 'platform_admin':
      return 'platform_admin'
  }
}

/**
 * Whether a given actor is authorized to perform a transition.
 */
export function isAuthorizedTransition(
  from: WorkOrderStatus,
  to: WorkOrderStatus,
  actor: TransitionActor
): boolean {
  if (!isValidTransition(from, to)) return false
  const allowedActors = TRANSITION_AUTHORITY[from]?.[to]
  if (!allowedActors) return false
  return allowedActors.includes(actor)
}

/**
 * Terminal states — no outgoing transitions.
 */
export const TERMINAL_STATES: WorkOrderStatus[] = ['completed', 'cancelled', 'refunded']
