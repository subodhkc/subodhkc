import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, resolveOrganizationContext, AuthError } from '@/lib/auth/organization-resolver'
import { cancelSubscriptionAtPeriodEnd, getStripeSubscriptionId } from '@/lib/stripe/checkout'
import { createServiceClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/commercial/advisor-desk/cancel
 * Cancel the AI Advisor Desk subscription at period end.
 */
export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json()
  const { orgSlug } = body as { orgSlug: string }
  if (!orgSlug) return NextResponse.json({ error: 'orgSlug required' }, { status: 400 })

  let ctx
  try {
    ctx = await resolveOrganizationContext(user, orgSlug)
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.code }, { status: 403 })
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  // Only org admins/owners can cancel
  if (!ctx.isPlatformAdmin && ctx.organizationRole !== 'owner' && ctx.organizationRole !== 'admin') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
  }

  const subscriptionId = await getStripeSubscriptionId(ctx.organization.id, 'ai_advisor_desk')
  if (!subscriptionId) {
    return NextResponse.json({ error: 'no_active_subscription' }, { status: 404 })
  }

  const result = await cancelSubscriptionAtPeriodEnd(subscriptionId)
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  // Audit event
  const sc = createServiceClient()
  if (sc) {
    await sc.rpc('write_audit_event', {
      audit_action: 'commercial.subscription_cancellation_requested',
      audit_entity_type: 'subscription',
      audit_org_id: ctx.organization.id,
      audit_actor_id: user.id,
      audit_entity_id: subscriptionId,
      audit_metadata: {} as any,
    })
  }

  return NextResponse.json({ success: true, message: 'Subscription will cancel at period end' })
}
