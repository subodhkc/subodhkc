import { NextRequest, NextResponse } from 'next/server'
import { requirePlatformAdmin } from '@/lib/auth/organization-resolver'
import { getWorkOrder, publishDeliverable } from '@/lib/commercial/work-orders'
import { trackEvent } from '@/lib/commercial/analytics'
import type { ArtifactType } from '@/lib/commercial/work-order-types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/work-orders/[workOrderId]/deliverables
 * Advisor publishes a deliverable/artifact for a Work Order.
 *
 * Body: {
 *   title: string, description?: string, artifactType: ArtifactType,
 *   artifactUrl?: string, artifactMetadata?: object,
 *   isClientVisible?: boolean, markDelivered?: boolean
 * }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ workOrderId: string }> }
) {
  try {
    const user = await requirePlatformAdmin()
    const { workOrderId } = await params
    const body = await req.json()
    const {
      title,
      description,
      artifactType,
      artifactUrl,
      artifactMetadata,
      isClientVisible,
      markDelivered,
    } = body as {
      title: string
      description?: string
      artifactType: ArtifactType
      artifactUrl?: string
      artifactMetadata?: Record<string, unknown>
      isClientVisible?: boolean
      markDelivered?: boolean
    }

    if (!title || !artifactType) {
      return NextResponse.json({ error: 'title and artifactType are required' }, { status: 400 })
    }

    const wo = await getWorkOrder(workOrderId)
    if (!wo) return NextResponse.json({ error: 'not_found' }, { status: 404 })

    const result = await publishDeliverable({
      workOrderId,
      advisorUserId: user.id,
      title,
      description,
      artifactType,
      artifactUrl,
      artifactMetadata,
      isClientVisible,
      markDelivered,
    })

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    await trackEvent({
      eventName: 'work_order_artifact_published',
      organizationId: wo.organization_id,
      userId: user.id,
      offerKey: 'ai_automation_blueprint',
      metadata: { work_order_id: workOrderId, artifact_type: artifactType },
    })

    return NextResponse.json({ success: true, deliverableId: result.deliverableId })
  } catch (err: any) {
    if (err?.code === 'UNAUTHORIZED' || err?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    console.error('[admin/wo-deliverables] Error:', err)
    return NextResponse.json({ error: 'Failed to publish deliverable' }, { status: 500 })
  }
}
