-- Migration 0027: Create safe demo/test organizations for Phase 2.7 validation
-- Date: 2026-08-15
-- Purpose: Create synthetic test organizations representing the 4 subscription paths.
-- These are clearly synthetic and must never trigger real customer communications or billing.

-- Insert test organizations
INSERT INTO organizations (id, name, slug, organization_kind, status, created_at) VALUES
  ('a0000000-0000-0000-0000-000000000001', '[TEST] $99 Monthly Client', 'test-99-monthly', 'business', 'active', '2026-08-01T00:00:00Z'),
  ('a0000000-0000-0000-0000-000000000002', '[TEST] $99 Annual Client', 'test-99-annual', 'business', 'active', '2026-08-01T00:00:00Z'),
  ('a0000000-0000-0000-0000-000000000003', '[TEST] Fractional Monthly Client', 'test-fractional-monthly', 'business', 'active', '2026-08-01T00:00:00Z'),
  ('a0000000-0000-0000-0000-000000000004', '[TEST] Fractional Annual Client', 'test-fractional-annual', 'business', 'active', '2026-08-01T00:00:00Z')
ON CONFLICT (slug) DO NOTHING;

-- Insert entitlements for test orgs (using actual offering IDs from the database)
INSERT INTO organization_entitlements (organization_id, offering_id, status, source_type, valid_until, created_at) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'f2e0ad12-3f79-43c9-9aa1-19f422eaf1f5', 'active', 'subscription', '2026-09-01T00:00:00Z', '2026-08-01T00:00:00Z'),
  ('a0000000-0000-0000-0000-000000000002', 'f2e0ad12-3f79-43c9-9aa1-19f422eaf1f5', 'active', 'subscription', '2027-08-01T00:00:00Z', '2026-08-01T00:00:00Z'),
  ('a0000000-0000-0000-0000-000000000003', '02f16c8a-e3ba-4507-9942-cc98421fb287', 'active', 'subscription', '2026-09-01T00:00:00Z', '2026-08-01T00:00:00Z'),
  ('a0000000-0000-0000-0000-000000000004', '02f16c8a-e3ba-4507-9942-cc98421fb287', 'active', 'subscription', '2027-08-01T00:00:00Z', '2026-08-01T00:00:00Z')
ON CONFLICT DO NOTHING;

-- Insert included product entitlements
INSERT INTO included_product_entitlements (organization_id, source_offer_key, product_key, tier_or_plan, seats, credits, entitlement_status, provisioning_status, created_at) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'ai_advisor_desk', 'haiec', 'advisor_essentials', 1, 0, 'included', 'ready_to_activate', '2026-08-01T00:00:00Z'),
  ('a0000000-0000-0000-0000-000000000001', 'ai_advisor_desk', 'kestrel', 'ai_number_basic', 1, 20, 'included', 'ready_to_activate', '2026-08-01T00:00:00Z'),
  ('a0000000-0000-0000-0000-000000000002', 'ai_advisor_desk', 'haiec', 'advisor_essentials', 1, 0, 'included', 'active', '2026-08-01T00:00:00Z'),
  ('a0000000-0000-0000-0000-000000000002', 'ai_advisor_desk', 'kestrel', 'ai_number_basic', 1, 20, 'included', 'active', '2026-08-01T00:00:00Z'),
  ('a0000000-0000-0000-0000-000000000003', 'fractional_ai_advisor', 'haiec', 'scan', 1, 0, 'included', 'ready_to_activate', '2026-08-01T00:00:00Z'),
  ('a0000000-0000-0000-0000-000000000003', 'fractional_ai_advisor', 'kestrel', 'ai_number_basic', 1, 20, 'included', 'ready_to_activate', '2026-08-01T00:00:00Z'),
  ('a0000000-0000-0000-0000-000000000004', 'fractional_ai_advisor', 'haiec', 'scan', 1, 0, 'included', 'active', '2026-08-01T00:00:00Z'),
  ('a0000000-0000-0000-0000-000000000004', 'fractional_ai_advisor', 'kestrel', 'ai_number_basic', 1, 20, 'included', 'active', '2026-08-01T00:00:00Z')
ON CONFLICT DO NOTHING;

-- Insert Fractional engagement for test orgs C and D
INSERT INTO engagements (organization_id, engagement_type, status, starts_at, created_at) VALUES
  ('a0000000-0000-0000-0000-000000000003', 'fractional', 'active', '2026-08-01T00:00:00Z', '2026-08-01T00:00:00Z'),
  ('a0000000-0000-0000-0000-000000000004', 'fractional', 'active', '2026-08-01T00:00:00Z', '2026-08-01T00:00:00Z')
ON CONFLICT DO NOTHING;

-- Insert customer lifecycle states
INSERT INTO customer_lifecycle_states (organization_id, offer_key, state, entitlement_active, onboarding_complete, has_included_products, created_at) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'ai_advisor_desk', 'ACTIVE', true, true, true, '2026-08-01T00:00:00Z'),
  ('a0000000-0000-0000-0000-000000000002', 'ai_advisor_desk', 'ACTIVE', true, true, true, '2026-08-01T00:00:00Z'),
  ('a0000000-0000-0000-0000-000000000003', 'fractional_ai_advisor', 'ACTIVE_SETUP_REQUIRED', true, false, true, '2026-08-01T00:00:00Z'),
  ('a0000000-0000-0000-0000-000000000004', 'fractional_ai_advisor', 'ACTIVE', true, true, true, '2026-08-01T00:00:00Z')
ON CONFLICT (organization_id) DO NOTHING;

-- Insert session usage for test orgs C and D
INSERT INTO fractional_session_usage (organization_id, billing_period_month, included_sessions, used_sessions, max_rollover, created_at) VALUES
  ('a0000000-0000-0000-0000-000000000003', '2026-08', 2, 0, 1, '2026-08-01T00:00:00Z'),
  ('a0000000-0000-0000-0000-000000000004', '2026-08', 2, 0, 1, '2026-08-01T00:00:00Z')
ON CONFLICT DO NOTHING;
