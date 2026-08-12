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

  if (!ctx.canEditRoster) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
  }

  const body = await request.json()
  const { first_name, last_name, external_student_id, classroom_id } = body

  if (!first_name?.trim() || !last_name?.trim()) {
    return NextResponse.json({ error: 'missing_required_fields' }, { status: 400 })
  }

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  // Check external_student_id uniqueness if provided
  if (external_student_id?.trim()) {
    const { data: existing } = await serviceClient
      .from('school_students')
      .select('id')
      .eq('organization_id', ctx.organization.organization.id)
      .eq('school_site_id', ctx.site.id)
      .eq('external_student_id', external_student_id.trim())
      .single()

    if (existing) {
      return NextResponse.json({ error: 'duplicate_external_id' }, { status: 409 })
    }
  }

  // Validate classroom belongs to site if provided
  if (classroom_id) {
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

  // Call the transactional function
  const { data: result, error } = await serviceClient.rpc('create_student_with_group', {
    p_actor_user_id: user.id,
    p_org_id: ctx.organization.organization.id,
    p_site_id: ctx.site.id,
    p_first_name: first_name.trim(),
    p_last_name: last_name.trim(),
    p_external_student_id: external_student_id?.trim() || null,
    p_classroom_id: classroom_id || null,
  })

  if (error) {
    const msg = error.message
    if (msg.includes('UNAUTHORIZED')) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
    }
    if (msg.includes('duplicate') || msg.includes('unique')) {
      return NextResponse.json({ error: 'duplicate_external_id' }, { status: 409 })
    }
    return NextResponse.json({ error: 'create_failed', detail: msg }, { status: 500 })
  }

  return NextResponse.json({ success: true, ...result })
}
