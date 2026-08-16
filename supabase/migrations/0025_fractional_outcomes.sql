-- Migration 0025: Fractional Outcome/Learning records
-- Date: 2026-08-15
-- Purpose: Create a proper Outcome/Learning table for the Fractional operating system.
--
-- The existing engagement_outcomes table is a metrics tracking table
-- (baseline/target/current values). The spec requires an Outcome/Learning record
-- that tracks: what happened, whether assumptions held, result, lesson, follow-up,
-- reopen/revisit trigger, and supports "Something Changed" reopen logic.
--
-- This migration creates fractional_outcomes as a distinct table.

CREATE TABLE IF NOT EXISTS fractional_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  engagement_id UUID REFERENCES engagements(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  what_happened TEXT,
  assumptions_held TEXT,
    -- 'yes', 'no', 'partially', or free text
  result TEXT,
  lesson TEXT,
  follow_up TEXT,
  revisit_trigger TEXT,
  related_decision_id UUID REFERENCES engagement_decisions(id) ON DELETE SET NULL,
  related_opportunity_id UUID REFERENCES fractional_opportunities(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'recorded',
    -- 'recorded', 'revisited', 'closed', 'reopened'
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_frac_outcomes_org ON fractional_outcomes(organization_id);
CREATE INDEX IF NOT EXISTS idx_frac_outcomes_status ON fractional_outcomes(status);

-- Enable RLS
ALTER TABLE fractional_outcomes ENABLE ROW LEVEL SECURITY;

-- Service role full access
CREATE POLICY "Service role full access to fractional_outcomes" ON fractional_outcomes FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Users can read their org's records
CREATE POLICY "Users can read own org fractional_outcomes" ON fractional_outcomes FOR SELECT TO authenticated USING (organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active'));

-- Trigger for updated_at
CREATE TRIGGER set_updated_at_fractional_outcomes BEFORE UPDATE ON fractional_outcomes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
