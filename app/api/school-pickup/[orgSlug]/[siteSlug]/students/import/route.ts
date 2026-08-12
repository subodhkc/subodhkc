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
  const { students } = body

  if (!Array.isArray(students) || students.length === 0) {
    return NextResponse.json({ error: 'missing_students' }, { status: 400 })
  }

  // Validate each row has required fields
  for (const s of students) {
    if (!s.first_name?.trim() || !s.last_name?.trim()) {
      return NextResponse.json({
        error: 'invalid_row',
        detail: 'first_name and last_name are required'
      }, { status: 400 })
    }
  }

  // Limit batch size
  if (students.length > 500) {
    return NextResponse.json({ error: 'batch_too_large', max: 500 }, { status: 400 })
  }

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  const { data: result, error } = await serviceClient.rpc('import_students', {
    p_actor_user_id: user.id,
    p_org_id: ctx.organization.organization.id,
    p_site_id: ctx.site.id,
    p_students: students,
  })

  if (error) {
    if (error.message.includes('UNAUTHORIZED')) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
    }
    return NextResponse.json({ error: 'import_failed', detail: error.message }, { status: 500 })
  }

  // Parse results
  let results: any[] = []
  if (result && typeof result === 'object') {
    results = (result as any).results || []
  }

  const summary = {
    created: results.filter((r: any) => r.action === 'created').length,
    updated: results.filter((r: any) => r.action === 'updated').length,
    errors: results.filter((r: any) => r.action === 'error').length,
    total: results.length,
  }

  return NextResponse.json({ success: true, summary, results })
}
