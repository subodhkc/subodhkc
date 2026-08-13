'use client'

import type { EngagementFullData } from '@/lib/engagement/types'
import type { AuthenticatedUser } from '@/lib/auth/organization-resolver'

interface Props {
  data: EngagementFullData
  isAdvisor: boolean
  user: AuthenticatedUser
}

export function UpdatesPanel({ data }: Props) {
  return (
    <div className="space-y-3">
      {data.updates.length === 0 ? (
        <p className="text-sm text-[#666] text-center py-8">No updates yet.</p>
      ) : (
        data.updates.map(u => (
          <div key={u.id} className="rounded-lg border border-[#222] bg-[#111] p-4">
            <div className="flex items-start justify-between mb-3">
              <h4 className="text-sm font-semibold">{u.title}</h4>
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                u.status === 'published' ? 'bg-green-900/20 text-green-400 border border-green-800/30' :
                'bg-[#222] text-[#888]'
              }`}>
                {u.status}
              </span>
            </div>
            <div className="space-y-3 text-sm">
              {u.what_changed && <UpdateField label="What Changed" value={u.what_changed} />}
              {u.in_progress && <UpdateField label="In Progress" value={u.in_progress} />}
              {u.what_next && <UpdateField label="What's Next" value={u.what_next} />}
              {u.needs_attention && <UpdateField label="Needs Attention" value={u.needs_attention} />}
              {u.risks_blockers && <UpdateField label="Risks & Blockers" value={u.risks_blockers} />}
            </div>
            {u.published_at && (
              <div className="mt-3 text-xs text-[#666]">
                Published {u.published_at.split('T')[0]}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}

function UpdateField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-[#888] mb-0.5">{label}</dt>
      <dd className="text-[#ccc]">{value}</dd>
    </div>
  )
}
