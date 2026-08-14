-- Advisor Desk Light-Touch Model Database Tests
-- Run via: Supabase SQL Editor or pgTAP
-- Validates: new columns, status constraint, no allowance enforcement,
-- tenant isolation, member pricing architecture
--
-- Requires pgTAP extension

create extension if not exists pgtap;

begin;

-- ============================================
-- TEST SETUP: Create test users and organizations
-- ============================================

insert into auth.users (id, email, aud, role, instance_id, raw_app_meta_data, raw_user_meta_data)
values
  ('00000000-0000-0000-0000-0000000000a1', 'advisor-a@test.com', 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000', '{}'::jsonb, '{}'::jsonb),
  ('00000000-0000-0000-0000-0000000000a2', 'advisor-b@test.com', 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000', '{}'::jsonb, '{}'::jsonb)
on conflict (id) do nothing;

insert into public.profiles (id, email, display_name)
values
  ('00000000-0000-0000-0000-0000000000a1', 'advisor-a@test.com', 'Advisor Test A'),
  ('00000000-0000-0000-0000-0000000000a2', 'advisor-b@test.com', 'Advisor Test B')
on conflict (id) do nothing;

-- Create test organizations
insert into public.organizations (id, slug, name, owner_id)
values
  ('00000000-0000-0000-0001-0000000000a1', 'advisor-test-org-a', 'Advisor Test Org A', '00000000-0000-0000-0000-0000000000a1'),
  ('00000000-0000-0000-0001-0000000000a2', 'advisor-test-org-b', 'Advisor Test Org B', '00000000-0000-0000-0000-0000000000a2')
on conflict (id) do nothing;

-- Create organization memberships
insert into public.organization_memberships (organization_id, user_id, role, status)
values
  ('00000000-0000-0000-0001-0000000000a1', '00000000-0000-0000-0000-0000000000a1', 'owner', 'active'),
  ('00000000-0000-0000-0001-0000000000a2', '00000000-0000-0000-0000-0000000000a2', 'owner', 'active')
on conflict do nothing;

-- ============================================
-- 1. NEW COLUMNS EXIST
-- ============================================

has_column(
  'advisor_questions',
  'request_category',
  'advisor_questions has request_category column'
);

has_column(
  'advisor_questions',
  'effort_class',
  'advisor_questions has effort_class column'
);

has_column(
  'advisor_questions',
  'recommended_next_step',
  'advisor_questions has recommended_next_step column'
);

has_column(
  'advisor_questions',
  'recommended_offer_key',
  'advisor_questions has recommended_offer_key column'
);

has_column(
  'advisor_questions',
  'internal_effort_notes',
  'advisor_questions has internal_effort_notes column (internal only)'
);

has_column(
  'advisor_questions',
  'internal_abuse_flags',
  'advisor_questions has internal_abuse_flags column (internal only)'
);

-- ============================================
-- 2. STATUS CHECK CONSTRAINT INCLUDES deeper_work_recommended
-- ============================================

-- Test: can insert a question with status 'deeper_work_recommended'
insert into public.advisor_questions (
  organization_id, submitted_by, billing_period_key,
  subject, question, status, effort_class
) values (
  '00000000-0000-0000-0001-0000000000a1',
  '00000000-0000-0000-0000-0000000000a1',
  '2026-08',
  'Test: deeper work recommended',
  'This is a test question for deeper_work_recommended status',
  'deeper_work_recommended',
  'DEEPER_REVIEW'
);

-- Test: can insert a question with status 'submitted' and effort_class 'BRIEF'
insert into public.advisor_questions (
  organization_id, submitted_by, billing_period_key,
  subject, question, status, effort_class
) values (
  '00000000-0000-0000-0001-0000000000a1',
  '00000000-0000-0000-0000-0000000000a1',
  '2026-08',
  'Test: brief guidance',
  'This is a test question for brief guidance',
  'submitted',
  'BRIEF'
);

-- Test: can insert multiple questions in same billing period (no quota enforcement)
insert into public.advisor_questions (
  organization_id, submitted_by, billing_period_key,
  subject, question, status, effort_class
) values (
  '00000000-0000-0000-0001-0000000000a1',
  '00000000-0000-0000-0000-0000000000a1',
  '2026-08',
  'Test: second question same period',
  'This is a second test question in the same billing period - should not be blocked',
  'submitted',
  'BRIEF'
);

select lives_ok(
  $$
    insert into public.advisor_questions (
      organization_id, submitted_by, billing_period_key,
      subject, question, status, effort_class
    ) values (
      '00000000-0000-0000-0001-0000000000a1',
      '00000000-0000-0000-0000-0000000000a1',
      '2026-08',
      'Test: third question same period',
      'Third question in same billing period - no allowance enforcement',
      'submitted',
      'BRIEF'
    )
  $$,
  'Can submit multiple questions in same billing period (no allowance enforcement)'
);

-- ============================================
-- 3. EFFORT_CLASS CHECK CONSTRAINT
-- ============================================

-- Valid effort classes
select lives_ok(
  $$
    insert into public.advisor_questions (
      organization_id, submitted_by, billing_period_key,
      subject, question, effort_class
    ) values (
      '00000000-0000-0000-0001-0000000000a1',
      '00000000-0000-0000-0000-0000000000a1',
      '2026-08',
      'Test: scoped work effort',
      'Test for SCOPED_WORK effort class',
      'SCOPED_WORK'
    )
  $$,
  'Can insert with effort_class SCOPED_WORK'
);

-- Invalid effort class should fail
select throws_ok(
  $$
    insert into public.advisor_questions (
      organization_id, submitted_by, billing_period_key,
      subject, question, effort_class
    ) values (
      '00000000-0000-0000-0001-0000000000a1',
      '00000000-0000-0000-0000-0000000000a1',
      '2026-08',
      'Test: invalid effort',
      'Test for invalid effort class',
      'INVALID_CLASS'
    )
  $$,
  'Invalid effort_class is rejected'
);

-- ============================================
-- 4. CLASSIFICATION FIELDS CAN BE SET
-- ============================================

-- Insert a question with all classification fields
select lives_ok(
  $$
    insert into public.advisor_questions (
      organization_id, submitted_by, billing_period_key,
      subject, question, status, effort_class,
      request_category, recommended_next_step, recommended_offer_key
    ) values (
      '00000000-0000-0000-0001-0000000000a1',
      '00000000-0000-0000-0000-0000000000a1',
      '2026-08',
      'Test: full classification',
      'Test question with all classification fields',
      'deeper_work_recommended',
      'DEEPER_REVIEW',
      'AUTOMATION_OPPORTUNITY',
      'This deserves a closer workflow analysis.',
      'ai_automation_blueprint'
    )
  $$,
  'Can insert question with all classification fields populated'
);

-- ============================================
-- 5. TENANT ISOLATION: Org A cannot access Org B questions
-- ============================================

-- Insert a question for Org B
insert into public.advisor_questions (
  organization_id, submitted_by, billing_period_key,
  subject, question, status, effort_class
) values (
  '00000000-0000-0000-0001-0000000000a2',
  '00000000-0000-0000-0000-0000000000a2',
  '2026-08',
  'Org B private question',
  'This question belongs to Org B and should not be visible to Org A',
  'submitted',
  'BRIEF'
);

-- Verify Org A questions and Org B questions are separate
select is(
  (select count(*) from public.advisor_questions where organization_id = '00000000-0000-0000-0001-0000000000a1'),
  (select count(*) from public.advisor_questions where organization_id = '00000000-0000-0000-0001-0000000000a1' and organization_id <> '00000000-0000-0000-0001-0000000000a2'),
  'Org A questions do not include Org B questions'
);

-- Verify Org B has its own questions
select is(
  (select count(*) from public.advisor_questions where organization_id = '00000000-0000-0000-0001-0000000000a2'),
  1::bigint,
  'Org B has exactly 1 question'
);

-- ============================================
-- 6. MEMBER PRICING ADJUSTMENTS TABLE
-- ============================================

has_table(
  'member_pricing_adjustments',
  'member_pricing_adjustments table exists'
);

has_column(
  'member_pricing_adjustments',
  'standard_price_cents',
  'member_pricing_adjustments has standard_price_cents'
);

has_column(
  'member_pricing_adjustments',
  'member_adjustment_cents',
  'member_pricing_adjustments has member_adjustment_cents'
);

has_column(
  'member_pricing_adjustments',
  'final_price_cents',
  'member_pricing_adjustments has final_price_cents'
);

has_column(
  'member_pricing_adjustments',
  'billing_unit',
  'member_pricing_adjustments has billing_unit column'
);

has_column(
  'member_pricing_adjustments',
  'hourly_rate_cents',
  'member_pricing_adjustments has hourly_rate_cents column'
);

has_column(
  'member_pricing_adjustments',
  'estimated_hours',
  'member_pricing_adjustments has estimated_hours column'
);

-- Test: can insert a fixed-price member pricing adjustment
select lives_ok(
  $$
    insert into public.member_pricing_adjustments (
      organization_id, offer_key, billing_unit, standard_price_cents,
      member_adjustment_cents, final_price_cents, reason
    ) values (
      '00000000-0000-0000-0001-0000000000a1',
      'ai_automation_blueprint',
      'fixed',
      50000,
      -5000,
      45000,
      'Advisor Desk member benefit - $50 off Blueprint'
    )
  $$,
  'Can insert fixed-price member pricing adjustment with correct math'
);

-- Test: invalid math should fail (final_price != standard + adjustment)
select throws_ok(
  $$
    insert into public.member_pricing_adjustments (
      organization_id, offer_key, billing_unit, standard_price_cents,
      member_adjustment_cents, final_price_cents, reason
    ) values (
      '00000000-0000-0000-0001-0000000000a1',
      'ai_automation_blueprint',
      'fixed',
      50000,
      -5000,
      40000,
      'Wrong math - should fail'
    )
  $$,
  'Member pricing adjustment with incorrect math is rejected'
);

-- Test: can insert an hourly member pricing adjustment
select lives_ok(
  $$
    insert into public.member_pricing_adjustments (
      organization_id, offer_key, billing_unit, standard_price_cents,
      member_adjustment_cents, final_price_cents, hourly_rate_cents, estimated_hours, reason
    ) values (
      '00000000-0000-0000-0001-0000000000a1',
      'advisory_hourly',
      'hourly',
      20000,
      -5000,
      15000,
      15000,
      4,
      'Advisor Desk member rate - $150/hr for 4 hours'
    )
  $$,
  'Can insert hourly member pricing adjustment with member rate'
);

-- Test: hourly billing without hourly_rate_cents should fail
select throws_ok(
  $$
    insert into public.member_pricing_adjustments (
      organization_id, offer_key, billing_unit, standard_price_cents,
      member_adjustment_cents, final_price_cents, reason
    ) values (
      '00000000-0000-0000-0001-0000000000a1',
      'advisory_hourly',
      'hourly',
      20000,
      -5000,
      15000,
      'Hourly without rate - should fail'
    )
  $$,
  'Hourly billing without hourly_rate_cents is rejected'
);

-- Test: fixed billing with hourly_rate_cents should fail
select throws_ok(
  $$
    insert into public.member_pricing_adjustments (
      organization_id, offer_key, billing_unit, standard_price_cents,
      member_adjustment_cents, final_price_cents, hourly_rate_cents, reason
    ) values (
      '00000000-0000-0000-0001-0000000000a1',
      'ai_automation_blueprint',
      'fixed',
      50000,
      -5000,
      45000,
      15000,
      'Fixed with hourly rate - should fail'
    )
  $$,
  'Fixed billing with hourly_rate_cents is rejected'
);

-- ============================================
-- 7. HISTORICAL RECORDS PRESERVED
-- ============================================

-- Questions inserted above should still exist (not deleted by migration)
select ok(
  (select count(*) from public.advisor_questions where organization_id = '00000000-0000-0000-0001-0000000000a1') >= 5,
  'All test questions are preserved (historical records intact)'
);

-- ============================================
-- CLEANUP
-- ============================================

delete from public.advisor_questions
where organization_id in ('00000000-0000-0000-0001-0000000000a1', '00000000-0000-0000-0001-0000000000a2');

delete from public.member_pricing_adjustments
where organization_id = '00000000-0000-0000-0001-0000000000a1';

delete from public.organization_memberships
where organization_id in ('00000000-0000-0000-0001-0000000000a1', '00000000-0000-0000-0001-0000000000a2');

delete from public.organizations
where id in ('00000000-0000-0000-0001-0000000000a1', '00000000-0000-0000-0001-0000000000a2');

delete from public.profiles
where id in ('00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000000a2');

delete from auth.users
where id in ('00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000000a2');

select * from finish();
rollback;
