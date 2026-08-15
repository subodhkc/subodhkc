'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { OrganizationSelectionStep } from '@/components/commercial/OrganizationSelectionStep'
import { QUALIFICATION_FIELDS, REQUIRED_FIELDS, MIN_REQUIRED_FILLED } from '@/lib/commercial/blueprint-schema'

interface BlueprintQualificationCTAProps {
  title: string
  description: string
}

type Step = 'org' | 'qualification' | 'agreement' | 'checkout'

export function BlueprintQualificationCTA({ title, description }: BlueprintQualificationCTAProps) {
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedOrg, setSelectedOrg] = useState<{ id: string; name: string; slug: string } | null>(null)
  const [step, setStep] = useState<Step>('org')
  const [agreementText, setAgreementText] = useState<string | null>(null)
  const [agreementAccepted, setAgreementAccepted] = useState(false)
  const [showAllQuestions, setShowAllQuestions] = useState(false)

  const primaryFields = QUALIFICATION_FIELDS.slice(0, 4)
  const secondaryFields = QUALIFICATION_FIELDS.slice(4)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedOrg) {
      setError('Please select an organization first.')
      return
    }
    const requiredFilled = REQUIRED_FIELDS.filter(
      key => (responses[key] || '').trim().length >= 3
    )
    if (requiredFilled.length < MIN_REQUIRED_FILLED) {
      setError('Please answer both required questions with at least a few words.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/commercial/blueprint/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qualificationResponses: responses,
          organizationId: selectedOrg.id,
          agreementAccepted: step === 'agreement' ? agreementAccepted : false,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else if (data.error === 'agreement_required') {
        setAgreementText(data.agreementBody || null)
        setStep('agreement')
        setAgreementAccepted(false)
      } else if (data.error === 'not_a_fit') {
        setError(data.message || 'Based on your responses, the Blueprint may not be the right fit.')
      } else {
        setError(data.message || data.error || 'Failed to start checkout')
      }
    } catch {
      setError('Network error. Please try again.')
    }
    setLoading(false)
  }

  function handleAgreementAccept() {
    if (!agreementAccepted) return
    setStep('checkout')
    // Re-submit with agreementAccepted = true
    handleSubmit(new Event('submit') as unknown as React.FormEvent)
  }

  return (
    <section id="start" className="page-padding scroll-mt-20">
      <div className="section-container">
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-accent/5 to-background p-8 md:p-12 lg:p-16">
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              {title}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{description}</p>

            {!showForm ? (
              <Button size="lg" className="group" onClick={() => { setShowForm(true); setStep('org') }}>
                Start My Blueprint — $500
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            ) : step === 'org' && !selectedOrg ? (
              <div className="space-y-4">
                <p className="text-sm font-medium">Select which workspace this is for:</p>
                <OrganizationSelectionStep onOrganizationSelected={(org) => { setSelectedOrg(org); setStep('qualification') }} />
                <Button type="button" size="lg" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            ) : step === 'agreement' ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
                  For <strong>{selectedOrg?.name}</strong>{' '}
                  <button
                    type="button"
                    onClick={() => { setSelectedOrg(null); setStep('org') }}
                    className="text-xs text-muted-foreground hover:text-foreground underline ml-2"
                  >
                    Change
                  </button>
                </div>
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
                  <p className="text-sm font-semibold">Agreement Required</p>
                  {agreementText && (
                    <div className="max-h-64 overflow-y-auto rounded border border-border bg-background p-3 text-xs text-muted-foreground whitespace-pre-wrap">
                      {agreementText}
                    </div>
                  )}
                  <label className="flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={agreementAccepted}
                      onChange={e => setAgreementAccepted(e.target.checked)}
                      className="rounded border-primary mt-0.5"
                    />
                    <span>I have read and accept the agreement</span>
                  </label>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAgreementAccept}
                      disabled={!agreementAccepted || loading}
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Accept &amp; Continue to Checkout
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => { setStep('qualification'); setAgreementAccepted(false) }}
                    >
                      Back
                    </Button>
                  </div>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
              </div>
            ) : (
              <form id="blueprint-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
                  For <strong>{selectedOrg?.name}</strong>{' '}
                  <button
                    type="button"
                    onClick={() => { setSelectedOrg(null); setStep('org') }}
                    className="text-xs text-muted-foreground hover:text-foreground underline ml-2"
                  >
                    Change
                  </button>
                </div>
                {primaryFields.map(q => (
                  <div key={q.key}>
                    <label className="text-sm font-medium block mb-1.5">
                      {q.label}
                      {q.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <input
                      type="text"
                      value={responses[q.key] || ''}
                      onChange={e => setResponses(prev => ({ ...prev, [q.key]: e.target.value }))}
                      placeholder={q.placeholder}
                      className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                ))}

                {showAllQuestions && secondaryFields.map(q => (
                  <div key={q.key}>
                    <label className="text-sm font-medium block mb-1.5">
                      {q.label}
                      {q.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <input
                      type="text"
                      value={responses[q.key] || ''}
                      onChange={e => setResponses(prev => ({ ...prev, [q.key]: e.target.value }))}
                      placeholder={q.placeholder}
                      className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => setShowAllQuestions(!showAllQuestions)}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  {showAllQuestions ? (
                    <><ChevronUp className="h-3 w-3" /> Show fewer questions</>
                  ) : (
                    <><ChevronDown className="h-3 w-3" /> Answer more questions for a richer Blueprint</>
                  )}
                </button>

                {error && <p className="text-sm text-red-600">{error}</p>}
                <div className="flex gap-3">
                  <Button type="submit" size="lg" disabled={loading} className="group">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Continue to Checkout — $500
                    {!loading && <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
                  </Button>
                  <Button type="button" size="lg" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Qualification helps ensure your opportunity fits the fixed-scope Blueprint before payment.
                </p>
              </form>
            )}
          </div>
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        </div>
      </div>
    </section>
  )
}
