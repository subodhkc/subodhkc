'use client'

import type { EngagementFullData } from '@/lib/engagement/types'

interface Props {
  data: EngagementFullData
  isAdvisor: boolean
}

export function AcceleratorsPanel({ data }: Props) {
  return (
    <div className="space-y-3">
      {data.accelerators.length === 0 ? (
        <p className="text-sm text-[#666] text-center py-8">No accelerators linked yet.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {data.accelerators.map(a => (
            <div key={a.id} className="rounded-lg border border-[#222] bg-[#111] p-3">
              <h4 className="text-sm font-semibold">{a.accelerator_name}</h4>
              {a.notes && <p className="text-xs text-[#888] mt-1">{a.notes}</p>}
              {a.reference_url && (
                <a href={a.reference_url} className="text-xs text-[#d4a017] hover:underline mt-2 inline-block">
                  Open accelerator →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
