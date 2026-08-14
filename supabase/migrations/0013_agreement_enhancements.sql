-- Migration: Add template_key and denormalized fields to agreements table
-- This allows agreements to be linked to templates by key and store
-- the rendered content at creation time.

alter table public.agreements
  add column if not exists template_key text;

alter table public.agreements
  add column if not exists title text;

alter table public.agreements
  add column if not exists body_text text;

-- Backfill template_key from agreement_templates join if possible
-- (best-effort, won't work for all rows but that's OK for new tables)

-- Add status value 'pending' to the check constraint
-- The existing check allows: not_required, draft, sent, accepted, signed, superseded, declined
-- We need 'pending' for the new flow
alter table public.agreements drop constraint if exists agreements_status_check;
alter table public.agreements
  add constraint agreements_status_check check (
    status in ('not_required', 'draft', 'pending', 'sent', 'accepted', 'signed', 'superseded', 'declined')
  );

-- Add index on template_key
create index if not exists idx_agreements_template_key on public.agreements(template_key);

-- Update agreement_templates to use 'status' column instead of 'is_active'
-- (both may coexist for backward compat)
alter table public.agreement_templates
  add column if not exists status text not null default 'active'
    check (status in ('active', 'inactive', 'deprecated'));

-- Backfill status from is_active for existing rows
update public.agreement_templates
  set status = case when is_active then 'active' else 'inactive' end
  where status is null;

-- Add index on status
create index if not exists idx_agreement_templates_status on public.agreement_templates(status);
