-- ============================================
-- SubodhKC Multi-Tenant Schema - Combined Migration
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- Project: shnbyttoswxhfnurdnxo
-- ============================================

-- ============================================
-- File: 0001_profiles_and_trigger.sql
-- ============================================
-- Migration 0001: Profiles table and auth trigger
-- Replaces the old profiles table definition with a clean foundation
-- Additive: uses IF NOT EXISTS, safe against existing data

-- ============================================
-- PROFILES TABLE (1:1 with auth.users)
-- ============================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at trigger
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();


-- ============================================
-- File: 0002_organizations.sql
-- ============================================
-- Migration 0002: Organization tenancy foundation
-- Creates organizations, memberships, invitations, platform_user_roles

-- ============================================
-- ORGANIZATIONS
-- ============================================
create table if not exists public.organizations (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  organization_kind text not null default 'business'
    check (organization_kind in ('business', 'school', 'nonprofit', 'individual', 'internal', 'other')),
  status text not null default 'active'
    check (status in ('active', 'suspended', 'archived')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  archived_at timestamptz
);

create index if not exists idx_organizations_slug on public.organizations(slug);
create index if not exists idx_organizations_status on public.organizations(status);
create index if not exists idx_organizations_kind on public.organizations(organization_kind);

drop trigger if exists organizations_updated_at on public.organizations;
create trigger organizations_updated_at
  before update on public.organizations
  for each row execute function public.update_updated_at();

-- ============================================
-- ORGANIZATION MEMBERSHIPS (M:N users <-> organizations)
-- ============================================
create table if not exists public.organization_memberships (
  id uuid default gen_random_uuid() primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member'
    check (role in ('owner', 'admin', 'member')),
  status text not null default 'active'
    check (status in ('active', 'invited', 'revoked')),
  joined_at timestamptz default now(),
  created_at timestamptz default now(),
  unique (organization_id, user_id)
);

create index if not exists idx_memberships_org on public.organization_memberships(organization_id);
create index if not exists idx_memberships_user on public.organization_memberships(user_id);
create index if not exists idx_memberships_org_user on public.organization_memberships(organization_id, user_id);
create index if not exists idx_memberships_status on public.organization_memberships(status);

-- ============================================
-- ORGANIZATION INVITATIONS
-- ============================================
create table if not exists public.organization_invitations (
  id uuid default gen_random_uuid() primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  email text not null,
  role text not null default 'member'
    check (role in ('owner', 'admin', 'member')),
  token_hash text not null,
  invited_by uuid references auth.users(id) on delete set null,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists idx_invitations_org on public.organization_invitations(organization_id);
create index if not exists idx_invitations_email on public.organization_invitations(email);
create index if not exists idx_invitations_token on public.organization_invitations(token_hash);

-- ============================================
-- PLATFORM USER ROLES (platform-level admin, independent of org membership)
-- ============================================
create table if not exists public.platform_user_roles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null
    check (role in ('platform_admin', 'support')),
  created_at timestamptz default now(),
  unique (user_id, role)
);

create index if not exists idx_platform_roles_user on public.platform_user_roles(user_id);


-- ============================================
-- File: 0003_offerings_entitlements.sql
-- ============================================
-- Migration 0003: Offerings, entitlements, member offering roles

-- ============================================
-- OFFERINGS (stable catalog)
-- ============================================
create table if not exists public.offerings (
  id uuid default gen_random_uuid() primary key,
  offering_key text not null unique,
  name text not null,
  description text,
  offering_kind text not null default 'service'
    check (offering_kind in ('product', 'tool', 'service', 'program', 'external_product')),
  status text not null default 'active'
    check (status in ('active', 'deprecated', 'planned')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_offerings_key on public.offerings(offering_key);
create index if not exists idx_offerings_kind on public.offerings(offering_kind);

drop trigger if exists offerings_updated_at on public.offerings;
create trigger offerings_updated_at
  before update on public.offerings
  for each row execute function public.update_updated_at();

-- Seed stable offering keys
insert into public.offerings (offering_key, name, offering_kind) values
  ('school_pickup', 'School Pickup', 'product'),
  ('six_stones_ai', 'Six Stones AI', 'program'),
  ('advisory', 'Advisory', 'service'),
  ('fractional_ai', 'Fractional AI', 'service'),
  ('rca_tool', 'RCA Tool', 'tool'),
  ('ai_article_generator', 'AI Article Generator', 'tool'),
  ('haiec', 'HAIEC', 'product'),
  ('kestrel', 'Kestrel', 'external_product')
on conflict (offering_key) do nothing;

-- ============================================
-- ORGANIZATION ENTITLEMENTS
-- ============================================
create table if not exists public.organization_entitlements (
  id uuid default gen_random_uuid() primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  offering_id uuid not null references public.offerings(id) on delete restrict,
  status text not null default 'active'
    check (status in ('active', 'suspended', 'expired', 'revoked', 'pending')),
  source_type text not null default 'manual'
    check (source_type in ('manual', 'engagement', 'subscription', 'trial', 'program', 'migration')),
  source_reference text,
  valid_from timestamptz default now(),
  valid_until timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_entitlements_org on public.organization_entitlements(organization_id);
create index if not exists idx_entitlements_offering on public.organization_entitlements(offering_id);
create index if not exists idx_entitlements_org_offering on public.organization_entitlements(organization_id, offering_id);
create index if not exists idx_entitlements_status on public.organization_entitlements(status);

drop trigger if exists entitlements_updated_at on public.organization_entitlements;
create trigger entitlements_updated_at
  before update on public.organization_entitlements
  for each row execute function public.update_updated_at();

-- ============================================
-- MEMBER OFFERING ROLES (product-level authorization)
-- ============================================
create table if not exists public.member_offering_roles (
  id uuid default gen_random_uuid() primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  offering_id uuid not null references public.offerings(id) on delete restrict,
  role text not null default 'user'
    check (role in ('admin', 'user', 'viewer')),
  status text not null default 'active'
    check (status in ('active', 'revoked')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (organization_id, user_id, offering_id)
);

create index if not exists idx_member_offering_org on public.member_offering_roles(organization_id);
create index if not exists idx_member_offering_user on public.member_offering_roles(user_id);
create index if not exists idx_member_offering_offering on public.member_offering_roles(offering_id);
create index if not exists idx_member_offering_org_user_offering on public.member_offering_roles(organization_id, user_id, offering_id);

drop trigger if exists member_offering_roles_updated_at on public.member_offering_roles;
create trigger member_offering_roles_updated_at
  before update on public.member_offering_roles
  for each row execute function public.update_updated_at();


-- ============================================
-- File: 0004_engagements_external_audit.sql
-- ============================================
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


-- ============================================
-- File: 0005_private_helpers.sql
-- ============================================
-- Migration 0005: Private schema with RLS helper functions
-- SECURITY DEFINER functions in a non-exposed schema
-- These are used by RLS policies, not called directly by clients

-- ============================================
-- PRIVATE SCHEMA
-- ============================================
create schema if not exists private;

-- Revoke usage from anon and authenticated by default
revoke usage on schema private from anon, authenticated;

-- ============================================
-- HELPER: is_platform_admin()
-- ============================================
create or replace function private.is_platform_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.platform_user_roles
    where user_id = auth.uid()
      and role = 'platform_admin'
  )
$$;

-- ============================================
-- HELPER: is_org_member(org_id)
-- ============================================
create or replace function private.is_org_member(org_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_memberships
    where organization_id = org_id
      and user_id = auth.uid()
      and status = 'active'
  )
$$;

-- ============================================
-- HELPER: has_org_role(org_id, roles)
-- ============================================
create or replace function private.has_org_role(org_id uuid, roles text[])
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_memberships
    where organization_id = org_id
      and user_id = auth.uid()
      and status = 'active'
      and role = any(roles)
  )
$$;

-- ============================================
-- HELPER: has_offering_access(org_id, offering_key)
-- Checks: active membership + active entitlement + active member_offering_role
-- ============================================
create or replace function private.has_offering_access(org_id uuid, offering_key text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.member_offering_roles mor
    inner join public.offerings o on o.id = mor.offering_id
    inner join public.organization_entitlements oe on oe.organization_id = mor.organization_id
      and oe.offering_id = mor.offering_id
    where mor.organization_id = org_id
      and mor.user_id = auth.uid()
      and mor.status = 'active'
      and o.offering_key = offering_key
      and oe.status = 'active'
      and (oe.valid_until is null or oe.valid_until > now())
  )
$$;

-- ============================================
-- HELPER: has_offering_role(org_id, offering_key, roles)
-- ============================================
create or replace function private.has_offering_role(org_id uuid, offering_key text, roles text[])
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.member_offering_roles mor
    inner join public.offerings o on o.id = mor.offering_id
    where mor.organization_id = org_id
      and mor.user_id = auth.uid()
      and mor.status = 'active'
      and o.offering_key = offering_key
      and mor.role = any(roles)
  )
$$;

-- Grant execute only to authenticated role
grant execute on all functions in schema private to authenticated;


-- ============================================
-- File: 0006_rls_policies.sql
-- ============================================
-- Migration 0006: RLS policies for all foundation tables
-- Uses private schema helper functions for authorization

-- ============================================
-- PROFILES
-- ============================================
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id or private.is_platform_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- ============================================
-- ORGANIZATIONS
-- ============================================
alter table public.organizations enable row level security;

drop policy if exists "org_select_member" on public.organizations;
create policy "org_select_member" on public.organizations
  for select using (
    private.is_org_member(id) or private.is_platform_admin()
  );

drop policy if exists "org_insert_creator" on public.organizations;
create policy "org_insert_creator" on public.organizations
  for insert with check (
    auth.uid() = created_by or private.is_platform_admin()
  );

drop policy if exists "org_update_admin" on public.organizations;
create policy "org_update_admin" on public.organizations
  for update using (
    private.has_org_role(id, array['owner', 'admin']) or private.is_platform_admin()
  ) with check (
    private.has_org_role(id, array['owner', 'admin']) or private.is_platform_admin()
  );

-- No delete policy: organizations are archived, not deleted, via application logic
-- Platform admins can archive by updating status

-- ============================================
-- ORGANIZATION MEMBERSHIPS
-- ============================================
alter table public.organization_memberships enable row level security;

drop policy if exists "membership_select_org_member" on public.organization_memberships;
create policy "membership_select_org_member" on public.organization_memberships
  for select using (
    private.is_org_member(organization_id) or private.is_platform_admin()
  );

drop policy if exists "membership_insert_org_admin" on public.organization_memberships;
create policy "membership_insert_org_admin" on public.organization_memberships
  for insert with check (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  );

drop policy if exists "membership_update_org_admin" on public.organization_memberships;
create policy "membership_update_org_admin" on public.organization_memberships
  for update using (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  ) with check (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  );

drop policy if exists "membership_delete_org_admin" on public.organization_memberships;
create policy "membership_delete_org_admin" on public.organization_memberships
  for delete using (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  );

-- ============================================
-- ORGANIZATION INVITATIONS
-- ============================================
alter table public.organization_invitations enable row level security;

drop policy if exists "invitation_select_org_admin" on public.organization_invitations;
create policy "invitation_select_org_admin" on public.organization_invitations
  for select using (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  );

drop policy if exists "invitation_insert_org_admin" on public.organization_invitations;
create policy "invitation_insert_org_admin" on public.organization_invitations
  for insert with check (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  );

drop policy if exists "invitation_update_org_admin" on public.organization_invitations;
create policy "invitation_update_org_admin" on public.organization_invitations
  for update using (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  ) with check (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  );

drop policy if exists "invitation_delete_org_admin" on public.organization_invitations;
create policy "invitation_delete_org_admin" on public.organization_invitations
  for delete using (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  );

-- ============================================
-- PLATFORM USER ROLES
-- ============================================
alter table public.platform_user_roles enable row level security;

-- Users can see their own platform roles
drop policy if exists "platform_role_select_own" on public.platform_user_roles;
create policy "platform_role_select_own" on public.platform_user_roles
  for select using (
    auth.uid() = user_id or private.is_platform_admin()
  );

-- Only platform admins can insert/update/delete platform roles
drop policy if exists "platform_role_insert_admin" on public.platform_user_roles;
create policy "platform_role_insert_admin" on public.platform_user_roles
  for insert with check (private.is_platform_admin());

drop policy if exists "platform_role_update_admin" on public.platform_user_roles;
create policy "platform_role_update_admin" on public.platform_user_roles
  for update using (private.is_platform_admin())
  with check (private.is_platform_admin());

drop policy if exists "platform_role_delete_admin" on public.platform_user_roles;
create policy "platform_role_delete_admin" on public.platform_user_roles
  for delete using (private.is_platform_admin());

-- ============================================
-- OFFERINGS (platform-global catalog)
-- ============================================
alter table public.offerings enable row level security;

drop policy if exists "offerings_select_all" on public.offerings;
create policy "offerings_select_all" on public.offerings
  for select using (true);

drop policy if exists "offerings_write_admin" on public.offerings;
create policy "offerings_write_admin" on public.offerings
  for all using (private.is_platform_admin())
  with check (private.is_platform_admin());

-- ============================================
-- ORGANIZATION ENTITLEMENTS
-- ============================================
alter table public.organization_entitlements enable row level security;

drop policy if exists "entitlement_select_org_member" on public.organization_entitlements;
create policy "entitlement_select_org_member" on public.organization_entitlements
  for select using (
    private.is_org_member(organization_id) or private.is_platform_admin()
  );

drop policy if exists "entitlement_write_org_admin" on public.organization_entitlements;
create policy "entitlement_write_org_admin" on public.organization_entitlements
  for all using (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  ) with check (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  );

-- ============================================
-- MEMBER OFFERING ROLES
-- ============================================
alter table public.member_offering_roles enable row level security;

drop policy if exists "member_offering_select_org_member" on public.member_offering_roles;
create policy "member_offering_select_org_member" on public.member_offering_roles
  for select using (
    private.is_org_member(organization_id) or private.is_platform_admin()
  );

drop policy if exists "member_offering_write_org_admin" on public.member_offering_roles;
create policy "member_offering_write_org_admin" on public.member_offering_roles
  for all using (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  ) with check (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  );

-- ============================================
-- ENGAGEMENTS
-- ============================================
alter table public.engagements enable row level security;

drop policy if exists "engagement_select_org_member" on public.engagements;
create policy "engagement_select_org_member" on public.engagements
  for select using (
    private.is_org_member(organization_id) or private.is_platform_admin()
  );

drop policy if exists "engagement_write_org_admin" on public.engagements;
create policy "engagement_write_org_admin" on public.engagements
  for all using (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  ) with check (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  );

-- ============================================
-- ENGAGEMENT_OFFERINGS
-- ============================================
alter table public.engagement_offerings enable row level security;

drop policy if exists "eng_offering_select_org_member" on public.engagement_offerings;
create policy "eng_offering_select_org_member" on public.engagement_offerings
  for select using (
    exists (
      select 1 from public.engagements e
      where e.id = engagement_id
        and (private.is_org_member(e.organization_id) or private.is_platform_admin())
    )
  );

drop policy if exists "eng_offering_write_org_admin" on public.engagement_offerings;
create policy "eng_offering_write_org_admin" on public.engagement_offerings
  for all using (
    exists (
      select 1 from public.engagements e
      where e.id = engagement_id
        and (private.has_org_role(e.organization_id, array['owner', 'admin'])
             or private.is_platform_admin())
    )
  ) with check (
    exists (
      select 1 from public.engagements e
      where e.id = engagement_id
        and (private.has_org_role(e.organization_id, array['owner', 'admin'])
             or private.is_platform_admin())
    )
  );

-- ============================================
-- EXTERNAL_SYSTEM_LINKS
-- ============================================
alter table public.external_system_links enable row level security;

drop policy if exists "external_link_select_org_admin" on public.external_system_links;
create policy "external_link_select_org_admin" on public.external_system_links
  for select using (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  );

drop policy if exists "external_link_write_org_admin" on public.external_system_links;
create policy "external_link_write_org_admin" on public.external_system_links
  for all using (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  ) with check (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  );

-- ============================================
-- AUDIT EVENTS (append-only, immutable by non-admins)
-- ============================================
alter table public.audit_events enable row level security;

drop policy if exists "audit_select_org_member" on public.audit_events;
create policy "audit_select_org_member" on public.audit_events
  for select using (
    (organization_id is not null and private.is_org_member(organization_id))
    or private.is_platform_admin()
    or (organization_id is null and auth.uid() = actor_user_id)
  );

drop policy if exists "audit_insert_org_member" on public.audit_events;
create policy "audit_insert_org_member" on public.audit_events
  for insert with check (
    (organization_id is not null and private.is_org_member(organization_id))
    or private.is_platform_admin()
    or (organization_id is null and auth.uid() is not null)
  );

-- No update or delete policies: audit events are immutable


-- ============================================
-- File: 0007_existing_tables_rls.sql
-- ============================================
-- Migration 0007: RLS for existing application tables
-- Replaces old profiles.role = 'admin' pattern with platform_user_roles

-- ============================================
-- SITE_ANALYTICS_EVENTS
-- ============================================
alter table public.site_analytics_events enable row level security;

drop policy if exists "Anyone can insert analytics" on public.site_analytics_events;
create policy "Anyone can insert analytics" on public.site_analytics_events
  for insert with check (true);

drop policy if exists "analytics_select_platform_admin" on public.site_analytics_events;
create policy "analytics_select_platform_admin" on public.site_analytics_events
  for select using (private.is_platform_admin());

-- ============================================
-- OUTREACH_EMAILS
-- ============================================
alter table public.outreach_emails enable row level security;

drop policy if exists "Admin can manage outreach" on public.outreach_emails;
create policy "outreach_select_platform_admin" on public.outreach_emails
  for select using (private.is_platform_admin());
create policy "outreach_insert_platform_admin" on public.outreach_emails
  for insert with check (private.is_platform_admin());
create policy "outreach_update_platform_admin" on public.outreach_emails
  for update using (private.is_platform_admin())
  with check (private.is_platform_admin());

-- ============================================
-- NEWSLETTER_SUBSCRIBERS
-- ============================================
alter table public.newsletter_subscribers enable row level security;

drop policy if exists "Anyone can subscribe" on public.newsletter_subscribers;
create policy "Anyone can subscribe" on public.newsletter_subscribers
  for insert with check (true);

drop policy if exists "Admin can view subscribers" on public.newsletter_subscribers;
create policy "newsletter_select_platform_admin" on public.newsletter_subscribers
  for select using (private.is_platform_admin());

drop policy if exists "Anyone can unsubscribe themselves" on public.newsletter_subscribers;
create policy "newsletter_update_self" on public.newsletter_subscribers
  for update using (true) with check (true);

-- ============================================
-- LEAD_MAGNET_DOWNLOADS
-- ============================================
alter table public.lead_magnet_downloads enable row level security;

drop policy if exists "Anyone can request lead magnet" on public.lead_magnet_downloads;
create policy "Anyone can request lead magnet" on public.lead_magnet_downloads
  for insert with check (true);

drop policy if exists "Admin can view lead magnet downloads" on public.lead_magnet_downloads;
create policy "leadmagnet_select_platform_admin" on public.lead_magnet_downloads
  for select using (private.is_platform_admin());

-- ============================================
-- WEBINAR_REGISTRATIONS
-- ============================================
alter table public.webinar_registrations enable row level security;

drop policy if exists "Anyone can register for webinar" on public.webinar_registrations;
create policy "Anyone can register for webinar" on public.webinar_registrations
  for insert with check (true);

drop policy if exists "Admin can view webinar registrations" on public.webinar_registrations;
create policy "webinar_select_platform_admin" on public.webinar_registrations
  for select using (private.is_platform_admin());

-- ============================================
-- COURSE_ENROLLMENTS
-- ============================================
alter table public.course_enrollments enable row level security;

drop policy if exists "Anyone can enroll in course" on public.course_enrollments;
create policy "Anyone can enroll in course" on public.course_enrollments
  for insert with check (true);

drop policy if exists "Admin can view course enrollments" on public.course_enrollments;
create policy "course_select_platform_admin" on public.course_enrollments
  for select using (private.is_platform_admin());

-- ============================================
-- CONTACT_SUBMISSIONS
-- ============================================
alter table public.contact_submissions enable row level security;

drop policy if exists "Anyone can submit contact form" on public.contact_submissions;
create policy "Anyone can submit contact form" on public.contact_submissions
  for insert with check (true);

drop policy if exists "Admin can view contact submissions" on public.contact_submissions;
create policy "contact_select_platform_admin" on public.contact_submissions
  for select using (private.is_platform_admin());

-- ============================================
-- GRANTS: Least privilege
-- ============================================
-- anon: only public insert tables (analytics, newsletter, lead magnet, webinar, course, contact)
-- authenticated: everything anon has + their own profile + org-scoped tables via RLS
-- service_role: bypasses RLS (used server-side only)

-- Revoke all from anon on tenant tables, then grant only what's needed
revoke all on public.organizations from anon;
revoke all on public.organization_memberships from anon;
revoke all on public.organization_invitations from anon;
revoke all on public.platform_user_roles from anon;
revoke all on public.offerings from anon;
revoke all on public.organization_entitlements from anon;
revoke all on public.member_offering_roles from anon;
revoke all on public.engagements from anon;
revoke all on public.engagement_offerings from anon;
revoke all on public.external_system_links from anon;
revoke all on public.audit_events from anon;
revoke all on public.profiles from anon;
revoke all on public.outreach_emails from anon;

-- Grant select on offerings to anon (public catalog)
grant select on public.offerings to anon;

-- Grant insert on public-form tables to anon
grant insert on public.site_analytics_events to anon;
grant insert on public.newsletter_subscribers to anon;
grant insert on public.lead_magnet_downloads to anon;
grant insert on public.webinar_registrations to anon;
grant insert on public.course_enrollments to anon;
grant insert on public.contact_submissions to anon;

-- Grant update on newsletter for self-unsubscribe
grant update on public.newsletter_subscribers to anon;

-- Authenticated gets broader access (RLS still applies)
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.organizations to authenticated;
grant select, insert, update, delete on public.organization_memberships to authenticated;
grant select, insert, update, delete on public.organization_invitations to authenticated;
grant select on public.platform_user_roles to authenticated;
grant select on public.offerings to authenticated;
grant select, insert, update, delete on public.organization_entitlements to authenticated;
grant select, insert, update, delete on public.member_offering_roles to authenticated;
grant select, insert, update, delete on public.engagements to authenticated;
grant select, insert, update, delete on public.engagement_offerings to authenticated;
grant select, insert, update, delete on public.external_system_links to authenticated;
grant select, insert on public.audit_events to authenticated;

-- Grant usage on sequences (audit_events identity)
grant usage, select on public.audit_events_id_seq to authenticated;

-- ============================================
-- DROP OLD PROFILES ROLE COLUMN (additive: keep column but ignore it)
-- ============================================
-- The old schema had profiles.role. We don't drop it to avoid breaking
-- existing code, but all RLS now uses platform_user_roles instead.
-- A future migration can drop it once all code is updated.

-- ============================================
-- MIGRATION TRACKING TABLE
-- ============================================
create table if not exists public.schema_migrations (
  filename text primary key,
  applied_at timestamptz default now(),
  checksum text not null,
  execution_ms integer
);

grant select, insert, update on public.schema_migrations to authenticated;
alter table public.schema_migrations enable row level security;
create policy "Platform admins can manage migration tracking"
  on public.schema_migrations for all
  using (private.is_platform_admin())
  with check (private.is_platform_admin());

-- Seed all migration records (all applied via this combined script)
insert into public.schema_migrations (filename, checksum) values
  ('0001_profiles_and_trigger.sql', 'h_initial'),
  ('0002_organizations.sql', 'h_initial'),
  ('0003_offerings_entitlements.sql', 'h_initial'),
  ('0004_engagements_external_audit.sql', 'h_initial'),
  ('0005_private_helpers.sql', 'h_initial'),
  ('0006_rls_policies.sql', 'h_initial'),
  ('0007_existing_tables_rls.sql', 'h_initial')
on conflict (filename) do nothing;


