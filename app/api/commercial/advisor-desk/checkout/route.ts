import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/organization-resolver'
import { createSubscriptionCheckout } from '@/lib/stripe/checkout'
import { getOffer, type OfferKey } from '@/lib/commercial/offers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser()

  const body = await req.json()
  const { period } = body as { period?: 'monthly' | 'annual' }

  if (!period || !['monthly', 'annual'].includes(period)) {
    return NextResponse.json({ error: 'Invalid billing period' }, { status: 400 })
  }

  const offerKey: OfferKey = 'ai_advisor_desk'
  const offer = getOffer(offerKey)
  if (!offer) {
    return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://subodhkc.com'
  const successUrl = `${siteUrl}/app?checkout=success&offer=${offerKey}`
  const cancelUrl = `${siteUrl}${offer.landingPage}?checkout=cancelled`

  const result = await createSubscriptionCheckout({
    offerKey,
    period,
    successUrl,
    cancelUrl,
    customerEmail: user?.email ?? undefined,
    metadata: user ? { user_id: user.id } : {},
  })

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  return NextResponse.json({ url: result.url, sessionId: result.sessionId })
}
