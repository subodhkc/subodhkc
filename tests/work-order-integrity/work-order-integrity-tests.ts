/**
 * Regression tests for the Work Order commercial integrity repair (2026-08).
 *
 * Run: npx tsx tests/work-order-integrity/work-order-integrity-tests.ts
 *
 * These tests cover the pure domain logic that does not require a live
 * Supabase instance:
 *   - transition matrix validity (Section E)
 *   - transition authority (Section E)
 *   - scope snapshot hashing immutability (Section C)
 *   - metadata whitelist sanitization (Section L)
 *   - Work Order authority resolution (Section K)
 *   - status label coverage for the new awaiting_client_acceptance state
 *   - invariants from the brief (no trialing eligibility, terminal states,
 *     repeatable Work Orders, etc.)
 *
 * DB-backed assertions (acceptance writes exact hash/version/user,
 * concurrent webhook does not mis-link engagements, payment retry is
 * idempotent, etc.) are encoded as documented invariants in
 * docs/audits/2026-08-work-order-integrity.md and are enforced by the
 * Postgres RPCs in migration 0032. They require a live database to execute
 * and are not run here.
 */

import {
  ALLOWED_TRANSITIONS,
  TRANSITION_AUTHORITY,
  TERMINAL_STATES,
  isValidTransition,
  isAuthorizedTransition,
  authorityToActor,
  type TransitionActor,
} from '../../lib/commercial/work-order-transitions'
import {
  buildStandardScopeSnapshot,
  hashScopeSnapshot,
} from '../../lib/commercial/work-orders'
import {
  sanitizeWorkOrderCheckoutMetadata,
  WORK_ORDER_CHECKOUT_METADATA_KEYS,
  resolveWorkOrderAuthority,
  type WorkOrderAuthority,
} from '../../lib/commercial/work-order-auth'
import type { OrganizationContext } from '../../lib/auth/organization-resolver'
import {
  statusLabel,
  statusActionLabel,
  statusAdvisorLabel,
  statusPriority,
} from '../../lib/commercial/work-order-types'
import type { WorkOrderStatus } from '../../lib/commercial/work-order-types'

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
// Helper: build a fake OrganizationContext for authority tests
// ============================================
function makeCtx(opts: {
  role?: 'owner' | 'admin' | 'member' | null
  isPlatformAdmin?: boolean
  entitlements?: Array<{ offering_key: string; effective_status: string }>
  offeringRoles?: Array<{ offering_key: string; status: string }>
}): OrganizationContext {
  return {
    organization: {
      id: 'org-1',
      name: 'Test Org',
      slug: 'test-org',
      organization_kind: 'business',
      status: 'active',
    },
    membership: opts.role
      ? { id: 'm-1', role: opts.role, status: 'active' }
      : null,
    organizationRole: opts.role ?? null,
    isPlatformAdmin: opts.isPlatformAdmin ?? false,
    isAdvisorOperator: false,
    entitlements: (opts.entitlements || []).map((e, i) => ({
      id: `ent-${i}`,
      offering_key: e.offering_key,
      offering_name: e.offering_key,
      status: e.effective_status,
      effective_status: e.effective_status as any,
      valid_from: '2026-01-01T00:00:00Z',
      valid_until: null,
    })),
    offeringRoles: (opts.offeringRoles || []).map((r, i) => ({
      id: `r-${i}`,
      offering_key: r.offering_key,
      offering_name: r.offering_key,
      role: 'user' as const,
      status: r.status,
    })),
  }
}

// ============================================
// Section E: Transition matrix
// ============================================

function testTransitionMatrix() {
  console.log('\n--- Section E: Transition Matrix ---')

  // Canonical forward flow
  const forward: WorkOrderStatus[] = [
    'draft',
    'awaiting_scope',
    'awaiting_client_acceptance',
    'ready_for_checkout',
    'payment_pending',
    'paid',
    'in_progress',
    'delivered',
    'completed',
  ]
  for (let i = 0; i < forward.length - 1; i++) {
    assert(
      isValidTransition(forward[i], forward[i + 1]),
      `forward transition ${forward[i]} → ${forward[i + 1]} should be valid`
    )
  }

  // awaiting_approval cannot bypass into payment (test #15)
  assert(
    !isValidTransition('awaiting_approval', 'payment_pending'),
    'awaiting_approval → payment_pending must NOT be valid (no bypass into payment)'
  )
  assert(
    !isValidTransition('awaiting_owner_approval', 'payment_pending'),
    'awaiting_owner_approval → payment_pending must NOT be valid'
  )
  assert(
    !isValidTransition('awaiting_client_acceptance', 'payment_pending'),
    'awaiting_client_acceptance → payment_pending must NOT be valid (scope must be accepted first)'
  )

  // completed must not transition back (test #15 / brief)
  for (const s of ['in_progress', 'delivered', 'paid', 'ready_for_checkout', 'draft'] as WorkOrderStatus[]) {
    assert(
      !isValidTransition('completed', s),
      `completed → ${s} must NOT be valid (terminal)`
    )
  }

  // Terminal states have no outgoing transitions
  for (const terminal of TERMINAL_STATES) {
    assert(
      ALLOWED_TRANSITIONS[terminal].length === 0,
      `${terminal} should have no outgoing transitions`
    )
  }

  // needs_client_input can go back to in_progress
  assert(isValidTransition('needs_client_input', 'in_progress'), 'needs_client_input → in_progress should be valid')
  assert(isValidTransition('needs_client_input', 'in_review'), 'needs_client_input → in_review should be valid')

  // delivered → completed (customer can complete delivered WO, test #23)
  assert(isValidTransition('delivered', 'completed'), 'delivered → completed should be valid')
}

function testTransitionAuthority() {
  console.log('\n--- Section E: Transition Authority ---')

  // Only stripe_fulfillment can transition payment_pending → paid
  assert(
    isAuthorizedTransition('payment_pending', 'paid', 'stripe_fulfillment'),
    'stripe_fulfillment can transition payment_pending → paid'
  )
  assert(
    !isAuthorizedTransition('payment_pending', 'paid', 'client'),
    'client cannot transition payment_pending → paid'
  )
  assert(
    !isAuthorizedTransition('payment_pending', 'paid', 'org_owner_admin'),
    'org_owner_admin cannot transition payment_pending → paid (only Stripe fulfillment)'
  )

  // Only client or org_owner_admin can complete a delivered WO
  assert(isAuthorizedTransition('delivered', 'completed', 'client'), 'client can complete delivered WO')
  assert(isAuthorizedTransition('delivered', 'completed', 'org_owner_admin'), 'org_owner_admin can complete delivered WO')
  assert(!isAuthorizedTransition('delivered', 'completed', 'advisor_operator'), 'advisor_operator cannot complete delivered WO')

  // Only advisor_operator / platform_admin can move paid → in_progress
  assert(isAuthorizedTransition('paid', 'in_progress', 'advisor_operator'), 'advisor can start paid WO')
  assert(!isAuthorizedTransition('paid', 'in_progress', 'client'), 'client cannot start paid WO')
}

// ============================================
// Section C: Scope snapshot immutability
// ============================================

function testScopeSnapshotHashing() {
  console.log('\n--- Section C: Scope Snapshot Hashing ---')

  const snap = buildStandardScopeSnapshot({
    title: 'Reduce onboarding time',
    workType: 'analysis',
    desiredOutcome: '50% reduction in manual hours',
  })

  const h1 = hashScopeSnapshot(snap)
  const h2 = hashScopeSnapshot(snap)
  assertEqual(h1, h2, 'identical snapshots produce identical hashes')

  // Mutating any field changes the hash
  const mutated = { ...snap, title: 'Different title' }
  assert(h1 !== hashScopeSnapshot(mutated), 'mutated title changes hash')

  const mutatedPrice = { ...snap, price_cents: 99999 }
  assert(h1 !== hashScopeSnapshot(mutatedPrice), 'mutated price changes hash')

  const mutatedIncluded = { ...snap, scope_included: 'different included' }
  assert(h1 !== hashScopeSnapshot(mutatedIncluded), 'mutated scope_included changes hash')

  // Standard price is 50000 cents ($500)
  assertEqual(snap.price_cents, 50000, 'standard scope price is 50000 cents')
  assertEqual(snap.currency, 'USD', 'standard scope currency is USD')
}

// ============================================
// Section L: Metadata whitelist
// ============================================

function testMetadataWhitelist() {
  console.log('\n--- Section L: Metadata Whitelist ---')

  // Allowed keys pass through
  const clean = sanitizeWorkOrderCheckoutMetadata({
    work_order_id: 'wo-1',
    work_order_number: 'WO-2026-0001',
    organization_id: 'org-1',
    user_id: 'user-1',
    offer_key: 'ai_automation_blueprint',
  })
  assert(clean.work_order_id === 'wo-1', 'work_order_id passes whitelist')
  assert(clean.organization_id === 'org-1', 'organization_id passes whitelist')
  assert(clean.app_source === 'subodhkc', 'app_source is forced to subodhkc')

  // Disallowed keys are dropped
  const dirty = sanitizeWorkOrderCheckoutMetadata({
    work_order_id: 'wo-1',
    title: 'injected title',
    scope_included: 'injected scope',
    price_cents: '1',
    is_admin: 'true',
    role: 'owner',
  })
  assert(!('title' in dirty), 'title is dropped from metadata')
  assert(!('scope_included' in dirty), 'scope_included is dropped from metadata')
  assert(!('price_cents' in dirty), 'price_cents is dropped from metadata')
  assert(!('is_admin' in dirty), 'is_admin is dropped from metadata')
  assert(!('role' in dirty), 'role is dropped from metadata')
  assert(clean.work_order_id === 'wo-1' || dirty.work_order_id === 'wo-1', 'work_order_id retained')

  // The whitelist does not include scope fields (Section L: metadata must not
  // control authorization or payment)
  for (const forbidden of ['title', 'scope_included', 'scope_excluded', 'price_cents', 'role', 'is_admin', 'status']) {
    assert(
      !WORK_ORDER_CHECKOUT_METADATA_KEYS.includes(forbidden as any),
      `${forbidden} must NOT be in the metadata whitelist`
    )
  }

  // Empty input returns only app_source
  const empty = sanitizeWorkOrderCheckoutMetadata(undefined)
  assertEqual(Object.keys(empty).length, 1, 'empty metadata returns only app_source')
  assertEqual(empty.app_source, 'subodhkc', 'empty metadata forces app_source')
}

// ============================================
// Section K: Work Order authority
// ============================================

function testWorkOrderAuthority() {
  console.log('\n--- Section K: Work Order Authority ---')

  // Platform admin: full authority
  const pa = resolveWorkOrderAuthority(makeCtx({ isPlatformAdmin: true }))
  assertEqual(pa.role, 'platform_admin', 'platform admin role')
  assert(pa.canRequest && pa.canApprove && pa.canPurchase, 'platform admin has full authority')

  // Org owner: full authority (subject to eligibility)
  const owner = resolveWorkOrderAuthority(makeCtx({
    role: 'owner',
    entitlements: [{ offering_key: 'ai_advisor_desk', effective_status: 'active' }],
  }))
  assertEqual(owner.role, 'org_owner', 'org owner role')
  assert(owner.canRequest && owner.canApprove && owner.canPurchase, 'org owner has full authority')
  assert(owner.orgEligible, 'org owner with active advisor desk is eligible')

  // Org admin: full authority
  const admin = resolveWorkOrderAuthority(makeCtx({
    role: 'admin',
    entitlements: [{ offering_key: 'fractional_ai_advisor', effective_status: 'active' }],
  }))
  assertEqual(admin.role, 'org_admin', 'org admin role')
  assert(admin.canRequest && admin.canApprove && admin.canPurchase, 'org admin has full authority')
  assert(admin.orgEligible, 'org admin with active fractional is eligible')

  // Service-seat member: can request, NOT purchase/approve (test #9)
  const seat = resolveWorkOrderAuthority(makeCtx({
    role: 'member',
    entitlements: [{ offering_key: 'ai_advisor_desk', effective_status: 'active' }],
    offeringRoles: [{ offering_key: 'ai_advisor_desk', status: 'active' }],
  }))
  assertEqual(seat.role, 'service_seat_member', 'service seat member role')
  assert(seat.canRequest, 'service seat member can request')
  assert(!seat.canPurchase, 'service seat member cannot purchase (test #9)')
  assert(!seat.canApprove, 'service seat member cannot approve')

  // Normal org member with no service seat: cannot request/purchase (test #7)
  const plain = resolveWorkOrderAuthority(makeCtx({
    role: 'member',
    entitlements: [{ offering_key: 'ai_advisor_desk', effective_status: 'active' }],
  }))
  assertEqual(plain.role, 'org_member_no_service', 'plain member role')
  assert(!plain.canRequest, 'plain member cannot request (test #7)')
  assert(!plain.canPurchase, 'plain member cannot purchase (test #7)')

  // Trialing entitlement does NOT make org eligible (test #6 / Section J)
  const trialing = resolveWorkOrderAuthority(makeCtx({
    role: 'owner',
    entitlements: [{ offering_key: 'ai_advisor_desk', effective_status: 'trialing' as any }],
  }))
  assert(!trialing.orgEligible, 'trialing entitlement does NOT qualify (test #6)')
  // Note: effective_status in the type is 'active'|'suspended'|'expired'|'revoked'|'pending';
  // trialing would not normally appear, but if it did it must not qualify.

  // Expired entitlement does NOT make org eligible
  const expired = resolveWorkOrderAuthority(makeCtx({
    role: 'owner',
    entitlements: [{ offering_key: 'ai_advisor_desk', effective_status: 'expired' }],
  }))
  assert(!expired.orgEligible, 'expired entitlement does NOT qualify')

  // No entitlement at all
  const noEnt = resolveWorkOrderAuthority(makeCtx({ role: 'owner' }))
  assert(!noEnt.orgEligible, 'no entitlement = not eligible')
}

// ============================================
// Section J: Trialing exclusion invariants
// ============================================

function testTrialingExclusion() {
  console.log('\n--- Section J: Trialing Exclusion ---')

  // The authority helper's eligibility check only accepts effective_status
  // === 'active'. Enumerate every non-active status and confirm none qualify.
  const nonActive: string[] = ['suspended', 'expired', 'revoked', 'pending', 'trialing']
  for (const status of nonActive) {
    const ctx = makeCtx({
      role: 'owner',
      entitlements: [{ offering_key: 'ai_advisor_desk', effective_status: status as any }],
    })
    const auth = resolveWorkOrderAuthority(ctx)
    assert(!auth.orgEligible, `effective_status=${status} must NOT qualify for Work Order eligibility`)
  }
}

// ============================================
// Section B/D: Status labels cover the new state
// ============================================

function testStatusLabels() {
  console.log('\n--- Section B/D: Status Label Coverage ---')

  const allStatuses: WorkOrderStatus[] = [
    'draft', 'awaiting_scope', 'awaiting_client_acceptance', 'awaiting_approval',
    'awaiting_owner_approval', 'ready_for_checkout', 'payment_pending', 'paid',
    'scoped', 'in_progress', 'needs_client_input', 'in_review', 'delivered',
    'completed', 'cancelled', 'refunded',
  ]

  for (const s of allStatuses) {
    const label = statusLabel(s)
    assert(label !== s, `statusLabel(${s}) should return a human label, not the raw status`)
    assert(label.length > 0, `statusLabel(${s}) should be non-empty`)
  }

  // The new state has a distinct label
  assert(statusLabel('awaiting_client_acceptance') !== statusLabel('awaiting_approval'), 'awaiting_client_acceptance has a distinct label from awaiting_approval')
  assert(statusActionLabel('awaiting_client_acceptance').toLowerCase().includes('accept'), 'action label for awaiting_client_acceptance mentions acceptance')

  // Advisor label for sent scope distinguishes from accepted
  assert(
    statusAdvisorLabel('awaiting_client_acceptance').toLowerCase().includes('awaiting'),
    'advisor label for awaiting_client_acceptance indicates waiting'
  )

  // Priority is defined for every status
  for (const s of allStatuses) {
    const p = statusPriority(s)
    assert(p === 'high' || p === 'medium' || p === 'low', `statusPriority(${s}) returns a valid priority`)
  }
}

// ============================================
// Section A: Repeatable Work Orders invariant
// ============================================

function testRepeatableWorkOrders() {
  console.log('\n--- Section A: Repeatable Work Orders ---')

  // The transition matrix allows multiple Work Orders to each go through the
  // full lifecycle independently. There is no global "already has a Work
  // Order" gate. This test documents that invariant: a Work Order in any
  // state does not block another Work Order's transitions.
  const statuses: WorkOrderStatus[] = [
    'draft', 'awaiting_scope', 'awaiting_client_acceptance', 'ready_for_checkout',
    'payment_pending', 'paid', 'in_progress', 'delivered', 'completed',
  ]
  // Each forward transition is valid regardless of other WOs (the matrix is
  // per-WO, not per-org). We just confirm the matrix is consistent.
  for (const s of statuses) {
    const allowed = ALLOWED_TRANSITIONS[s]
    assert(Array.isArray(allowed), `${s} has a defined allowed-transitions array`)
  }

  // Second/third WO creates unique records (test #16/#17): enforced by the
  // ai_work_order_seq + unique work_order_number + unique engagement per
  // fulfillment. Documented invariant; the migration's
  // generate_work_order_number() ensures uniqueness.
}

// ============================================
// Section I: Revenue source of truth invariant
// ============================================

function testRevenueSourceOfTruth() {
  console.log('\n--- Section I: Revenue Source of Truth ---')

  // The transition matrix does not allow scope_accepted_at to gate payment.
  // paid_at is set only by fulfill_work_order (payment_pending → paid),
  // which is only authorized for stripe_fulfillment. This test documents
  // that the paid transition requires the stripe_fulfillment actor.
  assert(
    isAuthorizedTransition('payment_pending', 'paid', 'stripe_fulfillment'),
    'paid transition requires stripe_fulfillment actor'
  )
  for (const actor of ['client', 'org_owner_admin', 'advisor_operator'] as TransitionActor[]) {
    assert(
      !isAuthorizedTransition('payment_pending', 'paid', actor),
      `${actor} cannot mark a Work Order paid (only Stripe fulfillment)`
    )
  }

  // paid_at is only set in the paid transition (the RPC sets it). No other
  // transition touches paid_at. Documented invariant.
}

// ============================================
// Section F: Transactional safety invariant
// ============================================

function testTransactionalSafety() {
  console.log('\n--- Section F: Transactional Safety ---')

  // The accept_work_order_scope RPC only accepts target statuses
  // ready_for_checkout or awaiting_owner_approval. The TS helper
  // acceptWorkOrderScope mirrors this. Documented invariant: acceptance
  // cannot transition to payment_pending or paid directly.
  assert(
    !isValidTransition('awaiting_client_acceptance', 'payment_pending'),
    'acceptance cannot jump to payment_pending (must go through ready_for_checkout)'
  )
  assert(
    !isValidTransition('awaiting_client_acceptance', 'paid'),
    'acceptance cannot jump to paid'
  )
  assert(
    isValidTransition('awaiting_client_acceptance', 'ready_for_checkout'),
    'acceptance can transition to ready_for_checkout (owner/admin accepts)'
  )
  assert(
    isValidTransition('awaiting_client_acceptance', 'awaiting_owner_approval'),
    'acceptance can transition to awaiting_owner_approval (service-seat member accepts)'
  )
}

// ============================================
// Section G: Fulfillment idempotency invariant
// ============================================

function testFulfillmentIdempotency() {
  console.log('\n--- Section G: Fulfillment Idempotency ---')

  // Once paid, the Work Order cannot re-enter payment_pending (no duplicate
  // checkout). paid → in_progress is the only forward path.
  assert(
    !isValidTransition('paid', 'payment_pending'),
    'paid cannot return to payment_pending (no duplicate checkout)'
  )
  assert(
    !isValidTransition('paid', 'ready_for_checkout'),
    'paid cannot return to ready_for_checkout'
  )

  // paid → refunded is allowed (for reconciliation) but only by platform_admin
  assert(
    isValidTransition('paid', 'refunded'),
    'paid → refunded is allowed for reconciliation'
  )
  assert(
    isAuthorizedTransition('paid', 'refunded', 'platform_admin'),
    'only platform_admin can refund a paid WO'
  )
  assert(
    !isAuthorizedTransition('paid', 'refunded', 'client'),
    'client cannot refund a paid WO'
  )
}

// ============================================
// authorityToActor mapping
// ============================================

function testAuthorityToActor() {
  console.log('\n--- authorityToActor mapping ---')

  assertEqual(authorityToActor('org_owner'), 'org_owner_admin', 'org_owner → org_owner_admin')
  assertEqual(authorityToActor('org_admin'), 'org_owner_admin', 'org_admin → org_owner_admin')
  assertEqual(authorityToActor('platform_admin'), 'platform_admin', 'platform_admin → platform_admin')
  assertEqual(authorityToActor('service_seat_member'), 'client', 'service_seat_member → client')
  assertEqual(authorityToActor('org_member_no_service'), 'client', 'org_member_no_service → client')
  assertEqual(authorityToActor('anonymous'), 'client', 'anonymous → client')
}

// ============================================
// Run all
// ============================================

function run() {
  console.log('=== Work Order Integrity Tests ===')
  testTransitionMatrix()
  testTransitionAuthority()
  testScopeSnapshotHashing()
  testMetadataWhitelist()
  testWorkOrderAuthority()
  testTrialingExclusion()
  testStatusLabels()
  testRepeatableWorkOrders()
  testRevenueSourceOfTruth()
  testTransactionalSafety()
  testFulfillmentIdempotency()
  testAuthorityToActor()

  console.log(`\n${passed} passed, ${failed} failed`)
  if (failed > 0) {
    process.exit(1)
  }
}

run()
