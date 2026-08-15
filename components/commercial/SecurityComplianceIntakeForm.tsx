'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Loader2 } from 'lucide-react'

const REVIEW_SCOPE = [
  'AI security assessment only',
  'AI compliance review only',
  'Combined security and compliance review',
  'Vendor risk assessment',
  'Not sure',
]

const REGULATORY_FRAMEWORKS = [
  'None yet',
  'SOC 2 readiness',
  'EU AI Act',
  'NIST AI RMF',
  'ISO 42001',
  'Industry-specific (HIPAA, FDA, etc.)',
  'Multiple frameworks',
]

const STAGE_OPTIONS = [
  'Early prototype / pre-launch',
  'In production with early customers',
  'Scaling with enterprise customers',
  'Responding to customer security questionnaires',
  'Preparing for compliance audit',
]

function trackEvent(type: 'click' | 'form_submit' | 'form_error' | 'conversion', meta?: Record<string, string>) {
  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, path: '/ai-security-compliance', meta }),
  }).catch(() => {})
}

export function SecurityComplianceIntakeForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    website: '',
    productDescription: '',
    aiFeatures: '',
    stage: '',
    reviewScope: '',
    frameworks: '',
    message: '',
    website_check: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const formStartedRef = useRef(false)

  function handleChange(field: string, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (!formStartedRef.current) {
      formStartedRef.current = true
      trackEvent('click', { label: 'security_compliance_intake_start' })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    trackEvent('form_submit', { label: 'security_compliance_intake_submit' })

    try {
      const res = await fetch('/api/commercial/security-review/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, reviewType: 'ai_security_compliance' }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Submission failed')
      }

      trackEvent('conversion', { label: 'security_compliance_intake_success' })
      setSubmitted(true)
    } catch (err) {
      trackEvent('form_error', { label: 'security_compliance_intake_error' })
      setError(err instanceof Error ? err.message : 'An error occurred. Please email admin@subodhkc.com.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div
        aria-live="polite"
        role="status"
        style={{
          padding: '40px',
          textAlign: 'center',
          border: '1px solid var(--op-border)',
          borderRadius: 12,
          background: 'var(--op-card)',
        }}
      >
        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 12, color: 'var(--fg)' }}>
          Got it. Request received.
        </h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          I will look at your AI systems, regulatory environment, and what evidence your customers or auditors
          are asking for. Then I will tell you whether a focused security assessment, a compliance review, or
          a combined engagement makes sense for your situation. Check your email.
        </p>
      </div>
    )
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid var(--op-border)',
    background: 'var(--bg)',
    color: 'var(--fg)',
    fontSize: '0.95rem',
    outline: 'none',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: 600,
    marginBottom: 6,
    color: 'var(--text-secondary)',
  }

  const fieldStyle: React.CSSProperties = { marginBottom: 18 }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 640 }} noValidate>
      <input
        type="text"
        name="website_check"
        value={formData.website_check}
        onChange={e => handleChange('website_check', e.target.value)}
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <div style={fieldStyle}>
          <label htmlFor="sc-name" style={labelStyle}>Name *</label>
          <input id="sc-name" type="text" required value={formData.name} onChange={e => handleChange('name', e.target.value)} style={inputStyle} autoComplete="name" />
        </div>
        <div style={fieldStyle}>
          <label htmlFor="sc-email" style={labelStyle}>Work email *</label>
          <input id="sc-email" type="email" required value={formData.email} onChange={e => handleChange('email', e.target.value)} style={inputStyle} autoComplete="email" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div style={fieldStyle}>
          <label htmlFor="sc-company" style={labelStyle}>Company or product *</label>
          <input id="sc-company" type="text" required value={formData.company} onChange={e => handleChange('company', e.target.value)} style={inputStyle} />
        </div>
        <div style={fieldStyle}>
          <label htmlFor="sc-website" style={labelStyle}>Website</label>
          <input id="sc-website" type="url" value={formData.website} onChange={e => handleChange('website', e.target.value)} style={inputStyle} placeholder="https://..." />
        </div>
      </div>

      <div style={fieldStyle}>
        <label htmlFor="sc-productDescription" style={labelStyle}>What does your product do? *</label>
        <textarea
          id="sc-productDescription"
          rows={3}
          required
          value={formData.productDescription}
          onChange={e => handleChange('productDescription', e.target.value)}
          style={{ ...inputStyle, resize: 'vertical' }}
          placeholder="Brief description of your product and the AI features it includes."
        />
      </div>

      <div style={fieldStyle}>
        <label htmlFor="sc-aiFeatures" style={labelStyle}>Which AI capabilities are in scope? *</label>
        <input
          id="sc-aiFeatures"
          type="text"
          required
          value={formData.aiFeatures}
          onChange={e => handleChange('aiFeatures', e.target.value)}
          style={inputStyle}
          placeholder="e.g., RAG, function calling, agents, model fine-tuning, embeddings"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div style={fieldStyle}>
          <label htmlFor="sc-stage" style={labelStyle}>Current stage *</label>
          <select id="sc-stage" required value={formData.stage} onChange={e => handleChange('stage', e.target.value)} style={inputStyle}>
            <option value="">Select...</option>
            {STAGE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={fieldStyle}>
          <label htmlFor="sc-reviewScope" style={labelStyle}>What type of review do you need? *</label>
          <select id="sc-reviewScope" required value={formData.reviewScope} onChange={e => handleChange('reviewScope', e.target.value)} style={inputStyle}>
            <option value="">Select...</option>
            {REVIEW_SCOPE.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div style={fieldStyle}>
        <label htmlFor="sc-frameworks" style={labelStyle}>Relevant regulatory frameworks *</label>
        <select id="sc-frameworks" required value={formData.frameworks} onChange={e => handleChange('frameworks', e.target.value)} style={inputStyle}>
          <option value="">Select...</option>
          {REGULATORY_FRAMEWORKS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      <div style={fieldStyle}>
        <label htmlFor="sc-message" style={labelStyle}>Additional context</label>
        <textarea
          id="sc-message"
          rows={4}
          value={formData.message}
          onChange={e => handleChange('message', e.target.value)}
          style={{ ...inputStyle, resize: 'vertical' }}
          placeholder="Describe your concerns, timeline, customer security requirements, or specific questions."
        />
      </div>

      {error && (
        <div
          aria-live="assertive"
          role="alert"
          style={{
            padding: '12px 16px',
            borderRadius: 8,
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            fontSize: '0.9rem',
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Request a Review
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
        <span style={{ fontSize: '0.8rem', color: 'var(--op-muted)' }}>
          No credentials, API keys, or secrets in this form. I use what you share here to assess fit and reply to your inquiry.
        </span>
      </div>
    </form>
  )
}
