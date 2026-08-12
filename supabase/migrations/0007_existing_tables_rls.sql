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
