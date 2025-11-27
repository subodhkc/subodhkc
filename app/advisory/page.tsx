import Hero from '@/components/Hero'
import Section from '@/components/Section'
import Grid from '@/components/Grid'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import CTA from '@/components/CTA'
import {
  Target,
  Shield,
  TrendingUp,
  Users,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  Lightbulb,
} from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Advisory & Consulting',
  description:
    'Strategic advisory services for AI compliance, governance, and technical program leadership. Executive coaching, implementation support, and fractional leadership for enterprise AI initiatives.',
}

export default function AdvisoryPage() {
  const services = [
    {
      icon: Shield,
      title: 'AI Compliance & Governance Advisory',
      description:
        'Strategic counsel on navigating AI regulatory requirements, building governance frameworks, and preparing for compliance audits.',
      deliverables: [
        'Compliance readiness assessment',
        'Governance framework design',
        'Risk mitigation strategies',
        'Regulatory roadmap',
      ],
      engagement: '3-6 months',
      ideal: 'Organizations deploying AI at scale, preparing for regulatory compliance',
    },
    {
      icon: Target,
      title: 'Technical Program Leadership',
      description:
        'Fractional TPM services for complex, multi-stakeholder initiatives. Drive execution, manage dependencies, and ensure delivery.',
      deliverables: [
        'Program strategy & roadmap',
        'Stakeholder alignment',
        'Risk & dependency management',
        'Execution velocity improvement',
      ],
      engagement: '6-12 months',
      ideal: 'Enterprises launching critical AI initiatives, scaling technical programs',
    },
    {
      icon: Lightbulb,
      title: 'Executive Coaching',
      description:
        'One-on-one coaching for technical leaders navigating AI strategy, governance, and organizational transformation.',
      deliverables: [
        'Strategic thinking development',
        'Leadership capability building',
        'Decision framework refinement',
        'Stakeholder management mastery',
      ],
      engagement: '3-12 months',
      ideal: 'CTOs, VPs of Engineering, AI leaders scaling teams and systems',
    },
    {
      icon: TrendingUp,
      title: 'Implementation Support',
      description:
        'Hands-on support implementing HAIEC frameworks, tools, and methodologies within your organization.',
      deliverables: [
        'Framework customization',
        'Team training & enablement',
        'Implementation guidance',
        'Operational playbooks',
      ],
      engagement: '3-6 months',
      ideal: 'Organizations adopting HAIEC platform or CSM methodology',
    },
  ]

  const approach = [
    {
      phase: '1. Discovery',
      description:
        'Deep dive into your current state, challenges, and objectives. No generic playbooks—every engagement starts with understanding your specific context.',
      duration: '2-4 weeks',
    },
    {
      phase: '2. Strategy',
      description:
        'Develop tailored frameworks, roadmaps, and approaches. Built on proven methodologies but adapted to your constraints and opportunities.',
      duration: '4-6 weeks',
    },
    {
      phase: '3. Execution',
      description:
        'Hands-on implementation support. I don\'t just provide recommendations—I help you execute them.',
      duration: 'Ongoing',
    },
    {
      phase: '4. Scale',
      description:
        'Knowledge transfer, team enablement, and operational handoff. Build internal capability to sustain and scale the work.',
      duration: '4-8 weeks',
    },
  ]

  const expertise = [
    'AI regulatory compliance (EU AI Act, GDPR, sector-specific)',
    'Enterprise AI governance frameworks',
    'Technical program management at Fortune 50 scale',
    'Risk management and audit preparation',
    'Executive stakeholder management',
    'Team scaling and organizational design',
    'SaaS and platform architecture',
    'Information security and IT law',
  ]

  const pricing = [
    {
      tier: 'Advisory Retainer',
      description: 'Ongoing strategic counsel and support',
      structure: 'Monthly retainer',
      commitment: '3-month minimum',
      includes: [
        'Unlimited async access',
        '2 strategy sessions/month',
        'Document & framework review',
        'Email/Slack support',
      ],
    },
    {
      tier: 'Project Engagement',
      description: 'Defined scope with specific deliverables',
      structure: 'Fixed fee or time & materials',
      commitment: '3-6 months typical',
      includes: [
        'Comprehensive discovery',
        'Custom frameworks & roadmaps',
        'Implementation support',
        'Team training',
      ],
    },
    {
      tier: 'Fractional Leadership',
      description: 'Embedded TPM or governance leadership',
      structure: 'Monthly retainer (part-time)',
      commitment: '6-12 months',
      includes: [
        'Active program leadership',
        'Stakeholder management',
        'Execution ownership',
        'Team integration',
      ],
    },
  ]

  return (
    <>
      <Hero
        subtitle="Advisory & Consulting"
        title={
          <>
            Strategic Counsel for
            <br />
            <span className="gradient-text">Enterprise AI Leaders</span>
          </>
        }
        description="12+ years of experience driving AI compliance, governance, and technical programs at Fortune 50 scale. I help organizations navigate complexity and execute with precision."
      >
        <Link href="/contact">
          <Button size="lg" className="group">
            Schedule consultation
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </Hero>

      <Section
        subtitle="Services"
        title="How I Work With Organizations"
        description="Strategic advisory and hands-on implementation support for enterprises navigating AI compliance, governance, and scale."
      >
        <div className="space-y-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
                      <CardDescription className="mb-4">{service.description}</CardDescription>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Key Deliverables</h4>
                          <ul className="space-y-1">
                            {service.deliverables.map((item, idx) => (
                              <li key={idx} className="text-muted-foreground">
                                • {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">
                            Typical Engagement
                          </h4>
                          <p className="text-muted-foreground">{service.engagement}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Ideal For</h4>
                          <p className="text-muted-foreground">{service.ideal}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </Section>

      <Section subtitle="Approach" title="How Engagements Work" className="bg-secondary/20">
        <Grid cols={2}>
          {approach.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 mb-3 w-fit">
                  <span className="text-xs font-medium text-primary">{item.duration}</span>
                </div>
                <CardTitle className="text-xl">{item.phase}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section subtitle="Expertise" title="What I Bring">
        <div className="max-w-4xl">
          <Grid cols={2} gap="md">
            {expertise.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground">{item}</p>
              </div>
            ))}
          </Grid>
        </div>
      </Section>

      <Section subtitle="Investment" title="Engagement Models">
        <Grid cols={3}>
          {pricing.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-xl">{item.tier}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">Structure</p>
                  <p className="text-muted-foreground">{item.structure}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">Commitment</p>
                  <p className="text-muted-foreground">{item.commitment}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-3">Includes</p>
                  <ul className="space-y-2">
                    {item.includes.map((include, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{include}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </Grid>
        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">
            Pricing is customized based on scope, scale, and engagement model.
          </p>
          <Link href="/contact">
            <Button size="lg">Discuss your needs</Button>
          </Link>
        </div>
      </Section>

      <Section subtitle="Who I Work With" title="Ideal Clients">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Enterprise Organizations</CardTitle>
                <CardDescription>
                  Fortune 500 and large enterprises deploying AI at scale, navigating regulatory
                  compliance, or building governance frameworks.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">High-Growth Startups</CardTitle>
                <CardDescription>
                  Series B+ companies scaling AI systems, preparing for compliance requirements, or
                  building institutional-grade governance.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Technical Leaders</CardTitle>
                <CardDescription>
                  CTOs, VPs of Engineering, and AI leaders seeking executive coaching on strategy,
                  governance, and organizational scaling.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </Section>

      <CTA
        title="Ready to Build AI Systems That Scale?"
        description="Whether you need strategic counsel, implementation support, or fractional leadership, I bring proven frameworks and hands-on execution to your most critical initiatives."
        primaryButton={{ text: 'Schedule consultation', href: '/contact' }}
        secondaryButton={{ text: 'View case studies', href: '/research' }}
      />
    </>
  )
}
