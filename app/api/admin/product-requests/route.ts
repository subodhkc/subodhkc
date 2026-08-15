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

  // If activating and createEntitlement is true, provision the external account
  // and create the entitlement in SubodhKC DB
  let provisioningResult: {
    success: boolean
    externalUserId?: string
    externalTenantId?: string
    launchUrl: string
    message: string
    provisioningMethod: string
    error?: string
    requiresManualAction?: boolean
    manualInstructions?: string
  } | null = null

  if (status === 'activated' && createEntitlement) {
    // Fetch org and user data needed for provisioning
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

    const customerEmail = userData?.email || ''
    const customerName = userData?.display_name || null
    const orgName = orgData?.name || ''
    const orgSlug = orgData?.slug || ''

    // Step 1: Attempt external provisioning via adapter
    if (customerEmail) {
      try {
        const { getProvisioningAdapter, getDefaultLaunchUrl } = await import('@/lib/provisioning/adapter')
        const adapter = await getProvisioningAdapter(request.offering_key)

        if (adapter) {
          const result = await adapter.provision({
            customerEmail,
            customerName,
            organizationName: orgName,
            organizationSlug: orgSlug,
            adminNote,
          })

          if (result.success) {
            provisioningResult = {
              success: true,
              externalUserId: result.externalUserId,
              externalTenantId: result.externalTenantId,
              launchUrl: result.launchUrl,
              message: result.message,
              provisioningMethod: result.provisioningMethod,
            }
          } else {
            provisioningResult = {
              success: false,
              launchUrl: getDefaultLaunchUrl(request.offering_key),
              message: result.error,
              provisioningMethod: 'manual',
              requiresManualAction: result.requiresManualAction,
              manualInstructions: result.manualInstructions,
            }
          }
        }
      } catch (err) {
        console.error('Provisioning adapter error:', err)
        const { getDefaultLaunchUrl } = await import('@/lib/provisioning/adapter')
        provisioningResult = {
          success: false,
          launchUrl: getDefaultLaunchUrl(request.offering_key),
          message: 'Provisioning adapter failed unexpectedly',
          provisioningMethod: 'manual',
          requiresManualAction: true,
        }
      }
    }

    // Step 2: Create the entitlement in SubodhKC DB regardless of external
    // provisioning result — the entitlement tracks that SubodhKC approved access.
    // External provisioning status is stored separately.
    const { data: existingEnt } = await sc
      .from('organization_entitlements')
      .select('id')
      .eq('organization_id', request.organization_id)
      .eq('offering_key', request.offering_key)
      .eq('effective_status', 'active')
      .single()

    if (!existingEnt) {
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
            source: provisioningResult?.success ? 'api_provisioning' : 'manual_activation',
            granted_at: new Date().toISOString(),
          })
      }
    }

    // Step 3: Store external provisioning result in external_system_links
    if (provisioningResult && provisioningResult.success) {
      const metadata: Record<string, unknown> = {
        provisioning_method: provisioningResult.provisioningMethod,
        provisioned_at: new Date().toISOString(),
      }
      if (provisioningResult.externalTenantId) {
        metadata.external_tenant_id = provisioningResult.externalTenantId
      }

      await sc
        .from('external_system_links')
        .upsert({
          organization_id: request.organization_id,
          system_key: `${request.offering_key}_user`,
          external_id: provisioningResult.externalUserId || 'linked',
          status: 'active',
          metadata,
        }, { onConflict: 'organization_id,system_key' })
    }

    // Step 4: Send activation email to customer
    try {
      const { sendProductActivatedEmail } = await import('@/lib/email')

      const productNames: Record<string, { name: string; url: string }> = {
        haiec: { name: 'HAIEC', url: 'https://www.haiec.com' },
        kestrel: { name: 'KestrelVoice', url: 'https://www.kestrelvoice.com' },
      }
      const product = productNames[request.offering_key]
      const launchUrl = provisioningResult?.launchUrl || product?.url || ''

      const nextSteps = provisioningResult?.success
        ? provisioningResult.message
        : provisioningResult?.manualInstructions || adminNote || undefined

      if (product && customerEmail && orgSlug) {
        await sendProductActivatedEmail({
          to: customerEmail,
          customerName: customerName || undefined,
          productName: product.name,
          productUrl: launchUrl,
          orgSlug,
          nextSteps,
        })
      }
    } catch (err) {
      console.error('Failed to send product activation email:', err)
    }

    // Step 5: Return provisioning result to admin
    // (audit event is written below, after this block)
  }

  // Audit event — written for ALL status changes (approved, activated, declined)
  await sc.rpc('write_audit_event', {
    audit_action: `admin.product_request_${status}`,
    audit_entity_type: 'product_access_request',
    audit_org_id: request.organization_id,
    audit_entity_id: requestId,
    audit_metadata: {
      offering_key: request.offering_key,
      admin_note: adminNote || null,
      provisioning_result: status === 'activated' ? provisioningResult?.success : undefined,
    } as any,
  })

  return NextResponse.json({
    success: true,
    ...(provisioningResult ? { provisioning: provisioningResult } : {}),
  })
}
