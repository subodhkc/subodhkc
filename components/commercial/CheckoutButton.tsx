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

  async function handleClick() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body || {}),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Failed to start checkout')
      }
    } catch {
      setError('Network error. Please try again.')
    }
    setLoading(false)
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
