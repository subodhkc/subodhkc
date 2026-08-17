'use client'

import { useCallback } from 'react'

/**
 * Tracks advisor funnel events from the client side.
 * Non-blocking, privacy-conscious.
 */
export function useAdvisorAnalytics() {
  const track = useCallback(async (eventName: string, metadata?: Record<string, unknown>) => {
    try {
      await fetch('/api/commercial/advisor-desk/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventName, metadata }),
      })
    } catch {
      // Non-blocking
    }
  }, [])

  return { track }
}
