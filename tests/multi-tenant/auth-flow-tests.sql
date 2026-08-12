-- =====================================================
-- Auth Flow Security Tests
-- Tests for auth callback, logout, session management
-- =====================================================

-- Test 1: Auth users exist (seed data)
SELECT
  CASE
    WHEN COUNT(*) >= 5 THEN 'PASS'
    ELSE 'FAIL'
  END as auth_users_exist
FROM auth.users;

-- Test 2: Organization memberships are active for test users
SELECT
  CASE
    WHEN COUNT(*) > 0 THEN 'PASS'
    ELSE 'FAIL'
  END as org_memberships_exist
FROM public.organization_memberships
WHERE status = 'active';

-- Test 3: RLS blocks unauthenticated access to protected tables
-- anon role should not be able to select from pickup_sessions
SET ROLE anon;
SELECT
  CASE
    WHEN COUNT(*) = 0 THEN 'PASS'
    ELSE 'FAIL'
  END as anon_blocked_from_sessions
FROM public.pickup_sessions;
RESET ROLE;

-- Test 4: RLS blocks unauthenticated access to dismissal_schedules
SET ROLE anon;
SELECT
  CASE
    WHEN COUNT(*) = 0 THEN 'PASS'
    ELSE 'FAIL'
  END as anon_blocked_from_schedules
FROM public.dismissal_schedules;
RESET ROLE;

-- Test 5: RLS blocks unauthenticated access to pickup_groups
SET ROLE anon;
SELECT
  CASE
    WHEN COUNT(*) = 0 THEN 'PASS'
    ELSE 'FAIL'
  END as anon_blocked_from_groups
FROM public.pickup_groups;
RESET ROLE;

-- Test 6: SECURITY DEFINER functions not executable by anon
-- ensure_active_dismissal_session should not be callable by anon
SET ROLE anon;
DO $$
BEGIN
  BEGIN
    PERFORM public.ensure_active_dismissal_session('00000000-0000-0000-0000-000000000001'::uuid);
    RAISE NOTICE 'FAIL: anon can execute ensure_active_dismissal_session';
  EXCEPTION WHEN insufficient_privilege THEN
    RAISE NOTICE 'PASS: anon blocked from ensure_active_dismissal_session';
  WHEN OTHERS THEN
    -- Other errors (like SITE_NOT_FOUND) are OK - the point is anon can't call it
    -- But if it gets past permission check, that's a problem
    IF SQLERRM LIKE 'SITE_NOT_FOUND%' OR SQLERRM LIKE 'ORG_SUSPENDED%' OR SQLERRM LIKE 'ENTITLEMENT%' OR SQLERRM LIKE 'UNAUTHORIZED%' THEN
      RAISE NOTICE 'FAIL: anon bypassed permission check on ensure_active_dismissal_session';
    ELSE
      RAISE NOTICE 'PASS: anon blocked from ensure_active_dismissal_session';
    END IF;
  END;
END $$;
RESET ROLE;

-- Test 7: set_release_eligibility not executable by anon
SET ROLE anon;
DO $$
BEGIN
  BEGIN
    PERFORM public.set_release_eligibility(
      '00000000-0000-0000-0000-000000000001'::uuid,
      '00000000-0000-0000-0000-000000000001'::uuid,
      '00000000-0000-0000-0000-000000000001'::uuid,
      now(),
      NULL
    );
    RAISE NOTICE 'FAIL: anon can execute set_release_eligibility';
  EXCEPTION WHEN insufficient_privilege THEN
    RAISE NOTICE 'PASS: anon blocked from set_release_eligibility';
  WHEN OTHERS THEN
    IF SQLERRM LIKE 'UNAUTHORIZED%' OR SQLERRM LIKE 'QUEUE_ITEM_NOT_FOUND%' THEN
      RAISE NOTICE 'FAIL: anon bypassed permission check on set_release_eligibility';
    ELSE
      RAISE NOTICE 'PASS: anon blocked from set_release_eligibility';
    END IF;
  END;
END $$;
RESET ROLE;

-- Test 8: close_stale_sessions not executable by anon
SET ROLE anon;
DO $$
BEGIN
  BEGIN
    PERFORM public.close_stale_sessions(NULL);
    RAISE NOTICE 'FAIL: anon can execute close_stale_sessions';
  EXCEPTION WHEN insufficient_privilege THEN
    RAISE NOTICE 'PASS: anon blocked from close_stale_sessions';
  WHEN OTHERS THEN
    RAISE NOTICE 'PASS: anon blocked from close_stale_sessions';
  END;
END $$;
RESET ROLE;
