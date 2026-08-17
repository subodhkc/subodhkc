'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LogOut, ChevronRight, Building2, Shield, User as UserIcon,
  Briefcase, Wrench, ArrowRight, MailOpen, Clock, CheckCircle2,
  AlertCircle, Calendar, LayoutDashboard, MessageSquare,
  Settings, Menu, X, Sparkles, TrendingUp, FileText, Phone,
} from 'lucide-react'
import type { DashboardData, DashboardOrganization, DashboardOffering } from '@/lib/auth/dashboard-types'
import {
  getOfferingLabel, getOfferingDescription, getOfferingKindLabel,
  getOfferingRoute, getOfferingStatus,
  getEngagementTypeLabel, getEngagementStatusLabel,
} from '@/lib/auth/dashboard-types'

export function GlobalDashboardClient({ data }: { data: DashboardData }) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { user, organizations, engagements, invitations, joinRequests, isPlatformAdmin } = data

  const firstName = user.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'there'

  async function handleLogout() {
    await fetch('/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  // Build "Continue Working" section from accessible offerings
  const continueItems: Array<{ label: string; description: string; href: string; badge?: string }> = []

  for (const org of organizations) {
    for (const offering of org.offerings) {
      const status = getOfferingStatus(offering)
      if (status === 'available') {
        const route = getOfferingRoute(org.slug, offering.offeringKey)
        if (route) {
          continueItems.push({
            label: `${getOfferingLabel(offering.offeringKey)}`,
            description: `${org.name}`,
            href: route,
            badge: org.name,
          })
        }
      }
    }
  }

  // Build "Needs Attention" section — action-first items requiring user action
  const needsAttentionItems: Array<{ label: string; description: string; href: string; urgency: 'high' | 'medium' | 'low' }> = []

  for (const org of organizations) {
    // Pending invitations
    if (org.pendingInvitations && org.pendingInvitations > 0) {
      needsAttentionItems.push({
        label: `${org.pendingInvitations} pending invitation${org.pendingInvitations > 1 ? 's' : ''}`,
        description: `${org.name} — accept or decline team invitations`,
        href: `/app/${org.slug}/members`,
        urgency: 'medium',
      })
    }

    // Check for Advisor Desk offerings needing onboarding
    for (const offering of org.offerings) {
      if (offering.offeringKey === 'ai_advisor_desk') {
        const status = getOfferingStatus(offering)
        if (status === 'available' && offering.onboardingComplete === false) {
          needsAttentionItems.push({
            label: 'Complete Advisor Desk onboarding',
            description: `${org.name} — set up your advisor relationship`,
            href: `/app/${org.slug}/advisor-desk/onboarding`,
            urgency: 'medium',
          })
        }
      }
    }

    // Check for Work Orders needing input (deep-link to first WO)
    const needingInputIds = org.workOrdersNeedingInputIds || []
    if (needingInputIds.length > 0) {
      needsAttentionItems.push({
        label: `${needingInputIds.length} Work Order${needingInputIds.length > 1 ? 's' : ''} need your input`,
        description: `${org.name} — respond to advisor requests`,
        href: `/app/${org.slug}/work-orders/${needingInputIds[0]}`,
        urgency: 'high',
      })
    }

    // Check for Work Orders with scope ready for approval (deep-link to first WO)
    const scopeReadyIds = org.workOrdersScopeReadyIds || []
    if (scopeReadyIds.length > 0) {
      needsAttentionItems.push({
        label: `${scopeReadyIds.length} Work Order${scopeReadyIds.length > 1 ? 's' : ''} scope ready for review`,
        description: `${org.name} — review and approve your scope`,
        href: `/app/${org.slug}/work-orders/${scopeReadyIds[0]}`,
        urgency: 'high',
      })
    }

    // Check for Work Orders awaiting owner approval (deep-link to first WO)
    const ownerApprovalIds = org.workOrdersOwnerApprovalIds || []
    if (ownerApprovalIds.length > 0) {
      needsAttentionItems.push({
        label: `${ownerApprovalIds.length} Work Order${ownerApprovalIds.length > 1 ? 's' : ''} awaiting approval`,
        description: `${org.name} — organization approval needed`,
        href: `/app/${org.slug}/work-orders/${ownerApprovalIds[0]}`,
        urgency: 'medium',
      })
    }

    // Check for answered advisor questions (no specific question URL — link to advisor desk)
    const answeredCount = org.answeredAdvisorQuestionCount || 0
    if (answeredCount > 0) {
      needsAttentionItems.push({
        label: `${answeredCount} answered advisor question${answeredCount > 1 ? 's' : ''}`,
        description: `${org.name} — review your advisor's response`,
        href: `/app/${org.slug}/advisor-desk`,
        urgency: 'low',
      })
    }
  }

  // Pending join requests
  if (joinRequests && joinRequests.length > 0) {
    needsAttentionItems.push({
      label: `${joinRequests.length} join request${joinRequests.length > 1 ? 's' : ''} pending`,
      description: 'Organizations waiting for your membership',
      href: '/app/account',
      urgency: 'low',
    })
  }

  // Build "Tools & Applications" section
  const toolItems: Array<{ label: string; description: string; href: string | null; status: string }> = []
  const seenOfferings = new Set<string>()

  for (const org of organizations) {
    for (const offering of org.offerings) {
      const status = getOfferingStatus(offering)
      if (status === 'available' || status === 'no-role') {
        if (!seenOfferings.has(offering.offeringKey)) {
          seenOfferings.add(offering.offeringKey)
          const route = getOfferingRoute(org.slug, offering.offeringKey)
          let statusLabel = 'Open'
          if (offering.offeringKind === 'external_product') statusLabel = 'External Platform'
          if (!route && offering.offeringKind !== 'external_product') statusLabel = 'Coming to portal'

          toolItems.push({
            label: getOfferingLabel(offering.offeringKey),
            description: getOfferingDescription(offering.offeringKey),
            href: route,
            status: statusLabel,
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
    {
      label: 'Resources',
      items: [
        { label: 'Services', href: '/services', icon: Briefcase },
        { label: 'AI Advisor Desk', href: '/ai-advisor', icon: Sparkles },
        { label: 'AI Work Order', href: '/ai-automation', icon: Wrench },
        { label: 'AI Voice Agent', href: '/ai-voice-agent', icon: Phone },
        { label: 'AI Security Review', href: '/ai-security-compliance', icon: Shield },
        { label: 'SaaS Security Review', href: '/saas-security-review', icon: Shield },
      ],
    },
  ]

  return (
    <div className="min-h-screen glass-gradient-bg">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 glass-sidebar z-50
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:z-30
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-5 h-16 border-b border-border/20">
            <Link href="/app" className="font-bold text-lg tracking-tight">
              SubodhKC
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 hover:bg-accent/20 rounded-lg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Admin badge */}
          {isPlatformAdmin && (
            <div className="mx-3 mt-3 mb-1">
              <div className="glass-badge rounded-lg px-3 py-2 flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-accent" />
                <span className="text-xs font-medium text-accent">Platform Admin</span>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
            {navSections.map((section, si) => (
              <div key={si}>
                <p className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider px-3 mb-1.5">
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
                          transition-all duration-200
                          ${item.active
                            ? 'glass-badge text-accent font-medium'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
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
          <div className="border-t border-border/20 p-3">
            <div className="glass rounded-xl p-3">
              <div className="flex items-center gap-2.5">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="h-8 w-8 rounded-full" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-accent/15 flex items-center justify-center">
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
                className="mt-2.5 w-full flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
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
        {/* Top bar */}
        <header className="glass sticky top-0 z-20 border-b border-border/20">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-accent/10 rounded-lg"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-lg font-bold tracking-tight">
                {greeting}, {firstName}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {isPlatformAdmin && (
                <Link
                  href="/app/admin"
                  className="glass-badge rounded-lg px-3 py-1.5 text-xs font-medium text-accent flex items-center gap-1.5 hover:scale-105 transition-transform"
                >
                  <Shield className="h-3.5 w-3.5" />
                  Admin Console
                </Link>
              )}
              <Link
                href={advisorDeskHref}
                className="glass-badge rounded-lg px-3 py-1.5 text-xs font-medium text-accent flex items-center gap-1.5 hover:scale-105 transition-transform"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Advisor Desk
              </Link>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="px-4 sm:px-6 py-6 sm:py-8 space-y-8 max-w-5xl">
          {/* Welcome banner */}
          <div className="glass-card rounded-2xl p-6 animate-fade-in-up">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-bold">Your work, tools, and client spaces</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {organizations.length > 0
                    ? `${organizations.length} organization${organizations.length > 1 ? 's' : ''} · ${activeEngagements.length} active engagement${activeEngagements.length !== 1 ? 's' : ''}`
                    : isPlatformAdmin
                      ? 'Platform admin access · No organization memberships'
                      : 'Awaiting organization access'
                  }
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={advisorDeskHref}
                  className="glass-badge rounded-lg px-4 py-2 text-sm font-medium text-accent flex items-center gap-2 hover:scale-105 transition-transform"
                >
                  <TrendingUp className="h-4 w-4" />
                  Advisor Desk
                </Link>
              </div>
            </div>
          </div>

          {/* Needs Attention - action-first section */}
          {needsAttentionItems.length > 0 && (
            <section className="animate-fade-in-up">
              <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                Needs Attention
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {needsAttentionItems.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className={`glass-card rounded-xl p-4 group ${
                      item.urgency === 'high' ? 'border-orange-300/50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {item.urgency === 'high' && (
                            <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                          )}
                          <h4 className="font-medium text-sm">{item.label}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Continue Working - highest value section */}
          {continueItems.length > 0 && (
            <section className="animate-fade-in-up" style={{ animationDelay: '50ms' }}>
              <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-accent" />
                Continue Working
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {continueItems.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="glass-card rounded-xl p-4 group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{item.label}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* My Work - active engagements */}
          {activeEngagements.length > 0 && (
            <section className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-accent" />
                My Work
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {activeEngagements.map((eng) => (
                  <Link
                    key={eng.id}
                    href={`/app/${eng.organizationSlug}`}
                    className="glass-card rounded-xl p-4 group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{getEngagementTypeLabel(eng.engagementType)}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{eng.organizationName}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs glass-badge px-2 py-0.5 rounded-full text-accent">
                            {getEngagementStatusLabel(eng.status)}
                          </span>
                          {eng.startsAt && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(eng.startsAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Tools & Applications */}
          {toolItems.length > 0 && (
            <section className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
              <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                <Wrench className="h-4 w-4 text-accent" />
                Tools &amp; Applications
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {toolItems.map((tool, idx) => {
                  const content = (
                    <div className="glass-card rounded-xl p-4 h-full group">
                      <h4 className="font-medium text-sm">{tool.label}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{tool.description}</p>
                      <span className="text-xs text-muted-foreground mt-2 inline-block">
                        {tool.href ? (
                          <span className="text-accent group-hover:underline">Open →</span>
                        ) : (
                          <span className="text-muted-foreground">{tool.status}</span>
                        )}
                      </span>
                    </div>
                  )
                  return tool.href ? (
                    <Link key={idx} href={tool.href}>{content}</Link>
                  ) : (
                    <div key={idx}>{content}</div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Organizations */}
          {organizations.length > 0 && (
            <section className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-accent" />
                Organizations
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {organizations.map((org) => (
                  <OrganizationCard key={org.id} org={org} />
                ))}
              </div>
            </section>
          )}

          {/* Pending invitations */}
          {invitations.length > 0 && (
            <section className="animate-fade-in-up" style={{ animationDelay: '250ms' }}>
              <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                <MailOpen className="h-4 w-4 text-accent" />
                Invitations
              </h3>
              <div className="space-y-2">
                {invitations.map((inv) => (
                  <div key={inv.id} className="glass-card rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm">{inv.organizationName}</h4>
                      <p className="text-xs text-muted-foreground">
                        Invited as {inv.role} · Expires {new Date(inv.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Link
                      href={`/auth/accept-invitation?token=${inv.id}`}
                      className="text-sm text-accent hover:underline glass-badge px-3 py-1.5 rounded-lg"
                    >
                      Accept
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Pending join requests */}
          {joinRequests.length > 0 && (
            <section className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent" />
                Access Requests
              </h3>
              <div className="space-y-2">
                {joinRequests.map((jr) => (
                  <div key={jr.id} className="glass-card rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm">{jr.organizationName}</h4>
                      <p className="text-xs text-muted-foreground">
                        Requested {new Date(jr.createdAt).toLocaleDateString()} · {jr.status}
                      </p>
                    </div>
                    <span className="text-xs glass-badge px-2 py-0.5 rounded-full text-amber-500">
                      Pending
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* No organizations - onboarding state */}
          {organizations.length === 0 && !isPlatformAdmin && (
            <section className="animate-fade-in-up">
              <div className="glass-card rounded-2xl p-8 text-center">
                <CheckCircle2 className="h-10 w-10 text-accent mx-auto mb-3" />
                <h3 className="text-lg font-semibold">Welcome to SubodhKC</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Your account is ready. Once you&apos;re invited to an organization or granted access to tools,
                  they&apos;ll appear here.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Link
                    href="/services"
                    className="glass-badge rounded-lg px-4 py-2 text-sm text-accent hover:scale-105 transition-transform"
                  >
                    Explore services
                  </Link>
                  <Link
                    href="/contact"
                    className="glass-badge rounded-lg px-4 py-2 text-sm text-accent hover:scale-105 transition-transform"
                  >
                    Request access
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* Platform admin section */}
          {isPlatformAdmin && (
            <section className="animate-fade-in-up" style={{ animationDelay: '350ms' }}>
              <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-accent" />
                Platform Administration
              </h3>
              <Link
                href="/app/admin"
                className="glass-card rounded-xl p-4 block group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm">Admin Console</h4>
                    <p className="text-xs text-muted-foreground">Manage organizations, users, and entitlements</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
              </Link>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

function OrganizationCard({ org }: { org: DashboardOrganization }) {
  const activeOfferings = org.offerings.filter(o => getOfferingStatus(o) === 'available')
  const isDemoOrg = org.slug === 'wilshire-demo'

  return (
    <Link
      href={`/app/${org.slug}`}
      className="glass-card rounded-xl p-4 group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-medium text-sm">{org.name}</h4>
            {isDemoOrg && (
              <span className="text-xs glass-badge px-1.5 py-0.5 rounded-full text-amber-500 font-medium">
                Synthetic Data
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {org.organizationKind} · {org.role}
          </p>
          {activeOfferings.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {activeOfferings.slice(0, 3).map((o) => (
                <span key={o.offeringKey} className="text-xs glass-badge px-1.5 py-0.5 rounded text-accent">
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
        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0" />
      </div>
    </Link>
  )
}
