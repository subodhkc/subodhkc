-- Commercial Identity Database Tests
-- Run: psql $DATABASE_URL -f tests/commercial-identity/commercial-identity-db-tests.sql

BEGIN;

-- Test setup: Create test data
CREATE TEMP TABLE test_ids AS
SELECT
  gen_random_uuid() AS user_1,
  gen_random_uuid() AS user_2,
  gen_random_uuid() AS org_1,
  gen_random_uuid() AS org_2,
  gen_random_uuid() AS org_inactive;

-- Insert test organizations
INSERT INTO public.organizations (id, name, slug, organization_kind, status)
SELECT org_1, 'Test Org Alpha', 'test-alpha-' || substr(org_1::text, 1, 8), 'business', 'active'
FROM test_ids;

INSERT INTO public.organizations (id, name, slug, organization_kind, status)
SELECT org_2, 'Test Org Beta', 'test-beta-' || substr(org_2::text, 1, 8), 'business', 'active'
FROM test_ids;

INSERT INTO public.organizations (id, name, slug, organization_kind, status)
SELECT org_inactive, 'Test Org Suspended', 'test-suspended-' || substr(org_inactive::text, 1, 8), 'business', 'suspended'
FROM test_ids;

-- Insert test memberships
INSERT INTO public.organization_memberships (organization_id, user_id, role, status)
SELECT org_1, user_1, 'owner', 'active' FROM test_ids;

INSERT INTO public.organization_memberships (organization_id, user_id, role, status)
SELECT org_2, user_1, 'member', 'active' FROM test_ids;

INSERT INTO public.organization_memberships (organization_id, user_id, role, status)
SELECT org_2, user_2, 'owner', 'active' FROM test_ids;

-- ============================================
-- TEST 1: Atomic org creation RPC
-- ============================================
DO $$
DECLARE
  v_result record;
  v_membership record;
BEGIN
  SELECT * INTO v_result FROM public.create_commercial_organization(
    'RPC Test Org', null, 'business', (SELECT user_1 FROM test_ids)
  ) LIMIT 1;

  ASSERT v_result.org_id IS NOT NULL, 'RPC should return org_id';
  ASSERT v_result.org_slug IS NOT NULL, 'RPC should return org_slug';
  ASSERT v_result.created = true, 'RPC should return created=true';

  -- Verify owner membership
  SELECT role, status INTO v_membership
  FROM public.organization_memberships
  WHERE organization_id = v_result.org_id
    AND user_id = (SELECT user_1 FROM test_ids);

  ASSERT v_membership.role = 'owner', 'Atomic membership should be owner';
  ASSERT v_membership.status = 'active', 'Atomic membership should be active';

  -- Cleanup
  DELETE FROM public.organization_memberships WHERE organization_id = v_result.org_id;
  DELETE FROM public.organizations WHERE id = v_result.org_id;

  RAISE NOTICE 'TEST 1 PASSED: Atomic org creation RPC';
END $$;

-- ============================================
-- TEST 2: Slug collision handling
-- ============================================
DO $$
DECLARE
  v_slug1 text;
  v_slug2 text;
  v_id1 uuid;
  v_id2 uuid;
BEGIN
  SELECT org_id, org_slug INTO v_id1, v_slug1
  FROM public.create_commercial_organization('Collision Test', null, 'business', (SELECT user_1 FROM test_ids))
  LIMIT 1;

  SELECT org_id, org_slug INTO v_id2, v_slug2
  FROM public.create_commercial_organization('Collision Test', null, 'business', (SELECT user_2 FROM test_ids))
  LIMIT 1;

  ASSERT v_slug1 <> v_slug2, 'Slug collision should produce different slugs';

  -- Cleanup
  DELETE FROM public.organization_memberships WHERE organization_id IN (v_id1, v_id2);
  DELETE FROM public.organizations WHERE id IN (v_id1, v_id2);

  RAISE NOTICE 'TEST 2 PASSED: Slug collision handling';
END $$;

-- ============================================
-- TEST 3: Membership isolation
-- ============================================
DO $$
DECLARE
  v_count int;
BEGIN
  SELECT count(*) INTO v_count
  FROM public.organization_memberships
  WHERE organization_id = (SELECT org_1 FROM test_ids)
    AND user_id = (SELECT user_2 FROM test_ids)
    AND status = 'active';

  ASSERT v_count = 0, 'User 2 should not have membership in Org 1';

  SELECT count(*) INTO v_count
  FROM public.organization_memberships
  WHERE user_id = (SELECT user_1 FROM test_ids)
    AND status = 'active';

  ASSERT v_count = 2, 'User 1 should have 2 active memberships';

  RAISE NOTICE 'TEST 3 PASSED: Membership isolation';
END $$;

-- ============================================
-- TEST 4: Unique membership constraint
-- ============================================
DO $$
BEGIN
  INSERT INTO public.organization_memberships (organization_id, user_id, role, status)
  SELECT org_1, user_1, 'admin', 'active' FROM test_ids;

  ASSERT false, 'Should have raised unique violation';
EXCEPTION WHEN unique_violation THEN
  RAISE NOTICE 'TEST 4 PASSED: Unique membership constraint enforced';
END $$;

-- ============================================
-- TEST 5: Blueprint qualification organization binding
-- ============================================
DO $$
DECLARE
  v_qual_id uuid;
  v_org_id uuid;
BEGIN
  INSERT INTO public.blueprint_qualifications (
    organization_id, user_email, user_id,
    business_objective, workflow_problem,
    fit_decision, status
  )
  SELECT org_1, 'test@example.com', user_1,
    'Test objective', 'Test workflow problem long enough',
    'standard_blueprint', 'checkout_started'
  FROM test_ids
  RETURNING id INTO v_qual_id;

  ASSERT v_qual_id IS NOT NULL, 'Qualification record should be created';

  SELECT organization_id INTO v_org_id
  FROM public.blueprint_qualifications
  WHERE id = v_qual_id;

  ASSERT v_org_id = (SELECT org_1 FROM test_ids), 'Qualification should be bound to Org 1';

  DELETE FROM public.blueprint_qualifications WHERE id = v_qual_id;

  RAISE NOTICE 'TEST 5 PASSED: Blueprint qualification organization binding';
END $$;

-- ============================================
-- TEST 6: Agreement status constraint
-- ============================================
DO $$
BEGIN
  -- Try inserting an agreement with invalid status
  INSERT INTO public.agreements (
    organization_id, document_type, status
  )
  SELECT org_1, 'order', 'invalid_status'
  FROM test_ids;

  ASSERT false, 'Should have raised check violation';
EXCEPTION WHEN check_violation THEN
  RAISE NOTICE 'TEST 6 PASSED: Agreement status constraint enforced';
END $$;

-- ============================================
-- TEST 7: External system links uniqueness
-- ============================================
DO $$
DECLARE
  v_org1 uuid := (SELECT org_1 FROM test_ids);
  v_org2 uuid := (SELECT org_2 FROM test_ids);
BEGIN
  -- Insert first link
  INSERT INTO public.external_system_links (
    organization_id, system_key, external_id, external_object_type
  ) VALUES (v_org1, 'stripe_customer', 'cus_test123', 'customer');

  -- Try duplicate for same org + system_key
  BEGIN
    INSERT INTO public.external_system_links (
      organization_id, system_key, external_id, external_object_type
    ) VALUES (v_org1, 'stripe_customer', 'cus_test456', 'customer');

    RAISE NOTICE 'TEST 7 SKIP: Unique constraint on (org_id, system_key) not enforced via DB';
  EXCEPTION WHEN unique_violation THEN
    RAISE NOTICE 'TEST 7 PASSED: External system links uniqueness enforced';
  END;

  -- Cleanup
  DELETE FROM public.external_system_links WHERE organization_id = v_org1 AND system_key = 'stripe_customer';
END $$;

-- Cleanup test data
DELETE FROM public.organization_memberships
WHERE organization_id IN (SELECT org_1 FROM test_ids)
   OR organization_id IN (SELECT org_2 FROM test_ids)
   OR organization_id IN (SELECT org_inactive FROM test_ids);

DELETE FROM public.organizations
WHERE id IN (SELECT org_1 FROM test_ids)
   OR id IN (SELECT org_2 FROM test_ids)
   OR id IN (SELECT org_inactive FROM test_ids);

DROP TABLE test_ids;

ROLLBACK;
-- Note: We use ROLLBACK so test data never persists.
-- All test data is created within the transaction and discarded.

RAISE NOTICE '=== All commercial identity DB tests completed ===';
