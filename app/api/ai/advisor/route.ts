import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/organization-resolver'
import { createServiceClient, getCurrentUser } from '@/lib/supabase'
import { prepareAdvisorContext, buildSystemPrompt } from '@/lib/ai/advisor-context'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_TOKENS_OUTPUT = 1000
const MAX_CONTEXT_TOKENS = 4000

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const body = await request.json()
  const { engagement_id, question, context_type = 'internal' } = body

  if (!engagement_id || !question) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
  }

  if (context_type !== 'client' && context_type !== 'internal') {
    return NextResponse.json({ error: 'invalid_context_type' }, { status: 400 })
  }

  if (question.length > 2000) {
    return NextResponse.json({ error: 'question_too_long' }, { status: 400 })
  }

  // Verify user has access to this engagement's org
  const authUser = await getAuthenticatedUser()
  if (!authUser) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const sc = createServiceClient()
  if (!sc) return NextResponse.json({ error: 'config' }, { status: 500 })

  const { data: engagement } = await sc
    .from('engagements')
    .select('organization_id')
    .eq('id', engagement_id)
    .single()

  if (!engagement) return NextResponse.json({ error: 'engagement_not_found' }, { status: 404 })

  const { data: membership } = await sc
    .from('organization_memberships')
    .select('role')
    .eq('organization_id', engagement.organization_id)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  if (!membership && !authUser.isPlatformAdmin) {
    return NextResponse.json({ error: 'access_denied' }, { status: 403 })
  }

  // For client context, verify user is not advisor-only
  if (context_type === 'client') {
    const { data: participant } = await sc
      .from('engagement_participants')
      .select('responsibility')
      .eq('engagement_id', engagement_id)
      .eq('user_id', user.id)
      .single()

    // Allow if user is client_lead, executive_sponsor, or org admin/owner
    const isClientRole = participant?.responsibility === 'client_lead' || participant?.responsibility === 'executive_sponsor'
    const isOrgAdmin = membership?.role === 'admin' || membership?.role === 'owner'
    if (!isClientRole && !isOrgAdmin && !authUser.isPlatformAdmin) {
      return NextResponse.json({ error: 'client_context_access_denied' }, { status: 403 })
    }
  }

  // Prepare context
  const context = await prepareAdvisorContext({
    engagementId: engagement_id,
    contextType: context_type,
    userId: user.id,
  })

  if (!context) {
    return NextResponse.json({ error: 'context_preparation_failed' }, { status: 500 })
  }

  if (context.tokenEstimate > MAX_CONTEXT_TOKENS) {
    return NextResponse.json({ error: 'context_too_large', token_estimate: context.tokenEstimate }, { status: 400 })
  }

  const systemPrompt = buildSystemPrompt(context_type)
  const userPrompt = `ENGAGEMENT CONTEXT:
${context.engagementSummary}

OPEN DECISIONS:
${context.openDecisions}

UPCOMING MILESTONES:
${context.upcomingMilestones}

ACTIVE ACTIONS:
${context.activeActions}

RECENT UPDATES:
${context.recentUpdates}

ARTIFACTS:
${context.artifacts}

RISKS & BLOCKERS:
${context.risks}
${context.frontofaiSignals ? `\nFRONTOFAI SIGNALS:\n${context.frontofaiSignals}` : ''}

QUESTION:
${question}`

  const startTime = Date.now()

  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set')
    return NextResponse.json({ error: 'ai_service_unavailable' }, { status: 503 })
  }

  try {
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-2024-11-20',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: MAX_TOKENS_OUTPUT,
        temperature: 0.3,
      }),
    })

    if (!openaiResponse.ok) {
      const errText = await openaiResponse.text()
      console.error('OpenAI API error:', openaiResponse.status, errText)
      return NextResponse.json({ error: 'ai_request_failed' }, { status: 502 })
    }

    const aiData = await openaiResponse.json()
    const answer = aiData.choices?.[0]?.message?.content || 'No response generated.'
    const inputTokens = aiData.usage?.prompt_tokens || 0
    const outputTokens = aiData.usage?.completion_tokens || 0
    const latencyMs = Date.now() - startTime

    // Log AI usage for cost observability
    await sc.from('ai_usage_log').insert({
      user_id: user.id,
      engagement_id,
      request_type: 'ask_advisor',
      context_type,
      model_used: 'gpt-4o-2024-11-20',
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      latency_ms: latencyMs,
    })

    return NextResponse.json({
      answer,
      metadata: {
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        latency_ms: latencyMs,
        context_type,
        context_token_estimate: context.tokenEstimate,
      },
    })
  } catch (err) {
    console.error('AI advisor error:', err)
    return NextResponse.json({ error: 'ai_request_failed' }, { status: 500 })
  }
}
