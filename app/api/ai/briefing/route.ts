import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/organization-resolver'
import { createServiceClient, getCurrentUser } from '@/lib/supabase'
import { prepareAdvisorContext, buildSystemPrompt } from '@/lib/ai/advisor-context'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_TOKENS_OUTPUT = 2000

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const body = await request.json()
  const { engagement_id, briefing_type = 'executive_update', context_type = 'internal' } = body

  if (!engagement_id) {
    return NextResponse.json({ error: 'missing_engagement_id' }, { status: 400 })
  }

  if (!['executive_update', 'engagement_impact', 'advisor_context'].includes(briefing_type)) {
    return NextResponse.json({ error: 'invalid_briefing_type' }, { status: 400 })
  }

  const authUser = await getAuthenticatedUser()
  if (!authUser) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const sc = createServiceClient()
  if (!sc) return NextResponse.json({ error: 'config' }, { status: 500 })

  // Verify access
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

    const isClientRole = participant?.responsibility === 'client_lead' || participant?.responsibility === 'executive_sponsor'
    const isOrgAdmin = membership?.role === 'admin' || membership?.role === 'owner'
    if (!isClientRole && !isOrgAdmin && !authUser.isPlatformAdmin) {
      return NextResponse.json({ error: 'client_context_access_denied' }, { status: 403 })
    }
  }

  // Check for existing recent briefing (within 24h) to avoid regeneration
  // Must filter by context_type to prevent internal briefings leaking to client requests
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { data: existing } = await sc
    .from('ai_briefings')
    .select('id, content, created_at, version')
    .eq('engagement_id', engagement_id)
    .eq('briefing_type', briefing_type)
    .eq('context_type', context_type)
    .gte('created_at', yesterday)
    .order('version', { ascending: false })
    .limit(1)

  if (existing && existing.length > 0) {
    return NextResponse.json({
      briefing: existing[0].content,
      metadata: {
        cached: true,
        created_at: existing[0].created_at,
        version: existing[0].version,
      },
    })
  }

  // Get next version number
  const { data: latest } = await sc
    .from('ai_briefings')
    .select('version')
    .eq('engagement_id', engagement_id)
    .eq('briefing_type', briefing_type)
    .order('version', { ascending: false })
    .limit(1)

  const nextVersion = (latest && latest.length > 0 ? latest[0].version : 0) + 1

  // Prepare context
  const context = await prepareAdvisorContext({
    engagementId: engagement_id,
    contextType: context_type as 'client' | 'internal',
    userId: user.id,
  })

  if (!context) {
    return NextResponse.json({ error: 'context_preparation_failed' }, { status: 500 })
  }

  const systemPrompt = buildSystemPrompt(context_type as 'client' | 'internal')

  const briefingInstructions: Record<string, string> = {
    executive_update: 'Generate a concise executive update briefing for this engagement. Include: 1) Overall status summary (2-3 sentences), 2) Key progress since last update, 3) Top risks or blockers requiring attention, 4) Recommended actions for the next 7 days. Format as a structured briefing suitable for an executive sponsor.',
    engagement_impact: 'Generate an engagement impact analysis. Include: 1) How current engagement outcomes align with industry AI trends, 2) Risk assessment of current trajectory, 3) Opportunities for acceleration, 4) Recommendations for outcome refinement. Use FrontOfAI signals if available.',
    advisor_context: 'Generate an advisor context summary for internal use. Include: 1) Engagement health assessment, 2) Decision velocity analysis (are decisions being made fast enough?), 3) Client engagement signals, 4) Recommended advisor interventions. Be candid about risks.',
  }

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

TASK:
${briefingInstructions[briefing_type]}`

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
    const content = aiData.choices?.[0]?.message?.content || ''
    const inputTokens = aiData.usage?.prompt_tokens || 0
    const outputTokens = aiData.usage?.completion_tokens || 0
    const latencyMs = Date.now() - startTime

    // Store the briefing
    const briefingContent = {
      text: content,
      generated_at: new Date().toISOString(),
      context_type,
      token_usage: { input: inputTokens, output: outputTokens },
    }

    const { data: inserted } = await sc
      .from('ai_briefings')
      .insert({
        engagement_id,
        briefing_type,
        context_type,
        content: briefingContent,
        source_snapshot_date: new Date().toISOString(),
        model_used: 'gpt-4o-2024-11-20',
        token_count: inputTokens + outputTokens,
        version: nextVersion,
        created_by: user.id,
      })
      .select('id, created_at')
      .single()

    // Log AI usage
    await sc.from('ai_usage_log').insert({
      user_id: user.id,
      engagement_id,
      request_type: 'generate_briefing',
      context_type,
      model_used: 'gpt-4o-2024-11-20',
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      latency_ms: latencyMs,
    })

    return NextResponse.json({
      briefing: briefingContent,
      metadata: {
        cached: false,
        created_at: inserted?.created_at || new Date().toISOString(),
        version: nextVersion,
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        latency_ms: latencyMs,
      },
    })
  } catch (err) {
    console.error('Briefing generation error:', err)
    return NextResponse.json({ error: 'ai_request_failed' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const engagementId = searchParams.get('engagement_id')
  const briefingType = searchParams.get('briefing_type') || 'executive_update'

  if (!engagementId) {
    return NextResponse.json({ error: 'missing_engagement_id' }, { status: 400 })
  }

  const sc = createServiceClient()
  if (!sc) return NextResponse.json({ error: 'config' }, { status: 500 })

  // Verify access
  const { data: engagement } = await sc
    .from('engagements')
    .select('organization_id')
    .eq('id', engagementId)
    .single()

  if (!engagement) return NextResponse.json({ error: 'engagement_not_found' }, { status: 404 })

  const authUser = await getAuthenticatedUser()
  if (!authUser) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

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

  const { data: briefings } = await sc
    .from('ai_briefings')
    .select('id, content, briefing_type, version, created_at, source_snapshot_date, token_count')
    .eq('engagement_id', engagementId)
    .eq('briefing_type', briefingType)
    .order('version', { ascending: false })
    .limit(10)

  return NextResponse.json({ briefings: briefings || [] })
}
