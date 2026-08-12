-- Migration 0006: RLS policies for all foundation tables
-- Uses private schema helper functions for authorization

-- ============================================
-- PROFILES
-- ============================================
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id or private.is_platform_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- ============================================
-- ORGANIZATIONS
-- ============================================
alter table public.organizations enable row level security;

drop policy if exists "org_select_member" on public.organizations;
create policy "org_select_member" on public.organizations
  for select using (
    private.is_org_member(id) or private.is_platform_admin()
  );

drop policy if exists "org_insert_creator" on public.organizations;
create policy "org_insert_creator" on public.organizations
  for insert with check (
    auth.uid() = created_by or private.is_platform_admin()
  );

drop policy if exists "org_update_admin" on public.organizations;
create policy "org_update_admin" on public.organizations
  for update using (
    private.has_org_role(id, array['owner', 'admin']) or private.is_platform_admin()
  ) with check (
    private.has_org_role(id, array['owner', 'admin']) or private.is_platform_admin()
  );

-- No delete policy: organizations are archived, not deleted, via application logic
-- Platform admins can archive by updating status

-- ============================================
-- ORGANIZATION MEMBERSHIPS
-- ============================================
alter table public.organization_memberships enable row level security;

drop policy if exists "membership_select_org_member" on public.organization_memberships;
create policy "membership_select_org_member" on public.organization_memberships
  for select using (
    private.is_org_member(organization_id) or private.is_platform_admin()
  );

drop policy if exists "membership_insert_org_admin" on public.organization_memberships;
create policy "membership_insert_org_admin" on public.organization_memberships
  for insert with check (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  );

drop policy if exists "membership_update_org_admin" on public.organization_memberships;
create policy "membership_update_org_admin" on public.organization_memberships
  for update using (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  ) with check (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  );

drop policy if exists "membership_delete_org_admin" on public.organization_memberships;
create policy "membership_delete_org_admin" on public.organization_memberships
  for delete using (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  );

-- ============================================
-- ORGANIZATION INVITATIONS
-- ============================================
alter table public.organization_invitations enable row level security;

drop policy if exists "invitation_select_org_admin" on public.organization_invitations;
create policy "invitation_select_org_admin" on public.organization_invitations
  for select using (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  );

drop policy if exists "invitation_insert_org_admin" on public.organization_invitations;
create policy "invitation_insert_org_admin" on public.organization_invitations
  for insert with check (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  );

drop policy if exists "invitation_update_org_admin" on public.organization_invitations;
create policy "invitation_update_org_admin" on public.organization_invitations
  for update using (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  ) with check (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  );

drop policy if exists "invitation_delete_org_admin" on public.organization_invitations;
create policy "invitation_delete_org_admin" on public.organization_invitations
  for delete using (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  );

-- ============================================
-- PLATFORM USER ROLES
-- ============================================
alter table public.platform_user_roles enable row level security;

-- Users can see their own platform roles
drop policy if exists "platform_role_select_own" on public.platform_user_roles;
create policy "platform_role_select_own" on public.platform_user_roles
  for select using (
    auth.uid() = user_id or private.is_platform_admin()
  );

-- Only platform admins can insert/update/delete platform roles
drop policy if exists "platform_role_insert_admin" on public.platform_user_roles;
create policy "platform_role_insert_admin" on public.platform_user_roles
  for insert with check (private.is_platform_admin());

drop policy if exists "platform_role_update_admin" on public.platform_user_roles;
create policy "platform_role_update_admin" on public.platform_user_roles
  for update using (private.is_platform_admin())
  with check (private.is_platform_admin());

drop policy if exists "platform_role_delete_admin" on public.platform_user_roles;
create policy "platform_role_delete_admin" on public.platform_user_roles
  for delete using (private.is_platform_admin());

-- ============================================
-- OFFERINGS (platform-global catalog)
-- ============================================
alter table public.offerings enable row level security;

drop policy if exists "offerings_select_all" on public.offerings;
create policy "offerings_select_all" on public.offerings
  for select using (true);

drop policy if exists "offerings_write_admin" on public.offerings;
create policy "offerings_write_admin" on public.offerings
  for all using (private.is_platform_admin())
  with check (private.is_platform_admin());

-- ============================================
-- ORGANIZATION ENTITLEMENTS
-- ============================================
alter table public.organization_entitlements enable row level security;

drop policy if exists "entitlement_select_org_member" on public.organization_entitlements;
create policy "entitlement_select_org_member" on public.organization_entitlements
  for select using (
    private.is_org_member(organization_id) or private.is_platform_admin()
  );

drop policy if exists "entitlement_write_org_admin" on public.organization_entitlements;
create policy "entitlement_write_org_admin" on public.organization_entitlements
  for all using (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  ) with check (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  );

-- ============================================
-- MEMBER OFFERING ROLES
-- ============================================
alter table public.member_offering_roles enable row level security;

drop policy if exists "member_offering_select_org_member" on public.member_offering_roles;
create policy "member_offering_select_org_member" on public.member_offering_roles
  for select using (
    private.is_org_member(organization_id) or private.is_platform_admin()
  );

drop policy if exists "member_offering_write_org_admin" on public.member_offering_roles;
create policy "member_offering_write_org_admin" on public.member_offering_roles
  for all using (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  ) with check (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  );

-- ============================================
-- ENGAGEMENTS
-- ============================================
alter table public.engagements enable row level security;

drop policy if exists "engagement_select_org_member" on public.engagements;
create policy "engagement_select_org_member" on public.engagements
  for select using (
    private.is_org_member(organization_id) or private.is_platform_admin()
  );

drop policy if exists "engagement_write_org_admin" on public.engagements;
create policy "engagement_write_org_admin" on public.engagements
  for all using (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  ) with check (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  );

-- ============================================
-- ENGAGEMENT_OFFERINGS
-- ============================================
alter table public.engagement_offerings enable row level security;

drop policy if exists "eng_offering_select_org_member" on public.engagement_offerings;
create policy "eng_offering_select_org_member" on public.engagement_offerings
  for select using (
    exists (
      select 1 from public.engagements e
      where e.id = engagement_id
        and (private.is_org_member(e.organization_id) or private.is_platform_admin())
    )
  );

drop policy if exists "eng_offering_write_org_admin" on public.engagement_offerings;
create policy "eng_offering_write_org_admin" on public.engagement_offerings
  for all using (
    exists (
      select 1 from public.engagements e
      where e.id = engagement_id
        and (private.has_org_role(e.organization_id, array['owner', 'admin'])
             or private.is_platform_admin())
    )
  ) with check (
    exists (
      select 1 from public.engagements e
      where e.id = engagement_id
        and (private.has_org_role(e.organization_id, array['owner', 'admin'])
             or private.is_platform_admin())
    )
  );

-- ============================================
-- EXTERNAL_SYSTEM_LINKS
-- ============================================
alter table public.external_system_links enable row level security;

drop policy if exists "external_link_select_org_admin" on public.external_system_links;
create policy "external_link_select_org_admin" on public.external_system_links
  for select using (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  );

drop policy if exists "external_link_write_org_admin" on public.external_system_links;
create policy "external_link_write_org_admin" on public.external_system_links
  for all using (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  ) with check (
    private.has_org_role(organization_id, array['owner', 'admin'])
    or private.is_platform_admin()
  );

-- ============================================
-- AUDIT EVENTS (append-only, immutable by non-admins)
-- ============================================
alter table public.audit_events enable row level security;

drop policy if exists "audit_select_org_member" on public.audit_events;
create policy "audit_select_org_member" on public.audit_events
  for select using (
    (organization_id is not null and private.is_org_member(organization_id))
    or private.is_platform_admin()
    or (organization_id is null and auth.uid() = actor_user_id)
  );

drop policy if exists "audit_insert_org_member" on public.audit_events;
create policy "audit_insert_org_member" on public.audit_events
  for insert with check (
    (organization_id is not null and private.is_org_member(organization_id))
    or private.is_platform_admin()
    or (organization_id is null and auth.uid() is not null)
  );

-- No update or delete policies: audit events are immutable
