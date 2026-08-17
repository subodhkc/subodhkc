import { NextRequest, NextResponse } from 'next/server'
import { requirePlatformAdmin } from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'
import { createWorkOrderFromQuestion } from '@/lib/commercial/work-orders'
import { trackEvent } from '@/lib/commercial/analytics'
import type { WorkType } from '@/lib/commercial/work-order-types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/advisor-questions/[questionId]/recommend-work-order
 * Advisor escalates a question to a Work Order.
 * Pre-populates a Work Order draft from the question without charging.
 *
 * Body: { suggestedWorkType?: WorkType, suggestedOutcome?: string }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ questionId: string }> }
) {
  try {
    const user = await requirePlatformAdmin()
    const { questionId } = await params
    const body = await req.json()
    const { suggestedWorkType, suggestedOutcome } = body as {
      suggestedWorkType?: WorkType
      suggestedOutcome?: string
    }

    const sc = createServiceClient()
    if (!sc) return NextResponse.json({ error: 'config' }, { status: 500 })

    // Fetch the question
    const { data: question, error } = await sc
      .from('advisor_questions')
      .select('id, organization_id, submitted_by, subject, question, context, status')
      .eq('id', questionId)
      .single()

    if (error || !question) {
      return NextResponse.json({ error: 'question_not_found' }, { status: 404 })
    }

    // Create Work Order from question
    const result = await createWorkOrderFromQuestion({
      organizationId: question.organization_id,
      requestedByUserId: question.submitted_by,
      questionId: question.id,
      questionSubject: question.subject,
      questionBody: question.question,
      questionContext: (question.context as Record<string, unknown> | null) || undefined,
      suggestedWorkType,
      suggestedOutcome,
    })

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // Update question status to deeper_work_recommended
    await sc
      .from('advisor_questions')
      .update({
        status: 'deeper_work_recommended',
        recommended_next_step: 'AI Work Order',
        recommended_offer_key: 'ai_automation_blueprint',
        responded_at: new Date().toISOString(),
        responded_by: user.id,
      })
      .eq('id', questionId)

    // Audit event
    await sc.rpc('write_audit_event', {
      audit_action: 'advisor_question.work_order_recommended',
      audit_entity_type: 'advisor_question',
      audit_org_id: question.organization_id,
      audit_actor_id: user.id,
      audit_entity_id: questionId,
      audit_metadata: {
        work_order_id: result.workOrderId,
        work_order_number: result.workOrderNumber,
      } as any,
    })

    await trackEvent({
      eventName: 'advisor_question_work_order_recommended',
      organizationId: question.organization_id,
      userId: user.id,
      offerKey: 'ai_advisor_desk',
      metadata: { question_id: questionId, work_order_id: result.workOrderId },
    })

    return NextResponse.json({
      success: true,
      workOrderId: result.workOrderId,
      workOrderNumber: result.workOrderNumber,
    })
  } catch (err: any) {
    if (err?.code === 'UNAUTHORIZED' || err?.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    console.error('[admin/question-escalate] Error:', err)
    return NextResponse.json({ error: 'Failed to escalate question to Work Order' }, { status: 500 })
  }
}
