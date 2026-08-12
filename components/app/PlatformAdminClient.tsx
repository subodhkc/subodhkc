'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Building2, Plus, Shield } from 'lucide-react'
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="px-4 h-14 flex items-center gap-4">
          <Link href="/app" className="font-semibold text-sm">SubodhKC</Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium flex items-center gap-1">
            <Shield className="h-3.5 w-3.5" />
            Platform Admin
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Platform Administration</h1>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            New Organization
          </button>
        </div>

        {error && <div className="bg-red-500/10 text-red-700 text-sm p-3 rounded mb-4">{error}</div>}

        {showCreate && (
          <form onSubmit={handleCreateOrg} className="border rounded-lg p-4 mb-6 space-y-3">
            <h2 className="font-semibold">Create Organization</h2>
            <div>
              <label className="text-xs text-muted-foreground">Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Slug (optional)</label>
              <input
                type="text"
                value={orgSlug}
                onChange={(e) => setOrgSlug(e.target.value)}
                placeholder="auto-generated from name"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Kind</label>
              <select
                value={orgKind}
                onChange={(e) => setOrgKind(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
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
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create'}
            </button>
          </form>
        )}

        {/* Organizations */}
        <section className="mb-8">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Organizations ({organizations.length})
          </h2>
          <div className="border rounded-lg divide-y">
            {organizations.map((org) => (
              <Link
                key={org.id}
                href={`/app/${org.slug}`}
                className="flex items-center justify-between p-3 hover:bg-accent/50"
              >
                <div>
                  <span className="text-sm font-medium">{org.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{org.slug}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{org.organization_kind}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    org.status === 'active' ? 'bg-green-500/10 text-green-700' :
                    org.status === 'suspended' ? 'bg-red-500/10 text-red-700' :
                    'bg-gray-500/10 text-gray-700'
                  }`}>
                    {org.status}
                  </span>
                </div>
              </Link>
            ))}
            {organizations.length === 0 && (
              <div className="p-4 text-sm text-muted-foreground">No organizations yet.</div>
            )}
          </div>
        </section>

        {/* Offerings catalog */}
        <section>
          <h2 className="font-semibold mb-3">Offerings Catalog ({offerings.length})</h2>
          <div className="border rounded-lg divide-y">
            {offerings.map((o) => (
              <div key={o.id} className="flex items-center justify-between p-3">
                <div>
                  <span className="text-sm font-medium">{o.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{o.offering_key}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{o.offering_kind}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    o.status === 'active' ? 'bg-green-500/10 text-green-700' : 'bg-gray-500/10 text-gray-700'
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
