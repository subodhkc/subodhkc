/**
 * CSM 2.0 Golden Test Fixtures
 *
 * 8 representative fixtures for deterministic evaluation testing.
 * These are NOT real customers. They are test fixtures.
 *
 * For every fixture: same inputs + same versions must produce exact expected outputs.
 */

import type { AssessmentInput, EvidenceRecord, DecisionRecord, ExceptionRecord } from './spec'

const BASE_DATE = '2026-08-10'

// ============================================================================
// Fixture 1: Low-impact internal AI assistant
// ============================================================================

export const fixture1: AssessmentInput = {
  systemId: 'fixture-1-internal-assistant',
  systemVersion: '1.0.0',
  assessmentAsOf: BASE_DATE,
  intendedPurpose: 'Internal knowledge retrieval assistant for employees',
  businessOwner: 'Jane Doe',
  technicalOwner: 'John Smith',
  affectedStakeholders: ['employees'],
  deploymentContext: 'internal-only',
  models: [{ id: 'm1', name: 'gpt-4o-mini', version: '2024-07-18', provider: 'openai', type: 'llm' }],
  providers: [{ id: 'p1', name: 'OpenAI', role: 'model-provider' }],
  dataSources: [{ id: 'd1', name: 'Internal docs', type: 'rag', sensitivity: 'internal' }],
  tools: [],
  agents: [],
  integrations: [],
  autonomyCharacteristics: { canActWithoutHumanApproval: false, actionScope: 'read-only' },
  reversibilityCharacteristics: { actionsReversible: true, reversalComplexity: 'trivial' },
  dataSensitivityContext: { processesPersonalData: false, processesSensitiveData: false, dataCategories: ['internal-docs'] },
  externalImpactContext: { affectsExternalCustomers: false, affectsIndividualsRights: false, affectedPopulationSize: 'small' },
  organizationPolicyProfile: { profileName: 'baseline', governanceDepth: 'BASELINE', activatedFactors: [] },
  evidence: [
    { evidenceId: 'e1', type: 'document', title: 'AI Policy v1', source: 'governance-team', owner: 'Jane Doe', createdAt: '2025-09-01', effectiveAt: '2025-09-01', relatedRequirementIds: ['ENT-POLICY-E1'], status: 'active' },
    { evidenceId: 'e2', type: 'record', title: 'Accountable owner assignment', source: 'governance-team', owner: 'Jane Doe', createdAt: '2025-09-01', effectiveAt: '2025-09-01', relatedRequirementIds: ['ENT-POLICY-E2', 'ENT-MANDATE-E1'], status: 'active' },
  ],
  decisions: [],
  exceptions: [],
}

// ============================================================================
// Fixture 2: External customer-facing AI assistant
// ============================================================================

export const fixture2: AssessmentInput = {
  systemId: 'fixture-2-customer-assistant',
  systemVersion: '2.1.0',
  assessmentAsOf: BASE_DATE,
  intendedPurpose: 'Customer support chatbot handling inquiries and routing',
  businessOwner: 'Alice Brown',
  technicalOwner: 'Bob Jones',
  affectedStakeholders: ['customers', 'support-staff'],
  deploymentContext: 'external-customer-facing',
  models: [{ id: 'm1', name: 'gpt-4o', version: '2024-11-20', provider: 'openai', type: 'llm' }],
  providers: [{ id: 'p1', name: 'OpenAI', role: 'model-provider' }],
  dataSources: [
    { id: 'd1', name: 'Product docs', type: 'rag', sensitivity: 'public' },
    { id: 'd2', name: 'Customer history', type: 'database', sensitivity: 'confidential' },
  ],
  tools: [{ id: 't1', name: 'ticket-router', authority: 'write' }],
  agents: [],
  integrations: [{ id: 'i1', name: 'CRM', type: 'api', criticality: 'high' }],
  autonomyCharacteristics: { canActWithoutHumanApproval: false, actionScope: 'routing' },
  reversibilityCharacteristics: { actionsReversible: true, reversalComplexity: 'moderate' },
  dataSensitivityContext: { processesPersonalData: true, processesSensitiveData: false, dataCategories: ['customer-data'] },
  externalImpactContext: { affectsExternalCustomers: true, affectsIndividualsRights: false, affectedPopulationSize: 'large' },
  organizationPolicyProfile: { profileName: 'enhanced', governanceDepth: 'ENHANCED', activatedFactors: ['external-customer-impact', 'sensitive-data', 'large-affected-population'] },
  evidence: [
    { evidenceId: 'e1', type: 'document', title: 'AI Policy v2', source: 'governance-team', owner: 'Alice Brown', createdAt: '2025-10-01', effectiveAt: '2025-10-01', relatedRequirementIds: ['ENT-POLICY-E1'], status: 'active' },
    { evidenceId: 'e2', type: 'record', title: 'Owner assignment', source: 'governance-team', owner: 'Alice Brown', createdAt: '2025-10-01', effectiveAt: '2025-10-01', relatedRequirementIds: ['ENT-POLICY-E2', 'ENT-MANDATE-E1'], status: 'active' },
    { evidenceId: 'e3', type: 'risk-assessment', title: 'Risk assessment 2026', source: 'risk-team', owner: 'Alice Brown', createdAt: '2026-01-15', effectiveAt: '2026-01-15', expiresAt: '2027-01-15', relatedRequirementIds: ['ENT-RISK-E1'], status: 'active' },
    { evidenceId: 'e4', type: 'impact-analysis', title: 'Customer impact analysis', source: 'ux-team', owner: 'Alice Brown', createdAt: '2026-02-01', effectiveAt: '2026-02-01', expiresAt: '2027-02-01', relatedRequirementIds: ['UX-IMPACT-E1'], status: 'active' },
  ],
  decisions: [
    { decisionId: 'd1', requirementId: 'ENT-POLICY', question: 'Is the use ethically acceptable?', decision: 'APPROVED', decisionType: 'human_approval', reviewer: 'Alice Brown', reviewerRole: 'Product Manager', rationale: 'Standard customer support use case within policy boundaries.', evidenceRefs: ['e1'], decidedAt: '2025-10-05', effectiveAt: '2025-10-05', specVersion: '2.0.0', policyVersion: 'enhanced' },
  ],
  exceptions: [],
}

// ============================================================================
// Fixture 3: AI-assisted software-development workflow
// ============================================================================

export const fixture3: AssessmentInput = {
  systemId: 'fixture-3-ai-dev-workflow',
  systemVersion: '1.0.0',
  assessmentAsOf: BASE_DATE,
  intendedPurpose: 'AI code assistant for development team',
  businessOwner: 'Tech Lead',
  technicalOwner: 'Tech Lead',
  affectedStakeholders: ['developers'],
  deploymentContext: 'internal-dev-tools',
  models: [{ id: 'm1', name: 'claude-sonnet', version: '4', provider: 'anthropic', type: 'llm' }],
  providers: [{ id: 'p1', name: 'Anthropic', role: 'model-provider' }],
  dataSources: [{ id: 'd1', name: 'Codebase', type: 'repository', sensitivity: 'confidential' }],
  tools: [],
  agents: [],
  integrations: [{ id: 'i1', name: 'IDE', type: 'plugin', criticality: 'medium' }],
  autonomyCharacteristics: { canActWithoutHumanApproval: false, actionScope: 'code-suggestion' },
  reversibilityCharacteristics: { actionsReversible: true, reversalComplexity: 'trivial' },
  dataSensitivityContext: { processesPersonalData: false, processesSensitiveData: false, dataCategories: ['source-code'] },
  externalImpactContext: { affectsExternalCustomers: false, affectsIndividualsRights: false, affectedPopulationSize: 'small' },
  organizationPolicyProfile: { profileName: 'baseline', governanceDepth: 'BASELINE', activatedFactors: [] },
  evidence: [
    { evidenceId: 'e1', type: 'dev-standards', title: 'AI-assisted dev standards', source: 'eng-team', owner: 'Tech Lead', createdAt: '2026-01-01', effectiveAt: '2026-01-01', relatedRequirementIds: ['CODE-STANDARDS-E1'], status: 'active' },
    { evidenceId: 'e2', type: 'security-scan', title: 'Security scan results', source: 'ci-cd', owner: 'Tech Lead', createdAt: '2026-07-01', effectiveAt: '2026-07-01', expiresAt: '2026-10-01', relatedRequirementIds: ['CODE-SECURITY-E1'], status: 'active' },
  ],
  decisions: [],
  exceptions: [],
}

// ============================================================================
// Fixture 4: High-impact decision-support scenario
// ============================================================================

export const fixture4: AssessmentInput = {
  systemId: 'fixture-4-high-impact-decision',
  systemVersion: '1.0.0',
  assessmentAsOf: BASE_DATE,
  intendedPurpose: 'AI decision support for loan approval recommendations',
  businessOwner: 'Chief Risk Officer',
  technicalOwner: 'ML Team Lead',
  affectedStakeholders: ['loan-applicants', 'loan-officers'],
  deploymentContext: 'production-critical',
  models: [{ id: 'm1', name: 'custom-model', version: '3.2', provider: 'internal', type: 'tabular-ml' }],
  providers: [{ id: 'p1', name: 'Internal', role: 'model-provider' }],
  dataSources: [
    { id: 'd1', name: 'Credit history', type: 'database', sensitivity: 'restricted' },
    { id: 'd2', name: 'Application data', type: 'database', sensitivity: 'confidential' },
  ],
  tools: [],
  agents: [],
  integrations: [{ id: 'i1', name: 'Core banking', type: 'api', criticality: 'high' }],
  autonomyCharacteristics: { canActWithoutHumanApproval: false, actionScope: 'recommendation-only' },
  reversibilityCharacteristics: { actionsReversible: false, reversalComplexity: 'difficult' },
  dataSensitivityContext: { processesPersonalData: true, processesSensitiveData: true, dataCategories: ['financial', 'credit-history'] },
  externalImpactContext: { affectsExternalCustomers: true, affectsIndividualsRights: true, affectedPopulationSize: 'large' },
  organizationPolicyProfile: { profileName: 'intensive', governanceDepth: 'INTENSIVE', activatedFactors: ['consequential-decisions', 'sensitive-data', 'difficult-to-reverse', 'external-regulatory-exposure', 'significant-financial-impact'] },
  evidence: [
    { evidenceId: 'e1', type: 'document', title: 'AI Policy v3', source: 'governance', owner: 'CRO', createdAt: '2025-06-01', effectiveAt: '2025-06-01', relatedRequirementIds: ['ENT-POLICY-E1'], status: 'active' },
    { evidenceId: 'e2', type: 'record', title: 'CRO assignment', source: 'governance', owner: 'CRO', createdAt: '2025-06-01', effectiveAt: '2025-06-01', relatedRequirementIds: ['ENT-POLICY-E2', 'ENT-MANDATE-E1'], status: 'active' },
    { evidenceId: 'e3', type: 'risk-assessment', title: 'Risk assessment', source: 'risk-team', owner: 'CRO', createdAt: '2026-03-01', effectiveAt: '2026-03-01', expiresAt: '2027-03-01', relatedRequirementIds: ['ENT-RISK-E1'], status: 'active' },
    { evidenceId: 'e4', type: 'impact-analysis', title: 'Impact analysis', source: 'ux-team', owner: 'CRO', createdAt: '2026-03-15', effectiveAt: '2026-03-15', expiresAt: '2027-03-15', relatedRequirementIds: ['UX-IMPACT-E1'], status: 'active' },
  ],
  decisions: [
    { decisionId: 'd1', requirementId: 'ENT-POLICY', question: 'Is the use ethically acceptable?', decision: 'CONDITIONAL', decisionType: 'human_approval', reviewer: 'CRO', reviewerRole: 'Chief Risk Officer', rationale: 'Acceptable with human-in-the-loop requirement.', evidenceRefs: ['e1'], decidedAt: '2025-06-10', effectiveAt: '2025-06-10', specVersion: '2.0.0', policyVersion: 'intensive' },
    { decisionId: 'd2', requirementId: 'ENT-RISK', question: 'Is residual risk acceptable?', decision: 'APPROVED', decisionType: 'risk_acceptance', reviewer: 'CRO', reviewerRole: 'Chief Risk Officer', rationale: 'Residual risk within tolerance with mandatory human review.', evidenceRefs: ['e3'], decidedAt: '2026-03-10', effectiveAt: '2026-03-10', specVersion: '2.0.0', policyVersion: 'intensive' },
  ],
  exceptions: [],
}

// ============================================================================
// Fixture 5: Agent with tool authority
// ============================================================================

export const fixture5: AssessmentInput = {
  systemId: 'fixture-5-agent-with-tools',
  systemVersion: '0.9.0',
  assessmentAsOf: BASE_DATE,
  intendedPurpose: 'Autonomous agent that can send emails and update CRM records',
  businessOwner: 'VP Sales',
  technicalOwner: 'AI Team Lead',
  affectedStakeholders: ['sales-team', 'customers'],
  deploymentContext: 'production',
  models: [{ id: 'm1', name: 'gpt-4o', version: '2024-11-20', provider: 'openai', type: 'llm' }],
  providers: [{ id: 'p1', name: 'OpenAI', role: 'model-provider' }],
  dataSources: [{ id: 'd1', name: 'CRM data', type: 'database', sensitivity: 'confidential' }],
  tools: [
    { id: 't1', name: 'email-sender', authority: 'external-action' },
    { id: 't2', name: 'crm-updater', authority: 'write' },
  ],
  agents: [{ id: 'a1', name: 'sales-agent', tools: ['t1', 't2'], autonomyLevel: 'supervised' }],
  integrations: [{ id: 'i1', name: 'Email service', type: 'api', criticality: 'high' }, { id: 'i2', name: 'CRM', type: 'api', criticality: 'high' }],
  autonomyCharacteristics: { canActWithoutHumanApproval: true, actionScope: 'email-and-crm' },
  reversibilityCharacteristics: { actionsReversible: false, reversalComplexity: 'difficult' },
  dataSensitivityContext: { processesPersonalData: true, processesSensitiveData: false, dataCategories: ['customer-contact'] },
  externalImpactContext: { affectsExternalCustomers: true, affectsIndividualsRights: false, affectedPopulationSize: 'medium' },
  organizationPolicyProfile: { profileName: 'enhanced', governanceDepth: 'ENHANCED', activatedFactors: ['autonomous-action', 'external-customer-impact', 'difficult-to-reverse'] },
  evidence: [],
  decisions: [],
  exceptions: [],
}

// ============================================================================
// Fixture 6: Existing system with an expired governance exception
// ============================================================================

export const fixture6: AssessmentInput = {
  systemId: 'fixture-6-expired-exception',
  systemVersion: '2.3.1',
  assessmentAsOf: BASE_DATE,
  intendedPurpose: 'Internal document processing with AI OCR',
  businessOwner: 'Operations Director',
  technicalOwner: 'IT Lead',
  affectedStakeholders: ['operations-team'],
  deploymentContext: 'internal',
  models: [{ id: 'm1', name: 'textract', version: 'latest', provider: 'aws', type: 'ocr' }],
  providers: [{ id: 'p1', name: 'AWS', role: 'service-provider' }],
  dataSources: [{ id: 'd1', name: 'Document store', type: 'storage', sensitivity: 'confidential' }],
  tools: [],
  agents: [],
  integrations: [],
  autonomyCharacteristics: { canActWithoutHumanApproval: false, actionScope: 'ocr-processing' },
  reversibilityCharacteristics: { actionsReversible: true, reversalComplexity: 'trivial' },
  dataSensitivityContext: { processesPersonalData: true, processesSensitiveData: false, dataCategories: ['business-documents'] },
  externalImpactContext: { affectsExternalCustomers: false, affectsIndividualsRights: false, affectedPopulationSize: 'small' },
  organizationPolicyProfile: { profileName: 'baseline', governanceDepth: 'BASELINE', activatedFactors: [] },
  evidence: [
    { evidenceId: 'e1', type: 'document', title: 'AI Policy', source: 'governance', owner: 'Ops Director', createdAt: '2025-01-01', effectiveAt: '2025-01-01', relatedRequirementIds: ['ENT-POLICY-E1'], status: 'active' },
  ],
  decisions: [],
  exceptions: [
    {
      exceptionId: 'ex1',
      requirementId: 'CODE-SECURITY',
      reason: 'Security scanning being configured with interim manual review',
      approver: 'IT Lead',
      approverRole: 'Engineering Lead',
      compensatingControls: ['Manual security review checklist'],
      issuedAt: '2026-02-01',
      expiresAt: '2026-05-01',
      scope: 'CODE-SECURITY only',
      evidenceRefs: ['e1'],
      reassessmentTrigger: 'TRIGGER-EXCEPTION-EXPIRY',
    },
  ],
}

// ============================================================================
// Fixture 7: System requiring human/legal applicability review
// ============================================================================

export const fixture7: AssessmentInput = {
  systemId: 'fixture-7-legal-review',
  systemVersion: '1.0.0',
  assessmentAsOf: BASE_DATE,
  intendedPurpose: 'AI-powered resume screening tool',
  businessOwner: 'HR Director',
  technicalOwner: 'HR Tech Lead',
  affectedStakeholders: ['job-applicants', 'hr-team'],
  deploymentContext: 'production-hr',
  models: [{ id: 'm1', name: 'screening-model', version: '1.0', provider: 'vendor-x', type: 'nlp-classifier' }],
  providers: [{ id: 'p1', name: 'Vendor X', role: 'model-provider' }],
  dataSources: [{ id: 'd1', name: 'Resume database', type: 'database', sensitivity: 'confidential' }],
  tools: [],
  agents: [],
  integrations: [],
  autonomyCharacteristics: { canActWithoutHumanApproval: false, actionScope: 'screening-recommendation' },
  reversibilityCharacteristics: { actionsReversible: true, reversalComplexity: 'moderate' },
  dataSensitivityContext: { processesPersonalData: true, processesSensitiveData: true, dataCategories: ['employment-history', 'demographics'] },
  externalImpactContext: { affectsExternalCustomers: false, affectsIndividualsRights: true, affectedPopulationSize: 'large' },
  organizationPolicyProfile: { profileName: 'intensive', governanceDepth: 'INTENSIVE', activatedFactors: ['consequential-decisions', 'sensitive-data', 'external-regulatory-exposure', 'large-affected-population'] },
  evidence: [
    { evidenceId: 'e1', type: 'document', title: 'AI Policy', source: 'governance', owner: 'HR Director', createdAt: '2025-08-01', effectiveAt: '2025-08-01', relatedRequirementIds: ['ENT-POLICY-E1'], status: 'active' },
  ],
  decisions: [],
  exceptions: [],
}

// ============================================================================
// Fixture 8: Material provider/model change triggering reassessment
// ============================================================================

export const fixture8: AssessmentInput = {
  systemId: 'fixture-8-model-change',
  systemVersion: '3.0.0',
  assessmentAsOf: BASE_DATE,
  intendedPurpose: 'Content moderation AI for user-generated content',
  businessOwner: 'Trust & Safety Lead',
  technicalOwner: 'ML Engineer',
  affectedStakeholders: ['platform-users', 'moderators'],
  deploymentContext: 'production',
  models: [{ id: 'm1', name: 'new-moderation-model', version: '2.0', provider: 'new-vendor', type: 'content-classifier' }],
  providers: [{ id: 'p1', name: 'New Vendor', role: 'model-provider' }],
  dataSources: [{ id: 'd1', name: 'Content stream', type: 'stream', sensitivity: 'public' }],
  tools: [],
  agents: [],
  integrations: [],
  autonomyCharacteristics: { canActWithoutHumanApproval: true, actionScope: 'content-flagging' },
  reversibilityCharacteristics: { actionsReversible: true, reversalComplexity: 'moderate' },
  dataSensitivityContext: { processesPersonalData: false, processesSensitiveData: false, dataCategories: ['user-content'] },
  externalImpactContext: { affectsExternalCustomers: true, affectsIndividualsRights: false, affectedPopulationSize: 'large' },
  organizationPolicyProfile: { profileName: 'enhanced', governanceDepth: 'ENHANCED', activatedFactors: ['autonomous-action', 'external-customer-impact', 'large-affected-population'] },
  evidence: [
    { evidenceId: 'e1', type: 'document', title: 'AI Policy', source: 'governance', owner: 'T&S Lead', createdAt: '2025-03-01', effectiveAt: '2025-03-01', relatedRequirementIds: ['ENT-POLICY-E1'], status: 'active' },
    { evidenceId: 'e2', type: 'testing-results', title: 'Previous model testing results', source: 'ml-team', owner: 'ML Engineer', createdAt: '2025-06-01', effectiveAt: '2025-06-01', relatedRequirementIds: ['PRJ-TESTING-E2'], status: 'active' },
  ],
  decisions: [],
  exceptions: [],
}

// ============================================================================
// Fixture Registry
// ============================================================================

export const fixtures = [
  { id: 'fixture-1', label: 'Low-impact internal AI assistant', input: fixture1 },
  { id: 'fixture-2', label: 'External customer-facing AI assistant', input: fixture2 },
  { id: 'fixture-3', label: 'AI-assisted software-development workflow', input: fixture3 },
  { id: 'fixture-4', label: 'High-impact decision-support scenario', input: fixture4 },
  { id: 'fixture-5', label: 'Agent with tool authority', input: fixture5 },
  { id: 'fixture-6', label: 'Existing system with an expired governance exception', input: fixture6 },
  { id: 'fixture-7', label: 'System requiring human/legal applicability review', input: fixture7 },
  { id: 'fixture-8', label: 'Material provider/model change triggering reassessment', input: fixture8 },
]
