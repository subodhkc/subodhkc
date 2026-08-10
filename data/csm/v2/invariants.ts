/**
 * CSM 2.0 Invariant / Property Tests
 *
 * Defines invariants that must hold for all evaluator outputs.
 * These are test specifications, not runtime assertions.
 */

export interface Invariant {
  id: string
  name: string
  description: string
  property: string
  fixtureIds: string[]
}

export const invariants: Invariant[] = [
  {
    id: 'INV-01',
    name: 'Missing required evidence cannot become SATISFIED',
    description: 'If any required evidence is missing for a component, that component state must not be SATISFIED.',
    property: 'componentResults.filter(c => c.state === "SATISFIED").every(c => c.evidenceStatus.every(e => e.satisfied || !e.evidenceRequirementId.startsWith(c.componentId) || !c.evidenceStatus.find(es => es.evidenceRequirementId === e.evidenceRequirementId)?.missing))',
    fixtureIds: ['fixture-1', 'fixture-2', 'fixture-3', 'fixture-4', 'fixture-5', 'fixture-6', 'fixture-7', 'fixture-8'],
  },
  {
    id: 'INV-02',
    name: 'BLOCKED requirement forces applicable domain BLOCKED',
    description: 'If any applicable component is BLOCKED, its domain must be BLOCKED.',
    property: 'componentResults.filter(c => c.state === "BLOCKED").every(c => domainResults.find(d => d.domainId === c.domain).state === "BLOCKED")',
    fixtureIds: ['fixture-1', 'fixture-2', 'fixture-3', 'fixture-4', 'fixture-5', 'fixture-6', 'fixture-7', 'fixture-8'],
  },
  {
    id: 'INV-03',
    name: 'Expired exception cannot remain valid',
    description: 'An exception with expiresAt before assessmentAsOf must not produce EXCEPTION_APPROVED state.',
    property: 'exceptions.every(e => !e.expired || componentResults.find(c => c.componentId === e.requirementId)?.state !== "EXCEPTION_APPROVED")',
    fixtureIds: ['fixture-6'],
  },
  {
    id: 'INV-04',
    name: 'Unknown critical applicability input cannot silently PASS',
    description: 'If a required input is missing (undefined), the component must not be SATISFIED.',
    property: 'componentResults.every(c => c.objectiveRuleResults.every(r => !r.evaluated ? c.state !== "SATISFIED" : true))',
    fixtureIds: ['fixture-1', 'fixture-2', 'fixture-3', 'fixture-4', 'fixture-5', 'fixture-6', 'fixture-7', 'fixture-8'],
  },
  {
    id: 'INV-05',
    name: 'Same input/spec/policy/asOf produces deep-equal output',
    description: 'Calling evaluateCsmV2 twice with identical inputs must produce identical outputs (structural equality).',
    property: 'JSON.stringify(evaluateCsmV2(...args)) === JSON.stringify(evaluateCsmV2(...args))',
    fixtureIds: ['fixture-1', 'fixture-2', 'fixture-3', 'fixture-4', 'fixture-5', 'fixture-6', 'fixture-7', 'fixture-8'],
  },
  {
    id: 'INV-06',
    name: 'Output ordering remains stable',
    description: 'All output arrays must be sorted by their stable identifier in lexicographic order.',
    property: 'componentResults.every((c, i, arr) => i === 0 || arr[i-1].componentId <= c.componentId) && domainResults.every((d, i, arr) => i === 0 || arr[i-1].domainId <= d.domainId)',
    fixtureIds: ['fixture-1', 'fixture-2', 'fixture-3', 'fixture-4', 'fixture-5', 'fixture-6', 'fixture-7', 'fixture-8'],
  },
  {
    id: 'INV-07',
    name: 'Current display labels cannot change stable IDs',
    description: 'Component IDs in output must match the canonical ComponentId type values exactly.',
    property: 'componentResults.every(c => ["ENT-POLICY","ENT-RISK","ENT-DATA","ENT-MANDATE","PRJ-BUSINESS","PRJ-TESTING","PRJ-SCALE","PRJ-PLAYBOOK","CODE-STANDARDS","CODE-SECURITY","CODE-HUMAN","CODE-TRACE","UX-IMPACT","UX-EXPLAIN","UX-CAPABILITY","UX-ADOPTION"].includes(c.componentId))',
    fixtureIds: ['fixture-1', 'fixture-2', 'fixture-3', 'fixture-4', 'fixture-5', 'fixture-6', 'fixture-7', 'fixture-8'],
  },
  {
    id: 'INV-08',
    name: 'Human-review requirement cannot be auto-approved',
    description: 'A component with HUMAN_REVIEW_REQUIRED state must not have any objective rule result that auto-approves it.',
    property: 'componentResults.filter(c => c.state === "HUMAN_REVIEW_REQUIRED").every(c => c.humanJudgmentResults.some(hjr => hjr.state === "HUMAN_REVIEW_REQUIRED"))',
    fixtureIds: ['fixture-1', 'fixture-2', 'fixture-3', 'fixture-4', 'fixture-5', 'fixture-6', 'fixture-7', 'fixture-8'],
  },
  {
    id: 'INV-09',
    name: 'A lower-risk profile cannot accidentally activate more restrictive rules than an explicitly higher configured profile',
    description: 'BASELINE profile should not produce more BLOCKED states than INTENSIVE profile for the same system, unless a different condition applies.',
    property: 'This is a cross-fixture comparison invariant. Run fixture-1 (BASELINE) and fixture-4 (INTENSIVE) and compare blocker counts. BASELINE blockers should not exceed INTENSIVE blockers for equivalent components.',
    fixtureIds: ['fixture-1', 'fixture-4'],
  },
  {
    id: 'INV-10',
    name: 'No forbidden output states',
    description: 'No component, domain, or system state may be a forbidden value (COMPLIANT, SAFE, TRUSTWORTHY, CERTIFIED, etc.).',
    property: 'const forbidden = ["LEGAL_COMPLIANT","EU_AI_ACT_COMPLIANT","COMPLIANT","SAFE","TRUSTWORTHY","CERTIFIED","AUDIT_PROOF"]; componentResults.every(c => !forbidden.includes(c.state)) && !forbidden.includes(summary.systemState)',
    fixtureIds: ['fixture-1', 'fixture-2', 'fixture-3', 'fixture-4', 'fixture-5', 'fixture-6', 'fixture-7', 'fixture-8'],
  },
  {
    id: 'INV-11',
    name: 'Evidence coverage does not override blocker status',
    description: 'If any blocker exists, systemState must not be READY_FOR_GOVERNANCE_DECISION regardless of evidenceCoverage.',
    property: 'summary.blockers > 0 ? summary.systemState !== "READY_FOR_GOVERNANCE_DECISION" : true',
    fixtureIds: ['fixture-1', 'fixture-2', 'fixture-3', 'fixture-4', 'fixture-5', 'fixture-6', 'fixture-7', 'fixture-8'],
  },
  {
    id: 'INV-12',
    name: 'Spec version in output matches input',
    description: 'The output specVersion must exactly match the specVersion passed to the evaluator.',
    property: 'output.specVersion === inputSpecVersion',
    fixtureIds: ['fixture-1', 'fixture-2', 'fixture-3', 'fixture-4', 'fixture-5', 'fixture-6', 'fixture-7', 'fixture-8'],
  },
]
