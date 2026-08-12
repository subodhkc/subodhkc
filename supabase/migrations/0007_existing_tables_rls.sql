-- Migration 0007: RLS for existing application tables
-- Replaces old profiles.role = 'admin' pattern with platform_user_roles

-- ============================================
-- SITE_ANALYTICS_EVENTS
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
