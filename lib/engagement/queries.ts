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
    .select('*')
    .eq('id', engagementId)
    .single()

  if (!charter) return null

  const orgId = charter.organization_id

  const [outcomes, workstreams, milestones, actions, decisions, updates, artifacts, accelerators, participants, changeRequests, internalNotes, acknowledgments, solutionLinks] = await Promise.all([
    sc.from('engagement_outcomes').select('*').eq('engagement_id', engagementId).order('display_order'),
    sc.from('engagement_workstreams').select('*').eq('engagement_id', engagementId).order('display_order'),
    sc.from('engagement_milestones').select('*').eq('engagement_id', engagementId).order('display_order'),
    sc.from('engagement_actions').select('*').eq('engagement_id', engagementId).order('display_order'),
    sc.from('engagement_decisions').select('*').eq('engagement_id', engagementId).order('display_order'),
    sc.from('engagement_updates').select('*').eq('engagement_id', engagementId).order('display_order', { ascending: false }),
    sc.from('engagement_artifacts').select('*').eq('engagement_id', engagementId).order('display_order'),
    sc.from('engagement_accelerators').select('*').eq('engagement_id', engagementId).order('display_order'),
    sc.from('engagement_participants')
      .select('id, engagement_id, user_id, responsibility, display_name, profiles!inner(email)')
      .eq('engagement_id', engagementId)
      .order('responsibility'),
    sc.from('engagement_change_requests').select('*').eq('engagement_id', engagementId).order('created_at', { ascending: false }),
    sc.from('engagement_internal_notes').select('*').eq('engagement_id', engagementId).order('created_at', { ascending: false }),
    sc.from('engagement_acknowledgments').select('*').eq('engagement_id', engagementId).order('created_at', { ascending: false }),
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
    .select('*')
    .eq('id', engagementId)
    .single()

  if (!charter) return null

  const [outcomes, workstreams, milestones, actions, decisions, updates, artifacts, accelerators, participants, changeRequests, acknowledgments, solutionLinks] = await Promise.all([
    sc.from('engagement_outcomes').select('*').eq('engagement_id', engagementId).order('display_order'),
    sc.from('engagement_workstreams').select('*').eq('engagement_id', engagementId).order('display_order'),
    sc.from('engagement_milestones').select('*').eq('engagement_id', engagementId).order('display_order'),
    sc.from('engagement_actions').select('*').eq('engagement_id', engagementId).eq('is_client_action', true).order('display_order'),
    sc.from('engagement_decisions').select('*').eq('engagement_id', engagementId).order('display_order'),
    sc.from('engagement_updates').select('*').eq('engagement_id', engagementId).eq('status', 'published').order('display_order', { ascending: false }),
    sc.from('engagement_artifacts').select('*').eq('engagement_id', engagementId).eq('status', 'published').order('display_order'),
    sc.from('engagement_accelerators').select('*').eq('engagement_id', engagementId).order('display_order'),
    sc.from('engagement_participants')
      .select('id, engagement_id, user_id, responsibility, display_name, profiles!inner(email)')
      .eq('engagement_id', engagementId)
      .order('responsibility'),
    sc.from('engagement_change_requests').select('*').eq('engagement_id', engagementId).eq('status', 'accepted').eq('client_visible', true).order('created_at', { ascending: false }),
    sc.from('engagement_acknowledgments').select('*').eq('engagement_id', engagementId).order('created_at', { ascending: false }),
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
    .select('*')
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

  // For each engagement, get summary counts
  const portfolio: AdvisorPortfolioItem[] = []

  for (const eng of engagements) {
    const engId = eng.id
    const today = new Date().toISOString().split('T')[0]

    const [decisionsRes, milestonesRes, actionsRes, artifactsRes, updatesRes] = await Promise.all([
      sc.from('engagement_decisions').select('status, needed_by').eq('engagement_id', engId),
      sc.from('engagement_milestones').select('status, target_date').eq('engagement_id', engId).neq('status', 'completed').neq('status', 'cancelled'),
      sc.from('engagement_actions').select('status, due_date, is_client_action').eq('engagement_id', engId).neq('status', 'completed').neq('status', 'cancelled'),
      sc.from('engagement_artifacts').select('status').eq('engagement_id', engId),
      sc.from('engagement_updates').select('title, published_at, status').eq('engagement_id', engId).order('display_order', { ascending: false }).limit(1),
    ])

    const decisions = decisionsRes.data || []
    const milestones = milestonesRes.data || []
    const actions = actionsRes.data || []
    const artifacts = artifactsRes.data || []
    const updates = updatesRes.data || []

    const openDecisions = decisions.filter(d => d.status === 'open').length
    const overdueDecisions = decisions.filter(d => d.status === 'open' && d.needed_by && d.needed_by < today).length
    const upcomingMilestones = milestones.filter(m => m.target_date && m.target_date >= today).length
    const overdueClientActions = actions.filter(a => a.is_client_action && a.due_date && a.due_date < today).length
    const draftArtifacts = artifacts.filter(a => a.status === 'draft').length
    const readyToPublish = artifacts.filter(a => a.status === 'ready_for_review').length
    const draftUpdates = updates.filter(u => u.status === 'draft').length

    const org = orgMap.get(eng.organization_id)

    portfolio.push({
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
      latest_update_title: updates[0]?.title ?? null,
      latest_update_date: updates[0]?.published_at ?? null,
    })
  }

  return portfolio
}
