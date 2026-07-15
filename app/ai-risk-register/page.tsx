import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LeadMagnetCard } from '@/components/LeadMagnetCard'
import { FileText, Shield, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'AI Risk Register Template | Subodh KC',
  description:
    'A structured AI risk register template for tracking AI system risks, likelihood, impact, controls, and remediation status across your AI portfolio.',
  alternates: {
    canonical: 'https://subodhkc.com/ai-risk-register',
  },
  openGraph: {
    title: 'AI Risk Register Template',
    description: 'A structured template for tracking AI system risks, likelihood, impact, controls, and remediation status.',
    url: 'https://subodhkc.com/ai-risk-register',
    type: 'article',
    authors: ['Subodh KC'],
    tags: ['AI Risk Register', 'AI Risk Management', 'AI Governance', 'NIST AI RMF'],
    images: ['https://subodhkc.com/og-default.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Risk Register Template',
    description: 'A structured template for tracking AI system risks, likelihood, impact, controls, and remediation status.',
  },
  robots: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  keywords: ['AI risk register', 'AI risk template', 'AI risk management', 'AI governance template', 'NIST AI RMF risk register', 'AI risk tracking'],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'AI Security Tools', item: 'https://subodhkc.com/ai-security-tools' },
    { '@type': 'ListItem', position: 3, name: 'AI Risk Register', item: 'https://subodhkc.com/ai-risk-register' },
  ],
}

const riskCategories = [
  { category: 'Data & Privacy', risks: [
    { id: 'R-01', risk: 'Unauthorized data access through RAG retrieval without RLS', likelihood: 'Medium', impact: 'High', controls: 'Tenant filters before retrieval, metadata-based access control', owner: 'Data Engineering', status: 'Open' },
    { id: 'R-02', risk: 'Sensitive data leakage through global caching', likelihood: 'Medium', impact: 'High', controls: 'Session-scoped cache keys, no global cache for sensitive data', owner: 'Platform Team', status: 'Open' },
    { id: 'R-03', risk: 'PHI exposure in model prompts sent to external API', likelihood: 'Low', impact: 'Critical', controls: 'DLP scanning, data minimization in prompts, on-premise model option', owner: 'Security', status: 'Open' },
  ]},
  { category: 'Prompt Injection & Manipulation', risks: [
    { id: 'R-04', risk: 'Direct prompt injection overriding system instructions', likelihood: 'High', impact: 'High', controls: 'Server-side authorization, structured output validation, pattern detection', owner: 'Application Security', status: 'Open' },
    { id: 'R-05', risk: 'Indirect injection via poisoned RAG documents', likelihood: 'Medium', impact: 'Critical', controls: 'Content sanitization, document provenance, human approval for actions', owner: 'Data Engineering', status: 'Open' },
    { id: 'R-06', risk: 'Injection via MCP tool descriptions', likelihood: 'Low', impact: 'High', controls: 'Tool description review, trusted MCP servers only, tool allow-list', owner: 'Platform Team', status: 'Open' },
  ]},
  { category: 'Tool & Action Security', risks: [
    { id: 'R-07', risk: 'Excessive tool permissions (principle of least privilege violation)', likelihood: 'High', impact: 'High', controls: 'Tool allow-list per use case, regular permission audit', owner: 'Engineering', status: 'Open' },
    { id: 'R-08', risk: 'Automatic action execution without human approval', likelihood: 'Medium', impact: 'Critical', controls: 'Human approval for action/admin tools, server-side approval workflow', owner: 'Engineering', status: 'Open' },
    { id: 'R-09', risk: 'Model output trusted as authorization decision', likelihood: 'Medium', impact: 'Critical', controls: 'Server-side authorization independent of model, identity provider verification', owner: 'Security', status: 'Open' },
  ]},
  { category: 'Infrastructure & Supply Chain', risks: [
    { id: 'R-10', risk: 'Compromised MCP server exfiltrating data', likelihood: 'Low', impact: 'Critical', controls: 'Trusted publishers, network egress restrictions, sandbox MCP servers', owner: 'Security', status: 'Open' },
    { id: 'R-11', risk: 'Model vendor retaining sensitive prompts', likelihood: 'Medium', impact: 'High', controls: 'DPA with vendor, DLP scanning, on-premise fallback for sensitive data', owner: 'Legal & Security', status: 'Open' },
    { id: 'R-12', risk: 'Session State used as authoritative storage', likelihood: 'Medium', impact: 'Medium', controls: 'Durable storage for all consequential state, external database for audit', owner: 'Engineering', status: 'Open' },
  ]},
  { category: 'Compliance & Governance', risks: [
    { id: 'R-13', risk: 'Missing AI system documentation for regulatory disclosure', likelihood: 'Medium', impact: 'High', controls: 'AI system registry, disclosure review process, automated documentation', owner: 'Compliance', status: 'Open' },
    { id: 'R-14', risk: 'No incident response plan for AI security events', likelihood: 'Medium', impact: 'High', controls: 'AI incident response playbook, evidence preservation checklist, tabletop exercises', owner: 'Security', status: 'Open' },
    { id: 'R-15', risk: 'Bias or discrimination in consequential AI decisions', likelihood: 'Low', impact: 'High', controls: 'Bias testing, human review for consequential decisions, appeal process', owner: 'Compliance', status: 'Open' },
  ]},
]

const impactColors: Record<string, string> = {
  Low: 'text-green-600',
  Medium: 'text-amber-600',
  High: 'text-orange-600',
  Critical: 'text-red-600',
}

export default function AIRiskRegisterPage() {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Hero
        subtitle="AI Governance Resource"
        title={
          <>
            AI Risk Register
            <br />
            <span className="gradient-text">Template</span>
          </>
        }
        description="A structured template for tracking AI system risks, likelihood, impact, controls, and remediation status across your AI portfolio."
      />

      <Section className="pt-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><FileText className="h-4 w-4" /> July 15, 2026</span>
            <span>By Subodh KC</span>
          </div>
        </div>
      </Section>

      <Section className="pt-4">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-accent/5 to-background p-6 md:p-8">
            <h2 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">Synopsis</h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/90">
              A risk register is the foundation of AI governance. This template covers data and privacy risks, prompt injection vectors, tool and action security, infrastructure and supply chain threats, and compliance gaps. Each risk includes likelihood, impact, recommended controls, an owner, and status tracking. Use it alongside the{' '}
              <Link href="/ai-security-tools" className="text-primary font-medium hover:underline">AI Security Tools</Link>{' '}
              and the{' '}
              <Link href="/build-internal-ai-applications-streamlit-rag-mcp" className="text-primary font-medium hover:underline">Streamlit architecture guide</Link>.
            </p>
          </div>
        </div>
      </Section>

      <Section className="pt-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/20 p-4">
            <p className="text-sm text-amber-900 dark:text-amber-200">
              <AlertTriangle className="h-4 w-4 inline mr-1" />
              <strong>How to use:</strong> Copy this structure into a spreadsheet or governance tool. Assign owners, set target dates, and update status as controls are implemented. Review quarterly or after significant architecture changes.
            </p>
          </div>

          {riskCategories.map((cat) => (
            <div key={cat.category}>
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                {cat.category}
              </h3>
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-xs md:text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-2 font-semibold">ID</th>
                      <th className="text-left p-2 font-semibold">Risk</th>
                      <th className="text-left p-2 font-semibold">Likelihood</th>
                      <th className="text-left p-2 font-semibold">Impact</th>
                      <th className="text-left p-2 font-semibold">Controls</th>
                      <th className="text-left p-2 font-semibold">Owner</th>
                      <th className="text-left p-2 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {cat.risks.map((r) => (
                      <tr key={r.id} className="hover:bg-muted/20">
                        <td className="p-2 font-mono text-xs text-muted-foreground">{r.id}</td>
                        <td className="p-2 text-foreground/90">{r.risk}</td>
                        <td className={`p-2 font-medium ${impactColors[r.likelihood]}`}>{r.likelihood}</td>
                        <td className={`p-2 font-medium ${impactColors[r.impact]}`}>{r.impact}</td>
                        <td className="p-2 text-muted-foreground">{r.controls}</td>
                        <td className="p-2 text-muted-foreground">{r.owner}</td>
                        <td className="p-2">
                          <span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/5 px-2 py-0.5 text-xs text-amber-600">{r.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="pt-8">
        <div className="max-w-4xl mx-auto">
          <LeadMagnetCard
            title="Download the AI Risk Register Spreadsheet"
            description="Get the complete risk register as a structured spreadsheet with formulas, dropdowns, and conditional formatting — ready to import into your governance tool."
            resourceName="AI Risk Register Spreadsheet"
          />
        </div>
      </Section>

      <Section className="pt-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold tracking-tight mb-4">Related Resources</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/ai-security-tools" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-sm">AI Security Tools & Calculators</CardTitle>
                  </div>
                  <CardDescription className="text-sm">Interactive blast radius calculator, agent matrix, and prompt-injection scenario library.</CardDescription>
                  <span className="text-sm text-primary inline-flex items-center gap-1 mt-2">Open tools <ArrowRight className="h-3 w-3" /></span>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/ai-incident-evidence-checklist" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-sm">AI Incident Evidence Checklist</CardTitle>
                  </div>
                  <CardDescription className="text-sm">Structured checklist for preserving evidence after an AI security incident.</CardDescription>
                  <span className="text-sm text-primary inline-flex items-center gap-1 mt-2">Open checklist <ArrowRight className="h-3 w-3" /></span>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </Section>

      <CTA
        title="Need Help Building Your AI Risk Register?"
        description="Get a tailored AI risk assessment and governance framework — from Subodh KC, co-founder of the HAIEC AI security and compliance engine."
        primaryButton={{ text: 'Book a Consultation', href: '/contact' }}
        secondaryButton={{ text: 'Explore HAIEC Platform', href: '/solutions/haiec' }}
      />
    </>
  )
}
