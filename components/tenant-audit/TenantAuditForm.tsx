'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'

const ENGAGEMENT_OPTIONS = [
  'Focused tenant boundary review',
  'Full tenant isolation audit',
  'Remediation',
  'Multi-tenant implementation',
  'Agency or white-label relationship',
  'Not sure',
]

const STAGE_OPTIONS = [
  'Prototype / pre-launch',
  'Early customers',
  'Onboarding first enterprise customer',
  'In production with multiple tenants',
  'Converting single-user to multi-tenant',
]

const TENANT_MODEL_OPTIONS = [
  'No tenant model yet',
  'Organization IDs added but untested',
  'RLS or row-level filters in place',
  'Full multi-tenant with roles',
  'Not sure',
]

function trackEvent(type: 'click' | 'form_submit' | 'form_error' | 'conversion', meta?: Record<string, string>) {
  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type,
      path: '/services/saas-tenant-isolation-audit',
      meta,
    }),
  }).catch(() => {})
}

export function TenantAuditForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    website: '',
    stack: '',
    stage: '',
    routeCount: '',
    tenantModel: '',
    stagingAvailable: '',
    primaryConcern: '',
    desiredEngagement: '',
    message: '',
    // Honeypot
    website_check: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const formStartedRef = useRef(false)

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (!formStartedRef.current) {
      formStartedRef.current = true
      trackEvent('click', { label: 'tenant_audit_form_start' })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    trackEvent('form_submit', { label: 'tenant_audit_form_submit' })

    try {
      const res = await fetch('/api/tenant-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Submission failed')
      }

      trackEvent('conversion', { label: 'tenant_audit_form_success' })
      setSubmitted(true)
    } catch (err) {
      trackEvent('form_error', { label: 'tenant_audit_form_error' })
      setError(err instanceof Error ? err.message : 'An error occurred. Please email subodhkc@subodhkc.com.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div
        style={{
          padding: '40px',
          textAlign: 'center',
          border: '1px solid var(--op-border)',
          borderRadius: 12,
          background: 'var(--op-card)',
        }}
      >
        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 12, color: 'var(--fg)' }}>
          Request received
        </h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Thank you. I will review your stack and application details, then confirm whether a focused review,
          behavioral audit or full multi-tenant deployment fits your situation. Expect a response at the email
          you provided.
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

  const fieldStyle: React.CSSProperties = {
    marginBottom: 18,
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 640 }} noValidate>
      {/* Honeypot */}
      <input
        type="text"
        name="website_check"
        value={formData.website_check}
        onChange={(e) => handleChange('website_check', e.target.value)}
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={fieldStyle}>
          <label htmlFor="ta-name" style={labelStyle}>Name *</label>
          <input
            id="ta-name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            style={inputStyle}
            autoComplete="name"
          />
        </div>
        <div style={fieldStyle}>
          <label htmlFor="ta-email" style={labelStyle}>Work email *</label>
          <input
            id="ta-email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            style={inputStyle}
            autoComplete="email"
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={fieldStyle}>
          <label htmlFor="ta-company" style={labelStyle}>Company or product *</label>
          <input
            id="ta-company"
            type="text"
            required
            value={formData.company}
            onChange={(e) => handleChange('company', e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={fieldStyle}>
          <label htmlFor="ta-website" style={labelStyle}>Website or repository URL</label>
          <input
            id="ta-website"
            type="url"
            value={formData.website}
            onChange={(e) => handleChange('website', e.target.value)}
            style={inputStyle}
            placeholder="https://..."
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={fieldStyle}>
          <label htmlFor="ta-stack" style={labelStyle}>Current stack *</label>
          <input
            id="ta-stack"
            type="text"
            required
            value={formData.stack}
            onChange={(e) => handleChange('stack', e.target.value)}
            style={inputStyle}
            placeholder="Next.js, Supabase, Prisma..."
          />
        </div>
        <div style={fieldStyle}>
          <label htmlFor="ta-stage" style={labelStyle}>Application stage *</label>
          <select
            id="ta-stage"
            required
            value={formData.stage}
            onChange={(e) => handleChange('stage', e.target.value)}
            style={inputStyle}
          >
            <option value="">Select...</option>
            {STAGE_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={fieldStyle}>
          <label htmlFor="ta-routes" style={labelStyle}>Approximate API-route count</label>
          <input
            id="ta-routes"
            type="text"
            value={formData.routeCount}
            onChange={(e) => handleChange('routeCount', e.target.value)}
            style={inputStyle}
            placeholder="e.g. 30, 50-100, 200+"
          />
        </div>
        <div style={fieldStyle}>
          <label htmlFor="ta-tenant" style={labelStyle}>Tenant model status *</label>
          <select
            id="ta-tenant"
            required
            value={formData.tenantModel}
            onChange={(e) => handleChange('tenantModel', e.target.value)}
            style={inputStyle}
          >
            <option value="">Select...</option>
            {TENANT_MODEL_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={fieldStyle}>
          <label htmlFor="ta-staging" style={labelStyle}>Staging environment available? *</label>
          <select
            id="ta-staging"
            required
            value={formData.stagingAvailable}
            onChange={(e) => handleChange('stagingAvailable', e.target.value)}
            style={inputStyle}
          >
            <option value="">Select...</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="can-create">Can create one</option>
          </select>
        </div>
        <div style={fieldStyle}>
          <label htmlFor="ta-engagement" style={labelStyle}>Desired engagement *</label>
          <select
            id="ta-engagement"
            required
            value={formData.desiredEngagement}
            onChange={(e) => handleChange('desiredEngagement', e.target.value)}
            style={inputStyle}
          >
            <option value="">Select...</option>
            {ENGAGEMENT_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={fieldStyle}>
        <label htmlFor="ta-concern" style={labelStyle}>Primary concern</label>
        <input
          id="ta-concern"
          type="text"
          value={formData.primaryConcern}
          onChange={(e) => handleChange('primaryConcern', e.target.value)}
          style={inputStyle}
          placeholder="e.g. IDOR, RLS gaps, role escalation, storage leakage..."
        />
      </div>

      <div style={fieldStyle}>
        <label htmlFor="ta-message" style={labelStyle}>Message</label>
        <textarea
          id="ta-message"
          rows={4}
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          style={{ ...inputStyle, resize: 'vertical' }}
          placeholder="Describe your tenant model, concerns or timeline. Do not share credentials or secrets."
        />
      </div>

      {error && (
        <div
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
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          data-track-click="tenant_audit_form_submit"
        >
          {isSubmitting ? 'Sending...' : 'Request a Tenant Audit'}
        </Button>
        <span style={{ fontSize: '0.8rem', color: 'var(--op-muted)' }}>
          Do not include credentials, API keys or secrets. Your information is used only to assess fit and respond to your inquiry.
        </span>
      </div>
    </form>
  )
}
