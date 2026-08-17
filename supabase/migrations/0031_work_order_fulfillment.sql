-- 0031_work_order_fulfillment.sql
-- Fulfillment operations: deliverables, split work orders, owner approval,
-- scope composer fields, advisor execution support.

-- ============================================
-- 1. Add split/parent columns to ai_work_orders
-- ============================================
alter table public.ai_work_orders
  add column if not exists parent_work_order_id uuid references public.ai_work_orders(id) on delete set null,
  add column if not exists source_request_id uuid,
  add column if not exists source_request_type text
    check (source_request_type in ('advisor_question', 'fractional_intake', 'manual'));

create index if not exists idx_ai_work_orders_parent on public.ai_work_orders(parent_work_order_id) where parent_work_order_id is not null;
create index if not exists idx_ai_work_orders_source_request on public.ai_work_orders(source_request_id) where source_request_id is not null;

-- ============================================
-- 2. Add 'awaiting_owner_approval' to status check constraint
-- ============================================
-- Non-purchasing member requests route here for owner/admin approval before checkout.
alter table public.ai_work_orders drop constraint if exists ai_work_orders_status_check;
alter table public.ai_work_orders add constraint ai_work_orders_status_check
  check (status in ('draft', 'awaiting_scope', 'awaiting_approval', 'awaiting_owner_approval',
                    'ready_for_checkout', 'payment_pending', 'paid', 'scoped', 'in_progress',
                    'needs_client_input', 'in_review', 'delivered', 'completed',
                    'cancelled', 'refunded'));

-- ============================================
-- 3. Add scope composer fields to ai_work_orders
-- ============================================
-- These allow the advisor to compose/edit custom scope before sending to client.
alter table public.ai_work_orders
  add column if not exists scope_title text,
  add column if not exists scope_price_cents integer,
  add column if not exists scope_target_timing text,
  add column if not exists scope_composed_by uuid references auth.users(id),
  add column if not exists scope_composed_at timestamptz;

-- ============================================
-- 4. ai_work_order_deliverables table
-- ============================================
-- Artifacts produced during Work Order execution.
create table if not exists public.ai_work_order_deliverables (
  id uuid primary key default gen_random_uuid(),
  work_order_id uuid not null references public.ai_work_orders(id) on delete cascade,
  title text not null,
  description text,
  artifact_type text not null default 'document'
    check (artifact_type in ('document', 'memo', 'brief', 'diagram', 'report',
                             'repository', 'code', 'configuration', 'specification',
                             'evaluation', 'pdf', 'link', 'other')),
  artifact_url text,
  artifact_metadata jsonb not null default '{}'::jsonb,
  is_client_visible boolean not null default true,
  published_by uuid references auth.users(id),
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_wo_deliverables_wo on public.ai_work_order_deliverables(work_order_id, created_at desc);

-- RLS for deliverables
alter table public.ai_work_order_deliverables enable row level security;

-- Select: org members see client-visible deliverables; platform_admin sees all
create policy "wo_deliverables_select_org_member" on public.ai_work_order_deliverables
  for select using (
    (
      is_client_visible = true and exists (
        select 1 from public.ai_work_orders wo
        where wo.id = work_order_id
        and (private.is_org_member(wo.organization_id) or private.is_platform_admin())
      )
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

-- Insert: platform_admin only (advisor publishes deliverables via service role API)
create policy "wo_deliverables_insert_platform_admin" on public.ai_work_order_deliverables
  for insert with check (
    private.is_platform_admin()
  );

-- Update: platform_admin only
create policy "wo_deliverables_update_platform_admin" on public.ai_work_order_deliverables
  for update using (
    private.is_platform_admin()
  ) with check (
    private.is_platform_admin()
  );

-- ============================================
-- 5. Add 'deliverable_published' and 'client_input_requested' to update_type
-- ============================================
alter table public.ai_work_order_updates drop constraint if exists ai_work_order_updates_update_type_check;
alter table public.ai_work_order_updates add constraint ai_work_order_updates_update_type_check
  check (update_type in ('status_change', 'note', 'client_input', 'advisor_response',
                         'artifact', 'scope_change', 'payment_event',
                         'deliverable_published', 'client_input_requested',
                         'owner_approval_requested', 'split'));

-- ============================================
-- 6. Add 'advisor_operator' to author_role check
-- ============================================
alter table public.ai_work_order_updates drop constraint if exists ai_work_order_updates_author_role_check;
alter table public.ai_work_order_updates add constraint ai_work_order_updates_author_role_check
  check (author_role in ('client', 'advisor', 'platform_admin', 'advisor_operator'));

-- Update the enforce trigger to allow advisor_operator only from service role
create or replace function public.enforce_work_order_update_author()
returns trigger as $$
begin
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

-- ============================================
-- 7. Add scope_composed_by trigger to set on update
-- ============================================
-- This is handled at API layer, not via trigger, to keep it simple.

-- ============================================
-- 8. Updated_at trigger for deliverables
-- ============================================
create or replace function public.update_wo_deliverables_updated_at()
returns trigger as $$
begin
  -- Deliverables are immutable once published; no updated_at needed
  return new;
end;
$$ language plpgsql;
