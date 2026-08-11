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
        href="https://calendly.com/subodhkc/30min"
        target="_blank"
        rel="noopener noreferrer"
        data-track-click="sticky-cta-schedule"
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
        Schedule Meeting →
      </Link>
    </div>
  )
}
