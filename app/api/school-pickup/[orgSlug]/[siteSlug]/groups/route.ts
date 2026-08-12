import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/organization-resolver'
import { resolveSchoolContext, SchoolAuthError } from '@/lib/auth/school-resolver'
import { createServiceClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  _request: NextRequest,
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
    .from('pickup_groups')
    .select('id, name, label, description, sort_order, status, created_at, archived_at')
    .eq('organization_id', ctx.organization.organization.id)
    .eq('school_site_id', ctx.site.id)
    .is('archived_at', null)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    return NextResponse.json({ error: 'query_failed' }, { status: 500 })
  }

  return NextResponse.json({ groups: data || [] })
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
  const { name, description, sort_order } = body

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ error: 'missing_name' }, { status: 400 })
  }

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  const { data, error } = await serviceClient
    .from('pickup_groups')
    .insert({
      organization_id: ctx.organization.organization.id,
      school_site_id: ctx.site.id,
      name: name.trim(),
      description: description || null,
      sort_order: typeof sort_order === 'number' ? sort_order : 0,
      status: 'active',
    })
    .select('id, name, description, sort_order, status')
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'duplicate_name' }, { status: 409 })
    }
    return NextResponse.json({ error: 'insert_failed' }, { status: 500 })
  }

  return NextResponse.json({ group: data })
}
