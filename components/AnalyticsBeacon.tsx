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

    const ref = searchParams.get('ref') || (document.referrer && document.referrer !== window.location.href ? document.referrer : undefined)
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
              type: 'engagement',
              path: pathname,
              duration,
              sessionId,
            }),
          }).catch(() => {})
        }
      }
    }

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-track-click]') as HTMLElement | null
      if (!target) return
      const sessionId = getSessionId()
      const label = target.dataset.trackClick || target.textContent?.slice(0, 80) || 'unknown'
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'click',
          path: pathname,
          sessionId,
          meta: { label },
        }),
      }).catch(() => {})
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    document.addEventListener('click', handleClick, true)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('click', handleClick, true)
    }
  }, [pathname])

  return null
}
