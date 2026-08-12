-- Migration 0005: Private schema with RLS helper functions
-- SECURITY DEFINER functions in a non-exposed schema
-- These are used by RLS policies, not called directly by clients

-- ============================================
-- PRIVATE SCHEMA
-- ============================================
create schema if not exists private;

-- Revoke execute from anon and authenticated by default
revoke execute on schema private from anon, authenticated;

-- ============================================
-- HELPER: is_platform_admin()
-- ============================================
create or replace function private.is_platform_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  exists (
    select 1
    from public.platform_user_roles
    where user_id = auth.uid()
      and role = 'platform_admin'
  )
$$;

-- ============================================
-- HELPER: is_org_member(org_id)
-- ============================================
create or replace function private.is_org_member(org_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  exists (
    select 1
    from public.organization_memberships
    where organization_id = org_id
      and user_id = auth.uid()
      and status = 'active'
  )
$$;

-- ============================================
-- HELPER: has_org_role(org_id, roles)
-- ============================================
create or replace function private.has_org_role(org_id uuid, roles text[])
returns boolean
language sql
security definer
set search_path = public
as $$
  exists (
    select 1
    from public.organization_memberships
    where organization_id = org_id
      and user_id = auth.uid()
      and status = 'active'
      and role = any(roles)
  )
$$;

-- ============================================
-- HELPER: has_offering_access(org_id, offering_key)
-- Checks: active membership + active entitlement + active member_offering_role
-- ============================================
create or replace function private.has_offering_access(org_id uuid, offering_key text)
returns boolean
language sql
security definer
set search_path = public
as $$
  exists (
    select 1
    from public.member_offering_roles mor
    inner join public.offerings o on o.id = mor.offering_id
    inner join public.organization_entitlements oe on oe.organization_id = mor.organization_id
      and oe.offering_id = mor.offering_id
    where mor.organization_id = org_id
      and mor.user_id = auth.uid()
      and mor.status = 'active'
      and o.offering_key = offering_key
      and oe.status = 'active'
      and (oe.valid_until is null or oe.valid_until > now())
  )
$$;

-- ============================================
-- HELPER: has_offering_role(org_id, offering_key, roles)
-- ============================================
create or replace function private.has_offering_role(org_id uuid, offering_key text, roles text[])
returns boolean
language sql
security definer
set search_path = public
as $$
  exists (
    select 1
    from public.member_offering_roles mor
    inner join public.offerings o on o.id = mor.offering_id
    where mor.organization_id = org_id
      and mor.user_id = auth.uid()
      and mor.status = 'active'
      and o.offering_key = offering_key
      and mor.role = any(roles)
  )
$$;

-- Grant execute only to authenticated role
grant execute on all functions in schema private to authenticated;
