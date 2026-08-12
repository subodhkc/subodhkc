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
    .from('dismissal_schedules')
    .select('id, pickup_group_id, day_of_week, dismissal_time, release_lead_minutes, is_active')
    .eq('organization_id', ctx.organization.organization.id)
    .eq('school_site_id', ctx.site.id)
    .eq('is_active', true)
    .order('day_of_week', { ascending: true })

  if (error) {
    return NextResponse.json({ error: 'query_failed' }, { status: 500 })
  }

  return NextResponse.json({ schedules: data || [] })
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

  if (!ctx.canManageSettings) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
  }

  const body = await request.json()
  const { pickup_group_id, day_of_week, dismissal_time, release_lead_minutes } = body

  if (typeof day_of_week !== 'number' || day_of_week < 0 || day_of_week > 6) {
    return NextResponse.json({ error: 'invalid_day_of_week' }, { status: 400 })
  }
  if (!dismissal_time || typeof dismissal_time !== 'string') {
    return NextResponse.json({ error: 'missing_dismissal_time' }, { status: 400 })
  }

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  const { data, error } = await serviceClient
    .from('dismissal_schedules')
    .insert({
      organization_id: ctx.organization.organization.id,
      school_site_id: ctx.site.id,
      pickup_group_id: pickup_group_id || null,
      day_of_week,
      dismissal_time,
      release_lead_minutes: typeof release_lead_minutes === 'number' ? release_lead_minutes : 0,
      is_active: true,
    })
    .select('id, pickup_group_id, day_of_week, dismissal_time, release_lead_minutes, is_active')
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'duplicate_schedule' }, { status: 409 })
    }
    return NextResponse.json({ error: 'insert_failed' }, { status: 500 })
  }

  return NextResponse.json({ schedule: data })
}

export async function DELETE(
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

  if (!ctx.canManageSettings) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const scheduleId = searchParams.get('id')

  if (!scheduleId) {
    return NextResponse.json({ error: 'missing_id' }, { status: 400 })
  }

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  const { error } = await serviceClient
    .from('dismissal_schedules')
    .delete()
    .eq('id', scheduleId)
    .eq('organization_id', ctx.organization.organization.id)
    .eq('school_site_id', ctx.site.id)

  if (error) {
    return NextResponse.json({ error: 'delete_failed' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
