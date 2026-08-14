import Hero from '@/components/Hero'
import Section from '@/components/Section'
import Grid from '@/components/Grid'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import CTA from '@/components/CTA'
import { LeadMagnetCard } from '@/components/LeadMagnetCard'
import {
  Target,
  Shield,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Fractional AI Advisor & Advisory Services | Subodh KC',
  description:
    'Direct human advisory for AI architecture, governance, and technical program leadership. Fractional AI Advisor and Fractional AI Lead engagements for enterprise AI initiatives.',
  keywords: [
    'fractional AI advisor',
    'fractional AI lead',
    'AI advisory',
    'AI architecture consulting',
    'AI governance consulting',
    'AI compliance advisory',
    'AI systems architect',
    'AI strategy advisor',
    'enterprise AI consulting',
    'AI executive coaching',
    'Subodh KC',
  ],
  alternates: {
    canonical: 'https://subodhkc.com/advisory',
  },
  openGraph: {
    title: 'Fractional AI Advisor & Advisory Services | Subodh KC',
    description:
      'Direct human advisory for AI architecture, governance, and technical program leadership. Fractional AI Advisor and Fractional AI Lead engagements for enterprise AI initiatives.',
    url: 'https://subodhkc.com/advisory',
    type: 'website',
  },
}

export default function AdvisoryPage() {
  const services = [
    {
      icon: Shield,
      title: 'Fractional AI Advisor',
      description:
        'I provide direct, ongoing AI advisory to leadership teams deploying AI at scale. Governance design, compliance preparation, vendor evaluation, and AI architecture decisions reviewed by someone who has built production systems.',
      deliverables: [
        'Governance framework design',
        'Compliance readiness assessment',
        'AI architecture review',
        'Vendor and tool evaluation',
        'Regulatory roadmap',
        'Priority async access',
      ],
      engagement: 'Monthly retainer, 3-month minimum',
      ideal: 'Organizations deploying AI at scale that need experienced direct judgment, not email-based guidance',
    },
    {
      icon: Target,
      title: 'Fractional AI Lead',
      description:
        'I embed as a part-time technical program leader for complex, multi-stakeholder AI initiatives. Drive execution, manage dependencies, align engineering and compliance teams, and own delivery.',
      deliverables: [
        'Program strategy and roadmap',
        'Stakeholder alignment',
        'Dependency and risk management',
        'Execution ownership',
        'Team integration',
        'Delivery cadence',
      ],
      engagement: '6-12 months, part-time',
      ideal: 'Enterprises launching critical AI initiatives that need embedded leadership, not recommendations',
    },
  ]

  const approach = [
    {
      phase: '1. Context',
      description:
        'I start by understanding your current AI systems, governance posture, and objectives. No generic playbooks. Every engagement begins with your specific context.',
      duration: '1-2 weeks',
    },
    {
      phase: '2. Plan',
      description:
        'I develop a tailored approach based on what I find. Built on methodologies I have used in production, adapted to your constraints and priorities.',
      duration: '2-4 weeks',
    },
    {
      phase: '3. Work',
      description:
        'I do the work alongside your team. Architecture decisions, governance design, compliance preparation, program execution. Not recommendations handed over a wall.',
      duration: 'Ongoing',
    },
    {
      phase: '4. Handoff',
      description:
        'When the engagement ends, your team has the frameworks, documentation, and capability to continue without me.',
      duration: '2-4 weeks',
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
      tier: 'Fractional AI Advisor',
      description: 'Ongoing direct advisory and governance guidance',
      structure: 'Monthly retainer',
      commitment: '3-month minimum',
      includes: [
        'Priority async access',
        '2 strategy sessions/month',
        'Document and framework review',
        'AI architecture decisions',
        'Vendor and tool evaluation',
      ],
    },
    {
      tier: 'Fractional AI Lead',
      description: 'Embedded technical program leadership',
      structure: 'Monthly retainer (part-time)',
      commitment: '6-12 months',
      includes: [
        'Active program leadership',
        'Stakeholder management',
        'Execution ownership',
        'Team integration',
        'Delivery cadence',
      ],
    },
  ]

  return (
    <>
      <Hero
        subtitle="Advisory & Consulting"
        title={
          <>
            Direct human advisory for
            <br />
            <span className="gradient-text">enterprise AI leaders</span>
          </>
        }
        description="Fractional AI Advisor and Fractional AI Lead engagements for organizations that need embedded leadership, not email-based guidance. For scalable ongoing AI guidance, see the AI Advisor Desk."
      >
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/contact">
            <Button size="lg" className="group">
              Schedule consultation
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/ai-advisor">
            <Button size="lg" variant="outline">
              Looking for ongoing guidance? ($99/mo)
            </Button>
          </Link>
        </div>
      </Hero>

      <Section
        subtitle="How This Differs from AI Advisor Desk"
        title="When to choose direct advisory vs. the Advisor Desk"
        className="bg-secondary/20"
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Advisor Desk</CardTitle>
                <CardDescription className="text-sm mt-2">
                  $99/month. Scalable, email-based ongoing guidance for small businesses.
                  One advisor-reviewed question per month, AI controls review, regulatory monitoring,
                  and recommended next actions. Up to 3 team members.
                </CardDescription>
                <div className="mt-3">
                  <Link href="/ai-advisor">
                    <Button variant="outline" size="sm">Explore AI Advisor Desk <ArrowRight className="ml-2 h-3 w-3" /></Button>
                  </Link>
                </div>
              </CardHeader>
            </Card>
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="text-lg">Fractional AI Advisor / Lead</CardTitle>
                <CardDescription className="text-sm mt-2">
                  Direct human advisory and embedded leadership for enterprises. Strategy sessions,
                  stakeholder management, implementation ownership, and team integration.
                  Custom-scoped engagements with active program leadership.
                </CardDescription>
                <div className="mt-3">
                  <Link href="/contact">
                    <Button variant="outline" size="sm">Discuss advisory needs <ArrowRight className="ml-2 h-3 w-3" /></Button>
                  </Link>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </Section>

      <Section
        subtitle="Services"
        title="How I Work With Organizations"
        description="Direct advisory and embedded leadership for enterprises navigating AI compliance, governance, and scale."
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
        <Grid cols={2}>
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

      <Section subtitle="Compliance Guides" title="Which AI Laws Apply to You?" className="bg-secondary/20">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Before engaging advisory services, explore these free compliance guides to understand which regulations apply to your organization.
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
            description="A practical guide to building AI governance frameworks that scale - covering the CSM Framework, risk classification, compliance workflows, and audit-ready documentation patterns."
            resourceName="AI Governance & Compliance Framework Guide"
          />
        </div>
      </Section>

      <CTA
        title="Need direct AI advisory or embedded leadership?"
        description="I work with a small number of organizations at a time. If you need experienced AI governance and architecture leadership, let's talk about whether an engagement makes sense."
        primaryButton={{ text: 'Schedule consultation', href: '/contact' }}
        secondaryButton={{ text: 'View case studies', href: '/research' }}
      />
    </>
  )
}
