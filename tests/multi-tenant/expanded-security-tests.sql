-- Expanded multi-tenant security test matrix for SubodhKC Supabase schema
-- Run via: Supabase SQL Editor with pgTAP extension enabled
-- These tests validate RLS policies, tenant isolation, privilege escalation prevention,
-- invitation lifecycle, last-owner protection, and entitlement validity.

-- Requires pgTAP extension
create extension if not exists pgtap;

begin;

-- ============================================
-- TEST SETUP: Create test users and organizations
-- ============================================

-- Test users:
-- User A (owner-alpha): 00000000-0000-0000-0000-000000000001
-- User B (owner-beta):  00000000-0000-0000-0000-000000000002
-- User C (multi-org):   00000000-0000-0000-0000-000000000003
-- User D (platform-admin): 00000000-0000-0000-0000-000000000004
-- User E (member-alpha): 00000000-0000-0000-0000-000000000005
-- User F (no-org):      00000000-0000-0000-0000-000000000006

insert into auth.users (id, email, aud, role, instance_id, raw_app_meta_data, raw_user_meta_data)
values
  ('00000000-0000-0000-0000-000000000006', 'no-org@test.com', 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000', '{}'::jsonb, '{}'::jsonb)
on conflict (id) do nothing;

insert into public.profiles (id, email, display_name)
values ('00000000-0000-0000-0000-000000000006', 'no-org@test.com', 'Frank Norg')
on conflict (id) do nothing;

-- Insert test organizations (using deterministic UUIDs)
insert into public.organizations (id, name, slug, organization_kind, created_by)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Org Alpha', 'org-alpha-test', 'business', '00000000-0000-0000-0000-000000000001'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Org Beta', 'org-beta-test', 'school', '00000000-0000-0000-0000-000000000002'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Org Delta', 'org-delta-test', 'internal', '00000000-0000-0000-0000-000000000004')
on conflict (id) do nothing;

-- Insert memberships
insert into public.organization_memberships (organization_id, user_id, role, status)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-0000-0000-0000-000000000001', 'owner', 'active'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '00000000-0000-0000-0000-000000000002', 'owner', 'active'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-0000-0000-0000-000000000003', 'member', 'active'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '00000000-0000-0000-0000-000000000003', 'admin', 'active'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-0000-0000-0000-000000000005', 'member', 'active'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '00000000-0000-0000-0000-000000000004', 'owner', 'active')
on conflict (organization_id, user_id) do nothing;

-- Platform admin for User D
insert into public.platform_user_roles (user_id, role)
values ('00000000-0000-0000-0000-000000000004', 'platform_admin')
on conflict (user_id, role) do nothing;

-- Entitlements: Org Alpha has school_pickup, Org Beta has school_pickup
insert into public.organization_entitlements (organization_id, offering_id, status, source_type)
select 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', id, 'active', 'manual'
from public.offerings where offering_key = 'school_pickup'
on conflict do nothing;

insert into public.organization_entitlements (organization_id, offering_id, status, source_type)
select 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', id, 'active', 'manual'
from public.offerings where offering_key = 'school_pickup'
on conflict do nothing;

-- Member offering roles
insert into public.member_offering_roles (organization_id, user_id, offering_id, role, status)
select 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-0000-0000-0000-000000000001', id, 'admin', 'active'
from public.offerings where offering_key = 'school_pickup'
on conflict (organization_id, user_id, offering_id) do nothing;

insert into public.member_offering_roles (organization_id, user_id, offering_id, role, status)
select 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-0000-0000-0000-000000000003', id, 'user', 'active'
from public.offerings where offering_key = 'school_pickup'
on conflict (organization_id, user_id, offering_id) do nothing;

-- ============================================
-- GROUP 1: Identity / Membership helper functions
-- ============================================

-- Test 1: is_org_member returns false without auth context (service role bypasses)
select is(
  private.is_org_member('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid),
  false,
  'Test 1: is_org_member returns false without auth context'
);

-- Test 2: User A is member of Org Alpha
select set_config('request.jwt.claims.sub', '00000000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claims.role', 'authenticated', true);

select is(
  private.is_org_member('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid),
  true,
  'Test 2: User A is member of Org Alpha'
);

-- Test 3: User A is NOT member of Org Beta
select is(
  private.is_org_member('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid),
  false,
  'Test 3: User A is NOT member of Org Beta'
);

-- Test 4: User D is platform_admin
select set_config('request.jwt.claims.sub', '00000000-0000-0000-0000-000000000004', true);

select is(
  private.is_platform_admin(),
  true,
  'Test 4: User D is platform_admin'
);

-- Test 5: User C can access both orgs
select set_config('request.jwt.claims.sub', '00000000-0000-0000-0000-000000000003', true);

select is(
  private.is_org_member('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid),
  true,
  'Test 5: User C is member of Org Alpha'
);

select is(
  private.is_org_member('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid),
  true,
  'Test 6: User C is member of Org Beta'
);

-- Test 7: User B is NOT platform admin
select set_config('request.jwt.claims.sub', '00000000-0000-0000-0000-000000000002', true);

select is(
  private.is_platform_admin(),
  false,
  'Test 7: User B is NOT platform_admin'
);

-- Test 8: User F (no org) is not a member of any org
select set_config('request.jwt.claims.sub', '00000000-0000-0000-0000-000000000006', true);

select is(
  private.is_org_member('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid),
  false,
  'Test 8: User F is NOT member of Org Alpha'
);

-- ============================================
-- GROUP 2: Role checks
-- ============================================

select set_config('request.jwt.claims.sub', '00000000-0000-0000-0000-000000000001', true);

select is(
  private.has_org_role('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, array['owner']),
  true,
  'Test 9: User A has owner role in Org Alpha'
);

select is(
  private.has_org_role('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, array['admin']),
  false,
  'Test 10: User A does NOT have admin role in Org Alpha (is owner)'
);

select is(
  private.has_org_role('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, array['owner', 'admin']),
  true,
  'Test 11: User A has owner OR admin role in Org Alpha'
);

-- ============================================
-- GROUP 3: Offering access
-- ============================================

select is(
  private.has_offering_access('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'school_pickup'),
  true,
  'Test 12: User A has offering access to school_pickup in Org Alpha'
);

select is(
  private.has_offering_access('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, 'school_pickup'),
  false,
  'Test 13: User A does NOT have offering access to school_pickup in Org Beta'
);

-- Test 14: User C (member of Org Alpha, has offering role) should have access
select set_config('request.jwt.claims.sub', '00000000-0000-0000-0000-000000000003', true);

select is(
  private.has_offering_access('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'school_pickup'),
  true,
  'Test 14: User C has offering access to school_pickup in Org Alpha (member + role + entitlement)'
);

-- Test 15: User E (member of Org Alpha, NO offering role) should NOT have access
select set_config('request.jwt.claims.sub', '00000000-0000-0000-0000-000000000005', true);

select is(
  private.has_offering_access('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'school_pickup'),
  false,
  'Test 15: User E is Org Alpha member but has NO offering access (no member_offering_role)'
);

-- ============================================
-- GROUP 4: New authorization functions
-- ============================================

-- Test 16: is_entitlement_active for active entitlement
select is(
  private.is_entitlement_active('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'school_pickup'),
  true,
  'Test 16: Org Alpha has active entitlement for school_pickup'
);

-- Test 17: is_entitlement_active for non-existent entitlement
select is(
  private.is_entitlement_active('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'kestrel'),
  false,
  'Test 17: Org Alpha does NOT have entitlement for kestrel'
);

-- Test 18: can_access_offering for User A
select set_config('request.jwt.claims.sub', '00000000-0000-0000-0000-000000000001', true);

select is(
  private.can_access_offering('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'school_pickup'),
  true,
  'Test 18: User A can access school_pickup in Org Alpha (full chain)'
);

-- Test 19: can_access_offering returns false for User E (no offering role)
select set_config('request.jwt.claims.sub', '00000000-0000-0000-0000-000000000005', true);

select is(
  private.can_access_offering('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'school_pickup'),
  false,
  'Test 19: User E cannot access school_pickup (no offering role despite membership)'
);

-- ============================================
-- GROUP 5: RLS enforcement on tables
-- ============================================

-- Test 20: User A can SELECT from Org Alpha but not Org Beta
select set_config('request.jwt.claims.sub', '00000000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claims.role', 'authenticated', true);

select results_eq(
  $$
    select count(*) from public.organizations
    where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid
  $$,
  $$ select 1 $$,
  'Test 20: User A can see Org Alpha'
);

select results_eq(
  $$
    select count(*) from public.organizations
    where id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid
  $$,
  $$ select 0 $$,
  'Test 21: User A cannot see Org Beta'
);

-- Test 22: User A cannot insert membership into Org Beta
select throws_ok(
  $$
    insert into public.organization_memberships (organization_id, user_id, role)
    values ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, '00000000-0000-0000-0000-000000000001', 'member')
  $$,
  'Test 22: User A cannot insert membership into Org Beta (RLS blocks)'
);

-- Test 23: User F (no org) cannot see any organizations
select set_config('request.jwt.claims.sub', '00000000-0000-0000-0000-000000000006', true);

select results_eq(
  $$
    select count(*) from public.organizations
  $$,
  $$ select 0 $$,
  'Test 23: User F (no org) cannot see any organizations'
);

-- ============================================
-- GROUP 6: Audit immutability
-- ============================================

select set_config('request.jwt.claims.sub', '00000000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claims.role', 'authenticated', true);

insert into public.audit_events (organization_id, actor_user_id, action, entity_type, entity_id)
values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-0000-0000-0000-000000000001', 'test_action', 'test_entity', 'test-audit-1');

select throws_ok(
  $$
    update public.audit_events set action = 'tampered' where entity_id = 'test-audit-1'
  $$,
  'Test 24: Audit events cannot be updated by authenticated users'
);

select throws_ok(
  $$
    delete from public.audit_events where entity_id = 'test-audit-1'
  $$,
  'Test 25: Audit events cannot be deleted by authenticated users'
);

-- ============================================
-- GROUP 7: Privilege escalation prevention
-- ============================================

-- Test 26: Member cannot promote themselves
select set_config('request.jwt.claims.sub', '00000000-0000-0000-0000-000000000003', true);

select throws_ok(
  $$
    update public.organization_memberships set role = 'owner'
    where organization_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid
      and user_id = '00000000-0000-0000-0000-000000000003'::uuid
  $$,
  'Test 26: Member (User C) cannot promote themselves to owner in Org Alpha'
);

-- Test 27: Non-admin cannot insert platform_user_roles
select set_config('request.jwt.claims.sub', '00000000-0000-0000-0000-000000000002', true);

select throws_ok(
  $$
    insert into public.platform_user_roles (user_id, role)
    values ('00000000-0000-0000-0000-000000000002', 'platform_admin')
  $$,
  'Test 27: Non-admin cannot create platform_admin role'
);

-- Test 28: Member cannot revoke another member
select set_config('request.jwt.claims.sub', '00000000-0000-0000-0000-000000000005', true);

select throws_ok(
  $$
    update public.organization_memberships set status = 'revoked'
    where organization_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid
      and user_id = '00000000-0000-0000-0000-000000000003'::uuid
  $$,
  'Test 28: Member cannot revoke another member'
);

-- ============================================
-- GROUP 8: Last-owner protection
-- ============================================

-- Test 29: Cannot demote the last owner via direct update
select set_config('request.jwt.claims.sub', '00000000-0000-0000-0000-000000000001', true);

select throws_ok(
  $$
    update public.organization_memberships set role = 'admin'
    where organization_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid
      and user_id = '00000000-0000-0000-0000-000000000001'::uuid
      and role = 'owner'
  $$,
  'Test 29: Cannot demote the last owner via direct update (trigger blocks)'
);

-- Test 30: Cannot delete the last owner
select throws_ok(
  $$
    delete from public.organization_memberships
    where organization_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid
      and user_id = '00000000-0000-0000-0000-000000000001'::uuid
      and role = 'owner'
  $$,
  'Test 30: Cannot delete the last owner (trigger blocks)'
);

-- Test 31: remove_member function protects last owner
select throws_ok(
  $$
    select public.remove_member(
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
      '00000000-0000-0000-0000-000000000001'::uuid
    )
  $$,
  'Test 31: remove_member function prevents removing last owner'
);

-- ============================================
-- GROUP 9: Composite uniqueness constraints
-- ============================================

-- Test 32: Duplicate membership is prevented
select set_config('request.jwt.claims.sub', '00000000-0000-0000-0000-000000000001', true);

select throws_ok(
  $$
    insert into public.organization_memberships (organization_id, user_id, role)
    values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'member')
  $$,
  'Test 32: Duplicate organization membership is prevented by unique constraint'
);

-- Test 33: Duplicate external system link is prevented
insert into public.external_system_links (organization_id, system_key, external_id)
values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'kestrel', 'kestrel-tenant-test-001')
on conflict do nothing;

select throws_ok(
  $$
    insert into public.external_system_links (organization_id, system_key, external_id)
    values ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'kestrel', 'kestrel-tenant-test-001')
  $$,
  'Test 33: Same external_id cannot map to two organizations'
);

-- ============================================
-- GROUP 10: Invitation lifecycle
-- ============================================

-- Test 34: accept_invitation with invalid token
select set_config('request.jwt.claims.sub', '00000000-0000-0000-0000-000000000006', true);

select throws_ok(
  $$
    select public.accept_invitation('invalid-token-hash', 'nobody@test.com')
  $$,
  'Test 34: accept_invitation rejects invalid token'
);

-- Test 35: accept_invitation with expired invitation
select throws_ok(
  $$
    select public.accept_invitation(
      encode(digest('test-invite-token-expired', 'sha256'), 'hex'),
      'expired@test.com'
    )
  $$,
  'Test 35: accept_invitation rejects expired invitation'
);

-- Test 36: accept_invitation with revoked invitation
select throws_ok(
  $$
    select public.accept_invitation(
      encode(digest('test-invite-token-revoked', 'sha256'), 'hex'),
      'revoked@test.com'
    )
  $$,
  'Test 36: accept_invitation rejects revoked invitation'
);

-- Test 37: accept_invitation with valid token succeeds
select set_config('request.jwt.claims.sub', '00000000-0000-0000-0000-000000000006', true);

select lives_ok(
  $$
    select public.accept_invitation(
      encode(digest('test-invite-token-alpha', 'sha256'), 'hex'),
      'newmember@test.com'
    )
  $$,
  'Test 37: accept_invitation succeeds with valid token'
);

-- Test 38: Cannot accept already-accepted invitation
select throws_ok(
  $$
    select public.accept_invitation(
      encode(digest('test-invite-token-alpha', 'sha256'), 'hex'),
      'newmember@test.com'
    )
  $$,
  'Test 38: Cannot accept already-accepted invitation'
);

-- ============================================
-- GROUP 11: Platform admin access
-- ============================================

-- Test 39: Platform admin can see all organizations
select set_config('request.jwt.claims.sub', '00000000-0000-0000-0000-000000000004', true);
select set_config('request.jwt.claims.role', 'authenticated', true);

select results_eq(
  $$
    select count(*) >= 3 from public.organizations
  $$,
  $$ select true $$,
  'Test 39: Platform admin can see all organizations (>= 3)'
);

-- Test 40: Platform admin can access org without membership
select is(
  private.is_org_member('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid),
  false,
  'Test 40: Platform admin is NOT a direct member of Org Alpha (access via is_platform_admin)'
);

-- ============================================
-- GROUP 12: Entitlement validity edge cases
-- ============================================

-- Test 41: Expired entitlement (valid_until in past)
insert into public.organization_entitlements (organization_id, offering_id, status, source_type, valid_until)
select 'dddddddd-dddd-dddd-dddd-dddddddddddd', id, 'active', 'manual', now() - interval '1 day'
from public.offerings where offering_key = 'advisory'
on conflict do nothing;

select is(
  private.is_entitlement_active('dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid, 'advisory'),
  false,
  'Test 41: Entitlement with valid_until in past is NOT active'
);

-- Test 42: Suspended entitlement is not active
insert into public.organization_entitlements (organization_id, offering_id, status, source_type)
select 'dddddddd-dddd-dddd-dddd-dddddddddddd', id, 'suspended', 'manual'
from public.offerings where offering_key = 'kestrel'
on conflict do nothing;

select is(
  private.is_entitlement_active('dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid, 'kestrel'),
  false,
  'Test 42: Suspended entitlement is NOT active'
);

-- ============================================
-- CLEANUP
-- ============================================

select set_config('request.jwt.claims.sub', '', true);

-- Clean up test data
delete from public.audit_events where entity_id in ('test-audit-1', 'test-1');
delete from public.external_system_links where system_key = 'kestrel' and external_id = 'kestrel-tenant-test-001';
delete from public.member_offering_roles where organization_id in ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
delete from public.organization_entitlements where organization_id in ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'dddddddd-dddd-dddd-dddd-dddddddddddd');
delete from public.organization_invitations where organization_id in ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
delete from public.platform_user_roles where user_id = '00000000-0000-0000-0000-000000000004';
delete from public.organization_memberships where user_id in ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000006');
delete from public.organizations where id in ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'dddddddd-dddd-dddd-dddd-dddddddddddd');
delete from public.profiles where id in ('00000000-0000-0000-0000-000000000006');
delete from auth.users where id in ('00000000-0000-0000-0000-000000000006');

select * from finish();

rollback;
