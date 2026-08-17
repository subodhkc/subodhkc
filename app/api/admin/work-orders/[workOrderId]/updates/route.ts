import { NextRequest, NextResponse } from 'next/server'
import { requirePlatformAdmin } from '@/lib/auth/organization-resolver'
import { getWorkOrder, addAdvisorUpdate } from '@/lib/commercial/work-orders'
import { trackEvent } from '@/lib/commercial/analytics'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/work-orders/[workOrderId]/updates
 * Advisor publishes an update or internal note on a Work Order.
 *
 * Body: { body: string, isClientVisible: boolean, updateType?: string }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ workOrderId: string }> }
) {
  try {
    const user = await requirePlatformAdmin()
    const { workOrderId } = await params
    const body = await req.json()
    const { body: updateBody, isClientVisible, updateType } = body as {
      body: string
      isClientVisible: boolean
      updateType?: string
    }

    if (!updateBody || updateBody.trim().length === 0) {
      return NextResponse.json({ error: 'body is required' }, { status: 400 })
    }

    const wo = await getWorkOrder(workOrderId)
    if (!wo) return NextResponse.json({ error: 'not_found' }, { status: 404 })

    const result = await addAdvisorUpdate({
      workOrderId,
      authorUserId: user.id,
      body: updateBody.trim(),
      isClientVisible: isClientVisible !== false,
      updateType: updateType as any,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    await trackEvent({
      eventName: 'work_order_update_published',
      organizationId: wo.organization_id,
      userId: user.id,
      offerKey: 'ai_automation_blueprint',
      metadata: { work_order_id: workOrderId, is_client_visible: isClientVisible },
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    if (err?.code === 'UNAUTHORIZED' || err?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    console.error('[admin/wo-updates] Error:', err)
    return NextResponse.json({ error: 'Failed to add update' }, { status: 500 })
  }
}
