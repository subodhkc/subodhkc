'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Campaign configuration
const CAMPAIGN_ID = 'haiec-devsec-release-2026-08'
const CAMPAIGN_EXPIRY = new Date('2026-10-21T00:00:00Z').getTime() // 60-day campaign window
const DELAY_MS = 10000 // 10-second trigger
const SCROLL_THRESHOLD = 0.4 // 40% page scroll triggers
const DISMISS_DAYS = 30 // 30-day dismissal persistence
const MOBILE_BREAKPOINT = 768 // Below this, use bottom sheet
const SESSION_KEY = `${CAMPAIGN_ID}-shown`
const DISMISS_KEY = `${CAMPAIGN_ID}-dismissed`

// Pages where the popup must NOT appear
const EXCLUDED_PATHS = [
  '/contact',
  '/api',
  '/checkout',
  '/work-order',
  '/ai-advisor',
  '/advisory',
  '/ai-automation',
  '/products/ai-appsec',
  '/products/mcp-tenant-isolation',
  '/products/llmverify',
  '/insights/ai-appsec-mcp-tenant-isolation-release',
]

function isExcluded(pathname: string): boolean {
  return EXCLUDED_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

function isCampaignActive(): boolean {
  return Date.now() < CAMPAIGN_EXPIRY
}

function wasShownThisSession(): boolean {
  if (typeof window === 'undefined') return false
  return sessionStorage.getItem(SESSION_KEY) === '1'
}

function isDismissed(): boolean {
  if (typeof window === 'undefined') return false
  const raw = localStorage.getItem(DISMISS_KEY)
  if (!raw) return false
  const dismissedAt = parseInt(raw, 10)
  if (Number.isNaN(dismissedAt)) return false
  const ageDays = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24)
  return ageDays < DISMISS_DAYS
}

function markShown() {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(SESSION_KEY, '1')
}

function markDismissed() {
  if (typeof window === 'undefined') return
  localStorage.setItem(DISMISS_KEY, Date.now().toString())
}

function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < MOBILE_BREAKPOINT
}

export function DeveloperSecurityReleaseNotice() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [mobile, setMobile] = useState(false)

  const dismiss = useCallback(() => {
    setVisible(false)
    markDismissed()
    markShown()
  }, [])

  // Track viewport changes for mobile/desktop switching
  useEffect(() => {
    const onResize = () => setMobile(isMobile())
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Body scroll lock when visible
  useEffect(() => {
    if (!visible) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [visible])

  // Trigger logic - runs once per pathname change
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Exclusion checks
    if (isExcluded(pathname)) return

    // Campaign expiry
    if (!isCampaignActive()) return

    // Once-per-session
    if (wasShownThisSession()) return

    // 30-day dismissal
    if (isDismissed()) return

    let triggered = false

    const show = () => {
      if (triggered) return
      triggered = true
      setVisible(true)
      markShown()
      window.removeEventListener('scroll', onScroll, true)
      clearTimeout(delayTimer)
    }

    // 10-second delay trigger
    const delayTimer = window.setTimeout(show, DELAY_MS)

    // Scroll trigger
    const onScroll = () => {
      const scrolled = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max > 0 && scrolled / max >= SCROLL_THRESHOLD) {
        show()
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true, capture: true })

    // Escape key dismissal (only active when visible)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dismiss()
      }
    }
    document.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('scroll', onScroll, true)
      document.removeEventListener('keydown', onKey)
      clearTimeout(delayTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]) // Intentionally NOT depending on visible/dismiss to avoid re-triggering

  if (!visible) return null

  // Mobile: bottom sheet style
  // Desktop: centered modal
  const overlayStyle: React.CSSProperties = mobile
    ? {
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
      }
    : {
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
      }

  const cardStyle: React.CSSProperties = mobile
    ? {
        maxWidth: '100%',
        width: '100%',
        backgroundColor: 'var(--bg, #0a0a0a)',
        border: '1px solid var(--op-border, #333)',
        borderBottom: 'none',
        borderRadius: '16px 16px 0 0',
        padding: '24px 20px 28px',
        position: 'relative',
        fontFamily: 'var(--font-sans, sans-serif)',
        // Safe area padding for notched devices
        paddingBottom: 'calc(28px + env(safe-area-inset-bottom, 0px))',
      }
    : {
        maxWidth: 540,
        width: '100%',
        backgroundColor: 'var(--bg, #0a0a0a)',
        border: '1px solid var(--op-border, #333)',
        borderRadius: 12,
        padding: '32px 28px',
        position: 'relative',
        fontFamily: 'var(--font-sans, sans-serif)',
      }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="devsec-notice-title"
      style={overlayStyle}
      onClick={(e) => {
        if (e.target === e.currentTarget) dismiss()
      }}
    >
      <div style={cardStyle}>
        {/* Mobile drag handle */}
        {mobile && (
          <div
            aria-hidden="true"
            style={{
              width: 40,
              height: 4,
              backgroundColor: 'var(--op-border, #333)',
              borderRadius: 2,
              margin: '0 auto 16px',
            }}
          />
        )}

        {/* Close button - 44px min tap target for accessibility */}
        <button
          onClick={dismiss}
          aria-label="Close notice"
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 22,
            color: 'var(--text-secondary, #999)',
            padding: '10px', // 44px total with font-size
            lineHeight: 1,
            minHeight: 44,
            minWidth: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ×
        </button>

        {/* Eyebrow */}
        <div
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: 11,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--op-accent, #3b82f6)',
            marginBottom: 12,
          }}
        >
          HAIEC Developer Security · New Release
        </div>

        {/* Title */}
        <h2
          id="devsec-notice-title"
          style={{
            margin: 0,
            fontSize: mobile ? 20 : 22,
            fontWeight: 600,
            letterSpacing: '-0.02em',
            lineHeight: 1.25,
            color: 'var(--fg, #fff)',
            marginBottom: 12,
            paddingRight: 40, // Avoid overlap with close button
          }}
        >
          Security checks your coding agent can call.
        </h2>

        {/* Body */}
        <p
          style={{
            margin: 0,
            fontSize: 14,
            lineHeight: 1.55,
            color: 'var(--text-secondary, #999)',
            marginBottom: 16,
          }}
        >
          Two new MIT-licensed tools for AI-assisted development: AI AppSec audits AI application
          code, and MCP Tenant Isolation checks tenant boundaries across multi-tenant SaaS and MCP
          server code. Both run locally and expose focused checks through MCP.
        </p>

        {/* Product chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {['AI AppSec v0.1.0', 'MCP Tenant Isolation v2.0.0', 'LLMVerify v1.6.1'].map((chip) => (
            <span
              key={chip}
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: 10.5,
                padding: '3px 10px',
                border: '1px solid var(--op-border, #333)',
                borderRadius: 999,
                color: 'var(--text-secondary, #999)',
              }}
            >
              {chip}
            </span>
          ))}
        </div>

        {/* CTAs - full width on mobile, auto on desktop */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: mobile ? 'wrap' : 'nowrap',
          }}
        >
          <Link
            href="/insights/ai-appsec-mcp-tenant-isolation-release"
            data-track-click="popup_release_article_click"
            onClick={() => {
              markShown()
              setVisible(false)
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '12px 18px',
              backgroundColor: 'var(--op-accent, #3b82f6)',
              color: '#fff',
              borderRadius: 999,
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 12,
              fontWeight: 500,
              textDecoration: 'none',
              minHeight: 44,
              flex: mobile ? '1 1 100%' : '0 1 auto',
            }}
          >
            Read the release →
          </Link>
          <button
            onClick={dismiss}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 18px',
              border: '1px solid var(--op-border, #333)',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary, #999)',
              borderRadius: 999,
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              minHeight: 44,
              flex: mobile ? '1 1 100%' : '0 1 auto',
            }}
          >
            Not now
          </button>
        </div>

        {/* Privacy note */}
        <p
          style={{
            margin: '16px 0 0',
            fontSize: 10.5,
            color: 'var(--op-muted, #666)',
            fontFamily: 'var(--font-mono, monospace)',
          }}
        >
          No tracking. No IP collection. No third-party analytics. Dismissed for 30 days.
        </p>
      </div>
    </div>
  )
}
