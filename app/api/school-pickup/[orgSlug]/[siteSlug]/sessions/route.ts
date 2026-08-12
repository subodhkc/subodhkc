import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/organization-resolver'
import { resolveSchoolContext, SchoolAuthError } from '@/lib/auth/school-resolver'
import { createServiceClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orgSlug: string; siteSlug: string }> }
) {
  const { orgSlug, siteSlug } = await params
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  let ctx
  try {
    ctx = await resolveSchoolContext(user, orgSlug, siteSlug)
  } catch (err) {
    if (err instanceof SchoolAuthError) {
      return NextResponse.json({ error: err.code }, { status: 403 })
    }
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  const { searchParams } = new URL(request.url)
  const serviceDate = searchParams.get('date')

  let query = serviceClient
    .from('pickup_sessions')
    .select('id, service_date, status, opened_at, closed_at, opened_by, closed_by, auto_started, cancelled_at, cancel_reason')
    .eq('organization_id', ctx.organization.organization.id)
    .eq('school_site_id', ctx.site.id)
    .order('service_date', { ascending: false })
    .limit(30)

  if (serviceDate) {
    query = query.eq('service_date', serviceDate)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: 'query_failed' }, { status: 500 })
  }

  return NextResponse.json({ sessions: data || [] })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orgSlug: string; siteSlug: string }> }
) {
  const { orgSlug, siteSlug } = await params
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  let ctx
  try {
    ctx = await resolveSchoolContext(user, orgSlug, siteSlug)
  } catch (err) {
    if (err instanceof SchoolAuthError) {
      return NextResponse.json({ error: err.code }, { status: 403 })
    }
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  if (!ctx.canIssueCredentials) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
  }

  const body = await request.json()
  const { action, service_date, session_id, reason } = body

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  if (action === 'ensure_active') {
    const { data: sessionId, error } = await serviceClient.rpc('ensure_active_dismissal_session', {
      p_site_id: ctx.site.id,
      p_service_date: service_date || null,
    })

    if (error) {
      const msg = error.message || ''
      if (msg.includes('UNAUTHORIZED')) return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
      if (msg.includes('SITE_NOT_FOUND')) return NextResponse.json({ error: 'site_not_found' }, { status: 404 })
      if (msg.includes('ORG_SUSPENDED')) return NextResponse.json({ error: 'org_suspended' }, { status: 403 })
      if (msg.includes('ENTITLEMENT')) return NextResponse.json({ error: 'entitlement_missing' }, { status: 403 })
      return NextResponse.json({ error: 'ensure_active_failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true, session_id: sessionId })
  }

  if (action === 'open') {
    const { data: sessionId, error } = await serviceClient.rpc('open_pickup_session', {
      p_site_id: ctx.site.id,
      p_service_date: service_date || null,
    })

    if (error) {
      const msg = error.message || ''
      if (msg.includes('UNAUTHORIZED')) return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
      if (msg.includes('SITE_NOT_FOUND')) return NextResponse.json({ error: 'site_not_found' }, { status: 404 })
      if (msg.includes('ORG_SUSPENDED')) return NextResponse.json({ error: 'org_suspended' }, { status: 403 })
      if (msg.includes('ENTITLEMENT')) return NextResponse.json({ error: 'entitlement_missing' }, { status: 403 })
      return NextResponse.json({ error: 'open_failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true, session_id: sessionId })
  }

  if (action === 'close') {
    if (!session_id) return NextResponse.json({ error: 'missing_session_id' }, { status: 400 })

    const { error } = await serviceClient.rpc('close_pickup_session', {
      p_session_id: session_id,
    })

    if (error) {
      const msg = error.message || ''
      if (msg.includes('UNAUTHORIZED')) return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
      if (msg.includes('NOT_FOUND')) return NextResponse.json({ error: 'session_not_found' }, { status: 404 })
      if (msg.includes('NOT_OPEN')) return NextResponse.json({ error: 'session_not_open' }, { status: 409 })
      return NextResponse.json({ error: 'close_failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  }

  if (action === 'cancel') {
    if (!session_id) return NextResponse.json({ error: 'missing_session_id' }, { status: 400 })

    const { error } = await serviceClient.rpc('cancel_pickup_session', {
      p_session_id: session_id,
      p_reason: reason || null,
    })

    if (error) {
      const msg = error.message || ''
      if (msg.includes('UNAUTHORIZED')) return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
      if (msg.includes('NOT_FOUND')) return NextResponse.json({ error: 'session_not_found' }, { status: 404 })
      if (msg.includes('NOT_CANCELLABLE')) return NextResponse.json({ error: 'session_not_cancellable' }, { status: 409 })
      return NextResponse.json({ error: 'cancel_failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'invalid_action' }, { status: 400 })
}
