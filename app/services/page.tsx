import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import { LeadMagnetCard } from '@/components/LeadMagnetCard'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Grid from '@/components/Grid'
import Link from 'next/link'
import {
  Shield, Briefcase, Users, Zap, CheckCircle2, Target, Award,
  Network, Database, Workflow, Bot, Phone, Activity, Lock, FileCheck, Gauge, Cpu, Radio, Layers, ArrowRight, MessageSquare,
} from 'lucide-react'

export const metadata = {
  title: 'AI Architecture, Deployment & Governance Services | Subodh KC',
  description:
    'AI architecture, agentic systems, RAG, MCP integrations, voice AI deployment, compliance automation, and governance frameworks. From pilot to production at enterprise scale.',
  keywords: [
    'AI architecture services',
    'AI deployment',
    'AI governance',
    'agentic AI systems',
    'RAG pipeline architecture',
    'MCP integrations',
    'voice AI deployment',
    'compliance automation',
    'AI consulting',
    'fractional AI executive',
    'enterprise AI',
    'Subodh KC'
  ],
  alternates: {
    canonical: 'https://subodhkc.com/services',
  },
  openGraph: {
    title: 'AI Architecture, Deployment & Governance Services | Subodh KC',
    description:
      'AI architecture, agentic systems, RAG, MCP integrations, voice AI deployment, compliance automation, and governance frameworks. From pilot to production at enterprise scale.',
    url: 'https://subodhkc.com/services',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Architecture, Deployment & Governance | Subodh KC',
    description: 'AI architecture, agentic systems, RAG, MCP, voice AI, compliance automation. From pilot to production.',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://subodhkc.com/services' },
  ],
}

export default function ServicesPage() {
  const pillars = [
    {
      icon: Cpu,
      subtitle: 'Pillar 01',
      title: 'AI Architecture & Integration',
      description:
        'Designing and building production AI systems that integrate with your existing stack - from agentic workflows to enterprise knowledge systems.',
      services: [
        {
          icon: Bot,
          name: 'Agentic AI Systems',
          desc: 'Multi-agent orchestration, tool-use pipelines, and autonomous workflow design with guardrails.',
        },
        {
          icon: Database,
          name: 'RAG & Enterprise Knowledge Systems',
          desc: 'Retrieval-augmented generation pipelines, vector databases, and enterprise knowledge architectures.',
        },
        {
          icon: Network,
          name: 'MCP & API Integrations',
          desc: 'Model Context Protocol servers, API orchestration, and secure data connectors for production AI.',
        },
        {
          icon: Workflow,
          name: 'Workflow & Data Architecture',
          desc: 'End-to-end data pipelines, event-driven architectures, and AI workflow orchestration at scale.',
        },
        {
          icon: Zap,
          name: 'AI Pilot Recovery',
          desc: 'Rescuing stalled AI pilots - diagnosing architecture failures, rebuilding for production, and getting to deployment.',
        },
        {
          icon: Layers,
          name: 'Architecture Decision Master Sheet',
          desc: 'Interactive 25-layer architecture decision sheet with AI development risks, CSM pillar mapping, and Definition of Done.',
          href: '/architecture-decision-master-sheet',
        },
      ],
    },
    {
      icon: Radio,
      subtitle: 'Pillar 02',
      title: 'AI Operations & Deployment',
      description:
        'Deploying AI systems into production - voice agents, customer intake, monitoring, and the operational hardening that keeps systems running.',
      services: [
        {
          icon: Phone,
          name: 'Voice & Chat Agents',
          desc: 'Production voice AI (powered by KestrelVoice) and chat agents for customer-facing operations.',
        },
        {
          icon: Users,
          name: 'Customer Intake & Booking',
          desc: 'AI-driven intake flows, appointment scheduling, and automated customer onboarding pipelines.',
        },
        {
          icon: Network,
          name: 'Human Escalation',
          desc: 'smooth AI-to-human handoff architecture, escalation policies, and context preservation.',
        },
        {
          icon: Activity,
          name: 'Monitoring & Observability',
          desc: 'Real-time AI system monitoring, drift detection, latency tracking, and automated alerting.',
        },
        {
          icon: Gauge,
          name: 'Production Hardening',
          desc: 'Performance optimization, failure mode testing, load testing, and operational readiness reviews.',
        },
      ],
    },
    {
      icon: Shield,
      subtitle: 'Pillar 03',
      title: 'AI Governance & Assurance',
      description:
        'Building governance structures that scale - from readiness assessments to evidence architecture and drift controls.',
      services: [
        {
          icon: Target,
          name: 'Readiness & Applicability Assessments',
          desc: 'Evaluate AI system readiness, regulatory applicability, and organizational maturity before deployment.',
        },
        {
          icon: Lock,
          name: 'AI Security & Compliance',
          desc: 'EU AI Act, NIST AI RMF, ISO 42001, NYC LL144 compliance implementation and audit readiness.',
        },
        {
          icon: FileCheck,
          name: 'Evidence Architecture',
          desc: 'Evidence-grade documentation generation, documentation pipelines, and compliance evidence repositories.',
        },
        {
          icon: Activity,
          name: 'Testing & Drift Controls',
          desc: 'Patent-pending drift detection frameworks, bias testing, and automated quality gates in CI/CD.',
        },
        {
          icon: Briefcase,
          name: 'Governance Operating Models',
          desc: 'AI governance committees, policy frameworks, and operating models that survive contact with real organizations.',
        },
      ],
    },
  ]

  const engagementModels = [
    {
      icon: CheckCircle2,
      title: 'Project-Based',
      description: 'Fixed-scope engagements with clear deliverables and timelines.',
      duration: '3-6 months',
      ideal: 'AI architecture, pilot recovery, compliance implementations, framework development',
    },
    {
      icon: Award,
      title: 'Retainer',
      description: 'Ongoing advisory and strategic guidance with flexible scope.',
      duration: '6-12 months',
      ideal: 'Executive advisory, continuous improvement, governance oversight, strategic planning',
    },
    {
      icon: Users,
      title: 'Fractional Executive',
      description: 'Part-time leadership role embedded in your organization.',
      duration: '12+ months',
      ideal: 'Building AI governance function, team development, long-term transformation',
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Hero
        title={
          <>
            AI Architecture,
            <br />
            <span className="gradient-text">Deployment & Governance</span>
          </>
        }
        description="From agentic workflows and RAG to compliance automation and enterprise governance. I help organizations architect, deploy, and govern production AI systems."
      />

      {pillars.map((pillar, pIndex) => {
        const PillarIcon = pillar.icon
        return (
          <Section
            key={pIndex}
            subtitle={pillar.subtitle}
            title={pillar.title}
            description={pillar.description}
            className={pIndex === 1 ? 'bg-secondary/20' : undefined}
          >
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <PillarIcon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <Grid cols={3}>
                {pillar.services.map((service, sIndex) => {
                  const Icon = service.icon
                  const card = (
                    <Card key={sIndex} className="border-l-4 border-l-primary h-full">
                      <CardHeader>
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                        </div>
                        <CardDescription className="text-sm">
                          {service.desc}
                        </CardDescription>
                        {'href' in service && service.href && (
                          <span className="text-sm text-primary inline-flex items-center gap-1 mt-2">
                            Open tool <ArrowRight className="h-3 w-3" />
                          </span>
                        )}
                      </CardHeader>
                    </Card>
                  )
                  return 'href' in service && service.href ? (
                    <Link key={sIndex} href={service.href} className="block">{card}</Link>
                  ) : (
                    <div key={sIndex}>{card}</div>
                  )
                })}
              </Grid>
            </div>
          </Section>
        )
      })}

      <Section subtitle="How We Work" title="Engagement Models" className="bg-secondary/20">
        <Grid cols={3}>
          {engagementModels.map((model, index) => {
            const Icon = model.icon
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{model.title}</CardTitle>
                  <CardDescription className="space-y-3">
                    <p>{model.description}</p>
                    <div className="pt-2 border-t border-border">
                      <p className="text-sm"><strong>Duration:</strong> {model.duration}</p>
                      <p className="text-sm mt-2"><strong>Ideal for:</strong> {model.ideal}</p>
                    </div>
                  </CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </Grid>
      </Section>

      <Section subtitle="Why Work With Me" title="What Makes This Different" className="bg-secondary/20">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle>Architecture, Not Slides</CardTitle>
              <CardDescription className="text-base">
                I deliver working systems, not strategy decks. Every engagement produces deployable artifacts:
                governance frameworks, evidence pipelines, monitoring dashboards, and operational playbooks your
                teams can use on day one.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle>Compliance Without Velocity Loss</CardTitle>
              <CardDescription className="text-base">
                Governance structures that scale across dozens of teams without breaking delivery cadence.
                CI/CD quality gates, automated evidence generation, and drift detection built into your
                existing pipelines.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle>Engineering-to-Compliance Translation</CardTitle>
              <CardDescription className="text-base">
                I work across infrastructure, model, application, governance, and executive layers.
                Engineering teams, compliance officers, and C-suite stakeholders get aligned around
                a shared understanding of what is built, what is controlled, and what remains open.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle>Tested in Production at Enterprise Scale</CardTitle>
              <CardDescription className="text-base">
                53-application portfolios, $50M+ AI portfolios, 5 patent-pending frameworks. Everything I build
                is designed for production environments with real constraints, real users, and real compliance obligations.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      <Section subtitle="Specialized Service" title="SaaS & AI Security Review" sectionNum="§05">
        <div className="max-w-3xl mx-auto">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Verify tenant isolation and AI application security
              </CardTitle>
              <CardDescription className="text-base">
                A specialized security review for B2B SaaS, AI-built applications, and teams converting
                single-user apps into organization-based multi-tenancy. Tests the tenant boundary across
                authentication, roles, API routes, database queries and storage. Covers Next.js, Supabase RLS,
                Prisma, PostgreSQL and AI-generated applications from Lovable, Bolt, Replit, Cursor and Windsurf.
                From $950.
              </CardDescription>
            </CardHeader>
          </Card>
          <div className="mt-4">
            <Link
              href="/saas-security-review"
              className="text-sm text-primary hover:underline inline-flex items-center gap-1"
            >
              Explore the SaaS &amp; AI Security Review <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </Section>

      <Section subtitle="Compliance Guides" title="AI Compliance Law Guides" className="bg-secondary/20">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Deep-dive guides to the AI regulations that matter most - informed by the HAIEC compliance engine and Zenodo-published research.
          </p>
          <Link href="/guides" className="text-sm text-primary hover:underline">
            View all compliance guides →
          </Link>
        </div>
      </Section>

      <Section subtitle="Free Resource" title="AI Governance & Compliance Framework Guide" className="bg-secondary/20">
        <div className="max-w-md mx-auto">
          <LeadMagnetCard
            title="Free AI Governance & Compliance Framework Guide"
            description="A practical guide covering the CSM Framework, 5 patent-pending methodologies, and enterprise implementation strategies for AI governance and compliance."
            resourceName="AI Governance & Compliance Framework Guide"
          />
        </div>
      </Section>

      <Section subtitle="Direct Offers" title="Not sure where to start?" className="bg-secondary/20">
        <div className="max-w-4xl mx-auto">
          <p className="text-base text-muted-foreground mb-6">
            Two primary ways to begin, two specific-solution pathways. Choose the path that matches your situation.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Link href="/ai-advisor" className="block">
              <Card className="border-l-4 border-l-primary hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    AI Advisor Desk
                  </CardTitle>
                  <CardDescription className="text-sm">
                    $99/month. Ongoing AI guidance, controls review, regulatory monitoring. Up to 3 team members. Start here if you want ongoing support.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/ai-automation" className="block">
              <Card className="border-l-4 border-l-primary hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Workflow className="h-4 w-4 text-primary" />
                    AI Automation Blueprint
                  </CardTitle>
                  <CardDescription className="text-sm">
                    $500 fixed. One workflow analyzed with buy/configure/build recommendation, architecture, and implementation roadmap. Start here if you have a specific workflow question.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
          <p className="text-sm font-semibold text-foreground mb-4">Need something specific?</p>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/ai-voice-agent" className="block">
              <Card className="border-l-4 border-l-primary hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    AI Voice Agent
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Managed AI voice deployment from $499/month. Standard and custom workflows. Calls, intake, booking.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/ai-security-compliance" className="block">
              <Card className="border-l-4 border-l-primary hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    AI Security &amp; Compliance
                  </CardTitle>
                  <CardDescription className="text-sm">
                    AI security assessment, compliance review, vendor risk, hiring bias, and evidence-grade documentation.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
          <div className="mt-6 rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Building a SaaS or AI product?</strong>{' '}
              <Link href="/saas-security-review" className="text-primary hover:underline">
                See the SaaS &amp; AI Security Review <ArrowRight className="inline h-3 w-3" />
              </Link>
              {' '}for tenant isolation, AI application security, and buyer-shareable evidence.
            </p>
          </div>
        </div>
      </Section>

      <CTA
        title="Let's Discuss Your AI Challenge"
        description="Whether you need architecture, deployment, governance, or all three, I bring production experience and a track record of delivering results in demanding environments."
        primaryButton={{ text: 'Schedule a Conversation', href: '/contact' }}
        secondaryButton={{ text: 'View Executive Bio', href: '/executive-bio' }}
      />
    </>
  )
}
