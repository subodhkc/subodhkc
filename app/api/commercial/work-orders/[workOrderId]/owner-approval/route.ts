import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, resolveOrganizationContext, AuthError } from '@/lib/auth/organization-resolver'
import { getWorkOrder, approveWorkOrderByOwner, declineWorkOrderByOwner } from '@/lib/commercial/work-orders'
import { trackEvent } from '@/lib/commercial/analytics'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/commercial/work-orders/[workOrderId]/owner-approval
 * Organization owner/admin approves or declines a Work Order request from a member.
 *
 * Body: { orgSlug, action: 'approve' | 'decline', reason?: string }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ workOrderId: string }> }
) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { workOrderId } = await params
  const body = await req.json()
  const { orgSlug, action, reason } = body as {
    orgSlug: string
    action: 'approve' | 'decline'
    reason?: string
  }

  if (!orgSlug || !action) {
    return NextResponse.json({ error: 'orgSlug and action are required' }, { status: 400 })
  }

  if (action !== 'approve' && action !== 'decline') {
    return NextResponse.json({ error: 'action must be approve or decline' }, { status: 400 })
  }

  let ctx
  try {
    ctx = await resolveOrganizationContext(user, orgSlug)
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.code }, { status: 403 })
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  // Only owner/admin can approve
  if (ctx.organizationRole !== 'owner' && ctx.organizationRole !== 'admin' && !ctx.isPlatformAdmin) {
    return NextResponse.json({ error: 'only_org_owner_admin_can_approve' }, { status: 403 })
  }

  const wo = await getWorkOrder(workOrderId)
  if (!wo || (wo.organization_id !== ctx.organization.id && !ctx.isPlatformAdmin)) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  if (wo.status !== 'awaiting_owner_approval') {
    return NextResponse.json({ error: 'work_order_not_awaiting_approval' }, { status: 400 })
  }

  if (action === 'approve') {
    const result = await approveWorkOrderByOwner({ workOrderId, ownerUserId: user.id })
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    await trackEvent({
      eventName: 'work_order_owner_approval_requested',
      organizationId: ctx.organization.id,
      userId: user.id,
      offerKey: 'ai_automation_blueprint',
      metadata: { work_order_id: workOrderId, action: 'approved' },
    })

    return NextResponse.json({ success: true, action: 'approved' })
  } else {
    const result = await declineWorkOrderByOwner({ workOrderId, ownerUserId: user.id, reason })
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    await trackEvent({
      eventName: 'work_order_owner_approval_requested',
      organizationId: ctx.organization.id,
      userId: user.id,
      offerKey: 'ai_automation_blueprint',
      metadata: { work_order_id: workOrderId, action: 'declined' },
    })

    return NextResponse.json({ success: true, action: 'declined' })
  }
}
