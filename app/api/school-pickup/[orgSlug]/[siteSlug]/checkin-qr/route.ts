import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/organization-resolver'
import { resolveSchoolContext, SchoolAuthError } from '@/lib/auth/school-resolver'
import { createServerClient, createServiceClient } from '@/lib/supabase'

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
    if (err instanceof SchoolAuthError) return NextResponse.json({ error: err.code }, { status: 403 })
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  if (!ctx.canIssueCredentials) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
  }

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  const { data: codes, error } = await serviceClient
    .from('shared_checkin_codes')
    .select('id, status, purpose, lane, generated_by, created_at, replaced_at, replaced_by, revoked_at, revoked_reason, valid_from, valid_until')
    .eq('organization_id', ctx.organization.organization.id)
    .eq('school_site_id', ctx.site.id)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) return NextResponse.json({ error: 'query_failed' }, { status: 500 })

  const activeCode = codes?.find(c => c.status === 'active') || null

  return NextResponse.json({ codes: codes || [], activeCode })
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

  if (!ctx.canIssueCredentials) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
  }

  const body = await request.json()
  const { action, code_id, reason } = body

  const supabase = await createServerClient()
  if (!supabase) return NextResponse.json({ error: 'config' }, { status: 500 })

  if (action === 'generate') {
    const { data: result, error } = await supabase.rpc('rotate_checkin_code', {
      p_site_id: ctx.site.id,
      p_purpose: 'pickup_self_checkin',
      p_lane: null,
    })

    if (error) {
      const msg = error.message || ''
      if (msg.includes('UNAUTHENTICATED')) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
      if (msg.includes('UNAUTHORIZED')) return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
      if (msg.includes('SITE_NOT_FOUND')) return NextResponse.json({ error: 'site_not_found' }, { status: 404 })
      if (msg.includes('ORG_SUSPENDED')) return NextResponse.json({ error: 'org_suspended' }, { status: 403 })
      if (msg.includes('ENTITLEMENT')) return NextResponse.json({ error: 'entitlement_missing' }, { status: 403 })
      return NextResponse.json({ error: 'rotation_failed' }, { status: 500 })
    }

    return NextResponse.json(result)
  }

  if (action === 'revoke') {
    if (!code_id) return NextResponse.json({ error: 'missing_code_id' }, { status: 400 })

    const { error } = await supabase.rpc('revoke_checkin_code', {
      p_code_id: code_id,
      p_reason: reason || null,
    })

    if (error) {
      const msg = error.message || ''
      if (msg.includes('UNAUTHENTICATED')) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
      if (msg.includes('UNAUTHORIZED')) return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
      if (msg.includes('NOT_FOUND')) return NextResponse.json({ error: 'code_not_found' }, { status: 404 })
      if (msg.includes('ALREADY_INACTIVE')) return NextResponse.json({ error: 'already_inactive' }, { status: 409 })
      return NextResponse.json({ error: 'revoke_failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  }

  if (action === 'log_print') {
    if (!code_id) return NextResponse.json({ error: 'missing_code_id' }, { status: 400 })

    const serviceClient = createServiceClient()
    if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

    const { error } = await serviceClient
      .from('checkin_code_audit_events')
      .insert({
        organization_id: ctx.organization.organization.id,
        school_site_id: ctx.site.id,
        code_id,
        event_type: 'printed',
        actor_user_id: user.id,
      })

    if (error) return NextResponse.json({ error: 'log_failed' }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'invalid_action' }, { status: 400 })
}
