'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { AuthenticatedUser } from '@/lib/auth/organization-resolver'
import type { EngagementFullData } from '@/lib/engagement/types'
import {
  HEALTH_LABELS,
  DECISION_STATUS_LABELS,
  ARTIFACT_STATUS_LABELS,
  CHANGE_REQUEST_STATUS_LABELS,
  RESPONSIBILITY_LABELS,
} from '@/lib/engagement/types'
import { CharterPanel } from './panels/CharterPanel'
import { OutcomesPanel } from './panels/OutcomesPanel'
import { WorkstreamsPanel } from './panels/WorkstreamsPanel'
import { DecisionsPanel } from './panels/DecisionsPanel'
import { ArtifactsPanel } from './panels/ArtifactsPanel'
import { UpdatesPanel } from './panels/UpdatesPanel'
import { ScopeChangesPanel } from './panels/ScopeChangesPanel'
import { InternalNotesPanel } from './panels/InternalNotesPanel'
import { ParticipantsPanel } from './panels/ParticipantsPanel'
import { SolutionsPanel } from './panels/SolutionsPanel'
import { AcceleratorsPanel } from './panels/AcceleratorsPanel'

interface Props {
  user: AuthenticatedUser
  data: EngagementFullData
  isAdvisor: boolean
}

type Tab = 'overview' | 'charter' | 'outcomes' | 'workstreams' | 'decisions' | 'artifacts' | 'updates' | 'scope' | 'notes' | 'participants' | 'solutions' | 'accelerators'

const TABS: { key: Tab; label: string; badge?: (d: EngagementFullData) => number }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'charter', label: 'Charter' },
  { key: 'outcomes', label: 'Outcomes' },
  { key: 'workstreams', label: 'Workstreams' },
  { key: 'decisions', label: 'Decisions', badge: d => d.decisions.filter(x => x.status === 'open').length },
  { key: 'artifacts', label: 'Deliverables', badge: d => d.artifacts.filter(x => x.status === 'ready_for_review').length },
  { key: 'updates', label: 'Updates', badge: d => d.updates.filter(x => x.status === 'draft').length },
  { key: 'scope', label: 'Scope Changes', badge: d => d.changeRequests.filter(x => x.status === 'proposed').length },
  { key: 'notes', label: 'Internal Notes' },
  { key: 'participants', label: 'Participants' },
  { key: 'solutions', label: 'Solutions' },
  { key: 'accelerators', label: 'Accelerators' },
]

export function EngagementWorkspaceClient({ user, data, isAdvisor }: Props) {
  const [tab, setTab] = useState<Tab>('overview')
  const eng = data.charter

  const healthColor: Record<string, string> = {
    on_track: 'text-green-400 bg-green-900/20 border-green-800/30',
    needs_attention: 'text-amber-400 bg-amber-900/20 border-amber-800/30',
    blocked: 'text-red-400 bg-red-900/20 border-red-800/30',
  }

  const isCompleted = eng.status === 'completed'

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0]">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-4 text-xs text-[#666]">
          <Link href="/app/advisor" className="hover:text-[#aaa]">Advisor Console</Link>
          <span className="mx-2">/</span>
          <span className="text-[#aaa]">{eng.title || 'Engagement'}</span>
        </div>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold">{eng.title || 'Untitled Engagement'}</h1>
              <p className="text-sm text-[#888] mt-1">{eng.statement}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-3 py-1 rounded-full border font-medium ${healthColor[eng.health_status] || ''}`}>
                {HEALTH_LABELS[eng.health_status] || eng.health_status}
              </span>
              {isCompleted && (
                <span className="text-xs px-3 py-1 rounded-full border border-[#444] bg-[#222] text-[#888]">
                  Completed
                </span>
              )}
            </div>
          </div>

          {eng.health_reason && (
            <div className="mt-2 text-xs text-[#aaa] italic">
              {eng.health_reason}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-[#222] mb-6 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {TABS.map(t => {
              const badge = t.badge?.(data) ?? 0
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    tab === t.key
                      ? 'border-[#d4a017] text-[#d4a017]'
                      : 'border-transparent text-[#888] hover:text-[#ccc]'
                  }`}
                >
                  {t.label}
                  {badge > 0 && (
                    <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded bg-[#d4a017]/20 text-[#d4a017]">
                      {badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {tab === 'overview' && <OverviewTab data={data} />}
          {tab === 'charter' && <CharterPanel data={data} isAdvisor={isAdvisor} />}
          {tab === 'outcomes' && <OutcomesPanel data={data} isAdvisor={isAdvisor} />}
          {tab === 'workstreams' && <WorkstreamsPanel data={data} isAdvisor={isAdvisor} />}
          {tab === 'decisions' && <DecisionsPanel data={data} isAdvisor={isAdvisor} />}
          {tab === 'artifacts' && <ArtifactsPanel data={data} isAdvisor={isAdvisor} user={user} />}
          {tab === 'updates' && <UpdatesPanel data={data} isAdvisor={isAdvisor} user={user} />}
          {tab === 'scope' && <ScopeChangesPanel data={data} isAdvisor={isAdvisor} user={user} />}
          {tab === 'notes' && <InternalNotesPanel data={data} isAdvisor={isAdvisor} user={user} />}
          {tab === 'participants' && <ParticipantsPanel data={data} isAdvisor={isAdvisor} />}
          {tab === 'solutions' && <SolutionsPanel data={data} isAdvisor={isAdvisor} />}
          {tab === 'accelerators' && <AcceleratorsPanel data={data} isAdvisor={isAdvisor} />}
        </div>
      </div>
    </div>
  )
}

function OverviewTab({ data }: { data: EngagementFullData }) {
  const eng = data.charter
  const today = new Date().toISOString().split('T')[0]
  const upcomingMilestones = data.milestones
    .filter(m => m.status !== 'completed' && m.status !== 'cancelled')
    .sort((a, b) => (a.target_date || '9999').localeCompare(b.target_date || '9999'))
    .slice(0, 5)
  const openDecisions = data.decisions.filter(d => d.status === 'open')
  const overdueActions = data.actions.filter(a => a.status !== 'completed' && a.due_date && a.due_date < today)
  const publishedArtifacts = data.artifacts.filter(a => a.status === 'published')
  const readyArtifacts = data.artifacts.filter(a => a.status === 'ready_for_review')

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Charter Summary */}
      <div className="rounded-lg border border-[#222] bg-[#111] p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#888] mb-3">Charter</h3>
        <dl className="space-y-2 text-sm">
          <Row label="Purpose" value={eng.statement} />
          <Row label="Executive Sponsor" value={eng.executive_sponsor} />
          <Row label="Client Lead" value={eng.client_lead} />
          <Row label="Advisor Lead" value={eng.advisor_lead} />
          <Row label="Review Cadence" value={eng.review_cadence?.replace('_', ' ')} />
          <Row label="Current Phase" value={eng.current_phase} />
          <Row label="Start Date" value={eng.starts_at?.split('T')[0]} />
          <Row label="Target End" value={eng.ends_at?.split('T')[0]} />
        </dl>
      </div>

      {/* Scope */}
      <div className="rounded-lg border border-[#222] bg-[#111] p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#888] mb-3">Scope</h3>
        <div className="space-y-3 text-sm">
          <div>
            <dt className="text-xs text-[#888] mb-1">In Scope</dt>
            <dd className="text-[#ccc]">{eng.in_scope || 'Not defined'}</dd>
          </div>
          <div>
            <dt className="text-xs text-[#888] mb-1">Out of Scope</dt>
            <dd className="text-[#ccc]">{eng.out_of_scope || 'Not defined'}</dd>
          </div>
        </div>
      </div>

      {/* Upcoming Milestones */}
      <div className="rounded-lg border border-[#222] bg-[#111] p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#888] mb-3">Upcoming Milestones</h3>
        {upcomingMilestones.length === 0 ? (
          <p className="text-sm text-[#666]">No upcoming milestones</p>
        ) : (
          <div className="space-y-2">
            {upcomingMilestones.map(m => (
              <div key={m.id} className="flex items-center justify-between text-sm">
                <span className="text-[#ccc]">{m.title}</span>
                <span className={`text-xs ${m.target_date && m.target_date < today ? 'text-red-400' : 'text-[#888]'}`}>
                  {m.target_date || 'No date'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Open Decisions */}
      <div className="rounded-lg border border-[#222] bg-[#111] p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#888] mb-3">Decisions Needed</h3>
        {openDecisions.length === 0 ? (
          <p className="text-sm text-[#666]">No open decisions</p>
        ) : (
          <div className="space-y-2">
            {openDecisions.map(d => (
              <div key={d.id} className="text-sm">
                <div className="text-[#ccc]">{d.title}</div>
                <div className="text-xs text-[#888] mt-0.5">
                  Owner: {d.decision_owner || 'Unassigned'}
                  {d.needed_by && <span className={`ml-2 ${d.needed_by < today ? 'text-red-400' : ''}`}>Due: {d.needed_by}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Overdue Actions */}
      <div className="rounded-lg border border-[#222] bg-[#111] p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#888] mb-3">Overdue Actions</h3>
        {overdueActions.length === 0 ? (
          <p className="text-sm text-[#666]">No overdue actions</p>
        ) : (
          <div className="space-y-2">
            {overdueActions.map(a => (
              <div key={a.id} className="text-sm">
                <div className="text-[#ccc]">{a.title}</div>
                <div className="text-xs text-red-400 mt-0.5">
                  Due: {a.due_date} | {a.assignee_label || 'Unassigned'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Deliverables Summary */}
      <div className="rounded-lg border border-[#222] bg-[#111] p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#888] mb-3">Deliverables</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Stat label="Published" value={publishedArtifacts.length} color="green" />
          <Stat label="Ready to Review" value={readyArtifacts.length} color="blue" />
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-xs text-[#888] whitespace-nowrap">{label}</dt>
      <dd className="text-[#ccc] text-right">{value || '—'}</dd>
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    green: 'text-green-400',
    blue: 'text-blue-400',
    amber: 'text-amber-400',
    red: 'text-red-400',
  }
  return (
    <div className="flex flex-col">
      <span className={`text-lg font-bold ${colors[color] || ''}`}>{value}</span>
      <span className="text-xs text-[#888]">{label}</span>
    </div>
  )
}
