import { NextRequest, NextResponse } from 'next/server'
import { requirePlatformAdmin } from '@/lib/auth/organization-resolver'
import { getWorkOrder, requestClientInput } from '@/lib/commercial/work-orders'
import { trackEvent } from '@/lib/commercial/analytics'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/work-orders/[workOrderId]/request-input
 * Advisor requests client input on a Work Order.
 *
 * Body: { requestTitle: string, whatIsNeeded: string, whyItMatters?: string, dueDate?: string }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ workOrderId: string }> }
) {
  try {
    const user = await requirePlatformAdmin()
    const { workOrderId } = await params
    const body = await req.json()
    const { requestTitle, whatIsNeeded, whyItMatters, dueDate } = body as {
      requestTitle: string
      whatIsNeeded: string
      whyItMatters?: string
      dueDate?: string
    }

    if (!requestTitle || !whatIsNeeded) {
      return NextResponse.json({ error: 'requestTitle and whatIsNeeded are required' }, { status: 400 })
    }

    const wo = await getWorkOrder(workOrderId)
    if (!wo) return NextResponse.json({ error: 'not_found' }, { status: 404 })

    const result = await requestClientInput({
      workOrderId,
      advisorUserId: user.id,
      requestTitle,
      whatIsNeeded,
      whyItMatters,
      dueDate: dueDate || null,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    await trackEvent({
      eventName: 'work_order_client_input_requested',
      organizationId: wo.organization_id,
      userId: user.id,
      offerKey: 'ai_automation_blueprint',
      metadata: { work_order_id: workOrderId },
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    if (err?.code === 'UNAUTHORIZED' || err?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    console.error('[admin/wo-request-input] Error:', err)
    return NextResponse.json({ error: 'Failed to request client input' }, { status: 500 })
  }
}
