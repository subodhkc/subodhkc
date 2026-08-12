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

  // Get all credentials for this site with pickup group and student info
  const { data, error } = await serviceClient
    .from('pickup_credentials')
    .select(`
      id, status, issued_at, revoked_at, revoked_reason, replaced_by,
      pickup_group_id,
      pickup_groups!inner(
        id, label,
        pickup_group_students(
          student_id, status,
          school_students!inner(id, first_name, last_name, external_student_id, status)
        )
      )
    `)
    .eq('organization_id', ctx.organization.organization.id)
    .eq('school_site_id', ctx.site.id)
    .order('issued_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'query_failed' }, { status: 500 })
  }

  return NextResponse.json({ credentials: data || [] })
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
  const { pickup_group_id } = body

  if (!pickup_group_id) {
    return NextResponse.json({ error: 'missing_pickup_group_id' }, { status: 400 })
  }

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  const { data: result, error } = await serviceClient.rpc('issue_credential', {
    p_actor_user_id: user.id,
    p_org_id: ctx.organization.organization.id,
    p_site_id: ctx.site.id,
    p_pickup_group_id: pickup_group_id,
  })

  if (error) {
    if (error.message.includes('UNAUTHORIZED')) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
    }
    if (error.message.includes('PICKUP_GROUP_NOT_FOUND')) {
      return NextResponse.json({ error: 'pickup_group_not_found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'issue_failed' }, { status: 500 })
  }

  return NextResponse.json({ success: true, ...result })
}
