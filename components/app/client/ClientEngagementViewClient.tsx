'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { AuthenticatedUser } from '@/lib/auth/organization-resolver'
import type { EngagementFullData } from '@/lib/engagement/types'
import { RESPONSIBILITY_LABELS, HEALTH_LABELS } from '@/lib/engagement/types'

type ClientEngagementData = Omit<EngagementFullData, 'internalNotes'>

interface Props {
  user: AuthenticatedUser
  orgSlug: string
  data: ClientEngagementData
}

type Tab = 'overview' | 'updates' | 'deliverables' | 'outcomes' | 'participants'

export function ClientEngagementViewClient({ user, orgSlug, data }: Props) {
  const [tab, setTab] = useState<Tab>('overview')
  const eng = data.charter

  const healthColor: Record<string, string> = {
    on_track: 'text-green-400 bg-green-900/20 border-green-800/30',
    needs_attention: 'text-amber-400 bg-amber-900/20 border-amber-800/30',
    blocked: 'text-red-400 bg-red-900/20 border-red-800/30',
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0]">
      <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 text-xs text-[#666]">
          <Link href={`/app/${orgSlug}`} className="hover:text-[#aaa]">My Workspace</Link>
          <span className="mx-2">/</span>
          <span className="text-[#aaa]">{eng.title || 'Engagement'}</span>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold">{eng.title || 'Untitled Engagement'}</h1>
          {eng.statement && <p className="text-sm text-[#888] mt-1">{eng.statement}</p>}
          <div className="mt-3 flex items-center gap-3">
            <span className={`text-xs px-3 py-1 rounded-full border font-medium ${healthColor[eng.health_status] || ''}`}>
              {HEALTH_LABELS[eng.health_status] || eng.health_status}
            </span>
            <span className="text-xs text-[#888]">Phase: {eng.current_phase}</span>
          </div>
        </div>

        <div className="border-b border-[#222] mb-6 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {([
              ['overview', 'Overview'],
              ['updates', 'Updates'],
              ['deliverables', 'Deliverables'],
              ['outcomes', 'Outcomes'],
              ['participants', 'Participants'],
            ] as [Tab, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  tab === key ? 'border-[#d4a017] text-[#d4a017]' : 'border-transparent text-[#888] hover:text-[#ccc]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          {tab === 'overview' && <ClientOverview data={data} />}
          {tab === 'updates' && <ClientUpdates data={data} />}
          {tab === 'deliverables' && <ClientDeliverables data={data} user={user} />}
          {tab === 'outcomes' && <ClientOutcomes data={data} />}
          {tab === 'participants' && <ClientParticipants data={data} />}
        </div>
      </div>
    </div>
  )
}

function ClientOverview({ data }: { data: ClientEngagementData }) {
  const eng = data.charter
  const upcomingMilestones = data.milestones
    .filter(m => m.status !== 'completed' && m.status !== 'cancelled')
    .sort((a, b) => (a.target_date || '9999').localeCompare(b.target_date || '9999'))
    .slice(0, 5)
  const openDecisions = data.decisions.filter(d => d.status === 'open')
  const clientActions = data.actions.filter(a => a.is_client_action)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-lg border border-[#222] bg-[#111] p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#888] mb-3">Charter</h3>
        <dl className="space-y-2 text-sm">
          <Row label="Purpose" value={eng.statement} />
          <Row label="Executive Sponsor" value={eng.executive_sponsor} />
          <Row label="Client Lead" value={eng.client_lead} />
          <Row label="Advisor Lead" value={eng.advisor_lead} />
          <Row label="Review Cadence" value={eng.review_cadence?.replace('_', ' ')} />
          <Row label="Start Date" value={eng.starts_at?.split('T')[0]} />
          <Row label="Target End" value={eng.ends_at?.split('T')[0]} />
        </dl>
      </div>

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

      <div className="rounded-lg border border-[#222] bg-[#111] p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#888] mb-3">Upcoming Milestones</h3>
        {upcomingMilestones.length === 0 ? (
          <p className="text-sm text-[#666]">No upcoming milestones</p>
        ) : (
          <div className="space-y-2">
            {upcomingMilestones.map(m => (
              <div key={m.id} className="flex items-center justify-between text-sm">
                <span className="text-[#ccc]">{m.title}</span>
                <span className="text-xs text-[#888]">{m.target_date || 'No date'}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-lg border border-[#222] bg-[#111] p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#888] mb-3">Your Actions</h3>
        {clientActions.length === 0 ? (
          <p className="text-sm text-[#666]">No pending actions for you</p>
        ) : (
          <div className="space-y-2">
            {clientActions.map(a => (
              <div key={a.id} className="text-sm">
                <div className="text-[#ccc]">{a.title}</div>
                <div className="text-xs text-[#888] mt-0.5">
                  Due: {a.due_date || 'No date'} | {a.assignee_label || 'You'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ClientUpdates({ data }: { data: ClientEngagementData }) {
  return (
    <div className="space-y-3">
      {data.updates.length === 0 ? (
        <p className="text-sm text-[#666] text-center py-8">No published updates yet.</p>
      ) : (
        data.updates.map(u => (
          <div key={u.id} className="rounded-lg border border-[#222] bg-[#111] p-4">
            <div className="mb-3">
              <h4 className="text-sm font-semibold">{u.title}</h4>
              {u.published_at && (
                <span className="text-xs text-[#666]">{u.published_at.split('T')[0]}</span>
              )}
            </div>
            <div className="space-y-3 text-sm">
              {u.what_changed && <Field label="What Changed" value={u.what_changed} />}
              {u.in_progress && <Field label="In Progress" value={u.in_progress} />}
              {u.what_next && <Field label="What's Next" value={u.what_next} />}
              {u.needs_attention && <Field label="Needs Attention" value={u.needs_attention} />}
              {u.risks_blockers && <Field label="Risks & Blockers" value={u.risks_blockers} />}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

function ClientDeliverables({ data, user }: { data: ClientEngagementData; user: AuthenticatedUser }) {
  const [acknowledging, setAcknowledging] = useState<string | null>(null)
  const [ackComment, setAckComment] = useState('')

  async function handleAck(artifactId: string, response: 'acknowledged' | 'changes_requested') {
    setAcknowledging(artifactId)
    try {
      await fetch('/api/engagements/acknowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artifact_id: artifactId,
          engagement_id: data.charter.id,
          organization_id: data.charter.organization_id,
          response,
          comment: ackComment || null,
        }),
      })
      setAcknowledging(null)
      setAckComment('')
      window.location.reload()
    } catch {
      setAcknowledging(null)
    }
  }

  return (
    <div className="space-y-3">
      {data.artifacts.length === 0 ? (
        <p className="text-sm text-[#666] text-center py-8">No published deliverables yet.</p>
      ) : (
        data.artifacts.map(a => {
          const myAck = data.acknowledgments.find(ack => ack.artifact_id === a.id && ack.user_id === user.id)
          return (
            <div key={a.id} className="rounded-lg border border-[#222] bg-[#111] p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold">{a.title}</h4>
                  {a.description && <p className="text-xs text-[#aaa] mt-1">{a.description}</p>}
                </div>
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-green-900/20 text-green-400 border border-green-800/30">
                  Published
                </span>
              </div>
              <div className="text-xs text-[#888] mb-2">
                Type: <span className="text-[#aaa]">{a.artifact_type}</span>
                {a.published_at && <span className="ml-3">Published: <span className="text-[#aaa]">{a.published_at.split('T')[0]}</span></span>}
              </div>

              {a.external_url && (
                <a href={a.external_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#d4a017] hover:underline inline-block mb-3">
                  View document →
                </a>
              )}

              {a.requires_acknowledgment && !myAck && (
                <div className="mt-3 pt-3 border-t border-[#222]">
                  <p className="text-xs text-[#888] mb-2">Acknowledgment requested</p>
                  <input
                    type="text"
                    value={ackComment}
                    onChange={e => setAckComment(e.target.value)}
                    placeholder="Optional comment"
                    className="w-full px-2 py-1.5 bg-[#161616] border border-[#333] rounded text-xs mb-2 outline-none focus:border-[#d4a017]"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAck(a.id, 'acknowledged')}
                      disabled={acknowledging === a.id}
                      className="px-3 py-1.5 text-xs bg-green-900/30 text-green-400 border border-green-800/50 rounded hover:bg-green-900/40"
                    >
                      Acknowledge
                    </button>
                    <button
                      onClick={() => handleAck(a.id, 'changes_requested')}
                      disabled={acknowledging === a.id}
                      className="px-3 py-1.5 text-xs bg-amber-900/30 text-amber-400 border border-amber-800/50 rounded hover:bg-amber-900/40"
                    >
                      Request Changes
                    </button>
                  </div>
                </div>
              )}

              {myAck && (
                <div className="mt-3 pt-3 border-t border-[#222]">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    myAck.response === 'acknowledged' ? 'bg-green-900/20 text-green-400' : 'bg-amber-900/20 text-amber-400'
                  }`}>
                    You {myAck.response.replace('_', ' ')}
                  </span>
                  {myAck.comment && <span className="text-xs text-[#aaa] ml-2 italic">{myAck.comment}</span>}
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}

function ClientOutcomes({ data }: { data: ClientEngagementData }) {
  const STATUS_COLORS: Record<string, string> = {
    not_started: 'text-[#888]',
    in_progress: 'text-blue-400',
    achieved: 'text-green-400',
    at_risk: 'text-amber-400',
    not_achieved: 'text-red-400',
  }

  return (
    <div className="space-y-3">
      {data.outcomes.length === 0 ? (
        <p className="text-sm text-[#666] text-center py-8">No outcomes defined.</p>
      ) : (
        data.outcomes.map(o => (
          <div key={o.id} className="rounded-lg border border-[#222] bg-[#111] p-4">
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm font-semibold">{o.title}</h4>
              <span className={`text-xs font-medium ${STATUS_COLORS[o.status] || 'text-[#888]'}`}>
                {o.status.replace('_', ' ')}
              </span>
            </div>
            {o.description && <p className="text-xs text-[#aaa] mb-3">{o.description}</p>}
            <div className="grid gap-3 sm:grid-cols-3 text-xs">
              <div><dt className="text-[#888]">Baseline</dt><dd className="text-[#ccc]">{o.baseline_value || '—'}</dd></div>
              <div><dt className="text-[#888]">Target</dt><dd className="text-[#ccc]">{o.target_value || '—'}</dd></div>
              <div><dt className="text-[#888]">Current</dt><dd className="text-[#ccc]">{o.current_value || '—'}</dd></div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

function ClientParticipants({ data }: { data: ClientEngagementData }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {data.participants.map(p => (
        <div key={p.id} className="rounded-lg border border-[#222] bg-[#111] p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">{p.display_name || 'Unknown'}</div>
              {p.email && <div className="text-xs text-[#888]">{p.email}</div>}
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-[#222] text-[#aaa]">
              {RESPONSIBILITY_LABELS[p.responsibility] || p.responsibility}
            </span>
          </div>
        </div>
      ))}
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

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-[#888] mb-0.5">{label}</dt>
      <dd className="text-[#ccc]">{value}</dd>
    </div>
  )
}
