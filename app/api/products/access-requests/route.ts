import { NextRequest, NextResponse } from 'next/server'
import {
  getAuthenticatedUser,
  resolveOrganizationContext,
  AuthError,
} from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const AVAILABLE_PRODUCTS = [
  {
    offeringKey: 'haiec',
    name: 'HAIEC',
    description: 'AI compliance and governance platform — evidence-first frameworks for behavioral AI governance.',
    externalUrl: 'https://www.haiec.com',
    learnMoreHref: '/solutions/haiec',
  },
  {
    offeringKey: 'kestrel',
    name: 'KestrelVoice',
    description: 'AI voice receptionist platform — answers every call, books appointments, runs your front desk 24/7.',
    externalUrl: 'https://www.kestrelvoice.com',
    learnMoreHref: '/solutions/kestrelvoice',
  },
]

/**
 * GET /api/products/access-requests?orgSlug=...
 * Returns available products and any existing access requests for the org.
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
  if (!sc) return NextResponse.json({ error: 'service_unavailable' }, { status: 500 })

  // Get existing access requests for this org
  const { data: requests } = await sc
    .from('product_access_requests')
    .select('id, offering_key, status, request_note, admin_note, created_at, reviewed_at')
    .eq('organization_id', ctx.organization.id)
    .order('created_at', { ascending: false })

  // Check which products are already activated (have entitlements)
  const activeOfferingKeys = ctx.entitlements
    .filter(e => e.effective_status === 'active')
    .map(e => e.offering_key)

  const products = AVAILABLE_PRODUCTS.map(p => ({
    ...p,
    hasEntitlement: activeOfferingKeys.includes(p.offeringKey),
    requestStatus: requests?.find(r => r.offering_key === p.offeringKey)?.status || null,
    requestId: requests?.find(r => r.offering_key === p.offeringKey)?.id || null,
  }))

  return NextResponse.json({ products, requests: requests || [] })
}

/**
 * POST /api/products/access-requests
 * Submit a product access request.
 */
export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json()
  const { orgSlug, offeringKey, requestNote } = body as {
    orgSlug: string
    offeringKey: string
    requestNote?: string
  }

  if (!orgSlug || !offeringKey) {
    return NextResponse.json({ error: 'orgSlug and offeringKey required' }, { status: 400 })
  }

  // Validate offering key is in the available products list
  const product = AVAILABLE_PRODUCTS.find(p => p.offeringKey === offeringKey)
  if (!product) {
    return NextResponse.json({ error: 'invalid_product' }, { status: 400 })
  }

  let ctx
  try {
    ctx = await resolveOrganizationContext(user, orgSlug)
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.code }, { status: 403 })
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  const sc = createServiceClient()
  if (!sc) return NextResponse.json({ error: 'service_unavailable' }, { status: 500 })

  // Check if a request already exists
  const { data: existing } = await sc
    .from('product_access_requests')
    .select('id, status')
    .eq('organization_id', ctx.organization.id)
    .eq('offering_key', offeringKey)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (existing && (existing.status === 'requested' || existing.status === 'approved')) {
    return NextResponse.json({ error: 'request_already_exists', status: existing.status }, { status: 409 })
  }

  // Create the request
  const { data: request, error } = await sc
    .from('product_access_requests')
    .insert({
      organization_id: ctx.organization.id,
      user_id: user.id,
      offering_key: offeringKey,
      status: 'requested',
      request_note: requestNote || null,
    })
    .select('id, offering_key, status, created_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Send notification email to Subodh
  try {
    const { data: orgData } = await sc
      .from('organizations')
      .select('name')
      .eq('id', ctx.organization.id)
      .single()

    // Log the request for now; email notification can be added when email helper supports it
    console.log(`Product access request: ${product.name} requested by ${orgData?.name || ctx.organization.slug}`)
  } catch (err) {
    console.error('Failed to send product request notification:', err)
  }

  // Audit event
  await sc.rpc('write_audit_event', {
    audit_action: 'product.access_requested',
    audit_entity_type: 'product_access_request',
    audit_org_id: ctx.organization.id,
    audit_entity_id: request.id,
    audit_metadata: { offering_key: offeringKey, product_name: product.name } as any,
  })

  return NextResponse.json({ success: true, request })
}

/**
 * DELETE /api/products/access-requests
 * Cancel a pending product access request.
 */
export async function DELETE(req: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json()
  const { orgSlug, requestId } = body as { orgSlug: string; requestId: string }

  if (!orgSlug || !requestId) {
    return NextResponse.json({ error: 'orgSlug and requestId required' }, { status: 400 })
  }

  let ctx
  try {
    ctx = await resolveOrganizationContext(user, orgSlug)
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.code }, { status: 403 })
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  const sc = createServiceClient()
  if (!sc) return NextResponse.json({ error: 'service_unavailable' }, { status: 500 })

  const { error } = await sc
    .from('product_access_requests')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', requestId)
    .eq('organization_id', ctx.organization.id)
    .eq('status', 'requested')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
