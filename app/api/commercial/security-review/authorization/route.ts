import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, resolveOrganizationContext, AuthError } from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/commercial/security-review/authorization?orgSlug=<slug>
 * Returns the security review authorization (rules of engagement) for the org.
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

  const { data: auth } = await sc
    .from('security_review_authorizations')
    .select('*')
    .eq('organization_id', ctx.organization.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return NextResponse.json({ authorization: auth || null })
}

/**
 * POST /api/commercial/security-review/authorization
 * Platform admin creates or updates the security review authorization (rules of engagement).
 */
export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json()
  const { orgSlug, inScopeSystems, outOfScopeSystems, approvedMethods, detailedRules, authorizedAt } = body

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

  // Only platform admins can set authorization
  const { data: userRoles } = await sc
    .from('platform_user_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('status', 'active')

  const isPlatformAdmin = (userRoles || []).some(r => r.role === 'admin' || r.role === 'super_admin')
  if (!isPlatformAdmin) {
    return NextResponse.json({ error: 'only_admins_can_authorize' }, { status: 403 })
  }

  const { data, error } = await sc
    .from('security_review_authorizations')
    .insert({
      organization_id: ctx.organization.id,
      in_scope_systems: inScopeSystems || [],
      out_of_scope_systems: outOfScopeSystems || [],
      approved_methods: approvedMethods || [],
      detailed_rules: detailedRules || null,
      authorized_at: authorizedAt || new Date().toISOString(),
      authorized_by: user.id,
      status: 'active',
    })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: 'failed_to_create' }, { status: 500 })

  // Audit event
  await sc.rpc('write_audit_event', {
    audit_action: 'security_review.authorized',
    audit_entity_type: 'security_review_authorization',
    audit_org_id: ctx.organization.id,
    audit_actor_id: user.id,
    audit_entity_id: data.id,
    audit_metadata: { in_scope_count: inScopeSystems?.length || 0 } as any,
  })

  return NextResponse.json({ authorization: data })
}
