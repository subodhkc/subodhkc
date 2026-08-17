import { NextRequest, NextResponse } from 'next/server'
import { requirePlatformAdmin } from '@/lib/auth/organization-resolver'
import { getWorkOrder, composeWorkOrderScope } from '@/lib/commercial/work-orders'
import { trackEvent } from '@/lib/commercial/analytics'
import type { WorkType } from '@/lib/commercial/work-order-types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * PATCH /api/admin/work-orders/[workOrderId]/scope
 * Advisor composes/edits Work Order scope and optionally sends to client.
 *
 * Body: {
 *   scopeTitle?, scopeIncluded?, scopeExcluded?, requiredInputs?,
 *   deliverableDescription?, desiredOutcome?, workType?, targetTiming?,
 *   priceCents?, sendToClient?: boolean
 * }
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ workOrderId: string }> }
) {
  try {
    const user = await requirePlatformAdmin()
    const { workOrderId } = await params
    const body = await req.json()

    const {
      scopeTitle,
      scopeIncluded,
      scopeExcluded,
      requiredInputs,
      deliverableDescription,
      desiredOutcome,
      workType,
      targetTiming,
      priceCents,
      sendToClient,
    } = body as {
      scopeTitle?: string
      scopeIncluded?: string
      scopeExcluded?: string
      requiredInputs?: string
      deliverableDescription?: string
      desiredOutcome?: string
      workType?: WorkType
      targetTiming?: string
      priceCents?: number
      sendToClient?: boolean
    }

    const wo = await getWorkOrder(workOrderId)
    if (!wo) return NextResponse.json({ error: 'not_found' }, { status: 404 })

    const result = await composeWorkOrderScope({
      workOrderId,
      advisorUserId: user.id,
      scopeTitle,
      scopeIncluded,
      scopeExcluded,
      requiredInputs,
      deliverableDescription,
      desiredOutcome,
      workType,
      targetTiming,
      priceCents,
      sendToClient: sendToClient || false,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    await trackEvent({
      eventName: sendToClient ? 'work_order_scope_sent' : 'work_order_scope_draft_saved',
      organizationId: wo.organization_id,
      userId: user.id,
      offerKey: 'ai_automation_blueprint',
      metadata: { work_order_id: workOrderId },
    })

    return NextResponse.json({ success: true, workOrder: result.workOrder })
  } catch (err: any) {
    if (err?.code === 'UNAUTHORIZED' || err?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    console.error('[admin/wo-scope] Error:', err)
    return NextResponse.json({ error: 'Failed to compose scope' }, { status: 500 })
  }
}
