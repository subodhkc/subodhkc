import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, resolveOrganizationContext, AuthError } from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'
import { sendInvitationEmail } from '@/lib/email'
import crypto from 'crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string; invitationId: string }> }
) {
  const { orgId, invitationId } = await params
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  let ctx
  try {
    ctx = await resolveOrganizationContext(user, orgId)
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.code }, { status: 403 })
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  const isAdmin = ctx.organizationRole === 'owner' || ctx.organizationRole === 'admin' || ctx.isPlatformAdmin
  if (!isAdmin) return NextResponse.json({ error: 'unauthorized' }, { status: 403 })

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  // Fetch the invitation
  const { data: invitation, error: fetchError } = await serviceClient
    .from('organization_invitations')
    .select('id, email, role, expires_at, accepted_at, revoked_at')
    .eq('id', invitationId)
    .eq('organization_id', orgId)
    .single()

  if (fetchError || !invitation) {
    return NextResponse.json({ error: 'invitation_not_found' }, { status: 404 })
  }

  if (invitation.accepted_at) {
    return NextResponse.json({ error: 'already_accepted' }, { status: 400 })
  }

  if (invitation.revoked_at) {
    return NextResponse.json({ error: 'invitation_revoked' }, { status: 400 })
  }

  // Generate new token and extend expiry
  const token = crypto.randomBytes(32).toString('hex')
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  const { error: updateError } = await serviceClient
    .from('organization_invitations')
    .update({
      token_hash: tokenHash,
      expires_at: expiresAt.toISOString(),
    })
    .eq('id', invitationId)

  if (updateError) {
    return NextResponse.json({ error: 'resend_failed' }, { status: 500 })
  }

  // Audit event
  await serviceClient.from('audit_events').insert({
    organization_id: orgId,
    actor_user_id: user.id,
    action: 'invitation.resent',
    entity_type: 'invitation',
    entity_id: invitationId,
    metadata: { email: invitation.email },
  })

  // Send email
  await sendInvitationEmail({
    to: invitation.email,
    orgName: ctx.organization.name,
    inviterName: user.displayName || user.email || 'A team member',
    role: invitation.role,
    token,
  })

  return NextResponse.json({ success: true })
}
