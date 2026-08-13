'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { AuthenticatedUser } from '@/lib/auth/organization-resolver'
import { ENGAGEMENT_TEMPLATES, ACCELERATOR_CATALOG } from '@/lib/engagement/types'

interface OrgInfo {
  id: string
  name: string
  slug: string
  role: string
}

interface Props {
  user: AuthenticatedUser
  organizations: OrgInfo[]
}

export function NewEngagementWizardClient({ user, organizations }: Props) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [orgId, setOrgId] = useState(organizations[0]?.id || '')
  const [templateKey, setTemplateKey] = useState<string | 'blank'>('blank')
  const [formData, setFormData] = useState({
    title: '',
    statement: '',
    in_scope: '',
    out_of_scope: '',
    executive_sponsor: '',
    client_lead: '',
    advisor_lead: user.displayName || user.email || '',
    engagement_type: 'program',
    review_cadence: 'weekly',
    current_phase: 'discovery',
    starts_at: new Date().toISOString().split('T')[0],
    ends_at: '',
  })

  const selectedTemplate = ENGAGEMENT_TEMPLATES.find(t => t.key === templateKey)

  function applyTemplate(key: string) {
    setTemplateKey(key)
    if (key !== 'blank') {
      const t = ENGAGEMENT_TEMPLATES.find(t => t.key === key)
      if (t) {
        setFormData(prev => ({
          ...prev,
          title: prev.title || t.name,
          statement: prev.statement || t.description,
        }))
      }
    }
  }

  async function handleSubmit() {
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/engagements/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          organization_id: orgId,
          template_key: templateKey !== 'blank' ? templateKey : null,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to create engagement')
      }

      const { id } = await res.json()
      router.push(`/app/advisor/engagements/${id}`)
    } catch (e: any) {
      setError(e.message)
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0]">
      <div className="max-w-3xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/app/advisor" className="text-xs text-[#888] hover:text-[#aaa]">← Back to Advisor Console</Link>
          <h1 className="text-2xl font-bold mt-2">New Engagement</h1>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className={`flex items-center ${s < 3 ? 'flex-1' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                step >= s ? 'bg-[#d4a017] text-[#0a0a0a]' : 'bg-[#222] text-[#666]'
              }`}>
                {s}
              </div>
              {s < 3 && <div className={`flex-1 h-0.5 mx-2 ${step > s ? 'bg-[#d4a017]' : 'bg-[#222]'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Organization + Template */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium block mb-2">Organization</label>
              <select
                value={orgId}
                onChange={e => setOrgId(e.target.value)}
                className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded-lg text-sm focus:border-[#d4a017] outline-none"
              >
                {organizations.map(o => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium block mb-3">Template</label>
              <div className="grid gap-3 sm:grid-cols-2">
                <TemplateCard
                  name="Blank"
                  description="Start from scratch with no pre-filled content"
                  selected={templateKey === 'blank'}
                  onClick={() => applyTemplate('blank')}
                />
                {ENGAGEMENT_TEMPLATES.map(t => (
                  <TemplateCard
                    key={t.key}
                    name={t.name}
                    description={t.description}
                    selected={templateKey === t.key}
                    onClick={() => applyTemplate(t.key)}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!orgId}
                className="px-4 py-2 bg-[#d4a017] text-[#0a0a0a] rounded-lg font-medium text-sm hover:bg-[#f0c040] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Charter */}
        {step === 2 && (
          <div className="space-y-4">
            <FormField label="Engagement Title" required>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., ACME AI Transformation"
                className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded-lg text-sm focus:border-[#d4a017] outline-none"
              />
            </FormField>

            <FormField label="Statement / Purpose">
              <textarea
                value={formData.statement}
                onChange={e => setFormData({ ...formData, statement: e.target.value })}
                placeholder="What is this engagement trying to achieve?"
                rows={3}
                className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded-lg text-sm focus:border-[#d4a017] outline-none"
              />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Executive Sponsor">
                <input
                  type="text"
                  value={formData.executive_sponsor}
                  onChange={e => setFormData({ ...formData, executive_sponsor: e.target.value })}
                  placeholder="Client executive sponsor name"
                  className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded-lg text-sm focus:border-[#d4a017] outline-none"
                />
              </FormField>

              <FormField label="Client Lead">
                <input
                  type="text"
                  value={formData.client_lead}
                  onChange={e => setFormData({ ...formData, client_lead: e.target.value })}
                  placeholder="Client lead name"
                  className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded-lg text-sm focus:border-[#d4a017] outline-none"
                />
              </FormField>

              <FormField label="Advisor Lead">
                <input
                  type="text"
                  value={formData.advisor_lead}
                  onChange={e => setFormData({ ...formData, advisor_lead: e.target.value })}
                  className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded-lg text-sm focus:border-[#d4a017] outline-none"
                />
              </FormField>

              <FormField label="Engagement Type">
                <select
                  value={formData.engagement_type}
                  onChange={e => setFormData({ ...formData, engagement_type: e.target.value })}
                  className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded-lg text-sm focus:border-[#d4a017] outline-none"
                >
                  <option value="project">Project</option>
                  <option value="retainer">Retainer</option>
                  <option value="fractional">Fractional</option>
                  <option value="pilot">Pilot</option>
                  <option value="program">Program</option>
                  <option value="pro_bono">Pro Bono</option>
                </select>
              </FormField>

              <FormField label="Review Cadence">
                <select
                  value={formData.review_cadence}
                  onChange={e => setFormData({ ...formData, review_cadence: e.target.value })}
                  className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded-lg text-sm focus:border-[#d4a017] outline-none"
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Biweekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="milestone_based">Milestone Based</option>
                  <option value="on_demand">On Demand</option>
                </select>
              </FormField>

              <FormField label="Current Phase">
                <input
                  type="text"
                  value={formData.current_phase}
                  onChange={e => setFormData({ ...formData, current_phase: e.target.value })}
                  placeholder="discovery, design, pilot, etc."
                  className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded-lg text-sm focus:border-[#d4a017] outline-none"
                />
              </FormField>

              <FormField label="Start Date">
                <input
                  type="date"
                  value={formData.starts_at}
                  onChange={e => setFormData({ ...formData, starts_at: e.target.value })}
                  className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded-lg text-sm focus:border-[#d4a017] outline-none"
                />
              </FormField>

              <FormField label="Target End Date">
                <input
                  type="date"
                  value={formData.ends_at}
                  onChange={e => setFormData({ ...formData, ends_at: e.target.value })}
                  className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded-lg text-sm focus:border-[#d4a017] outline-none"
                />
              </FormField>
            </div>

            <FormField label="In Scope">
              <textarea
                value={formData.in_scope}
                onChange={e => setFormData({ ...formData, in_scope: e.target.value })}
                placeholder="What is included in this engagement?"
                rows={2}
                className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded-lg text-sm focus:border-[#d4a017] outline-none"
              />
            </FormField>

            <FormField label="Out of Scope">
              <textarea
                value={formData.out_of_scope}
                onChange={e => setFormData({ ...formData, out_of_scope: e.target.value })}
                placeholder="What is explicitly excluded?"
                rows={2}
                className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded-lg text-sm focus:border-[#d4a017] outline-none"
              />
            </FormField>

            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="px-4 py-2 text-sm text-[#888] hover:text-[#ccc]">
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!formData.title}
                className="px-4 py-2 bg-[#d4a017] text-[#0a0a0a] rounded-lg font-medium text-sm hover:bg-[#f0c040] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review + Create */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="rounded-lg border border-[#222] bg-[#111] p-4">
              <h3 className="text-sm font-semibold mb-3">Review</h3>
              <dl className="space-y-2 text-sm">
                <ReviewRow label="Organization" value={organizations.find(o => o.id === orgId)?.name} />
                <ReviewRow label="Template" value={templateKey === 'blank' ? 'Blank' : selectedTemplate?.name} />
                <ReviewRow label="Title" value={formData.title} />
                <ReviewRow label="Type" value={formData.engagement_type} />
                <ReviewRow label="Advisor Lead" value={formData.advisor_lead} />
                <ReviewRow label="Review Cadence" value={formData.review_cadence} />
                <ReviewRow label="Start Date" value={formData.starts_at} />
                <ReviewRow label="Target End" value={formData.ends_at || 'Not set'} />
              </dl>
              {selectedTemplate && (
                <div className="mt-4 pt-4 border-t border-[#222]">
                  <p className="text-xs text-[#888] mb-2">Template will create:</p>
                  <ul className="text-xs text-[#aaa] space-y-1">
                    <li>{selectedTemplate.outcomes.length} outcome(s)</li>
                    <li>{selectedTemplate.workstreams.length} workstream(s)</li>
                    <li>{selectedTemplate.accelerators.length} accelerator link(s)</li>
                  </ul>
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-lg border border-red-800/30 bg-red-900/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="px-4 py-2 text-sm text-[#888] hover:text-[#ccc]">
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !formData.title}
                className="px-6 py-2 bg-[#d4a017] text-[#0a0a0a] rounded-lg font-medium text-sm hover:bg-[#f0c040] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Creating...' : 'Create Engagement'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium block mb-1">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}

function TemplateCard({ name, description, selected, onClick }: { name: string; description: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-3 rounded-lg border transition-colors ${
        selected ? 'border-[#d4a017] bg-[#d4a017]/10' : 'border-[#333] bg-[#111] hover:border-[#555]'
      }`}
    >
      <div className="text-sm font-semibold">{name}</div>
      <div className="text-xs text-[#888] mt-1">{description}</div>
    </button>
  )
}

function ReviewRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-xs text-[#888]">{label}</dt>
      <dd className="text-[#ccc] text-right">{value || '—'}</dd>
    </div>
  )
}
