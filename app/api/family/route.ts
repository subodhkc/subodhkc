import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET: Get guardian's family data for family portal
export async function GET(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const siteId = searchParams.get('site_id')

  if (!siteId) return NextResponse.json({ error: 'missing_site_id' }, { status: 400 })

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  // Call the guardian family data RPC
  const { data, error } = await serviceClient.rpc('get_guardian_family_data', {
    p_site_id: siteId,
  })

  if (error) {
    const msg = error.message || ''
    if (msg.includes('UNAUTHENTICATED')) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
    if (msg.includes('GUARDIAN_NOT_FOUND')) return NextResponse.json({ error: 'no_guardian_access' }, { status: 403 })
    if (msg.includes('SITE_NOT_FOUND')) return NextResponse.json({ error: 'site_not_found' }, { status: 404 })
    return NextResponse.json({ error: 'query_failed' }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST: Guardian self check-in
export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const body = await request.json()
  const { site_id, checkin_code, pickup_group_id } = body

  if (!site_id || !checkin_code) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
  }

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  const { data, error } = await serviceClient.rpc('guardian_self_checkin', {
    p_site_id: site_id,
    p_checkin_code: checkin_code,
    p_pickup_group_id: pickup_group_id || null,
  })

  if (error) {
    const msg = error.message || ''
    if (msg.includes('UNAUTHENTICATED')) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
    if (msg.includes('GUARDIAN_NOT_FOUND')) return NextResponse.json({ error: 'no_guardian_access' }, { status: 403 })
    if (msg.includes('CODE_INVALID')) return NextResponse.json({ error: 'code_invalid' }, { status: 400 })
    if (msg.includes('CHECKIN_NOT_OPEN')) return NextResponse.json({ error: 'checkin_not_open' }, { status: 400 })
    if (msg.includes('SESSION_CLOSED')) return NextResponse.json({ error: 'session_closed' }, { status: 400 })
    if (msg.includes('NO_ELIGIBLE_GROUPS')) return NextResponse.json({ error: 'no_eligible_groups' }, { status: 403 })
    if (msg.includes('GROUP_NOT_AUTHORIZED')) return NextResponse.json({ error: 'group_not_authorized' }, { status: 403 })
    if (msg.includes('GROUP_NOT_ACTIVE')) return NextResponse.json({ error: 'group_not_active' }, { status: 400 })
    if (msg.includes('NO_ACTIVE_STUDENTS')) return NextResponse.json({ error: 'no_active_students' }, { status: 400 })
    if (msg.includes('SITE_NOT_FOUND')) return NextResponse.json({ error: 'site_not_found' }, { status: 404 })
    if (msg.includes('ORG_SUSPENDED')) return NextResponse.json({ error: 'org_suspended' }, { status: 403 })
    if (msg.includes('ENTITLEMENT')) return NextResponse.json({ error: 'entitlement_missing' }, { status: 403 })
    return NextResponse.json({ error: 'checkin_failed' }, { status: 500 })
  }

  return NextResponse.json(data)
}
