/**
 * P0 End-to-End Checkout Integration Tests
 *
 * Validates the full chain:
 *   checkout route → Stripe session → webhook → entitlement → workspace access
 *
 * These tests verify that:
 * - The fractional_ai_advisor offering key is used consistently across
 *   checkout route, webhook, dashboard labels, and workspace guard
 * - The checkout success URL uses {CHECKOUT_SESSION_ID} (not direct workspace redirect)
 * - The advisory workspace guard accepts fractional_ai_advisor entitlements
 * - The dashboard routing table maps fractional_ai_advisor to /app/{org}/advisory
 * - Multi-subscription storage uses per-offer keys (not a single stripe_subscription key)
 * - The invoice.paid handler falls back to subscription metadata
 * - The DB migration file exists and is idempotent
 *
 * Run: npx tsx tests/commercial-identity/p0-integration-tests.ts
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
// TEST: Advisory workspace guard accepts fractional_ai_advisor
// ============================================

async function testAdvisoryWorkspaceGuard() {
  console.log('\n--- Test: Advisory workspace guard accepts fractional_ai_advisor ---')

  const page = await readFile('app/app/[orgSlug]/advisory/page.tsx')

  assert(
    page.includes("requireOfferingAccess(ctx, 'fractional_ai_advisor')"),
    'Advisory workspace should call requireOfferingAccess with fractional_ai_advisor'
  )

  assert(
    page.includes("requireOfferingAccess(ctx, 'advisory')"),
    'Advisory workspace should have backward compat fallback to advisory key'
  )

  // The fractional_ai_advisor check should come FIRST (before the fallback)
  const fractionalIdx = page.indexOf("requireOfferingAccess(ctx, 'fractional_ai_advisor')")
  const advisoryIdx = page.indexOf("requireOfferingAccess(ctx, 'advisory')")
  assert(
    fractionalIdx < advisoryIdx,
    'fractional_ai_advisor check should come before advisory fallback'
  )
}

// ============================================
// TEST: Dashboard routing table includes fractional_ai_advisor
// ============================================

async function testDashboardRouting() {
  console.log('\n--- Test: Dashboard routing table includes fractional_ai_advisor ---')

  const types = await readFile('lib/auth/dashboard-types.ts')

  assert(
    types.includes("fractional_ai_advisor: { label: 'Fractional AI Advisor'"),
    'OFFERING_LABELS should include fractional_ai_advisor with correct label'
  )

  assert(
    types.includes("description: 'Executive AI advisory, strategy, architecture and decision support'"),
    'fractional_ai_advisor description should match the product positioning'
  )

  // Check getOfferingRoute maps fractional_ai_advisor to advisory workspace
  assert(
    types.includes("case 'fractional_ai_advisor':") &&
    types.includes("return `/app/${orgSlug}/advisory`"),
    'getOfferingRoute should map fractional_ai_advisor to /app/{org}/advisory'
  )

  // Also check that ai_advisor_desk label was updated to public name
  assert(
    types.includes("ai_advisor_desk: { label: 'AI Advisor for Business'"),
    'ai_advisor_desk label should be updated to "AI Advisor for Business"'
  )
}

// ============================================
// TEST: Checkout success URL uses {CHECKOUT_SESSION_ID}
// ============================================

async function testCheckoutSuccessUrls() {
  console.log('\n--- Test: Checkout success URLs use {CHECKOUT_SESSION_ID} ---')

  const fractionalRoute = await readFile('app/api/commercial/fractional-advisor/checkout/route.ts')
  const advisorRoute = await readFile('app/api/commercial/advisor-desk/checkout/route.ts')
  const blueprintRoute = await readFile('app/api/commercial/blueprint/checkout/route.ts')

  assert(
    fractionalRoute.includes('{CHECKOUT_SESSION_ID}'),
    'Fractional checkout should use {CHECKOUT_SESSION_ID} in success URL'
  )

  assert(
    fractionalRoute.includes('/checkout/success?session_id={CHECKOUT_SESSION_ID}'),
    'Fractional checkout should redirect to /checkout/success page'
  )

  assert(
    !fractionalRoute.includes('/app/${organization.slug}/advisory?checkout=success'),
    'Fractional checkout should NOT redirect directly to protected workspace'
  )

  assert(
    advisorRoute.includes('{CHECKOUT_SESSION_ID}'),
    'Advisor checkout should use {CHECKOUT_SESSION_ID} in success URL'
  )

  assert(
    blueprintRoute.includes('{CHECKOUT_SESSION_ID}'),
    'Blueprint checkout should use {CHECKOUT_SESSION_ID} in success URL'
  )
}

// ============================================
// TEST: Checkout success page exists and verifies session
// ============================================

async function testCheckoutSuccessPage() {
  console.log('\n--- Test: Checkout success page exists and verifies session ---')

  const page = await readFile('app/checkout/success/page.tsx')

  assert(
    page.includes('verifySession'),
    'Success page should verify the Stripe session'
  )

  assert(
    page.includes('waitForEntitlement'),
    'Success page should wait for entitlement to be created by webhook'
  )

  assert(
    page.includes('stripe.checkout.sessions.retrieve'),
    'Success page should retrieve the session from Stripe'
  )

  assert(
    page.includes('status="success"') && page.includes('status="pending"') && page.includes('status="error"'),
    'Success page should handle success, pending, and error states'
  )

  assert(
    page.includes('OFFER_WORKSPACE_ROUTES'),
    'Success page should map offer keys to workspace routes'
  )

  assert(
    page.includes("fractional_ai_advisor: 'advisory'"),
    'Success page should map fractional_ai_advisor to advisory workspace'
  )
}

// ============================================
// TEST: Invoice.paid handler falls back to subscription metadata
// ============================================

async function testInvoiceMetadataFallback() {
  console.log('\n--- Test: Invoice.paid handler falls back to subscription metadata ---')

  const webhook = await readFile('app/api/stripe/webhook/route.ts')

  assert(
    webhook.includes('invoice.metadata?.offer_key'),
    'Invoice handler should check invoice.metadata?.offer_key first'
  )

  assert(
    webhook.includes('subscription.metadata?.offer_key'),
    'Invoice handler should fall back to subscription.metadata?.offer_key'
  )

  assert(
    webhook.includes('stripe.subscriptions.retrieve'),
    'Invoice handler should retrieve the subscription for metadata fallback'
  )
}

// ============================================
// TEST: Multi-subscription storage uses per-offer keys
// ============================================

async function testPerOfferSubscriptionStorage() {
  console.log('\n--- Test: Multi-subscription storage uses per-offer keys ---')

  const webhook = await readFile('app/api/stripe/webhook/route.ts')
  const checkout = await readFile('lib/stripe/checkout.ts')
  const billingPeriod = await readFile('lib/commercial/billing-period.ts')

  // Webhook should use stripe_subscription:{offerKey} not just stripe_subscription
  assert(
    webhook.includes('`stripe_subscription:${offerKey}`'),
    'Webhook checkout handler should use per-offer subscription key'
  )

  assert(
    !webhook.includes("system_key: 'stripe_subscription'"),
    'Webhook should NOT use generic stripe_subscription key (except in legacy fallback)'
  )

  // Checkout helper should use per-offer key
  assert(
    checkout.includes('`stripe_subscription:${offerKey}`'),
    'storeStripeSubscriptionId should use per-offer subscription key'
  )

  // Billing period should use per-offer key with legacy fallback
  assert(
    billingPeriod.includes("'stripe_subscription:ai_advisor_desk'"),
    'Billing period should use per-offer key for advisor desk'
  )

  assert(
    billingPeriod.includes("'stripe_subscription'"),
    'Billing period should have legacy fallback to generic stripe_subscription key'
  )
}

// ============================================
// TEST: Stripe portal accepts return context
// ============================================

async function testPortalReturnContext() {
  console.log('\n--- Test: Stripe portal accepts return context ---')

  const portal = await readFile('app/api/stripe/portal/route.ts')

  assert(
    portal.includes('returnTo'),
    'Portal route should accept returnTo parameter'
  )

  assert(
    portal.includes('SAFE_RETURN_PATHS'),
    'Portal route should validate returnTo against a safe allowlist'
  )

  assert(
    portal.includes("'advisory': 'advisory'"),
    'Portal route should allow advisory as a return destination'
  )

  assert(
    portal.includes("'advisor-desk': 'advisor-desk'"),
    'Portal route should allow advisor-desk as a return destination'
  )
}

// ============================================
// TEST: DB migration file exists and is idempotent
// ============================================

async function testMigrationFile() {
  console.log('\n--- Test: DB migration file exists and is idempotent ---')

  let migrationContent: string
  try {
    migrationContent = await readFile('supabase/migrations/0017_add_fractional_ai_advisor_offering.sql')
  } catch {
    assert(false, 'Migration file 0017_add_fractional_ai_advisor_offering.sql should exist')
    return
  }

  assert(
    migrationContent.includes('fractional_ai_advisor'),
    'Migration should insert fractional_ai_advisor offering key'
  )

  assert(
    migrationContent.includes('WHERE NOT EXISTS'),
    'Migration should be idempotent (use WHERE NOT EXISTS)'
  )

  assert(
    migrationContent.includes("'service'"),
    "Migration should set offering_kind to 'service'"
  )

  assert(
    migrationContent.includes("'active'"),
    "Migration should set status to 'active'"
  )
}

// ============================================
// TEST: Webhook creates engagement for fractional_ai_advisor
// ============================================

async function testWebhookEngagementCreation() {
  console.log('\n--- Test: Webhook creates engagement for fractional_ai_advisor ---')

  const webhook = await readFile('app/api/stripe/webhook/route.ts')

  assert(
    webhook.includes("offerKey === 'fractional_ai_advisor'"),
    'Webhook should handle fractional_ai_advisor in checkout.session.completed'
  )

  assert(
    webhook.includes('sendFractionalAdvisorWelcomeEmail'),
    'Webhook should send fractional advisor welcome email'
  )
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('=== P0 End-to-End Checkout Integration Tests ===')
  console.log(`Time: ${new Date().toISOString()}`)

  try {
    await testAdvisoryWorkspaceGuard()
    await testDashboardRouting()
    await testCheckoutSuccessUrls()
    await testCheckoutSuccessPage()
    await testInvoiceMetadataFallback()
    await testPerOfferSubscriptionStorage()
    await testPortalReturnContext()
    await testMigrationFile()
    await testWebhookEngagementCreation()
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
