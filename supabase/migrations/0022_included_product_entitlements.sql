-- Migration 0022: Create included_product_entitlements table
-- Date: 2026-08-15
-- Purpose: Separate included product ENTITLEMENT (granted at purchase) from
-- PROVISIONING (external account activation). This creates one canonical model
-- for HAIEC/Kestrel/Member Tools entitlements tied to advisory subscriptions.
--
-- States: included → ready_to_activate → provisioning → active → provisioning_failed → suspended → ended

CREATE TABLE IF NOT EXISTS included_product_entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  source_offer_key TEXT NOT NULL,
  product_key TEXT NOT NULL,  -- 'haiec', 'kestrel', 'member_tools'
  tier_or_plan TEXT NOT NULL,  -- e.g., 'advisor_essentials', 'scan', 'ai_number_basic', 'library', 'selected'
  seats INTEGER NOT NULL DEFAULT 1,
  credits INTEGER,
  entitlement_status TEXT NOT NULL DEFAULT 'included',
    -- included, ready_to_activate, provisioning, active, provisioning_failed, suspended, ended
  provisioning_status TEXT NOT NULL DEFAULT 'pending',
    -- pending, in_progress, provisioned, failed, not_applicable
  external_user_id TEXT,
  external_account_id TEXT,
  external_tier_mapped TEXT,  -- The actual tier name sent to the external system
  activated_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  provisioning_error TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for looking up entitlements by org
CREATE INDEX IF NOT EXISTS idx_included_product_ent_org
  ON included_product_entitlements(organization_id);

-- Index for looking up by source offer
CREATE INDEX IF NOT EXISTS idx_included_product_ent_offer
  ON included_product_entitlements(source_offer_key);

-- Unique constraint: one entitlement per org + product + source offer
CREATE UNIQUE INDEX IF NOT EXISTS idx_included_product_ent_unique
  ON included_product_entitlements(organization_id, product_key, source_offer_key);

-- Enable RLS
ALTER TABLE included_product_entitlements ENABLE ROW LEVEL SECURITY;

-- Service role full access
CREATE POLICY "Service role full access to included product entitlements"
  ON included_product_entitlements
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Users can read their org's entitlements (via org membership check)
CREATE POLICY "Users can read own org included product entitlements"
  ON included_product_entitlements
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT om.organization_id
      FROM organization_memberships om
      WHERE om.user_id = auth.uid() AND om.status = 'active'
    )
  );

COMMENT ON TABLE included_product_entitlements IS
  'Canonical model for included product entitlements (HAIEC, Kestrel, Member Tools) tied to advisory subscriptions. Separates entitlement (granted at purchase) from provisioning (external account activation).';
