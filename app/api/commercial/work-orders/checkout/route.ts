import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/organization-resolver'
import { getWorkOrder } from '@/lib/commercial/work-orders'
import { createOneTimeCheckout } from '@/lib/stripe/checkout'
import { trackEvent } from '@/lib/commercial/analytics'
import {
  authorizeWorkOrderCheckout,
  sanitizeWorkOrderCheckoutMetadata,
} from '@/lib/commercial/work-order-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/commercial/work-orders/checkout
 * Create a Stripe checkout session for an existing Work Order that is
 * ready_for_checkout.
 *
 * Section A: this route and the legacy /api/commercial/blueprint/checkout
 * route share the same canonical authorization logic
 * (`authorizeWorkOrderCheckout`). The legacy route remains as a
 * compatibility wrapper for the public intake flow.
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

  // Resolve the organization id from the slug (server-side, no client trust)
  const { createServiceClient } = await import('@/lib/supabase')
  const sc = createServiceClient()
  if (!sc) return NextResponse.json({ error: 'service_unavailable' }, { status: 500 })

  const { data: org, error: orgError } = await sc
    .from('organizations')
    .select('id, slug, status')
    .eq('slug', orgSlug)
    .single()

  if (orgError || !org) {
    return NextResponse.json({ error: 'organization_not_found' }, { status: 404 })
  }

  // Canonical authorization — single rule set shared with the legacy path
  const auth = await authorizeWorkOrderCheckout({
    user,
    organizationId: org.id,
    workOrderId,
  })

  if ('code' in auth) {
    return NextResponse.json(
      { error: auth.code, message: auth.message },
      { status: auth.status }
    )
  }

  const wo = auth.workOrder

  // Idempotent: if a checkout session already exists and is still usable,
  // return it instead of creating a new one.
  if (wo.stripe_checkout_session_id) {
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

  const metadata = sanitizeWorkOrderCheckoutMetadata({
    work_order_id: workOrderId,
    work_order_number: wo.work_order_number,
    organization_id: auth.organizationId,
    user_id: auth.purchaserUserId,
    offer_key: 'ai_automation_blueprint',
  })

  const result = await createOneTimeCheckout({
    offerKey: 'ai_automation_blueprint',
    successUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://subodhkc.com'}/app/${orgSlug}/work-orders/${workOrderId}?status=paid`,
    cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://subodhkc.com'}/app/${orgSlug}/work-orders/${workOrderId}?status=cancelled`,
    customerEmail: user.email || undefined,
    metadata,
  })

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  // Link the checkout session and transition to payment_pending via the
  // validated RPC.
  const { linkCheckoutSession } = await import('@/lib/commercial/work-orders')
  await linkCheckoutSession(workOrderId, result.sessionId)

  await trackEvent({
    eventName: 'work_order_checkout_started',
    organizationId: auth.organizationId,
    userId: auth.purchaserUserId,
    offerKey: 'ai_automation_blueprint',
    metadata: { work_order_id: workOrderId, checkout_session_id: result.sessionId },
  })

  return NextResponse.json({ url: result.url, sessionId: result.sessionId })
}
