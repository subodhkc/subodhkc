'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export function StickyCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
        href="/contact"
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
          border: '1px solid var(--border)',
        }}
      >
        Let&apos;s Talk →
      </Link>
    </div>
  )
}
