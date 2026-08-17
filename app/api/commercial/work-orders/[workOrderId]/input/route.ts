import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, resolveOrganizationContext, AuthError } from '@/lib/auth/organization-resolver'
import { getWorkOrder, addClientInput } from '@/lib/commercial/work-orders'
import { trackEvent } from '@/lib/commercial/analytics'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/commercial/work-orders/[workOrderId]/input
 * Add client input/comment to a Work Order.
 * author_role is always 'client' — enforced by DB trigger + service role.
 *
 * Body: { orgSlug, body: string }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ workOrderId: string }> }
) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { workOrderId } = await params
  const body = await req.json()
  const { orgSlug, body: inputBody } = body as {
    orgSlug: string
    body: string
  }

  if (!orgSlug || !inputBody || inputBody.trim().length === 0) {
    return NextResponse.json({ error: 'orgSlug and body are required' }, { status: 400 })
  }

  let ctx
  try {
    ctx = await resolveOrganizationContext(user, orgSlug)
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.code }, { status: 403 })
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  // Verify Work Order belongs to this org (tenant isolation)
  const wo = await getWorkOrder(workOrderId)
  if (!wo || (wo.organization_id !== ctx.organization.id && !ctx.isPlatformAdmin)) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  const result = await addClientInput({
    workOrderId,
    authorUserId: user.id,
    body: inputBody.trim(),
  })

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  await trackEvent({
    eventName: 'work_order_input_received',
    organizationId: ctx.organization.id,
    userId: user.id,
    offerKey: 'ai_automation_blueprint',
    metadata: { work_order_id: workOrderId },
  })

  return NextResponse.json({ success: true })
}
