-- Migration: Commercial operations tables
-- Tables for payments, webhook idempotency, advisor questions, agreements, security reviews
-- All tables are RLS-enabled with organization_id for tenant isolation

-- ============================================
-- PAYMENTS
-- ============================================
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  engagement_id uuid references public.engagements(id),
  offer_key text not null,
  stripe_payment_intent_id text,
  stripe_charge_id text,
  stripe_subscription_id text,
  amount_cents integer not null,
  currency text not null default 'usd',
  status text not null default 'pending'
    check (status in ('pending', 'succeeded', 'failed', 'refunded', 'partially_refunded', 'cancelled')),
  type text not null
    check (type in ('subscription', 'one_time')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_payments_org on public.payments(organization_id);
create index if not exists idx_payments_stripe_pi on public.payments(stripe_payment_intent_id);
create index if not exists idx_payments_stripe_sub on public.payments(stripe_subscription_id);
create index if not exists idx_payments_engagement on public.payments(engagement_id);

-- ============================================
-- WEBHOOK IDEMPOTENCY
-- ============================================
create table if not exists public.webhook_idempotency (
  id uuid primary key default gen_random_uuid(),
  event_id text not null unique,
  event_type text,
  processed_at timestamptz not null default now()
);

create index if not exists idx_webhook_idempotency_event on public.webhook_idempotency(event_id);

-- ============================================
-- ADVISOR QUESTIONS
-- ============================================
create table if not exists public.advisor_questions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  submitted_by uuid not null references auth.users(id),
  billing_period_key text not null,
  subject text not null,
  question text not null,
  context jsonb,
  status text not null default 'submitted'
    check (status in ('submitted', 'under_review', 'answered', 'closed')),
  advisor_response text,
  responded_at timestamptz,
  responded_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_advisor_questions_org on public.advisor_questions(organization_id);
create index if not exists idx_advisor_questions_org_period on public.advisor_questions(organization_id, billing_period_key);
create index if not exists idx_advisor_questions_status on public.advisor_questions(status);

-- ============================================
-- AGREEMENTS
-- ============================================
create table if not exists public.agreements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  engagement_id uuid references public.engagements(id),
  document_type text not null
    check (document_type in ('order', 'msa', 'sow', 'security_authorization', 'change_order')),
  template_version text,
  agreement_version integer not null default 1,
  status text not null default 'not_required'
    check (status in ('not_required', 'draft', 'sent', 'accepted', 'signed', 'superseded', 'declined')),
  provider text default 'manual',
  provider_document_id text,
  final_file_reference text,
  sent_at timestamptz,
  accepted_at timestamptz,
  accepted_by uuid references auth.users(id),
  signed_at timestamptz,
  signed_by uuid references auth.users(id),
  superseded_at timestamptz,
  superseded_by uuid references public.agreements(id),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_agreements_org on public.agreements(organization_id);
create index if not exists idx_agreements_engagement on public.agreements(engagement_id);
create index if not exists idx_agreements_status on public.agreements(status);
create index if not exists idx_agreements_type on public.agreements(document_type);

-- ============================================
-- AGREEMENT TEMPLATES
-- ============================================
create table if not exists public.agreement_templates (
  id uuid primary key default gen_random_uuid(),
  template_key text not null unique,
  document_type text not null
    check (document_type in ('order', 'msa', 'sow', 'security_authorization', 'change_order')),
  version text not null,
  name text not null,
  description text,
  body_markdown text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_agreement_templates_key on public.agreement_templates(template_key);

-- ============================================
-- SECURITY REVIEW AUTHORIZATIONS
-- ============================================
create table if not exists public.security_review_authorizations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  engagement_id uuid not null references public.engagements(id),
  authorization_key text not null default gen_random_uuid(),
  status text not null default 'pending'
    check (status in ('pending', 'authorized', 'revoked', 'expired')),
  scope_description text not null,
  in_scope_systems text[] not null default '{}',
  out_of_scope_systems text[] not null default '{}',
  testing_methods text[] not null default '{}',
  authorized_by uuid references auth.users(id),
  authorized_at timestamptz,
  revoked_at timestamptz,
  revoked_reason text,
  expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_security_auth_org on public.security_review_authorizations(organization_id);
create index if not exists idx_security_auth_engagement on public.security_review_authorizations(engagement_id);
create index if not exists idx_security_auth_status on public.security_review_authorizations(status);

-- ============================================
-- SECURITY FINDINGS
-- ============================================
create table if not exists public.security_findings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  engagement_id uuid not null references public.engagements(id),
  title text not null,
  description text not null,
  severity text not null
    check (severity in ('critical', 'high', 'medium', 'low', 'informational')),
  category text,
  affected_component text,
  evidence_reference text,
  remediation text,
  status text not null default 'finding_open'
    check (status in (
      'finding_open', 'fix_reported', 'ready_for_retest',
      'retest_verified', 'additional_work_recommended',
      'risk_accepted', 'not_retested'
    )),
  retested_at timestamptz,
  retested_by uuid references auth.users(id),
  retest_notes text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_security_findings_org on public.security_findings(organization_id);
create index if not exists idx_security_findings_engagement on public.security_findings(engagement_id);
create index if not exists idx_security_findings_status on public.security_findings(status);
create index if not exists idx_security_findings_severity on public.security_findings(severity);

-- ============================================
-- SECURITY REVIEW RECORDS (buyer-shareable)
-- ============================================
create table if not exists public.security_review_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  engagement_id uuid not null references public.engagements(id),
  title text not null,
  summary text,
  scope_description text,
  methodologies text[],
  finding_count integer not null default 0,
  critical_count integer not null default 0,
  high_count integer not null default 0,
  medium_count integer not null default 0,
  low_count integer not null default 0,
  informational_count integer not null default 0,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  storage_path text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_security_records_org on public.security_review_records(organization_id);
create index if not exists idx_security_records_engagement on public.security_review_records(engagement_id);

-- ============================================
-- SECURITY ACCESS CHECKLISTS
-- ============================================
create table if not exists public.security_access_checklists (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  engagement_id uuid not null references public.engagements(id),
  checklist_item text not null,
  item_type text not null
    check (item_type in ('credential', 'access', 'document', 'configuration', 'other')),
  status text not null default 'pending'
    check (status in ('pending', 'provided', 'not_applicable', 'blocked')),
  provided_at timestamptz,
  provided_by uuid references auth.users(id),
  notes text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_security_checklist_org on public.security_access_checklists(organization_id);
create index if not exists idx_security_checklist_engagement on public.security_access_checklists(engagement_id);

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  tbl text;
begin
  for tbl in
    select unnest(array['payments', 'advisor_questions', 'agreements', 'agreement_templates',
                        'security_review_authorizations', 'security_findings',
                        'security_review_records', 'security_access_checklists'])
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
-- RLS POLICIES
-- ============================================

-- PAYMENTS
alter table public.payments enable row level security;

drop policy if exists "payments_select_org_member" on public.payments;
create policy "payments_select_org_member" on public.payments
  for select using (
    private.is_org_member(organization_id) or private.is_platform_admin()
  );

drop policy if exists "payments_write_org_admin" on public.payments;
create policy "payments_write_org_admin" on public.payments
  for all using (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  ) with check (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  );

-- WEBHOOK IDEMPOTENCY (service-role only, no client access)
alter table public.webhook_idempotency enable row level security;
-- No policies: only service role can access (bypasses RLS)

-- ADVISOR QUESTIONS
alter table public.advisor_questions enable row level security;

drop policy if exists "advisor_questions_select_org_member" on public.advisor_questions;
create policy "advisor_questions_select_org_member" on public.advisor_questions
  for select using (
    private.is_org_member(organization_id) or private.is_platform_admin()
  );

drop policy if exists "advisor_questions_insert_org_member" on public.advisor_questions;
create policy "advisor_questions_insert_org_member" on public.advisor_questions
  for insert with check (
    private.is_org_member(organization_id)
    and auth.uid() = submitted_by
    or private.is_platform_admin()
  );

drop policy if exists "advisor_questions_update_org_admin" on public.advisor_questions;
create policy "advisor_questions_update_org_admin" on public.advisor_questions
  for update using (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  ) with check (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  );

-- AGREEMENTS
alter table public.agreements enable row level security;

drop policy if exists "agreements_select_org_member" on public.agreements;
create policy "agreements_select_org_member" on public.agreements
  for select using (
    private.is_org_member(organization_id) or private.is_platform_admin()
  );

drop policy if exists "agreements_write_org_admin" on public.agreements;
create policy "agreements_write_org_admin" on public.agreements
  for all using (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  ) with check (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  );

-- AGREEMENT TEMPLATES (platform-global, read-only for authenticated)
alter table public.agreement_templates enable row level security;

drop policy if exists "agreement_templates_select_all" on public.agreement_templates;
create policy "agreement_templates_select_all" on public.agreement_templates
  for select using (true);

drop policy if exists "agreement_templates_write_admin" on public.agreement_templates;
create policy "agreement_templates_write_admin" on public.agreement_templates
  for all using (private.is_platform_admin())
  with check (private.is_platform_admin());

-- SECURITY REVIEW AUTHORIZATIONS
alter table public.security_review_authorizations enable row level security;

drop policy if exists "security_auth_select_org_member" on public.security_review_authorizations;
create policy "security_auth_select_org_member" on public.security_review_authorizations
  for select using (
    private.is_org_member(organization_id) or private.is_platform_admin()
  );

drop policy if exists "security_auth_write_org_admin" on public.security_review_authorizations;
create policy "security_auth_write_org_admin" on public.security_review_authorizations
  for all using (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  ) with check (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  );

-- SECURITY FINDINGS
alter table public.security_findings enable row level security;

drop policy if exists "security_findings_select_org_member" on public.security_findings;
create policy "security_findings_select_org_member" on public.security_findings
  for select using (
    private.is_org_member(organization_id) or private.is_platform_admin()
  );

drop policy if exists "security_findings_write_org_admin" on public.security_findings;
create policy "security_findings_write_org_admin" on public.security_findings
  for all using (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  ) with check (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  );

-- SECURITY REVIEW RECORDS
alter table public.security_review_records enable row level security;

drop policy if exists "security_records_select_org_member" on public.security_review_records;
create policy "security_records_select_org_member" on public.security_review_records
  for select using (
    private.is_org_member(organization_id) or private.is_platform_admin()
  );

drop policy if exists "security_records_write_org_admin" on public.security_review_records;
create policy "security_records_write_org_admin" on public.security_review_records
  for all using (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  ) with check (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  );

-- SECURITY ACCESS CHECKLISTS
alter table public.security_access_checklists enable row level security;

drop policy if exists "security_checklist_select_org_member" on public.security_access_checklists;
create policy "security_checklist_select_org_member" on public.security_access_checklists
  for select using (
    private.is_org_member(organization_id) or private.is_platform_admin()
  );

drop policy if exists "security_checklist_write_org_admin" on public.security_access_checklists;
create policy "security_checklist_write_org_admin" on public.security_access_checklists
  for all using (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  ) with check (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  );

-- ============================================
-- SEED OFFERINGS (if not exists)
-- ============================================
insert into public.offerings (offering_key, name, offering_kind, status)
select 'managed_voice', 'Managed AI Voice Deployment', 'service', 'active'
where not exists (select 1 from public.offerings where offering_key = 'managed_voice');

insert into public.offerings (offering_key, name, offering_kind, status)
select 'ai_security_compliance', 'AI Security & Compliance Review', 'service', 'active'
where not exists (select 1 from public.offerings where offering_key = 'ai_security_compliance');

insert into public.offerings (offering_key, name, offering_kind, status)
select 'saas_security_review', 'SaaS & AI Security Review', 'service', 'active'
where not exists (select 1 from public.offerings where offering_key = 'saas_security_review');

-- ============================================
-- SEED AGREEMENT TEMPLATES
-- ============================================
insert into public.agreement_templates (template_key, document_type, version, name, description, body_markdown)
select 'order_form_v1', 'order', '1.0', 'Order Form', 'Standard order form for commercial offers',
'# Order Form

**Client:** [Organization Name]
**Offer:** [Offer Name]
**Date:** [Date]

## Scope
[Scope description]

## Price
[Price and billing terms]

## Terms
This order is subject to the Master Services Agreement (MSA) between the parties.

## Acceptance
By signing below, the client accepts the scope and price outlined above.'
where not exists (select 1 from public.agreement_templates where template_key = 'order_form_v1');

insert into public.agreement_templates (template_key, document_type, version, name, description, body_markdown)
select 'msa_v1', 'msa', '1.0', 'Master Services Agreement', 'Standard MSA for professional services',
'# Master Services Agreement

This Master Services Agreement (MSA) governs the professional services relationship between SubodhKC and the Client.

## 1. Services
SubodhKC will provide the services described in applicable Statements of Work (SOWs).

## 2. Fees
Client will pay the fees set forth in each SOW or Order Form.

## 3. Confidentiality
Each party will protect the other party''s confidential information.

## 4. Intellectual Property
Deliverables created specifically for Client are transferred upon full payment.

## 5. Term and Termination
Either party may terminate with 30 days written notice.

## 6. Limitation of Liability
Total liability is limited to fees paid in the preceding 12 months.

## 7. Governing Law
This agreement is governed by applicable state and federal law.'
where not exists (select 1 from public.agreement_templates where template_key = 'msa_v1');

insert into public.agreement_templates (template_key, document_type, version, name, description, body_markdown)
select 'sow_v1', 'sow', '1.0', 'Statement of Work', 'Standard SOW template',
'# Statement of Work

**Project:** [Project Title]
**Client:** [Organization Name]
**Date:** [Date]

## 1. Objectives
[Project objectives]

## 2. Scope
[Detailed scope]

## 3. Deliverables
[Deliverables list]

## 4. Timeline
[Timeline and milestones]

## 5. Client Responsibilities
[What the client must provide]

## 6. Fees
[Fee structure]

## 7. Acceptance Criteria
[How deliverables will be accepted]'
where not exists (select 1 from public.agreement_templates where template_key = 'sow_v1');

insert into public.agreement_templates (template_key, document_type, version, name, description, body_markdown)
select 'security_authorization_v1', 'security_authorization', '1.0', 'Security Review Authorization',
'Authorization for security testing and review',
'# Security Review Authorization

**Client:** [Organization Name]
**Date:** [Date]

## Authorization
The Client authorizes SubodhKC to perform security review activities as described below.

## Scope
[System and application scope]

## Testing Methods
[Permitted testing methods]

## Out of Scope
[Explicitly excluded systems and methods]

## Access Requirements
[Credentials, access, and documentation required]

## Data Handling
[How findings and evidence will be handled]

## Duration
[Authorization validity period]

## Revocation
Client may revoke this authorization at any time with written notice.'
where not exists (select 1 from public.agreement_templates where template_key = 'security_authorization_v1');
