import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const expectedToken = process.env.ANALYTICS_API_TOKEN

  if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Analytics not configured' }, { status: 500 })
  }

  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [pageviews7d, pageviews30d, topPages7d, referrers7d, events7d, recentEvents, sessions7d] = await Promise.all([
    supabase
      .from('site_analytics_events')
      .select('id', { count: 'exact', head: true })
      .eq('event_type', 'pageview')
      .gte('created_at', sevenDaysAgo),

    supabase
      .from('site_analytics_events')
      .select('id', { count: 'exact', head: true })
      .eq('event_type', 'pageview')
      .gte('created_at', thirtyDaysAgo),

    supabase
      .from('site_analytics_events')
      .select('path')
      .eq('event_type', 'pageview')
      .gte('created_at', sevenDaysAgo),

    supabase
      .from('site_analytics_events')
      .select('referrer')
      .not('referrer', 'is', null)
      .neq('referrer', '')
      .gte('created_at', sevenDaysAgo),

    supabase
      .from('site_analytics_events')
      .select('event_type')
      .in('event_type', ['engagement', 'click', 'form_submit', 'form_error', 'conversion'])
      .gte('created_at', sevenDaysAgo),

    supabase
      .from('site_analytics_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50),

    supabase
      .from('site_analytics_events')
      .select('session_id')
      .not('session_id', 'is', null)
      .gte('created_at', sevenDaysAgo),
  ])

  const pageCounts: Record<string, number> = {}
  for (const row of topPages7d.data || []) {
    const p = (row as { path: string }).path
    pageCounts[p] = (pageCounts[p] || 0) + 1
  }
  const topPages = Object.entries(pageCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 15)
    .map(([path, count]) => ({ path, count }))

  const refCounts: Record<string, number> = {}
  for (const row of referrers7d.data || []) {
    const r = (row as { referrer: string }).referrer
    if (r) {
      let domain = r
      try { domain = new URL(r).hostname } catch {}
      refCounts[domain] = (refCounts[domain] || 0) + 1
    }
  }
  const topReferrers = Object.entries(refCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([source, count]) => ({ source, count }))

  const eventCounts: Record<string, number> = {}
  for (const row of events7d.data || []) {
    const t = (row as { event_type: string }).event_type
    eventCounts[t] = (eventCounts[t] || 0) + 1
  }

  const durations = (recentEvents.data || [])
    .map((r) => (r as { duration?: number }).duration || 0)
    .filter((d) => d > 0)
  const avgDuration = durations.length > 0
    ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
    : 0

  const uniqueSessions = new Set(
    (sessions7d.data || [])
      .map((r) => (r as { session_id?: string }).session_id)
      .filter(Boolean)
  ).size

  return NextResponse.json({
    summary: {
      pageviews7d: pageviews7d.count || 0,
      pageviews30d: pageviews30d.count || 0,
      uniqueSessions: uniqueSessions || 0,
      avgDurationSeconds: avgDuration,
      conversions: eventCounts['conversion'] || 0,
      formSubmits: eventCounts['form_submit'] || 0,
      formErrors: eventCounts['form_error'] || 0,
      clicks: eventCounts['click'] || 0,
    },
    topPages,
    topReferrers,
    eventBreakdown: eventCounts,
    recentEvents: recentEvents.data || [],
  })
}
