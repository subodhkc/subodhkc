import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, resolveOrganizationContext, AuthError } from '@/lib/auth/organization-resolver'
import { getWorkOrder, getCurrentScopeVersion, listScopeVersions } from '@/lib/commercial/work-orders'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/commercial/work-orders/[workOrderId]/scope?orgSlug=<slug>
 *
 * Returns the current offered scope version (immutable snapshot) plus the
 * version history. The client uses this to render the exact scope the
 * customer will accept — the customer does NOT supply scope fields at
 * acceptance time.
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
  if (!wo || (wo.organization_id !== ctx.organization.id && !ctx.isPlatformAdmin)) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  const [current, history] = await Promise.all([
    getCurrentScopeVersion(workOrderId),
    listScopeVersions(workOrderId),
  ])

  return NextResponse.json({
    workOrderStatus: wo.status,
    scopeStatus: wo.scope_status,
    currentScopeVersion: current,
    versions: history,
  })
}
