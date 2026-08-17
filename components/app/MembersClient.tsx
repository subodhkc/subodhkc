'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2, UserPlus, X, Send, Check, Clock, Sparkles } from 'lucide-react'
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

interface AccessRequest {
  id: string
  status: string
  requested_role: string
  created_at: string
  reviewed_at: string | null
  reviewer_notes: string | null
  user_id: string
  profiles: { email: string; display_name: string | null; avatar_url: string | null }
}

interface AdvisorSeat {
  user_id: string
  email: string
  display_name: string
}

interface MembersClientProps {
  user: AuthenticatedUser
  ctx: OrganizationContext
  members: Member[]
  invitations: Invitation[]
  accessRequests: AccessRequest[]
  advisorSeats: AdvisorSeat[]
}

const ADVISOR_SEAT_LIMIT = 3

export function MembersClient({ user, ctx, members, invitations, accessRequests, advisorSeats }: MembersClientProps) {
  const router = useRouter()
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')
  const [inviting, setInviting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [advisorSeatUserIds, setAdvisorSeatUserIds] = useState<Set<string>>(
    () => new Set(advisorSeats.map((s) => s.user_id))
  )
  const [seatActionLoading, setSeatActionLoading] = useState<string | null>(null)

  const isOwner = ctx.organizationRole === 'owner' || ctx.isPlatformAdmin
  const basePath = `/app/${ctx.organization.slug}`

  const seatsUsed = advisorSeatUserIds.size
  const seatsAvailable = Math.max(0, ADVISOR_SEAT_LIMIT - seatsUsed)
  const seatsFull = seatsUsed >= ADVISOR_SEAT_LIMIT

  async function handleAssignAdvisor(memberUserId: string) {
    setSeatActionLoading(memberUserId)
    setError('')
    setSuccess('')
    try {
      const res = await fetch(`/api/org/${ctx.organization.id}/advisor-seats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: memberUserId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to assign Advisor access')
      } else {
        setAdvisorSeatUserIds((prev) => new Set(prev).add(memberUserId))
        setSuccess('Advisor access assigned')
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch {
      setError('Network error')
    } finally {
      setSeatActionLoading(null)
    }
  }

  async function handleRemoveAdvisor(memberUserId: string) {
    if (!confirm('Remove Advisor access from this member?')) return
    setSeatActionLoading(memberUserId)
    setError('')
    setSuccess('')
    try {
      const res = await fetch(`/api/org/${ctx.organization.id}/advisor-seats`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: memberUserId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to remove Advisor access')
      } else {
        setAdvisorSeatUserIds((prev) => {
          const next = new Set(prev)
          next.delete(memberUserId)
          return next
        })
        setSuccess('Advisor access removed')
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch {
      setError('Network error')
    } finally {
      setSeatActionLoading(null)
    }
  }

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

  async function handleResendInvitation(invitationId: string) {
    setActionLoading(invitationId)
    setError('')
    try {
      const res = await fetch(`/api/org/${ctx.organization.id}/invitations/${invitationId}/resend`, {
        method: 'POST',
      })
      if (res.ok) {
        setSuccess('Invitation resent')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError('Failed to resend invitation')
      }
    } catch {
      setError('Network error')
    } finally {
      setActionLoading(null)
    }
  }

  async function handleRoleChange(memberUserId: string, newRole: string) {
    setActionLoading(memberUserId)
    setError('')
    try {
      const res = await fetch(`/api/org/${ctx.organization.id}/members/${memberUserId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })
      if (res.ok) {
        router.refresh()
      } else {
        const data = await res.json()
        if (data.error === 'last_owner_protection') {
          setError('Cannot change the last owner\'s role. Assign another owner first.')
        } else {
          setError('Failed to change role')
        }
      }
    } catch {
      setError('Network error')
    } finally {
      setActionLoading(null)
    }
  }

  async function handleApproveRequest(requestId: string) {
    setActionLoading(requestId)
    setError('')
    try {
      const res = await fetch('/api/join-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: requestId, action: 'approve' }),
      })
      if (res.ok) {
        setSuccess('Access request approved')
        setTimeout(() => setSuccess(''), 3000)
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error === 'cannot_approve_own_request' ? 'You cannot approve your own request.' : 'Failed to approve request')
      }
    } catch {
      setError('Network error')
    } finally {
      setActionLoading(null)
    }
  }

  async function handleRejectRequest(requestId: string) {
    setActionLoading(requestId)
    setError('')
    try {
      const res = await fetch('/api/join-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: requestId, action: 'reject' }),
      })
      if (res.ok) {
        setSuccess('Access request rejected')
        setTimeout(() => setSuccess(''), 3000)
        router.refresh()
      } else {
        setError('Failed to reject request')
      }
    } catch {
      setError('Network error')
    } finally {
      setActionLoading(null)
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
                  <select
                    value={m.role}
                    onChange={(e) => handleRoleChange(m.user_id, e.target.value)}
                    disabled={m.user_id === user.id || !isOwner || actionLoading === m.user_id}
                    className={`text-xs px-2 py-0.5 rounded border-none bg-transparent ${
                      m.role === 'owner' ? 'text-purple-700 font-medium' :
                      m.role === 'admin' ? 'text-blue-700 font-medium' :
                      'text-gray-700'
                    }`}
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                    {isOwner && <option value="owner">Owner</option>}
                  </select>
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
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleResendInvitation(i.id)}
                    disabled={actionLoading === i.id}
                    className="p-1 hover:bg-accent rounded"
                    title="Resend invitation"
                  >
                    <Send className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => handleRevokeInvitation(i.id)}
                    className="p-1 hover:bg-accent rounded"
                    title="Revoke invitation"
                  >
                    <X className="h-3.5 w-3.5 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
            {invitations.filter(i => !i.accepted_at && !i.revoked_at).length === 0 && (
              <div className="p-4 text-sm text-muted-foreground">No pending invitations.</div>
            )}
          </div>
        </section>

        {/* Access Requests */}
        {accessRequests.length > 0 && (
          <section className="mt-6">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Access Requests
            </h2>
            <div className="border rounded-lg divide-y">
              {accessRequests.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{r.profiles.display_name || r.profiles.email}</span>
                      <span className="text-xs text-muted-foreground">{r.profiles.email}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Requested {r.requested_role} · {new Date(r.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  {r.status === 'pending' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApproveRequest(r.id)}
                        disabled={actionLoading === r.id}
                        className="flex items-center gap-1 px-2.5 py-1 bg-primary text-primary-foreground rounded text-xs font-medium hover:bg-primary/90 disabled:opacity-50"
                      >
                        <Check className="h-3 w-3" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectRequest(r.id)}
                        disabled={actionLoading === r.id}
                        className="flex items-center gap-1 px-2.5 py-1 border rounded text-xs hover:bg-accent disabled:opacity-50"
                      >
                        <X className="h-3 w-3" />
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      r.status === 'approved' ? 'bg-green-500/10 text-green-700' :
                      'bg-red-500/10 text-red-700'
                    }`}>
                      {r.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* AI Advisor Access */}
        <section className="mt-6">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI Advisor Access
          </h2>
          <div className="border rounded-lg p-4 mb-3 bg-muted/30">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {seatsUsed} of {ADVISOR_SEAT_LIMIT} seats used
              </span>
              <span className={`text-xs px-2 py-0.5 rounded ${
                seatsFull ? 'bg-red-500/10 text-red-700' : 'bg-green-500/10 text-green-700'
              }`}>
                {seatsFull ? 'Full — no seats available' : `${seatsAvailable} seat${seatsAvailable === 1 ? '' : 's'} available`}
              </span>
            </div>
          </div>
          <div className="border rounded-lg divide-y">
            {members.filter((m) => m.status === 'active').map((m) => {
              const hasAdvisor = advisorSeatUserIds.has(m.user_id)
              return (
                <div key={m.id} className="flex items-center justify-between p-3">
                  <div>
                    <span className="text-sm font-medium">{m.display_name || m.email}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{m.email}</span>
                    {hasAdvisor && (
                      <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                        Advisor
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {hasAdvisor ? (
                      <button
                        onClick={() => handleRemoveAdvisor(m.user_id)}
                        disabled={!isOwner || seatActionLoading === m.user_id}
                        className="px-2.5 py-1 border border-red-500/30 text-red-600 rounded text-xs font-medium hover:bg-red-500/10 disabled:opacity-50"
                      >
                        {seatActionLoading === m.user_id ? 'Removing...' : 'Remove Advisor Access'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAssignAdvisor(m.user_id)}
                        disabled={!isOwner || seatsFull || seatActionLoading === m.user_id}
                        className="px-2.5 py-1 bg-primary text-primary-foreground rounded text-xs font-medium hover:bg-primary/90 disabled:opacity-50"
                      >
                        {seatActionLoading === m.user_id ? 'Assigning...' : 'Assign Advisor Access'}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
            {members.filter((m) => m.status === 'active').length === 0 && (
              <div className="p-4 text-sm text-muted-foreground">No active members to assign.</div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
