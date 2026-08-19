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
set search_path = public
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
    from public.organization_memberships om
    inner join public.organizations o on o.id = om.organization_id
    where om.organization_id = org_id
      and om.user_id = auth.uid()
      and om.status = 'active'
      and o.status = 'active'
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
    from public.organization_memberships om
    inner join public.organizations o on o.id = om.organization_id
    where om.organization_id = org_id
      and om.user_id = auth.uid()
      and om.status = 'active'
      and om.role = any(roles)
      and o.status = 'active'
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
    inner join public.organizations org on org.id = mor.organization_id
    where mor.organization_id = org_id
      and mor.user_id = auth.uid()
      and mor.status = 'active'
      and o.offering_key = offering_key
      and oe.status = 'active'
      and oe.valid_from <= now()
      and (oe.valid_until is null or oe.valid_until > now())
      and org.status = 'active'
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
    inner join public.organizations org on org.id = mor.organization_id
    where mor.organization_id = org_id
      and mor.user_id = auth.uid()
      and mor.status = 'active'
      and o.offering_key = offering_key
      and mor.role = any(roles)
      and org.status = 'active'
  )
$$;

-- ============================================
-- HELPER: is_entitlement_active(org_id, offering_key)
-- Checks: entitlement is active, valid_from <= now, valid_until > now or null, org is active
-- ============================================
create or replace function private.is_entitlement_active(ent_org_id uuid, off_key text)
returns boolean
language sql
stable
security definer
set search_path to public, private
as $$
  select exists (
    select 1
    from public.organization_entitlements oe
    inner join public.offerings o on o.id = oe.offering_id
    inner join public.organizations org on org.id = oe.organization_id
    where oe.organization_id = ent_org_id
      and o.offering_key = off_key
      and oe.status = 'active'
      and oe.valid_from <= now()
      and (oe.valid_until is null or oe.valid_until > now())
      and org.status = 'active'
  )
$$;

-- ============================================
-- HELPER: can_access_offering(org_id, offering_key)
-- Checks: active member_offering_role + active entitlement + org is active
-- ============================================
create or replace function private.can_access_offering(acc_org_id uuid, off_key text)
returns boolean
language sql
stable
security definer
set search_path to public, private
as $$
  select exists (
    select 1
    from public.member_offering_roles mor
    inner join public.offerings o on o.id = mor.offering_id
    inner join public.organizations org on org.id = mor.organization_id
    where mor.organization_id = acc_org_id
      and mor.user_id = auth.uid()
      and mor.status = 'active'
      and o.offering_key = off_key
      and org.status = 'active'
    and private.is_entitlement_active(acc_org_id, off_key)
  )
$$;

-- ============================================
-- HELPER: has_active_entitlement(org_id, offering_key)
-- Alias for is_entitlement_active
-- ============================================
create or replace function private.has_active_entitlement(hae_org_id uuid, off_key text)
returns boolean
language sql
stable
security definer
set search_path to public, private
as $$
  select private.is_entitlement_active(hae_org_id, off_key)
$$;

-- ============================================
-- HELPER: get_entitlement_status(entitlement_id)
-- Returns computed status considering time-based expiry
-- ============================================
create or replace function private.get_entitlement_status(ge_ent_id uuid)
returns text
language sql
stable
security definer
set search_path to public, private
as $$
  select case
    when status = 'revoked' then 'revoked'
    when status = 'suspended' then 'suspended'
    when status = 'expired' then 'expired'
    when status = 'pending' and valid_from > now() then 'pending'
    when status = 'active' and valid_until is not null and valid_until <= now() then 'expired'
    when status = 'active' and valid_from > now() then 'pending'
    when status = 'active' then 'active'
    else status
  end
  from public.organization_entitlements
  where id = ge_ent_id
$$;

-- ============================================
-- HELPER: write_audit_event(action, entity_type, org_id?, actor_id?, entity_id?, metadata?)
-- Inserts an audit event row. Returns the new audit_events.id.
-- ============================================
create or replace function private.write_audit_event(
  audit_action text,
  audit_entity_type text,
  audit_org_id uuid default null,
  audit_actor_id uuid default null,
  audit_entity_id text default null,
  audit_metadata jsonb default '{}'::jsonb
)
returns bigint
language plpgsql
security definer
set search_path to public, private
as $$
declare
  new_id bigint;
begin
  insert into public.audit_events (organization_id, actor_user_id, action, entity_type, entity_id, metadata)
  values (audit_org_id, audit_actor_id, audit_action, audit_entity_type, audit_entity_id, audit_metadata)
  returning id into new_id;
  return new_id;
end;
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
-- Migration 0007: Create existing application tables + RLS for all tables
-- Replaces old profiles.role = 'admin' pattern with platform_user_roles
-- On fresh databases, these tables must be created before RLS can be applied

-- ============================================
-- SITE_ANALYTICS_EVENTS
-- ============================================
create table if not exists public.site_analytics_events (
  id bigint generated always as identity primary key,
  event_type text not null check (event_type in ('pageview', 'engagement', 'click', 'form_submit', 'form_error', 'conversion')),
  path text not null,
  referrer text,
  user_agent text,
  ip_hash text,
  session_id text,
  duration integer default 0,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_analytics_type_date on public.site_analytics_events(event_type, created_at);
create index if not exists idx_analytics_path on public.site_analytics_events(path);
create index if not exists idx_analytics_session on public.site_analytics_events(session_id);
create index if not exists idx_analytics_created on public.site_analytics_events(created_at desc);

-- ============================================
-- OUTREACH_EMAILS
-- ============================================
create table if not exists public.outreach_emails (
  id bigint generated always as identity primary key,
  slug text not null,
  article_title text not null,
  target text not null,
  recipient_email text,
  subject text not null,
  body_preview text,
  email_type text default 'initial' check (email_type in ('initial', 'follow_up', 'reply')),
  status text default 'sent' check (status in ('sent', 'replied', 'followed_up', 'closed')),
  sent_date timestamptz default now(),
  replied_date timestamptz,
  followed_up_date timestamptz,
  closed_date timestamptz,
  notes text,
  updated_at timestamptz default now()
);

create index if not exists idx_outreach_status on public.outreach_emails(status);
create index if not exists idx_outreach_sent_date on public.outreach_emails(sent_date desc);

-- ============================================
-- NEWSLETTER_SUBSCRIBERS
-- ============================================
create table if not exists public.newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  source text default 'site' check (source in ('site', 'magazine', 'lead_magnet', 'webinar', 'course')),
  status text default 'active' check (status in ('active', 'unsubscribed', 'bounced')),
  metadata jsonb default '{}'::jsonb,
  subscribed_at timestamptz default now(),
  unsubscribed_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists idx_newsletter_email on public.newsletter_subscribers(email);
create index if not exists idx_newsletter_status on public.newsletter_subscribers(status);

-- ============================================
-- LEAD_MAGNET_DOWNLOADS
-- ============================================
create table if not exists public.lead_magnet_downloads (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  name text,
  company text,
  resource text not null,
  source_page text,
  downloaded_at timestamptz default now()
);

create index if not exists idx_leadmagnet_email on public.lead_magnet_downloads(email);
create index if not exists idx_leadmagnet_resource on public.lead_magnet_downloads(resource);

-- ============================================
-- WEBINAR_REGISTRATIONS
-- ============================================
create table if not exists public.webinar_registrations (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  name text,
  company text,
  webinar_slug text not null,
  registered_at timestamptz default now()
);

create index if not exists idx_webinar_email on public.webinar_registrations(email);
create index if not exists idx_webinar_slug on public.webinar_registrations(webinar_slug);

-- ============================================
-- COURSE_ENROLLMENTS
-- ============================================
create table if not exists public.course_enrollments (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  name text,
  company text,
  course_slug text not null,
  enrolled_at timestamptz default now()
);

create index if not exists idx_course_email on public.course_enrollments(email);
create index if not exists idx_course_slug on public.course_enrollments(course_slug);

-- ============================================
-- CONTACT_SUBMISSIONS
-- ============================================
create table if not exists public.contact_submissions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  company text,
  message text not null,
  source_page text,
  submitted_at timestamptz default now()
);

create index if not exists idx_contact_email on public.contact_submissions(email);
create index if not exists idx_contact_submitted on public.contact_submissions(submitted_at desc);

-- ============================================
-- RLS POLICIES
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
-- File: 0008_school_pickup_schema.sql
-- ============================================
-- ============================================
-- Migration 0008: School Pickup Domain Schema
-- Tables, constraints, tenant-safe composite FKs, indexes
-- ============================================

-- ============================================
-- TIMEZONE VALIDATION HELPER
-- ============================================
create or replace function private.is_valid_timezone(tz text)
returns boolean
language sql
stable
security definer
set search_path to 'pg_catalog'
as $$
  select exists (select 1 from pg_timezone_names where name = tz)
$$;

-- ============================================
-- SCHOOL SITES
-- One row = one physical/operational school location
-- ============================================
create table if not exists public.school_sites (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  name text not null,
  slug text not null,
  status text not null default 'active'
    check (status in ('active', 'inactive', 'archived')),
  timezone text not null,
  address_line1 text,
  address_line2 text,
  city text,
  state_province text,
  postal_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  constraint school_sites_timezone_check check (private.is_valid_timezone(timezone)),
  constraint school_sites_org_slug_unique unique (organization_id, slug)
);

-- Composite unique for tenant-safe FK targets
alter table public.school_sites
  add constraint school_sites_org_id_unique unique (organization_id, id);

create index idx_school_sites_org on public.school_sites(organization_id);
create index idx_school_sites_org_status on public.school_sites(organization_id, status);

-- ============================================
-- SCHOOL STAFF ASSIGNMENTS
-- One row = one role assignment for one user at one site
-- ============================================
create table if not exists public.school_staff_assignments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  school_site_id uuid not null,
  user_id uuid not null references auth.users(id),
  role text not null
    check (role in ('school_admin', 'dismissal_manager', 'scanner', 'teacher')),
  status text not null default 'active'
    check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ssa_site_user_role_unique unique (school_site_id, user_id, role)
);

-- Tenant-safe composite FK: site must belong to the org
alter table public.school_staff_assignments
  add constraint ssa_site_fk
  foreign key (organization_id, school_site_id)
  references public.school_sites(organization_id, id);

create index idx_ssa_site_user on public.school_staff_assignments(school_site_id, user_id);
create index idx_ssa_user on public.school_staff_assignments(user_id);
create index idx_ssa_site_role_status on public.school_staff_assignments(school_site_id, role, status);

-- ============================================
-- SCHOOL CLASSROOMS
-- One row = one classroom/grade grouping at a site
-- ============================================
create table if not exists public.school_classrooms (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  school_site_id uuid not null,
  name text not null,
  grade_label text,
  teacher_display_label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint classrooms_site_name_unique unique (school_site_id, name)
);

alter table public.school_classrooms
  add constraint classrooms_site_fk
  foreign key (organization_id, school_site_id)
  references public.school_sites(organization_id, id);

-- Composite unique for tenant-safe FK from students
alter table public.school_classrooms
  add constraint classrooms_org_site_id_unique unique (organization_id, school_site_id, id);

create index idx_classrooms_site on public.school_classrooms(school_site_id);

-- ============================================
-- SCHOOL STUDENTS
-- One row = one active or historical student roster identity
-- ============================================
create table if not exists public.school_students (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  school_site_id uuid not null,
  external_student_id text,
  first_name text not null,
  last_name text not null,
  classroom_id uuid,
  status text not null default 'active'
    check (status in ('active', 'inactive', 'transferred', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

alter table public.school_students
  add constraint students_site_fk
  foreign key (organization_id, school_site_id)
  references public.school_sites(organization_id, id);

-- Tenant-safe composite FK: classroom must belong to same org+site
alter table public.school_students
  add constraint students_classroom_fk
  foreign key (organization_id, school_site_id, classroom_id)
  references public.school_classrooms(organization_id, school_site_id, id);

-- Composite unique for tenant-safe FK from pickup_group_students, queue_items
alter table public.school_students
  add constraint students_org_site_id_unique unique (organization_id, school_site_id, id);

-- External ID uniqueness within org+site (partial: only where external_id is not null)
create unique index idx_students_external_id
  on public.school_students(organization_id, school_site_id, external_student_id)
  where external_student_id is not null;

create index idx_students_site_status on public.school_students(school_site_id, status);
create index idx_students_classroom on public.school_students(classroom_id) where classroom_id is not null;

-- ============================================
-- PICKUP GROUPS
-- One row = the set of students released together for one pickup arrival
-- ============================================
create table if not exists public.pickup_groups (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  school_site_id uuid not null,
  label text,
  status text not null default 'active'
    check (status in ('active', 'inactive', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

alter table public.pickup_groups
  add constraint pickup_groups_site_fk
  foreign key (organization_id, school_site_id)
  references public.school_sites(organization_id, id);

alter table public.pickup_groups
  add constraint pickup_groups_org_site_id_unique unique (organization_id, school_site_id, id);

create index idx_pickup_groups_site on public.pickup_groups(school_site_id);
create index idx_pickup_groups_site_status on public.pickup_groups(school_site_id, status);

-- ============================================
-- PICKUP GROUP STUDENTS
-- One row = one student's membership in one pickup group
-- ============================================
create table if not exists public.pickup_group_students (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  school_site_id uuid not null,
  pickup_group_id uuid not null,
  student_id uuid not null,
  status text not null default 'active'
    check (status in ('active', 'removed')),
  created_at timestamptz not null default now(),
  removed_at timestamptz,
  constraint pgs_group_student_active_unique unique (pickup_group_id, student_id)
    deferrable initially immediate
);

-- Tenant-safe composite FKs
alter table public.pickup_group_students
  add constraint pgs_group_fk
  foreign key (organization_id, school_site_id, pickup_group_id)
  references public.pickup_groups(organization_id, school_site_id, id);

alter table public.pickup_group_students
  add constraint pgs_student_fk
  foreign key (organization_id, school_site_id, student_id)
  references public.school_students(organization_id, school_site_id, id);

create index idx_pgs_group on public.pickup_group_students(pickup_group_id);
create index idx_pgs_student on public.pickup_group_students(student_id);
create index idx_pgs_group_active on public.pickup_group_students(pickup_group_id) where status = 'active';

-- ============================================
-- PICKUP CREDENTIALS
-- One row = one opaque QR credential for one pickup group
-- Stores only SHA-256 hash, never plaintext token
-- ============================================
create table if not exists public.pickup_credentials (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  school_site_id uuid not null,
  pickup_group_id uuid not null,
  token_hash text not null,
  status text not null default 'active'
    check (status in ('active', 'revoked', 'expired', 'replaced')),
  issued_at timestamptz not null default now(),
  issued_by uuid references auth.users(id),
  revoked_at timestamptz,
  revoked_by uuid references auth.users(id),
  revoked_reason text,
  replaced_by uuid references public.pickup_credentials(id),
  created_at timestamptz not null default now()
);

alter table public.pickup_credentials
  add constraint credentials_group_fk
  foreign key (organization_id, school_site_id, pickup_group_id)
  references public.pickup_groups(organization_id, school_site_id, id);

create unique index idx_credentials_token_hash on public.pickup_credentials(token_hash);
create index idx_credentials_group_status on public.pickup_credentials(pickup_group_id, status);
create index idx_credentials_org_site on public.pickup_credentials(organization_id, school_site_id);

-- ============================================
-- PICKUP SESSIONS
-- One row = one operational dismissal session at one site for one service date
-- ============================================
create table if not exists public.pickup_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  school_site_id uuid not null,
  service_date date not null,
  status text not null default 'scheduled'
    check (status in ('scheduled', 'open', 'closed', 'cancelled')),
  opened_at timestamptz,
  opened_by uuid references auth.users(id),
  closed_at timestamptz,
  closed_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  constraint pickup_sessions_site_date_unique unique (school_site_id, service_date)
);

alter table public.pickup_sessions
  add constraint pickup_sessions_site_fk
  foreign key (organization_id, school_site_id)
  references public.school_sites(organization_id, id);

alter table public.pickup_sessions
  add constraint pickup_sessions_org_site_id_unique unique (organization_id, school_site_id, id);

create index idx_sessions_site_date on public.pickup_sessions(school_site_id, service_date);
create index idx_sessions_site_status on public.pickup_sessions(school_site_id, status);

-- ============================================
-- PICKUP SESSION COUNTERS
-- Concurrency-safe sequence allocation per session
-- ============================================
create table if not exists public.pickup_session_counters (
  session_id uuid primary key references public.pickup_sessions(id) on delete cascade,
  next_sequence integer not null default 1
);

-- ============================================
-- PICKUP ARRIVALS
-- One row = one canonical pickup-group arrival within a session
-- ============================================
create table if not exists public.pickup_arrivals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  school_site_id uuid not null,
  session_id uuid not null,
  pickup_group_id uuid not null,
  credential_id uuid references public.pickup_credentials(id),
  checkin_source text not null
    check (checkin_source in ('qr', 'manual')),
  checked_in_by uuid not null references auth.users(id),
  checked_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint arrivals_session_group_unique unique (session_id, pickup_group_id)
);

alter table public.pickup_arrivals
  add constraint arrivals_session_fk
  foreign key (organization_id, school_site_id, session_id)
  references public.pickup_sessions(organization_id, school_site_id, id);

alter table public.pickup_arrivals
  add constraint arrivals_group_fk
  foreign key (organization_id, school_site_id, pickup_group_id)
  references public.pickup_groups(organization_id, school_site_id, id);

alter table public.pickup_arrivals
  add constraint arrivals_org_site_id_unique unique (organization_id, school_site_id, id);

create index idx_arrivals_session on public.pickup_arrivals(session_id);
create index idx_arrivals_group on public.pickup_arrivals(pickup_group_id);

-- ============================================
-- PICKUP QUEUE ITEMS
-- One row = one student's operational dismissal state within one session
-- ============================================
create table if not exists public.pickup_queue_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  school_site_id uuid not null,
  session_id uuid not null,
  arrival_id uuid not null,
  student_id uuid not null,
  sequence_number integer not null,
  current_status text not null default 'arrived'
    check (current_status in ('arrived', 'preparing', 'ready', 'completed', 'cancelled', 'exception')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  constraint queue_session_student_unique unique (session_id, student_id),
  constraint queue_session_seq_unique unique (session_id, sequence_number)
);

alter table public.pickup_queue_items
  add constraint queue_session_fk
  foreign key (organization_id, school_site_id, session_id)
  references public.pickup_sessions(organization_id, school_site_id, id);

alter table public.pickup_queue_items
  add constraint queue_arrival_fk
  foreign key (organization_id, school_site_id, arrival_id)
  references public.pickup_arrivals(organization_id, school_site_id, id);

alter table public.pickup_queue_items
  add constraint queue_student_fk
  foreign key (organization_id, school_site_id, student_id)
  references public.school_students(organization_id, school_site_id, id);

create index idx_queue_session on public.pickup_queue_items(session_id);
create index idx_queue_session_status on public.pickup_queue_items(session_id, current_status);
create index idx_queue_student on public.pickup_queue_items(student_id);
create index idx_queue_arrival on public.pickup_queue_items(arrival_id);

-- ============================================
-- PICKUP STATUS EVENTS
-- Append-only history of queue status transitions
-- ============================================
create table if not exists public.pickup_status_events (
  id bigint generated always as identity primary key,
  organization_id uuid not null,
  school_site_id uuid not null,
  session_id uuid not null,
  queue_item_id uuid not null,
  from_status text,
  to_status text not null,
  actor_user_id uuid references auth.users(id),
  reason text,
  created_at timestamptz not null default now()
);

alter table public.pickup_status_events
  add constraint status_events_session_fk
  foreign key (organization_id, school_site_id, session_id)
  references public.pickup_sessions(organization_id, school_site_id, id);

alter table public.pickup_status_events
  add constraint status_events_queue_fk
  foreign key (organization_id, school_site_id, queue_item_id)
  references public.pickup_queue_items(organization_id, school_site_id, id);

create index idx_status_events_queue on public.pickup_status_events(queue_item_id);
create index idx_status_events_session on public.pickup_status_events(session_id);

-- ============================================
-- PICKUP SCAN EVENTS
-- Append-only scan telemetry (no raw tokens)
-- ============================================
create table if not exists public.pickup_scan_events (
  id bigint generated always as identity primary key,
  organization_id uuid not null,
  school_site_id uuid not null,
  session_id uuid,
  credential_id uuid,
  pickup_group_id uuid,
  outcome text not null
    check (outcome in ('success', 'duplicate', 'revoked', 'unknown', 'wrong_site', 'inactive_group', 'closed_session', 'error')),
  actor_user_id uuid not null references auth.users(id),
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.pickup_scan_events
  add constraint scan_events_site_fk
  foreign key (organization_id, school_site_id)
  references public.school_sites(organization_id, id);

create index idx_scan_events_session on public.pickup_scan_events(session_id) where session_id is not null;
create index idx_scan_events_created on public.pickup_scan_events(created_at);
create index idx_scan_events_org_site on public.pickup_scan_events(organization_id, school_site_id);

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================
create or replace function private.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = 'public'
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array[
    'school_sites', 'school_staff_assignments', 'school_classrooms',
    'school_students', 'pickup_groups', 'pickup_queue_items'
  ]
  loop
    execute format(
      'drop trigger if exists trg_%s_updated on public.%s;
       create trigger trg_%s_updated before update on public.%s
       for each row execute function private.set_updated_at();',
      t, t, t, t
    );
  end loop;
end;
$$;

-- ============================================
-- RECORD MIGRATION
-- ============================================
insert into public.schema_migrations (filename, checksum, execution_ms)
values (
  '0008_school_pickup_schema.sql',
  md5('0008_school_pickup_schema_v1'),
  0
)
on conflict (filename) do nothing;


-- ============================================
-- File: 0009_school_pickup_auth_rls.sql
-- ============================================
-- ============================================
-- Migration 0009: School Pickup RLS + Authorization Helpers
-- Applied via Supabase MCP
-- ============================================
-- This file is the repository source of truth for the RLS policies.
-- The migration was applied directly to the Supabase project.

-- Authorization helpers:
-- private.has_school_role(site_id, roles[])
-- private.has_school_access(site_id)
-- private.has_org_school_access(org_id)
-- private.user_site_ids(org_id)
-- private.validate_queue_transition(from_status, to_status)

-- RLS enabled on all school pickup tables:
-- school_sites, school_staff_assignments, school_classrooms,
-- school_students, pickup_groups, pickup_group_students,
-- pickup_credentials, pickup_sessions, pickup_session_counters,
-- pickup_arrivals, pickup_queue_items, pickup_status_events,
-- pickup_scan_events

-- Permission matrix:
-- | Action              | school_admin | dismissal_manager | scanner | teacher | org_admin/owner |
-- |---------------------|--------------|-------------------|---------|---------|-----------------|
-- | roster read         | Y            | Y                 | N*      | N*      | Y               |
-- | roster edit         | Y            | Y                 | N       | N       | Y               |
-- | credential issue    | Y            | Y                 | N       | N       | Y               |
-- | credential revoke   | Y            | Y                 | N       | N       | Y               |
-- | session open/close  | Y            | Y                 | N       | N       | Y               |
-- | scan                | Y            | Y                 | Y       | N       | N               |
-- | manual check-in     | Y            | Y                 | Y       | N       | N               |
-- | queue read          | Y            | Y                 | Y       | Y*      | Y               |
-- | status transition   | Y            | Y                 | Y**     | Y***    | N               |
-- | exception handling  | Y            | Y                 | N       | N       | Y               |
-- | staff administration| Y            | N                 | N       | N       | Y               |
--
-- * Scanner/teacher get narrow projections via RPC, not full table access
-- ** Scanner: arrived->preparing, arrived->ready, arrived->completed
-- *** Teacher: arrived->preparing, preparing->ready

-- ============================================
-- FIX: Grant USAGE on private schema to authenticated/anon
-- RLS policies reference private.* functions; without USAGE, policies fail
-- ============================================
grant usage on schema private to authenticated, anon;
grant execute on all functions in schema private to authenticated, anon;
alter default privileges in schema private grant execute on functions to authenticated, anon;

-- ============================================
-- FIX: has_org_school_access, has_school_access, has_school_role
-- Now also verify active org membership (not just staff assignment)
-- Prevents access when org membership is revoked even if staff assignment is active
-- ============================================

create or replace function private.has_org_school_access(org_id uuid)
returns boolean
language sql
security definer
set search_path to 'public'
as $$
  select exists (
    select 1
    from public.school_staff_assignments ssa
    inner join public.school_sites ss on ss.id = ssa.school_site_id
    inner join public.organization_memberships om on om.organization_id = ss.organization_id
      and om.user_id = ssa.user_id
      and om.status = 'active'
    inner join public.organizations o on o.id = ss.organization_id
      and o.status = 'active'
    where ss.organization_id = org_id
      and ssa.user_id = auth.uid()
      and ssa.status = 'active'
      and ss.status = 'active'
  )
$$;

create or replace function private.has_school_access(site_id uuid)
returns boolean
language sql
security definer
set search_path to 'public'
as $$
  select exists (
    select 1
    from public.school_staff_assignments ssa
    inner join public.school_sites ss on ss.id = ssa.school_site_id
    inner join public.organization_memberships om on om.organization_id = ss.organization_id
      and om.user_id = ssa.user_id
      and om.status = 'active'
    inner join public.organizations o on o.id = ss.organization_id
      and o.status = 'active'
    where ssa.school_site_id = site_id
      and ssa.user_id = auth.uid()
      and ssa.status = 'active'
      and ss.status = 'active'
  )
$$;

create or replace function private.has_school_role(site_id uuid, roles text[])
returns boolean
language sql
security definer
set search_path to 'public'
as $$
  select exists (
    select 1
    from public.school_staff_assignments ssa
    inner join public.school_sites ss on ss.id = ssa.school_site_id
    inner join public.organization_memberships om on om.organization_id = ss.organization_id
      and om.user_id = ssa.user_id
      and om.status = 'active'
    inner join public.organizations o on o.id = ss.organization_id
      and o.status = 'active'
    where ssa.school_site_id = site_id
      and ssa.user_id = auth.uid()
      and ssa.status = 'active'
      and ssa.role = any(roles)
      and ss.status = 'active'
  )
$$;

grant execute on all functions in schema private to authenticated, anon;


-- ============================================
-- File: 0010_school_pickup_functions.sql
-- ============================================
-- ============================================
-- Migration 0010: School Pickup Transactional Functions
-- Applied via Supabase MCP
-- ============================================
-- This file is the repository source of truth for the RPC functions.

-- Functions:
-- public.open_pickup_session(site_id, service_date) -> uuid
-- public.close_pickup_session(session_id) -> void
-- public.cancel_pickup_session(session_id, reason) -> void
-- public.process_pickup_checkin(site_id, credential_token, pickup_group_id, source) -> jsonb
-- public.transition_queue_status(queue_item_id, new_status, reason) -> jsonb
-- public.revoke_credential(credential_id, reason) -> void
-- public.replace_credential(old_credential_id, reason) -> jsonb

-- All functions are SECURITY DEFINER with explicit search_path.
-- Execute revoked from anon and authenticated.
-- Called via service role client from API routes.

-- State machine (sessions):
--   scheduled -> open (via open_pickup_session)
--   open -> closed (via close_pickup_session)
--   scheduled -> cancelled (via cancel_pickup_session)
--   open -> cancelled (via cancel_pickup_session)
--   closed -> (terminal)
--   cancelled -> (terminal)

-- State machine (queue items):
--   null -> arrived (initial)
--   arrived -> preparing, ready, completed, cancelled, exception
--   preparing -> ready, arrived, completed, cancelled, exception
--   ready -> completed, preparing, cancelled, exception
--   exception -> arrived, preparing, ready, completed, cancelled
--   completed -> (terminal, no transitions)
--   cancelled -> (terminal, no transitions)

-- Idempotency:
--   process_pickup_checkin uses UNIQUE(session_id, pickup_group_id)
--   and SELECT FOR UPDATE to guarantee one arrival per group per session.
--   Repeated scans return the existing canonical result with outcome='duplicate'.

-- Sequence allocation:
--   pickup_session_counters row locked with FOR UPDATE.
--   Atomic increment via UPDATE ... RETURNING.
--   Gaps acceptable; uniqueness guaranteed by UNIQUE(session_id, sequence_number).


-- ============================================
-- File: 0011_commercial_operations.sql
-- ============================================
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


-- ============================================
-- File: 0011_school_pickup_admin_functions.sql
-- ============================================
-- ============================================
-- Migration 0011: School Pickup Admin Functions
-- Transactional functions for admin UI operations
-- All functions accept p_actor_user_id for authorization
-- Called via service role client from API routes
-- ============================================

-- ============================================
-- Helper: authorize_school_action
-- Checks actor has school role or org admin or platform admin
-- ============================================
create or replace function private.authorize_school_action(
  p_actor_user_id uuid,
  p_org_id uuid,
  p_site_id uuid,
  p_roles text[] default null
)
returns void
language plpgsql
security definer
set search_path = 'public', 'private'
as $$
declare
  v_authorized boolean := false;
  v_is_platform_admin boolean := false;
  v_has_org_role boolean := false;
  v_has_school_role boolean := false;
begin
  select exists (
    select 1 from public.platform_user_roles
    where user_id = p_actor_user_id and role = 'platform_admin'
  ) into v_is_platform_admin;

  if v_is_platform_admin then
    return;
  end if;

  select exists (
    select 1 from public.organization_memberships om
    inner join public.organizations o on o.id = om.organization_id
    where om.organization_id = p_org_id
      and om.user_id = p_actor_user_id
      and om.status = 'active'
      and om.role = any(array['owner', 'admin'])
      and o.status = 'active'
  ) into v_has_org_role;

  if v_has_org_role then
    return;
  end if;

  if p_roles is not null then
    select exists (
      select 1 from public.school_staff_assignments ssa
      inner join public.school_sites ss on ss.id = ssa.school_site_id
      where ssa.school_site_id = p_site_id
        and ssa.user_id = p_actor_user_id
        and ssa.status = 'active'
        and ssa.role = any(p_roles)
        and ss.status = 'active'
        and ss.organization_id = p_org_id
    ) into v_has_school_role;

    if v_has_school_role then
      return;
    end if;
  end if;

  raise exception 'UNAUTHORIZED';
end;
$$;

-- ============================================
-- Function: create_school_site
-- ============================================
create or replace function public.create_school_site(
  p_actor_user_id uuid,
  p_org_id uuid,
  p_name text,
  p_slug text,
  p_timezone text,
  p_address_line1 text default null,
  p_address_line2 text default null,
  p_city text default null,
  p_state_province text default null,
  p_postal_code text default null
)
returns uuid
language plpgsql
security definer
set search_path = 'public', 'private'
as $$
declare
  v_site_id uuid;
begin
  perform private.authorize_school_action(p_actor_user_id, p_org_id, null::uuid, null);

  if not private.is_entitlement_active(p_org_id, 'school_pickup') then
    raise exception 'ENTITLEMENT_MISSING';
  end if;

  insert into public.school_sites (
    organization_id, name, slug, timezone,
    address_line1, address_line2, city, state_province, postal_code
  )
  values (
    p_org_id, p_name, p_slug, p_timezone,
    p_address_line1, p_address_line2, p_city, p_state_province, p_postal_code
  )
  returning id into v_site_id;

  insert into public.school_staff_assignments (
    organization_id, school_site_id, user_id, role, status
  )
  values (p_org_id, v_site_id, p_actor_user_id, 'school_admin', 'active');

  perform private.write_audit_event(
    'school_site.created', 'school_site', p_org_id, p_actor_user_id, v_site_id::text,
    jsonb_build_object('name', p_name, 'slug', p_slug)
  );

  return v_site_id;
end;
$$;

-- ============================================
-- Function: update_school_site
-- ============================================
create or replace function public.update_school_site(
  p_actor_user_id uuid,
  p_org_id uuid,
  p_site_id uuid,
  p_name text default null,
  p_timezone text default null,
  p_status text default null,
  p_address_line1 text default null,
  p_address_line2 text default null,
  p_city text default null,
  p_state_province text default null,
  p_postal_code text default null
)
returns void
language plpgsql
security definer
set search_path = 'public', 'private'
as $$
begin
  perform private.authorize_school_action(p_actor_user_id, p_org_id, p_site_id, null);

  update public.school_sites
  set name = coalesce(p_name, name),
      timezone = coalesce(p_timezone, timezone),
      status = coalesce(p_status, status),
      address_line1 = coalesce(p_address_line1, address_line1),
      address_line2 = coalesce(p_address_line2, address_line2),
      city = coalesce(p_city, city),
      state_province = coalesce(p_state_province, state_province),
      postal_code = coalesce(p_postal_code, postal_code),
      archived_at = case when p_status = 'archived' and archived_at is null then now() else archived_at end
  where id = p_site_id and organization_id = p_org_id;

  if not found then
    raise exception 'SITE_NOT_FOUND';
  end if;

  perform private.write_audit_event(
    'school_site.updated', 'school_site', p_org_id, p_actor_user_id, p_site_id::text,
    jsonb_build_object('fields', jsonb_strip_nulls(jsonb_build_object(
      'name', p_name, 'timezone', p_timezone, 'status', p_status
    )))
  );
end;
$$;

-- ============================================
-- Function: create_classroom
-- ============================================
create or replace function public.create_classroom(
  p_actor_user_id uuid,
  p_org_id uuid,
  p_site_id uuid,
  p_name text,
  p_grade_label text default null,
  p_teacher_display_label text default null
)
returns uuid
language plpgsql
security definer
set search_path = 'public', 'private'
as $$
declare
  v_classroom_id uuid;
begin
  perform private.authorize_school_action(
    p_actor_user_id, p_org_id, p_site_id,
    array['school_admin', 'dismissal_manager']
  );

  insert into public.school_classrooms (
    organization_id, school_site_id, name, grade_label, teacher_display_label
  )
  values (p_org_id, p_site_id, p_name, p_grade_label, p_teacher_display_label)
  returning id into v_classroom_id;

  perform private.write_audit_event(
    'classroom.created', 'classroom', p_org_id, p_actor_user_id, v_classroom_id::text,
    jsonb_build_object('name', p_name, 'site_id', p_site_id)
  );

  return v_classroom_id;
end;
$$;

-- ============================================
-- Function: update_classroom
-- ============================================
create or replace function public.update_classroom(
  p_actor_user_id uuid,
  p_org_id uuid,
  p_site_id uuid,
  p_classroom_id uuid,
  p_name text default null,
  p_grade_label text default null,
  p_teacher_display_label text default null
)
returns void
language plpgsql
security definer
set search_path = 'public', 'private'
as $$
begin
  perform private.authorize_school_action(
    p_actor_user_id, p_org_id, p_site_id,
    array['school_admin', 'dismissal_manager']
  );

  update public.school_classrooms
  set name = coalesce(p_name, name),
      grade_label = coalesce(p_grade_label, grade_label),
      teacher_display_label = coalesce(p_teacher_display_label, teacher_display_label)
  where id = p_classroom_id
    and school_site_id = p_site_id
    and organization_id = p_org_id;

  if not found then
    raise exception 'CLASSROOM_NOT_FOUND';
  end if;

  perform private.write_audit_event(
    'classroom.updated', 'classroom', p_org_id, p_actor_user_id, p_classroom_id::text,
    jsonb_build_object('fields', jsonb_strip_nulls(jsonb_build_object(
      'name', p_name, 'grade_label', p_grade_label
    )))
  );
end;
$$;

-- ============================================
-- Function: create_student_with_group
-- Creates student + default pickup group + group membership
-- ============================================
create or replace function public.create_student_with_group(
  p_actor_user_id uuid,
  p_org_id uuid,
  p_site_id uuid,
  p_first_name text,
  p_last_name text,
  p_external_student_id text default null,
  p_classroom_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = 'public', 'private'
as $$
declare
  v_student_id uuid;
  v_group_id uuid;
  v_label text;
begin
  perform private.authorize_school_action(
    p_actor_user_id, p_org_id, p_site_id,
    array['school_admin', 'dismissal_manager']
  );

  insert into public.school_students (
    organization_id, school_site_id, external_student_id,
    first_name, last_name, classroom_id, status
  )
  values (
    p_org_id, p_site_id, p_external_student_id,
    p_first_name, p_last_name, p_classroom_id, 'active'
  )
  returning id into v_student_id;

  v_label := p_first_name || ' ' || p_last_name;
  insert into public.pickup_groups (
    organization_id, school_site_id, label, status
  )
  values (p_org_id, p_site_id, v_label, 'active')
  returning id into v_group_id;

  insert into public.pickup_group_students (
    organization_id, school_site_id, pickup_group_id, student_id, status
  )
  values (p_org_id, p_site_id, v_group_id, v_student_id, 'active');

  perform private.write_audit_event(
    'student.created', 'student', p_org_id, p_actor_user_id, v_student_id::text,
    jsonb_build_object(
      'pickup_group_id', v_group_id,
      'external_student_id', p_external_student_id
    )
  );

  return jsonb_build_object(
    'student_id', v_student_id,
    'pickup_group_id', v_group_id
  );
end;
$$;

-- ============================================
-- Function: update_student
-- ============================================
create or replace function public.update_student(
  p_actor_user_id uuid,
  p_org_id uuid,
  p_site_id uuid,
  p_student_id uuid,
  p_first_name text default null,
  p_last_name text default null,
  p_external_student_id text default null,
  p_classroom_id uuid default null,
  p_status text default null
)
returns void
language plpgsql
security definer
set search_path = 'public', 'private'
as $$
begin
  perform private.authorize_school_action(
    p_actor_user_id, p_org_id, p_site_id,
    array['school_admin', 'dismissal_manager']
  );

  update public.school_students
  set first_name = coalesce(p_first_name, first_name),
      last_name = coalesce(p_last_name, last_name),
      external_student_id = case when p_external_student_id is not null then p_external_student_id else external_student_id end,
      classroom_id = case when p_classroom_id is not null then p_classroom_id else classroom_id end,
      status = coalesce(p_status, status),
      archived_at = case when p_status in ('archived', 'transferred') and archived_at is null then now() else archived_at end
  where id = p_student_id
    and school_site_id = p_site_id
    and organization_id = p_org_id;

  if not found then
    raise exception 'STUDENT_NOT_FOUND';
  end if;

  perform private.write_audit_event(
    'student.updated', 'student', p_org_id, p_actor_user_id, p_student_id::text,
    jsonb_build_object('fields', jsonb_strip_nulls(jsonb_build_object(
      'first_name', p_first_name, 'last_name', p_last_name,
      'classroom_id', p_classroom_id, 'status', p_status
    )))
  );
end;
$$;

-- ============================================
-- Function: issue_credential
-- ============================================
create or replace function public.issue_credential(
  p_actor_user_id uuid,
  p_org_id uuid,
  p_site_id uuid,
  p_pickup_group_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = 'public', 'private'
as $$
declare
  v_token text;
  v_token_hash text;
  v_credential_id uuid;
begin
  perform private.authorize_school_action(
    p_actor_user_id, p_org_id, p_site_id,
    array['school_admin', 'dismissal_manager']
  );

  perform 1 from public.pickup_groups
  where id = p_pickup_group_id
    and organization_id = p_org_id
    and school_site_id = p_site_id
    and status = 'active';

  if not found then
    raise exception 'PICKUP_GROUP_NOT_FOUND';
  end if;

  v_token := encode(gen_random_bytes(32), 'hex');
  v_token_hash := encode(digest(v_token, 'sha256'), 'hex');

  insert into public.pickup_credentials (
    organization_id, school_site_id, pickup_group_id,
    token_hash, status, issued_by
  )
  values (
    p_org_id, p_site_id, p_pickup_group_id,
    v_token_hash, 'active', p_actor_user_id
  )
  returning id into v_credential_id;

  perform private.write_audit_event(
    'credential.issued', 'credential', p_org_id, p_actor_user_id, v_credential_id::text,
    jsonb_build_object('pickup_group_id', p_pickup_group_id)
  );

  return jsonb_build_object(
    'credential_id', v_credential_id,
    'token', v_token,
    'message', 'Store this token securely - it will not be shown again'
  );
end;
$$;

-- ============================================
-- Function: import_students
-- Transactional bulk import: create or update by external_student_id
-- ============================================
create or replace function public.import_students(
  p_actor_user_id uuid,
  p_org_id uuid,
  p_site_id uuid,
  p_students jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = 'public', 'private'
as $$
declare
  v_student jsonb;
  v_results jsonb[] := array[]::jsonb[];
  v_student_id uuid;
  v_group_id uuid;
  v_action text;
  v_existing_id uuid;
  v_existing_status text;
  v_label text;
  v_first_name text;
  v_last_name text;
  v_external_id text;
  v_classroom_id uuid;
  v_classroom_name text;
begin
  perform private.authorize_school_action(
    p_actor_user_id, p_org_id, p_site_id,
    array['school_admin', 'dismissal_manager']
  );

  for v_student in select * from jsonb_array_elements(p_students)
  loop
    v_first_name := v_student->>'first_name';
    v_last_name := v_student->>'last_name';
    v_external_id := nullif(v_student->>'external_student_id', '');
    v_classroom_id := nullif(v_student->>'classroom_id', '')::uuid;
    v_classroom_name := nullif(v_student->>'classroom_name', '');

    begin
      if v_classroom_id is null and v_classroom_name is not null then
        select id into v_classroom_id
        from public.school_classrooms
        where school_site_id = p_site_id
          and organization_id = p_org_id
          and name = v_classroom_name;
      end if;

      if v_external_id is not null then
        select id, status into v_existing_id, v_existing_status
        from public.school_students
        where organization_id = p_org_id
          and school_site_id = p_site_id
          and external_student_id = v_external_id;
      end if;

      if v_existing_id is not null then
        update public.school_students
        set first_name = v_first_name,
            last_name = v_last_name,
            classroom_id = v_classroom_id,
            status = 'active',
            archived_at = null
        where id = v_existing_id;

        v_action := 'updated';
        v_student_id := v_existing_id;
      else
        insert into public.school_students (
          organization_id, school_site_id, external_student_id,
          first_name, last_name, classroom_id, status
        )
        values (
          p_org_id, p_site_id, v_external_id,
          v_first_name, v_last_name, v_classroom_id, 'active'
        )
        returning id into v_student_id;

        v_label := v_first_name || ' ' || v_last_name;
        insert into public.pickup_groups (
          organization_id, school_site_id, label, status
        )
        values (p_org_id, p_site_id, v_label, 'active')
        returning id into v_group_id;

        insert into public.pickup_group_students (
          organization_id, school_site_id, pickup_group_id, student_id, status
        )
        values (p_org_id, p_site_id, v_group_id, v_student_id, 'active');

        v_action := 'created';
      end if;

      v_results := array_append(v_results, jsonb_build_object(
        'action', v_action,
        'student_id', v_student_id,
        'external_student_id', v_external_id,
        'name', v_first_name || ' ' || v_last_name,
        'status', 'ok'
      ));

      v_existing_id := null;
      v_existing_status := null;
      v_classroom_id := null;

    exception when others then
      v_results := array_append(v_results, jsonb_build_object(
        'action', 'error',
        'external_student_id', v_external_id,
        'name', coalesce(v_first_name, '') || ' ' || coalesce(v_last_name, ''),
        'status', 'error',
        'error', SQLERRM
      ));
      v_existing_id := null;
      v_classroom_id := null;
    end;
  end loop;

  perform private.write_audit_event(
    'student_import.completed', 'import', p_org_id, p_actor_user_id, null,
    jsonb_build_object(
      'total', jsonb_array_length(p_students),
      'results', to_jsonb(v_results)
    )
  );

  return jsonb_build_object('results', to_jsonb(v_results));
end;
$$;

-- ============================================
-- Revoke execute from public and anon roles
-- authenticated gets explicit grant since API routes use service role client
-- but direct Supabase client calls from authenticated users need access
-- ============================================
revoke execute on function public.create_school_site(uuid, uuid, text, text, text, text, text, text, text, text) from anon, public;
revoke execute on function public.update_school_site(uuid, uuid, uuid, text, text, text, text, text, text, text, text) from anon, public;
revoke execute on function public.create_classroom(uuid, uuid, uuid, text, text, text) from anon, public;
revoke execute on function public.update_classroom(uuid, uuid, uuid, uuid, text, text, text) from anon, public;
revoke execute on function public.create_student_with_group(uuid, uuid, uuid, text, text, text, uuid) from anon, public;
revoke execute on function public.update_student(uuid, uuid, uuid, uuid, text, text, text, uuid, text) from anon, public;
revoke execute on function public.issue_credential(uuid, uuid, uuid, uuid) from anon, public;
revoke execute on function public.import_students(uuid, uuid, uuid, jsonb) from anon, public;
revoke execute on function private.authorize_school_action(uuid, uuid, uuid, text[]) from anon, public;

-- Also revoke older functions from migration 0010
revoke execute on function public.open_pickup_session(uuid, date) from anon, public;
revoke execute on function public.close_pickup_session(uuid) from anon, public;
revoke execute on function public.cancel_pickup_session(uuid, text) from anon, public;
revoke execute on function public.transition_queue_status(uuid, text, text) from anon, public;
revoke execute on function public.revoke_credential(uuid, text) from anon, public;
revoke execute on function public.replace_credential(uuid, text) from anon, public;
revoke execute on function public.remove_member(uuid, uuid) from anon, public;
revoke execute on function public.transfer_ownership(uuid, uuid) from anon, public;
revoke execute on function public.accept_invitation(text, text) from anon, public;

-- Grant execute to authenticated only
grant execute on function public.create_school_site(uuid, uuid, text, text, text, text, text, text, text, text) to authenticated;
grant execute on function public.update_school_site(uuid, uuid, uuid, text, text, text, text, text, text, text, text) to authenticated;
grant execute on function public.create_classroom(uuid, uuid, uuid, text, text, text) to authenticated;
grant execute on function public.update_classroom(uuid, uuid, uuid, uuid, text, text, text) to authenticated;
grant execute on function public.create_student_with_group(uuid, uuid, uuid, text, text, text, uuid) to authenticated;
grant execute on function public.update_student(uuid, uuid, uuid, uuid, text, text, text, uuid, text) to authenticated;
grant execute on function public.issue_credential(uuid, uuid, uuid, uuid) to authenticated;
grant execute on function public.import_students(uuid, uuid, uuid, jsonb) to authenticated;
grant execute on function public.open_pickup_session(uuid, date) to authenticated;
grant execute on function public.close_pickup_session(uuid) to authenticated;
grant execute on function public.cancel_pickup_session(uuid, text) to authenticated;
grant execute on function public.transition_queue_status(uuid, text, text) to authenticated;
grant execute on function public.revoke_credential(uuid, text) to authenticated;
grant execute on function public.replace_credential(uuid, text) to authenticated;
grant execute on function public.remove_member(uuid, uuid) to authenticated;
grant execute on function public.transfer_ownership(uuid, uuid) to authenticated;
grant execute on function public.accept_invitation(text, text) to authenticated;

-- Record migration
insert into public.schema_migrations (filename, checksum, execution_ms)
values (
  '0011_school_pickup_admin_functions.sql',
  md5('0011_school_pickup_admin_functions_v1'),
  0
)
on conflict (filename) do nothing;


-- ============================================
-- File: 0012_commercial_hardening.sql
-- ============================================
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


-- ============================================
-- File: 0012_parent_self_checkin_foundation.sql
-- ============================================
-- ============================================
-- Migration 0012: Parent Self Check-in Domain Foundation
-- Applied via Supabase MCP
-- ============================================
-- This file is the repository source of truth for the parent self-checkin domain.
--
-- Tables:
--   public.parent_app_tokens - opaque tokens for parent app access (no account required)
--   public.parent_checkin_events - audit trail for self-service check-ins
--
-- Functions:
--   public.parent_self_checkin(site_id, parent_token, ip, user_agent) -> jsonb
--   public.write_parent_checkin_event(...) -> void
--
-- Design:
--   Parents receive a token (via QR card or link) linked to their pickup group.
--   No parent accounts needed - token is the credential.
--   Token is hashed (SHA-256) - never stored in plaintext.
--   Self-checkin creates arrivals with source='parent_app'.
--   Idempotent: duplicate scans return existing arrival.
--   RLS: only staff can view parent tokens and checkin events.

-- 1. Parent app tokens
create table if not exists public.parent_app_tokens (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  school_site_id uuid not null,
  pickup_group_id uuid not null,
  token_hash text not null unique,
  status text not null default 'active'
    check (status in ('active', 'revoked', 'expired')),
  issued_at timestamptz not null default now(),
  expires_at timestamptz,
  revoked_at timestamptz,
  revoked_reason text,
  last_used_at timestamptz,
  use_count integer not null default 0,
  created_by uuid,

  foreign key (organization_id, school_site_id)
    references public.school_sites(organization_id, id),
  foreign key (organization_id, school_site_id, pickup_group_id)
    references public.pickup_groups(organization_id, school_site_id, id)
);

create index idx_parent_app_tokens_hash on public.parent_app_tokens(token_hash) where status = 'active';
create index idx_parent_app_tokens_group on public.parent_app_tokens(pickup_group_id);

alter table public.parent_app_tokens enable row level security;

create policy parent_tokens_select_staff
  on public.parent_app_tokens for select to authenticated
  using (
    private.has_school_role(school_site_id, array['school_admin', 'dismissal_manager'])
    or private.is_platform_admin()
  );

create policy parent_tokens_insert_staff
  on public.parent_app_tokens for insert to authenticated
  with check (
    private.has_school_role(school_site_id, array['school_admin', 'dismissal_manager'])
    or private.is_platform_admin()
  );

create policy parent_tokens_update_staff
  on public.parent_app_tokens for update to authenticated
  using (
    private.has_school_role(school_site_id, array['school_admin', 'dismissal_manager'])
    or private.is_platform_admin()
  );

create policy parent_tokens_delete_staff
  on public.parent_app_tokens for delete to authenticated
  using (
    private.has_school_role(school_site_id, array['school_admin', 'dismissal_manager'])
    or private.is_platform_admin()
  );

-- 2. Parent check-in events
create table if not exists public.parent_checkin_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  school_site_id uuid not null,
  session_id uuid not null,
  pickup_group_id uuid not null,
  parent_token_id uuid,
  arrival_id uuid,
  outcome text not null,
  ip_address inet,
  user_agent text,
  metadata jsonb default '{}',
  created_at timestamptz not null default now(),

  foreign key (organization_id, school_site_id)
    references public.school_sites(organization_id, id),
  foreign key (session_id) references public.pickup_sessions(id),
  foreign key (organization_id, school_site_id, pickup_group_id)
    references public.pickup_groups(organization_id, school_site_id, id)
);

create index idx_parent_checkin_events_session on public.parent_checkin_events(session_id);
create index idx_parent_checkin_events_group on public.parent_checkin_events(pickup_group_id);

alter table public.parent_checkin_events enable row level security;

create policy parent_checkin_events_select_staff
  on public.parent_checkin_events for select to authenticated
  using (
    private.has_school_role(school_site_id, array['school_admin', 'dismissal_manager'])
    or private.is_platform_admin()
  );

-- 3. Parent self check-in function
create or replace function public.parent_self_checkin(
  p_site_id uuid,
  p_parent_token text,
  p_ip_address inet default null,
  p_user_agent text default null
)
returns jsonb
language plpgsql
security definer
set search_path to 'public', 'private'
as $$
declare
  v_site public.school_sites%rowtype;
  v_org_id uuid;
  v_token_hash text;
  v_parent_token public.parent_app_tokens%rowtype;
  v_pickup_group public.pickup_groups%rowtype;
  v_session_id uuid;
  v_today date;
  v_existing_arrival_id uuid;
  v_arrival_id uuid;
  v_queue_item public.pickup_queue_items%rowtype;
  v_seq integer;
  v_result jsonb;
begin
  select * into v_site from public.school_sites where id = p_site_id and status = 'active';
  if not found then raise exception 'SITE_NOT_FOUND'; end if;
  v_org_id := v_site.organization_id;

  if not exists (select 1 from public.organizations where id = v_org_id and status = 'active') then
    raise exception 'ORG_SUSPENDED';
  end if;

  if not private.is_entitlement_active(v_org_id, 'school_pickup') then
    raise exception 'ENTITLEMENT_MISSING';
  end if;

  v_token_hash := encode(digest(p_parent_token, 'sha256'), 'hex');
  select * into v_parent_token from public.parent_app_tokens
  where token_hash = v_token_hash and status = 'active';
  if not found then raise exception 'TOKEN_INVALID'; end if;

  if v_parent_token.school_site_id != p_site_id then raise exception 'WRONG_SITE'; end if;

  if v_parent_token.expires_at is not null and v_parent_token.expires_at < now() then
    raise exception 'TOKEN_EXPIRED';
  end if;

  select * into v_pickup_group from public.pickup_groups
  where id = v_parent_token.pickup_group_id and status = 'active';
  if not found then raise exception 'GROUP_INACTIVE'; end if;

  v_today := (now() at time zone v_site.timezone)::date;
  select id into v_session_id from public.pickup_sessions
  where school_site_id = p_site_id and service_date = v_today for update;

  if not found then
    v_session_id := public.open_pickup_session(p_site_id, v_today);
  elsif (select status from public.pickup_sessions where id = v_session_id) in ('closed', 'cancelled') then
    perform public.write_parent_checkin_event(
      v_org_id, p_site_id, v_session_id, v_parent_token.pickup_group_id,
      v_parent_token.id, null, 'closed_session', p_ip_address, p_user_agent
    );
    return jsonb_build_object('outcome', 'closed_session', 'message', 'Session is closed');
  end if;

  perform 1 from public.pickup_sessions where id = v_session_id for update;

  select id into v_existing_arrival_id from public.pickup_arrivals
  where session_id = v_session_id and pickup_group_id = v_pickup_group.id for update;

  if found then
    update public.parent_app_tokens set last_used_at = now(), use_count = use_count + 1 where id = v_parent_token.id;
    perform public.write_parent_checkin_event(
      v_org_id, p_site_id, v_session_id, v_pickup_group.id,
      v_parent_token.id, v_existing_arrival_id, 'duplicate', p_ip_address, p_user_agent
    );
    select jsonb_agg(jsonb_build_object('queue_item_id', q.id, 'student_id', q.student_id, 'sequence_number', q.sequence_number, 'status', q.current_status, 'student_name', s.first_name || ' ' || s.last_name))
    into v_result from public.pickup_queue_items q join public.school_students s on s.id = q.student_id where q.arrival_id = v_existing_arrival_id;
    return jsonb_build_object('outcome', 'duplicate', 'message', 'Already checked in', 'arrival_id', v_existing_arrival_id, 'queue_items', coalesce(v_result, '[]'::jsonb));
  end if;

  insert into public.pickup_arrivals (organization_id, school_site_id, session_id, pickup_group_id, checkin_source, checked_in_by)
  values (v_org_id, p_site_id, v_session_id, v_pickup_group.id, 'parent_app', null)
  returning id into v_arrival_id;

  insert into public.pickup_session_counters (session_id, next_sequence) values (v_session_id, 1) on conflict (session_id) do nothing;
  perform 1 from public.pickup_session_counters where session_id = v_session_id for update;

  v_result := '[]'::jsonb;
  for v_seq in
    select pgs.student_id from public.pickup_group_students pgs
    join public.school_students s on s.id = pgs.student_id
    where pgs.pickup_group_id = v_pickup_group.id and pgs.status = 'active' and s.status = 'active'
    order by pgs.created_at
  loop
    update public.pickup_session_counters set next_sequence = next_sequence + 1 where session_id = v_session_id returning next_sequence - 1 into v_seq;
    insert into public.pickup_queue_items (organization_id, school_site_id, session_id, arrival_id, student_id, sequence_number, current_status)
    values (v_org_id, p_site_id, v_session_id, v_arrival_id, v_seq, v_seq, 'arrived') returning id into v_queue_item.id;
    insert into public.pickup_status_events (organization_id, school_site_id, session_id, queue_item_id, from_status, to_status, actor_user_id)
    values (v_org_id, p_site_id, v_session_id, v_queue_item.id, null, 'arrived', null);
    v_result := v_result || jsonb_build_object('queue_item_id', v_queue_item.id, 'student_id', v_seq, 'sequence_number', v_seq, 'status', 'arrived');
  end loop;

  update public.parent_app_tokens set last_used_at = now(), use_count = use_count + 1 where id = v_parent_token.id;
  perform public.write_parent_checkin_event(v_org_id, p_site_id, v_session_id, v_pickup_group.id, v_parent_token.id, v_arrival_id, 'success', p_ip_address, p_user_agent);

  return jsonb_build_object('outcome', 'success', 'arrival_id', v_arrival_id, 'queue_items', v_result);
end;
$$;

-- 4. Helper function
create or replace function public.write_parent_checkin_event(
  p_org_id uuid, p_site_id uuid, p_session_id uuid, p_group_id uuid,
  p_token_id uuid, p_arrival_id uuid, p_outcome text, p_ip_address inet, p_user_agent text
)
returns void
language sql
security definer
set search_path to 'public'
as $$
  insert into public.parent_checkin_events (organization_id, school_site_id, session_id, pickup_group_id, parent_token_id, arrival_id, outcome, ip_address, user_agent)
  values (p_org_id, p_site_id, p_session_id, p_group_id, p_token_id, p_arrival_id, p_outcome, p_ip_address, p_user_agent);
$$;

-- 5. Revoke from anon/public, grant to authenticated
revoke execute on function public.parent_self_checkin(uuid, text, inet, text) from anon, public;
grant execute on function public.parent_self_checkin(uuid, text, inet, text) to authenticated;

revoke execute on function public.write_parent_checkin_event(uuid, uuid, uuid, uuid, uuid, uuid, text, inet, text) from anon, public;
grant execute on function public.write_parent_checkin_event(uuid, uuid, uuid, uuid, uuid, uuid, text, inet, text) to authenticated;

-- Record migration
insert into public.schema_migrations (filename, checksum, execution_ms)
values ('0012_parent_self_checkin_foundation.sql', 'applied_via_mcp', 0)
on conflict (filename) do nothing;


-- ============================================
-- File: 0013_agreement_enhancements.sql
-- ============================================
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


-- ============================================
-- File: 0013_shared_checkin_qr_queue_enhancements.sql
-- ============================================
-- ============================================
-- Migration 0013: Shared Check-In QR + Queue Enhancements
-- Applied via Supabase MCP
-- ============================================
-- Shared check-in QR with manual rotation model (active until replaced)
-- Queue transition with optimistic concurrency
-- Group-level arrival transitions
-- Exception flags on queue items
-- Realtime publication for queue tables

-- 1. Shared check-in codes table
create table if not exists public.shared_checkin_codes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  school_site_id uuid not null,
  purpose text not null default 'pickup_self_checkin'
    check (purpose in ('pickup_self_checkin')),
  lane text,
  token_hash text not null unique,
  status text not null default 'active'
    check (status in ('active', 'revoked', 'replaced', 'disabled')),
  generated_by uuid,
  replaced_by uuid,
  replaced_at timestamptz,
  revoked_at timestamptz,
  revoked_reason text,
  valid_from timestamptz,
  valid_until timestamptz,
  created_at timestamptz not null default now(),
  foreign key (organization_id, school_site_id)
    references public.school_sites(organization_id, id)
);

-- One active code per (site, purpose, lane)
create unique index idx_shared_checkin_active_unique
  on public.shared_checkin_codes (school_site_id, purpose, coalesce(lane, ''))
  where status = 'active';

create index idx_shared_checkin_codes_hash
  on public.shared_checkin_codes(token_hash) where status = 'active';

create index idx_shared_checkin_codes_site
  on public.shared_checkin_codes(school_site_id, created_at desc);

alter table public.shared_checkin_codes enable row level security;

create policy shared_checkin_select_staff on public.shared_checkin_codes for select to authenticated
  using (private.has_school_role(school_site_id, array['school_admin', 'dismissal_manager']) or private.has_org_role(organization_id, array['owner', 'admin']) or private.is_platform_admin());
create policy shared_checkin_insert_staff on public.shared_checkin_codes for insert to authenticated
  with check (private.has_school_role(school_site_id, array['school_admin', 'dismissal_manager']) or private.has_org_role(organization_id, array['owner', 'admin']) or private.is_platform_admin());
create policy shared_checkin_update_staff on public.shared_checkin_codes for update to authenticated
  using (private.has_school_role(school_site_id, array['school_admin', 'dismissal_manager']) or private.has_org_role(organization_id, array['owner', 'admin']) or private.is_platform_admin());
create policy shared_checkin_delete_staff on public.shared_checkin_codes for delete to authenticated
  using (private.has_school_role(school_site_id, array['school_admin']) or private.has_org_role(organization_id, array['owner', 'admin']) or private.is_platform_admin());

-- 2. Audit events for QR rotation
create table if not exists public.checkin_code_audit_events (
  id bigint primary key generated always as identity,
  organization_id uuid not null,
  school_site_id uuid not null,
  code_id uuid not null,
  event_type text not null check (event_type in ('created', 'replaced', 'revoked', 'printed', 'disabled')),
  actor_user_id uuid,
  metadata jsonb default '{}',
  created_at timestamptz not null default now(),
  foreign key (organization_id, school_site_id) references public.school_sites(organization_id, id),
  foreign key (code_id) references public.shared_checkin_codes(id)
);

create index idx_checkin_code_audit_site on public.checkin_code_audit_events(school_site_id, created_at desc);
create index idx_checkin_code_audit_code on public.checkin_code_audit_events(code_id);

alter table public.checkin_code_audit_events enable row level security;

create policy checkin_code_audit_select_staff on public.checkin_code_audit_events for select to authenticated
  using (private.has_school_role(school_site_id, array['school_admin', 'dismissal_manager']) or private.has_org_role(organization_id, array['owner', 'admin']) or private.is_platform_admin());

-- 3. Atomic rotation function
create or replace function public.rotate_checkin_code(p_site_id uuid, p_purpose text default 'pickup_self_checkin', p_lane text default null)
returns jsonb language plpgsql security definer set search_path to 'public', 'private' as $$
declare
  v_site public.school_sites%rowtype; v_org_id uuid; v_token text; v_token_hash text;
  v_old_code_id uuid; v_new_code_id uuid; v_lock_key bigint;
begin
  if auth.uid() is null then raise exception 'UNAUTHENTICATED'; end if;
  select * into v_site from public.school_sites where id = p_site_id and status = 'active';
  if not found then raise exception 'SITE_NOT_FOUND'; end if;
  v_org_id := v_site.organization_id;
  if not exists (select 1 from public.organizations where id = v_org_id and status = 'active') then raise exception 'ORG_SUSPENDED'; end if;
  if not private.is_entitlement_active(v_org_id, 'school_pickup') then raise exception 'ENTITLEMENT_MISSING'; end if;
  if not (private.has_school_role(p_site_id, array['school_admin', 'dismissal_manager']) or private.has_org_role(v_org_id, array['owner', 'admin']) or private.is_platform_admin()) then raise exception 'UNAUTHORIZED'; end if;
  v_lock_key := hash_text('checkin_code:' || p_site_id::text || ':' || p_purpose || ':' || coalesce(p_lane, ''));
  perform pg_advisory_xact_lock(v_lock_key);
  select id into v_old_code_id from public.shared_checkin_codes where school_site_id = p_site_id and purpose = p_purpose and coalesce(lane, '') = coalesce(p_lane, '') and status = 'active' for update;
  v_token := encode(gen_random_bytes(32), 'hex');
  v_token_hash := encode(digest(v_token, 'sha256'), 'hex');
  if v_old_code_id is not null then
    update public.shared_checkin_codes set status = 'replaced', replaced_at = now(), replaced_by = auth.uid() where id = v_old_code_id;
    insert into public.checkin_code_audit_events (organization_id, school_site_id, code_id, event_type, actor_user_id) values (v_org_id, p_site_id, v_old_code_id, 'replaced', auth.uid());
  end if;
  insert into public.shared_checkin_codes (organization_id, school_site_id, purpose, lane, token_hash, status, generated_by)
  values (v_org_id, p_site_id, p_purpose, p_lane, v_token_hash, 'active', auth.uid()) returning id into v_new_code_id;
  insert into public.checkin_code_audit_events (organization_id, school_site_id, code_id, event_type, actor_user_id) values (v_org_id, p_site_id, v_new_code_id, 'created', auth.uid());
  return jsonb_build_object('code_id', v_new_code_id, 'token', v_token, 'previous_code_id', v_old_code_id, 'created_at', now());
end;
$$;

-- 4. Revoke function
create or replace function public.revoke_checkin_code(p_code_id uuid, p_reason text default null)
returns void language plpgsql security definer set search_path to 'public', 'private' as $$
declare v_code public.shared_checkin_codes%rowtype;
begin
  if auth.uid() is null then raise exception 'UNAUTHENTICATED'; end if;
  select * into v_code from public.shared_checkin_codes where id = p_code_id;
  if not found then raise exception 'CODE_NOT_FOUND'; end if;
  if not (private.has_school_role(v_code.school_site_id, array['school_admin', 'dismissal_manager']) or private.has_org_role(v_code.organization_id, array['owner', 'admin']) or private.is_platform_admin()) then raise exception 'UNAUTHORIZED'; end if;
  if v_code.status not in ('active', 'disabled') then raise exception 'ALREADY_INACTIVE'; end if;
  update public.shared_checkin_codes set status = 'revoked', revoked_at = now(), revoked_reason = p_reason where id = p_code_id;
  insert into public.checkin_code_audit_events (organization_id, school_site_id, code_id, event_type, actor_user_id, metadata) values (v_code.organization_id, v_code.school_site_id, p_code_id, 'revoked', auth.uid(), jsonb_build_object('reason', p_reason));
end;
$$;

revoke execute on function public.rotate_checkin_code(uuid, text, text) from anon, public;
grant execute on function public.rotate_checkin_code(uuid, text, text) to authenticated;
revoke execute on function public.revoke_checkin_code(uuid, text) from anon, public;
grant execute on function public.revoke_checkin_code(uuid, text) to authenticated;

-- 5. Enhanced transition_queue_status with optimistic concurrency
create or replace function public.transition_queue_status(p_queue_item_id uuid, p_new_status text, p_reason text default null, p_expected_current_status text default null)
returns jsonb language plpgsql security definer set search_path to 'public', 'private' as $$
declare v_item public.pickup_queue_items%rowtype; v_old_status text; v_session public.pickup_sessions%rowtype;
begin
  select * into v_item from public.pickup_queue_items where id = p_queue_item_id for update;
  if not found then raise exception 'QUEUE_ITEM_NOT_FOUND'; end if;
  v_old_status := v_item.current_status;
  if p_expected_current_status is not null and p_expected_current_status != v_old_status then
    return jsonb_build_object('success', false, 'error', 'CONCURRENT_MODIFICATION', 'queue_item_id', p_queue_item_id, 'expected_status', p_expected_current_status, 'actual_status', v_old_status);
  end if;
  if not private.validate_queue_transition(v_old_status, p_new_status) then raise exception 'INVALID_TRANSITION: % -> %', v_old_status, p_new_status; end if;
  select * into v_session from public.pickup_sessions where id = v_item.session_id;
  if v_session.status != 'open' then raise exception 'SESSION_NOT_OPEN'; end if;
  if not (private.has_school_role(v_item.school_site_id, array['school_admin', 'dismissal_manager']) or private.is_platform_admin()
    or (private.has_school_role(v_item.school_site_id, array['scanner']) and p_new_status in ('preparing', 'ready', 'completed'))
    or (private.has_school_role(v_item.school_site_id, array['teacher']) and p_new_status in ('preparing', 'ready'))) then raise exception 'UNAUTHORIZED'; end if;
  update public.pickup_queue_items set current_status = p_new_status, completed_at = case when p_new_status = 'completed' then now() else completed_at end, updated_at = now() where id = p_queue_item_id;
  insert into public.pickup_status_events (organization_id, school_site_id, session_id, queue_item_id, from_status, to_status, actor_user_id, reason)
  values (v_item.organization_id, v_item.school_site_id, v_item.session_id, p_queue_item_id, v_old_status, p_new_status, auth.uid(), p_reason);
  return jsonb_build_object('queue_item_id', p_queue_item_id, 'from_status', v_old_status, 'to_status', p_new_status, 'success', true);
end;
$$;

-- 6. Group-level transition
create or replace function public.transition_arrival_status(p_arrival_id uuid, p_new_status text, p_reason text default null, p_expected_current_status text default null)
returns jsonb language plpgsql security definer set search_path to 'public', 'private' as $$
declare v_arrival public.pickup_arrivals%rowtype; v_session public.pickup_sessions%rowtype; v_item public.pickup_queue_items%rowtype; v_results jsonb := '[]'::jsonb; v_old_status text;
begin
  if auth.uid() is null then raise exception 'UNAUTHENTICATED'; end if;
  select * into v_arrival from public.pickup_arrivals where id = p_arrival_id;
  if not found then raise exception 'ARRIVAL_NOT_FOUND'; end if;
  select * into v_session from public.pickup_sessions where id = v_arrival.session_id;
  if v_session.status != 'open' then raise exception 'SESSION_NOT_OPEN'; end if;
  if not (private.has_school_role(v_arrival.school_site_id, array['school_admin', 'dismissal_manager']) or private.is_platform_admin()
    or (private.has_school_role(v_arrival.school_site_id, array['scanner']) and p_new_status in ('preparing', 'ready', 'completed'))
    or (private.has_school_role(v_arrival.school_site_id, array['teacher']) and p_new_status in ('preparing', 'ready'))) then raise exception 'UNAUTHORIZED'; end if;
  for v_item in select * from public.pickup_queue_items where arrival_id = p_arrival_id and current_status not in ('completed', 'cancelled') for update loop
    v_old_status := v_item.current_status;
    if p_expected_current_status is not null and p_expected_current_status != v_old_status then
      v_results := v_results || jsonb_build_object('queue_item_id', v_item.id, 'success', false, 'error', 'CONCURRENT_MODIFICATION', 'expected_status', p_expected_current_status, 'actual_status', v_old_status);
      continue;
    end if;
    if not private.validate_queue_transition(v_old_status, p_new_status) then
      v_results := v_results || jsonb_build_object('queue_item_id', v_item.id, 'success', false, 'error', 'INVALID_TRANSITION', 'from_status', v_old_status, 'to_status', p_new_status);
      continue;
    end if;
    update public.pickup_queue_items set current_status = p_new_status, completed_at = case when p_new_status = 'completed' then now() else completed_at end, updated_at = now() where id = v_item.id;
    insert into public.pickup_status_events (organization_id, school_site_id, session_id, queue_item_id, from_status, to_status, actor_user_id, reason)
    values (v_item.organization_id, v_item.school_site_id, v_item.session_id, v_item.id, v_old_status, p_new_status, auth.uid(), p_reason);
    v_results := v_results || jsonb_build_object('queue_item_id', v_item.id, 'from_status', v_old_status, 'to_status', p_new_status, 'success', true);
  end loop;
  return jsonb_build_object('results', v_results);
end;
$$;

revoke execute on function public.transition_queue_status(uuid, text, text, text) from anon, public;
grant execute on function public.transition_queue_status(uuid, text, text, text) to authenticated;
revoke execute on function public.transition_arrival_status(uuid, text, text, text) from anon, public;
grant execute on function public.transition_arrival_status(uuid, text, text, text) to authenticated;

-- 7. Exception flag columns
alter table public.pickup_queue_items add column if not exists exception_flag boolean default false;
alter table public.pickup_queue_items add column if not exists exception_reason text;
alter table public.pickup_queue_items add column if not exists exception_set_by uuid;
alter table public.pickup_queue_items add column if not exists exception_set_at timestamptz;

create index if not exists idx_queue_session_exception on public.pickup_queue_items(session_id) where exception_flag = true;

-- 8. Realtime publication
alter publication supabase_realtime add table public.pickup_queue_items;
alter publication supabase_realtime add table public.pickup_arrivals;
alter publication supabase_realtime add table public.pickup_sessions;

-- Record migration
insert into public.schema_migrations (filename, checksum, execution_ms)
values ('0013_shared_checkin_qr_queue_enhancements.sql', 'applied_via_mcp', 0)
on conflict (filename) do nothing;


-- ============================================
-- File: 0014_advisor_desk_light_touch.sql
-- ============================================
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


-- ============================================
-- File: 0014_engagement_artifacts_milestones.sql
-- ============================================
-- Migration: Engagement artifacts and milestones tables
-- These tables track deliverables and progress for engagements (Blueprint, Security Reviews, etc.)

-- ============================================
-- ENGAGEMENT ARTIFACTS
-- ============================================
create table if not exists public.engagement_artifacts (
  id uuid primary key default gen_random_uuid(),
  engagement_id uuid not null references public.engagements(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  artifact_type text not null
    check (artifact_type in ('blueprint_document', 'security_report', 'finding_report', 'scope_document', 'recommendation', 'other')),
  title text not null,
  description text,
  file_url text,
  file_size_bytes bigint,
  status text not null default 'draft'
    check (status in ('draft', 'in_review', 'published', 'archived')),
  published_at timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_engagement_artifacts_engagement on public.engagement_artifacts(engagement_id);
create index if not exists idx_engagement_artifacts_org on public.engagement_artifacts(organization_id);
create index if not exists idx_engagement_artifacts_status on public.engagement_artifacts(status);

-- RLS
alter table public.engagement_artifacts enable row level security;

drop policy if exists "engagement_artifacts_select_org_member" on public.engagement_artifacts;
create policy "engagement_artifacts_select_org_member" on public.engagement_artifacts
  for select using (
    private.is_org_member(organization_id) or private.is_platform_admin()
  );

-- Only platform admins can create/manage artifacts (advisor publishes deliverables)
drop policy if exists "engagement_artifacts_write_admin" on public.engagement_artifacts;
create policy "engagement_artifacts_write_admin" on public.engagement_artifacts
  for all using (
    private.is_platform_admin()
  ) with check (
    private.is_platform_admin()
  );

-- ============================================
-- ENGAGEMENT MILESTONES
-- ============================================
create table if not exists public.engagement_milestones (
  id uuid primary key default gen_random_uuid(),
  engagement_id uuid not null references public.engagements(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'completed', 'blocked', 'cancelled')),
  due_date timestamptz,
  completed_at timestamptz,
  display_order integer not null default 0,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_engagement_milestones_engagement on public.engagement_milestones(engagement_id);
create index if not exists idx_engagement_milestones_org on public.engagement_milestones(organization_id);
create index if not exists idx_engagement_milestones_status on public.engagement_milestones(status);

-- RLS
alter table public.engagement_milestones enable row level security;

drop policy if exists "engagement_milestones_select_org_member" on public.engagement_milestones;
create policy "engagement_milestones_select_org_member" on public.engagement_milestones
  for select using (
    private.is_org_member(organization_id) or private.is_platform_admin()
  );

-- Platform admins can manage milestones; org admins can update status
drop policy if exists "engagement_milestones_write_admin" on public.engagement_milestones;
create policy "engagement_milestones_write_admin" on public.engagement_milestones
  for all using (
    private.is_platform_admin()
  ) with check (
    private.is_platform_admin()
  );

drop policy if exists "engagement_milestones_update_org_admin" on public.engagement_milestones;
create policy "engagement_milestones_update_org_admin" on public.engagement_milestones
  for update using (
    private.has_org_role(organization_id, array['owner', 'admin']) or
    private.is_platform_admin()
  ) with check (
    private.has_org_role(organization_id, array['owner', 'admin']) or
    private.is_platform_admin()
  );

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================
do $$
declare
  tbl text;
begin
  for tbl in
    select unnest(array['engagement_artifacts', 'engagement_milestones'])
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
-- File: 0015_security_review_api_alignment.sql
-- ============================================
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


-- ============================================
-- File: 0016_commercial_identity_binding.sql
-- ============================================
-- Migration 0016: Commercial Identity Binding
-- Atomic organization creation RPC + blueprint_qualifications organization_id enforcement
-- Ensures every commercial purchase deterministically binds to an explicit organization

-- ============================================
-- 1. ATOMIC ORGANIZATION CREATION RPC
-- ============================================
-- Creates organization + owner membership in a single transaction.
-- Handles slug collisions deterministically via unique constraint + retry.
-- SECURITY DEFINER: runs with elevated privileges, validates caller identity internally.

create or replace function public.create_commercial_organization(
  p_name text,
  p_slug text default null,
  p_organization_kind text default 'business',
  p_creator_id uuid default null
)
returns table (
  org_id uuid,
  org_slug text,
  org_name text,
  created boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_slug text;
  v_base_slug text;
  v_suffix integer := 0;
  v_org_id uuid;
  v_max_attempts integer := 10;
  v_attempt integer := 0;
  v_kind text := coalesce(p_organization_kind, 'business');
  v_creator uuid := p_creator_id;
begin
  -- Validate kind
  if v_kind not in ('business', 'school', 'nonprofit', 'individual', 'internal', 'other') then
    v_kind := 'business';
  end if;

  -- Derive slug from name if not provided
  if p_slug is not null and p_slug ~ '^[a-z0-9-]+$' then
    v_base_slug := p_slug;
  else
    v_base_slug := lower(coalesce(p_name, 'workspace'));
    v_base_slug := regexp_replace(v_base_slug, '[^a-z0-9]+', '-', 'g');
    v_base_slug := regexp_replace(v_base_slug, '^-+|-+$', '', 'g');
    v_base_slug := left(v_base_slug, 30);
    if v_base_slug = '' then
      v_base_slug := 'workspace';
    end if;
  end if;

  v_slug := v_base_slug;

  -- Attempt insert with slug collision retry
  loop
    v_attempt := v_attempt + 1;
    if v_attempt > v_max_attempts then
      raise exception 'Unable to generate unique slug after % attempts', v_max_attempts;
    end if;

    begin
      insert into public.organizations (name, slug, organization_kind, status, created_by)
      values (p_name, v_slug, v_kind, 'active', v_creator)
      returning id into v_org_id;

      exit;
    exception when unique_violation then
      v_suffix := v_suffix + 1;
      v_slug := left(v_base_slug, 30 - length(v_suffix::text) - 1) || '-' || v_suffix::text;
    end;
  end loop;

  -- Create owner membership atomically (same transaction)
  if v_creator is not null then
    insert into public.organization_memberships (organization_id, user_id, role, status)
    values (v_org_id, v_creator, 'owner', 'active');
  end if;

  -- Audit the creation
  insert into public.audit_events (
    organization_id,
    action,
    entity_type,
    entity_id,
    actor_id,
    metadata
  ) values (
    v_org_id,
    'organization.created_commercial',
    'organization',
    v_org_id::text,
    v_creator,
    jsonb_build_object('name', p_name, 'slug', v_slug, 'kind', v_kind)
  );

  return query select v_org_id, v_slug, p_name, true;
end;
$$;

-- Grant execute to authenticated users only
grant execute on function public.create_commercial_organization(text, text, text, uuid) to authenticated;
revoke execute on function public.create_commercial_organization(text, text, text, uuid) from anon;

-- ============================================
-- 2. BLUEPRINT QUALIFICATIONS: ENFORCE ORGANIZATION ASSOCIATION
-- ============================================
-- organization_id already exists (nullable) from migration 0012.
-- Add index for user_id + organization_id lookups.
-- We keep it nullable for legacy records but new inserts from checkout
-- will require organization_id at the application level.

create index if not exists idx_blueprint_qual_user_org
  on public.blueprint_qualifications(user_id, organization_id);

-- ============================================
-- 3. ADD ORGANIZATION_ID INDEX TO ORGANIZATION_MEMBERSHIPS
-- ============================================
-- Speed up the "validate user can purchase for org" query
create index if not exists idx_memberships_user_org_status
  on public.organization_memberships(user_id, organization_id, status);


-- ============================================
-- File: 0017_add_fractional_ai_advisor_offering.sql
-- ============================================
-- Migration: Add fractional_ai_advisor offering
-- Date: 2026-08-15
-- Phase 2.5: Commercial Offer Architecture
--
-- Adds the fractional_ai_advisor offering to the offerings table.
-- This is required for entitlement activation and engagement creation
-- when a Fractional AI Advisor checkout completes.
--
-- Idempotent: uses WHERE NOT EXISTS to prevent duplicate inserts.

INSERT INTO offerings (offering_key, name, description, offering_kind, status)
SELECT
  'fractional_ai_advisor',
  'Fractional AI Advisor',
  'Executive AI advisory subscription for higher-stakes decisions. Strategy, architecture, vendor evaluation, build-vs-buy, and roadmap review. $1,250/month or $12,500/year.',
  'service',
  'active'
WHERE NOT EXISTS (
  SELECT 1 FROM offerings WHERE offering_key = 'fractional_ai_advisor'
);


-- ============================================
-- File: 0018_fractional_advisor_workspace.sql
-- ============================================
-- Migration: Fractional AI Advisor workspace tables
-- Date: 2026-08-15
-- Phase 2.5 P1: Onboarding + Decision Desk
--
-- 1. Expands engagement_decisions status constraint to support the
--    Decision Desk workflow (new, reviewing, evidence_needed, etc.)
-- 2. Creates fractional_onboarding table for the 5-minute onboarding flow
--
-- Idempotent: uses IF EXISTS / IF NOT EXISTS guards.

-- 1. Expand engagement_decisions status to support Decision Desk workflow
-- Existing values: open, decided, deferred, superseded
-- New values: new, reviewing, evidence_needed, next_session, decision_ready, closed
ALTER TABLE public.engagement_decisions DROP CONSTRAINT IF EXISTS dec_status_check;
ALTER TABLE public.engagement_decisions ADD CONSTRAINT dec_status_check
  CHECK (status = ANY (ARRAY[
    'new'::text,
    'reviewing'::text,
    'evidence_needed'::text,
    'next_session'::text,
    'decision_ready'::text,
    'decided'::text,
    'closed'::text,
    'deferred'::text,
    'superseded'::text,
    'open'::text
  ]));

-- 2. Create fractional_onboarding table
CREATE TABLE IF NOT EXISTS public.fractional_onboarding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  engagement_id uuid REFERENCES public.engagements(id) ON DELETE SET NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'not_started' CHECK (status = ANY (ARRAY['not_started'::text, 'in_progress'::text, 'completed'::text])),
  -- Organization context
  org_description text,
  top_outcomes text,
  -- Current AI picture
  ai_stage text,
  -- Decisions on the table
  decisions_text text,
  -- Systems / documents (optional)
  system_links text,
  -- Stakeholders
  stakeholders text,
  -- First session scheduling
  preferred_session_times text,
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- RLS
ALTER TABLE public.fractional_onboarding ENABLE ROW LEVEL SECURITY;

-- Policy: org members can read their own onboarding
CREATE POLICY fractional_onboarding_read ON public.fractional_onboarding
  FOR SELECT USING (
    organization_id IN (
      SELECT om.organization_id FROM public.organization_memberships om
      WHERE om.user_id = auth.uid() AND om.status = 'active'
    ) OR auth.uid() = user_id
  );

-- Policy: org members can insert/update their own onboarding
CREATE POLICY fractional_onboarding_write ON public.fractional_onboarding
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT om.organization_id FROM public.organization_memberships om
      WHERE om.user_id = auth.uid() AND om.status = 'active'
    )
  );

CREATE POLICY fractional_onboarding_update ON public.fractional_onboarding
  FOR UPDATE USING (
    organization_id IN (
      SELECT om.organization_id FROM public.organization_memberships om
      WHERE om.user_id = auth.uid() AND om.status = 'active'
    )
  );

-- Index for quick lookup
CREATE INDEX IF NOT EXISTS idx_fractional_onboarding_org ON public.fractional_onboarding(organization_id);


-- ============================================
-- File: 0019_product_access_requests.sql
-- ============================================
-- Migration: Product access requests (HAIEC, KestrelVoice, etc.)
-- Date: 2026-08-15
-- Phase 2.5 P2: Cross-product continuity
--
-- Creates a table for users to request access to products like HAIEC and
-- KestrelVoice. Subodh reviews and activates from the backend.
-- Idempotent.

CREATE TABLE IF NOT EXISTS public.product_access_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  offering_key text NOT NULL,
  status text NOT NULL DEFAULT 'requested' CHECK (status = ANY (ARRAY['requested'::text, 'approved'::text, 'activated'::text, 'declined'::text, 'cancelled'::text])),
  request_note text,
  admin_note text,
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE public.product_access_requests ENABLE ROW LEVEL SECURITY;

-- Org members can read their own requests
CREATE POLICY product_access_requests_read ON public.product_access_requests
  FOR SELECT USING (
    organization_id IN (
      SELECT om.organization_id FROM public.organization_memberships om
      WHERE om.user_id = auth.uid() AND om.status = 'active'
    )
  );

-- Org members can create requests
CREATE POLICY product_access_requests_insert ON public.product_access_requests
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT om.organization_id FROM public.organization_memberships om
      WHERE om.user_id = auth.uid() AND om.status = 'active'
    )
  );

-- Org members can cancel their own requests
CREATE POLICY product_access_requests_update ON public.product_access_requests
  FOR UPDATE USING (
    organization_id IN (
      SELECT om.organization_id FROM public.organization_memberships om
      WHERE om.user_id = auth.uid() AND om.status = 'active'
    )
  );

-- Index
CREATE INDEX IF NOT EXISTS idx_product_access_requests_org ON public.product_access_requests(organization_id);
CREATE INDEX IF NOT EXISTS idx_product_access_requests_status ON public.product_access_requests(status);


-- ============================================
-- File: 0020_terms_acceptance_records.sql
-- ============================================
-- Migration: Create terms_acceptance_records table
-- Date: 2026-08-15
-- Purpose: Record terms acceptance at checkout for advisory subscriptions
--
-- Stores: terms_version, service_schedule_slug, service_schedule_version,
-- checkout_session_id, user_id, organization_id, accepted_at

CREATE TABLE IF NOT EXISTS terms_acceptance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_key TEXT NOT NULL,
  terms_version TEXT NOT NULL,
  service_schedule_slug TEXT NOT NULL,
  service_schedule_version TEXT NOT NULL,
  checkout_session_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for looking up acceptance by organization
CREATE INDEX IF NOT EXISTS idx_terms_acceptance_org
  ON terms_acceptance_records(organization_id);

-- Index for looking up acceptance by checkout session
CREATE INDEX IF NOT EXISTS idx_terms_acceptance_session
  ON terms_acceptance_records(checkout_session_id);

-- Index for looking up acceptance by user
CREATE INDEX IF NOT EXISTS idx_terms_acceptance_user
  ON terms_acceptance_records(user_id);

-- Enable RLS
ALTER TABLE terms_acceptance_records ENABLE ROW LEVEL SECURITY;

-- Service role can read and write (used by checkout and webhook flows)
CREATE POLICY "Service role full access to terms acceptance"
  ON terms_acceptance_records
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Users can read their own acceptance records
CREATE POLICY "Users can read own terms acceptance"
  ON terms_acceptance_records
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Add helpful comment
COMMENT ON TABLE terms_acceptance_records IS
  'Records terms of service and service schedule acceptance at checkout for advisory subscriptions.';


-- ============================================
-- File: 0021_terms_acceptance_consent_integrity.sql
-- ============================================
-- Migration 0021: Enhance terms_acceptance_records for consent integrity
-- Date: 2026-08-15
-- Purpose: Add Stripe customer/subscription IDs, billing period, consent source,
-- and a unique constraint on checkout_session_id to prevent duplicate acceptance
-- records from duplicate webhook deliveries.
--
-- This migration is ADDITIVE — it does not rewrite migration 0020.
-- It adds columns, a unique constraint, and updates the comment.

-- Add new columns for consent binding
ALTER TABLE terms_acceptance_records
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS billing_period TEXT,
  ADD COLUMN IF NOT EXISTS consent_source TEXT NOT NULL DEFAULT 'stripe_checkout';

-- Add unique constraint on checkout_session_id to prevent duplicate records
-- from duplicate Stripe webhook deliveries (idempotent acceptance recording)
CREATE UNIQUE INDEX IF NOT EXISTS idx_terms_acceptance_session_unique
  ON terms_acceptance_records(checkout_session_id);

-- Update comment
COMMENT ON TABLE terms_acceptance_records IS
  'Records terms of service and service schedule acceptance at checkout completion. Acceptance is recorded ONLY after checkout.session.completed with verified Stripe consent. Unique constraint on checkout_session_id prevents duplicate records from duplicate webhook deliveries.';


-- ============================================
-- File: 0022_included_product_entitlements.sql
-- ============================================
-- Migration 0022: Create included_product_entitlements table
-- Date: 2026-08-15
-- Purpose: Separate included product ENTITLEMENT (granted at purchase) from
-- PROVISIONING (external account activation). This creates one canonical model
-- for HAIEC/Kestrel/Member Tools entitlements tied to advisory subscriptions.
--
-- States: included → ready_to_activate → provisioning → active → provisioning_failed → suspended → ended

CREATE TABLE IF NOT EXISTS included_product_entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  source_offer_key TEXT NOT NULL,
  product_key TEXT NOT NULL,  -- 'haiec', 'kestrel', 'member_tools'
  tier_or_plan TEXT NOT NULL,  -- e.g., 'advisor_essentials', 'scan', 'ai_number_basic', 'library', 'selected'
  seats INTEGER NOT NULL DEFAULT 1,
  credits INTEGER,
  entitlement_status TEXT NOT NULL DEFAULT 'included',
    -- included, ready_to_activate, provisioning, active, provisioning_failed, suspended, ended
  provisioning_status TEXT NOT NULL DEFAULT 'pending',
    -- pending, in_progress, provisioned, failed, not_applicable
  external_user_id TEXT,
  external_account_id TEXT,
  external_tier_mapped TEXT,  -- The actual tier name sent to the external system
  activated_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  provisioning_error TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for looking up entitlements by org
CREATE INDEX IF NOT EXISTS idx_included_product_ent_org
  ON included_product_entitlements(organization_id);

-- Index for looking up by source offer
CREATE INDEX IF NOT EXISTS idx_included_product_ent_offer
  ON included_product_entitlements(source_offer_key);

-- Unique constraint: one entitlement per org + product + source offer
CREATE UNIQUE INDEX IF NOT EXISTS idx_included_product_ent_unique
  ON included_product_entitlements(organization_id, product_key, source_offer_key);

-- Enable RLS
ALTER TABLE included_product_entitlements ENABLE ROW LEVEL SECURITY;

-- Service role full access
CREATE POLICY "Service role full access to included product entitlements"
  ON included_product_entitlements
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Users can read their org's entitlements (via org membership check)
CREATE POLICY "Users can read own org included product entitlements"
  ON included_product_entitlements
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT om.organization_id
      FROM organization_memberships om
      WHERE om.user_id = auth.uid() AND om.status = 'active'
    )
  );

COMMENT ON TABLE included_product_entitlements IS
  'Canonical model for included product entitlements (HAIEC, Kestrel, Member Tools) tied to advisory subscriptions. Separates entitlement (granted at purchase) from provisioning (external account activation).';


-- ============================================
-- File: 0023_fractional_operating_records.sql
-- ============================================
-- Migration 0023: Fractional operating system records
-- Date: 2026-08-15
-- Purpose: Create database-backed records for the Fractional AI Advisor operating system.
-- These tables back the 18-record operating model promised in the Service Schedule.
--
-- Tables created:
--   fractional_intake_records   — Bring Something to the Desk
--   fractional_opportunities    — Opportunity Registry
--   fractional_evidence         — Evidence & Inputs
--   fractional_working_sessions — Working Session Records with usage tracking
--   fractional_monthly_briefs   — Monthly Decision & Opportunity Brief
--   fractional_priorities       — Current Priorities
--
-- Existing tables reused:
--   engagement_decisions  — Decision Registry (enhanced)
--   engagement_actions     — Actions & Commitments
--   engagement_artifacts   — Decision Artifacts
--   engagement_outcomes    — Outcome / Learning

-- ===== fractional_intake_records (Bring Something to the Desk) =====
CREATE TABLE IF NOT EXISTS fractional_intake_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  engagement_id UUID REFERENCES engagements(id) ON DELETE SET NULL,
  intake_type TEXT NOT NULL,
    -- 'ask_question', 'explore_opportunity', 'review_decision', 'review_vendor',
    -- 'review_system', 'explore_partnership', 'share_report', 'something_changed'
  title TEXT NOT NULL,
  what_is_happening TEXT,
  why_it_matters TEXT,
  desired_outcome TEXT,
  deadline TEXT,
  related_priority TEXT,
  sensitivity TEXT,
  attachment_links TEXT[],
  submitted_by_user_id UUID,
  status TEXT NOT NULL DEFAULT 'new',
    -- 'new', 'reviewing', 'in_progress', 'addressed', 'closed'
  advisor_response TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_frac_intake_org ON fractional_intake_records(organization_id);
CREATE INDEX IF NOT EXISTS idx_frac_intake_engagement ON fractional_intake_records(engagement_id);
CREATE INDEX IF NOT EXISTS idx_frac_intake_status ON fractional_intake_records(status);

-- ===== fractional_opportunities (Opportunity Registry) =====
CREATE TABLE IF NOT EXISTS fractional_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  engagement_id UUID REFERENCES engagements(id) ON DELETE SET NULL,
  opportunity TEXT NOT NULL,
  source TEXT,
  why_it_matters TEXT,
  expected_leverage_value TEXT,
  evidence TEXT,
  assumptions TEXT,
  status TEXT NOT NULL DEFAULT 'new',
    -- 'new', 'exploring', 'evidence_needed', 'candidate', 'recommended',
    -- 'deferred', 'rejected', 'advanced', 'closed'
  recommended_next_step TEXT,
  related_decision_id UUID REFERENCES engagement_decisions(id) ON DELETE SET NULL,
  revisit_trigger TEXT,
  outcome TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_frac_opp_org ON fractional_opportunities(organization_id);
CREATE INDEX IF NOT EXISTS idx_frac_opp_status ON fractional_opportunities(status);

-- ===== fractional_evidence (Evidence & Inputs) =====
CREATE TABLE IF NOT EXISTS fractional_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  engagement_id UUID REFERENCES engagements(id) ON DELETE SET NULL,
  evidence_type TEXT NOT NULL,
    -- 'note', 'link', 'report', 'proposal', 'vendor_material', 'architecture_material',
    -- 'metric', 'client_assertion', 'public_external'
  title TEXT NOT NULL,
  description TEXT,
  link_url TEXT,
  provenance TEXT NOT NULL DEFAULT 'client_provided',
    -- 'client_provided', 'external_public', 'advisor_analysis', 'tool_result', 'verified_outcome'
  related_decision_id UUID REFERENCES engagement_decisions(id) ON DELETE SET NULL,
  related_opportunity_id UUID REFERENCES fractional_opportunities(id) ON DELETE SET NULL,
  created_by_user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_frac_evidence_org ON fractional_evidence(organization_id);

-- ===== fractional_working_sessions (Working Session Records) =====
CREATE TABLE IF NOT EXISTS fractional_working_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  engagement_id UUID REFERENCES engagements(id) ON DELETE SET NULL,
  session_type TEXT NOT NULL DEFAULT 'working',
    -- 'working', 'activation_call'
  scheduled_at TIMESTAMPTZ,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  status TEXT NOT NULL DEFAULT 'scheduled',
    -- 'scheduled', 'completed', 'cancelled', 'no_show'
  participants TEXT[],
  agenda TEXT,
  notes TEXT,
  follow_ups TEXT,
  billing_period_month TEXT,
    -- 'YYYY-MM' format — which billing period this session counts against
  rolled_over_from_month TEXT,
    -- If this session was rolled over from a previous month
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_frac_sessions_org ON fractional_working_sessions(organization_id);
CREATE INDEX IF NOT EXISTS idx_frac_sessions_period ON fractional_working_sessions(billing_period_month);

-- ===== fractional_monthly_briefs (Monthly Decision & Opportunity Brief) =====
CREATE TABLE IF NOT EXISTS fractional_monthly_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  engagement_id UUID REFERENCES engagements(id) ON DELETE SET NULL,
  brief_month TEXT NOT NULL,
    -- 'YYYY-MM' format
  what_changed TEXT,
  what_matters TEXT,
  decisions_in_play TEXT,
  opportunities_in_play TEXT,
  evidence_still_missing TEXT,
  advisor_point_of_view TEXT,
  recommended_next_moves TEXT,
  authored_by_user_id UUID,
  status TEXT NOT NULL DEFAULT 'draft',
    -- 'draft', 'published'
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_frac_briefs_org ON fractional_monthly_briefs(organization_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_frac_briefs_unique ON fractional_monthly_briefs(organization_id, brief_month);

-- ===== fractional_priorities (Current Priorities) =====
CREATE TABLE IF NOT EXISTS fractional_priorities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  engagement_id UUID REFERENCES engagements(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority_order INTEGER NOT NULL DEFAULT 0,
  owner TEXT,
  status TEXT NOT NULL DEFAULT 'active',
    -- 'active', 'reviewing', 'completed', 'deferred'
  target_review_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_frac_priorities_org ON fractional_priorities(organization_id);

-- ===== Enable RLS on all new tables =====
ALTER TABLE fractional_intake_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE fractional_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE fractional_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE fractional_working_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE fractional_monthly_briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE fractional_priorities ENABLE ROW LEVEL SECURITY;

-- Service role full access on all tables
CREATE POLICY "Service role full access to fractional_intake_records" ON fractional_intake_records FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access to fractional_opportunities" ON fractional_opportunities FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access to fractional_evidence" ON fractional_evidence FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access to fractional_working_sessions" ON fractional_working_sessions FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access to fractional_monthly_briefs" ON fractional_monthly_briefs FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access to fractional_priorities" ON fractional_priorities FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Users can read their org's records
CREATE POLICY "Users can read own org fractional_intake_records" ON fractional_intake_records FOR SELECT TO authenticated USING (organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active'));
CREATE POLICY "Users can read own org fractional_opportunities" ON fractional_opportunities FOR SELECT TO authenticated USING (organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active'));
CREATE POLICY "Users can read own org fractional_evidence" ON fractional_evidence FOR SELECT TO authenticated USING (organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active'));
CREATE POLICY "Users can read own org fractional_working_sessions" ON fractional_working_sessions FOR SELECT TO authenticated USING (organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active'));
CREATE POLICY "Users can read own org fractional_monthly_briefs" ON fractional_monthly_briefs FOR SELECT TO authenticated USING (organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active'));
CREATE POLICY "Users can read own org fractional_priorities" ON fractional_priorities FOR SELECT TO authenticated USING (organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active'));

-- Add updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER set_updated_at_fractional_intake BEFORE UPDATE ON fractional_intake_records FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_fractional_opp BEFORE UPDATE ON fractional_opportunities FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_fractional_evidence BEFORE UPDATE ON fractional_evidence FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_fractional_sessions BEFORE UPDATE ON fractional_working_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_fractional_briefs BEFORE UPDATE ON fractional_monthly_briefs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_fractional_priorities BEFORE UPDATE ON fractional_priorities FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================
-- File: 0024_advisor_affiliations_session_usage.sql
-- ============================================
-- Migration 0024: Advisor affiliations, session usage tracking, and monthly brief auto-creation
-- Date: 2026-08-15
-- Purpose: Complete remaining Phase 2.6 promises
--
-- 1. advisor_affiliations — Approved Advisor Affiliation records for Fractional
-- 2. fractional_session_usage — Monthly session usage tracking with rollover
-- 3. Auto-create monthly brief trigger on engagement creation

-- ===== advisor_affiliations =====
CREATE TABLE IF NOT EXISTS advisor_affiliations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  engagement_id UUID REFERENCES engagements(id) ON DELETE SET NULL,
  affiliate_name TEXT NOT NULL,
  affiliate_role TEXT,
  affiliate_email TEXT,
  affiliate_company TEXT,
  relationship_type TEXT NOT NULL DEFAULT 'approved_advisor',
    -- 'approved_advisor', 'introduced_partner', 'external_expert'
  status TEXT NOT NULL DEFAULT 'approved',
    -- 'pending', 'approved', 'revoked'
  approved_at TIMESTAMPTZ DEFAULT now(),
  revoked_at TIMESTAMPTZ,
  notes TEXT,
  created_by_user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_advisor_aff_org ON advisor_affiliations(organization_id);
CREATE INDEX IF NOT EXISTS idx_advisor_aff_status ON advisor_affiliations(status);

-- ===== fractional_session_usage =====
-- Tracks monthly working session usage and rollover for Fractional engagements.
-- One row per org per billing period month.
CREATE TABLE IF NOT EXISTS fractional_session_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  engagement_id UUID REFERENCES engagements(id) ON DELETE SET NULL,
  billing_period_month TEXT NOT NULL,
    -- 'YYYY-MM' format
  included_sessions INTEGER NOT NULL DEFAULT 2,
    -- Fractional includes 2 working sessions/month
  used_sessions INTEGER NOT NULL DEFAULT 0,
  rolled_over_from_prev INTEGER NOT NULL DEFAULT 0,
    -- Sessions carried over from the previous month (max 1)
  rolled_over_to_next INTEGER NOT NULL DEFAULT 0,
    -- Sessions carried into the next month (max 1)
  max_rollover INTEGER NOT NULL DEFAULT 1,
    -- Per spec: one unused session may roll into the immediately following month only
  period_start DATE,
  period_end DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_session_usage_org ON fractional_session_usage(organization_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_session_usage_unique ON fractional_session_usage(organization_id, billing_period_month);

-- ===== Enable RLS =====
ALTER TABLE advisor_affiliations ENABLE ROW LEVEL SECURITY;
ALTER TABLE fractional_session_usage ENABLE ROW LEVEL SECURITY;

-- Service role full access
CREATE POLICY "Service role full access to advisor_affiliations" ON advisor_affiliations FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access to fractional_session_usage" ON fractional_session_usage FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Users can read their org's records
CREATE POLICY "Users can read own org advisor_affiliations" ON advisor_affiliations FOR SELECT TO authenticated USING (organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active'));
CREATE POLICY "Users can read own org fractional_session_usage" ON fractional_session_usage FOR SELECT TO authenticated USING (organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active'));

-- ===== Triggers for updated_at =====
CREATE TRIGGER set_updated_at_advisor_aff BEFORE UPDATE ON advisor_affiliations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_session_usage BEFORE UPDATE ON fractional_session_usage FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ===== Function: compute_session_usage_for_month =====
-- Returns the effective number of sessions available for a given month,
-- accounting for rollover from the previous month.
CREATE OR REPLACE FUNCTION compute_session_usage_for_month(
  p_org_id UUID,
  p_month TEXT
) RETURNS TABLE (
  included_sessions INTEGER,
  used_sessions INTEGER,
  rolled_over_from_prev INTEGER,
  available_sessions INTEGER,
  rollover_eligible INTEGER
) AS $$
DECLARE
  v_usage fractional_session_usage%ROWTYPE;
  v_prev_month TEXT;
  v_prev_usage fractional_session_usage%ROWTYPE;
  v_rollover INTEGER := 0;
BEGIN
  -- Get current month usage
  SELECT * INTO v_usage
  FROM fractional_session_usage
  WHERE organization_id = p_org_id AND billing_period_month = p_month;

  -- Compute previous month for rollover
  v_prev_month := to_char((p_month || '-01')::date - interval '1 month', 'YYYY-MM');

  -- Get previous month usage to compute rollover
  SELECT * INTO v_prev_usage
  FROM fractional_session_usage
  WHERE organization_id = p_org_id AND billing_period_month = v_prev_month;

  -- Rollover: max 1 unused session from previous month
  IF v_prev_usage.organization_id IS NOT NULL THEN
    v_rollover := LEAST(
      GREATEST(v_prev_usage.included_sessions + v_prev_usage.rolled_over_from_prev - v_prev_usage.used_sessions, 0),
      v_prev_usage.max_rollover
    );
  END IF;

  -- Return computed values
  RETURN QUERY
  SELECT
    COALESCE(v_usage.included_sessions, 2),
    COALESCE(v_usage.used_sessions, 0),
    v_rollover,
    COALESCE(v_usage.included_sessions, 2) + v_rollover - COALESCE(v_usage.used_sessions, 0),
    GREATEST(COALESCE(v_usage.included_sessions, 2) + v_rollover - COALESCE(v_usage.used_sessions, 0), 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================
-- File: 0025_fractional_outcomes.sql
-- ============================================
-- Migration 0025: Fractional Outcome/Learning records
-- Date: 2026-08-15
-- Purpose: Create a proper Outcome/Learning table for the Fractional operating system.
--
-- The existing engagement_outcomes table is a metrics tracking table
-- (baseline/target/current values). The spec requires an Outcome/Learning record
-- that tracks: what happened, whether assumptions held, result, lesson, follow-up,
-- reopen/revisit trigger, and supports "Something Changed" reopen logic.
--
-- This migration creates fractional_outcomes as a distinct table.

CREATE TABLE IF NOT EXISTS fractional_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  engagement_id UUID REFERENCES engagements(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  what_happened TEXT,
  assumptions_held TEXT,
    -- 'yes', 'no', 'partially', or free text
  result TEXT,
  lesson TEXT,
  follow_up TEXT,
  revisit_trigger TEXT,
  related_decision_id UUID REFERENCES engagement_decisions(id) ON DELETE SET NULL,
  related_opportunity_id UUID REFERENCES fractional_opportunities(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'recorded',
    -- 'recorded', 'revisited', 'closed', 'reopened'
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_frac_outcomes_org ON fractional_outcomes(organization_id);
CREATE INDEX IF NOT EXISTS idx_frac_outcomes_status ON fractional_outcomes(status);

-- Enable RLS
ALTER TABLE fractional_outcomes ENABLE ROW LEVEL SECURITY;

-- Service role full access
CREATE POLICY "Service role full access to fractional_outcomes" ON fractional_outcomes FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Users can read their org's records
CREATE POLICY "Users can read own org fractional_outcomes" ON fractional_outcomes FOR SELECT TO authenticated USING (organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active'));

-- Trigger for updated_at
CREATE TRIGGER set_updated_at_fractional_outcomes BEFORE UPDATE ON fractional_outcomes FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================
-- File: 0026_phase27_commercial_readiness.sql
-- ============================================
-- Migration 0026: Phase 2.7 — Commercial launch readiness infrastructure
-- Date: 2026-08-15
-- Purpose: Add tables for customer state tracking, failure observability,
-- conversion analytics, member tools registry, and scheduling links.

-- ============================================
-- 1. COMMERCIAL FAILURES (observability + retry)
-- ============================================
CREATE TABLE IF NOT EXISTS commercial_failures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  user_id UUID,  -- auth.users id (no FK since auth schema)
  failure_type TEXT NOT NULL,
    -- 'checkout' | 'webhook' | 'entitlement' | 'haiec_provisioning' | 'kestrel_provisioning'
    -- | 'email' | 'onboarding' | 'advisor_request' | 'artifact' | 'portal' | 'cancellation'
  severity TEXT NOT NULL DEFAULT 'warning',
    -- 'warning' | 'error' | 'critical'
  message TEXT NOT NULL,
  details JSONB,
  stripe_event_id TEXT,
  retryable BOOLEAN NOT NULL DEFAULT false,
  retried_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_commercial_failures_org ON commercial_failures(organization_id);
CREATE INDEX IF NOT EXISTS idx_commercial_failures_type ON commercial_failures(failure_type);
CREATE INDEX IF NOT EXISTS idx_commercial_failures_unresolved ON commercial_failures(resolved_at) WHERE (resolved_at IS NULL);
CREATE INDEX IF NOT EXISTS idx_commercial_failures_created ON commercial_failures(created_at DESC);

ALTER TABLE commercial_failures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to commercial_failures" ON commercial_failures FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Platform admins can read commercial_failures" ON commercial_failures FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM platform_user_roles WHERE user_id = auth.uid() AND role = 'platform_admin')
);

-- ============================================
-- 2. CONVERSION EVENTS (privacy-conscious funnel)
-- ============================================
CREATE TABLE IF NOT EXISTS conversion_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
    -- 'public_offer_viewed' | 'pricing_viewed' | 'checkout_started' | 'checkout_completed'
    -- | 'checkout_abandoned' | 'onboarding_started' | 'onboarding_completed'
    -- | 'included_product_activation_started' | 'included_product_activated'
    -- | 'advisor_request_created' | 'advisor_response_delivered'
    -- | 'fractional_desk_item_created' | 'working_session_completed'
    -- | 'artifact_published' | 'monthly_brief_published' | 'subscription_cancelled'
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  user_id UUID,
  offer_key TEXT,
  billing_period TEXT,
  session_id TEXT,
  page_path TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conversion_events_name ON conversion_events(event_name);
CREATE INDEX IF NOT EXISTS idx_conversion_events_org ON conversion_events(organization_id);
CREATE INDEX IF NOT EXISTS idx_conversion_events_created ON conversion_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversion_events_offer ON conversion_events(offer_key);

ALTER TABLE conversion_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to conversion_events" ON conversion_events FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Platform admins can read conversion_events" ON conversion_events FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM platform_user_roles WHERE user_id = auth.uid() AND role = 'platform_admin')
);
CREATE POLICY "Users can track own conversion events" ON conversion_events FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================
-- 3. MEMBER TOOLS REGISTRY
-- ============================================
CREATE TABLE IF NOT EXISTS member_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
    -- 'assessment' | 'governance' | 'research' | 'planning' | 'monitoring' | 'reference' | 'utility'
  access_level TEXT NOT NULL DEFAULT 'ADVISOR_SELECTED',
    -- 'PUBLIC' | 'ADVISOR_SELECTED' | 'FRACTIONAL_LIBRARY' | 'ADMIN_ONLY' | 'EXPERIMENTAL'
  allowed_plans TEXT[] NOT NULL DEFAULT ARRAY['ai_advisor_desk', 'fractional_ai_advisor'],
  external_url TEXT,
  internal_path TEXT,
  requires_provisioning BOOLEAN NOT NULL DEFAULT false,
  production_ready BOOLEAN NOT NULL DEFAULT false,
  visible_to_client BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_member_tools_access ON member_tools(access_level);
CREATE INDEX IF NOT EXISTS idx_member_tools_order ON member_tools(display_order);

ALTER TABLE member_tools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to member_tools" ON member_tools FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can read production-ready visible tools" ON member_tools FOR SELECT TO authenticated USING (
  production_ready = true AND visible_to_client = true AND access_level NOT IN ('ADMIN_ONLY', 'EXPERIMENTAL')
);

CREATE TRIGGER set_updated_at_member_tools BEFORE UPDATE ON member_tools FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 4. SCHEDULING LINKS (Activation Call + Working Sessions)
-- ============================================
CREATE TABLE IF NOT EXISTS scheduling_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  engagement_id UUID REFERENCES engagements(id) ON DELETE SET NULL,
  link_type TEXT NOT NULL,
    -- 'activation_call' | 'working_session'
  scheduling_url TEXT NOT NULL,
    -- External scheduling URL (Calendly, Google Calendar appointment, etc.)
  status TEXT NOT NULL DEFAULT 'pending',
    -- 'pending' | 'scheduled' | 'completed' | 'cancelled' | 'expired'
  scheduled_at TIMESTAMPTZ,
  duration_minutes INTEGER,
  session_usage_month TEXT,
    -- For working sessions: links to fractional_session_usage billing_period_month
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_scheduling_links_org ON scheduling_links(organization_id);
CREATE INDEX IF NOT EXISTS idx_scheduling_links_type ON scheduling_links(link_type);
CREATE INDEX IF NOT EXISTS idx_scheduling_links_status ON scheduling_links(status);

ALTER TABLE scheduling_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to scheduling_links" ON scheduling_links FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Users can read own org scheduling_links" ON scheduling_links FOR SELECT TO authenticated USING (
  organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active')
);
CREATE POLICY "Users can insert own org scheduling_links" ON scheduling_links FOR INSERT TO authenticated WITH CHECK (
  organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active')
);
CREATE POLICY "Users can update own org scheduling_links" ON scheduling_links FOR UPDATE TO authenticated USING (
  organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active')
);

CREATE TRIGGER set_updated_at_scheduling_links BEFORE UPDATE ON scheduling_links FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 5. CUSTOMER LIFECYCLE STATE (derived, not duplicating Stripe)
-- ============================================
CREATE TABLE IF NOT EXISTS customer_lifecycle_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL UNIQUE REFERENCES organizations(id) ON DELETE CASCADE,
  offer_key TEXT,
  state TEXT NOT NULL DEFAULT 'PROSPECT',
    -- 'PROSPECT' | 'CHECKOUT_STARTED' | 'ACTIVE_SETUP_REQUIRED' | 'ACTIVE'
    -- | 'PAYMENT_ISSUE' | 'CANCEL_AT_PERIOD_END' | 'READ_ONLY' | 'ENDED'
  previous_state TEXT,
  state_changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  entitlement_active BOOLEAN NOT NULL DEFAULT false,
  onboarding_complete BOOLEAN NOT NULL DEFAULT false,
  has_included_products BOOLEAN NOT NULL DEFAULT false,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  period_end TIMESTAMPTZ,
  readonly_until TIMESTAMPTZ,
  last_interaction_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_customer_lifecycle_org ON customer_lifecycle_states(organization_id);
CREATE INDEX IF NOT EXISTS idx_customer_lifecycle_state ON customer_lifecycle_states(state);
CREATE INDEX IF NOT EXISTS idx_customer_lifecycle_offer ON customer_lifecycle_states(offer_key);

ALTER TABLE customer_lifecycle_states ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to customer_lifecycle_states" ON customer_lifecycle_states FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Platform admins can read customer_lifecycle_states" ON customer_lifecycle_states FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM platform_user_roles WHERE user_id = auth.uid() AND role = 'platform_admin')
);
CREATE POLICY "Users can read own org lifecycle state" ON customer_lifecycle_states FOR SELECT TO authenticated USING (
  organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active')
);

CREATE TRIGGER set_updated_at_customer_lifecycle BEFORE UPDATE ON customer_lifecycle_states FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 6. SEED MEMBER TOOLS
-- ============================================
INSERT INTO member_tools (tool_key, name, description, category, access_level, allowed_plans, internal_path, production_ready, visible_to_client, display_order) VALUES
  ('ai_controls_scorecard', 'AI Controls Scorecard', 'Self-assessment tool for evaluating AI governance maturity across key control areas.', 'assessment', 'ADVISOR_SELECTED', ARRAY['ai_advisor_desk', 'fractional_ai_advisor'], '/ai-controls', true, true, 10),
  ('vendor_review_template', 'Vendor Review Template', 'Structured template for evaluating AI vendor proposals and capabilities.', 'governance', 'ADVISOR_SELECTED', ARRAY['ai_advisor_desk', 'fractional_ai_advisor'], NULL, true, true, 20),
  ('decision_framework', 'Decision Framework Template', 'Structured framework for documenting AI investment decisions with trade-offs and evidence.', 'planning', 'FRACTIONAL_LIBRARY', ARRAY['fractional_ai_advisor'], NULL, true, true, 30),
  ('opportunity_canvas', 'Opportunity Canvas', 'One-page canvas for evaluating AI opportunities against value, feasibility, and evidence.', 'planning', 'FRACTIONAL_LIBRARY', ARRAY['fractional_ai_advisor'], NULL, true, true, 40),
  ('architecture_review_checklist', 'Architecture Review Checklist', 'Checklist for reviewing AI system architecture against production readiness criteria.', 'governance', 'FRACTIONAL_LIBRARY', ARRAY['fractional_ai_advisor'], NULL, true, true, 50),
  ('evidence_log_template', 'Evidence Log Template', 'Template for maintaining structured evidence and provenance for AI decisions.', 'reference', 'FRACTIONAL_LIBRARY', ARRAY['fractional_ai_advisor'], NULL, true, true, 60),
  ('monthly_brief_template', 'Monthly Brief Template', 'Template for the monthly decision and opportunity brief structure.', 'reference', 'FRACTIONAL_LIBRARY', ARRAY['fractional_ai_advisor'], NULL, true, true, 70),
  ('session_preparation_guide', 'Session Preparation Guide', 'Guide for preparing for working sessions with your advisor.', 'reference', 'FRACTIONAL_LIBRARY', ARRAY['fractional_ai_advisor'], NULL, true, true, 80),
  ('ai_risk_register', 'AI Risk Register', 'Template for tracking AI-related risks, mitigations, and owners.', 'monitoring', 'FRACTIONAL_LIBRARY', ARRAY['fractional_ai_advisor'], NULL, true, true, 90),
  ('csm_assessment_tool', 'CSM Assessment Tool', 'Self-assessment tool based on Cognitive Systems Management framework.', 'assessment', 'ADVISOR_SELECTED', ARRAY['ai_advisor_desk', 'fractional_ai_advisor'], '/cognitive-systems-management/assessment', true, true, 100)
ON CONFLICT (tool_key) DO NOTHING;


-- ============================================
-- File: 0027_test_organizations.sql
-- ============================================
-- Migration 0027: Create safe demo/test organizations for Phase 2.7 validation
-- Date: 2026-08-15
-- Purpose: Create synthetic test organizations representing the 4 subscription paths.
-- These are clearly synthetic and must never trigger real customer communications or billing.

-- Insert test organizations
INSERT INTO organizations (id, name, slug, organization_kind, status, created_at) VALUES
  ('a0000000-0000-0000-0000-000000000001', '[TEST] $99 Monthly Client', 'test-99-monthly', 'business', 'active', '2026-08-01T00:00:00Z'),
  ('a0000000-0000-0000-0000-000000000002', '[TEST] $99 Annual Client', 'test-99-annual', 'business', 'active', '2026-08-01T00:00:00Z'),
  ('a0000000-0000-0000-0000-000000000003', '[TEST] Fractional Monthly Client', 'test-fractional-monthly', 'business', 'active', '2026-08-01T00:00:00Z'),
  ('a0000000-0000-0000-0000-000000000004', '[TEST] Fractional Annual Client', 'test-fractional-annual', 'business', 'active', '2026-08-01T00:00:00Z')
ON CONFLICT (slug) DO NOTHING;

-- Insert entitlements for test orgs (using actual offering IDs from the database)
INSERT INTO organization_entitlements (organization_id, offering_id, status, source_type, valid_until, created_at) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'f2e0ad12-3f79-43c9-9aa1-19f422eaf1f5', 'active', 'subscription', '2026-09-01T00:00:00Z', '2026-08-01T00:00:00Z'),
  ('a0000000-0000-0000-0000-000000000002', 'f2e0ad12-3f79-43c9-9aa1-19f422eaf1f5', 'active', 'subscription', '2027-08-01T00:00:00Z', '2026-08-01T00:00:00Z'),
  ('a0000000-0000-0000-0000-000000000003', '02f16c8a-e3ba-4507-9942-cc98421fb287', 'active', 'subscription', '2026-09-01T00:00:00Z', '2026-08-01T00:00:00Z'),
  ('a0000000-0000-0000-0000-000000000004', '02f16c8a-e3ba-4507-9942-cc98421fb287', 'active', 'subscription', '2027-08-01T00:00:00Z', '2026-08-01T00:00:00Z')
ON CONFLICT DO NOTHING;

-- Insert included product entitlements
INSERT INTO included_product_entitlements (organization_id, source_offer_key, product_key, tier_or_plan, seats, credits, entitlement_status, provisioning_status, created_at) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'ai_advisor_desk', 'haiec', 'advisor_essentials', 1, 0, 'included', 'ready_to_activate', '2026-08-01T00:00:00Z'),
  ('a0000000-0000-0000-0000-000000000001', 'ai_advisor_desk', 'kestrel', 'ai_number_basic', 1, 20, 'included', 'ready_to_activate', '2026-08-01T00:00:00Z'),
  ('a0000000-0000-0000-0000-000000000002', 'ai_advisor_desk', 'haiec', 'advisor_essentials', 1, 0, 'included', 'active', '2026-08-01T00:00:00Z'),
  ('a0000000-0000-0000-0000-000000000002', 'ai_advisor_desk', 'kestrel', 'ai_number_basic', 1, 20, 'included', 'active', '2026-08-01T00:00:00Z'),
  ('a0000000-0000-0000-0000-000000000003', 'fractional_ai_advisor', 'haiec', 'scan', 1, 0, 'included', 'ready_to_activate', '2026-08-01T00:00:00Z'),
  ('a0000000-0000-0000-0000-000000000003', 'fractional_ai_advisor', 'kestrel', 'ai_number_basic', 1, 20, 'included', 'ready_to_activate', '2026-08-01T00:00:00Z'),
  ('a0000000-0000-0000-0000-000000000004', 'fractional_ai_advisor', 'haiec', 'scan', 1, 0, 'included', 'active', '2026-08-01T00:00:00Z'),
  ('a0000000-0000-0000-0000-000000000004', 'fractional_ai_advisor', 'kestrel', 'ai_number_basic', 1, 20, 'included', 'active', '2026-08-01T00:00:00Z')
ON CONFLICT DO NOTHING;

-- Insert Fractional engagement for test orgs C and D
INSERT INTO engagements (organization_id, engagement_type, status, starts_at, created_at) VALUES
  ('a0000000-0000-0000-0000-000000000003', 'fractional', 'active', '2026-08-01T00:00:00Z', '2026-08-01T00:00:00Z'),
  ('a0000000-0000-0000-0000-000000000004', 'fractional', 'active', '2026-08-01T00:00:00Z', '2026-08-01T00:00:00Z')
ON CONFLICT DO NOTHING;

-- Insert customer lifecycle states
INSERT INTO customer_lifecycle_states (organization_id, offer_key, state, entitlement_active, onboarding_complete, has_included_products, created_at) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'ai_advisor_desk', 'ACTIVE', true, true, true, '2026-08-01T00:00:00Z'),
  ('a0000000-0000-0000-0000-000000000002', 'ai_advisor_desk', 'ACTIVE', true, true, true, '2026-08-01T00:00:00Z'),
  ('a0000000-0000-0000-0000-000000000003', 'fractional_ai_advisor', 'ACTIVE_SETUP_REQUIRED', true, false, true, '2026-08-01T00:00:00Z'),
  ('a0000000-0000-0000-0000-000000000004', 'fractional_ai_advisor', 'ACTIVE', true, true, true, '2026-08-01T00:00:00Z')
ON CONFLICT (organization_id) DO NOTHING;

-- Insert session usage for test orgs C and D
INSERT INTO fractional_session_usage (organization_id, billing_period_month, included_sessions, used_sessions, max_rollover, created_at) VALUES
  ('a0000000-0000-0000-0000-000000000003', '2026-08', 2, 0, 1, '2026-08-01T00:00:00Z'),
  ('a0000000-0000-0000-0000-000000000004', '2026-08', 2, 0, 1, '2026-08-01T00:00:00Z')
ON CONFLICT DO NOTHING;


-- ============================================
-- File: 0028_advisor_desk_onboarding.sql
-- ============================================
-- Migration 0028: Advisor Desk onboarding - Context Profile + Watchlist
-- Date: 2026-08-17
-- Purpose: Support the rebuilt /ai-advisor experience.
--   1. advisor_context_profiles: progressive organizational AI context intake (save/resume)
--   2. advisor_watchlist_items: seeded watchlist from intake, calibrated by Subodh
-- These tables are scoped to the AI Advisor Desk subscription and reuse existing
-- organization tenancy + RLS patterns from migration 0026.

-- ============================================
-- 1. ADVISOR CONTEXT PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS advisor_context_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL UNIQUE REFERENCES organizations(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started',
    -- 'not_started' | 'in_progress' | 'completed'
  -- JSONB holds the progressive intake payload. Structured but flexible so
  -- branching and save/resume work without schema churn.
  profile_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    -- Expected shape (all optional until submitted):
    -- {
    --   organization: { name, website, industry, primaryMarkets, companySize, memberRole },
    --   priorities: { topPriorities[], next90DayGoals[], operationalBottlenecks[], areasToImprove[] },
    --   technology: { currentSystems[], aiProductsUsed[], importantVendors[], aiProjectsInProgress[], architectureConstraints[] },
    --   workflows: { aiCandidateWorkflows[], manualBottlenecks[], customerFacingAi[], employeeFacingAi[] },
    --   decisions: { decisionsInPlay[], vendorEvaluations[], upcomingInvestments[], deadlines[] },
    --   market: { competitorsToWatch[], vendorsToWatch[] },
    --   riskGovernance: { sensitiveDataCategories[], regulatedActivities[], governanceConcerns[], policyMaturity },
    --   jurisdiction: { operatingRegions[], aiUseRegions[] },
    --   watchPreferences: { priorityAreas[] }
    -- }
  completed_at TIMESTAMPTZ,
  last_saved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_advisor_context_profiles_org ON advisor_context_profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_advisor_context_profiles_status ON advisor_context_profiles(status);

ALTER TABLE advisor_context_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to advisor_context_profiles" ON advisor_context_profiles FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Users can read own org context profile" ON advisor_context_profiles FOR SELECT TO authenticated USING (
  organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active')
);
CREATE POLICY "Users can insert own org context profile" ON advisor_context_profiles FOR INSERT TO authenticated WITH CHECK (
  organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active')
);
CREATE POLICY "Users can update own org context profile" ON advisor_context_profiles FOR UPDATE TO authenticated USING (
  organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active')
);

CREATE TRIGGER set_updated_at_advisor_context_profiles BEFORE UPDATE ON advisor_context_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 2. ADVISOR WATCHLIST ITEMS
-- ============================================
CREATE TABLE IF NOT EXISTS advisor_watchlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
    -- 'opportunity' | 'decision' | 'technology_vendor' | 'risk_governance' | 'law_regulatory' | 'open_question'
  title TEXT NOT NULL,
  source TEXT,
    -- 'intake_seed' | 'advisor_added' | 'signal_detected'
  relevance TEXT,
    -- 'high' | 'medium' | 'low' | 'watching'
  status TEXT NOT NULL DEFAULT 'watching',
    -- 'watching' | 'active' | 'addressed' | 'closed'
  recommended_next_action TEXT,
  advisor_notes TEXT,
  is_draft BOOLEAN NOT NULL DEFAULT false,
    -- true when auto-drafted from intake, pending Subodh calibration
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_advisor_watchlist_org ON advisor_watchlist_items(organization_id);
CREATE INDEX IF NOT EXISTS idx_advisor_watchlist_category ON advisor_watchlist_items(category);
CREATE INDEX IF NOT EXISTS idx_advisor_watchlist_status ON advisor_watchlist_items(status);

ALTER TABLE advisor_watchlist_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to advisor_watchlist_items" ON advisor_watchlist_items FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Users can read own org watchlist" ON advisor_watchlist_items FOR SELECT TO authenticated USING (
  organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active')
);
CREATE POLICY "Users can insert own org watchlist" ON advisor_watchlist_items FOR INSERT TO authenticated WITH CHECK (
  organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active')
);
CREATE POLICY "Users can update own org watchlist" ON advisor_watchlist_items FOR UPDATE TO authenticated USING (
  organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active')
);

CREATE TRIGGER set_updated_at_advisor_watchlist BEFORE UPDATE ON advisor_watchlist_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 3. ADVISOR ONBOARDING PROGRESS (lightweight, reuses customer_lifecycle_states)
-- ============================================
-- The existing customer_lifecycle_states table has onboarding_complete BOOLEAN.
-- We add a dedicated onboarding_steps JSONB column to track the 3-step checklist
-- without duplicating lifecycle state.
ALTER TABLE customer_lifecycle_states ADD COLUMN IF NOT EXISTS advisor_onboarding_steps JSONB DEFAULT '{
  "context_intake": "not_started",
  "watchlist_review": "not_started",
  "activation_call": "not_started"
}'::jsonb;

COMMENT ON COLUMN customer_lifecycle_states.advisor_onboarding_steps IS 'Tracks the 3-step Advisor Desk onboarding checklist: context_intake, watchlist_review, activation_call. Values: not_started | in_progress | completed.';


-- ============================================
-- File: 0029_ai_work_orders.sql
-- ============================================
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


-- ============================================
-- File: 0030_work_order_rls_and_defaults.sql
-- ============================================
-- 0030_work_order_rls_and_defaults.sql
-- Fix RLS issues from 0029:
--   1. work_order_number should be auto-generated (BEFORE INSERT trigger)
--   2. Org admins must NOT be able to set authoritative commercial fields
--      (status=paid, payment_id, engagement_id, stripe ids, delivered_at, etc.)
--   3. ai_work_order_updates author_role must be server-derived, not client-set
--   4. Customers must not be able to create internal (is_client_visible=false) notes

-- ============================================
-- 1. Auto-generate work_order_number on insert
-- ============================================
-- Drop the old NOT NULL constraint temporarily is not needed;
-- instead we use a BEFORE INSERT trigger that sets work_order_number
-- if not provided. This makes app code simpler: just don't pass it.
create or replace function public.auto_generate_work_order_number()
returns trigger as $$
begin
  if new.work_order_number is null or new.work_order_number = '' then
    new.work_order_number := public.generate_work_order_number();
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_ai_work_orders_auto_number on public.ai_work_orders;
create trigger trg_ai_work_orders_auto_number
  before insert on public.ai_work_orders
  for each row execute function public.auto_generate_work_order_number();

-- ============================================
-- 2. Replace broad org-admin UPDATE policy with column-scoped policy
-- ============================================
-- Org owner/admin may update ONLY non-authoritative fields:
--   title, desired_outcome, target_date, metadata
-- Authoritative fields (status, payment_id, engagement_id, stripe_*,
--   scope_status, scope_accepted_at, scope_accepted_by, delivered_at,
--   completed_at, purchased_by_user_id, work_order_number)
-- may only be changed by platform_admin or service role.
drop policy if exists "wo_update_org_admin" on public.ai_work_orders;

-- Customer-facing update: only non-authoritative fields
create policy "wo_update_org_customer_fields" on public.ai_work_orders
  for update using (
    private.has_org_role(organization_id, array['owner', 'admin']) or
    private.is_platform_admin()
  ) with check (
    private.has_org_role(organization_id, array['owner', 'admin']) or
    private.is_platform_admin()
  );

-- Note: RLS cannot restrict individual columns in Postgres.
-- The authoritative-field protection is enforced at the API layer
-- (server-side code uses service role for status/payment/engagement transitions).
-- RLS ensures only org admins + platform_admin can update at all.

-- ============================================
-- 3. Fix ai_work_order_updates: restrict author_role + is_client_visible
-- ============================================
-- Drop the old permissive insert policy.
drop policy if exists "wo_updates_insert_org_member" on public.ai_work_order_updates;

-- New insert policy: any org member may insert, but:
--   author_role must be 'client' (enforced by CHECK + trigger)
--   is_client_visible must be true (enforced by trigger)
-- Advisor/platform_admin updates are inserted via service role only.
create policy "wo_updates_insert_client_only" on public.ai_work_order_updates
  for insert with check (
    exists (
      select 1 from public.ai_work_orders wo
      where wo.id = work_order_id
      and (private.is_org_member(wo.organization_id) or private.is_platform_admin())
    )
  );

-- Trigger: enforce that client-side inserts cannot set advisor/platform_admin role
-- or mark updates as internal (is_client_visible=false).
-- Service role bypasses RLS and these triggers do not fire for service role
-- in the typical path, but for safety we add a trigger that checks auth.role().
create or replace function public.enforce_work_order_update_author()
returns trigger as $$
begin
  -- Only enforce for authenticated (non-service) role
  -- auth.uid() is null for service role / anon
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

drop trigger if exists trg_wo_updates_enforce_author on public.ai_work_order_updates;
create trigger trg_wo_updates_enforce_author
  before insert on public.ai_work_order_updates
  for each row execute function public.enforce_work_order_update_author();

-- ============================================
-- 4. Scope acceptances: ensure accepted_by is auth.uid() for client inserts
-- ============================================
-- The scope acceptance should be created via API using service role,
-- with accepted_by set to the authenticated user. This trigger ensures
-- that if a non-service user inserts, accepted_by must match their auth.uid().
create or replace function public.enforce_scope_acceptance_author()
returns trigger as $$
begin
  if auth.uid() is not null then
    if new.accepted_by <> auth.uid() then
      raise exception 'accepted_by must match the authenticated user';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_wo_scope_enforce_author on public.ai_work_order_scope_acceptances;
create trigger trg_wo_scope_enforce_author
  before insert on public.ai_work_order_scope_acceptances
  for each row execute function public.enforce_scope_acceptance_author();


-- ============================================
-- File: 0031_work_order_fulfillment.sql
-- ============================================
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


-- ============================================
-- File: 0032_work_order_scope_versions.sql
-- ============================================
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


-- ============================================
-- File: 0033_org_invitation_fractional_integrity.sql
-- ============================================
-- 0033_org_invitation_fractional_integrity.sql
-- Organization access, invitation, and Fractional integrity hardening.
-- All changes are additive and backwards-compatible.
--
-- 1. Add requested_seat_offerings to organization_invitations
-- 2. Add email_sent flag to organization_invitations
-- 3. Add advisor_operator platform role support
-- 4. Define/replace accept_invitation RPC with seat assignment + atomic membership
-- 5. Add assign_service_seat_atomic RPC (concurrency-safe seat assignment)
-- 6. Add scheduling_links status check constraint + advisor-authoritative enforcement
-- 7. Add fractional_session_usage atomic increment RPC

-- ============================================
-- 1. requested_seat_offerings on invitations
-- ============================================
-- Stores the offering keys the inviter requested to be assigned on acceptance.
-- NULL/empty = no service seat assignment (plain org member invitation).
alter table public.organization_invitations
  add column if not exists requested_seat_offerings text[] default null;

-- ============================================
-- 2. email_sent flag on invitations
-- ============================================
-- Tracks whether the invitation email was successfully delivered. Allows
-- admins to see failed deliveries and resend.
alter table public.organization_invitations
  add column if not exists email_sent boolean default false;

-- ============================================
-- 3. advisor_operator platform role support
-- ============================================
-- The platform_user_roles table already has a check constraint for role.
-- We need to expand it to include 'advisor_operator'.
alter table public.platform_user_roles drop constraint if exists platform_user_roles_role_check;
alter table public.platform_user_roles add constraint platform_user_roles_role_check
  check (role in ('platform_admin', 'support', 'advisor_operator'));

-- ============================================
-- 4. accept_invitation RPC (with seat assignment)
-- ============================================
-- Atomically:
--   - validates the invitation exists by token_hash + email
--   - validates not expired, not revoked, not already consumed
--   - validates the invited email matches (caller pre-checks auth email)
--   - creates the organization_membership (or returns already_member)
--   - assigns requested service seats (best-effort, does NOT fail if seat full)
--   - marks invitation consumed (accepted_at)
--   - returns a jsonb with membership_id, org_slug, and seat_assignment_results
create or replace function public.accept_invitation(
  inv_token text,
  inv_email text
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_inv record;
  v_membership_id uuid;
  v_existing_membership record;
  v_org_slug text;
  v_seat_results jsonb := '[]'::jsonb;
  v_offering record;
  v_current_seats integer;
  v_seat_limit integer;
begin
  -- Find the invitation by token hash + email
  select * into v_inv from public.organization_invitations
    where token_hash = inv_token
      and lower(email) = lower(inv_email)
    limit 1;

  if not found then
    raise exception 'invitation_invalid';
  end if;

  if v_inv.revoked_at is not null then
    raise exception 'invitation_revoked';
  end if;

  if v_inv.accepted_at is not null then
    raise exception 'invitation_already_accepted';
  end if;

  if v_inv.expires_at is not null and v_inv.expires_at < now() then
    raise exception 'invitation_expired';
  end if;

  -- Get org slug for redirect
  select slug into v_org_slug from public.organizations where id = v_inv.organization_id;

  -- Check if user is already a member (by email → user_id lookup)
  select m.id, m.role into v_existing_membership
    from public.organization_memberships m
    join auth.users u on u.id = m.user_id
    where m.organization_id = v_inv.organization_id
      and lower(u.email) = lower(inv_email)
      and m.status = 'active'
    limit 1;

  if found then
    -- Already a member — mark invitation consumed, return existing membership
    update public.organization_invitations
      set accepted_at = now()
      where id = v_inv.id;

    -- Still try to assign requested seats
    if v_inv.requested_seat_offerings is not null and array_length(v_inv.requested_seat_offerings, 1) > 0 then
      v_seat_results := public.assign_invitation_seats(
        v_inv.organization_id,
        v_existing_membership.id,
        v_inv.requested_seat_offerings
      );
    end if;

    return jsonb_build_object(
      'membership_id', v_existing_membership.id,
      'already_member', true,
      'org_slug', v_org_slug,
      'seat_results', v_seat_results
    );
  end if;

  -- Create membership — look up user by email
  declare
    v_user_id uuid;
  begin
    select id into v_user_id from auth.users where lower(email) = lower(inv_email) limit 1;
    if v_user_id is null then
      raise exception 'user_not_found';
    end if;

    insert into public.organization_memberships (organization_id, user_id, role, status)
    values (v_inv.organization_id, v_user_id, v_inv.role, 'active')
    on conflict (organization_id, user_id) do update
      set role = excluded.role, status = 'active', joined_at = now()
    returning id into v_membership_id;

    -- Assign requested service seats (best-effort)
    if v_inv.requested_seat_offerings is not null and array_length(v_inv.requested_seat_offerings, 1) > 0 then
      v_seat_results := public.assign_invitation_seats(
        v_inv.organization_id,
        v_user_id,
        v_inv.requested_seat_offerings
      );
    end if;

    -- Mark invitation consumed
    update public.organization_invitations
      set accepted_at = now()
      where id = v_inv.id;

    -- Audit
    perform private.write_audit_event(
      'invitation.accepted', 'invitation', v_inv.organization_id, v_user_id, v_inv.id,
      jsonb_build_object('role', v_inv.role, 'seats', v_seat_results)
    );

    return jsonb_build_object(
      'membership_id', v_membership_id,
      'already_member', false,
      'org_slug', v_org_slug,
      'seat_results', v_seat_results
    );
  end;
end;
$$;

-- Helper: assign seats for an accepted invitation (best-effort, does NOT fail)
create or replace function public.assign_invitation_seats(
  p_org_id uuid,
  p_user_id uuid,
  p_offering_keys text[]
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_key text;
  v_result jsonb := '[]'::jsonb;
  v_offering_id uuid;
  v_current integer;
  v_limit integer;
  v_assigned boolean;
begin
  foreach v_key in array p_offering_keys loop
    select id into v_offering_id from public.offerings where offering_key = v_key limit 1;
    if v_offering_id is null then
      v_result := v_result || jsonb_build_array(jsonb_build_object('offering_key', v_key, 'assigned', false, 'reason', 'offering_not_found'));
      continue;
    end if;

    -- Count current active seats for this offering
    select count(*) into v_current
      from public.member_offering_roles
      where organization_id = p_org_id
        and offering_id = v_offering_id
        and status = 'active';

    -- Get seat limit from offer config (hardcoded for known offerings)
    v_limit := case v_key
      when 'ai_advisor_desk' then 3
      when 'fractional_ai_advisor' then 1
      when 'advisory' then 1
      else null
    end;

    if v_limit is not null and v_current >= v_limit then
      v_result := v_result || jsonb_build_array(jsonb_build_object('offering_key', v_key, 'assigned', false, 'reason', 'seat_limit_reached'));
      continue;
    end if;

    -- Assign the seat
    insert into public.member_offering_roles (organization_id, user_id, offering_id, role, status)
    values (p_org_id, p_user_id, v_offering_id, 'user', 'active')
    on conflict (organization_id, user_id, offering_id)
    do update set status = 'active';

    v_result := v_result || jsonb_build_array(jsonb_build_object('offering_key', v_key, 'assigned', true));
  end loop;

  return v_result;
end;
$$;

-- ============================================
-- 5. assign_service_seat_atomic RPC
-- ============================================
-- Concurrency-safe seat assignment. Uses SELECT FOR UPDATE + count check
-- to prevent two simultaneous requests from both assigning the last seat.
create or replace function public.assign_service_seat_atomic(
  p_org_id uuid,
  p_user_id uuid,
  p_offering_key text,
  p_role text default 'user'
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_offering_id uuid;
  v_current integer;
  v_limit integer;
begin
  select id into v_offering_id from public.offerings where offering_key = p_offering_key limit 1;
  if v_offering_id is null then
    return jsonb_build_object('success', false, 'error', 'offering_not_found');
  end if;

  -- Lock the relevant rows to prevent concurrent assignment
  -- Count current active seats with lock
  select count(*) into v_current
    from public.member_offering_roles
    where organization_id = p_org_id
      and offering_id = v_offering_id
      and status = 'active'
    for update;

  -- Get seat limit
  v_limit := case p_offering_key
    when 'ai_advisor_desk' then 3
    when 'fractional_ai_advisor' then 1
    when 'advisory' then 1
    else null
  end;

  if v_limit is not null and v_current >= v_limit then
    return jsonb_build_object('success', false, 'error', 'seat_limit_reached', 'current', v_current, 'limit', v_limit);
  end if;

  -- Assign
  insert into public.member_offering_roles (organization_id, user_id, offering_id, role, status)
  values (p_org_id, p_user_id, v_offering_id, p_role, 'active')
  on conflict (organization_id, user_id, offering_id)
  do update set status = 'active', role = p_role;

  return jsonb_build_object('success', true, 'current', v_current + 1, 'limit', v_limit);
end;
$$;

-- ============================================
-- 6. Scheduling links status constraint
-- ============================================
-- Add a check constraint for valid scheduling statuses.
alter table public.scheduling_links drop constraint if exists scheduling_links_status_check;
alter table public.scheduling_links add constraint scheduling_links_status_check
  check (status in ('not_started', 'scheduling', 'scheduled', 'deferred', 'completed', 'cancelled', 'no_show', 'pending'));

-- Add a column for who last set the status (for authority enforcement)
alter table public.scheduling_links
  add column if not exists status_set_by uuid,
  add column if not exists status_set_by_role text,
  add column if not exists status_set_at timestamptz;

-- ============================================
-- 7. Atomic session usage increment + session insert RPC
-- ============================================
-- Atomically increments session usage AND inserts the working session record.
-- If either fails, both are rolled back.
create or replace function public.create_working_session_atomic(
  p_org_id uuid,
  p_engagement_id uuid,
  p_billing_period_month text,
  p_session_data jsonb
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_usage record;
  v_available integer;
  v_session_id uuid;
  v_included integer := 2;
  v_max_rollover integer := 1;
  v_rolled_over integer := 0;
  v_prev_usage record;
  v_prev_month text;
begin
  -- Get or create usage record for this billing month
  select * into v_usage from public.fractional_session_usage
    where organization_id = p_org_id
      and billing_period_month = p_billing_period_month
    for update;

  if not found then
    -- Compute rollover from previous month
    v_prev_month := to_char((p_billing_period_month || '-01')::date - interval '1 month', 'YYYY-MM');
    select * into v_prev_usage from public.fractional_session_usage
      where organization_id = p_org_id
        and billing_period_month = v_prev_month
      limit 1;

    if found then
      declare
        v_prev_available integer;
      begin
        v_prev_available := v_prev_usage.included_sessions + v_prev_usage.rolled_over_from_prev - v_prev_usage.used_sessions;
        v_rolled_over := least(greatest(v_prev_available, 0), v_prev_usage.max_rollover);
      end;
    end if;

    insert into public.fractional_session_usage (
      organization_id, engagement_id, billing_period_month,
      included_sessions, used_sessions, rolled_over_from_prev,
      rolled_over_to_next, max_rollover
    ) values (
      p_org_id, p_engagement_id, p_billing_period_month,
      v_included, 0, v_rolled_over, 0, v_max_rollover
    )
    returning * into v_usage;
  end if;

  -- Check availability
  v_available := v_usage.included_sessions + v_usage.rolled_over_from_prev - v_usage.used_sessions;
  if v_available <= 0 then
    return jsonb_build_object(
      'success', false,
      'error', 'session_limit_reached',
      'available', 0,
      'used', v_usage.used_sessions
    );
  end if;

  -- Insert the working session record FIRST (within the same transaction)
  insert into public.fractional_working_sessions (
    organization_id, engagement_id, billing_period_month,
    session_type, scheduled_at, participants, agenda, status
  ) values (
    p_org_id,
    p_engagement_id,
    p_billing_period_month,
    p_session_data->>'session_type',
    (p_session_data->>'scheduled_at')::timestamptz,
    p_session_data->'participants',
    p_session_data->>'agenda',
    coalesce(p_session_data->>'status', 'scheduled')
  )
  returning id into v_session_id;

  -- NOW increment usage (same transaction — if this fails, the session insert rolls back too)
  update public.fractional_session_usage
    set used_sessions = used_sessions + 1
    where id = v_usage.id;

  return jsonb_build_object(
    'success', true,
    'session_id', v_session_id,
    'available', v_available - 1,
    'used', v_usage.used_sessions + 1
  );
end;
$$;

-- ============================================
-- 8. Revoke/Grant execute permissions
-- ============================================
revoke execute on function public.accept_invitation(text, text) from public, anon;
grant execute on function public.accept_invitation(text, text) to authenticated, postgres;

revoke execute on function public.assign_invitation_seats(uuid, uuid, text[]) from public, anon;
grant execute on function public.assign_invitation_seats(uuid, uuid, text[]) to postgres;

revoke execute on function public.assign_service_seat_atomic(uuid, uuid, text, text) from public, anon;
grant execute on function public.assign_service_seat_atomic(uuid, uuid, text, text) to postgres;

revoke execute on function public.create_working_session_atomic(uuid, uuid, text, jsonb) from public, anon;
grant execute on function public.create_working_session_atomic(uuid, uuid, text, jsonb) to authenticated, postgres;


-- ============================================
-- File: production_economics_security.sql
-- ============================================
-- ============================================
-- PRODUCTION ECONOMICS + SECURITY MIGRATION
-- ============================================
-- Applied via 3 Supabase migrations:
--   1. security_fixes_rls_and_revoke
--   2. performance_indexes
--   3. ai_advisor_tables
--   4. fix_security_definer_revoke_public
-- ============================================

-- ============================================
-- 1. Enable RLS on signup_email_domains
-- ============================================
ALTER TABLE public.signup_email_domains ENABLE ROW LEVEL SECURITY;

CREATE POLICY signup_domains_select_authenticated
  ON public.signup_email_domains
  FOR SELECT
  TO authenticated
  USING (type = 'allow');

-- ============================================
-- 2. Revoke EXECUTE from PUBLIC on SECURITY DEFINER functions
--    Must revoke from PUBLIC (not just anon/authenticated) since
--    PostgreSQL grants EXECUTE to PUBLIC by default.
--    Then grant back only to postgres (service role).
-- ============================================
REVOKE EXECUTE ON FUNCTION public.auto_join_edu_to_demo() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.hook_restrict_signup_by_email_domain(event jsonb) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.prevent_last_owner_removal() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.reseed_demo_data() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.close_stale_sessions(p_site_id uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.ensure_active_dismissal_session(p_site_id uuid, p_service_date date) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.set_release_eligibility(p_queue_item_id uuid, p_organization_id uuid, p_school_site_id uuid, p_release_at timestamp with time zone, p_override_reason text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.process_pickup_checkin(p_site_id uuid, p_credential_token text, p_pickup_group_id uuid, p_source text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.write_parent_checkin_event(p_org_id uuid, p_site_id uuid, p_session_id uuid, p_group_id uuid, p_token_id uuid, p_arrival_id uuid, p_outcome text, p_ip_address inet, p_user_agent text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.transition_arrival_status(p_arrival_id uuid, p_new_status text, p_reason text, p_expected_current_status text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.transition_queue_status(p_queue_item_id uuid, p_new_status text, p_reason text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.transition_queue_status(p_queue_item_id uuid, p_new_status text, p_reason text, p_expected_current_status text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_classroom(p_actor_user_id uuid, p_org_id uuid, p_site_id uuid, p_classroom_id uuid, p_name text, p_grade_label text, p_teacher_display_label text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_school_site(p_actor_user_id uuid, p_org_id uuid, p_site_id uuid, p_name text, p_timezone text, p_status text, p_address_line1 text, p_address_line2 text, p_city text, p_state_province text, p_postal_code text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_student(p_actor_user_id uuid, p_org_id uuid, p_site_id uuid, p_student_id uuid, p_first_name text, p_last_name text, p_external_student_id text, p_classroom_id uuid, p_status text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.create_classroom(p_actor_user_id uuid, p_org_id uuid, p_site_id uuid, p_name text, p_grade_label text, p_teacher_display_label text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.create_school_site(p_actor_user_id uuid, p_org_id uuid, p_name text, p_slug text, p_timezone text, p_address_line1 text, p_address_line2 text, p_city text, p_state_province text, p_postal_code text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.create_student_with_group(p_actor_user_id uuid, p_org_id uuid, p_site_id uuid, p_first_name text, p_last_name text, p_external_student_id text, p_classroom_id uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.import_students(p_actor_user_id uuid, p_org_id uuid, p_site_id uuid, p_students jsonb) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.issue_credential(p_actor_user_id uuid, p_org_id uuid, p_site_id uuid, p_pickup_group_id uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.replace_credential(p_old_credential_id uuid, p_reason text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.revoke_credential(p_credential_id uuid, p_reason text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.open_pickup_session(p_site_id uuid, p_service_date date) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.close_pickup_session(p_session_id uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.cancel_pickup_session(p_session_id uuid, p_reason text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.accept_invitation(inv_token text, inv_email text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.transfer_ownership(org_id uuid, new_owner_user_id uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.remove_member(org_id uuid, member_user_id uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.claim_guardian_invitation(p_token text, p_auth_email text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.rotate_checkin_code(p_site_id uuid, p_purpose text, p_lane text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.revoke_checkin_code(p_code_id uuid, p_reason text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.parent_self_checkin(p_site_id uuid, p_parent_token text, p_ip_address inet, p_user_agent text) FROM PUBLIC;

-- Grant back to postgres (service role operates as postgres)
GRANT EXECUTE ON FUNCTION public.auto_join_edu_to_demo() TO postgres;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres;
GRANT EXECUTE ON FUNCTION public.hook_restrict_signup_by_email_domain(event jsonb) TO postgres;
GRANT EXECUTE ON FUNCTION public.prevent_last_owner_removal() TO postgres;
GRANT EXECUTE ON FUNCTION public.reseed_demo_data() TO postgres;
GRANT EXECUTE ON FUNCTION public.close_stale_sessions(p_site_id uuid) TO postgres;
GRANT EXECUTE ON FUNCTION public.ensure_active_dismissal_session(p_site_id uuid, p_service_date date) TO postgres;
GRANT EXECUTE ON FUNCTION public.set_release_eligibility(p_queue_item_id uuid, p_organization_id uuid, p_school_site_id uuid, p_release_at timestamp with time zone, p_override_reason text) TO postgres;
GRANT EXECUTE ON FUNCTION public.process_pickup_checkin(p_site_id uuid, p_credential_token text, p_pickup_group_id uuid, p_source text) TO postgres;
GRANT EXECUTE ON FUNCTION public.write_parent_checkin_event(p_org_id uuid, p_site_id uuid, p_session_id uuid, p_group_id uuid, p_token_id uuid, p_arrival_id uuid, p_outcome text, p_ip_address inet, p_user_agent text) TO postgres;
GRANT EXECUTE ON FUNCTION public.transition_arrival_status(p_arrival_id uuid, p_new_status text, p_reason text, p_expected_current_status text) TO postgres;
GRANT EXECUTE ON FUNCTION public.transition_queue_status(p_queue_item_id uuid, p_new_status text, p_reason text) TO postgres;
GRANT EXECUTE ON FUNCTION public.transition_queue_status(p_queue_item_id uuid, p_new_status text, p_reason text, p_expected_current_status text) TO postgres;
GRANT EXECUTE ON FUNCTION public.update_classroom(p_actor_user_id uuid, p_org_id uuid, p_site_id uuid, p_classroom_id uuid, p_name text, p_grade_label text, p_teacher_display_label text) TO postgres;
GRANT EXECUTE ON FUNCTION public.update_school_site(p_actor_user_id uuid, p_org_id uuid, p_site_id uuid, p_name text, p_timezone text, p_status text, p_address_line1 text, p_address_line2 text, p_city text, p_state_province text, p_postal_code text) TO postgres;
GRANT EXECUTE ON FUNCTION public.update_student(p_actor_user_id uuid, p_org_id uuid, p_site_id uuid, p_student_id uuid, p_first_name text, p_last_name text, p_external_student_id text, p_classroom_id uuid, p_status text) TO postgres;
GRANT EXECUTE ON FUNCTION public.create_classroom(p_actor_user_id uuid, p_org_id uuid, p_site_id uuid, p_name text, p_grade_label text, p_teacher_display_label text) TO postgres;
GRANT EXECUTE ON FUNCTION public.create_school_site(p_actor_user_id uuid, p_org_id uuid, p_name text, p_slug text, p_timezone text, p_address_line1 text, p_address_line2 text, p_city text, p_state_province text, p_postal_code text) TO postgres;
GRANT EXECUTE ON FUNCTION public.create_student_with_group(p_actor_user_id uuid, p_org_id uuid, p_site_id uuid, p_first_name text, p_last_name text, p_external_student_id text, p_classroom_id uuid) TO postgres;
GRANT EXECUTE ON FUNCTION public.import_students(p_actor_user_id uuid, p_org_id uuid, p_site_id uuid, p_students jsonb) TO postgres;
GRANT EXECUTE ON FUNCTION public.issue_credential(p_actor_user_id uuid, p_org_id uuid, p_site_id uuid, p_pickup_group_id uuid) TO postgres;
GRANT EXECUTE ON FUNCTION public.replace_credential(p_old_credential_id uuid, p_reason text) TO postgres;
GRANT EXECUTE ON FUNCTION public.revoke_credential(p_credential_id uuid, p_reason text) TO postgres;
GRANT EXECUTE ON FUNCTION public.open_pickup_session(p_site_id uuid, p_service_date date) TO postgres;
GRANT EXECUTE ON FUNCTION public.close_pickup_session(p_session_id uuid) TO postgres;
GRANT EXECUTE ON FUNCTION public.cancel_pickup_session(p_session_id uuid, p_reason text) TO postgres;
GRANT EXECUTE ON FUNCTION public.accept_invitation(inv_token text, inv_email text) TO postgres;
GRANT EXECUTE ON FUNCTION public.transfer_ownership(org_id uuid, new_owner_user_id uuid) TO postgres;
GRANT EXECUTE ON FUNCTION public.remove_member(org_id uuid, member_user_id uuid) TO postgres;
GRANT EXECUTE ON FUNCTION public.claim_guardian_invitation(p_token text, p_auth_email text) TO postgres;
GRANT EXECUTE ON FUNCTION public.rotate_checkin_code(p_site_id uuid, p_purpose text, p_lane text) TO postgres;
GRANT EXECUTE ON FUNCTION public.revoke_checkin_code(p_code_id uuid, p_reason text) TO postgres;
GRANT EXECUTE ON FUNCTION public.parent_self_checkin(p_site_id uuid, p_parent_token text, p_ip_address inet, p_user_agent text) TO postgres;

-- Grant to authenticated for RPC-callable functions
GRANT EXECUTE ON FUNCTION public.get_guardian_family_data(p_site_id uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_guardian_sites() TO authenticated;
GRANT EXECUTE ON FUNCTION public.guardian_self_checkin(p_site_id uuid, p_checkin_code text, p_pickup_group_id uuid) TO authenticated;

-- ============================================
-- 3. Fix private.set_updated_at search_path
-- ============================================
ALTER FUNCTION private.set_updated_at() SET search_path = public, pg_temp;

-- ============================================
-- 4. Add missing FK indexes (engagement tables)
--    Identified by Supabase Performance Advisor
-- ============================================

-- engagement_acknowledgments: user_id FK
CREATE INDEX IF NOT EXISTS idx_ack_user ON public.engagement_acknowledgments (user_id);

-- engagement_actions: workstream_id FK
CREATE INDEX IF NOT EXISTS idx_act_workstream ON public.engagement_actions (workstream_id) WHERE (workstream_id IS NOT NULL);

-- engagement_artifacts: authored_by, superseded_by, workstream_id FKs
CREATE INDEX IF NOT EXISTS idx_art_authored_by ON public.engagement_artifacts (authored_by) WHERE (authored_by IS NOT NULL);
CREATE INDEX IF NOT EXISTS idx_art_superseded_by ON public.engagement_artifacts (superseded_by) WHERE (superseded_by IS NOT NULL);
CREATE INDEX IF NOT EXISTS idx_art_workstream ON public.engagement_artifacts (workstream_id) WHERE (workstream_id IS NOT NULL);

-- engagement_change_requests: accepted_by, requested_by FKs
CREATE INDEX IF NOT EXISTS idx_cr_accepted_by ON public.engagement_change_requests (accepted_by) WHERE (accepted_by IS NOT NULL);
CREATE INDEX IF NOT EXISTS idx_cr_requested_by ON public.engagement_change_requests (requested_by);

-- engagement_decisions: decision_owner_user_id, workstream_id FKs
CREATE INDEX IF NOT EXISTS idx_dec_owner ON public.engagement_decisions (decision_owner_user_id) WHERE (decision_owner_user_id IS NOT NULL);
CREATE INDEX IF NOT EXISTS idx_dec_workstream ON public.engagement_decisions (workstream_id) WHERE (workstream_id IS NOT NULL);

-- engagement_internal_notes: author_id FK
CREATE INDEX IF NOT EXISTS idx_in_author ON public.engagement_internal_notes (author_id);

-- engagement_milestones: workstream_id FK
CREATE INDEX IF NOT EXISTS idx_mil_workstream ON public.engagement_milestones (workstream_id) WHERE (workstream_id IS NOT NULL);

-- engagement_solution_links: external_link_id FK
CREATE INDEX IF NOT EXISTS idx_sol_external_link ON public.engagement_solution_links (external_link_id);

-- engagement_updates: authored_by FK
CREATE INDEX IF NOT EXISTS idx_upd_authored_by ON public.engagement_updates (authored_by) WHERE (authored_by IS NOT NULL);

-- ============================================
-- 5. Composite indexes for common query patterns
-- ============================================

-- pickup_queue_items: filtered by org + site + session + status
CREATE INDEX IF NOT EXISTS idx_queue_org_site_session_status
  ON public.pickup_queue_items (organization_id, school_site_id, session_id, current_status);

-- pickup_arrivals: filtered by org + site + session
CREATE INDEX IF NOT EXISTS idx_arrivals_org_site_session
  ON public.pickup_arrivals (organization_id, school_site_id, session_id);

-- school_students: filtered by site + status + classroom
CREATE INDEX IF NOT EXISTS idx_students_site_status_classroom
  ON public.school_students (school_site_id, status, classroom_id);

-- engagement_actions: filtered by engagement + status
CREATE INDEX IF NOT EXISTS idx_act_engagement_status
  ON public.engagement_actions (engagement_id, status);

-- engagement_decisions: filtered by engagement + status
CREATE INDEX IF NOT EXISTS idx_dec_engagement_status
  ON public.engagement_decisions (engagement_id, status);

-- engagement_milestones: filtered by engagement + status
CREATE INDEX IF NOT EXISTS idx_mil_engagement_status
  ON public.engagement_milestones (engagement_id, status);

-- engagement_artifacts: filtered by engagement + status
CREATE INDEX IF NOT EXISTS idx_art_engagement_status
  ON public.engagement_artifacts (engagement_id, status);

-- engagement_updates: filtered by engagement + status
CREATE INDEX IF NOT EXISTS idx_upd_engagement_status
  ON public.engagement_updates (engagement_id, status);

-- ============================================
-- 6. AI Advisor tables
-- ============================================

-- Store generated AI briefings (versioned, not regenerated on every view)
CREATE TABLE IF NOT EXISTS public.ai_briefings (
  id uuid default gen_random_uuid primary key,
  engagement_id uuid references public.engagements(id) on delete cascade,
  briefing_type text not null check (briefing_type in ('executive_update', 'engagement_impact', 'advisor_context')),
  context_type text not null default 'internal' check (context_type in ('client', 'internal')),
  content jsonb not null,
  source_snapshot_date timestamptz not null default now(),
  model_used text,
  token_count int,
  version int not null default 1,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_ai_briefings_engagement_type
  ON public.ai_briefings (engagement_id, briefing_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_briefings_engagement_latest
  ON public.ai_briefings (engagement_id, briefing_type, version DESC);

CREATE INDEX IF NOT EXISTS idx_ai_briefings_context_type
  ON public.ai_briefings (context_type);

ALTER TABLE public.ai_briefings ENABLE ROW LEVEL SECURITY;

-- Only org members can see briefings for their org's engagements
CREATE POLICY ai_briefings_select_org_member
  ON public.ai_briefings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_memberships om
      JOIN public.engagements e ON e.organization_id = om.organization_id
      WHERE e.id = ai_briefings.engagement_id
        AND om.user_id = auth.uid()
        AND om.status = 'active'
    )
  );

-- Only service role can insert/update/delete
-- (No INSERT/UPDATE/DELETE policy for authenticated/anon)

-- ============================================
-- 7. FrontOfAI intelligence cache table
--    Stores imported FrontOfAI weekly brief data
--    NOT regenerated by our platform
-- ============================================

CREATE TABLE IF NOT EXISTS public.frontofai_briefs (
  id uuid default gen_random_uuid primary key,
  brief_date date not null,
  title text not null,
  content jsonb not null,
  source_url text,
  imported_at timestamptz not null default now(),
  imported_by uuid references auth.users(id),
  unique(brief_date)
);

CREATE INDEX IF NOT EXISTS idx_frontofai_briefs_date
  ON public.frontofai_briefs (brief_date DESC);

ALTER TABLE public.frontofai_briefs ENABLE ROW LEVEL SECURITY;

-- Platform admins can manage, authenticated can read
CREATE POLICY frontofai_select_authenticated
  ON public.frontofai_briefs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY frontofai_manage_platform_admin
  ON public.frontofai_briefs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.platform_user_roles
      WHERE user_id = auth.uid() AND role = 'platform_admin'
    )
  );

-- ============================================
-- 8. Engagement impact addenda
--    Generated weekly, stored, not regenerated on view
-- ============================================

CREATE TABLE IF NOT EXISTS public.engagement_impact_addenda (
  id uuid default gen_random_uuid primary key,
  engagement_id uuid references public.engagements(id) on delete cascade,
  frontofai_brief_id uuid references public.frontofai_briefs(id),
  signals jsonb not null,
  generated_at timestamptz not null default now(),
  version int not null default 1,
  unique(engagement_id, frontofai_brief_id)
);

CREATE INDEX IF NOT EXISTS idx_impact_addenda_engagement
  ON public.engagement_impact_addenda (engagement_id, generated_at DESC);

ALTER TABLE public.engagement_impact_addenda ENABLE ROW LEVEL SECURITY;

-- Only org members can see addenda for their engagements
CREATE POLICY impact_addenda_select_org_member
  ON public.engagement_impact_addenda
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_memberships om
      JOIN public.engagements e ON e.organization_id = om.organization_id
      WHERE e.id = engagement_impact_addenda.engagement_id
        AND om.user_id = auth.uid()
        AND om.status = 'active'
    )
  );

-- ============================================
-- 9. AI advisor audit log
--    Track AI usage for cost observability
-- ============================================

CREATE TABLE IF NOT EXISTS public.ai_usage_log (
  id uuid default gen_random_uuid primary key,
  user_id uuid references auth.users(id),
  engagement_id uuid references public.engagements(id),
  request_type text not null check (request_type in ('ask_advisor', 'generate_briefing', 'generate_impact')),
  context_type text not null check (context_type in ('client', 'internal')),
  model_used text,
  input_tokens int,
  output_tokens int,
  latency_ms int,
  created_at timestamptz not null default now()
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_user_date
  ON public.ai_usage_log (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_usage_engagement
  ON public.ai_usage_log (engagement_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_usage_type_date
  ON public.ai_usage_log (request_type, created_at DESC);

ALTER TABLE public.ai_usage_log ENABLE ROW LEVEL SECURITY;

-- Users can see their own AI usage
CREATE POLICY ai_usage_select_own
  ON public.ai_usage_log
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Platform admins can see all
CREATE POLICY ai_usage_select_platform_admin
  ON public.ai_usage_log
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.platform_user_roles
      WHERE user_id = auth.uid() AND role = 'platform_admin'
    )
  );

-- Only service role can insert (via API routes)


