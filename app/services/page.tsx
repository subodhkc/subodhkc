import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import { LeadMagnetCard } from '@/components/LeadMagnetCard'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Grid from '@/components/Grid'
import Link from 'next/link'
import {
  Shield, Briefcase, Users, Zap, CheckCircle2, Target, Award,
  Network, Database, Workflow, Bot, Phone, Activity, Lock, FileCheck, Gauge, Cpu, Radio, Layers, ArrowRight,
} from 'lucide-react'

export const metadata = {
  title: 'AI Architecture, Deployment & Governance Services | Subodh KC',
  description:
    'AI architecture, agentic systems, RAG, MCP integrations, voice AI deployment, compliance automation, and governance frameworks. From pilot to production at enterprise scale.',
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
}

export default function ServicesPage() {
  const pillars = [
    {
      icon: Cpu,
      subtitle: 'Pillar 01',
      title: 'AI Architecture & Integration',
      description:
        'Designing and building production AI systems that integrate with your existing stack — from agentic workflows to enterprise knowledge systems.',
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
          desc: 'Rescuing stalled AI pilots — diagnosing architecture failures, rebuilding for production, and getting to deployment.',
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
        'Deploying AI systems into production — voice agents, customer intake, monitoring, and the operational hardening that keeps systems running.',
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
          desc: 'Seamless AI-to-human handoff architecture, escalation policies, and context preservation.',
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
        'Building governance structures that scale — from readiness assessments to evidence architecture and drift controls.',
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
          desc: 'Audit-grade evidence generation, documentation pipelines, and compliance evidence repositories.',
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

      <Section subtitle="Investment" title="Pricing">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="text-2xl mb-2">Consulting & Advisory</CardTitle>
                <div className="text-4xl font-bold text-primary mb-4">$300 - $500<span className="text-lg text-muted-foreground">/hour</span></div>
                <CardDescription className="text-base space-y-2">
                  <p>• Project minimums apply</p>
                  <p>• Volume discounts available</p>
                  <p>• Retainer options for ongoing work</p>
                  <p className="pt-2 text-foreground"><strong>Typical Projects:</strong> $25K - $150K</p>
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="text-2xl mb-2">Fractional Executive</CardTitle>
                <div className="text-4xl font-bold text-primary mb-4">Custom<span className="text-lg text-muted-foreground"> pricing</span></div>
                <CardDescription className="text-base space-y-2">
                  <p>• Based on time commitment (20-40%)</p>
                  <p>• Equity options available</p>
                  <p>• Minimum 6-month engagement</p>
                  <p className="pt-2 text-foreground"><strong>Typical Range:</strong> $10K - $25K/month</p>
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card className="mt-8 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-center">Full-Time Opportunities</CardTitle>
              <CardDescription className="text-base text-center">
                Also open to Director/VP roles at Fortune 500, Series B+ startups, and AI-first companies.
                <br />
                <strong className="text-foreground">Target compensation:</strong> $250K - $400K+ (base + equity/bonus)
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      <Section subtitle="Why Work With Me" title="What Makes This Different" className="bg-secondary/20">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle>I See Failure Modes Before They Emerge</CardTitle>
              <CardDescription className="text-base">
                Years of drift detection, RCA, and governance work have trained me to anticipate what most teams
                discover only after outages or audit failures. I protect organizations from invisible risks before
                they become front-page news.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle>I Design Frameworks That Survive Contact With Real Organizations</CardTitle>
              <CardDescription className="text-base">
                Compliance is useless if engineers won't follow it. Engineering is dangerous if compliance can't see it.
                My systems bridge both worlds—creating governance structures that scale across dozens of teams without
                breaking velocity.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle>I've Operated at Every Altitude</CardTitle>
              <CardDescription className="text-base">
                From field technician → system engineer → program manager → founder → enterprise AI strategist.
                I understand every layer of the stack, technical and human. This means I can translate between
                engineering, legal, risk, and executive stakeholders.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle>No Buzzwords. Just Systems That Work.</CardTitle>
              <CardDescription className="text-base">
                If I say a program will take 6 months, it takes 6 months. If I say we can reduce audit preparation time,
                we do. My reputation is built on delivery, not promises. Everything I build is proven at
                Fortune 50 scale.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      <Section subtitle="Compliance Guides" title="AI Compliance Law Guides" className="bg-secondary/20">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-muted-foreground mb-6">
            Deep-dive guides to the AI regulations that matter most — informed by the HAIEC compliance engine and Zenodo-published research.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/guides/texas-ai-law" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="text-base mb-2">Texas AI Law (TRAIGA)</CardTitle>
                  <CardDescription className="text-sm">
                    HB 149. Effective Jan 2026. Penalties $10K-$200K. 60-day cure period.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/guides/eu-ai-act" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="text-base mb-2">EU AI Act</CardTitle>
                  <CardDescription className="text-sm">
                    Risk-tiered regulation. Full enforcement Aug 2026. Penalties up to €35M.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/guides/nyc-local-law-144" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="text-base mb-2">NYC Local Law 144</CardTitle>
                  <CardDescription className="text-sm">
                    AEDT bias audits. Active enforcement. $500-$1,500/day penalties.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
          <div className="mt-4 text-center">
            <Link href="/guides" className="text-sm text-primary hover:underline">
              View all compliance guides →
            </Link>
          </div>
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

      <CTA
        title="Let's Discuss Your AI Challenge"
        description="Whether you need architecture, deployment, governance, or all three — I bring 16+ years of experience, 5 patent-pending methodologies, and a track record of delivering results in the most demanding environments."
        primaryButton={{ text: 'Schedule a Conversation', href: '/contact' }}
        secondaryButton={{ text: 'View Executive Bio', href: '/executive-bio' }}
      />
    </>
  )
}
