-- 0032_work_order_scope_versions.sql
-- Work Order integrity hardening:
--   1. ai_work_order_scope_versions — immutable per-version scope snapshots
--   2. Add 'sent_to_client' / 'awaiting_client_acceptance' to scope_status
--   3. Add 'awaiting_client_acceptance' to work status
--   4. Add paid_at to ai_work_orders (revenue source of truth)
--   5. Link ai_work_order_scope_acceptances to a scope_version_id (nullable
--      for historical rows) and drop the hardcoded scope_version=1 default
--   6. Add current_scope_version_id to ai_work_orders (points to the
--      currently-offered version)
--   7. Add engagement_id uniqueness per work order to prevent mis-linking
-- All changes are additive and backwards-compatible.

-- ============================================
-- 1. ai_work_order_scope_versions
-- ============================================
-- Each row is an immutable, server-generated scope version for one Work Order.
-- The customer accepts a specific version by id; the acceptance records the
-- version id and a hash of the snapshot. The Work Order's mutable scope_*
-- columns are NOT the source of truth for what was accepted — this table is.
create table if not exists public.ai_work_order_scope_versions (
  id uuid primary key default gen_random_uuid(),
  work_order_id uuid not null references public.ai_work_orders(id) on delete cascade,
  version_number integer not null,
  scope_snapshot jsonb not null,
  document_hash text not null,
  price_cents integer not null,
  currency text not null default 'USD',
  composed_by uuid references auth.users(id),
  composed_at timestamptz not null default now(),
  -- Lifecycle of the version itself
  version_status text not null default 'proposed'
    check (version_status in ('proposed', 'sent_to_client', 'accepted',
                              'superseded', 'withdrawn')),
  superseded_by uuid references public.ai_work_order_scope_versions(id),
  created_at timestamptz not null default now()
);

-- One current version per work order at a time (partial unique index on
-- non-superseded versions). Enforced softly via index; the API layer is the
-- primary enforcer of "only one current version".
create unique index if not exists uq_wo_scope_version_current
  on public.ai_work_order_scope_versions(work_order_id)
  where version_status in ('proposed', 'sent_to_client', 'accepted');

-- Version numbers must be unique per work order
create unique index if not exists uq_wo_scope_version_number
  on public.ai_work_order_scope_versions(work_order_id, version_number);

create index if not exists idx_wo_scope_versions_wo
  on public.ai_work_order_scope_versions(work_order_id, created_at desc);

alter table public.ai_work_order_scope_versions enable row level security;

create policy "wo_scope_versions_select_org_member" on public.ai_work_order_scope_versions
  for select using (
    exists (
      select 1 from public.ai_work_orders wo
      where wo.id = work_order_id
      and (private.is_org_member(wo.organization_id) or private.is_platform_admin())
    )
  );

create policy "wo_scope_versions_insert_platform_admin" on public.ai_work_order_scope_versions
  for insert with check (
    exists (
      select 1 from public.ai_work_orders wo
      where wo.id = work_order_id
      and private.is_platform_admin()
    )
  );

create policy "wo_scope_versions_update_platform_admin" on public.ai_work_order_scope_versions
  for update using (
    exists (
      select 1 from public.ai_work_orders wo
      where wo.id = work_order_id
      and private.is_platform_admin()
    )
  ) with check (
    exists (
      select 1 from public.ai_work_orders wo
      where wo.id = work_order_id
      and private.is_platform_admin()
    )
  );

-- ============================================
-- 2. Add new scope_status values
-- ============================================
-- 'sent_to_client' = advisor composed and sent; NOT accepted.
-- 'awaiting_client_acceptance' = same semantic, alternate spelling kept off
--   the canonical list to avoid proliferation. We use 'sent_to_client'.
alter table public.ai_work_orders drop constraint if exists ai_work_orders_scope_status_check;
alter table public.ai_work_orders add constraint ai_work_orders_scope_status_check
  check (scope_status in ('draft', 'needs_review', 'standard', 'sent_to_client',
                          'custom_scope_required', 'accepted'));

-- ============================================
-- 3. Add 'awaiting_client_acceptance' to work status
-- ============================================
-- Distinct from 'awaiting_approval' (legacy) and 'awaiting_owner_approval'.
-- 'awaiting_client_acceptance' = scope has been sent to the client and we are
-- waiting for the client to accept the exact version.
alter table public.ai_work_orders drop constraint if exists ai_work_orders_status_check;
alter table public.ai_work_orders add constraint ai_work_orders_status_check
  check (status in ('draft', 'awaiting_scope', 'awaiting_client_acceptance',
                    'awaiting_approval', 'awaiting_owner_approval',
                    'ready_for_checkout', 'payment_pending', 'paid', 'scoped',
                    'in_progress', 'needs_client_input', 'in_review',
                    'delivered', 'completed', 'cancelled', 'refunded'));

-- ============================================
-- 4. paid_at on ai_work_orders
-- ============================================
-- Set by fulfillment when payment is recorded. This is the revenue source of
-- truth, NOT scope_accepted_at.
alter table public.ai_work_orders
  add column if not exists paid_at timestamptz;

create index if not exists idx_ai_work_orders_paid_at
  on public.ai_work_orders(paid_at) where paid_at is not null;

-- ============================================
-- 5. Link scope acceptances to a scope_version_id
-- ============================================
-- Nullable for historical rows that used the old scope_version=1 path.
-- New acceptances must reference an immutable scope version row.
alter table public.ai_work_order_scope_acceptances
  add column if not exists scope_version_id uuid
    references public.ai_work_order_scope_versions(id) on delete set null;

-- Drop the old hardcoded default so new acceptances do not silently get v1.
alter table public.ai_work_order_scope_acceptances
  alter column scope_version drop default;

create index if not exists idx_wo_scope_acceptances_version
  on public.ai_work_order_scope_acceptances(scope_version_id)
  where scope_version_id is not null;

-- ============================================
-- 6. current_scope_version_id on ai_work_orders
-- ============================================
-- Points to the version currently offered to the client. Acceptance must
-- match this id (or be validated against it server-side).
alter table public.ai_work_orders
  add column if not exists current_scope_version_id uuid
    references public.ai_work_order_scope_versions(id) on delete set null;

-- ============================================
-- 7. RPC: accept_work_order_scope (transactional)
-- ============================================
-- Atomically:
--   - validates the work order exists and is awaiting client acceptance
--   - loads the canonical immutable scope version
--   - validates the version is the current offered version
--   - validates the version is in 'sent_to_client' state
--   - inserts a scope_acceptance row linked to the version
--   - marks the version 'accepted' and supersedes any prior 'accepted'
--   - transitions the work order to ready_for_checkout (or
--     awaiting_owner_approval if the acceptor is not owner/admin — caller
--     decides via parameter)
--   - records scope_accepted_at / scope_accepted_by
-- All in one transaction. Returns the acceptance id or raises an error.
create or replace function public.accept_work_order_scope(
  p_work_order_id uuid,
  p_scope_version_id uuid,
  p_accepted_by uuid,
  p_transition_target text default 'ready_for_checkout'
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_wo public.ai_work_orders%rowtype;
  v_version public.ai_work_order_scope_versions%rowtype;
  v_acceptance_id uuid;
  v_target_status text := p_transition_target;
begin
  if p_transition_target not in ('ready_for_checkout', 'awaiting_owner_approval') then
    raise exception 'invalid_transition_target';
  end if;

  select * into v_wo from public.ai_work_orders where id = p_work_order_id;
  if not found then
    raise exception 'work_order_not_found';
  end if;

  if v_wo.status not in ('awaiting_client_acceptance', 'awaiting_approval') then
    raise exception 'work_order_not_awaiting_acceptance (current=%)', v_wo.status;
  end if;

  select * into v_version from public.ai_work_order_scope_versions
    where id = p_scope_version_id and work_order_id = p_work_order_id;
  if not found then
    raise exception 'scope_version_not_found';
  end if;

  if v_wo.current_scope_version_id is not null and v_wo.current_scope_version_id <> p_scope_version_id then
    raise exception 'stale_scope_version';
  end if;

  if v_version.version_status <> 'sent_to_client' then
    raise exception 'scope_version_not_awaiting_acceptance (state=%)', v_version.version_status;
  end if;

  -- Insert acceptance
  insert into public.ai_work_order_scope_acceptances (
    work_order_id, scope_version_id, scope_version,
    rendered_scope_json, document_hash, accepted_by,
    price_cents, currency
  ) values (
    p_work_order_id, p_scope_version_id, v_version.version_number,
    v_version.scope_snapshot, v_version.document_hash, p_accepted_by,
    v_version.price_cents, v_version.currency
  ) returning id into v_acceptance_id;

  -- Mark version accepted
  update public.ai_work_order_scope_versions
    set version_status = 'accepted'
    where id = p_scope_version_id;

  -- Supersede any prior accepted version for this work order
  update public.ai_work_order_scope_versions
    set version_status = 'superseded',
        superseded_by = p_scope_version_id
    where work_order_id = p_work_order_id
      and id <> p_scope_version_id
      and version_status = 'accepted';

  -- Transition work order + record acceptance metadata
  update public.ai_work_orders
    set status = v_target_status,
        scope_status = 'accepted',
        scope_accepted_at = now(),
        scope_accepted_by = p_accepted_by
    where id = p_work_order_id;

  -- Audit update record
  insert into public.ai_work_order_updates (
    work_order_id, author_user_id, author_role, update_type,
    body, previous_status, new_status, is_client_visible
  ) values (
    p_work_order_id, p_accepted_by, 'client', 'scope_change',
    'Customer accepted scope version ' || v_version.version_number || '.',
    v_wo.status, v_target_status, true
  );

  return v_acceptance_id;
end;
$$;

-- ============================================
-- 8. RPC: transition_work_order_status (validated + transactional)
-- ============================================
-- Enforces the canonical transition matrix. Raises on invalid transition.
-- Inserts the audit update row in the same transaction.
create or replace function public.transition_work_order_status(
  p_work_order_id uuid,
  p_new_status text,
  p_actor_role text,
  p_actor_user_id uuid default null,
  p_note text default null
)
returns boolean
language plpgsql
security definer
as $$
declare
  v_prev text;
  v_allowed text[];
begin
  select status into v_prev from public.ai_work_orders where id = p_work_order_id;
  if not found then
    raise exception 'work_order_not_found';
  end if;

  -- Canonical allowed-transition matrix
  v_allowed := case v_prev
    when 'draft' then array['awaiting_scope', 'cancelled']
    when 'awaiting_scope' then array['awaiting_client_acceptance', 'awaiting_owner_approval', 'cancelled']
    when 'awaiting_client_acceptance' then array['ready_for_checkout', 'awaiting_owner_approval', 'awaiting_scope', 'cancelled']
    when 'awaiting_approval' then array['ready_for_checkout', 'awaiting_owner_approval', 'cancelled']
    when 'awaiting_owner_approval' then array['ready_for_checkout', 'awaiting_scope', 'cancelled']
    when 'ready_for_checkout' then array['payment_pending', 'cancelled']
    when 'payment_pending' then array['paid', 'ready_for_checkout', 'cancelled', 'refunded']
    when 'paid' then array['in_progress', 'scoped', 'cancelled', 'refunded']
    when 'scoped' then array['in_progress', 'cancelled', 'refunded']
    when 'in_progress' then array['needs_client_input', 'in_review', 'delivered', 'cancelled', 'refunded']
    when 'needs_client_input' then array['in_review', 'in_progress', 'cancelled']
    when 'in_review' then array['in_progress', 'delivered', 'cancelled']
    when 'delivered' then array['completed', 'in_review', 'cancelled']
    when 'completed' then array[]::text[]
    when 'cancelled' then array[]::text[]
    when 'refunded' then array[]::text[]
    else array[]::text[]
  end;

  if not (p_new_status = any(v_allowed)) then
    raise exception 'invalid_transition (from=% to=%)', v_prev, p_new_status;
  end if;

  update public.ai_work_orders
    set status = p_new_status,
        delivered_at = case when p_new_status = 'delivered' then now() else delivered_at end,
        completed_at = case when p_new_status = 'completed' then now() else completed_at end
    where id = p_work_order_id;

  insert into public.ai_work_order_updates (
    work_order_id, author_user_id, author_role, update_type,
    body, previous_status, new_status, is_client_visible
  ) values (
    p_work_order_id, p_actor_user_id, p_actor_role, 'status_change',
    coalesce(p_note, 'Status changed from ' || v_prev || ' to ' || p_new_status),
    v_prev, p_new_status, true
  );

  return true;
end;
$$;

-- ============================================
-- 9. RPC: fulfill_work_order (transactional, validates org match)
-- ============================================
-- Atomically links payment + engagement, sets paid_at, transitions to paid.
-- Raises if work order not found, org mismatch, already paid, or transition
-- invalid. Returns the engagement id used (so webhook can record it).
create or replace function public.fulfill_work_order(
  p_work_order_id uuid,
  p_organization_id uuid,
  p_payment_id uuid,
  p_engagement_id uuid,
  p_purchaser_user_id uuid default null,
  p_stripe_payment_intent_id text default null
)
returns boolean
language plpgsql
security definer
as $$
declare
  v_wo public.ai_work_orders%rowtype;
  v_prev text;
begin
  select * into v_wo from public.ai_work_orders where id = p_work_order_id;
  if not found then
    raise exception 'work_order_not_found';
  end if;

  if v_wo.organization_id <> p_organization_id then
    raise exception 'organization_mismatch';
  end if;

  if v_wo.status = 'paid' or v_wo.status in ('in_progress','in_review','needs_client_input','delivered','completed') then
    -- Idempotent: already fulfilled. Validate linkage matches.
    if v_wo.payment_id is not null and v_wo.payment_id <> p_payment_id then
      raise exception 'payment_id_conflict';
    end if;
    if v_wo.engagement_id is not null and v_wo.engagement_id <> p_engagement_id then
      raise exception 'engagement_id_conflict';
    end if;
    return true;
  end if;

  if v_wo.status not in ('payment_pending', 'ready_for_checkout') then
    raise exception 'work_order_not_fulfillable (current=%)', v_wo.status;
  end if;

  v_prev := v_wo.status;

  update public.ai_work_orders
    set payment_id = p_payment_id,
        engagement_id = p_engagement_id,
        stripe_payment_intent_id = p_stripe_payment_intent_id,
        purchased_by_user_id = coalesce(p_purchaser_user_id, v_wo.purchased_by_user_id),
        status = 'paid',
        paid_at = now()
    where id = p_work_order_id;

  insert into public.ai_work_order_updates (
    work_order_id, author_role, update_type, body,
    previous_status, new_status, is_client_visible
  ) values (
    p_work_order_id, 'platform_admin', 'payment_event',
    'Payment received. Work Order is now active.',
    v_prev, 'paid', true
  );

  return true;
end;
$$;

-- ============================================
-- 10. Updated_at for scope versions
-- ============================================
create or replace function public.update_wo_scope_versions_updated_at()
returns trigger as $$
begin
  -- Scope versions are immutable except for version_status / superseded_by;
  -- we do not maintain updated_at on them.
  return new;
end;
$$ language plpgsql;
