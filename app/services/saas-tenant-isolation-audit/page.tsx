import Link from 'next/link'
import Hero from '@/components/Hero'
import Section from '@/components/Section'
import { Button } from '@/components/ui/button'
import { FAQAccordion } from '@/components/tenant-audit/FAQAccordion'
import { TenantAuditForm } from '@/components/tenant-audit/TenantAuditForm'
import {
  ArrowRight, Shield, AlertTriangle, Users, Building2,
  Database, FileText, CheckCircle2, X,
  ArrowUpRight, KeyRound, FolderLock, Bot,
} from 'lucide-react'

export const metadata = {
  title: 'SaaS Tenant Isolation Audit & Deployment | Subodh KC',
  description:
    'Verify that one SaaS customer cannot access another\u2019s data. Tenant isolation audits, remediation and secure multi-tenant deployment for Next.js, Supabase, Prisma and PostgreSQL applications.',
  alternates: {
    canonical: 'https://subodhkc.com/services/saas-tenant-isolation-audit',
  },
  openGraph: {
    title: 'Can Customer A Access Customer B\u2019s Data?',
    description:
      'Tenant isolation audits and multi-tenant deployment for Next.js, Supabase, Prisma, PostgreSQL and AI-built SaaS applications.',
    url: 'https://subodhkc.com/services/saas-tenant-isolation-audit',
    type: 'website',
    images: [
      {
        url: '/services/saas-tenant-isolation-audit/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Can Customer A Access Customer B\u2019s Data? Tenant Isolation Audit',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SaaS Tenant Isolation Audit',
    description:
      'Find and fix cross-tenant access paths before customers, auditors or attackers do.',
    images: ['/services/saas-tenant-isolation-audit/opengraph-image'],
  },
  robots: {
    index: false,
    follow: false,
  },
}

const riskCards = [
  {
    icon: KeyRound,
    title: 'Organization ID tampering',
    copy: 'A user replaces a header, query parameter or request-body organization ID with another tenant\u2019s identifier.',
  },
  {
    icon: AlertTriangle,
    title: 'IDOR in API routes',
    copy: 'A route retrieves, updates or deletes a record by ID without also enforcing verified tenant ownership.',
  },
  {
    icon: Database,
    title: 'RLS gaps',
    copy: 'Supabase policies protect common reads but miss inserts, storage objects, service-role paths or security-definer functions.',
  },
  {
    icon: ArrowUpRight,
    title: 'Role escalation',
    copy: 'A viewer, member or administrator can grant themselves permissions or create a more privileged membership.',
  },
  {
    icon: FolderLock,
    title: 'Storage leakage',
    copy: 'Database rows are tenant-scoped while files, signed URLs, public buckets or deletion operations are not.',
  },
  {
    icon: Bot,
    title: 'AI-generated inconsistency',
    copy: 'Rapidly generated routes use different authorization patterns, leaving a small number of high-impact exceptions.',
  },
]

const audienceCards = [
  {
    icon: Bot,
    title: 'AI-built SaaS founders',
    copy: 'You used Lovable, Bolt, Replit, Cursor, Windsurf or another AI development workflow and now need independent verification before onboarding customers.',
  },
  {
    icon: Building2,
    title: 'B2B SaaS teams',
    copy: 'You are adding organizations, workspaces, invitations, roles, team billing or enterprise accounts.',
  },
  {
    icon: Users,
    title: 'Development agencies',
    copy: 'You need a repeatable, white-label tenant review before handing client applications into production.',
  },
  {
    icon: Shield,
    title: 'Regulated or sensitive applications',
    copy: 'You handle financial, legal, healthcare, employment, compliance or operational data where cross-customer exposure would be material.',
  },
]

const testCategories = [
  {
    heading: 'Authentication and organization context',
    items: [
      'Session and token handling',
      'Organization selection and switching',
      'Header, query, body and URL parameter substitution',
      'Stale organization context',
      'Missing organization context',
      'Deleted and inactive organizations',
      'Development authentication bypasses',
    ],
  },
  {
    heading: 'Membership and roles',
    items: [
      'Pending and inactive memberships',
      'Invitation acceptance',
      'Owner, admin, member and viewer boundaries',
      'Self-promotion',
      'Admin-to-owner escalation',
      'Custom permission overrides',
      'Last-owner protections',
      'Cross-organization memberships',
    ],
  },
  {
    heading: 'API and database access',
    items: [
      'Route authentication coverage',
      'Resource ownership checks',
      'IDOR testing',
      'Tenant-scoped create, read, update and delete operations',
      'Prisma query filters',
      'PostgreSQL constraints',
      'Supabase RLS policies where applicable',
      'Service-role and server-side bypass paths',
      'Background jobs, webhooks and administrative routes',
    ],
  },
  {
    heading: 'Storage isolation',
    items: [
      'Upload ownership',
      'Bucket and object policies',
      'Blob-path construction',
      'Public versus private access',
      'Signed URL behavior',
      'Download authorization',
      'Cross-tenant deletion',
      'Retention and archival operations',
    ],
  },
  {
    heading: 'Evidence and regression protection',
    items: [
      'Cross-tenant behavioral tests',
      'Sanitized request and response evidence',
      'Finding severity and execution path',
      'Required regression test',
      'CI-gate recommendation',
      'Re-test after remediation',
    ],
  },
]

const techList = [
  'Next.js App Router',
  'React and TypeScript',
  'Supabase Auth, PostgreSQL RLS and Supabase Storage',
  'Prisma and PostgreSQL',
  'Neon',
  'NextAuth / Auth.js',
  'Vercel and Vercel Blob',
  'Stripe organization or seat-based billing',
  'Lovable, Bolt, Replit, Cursor and Windsurf-generated applications',
]

const processSteps = [
  {
    num: '01',
    heading: 'Scope the tenant boundary',
    copy: 'We identify the authentication system, organization model, roles, tenant-owned resources, storage paths and highest-risk API surfaces.',
  },
  {
    num: '02',
    heading: 'Review the implementation',
    copy: 'I trace how organization context moves from the authenticated identity through middleware, API handlers, database queries, background operations and file access.',
  },
  {
    num: '03',
    heading: 'Attempt controlled cross-tenant access',
    copy: 'Using synthetic tenants in an approved environment, I attempt unauthorized reads, writes, deletes, role changes and storage access.',
  },
  {
    num: '04',
    heading: 'Deliver findings and next actions',
    copy: 'You receive confirmed execution paths, severity, affected code, remediation priorities and the tests required to prevent regression.',
  },
]

const deliverables = [
  'Tenant architecture map',
  'Inventory of protected and public routes',
  'Authorization-helper comparison',
  'Confirmed cross-tenant findings',
  'Rejected false positives',
  'Role-escalation analysis',
  'Storage-isolation analysis',
  'Database and RLS analysis',
  'Sanitized test evidence',
  'Prioritized remediation plan',
  'Executive summary for founders or clients',
  'Technical appendix for developers',
  'Optional post-fix verification report',
]

const comparisonRows = [
  { label: 'Existing application required', audit: 'Yes', remediation: 'Yes', deployment: 'Optional' },
  { label: 'Architecture review', audit: 'Included', remediation: 'Included', deployment: 'Included' },
  { label: 'Cross-tenant testing', audit: 'Included when staging fixtures are available', remediation: 'Included', deployment: 'Included' },
  { label: 'Findings report', audit: 'Included', remediation: 'Included', deployment: 'Included' },
  { label: 'Code changes', audit: 'Not included', remediation: 'Included within agreed scope', deployment: 'Full implementation' },
  { label: 'Organization and membership model', audit: 'Not included', remediation: 'Repairs and consolidation', deployment: 'Included' },
  { label: 'RBAC implementation', audit: 'Not included', remediation: 'Repairs included', deployment: 'Included' },
  { label: 'Storage isolation', audit: 'Reviewed', remediation: 'Repairs included', deployment: 'Included' },
  { label: 'CI regression gate', audit: 'Recommended', remediation: 'Included where technically feasible', deployment: 'Included' },
  { label: 'Re-test', audit: 'Optional', remediation: 'Included', deployment: 'Included' },
  {
    label: 'Best suited for',
    audit: 'Teams needing independent answers before deployment',
    remediation: 'Applications with confirmed or suspected authorization gaps',
    deployment: 'Single-user or prototype applications becoming B2B SaaS',
  },
]

const pricingPackages = [
  {
    name: 'Tenant Boundary Review',
    price: 'Starting at $950',
    description: 'A focused, read-only review for a small application or one critical workflow.',
    includes: [
      'Architecture and tenant-context review',
      'Up to 25 priority API routes',
      'Membership and role review',
      'One storage path review',
      'Written findings and remediation priorities',
      '45-minute findings walkthrough',
    ],
    cta: 'Request Scope Review',
    badge: null,
  },
  {
    name: 'Tenant Isolation Audit',
    price: 'Starting at $2,500',
    description: 'Behavioral verification across the application\u2019s principal tenant boundary.',
    includes: [
      'Two synthetic organizations',
      'Cross-tenant read, write and delete attempts',
      'IDOR and organization-context testing',
      'Role-escalation testing',
      'Storage-isolation testing',
      'Database or RLS review',
      'Sanitized evidence report',
      'Developer remediation plan',
      'Executive findings walkthrough',
    ],
    cta: 'Request Tenant Audit',
    badge: 'Recommended',
  },
  {
    name: 'Hardening and Verified Deployment',
    price: 'Starting at $5,000',
    description: 'Remediation or implementation of a secure organization-based multi-tenant foundation.',
    includes: [
      'Confirmed finding remediation',
      'Canonical tenant authorization helper',
      'Active membership enforcement',
      'Strict role and permission model',
      'Tenant-scoped database access',
      'Storage authorization',
      'Cross-tenant regression tests',
      'CI security gate',
      'Post-fix verification report',
      'Deployment handoff',
    ],
    cta: 'Discuss Deployment',
    badge: null,
  },
]

const engagementBoundaries = [
  'No destructive testing without approval',
  'No use of real customer data in demonstrations',
  'No credential extraction',
  'No social engineering',
  'No denial-of-service testing',
  'No compliance certification',
  'No legal opinion',
  'Findings are limited to the reviewed commit, configuration and environment',
  'Critical findings are communicated promptly rather than held until the final report',
]

const faqItems = [
  { question: 'What is a SaaS tenant isolation audit?', answer: 'A tenant isolation audit determines whether one customer, organization or workspace can access another tenant\u2019s records, files, administrative functions or billing context. It reviews authentication, organization membership, API authorization, database queries, role changes and storage access as one connected boundary.' },
  { question: 'Is authentication enough to protect a multi-tenant SaaS?', answer: 'No. Authentication establishes who the user is. Tenant authorization must also establish which organizations and resources that identity may access. A valid signed-in user can still exploit a route that trusts a supplied organization ID or retrieves a record without verifying ownership.' },
  { question: 'Do you audit Supabase Row-Level Security policies?', answer: 'Yes. A Supabase review can cover RLS policies for reads, inserts, updates and deletes; membership functions; service-role paths; storage policies; security-definer functions and the relationship between server-side routes and database enforcement.' },
  { question: 'Do you review Next.js and Prisma applications?', answer: 'Yes. The review traces authorization through Next.js middleware and route handlers into Prisma queries, PostgreSQL relationships, background operations and storage access. Special attention is given to resource queries that use an ID without a verified organization constraint.' },
  { question: 'Can you review an application built with Lovable, Bolt, Replit or AI coding tools?', answer: 'Yes. AI-built applications are a strong fit because individually generated routes may use inconsistent authorization patterns. The review evaluates the resulting implementation rather than judging which tool produced it.' },
  { question: 'Will you test my production database?', answer: 'The preferred approach is an isolated staging environment with synthetic tenants and data. Production testing requires explicit scope, backups, access controls and agreement on permitted actions. Destructive tests are excluded unless separately authorized.' },
  { question: 'What access do you need?', answer: 'A read-only repository review can begin with source access and architecture context. Behavioral verification normally requires a dedicated branch or commit, an isolated database, synthetic user accounts, staging deployment access and relevant logs. Credentials should be scoped to the minimum required permissions.' },
  { question: 'What does the final report include?', answer: 'The report includes the tested scope, architecture observations, confirmed findings, rejected false positives, execution paths, severity, affected code, existing mitigations, recommended fixes and regression tests. Behavioral engagements also include sanitized request and response evidence.' },
  { question: 'Can you fix the vulnerabilities you find?', answer: 'Yes. Remediation can be scoped after the audit or included in the Hardening and Verified Deployment engagement. Fixes may include canonical authorization middleware, role restrictions, tenant-scoped queries, RLS policies, private storage delivery and automated isolation tests.' },
  { question: 'Can you convert a single-user application into a multi-tenant SaaS?', answer: 'Yes. The deployment service can add organizations, memberships, invitations, roles, organization switching, tenant-owned resources, storage isolation and regression testing. Scope depends on the existing data model and application workflows.' },
  { question: 'Is this a penetration test or compliance certification?', answer: 'No. This is a specialized application-security and architecture review focused on tenant isolation. It does not replace a complete penetration test, independent compliance examination or legal review.' },
  { question: 'How long does an audit take?', answer: 'A focused review can often be completed within several business days after access and scope are ready. A behavioral audit or remediation engagement may require one to several weeks depending on route count, data models, storage systems and environment readiness.' },
  { question: 'Can agencies use this as a white-label service?', answer: 'Yes. Agencies can request a white-label engagement, repeatable pre-delivery review or agency license when the TenantProof tooling becomes available. Client communication, report branding and remediation responsibilities are defined during scoping.' },
  { question: 'What happens if no serious vulnerability is found?', answer: 'The report documents what was tested, which controls held, remaining limitations and the regression tests needed to preserve that result. The value is evidence about the tenant boundary, not a predetermined vulnerability count.' },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
}

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'SaaS Tenant Isolation Audit and Deployment',
  serviceType: 'Software security assessment and multi-tenant SaaS development',
  description:
    'Tenant isolation audits, remediation and secure multi-tenant deployment for Next.js, Supabase, Prisma, PostgreSQL and AI-built SaaS applications.',
  category: 'Application Security',
  provider: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
  areaServed: [{ '@type': 'Country', name: 'United States' }, { '@type': 'Place', name: 'Remote' }],
  audience: { '@type': 'BusinessAudience', name: 'B2B SaaS founders, development agencies, and regulated-data application teams' },
  url: 'https://subodhkc.com/services/saas-tenant-isolation-audit',
  offers: [
    { '@type': 'Offer', name: 'SaaS Security Review', price: '950', priceCurrency: 'USD', description: 'A focused review for a single application: authorization, API routes, membership, storage, and written findings.' },
  ],
}

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'SaaS Tenant Isolation Audit & Deployment',
  url: 'https://subodhkc.com/services/saas-tenant-isolation-audit',
  description:
    'Verify that one SaaS customer cannot access another\u2019s data. Tenant isolation audits, remediation and secure multi-tenant deployment for Next.js, Supabase, Prisma and PostgreSQL applications.',
  isPartOf: { '@type': 'WebSite', name: 'Subodh KC', url: 'https://subodhkc.com' },
  about: { '@type': 'Service', name: 'SaaS Tenant Isolation Audit and Deployment' },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://subodhkc.com/services' },
    { '@type': 'ListItem', position: 3, name: 'SaaS Tenant Isolation Audit', item: 'https://subodhkc.com/services/saas-tenant-isolation-audit' },
  ],
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Subodh KC',
  jobTitle: 'AI Systems Architect & Governance Expert',
  url: 'https://subodhkc.com',
  knowsAbout: [
    'Multi-tenant SaaS architecture',
    'Tenant isolation security',
    'Supabase Row-Level Security',
    'Next.js authorization',
    'Prisma and PostgreSQL',
    'Application security review',
  ],
  sameAs: [
    'https://github.com/subodhkc',
    'https://www.linkedin.com/in/subodhkc',
  ],
}

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export default function TenantIsolationAuditPage() {
  return (
    <>
      <JsonLd data={webPageJsonLd} />
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={personJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />

      {/* 1. HERO */}
      <Hero
        subtitle="TENANT ISOLATION AUDIT"
        title="Prove Customer A Cannot Access Customer B's Data"
        description="Your SaaS can look finished while still trusting the wrong organization ID, exposing an API route or returning another tenant's file. I test the tenant boundary across authentication, roles, database queries, APIs and storage, then show you exactly what passed, what failed and what must be fixed."
      >
        <a href="#request" data-track-click="tenant_audit_primary_cta">
          <Button size="lg" className="group">
            Request a Tenant Audit
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </a>
        <Link href="#deployment-cta" data-track-click="tenant_audit_deployment_cta">
          <Button size="lg" variant="outline">
            Discuss Multi-Tenant Deployment
          </Button>
        </Link>
        <p style={{ width: '100%', textAlign: 'center', marginTop: 8, fontSize: '0.85rem', color: 'var(--op-muted)' }}>
          For Next.js, Supabase, Prisma, PostgreSQL and AI-built B2B applications.
        </p>
        <p style={{ width: '100%', textAlign: 'center', fontSize: '0.8rem', color: 'var(--op-muted)' }}>
          Read-only review available. Production testing requires an approved staging environment and defined scope.
        </p>
      </Hero>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{ padding: '12px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <ol style={{ display: 'flex', gap: 8, listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', color: 'var(--op-muted)' }}>
          <li><Link href="/" style={{ color: 'var(--op-muted)', textDecoration: 'none' }}>Home</Link></li>
          <li>/</li>
          <li><Link href="/services" style={{ color: 'var(--op-muted)', textDecoration: 'none' }}>Services</Link></li>
          <li>/</li>
          <li style={{ color: 'var(--fg)' }}>SaaS Tenant Isolation Audit</li>
        </ol>
      </nav>

      {/* 2. RISK RECOGNITION */}
      <Section
        subtitle="Risk Recognition"
        title="Multi-tenancy usually fails in the gaps between systems"
        description="Authentication only proves who the user is. It does not prove which organization they may access. Cross-tenant exposure often appears when the application trusts a request parameter, checks a resource ID without its organization, accepts an inactive membership or protects the database but not file storage."
        sectionNum="01"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {riskCards.map((risk, i) => {
            const Icon = risk.icon
            return (
              <div
                key={i}
                style={{
                  padding: 24,
                  borderRadius: 12,
                  border: '1px solid var(--op-border)',
                  background: 'var(--op-card)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon style={{ width: 20, height: 20, color: '#ef4444' }} />
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--fg)', margin: 0 }}>{risk.title}</h3>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{risk.copy}</p>
              </div>
            )
          })}
        </div>
        <div
          style={{
            marginTop: 32,
            padding: '20px 24px',
            borderRadius: 12,
            border: '1px solid rgba(239, 68, 68, 0.2)',
            background: 'rgba(239, 68, 68, 0.05)',
          }}
        >
          <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--fg)', margin: 0 }}>
            The dangerous failure is not that every route is insecure. It is that one forgotten path can defeat an otherwise sound architecture.
          </p>
        </div>
      </Section>

      {/* 3. WHO THIS IS FOR */}
      <Section
        subtitle="Who This Is For"
        title="Built for teams crossing the line from prototype to real customer data"
        sectionNum="02"
        className="bg-secondary/20"
      >
        <div className="grid md:grid-cols-2 gap-6">
          {audienceCards.map((aud, i) => {
            const Icon = aud.icon
            return (
              <div
                key={i}
                style={{
                  padding: 24,
                  borderRadius: 12,
                  border: '1px solid var(--op-border)',
                  background: 'var(--op-card)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon style={{ width: 20, height: 20, color: 'var(--op-accent)' }} />
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--fg)', margin: 0 }}>{aud.title}</h3>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{aud.copy}</p>
              </div>
            )
          })}
        </div>
        <p style={{ marginTop: 24, fontSize: '0.9rem', color: 'var(--op-muted)', fontStyle: 'italic' }}>
          This is not intended for static marketing websites, single-user applications with no shared data model or teams seeking a broad infrastructure penetration test.
        </p>
      </Section>

      {/* 4. WHAT GETS TESTED */}
      <Section
        subtitle="What Gets Tested"
        title="The tenant boundary is tested as a system"
        sectionNum="03"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testCategories.map((cat, i) => (
            <div
              key={i}
              style={{
                padding: 24,
                borderRadius: 12,
                border: '1px solid var(--op-border)',
                background: 'var(--op-card)',
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--op-accent)', marginBottom: 16 }}>
                {cat.heading}
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {cat.items.map((item, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    <CheckCircle2 style={{ width: 16, height: 16, color: 'var(--op-accent)', flexShrink: 0, marginTop: 2 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* 5. TECHNOLOGY COVERAGE */}
      <Section
        subtitle="Technology Coverage"
        title="Focused on modern SaaS stacks"
        sectionNum="04"
        className="bg-secondary/20"
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {techList.map((tech, i) => (
            <span
              key={i}
              style={{
                padding: '8px 16px',
                borderRadius: 999,
                border: '1px solid var(--op-border)',
                background: 'var(--op-card)',
                fontSize: '0.88rem',
                fontWeight: 500,
                color: 'var(--fg)',
              }}
            >
              {tech}
            </span>
          ))}
        </div>
        <p style={{ marginTop: 24, fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: 700 }}>
          If your stack differs, request a fit review. The engagement depends on whether the tenant boundary can be safely reproduced and tested in an isolated environment.
        </p>
      </Section>

      {/* 6. AUDIT PROCESS */}
      <Section
        subtitle="Audit Process"
        title="A narrow process designed to produce actionable evidence"
        sectionNum="05"
      >
        <div className="grid md:grid-cols-2 gap-6">
          {processSteps.map((step, i) => (
            <div
              key={i}
              style={{
                padding: 24,
                borderRadius: 12,
                border: '1px solid var(--op-border)',
                background: 'var(--op-card)',
                display: 'flex',
                gap: 16,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--op-accent)',
                  flexShrink: 0,
                }}
              >
                {step.num}
              </span>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--fg)', marginBottom: 8 }}>{step.heading}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{step.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 7. DELIVERABLES */}
      <Section
        subtitle="Deliverables"
        title="What you receive"
        sectionNum="06"
        className="bg-secondary/20"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deliverables.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.4,
              }}
            >
              <FileText style={{ width: 16, height: 16, color: 'var(--op-accent)', flexShrink: 0, marginTop: 2 }} />
              <span>{item}</span>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 24, fontSize: '0.85rem', color: 'var(--op-muted)', fontStyle: 'italic' }}>
          Reports document the tested scope and observed behavior. They are not certifications, legal opinions or guarantees that no vulnerability exists outside the reviewed scope.
        </p>
      </Section>

      {/* 8. AUDIT VERSUS DEPLOYMENT COMPARISON */}
      <Section
        subtitle="Audit Versus Deployment"
        title="Choose verification, remediation or a complete tenant foundation"
        sectionNum="07"
      >
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.88rem',
              border: '1px solid var(--op-border)',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <thead>
              <tr style={{ background: 'var(--op-card)' }}>
                <th style={{ textAlign: 'left', padding: '14px 16px', fontWeight: 700, color: 'var(--fg)', borderBottom: '2px solid var(--op-border)' }}></th>
                <th style={{ textAlign: 'center', padding: '14px 16px', fontWeight: 700, color: 'var(--fg)', borderBottom: '2px solid var(--op-border)' }}>Tenant Isolation Audit</th>
                <th style={{ textAlign: 'center', padding: '14px 16px', fontWeight: 700, color: 'var(--fg)', borderBottom: '2px solid var(--op-border)' }}>Audit and Remediation</th>
                <th style={{ textAlign: 'center', padding: '14px 16px', fontWeight: 700, color: 'var(--fg)', borderBottom: '2px solid var(--op-border)' }}>Multi-Tenant Deployment</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--op-border)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--fg)' }}>{row.label}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-secondary)' }}>{row.audit}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-secondary)' }}>{row.remediation}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-secondary)' }}>{row.deployment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 9. PRICING */}
      <Section
        subtitle="Pricing"
        title="Clear starting points"
        sectionNum="08"
        className="bg-secondary/20"
      >
        <p style={{ fontSize: '0.88rem', color: 'var(--op-muted)', marginBottom: 24, fontStyle: 'italic' }}>
          Final pricing depends on route count, number of tenant-owned resource types, storage systems, authentication complexity and whether a safe staging environment already exists.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {pricingPackages.map((pkg, i) => (
            <div
              key={i}
              style={{
                padding: 28,
                borderRadius: 16,
                border: pkg.badge ? '2px solid var(--op-accent)' : '1px solid var(--op-border)',
                background: 'var(--op-card)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {pkg.badge && (
                <span
                  style={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '4px 14px',
                    borderRadius: 999,
                    background: 'var(--op-accent)',
                    color: 'var(--bg)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {pkg.badge}
                </span>
              )}
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--fg)', marginBottom: 8 }}>{pkg.name}</h3>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--op-accent)', marginBottom: 12 }}>{pkg.price}</p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 20 }}>{pkg.description}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                {pkg.includes.map((item, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    <CheckCircle2 style={{ width: 15, height: 15, color: 'var(--op-accent)', flexShrink: 0, marginTop: 2 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a href="#request" data-track-click="tenant_audit_pricing_cta">
                <Button style={{ width: '100%' }} variant={pkg.badge ? 'default' : 'outline'}>
                  {pkg.cta}
                </Button>
              </a>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 24, fontSize: '0.85rem', color: 'var(--op-muted)' }}>
          Agency, white-label, regulated-data and larger application engagements are custom scoped.
        </p>
      </Section>

      {/* 10. WHY SUBODH */}
      <Section
        subtitle="Why Subodh"
        title="Built from implementation experience, not a generic checklist"
        sectionNum="09"
      >
        <div style={{ maxWidth: 760 }}>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>
            I am a former HP Inc. software and AI program leader who now builds and reviews AI, compliance and operational systems. My work spans application architecture, authorization, evidence generation, testing and production delivery.
          </p>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>
            This service comes from the expensive part of building multi-tenant products: tracing organization ownership across hundreds of routes, resolving inconsistent authorization patterns and converting security assumptions into executable tests.
          </p>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            The objective is not to produce a long list of theoretical concerns. It is to determine which paths are reachable, which controls actually hold and what must change before customer data is placed behind them.
          </p>
        </div>
        <div style={{ marginTop: 24, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link href="/about" style={{ color: 'var(--op-accent)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            About Subodh KC <ArrowRight style={{ width: 14, height: 14 }} />
          </Link>
          <Link href="/services" style={{ color: 'var(--op-accent)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            All Services <ArrowRight style={{ width: 14, height: 14 }} />
          </Link>
        </div>
      </Section>

      {/* 11. LIMITATIONS AND ENGAGEMENT BOUNDARIES */}
      <Section
        subtitle="Engagement Boundaries"
        title="Safe testing boundaries"
        sectionNum="10"
        className="bg-secondary/20"
      >
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20, maxWidth: 760 }}>
          Testing is performed against source code and an approved staging, test or isolated environment. Production testing is only performed under explicit written scope and safeguards.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {engagementBoundaries.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                fontSize: '0.88rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.4,
              }}
            >
              <X style={{ width: 16, height: 16, color: '#ef4444', flexShrink: 0, marginTop: 2 }} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* 12. FAQ */}
      <Section
        subtitle="FAQ"
        title="Tenant isolation audit FAQ"
        sectionNum="11"
      >
        <div style={{ maxWidth: 800 }}>
          <FAQAccordion items={faqItems} />
        </div>
      </Section>

      {/* 13. FINAL CTA + FORM */}
      <Section
        subtitle="Request an Audit"
        title="Before onboarding the next customer, test the boundary between them"
        description="Send the stack, approximate API-route count, authentication system and whether a staging environment exists. I will confirm whether the application fits a focused review, behavioral audit or full multi-tenant deployment."
        sectionNum="12"
        className="bg-secondary/20"
        id="request"
      >
        <div style={{ maxWidth: 640, marginBottom: 40 }}>
          <TenantAuditForm />
        </div>
        <div id="deployment-cta" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <a href="mailto:admin@subodhkc.com?subject=Tenant%20Isolation%20Audit" data-track-click="tenant_audit_primary_cta">
            <Button size="lg" className="group">
              Request a Tenant Audit
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </a>
          <a href="mailto:admin@subodhkc.com?subject=Multi-Tenant%20Deployment">
            <Button size="lg" variant="outline">
              Email Subodh
            </Button>
          </a>
        </div>
      </Section>

      {/* 14. RELATED RESOURCES */}
      <Section
        subtitle="Related Resources"
        title="Related technical guidance"
        sectionNum="13"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/saas-security-review"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderRadius: 12,
              border: '1px solid var(--op-border)',
              background: 'var(--op-card)',
              textDecoration: 'none',
              color: 'var(--fg)',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            SaaS Security Review (Tenant Isolation + AI Security)
            <ArrowRight style={{ width: 16, height: 16, color: 'var(--op-accent)' }} />
          </Link>
          <Link
            href="/services"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderRadius: 12,
              border: '1px solid var(--op-border)',
              background: 'var(--op-card)',
              textDecoration: 'none',
              color: 'var(--fg)',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            AI Architecture, Deployment & Governance Services
            <ArrowRight style={{ width: 16, height: 16, color: 'var(--op-accent)' }} />
          </Link>
          <Link
            href="/solutions/frontofai"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderRadius: 12,
              border: '1px solid var(--op-border)',
              background: 'var(--op-card)',
              textDecoration: 'none',
              color: 'var(--fg)',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            FrontOfAI - Enterprise AI Solutions
            <ArrowRight style={{ width: 16, height: 16, color: 'var(--op-accent)' }} />
          </Link>
          <Link
            href="/products/llmverify"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderRadius: 12,
              border: '1px solid var(--op-border)',
              background: 'var(--op-card)',
              textDecoration: 'none',
              color: 'var(--fg)',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            LLMVerify - LLM Output Validation
            <ArrowRight style={{ width: 16, height: 16, color: 'var(--op-accent)' }} />
          </Link>
          <Link
            href="/contact"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderRadius: 12,
              border: '1px solid var(--op-border)',
              background: 'var(--op-card)',
              textDecoration: 'none',
              color: 'var(--fg)',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            Contact Subodh KC
            <ArrowRight style={{ width: 16, height: 16, color: 'var(--op-accent)' }} />
          </Link>
        </div>
        <p style={{ marginTop: 20, fontSize: '0.85rem', color: 'var(--op-muted)' }}>
          Last reviewed: August 2026
        </p>
      </Section>
    </>
  )
}
