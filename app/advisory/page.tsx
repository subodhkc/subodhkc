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
  title: 'Fractional AI Advisor | Executive AI Advisory | Subodh KC',
  description:
    'A fractional AI advisor for teams navigating multiple or higher-stakes AI decisions. Decision review, strategy, architecture review, vendor and build-vs-buy calls, roadmap and operating decisions.',
  keywords: [
    'fractional AI advisor',
    'executive AI advisory',
    'AI strategy advisor',
    'AI advisory',
    'AI decision review',
    'AI architecture review',
    'AI vendor evaluation',
    'AI build vs buy',
    'AI roadmap advisor',
    'AI systems architect',
    'enterprise AI consulting',
    'Subodh KC',
  ],
  alternates: {
    canonical: 'https://subodhkc.com/advisory',
  },
  openGraph: {
    title: 'Fractional AI Advisor | Executive AI Advisory | Subodh KC',
    description:
      'A closer advisory relationship for teams navigating multiple or higher-stakes AI decisions. Decision review, strategy, architecture review, vendor and build-vs-buy, roadmap and operating decisions.',
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
        'A closer advisory relationship for teams navigating multiple or higher-stakes AI decisions. I review the decisions in front of you, pressure-test the options, and give you a recommendation backed by production experience. Your team keeps ownership and execution.',
      deliverables: [
        'Decision review with written rationale',
        'AI strategy and roadmap decisions',
        'Architecture review of proposed systems',
        'Vendor, tool, and build-vs-buy evaluation',
        'Operating model and governance decisions',
        'Executive working sessions',
      ],
      engagement: 'Monthly retainer, 3-month minimum',
      ideal: 'Leadership teams facing a sequence of AI decisions who want independent judgment and context continuity, not another stakeholder to manage',
    },
    {
      icon: Target,
      title: 'Focused Decision Engagement',
      description:
        'A scoped engagement around one decision cluster: a platform choice, an architecture under review, a vendor contract on the table, or a roadmap that needs an honest sequence. Defined deliverable, defined timeline.',
      deliverables: [
        'Structured review of the decision and constraints',
        'Evidence and trade-off analysis',
        'Written recommendation with decision record',
        'Executive walkthrough session',
        'Risk and fallback considerations',
        'Follow-up review after 30 days',
      ],
      engagement: 'Fixed scope, 2-6 weeks',
      ideal: 'Teams with one high-stakes AI decision that deserves more rigor than a meeting and less commitment than a retainer',
    },
  ]

  const approach = [
    {
      phase: '1. Context',
      description:
        'I start by understanding your current AI systems, the decisions in flight, and your constraints. No generic playbooks. Every engagement begins with your specific context.',
      duration: '1-2 weeks',
    },
    {
      phase: '2. Working sessions',
      description:
        'Structured sessions with your leadership and technical teams. We work the actual decisions: options, evidence, trade-offs, and what each path costs.',
      duration: 'Ongoing',
    },
    {
      phase: '3. Decision records',
      description:
        'Every material decision leaves with a written record: the options considered, the evidence, the trade-offs, and the recommendation. Your executives can defend it without me in the room.',
      duration: 'Per decision',
    },
    {
      phase: '4. Continuity',
      description:
        'Context compounds. Each decision builds on the last, and the advisory relationship carries the history so you never restart from zero.',
      duration: 'Ongoing',
    },
  ]

  const expertise = [
    'Technical program management at Fortune 50 scale',
    'AI systems architecture (RAG, agents, voice, integrations)',
    'Enterprise AI governance frameworks',
    'AI regulatory compliance (EU AI Act, GDPR, sector-specific)',
    'Vendor and build-vs-buy evaluation',
    'Risk management and evidence preparation',
    'Executive stakeholder management',
    'SaaS and platform architecture',
  ]

  const pricing = [
    {
      tier: 'Fractional AI Advisor',
      description: 'Ongoing decision partnership with context continuity',
      structure: 'Monthly retainer',
      commitment: '3-month minimum',
      includes: [
        'Direct async access via agreed channels',
        '2 executive working sessions/month',
        'Decision review with written rationale',
        'Architecture and roadmap review',
        'Vendor and build-vs-buy evaluation',
      ],
    },
    {
      tier: 'Focused Decision Engagement',
      description: 'One decision cluster, scoped and scheduled',
      structure: 'Fixed price, scoped up front',
      commitment: '2-6 weeks',
      includes: [
        'Structured decision review',
        'Evidence and trade-off analysis',
        'Written recommendation and decision record',
        'Executive walkthrough',
        '30-day follow-up review',
      ],
    },
  ]

  return (
    <>
      <Hero
        subtitle="Advisory & Consulting"
        title={
          <>
            An AI advisor
            <br />
            <span className="gradient-text">in the room.</span>
          </>
        }
        description="A closer advisory relationship for teams facing multiple or higher-stakes AI decisions. Decision review, strategy, architecture review, vendor and build-vs-buy calls, roadmap and operating decisions, and executive working sessions, with context that carries forward. For ongoing AI intelligence and lighter advisory access, see the AI Advisor Desk."
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
                  $99/month. An AI advisor in my corner. Ongoing AI intelligence, opportunity discovery, and human advisory access for organizations of any size.
                  Curated signals across models, tools, research, security, regulation, and real-world adoption,
                  controls review, and recommended next actions. Up to 3 team members.
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
                <CardTitle className="text-lg">Fractional AI Advisor / Focused Engagement</CardTitle>
                <CardDescription className="text-sm mt-2">
                  A closer advisory relationship for multiple or higher-stakes AI decisions. Executive working sessions,
                  decision review with written rationale, architecture and vendor evaluation, and context continuity.
                  Your team keeps ownership and execution.
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
        title="Two Ways to Work Together"
        description="Both are advisory relationships. I review, pressure-test, and recommend. Your organization decides and executes."
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
                  Large enterprises deploying AI at scale, navigating regulatory
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
                  CTOs, VPs of Engineering, and AI leaders seeking experienced guidance on strategy,
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
            description="A practical guide to building AI governance frameworks that scale - covering the CSM Framework, risk classification, compliance workflows, and evidence-ready documentation patterns."
            resourceName="AI Governance & Compliance Framework Guide"
          />
        </div>
      </Section>

      <CTA
        title="Facing higher-stakes AI decisions?"
        description="I work with a small number of organizations at a time. If you want an experienced AI advisor in the room for the decisions that matter, we should discuss whether an engagement makes sense."
        primaryButton={{ text: 'Schedule consultation', href: '/contact' }}
        secondaryButton={{ text: 'View case studies', href: '/research' }}
      />
    </>
  )
}
