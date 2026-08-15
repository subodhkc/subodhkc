import Link from 'next/link'
import Hero from '@/components/Hero'
import Section from '@/components/Section'
import Grid from '@/components/Grid'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  CheckCircle2,
  ArrowRight,
  Target,
  Compass,
  FileText,
  Shield,
} from 'lucide-react'
import { FractionalAdvisorCheckoutCTA } from '@/components/commercial/FractionalAdvisorCheckoutCTA'

export const metadata = {
  title: 'Fractional AI Advisor | Executive AI Strategy Advisor | Subodh KC',
  description:
    'Fractional AI Advisor for executives, founders and technical leaders navigating higher-stakes AI decisions. Executive AI strategy, architecture, vendor, build-vs-buy and roadmap advisory starting at $1,250/month.',
  keywords: [
    'fractional AI advisor',
    'executive AI advisor',
    'executive AI advisory',
    'AI strategy advisor',
    'AI strategy advisory',
    'AI architecture review',
    'AI vendor evaluation',
    'AI build vs buy',
    'AI roadmap advisor',
    'AI operating model',
    'AI decision support',
    'Subodh KC',
  ],
  alternates: {
    canonical: 'https://subodhkc.com/advisory',
  },
  openGraph: {
    title: 'Fractional AI Advisor | Executive AI Strategy Advisor | Subodh KC',
    description:
      'Fractional AI Advisor for executives, founders and technical leaders navigating higher-stakes AI decisions. Executive AI strategy, architecture, vendor, build-vs-buy and roadmap advisory starting at $1,250/month.',
    url: 'https://subodhkc.com/advisory',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fractional AI Advisor | Executive AI Strategy Advisor',
    description: 'Executive AI advisory for higher-stakes decisions. Strategy, architecture, vendor, build-vs-buy, and roadmap. From $1,250/month.',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'Fractional AI Advisor', item: 'https://subodhkc.com/advisory' },
  ],
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Fractional AI Advisor',
  description: 'Executive AI advisory for higher-stakes decisions. AI strategy, architecture review, vendor evaluation, build-vs-buy, roadmap, and operating model decisions. Starting at $1,250/month.',
  url: 'https://subodhkc.com/advisory',
  provider: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
  serviceType: 'Executive AI Advisory',
  areaServed: 'Global',
  offers: {
    '@type': 'Offer',
    price: '1250',
    priceCurrency: 'USD',
    billingDuration: 'P1M',
  },
}

const situations = [
  {
    title: 'Several AI initiatives are competing for attention',
    desc: 'You need someone to sequence the work, identify what is actually worth doing first, and help leadership commit without overcommitting.',
  },
  {
    title: 'A vendor or platform decision will create a long-term dependency',
    desc: 'You need an independent review of the contract, the architecture, and the exit path before you sign.',
  },
  {
    title: 'The roadmap exists but the sequence is unclear',
    desc: 'You need someone to pressure-test the order of work, identify missing gates, and connect the roadmap to operating reality.',
  },
  {
    title: 'Technical architecture and business priorities are pulling in different directions',
    desc: 'You need someone who speaks both languages and can translate between the engineering team and the executive team.',
  },
  {
    title: 'Leadership needs an independent point of view before committing money',
    desc: 'You need an advisor who has shipped production AI systems and can tell you whether the plan will survive contact with reality.',
  },
  {
    title: 'The organization wants AI strategy tied to operating reality',
    desc: 'You need someone who can connect strategy to execution, not just produce a deck that gets filed and forgotten.',
  },
]

const whatWeWorkThrough = [
  { icon: Target, title: 'AI Strategy', desc: 'Where AI creates value for your organization, what to pursue first, and what to stop doing.' },
  { icon: Compass, title: 'Opportunity Decisions', desc: 'Which opportunities deserve investment and which are distractions dressed as innovation.' },
  { icon: Shield, title: 'Vendor Evaluation', desc: 'Independent review of vendors, platforms, and contracts before you create a dependency.' },
  { icon: FileText, title: 'Build / Buy / Configure / Wait', desc: 'The layering decision: what to buy, what to build, what to configure, and what to wait on.' },
  { icon: Compass, title: 'Architecture Review', desc: 'Review of proposed systems, data flows, agent permissions, and security boundaries.' },
  { icon: Target, title: 'Roadmaps', desc: 'Sequencing, phase gates, evidence thresholds, and what each phase must prove before the next begins.' },
  { icon: FileText, title: 'Operating Models', desc: 'Who decides, who owns, who can stop it. Centralized, federated, or hybrid.' },
  { icon: Shield, title: 'Implementation Sequencing', desc: 'What to build first, what to test, what to deploy, and what to measure.' },
]

const coreEngagement = [
  'Two executive or technical working sessions each month',
  'Priority async advisory through agreed channels',
  'Ongoing organizational and decision context',
  'AI strategy and roadmap review',
  'Vendor, tool, and build-vs-buy evaluation',
  'Architecture and implementation review',
  'Focused written decision analysis or decision records when appropriate to the month priorities',
]

const methodSteps = [
  { phase: 'Research', desc: 'I understand your current systems, the decisions in flight, and your constraints. No generic playbooks.' },
  { phase: 'Reframe', desc: 'I find the real question behind the request. The stated problem is often not the problem worth solving.' },
  { phase: 'Prove & Decide', desc: 'We work the options, the evidence, and the trade-offs. You leave with a recommendation an executive can sign.' },
  { phase: 'Architect', desc: 'I design the system, data, human, and control model behind the decision. Not just what to do, but how it operates.' },
  { phase: 'Mobilize', desc: 'I assign ownership, dependencies, risks, and cadence. The decision becomes someone job with a deadline.' },
  { phase: 'Improve', desc: 'I use production evidence to scale, change, or stop. The loop closes when the decision meets reality.' },
]

const decisionArtifacts = [
  { name: 'Decision Brief', desc: 'A focused written analysis of one decision: options, evidence, trade-offs, and recommendation.' },
  { name: 'Architecture Review', desc: 'Review of a proposed system with security, data, and operational considerations.' },
  { name: 'Vendor Comparison', desc: 'Side-by-side evaluation of vendors against your requirements, not a generic checklist.' },
  { name: 'Roadmap Review', desc: 'Pressure-test of sequence, gates, and evidence thresholds.' },
  { name: 'Decision Record', desc: 'A written record your executives can defend without me in the room.' },
  { name: 'Risk / Assumption Register', desc: 'What could go wrong, what we are assuming, and what would change the recommendation.' },
  { name: 'Operating Recommendation', desc: 'Who owns what, how decisions get made, and how the system gets stopped if it fails.' },
]

const comparison = [
  {
    name: 'AI Advisor for Business',
    price: '$99/month',
    desc: 'Ongoing AI intelligence, opportunity discovery, and human advisory access for focused questions as decisions come up.',
    best: 'You want an AI advisor in your corner for ongoing signal and focused guidance.',
    href: '/ai-advisor',
  },
  {
    name: 'AI Opportunity & Workflow Assessment',
    price: '$500 fixed',
    desc: 'One opportunity, one primary workflow, one decision-ready Blueprint with architecture, cost-benefit, and buy/configure/build recommendation.',
    best: 'You have one workflow you want investigated and want a clear answer.',
    href: '/ai-automation',
  },
  {
    name: 'Fractional AI Advisor',
    price: '$1,250/month core',
    desc: 'Executive AI advisory for higher-stakes or interconnected decisions. Strategy, architecture, vendor, build-vs-buy, roadmap, and operating model with context that carries forward.',
    best: 'You need an AI advisor in the room for the decisions that matter.',
    href: '/advisory',
    highlight: true,
  },
  {
    name: 'AI Implementation & Systems Architecture',
    price: 'Custom scoped',
    desc: 'For buyers who already know what needs to be implemented. Custom-scoped architecture, integration, and production deployment work. Separately scoped from advisory.',
    best: 'The decision is made. You need the system built.',
    href: '/services',
  },
]

const faqs = [
  {
    q: 'What does a fractional AI advisor do?',
    a: 'A fractional AI advisor provides senior AI judgment without a full-time hire. I review the decisions in front of your team, pressure-test the options, and give you a recommendation backed by production experience. Your team keeps ownership and execution. The relationship is ongoing, so context compounds rather than restarting from zero each engagement.',
  },
  {
    q: 'What is the difference between an AI advisor and an AI consultant?',
    a: 'A consultant typically delivers a project: a deck, a report, an implementation. An advisor works alongside your team over time, reviewing decisions as they come up and carrying context forward. The fractional model gives you senior judgment at a fraction of the cost of a full-time executive hire, without the commitment of a long consulting engagement.',
  },
  {
    q: 'When should I use a fractional AI advisor?',
    a: 'When you have multiple AI decisions in flight, when a vendor or architecture decision will create a long-term dependency, when your roadmap needs an independent review, or when leadership needs a senior point of view before committing budget. If you have one specific workflow to investigate, the AI Opportunity & Workflow Assessment at $500 is a better starting point.',
  },
  {
    q: 'Is this executive AI strategy advisory?',
    a: 'Yes. The core engagement is designed for executives, founders, and technical leaders navigating higher-stakes AI decisions. The work includes AI strategy, roadmap review, vendor evaluation, build-vs-buy decisions, architecture review, and operating model design.',
  },
  {
    q: 'Can you review an AI vendor or architecture?',
    a: 'Yes. Vendor evaluation and architecture review are core parts of the engagement. I review the dependency you are about to create, the security and data implications, the exit path, and whether the architecture will survive production. This is independent review, not a vendor referral.',
  },
  {
    q: 'What happens after I subscribe?',
    a: 'You receive a welcome email with a link to your advisory workspace. I reach out to schedule our first working session, confirm your current priorities, and understand your organizational context. The first session typically covers the decisions in flight, the constraints, and what deserves attention first.',
  },
  {
    q: 'How does the $1,250 core engagement work?',
    a: 'The core relationship is designed around two monthly working sessions, ongoing async decision support, and selected decision artifacts tied to the priorities we are working through. Engagements can expand from the core relationship when your priorities require deeper or broader work. Any expanded scope is explicitly agreed before additional work begins.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: { '@type': 'Answer', text: faq.a },
  })),
}

export default function AdvisoryPage() {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Hero
        subtitle="Fractional AI Advisor · Executive AI Advisory"
        title={
          <>
            An AI advisor
            <br />
            <span className="gradient-text">in the room.</span>
          </>
        }
        description="For executives, founders and technical leaders navigating higher-stakes or interconnected AI decisions. Bring the decisions, options, proposals, vendors, architectures and roadmaps in front of your team. I research, pressure-test and help turn them into an evidence-backed path forward."
      >
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="#start">
            <Button size="lg" className="group animate-glow">
              Start Fractional AI Advisor
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/ai-advisor">
            <Button size="lg" variant="outline">
              Start with AI Advisor for Business ($99/mo)
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Core engagement: <strong className="text-foreground">$1,250/month</strong> · Annual: <strong className="text-foreground">$12,500/year</strong>
        </p>
      </Hero>

      {/* WHEN THIS RELATIONSHIP MAKES SENSE */}
      <Section
        subtitle="When This Relationship Makes Sense"
        title="Concrete situations where fractional advisory earns its place"
        sectionNum="01"
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {situations.map((situation, i) => (
              <Card key={i} className="h-full">
                <CardHeader>
                  <CardTitle className="text-base flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                    {situation.title}
                  </CardTitle>
                  <CardDescription className="text-sm mt-2">{situation.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* WHAT WE WORK THROUGH */}
      <Section
        subtitle="What We Work Through"
        title="The decisions this relationship covers"
        sectionNum="02"
        className="bg-secondary/20"
      >
        <Grid cols={4}>
          {whatWeWorkThrough.map((item, i) => {
            const Icon = item.icon
            return (
              <Card key={i} className="h-full">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-sm">{item.title}</CardTitle>
                  <CardDescription className="text-xs mt-1">{item.desc}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </Grid>
      </Section>

      {/* CORE ENGAGEMENT */}
      <Section
        subtitle="Core Engagement"
        title="What the $1,250/month relationship includes"
        description="The core relationship is designed around two monthly working sessions, ongoing async decision support, and selected decision artifacts tied to the priorities we are working through."
        sectionNum="03"
      >
        <div className="max-w-3xl mx-auto">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <div className="space-y-3">
                {coreEngagement.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Engagements can expand from the $1,250/month core advisory relationship when your priorities require deeper or broader work. Any expanded scope is explicitly agreed before additional work begins.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* HOW THE WORK HAPPENS */}
      <Section
        subtitle="How the Work Happens"
        title="The method behind every decision"
        description="The same six disciplines, adapted to an ongoing advisory relationship."
        sectionNum="04"
        className="bg-secondary/20"
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4">
            {methodSteps.map((step, i) => (
              <Card key={i} className="h-full">
                <CardHeader>
                  <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 mb-3 w-fit">
                    <span className="text-xs font-medium text-primary">{i + 1}</span>
                  </div>
                  <CardTitle className="text-base">{step.phase}</CardTitle>
                  <CardDescription className="text-sm mt-1">{step.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* DECISION ARTIFACTS */}
      <Section
        subtitle="Decision Artifacts"
        title="What the work produces"
        description="Not every artifact every month. The artifacts that match the priorities we are working through."
        sectionNum="05"
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4">
            {decisionArtifacts.map((artifact, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-4">
                <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{artifact.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{artifact.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* OFFER COMPARISON */}
      <Section
        subtitle="Choose the Level of Help"
        title="Four ways to work together"
        description="Each is a different relationship to AI decisions, not a different product tier."
        sectionNum="06"
        className="bg-secondary/20"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {comparison.map((item, i) => (
              <Card key={i} className={item.highlight ? 'border-primary border-2' : ''}>
                <CardHeader>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <p className="text-sm font-medium text-primary mt-1">{item.price}</p>
                  <CardDescription className="text-sm mt-3">{item.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-4">
                    <strong className="text-foreground">Best for:</strong> {item.best}
                  </p>
                  <Link href={item.href}>
                    <Button variant={item.highlight ? 'default' : 'outline'} size="sm" className="w-full">
                      {item.highlight ? 'Start Fractional AI Advisor' : 'Explore'} <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section
        subtitle="FAQ"
        title="Common questions about fractional AI advisory"
        sectionNum="07"
      >
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="rounded-lg border border-border p-4 group">
                <summary className="cursor-pointer text-sm font-semibold text-foreground flex items-center justify-between">
                  {faq.q}
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90 flex-shrink-0 ml-2" />
                </summary>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      {/* CHECKOUT CTA */}
      <div id="start">
        <FractionalAdvisorCheckoutCTA
          title="Start Fractional AI Advisor"
          description="Core engagement at $1,250/month. Two executive working sessions, ongoing async advisory, and selected decision artifacts. Continued monthly as needed. Cancel anytime."
        />
      </div>

      <Section
        subtitle="Not Sure Which Level Fits?"
        title="Start lighter if you are not ready for a full advisory relationship"
        className="bg-secondary/20"
      >
        <div className="max-w-3xl mx-auto text-center">
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/ai-advisor" className="block">
              <Card className="h-full hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle className="text-base">AI Advisor for Business</CardTitle>
                  <CardDescription className="text-sm mt-1">$99/month. Ongoing signal and focused human advisory for specific questions as they come up.</CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/ai-automation" className="block">
              <Card className="h-full hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle className="text-base">AI Opportunity & Workflow Assessment</CardTitle>
                  <CardDescription className="text-sm mt-1">$500 fixed. One opportunity, one workflow, one decision-ready Blueprint.</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </Section>
    </>
  )
}
