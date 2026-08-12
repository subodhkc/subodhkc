import { createServiceClient } from '@/lib/supabase'
import {
  getAuthenticatedUser,
  resolveOrganizationContext,
  requireOfferingAccess,
  AuthError,
  type AuthenticatedUser,
  type OrganizationContext,
} from '@/lib/auth/organization-resolver'

export type SchoolRole = 'school_admin' | 'dismissal_manager' | 'scanner' | 'teacher'

export interface SchoolSite {
  id: string
  organization_id: string
  name: string
  slug: string
  status: string
  timezone: string
  address_line1: string | null
  address_line2: string | null
  city: string | null
  state_province: string | null
  postal_code: string | null
}

export interface StaffAssignment {
  id: string
  role: SchoolRole
  status: string
}

export interface SchoolContext {
  organization: OrganizationContext
  site: SchoolSite
  staffAssignment: StaffAssignment | null
  schoolRole: SchoolRole | null
  canManageStaff: boolean
  canEditRoster: boolean
  canIssueCredentials: boolean
  canManageSettings: boolean
}

export class SchoolAuthError extends Error {
  code: string
  constructor(code: string, message: string) {
    super(message)
    this.code = code
    this.name = 'SchoolAuthError'
  }
}

/**
 * Get all school sites the user has access to within an organization.
 */
export async function getUserSchoolSites(
  user: AuthenticatedUser,
  orgId: string
): Promise<SchoolSite[]> {
  const serviceClient = createServiceClient()
  if (!serviceClient) return []

  if (user.isPlatformAdmin) {
    const { data } = await serviceClient
      .from('school_sites')
      .select('id, organization_id, name, slug, status, timezone, address_line1, address_line2, city, state_province, postal_code')
      .eq('organization_id', orgId)
      .order('name')
    return data || []
  }

  // Get sites via staff assignments
  const { data } = await serviceClient
    .from('school_staff_assignments')
    .select(`
      school_site_id,
      school_sites!inner(id, organization_id, name, slug, status, timezone, address_line1, address_line2, city, state_province, postal_code)
    `)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .eq('school_sites.organization_id', orgId)
    .eq('school_sites.status', 'active')

  return (data || []).map((d: any) => d.school_sites)
}

/**
 * Resolve the full school context for an authenticated user.
 * Verifies: auth → org membership → offering access → site → staff assignment
 */
export async function resolveSchoolContext(
  user: AuthenticatedUser,
  orgSlug: string,
  siteSlug: string
): Promise<SchoolContext> {
  // 1. Resolve org context (verifies membership, entitlements)
  let orgCtx: OrganizationContext
  try {
    orgCtx = await resolveOrganizationContext(user, orgSlug)
  } catch (err) {
    if (err instanceof AuthError) {
      throw new SchoolAuthError(err.code, err.message)
    }
    throw err
  }

  // 2. Verify school_pickup offering access
  try {
    requireOfferingAccess(orgCtx, 'school_pickup')
  } catch (err) {
    if (err instanceof AuthError) {
      throw new SchoolAuthError(err.code, err.message)
    }
    throw err
  }

  const serviceClient = createServiceClient()
  if (!serviceClient) {
    throw new SchoolAuthError('unauthorized', 'Service client not available')
  }

  // 3. Resolve site by slug within org
  const { data: site, error: siteError } = await serviceClient
    .from('school_sites')
    .select('id, organization_id, name, slug, status, timezone, address_line1, address_line2, city, state_province, postal_code')
    .eq('organization_id', orgCtx.organization.id)
    .eq('slug', siteSlug)
    .single()

  if (siteError || !site) {
    throw new SchoolAuthError('site_not_found', `Site '${siteSlug}' not found`)
  }

  // 4. Get staff assignment
  const { data: assignment } = await serviceClient
    .from('school_staff_assignments')
    .select('id, role, status')
    .eq('school_site_id', site.id)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  // 5. Determine permissions
  const isPlatformAdmin = user.isPlatformAdmin
  const isOrgAdmin = orgCtx.organizationRole === 'owner' || orgCtx.organizationRole === 'admin'
  const schoolRole = assignment?.role as SchoolRole | null

  const canManageStaff = isPlatformAdmin || isOrgAdmin || schoolRole === 'school_admin'
  const canEditRoster = isPlatformAdmin || isOrgAdmin ||
    schoolRole === 'school_admin' || schoolRole === 'dismissal_manager'
  const canIssueCredentials = canEditRoster
  const canManageSettings = isPlatformAdmin || isOrgAdmin

  // 6. Verify user has any access to this site
  if (!assignment && !isPlatformAdmin && !isOrgAdmin) {
    throw new SchoolAuthError('site_access_denied', 'You do not have access to this school site')
  }

  return {
    organization: orgCtx,
    site: site as SchoolSite,
    staffAssignment: assignment as StaffAssignment | null,
    schoolRole,
    canManageStaff,
    canEditRoster,
    canIssueCredentials,
    canManageSettings,
  }
}

/**
 * Check setup completion state for a site.
 */
export interface SiteSetupState {
  hasClassrooms: boolean
  hasStaff: boolean
  hasStudents: boolean
  hasCredentials: boolean
  completedSteps: string[]
  pendingSteps: string[]
}

export async function getSiteSetupState(
  orgId: string,
  siteId: string
): Promise<SiteSetupState> {
  const serviceClient = createServiceClient()
  if (!serviceClient) {
    return {
      hasClassrooms: false,
      hasStaff: false,
      hasStudents: false,
      hasCredentials: false,
      completedSteps: [],
      pendingSteps: ['site', 'classrooms', 'staff', 'students', 'credentials'],
    }
  }

  const [classroomsResult, staffResult, studentsResult, credentialsResult] = await Promise.all([
    serviceClient.from('school_classrooms').select('id', { count: 'exact', head: true }).eq('school_site_id', siteId),
    serviceClient.from('school_staff_assignments').select('id', { count: 'exact', head: true }).eq('school_site_id', siteId).eq('status', 'active'),
    serviceClient.from('school_students').select('id', { count: 'exact', head: true }).eq('school_site_id', siteId).eq('status', 'active'),
    serviceClient.from('pickup_credentials').select('id', { count: 'exact', head: true }).eq('school_site_id', siteId).eq('status', 'active'),
  ])

  const hasClassrooms = (classroomsResult.count ?? 0) > 0
  const hasStaff = (staffResult.count ?? 0) > 0
  const hasStudents = (studentsResult.count ?? 0) > 0
  const hasCredentials = (credentialsResult.count ?? 0) > 0

  const completedSteps: string[] = ['site']
  const pendingSteps: string[] = []

  if (hasClassrooms) completedSteps.push('classrooms')
  else pendingSteps.push('classrooms')
  if (hasStaff) completedSteps.push('staff')
  else pendingSteps.push('staff')
  if (hasStudents) completedSteps.push('students')
  else pendingSteps.push('students')
  if (hasCredentials) completedSteps.push('credentials')
  else pendingSteps.push('credentials')

  return { hasClassrooms, hasStaff, hasStudents, hasCredentials, completedSteps, pendingSteps }
}
