import { NextRequest, NextResponse } from 'next/server'
import { requirePlatformAdmin } from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/product-requests
 * Returns all product access requests for admin review.
 */
export async function GET() {
  try {
    await requirePlatformAdmin()
  } catch {
    return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
  }

  const sc = createServiceClient()
  if (!sc) return NextResponse.json({ error: 'service_unavailable' }, { status: 500 })

  const { data: requests } = await sc
    .from('product_access_requests')
    .select(`
      id,
      organization_id,
      user_id,
      offering_key,
      status,
      request_note,
      admin_note,
      created_at,
      reviewed_at,
      organizations!inner(name, slug),
      profiles:user_id(email, display_name)
    `)
    .order('created_at', { ascending: false })

  return NextResponse.json({ requests: requests || [] })
}

/**
 * PATCH /api/admin/product-requests
 * Update a product access request status (approve, activate, decline).
 */
export async function PATCH(req: NextRequest) {
  try {
    await requirePlatformAdmin()
  } catch {
    return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
  }

  const sc = createServiceClient()
  if (!sc) return NextResponse.json({ error: 'service_unavailable' }, { status: 500 })

  const body = await req.json()
  const { requestId, status, adminNote, createEntitlement } = body as {
    requestId: string
    status: 'approved' | 'activated' | 'declined'
    adminNote?: string
    createEntitlement?: boolean
  }

  if (!requestId || !status) {
    return NextResponse.json({ error: 'requestId and status required' }, { status: 400 })
  }

  // Get the request
  const { data: request, error: fetchError } = await sc
    .from('product_access_requests')
    .select('id, organization_id, user_id, offering_key, status')
    .eq('id', requestId)
    .single()

  if (fetchError || !request) {
    return NextResponse.json({ error: 'request_not_found' }, { status: 404 })
  }

  // Update the request
  const updateData: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (adminNote) {
    updateData.admin_note = adminNote
  }

  if (status === 'approved' || status === 'activated' || status === 'declined') {
    updateData.reviewed_at = new Date().toISOString()
  }

  const { error: updateError } = await sc
    .from('product_access_requests')
    .update(updateData)
    .eq('id', requestId)

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

  // If activating and createEntitlement is true, create the entitlement
  if (status === 'activated' && createEntitlement) {
    // Check if entitlement already exists
    const { data: existingEnt } = await sc
      .from('organization_entitlements')
      .select('id')
      .eq('organization_id', request.organization_id)
      .eq('offering_key', request.offering_key)
      .eq('effective_status', 'active')
      .single()

    if (!existingEnt) {
      // Get the offering ID
      const { data: offering } = await sc
        .from('offerings')
        .select('id')
        .eq('offering_key', request.offering_key)
        .single()

      if (offering) {
        await sc
          .from('organization_entitlements')
          .insert({
            organization_id: request.organization_id,
            offering_id: offering.id,
            offering_key: request.offering_key,
            effective_status: 'active',
            source: 'manual_activation',
            granted_at: new Date().toISOString(),
          })
      }
    }

    // Send activation email to customer
    try {
      const { sendProductActivatedEmail } = await import('@/lib/email')
      const { data: orgData } = await sc
        .from('organizations')
        .select('name, slug')
        .eq('id', request.organization_id)
        .single()
      const { data: userData } = await sc
        .from('profiles')
        .select('email, display_name')
        .eq('id', request.user_id)
        .single()

      const productNames: Record<string, { name: string; url: string }> = {
        haiec: { name: 'HAIEC', url: 'https://www.haiec.com' },
        kestrel: { name: 'KestrelVoice', url: 'https://www.kestrelvoice.com' },
      }
      const product = productNames[request.offering_key]

      if (product && userData?.email && orgData?.slug) {
        await sendProductActivatedEmail({
          to: userData.email,
          customerName: userData.display_name || undefined,
          productName: product.name,
          productUrl: product.url,
          orgSlug: orgData.slug,
          nextSteps: adminNote || undefined,
        })
      }
    } catch (err) {
      console.error('Failed to send product activation email:', err)
    }
  }

  // Audit event
  await sc.rpc('write_audit_event', {
    audit_action: `admin.product_request_${status}`,
    audit_entity_type: 'product_access_request',
    audit_org_id: request.organization_id,
    audit_entity_id: requestId,
    audit_metadata: { offering_key: request.offering_key, admin_note: adminNote || null } as any,
  })

  return NextResponse.json({ success: true })
}
