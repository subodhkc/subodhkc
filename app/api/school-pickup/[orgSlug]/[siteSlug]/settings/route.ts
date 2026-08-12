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

  return NextResponse.json({ site: ctx.site })
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

  if (!ctx.canManageSettings) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
  }

  const body = await request.json()
  const { name, timezone, status, address_line1, address_line2, city, state_province, postal_code } = body

  if (timezone) {
    // Basic timezone format check
    if (!timezone.includes('/') || timezone.length < 3) {
      return NextResponse.json({ error: 'invalid_timezone' }, { status: 400 })
    }
  }

  if (status && !['active', 'inactive', 'archived'].includes(status)) {
    return NextResponse.json({ error: 'invalid_status' }, { status: 400 })
  }

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  const { error } = await serviceClient.rpc('update_school_site', {
    p_actor_user_id: user.id,
    p_org_id: ctx.organization.organization.id,
    p_site_id: ctx.site.id,
    p_name: name?.trim() || null,
    p_timezone: timezone || null,
    p_status: status || null,
    p_address_line1: address_line1 !== undefined ? (address_line1 || null) : null,
    p_address_line2: address_line2 !== undefined ? (address_line2 || null) : null,
    p_city: city !== undefined ? (city || null) : null,
    p_state_province: state_province !== undefined ? (state_province || null) : null,
    p_postal_code: postal_code !== undefined ? (postal_code || null) : null,
  })

  if (error) {
    if (error.message.includes('UNAUTHORIZED')) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
    }
    if (error.message.includes('SITE_NOT_FOUND')) {
      return NextResponse.json({ error: 'site_not_found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'update_failed' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
