import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function checkAuth(request: Request) {
  const cookieToken = request.headers.get('cookie')?.match(/analytics_auth=([^;]+)/)?.[1]
  const expectedToken = process.env.ANALYTICS_API_TOKEN
  return !!expectedToken && cookieToken === expectedToken
}

export async function GET(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 200)

  let query = supabase
    .from('outreach_emails')
    .select('*')
    .order('sent_date', { ascending: false })
    .limit(limit)

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const stats = {
    total: data?.length || 0,
    sent: data?.filter((e) => e.status === 'sent').length || 0,
    replied: data?.filter((e) => e.status === 'replied').length || 0,
    followed_up: data?.filter((e) => e.status === 'followed_up').length || 0,
    closed: data?.filter((e) => e.status === 'closed').length || 0,
  }

  const pendingFollowUps = (data || []).filter((e) => {
    if (e.status !== 'sent') return false
    const daysSince = Math.floor((Date.now() - new Date(e.sent_date).getTime()) / (1000 * 60 * 60 * 24))
    return daysSince >= 7
  })

  return NextResponse.json({
    emails: data || [],
    stats,
    pendingFollowUps: pendingFollowUps.map((e) => ({
      id: e.id,
      target: e.target,
      slug: e.slug,
      article_title: e.article_title,
      sent_date: e.sent_date,
      days_since: Math.floor((Date.now() - new Date(e.sent_date).getTime()) / (1000 * 60 * 60 * 24)),
    })),
  })
}

export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const { slug, article_title, target, recipient_email, subject, body_preview, email_type } = body

  if (!slug || !article_title || !target || !subject) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('outreach_emails')
    .insert({
      slug,
      article_title,
      target,
      recipient_email: recipient_email || null,
      subject,
      body_preview: body_preview || null,
      email_type: email_type || 'initial',
      status: 'sent',
      sent_date: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, email: data })
}

export async function PATCH(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const { id, status, notes } = body

  if (!id || !status) {
    return NextResponse.json({ error: 'Missing id or status' }, { status: 400 })
  }

  const validStatuses = ['sent', 'replied', 'followed_up', 'closed']
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const updates: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (status === 'replied') updates.replied_date = new Date().toISOString()
  if (status === 'followed_up') updates.followed_up_date = new Date().toISOString()
  if (status === 'closed') updates.closed_date = new Date().toISOString()
  if (notes !== undefined) updates.notes = notes

  const { data, error } = await supabase
    .from('outreach_emails')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, email: data })
}
