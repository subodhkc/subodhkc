'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, Settings, Users, Building2, Shield } from 'lucide-react'
import type { AuthenticatedUser, OrganizationContext } from '@/lib/auth/organization-resolver'

interface OrgShellClientProps {
  user: AuthenticatedUser
  ctx: OrganizationContext
}

export function OrgShellClient({ user, ctx }: OrgShellClientProps) {
  const pathname = usePathname()
  const { organization, organizationRole, isPlatformAdmin, entitlements, offeringRoles } = ctx

  const isAdmin = organizationRole === 'owner' || organizationRole === 'admin' || isPlatformAdmin
  const basePath = `/app/${organization.slug}`

  // Available offerings: entitlements that are active AND user has a role
  const availableOfferings = entitlements.filter(
    e => e.effective_status === 'active'
  ).map(e => {
    const role = offeringRoles.find(r => r.offering_key === e.offering_key)
    return {
      ...e,
      hasRole: !!role,
      role: role?.role,
    }
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b bg-card">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-4">
            <Link href="/app" className="font-semibold text-sm">
              SubodhKC
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-medium">{organization.name}</span>
            <span className="text-xs text-muted-foreground bg-accent px-2 py-0.5 rounded">
              {organizationRole || 'admin (platform)'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">{user.email}</span>
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
        <div className="px-4 flex items-center gap-1 text-sm border-t">
          <Link
            href={basePath}
            className={`px-3 py-2 hover:bg-accent ${pathname === basePath ? 'bg-accent font-medium' : ''}`}
          >
            Overview
          </Link>

          {/* Offering links */}
          {availableOfferings.map((offering) => (
            <Link
              key={offering.offering_key}
              href={`${basePath}/${offering.offering_key}`}
              className={`px-3 py-2 hover:bg-accent ${
                pathname.startsWith(`${basePath}/${offering.offering_key}`) ? 'bg-accent font-medium' : ''
              } ${!offering.hasRole ? 'opacity-50' : ''}`}
            >
              {offering.offering_name}
              {!offering.hasRole && (
                <span className="ml-1 text-xs text-muted-foreground">(no role)</span>
              )}
            </Link>
          ))}

          {/* Admin links */}
          {isAdmin && (
            <>
              <Link
                href={`${basePath}/members`}
                className={`px-3 py-2 hover:bg-accent flex items-center gap-1 ${
                  pathname === `${basePath}/members` ? 'bg-accent font-medium' : ''
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                Members
              </Link>
              <Link
                href={`${basePath}/settings`}
                className={`px-3 py-2 hover:bg-accent flex items-center gap-1 ${
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
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">{organization.name}</h1>
        <p className="text-sm text-muted-foreground mb-6">
          {organization.organization_kind} · {organization.status}
        </p>

        {/* Entitlements summary */}
        <section className="space-y-3 mb-8">
          <h2 className="text-lg font-semibold">Entitlements</h2>
          {entitlements.length === 0 ? (
            <p className="text-sm text-muted-foreground">No entitlements assigned.</p>
          ) : (
            <div className="grid gap-2">
              {entitlements.map((e) => (
                <div key={e.id} className="border rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <span className="font-medium text-sm">{e.offering_name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{e.offering_key}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      e.effective_status === 'active'
                        ? 'bg-green-500/10 text-green-700'
                        : 'bg-yellow-500/10 text-yellow-700'
                    }`}>
                      {e.effective_status}
                    </span>
                    {offeringRoles.find(r => r.offering_key === e.offering_key) && (
                      <span className="text-xs bg-blue-500/10 text-blue-700 px-2 py-0.5 rounded">
                        {offeringRoles.find(r => r.offering_key === e.offering_key)!.role}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Offering roles summary */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Your Offering Access</h2>
          {offeringRoles.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You have no offering-level roles in this organization.
            </p>
          ) : (
            <div className="grid gap-2">
              {offeringRoles.map((r) => (
                <div key={r.id} className="border rounded-lg p-3 flex items-center justify-between">
                  <span className="text-sm">{r.offering_name}</span>
                  <span className="text-xs bg-blue-500/10 text-blue-700 px-2 py-0.5 rounded">
                    {r.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
