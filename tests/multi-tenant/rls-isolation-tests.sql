-- Multi-tenant isolation tests for SubodhKC Supabase schema
-- Run via: Supabase SQL Editor or pgTAP
-- These tests validate RLS policies, tenant isolation, and privilege escalation prevention

-- Requires pgTAP extension
create extension if not exists pgtap;

begin;

-- ============================================
-- TEST SETUP: Create test users and organizations
-- ============================================

-- Test users (using auth.users via service role)
-- We'll use UUIDs for deterministic testing
-- User A: 00000000-0000-0000-0000-000000000001
-- User B: 00000000-0000-0000-0000-000000000002
-- User C (multi-org): 00000000-0000-0000-0000-000000000003

-- Insert test auth users
insert into auth.users (id, email, aud, role, instance_id, raw_app_meta_data, raw_user_meta_data)
values
  ('00000000-0000-0000-0000-000000000001', 'user-a@test.com', 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000', '{}'::jsonb, '{}'::jsonb),
  ('00000000-0000-0000-0000-000000000002', 'user-b@test.com', 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000', '{}'::jsonb, '{}'::jsonb),
  ('00000000-0000-0000-0000-000000000003', 'user-c@test.com', 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000', '{}'::jsonb, '{}'::jsonb)
on conflict (id) do nothing;

-- Insert test profiles
insert into public.profiles (id, email, display_name)
values
  ('00000000-0000-0000-0000-000000000001', 'user-a@test.com', 'User A'),
  ('00000000-0000-0000-0000-000000000002', 'user-b@test.com', 'User B'),
  ('00000000-0000-0000-0000-000000000003', 'user-c@test.com', 'User C')
on conflict (id) do nothing;

-- Insert test organizations
insert into public.organizations (id, name, slug, organization_kind, created_by)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Org Alpha', 'org-alpha', 'business', '00000000-0000-0000-0000-000000000001'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Org Beta', 'org-beta', 'school', '00000000-0000-0000-0000-000000000002')
on conflict (id) do nothing;

-- Insert memberships
-- User A -> Org Alpha (owner)
-- User B -> Org Beta (owner)
-- User C -> Org Alpha (member) + Org Beta (admin)
insert into public.organization_memberships (organization_id, user_id, role, status)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-0000-0000-0000-000000000001', 'owner', 'active'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '00000000-0000-0000-0000-000000000002', 'owner', 'active'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-0000-0000-0000-000000000003', 'member', 'active'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '00000000-0000-0000-0000-000000000003', 'admin', 'active')
on conflict (organization_id, user_id) do nothing;

-- Insert offerings (should already exist from migration, but ensure)
insert into public.offerings (offering_key, name, offering_kind)
values ('school_pickup', 'School Pickup', 'product')
on conflict (offering_key) do nothing;

-- Insert entitlement for Org Alpha -> school_pickup
insert into public.organization_entitlements (organization_id, offering_id, status, source_type)
select 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', id, 'active', 'manual'
from public.offerings where offering_key = 'school_pickup'
on conflict do nothing;

-- Insert member_offering_role for User A -> school_pickup in Org Alpha
insert into public.member_offering_roles (organization_id, user_id, offering_id, role, status)
select 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-0000-0000-0000-000000000001', id, 'admin', 'active'
from public.offerings where offering_key = 'school_pickup'
on conflict (organization_id, user_id, offering_id) do nothing;

-- Insert platform_admin role for User A
insert into public.platform_user_roles (user_id, role)
values ('00000000-0000-0000-0000-000000000001', 'platform_admin')
on conflict (user_id, role) do nothing;

-- ============================================
-- TESTS: Identity / Membership
-- ============================================

-- Test 1: User A can access Org Alpha
select is(
  private.is_org_member('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid),
  false,
  'Test 1 setup: is_org_member returns false without auth context (service role bypasses RLS)'
);

-- Note: RLS functions use auth.uid() which requires a JWT context.
-- For proper RLS testing, we need to set the request.jwt.claims.sub
-- These tests validate the SQL logic; full integration tests run via the app.

-- Test 2: Verify helper function logic with simulated auth context
select set_config('request.jwt.claims.sub', '00000000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claims.role', 'authenticated', true);

select is(
  private.is_org_member('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid),
  true,
  'Test 2: User A is member of Org Alpha'
);

select is(
  private.is_org_member('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid),
  false,
  'Test 3: User A is NOT member of Org Beta'
);

select is(
  private.is_platform_admin(),
  true,
  'Test 4: User A is platform_admin'
);

-- Test 4: User C can access both orgs
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

-- Test 5: User B is NOT platform admin
select set_config('request.jwt.claims.sub', '00000000-0000-0000-0000-000000000002', true);

select is(
  private.is_platform_admin(),
  false,
  'Test 7: User B is NOT platform_admin'
);

select is(
  private.is_org_member('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid),
  false,
  'Test 8: User B is NOT member of Org Alpha'
);

-- Test 6: has_org_role checks
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

-- Test 7: has_offering_access
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

-- Test 8: User C (member of Org Alpha, but no member_offering_role) should NOT have offering access
select set_config('request.jwt.claims.sub', '00000000-0000-0000-0000-000000000003', true);

select is(
  private.has_offering_access('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'school_pickup'),
  false,
  'Test 14: User C is Org Alpha member but has NO offering access to school_pickup (no member_offering_role)'
);

-- ============================================
-- TESTS: RLS enforcement on tables
-- ============================================

-- Test 9: User A can SELECT from Org Alpha but not Org Beta
select set_config('request.jwt.claims.sub', '00000000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claims.role', 'authenticated', true);

select results_eq(
  $$
    select count(*) from public.organizations
    where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid
  $$,
  $$ select 1 $$,
  'Test 15: User A can see Org Alpha'
);

select results_eq(
  $$
    select count(*) from public.organizations
    where id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid
  $$,
  $$ select 0 $$,
  'Test 16: User A cannot see Org Beta'
);

-- Test 10: User A cannot insert membership into Org Beta
select throws_ok(
  $$
    insert into public.organization_memberships (organization_id, user_id, role)
    values ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, '00000000-0000-0000-0000-000000000001', 'member')
  $$,
  'Test 17: User A cannot insert membership into Org Beta (RLS blocks)'
);

-- Test 11: Audit events are immutable (no update/delete for authenticated)
select set_config('request.jwt.claims.sub', '00000000-0000-0000-0000-000000000001', true);

-- Insert an audit event first (as platform admin)
select set_config('request.jwt.claims.sub', '00000000-0000-0000-0000-000000000001', true);
insert into public.audit_events (organization_id, actor_user_id, action, entity_type, entity_id)
values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-0000-0000-0000-000000000001', 'test_action', 'test_entity', 'test-1');

-- Try to update it (should fail - no update policy)
select throws_ok(
  $$
    update public.audit_events set action = 'tampered' where entity_id = 'test-1'
  $$,
  'Test 18: Audit events cannot be updated by authenticated users'
);

-- Try to delete it (should fail - no delete policy)
select throws_ok(
  $$
    delete from public.audit_events where entity_id = 'test-1'
  $$,
  'Test 19: Audit events cannot be deleted by authenticated users'
);

-- ============================================
-- TESTS: Privilege escalation prevention
-- ============================================

-- Test 12: Member cannot promote themselves
select set_config('request.jwt.claims.sub', '00000000-0000-0000-0000-000000000003', true);

select throws_ok(
  $$
    update public.organization_memberships set role = 'owner'
    where organization_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid
      and user_id = '00000000-0000-0000-0000-000000000003'::uuid
  $$,
  'Test 20: Member (User C) cannot promote themselves to owner in Org Alpha'
);

-- Test 13: Non-admin cannot insert platform_user_roles
select set_config('request.jwt.claims.sub', '00000000-0000-0000-0000-000000000002', true);

select throws_ok(
  $$
    insert into public.platform_user_roles (user_id, role)
    values ('00000000-0000-0000-0000-000000000002', 'platform_admin')
  $$,
  'Test 21: Non-admin cannot create platform_admin role'
);

-- ============================================
-- TESTS: Composite uniqueness constraints
-- ============================================

-- Test 14: Duplicate membership is prevented
select throws_ok(
  $$
    insert into public.organization_memberships (organization_id, user_id, role)
    values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'member')
  $$,
  'Test 22: Duplicate organization membership is prevented by unique constraint'
);

-- Test 15: Duplicate external system link is prevented
insert into public.external_system_links (organization_id, system_key, external_id)
values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'kestrel', 'kestrel-tenant-001')
on conflict do nothing;

select throws_ok(
  $$
    insert into public.external_system_links (organization_id, system_key, external_id)
    values ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'kestrel', 'kestrel-tenant-001')
  $$,
  'Test 23: Same external_id cannot map to two organizations'
);

-- ============================================
-- CLEANUP
-- ============================================

-- Reset config
select set_config('request.jwt.claims.sub', '', true);

-- Clean up test data
delete from public.audit_events where entity_id = 'test-1';
delete from public.external_system_links where system_key = 'kestrel' and external_id = 'kestrel-tenant-001';
delete from public.member_offering_roles where organization_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' and user_id = '00000000-0000-0000-0000-000000000001';
delete from public.organization_entitlements where organization_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
delete from public.platform_user_roles where user_id = '00000000-0000-0000-0000-000000000001';
delete from public.organization_memberships where user_id in ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003');
delete from public.organizations where id in ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
delete from public.profiles where id in ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003');
delete from auth.users where id in ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003');

select * from finish();

rollback;
