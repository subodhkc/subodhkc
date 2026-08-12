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
