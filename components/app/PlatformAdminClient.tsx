'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Building2, Plus, Shield, ArrowLeft, Menu, X, LogOut } from 'lucide-react'
import type { AuthenticatedUser } from '@/lib/auth/organization-resolver'

interface PlatformAdminClientProps {
  user: AuthenticatedUser
  organizations: Array<{
    id: string
    name: string
    slug: string
    organization_kind: string
    status: string
    created_at: string
  }>
  offerings: Array<{
    id: string
    offering_key: string
    name: string
    offering_kind: string
    status: string
  }>
}

export function PlatformAdminClient({ user, organizations, offerings }: PlatformAdminClientProps) {
  const router = useRouter()
  const [showCreate, setShowCreate] = useState(false)
  const [orgName, setOrgName] = useState('')
  const [orgSlug, setOrgSlug] = useState('')
  const [orgKind, setOrgKind] = useState('business')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  async function handleCreateOrg(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    setError('')
    try {
      const res = await fetch('/api/admin/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: orgName,
          slug: orgSlug || orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          organization_kind: orgKind,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to create organization')
      } else {
        setShowCreate(false)
        setOrgName('')
        setOrgSlug('')
        router.refresh()
      }
    } catch {
      setError('Network error')
    }
    setCreating(false)
  }

  async function handleLogout() {
    await fetch('/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen glass-gradient-bg">
      {/* Top bar */}
      <header className="glass sticky top-0 z-20 border-b border-border/20">
        <div className="flex items-center justify-between px-4 sm:px-6 h-16">
          <div className="flex items-center gap-3">
            <Link
              href="/app"
              className="glass-badge rounded-lg p-2 text-accent hover:scale-105 transition-transform"
              title="Back to Dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-accent" />
              <h1 className="text-lg font-bold tracking-tight">Platform Admin</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass-badge rounded-lg px-3 py-1.5 text-xs font-medium text-accent flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              {user.email}
            </div>
            <button
              onClick={handleLogout}
              className="glass-badge rounded-lg p-2 text-muted-foreground hover:text-destructive transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header card */}
        <div className="glass-card rounded-2xl p-6 animate-fade-in-up">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-bold">Platform Administration</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {organizations.length} organizations · {offerings.length} offerings
              </p>
            </div>
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="glass-badge rounded-lg px-4 py-2 text-sm font-medium text-accent flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Plus className="h-4 w-4" />
              New Organization
            </button>
          </div>
        </div>

        {error && (
          <div className="glass-card rounded-xl p-3 text-sm text-destructive border-destructive/20">
            {error}
          </div>
        )}

        {showCreate && (
          <form onSubmit={handleCreateOrg} className="glass-card rounded-2xl p-6 space-y-4 animate-fade-in-up">
            <h3 className="font-semibold">Create Organization</h3>
            <div>
              <label className="text-xs text-muted-foreground">Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg glass-input text-sm mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Slug (optional)</label>
              <input
                type="text"
                value={orgSlug}
                onChange={(e) => setOrgSlug(e.target.value)}
                placeholder="auto-generated from name"
                className="w-full px-3 py-2 rounded-lg glass-input text-sm mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Kind</label>
              <select
                value={orgKind}
                onChange={(e) => setOrgKind(e.target.value)}
                className="w-full px-3 py-2 rounded-lg glass-input text-sm mt-1"
              >
                <option value="business">Business</option>
                <option value="school">School</option>
                <option value="nonprofit">Nonprofit</option>
                <option value="internal">Internal</option>
                <option value="individual">Individual</option>
                <option value="other">Other</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={creating}
              className="glass-badge rounded-lg px-4 py-2 text-sm font-medium text-accent disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create'}
            </button>
          </form>
        )}

        {/* Organizations */}
        <section className="animate-fade-in-up" style={{ animationDelay: '50ms' }}>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-accent" />
            Organizations ({organizations.length})
          </h3>
          <div className="space-y-2">
            {organizations.map((org) => (
              <Link
                key={org.id}
                href={`/app/${org.slug}`}
                className="glass-card rounded-xl p-4 flex items-center justify-between group"
              >
                <div>
                  <span className="text-sm font-medium">{org.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{org.slug}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{org.organization_kind}</span>
                  <span className={`text-xs glass-badge px-2 py-0.5 rounded-full ${
                    org.status === 'active' ? 'text-green-500' :
                    org.status === 'suspended' ? 'text-destructive' :
                    'text-muted-foreground'
                  }`}>
                    {org.status}
                  </span>
                </div>
              </Link>
            ))}
            {organizations.length === 0 && (
              <div className="glass-card rounded-xl p-4 text-sm text-muted-foreground">No organizations yet.</div>
            )}
          </div>
        </section>

        {/* Offerings catalog */}
        <section className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <h3 className="font-semibold mb-3">Offerings Catalog ({offerings.length})</h3>
          <div className="space-y-2">
            {offerings.map((o) => (
              <div key={o.id} className="glass-card rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium">{o.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{o.offering_key}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{o.offering_kind}</span>
                  <span className={`text-xs glass-badge px-2 py-0.5 rounded-full ${
                    o.status === 'active' ? 'text-green-500' : 'text-muted-foreground'
                  }`}>
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
