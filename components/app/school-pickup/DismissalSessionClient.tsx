'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Play, Square, XCircle, Clock, CheckCircle2, Calendar, AlertCircle, Loader2, ScanLine, ListChecks } from 'lucide-react'
import type { SchoolContext } from '@/lib/auth/school-resolver'

interface DismissalSessionClientProps {
  ctx: SchoolContext
}

interface Session {
  id: string
  service_date: string
  status: 'scheduled' | 'open' | 'closed' | 'cancelled'
  opened_at: string | null
  closed_at: string | null
  auto_started: boolean
  cancelled_at: string | null
  cancel_reason: string | null
}

export function DismissalSessionClient({ ctx }: DismissalSessionClientProps) {
  const apiBase = `/api/school-pickup/${ctx.organization.organization.slug}/${ctx.site.slug}`

  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchSessions = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${apiBase}/sessions`)
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setSessions(data.sessions || [])
    } catch {
      setError('Failed to load sessions')
    } finally {
      setLoading(false)
    }
  }, [apiBase])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  const today = new Date().toISOString().split('T')[0]
  const todaySession = sessions.find(s => s.service_date === today)
  const activeSession = sessions.find(s => s.status === 'open')
  const recentSessions = sessions.slice(0, 7)

  // Auto-ensure active session for authorized users (lazy creation)
  const [autoEnsureAttempted, setAutoEnsureAttempted] = useState(false)
  useEffect(() => {
    if (!loading && !activeSession && ctx.canIssueCredentials && !autoEnsureAttempted) {
      setAutoEnsureAttempted(true)
      ;(async () => {
        try {
          const res = await fetch(`${apiBase}/sessions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'ensure_active' }),
          })
          if (res.ok) {
            fetchSessions()
          }
        } catch {
          // Silent failure - manual open still available
        }
      })()
    }
  }, [loading, activeSession, ctx.canIssueCredentials, autoEnsureAttempted, apiBase, fetchSessions])

  async function handleOpenSession() {
    setActionLoading('open')
    setError(null)
    try {
      const res = await fetch(`${apiBase}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'open' }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to open session')
        return
      }
      fetchSessions()
    } catch {
      setError('Network error')
    } finally {
      setActionLoading(null)
    }
  }

  async function handleCloseSession(sessionId: string) {
    if (!confirm('Close this dismissal session? No further check-ins will be accepted.')) return
    setActionLoading(`close-${sessionId}`)
    setError(null)
    try {
      const res = await fetch(`${apiBase}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'close', session_id: sessionId }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to close session')
        return
      }
      fetchSessions()
    } catch {
      setError('Network error')
    } finally {
      setActionLoading(null)
    }
  }

  async function handleCancelSession(sessionId: string) {
    if (!confirm('Cancel this dismissal session? This cannot be undone.')) return
    setActionLoading(`cancel-${sessionId}`)
    setError(null)
    try {
      const res = await fetch(`${apiBase}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel', session_id: sessionId }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to cancel session')
        return
      }
      fetchSessions()
    } catch {
      setError('Network error')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading sessions...
      </div>
    )
  }

  const canManage = ctx.canIssueCredentials

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Dismissal Sessions</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Open a session to begin check-in scanning for today.
        </p>
      </div>

      {error && (
        <div className="border border-destructive/50 rounded-lg p-3 text-sm text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Active session banner */}
      {activeSession && (
        <div className="border-2 border-accent rounded-lg p-4 sm:p-6 bg-accent/5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-accent animate-pulse" />
              <div>
                <div className="font-semibold">Session Active</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(activeSession.service_date).toLocaleDateString('en-US', {
                    weekday: 'long', month: 'short', day: 'numeric'
                  })}
                  {activeSession.opened_at && (
                    <> - Opened {new Date(activeSession.opened_at).toLocaleTimeString('en-US', {
                      hour: 'numeric', minute: '2-digit'
                    })}</>
                  )}
                </div>
              </div>
            </div>
            {canManage && (
              <div className="flex gap-2">
                <Link
                  href={`${apiBase.replace('/api/school-pickup', '/app')}/scanner`}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90"
                >
                  <ScanLine className="h-4 w-4" />
                  Start Scanning
                </Link>
                <Link
                  href={`${apiBase.replace('/api/school-pickup', '/app')}/queue`}
                  className="flex items-center gap-1.5 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-accent/50"
                >
                  <ListChecks className="h-4 w-4" />
                  View Queue
                </Link>
                <button
                  onClick={() => handleCloseSession(activeSession.id)}
                  disabled={actionLoading === `close-${activeSession.id}`}
                  className="flex items-center gap-1.5 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-accent/50 disabled:opacity-50"
                >
                  <Square className="h-4 w-4" />
                  {actionLoading === `close-${activeSession.id}` ? 'Closing...' : 'Close Session'}
                </button>
                <button
                  onClick={() => handleCancelSession(activeSession.id)}
                  disabled={actionLoading === `cancel-${activeSession.id}`}
                  className="flex items-center gap-1.5 px-3 py-2 border border-destructive/30 text-destructive rounded-lg text-sm hover:bg-destructive/5 disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4" />
                  {actionLoading === `cancel-${activeSession.id}` ? 'Cancelling...' : 'Cancel'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* No active session - show open button */}
      {!activeSession && canManage && (
        <div className="border rounded-lg p-4 sm:p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="font-medium">
                {todaySession?.status === 'closed'
                  ? 'Today\'s session is closed'
                  : todaySession?.status === 'cancelled'
                  ? 'Today\'s session was cancelled'
                  : 'No active session'}
              </div>
              <div className="text-sm text-muted-foreground">
                {todaySession?.status === 'closed' || todaySession?.status === 'cancelled'
                  ? 'Open a new session to resume check-ins.'
                  : `Open a session for ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`}
              </div>
            </div>
          </div>
          <button
            onClick={handleOpenSession}
            disabled={actionLoading === 'open'}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            <Play className="h-4 w-4" />
            {actionLoading === 'open' ? 'Opening...' : 'Open Dismissal Session'}
          </button>
        </div>
      )}

      {/* Session history */}
      {recentSessions.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b bg-muted/50">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Recent Sessions
            </h3>
          </div>
          <div className="divide-y">
            {recentSessions.map(session => (
              <div key={session.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <SessionStatusIcon status={session.status} />
                  <div>
                    <div className="text-sm font-medium">
                      {new Date(session.service_date).toLocaleDateString('en-US', {
                        weekday: 'short', month: 'short', day: 'numeric'
                      })}
                    </div>
                    {session.opened_at && (
                      <div className="text-xs text-muted-foreground">
                        Opened {new Date(session.opened_at).toLocaleTimeString('en-US', {
                          hour: 'numeric', minute: '2-digit'
                        })}
                        {session.closed_at && (
                          <> - Closed {new Date(session.closed_at).toLocaleTimeString('en-US', {
                            hour: 'numeric', minute: '2-digit'
                          })}</>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded ${statusBadgeClass(session.status)}`}>
                  {session.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {recentSessions.length === 0 && !activeSession && (
        <div className="border rounded-lg p-8 text-center">
          <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <div className="font-medium">No sessions yet</div>
          <p className="text-sm text-muted-foreground mt-1">
            Open your first dismissal session to start scanning QR codes.
          </p>
        </div>
      )}
    </div>
  )
}

function SessionStatusIcon({ status }: { status: Session['status'] }) {
  switch (status) {
    case 'open':
      return <div className="h-2.5 w-2.5 rounded-full bg-accent animate-pulse" />
    case 'closed':
      return <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
    case 'cancelled':
      return <XCircle className="h-4 w-4 text-destructive" />
    case 'scheduled':
      return <Clock className="h-4 w-4 text-muted-foreground" />
    default:
      return null
  }
}

function statusBadgeClass(status: Session['status']) {
  switch (status) {
    case 'open':
      return 'bg-accent/20 text-accent'
    case 'closed':
      return 'bg-muted text-muted-foreground'
    case 'cancelled':
      return 'bg-destructive/10 text-destructive'
    case 'scheduled':
      return 'bg-primary/10 text-primary'
    default:
      return 'bg-muted text-muted-foreground'
  }
}
