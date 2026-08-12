/**
 * CSM 2.0 - Deterministic-by-Design Governance Operating Model for AI Systems
 *
 * Canonical TypeScript specification source.
 * All machine-readable artifacts (JSON, schema) should be generated from this file.
 *
 * Spec version: 2.0.0
 * Design date: 2026-08-10
 *
 * Principle: CSM 2.0 makes governance deterministic where objective rules permit
 * and makes human judgment explicit, attributable and traceable where interpretation
 * is required.
 */

// ============================================================================
// 1. VERSIONING
// ============================================================================

export const CSM_SPEC_VERSION = '2.0.0' as const
export const CSM_SPEC_DATE = '2026-08-10' as const

export interface SpecVersion {
  specVersion: string
  specDate: string
  changelog: ChangelogEntry[]
}

export interface ChangelogEntry {
  version: string
  date: string
  label: string
  summary: string
  added: string[]
  unchanged: string[]
}

export const csmChangelog: ChangelogEntry[] = [
  {
    version: '1.0',
    date: '2025-08-29',
    label: 'Historical conceptual publication',
    summary:
      'Original CSM publication. Four governance domains and sixteen original components.',
    added: [
      'Four governance domains: Enterprise, Project, Code, UX',
      'Sixteen original components (four per domain)',
      'Cross-domain handoff visibility concept',
      'Implementation guidance (assessment, pilot, scale)',
      'Proportionality concept',
    ],
    unchanged: [],
  },
  {
    version: '2.0.0',
    date: '2026-08-10',
    label: 'Current specification',
    summary:
      'Formalizes CSM into a deterministic governance operating model with machine-readable contracts.',
    added: [
      'Two-axis operating architecture (Domains x Execution Functions)',
      'Governance Contract schema for every component',
      'Objective rules vs human judgment points',
      'Determinism contract',
      'Explicit state model (requirement, domain, system)',
      'Evidence schema with versioning',
      'Decision record schema',
      'Exception contract with expiration',
      'Formal handoff contracts',
      'Reassessment engine with deterministic triggers',
      'Component dependency graph',
      '4x6 operational mapping',
      'Governance depth / proportionality profiles',
      'Semantic versioning (spec, policy, assessment)',
      'Machine-readable specification design',
      'Informative NIST/ISO crosswalk',
    ],
    unchanged: [
      'Four governance domains: Enterprise, Project, Code, UX',
      'Sixteen original components and their names',
      'Original provenance and publication reference',
      'Proportionality principle',
      'Handoff visibility as core value',
    ],
  },
  {
    version: '2.0.1',
    date: '2026-08-11',
    label: 'Expanded implementation examples',
    summary:
      'Expanded V1 implementation examples and handoffs to address vendor governance, agentic code generation, consent management, and incident response governance.',
    added: [
      'Enterprise: vendor governance, provider data-processing review, model card requirements',
      'Enterprise: incident response authority, escalation protocol, breach notification procedure',
      'Code: agentic tool authority policy, agent sandbox boundaries, AI API key management, prompt injection defense',
      'UX: AI processing consent, opt-out and human review request, misuse detection monitoring, manipulation guardrail review',
      'Enterprise roles: vendor manager, incident response lead',
      'Code roles: platform engineer',
      'UX roles: privacy counsel',
      'Handoffs: Enterprise to Code (security incidents), Code to Enterprise (policy gaps), UX to Enterprise (user-reported incidents)',
    ],
    unchanged: [
      'Four governance domains: Enterprise, Project, Code, UX',
      'Sixteen original components and their names',
      'All V2 governance contracts, objective rules, and state models',
      'Operational mapping (4x6 matrix)',
      'Reassessment trigger definitions',
      'Determinism contract',
    ],
  },
]

// ============================================================================
// 2. STABLE IDENTIFIERS
// ============================================================================

export type DomainId = 'ENT' | 'PRJ' | 'CODE' | 'UX'

export type ComponentId =
  | 'ENT-POLICY'
  | 'ENT-RISK'
  | 'ENT-DATA'
  | 'ENT-MANDATE'
  | 'PRJ-BUSINESS'
  | 'PRJ-TESTING'
  | 'PRJ-SCALE'
  | 'PRJ-PLAYBOOK'
  | 'CODE-STANDARDS'
  | 'CODE-SECURITY'
  | 'CODE-HUMAN'
  | 'CODE-TRACE'
  | 'UX-IMPACT'
  | 'UX-EXPLAIN'
  | 'UX-CAPABILITY'
  | 'UX-ADOPTION'

export type ExecutionFunctionId =
  | 'EF1-PURPOSE'
  | 'EF2-MAPPING'
  | 'EF3-RISK'
  | 'EF4-DELIVERY'
  | 'EF5-OVERSIGHT'
  | 'EF6-COMPLIANCE'

export type ReassessmentTriggerId =
  | 'TRIGGER-USE-CHANGE'
  | 'TRIGGER-SCOPE-EXPANSION'
  | 'TRIGGER-OWNER-CHANGE'
  | 'TRIGGER-MODEL-CHANGE'
  | 'TRIGGER-PROVIDER-CHANGE'
  | 'TRIGGER-CONFIG-CHANGE'
  | 'TRIGGER-DATA-CHANGE'
  | 'TRIGGER-TOOL-AUTHORITY-CHANGE'
  | 'TRIGGER-NEW-INTEGRATION'
  | 'TRIGGER-DEPENDENCY-CHANGE'
  | 'TRIGGER-SECURITY-INCIDENT'
  | 'TRIGGER-EVAL-FAILURE'
  | 'TRIGGER-DRIFT'
  | 'TRIGGER-USER-HARM'
  | 'TRIGGER-JURISDICTION-CHANGE'
  | 'TRIGGER-POLICY-CHANGE'
  | 'TRIGGER-EXCEPTION-EXPIRY'
  | 'TRIGGER-DECOMMISSION'

// ============================================================================
// 3. STATE MODEL
// ============================================================================

export type RequirementState =
  | 'NOT_ASSESSED'
  | 'NOT_APPLICABLE'
  | 'REQUIRED'
  | 'IN_PROGRESS'
  | 'SATISFIED'
  | 'PARTIAL'
  | 'BLOCKED'
  | 'EXCEPTION_APPROVED'
  | 'HUMAN_REVIEW_REQUIRED'
  | 'REASSESSMENT_REQUIRED'

export type DomainState =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'READY_FOR_HANDOFF'
  | 'BLOCKED'
  | 'REASSESSMENT_REQUIRED'

export type SystemGovernanceState =
  | 'ASSESSMENT_INCOMPLETE'
  | 'GOVERNANCE_BLOCKED'
  | 'HUMAN_DECISION_REQUIRED'
  | 'READY_FOR_GOVERNANCE_DECISION'
  | 'REASSESSMENT_REQUIRED'

export const REQUIREMENT_STATE_DEFINITIONS: Record<RequirementState, string> = {
  NOT_ASSESSED: 'No evaluation has been performed for this requirement.',
  NOT_APPLICABLE: 'The requirement has been evaluated and determined not to apply to this system context.',
  REQUIRED: 'The requirement applies and has not yet been satisfied. Work has not begun.',
  IN_PROGRESS: 'The requirement applies and work is underway but not complete.',
  SATISFIED: 'All applicable objective rules pass and required evidence exists.',
  PARTIAL: 'Some but not all required evidence or rules are satisfied.',
  BLOCKED: 'A blocking condition exists that prevents progress.',
  EXCEPTION_APPROVED: 'An approved exception covers this requirement. The exception has a valid expiration.',
  HUMAN_REVIEW_REQUIRED: 'A human judgment point has been reached and requires explicit review.',
  REASSESSMENT_REQUIRED: 'A reassessment trigger has fired for this requirement.',
}

export const DOMAIN_STATE_DEFINITIONS: Record<DomainState, string> = {
  NOT_STARTED: 'No applicable components have been assessed.',
  IN_PROGRESS: 'At least one applicable component is assessed but not all are satisfied or validly excepted.',
  READY_FOR_HANDOFF: 'All applicable required components are satisfied or validly excepted and no human review remains.',
  BLOCKED: 'At least one applicable blocking component is BLOCKED.',
  REASSESSMENT_REQUIRED: 'At least one applicable component requires reassessment.',
}

export const SYSTEM_STATE_DEFINITIONS: Record<SystemGovernanceState, string> = {
  ASSESSMENT_INCOMPLETE: 'One or more applicable components have not been assessed.',
  GOVERNANCE_BLOCKED: 'One or more applicable components are BLOCKED.',
  HUMAN_DECISION_REQUIRED: 'One or more human judgment points require explicit review.',
  READY_FOR_GOVERNANCE_DECISION: 'All applicable components are satisfied, validly excepted, or not applicable. No blockers or human reviews remain. A human authority may record an approval decision.',
  REASSESSMENT_REQUIRED: 'One or more reassessment triggers have fired.',
}

/**
 * Domain state derivation rule:
 * 1. If any applicable component is REASSESSMENT_REQUIRED -> REASSESSMENT_REQUIRED
 * 2. Else if any applicable component is BLOCKED -> BLOCKED
 * 3. Else if any applicable component is NOT_ASSESSED -> NOT_STARTED
 * 4. Else if any applicable component is IN_PROGRESS, PARTIAL, or HUMAN_REVIEW_REQUIRED -> IN_PROGRESS
 * 5. Else if all applicable components are SATISFIED, NOT_APPLICABLE, or EXCEPTION_APPROVED -> READY_FOR_HANDOFF
 */
export const DOMAIN_STATE_RULE = `
Priority order:
1. REASSESSMENT_REQUIRED (any applicable component)
2. BLOCKED (any applicable component)
3. NOT_STARTED (any applicable component NOT_ASSESSED)
4. IN_PROGRESS (any applicable component IN_PROGRESS, PARTIAL, or HUMAN_REVIEW_REQUIRED)
5. READY_FOR_HANDOFF (all applicable components SATISFIED, NOT_APPLICABLE, or EXCEPTION_APPROVED)
`.trim()

/**
 * System state derivation rule:
 * 1. If any domain is BLOCKED -> GOVERNANCE_BLOCKED
 * 2. Else if any domain is REASSESSMENT_REQUIRED -> REASSESSMENT_REQUIRED
 * 3. Else if any domain is NOT_STARTED -> ASSESSMENT_INCOMPLETE
 * 4. Else if any domain is IN_PROGRESS -> HUMAN_DECISION_REQUIRED (if any HUMAN_REVIEW_REQUIRED) or ASSESSMENT_INCOMPLETE
 * 5. Else if all domains are READY_FOR_HANDOFF -> READY_FOR_GOVERNANCE_DECISION
 */
export const SYSTEM_STATE_RULE = `
Priority order:
1. GOVERNANCE_BLOCKED (any domain BLOCKED)
2. REASSESSMENT_REQUIRED (any domain REASSESSMENT_REQUIRED)
3. ASSESSMENT_INCOMPLETE (any domain NOT_STARTED or any component NOT_ASSESSED)
4. HUMAN_DECISION_REQUIRED (any component HUMAN_REVIEW_REQUIRED)
5. READY_FOR_GOVERNANCE_DECISION (all domains READY_FOR_HANDOFF)
`.trim()

// ============================================================================
// 4. GOVERNANCE DEPTH
// ============================================================================

export type GovernanceDepth = 'BASELINE' | 'ENHANCED' | 'INTENSIVE'

export const GOVERNANCE_DEPTH_DEFINITIONS: Record<GovernanceDepth, string> = {
  BASELINE: 'Minimum governance for all AI-enabled systems. Universal requirements apply.',
  ENHANCED: 'Additional requirements activated by organization-defined factors beyond baseline.',
  INTENSIVE: 'Maximum governance depth for systems with significant consequential, safety, or regulatory exposure.',
}

export interface ProportionalityFactor {
  id: string
  label: string
  description: string
  recommendedDepth: GovernanceDepth
}

export const PROPORTIONALITY_FACTORS: ProportionalityFactor[] = [
  { id: 'consequential-decisions', label: 'Consequential decisions', description: 'System outputs influence decisions affecting individuals rights, opportunities, or wellbeing.', recommendedDepth: 'INTENSIVE' },
  { id: 'external-customer-impact', label: 'External customer impact', description: 'System interacts with or produces outputs for external customers.', recommendedDepth: 'ENHANCED' },
  { id: 'sensitive-data', label: 'Sensitive data', description: 'System processes personal, financial, health, or other sensitive data.', recommendedDepth: 'INTENSIVE' },
  { id: 'autonomous-action', label: 'Autonomous action', description: 'System can take actions without per-action human approval.', recommendedDepth: 'INTENSIVE' },
  { id: 'difficult-to-reverse', label: 'Difficult to reverse', description: 'System actions are difficult or impossible to reverse.', recommendedDepth: 'INTENSIVE' },
  { id: 'safety-impact', label: 'Safety impact', description: 'System failure could cause physical or psychological harm.', recommendedDepth: 'INTENSIVE' },
  { id: 'significant-financial-impact', label: 'Significant financial impact', description: 'System failure could cause material financial loss.', recommendedDepth: 'ENHANCED' },
  { id: 'large-affected-population', label: 'Large affected population', description: 'System affects a large number of individuals.', recommendedDepth: 'ENHANCED' },
  { id: 'critical-vendor-dependency', label: 'Critical vendor dependency', description: 'System depends on a third-party provider whose failure would disrupt operations.', recommendedDepth: 'ENHANCED' },
  { id: 'external-regulatory-exposure', label: 'External regulatory exposure', description: 'System is subject to specific regulatory requirements (e.g., EU AI Act, NYC LL144).', recommendedDepth: 'INTENSIVE' },
]

// ============================================================================
// 5. CORE INTERFACES
// ============================================================================

export interface ApplicabilityCondition {
  field: string
  operator: 'equals' | 'not_equals' | 'exists' | 'not_exists' | 'in' | 'not_in' | 'gt' | 'lt' | 'gte' | 'lte'
  value?: unknown
  description: string
}

export interface InputField {
  id: string
  label: string
  type: 'string' | 'boolean' | 'date' | 'enum' | 'array' | 'object' | 'number'
  required: boolean
  description: string
}

export interface ObjectiveRule {
  id: string
  description: string
  condition: string
  passState: RequirementState
  failState: RequirementState
  blocking: boolean
}

export interface HumanJudgmentPoint {
  id: string
  question: string
  description: string
  requiredOutput: 'APPROVE' | 'REJECT' | 'CONDITIONAL' | 'DEFER'
  requiresReviewer: boolean
  requiresRationale: boolean
  requiresEvidence: boolean
}

export interface RequiredDecision {
  id: string
  question: string
  decisionType: 'objective' | 'human_approval' | 'legal_review' | 'exception' | 'risk_acceptance'
  blocking: boolean
}

export interface EvidenceRequirement {
  id: string
  label: string
  description: string
  evidenceType: string
  required: boolean
  expiresByDefault: boolean
  defaultExpiryDays?: number
}

export interface ExceptionSpecification {
  allowedReasons: string[]
  requiresCompensatingControls: boolean
  maxDurationDays?: number
  requiresAccountableApprover: boolean
}

export interface ExceptionApprovalRule {
  approverRole: string
  requiresRationale: boolean
  requiresEvidence: boolean
  requiresCompensatingControls: boolean
}

export interface HandoffTarget {
  targetDomain: DomainId
  targetComponent?: ComponentId
  requiredOutputs: string[]
}

// ============================================================================
// 6. GOVERNANCE CONTRACT
// ============================================================================

export interface GovernanceContract {
  id: ComponentId
  version: string
  domain: DomainId
  name: string
  purpose: string
  coreQuestion: string
  applicability: ApplicabilityCondition[]
  requiredInputs: InputField[]
  optionalInputs: InputField[]
  objectiveRules: ObjectiveRule[]
  humanJudgmentPoints: HumanJudgmentPoint[]
  requiredDecisions: RequiredDecision[]
  requiredEvidence: EvidenceRequirement[]
  responsibleRoles: string[]
  accountableRole: string
  outputs: string[]
  blockingConditions: string[]
  allowedExceptions: ExceptionSpecification
  exceptionApproval: ExceptionApprovalRule
  handoffTargets: HandoffTarget[]
  handoffOutputs: string[]
  reassessmentTriggers: ReassessmentTriggerId[]
  executionFunctionMappings: ExecutionFunctionId[]
  sourceProvenance: string
  dependencies: ComponentId[]
}

// ============================================================================
// 7. EVIDENCE SCHEMA
// ============================================================================

export interface EvidenceRecord {
  evidenceId: string
  type: string
  title: string
  source: string
  owner: string
  createdAt: string
  effectiveAt: string
  expiresAt?: string
  systemVersion?: string
  artifactVersion?: string
  uri?: string
  hash?: string
  relatedRequirementIds: string[]
  status: 'active' | 'expired' | 'superseded' | 'revoked'
}

// ============================================================================
// 8. DECISION RECORD SCHEMA
// ============================================================================

export interface DecisionRecord {
  decisionId: string
  requirementId: string
  question: string
  decision: string
  decisionType: 'objective_computation' | 'human_approval' | 'legal_review' | 'exception' | 'risk_acceptance'
  reviewer: string
  reviewerRole: string
  rationale: string
  evidenceRefs: string[]
  decidedAt: string
  effectiveAt: string
  expiresAt?: string
  specVersion: string
  policyVersion: string
}

// ============================================================================
// 9. EXCEPTION RECORD
// ============================================================================

export interface ExceptionRecord {
  exceptionId: string
  requirementId: string
  reason: string
  approver: string
  approverRole: string
  compensatingControls: string[]
  issuedAt: string
  expiresAt: string
  scope: string
  evidenceRefs: string[]
  reassessmentTrigger: ReassessmentTriggerId
}

// ============================================================================
// 10. DOMAIN DEFINITIONS
// ============================================================================

export interface DomainDefinition {
  id: DomainId
  displayName: string
  shortName: string
  tagline: string
  centralQuestion: string
  componentIds: ComponentId[]
}

export const csmDomains: DomainDefinition[] = [
  {
    id: 'ENT',
    displayName: 'CSM-Enterprise',
    shortName: 'Enterprise',
    tagline: 'Establish the decision context before individual projects improvise it.',
    centralQuestion: 'Who has authority, who owns the outcome and risk, and what organizational boundaries apply?',
    componentIds: ['ENT-POLICY', 'ENT-RISK', 'ENT-DATA', 'ENT-MANDATE'],
  },
  {
    id: 'PRJ',
    displayName: 'CSM-Project',
    shortName: 'Project',
    tagline: 'Make scaling an explicit governance decision.',
    centralQuestion: 'What evidence should justify continuing, changing, scaling or stopping an AI initiative?',
    componentIds: ['PRJ-BUSINESS', 'PRJ-TESTING', 'PRJ-SCALE', 'PRJ-PLAYBOOK'],
  },
  {
    id: 'CODE',
    displayName: 'CSM-Code',
    shortName: 'Code',
    tagline: 'AI-generated code is still organizationally accountable code.',
    centralQuestion: 'How should software engineering governance change when AI contributes to implementation?',
    componentIds: ['CODE-STANDARDS', 'CODE-SECURITY', 'CODE-HUMAN', 'CODE-TRACE'],
  },
  {
    id: 'UX',
    displayName: 'CSM-UX',
    shortName: 'UX',
    tagline: 'Governance reaches the people relying on the system.',
    centralQuestion: 'What do humans need to understand, supervise, challenge and appropriately use AI-supported outcomes?',
    componentIds: ['UX-IMPACT', 'UX-EXPLAIN', 'UX-CAPABILITY', 'UX-ADOPTION'],
  },
]

// ============================================================================
// 11. COMPONENT DEFINITIONS (metadata only - contracts in contracts.ts)
// ============================================================================

export interface ComponentDefinition {
  id: ComponentId
  domain: DomainId
  name: string
  description: string
}

export const csmComponents: ComponentDefinition[] = [
  { id: 'ENT-POLICY', domain: 'ENT', name: 'Policy Framework', description: 'AI ethics standards and organizational policies that account for system behavior which may differ from conventional software.' },
  { id: 'ENT-RISK', domain: 'ENT', name: 'Risk Assessment', description: 'Risk evaluation that accounts for system behavior which may change over time, including model updates, provider changes, or data drift.' },
  { id: 'ENT-DATA', domain: 'ENT', name: 'Data Stewardship', description: 'Governance for datasets that influence ongoing AI behavior, including training data, retrieval sources and operational data.' },
  { id: 'ENT-MANDATE', domain: 'ENT', name: 'Strategic Mandate', description: 'Organizational authority and strategic alignment that defines why AI systems are being deployed and what boundaries apply.' },
  { id: 'PRJ-BUSINESS', domain: 'PRJ', name: 'Business Case Definition', description: 'What problem or value is being tested. The business case defines the hypothesis an AI initiative is evaluating.' },
  { id: 'PRJ-TESTING', domain: 'PRJ', name: 'Controlled Testing', description: 'What must be learned before scale. Testing designed to answer specific governance and performance questions.' },
  { id: 'PRJ-SCALE', domain: 'PRJ', name: 'Scale Decision Framework', description: 'What evidence justifies broader commitment. Defined criteria for deciding whether to proceed, change or stop.' },
  { id: 'PRJ-PLAYBOOK', domain: 'PRJ', name: 'Playbook Documentation', description: 'What decisions and learning need to survive beyond the pilot team. Documentation that transfers knowledge to operational owners.' },
  { id: 'CODE-STANDARDS', domain: 'CODE', name: 'Development Standards', description: 'Engineering standards that account for AI-assisted development, including review requirements and quality expectations.' },
  { id: 'CODE-SECURITY', domain: 'CODE', name: 'Security Protocols', description: 'Security practices that address AI-generated code, including vulnerability scanning and dependency verification.' },
  { id: 'CODE-HUMAN', domain: 'CODE', name: 'Human Oversight', description: 'Human review of AI-assisted contributions proportionate to risk and consequence.' },
  { id: 'CODE-TRACE', domain: 'CODE', name: 'Traceability Logging', description: 'Records that provide appropriate provenance for AI-assisted changes where risk warrants it.' },
  { id: 'UX-IMPACT', domain: 'UX', name: 'Impact Analysis', description: 'Assessment of how AI-supported outcomes affect individuals, groups and workflows.' },
  { id: 'UX-EXPLAIN', domain: 'UX', name: 'Explainability Design', description: 'Design choices that help users understand system behavior, limitations and appropriate reliance.' },
  { id: 'UX-CAPABILITY', domain: 'UX', name: 'Capability Development', description: 'Training and skill development that enables users to effectively supervise and interact with AI systems.' },
  { id: 'UX-ADOPTION', domain: 'UX', name: 'Adoption Measurement', description: 'Monitoring of how AI systems are actually used, including feedback and complaints.' },
]

// ============================================================================
// 12. EXECUTION FUNCTION DEFINITIONS
// ============================================================================

export interface ExecutionFunctionDefinition {
  id: ExecutionFunctionId
  name: string
  question: string
  description: string
}

export const executionFunctions: ExecutionFunctionDefinition[] = [
  { id: 'EF1-PURPOSE', name: 'Purpose, Scope & Accountability', question: 'What is the system for, who is accountable, and what boundaries apply?', description: 'Establishes the intended purpose, scope, ownership and accountability boundaries for the AI system.' },
  { id: 'EF2-MAPPING', name: 'System, Data & Dependency Mapping', question: 'What components, data and dependencies comprise the system?', description: 'Maps the system architecture, data sources, model providers, tools and integrations.' },
  { id: 'EF3-RISK', name: 'Risk, Evaluation & Monitoring', question: 'What risks exist and how are they evaluated and monitored?', description: 'Identifies, evaluates and continuously monitors risks including drift, performance and security.' },
  { id: 'EF4-DELIVERY', name: 'Controlled Delivery & Change', question: 'How are changes controlled and delivered?', description: 'Governs the delivery pipeline, change management, testing gates and deployment controls.' },
  { id: 'EF5-OVERSIGHT', name: 'Human Oversight, Feedback & Learning', question: 'How do humans oversee, provide feedback and learn from the system?', description: 'Ensures human oversight mechanisms, feedback channels and organizational learning loops.' },
  { id: 'EF6-COMPLIANCE', name: 'Compliance, Evidence & Assurance', question: 'What evidence demonstrates governance and what compliance obligations apply?', description: 'Collects, organizes and produces evidence for governance assurance and regulatory obligations.' },
]

// ============================================================================
// 13. 4x6 OPERATIONAL MAPPING
// ============================================================================

export interface OperationalMappingEntry {
  componentId: ComponentId
  executionFunctionId: ExecutionFunctionId
  relevance: string
}

export const operationalMapping: OperationalMappingEntry[] = [
  { componentId: 'ENT-POLICY', executionFunctionId: 'EF1-PURPOSE', relevance: 'Policy defines purpose boundaries and accountability expectations.' },
  { componentId: 'ENT-POLICY', executionFunctionId: 'EF6-COMPLIANCE', relevance: 'Policy establishes compliance obligations and evidence expectations.' },
  { componentId: 'ENT-RISK', executionFunctionId: 'EF3-RISK', relevance: 'Risk assessment identifies and evaluates risks requiring monitoring.' },
  { componentId: 'ENT-RISK', executionFunctionId: 'EF1-PURPOSE', relevance: 'Risk context informs purpose and scope boundaries.' },
  { componentId: 'ENT-DATA', executionFunctionId: 'EF2-MAPPING', relevance: 'Data stewardship requires mapping data sources and their governance.' },
  { componentId: 'ENT-DATA', executionFunctionId: 'EF6-COMPLIANCE', relevance: 'Data governance evidence supports compliance assurance.' },
  { componentId: 'ENT-MANDATE', executionFunctionId: 'EF1-PURPOSE', relevance: 'Strategic mandate defines purpose, authority and accountability.' },
  { componentId: 'PRJ-BUSINESS', executionFunctionId: 'EF1-PURPOSE', relevance: 'Business case defines the specific purpose and scope being tested.' },
  { componentId: 'PRJ-BUSINESS', executionFunctionId: 'EF3-RISK', relevance: 'Business case includes risk-benefit evaluation.' },
  { componentId: 'PRJ-TESTING', executionFunctionId: 'EF3-RISK', relevance: 'Controlled testing evaluates risks and performance before scale.' },
  { componentId: 'PRJ-TESTING', executionFunctionId: 'EF4-DELIVERY', relevance: 'Testing gates control delivery decisions.' },
  { componentId: 'PRJ-SCALE', executionFunctionId: 'EF4-DELIVERY', relevance: 'Scale decision is a delivery gate controlling broader deployment.' },
  { componentId: 'PRJ-PLAYBOOK', executionFunctionId: 'EF5-OVERSIGHT', relevance: 'Playbook transfers learning to operational owners for oversight.' },
  { componentId: 'PRJ-PLAYBOOK', executionFunctionId: 'EF6-COMPLIANCE', relevance: 'Playbook documentation serves as compliance evidence.' },
  { componentId: 'CODE-STANDARDS', executionFunctionId: 'EF4-DELIVERY', relevance: 'Development standards control how code is delivered and reviewed.' },
  { componentId: 'CODE-SECURITY', executionFunctionId: 'EF3-RISK', relevance: 'Security protocols address risks in AI-assisted code.' },
  { componentId: 'CODE-SECURITY', executionFunctionId: 'EF4-DELIVERY', relevance: 'Security scanning gates control delivery.' },
  { componentId: 'CODE-HUMAN', executionFunctionId: 'EF5-OVERSIGHT', relevance: 'Human oversight of AI-assisted development is a direct oversight function.' },
  { componentId: 'CODE-TRACE', executionFunctionId: 'EF6-COMPLIANCE', relevance: 'Traceability logging produces compliance evidence for AI-assisted changes.' },
  { componentId: 'CODE-TRACE', executionFunctionId: 'EF2-MAPPING', relevance: 'Traceability records map AI-assisted changes to review and approval.' },
  { componentId: 'UX-IMPACT', executionFunctionId: 'EF3-RISK', relevance: 'Impact analysis identifies risks to affected individuals and groups.' },
  { componentId: 'UX-EXPLAIN', executionFunctionId: 'EF5-OVERSIGHT', relevance: 'Explainability design enables effective human oversight.' },
  { componentId: 'UX-CAPABILITY', executionFunctionId: 'EF5-OVERSIGHT', relevance: 'Capability development builds human oversight capacity.' },
  { componentId: 'UX-ADOPTION', executionFunctionId: 'EF3-RISK', relevance: 'Adoption measurement detects misuse, drift and emerging risks.' },
  { componentId: 'UX-ADOPTION', executionFunctionId: 'EF5-OVERSIGHT', relevance: 'Adoption data feeds feedback and learning loops.' },
]

// ============================================================================
// 14. HANDOFF CONTRACTS
// ============================================================================

export interface HandoffContract {
  id: string
  fromDomain: DomainId
  toDomain: DomainId
  name: string
  requiredFields: string[]
  description: string
}

export const handoffContracts: HandoffContract[] = [
  {
    id: 'HANDOFF-ENT-PRJ',
    fromDomain: 'ENT',
    toDomain: 'PRJ',
    name: 'Enterprise to Project',
    requiredFields: ['intendedPurpose', 'accountableOwner', 'policyBoundaries', 'riskContext', 'dataOwnership', 'strategicMandate'],
    description: 'Policy and risk boundaries become project requirements.',
  },
  {
    id: 'HANDOFF-PRJ-CODE',
    fromDomain: 'PRJ',
    toDomain: 'CODE',
    name: 'Project to Code',
    requiredFields: ['approvedUseCase', 'businessSuccessCriteria', 'evaluationCriteria', 'releaseExpectations', 'applicableConstraints', 'scaleDecisionCriteria'],
    description: 'Acceptance criteria and approved assumptions become implementation constraints.',
  },
  {
    id: 'HANDOFF-CODE-UX',
    fromDomain: 'CODE',
    toDomain: 'UX',
    name: 'Code to UX / Operations',
    requiredFields: ['implementationVersion', 'validatedBehavior', 'knownLimitations', 'securityTestResults', 'monitoringSignals', 'fallbackBehavior'],
    description: 'Actual system behavior and limitations shape user interaction and oversight.',
  },
  {
    id: 'HANDOFF-UX-PRJ',
    fromDomain: 'UX',
    toDomain: 'PRJ',
    name: 'UX to Project',
    requiredFields: ['userFeedback', 'usageFindings', 'operatorIssues', 'incidentSignals', 'usabilityFailures', 'escalationData'],
    description: 'User feedback and operational behavior trigger product/project reassessment.',
  },
  {
    id: 'HANDOFF-PRJ-ENT',
    fromDomain: 'PRJ',
    toDomain: 'ENT',
    name: 'Project to Enterprise',
    requiredFields: ['newRisks', 'policyGaps', 'incidents', 'strategicChanges', 'discoveredDependencies', 'lessonsRequiringEnterpriseChange'],
    description: 'Incidents, lessons and newly discovered risks may require policy or risk updates.',
  },
]

// ============================================================================
// 15. REASSESSMENT TRIGGERS
// ============================================================================

export interface ReassessmentTriggerDefinition {
  id: ReassessmentTriggerId
  label: string
  description: string
  affectedDomains: DomainId[]
  affectedComponents: ComponentId[]
}

export const reassessmentTriggers: ReassessmentTriggerDefinition[] = [
  { id: 'TRIGGER-USE-CHANGE', label: 'Intended-use change', description: 'The intended purpose of the system has changed.', affectedDomains: ['ENT', 'PRJ', 'UX'], affectedComponents: ['ENT-MANDATE', 'ENT-POLICY', 'PRJ-BUSINESS', 'UX-IMPACT', 'UX-EXPLAIN'] },
  { id: 'TRIGGER-SCOPE-EXPANSION', label: 'Scope expansion', description: 'The system scope has expanded beyond the approved use case.', affectedDomains: ['ENT', 'PRJ', 'CODE'], affectedComponents: ['ENT-MANDATE', 'PRJ-BUSINESS', 'PRJ-SCALE', 'CODE-STANDARDS'] },
  { id: 'TRIGGER-OWNER-CHANGE', label: 'Accountable-owner change', description: 'The accountable owner has changed.', affectedDomains: ['ENT'], affectedComponents: ['ENT-MANDATE', 'ENT-POLICY', 'ENT-RISK'] },
  { id: 'TRIGGER-MODEL-CHANGE', label: 'Model change', description: 'The AI model has been changed or materially updated.', affectedDomains: ['PRJ', 'CODE', 'UX'], affectedComponents: ['PRJ-TESTING', 'CODE-SECURITY', 'CODE-TRACE', 'UX-EXPLAIN'] },
  { id: 'TRIGGER-PROVIDER-CHANGE', label: 'Model-provider change', description: 'The model provider has changed.', affectedDomains: ['ENT', 'PRJ', 'CODE'], affectedComponents: ['ENT-DATA', 'ENT-RISK', 'PRJ-TESTING', 'CODE-SECURITY'] },
  { id: 'TRIGGER-CONFIG-CHANGE', label: 'Material prompt/configuration change', description: 'Material prompt or configuration changes affect system behavior.', affectedDomains: ['PRJ', 'CODE'], affectedComponents: ['PRJ-TESTING', 'CODE-STANDARDS'] },
  { id: 'TRIGGER-DATA-CHANGE', label: 'Major dataset or RAG-source change', description: 'Training data, retrieval sources or operational data have materially changed.', affectedDomains: ['ENT', 'PRJ'], affectedComponents: ['ENT-DATA', 'ENT-RISK', 'PRJ-TESTING'] },
  { id: 'TRIGGER-TOOL-AUTHORITY-CHANGE', label: 'Tool/agent authority change', description: 'The tools or authority granted to an agent have changed.', affectedDomains: ['PRJ', 'CODE', 'UX'], affectedComponents: ['PRJ-BUSINESS', 'CODE-STANDARDS', 'CODE-HUMAN', 'UX-IMPACT'] },
  { id: 'TRIGGER-NEW-INTEGRATION', label: 'New integration', description: 'A new integration has been added to the system.', affectedDomains: ['PRJ', 'CODE'], affectedComponents: ['PRJ-TESTING', 'CODE-SECURITY', 'CODE-TRACE'] },
  { id: 'TRIGGER-DEPENDENCY-CHANGE', label: 'Material dependency change', description: 'A material dependency has changed or been removed.', affectedDomains: ['CODE'], affectedComponents: ['CODE-SECURITY', 'CODE-TRACE'] },
  { id: 'TRIGGER-SECURITY-INCIDENT', label: 'Significant security incident', description: 'A significant security incident has occurred.', affectedDomains: ['ENT', 'CODE'], affectedComponents: ['ENT-RISK', 'ENT-POLICY', 'CODE-SECURITY', 'CODE-TRACE'] },
  { id: 'TRIGGER-EVAL-FAILURE', label: 'Significant evaluation failure', description: 'A significant evaluation failure has been detected.', affectedDomains: ['PRJ', 'CODE'], affectedComponents: ['PRJ-TESTING', 'PRJ-SCALE', 'CODE-STANDARDS'] },
  { id: 'TRIGGER-DRIFT', label: 'Material drift', description: 'Material model or behavioral drift has been detected.', affectedDomains: ['PRJ', 'UX'], affectedComponents: ['PRJ-TESTING', 'UX-ADOPTION', 'UX-EXPLAIN'] },
  { id: 'TRIGGER-USER-HARM', label: 'User harm/complaint pattern', description: 'A pattern of user harm or complaints has been identified.', affectedDomains: ['UX', 'PRJ', 'ENT'], affectedComponents: ['UX-IMPACT', 'UX-ADOPTION', 'PRJ-BUSINESS', 'ENT-RISK'] },
  { id: 'TRIGGER-JURISDICTION-CHANGE', label: 'Jurisdiction/regulatory-context change', description: 'The regulatory or jurisdictional context has changed.', affectedDomains: ['ENT'], affectedComponents: ['ENT-POLICY', 'ENT-RISK', 'ENT-MANDATE'] },
  { id: 'TRIGGER-POLICY-CHANGE', label: 'Major organizational policy change', description: 'Organizational AI governance policy has materially changed.', affectedDomains: ['ENT', 'PRJ', 'CODE', 'UX'], affectedComponents: ['ENT-POLICY', 'ENT-RISK', 'PRJ-BUSINESS', 'CODE-STANDARDS', 'UX-IMPACT'] },
  { id: 'TRIGGER-EXCEPTION-EXPIRY', label: 'Approved exception expiry', description: 'An approved exception has expired or is about to expire.', affectedDomains: ['ENT', 'PRJ', 'CODE', 'UX'], affectedComponents: [] },
  { id: 'TRIGGER-DECOMMISSION', label: 'Retirement/decommissioning', description: 'The system is being retired or decommissioned.', affectedDomains: ['ENT', 'PRJ'], affectedComponents: ['ENT-MANDATE', 'PRJ-PLAYBOOK'] },
]

// ============================================================================
// 16. COMPONENT DEPENDENCY GRAPH
// ============================================================================

export interface ComponentDependency {
  component: ComponentId
  dependsOn: ComponentId
  rule: string
}

export const componentDependencies: ComponentDependency[] = [
  { component: 'PRJ-SCALE', dependsOn: 'PRJ-TESTING', rule: 'Scale decision should not become READY if required controlled testing is incomplete.' },
  { component: 'PRJ-SCALE', dependsOn: 'PRJ-BUSINESS', rule: 'Scale decision requires an approved business case.' },
  { component: 'CODE-HUMAN', dependsOn: 'CODE-STANDARDS', rule: 'Human oversight requirements depend on applicable development standards.' },
  { component: 'CODE-SECURITY', dependsOn: 'CODE-STANDARDS', rule: 'Security protocols operate within defined development standards.' },
  { component: 'CODE-TRACE', dependsOn: 'CODE-STANDARDS', rule: 'Traceability logging follows defined standards for what must be traced.' },
  { component: 'UX-EXPLAIN', dependsOn: 'UX-IMPACT', rule: 'Explainability design depends on impact analysis to determine what must be explained.' },
  { component: 'UX-CAPABILITY', dependsOn: 'UX-EXPLAIN', rule: 'Capability development depends on what users need to understand (from explainability design).' },
  { component: 'UX-ADOPTION', dependsOn: 'UX-IMPACT', rule: 'Adoption measurement references impact analysis for what constitutes concerning usage.' },
  { component: 'PRJ-BUSINESS', dependsOn: 'ENT-MANDATE', rule: 'Business case should align with strategic mandate.' },
  { component: 'PRJ-BUSINESS', dependsOn: 'ENT-POLICY', rule: 'Business case must operate within policy boundaries.' },
  { component: 'PRJ-TESTING', dependsOn: 'ENT-RISK', rule: 'Controlled testing should address identified risks.' },
  { component: 'CODE-STANDARDS', dependsOn: 'PRJ-BUSINESS', rule: 'Development standards should reflect approved use case constraints.' },
]

// ============================================================================
// 17. ASSESSMENT INPUT SCHEMA
// ============================================================================

export interface AssessmentInput {
  systemId: string
  systemVersion: string
  assessmentAsOf: string
  intendedPurpose: string
  businessOwner: string
  technicalOwner: string
  affectedStakeholders: string[]
  deploymentContext: string
  models: ModelDescriptor[]
  providers: ProviderDescriptor[]
  dataSources: DataSourceDescriptor[]
  tools: ToolDescriptor[]
  agents: AgentDescriptor[]
  integrations: IntegrationDescriptor[]
  autonomyCharacteristics: AutonomyCharacteristics
  reversibilityCharacteristics: ReversibilityCharacteristics
  dataSensitivityContext: DataSensitivityContext
  externalImpactContext: ExternalImpactContext
  organizationPolicyProfile: PolicyProfile
  evidence: EvidenceRecord[]
  decisions: DecisionRecord[]
  exceptions: ExceptionRecord[]
}

export interface ModelDescriptor {
  id: string
  name: string
  version: string
  provider: string
  type: string
}

export interface ProviderDescriptor {
  id: string
  name: string
  role: string
}

export interface DataSourceDescriptor {
  id: string
  name: string
  type: string
  sensitivity: 'public' | 'internal' | 'confidential' | 'restricted'
}

export interface ToolDescriptor {
  id: string
  name: string
  authority: 'read-only' | 'write' | 'external-action'
}

export interface AgentDescriptor {
  id: string
  name: string
  tools: string[]
  autonomyLevel: 'human-approved' | 'supervised' | 'autonomous'
}

export interface IntegrationDescriptor {
  id: string
  name: string
  type: string
  criticality: 'low' | 'medium' | 'high'
}

export interface AutonomyCharacteristics {
  canActWithoutHumanApproval: boolean
  actionScope: string
}

export interface ReversibilityCharacteristics {
  actionsReversible: boolean
  reversalComplexity: 'trivial' | 'moderate' | 'difficult' | 'impossible'
}

export interface DataSensitivityContext {
  processesPersonalData: boolean
  processesSensitiveData: boolean
  dataCategories: string[]
}

export interface ExternalImpactContext {
  affectsExternalCustomers: boolean
  affectsIndividualsRights: boolean
  affectedPopulationSize: 'small' | 'medium' | 'large'
}

export interface PolicyProfile {
  profileName: string
  governanceDepth: GovernanceDepth
  activatedFactors: string[]
  customThresholds?: Record<string, unknown>
}

// ============================================================================
// 18. ASSESSMENT OUTPUT SCHEMA
// ============================================================================

export interface AssessmentOutput {
  specVersion: string
  policyVersion: string
  assessmentAsOf: string
  systemId: string
  governanceProfile: GovernanceDepth
  domainResults: DomainResult[]
  componentResults: ComponentResult[]
  blockers: Blocker[]
  humanReviewsRequired: HumanReviewItem[]
  exceptions: ExceptionSummary[]
  evidenceGaps: EvidenceGap[]
  reassessmentTriggers: ReassessmentTriggerSummary[]
  handoffs: HandoffStatus[]
  summary: AssessmentSummary
}

export interface ComponentResult {
  componentId: ComponentId
  domain: DomainId
  state: RequirementState
  applicable: boolean
  objectiveRuleResults: ObjectiveRuleResult[]
  humanJudgmentResults: HumanJudgmentResult[]
  evidenceStatus: EvidenceStatus[]
  blockingConditions: string[]
  remediation: string[]
}

export interface ObjectiveRuleResult {
  ruleId: string
  description: string
  evaluated: boolean
  passed: boolean
  resultState: RequirementState
  inputValues: Record<string, unknown>
  missingInputs: string[]
}

export interface HumanJudgmentResult {
  judgmentId: string
  question: string
  state: RequirementState
  reviewer?: string
  decision?: string
  rationale?: string
}

export interface EvidenceStatus {
  evidenceRequirementId: string
  label: string
  satisfied: boolean
  evidenceIds: string[]
  missing: boolean
  expired: boolean
}

export interface DomainResult {
  domainId: DomainId
  state: DomainState
  componentStates: Record<ComponentId, RequirementState>
}

export interface Blocker {
  componentId: ComponentId
  ruleId: string
  description: string
  remediation: string
}

export interface HumanReviewItem {
  componentId: ComponentId
  judgmentId: string
  question: string
}

export interface ExceptionSummary {
  exceptionId: string
  requirementId: string
  expiresAt: string
  expired: boolean
  scope: string
}

export interface EvidenceGap {
  componentId: ComponentId
  evidenceRequirementId: string
  label: string
  description: string
}

export interface ReassessmentTriggerSummary {
  triggerId: ReassessmentTriggerId
  label: string
  affectedComponents: ComponentId[]
}

export interface HandoffStatus {
  handoffId: string
  fromDomain: DomainId
  toDomain: DomainId
  ready: boolean
  missingFields: string[]
}

export interface AssessmentSummary {
  totalApplicable: number
  satisfied: number
  partial: number
  exceptions: number
  humanReviewRequired: number
  blockers: number
  reassessmentRequired: number
  evidenceCoverage: number
  systemState: SystemGovernanceState
}

// ============================================================================
// 19. PROVENANCE
// ============================================================================

export const csmV2Provenance = {
  originalArticleTitle: 'Cognitive System Management: A Framework for Enterprise AI Project Governance',
  originalAuthor: 'Subodh KC',
  originalPublication: 'AI Governance on Medium',
  originalPublicationDate: '2025-08-29',
  sourceUrl: 'https://medium.com/ai-governance-playbook/cognitive-system-management-a-framework-for-enterprise-ai-project-governance-ee7fc95a07ff',
  v2SpecificationDate: '2026-08-10',
  v2Label: 'CSM 2.0 is a formalization and extension of the original CSM publication. It does not claim the 2025 article contained V2 features.',
  determinismPrinciple:
    'CSM 2.0 makes governance deterministic where objective rules permit and makes human judgment explicit, attributable and traceable where interpretation is required.',
  determinismContract:
    'For a fixed CSM specification version, organizational policy configuration, explicit assessment date and normalized input record, objective CSM evaluation must produce the same computed requirement set and statuses.',
  legalDisclaimer:
    'CSM 2.0 does not produce legal compliance verdicts. It may produce governance requirements, evidence gaps, review requirements, decision records and framework mappings. Legal applicability or legal sufficiency must remain subject to qualified interpretation where needed.',
}

// ============================================================================
// 20. DETERMINISM BOUNDARY
// ============================================================================

export const DETERMINISTIC_DECISIONS = [
  'Whether an accountable owner is assigned (ENT-MANDATE)',
  'Whether a required evidence artifact exists (any component)',
  'Whether an exception has expired (any component)',
  'Whether a reassessment trigger has fired (system-wide)',
  'Whether a dependency is satisfied (component dependency graph)',
  'Whether evidence has expired (evidence schema)',
  'Whether a component is applicable based on system context (applicability rules)',
  'Whether required inputs are present (input validation)',
  'Whether a domain is ready for handoff (domain state derivation)',
  'Whether a blocker exists (blocking condition check)',
] as const

export const HUMAN_JUDGMENT_DECISIONS = [
  'Whether a use is ethically acceptable (ENT-POLICY)',
  'Whether residual risk is acceptable (ENT-RISK)',
  'Whether a legal obligation applies (ENT-POLICY)',
  'Whether an explanation is adequate for affected users (UX-EXPLAIN)',
  'Whether a business benefit justifies risk (PRJ-BUSINESS)',
  'Whether a scale decision should proceed (PRJ-SCALE)',
  'Whether human oversight is proportionate (CODE-HUMAN)',
  'Whether training is adequate for the system (UX-CAPABILITY)',
  'Whether an exception should be approved (any component)',
  'Whether a system is approved for a specific purpose (system-level approval)',
] as const

// ============================================================================
// 21. FORBIDDEN OUTPUT STATES
// ============================================================================

export const FORBIDDEN_OUTPUT_STATES = [
  'LEGAL_COMPLIANT',
  'EU_AI_ACT_COMPLIANT',
  'COMPLIANT',
  'SAFE',
  'TRUSTWORTHY',
  'CERTIFIED',
  'AUDIT_PROOF',
] as const

export const FORBIDDEN_SCORE_NAMES = [
  'compliance_score',
  'safety_score',
  'trust_score',
  'risk_score',
] as const
