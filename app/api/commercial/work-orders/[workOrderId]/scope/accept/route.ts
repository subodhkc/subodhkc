import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, resolveOrganizationContext, AuthError } from '@/lib/auth/organization-resolver'
import { getWorkOrder, recordScopeAcceptance, buildStandardScopeSnapshot, type WorkType } from '@/lib/commercial/work-orders'
import { trackEvent } from '@/lib/commercial/analytics'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/commercial/work-orders/[workOrderId]/scope/accept
 * Accept the scope for a Work Order. Server generates the scope snapshot and hash.
 * The client does NOT supply the hash — it is computed server-side.
 *
 * Body: { orgSlug, scopeParams: { title, workType, desiredOutcome, ... } }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ workOrderId: string }> }
) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { workOrderId } = await params
  const body = await req.json()
  const { orgSlug, scopeParams } = body as {
    orgSlug: string
    scopeParams: {
      title: string
      workType: WorkType
      desiredOutcome: string
      scopeIncluded?: string
      scopeExcluded?: string
      requiredInputs?: string
      deliverableDescription?: string
      targetDate?: string | null
    }
  }

  if (!orgSlug || !scopeParams) {
    return NextResponse.json({ error: 'orgSlug and scopeParams are required' }, { status: 400 })
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

  // Build canonical scope snapshot (server-side, not client-supplied)
  const snapshot = buildStandardScopeSnapshot({
    title: scopeParams.title,
    workType: scopeParams.workType,
    desiredOutcome: scopeParams.desiredOutcome,
    scopeIncluded: scopeParams.scopeIncluded,
    scopeExcluded: scopeParams.scopeExcluded,
    requiredInputs: scopeParams.requiredInputs,
    deliverableDescription: scopeParams.deliverableDescription,
    targetDate: scopeParams.targetDate,
  })

  const result = await recordScopeAcceptance({
    workOrderId,
    scopeSnapshot: snapshot,
    acceptedBy: user.id, // authenticated user — not client-supplied
  })

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  await trackEvent({
    eventName: 'work_order_scope_accepted',
    organizationId: ctx.organization.id,
    userId: user.id,
    offerKey: 'ai_automation_blueprint',
    metadata: { work_order_id: workOrderId, price_cents: snapshot.price_cents },
  })

  return NextResponse.json({
    acceptanceId: result.acceptanceId,
    workOrderId,
    status: 'ready_for_checkout',
  })
}
