/**
 * Type definitions for AI Work Orders.
 * Separated from work-orders.ts so client components can import types
 * without pulling in server-only dependencies (lib/supabase).
 */

export type WorkOrderStatus =
  | 'draft'
  | 'awaiting_scope'
  | 'awaiting_approval'
  | 'ready_for_checkout'
  | 'payment_pending'
  | 'paid'
  | 'scoped'
  | 'in_progress'
  | 'needs_client_input'
  | 'in_review'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'refunded'

export type WorkOrderScopeStatus =
  | 'draft'
  | 'needs_review'
  | 'standard'
  | 'custom_scope_required'
  | 'accepted'

export type WorkType =
  | 'research'
  | 'analysis'
  | 'design'
  | 'build'
  | 'configuration'
  | 'integration'
  | 'evaluation'
  | 'investigation'
  | 'workflow'
  | 'vendor_review'
  | 'architecture'
  | 'other'

export type FulfillmentState =
  | 'payment_pending'
  | 'fulfillment_pending'
  | 'ready'
  | 'failed_recoverable'
  | 'failed_support_required'

export interface WorkOrder {
  id: string
  organization_id: string
  purchased_by_user_id: string | null
  requested_by_user_id: string | null
  source_offer_key: string
  legacy_qualification_id: string | null
  payment_id: string | null
  engagement_id: string | null
  stripe_checkout_session_id: string | null
  stripe_payment_intent_id: string | null
  work_order_number: string
  title: string
  work_type: WorkType
  desired_outcome: string | null
  scope_included: string | null
  scope_excluded: string | null
  required_inputs: string | null
  deliverable_description: string | null
  scope_status: WorkOrderScopeStatus
  status: WorkOrderStatus
  standard_price_cents: number | null
  currency: string
  target_date: string | null
  scope_accepted_at: string | null
  scope_accepted_by: string | null
  delivered_at: string | null
  completed_at: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface WorkOrderScopeAcceptance {
  id: string
  work_order_id: string
  scope_version: number
  rendered_scope_text: string | null
  rendered_scope_json: Record<string, unknown> | null
  document_hash: string
  accepted_by: string
  accepted_at: string
  price_cents: number
  currency: string
}

export interface WorkOrderUpdate {
  id: string
  work_order_id: string
  author_user_id: string | null
  author_role: 'client' | 'advisor' | 'platform_admin'
  update_type: string
  body: string | null
  previous_status: string | null
  new_status: string | null
  is_client_visible: boolean
  created_at: string
}

export interface ScopeSnapshot {
  work_type: WorkType
  title: string
  desired_outcome: string
  scope_included: string
  scope_excluded: string
  required_inputs: string
  deliverable_description: string
  target_timing: string | null
  price_cents: number
  currency: string
  assumptions: string[]
}

const STATUS_LABELS: Record<WorkOrderStatus, string> = {
  draft: 'Draft',
  awaiting_scope: 'Scope being prepared',
  awaiting_approval: 'Ready for approval',
  ready_for_checkout: 'Ready for checkout',
  payment_pending: 'Payment processing',
  paid: 'Paid',
  scoped: 'Scoped',
  in_progress: 'In progress',
  needs_client_input: 'Needs your input',
  in_review: 'Under review',
  delivered: 'Delivered',
  completed: 'Completed',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
}

export function statusLabel(status: WorkOrderStatus): string {
  return STATUS_LABELS[status] || status
}
