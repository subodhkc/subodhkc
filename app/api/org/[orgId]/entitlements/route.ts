import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, resolveOrganizationContext, AuthError } from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'

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
    if (err instanceof AuthError) return NextResponse.json({ error: err.code }, { status: 403 })
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  const isAdmin = ctx.organizationRole === 'owner' || ctx.organizationRole === 'admin' || ctx.isPlatformAdmin
  if (!isAdmin) return NextResponse.json({ error: 'unauthorized' }, { status: 403 })

  const body = await request.json()
  const { offering_id } = body

  if (!offering_id) return NextResponse.json({ error: 'offering_id_required' }, { status: 400 })

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  const { data, error } = await serviceClient
    .from('organization_entitlements')
    .insert({
      organization_id: orgId,
      offering_id,
      status: 'active',
      source_type: 'manual',
    })
    .select('id')
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'entitlement_exists' }, { status: 409 })
    }
    return NextResponse.json({ error: 'create_failed' }, { status: 500 })
  }

  await serviceClient.from('audit_events').insert({
    organization_id: orgId,
    actor_user_id: user.id,
    action: 'entitlement.created',
    entity_type: 'entitlement',
    entity_id: data.id,
    metadata: { offering_id },
  })

  return NextResponse.json({ success: true, id: data.id })
}

export async function PATCH(
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
    if (err instanceof AuthError) return NextResponse.json({ error: err.code }, { status: 403 })
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  const isAdmin = ctx.organizationRole === 'owner' || ctx.organizationRole === 'admin' || ctx.isPlatformAdmin
  if (!isAdmin) return NextResponse.json({ error: 'unauthorized' }, { status: 403 })

  const body = await request.json()
  const { offering_id, action } = body

  if (!offering_id || !['suspend', 'activate', 'revoke'].includes(action)) {
    return NextResponse.json({ error: 'invalid_params' }, { status: 400 })
  }

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  const statusMap: Record<string, string> = {
    suspend: 'suspended',
    activate: 'active',
    revoke: 'revoked',
  }

  const { error } = await serviceClient
    .from('organization_entitlements')
    .update({ status: statusMap[action] })
    .eq('organization_id', orgId)
    .eq('offering_id', offering_id)

  if (error) return NextResponse.json({ error: 'update_failed' }, { status: 500 })

  await serviceClient.from('audit_events').insert({
    organization_id: orgId,
    actor_user_id: user.id,
    action: `entitlement.${action}d`,
    entity_type: 'entitlement',
    metadata: { offering_id },
  })

  return NextResponse.json({ success: true })
}
