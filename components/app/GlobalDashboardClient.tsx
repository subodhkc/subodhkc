'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LogOut, ChevronRight, Building2, Shield, User as UserIcon,
  ArrowRight, MailOpen, Clock,
  LayoutDashboard, MessageSquare,
  Settings, Menu, X,
} from 'lucide-react'
import type { DashboardData, DashboardOrganization, DashboardOffering, DashboardWorkOrderAttention } from '@/lib/auth/dashboard-types'
import {
  getOfferingLabel, getOfferingRoute, getOfferingStatus,
  getEngagementTypeLabel, getEngagementStatusLabel,
} from '@/lib/auth/dashboard-types'

export function GlobalDashboardClient({ data }: { data: DashboardData }) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { user, organizations, engagements, invitations, joinRequests, isPlatformAdmin } = data

  const firstName = user.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'there'

  async function handleLogout() {
    await fetch('/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  // ---- Object-first Needs Attention ----
  // Render actual Work Order objects instead of aggregated counts.
  type AttentionItem =
    | { kind: 'work_order'; orgSlug: string; orgName: string; wo: DashboardWorkOrderAttention }
    | { kind: 'onboarding'; orgSlug: string; orgName: string; href: string }
    | { kind: 'answered_questions'; orgSlug: string; orgName: string; count: number }
    | { kind: 'invitations'; orgSlug: string; orgName: string; count: number }
    | { kind: 'join_requests'; count: number }

  const attentionItems: AttentionItem[] = []

  for (const org of organizations) {
    for (const wo of org.workOrderAttentionSummaries || []) {
      attentionItems.push({ kind: 'work_order', orgSlug: org.slug, orgName: org.name, wo })
    }
    for (const offering of org.offerings) {
      if (offering.offeringKey === 'ai_advisor_desk') {
        const status = getOfferingStatus(offering)
        if (status === 'available' && offering.onboardingComplete === false) {
          attentionItems.push({
            kind: 'onboarding',
            orgSlug: org.slug,
            orgName: org.name,
            href: `/app/${org.slug}/advisor-desk/onboarding`,
          })
        }
      }
    }
    const answeredCount = org.answeredAdvisorQuestionCount || 0
    if (answeredCount > 0) {
      attentionItems.push({ kind: 'answered_questions', orgSlug: org.slug, orgName: org.name, count: answeredCount })
    }
    if (org.pendingInvitations && org.pendingInvitations > 0) {
      attentionItems.push({ kind: 'invitations', orgSlug: org.slug, orgName: org.name, count: org.pendingInvitations })
    }
  }

  if (joinRequests && joinRequests.length > 0) {
    attentionItems.push({ kind: 'join_requests', count: joinRequests.length })
  }

  // ---- Continue Working: object-first, then service launchers ----
  type ContinueItem = { label: string; description: string; href: string; tag?: string }

  const continueItems: ContinueItem[] = []

  // 1. Work Orders needing input (object-first)
  for (const org of organizations) {
    for (const wo of org.workOrderAttentionSummaries || []) {
      if (wo.attentionReason === 'needs_input') {
        continueItems.push({
          label: `${wo.workOrderNumber} — ${wo.title}`,
          description: `${org.name} · ${wo.actionLabel}`,
          href: `/app/${org.slug}/work-orders/${wo.id}`,
          tag: 'Work Order',
        })
      }
    }
  }

  // 2. Answered advisor questions to review
  for (const org of organizations) {
    const answeredCount = org.answeredAdvisorQuestionCount || 0
    if (answeredCount > 0) {
      continueItems.push({
        label: `${answeredCount} answered advisor question${answeredCount > 1 ? 's' : ''}`,
        description: `${org.name} · review your advisor's response`,
        href: `/app/${org.slug}/advisor-desk`,
        tag: 'Advisor',
      })
    }
  }

  // 3. Incomplete onboarding
  for (const org of organizations) {
    for (const offering of org.offerings) {
      if (offering.offeringKey === 'ai_advisor_desk') {
        const status = getOfferingStatus(offering)
        if (status === 'available' && offering.onboardingComplete === false) {
          continueItems.push({
            label: 'Complete Advisor Desk onboarding',
            description: `${org.name} · set up your advisor relationship`,
            href: `/app/${org.slug}/advisor-desk/onboarding`,
            tag: 'Onboarding',
          })
        }
      }
    }
  }

  // 4. Active offering workspaces (service launchers, demoted after objects)
  for (const org of organizations) {
    for (const offering of org.offerings) {
      const status = getOfferingStatus(offering)
      if (status === 'available') {
        const route = getOfferingRoute(org.slug, offering.offeringKey)
        if (route && offering.offeringKey !== 'ai_automation_blueprint') {
          continueItems.push({
            label: getOfferingLabel(offering.offeringKey),
            description: org.name,
            href: route,
          })
        }
      }
    }
  }

  // Find the org with an active Advisor Desk entitlement for sidebar/header links
  const advisorDeskOrg = organizations.find(org =>
    org.offerings.some(o =>
      o.offeringKey === 'ai_advisor_desk' &&
      o.effectiveStatus === 'active' &&
      o.hasRole
    )
  ) ?? null
  const advisorDeskHref = advisorDeskOrg
    ? `/app/${advisorDeskOrg.slug}/advisor-desk`
    : '/ai-advisor'

  // Active engagements
  const activeEngagements = engagements.filter(e => e.status === 'active')

  // Greeting based on time
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  // Sidebar navigation items
  const navSections = [
    {
      label: 'Workspace',
      items: [
        { label: 'Dashboard', href: '/app', icon: LayoutDashboard, active: true },
        { label: 'Advisor Desk', href: advisorDeskHref, icon: MessageSquare },
        { label: 'Account', href: '/app/account', icon: Settings },
      ],
    },
    {
      label: 'Organizations',
      items: organizations.map((org) => ({
        label: org.name,
        href: `/app/${org.slug}`,
        icon: Building2,
      })),
    },
    ...(isPlatformAdmin ? [{
      label: 'Administration',
      items: [
        { label: 'Admin Console', href: '/app/admin', icon: Shield },
      ],
    }] : []),
  ]

  const hasOrgs = organizations.length > 0
  const hasAttention = attentionItems.length > 0
  const hasContinue = continueItems.length > 0
  const hasEngagements = activeEngagements.length > 0
  const showEmptyState = !hasOrgs && !isPlatformAdmin

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 border-r border-border bg-card z-50
        transform transition-transform duration-200 ease-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:z-30
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-5 h-16 border-b border-border">
            <Link href="/app" className="font-bold text-lg tracking-tight" onClick={() => setSidebarOpen(false)}>
              SubodhKC
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 hover:bg-accent/10 rounded-lg"
              aria-label="Close navigation"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Admin badge */}
          {isPlatformAdmin && (
            <div className="mx-3 mt-3 mb-1">
              <div className="rounded-lg px-3 py-2 flex items-center gap-2 border border-accent/30 bg-accent/5">
                <Shield className="h-3.5 w-3.5 text-accent" />
                <span className="text-xs font-medium text-accent">Platform Admin</span>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4" aria-label="Main navigation">
            {navSections.map((section, si) => (
              <div key={si}>
                <p className="text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider px-3 mb-1.5">
                  {section.label}
                </p>
                <div className="space-y-0.5">
                  {section.items.map((item, ii) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={ii}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`
                          flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm
                          transition-colors
                          ${item.active
                            ? 'bg-accent/10 text-accent font-medium'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/5'
                          }
                        `}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* User card at bottom */}
          <div className="border-t border-border p-3">
            <div className="rounded-xl p-3 border border-border">
              <div className="flex items-center gap-2.5">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="h-8 w-8 rounded-full" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-accent" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.displayName || firstName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="mt-2.5 w-full flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="lg:ml-64">
        {/* Top bar — compact on mobile */}
        <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-accent/10 rounded-lg flex-shrink-0"
                aria-label="Open navigation"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-base sm:text-lg font-bold tracking-tight truncate">
                <span className="hidden sm:inline">{greeting}, </span>{firstName}
              </h1>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {isPlatformAdmin && (
                <Link
                  href="/app/admin"
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-accent flex items-center gap-1.5 border border-accent/30 hover:bg-accent/5 transition-colors"
                >
                  <Shield className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              )}
              <Link
                href={advisorDeskHref}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-accent flex items-center gap-1.5 border border-accent/30 hover:bg-accent/5 transition-colors"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Advisor Desk</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="px-4 sm:px-6 py-6 sm:py-8 space-y-8 max-w-5xl">
          {/* Compact status line — replaces large welcome banner */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm text-muted-foreground">
              {organizations.length > 0
                ? `${organizations.length} organization${organizations.length > 1 ? 's' : ''} · ${activeEngagements.length} active engagement${activeEngagements.length !== 1 ? 's' : ''}`
                : isPlatformAdmin
                  ? 'Platform admin access · No organization memberships'
                  : 'Awaiting organization access'
              }
            </p>
          </div>

          {/* 1. Needs Attention — object-first */}
          {hasAttention && (
            <section aria-labelledby="attention-heading">
              <h3 id="attention-heading" className="text-base font-semibold mb-3">
                Needs Attention
              </h3>
              <div className="border border-border rounded-xl divide-y divide-border">
                {attentionItems.map((item, idx) => (
                  <AttentionRow key={idx} item={item} />
                ))}
              </div>
            </section>
          )}

          {/* 2. Continue Working — object-first, then service launchers */}
          {hasContinue && (
            <section aria-labelledby="continue-heading">
              <h3 id="continue-heading" className="text-base font-semibold mb-3">
                Continue Working
              </h3>
              <div className="border border-border rounded-xl divide-y divide-border">
                {continueItems.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="flex items-start justify-between gap-3 p-4 hover:bg-accent/5 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {item.tag && (
                          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70 border border-border rounded px-1.5 py-0.5">
                            {item.tag}
                          </span>
                        )}
                        <h4 className="font-medium text-sm truncate">{item.label}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent flex-shrink-0 mt-0.5" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* 3. Organizations / Workspaces */}
          {hasOrgs && (
            <section aria-labelledby="orgs-heading">
              <h3 id="orgs-heading" className="text-base font-semibold mb-3">
                Organizations
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {organizations.map((org) => (
                  <OrganizationCard key={org.id} org={org} />
                ))}
              </div>
            </section>
          )}

          {/* 4. Active engagements (My Work) — demoted below organizations */}
          {hasEngagements && (
            <section aria-labelledby="work-heading">
              <h3 id="work-heading" className="text-base font-semibold mb-3">
                Active Engagements
              </h3>
              <div className="border border-border rounded-xl divide-y divide-border">
                {activeEngagements.map((eng) => (
                  <Link
                    key={eng.id}
                    href={`/app/${eng.organizationSlug}`}
                    className="flex items-start justify-between gap-3 p-4 hover:bg-accent/5 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm">{getEngagementTypeLabel(eng.engagementType)}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{eng.organizationName}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                          {getEngagementStatusLabel(eng.status)}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent flex-shrink-0 mt-0.5" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* 5. Pending invitations */}
          {invitations.length > 0 && (
            <section aria-labelledby="invitations-heading">
              <h3 id="invitations-heading" className="text-base font-semibold mb-3">
                Invitations
              </h3>
              <div className="border border-border rounded-xl divide-y divide-border">
                {invitations.map((inv) => (
                  <div key={inv.id} className="p-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="font-medium text-sm truncate">{inv.organizationName}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Invited as {inv.role} · Expires {new Date(inv.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Link
                      href={`/auth/accept-invitation?token=${inv.id}`}
                      className="text-sm text-accent hover:underline px-3 py-1.5 rounded-lg border border-accent/30 hover:bg-accent/5 transition-colors flex-shrink-0"
                    >
                      Accept
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 6. Pending join requests */}
          {joinRequests.length > 0 && (
            <section aria-labelledby="requests-heading">
              <h3 id="requests-heading" className="text-base font-semibold mb-3">
                Access Requests
              </h3>
              <div className="border border-border rounded-xl divide-y divide-border">
                {joinRequests.map((jr) => (
                  <div key={jr.id} className="p-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="font-medium text-sm truncate">{jr.organizationName}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Requested {new Date(jr.createdAt).toLocaleDateString()} · {jr.status}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 flex-shrink-0">
                      Pending
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* No organizations — operational empty state (no marketing CTAs) */}
          {showEmptyState && !hasAttention && (
            <section>
              <div className="border border-border rounded-xl p-8 text-center">
                <h3 className="text-lg font-semibold">Your account is ready</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Once you&apos;re invited to an organization or granted access to a service,
                  your workspaces will appear here.
                </p>
              </div>
            </section>
          )}

          {/* Platform admin section */}
          {isPlatformAdmin && (
            <section aria-labelledby="admin-heading">
              <h3 id="admin-heading" className="text-base font-semibold mb-3">
                Platform Administration
              </h3>
              <Link
                href="/app/admin"
                className="block border border-border rounded-xl p-4 hover:bg-accent/5 transition-colors group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h4 className="font-medium text-sm">Admin Console</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Manage organizations, users, and entitlements</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent flex-shrink-0" />
                </div>
              </Link>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

function AttentionRow({ item }: { item: any }) {
  if (item.kind === 'work_order') {
    const wo = item.wo as DashboardWorkOrderAttention
    const href = `/app/${item.orgSlug}/work-orders/${wo.id}`
    const urgencyDot = wo.attentionReason === 'needs_input' || wo.attentionReason === 'scope_ready'
      ? 'bg-orange-500'
      : 'bg-amber-500'
    return (
      <Link
        href={href}
        className="flex items-start justify-between gap-3 p-4 hover:bg-accent/5 transition-colors group"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${urgencyDot} flex-shrink-0`} aria-hidden="true" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70">
              {wo.workOrderNumber}
            </span>
            <h4 className="font-medium text-sm truncate">{wo.title}</h4>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 ml-4">
            {item.orgName} · {wo.actionLabel}
          </p>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent flex-shrink-0 mt-0.5" />
      </Link>
    )
  }

  if (item.kind === 'onboarding') {
    return (
      <Link
        href={item.href}
        className="flex items-start justify-between gap-3 p-4 hover:bg-accent/5 transition-colors group"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" aria-hidden="true" />
            <h4 className="font-medium text-sm">Complete Advisor Desk onboarding</h4>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 ml-4">{item.orgName} · set up your advisor relationship</p>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent flex-shrink-0 mt-0.5" />
      </Link>
    )
  }

  if (item.kind === 'answered_questions') {
    return (
      <Link
        href={`/app/${item.orgSlug}/advisor-desk`}
        className="flex items-start justify-between gap-3 p-4 hover:bg-accent/5 transition-colors group"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" aria-hidden="true" />
            <h4 className="font-medium text-sm">
              {item.count} answered advisor question{item.count > 1 ? 's' : ''}
            </h4>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 ml-4">{item.orgName} · review your advisor&apos;s response</p>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent flex-shrink-0 mt-0.5" />
      </Link>
    )
  }

  if (item.kind === 'invitations') {
    return (
      <Link
        href={`/app/${item.orgSlug}/members`}
        className="flex items-start justify-between gap-3 p-4 hover:bg-accent/5 transition-colors group"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" aria-hidden="true" />
            <h4 className="font-medium text-sm">
              {item.count} pending invitation{item.count > 1 ? 's' : ''}
            </h4>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 ml-4">{item.orgName} · accept or decline team invitations</p>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent flex-shrink-0 mt-0.5" />
      </Link>
    )
  }

  // join_requests
  return (
    <Link
      href="/app/account"
      className="flex items-start justify-between gap-3 p-4 hover:bg-accent/5 transition-colors group"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" aria-hidden="true" />
          <h4 className="font-medium text-sm">
            {item.count} join request{item.count > 1 ? 's' : ''} pending
          </h4>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 ml-4">Organizations waiting for your membership</p>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent flex-shrink-0 mt-0.5" />
    </Link>
  )
}

function OrganizationCard({ org }: { org: DashboardOrganization }) {
  const activeOfferings = org.offerings.filter(o => getOfferingStatus(o) === 'available')
  const isDemoOrg = org.slug === 'wilshire-demo'
  const attentionCount = (org.workOrderAttentionSummaries || []).length

  return (
    <Link
      href={`/app/${org.slug}`}
      className="block border border-border rounded-xl p-4 hover:bg-accent/5 transition-colors group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-medium text-sm truncate">{org.name}</h4>
            {isDemoOrg && (
              <span className="text-xs px-1.5 py-0.5 rounded-full text-amber-600 font-medium bg-amber-500/10">
                Synthetic Data
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {org.organizationKind} · {org.role}
          </p>
          {attentionCount > 0 && (
            <p className="text-xs text-orange-600 mt-1.5 font-medium">
              {attentionCount} item{attentionCount > 1 ? 's' : ''} need attention
            </p>
          )}
          {activeOfferings.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {activeOfferings.slice(0, 3).map((o) => (
                <span key={o.offeringKey} className="text-xs px-1.5 py-0.5 rounded bg-accent/10 text-accent">
                  {getOfferingLabel(o.offeringKey)}
                </span>
              ))}
              {activeOfferings.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{activeOfferings.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent flex-shrink-0 mt-0.5" />
      </div>
    </Link>
  )
}
