-- Migration 0026: Phase 2.7 — Commercial launch readiness infrastructure
-- Date: 2026-08-15
-- Purpose: Add tables for customer state tracking, failure observability,
-- conversion analytics, member tools registry, and scheduling links.

-- ============================================
-- 1. COMMERCIAL FAILURES (observability + retry)
-- ============================================
CREATE TABLE IF NOT EXISTS commercial_failures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  user_id UUID,  -- auth.users id (no FK since auth schema)
  failure_type TEXT NOT NULL,
    -- 'checkout' | 'webhook' | 'entitlement' | 'haiec_provisioning' | 'kestrel_provisioning'
    -- | 'email' | 'onboarding' | 'advisor_request' | 'artifact' | 'portal' | 'cancellation'
  severity TEXT NOT NULL DEFAULT 'warning',
    -- 'warning' | 'error' | 'critical'
  message TEXT NOT NULL,
  details JSONB,
  stripe_event_id TEXT,
  retryable BOOLEAN NOT NULL DEFAULT false,
  retried_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_commercial_failures_org ON commercial_failures(organization_id);
CREATE INDEX IF NOT EXISTS idx_commercial_failures_type ON commercial_failures(failure_type);
CREATE INDEX IF NOT EXISTS idx_commercial_failures_unresolved ON commercial_failures(resolved_at) WHERE (resolved_at IS NULL);
CREATE INDEX IF NOT EXISTS idx_commercial_failures_created ON commercial_failures(created_at DESC);

ALTER TABLE commercial_failures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to commercial_failures" ON commercial_failures FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Platform admins can read commercial_failures" ON commercial_failures FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM platform_user_roles WHERE user_id = auth.uid() AND role = 'platform_admin')
);

-- ============================================
-- 2. CONVERSION EVENTS (privacy-conscious funnel)
-- ============================================
CREATE TABLE IF NOT EXISTS conversion_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
    -- 'public_offer_viewed' | 'pricing_viewed' | 'checkout_started' | 'checkout_completed'
    -- | 'checkout_abandoned' | 'onboarding_started' | 'onboarding_completed'
    -- | 'included_product_activation_started' | 'included_product_activated'
    -- | 'advisor_request_created' | 'advisor_response_delivered'
    -- | 'fractional_desk_item_created' | 'working_session_completed'
    -- | 'artifact_published' | 'monthly_brief_published' | 'subscription_cancelled'
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  user_id UUID,
  offer_key TEXT,
  billing_period TEXT,
  session_id TEXT,
  page_path TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conversion_events_name ON conversion_events(event_name);
CREATE INDEX IF NOT EXISTS idx_conversion_events_org ON conversion_events(organization_id);
CREATE INDEX IF NOT EXISTS idx_conversion_events_created ON conversion_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversion_events_offer ON conversion_events(offer_key);

ALTER TABLE conversion_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to conversion_events" ON conversion_events FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Platform admins can read conversion_events" ON conversion_events FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM platform_user_roles WHERE user_id = auth.uid() AND role = 'platform_admin')
);
CREATE POLICY "Users can track own conversion events" ON conversion_events FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================
-- 3. MEMBER TOOLS REGISTRY
-- ============================================
CREATE TABLE IF NOT EXISTS member_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
    -- 'assessment' | 'governance' | 'research' | 'planning' | 'monitoring' | 'reference' | 'utility'
  access_level TEXT NOT NULL DEFAULT 'ADVISOR_SELECTED',
    -- 'PUBLIC' | 'ADVISOR_SELECTED' | 'FRACTIONAL_LIBRARY' | 'ADMIN_ONLY' | 'EXPERIMENTAL'
  allowed_plans TEXT[] NOT NULL DEFAULT ARRAY['ai_advisor_desk', 'fractional_ai_advisor'],
  external_url TEXT,
  internal_path TEXT,
  requires_provisioning BOOLEAN NOT NULL DEFAULT false,
  production_ready BOOLEAN NOT NULL DEFAULT false,
  visible_to_client BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_member_tools_access ON member_tools(access_level);
CREATE INDEX IF NOT EXISTS idx_member_tools_order ON member_tools(display_order);

ALTER TABLE member_tools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to member_tools" ON member_tools FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can read production-ready visible tools" ON member_tools FOR SELECT TO authenticated USING (
  production_ready = true AND visible_to_client = true AND access_level NOT IN ('ADMIN_ONLY', 'EXPERIMENTAL')
);

CREATE TRIGGER set_updated_at_member_tools BEFORE UPDATE ON member_tools FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 4. SCHEDULING LINKS (Activation Call + Working Sessions)
-- ============================================
CREATE TABLE IF NOT EXISTS scheduling_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  engagement_id UUID REFERENCES engagements(id) ON DELETE SET NULL,
  link_type TEXT NOT NULL,
    -- 'activation_call' | 'working_session'
  scheduling_url TEXT NOT NULL,
    -- External scheduling URL (Calendly, Google Calendar appointment, etc.)
  status TEXT NOT NULL DEFAULT 'pending',
    -- 'pending' | 'scheduled' | 'completed' | 'cancelled' | 'expired'
  scheduled_at TIMESTAMPTZ,
  duration_minutes INTEGER,
  session_usage_month TEXT,
    -- For working sessions: links to fractional_session_usage billing_period_month
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_scheduling_links_org ON scheduling_links(organization_id);
CREATE INDEX IF NOT EXISTS idx_scheduling_links_type ON scheduling_links(link_type);
CREATE INDEX IF NOT EXISTS idx_scheduling_links_status ON scheduling_links(status);

ALTER TABLE scheduling_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to scheduling_links" ON scheduling_links FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Users can read own org scheduling_links" ON scheduling_links FOR SELECT TO authenticated USING (
  organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active')
);
CREATE POLICY "Users can insert own org scheduling_links" ON scheduling_links FOR INSERT TO authenticated WITH CHECK (
  organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active')
);
CREATE POLICY "Users can update own org scheduling_links" ON scheduling_links FOR UPDATE TO authenticated USING (
  organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active')
);

CREATE TRIGGER set_updated_at_scheduling_links BEFORE UPDATE ON scheduling_links FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 5. CUSTOMER LIFECYCLE STATE (derived, not duplicating Stripe)
-- ============================================
CREATE TABLE IF NOT EXISTS customer_lifecycle_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL UNIQUE REFERENCES organizations(id) ON DELETE CASCADE,
  offer_key TEXT,
  state TEXT NOT NULL DEFAULT 'PROSPECT',
    -- 'PROSPECT' | 'CHECKOUT_STARTED' | 'ACTIVE_SETUP_REQUIRED' | 'ACTIVE'
    -- | 'PAYMENT_ISSUE' | 'CANCEL_AT_PERIOD_END' | 'READ_ONLY' | 'ENDED'
  previous_state TEXT,
  state_changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  entitlement_active BOOLEAN NOT NULL DEFAULT false,
  onboarding_complete BOOLEAN NOT NULL DEFAULT false,
  has_included_products BOOLEAN NOT NULL DEFAULT false,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  period_end TIMESTAMPTZ,
  readonly_until TIMESTAMPTZ,
  last_interaction_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_customer_lifecycle_org ON customer_lifecycle_states(organization_id);
CREATE INDEX IF NOT EXISTS idx_customer_lifecycle_state ON customer_lifecycle_states(state);
CREATE INDEX IF NOT EXISTS idx_customer_lifecycle_offer ON customer_lifecycle_states(offer_key);

ALTER TABLE customer_lifecycle_states ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to customer_lifecycle_states" ON customer_lifecycle_states FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Platform admins can read customer_lifecycle_states" ON customer_lifecycle_states FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM platform_user_roles WHERE user_id = auth.uid() AND role = 'platform_admin')
);
CREATE POLICY "Users can read own org lifecycle state" ON customer_lifecycle_states FOR SELECT TO authenticated USING (
  organization_id IN (SELECT om.organization_id FROM organization_memberships om WHERE om.user_id = auth.uid() AND om.status = 'active')
);

CREATE TRIGGER set_updated_at_customer_lifecycle BEFORE UPDATE ON customer_lifecycle_states FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 6. SEED MEMBER TOOLS
-- ============================================
INSERT INTO member_tools (tool_key, name, description, category, access_level, allowed_plans, internal_path, production_ready, visible_to_client, display_order) VALUES
  ('ai_controls_scorecard', 'AI Controls Scorecard', 'Self-assessment tool for evaluating AI governance maturity across key control areas.', 'assessment', 'ADVISOR_SELECTED', ARRAY['ai_advisor_desk', 'fractional_ai_advisor'], '/ai-controls', true, true, 10),
  ('vendor_review_template', 'Vendor Review Template', 'Structured template for evaluating AI vendor proposals and capabilities.', 'governance', 'ADVISOR_SELECTED', ARRAY['ai_advisor_desk', 'fractional_ai_advisor'], NULL, true, true, 20),
  ('decision_framework', 'Decision Framework Template', 'Structured framework for documenting AI investment decisions with trade-offs and evidence.', 'planning', 'FRACTIONAL_LIBRARY', ARRAY['fractional_ai_advisor'], NULL, true, true, 30),
  ('opportunity_canvas', 'Opportunity Canvas', 'One-page canvas for evaluating AI opportunities against value, feasibility, and evidence.', 'planning', 'FRACTIONAL_LIBRARY', ARRAY['fractional_ai_advisor'], NULL, true, true, 40),
  ('architecture_review_checklist', 'Architecture Review Checklist', 'Checklist for reviewing AI system architecture against production readiness criteria.', 'governance', 'FRACTIONAL_LIBRARY', ARRAY['fractional_ai_advisor'], NULL, true, true, 50),
  ('evidence_log_template', 'Evidence Log Template', 'Template for maintaining structured evidence and provenance for AI decisions.', 'reference', 'FRACTIONAL_LIBRARY', ARRAY['fractional_ai_advisor'], NULL, true, true, 60),
  ('monthly_brief_template', 'Monthly Brief Template', 'Template for the monthly decision and opportunity brief structure.', 'reference', 'FRACTIONAL_LIBRARY', ARRAY['fractional_ai_advisor'], NULL, true, true, 70),
  ('session_preparation_guide', 'Session Preparation Guide', 'Guide for preparing for working sessions with your advisor.', 'reference', 'FRACTIONAL_LIBRARY', ARRAY['fractional_ai_advisor'], NULL, true, true, 80),
  ('ai_risk_register', 'AI Risk Register', 'Template for tracking AI-related risks, mitigations, and owners.', 'monitoring', 'FRACTIONAL_LIBRARY', ARRAY['fractional_ai_advisor'], NULL, true, true, 90),
  ('csm_assessment_tool', 'CSM Assessment Tool', 'Self-assessment tool based on Cognitive Systems Management framework.', 'assessment', 'ADVISOR_SELECTED', ARRAY['ai_advisor_desk', 'fractional_ai_advisor'], '/cognitive-systems-management/assessment', true, true, 100)
ON CONFLICT (tool_key) DO NOTHING;
