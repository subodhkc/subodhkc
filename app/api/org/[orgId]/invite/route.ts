import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, resolveOrganizationContext, AuthError } from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'
import { sendInvitationEmail } from '@/lib/email'
import { checkTeamSeatAvailable } from '@/lib/commercial/seat-limits'
import crypto from 'crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  const { orgId } = await params
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  let ctx
  try {
    ctx = await resolveOrganizationContext(user, orgId)
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.code }, { status: 403 })
    }
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  const isAdmin = ctx.organizationRole === 'owner' || ctx.organizationRole === 'admin' || ctx.isPlatformAdmin
  if (!isAdmin) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
  }

  const body = await request.json()
  const { email, role } = body

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 })
  }

  if (!['member', 'admin', 'owner'].includes(role)) {
    return NextResponse.json({ error: 'invalid_role' }, { status: 400 })
  }

  // Only owners can invite owners
  if (role === 'owner' && ctx.organizationRole !== 'owner' && !ctx.isPlatformAdmin) {
    return NextResponse.json({ error: 'only_owner_can_invite_owner' }, { status: 403 })
  }

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  // Check team seat limit
  const seatCheck = await checkTeamSeatAvailable(orgId)
  if (!seatCheck.available && !ctx.isPlatformAdmin) {
    return NextResponse.json({
      error: 'team_seat_limit_reached',
      message: `Your ${seatCheck.offerKey} subscription allows ${seatCheck.limit} team members. You currently have ${seatCheck.currentSeats}. Upgrade or remove a member to invite more.`,
      currentSeats: seatCheck.currentSeats,
      limit: seatCheck.limit,
    }, { status: 402 })
  }

  // Generate secure token
  const token = crypto.randomBytes(32).toString('hex')
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // 7-day expiry

  const { data: invitation, error } = await serviceClient
    .from('organization_invitations')
    .insert({
      organization_id: orgId,
      email: email.toLowerCase(),
      role,
      token_hash: tokenHash,
      invited_by: user.id,
      expires_at: expiresAt.toISOString(),
    })
    .select('id')
    .single()

  if (error) {
    return NextResponse.json({ error: 'invitation_failed' }, { status: 500 })
  }

  // Write audit event
  await serviceClient.from('audit_events').insert({
    organization_id: orgId,
    actor_user_id: user.id,
    action: 'invitation.created',
    entity_type: 'invitation',
    entity_id: invitation.id,
    metadata: { email, role },
  })

  // Send invitation email via Resend
  const emailResult = await sendInvitationEmail({
    to: email.toLowerCase(),
    orgName: ctx.organization.name,
    inviterName: user.displayName || user.email || 'A team member',
    role,
    token,
  })

  if (!emailResult.success) {
    console.error('Failed to send invitation email:', emailResult.error)
    // Invitation is created in DB even if email fails - admin can resend
  }

  return NextResponse.json({
    success: true,
    invitation_id: invitation.id,
    email_sent: emailResult.success,
    // Only return token in development
    ...(process.env.NODE_ENV === 'development' && { token }),
  })
}
