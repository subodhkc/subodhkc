import { NextRequest, NextResponse } from 'next/server'
import { requirePlatformAdmin } from '@/lib/supabase'
import { createServiceClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST: Generate engagement impact addenda for all active engagements
// using the latest FrontOfAI brief. Platform admin only.
export async function POST(request: NextRequest) {
  const user = await requirePlatformAdmin()
  if (!user) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const sc = createServiceClient()
  if (!sc) return NextResponse.json({ error: 'config' }, { status: 500 })

  // Get latest FrontOfAI brief
  const { data: latestBrief } = await sc
    .from('frontofai_briefs')
    .select('id, brief_date, title, content')
    .order('brief_date', { ascending: false })
    .limit(1)
    .single()

  if (!latestBrief) {
    return NextResponse.json({ error: 'no_frontofai_brief_available' }, { status: 400 })
  }

  // Get all active engagements (not cancelled or completed)
  const { data: activeEngagements } = await sc
    .from('engagements')
    .select('id, organization_id, title, engagement_type, status, current_phase, health_status, statement')
    .neq('status', 'cancelled')
    .neq('status', 'completed')
    .order('updated_at', { ascending: false })

  if (!activeEngagements || activeEngagements.length === 0) {
    return NextResponse.json({ generated: 0, message: 'No active engagements found' })
  }

  // Check which engagements already have addenda for this brief
  const { data: existing } = await sc
    .from('engagement_impact_addenda')
    .select('engagement_id')
    .eq('frontofai_brief_id', latestBrief.id)

  const existingSet = new Set((existing || []).map(e => e.engagement_id))
  const toGenerate = activeEngagements.filter(e => !existingSet.has(e.id))

  if (toGenerate.length === 0) {
    return NextResponse.json({ generated: 0, message: 'All active engagements already have addenda for the latest brief', skipped: activeEngagements.length })
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'ai_service_unavailable' }, { status: 503 })
  }

  const results: Array<{ engagement_id: string; status: string }> = []
  const frontofaiContent = latestBrief.content as any
  const briefId = latestBrief.id
  const briefDate = latestBrief.brief_date
  const briefTitle = latestBrief.title
  const userId = user.id
  const svc = sc

  const MAX_ENGAGEMENTS = 20
  const CONCURRENCY = 3
  const batch = toGenerate.slice(0, MAX_ENGAGEMENTS)

  async function generateForEngagement(eng: { id: string; title: string | null; engagement_type: string; status: string; current_phase: string; health_status: string; statement: string | null }): Promise<{ engagement_id: string; status: string }> {
    const startTime = Date.now()

    const systemPrompt = `You are the SubodhKC Engagement Impact Analyzer. You analyze how external AI industry signals from FrontOfAI weekly briefs impact active client engagements.

RULES:
1. Analyze the FrontOfAI brief signals against the engagement context.
2. Identify specific impacts: risks, opportunities, acceleration vectors, and outcome adjustments.
3. Be specific - reference both the FrontOfAI signal and the engagement detail.
4. Output structured JSON with: impacted_outcomes (array), new_risks (array), acceleration_opportunities (array), recommended_adjustments (array), confidence (low/medium/high).
5. If the FrontOfAI brief has no relevant signals for this engagement, set confidence to "low" and note "no direct signals detected".`

    const userPrompt = `FRONTOFAI WEEKLY BRIEF (${briefDate}):
Title: ${briefTitle}
Content: ${JSON.stringify(frontofaiContent).slice(0, 3000)}

ENGAGEMENT:
Title: ${eng.title || 'Untitled'}
Type: ${eng.engagement_type}
Status: ${eng.status}
Phase: ${eng.current_phase}
Health: ${eng.health_status}
Statement: ${eng.statement || 'N/A'}

Analyze how the FrontOfAI signals impact this engagement. Output JSON only.`

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
          max_tokens: 1500,
          temperature: 0.3,
          response_format: { type: 'json_object' },
        }),
      })

      if (!openaiResponse.ok) {
        return { engagement_id: eng.id, status: 'failed' }
      }

      const aiData = await openaiResponse.json()
      const signalsText = aiData.choices?.[0]?.message?.content || '{}'
      const signals = JSON.parse(signalsText)
      const inputTokens = aiData.usage?.prompt_tokens || 0
      const outputTokens = aiData.usage?.completion_tokens || 0
      const latencyMs = Date.now() - startTime

      await svc.from('engagement_impact_addenda').insert({
        engagement_id: eng.id,
        frontofai_brief_id: briefId,
        signals,
        version: 1,
      })

      await svc.from('ai_usage_log').insert({
        user_id: userId,
        engagement_id: eng.id,
        request_type: 'generate_impact',
        context_type: 'internal',
        model_used: 'gpt-4o-2024-11-20',
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        latency_ms: latencyMs,
      })

      return { engagement_id: eng.id, status: 'generated' }
    } catch (err) {
      console.error(`Impact generation failed for engagement ${eng.id}:`, err)
      return { engagement_id: eng.id, status: 'failed' }
    }
  }

  for (let i = 0; i < batch.length; i += CONCURRENCY) {
    const chunk = batch.slice(i, i + CONCURRENCY)
    const chunkResults = await Promise.allSettled(chunk.map(generateForEngagement))
    for (const r of chunkResults) {
      if (r.status === 'fulfilled') {
        results.push(r.value)
      } else {
        results.push({ engagement_id: 'unknown', status: 'failed' })
      }
    }
  }

  const generated = results.filter(r => r.status === 'generated').length
  const failed = results.filter(r => r.status === 'failed').length

  return NextResponse.json({
    generated,
    failed,
    skipped: existingSet.size,
    capped: toGenerate.length > MAX_ENGAGEMENTS ? toGenerate.length - MAX_ENGAGEMENTS : 0,
    total_active: activeEngagements.length,
    frontofai_brief_date: briefDate,
    results,
  })
}

// GET: Retrieve impact addenda for an engagement
export async function GET(request: NextRequest) {
  const user = await requirePlatformAdmin()
  if (!user) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const engagementId = searchParams.get('engagement_id')

  if (!engagementId) {
    return NextResponse.json({ error: 'missing_engagement_id' }, { status: 400 })
  }

  const sc = createServiceClient()
  if (!sc) return NextResponse.json({ error: 'config' }, { status: 500 })

  const { data, error } = await sc
    .from('engagement_impact_addenda')
    .select(`
      id, signals, generated_at, version,
      frontofai_briefs(brief_date, title)
    `)
    .eq('engagement_id', engagementId)
    .order('generated_at', { ascending: false })
    .limit(10)

  if (error) return NextResponse.json({ error: 'query_failed' }, { status: 500 })

  return NextResponse.json({ addenda: data || [] })
}
