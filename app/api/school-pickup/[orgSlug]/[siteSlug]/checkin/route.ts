import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/organization-resolver'
import { resolveSchoolContext, SchoolAuthError } from '@/lib/auth/school-resolver'
import { createServiceClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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

  const body = await request.json()
  const { token, pickup_group_id, source } = body

  if (!token && !pickup_group_id) {
    return NextResponse.json({ error: 'missing_token_or_group' }, { status: 400 })
  }

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  const { data: result, error } = await serviceClient.rpc('process_pickup_checkin', {
    p_site_id: ctx.site.id,
    p_credential_token: token || null,
    p_pickup_group_id: pickup_group_id || null,
    p_source: source || 'qr',
  })

  if (error) {
    const msg = error.message || ''
    if (msg.includes('UNAUTHENTICATED')) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
    if (msg.includes('UNAUTHORIZED')) return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
    if (msg.includes('SITE_NOT_FOUND')) return NextResponse.json({ error: 'site_not_found' }, { status: 404 })
    if (msg.includes('ORG_SUSPENDED')) return NextResponse.json({ error: 'org_suspended' }, { status: 403 })
    if (msg.includes('ENTITLEMENT')) return NextResponse.json({ error: 'entitlement_missing' }, { status: 403 })
    if (msg.includes('INVALID_INPUT')) return NextResponse.json({ error: 'invalid_input' }, { status: 400 })
    return NextResponse.json({ error: 'checkin_failed' }, { status: 500 })
  }

  return NextResponse.json(result)
}

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
  const sessionId = searchParams.get('session_id')

  let query = serviceClient
    .from('pickup_queue_items')
    .select(`
      id, sequence_number, current_status, student_id,
      school_students!inner(id, first_name, last_name),
      pickup_arrivals!inner(pickup_group_id, pickup_groups!inner(label))
    `)
    .eq('organization_id', ctx.organization.organization.id)
    .eq('school_site_id', ctx.site.id)
    .order('sequence_number', { ascending: true })

  if (sessionId) {
    query = query.eq('session_id', sessionId)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: 'query_failed' }, { status: 500 })
  }

  return NextResponse.json({ queue: data || [] })
}
