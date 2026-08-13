'use client'

import type { EngagementFullData } from '@/lib/engagement/types'

interface Props {
  data: EngagementFullData
  isAdvisor: boolean
}

export function CharterPanel({ data, isAdvisor }: Props) {
  const eng = data.charter

  return (
    <div className="rounded-lg border border-[#222] bg-[#111] p-6">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-[#888] mb-4">Engagement Charter</h3>
      <div className="space-y-4">
        <Field label="Title" value={eng.title} />
        <Field label="Statement / Purpose" value={eng.statement} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Executive Sponsor" value={eng.executive_sponsor} />
          <Field label="Client Lead" value={eng.client_lead} />
          <Field label="Advisor Lead" value={eng.advisor_lead} />
          <Field label="Review Cadence" value={eng.review_cadence?.replace('_', ' ')} />
          <Field label="Current Phase" value={eng.current_phase} />
          <Field label="Status" value={eng.status} />
          <Field label="Start Date" value={eng.starts_at?.split('T')[0]} />
          <Field label="Target End Date" value={eng.ends_at?.split('T')[0]} />
        </div>
        <Field label="In Scope" value={eng.in_scope} />
        <Field label="Out of Scope" value={eng.out_of_scope} />
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-xs text-[#888] mb-1">{label}</dt>
      <dd className="text-sm text-[#ccc]">{value || 'Not defined'}</dd>
    </div>
  )
}
