import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, resolveOrganizationContext, AuthError } from '@/lib/auth/organization-resolver'
import {
  getWorkOrder,
  getCurrentScopeVersion,
  acceptWorkOrderScope,
} from '@/lib/commercial/work-orders'
import { resolveWorkOrderAuthority } from '@/lib/commercial/work-order-auth'
import { trackEvent } from '@/lib/commercial/analytics'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/commercial/work-orders/[workOrderId]/scope/accept
 *
 * Section B/C/D: the client sends ONLY:
 *   { orgSlug, scopeVersionId, accept: true }
 *
 * The server loads the canonical immutable scope version, validates it is
 * the current offered version, and records acceptance via the
 * `accept_work_order_scope` RPC (transactional). The client does NOT supply
 * scope fields (title, scopeIncluded, price, etc.) — accepting a fresh copy
 * of fields from the browser is not acceptance.
 *
 * If the acceptor is owner/admin, the Work Order transitions to
 * ready_for_checkout. If the acceptor is a service-seat member (not
 * owner/admin), it transitions to awaiting_owner_approval.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ workOrderId: string }> }
) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { workOrderId } = await params
  const body = await req.json()
  const { orgSlug, scopeVersionId, accept } = body as {
    orgSlug: string
    scopeVersionId?: string
    accept?: boolean
  }

  if (!orgSlug) {
    return NextResponse.json({ error: 'orgSlug required' }, { status: 400 })
  }
  if (!scopeVersionId) {
    return NextResponse.json({ error: 'scopeVersionId required' }, { status: 400 })
  }
  if (accept !== true) {
    return NextResponse.json({ error: 'accept must be true' }, { status: 400 })
  }

  let ctx
  try {
    ctx = await resolveOrganizationContext(user, orgSlug)
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.code }, { status: 403 })
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  // Verify Work Order belongs to this org
  const wo = await getWorkOrder(workOrderId)
  if (!wo || (wo.organization_id !== ctx.organization.id && !ctx.isPlatformAdmin)) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  // Only allow acceptance when the Work Order is awaiting client acceptance
  if (wo.status !== 'awaiting_client_acceptance' && wo.status !== 'awaiting_approval') {
    return NextResponse.json({
      error: 'work_order_not_awaiting_acceptance',
      message: `Status is ${wo.status}, must be awaiting_client_acceptance.`,
    }, { status: 400 })
  }

  // Validate the offered scope version exists and is the current one
  const currentVersion = await getCurrentScopeVersion(workOrderId)
  if (!currentVersion) {
    return NextResponse.json({ error: 'no_current_scope_version' }, { status: 400 })
  }
  if (currentVersion.id !== scopeVersionId) {
    return NextResponse.json({
      error: 'stale_scope_version',
      message: 'The scope version you are accepting is no longer the current offered version.',
    }, { status: 409 })
  }
  if (currentVersion.version_status !== 'sent_to_client') {
    return NextResponse.json({
      error: 'scope_version_not_awaiting_acceptance',
      message: `Scope version state is ${currentVersion.version_status}.`,
    }, { status: 400 })
  }

  // Resolve authority to decide the transition target
  const authority = resolveWorkOrderAuthority(ctx)
  if (!authority.canRequest) {
    return NextResponse.json({ error: 'not_authorized_to_accept' }, { status: 403 })
  }
  const isOwnerAdmin = authority.canPurchase

  const result = await acceptWorkOrderScope({
    workOrderId,
    scopeVersionId,
    acceptedBy: user.id,
    isOwnerAdmin,
  })

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  await trackEvent({
    eventName: 'work_order_scope_accepted',
    organizationId: ctx.organization.id,
    userId: user.id,
    offerKey: 'ai_automation_blueprint',
    metadata: {
      work_order_id: workOrderId,
      scope_version_id: scopeVersionId,
      price_cents: currentVersion.price_cents,
      target_status: result.targetStatus,
    },
  })

  return NextResponse.json({
    acceptanceId: result.acceptanceId,
    workOrderId,
    status: result.targetStatus,
    scopeVersionId,
  })
}
