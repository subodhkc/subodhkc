'use client'

import type { EngagementFullData } from '@/lib/engagement/types'
import { DECISION_STATUS_LABELS } from '@/lib/engagement/types'

interface Props {
  data: EngagementFullData
  isAdvisor: boolean
}

export function DecisionsPanel({ data }: Props) {
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-3">
      {data.decisions.length === 0 ? (
        <p className="text-sm text-[#666] text-center py-8">No decisions tracked yet.</p>
      ) : (
        data.decisions.map(d => {
          const isOverdue = d.status === 'open' && d.needed_by && d.needed_by < today
          const ws = data.workstreams.find(w => w.id === d.workstream_id)
          return (
            <div key={d.id} className="rounded-lg border border-[#222] bg-[#111] p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold">{d.title}</h4>
                  {d.description && <p className="text-xs text-[#aaa] mt-1">{d.description}</p>}
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                  d.status === 'open' ? 'bg-amber-900/20 text-amber-400 border border-amber-800/30' :
                  d.status === 'decided' ? 'bg-green-900/20 text-green-400 border border-green-800/30' :
                  'bg-[#222] text-[#888]'
                }`}>
                  {DECISION_STATUS_LABELS[d.status] || d.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-[#888]">
                {ws && <span>Workstream: <span className="text-[#aaa]">{ws.name}</span></span>}
                {d.decision_owner && <span>Owner: <span className="text-[#aaa]">{d.decision_owner}</span></span>}
                {d.needed_by && (
                  <span className={isOverdue ? 'text-red-400' : ''}>
                    Needed by: <span className={isOverdue ? 'text-red-400' : 'text-[#aaa]'}>{d.needed_by}</span>
                    {isOverdue && ' (overdue)'}
                  </span>
                )}
              </div>
              {d.decision_rationale && (
                <div className="mt-2 text-xs text-[#aaa] italic">{d.decision_rationale}</div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}
