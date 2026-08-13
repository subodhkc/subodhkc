'use client'

import type { EngagementFullData } from '@/lib/engagement/types'
import { CHANGE_REQUEST_STATUS_LABELS } from '@/lib/engagement/types'
import type { AuthenticatedUser } from '@/lib/auth/organization-resolver'

interface Props {
  data: EngagementFullData
  isAdvisor: boolean
  user: AuthenticatedUser
}

export function ScopeChangesPanel({ data }: Props) {
  return (
    <div className="space-y-3">
      {data.changeRequests.length === 0 ? (
        <p className="text-sm text-[#666] text-center py-8">No scope changes recorded.</p>
      ) : (
        data.changeRequests.map(cr => (
          <div key={cr.id} className="rounded-lg border border-[#222] bg-[#111] p-4">
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm font-semibold">{cr.title}</h4>
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                cr.status === 'accepted' ? 'bg-green-900/20 text-green-400 border border-green-800/30' :
                cr.status === 'proposed' ? 'bg-amber-900/20 text-amber-400 border border-amber-800/30' :
                cr.status === 'rejected' ? 'bg-red-900/20 text-red-400 border border-red-800/30' :
                'bg-[#222] text-[#888]'
              }`}>
                {CHANGE_REQUEST_STATUS_LABELS[cr.status] || cr.status}
              </span>
            </div>
            {cr.description && <p className="text-xs text-[#aaa] mb-2">{cr.description}</p>}
            {cr.reason && (
              <div className="text-xs mb-2">
                <span className="text-[#888]">Reason: </span>
                <span className="text-[#ccc]">{cr.reason}</span>
              </div>
            )}
            {cr.impact_summary && (
              <div className="text-xs mb-2">
                <span className="text-[#888]">Impact: </span>
                <span className="text-[#ccc]">{cr.impact_summary}</span>
              </div>
            )}
            <div className="flex flex-wrap gap-3 text-xs text-[#888]">
              <span>Requested: <span className="text-[#aaa]">{cr.requested_at?.split('T')[0]}</span></span>
              {cr.accepted_at && <span>Accepted: <span className="text-[#aaa]">{cr.accepted_at.split('T')[0]}</span></span>}
              <span>Client visible: <span className="text-[#aaa]">{cr.client_visible ? 'Yes' : 'No'}</span></span>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
