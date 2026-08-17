import { NextRequest, NextResponse } from 'next/server'
import { requirePlatformAdmin } from '@/lib/auth/organization-resolver'
import { getWorkOrder, splitWorkOrder } from '@/lib/commercial/work-orders'
import { trackEvent } from '@/lib/commercial/analytics'
import type { WorkType } from '@/lib/commercial/work-order-types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/work-orders/[workOrderId]/split
 * Advisor splits a Work Order into multiple child Work Orders.
 *
 * Body: { splits: Array<{ title, workType?, desiredOutcome?, scopeIncluded?, priceCents? }> }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ workOrderId: string }> }
) {
  try {
    const user = await requirePlatformAdmin()
    const { workOrderId } = await params
    const body = await req.json()
    const { splits } = body as {
      splits: Array<{
        title: string
        workType?: WorkType
        desiredOutcome?: string
        scopeIncluded?: string
        priceCents?: number
      }>
    }

    if (!splits || !Array.isArray(splits) || splits.length < 2) {
      return NextResponse.json({ error: 'At least 2 splits are required' }, { status: 400 })
    }

    const wo = await getWorkOrder(workOrderId)
    if (!wo) return NextResponse.json({ error: 'not_found' }, { status: 404 })

    const result = await splitWorkOrder({
      parentWorkOrderId: workOrderId,
      advisorUserId: user.id,
      splits,
    })

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    await trackEvent({
      eventName: 'work_order_split',
      organizationId: wo.organization_id,
      userId: user.id,
      offerKey: 'ai_automation_blueprint',
      metadata: { work_order_id: workOrderId, child_count: result.childWorkOrderIds.length },
    })

    return NextResponse.json({ success: true, childWorkOrderIds: result.childWorkOrderIds })
  } catch (err: any) {
    if (err?.code === 'UNAUTHORIZED' || err?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    console.error('[admin/wo-split] Error:', err)
    return NextResponse.json({ error: 'Failed to split Work Order' }, { status: 500 })
  }
}
