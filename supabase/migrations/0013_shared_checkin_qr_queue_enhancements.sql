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
