import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import { LeadMagnetCard } from '@/components/LeadMagnetCard'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Link from 'next/link'
import {
  Shield, Workflow, Phone, MessageSquare, Users, ArrowRight, ShieldCheck, Compass,
} from 'lucide-react'

export const metadata = {
  title: 'How I Help | AI Advisory, Automation & Security | Subodh KC',
  description:
    'Where could AI change the way your organization works? Stay close to AI decisions with AI Advisor for Business, find the opportunity with an AI Opportunity & Workflow Assessment, work through higher-stakes decisions with a Fractional AI Advisor, or solve a known technical need in voice or security.',
  keywords: [
    'AI advisory services',
    'AI advisor for business',
    'AI opportunity assessment',
    'AI automation blueprint',
    'fractional AI advisor',
    'AI architecture review',
    'AI deployment',
    'AI governance',
    'voice AI deployment',
    'AI security review',
    'enterprise AI',
    'Subodh KC'
  ],
  alternates: {
    canonical: 'https://subodhkc.com/services',
  },
  openGraph: {
    title: 'How I Help | AI Advisory, Automation & Security | Subodh KC',
    description:
      'A decision router, not a catalogue. Ongoing AI advisory, focused opportunity assessment, fractional AI advisor for higher-stakes decisions, and known technical needs in voice and security.',
    url: 'https://subodhkc.com/services',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How I Help | Subodh KC',
    description: 'Stay close to AI decisions, find the opportunity, work through higher-stakes decisions, or solve a known technical need.',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'How I Help', item: 'https://subodhkc.com/services' },
  ],
}

const paths = [
  {
    icon: MessageSquare,
    situation: 'I want to stay close to AI decisions',
    offer: 'AI Advisor for Business',
    href: '/ai-advisor',
    price: '$99/month',
    description:
      'Ongoing human AI advisory. Weekly signal, monthly point of view, and human advice when it matters. See what is changing, what it could mean for your organization, and what deserves action.',
    cta: 'Explore AI Advisor for Business',
  },
  {
    icon: Workflow,
    situation: 'I want to find the opportunity worth pursuing',
    offer: 'AI Opportunity & Workflow Assessment',
    href: '/ai-automation',
    price: '$500 fixed',
    description:
      'A focused assessment of one opportunity and one primary workflow. You receive an AI Automation Blueprint with yes/no recommendation, buy/configure/build/wait call, architecture, cost-benefit, and roadmap in 5 business days.',
    cta: 'Start with an Assessment',
  },
  {
    icon: Users,
    situation: 'I am navigating higher-stakes AI decisions',
    offer: 'Fractional AI Advisor',
    href: '/advisory',
    price: '$1,250/month',
    description:
      'Executive AI advisory for higher-stakes decisions. Strategy, architecture review, vendor and build-vs-buy calls, roadmap and operating decisions, and executive working sessions with context continuity.',
    cta: 'Explore Fractional AI Advisor',
  },
  {
    icon: Compass,
    situation: 'I know what to build and need it implemented',
    offer: 'AI Implementation & Systems Architecture',
    href: '/contact?subject=ai-implementation',
    price: 'Custom scoped',
    description:
      'For buyers who already know what needs to be implemented. Custom-scoped architecture, integration, and production deployment work. Separately scoped from advisory.',
    cta: 'Scope an Implementation',
  },
]

const technicalNeeds = [
  {
    icon: Phone,
    name: 'AI Voice',
    href: '/ai-voice-agent',
    desc: 'Managed AI voice deployment. Calls, intake, booking, and escalation. From $499/month.',
  },
  {
    icon: Shield,
    name: 'AI Security & Controls',
    href: '/ai-security-compliance',
    desc: 'AI security assessment, controls review, vendor risk, and audit-ready documentation. From $950.',
  },
  {
    icon: ShieldCheck,
    name: 'SaaS & AI Security Review',
    href: '/saas-security-review',
    desc: 'Tenant isolation and AI application security for B2B SaaS and AI-built products. From $950.',
  },
]

const method = ['Research', 'Reframe', 'Prove & Decide', 'Architect', 'Mobilize', 'Improve']

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Hero
        subtitle="How I Help"
        title={
          <>
            Where could AI change
            <br />
            <span className="gradient-text">the way your organization works?</span>
          </>
        }
        description="Not a catalogue. A decision router. Choose the path that matches your situation, and every path runs on the same method: research, reframe, prove and decide, architect, mobilize, improve."
      />

      {/* Decision router */}
      <Section
        subtitle="Choose Your Path"
        title="Four starting points"
        description="Each path is a different relationship to AI decisions, not a different product tier."
        sectionNum="01"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paths.map((path) => {
              const Icon = path.icon
              return (
                <Link key={path.href} href={path.href} className="block group">
                  <Card className="h-full border-l-4 border-l-primary hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{path.situation}</p>
                      <CardTitle className="text-xl">{path.offer}</CardTitle>
                      <p className="text-sm font-medium text-primary mt-1">{path.price}</p>
                      <CardDescription className="text-sm mt-3">{path.description}</CardDescription>
                      <span className="text-sm text-primary inline-flex items-center gap-1 mt-4 font-medium">
                        {path.cta} <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </span>
                    </CardHeader>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </Section>

      {/* Known technical need */}
      <Section
        subtitle="Known Technical Need"
        title="Already know the system you need?"
        description="When the decision is made and the need is specific, go straight to the offer."
        sectionNum="02"
        className="bg-secondary/20"
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4">
            {technicalNeeds.map((need) => {
              const Icon = need.icon
              return (
                <Link key={need.href} href={need.href} className="block">
                  <Card className="h-full hover:shadow-lg transition-all">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Icon className="h-4 w-4 text-primary" />
                        {need.name}
                      </CardTitle>
                      <CardDescription className="text-sm">{need.desc}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </Section>

      {/* Method */}
      <Section
        subtitle="The Method Behind Every Path"
        title="The same six disciplines, whatever the engagement"
        sectionNum="03"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {method.map((step, i) => (
              <span key={step} className="inline-flex items-center gap-2">
                <span className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground">
                  {step}
                </span>
                {i < method.length - 1 && <span className="text-muted-foreground">→</span>}
              </span>
            ))}
          </div>
          <p className="text-base text-muted-foreground">
            Research understands reality. Reframe finds the opportunity behind the request.
            Prove &amp; Decide produces a recommendation an executive can sign. Architect designs the system,
            data, human, and control model. Mobilize assigns ownership, dependencies, risks, and cadence.
            Improve uses production evidence to scale, change, or stop.
          </p>
          <div className="mt-4">
            <Link href="/portfolio" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
              See the method in shipped systems <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </Section>

      {/* Why */}
      <Section subtitle="Why This Approach" title="What Makes This Different" className="bg-secondary/20">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle>Architecture, Not Slides</CardTitle>
              <CardDescription className="text-base">
                I deliver working systems and decision records, not strategy decks. Every engagement produces
                usable artifacts: architecture, evidence pipelines, roadmaps, and recommendations your
                teams can act on.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle>The Answer Is Allowed to Be No</CardTitle>
              <CardDescription className="text-base">
                Recommendations include buy, configure, integrate, wait, keep current, and do not use AI.
                Independence of recommendation is an advantage, not a limitation.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle>Tested in Production at Enterprise Scale</CardTitle>
              <CardDescription className="text-base">
                53-application portfolios, $50M+ AI portfolios, published frameworks. Everything I build
                is designed for production environments with real constraints, real users, and real compliance obligations.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      <Section subtitle="Free Resource" title="AI Governance & Compliance Framework Guide" className="bg-secondary/20">
        <div className="max-w-md mx-auto">
          <LeadMagnetCard
            title="Free AI Governance & Compliance Framework Guide"
            description="A practical guide covering the CSM Framework, published methodologies, and enterprise implementation strategies for AI governance and compliance."
            resourceName="AI Governance & Compliance Framework Guide"
          />
        </div>
      </Section>

      <CTA
        title="Not sure which path fits?"
        description="Describe the decision in front of you. I will tell you which path makes sense, or whether none of them do."
        primaryButton={{ text: 'Discuss AI', href: '/contact?subject=discuss-ai' }}
        secondaryButton={{ text: 'View Executive Bio', href: '/executive-bio' }}
      />
    </>
  )
}
