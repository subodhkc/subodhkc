import { createServiceClient } from '@/lib/supabase'
import { getEngagementFullData, getClientVisibleEngagementData } from '@/lib/engagement/queries'
import type { EngagementFullData } from '@/lib/engagement/types'

export interface AdvisorContextInput {
  engagementId: string
  contextType: 'client' | 'internal'
  userId: string
}

export interface PreparedContext {
  engagementSummary: string
  openDecisions: string
  upcomingMilestones: string
  activeActions: string
  recentUpdates: string
  artifacts: string
  risks: string
  frontofaiSignals: string | null
  tokenEstimate: number
}

/**
 * Build a structured context payload for the AI advisor.
 * Strictly separates client-visible vs internal context.
 * Never sends internal notes, draft artifacts, or draft updates to client context.
 */
export async function prepareAdvisorContext(input: AdvisorContextInput): Promise<PreparedContext | null> {
  const sc = createServiceClient()
  if (!sc) return null

  let data: EngagementFullData | null
  if (input.contextType === 'client') {
    const clientData = await getClientVisibleEngagementData(input.engagementId)
    if (!clientData) return null
    data = clientData as EngagementFullData
  } else {
    data = await getEngagementFullData(input.engagementId)
  }

  if (!data) return null

  const c = data.charter
  const engagementSummary = `Engagement: ${c.title || 'Untitled'}
Type: ${c.engagement_type}
Status: ${c.status}
Phase: ${c.current_phase}
Health: ${c.health_status}${c.health_reason ? ` (${c.health_reason})` : ''}
Statement: ${c.statement || 'N/A'}
In Scope: ${c.in_scope || 'N/A'}
Out of Scope: ${c.out_of_scope || 'N/A'}
Executive Sponsor: ${c.executive_sponsor || 'N/A'}
Client Lead: ${c.client_lead || 'N/A'}
Advisor Lead: ${c.advisor_lead || 'N/A'}
Starts: ${c.starts_at || 'N/A'}
Ends: ${c.ends_at || 'N/A'}`

  const openDecisions = data.decisions
    .filter(d => d.status === 'open')
    .map(d => `- ${d.title}${d.needed_by ? ` (needed by ${d.needed_by})` : ''}${d.description ? `: ${d.description}` : ''}`)
    .join('\n') || 'No open decisions'

  const upcomingMilestones = data.milestones
    .filter(m => m.status !== 'completed' && m.status !== 'cancelled')
    .map(m => `- ${m.title}${m.target_date ? ` (target: ${m.target_date})` : ''}`)
    .join('\n') || 'No upcoming milestones'

  const activeActions = data.actions
    .filter(a => a.status !== 'completed' && a.status !== 'cancelled')
    .map(a => `- ${a.title}${a.due_date ? ` (due: ${a.due_date})` : ''}${a.is_client_action ? ' [Client Action]' : ''}${a.is_blocked ? ' [BLOCKED]' : ''}`)
    .join('\n') || 'No active actions'

  const recentUpdates = data.updates
    .slice(0, 5)
    .map(u => `- ${u.title}${u.published_at ? ` (${u.published_at})` : ''}: ${u.what_changed || ''}`)
    .join('\n') || 'No recent updates'

  const artifacts = data.artifacts
    .map(a => `- ${a.title} [${a.status}]${a.artifact_type ? ` (${a.artifact_type})` : ''}`)
    .join('\n') || 'No artifacts'

  const risks = [
    ...data.workstreams.filter(w => w.is_blocked).map(w => `- Workstream "${w.name}" blocked: ${w.blocking_reason || 'unknown'}`),
    ...data.actions.filter(a => a.is_blocked).map(a => `- Action "${a.title}" blocked: ${a.blocking_reason || 'unknown'}`),
  ].join('\n') || 'No active risks or blockers'

  // Check for FrontOfAI impact addendum
  let frontofaiSignals: string | null = null
  const { data: addendum } = await sc
    .from('engagement_impact_addenda')
    .select('signals, generated_at')
    .eq('engagement_id', input.engagementId)
    .order('generated_at', { ascending: false })
    .limit(1)

  if (addendum && addendum.length > 0) {
    const signals = addendum[0].signals as any
    frontofaiSignals = `FrontOfAI Impact Signals (generated ${addendum[0].generated_at}):
${JSON.stringify(signals, null, 2)}`
  }

  // Rough token estimate (4 chars per token)
  const allText = [engagementSummary, openDecisions, upcomingMilestones, activeActions, recentUpdates, artifacts, risks, frontofaiSignals || ''].join('\n\n')
  const tokenEstimate = Math.ceil(allText.length / 4)

  return {
    engagementSummary,
    openDecisions,
    upcomingMilestones,
    activeActions,
    recentUpdates,
    artifacts,
    risks,
    frontofaiSignals,
    tokenEstimate,
  }
}

/**
 * Build the system prompt for the AI advisor.
 * Different prompts for client vs internal context.
 */
export function buildSystemPrompt(contextType: 'client' | 'internal'): string {
  const base = `You are the SubodhKC Engagement Advisor, an AI assistant embedded in the SubodhKC Engagement Operating System. You provide strategic guidance on AI architecture, governance, and operations engagements.

RULES:
1. Answer ONLY based on the engagement context provided. Do not invent information.
2. Every claim about the engagement must reference specific data from the context.
3. If the context does not contain enough information, say so explicitly.
4. Keep responses concise and actionable. Maximum 500 words.
5. Structure responses with clear sections: Assessment, Recommendation, Next Steps.
6. Never reveal internal notes, draft artifacts, or advisor-only information.
7. Cite the engagement data source for each recommendation.`

  if (contextType === 'client') {
    return base + `\n\nCLIENT CONTEXT: You are advising a client stakeholder. You can only see published updates, published artifacts, accepted change requests, and client-visible actions. Do not reference internal discussions, draft work, or advisor-only deliberations.`
  }

  return base + `\n\nINTERNAL CONTEXT: You are advising an advisor or engagement lead. You have full visibility including internal notes, draft artifacts, draft updates, and all change requests. Use this information to provide deeper strategic guidance.`
}
