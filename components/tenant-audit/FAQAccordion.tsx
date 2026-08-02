'use client'

import { useEffect, useRef } from 'react'

interface FAQItem {
  question: string
  answer: string
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'What is a SaaS tenant isolation audit?',
    answer:
      'A tenant isolation audit determines whether one customer, organization or workspace can access another tenant\u2019s records, files, administrative functions or billing context. It reviews authentication, organization membership, API authorization, database queries, role changes and storage access as one connected boundary.',
  },
  {
    question: 'Is authentication enough to protect a multi-tenant SaaS?',
    answer:
      'No. Authentication establishes who the user is. Tenant authorization must also establish which organizations and resources that identity may access. A valid signed-in user can still exploit a route that trusts a supplied organization ID or retrieves a record without verifying ownership.',
  },
  {
    question: 'Do you audit Supabase Row-Level Security policies?',
    answer:
      'Yes. A Supabase review can cover RLS policies for reads, inserts, updates and deletes; membership functions; service-role paths; storage policies; security-definer functions and the relationship between server-side routes and database enforcement.',
  },
  {
    question: 'Do you review Next.js and Prisma applications?',
    answer:
      'Yes. The review traces authorization through Next.js middleware and route handlers into Prisma queries, PostgreSQL relationships, background operations and storage access. Special attention is given to resource queries that use an ID without a verified organization constraint.',
  },
  {
    question: 'Can you review an application built with Lovable, Bolt, Replit or AI coding tools?',
    answer:
      'Yes. AI-built applications are a strong fit because individually generated routes may use inconsistent authorization patterns. The review evaluates the resulting implementation rather than judging which tool produced it.',
  },
  {
    question: 'Will you test my production database?',
    answer:
      'The preferred approach is an isolated staging environment with synthetic tenants and data. Production testing requires explicit scope, backups, access controls and agreement on permitted actions. Destructive tests are excluded unless separately authorized.',
  },
  {
    question: 'What access do you need?',
    answer:
      'A read-only repository review can begin with source access and architecture context. Behavioral verification normally requires a dedicated branch or commit, an isolated database, synthetic user accounts, staging deployment access and relevant logs. Credentials should be scoped to the minimum required permissions.',
  },
  {
    question: 'What does the final report include?',
    answer:
      'The report includes the tested scope, architecture observations, confirmed findings, rejected false positives, execution paths, severity, affected code, existing mitigations, recommended fixes and regression tests. Behavioral engagements also include sanitized request and response evidence.',
  },
  {
    question: 'Can you fix the vulnerabilities you find?',
    answer:
      'Yes. Remediation can be scoped after the audit or included in the Hardening and Verified Deployment engagement. Fixes may include canonical authorization middleware, role restrictions, tenant-scoped queries, RLS policies, private storage delivery and automated isolation tests.',
  },
  {
    question: 'Can you convert a single-user application into a multi-tenant SaaS?',
    answer:
      'Yes. The deployment service can add organizations, memberships, invitations, roles, organization switching, tenant-owned resources, storage isolation and regression testing. Scope depends on the existing data model and application workflows.',
  },
  {
    question: 'Is this a penetration test or compliance certification?',
    answer:
      'No. This is a specialized application-security and architecture review focused on tenant isolation. It does not replace a comprehensive penetration test, independent compliance examination or legal review.',
  },
  {
    question: 'How long does an audit take?',
    answer:
      'A focused review can often be completed within several business days after access and scope are ready. A behavioral audit or remediation engagement may require one to several weeks depending on route count, data models, storage systems and environment readiness.',
  },
  {
    question: 'Can agencies use this as a white-label service?',
    answer:
      'Yes. Agencies can request a white-label engagement, repeatable pre-delivery review or agency license when the TenantProof tooling becomes available. Client communication, report branding and remediation responsibilities are defined during scoping.',
  },
  {
    question: 'What happens if no serious vulnerability is found?',
    answer:
      'The report documents what was tested, which controls held, remaining limitations and the regression tests needed to preserve that result. The value is evidence about the tenant boundary, not a predetermined vulnerability count.',
  },
]

export function TenantAuditFAQ() {
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
      {FAQ_ITEMS.map((item, i) => (
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
