import type { AuthenticatedUser, OrganizationRole } from '@/lib/auth/organization-resolver'

export interface DashboardOrganization {
  id: string
  name: string
  slug: string
  organizationKind: string
  status: string
  role: OrganizationRole
  offerings: DashboardOffering[]
}

export interface DashboardOffering {
  offeringKey: string
  offeringName: string
  offeringKind: string
  entitlementStatus: string
  effectiveStatus: string
  hasRole: boolean
  userRole: string | null
}

export interface DashboardEngagement {
  id: string
  organizationId: string
  organizationName: string
  organizationSlug: string
  engagementType: string
  status: string
  startsAt: string | null
  endsAt: string | null
}

export interface DashboardInvitation {
  id: string
  organizationName: string
  organizationSlug: string
  role: string
  expiresAt: string
}

export interface DashboardJoinRequest {
  id: string
  organizationName: string
  organizationSlug: string
  status: string
  createdAt: string
}

export interface DashboardData {
  user: AuthenticatedUser
  organizations: DashboardOrganization[]
  engagements: DashboardEngagement[]
  invitations: DashboardInvitation[]
  joinRequests: DashboardJoinRequest[]
  isPlatformAdmin: boolean
}

const OFFERING_LABELS: Record<string, { label: string; description: string; kind: string }> = {
  advisory: { label: 'Advisory', description: 'Strategic counsel and governance advisory', kind: 'service' },
  fractional_ai: { label: 'Fractional AI', description: 'Embedded fractional AI leadership', kind: 'service' },
  school_pickup: { label: 'School Pickup', description: 'Dismissal queue management system', kind: 'product' },
  haiec: { label: 'HAIEC', description: 'AI assurance and compliance engine', kind: 'product' },
  rca_tool: { label: 'RCA Analyzer', description: 'Root cause analysis for technical issues', kind: 'tool' },
  ai_article_generator: { label: 'AI Article Generator', description: 'Create technical content', kind: 'tool' },
  kestrel: { label: 'KestrelVoice', description: 'Voice automation platform', kind: 'external_product' },
  six_stones_ai: { label: 'Six Stones AI', description: 'AI program management', kind: 'program' },
  ai_advisor_desk: { label: 'AI Advisor Desk', description: 'Monthly AI advisory subscription', kind: 'service' },
  ai_automation_blueprint: { label: 'AI Automation Blueprint', description: 'Fixed-scope automation analysis', kind: 'service' },
  managed_voice: { label: 'Managed AI Voice', description: 'Managed voice deployment service', kind: 'service' },
  ai_security_compliance: { label: 'AI Security & Compliance', description: 'AI security and compliance review', kind: 'service' },
  saas_security_review: { label: 'SaaS & AI Security Review', description: 'Focused application security review', kind: 'service' },
}

export function getOfferingLabel(key: string): string {
  return OFFERING_LABELS[key]?.label ?? key
}

export function getOfferingDescription(key: string): string {
  return OFFERING_LABELS[key]?.description ?? ''
}

export function getOfferingKindLabel(kind: string): string {
  const labels: Record<string, string> = {
    service: 'Service',
    product: 'Platform',
    tool: 'Tool',
    program: 'Program',
    external_product: 'External Platform',
  }
  return labels[kind] ?? kind
}

export function getEngagementTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    project: 'Project',
    retainer: 'Retainer',
    fractional: 'Fractional',
    pilot: 'Pilot',
    program: 'Program',
    pro_bono: 'Pro Bono',
  }
  return labels[type] ?? type
}

export function getEngagementStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: 'Active',
    completed: 'Completed',
    paused: 'Paused',
    cancelled: 'Cancelled',
    pending: 'Pending',
  }
  return labels[status] ?? status
}

export function getOfferingRoute(orgSlug: string, offeringKey: string): string | null {
  switch (offeringKey) {
    case 'school_pickup':
      return `/app/${orgSlug}/school-pickup`
    case 'advisory':
      return `/app/${orgSlug}/advisory`
    case 'fractional_ai':
      return `/app/${orgSlug}/fractional-ai`
    case 'haiec':
      return null
    case 'rca_tool':
      return null
    case 'ai_article_generator':
      return null
    case 'kestrel':
      return null
    case 'six_stones_ai':
      return null
    case 'ai_advisor_desk':
      return `/app/${orgSlug}/advisor-desk`
    case 'ai_automation_blueprint':
      return `/app/${orgSlug}/blueprint`
    case 'managed_voice':
      return `/app/${orgSlug}/managed-voice`
    case 'ai_security_compliance':
      return `/app/${orgSlug}/security-review`
    case 'saas_security_review':
      return `/app/${orgSlug}/security-review`
    default:
      return null
  }
}

export function getOfferingStatus(offering: DashboardOffering): 'available' | 'no-role' | 'expired' | 'pending' | 'suspended' {
  if (offering.effectiveStatus === 'active' && offering.hasRole) return 'available'
  if (offering.effectiveStatus === 'active' && !offering.hasRole) return 'no-role'
  if (offering.effectiveStatus === 'expired') return 'expired'
  if (offering.effectiveStatus === 'pending') return 'pending'
  if (offering.effectiveStatus === 'suspended') return 'suspended'
  return 'suspended'
}
