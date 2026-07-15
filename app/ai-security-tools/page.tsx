import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LeadMagnetCard } from '@/components/LeadMagnetCard'
import { AIBlastRadiusCalculator } from '@/components/interactive/AIBlastRadiusCalculator'
import { AgentReadWriteActionMatrix } from '@/components/interactive/AgentReadWriteActionMatrix'
import { PromptInjectionScenarioLibrary } from '@/components/interactive/PromptInjectionScenarioLibrary'
import { FileText, Shield, Download, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'AI Security Tools & Calculators | Subodh KC',
  description:
    'Interactive AI security tools: blast radius calculator, agent read/write/action matrix, prompt-injection scenario library, vendor due-diligence checklist, and incident evidence checklist.',
  alternates: {
    canonical: 'https://subodhkc.com/ai-security-tools',
  },
  openGraph: {
    title: 'AI Security Tools & Calculators',
    description:
      'Interactive tools for assessing AI application security: blast radius, agent capabilities, prompt injection scenarios, vendor due diligence, and incident evidence.',
    url: 'https://subodhkc.com/ai-security-tools',
    type: 'website',
    authors: ['Subodh KC'],
    tags: ['AI Security', 'Prompt Injection', 'AI Risk Assessment', 'MCP Security', 'RAG Security'],
    images: ['https://subodhkc.com/og-default.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Security Tools & Calculators',
    description: 'Interactive tools for assessing AI application security: blast radius, agent capabilities, prompt injection scenarios, and more.',
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
  keywords: [
    'AI blast radius calculator',
    'AI agent read write action matrix',
    'prompt injection scenario library',
    'AI vendor due diligence checklist',
    'AI incident evidence checklist',
    'AI risk register template',
    'AI security assessment tools',
    'internal AI application security',
    'MCP security analysis',
    'RAG security review',
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'Writing', item: 'https://subodhkc.com/writing' },
    { '@type': 'ListItem', position: 3, name: 'AI Security Tools', item: 'https://subodhkc.com/ai-security-tools' },
  ],
}

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'AI Security Tools & Calculators',
  description: 'Interactive tools for assessing AI application security: blast radius, agent capabilities, prompt injection scenarios, vendor due diligence, and incident evidence.',
  url: 'https://subodhkc.com/ai-security-tools',
  applicationCategory: 'SecurityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  author: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
}

const downloadableResources = [
  {
    icon: Download,
    title: 'AI Risk Register Template',
    description: 'A structured spreadsheet template for tracking AI system risks, likelihood, impact, controls, and remediation status across your AI portfolio.',
    href: '/ai-risk-register',
  },
  {
    icon: Shield,
    title: 'AI Vendor Due-Diligence Checklist',
    description: 'A comprehensive checklist for evaluating AI vendors: data handling, security posture, model transparency, compliance, incident response, and contractual protections.',
    href: '/ai-vendor-due-diligence-checklist',
  },
  {
    icon: FileText,
    title: 'AI Incident Evidence Checklist',
    description: 'A structured checklist for preserving evidence after an AI security incident: logs, prompts, outputs, tool calls, authorization records, and timeline reconstruction.',
    href: '/ai-incident-evidence-checklist',
  },
]

export default function AISecurityToolsPage() {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />

      <Hero
        subtitle="Interactive Security Tools"
        title={
          <>
            AI Security Tools
            <br />
            <span className="gradient-text">& Calculators</span>
          </>
        }
        description="Assess your internal AI application's security posture with interactive tools — blast radius, agent capability matrix, prompt-injection scenarios, and downloadable checklists."
      />

      <Section className="pt-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><FileText className="h-4 w-4" /> July 15, 2026</span>
            <span>By Subodh KC</span>
          </div>
          <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/20 p-3">
            <p className="text-xs text-amber-900 dark:text-amber-200">
              <strong>Educational notice:</strong> These tools provide preliminary assessments for planning purposes. They do not replace a formal security review or legal compliance assessment.
            </p>
          </div>
        </div>
      </Section>

      {/* Synopsis */}
      <Section className="pt-4">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-accent/5 to-background p-6 md:p-8">
            <h2 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">Synopsis</h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/90">
              Building internal AI applications with Streamlit, RAG, and MCP creates a new attack surface that traditional application security does not fully address. These interactive tools help you estimate blast radius, map agent capabilities to risk levels, browse real-world prompt-injection scenarios, and download structured checklists for vendor due diligence and incident evidence preservation. Use them alongside the{' '}
              <Link href="/build-internal-ai-applications-streamlit-rag-mcp" className="text-primary font-medium hover:underline">Streamlit architecture guide</Link>{' '}
              and the{' '}
              <Link href="/secure-enterprise-rag-architecture" className="text-primary font-medium hover:underline">secure RAG architecture guide</Link>.
            </p>
          </div>
        </div>
      </Section>

      {/* Interactive Tools */}
      <Section className="pt-8" id="blast-radius">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">AI Blast Radius Calculator</h2>
          <p className="text-sm text-muted-foreground mb-6">Estimate the potential exposure surface of your AI application based on data, users, tools, and deployment.</p>
          <AIBlastRadiusCalculator />
        </div>
      </Section>

      <Section className="pt-8" id="agent-matrix">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">AI Agent Read / Write / Action Matrix</h2>
          <p className="text-sm text-muted-foreground mb-6">Map what your AI agent can do with each resource type. Risk is automatically classified based on capability and data sensitivity.</p>
          <AgentReadWriteActionMatrix />
        </div>
      </Section>

      <Section className="pt-8" id="scenario-library">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Prompt-Injection & AI Security Scenario Library</h2>
          <p className="text-sm text-muted-foreground mb-6">Browse real-world attack vectors, examples, and defense strategies for internal AI applications.</p>
          <PromptInjectionScenarioLibrary />
        </div>
      </Section>

      {/* Downloadable Resources */}
      <Section className="pt-8" id="downloadable-resources">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Downloadable Checklists & Templates</h2>
          <p className="text-sm text-muted-foreground">Structured resources for AI governance, vendor evaluation, and incident response.</p>
          <div className="grid gap-4 md:grid-cols-3">
            {downloadableResources.map((resource) => {
              const Icon = resource.icon
              return (
                <Link key={resource.title} href={resource.href} className="block">
                  <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-sm">{resource.title}</CardTitle>
                      </div>
                      <CardDescription className="text-sm leading-relaxed">{resource.description}</CardDescription>
                      <span className="text-sm text-primary inline-flex items-center gap-1 mt-2">
                        Open <ArrowRight className="h-3 w-3" />
                      </span>
                    </CardHeader>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </Section>

      {/* Lead Magnet */}
      <Section className="pt-8">
        <div className="max-w-4xl mx-auto">
          <LeadMagnetCard
            title="AI Governance & Compliance Framework Guide"
            description="Get a structured framework for AI governance, risk management, and compliance — aligned with NIST AI RMF, EU AI Act, and TRAIGA. Includes templates for AI system records, disclosure reviews, and cure-response packages."
            resourceName="AI Governance & Compliance Framework Guide"
          />
        </div>
      </Section>

      {/* CTA */}
      <CTA
        title="Need an AI Security Assessment?"
        description="Get a comprehensive AI application security review — prompt injection, RAG poisoning, tool abuse, RLS, tenant isolation, and evidence-grade compliance outputs from Subodh KC, co-founder of HAIEC."
        primaryButton={{ text: 'Contact Subodh KC', href: '/contact' }}
        secondaryButton={{ text: 'Explore HAIEC Platform', href: '/solutions/haiec' }}
      />
    </>
  )
}
