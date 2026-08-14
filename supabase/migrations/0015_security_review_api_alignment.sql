-- Migration: Add missing columns to security review tables for API alignment
-- The authorization and checklist tables need additional columns to support
-- the workspace UI and API routes.

-- ============================================
-- SECURITY REVIEW AUTHORIZATIONS
-- ============================================
-- Add detailed_rules column (separate from scope_description)
alter table public.security_review_authorizations
  add column if not exists detailed_rules text;

-- ============================================
-- SECURITY ACCESS CHECKLISTS
-- ============================================
-- Add item_key for machine-readable key
alter table public.security_access_checklists
  add column if not exists item_key text;

-- Add item_label for display label
alter table public.security_access_checklists
  add column if not exists item_label text;

-- Add evidence_reference for storing links to evidence
alter table public.security_access_checklists
  add column if not exists evidence_reference text;

-- Add description for item details
alter table public.security_access_checklists
  add column if not exists description text;

-- Make item_type nullable (some items may not fit a specific type)
alter table public.security_access_checklists
  alter column item_type drop not null;

-- Make checklist_item nullable (item_key + item_label may be used instead)
alter table public.security_access_checklists
  alter column checklist_item drop not null;

-- ============================================
-- SECURITY REVIEW RECORDS
-- ============================================
-- Add completed_at for tracking when review was completed
alter table public.security_review_records
  add column if not exists completed_at timestamptz;

-- Add 'in_progress' and 'completed' to status check constraint
alter table public.security_review_records drop constraint if exists security_review_records_status_check;
alter table public.security_review_records
  add constraint security_review_records_status_check check (
    status in ('draft', 'in_progress', 'published', 'completed', 'archived')
  );

-- ============================================
-- AGREEMENTS: Add FK to agreement_templates
-- ============================================
-- Add foreign key from agreements.template_key to agreement_templates.template_key
-- (template_key was added in migration 0013)
do $$
begin
  -- Check if the FK already exists
  if not exists (
    select 1 from pg_constraint
    where conname = 'agreements_template_key_fkey'
  ) then
    alter table public.agreements
      add constraint agreements_template_key_fkey
      foreign key (template_key) references public.agreement_templates(template_key)
      on delete set null;
  end if;
exception when others then
  -- Ignore if template_key column doesn't exist yet
  null;
end $$;

-- ============================================
-- SEED OFFER-SPECIFIC AGREEMENT TEMPLATES
-- These match the convention ${offerKey}_agreement used by the API routes
-- ============================================
insert into public.agreement_templates (template_key, document_type, version, name, description, body_markdown)
select 'ai_automation_blueprint_agreement', 'order', '1.0', 'AI Automation Blueprint — Order Form',
'Order form and terms for the AI Automation Blueprint service',
'# AI Automation Blueprint — Order Form

**Client:** [Organization Name]
**Service:** AI Automation Blueprint
**Price:** $500 USD (one-time)

## Scope
SubodhKC will analyze one workflow end-to-end and deliver a written recommendation covering:
- Current workflow assessment
- Automation opportunity identification
- What should remain human
- Recommended approach and tools
- Cost and complexity range

## What Is Included
- One workflow evaluation
- Written Blueprint document with recommendation
- One revision cycle

## What Is Not Included
- Implementation or deployment
- Software licensing
- Ongoing support
- Additional workflow analysis

## Payment Terms
Payment is due in full before the engagement begins. The Blueprint is delivered within 5 business days of intake completion.

## Acceptance
By accepting this agreement, the client acknowledges the scope and terms above.'
where not exists (select 1 from public.agreement_templates where template_key = 'ai_automation_blueprint_agreement');

insert into public.agreement_templates (template_key, document_type, version, name, description, body_markdown)
select 'saas_security_review_agreement', 'order', '1.0', 'SaaS & AI Security Review — Order Form',
'Order form and terms for the SaaS & AI Security Review service',
'# SaaS & AI Security Review — Order Form

**Client:** [Organization Name]
**Service:** SaaS & AI Security Review
**Price:** From $950 USD (one-time, scoped per engagement)

## Scope
SubodhKC will conduct a security review of the client''s SaaS application covering:
- Application architecture review
- Authentication and authorization assessment
- Multi-tenant isolation analysis
- AI/RAG security evaluation (if applicable)
- API security review
- Findings report with severity ratings and remediation guidance

## What Is Included
- Scoped security assessment
- Written findings report
- Remediation prioritization
- One retest cycle for verified fixes

## What Is Not Included
- Penetration testing (available as separate engagement)
- Code-level remediation
- Compliance certification
- Ongoing monitoring

## Authorization
Client must provide a signed Security Review Authorization before testing begins.

## Payment Terms
Payment is due per the agreed scope. The review begins after payment and authorization are received.

## Acceptance
By accepting this agreement, the client acknowledges the scope and terms above.'
where not exists (select 1 from public.agreement_templates where template_key = 'saas_security_review_agreement');

insert into public.agreement_templates (template_key, document_type, version, name, description, body_markdown)
select 'ai_security_compliance_agreement', 'order', '1.0', 'AI Security & Compliance Review — Order Form',
'Order form and terms for the AI Security & Compliance Review service',
'# AI Security & Compliance Review — Order Form

**Client:** [Organization Name]
**Service:** AI Security & Compliance Review
**Price:** Custom scoped

## Scope
SubodhKC will conduct a security and compliance review tailored to the client''s AI system, covering:
- AI system architecture review
- Data governance assessment
- Model security evaluation
- Compliance framework mapping
- Risk assessment and mitigation guidance

## Authorization
Client must provide a signed Security Review Authorization before testing begins.

## Acceptance
By accepting this agreement, the client acknowledges the scope and terms above.'
where not exists (select 1 from public.agreement_templates where template_key = 'ai_security_compliance_agreement');

insert into public.agreement_templates (template_key, document_type, version, name, description, body_markdown)
select 'managed_voice_agreement', 'order', '1.0', 'Managed AI Voice Deployment — Order Form',
'Order form and terms for the Managed AI Voice Deployment service',
'# Managed AI Voice Deployment — Order Form

**Client:** [Organization Name]
**Service:** Managed AI Voice Deployment
**Price:** From $499/month

## Scope
SubodhKC will deploy and manage an AI voice agent for the client''s use case, including:
- Voice agent configuration
- Integration with existing systems
- Ongoing monitoring and optimization
- Monthly performance review

## Payment Terms
Monthly subscription billed via Stripe. Cancel with 30 days notice.

## Acceptance
By accepting this agreement, the client acknowledges the scope and terms above.'
where not exists (select 1 from public.agreement_templates where template_key = 'managed_voice_agreement');
