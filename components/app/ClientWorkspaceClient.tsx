'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import {
  LogOut, ChevronRight, ChevronDown, Building2, Shield, Users, Settings,
  Briefcase, Wrench, ArrowRight, Calendar, User as UserIcon,
  AlertCircle, FileText, Clock, CheckCircle2, Loader2,
} from 'lucide-react'
import type { AuthenticatedUser, OrganizationContext } from '@/lib/auth/organization-resolver'
import {
  getOfferingLabel, getOfferingDescription, getOfferingKindLabel,
  getOfferingRoute, getOfferingStatus,
  getEngagementTypeLabel, getEngagementStatusLabel,
} from '@/lib/auth/dashboard-types'
import { NewsCardGrid } from './NewsCardGrid'
import { ExecutiveBriefs } from './ExecutiveBriefs'

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

  // Needs Attention + Current Work for org home
  const [orgAttention, setOrgAttention] = useState<any[]>([])
  const [orgWorkSummary, setOrgWorkSummary] = useState<{ active: number; needsInput: number; delivered: number } | null>(null)
  const [attentionLoading, setAttentionLoading] = useState(false)

  useEffect(() => {
    async function fetchOrgSummary() {
      setAttentionLoading(true)
      try {
        const res = await fetch(`/api/commercial/work-orders?orgSlug=${organization.slug}`)
        if (res.ok) {
          const data = await res.json()
          const wos = Array.isArray(data.workOrders) ? data.workOrders : []
          const needsInput = wos.filter((w: any) => w.status === 'needs_client_input')
          const awaitingApproval = wos.filter((w: any) => w.status === 'awaiting_approval' || w.status === 'ready_for_checkout')
          const active = wos.filter((w: any) => ['in_progress', 'in_review', 'paid', 'scoped'].includes(w.status))
          const delivered = wos.filter((w: any) => w.status === 'delivered')
          const items = [
            ...needsInput.map((w: any) => ({ type: 'input', title: `${w.work_order_number} needs your input`, link: `/app/${organization.slug}/work-orders/${w.id}`, status: w.status })),
            ...awaitingApproval.map((w: any) => ({ type: 'approval', title: `${w.work_order_number} ready for approval`, link: `/app/${organization.slug}/work-orders/${w.id}`, status: w.status })),
            ...delivered.map((w: any) => ({ type: 'delivered', title: `${w.work_order_number} delivered — review and complete`, link: `/app/${organization.slug}/work-orders/${w.id}`, status: w.status })),
          ]
          setOrgAttention(items)
          setOrgWorkSummary({ active: active.length, needsInput: needsInput.length, delivered: delivered.length })
        }
      } catch {
        // silent — org home should still render
      } finally {
        setAttentionLoading(false)
      }
    }
    fetchOrgSummary()
  }, [organization.slug])

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

  // Tools and services offered by this org
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
    return status === 'available'
  })

  const isSchoolOrg = organization.organization_kind === 'school'

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-30">
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
                className="flex items-center gap-1 text-sm font-medium truncate hover:bg-accent px-2 py-1 rounded-md"
              >
                <span className="truncate max-w-[120px] sm:max-w-[200px]">{organization.name}</span>
                {otherOrgs.length > 0 && (
                  <ChevronDown className={`h-3.5 w-3.5 flex-shrink-0 transition-transform ${orgSwitcherOpen ? 'rotate-180' : ''}`} />
                )}
              </button>
              {orgSwitcherOpen && otherOrgs.length > 0 && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-card border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                  <div className="p-1">
                    <div className="px-2 py-1.5 text-xs text-muted-foreground font-medium">
                      Switch Organization
                    </div>
                    {otherOrgs.map((org) => (
                      <Link
                        key={org.id}
                        href={`/app/${org.slug}`}
                        onClick={() => setOrgSwitcherOpen(false)}
                        className="flex items-center justify-between px-2 py-2 hover:bg-accent rounded-md text-sm"
                      >
                        <div className="min-w-0">
                          <div className="font-medium truncate">{org.name}</div>
                          <div className="text-xs text-muted-foreground">{org.role}</div>
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      </Link>
                    ))}
                    <div className="border-t mt-1 pt-1">
                      <Link
                        href="/app"
                        onClick={() => setOrgSwitcherOpen(false)}
                        className="flex items-center gap-2 px-2 py-2 hover:bg-accent rounded-md text-sm text-muted-foreground"
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
              className="p-1.5 hover:bg-accent rounded-md"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Sub-navigation */}
        <div className="px-4 flex items-center gap-1 text-sm border-t overflow-x-auto">
          <Link
            href={basePath}
            className={`px-3 py-2 hover:bg-accent whitespace-nowrap ${pathname === basePath ? 'bg-accent font-medium' : ''}`}
          >
            Overview
          </Link>

          {orgTools.map((offering) => (
            <Link
              key={offering.offering_key}
              href={offering.route || '#'}
              className={`px-3 py-2 hover:bg-accent whitespace-nowrap ${
                pathname.startsWith(`${basePath}/${offering.offering_key}`) ? 'bg-accent font-medium' : ''
              }`}
            >
              {getOfferingLabel(offering.offering_key)}
            </Link>
          ))}

          {isAdmin && (
            <>
              <Link
                href={`${basePath}/members`}
                className={`px-3 py-2 hover:bg-accent flex items-center gap-1 whitespace-nowrap ${
                  pathname === `${basePath}/members` ? 'bg-accent font-medium' : ''
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                Members
              </Link>
              <Link
                href={`${basePath}/settings`}
                className={`px-3 py-2 hover:bg-accent flex items-center gap-1 whitespace-nowrap ${
                  pathname === `${basePath}/settings` ? 'bg-accent font-medium' : ''
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
        {/* Org header */}
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

        {/* Needs Attention */}
        {orgAttention.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              Needs Your Attention
            </h2>
            <div className="space-y-2">
              {orgAttention.map((item, i) => (
                <Link key={i} href={item.link}
                  className="flex items-center gap-3 border rounded-lg p-3 hover:bg-accent/5 group">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground capitalize mt-0.5">{item.status.replace(/_/g, ' ')}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary flex-shrink-0" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Current Work Summary */}
        {orgWorkSummary && (orgWorkSummary.active > 0 || orgWorkSummary.needsInput > 0 || orgWorkSummary.delivered > 0) && (
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Current Work
            </h2>
            <div className="grid grid-cols-3 gap-3">
              <Link href={`${basePath}/work-orders`} className="border rounded-lg p-4 hover:bg-accent/5">
                <div className="text-2xl font-bold">{orgWorkSummary.active}</div>
                <div className="text-xs text-muted-foreground mt-1">Active Work Orders</div>
              </Link>
              <Link href={`${basePath}/work-orders`} className="border rounded-lg p-4 hover:bg-accent/5">
                <div className="text-2xl font-bold text-amber-600">{orgWorkSummary.needsInput}</div>
                <div className="text-xs text-muted-foreground mt-1">Needs Your Input</div>
              </Link>
              <Link href={`${basePath}/work-orders`} className="border rounded-lg p-4 hover:bg-accent/5">
                <div className="text-2xl font-bold text-green-600">{orgWorkSummary.delivered}</div>
                <div className="text-xs text-muted-foreground mt-1">Delivered</div>
              </Link>
            </div>
          </section>
        )}

        {/* Active engagement summary */}
        {activeEngagements.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Active Engagement
            </h2>
            <div className="border rounded-lg p-4 space-y-3">
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

        {/* Available tools and services */}
        {orgTools.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              {isSchoolOrg ? 'Applications' : 'Tools & Services'}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {orgTools.map((tool) => {
                const route = getOfferingRoute(organization.slug, tool.offering_key)
                const content = (
                  <div className="group border rounded-lg p-4 hover:border-primary/30 hover:bg-accent/30 transition-colors h-full">
                    <h3 className="font-medium text-sm">{getOfferingLabel(tool.offering_key)}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {getOfferingDescription(tool.offering_key)}
                    </p>
                    {route ? (
                      <span className="text-xs text-primary mt-2 inline-block group-hover:underline">
                        Open →
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground mt-2 inline-block">
                        {getOfferingKindLabel(tool.offering_key === 'kestrel' ? 'external_product' : '')}
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

        {/* Executive Briefs */}
        <ExecutiveBriefs />

        {/* AI Intelligence News Card Grid */}
        <NewsCardGrid initialLimit={12} />

        {/* Team */}
        {members.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team
            </h2>
            <div className="border rounded-lg divide-y">
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
                  <span className="text-xs bg-accent px-2 py-0.5 rounded">{m.role}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* No offerings state */}
        {orgTools.length === 0 && activeEngagements.length === 0 && (
          <section>
            <div className="border rounded-lg p-8 text-center">
              <Building2 className="h-10 w-10 text-primary mx-auto mb-3" />
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
