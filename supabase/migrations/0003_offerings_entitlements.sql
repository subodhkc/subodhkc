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
