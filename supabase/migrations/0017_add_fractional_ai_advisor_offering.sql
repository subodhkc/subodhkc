-- Migration: Add fractional_ai_advisor offering
-- Date: 2026-08-15
-- Phase 2.5: Commercial Offer Architecture
--
-- Adds the fractional_ai_advisor offering to the offerings table.
-- This is required for entitlement activation and engagement creation
-- when a Fractional AI Advisor checkout completes.
--
-- Idempotent: uses WHERE NOT EXISTS to prevent duplicate inserts.

INSERT INTO offerings (offering_key, name, description, offering_kind, status)
SELECT
  'fractional_ai_advisor',
  'Fractional AI Advisor',
  'Executive AI advisory subscription for higher-stakes decisions. Strategy, architecture, vendor evaluation, build-vs-buy, and roadmap review. $1,250/month or $12,500/year.',
  'service',
  'active'
WHERE NOT EXISTS (
  SELECT 1 FROM offerings WHERE offering_key = 'fractional_ai_advisor'
);
