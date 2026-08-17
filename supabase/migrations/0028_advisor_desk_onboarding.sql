-- Migration 0028: Advisor Desk onboarding - Context Profile + Watchlist
-- Date: 2026-08-17
-- Purpose: Support the rebuilt /ai-advisor experience.
--   1. advisor_context_profiles: progressive organizational AI context intake (save/resume)
--   2. advisor_watchlist_items: seeded watchlist from intake, calibrated by Subodh
-- These tables are scoped to the AI Advisor Desk subscription and reuse existing
-- organization tenancy + RLS patterns from migration 0026.

-- ============================================
-- 1. ADVISOR CONTEXT PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS advisor_context_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL UNIQUE REFERENCES organizations(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started',
    -- 'not_started' | 'in_progress' | 'completed'
  -- JSONB holds the progressive intake payload. Structured but flexible so
  -- branching and save/resume work without schema churn.
  profile_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    -- Expected shape (all optional until submitted):
    -- {
    --   organization: { name, website, industry, primaryMarkets, companySize, memberRole },
    --   priorities: { topPriorities[], next90DayGoals[], operationalBottlenecks[], areasToImprove[] },
    --   technology: { currentSystems[], aiProductsUsed[], importantVendors[], aiProjectsInProgress[], architectureConstraints[] },
    --   workflows: { aiCandidateWorkflows[], manualBottlenecks[], customerFacingAi[], employeeFacingAi[] },
    --   decisions: { decisionsInPlay[], vendorEvaluations[], upcomingInvestments[], deadlines[] },
    --   market: { competitorsToWatch[], vendorsToWatch[] },
    --   riskGovernance: { sensitiveDataCategories[], regulatedActivities[], governanceConcerns[], policyMaturity },
    --   jurisdiction: { operatingRegions[], aiUseRegions[] },
    --   watchPreferences: { priorityAreas[] }
    -- }
  completed_at TIMESTAMPTZ,
  last_saved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_advisor_context_profiles_org ON advisor_context_profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_advisor_context_profiles_status ON advisor_context_profiles(status);

ALTER TABLE advisor_context_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to advisor_context_profiles" ON advisor_context_profiles FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Users can read own org context profile" ON advisor_context_profiles FOR SELECT TO authenticated USING (
  organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active')
);
CREATE POLICY "Users can insert own org context profile" ON advisor_context_profiles FOR INSERT TO authenticated WITH CHECK (
  organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active')
);
CREATE POLICY "Users can update own org context profile" ON advisor_context_profiles FOR UPDATE TO authenticated USING (
  organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active')
);

CREATE TRIGGER set_updated_at_advisor_context_profiles BEFORE UPDATE ON advisor_context_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 2. ADVISOR WATCHLIST ITEMS
-- ============================================
CREATE TABLE IF NOT EXISTS advisor_watchlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
    -- 'opportunity' | 'decision' | 'technology_vendor' | 'risk_governance' | 'law_regulatory' | 'open_question'
  title TEXT NOT NULL,
  source TEXT,
    -- 'intake_seed' | 'advisor_added' | 'signal_detected'
  relevance TEXT,
    -- 'high' | 'medium' | 'low' | 'watching'
  status TEXT NOT NULL DEFAULT 'watching',
    -- 'watching' | 'active' | 'addressed' | 'closed'
  recommended_next_action TEXT,
  advisor_notes TEXT,
  is_draft BOOLEAN NOT NULL DEFAULT false,
    -- true when auto-drafted from intake, pending Subodh calibration
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_advisor_watchlist_org ON advisor_watchlist_items(organization_id);
CREATE INDEX IF NOT EXISTS idx_advisor_watchlist_category ON advisor_watchlist_items(category);
CREATE INDEX IF NOT EXISTS idx_advisor_watchlist_status ON advisor_watchlist_items(status);

ALTER TABLE advisor_watchlist_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to advisor_watchlist_items" ON advisor_watchlist_items FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Users can read own org watchlist" ON advisor_watchlist_items FOR SELECT TO authenticated USING (
  organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active')
);
CREATE POLICY "Users can insert own org watchlist" ON advisor_watchlist_items FOR INSERT TO authenticated WITH CHECK (
  organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active')
);
CREATE POLICY "Users can update own org watchlist" ON advisor_watchlist_items FOR UPDATE TO authenticated USING (
  organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active')
);

CREATE TRIGGER set_updated_at_advisor_watchlist BEFORE UPDATE ON advisor_watchlist_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 3. ADVISOR ONBOARDING PROGRESS (lightweight, reuses customer_lifecycle_states)
-- ============================================
-- The existing customer_lifecycle_states table has onboarding_complete BOOLEAN.
-- We add a dedicated onboarding_steps JSONB column to track the 3-step checklist
-- without duplicating lifecycle state.
ALTER TABLE customer_lifecycle_states ADD COLUMN IF NOT EXISTS advisor_onboarding_steps JSONB DEFAULT '{
  "context_intake": "not_started",
  "watchlist_review": "not_started",
  "activation_call": "not_started"
}'::jsonb;

COMMENT ON COLUMN customer_lifecycle_states.advisor_onboarding_steps IS 'Tracks the 3-step Advisor Desk onboarding checklist: context_intake, watchlist_review, activation_call. Values: not_started | in_progress | completed.';
