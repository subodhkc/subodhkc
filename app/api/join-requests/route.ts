import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET: list user's own requests or org admin sees org requests
export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  const { searchParams } = new URL(request.url)
  const orgId = searchParams.get('org_id')

  if (orgId) {
    // Check if user is org admin
    const { data: membership } = await serviceClient
      .from('organization_memberships')
      .select('role')
      .eq('organization_id', orgId)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    const isOrgAdmin = membership?.role === 'owner' || membership?.role === 'admin' || user.isPlatformAdmin
    if (!isOrgAdmin) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
    }

    const { data, error } = await serviceClient
      .from('join_requests')
      .select(`
        id, status, requested_role, created_at, reviewed_at, reviewer_notes,
        user_id, profiles!inner(email, display_name, avatar_url)
      `)
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: 'query_failed' }, { status: 500 })
    return NextResponse.json({ requests: data || [] })
  }

  // Return user's own requests
  const { data, error } = await serviceClient
    .from('join_requests')
    .select(`
      id, status, requested_role, created_at, reviewed_at, reviewer_notes,
      organization_id, organizations!inner(name, slug)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: 'query_failed' }, { status: 500 })
  return NextResponse.json({ requests: data || [] })
}

// POST: create a join request
export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const body = await request.json()
  const { organization_id, requested_role } = body

  if (!organization_id) {
    return NextResponse.json({ error: 'missing_organization_id' }, { status: 400 })
  }

  const role = requested_role || 'member'
  if (!['member', 'admin'].includes(role)) {
    return NextResponse.json({ error: 'invalid_role' }, { status: 400 })
  }

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  // Check org exists and is active
  const { data: org } = await serviceClient
    .from('organizations')
    .select('id, status')
    .eq('id', organization_id)
    .single()

  if (!org) {
    return NextResponse.json({ error: 'organization_not_found' }, { status: 404 })
  }

  if (org.status !== 'active') {
    return NextResponse.json({ error: 'organization_not_active' }, { status: 403 })
  }

  // Check if already a member
  const { data: existingMember } = await serviceClient
    .from('organization_memberships')
    .select('id')
    .eq('organization_id', organization_id)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  if (existingMember) {
    return NextResponse.json({ error: 'already_member' }, { status: 409 })
  }

  // Check for existing pending request (unique index handles this too)
  const { data: existingRequest } = await serviceClient
    .from('join_requests')
    .select('id, status')
    .eq('organization_id', organization_id)
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .single()

  if (existingRequest) {
    return NextResponse.json({ error: 'request_already_pending' }, { status: 409 })
  }

  const { data: joinRequest, error } = await serviceClient
    .from('join_requests')
    .insert({
      organization_id,
      user_id: user.id,
      requested_role: role,
      status: 'pending',
    })
    .select('id')
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'request_already_pending' }, { status: 409 })
    }
    return NextResponse.json({ error: 'request_failed' }, { status: 500 })
  }

  // Audit event
  await serviceClient.from('audit_events').insert({
    organization_id,
    actor_user_id: user.id,
    action: 'join_request.created',
    entity_type: 'join_request',
    entity_id: joinRequest.id,
  })

  return NextResponse.json({ success: true, request_id: joinRequest.id })
}
