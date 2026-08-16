'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, User as UserIcon, Building2, Shield, ArrowLeft } from 'lucide-react'
import type { AuthenticatedUser, OrganizationRole } from '@/lib/auth/organization-resolver'

interface OrgSummary {
  id: string
  name: string
  slug: string
  organization_kind: string
  status: string
  role: OrganizationRole
}

interface AccountClientProps {
  user: AuthenticatedUser
  organizations: OrgSummary[]
}

export function AccountClient({ user, organizations }: AccountClientProps) {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  const firstName = user.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'there'

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-4">
            <Link href="/app" className="font-semibold text-sm">
              SubodhKC
            </Link>
            <span className="text-muted-foreground text-sm">/</span>
            <span className="text-sm font-medium">Account</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {user.isPlatformAdmin && (
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
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-8">
        {/* Profile */}
        <section>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Profile
          </h2>
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-4">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="h-16 w-16 rounded-full" />
              ) : (
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-primary" />
                </div>
              )}
              <div>
                <p className="font-medium">{user.displayName || firstName}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            {user.isPlatformAdmin && (
              <div className="flex items-center gap-2 pt-2 border-t">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm text-primary">Platform Administrator</span>
              </div>
            )}
          </div>
        </section>

        {/* Organizations */}
        <section>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Organizations
          </h2>
          {organizations.length === 0 ? (
            <p className="text-sm text-muted-foreground border rounded-lg p-4">
              You are not a member of any organizations.
            </p>
          ) : (
            <div className="border rounded-lg divide-y">
              {organizations.map((org) => (
                <Link
                  key={org.id}
                  href={`/app/${org.slug}`}
                  className="flex items-center justify-between p-3 hover:bg-accent/30 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium">{org.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {org.role} · {org.organization_kind}
                    </p>
                  </div>
                  <ArrowLeft className="h-4 w-4 text-muted-foreground rotate-180" />
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Sign out */}
        <section>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm border rounded-lg hover:bg-accent transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </section>

        {/* Service Terms */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold">Service Terms</h2>
          <div className="space-y-1.5">
            <Link href="/terms" className="block text-sm text-primary hover:underline">
              Terms of Service
            </Link>
            <Link href="/service-terms/ai-advisor-for-business" className="block text-sm text-primary hover:underline">
              AI Advisor for Business — Service Schedule
            </Link>
            <Link href="/service-terms/fractional-ai-advisor" className="block text-sm text-primary hover:underline">
              Fractional AI Advisor — Service Schedule
            </Link>
          </div>
        </section>

        {/* Back */}
        <div>
          <Link href="/app" className="text-sm text-primary hover:underline">
            ← Back to My SubodhKC
          </Link>
        </div>
      </main>
    </div>
  )
}
