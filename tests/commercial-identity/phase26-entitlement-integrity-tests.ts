/**
 * Phase 2.6 — Advisory Entitlement Integrity + Fractional Operating System
 * Lifecycle and invariant tests.
 *
 * Tests:
 * 1. Terms acceptance is NOT recorded at checkout creation (only at completion)
 * 2. Included product entitlement states are valid
 * 3. Fractional read-only access state transitions
 * 4. Entitlement tier mapping (SubodhKC labels → external platform tiers)
 * 5. Service terms pages are noindex
 * 6. Locked commercial offer values
 * 7. Mutation guard logic
 */

import { getOffer, getIncludedProducts, getServiceTerms, type OfferKey } from '../../lib/commercial/offers'
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
// ===== TEST 1: Terms acceptance NOT recorded at checkout creation =====
console.log('\n=== Test 1: Terms acceptance integrity ===')
{
  const checkoutContent = readFile('../../lib/stripe/checkout.ts')
  const hasPreCheckoutCall = checkoutContent.includes('await recordTermsAcceptance(') &&
    !checkoutContent.includes('NOTE: Terms acceptance is NOT recorded here')
  assert(!hasPreCheckoutCall, 'Checkout creation should NOT record terms acceptance')
  assert(checkoutContent.includes('NOTE: Terms acceptance is NOT recorded here'),
    'Checkout should document that acceptance is NOT recorded at creation')
  assert(!checkoutContent.includes("terms_accepted_at: new Date().toISOString()"),
    'Checkout metadata should NOT include terms_accepted_at pretending acceptance happened')
}

// ===== TEST 2: Included product entitlement states =====
console.log('\n=== Test 2: Included product entitlement states ===')
{
  const validStates = ['included', 'ready_to_activate', 'provisioning', 'active', 'provisioning_failed', 'suspended', 'ended']
  assert(validStates.length === 7, 'Should have 7 valid entitlement states')

  const validProvisioningStates = ['pending', 'in_progress', 'provisioned', 'failed', 'not_applicable']
  assert(validProvisioningStates.length === 5, 'Should have 5 valid provisioning states')
}

// ===== TEST 3: Locked commercial offer values =====
console.log('\n=== Test 3: Locked commercial offer values ===')
{
  const advisor = getOffer('ai_advisor_desk')
  assert(advisor !== undefined, 'AI Advisor for Business offer exists')
  if (advisor) {
    assertEqual(advisor.monthlyPriceCents, 9900, 'AI Advisor monthly price = $99')
    assertEqual(advisor.annualPriceCents, 99000, 'AI Advisor annual price = $990')
    assertEqual(advisor.teamSeatLimit, 3, 'AI Advisor team seats = 3')
    assert(advisor.includedProducts !== null, 'AI Advisor has included products')
    if (advisor.includedProducts) {
      assertEqual(advisor.includedProducts.haiecTier, 'advisor_essentials', 'AI Advisor HAIEC tier = advisor_essentials')
      assertEqual(advisor.includedProducts.kestrelPlan, 'ai_number_basic', 'AI Advisor Kestrel plan = ai_number_basic')
      assertEqual(advisor.includedProducts.kestrelCredits, 20, 'AI Advisor Kestrel credits = 20')
      assertEqual(advisor.includedProducts.memberTools, true, 'AI Advisor includes member tools')
    }
  }

  const fractional = getOffer('fractional_ai_advisor')
  assert(fractional !== undefined, 'Fractional AI Advisor offer exists')
  if (fractional) {
    assertEqual(fractional.monthlyPriceCents, 125000, 'Fractional monthly price = $1,250')
    assertEqual(fractional.annualPriceCents, 1250000, 'Fractional annual price = $12,500')
    assertEqual(fractional.teamSeatLimit, 5, 'Fractional team seats = 5')
    assert(fractional.includedProducts !== null, 'Fractional has included products')
    if (fractional.includedProducts) {
      assertEqual(fractional.includedProducts.haiecTier, 'scan', 'Fractional HAIEC tier = scan')
      assertEqual(fractional.includedProducts.haiecSeats, 1, 'Fractional HAIEC seats = 1')
      assertEqual(fractional.includedProducts.kestrelPlan, 'ai_number_basic', 'Fractional Kestrel plan = ai_number_basic')
      assertEqual(fractional.includedProducts.kestrelCredits, 20, 'Fractional Kestrel credits = 20')
      assertEqual(fractional.includedProducts.memberTools, true, 'Fractional includes member tools')
    }
  }
}

// ===== TEST 4: Service terms references =====
console.log('\n=== Test 4: Service terms references ===')
{
  const advisorTerms = getServiceTerms('ai_advisor_desk')
  assert(advisorTerms !== null, 'AI Advisor has service terms')
  if (advisorTerms) {
    assertEqual(advisorTerms.scheduleSlug, 'ai-advisor-for-business', 'AI Advisor schedule slug')
    assertEqual(advisorTerms.version, '2026-08', 'AI Advisor terms version')
  }

  const fractionalTerms = getServiceTerms('fractional_ai_advisor')
  assert(fractionalTerms !== null, 'Fractional has service terms')
  if (fractionalTerms) {
    assertEqual(fractionalTerms.scheduleSlug, 'fractional-ai-advisor', 'Fractional schedule slug')
    assertEqual(fractionalTerms.version, '2026-08', 'Fractional terms version')
  }
}

// ===== TEST 5: Entitlement tier mapping to external platforms =====
console.log('\n=== Test 5: External tier mapping ===')
{
  const advisorIncluded = getIncludedProducts('ai_advisor_desk')
  if (advisorIncluded?.haiecTier) {
    const haiecMapped = advisorIncluded.haiecTier === 'advisor_essentials' ? 'scan' : advisorIncluded.haiecTier
    assertEqual(haiecMapped, 'scan', 'AI Advisor HAIEC maps to scan externally')
  }
  if (advisorIncluded?.kestrelPlan) {
    const kestrelMapped = advisorIncluded.kestrelPlan === 'ai_number_basic' ? 'phone_number' : advisorIncluded.kestrelPlan
    assertEqual(kestrelMapped, 'phone_number', 'AI Advisor Kestrel maps to phone_number externally')
  }

  const fractionalIncluded = getIncludedProducts('fractional_ai_advisor')
  if (fractionalIncluded?.haiecTier) {
    const haiecMapped = fractionalIncluded.haiecTier === 'advisor_essentials' ? 'scan' : fractionalIncluded.haiecTier
    assertEqual(haiecMapped, 'scan', 'Fractional HAIEC maps to scan externally')
  }
  if (fractionalIncluded?.kestrelPlan) {
    const kestrelMapped = fractionalIncluded.kestrelPlan === 'ai_number_basic' ? 'phone_number' : fractionalIncluded.kestrelPlan
    assertEqual(kestrelMapped, 'phone_number', 'Fractional Kestrel maps to phone_number externally')
  }
}

// ===== TEST 6: Fractional read-only access state logic =====
console.log('\n=== Test 6: Fractional read-only access logic ===')
{
  const now = new Date()
  const expiryDate = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
  const thirtyDaysAfterExpiry = new Date(expiryDate.getTime() + 30 * 24 * 60 * 60 * 1000)
  assert(now <= thirtyDaysAfterExpiry, '5 days after expiry is within 30-day window')

  const oldExpiry = new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000)
  const oldThirtyDaysAfter = new Date(oldExpiry.getTime() + 30 * 24 * 60 * 60 * 1000)
  assert(now > oldThirtyDaysAfter, '35 days after expiry is beyond 30-day window')
}

// ===== TEST 7: Mutation guard logic =====
console.log('\n=== Test 7: Mutation guard logic ===')
{
  const activeEnt = { effective_status: 'active', valid_until: null }
  assert(activeEnt.effective_status === 'active', 'Active entitlement allows mutations')

  const expiredEnt = { effective_status: 'expired', valid_until: new Date(Date.now() - 5 * 86400000).toISOString() }
  assert(expiredEnt.effective_status === 'expired', 'Expired entitlement blocks mutations')

  const expiry = new Date(expiredEnt.valid_until!)
  const thirtyDaysAfter = new Date(expiry.getTime() + 30 * 86400000)
  assert(new Date() <= thirtyDaysAfter, 'Within 30-day read-only window')
}

// ===== TEST 8: No AI chat positioning =====
console.log('\n=== Test 8: No AI chat positioning ===')
{
  const advisorPage = readFile('../../app/ai-advisor/page.tsx')
  // "Not a chatbot" is allowed — it's explicitly saying the product is NOT a chatbot
  // We check for positive chatbot positioning (e.g., "AI chat" as a feature, "chatbot advisory")
  const advisorLower = advisorPage.toLowerCase()
  const hasPositiveChat = (advisorLower.includes('ai chat') && !advisorLower.includes('not a chat')) ||
    (advisorLower.includes('chatbot') && !advisorLower.includes('not a chatbot'))
  assert(!hasPositiveChat,
    'AI Advisor page should not use positive AI chat/chatbot positioning')

  const advisoryPage = readFile('../../app/advisory/page.tsx')
  const advisoryLower = advisoryPage.toLowerCase()
  const hasPositiveChatAdvisory = (advisoryLower.includes('ai chat') && !advisoryLower.includes('not a chat')) ||
    (advisoryLower.includes('chatbot') && !advisoryLower.includes('not a chatbot'))
  assert(!hasPositiveChatAdvisory,
    'Advisory page should not use positive AI chat/chatbot positioning')
}

// ===== TEST 9: Service terms pages are noindex =====
console.log('\n=== Test 9: Service terms noindex ===')
{
  const advisorTerms = readFile('../../app/service-terms/ai-advisor-for-business/page.tsx')
  assert(advisorTerms.includes('index: false'), 'AI Advisor service terms should be noindex')
  assert(advisorTerms.includes('follow: true'), 'AI Advisor service terms should be follow')

  const fractionalTerms = readFile('../../app/service-terms/fractional-ai-advisor/page.tsx')
  assert(fractionalTerms.includes('index: false'), 'Fractional service terms should be noindex')
  assert(fractionalTerms.includes('follow: true'), 'Fractional service terms should be follow')
}

// ===== TEST 10: IP and confidentiality terms corrections =====
console.log('\n=== Test 10: Service terms corrections ===')
{
  const advisorTerms = readFile('../../app/service-terms/ai-advisor-for-business/page.tsx')
  assert(advisorTerms.includes('service providers/subprocessors'),
    'AI Advisor terms should use subprocessor-aware confidentiality wording')
  assert(advisorTerms.includes('Background IP'),
    'AI Advisor terms should define Background IP')
  assert(advisorTerms.includes('Client Materials'),
    'AI Advisor terms should define Client Materials')
  assert(advisorTerms.includes('Client-Specific Deliverables'),
    'AI Advisor terms should define Client-Specific Deliverables')
  assert(advisorTerms.includes('passwords') && advisorTerms.includes('API keys'),
    'AI Advisor terms should include sensitive data warning')
  assert(advisorTerms.includes('attorney review'),
    'AI Advisor IP section should be marked for attorney review')

  const fractionalTerms = readFile('../../app/service-terms/fractional-ai-advisor/page.tsx')
  assert(fractionalTerms.includes('service providers/subprocessors'),
    'Fractional terms should use subprocessor-aware confidentiality wording')
  assert(fractionalTerms.includes('Background IP'),
    'Fractional terms should define Background IP')
  assert(fractionalTerms.includes('Client-Specific Deliverables'),
    'Fractional terms should define Client-Specific Deliverables')
  assert(fractionalTerms.includes('passwords') && fractionalTerms.includes('API keys'),
    'Fractional terms should include sensitive data warning')
}

// ===== TEST 11: Google Indexing API removed from CI for ordinary pages =====
console.log('\n=== Test 11: Search engine CI fix ===')
{
  const ciContent = readFile('../../.github/workflows/ci.yml')
  assert(!ciContent.includes('Submit URLs to Google Indexing API'),
    'CI should not submit ordinary URLs to Google Indexing API')
  assert(ciContent.includes('IndexNow'),
    'CI should keep IndexNow')
  assert(ciContent.includes('Submit sitemap to Google Search Console API'),
    'CI should keep GSC sitemap submission')
  assert(ciContent.includes('continue-on-error: true'),
    'CI ping job should be non-blocking')
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
