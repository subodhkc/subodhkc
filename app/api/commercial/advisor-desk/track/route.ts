import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/organization-resolver'
import { trackEvent, type ConversionEventName } from '@/lib/commercial/analytics'
import { rateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/commercial/advisor-desk/track
 * Track a client-side advisor funnel event.
 * Body: { eventName, metadata? }
 */
export async function POST(req: NextRequest) {
  const limited = rateLimit(req)
  if (limited) return limited

  const user = await getAuthenticatedUser()

  const body = await req.json()
  const { eventName, metadata } = body as {
    eventName: ConversionEventName
    metadata?: Record<string, unknown>
  }

  if (!eventName) return NextResponse.json({ error: 'eventName required' }, { status: 400 })

  await trackEvent({
    eventName,
    userId: user?.id,
    offerKey: 'ai_advisor_desk',
    pagePath: typeof window !== 'undefined' ? window.location.pathname : undefined,
    metadata,
  })

  return NextResponse.json({ ok: true })
}
