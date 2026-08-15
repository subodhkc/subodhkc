import { NextRequest, NextResponse } from 'next/server'
import {
  getAuthenticatedUser,
  resolveOrganizationContext,
  AuthError,
} from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const VALID_STATUSES = [
  'new', 'reviewing', 'evidence_needed', 'next_session',
  'decision_ready', 'decided', 'closed', 'deferred', 'superseded', 'open',
]

/**
 * GET /api/fractional/decisions?orgSlug=...
 * Returns all decisions for the organization's fractional advisory engagement.
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

  // Get the fractional engagement
  const { data: engagement } = await sc
    .from('engagements')
    .select('id')
    .eq('organization_id', ctx.organization.id)
    .eq('engagement_type', 'retainer')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!engagement) {
    return NextResponse.json({ decisions: [] })
  }

  const { data: decisions } = await sc
    .from('engagement_decisions')
    .select('id, title, description, status, decision_owner, needed_by, decided_at, decision_rationale, created_at, updated_at')
    .eq('engagement_id', engagement.id)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })

  return NextResponse.json({ decisions: decisions || [] })
}

/**
 * POST /api/fractional/decisions
 * Add a new decision to the Decision Desk.
 */
export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json()
  const { orgSlug, title, description, neededBy } = body as {
    orgSlug: string
    title: string
    description?: string
    neededBy?: string
  }

  if (!orgSlug) return NextResponse.json({ error: 'orgSlug required' }, { status: 400 })
  if (!title || title.trim().length === 0) {
    return NextResponse.json({ error: 'title required' }, { status: 400 })
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

  // Get the fractional engagement
  const { data: engagement } = await sc
    .from('engagements')
    .select('id')
    .eq('organization_id', ctx.organization.id)
    .eq('engagement_type', 'retainer')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!engagement) {
    return NextResponse.json({ error: 'no_active_engagement' }, { status: 404 })
  }

  const { data: decision, error } = await sc
    .from('engagement_decisions')
    .insert({
      engagement_id: engagement.id,
      organization_id: ctx.organization.id,
      title: title.trim(),
      description: description || null,
      status: 'new',
      needed_by: neededBy || null,
      decision_owner_user_id: user.id,
    })
    .select('id, title, description, status, needed_by, created_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Audit event
  await sc.rpc('write_audit_event', {
    audit_action: 'fractional.decision_added',
    audit_entity_type: 'engagement_decision',
    audit_org_id: ctx.organization.id,
    audit_entity_id: decision.id,
    audit_actor_id: user.id,
    audit_metadata: { title: title.trim() } as any,
  })

  return NextResponse.json({ success: true, decision })
}

/**
 * PATCH /api/fractional/decisions
 * Update a decision's status.
 */
export async function PATCH(req: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json()
  const { orgSlug, decisionId, status, rationale } = body as {
    orgSlug: string
    decisionId: string
    status: string
    rationale?: string
  }

  if (!orgSlug || !decisionId || !status) {
    return NextResponse.json({ error: 'orgSlug, decisionId, and status required' }, { status: 400 })
  }

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'invalid_status' }, { status: 400 })
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

  const updateData: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (status === 'decided' || status === 'closed') {
    updateData.decided_at = new Date().toISOString()
  }

  if (rationale) {
    updateData.decision_rationale = rationale
  }

  const { data: updated, error } = await sc
    .from('engagement_decisions')
    .update(updateData)
    .eq('id', decisionId)
    .eq('organization_id', ctx.organization.id)
    .select('id, title, status, decided_at, updated_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, decision: updated })
}
