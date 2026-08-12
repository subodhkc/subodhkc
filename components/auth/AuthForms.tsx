'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Mail } from 'lucide-react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function MagicLinkForm({ next = '/dashboard' }: { next?: string }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    if (!supabaseUrl || !anonKey) {
      setError('Authentication not configured')
      return
    }
    setLoading(true)
    setError('')

    const redirectUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`

    try {
      const res = await fetch(`${supabaseUrl}/auth/v1/magiclink`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': anonKey,
        },
        body: JSON.stringify({ email, redirect_to: redirectUrl }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.msg || data.message || 'Failed to send magic link')
      }

      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
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
