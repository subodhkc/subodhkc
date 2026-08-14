import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, resolveOrganizationContext, AuthError } from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/commercial/security-review/checklist?orgSlug=<slug>
 * Returns the access checklist items for the org's security review.
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

  const { data: items } = await sc
    .from('security_access_checklists')
    .select('*')
    .eq('organization_id', ctx.organization.id)
    .order('created_at', { ascending: true })

  return NextResponse.json({ checklist: items || [] })
}

/**
 * POST /api/commercial/security-review/checklist
 * Platform admin creates checklist items for the org.
 * Org admins update item status (completed, evidence_reference, notes).
 */
export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json()
  const { orgSlug, items } = body as {
    orgSlug: string
    items: Array<{
      id?: string
      item_key: string
      item_label: string
      description?: string
      status?: string
      evidence_reference?: string
      notes?: string
    }>
  }

  if (!orgSlug || !items || !Array.isArray(items)) {
    return NextResponse.json({ error: 'orgSlug and items array required' }, { status: 400 })
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

  // Check if user is platform admin or org admin
  const { data: userRoles } = await sc
    .from('platform_user_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('status', 'active')

  const isPlatformAdmin = (userRoles || []).some(r => r.role === 'admin' || r.role === 'super_admin')

  const results = []

  for (const item of items) {
    if (item.id) {
      // Update existing item
      const updateFields: Record<string, unknown> = {}
      if (item.status) updateFields.status = item.status
      if (item.evidence_reference !== undefined) updateFields.evidence_reference = item.evidence_reference
      if (item.notes !== undefined) updateFields.notes = item.notes

      const { data, error } = await sc
        .from('security_access_checklists')
        .update(updateFields)
        .eq('id', item.id)
        .eq('organization_id', ctx.organization.id)
        .select('*')
        .single()

      if (!error) results.push(data)
    } else {
      // Create new item (platform admin only)
      if (!isPlatformAdmin) continue

      const { data, error } = await sc
        .from('security_access_checklists')
        .insert({
          organization_id: ctx.organization.id,
          item_key: item.item_key,
          item_label: item.item_label,
          description: item.description || null,
          status: item.status || 'pending',
        })
        .select('*')
        .single()

      if (!error) results.push(data)
    }
  }

  return NextResponse.json({ checklist: results })
}
