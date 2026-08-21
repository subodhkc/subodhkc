import Link from 'next/link'
import Hero from '@/components/Hero'
import Section from '@/components/Section'
import { Button } from '@/components/ui/button'
import { FAQAccordion } from '@/components/tenant-audit/FAQAccordion'
import { TenantAuditForm } from '@/components/tenant-audit/TenantAuditForm'
import {
  ArrowRight, Shield, Building2, Lock, Database, FileText,
  CheckCircle2, Bot, KeyRound, FolderLock, Zap, Scale,
  TrendingUp, Users, Eye, Bug, Cpu, Hash, ClipboardCheck,
  RefreshCw, FileCheck, AlertCircle,
} from 'lucide-react'

export const metadata = {
  title: 'SaaS Security Review | Tenant Isolation & AI Application Security | Subodh KC',
  description:
    'Evidence-backed security review for SaaS and AI products. Tenant isolation testing, authorization review, API security, AI/RAG controls, and enterprise-readiness evidence you can share with customers.',
  alternates: {
    canonical: 'https://subodhkc.com/saas-security-review',
  },
  openGraph: {
    title: 'SaaS Security Review | Tenant Isolation & AI Application Security',
    description:
      'Evidence-backed security review for SaaS and AI products. Review tenant isolation, authorization, APIs, AI data flows and key security controls. Prioritized findings, remediation guidance, and evidence for customer security reviews.',
    url: 'https://subodhkc.com/saas-security-review',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SaaS Security Review | Tenant Isolation & AI App Security',
    description: 'Evidence-backed security review for SaaS and AI products. Tenant isolation, authorization, AI controls, and enterprise-readiness evidence.',
  },
  keywords: [
    'SaaS security audit',
    'SaaS security review',
    'SaaS security assessment',
    'application security assessment',
    'multi-tenant SaaS security',
    'tenant isolation testing',
    'tenant isolation security',
    'AI application security',
    'AI security assessment',
    'API authorization testing',
    'SOC 2 readiness for SaaS',
    'enterprise security readiness',
    'AI SaaS security',
    'SaaS security questionnaire',
    'RAG tenant isolation',
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'SaaS Security Review', item: 'https://subodhkc.com/saas-security-review' },
  ],
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'SaaS & AI Security Review',
  description:
    'Evidence-backed security review for SaaS and AI products. Tenant isolation testing, authorization review, API security, AI/RAG controls, and enterprise-readiness evidence.',
  url: 'https://subodhkc.com/saas-security-review',
  provider: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
  serviceType: 'Application Security Assessment',
  category: 'Application Security',
  areaServed: [{ '@type': 'Country', name: 'United States' }, { '@type': 'Place', name: 'Remote' }],
  audience: {
    '@type': 'BusinessAudience',
    name: 'SaaS founders, AI product teams, B2B startups preparing for enterprise customers',
  },
  offers: {
    '@type': 'Offer',
    name: 'SaaS & AI Security Review',
    description: 'Evidence-backed security review for SaaS and AI products. Focused, multi-tenant, and AI/RAG reviews scoped based on architecture.',
  },
}

const faqItems = [
  {
    question: 'What is a SaaS security review?',
    answer: 'A SaaS security review evaluates your application security boundaries: tenant isolation, authentication, authorization, API routes, storage, and AI-specific controls. You receive prioritized findings, remediation guidance, and evidence you can share during customer security reviews and procurement.',
  },
  {
    question: 'How is this different from a penetration test?',
    answer: 'This is a specialized application-security and architecture review focused on tenant isolation, authorization boundaries, and AI-specific attack surfaces. It does not replace a comprehensive network penetration test or compliance certification. It complements them by covering areas traditional pentesting does not: cross-tenant access, RAG authorization, prompt injection, and AI tool abuse.',
  },
  {
    question: 'Do you test Supabase Row-Level Security policies?',
    answer: 'Yes. A Supabase review covers RLS policies for reads, inserts, updates, and deletes; membership functions; service-role paths; storage policies; security-definer functions; and the relationship between server-side routes and database enforcement.',
  },
  {
    question: 'Can you review AI/RAG/agent features?',
    answer: 'Yes. When AI functionality exists, the review covers prompt injection resilience, RAG authorization and cross-tenant retrieval, tool/function authorization, agent privilege boundaries, model/API credential protection, output validation, and AI supply-chain dependencies.',
  },
  {
    question: 'What evidence do I receive?',
    answer: 'Every material finding traces through TEST, FINDING, EVIDENCE, CONTROL/FRAMEWORK REFERENCE, REMEDIATION, and RETEST. Evidence includes finding IDs, rule IDs, run IDs, timestamps, application version, environment, SHA-256 evidence hashes (via ISAF), sanitized test evidence, and control references.',
  },
  {
    question: 'Do you offer retesting after remediation?',
    answer: 'Yes. Retesting is a core part of the workflow. Each finding moves through: Finding Identified, Remediation In Progress, Ready For Retest, Retest Verified (or Additional Work Recommended, or Risk Accepted by Client). A final Remediation Verification Summary is provided.',
  },
  {
    question: 'Is this a SOC 2 certification?',
    answer: 'No. This review helps you identify application-security and evidence gaps that may affect SOC 2 readiness. It produces technical evidence and control documentation that supports your SOC 2 readiness process, but it is not a SOC 2 audit or certification.',
  },
  {
    question: 'What stacks do you review?',
    answer: 'Next.js App Router, React/TypeScript, Supabase Auth and RLS, PostgreSQL, Prisma, Neon, NextAuth/Auth.js, Vercel, Stripe billing, and AI-built applications from Lovable, Bolt, Replit, Cursor, and Windsurf. If your stack differs, request a fit review.',
  },
  {
    question: 'How long does a review take?',
    answer: 'A focused review can be completed within several business days after access and scope are ready. A multi-tenant or AI application review may require one to several weeks depending on route count, data models, storage systems, AI complexity, and environment readiness.',
  },
  {
    question: 'What access do you need?',
    answer: 'A read-only repository review can begin with source access and architecture context. Behavioral verification normally requires a dedicated branch, an isolated database, synthetic user accounts, staging deployment access, and relevant logs. Credentials should be scoped to the minimum required permissions.',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
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

const buyingTriggers = [
  { icon: Building2, title: 'Preparing for your first enterprise customer', desc: 'Security questionnaires and procurement reviews are coming. Know where you stand before they ask.' },
  { icon: Users, title: 'Moving from single-tenant to multi-tenant', desc: 'Adding organizations, roles, and customer boundaries introduces new attack surfaces.' },
  { icon: Bot, title: 'Launching an AI, RAG, or agent feature', desc: 'AI introduces prompt injection, cross-tenant retrieval, and tool abuse vectors traditional security misses.' },
  { icon: Scale, title: 'Preparing for SOC 2 readiness', desc: 'Identify application-security and evidence gaps before your audit engagement.' },
  { icon: FileText, title: 'Responding to a customer security questionnaire', desc: 'Get structured answers and evidence instead of guessing or stalling.' },
  { icon: TrendingUp, title: 'Strengthening security before scaling', desc: 'Fix the boundary between customers before more data sits behind it.' },
]

const reviewAreas = [
  { icon: KeyRound, title: 'Authentication & Authorization', desc: 'Session handling, organization context, role enforcement, RBAC boundaries, invitation and membership operations.' },
  { icon: Database, title: 'Database & RLS', desc: 'Row-level security policies, tenant-scoped queries, service-role bypass paths, security-definer functions.' },
  { icon: Shield, title: 'API Authorization', desc: 'Route authentication coverage, IDOR testing, resource ownership checks, tenant-scoped CRUD operations.' },
  { icon: FolderLock, title: 'Storage & File Isolation', desc: 'Upload ownership, bucket policies, signed URL behavior, cross-tenant deletion, public vs private access.' },
  { icon: RefreshCw, title: 'Background Jobs & Queues', desc: 'Tenant context preservation in async jobs, webhooks, queues, and scheduled tasks.' },
  { icon: Eye, title: 'Realtime & Subscriptions', desc: 'Subscription isolation, channel scoping, cache and search tenant boundaries.' },
  { icon: FileText, title: 'Exports & Reporting', desc: 'Export authorization, report scoping, analytics tenant safety.' },
  { icon: Lock, title: 'Admin & Support Routes', desc: 'Administrative capability controls, support access boundaries, secrets and service credential scoping.' },
]

const tenantIsolationTests = [
  { label: 'Tenant A to Tenant B database objects', status: 'Tested' },
  { label: 'Tenant A to Tenant B API objects', status: 'Tested' },
  { label: 'Tenant A to Tenant B storage and files', status: 'Tested' },
  { label: 'Tenant A to Tenant B exports', status: 'Tested' },
  { label: 'Organization ID manipulation', status: 'Tested' },
  { label: 'Object-level authorization (IDOR)', status: 'Tested' },
  { label: 'RBAC boundary enforcement', status: 'Tested' },
  { label: 'Member and invitation operations', status: 'Tested' },
  { label: 'Admin and support route access', status: 'Tested' },
  { label: 'Background job tenant context', status: 'Tested' },
  { label: 'Realtime subscription isolation', status: 'Tested' },
  { label: 'Cache and search tenant boundaries', status: 'Tested where implemented' },
  { label: 'RAG/vector retrieval isolation', status: 'Tested when AI features present' },
  { label: 'AI conversation and context isolation', status: 'Tested when AI features present' },
]

const boundaryStatuses = [
  { label: 'Verified as designed', desc: 'The boundary holds under testing. Evidence documents what was tested and how it held.', color: 'text-green-500' },
  { label: 'Improvement identified', desc: 'The boundary has a gap or weakness. Findings include severity, affected component, and remediation.', color: 'text-amber-500' },
  { label: 'Requires additional evidence', desc: 'The boundary could not be fully verified. Additional validation is recommended.', color: 'text-blue-500' },
  { label: 'Not applicable', desc: 'The boundary does not apply to the current architecture or scope.', color: 'text-muted-foreground' },
]

const aiSecurityAreas = [
  { icon: Bug, title: 'Prompt Injection Resilience', desc: 'Direct, indirect, and MCP-tool-description injection vectors. System prompt integrity and user input sanitization.' },
  { icon: Lock, title: 'RAG Authorization', desc: 'Cross-tenant retrieval testing. Vector search isolation. Document ingestion security. Embedding pipeline review.' },
  { icon: Zap, title: 'Tool/Function Authorization', desc: 'Agent tool access against least privilege. Missing approval workflows. Automatic execution risks. MCP server security.' },
  { icon: Eye, title: 'Sensitive Data Exposure', desc: 'What data is sent to AI providers. Model/API credential protection. Output validation before business actions.' },
  { icon: Shield, title: 'Agent Privilege Boundaries', desc: 'Instruction hierarchy. System-prompt exposure. Fallback behavior when AI cannot complete a request confidently.' },
  { icon: FileText, title: 'AI Inventory & Supply Chain', desc: 'AI component inventory. Third-party model/provider review. AI dependency audit. Vendor checks.' },
]

const deliverables = [
  { icon: FileText, title: 'Scope Manifest', desc: 'Written scope defining routes, roles, storage, AI components, test accounts, environment, methodology version, and review boundaries. Agreed before the review begins.' },
  { icon: FileText, title: 'Executive Security Review', desc: 'Review objective, architecture/scope summary, key assurance observations, priority improvements, tenant-isolation summary, AI-security summary, enterprise-readiness observations, SOC 2 readiness observations, recommended next actions.' },
  { icon: Bug, title: 'Technical Findings', desc: 'Each finding includes: finding ID, title, severity/priority, affected component, description, business/security relevance, testing/reproduction, evidence, control/framework references, recommended remediation, retest status.' },
  { icon: ClipboardCheck, title: 'Coverage Matrix', desc: 'Transparent coverage showing REVIEWED, VERIFIED, IMPROVEMENT IDENTIFIED, ADDITIONAL VALIDATION RECOMMENDED, NOT APPLICABLE, or OUTSIDE CURRENT REVIEW SCOPE for each area.' },
  { icon: Building2, title: 'Tenant Isolation Matrix', desc: 'Where applicable: each boundary tested, status, evidence reference, and remediation status.' },
  { icon: Bot, title: 'AI Security Matrix', desc: 'Where AI features exist: each AI attack vector tested, status, evidence reference, and remediation status.' },
  { icon: Scale, title: 'Control / Framework Crosswalk', desc: 'Findings mapped to OWASP LLM, OWASP AppSec, NIST AI RMF, NIST cybersecurity, ISO 42001, ISO 27001, SOC 2, EU AI Act, and state-level AI regulations where applicable.' },
  { icon: Hash, title: 'Evidence Manifest', desc: 'Finding IDs, rule IDs, run IDs, timestamps, application version/commit, environment, SHA-256 evidence hashes via ISAF, sanitized test evidence, and control references.' },
  { icon: RefreshCw, title: 'Retest Record', desc: 'After remediation: each finding retested with status (Verified, Additional Work Recommended, or Risk Accepted by Client). Final Remediation Verification Summary.' },
  { icon: FileCheck, title: 'Security Review Record', desc: 'A consolidated record of the review: scope, methodology, findings, coverage, evidence references, remediation status, and verification outcomes. Suitable for internal governance and audit trail.' },
  { icon: FileCheck, title: 'Buyer-Shareable Summary', desc: 'A sanitized executive summary suitable for sharing with prospective customers. Confirms a scoped review occurred without exposing confidential technical findings.' },
]

const evidenceFlow = [
  { label: 'TEST', desc: 'Controlled test executed against the application boundary' },
  { label: 'FINDING', desc: 'Result classified with severity and affected component' },
  { label: 'CONTROL', desc: 'Related security control identified' },
  { label: 'EVIDENCE', desc: 'SHA-256 hash chain via ISAF, sanitized test artifacts' },
  { label: 'FRAMEWORK', desc: 'Cross-referenced to OWASP, NIST, ISO, SOC 2, EU AI Act' },
  { label: 'REMEDIATION', desc: 'Prioritized fix with code-level guidance' },
  { label: 'RETEST', desc: 'Verification that the fix holds under the same test' },
]

const processSteps = [
  { num: '01', title: 'Fit / Scope Call', desc: '20 to 30 minutes. We discuss your architecture, stack, tenant model, AI features, customer requirements, and timeline.' },
  { num: '02', title: 'Scope Defined', desc: 'Written scope: routes, roles, storage, AI components, test accounts, environment, and methodology version.' },
  { num: '03', title: 'Access & Test Accounts', desc: 'Repository access, staging environment, synthetic tenant accounts, and relevant credentials scoped to minimum required permissions.' },
  { num: '04', title: 'Security Review', desc: 'Static analysis, architecture review, and adversarial testing across the defined scope using a tested methodology.' },
  { num: '05', title: 'Evidence-Backed Findings', desc: 'Each finding traced through test, evidence, control reference, and remediation. Evidence fingerprinted via ISAF SHA-256 hash chains.' },
  { num: '06', title: 'Remediation Discussion', desc: 'Walkthrough of findings, priorities, and remediation approach. Technical appendix for developers.' },
  { num: '07', title: 'Retest', desc: 'After remediation: each finding retested. Status moves to Verified, Additional Work Recommended, or Risk Accepted by Client.' },
  { num: '08', title: 'Final Review + Verification Summary', desc: 'Executive review, coverage matrix, evidence manifest, buyer-shareable summary, and remediation verification.' },
]

const pricingAnchor = {
  name: 'Focused SaaS Security Review',
  price: 'from $950',
  description: 'A focused review for a single application: authorization, API routes, membership, storage, and written findings. The right starting point for most SaaS and AI products.',
  includes: [
    'Architecture and authorization review',
    'Priority API routes and membership review',
    'Storage and file isolation review',
    'Written findings and remediation priorities',
    'Findings walkthrough call',
  ],
  cta: 'Request Scope Review',
}

const pricingScopeNote = 'Multi-tenant, AI/RAG, and broader application reviews are scoped based on architecture and review surface. Remediation and retest are scoped from findings. You will know the scope and price before the review begins.'

const questionsAnswered = [
  { category: 'Tenant Boundaries', questions: [
    'How is each customer\'s data separated?',
    'Are tenant boundaries enforced server-side?',
    'Can users access only the organizations and objects they are authorized to use?',
  ]},
  { category: 'Authentication & Authorization', questions: [
    'How do authentication and authorization work together?',
    'Are API routes enforcing the same boundaries as the application?',
    'Are role changes and invitations protected?',
  ]},
  { category: 'Storage & Infrastructure', questions: [
    'Are storage and files correctly scoped?',
    'Are exports and reports tenant-safe?',
    'Do background jobs preserve organization context?',
    'Do realtime subscriptions stay inside the correct tenant?',
  ]},
  { category: 'AI Security (when applicable)', questions: [
    'Can retrieval return data from another tenant?',
    'Are AI tools and functions constrained by the user\'s actual authorization?',
    'What data is sent to AI providers?',
    'Are model/API credentials appropriately protected?',
    'How are AI outputs validated before business actions occur?',
    'What happens when AI cannot complete a request confidently?',
  ]},
  { category: 'Enterprise Readiness', questions: [
    'What evidence can be shown to a prospective enterprise customer?',
    'What should be strengthened before customer security review or procurement?',
    'Which controls already have usable evidence?',
    'What is the most valuable next security improvement?',
  ]},
]

const soc2Points = [
  'Identify application-security and evidence gaps that may affect SOC 2 readiness',
  'Map findings to SOC 2 security, availability, and confidentiality control considerations',
  'Generate technical evidence and control documentation for your SOC 2 readiness process',
  'Prioritize remediation to address the highest-impact gaps first',
  'Retest after remediation to verify fixes hold',
]

const frameworkList = [
  { name: 'OWASP LLM / GenAI', type: 'Security guidance' },
  { name: 'OWASP Application Security', type: 'Security guidance' },
  { name: 'NIST AI RMF', type: 'Risk management' },
  { name: 'NIST Cybersecurity', type: 'Security guidance' },
  { name: 'ISO/IEC 42001', type: 'AI management system' },
  { name: 'ISO/IEC 27001', type: 'Information security' },
  { name: 'SOC 2', type: 'Readiness evidence' },
  { name: 'EU AI Act', type: 'Regulatory compliance' },
  { name: 'Colorado AI Act', type: 'Regulatory compliance' },
  { name: 'NYC LL144', type: 'Bias audit' },
  { name: 'Texas TRAIGA', type: 'Regulatory compliance' },
]

export default function SaaSSecurityReviewPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqJsonLd} />

      {/* 1. HERO */}
      <Hero
        subtitle="SaaS & AI Security Review"
        title={
          <>
            Build buyer confidence into your SaaS security.
          </>
        }
        description="Review tenant isolation, authorization, APIs, AI data flows and key security controls. Then receive prioritized findings, remediation guidance and evidence you can use during customer security reviews."
      >
        <div className="flex flex-wrap gap-4 justify-center">
          <a href="#request" data-track-click="saas_security_primary_cta">
            <Button size="lg" className="group animate-glow">
              Review My SaaS Security
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </a>
          <a href="#what-we-review" data-track-click="saas_security_secondary_cta">
            <Button size="lg" variant="outline">
              See What We Review
            </Button>
          </a>
        </div>
        <p style={{ width: '100%', textAlign: 'center', marginTop: 8, fontSize: '0.85rem', color: 'var(--op-muted)' }}>
          For Next.js, Supabase, Prisma, PostgreSQL and AI-built B2B SaaS applications.
        </p>
      </Hero>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{ padding: '12px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <ol style={{ display: 'flex', gap: 8, listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', color: 'var(--op-muted)' }}>
          <li><Link href="/" style={{ color: 'var(--op-muted)', textDecoration: 'none' }}>Home</Link></li>
          <li>/</li>
          <li style={{ color: 'var(--fg)' }}>SaaS Security Review</li>
        </ol>
      </nav>

      {/* 2. WHY FOUNDERS BUY THIS */}
      <Section
        subtitle="Why Founders Choose This"
        title="Know what your next serious customer will want to understand"
        sectionNum="01"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buyingTriggers.map((trigger, i) => {
            const Icon = trigger.icon
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
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--fg)', margin: 0 }}>{trigger.title}</h3>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{trigger.desc}</p>
              </div>
            )
          })}
        </div>
      </Section>

      {/* 3. WHAT WE REVIEW */}
      <Section
        id="what-we-review"
        subtitle="What We Review"
        title="The security boundary is tested as a connected system"
        description="Authentication, authorization, API routes, database queries, storage, background jobs, realtime, exports, and AI-specific controls are reviewed together, not in isolation."
        sectionNum="02"
        className="bg-secondary/20"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviewAreas.map((area, i) => {
            const Icon = area.icon
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
                <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <Icon style={{ width: 20, height: 20, color: 'var(--op-accent)' }} />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--fg)', marginBottom: 8 }}>{area.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{area.desc}</p>
              </div>
            )
          })}
        </div>
      </Section>

      {/* 4. TENANT ISOLATION */}
      <Section
        subtitle="Tenant Isolation"
        title="A major differentiator in the review"
        description="Tenant isolation is tested as a system. Each boundary is documented with a constructive status so you and your customers immediately understand what was reviewed."
        sectionNum="03"
      >
        <div className="grid md:grid-cols-2 gap-8">
          {/* What is tested */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--fg)', marginBottom: 16 }}>What is tested</h3>
            <div className="space-y-2">
              {tenantIsolationTests.map((test, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  <CheckCircle2 style={{ width: 16, height: 16, color: 'var(--op-accent)', flexShrink: 0, marginTop: 2 }} />
                  <span>{test.label}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Boundary statuses */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--fg)', marginBottom: 16 }}>How each boundary is documented</h3>
            <div className="space-y-3">
              {boundaryStatuses.map((status, i) => (
                <div
                  key={i}
                  style={{
                    padding: 16,
                    borderRadius: 10,
                    border: '1px solid var(--op-border)',
                    background: 'var(--op-card)',
                  }}
                >
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--fg)', margin: 0, marginBottom: 4 }}>
                    <span className={status.color}>{status.label}</span>
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>{status.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ marginTop: 24 }}>
          <Link
            href="/ai-security-compliance"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--op-accent)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            See AI Security & Compliance Review <ArrowRight style={{ width: 14, height: 14 }} />
          </Link>
        </div>
      </Section>

      {/* 5. AI APPLICATION SECURITY */}
      <Section
        subtitle="AI Application Security"
        title="When AI features exist, the attack surface expands"
        description="Static AI security analysis, runtime adversarial testing, and documentation suitable for audits. Covers prompt injection, RAG authorization, tool abuse, agent privilege boundaries, and AI supply-chain review."
        sectionNum="04"
        className="bg-secondary/20"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiSecurityAreas.map((area, i) => {
            const Icon = area.icon
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
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(168, 85, 247, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon style={{ width: 20, height: 20, color: '#a855f7' }} />
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--fg)', margin: 0 }}>{area.title}</h3>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{area.desc}</p>
              </div>
            )
          })}
        </div>
        <div style={{ marginTop: 24, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link href="/solutions/haiec/exposure-assessment" style={{ color: 'var(--op-accent)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            HAIEC Exposure Assessment <ArrowRight style={{ width: 14, height: 14 }} />
          </Link>
          <Link href="/ai-security-tools" style={{ color: 'var(--op-accent)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            Free AI Security Tools <ArrowRight style={{ width: 14, height: 14 }} />
          </Link>
        </div>
      </Section>

      {/* 6. WHAT YOU RECEIVE */}
      <Section
        subtitle="Deliverables"
        title="A professional package you can use with customers"
        sectionNum="05"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deliverables.map((item, i) => {
            const Icon = item.icon
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
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                  <Icon style={{ width: 20, height: 20, color: 'var(--op-accent)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--fg)', margin: 0, marginBottom: 6 }}>{item.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      {/* 7. EVIDENCE & VERIFICATION */}
      <Section
        subtitle="Evidence & Verification"
        title="TEST to VERIFICATION: every finding traces through the full chain"
        description="Every finding traces through the full chain from test to verification. You can see what was evaluated, why a finding matters, what control it relates to, how it was addressed, and what evidence supports the record."
        sectionNum="06"
        className="bg-secondary/20"
      >
        {/* Evidence flow */}
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {evidenceFlow.map((step, i) => (
              <div
                key={i}
                style={{
                  padding: 16,
                  borderRadius: 10,
                  border: '1px solid var(--op-border)',
                  background: 'var(--op-card)',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--op-accent)', margin: 0, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {step.label}
                </p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.3, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Cryptographic evidence */}
        <div style={{ marginTop: 32, maxWidth: 800, margin: '32px auto 0' }}>
          <div style={{ padding: 24, borderRadius: 12, border: '1px solid var(--op-border)', background: 'var(--op-card)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--fg)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Hash style={{ width: 18, height: 18, color: 'var(--op-accent)' }} />
              Cryptographic evidence
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
              Evidence is cryptographically fingerprinted using SHA-256 hash chains via ISAF Logger (open source, PyPI).
              This produces tamper-evident records with integrity-verifiable evidence and version-linked provenance.
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--op-muted)', lineHeight: 1.5 }}>
              ISAF uses SHA-256 hash chains (symmetric cryptographic primitives). It does not use asymmetric digital signatures.
              This distinction is documented in the methodology. The sales focus is: evidence you can verify.
            </p>
            <div style={{ marginTop: 12, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/packages/isaf" style={{ color: 'var(--op-accent)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                ISAF Logger <ArrowRight style={{ width: 12, height: 12 }} />
              </Link>
              <Link href="/solutions/haiec" style={{ color: 'var(--op-accent)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                HAIEC Platform <ArrowRight style={{ width: 12, height: 12 }} />
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* 8. SOC 2 / ENTERPRISE READINESS */}
      <Section
        subtitle="SOC 2 Readiness & Enterprise Readiness"
        title="Ready for the next security conversation"
        description="Prepare technical evidence for SOC 2 readiness and customer security reviews. The deliverable helps you answer security questionnaires, buyer technical diligence, and enterprise procurement."
        sectionNum="07"
      >
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--fg)', marginBottom: 16 }}>SOC 2 readiness positioning</h3>
            <div className="space-y-3">
              {soc2Points.map((point, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <CheckCircle2 style={{ width: 16, height: 16, color: 'var(--op-accent)', flexShrink: 0, marginTop: 2 }} />
                  <span>{point}</span>
                </div>
              ))}
            </div>
            <p style={{ marginTop: 16, fontSize: '0.82rem', color: 'var(--op-muted)', fontStyle: 'italic' }}>
              This review supports SOC 2 readiness. It is not a SOC 2 audit or certification.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--fg)', marginBottom: 16 }}>Framework alignment</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>
              Findings are cross-referenced with relevant controls and guidance from:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {frameworkList.map((fw, i) => (
                <span
                  key={i}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 999,
                    border: '1px solid var(--op-border)',
                    background: 'var(--op-card)',
                    fontSize: '0.82rem',
                    fontWeight: 500,
                    color: 'var(--fg)',
                  }}
                >
                  {fw.name}
                </span>
              ))}
            </div>
            <p style={{ marginTop: 16, fontSize: '0.82rem', color: 'var(--op-muted)', fontStyle: 'italic' }}>
              Frameworks are mapped to actual findings. Not decorative logos.
            </p>
          </div>
        </div>
      </Section>

      {/* 9. HOW IT WORKS */}
      <Section
        subtitle="How It Works"
        title="A structured process from scope to verification"
        sectionNum="08"
        className="bg-secondary/20"
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
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--fg)', marginBottom: 8 }}>{step.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 10. PRICING */}
      <Section
        subtitle="Pricing"
        title="Clear starting point, scoped to your architecture"
        sectionNum="09"
      >
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div
            style={{
              padding: 32,
              borderRadius: 16,
              border: '2px solid var(--op-accent)',
              background: 'var(--op-card)',
            }}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--fg)', marginBottom: 8 }}>{pricingAnchor.name}</h3>
            <p style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--op-accent)', marginBottom: 16 }}>{pricingAnchor.price}</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 24 }}>{pricingAnchor.description}</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {pricingAnchor.includes.map((item, j) => (
                <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  <CheckCircle2 style={{ width: 16, height: 16, color: 'var(--op-accent)', flexShrink: 0, marginTop: 2 }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <a href="#request" data-track-click="saas_security_pricing_cta">
              <Button style={{ width: '100%' }}>
                {pricingAnchor.cta}
              </Button>
            </a>
          </div>
          <p style={{ marginTop: 20, fontSize: '0.85rem', color: 'var(--op-muted)', lineHeight: 1.5, textAlign: 'center' }}>
            {pricingScopeNote}
          </p>
        </div>
      </Section>

      {/* 11. QUESTIONS ANSWERED */}
      <Section
        subtitle="Questions Answered"
        title="What your next serious customer will want to understand"
        description="The review helps answer these questions where applicable. Not every question applies to every architecture."
        sectionNum="10"
        className="bg-secondary/20"
      >
        <div className="grid md:grid-cols-2 gap-8">
          {questionsAnswered.map((group, i) => (
            <div key={i}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--op-accent)', marginBottom: 12 }}>{group.category}</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {group.questions.map((q, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    <AlertCircle style={{ width: 16, height: 16, color: 'var(--op-accent)', flexShrink: 0, marginTop: 2 }} />
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* 12. FAQ */}
      <Section
        subtitle="FAQ"
        title="SaaS security review FAQ"
        sectionNum="11"
      >
        <div style={{ maxWidth: 800 }}>
          <FAQAccordion items={faqItems} />
        </div>
      </Section>

      {/* 13. CTA + FORM */}
      <Section
        subtitle="Request a Review"
        title="Before your next customer asks, know where your security stands"
        description="Send the stack, approximate API-route count, authentication system, tenant model, AI features, and whether a staging environment exists. I will confirm whether the application fits a focused review, multi-tenant review, or full SaaS + AI security review."
        sectionNum="12"
        className="bg-secondary/20"
        id="request"
      >
        <div style={{ maxWidth: 640, marginBottom: 40 }}>
          <TenantAuditForm />
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <a href="#request" data-track-click="saas_security_scope_review_cta">
            <Button size="lg" className="group">
              Request Scope Review
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </a>
          <a href="mailto:admin@subodhkc.com?subject=SaaS%20Security%20Review" data-track-click="saas_security_email_cta">
            <Button size="lg" variant="outline">
              Email Subodh
            </Button>
          </a>
        </div>
      </Section>

      {/* 14. RELATED RESOURCES */}
      <Section
        subtitle="Related Resources"
        title="Related security guidance and tools"
        sectionNum="13"
      >
        <div className="grid md:grid-cols-2 gap-4">
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
            AI Architecture & Governance Services
            <ArrowRight style={{ width: 16, height: 16, color: 'var(--op-accent)' }} />
          </Link>
          <Link
            href="/ai-security-compliance"
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
            AI Security & Compliance Review
            <ArrowRight style={{ width: 16, height: 16, color: 'var(--op-accent)' }} />
          </Link>
          <Link
            href="/solutions/haiec/exposure-assessment"
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
            HAIEC AI Exposure Assessment
            <ArrowRight style={{ width: 16, height: 16, color: 'var(--op-accent)' }} />
          </Link>
          <Link
            href="/ai-security-tools"
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
            Free AI Security Tools
            <ArrowRight style={{ width: 16, height: 16, color: 'var(--op-accent)' }} />
          </Link>
          <Link
            href="/packages/isaf"
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
            ISAF Logger (Open Source)
            <ArrowRight style={{ width: 16, height: 16, color: 'var(--op-accent)' }} />
          </Link>
          <Link
            href="/products/mcp-tenant-isolation"
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
            MCP Tenant Isolation Scanner (Open Source)
            <ArrowRight style={{ width: 16, height: 16, color: 'var(--op-accent)' }} />
          </Link>
          <Link
            href="/products/ai-appsec"
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
            AI AppSec Scanner (Open Source)
            <ArrowRight style={{ width: 16, height: 16, color: 'var(--op-accent)' }} />
          </Link>
          <Link
            href="/how-to-secure-and-govern-ai"
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
            How to Secure and Govern AI
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
