-- 0029_ai_work_orders.sql
-- AI Work Orders: repeatable bounded units of paid work.
-- Work Orders are transactions, NOT permanent organization entitlements.
-- One organization can purchase Work Order 001, 002, 003... without overwriting previous ones.

-- ============================================
-- ai_work_orders table
-- ============================================
create table if not exists public.ai_work_orders (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  purchased_by_user_id uuid references auth.users(id),
  requested_by_user_id uuid references auth.users(id),

  -- Compatibility links
  source_offer_key text not null default 'ai_automation_blueprint',
  legacy_qualification_id uuid,
  payment_id uuid,
  engagement_id uuid references public.engagements(id) on delete set null,

  -- Stripe linkage
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,

  -- Human-readable stable identifier (WO-2026-0001)
  work_order_number text unique not null,

  -- Work classification
  title text not null,
  work_type text not null default 'other'
    check (work_type in ('research', 'analysis', 'design', 'build', 'configuration',
                         'integration', 'evaluation', 'investigation', 'workflow',
                         'vendor_review', 'architecture', 'other')),
  desired_outcome text,

  -- Scope
  scope_included text,
  scope_excluded text,
  required_inputs text,
  deliverable_description text,

  -- Scope status (separate from work status)
  scope_status text not null default 'draft'
    check (scope_status in ('draft', 'needs_review', 'standard',
                            'custom_scope_required', 'accepted')),

  -- Work status
  status text not null default 'draft'
    check (status in ('draft', 'awaiting_scope', 'awaiting_approval', 'ready_for_checkout',
                      'payment_pending', 'paid', 'scoped', 'in_progress', 'needs_client_input',
                      'in_review', 'delivered', 'completed', 'cancelled', 'refunded')),

  -- Commercial
  standard_price_cents integer,
  currency text not null default 'USD',

  -- Timing
  target_date date,
  scope_accepted_at timestamptz,
  scope_accepted_by uuid references auth.users(id),
  delivered_at timestamptz,
  completed_at timestamptz,

  -- Metadata
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_ai_work_orders_org on public.ai_work_orders(organization_id);
create index if not exists idx_ai_work_orders_engagement on public.ai_work_orders(engagement_id);
create index if not exists idx_ai_work_orders_status on public.ai_work_orders(status);
create index if not exists idx_ai_work_orders_stripe_session on public.ai_work_orders(stripe_checkout_session_id) where stripe_checkout_session_id is not null;
create index if not exists idx_ai_work_orders_created on public.ai_work_orders(created_at desc);

-- ============================================
-- ai_work_order_scope_acceptances table
-- ============================================
-- Each Work Order has its own immutable accepted scope/order record.
-- This is separate from the org-level generic agreement.
create table if not exists public.ai_work_order_scope_acceptances (
  id uuid primary key default gen_random_uuid(),
  work_order_id uuid not null references public.ai_work_orders(id) on delete cascade,
  scope_version integer not null default 1,
  rendered_scope_text text,
  rendered_scope_json jsonb,
  document_hash text not null,
  accepted_by uuid not null references auth.users(id),
  accepted_at timestamptz not null default now(),
  price_cents integer not null,
  currency text not null default 'USD',
  created_at timestamptz not null default now()
);

create index if not exists idx_wo_scope_acceptances_wo on public.ai_work_order_scope_acceptances(work_order_id);

-- ============================================
-- ai_work_order_updates table
-- ============================================
-- Chronological execution updates for each Work Order.
create table if not exists public.ai_work_order_updates (
  id uuid primary key default gen_random_uuid(),
  work_order_id uuid not null references public.ai_work_orders(id) on delete cascade,
  author_user_id uuid references auth.users(id),
  author_role text not null default 'client'
    check (author_role in ('client', 'advisor', 'platform_admin')),
  update_type text not null default 'status_change'
    check (update_type in ('status_change', 'note', 'client_input', 'advisor_response',
                           'artifact', 'scope_change', 'payment_event')),
  body text,
  previous_status text,
  new_status text,
  is_client_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_wo_updates_wo on public.ai_work_order_updates(work_order_id, created_at desc);

-- ============================================
-- Sequence for work_order_number (WO-YYYY-NNNN)
-- ============================================
create sequence if not exists public.ai_work_order_seq start 1;

-- Function to generate next work order number
create or replace function public.generate_work_order_number()
returns text as $$
declare
  next_val integer;
  year_val text;
begin
  next_val := nextval('public.ai_work_order_seq');
  year_val := extract(year from now())::text;
  return 'WO-' || year_val || '-' || lpad(next_val::text, 4, '0');
end;
$$ language plpgsql security definer;

-- ============================================
-- RLS Policies
-- ============================================
alter table public.ai_work_orders enable row level security;

-- Select: org members can read their org's work orders
create policy "wo_select_org_member" on public.ai_work_orders
  for select using (
    private.is_org_member(organization_id) or private.is_platform_admin()
  );

-- Insert: org owner/admin or platform admin (Stripe fulfillment uses service role)
create policy "wo_insert_org_admin" on public.ai_work_orders
  for insert with check (
    private.has_org_role(organization_id, array['owner', 'admin']) or
    private.is_platform_admin()
  );

-- Update: org owner/admin or platform admin
create policy "wo_update_org_admin" on public.ai_work_orders
  for update using (
    private.has_org_role(organization_id, array['owner', 'admin']) or
    private.is_platform_admin()
  ) with check (
    private.has_org_role(organization_id, array['owner', 'admin']) or
    private.is_platform_admin()
  );

-- Scope acceptances
alter table public.ai_work_order_scope_acceptances enable row level security;

create policy "wo_scope_select_org_member" on public.ai_work_order_scope_acceptances
  for select using (
    exists (
      select 1 from public.ai_work_orders wo
      where wo.id = work_order_id
      and (private.is_org_member(wo.organization_id) or private.is_platform_admin())
    )
  );

create policy "wo_scope_insert_org_admin" on public.ai_work_order_scope_acceptances
  for insert with check (
    exists (
      select 1 from public.ai_work_orders wo
      where wo.id = work_order_id
      and (private.has_org_role(wo.organization_id, array['owner', 'admin']) or private.is_platform_admin())
    )
  );

-- Updates
alter table public.ai_work_order_updates enable row level security;

create policy "wo_updates_select_org_member" on public.ai_work_order_updates
  for select using (
    (
      exists (
        select 1 from public.ai_work_orders wo
        where wo.id = work_order_id
        and (private.is_org_member(wo.organization_id) or private.is_platform_admin())
      ) and is_client_visible = true
    )
    or
    (
      exists (
        select 1 from public.ai_work_orders wo
        where wo.id = work_order_id
        and private.is_platform_admin()
      )
    )
  );

create policy "wo_updates_insert_org_member" on public.ai_work_order_updates
  for insert with check (
    exists (
      select 1 from public.ai_work_orders wo
      where wo.id = work_order_id
      and (private.is_org_member(wo.organization_id) or private.is_platform_admin())
    )
  );

-- ============================================
-- Updated_at trigger
-- ============================================
create or replace function public.update_wo_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_ai_work_orders_updated on public.ai_work_orders;
create trigger trg_ai_work_orders_updated
  before update on public.ai_work_orders
  for each row execute function public.update_wo_updated_at();
