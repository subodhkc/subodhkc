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
