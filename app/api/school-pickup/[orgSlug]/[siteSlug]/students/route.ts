import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/organization-resolver'
import { resolveSchoolContext, SchoolAuthError } from '@/lib/auth/school-resolver'
import { createServiceClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface StudentRow {
  id: string
  first_name: string
  last_name: string
  external_student_id: string | null
  classroom_id: string | null
  status: string
  school_classrooms?: { name: string; grade_label: string | null }[] | null
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
  const search = searchParams.get('search')
  const status = searchParams.get('status') || 'active'
  const classroomId = searchParams.get('classroom_id')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
  const offset = (page - 1) * limit

  let query = serviceClient
    .from('school_students')
    .select(`
      id, first_name, last_name, external_student_id, classroom_id, status,
      school_classrooms!left(name, grade_label)
    `, { count: 'exact' })
    .eq('organization_id', ctx.organization.organization.id)
    .eq('school_site_id', ctx.site.id)

  if (status !== 'all') {
    query = query.eq('status', status)
  }

  if (classroomId) {
    query = query.eq('classroom_id', classroomId)
  }

  if (search) {
    query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,external_student_id.ilike.%${search}%`)
  }

  query = query.order('last_name').order('first_name').range(offset, offset + limit - 1)

  const { data, count, error } = await query

  if (error) {
    return NextResponse.json({ error: 'query_failed' }, { status: 500 })
  }

  return NextResponse.json({
    students: data || [],
    total: count ?? 0,
    page,
    limit,
  })
}
