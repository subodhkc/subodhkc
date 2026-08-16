-- Migration 0024: Advisor affiliations, session usage tracking, and monthly brief auto-creation
-- Date: 2026-08-15
-- Purpose: Complete remaining Phase 2.6 promises
--
-- 1. advisor_affiliations — Approved Advisor Affiliation records for Fractional
-- 2. fractional_session_usage — Monthly session usage tracking with rollover
-- 3. Auto-create monthly brief trigger on engagement creation

-- ===== advisor_affiliations =====
CREATE TABLE IF NOT EXISTS advisor_affiliations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  engagement_id UUID REFERENCES engagements(id) ON DELETE SET NULL,
  affiliate_name TEXT NOT NULL,
  affiliate_role TEXT,
  affiliate_email TEXT,
  affiliate_company TEXT,
  relationship_type TEXT NOT NULL DEFAULT 'approved_advisor',
    -- 'approved_advisor', 'introduced_partner', 'external_expert'
  status TEXT NOT NULL DEFAULT 'approved',
    -- 'pending', 'approved', 'revoked'
  approved_at TIMESTAMPTZ DEFAULT now(),
  revoked_at TIMESTAMPTZ,
  notes TEXT,
  created_by_user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_advisor_aff_org ON advisor_affiliations(organization_id);
CREATE INDEX IF NOT EXISTS idx_advisor_aff_status ON advisor_affiliations(status);

-- ===== fractional_session_usage =====
-- Tracks monthly working session usage and rollover for Fractional engagements.
-- One row per org per billing period month.
CREATE TABLE IF NOT EXISTS fractional_session_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  engagement_id UUID REFERENCES engagements(id) ON DELETE SET NULL,
  billing_period_month TEXT NOT NULL,
    -- 'YYYY-MM' format
  included_sessions INTEGER NOT NULL DEFAULT 2,
    -- Fractional includes 2 working sessions/month
  used_sessions INTEGER NOT NULL DEFAULT 0,
  rolled_over_from_prev INTEGER NOT NULL DEFAULT 0,
    -- Sessions carried over from the previous month (max 1)
  rolled_over_to_next INTEGER NOT NULL DEFAULT 0,
    -- Sessions carried into the next month (max 1)
  max_rollover INTEGER NOT NULL DEFAULT 1,
    -- Per spec: one unused session may roll into the immediately following month only
  period_start DATE,
  period_end DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_session_usage_org ON fractional_session_usage(organization_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_session_usage_unique ON fractional_session_usage(organization_id, billing_period_month);

-- ===== Enable RLS =====
ALTER TABLE advisor_affiliations ENABLE ROW LEVEL SECURITY;
ALTER TABLE fractional_session_usage ENABLE ROW LEVEL SECURITY;

-- Service role full access
CREATE POLICY "Service role full access to advisor_affiliations" ON advisor_affiliations FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access to fractional_session_usage" ON fractional_session_usage FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Users can read their org's records
CREATE POLICY "Users can read own org advisor_affiliations" ON advisor_affiliations FOR SELECT TO authenticated USING (organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active'));
CREATE POLICY "Users can read own org fractional_session_usage" ON fractional_session_usage FOR SELECT TO authenticated USING (organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active'));

-- ===== Triggers for updated_at =====
CREATE TRIGGER set_updated_at_advisor_aff BEFORE UPDATE ON advisor_affiliations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_session_usage BEFORE UPDATE ON fractional_session_usage FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ===== Function: compute_session_usage_for_month =====
-- Returns the effective number of sessions available for a given month,
-- accounting for rollover from the previous month.
CREATE OR REPLACE FUNCTION compute_session_usage_for_month(
  p_org_id UUID,
  p_month TEXT
) RETURNS TABLE (
  included_sessions INTEGER,
  used_sessions INTEGER,
  rolled_over_from_prev INTEGER,
  available_sessions INTEGER,
  rollover_eligible INTEGER
) AS $$
DECLARE
  v_usage fractional_session_usage%ROWTYPE;
  v_prev_month TEXT;
  v_prev_usage fractional_session_usage%ROWTYPE;
  v_rollover INTEGER := 0;
BEGIN
  -- Get current month usage
  SELECT * INTO v_usage
  FROM fractional_session_usage
  WHERE organization_id = p_org_id AND billing_period_month = p_month;

  -- Compute previous month for rollover
  v_prev_month := to_char((p_month || '-01')::date - interval '1 month', 'YYYY-MM');

  -- Get previous month usage to compute rollover
  SELECT * INTO v_prev_usage
  FROM fractional_session_usage
  WHERE organization_id = p_org_id AND billing_period_month = v_prev_month;

  -- Rollover: max 1 unused session from previous month
  IF v_prev_usage.organization_id IS NOT NULL THEN
    v_rollover := LEAST(
      GREATEST(v_prev_usage.included_sessions + v_prev_usage.rolled_over_from_prev - v_prev_usage.used_sessions, 0),
      v_prev_usage.max_rollover
    );
  END IF;

  -- Return computed values
  RETURN QUERY
  SELECT
    COALESCE(v_usage.included_sessions, 2),
    COALESCE(v_usage.used_sessions, 0),
    v_rollover,
    COALESCE(v_usage.included_sessions, 2) + v_rollover - COALESCE(v_usage.used_sessions, 0),
    GREATEST(COALESCE(v_usage.included_sessions, 2) + v_rollover - COALESCE(v_usage.used_sessions, 0), 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
