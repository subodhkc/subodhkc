'use client'

import Link from 'next/link'
import type { AuthenticatedUser } from '@/lib/auth/organization-resolver'
import type { AdvisorPortfolioItem } from '@/lib/engagement/types'
import { HEALTH_LABELS } from '@/lib/engagement/types'

interface Props {
  user: AuthenticatedUser
  portfolio: AdvisorPortfolioItem[]
}

export function AdvisorConsoleClient({ user, portfolio }: Props) {
  const needsAttention = portfolio.filter(p =>
    p.engagement.health_status === 'needs_attention' || p.engagement.health_status === 'blocked'
  )
  const overdueDecisions = portfolio.flatMap(p =>
    Array.from({ length: p.overdue_decisions }, () => p)
  )
  const readyToPublish = portfolio.filter(p => p.ready_to_publish_artifacts > 0)
  const draftUpdates = portfolio.filter(p => p.draft_updates > 0)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0]">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Advisor Console</h1>
            <p className="text-sm text-[#888] mt-1">
              {user.displayName || user.email}
            </p>
          </div>
          <Link
            href="/app/advisor/new-engagement"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4a017] text-[#0a0a0a] rounded-lg font-medium text-sm hover:bg-[#f0c040] transition-colors"
          >
            <span>+</span> New Engagement
          </Link>
        </div>

        {/* Needs Attention */}
        {needsAttention.length > 0 && (
          <Section title="Needs Attention" accent="amber">
            {needsAttention.map(item => (
              <EngagementCard key={item.engagement.id} item={item} showReason />
            ))}
          </Section>
        )}

        {/* Overdue Decisions */}
        {overdueDecisions.length > 0 && (
          <Section title="Client Decisions Overdue" accent="red">
            <div className="space-y-2">
              {portfolio.filter(p => p.overdue_decisions > 0).map(p => (
                <Link
                  key={p.engagement.id}
                  href={`/app/advisor/engagements/${p.engagement.id}`}
                  className="block p-3 rounded-lg border border-[#333] hover:border-[#555] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">{p.engagement.title || 'Untitled Engagement'}</span>
                      <span className="text-xs text-[#888] ml-2">{p.organization_name}</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-red-900/30 text-red-400 border border-red-800/50">
                      {p.overdue_decisions} overdue
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Section>
        )}

        {/* Ready to Publish */}
        {readyToPublish.length > 0 && (
          <Section title="Ready to Publish" accent="blue">
            <div className="space-y-2">
              {readyToPublish.map(p => (
                <Link
                  key={p.engagement.id}
                  href={`/app/advisor/engagements/${p.engagement.id}?tab=artifacts`}
                  className="block p-3 rounded-lg border border-[#333] hover:border-[#555] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">{p.engagement.title || 'Untitled Engagement'}</span>
                      <span className="text-xs text-[#888] ml-2">{p.organization_name}</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-900/30 text-blue-400 border border-blue-800/50">
                      {p.ready_to_publish_artifacts} ready
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Section>
        )}

        {/* Draft Updates */}
        {draftUpdates.length > 0 && (
          <Section title="Draft Updates" accent="purple">
            <div className="space-y-2">
              {draftUpdates.map(p => (
                <Link
                  key={p.engagement.id}
                  href={`/app/advisor/engagements/${p.engagement.id}?tab=updates`}
                  className="block p-3 rounded-lg border border-[#333] hover:border-[#555] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">{p.engagement.title || 'Untitled Engagement'}</span>
                      <span className="text-xs text-[#888] ml-2">{p.organization_name}</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-purple-900/30 text-purple-400 border border-purple-800/50">
                      {p.draft_updates} draft
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Section>
        )}

        {/* Active Engagements */}
        <Section title="Active Engagements" accent="default">
          {portfolio.length === 0 ? (
            <div className="text-center py-12 text-[#888]">
              <p className="text-sm">No active engagements yet.</p>
              <Link href="/app/advisor/new-engagement" className="text-sm text-[#d4a017] hover:underline mt-2 inline-block">
                Create your first engagement
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {portfolio.map(item => (
                <EngagementCard key={item.engagement.id} item={item} />
              ))}
            </div>
          )}
        </Section>
      </div>
    </div>
  )
}

function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  const accentColors: Record<string, string> = {
    amber: 'border-amber-800/30',
    red: 'border-red-800/30',
    blue: 'border-blue-800/30',
    purple: 'border-purple-800/30',
    default: 'border-[#222]',
  }
  return (
    <div className={`mb-8 rounded-xl border ${accentColors[accent] || accentColors.default} bg-[#111] p-4`}>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-[#aaa] mb-3">{title}</h2>
      {children}
    </div>
  )
}

function EngagementCard({ item, showReason }: { item: AdvisorPortfolioItem; showReason?: boolean }) {
  const healthColor: Record<string, string> = {
    on_track: 'text-green-400',
    needs_attention: 'text-amber-400',
    blocked: 'text-red-400',
  }

  return (
    <Link
      href={`/app/advisor/engagements/${item.engagement.id}`}
      className="block p-4 rounded-lg border border-[#333] bg-[#161616] hover:border-[#555] transition-colors"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-sm font-semibold">{item.engagement.title || 'Untitled Engagement'}</h3>
          <p className="text-xs text-[#888]">{item.organization_name}</p>
        </div>
        <span className={`text-xs font-medium ${healthColor[item.engagement.health_status] || 'text-[#888]'}`}>
          {HEALTH_LABELS[item.engagement.health_status] || item.engagement.health_status}
        </span>
      </div>

      {showReason && item.engagement.health_reason && (
        <p className="text-xs text-[#aaa] mb-2 italic">{item.engagement.health_reason}</p>
      )}

      <div className="flex flex-wrap gap-2 mt-3">
        {item.open_decisions > 0 && (
          <Badge label={`${item.open_decisions} decision${item.open_decisions > 1 ? 's' : ''}`} color="amber" />
        )}
        {item.upcoming_milestones > 0 && (
          <Badge label={`${item.upcoming_milestones} milestone${item.upcoming_milestones > 1 ? 's' : ''}`} color="blue" />
        )}
        {item.overdue_client_actions > 0 && (
          <Badge label={`${item.overdue_client_actions} overdue action${item.overdue_client_actions > 1 ? 's' : ''}`} color="red" />
        )}
        {item.ready_to_publish_artifacts > 0 && (
          <Badge label={`${item.ready_to_publish_artifacts} ready to publish`} color="blue" />
        )}
      </div>

      <div className="mt-3 text-xs text-[#666]">
        Current phase: <span className="text-[#aaa]">{item.engagement.current_phase}</span>
      </div>
    </Link>
  )
}

function Badge({ label, color }: { label: string; color: string }) {
  const colors: Record<string, string> = {
    amber: 'bg-amber-900/20 text-amber-400 border-amber-800/30',
    red: 'bg-red-900/20 text-red-400 border-red-800/30',
    blue: 'bg-blue-900/20 text-blue-400 border-blue-800/30',
    green: 'bg-green-900/20 text-green-400 border-green-800/30',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded border ${colors[color] || colors.amber}`}>
      {label}
    </span>
  )
}
