import { NextRequest, NextResponse } from 'next/server'
import {
  getAuthenticatedUser,
  resolveOrganizationContext,
  AuthError,
} from '@/lib/auth/organization-resolver'
import { checkMutationAllowed } from '@/lib/auth/fractional-access'
import { createServiceClient } from '@/lib/supabase'
import { getCurrentMonth } from '@/lib/fractional/session-usage'
import { rateLimit } from '@/lib/rate-limit'
import { recordFailure } from '@/lib/commercial/failures'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Unified Fractional operating records API.
 *
 * GET  /api/fractional/records?orgSlug=...&type=opportunities
 * POST /api/fractional/records  { orgSlug, type, action: 'create'|'update'|'delete', data }
 *
 * S5: Record authorization matrix:
 *   CLIENT-AUTHORABLE (any org member with active Fractional access):
 *     intake, opportunities, evidence, priorities, actions (client actions)
 *   ADVISOR-AUTHORITATIVE (platform_admin / advisor_operator only):
 *     briefs, artifacts, outcomes, affiliations
 *   SESSIONS: any org member may schedule; completion is advisor-authoritative
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
  outcomes: 'fractional_outcomes',
  affiliations: 'advisor_affiliations',
}

// S5: Advisor-authoritative record types — only platform admins / advisor
// operators can create/update/delete these. Clients can GET them.
const ADVISOR_AUTHORITATIVE_TYPES = new Set([
  'briefs',
  'artifacts',
  'outcomes',
  'affiliations',
])

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
  const limited = rateLimit(req)
  if (limited) return limited

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

  // S5: Enforce advisor-authoritative record types. Only platform admins /
  // advisor operators can create/update/delete these. A normal org member
  // (even an owner) cannot publish briefs, artifacts, outcomes, or affiliations.
  if (ADVISOR_AUTHORITATIVE_TYPES.has(type) && !ctx.isPlatformAdmin && !ctx.isAdvisorOperator) {
    return NextResponse.json({
      error: 'advisor_only',
      message: `${type} are advisor-authoritative records. Only Subodh and authorized operators can create or modify them.`,
    }, { status: 403 })
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

    // S6: For working sessions, use the atomic RPC that inserts the session
    // AND increments usage in one transaction. This prevents the race condition
    // where quota is incremented but the session insert fails (leaving a
    // consumed session with no session record).
    if (type === 'sessions' && insertData.session_type !== 'activation_call') {
      const billingMonth = (data.billing_period_month as string) || getCurrentMonth()
      insertData.billing_period_month = billingMonth

      // Call the atomic RPC: create_working_session_atomic
      const { data: rpcResult, error: rpcError } = await sc.rpc('create_working_session_atomic', {
        p_org_id: ctx.organization.id,
        p_engagement_id: engagement?.id || null,
        p_billing_period_month: billingMonth,
        p_session_data: {
          session_type: insertData.session_type,
          scheduled_at: insertData.scheduled_at,
          participants: insertData.participants,
          agenda: insertData.agenda,
          status: insertData.status || 'scheduled',
        } as any,
      })

      if (rpcError) {
        // If the RPC doesn't exist yet (migration not applied), fall back to
        // the old non-atomic path with the order fixed (insert first, then
        // increment). This maintains backwards compatibility.
        const { data: sessionRecord, error: sessionError } = await sc
          .from(table)
          .insert(insertData)
          .select('*')
          .single()

        if (sessionError) {
          return NextResponse.json({ error: sessionError.message }, { status: 500 })
        }

        // Now increment usage (after successful insert)
        const { incrementSessionUsage } = await import('@/lib/fractional/session-usage')
        const usageResult = await incrementSessionUsage(ctx.organization.id, billingMonth)
        if (!usageResult.success) {
          // S6: The session was inserted but the quota increment failed.
          // Record a commercial failure for reconciliation — the session
          // exists but is not counted against quota.
          await recordFailure({
            organizationId: ctx.organization.id,
            userId: user.id,
            failureType: 'session_usage',
            severity: 'warning',
            message: `Session usage increment failed after session insert. Session ${sessionRecord.id} exists but quota was not incremented.`,
            details: { session_id: sessionRecord.id, billing_month: billingMonth, usage_error: usageResult.message },
            retryable: true,
          }).catch(() => undefined)
          // Do NOT delete the session — it was legitimately scheduled.
          // The failure record allows an operator to reconcile.
        }

        // Audit
        await sc.rpc('write_audit_event', {
          audit_action: `fractional.${type}.created`,
          audit_entity_type: 'fractional_record',
          audit_org_id: ctx.organization.id,
          audit_entity_id: sessionRecord.id,
          audit_actor_id: user.id,
          audit_metadata: { type, title: data.title || data.session_type } as any,
        })

        return NextResponse.json({ success: true, record: sessionRecord })
      }

      // RPC succeeded
      const result = rpcResult as { success: boolean; session_id?: string; error?: string; available?: number; used?: number }
      if (!result.success) {
        return NextResponse.json(
          { error: 'session_limit_reached', message: result.error || 'No sessions remaining.' },
          { status: 409 }
        )
      }

      // Fetch the created session record for the response
      const { data: createdSession } = await sc
        .from(table)
        .select('*')
        .eq('id', result.session_id)
        .single()

      // Audit
      await sc.rpc('write_audit_event', {
        audit_action: `fractional.${type}.created`,
        audit_entity_type: 'fractional_record',
        audit_org_id: ctx.organization.id,
        audit_entity_id: result.session_id,
        audit_actor_id: user.id,
        audit_metadata: { type, title: data.title || data.session_type } as any,
      })

      return NextResponse.json({ success: true, record: createdSession })
    }

    const { data: record, error } = await sc
      .from(table)
      .insert(insertData)
      .select('*')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // "Something Changed" intake: reopen related opportunity or decision
    if (type === 'intake' && data.intake_type === 'something_changed') {
      const relatedId = data.related_priority as string
      if (relatedId) {
        // Try to reopen an opportunity
        await sc
          .from('fractional_opportunities')
          .update({ status: 'evidence_needed', updated_at: new Date().toISOString() })
          .eq('id', relatedId)
          .eq('organization_id', ctx.organization.id)
          .in('status', ['closed', 'rejected', 'deferred'])

        // Try to reopen a decision
        await sc
          .from('engagement_decisions')
          .update({ status: 'open', updated_at: new Date().toISOString() })
          .eq('id', relatedId)
          .eq('organization_id', ctx.organization.id)
          .in('status', ['decided', 'closed', 'deferred'])
      }
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
