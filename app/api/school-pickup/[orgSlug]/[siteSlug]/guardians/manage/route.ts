import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { getAuthenticatedUser } from '@/lib/auth/organization-resolver'
import { resolveSchoolContext, SchoolAuthError } from '@/lib/auth/school-resolver'
import { sendGuardianInvitationEmail } from '@/lib/email'
import crypto from 'crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// PATCH: Update guardian status or link properties
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
    if (err instanceof SchoolAuthError) return NextResponse.json({ error: err.code }, { status: 403 })
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  if (!ctx.canEditRoster) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
  }

  const body = await request.json()
  const { guardian_id, action, link_id, portal_access, self_checkin_allowed, reason } = body

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  if (action === 'revoke') {
    // Revoke guardian access
    const { error } = await serviceClient
      .from('school_guardians')
      .update({
        status: 'revoked',
        revoked_at: new Date().toISOString(),
        revoked_reason: reason || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', guardian_id)
      .eq('school_site_id', ctx.site.id)

    if (error) return NextResponse.json({ error: 'update_failed' }, { status: 500 })

    // Revoke all pending invitations
    await serviceClient
      .from('guardian_invitations')
      .update({ status: 'revoked', revoked_at: new Date().toISOString() })
      .eq('guardian_id', guardian_id)
      .eq('status', 'pending')

    // Audit event
    await serviceClient.from('audit_events').insert({
      organization_id: ctx.organization.organization.id,
      entity_type: 'guardian',
      entity_id: guardian_id,
      event_type: 'guardian.revoked',
      actor_user_id: user.id,
      metadata: { reason, site_id: ctx.site.id },
    })

    return NextResponse.json({ success: true })
  }

  if (action === 'suspend') {
    const { error } = await serviceClient
      .from('school_guardians')
      .update({ status: 'suspended', updated_at: new Date().toISOString() })
      .eq('id', guardian_id)
      .eq('school_site_id', ctx.site.id)

    if (error) return NextResponse.json({ error: 'update_failed' }, { status: 500 })

    await serviceClient.from('audit_events').insert({
      organization_id: ctx.organization.organization.id,
      entity_type: 'guardian',
      entity_id: guardian_id,
      event_type: 'guardian.suspended',
      actor_user_id: user.id,
      metadata: { site_id: ctx.site.id },
    })

    return NextResponse.json({ success: true })
  }

  if (action === 'reactivate') {
    const { error } = await serviceClient
      .from('school_guardians')
      .update({ status: 'active', revoked_at: null, revoked_reason: null, updated_at: new Date().toISOString() })
      .eq('id', guardian_id)
      .eq('school_site_id', ctx.site.id)

    if (error) return NextResponse.json({ error: 'update_failed' }, { status: 500 })

    await serviceClient.from('audit_events').insert({
      organization_id: ctx.organization.organization.id,
      entity_type: 'guardian',
      entity_id: guardian_id,
      event_type: 'guardian.activated',
      actor_user_id: user.id,
      metadata: { site_id: ctx.site.id },
    })

    return NextResponse.json({ success: true })
  }

  if (action === 'resend_invitation') {
    // Get guardian email
    const { data: guardian } = await serviceClient
      .from('school_guardians')
      .select('email_normalized')
      .eq('id', guardian_id)
      .eq('school_site_id', ctx.site.id)
      .single()

    if (!guardian) return NextResponse.json({ error: 'guardian_not_found' }, { status: 404 })

    const token = crypto.randomBytes(32).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

    // Revoke existing pending invitations
    await serviceClient
      .from('guardian_invitations')
      .update({ status: 'revoked', revoked_at: new Date().toISOString() })
      .eq('guardian_id', guardian_id)
      .eq('status', 'pending')

    // Create new invitation
    const { error: invError } = await serviceClient.from('guardian_invitations').insert({
      organization_id: ctx.organization.organization.id,
      school_site_id: ctx.site.id,
      guardian_id: guardian_id,
      email: guardian.email_normalized,
      token_hash: tokenHash,
      invited_by: user.id,
      status: 'pending',
    })

    if (invError) return NextResponse.json({ error: 'invitation_failed' }, { status: 500 })

    const result = await sendGuardianInvitationEmail({
      to: guardian.email_normalized,
      orgName: ctx.organization.organization.name,
      siteName: ctx.site.name,
      inviterName: user.email || 'School Administrator',
      token,
    })

    if (!result.success) {
      await serviceClient
        .from('guardian_invitations')
        .update({ status: 'failed' })
        .eq('guardian_id', guardian_id)
        .eq('token_hash', tokenHash)
    }

    // Audit event
    await serviceClient.from('audit_events').insert({
      organization_id: ctx.organization.organization.id,
      entity_type: 'guardian',
      entity_id: guardian_id,
      event_type: 'guardian.invitation_resent',
      actor_user_id: user.id,
      metadata: { sent: result.success },
    })

    return NextResponse.json({ success: true, sent: result.success, error: result.error })
  }

  if (action === 'update_link') {
    // Update a student guardian link
    const updates: Record<string, any> = { updated_at: new Date().toISOString() }
    if (typeof portal_access === 'boolean') updates.portal_access = portal_access
    if (typeof self_checkin_allowed === 'boolean') updates.self_checkin_allowed = self_checkin_allowed

    const { error } = await serviceClient
      .from('student_guardian_links')
      .update(updates)
      .eq('id', link_id)
      .eq('school_site_id', ctx.site.id)

    if (error) return NextResponse.json({ error: 'update_failed' }, { status: 500 })

    await serviceClient.from('audit_events').insert({
      organization_id: ctx.organization.organization.id,
      entity_type: 'guardian_student',
      entity_id: link_id,
      event_type: 'guardian_student.access_changed',
      actor_user_id: user.id,
      metadata: { portal_access, self_checkin_allowed },
    })

    return NextResponse.json({ success: true })
  }

  if (action === 'unlink') {
    // Revoke a student guardian link
    const { error } = await serviceClient
      .from('student_guardian_links')
      .update({ status: 'revoked', revoked_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', link_id)
      .eq('school_site_id', ctx.site.id)

    if (error) return NextResponse.json({ error: 'update_failed' }, { status: 500 })

    await serviceClient.from('audit_events').insert({
      organization_id: ctx.organization.organization.id,
      entity_type: 'guardian_student',
      entity_id: link_id,
      event_type: 'guardian_student.unlinked',
      actor_user_id: user.id,
    })

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'invalid_action' }, { status: 400 })
}
