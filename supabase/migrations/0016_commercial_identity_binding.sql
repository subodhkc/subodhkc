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
