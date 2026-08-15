-- Migration: Create terms_acceptance_records table
-- Date: 2026-08-15
-- Purpose: Record terms acceptance at checkout for advisory subscriptions
--
-- Stores: terms_version, service_schedule_slug, service_schedule_version,
-- checkout_session_id, user_id, organization_id, accepted_at

CREATE TABLE IF NOT EXISTS terms_acceptance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_key TEXT NOT NULL,
  terms_version TEXT NOT NULL,
  service_schedule_slug TEXT NOT NULL,
  service_schedule_version TEXT NOT NULL,
  checkout_session_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for looking up acceptance by organization
CREATE INDEX IF NOT EXISTS idx_terms_acceptance_org
  ON terms_acceptance_records(organization_id);

-- Index for looking up acceptance by checkout session
CREATE INDEX IF NOT EXISTS idx_terms_acceptance_session
  ON terms_acceptance_records(checkout_session_id);

-- Index for looking up acceptance by user
CREATE INDEX IF NOT EXISTS idx_terms_acceptance_user
  ON terms_acceptance_records(user_id);

-- Enable RLS
ALTER TABLE terms_acceptance_records ENABLE ROW LEVEL SECURITY;

-- Service role can read and write (used by checkout and webhook flows)
CREATE POLICY "Service role full access to terms acceptance"
  ON terms_acceptance_records
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Users can read their own acceptance records
CREATE POLICY "Users can read own terms acceptance"
  ON terms_acceptance_records
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Add helpful comment
COMMENT ON TABLE terms_acceptance_records IS
  'Records terms of service and service schedule acceptance at checkout for advisory subscriptions.';
