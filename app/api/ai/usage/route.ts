import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/organization-resolver'
import { createServiceClient, getCurrentUser } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET: AI usage and cost summary for the authenticated user
export async function GET(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const authUser = await getAuthenticatedUser()
  if (!authUser) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const sc = createServiceClient()
  if (!sc) return NextResponse.json({ error: 'config' }, { status: 500 })

  const { searchParams } = new URL(request.url)
  const days = parseInt(searchParams.get('days') || '30')
  const engagementId = searchParams.get('engagement_id')

  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

  let query = sc
    .from('ai_usage_log')
    .select('user_id, request_type, context_type, model_used, input_tokens, output_tokens, latency_ms, created_at, engagement_id')
    .gte('created_at', startDate)

  // Non-admins can only see their own usage
  if (!authUser.isPlatformAdmin) {
    query = query.eq('user_id', user.id)
  }

  if (engagementId) {
    query = query.eq('engagement_id', engagementId)
  }

  const { data: logs, error } = await query.order('created_at', { ascending: false }).limit(500)

  if (error) return NextResponse.json({ error: 'query_failed' }, { status: 500 })

  // Aggregate
  const summary = {
    total_requests: logs?.length || 0,
    total_input_tokens: logs?.reduce((sum, l) => sum + (l.input_tokens || 0), 0) || 0,
    total_output_tokens: logs?.reduce((sum, l) => sum + (l.output_tokens || 0), 0) || 0,
    avg_latency_ms: logs?.length ? Math.round(logs.reduce((sum, l) => sum + (l.latency_ms || 0), 0) / logs.length) : 0,
    by_type: {} as Record<string, { count: number; input_tokens: number; output_tokens: number }>,
    by_context: {} as Record<string, { count: number; input_tokens: number; output_tokens: number }>,
    estimated_cost_usd: 0,
  }

  for (const log of logs || []) {
    const typeKey = log.request_type
    if (!summary.by_type[typeKey]) {
      summary.by_type[typeKey] = { count: 0, input_tokens: 0, output_tokens: 0 }
    }
    summary.by_type[typeKey].count++
    summary.by_type[typeKey].input_tokens += log.input_tokens || 0
    summary.by_type[typeKey].output_tokens += log.output_tokens || 0

    const ctxKey = log.context_type
    if (!summary.by_context[ctxKey]) {
      summary.by_context[ctxKey] = { count: 0, input_tokens: 0, output_tokens: 0 }
    }
    summary.by_context[ctxKey].count++
    summary.by_context[ctxKey].input_tokens += log.input_tokens || 0
    summary.by_context[ctxKey].output_tokens += log.output_tokens || 0
  }

  // GPT-4o pricing: $2.50/1M input, $10.00/1M output (as of 2024)
  summary.estimated_cost_usd = Math.round(
    (summary.total_input_tokens / 1_000_000 * 2.5 + summary.total_output_tokens / 1_000_000 * 10) * 100
  ) / 100

  return NextResponse.json({
    summary,
    logs: logs || [],
    period_days: days,
  })
}
