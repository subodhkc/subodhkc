import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, resolveOrganizationContext, AuthError } from '@/lib/auth/organization-resolver'
import { getWorkOrder, listWorkOrderUpdates, getScopeAcceptance, type WorkOrder } from '@/lib/commercial/work-orders'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/commercial/work-orders/[workOrderId]?orgSlug=<slug>
 * Get a single Work Order with updates and scope acceptance.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ workOrderId: string }> }
) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { workOrderId } = await params
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

  const wo = await getWorkOrder(workOrderId)
  if (!wo) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  // Tenant isolation: verify Work Order belongs to this org
  if (wo.organization_id !== ctx.organization.id && !ctx.isPlatformAdmin) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  const [updates, scopeAcceptance] = await Promise.all([
    listWorkOrderUpdates(workOrderId, ctx.isPlatformAdmin),
    getScopeAcceptance(workOrderId),
  ])

  return NextResponse.json({
    workOrder: wo,
    updates,
    scopeAcceptance,
  })
}
