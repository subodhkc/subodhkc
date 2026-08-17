import { NextRequest, NextResponse } from 'next/server'
import { requirePlatformAdmin } from '@/lib/auth/organization-resolver'
import { getWorkOrder, transitionWorkOrderStatus } from '@/lib/commercial/work-orders'
import { trackEvent } from '@/lib/commercial/analytics'
import type { WorkOrderStatus } from '@/lib/commercial/work-order-types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * PATCH /api/admin/work-orders/[workOrderId]/status
 * Advisor transitions Work Order status (start work, move to review, deliver, complete, etc.)
 *
 * Body: { status: WorkOrderStatus, note?: string }
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ workOrderId: string }> }
) {
  try {
    const user = await requirePlatformAdmin()
    const { workOrderId } = await params
    const body = await req.json()
    const { status, note } = body as { status: WorkOrderStatus; note?: string }

    if (!status) {
      return NextResponse.json({ error: 'status is required' }, { status: 400 })
    }

    const wo = await getWorkOrder(workOrderId)
    if (!wo) return NextResponse.json({ error: 'not_found' }, { status: 404 })

    const result = await transitionWorkOrderStatus(
      workOrderId,
      status,
      'advisor',
      user.id,
      note
    )

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    await trackEvent({
      eventName: 'work_order_status_changed',
      organizationId: wo.organization_id,
      userId: user.id,
      offerKey: 'ai_automation_blueprint',
      metadata: { work_order_id: workOrderId, new_status: status, previous_status: wo.status },
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    if (err?.code === 'UNAUTHORIZED' || err?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    console.error('[admin/wo-status] Error:', err)
    return NextResponse.json({ error: 'Failed to transition status' }, { status: 500 })
  }
}
