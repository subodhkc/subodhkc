-- Migration: Fractional AI Advisor workspace tables
-- Date: 2026-08-15
-- Phase 2.5 P1: Onboarding + Decision Desk
--
-- 1. Expands engagement_decisions status constraint to support the
--    Decision Desk workflow (new, reviewing, evidence_needed, etc.)
-- 2. Creates fractional_onboarding table for the 5-minute onboarding flow
--
-- Idempotent: uses IF EXISTS / IF NOT EXISTS guards.

-- 1. Expand engagement_decisions status to support Decision Desk workflow
-- Existing values: open, decided, deferred, superseded
-- New values: new, reviewing, evidence_needed, next_session, decision_ready, closed
ALTER TABLE public.engagement_decisions DROP CONSTRAINT IF EXISTS dec_status_check;
ALTER TABLE public.engagement_decisions ADD CONSTRAINT dec_status_check
  CHECK (status = ANY (ARRAY[
    'new'::text,
    'reviewing'::text,
    'evidence_needed'::text,
    'next_session'::text,
    'decision_ready'::text,
    'decided'::text,
    'closed'::text,
    'deferred'::text,
    'superseded'::text,
    'open'::text
  ]));

-- 2. Create fractional_onboarding table
CREATE TABLE IF NOT EXISTS public.fractional_onboarding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  engagement_id uuid REFERENCES public.engagements(id) ON DELETE SET NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'not_started' CHECK (status = ANY (ARRAY['not_started'::text, 'in_progress'::text, 'completed'::text])),
  -- Organization context
  org_description text,
  top_outcomes text,
  -- Current AI picture
  ai_stage text,
  -- Decisions on the table
  decisions_text text,
  -- Systems / documents (optional)
  system_links text,
  -- Stakeholders
  stakeholders text,
  -- First session scheduling
  preferred_session_times text,
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- RLS
ALTER TABLE public.fractional_onboarding ENABLE ROW LEVEL SECURITY;

-- Policy: org members can read their own onboarding
CREATE POLICY fractional_onboarding_read ON public.fractional_onboarding
  FOR SELECT USING (
    organization_id IN (
      SELECT om.organization_id FROM public.organization_memberships om
      WHERE om.user_id = auth.uid() AND om.status = 'active'
    ) OR auth.uid() = user_id
  );

-- Policy: org members can insert/update their own onboarding
CREATE POLICY fractional_onboarding_write ON public.fractional_onboarding
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT om.organization_id FROM public.organization_memberships om
      WHERE om.user_id = auth.uid() AND om.status = 'active'
    )
  );

CREATE POLICY fractional_onboarding_update ON public.fractional_onboarding
  FOR UPDATE USING (
    organization_id IN (
      SELECT om.organization_id FROM public.organization_memberships om
      WHERE om.user_id = auth.uid() AND om.status = 'active'
    )
  );

-- Index for quick lookup
CREATE INDEX IF NOT EXISTS idx_fractional_onboarding_org ON public.fractional_onboarding(organization_id);
