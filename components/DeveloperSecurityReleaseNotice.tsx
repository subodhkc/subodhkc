'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Campaign configuration
const CAMPAIGN_ID = 'subodhkc-devsec-release-2026-08'
const CAMPAIGN_EXPIRY = new Date('2026-10-21T00:00:00Z').getTime()
const DELAY_MS = 8000 // 8-second trigger
const SCROLL_THRESHOLD = 0.35 // 35% page scroll triggers
const DISMISS_DAYS = 30
const MOBILE_BREAKPOINT = 768
const SESSION_KEY = `${CAMPAIGN_ID}-shown`
const DISMISS_KEY = `${CAMPAIGN_ID}-dismissed`

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

// ─── Product data for the visual cards ───────────────────────────────

const PRODUCTS = [
  {
    role: 'SOURCE',
    name: 'AI AppSec',
    version: 'v0.1.0',
    desc: 'Audit AI application code',
    mcpTool: 'scan_ai_security',
    href: '/products/ai-appsec',
  },
  {
    role: 'BOUNDARY',
    name: 'MCP Tenant Isolation',
    version: 'v2.0.0',
    desc: 'Check tenant boundaries',
    mcpTool: 'scan_tenant_isolation',
    href: '/products/mcp-tenant-isolation',
  },
  {
    role: 'RUNTIME',
    name: 'LLMVerify',
    version: 'v1.6.1',
    desc: 'Verify model interactions',
    mcpTool: 'verify · redactPII',
    href: '/products/llmverify',
  },
]

export function DeveloperSecurityReleaseNotice() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [mobile, setMobile] = useState(false)

  const dismiss = useCallback(() => {
    setVisible(false)
    markDismissed()
    markShown()
  }, [])

  useEffect(() => {
    const onResize = () => setMobile(isMobile())
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (!visible) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [visible])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (isExcluded(pathname)) return
    if (!isCampaignActive()) return
    if (wasShownThisSession()) return
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

    const delayTimer = window.setTimeout(show, DELAY_MS)

    const onScroll = () => {
      const scrolled = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max > 0 && scrolled / max >= SCROLL_THRESHOLD) {
        show()
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true, capture: true })

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss()
    }
    document.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('scroll', onScroll, true)
      document.removeEventListener('keydown', onKey)
      clearTimeout(delayTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  if (!visible) return null

  // Shared style fragments
  const accentColor = 'var(--op-accent, #16d088)'
  const bgColor = 'var(--bg, #2b2e33)'
  const fgColor = 'var(--fg, #ebe6d8)'
  const borderColor = 'var(--op-border, #404349)'
  const mutedColor = 'var(--op-muted, #9a9a96)'
  const textSecondary = 'var(--text-secondary, #c4c4be)'
  const fontMono = 'var(--font-mono, monospace)'
  const fontSans = 'var(--font-sans, sans-serif)'

  const overlayStyle: React.CSSProperties = mobile
    ? {
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }
    : {
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }

  const cardStyle: React.CSSProperties = mobile
    ? {
        maxWidth: '100%',
        width: '100%',
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderBottom: 'none',
        borderRadius: '20px 20px 0 0',
        padding: 0,
        position: 'relative',
        fontFamily: fontSans,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxShadow: '0 -8px 40px rgba(0, 0, 0, 0.4)',
        maxHeight: '92vh',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain',
      }
    : {
        maxWidth: 520,
        width: '100%',
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: 16,
        padding: 0,
        position: 'relative',
        fontFamily: fontSans,
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden',
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
        {/* ─── Header band with gradient ─── */}
        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(22, 208, 136, 0.12) 0%, rgba(22, 208, 136, 0.03) 50%, transparent 100%)',
            borderBottom: `1px solid ${borderColor}`,
            padding: mobile ? '16px 16px 14px' : '28px 28px 20px',
            position: 'relative',
          }}
        >
          {/* Mobile drag handle - positioned at very top */}
          {mobile && (
            <div
              aria-hidden="true"
              style={{
                width: 36,
                height: 4,
                backgroundColor: borderColor,
                borderRadius: 2,
                margin: '0 auto 12px',
              }}
            />
          )}

          {/* Close button - positioned to avoid drag handle on mobile */}
          <button
            onClick={dismiss}
            aria-label="Close notice"
            style={{
              position: 'absolute',
              top: mobile ? 32 : 12,
              right: 12,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 22,
              color: textSecondary,
              padding: '10px',
              lineHeight: 1,
              minHeight: 44,
              minWidth: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
            }}
          >
            ×
          </button>

          {/* Brand row: Subodh KC avatar + name */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: mobile ? 8 : 10,
              marginBottom: mobile ? 10 : 14,
            }}
          >
            <div
              style={{
                width: mobile ? 32 : 36,
                height: mobile ? 32 : 36,
                borderRadius: 8,
                background: accentColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: mobile ? 12 : 14,
                fontWeight: 700,
                color: bgColor,
                flexShrink: 0,
              }}
            >
              SK
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: mobile ? 12 : 13,
                  fontWeight: 600,
                  color: fgColor,
                  lineHeight: 1.2,
                }}
              >
                Subodh KC
              </div>
              <div
                style={{
                  fontFamily: fontMono,
                  fontSize: mobile ? 9 : 10,
                  color: mutedColor,
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                AI Advisor & AI Systems Architect
              </div>
            </div>
          </div>

          {/* FREE badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              borderRadius: 999,
              backgroundColor: 'rgba(22, 208, 136, 0.15)',
              border: '1px solid rgba(22, 208, 136, 0.3)',
              marginBottom: mobile ? 8 : 12,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: accentColor,
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: fontMono,
                fontSize: 10,
                fontWeight: 600,
                color: accentColor,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}
            >
              Free · Open Source · MIT
            </span>
          </div>

          {/* Title */}
          <h2
            id="devsec-notice-title"
            style={{
              margin: 0,
              fontSize: mobile ? 18 : 22,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
              color: fgColor,
              paddingRight: mobile ? 36 : 40,
            }}
          >
            Free AI security tools your coding agent can call.
          </h2>

          {/* Subtitle */}
          <p
            style={{
              margin: '6px 0 0',
              fontSize: mobile ? 12 : 13,
              lineHeight: 1.5,
              color: textSecondary,
              paddingRight: mobile ? 0 : 0,
            }}
          >
            Built by Subodh KC. Three MIT-licensed packages that scan AI code, check tenant
            boundaries, and verify model output. Run locally. No API key. No telemetry.
          </p>
        </div>

        {/* ─── Product cards ─── */}
        <div
          style={{
            padding: mobile ? '12px 16px' : '20px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: mobile ? 6 : 8,
          }}
        >
          {PRODUCTS.map((product) => (
            <Link
              key={product.name}
              href={product.href}
              data-track-click={`popup_${product.name.replace(/\s+/g, '_').toLowerCase()}_click`}
              onClick={() => {
                markShown()
                setVisible(false)
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: mobile ? 8 : 12,
                padding: mobile ? '10px 12px' : '12px 14px',
                borderRadius: 10,
                border: `1px solid ${borderColor}`,
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                textDecoration: 'none',
                transition: 'border-color 0.15s, background-color 0.15s',
                minHeight: 44,
              }}
            >
              {/* Role badge - smaller on mobile */}
              <div
                style={{
                  flexShrink: 0,
                  width: mobile ? 48 : 56,
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontFamily: fontMono,
                    fontSize: mobile ? 8 : 9,
                    fontWeight: 600,
                    color: accentColor,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    padding: '3px 4px',
                    border: '1px solid rgba(22, 208, 136, 0.25)',
                    borderRadius: 6,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {product.role}
                </div>
              </div>

              {/* Product info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 5,
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{
                      fontSize: mobile ? 13 : 14,
                      fontWeight: 600,
                      color: fgColor,
                    }}
                  >
                    {product.name}
                  </span>
                  <span
                    style={{
                      fontFamily: fontMono,
                      fontSize: 10,
                      color: mutedColor,
                    }}
                  >
                    {product.version}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: mobile ? 11 : 12,
                    color: textSecondary,
                    lineHeight: 1.4,
                    marginTop: 2,
                  }}
                >
                  {product.desc}
                </div>
                {/* MCP tool line - hidden on very small screens to save space */}
                <div
                  style={{
                    fontFamily: fontMono,
                    fontSize: mobile ? 9 : 10,
                    color: mutedColor,
                    marginTop: 3,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  MCP: {product.mcpTool}
                </div>
              </div>

              {/* Arrow */}
              <div
                style={{
                  flexShrink: 0,
                  fontSize: 16,
                  color: mutedColor,
                }}
              >
                →
              </div>
            </Link>
          ))}
        </div>

        {/* ─── CTA section ─── */}
        <div
          style={{
            padding: mobile ? '12px 16px 16px' : '0 28px 24px',
            borderTop: `1px solid ${borderColor}`,
            paddingTop: mobile ? 12 : 16,
          }}
        >
          {/* Primary CTA */}
          <Link
            href="/insights/ai-appsec-mcp-tenant-isolation-release"
            data-track-click="popup_release_article_click"
            onClick={() => {
              markShown()
              setVisible(false)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              width: '100%',
              padding: mobile ? '13px 20px' : '14px 20px',
              backgroundColor: accentColor,
              color: bgColor,
              borderRadius: 10,
              fontFamily: fontSans,
              fontSize: mobile ? 13 : 14,
              fontWeight: 600,
              textDecoration: 'none',
              minHeight: 48,
              marginBottom: 8,
            }}
          >
            Read the release article
            <span style={{ fontSize: 16 }}>→</span>
          </Link>

          {/* Secondary CTA */}
          <button
            onClick={dismiss}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              padding: '12px 20px',
              border: `1px solid ${borderColor}`,
              backgroundColor: 'transparent',
              color: textSecondary,
              borderRadius: 10,
              fontFamily: fontSans,
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              minHeight: 44,
            }}
          >
            Not now
          </button>

          {/* Trust line */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: mobile ? 8 : 12,
              marginTop: 12,
              flexWrap: 'wrap',
            }}
          >
            {['No signup', 'No API key', 'No telemetry'].map((item) => (
              <span
                key={item}
                style={{
                  fontFamily: fontMono,
                  fontSize: mobile ? 9 : 10,
                  color: mutedColor,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  whiteSpace: 'nowrap',
                }}
              >
                <span
                  style={{
                    color: accentColor,
                    fontSize: 11,
                  }}
                >
                  ✓
                </span>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
