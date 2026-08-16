import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requirePlatformAdmin } from '@/lib/auth/organization-resolver'
import { rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * GET /api/admin/analytics/funnel
 * Returns conversion funnel data.
 */
export async function GET(request: NextRequest) {
  const limited = rateLimit(request)
  if (limited) return limited

  try {
    await requirePlatformAdmin()
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const sc = createClient(supabaseUrl, serviceRoleKey)

  // Get funnel event counts by event_name
  const { data: events } = await sc
    .from('conversion_events')
    .select('event_name, created_at')
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: false }) as { data: any }

  // Count by event name
  const funnel: Record<string, number> = {}
  for (const e of events || []) {
    funnel[e.event_name] = (funnel[e.event_name] || 0) + 1
  }

  // Get daily breakdown for trend
  const dailyMap: Record<string, Record<string, number>> = {}
  for (const e of events || []) {
    const day = e.created_at.slice(0, 10)
    if (!dailyMap[day]) dailyMap[day] = {}
    dailyMap[day][e.event_name] = (dailyMap[day][e.event_name] || 0) + 1
  }

  // Convert to sorted array
  const daily = Object.entries(dailyMap)
    .map(([date, counts]) => ({ date, ...counts }))
    .sort((a, b) => a.date.localeCompare(b.date))

  return NextResponse.json({
    funnel,
    daily,
    total_events: (events || []).length,
  })
}
