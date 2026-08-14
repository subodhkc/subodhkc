import { NextRequest, NextResponse } from 'next/server'
import { requirePlatformAdmin } from '@/lib/supabase'
import { createServiceClient, getCurrentUser } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST: Import a FrontOfAI weekly brief (platform admin only)
export async function POST(request: NextRequest) {
  const user = await requirePlatformAdmin()
  if (!user) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const body = await request.json()
  const { brief_date, title, content, source_url } = body

  if (!brief_date || !title || !content) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
  }

  const sc = createServiceClient()
  if (!sc) return NextResponse.json({ error: 'config' }, { status: 500 })

  const { data, error } = await sc
    .from('frontofai_briefs')
    .upsert({
      brief_date,
      title,
      content,
      source_url: source_url || null,
      imported_by: user.id,
    }, { onConflict: 'brief_date' })
    .select('id, brief_date')
    .single()

  if (error) {
    console.error('FrontOfAI import error:', error)
    return NextResponse.json({ error: 'import_failed' }, { status: 500 })
  }

  return NextResponse.json({ success: true, id: data.id, brief_date: data.brief_date })
}

// GET: List FrontOfAI briefs (authenticated users only)
export async function GET(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const sc = createServiceClient()
  if (!sc) return NextResponse.json({ error: 'config' }, { status: 500 })

  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '10')

  const { data, error } = await sc
    .from('frontofai_briefs')
    .select('id, brief_date, title, source_url, imported_at')
    .order('brief_date', { ascending: false })
    .limit(limit)

  if (error) return NextResponse.json({ error: 'query_failed' }, { status: 500 })

  return NextResponse.json({ briefs: data || [] })
}
