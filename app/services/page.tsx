import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import { LeadMagnetCard } from '@/components/LeadMagnetCard'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Shield, Phone, ShieldCheck, ArrowRight, Eye, Users, Compass,
} from 'lucide-react'

export const metadata = {
  title: 'Services | AI Advisory, Architecture & Implementation | Subodh KC',
  description:
    'Start with the decision in front of you. AI Advisor Desk, Fractional AI Advisor, and AI Systems Architecture & Implementation. Different levels of involvement for different decisions.',
  keywords: [
    'AI advisory services',
    'AI advisor desk',
    'fractional AI advisor',
    'AI systems architecture',
    'AI implementation',
    'AI architecture review',
    'AI deployment',
    'AI governance',
    'voice AI deployment',
    'AI security review',
    'enterprise AI',
    'Subodh KC',
  ],
  alternates: {
    canonical: 'https://subodhkc.com/services',
  },
  openGraph: {
    title: 'Services | AI Advisory, Architecture & Implementation | Subodh KC',
    description:
      'Start with the decision in front of you. AI Advisor Desk, Fractional AI Advisor, and AI Systems Architecture & Implementation. Different levels of involvement for different decisions.',
    url: 'https://subodhkc.com/services',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Services | Subodh KC',
    description:
      'Start with the decision in front of you. AI Advisor Desk, Fractional AI Advisor, and AI Systems Architecture & Implementation.',
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

const primaryPaths = [
  {
    icon: Eye,
    depth: 1,
    depthLabel: 'Depth 01 · Watching',
    offer: 'AI Advisor Desk',
    href: '/ai-advisor',
    price: '$99/month',
    tagline: 'Someone watching and thinking with you.',
    description:
      'Ongoing human AI advisory. Weekly signal, monthly point of view, and human advice when it matters. See what is changing, what it could mean for your organization, and what deserves action.',
    cta: 'Explore AI Advisor',
  },
  {
    icon: Users,
    depth: 2,
    depthLabel: 'Depth 02 · Working alongside',
    offer: 'Fractional AI Advisor',
    href: '/advisory',
    price: '$1,250/month',
    tagline: 'Someone working through important interconnected decisions with you.',
    description:
      'Executive AI advisory for higher-stakes decisions. Strategy, architecture review, vendor and build-vs-buy calls, roadmap and operating decisions, and executive working sessions with context continuity.',
    cta: 'Explore Fractional Advisory',
  },
  {
    icon: Compass,
    depth: 3,
    depthLabel: 'Depth 03 · Building',
    offer: 'AI Systems Architecture & Implementation',
    href: '/contact?subject=ai-architecture-implementation',
    price: 'Scoped',
    tagline: 'When the decision has already earned implementation.',
    description:
      'For buyers who already know what needs to be implemented. Custom-scoped architecture, integration, and production deployment work. Separately scoped from advisory.',
    cta: 'Explore Architecture & Implementation',
  },
]

const technicalNeeds = [
  {
    icon: Phone,
    name: 'AI Voice / Workflow Systems',
    href: '/ai-voice-agent',
    desc: 'Managed AI voice deployment. Calls, intake, booking, and escalation. From $499/month.',
  },
  {
    icon: Shield,
    name: 'AI Security / Governance',
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

const credentials = [
  { value: '83+', label: 'projects delivered' },
  { value: '53', label: 'enterprise applications' },
  { value: '16+', label: 'years in production AI' },
]

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Hero
        subtitle="Services"
        title={
          <>
            Start with the decision
            <br />
            <span className="gradient-text">in front of you.</span>
          </>
        }
        description="Different situations need different levels of involvement. Choose the depth that matches the decision, not a product tier."
      />

      {/* Three primary paths · progression of depth */}
      <Section
        subtitle="Three Primary Paths"
        title="Choose your depth of involvement"
        description="Each path is a different relationship to AI decisions. Depth increases left to right: watching, working alongside, building. Not Bronze, Silver, Gold. The right path is the one that matches the decision in front of you."
        sectionNum="01"
      >
        <div className="max-w-6xl mx-auto">
          {/* Depth progression bar */}
          <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
            <span className="text-sm font-medium text-muted-foreground">Shallow</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((d) => (
                <div
                  key={d}
                  className="h-1.5 rounded-full bg-primary"
                  style={{ width: `${d * 28}px`, opacity: 0.3 + d * 0.23 }}
                />
              ))}
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Deep</span>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {primaryPaths.map((path) => {
              const Icon = path.icon
              return (
                <Link key={path.href} href={path.href} className="block group h-full">
                  <Card
                    className="h-full border-l-4 hover:shadow-lg transition-all duration-300 flex flex-col"
                    style={{ borderLeftColor: 'hsl(var(--primary))' }}
                  >
                    <CardHeader className="flex flex-col flex-1">
                      {/* Depth indicator */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3].map((d) => (
                            <div
                              key={d}
                              className="h-2 w-2 rounded-full"
                              style={{
                                backgroundColor:
                                  d <= path.depth ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground) / 0.25)',
                              }}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">{path.depthLabel}</span>
                      </div>

                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>

                      <CardTitle className="text-xl leading-tight">{path.offer}</CardTitle>
                      <p className="text-sm font-medium text-primary mt-1">{path.price}</p>

                      <p className="text-sm font-medium text-foreground mt-3 italic">{path.tagline}</p>
                      <CardDescription className="text-sm mt-3 flex-1">{path.description}</CardDescription>

                      <span className="text-sm text-primary inline-flex items-center gap-1 mt-4 font-medium">
                        {path.cta} <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </span>
                    </CardHeader>
                  </Card>
                </Link>
              )
            })}
          </div>

          {/* Member-only note */}
          <p className="text-sm text-muted-foreground mt-8 max-w-3xl mx-auto text-center">
            Members can commission deeper Workflow Decision Reviews when one opportunity deserves focused
            investigation. Available under the Advisor relationship, not as a standalone public starting point.
          </p>
        </div>
      </Section>

      {/* Known technical need */}
      <Section
        subtitle="Known Technical Need"
        title="Known technical need?"
        description="When the decision is made and the need is specific, go straight to the specialist offering."
        sectionNum="02"
        className="bg-secondary/20"
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4">
            {technicalNeeds.map((need) => {
              const Icon = need.icon
              return (
                <Link key={need.href} href={need.href} className="block group">
                  <Card className="h-full hover:shadow-lg transition-all">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Icon className="h-4 w-4 text-primary" />
                        {need.name}
                      </CardTitle>
                      <CardDescription className="text-sm">{need.desc}</CardDescription>
                      <span className="text-sm text-primary inline-flex items-center gap-1 mt-2 font-medium">
                        View offering <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </span>
                    </CardHeader>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </Section>

      {/* Why this approach */}
      <Section
        subtitle="Why This Approach"
        title="What makes this different"
        sectionNum="03"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle>Architecture, not slides</CardTitle>
              <CardDescription className="text-base">
                I deliver working systems and decision records, not strategy decks. Every engagement produces
                usable artifacts: architecture, evidence pipelines, roadmaps, and recommendations your
                teams can act on.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle>The answer is allowed to be no</CardTitle>
              <CardDescription className="text-base">
                Recommendations include buy, configure, integrate, wait, keep current, and do not use AI.
                Independence of recommendation is an advantage, not a limitation.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle>Tested in production at enterprise scale</CardTitle>
              <CardDescription className="text-base">
                83+ projects delivered, 53 enterprise applications, 16+ years in production AI. Everything I
                build is designed for production environments with real constraints, real users, and real
                compliance obligations.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      {/* Credentials strip */}
      <Section className="bg-secondary/20">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            {credentials.map((c) => (
              <div key={c.label} className="text-center">
                <div className="text-3xl md:text-5xl font-bold gradient-text">{c.value}</div>
                <div className="text-sm md:text-base text-muted-foreground mt-1">{c.label}</div>
              </div>
            ))}
          </div>
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
        title="Not sure which depth fits?"
        description="Describe the decision in front of you. I will tell you which path makes sense, or whether none of them do."
        primaryButton={{ text: 'Discuss AI', href: '/contact?subject=discuss-ai' }}
        secondaryButton={{ text: 'View Executive Bio', href: '/executive-bio' }}
      />
    </>
  )
}
