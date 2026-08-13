import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/organization-resolver'
import { resolveSchoolContext, SchoolAuthError } from '@/lib/auth/school-resolver'
import { createServerClient, createServiceClient } from '@/lib/supabase'

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
    if (err instanceof SchoolAuthError) return NextResponse.json({ error: err.code }, { status: 403 })
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session_id')
  const includeCompleted = searchParams.get('include_completed') === 'true'
  const statusFilter = searchParams.get('status')
  const search = searchParams.get('search')

  if (!sessionId) {
    return NextResponse.json({ error: 'missing_session_id' }, { status: 400 })
  }

  let query = serviceClient
    .from('pickup_queue_items')
    .select(`
      id, sequence_number, current_status, created_at, updated_at, completed_at,
      exception_flag, exception_reason, release_eligible_at, release_override_reason,
      student_id,
      school_students!inner(id, first_name, last_name, external_student_id, classroom_id),
      arrival_id,
      pickup_arrivals!inner(
        id, checkin_source, pickup_group_id,
        pickup_groups!inner(label)
      ),
      school_students.school_classrooms(id, name)
    `)
    .eq('organization_id', ctx.organization.organization.id)
    .eq('school_site_id', ctx.site.id)
    .eq('session_id', sessionId)
    .order('sequence_number', { ascending: true })

  if (!includeCompleted) {
    query = query.neq('current_status', 'completed')
  }

  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('current_status', statusFilter)
  }

  const { data: queueItems, error } = await query

  if (error) return NextResponse.json({ error: 'query_failed' }, { status: 500 })

  let items = queueItems || []

  if (search) {
    const lower = search.toLowerCase()
    items = items.filter((item: any) => {
      const student = item.school_students
      if (!student) return false
      const name = `${student.first_name} ${student.last_name}`.toLowerCase()
      const classroom = student.school_classrooms?.name?.toLowerCase() || ''
      return name.includes(lower) || classroom.includes(lower)
    })
  }

  const counts = {
    arrived: items.filter((i: any) => i.current_status === 'arrived').length,
    preparing: items.filter((i: any) => i.current_status === 'preparing').length,
    ready: items.filter((i: any) => i.current_status === 'ready').length,
    completed: items.filter((i: any) => i.current_status === 'completed').length,
    exception: items.filter((i: any) => i.current_status === 'exception').length,
    cancelled: items.filter((i: any) => i.current_status === 'cancelled').length,
  }

  return NextResponse.json({ queue: items, counts })
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
    if (err instanceof SchoolAuthError) return NextResponse.json({ error: err.code }, { status: 403 })
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  const body = await request.json()
  const { action, queue_item_id, arrival_id, new_status, expected_current_status, reason } = body

  if (!action) return NextResponse.json({ error: 'missing_action' }, { status: 400 })

  // RPC calls need user JWT context for auth.uid() checks inside the functions
  const supabase = await createServerClient()
  if (!supabase) return NextResponse.json({ error: 'config' }, { status: 500 })

  if (action === 'transition_item') {
    if (!queue_item_id || !new_status) {
      return NextResponse.json({ error: 'missing_params' }, { status: 400 })
    }

    const { data: result, error } = await supabase.rpc('transition_queue_status', {
      p_queue_item_id: queue_item_id,
      p_new_status: new_status,
      p_reason: reason || null,
      p_expected_current_status: expected_current_status || null,
    })

    if (error) {
      const msg = error.message || ''
      if (msg.includes('UNAUTHENTICATED')) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
      if (msg.includes('UNAUTHORIZED')) return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
      if (msg.includes('NOT_FOUND')) return NextResponse.json({ error: 'queue_item_not_found' }, { status: 404 })
      if (msg.includes('INVALID_TRANSITION')) return NextResponse.json({ error: 'invalid_transition' }, { status: 409 })
      if (msg.includes('SESSION_NOT_OPEN')) return NextResponse.json({ error: 'session_not_open' }, { status: 409 })
      return NextResponse.json({ error: 'transition_failed' }, { status: 500 })
    }

    if (result && result.success === false) {
      return NextResponse.json({ error: 'concurrent_modification', ...result }, { status: 409 })
    }

    return NextResponse.json(result)
  }

  if (action === 'transition_arrival') {
    if (!arrival_id || !new_status) {
      return NextResponse.json({ error: 'missing_params' }, { status: 400 })
    }

    const { data: result, error } = await supabase.rpc('transition_arrival_status', {
      p_arrival_id: arrival_id,
      p_new_status: new_status,
      p_reason: reason || null,
      p_expected_current_status: expected_current_status || null,
    })

    if (error) {
      const msg = error.message || ''
      if (msg.includes('UNAUTHENTICATED')) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
      if (msg.includes('UNAUTHORIZED')) return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
      if (msg.includes('NOT_FOUND')) return NextResponse.json({ error: 'arrival_not_found' }, { status: 404 })
      if (msg.includes('SESSION_NOT_OPEN')) return NextResponse.json({ error: 'session_not_open' }, { status: 409 })
      return NextResponse.json({ error: 'transition_failed' }, { status: 500 })
    }

    return NextResponse.json(result)
  }

  if (action === 'flag_exception' || action === 'resolve_exception') {
    if (!queue_item_id) return NextResponse.json({ error: 'missing_queue_item_id' }, { status: 400 })

    const serviceClient = createServiceClient()
    if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

    if (action === 'flag_exception') {
    const { error } = await serviceClient
      .from('pickup_queue_items')
      .update({
        exception_flag: true,
        exception_reason: reason || null,
        exception_set_by: user.id,
        exception_set_at: new Date().toISOString(),
      })
      .eq('id', queue_item_id)
      .eq('organization_id', ctx.organization.organization.id)
      .eq('school_site_id', ctx.site.id)

    if (error) return NextResponse.json({ error: 'flag_failed' }, { status: 500 })
    return NextResponse.json({ success: true })
    } else {
    const { error } = await serviceClient
      .from('pickup_queue_items')
      .update({
        exception_flag: false,
        exception_reason: null,
        exception_set_by: null,
        exception_set_at: null,
      })
      .eq('id', queue_item_id)
      .eq('organization_id', ctx.organization.organization.id)
      .eq('school_site_id', ctx.site.id)

    if (error) return NextResponse.json({ error: 'resolve_failed' }, { status: 500 })
    return NextResponse.json({ success: true })
    }
  }

  return NextResponse.json({ error: 'invalid_action' }, { status: 400 })
}
