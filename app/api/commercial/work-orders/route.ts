import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, resolveOrganizationContext, AuthError } from '@/lib/auth/organization-resolver'
import { listWorkOrdersForOrg, createWorkOrderDraft, createCustomScopeWorkOrder, type WorkType } from '@/lib/commercial/work-orders'
import { trackEvent } from '@/lib/commercial/analytics'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/commercial/work-orders?orgSlug=<slug>
 * List Work Orders for an organization.
 */
export async function GET(req: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const orgSlug = searchParams.get('orgSlug')
  if (!orgSlug) return NextResponse.json({ error: 'orgSlug required' }, { status: 400 })

  let ctx
  try {
    ctx = await resolveOrganizationContext(user, orgSlug)
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.code }, { status: 403 })
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  const workOrders = await listWorkOrdersForOrg(ctx.organization.id)
  return NextResponse.json({ workOrders })
}

/**
 * POST /api/commercial/work-orders
 * Create a new Work Order draft or custom-scope request.
 * Body: { orgSlug, title, workType?, desiredOutcome?, scopeIncluded?, ..., customScope?: boolean }
 */
export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json()
  const {
    orgSlug,
    title,
    workType,
    desiredOutcome,
    scopeIncluded,
    scopeExcluded,
    requiredInputs,
    deliverableDescription,
    legacyQualificationId,
    targetDate,
    customScope,
    metadata,
  } = body as {
    orgSlug: string
    title: string
    workType?: WorkType
    desiredOutcome?: string
    scopeIncluded?: string
    scopeExcluded?: string
    requiredInputs?: string
    deliverableDescription?: string
    legacyQualificationId?: string
    targetDate?: string | null
    customScope?: boolean
    metadata?: Record<string, unknown>
  }

  if (!orgSlug || !title) {
    return NextResponse.json({ error: 'orgSlug and title are required' }, { status: 400 })
  }

  let ctx
  try {
    ctx = await resolveOrganizationContext(user, orgSlug)
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.code }, { status: 403 })
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  await trackEvent({
    eventName: 'work_order_created',
    organizationId: ctx.organization.id,
    userId: user.id,
    offerKey: 'ai_automation_blueprint',
    metadata: { custom_scope: !!customScope, work_type: workType || 'other' },
  })

  if (customScope) {
    const result = await createCustomScopeWorkOrder({
      organizationId: ctx.organization.id,
      requestedByUserId: user.id,
      title,
      workType: workType || 'other',
      desiredOutcome,
      legacyQualificationId,
      metadata,
    })
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
    return NextResponse.json({
      workOrderId: result.workOrderId,
      workOrderNumber: result.workOrderNumber,
      customScope: true,
    })
  }

  const result = await createWorkOrderDraft({
    organizationId: ctx.organization.id,
    requestedByUserId: user.id,
    title,
    workType: workType || 'other',
    desiredOutcome,
    scopeIncluded,
    scopeExcluded,
    requiredInputs,
    deliverableDescription,
    legacyQualificationId,
    targetDate,
    metadata,
  })

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  return NextResponse.json({
    workOrderId: result.workOrderId,
    workOrderNumber: result.workOrderNumber,
  })
}
