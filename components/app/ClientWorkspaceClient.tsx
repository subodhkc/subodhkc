'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import {
  LogOut, ChevronRight, ChevronDown, Building2, Shield, Users, Settings,
  Briefcase, ArrowRight, Calendar, User as UserIcon,
  AlertCircle, FileText,
} from 'lucide-react'
import type { AuthenticatedUser, OrganizationContext } from '@/lib/auth/organization-resolver'
import {
  getOfferingLabel, getOfferingRoute, getOfferingStatus,
  getEngagementTypeLabel, getEngagementStatusLabel,
} from '@/lib/auth/dashboard-types'

interface OrgEngagement {
  id: string
  engagement_type: string
  status: string
  starts_at: string | null
  ends_at: string | null
}

interface OrgMember {
  id: string
  user_id: string
  email: string
  display_name: string | null
  avatar_url: string | null
  role: string
  status: string
}

interface UserOrgSummary {
  id: string
  name: string
  slug: string
  organization_kind: string
  status: string
  role: string
}

interface OrgWorkOrder {
  id: string
  work_order_number: string
  title: string
  work_type: string
  status: string
  status_label: string
  action_label: string
  updated_at: string
}

interface ClientWorkspaceClientProps {
  user: AuthenticatedUser
  ctx: OrganizationContext
  engagements: OrgEngagement[]
  members: OrgMember[]
  userOrganizations?: UserOrgSummary[]
}

export function ClientWorkspaceClient({ user, ctx, engagements, members, userOrganizations = [] }: ClientWorkspaceClientProps) {
  const pathname = usePathname()
  const [orgSwitcherOpen, setOrgSwitcherOpen] = useState(false)
  const switcherRef = useRef<HTMLDivElement>(null)
  const { organization, organizationRole, isPlatformAdmin, entitlements, offeringRoles } = ctx

  // Close switcher when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setOrgSwitcherOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const otherOrgs = userOrganizations.filter(o => o.slug !== organization.slug)

  const isAdmin = organizationRole === 'owner' || organizationRole === 'admin' || isPlatformAdmin
  const basePath = `/app/${organization.slug}`

  const activeEngagements = engagements.filter(e => e.status === 'active')

  // Fetch Work Orders for this org (object-first rendering)
  const [orgWorkOrders, setOrgWorkOrders] = useState<OrgWorkOrder[]>([])
  const [attentionLoading, setAttentionLoading] = useState(false)
  const [workOrdersError, setWorkOrdersError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrgWorkOrders() {
      setAttentionLoading(true)
      setWorkOrdersError(null)
      try {
        const res = await fetch(`/api/commercial/work-orders?orgSlug=${organization.slug}`)
        if (res.ok) {
          const data = await res.json()
          const wos = Array.isArray(data.workOrders) ? data.workOrders : []
          setOrgWorkOrders(wos.map((w: any) => ({
            id: w.id,
            work_order_number: w.work_order_number,
            title: w.title,
            work_type: w.work_type,
            status: w.status,
            status_label: w.status_label || w.status,
            action_label: w.action_label || w.status_label || w.status,
            updated_at: w.updated_at,
          })))
        } else {
          setWorkOrdersError('Unable to load Work Orders.')
        }
      } catch {
        setWorkOrdersError('Network error loading Work Orders.')
      } finally {
        setAttentionLoading(false)
      }
    }
    fetchOrgWorkOrders()
  }, [organization.slug])

  const needsInput = orgWorkOrders.filter(w => w.status === 'needs_client_input')
  const awaitingApproval = orgWorkOrders.filter(w => w.status === 'awaiting_approval' || w.status === 'ready_for_checkout')
  const activeWork = orgWorkOrders.filter(w => ['in_progress', 'in_review', 'paid', 'scoped'].includes(w.status))
  const deliveredWork = orgWorkOrders.filter(w => w.status === 'delivered' || w.status === 'completed')

  // Available offerings with routes
  const availableOfferings = entitlements
    .filter(e => e.effective_status === 'active')
    .map(e => {
      const role = offeringRoles.find(r => r.offering_key === e.offering_key)
      return {
        ...e,
        hasRole: !!role,
        userRole: role?.role ?? null,
        route: getOfferingRoute(organization.slug, e.offering_key),
      }
    })

  // Active relationships: Advisor Desk and Fractional
  const relationshipOfferings = availableOfferings.filter(o =>
    o.offering_key === 'ai_advisor_desk' ||
    o.offering_key === 'advisory' ||
    o.offering_key === 'fractional_ai_advisor' ||
    o.offering_key === 'fractional_ai'
  )

  // Other tools and services
  const orgTools = availableOfferings.filter(o => {
    const status = getOfferingStatus({
      offeringKey: o.offering_key,
      offeringName: o.offering_name,
      offeringKind: '',
      entitlementStatus: o.status,
      effectiveStatus: o.effective_status,
      hasRole: o.hasRole,
      userRole: o.userRole,
    })
    return status === 'available' &&
      o.offering_key !== 'ai_advisor_desk' &&
      o.offering_key !== 'advisory' &&
      o.offering_key !== 'fractional_ai_advisor' &&
      o.offering_key !== 'fractional_ai'
  })

  const isSchoolOrg = organization.organization_kind === 'school'

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2 min-w-0">
            <Link href="/app" className="font-semibold text-sm flex-shrink-0">
              SubodhKC
            </Link>
            <span className="text-muted-foreground text-sm">/</span>
            {/* Org switcher */}
            <div className="relative" ref={switcherRef}>
              <button
                onClick={() => otherOrgs.length > 0 && setOrgSwitcherOpen(!orgSwitcherOpen)}
                className="flex items-center gap-1 text-sm font-medium truncate hover:bg-accent/10 px-2 py-1 rounded-md"
                aria-expanded={orgSwitcherOpen}
                aria-label="Switch organization"
              >
                <span className="truncate max-w-[120px] sm:max-w-[200px]">{organization.name}</span>
                {otherOrgs.length > 0 && (
                  <ChevronDown className={`h-3.5 w-3.5 flex-shrink-0 transition-transform ${orgSwitcherOpen ? 'rotate-180' : ''}`} />
                )}
              </button>
              {orgSwitcherOpen && otherOrgs.length > 0 && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-card border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                  <div className="p-1">
                    <div className="px-2 py-1.5 text-xs text-muted-foreground font-medium">
                      Switch Organization
                    </div>
                    {otherOrgs.map((org) => (
                      <Link
                        key={org.id}
                        href={`/app/${org.slug}`}
                        onClick={() => setOrgSwitcherOpen(false)}
                        className="flex items-center justify-between px-2 py-2 hover:bg-accent/10 rounded-md text-sm"
                      >
                        <div className="min-w-0">
                          <div className="font-medium truncate">{org.name}</div>
                          <div className="text-xs text-muted-foreground">{org.role}</div>
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      </Link>
                    ))}
                    <div className="border-t border-border mt-1 pt-1">
                      <Link
                        href="/app"
                        onClick={() => setOrgSwitcherOpen(false)}
                        className="flex items-center gap-2 px-2 py-2 hover:bg-accent/10 rounded-md text-sm text-muted-foreground"
                      >
                        <Building2 className="h-3.5 w-3.5" />
                        All Organizations
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            {isPlatformAdmin && (
              <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">Admin</span>
            )}
            <button
              onClick={async () => {
                await fetch('/auth/logout', { method: 'POST' })
                window.location.href = '/login'
              }}
              className="p-1.5 hover:bg-accent/10 rounded-md"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Sub-navigation */}
        <div className="px-4 flex items-center gap-1 text-sm border-t border-border overflow-x-auto">
          <Link
            href={basePath}
            className={`px-3 py-2 hover:bg-accent/10 whitespace-nowrap ${pathname === basePath ? 'bg-accent/10 font-medium' : ''}`}
          >
            Overview
          </Link>

          {availableOfferings.map((offering) => (
            <Link
              key={offering.offering_key}
              href={offering.route || '#'}
              className={`px-3 py-2 hover:bg-accent/10 whitespace-nowrap ${
                pathname.startsWith(`${basePath}/${offering.offering_key}`) ? 'bg-accent/10 font-medium' : ''
              }`}
            >
              {getOfferingLabel(offering.offering_key)}
            </Link>
          ))}

          {isAdmin && (
            <>
              <Link
                href={`${basePath}/members`}
                className={`px-3 py-2 hover:bg-accent/10 flex items-center gap-1 whitespace-nowrap ${
                  pathname === `${basePath}/members` ? 'bg-accent/10 font-medium' : ''
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                Members
              </Link>
              <Link
                href={`${basePath}/settings`}
                className={`px-3 py-2 hover:bg-accent/10 flex items-center gap-1 whitespace-nowrap ${
                  pathname === `${basePath}/settings` ? 'bg-accent/10 font-medium' : ''
                }`}
              >
                <Settings className="h-3.5 w-3.5" />
                Settings
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-8">
        {/* 1. Org header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{organization.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {organization.organization_kind === 'school' ? 'School' :
             organization.organization_kind === 'business' ? 'Organization' :
             organization.organization_kind === 'nonprofit' ? 'Nonprofit' :
             'Organization'}
            {' · '}
            {organizationRole || 'Admin (platform)'}
          </p>
        </div>

        {/* 2. Needs Your Attention — object-first */}
        {(needsInput.length > 0 || awaitingApproval.length > 0 || deliveredWork.length > 0) && (
          <section aria-labelledby="attention-heading">
            <h2 id="attention-heading" className="text-lg font-semibold mb-3">
              Needs Your Attention
            </h2>
            <div className="border border-border rounded-xl divide-y divide-border">
              {needsInput.map(wo => (
                <Link key={wo.id} href={`${basePath}/work-orders/${wo.id}`}
                  className="flex items-center gap-3 p-4 hover:bg-accent/5 transition-colors group">
                  <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70">{wo.work_order_number}</span>
                      <p className="text-sm font-medium truncate">{wo.title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{wo.action_label}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary flex-shrink-0" />
                </Link>
              ))}
              {awaitingApproval.map(wo => (
                <Link key={wo.id} href={`${basePath}/work-orders/${wo.id}`}
                  className="flex items-center gap-3 p-4 hover:bg-accent/5 transition-colors group">
                  <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70">{wo.work_order_number}</span>
                      <p className="text-sm font-medium truncate">{wo.title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{wo.action_label}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary flex-shrink-0" />
                </Link>
              ))}
              {deliveredWork.map(wo => (
                <Link key={wo.id} href={`${basePath}/work-orders/${wo.id}`}
                  className="flex items-center gap-3 p-4 hover:bg-accent/5 transition-colors group">
                  <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70">{wo.work_order_number}</span>
                      <p className="text-sm font-medium truncate">{wo.title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{wo.action_label}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary flex-shrink-0" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 3. Active Relationships — Advisor Desk, Fractional */}
        {relationshipOfferings.length > 0 && (
          <section aria-labelledby="relationships-heading">
            <h2 id="relationships-heading" className="text-lg font-semibold mb-3">
              Active Relationships
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {relationshipOfferings.map((offering) => {
                const route = getOfferingRoute(organization.slug, offering.offering_key)
                if (!route) return null
                return (
                  <Link
                    key={offering.offering_key}
                    href={route}
                    className="block border border-border rounded-xl p-4 hover:bg-accent/5 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm">{getOfferingLabel(offering.offering_key)}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Open workspace</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-0.5" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* 4. Current Work — actual Work Order objects */}
        {activeWork.length > 0 && (
          <section aria-labelledby="work-heading">
            <h2 id="work-heading" className="text-lg font-semibold mb-3">
              Current Work
            </h2>
            <div className="border border-border rounded-xl divide-y divide-border">
              {activeWork.map(wo => (
                <Link
                  key={wo.id}
                  href={`${basePath}/work-orders/${wo.id}`}
                  className="flex items-start justify-between gap-3 p-4 hover:bg-accent/5 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70">{wo.work_order_number}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-500/10 text-blue-600">
                        {wo.status_label}
                      </span>
                    </div>
                    <p className="text-sm font-medium truncate mt-1">{wo.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{wo.action_label}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-0.5" />
                </Link>
              ))}
            </div>
            <Link href={`${basePath}/work-orders`} className="block text-sm text-primary hover:underline pt-2">
              View all Work Orders
            </Link>
          </section>
        )}

        {/* Loading and error states for Work Orders */}
        {attentionLoading && orgWorkOrders.length === 0 && (
          <section>
            <div className="border border-border rounded-xl p-4">
              <p className="text-sm text-muted-foreground">Loading Work Orders...</p>
            </div>
          </section>
        )}
        {workOrdersError && (
          <section>
            <div className="border border-border rounded-xl p-4">
              <p className="text-sm text-red-600">{workOrdersError}</p>
            </div>
          </section>
        )}

        {/* 5. Active engagement summary */}
        {activeEngagements.length > 0 && (
          <section aria-labelledby="engagement-heading">
            <h2 id="engagement-heading" className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              Active Engagement
            </h2>
            <div className="border border-border rounded-lg p-4 space-y-3">
              {activeEngagements.map((eng) => (
                <div key={eng.id} className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-sm">
                      {getEngagementTypeLabel(eng.engagement_type)}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs bg-green-500/10 text-green-700 px-2 py-0.5 rounded">
                        {getEngagementStatusLabel(eng.status)}
                      </span>
                      {eng.starts_at && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Started {new Date(eng.starts_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. Included systems / Tools & Services — demoted */}
        {orgTools.length > 0 && (
          <section aria-labelledby="tools-heading">
            <h2 id="tools-heading" className="text-lg font-semibold mb-3">
              {isSchoolOrg ? 'Applications' : 'Tools & Services'}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {orgTools.map((tool) => {
                const route = getOfferingRoute(organization.slug, tool.offering_key)
                const content = (
                  <div className="group border border-border rounded-lg p-4 hover:bg-accent/5 transition-colors h-full">
                    <h3 className="font-medium text-sm">{getOfferingLabel(tool.offering_key)}</h3>
                    {route ? (
                      <span className="text-xs text-primary mt-2 inline-block group-hover:underline">
                        Open →
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground mt-2 inline-block">
                        External platform
                      </span>
                    )}
                  </div>
                )
                return route ? (
                  <Link key={tool.offering_key} href={route}>{content}</Link>
                ) : (
                  <div key={tool.offering_key}>{content}</div>
                )
              })}
            </div>
          </section>
        )}

        {/* 7. Team */}
        {members.length > 0 && (
          <section aria-labelledby="team-heading">
            <h2 id="team-heading" className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              Team
            </h2>
            <div className="border border-border rounded-lg divide-y divide-border">
              {members.map((m) => (
                <div key={m.id} className="flex items-center gap-3 p-3">
                  {m.avatar_url ? (
                    <img src={m.avatar_url} alt="" className="h-8 w-8 rounded-full" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserIcon className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {m.display_name || m.email}
                    </p>
                    {m.display_name && (
                      <p className="text-xs text-muted-foreground truncate">{m.email}</p>
                    )}
                  </div>
                  <span className="text-xs bg-accent/10 px-2 py-0.5 rounded">{m.role}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* No offerings state */}
        {orgTools.length === 0 && relationshipOfferings.length === 0 && activeEngagements.length === 0 && orgWorkOrders.length === 0 && !attentionLoading && (
          <section>
            <div className="border border-border rounded-lg p-8 text-center">
              <Building2 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h2 className="text-lg font-semibold">{organization.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                You have access to this organization. Available tools and services will appear here.
              </p>
            </div>
          </section>
        )}

        {/* Back link */}
        <div className="pt-4">
          <Link href="/app" className="text-sm text-primary hover:underline">
            ← Back to My SubodhKC
          </Link>
        </div>
      </main>
    </div>
  )
}
