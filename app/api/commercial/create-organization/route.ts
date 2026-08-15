import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'
import { rateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/commercial/create-organization
 * Creates a new workspace (organization) with the authenticated user as owner.
 * Uses atomic RPC: create_commercial_organization
 * Server derives creator identity from auth - never trusts client-supplied user ID.
 */
export async function POST(req: NextRequest) {
  const limited = rateLimit(req)
  if (limited) return limited

  const user = await getAuthenticatedUser()
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const body = await req.json()
  const { name, organizationKind } = body as {
    name?: string
    organizationKind?: string
  }

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return NextResponse.json({ error: 'Organization name is required' }, { status: 400 })
  }

  const validKinds = ['business', 'school', 'nonprofit', 'individual', 'internal', 'other']
  const kind = organizationKind && validKinds.includes(organizationKind) ? organizationKind : 'business'

  const sc = createServiceClient()
  if (!sc) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 500 })
  }

  // Call atomic RPC - creates org + owner membership in a single transaction
  const { data, error } = await sc.rpc('create_commercial_organization', {
    p_name: name.trim(),
    p_organization_kind: kind,
    p_creator_id: user.id,
  })

  if (error || !data || data.length === 0) {
    console.error('Failed to create organization:', error?.message)
    return NextResponse.json({ error: 'organization_creation_failed' }, { status: 500 })
  }

  const result = data[0]

  return NextResponse.json({
    organization: {
      id: result.org_id,
      name: result.org_name,
      slug: result.org_slug,
    },
  })
}
