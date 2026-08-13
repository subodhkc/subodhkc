'use client'

import type { EngagementFullData } from '@/lib/engagement/types'
import { ARTIFACT_STATUS_LABELS } from '@/lib/engagement/types'
import type { AuthenticatedUser } from '@/lib/auth/organization-resolver'

interface Props {
  data: EngagementFullData
  isAdvisor: boolean
  user: AuthenticatedUser
}

export function ArtifactsPanel({ data }: Props) {
  return (
    <div className="space-y-3">
      {data.artifacts.length === 0 ? (
        <p className="text-sm text-[#666] text-center py-8">No deliverables yet.</p>
      ) : (
        data.artifacts.map(a => {
          const acks = data.acknowledgments.filter(ack => ack.artifact_id === a.id)
          const hasAck = a.requires_acknowledgment
          return (
            <div key={a.id} className="rounded-lg border border-[#222] bg-[#111] p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold">{a.title}</h4>
                  {a.description && <p className="text-xs text-[#aaa] mt-1">{a.description}</p>}
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                  a.status === 'published' ? 'bg-green-900/20 text-green-400 border border-green-800/30' :
                  a.status === 'ready_for_review' ? 'bg-blue-900/20 text-blue-400 border border-blue-800/30' :
                  a.status === 'superseded' ? 'bg-[#222] text-[#666]' :
                  'bg-[#222] text-[#888]'
                }`}>
                  {ARTIFACT_STATUS_LABELS[a.status] || a.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-[#888]">
                <span>Type: <span className="text-[#aaa]">{a.artifact_type}</span></span>
                {a.published_at && <span>Published: <span className="text-[#aaa]">{a.published_at.split('T')[0]}</span></span>}
                {hasAck && (
                  <span>
                    Acknowledgment: <span className="text-[#aaa]">{acks.length} response{acks.length !== 1 ? 's' : ''}</span>
                  </span>
                )}
              </div>
              {hasAck && acks.length > 0 && (
                <div className="mt-2 space-y-1">
                  {acks.map(ack => (
                    <div key={ack.id} className="text-xs text-[#aaa] flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded ${
                        ack.response === 'acknowledged' ? 'bg-green-900/20 text-green-400' : 'bg-amber-900/20 text-amber-400'
                      }`}>
                        {ack.response.replace('_', ' ')}
                      </span>
                      {ack.comment && <span className="italic">{ack.comment}</span>}
                    </div>
                  ))}
                </div>
              )}
              {a.external_url && (
                <a href={a.external_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#d4a017] hover:underline mt-2 inline-block">
                  View document →
                </a>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}
