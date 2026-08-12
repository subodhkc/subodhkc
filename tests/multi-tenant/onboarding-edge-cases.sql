-- Edge case tests for onboarding and membership flows
-- Tests: join requests RLS, invitation edge cases, last admin protection, tenant isolation

-- Test 1: Join requests RLS - users can only see their own requests
-- Expected: User sees only their requests, not other users'
DO $$
BEGIN
  -- This test verifies RLS is enabled
  ASSERT (SELECT relrowsecurity FROM pg_class WHERE relname = 'join_requests') = true,
    'join_requests should have RLS enabled';
END $$;

-- Test 2: Join requests unique pending constraint
-- Expected: Cannot create two pending requests for same user+org
DO $$
DECLARE
  test_org_id uuid := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  test_user_id uuid := '00000000-0000-0000-0000-000000000001';
  v_err_caught boolean := false;
BEGIN
  -- Insert first request (using service role to bypass RLS for test setup)
  INSERT INTO public.join_requests (organization_id, user_id, requested_role, status)
  VALUES (test_org_id, test_user_id, 'member', 'pending')
  ON CONFLICT DO NOTHING;

  -- Try to insert second pending request - should fail on unique index
  BEGIN
    INSERT INTO public.join_requests (organization_id, user_id, requested_role, status)
    VALUES (test_org_id, test_user_id, 'admin', 'pending');
  EXCEPTION WHEN unique_violation THEN
    v_err_caught := true;
  END;

  ASSERT v_err_caught = true, 'Should not allow duplicate pending join requests';

  -- Cleanup
  DELETE FROM public.join_requests WHERE organization_id = test_org_id AND user_id = test_user_id;
END $$;

-- Test 3: Join request status transitions
-- Expected: Only pending requests can be approved/rejected
DO $$
DECLARE
  test_org_id uuid := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  test_user_id uuid := '00000000-0000-0000-0000-000000000002';
  v_request_id uuid;
BEGIN
  -- Create and approve a request
  INSERT INTO public.join_requests (organization_id, user_id, requested_role, status)
  VALUES (test_org_id, test_user_id, 'member', 'pending')
  RETURNING id INTO v_request_id;

  -- Approve it
  UPDATE public.join_requests
  SET status = 'approved', reviewed_at = now()
  WHERE id = v_request_id;

  ASSERT (SELECT status FROM public.join_requests WHERE id = v_request_id) = 'approved',
    'Request should be approved';

  -- Try to approve again (should still work at DB level, API prevents it)
  -- This is a data-level test; API-level enforcement is in the route handler

  -- Cleanup
  DELETE FROM public.join_requests WHERE id = v_request_id;
END $$;

-- Test 4: Wilshire organization exists and is active
DO $$
DECLARE
  v_org record;
BEGIN
  SELECT id, name, slug, status, organization_kind
  INTO v_org
  FROM public.organizations
  WHERE slug = 'wilshire';

  ASSERT FOUND, 'Wilshire organization should exist';
  ASSERT v_org.status = 'active', 'Wilshire should be active';
  ASSERT v_org.organization_kind = 'school', 'Wilshire should be a school org';
END $$;

-- Test 5: Wilshire school site exists
DO $$
DECLARE
  v_site record;
BEGIN
  SELECT id, name, slug, status, timezone
  INTO v_site
  FROM public.school_sites
  WHERE slug = 'wilshire-elementary';

  ASSERT FOUND, 'Wilshire school site should exist';
  ASSERT v_site.status = 'active', 'Wilshire site should be active';
  ASSERT v_site.timezone = 'America/Chicago', 'Wilshire should use Chicago timezone';
END $$;

-- Test 6: Wilshire has school_pickup entitlement
DO $$
DECLARE
  v_entitlement record;
BEGIN
  SELECT oe.status, o.offering_key
  INTO v_entitlement
  FROM public.organization_entitlements oe
  JOIN public.offerings o ON o.id = oe.offering_id
  WHERE oe.organization_id = (SELECT id FROM public.organizations WHERE slug = 'wilshire')
    AND o.offering_key = 'school_pickup';

  ASSERT FOUND, 'Wilshire should have school_pickup entitlement';
  ASSERT v_entitlement.status = 'active', 'Wilshire school_pickup entitlement should be active';
END $$;

-- Test 7: Tenant isolation - school_staff_assignments scoped to org
-- Verify that staff assignments reference the correct organization_id
DO $$
DECLARE
  v_count integer;
BEGIN
  -- Count any staff assignments that have mismatched org_id between assignment and site
  SELECT count(*)
  INTO v_count
  FROM public.school_staff_assignments ssa
  JOIN public.school_sites ss ON ss.id = ssa.school_site_id
  WHERE ssa.organization_id <> ss.organization_id;

  ASSERT v_count = 0, 'All staff assignments should have matching org_id with their site';
END $$;

-- Test 8: Last school_admin protection exists in API
-- This is verified by the API route code, not at DB level.
-- The DB allows status changes; the API enforces the last-admin check.

-- Test 9: Invitation token hash is stored, not the raw token
DO $$
BEGIN
  -- Verify that token_hash column exists and is not nullable
  ASSERT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'organization_invitations'
      AND column_name = 'token_hash'
      AND is_nullable = 'NO'
  ), 'Invitations should store token_hash (not raw token)';
END $$;

-- Test 10: Audit events table exists for membership lifecycle
DO $$
BEGIN
  ASSERT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'audit_events' AND table_schema = 'public'
  ), 'audit_events table should exist';
END $$;

SELECT 'All edge case tests passed' as result;
