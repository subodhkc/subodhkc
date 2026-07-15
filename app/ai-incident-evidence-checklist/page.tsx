import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LeadMagnetCard } from '@/components/LeadMagnetCard'
import { FileText, Shield, AlertTriangle, ArrowRight, CheckCircle2, Clock, Database, Bug } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'AI Incident Evidence Checklist | Subodh KC',
  description:
    'A structured checklist for preserving evidence after an AI security incident: logs, prompts, outputs, tool calls, authorization records, and timeline reconstruction.',
  alternates: {
    canonical: 'https://subodhkc.com/ai-incident-evidence-checklist',
  },
  openGraph: {
    title: 'AI Incident Evidence Checklist',
    description: 'A structured checklist for preserving evidence after an AI security incident: logs, prompts, outputs, tool calls, and timeline reconstruction.',
    url: 'https://subodhkc.com/ai-incident-evidence-checklist',
    type: 'article',
    authors: ['Subodh KC'],
    tags: ['AI Incident Response', 'AI Security', 'AI Evidence Preservation', 'AI Forensics'],
    images: ['https://subodhkc.com/og-default.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Incident Evidence Checklist',
    description: 'A structured checklist for preserving evidence after an AI security incident.',
  },
  robots: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  keywords: ['AI incident evidence checklist', 'AI incident response', 'AI security incident', 'AI forensics', 'AI evidence preservation', 'AI security breach response'],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'AI Security Tools', item: 'https://subodhkc.com/ai-security-tools' },
    { '@type': 'ListItem', position: 3, name: 'AI Incident Evidence Checklist', item: 'https://subodhkc.com/ai-incident-evidence-checklist' },
  ],
}

const phases = [
  {
    icon: Clock,
    title: 'Phase 1: Immediate Containment (0–1 hour)',
    items: [
      'Disable the affected AI application or feature (stop the bleeding)',
      'Revoke API keys and access tokens associated with the incident',
      'Preserve the current application state — do NOT restart or redeploy',
      'Capture running process list, memory state, and active connections',
      'Snapshot any cloud resources (VMs, containers, serverless functions)',
      'Notify the incident response team and designate an incident commander',
      'Begin a contemporaneous incident log (who, what, when, why)',
      'Preserve all browser tabs, Streamlit sessions, and user screens if applicable',
    ],
  },
  {
    icon: Database,
    title: 'Phase 2: Evidence Preservation (1–4 hours)',
    items: [
      'Export all application logs (API calls, model interactions, tool executions)',
      'Preserve all prompts and model outputs from the incident window',
      'Export Streamlit Session State snapshots if the application is still running',
      'Capture all tool call records: function name, arguments, results, authorization decision, approver identity',
      'Export authentication and authorization logs (who was logged in, what roles, what RLS filters were applied)',
      'Preserve RAG retrieval logs: query, retrieved chunks, chunk metadata, tenant filters applied',
      'Export MCP server logs: tool discovery, tool calls, server responses',
      'Capture model API request/response logs including timestamps, model version, token counts',
      'Preserve any cached data that may have been involved (global cache, session cache)',
      'Export database audit logs and transaction records for the affected time window',
      'Capture network flow logs (egress connections, especially to external APIs or model vendors)',
      'Preserve any uploaded documents or files associated with the incident',
    ],
  },
  {
    icon: Bug,
    title: 'Phase 3: Root Cause Analysis (4–24 hours)',
    items: [
      'Reconstruct the timeline: first anomalous event, detection, containment, resolution',
      'Identify the attack vector: direct injection, indirect injection, tool abuse, auth bypass, data leakage, supply chain',
      'Determine which user or system identity was involved',
      'Identify which data was accessed, modified, or exfiltrated',
      'Determine whether RLS or tenant isolation was bypassed and how',
      'Identify which tools were called and whether authorization was properly enforced',
      'Determine whether the model output was the cause or a symptom',
      'Check for prompt injection patterns in user inputs or retrieved documents',
      'Review MCP server logs for anomalous tool definitions or calls',
      'Assess whether the incident was caused by configuration, code, or adversarial input',
      'Document the complete chain: trigger, propagation, impact, detection, containment',
      'Identify any compliance obligations triggered (breach notification, regulatory disclosure)',
    ],
  },
  {
    icon: Shield,
    title: 'Phase 4: Remediation & Documentation (1–7 days)',
    items: [
      'Implement immediate fix (patch, configuration change, tool removal, access restriction)',
      'Conduct negative-access testing to verify the fix',
      'Test for similar vulnerabilities in other AI applications or integrations',
      'Update the AI risk register with the new finding and remediation status',
      'Document the incident in a formal post-incident report',
      'Prepare evidence package for legal, compliance, or regulatory purposes',
      'Notify affected parties (customers, users, regulators) if required',
      'Update security controls: tool allow-lists, RLS rules, approval workflows, monitoring rules',
      'Conduct a post-incident review with all stakeholders',
      'Update the incident response playbook with lessons learned',
      'Schedule follow-up security review for 30 days post-remediation',
      'Consider whether the incident warrants disclosure under TRAIGA, EU AI Act, or other applicable regulations',
    ],
  },
]

export default function AIIncidentEvidenceChecklistPage() {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Hero
        subtitle="AI Incident Response Resource"
        title={
          <>
            AI Incident Evidence
            <br />
            <span className="gradient-text">Checklist</span>
          </>
        }
        description="A structured checklist for preserving evidence after an AI security incident — covering containment, evidence preservation, root cause analysis, and remediation."
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
              AI security incidents differ from traditional application security incidents. The evidence includes prompts, model outputs, tool call chains, RAG retrieval context, MCP server interactions, and authorization decisions that may have been made by a model rather than a human. This four-phase checklist ensures you preserve the right evidence, reconstruct the timeline, identify the root cause, and document everything for compliance and legal purposes.
            </p>
          </div>
        </div>
      </Section>

      <Section className="pt-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <p className="text-sm text-foreground/90">
              <AlertTriangle className="h-4 w-4 inline mr-1 text-red-600" />
              <strong>Critical:</strong> Do NOT restart, redeploy, or "fix" the application before preserving evidence. Once state is lost, the incident chain may be unreconstructable.
            </p>
          </div>

          {phases.map((phase) => {
            const Icon = phase.icon
            return (
              <Card key={phase.title} className="border-l-4 border-l-primary/40">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    {phase.title}
                  </CardTitle>
                </CardHeader>
                <div className="px-6 pb-6">
                  <ul className="space-y-2">
                    {phase.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-foreground/90">
                        <span className="flex-shrink-0 w-5 h-5 rounded border-2 border-border mt-0.5 flex items-center justify-center">
                          <CheckCircle2 className="h-3 w-3 text-transparent" />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            )
          })}
        </div>
      </Section>

      <Section className="pt-8">
        <div className="max-w-4xl mx-auto">
          <LeadMagnetCard
            title="Download the AI Incident Evidence Checklist"
            description="Get the complete checklist as a structured document with evidence collection templates, chain-of-custody tracking, and post-incident report scaffolding."
            resourceName="AI Incident Evidence Checklist"
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
            <Link href="/ai-risk-register" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-sm">AI Risk Register Template</CardTitle>
                  </div>
                  <CardDescription className="text-sm">Structured template for tracking AI system risks, controls, and remediation status.</CardDescription>
                  <span className="text-sm text-primary inline-flex items-center gap-1 mt-2">Open template <ArrowRight className="h-3 w-3" /></span>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </Section>

      <CTA
        title="Need AI Incident Response Support?"
        description="Get expert AI security incident response — evidence preservation, root cause analysis, and remediation guidance from Subodh KC, co-founder of HAIEC."
        primaryButton={{ text: 'Contact Subodh KC', href: '/contact' }}
        secondaryButton={{ text: 'Explore HAIEC Platform', href: '/solutions/haiec' }}
      />
    </>
  )
}
