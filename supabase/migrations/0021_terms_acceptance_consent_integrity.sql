-- Migration 0021: Enhance terms_acceptance_records for consent integrity
-- Date: 2026-08-15
-- Purpose: Add Stripe customer/subscription IDs, billing period, consent source,
-- and a unique constraint on checkout_session_id to prevent duplicate acceptance
-- records from duplicate webhook deliveries.
--
-- This migration is ADDITIVE — it does not rewrite migration 0020.
-- It adds columns, a unique constraint, and updates the comment.

-- Add new columns for consent binding
ALTER TABLE terms_acceptance_records
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS billing_period TEXT,
  ADD COLUMN IF NOT EXISTS consent_source TEXT NOT NULL DEFAULT 'stripe_checkout';

-- Add unique constraint on checkout_session_id to prevent duplicate records
-- from duplicate Stripe webhook deliveries (idempotent acceptance recording)
CREATE UNIQUE INDEX IF NOT EXISTS idx_terms_acceptance_session_unique
  ON terms_acceptance_records(checkout_session_id);

-- Update comment
COMMENT ON TABLE terms_acceptance_records IS
  'Records terms of service and service schedule acceptance at checkout completion. Acceptance is recorded ONLY after checkout.session.completed with verified Stripe consent. Unique constraint on checkout_session_id prevents duplicate records from duplicate webhook deliveries.';
