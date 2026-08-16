import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, resolveOrganizationContext, AuthError } from '@/lib/auth/organization-resolver'
import { cancelSubscriptionAtPeriodEnd, getStripeSubscriptionId } from '@/lib/stripe/checkout'
import { createServiceClient } from '@/lib/supabase'
import { rateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/commercial/advisor-desk/cancel
 * Cancel the AI Advisor Desk subscription at period end.
 */
export async function POST(req: NextRequest) {
  const limited = rateLimit(req)
  if (limited) return limited

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

  // Update entitlement in database immediately so the system reflects
  // the pending cancellation even if the webhook is delayed or fails.
  const sc = createServiceClient()
  if (sc) {
    const periodEndIso = result.currentPeriodEnd
      ? new Date(result.currentPeriodEnd * 1000).toISOString()
      : null

    // Fetch offering id for ai_advisor_desk
    const { data: offering } = await sc
      .from('offerings')
      .select('id')
      .eq('offering_key', 'ai_advisor_desk')
      .single()

    if (offering) {
      // Fetch current source_metadata to merge
      const { data: ent } = await sc
        .from('organization_entitlements')
        .select('id, source_metadata')
        .eq('organization_id', ctx.organization.id)
        .eq('offering_id', offering.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (ent) {
        const existingMeta = (ent.source_metadata as Record<string, unknown>) || {}
        await sc
          .from('organization_entitlements')
          .update({
            source_metadata: {
              ...existingMeta,
              cancel_at_period_end: true,
              period_end: periodEndIso,
              cancellation_requested_at: new Date().toISOString(),
              cancellation_requested_by: user.id,
            },
            ...(periodEndIso ? { valid_until: periodEndIso } : {}),
          })
          .eq('id', ent.id)
      }
    }

    await sc.rpc('write_audit_event', {
      audit_action: 'commercial.subscription_cancellation_requested',
      audit_entity_type: 'subscription',
      audit_org_id: ctx.organization.id,
      audit_actor_id: user.id,
      audit_entity_id: subscriptionId,
      audit_metadata: {
        cancel_at_period_end: true,
        period_end: periodEndIso,
      } as any,
    })
  }

  return NextResponse.json({ success: true, message: 'Subscription will cancel at period end' })
}
