export interface EngagementCharter {
  id: string
  organization_id: string
  engagement_type: string
  status: string
  title: string | null
  statement: string | null
  in_scope: string | null
  out_of_scope: string | null
  executive_sponsor: string | null
  client_lead: string | null
  advisor_lead: string | null
  starts_at: string | null
  ends_at: string | null
  review_cadence: string
  current_phase: string
  health_status: string
  health_reason: string | null
  health_updated_at: string
  completed_at: string | null
  completed_reason: string | null
  created_at: string
  updated_at: string
}

export interface EngagementOutcome {
  id: string
  engagement_id: string
  title: string
  description: string | null
  baseline_value: string | null
  target_value: string | null
  current_value: string | null
  unit: string | null
  measurement_source: string | null
  last_measured_at: string | null
  status: string
  display_order: number
}

export interface EngagementWorkstream {
  id: string
  engagement_id: string
  name: string
  description: string | null
  owner_label: string | null
  status: string
  display_order: number
  is_blocked: boolean
  blocking_reason: string | null
}

export interface EngagementMilestone {
  id: string
  engagement_id: string
  workstream_id: string | null
  title: string
  description: string | null
  target_date: string | null
  completed_at: string | null
  status: string
  display_order: number
}

export interface EngagementAction {
  id: string
  engagement_id: string
  workstream_id: string | null
  title: string
  description: string | null
  assignee_label: string | null
  assignee_user_id: string | null
  due_date: string | null
  completed_at: string | null
  status: string
  is_client_action: boolean
  is_blocked: boolean
  blocking_reason: string | null
  display_order: number
}

export interface EngagementDecision {
  id: string
  engagement_id: string
  workstream_id: string | null
  title: string
  description: string | null
  decision_owner: string | null
  decision_owner_user_id: string | null
  needed_by: string | null
  decided_at: string | null
  decision_rationale: string | null
  status: string
  display_order: number
}

export interface EngagementUpdate {
  id: string
  engagement_id: string
  title: string
  what_changed: string | null
  in_progress: string | null
  what_next: string | null
  needs_attention: string | null
  risks_blockers: string | null
  status: string
  authored_by: string | null
  published_at: string | null
  display_order: number
  created_at: string
}

export interface EngagementArtifact {
  id: string
  engagement_id: string
  workstream_id: string | null
  title: string
  description: string | null
  artifact_type: string
  storage_path: string | null
  external_url: string | null
  status: string
  requires_acknowledgment: boolean
  authored_by: string | null
  published_at: string | null
  superseded_at: string | null
  superseded_by: string | null
  display_order: number
  created_at: string
}

export interface EngagementAccelerator {
  id: string
  engagement_id: string
  accelerator_key: string
  accelerator_name: string
  reference_url: string | null
  notes: string | null
  display_order: number
}

export interface EngagementParticipant {
  id: string
  engagement_id: string
  user_id: string
  responsibility: string
  display_name: string | null
  email: string | null
}

export interface EngagementChangeRequest {
  id: string
  engagement_id: string
  title: string
  description: string | null
  reason: string | null
  impact_summary: string | null
  requested_by: string | null
  requested_at: string
  status: string
  client_visible: boolean
  accepted_by: string | null
  accepted_at: string | null
  created_at: string
}

export interface EngagementInternalNote {
  id: string
  engagement_id: string
  author_id: string | null
  content: string
  note_category: string
  created_at: string
  updated_at: string
}

export interface EngagementAcknowledgment {
  id: string
  artifact_id: string
  user_id: string
  response: string
  comment: string | null
  created_at: string
}

export interface EngagementSolutionLink {
  id: string
  engagement_id: string
  external_link_id: string
  solution_label: string
  deployment_label: string | null
  display_order: number
  external_link?: {
    system_key: string
    external_id: string
    status: string
    metadata: Record<string, unknown>
  }
}

export interface EngagementFullData {
  charter: EngagementCharter
  outcomes: EngagementOutcome[]
  workstreams: EngagementWorkstream[]
  milestones: EngagementMilestone[]
  actions: EngagementAction[]
  decisions: EngagementDecision[]
  updates: EngagementUpdate[]
  artifacts: EngagementArtifact[]
  accelerators: EngagementAccelerator[]
  participants: EngagementParticipant[]
  changeRequests: EngagementChangeRequest[]
  internalNotes: EngagementInternalNote[]
  acknowledgments: EngagementAcknowledgment[]
  solutionLinks: EngagementSolutionLink[]
}

export interface AdvisorPortfolioItem {
  engagement: EngagementCharter
  organization_name: string
  organization_slug: string
  open_decisions: number
  overdue_decisions: number
  upcoming_milestones: number
  overdue_client_actions: number
  draft_artifacts: number
  ready_to_publish_artifacts: number
  draft_updates: number
  latest_update_title: string | null
  latest_update_date: string | null
}

export const HEALTH_LABELS: Record<string, string> = {
  on_track: 'On Track',
  needs_attention: 'Needs Attention',
  blocked: 'Blocked',
}

export const DECISION_STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  decided: 'Decided',
  deferred: 'Deferred',
  superseded: 'Superseded',
}

export const ARTIFACT_STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  ready_for_review: 'Ready for Review',
  published: 'Published',
  superseded: 'Superseded',
}

export const CHANGE_REQUEST_STATUS_LABELS: Record<string, string> = {
  proposed: 'Proposed',
  accepted: 'Accepted',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
}

export const RESPONSIBILITY_LABELS: Record<string, string> = {
  executive_sponsor: 'Executive Sponsor',
  client_lead: 'Client Lead',
  workstream_owner: 'Workstream Owner',
  decision_maker: 'Decision Maker',
  contributor: 'Contributor',
  advisor: 'Advisor',
}

export const ACCELERATOR_CATALOG = [
  { key: 'arch-decision-master-sheet', name: 'Architecture Decision Master Sheet', url: '/architecture-decision-master-sheet' },
  { key: 'ai-risk-register', name: 'AI Risk Register', url: '/ai-risk-register' },
  { key: 'ai-vendor-due-diligence', name: 'AI Vendor Due Diligence Checklist', url: '/ai-vendor-due-diligence' },
  { key: 'pilot-readiness-checklist', name: 'Pilot Readiness Checklist', url: '/ai-security-tools' },
  { key: 'llmverify', name: 'llmverify', url: '/llmverify' },
  { key: 'shadow-ai-detector', name: 'Shadow AI Detector', url: '/shadow-ai-detector' },
  { key: 'skc-log-analyser', name: 'SKC Log Analyser', url: '/skc-log-analyser' },
]

export const ENGAGEMENT_TEMPLATES = [
  {
    key: 'ai_architecture',
    name: 'AI Architecture & Integration',
    description: 'Architecture design, integration planning, and production readiness',
    outcomes: [
      { title: 'Production AI architecture approved', description: 'Architecture design reviewed and approved by client' },
    ],
    workstreams: [
      { name: 'Architecture', description: 'AI architecture design and integration planning' },
      { name: 'Integration', description: 'System integration planning and testing' },
      { name: 'Production Readiness', description: 'Readiness assessment and go-live preparation' },
    ],
    accelerators: ['arch-decision-master-sheet', 'pilot-readiness-checklist'],
  },
  {
    key: 'ai_operations',
    name: 'AI Operations & Deployment',
    description: 'Operational deployment, monitoring, and optimization',
    outcomes: [
      { title: 'Production AI deployment operational', description: 'AI system deployed with monitoring and alerting' },
    ],
    workstreams: [
      { name: 'Deployment', description: 'Production deployment and configuration' },
      { name: 'Monitoring', description: 'Operational monitoring and alerting setup' },
      { name: 'Optimization', description: 'Performance tuning and optimization' },
    ],
    accelerators: ['skc-log-analyser', 'shadow-ai-detector'],
  },
  {
    key: 'ai_governance',
    name: 'AI Governance & Assurance',
    description: 'Governance framework, compliance, and risk management',
    outcomes: [
      { title: 'AI governance framework established', description: 'Governance operating model approved and deployed' },
    ],
    workstreams: [
      { name: 'Governance', description: 'Governance framework design and approval' },
      { name: 'Compliance', description: 'Regulatory compliance assessment' },
      { name: 'Risk Management', description: 'AI risk register and mitigation' },
    ],
    accelerators: ['ai-risk-register', 'ai-vendor-due-diligence'],
  },
]
