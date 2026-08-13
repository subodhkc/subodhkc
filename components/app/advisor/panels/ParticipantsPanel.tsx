'use client'

import type { EngagementFullData } from '@/lib/engagement/types'
import { RESPONSIBILITY_LABELS } from '@/lib/engagement/types'

interface Props {
  data: EngagementFullData
  isAdvisor: boolean
}

export function ParticipantsPanel({ data }: Props) {
  return (
    <div className="space-y-3">
      {data.participants.length === 0 ? (
        <p className="text-sm text-[#666] text-center py-8">No participants defined yet.</p>
      ) : (
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
      )}
    </div>
  )
}
