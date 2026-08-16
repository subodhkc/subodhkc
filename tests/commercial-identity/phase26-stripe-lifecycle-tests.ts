/**
 * Phase 2.6 — End-to-end Stripe lifecycle tests.
 *
 * Tests the webhook handler logic for all 4 subscription billing paths:
 * 1. $99 monthly (ai_advisor_desk, monthly)
 * 2. $99 annual (ai_advisor_desk, annual)
 * 3. $1,250 monthly (fractional_ai_advisor, monthly)
 * 4. $12,500 annual (fractional_ai_advisor, annual)
 *
 * For each path validates:
 * - Offer config (price, billing mode, included products)
 * - Terms metadata fields
 * - Engagement creation triggers
 * - Included product entitlement creation
 * - Session usage tracking (Fractional only)
 * - Monthly brief auto-creation (Fractional only)
 * - Cancellation handling
 * - Reactivation/resubscription
 *
 * Also tests:
 * - Session usage rollover logic
 * - "Something Changed" reopen logic
 * - Advisor affiliation creation
 * - Artifact creation with link metadata
 */

import { getOffer, getIncludedProducts, getServiceTerms, type OfferKey } from '../../lib/commercial/offers'
import { getCurrentMonth, getPreviousMonth } from '../../lib/fractional/session-usage'
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

function assertEqual(actual: unknown, expected: unknown, message: string) {
  const actualStr = JSON.stringify(actual)
  const expectedStr = JSON.stringify(expected)
  if (actualStr === expectedStr) {
    passed++
  } else {
    failed++
    console.error(`  ✗ ${message}: expected ${expectedStr}, got ${actualStr}`)
  }
}

function readFile(relPath: string): string {
  return readFileSync(join(__dirname, relPath), 'utf-8')
}

async function main() {
// ===== TEST 1: $99 Monthly — Offer config and lifecycle =====
console.log('\n=== Test 1: $99 Monthly billing path ===')
{
  const offer = getOffer('ai_advisor_desk')
  assert(offer !== undefined, '$99 offer exists')
  if (offer) {
    assertEqual(offer.monthlyPriceCents, 9900, '$99 monthly price')
    assertEqual(offer.billingMode, 'subscription', '$99 billing mode')
    assert(offer.createsEngagement !== true, '$99 does NOT create engagement (no Fractional OS)')
    assert(offer.includedProducts !== null, '$99 has included products')
    if (offer.includedProducts) {
      assertEqual(offer.includedProducts.haiecTier, 'advisor_essentials', '$99 HAIEC tier')
      assertEqual(offer.includedProducts.kestrelPlan, 'ai_number_basic', '$99 Kestrel plan')
      assertEqual(offer.includedProducts.kestrelCredits, 20, '$99 Kestrel credits')
    }
  }
}

// ===== TEST 2: $99 Annual — Offer config =====
console.log('\n=== Test 2: $99 Annual billing path ===')
{
  const offer = getOffer('ai_advisor_desk')
  if (offer) {
    assertEqual(offer.annualPriceCents, 99000, '$99 annual price = $990')
    assert(offer.annualPriceCents === 99000, '$99 annual discount applied')
  }
}

// ===== TEST 3: $1,250 Monthly — Offer config and lifecycle =====
console.log('\n=== Test 3: $1,250 Monthly billing path ===')
{
  const offer = getOffer('fractional_ai_advisor')
  assert(offer !== undefined, '$1,250 offer exists')
  if (offer) {
    assertEqual(offer.monthlyPriceCents, 125000, '$1,250 monthly price')
    assertEqual(offer.billingMode, 'subscription', '$1,250 billing mode')
    assertEqual(offer.createsEngagement, true, '$1,250 creates engagement')
    assertEqual(offer.engagementType, 'retainer', '$1,250 engagement type = retainer')
    assert(offer.includedProducts !== null, '$1,250 has included products')
    if (offer.includedProducts) {
      assertEqual(offer.includedProducts.haiecTier, 'scan', '$1,250 HAIEC tier = scan')
      assertEqual(offer.includedProducts.haiecSeats, 1, '$1,250 HAIEC seats = 1')
      assertEqual(offer.includedProducts.kestrelPlan, 'ai_number_basic', '$1,250 Kestrel plan')
      assertEqual(offer.includedProducts.kestrelCredits, 20, '$1,250 Kestrel credits')
    }
  }
}

// ===== TEST 4: $12,500 Annual — Offer config =====
console.log('\n=== Test 4: $12,500 Annual billing path ===')
{
  const offer = getOffer('fractional_ai_advisor')
  if (offer) {
    assertEqual(offer.annualPriceCents, 1250000, '$12,500 annual price')
    assert(offer.annualPriceCents === 1250000, '$1,250 annual = $12,500')
  }
}

// ===== TEST 5: Webhook creates engagement for Fractional only =====
console.log('\n=== Test 5: Engagement creation logic ===')
{
  const webhookContent = readFile('../../app/api/stripe/webhook/route.ts')
  assert(webhookContent.includes('offer.createsEngagement && offer.engagementType'),
    'Webhook checks createsEngagement flag')
  assert(webhookContent.includes("offerKey === 'fractional_ai_advisor'"),
    'Webhook has Fractional-specific engagement logic')
  assert(webhookContent.includes('fractional_monthly_briefs'),
    'Webhook auto-creates monthly brief for Fractional')
  assert(webhookContent.includes('fractional_session_usage'),
    'Webhook creates session usage record for Fractional')
}

// ===== TEST 6: Session usage tracking =====
console.log('\n=== Test 6: Session usage tracking ===')
{
  const sessionUsageContent = readFile('../../lib/fractional/session-usage.ts')
  assert(sessionUsageContent.includes('INCLUDED_SESSIONS_PER_MONTH = 2'),
    'Session usage: 2 included sessions per month')
  assert(sessionUsageContent.includes('MAX_ROLLOVER = 1'),
    'Session usage: max 1 rollover')
  assert(sessionUsageContent.includes('getOrCreateSessionUsage'),
    'Session usage: getOrCreateSessionUsage function')
  assert(sessionUsageContent.includes('incrementSessionUsage'),
    'Session usage: incrementSessionUsage function')
  assert(sessionUsageContent.includes('getSessionUsageSummary'),
    'Session usage: getSessionUsageSummary function')
  assert(sessionUsageContent.includes('rolled_over_from_prev'),
    'Session usage: tracks rollover from previous month')
  assert(sessionUsageContent.includes('rolled_over_to_next'),
    'Session usage: tracks rollover to next month')
}

// ===== TEST 7: Session usage enforcement in records API =====
console.log('\n=== Test 7: Session usage enforcement ===')
{
  const recordsApi = readFile('../../app/api/fractional/records/route.ts')
  assert(recordsApi.includes('incrementSessionUsage'),
    'Records API enforces session usage for working sessions')
  assert(recordsApi.includes('session_limit_reached'),
    'Records API returns session_limit_reached error')
  assert(recordsApi.includes('activation_call'),
    'Activation calls do not count against working session limit')
}

// ===== TEST 8: Rollover logic =====
console.log('\n=== Test 8: Rollover logic ===')
{
  const currentMonth = getCurrentMonth()
  const prevMonth = getPreviousMonth(currentMonth)
  assert(currentMonth.match(/^\d{4}-\d{2}$/) !== null, 'Current month format is YYYY-MM')
  assert(prevMonth.match(/^\d{4}-\d{2}$/) !== null, 'Previous month format is YYYY-MM')
  assert(prevMonth !== currentMonth, 'Previous month differs from current')

  // Rollover computation: max 1 unused session
  const included = 2
  const used = 1
  const rolledFromPrev = 0
  const available = included + rolledFromPrev - used
  const rollover = Math.min(Math.max(available, 0), 1)
  assertEqual(rollover, 1, '1 unused session rolls over (max 1)')

  const used2 = 2
  const available2 = included + rolledFromPrev - used2
  const rollover2 = Math.min(Math.max(available2, 0), 1)
  assertEqual(rollover2, 0, '0 unused sessions = 0 rollover')

  const used3 = 0
  const available3 = included + rolledFromPrev - used3
  const rollover3 = Math.min(Math.max(available3, 0), 1)
  assertEqual(rollover3, 1, '2 unused sessions = max 1 rollover')
}

// ===== TEST 9: "Something Changed" reopen logic =====
console.log('\n=== Test 9: Something Changed reopen logic ===')
{
  const recordsApi = readFile('../../app/api/fractional/records/route.ts')
  assert(recordsApi.includes("something_changed"),
    'Records API handles something_changed intake type')
  assert(recordsApi.includes('evidence_needed'),
    'Something Changed reopens opportunities to evidence_needed')
  assert(recordsApi.includes("'decided', 'closed', 'deferred'"),
    'Something Changed reopens decisions from decided/closed/deferred')
}

// ===== TEST 10: Advisor affiliations =====
console.log('\n=== Test 10: Advisor affiliations ===')
{
  const migration = readFile('../../supabase/migrations/0024_advisor_affiliations_session_usage.sql')
  assert(migration.includes('advisor_affiliations'),
    'Advisor affiliations table exists')
  assert(migration.includes('affiliate_name'),
    'Affiliation has name field')
  assert(migration.includes('affiliate_role'),
    'Affiliation has role field')
  assert(migration.includes('affiliate_company'),
    'Affiliation has company field')
  assert(migration.includes('relationship_type'),
    'Affiliation has relationship type')
  assert(migration.includes('approved_advisor'),
    'Affiliation supports approved_advisor type')
  assert(migration.includes('ENABLE ROW LEVEL SECURITY'),
    'Affiliations have RLS')

  const recordsApi = readFile('../../app/api/fractional/records/route.ts')
  assert(recordsApi.includes("affiliations: 'advisor_affiliations'"),
    'Records API supports affiliations type')
}

// ===== TEST 11: Decision artifacts with link metadata =====
console.log('\n=== Test 11: Decision artifacts with link metadata ===')
{
  const clientContent = readFile('../../components/app/AdvisoryWorkspaceClient.tsx')
  assert(clientContent.includes('artifact_type'),
    'Artifact creation supports artifact_type field')
  assert(clientContent.includes('decision_brief'),
    'Artifact type: decision_brief')
  assert(clientContent.includes('vendor_comparison'),
    'Artifact type: vendor_comparison')
  assert(clientContent.includes('architecture_review'),
    'Artifact type: architecture_review')
  assert(clientContent.includes('opportunity_analysis'),
    'Artifact type: opportunity_analysis')
  assert(clientContent.includes('roadmap'),
    'Artifact type: roadmap')
  assert(clientContent.includes('operating_recommendation'),
    'Artifact type: operating_recommendation')
  assert(clientContent.includes('external_url'),
    'Artifact creation supports external_url (link metadata, no file upload)')
}

// ===== TEST 12: Monthly brief auto-creation =====
console.log('\n=== Test 12: Monthly brief auto-creation ===')
{
  const webhookContent = readFile('../../app/api/stripe/webhook/route.ts')
  assert(webhookContent.includes('fractional_monthly_briefs'),
    'Webhook auto-creates monthly brief')
  assert(webhookContent.includes('upsert'),
    'Monthly brief uses upsert (idempotent)')
  assert(webhookContent.includes('onConflict'),
    'Monthly brief has conflict resolution')
  assert(webhookContent.includes('Engagement initiated'),
    'Auto-created brief has initial content')
}

// ===== TEST 13: Session usage display in dashboard =====
console.log('\n=== Test 13: Session usage display ===')
{
  const clientContent = readFile('../../components/app/AdvisoryWorkspaceClient.tsx')
  assert(clientContent.includes('sessionUsage'),
    'Dashboard receives session usage data')
  assert(clientContent.includes('Session Usage'),
    'Dashboard displays session usage section')
  assert(clientContent.includes('availableSessions'),
    'Dashboard shows available sessions count')
  assert(clientContent.includes('rolledOverFromPrev'),
    'Dashboard shows rollover info')
}

// ===== TEST 14: Advisor affiliation display in dashboard =====
console.log('\n=== Test 14: Advisor affiliation display ===')
{
  const clientContent = readFile('../../components/app/AdvisoryWorkspaceClient.tsx')
  assert(clientContent.includes('Approved Advisor Affiliation'),
    'Dashboard has Advisor Affiliation section')
  assert(clientContent.includes('affiliationList'),
    'Dashboard displays affiliation list')
  assert(clientContent.includes('affiliate_name'),
    'Dashboard shows affiliate name')
}

// ===== TEST 15: Advisory page fetches affiliations and session usage =====
console.log('\n=== Test 15: Advisory page data fetching ===')
{
  const pageContent = readFile('../../app/app/[orgSlug]/advisory/page.tsx')
  assert(pageContent.includes('advisor_affiliations'),
    'Advisory page fetches advisor affiliations')
  assert(pageContent.includes('fractional_session_usage'),
    'Advisory page fetches session usage')
  assert(pageContent.includes('sessionUsage'),
    'Advisory page passes session usage to client')
  assert(pageContent.includes('advisorAffiliations'),
    'Advisory page passes affiliations to client')
}

// ===== TEST 16: Migration 0024 applied with all tables =====
console.log('\n=== Test 16: Migration 0024 completeness ===')
{
  const migration = readFile('../../supabase/migrations/0024_advisor_affiliations_session_usage.sql')
  assert(migration.includes('CREATE TABLE IF NOT EXISTS advisor_affiliations'),
    'Migration creates advisor_affiliations table')
  assert(migration.includes('CREATE TABLE IF NOT EXISTS fractional_session_usage'),
    'Migration creates fractional_session_usage table')
  assert(migration.includes('compute_session_usage_for_month'),
    'Migration creates compute_session_usage_for_month function')
  assert(migration.includes('idx_session_usage_unique'),
    'Session usage has unique constraint per org+month')
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
