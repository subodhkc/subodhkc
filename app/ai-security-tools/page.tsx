import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LeadMagnetCard } from '@/components/LeadMagnetCard'
import { AIBlastRadiusCalculator } from '@/components/interactive/AIBlastRadiusCalculator'
import { AgentReadWriteActionMatrix } from '@/components/interactive/AgentReadWriteActionMatrix'
import { PromptInjectionScenarioLibrary } from '@/components/interactive/PromptInjectionScenarioLibrary'
import { FileText, Shield, Download, ArrowRight, AlertTriangle, XCircle } from 'lucide-react'
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
    'AI hiring compliance checklist',
    'NYC Local Law 144 compliance',
    'AI bias audit requirements',
    'shadow AI policy',
    'AI security risk assessment',
    'AI governance tools',
    'AI procurement security checklist',
    'AI incident response plan template',
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

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Are these tools free to use?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. All three interactive tools are free and run entirely in your browser. No data is sent to a server. The downloadable checklists and templates are available through the lead magnet form.' },
    },
    {
      '@type': 'Question',
      name: 'Do these tools work for non-Streamlit AI applications?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. While the tools were designed alongside the Streamlit architecture guide, the risk factors, agent capabilities, and attack scenarios apply to any internal AI application built with Python, React, or any other framework. The blast radius factors (data type, user scale, tool access, deployment model) are framework-agnostic.' },
    },
    {
      '@type': 'Question',
      name: 'How often should I re-run the blast radius calculation?',
      acceptedAnswer: { '@type': 'Answer', text: 'Re-run it whenever the application architecture changes: new data sources, new tool integrations, new MCP servers, expanded user populations, or deployment model changes. At minimum, review quarterly as part of your AI governance cycle.' },
    },
    {
      '@type': 'Question',
      name: 'Can I use the scenario library for security training?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. The scenario library is designed for both planning and training. Each scenario includes a concrete attack example and defense strategies, making it suitable for tabletop exercises, developer training, and security awareness sessions.' },
    },
    {
      '@type': 'Question',
      name: 'What should I do if the blast radius calculator shows Critical?',
      acceptedAnswer: { '@type': 'Answer', text: 'Do not deploy without a completed security assessment. Follow the recommendations provided with the Critical result, and consider engaging a professional AI security assessment. The HAIEC AI Exposure Assessment provides deterministic analysis, adversarial testing, and evidence-grade compliance outputs.' },
    },
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
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

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

      {/* What These Tools Don't Cover */}
      <Section className="pt-8" id="limitations">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">What These Tools Don't Cover</h2>
          <p className="text-sm text-muted-foreground">These tools provide preliminary assessments. They are not a substitute for a formal security review.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-l-4 border-l-amber-500/40">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-amber-600" />
                  Runtime adversarial testing
                </CardTitle>
                <CardDescription className="text-sm mt-1">The calculator and matrix estimate exposure based on your inputs. They do not execute live prompt-injection attacks, RAG poisoning attempts, or cross-tenant access tests against your running application.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-amber-500/40">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-amber-600" />
                  Code-level vulnerability analysis
                </CardTitle>
                <CardDescription className="text-sm mt-1">These tools do not inspect your source code, MCP server definitions, RAG pipeline configuration, or authorization logic for implementation-level vulnerabilities.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-amber-500/40">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-amber-600" />
                  Regulatory compliance determination
                </CardTitle>
                <CardDescription className="text-sm mt-1">The tools do not assess whether your specific deployment triggers obligations under TRAIGA, EU AI Act, HIPAA, NYC LL 144, or other regulations. Compliance depends on jurisdiction, data types, use case, and user population.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-amber-500/40">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-amber-600" />
                  Vendor security verification
                </CardTitle>
                <CardDescription className="text-sm mt-1">The tools do not verify whether your AI vendor actually enforces the controls they claim. Use the <Link href="/ai-vendor-due-diligence-checklist" className="text-primary hover:underline">vendor due-diligence checklist</Link> for structured procurement evaluation.</CardDescription>
              </CardHeader>
            </Card>
          </div>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm text-foreground/90">
              <strong>Need comprehensive analysis?</strong> The{' '}
              <Link href="/solutions/haiec/exposure-assessment" className="text-primary font-medium hover:underline">HAIEC AI Exposure Assessment</Link>{' '}
              performs deterministic code analysis, runtime adversarial testing, and produces evidence-grade compliance documentation.
            </p>
          </div>
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

      {/* Industry Coverage */}
      <Section className="pt-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Industry Coverage</h2>
          <p className="text-sm text-muted-foreground">The blast radius calculator includes one-click scenario presets for common industry deployments. Here is how the risk factors differ by industry.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-l-4 border-l-red-500/40">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4 text-red-600" />
                  Healthcare (PHI)
                </CardTitle>
                <CardDescription className="text-sm mt-1 space-y-1.5">
                  <span className="block"><strong className="text-foreground">Typical profile:</strong> PHI data, 100–1,000+ users, action tools (lab lookups, order entry), RAG from EHR, internal server deployment.</span>
                  <span className="block"><strong className="text-foreground">Key risks:</strong> RAG poisoning via clinical documents, PHI leakage in model prompts to external APIs, unauthorized access through shared clinical workstations, HIPAA breach notification obligations.</span>
                  <span className="block"><strong className="text-foreground">Regulatory:</strong> HIPAA, TRAIGA (if using AI for clinical decisions), state health privacy laws.</span>
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-orange-500/40">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4 text-orange-600" />
                  Financial Services
                </CardTitle>
                <CardDescription className="text-sm mt-1 space-y-1.5">
                  <span className="block"><strong className="text-foreground">Typical profile:</strong> Confidential/financial data, 100–1,000+ users, action tools (trade tickets, email), RAG from research corpus, auto-approval enabled.</span>
                  <span className="block"><strong className="text-foreground">Key risks:</strong> Indirect injection via uploaded research notes, unauthorized trade execution, insider data leakage through shared RAG corpus, SEC/FINRA reporting obligations.</span>
                  <span className="block"><strong className="text-foreground">Regulatory:</strong> SEC, FINRA, SOX, GDPR (if EU clients), TRAIGA.</span>
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-red-500/40">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4 text-red-600" />
                  HR / Hiring
                </CardTitle>
                <CardDescription className="text-sm mt-1 space-y-1.5">
                  <span className="block"><strong className="text-foreground">Typical profile:</strong> PII/biometric data, 10–100 users, admin tools (candidate status changes), cloud deployment, RAG from resume database.</span>
                  <span className="block"><strong className="text-foreground">Key risks:</strong> Algorithmic bias in screening decisions, disparate impact on protected classes, unauthorized use of biometric data (facial analysis), missing bias audits, failure to notify candidates of AI use.</span>
                  <span className="block"><strong className="text-foreground">Regulatory:</strong> NYC Local Law 144 (bias audits + candidate notice), Illinois HB-3773 + AIVIA, California FEHA regulations (Oct 2025), Colorado SB 189 (Jan 2027), EU AI Act Annex III (high-risk), Texas HB 149, Maryland HB 1202.</span>
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-amber-500/40">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4 text-amber-600" />
                  Legal
                </CardTitle>
                <CardDescription className="text-sm mt-1 space-y-1.5">
                  <span className="block"><strong className="text-foreground">Typical profile:</strong> Confidential/privileged data, 10–100 users, read-only tools, RAG from case documents, internal server.</span>
                  <span className="block"><strong className="text-foreground">Key risks:</strong> Privilege waiver through AI processing, RAG poisoning via opposing party documents, unauthorized disclosure of case strategy, malpractice exposure from hallucinated citations.</span>
                  <span className="block"><strong className="text-foreground">Regulatory:</strong> State bar AI ethics rules, ABA Model Rules 1.1 (competence) and 1.6 (confidentiality), EU AI Act (if EU clients).</span>
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-amber-500/40">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4 text-amber-600" />
                  Retail / E-commerce
                </CardTitle>
                <CardDescription className="text-sm mt-1 space-y-1.5">
                  <span className="block"><strong className="text-foreground">Typical profile:</strong> Public/internal data, 1,000+ users, read-only or write tools, cloud or public deployment, RAG from product catalog.</span>
                  <span className="block"><strong className="text-foreground">Key risks:</strong> Customer PII exposure through chatbot interactions, prompt injection via customer messages, pricing manipulation through RAG poisoning of product data, CCPA/GDPR data deletion obligations.</span>
                  <span className="block"><strong className="text-foreground">Regulatory:</strong> CCPA, GDPR, state consumer privacy laws, FTC AI guidelines.</span>
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-green-500/40">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  Small Business
                </CardTitle>
                <CardDescription className="text-sm mt-1 space-y-1.5">
                  <span className="block"><strong className="text-foreground">Typical profile:</strong> Internal data, 1–10 users, read-only tools, local or internal server, no RAG or MCP.</span>
                  <span className="block"><strong className="text-foreground">Key risks:</strong> Shadow AI (employees using personal ChatGPT with company data), lack of formal AI policy, missing vendor review for adopted SaaS AI tools, no incident response plan.</span>
                  <span className="block"><strong className="text-foreground">Regulatory:</strong> Generally lighter obligations, but CCPA (if California customers), GDPR (if EU customers), and industry-specific rules may still apply.</span>
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </Section>

      {/* Scenario Example */}
      <Section className="pt-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">How to Use These Tools Together</h2>
          <div className="rounded-lg border border-border p-6 space-y-4">
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">Scenario: Healthcare internal AI assistant</p>
              <p className="text-sm text-muted-foreground">A hospital IT team is building a Streamlit application that lets clinicians query patient records using natural language. The system uses RAG to retrieve from the EHR, connects to an MCP server for lab-result lookups, and is deployed on an internal server accessible to 500+ clinicians.</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">Step-by-step assessment:</p>
              <ol className="ml-4 space-y-2 text-sm text-muted-foreground">
                <li className="list-decimal"><strong className="text-foreground">Blast Radius Calculator:</strong> Select PHI data, 101–1,000 users, action tool access, internal server deployment, MCP connected, RAG enabled. Result: <span className="text-red-600 font-medium">Critical (score 31/44)</span>. The tool recommends mandatory adversarial testing and dual authorization.</li>
                <li className="list-decimal"><strong className="text-foreground">Agent Matrix:</strong> Toggle read on patient records (high), action on lab-result lookup (critical), and admin on user management (critical). The matrix flags 2 critical combinations — confirming that admin access should be removed from the agent scope entirely.</li>
                <li className="list-decimal"><strong className="text-foreground">Scenario Library:</strong> Review the indirect prompt injection via RAG document scenario (PI-02). The team realizes that a malicious document uploaded to the EHR knowledge base could instruct the model to call the lab-result tool and exfiltrate results. They add document provenance tracking and human approval for all action tools.</li>
                <li className="list-decimal"><strong className="text-foreground">Risk Register:</strong> Create entries for each identified risk with owners from IT, Security, and Compliance. Set the RAG poisoning risk to High likelihood given that clinicians can upload documents.</li>
                <li className="list-decimal"><strong className="text-foreground">Vendor Checklist:</strong> Evaluate the EHR vendor and MCP server provider against the 60-item checklist before signing the integration agreement.</li>
              </ol>
            </div>
          </div>
          <div className="rounded-lg border border-border p-6 space-y-4">
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">Scenario: HR department deploying AI resume screening</p>
              <p className="text-sm text-muted-foreground">A mid-size company (200 employees) in New York City and California wants to use an AI-powered ATS that ranks resumes and scores video interviews. The HR team uses the tools to assess risk and compliance obligations.</p>
            </div>
            <div className="space-y-2">
              <ol className="ml-4 space-y-2 text-sm text-muted-foreground">
                <li className="list-decimal"><strong className="text-foreground">Blast Radius Calculator:</strong> Load the HR/Hiring preset. Result: confidential data (PII), 50 users, admin tools, cloud deployment, RAG enabled, auto-approval. Score: <span className="text-red-600 font-medium">Critical (score 29/44)</span> — driven by admin access to candidate records and auto-approval without human review.</li>
                <li className="list-decimal"><strong className="text-foreground">Agent Matrix:</strong> Toggle admin on candidate records (critical) and read on job descriptions (low). The matrix immediately flags admin access as critical-risk — the tool should not have admin authority over candidate status without human approval.</li>
                <li className="list-decimal"><strong className="text-foreground">Risk Register:</strong> Create entries for algorithmic bias (R-16), missing bias audit (R-17), candidate notification failure (R-18), and unauthorized biometric analysis (R-19). Set all to High likelihood given multi-state operations.</li>
                <li className="list-decimal"><strong className="text-foreground">Vendor Checklist:</strong> Evaluate the ATS vendor against the full 60-item checklist. Require evidence of independent bias audit (NYC LL 144), compliance with Illinois AIVIA (video interview consent), California FEHA alignment, and EU AI Act Annex III high-risk classification documentation.</li>
                <li className="list-decimal"><strong className="text-foreground">Incident Evidence Checklist:</strong> Prepare the evidence preservation plan in advance — if a candidate files a discrimination claim, the company must preserve all screening decisions, model outputs, scoring criteria, and bias audit records for 4 years (California FEHA requirement).</li>
              </ol>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="pt-8" id="faq">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">FAQ</h2>
          {[
            {
              q: 'Are these tools free to use?',
              a: 'Yes. All three interactive tools are free and run entirely in your browser. No data is sent to a server. The downloadable checklists and templates are available through the lead magnet form.',
            },
            {
              q: 'Do these tools work for non-Streamlit AI applications?',
              a: 'Yes. While the tools were designed alongside the Streamlit architecture guide, the risk factors, agent capabilities, and attack scenarios apply to any internal AI application built with Python, React, or any other framework. The blast radius factors (data type, user scale, tool access, deployment model) are framework-agnostic.',
            },
            {
              q: 'How often should I re-run the blast radius calculation?',
              a: 'Re-run it whenever the application architecture changes: new data sources, new tool integrations, new MCP servers, expanded user populations, or deployment model changes. At minimum, review quarterly as part of your AI governance cycle.',
            },
            {
              q: 'Can I use the scenario library for security training?',
              a: 'Yes. The scenario library is designed for both planning and training. Each scenario includes a concrete attack example and defense strategies, making it suitable for tabletop exercises, developer training, and security awareness sessions.',
            },
            {
              q: 'What should I do if the blast radius calculator shows Critical?',
              a: 'Do not deploy without a completed security assessment. Follow the recommendations provided with the Critical result, and consider engaging a professional AI security assessment. The HAIEC AI Exposure Assessment provides deterministic analysis, adversarial testing, and evidence-grade compliance outputs.',
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

      {/* Cross-link */}
      <Section className="pt-4">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
            <p>For a comprehensive guide on how NIST AI RMF, ISO/IEC 42001, SOC 2, and AI-specific security testing fit together, read <Link href="/how-to-secure-and-govern-ai" className="text-primary font-medium hover:underline">How to Secure and Govern AI: NIST, ISO and SOC 2</Link>. For AI voice agent-specific security, failure modes, and deployment architecture, read <Link href="/why-ai-voice-agents-fail-in-production" className="text-primary font-medium hover:underline">Why AI Voice Agents Fail in Production</Link>. For the complete production architecture behind Kestrel Voice — telephony, adaptive orchestration, RAG pipeline, tools, degradation, and security — read <Link href="/ai-voice-agent-architecture" className="text-primary font-medium hover:underline">AI Voice Agent Architecture: How Kestrel Voice Works</Link>.</p>
          </div>
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
