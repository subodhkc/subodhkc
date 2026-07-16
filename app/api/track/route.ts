import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface TrackEvent {
  type: 'pageview' | 'click' | 'form_submit' | 'form_error' | 'conversion'
  path: string
  ref?: string
  duration?: number
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

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'

    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referer = request.headers.get('referer') || 'direct'

    console.log('[ANALYTICS]', JSON.stringify({
      type: body.type,
      path: body.path,
      ref: body.ref || null,
      duration: body.duration || null,
      meta: body.meta || null,
      ip,
      userAgent,
      referer,
      timestamp: new Date().toISOString(),
    }))

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
