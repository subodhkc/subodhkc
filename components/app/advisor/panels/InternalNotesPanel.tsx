'use client'

import type { EngagementFullData } from '@/lib/engagement/types'
import type { AuthenticatedUser } from '@/lib/auth/organization-resolver'

interface Props {
  data: EngagementFullData
  isAdvisor: boolean
  user: AuthenticatedUser
}

const CATEGORY_LABELS: Record<string, string> = {
  general: 'General',
  advisor_observation: 'Advisor Observation',
  stakeholder: 'Stakeholder',
  delivery_concern: 'Delivery Concern',
  meeting_prep: 'Meeting Prep',
  internal_next_step: 'Internal Next Step',
}

export function InternalNotesPanel({ data, isAdvisor }: Props) {
  if (!isAdvisor) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-red-400">Internal notes are restricted to advisors only.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-amber-800/30 bg-amber-900/10 p-3">
        <p className="text-xs text-amber-400">
          Internal notes are visible to advisors only. They are never shown to client members.
        </p>
      </div>
      {data.internalNotes.length === 0 ? (
        <p className="text-sm text-[#666] text-center py-8">No internal notes yet.</p>
      ) : (
        data.internalNotes.map(n => (
          <div key={n.id} className="rounded-lg border border-[#222] bg-[#111] p-4">
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs px-2 py-0.5 rounded bg-[#222] text-[#aaa]">
                {CATEGORY_LABELS[n.note_category] || n.note_category}
              </span>
              <span className="text-xs text-[#666]">{n.created_at.split('T')[0]}</span>
            </div>
            <p className="text-sm text-[#ccc] whitespace-pre-wrap">{n.content}</p>
          </div>
        ))
      )}
    </div>
  )
}
