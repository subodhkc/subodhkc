'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LogOut, ChevronRight, Building2, Shield, User as UserIcon,
  Briefcase, Wrench, ArrowRight, MailOpen, Clock, CheckCircle2,
  AlertCircle, Calendar,
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

  // Build "Tools & Applications" section
  const toolItems: Array<{ label: string; description: string; href: string | null; status: string }> = []
  const seenOfferings = new Set<string>()

  for (const org of organizations) {
    for (const offering of org.offerings) {
      const status = getOfferingStatus(offering)
      if (status === 'available' || status === 'no-role') {
        const key = `${offering.offeringKey}-${org.id}`
        if (!seenOfferings.has(offering.offeringKey)) {
          seenOfferings.add(offering.offeringKey)
          const route = getOfferingRoute(org.slug, offering.offeringKey)
          const offeringKindLabel = getOfferingKindLabel(offering.offeringKind)
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

  // Active engagements
  const activeEngagements = engagements.filter(e => e.status === 'active')

  // Greeting based on time
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-4">
            <Link href="/app" className="font-semibold text-sm">
              SubodhKC
            </Link>
            <nav className="hidden sm:flex items-center gap-1 text-sm">
              <Link
                href="/app"
                className="px-3 py-1.5 rounded-md hover:bg-accent bg-accent font-medium"
              >
                My SubodhKC
              </Link>
              {isPlatformAdmin && (
                <Link
                  href="/app/admin"
                  className="px-3 py-1.5 rounded-md hover:bg-accent flex items-center gap-1"
                >
                  <Shield className="h-3.5 w-3.5" />
                  Admin
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 text-sm hover:bg-accent rounded-md px-2 py-1.5"
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="h-6 w-6 rounded-full" />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserIcon className="h-3.5 w-3.5 text-primary" />
                  </div>
                )}
                <span className="hidden sm:inline text-muted-foreground">{firstName}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 border rounded-lg bg-card shadow-lg z-50">
                  <div className="p-3 border-b">
                    <p className="text-sm font-medium truncate">{user.displayName || firstName}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <div className="p-1">
                    <Link
                      href="/app/account"
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-md"
                      onClick={() => setMenuOpen(false)}
                    >
                      <UserIcon className="h-4 w-4" />
                      Account
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-md text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {greeting}, {firstName}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Your work, tools, and client spaces in one place.
          </p>
        </div>

        {/* Continue Working - highest value section */}
        {continueItems.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3">Continue Working</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {continueItems.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="group border rounded-lg p-4 hover:border-primary/30 hover:bg-accent/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm">{item.label}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* My Work - active engagements */}
        {activeEngagements.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              My Work
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {activeEngagements.map((eng) => (
                <Link
                  key={eng.id}
                  href={`/app/${eng.organizationSlug}`}
                  className="group border rounded-lg p-4 hover:border-primary/30 hover:bg-accent/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm">{getEngagementTypeLabel(eng.engagementType)}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{eng.organizationName}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-green-500/10 text-green-700 px-2 py-0.5 rounded">
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
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Tools & Applications */}
        {toolItems.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Tools &amp; Applications
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {toolItems.map((tool, idx) => {
                const content = (
                  <div className="group border rounded-lg p-4 hover:border-primary/30 hover:bg-accent/30 transition-colors h-full">
                    <h3 className="font-medium text-sm">{tool.label}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{tool.description}</p>
                    <span className="text-xs text-muted-foreground mt-2 inline-block">
                      {tool.href ? (
                        <span className="text-primary group-hover:underline">Open →</span>
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
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Organizations
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {organizations.map((org) => (
                <OrganizationCard key={org.id} org={org} />
              ))}
            </div>
          </section>
        )}

        {/* Pending invitations */}
        {invitations.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <MailOpen className="h-5 w-5" />
              Invitations
            </h2>
            <div className="space-y-2">
              {invitations.map((inv) => (
                <div key={inv.id} className="border rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-sm">{inv.organizationName}</h3>
                    <p className="text-xs text-muted-foreground">
                      Invited as {inv.role} · Expires {new Date(inv.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Link
                    href={`/auth/accept-invitation?token=${inv.id}`}
                    className="text-sm text-primary hover:underline"
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
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Access Requests
            </h2>
            <div className="space-y-2">
              {joinRequests.map((jr) => (
                <div key={jr.id} className="border rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-sm">{jr.organizationName}</h3>
                    <p className="text-xs text-muted-foreground">
                      Requested {new Date(jr.createdAt).toLocaleDateString()} · {jr.status}
                    </p>
                  </div>
                  <span className="text-xs bg-yellow-500/10 text-yellow-700 px-2 py-0.5 rounded">
                    Pending
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* No organizations - onboarding state */}
        {organizations.length === 0 && !isPlatformAdmin && (
          <section>
            <div className="border rounded-lg p-8 text-center">
              <CheckCircle2 className="h-10 w-10 text-primary mx-auto mb-3" />
              <h2 className="text-lg font-semibold">Welcome to SubodhKC</h2>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Your account is ready. Once you&apos;re invited to an organization or granted access to tools,
                they&apos;ll appear here.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Link
                  href="/services"
                  className="text-sm text-primary hover:underline"
                >
                  Explore services
                </Link>
                <Link
                  href="/contact"
                  className="text-sm text-primary hover:underline"
                >
                  Request access
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Platform admin: all organizations */}
        {isPlatformAdmin && (
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Platform Administration
            </h2>
            <Link
              href="/app/admin"
              className="block border rounded-lg p-4 hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-sm">Admin Console</h3>
                  <p className="text-xs text-muted-foreground">Manage organizations, users, and entitlements</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
          </section>
        )}
      </main>
    </div>
  )
}

function OrganizationCard({ org }: { org: DashboardOrganization }) {
  const activeOfferings = org.offerings.filter(o => getOfferingStatus(o) === 'available')
  const hasSchoolPickup = activeOfferings.some(o => o.offeringKey === 'school_pickup')

  return (
    <Link
      href={`/app/${org.slug}`}
      className="group border rounded-lg p-4 hover:border-primary/30 hover:bg-accent/30 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm">{org.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {org.organizationKind} · {org.role}
          </p>
          {activeOfferings.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {activeOfferings.slice(0, 3).map((o) => (
                <span key={o.offeringKey} className="text-xs bg-accent px-1.5 py-0.5 rounded">
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
        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
      </div>
    </Link>
  )
}
