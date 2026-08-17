import { createServiceClient } from '@/lib/supabase'
import { getAuthenticatedUser, getUserOrganizations } from '@/lib/auth/organization-resolver'

export type {
  DashboardOrganization,
  DashboardOffering,
  DashboardEngagement,
  DashboardInvitation,
  DashboardJoinRequest,
  DashboardData,
} from '@/lib/auth/dashboard-types'

export {
  getOfferingLabel,
  getOfferingDescription,
  getOfferingKindLabel,
  getOfferingRoute,
  getOfferingStatus,
  getEngagementTypeLabel,
  getEngagementStatusLabel,
} from '@/lib/auth/dashboard-types'

import type {
  DashboardData,
  DashboardOrganization,
  DashboardOffering,
  DashboardEngagement,
  DashboardInvitation,
  DashboardJoinRequest,
} from '@/lib/auth/dashboard-types'

/**
 * Resolve all dashboard data for the authenticated user in a single server-side call.
 * Uses service client for aggregation but only returns data the user is authorized to see
 * (filtered by their memberships and roles).
 */
export async function resolveDashboardData(): Promise<DashboardData | null> {
  const user = await getAuthenticatedUser()
  if (!user) return null

  const serviceClient = createServiceClient()
  if (!serviceClient) return null

  // 1. Get user's organizations with memberships
  const organizations = await getUserOrganizations(user)

  // 2. Get entitlements and offering roles for all user's orgs
  const orgIds = organizations.map(o => o.id)

  let orgOfferings: DashboardOffering[][] = organizations.map(() => [])

  if (orgIds.length > 0) {
    // Get all entitlements for these orgs
    const { data: entitlements } = await serviceClient
      .from('organization_entitlements')
      .select(`
        id,
        organization_id,
        status,
        valid_from,
        valid_until,
        offerings!inner(offering_key, name, offering_kind)
      `)
      .in('organization_id', orgIds)

    // Get user's offering roles for these orgs
    const { data: offeringRoles } = await serviceClient
      .from('member_offering_roles')
      .select(`
        id,
        organization_id,
        role,
        status,
        offerings!inner(offering_key, name)
      `)
      .in('organization_id', orgIds)
      .eq('user_id', user.id)
      .eq('status', 'active')

    const now = new Date()

    orgOfferings = organizations.map((org, idx) => {
      const orgEnts = (entitlements || []).filter((e: any) => e.organization_id === org.id)
      const orgRoles = (offeringRoles || []).filter((r: any) => r.organization_id === org.id)

      return orgEnts.map((e: any) => {
        let effectiveStatus = e.status
        if (e.status === 'active') {
          if (e.valid_until && new Date(e.valid_until) <= now) {
            effectiveStatus = 'expired'
          } else if (e.valid_from && new Date(e.valid_from) > now) {
            effectiveStatus = 'pending'
          }
        }
        const role = orgRoles.find((r: any) => r.offerings.offering_key === e.offerings.offering_key)
        return {
          offeringKey: e.offerings.offering_key,
          offeringName: e.offerings.name,
          offeringKind: e.offerings.offering_kind,
          entitlementStatus: e.status,
          effectiveStatus,
          hasRole: !!role,
          userRole: role?.role ?? null,
        }
      })
    })
  }

  const dashboardOrgs: DashboardOrganization[] = organizations.map((org, idx) => ({
    id: org.id,
    name: org.name,
    slug: org.slug,
    organizationKind: org.organization_kind,
    status: org.status,
    role: org.role,
    offerings: orgOfferings[idx] || [],
  }))

  // 2b. Fetch Work Orders needing input per org
  if (orgIds.length > 0) {
    const { data: woCounts } = await serviceClient
      .from('ai_work_orders')
      .select('organization_id')
      .in('organization_id', orgIds)
      .eq('status', 'needs_client_input')

    const woCountMap = new Map<string, number>()
    for (const wo of woCounts || []) {
      woCountMap.set(wo.organization_id, (woCountMap.get(wo.organization_id) || 0) + 1)
    }

    for (const org of dashboardOrgs) {
      org.workOrdersNeedingInput = woCountMap.get(org.id) || 0
    }

    // Fetch pending invitations count per org
    const { data: invCounts } = await serviceClient
      .from('organization_invitations')
      .select('organization_id')
      .in('organization_id', orgIds)
      .is('accepted_at', null)
      .is('revoked_at', null)
      .gt('expires_at', new Date().toISOString())

    const invCountMap = new Map<string, number>()
    for (const inv of invCounts || []) {
      invCountMap.set(inv.organization_id, (invCountMap.get(inv.organization_id) || 0) + 1)
    }

    for (const org of dashboardOrgs) {
      org.pendingInvitations = invCountMap.get(org.id) || 0
    }
  }

  // 3. Get engagements for user's orgs
  let engagements: DashboardEngagement[] = []
  if (orgIds.length > 0) {
    const { data: engData } = await serviceClient
      .from('engagements')
      .select(`
        id,
        organization_id,
        engagement_type,
        status,
        starts_at,
        ends_at
      `)
      .in('organization_id', orgIds)
      .order('created_at', { ascending: false })

    engagements = (engData || []).map((e: any) => {
      const org = dashboardOrgs.find(o => o.id === e.organization_id)
      return {
        id: e.id,
        organizationId: e.organization_id,
        organizationName: org?.name ?? 'Unknown',
        organizationSlug: org?.slug ?? '',
        engagementType: e.engagement_type,
        status: e.status,
        startsAt: e.starts_at,
        endsAt: e.ends_at,
      }
    })
  }

  // 4. Get pending invitations for user's email
  let invitations: DashboardInvitation[] = []
  if (user.email) {
    const { data: invData } = await serviceClient
      .from('organization_invitations')
      .select(`
        id,
        organization_id,
        role,
        expires_at
      `)
      .eq('email', user.email)
      .is('accepted_at', null)
      .is('revoked_at', null)
      .gt('expires_at', new Date().toISOString())

    invitations = (invData || []).map((inv: any) => {
      const org = organizations.find(o => o.id === inv.organization_id)
      const allOrgs = serviceClient
      return {
        id: inv.id,
        organizationName: org?.name ?? 'Organization',
        organizationSlug: org?.slug ?? '',
        role: inv.role,
        expiresAt: inv.expires_at,
      }
    })
  }

  // 5. Get pending join requests
  let joinRequests: DashboardJoinRequest[] = []
  const { data: jrData } = await serviceClient
    .from('join_requests')
    .select(`
      id,
      organization_id,
      status,
      created_at
    `)
    .eq('user_id', user.id)
    .eq('status', 'pending')

  joinRequests = (jrData || []).map((jr: any) => {
    const org = organizations.find(o => o.id === jr.organization_id)
    return {
      id: jr.id,
      organizationName: org?.name ?? 'Organization',
      organizationSlug: org?.slug ?? '',
      status: jr.status,
      createdAt: jr.created_at,
    }
  })

  return {
    user,
    organizations: dashboardOrgs,
    engagements,
    invitations,
    joinRequests,
    isPlatformAdmin: user.isPlatformAdmin,
  }
}
