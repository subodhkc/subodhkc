'use client'

import type { EngagementFullData } from '@/lib/engagement/types'

interface Props {
  data: EngagementFullData
  isAdvisor: boolean
}

export function SolutionsPanel({ data }: Props) {
  return (
    <div className="space-y-3">
      {data.solutionLinks.length === 0 ? (
        <p className="text-sm text-[#666] text-center py-8">No solution links yet.</p>
      ) : (
        data.solutionLinks.map(s => (
          <div key={s.id} className="rounded-lg border border-[#222] bg-[#111] p-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-semibold">{s.solution_label}</h4>
                {s.deployment_label && (
                  <p className="text-xs text-[#888] mt-0.5">Deployment: {s.deployment_label}</p>
                )}
              </div>
              {s.external_link && (
                <span className="text-xs px-2 py-0.5 rounded bg-green-900/20 text-green-400 border border-green-800/30">
                  {s.external_link.status}
                </span>
              )}
            </div>
            {s.external_link && (
              <div className="mt-2 text-xs text-[#888]">
                System: <span className="text-[#aaa]">{s.external_link.system_key}</span>
                <span className="mx-2">|</span>
                ID: <span className="text-[#aaa]">{s.external_link.external_id}</span>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}
