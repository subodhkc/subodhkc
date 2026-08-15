-- Migration 0023: Fractional operating system records
-- Date: 2026-08-15
-- Purpose: Create database-backed records for the Fractional AI Advisor operating system.
-- These tables back the 18-record operating model promised in the Service Schedule.
--
-- Tables created:
--   fractional_intake_records   — Bring Something to the Desk
--   fractional_opportunities    — Opportunity Registry
--   fractional_evidence         — Evidence & Inputs
--   fractional_working_sessions — Working Session Records with usage tracking
--   fractional_monthly_briefs   — Monthly Decision & Opportunity Brief
--   fractional_priorities       — Current Priorities
--
-- Existing tables reused:
--   engagement_decisions  — Decision Registry (enhanced)
--   engagement_actions     — Actions & Commitments
--   engagement_artifacts   — Decision Artifacts
--   engagement_outcomes    — Outcome / Learning

-- ===== fractional_intake_records (Bring Something to the Desk) =====
CREATE TABLE IF NOT EXISTS fractional_intake_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  engagement_id UUID REFERENCES engagements(id) ON DELETE SET NULL,
  intake_type TEXT NOT NULL,
    -- 'ask_question', 'explore_opportunity', 'review_decision', 'review_vendor',
    -- 'review_system', 'explore_partnership', 'share_report', 'something_changed'
  title TEXT NOT NULL,
  what_is_happening TEXT,
  why_it_matters TEXT,
  desired_outcome TEXT,
  deadline TEXT,
  related_priority TEXT,
  sensitivity TEXT,
  attachment_links TEXT[],
  submitted_by_user_id UUID,
  status TEXT NOT NULL DEFAULT 'new',
    -- 'new', 'reviewing', 'in_progress', 'addressed', 'closed'
  advisor_response TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_frac_intake_org ON fractional_intake_records(organization_id);
CREATE INDEX IF NOT EXISTS idx_frac_intake_engagement ON fractional_intake_records(engagement_id);
CREATE INDEX IF NOT EXISTS idx_frac_intake_status ON fractional_intake_records(status);

-- ===== fractional_opportunities (Opportunity Registry) =====
CREATE TABLE IF NOT EXISTS fractional_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  engagement_id UUID REFERENCES engagements(id) ON DELETE SET NULL,
  opportunity TEXT NOT NULL,
  source TEXT,
  why_it_matters TEXT,
  expected_leverage_value TEXT,
  evidence TEXT,
  assumptions TEXT,
  status TEXT NOT NULL DEFAULT 'new',
    -- 'new', 'exploring', 'evidence_needed', 'candidate', 'recommended',
    -- 'deferred', 'rejected', 'advanced', 'closed'
  recommended_next_step TEXT,
  related_decision_id UUID REFERENCES engagement_decisions(id) ON DELETE SET NULL,
  revisit_trigger TEXT,
  outcome TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_frac_opp_org ON fractional_opportunities(organization_id);
CREATE INDEX IF NOT EXISTS idx_frac_opp_status ON fractional_opportunities(status);

-- ===== fractional_evidence (Evidence & Inputs) =====
CREATE TABLE IF NOT EXISTS fractional_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  engagement_id UUID REFERENCES engagements(id) ON DELETE SET NULL,
  evidence_type TEXT NOT NULL,
    -- 'note', 'link', 'report', 'proposal', 'vendor_material', 'architecture_material',
    -- 'metric', 'client_assertion', 'public_external'
  title TEXT NOT NULL,
  description TEXT,
  link_url TEXT,
  provenance TEXT NOT NULL DEFAULT 'client_provided',
    -- 'client_provided', 'external_public', 'advisor_analysis', 'tool_result', 'verified_outcome'
  related_decision_id UUID REFERENCES engagement_decisions(id) ON DELETE SET NULL,
  related_opportunity_id UUID REFERENCES fractional_opportunities(id) ON DELETE SET NULL,
  created_by_user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_frac_evidence_org ON fractional_evidence(organization_id);

-- ===== fractional_working_sessions (Working Session Records) =====
CREATE TABLE IF NOT EXISTS fractional_working_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  engagement_id UUID REFERENCES engagements(id) ON DELETE SET NULL,
  session_type TEXT NOT NULL DEFAULT 'working',
    -- 'working', 'activation_call'
  scheduled_at TIMESTAMPTZ,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  status TEXT NOT NULL DEFAULT 'scheduled',
    -- 'scheduled', 'completed', 'cancelled', 'no_show'
  participants TEXT[],
  agenda TEXT,
  notes TEXT,
  follow_ups TEXT,
  billing_period_month TEXT,
    -- 'YYYY-MM' format — which billing period this session counts against
  rolled_over_from_month TEXT,
    -- If this session was rolled over from a previous month
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_frac_sessions_org ON fractional_working_sessions(organization_id);
CREATE INDEX IF NOT EXISTS idx_frac_sessions_period ON fractional_working_sessions(billing_period_month);

-- ===== fractional_monthly_briefs (Monthly Decision & Opportunity Brief) =====
CREATE TABLE IF NOT EXISTS fractional_monthly_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  engagement_id UUID REFERENCES engagements(id) ON DELETE SET NULL,
  brief_month TEXT NOT NULL,
    -- 'YYYY-MM' format
  what_changed TEXT,
  what_matters TEXT,
  decisions_in_play TEXT,
  opportunities_in_play TEXT,
  evidence_still_missing TEXT,
  advisor_point_of_view TEXT,
  recommended_next_moves TEXT,
  authored_by_user_id UUID,
  status TEXT NOT NULL DEFAULT 'draft',
    -- 'draft', 'published'
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_frac_briefs_org ON fractional_monthly_briefs(organization_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_frac_briefs_unique ON fractional_monthly_briefs(organization_id, brief_month);

-- ===== fractional_priorities (Current Priorities) =====
CREATE TABLE IF NOT EXISTS fractional_priorities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  engagement_id UUID REFERENCES engagements(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority_order INTEGER NOT NULL DEFAULT 0,
  owner TEXT,
  status TEXT NOT NULL DEFAULT 'active',
    -- 'active', 'reviewing', 'completed', 'deferred'
  target_review_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_frac_priorities_org ON fractional_priorities(organization_id);

-- ===== Enable RLS on all new tables =====
ALTER TABLE fractional_intake_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE fractional_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE fractional_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE fractional_working_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE fractional_monthly_briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE fractional_priorities ENABLE ROW LEVEL SECURITY;

-- Service role full access on all tables
CREATE POLICY "Service role full access to fractional_intake_records" ON fractional_intake_records FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access to fractional_opportunities" ON fractional_opportunities FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access to fractional_evidence" ON fractional_evidence FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access to fractional_working_sessions" ON fractional_working_sessions FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access to fractional_monthly_briefs" ON fractional_monthly_briefs FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access to fractional_priorities" ON fractional_priorities FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Users can read their org's records
CREATE POLICY "Users can read own org fractional_intake_records" ON fractional_intake_records FOR SELECT TO authenticated USING (organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active'));
CREATE POLICY "Users can read own org fractional_opportunities" ON fractional_opportunities FOR SELECT TO authenticated USING (organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active'));
CREATE POLICY "Users can read own org fractional_evidence" ON fractional_evidence FOR SELECT TO authenticated USING (organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active'));
CREATE POLICY "Users can read own org fractional_working_sessions" ON fractional_working_sessions FOR SELECT TO authenticated USING (organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active'));
CREATE POLICY "Users can read own org fractional_monthly_briefs" ON fractional_monthly_briefs FOR SELECT TO authenticated USING (organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active'));
CREATE POLICY "Users can read own org fractional_priorities" ON fractional_priorities FOR SELECT TO authenticated USING (organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active'));

-- Add updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER set_updated_at_fractional_intake BEFORE UPDATE ON fractional_intake_records FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_fractional_opp BEFORE UPDATE ON fractional_opportunities FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_fractional_evidence BEFORE UPDATE ON fractional_evidence FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_fractional_sessions BEFORE UPDATE ON fractional_working_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_fractional_briefs BEFORE UPDATE ON fractional_monthly_briefs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_fractional_priorities BEFORE UPDATE ON fractional_priorities FOR EACH ROW EXECUTE FUNCTION update_updated_at();
