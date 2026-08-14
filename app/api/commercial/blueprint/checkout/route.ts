import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/organization-resolver'
import { createOneTimeCheckout } from '@/lib/stripe/checkout'
import { getOffer, type OfferKey } from '@/lib/commercial/offers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser()

  const body = await req.json()
  const { qualificationResponses } = body as { qualificationResponses?: Record<string, string> }

  // Qualification is required for Blueprint
  if (!qualificationResponses || Object.keys(qualificationResponses).length === 0) {
    return NextResponse.json({ error: 'Qualification responses required' }, { status: 400 })
  }

  const offerKey: OfferKey = 'ai_automation_blueprint'
  const offer = getOffer(offerKey)
  if (!offer) {
    return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://subodhkc.com'
  const successUrl = `${siteUrl}/app?checkout=success&offer=${offerKey}`
  const cancelUrl = `${siteUrl}${offer.landingPage}?checkout=cancelled`

  const result = await createOneTimeCheckout({
    offerKey,
    successUrl,
    cancelUrl,
    customerEmail: user?.email ?? undefined,
    metadata: {
      ...(user ? { user_id: user.id } : {}),
      qualification: JSON.stringify(qualificationResponses),
    },
  })

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  return NextResponse.json({ url: result.url, sessionId: result.sessionId })
}
