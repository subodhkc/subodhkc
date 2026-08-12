import Link from 'next/link'
import Image from 'next/image'
import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import Grid from '@/components/Grid'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import {
  Shield,
  FileCheck,
  TrendingUp,
  Layers,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react'

export const metadata = {
  title: 'HAIEC - AI Compliance & Governance Platform | Subodh KC',
  description:
    'HAIEC is an evidence-first AI governance platform. EU AI Act compliance, NIST AI RMF, ISO 42001, NYC LL144 bias audits, runtime adversarial testing, and audit-grade evidence generation. Features precision drift detection, Red Audit Kit, and Cognitive Systems Management.',
  alternates: {
    canonical: 'https://subodhkc.com/solutions/haiec',
  },
  openGraph: {
    title: 'HAIEC - AI Compliance & Governance Platform',
    description:
      'Evidence-first frameworks for behavioral AI governance. AI Governance Execution Framework, AI readiness assessments, and audit-grade evidence for enterprise compliance.',
    url: 'https://subodhkc.com/solutions/haiec',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HAIEC - AI Compliance & Governance Platform',
    description: 'complete AI governance, compliance, and ethical deployment platform. EU AI Act, NIST AI RMF, ISO 42001 aligned.',
  },
  keywords: [
    'HAIEC',
    'AI compliance platform',
    'AI governance',
    'EU AI Act compliance',
    'NIST AI RMF',
    'ISO 42001',
    'NYC LL144 bias audit',
    'AI evidence generation',
    'AI security testing',
'AI Governance Execution Framework',
    'AI drift detection',
    'Red Audit Kit',
    'Cognitive Systems Management',
    'AI regulatory compliance',
    'Subodh KC',
  ],
}

export default function HAIECPage() {
  const modules = [
    {
      icon: Shield,
      title: 'Compliance Engine',
      description:
        'Real-time monitoring and enforcement of AI governance policies. Automated compliance checks against GDPR, AI Act, and industry-specific regulations.',
      features: [
        'Policy enforcement automation',
        'Regulatory mapping',
        'Compliance reporting',
        'Audit trail generation',
      ],
    },
    {
      icon: FileCheck,
      title: 'Red Audit Kit',
      description:
        'complete assessment framework for AI systems. Evaluates models, data pipelines, and deployment infrastructure against compliance and risk criteria.',
      features: [
        'Multi-layer system audits',
        'Risk scoring methodology',
        'Remediation roadmaps',
        'Compliance gap analysis',
      ],
    },
    {
      icon: TrendingUp,
      title: 'Precision Drift Detector',
      description:
        'Advanced monitoring for model drift, data drift, and concept drift. Goes beyond basic metrics to identify subtle degradation patterns before they impact production.',
      features: [
        'Statistical drift detection',
        'Performance monitoring',
        'Alert configuration',
        'Historical analysis',
      ],
    },
    {
      icon: Layers,
      title: 'LegacyShift',
      description:
        'Structured methodology for modernizing legacy AI systems. Addresses technical debt, compliance gaps, and operational inefficiencies in aging ML infrastructure.',
      features: [
        'Migration planning',
        'Risk assessment',
        'Incremental modernization',
        'Zero-downtime transitions',
      ],
    },
  ]

  const capabilities = [
    'Static AI Security Analysis',
    'Runtime Adversarial Testing',
    'Audit-Grade Evidence Generation',
    'EU AI Act Compliance Reports',
    'NYC LL144 Bias Audit Attestation',
    'Risk Management Framework',
    'Data Governance Tools',
    'Technical Documentation',
    'Transparency & Instructions',
    'EU Declaration of Conformity',
  ]

  const csm = {
    title: 'Cognitive Systems Management (CSM)',
    description:
      'The foundational methodology underlying HAIEC. CSM defines four governance domains - Enterprise, Project, Code, and UX. The AI Governance Execution Framework operationalizes and extends CSM with six cross-functional governance functions.',
    domains: [
      {
        name: 'CSM-Enterprise',
        question: 'Who has authority, who owns the outcome and risk, and what organizational boundaries apply?',
        components: ['Policy Framework', 'Risk Assessment', 'Data Stewardship', 'Strategic Mandate'],
      },
      {
        name: 'CSM-Project',
        question: 'What evidence should justify continuing, changing, scaling or stopping an AI initiative?',
        components: ['Business Case Definition', 'Controlled Testing', 'Scale Decision Framework', 'Playbook Documentation'],
      },
      {
        name: 'CSM-Code',
        question: 'How should software engineering governance change when AI contributes to implementation?',
        components: ['Development Standards', 'Security Protocols', 'Human Oversight', 'Traceability Logging'],
      },
      {
        name: 'CSM-UX',
        question: 'What do humans need to understand, supervise, challenge and appropriately use AI-supported outcomes?',
        components: ['Impact Analysis', 'Explainability Design', 'Capability Development', 'Adoption Measurement'],
      },
    ],
  }

  const useCases = [
    {
      industry: 'Financial Services',
      challenge: 'Meeting AI Act compliance while maintaining model performance',
      solution:
        'Implemented HAIEC compliance engine with automated policy enforcement and continuous monitoring',
      result: 'Established continuous compliance monitoring with minimal impact on model performance',
    },
    {
      industry: 'Healthcare',
      challenge: 'Auditing legacy AI systems for HIPAA and FDA requirements',
      solution:
        'Deployed Red Audit Kit with LegacyShift methodology for systematic modernization',
      result: 'Systematic modernization roadmap reduced compliance preparation time significantly',
    },
    {
      industry: 'Enterprise SaaS',
      challenge: 'Detecting and managing model drift across a large portfolio of production models',
      solution:
        'Integrated precision drift detection with automated alerting and remediation workflows',
      result: 'Improved drift detection coverage and reduced incident response time through automated alerting',
    },
  ]

  return (
    <>
      <Hero
        subtitle="AI Compliance & Governance Platform"
        title={
          <>
            Your AI is Making Decisions.
            <br />
            <span className="gradient-text">Can You Defend Them?</span>
          </>
        }
        description="Evidence-first frameworks for behavioral AI governance. AI Governance Execution Framework and AI readiness assessments for enterprise compliance. Not a dashboard - an evidence layer."
      >
        <div className="flex flex-wrap gap-4 justify-center">
          <a href="https://www.haiec.com" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="group animate-glow">
              Visit HAIEC Platform
              <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </a>
          <Link href="/contact">
            <Button size="lg" variant="outline">
              Request Demo
            </Button>
          </Link>
        </div>
      </Hero>

      <Section
        subtitle="Core Modules"
        title="Enterprise-Grade AI Governance"
        description="Built from real-world experience implementing AI compliance at Fortune 50 scale. Each module addresses critical gaps in traditional governance approaches."
        sectionNum="§01"
      >
        <Grid cols={2}>
          {modules.map((module, index) => {
            const Icon = module.icon
            return (
              <Reveal key={index} delay={index * 80} style="up">
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {module.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Reveal>
            )
          })}
        </Grid>
      </Section>

      <Section className="bg-secondary/20" sectionNum="§02">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Platform Capabilities</h2>
          <p className="text-center text-muted-foreground mb-8">
            HAIEC provides a complete suite of tools for AI compliance and governance
          </p>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              {capabilities.map((capability, index) => (
                <Reveal key={index} delay={index * 50} style="left"
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{capability}</span>
                </Reveal>
              ))}
            </div>
            <Reveal style="left" className="relative">
              <div className="relative shadow-2xl">
                <Image
                  src="/haiec process.png"
                  alt="HAIEC Process Flow"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      <Section
        subtitle="Methodology"
        title="Cognitive Systems Management (CSM)"
        description={csm.description}
        sectionNum="§03"
      >
        <Grid cols={2}>
          {csm.domains.map((domain, index) => (
            <Reveal key={index} delay={index * 80} style="up">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-xl">{domain.name}</CardTitle>
                  <CardDescription className="text-sm mt-1">{domain.question}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {domain.components.map((comp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                        <span className="text-muted-foreground">{comp}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </Grid>
        <div className="mt-12 max-w-3xl mx-auto text-center">
          <p className="text-lg text-muted-foreground leading-relaxed">
            CSM connects organizational governance, initiative execution, technical development and human interaction so governance decisions remain visible across the lifecycle of an AI-enabled system.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Learn more about the{' '}
            <Link href="/cognitive-systems-management" className="text-primary font-medium hover:underline">full CSM framework</Link>{' '}
            or explore the{' '}
            <Link href="/architecture-decision-master-sheet" className="text-primary font-medium hover:underline">Architecture Decision Master Sheet</Link>.
          </p>
        </div>
      </Section>

      <Section sectionNum="§04">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Why HAIEC?</h2>
          <div className="grid md:grid-cols-2 gap-8 items-start mb-12">
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-3">Evidence-First Approach</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Dashboards are not evidence. HAIEC generates audit-grade documentation that stands up to regulatory scrutiny.
                  Every claim is backed by deterministic testing and SHA-256 cryptographic hashing - tamper-evident evidence you can verify independently.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-3">Production-Ready</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Not a research project. HAIEC is designed for enterprise environments, with tools and frameworks
                  built from real-world AI compliance work at scale.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-3">Framework Aligned</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Built on research published in Zenodo and aligned with EU AI Act, NIST AI RMF, ISO 42001, and NYC Local Law 144.
                  Deterministic engines with open-source foundations you can verify - llmverify on npm and PyPI, plus the HAIEC GitHub Action for CI.
                </p>
              </Card>
            </div>
            <Reveal style="right" className="relative">
              <div className="relative shadow-2xl">
                <Image
                  src="/Ai Security Process flow.png"
                  alt="AI Security Process Flow"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      <Section
        subtitle="Proven Results"
        title="Real-World Impact"
        sectionNum="§05"
      >
        <div className="space-y-8">
          {useCases.map((useCase, index) => (
            <Reveal key={index} delay={index * 80} style="up">
              <Card>
                <CardHeader>
                  <div className="inline-flex items-center rounded-full border border-accent/20 bg-accent/10 px-3 py-1 mb-3 w-fit">
                    <span className="text-xs font-medium text-accent">{useCase.industry}</span>
                  </div>
                  <CardTitle className="text-xl">Challenge</CardTitle>
                  <CardDescription>{useCase.challenge}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wider">
                      Solution
                    </h4>
                    <p className="text-muted-foreground">{useCase.solution}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wider">
                      Result
                    </h4>
                    <p className="text-primary font-medium">{useCase.result}</p>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        subtitle="Platform Access"
        title="Choose Your Engagement"
        sectionNum="§06"
      >
        <Grid cols={3}>
          <Card>
            <CardHeader>
              <CardTitle>Platform License</CardTitle>
              <CardDescription>
                Self-service access to HAIEC platform and tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-3xl font-bold">Custom</p>
                <p className="text-sm text-muted-foreground">Based on scale</p>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Full platform access</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Technical documentation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Community support</span>
                </li>
              </ul>
              <Link href="/contact">
                <Button className="w-full">Contact sales</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-primary">
            <CardHeader>
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 mb-2 w-fit">
                <span className="text-xs font-medium text-primary">Most Popular</span>
              </div>
              <CardTitle>Guided Implementation</CardTitle>
              <CardDescription>
                Platform access plus implementation support
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-3xl font-bold">Custom</p>
                <p className="text-sm text-muted-foreground">3-6 month engagement</p>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Everything in Platform</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Implementation support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Custom framework adaptation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Team training</span>
                </li>
              </ul>
              <Link href="/contact">
                <Button className="w-full">Get started</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Enterprise Partnership</CardTitle>
              <CardDescription>
                Full strategic engagement with ongoing support
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-3xl font-bold">Custom</p>
                <p className="text-sm text-muted-foreground">Long-term partnership</p>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Everything in Guided</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Executive advisory</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Dedicated support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Custom development</span>
                </li>
              </ul>
              <Link href="/contact">
                <Button variant="outline" className="w-full">
                  Discuss partnership
                </Button>
              </Link>
            </CardContent>
          </Card>
        </Grid>
      </Section>

      <Section className="pt-8">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
            <p>Learn how HAIEC fits into the complete AI compliance stack: read <Link href="/how-to-secure-and-govern-ai" className="text-primary font-medium hover:underline">How to Secure and Govern AI: NIST, ISO and SOC 2</Link> - the seven layers of AI compliance, framework comparison, and implementation roadmap. For AI voice agent-specific compliance, security, and deployment architecture, read <Link href="/why-ai-voice-agents-fail-in-production" className="text-primary font-medium hover:underline">Why AI Voice Agents Fail in Production</Link>.</p>
          </div>
        </div>
      </Section>

      <CTA
        title="Ready to Verify Your AI Controls?"
        description="Join enterprise teams building compliant AI systems with HAIEC. Schedule a demo to see how we can help your organization."
        primaryButton={{ text: 'Visit HAIEC.com', href: 'https://www.haiec.com' }}
        secondaryButton={{ text: 'Contact for Demo', href: '/contact' }}
      />
    </>
  )
}
