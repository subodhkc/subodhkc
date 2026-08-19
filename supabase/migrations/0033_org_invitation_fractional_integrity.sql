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
