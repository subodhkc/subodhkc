-- Migration: Product access requests (HAIEC, KestrelVoice, etc.)
-- Date: 2026-08-15
-- Phase 2.5 P2: Cross-product continuity
--
-- Creates a table for users to request access to products like HAIEC and
-- KestrelVoice. Subodh reviews and activates from the backend.
-- Idempotent.

CREATE TABLE IF NOT EXISTS public.product_access_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  offering_key text NOT NULL,
  status text NOT NULL DEFAULT 'requested' CHECK (status = ANY (ARRAY['requested'::text, 'approved'::text, 'activated'::text, 'declined'::text, 'cancelled'::text])),
  request_note text,
  admin_note text,
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE public.product_access_requests ENABLE ROW LEVEL SECURITY;

-- Org members can read their own requests
CREATE POLICY product_access_requests_read ON public.product_access_requests
  FOR SELECT USING (
    organization_id IN (
      SELECT om.organization_id FROM public.organization_memberships om
      WHERE om.user_id = auth.uid() AND om.status = 'active'
    )
  );

-- Org members can create requests
CREATE POLICY product_access_requests_insert ON public.product_access_requests
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT om.organization_id FROM public.organization_memberships om
      WHERE om.user_id = auth.uid() AND om.status = 'active'
    )
  );

-- Org members can cancel their own requests
CREATE POLICY product_access_requests_update ON public.product_access_requests
  FOR UPDATE USING (
    organization_id IN (
      SELECT om.organization_id FROM public.organization_memberships om
      WHERE om.user_id = auth.uid() AND om.status = 'active'
    )
  );

-- Index
CREATE INDEX IF NOT EXISTS idx_product_access_requests_org ON public.product_access_requests(organization_id);
CREATE INDEX IF NOT EXISTS idx_product_access_requests_status ON public.product_access_requests(status);
