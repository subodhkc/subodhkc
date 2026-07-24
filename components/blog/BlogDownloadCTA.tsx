'use client'

import { useState } from 'react'

interface BlogDownloadCTAProps {
  downloadableUrl: string
  downloadableLabel: string
}

export function BlogDownloadCTA({ downloadableUrl, downloadableLabel }: BlogDownloadCTAProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setStatus('error')
      setErrorMessage('Please enter a valid email address.')
      return
    }

    setStatus('loading')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'blog-download-cta' }),
      })

      if (response.ok) {
        setStatus('success')
        window.open(downloadableUrl, '_blank')
      } else {
        const data = await response.json().catch(() => ({}))
        if (data.error?.includes('already')) {
          setStatus('success')
          window.open(downloadableUrl, '_blank')
        } else {
          setStatus('error')
          setErrorMessage(data.error || 'Something went wrong. Please try again.')
        }
      }
    } catch {
      setStatus('error')
      setErrorMessage('Network error. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div
        style={{
          marginTop: 48,
          marginBottom: 48,
          padding: '32px 28px',
          borderRadius: 12,
          border: '1px solid var(--op-accent)',
          background: 'var(--op-card)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 28, marginBottom: 12 }}>&#10003;</div>
        <h3
          style={{
            fontSize: 18,
            fontWeight: 500,
            color: 'var(--fg)',
            margin: '0 0 8px',
          }}
        >
          Your checklist is ready
        </h3>
        <p
          style={{
            fontSize: 14,
            color: 'var(--text-secondary)',
            margin: '0 0 20px',
          }}
        >
          The download should have started automatically.
        </p>
        <a
          href={downloadableUrl}
          download
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 24px',
            borderRadius: 999,
            border: '1px solid var(--op-accent)',
            color: 'var(--op-accent)',
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Download again
        </a>
      </div>
    )
  }

  return (
    <div
      style={{
        marginTop: 48,
        marginBottom: 48,
        padding: '32px 28px',
        borderRadius: 12,
        border: '1px solid var(--op-border)',
        background: 'var(--op-card)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: 'var(--op-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            flexShrink: 0,
          }}
        >
          <span style={{ filter: 'brightness(0) invert(1)' }}>&#8681;</span>
        </div>
        <div>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 500,
              color: 'var(--fg)',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {downloadableLabel}
          </h3>
          <p
            style={{
              fontSize: 13,
              color: 'var(--text-secondary)',
              margin: '4px 0 0',
            }}
          >
            Enter your email to download the implementation checklist (Markdown).
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === 'error') setStatus('idle')
          }}
          placeholder="you@company.com"
          disabled={status === 'loading'}
          style={{
            flex: '1 1 240px',
            padding: '12px 16px',
            borderRadius: 8,
            border: '1px solid var(--op-border)',
            background: 'var(--bg)',
            color: 'var(--fg)',
            fontSize: 14,
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          style={{
            padding: '12px 24px',
            borderRadius: 8,
            border: 'none',
            background: 'var(--op-accent)',
            color: 'var(--bg)',
            fontSize: 14,
            fontWeight: 600,
            cursor: status === 'loading' ? 'wait' : 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {status === 'loading' ? 'Sending...' : 'Get the Checklist'}
        </button>
      </form>

      {status === 'error' && (
        <p
          style={{
            marginTop: 12,
            fontSize: 13,
            color: '#ef4444',
          }}
        >
          {errorMessage}
        </p>
      )}

      <p
        style={{
          marginTop: 12,
          fontSize: 11,
          color: 'var(--text-secondary)',
        }}
      >
        We will email you the checklist and occasionally send AI governance insights. Unsubscribe anytime.
      </p>
    </div>
  )
}
