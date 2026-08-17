import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, resolveOrganizationContext, AuthError } from '@/lib/auth/organization-resolver'
import { getWorkOrder, transitionWorkOrderStatus } from '@/lib/commercial/work-orders'
import { trackEvent } from '@/lib/commercial/analytics'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/commercial/work-orders/[workOrderId]/complete
 * Customer marks a delivered Work Order as completed.
 *
 * Body: { orgSlug }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ workOrderId: string }> }
) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { workOrderId } = await params
  const body = await req.json()
  const { orgSlug } = body as { orgSlug: string }

  if (!orgSlug) {
    return NextResponse.json({ error: 'orgSlug required' }, { status: 400 })
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

  // Only allow completion from 'delivered' status
  if (wo.status !== 'delivered') {
    return NextResponse.json({ error: 'work_order_not_delivered', message: `Status is ${wo.status}, must be delivered` }, { status: 400 })
  }

  const result = await transitionWorkOrderStatus(
    workOrderId,
    'completed',
    'client',
    user.id,
    'Customer marked as complete'
  )

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  await trackEvent({
    eventName: 'work_order_completed',
    organizationId: ctx.organization.id,
    userId: user.id,
    offerKey: 'ai_automation_blueprint',
    metadata: { work_order_id: workOrderId, work_order_number: wo.work_order_number },
  })

  return NextResponse.json({ success: true })
}
