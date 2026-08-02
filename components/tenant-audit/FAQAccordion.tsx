'use client'

import { useEffect, useRef } from 'react'

interface FAQItem {
  question: string
  answer: string
}

export function FAQAccordion({ items }: { items: FAQItem[] }) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleToggle = (e: Event) => {
      const details = e.target as HTMLDetailsElement
      if (details.open) {
        const summary = details.querySelector('summary')
        const question = summary?.textContent?.slice(0, 80) || 'unknown'
        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'click',
            path: '/services/saas-tenant-isolation-audit',
            meta: { label: 'tenant_audit_faq_open', question },
          }),
        }).catch(() => {})
      }
    }

    const detailsElements = sectionRef.current?.querySelectorAll('details')
    detailsElements?.forEach((el) => {
      el.addEventListener('toggle', handleToggle)
    })

    return () => {
      detailsElements?.forEach((el) => {
        el.removeEventListener('toggle', handleToggle)
      })
    }
  }, [])

  return (
    <div ref={sectionRef}>
      {items.map((item, i) => (
        <details
          key={i}
          style={{
            borderBottom: '1px solid var(--op-border)',
            padding: '16px 0',
          }}
        >
          <summary
            style={{
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '1.05rem',
              color: 'var(--fg)',
              listStyle: 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12,
            }}
            className="faq-summary"
          >
            <span>{item.question}</span>
            <span style={{ flexShrink: 0, color: 'var(--op-muted)', fontSize: '1.2rem' }} className="faq-chevron">
              +
            </span>
          </summary>
          <p
            style={{
              marginTop: 12,
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              fontSize: '0.95rem',
            }}
          >
            {item.answer}
          </p>
        </details>
      ))}
      <style>{`
        .faq-summary::-webkit-details-marker { display: none; }
        details[open] .faq-chevron { transform: rotate(45deg); }
        .faq-chevron { transition: transform 0.2s ease; }
        @media (prefers-reduced-motion: reduce) {
          .faq-chevron { transition: none; }
        }
      `}</style>
    </div>
  )
}
