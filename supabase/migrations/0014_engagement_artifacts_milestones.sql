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
