/**
 * CSM 2.0 Invariant Tests - Verify invariants hold across all fixtures.
 *
 * Run: npx tsx tests/csm-v2/invariant-tests.ts
 */

import { evaluateCsmV2 } from '../../data/csm/v2/evaluator'
import { fixtures } from '../../data/csm/v2/fixtures'
import { CSM_SPEC_VERSION } from '../../data/csm/v2/spec'
import { governanceContracts } from '../../data/csm/v2/contracts'

let passed = 0
let failed = 0

function assert(condition: boolean, message: string) {
  if (condition) {
    passed++
  } else {
    failed++
    console.error(`FAIL: ${message}`)
  }
}

console.log('=== CSM 2.0 Invariant Tests ===\n')

const VALID_COMPONENT_IDS = [
  'ENT-POLICY', 'ENT-RISK', 'ENT-DATA', 'ENT-MANDATE',
  'PRJ-BUSINESS', 'PRJ-TESTING', 'PRJ-SCALE', 'PRJ-PLAYBOOK',
  'CODE-STANDARDS', 'CODE-SECURITY', 'CODE-HUMAN', 'CODE-TRACE',
  'UX-IMPACT', 'UX-EXPLAIN', 'UX-CAPABILITY', 'UX-ADOPTION',
]

const FORBIDDEN_STATES = [
  'LEGAL_COMPLIANT', 'EU_AI_ACT_COMPLIANT', 'COMPLIANT',
  'SAFE', 'TRUSTWORTHY', 'CERTIFIED', 'AUDIT_PROOF',
]

// Helper to evaluate a fixture
function evalFixture(fx: typeof fixtures[0]) {
  return evaluateCsmV2(
    fx.input,
    [],
    [],
    [],
    { profileName: fx.input.organizationPolicyProfile.profileName, governanceDepth: fx.input.organizationPolicyProfile.governanceDepth },
    fx.input.assessmentAsOf,
    CSM_SPEC_VERSION,
  )
}

// INV-01: Missing required evidence cannot become SATISFIED
for (const fx of fixtures) {
  const output = evalFixture(fx)
  for (const cr of output.componentResults) {
    if (cr.state === 'SATISFIED') {
      const hasMissingEvidence = cr.evidenceStatus.some((e) => e.missing)
      assert(!hasMissingEvidence, `INV-01 ${fx.id}: ${cr.componentId} is SATISFIED but has missing evidence`)
    }
  }
}

// INV-02: BLOCKED requirement forces applicable domain BLOCKED
for (const fx of fixtures) {
  const output = evalFixture(fx)
  for (const cr of output.componentResults) {
    if (cr.state === 'BLOCKED') {
      const domain = output.domainResults.find((d) => d.domainId === cr.domain)
      assert(domain?.state === 'BLOCKED', `INV-02 ${fx.id}: ${cr.componentId} is BLOCKED but domain ${cr.domain} is ${domain?.state}`)
    }
  }
}

// INV-03: Expired exception cannot remain valid
{
  const fx6 = fixtures.find((f) => f.id === 'fixture-6')!
  const output = evalFixture(fx6)
  for (const ex of output.exceptions) {
    if (ex.expired) {
      const cr = output.componentResults.find((c) => c.componentId === ex.requirementId)
      assert(cr?.state !== 'EXCEPTION_APPROVED', `INV-03: expired exception for ${ex.requirementId} still EXCEPTION_APPROVED`)
    }
  }
}

// INV-04: Unknown input cannot silently PASS
for (const fx of fixtures) {
  const output = evalFixture(fx)
  for (const cr of output.componentResults) {
    for (const rr of cr.objectiveRuleResults) {
      if (!rr.evaluated) {
        assert(cr.state !== 'SATISFIED', `INV-04 ${fx.id}: ${cr.componentId} is SATISFIED but rule ${rr.ruleId} was not evaluated`)
      }
    }
  }
}

// INV-05: Same input produces deep-equal output (deterministic replay)
for (const fx of fixtures) {
  const out1 = evalFixture(fx)
  const out2 = evalFixture(fx)
  assert(JSON.stringify(out1) === JSON.stringify(out2), `INV-05 ${fx.id}: deterministic replay produces identical output`)
}

// INV-06: Output ordering remains stable
for (const fx of fixtures) {
  const output = evalFixture(fx)
  const componentIds = output.componentResults.map((c) => c.componentId)
  const sorted = [...componentIds].sort()
  assert(JSON.stringify(componentIds) === JSON.stringify(sorted), `INV-06 ${fx.id}: component results are not sorted`)
}

// INV-07: IDs remain stable
for (const fx of fixtures) {
  const output = evalFixture(fx)
  for (const cr of output.componentResults) {
    assert(VALID_COMPONENT_IDS.includes(cr.componentId), `INV-07 ${fx.id}: unknown component ID ${cr.componentId}`)
  }
}

// INV-08: Human review requirement cannot be auto-approved
for (const fx of fixtures) {
  const output = evalFixture(fx)
  for (const cr of output.componentResults) {
    if (cr.state === 'HUMAN_REVIEW_REQUIRED') {
      const hasPendingReview = cr.humanJudgmentResults.some((hjr) => hjr.state === 'HUMAN_REVIEW_REQUIRED')
      assert(hasPendingReview, `INV-08 ${fx.id}: ${cr.componentId} is HUMAN_REVIEW_REQUIRED but no pending human judgment found`)
    }
  }
}

// INV-10: No forbidden output states
for (const fx of fixtures) {
  const output = evalFixture(fx)
  for (const cr of output.componentResults) {
    assert(!FORBIDDEN_STATES.includes(cr.state), `INV-10 ${fx.id}: ${cr.componentId} has forbidden state ${cr.state}`)
  }
  assert(!FORBIDDEN_STATES.includes(output.summary.systemState), `INV-10 ${fx.id}: system has forbidden state ${output.summary.systemState}`)
}

// INV-11: Evidence coverage does not override blocker status
for (const fx of fixtures) {
  const output = evalFixture(fx)
  if (output.summary.blockers > 0) {
    assert(output.summary.systemState !== 'READY_FOR_GOVERNANCE_DECISION', `INV-11 ${fx.id}: blockers exist but system is READY_FOR_GOVERNANCE_DECISION`)
  }
}

// INV-12: Spec version in output matches input
for (const fx of fixtures) {
  const output = evalFixture(fx)
  assert(output.specVersion === CSM_SPEC_VERSION, `INV-12 ${fx.id}: specVersion mismatch`)
}

// Contract validation: every component has required fields
for (const contract of governanceContracts) {
  assert(!!contract.domain, `Contract ${contract.id}: has domain`)
  assert(!!contract.coreQuestion, `Contract ${contract.id}: has core question`)
  assert(contract.applicability.length > 0, `Contract ${contract.id}: has applicability rule`)
  assert(contract.outputs.length > 0, `Contract ${contract.id}: has outputs`)
  assert(contract.reassessmentTriggers.length > 0, `Contract ${contract.id}: has reassessment behavior`)
  assert(!!contract.sourceProvenance, `Contract ${contract.id}: has provenance`)
  assert(!!contract.purpose, `Contract ${contract.id}: has purpose`)
  assert(contract.objectiveRules.length > 0, `Contract ${contract.id}: has objective rules`)
  assert(contract.requiredEvidence.length > 0, `Contract ${contract.id}: has required evidence`)
}

// Contract validation: all 16 components have contracts
assert(governanceContracts.length === 16, 'All 16 components have governance contracts')

// Contract validation: contract IDs match valid component IDs
for (const contract of governanceContracts) {
  assert(VALID_COMPONENT_IDS.includes(contract.id as string), `Contract ID ${contract.id} is a valid component ID`)
}

console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed > 0 ? 1 : 0)
