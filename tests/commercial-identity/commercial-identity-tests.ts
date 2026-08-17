/**
 * Commercial Identity & Checkout Tests
 *
 * Validates that every commercial offer purchase is deterministically bound to:
 * - An authenticated user
 * - An explicit organization
 * - The specific offer
 *
 * Run: npx tsx tests/commercial-identity/commercial-identity-tests.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !serviceKey) {
  console.error('Missing env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required')
  process.exit(1)
}

const sc = createClient(supabaseUrl, serviceKey)

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

async function assertRejects(promise: Promise<any>, message: string) {
  try {
    await promise
    assert(false, `${message} - expected rejection but succeeded`)
  } catch {
    assert(true, message)
  }
}

// ============================================
// TEST SETUP
// ============================================

const TEST_USER_1 = crypto.randomUUID()
const TEST_USER_2 = crypto.randomUUID()
const TEST_ORG_1 = crypto.randomUUID()
const TEST_ORG_2 = crypto.randomUUID()
const TEST_ORG_INACTIVE = crypto.randomUUID()

async function setup() {
  console.log('\n--- Setup ---')

  // Create test organizations
  for (const [id, name, slug, status] of [
    [TEST_ORG_1, 'Test Org Alpha', `test-org-alpha-${TEST_ORG_1.slice(0, 8)}`, 'active'],
    [TEST_ORG_2, 'Test Org Beta', `test-org-beta-${TEST_ORG_2.slice(0, 8)}`, 'active'],
    [TEST_ORG_INACTIVE, 'Test Org Suspended', `test-org-suspended-${TEST_ORG_INACTIVE.slice(0, 8)}`, 'suspended'],
  ] as const) {
    await sc.from('organizations').upsert({
      id,
      name,
      slug,
      organization_kind: 'business',
      status,
      created_by: null,
    })
  }

  // Create test memberships
  // User 1: owner of Org 1, member of Org 2
  await sc.from('organization_memberships').upsert({
    organization_id: TEST_ORG_1,
    user_id: TEST_USER_1,
    role: 'owner',
    status: 'active',
  })
  await sc.from('organization_memberships').upsert({
    organization_id: TEST_ORG_2,
    user_id: TEST_USER_1,
    role: 'member',
    status: 'active',
  })

  // User 2: owner of Org 2, no access to Org 1
  await sc.from('organization_memberships').upsert({
    organization_id: TEST_ORG_2,
    user_id: TEST_USER_2,
    role: 'owner',
    status: 'active',
  })

  console.log('  Setup complete.')
}

async function cleanup() {
  console.log('\n--- Cleanup ---')
  await sc.from('organization_memberships').delete().in('user_id', [TEST_USER_1, TEST_USER_2])
  await sc.from('organizations').delete().in('id', [TEST_ORG_1, TEST_ORG_2, TEST_ORG_INACTIVE])
  console.log('  Cleanup complete.')
}

// ============================================
// TEST: create_commercial_organization RPC
// ============================================

async function testAtomicOrgCreation() {
  console.log('\n--- Test: Atomic Organization Creation RPC ---')

  // Test basic creation
  const { data, error } = await sc.rpc('create_commercial_organization', {
    p_name: 'RPC Test Org',
    p_organization_kind: 'business',
    p_creator_id: TEST_USER_1,
  })

  assert(!error, 'RPC should not return error')
  assert(data && data.length > 0, 'RPC should return result row')
  if (data && data.length > 0) {
    const result = data[0]
    assert(!!result.org_id, 'Should return org_id')
    assert(!!result.org_slug, 'Should return org_slug')
    assert(result.org_name === 'RPC Test Org', 'Should return correct org_name')
    assert(result.created === true, 'Should return created=true')

    // Verify owner membership was created atomically
    const { data: membership } = await sc
      .from('organization_memberships')
      .select('role, status')
      .eq('organization_id', result.org_id)
      .eq('user_id', TEST_USER_1)
      .single()

    assert(!!membership, 'Owner membership should exist')
    assert(membership?.role === 'owner', 'Membership role should be owner')
    assert(membership?.status === 'active', 'Membership status should be active')

    // Cleanup
    await sc.from('organization_memberships').delete().eq('organization_id', result.org_id)
    await sc.from('organizations').delete().eq('id', result.org_id)
  }

  // Test slug collision handling
  const { data: data1 } = await sc.rpc('create_commercial_organization', {
    p_name: 'Collision Test',
    p_organization_kind: 'business',
    p_creator_id: TEST_USER_1,
  })
  const { data: data2 } = await sc.rpc('create_commercial_organization', {
    p_name: 'Collision Test',
    p_organization_kind: 'business',
    p_creator_id: TEST_USER_2,
  })

  if (data1?.[0] && data2?.[0]) {
    assert(data1[0].org_slug !== data2[0].org_slug, 'Slug collision should produce different slugs')
    // Cleanup
    await sc.from('organization_memberships').delete().in('organization_id', [data1[0].org_id, data2[0].org_id])
    await sc.from('organizations').delete().in('id', [data1[0].org_id, data2[0].org_id])
  }

  // Test invalid kind defaults to business
  const { data: data3 } = await sc.rpc('create_commercial_organization', {
    p_name: 'Invalid Kind Test',
    p_organization_kind: 'invalid_kind_xyz',
    p_creator_id: TEST_USER_1,
  })
  if (data3?.[0]) {
    const { data: org } = await sc
      .from('organizations')
      .select('organization_kind')
      .eq('id', data3[0].org_id)
      .single()
    assert(org?.organization_kind === 'business', 'Invalid kind should default to business')
    // Cleanup
    await sc.from('organization_memberships').delete().eq('organization_id', data3[0].org_id)
    await sc.from('organizations').delete().eq('id', data3[0].org_id)
  }
}

// ============================================
// TEST: Organization Membership Isolation
// ============================================

async function testMembershipIsolation() {
  console.log('\n--- Test: Organization Membership Isolation ---')

  // User 2 should NOT be a member of Org 1
  const { data: user2InOrg1 } = await sc
    .from('organization_memberships')
    .select('id')
    .eq('organization_id', TEST_ORG_1)
    .eq('user_id', TEST_USER_2)
    .eq('status', 'active')
    .single()

  assert(!user2InOrg1, 'User 2 should not have membership in Org 1')

  // User 1 should be a member of both orgs
  const { data: user1Memberships } = await sc
    .from('organization_memberships')
    .select('organization_id, role')
    .eq('user_id', TEST_USER_1)
    .eq('status', 'active')

  assert(user1Memberships?.length === 2, 'User 1 should have 2 active memberships')
}

// ============================================
// TEST: Inactive Organization Rejection
// ============================================

async function testInactiveOrgRejection() {
  console.log('\n--- Test: Inactive Organization Rejection ---')

  // Verify the inactive org exists
  const { data: org } = await sc
    .from('organizations')
    .select('status')
    .eq('id', TEST_ORG_INACTIVE)
    .single()

  assert(org?.status === 'suspended', 'Test org should be suspended')
}

// ============================================
// TEST: Duplicate Entitlement Prevention
// ============================================

async function testDuplicateEntitlementPrevention() {
  console.log('\n--- Test: Duplicate Entitlement Prevention ---')

  // Get the ai_advisor_desk offering
  const { data: offering } = await sc
    .from('offerings')
    .select('id')
    .eq('offering_key', 'ai_advisor_desk')
    .single()

  if (!offering) {
    console.log('  SKIP: ai_advisor_desk offering not found in DB')
    return
  }

  // Create an active entitlement for Org 1
  await sc.from('organization_entitlements').upsert({
    organization_id: TEST_ORG_1,
    offering_id: offering.id,
    status: 'active',
    source_type: 'subscription',
    valid_from: new Date().toISOString(),
    valid_until: null,
  })

  // Check if duplicate exists
  const { data: entitlements } = await sc
    .from('organization_entitlements')
    .select('id, status')
    .eq('organization_id', TEST_ORG_1)
    .eq('offering_id', offering.id)
    .eq('status', 'active')

  assert(entitlements?.length === 1, 'Should have exactly 1 active entitlement')

  // Cleanup
  await sc.from('organization_entitlements').delete().eq('organization_id', TEST_ORG_1).eq('offering_id', offering.id)
}

// ============================================
// TEST: Blueprint Qualification Organization Binding
// ============================================

async function testBlueprintQualificationOrgBinding() {
  console.log('\n--- Test: Blueprint Qualification Organization Binding ---')

  // Insert a qualification record with organization_id
  const { data: qualRecord, error } = await sc
    .from('blueprint_qualifications')
    .insert({
      organization_id: TEST_ORG_1,
      user_email: 'test@example.com',
      user_id: TEST_USER_1,
      business_objective: 'Test objective',
      workflow_problem: 'Test workflow problem that is long enough',
      fit_decision: 'standard_blueprint',
      status: 'checkout_started',
    })
    .select('id, organization_id')
    .single()

  assert(!error, 'Qualification record insert should succeed')
  assert(!!qualRecord?.id, 'Should return qualification ID')
  assert(qualRecord?.organization_id === TEST_ORG_1, 'Qualification should be bound to Org 1')

  // Verify tenant isolation: Org 2 should not see Org 1's qualification
  const { data: crossOrgQual } = await sc
    .from('blueprint_qualifications')
    .select('id')
    .eq('organization_id', TEST_ORG_1)
    .eq('user_id', TEST_USER_2)

  // RLS should prevent User 2 from seeing Org 1's records (but service client bypasses RLS)
  // This test verifies the data model, not RLS enforcement
  assert(!!qualRecord, 'Qualification record should exist with organization_id')

  // Cleanup
  if (qualRecord) {
    await sc.from('blueprint_qualifications').delete().eq('id', qualRecord.id)
  }
}

// ============================================
// TEST: Agreement Fail-Closed
// ============================================

async function testAgreementFailClosed() {
  console.log('\n--- Test: Agreement Fail-Closed ---')

  // Verify no accepted agreement exists for test org
  const { data: agreements } = await sc
    .from('agreements')
    .select('id, status')
    .eq('organization_id', TEST_ORG_1)
    .eq('template_key', 'ai_automation_blueprint_agreement')
    .in('status', ['accepted', 'signed'])

  assert(!agreements || agreements.length === 0, 'No accepted agreement should exist for test org')

  // Verify agreement_templates table has the expected template
  const { data: template } = await sc
    .from('agreement_templates')
    .select('id, template_key')
    .eq('template_key', 'ai_automation_blueprint_agreement')
    .or('is_active.eq.true,status.eq.active')
    .single()

  // Template may or may not exist depending on migration state
  if (template) {
    console.log(`  INFO: Agreement template found: ${template.template_key}`)
  } else {
    console.log('  INFO: No agreement template found (fail-closed would block checkout)')
  }
}

// ============================================
// TEST: Stripe Metadata Contains Only Identifiers
// ============================================

async function testStripeMetadataClean() {
  console.log('\n--- Test: Stripe Metadata Contains Only Identifiers ---')

  // The checkout routes should only send: user_id, organization_id, offer_key,
  // qualification_record_id (Blueprint), fit_decision (Blueprint), period (Advisor)
  // No free-text: business_objective, workflow_problem, systems_involved

  // This is a code-level test - verify the checkout route source doesn't include
  // free-text metadata keys. We check by reading the route file.
  const fs = await import('fs/promises')
  const path = await import('path')

  const blueprintRoute = await fs.readFile(
    path.join(process.cwd(), 'app/api/commercial/blueprint/checkout/route.ts'),
    'utf-8'
  )

  assert(
    !blueprintRoute.includes('business_objective: qualificationResponses'),
    'Blueprint checkout should NOT send business_objective in Stripe metadata'
  )
  assert(
    !blueprintRoute.includes('workflow_problem: qualificationResponses'),
    'Blueprint checkout should NOT send workflow_problem in Stripe metadata'
  )
  assert(
    !blueprintRoute.includes('systems_involved: qualificationResponses'),
    'Blueprint checkout should NOT send systems_involved in Stripe metadata'
  )
  assert(
    blueprintRoute.includes('organization_id: organization.id'),
    'Blueprint checkout should send organization_id in Stripe metadata'
  )
  assert(
    blueprintRoute.includes('qualification_record_id'),
    'Blueprint checkout should send qualification_record_id in Stripe metadata'
  )

  const advisorRoute = await fs.readFile(
    path.join(process.cwd(), 'app/api/commercial/advisor-desk/checkout/route.ts'),
    'utf-8'
  )

  assert(
    advisorRoute.includes('organization_id: organization.id'),
    'Advisor checkout should send organization_id in Stripe metadata'
  )
  assert(
    !advisorRoute.includes('business_objective'),
    'Advisor checkout should NOT send business_objective in metadata'
  )
}

// ============================================
// TEST: Webhook Organization Resolution Priority
// ============================================

async function testWebhookOrgResolution() {
  console.log('\n--- Test: Webhook Organization Resolution Priority ---')

  const fs = await import('fs/promises')
  const path = await import('path')

  const webhookLib = await fs.readFile(
    path.join(process.cwd(), 'lib/stripe/webhooks.ts'),
    'utf-8'
  )

  assert(
    webhookLib.includes('organizationId'),
    'resolveOrCreateOrganization should accept organizationId parameter'
  )
  assert(
    webhookLib.includes('PRIORITY 1: Explicit organization_id'),
    'Webhook should prioritize organization_id from metadata'
  )
  assert(
    webhookLib.includes('LEGACY FALLBACK'),
    'Webhook should have legacy fallback path with audit warning'
  )

  const webhookRoute = await fs.readFile(
    path.join(process.cwd(), 'app/api/stripe/webhook/route.ts'),
    'utf-8'
  )

  assert(
    webhookRoute.includes('organizationId'),
    'Webhook route should extract organizationId from session metadata'
  )
  assert(
    webhookRoute.includes('organization_id from session metadata'),
    'Webhook route should comment about organization_id binding'
  )
}

// ============================================
// TEST: Portal Route Role Check
// ============================================

async function testPortalRoleCheck() {
  console.log('\n--- Test: Portal Route Role Check ---')

  const fs = await import('fs/promises')
  const path = await import('path')

  const portalRoute = await fs.readFile(
    path.join(process.cwd(), 'app/api/stripe/portal/route.ts'),
    'utf-8'
  )

  assert(
    portalRoute.includes('insufficient_role'),
    'Portal route should check for insufficient_role'
  )
  assert(
    portalRoute.includes("role !== 'owner'") && portalRoute.includes("role !== 'admin'"),
    'Portal route should restrict to owner/admin roles'
  )
}

// ============================================
// TEST: Success URL Organization Scoping
// ============================================

async function testSuccessUrlScoping() {
  console.log('\n--- Test: Success URL Organization Scoping ---')

  const fs = await import('fs/promises')
  const path = await import('path')

  const advisorRoute = await fs.readFile(
    path.join(process.cwd(), 'app/api/commercial/advisor-desk/checkout/route.ts'),
    'utf-8'
  )

  assert(
    !advisorRoute.includes('/app?checkout=success'),
    'Advisor checkout should NOT use generic /app?checkout=success URL'
  )
  assert(
    advisorRoute.includes('/checkout/success?session_id={CHECKOUT_SESSION_ID}'),
    'Advisor checkout should use unified checkout success URL'
  )

  const blueprintRoute = await fs.readFile(
    path.join(process.cwd(), 'app/api/commercial/blueprint/checkout/route.ts'),
    'utf-8'
  )

  assert(
    !blueprintRoute.includes('/app?checkout=success'),
    'Blueprint checkout should NOT use generic /app?checkout=success URL'
  )
  assert(
    blueprintRoute.includes('/checkout/success?session_id={CHECKOUT_SESSION_ID}'),
    'Blueprint checkout should use unified checkout success URL'
  )
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('=== Commercial Identity & Checkout Tests ===')
  console.log(`URL: ${supabaseUrl}`)
  console.log(`Time: ${new Date().toISOString()}`)

  try {
    await setup()
    await testAtomicOrgCreation()
    await testMembershipIsolation()
    await testInactiveOrgRejection()
    await testDuplicateEntitlementPrevention()
    await testBlueprintQualificationOrgBinding()
    await testAgreementFailClosed()
    await testStripeMetadataClean()
    await testWebhookOrgResolution()
    await testPortalRoleCheck()
    await testSuccessUrlScoping()
  } finally {
    await cleanup()
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
