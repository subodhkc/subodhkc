'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { LogOut, ChevronDown, Home, Users, QrCode, Settings, GraduationCap, UserCog, Zap, ScanLine, ListChecks, Share2, Layers, Heart, FlaskConical } from 'lucide-react'
import type { AuthenticatedUser } from '@/lib/auth/organization-resolver'
import type { SchoolContext } from '@/lib/auth/school-resolver'

interface SchoolPickupLayoutProps {
  user: AuthenticatedUser
  ctx: SchoolContext
  sites: Array<{ id: string; name: string; slug: string }>
  children: React.ReactNode
}

export function SchoolPickupLayout({ user, ctx, sites, children }: SchoolPickupLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [siteSwitcherOpen, setSiteSwitcherOpen] = useState(false)

  const { site, schoolRole, canManageStaff, canManageSettings } = ctx
  const org = ctx.organization.organization
  const basePath = `/app/${org.slug}/school-pickup/${site.slug}`
  const isDemoUser = user.email === 'demo-junekc@subodhkc.com'

  const navItems = [
    { href: basePath, label: 'Overview', icon: Home, exact: true },
    { href: `${basePath}/dismissal`, label: 'Dismissal', icon: Zap },
    { href: `${basePath}/queue`, label: 'Queue', icon: ListChecks },
    { href: `${basePath}/scanner`, label: 'Scanner', icon: ScanLine },
    { href: `${basePath}/students`, label: 'Students', icon: Users },
    { href: `${basePath}/family-access`, label: 'Family Access', icon: Heart, show: ctx.canEditRoster },
    { href: `${basePath}/groups`, label: 'Groups', icon: Layers, show: ctx.canEditRoster },
    { href: `${basePath}/staff`, label: 'Staff', icon: UserCog, show: canManageStaff },
    { href: `${basePath}/credentials`, label: 'QR / Pickup Credentials', icon: QrCode },
    { href: `${basePath}/checkin-qr`, label: 'Check-In QR', icon: Share2, show: canManageSettings || ctx.canIssueCredentials },
    { href: `${basePath}/settings`, label: 'Settings', icon: Settings, show: canManageSettings },
  ].filter(item => item.show !== false)

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Demo mode indicator */}
      {isDemoUser && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 flex items-center justify-center gap-2 text-xs text-amber-800">
          <FlaskConical className="h-3.5 w-3.5" />
          <span className="font-medium">Demo — Synthetic Data</span>
        </div>
      )}

      {/* Top bar */}
      <header className="border-b bg-card sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2 min-w-0">
            <Link href="/app" className="font-semibold text-sm shrink-0">SubodhKC</Link>
            <span className="text-muted-foreground shrink-0">/</span>
            <Link href={`/app/${org.slug}`} className="text-sm truncate hidden sm:inline">{org.name}</Link>
            <span className="text-muted-foreground shrink-0 hidden sm:inline">/</span>
            <div className="relative">
              <button
                onClick={() => sites.length > 1 && setSiteSwitcherOpen(!siteSwitcherOpen)}
                className="text-sm font-medium flex items-center gap-1 hover:bg-accent px-2 py-1 rounded-md"
              >
                <GraduationCap className="h-4 w-4 shrink-0" />
                <span className="truncate max-w-[120px] sm:max-w-[200px]">{site.name}</span>
                {sites.length > 1 && <ChevronDown className="h-3 w-3 shrink-0" />}
              </button>
              {siteSwitcherOpen && sites.length > 1 && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setSiteSwitcherOpen(false)} />
                  <div className="absolute left-0 top-full mt-1 bg-popover border rounded-lg shadow-lg z-50 min-w-[200px]">
                    {sites.map(s => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSiteSwitcherOpen(false)
                          router.push(`/app/${org.slug}/school-pickup/${s.slug}`)
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-accent first:rounded-t-lg last:rounded-b-lg ${
                          s.id === site.id ? 'bg-accent font-medium' : ''
                        }`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            {schoolRole && (
              <span className="text-xs text-muted-foreground bg-accent px-2 py-0.5 rounded shrink-0 hidden md:inline">
                {schoolRole.replace('_', ' ')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm shrink-0">
            <span className="text-muted-foreground hidden sm:inline">{user.email}</span>
            <button
              onClick={async () => {
                await fetch('/auth/logout', { method: 'POST' })
                window.location.href = '/login'
              }}
              className="p-2 hover:bg-accent rounded-md"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Sub-navigation */}
        <nav className="px-2 sm:px-4 flex items-center gap-1 text-sm border-t overflow-x-auto">
          {navItems.map(item => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2.5 hover:bg-accent whitespace-nowrap flex items-center gap-1.5 border-b-2 ${
                  isActive(item.href, item.exact)
                    ? 'border-accent font-medium'
                    : 'border-transparent'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
