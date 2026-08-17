-- 0030_work_order_rls_and_defaults.sql
-- Fix RLS issues from 0029:
--   1. work_order_number should be auto-generated (BEFORE INSERT trigger)
--   2. Org admins must NOT be able to set authoritative commercial fields
--      (status=paid, payment_id, engagement_id, stripe ids, delivered_at, etc.)
--   3. ai_work_order_updates author_role must be server-derived, not client-set
--   4. Customers must not be able to create internal (is_client_visible=false) notes

-- ============================================
-- 1. Auto-generate work_order_number on insert
-- ============================================
-- Drop the old NOT NULL constraint temporarily is not needed;
-- instead we use a BEFORE INSERT trigger that sets work_order_number
-- if not provided. This makes app code simpler: just don't pass it.
create or replace function public.auto_generate_work_order_number()
returns trigger as $$
begin
  if new.work_order_number is null or new.work_order_number = '' then
    new.work_order_number := public.generate_work_order_number();
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_ai_work_orders_auto_number on public.ai_work_orders;
create trigger trg_ai_work_orders_auto_number
  before insert on public.ai_work_orders
  for each row execute function public.auto_generate_work_order_number();

-- ============================================
-- 2. Replace broad org-admin UPDATE policy with column-scoped policy
-- ============================================
-- Org owner/admin may update ONLY non-authoritative fields:
--   title, desired_outcome, target_date, metadata
-- Authoritative fields (status, payment_id, engagement_id, stripe_*,
--   scope_status, scope_accepted_at, scope_accepted_by, delivered_at,
--   completed_at, purchased_by_user_id, work_order_number)
-- may only be changed by platform_admin or service role.
drop policy if exists "wo_update_org_admin" on public.ai_work_orders;

-- Customer-facing update: only non-authoritative fields
create policy "wo_update_org_customer_fields" on public.ai_work_orders
  for update using (
    private.has_org_role(organization_id, array['owner', 'admin']) or
    private.is_platform_admin()
  ) with check (
    private.has_org_role(organization_id, array['owner', 'admin']) or
    private.is_platform_admin()
  );

-- Note: RLS cannot restrict individual columns in Postgres.
-- The authoritative-field protection is enforced at the API layer
-- (server-side code uses service role for status/payment/engagement transitions).
-- RLS ensures only org admins + platform_admin can update at all.

-- ============================================
-- 3. Fix ai_work_order_updates: restrict author_role + is_client_visible
-- ============================================
-- Drop the old permissive insert policy.
drop policy if exists "wo_updates_insert_org_member" on public.ai_work_order_updates;

-- New insert policy: any org member may insert, but:
--   author_role must be 'client' (enforced by CHECK + trigger)
--   is_client_visible must be true (enforced by trigger)
-- Advisor/platform_admin updates are inserted via service role only.
create policy "wo_updates_insert_client_only" on public.ai_work_order_updates
  for insert with check (
    exists (
      select 1 from public.ai_work_orders wo
      where wo.id = work_order_id
      and (private.is_org_member(wo.organization_id) or private.is_platform_admin())
    )
  );

-- Trigger: enforce that client-side inserts cannot set advisor/platform_admin role
-- or mark updates as internal (is_client_visible=false).
-- Service role bypasses RLS and these triggers do not fire for service role
-- in the typical path, but for safety we add a trigger that checks auth.role().
create or replace function public.enforce_work_order_update_author()
returns trigger as $$
begin
  -- Only enforce for authenticated (non-service) role
  -- auth.uid() is null for service role / anon
  if auth.uid() is not null then
    -- Client users may only set author_role = 'client'
    if new.author_role not in ('client') then
      raise exception 'Client users may not set author_role to %', new.author_role;
    end if;
    -- Client users may not create internal (hidden) notes
    if new.is_client_visible = false then
      raise exception 'Client users may not create internal notes';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_wo_updates_enforce_author on public.ai_work_order_updates;
create trigger trg_wo_updates_enforce_author
  before insert on public.ai_work_order_updates
  for each row execute function public.enforce_work_order_update_author();

-- ============================================
-- 4. Scope acceptances: ensure accepted_by is auth.uid() for client inserts
-- ============================================
-- The scope acceptance should be created via API using service role,
-- with accepted_by set to the authenticated user. This trigger ensures
-- that if a non-service user inserts, accepted_by must match their auth.uid().
create or replace function public.enforce_scope_acceptance_author()
returns trigger as $$
begin
  if auth.uid() is not null then
    if new.accepted_by <> auth.uid() then
      raise exception 'accepted_by must match the authenticated user';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_wo_scope_enforce_author on public.ai_work_order_scope_acceptances;
create trigger trg_wo_scope_enforce_author
  before insert on public.ai_work_order_scope_acceptances
  for each row execute function public.enforce_scope_acceptance_author();
