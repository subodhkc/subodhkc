'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface NavSection {
  id: string
  label: string
}

const SECTIONS: NavSection[] = [
  { id: 'name', label: 'Name' },
  { id: 'possibility', label: 'Possibility' },
  { id: 'method', label: 'Method' },
  { id: 'start', label: 'Decisions' },
  { id: 'csm', label: 'CSM' },
  { id: 'products', label: 'Systems' },
  { id: 'compliance', label: 'Compliance' },
  { id: 'writing', label: 'Writing' },
]

export function FloatingNav() {
  const [visible, setVisible] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600)

      // Find active section
      const sections = SECTIONS.map((s) => ({
        id: s.id,
        el: document.getElementById(s.id),
      })).filter((s) => s.el !== null)

      const scrollPos = window.scrollY + window.innerHeight / 3
      let current = ''
      for (const s of sections) {
        if (s.el && s.el.offsetTop <= scrollPos) {
          current = s.id
        }
      }
      setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setExpanded(false)
  }

  if (!visible) return null

  return (
    <>
      {/* Section jump bar - right side */}
      <nav
        aria-label="Section navigation"
        style={{
          position: 'fixed',
          right: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 90,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          opacity: expanded ? 1 : 0.85,
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        {SECTIONS.map((section) => {
          const isActive = activeSection === section.id
          return (
            <button
              key={section.id}
              onClick={() => handleClick(section.id)}
              aria-label={`Jump to ${section.label}`}
              title={section.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                justifyContent: 'flex-end',
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  color: isActive ? 'var(--op-accent)' : 'var(--op-muted)',
                  opacity: expanded ? 1 : 0,
                  transition: 'opacity 0.2s',
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                {section.label}
              </span>
              <span
                style={{
                  width: isActive ? 10 : 7,
                  height: isActive ? 10 : 7,
                  borderRadius: '50%',
                  background: isActive ? 'var(--op-accent)' : 'var(--op-border)',
                  border: isActive ? '1px solid var(--op-accent)' : '1px solid transparent',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
              />
            </button>
          )
        })}
      </nav>

      {/* Magazine FAB - bottom right */}
      <Link
        href="/magazine"
        aria-label="Read the magazine"
        style={{
          position: 'fixed',
          right: 20,
          bottom: 24,
          zIndex: 91,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 18px',
          borderRadius: 999,
          background: 'var(--fg)',
          color: 'var(--bg)',
          fontSize: 13,
          fontWeight: 600,
          textDecoration: 'none',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.2)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)'
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h2" />
          <path d="M18 14h-8" />
          <path d="M15 18h-5" />
          <path d="M10 6h8v4h-8V6z" />
        </svg>
        <span>Magazine</span>
      </Link>

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 720px) {
          nav[aria-label="Section navigation"] {
            right: 10px !important;
            gap: 8px !important;
          }
          nav[aria-label="Section navigation"] button span:first-child {
            display: none !important;
          }
          a[href="/magazine"] span:last-child {
            display: none !important;
          }
          a[href="/magazine"] {
            padding: 14px !important;
          }
        }
      `}</style>
    </>
  )
}
