import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { createBrowserClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface TrackEvent {
  type: 'pageview' | 'engagement' | 'click' | 'form_submit' | 'form_error' | 'conversion'
  path: string
  ref?: string
  duration?: number
  sessionId?: string
  meta?: Record<string, string | number | boolean>
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

    // No IP collection for analytics.
    // The ip_hash column remains nullable for backward compatibility but new events do not populate it.
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referer = body.ref || null

    const supabase = createBrowserClient()

    if (supabase) {
      const { error } = await supabase
        .from('site_analytics_events')
        .insert({
          event_type: body.type,
          path: body.path,
          referrer: referer,
          user_agent: userAgent,
          ip_hash: null,
          session_id: body.sessionId || null,
          duration: body.duration || 0,
          meta: body.meta || {},
        })

      if (error) {
        console.error('[ANALYTICS] Supabase insert error:', error.message)
      }
    } else {
      console.log('[ANALYTICS] Supabase not configured - logging only:', JSON.stringify({
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
