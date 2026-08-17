import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/organization-resolver'
import { getFulfillmentState } from '@/lib/commercial/work-orders'
import { createServiceClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/commercial/fulfillment-status?session_id=<stripe_session_id>
 * Poll Work Order fulfillment state after checkout.
 * Verifies the session belongs to the authenticated user's organization.
 */
export async function GET(req: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('session_id')
  if (!sessionId) return NextResponse.json({ error: 'session_id required' }, { status: 400 })

  // Get fulfillment state from Work Order
  const result = await getFulfillmentState(sessionId)
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 404 })
  }

  // Verify ownership: the Work Order's org must include the authenticated user
  const sc = createServiceClient()
  if (!sc) return NextResponse.json({ error: 'config' }, { status: 500 })

  const { data: membership } = await sc
    .from('organization_memberships')
    .select('organization_id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .eq('organization_id', result.workOrder!.organization_id)
    .single()

  if (!membership && !user.isPlatformAdmin) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  return NextResponse.json({
    state: result.state,
    workOrder: result.workOrder,
  })
}
