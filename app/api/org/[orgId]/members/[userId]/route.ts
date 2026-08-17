import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, resolveOrganizationContext, resolveOrganizationContextById, AuthError } from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'
import { sendRoleChangeEmail, sendRemovalEmail } from '@/lib/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string; userId: string }> }
) {
  const { orgId, userId } = await params
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  let ctx
  try {
    ctx = await resolveOrganizationContextById(user, orgId)
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.code }, { status: 403 })
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  const isOwnerOrAdmin = ctx.organizationRole === 'owner' || ctx.organizationRole === 'admin' || ctx.isPlatformAdmin
  if (!isOwnerOrAdmin) return NextResponse.json({ error: 'unauthorized' }, { status: 403 })

  const body = await request.json()
  const { role } = body

  if (!['member', 'admin', 'owner'].includes(role)) {
    return NextResponse.json({ error: 'invalid_role' }, { status: 400 })
  }

  // Only owners can promote to owner
  if (role === 'owner' && ctx.organizationRole !== 'owner' && !ctx.isPlatformAdmin) {
    return NextResponse.json({ error: 'only_owner_can_promote_owner' }, { status: 403 })
  }

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  const { error } = await serviceClient
    .from('organization_memberships')
    .update({ role })
    .eq('organization_id', orgId)
    .eq('user_id', userId)
    .eq('status', 'active')

  if (error) {
    if (error.message.includes('last_owner_protection')) {
      return NextResponse.json({ error: 'last_owner_protection' }, { status: 400 })
    }
    return NextResponse.json({ error: 'update_failed' }, { status: 500 })
  }

  await serviceClient.from('audit_events').insert({
    organization_id: orgId,
    actor_user_id: user.id,
    action: 'membership.role_changed',
    entity_type: 'membership',
    entity_id: userId,
    metadata: { new_role: role },
  })

  // Send notification email to the affected member
  const { data: memberProfile } = await serviceClient
    .from('profiles')
    .select('email')
    .eq('id', userId)
    .single()

  if (memberProfile?.email) {
    await sendRoleChangeEmail({
      to: memberProfile.email,
      orgName: ctx.organization.name,
      newRole: role,
      changedBy: user.displayName || user.email || 'An administrator',
    })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string; userId: string }> }
) {
  const { orgId, userId } = await params
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  let ctx
  try {
    ctx = await resolveOrganizationContextById(user, orgId)
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.code }, { status: 403 })
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  const isAdmin = ctx.organizationRole === 'owner' || ctx.organizationRole === 'admin' || ctx.isPlatformAdmin
  if (!isAdmin) return NextResponse.json({ error: 'unauthorized' }, { status: 403 })

  if (userId === user.id) {
    return NextResponse.json({ error: 'cannot_remove_self' }, { status: 400 })
  }

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  const { error } = await serviceClient.rpc('remove_member', {
    org_id: orgId,
    member_user_id: userId,
  })

  if (error) {
    if (error.message.includes('last_owner_protection')) {
      return NextResponse.json({ error: 'last_owner_protection' }, { status: 400 })
    }
    return NextResponse.json({ error: 'removal_failed' }, { status: 500 })
  }

  // Send notification email to the removed member
  const { data: memberProfile } = await serviceClient
    .from('profiles')
    .select('email')
    .eq('id', userId)
    .single()

  if (memberProfile?.email) {
    await sendRemovalEmail({
      to: memberProfile.email,
      orgName: ctx.organization.name,
      removedBy: user.displayName || user.email || 'An administrator',
    })
  }

  // Write audit event
  await serviceClient.from('audit_events').insert({
    organization_id: orgId,
    actor_user_id: user.id,
    action: 'membership.removed',
    entity_type: 'membership',
    entity_id: userId,
  })

  return NextResponse.json({ success: true })
}
