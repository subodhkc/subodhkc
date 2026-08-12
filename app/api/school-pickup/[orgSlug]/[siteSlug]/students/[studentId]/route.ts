import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/organization-resolver'
import { resolveSchoolContext, SchoolAuthError } from '@/lib/auth/school-resolver'
import { createServiceClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orgSlug: string; siteSlug: string; studentId: string }> }
) {
  const { orgSlug, siteSlug, studentId } = await params
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

  // Get student with classroom info
  const { data: student, error: studentError } = await serviceClient
    .from('school_students')
    .select(`
      id, first_name, last_name, external_student_id, classroom_id, status,
      created_at, updated_at, archived_at,
      school_classrooms!left(id, name, grade_label, teacher_display_label)
    `)
    .eq('id', studentId)
    .eq('organization_id', ctx.organization.organization.id)
    .eq('school_site_id', ctx.site.id)
    .single()

  if (studentError || !student) {
    return NextResponse.json({ error: 'student_not_found' }, { status: 404 })
  }

  // Get pickup groups for this student
  const { data: groups } = await serviceClient
    .from('pickup_group_students')
    .select(`
      pickup_group_id, status,
      pickup_groups!inner(id, label, status)
    `)
    .eq('student_id', studentId)
    .eq('organization_id', ctx.organization.organization.id)
    .eq('school_site_id', ctx.site.id)

  // Get credentials for those groups
  const groupIds = (groups || []).map((g: any) => g.pickup_groups.id)
  let credentials: any[] = []
  if (groupIds.length > 0) {
    const { data: creds } = await serviceClient
      .from('pickup_credentials')
      .select('id, status, issued_at, revoked_at, revoked_reason, pickup_group_id')
      .in('pickup_group_id', groupIds)
      .order('issued_at', { ascending: false })
    credentials = creds || []
  }

  return NextResponse.json({
    student,
    pickup_groups: (groups || []).map((g: any) => ({
      id: g.pickup_groups.id,
      label: g.pickup_groups.label,
      status: g.pickup_groups.status,
      membership_status: g.status,
    })),
    credentials,
  })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orgSlug: string; siteSlug: string; studentId: string }> }
) {
  const { orgSlug, siteSlug, studentId } = await params
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

  if (!ctx.canEditRoster) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
  }

  const body = await request.json()
  const { first_name, last_name, external_student_id, classroom_id, status } = body

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  // Check external_student_id uniqueness if changing
  if (external_student_id !== undefined && external_student_id?.trim()) {
    const { data: existing } = await serviceClient
      .from('school_students')
      .select('id')
      .eq('organization_id', ctx.organization.organization.id)
      .eq('school_site_id', ctx.site.id)
      .eq('external_student_id', external_student_id.trim())
      .neq('id', studentId)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'duplicate_external_id' }, { status: 409 })
    }
  }

  // Validate classroom if changing
  if (classroom_id !== undefined && classroom_id) {
    const { data: classroom } = await serviceClient
      .from('school_classrooms')
      .select('id')
      .eq('id', classroom_id)
      .eq('school_site_id', ctx.site.id)
      .eq('organization_id', ctx.organization.organization.id)
      .single()

    if (!classroom) {
      return NextResponse.json({ error: 'invalid_classroom' }, { status: 400 })
    }
  }

  const { error } = await serviceClient.rpc('update_student', {
    p_actor_user_id: user.id,
    p_org_id: ctx.organization.organization.id,
    p_site_id: ctx.site.id,
    p_student_id: studentId,
    p_first_name: first_name?.trim() || null,
    p_last_name: last_name?.trim() || null,
    p_external_student_id: external_student_id !== undefined ? (external_student_id?.trim() || null) : null,
    p_classroom_id: classroom_id !== undefined ? (classroom_id || null) : null,
    p_status: status || null,
  })

  if (error) {
    if (error.message.includes('UNAUTHORIZED')) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
    }
    if (error.message.includes('STUDENT_NOT_FOUND')) {
      return NextResponse.json({ error: 'student_not_found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'update_failed' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
