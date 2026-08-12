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

  const { data, error } = await serviceClient
    .from('school_classrooms')
    .select('id, name, grade_label, teacher_display_label')
    .eq('organization_id', ctx.organization.organization.id)
    .eq('school_site_id', ctx.site.id)
    .order('name')

  if (error) {
    return NextResponse.json({ error: 'query_failed' }, { status: 500 })
  }

  return NextResponse.json({ classrooms: data || [] })
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

  if (!ctx.canEditRoster) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
  }

  const body = await request.json()
  const { name, grade_label, teacher_display_label } = body

  if (!name?.trim()) {
    return NextResponse.json({ error: 'missing_name' }, { status: 400 })
  }

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  const { data: result, error } = await serviceClient.rpc('create_classroom', {
    p_actor_user_id: user.id,
    p_org_id: ctx.organization.organization.id,
    p_site_id: ctx.site.id,
    p_name: name.trim(),
    p_grade_label: grade_label?.trim() || null,
    p_teacher_display_label: teacher_display_label?.trim() || null,
  })

  if (error) {
    if (error.message.includes('UNAUTHORIZED')) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
    }
    if (error.message.includes('unique')) {
      return NextResponse.json({ error: 'duplicate_classroom_name' }, { status: 409 })
    }
    return NextResponse.json({ error: 'create_failed' }, { status: 500 })
  }

  return NextResponse.json({ success: true, classroom_id: result })
}

export async function PATCH(
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
  const { classroom_id, name, grade_label, teacher_display_label } = body

  if (!classroom_id) {
    return NextResponse.json({ error: 'missing_classroom_id' }, { status: 400 })
  }

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  const { error } = await serviceClient.rpc('update_classroom', {
    p_actor_user_id: user.id,
    p_org_id: ctx.organization.organization.id,
    p_site_id: ctx.site.id,
    p_classroom_id: classroom_id,
    p_name: name?.trim() || null,
    p_grade_label: grade_label?.trim() || null,
    p_teacher_display_label: teacher_display_label?.trim() || null,
  })

  if (error) {
    if (error.message.includes('UNAUTHORIZED')) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
    }
    return NextResponse.json({ error: 'update_failed' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
