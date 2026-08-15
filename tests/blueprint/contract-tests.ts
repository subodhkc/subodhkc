/**
 * Contract tests for Blueprint qualification schema, fit logic, and payload validation.
 *
 * Run: npx tsx tests/blueprint/contract-tests.ts
 */

import {
  parseQualification,
  evaluateFit,
  toDbColumns,
  QUALIFICATION_FIELDS,
  REQUIRED_FIELDS,
  MIN_REQUIRED_FILLED,
  type BlueprintQualification,
} from '../../lib/commercial/blueprint-schema'

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

function assertEqual<T>(actual: T, expected: T, message: string) {
  if (actual === expected) {
    passed++
  } else {
    failed++
    console.error(`FAIL: ${message} — expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)
  }
}

// ============================================
// 1. SCHEMA FIELD CONSISTENCY
// ============================================

function testSchemaFields() {
  console.log('\n--- Schema Field Consistency ---')

  // QUALIFICATION_FIELDS should have 8 fields
  assert(QUALIFICATION_FIELDS.length === 8, 'Should have 8 qualification fields')

  // Required fields: business_objective and opportunity_or_problem
  assert(REQUIRED_FIELDS.length === 2, 'Should have 2 required fields')
  assert(REQUIRED_FIELDS.includes('business_objective'), 'business_objective should be required')
  assert(REQUIRED_FIELDS.includes('opportunity_or_problem'), 'opportunity_or_problem should be required')

  // MIN_REQUIRED_FILLED should be 2
  assertEqual(MIN_REQUIRED_FILLED, 2, 'MIN_REQUIRED_FILLED should be 2')

  // opportunity_or_problem should NOT be named workflow_problem
  const allKeys = QUALIFICATION_FIELDS.map(f => f.key)
  assert(!allKeys.includes('workflow_problem' as any), 'Schema should NOT use workflow_problem key (canonical: opportunity_or_problem)')

  // team_context should NOT be named team_functions
  assert(!allKeys.includes('team_functions' as any), 'Schema should NOT use team_functions key (canonical: team_context)')
}

// ============================================
// 2. PARSE QUALIFICATION
// ============================================

function testParseQualification() {
  console.log('\n--- Parse Qualification ---')

  // Valid input with all fields
  const valid = parseQualification({
    business_objective: 'Reduce onboarding time',
    opportunity_or_problem: 'Team spends 10 hours/week on manual review',
    current_process: 'form → manual → spreadsheet',
    systems_involved: 'HubSpot, QuickBooks',
    team_context: '2-5',
    desired_outcome: '50% reduction in manual hours',
    sensitive_data: 'no',
    timeline: '1-3 months',
  })
  assert(valid !== null, 'Valid input should parse successfully')
  assertEqual(valid!.business_objective, 'Reduce onboarding time', 'business_objective should map')
  assertEqual(valid!.opportunity_or_problem, 'Team spends 10 hours/week on manual review', 'opportunity_or_problem should map')
  assertEqual(valid!.sensitive_data, false, 'sensitive_data "no" should parse to false')

  // Valid with only required fields
  const minimal = parseQualification({
    business_objective: 'Improve efficiency',
    opportunity_or_problem: 'Manual process is slow',
  })
  assert(minimal !== null, 'Minimal valid input should parse')
  assertEqual(minimal!.current_process, '', 'Optional fields should default to empty string')

  // Invalid: missing required field
  const missingReq = parseQualification({
    business_objective: 'Improve efficiency',
  })
  assert(missingReq === null, 'Missing required field should return null')

  // Invalid: required field too short
  const tooShort = parseQualification({
    business_objective: 'ab',
    opportunity_or_problem: 'cd',
  })
  assert(tooShort === null, 'Required fields < 3 chars should return null')

  // Invalid: empty input
  const empty = parseQualification({})
  assert(empty === null, 'Empty input should return null')

  // sensitive_data parsing
  assert(parseQualification({
    business_objective: 'test objective',
    opportunity_or_problem: 'test problem',
    sensitive_data: 'true',
  })!.sensitive_data === true, 'sensitive_data "true" should parse to true')

  assert(parseQualification({
    business_objective: 'test objective',
    opportunity_or_problem: 'test problem',
    sensitive_data: 'yes',
  })!.sensitive_data === true, 'sensitive_data "yes" should parse to true')
}

// ============================================
// 3. FIT LOGIC (Opportunity-First Model)
// ============================================

function testFitLogic() {
  console.log('\n--- Fit Logic (Opportunity-First) ---')

  const baseQual: BlueprintQualification = {
    business_objective: 'Reduce customer onboarding time',
    opportunity_or_problem: 'Team spends 10 hours/week on manual review',
    current_process: 'form → manual → spreadsheet',
    systems_involved: 'HubSpot, QuickBooks',
    team_context: '2-5',
    desired_outcome: '50% reduction in manual hours',
    sensitive_data: false,
    timeline: '1-3 months',
  }

  // Standard blueprint for normal qualification
  const standard = evaluateFit(baseQual)
  assertEqual(standard.decision, 'standard_blueprint', 'Normal qualification should be standard_blueprint')

  // Expanded scope for sensitive data
  const sensitive = evaluateFit({ ...baseQual, sensitive_data: true })
  assertEqual(sensitive.decision, 'expanded_scope_review', 'Sensitive data should trigger expanded_scope_review')

  // Expanded scope for many systems
  const manySystems = evaluateFit({
    ...baseQual,
    systems_involved: 'HubSpot, QuickBooks, Salesforce, Slack, Gmail, Zapier, Airtable',
  })
  assertEqual(manySystems.decision, 'expanded_scope_review', '6+ systems should trigger expanded_scope_review')

  // NOT rejected for missing workflow_problem (opportunity-first model)
  const noProblem = evaluateFit({
    ...baseQual,
    opportunity_or_problem: '',
  })
  assert(noProblem.decision !== 'not_a_fit', 'Empty opportunity_or_problem should NOT be not_a_fit (opportunity-first)')

  // Not a fit only if BOTH required fields are extremely short
  const gibberish = evaluateFit({
    ...baseQual,
    business_objective: 'ab',
    opportunity_or_problem: 'cd',
  })
  assertEqual(gibberish.decision, 'not_a_fit', 'Both required fields < 3 chars should be not_a_fit')

  // Fit reason should be non-empty
  assert(standard.reason.length > 0, 'Fit result should have a non-empty reason')
}

// ============================================
// 4. DB COLUMN MAPPING
// ============================================

function testDbMapping() {
  console.log('\n--- DB Column Mapping ---')

  const qual: BlueprintQualification = {
    business_objective: 'Reduce onboarding time',
    opportunity_or_problem: 'Manual review is bottleneck',
    current_process: 'form → manual',
    systems_involved: 'HubSpot, QuickBooks',
    team_context: '2-5',
    desired_outcome: '50% reduction',
    sensitive_data: true,
    timeline: '1-3 months',
  }

  const db = toDbColumns(qual)

  // Canonical → DB legacy mappings
  assertEqual(db.workflow_problem, 'Manual review is bottleneck', 'opportunity_or_problem should map to workflow_problem DB column')
  assertEqual(db.team_functions, '2-5', 'team_context should map to team_functions DB column')

  // Direct mappings
  assertEqual(db.business_objective, 'Reduce onboarding time', 'business_objective should map directly')
  assertEqual(db.sensitive_data, true, 'sensitive_data should map directly')
  assertEqual(db.systems_involved, 'HubSpot, QuickBooks', 'systems_involved should map directly')
  assertEqual(db.timeline, '1-3 months', 'timeline should map directly')

  // Optional fields should allow null
  const minimal: BlueprintQualification = {
    business_objective: 'test',
    opportunity_or_problem: 'test',
    current_process: '',
    systems_involved: '',
    team_context: '',
    desired_outcome: '',
    sensitive_data: false,
    timeline: '',
  }
  const minDb = toDbColumns(minimal)
  assertEqual(minDb.current_process, null, 'Empty current_process should map to null')
  assertEqual(minDb.systems_involved, null, 'Empty systems_involved should map to null')
  assertEqual(minDb.team_functions, null, 'Empty team_context should map to null for team_functions')
}

// ============================================
// 5. FRONTEND → BACKEND PAYLOAD CONTRACT
// ============================================

function testPayloadContract() {
  console.log('\n--- Frontend → Backend Payload Contract ---')

  // Simulate frontend form responses (keys match QUALIFICATION_FIELDS)
  const frontendResponses: Record<string, string> = {
    business_objective: 'Reduce onboarding time',
    opportunity_or_problem: 'Manual review is slow',
    current_process: 'form → manual → email',
    systems_involved: 'HubSpot',
    team_context: '2-5',
    desired_outcome: '50% faster',
    sensitive_data: 'no',
    timeline: 'immediately',
  }

  // Backend parseQualification should accept these keys directly
  const parsed = parseQualification(frontendResponses)
  assert(parsed !== null, 'Frontend responses should parse successfully on backend')

  // Fit evaluation should work on parsed result
  const fit = evaluateFit(parsed!)
  assert(fit.decision === 'standard_blueprint' || fit.decision === 'expanded_scope_review',
    'Parsed frontend responses should produce a valid fit decision')

  // DB mapping should work end-to-end
  const dbCols = toDbColumns(parsed!)
  assert(typeof dbCols.business_objective === 'string', 'DB mapping should produce string for business_objective')
  assert(typeof dbCols.workflow_problem === 'string', 'DB mapping should produce string for workflow_problem')
}

// ============================================
// RUN ALL TESTS
// ============================================

function main() {
  console.log('=== Blueprint Contract Tests ===')

  testSchemaFields()
  testParseQualification()
  testFitLogic()
  testDbMapping()
  testPayloadContract()

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`)
  if (failed > 0) {
    process.exit(1)
  }
}

main()
