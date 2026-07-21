import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { createBrowserClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface TrackEvent {
  type: 'pageview' | 'click' | 'form_submit' | 'form_error' | 'conversion'
  path: string
  ref?: string
  duration?: number
  sessionId?: string
  meta?: Record<string, string | number | boolean>
}

function hashIp(ip: string): string {
  let hash = 0
  const salted = `sk-analytics-${ip}`
  for (let i = 0; i < salted.length; i++) {
    const char = salted.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return `h_${Math.abs(hash).toString(36)}`
}

export async function POST(request: NextRequest) {
  const limited = rateLimit(request)
  if (limited) return limited

  try {
    const body = await request.json() as TrackEvent

    if (!body.type || !body.path) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'

    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referer = body.ref || request.headers.get('referer') || null
    const ipHash = ip !== 'unknown' ? hashIp(ip) : null

    const supabase = createBrowserClient()

    if (supabase) {
      const { error } = await supabase
        .from('site_analytics_events')
        .insert({
          event_type: body.type,
          path: body.path,
          referrer: referer,
          user_agent: userAgent,
          ip_hash: ipHash,
          session_id: body.sessionId || null,
          duration: body.duration || 0,
          meta: body.meta || {},
        })

      if (error) {
        console.error('[ANALYTICS] Supabase insert error:', error.message)
      }
    } else {
      console.log('[ANALYTICS] Supabase not configured — logging only:', JSON.stringify({
        type: body.type,
        path: body.path,
        timestamp: new Date().toISOString(),
      }))
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
