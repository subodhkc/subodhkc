'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check, X, Plus } from 'lucide-react'
import type { AuthenticatedUser, OrganizationContext } from '@/lib/auth/organization-resolver'

interface Offering {
  id: string
  offering_key: string
  name: string
  offering_kind: string
  status: string
}

interface Entitlement {
  id: string
  offering_id: string
  offering_key: string
  offering_name: string
  status: string
  source_type: string
  valid_from: string
  valid_until: string | null
}

interface Member {
  id: string
  user_id: string
  email: string
  display_name: string
  role: string
}

interface OrgSettingsClientProps {
  user: AuthenticatedUser
  ctx: OrganizationContext
  offerings: Offering[]
  entitlements: Entitlement[]
  members: Member[]
}

export function OrgSettingsClient({ user, ctx, offerings, entitlements, members }: OrgSettingsClientProps) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const basePath = `/app/${ctx.organization.slug}`

  async function toggleEntitlement(offeringId: string, offeringKey: string, currentlyActive: boolean) {
    setError('')
    setSuccess('')
    try {
      if (currentlyActive) {
        // Suspend entitlement
        const res = await fetch(`/api/org/${ctx.organization.id}/entitlements`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ offering_id: offeringId, action: 'suspend' }),
        })
        if (!res.ok) {
          const data = await res.json()
          setError(data.error || 'Failed to suspend entitlement')
        } else {
          setSuccess(`Suspended ${offeringKey}`)
        }
      } else {
        // Create/activate entitlement
        const res = await fetch(`/api/org/${ctx.organization.id}/entitlements`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ offering_id: offeringId }),
        })
        if (!res.ok) {
          const data = await res.json()
          setError(data.error || 'Failed to add entitlement')
        } else {
          setSuccess(`Added ${offeringKey}`)
        }
      }
      router.refresh()
    } catch {
      setError('Network error')
    }
  }

  async function changeMemberRole(memberUserId: string, newRole: string) {
    setError('')
    try {
      const res = await fetch(`/api/org/${ctx.organization.id}/members/${memberUserId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to update role')
      } else {
        setSuccess(`Updated role to ${newRole}`)
      }
      router.refresh()
    } catch {
      setError('Network error')
    }
  }

  const isOwner = ctx.organizationRole === 'owner' || ctx.isPlatformAdmin

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="px-4 h-14 flex items-center gap-4">
          <Link href="/app" className="font-semibold text-sm">SubodhKC</Link>
          <span className="text-muted-foreground">/</span>
          <Link href={basePath} className="text-sm">{ctx.organization.name}</Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">Settings</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <h1 className="text-2xl font-bold">Organization Settings</h1>

        {error && <div className="bg-red-500/10 text-red-700 text-sm p-3 rounded">{error}</div>}
        {success && <div className="bg-green-500/10 text-green-700 text-sm p-3 rounded">{success}</div>}

        {/* Organization info */}
        <section className="border rounded-lg p-4">
          <h2 className="font-semibold mb-3">Organization Info</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Name:</span> {ctx.organization.name}
            </div>
            <div>
              <span className="text-muted-foreground">Slug:</span> {ctx.organization.slug}
            </div>
            <div>
              <span className="text-muted-foreground">Kind:</span> {ctx.organization.organization_kind}
            </div>
            <div>
              <span className="text-muted-foreground">Status:</span> {ctx.organization.status}
            </div>
          </div>
        </section>

        {/* Entitlements management */}
        <section className="border rounded-lg p-4">
          <h2 className="font-semibold mb-3">Entitlements</h2>
          <p className="text-xs text-muted-foreground mb-3">
            Manage which offerings this organization can access.
          </p>
          <div className="space-y-2">
            {offerings.map((o) => {
              const ent = entitlements.find(e => e.offering_id === o.id)
              const isActive = ent?.status === 'active'
              return (
                <div key={o.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <span className="text-sm font-medium">{o.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{o.offering_key}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {ent && (
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        isActive ? 'bg-green-500/10 text-green-700' : 'bg-yellow-500/10 text-yellow-700'
                      }`}>
                        {ent.status}
                      </span>
                    )}
                    <button
                      onClick={() => toggleEntitlement(o.id, o.offering_key, isActive)}
                      className={`text-xs px-2 py-1 rounded ${
                        isActive
                          ? 'bg-red-500/10 text-red-700 hover:bg-red-500/20'
                          : 'bg-green-500/10 text-green-700 hover:bg-green-500/20'
                      }`}
                    >
                      {isActive ? 'Suspend' : 'Activate'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Member roles management */}
        <section className="border rounded-lg p-4">
          <h2 className="font-semibold mb-3">Member Roles</h2>
          <div className="space-y-2">
            {members.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <span className="text-sm">{m.display_name || m.email}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{m.email}</span>
                </div>
                <select
                  value={m.role}
                  onChange={(e) => changeMemberRole(m.user_id, e.target.value)}
                  disabled={!isOwner || m.user_id === user.id}
                  className="text-sm px-2 py-1 rounded border border-border bg-background disabled:opacity-50"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="owner">Owner</option>
                </select>
              </div>
            ))}
          </div>
          {!isOwner && (
            <p className="text-xs text-muted-foreground mt-2">
              Only owners can change member roles.
            </p>
          )}
        </section>
      </main>
    </div>
  )
}
