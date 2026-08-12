'use client'

import { useState, useEffect } from 'react'
import { LogOut, Clock, UserPlus } from 'lucide-react'
import type { AuthenticatedUser } from '@/lib/auth/organization-resolver'

interface NoAccessClientProps {
  user: AuthenticatedUser
  wilshireOrgId?: string
  wilshireOrgName?: string
}

export function NoAccessClient({ user, wilshireOrgId, wilshireOrgName }: NoAccessClientProps) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [pendingRequest, setPendingRequest] = useState<{ id: string; created_at: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkExisting() {
      try {
        const res = await fetch('/api/join-requests')
        if (res.ok) {
          const data = await res.json()
          const pending = data.requests?.find((r: any) => r.status === 'pending')
          if (pending) {
            setPendingRequest({ id: pending.id, created_at: pending.created_at })
          }
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    checkExisting()
  }, [])

  async function handleRequestAccess() {
    if (!wilshireOrgId) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/join-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organization_id: wilshireOrgId, requested_role: 'member' }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.error === 'request_already_pending') {
          setError('You already have a pending access request.')
        } else if (data.error === 'already_member') {
          setError('You are already a member of this organization.')
        } else {
          setError('Failed to submit request. Please try again.')
        }
      } else {
        setSuccess(true)
        setPendingRequest({ id: data.request_id, created_at: new Date().toISOString() })
      }
    } catch {
      setError('Network error. Please try again.')
    }
    setSubmitting(false)
  }

  async function handleLogout() {
    await fetch('/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-br from-background to-muted/30">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <a href="/" className="inline-block">
            <span className="text-xl font-bold tracking-tight">SubodhKC</span>
          </a>
          <h1 className="text-2xl font-bold">No Access Yet</h1>
          <p className="text-sm text-muted-foreground">
            You don&apos;t currently have access to {wilshireOrgName || 'Wilshire'} School Pickup.
          </p>
        </div>

        {pendingRequest ? (
          <div className="border rounded-lg p-6 bg-muted/30 text-center space-y-3">
            <Clock className="h-8 w-8 text-muted-foreground mx-auto" />
            <div>
              <p className="font-medium text-sm">Access Request Pending</p>
              <p className="text-xs text-muted-foreground mt-1">
                Submitted {new Date(pendingRequest.created_at).toLocaleDateString()}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              An administrator will review your request. You&apos;ll be able to access the workspace once approved.
            </p>
          </div>
        ) : success ? (
          <div className="border rounded-lg p-6 bg-green-50 text-center space-y-3">
            <UserPlus className="h-8 w-8 text-green-600 mx-auto" />
            <p className="font-medium text-sm text-green-900">Request Submitted</p>
            <p className="text-xs text-muted-foreground">
              Your access request has been sent. You&apos;ll be notified when it&apos;s reviewed.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {wilshireOrgId && (
              <div className="border rounded-lg p-6 space-y-3">
                <p className="text-sm text-muted-foreground">
                  Request access to {wilshireOrgName || 'Wilshire'} School Pickup. An administrator will review and approve your request.
                </p>
                <button
                  onClick={handleRequestAccess}
                  disabled={submitting}
                  className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Request Access'}
                </button>
              </div>
            )}
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Already invited? Sign in with the email that received the invitation.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm rounded-lg px-4 py-3 text-center">
            {error}
          </div>
        )}

        <div className="border-t pt-4 space-y-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground border rounded-lg"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
          <p className="text-xs text-center text-muted-foreground">
            By using this service, you agree to the{' '}
            <a href="/terms" className="underline hover:text-foreground">Terms</a>
            {' '}and{' '}
            <a href="/privacy" className="underline hover:text-foreground">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
