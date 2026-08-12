import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// PATCH: approve or reject a join request
export async function PATCH(request: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const body = await request.json()
  const { request_id, action, notes } = body

  if (!request_id || !['approve', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'invalid_params' }, { status: 400 })
  }

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  // Fetch the request
  const { data: joinRequest, error: fetchError } = await serviceClient
    .from('join_requests')
    .select('id, organization_id, user_id, requested_role, status')
    .eq('id', request_id)
    .single()

  if (fetchError || !joinRequest) {
    return NextResponse.json({ error: 'request_not_found' }, { status: 404 })
  }

  if (joinRequest.status !== 'pending') {
    return NextResponse.json({ error: 'request_not_pending' }, { status: 400 })
  }

  // Verify admin access to this org
  const { data: membership } = await serviceClient
    .from('organization_memberships')
    .select('role')
    .eq('organization_id', joinRequest.organization_id)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  const isOrgAdmin = membership?.role === 'owner' || membership?.role === 'admin' || user.isPlatformAdmin
  if (!isOrgAdmin) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
  }

  // Prevent self-approval
  if (joinRequest.user_id === user.id) {
    return NextResponse.json({ error: 'cannot_approve_own_request' }, { status: 400 })
  }

  const newStatus = action === 'approve' ? 'approved' : 'rejected'

  if (action === 'approve') {
    // Create membership
    const { error: memberError } = await serviceClient
      .from('organization_memberships')
      .insert({
        organization_id: joinRequest.organization_id,
        user_id: joinRequest.user_id,
        role: joinRequest.requested_role,
        status: 'active',
      })

    if (memberError) {
      // Maybe already a member
      if (memberError.code === '23505') {
        // Update request to approved anyway
        await serviceClient
          .from('join_requests')
          .update({
            status: newStatus,
            reviewed_by: user.id,
            reviewed_at: new Date().toISOString(),
            reviewer_notes: notes || null,
          })
          .eq('id', request_id)
        return NextResponse.json({ success: true, already_member: true })
      }
      return NextResponse.json({ error: 'membership_creation_failed' }, { status: 500 })
    }
  }

  // Update request status
  const { error: updateError } = await serviceClient
    .from('join_requests')
    .update({
      status: newStatus,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      reviewer_notes: notes || null,
    })
    .eq('id', request_id)

  if (updateError) {
    return NextResponse.json({ error: 'update_failed' }, { status: 500 })
  }

  // Audit event
  await serviceClient.from('audit_events').insert({
    organization_id: joinRequest.organization_id,
    actor_user_id: user.id,
    action: action === 'approve' ? 'join_request.approved' : 'join_request.rejected',
    entity_type: 'join_request',
    entity_id: request_id,
    metadata: { user_id: joinRequest.user_id, role: joinRequest.requested_role },
  })

  return NextResponse.json({ success: true })
}
