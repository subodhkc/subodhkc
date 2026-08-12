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
