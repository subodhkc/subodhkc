-- Migration 0005: Private schema with RLS helper functions
-- SECURITY DEFINER functions in a non-exposed schema
-- These are used by RLS policies, not called directly by clients

-- ============================================
-- PRIVATE SCHEMA
-- ============================================
create schema if not exists private;

-- Revoke usage from anon and authenticated by default
revoke usage on schema private from anon, authenticated;

-- ============================================
-- HELPER: is_platform_admin()
-- ============================================
create or replace function private.is_platform_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
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
  select exists (
    select 1
    from public.organization_memberships om
    inner join public.organizations o on o.id = om.organization_id
    where om.organization_id = org_id
      and om.user_id = auth.uid()
      and om.status = 'active'
      and o.status = 'active'
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
  select exists (
    select 1
    from public.organization_memberships om
    inner join public.organizations o on o.id = om.organization_id
    where om.organization_id = org_id
      and om.user_id = auth.uid()
      and om.status = 'active'
      and om.role = any(roles)
      and o.status = 'active'
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
  select exists (
    select 1
    from public.member_offering_roles mor
    inner join public.offerings o on o.id = mor.offering_id
    inner join public.organization_entitlements oe on oe.organization_id = mor.organization_id
      and oe.offering_id = mor.offering_id
    inner join public.organizations org on org.id = mor.organization_id
    where mor.organization_id = org_id
      and mor.user_id = auth.uid()
      and mor.status = 'active'
      and o.offering_key = offering_key
      and oe.status = 'active'
      and oe.valid_from <= now()
      and (oe.valid_until is null or oe.valid_until > now())
      and org.status = 'active'
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
  select exists (
    select 1
    from public.member_offering_roles mor
    inner join public.offerings o on o.id = mor.offering_id
    inner join public.organizations org on org.id = mor.organization_id
    where mor.organization_id = org_id
      and mor.user_id = auth.uid()
      and mor.status = 'active'
      and o.offering_key = offering_key
      and mor.role = any(roles)
      and org.status = 'active'
  )
$$;

-- ============================================
-- HELPER: is_entitlement_active(org_id, offering_key)
-- Checks: entitlement is active, valid_from <= now, valid_until > now or null, org is active
-- ============================================
create or replace function private.is_entitlement_active(ent_org_id uuid, off_key text)
returns boolean
language sql
stable
security definer
set search_path to public, private
as $$
  select exists (
    select 1
    from public.organization_entitlements oe
    inner join public.offerings o on o.id = oe.offering_id
    inner join public.organizations org on org.id = oe.organization_id
    where oe.organization_id = ent_org_id
      and o.offering_key = off_key
      and oe.status = 'active'
      and oe.valid_from <= now()
      and (oe.valid_until is null or oe.valid_until > now())
      and org.status = 'active'
  )
$$;

-- ============================================
-- HELPER: can_access_offering(org_id, offering_key)
-- Checks: active member_offering_role + active entitlement + org is active
-- ============================================
create or replace function private.can_access_offering(acc_org_id uuid, off_key text)
returns boolean
language sql
stable
security definer
set search_path to public, private
as $$
  select exists (
    select 1
    from public.member_offering_roles mor
    inner join public.offerings o on o.id = mor.offering_id
    inner join public.organizations org on org.id = mor.organization_id
    where mor.organization_id = acc_org_id
      and mor.user_id = auth.uid()
      and mor.status = 'active'
      and o.offering_key = off_key
      and org.status = 'active'
    and private.is_entitlement_active(acc_org_id, off_key)
  )
$$;

-- ============================================
-- HELPER: has_active_entitlement(org_id, offering_key)
-- Alias for is_entitlement_active
-- ============================================
create or replace function private.has_active_entitlement(hae_org_id uuid, off_key text)
returns boolean
language sql
stable
security definer
set search_path to public, private
as $$
  select private.is_entitlement_active(hae_org_id, off_key)
$$;

-- ============================================
-- HELPER: get_entitlement_status(entitlement_id)
-- Returns computed status considering time-based expiry
-- ============================================
create or replace function private.get_entitlement_status(ge_ent_id uuid)
returns text
language sql
stable
security definer
set search_path to public, private
as $$
  select case
    when status = 'revoked' then 'revoked'
    when status = 'suspended' then 'suspended'
    when status = 'expired' then 'expired'
    when status = 'pending' and valid_from > now() then 'pending'
    when status = 'active' and valid_until is not null and valid_until <= now() then 'expired'
    when status = 'active' and valid_from > now() then 'pending'
    when status = 'active' then 'active'
    else status
  end
  from public.organization_entitlements
  where id = ge_ent_id
$$;

-- ============================================
-- HELPER: write_audit_event(action, entity_type, org_id?, actor_id?, entity_id?, metadata?)
-- Inserts an audit event row. Returns the new audit_events.id.
-- ============================================
create or replace function private.write_audit_event(
  audit_action text,
  audit_entity_type text,
  audit_org_id uuid default null,
  audit_actor_id uuid default null,
  audit_entity_id text default null,
  audit_metadata jsonb default '{}'::jsonb
)
returns bigint
language plpgsql
security definer
set search_path to public, private
as $$
declare
  new_id bigint;
begin
  insert into public.audit_events (organization_id, actor_user_id, action, entity_type, entity_id, metadata)
  values (audit_org_id, audit_actor_id, audit_action, audit_entity_type, audit_entity_id, audit_metadata)
  returning id into new_id;
  return new_id;
end;
$$;

-- Grant execute only to authenticated role
grant execute on all functions in schema private to authenticated;
