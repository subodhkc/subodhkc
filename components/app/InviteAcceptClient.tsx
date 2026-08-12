'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface InviteAcceptClientProps {
  token: string
  email: string
}

export function InviteAcceptClient({ token, email }: InviteAcceptClientProps) {
  const router = useRouter()
  const [accepting, setAccepting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleAccept() {
    setAccepting(true)
    setError('')
    try {
      const res = await fetch('/api/invite/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email }),
      })
      const data = await res.json()
      if (!res.ok) {
        const errorMessages: Record<string, string> = {
          invitation_invalid: 'This invitation is not valid.',
          invitation_already_accepted: 'This invitation has already been accepted.',
          invitation_revoked: 'This invitation has been revoked.',
          invitation_expired: 'This invitation has expired.',
          unauthenticated: 'You must be signed in to accept an invitation.',
          email_mismatch: 'This invitation was sent to a different email address. Sign in using the invited account or ask the administrator to resend the invitation.',
        }
        setError(errorMessages[data.error] || 'Failed to accept invitation')
      } else {
        setSuccess(true)
        setTimeout(() => router.push('/app'), 2000)
      }
    } catch {
      setError('Network error')
    }
    setAccepting(false)
  }

  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-2 max-w-sm">
          <h1 className="text-xl font-bold">Invalid Invitation</h1>
          <p className="text-sm text-muted-foreground">
            This invitation link is missing required parameters.
          </p>
          <a href="/app" className="text-sm text-primary hover:underline">Go to dashboard</a>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-bold text-green-600">Invitation Accepted!</h1>
          <p className="text-sm text-muted-foreground">Redirecting to your organizations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-sm">
        <h1 className="text-xl font-bold">Accept Invitation</h1>
        <p className="text-sm text-muted-foreground">
          You&apos;ve been invited to join an organization with email{' '}
          <strong>{email}</strong>
        </p>
        {error && <div className="bg-red-500/10 text-red-700 text-sm p-3 rounded">{error}</div>}
        <button
          onClick={handleAccept}
          disabled={accepting}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm disabled:opacity-50"
        >
          {accepting ? 'Accepting...' : 'Accept Invitation'}
        </button>
      </div>
    </div>
  )
}
