import { createServiceClient } from '@/lib/supabase'
import type {
  EngagementCharter,
  EngagementOutcome,
  EngagementWorkstream,
  EngagementMilestone,
  EngagementAction,
  EngagementDecision,
  EngagementUpdate,
  EngagementArtifact,
  EngagementAccelerator,
  EngagementParticipant,
  EngagementChangeRequest,
  EngagementInternalNote,
  EngagementAcknowledgment,
  EngagementSolutionLink,
  EngagementFullData,
  AdvisorPortfolioItem,
} from './types'

/**
 * Get a single engagement by ID with all related data.
 * Uses service client for server-side aggregation.
 * Caller is responsible for verifying org membership before calling.
 */
export async function getEngagementFullData(engagementId: string): Promise<EngagementFullData | null> {
  const sc = createServiceClient()
  if (!sc) return null

  const { data: charter } = await sc
    .from('engagements')
    .select('id, organization_id, engagement_type, status, title, statement, in_scope, out_of_scope, executive_sponsor, client_lead, advisor_lead, starts_at, ends_at, review_cadence, current_phase, health_status, health_reason, health_updated_at, completed_at, completed_reason, created_at, updated_at')
    .eq('id', engagementId)
    .single()

  if (!charter) return null

  const orgId = charter.organization_id

  const [outcomes, workstreams, milestones, actions, decisions, updates, artifacts, accelerators, participants, changeRequests, internalNotes, acknowledgments, solutionLinks] = await Promise.all([
    sc.from('engagement_outcomes').select('id, engagement_id, title, description, baseline_value, target_value, current_value, unit, measurement_source, last_measured_at, status, display_order').eq('engagement_id', engagementId).order('display_order'),
    sc.from('engagement_workstreams').select('id, engagement_id, name, description, owner_label, status, display_order, is_blocked, blocking_reason').eq('engagement_id', engagementId).order('display_order'),
    sc.from('engagement_milestones').select('id, engagement_id, workstream_id, title, description, target_date, completed_at, status, display_order').eq('engagement_id', engagementId).order('display_order'),
    sc.from('engagement_actions').select('id, engagement_id, workstream_id, title, description, assignee_label, assignee_user_id, due_date, completed_at, status, is_client_action, is_blocked, blocking_reason, display_order').eq('engagement_id', engagementId).order('display_order'),
    sc.from('engagement_decisions').select('id, engagement_id, workstream_id, title, description, decision_owner, decision_owner_user_id, needed_by, decided_at, decision_rationale, status, display_order').eq('engagement_id', engagementId).order('display_order'),
    sc.from('engagement_updates').select('id, engagement_id, title, what_changed, in_progress, what_next, needs_attention, risks_blockers, status, authored_by, published_at, display_order, created_at').eq('engagement_id', engagementId).order('display_order', { ascending: false }),
    sc.from('engagement_artifacts').select('id, engagement_id, workstream_id, title, description, artifact_type, storage_path, external_url, status, requires_acknowledgment, authored_by, published_at, superseded_at, superseded_by, display_order, created_at').eq('engagement_id', engagementId).order('display_order'),
    sc.from('engagement_accelerators').select('id, engagement_id, accelerator_key, accelerator_name, reference_url, notes, display_order').eq('engagement_id', engagementId).order('display_order'),
    sc.from('engagement_participants')
      .select('id, engagement_id, user_id, responsibility, display_name, profiles!inner(email)')
      .eq('engagement_id', engagementId)
      .order('responsibility'),
    sc.from('engagement_change_requests').select('id, engagement_id, title, description, reason, impact_summary, requested_by, requested_at, status, client_visible, accepted_by, accepted_at, created_at').eq('engagement_id', engagementId).order('created_at', { ascending: false }),
    sc.from('engagement_internal_notes').select('id, engagement_id, author_id, content, note_category, created_at, updated_at').eq('engagement_id', engagementId).order('created_at', { ascending: false }),
    sc.from('engagement_acknowledgments').select('id, artifact_id, user_id, response, comment, created_at').eq('engagement_id', engagementId).order('created_at', { ascending: false }),
    sc.from('engagement_solution_links')
      .select('id, engagement_id, external_link_id, solution_label, deployment_label, display_order, external_system_links!inner(system_key, external_id, status, metadata)')
      .eq('engagement_id', engagementId)
      .order('display_order'),
  ])

  return {
    charter: charter as EngagementCharter,
    outcomes: (outcomes.data || []) as EngagementOutcome[],
    workstreams: (workstreams.data || []) as EngagementWorkstream[],
    milestones: (milestones.data || []) as EngagementMilestone[],
    actions: (actions.data || []) as EngagementAction[],
    decisions: (decisions.data || []) as EngagementDecision[],
    updates: (updates.data || []) as EngagementUpdate[],
    artifacts: (artifacts.data || []) as EngagementArtifact[],
    accelerators: (accelerators.data || []) as EngagementAccelerator[],
    participants: (participants.data || []).map((p: any) => ({
      id: p.id,
      engagement_id: p.engagement_id,
      user_id: p.user_id,
      responsibility: p.responsibility,
      display_name: p.display_name,
      email: p.profiles?.email ?? null,
    })) as EngagementParticipant[],
    changeRequests: (changeRequests.data || []) as EngagementChangeRequest[],
    internalNotes: (internalNotes.data || []) as EngagementInternalNote[],
    acknowledgments: (acknowledgments.data || []) as EngagementAcknowledgment[],
    solutionLinks: (solutionLinks.data || []).map((s: any) => ({
      id: s.id,
      engagement_id: s.engagement_id,
      external_link_id: s.external_link_id,
      solution_label: s.solution_label,
      deployment_label: s.deployment_label,
      display_order: s.display_order,
      external_link: s.external_system_links,
    })) as EngagementSolutionLink[],
  }
}

/**
 * Get client-visible engagement data (no internal notes, only published updates/artifacts).
 */
export async function getClientVisibleEngagementData(engagementId: string) {
  const sc = createServiceClient()
  if (!sc) return null

  const { data: charter } = await sc
    .from('engagements')
    .select('id, organization_id, engagement_type, status, title, statement, in_scope, out_of_scope, executive_sponsor, client_lead, advisor_lead, starts_at, ends_at, review_cadence, current_phase, health_status, health_reason, health_updated_at, completed_at, completed_reason, created_at, updated_at')
    .eq('id', engagementId)
    .single()

  if (!charter) return null

  const [outcomes, workstreams, milestones, actions, decisions, updates, artifacts, accelerators, participants, changeRequests, acknowledgments, solutionLinks] = await Promise.all([
    sc.from('engagement_outcomes').select('id, engagement_id, title, description, baseline_value, target_value, current_value, unit, measurement_source, last_measured_at, status, display_order').eq('engagement_id', engagementId).order('display_order'),
    sc.from('engagement_workstreams').select('id, engagement_id, name, description, owner_label, status, display_order, is_blocked, blocking_reason').eq('engagement_id', engagementId).order('display_order'),
    sc.from('engagement_milestones').select('id, engagement_id, workstream_id, title, description, target_date, completed_at, status, display_order').eq('engagement_id', engagementId).order('display_order'),
    sc.from('engagement_actions').select('id, engagement_id, workstream_id, title, description, assignee_label, assignee_user_id, due_date, completed_at, status, is_client_action, is_blocked, blocking_reason, display_order').eq('engagement_id', engagementId).eq('is_client_action', true).order('display_order'),
    sc.from('engagement_decisions').select('id, engagement_id, workstream_id, title, description, decision_owner, decision_owner_user_id, needed_by, decided_at, decision_rationale, status, display_order').eq('engagement_id', engagementId).order('display_order'),
    sc.from('engagement_updates').select('id, engagement_id, title, what_changed, in_progress, what_next, needs_attention, risks_blockers, status, authored_by, published_at, display_order, created_at').eq('engagement_id', engagementId).eq('status', 'published').order('display_order', { ascending: false }),
    sc.from('engagement_artifacts').select('id, engagement_id, workstream_id, title, description, artifact_type, storage_path, external_url, status, requires_acknowledgment, authored_by, published_at, superseded_at, superseded_by, display_order, created_at').eq('engagement_id', engagementId).eq('status', 'published').order('display_order'),
    sc.from('engagement_accelerators').select('id, engagement_id, accelerator_key, accelerator_name, reference_url, notes, display_order').eq('engagement_id', engagementId).order('display_order'),
    sc.from('engagement_participants')
      .select('id, engagement_id, user_id, responsibility, display_name, profiles!inner(email)')
      .eq('engagement_id', engagementId)
      .order('responsibility'),
    sc.from('engagement_change_requests').select('id, engagement_id, title, description, reason, impact_summary, requested_by, requested_at, status, client_visible, accepted_by, accepted_at, created_at').eq('engagement_id', engagementId).eq('status', 'accepted').eq('client_visible', true).order('created_at', { ascending: false }),
    sc.from('engagement_acknowledgments').select('id, artifact_id, user_id, response, comment, created_at').eq('engagement_id', engagementId).order('created_at', { ascending: false }),
    sc.from('engagement_solution_links')
      .select('id, engagement_id, external_link_id, solution_label, deployment_label, display_order, external_system_links!inner(system_key, external_id, status, metadata)')
      .eq('engagement_id', engagementId)
      .order('display_order'),
  ])

  return {
    charter: charter as EngagementCharter,
    outcomes: (outcomes.data || []) as EngagementOutcome[],
    workstreams: (workstreams.data || []) as EngagementWorkstream[],
    milestones: (milestones.data || []) as EngagementMilestone[],
    actions: (actions.data || []) as EngagementAction[],
    decisions: (decisions.data || []) as EngagementDecision[],
    updates: (updates.data || []) as EngagementUpdate[],
    artifacts: (artifacts.data || []) as EngagementArtifact[],
    accelerators: (accelerators.data || []) as EngagementAccelerator[],
    participants: (participants.data || []).map((p: any) => ({
      id: p.id,
      engagement_id: p.engagement_id,
      user_id: p.user_id,
      responsibility: p.responsibility,
      display_name: p.display_name,
      email: p.profiles?.email ?? null,
    })) as EngagementParticipant[],
    changeRequests: (changeRequests.data || []) as EngagementChangeRequest[],
    acknowledgments: (acknowledgments.data || []) as EngagementAcknowledgment[],
    solutionLinks: (solutionLinks.data || []).map((s: any) => ({
      id: s.id,
      engagement_id: s.engagement_id,
      external_link_id: s.external_link_id,
      solution_label: s.solution_label,
      deployment_label: s.deployment_label,
      display_order: s.display_order,
      external_link: s.external_system_links,
    })) as EngagementSolutionLink[],
  }
}

/**
 * Get advisor portfolio: all engagements where user is an advisor or org admin.
 * Returns summary data for the advisor console.
 */
export async function getAdvisorPortfolio(userId: string): Promise<AdvisorPortfolioItem[]> {
  const sc = createServiceClient()
  if (!sc) return []

  // Get all orgs where user is admin or owner
  const { data: memberships } = await sc
    .from('organization_memberships')
    .select('organization_id, role')
    .eq('user_id', userId)
    .eq('status', 'active')
    .in('role', ['admin', 'owner'])

  if (!memberships || memberships.length === 0) return []

  const orgIds = memberships.map(m => m.organization_id)

  // Get all active engagements for these orgs
  const { data: engagements } = await sc
    .from('engagements')
    .select('id, organization_id, engagement_type, status, title, statement, in_scope, out_of_scope, executive_sponsor, client_lead, advisor_lead, starts_at, ends_at, review_cadence, current_phase, health_status, health_reason, health_updated_at, completed_at, completed_reason, created_at, updated_at')
    .in('organization_id', orgIds)
    .neq('status', 'cancelled')
    .order('updated_at', { ascending: false })

  if (!engagements || engagements.length === 0) return []

  // Get org names
  const { data: orgs } = await sc
    .from('organizations')
    .select('id, name, slug')
    .in('id', orgIds)

  const orgMap = new Map((orgs || []).map(o => [o.id, o]))

  const engIds = engagements.map(e => e.id)
  const today = new Date().toISOString().split('T')[0]

  // Batch fetch all summary data in 5 parallel queries (not N*5)
  const [allDecisions, allMilestones, allActions, allArtifacts, allUpdates] = await Promise.all([
    sc.from('engagement_decisions').select('engagement_id, status, needed_by').in('engagement_id', engIds),
    sc.from('engagement_milestones').select('engagement_id, status, target_date').in('engagement_id', engIds).neq('status', 'completed').neq('status', 'cancelled'),
    sc.from('engagement_actions').select('engagement_id, status, due_date, is_client_action').in('engagement_id', engIds).neq('status', 'completed').neq('status', 'cancelled'),
    sc.from('engagement_artifacts').select('engagement_id, status').in('engagement_id', engIds),
    sc.from('engagement_updates').select('engagement_id, title, published_at, status, display_order').in('engagement_id', engIds).order('display_order', { ascending: false }),
  ])

  // Group by engagement_id
  const decisionsByEng = new Map<string, any[]>()
  const milestonesByEng = new Map<string, any[]>()
  const actionsByEng = new Map<string, any[]>()
  const artifactsByEng = new Map<string, any[]>()
  const updatesByEng = new Map<string, any>()

  for (const d of (allDecisions.data || [])) {
    const arr = decisionsByEng.get(d.engagement_id) || []
    arr.push(d)
    decisionsByEng.set(d.engagement_id, arr)
  }
  for (const m of (allMilestones.data || [])) {
    const arr = milestonesByEng.get(m.engagement_id) || []
    arr.push(m)
    milestonesByEng.set(m.engagement_id, arr)
  }
  for (const a of (allActions.data || [])) {
    const arr = actionsByEng.get(a.engagement_id) || []
    arr.push(a)
    actionsByEng.set(a.engagement_id, arr)
  }
  for (const a of (allArtifacts.data || [])) {
    const arr = artifactsByEng.get(a.engagement_id) || []
    arr.push(a)
    artifactsByEng.set(a.engagement_id, arr)
  }
  for (const u of (allUpdates.data || [])) {
    if (!updatesByEng.has(u.engagement_id)) {
      updatesByEng.set(u.engagement_id, u) // First = latest due to order
    }
  }

  const portfolio: AdvisorPortfolioItem[] = engagements.map((eng) => {
    const decisions = decisionsByEng.get(eng.id) || []
    const milestones = milestonesByEng.get(eng.id) || []
    const actions = actionsByEng.get(eng.id) || []
    const artifacts = artifactsByEng.get(eng.id) || []
    const latestUpdate = updatesByEng.get(eng.id)

    const openDecisions = decisions.filter(d => d.status === 'open').length
    const overdueDecisions = decisions.filter(d => d.status === 'open' && d.needed_by && d.needed_by < today).length
    const upcomingMilestones = milestones.filter(m => m.target_date && m.target_date >= today).length
    const overdueClientActions = actions.filter(a => a.is_client_action && a.due_date && a.due_date < today).length
    const draftArtifacts = artifacts.filter(a => a.status === 'draft').length
    const readyToPublish = artifacts.filter(a => a.status === 'ready_for_review').length
    const draftUpdates = latestUpdate?.status === 'draft' ? 1 : 0

    const org = orgMap.get(eng.organization_id)

    return {
      engagement: eng as EngagementCharter,
      organization_name: org?.name ?? 'Unknown',
      organization_slug: org?.slug ?? '',
      open_decisions: openDecisions,
      overdue_decisions: overdueDecisions,
      upcoming_milestones: upcomingMilestones,
      overdue_client_actions: overdueClientActions,
      draft_artifacts: draftArtifacts,
      ready_to_publish_artifacts: readyToPublish,
      draft_updates: draftUpdates,
      latest_update_title: latestUpdate?.title ?? null,
      latest_update_date: latestUpdate?.published_at ?? null,
    }
  })

  return portfolio
}
