-- SubodhKC Database Schema
-- Project ref: shnbyttoswxhfnurdnxo
--
-- The canonical schema is now maintained as versioned migration files in:
--   supabase/migrations/
--
-- Run migrations in order:
--   0001_profiles_and_trigger.sql
--   0002_organizations.sql
--   0003_offerings_entitlements.sql
--   0004_engagements_external_audit.sql
--   0005_private_helpers.sql
--   0006_rls_policies.sql
--   0007_existing_tables_rls.sql
--
-- See docs/architecture/multi-tenancy.md for the full architecture documentation.
--
-- This file is kept for reference only. Do not run this file directly.
-- All schema changes must go through versioned migration files.

-- ============================================
-- 1. PROFILES TABLE (linked to auth.users)
-- ============================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin', 'editor')),
  company text,
  job_title text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- 2. ANALYTICS EVENTS (existing table - formalize)
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

-- Index for analytics queries
create index if not exists idx_analytics_type_date on public.site_analytics_events(event_type, created_at);
create index if not exists idx_analytics_path on public.site_analytics_events(path);
create index if not exists idx_analytics_session on public.site_analytics_events(session_id);
create index if not exists idx_analytics_created on public.site_analytics_events(created_at desc);

-- ============================================
-- 3. OUTREACH EMAILS (existing table - formalize)
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
-- 4. NEWSLETTER SUBSCRIBERS
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
-- 5. LEAD MAGNET DOWNLOADS
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
-- 6. WEBINAR REGISTRATIONS
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
-- 7. COURSE ENROLLMENTS
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
-- 8. CONTACT SUBMISSIONS
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
-- ROW LEVEL SECURITY
-- ============================================

-- Profiles: users can see/edit only their own profile
alter table public.profiles enable row level security;
create policy "Profiles are viewable by owner" on public.profiles for select using (auth.uid() = id);
create policy "Profiles are updatable by owner" on public.profiles for update using (auth.uid() = id);
create policy "Profiles are insertable by owner" on public.profiles for insert with check (auth.uid() = id);

-- Analytics: public can insert (tracking), only admin can read
alter table public.site_analytics_events enable row level security;
create policy "Anyone can insert analytics" on public.site_analytics_events for insert with check (true);
-- Read access controlled by service role in API routes (bypasses RLS)

-- Outreach: only admin can read/write
alter table public.outreach_emails enable row level security;
create policy "Admin can manage outreach" on public.outreach_emails for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Newsletter: public can insert (subscribe), admin can read
alter table public.newsletter_subscribers enable row level security;
create policy "Anyone can subscribe" on public.newsletter_subscribers for insert with check (true);
create policy "Admin can view subscribers" on public.newsletter_subscribers for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Anyone can unsubscribe themselves" on public.newsletter_subscribers for update using (true);

-- Lead magnets: public can insert, admin can read
alter table public.lead_magnet_downloads enable row level security;
create policy "Anyone can request lead magnet" on public.lead_magnet_downloads for insert with check (true);
create policy "Admin can view lead magnet downloads" on public.lead_magnet_downloads for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Webinar: public can insert, admin can read
alter table public.webinar_registrations enable row level security;
create policy "Anyone can register for webinar" on public.webinar_registrations for insert with check (true);
create policy "Admin can view webinar registrations" on public.webinar_registrations for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Course: public can insert, admin can read
alter table public.course_enrollments enable row level security;
create policy "Anyone can enroll in course" on public.course_enrollments for insert with check (true);
create policy "Admin can view course enrollments" on public.course_enrollments for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Contact: public can insert, admin can read
alter table public.contact_submissions enable row level security;
create policy "Anyone can submit contact form" on public.contact_submissions for insert with check (true);
create policy "Admin can view contact submissions" on public.contact_submissions for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ============================================
-- UPDATED_AT TRIGGER FOR PROFILES
-- ============================================
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();
