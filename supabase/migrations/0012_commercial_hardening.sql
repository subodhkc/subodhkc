-- Migration: Commercial operations hardening
-- 1. Atomic advisor question consumption (concurrency-safe)
-- 2. Blueprint qualification persistence
-- 3. Security scope requests
-- 4. Security coverage areas
-- 5. Finding visibility (is_published + internal_disposition)

-- ============================================
-- 1. ATOMIC ADVISOR QUESTION CONSUMPTION
-- ============================================
-- Postgres function that atomically checks allowance and inserts a question.
-- Uses an advisory lock scoped to the organization to prevent concurrent consumption.

create or replace function public.consume_advisor_question_slot(
  p_org_id uuid,
  p_submitted_by uuid,
  p_billing_period_key text,
  p_allowance integer,
  p_subject text,
  p_question text,
  p_context jsonb
)
returns table (
  id uuid,
  subject text,
  question text,
  status text,
  billing_period_key text,
  created_at timestamptz,
  remaining integer,
  error text
)
language plpgsql
security definer
as $$
declare
  v_used_count integer;
  v_remaining integer;
  v_new_id uuid;
  v_lock_key bigint;
begin
  -- Generate a stable lock key from the org_id + period
  -- Use hashtext to get a bigint, then take abs value
  v_lock_key := abs(hashtext(p_org_id::text || ':' || p_billing_period_key));

  -- Acquire transaction-scoped advisory lock
  -- This prevents two concurrent calls for the same org+period from both passing the check
  perform pg_advisory_xact_lock(v_lock_key);

  -- Count existing non-closed questions for this org + period
  select count(*) into v_used_count
  from public.advisor_questions
  where organization_id = p_org_id
    and billing_period_key = p_billing_period_key
    and status != 'closed';

  -- Check allowance
  if v_used_count >= p_allowance then
    return query select
      null::uuid, null::text, null::text, null::text,
      p_billing_period_key, null::timestamptz,
      0, 'allowance_exceeded';
    return;
  end if;

  -- Insert the question
  insert into public.advisor_questions (
    organization_id, submitted_by, billing_period_key,
    subject, question, context, status
  )
  values (
    p_org_id, p_submitted_by, p_billing_period_key,
    p_subject, p_question, p_context, 'submitted'
  )
  returning id, subject, question, status, billing_period_key, created_at
  into v_new_id, subject, question, status, billing_period_key, created_at;

  v_remaining := p_allowance - v_used_count - 1;

  return query select
    v_new_id, p_subject, p_question, 'submitted'::text,
    p_billing_period_key, created_at,
    v_remaining, null::text;
end;
$$;

-- Grant execute to service role (bypasses RLS)
grant execute on function public.consume_advisor_question_slot to service_role;

-- ============================================
-- 2. BLUEPRINT QUALIFICATIONS
-- ============================================
create table if not exists public.blueprint_qualifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id),
  user_email text not null,
  user_id uuid references auth.users(id),
  business_objective text not null,
  workflow_problem text not null,
  current_process text,
  systems_involved text,
  known_integrations text,
  team_functions text,
  sensitive_data boolean not null default false,
  desired_outcome text,
  timeline text,
  fit_decision text not null default 'standard_blueprint'
    check (fit_decision in ('standard_blueprint', 'expanded_scope_review', 'not_a_fit')),
  advisor_override text,
  override_reason text,
  status text not null default 'qualified'
    check (status in ('qualified', 'checkout_started', 'purchased', 'rejected', 'expired')),
  stripe_session_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_blueprint_qual_org on public.blueprint_qualifications(organization_id);
create index if not exists idx_blueprint_qual_email on public.blueprint_qualifications(user_email);
create index if not exists idx_blueprint_qual_status on public.blueprint_qualifications(status);

-- RLS for blueprint_qualifications
alter table public.blueprint_qualifications enable row level security;

drop policy if exists "blueprint_qual_select_org_member" on public.blueprint_qualifications;
create policy "blueprint_qual_select_org_member" on public.blueprint_qualifications
  for select using (
    private.is_org_member(organization_id) or private.is_platform_admin()
  );

drop policy if exists "blueprint_qual_write_org_admin" on public.blueprint_qualifications;
create policy "blueprint_qual_write_org_admin" on public.blueprint_qualifications
  for all using (
    (organization_id is null and auth.uid() is not null) or
    private.has_org_role(organization_id, array['owner', 'admin']) or
    private.is_platform_admin()
  ) with check (
    (organization_id is null and auth.uid() is not null) or
    private.has_org_role(organization_id, array['owner', 'admin']) or
    private.is_platform_admin()
  );

-- ============================================
-- 3. SECURITY SCOPE REQUESTS
-- ============================================
create table if not exists public.security_scope_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id),
  name text not null,
  email text not null,
  company text not null,
  website text,
  product_name text,
  application_type text,
  tech_stack text,
  multi_tenant boolean,
  role_count integer,
  ai_rag_agent boolean not null default false,
  main_reason text,
  target_timing text,
  source_code_access boolean,
  staging_available boolean,
  status text not null default 'submitted'
    check (status in ('submitted', 'under_review', 'scope_confirmed', 'engagement_created', 'rejected')),
  advisor_notes text,
  proposed_scope text,
  proposed_price_cents integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_security_scope_email on public.security_scope_requests(email);
create index if not exists idx_security_scope_status on public.security_scope_requests(status);

-- RLS: platform admin only (scope requests are pre-engagement, no org yet)
alter table public.security_scope_requests enable row level security;

drop policy if exists "security_scope_select_admin" on public.security_scope_requests;
create policy "security_scope_select_admin" on public.security_scope_requests
  for select using (private.is_platform_admin());

drop policy if exists "security_scope_write_admin" on public.security_scope_requests;
create policy "security_scope_write_admin" on public.security_scope_requests
  for all using (private.is_platform_admin())
  with check (private.is_platform_admin());

-- Allow public insert (no auth required) via service role only
-- The API route uses service client to insert

-- ============================================
-- 4. SECURITY COVERAGE AREAS
-- ============================================
create table if not exists public.security_coverage_areas (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  engagement_id uuid not null references public.engagements(id),
  area_key text not null,
  area_label text not null,
  status text not null default 'pending'
    check (status in ('pending', 'reviewed', 'verified', 'improvement_identified', 'needs_evidence', 'not_applicable', 'out_of_scope')),
  notes text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_security_coverage_engagement on public.security_coverage_areas(engagement_id);
create index if not exists idx_security_coverage_org on public.security_coverage_areas(organization_id);

-- RLS
alter table public.security_coverage_areas enable row level security;

drop policy if exists "security_coverage_select_org_member" on public.security_coverage_areas;
create policy "security_coverage_select_org_member" on public.security_coverage_areas
  for select using (
    private.is_org_member(organization_id) or private.is_platform_admin()
  );

drop policy if exists "security_coverage_write_org_admin" on public.security_coverage_areas;
create policy "security_coverage_write_org_admin" on public.security_coverage_areas
  for all using (
    private.has_org_role(organization_id, array['owner', 'admin']) or
    private.is_platform_admin()
  ) with check (
    private.has_org_role(organization_id, array['owner', 'admin']) or
    private.is_platform_admin()
  );

-- ============================================
-- 5. SECURITY FINDINGS ENHANCEMENT
-- ============================================
-- Add internal disposition and publication flag
alter table public.security_findings
  add column if not exists internal_disposition text default 'confirmed'
    check (internal_disposition in ('confirmed', 'duplicate', 'false_positive', 'informational', 'accepted_as_observation', 'requires_further_review'));

alter table public.security_findings
  add column if not exists is_published boolean not null default false;

alter table public.security_findings
  add column if not exists framework_mappings jsonb not null default '{}'::jsonb;

alter table public.security_findings
  add column if not exists retest_evidence_reference text;

-- Update RLS: org members see only published findings
-- Platform admins see all
drop policy if exists "security_findings_select_org_member" on public.security_findings;
create policy "security_findings_select_org_member" on public.security_findings
  for select using (
    (is_published = true and private.is_org_member(organization_id))
    or private.is_platform_admin()
  );

-- Only platform admins can write findings (advisor creates them)
drop policy if exists "security_findings_write_org_admin" on public.security_findings;
create policy "security_findings_write_org_admin" on public.security_findings
  for all using (
    private.is_platform_admin()
  ) with check (
    private.is_platform_admin()
  );

-- Allow org admins to update finding status (for remediation tracking)
-- but not create or delete findings
drop policy if exists "security_findings_update_org_admin" on public.security_findings;
create policy "security_findings_update_org_admin" on public.security_findings
  for update using (
    private.has_org_role(organization_id, array['owner', 'admin']) or
    private.is_platform_admin()
  ) with check (
    private.has_org_role(organization_id, array['owner', 'admin']) or
    private.is_platform_admin()
  );

-- ============================================
-- 6. UPDATED_AT TRIGGERS FOR NEW TABLES
-- ============================================
do $$
declare
  tbl text;
begin
  for tbl in
    select unnest(array['blueprint_qualifications', 'security_scope_requests', 'security_coverage_areas'])
  loop
    execute format(
      'drop trigger if exists trg_%s_updated on public.%s;
       create trigger trg_%s_updated before update on public.%s
       for each row execute function public.update_updated_at();',
      tbl, tbl, tbl, tbl
    );
  end loop;
end $$;

-- ============================================
-- 7. SEED COVERAGE AREA DEFINITIONS
-- ============================================
-- These are the standard 11 coverage areas for security reviews
-- They get created per-engagement when a security engagement is activated

-- ============================================
-- 8. ADD DOCUMENT_HASH TO AGREEMENTS
-- ============================================
alter table public.agreements
  add column if not exists document_hash text;
