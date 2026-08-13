'use client'

import type { EngagementFullData } from '@/lib/engagement/types'

interface Props {
  data: EngagementFullData
  isAdvisor: boolean
}

export function WorkstreamsPanel({ data }: Props) {
  return (
    <div className="space-y-3">
      {data.workstreams.length === 0 ? (
        <p className="text-sm text-[#666] text-center py-8">No workstreams defined yet.</p>
      ) : (
        data.workstreams.map(ws => {
          const wsMilestones = data.milestones.filter(m => m.workstream_id === ws.id)
          const wsActions = data.actions.filter(a => a.workstream_id === ws.id)
          const wsDecisions = data.decisions.filter(d => d.workstream_id === ws.id)
          return (
            <div key={ws.id} className="rounded-lg border border-[#222] bg-[#111] p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-sm font-semibold">{ws.name}</h4>
                  {ws.description && <p className="text-xs text-[#aaa] mt-1">{ws.description}</p>}
                </div>
                <div className="flex items-center gap-2">
                  {ws.is_blocked && (
                    <span className="text-xs px-2 py-0.5 rounded bg-red-900/20 text-red-400 border border-red-800/30">
                      Blocked
                    </span>
                  )}
                  <span className="text-xs text-[#888]">{ws.status}</span>
                </div>
              </div>
              {ws.owner_label && (
                <div className="text-xs text-[#888] mb-2">Owner: <span className="text-[#aaa]">{ws.owner_label}</span></div>
              )}
              {ws.blocking_reason && (
                <div className="text-xs text-red-400 mb-2">{ws.blocking_reason}</div>
              )}
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-[#888]">
                <span>{wsMilestones.length} milestones</span>
                <span>{wsActions.length} actions</span>
                <span>{wsDecisions.length} decisions</span>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
