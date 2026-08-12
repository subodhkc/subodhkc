'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export function GuardianInviteClient({
  token,
  invitationEmail,
  authEmail,
  emailMatches,
}: {
  token: string
  invitationEmail: string
  authEmail: string
  emailMatches: boolean
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleClaim() {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/family/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })

      const result = await res.json()

      if (!res.ok) {
        const errorMap: Record<string, string> = {
          email_mismatch: 'The email address you signed in with doesn\'t match the invitation. Please sign in with the email that received the invitation.',
          invitation_revoked: 'This invitation has been revoked.',
          invitation_expired: 'This invitation has expired.',
          already_accepted: 'This invitation has already been accepted.',
          guardian_not_found: 'Guardian record not found. Please contact your school administrator.',
        }
        setError(errorMap[result.error] || 'Could not accept invitation. Please try again.')
        setLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        window.location.href = '/family'
      }, 2000)
    } catch {
      setError('Something went wrong. Please try again.')
    }

    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-sky-50 to-background">
        <div className="max-w-sm text-center space-y-4">
          <Image
            src="/wilshire/mascot-owl.svg"
            alt=""
            width={100}
            height={100}
            className="mx-auto drop-shadow-lg"
          />
          <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto" />
          <h1 className="text-xl font-bold text-blue-950">Access Activated</h1>
          <p className="text-sm text-blue-800/70">
            Your family pickup access is now active. Redirecting you to the family portal...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-b from-sky-50 to-background">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-3">
          <Image
            src="/wilshire/logo-badge.svg"
            alt="Wilshire Elementary"
            width={56}
            height={56}
            className="mx-auto"
          />
          <h1 className="text-2xl font-bold text-blue-950">Family Pickup Access</h1>
          <p className="text-sm text-blue-800/70">
            You&apos;ve been invited to access pickup information for your child at Wilshire Elementary.
          </p>
        </div>

        {!emailMatches && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-700 space-y-1">
                <p className="font-medium">Email Mismatch</p>
                <p>
                  You signed in as <strong>{authEmail}</strong> but the invitation was sent to{' '}
                  <strong>{invitationEmail}</strong>.
                </p>
                <p>
                  Please sign out and sign in with the email that received the invitation.
                </p>
              </div>
            </div>
            <a
              href="/login?context=family"
              className="block text-center text-sm text-amber-700 underline"
            >
              Sign in with a different account
            </a>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {emailMatches && (
          <div className="space-y-4">
            <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-4 text-sm text-blue-800">
              <p>You&apos;re signed in as:</p>
              <p className="font-bold text-blue-950 mt-1">{authEmail}</p>
            </div>

            <button
              onClick={handleClaim}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-lg shadow-blue-200"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Activate Family Access
            </button>
          </div>
        )}

        <div className="border-t border-blue-100 pt-4 text-center">
          <p className="text-xs text-blue-700/60">
            By activating access, you agree to the{' '}
            <a href="/terms" className="underline hover:text-blue-900 font-medium">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="underline hover:text-blue-900 font-medium">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
