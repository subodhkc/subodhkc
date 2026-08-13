'use client'

import type { EngagementFullData } from '@/lib/engagement/types'

interface Props {
  data: EngagementFullData
  isAdvisor: boolean
}

const STATUS_COLORS: Record<string, string> = {
  not_started: 'text-[#888]',
  in_progress: 'text-blue-400',
  achieved: 'text-green-400',
  at_risk: 'text-amber-400',
  not_achieved: 'text-red-400',
}

export function OutcomesPanel({ data }: Props) {
  return (
    <div className="space-y-3">
      {data.outcomes.length === 0 ? (
        <p className="text-sm text-[#666] text-center py-8">No outcomes defined yet.</p>
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
              <div>
                <dt className="text-[#888]">Baseline</dt>
                <dd className="text-[#ccc]">{o.baseline_value || '—'}</dd>
              </div>
              <div>
                <dt className="text-[#888]">Target</dt>
                <dd className="text-[#ccc]">{o.target_value || '—'}</dd>
              </div>
              <div>
                <dt className="text-[#888]">Current</dt>
                <dd className="text-[#ccc]">{o.current_value || '—'}</dd>
              </div>
            </div>
            {o.measurement_source && (
              <div className="mt-2 text-xs text-[#888]">
                Source: <span className="text-[#aaa]">{o.measurement_source}</span>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}
