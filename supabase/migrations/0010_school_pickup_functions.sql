-- ============================================
-- Migration 0010: School Pickup Transactional Functions
-- Applied via Supabase MCP
-- ============================================
-- This file is the repository source of truth for the RPC functions.

-- Functions:
-- public.open_pickup_session(site_id, service_date) -> uuid
-- public.close_pickup_session(session_id) -> void
-- public.cancel_pickup_session(session_id, reason) -> void
-- public.process_pickup_checkin(site_id, credential_token, pickup_group_id, source) -> jsonb
-- public.transition_queue_status(queue_item_id, new_status, reason) -> jsonb
-- public.revoke_credential(credential_id, reason) -> void
-- public.replace_credential(old_credential_id, reason) -> jsonb

-- All functions are SECURITY DEFINER with explicit search_path.
-- Execute revoked from anon and authenticated.
-- Called via service role client from API routes.

-- State machine (sessions):
--   scheduled -> open (via open_pickup_session)
--   open -> closed (via close_pickup_session)
--   scheduled -> cancelled (via cancel_pickup_session)
--   open -> cancelled (via cancel_pickup_session)
--   closed -> (terminal)
--   cancelled -> (terminal)

-- State machine (queue items):
--   null -> arrived (initial)
--   arrived -> preparing, ready, completed, cancelled, exception
--   preparing -> ready, arrived, completed, cancelled, exception
--   ready -> completed, preparing, cancelled, exception
--   exception -> arrived, preparing, ready, completed, cancelled
--   completed -> (terminal, no transitions)
--   cancelled -> (terminal, no transitions)

-- Idempotency:
--   process_pickup_checkin uses UNIQUE(session_id, pickup_group_id)
--   and SELECT FOR UPDATE to guarantee one arrival per group per session.
--   Repeated scans return the existing canonical result with outcome='duplicate'.

-- Sequence allocation:
--   pickup_session_counters row locked with FOR UPDATE.
--   Atomic increment via UPDATE ... RETURNING.
--   Gaps acceptable; uniqueness guaranteed by UNIQUE(session_id, sequence_number).
