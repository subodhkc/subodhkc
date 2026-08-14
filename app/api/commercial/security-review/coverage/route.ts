import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, resolveOrganizationContext, AuthError } from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/commercial/security-review/coverage?orgSlug=<slug>
 * Returns coverage areas for the org's security review.
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
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 403 })
    throw err
  }

  const sc = createServiceClient()
  if (!sc) return NextResponse.json({ error: 'config' }, { status: 500 })

  const { data: areas } = await sc
    .from('security_coverage_areas')
    .select('*')
    .eq('organization_id', ctx.organization.id)
    .order('display_order', { ascending: true })

  return NextResponse.json({ coverage: areas || [] })
}

/**
 * PATCH /api/commercial/security-review/coverage
 * Update coverage area status (platform admin or org admin).
 */
export async function PATCH(req: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json()
  const { orgSlug, areaId, status, notes } = body as {
    orgSlug: string
    areaId: string
    status: string
    notes?: string
  }

  if (!orgSlug || !areaId || !status) {
    return NextResponse.json({ error: 'orgSlug, areaId, and status required' }, { status: 400 })
  }

  let ctx
  try {
    ctx = await resolveOrganizationContext(user, orgSlug)
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 403 })
    throw err
  }

  const sc = createServiceClient()
  if (!sc) return NextResponse.json({ error: 'config' }, { status: 500 })

  const updateFields: Record<string, unknown> = { status }
  if (notes !== undefined) updateFields.notes = notes

  const { data, error } = await sc
    .from('security_coverage_areas')
    .update(updateFields)
    .eq('id', areaId)
    .eq('organization_id', ctx.organization.id)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: 'failed_to_update' }, { status: 500 })

  // Audit event
  await sc.rpc('write_audit_event', {
    audit_action: 'security_coverage.updated',
    audit_entity_type: 'security_coverage_area',
    audit_org_id: ctx.organization.id,
    audit_actor_id: user.id,
    audit_entity_id: areaId,
    audit_metadata: { status, notes: notes || null } as any,
  })

  return NextResponse.json({ area: data })
}
