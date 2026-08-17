'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function StickyCTA() {
  const [visible, setVisible] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (pathname?.startsWith('/resume') || pathname?.startsWith('/magazine') || pathname?.startsWith('/portfolio')) {
    return null
  }

  return (
    <div
      className="sticky-cta-wrapper"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 100,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity .3s ease, transform .3s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <Link
        href="/ai-advisor"
        data-track-click="homepage_sticky_cta_click"
        aria-label="Explore AI Advisor"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 22px',
          borderRadius: 999,
          background: 'var(--fg)',
          color: 'var(--bg)',
          fontSize: 13,
          fontFamily: 'var(--font-mono)',
          fontWeight: 500,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          border: '1px solid var(--op-border)',
        }}
      >
        AI Advisor →
      </Link>
      <style>{`
        @media (max-width: 640px) {
          .sticky-cta-wrapper {
            bottom: 16px !important;
            right: 16px !important;
          }
          .sticky-cta-wrapper a {
            padding: 10px 18px !important;
            font-size: 12px !important;
          }
        }
      `}</style>
    </div>
  )
}
