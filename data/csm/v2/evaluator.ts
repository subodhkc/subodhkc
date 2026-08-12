/**
 * CSM 2.0 Deterministic Reference Evaluator
 *
 * Pure function: no LLM, no randomness, no external API, no implicit clock.
 * Uses explicit assessmentAsOf for all time-based logic.
 * Stable sorting and deterministic output ordering.
 *
 * This is a reference implementation of CSM 2.0 rules.
 * It is NOT HAIEC itself.
 */

import type {
  AssessmentInput,
  AssessmentOutput,
  ComponentResult,
  DomainResult,
  ObjectiveRuleResult,
  HumanJudgmentResult,
  EvidenceStatus,
  Blocker,
  HumanReviewItem,
  ExceptionSummary,
  EvidenceGap,
  ReassessmentTriggerSummary,
  HandoffStatus,
  AssessmentSummary,
  RequirementState,
  DomainState,
  SystemGovernanceState,
  ComponentId,
  DomainId,
  GovernanceContract,
  EvidenceRecord,
  ExceptionRecord,
  DecisionRecord,
} from './spec'

import {
  csmDomains,
  csmComponents,
  DOMAIN_STATE_RULE,
  SYSTEM_STATE_RULE,
  reassessmentTriggers,
  handoffContracts,
  componentDependencies,
  CSM_SPEC_VERSION,
} from './spec'

import { contractsByComponentId } from './contracts'

// ============================================================================
// Normalization
// ============================================================================

function normalizeBoolean(value: unknown): boolean | undefined {
  if (typeof value === 'boolean') return value
  if (value === 'true' || value === 1 || value === 'yes') return true
  if (value === 'false' || value === 0 || value === 'no') return false
  return undefined
}

function normalizeString(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim().length > 0) return value.trim()
  if (value === null || value === undefined) return undefined
  return String(value).trim() || undefined
}

function normalizeDate(value: unknown): string | undefined {
  const s = normalizeString(value)
  if (!s) return undefined
  // Accept ISO 8601 date strings
  if (/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/.test(s)) return s
  return undefined
}

function isExpired(expiresAt: string | undefined, assessmentAsOf: string): boolean {
  if (!expiresAt) return false
  return expiresAt < assessmentAsOf
}

// ============================================================================
// Input Extraction
// ============================================================================

/**
 * Extracts a field value from the assessment input by field ID.
 * Maps contract input IDs to assessment input fields.
 */
function extractInputValue(
  inputId: string,
  input: AssessmentInput,
): unknown {
  // Direct mapping from contract input IDs to assessment input fields
  const fieldMap: Record<string, unknown> = {
    accountableOwner: input.businessOwner,
    intendedPurpose: input.intendedPurpose,
    systemId: input.systemId,
    systemVersion: input.systemVersion,
  }

  // Check evidence for evidence-based inputs
  const evidenceByType = new Map(input.evidence.map((e) => [e.type, e]))

  // Policy-related
  if (inputId === 'aiPolicyDocumented') {
    return evidenceByType.has('document') && input.evidence.some((e) => e.title.toLowerCase().includes('policy'))
  }
  if (inputId === 'policyAddressesAdaptiveBehavior') {
    const policy = input.evidence.find((e) => e.title.toLowerCase().includes('policy'))
    return policy?.relatedRequirementIds?.includes('ENT-POLICY') ?? false
  }
  if (inputId === 'riskAssessmentCompleted') {
    return input.evidence.some((e) => e.title.toLowerCase().includes('risk assessment') || e.type === 'risk-assessment')
  }
  if (inputId === 'riskAssessmentAddressesDrift') {
    return input.evidence.some((e) => e.title.toLowerCase().includes('drift') || e.type === 'risk-assessment')
  }
  if (inputId === 'riskAssessmentDate') {
    const ra = input.evidence.find((e) => e.type === 'risk-assessment' || e.title.toLowerCase().includes('risk assessment'))
    return ra?.createdAt
  }
  if (inputId === 'dataSourcesIdentified') {
    return input.dataSources.length > 0
  }
  if (inputId === 'dataOwnersAssigned') {
    return input.dataSources.every((d) => d.id !== '')
  }
  if (inputId === 'dataSensitivityClassified') {
    return input.dataSources.every((d) => d.sensitivity !== undefined)
  }
  if (inputId === 'strategicMandateDocumented') {
    return input.evidence.some((e) => e.title.toLowerCase().includes('mandate') || e.type === 'mandate')
  }
  if (inputId === 'mandateBoundaries') {
    return input.intendedPurpose
  }
  if (inputId === 'businessCaseDocumented') {
    return input.evidence.some((e) => e.title.toLowerCase().includes('business case') || e.type === 'business-case')
  }
  if (inputId === 'successCriteriaDefined') {
    return input.evidence.some((e) => e.title.toLowerCase().includes('success criteria') || e.type === 'business-case')
  }
  if (inputId === 'riskBenefitEvaluated') {
    return input.decisions.some((d) => d.decisionType === 'risk_acceptance')
  }
  if (inputId === 'testingPlanDocumented') {
    return input.evidence.some((e) => e.title.toLowerCase().includes('testing plan') || e.type === 'testing-plan')
  }
  if (inputId === 'testingAddressesRisks') {
    return input.evidence.some((e) => e.type === 'testing-plan')
  }
  if (inputId === 'testingResultsRecorded') {
    return input.evidence.some((e) => e.title.toLowerCase().includes('testing results') || e.type === 'testing-results')
  }
  if (inputId === 'scaleCriteriaDocumented') {
    return input.evidence.some((e) => e.title.toLowerCase().includes('scale') || e.type === 'scale-decision')
  }
  if (inputId === 'scaleDecisionMade') {
    return input.decisions.some((d) => d.question.toLowerCase().includes('scale'))
  }
  if (inputId === 'scaleDecisionEvidence') {
    const sd = input.decisions.find((d) => d.question.toLowerCase().includes('scale'))
    return sd?.evidenceRefs?.join(', ')
  }
  if (inputId === 'playbookDocumented') {
    return input.evidence.some((e) => e.title.toLowerCase().includes('playbook') || e.type === 'playbook')
  }
  if (inputId === 'playbookIncludesDecisions') {
    return input.evidence.some((e) => e.type === 'playbook')
  }
  if (inputId === 'operationalOwnersIdentified') {
    return !!input.businessOwner && !!input.technicalOwner
  }
  if (inputId === 'aiAssistedDevStandardsDocumented') {
    return input.evidence.some((e) => e.title.toLowerCase().includes('development standards') || e.type === 'dev-standards')
  }
  if (inputId === 'reviewRequirementsDefined') {
    return input.evidence.some((e) => e.type === 'dev-standards')
  }
  if (inputId === 'securityScanningActive') {
    return input.evidence.some((e) => e.title.toLowerCase().includes('security scan') || e.type === 'security-scan')
  }
  if (inputId === 'dependencyVerificationProcess') {
    return input.evidence.some((e) => e.title.toLowerCase().includes('dependency') || e.type === 'dependency-verification')
  }
  if (inputId === 'securityReviewArtifact') {
    return input.evidence.some((e) => e.title.toLowerCase().includes('security review') || e.type === 'security-review')
  }
  if (inputId === 'humanReviewProcessDefined') {
    return input.evidence.some((e) => e.title.toLowerCase().includes('review process') || e.type === 'review-process')
  }
  if (inputId === 'reviewProportionateToRisk') {
    return input.decisions.some((d) => d.question.toLowerCase().includes('oversight'))
  }
  if (inputId === 'traceabilityLoggingActive') {
    return input.evidence.some((e) => e.title.toLowerCase().includes('traceability') || e.type === 'traceability-config')
  }
  if (inputId === 'aiAssistedChangesTracked') {
    return input.evidence.some((e) => e.type === 'traceability-config')
  }
  if (inputId === 'impactAnalysisCompleted') {
    return input.evidence.some((e) => e.title.toLowerCase().includes('impact analysis') || e.type === 'impact-analysis')
  }
  if (inputId === 'affectedStakeholdersIdentified') {
    return input.affectedStakeholders.length > 0
  }
  if (inputId === 'explainabilityDesigned') {
    return input.evidence.some((e) => e.title.toLowerCase().includes('explainability') || e.type === 'explainability-design')
  }
  if (inputId === 'limitationsCommunicated') {
    return input.evidence.some((e) => e.type === 'explainability-design')
  }
  if (inputId === 'capabilityPlanDocumented') {
    return input.evidence.some((e) => e.title.toLowerCase().includes('capability') || e.type === 'capability-plan')
  }
  if (inputId === 'trainingProvided') {
    return input.evidence.some((e) => e.title.toLowerCase().includes('training') || e.type === 'training-materials')
  }
  if (inputId === 'adoptionMetricsDefined') {
    return input.evidence.some((e) => e.title.toLowerCase().includes('adoption') || e.type === 'adoption-metrics')
  }
  if (inputId === 'feedbackChannelExists') {
    return input.evidence.some((e) => e.title.toLowerCase().includes('feedback') || e.type === 'feedback-channel')
  }
  if (inputId === 'complaintChannelExists') {
    return input.evidence.some((e) => e.title.toLowerCase().includes('complaint') || e.type === 'complaint-channel')
  }

  return fieldMap[inputId] ?? undefined
}

// ============================================================================
// Evidence Lookup
// ============================================================================

function findEvidenceForRequirement(
  evidence: EvidenceRecord[],
  requirementId: string,
): EvidenceRecord[] {
  return evidence.filter((e) => e.relatedRequirementIds.includes(requirementId))
}

function checkEvidenceExpiry(
  evidence: EvidenceRecord[],
  assessmentAsOf: string,
): { hasExpired: boolean; expiredIds: string[] } {
  const expired = evidence.filter((e) => isExpired(e.expiresAt, assessmentAsOf) || e.status === 'expired')
  return { hasExpired: expired.length > 0, expiredIds: expired.map((e) => e.evidenceId) }
}

// ============================================================================
// Exception Lookup
// ============================================================================

function findActiveException(
  exceptions: ExceptionRecord[],
  requirementId: string,
  assessmentAsOf: string,
): ExceptionRecord | undefined {
  return exceptions.find(
    (e) =>
      e.requirementId === requirementId &&
      e.expiresAt >= assessmentAsOf &&
      !isExpired(e.expiresAt, assessmentAsOf),
  )
}

// ============================================================================
// Decision Lookup
// ============================================================================

function findDecision(
  decisions: DecisionRecord[],
  requirementId: string,
): DecisionRecord | undefined {
  return decisions.find((d) => d.requirementId === requirementId)
}

// ============================================================================
// Component Evaluation
// ============================================================================

function evaluateComponent(
  contract: GovernanceContract,
  input: AssessmentInput,
  assessmentAsOf: string,
): ComponentResult {
  const componentId = contract.id

  // Check for active exception
  const activeException = findActiveException(input.exceptions, componentId, assessmentAsOf)
  if (activeException) {
    return {
      componentId,
      domain: contract.domain,
      state: 'EXCEPTION_APPROVED',
      applicable: true,
      objectiveRuleResults: [],
      humanJudgmentResults: [],
      evidenceStatus: contract.requiredEvidence.map((er) => ({
        evidenceRequirementId: er.id,
        label: er.label,
        satisfied: true,
        evidenceIds: activeException.evidenceRefs,
        missing: false,
        expired: false,
      })),
      blockingConditions: [],
      remediation: [`Exception approved: ${activeException.reason}. Expires ${activeException.expiresAt}.`],
    }
  }

  // Check for existing human decision
  const existingDecision = findDecision(input.decisions, componentId)

  // Evaluate objective rules
  const ruleResults: ObjectiveRuleResult[] = contract.objectiveRules.map((rule) => {
    // Simple evaluation: check if the condition's referenced input is truthy
    // In a full implementation, this would parse and evaluate the condition expression
    const inputId = rule.id.split('-R')[0].replace(/-/g, '')
    // Map rule to input field - this is a simplified evaluator
    const ruleInputMap: Record<string, string> = {
      'ENT-POLICY-R1': 'aiPolicyDocumented',
      'ENT-POLICY-R2': 'policyAddressesAdaptiveBehavior',
      'ENT-POLICY-R3': 'accountableOwner',
      'ENT-RISK-R1': 'riskAssessmentCompleted',
      'ENT-RISK-R2': 'riskAssessmentAddressesDrift',
      'ENT-DATA-R1': 'dataSourcesIdentified',
      'ENT-DATA-R2': 'dataOwnersAssigned',
      'ENT-DATA-R3': 'dataSensitivityClassified',
      'ENT-MANDATE-R1': 'strategicMandateDocumented',
      'ENT-MANDATE-R2': 'accountableOwner',
      'ENT-MANDATE-R3': 'mandateBoundaries',
      'PRJ-BUSINESS-R1': 'businessCaseDocumented',
      'PRJ-BUSINESS-R2': 'successCriteriaDefined',
      'PRJ-TESTING-R1': 'testingPlanDocumented',
      'PRJ-TESTING-R2': 'testingAddressesRisks',
      'PRJ-TESTING-R3': 'testingResultsRecorded',
      'PRJ-SCALE-R1': 'scaleCriteriaDocumented',
      'PRJ-SCALE-R2': 'scaleDecisionMade',
      'PRJ-PLAYBOOK-R1': 'playbookDocumented',
      'PRJ-PLAYBOOK-R2': 'playbookIncludesDecisions',
      'PRJ-PLAYBOOK-R3': 'operationalOwnersIdentified',
      'CODE-STANDARDS-R1': 'aiAssistedDevStandardsDocumented',
      'CODE-STANDARDS-R2': 'reviewRequirementsDefined',
      'CODE-SECURITY-R1': 'securityScanningActive',
      'CODE-SECURITY-R2': 'dependencyVerificationProcess',
      'CODE-SECURITY-R3': 'securityReviewArtifact',
      'CODE-HUMAN-R1': 'humanReviewProcessDefined',
      'CODE-HUMAN-R2': 'reviewProportionateToRisk',
      'CODE-TRACE-R1': 'traceabilityLoggingActive',
      'CODE-TRACE-R2': 'aiAssistedChangesTracked',
      'UX-IMPACT-R1': 'impactAnalysisCompleted',
      'UX-IMPACT-R2': 'affectedStakeholdersIdentified',
      'UX-EXPLAIN-R1': 'explainabilityDesigned',
      'UX-EXPLAIN-R2': 'limitationsCommunicated',
      'UX-CAPABILITY-R1': 'capabilityPlanDocumented',
      'UX-CAPABILITY-R2': 'trainingProvided',
      'UX-ADOPTION-R1': 'adoptionMetricsDefined',
      'UX-ADOPTION-R2': 'feedbackChannelExists',
      'UX-ADOPTION-R3': 'complaintChannelExists',
    }

    const mappedInputId = ruleInputMap[rule.id]
    const rawValue = mappedInputId ? extractInputValue(mappedInputId, input) : undefined
    const boolValue = normalizeBoolean(rawValue)
    const strValue = normalizeString(rawValue)
    const passed = boolValue === true || (strValue !== undefined && strValue.length > 0)

    return {
      ruleId: rule.id,
      description: rule.description,
      evaluated: rawValue !== undefined,
      passed,
      resultState: passed ? rule.passState : rule.failState,
      inputValues: { [mappedInputId || 'unknown']: rawValue },
      missingInputs: rawValue === undefined ? [mappedInputId || 'unknown'] : [],
    }
  })

  // Evaluate human judgment points
  const humanJudgmentResults: HumanJudgmentResult[] = contract.humanJudgmentPoints.map((hjp) => {
    const decision = existingDecision
    if (decision && decision.decisionType !== 'objective_computation') {
      return {
        judgmentId: hjp.id,
        question: hjp.question,
        state: 'SATISFIED',
        reviewer: decision.reviewer,
        decision: decision.decision,
        rationale: decision.rationale,
      }
    }
    return {
      judgmentId: hjp.id,
      question: hjp.question,
      state: 'HUMAN_REVIEW_REQUIRED' as RequirementState,
    }
  })

  // Evaluate evidence
  const evidenceStatus: EvidenceStatus[] = contract.requiredEvidence.map((er) => {
    const relatedEvidence = findEvidenceForRequirement(input.evidence, er.id)
    const expiryCheck = checkEvidenceExpiry(relatedEvidence, assessmentAsOf)
    return {
      evidenceRequirementId: er.id,
      label: er.label,
      satisfied: relatedEvidence.length > 0 && !expiryCheck.hasExpired,
      evidenceIds: relatedEvidence.map((e) => e.evidenceId),
      missing: relatedEvidence.length === 0,
      expired: expiryCheck.hasExpired,
    }
  })

  // Determine component state
  let componentState: RequirementState = 'NOT_ASSESSED'

  // Check dependencies first
  const deps = componentDependencies.filter((d) => d.component === componentId)
  const blockedDeps = deps.filter((dep) => {
    const depContract = contractsByComponentId[dep.dependsOn]
    if (!depContract) return false
    // Simplified: if dependency has a blocking rule that fails, this is blocked
    return false // Full implementation would recursively check dependency state
  })

  // Determine state from rule results
  const blockingRuleFailed = ruleResults.some((rr) => !rr.passed && contract.objectiveRules.find((r) => r.id === rr.ruleId)?.blocking)
  const anyRuleFailed = ruleResults.some((rr) => !rr.passed && rr.evaluated)
  const anyRuleNotEvaluated = ruleResults.some((rr) => !rr.evaluated)
  const allRulesPassed = ruleResults.every((rr) => rr.passed)
  const humanReviewRequired = humanJudgmentResults.some((hjr) => hjr.state === 'HUMAN_REVIEW_REQUIRED')
  const evidenceMissing = evidenceStatus.some((es) => es.missing && es.evidenceRequirementId.startsWith(contract.id))
  const evidenceExpired = evidenceStatus.some((es) => es.expired)

  if (blockingRuleFailed) {
    componentState = 'BLOCKED'
  } else if (humanReviewRequired) {
    componentState = 'HUMAN_REVIEW_REQUIRED'
  } else if (evidenceExpired) {
    componentState = 'REASSESSMENT_REQUIRED'
  } else if (anyRuleNotEvaluated && anyRuleFailed) {
    componentState = 'PARTIAL'
  } else if (anyRuleNotEvaluated) {
    componentState = 'NOT_ASSESSED'
  } else if (allRulesPassed && !evidenceMissing) {
    componentState = 'SATISFIED'
  } else if (allRulesPassed && evidenceMissing) {
    componentState = 'PARTIAL'
  } else if (anyRuleFailed) {
    componentState = 'PARTIAL'
  }

  // Check blocking conditions
  const activeBlockingConditions: string[] = []
  if (blockingRuleFailed) {
    activeBlockingConditions.push(...contract.blockingConditions)
  }

  // Build remediation
  const remediation: string[] = []
  if (componentState === 'BLOCKED') {
    remediation.push('Address blocking conditions before proceeding.')
  }
  if (humanReviewRequired) {
    remediation.push('Complete required human judgment reviews with documented rationale.')
  }
  if (evidenceMissing) {
    evidenceStatus.filter((es) => es.missing).forEach((es) => {
      remediation.push(`Provide evidence: ${es.label}`)
    })
  }
  if (evidenceExpired) {
    remediation.push('Update expired evidence.')
  }

  return {
    componentId,
    domain: contract.domain,
    state: componentState,
    applicable: true,
    objectiveRuleResults: ruleResults,
    humanJudgmentResults,
    evidenceStatus,
    blockingConditions: activeBlockingConditions,
    remediation,
  }
}

// ============================================================================
// Domain State Derivation
// ============================================================================

function deriveDomainState(
  domainId: DomainId,
  componentResults: ComponentResult[],
): DomainState {
  const domainComponents = componentResults.filter((cr) => cr.domain === domainId && cr.applicable)

  if (domainComponents.length === 0) return 'NOT_STARTED'

  // 1. REASSESSMENT_REQUIRED (any applicable component)
  if (domainComponents.some((c) => c.state === 'REASSESSMENT_REQUIRED')) {
    return 'REASSESSMENT_REQUIRED'
  }

  // 2. BLOCKED (any applicable component)
  if (domainComponents.some((c) => c.state === 'BLOCKED')) {
    return 'BLOCKED'
  }

  // 3. NOT_STARTED (any applicable component NOT_ASSESSED)
  if (domainComponents.some((c) => c.state === 'NOT_ASSESSED')) {
    return 'NOT_STARTED'
  }

  // 4. IN_PROGRESS (any applicable component IN_PROGRESS, PARTIAL, or HUMAN_REVIEW_REQUIRED)
  if (
    domainComponents.some(
      (c) =>
        c.state === 'IN_PROGRESS' ||
        c.state === 'PARTIAL' ||
        c.state === 'HUMAN_REVIEW_REQUIRED' ||
        c.state === 'REQUIRED',
    )
  ) {
    return 'IN_PROGRESS'
  }

  // 5. READY_FOR_HANDOFF (all applicable components SATISFIED, NOT_APPLICABLE, or EXCEPTION_APPROVED)
  if (
    domainComponents.every(
      (c) =>
        c.state === 'SATISFIED' ||
        c.state === 'NOT_APPLICABLE' ||
        c.state === 'EXCEPTION_APPROVED',
    )
  ) {
    return 'READY_FOR_HANDOFF'
  }

  return 'IN_PROGRESS'
}

// ============================================================================
// System State Derivation
// ============================================================================

function deriveSystemState(
  domainResults: DomainResult[],
  componentResults: ComponentResult[],
): SystemGovernanceState {
  // 1. GOVERNANCE_BLOCKED (any domain BLOCKED)
  if (domainResults.some((d) => d.state === 'BLOCKED')) {
    return 'GOVERNANCE_BLOCKED'
  }

  // 2. REASSESSMENT_REQUIRED (any domain REASSESSMENT_REQUIRED)
  if (domainResults.some((d) => d.state === 'REASSESSMENT_REQUIRED')) {
    return 'REASSESSMENT_REQUIRED'
  }

  // 3. ASSESSMENT_INCOMPLETE (any domain NOT_STARTED or any component NOT_ASSESSED)
  if (
    domainResults.some((d) => d.state === 'NOT_STARTED') ||
    componentResults.some((c) => c.state === 'NOT_ASSESSED' && c.applicable)
  ) {
    return 'ASSESSMENT_INCOMPLETE'
  }

  // 4. HUMAN_DECISION_REQUIRED (any component HUMAN_REVIEW_REQUIRED)
  if (componentResults.some((c) => c.state === 'HUMAN_REVIEW_REQUIRED' && c.applicable)) {
    return 'HUMAN_DECISION_REQUIRED'
  }

  // 5. READY_FOR_GOVERNANCE_DECISION (all domains READY_FOR_HANDOFF)
  if (domainResults.every((d) => d.state === 'READY_FOR_HANDOFF')) {
    return 'READY_FOR_GOVERNANCE_DECISION'
  }

  return 'ASSESSMENT_INCOMPLETE'
}

// ============================================================================
// Reassessment Trigger Evaluation
// ============================================================================

function evaluateReassessmentTriggers(
  input: AssessmentInput,
  assessmentAsOf: string,
): ReassessmentTriggerSummary[] {
  const fired: ReassessmentTriggerSummary[] = []

  // Check exception expiry
  const expiredExceptions = input.exceptions.filter((e) => isExpired(e.expiresAt, assessmentAsOf))
  if (expiredExceptions.length > 0) {
    const trigger = reassessmentTriggers.find((t) => t.id === 'TRIGGER-EXCEPTION-EXPIRY')
    if (trigger) {
      fired.push({
        triggerId: trigger.id,
        label: trigger.label,
        affectedComponents: expiredExceptions.map((e) => e.requirementId as ComponentId),
      })
    }
  }

  // Other triggers would be evaluated based on changes in the input record
  // For the reference evaluator, we check explicit flags in the input
  // In a real implementation, these would compare against a previous assessment

  return fired
}

// ============================================================================
// Handoff Evaluation
// ============================================================================

function evaluateHandoffs(
  domainResults: DomainResult[],
): HandoffStatus[] {
  return handoffContracts.map((hc) => {
    const fromDomainState = domainResults.find((d) => d.domainId === hc.fromDomain)?.state
    const ready = fromDomainState === 'READY_FOR_HANDOFF'
    return {
      handoffId: hc.id,
      fromDomain: hc.fromDomain,
      toDomain: hc.toDomain,
      ready,
      missingFields: ready ? [] : hc.requiredFields,
    }
  })
}

// ============================================================================
// Summary Computation
// ============================================================================

function computeSummary(
  componentResults: ComponentResult[],
  domainResults: DomainResult[],
): AssessmentSummary {
  const applicable = componentResults.filter((c) => c.applicable)
  const totalApplicable = applicable.length
  const satisfied = applicable.filter((c) => c.state === 'SATISFIED').length
  const partial = applicable.filter((c) => c.state === 'PARTIAL' || c.state === 'IN_PROGRESS' || c.state === 'REQUIRED').length
  const exceptions = applicable.filter((c) => c.state === 'EXCEPTION_APPROVED').length
  const humanReviewRequired = applicable.filter((c) => c.state === 'HUMAN_REVIEW_REQUIRED').length
  const blockers = applicable.filter((c) => c.state === 'BLOCKED').length
  const reassessmentRequired = applicable.filter((c) => c.state === 'REASSESSMENT_REQUIRED').length

  const evidenceTotal = applicable.reduce((sum, c) => sum + c.evidenceStatus.length, 0)
  const evidenceSatisfied = applicable.reduce(
    (sum, c) => sum + c.evidenceStatus.filter((e) => e.satisfied).length,
    0,
  )
  const evidenceCoverage = evidenceTotal > 0 ? Math.round((evidenceSatisfied / evidenceTotal) * 100) : 0

  const systemState = deriveSystemState(domainResults, applicable)

  return {
    totalApplicable,
    satisfied,
    partial,
    exceptions,
    humanReviewRequired,
    blockers,
    reassessmentRequired,
    evidenceCoverage,
    systemState,
  }
}

// ============================================================================
// Main Evaluator Function
// ============================================================================

/**
 * Pure deterministic CSM 2.0 evaluation.
 *
 * @param systemContext - The system being assessed
 * @param evidence - Evidence records
 * @param decisions - Decision records
 * @param exceptions - Exception records
 * @param policyConfig - Organization policy configuration
 * @param assessmentAsOf - Explicit assessment date (ISO 8601)
 * @param specVersion - CSM spec version (must match)
 * @returns Deterministic assessment output
 */
export function evaluateCsmV2(
  systemContext: AssessmentInput,
  evidence: EvidenceRecord[],
  decisions: DecisionRecord[],
  exceptions: ExceptionRecord[],
  policyConfig: { profileName: string; governanceDepth: 'BASELINE' | 'ENHANCED' | 'INTENSIVE' },
  assessmentAsOf: string,
  specVersion: string,
): AssessmentOutput {
  // Validate spec version
  if (specVersion !== CSM_SPEC_VERSION) {
    throw new Error(`Spec version mismatch: expected ${CSM_SPEC_VERSION}, got ${specVersion}`)
  }

  // Merge external evidence/decisions/exceptions into the input
  const input: AssessmentInput = {
    ...systemContext,
    evidence: [...systemContext.evidence, ...evidence],
    decisions: [...systemContext.decisions, ...decisions],
    exceptions: [...systemContext.exceptions, ...exceptions],
  }

  // Evaluate all 16 components in stable order (by ComponentId)
  const allComponentIds = csmComponents.map((c) => c.id).sort()
  const componentResults: ComponentResult[] = allComponentIds.map((componentId) => {
    const contract = contractsByComponentId[componentId]
    return evaluateComponent(contract, input, assessmentAsOf)
  })

  // Derive domain states
  const domainResults: DomainResult[] = csmDomains.map((domain) => {
    const domainComponentResults = componentResults.filter((cr) => cr.domain === domain.id)
    const componentStates = Object.fromEntries(
      domainComponentResults.map((cr) => [cr.componentId, cr.state]),
    ) as Record<ComponentId, RequirementState>
    return {
      domainId: domain.id,
      state: deriveDomainState(domain.id, componentResults),
      componentStates,
    }
  })

  // Collect blockers
  const blockers: Blocker[] = componentResults
    .filter((cr) => cr.state === 'BLOCKED')
    .flatMap((cr) =>
      cr.blockingConditions.map((bc) => ({
        componentId: cr.componentId,
        ruleId: cr.objectiveRuleResults.find((rr) => !rr.passed)?.ruleId || 'UNKNOWN',
        description: bc,
        remediation: cr.remediation[0] || 'Address blocking condition.',
      })),
    )

  // Collect human review items
  const humanReviewsRequired: HumanReviewItem[] = componentResults
    .filter((cr) => cr.state === 'HUMAN_REVIEW_REQUIRED')
    .flatMap((cr) =>
      cr.humanJudgmentResults
        .filter((hjr) => hjr.state === 'HUMAN_REVIEW_REQUIRED')
        .map((hjr) => ({
          componentId: cr.componentId,
          judgmentId: hjr.judgmentId,
          question: hjr.question,
        })),
    )

  // Collect exception summaries
  const exceptionSummaries: ExceptionSummary[] = input.exceptions.map((e) => ({
    exceptionId: e.exceptionId,
    requirementId: e.requirementId,
    expiresAt: e.expiresAt,
    expired: isExpired(e.expiresAt, assessmentAsOf),
    scope: e.scope,
  }))

  // Collect evidence gaps
  const evidenceGaps: EvidenceGap[] = componentResults
    .filter((cr) => cr.evidenceStatus.some((es) => es.missing))
    .flatMap((cr) =>
      cr.evidenceStatus
        .filter((es) => es.missing)
        .map((es) => ({
          componentId: cr.componentId,
          evidenceRequirementId: es.evidenceRequirementId,
          label: es.label,
          description: `Missing evidence: ${es.label}`,
        })),
    )

  // Evaluate reassessment triggers
  const reassessmentTriggerResults = evaluateReassessmentTriggers(input, assessmentAsOf)

  // Evaluate handoffs
  const handoffs = evaluateHandoffs(domainResults)

  // Compute summary
  const summary = computeSummary(componentResults, domainResults)

  // Return deterministic output (all arrays sorted by stable key)
  return {
    specVersion,
    policyVersion: policyConfig.profileName,
    assessmentAsOf,
    systemId: input.systemId,
    governanceProfile: policyConfig.governanceDepth,
    domainResults: domainResults.sort((a, b) => a.domainId.localeCompare(b.domainId)),
    componentResults: componentResults.sort((a, b) => a.componentId.localeCompare(b.componentId)),
    blockers: blockers.sort((a, b) => a.componentId.localeCompare(b.componentId)),
    humanReviewsRequired: humanReviewsRequired.sort((a, b) => a.componentId.localeCompare(b.componentId)),
    exceptions: exceptionSummaries.sort((a, b) => a.exceptionId.localeCompare(b.exceptionId)),
    evidenceGaps: evidenceGaps.sort((a, b) => a.componentId.localeCompare(b.componentId)),
    reassessmentTriggers: reassessmentTriggerResults.sort((a, b) => a.triggerId.localeCompare(b.triggerId)),
    handoffs: handoffs.sort((a, b) => a.handoffId.localeCompare(b.handoffId)),
    summary,
  }
}
