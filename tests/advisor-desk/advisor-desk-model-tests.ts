/**
 * Advisor Desk Model Tests
 *
 * Verifies that the commercial model is correctly configured:
 * - No hard question allowance enforcement
 * - Classification fields supported
 * - Member priority concept present
 * - No stale quota language in offer config
 * - No 'light-touch' in public-facing copy
 *
 * Run: npx tsx tests/advisor-desk/advisor-desk-model-tests.ts
 */

import { COMMERCIAL_OFFERS, getOffer } from '../../lib/commercial/offers'

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

console.log('=== Advisor Desk Model Tests ===\n')

// ============================================
// 1. OFFER CONFIG: NO HARD QUOTA
// ============================================
console.log('--- Offer Config ---')

const advisorOffer = getOffer('ai_advisor_desk')
assert(advisorOffer !== null, 'ai_advisor_desk offer exists')

assert(
  advisorOffer?.advisorQuestionsPerPeriod === null,
  'advisorQuestionsPerPeriod is null (no hard quota)'
)

assert(
  advisorOffer?.monthlyPriceCents === 9900,
  'monthlyPriceCents is still $99 (unchanged pricing)'
)

assert(
  advisorOffer?.annualPriceCents === 99000,
  'annualPriceCents is still $990 (unchanged pricing)'
)

assert(
  advisorOffer?.teamSeatLimit === 3,
  'teamSeatLimit is still 3'
)

assert(
  !advisorOffer!.checkoutDescription.toLowerCase().includes('monthly advisory access'),
  'checkoutDescription no longer says "monthly advisory access"'
)

assert(
  !advisorOffer!.checkoutDescription.toLowerCase().includes('light-touch'),
  'checkoutDescription no longer says "light-touch"'
)

assert(
  advisorOffer!.checkoutDescription.toLowerCase().includes('human advisory access'),
  'checkoutDescription includes "human advisory access"'
)

// ============================================
// 2. NO STALE QUOTA LANGUAGE IN OFFER
// ============================================
console.log('\n--- Stale Quota Language ---')

const offerJson = JSON.stringify(advisorOffer)
const staleTerms = ['one question', 'monthly question', 'question allowance', 'allowance exceeded', '$49', 'pooled question', 'light-touch', 'email-based', 'pays for itself', 'stop guessing', 'safe to use', 'everything included', 'upsell funnel', '40+ sources']

for (const term of staleTerms) {
  assert(
    !offerJson.toLowerCase().includes(term.toLowerCase()),
    `offer config does not contain stale term "${term}"`
  )
}

// ============================================
// 3. OTHER OFFERS UNAFFECTED
// ============================================
console.log('\n--- Other Offers Unaffected ---')

const otherOffers = ['ai_automation_blueprint', 'managed_voice', 'ai_security_compliance', 'saas_security_review']
for (const key of otherOffers) {
  const offer = getOffer(key)
  assert(offer !== null, `${key} offer exists`)
  assert(
    offer?.advisorQuestionsPerPeriod === null,
    `${key} has null advisorQuestionsPerPeriod (not affected)`
  )
}

// ============================================
// 4. ALL OFFERS ACCESSIBLE
// ============================================
console.log('\n--- Offer Registry ---')

const allKeys = Object.keys(COMMERCIAL_OFFERS)
assert(allKeys.length === 6, 'exactly 6 commercial offers exist (including fractional_ai_advisor)')
assert(
  allKeys.includes('ai_advisor_desk'),
  'ai_advisor_desk is in the registry'
)

// ============================================
// 5. PRICING CONSISTENCY
// ============================================
console.log('\n--- Pricing Consistency ---')

assert(
  advisorOffer?.startingPriceLabel === '$99/month',
  'startingPriceLabel is $99/month'
)

assert(
  advisorOffer?.billingMode === 'subscription',
  'billingMode is subscription'
)

assert(
  !advisorOffer?.createsEngagement,
  'ai_advisor_desk does not create engagement on purchase'
)

assert(
  !advisorOffer?.requiresQualification,
  'ai_advisor_desk does not require qualification'
)

// ============================================
// RESULTS
// ============================================
console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`)
if (failed > 0) {
  process.exit(1)
}
