import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, resolveOrganizationContext, AuthError } from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'
import { getOffer, getCurrentBillingPeriodKey } from '@/lib/commercial/offers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/commercial/advisor-desk/questions?orgSlug=<slug>
 * Returns advisor questions for the organization.
 */
export async function GET(req: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const orgSlug = searchParams.get('orgSlug')
  if (!orgSlug) return NextResponse.json({ error: 'orgSlug required' }, { status: 400 })

  let ctx
  try {
    ctx = await resolveOrganizationContext(user, orgSlug)
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.code }, { status: 403 })
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  const sc = createServiceClient()
  if (!sc) return NextResponse.json({ error: 'config' }, { status: 500 })

  const { data: questions } = await sc
    .from('advisor_questions')
    .select('id, subject, question, status, advisor_response, billing_period_key, created_at, responded_at')
    .eq('organization_id', ctx.organization.id)
    .order('created_at', { ascending: false })

  // Check current period allowance
  const currentPeriod = getCurrentBillingPeriodKey()
  const offer = getOffer('ai_advisor_desk')
  const allowance = offer?.advisorQuestionsPerPeriod ?? 0

  const currentPeriodQuestions = (questions || []).filter(
    q => q.billing_period_key === currentPeriod && q.status !== 'closed'
  )

  return NextResponse.json({
    questions: questions || [],
    currentPeriod,
    allowance,
    remaining: Math.max(0, allowance - currentPeriodQuestions.length),
  })
}

/**
 * POST /api/commercial/advisor-desk/questions
 * Submit a new advisor question (enforces monthly allowance).
 */
export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json()
  const { orgSlug, subject, question, context } = body as {
    orgSlug: string
    subject: string
    question: string
    context?: Record<string, unknown>
  }

  if (!orgSlug || !subject || !question) {
    return NextResponse.json({ error: 'orgSlug, subject, and question are required' }, { status: 400 })
  }

  let ctx
  try {
    ctx = await resolveOrganizationContext(user, orgSlug)
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.code }, { status: 403 })
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  // Verify entitlement for ai_advisor_desk
  const hasEntitlement = ctx.entitlements.some(
    e => e.offering_key === 'ai_advisor_desk' && e.effective_status === 'active'
  )
  if (!hasEntitlement && !ctx.isPlatformAdmin) {
    return NextResponse.json({ error: 'entitlement_missing' }, { status: 403 })
  }

  const sc = createServiceClient()
  if (!sc) return NextResponse.json({ error: 'config' }, { status: 500 })

  // Check monthly allowance
  const currentPeriod = getCurrentBillingPeriodKey()
  const offer = getOffer('ai_advisor_desk')
  const allowance = offer?.advisorQuestionsPerPeriod ?? 0

  const { data: existingQuestions } = await sc
    .from('advisor_questions')
    .select('id')
    .eq('organization_id', ctx.organization.id)
    .eq('billing_period_key', currentPeriod)
    .neq('status', 'closed')

  const usedCount = existingQuestions?.length ?? 0
  if (usedCount >= allowance && !ctx.isPlatformAdmin) {
    return NextResponse.json({
      error: 'allowance_exceeded',
      message: `You have used all ${allowance} advisor questions for ${currentPeriod}.`,
      currentPeriod,
      allowance,
    }, { status: 429 })
  }

  // Insert question
  const { data: newQuestion, error } = await sc
    .from('advisor_questions')
    .insert({
      organization_id: ctx.organization.id,
      submitted_by: user.id,
      billing_period_key: currentPeriod,
      subject,
      question,
      context: context ?? null,
      status: 'submitted',
    })
    .select('id, subject, question, status, billing_period_key, created_at')
    .single()

  if (error) {
    return NextResponse.json({ error: 'failed_to_submit' }, { status: 500 })
  }

  // Audit event
  await sc.rpc('write_audit_event', {
    audit_action: 'advisor_question.submitted',
    audit_entity_type: 'advisor_question',
    audit_org_id: ctx.organization.id,
    audit_actor_id: user.id,
    audit_entity_id: newQuestion.id,
    audit_metadata: { subject, billing_period: currentPeriod } as any,
  })

  return NextResponse.json({
    question: newQuestion,
    remaining: Math.max(0, allowance - usedCount - 1),
  })
}
