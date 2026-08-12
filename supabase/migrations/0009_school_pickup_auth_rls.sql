-- ============================================
-- Migration 0009: School Pickup RLS + Authorization Helpers
-- Applied via Supabase MCP
-- ============================================
-- This file is the repository source of truth for the RLS policies.
-- The migration was applied directly to the Supabase project.

-- Authorization helpers:
-- private.has_school_role(site_id, roles[])
-- private.has_school_access(site_id)
-- private.has_org_school_access(org_id)
-- private.user_site_ids(org_id)
-- private.validate_queue_transition(from_status, to_status)

-- RLS enabled on all school pickup tables:
-- school_sites, school_staff_assignments, school_classrooms,
-- school_students, pickup_groups, pickup_group_students,
-- pickup_credentials, pickup_sessions, pickup_session_counters,
-- pickup_arrivals, pickup_queue_items, pickup_status_events,
-- pickup_scan_events

-- Permission matrix:
-- | Action              | school_admin | dismissal_manager | scanner | teacher | org_admin/owner |
-- |---------------------|--------------|-------------------|---------|---------|-----------------|
-- | roster read         | Y            | Y                 | N*      | N*      | Y               |
-- | roster edit         | Y            | Y                 | N       | N       | Y               |
-- | credential issue    | Y            | Y                 | N       | N       | Y               |
-- | credential revoke   | Y            | Y                 | N       | N       | Y               |
-- | session open/close  | Y            | Y                 | N       | N       | Y               |
-- | scan                | Y            | Y                 | Y       | N       | N               |
-- | manual check-in     | Y            | Y                 | Y       | N       | N               |
-- | queue read          | Y            | Y                 | Y       | Y*      | Y               |
-- | status transition   | Y            | Y                 | Y**     | Y***    | N               |
-- | exception handling  | Y            | Y                 | N       | N       | Y               |
-- | staff administration| Y            | N                 | N       | N       | Y               |
--
-- * Scanner/teacher get narrow projections via RPC, not full table access
-- ** Scanner: arrived->preparing, arrived->ready, arrived->completed
-- *** Teacher: arrived->preparing, preparing->ready

-- ============================================
-- FIX: Grant USAGE on private schema to authenticated/anon
-- RLS policies reference private.* functions; without USAGE, policies fail
-- ============================================
grant usage on schema private to authenticated, anon;
grant execute on all functions in schema private to authenticated, anon;
alter default privileges in schema private grant execute on functions to authenticated, anon;

-- ============================================
-- FIX: has_org_school_access, has_school_access, has_school_role
-- Now also verify active org membership (not just staff assignment)
-- Prevents access when org membership is revoked even if staff assignment is active
-- ============================================

create or replace function private.has_org_school_access(org_id uuid)
returns boolean
language sql
security definer
set search_path to 'public'
as $$
  select exists (
    select 1
    from public.school_staff_assignments ssa
    inner join public.school_sites ss on ss.id = ssa.school_site_id
    inner join public.organization_memberships om on om.organization_id = ss.organization_id
      and om.user_id = ssa.user_id
      and om.status = 'active'
    inner join public.organizations o on o.id = ss.organization_id
      and o.status = 'active'
    where ss.organization_id = org_id
      and ssa.user_id = auth.uid()
      and ssa.status = 'active'
      and ss.status = 'active'
  )
$$;

create or replace function private.has_school_access(site_id uuid)
returns boolean
language sql
security definer
set search_path to 'public'
as $$
  select exists (
    select 1
    from public.school_staff_assignments ssa
    inner join public.school_sites ss on ss.id = ssa.school_site_id
    inner join public.organization_memberships om on om.organization_id = ss.organization_id
      and om.user_id = ssa.user_id
      and om.status = 'active'
    inner join public.organizations o on o.id = ss.organization_id
      and o.status = 'active'
    where ssa.school_site_id = site_id
      and ssa.user_id = auth.uid()
      and ssa.status = 'active'
      and ss.status = 'active'
  )
$$;

create or replace function private.has_school_role(site_id uuid, roles text[])
returns boolean
language sql
security definer
set search_path to 'public'
as $$
  select exists (
    select 1
    from public.school_staff_assignments ssa
    inner join public.school_sites ss on ss.id = ssa.school_site_id
    inner join public.organization_memberships om on om.organization_id = ss.organization_id
      and om.user_id = ssa.user_id
      and om.status = 'active'
    inner join public.organizations o on o.id = ss.organization_id
      and o.status = 'active'
    where ssa.school_site_id = site_id
      and ssa.user_id = auth.uid()
      and ssa.status = 'active'
      and ssa.role = any(roles)
      and ss.status = 'active'
  )
$$;

grant execute on all functions in schema private to authenticated, anon;
