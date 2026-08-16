/**
 * Phase 2.7 — Commercial Launch Readiness Tests
 * Tests the new infrastructure: customer state, failures, analytics, member tools, scheduling.
 */

import assert from 'node:assert'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

// Load .env.local manually
const envPath = join(process.cwd(), '.env.local')
const envContent = readFileSync(envPath, 'utf8')
for (const line of envContent.split('\n')) {
  const match = line.match(/^([A-Z_]+)=(.+)$/)
  if (match && !process.env[match[1]]) {
    process.env[match[1]] = match[2].replace(/^["']|["']$/g, '')
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const sc = createClient(supabaseUrl, serviceRoleKey)

let passed = 0
let failed = 0

function test(name: string, fn: () => void) {
  try {
    fn()
    passed++
    console.log(`✓ ${name}`)
  } catch (err: any) {
    failed++
    console.error(`✗ ${name}: ${err.message}`)
  }
}

async function asyncTest(name: string, fn: () => Promise<void>) {
  try {
    await fn()
    passed++
    console.log(`✓ ${name}`)
  } catch (err: any) {
    failed++
    console.error(`✗ ${name}: ${err.message}`)
  }
}

console.log('\n=== Phase 2.7 — Commercial Launch Readiness Tests ===\n')

async function main() {

// ============================================
// 1. Test organizations exist
// ============================================

await asyncTest('Test org 1 ($99 monthly) exists', async () => {
  const { data, error } = await sc.from('organizations').select('name, slug').eq('slug', 'test-99-monthly').single()
  assert(!error, `Query error: ${error?.message}`)
  assert(data, 'Organization not found')
  assert(data.name.includes('[TEST]'), 'Should be marked as TEST')
})

await asyncTest('Test org 2 ($99 annual) exists', async () => {
  const { data, error } = await sc.from('organizations').select('name, slug').eq('slug', 'test-99-annual').single()
  assert(!error, `Query error: ${error?.message}`)
  assert(data, 'Organization not found')
  assert(data.name.includes('[TEST]'), 'Should be marked as TEST')
})

await asyncTest('Test org 3 (Fractional monthly) exists', async () => {
  const { data, error } = await sc.from('organizations').select('name, slug').eq('slug', 'test-fractional-monthly').single()
  assert(!error, `Query error: ${error?.message}`)
  assert(data, 'Organization not found')
  assert(data.name.includes('[TEST]'), 'Should be marked as TEST')
})

await asyncTest('Test org 4 (Fractional annual) exists', async () => {
  const { data, error } = await sc.from('organizations').select('name, slug').eq('slug', 'test-fractional-annual').single()
  assert(!error, `Query error: ${error?.message}`)
  assert(data, 'Organization not found')
  assert(data.name.includes('[TEST]'), 'Should be marked as TEST')
})

// ============================================
// 2. Customer lifecycle states
// ============================================

await asyncTest('Customer lifecycle state exists for test org 1', async () => {
  const { data, error } = await sc.from('customer_lifecycle_states')
    .select('state, offer_key, entitlement_active')
    .eq('organization_id', 'a0000000-0000-0000-0000-000000000001')
    .single()
  assert(!error, `Query error: ${error?.message}`)
  assert(data, 'Lifecycle state not found')
  assert(data.state === 'ACTIVE', `Expected ACTIVE, got ${data.state}`)
  assert(data.offer_key === 'ai_advisor_desk', `Expected ai_advisor_desk, got ${data.offer_key}`)
  assert(data.entitlement_active === true, 'Entitlement should be active')
})

await asyncTest('Customer lifecycle state for test org 3 is ACTIVE_SETUP_REQUIRED', async () => {
  const { data, error } = await sc.from('customer_lifecycle_states')
    .select('state, onboarding_complete')
    .eq('organization_id', 'a0000000-0000-0000-0000-000000000003')
    .single()
  assert(!error, `Query error: ${error?.message}`)
  assert(data, 'Lifecycle state not found')
  assert(data.state === 'ACTIVE_SETUP_REQUIRED', `Expected ACTIVE_SETUP_REQUIRED, got ${data.state}`)
  assert(data.onboarding_complete === false, 'Onboarding should not be complete')
})

// ============================================
// 3. Member tools registry
// ============================================

await asyncTest('Member tools registry has seeded tools', async () => {
  const { data, error } = await sc.from('member_tools').select('tool_key, access_level, allowed_plans')
  assert(!error, `Query error: ${error?.message}`)
  assert(data && data.length >= 10, `Expected at least 10 tools, got ${data?.length}`)
})

await asyncTest('Member tools include ADVISOR_SELECTED tools for $99 plan', async () => {
  const { data, error } = await sc.from('member_tools')
    .select('tool_key, allowed_plans')
    .eq('access_level', 'ADVISOR_SELECTED')
    .eq('production_ready', true)
  assert(!error, `Query error: ${error?.message}`)
  assert(data && data.length > 0, 'No ADVISOR_SELECTED tools found')
  for (const tool of data!) {
    assert(tool.allowed_plans.includes('ai_advisor_desk'), `Tool ${tool.tool_key} should allow ai_advisor_desk`)
  }
})

await asyncTest('Member tools include FRACTIONAL_LIBRARY tools', async () => {
  const { data, error } = await sc.from('member_tools')
    .select('tool_key, allowed_plans')
    .eq('access_level', 'FRACTIONAL_LIBRARY')
    .eq('production_ready', true)
  assert(!error, `Query error: ${error?.message}`)
  assert(data && data.length > 0, 'No FRACTIONAL_LIBRARY tools found')
  for (const tool of data!) {
    assert(tool.allowed_plans.includes('fractional_ai_advisor'), `Tool ${tool.tool_key} should allow fractional_ai_advisor`)
    assert(!tool.allowed_plans.includes('ai_advisor_desk'), `Tool ${tool.tool_key} should NOT allow ai_advisor_desk`)
  }
})

await asyncTest('Member tools do not expose ADMIN_ONLY or EXPERIMENTAL to clients', async () => {
  const { data, error } = await sc.from('member_tools')
    .select('tool_key, access_level')
    .in('access_level', ['ADMIN_ONLY', 'EXPERIMENTAL'])
    .eq('visible_to_client', true)
    .eq('production_ready', true)
  assert(!error, `Query error: ${error?.message}`)
  // If any exist, they should not be visible_to_client AND production_ready
  assert(!data || data.length === 0, 'ADMIN_ONLY or EXPERIMENTAL tools should not be visible to clients')
})

// ============================================
// 4. Commercial failures table
// ============================================

await asyncTest('Commercial failures table is accessible', async () => {
  const { data, error } = await sc.from('commercial_failures').select('id').limit(1)
  assert(!error, `Query error: ${error?.message}`)
  // Just verify the table exists and is queryable
})

await asyncTest('Commercial failures can be inserted and resolved', async () => {
  const { data: inserted, error: insertError } = await (sc.from('commercial_failures') as any)
    .insert({
      failure_type: 'email',
      severity: 'warning',
      message: '[TEST] Test failure for Phase 2.7 validation',
      retryable: true,
    })
    .select()
    .single()

  assert(!insertError, `Insert error: ${insertError?.message}`)
  assert(inserted, 'Failure was not inserted')

  // Resolve it
  const { error: resolveError } = await (sc.from('commercial_failures') as any)
    .update({ resolved_at: new Date().toISOString() })
    .eq('id', inserted.id)

  assert(!resolveError, `Resolve error: ${resolveError?.message}`)

  // Clean up
  await (sc.from('commercial_failures') as any).delete().eq('id', inserted.id)
})

// ============================================
// 5. Conversion events table
// ============================================

await asyncTest('Conversion events table is accessible', async () => {
  const { data, error } = await sc.from('conversion_events').select('id').limit(1)
  assert(!error, `Query error: ${error?.message}`)
})

await asyncTest('Conversion events can be tracked', async () => {
  const { data, error } = await (sc.from('conversion_events') as any)
    .insert({
      event_name: 'public_offer_viewed',
      page_path: '/ai-advisor',
      metadata: { test: true },
    })
    .select()
    .single()

  assert(!error, `Insert error: ${error?.message}`)
  assert(data, 'Event was not inserted')

  // Clean up
  await (sc.from('conversion_events') as any).delete().eq('id', data.id)
})

// ============================================
// 6. Scheduling links table
// ============================================

await asyncTest('Scheduling links table is accessible', async () => {
  const { data, error } = await sc.from('scheduling_links').select('id').limit(1)
  assert(!error, `Query error: ${error?.message}`)
})

await asyncTest('Scheduling links can be created for test org', async () => {
  const { data, error } = await (sc.from('scheduling_links') as any)
    .insert({
      organization_id: 'a0000000-0000-0000-0000-000000000003',
      link_type: 'activation_call',
      scheduling_url: 'https://calendly.com/test/activation',
      status: 'pending',
      duration_minutes: 20,
    })
    .select()
    .single()

  assert(!error, `Insert error: ${error?.message}`)
  assert(data, 'Scheduling link was not inserted')
  assert(data.link_type === 'activation_call', 'Link type should be activation_call')

  // Clean up
  await (sc.from('scheduling_links') as any).delete().eq('id', data.id)
})

// ============================================
// 7. Included product entitlements for test orgs
// ============================================

await asyncTest('Test org 1 has HAIEC and Kestrel entitlements', async () => {
  const { data, error } = await sc.from('included_product_entitlements')
    .select('product_key, provisioning_status')
    .eq('organization_id', 'a0000000-0000-0000-0000-000000000001')
  assert(!error, `Query error: ${error?.message}`)
  assert(data && data.length === 2, `Expected 2 product entitlements, got ${data?.length}`)
  const products = data!.map(p => p.product_key)
  assert(products.includes('haiec'), 'Should include HAIEC')
  assert(products.includes('kestrel'), 'Should include Kestrel')
})

await asyncTest('Test org 3 has HAIEC scan and Kestrel entitlements', async () => {
  const { data, error } = await sc.from('included_product_entitlements')
    .select('product_key, tier_or_plan, provisioning_status')
    .eq('organization_id', 'a0000000-0000-0000-0000-000000000003')
  assert(!error, `Query error: ${error?.message}`)
  assert(data && data.length === 2, `Expected 2 product entitlements, got ${data?.length}`)
  const haiec = data!.find(p => p.product_key === 'haiec')
  assert(haiec, 'Should include HAIEC')
  assert(haiec!.tier_or_plan === 'scan', 'HAIEC should be scan tier for Fractional')
})

// ============================================
// 8. Fractional session usage for test orgs
// ============================================

await asyncTest('Test org 3 has session usage record', async () => {
  const { data, error } = await sc.from('fractional_session_usage')
    .select('billing_period_month, included_sessions, used_sessions')
    .eq('organization_id', 'a0000000-0000-0000-0000-000000000003')
  assert(!error, `Query error: ${error?.message}`)
  assert(data && data.length > 0, 'No session usage record found')
  assert(data![0].included_sessions === 2, `Expected 2 included sessions, got ${data![0].included_sessions}`)
  assert(data![0].used_sessions === 0, `Expected 0 used sessions, got ${data![0].used_sessions}`)
})

// ============================================
// 9. Entitlements for test orgs
// ============================================

await asyncTest('Test org 1 has active ai_advisor_desk entitlement', async () => {
  const { data, error } = await sc.from('organization_entitlements')
    .select('status, source_type, valid_until')
    .eq('organization_id', 'a0000000-0000-0000-0000-000000000001')
    .single()
  assert(!error, `Query error: ${error?.message}`)
  assert(data, 'Entitlement not found')
  assert(data.status === 'active', `Expected active, got ${data.status}`)
  assert(data.source_type === 'subscription', `Expected subscription, got ${data.source_type}`)
})

await asyncTest('Test org 3 has active fractional_ai_advisor entitlement', async () => {
  const { data, error } = await sc.from('organization_entitlements')
    .select('status, source_type, valid_until')
    .eq('organization_id', 'a0000000-0000-0000-0000-000000000003')
    .single()
  assert(!error, `Query error: ${error?.message}`)
  assert(data, 'Entitlement not found')
  assert(data.status === 'active', `Expected active, got ${data.status}`)
})

// ============================================
// 10. Engagements for Fractional test orgs
// ============================================

await asyncTest('Test org 3 has fractional engagement', async () => {
  const { data, error } = await sc.from('engagements')
    .select('engagement_type, status')
    .eq('organization_id', 'a0000000-0000-0000-0000-000000000003')
    .single()
  assert(!error, `Query error: ${error?.message}`)
  assert(data, 'Engagement not found')
  assert(data.engagement_type === 'fractional', `Expected fractional, got ${data.engagement_type}`)
  assert(data.status === 'active', `Expected active, got ${data.status}`)
})

// ============================================
// Results
// ============================================

console.log('\n=== Results ===')
console.log(`Passed: ${passed}`)
console.log(`Failed: ${failed}`)
if (failed === 0) {
  console.log('ALL TESTS PASSED')
} else {
  console.log('SOME TESTS FAILED')
  process.exit(1)
}

}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
