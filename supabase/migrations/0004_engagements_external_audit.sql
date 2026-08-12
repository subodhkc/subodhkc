-- Migration 0004: Engagements, engagement_offerings, external_system_links, audit_events

-- ============================================
-- ENGAGEMENTS (commercial/operational relationships)
-- ============================================
create table if not exists public.engagements (
  id uuid default gen_random_uuid() primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_type text not null
    check (engagement_type in ('project', 'retainer', 'fractional', 'pilot', 'program', 'pro_bono')),
  status text not null default 'active'
    check (status in ('planned', 'active', 'completed', 'cancelled', 'on_hold')),
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_engagements_org on public.engagements(organization_id);
create index if not exists idx_engagements_status on public.engagements(status);
create index if not exists idx_engagements_type on public.engagements(engagement_type);

drop trigger if exists engagements_updated_at on public.engagements;
create trigger engagements_updated_at
  before update on public.engagements
  for each row execute function public.update_updated_at();

-- ============================================
-- ENGAGEMENT_OFFERINGS (M:N engagement <-> offerings)
-- ============================================
create table if not exists public.engagement_offerings (
  id uuid default gen_random_uuid() primary key,
  engagement_id uuid not null references public.engagements(id) on delete cascade,
  offering_id uuid not null references public.offerings(id) on delete restrict,
  created_at timestamptz default now(),
  unique (engagement_id, offering_id)
);

create index if not exists idx_engagement_offerings_eng on public.engagement_offerings(engagement_id);
create index if not exists idx_engagement_offerings_offering on public.engagement_offerings(offering_id);

-- ============================================
-- EXTERNAL_SYSTEM_LINKS (control plane mapping)
-- ============================================
create table if not exists public.external_system_links (
  id uuid default gen_random_uuid() primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  system_key text not null,
  external_object_type text not null default 'tenant',
  external_id text not null,
  status text not null default 'active'
    check (status in ('active', 'inactive', 'error')),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  -- Prevent one external system+id from mapping to multiple organizations
  unique (system_key, external_object_type, external_id)
);

create index if not exists idx_external_links_org on public.external_system_links(organization_id);
create index if not exists idx_external_links_system on public.external_system_links(system_key);
create index if not exists idx_external_links_org_system on public.external_system_links(organization_id, system_key);

-- ============================================
-- AUDIT EVENTS (append-only, immutable)
-- ============================================
create table if not exists public.audit_events (
  id bigint generated always as identity primary key,
  organization_id uuid references public.organizations(id) on delete set null,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_audit_org on public.audit_events(organization_id);
create index if not exists idx_audit_actor on public.audit_events(actor_user_id);
create index if not exists idx_audit_entity on public.audit_events(entity_type, entity_id);
create index if not exists idx_audit_created on public.audit_events(created_at desc);
