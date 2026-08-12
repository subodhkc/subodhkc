'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2, UserPlus, X } from 'lucide-react'
import type { AuthenticatedUser, OrganizationContext } from '@/lib/auth/organization-resolver'

interface Member {
  id: string
  user_id: string
  email: string
  display_name: string
  role: string
  status: string
  joined_at: string
}

interface Invitation {
  id: string
  email: string
  role: string
  expires_at: string
  accepted_at: string | null
  revoked_at: string | null
  created_at: string
}

interface MembersClientProps {
  user: AuthenticatedUser
  ctx: OrganizationContext
  members: Member[]
  invitations: Invitation[]
}

export function MembersClient({ user, ctx, members, invitations }: MembersClientProps) {
  const router = useRouter()
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')
  const [inviting, setInviting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const isOwner = ctx.organizationRole === 'owner' || ctx.isPlatformAdmin
  const basePath = `/app/${ctx.organization.slug}`

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setInviting(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch(`/api/org/${ctx.organization.id}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to send invitation')
      } else {
        setSuccess(`Invitation sent to ${inviteEmail}`)
        setInviteEmail('')
        router.refresh()
      }
    } catch {
      setError('Network error')
    }
    setInviting(false)
  }

  async function handleRemoveMember(memberUserId: string) {
    if (!confirm('Remove this member from the organization?')) return
    try {
      const res = await fetch(`/api/org/${ctx.organization.id}/members/${memberUserId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        router.refresh()
      }
    } catch {
      setError('Failed to remove member')
    }
  }

  async function handleRevokeInvitation(invitationId: string) {
    if (!confirm('Revoke this invitation?')) return
    try {
      const res = await fetch(`/api/org/${ctx.organization.id}/invitations/${invitationId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        router.refresh()
      }
    } catch {
      setError('Failed to revoke invitation')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="px-4 h-14 flex items-center gap-4">
          <Link href="/app" className="font-semibold text-sm">SubodhKC</Link>
          <span className="text-muted-foreground">/</span>
          <Link href={basePath} className="text-sm">{ctx.organization.name}</Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">Members</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Members & Invitations</h1>

        {error && <div className="bg-red-500/10 text-red-700 text-sm p-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-500/10 text-green-700 text-sm p-3 rounded mb-4">{success}</div>}

        {/* Invite form */}
        <section className="border rounded-lg p-4 mb-6">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Invite New Member
          </h2>
          <form onSubmit={handleInvite} className="flex gap-2">
            <input
              type="email"
              placeholder="email@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
              className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              {isOwner && <option value="owner">Owner</option>}
            </select>
            <button
              type="submit"
              disabled={inviting}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm disabled:opacity-50"
            >
              {inviting ? 'Sending...' : 'Invite'}
            </button>
          </form>
        </section>

        {/* Members list */}
        <section className="mb-6">
          <h2 className="font-semibold mb-3">Active Members ({members.filter(m => m.status === 'active').length})</h2>
          <div className="border rounded-lg divide-y">
            {members.filter(m => m.status === 'active').map((m) => (
              <div key={m.id} className="flex items-center justify-between p-3">
                <div>
                  <span className="text-sm font-medium">{m.display_name || m.email}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{m.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    m.role === 'owner' ? 'bg-purple-500/10 text-purple-700' :
                    m.role === 'admin' ? 'bg-blue-500/10 text-blue-700' :
                    'bg-gray-500/10 text-gray-700'
                  }`}>
                    {m.role}
                  </span>
                  {m.user_id !== user.id && isOwner && (
                    <button
                      onClick={() => handleRemoveMember(m.user_id)}
                      className="p-1 hover:bg-accent rounded"
                      title="Remove member"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {members.filter(m => m.status === 'active').length === 0 && (
              <div className="p-4 text-sm text-muted-foreground">No active members.</div>
            )}
          </div>
        </section>

        {/* Invitations list */}
        <section>
          <h2 className="font-semibold mb-3">Pending Invitations</h2>
          <div className="border rounded-lg divide-y">
            {invitations.filter(i => !i.accepted_at && !i.revoked_at).map((i) => (
              <div key={i.id} className="flex items-center justify-between p-3">
                <div>
                  <span className="text-sm">{i.email}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {i.role} · expires {new Date(i.expires_at).toLocaleDateString()}
                  </span>
                </div>
                <button
                  onClick={() => handleRevokeInvitation(i.id)}
                  className="p-1 hover:bg-accent rounded"
                  title="Revoke invitation"
                >
                  <X className="h-3.5 w-3.5 text-red-500" />
                </button>
              </div>
            ))}
            {invitations.filter(i => !i.accepted_at && !i.revoked_at).length === 0 && (
              <div className="p-4 text-sm text-muted-foreground">No pending invitations.</div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
