'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { CheckCircle2, Clock, AlertCircle, ArrowRight } from 'lucide-react'

interface CheckoutSuccessClientProps {
  status: 'success' | 'pending' | 'error'
  offerName: string
  workspaceUrl: string
  message: string
}

export default function CheckoutSuccessClient({
  status,
  offerName,
  workspaceUrl,
  message,
}: CheckoutSuccessClientProps) {
  const autoRedirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (status === 'success' && workspaceUrl) {
      // Auto-redirect to workspace after 3 seconds
      autoRedirectTimer.current = setTimeout(() => {
        window.location.href = workspaceUrl
      }, 3000)
    }
    return () => {
      if (autoRedirectTimer.current) clearTimeout(autoRedirectTimer.current)
    }
  }, [status, workspaceUrl])

  const icon =
    status === 'success' ? <CheckCircle2 className="h-12 w-12 text-green-500" /> :
    status === 'pending' ? <Clock className="h-12 w-12 text-amber-500" /> :
    <AlertCircle className="h-12 w-12 text-red-500" />

  const title =
    status === 'success' ? 'You are in.' :
    status === 'pending' ? 'Payment received.' :
    'Something went wrong.'

  const subtitle =
    status === 'success' && offerName
      ? `Your ${offerName} relationship is active.`
      : status === 'pending' && offerName
      ? `Your ${offerName} purchase is being confirmed.`
      : ''

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">{icon}</div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>

        {message && (
          <p className="text-sm text-muted-foreground bg-secondary/30 rounded-lg p-4">{message}</p>
        )}

        {status === 'success' && (
          <p className="text-xs text-muted-foreground">
            Redirecting to your workspace automatically...
          </p>
        )}

        <div className="flex flex-col gap-3 pt-4">
          {workspaceUrl && status !== 'error' && (
            <Link
              href={workspaceUrl}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Go to Workspace
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
