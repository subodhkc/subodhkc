import { NextRequest, NextResponse } from 'next/server'
import {
  getAuthenticatedUser,
  resolveOrganizationContext,
  AuthError,
} from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'
import { rateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/included-products/activate
 *
 * Activates an included product entitlement by calling the existing
 * provisioning adapter. The customer already owns the entitlement —
 * this triggers external account provisioning.
 *
 * Body: { orgSlug, productKey }
 * productKey: 'haiec' | 'kestrel'
 */
export async function POST(req: NextRequest) {
  const limited = rateLimit(req)
  if (limited) return limited

  const body = await req.json()
  const { orgSlug, productKey } = body as { orgSlug?: string; productKey?: string }

  if (!orgSlug || !productKey) {
    return NextResponse.json({ error: 'orgSlug and productKey are required' }, { status: 400 })
  }

  if (productKey !== 'haiec' && productKey !== 'kestrel') {
    return NextResponse.json({ error: 'Invalid productKey. Must be haiec or kestrel.' }, { status: 400 })
  }

  const user = await getAuthenticatedUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let ctx
  try {
    ctx = await resolveOrganizationContext(user, orgSlug)
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: 403 })
    }
    throw err
  }

  const sc = createServiceClient()
  if (!sc) {
    return NextResponse.json({ error: 'Configuration error' }, { status: 500 })
  }

  // Find the included product entitlement
  const { data: entitlement, error: entError } = await sc
    .from('included_product_entitlements')
    .select('*')
    .eq('organization_id', ctx.organization.id)
    .eq('product_key', productKey)
    .single()

  if (entError || !entitlement) {
    return NextResponse.json({ error: 'No included product entitlement found' }, { status: 404 })
  }

  if (entitlement.entitlement_status === 'ended') {
    return NextResponse.json({ error: 'This entitlement has ended' }, { status: 403 })
  }

  if (entitlement.entitlement_status === 'active' && entitlement.provisioning_status === 'provisioned') {
    return NextResponse.json({
      success: true,
      message: 'Already activated',
      externalUserId: entitlement.external_user_id,
      externalAccountId: entitlement.external_account_id,
    })
  }

  // Mark as provisioning
  await sc
    .from('included_product_entitlements')
    .update({
      entitlement_status: 'provisioning',
      provisioning_status: 'in_progress',
      updated_at: new Date().toISOString(),
    })
    .eq('id', entitlement.id)

  // Call the existing provisioning adapter
  try {
    const { getProvisioningAdapter } = await import('@/lib/provisioning/adapter')
    const adapter = await getProvisioningAdapter(productKey)

    if (!adapter || !adapter.isConfigured()) {
      // Manual fallback — mark as ready_to_activate with manual instructions
      await sc
        .from('included_product_entitlements')
        .update({
          entitlement_status: 'ready_to_activate',
          provisioning_status: 'failed',
          provisioning_error: 'Provisioning API not configured. Manual activation required.',
          updated_at: new Date().toISOString(),
        })
        .eq('id', entitlement.id)

      return NextResponse.json({
        success: false,
        requiresManualAction: true,
        message: 'External provisioning is not configured. Your access is included and ready — contact support to complete activation.',
      })
    }

    // Get org and user data for provisioning
    const { data: orgData } = await sc
      .from('organizations')
      .select('name, slug')
      .eq('id', ctx.organization.id)
      .single()

    const result = await adapter.provision({
      customerEmail: user.email || '',
      customerName: user.displayName || null,
      organizationName: orgData?.name || ctx.organization.name,
      organizationSlug: orgData?.slug || ctx.organization.slug,
      sourceOfferKey: entitlement.source_offer_key,
      planTier: entitlement.external_tier_mapped || undefined,
    })

    if (result.success) {
      // Update entitlement to active
      await sc
        .from('included_product_entitlements')
        .update({
          entitlement_status: 'active',
          provisioning_status: 'provisioned',
          external_user_id: result.externalUserId || null,
          external_account_id: result.externalTenantId || null,
          activated_at: new Date().toISOString(),
          provisioning_error: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', entitlement.id)

      return NextResponse.json({
        success: true,
        message: result.message,
        launchUrl: result.launchUrl,
        externalUserId: result.externalUserId,
      })
    } else {
      // Provisioning failed
      await sc
        .from('included_product_entitlements')
        .update({
          entitlement_status: 'provisioning_failed',
          provisioning_status: 'failed',
          provisioning_error: result.error,
          updated_at: new Date().toISOString(),
        })
        .eq('id', entitlement.id)

      return NextResponse.json({
        success: false,
        error: result.error,
        requiresManualAction: result.requiresManualAction,
        manualInstructions: result.manualInstructions,
      })
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error'
    await sc
      .from('included_product_entitlements')
      .update({
        entitlement_status: 'provisioning_failed',
        provisioning_status: 'failed',
        provisioning_error: errorMsg,
        updated_at: new Date().toISOString(),
      })
      .eq('id', entitlement.id)

    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 })
  }
}
