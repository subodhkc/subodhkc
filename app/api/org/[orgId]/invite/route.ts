import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, resolveOrganizationContext, resolveOrganizationContextById, AuthError } from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'
import { sendInvitationEmail } from '@/lib/email'
import { countServiceSeats } from '@/lib/commercial/seat-limits'
import { recordFailure } from '@/lib/commercial/failures'
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
    ctx = await resolveOrganizationContextById(user, orgId)
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
  const { email, role, assignSeats } = body as {
    email: string
    role: string
    assignSeats?: string[]
  }

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

  // S1: Only check seat limits when service seats are explicitly requested.
  // A plain org member invitation must NOT be blocked by Advisor seat limits.
  // Organization membership and service seats are DISTINCT.
  const requestedSeats = Array.isArray(assignSeats) ? assignSeats : []
  if (requestedSeats.length > 0 && !ctx.isPlatformAdmin) {
    for (const offeringKey of requestedSeats) {
      const seatCheck = await countServiceSeats(orgId, offeringKey as any)
      if (!seatCheck.available) {
        return NextResponse.json({
          error: 'seat_limit_reached',
          message: `Your ${offeringKey} subscription allows ${seatCheck.limit} service seats. You currently have ${seatCheck.count} assigned. Remove a seat or invite without service access.`,
          offeringKey,
          currentSeats: seatCheck.count,
          limit: seatCheck.limit,
        }, { status: 402 })
      }
    }
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
      requested_seat_offerings: requestedSeats.length > 0 ? requestedSeats : null,
      email_sent: false,
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
    metadata: { email, role, requestedSeats },
  })

  // Send invitation email via Resend
  const emailResult = await sendInvitationEmail({
    to: email.toLowerCase(),
    orgName: ctx.organization.name,
    inviterName: user.displayName || user.email || 'A team member',
    role,
    token,
  })

  // S3: Record email_sent status on the invitation row
  await serviceClient
    .from('organization_invitations')
    .update({ email_sent: emailResult.success })
    .eq('id', invitation.id)

  if (!emailResult.success) {
    console.error('Failed to send invitation email:', emailResult.error)
    // S10: Record the email delivery failure for operator visibility
    await recordFailure({
      organizationId: orgId,
      userId: user.id,
      failureType: 'invitation',
      severity: 'warning',
      message: `Invitation email delivery failed for ${email}: ${emailResult.error}`,
      details: { invitation_id: invitation.id, email },
      retryable: true,
    }).catch(() => undefined)
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
