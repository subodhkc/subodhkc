import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, resolveOrganizationContext, AuthError } from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/commercial/advisor-desk/watchlist?orgSlug=<slug>
 * Returns the organization's advisor watchlist items.
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

  const sc = createServiceClient()
  if (!sc) return NextResponse.json({ error: 'config' }, { status: 500 })

  const { data: items } = await sc
    .from('advisor_watchlist_items')
    .select('*')
    .eq('organization_id', ctx.organization.id)
    .order('created_at', { ascending: false })

  return NextResponse.json({ items: items || [] })
}

/**
 * PATCH /api/commercial/advisor-desk/watchlist
 * Update a watchlist item status (e.g., mark as addressed).
 * Body: { itemId, status, recommendedNextAction? }
 */
export async function PATCH(req: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json()
  const { itemId, status } = body as {
    itemId: string
    status: 'watching' | 'active' | 'addressed' | 'closed'
  }

  if (!itemId || !status) {
    return NextResponse.json({ error: 'itemId and status are required' }, { status: 400 })
  }

  const sc = createServiceClient()
  if (!sc) return NextResponse.json({ error: 'config' }, { status: 500 })

  // Verify the item belongs to an org the user is a member of
  const { data: item } = await sc
    .from('advisor_watchlist_items')
    .select('id, organization_id')
    .eq('id', itemId)
    .single()

  if (!item) return NextResponse.json({ error: 'item_not_found' }, { status: 404 })

  // Verify membership via context resolver
  try {
    // We need the org slug; fetch it
    const { data: org } = await sc
      .from('organizations')
      .select('slug')
      .eq('id', item.organization_id)
      .single()
    if (!org) return NextResponse.json({ error: 'org_not_found' }, { status: 404 })
    await resolveOrganizationContext(user, org.slug)
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.code }, { status: 403 })
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  const { data: updated, error } = await sc
    .from('advisor_watchlist_items')
    .update({ status })
    .eq('id', itemId)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: 'failed_to_update' }, { status: 500 })

  return NextResponse.json({ item: updated })
}
