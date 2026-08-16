/**
 * Advisor Operations — data aggregation for the internal operating console.
 * Provides a unified view of all advisory clients and their operational state.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export interface AdvisoryClientRow {
  organization_id: string
  organization_name: string
  organization_slug: string
  customer_email: string | null
  customer_name: string | null
  plan: string
  billing_period: string | null
  subscription_status: string | null
  entitlement_status: string | null
  lifecycle_state: string
  onboarding_status: string | null
  haiec_provisioning_status: string | null
  kestrel_provisioning_status: string | null
  latest_request_title: string | null
  latest_request_at: string | null
  requests_needing_response: number
  response_target_hours: number | null
  response_aging_hours: number | null
  fractional_next_session: string | null
  decisions_needing_attention: number
  opportunities_needing_attention: number
  actions_overdue: number
  monthly_brief_status: string | null
  cancellation_state: string | null
  readonly_until: string | null
  last_interaction_at: string | null
  is_fractional: boolean
}

export type AdvisoryFilter =
  | 'needs_attention'
  | 'advisor_desk'
  | 'fractional'
  | 'new_customers'
  | 'waiting_on_client'
  | 'waiting_on_advisor'
  | 'provisioning_failed'
  | 'payment_issue'
  | 'canceling'
  | 'read_only'

export interface AttentionQueueItem {
  organization_id: string
  organization_name: string
  organization_slug: string
  item_type: string
    // 'new_advisor_question' | 'new_fractional_desk_item' | 'evidence_uploaded'
    // | 'opportunity_awaiting_review' | 'decision_awaiting_review'
    // | 'activation_call_needed' | 'working_session_approaching'
    // | 'monthly_brief_due' | 'client_action_overdue'
    // | 'provisioning_failure' | 'payment_failure' | 'cancellation'
    // | 'readonly_expiry_approaching'
  priority: 'high' | 'medium' | 'low'
  age_hours: number
  target_date: string | null
  status: string
  direct_link: string
  title: string
  dismissable: boolean
}

/**
 * Fetch all advisory clients with their operational state.
 */
export async function fetchAdvisoryClients(filter?: AdvisoryFilter): Promise<AdvisoryClientRow[]> {
  const sc = createClient(supabaseUrl, serviceRoleKey)

  // Get all organizations with advisory entitlements
  const { data: entitlements } = await sc
    .from('organization_entitlements')
    .select(`
      organization_id,
      offering_key,
      effective_status,
      source_metadata,
      valid_until,
      organizations!inner(id, name, slug)
    `)
    .in('offering_key', ['ai_advisor_desk', 'fractional_ai_advisor'])
    .order('created_at', { ascending: false })

  if (!entitlements || entitlements.length === 0) return []

  // Build the client rows
  const rows: AdvisoryClientRow[] = []
  const orgIds = entitlements.map(e => e.organization_id)

  // Batch fetch lifecycle states
  const { data: lifecycles } = await sc
    .from('customer_lifecycle_states')
    .select('*')
    .in('organization_id', orgIds)

  // Batch fetch onboarding
  const { data: onboardings } = await sc
    .from('fractional_onboarding')
    .select('organization_id, status')
    .in('organization_id', orgIds)

  // Batch fetch included products
  const { data: products } = await sc
    .from('included_product_entitlements')
    .select('organization_id, product_key, provisioning_status')
    .in('organization_id', orgIds)

  // Batch fetch latest advisor requests (questions)
  const { data: questions } = await sc
    .from('advisor_questions')
    .select('organization_id, title, created_at, status, answered_at')
    .in('organization_id', orgIds)
    .order('created_at', { ascending: false })

  // Batch fetch decisions needing attention
  const { data: decisions } = await sc
    .from('engagement_decisions')
    .select('organization_id, status')
    .in('organization_id', orgIds)
    .in('status', ['new', 'reviewing', 'evidence_needed', 'decision_ready'])

  // Batch fetch opportunities needing attention
  const { data: opportunities } = await sc
    .from('fractional_opportunities')
    .select('organization_id, status')
    .in('organization_id', orgIds)
    .in('status', ['new', 'exploring', 'evidence_needed', 'candidate'])

  // Batch fetch overdue actions
  const { data: actions } = await sc
    .from('engagement_actions')
    .select('organization_id, status, due_date')
    .in('organization_id', orgIds)
    .eq('status', 'open')

  // Batch fetch monthly briefs
  const { data: briefs } = await sc
    .from('fractional_monthly_briefs')
    .select('organization_id, status')
    .in('organization_id', orgIds)

  // Batch fetch intake records (Fractional desk items)
  const { data: intakeItems } = await sc
    .from('fractional_intake_records')
    .select('organization_id, status, created_at')
    .in('organization_id', orgIds)
    .order('created_at', { ascending: false })

  // Batch fetch working sessions
  const { data: sessions } = await sc
    .from('fractional_working_sessions')
    .select('organization_id, scheduled_at, status, session_type')
    .in('organization_id', orgIds)
    .eq('status', 'scheduled')
    .order('scheduled_at', { ascending: true })

  // Batch fetch organization members (for customer contact)
  const { data: memberships } = await sc
    .from('organization_memberships')
    .select('organization_id, user_id, role, profiles!inner(email, full_name)')
    .in('organization_id', orgIds)
    .eq('role', 'owner')

  // Build lookup maps
  const lifecycleMap = new Map((lifecycles || []).map(l => [l.organization_id, l]))
  const onboardingMap = new Map((onboardings || []).map(o => [o.organization_id, o]))
  const productsByOrg = new Map<string, any[]>()
  for (const p of products || []) {
    if (!productsByOrg.has(p.organization_id)) productsByOrg.set(p.organization_id, [])
    productsByOrg.get(p.organization_id)!.push(p)
  }
  const questionsByOrg = new Map<string, any[]>()
  for (const q of questions || []) {
    if (!questionsByOrg.has(q.organization_id)) questionsByOrg.set(q.organization_id, [])
    questionsByOrg.get(q.organization_id)!.push(q)
  }
  const decisionsByOrg = new Map<string, number>()
  for (const d of decisions || []) {
    decisionsByOrg.set(d.organization_id, (decisionsByOrg.get(d.organization_id) || 0) + 1)
  }
  const opportunitiesByOrg = new Map<string, number>()
  for (const o of opportunities || []) {
    opportunitiesByOrg.set(o.organization_id, (opportunitiesByOrg.get(o.organization_id) || 0) + 1)
  }
  const actionsByOrg = new Map<string, number>()
  const now = new Date()
  for (const a of actions || []) {
    if (a.due_date && new Date(a.due_date) < now) {
      actionsByOrg.set(a.organization_id, (actionsByOrg.get(a.organization_id) || 0) + 1)
    }
  }
  const briefMap = new Map((briefs || []).map(b => [b.organization_id, b]))
  const intakeByOrg = new Map<string, any[]>()
  for (const i of intakeItems || []) {
    if (!intakeByOrg.has(i.organization_id)) intakeByOrg.set(i.organization_id, [])
    intakeByOrg.get(i.organization_id)!.push(i)
  }
  const sessionByOrg = new Map<string, any>()
  for (const s of sessions || []) {
    if (!sessionByOrg.has(s.organization_id)) {
      sessionByOrg.set(s.organization_id, s)
    }
  }
  const membershipMap = new Map<string, any>()
  for (const m of memberships || []) {
    if (!membershipMap.has(m.organization_id)) {
      membershipMap.set(m.organization_id, m)
    }
  }

  for (const ent of entitlements) {
    const org = (ent as any).organizations
    if (!org) continue
    const orgId = ent.organization_id
    const lifecycle = lifecycleMap.get(orgId)
    const onboarding = onboardingMap.get(orgId)
    const orgProducts = productsByOrg.get(orgId) || []
    const haiecProduct = orgProducts.find(p => p.product_key === 'haiec')
    const kestrelProduct = orgProducts.find(p => p.product_key === 'kestrel')
    const orgQuestions = questionsByOrg.get(orgId) || []
    const latestQuestion = orgQuestions[0]
    const unansweredQuestions = orgQuestions.filter(q => q.status === 'new' || q.status === 'answered')
    const membership = membershipMap.get(orgId)
    const isFractional = ent.offering_key === 'fractional_ai_advisor'
    const sourceMeta = ent.source_metadata as any
    const brief = briefMap.get(orgId)
    const nextSession = sessionByOrg.get(orgId)
    const orgIntake = intakeByOrg.get(orgId) || []
    const unansweredIntake = orgIntake.filter(i => i.status === 'new')

    // Calculate response aging
    let responseAgingHours: number | null = null
    if (latestQuestion && (latestQuestion.status === 'new' || latestQuestion.status === 'open')) {
      const createdAt = new Date(latestQuestion.created_at)
      responseAgingHours = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60))
    }

    const row: AdvisoryClientRow = {
      organization_id: orgId,
      organization_name: org.name,
      organization_slug: org.slug,
      customer_email: membership?.profiles?.email || null,
      customer_name: membership?.profiles?.full_name || null,
      plan: ent.offering_key === 'fractional_ai_advisor' ? 'Fractional AI Advisor' : 'AI Advisor for Business',
      billing_period: sourceMeta?.billing_period || null,
      subscription_status: ent.effective_status,
      entitlement_status: ent.effective_status,
      lifecycle_state: lifecycle?.state || 'ACTIVE',
      onboarding_status: onboarding?.status || null,
      haiec_provisioning_status: haiecProduct?.provisioning_status || null,
      kestrel_provisioning_status: kestrelProduct?.provisioning_status || null,
      latest_request_title: latestQuestion?.title || (unansweredIntake[0]?.title || null),
      latest_request_at: latestQuestion?.created_at || (unansweredIntake[0]?.created_at || null),
      requests_needing_response: unansweredQuestions.length + unansweredIntake.length,
      response_target_hours: isFractional ? 48 : 72,
      response_aging_hours: responseAgingHours,
      fractional_next_session: nextSession?.scheduled_at || null,
      decisions_needing_attention: decisionsByOrg.get(orgId) || 0,
      opportunities_needing_attention: opportunitiesByOrg.get(orgId) || 0,
      actions_overdue: actionsByOrg.get(orgId) || 0,
      monthly_brief_status: brief?.status || null,
      cancellation_state: sourceMeta?.cancel_at_period_end ? 'cancel_at_period_end' : null,
      readonly_until: lifecycle?.readonly_until || null,
      last_interaction_at: lifecycle?.last_interaction_at || latestQuestion?.created_at || null,
      is_fractional: isFractional,
    }

    rows.push(row)
  }

  // Apply filters
  if (!filter || filter === 'needs_attention') {
    return rows.filter(r =>
      r.requests_needing_response > 0 ||
      r.decisions_needing_attention > 0 ||
      r.opportunities_needing_attention > 0 ||
      r.actions_overdue > 0 ||
      r.haiec_provisioning_status === 'provisioning_failed' ||
      r.kestrel_provisioning_status === 'provisioning_failed' ||
      r.subscription_status === 'suspended' ||
      r.subscription_status === 'past_due' ||
      r.lifecycle_state === 'ACTIVE_SETUP_REQUIRED' ||
      (r.is_fractional && r.monthly_brief_status === 'draft') ||
      (r.is_fractional && !r.onboarding_status) ||
      (r.is_fractional && r.onboarding_status === 'not_started')
    )
  }

  switch (filter) {
    case 'advisor_desk':
      return rows.filter(r => !r.is_fractional)
    case 'fractional':
      return rows.filter(r => r.is_fractional)
    case 'new_customers':
      return rows.filter(r => r.lifecycle_state === 'ACTIVE_SETUP_REQUIRED' || r.lifecycle_state === 'ACTIVE')
        .filter(r => {
          if (!r.last_interaction_at) return true
          const daysSince = (now.getTime() - new Date(r.last_interaction_at).getTime()) / (1000 * 60 * 60 * 24)
          return daysSince < 14
        })
    case 'waiting_on_client':
      return rows.filter(r => r.onboarding_status === 'not_started' || r.onboarding_status === 'in_progress')
    case 'waiting_on_advisor':
      return rows.filter(r => r.requests_needing_response > 0 || r.decisions_needing_attention > 0)
    case 'provisioning_failed':
      return rows.filter(r => r.haiec_provisioning_status === 'provisioning_failed' || r.kestrel_provisioning_status === 'provisioning_failed')
    case 'payment_issue':
      return rows.filter(r => r.subscription_status === 'suspended' || r.subscription_status === 'past_due' || r.lifecycle_state === 'PAYMENT_ISSUE')
    case 'canceling':
      return rows.filter(r => r.cancellation_state === 'cancel_at_period_end' || r.lifecycle_state === 'CANCEL_AT_PERIOD_END')
    case 'read_only':
      return rows.filter(r => r.lifecycle_state === 'READ_ONLY')
    default:
      return rows
  }
}

/**
 * Fetch the cross-client "What Needs My Attention?" queue.
 */
export async function fetchAttentionQueue(): Promise<AttentionQueueItem[]> {
  const sc = createClient(supabaseUrl, serviceRoleKey)
  const items: AttentionQueueItem[] = []
  const now = new Date()

  // 1. New advisor questions (from $99 clients)
  const { data: questions } = await sc
    .from('advisor_questions')
    .select('id, organization_id, title, created_at, status, organizations!inner(name, slug)')
    .eq('status', 'new')
    .order('created_at', { ascending: false })
    .limit(50)

  for (const q of questions || []) {
    const ageHours = Math.floor((now.getTime() - new Date(q.created_at).getTime()) / (1000 * 60 * 60))
    items.push({
      organization_id: q.organization_id,
      organization_name: (q as any).organizations?.name || 'Unknown',
      organization_slug: (q as any).organizations?.slug || '',
      item_type: 'new_advisor_question',
      priority: ageHours > 72 ? 'high' : ageHours > 48 ? 'medium' : 'low',
      age_hours: ageHours,
      target_date: null,
      status: 'new',
      direct_link: `/app/${(q as any).organizations?.slug}/advisor-desk`,
      title: q.title || 'New advisor question',
      dismissable: false,
    })
  }

  // 2. New Fractional desk items (intake records)
  const { data: intakeItems } = await sc
    .from('fractional_intake_records')
    .select('id, organization_id, title, intake_type, created_at, status, organizations!inner(name, slug)')
    .eq('status', 'new')
    .order('created_at', { ascending: false })
    .limit(50)

  for (const i of intakeItems || []) {
    const ageHours = Math.floor((now.getTime() - new Date(i.created_at).getTime()) / (1000 * 60 * 60))
    items.push({
      organization_id: i.organization_id,
      organization_name: (i as any).organizations?.name || 'Unknown',
      organization_slug: (i as any).organizations?.slug || '',
      item_type: 'new_fractional_desk_item',
      priority: ageHours > 48 ? 'high' : ageHours > 24 ? 'medium' : 'low',
      age_hours: ageHours,
      target_date: null,
      status: 'new',
      direct_link: `/app/${(i as any).organizations?.slug}/advisory`,
      title: i.title || i.intake_type || 'New desk item',
      dismissable: false,
    })
  }

  // 3. Decisions awaiting review
  const { data: decisions } = await sc
    .from('engagement_decisions')
    .select('id, organization_id, title, status, created_at, organizations!inner(name, slug)')
    .in('status', ['new', 'reviewing', 'evidence_needed', 'decision_ready'])
    .order('created_at', { ascending: false })
    .limit(50)

  for (const d of decisions || []) {
    const ageHours = Math.floor((now.getTime() - new Date(d.created_at).getTime()) / (1000 * 60 * 60))
    items.push({
      organization_id: d.organization_id,
      organization_name: (d as any).organizations?.name || 'Unknown',
      organization_slug: (d as any).organizations?.slug || '',
      item_type: 'decision_awaiting_review',
      priority: d.status === 'decision_ready' ? 'high' : 'medium',
      age_hours: ageHours,
      target_date: null,
      status: d.status,
      direct_link: `/app/${(d as any).organizations?.slug}/advisory`,
      title: d.title || 'Decision awaiting review',
      dismissable: false,
    })
  }

  // 4. Opportunities awaiting review
  const { data: opportunities } = await sc
    .from('fractional_opportunities')
    .select('id, organization_id, opportunity, status, created_at, organizations!inner(name, slug)')
    .in('status', ['new', 'exploring', 'evidence_needed', 'candidate'])
    .order('created_at', { ascending: false })
    .limit(50)

  for (const o of opportunities || []) {
    const ageHours = Math.floor((now.getTime() - new Date(o.created_at).getTime()) / (1000 * 60 * 60))
    items.push({
      organization_id: o.organization_id,
      organization_name: (o as any).organizations?.name || 'Unknown',
      organization_slug: (o as any).organizations?.slug || '',
      item_type: 'opportunity_awaiting_review',
      priority: o.status === 'candidate' ? 'medium' : 'low',
      age_hours: ageHours,
      target_date: null,
      status: o.status,
      direct_link: `/app/${(o as any).organizations?.slug}/advisory`,
      title: o.opportunity || 'Opportunity awaiting review',
      dismissable: false,
    })
  }

  // 5. Activation calls needed (Fractional clients without completed activation call)
  const { data: fractionalEntitlements } = await sc
    .from('organization_entitlements')
    .select('organization_id, organizations!inner(name, slug)')
    .eq('offering_key', 'fractional_ai_advisor')
    .eq('effective_status', 'active')

  for (const ent of fractionalEntitlements || []) {
    const orgId = ent.organization_id
    const { data: activationCall } = await sc
      .from('fractional_working_sessions')
      .select('id')
      .eq('organization_id', orgId)
      .eq('session_type', 'activation_call')
      .eq('status', 'completed')
      .limit(1)

    if (!activationCall || activationCall.length === 0) {
      items.push({
        organization_id: orgId,
        organization_name: (ent as any).organizations?.name || 'Unknown',
        organization_slug: (ent as any).organizations?.slug || '',
        item_type: 'activation_call_needed',
        priority: 'high',
        age_hours: 0,
        target_date: null,
        status: 'pending',
        direct_link: `/app/${(ent as any).organizations?.slug}/advisory`,
        title: 'Activation Call needed',
        dismissable: false,
      })
    }
  }

  // 6. Overdue client actions
  const { data: overdueActions } = await sc
    .from('engagement_actions')
    .select('id, organization_id, title, due_date, status, organizations!inner(name, slug)')
    .eq('status', 'open')
    .not('due_date', 'is', null)
    .order('due_date', { ascending: true })
    .limit(50)

  for (const a of overdueActions || []) {
    if (a.due_date && new Date(a.due_date) < now) {
      const ageHours = Math.floor((now.getTime() - new Date(a.due_date).getTime()) / (1000 * 60 * 60))
      items.push({
        organization_id: a.organization_id,
        organization_name: (a as any).organizations?.name || 'Unknown',
        organization_slug: (a as any).organizations?.slug || '',
        item_type: 'client_action_overdue',
        priority: ageHours > 72 ? 'high' : 'medium',
        age_hours: ageHours,
        target_date: a.due_date,
        status: 'overdue',
        direct_link: `/app/${(a as any).organizations?.slug}/advisory`,
        title: a.title || 'Overdue action',
        dismissable: false,
      })
    }
  }

  // 7. Monthly briefs due (draft status for current month)
  const currentMonth = new Date().toISOString().slice(0, 7)
  const { data: briefsDue } = await sc
    .from('fractional_monthly_briefs')
    .select('id, organization_id, status, billing_period_month, organizations!inner(name, slug)')
    .eq('billing_period_month', currentMonth)
    .neq('status', 'published')

  for (const b of briefsDue || []) {
    items.push({
      organization_id: b.organization_id,
      organization_name: (b as any).organizations?.name || 'Unknown',
      organization_slug: (b as any).organizations?.slug || '',
      item_type: 'monthly_brief_due',
      priority: 'medium',
      age_hours: 0,
      target_date: null,
      status: b.status || 'draft',
      direct_link: `/app/${(b as any).organizations?.slug}/advisory`,
      title: `Monthly brief due — ${b.billing_period_month}`,
      dismissable: false,
    })
  }

  // 8. Provisioning failures
  const { data: provisioningFailures } = await sc
    .from('included_product_entitlements')
    .select('id, organization_id, product_key, provisioning_status, provisioning_error, organizations!inner(name, slug)')
    .eq('provisioning_status', 'provisioning_failed')

  for (const p of provisioningFailures || []) {
    items.push({
      organization_id: p.organization_id,
      organization_name: (p as any).organizations?.name || 'Unknown',
      organization_slug: (p as any).organizations?.slug || '',
      item_type: 'provisioning_failure',
      priority: 'high',
      age_hours: 0,
      target_date: null,
      status: 'failed',
      direct_link: `/app/admin`,
      title: `${p.product_key} provisioning failed: ${p.provisioning_error || 'Unknown error'}`,
      dismissable: false,
    })
  }

  // 9. Unresolved commercial failures
  const { data: commercialFailures } = await sc
    .from('commercial_failures')
    .select('id, organization_id, failure_type, severity, message, created_at, organizations!inner(name, slug)')
    .is('resolved_at', null)
    .order('created_at', { ascending: false })
    .limit(20)

  for (const f of commercialFailures || []) {
    const ageHours = Math.floor((now.getTime() - new Date(f.created_at).getTime()) / (1000 * 60 * 60))
    items.push({
      organization_id: f.organization_id || '',
      organization_name: (f as any).organizations?.name || 'System',
      organization_slug: (f as any).organizations?.slug || '',
      item_type: f.failure_type === 'haiec_provisioning' || f.failure_type === 'kestrel_provisioning' ? 'provisioning_failure' : 'payment_failure',
      priority: f.severity === 'critical' ? 'high' : f.severity === 'error' ? 'medium' : 'low',
      age_hours: ageHours,
      target_date: null,
      status: 'unresolved',
      direct_link: `/app/admin`,
      title: f.message,
      dismissable: false,
    })
  }

  // Sort by priority (high first), then by age (oldest first)
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  items.sort((a, b) => {
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }
    return b.age_hours - a.age_hours
  })

  return items
}

/**
 * Fetch client health indicators (transparent operational facts, not AI scoring).
 */
export interface ClientHealthIndicator {
  organization_id: string
  organization_name: string
  indicators: {
    type: string
    label: string
    severity: 'info' | 'warning' | 'critical'
    detail: string
  }[]
}

export async function fetchClientHealth(): Promise<ClientHealthIndicator[]> {
  const clients = await fetchAdvisoryClients()
  const results: ClientHealthIndicator[] = []

  for (const client of clients) {
    const indicators: ClientHealthIndicator['indicators'] = []

    if (client.onboarding_status && client.onboarding_status !== 'completed') {
      indicators.push({
        type: 'onboarding_incomplete',
        label: 'Onboarding incomplete',
        severity: 'warning',
        detail: `Status: ${client.onboarding_status}`,
      })
    }

    if (client.requests_needing_response > 0) {
      indicators.push({
        type: 'unanswered_request',
        label: 'Unanswered request',
        severity: client.response_aging_hours && client.response_aging_hours > 72 ? 'critical' : 'warning',
        detail: `${client.requests_needing_response} request(s) needing response, ${client.response_aging_hours || 0}h aging`,
      })
    }

    if (client.actions_overdue > 0) {
      indicators.push({
        type: 'overdue_action',
        label: 'Overdue action',
        severity: 'warning',
        detail: `${client.actions_overdue} overdue action(s)`,
      })
    }

    if (client.haiec_provisioning_status === 'provisioning_failed' || client.kestrel_provisioning_status === 'provisioning_failed') {
      indicators.push({
        type: 'provisioning_issue',
        label: 'Provisioning issue',
        severity: 'critical',
        detail: `HAIEC: ${client.haiec_provisioning_status}, Kestrel: ${client.kestrel_provisioning_status}`,
      })
    }

    if (client.subscription_status === 'suspended' || client.subscription_status === 'past_due') {
      indicators.push({
        type: 'payment_issue',
        label: 'Payment issue',
        severity: 'critical',
        detail: `Subscription status: ${client.subscription_status}`,
      })
    }

    if (client.cancellation_state === 'cancel_at_period_end') {
      indicators.push({
        type: 'cancellation_pending',
        label: 'Cancellation pending',
        severity: 'warning',
        detail: 'Cancel at period end',
      })
    }

    if (client.lifecycle_state === 'READ_ONLY') {
      indicators.push({
        type: 'read_only',
        label: 'Read-only mode',
        severity: 'info',
        detail: `Read-only until ${client.readonly_until || 'unknown'}`,
      })
    }

    if (client.last_interaction_at) {
      const daysSince = (Date.now() - new Date(client.last_interaction_at).getTime()) / (1000 * 60 * 60 * 24)
      if (daysSince > 14 && client.lifecycle_state === 'ACTIVE') {
        indicators.push({
          type: 'no_interaction',
          label: `No interaction in ${Math.floor(daysSince)} days`,
          severity: daysSince > 30 ? 'warning' : 'info',
          detail: `Last interaction: ${client.last_interaction_at}`,
        })
      }
    }

    if (client.is_fractional && client.monthly_brief_status === 'draft') {
      indicators.push({
        type: 'brief_due',
        label: 'Monthly brief due',
        severity: 'warning',
        detail: 'Brief is in draft status',
      })
    }

    if (indicators.length > 0) {
      results.push({
        organization_id: client.organization_id,
        organization_name: client.organization_name,
        indicators,
      })
    }
  }

  return results
}
