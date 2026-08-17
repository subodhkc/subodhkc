import { NextRequest, NextResponse } from 'next/server'
import {
  getAuthenticatedUser,
  resolveOrganizationContextById,
  AuthError,
} from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'
import {
  countServiceSeats,
  assignServiceSeat,
  removeServiceSeat,
} from '@/lib/commercial/seat-limits'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ADVISOR_OFFERING_KEY = 'ai_advisor_desk'

/**
 * GET — list active Advisor service seats for the organization.
 * Returns seat usage, limit, and the members currently assigned.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  const { orgId } = await params
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  let ctx
  try {
    ctx = await resolveOrganizationContextById(user, orgId)
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.code }, { status: 403 })
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  const isAdmin =
    ctx.organizationRole === 'owner' ||
    ctx.organizationRole === 'admin' ||
    ctx.isPlatformAdmin
  if (!isAdmin) return NextResponse.json({ error: 'unauthorized' }, { status: 403 })

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  // Resolve the offering id for ai_advisor_desk
  const { data: offering } = await serviceClient
    .from('offerings')
    .select('id')
    .eq('offering_key', ADVISOR_OFFERING_KEY)
    .single()

  if (!offering) {
    return NextResponse.json({
      seats: [],
      used: 0,
      limit: 3,
      available: 3,
    })
  }

  // Fetch active advisor seat assignments with member profile info
  const { data: seatRows } = await serviceClient
    .from('member_offering_roles')
    .select(`
      id,
      user_id,
      role,
      status,
      created_at,
      profiles!inner(email, display_name)
    `)
    .eq('organization_id', orgId)
    .eq('offering_id', offering.id)
    .eq('status', 'active')

  const seatCheck = await countServiceSeats(orgId, ADVISOR_OFFERING_KEY)

  const seats = (seatRows || []).map((s: any) => ({
    id: s.id,
    user_id: s.user_id,
    email: s.profiles?.email || '',
    display_name: s.profiles?.display_name || '',
    role: s.role,
  }))

  return NextResponse.json({
    seats,
    used: seatCheck.count,
    limit: seatCheck.limit ?? 3,
    available: seatCheck.limit === null ? null : Math.max(0, seatCheck.limit - seatCheck.count),
  })
}

/**
 * POST — assign Advisor access to a member.
 * Body: { userId: string }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  const { orgId } = await params
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  let ctx
  try {
    ctx = await resolveOrganizationContextById(user, orgId)
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.code }, { status: 403 })
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  const isAdmin =
    ctx.organizationRole === 'owner' ||
    ctx.organizationRole === 'admin' ||
    ctx.isPlatformAdmin
  if (!isAdmin) return NextResponse.json({ error: 'unauthorized' }, { status: 403 })

  const body = await request.json()
  const { userId } = body

  if (!userId || typeof userId !== 'string') {
    return NextResponse.json({ error: 'invalid_user' }, { status: 400 })
  }

  const result = await assignServiceSeat({
    orgId,
    userId,
    offeringKey: ADVISOR_OFFERING_KEY,
  })

  if (!result.success) {
    return NextResponse.json({ error: result.error || 'assign_failed' }, { status: 400 })
  }

  const serviceClient = createServiceClient()
  if (serviceClient) {
    await serviceClient.from('audit_events').insert({
      organization_id: orgId,
      actor_user_id: user.id,
      action: 'advisor_seat.assigned',
      entity_type: 'member_offering_role',
      entity_id: userId,
      metadata: { offering_key: ADVISOR_OFFERING_KEY },
    })
  }

  return NextResponse.json({ success: true })
}

/**
 * DELETE — remove Advisor access from a member.
 * Body: { userId: string }
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  const { orgId } = await params
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  let ctx
  try {
    ctx = await resolveOrganizationContextById(user, orgId)
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.code }, { status: 403 })
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  const isAdmin =
    ctx.organizationRole === 'owner' ||
    ctx.organizationRole === 'admin' ||
    ctx.isPlatformAdmin
  if (!isAdmin) return NextResponse.json({ error: 'unauthorized' }, { status: 403 })

  const body = await request.json()
  const { userId } = body

  if (!userId || typeof userId !== 'string') {
    return NextResponse.json({ error: 'invalid_user' }, { status: 400 })
  }

  const result = await removeServiceSeat({
    orgId,
    userId,
    offeringKey: ADVISOR_OFFERING_KEY,
  })

  if (!result.success) {
    return NextResponse.json({ error: result.error || 'remove_failed' }, { status: 400 })
  }

  const serviceClient = createServiceClient()
  if (serviceClient) {
    await serviceClient.from('audit_events').insert({
      organization_id: orgId,
      actor_user_id: user.id,
      action: 'advisor_seat.removed',
      entity_type: 'member_offering_role',
      entity_id: userId,
      metadata: { offering_key: ADVISOR_OFFERING_KEY },
    })
  }

  return NextResponse.json({ success: true })
}
