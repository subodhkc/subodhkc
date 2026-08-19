/**
 * Type definitions for AI Work Orders.
 * Separated from work-orders.ts so client components can import types
 * without pulling in server-only dependencies (lib/supabase).
 *
 * This file is the SINGLE SOURCE OF TRUTH for customer-visible status labels.
 * All dashboards, emails, and UI components must use statusLabel() from here.
 */

export type WorkOrderStatus =
  | 'draft'
  | 'awaiting_scope'
  | 'awaiting_client_acceptance'
  | 'awaiting_approval'
  | 'awaiting_owner_approval'
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
  | 'sent_to_client'
  | 'custom_scope_required'
  | 'accepted'

export type ScopeVersionStatus =
  | 'proposed'
  | 'sent_to_client'
  | 'accepted'
  | 'superseded'
  | 'withdrawn'

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

export type ArtifactType =
  | 'document'
  | 'memo'
  | 'brief'
  | 'diagram'
  | 'report'
  | 'repository'
  | 'code'
  | 'configuration'
  | 'specification'
  | 'evaluation'
  | 'pdf'
  | 'link'
  | 'other'

export type SourceRequestType = 'advisor_question' | 'fractional_intake' | 'manual'

export type UpdateAuthorRole = 'client' | 'advisor' | 'platform_admin' | 'advisor_operator'

export type UpdateType =
  | 'status_change'
  | 'note'
  | 'client_input'
  | 'advisor_response'
  | 'artifact'
  | 'scope_change'
  | 'payment_event'
  | 'deliverable_published'
  | 'client_input_requested'
  | 'owner_approval_requested'
  | 'split'

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
  paid_at: string | null
  delivered_at: string | null
  completed_at: string | null
  current_scope_version_id: string | null
  parent_work_order_id: string | null
  source_request_id: string | null
  source_request_type: SourceRequestType | null
  scope_title: string | null
  scope_price_cents: number | null
  scope_target_timing: string | null
  scope_composed_by: string | null
  scope_composed_at: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface WorkOrderScopeAcceptance {
  id: string
  work_order_id: string
  scope_version: number
  scope_version_id: string | null
  rendered_scope_text: string | null
  rendered_scope_json: Record<string, unknown> | null
  document_hash: string
  accepted_by: string
  accepted_at: string
  price_cents: number
  currency: string
}

export interface WorkOrderScopeVersion {
  id: string
  work_order_id: string
  version_number: number
  scope_snapshot: Record<string, unknown>
  document_hash: string
  price_cents: number
  currency: string
  composed_by: string | null
  composed_at: string
  version_status: ScopeVersionStatus
  superseded_by: string | null
  created_at: string
}

export interface WorkOrderUpdate {
  id: string
  work_order_id: string
  author_user_id: string | null
  author_role: UpdateAuthorRole
  update_type: UpdateType
  body: string | null
  previous_status: string | null
  new_status: string | null
  is_client_visible: boolean
  created_at: string
}

export interface WorkOrderDeliverable {
  id: string
  work_order_id: string
  title: string
  description: string | null
  artifact_type: ArtifactType
  artifact_url: string | null
  artifact_metadata: Record<string, unknown>
  is_client_visible: boolean
  published_by: string | null
  published_at: string | null
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

// ============================================
// SHARED HUMAN STATUS MAPPING
// Single source of truth — used by all dashboards, emails, and UI.
// DO NOT duplicate this mapping in other components.
// ============================================

const STATUS_LABELS: Record<WorkOrderStatus, string> = {
  draft: 'Draft',
  awaiting_scope: 'Scope being prepared',
  awaiting_client_acceptance: 'Scope ready for your review',
  awaiting_approval: 'Ready for approval',
  awaiting_owner_approval: 'Awaiting organization approval',
  ready_for_checkout: 'Ready for payment',
  payment_pending: 'Payment processing',
  paid: 'Ready to start',
  scoped: 'Scoped',
  in_progress: 'In progress',
  needs_client_input: 'Needs your input',
  in_review: 'Under review',
  delivered: 'Delivered',
  completed: 'Complete',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
}

export function statusLabel(status: WorkOrderStatus): string {
  return STATUS_LABELS[status] || status
}

// Customer-facing context label — what the customer should do
const STATUS_ACTION_LABELS: Record<WorkOrderStatus, string> = {
  draft: 'Draft in progress',
  awaiting_scope: 'Subodh is preparing your scope',
  awaiting_client_acceptance: 'Review and accept your scope',
  awaiting_approval: 'Review and approve your scope',
  awaiting_owner_approval: 'Waiting for your organization admin to approve',
  ready_for_checkout: 'Complete payment to start work',
  payment_pending: 'Payment is processing',
  paid: 'Work will begin shortly',
  scoped: 'Scope confirmed',
  in_progress: 'Subodh is working on this',
  needs_client_input: 'Subodh needs your input',
  in_review: 'Subodh is reviewing your input',
  delivered: 'Your deliverable is ready',
  completed: 'Work complete',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
}

export function statusActionLabel(status: WorkOrderStatus): string {
  return STATUS_ACTION_LABELS[status] || status
}

// Advisor-facing context label — what Subodh should do
const STATUS_ADVISOR_LABELS: Record<WorkOrderStatus, string> = {
  draft: 'Draft — not yet sent',
  awaiting_scope: 'Compose scope',
  awaiting_client_acceptance: 'Sent — awaiting client acceptance',
  awaiting_approval: 'Sent — awaiting client approval',
  awaiting_owner_approval: 'Awaiting org owner/admin approval',
  ready_for_checkout: 'Client accepted — awaiting payment',
  payment_pending: 'Payment processing',
  paid: 'Paid — ready to start work',
  scoped: 'Scope confirmed',
  in_progress: 'Work in progress',
  needs_client_input: 'Waiting for client input',
  in_review: 'Reviewing client input',
  delivered: 'Delivered — awaiting client completion',
  completed: 'Completed',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
}

export function statusAdvisorLabel(status: WorkOrderStatus): string {
  return STATUS_ADVISOR_LABELS[status] || status
}

// Priority for attention queue sorting
const STATUS_PRIORITY: Record<WorkOrderStatus, 'high' | 'medium' | 'low'> = {
  draft: 'low',
  awaiting_scope: 'high',
  awaiting_client_acceptance: 'high',
  awaiting_approval: 'medium',
  awaiting_owner_approval: 'medium',
  ready_for_checkout: 'low',
  payment_pending: 'medium',
  paid: 'high',
  scoped: 'low',
  in_progress: 'medium',
  needs_client_input: 'low',
  in_review: 'high',
  delivered: 'low',
  completed: 'low',
  cancelled: 'low',
  refunded: 'low',
}

export function statusPriority(status: WorkOrderStatus): 'high' | 'medium' | 'low' {
  return STATUS_PRIORITY[status] || 'medium'
}

// Artifact type labels
const ARTIFACT_TYPE_LABELS: Record<ArtifactType, string> = {
  document: 'Document',
  memo: 'Research Memo',
  brief: 'Decision Brief',
  diagram: 'Architecture Diagram',
  report: 'Report',
  repository: 'Repository',
  code: 'Code',
  configuration: 'Configuration',
  specification: 'Specification',
  evaluation: 'Evaluation Result',
  pdf: 'PDF',
  link: 'Link',
  other: 'Other',
}

export function artifactTypeLabel(type: ArtifactType): string {
  return ARTIFACT_TYPE_LABELS[type] || type
}

// Work type labels
const WORK_TYPE_LABELS: Record<WorkType, string> = {
  research: 'Research',
  analysis: 'Analysis',
  design: 'Design',
  build: 'Build',
  configuration: 'Configuration',
  integration: 'Integration',
  evaluation: 'Evaluation',
  investigation: 'Investigation',
  workflow: 'Workflow',
  vendor_review: 'Vendor Review',
  architecture: 'Architecture',
  other: 'Other',
}

export function workTypeLabel(type: WorkType): string {
  return WORK_TYPE_LABELS[type] || type
}
