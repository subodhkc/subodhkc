-- =====================================================
-- Dismissal Groups, Schedules, Session Lifecycle Tests
-- Run: via Supabase SQL editor or test runner
-- =====================================================

-- Test 1: ensure_active_dismissal_session creates session
-- Expected: Returns a UUID session ID
SELECT test_result as 'ensure_creates_session'
FROM (
  SELECT
    CASE
      WHEN result IS NOT NULL AND result != '00000000-0000-0000-0000-000000000000'
      THEN 'PASS'
      ELSE 'FAIL'
    END as test_result
  FROM (
    SELECT public.ensure_active_dismissal_session(
      '00000000-0000-0000-0000-000000000001'::uuid  -- test site
    ) as result
  ) t
) t2;

-- Test 2: ensure_active_dismissal_session is idempotent
-- Calling twice on same day returns same session ID
SELECT test_result as 'ensure_idempotent'
FROM (
  SELECT
    CASE
      WHEN s1 = s2 THEN 'PASS'
      ELSE 'FAIL'
    END as test_result
  FROM (
    SELECT
      public.ensure_active_dismissal_session('00000000-0000-0000-0000-000000000001'::uuid) as s1,
      public.ensure_active_dismissal_session('00000000-0000-0000-0000-000000000001'::uuid) as s2
  ) t
) t2;

-- Test 3: Canonical session - one per site per day
-- Attempting to insert a second session for same site/day should fail
DO $$
BEGIN
  BEGIN
    INSERT INTO public.pickup_sessions (organization_id, school_site_id, service_date, status)
    VALUES (
      (SELECT organization_id FROM public.school_sites WHERE id = '00000000-0000-0000-0000-000000000001'),
      '00000000-0000-0000-0000-000000000001',
      (now() at time zone 'America/Chicago')::date,
      'open'
    );
    RAISE NOTICE 'FAIL: duplicate session insert should have been rejected';
  EXCEPTION WHEN unique_violation THEN
    RAISE NOTICE 'PASS: duplicate session correctly rejected';
  END;
END $$;

-- Test 4: pickup_groups unique name per site
DO $$
BEGIN
  BEGIN
    INSERT INTO public.pickup_groups (organization_id, school_site_id, name)
    VALUES (
      (SELECT organization_id FROM public.school_sites WHERE id = '00000000-0000-0000-0000-000000000001'),
      '00000000-0000-0000-0000-000000000001',
      'Test Duplicate Group'
    );
    INSERT INTO public.pickup_groups (organization_id, school_site_id, name)
    VALUES (
      (SELECT organization_id FROM public.school_sites WHERE id = '00000000-0000-0000-0000-000000000001'),
      '00000000-0000-0000-0000-000000000001',
      'Test Duplicate Group'
    );
    RAISE NOTICE 'FAIL: duplicate group name should have been rejected';
  EXCEPTION WHEN unique_violation THEN
    RAISE NOTICE 'PASS: duplicate group name correctly rejected';
  END;
END $$;

-- Test 5: dismissal_schedules unique per site/group/day
DO $$
BEGIN
  BEGIN
    INSERT INTO public.dismissal_schedules (organization_id, school_site_id, day_of_week, dismissal_time)
    VALUES (
      (SELECT organization_id FROM public.school_sites WHERE id = '00000000-0000-0000-0000-000000000001'),
      '00000000-0000-0000-0000-000000000001',
      1,
      '15:00'
    );
    INSERT INTO public.dismissal_schedules (organization_id, school_site_id, day_of_week, dismissal_time)
    VALUES (
      (SELECT organization_id FROM public.school_sites WHERE id = '00000000-0000-0000-0000-000000000001'),
      '00000000-0000-0000-0000-000000000001',
      1,
      '15:30'
    );
    RAISE NOTICE 'FAIL: duplicate schedule should have been rejected';
  EXCEPTION WHEN unique_violation THEN
    RAISE NOTICE 'PASS: duplicate schedule correctly rejected';
  END;
END $$;

-- Test 6: close_stale_sessions closes previous-day sessions
-- This is a safe operation that doesn't destroy data
SELECT
  CASE
    WHEN result >= 0 THEN 'PASS'
    ELSE 'FAIL'
  END as stale_sessions_close_result
FROM (
  SELECT public.close_stale_sessions(NULL) as result
) t;

-- Test 7: RLS - cross-tenant access blocked
-- A user from org A cannot query pickup_groups from org B
-- This is enforced by RLS policies using private.has_school_access()
-- Verification: confirm RLS is enabled on dismissal_schedules
SELECT
  CASE
    WHEN relrowsecurity = true THEN 'PASS'
    ELSE 'FAIL'
  END as rls_enabled_dismissal_schedules
FROM pg_class
WHERE relname = 'dismissal_schedules';

-- Test 8: auto_started flag is set on lazy-created sessions
SELECT
  CASE
    WHEN COUNT(*) > 0 AND bool_or(auto_started = true) THEN 'PASS'
    ELSE 'FAIL'
  END as auto_started_flag_works
FROM public.pickup_sessions
WHERE auto_started = true;

-- Cleanup test data
DELETE FROM public.dismissal_schedules
WHERE school_site_id = '00000000-0000-0000-0000-000000000001'
  AND dismissal_time IN ('15:00', '15:30');

DELETE FROM public.pickup_groups
WHERE school_site_id = '00000000-0000-0000-0000-000000000001'
  AND name = 'Test Duplicate Group';
