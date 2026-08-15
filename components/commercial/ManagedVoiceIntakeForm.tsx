'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Loader2 } from 'lucide-react'

const DEPLOYMENT_TYPES = [
  'Standard answering, FAQ, and routing',
  'Appointment booking and calendar integration',
  'CRM actions and record updates',
  'Dispatch and work-order integration',
  'Multi-system workflow automation',
  'Multiple locations',
  'Not sure yet',
]

const CALL_VOLUMES = [
  'Fewer than 50 calls/day',
  '50-200 calls/day',
  '200-500 calls/day',
  '500+ calls/day',
]

const TIMELINE_OPTIONS = [
  'Within 2 weeks',
  'Within 30 days',
  'Within 60 days',
  'Exploring options',
]

function trackEvent(type: 'click' | 'form_submit' | 'form_error' | 'conversion', meta?: Record<string, string>) {
  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, path: '/ai-voice-agent', meta }),
  }).catch(() => {})
}

export function ManagedVoiceIntakeForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    website: '',
    industry: '',
    callVolume: '',
    deploymentType: '',
    currentSystem: '',
    timeline: '',
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
      trackEvent('click', { label: 'managed_voice_intake_start' })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    trackEvent('form_submit', { label: 'managed_voice_intake_submit' })

    try {
      const res = await fetch('/api/commercial/managed-voice/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Submission failed')
      }

      trackEvent('conversion', { label: 'managed_voice_intake_success' })
      setSubmitted(true)
    } catch (err) {
      trackEvent('form_error', { label: 'managed_voice_intake_error' })
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
          I will look at your call patterns, business rules, and what systems you need connected. Then I will
          tell you straight whether standard deployment covers it or you need a custom workflow. Check your
          email for a response.
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
          <label htmlFor="mv-name" style={labelStyle}>Name *</label>
          <input
            id="mv-name"
            type="text"
            required
            value={formData.name}
            onChange={e => handleChange('name', e.target.value)}
            style={inputStyle}
            autoComplete="name"
          />
        </div>
        <div style={fieldStyle}>
          <label htmlFor="mv-email" style={labelStyle}>Work email *</label>
          <input
            id="mv-email"
            type="email"
            required
            value={formData.email}
            onChange={e => handleChange('email', e.target.value)}
            style={inputStyle}
            autoComplete="email"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div style={fieldStyle}>
          <label htmlFor="mv-company" style={labelStyle}>Company *</label>
          <input
            id="mv-company"
            type="text"
            required
            value={formData.company}
            onChange={e => handleChange('company', e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={fieldStyle}>
          <label htmlFor="mv-website" style={labelStyle}>Website</label>
          <input
            id="mv-website"
            type="url"
            value={formData.website}
            onChange={e => handleChange('website', e.target.value)}
            style={inputStyle}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div style={fieldStyle}>
          <label htmlFor="mv-industry" style={labelStyle}>Industry *</label>
          <input
            id="mv-industry"
            type="text"
            required
            value={formData.industry}
            onChange={e => handleChange('industry', e.target.value)}
            style={inputStyle}
            placeholder="e.g., healthcare, legal, field services"
          />
        </div>
        <div style={fieldStyle}>
          <label htmlFor="mv-callVolume" style={labelStyle}>Approximate daily call volume *</label>
          <select
            id="mv-callVolume"
            required
            value={formData.callVolume}
            onChange={e => handleChange('callVolume', e.target.value)}
            style={inputStyle}
          >
            <option value="">Select...</option>
            {CALL_VOLUMES.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div style={fieldStyle}>
          <label htmlFor="mv-deploymentType" style={labelStyle}>What do you need the voice agent to do? *</label>
          <select
            id="mv-deploymentType"
            required
            value={formData.deploymentType}
            onChange={e => handleChange('deploymentType', e.target.value)}
            style={inputStyle}
          >
            <option value="">Select...</option>
            {DEPLOYMENT_TYPES.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div style={fieldStyle}>
          <label htmlFor="mv-timeline" style={labelStyle}>Target timeline *</label>
          <select
            id="mv-timeline"
            required
            value={formData.timeline}
            onChange={e => handleChange('timeline', e.target.value)}
            style={inputStyle}
          >
            <option value="">Select...</option>
            {TIMELINE_OPTIONS.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={fieldStyle}>
        <label htmlFor="mv-currentSystem" style={labelStyle}>Current phone or answering system</label>
        <input
          id="mv-currentSystem"
          type="text"
          value={formData.currentSystem}
          onChange={e => handleChange('currentSystem', e.target.value)}
          style={inputStyle}
          placeholder="e.g., Google Voice, Vonage, receptionist, forwarding service"
        />
      </div>

      <div style={fieldStyle}>
        <label htmlFor="mv-message" style={labelStyle}>What calls should AI handle, and what should reach a person?</label>
        <textarea
          id="mv-message"
          rows={4}
          value={formData.message}
          onChange={e => handleChange('message', e.target.value)}
          style={{ ...inputStyle, resize: 'vertical' }}
          placeholder="Describe your call patterns, business rules, integrations needed, and any compliance considerations."
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
              Request a Fit Call
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
