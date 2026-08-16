import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getAuthenticatedUser } from '@/lib/auth/organization-resolver'
import { rateLimit } from '@/lib/rate-limit'
import { trackEvent, type ConversionEventName } from '@/lib/commercial/analytics'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * POST /api/analytics/track
 * Track a conversion event from the client side.
 * Body: { eventName, offerKey?, pagePath?, metadata? }
 */
export async function POST(request: NextRequest) {
  const limited = rateLimit(request)
  if (limited) return limited

  try {
    const user = await getAuthenticatedUser()

    const body = await request.json()
    const { eventName, offerKey, pagePath, metadata } = body

    if (!eventName) {
      return NextResponse.json({ error: 'Missing eventName' }, { status: 400 })
    }

    // Validate event name is in the allowed list
    const allowedEvents: ConversionEventName[] = [
      'public_offer_viewed', 'pricing_viewed', 'checkout_started',
      'checkout_completed', 'checkout_abandoned', 'onboarding_started',
      'onboarding_completed', 'included_product_activation_started',
      'included_product_activated', 'advisor_request_created',
      'advisor_response_delivered', 'fractional_desk_item_created',
      'working_session_completed', 'artifact_published',
      'monthly_brief_published', 'subscription_cancelled',
    ]

    if (!allowedEvents.includes(eventName)) {
      return NextResponse.json({ error: 'Invalid event name' }, { status: 400 })
    }

    // Non-blocking track
    await trackEvent({
      eventName,
      userId: user?.id,
      offerKey,
      pagePath,
      metadata,
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    // Non-blocking — don't fail the user flow for analytics
    return NextResponse.json({ success: true })
  }
}
