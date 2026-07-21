'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  const key = 'sk_analytics_session'
  let sid = sessionStorage.getItem(key)
  if (!sid) {
    sid = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
    sessionStorage.setItem(key, sid)
  }
  return sid
}

export function AnalyticsBeacon() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const startTime = useRef(Date.now())

  useEffect(() => {
    startTime.current = Date.now()

    const ref = searchParams.get('ref') || undefined
    const sessionId = getSessionId()

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'pageview',
        path: pathname,
        ref,
        sessionId,
      }),
    }).catch(() => {})
  }, [pathname, searchParams])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const duration = Math.round((Date.now() - startTime.current) / 1000)
        if (duration > 0) {
          const sessionId = getSessionId()
          fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'pageview',
              path: pathname,
              duration,
              sessionId,
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
