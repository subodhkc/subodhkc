/**
 * Phase 2.6 — RLS and lifecycle tests for Fractional operating records.
 *
 * Tests:
 * 1. RLS policies exist on all new tables
 * 2. Record type validation
 * 3. Intake type validation
 * 4. Opportunity status validation
 * 5. Read-only enforcement on record APIs
 * 6. Session usage tracking fields
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let passed = 0
let failed = 0

function assert(condition: boolean, message: string) {
  if (condition) {
    passed++
  } else {
    failed++
    console.error(`  ✗ ${message}`)
  }
}

function readFile(relPath: string): string {
  return readFileSync(join(__dirname, relPath), 'utf-8')
}

async function main() {
// ===== TEST 1: RLS policies in migration =====
console.log('\n=== Test 1: RLS policies in migration ===')
{
  const migration = readFile('../../supabase/migrations/0023_fractional_operating_records.sql')
  const tables = [
    'fractional_intake_records',
    'fractional_opportunities',
    'fractional_evidence',
    'fractional_working_sessions',
    'fractional_monthly_briefs',
    'fractional_priorities',
  ]
  for (const table of tables) {
    assert(migration.includes(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY`),
      `${table} should have RLS enabled`)
    assert(migration.includes(`Service role full access to ${table}`),
      `${table} should have service role policy`)
    assert(migration.includes(`Users can read own org ${table}`),
      `${table} should have user read policy`)
  }
}

// ===== TEST 2: Record type validation in API =====
console.log('\n=== Test 2: Record type validation ===')
{
  const apiContent = readFile('../../app/api/fractional/records/route.ts')
  const expectedTypes = ['intake', 'opportunities', 'evidence', 'sessions', 'briefs', 'priorities', 'actions', 'artifacts', 'outcomes']
  for (const type of expectedTypes) {
    assert(apiContent.includes(type), `API should support record type: ${type}`)
  }
}

// ===== TEST 3: Intake type validation =====
console.log('\n=== Test 3: Intake type validation ===')
{
  const apiContent = readFile('../../app/api/fractional/records/route.ts')
  const expectedIntakeTypes = [
    'ask_question', 'explore_opportunity', 'review_decision', 'review_vendor',
    'review_system', 'explore_partnership', 'share_report', 'something_changed',
  ]
  for (const type of expectedIntakeTypes) {
    assert(apiContent.includes(`'${type}'`), `API should validate intake type: ${type}`)
  }
}

// ===== TEST 4: Opportunity status validation =====
console.log('\n=== Test 4: Opportunity status validation ===')
{
  const apiContent = readFile('../../app/api/fractional/records/route.ts')
  const expectedStatuses = [
    'new', 'exploring', 'evidence_needed', 'candidate', 'recommended',
    'deferred', 'rejected', 'advanced', 'closed',
  ]
  for (const status of expectedStatuses) {
    assert(apiContent.includes(`'${status}'`), `API should validate opportunity status: ${status}`)
  }
}

// ===== TEST 5: Read-only enforcement =====
console.log('\n=== Test 5: Read-only enforcement on records API ===')
{
  const apiContent = readFile('../../app/api/fractional/records/route.ts')
  assert(apiContent.includes('checkMutationAllowed'),
    'Records API should enforce read-only state via checkMutationAllowed')
}

// ===== TEST 6: Session usage tracking fields =====
console.log('\n=== Test 6: Session usage tracking fields ===')
{
  const migration = readFile('../../supabase/migrations/0023_fractional_operating_records.sql')
  assert(migration.includes('billing_period_month'),
    'Working sessions should have billing_period_month field')
  assert(migration.includes('rolled_over_from_month'),
    'Working sessions should have rolled_over_from_month field')
  assert(migration.includes('session_type'),
    'Working sessions should have session_type field (working/activation_call)')
}

// ===== TEST 7: Monthly brief uniqueness =====
console.log('\n=== Test 7: Monthly brief uniqueness ===')
{
  const migration = readFile('../../supabase/migrations/0023_fractional_operating_records.sql')
  assert(migration.includes('idx_frac_briefs_unique'),
    'Monthly briefs should have unique constraint per org+month')
  assert(migration.includes('organization_id, brief_month'),
    'Unique constraint should be on (organization_id, brief_month)')
}

// ===== TEST 8: Evidence provenance tracking =====
console.log('\n=== Test 8: Evidence provenance tracking ===')
{
  const migration = readFile('../../supabase/migrations/0023_fractional_operating_records.sql')
  const provenanceTypes = ['client_provided', 'external_public', 'advisor_analysis', 'tool_result', 'verified_outcome']
  for (const p of provenanceTypes) {
    assert(migration.includes(`'${p}'`), `Evidence should support provenance: ${p}`)
  }
}

// ===== TEST 9: Advisory page fetches all records =====
console.log('\n=== Test 9: Advisory page fetches all records ===')
{
  const pageContent = readFile('../../app/app/[orgSlug]/advisory/page.tsx')
  const tables = [
    'fractional_intake_records',
    'fractional_opportunities',
    'fractional_evidence',
    'fractional_working_sessions',
    'fractional_monthly_briefs',
    'fractional_priorities',
    'engagement_actions',
    'engagement_artifacts',
    'fractional_outcomes',
  ]
  for (const table of tables) {
    assert(pageContent.includes(table), `Advisory page should fetch from ${table}`)
  }
}

// ===== TEST 10: Dashboard wires records to UI =====
console.log('\n=== Test 10: Dashboard wires records to UI ===')
{
  const clientContent = readFile('../../components/app/AdvisoryWorkspaceClient.tsx')
  assert(clientContent.includes('intakeList'), 'Dashboard should display intake records')
  assert(clientContent.includes('opportunityList'), 'Dashboard should display opportunities')
  assert(clientContent.includes('evidenceList'), 'Dashboard should display evidence')
  assert(clientContent.includes('sessionList'), 'Dashboard should display working sessions')
  assert(clientContent.includes('priorityList'), 'Dashboard should display priorities')
  assert(clientContent.includes('actionList'), 'Dashboard should display actions')
  assert(clientContent.includes('outcomeList'), 'Dashboard should display outcomes')
  assert(clientContent.includes('handleCreateRecord'), 'Dashboard should have record creation handler')
  assert(clientContent.includes('RecordCreationModal'), 'Dashboard should have record creation modal')
}

// ===== TEST 11: Intake types match spec =====
console.log('\n=== Test 11: Intake types match spec ===')
{
  const clientContent = readFile('../../components/app/AdvisoryWorkspaceClient.tsx')
  const expectedLabels = [
    'Ask a Question',
    'Explore an Opportunity',
    'Make/Review a Decision',
    'Review a Vendor',
    'Review a System or Architecture',
    'Explore a Partnership',
    'Share a Report/Evidence',
    'Something Changed',
  ]
  for (const label of expectedLabels) {
    assert(clientContent.includes(`label: '${label}'`), `Dashboard should have intake type: ${label}`)
  }
}

// ===== RESULTS =====
console.log('\n=== Results ===')
console.log(`Passed: ${passed}`)
console.log(`Failed: ${failed}`)
if (failed === 0) {
  console.log('ALL TESTS PASSED')
} else {
  console.error(`${failed} TESTS FAILED`)
  process.exit(1)
}
}

main().catch(err => {
  console.error('Test runner error:', err)
  process.exit(1)
})
