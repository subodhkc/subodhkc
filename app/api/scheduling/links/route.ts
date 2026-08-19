import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getAuthenticatedUser, resolveOrganizationContext } from '@/lib/auth/organization-resolver'
import { rateLimit } from '@/lib/rate-limit'
import { recordFailure } from '@/lib/commercial/failures'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * S7: Centralized scheduling configuration.
 *
 * Default durations per link type. These can be overridden per-request
 * via the durationMinutes field, but the defaults are defined here
 * (not hardcoded inline in the route logic).
 *
 * External scheduling provider event-type URLs should be configured via
 * environment variables or the scheduling_links table. A link click
 * does NOT imply a session was scheduled — the status must be set
 * explicitly via PATCH.
 */
const SCHEDULING_DEFAULTS = {
  activation_call: {
    durationMinutes: 20,
    description: 'Fractional activation call',
  },
  working_session: {
    durationMinutes: 60,
    description: 'Fractional working session',
  },
  advisor_activation: {
    durationMinutes: 15,
    description: 'Advisor Desk activation',
  },
} as const

/**
 * S7: Scheduling status model.
 *
 * Client-settable statuses (any org member):
 *   not_started, scheduling, scheduled, deferred, cancelled
 *
 * Advisor-authoritative statuses (platform_admin / advisor_operator only):
 *   completed, no_show
 *
 * A link click or "schedule later" must NOT set completed.
 */
const CLIENT_SETTABLE_STATUSES = new Set([
  'not_started',
  'scheduling',
  'scheduled',
  'deferred',
  'cancelled',
  'pending',
])

const ADVISOR_AUTHORITATIVE_STATUSES = new Set([
  'completed',
  'no_show',
])

const ALL_VALID_STATUSES = new Set([
  ...CLIENT_SETTABLE_STATUSES,
  ...ADVISOR_AUTHORITATIVE_STATUSES,
])

/**
 * GET /api/scheduling/links?orgSlug=...&type=activation_call|working_session
 * Returns scheduling links for the organization.
 */
export async function GET(request: NextRequest) {
  const limited = rateLimit(request)
  if (limited) return limited

  try {
    const user = await getAuthenticatedUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const orgSlug = searchParams.get('orgSlug')
    const linkType = searchParams.get('type') // 'activation_call' | 'working_session' | null (all)
    if (!orgSlug) return NextResponse.json({ error: 'Missing orgSlug' }, { status: 400 })

    const ctx = await resolveOrganizationContext(user, orgSlug)
    if (!ctx) return NextResponse.json({ error: 'Organization not found' }, { status: 404 })

    const sc = createClient(supabaseUrl, serviceRoleKey)
    let query = sc
      .from('scheduling_links')
      .select('*')
      .eq('organization_id', ctx.organization.id)
      .order('created_at', { ascending: false })

    if (linkType) {
      query = query.eq('link_type', linkType)
    }

    const { data: links } = await query as { data: any }

    return NextResponse.json({ links: links || [] })
  } catch (err: any) {
    console.error('[scheduling] Error:', err)
    return NextResponse.json({ error: 'Failed to fetch scheduling links' }, { status: 500 })
  }
}

/**
 * POST /api/scheduling/links
 * Create or update a scheduling link.
 * Body: { orgSlug, linkType, schedulingUrl, scheduledAt?, durationMinutes?, notes? }
 */
export async function POST(request: NextRequest) {
  const limited = rateLimit(request)
  if (limited) return limited

  try {
    const user = await getAuthenticatedUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { orgSlug, linkType, schedulingUrl, scheduledAt, durationMinutes, notes, status } = body

    if (!orgSlug || !linkType || !schedulingUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const ctx = await resolveOrganizationContext(user, orgSlug)
    if (!ctx) return NextResponse.json({ error: 'Organization not found' }, { status: 404 })

    const sc = createClient(supabaseUrl, serviceRoleKey)

    // S7: Use centralized default duration
    const defaultDuration = SCHEDULING_DEFAULTS[linkType as keyof typeof SCHEDULING_DEFAULTS]?.durationMinutes ?? 30

    // For activation_call, only allow one pending/scheduled link at a time
    if (linkType === 'activation_call') {
      const { data: existing } = await sc
        .from('scheduling_links')
        .select('id, status')
        .eq('organization_id', ctx.organization.id)
        .eq('link_type', 'activation_call')
        .in('status', ['pending', 'scheduled', 'scheduling'])
        .limit(1) as { data: any }

      if (existing && existing.length > 0) {
        // Update existing instead of creating duplicate
        const { data: updated } = await sc
          .from('scheduling_links')
          .update({
            scheduling_url: schedulingUrl,
            scheduled_at: scheduledAt || null,
            duration_minutes: durationMinutes || defaultDuration,
            status: status || 'scheduled',
            notes: notes || null,
          })
          .eq('id', existing[0].id)
          .select()
          .single() as { data: any }
        return NextResponse.json({ link: updated })
      }
    }

    const { data: link, error } = await (sc
      .from('scheduling_links') as any)
      .insert({
        organization_id: ctx.organization.id,
        link_type: linkType,
        scheduling_url: schedulingUrl,
        scheduled_at: scheduledAt || null,
        duration_minutes: durationMinutes || defaultDuration,
        status: status || 'scheduled',
        notes: notes || null,
      })
      .select()
      .single()

    if (error) {
      console.error('[scheduling] Insert error:', error)
      // S10: Record scheduling creation failure for operator visibility
      await recordFailure({
        organizationId: ctx.organization.id,
        userId: user.id,
        failureType: 'scheduling',
        severity: 'warning',
        message: `Scheduling link creation failed: ${error.message}`,
        details: { linkType, schedulingUrl, error: error.message },
        retryable: true,
      }).catch(() => undefined)
      return NextResponse.json({ error: 'Failed to create scheduling link' }, { status: 500 })
    }

    return NextResponse.json({ link })
  } catch (err: any) {
    console.error('[scheduling] Error:', err)
    return NextResponse.json({ error: 'Failed to create scheduling link' }, { status: 500 })
  }
}

/**
 * PATCH /api/scheduling/links
 * Update a scheduling link status.
 * Body: { linkId, status, scheduledAt? }
 *
 * S7: Authority enforcement:
 *   - Client-settable: not_started, scheduling, scheduled, deferred, cancelled, pending
 *   - Advisor-authoritative: completed, no_show (platform_admin / advisor_operator only)
 *
 * A scheduling link click or "schedule later" must NOT set completed.
 */
export async function PATCH(request: NextRequest) {
  const limited = rateLimit(request)
  if (limited) return limited

  try {
    const user = await getAuthenticatedUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { linkId, status, scheduledAt } = body

    if (!linkId || !status) {
      return NextResponse.json({ error: 'Missing linkId or status' }, { status: 400 })
    }

    // S7: Validate the status is in the allowed set
    if (!ALL_VALID_STATUSES.has(status)) {
      return NextResponse.json({
        error: 'invalid_status',
        message: `Status must be one of: ${[...ALL_VALID_STATUSES].join(', ')}`,
      }, { status: 400 })
    }

    const sc = createClient(supabaseUrl, serviceRoleKey)

    // Verify the link belongs to an org the user is a member of
    const { data: link } = await sc
      .from('scheduling_links')
      .select('organization_id')
      .eq('id', linkId)
      .single() as { data: any }

    if (!link) return NextResponse.json({ error: 'Link not found' }, { status: 404 })

    // Verify membership
    const { data: membership } = await sc
      .from('organization_memberships')
      .select('id')
      .eq('organization_id', link.organization_id)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .limit(1)

    if (!membership || membership.length === 0) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // S7: Enforce advisor-authoritative statuses.
    // Only platform admins / advisor operators can set completed or no_show.
    // A client clicking a scheduling link must not be able to mark a session
    // as completed.
    if (ADVISOR_AUTHORITATIVE_STATUSES.has(status) && !user.isPlatformAdmin && !user.isAdvisorOperator) {
      return NextResponse.json({
        error: 'advisor_only_status',
        message: `The '${status}' status can only be set by Subodh or an authorized operator. Clients may set: ${[...CLIENT_SETTABLE_STATUSES].join(', ')}.`,
      }, { status: 403 })
    }

    const { data: updated, error } = await (sc
      .from('scheduling_links') as any)
      .update({
        status,
        scheduled_at: scheduledAt || undefined,
        status_set_by: user.id,
        status_set_by_role: user.isPlatformAdmin ? 'platform_admin' : (user.isAdvisorOperator ? 'advisor_operator' : 'org_member'),
        status_set_at: new Date().toISOString(),
      })
      .eq('id', linkId)
      .select()
      .single()

    if (error) {
      console.error('[scheduling] Update error:', error)
      // S10: Record scheduling update failure for operator visibility
      await recordFailure({
        organizationId: link.organization_id,
        userId: user.id,
        failureType: 'scheduling',
        severity: 'warning',
        message: `Scheduling link status update failed: ${error.message}`,
        details: { linkId, status, error: error.message },
        retryable: true,
      }).catch(() => undefined)
      return NextResponse.json({ error: 'Failed to update scheduling link' }, { status: 500 })
    }

    return NextResponse.json({ link: updated })
  } catch (err: any) {
    console.error('[scheduling] Error:', err)
    return NextResponse.json({ error: 'Failed to update scheduling link' }, { status: 500 })
  }
}
