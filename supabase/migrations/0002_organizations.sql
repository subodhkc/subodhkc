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
