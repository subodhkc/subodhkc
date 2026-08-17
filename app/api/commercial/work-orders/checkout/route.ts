import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, resolveOrganizationContext, AuthError } from '@/lib/auth/organization-resolver'
import { getWorkOrder, linkCheckoutSession } from '@/lib/commercial/work-orders'
import { createOneTimeCheckout } from '@/lib/stripe/checkout'
import { trackEvent } from '@/lib/commercial/analytics'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/commercial/work-orders/checkout
 * Create a Stripe checkout session for an existing Work Order that is ready_for_checkout.
 *
 * Body: { orgSlug, workOrderId }
 */
export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json()
  const { orgSlug, workOrderId } = body as { orgSlug: string; workOrderId: string }

  if (!orgSlug || !workOrderId) {
    return NextResponse.json({ error: 'orgSlug and workOrderId required' }, { status: 400 })
  }

  let ctx
  try {
    ctx = await resolveOrganizationContext(user, orgSlug)
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.code }, { status: 403 })
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  const wo = await getWorkOrder(workOrderId)
  if (!wo || (wo.organization_id !== ctx.organization.id && !ctx.isPlatformAdmin)) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  // Only allow checkout for work orders in the right status
  if (!['ready_for_checkout', 'awaiting_approval', 'payment_pending'].includes(wo.status)) {
    return NextResponse.json({ error: 'work_order_not_ready_for_checkout', message: `Status is ${wo.status}` }, { status: 400 })
  }

  // If already has a checkout session, return it
  if (wo.stripe_checkout_session_id) {
    // Retrieve the existing session URL
    try {
      const { getStripe } = await import('@/lib/stripe/client')
      const stripe = getStripe()
      if (stripe) {
        const session = await stripe.checkout.sessions.retrieve(wo.stripe_checkout_session_id)
        if (session.url && session.status !== 'expired') {
          return NextResponse.json({ url: session.url, sessionId: session.id })
        }
      }
    } catch {
      // Fall through to create a new session
    }
  }

  const result = await createOneTimeCheckout({
    offerKey: 'ai_automation_blueprint',
    successUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://subodhkc.com'}/app/${orgSlug}/work-orders/${workOrderId}?status=paid`,
    cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://subodhkc.com'}/app/${orgSlug}/work-orders/${workOrderId}?status=cancelled`,
    customerEmail: user.email || undefined,
    metadata: {
      work_order_id: workOrderId,
      work_order_number: wo.work_order_number,
      organization_id: ctx.organization.id,
    },
  })

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  await linkCheckoutSession(workOrderId, result.sessionId)

  await trackEvent({
    eventName: 'work_order_checkout_started',
    organizationId: ctx.organization.id,
    userId: user.id,
    offerKey: 'ai_automation_blueprint',
    metadata: { work_order_id: workOrderId, checkout_session_id: result.sessionId },
  })

  return NextResponse.json({ url: result.url, sessionId: result.sessionId })
}
