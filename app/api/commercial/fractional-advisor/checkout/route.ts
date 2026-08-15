import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/organization-resolver'
import { createSubscriptionCheckout } from '@/lib/stripe/checkout'
import { getOffer, type OfferKey } from '@/lib/commercial/offers'
import { validateOrganizationForPurchase, hasActiveEntitlement } from '@/lib/commercial/purchase-auth'
import { rateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const limited = rateLimit(req)
  if (limited) return limited

  const user = await getAuthenticatedUser()
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const body = await req.json()
  const { period, organizationId } = body as {
    period?: 'monthly' | 'annual'
    organizationId?: string
  }

  if (!period || !['monthly', 'annual'].includes(period)) {
    return NextResponse.json({ error: 'Invalid billing period' }, { status: 400 })
  }

  if (!organizationId || typeof organizationId !== 'string') {
    return NextResponse.json(
      { error: 'organization_required', message: 'Organization selection is required' },
      { status: 400 }
    )
  }

  const offerKey: OfferKey = 'fractional_ai_advisor'
  const offer = getOffer(offerKey)
  if (!offer) {
    return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
  }

  // Validate organization membership and authority
  const orgValidation = await validateOrganizationForPurchase(user, organizationId)
  if ('code' in orgValidation) {
    return NextResponse.json(
      { error: orgValidation.code, message: orgValidation.message },
      { status: orgValidation.status }
    )
  }

  const { organization } = orgValidation

  // Check for existing active subscription (duplicate protection)
  const alreadyActive = await hasActiveEntitlement(organization.id, offerKey)
  if (alreadyActive) {
    return NextResponse.json(
      {
        error: 'already_active',
        message: 'This organization already has an active Fractional AI Advisor subscription.',
        workspaceUrl: `/app/${organization.slug}/advisory`,
      },
      { status: 409 }
    )
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://subodhkc.com'
  const successUrl = `${siteUrl}/app/${organization.slug}/advisory?checkout=success&offer=${offerKey}`
  const cancelUrl = `${siteUrl}${offer.landingPage}?checkout=cancelled`

  const result = await createSubscriptionCheckout({
    offerKey,
    period,
    successUrl,
    cancelUrl,
    customerEmail: user.email ?? undefined,
    metadata: {
      user_id: user.id,
      organization_id: organization.id,
    },
  })

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  return NextResponse.json({ url: result.url, sessionId: result.sessionId })
}
