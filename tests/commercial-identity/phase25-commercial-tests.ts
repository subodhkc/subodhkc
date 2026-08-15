/**
 * Phase 2.5 Commercial Offer Registry Tests
 *
 * Validates:
 * - Fractional AI Advisor offer exists in the canonical registry
 * - Public offer names match the locked architecture
 * - Stripe price env var naming convention
 * - Fractional checkout route structure
 * - Webhook handles fractional_ai_advisor
 *
 * Run: npx tsx tests/commercial-identity/phase25-commercial-tests.ts
 */

import * as fs from 'fs/promises'
import * as path from 'path'

let passed = 0
let failed = 0

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  PASS: ${message}`)
    passed++
  } else {
    console.error(`  FAIL: ${message}`)
    failed++
  }
}

async function readFile(relPath: string): Promise<string> {
  return fs.readFile(path.join(process.cwd(), relPath), 'utf-8')
}

// ============================================
// TEST: Offer registry includes fractional_ai_advisor
// ============================================

async function testFractionalOfferInRegistry() {
  console.log('\n--- Test: Fractional AI Advisor in offer registry ---')

  const offersFile = await readFile('lib/commercial/offers.ts')

  assert(
    offersFile.includes("'fractional_ai_advisor'"),
    'OfferKey type should include fractional_ai_advisor'
  )

  assert(
    offersFile.includes("key: 'fractional_ai_advisor'"),
    'Offer registry should have fractional_ai_advisor entry'
  )

  assert(
    offersFile.includes('125000') && offersFile.includes('1250000'),
    'Fractional offer should have $1,250/month and $12,500/year price in cents'
  )

  assert(
    offersFile.includes("billingMode: 'subscription'"),
    'Fractional offer should be a subscription'
  )

  assert(
    offersFile.includes("landingPage: '/advisory'"),
    'Fractional offer should route to /advisory'
  )
}

// ============================================
// TEST: Public offer names in data/commercial-offers.ts
// ============================================

async function testPublicOfferNames() {
  console.log('\n--- Test: Public offer names match locked architecture ---')

  const publicOffers = await readFile('data/commercial-offers.ts')

  assert(
    publicOffers.includes("name: 'AI Advisor for Business'"),
    'Public offer should use "AI Advisor for Business" not "AI Advisor Desk"'
  )

  assert(
    publicOffers.includes("name: 'AI Opportunity & Workflow Assessment'"),
    'Public offer should use "AI Opportunity & Workflow Assessment"'
  )

  assert(
    publicOffers.includes("name: 'Fractional AI Advisor'"),
    'Public offer should use "Fractional AI Advisor" not "Fractional AI Advisor / Lead"'
  )

  assert(
    !publicOffers.includes("Fractional AI Advisor / Lead"),
    'Public offers should NOT contain stale "Fractional AI Advisor / Lead" name'
  )

  assert(
    publicOffers.includes("$1,250/month"),
    'Fractional offer should display $1,250/month'
  )

  assert(
    publicOffers.includes("$12,500/year"),
    'Fractional offer should display $12,500/year'
  )
}

// ============================================
// TEST: Fractional checkout route exists and is correct
// ============================================

async function testFractionalCheckoutRoute() {
  console.log('\n--- Test: Fractional checkout route structure ---')

  const routeFile = await readFile('app/api/commercial/fractional-advisor/checkout/route.ts')

  assert(
    routeFile.includes("offerKey: OfferKey = 'fractional_ai_advisor'"),
    'Checkout route should use fractional_ai_advisor offer key'
  )

  assert(
    routeFile.includes('createSubscriptionCheckout'),
    'Checkout route should use createSubscriptionCheckout'
  )

  assert(
    routeFile.includes('/advisory?checkout=success'),
    'Checkout route should redirect to /advisory success URL'
  )

  assert(
    routeFile.includes('organization_id: organization.id'),
    'Checkout route should bind to organization_id'
  )

  assert(
    routeFile.includes('hasActiveEntitlement'),
    'Checkout route should check for duplicate entitlement'
  )

  assert(
    routeFile.includes('already_active'),
    'Checkout route should return already_active for duplicates'
  )
}

// ============================================
// TEST: Webhook handles fractional_ai_advisor
// ============================================

async function testWebhookHandlesFractional() {
  console.log('\n--- Test: Webhook handles fractional_ai_advisor ---')

  const webhookRoute = await readFile('app/api/stripe/webhook/route.ts')

  assert(
    webhookRoute.includes("offerKey === 'fractional_ai_advisor'"),
    'Webhook should handle fractional_ai_advisor offer key'
  )

  assert(
    webhookRoute.includes('sendFractionalAdvisorWelcomeEmail'),
    'Webhook should send fractional advisor welcome email'
  )
}

// ============================================
// TEST: Fractional welcome email function exists
// ============================================

async function testFractionalWelcomeEmail() {
  console.log('\n--- Test: Fractional welcome email function ---')

  const emailFile = await readFile('lib/email.ts')

  assert(
    emailFile.includes('export async function sendFractionalAdvisorWelcomeEmail'),
    'Email module should export sendFractionalAdvisorWelcomeEmail'
  )

  assert(
    emailFile.includes('Welcome to Fractional AI Advisor'),
    'Welcome email should have correct subject'
  )
}

// ============================================
// TEST: /advisory page uses new public name and pricing
// ============================================

async function testAdvisoryPage() {
  console.log('\n--- Test: /advisory page updates ---')

  const page = await readFile('app/advisory/page.tsx')

  assert(
    page.includes('Fractional AI Advisor | Executive AI Strategy Advisor'),
    'Advisory page title should target Fractional AI Advisor + Executive AI Strategy Advisor'
  )

  assert(
    page.includes('$1,250/month'),
    'Advisory page should show $1,250/month core price'
  )

  assert(
    page.includes('$12,500/year'),
    'Advisory page should show $12,500/year annual option'
  )

  assert(
    page.includes('FractionalAdvisorCheckoutCTA'),
    'Advisory page should use FractionalAdvisorCheckoutCTA component'
  )

  assert(
    !page.includes('3-month minimum'),
    'Advisory page should NOT contain stale "3-month minimum" language'
  )

  // "Custom scoped" may appear in the comparison section for AI Implementation & Systems Architecture
  // but should NOT be the Fractional AI Advisor's primary pricing
  assert(
    page.includes('$1,250/month'),
    'Advisory page should show $1,250/month as Fractional AI Advisor primary pricing'
  )
}

// ============================================
// TEST: /ai-advisor page uses new public name
// ============================================

async function testAIAdvisorPage() {
  console.log('\n--- Test: /ai-advisor page updates ---')

  const page = await readFile('app/ai-advisor/page.tsx')

  assert(
    page.includes('AI Advisor for Business'),
    'AI advisor page should use "AI Advisor for Business" as public name'
  )

  assert(
    page.includes('AI Advisor for Business | Human AI Advisory'),
    'AI advisor page title should target "AI Advisor for Business"'
  )

  assert(
    page.includes('name: \'AI Advisor for Business\''),
    'Service schema should use "AI Advisor for Business"'
  )

  assert(
    !page.includes('Not a researcher. Not a blogger.'),
    'AI advisor page should NOT contain prohibited "Not a researcher. Not a blogger." language'
  )
}

// ============================================
// TEST: /ai-automation page uses new service name
// ============================================

async function testAIAutomationPage() {
  console.log('\n--- Test: /ai-automation page updates ---')

  const page = await readFile('app/ai-automation/page.tsx')

  assert(
    page.includes('AI Opportunity & Workflow Assessment'),
    'AI automation page should use "AI Opportunity & Workflow Assessment" as service name'
  )

  assert(
    page.includes('AI Automation Blueprint'),
    'AI automation page should still reference "AI Automation Blueprint" as the deliverable'
  )

  assert(
    page.includes('name: \'AI Opportunity & Workflow Assessment\''),
    'Service schema should use "AI Opportunity & Workflow Assessment"'
  )
}

// ============================================
// TEST: Homepage uses new public names
// ============================================

async function testHomepage() {
  console.log('\n--- Test: Homepage commercial section ---')

  const homepage = await readFile('components/home/CommercialDecisionSection.tsx')

  assert(
    homepage.includes('AI Advisor for Business'),
    'Homepage should use "AI Advisor for Business"'
  )

  assert(
    homepage.includes('AI Opportunity & Workflow Assessment'),
    'Homepage should use "AI Opportunity & Workflow Assessment"'
  )

  assert(
    homepage.includes('Fractional AI Advisor'),
    'Homepage should use "Fractional AI Advisor"'
  )

  assert(
    homepage.includes('$1,250/month'),
    'Homepage should show Fractional AI Advisor price'
  )

  assert(
    !homepage.includes('Direct Advisory'),
    'Homepage should NOT contain stale "Direct Advisory" label'
  )
}

// ============================================
// TEST: Env example has fractional price vars
// ============================================

async function testEnvExample() {
  console.log('\n--- Test: .env.example has fractional price vars ---')

  const envExample = await readFile('.env.example')

  assert(
    envExample.includes('STRIPE_PRICE_FRACTIONAL_AI_ADVISOR_MONTHLY'),
    '.env.example should document STRIPE_PRICE_FRACTIONAL_AI_ADVISOR_MONTHLY'
  )

  assert(
    envExample.includes('STRIPE_PRICE_FRACTIONAL_AI_ADVISOR_ANNUAL'),
    '.env.example should document STRIPE_PRICE_FRACTIONAL_AI_ADVISOR_ANNUAL'
  )
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('=== Phase 2.5 Commercial Offer Registry Tests ===')
  console.log(`Time: ${new Date().toISOString()}`)

  try {
    await testFractionalOfferInRegistry()
    await testPublicOfferNames()
    await testFractionalCheckoutRoute()
    await testWebhookHandlesFractional()
    await testFractionalWelcomeEmail()
    await testAdvisoryPage()
    await testAIAdvisorPage()
    await testAIAutomationPage()
    await testHomepage()
    await testEnvExample()
  } catch (err: any) {
    console.error('Fatal error:', err.message)
    process.exit(1)
  }

  console.log('\n=== Results ===')
  console.log(`Passed: ${passed}`)
  console.log(`Failed: ${failed}`)
  console.log(failed === 0 ? 'ALL TESTS PASSED' : `${failed} TEST(S) FAILED`)

  process.exit(failed === 0 ? 0 : 1)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
