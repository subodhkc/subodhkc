import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LeadMagnetCard } from '@/components/LeadMagnetCard'
import { Shield, Zap, FileText, AlertTriangle, CheckCircle2, ArrowRight, Lock, Eye, Bug, Scale } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'HAIEC AI Exposure Assessment | Subodh KC',
  description:
    'Comprehensive AI exposure assessment from HAIEC — deterministic security analysis, prompt injection testing, RAG poisoning detection, tool abuse analysis, and evidence-grade compliance outputs.',
  alternates: {
    canonical: 'https://subodhkc.com/solutions/haiec/exposure-assessment',
  },
  openGraph: {
    title: 'HAIEC AI Exposure Assessment',
    description: 'Comprehensive AI exposure assessment — deterministic security analysis, prompt injection testing, RAG poisoning detection, and evidence-grade compliance outputs.',
    url: 'https://subodhkc.com/solutions/haiec/exposure-assessment',
    type: 'website',
    authors: ['Subodh KC'],
    tags: ['AI Exposure Assessment', 'AI Security', 'HAIEC', 'Prompt Injection', 'AI Compliance'],
    images: ['https://subodhkc.com/og-default.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HAIEC AI Exposure Assessment',
    description: 'Comprehensive AI exposure assessment — deterministic security analysis, prompt injection testing, and evidence-grade compliance outputs.',
  },
  robots: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  keywords: [
    'AI exposure assessment',
    'AI security assessment',
    'HAIEC AI security',
    'prompt injection testing',
    'RAG poisoning detection',
    'AI tool abuse analysis',
    'AI compliance assessment',
    'AI risk evaluation',
    'internal AI security review',
    'AI application security audit',
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'HAIEC', item: 'https://subodhkc.com/solutions/haiec' },
    { '@type': 'ListItem', position: 3, name: 'AI Exposure Assessment', item: 'https://subodhkc.com/solutions/haiec/exposure-assessment' },
  ],
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'HAIEC AI Exposure Assessment',
  description: 'Comprehensive AI exposure assessment with deterministic security analysis, prompt injection testing, RAG poisoning detection, tool abuse analysis, and evidence-grade compliance outputs.',
  url: 'https://subodhkc.com/solutions/haiec/exposure-assessment',
  provider: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
  serviceType: 'AI Security Assessment',
  areaServed: 'Global',
}

const assessmentAreas = [
  { icon: Bug, title: 'Prompt Injection Analysis', description: 'Deterministic detection of direct, indirect, and MCP-tool-description injection vectors. Tests system prompt integrity, user input sanitization, and retrieved document safety.' },
  { icon: FileText, title: 'RAG Poisoning Detection', description: 'Scans ingested documents for hidden instructions, evaluates retrieval pipeline for cross-tenant leakage, and verifies RLS enforcement before retrieval.' },
  { icon: Zap, title: 'Tool Abuse & Permission Analysis', description: 'Maps agent tool access against the principle of least privilege. Identifies excessive permissions, missing approval workflows, and automatic execution risks.' },
  { icon: Lock, title: 'Authentication & Authorization Review', description: 'Verifies that authorization is enforced server-side, independent of model output. Tests for Session State misuse, role escalation, and identity bypass.' },
  { icon: Eye, title: 'Tenant Isolation Testing', description: 'Negative-access testing for cross-tenant data leakage through vector search, caching, session state, and shared infrastructure.' },
  { icon: Shield, title: 'Evidence-Grade Compliance Output', description: 'Generates defensible documentation for TRAIGA, EU AI Act, NIST AI RMF, and NYC LL 144 — including system records, disclosure reviews, and cure-response packages.' },
]

const assessmentProcess = [
  { step: '1', title: 'Scope & Intake', description: 'Define the AI application boundary, data sources, tool integrations, user populations, and regulatory obligations. Identify critical assets and sensitive data flows.' },
  { step: '2', title: 'Architecture Review', description: 'Map the complete architecture: interface, application logic, AI services, retrieval, tools, MCP servers, enterprise systems, and controls. Identify trust boundaries.' },
  { step: '3', title: 'Deterministic Analysis', description: 'Automated static analysis of prompts, tool definitions, RAG configurations, authorization logic, caching patterns, and MCP server definitions for security weaknesses.' },
  { step: '4', title: 'Adversarial Testing', description: 'Runtime testing with prompt injection, RAG poisoning, tool abuse, auth bypass, and cross-tenant access attempts. Tests both successful and failed attacks.' },
  { step: '5', title: 'Risk Classification', description: 'Each finding is classified by severity, likelihood, and blast radius. Mapped to the AI risk register with recommended controls, owners, and remediation timeline.' },
  { step: '6', title: 'Evidence & Reporting', description: 'Full evidence package: test results, attack transcripts, control gaps, remediation roadmap, and compliance-aligned documentation for regulators and auditors.' },
]

export default function HAIECExposureAssessmentPage() {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <Hero
        subtitle="HAIEC Assessment Service"
        title={
          <>
            AI Exposure
            <br />
            <span className="gradient-text">Assessment</span>
          </>
        }
        description="Comprehensive AI security assessment — deterministic analysis, adversarial testing, and evidence-grade compliance outputs for internal AI applications."
      />

      <Section className="pt-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><FileText className="h-4 w-4" /> July 15, 2026</span>
            <span>By Subodh KC</span>
          </div>
          <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/20 p-3">
            <p className="text-xs text-amber-900 dark:text-amber-200">
              <strong>Educational notice:</strong> This page describes a professional assessment service. The scope, depth, and deliverables are customized to each engagement based on your architecture, data types, regulatory environment, and risk tolerance. Contact Subodh KC to discuss your specific needs.
            </p>
          </div>
        </div>
      </Section>

      <Section className="pt-4">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-accent/5 to-background p-6 md:p-8">
            <h2 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">Synopsis</h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/90">
              The HAIEC AI Exposure Assessment is a structured security evaluation of your internal AI application — covering prompt injection, RAG poisoning, tool abuse, authentication bypass, tenant isolation, and compliance documentation. Unlike generic security scans, HAIEC performs deterministic analysis of the AI-specific attack surface: prompts, tool definitions, retrieval pipelines, MCP servers, and model-driven authorization decisions. The output is evidence-grade documentation suitable for TRAIGA, EU AI Act, NIST AI RMF, and NYC LL 144 compliance.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Internal AI applications', 'Streamlit + RAG deployments', 'MCP-integrated systems', 'AI hiring tools', 'Healthcare AI systems', 'Customer-facing AI chatbots'].map((audience) => (
                <span key={audience} className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">{audience}</span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section className="pt-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">What the Assessment Covers</h2>
          <p className="text-sm text-muted-foreground mb-6">Six core assessment areas, each with deterministic analysis and adversarial testing.</p>
          <div className="grid gap-4 md:grid-cols-2">
            {assessmentAreas.map((area) => {
              const Icon = area.icon
              return (
                <Card key={area.title} className="border-l-4 border-l-primary/40">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary" />
                      {area.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed mt-1">{area.description}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </Section>

      <Section className="pt-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Assessment Process</h2>
          <p className="text-sm text-muted-foreground mb-6">A structured six-phase process from scope to evidence.</p>
          <div className="space-y-3">
            {assessmentProcess.map((phase) => (
              <div key={phase.step} className="flex items-start gap-4 rounded-lg border border-border p-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">{phase.step}</span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{phase.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{phase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* What Makes HAIEC Different */}
      <Section className="pt-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">What Makes HAIEC Different</h2>
          <p className="text-sm text-muted-foreground">Generic security scans check for known vulnerabilities. HAIEC analyzes the AI-specific attack surface that traditional tools cannot see.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-l-4 border-l-primary/40">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Bug className="h-4 w-4 text-primary" />
                  Deterministic, not probabilistic
                </CardTitle>
                <CardDescription className="text-sm mt-1">HAIEC performs static analysis on your prompts, tool definitions, RAG configurations, and authorization logic. It does not rely on LLM-based judgment calls — it identifies specific, reproducible security weaknesses with code-level precision.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-primary/40">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  Adversarial runtime testing
                </CardTitle>
                <CardDescription className="text-sm mt-1">Beyond static analysis, HAIEC executes runtime attacks: prompt injection, RAG poisoning, tool abuse, auth bypass, and cross-tenant access attempts. Tests both successful and failed attacks to verify that controls work under adversarial conditions.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-primary/40">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Evidence-grade outputs
                </CardTitle>
                <CardDescription className="text-sm mt-1">Every finding includes the attack transcript, the control gap, the remediation recommendation, and the compliance mapping. The output is structured for regulators, auditors, and legal teams — not just engineering.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-primary/40">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Scale className="h-4 w-4 text-primary" />
                  Multi-framework compliance mapping
                </CardTitle>
                <CardDescription className="text-sm mt-1">Findings are mapped to TRAIGA, EU AI Act, NIST AI RMF, NYC LL 144, HIPAA, and GDPR requirements. One assessment produces documentation for multiple regulatory frameworks — no separate compliance audits needed.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </Section>

      {/* Deliverables */}
      <Section className="pt-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">What You Receive</h2>
          <p className="text-sm text-muted-foreground">Every HAIEC AI Exposure Assessment includes these deliverables.</p>
          <div className="rounded-lg border border-border p-6 space-y-3">
            {[
              { title: 'Architecture & Trust Boundary Map', desc: 'A visual map of your AI application architecture showing all trust boundaries, data flows, tool integrations, MCP servers, and control points.' },
              { title: 'Findings Report', desc: 'Each finding classified by severity, likelihood, and blast radius — with the attack transcript, control gap, and specific remediation recommendation.' },
              { title: 'Risk Register Integration', desc: 'Findings pre-formatted for direct import into the AI risk register, with owners, controls, and remediation timeline.' },
              { title: 'Compliance Mapping', desc: 'Cross-reference of each finding to applicable regulatory requirements under TRAIGA, EU AI Act, NIST AI RMF, NYC LL 144, HIPAA, and GDPR.' },
              { title: 'Remediation Roadmap', desc: 'Prioritized remediation plan with P0/P1/P2 classification, estimated effort, and dependency mapping.' },
              { title: 'Evidence Package', desc: 'All test results, attack transcripts, and analysis artifacts preserved in a structured format suitable for audit, regulatory inquiry, or litigation.' },
            ].map((deliverable) => (
              <div key={deliverable.title} className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">{deliverable.title}</p>
                  <p className="text-sm text-muted-foreground">{deliverable.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="pt-8">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/20 p-4">
            <p className="text-sm text-amber-900 dark:text-amber-200">
              <AlertTriangle className="h-4 w-4 inline mr-1" />
              <strong>When to get an assessment:</strong> Before production launch, after significant architecture changes, when adding MCP integrations, when expanding to new data sources, after a security incident, or when preparing for regulatory audit.
            </p>
          </div>
        </div>
      </Section>

      <Section className="pt-8">
        <div className="max-w-4xl mx-auto">
          <LeadMagnetCard
            title="Free AI Exposure Assessment Preview"
            description="Get a preliminary assessment scope document showing which areas of your AI application will be evaluated, what evidence will be collected, and how the output maps to your compliance obligations."
            resourceName="AI Exposure Assessment Preview"
          />
        </div>
      </Section>

      {/* FAQ */}
      <Section className="pt-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-xl font-bold tracking-tight mb-4">FAQ</h2>
          {[
            {
              q: 'How long does an AI Exposure Assessment take?',
              a: 'A typical assessment takes 2–4 weeks depending on the complexity of the application, the number of integrations (MCP servers, tools, data sources), and the regulatory frameworks in scope. Phase 1 (scope and intake) takes 2–3 days, phases 2–4 (analysis and testing) take 1–2 weeks, and phases 5–6 (classification and reporting) take 3–5 days.',
            },
            {
              q: 'Do you need access to our source code?',
              a: 'Yes, for deterministic analysis. HAIEC performs static analysis on prompts, tool definitions, RAG configurations, authorization logic, and MCP server definitions. Source code access can be arranged through a mutual NDA with read-only access to a specific repository or branch. For runtime adversarial testing, we need access to a staging or test environment that mirrors production.',
            },
            {
              q: 'Can the assessment be done without exposing production data?',
              a: 'Yes. Adversarial testing is performed against a staging or test environment with synthetic or anonymized data. HAIEC does not need access to real PHI, PII, or confidential business data. The assessment evaluates the architecture and controls — not your actual data.',
            },
            {
              q: 'How is this different from a penetration test?',
              a: 'A traditional penetration test focuses on network, infrastructure, and web application vulnerabilities. HAIEC focuses on the AI-specific attack surface: prompt injection, RAG poisoning, tool abuse, model-driven authorization bypass, MCP supply-chain risks, and cross-tenant data leakage through vector search and caching. These are vulnerabilities that traditional pentesting tools and methodologies do not cover.',
            },
            {
              q: 'What if we have multiple AI applications?',
              a: 'HAIEC can assess multiple applications in a single engagement. Each application gets its own findings report, risk register entries, and compliance mapping. A portfolio-level summary is provided showing aggregate risk across all assessed applications, prioritized by blast radius.',
            },
          ].map((faq) => (
            <details key={faq.q} className="rounded-lg border border-border p-4 group">
              <summary className="text-sm font-medium text-foreground cursor-pointer flex items-center justify-between">
                {faq.q}
                <span className="text-muted-foreground group-open:rotate-180 transition-transform">⌄</span>
              </summary>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section className="pt-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold tracking-tight mb-4">Related Resources</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/ai-security-tools" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-sm">AI Security Tools</CardTitle>
                  </div>
                  <CardDescription className="text-sm">Blast radius calculator, agent matrix, and prompt-injection scenario library.</CardDescription>
                  <span className="text-sm text-primary inline-flex items-center gap-1 mt-2">Open <ArrowRight className="h-3 w-3" /></span>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/build-internal-ai-applications-streamlit-rag-mcp" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-sm">Streamlit Architecture Guide</CardTitle>
                  </div>
                  <CardDescription className="text-sm">Complete guide to building internal AI apps with Streamlit, RAG, and MCP.</CardDescription>
                  <span className="text-sm text-primary inline-flex items-center gap-1 mt-2">Read <ArrowRight className="h-3 w-3" /></span>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/solutions/haiec" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Scale className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-sm">HAIEC Platform</CardTitle>
                  </div>
                  <CardDescription className="text-sm">Full HAIEC AI security and compliance platform overview.</CardDescription>
                  <span className="text-sm text-primary inline-flex items-center gap-1 mt-2">Explore <ArrowRight className="h-3 w-3" /></span>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </Section>

      <CTA
        title="Ready for Your AI Exposure Assessment?"
        description="Get a comprehensive AI security assessment with evidence-grade compliance outputs — from Subodh KC, co-founder of HAIEC."
        primaryButton={{ text: 'Book an Assessment', href: '/contact' }}
        secondaryButton={{ text: 'Explore HAIEC Platform', href: '/solutions/haiec' }}
      />
    </>
  )
}
