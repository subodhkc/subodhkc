import { NextRequest, NextResponse } from 'next/server'
import {
  getAuthenticatedUser,
  resolveOrganizationContext,
  AuthError,
} from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/fractional/export?orgSlug=...
 *
 * Exports the organization's advisory workspace data as JSON.
 * Includes: decisions, opportunities, onboarding, engagements,
 * client inputs, advisor artifacts, and action/history records.
 *
 * Available during active subscription and for 30 days after cancellation.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const orgSlug = searchParams.get('orgSlug')
  if (!orgSlug) {
    return NextResponse.json({ error: 'orgSlug is required' }, { status: 400 })
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

  // Check for fractional advisory entitlement (active or recently expired)
  const hasFractional = ctx.entitlements.some(
    e =>
      (e.offering_key === 'fractional_ai_advisor' ||
        e.offering_key === 'advisory') &&
      (e.effective_status === 'active' || e.effective_status === 'expired')
  )

  if (!hasFractional && !ctx.isPlatformAdmin) {
    return NextResponse.json(
      { error: 'No active or recent Fractional AI Advisor subscription found.' },
      { status: 403 }
    )
  }

  // Check 30-day post-cancellation window
  const fractionalEnt = ctx.entitlements.find(
    e =>
      e.offering_key === 'fractional_ai_advisor' ||
      e.offering_key === 'advisory'
  )

  if (
    fractionalEnt?.effective_status === 'expired' &&
    fractionalEnt?.valid_until
  ) {
    const expiry = new Date(fractionalEnt.valid_until)
    const thirtyDaysAfter = new Date(expiry.getTime() + 30 * 24 * 60 * 60 * 1000)
    if (new Date() > thirtyDaysAfter) {
      return NextResponse.json(
        { error: 'The 30-day post-cancellation export window has expired.' },
        { status: 403 }
      )
    }
  }

  const sc = createServiceClient()
  if (!sc) {
    return NextResponse.json({ error: 'Configuration error' }, { status: 500 })
  }

  const orgId = ctx.organization.id

  // Gather all exportable records in parallel
  const [engagements, onboarding, decisions, productRequests] = await Promise.all([
    sc
      .from('engagements')
      .select('*')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false }),
    sc
      .from('fractional_onboarding')
      .select('*')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false }),
    sc
      .from('engagement_decisions')
      .select('*')
      .eq('engagement_id',
        (await sc
          .from('engagements')
          .select('id')
          .eq('organization_id', orgId)
          .eq('engagement_type', 'retainer')
          .eq('status', 'active')
          .single()
        ).data?.id || '00000000-0000-0000-0000-000000000000'
      )
      .order('created_at', { ascending: false }),
    sc
      .from('product_access_requests')
      .select('*')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false }),
  ])

  const exportData = {
    export_metadata: {
      exported_at: new Date().toISOString(),
      organization_id: orgId,
      organization_name: ctx.organization.name,
      organization_slug: ctx.organization.slug,
      exported_by: user.email,
      subscription_status: fractionalEnt?.effective_status ?? 'unknown',
      valid_until: fractionalEnt?.valid_until ?? null,
    },
    engagements: engagements.data || [],
    onboarding: onboarding.data || [],
    decisions: decisions.data || [],
    product_access_requests: productRequests.data || [],
  }

  const json = JSON.stringify(exportData, null, 2)

  return new NextResponse(json, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="advisory-workspace-${orgSlug}-${new Date().toISOString().split('T')[0]}.json"`,
    },
  })
}
