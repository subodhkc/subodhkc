import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * PATCH /api/commercial/advisor-desk/questions/[questionId]
 * Advisor responds to a question or updates its status.
 *
 * Only platform admins can respond to questions.
 * Sets advisor_response, status, responded_at, responded_by.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ questionId: string }> }
) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { questionId } = await params

  const body = await req.json()
  const { status, advisorResponse, requestCategory, effortClass, recommendedNextStep, recommendedOfferKey } = body as {
    status?: 'under_review' | 'answered' | 'deeper_work_recommended' | 'closed'
    advisorResponse?: string
    requestCategory?: string
    effortClass?: 'BRIEF' | 'DEEPER_REVIEW' | 'SCOPED_WORK'
    recommendedNextStep?: string
    recommendedOfferKey?: string
  }

  if (!status && !advisorResponse && !requestCategory && !effortClass && !recommendedNextStep && !recommendedOfferKey) {
    return NextResponse.json({ error: 'at least one update field is required' }, { status: 400 })
  }

  const sc = createServiceClient()
  if (!sc) return NextResponse.json({ error: 'config' }, { status: 500 })

  // Verify the question exists
  const { data: question, error: fetchError } = await sc
    .from('advisor_questions')
    .select('id, organization_id, subject, status, submitted_by')
    .eq('id', questionId)
    .single()

  if (fetchError || !question) {
    return NextResponse.json({ error: 'question_not_found' }, { status: 404 })
  }

  // Only platform admins can respond
  const { data: userRoles } = await sc
    .from('platform_user_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('status', 'active')

  const isPlatformAdmin = (userRoles || []).some(r => r.role === 'admin' || r.role === 'super_admin')

  if (!isPlatformAdmin) {
    return NextResponse.json({ error: 'only_advisors_can_respond' }, { status: 403 })
  }

  // Build update payload
  const update: Record<string, unknown> = {}
  if (status) update.status = status
  if (advisorResponse) {
    update.advisor_response = advisorResponse
    update.status = status || 'answered'
    update.responded_at = new Date().toISOString()
    update.responded_by = user.id
  }
  if (requestCategory) update.request_category = requestCategory
  if (effortClass) update.effort_class = effortClass
  if (recommendedNextStep) update.recommended_next_step = recommendedNextStep
  if (recommendedOfferKey) update.recommended_offer_key = recommendedOfferKey

  const { data: updated, error: updateError } = await sc
    .from('advisor_questions')
    .update(update)
    .eq('id', questionId)
    .select('id, subject, question, status, advisor_response, responded_at, created_at, request_category, effort_class, recommended_next_step, recommended_offer_key')
    .single()

  if (updateError) {
    return NextResponse.json({ error: 'failed_to_update' }, { status: 500 })
  }

  // Audit event
  await sc.rpc('write_audit_event', {
    audit_action: 'advisor_question.answered',
    audit_entity_type: 'advisor_question',
    audit_org_id: question.organization_id,
    audit_actor_id: user.id,
    audit_entity_id: questionId,
    audit_metadata: {
      subject: question.subject,
      new_status: update.status,
    } as any,
  })

  // Send email notification to the submitter
  if (advisorResponse && question.submitted_by) {
    try {
      const { data: profile } = await sc
        .from('profiles')
        .select('email, display_name')
        .eq('id', question.submitted_by)
        .single()

      if (profile?.email) {
        const { sendAdvisorResponseEmail } = await import('@/lib/email')
        await sendAdvisorResponseEmail({
          to: profile.email,
          customerName: profile.display_name || undefined,
          subject: question.subject,
          response: advisorResponse,
        })
      }
    } catch (err) {
      console.error('Failed to send advisor response email:', err)
    }
  }

  return NextResponse.json({ question: updated })
}
