import Link from 'next/link'
import Section from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import {
  Target,
  Compass,
  Shield,
  FileText,
  Layers,
  Users,
  Handshake,
  ArrowRight,
  CheckCircle2,
  Clock,
  Wrench,
  Zap,
} from 'lucide-react'
import { FractionalAdvisorCheckoutCTA } from '@/components/commercial/FractionalAdvisorCheckoutCTA'
import { FractionalStickyCTA } from '@/components/commercial/FractionalStickyCTA'
import { FAQAccordion } from '@/components/ai-advisor/FAQAccordion'
import { getCheckoutBullets } from '@/lib/commercial/offers'

export const metadata = {
  title: 'Fractional AI Advisor | Strategy, Architecture & Governance | Subodh KC',
  description:
    'Add senior AI judgment without adding another executive seat. Strategy, opportunity, vendor, architecture, roadmap, and governance decisions for founders, executives, and CTOs. $1,250/month.',
  keywords: [
    'fractional AI advisor',
    'executive AI advisor',
    'AI strategy advisor',
    'AI strategic advisor',
    'AI executive advisory',
    'fractional AI consultant',
    'AI strategy consulting',
    'AI decision support',
    'AI opportunity prioritization',
    'AI portfolio prioritization',
    'AI roadmap advisor',
    'AI vendor evaluation',
    'AI vendor selection',
    'AI build vs buy',
    'AI architecture advisor',
    'AI systems architecture advisor',
    'AI implementation strategy',
    'AI operating model',
    'AI governance advisor',
    'AI governance consulting',
    'AI transformation advisor',
    'Subodh KC',
  ],
  alternates: {
    canonical: 'https://subodhkc.com/advisory',
  },
  openGraph: {
    title: 'Fractional AI Advisor | Strategy, Architecture & Governance | Subodh KC',
    description:
      'Add senior AI judgment without adding another executive seat. Strategy, opportunity, vendor, architecture, roadmap, and governance decisions for founders, executives, and CTOs. $1,250/month.',
    url: 'https://subodhkc.com/advisory',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fractional AI Advisor | Strategy, Architecture & Governance',
    description: 'Senior AI judgment for strategy, vendor, architecture, roadmap, and governance decisions. $1,250/month.',
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
  description:
    'Executive AI advisory for higher-stakes, interconnected decisions. Strategy, opportunity portfolio, investment decisions, vendor evaluation, build/buy/configure/connect/wait, architecture, roadmaps, operating model, governance, and implementation sequencing. $1,250/month.',
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

const whenFractionalEarnsItsPlace = [
  'Several AI initiatives compete for attention and leadership needs prioritization.',
  'A vendor or platform choice creates a long-term dependency before the contract is signed.',
  'Architecture and business priorities conflict and someone needs to translate between them.',
  'The roadmap sequence is unclear and leadership needs pressure-testing before committing.',
  'An investment decision is expensive to reverse and needs an independent view first.',
  'Governance and execution need to be connected, not documented and forgotten.',
  'The organization has crossed from experimentation into operating AI.',
  'Regulations or security requirements affect architecture or rollout decisions.',
  'Multiple business units are pursuing disconnected AI work.',
  'Leadership needs an independent point of view before approving spend.',
]

const whatIWorkThrough = [
  {
    icon: Target,
    title: 'Strategy',
    desc: 'Where AI can materially change the business and what should not be pursued.',
  },
  {
    icon: Compass,
    title: 'Opportunity Portfolio',
    desc: 'Identify, compare, and sequence opportunities. Not all opportunities deserve investment.',
  },
  {
    icon: Layers,
    title: 'Investment Decisions',
    desc: 'What deserves capital, people, and executive attention. What does not.',
  },
  {
    icon: Shield,
    title: 'Vendor Evaluation',
    desc: 'Vendor capability, claims, architecture, data, economics, dependency, and exit path.',
  },
  {
    icon: Wrench,
    title: 'Build / Buy / Configure / Connect / Wait',
    desc: 'The full decision set, not a binary build-versus-buy. What to buy, build, configure, connect, or wait on.',
  },
  {
    icon: FileText,
    title: 'Architecture',
    desc: 'Systems, data flows, integrations, agents, permissions, security boundaries, and operational design.',
  },
  {
    icon: Compass,
    title: 'Roadmaps',
    desc: 'Sequencing, dependencies, evidence gates, and stop conditions. What each phase must prove before the next begins.',
  },
  {
    icon: Users,
    title: 'Operating Model',
    desc: 'Who decides, owns, approves, monitors, and can stop AI systems. Centralized, federated, or hybrid.',
  },
  {
    icon: Shield,
    title: 'Governance and Regulatory Exposure',
    desc: 'Where legal, regulatory, security, privacy, or governance constraints materially affect the decision. Not legal advice.',
  },
  {
    icon: Wrench,
    title: 'Implementation Sequencing',
    desc: 'Translate decisions into executable next steps without automatically becoming the implementation team.',
  },
]

const decisionOpportunitySystem = [
  { label: 'CONTEXT', sub: 'What are we trying to accomplish?' },
  { label: 'OPPORTUNITIES', sub: 'What deserves investigation?' },
  { label: 'DECISIONS', sub: 'What needs a recommendation?' },
  { label: 'EVIDENCE', sub: 'What supports or weakens the decision?' },
  { label: 'COMMITMENTS', sub: 'What was decided, by whom, and what comes next?' },
  { label: 'OUTCOMES', sub: 'What did reality teach us?' },
]

const methodSteps = [
  { phase: 'Research', desc: 'I understand your current systems, the decisions in flight, and your constraints. No generic playbooks.' },
  { phase: 'Reframe', desc: 'I find the real question behind the request. The stated problem is often not the problem worth solving.' },
  { phase: 'Prove & Decide', desc: 'We work the options, the evidence, and the trade-offs. You leave with a recommendation an executive can sign.' },
  { phase: 'Architect', desc: 'I design the system, data, human, and control model behind the decision. Not just what to do, but how it operates.' },
  { phase: 'Mobilize', desc: 'We clarify ownership, dependencies, risks, and cadence so the decision has named owners and visible next steps.' },
  { phase: 'Improve', desc: 'I use production evidence to scale, change, or stop. The loop closes when the decision meets reality.' },
]

const decisionArtifacts = [
  { name: 'Decision Brief', desc: 'A focused written analysis of one decision: options, evidence, trade-offs, and recommendation.' },
  { name: 'Vendor Comparison', desc: 'Side-by-side evaluation of vendors against your requirements, not a generic checklist.' },
  { name: 'Architecture Review', desc: 'Review of a proposed system with security, data, and operational considerations.' },
  { name: 'Roadmap Review', desc: 'Pressure-test of sequence, gates, and evidence thresholds.' },
  { name: 'Decision Record', desc: 'A written record your executives can defend without me in the room.' },
  { name: 'Risk / Assumption Register', desc: 'What could go wrong, what we are assuming, and what would change the recommendation.' },
  { name: 'Operating Recommendation', desc: 'Who owns what, how decisions get made, and how the system gets stopped if it fails.' },
  { name: 'Opportunity Prioritization', desc: 'Ranked comparison of opportunities by value, fit, feasibility, and risk.' },
  { name: 'Implementation Sequencing Recommendation', desc: 'What to build first, what to test, what to deploy, and what to measure.' },
]

const activationCallPurpose = [
  'Validate priorities',
  'Confirm immediate decisions',
  'Establish relationship cadence',
  'Clarify stakeholders',
  'Confirm first working session focus',
]

const serviceExpectations = [
  { label: 'Acknowledgment', value: 'Priority asynchronous requests are normally acknowledged within one business day.' },
  { label: 'Substantive response', value: 'Substantive response normally within two business days when reasonably within Fractional advisory scope.' },
  { label: 'Not 24/7 support', value: 'Fractional AI Advisor is not 24/7 support, managed incident response, or emergency technical support.' },
  { label: 'System of record', value: 'The workspace remains the system of record. Working sessions are scheduled calls.' },
]

const sessionPolicy = [
  'One unused working session may carry into the immediately following month.',
  'A carried session expires after that month. Sessions do not accumulate indefinitely.',
  'Rescheduling requires reasonable advance notice.',
  'The complimentary 20-minute Activation Call does not count against the two monthly sessions.',
]

const affiliationUses = [
  'Team pages',
  'Proposals',
  'Partner discussions',
  'Investor materials',
  'Customer materials',
  'Internal leadership materials',
]

const faqs = [
  {
    q: 'What does a fractional AI advisor do?',
    a: 'A fractional AI advisor provides senior AI judgment without a full-time executive hire. I work alongside your leadership team on the decisions that are expensive to reverse: what to pursue, what to buy, what to build, how to architect it, what risk to accept, and what should wait. Your team keeps ownership and execution. The relationship is ongoing, so context compounds rather than restarting from zero each engagement.',
  },
  {
    q: 'What is the difference between an AI advisor and an AI consultant?',
    a: 'A consultant typically delivers a project: a deck, a report, an implementation. An advisor works alongside your team over time, reviewing decisions as they come up and carrying context forward. The fractional model gives you senior judgment at a fraction of the cost of a full-time executive hire, without the commitment of a long consulting engagement.',
  },
  {
    q: 'When should I use a fractional AI advisor?',
    a: 'When you have multiple AI decisions in flight, when a vendor or architecture decision will create a long-term dependency, when your roadmap needs an independent review, or when leadership needs a senior point of view before committing budget. If you primarily want someone watching what changes and helping with focused questions, AI Advisor Desk at $99/month is a better starting point.',
  },
  {
    q: 'Is this executive AI strategy advisory?',
    a: 'Yes. The engagement is designed for executives, founders, and technical leaders navigating higher-stakes AI decisions. The work includes AI strategy, opportunity portfolio prioritization, investment decisions, vendor evaluation, build/buy/configure/connect/wait decisions, architecture review, roadmap review, operating model design, governance exposure, and implementation sequencing.',
  },
  {
    q: 'Can you review an AI vendor or architecture?',
    a: 'Yes. Vendor evaluation and architecture review are core parts of the engagement. I review the dependency you are about to create, the security and data implications, the exit path, and whether the architecture will survive production. This is independent review, not a vendor referral.',
  },
  {
    q: 'Do I need a Fractional CAIO or a Fractional AI Advisor?',
    a: 'A Fractional CAIO may imply broader executive ownership, organizational mandate, and program accountability. This Fractional AI Advisor offer is centered on independent senior judgment, decision support, and architecture and strategy without pretending to hold an executive office you have not delegated. If you need someone who acts as a fractional executive with organizational authority, that is a different relationship. If you need senior judgment working through decisions with your leadership team, this is it.',
  },
  {
    q: 'What happens after I subscribe?',
    a: 'You receive a welcome email with a link to your advisory workspace. You complete or confirm your organizational context, identify the first decisions in play, schedule your complimentary 20-minute Activation Call, and schedule your first 60-minute Working Session. Both sessions can be scheduled directly from the workspace. The Activation Call validates priorities and establishes cadence. The first Working Session starts with the decisions, not introductions.',
  },
  {
    q: 'How does the $1,250/month engagement work?',
    a: 'The core relationship includes two monthly working sessions, priority async advisory, persistent organizational and decision context, Decision and Opportunity Registries, selected written decision artifacts tied to the priorities we are working through, a monthly Decision and Opportunity Brief, and vendor, roadmap, and architecture review within reasonable scope. Engagements can expand when your priorities require deeper or broader work. Any expanded scope is explicitly agreed before additional work begins.',
  },
  {
    q: 'Is there a minimum term?',
    a: 'No. The engagement is month-to-month. I recommend starting with a 90-day working horizon because the value comes from carrying context across several decisions, not from one isolated meeting. Around the 90-day mark, we run a structured review: decisions made, opportunities advanced or rejected, risks surfaced, assumptions changed, outcomes and evidence, and whether Fractional is still the correct relationship. You can continue, move to AI Advisor Desk, expand scope, or stop.',
  },
  {
    q: 'Does Fractional include implementation?',
    a: 'No. Fractional AI Advisor is advisory. If a decision has been made and you need substantial architecture, implementation, integration, or build work, that becomes a separately scoped engagement. I flag this before implementation work begins. The Fractional retainer is not silently consumed by build work.',
  },
  {
    q: 'Do you provide legal advice or guaranteed compliance?',
    a: 'No. I help you understand where legal, regulatory, security, privacy, or governance constraints materially affect the decision. For legal advice on regulatory compliance obligations, consult a licensed attorney. I do not provide legal advice, detect legal violations, or guarantee compliance.',
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

      {/* ============================================
          HERO
          ============================================ */}
      <section className="page-padding pt-16 md:pt-21 pb-12 md:pb-16 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="section-container relative z-10">
          <div className="grid lg:grid-cols-[3fr_2fr] gap-8 md:gap-12 lg:gap-16 items-center">
            {/* Left: positioning, price, CTA */}
            <div className="space-y-6 md:space-y-8">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
                <span className="text-sm font-medium text-primary">Fractional AI Advisor</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                Add senior AI judgment <span className="gradient-text">without adding another executive seat.</span>
              </h1>

              <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                When AI decisions start affecting strategy, vendors, architecture, investment, and operations at the same time, isolated advice is no longer enough. I work alongside founders, executives, and technical leaders on the decisions that are expensive to reverse: what to pursue, what to buy, what to build, how to architect it, what risk to accept, and what should wait.
              </p>

              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl md:text-4xl font-bold">$1,250<span className="text-lg font-normal text-muted-foreground">/month</span></span>
                  <span className="text-sm text-muted-foreground">Month-to-month</span>
                </div>
                <p className="text-sm text-muted-foreground">Recommended 90-day working horizon. No minimum term.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link href="#start">
                  <Button size="lg" className="group w-full sm:w-auto">
                    Start Fractional AI Advisor
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Discuss Fit
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: Decision & Opportunity system visual */}
            <div className="relative">
              <Reveal delay={200} style="up">
                <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-4 md:p-6 lg:p-8 space-y-1">
                  <div className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3 md:mb-4 text-center">
                    The Decision and Opportunity System
                  </div>

                  {decisionOpportunitySystem.map((stage, i) => (
                    <div key={i}>
                      {i > 0 && (
                        <div className="flex justify-center py-0.5 md:py-1" aria-hidden="true">
                          <ArrowRight className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground rotate-90" />
                        </div>
                      )}
                      <div
                        className={`rounded-lg px-3 md:px-4 py-2 md:py-3 text-center ${
                          i === 0
                            ? 'bg-muted/40 border border-border'
                            : i === decisionOpportunitySystem.length - 1
                            ? 'bg-primary/15 border border-primary/40'
                            : 'bg-primary/5 border border-primary/20'
                        }`}
                      >
                        <div className="text-xs md:text-sm font-bold tracking-wide">{stage.label}</div>
                        <div className="hidden md:block text-xs text-muted-foreground mt-1 leading-relaxed">{stage.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Capability line */}
      <div className="page-padding pb-8">
        <div className="section-container">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground border-y border-border py-3 md:py-4">
            {['Strategy', 'Opportunity', 'Vendors', 'Architecture', 'Roadmaps', 'Governance', 'Operating Model'].map((tag, i) => (
              <span key={tag} className="flex items-center gap-2 md:gap-3">
                <span className="font-medium text-foreground/80">{tag}</span>
                {i < 6 && <span className="text-border hidden sm:inline" aria-hidden="true">/</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================
          1. WHEN FRACTIONAL EARNS ITS PLACE
          ============================================ */}
      <Section
        subtitle="When Fractional earns its place"
        title="Concrete situations where this relationship is worth it"
        sectionNum="01"
      >
        <div className="max-w-3xl mx-auto space-y-3">
          {whenFractionalEarnsItsPlace.map((situation, i) => (
            <Reveal key={i} delay={i * 30} style="up">
              <div className="flex items-start gap-4 py-3 border-b border-border last:border-b-0">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</div>
                <p className="text-sm md:text-base text-foreground/90 leading-relaxed">{situation}</p>
              </div>
            </Reveal>
          ))}
          <p className="text-sm text-muted-foreground pt-4">
            None of these require a crisis. They require decisions that are expensive to reverse and benefit from independent senior judgment before commitment.
          </p>
        </div>
      </Section>

      {/* ============================================
          2. WHAT I WORK THROUGH WITH LEADERSHIP
          ============================================ */}
      <Section
        subtitle="What I work through"
        title="The decisions this relationship covers"
        sectionNum="02"
        className="bg-secondary/20"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {whatIWorkThrough.map((item, i) => {
            const Icon = item.icon
            return (
              <Reveal key={item.title} delay={i * 30} style="up">
                <div className="flex flex-col md:flex-row gap-4 md:gap-6 border-b border-border pb-6 last:border-b-0">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </Section>

      {/* ============================================
          3. HOW THE RELATIONSHIP OPERATES
          ============================================ */}
      <Section
        subtitle="How the relationship operates"
        title="The product is not the meetings. The product is judgment, continuity, and an operating record."
        sectionNum="03"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Two monthly working sessions are the visible cadence. The actual value is what happens between and across them: persistent context, senior independent judgment, decision continuity, pressure-testing, evidence, architecture and business translation, decision artifacts, and an operating record of what was decided and why.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { label: 'Persistent context', desc: 'Your strategy, systems, vendors, decisions, and constraints stay on file. I do not restart from zero each session.' },
              { label: 'Senior judgment', desc: 'Independent review from someone who has shipped production AI systems and can tell you whether the plan survives contact with reality.' },
              { label: 'Decision continuity', desc: 'Context carries across decisions. What we decided last month affects what we recommend this month.' },
              { label: 'Pressure-testing', desc: 'I challenge the first answer. The stated problem is often not the problem worth solving.' },
              { label: 'Evidence', desc: 'Recommendations are backed by evidence, not assertion. What supports the decision. What weakens it.' },
              { label: 'Architecture and business translation', desc: 'I speak both languages and can translate between the engineering team and the executive team.' },
              { label: 'Decision artifacts', desc: 'Selected written artifacts tied to active priorities. Not unlimited document production.' },
              { label: 'Operating record', desc: 'A record of what was decided, by whom, why, and what happened next. Your executives can defend it without me in the room.' },
            ].map((item) => (
              <div key={item.label} className="border-l-2 border-primary/40 pl-4">
                <div className="text-sm font-semibold text-foreground mb-1">{item.label}</div>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Mid-page CTA */}
      <div className="page-padding py-8">
        <div className="section-container">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 md:p-8 text-center space-y-3">
            <p className="text-lg font-medium text-foreground">Have multiple AI decisions moving? Let's work through them together.</p>
            <Link href="#start">
              <Button size="lg" className="group">
                Start Fractional AI Advisor
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">$1,250/month. Month-to-month. Recommended 90-day working horizon.</p>
          </div>
        </div>
      </div>

      {/* ============================================
          4. DECISION FRAMEWORK / OPERATING METHOD
          ============================================ */}
      <Section
        subtitle="Operating method"
        title="The method behind every decision"
        sectionNum="04"
        className="bg-secondary/20"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          <p className="text-lg text-muted-foreground leading-relaxed">
            The same six disciplines, adapted to an ongoing advisory relationship. Not over-branded. Connected to actual executive decisions.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {methodSteps.map((step, i) => (
              <Reveal key={step.phase} delay={i * 40} style="up">
                <div className="border-l-2 border-primary/40 pl-4">
                  <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 mb-3 w-fit">
                    <span className="text-xs font-medium text-primary">{i + 1}</span>
                  </div>
                  <h3 className="text-base font-semibold mb-1">{step.phase}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </Reveal>
            ))
            }
          </div>
        </div>
      </Section>

      {/* ============================================
          5. DECISION & OPPORTUNITY SYSTEM
          ============================================ */}
      <Section
        subtitle="Decision and Opportunity System"
        title="What the workspace actually holds"
        sectionNum="05"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-lg text-muted-foreground leading-relaxed">
            The workspace is not a shared drive. It is a structured operating record that moves with the work.
          </p>
          <div className="space-y-1">
            {decisionOpportunitySystem.map((stage, i) => (
              <Reveal key={stage.label} delay={i * 40} style="up">
                <div className="flex items-start gap-4 py-3 border-b border-border last:border-b-0">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">{i + 1}</div>
                  <div>
                    <h3 className="text-sm font-bold tracking-wide">{stage.label}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{stage.sub}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="rounded-lg border border-border bg-secondary/20 p-6 space-y-3">
            <h3 className="font-semibold text-sm">What exists inside the workspace</h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                'Persistent organizational and decision context',
                'Decision Registry',
                'Opportunity Registry',
                'Evidence and context intake',
                'Vendor evaluation records',
                'Architecture review records',
                'Roadmap review records',
                'Operating model review',
                'Implementation sequencing',
                'Selected written decision artifacts',
                'Monthly Decision and Opportunity Brief',
                'Actions, commitments, and decision history',
                'Outcome and learning records',
                'Value records where evidence supports them',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Artifacts are tied to active priorities and scope. This is not unlimited document production.
          </p>
        </div>
      </Section>

      {/* ============================================
          6. REPRESENTATIVE ARTIFACTS
          ============================================ */}
      <Section
        subtitle="Representative artifacts"
        title="What the work produces"
        sectionNum="06"
        className="bg-secondary/20"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Not every artifact every month. The artifacts that match the priorities we are working through.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {decisionArtifacts.map((artifact, i) => (
              <Reveal key={artifact.name} delay={i * 30} style="up">
                <div className="flex items-start gap-3 rounded-lg border border-border p-4 bg-card">
                  <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{artifact.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">{artifact.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ============================================
          7. WHY SUBODH
          ============================================ */}
      <Section
        subtitle="Why Subodh"
        title="Why have me working through these decisions with you?"
        sectionNum="07"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-lg text-muted-foreground leading-relaxed">
            I do not approach AI only as a strategist, a developer, or a governance specialist. I work across the decision.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { label: 'Business', q: 'Does the opportunity create enough value to deserve attention?' },
              { label: 'Technology', q: 'Can it work with the systems, data, and operating environment you actually have?' },
              { label: 'Architecture', q: 'Should you buy, configure, connect, or build?' },
              { label: 'Operations', q: 'Who owns it? What happens when it fails? Where does a human remain involved?' },
              { label: 'Governance', q: 'What data, security, regulatory, compliance, or accountability exposure are we accepting?' },
              { label: 'Evidence', q: 'How will we know whether the decision worked?' },
            ].map((item) => (
              <div key={item.label} className="border-l-2 border-primary/40 pl-4">
                <div className="text-sm font-bold text-primary mb-1">{item.label}</div>
                <p className="text-sm text-muted-foreground">{item.q}</p>
              </div>
            ))}
          </div>
          <div className="pt-4 space-y-2">
            <p className="text-sm font-medium text-foreground">Verified proof behind the work:</p>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />Enterprise application portfolio leadership</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />50+ AI and technology initiatives</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />Production AI systems, including Kestrel Voice and HAIEC</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />Systems architecture and governance and compliance work</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* ============================================
          8. PRICING + 90-DAY HORIZON
          ============================================ */}
      <Section
        subtitle="Pricing and working horizon"
        title="Fractional AI Advisor"
        sectionNum="08"
        className="bg-secondary/20"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="rounded-xl border border-primary/30 bg-card p-6 md:p-8 space-y-4">
            <div className="flex items-baseline justify-between flex-wrap gap-2">
              <h3 className="text-xl font-bold">Fractional AI Advisor</h3>
              <span className="text-3xl font-bold">$1,250<span className="text-base font-normal text-muted-foreground">/month</span></span>
            </div>
            <p className="text-sm text-muted-foreground">Strategy, opportunity, vendor decisions, architecture, roadmaps, governance, and operating model. Month-to-month. No minimum term.</p>
            <div className="border-t border-border pt-4 space-y-2">
              <p className="text-sm font-medium text-foreground">What the relationship includes:</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {[
                  'Two monthly working sessions (60 minutes)',
                  'Priority asynchronous advisory',
                  'Persistent organization and decision context',
                  'Decision and Opportunity Registries',
                  'Selected written decision artifacts',
                  'Monthly Decision and Opportunity Brief',
                  'Vendor, roadmap, and architecture review',
                  'HAIEC SCAN access (1 seat)',
                  'Kestrel AI Number Basic',
                  'Member Tool Library',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-xs text-muted-foreground">
                Annual: $12,500/year (twelve months for the equivalent of ten monthly payments). Monthly is the primary choice. Annual is available if you prefer it.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 space-y-4">
            <h3 className="font-semibold text-sm">Recommended working horizon: 90 days</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The engagement is month-to-month. I recommend starting with a 90-day working horizon because the value comes from carrying context across several decisions, not from one isolated meeting.
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">At approximately 90 days, a structured review:</p>
              <ul className="text-sm text-muted-foreground space-y-1.5">
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />Decisions made</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />Opportunities advanced or rejected</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />Risks surfaced</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />Assumptions changed</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />Outcomes and evidence</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />Priorities for next period</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />Whether Fractional is still the correct relationship</li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground pt-2">
              You can continue, move to AI Advisor Desk, expand scope, or stop.
            </p>
          </div>
        </div>
      </Section>

      {/* ============================================
          9. ACTIVATION / ONBOARDING
          ============================================ */}
      <Section
        subtitle="Activation and onboarding"
        title="How the relationship starts"
        sectionNum="09"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-lg text-muted-foreground leading-relaxed">
            After payment, you complete a deeper Context Intake than the $99 plan. Then you schedule the Activation Call and your first Working Session directly from the workspace.
          </p>

          <div className="rounded-lg border border-border bg-secondary/20 p-6 space-y-4">
            <h3 className="font-semibold text-sm">Context Intake captures:</h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                'Organization: strategy, priorities, operating model',
                'Current AI portfolio: systems, experiments, vendors',
                'Decisions: 1 to 3 immediate, with owners and deadlines',
                'Opportunities: 1 to 3 worth investigating',
                'Architecture: platforms, data, integration constraints',
                'Governance and risk: policies, security, jurisdictions',
                'Roadmap: current sequence, dependencies, deadlines',
                'Stakeholders: executive sponsor, technical owner, business owners',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 space-y-3">
              <h3 className="font-semibold text-sm">Schedule your Activation Call</h3>
              <p className="text-2xl font-bold">20 minutes <span className="text-sm font-normal text-muted-foreground">complimentary</span></p>
              <ul className="text-sm text-muted-foreground space-y-1.5">
                {activationCallPurpose.map((item) => (
                  <li key={item} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />{item}</li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground">Self-scheduled from the workspace. Timezone aware. Does not count against your two monthly sessions.</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6 space-y-3">
              <h3 className="font-semibold text-sm">Schedule your first Working Session</h3>
              <p className="text-2xl font-bold">60 minutes</p>
              <p className="text-sm text-muted-foreground">The first real working session on your priorities. Can be scheduled after the Activation Call or simultaneously if operationally sensible.</p>
              <p className="text-xs text-muted-foreground">Self-scheduled from the workspace. Timezone aware. Cancellation and rescheduling available.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* ============================================
          10. LIGHTER / DEEPER ENGAGEMENT PATHS
          ============================================ */}
      <Section
        subtitle="Lighter and deeper engagement paths"
        title="This is one relationship in a larger model"
        sectionNum="10"
        className="bg-secondary/20"
      >
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Lighter */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Need a lighter relationship?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you primarily want someone watching what changes, maintaining context, and helping with focused AI decisions as they arise, AI Advisor Desk starts at $99/month.
            </p>
            <Link href="/ai-advisor">
              <Button variant="outline" size="sm" className="group">
                Explore AI Advisor Desk
                <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Deeper */}
          <div className="space-y-3 border-t border-border pt-6">
            <h3 className="text-lg font-semibold">Need implementation, not advisory?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Fractional AI Advisor is advisory. If a decision has been made and you need substantial architecture, implementation, integration, or build work, that becomes a separately scoped engagement. I flag this before implementation work begins. The Fractional retainer is not silently consumed by build work.
            </p>
            <Link href="/ai-automation">
              <Button variant="outline" size="sm" className="group">
                See AI Automation and Implementation
                <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </Section>

      {/* ============================================
          11. INCLUDED AI CAPABILITY ACCESS
          ============================================ */}
      <Section
        subtitle="Included AI capability access"
        title="Member tools included with your subscription"
        description="Human judgment comes first. These supporting tools extend what the advisory relationship can do. Product limits apply to each included tool."
        sectionNum="11"
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="h-full">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">HAIEC SCAN</CardTitle>
                <CardDescription className="text-sm mt-1">
                  One HAIEC SCAN-level entitlement seat. Aligned to the current HAIEC SCAN product. Higher HAIEC tiers, additional seats, runtime testing, CI/CD, enterprise evidence bundles, implementation, and managed compliance remain separately purchased or scoped.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="h-full">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">Kestrel AI Number Basic</CardTitle>
                <CardDescription className="text-sm mt-1">
                  One AI phone number with basic AI answering. 20 included monthly credits. Self-service configuration. Additional usage or upgrades are governed by Kestrel plan limits and are purchased separately within Kestrel.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="h-full">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Wrench className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">Member Tool Library</CardTitle>
                <CardDescription className="text-sm mt-1">
                  Production-ready internal decision, architecture, research, and technical utilities available to advisory clients. Additional tools are added as they become available.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center max-w-2xl mx-auto">
            Included product access is a supporting capability, not the reason to subscribe. HAIEC and Kestrel maintain their own product limits, acceptable-use terms, and upgrade paths. Advisory subscription does not create additional uptime or SLA guarantees for those products.
          </p>
        </div>
      </Section>

      {/* ============================================
          12. ADVISOR AFFILIATION + SERVICE EXPECTATIONS + SESSION POLICY
          ============================================ */}
      <Section
        subtitle="Affiliation, expectations, and session policy"
        title="How the engagement works in practice"
        sectionNum="12"
        className="bg-secondary/20"
      >
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Affiliation */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Handshake className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Advisor affiliation</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  An active Fractional client may, with approval, identify Subodh KC as Fractional AI Advisor or External AI Advisor in appropriate materials.
                </p>
                <div className="grid sm:grid-cols-2 gap-2 mt-3">
                  {affiliationUses.map((use) => (
                    <div key={use} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{use}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  This does not create employment, officer status, agency, fiduciary authority, or authority to bind either party. Public quotes, press releases, logos, or alternative titles require approval. Full terms are in the Fractional AI Advisor Service Terms.
                </p>
              </div>
            </div>
          </div>

          {/* Service expectations */}
          <div className="border-t border-border pt-6 space-y-3">
            <h3 className="font-semibold text-sm">Advisory service expectations</h3>
            <div className="space-y-2">
              {serviceExpectations.map((exp) => (
                <div key={exp.label} className="flex items-start gap-3 rounded-lg border border-border p-3 bg-card">
                  <Clock className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{exp.label}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{exp.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Session policy */}
          <div className="border-t border-border pt-6 space-y-3">
            <h3 className="font-semibold text-sm">Session policy</h3>
            <div className="space-y-2">
              {sessionPolicy.map((policy) => (
                <div key={policy} className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{policy}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ============================================
          13. FAQ
          ============================================ */}
      <Section
        subtitle="FAQ"
        title="Common questions about fractional AI advisory"
        sectionNum="13"
      >
        <div className="max-w-3xl mx-auto">
          <FAQAccordion items={faqs} />
        </div>
      </Section>

      {/* ============================================
          FINAL CTA + CHECKOUT
          ============================================ */}
      <div id="start">
        <FractionalAdvisorCheckoutCTA
          title="Start Fractional AI Advisor"
          description="$1,250/month. Senior AI judgment working through your strategy, vendor, architecture, roadmap, and governance decisions. Two monthly working sessions, priority async advisory, Decision and Opportunity Workspace, Monthly Brief, selected decision artifacts, HAIEC SCAN access, Kestrel AI Number Basic, and Member Tool Library. Month-to-month. Recommended 90-day working horizon."
          bullets={getCheckoutBullets('fractional_ai_advisor')}
        />
      </div>

      {/* Sticky mobile CTA */}
      <FractionalStickyCTA />
    </>
  )
}
