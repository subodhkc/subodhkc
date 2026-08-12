/**
 * CSM 2.0 Golden Tests - Deterministic replay and exact output verification.
 *
 * Run: npx tsx tests/csm-v2/golden-tests.ts
 */

import { evaluateCsmV2 } from '../../data/csm/v2/evaluator'
import { fixtures } from '../../data/csm/v2/fixtures'
import { CSM_SPEC_VERSION } from '../../data/csm/v2/spec'

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

function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

console.log('=== CSM 2.0 Golden Tests ===\n')

// Test 1: Every fixture produces output with correct spec version
for (const fx of fixtures) {
  const output = evaluateCsmV2(
    fx.input,
    [],
    [],
    [],
    { profileName: fx.input.organizationPolicyProfile.profileName, governanceDepth: fx.input.organizationPolicyProfile.governanceDepth },
    fx.input.assessmentAsOf,
    CSM_SPEC_VERSION,
  )
  assert(output.specVersion === CSM_SPEC_VERSION, `${fx.id}: specVersion matches`)
  assert(output.systemId === fx.input.systemId, `${fx.id}: systemId matches`)
  assert(output.componentResults.length === 16, `${fx.id}: 16 component results`)
  assert(output.domainResults.length === 4, `${fx.id}: 4 domain results`)
}

// Test 2: Deterministic replay - same inputs produce identical outputs
for (const fx of fixtures) {
  const args: Parameters<typeof evaluateCsmV2> = [
    fx.input,
    [],
    [],
    [],
    { profileName: fx.input.organizationPolicyProfile.profileName, governanceDepth: fx.input.organizationPolicyProfile.governanceDepth },
    fx.input.assessmentAsOf,
    CSM_SPEC_VERSION,
  ]

  const out1 = evaluateCsmV2(...args)
  const out2 = evaluateCsmV2(...args)
  assert(deepEqual(out1, out2), `${fx.id}: deterministic replay produces identical output`)
}

// Test 3: Output ordering is stable (lexicographic by ID)
for (const fx of fixtures) {
  const output = evaluateCsmV2(
    fx.input,
    [],
    [],
    [],
    { profileName: fx.input.organizationPolicyProfile.profileName, governanceDepth: fx.input.organizationPolicyProfile.governanceDepth },
    fx.input.assessmentAsOf,
    CSM_SPEC_VERSION,
  )
  const componentIds = output.componentResults.map((c) => c.componentId)
  const sorted = [...componentIds].sort()
  assert(deepEqual(componentIds, sorted), `${fx.id}: component results sorted by componentId`)

  const domainIds = output.domainResults.map((d) => d.domainId)
  const sortedDomains = [...domainIds].sort()
  assert(deepEqual(domainIds, sortedDomains), `${fx.id}: domain results sorted by domainId`)
}

// Test 4: No forbidden output states
const forbiddenStates = ['LEGAL_COMPLIANT', 'EU_AI_ACT_COMPLIANT', 'COMPLIANT', 'SAFE', 'TRUSTWORTHY', 'CERTIFIED', 'AUDIT_PROOF']
for (const fx of fixtures) {
  const output = evaluateCsmV2(
    fx.input,
    [],
    [],
    [],
    { profileName: fx.input.organizationPolicyProfile.profileName, governanceDepth: fx.input.organizationPolicyProfile.governanceDepth },
    fx.input.assessmentAsOf,
    CSM_SPEC_VERSION,
  )
  for (const cr of output.componentResults) {
    assert(!forbiddenStates.includes(cr.state), `${fx.id}: component ${cr.componentId} has no forbidden state (${cr.state})`)
  }
  assert(!forbiddenStates.includes(output.summary.systemState), `${fx.id}: system state is not forbidden (${output.summary.systemState})`)
}

// Test 5: Fixture 6 - expired exception should not produce EXCEPTION_APPROVED
{
  const fx6 = fixtures.find((f) => f.id === 'fixture-6')!
  const output = evaluateCsmV2(
    fx6.input,
    [],
    [],
    [],
    { profileName: fx6.input.organizationPolicyProfile.profileName, governanceDepth: fx6.input.organizationPolicyProfile.governanceDepth },
    fx6.input.assessmentAsOf,
    CSM_SPEC_VERSION,
  )
  const securityComponent = output.componentResults.find((c) => c.componentId === 'CODE-SECURITY')
  assert(securityComponent?.state !== 'EXCEPTION_APPROVED', 'fixture-6: expired exception does not produce EXCEPTION_APPROVED')
  // The exception should be marked as expired in the output
  const expiredException = output.exceptions.find((e) => e.expired)
  assert(expiredException !== undefined, 'fixture-6: expired exception is marked as expired')
}

// Test 6: Fixture 1 - low-impact BASELINE should not have BLOCKED state for missing optional items
{
  const fx1 = fixtures.find((f) => f.id === 'fixture-1')!
  const output = evaluateCsmV2(
    fx1.input,
    [],
    [],
    [],
    { profileName: fx1.input.organizationPolicyProfile.profileName, governanceDepth: fx1.input.organizationPolicyProfile.governanceDepth },
    fx1.input.assessmentAsOf,
    CSM_SPEC_VERSION,
  )
  // Should have some NOT_ASSESSED or REQUIRED states but not all BLOCKED
  const blockedCount = output.componentResults.filter((c) => c.state === 'BLOCKED').length
  assert(blockedCount < 16, 'fixture-1: not all components are BLOCKED for a BASELINE system')
}

// Test 7: Spec version mismatch throws
{
  const fx1 = fixtures.find((f) => f.id === 'fixture-1')!
  let threw = false
  try {
    evaluateCsmV2(
      fx1.input,
      [],
      [],
      [],
      { profileName: 'baseline', governanceDepth: 'BASELINE' as const },
      fx1.input.assessmentAsOf,
      '1.0.0',
    )
  } catch {
    threw = true
  }
  assert(threw, 'Spec version mismatch throws error')
}

console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed > 0 ? 1 : 0)
