import { NextRequest, NextResponse } from 'next/server'
import {
  getAuthenticatedUser,
  resolveOrganizationContext,
  AuthError,
} from '@/lib/auth/organization-resolver'
import { checkMutationAllowed } from '@/lib/auth/fractional-access'
import { createServiceClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Unified Fractional operating records API.
 *
 * GET  /api/fractional/records?orgSlug=...&type=opportunities
 * POST /api/fractional/records  { orgSlug, type, action: 'create'|'update'|'delete', data }
 *
 * Supported record types:
 *   intake       — Bring Something to the Desk
 *   opportunities — Opportunity Registry
 *   evidence     — Evidence & Inputs
 *   sessions     — Working Session Records
 *   briefs       — Monthly Decision & Opportunity Brief
 *   priorities   — Current Priorities
 *   actions      — Actions & Commitments (uses engagement_actions)
 *   artifacts    — Decision Artifacts (uses engagement_artifacts)
 *   outcomes     — Outcome / Learning (uses engagement_outcomes)
 */

const TABLE_MAP: Record<string, string> = {
  intake: 'fractional_intake_records',
  opportunities: 'fractional_opportunities',
  evidence: 'fractional_evidence',
  sessions: 'fractional_working_sessions',
  briefs: 'fractional_monthly_briefs',
  priorities: 'fractional_priorities',
  actions: 'engagement_actions',
  artifacts: 'engagement_artifacts',
  outcomes: 'engagement_outcomes',
}

const VALID_INTAKE_TYPES = [
  'ask_question', 'explore_opportunity', 'review_decision', 'review_vendor',
  'review_system', 'explore_partnership', 'share_report', 'something_changed',
]

const VALID_OPPORTUNITY_STATUSES = [
  'new', 'exploring', 'evidence_needed', 'candidate', 'recommended',
  'deferred', 'rejected', 'advanced', 'closed',
]

/**
 * GET — list records for a given type
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const orgSlug = searchParams.get('orgSlug')
  const type = searchParams.get('type')

  if (!orgSlug || !type) {
    return NextResponse.json({ error: 'orgSlug and type are required' }, { status: 400 })
  }

  const table = TABLE_MAP[type]
  if (!table) {
    return NextResponse.json({ error: `Invalid record type: ${type}` }, { status: 400 })
  }

  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let ctx
  try {
    ctx = await resolveOrganizationContext(user, orgSlug)
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 403 })
    throw err
  }

  const sc = createServiceClient()
  if (!sc) return NextResponse.json({ error: 'Configuration error' }, { status: 500 })

  // Get the active fractional engagement
  const { data: engagement } = await sc
    .from('engagements')
    .select('id')
    .eq('organization_id', ctx.organization.id)
    .eq('engagement_type', 'retainer')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  let query = sc
    .from(table)
    .select('*')
    .eq('organization_id', ctx.organization.id)
    .order('created_at', { ascending: false })

  // For engagement-linked tables, filter by engagement if available
  if (engagement && ['actions', 'artifacts', 'outcomes'].includes(type)) {
    query = query.eq('engagement_id', engagement.id)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ records: data || [] })
}

/**
 * POST — create, update, or delete a record
 */
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { orgSlug, type, action, data, recordId } = body as {
    orgSlug: string
    type: string
    action: 'create' | 'update' | 'delete'
    data?: Record<string, unknown>
    recordId?: string
  }

  if (!orgSlug || !type || !action) {
    return NextResponse.json({ error: 'orgSlug, type, and action are required' }, { status: 400 })
  }

  const table = TABLE_MAP[type]
  if (!table) {
    return NextResponse.json({ error: `Invalid record type: ${type}` }, { status: 400 })
  }

  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let ctx
  try {
    ctx = await resolveOrganizationContext(user, orgSlug)
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 403 })
    throw err
  }

  // Enforce read-only state
  const mutationCheck = checkMutationAllowed(ctx)
  if (!mutationCheck.allowed) {
    return NextResponse.json(
      { error: mutationCheck.error, message: mutationCheck.message },
      { status: mutationCheck.status }
    )
  }

  const sc = createServiceClient()
  if (!sc) return NextResponse.json({ error: 'Configuration error' }, { status: 500 })

  // Get the active fractional engagement
  const { data: engagement } = await sc
    .from('engagements')
    .select('id')
    .eq('organization_id', ctx.organization.id)
    .eq('engagement_type', 'retainer')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (action === 'create') {
    if (!data) return NextResponse.json({ error: 'data is required for create' }, { status: 400 })

    // Validate intake type
    if (type === 'intake' && data.intake_type && !VALID_INTAKE_TYPES.includes(data.intake_type as string)) {
      return NextResponse.json({ error: `Invalid intake_type. Valid: ${VALID_INTAKE_TYPES.join(', ')}` }, { status: 400 })
    }

    // Validate opportunity status
    if (type === 'opportunities' && data.status && !VALID_OPPORTUNITY_STATUSES.includes(data.status as string)) {
      return NextResponse.json({ error: `Invalid opportunity status. Valid: ${VALID_OPPORTUNITY_STATUSES.join(', ')}` }, { status: 400 })
    }

    const insertData: Record<string, unknown> = {
      ...data,
      organization_id: ctx.organization.id,
    }

    // Set engagement_id if the table supports it and we have an active engagement
    if (engagement && !['priorities'].includes(type)) {
      insertData.engagement_id = engagement.id
    }

    // Set submitted_by_user_id for intake records
    if (type === 'intake') {
      insertData.submitted_by_user_id = user.id
    }

    // Set created_by_user_id for evidence
    if (type === 'evidence') {
      insertData.created_by_user_id = user.id
    }

    // Set authored_by_user_id for briefs
    if (type === 'briefs') {
      insertData.authored_by_user_id = user.id
    }

    const { data: record, error } = await sc
      .from(table)
      .insert(insertData)
      .select('*')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Audit
    await sc.rpc('write_audit_event', {
      audit_action: `fractional.${type}.created`,
      audit_entity_type: 'fractional_record',
      audit_org_id: ctx.organization.id,
      audit_entity_id: record.id,
      audit_actor_id: user.id,
      audit_metadata: { type, title: data.title || data.opportunity || data.evidence_type } as any,
    })

    return NextResponse.json({ success: true, record })
  }

  if (action === 'update') {
    if (!recordId || !data) {
      return NextResponse.json({ error: 'recordId and data are required for update' }, { status: 400 })
    }

    const { data: record, error } = await sc
      .from(table)
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', recordId)
      .eq('organization_id', ctx.organization.id)
      .select('*')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, record })
  }

  if (action === 'delete') {
    if (!recordId) {
      return NextResponse.json({ error: 'recordId is required for delete' }, { status: 400 })
    }

    const { error } = await sc
      .from(table)
      .delete()
      .eq('id', recordId)
      .eq('organization_id', ctx.organization.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
}
