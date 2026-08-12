'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { LogOut, ChevronDown, Settings, Users, Shield, Building2 } from 'lucide-react'
import type { AuthenticatedUser } from '@/lib/auth/organization-resolver'

interface OrgSummary {
  id: string
  name: string
  slug: string
  organization_kind: string
  status: string
  role: string
}

interface AppShellClientProps {
  user: AuthenticatedUser
  organizations: OrgSummary[]
  allOrganizations: OrgSummary[]
}

export function AppShellClient({ user, organizations, allOrganizations }: AppShellClientProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [orgSwitcherOpen, setOrgSwitcherOpen] = useState(false)

  async function handleLogout() {
    await fetch('/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  const isPlatformAdmin = user.isPlatformAdmin

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b bg-card">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-4">
            <Link href="/app" className="font-semibold text-sm">
              SubodhKC
            </Link>
            <nav className="flex items-center gap-1 text-sm">
              <Link
                href="/app"
                className={`px-3 py-1.5 rounded-md hover:bg-accent ${pathname === '/app' ? 'bg-accent' : ''}`}
              >
                Home
              </Link>
              {isPlatformAdmin && (
                <Link
                  href="/app/admin"
                  className={`px-3 py-1.5 rounded-md hover:bg-accent flex items-center gap-1 ${pathname.startsWith('/app/admin') ? 'bg-accent' : ''}`}
                >
                  <Shield className="h-3.5 w-3.5" />
                  Admin
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* User menu */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{user.email}</span>
              {isPlatformAdmin && (
                <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">Admin</span>
              )}
              <button
                onClick={handleLogout}
                className="p-1.5 hover:bg-accent rounded-md"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user.displayName || user.email}</h1>
        <p className="text-muted-foreground text-sm mb-8">
          {isPlatformAdmin
            ? 'You have platform administrator access.'
            : 'Select an organization to continue.'}
        </p>

        {/* Organization list */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Your Organizations
          </h2>

          {organizations.length === 0 ? (
            <div className="border rounded-lg p-8 text-center text-muted-foreground">
              <p className="text-sm">You are not a member of any organization yet.</p>
              {isPlatformAdmin && (
                <Link
                  href="/app/admin"
                  className="mt-3 inline-block text-sm text-primary hover:underline"
                >
                  Go to Admin Console to create organizations
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-3">
              {organizations.map((org) => (
                <Link
                  key={org.id}
                  href={`/app/${org.slug}`}
                  className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{org.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {org.organization_kind} · {org.role}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {org.status !== 'active' && (
                        <span className="text-xs bg-yellow-500/10 text-yellow-700 px-2 py-0.5 rounded">
                          {org.status}
                        </span>
                      )}
                      <ChevronDown className="h-4 w-4 -rotate-90 text-muted-foreground" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Platform admin: all organizations */}
          {isPlatformAdmin && allOrganizations.length > organizations.length && (
            <div className="mt-6 pt-6 border-t">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
                <Shield className="h-5 w-5" />
                All Organizations ({allOrganizations.length})
              </h2>
              <div className="grid gap-2">
                {allOrganizations
                  .filter(o => !organizations.some(m => m.id === o.id))
                  .map((org) => (
                    <Link
                      key={org.id}
                      href={`/app/${org.slug}`}
                      className="border rounded-lg p-3 hover:bg-accent/50 transition-colors text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span>{org.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {org.organization_kind} · {org.status}
                        </span>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
