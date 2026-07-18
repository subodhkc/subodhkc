'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import MagazineViewer from './MagazineViewer'
import { MAGAZINE_CSS, MAGAZINE_HTML } from './magazine-data'

export default function MagazinePage() {
  const [mode, setMode] = useState<'flip' | 'scroll'>('flip')
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [error, setSubscribeError] = useState<string | null>(null)

  const pages = useMemo(() => {
    const html = MAGAZINE_HTML.trim()
    const matches = html.match(/<section[^>]*class="page[^"]*"[^>]*>[\s\S]*?<\/section>/g)
    return matches || [html]
  }, [])

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubscribing(true)
    setSubscribeError(null)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'magazine' }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to subscribe')
      }

      setSubscribed(true)
      setEmail('')
    } catch (err) {
      setSubscribeError(err instanceof Error ? err.message : 'Failed to subscribe. Please try again.')
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <>
      <style jsx global>{MAGAZINE_CSS}</style>
      <style jsx global>{`
        .magazine-toolbar {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 24px;
          background: #071927;
          color: #fff;
          box-shadow: 0 4px 20px rgba(7, 25, 39, 0.15);
        }
        .magazine-toolbar strong {
          font-family: Georgia, serif;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .magazine-toolbar .actions {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }
        .magazine-toolbar button, .magazine-toolbar a {
          border: 1px solid rgba(255, 255, 255, 0.25);
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          border-radius: 999px;
          padding: 8px 14px;
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: background 0.15s;
        }
        .magazine-toolbar button:hover, .magazine-toolbar a:hover {
          background: rgba(255, 255, 255, 0.15);
        }
        .magazine-toolbar button:focus-visible, .magazine-toolbar a:focus-visible {
          outline: 2px solid #2563eb;
          outline-offset: 2px;
        }
        .mode-toggle {
          border: 1px solid rgba(255, 255, 255, 0.25);
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          border-radius: 999px;
          padding: 8px 13px;
          font-weight: 750;
          font-size: 12px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .mode-toggle:hover { background: rgba(255, 255, 255, 0.15); }
        .print-only { display: none; }
        @media print {
          .magazine-toolbar { display: none !important; }
          .flip-mode { display: none !important; }
          .book:not(.print-only) { display: none !important; }
          .print-only { display: block !important; }
          .subscribe-section { display: none !important; }
        }

        .subscribe-section {
          max-width: 640px;
          margin: 40px auto;
          padding: 32px 28px;
          background: linear-gradient(135deg, #071927 0%, #113349 100%);
          border-radius: 16px;
          color: #fff;
          text-align: center;
        }
        .subscribe-section h3 {
          font-family: Georgia, serif;
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin: 0 0 10px;
        }
        .subscribe-section p {
          font-size: 15px;
          line-height: 1.5;
          color: #b9c6ce;
          margin: 0 0 22px;
        }
        .subscribe-section form {
          display: flex;
          flex-direction: row;
          gap: 10px;
          max-width: 440px;
          margin: 0 auto;
        }
        .subscribe-section input {
          flex: 1;
          padding: 12px 16px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.06);
          color: #fff;
          font-size: 14px;
          outline: none;
        }
        .subscribe-section input::placeholder { color: #7c8d99; }
        .subscribe-section input:focus { border-color: #1f55d9; }
        .subscribe-section button {
          padding: 12px 24px;
          border-radius: 999px;
          border: none;
          background: #1f55d9;
          color: #fff;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.15s;
        }
        .subscribe-section button:hover { background: #1844b0; }
        .subscribe-section button:disabled { opacity: 0.6; cursor: not-allowed; }
        .subscribe-section .error-msg {
          margin-top: 12px;
          color: #ff946f;
          font-size: 13px;
        }
        .subscribe-section .success-msg {
          margin-top: 12px;
          color: #72d9b1;
          font-size: 14px;
          font-weight: 700;
        }
        .subscribe-section .issue-badge {
          display: inline-block;
          font-family: 'Courier New', monospace;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #8ecdc8;
          border: 1px solid rgba(142, 205, 200, 0.3);
          border-radius: 999px;
          padding: 4px 12px;
          margin-bottom: 14px;
        }
      `}</style>

      <div className="magazine-toolbar" role="toolbar" aria-label="Magazine actions">
        <strong>AI That Works — Issue 01</strong>
        <div className="actions">
          <button onClick={() => window.print()} aria-label="Print or save magazine as PDF">Print / Save as PDF</button>
          <button
            className="mode-toggle"
            onClick={() => setMode(mode === 'flip' ? 'scroll' : 'flip')}
            aria-label="Toggle between flip book and scroll mode"
          >
            {mode === 'flip' ? '☰ Scroll' : '📖 Flip'}
          </button>
          <Link href="/about" aria-label="About the author">About Author</Link>
          <Link href="/contact" aria-label="Contact Subodh KC">Contact</Link>
        </div>
      </div>

      {mode === 'flip' ? (
        <div className="flip-mode">
          <MagazineViewer pages={pages} />
        </div>
      ) : (
        <div className="book" dangerouslySetInnerHTML={{ __html: MAGAZINE_HTML }} />
      )}

      <div className="book print-only" dangerouslySetInnerHTML={{ __html: MAGAZINE_HTML }} />

      <div className="subscribe-section">
        {subscribed ? (
          <>
            <h3>You're On the List</h3>
            <p className="success-msg">You'll be notified when Issue 02 drops. Watch your inbox.</p>
          </>
        ) : (
          <>
            <span className="issue-badge">Issue 02 — Coming Soon</span>
            <h3>Subscribe for the Next Issue</h3>
            <p>Get notified when Issue 02 arrives. No spam, no fluff — just field-tested AI strategy, systems, and governance. One issue at a time.</p>
            {error && <div className="error-msg">{error}</div>}
            <form onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address"
              />
              <button type="submit" disabled={isSubscribing}>
                {isSubscribing ? 'Subscribing...' : 'Notify Me →'}
              </button>
            </form>
          </>
        )}
      </div>
    </>
  )
}
