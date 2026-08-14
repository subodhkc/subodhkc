-- Migration: Advisor Desk light-touch model
-- 1. Add request classification, effort class, and routing fields to advisor_questions
-- 2. Update status check constraint to support 'deeper_work_recommended'
-- 3. Deprecate consume_advisor_question_slot (keep function but mark deprecated)
-- 4. Add internal abuse-tracking columns

-- ============================================
-- 1. ADD CLASSIFICATION & ROUTING COLUMNS
-- ============================================

alter table public.advisor_questions
  add column if not exists request_category text,
  add column if not exists effort_class text
    check (effort_class in ('BRIEF', 'DEEPER_REVIEW', 'SCOPED_WORK')),
  add column if not exists recommended_next_step text,
  add column if not exists recommended_offer_key text;

-- Index for filtering by category/effort
create index if not exists idx_advisor_questions_category on public.advisor_questions(request_category);
create index if not exists idx_advisor_questions_effort on public.advisor_questions(effort_class);

-- ============================================
-- 2. UPDATE STATUS CHECK CONSTRAINT
-- ============================================
-- Add 'deeper_work_recommended' to allowed statuses

alter table public.advisor_questions
  drop constraint if exists advisor_questions_status_check;

alter table public.advisor_questions
  add constraint advisor_questions_status_check
  check (status in ('submitted', 'under_review', 'answered', 'deeper_work_recommended', 'closed'));

-- ============================================
-- 3. DEPRECATE consume_advisor_question_slot
-- ============================================
-- The function is kept for historical reference but should no longer be called.
-- New submissions go through direct insert without allowance enforcement.

comment on function public.consume_advisor_question_slot is 'DEPRECATED: Light-touch model replaced hard quota. Kept for historical reference only. Do not call.';

-- ============================================
-- 4. INTERNAL ABUSE TRACKING
-- ============================================
-- Track signals for reasonable-use monitoring without exposing to customers.
-- These are internal-only columns, never returned to the client.

alter table public.advisor_questions
  add column if not exists internal_effort_notes text,
  add column if not exists internal_abuse_flags jsonb default '{}'::jsonb;

-- ============================================
-- 5. MEMBER PRICING ARCHITECTURE
-- ============================================
-- Support recording member pricing adjustments on future quotes/SOWs.
-- Does not automatically discount anything.

create table if not exists public.member_pricing_adjustments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  offer_key text not null,
  billing_unit text not null default 'fixed'
    check (billing_unit in ('fixed', 'hourly')),
  standard_price_cents integer not null,
  member_adjustment_cents integer not null default 0,
  final_price_cents integer not null,
  hourly_rate_cents integer,
  estimated_hours integer,
  reason text,
  created_at timestamptz not null default now(),
  constraint valid_final_price check (final_price_cents = standard_price_cents + member_adjustment_cents),
  constraint valid_hourly_fields check (
    (billing_unit = 'hourly' and hourly_rate_cents is not null and hourly_rate_cents > 0)
    or (billing_unit = 'fixed' and hourly_rate_cents is null)
  )
);

create index if not exists idx_member_pricing_org on public.member_pricing_adjustments(organization_id);
create index if not exists idx_member_pricing_offer on public.member_pricing_adjustments(offer_key);

alter table public.member_pricing_adjustments enable row level security;

drop policy if exists "member_pricing_select_org_admin" on public.member_pricing_adjustments;
create policy "member_pricing_select_org_admin" on public.member_pricing_adjustments
  for select using (
    private.is_platform_admin()
  );

drop policy if exists "member_pricing_insert_platform_admin" on public.member_pricing_adjustments;
create policy "member_pricing_insert_platform_admin" on public.member_pricing_adjustments
  for insert with check (
    private.is_platform_admin()
  );

drop policy if exists "member_pricing_update_platform_admin" on public.member_pricing_adjustments;
create policy "member_pricing_update_platform_admin" on public.member_pricing_adjustments
  for update using (
    private.is_platform_admin()
  );

-- Grant execute to service role
grant select, insert, update on public.member_pricing_adjustments to service_role;
