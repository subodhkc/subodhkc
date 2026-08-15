'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import { Loader2, Mail } from 'lucide-react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function getSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) return null
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

export function GoogleSignInButton({ next }: { next?: string }) {
  const [loading, setLoading] = useState(false)

  function handleGoogleLogin() {
    const supabase = getSupabase()
    if (!supabase) return
    setLoading(true)

    const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : '/app'
    const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeNext)}`

    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl,
      },
    })
  }

  return (
    <Button onClick={handleGoogleLogin} disabled={loading} variant="outline" className="w-full gap-2">
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      )}
      Continue with Google
    </Button>
  )
}

export function MagicLinkForm({ next = '/dashboard' }: { next?: string }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    const supabase = getSupabase()
    if (!supabase) {
      setError('Authentication not configured')
      return
    }
    setLoading(true)
    setError('')

    const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : '/app'
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeNext)}`,
      },
    })

    if (signInError) {
      setError(signInError.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Check your email for a magic link to sign in.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleMagicLink} className="space-y-3">
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" disabled={loading} variant="outline" className="w-full gap-2">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Send magic link
      </Button>
    </form>
  )
}
