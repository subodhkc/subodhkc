-- ============================================
-- PRODUCTION ECONOMICS + SECURITY MIGRATION
-- ============================================
-- Applied via 3 Supabase migrations:
--   1. security_fixes_rls_and_revoke
--   2. performance_indexes
--   3. ai_advisor_tables
--   4. fix_security_definer_revoke_public
-- ============================================

-- ============================================
-- 1. Enable RLS on signup_email_domains
-- ============================================
ALTER TABLE public.signup_email_domains ENABLE ROW LEVEL SECURITY;

CREATE POLICY signup_domains_select_authenticated
  ON public.signup_email_domains
  FOR SELECT
  TO authenticated
  USING (type = 'allow');

-- ============================================
-- 2. Revoke EXECUTE from PUBLIC on SECURITY DEFINER functions
--    Must revoke from PUBLIC (not just anon/authenticated) since
--    PostgreSQL grants EXECUTE to PUBLIC by default.
--    Then grant back only to postgres (service role).
-- ============================================
REVOKE EXECUTE ON FUNCTION public.auto_join_edu_to_demo() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.hook_restrict_signup_by_email_domain(event jsonb) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.prevent_last_owner_removal() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.reseed_demo_data() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.close_stale_sessions(p_site_id uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.ensure_active_dismissal_session(p_site_id uuid, p_service_date date) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.set_release_eligibility(p_queue_item_id uuid, p_organization_id uuid, p_school_site_id uuid, p_release_at timestamp with time zone, p_override_reason text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.process_pickup_checkin(p_site_id uuid, p_credential_token text, p_pickup_group_id uuid, p_source text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.write_parent_checkin_event(p_org_id uuid, p_site_id uuid, p_session_id uuid, p_group_id uuid, p_token_id uuid, p_arrival_id uuid, p_outcome text, p_ip_address inet, p_user_agent text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.transition_arrival_status(p_arrival_id uuid, p_new_status text, p_reason text, p_expected_current_status text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.transition_queue_status(p_queue_item_id uuid, p_new_status text, p_reason text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.transition_queue_status(p_queue_item_id uuid, p_new_status text, p_reason text, p_expected_current_status text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_classroom(p_actor_user_id uuid, p_org_id uuid, p_site_id uuid, p_classroom_id uuid, p_name text, p_grade_label text, p_teacher_display_label text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_school_site(p_actor_user_id uuid, p_org_id uuid, p_site_id uuid, p_name text, p_timezone text, p_status text, p_address_line1 text, p_address_line2 text, p_city text, p_state_province text, p_postal_code text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_student(p_actor_user_id uuid, p_org_id uuid, p_site_id uuid, p_student_id uuid, p_first_name text, p_last_name text, p_external_student_id text, p_classroom_id uuid, p_status text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.create_classroom(p_actor_user_id uuid, p_org_id uuid, p_site_id uuid, p_name text, p_grade_label text, p_teacher_display_label text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.create_school_site(p_actor_user_id uuid, p_org_id uuid, p_name text, p_slug text, p_timezone text, p_address_line1 text, p_address_line2 text, p_city text, p_state_province text, p_postal_code text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.create_student_with_group(p_actor_user_id uuid, p_org_id uuid, p_site_id uuid, p_first_name text, p_last_name text, p_external_student_id text, p_classroom_id uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.import_students(p_actor_user_id uuid, p_org_id uuid, p_site_id uuid, p_students jsonb) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.issue_credential(p_actor_user_id uuid, p_org_id uuid, p_site_id uuid, p_pickup_group_id uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.replace_credential(p_old_credential_id uuid, p_reason text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.revoke_credential(p_credential_id uuid, p_reason text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.open_pickup_session(p_site_id uuid, p_service_date date) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.close_pickup_session(p_session_id uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.cancel_pickup_session(p_session_id uuid, p_reason text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.accept_invitation(inv_token text, inv_email text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.transfer_ownership(org_id uuid, new_owner_user_id uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.remove_member(org_id uuid, member_user_id uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.claim_guardian_invitation(p_token text, p_auth_email text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.rotate_checkin_code(p_site_id uuid, p_purpose text, p_lane text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.revoke_checkin_code(p_code_id uuid, p_reason text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.parent_self_checkin(p_site_id uuid, p_parent_token text, p_ip_address inet, p_user_agent text) FROM PUBLIC;

-- Grant back to postgres (service role operates as postgres)
GRANT EXECUTE ON FUNCTION public.auto_join_edu_to_demo() TO postgres;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres;
GRANT EXECUTE ON FUNCTION public.hook_restrict_signup_by_email_domain(event jsonb) TO postgres;
GRANT EXECUTE ON FUNCTION public.prevent_last_owner_removal() TO postgres;
GRANT EXECUTE ON FUNCTION public.reseed_demo_data() TO postgres;
GRANT EXECUTE ON FUNCTION public.close_stale_sessions(p_site_id uuid) TO postgres;
GRANT EXECUTE ON FUNCTION public.ensure_active_dismissal_session(p_site_id uuid, p_service_date date) TO postgres;
GRANT EXECUTE ON FUNCTION public.set_release_eligibility(p_queue_item_id uuid, p_organization_id uuid, p_school_site_id uuid, p_release_at timestamp with time zone, p_override_reason text) TO postgres;
GRANT EXECUTE ON FUNCTION public.process_pickup_checkin(p_site_id uuid, p_credential_token text, p_pickup_group_id uuid, p_source text) TO postgres;
GRANT EXECUTE ON FUNCTION public.write_parent_checkin_event(p_org_id uuid, p_site_id uuid, p_session_id uuid, p_group_id uuid, p_token_id uuid, p_arrival_id uuid, p_outcome text, p_ip_address inet, p_user_agent text) TO postgres;
GRANT EXECUTE ON FUNCTION public.transition_arrival_status(p_arrival_id uuid, p_new_status text, p_reason text, p_expected_current_status text) TO postgres;
GRANT EXECUTE ON FUNCTION public.transition_queue_status(p_queue_item_id uuid, p_new_status text, p_reason text) TO postgres;
GRANT EXECUTE ON FUNCTION public.transition_queue_status(p_queue_item_id uuid, p_new_status text, p_reason text, p_expected_current_status text) TO postgres;
GRANT EXECUTE ON FUNCTION public.update_classroom(p_actor_user_id uuid, p_org_id uuid, p_site_id uuid, p_classroom_id uuid, p_name text, p_grade_label text, p_teacher_display_label text) TO postgres;
GRANT EXECUTE ON FUNCTION public.update_school_site(p_actor_user_id uuid, p_org_id uuid, p_site_id uuid, p_name text, p_timezone text, p_status text, p_address_line1 text, p_address_line2 text, p_city text, p_state_province text, p_postal_code text) TO postgres;
GRANT EXECUTE ON FUNCTION public.update_student(p_actor_user_id uuid, p_org_id uuid, p_site_id uuid, p_student_id uuid, p_first_name text, p_last_name text, p_external_student_id text, p_classroom_id uuid, p_status text) TO postgres;
GRANT EXECUTE ON FUNCTION public.create_classroom(p_actor_user_id uuid, p_org_id uuid, p_site_id uuid, p_name text, p_grade_label text, p_teacher_display_label text) TO postgres;
GRANT EXECUTE ON FUNCTION public.create_school_site(p_actor_user_id uuid, p_org_id uuid, p_name text, p_slug text, p_timezone text, p_address_line1 text, p_address_line2 text, p_city text, p_state_province text, p_postal_code text) TO postgres;
GRANT EXECUTE ON FUNCTION public.create_student_with_group(p_actor_user_id uuid, p_org_id uuid, p_site_id uuid, p_first_name text, p_last_name text, p_external_student_id text, p_classroom_id uuid) TO postgres;
GRANT EXECUTE ON FUNCTION public.import_students(p_actor_user_id uuid, p_org_id uuid, p_site_id uuid, p_students jsonb) TO postgres;
GRANT EXECUTE ON FUNCTION public.issue_credential(p_actor_user_id uuid, p_org_id uuid, p_site_id uuid, p_pickup_group_id uuid) TO postgres;
GRANT EXECUTE ON FUNCTION public.replace_credential(p_old_credential_id uuid, p_reason text) TO postgres;
GRANT EXECUTE ON FUNCTION public.revoke_credential(p_credential_id uuid, p_reason text) TO postgres;
GRANT EXECUTE ON FUNCTION public.open_pickup_session(p_site_id uuid, p_service_date date) TO postgres;
GRANT EXECUTE ON FUNCTION public.close_pickup_session(p_session_id uuid) TO postgres;
GRANT EXECUTE ON FUNCTION public.cancel_pickup_session(p_session_id uuid, p_reason text) TO postgres;
GRANT EXECUTE ON FUNCTION public.accept_invitation(inv_token text, inv_email text) TO postgres;
GRANT EXECUTE ON FUNCTION public.transfer_ownership(org_id uuid, new_owner_user_id uuid) TO postgres;
GRANT EXECUTE ON FUNCTION public.remove_member(org_id uuid, member_user_id uuid) TO postgres;
GRANT EXECUTE ON FUNCTION public.claim_guardian_invitation(p_token text, p_auth_email text) TO postgres;
GRANT EXECUTE ON FUNCTION public.rotate_checkin_code(p_site_id uuid, p_purpose text, p_lane text) TO postgres;
GRANT EXECUTE ON FUNCTION public.revoke_checkin_code(p_code_id uuid, p_reason text) TO postgres;
GRANT EXECUTE ON FUNCTION public.parent_self_checkin(p_site_id uuid, p_parent_token text, p_ip_address inet, p_user_agent text) TO postgres;

-- Grant to authenticated for RPC-callable functions
GRANT EXECUTE ON FUNCTION public.get_guardian_family_data(p_site_id uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_guardian_sites() TO authenticated;
GRANT EXECUTE ON FUNCTION public.guardian_self_checkin(p_site_id uuid, p_checkin_code text, p_pickup_group_id uuid) TO authenticated;

-- ============================================
-- 3. Fix private.set_updated_at search_path
-- ============================================
ALTER FUNCTION private.set_updated_at() SET search_path = public, pg_temp;

-- ============================================
-- 4. Add missing FK indexes (engagement tables)
--    Identified by Supabase Performance Advisor
-- ============================================

-- engagement_acknowledgments: user_id FK
CREATE INDEX IF NOT EXISTS idx_ack_user ON public.engagement_acknowledgments (user_id);

-- engagement_actions: workstream_id FK
CREATE INDEX IF NOT EXISTS idx_act_workstream ON public.engagement_actions (workstream_id) WHERE (workstream_id IS NOT NULL);

-- engagement_artifacts: authored_by, superseded_by, workstream_id FKs
CREATE INDEX IF NOT EXISTS idx_art_authored_by ON public.engagement_artifacts (authored_by) WHERE (authored_by IS NOT NULL);
CREATE INDEX IF NOT EXISTS idx_art_superseded_by ON public.engagement_artifacts (superseded_by) WHERE (superseded_by IS NOT NULL);
CREATE INDEX IF NOT EXISTS idx_art_workstream ON public.engagement_artifacts (workstream_id) WHERE (workstream_id IS NOT NULL);

-- engagement_change_requests: accepted_by, requested_by FKs
CREATE INDEX IF NOT EXISTS idx_cr_accepted_by ON public.engagement_change_requests (accepted_by) WHERE (accepted_by IS NOT NULL);
CREATE INDEX IF NOT EXISTS idx_cr_requested_by ON public.engagement_change_requests (requested_by);

-- engagement_decisions: decision_owner_user_id, workstream_id FKs
CREATE INDEX IF NOT EXISTS idx_dec_owner ON public.engagement_decisions (decision_owner_user_id) WHERE (decision_owner_user_id IS NOT NULL);
CREATE INDEX IF NOT EXISTS idx_dec_workstream ON public.engagement_decisions (workstream_id) WHERE (workstream_id IS NOT NULL);

-- engagement_internal_notes: author_id FK
CREATE INDEX IF NOT EXISTS idx_in_author ON public.engagement_internal_notes (author_id);

-- engagement_milestones: workstream_id FK
CREATE INDEX IF NOT EXISTS idx_mil_workstream ON public.engagement_milestones (workstream_id) WHERE (workstream_id IS NOT NULL);

-- engagement_solution_links: external_link_id FK
CREATE INDEX IF NOT EXISTS idx_sol_external_link ON public.engagement_solution_links (external_link_id);

-- engagement_updates: authored_by FK
CREATE INDEX IF NOT EXISTS idx_upd_authored_by ON public.engagement_updates (authored_by) WHERE (authored_by IS NOT NULL);

-- ============================================
-- 5. Composite indexes for common query patterns
-- ============================================

-- pickup_queue_items: filtered by org + site + session + status
CREATE INDEX IF NOT EXISTS idx_queue_org_site_session_status
  ON public.pickup_queue_items (organization_id, school_site_id, session_id, current_status);

-- pickup_arrivals: filtered by org + site + session
CREATE INDEX IF NOT EXISTS idx_arrivals_org_site_session
  ON public.pickup_arrivals (organization_id, school_site_id, session_id);

-- school_students: filtered by site + status + classroom
CREATE INDEX IF NOT EXISTS idx_students_site_status_classroom
  ON public.school_students (school_site_id, status, classroom_id);

-- engagement_actions: filtered by engagement + status
CREATE INDEX IF NOT EXISTS idx_act_engagement_status
  ON public.engagement_actions (engagement_id, status);

-- engagement_decisions: filtered by engagement + status
CREATE INDEX IF NOT EXISTS idx_dec_engagement_status
  ON public.engagement_decisions (engagement_id, status);

-- engagement_milestones: filtered by engagement + status
CREATE INDEX IF NOT EXISTS idx_mil_engagement_status
  ON public.engagement_milestones (engagement_id, status);

-- engagement_artifacts: filtered by engagement + status
CREATE INDEX IF NOT EXISTS idx_art_engagement_status
  ON public.engagement_artifacts (engagement_id, status);

-- engagement_updates: filtered by engagement + status
CREATE INDEX IF NOT EXISTS idx_upd_engagement_status
  ON public.engagement_updates (engagement_id, status);

-- ============================================
-- 6. AI Advisor tables
-- ============================================

-- Store generated AI briefings (versioned, not regenerated on every view)
CREATE TABLE IF NOT EXISTS public.ai_briefings (
  id uuid default gen_random_uuid primary key,
  engagement_id uuid references public.engagements(id) on delete cascade,
  briefing_type text not null check (briefing_type in ('executive_update', 'engagement_impact', 'advisor_context')),
  context_type text not null default 'internal' check (context_type in ('client', 'internal')),
  content jsonb not null,
  source_snapshot_date timestamptz not null default now(),
  model_used text,
  token_count int,
  version int not null default 1,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_ai_briefings_engagement_type
  ON public.ai_briefings (engagement_id, briefing_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_briefings_engagement_latest
  ON public.ai_briefings (engagement_id, briefing_type, version DESC);

CREATE INDEX IF NOT EXISTS idx_ai_briefings_context_type
  ON public.ai_briefings (context_type);

ALTER TABLE public.ai_briefings ENABLE ROW LEVEL SECURITY;

-- Only org members can see briefings for their org's engagements
CREATE POLICY ai_briefings_select_org_member
  ON public.ai_briefings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_memberships om
      JOIN public.engagements e ON e.organization_id = om.organization_id
      WHERE e.id = ai_briefings.engagement_id
        AND om.user_id = auth.uid()
        AND om.status = 'active'
    )
  );

-- Only service role can insert/update/delete
-- (No INSERT/UPDATE/DELETE policy for authenticated/anon)

-- ============================================
-- 7. FrontOfAI intelligence cache table
--    Stores imported FrontOfAI weekly brief data
--    NOT regenerated by our platform
-- ============================================

CREATE TABLE IF NOT EXISTS public.frontofai_briefs (
  id uuid default gen_random_uuid primary key,
  brief_date date not null,
  title text not null,
  content jsonb not null,
  source_url text,
  imported_at timestamptz not null default now(),
  imported_by uuid references auth.users(id),
  unique(brief_date)
);

CREATE INDEX IF NOT EXISTS idx_frontofai_briefs_date
  ON public.frontofai_briefs (brief_date DESC);

ALTER TABLE public.frontofai_briefs ENABLE ROW LEVEL SECURITY;

-- Platform admins can manage, authenticated can read
CREATE POLICY frontofai_select_authenticated
  ON public.frontofai_briefs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY frontofai_manage_platform_admin
  ON public.frontofai_briefs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.platform_user_roles
      WHERE user_id = auth.uid() AND role = 'platform_admin'
    )
  );

-- ============================================
-- 8. Engagement impact addenda
--    Generated weekly, stored, not regenerated on view
-- ============================================

CREATE TABLE IF NOT EXISTS public.engagement_impact_addenda (
  id uuid default gen_random_uuid primary key,
  engagement_id uuid references public.engagements(id) on delete cascade,
  frontofai_brief_id uuid references public.frontofai_briefs(id),
  signals jsonb not null,
  generated_at timestamptz not null default now(),
  version int not null default 1,
  unique(engagement_id, frontofai_brief_id)
);

CREATE INDEX IF NOT EXISTS idx_impact_addenda_engagement
  ON public.engagement_impact_addenda (engagement_id, generated_at DESC);

ALTER TABLE public.engagement_impact_addenda ENABLE ROW LEVEL SECURITY;

-- Only org members can see addenda for their engagements
CREATE POLICY impact_addenda_select_org_member
  ON public.engagement_impact_addenda
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_memberships om
      JOIN public.engagements e ON e.organization_id = om.organization_id
      WHERE e.id = engagement_impact_addenda.engagement_id
        AND om.user_id = auth.uid()
        AND om.status = 'active'
    )
  );

-- ============================================
-- 9. AI advisor audit log
--    Track AI usage for cost observability
-- ============================================

CREATE TABLE IF NOT EXISTS public.ai_usage_log (
  id uuid default gen_random_uuid primary key,
  user_id uuid references auth.users(id),
  engagement_id uuid references public.engagements(id),
  request_type text not null check (request_type in ('ask_advisor', 'generate_briefing', 'generate_impact')),
  context_type text not null check (context_type in ('client', 'internal')),
  model_used text,
  input_tokens int,
  output_tokens int,
  latency_ms int,
  created_at timestamptz not null default now()
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_user_date
  ON public.ai_usage_log (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_usage_engagement
  ON public.ai_usage_log (engagement_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_usage_type_date
  ON public.ai_usage_log (request_type, created_at DESC);

ALTER TABLE public.ai_usage_log ENABLE ROW LEVEL SECURITY;

-- Users can see their own AI usage
CREATE POLICY ai_usage_select_own
  ON public.ai_usage_log
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Platform admins can see all
CREATE POLICY ai_usage_select_platform_admin
  ON public.ai_usage_log
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.platform_user_roles
      WHERE user_id = auth.uid() AND role = 'platform_admin'
    )
  );

-- Only service role can insert (via API routes)
