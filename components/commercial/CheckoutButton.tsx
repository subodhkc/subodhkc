'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Loader2 } from 'lucide-react'

interface CheckoutButtonProps {
  apiEndpoint: string
  body?: Record<string, unknown>
  text: string
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm' | 'lg'
  className?: string
  showArrow?: boolean
}

export function CheckoutButton({
  apiEndpoint,
  body,
  text,
  variant = 'default',
  size = 'lg',
  className,
  showArrow = true,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [needsAuth, setNeedsAuth] = useState(false)

  async function handleClick() {
    setLoading(true)
    setError(null)
    setNeedsAuth(false)
    try {
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body || {}),
      })
      if (res.status === 401) {
        setNeedsAuth(true)
        setLoading(false)
        return
      }
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || data.message || 'Failed to start checkout')
      }
    } catch {
      setError('Network error. Please try again.')
    }
    setLoading(false)
  }

  if (needsAuth) {
    return (
      <div className="inline-flex flex-col gap-2">
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
          <p className="font-medium mb-1">Sign in required.</p>
          <p className="text-xs text-muted-foreground mb-2">
            You need an account to proceed. This keeps your workspace and purchases secure.
          </p>
          <a
            href={`/login?next=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/')}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowRight className="h-4 w-4" />
            Sign In
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="inline-flex flex-col gap-1">
      <Button
        onClick={handleClick}
        disabled={loading}
        variant={variant}
        size={size}
        className={className}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {text}
        {showArrow && !loading && <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
      </Button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
