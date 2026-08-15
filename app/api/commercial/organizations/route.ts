import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/organization-resolver'
import { getPurchaseEligibleOrganizations } from '@/lib/commercial/purchase-auth'
import { rateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/commercial/organizations
 * Returns organizations the authenticated user is authorized to purchase for.
 * Only returns orgs where user has owner/admin role and org is active.
 */
export async function GET(req: NextRequest) {
  const limited = rateLimit(req)
  if (limited) return limited

  const user = await getAuthenticatedUser()
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const orgs = await getPurchaseEligibleOrganizations(user)

  return NextResponse.json({ organizations: orgs })
}
