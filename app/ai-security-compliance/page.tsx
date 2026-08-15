import Link from 'next/link'
import Hero from '@/components/Hero'
import Section from '@/components/Section'
import Grid from '@/components/Grid'
import { Reveal } from '@/components/Reveal'
import { SecurityComplianceIntakeForm } from '@/components/commercial/SecurityComplianceIntakeForm'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Shield,
  AlertTriangle,
  FileText,
  ArrowRight,
  CheckCircle2,
  Lock,
  Scan,
  Scale,
  Building2,
  Microscope,
  ClipboardCheck,
} from 'lucide-react'

export const metadata = {
  title: 'AI Security Assessment & Compliance Review | Subodh KC',
  description:
    'Understand how your AI systems, risks and controls fit together. AI security assessment, compliance review, vendor risk, hiring bias, and documentation suitable for audits.',
  alternates: {
    canonical: 'https://subodhkc.com/ai-security-compliance',
  },
  openGraph: {
    title: 'AI Security Assessment & Compliance Review | Subodh KC',
    description:
      'Understand how your AI systems, risks and controls fit together. AI security assessment, compliance review, vendor risk, hiring bias, and documentation suitable for audits.',
    url: 'https://subodhkc.com/ai-security-compliance',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Security Assessment & Compliance Review | Subodh KC',
    description: 'AI security assessment, compliance review, vendor risk, hiring bias, and documentation suitable for audits.',
  },
  keywords: [
    'AI security assessment',
    'AI compliance assessment',
    'AI risk assessment',
    'AI vendor risk',
    'AI hiring bias',
    'AI application security',
    'AI governance controls',
    'AI security audit',
    'AI controls review',
    'AI compliance consulting',
    'Subodh KC',
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'AI Security & Compliance Review', item: 'https://subodhkc.com/ai-security-compliance' },
  ],
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'AI Security & Compliance Review',
  description: 'AI security assessment and compliance review covering AI systems, data, vendors, controls, human oversight, evidence, and regulatory considerations.',
  url: 'https://subodhkc.com/ai-security-compliance',
  provider: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
  serviceType: 'AI Security & Compliance Review',
  areaServed: 'Global',
}

const securityQuestions = [
  'What AI systems are we using?',
  'What data do they process?',
  'Which vendors are involved?',
  'Is sensitive information involved?',
  'What controls do we have?',
  'What controls are missing?',
  'Where is human oversight required?',
  'What evidence do we have?',
  'What improvements should we prioritize?',
  'Which regulatory considerations apply?',
  'Do our hiring workflows raise AI bias questions?',
  'What documentation should we maintain?',
  'What should we do now vs later?',
  'Which assessment or tool is appropriate for our situation?',
  'Can we show evidence to a customer or auditor?',
  'Are our AI tools safe to use with customer data?',
  'What happens if an AI tool is compromised?',
  'How do we explain AI decisions to stakeholders?',
]

const assessmentAreas = [
  { icon: AlertTriangle, title: 'Prompt Injection Testing', description: 'Adversarial testing of your AI system prompts. We attempt to override instructions, extract system prompts, and manipulate outputs. Every finding includes reproduction steps and remediation guidance.' },
  { icon: Scan, title: 'RAG Data Integrity Review', description: 'Analysis of your retrieval-augmented generation pipeline for data integrity risks. We check document ingestion, embedding security, and retrieval authorization.' },
  { icon: Lock, title: 'Tool Abuse & MCP Security', description: 'Review of tool definitions, MCP server configurations, and model-driven authorization. We identify where the AI can take actions it should not be allowed to take.' },
  { icon: Building2, title: 'Tenant Isolation Review', description: 'Verification that your multi-tenant AI system properly isolates data, prompts, and outputs between customers. We check for cross-tenant leakage vectors.' },
  { icon: Shield, title: 'Authentication & Authorization', description: 'Review of auth flows for AI endpoints, API key management, rate limiting, and access controls. We identify where unauthorized users could access AI capabilities.' },
  { icon: FileText, title: 'Compliance Documentation', description: 'Documentation suitable for EU AI Act, NIST AI RMF, ISO 42001, and SOC 2 audits. Test results, control mappings, and remediation roadmaps.' },
]

const frameworks = [
  { name: 'EU AI Act', description: 'Risk classification, transparency obligations, and conformity assessment support.' },
  { name: 'NIST AI RMF', description: 'Govern, Map, Measure, Manage functions mapped to your AI systems and controls.' },
  { name: 'ISO 42001', description: 'AI Management System alignment and gap analysis for certification readiness.' },
  { name: 'SOC 2', description: 'Security, availability, and confidentiality controls applied to AI infrastructure.' },
  { name: 'NYC LL 144', description: 'Bias audit requirements for automated employment decision tools.' },
  { name: 'Colorado AI Act', description: 'Consumer protection and transparency requirements for high-risk AI systems.' },
  { name: 'Texas TRAIGA', description: 'Texas Responsible AI Governance Act requirements and compliance evidence.' },
]

const process = [
  { step: '1', title: 'Scope & Architecture Review', description: 'We review your AI system architecture, data flows, tool integrations, and regulatory environment. Define the assessment scope and compliance targets.' },
  { step: '2', title: 'Adversarial Testing', description: 'Hands-on testing of your AI system: prompt injection attempts, RAG data integrity risks, tool abuse scenarios, and tenant isolation verification.' },
  { step: '3', title: 'Control Gap Analysis', description: 'Map findings to compliance frameworks (EU AI Act, NIST AI RMF, ISO 42001). Identify gaps, classify severity, and prioritize remediation.' },
  { step: '4', title: 'Evidence & Reporting', description: 'Full evidence package: test results, attack transcripts, control gap documentation, remediation roadmap, and compliance-aligned documentation for auditors.' },
]

const faqItems = [
  {
    question: 'What is an AI security assessment?',
    answer: 'An AI security assessment evaluates your AI systems, data flows, vendors, controls, and human oversight. It covers AI-specific attack surfaces like prompt injection, RAG data integrity, tool abuse, and tenant isolation. You receive prioritized findings, remediation guidance, and documentation suitable for audits.',
  },
  {
    question: 'How is this different from a regular security audit?',
    answer: 'Traditional security audits focus on network, infrastructure, and compliance checklists. This assessment focuses on AI-specific attack surfaces that traditional security tools do not typically cover: prompt injection, RAG authorization, tool/function abuse, agent privilege boundaries, and AI supply-chain dependencies.',
  },
  {
    question: 'Do you review AI vendor risk?',
    answer: 'Yes. The assessment covers vendor data handling, model provider security, API credential protection, data residency, and contractual considerations. You receive a vendor risk summary with prioritized recommendations.',
  },
  {
    question: 'Can you help with EU AI Act compliance?',
    answer: 'Yes. The assessment maps your AI systems to EU AI Act risk classifications, transparency obligations, and conformity assessment requirements. This produces documentation that supports your compliance process.',
  },
  {
    question: 'Do you test AI hiring tools for bias?',
    answer: 'Yes. The assessment covers AI-assisted hiring workflows including resume screening, job description analysis, and automated decision tools. This addresses NYC LL 144 bias audit requirements and similar regulations.',
  },
  {
    question: 'What evidence do I receive?',
    answer: 'You receive test results, attack transcripts, control gap documentation, remediation roadmap, and compliance-aligned documentation mapped to frameworks like EU AI Act, NIST AI RMF, ISO 42001, and SOC 2.',
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

export default function AISecurityCompliancePage() {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <Hero
        subtitle="AI Security & Compliance"
        title={
          <>
            Understand how your AI systems,
            <br />
            <span className="gradient-text">risks and controls fit together.</span>
          </>
        }
        description="AI security assessment and compliance review. Detailed documentation, control gap analysis, and clear recommendations for regulators, auditors, and enterprise customers."
      >
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="#request">
            <Button size="lg" className="group animate-glow">
              Request a Review
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/ai-security-tools">
            <Button size="lg" variant="outline">
              Try Free Security Tools
            </Button>
          </Link>
        </div>
      </Hero>

      {/* Questions We Help Answer */}
      <Section
        subtitle="Questions We Help Answer"
        title="Your AI security and compliance questions, answered with evidence."
        sectionNum="§01"
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-3">
            {securityQuestions.map((q, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-3">
                <span className="text-primary mt-0.5 flex-shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                <span className="text-sm text-foreground">{q}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* SaaS Pathway */}
      <Section
        subtitle="Building a SaaS or AI Product?"
        title="A specialized pathway for SaaS and AI product security."
        sectionNum="§02"
        className="bg-secondary/20"
      >
        <div className="max-w-4xl mx-auto">
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="text-xl">SaaS &amp; AI Security Review</CardTitle>
              <CardDescription className="text-base mt-2">
                If you are building a SaaS or AI product, you need a specialized review that covers
                tenant isolation, AI application security, reproducible evidence, and buyer-shareable
                security records for enterprise due diligence.
              </CardDescription>
            </CardHeader>
          </Card>
          <div className="mt-4">
            <Link href="/saas-security-review">
              <Button size="lg" className="group">
                Go to SaaS &amp; AI Security Review
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </Section>

      {/* What We Test */}
      <Section
        subtitle="What We Review"
        title="AI-specific attack surfaces and control gaps."
        description="Generic security scans check for known vulnerabilities. We analyze the AI-specific attack surface that standard security tools do not typically cover."
        sectionNum="§03"
      >
        <Grid cols={3}>
          {assessmentAreas.map((item, i) => {
            const Icon = item.icon
            return (
              <Reveal key={i} delay={i * 60} style="up">
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">{item.title}</CardTitle>
                    <CardDescription className="text-sm mt-1">{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Reveal>
            )
          })}
        </Grid>
      </Section>

      {/* Compliance Frameworks */}
      <Section
        subtitle="Compliance Alignment"
        title="Evidence for the frameworks that matter"
        sectionNum="§04"
      >
        <div className="max-w-4xl mx-auto">
          <Grid cols={3}>
            {frameworks.map((fw, i) => (
              <Reveal key={i} delay={i * 50} style="up">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      {fw.name}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">{fw.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Reveal>
            ))}
          </Grid>
        </div>
      </Section>

      {/* Process */}
      <Section
        subtitle="How It Works"
        title="Four-phase assessment process"
        sectionNum="§05"
        className="bg-secondary/20"
      >
        <div className="max-w-3xl mx-auto">
          <div className="space-y-3">
            {process.map((phase) => (
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

      {/* Evidence */}
      <Section
        subtitle="Why Trust This"
        title="Evidence-grade methodology, not checklists."
        sectionNum="§06"
      >
        <div className="max-w-4xl mx-auto space-y-4">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-lg">Published governance methodology</CardTitle>
              <CardDescription className="text-base">
                The review methodology is grounded in a published AI governance methodology covering
                Enterprise, Project, Code, and UX domains. Applied in production AI deployments.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-lg">Adversarial testing, not questionnaires</CardTitle>
              <CardDescription className="text-base">
                Hands-on testing of your AI system: prompt injection, RAG poisoning, tool abuse,
                tenant isolation, and authorization review. Findings include reproduction steps
                and remediation guidance.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-lg">Free interactive tools</CardTitle>
              <CardDescription className="text-base">
                Before you commit to a full review, try the free interactive AI security tools: blast radius
                calculator, agent read/write/action matrix, and prompt injection scenario library.
              </CardDescription>
            </CardHeader>
          </Card>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/saas-security-review">
              <Button variant="outline" size="sm">SaaS &amp; AI Security Review <ArrowRight className="ml-2 h-3 w-3" /></Button>
            </Link>
            <Link href="/ai-security-tools">
              <Button variant="outline" size="sm">Free Security Tools <ArrowRight className="ml-2 h-3 w-3" /></Button>
            </Link>
            <Link href="/ai-advisor">
              <Button variant="outline" size="sm">AI Advisor Desk <ArrowRight className="ml-2 h-3 w-3" /></Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" size="sm">All Services <ArrowRight className="ml-2 h-3 w-3" /></Button>
            </Link>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section
        subtitle="FAQ"
        title="Common questions about AI security assessment"
        sectionNum="§07"
        className="bg-secondary/20"
      >
        <div className="max-w-3xl mx-auto space-y-4">
          {faqItems.map((item, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="text-base">{item.question}</CardTitle>
                <CardDescription className="text-sm mt-2">{item.answer}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        subtitle="Request a Review"
        title="Understand your AI security posture with evidence"
        description="Tell me about your AI systems, regulatory environment, and what evidence your customers or auditors are asking for. I will tell you whether a focused security assessment, compliance review, or combined engagement fits. Reviews are limited and scoped based on architecture."
        sectionNum="§08"
        className="bg-secondary/20"
        id="request"
      >
        <div style={{ maxWidth: 640 }}>
          <SecurityComplianceIntakeForm />
        </div>
      </Section>
    </>
  )
}
