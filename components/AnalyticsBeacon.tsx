'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function AnalyticsBeacon() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const startTime = useRef(Date.now())
  const hasTracked = useRef(false)

  useEffect(() => {
    if (hasTracked.current) return
    hasTracked.current = true

    const ref = searchParams.get('ref') || undefined

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'pageview',
        path: pathname,
        ref,
      }),
    }).catch(() => {})
  }, [pathname, searchParams])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const duration = Math.round((Date.now() - startTime.current) / 1000)
        if (duration > 0) {
          fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'pageview',
              path: pathname,
              duration,
            }),
          }).catch(() => {})
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [pathname])

  return null
}
