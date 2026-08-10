/**
 * CSM 2.0 Governance Contracts
 *
 * One contract per original CSM component (16 total).
 * Each contract formalizes purpose, applicability, objective rules,
 * human judgment points, evidence requirements, handoffs and reassessment.
 *
 * These contracts are the canonical source for evaluation logic.
 */

import type {
  GovernanceContract,
  ComponentId,
} from './spec'

// ============================================================================
// CSM-Enterprise Contracts
// ============================================================================

export const ENT_POLICY: GovernanceContract = {
  id: 'ENT-POLICY',
  version: '2.0.0',
  domain: 'ENT',
  name: 'Policy Framework',
  purpose: 'Ensure AI ethics standards and organizational policies account for system behavior that may differ from conventional software.',
  coreQuestion: 'Are there organizational AI policies that apply to this system, and do they account for adaptive or probabilistic behavior?',
  applicability: [
    { field: 'systemId', operator: 'exists', description: 'Applies to all AI-enabled systems.' },
  ],
  requiredInputs: [
    { id: 'aiPolicyDocumented', label: 'AI policy documented', type: 'boolean', required: true, description: 'Whether organizational AI policies exist and are documented.' },
    { id: 'policyAddressesAdaptiveBehavior', label: 'Policy addresses adaptive behavior', type: 'boolean', required: true, description: 'Whether policies account for AI behavior that may change over time.' },
    { id: 'accountableOwner', label: 'Accountable owner', type: 'string', required: true, description: 'Named individual accountable for the system.' },
  ],
  optionalInputs: [
    { id: 'policyVersion', label: 'Policy version', type: 'string', required: false, description: 'Version of the organizational policy applied.' },
    { id: 'policyReviewDate', label: 'Policy review date', type: 'date', required: false, description: 'Date of last policy review.' },
  ],
  objectiveRules: [
    { id: 'ENT-POLICY-R1', description: 'AI policy must be documented.', condition: 'aiPolicyDocumented === true', passState: 'SATISFIED', failState: 'BLOCKED', blocking: true },
    { id: 'ENT-POLICY-R2', description: 'Policy must address adaptive/probabilistic behavior.', condition: 'policyAddressesAdaptiveBehavior === true', passState: 'SATISFIED', failState: 'PARTIAL', blocking: false },
    { id: 'ENT-POLICY-R3', description: 'Accountable owner must be assigned.', condition: 'accountableOwner exists and is non-empty', passState: 'SATISFIED', failState: 'BLOCKED', blocking: true },
  ],
  humanJudgmentPoints: [
    { id: 'ENT-POLICY-HJ1', question: 'Is the use ethically acceptable within organizational values?', description: 'Ethical acceptability cannot be computed from facts alone.', requiredOutput: 'APPROVE', requiresReviewer: true, requiresRationale: true, requiresEvidence: false },
    { id: 'ENT-POLICY-HJ2', question: 'Does a specific legal obligation apply to this use?', description: 'Legal applicability requires interpretation of regulations against system context.', requiredOutput: 'APPROVE', requiresReviewer: true, requiresRationale: true, requiresEvidence: true },
  ],
  requiredDecisions: [
    { id: 'ENT-POLICY-D1', question: 'Is the use ethically acceptable?', decisionType: 'human_approval', blocking: true },
    { id: 'ENT-POLICY-D2', question: 'Does a specific legal obligation apply?', decisionType: 'legal_review', blocking: true },
  ],
  requiredEvidence: [
    { id: 'ENT-POLICY-E1', label: 'AI policy document', description: 'Documented organizational AI policy.', evidenceType: 'document', required: true, expiresByDefault: false },
    { id: 'ENT-POLICY-E2', label: 'Accountable owner assignment', description: 'Record of accountable owner assignment.', evidenceType: 'record', required: true, expiresByDefault: false },
  ],
  responsibleRoles: ['AI Governance Lead', 'Policy Owner'],
  accountableRole: 'AI Governance Lead',
  outputs: ['Policy applicability determination', 'Accountable owner assignment', 'Ethical acceptability decision', 'Legal applicability determination'],
  blockingConditions: ['No AI policy documented', 'No accountable owner assigned'],
  allowedExceptions: {
    allowedReasons: ['Policy under development with interim controls', 'Legacy system with equivalent controls'],
    requiresCompensatingControls: true,
    maxDurationDays: 90,
    requiresAccountableApprover: true,
  },
  exceptionApproval: {
    approverRole: 'AI Governance Lead',
    requiresRationale: true,
    requiresEvidence: true,
    requiresCompensatingControls: true,
  },
  handoffTargets: [
    { targetDomain: 'PRJ', targetComponent: 'PRJ-BUSINESS', requiredOutputs: ['policyBoundaries', 'accountableOwner'] },
  ],
  handoffOutputs: ['policyBoundaries', 'accountableOwner', 'ethicalAcceptabilityDecision'],
  reassessmentTriggers: ['TRIGGER-USE-CHANGE', 'TRIGGER-JURISDICTION-CHANGE', 'TRIGGER-POLICY-CHANGE', 'TRIGGER-OWNER-CHANGE'],
  executionFunctionMappings: ['EF1-PURPOSE', 'EF6-COMPLIANCE'],
  sourceProvenance: 'Original CSM publication, August 29, 2025. V2 contract formalized 2026-08-10.',
  dependencies: [],
}

export const ENT_RISK: GovernanceContract = {
  id: 'ENT-RISK',
  version: '2.0.0',
  domain: 'ENT',
  name: 'Risk Assessment',
  purpose: 'Evaluate risks that account for AI system behavior which may change over time, including model updates, provider changes, or data drift.',
  coreQuestion: 'Has a risk assessment been performed that accounts for adaptive AI behavior and temporal change?',
  applicability: [
    { field: 'systemId', operator: 'exists', description: 'Applies to all AI-enabled systems.' },
  ],
  requiredInputs: [
    { id: 'riskAssessmentCompleted', label: 'Risk assessment completed', type: 'boolean', required: true, description: 'Whether a risk assessment has been performed.' },
    { id: 'riskAssessmentAddressesDrift', label: 'Assessment addresses drift', type: 'boolean', required: true, description: 'Whether the assessment considers model/behavioral drift.' },
    { id: 'riskAssessmentDate', label: 'Risk assessment date', type: 'date', required: true, description: 'Date the risk assessment was performed.' },
  ],
  optionalInputs: [
    { id: 'riskRegisterEntry', label: 'Risk register entry', type: 'string', required: false, description: 'Identifier in organizational risk register.' },
  ],
  objectiveRules: [
    { id: 'ENT-RISK-R1', description: 'Risk assessment must be completed.', condition: 'riskAssessmentCompleted === true', passState: 'SATISFIED', failState: 'REQUIRED', blocking: false },
    { id: 'ENT-RISK-R2', description: 'Assessment must address drift/temporal change.', condition: 'riskAssessmentAddressesDrift === true', passState: 'SATISFIED', failState: 'PARTIAL', blocking: false },
  ],
  humanJudgmentPoints: [
    { id: 'ENT-RISK-HJ1', question: 'Is the residual risk acceptable?', description: 'Residual risk acceptance requires human judgment about risk tolerance.', requiredOutput: 'APPROVE', requiresReviewer: true, requiresRationale: true, requiresEvidence: true },
  ],
  requiredDecisions: [
    { id: 'ENT-RISK-D1', question: 'Is residual risk acceptable?', decisionType: 'risk_acceptance', blocking: true },
  ],
  requiredEvidence: [
    { id: 'ENT-RISK-E1', label: 'Risk assessment document', description: 'Documented risk assessment.', evidenceType: 'document', required: true, expiresByDefault: true, defaultExpiryDays: 365 },
  ],
  responsibleRoles: ['Risk Manager', 'AI Governance Lead'],
  accountableRole: 'AI Governance Lead',
  outputs: ['Risk assessment', 'Residual risk acceptance decision', 'Risk register entry'],
  blockingConditions: ['No risk assessment completed for an INTENSIVE-profile system'],
  allowedExceptions: {
    allowedReasons: ['Risk assessment in progress with interim risk controls'],
    requiresCompensatingControls: true,
    maxDurationDays: 60,
    requiresAccountableApprover: true,
  },
  exceptionApproval: {
    approverRole: 'AI Governance Lead',
    requiresRationale: true,
    requiresEvidence: true,
    requiresCompensatingControls: true,
  },
  handoffTargets: [
    { targetDomain: 'PRJ', targetComponent: 'PRJ-TESTING', requiredOutputs: ['riskContext', 'identifiedRisks'] },
  ],
  handoffOutputs: ['riskContext', 'identifiedRisks'],
  reassessmentTriggers: ['TRIGGER-USE-CHANGE', 'TRIGGER-SECURITY-INCIDENT', 'TRIGGER-DRIFT', 'TRIGGER-USER-HARM', 'TRIGGER-POLICY-CHANGE'],
  executionFunctionMappings: ['EF3-RISK', 'EF1-PURPOSE'],
  sourceProvenance: 'Original CSM publication, August 29, 2025. V2 contract formalized 2026-08-10.',
  dependencies: [],
}

export const ENT_DATA: GovernanceContract = {
  id: 'ENT-DATA',
  version: '2.0.0',
  domain: 'ENT',
  name: 'Data Stewardship',
  purpose: 'Govern datasets that influence ongoing AI behavior, including training data, retrieval sources and operational data.',
  coreQuestion: 'Are data sources that influence AI behavior identified, owned and governed?',
  applicability: [
    { field: 'systemId', operator: 'exists', description: 'Applies to all AI-enabled systems that use or produce data.' },
  ],
  requiredInputs: [
    { id: 'dataSourcesIdentified', label: 'Data sources identified', type: 'boolean', required: true, description: 'Whether all data sources are identified and documented.' },
    { id: 'dataOwnersAssigned', label: 'Data owners assigned', type: 'boolean', required: true, description: 'Whether each data source has an assigned owner/steward.' },
    { id: 'dataSensitivityClassified', label: 'Data sensitivity classified', type: 'boolean', required: true, description: 'Whether data sensitivity has been classified.' },
  ],
  optionalInputs: [
    { id: 'dataLineageDocumented', label: 'Data lineage documented', type: 'boolean', required: false, description: 'Whether data lineage is documented.' },
  ],
  objectiveRules: [
    { id: 'ENT-DATA-R1', description: 'Data sources must be identified.', condition: 'dataSourcesIdentified === true', passState: 'SATISFIED', failState: 'REQUIRED', blocking: false },
    { id: 'ENT-DATA-R2', description: 'Each data source must have an assigned owner.', condition: 'dataOwnersAssigned === true', passState: 'SATISFIED', failState: 'PARTIAL', blocking: false },
    { id: 'ENT-DATA-R3', description: 'Data sensitivity must be classified.', condition: 'dataSensitivityClassified === true', passState: 'SATISFIED', failState: 'PARTIAL', blocking: false },
  ],
  humanJudgmentPoints: [],
  requiredDecisions: [],
  requiredEvidence: [
    { id: 'ENT-DATA-E1', label: 'Data source inventory', description: 'Inventory of data sources with owners and classifications.', evidenceType: 'document', required: true, expiresByDefault: false },
  ],
  responsibleRoles: ['Data Steward', 'Data Governance Lead'],
  accountableRole: 'Data Governance Lead',
  outputs: ['Data source inventory', 'Data ownership assignments', 'Data sensitivity classifications'],
  blockingConditions: [],
  allowedExceptions: {
    allowedReasons: ['Data inventory in progress with critical sources identified'],
    requiresCompensatingControls: true,
    maxDurationDays: 90,
    requiresAccountableApprover: true,
  },
  exceptionApproval: {
    approverRole: 'Data Governance Lead',
    requiresRationale: true,
    requiresEvidence: true,
    requiresCompensatingControls: true,
  },
  handoffTargets: [
    { targetDomain: 'PRJ', requiredOutputs: ['dataOwnership', 'dataSensitivityClassifications'] },
  ],
  handoffOutputs: ['dataOwnership', 'dataSensitivityClassifications'],
  reassessmentTriggers: ['TRIGGER-DATA-CHANGE', 'TRIGGER-PROVIDER-CHANGE', 'TRIGGER-POLICY-CHANGE'],
  executionFunctionMappings: ['EF2-MAPPING', 'EF6-COMPLIANCE'],
  sourceProvenance: 'Original CSM publication, August 29, 2025. V2 contract formalized 2026-08-10.',
  dependencies: [],
}

export const ENT_MANDATE: GovernanceContract = {
  id: 'ENT-MANDATE',
  version: '2.0.0',
  domain: 'ENT',
  name: 'Strategic Mandate',
  purpose: 'Define organizational authority and strategic alignment that establishes why AI systems are deployed and what boundaries apply.',
  coreQuestion: 'Is there a documented strategic mandate with a named accountable owner and defined boundaries?',
  applicability: [
    { field: 'systemId', operator: 'exists', description: 'Applies to all AI-enabled systems.' },
  ],
  requiredInputs: [
    { id: 'strategicMandateDocumented', label: 'Strategic mandate documented', type: 'boolean', required: true, description: 'Whether a strategic mandate exists.' },
    { id: 'accountableOwner', label: 'Accountable owner', type: 'string', required: true, description: 'Named individual accountable for the system.' },
    { id: 'mandateBoundaries', label: 'Mandate boundaries', type: 'string', required: true, description: 'Defined boundaries on what the system may and may not do.' },
  ],
  optionalInputs: [],
  objectiveRules: [
    { id: 'ENT-MANDATE-R1', description: 'Strategic mandate must be documented.', condition: 'strategicMandateDocumented === true', passState: 'SATISFIED', failState: 'BLOCKED', blocking: true },
    { id: 'ENT-MANDATE-R2', description: 'Accountable owner must be assigned.', condition: 'accountableOwner exists and is non-empty', passState: 'SATISFIED', failState: 'BLOCKED', blocking: true },
    { id: 'ENT-MANDATE-R3', description: 'Mandate boundaries must be defined.', condition: 'mandateBoundaries exists and is non-empty', passState: 'SATISFIED', failState: 'PARTIAL', blocking: false },
  ],
  humanJudgmentPoints: [],
  requiredDecisions: [],
  requiredEvidence: [
    { id: 'ENT-MANDATE-E1', label: 'Strategic mandate document', description: 'Documented strategic mandate with owner and boundaries.', evidenceType: 'document', required: true, expiresByDefault: false },
  ],
  responsibleRoles: ['Executive Sponsor', 'AI Governance Lead'],
  accountableRole: 'Executive Sponsor',
  outputs: ['Strategic mandate', 'Accountable owner assignment', 'Boundary definitions'],
  blockingConditions: ['No strategic mandate documented', 'No accountable owner assigned'],
  allowedExceptions: {
    allowedReasons: ['Mandate under executive review with interim authorization'],
    requiresCompensatingControls: true,
    maxDurationDays: 30,
    requiresAccountableApprover: true,
  },
  exceptionApproval: {
    approverRole: 'Executive Sponsor',
    requiresRationale: true,
    requiresEvidence: true,
    requiresCompensatingControls: true,
  },
  handoffTargets: [
    { targetDomain: 'PRJ', targetComponent: 'PRJ-BUSINESS', requiredOutputs: ['intendedPurpose', 'accountableOwner', 'strategicMandate'] },
  ],
  handoffOutputs: ['intendedPurpose', 'accountableOwner', 'strategicMandate'],
  reassessmentTriggers: ['TRIGGER-OWNER-CHANGE', 'TRIGGER-USE-CHANGE', 'TRIGGER-POLICY-CHANGE'],
  executionFunctionMappings: ['EF1-PURPOSE'],
  sourceProvenance: 'Original CSM publication, August 29, 2025. V2 contract formalized 2026-08-10.',
  dependencies: [],
}

// ============================================================================
// CSM-Project Contracts
// ============================================================================

export const PRJ_BUSINESS: GovernanceContract = {
  id: 'PRJ-BUSINESS',
  version: '2.0.0',
  domain: 'PRJ',
  name: 'Business Case Definition',
  purpose: 'Define what problem or value is being tested. The business case defines the hypothesis an AI initiative is evaluating.',
  coreQuestion: 'Is there a documented business case with success criteria and risk-benefit evaluation?',
  applicability: [
    { field: 'systemId', operator: 'exists', description: 'Applies to all AI initiatives.' },
  ],
  requiredInputs: [
    { id: 'businessCaseDocumented', label: 'Business case documented', type: 'boolean', required: true, description: 'Whether a business case exists.' },
    { id: 'successCriteriaDefined', label: 'Success criteria defined', type: 'boolean', required: true, description: 'Whether measurable success criteria exist.' },
    { id: 'riskBenefitEvaluated', label: 'Risk-benefit evaluated', type: 'boolean', required: true, description: 'Whether risk-benefit has been evaluated.' },
  ],
  optionalInputs: [
    { id: 'hypothesisStatement', label: 'Hypothesis statement', type: 'string', required: false, description: 'Explicit hypothesis being tested.' },
  ],
  objectiveRules: [
    { id: 'PRJ-BUSINESS-R1', description: 'Business case must be documented.', condition: 'businessCaseDocumented === true', passState: 'SATISFIED', failState: 'REQUIRED', blocking: false },
    { id: 'PRJ-BUSINESS-R2', description: 'Success criteria must be defined.', condition: 'successCriteriaDefined === true', passState: 'SATISFIED', failState: 'PARTIAL', blocking: false },
  ],
  humanJudgmentPoints: [
    { id: 'PRJ-BUSINESS-HJ1', question: 'Does the business benefit justify the risk?', description: 'Risk-benefit justification requires human judgment about value and tolerance.', requiredOutput: 'APPROVE', requiresReviewer: true, requiresRationale: true, requiresEvidence: true },
  ],
  requiredDecisions: [
    { id: 'PRJ-BUSINESS-D1', question: 'Does the business benefit justify the risk?', decisionType: 'risk_acceptance', blocking: true },
  ],
  requiredEvidence: [
    { id: 'PRJ-BUSINESS-E1', label: 'Business case document', description: 'Documented business case with success criteria.', evidenceType: 'document', required: true, expiresByDefault: false },
  ],
  responsibleRoles: ['Product Manager', 'Project Lead'],
  accountableRole: 'Product Manager',
  outputs: ['Business case', 'Success criteria', 'Risk-benefit decision'],
  blockingConditions: [],
  allowedExceptions: {
    allowedReasons: ['Business case under development with interim scope'],
    requiresCompensatingControls: false,
    maxDurationDays: 30,
    requiresAccountableApprover: true,
  },
  exceptionApproval: {
    approverRole: 'Product Manager',
    requiresRationale: true,
    requiresEvidence: false,
    requiresCompensatingControls: false,
  },
  handoffTargets: [
    { targetDomain: 'CODE', targetComponent: 'CODE-STANDARDS', requiredOutputs: ['approvedUseCase', 'businessSuccessCriteria', 'applicableConstraints'] },
  ],
  handoffOutputs: ['approvedUseCase', 'businessSuccessCriteria', 'applicableConstraints'],
  reassessmentTriggers: ['TRIGGER-USE-CHANGE', 'TRIGGER-SCOPE-EXPANSION'],
  executionFunctionMappings: ['EF1-PURPOSE', 'EF3-RISK'],
  sourceProvenance: 'Original CSM publication, August 29, 2025. V2 contract formalized 2026-08-10.',
  dependencies: ['ENT-MANDATE', 'ENT-POLICY'],
}

export const PRJ_TESTING: GovernanceContract = {
  id: 'PRJ-TESTING',
  version: '2.0.0',
  domain: 'PRJ',
  name: 'Controlled Testing',
  purpose: 'Define what must be learned before scale. Testing designed to answer specific governance and performance questions.',
  coreQuestion: 'Is there a controlled testing plan that addresses identified risks and success criteria?',
  applicability: [
    { field: 'systemId', operator: 'exists', description: 'Applies to all AI initiatives.' },
  ],
  requiredInputs: [
    { id: 'testingPlanDocumented', label: 'Testing plan documented', type: 'boolean', required: true, description: 'Whether a testing plan exists.' },
    { id: 'testingAddressesRisks', label: 'Testing addresses risks', type: 'boolean', required: true, description: 'Whether testing addresses identified risks.' },
    { id: 'testingResultsRecorded', label: 'Testing results recorded', type: 'boolean', required: true, description: 'Whether testing results are recorded.' },
  ],
  optionalInputs: [
    { id: 'testingEnvironment', label: 'Testing environment', type: 'string', required: false, description: 'Description of testing environment.' },
  ],
  objectiveRules: [
    { id: 'PRJ-TESTING-R1', description: 'Testing plan must be documented.', condition: 'testingPlanDocumented === true', passState: 'SATISFIED', failState: 'REQUIRED', blocking: false },
    { id: 'PRJ-TESTING-R2', description: 'Testing must address identified risks.', condition: 'testingAddressesRisks === true', passState: 'SATISFIED', failState: 'PARTIAL', blocking: false },
    { id: 'PRJ-TESTING-R3', description: 'Testing results must be recorded.', condition: 'testingResultsRecorded === true', passState: 'SATISFIED', failState: 'IN_PROGRESS', blocking: false },
  ],
  humanJudgmentPoints: [],
  requiredDecisions: [],
  requiredEvidence: [
    { id: 'PRJ-TESTING-E1', label: 'Testing plan', description: 'Documented testing plan with risk coverage.', evidenceType: 'document', required: true, expiresByDefault: false },
    { id: 'PRJ-TESTING-E2', label: 'Testing results', description: 'Recorded testing results.', evidenceType: 'document', required: true, expiresByDefault: true, defaultExpiryDays: 365 },
  ],
  responsibleRoles: ['QA Lead', 'Project Lead'],
  accountableRole: 'Project Lead',
  outputs: ['Testing plan', 'Testing results', 'Risk coverage analysis'],
  blockingConditions: [],
  allowedExceptions: {
    allowedReasons: ['Testing in progress with interim results'],
    requiresCompensatingControls: true,
    maxDurationDays: 60,
    requiresAccountableApprover: true,
  },
  exceptionApproval: {
    approverRole: 'Project Lead',
    requiresRationale: true,
    requiresEvidence: true,
    requiresCompensatingControls: true,
  },
  handoffTargets: [
    { targetDomain: 'PRJ', targetComponent: 'PRJ-SCALE', requiredOutputs: ['evaluationCriteria', 'testingResults'] },
  ],
  handoffOutputs: ['evaluationCriteria', 'testingResults'],
  reassessmentTriggers: ['TRIGGER-MODEL-CHANGE', 'TRIGGER-CONFIG-CHANGE', 'TRIGGER-DATA-CHANGE', 'TRIGGER-EVAL-FAILURE', 'TRIGGER-DRIFT'],
  executionFunctionMappings: ['EF3-RISK', 'EF4-DELIVERY'],
  sourceProvenance: 'Original CSM publication, August 29, 2025. V2 contract formalized 2026-08-10.',
  dependencies: ['ENT-RISK'],
}

export const PRJ_SCALE: GovernanceContract = {
  id: 'PRJ-SCALE',
  version: '2.0.0',
  domain: 'PRJ',
  name: 'Scale Decision Framework',
  purpose: 'Define what evidence justifies broader commitment. Defined criteria for deciding whether to proceed, change or stop.',
  coreQuestion: 'Is there a documented scale decision with explicit criteria and evidence?',
  applicability: [
    { field: 'systemId', operator: 'exists', description: 'Applies to all AI initiatives approaching scale decisions.' },
  ],
  requiredInputs: [
    { id: 'scaleCriteriaDocumented', label: 'Scale criteria documented', type: 'boolean', required: true, description: 'Whether scale decision criteria are documented.' },
    { id: 'scaleDecisionMade', label: 'Scale decision made', type: 'boolean', required: true, description: 'Whether a scale decision has been made.' },
    { id: 'scaleDecisionEvidence', label: 'Scale decision evidence', type: 'string', required: true, description: 'Evidence supporting the scale decision.' },
  ],
  optionalInputs: [],
  objectiveRules: [
    { id: 'PRJ-SCALE-R1', description: 'Scale criteria must be documented.', condition: 'scaleCriteriaDocumented === true', passState: 'SATISFIED', failState: 'REQUIRED', blocking: false },
    { id: 'PRJ-SCALE-R2', description: 'Scale decision must be made with evidence.', condition: 'scaleDecisionMade === true AND scaleDecisionEvidence exists', passState: 'SATISFIED', failState: 'IN_PROGRESS', blocking: false },
  ],
  humanJudgmentPoints: [
    { id: 'PRJ-SCALE-HJ1', question: 'Should the system proceed to scale?', description: 'Scale decision requires human judgment about whether evidence is sufficient.', requiredOutput: 'APPROVE', requiresReviewer: true, requiresRationale: true, requiresEvidence: true },
  ],
  requiredDecisions: [
    { id: 'PRJ-SCALE-D1', question: 'Should the system proceed to scale?', decisionType: 'human_approval', blocking: true },
  ],
  requiredEvidence: [
    { id: 'PRJ-SCALE-E1', label: 'Scale decision document', description: 'Documented scale decision with criteria and evidence.', evidenceType: 'document', required: true, expiresByDefault: false },
  ],
  responsibleRoles: ['Project Lead', 'Executive Sponsor'],
  accountableRole: 'Executive Sponsor',
  outputs: ['Scale decision', 'Scale criteria', 'Decision rationale'],
  blockingConditions: ['Scale decision attempted before testing is complete (dependency on PRJ-TESTING)'],
  allowedExceptions: {
    allowedReasons: ['Limited scale with enhanced monitoring'],
    requiresCompensatingControls: true,
    maxDurationDays: 90,
    requiresAccountableApprover: true,
  },
  exceptionApproval: {
    approverRole: 'Executive Sponsor',
    requiresRationale: true,
    requiresEvidence: true,
    requiresCompensatingControls: true,
  },
  handoffTargets: [
    { targetDomain: 'PRJ', targetComponent: 'PRJ-PLAYBOOK', requiredOutputs: ['scaleDecision', 'releaseExpectations'] },
  ],
  handoffOutputs: ['scaleDecision', 'releaseExpectations', 'scaleDecisionCriteria'],
  reassessmentTriggers: ['TRIGGER-SCOPE-EXPANSION', 'TRIGGER-EVAL-FAILURE', 'TRIGGER-DRIFT'],
  executionFunctionMappings: ['EF4-DELIVERY'],
  sourceProvenance: 'Original CSM publication, August 29, 2025. V2 contract formalized 2026-08-10.',
  dependencies: ['PRJ-TESTING', 'PRJ-BUSINESS'],
}

export const PRJ_PLAYBOOK: GovernanceContract = {
  id: 'PRJ-PLAYBOOK',
  version: '2.0.0',
  domain: 'PRJ',
  name: 'Playbook Documentation',
  purpose: 'Define what decisions and learning need to survive beyond the pilot team. Documentation that transfers knowledge to operational owners.',
  coreQuestion: 'Is there a playbook that transfers pilot decisions, learning and operational requirements to ongoing owners?',
  applicability: [
    { field: 'systemId', operator: 'exists', description: 'Applies to all AI initiatives transitioning to operations.' },
  ],
  requiredInputs: [
    { id: 'playbookDocumented', label: 'Playbook documented', type: 'boolean', required: true, description: 'Whether a playbook exists.' },
    { id: 'playbookIncludesDecisions', label: 'Playbook includes decisions', type: 'boolean', required: true, description: 'Whether the playbook documents key decisions.' },
    { id: 'operationalOwnersIdentified', label: 'Operational owners identified', type: 'boolean', required: true, description: 'Whether operational owners are identified.' },
  ],
  optionalInputs: [],
  objectiveRules: [
    { id: 'PRJ-PLAYBOOK-R1', description: 'Playbook must be documented.', condition: 'playbookDocumented === true', passState: 'SATISFIED', failState: 'REQUIRED', blocking: false },
    { id: 'PRJ-PLAYBOOK-R2', description: 'Playbook must include key decisions.', condition: 'playbookIncludesDecisions === true', passState: 'SATISFIED', failState: 'PARTIAL', blocking: false },
    { id: 'PRJ-PLAYBOOK-R3', description: 'Operational owners must be identified.', condition: 'operationalOwnersIdentified === true', passState: 'SATISFIED', failState: 'PARTIAL', blocking: false },
  ],
  humanJudgmentPoints: [],
  requiredDecisions: [],
  requiredEvidence: [
    { id: 'PRJ-PLAYBOOK-E1', label: 'Playbook document', description: 'Documented playbook with decisions and operational requirements.', evidenceType: 'document', required: true, expiresByDefault: false },
  ],
  responsibleRoles: ['Project Lead', 'Operations Lead'],
  accountableRole: 'Project Lead',
  outputs: ['Playbook', 'Operational owner assignments', 'Decision log'],
  blockingConditions: [],
  allowedExceptions: {
    allowedReasons: ['Playbook in development with interim handover notes'],
    requiresCompensatingControls: false,
    maxDurationDays: 30,
    requiresAccountableApprover: true,
  },
  exceptionApproval: {
    approverRole: 'Project Lead',
    requiresRationale: true,
    requiresEvidence: false,
    requiresCompensatingControls: false,
  },
  handoffTargets: [
    { targetDomain: 'ENT', requiredOutputs: ['lessonsRequiringEnterpriseChange', 'discoveredDependencies'] },
  ],
  handoffOutputs: ['lessonsRequiringEnterpriseChange', 'discoveredDependencies', 'operationalRequirements'],
  reassessmentTriggers: ['TRIGGER-DECOMMISSION', 'TRIGGER-POLICY-CHANGE'],
  executionFunctionMappings: ['EF5-OVERSIGHT', 'EF6-COMPLIANCE'],
  sourceProvenance: 'Original CSM publication, August 29, 2025. V2 contract formalized 2026-08-10.',
  dependencies: [],
}

// ============================================================================
// CSM-Code Contracts
// ============================================================================

export const CODE_STANDARDS: GovernanceContract = {
  id: 'CODE-STANDARDS',
  version: '2.0.0',
  domain: 'CODE',
  name: 'Development Standards',
  purpose: 'Engineering standards that account for AI-assisted development, including review requirements and quality expectations.',
  coreQuestion: 'Are there development standards that address AI-assisted code generation, review and quality?',
  applicability: [
    { field: 'systemId', operator: 'exists', description: 'Applies to all systems where AI assists code generation or modification.' },
  ],
  requiredInputs: [
    { id: 'aiAssistedDevStandardsDocumented', label: 'AI-assisted dev standards documented', type: 'boolean', required: true, description: 'Whether standards for AI-assisted development exist.' },
    { id: 'reviewRequirementsDefined', label: 'Review requirements defined', type: 'boolean', required: true, description: 'Whether review requirements for AI-generated code are defined.' },
  ],
  optionalInputs: [
    { id: 'allowedTools', label: 'Allowed AI tools', type: 'array', required: false, description: 'List of approved AI development tools.' },
  ],
  objectiveRules: [
    { id: 'CODE-STANDARDS-R1', description: 'AI-assisted development standards must be documented.', condition: 'aiAssistedDevStandardsDocumented === true', passState: 'SATISFIED', failState: 'REQUIRED', blocking: false },
    { id: 'CODE-STANDARDS-R2', description: 'Review requirements for AI-generated code must be defined.', condition: 'reviewRequirementsDefined === true', passState: 'SATISFIED', failState: 'PARTIAL', blocking: false },
  ],
  humanJudgmentPoints: [],
  requiredDecisions: [],
  requiredEvidence: [
    { id: 'CODE-STANDARDS-E1', label: 'Development standards document', description: 'Documented standards for AI-assisted development.', evidenceType: 'document', required: true, expiresByDefault: false },
  ],
  responsibleRoles: ['Engineering Lead', 'Tech Lead'],
  accountableRole: 'Engineering Lead',
  outputs: ['Development standards', 'Review requirements', 'Allowed tools list'],
  blockingConditions: [],
  allowedExceptions: {
    allowedReasons: ['Standards under development with interim review process'],
    requiresCompensatingControls: true,
    maxDurationDays: 60,
    requiresAccountableApprover: true,
  },
  exceptionApproval: {
    approverRole: 'Engineering Lead',
    requiresRationale: true,
    requiresEvidence: true,
    requiresCompensatingControls: true,
  },
  handoffTargets: [
    { targetDomain: 'CODE', targetComponent: 'CODE-HUMAN', requiredOutputs: ['reviewRequirements'] },
  ],
  handoffOutputs: ['reviewRequirements', 'qualityExpectations'],
  reassessmentTriggers: ['TRIGGER-TOOL-AUTHORITY-CHANGE', 'TRIGGER-POLICY-CHANGE'],
  executionFunctionMappings: ['EF4-DELIVERY'],
  sourceProvenance: 'Original CSM publication, August 29, 2025. V2 contract formalized 2026-08-10.',
  dependencies: ['PRJ-BUSINESS'],
}

export const CODE_SECURITY: GovernanceContract = {
  id: 'CODE-SECURITY',
  version: '2.0.0',
  domain: 'CODE',
  name: 'Security Protocols',
  purpose: 'Security practices that address AI-generated code, including vulnerability scanning and dependency verification.',
  coreQuestion: 'Are security protocols in place that address AI-generated code vulnerabilities and dependencies?',
  applicability: [
    { field: 'systemId', operator: 'exists', description: 'Applies to all systems where AI assists code generation or modification.' },
  ],
  requiredInputs: [
    { id: 'securityScanningActive', label: 'Security scanning active', type: 'boolean', required: true, description: 'Whether automated security scanning is active.' },
    { id: 'dependencyVerificationProcess', label: 'Dependency verification process', type: 'boolean', required: true, description: 'Whether dependency verification is performed.' },
    { id: 'securityReviewArtifact', label: 'Security review artifact', type: 'boolean', required: true, description: 'Whether a security review artifact exists.' },
  ],
  optionalInputs: [],
  objectiveRules: [
    { id: 'CODE-SECURITY-R1', description: 'Security scanning must be active.', condition: 'securityScanningActive === true', passState: 'SATISFIED', failState: 'BLOCKED', blocking: true },
    { id: 'CODE-SECURITY-R2', description: 'Dependency verification must be performed.', condition: 'dependencyVerificationProcess === true', passState: 'SATISFIED', failState: 'PARTIAL', blocking: false },
    { id: 'CODE-SECURITY-R3', description: 'Security review artifact must exist.', condition: 'securityReviewArtifact === true', passState: 'SATISFIED', failState: 'BLOCKED', blocking: true },
  ],
  humanJudgmentPoints: [],
  requiredDecisions: [],
  requiredEvidence: [
    { id: 'CODE-SECURITY-E1', label: 'Security scan results', description: 'Results of automated security scans.', evidenceType: 'document', required: true, expiresByDefault: true, defaultExpiryDays: 90 },
    { id: 'CODE-SECURITY-E2', label: 'Security review document', description: 'Documented security review.', evidenceType: 'document', required: true, expiresByDefault: true, defaultExpiryDays: 180 },
  ],
  responsibleRoles: ['Security Engineer', 'Engineering Lead'],
  accountableRole: 'Engineering Lead',
  outputs: ['Security scan results', 'Security review', 'Dependency verification results'],
  blockingConditions: ['No security scanning active', 'No security review artifact for INTENSIVE-profile systems'],
  allowedExceptions: {
    allowedReasons: ['Scanning being configured with interim manual review'],
    requiresCompensatingControls: true,
    maxDurationDays: 30,
    requiresAccountableApprover: true,
  },
  exceptionApproval: {
    approverRole: 'Engineering Lead',
    requiresRationale: true,
    requiresEvidence: true,
    requiresCompensatingControls: true,
  },
  handoffTargets: [
    { targetDomain: 'UX', requiredOutputs: ['securityTestResults', 'knownLimitations'] },
  ],
  handoffOutputs: ['securityTestResults', 'knownLimitations'],
  reassessmentTriggers: ['TRIGGER-SECURITY-INCIDENT', 'TRIGGER-NEW-INTEGRATION', 'TRIGGER-DEPENDENCY-CHANGE', 'TRIGGER-MODEL-CHANGE'],
  executionFunctionMappings: ['EF3-RISK', 'EF4-DELIVERY'],
  sourceProvenance: 'Original CSM publication, August 29, 2025. V2 contract formalized 2026-08-10.',
  dependencies: ['CODE-STANDARDS'],
}

export const CODE_HUMAN: GovernanceContract = {
  id: 'CODE-HUMAN',
  version: '2.0.0',
  domain: 'CODE',
  name: 'Human Oversight',
  purpose: 'Human review of AI-assisted contributions proportionate to risk and consequence.',
  coreQuestion: 'Is there a defined human review process for AI-assisted contributions proportionate to risk?',
  applicability: [
    { field: 'systemId', operator: 'exists', description: 'Applies to all systems where AI assists code generation or modification.' },
  ],
  requiredInputs: [
    { id: 'humanReviewProcessDefined', label: 'Human review process defined', type: 'boolean', required: true, description: 'Whether a human review process for AI-assisted code is defined.' },
    { id: 'reviewProportionateToRisk', label: 'Review proportionate to risk', type: 'boolean', required: true, description: 'Whether review depth scales with risk.' },
  ],
  optionalInputs: [],
  objectiveRules: [
    { id: 'CODE-HUMAN-R1', description: 'Human review process must be defined.', condition: 'humanReviewProcessDefined === true', passState: 'SATISFIED', failState: 'REQUIRED', blocking: false },
    { id: 'CODE-HUMAN-R2', description: 'Review must be proportionate to risk.', condition: 'reviewProportionateToRisk === true', passState: 'SATISFIED', failState: 'PARTIAL', blocking: false },
  ],
  humanJudgmentPoints: [
    { id: 'CODE-HUMAN-HJ1', question: 'Is the human oversight proportionate for this system risk profile?', description: 'Proportionality assessment requires judgment about risk and oversight adequacy.', requiredOutput: 'APPROVE', requiresReviewer: true, requiresRationale: true, requiresEvidence: false },
  ],
  requiredDecisions: [
    { id: 'CODE-HUMAN-D1', question: 'Is human oversight proportionate?', decisionType: 'human_approval', blocking: false },
  ],
  requiredEvidence: [
    { id: 'CODE-HUMAN-E1', label: 'Review process document', description: 'Documented human review process.', evidenceType: 'document', required: true, expiresByDefault: false },
  ],
  responsibleRoles: ['Engineering Lead', 'Senior Developer'],
  accountableRole: 'Engineering Lead',
  outputs: ['Human review process', 'Review proportionality assessment'],
  blockingConditions: [],
  allowedExceptions: {
    allowedReasons: ['Process under definition with interim pairwise review'],
    requiresCompensatingControls: true,
    maxDurationDays: 30,
    requiresAccountableApprover: true,
  },
  exceptionApproval: {
    approverRole: 'Engineering Lead',
    requiresRationale: true,
    requiresEvidence: false,
    requiresCompensatingControls: true,
  },
  handoffTargets: [],
  handoffOutputs: ['oversightProcessSummary'],
  reassessmentTriggers: ['TRIGGER-TOOL-AUTHORITY-CHANGE', 'TRIGGER-SCOPE-EXPANSION'],
  executionFunctionMappings: ['EF5-OVERSIGHT'],
  sourceProvenance: 'Original CSM publication, August 29, 2025. V2 contract formalized 2026-08-10.',
  dependencies: ['CODE-STANDARDS'],
}

export const CODE_TRACE: GovernanceContract = {
  id: 'CODE-TRACE',
  version: '2.0.0',
  domain: 'CODE',
  name: 'Traceability Logging',
  purpose: 'Records that provide appropriate provenance for AI-assisted changes where risk warrants it.',
  coreQuestion: 'Is there traceability logging that records AI-assisted changes with appropriate provenance?',
  applicability: [
    { field: 'systemId', operator: 'exists', description: 'Applies to all systems where AI assists code generation or modification.' },
  ],
  requiredInputs: [
    { id: 'traceabilityLoggingActive', label: 'Traceability logging active', type: 'boolean', required: true, description: 'Whether traceability logging is active.' },
    { id: 'aiAssistedChangesTracked', label: 'AI-assisted changes tracked', type: 'boolean', required: true, description: 'Whether AI-assisted changes are tracked in logs.' },
  ],
  optionalInputs: [
    { id: 'logRetentionDays', label: 'Log retention (days)', type: 'number', required: false, description: 'Retention period for traceability logs.' },
  ],
  objectiveRules: [
    { id: 'CODE-TRACE-R1', description: 'Traceability logging must be active.', condition: 'traceabilityLoggingActive === true', passState: 'SATISFIED', failState: 'REQUIRED', blocking: false },
    { id: 'CODE-TRACE-R2', description: 'AI-assisted changes must be tracked.', condition: 'aiAssistedChangesTracked === true', passState: 'SATISFIED', failState: 'PARTIAL', blocking: false },
  ],
  humanJudgmentPoints: [],
  requiredDecisions: [],
  requiredEvidence: [
    { id: 'CODE-TRACE-E1', label: 'Traceability log configuration', description: 'Configuration showing logging is active and what is tracked.', evidenceType: 'record', required: true, expiresByDefault: false },
  ],
  responsibleRoles: ['Engineering Lead', 'DevOps Lead'],
  accountableRole: 'Engineering Lead',
  outputs: ['Traceability logs', 'AI-assisted change records'],
  blockingConditions: [],
  allowedExceptions: {
    allowedReasons: ['Logging being configured with interim manual tracking'],
    requiresCompensatingControls: true,
    maxDurationDays: 30,
    requiresAccountableApprover: true,
  },
  exceptionApproval: {
    approverRole: 'Engineering Lead',
    requiresRationale: true,
    requiresEvidence: true,
    requiresCompensatingControls: true,
  },
  handoffTargets: [],
  handoffOutputs: ['traceabilityRecords'],
  reassessmentTriggers: ['TRIGGER-TOOL-AUTHORITY-CHANGE', 'TRIGGER-POLICY-CHANGE'],
  executionFunctionMappings: ['EF6-COMPLIANCE', 'EF2-MAPPING'],
  sourceProvenance: 'Original CSM publication, August 29, 2025. V2 contract formalized 2026-08-10.',
  dependencies: ['CODE-STANDARDS'],
}

// ============================================================================
// CSM-UX Contracts
// ============================================================================

export const UX_IMPACT: GovernanceContract = {
  id: 'UX-IMPACT',
  version: '2.0.0',
  domain: 'UX',
  name: 'Impact Analysis',
  purpose: 'Assessment of how AI-supported outcomes affect individuals, groups and workflows.',
  coreQuestion: 'Has an impact analysis been performed for affected individuals and groups?',
  applicability: [
    { field: 'systemId', operator: 'exists', description: 'Applies to all AI-enabled systems that produce outputs affecting humans.' },
  ],
  requiredInputs: [
    { id: 'impactAnalysisCompleted', label: 'Impact analysis completed', type: 'boolean', required: true, description: 'Whether an impact analysis has been performed.' },
    { id: 'affectedStakeholdersIdentified', label: 'Affected stakeholders identified', type: 'boolean', required: true, description: 'Whether affected stakeholders are identified.' },
  ],
  optionalInputs: [
    { id: 'impactSeverity', label: 'Impact severity', type: 'enum', required: false, description: 'Assessed severity of impact (low/medium/high).' },
  ],
  objectiveRules: [
    { id: 'UX-IMPACT-R1', description: 'Impact analysis must be completed.', condition: 'impactAnalysisCompleted === true', passState: 'SATISFIED', failState: 'REQUIRED', blocking: false },
    { id: 'UX-IMPACT-R2', description: 'Affected stakeholders must be identified.', condition: 'affectedStakeholdersIdentified === true', passState: 'SATISFIED', failState: 'PARTIAL', blocking: false },
  ],
  humanJudgmentPoints: [],
  requiredDecisions: [],
  requiredEvidence: [
    { id: 'UX-IMPACT-E1', label: 'Impact analysis document', description: 'Documented impact analysis with stakeholder identification.', evidenceType: 'document', required: true, expiresByDefault: true, defaultExpiryDays: 365 },
  ],
  responsibleRoles: ['UX Researcher', 'Product Manager'],
  accountableRole: 'Product Manager',
  outputs: ['Impact analysis', 'Stakeholder map', 'Impact severity assessment'],
  blockingConditions: [],
  allowedExceptions: {
    allowedReasons: ['Impact analysis in progress with preliminary findings'],
    requiresCompensatingControls: true,
    maxDurationDays: 60,
    requiresAccountableApprover: true,
  },
  exceptionApproval: {
    approverRole: 'Product Manager',
    requiresRationale: true,
    requiresEvidence: true,
    requiresCompensatingControls: true,
  },
  handoffTargets: [
    { targetDomain: 'UX', targetComponent: 'UX-EXPLAIN', requiredOutputs: ['impactFindings', 'stakeholderNeeds'] },
  ],
  handoffOutputs: ['impactFindings', 'stakeholderNeeds'],
  reassessmentTriggers: ['TRIGGER-USE-CHANGE', 'TRIGGER-SCOPE-EXPANSION', 'TRIGGER-USER-HARM', 'TRIGGER-POLICY-CHANGE'],
  executionFunctionMappings: ['EF3-RISK'],
  sourceProvenance: 'Original CSM publication, August 29, 2025. V2 contract formalized 2026-08-10.',
  dependencies: [],
}

export const UX_EXPLAIN: GovernanceContract = {
  id: 'UX-EXPLAIN',
  version: '2.0.0',
  domain: 'UX',
  name: 'Explainability Design',
  purpose: 'Design choices that help users understand system behavior, limitations and appropriate reliance.',
  coreQuestion: 'Does the system provide explanations appropriate for user understanding and appropriate reliance?',
  applicability: [
    { field: 'systemId', operator: 'exists', description: 'Applies to all AI-enabled systems that produce outputs for human users.' },
  ],
  requiredInputs: [
    { id: 'explainabilityDesigned', label: 'Explainability designed', type: 'boolean', required: true, description: 'Whether explainability has been designed.' },
    { id: 'limitationsCommunicated', label: 'Limitations communicated', type: 'boolean', required: true, description: 'Whether system limitations are communicated to users.' },
  ],
  optionalInputs: [],
  objectiveRules: [
    { id: 'UX-EXPLAIN-R1', description: 'Explainability must be designed.', condition: 'explainabilityDesigned === true', passState: 'SATISFIED', failState: 'REQUIRED', blocking: false },
    { id: 'UX-EXPLAIN-R2', description: 'Limitations must be communicated.', condition: 'limitationsCommunicated === true', passState: 'SATISFIED', failState: 'PARTIAL', blocking: false },
  ],
  humanJudgmentPoints: [
    { id: 'UX-EXPLAIN-HJ1', question: 'Is the explanation adequate for affected users?', description: 'Explanation adequacy depends on user context, system impact and audience.', requiredOutput: 'APPROVE', requiresReviewer: true, requiresRationale: true, requiresEvidence: false },
  ],
  requiredDecisions: [
    { id: 'UX-EXPLAIN-D1', question: 'Is the explanation adequate?', decisionType: 'human_approval', blocking: false },
  ],
  requiredEvidence: [
    { id: 'UX-EXPLAIN-E1', label: 'Explainability design document', description: 'Documented explainability design decisions.', evidenceType: 'document', required: true, expiresByDefault: false },
  ],
  responsibleRoles: ['UX Designer', 'Product Manager'],
  accountableRole: 'Product Manager',
  outputs: ['Explainability design', 'Limitation disclosures', 'Explanation adequacy decision'],
  blockingConditions: [],
  allowedExceptions: {
    allowedReasons: ['Explainability under design with interim disclaimers'],
    requiresCompensatingControls: true,
    maxDurationDays: 60,
    requiresAccountableApprover: true,
  },
  exceptionApproval: {
    approverRole: 'Product Manager',
    requiresRationale: true,
    requiresEvidence: false,
    requiresCompensatingControls: true,
  },
  handoffTargets: [
    { targetDomain: 'UX', targetComponent: 'UX-CAPABILITY', requiredOutputs: ['explanationDesign', 'userUnderstandingRequirements'] },
  ],
  handoffOutputs: ['explanationDesign', 'userUnderstandingRequirements'],
  reassessmentTriggers: ['TRIGGER-USE-CHANGE', 'TRIGGER-MODEL-CHANGE', 'TRIGGER-DRIFT'],
  executionFunctionMappings: ['EF5-OVERSIGHT'],
  sourceProvenance: 'Original CSM publication, August 29, 2025. V2 contract formalized 2026-08-10.',
  dependencies: ['UX-IMPACT'],
}

export const UX_CAPABILITY: GovernanceContract = {
  id: 'UX-CAPABILITY',
  version: '2.0.0',
  domain: 'UX',
  name: 'Capability Development',
  purpose: 'Training and skill development that enables users to effectively supervise and interact with AI systems.',
  coreQuestion: 'Is there a capability development plan that prepares users to supervise and interact with the AI system?',
  applicability: [
    { field: 'systemId', operator: 'exists', description: 'Applies to all AI-enabled systems requiring user supervision.' },
  ],
  requiredInputs: [
    { id: 'capabilityPlanDocumented', label: 'Capability plan documented', type: 'boolean', required: true, description: 'Whether a capability development plan exists.' },
    { id: 'trainingProvided', label: 'Training provided', type: 'boolean', required: true, description: 'Whether training has been provided to users.' },
  ],
  optionalInputs: [],
  objectiveRules: [
    { id: 'UX-CAPABILITY-R1', description: 'Capability plan must be documented.', condition: 'capabilityPlanDocumented === true', passState: 'SATISFIED', failState: 'REQUIRED', blocking: false },
    { id: 'UX-CAPABILITY-R2', description: 'Training must be provided.', condition: 'trainingProvided === true', passState: 'SATISFIED', failState: 'IN_PROGRESS', blocking: false },
  ],
  humanJudgmentPoints: [
    { id: 'UX-CAPABILITY-HJ1', question: 'Is the training adequate for the system risk profile?', description: 'Training adequacy depends on system complexity and user context.', requiredOutput: 'APPROVE', requiresReviewer: true, requiresRationale: true, requiresEvidence: false },
  ],
  requiredDecisions: [
    { id: 'UX-CAPABILITY-D1', question: 'Is training adequate?', decisionType: 'human_approval', blocking: false },
  ],
  requiredEvidence: [
    { id: 'UX-CAPABILITY-E1', label: 'Capability plan', description: 'Documented capability development plan.', evidenceType: 'document', required: true, expiresByDefault: false },
    { id: 'UX-CAPABILITY-E2', label: 'Training materials', description: 'Training materials and delivery records.', evidenceType: 'document', required: true, expiresByDefault: true, defaultExpiryDays: 365 },
  ],
  responsibleRoles: ['Training Lead', 'Product Manager'],
  accountableRole: 'Product Manager',
  outputs: ['Capability plan', 'Training materials', 'Training adequacy decision'],
  blockingConditions: [],
  allowedExceptions: {
    allowedReasons: ['Training under development with interim guidance'],
    requiresCompensatingControls: true,
    maxDurationDays: 60,
    requiresAccountableApprover: true,
  },
  exceptionApproval: {
    approverRole: 'Product Manager',
    requiresRationale: true,
    requiresEvidence: false,
    requiresCompensatingControls: true,
  },
  handoffTargets: [],
  handoffOutputs: ['capabilityRequirements'],
  reassessmentTriggers: ['TRIGGER-USE-CHANGE', 'TRIGGER-MODEL-CHANGE'],
  executionFunctionMappings: ['EF5-OVERSIGHT'],
  sourceProvenance: 'Original CSM publication, August 29, 2025. V2 contract formalized 2026-08-10.',
  dependencies: ['UX-EXPLAIN'],
}

export const UX_ADOPTION: GovernanceContract = {
  id: 'UX-ADOPTION',
  version: '2.0.0',
  domain: 'UX',
  name: 'Adoption Measurement',
  purpose: 'Monitoring of how AI systems are actually used, including feedback and complaints.',
  coreQuestion: 'Is adoption being measured with feedback and complaint channels in place?',
  applicability: [
    { field: 'systemId', operator: 'exists', description: 'Applies to all deployed AI-enabled systems.' },
  ],
  requiredInputs: [
    { id: 'adoptionMetricsDefined', label: 'Adoption metrics defined', type: 'boolean', required: true, description: 'Whether adoption metrics are defined.' },
    { id: 'feedbackChannelExists', label: 'Feedback channel exists', type: 'boolean', required: true, description: 'Whether a user feedback channel exists.' },
    { id: 'complaintChannelExists', label: 'Complaint channel exists', type: 'boolean', required: true, description: 'Whether a complaint channel exists.' },
  ],
  optionalInputs: [
    { id: 'adoptionDataCollected', label: 'Adoption data collected', type: 'boolean', required: false, description: 'Whether adoption data has been collected.' },
  ],
  objectiveRules: [
    { id: 'UX-ADOPTION-R1', description: 'Adoption metrics must be defined.', condition: 'adoptionMetricsDefined === true', passState: 'SATISFIED', failState: 'REQUIRED', blocking: false },
    { id: 'UX-ADOPTION-R2', description: 'Feedback channel must exist.', condition: 'feedbackChannelExists === true', passState: 'SATISFIED', failState: 'PARTIAL', blocking: false },
    { id: 'UX-ADOPTION-R3', description: 'Complaint channel must exist.', condition: 'complaintChannelExists === true', passState: 'SATISFIED', failState: 'PARTIAL', blocking: false },
  ],
  humanJudgmentPoints: [],
  requiredDecisions: [],
  requiredEvidence: [
    { id: 'UX-ADOPTION-E1', label: 'Adoption metrics definition', description: 'Defined adoption metrics and measurement approach.', evidenceType: 'document', required: true, expiresByDefault: false },
  ],
  responsibleRoles: ['UX Researcher', 'Product Manager'],
  accountableRole: 'Product Manager',
  outputs: ['Adoption metrics', 'Feedback channel', 'Complaint channel', 'Adoption data'],
  blockingConditions: [],
  allowedExceptions: {
    allowedReasons: ['Metrics being defined with interim manual collection'],
    requiresCompensatingControls: false,
    maxDurationDays: 30,
    requiresAccountableApprover: true,
  },
  exceptionApproval: {
    approverRole: 'Product Manager',
    requiresRationale: true,
    requiresEvidence: false,
    requiresCompensatingControls: false,
  },
  handoffTargets: [
    { targetDomain: 'PRJ', targetComponent: 'PRJ-BUSINESS', requiredOutputs: ['userFeedback', 'usageFindings', 'escalationData'] },
  ],
  handoffOutputs: ['userFeedback', 'usageFindings', 'escalationData'],
  reassessmentTriggers: ['TRIGGER-DRIFT', 'TRIGGER-USER-HARM'],
  executionFunctionMappings: ['EF3-RISK', 'EF5-OVERSIGHT'],
  sourceProvenance: 'Original CSM publication, August 29, 2025. V2 contract formalized 2026-08-10.',
  dependencies: ['UX-IMPACT'],
}

// ============================================================================
// CONTRACT REGISTRY
// ============================================================================

export const governanceContracts: GovernanceContract[] = [
  ENT_POLICY,
  ENT_RISK,
  ENT_DATA,
  ENT_MANDATE,
  PRJ_BUSINESS,
  PRJ_TESTING,
  PRJ_SCALE,
  PRJ_PLAYBOOK,
  CODE_STANDARDS,
  CODE_SECURITY,
  CODE_HUMAN,
  CODE_TRACE,
  UX_IMPACT,
  UX_EXPLAIN,
  UX_CAPABILITY,
  UX_ADOPTION,
]

export const contractsByComponentId: Record<ComponentId, GovernanceContract> = Object.fromEntries(
  governanceContracts.map((c) => [c.id, c]),
) as Record<ComponentId, GovernanceContract>
