import Link from 'next/link'
import Section from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import {
  TrendingUp,
  Telescope,
  Building2,
  Shield,
  Scale,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Layers,
  Users,
  Phone,
  Wrench,
  Clock,
} from 'lucide-react'
import { AdvisorCheckoutCTA } from '@/components/commercial/AdvisorCheckoutCTA'
import { AdvisorHeroCTA } from '@/components/commercial/AdvisorHeroCTA'
import { getCheckoutBullets } from '@/lib/commercial/offers'
import { AdvisorStickyCTA } from '@/components/commercial/AdvisorStickyCTA'
import { FAQAccordion } from '@/components/ai-advisor/FAQAccordion'

export const metadata = {
  title: 'AI Advisor for Business | AI Opportunity, Strategy & Risk | Subodh KC',
  description:
    'I learn your business, watch for developments that change your options, and give you a point of view when something matters. $99/month, up to 3 team members.',
  alternates: {
    canonical: 'https://subodhkc.com/ai-advisor',
  },
  openGraph: {
    title: 'AI Advisor for Business | AI Opportunity, Strategy & Risk | Subodh KC',
    description:
      'I learn your organization, watch for developments that change your options, and give you a point of view when something matters. $99/month, up to 3 team members.',
    url: 'https://subodhkc.com/ai-advisor',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Advisor for Business | Subodh KC',
    description: 'Context, watch, and judgment for AI decisions. $99/month, up to 3 team members.',
  },
  keywords: [
    'AI advisor for business',
    'AI advisor',
    'AI business advisor',
    'AI advisory services',
    'AI strategy advisor',
    'human AI advisor',
    'AI opportunity discovery',
    'AI use case prioritization',
    'AI workflow assessment',
    'AI decision support',
    'AI readiness assessment',
    'AI vendor evaluation',
    'AI build vs buy',
    'AI architecture advisor',
    'AI implementation advisor',
    'AI governance advisor',
    'AI compliance advisor',
    'AI regulatory compliance',
    'AI risk advisory',
    'AI security review',
    'shadow AI governance',
    'Subodh KC',
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'AI Advisor for Business', item: 'https://subodhkc.com/ai-advisor' },
  ],
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'AI Advisor for Business',
  description:
    'Ongoing human AI advisory. I learn your organization, watch for developments that change your options, and give you a point of view when something matters. Covers opportunity, advancements, vendor decisions, AI risk, and regulation and compliance. $99/month, up to 3 team members.',
  url: 'https://subodhkc.com/ai-advisor',
  provider: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
  serviceType: 'AI Advisory',
  areaServed: 'Global',
  offers: {
    '@type': 'Offer',
    price: '99',
    priceCurrency: 'USD',
    billingDuration: 'P1M',
  },
}

const faqs = [
  {
    q: 'What does an AI advisor for business do?',
    a: 'An AI advisor for business learns your organization, maintains that context over time, watches for developments that could change your options, and gives you a point of view when something deserves attention. The value is not in tracking everything happening in AI. It is in identifying the smaller set of changes that materially affect your business and helping you decide what to do about them.',
  },
  {
    q: 'What is the difference between an AI advisor and an AI consultant?',
    a: 'A consultant typically engages for a defined project, delivers a deliverable, and exits. An AI advisor is an ongoing relationship. I maintain context about your priorities, systems, vendors, and decisions, and I watch for developments that change your options. When something matters, you already have someone who understands your business rather than starting from a blank page.',
  },
  {
    q: 'How can an AI advisor help identify AI opportunities?',
    a: 'I look at your workflows, systems, data, and operating constraints, then watch for developments that could create material value: new revenue, increased capacity, lower operating cost, faster workflows, or capabilities that were impractical before. An opportunity is useful only when the economics, workflow, and operating reality support it. I help you separate the ones worth pursuing from the ones that are not.',
  },
  {
    q: 'Can you help evaluate an AI vendor?',
    a: 'Yes. Bring a vendor proposal, a product you are considering, or a contract you are about to sign. I review the data handling, security posture, architecture fit, dependency exposure, and operational implications. You receive a practical point of view on whether it fits and what to check before committing.',
  },
  {
    q: 'Can you help determine whether we should build or buy an AI system?',
    a: 'Yes. The build-versus-buy question depends on your systems, data, team capacity, cost tolerance, and control requirements. I work through the options with you: buy, configure, connect, build, wait, or stop. The answer depends on your environment, not on a general principle.',
  },
  {
    q: 'Can you help us understand AI regulation and compliance risk?',
    a: 'I watch for regulatory changes and signals that may change your obligations or reveal a gap worth examining. When something appears material, we determine whether it deserves deeper applicability, control, or evidence review rather than reacting to every regulatory headline. I do not provide legal advice. For regulatory compliance obligations, consult a licensed attorney.',
  },
  {
    q: 'What happens when an AI law changes?',
    a: 'When a law, rule, or enforcement position changes, I assess whether it applies to your business, your jurisdictions, and your AI use cases. If it does, I help you understand what changed, what it exposes, and what you may need to do. If it does not, I tell you that too so you do not spend time and budget on something that does not apply.',
  },
  {
    q: 'Do you provide legal advice?',
    a: 'No. I watch for regulatory changes and compliance signals and help you understand their business implications. For legal advice on regulatory compliance obligations, consult a licensed attorney. I can help you identify when a legal question deserves attention and prepare the context for that conversation.',
  },
  {
    q: 'What is an AI Workflow Decision Review?',
    a: 'An AI Workflow Decision Review is a focused $500 investigation of one workflow or opportunity. It goes deeper than an advisory answer: current process, actual problem, AI opportunity, options, buy or configure or connect or build or keep current, business value, implementation effort, data, integrations, feasibility, dependencies, security, governance, regulatory considerations, human fallback, and success measures. The outcome is a recommendation: proceed, investigate further, defer, or stop. It is available to Advisor members and is positioned as a deeper step when a single decision deserves more investigation.',
  },
  {
    q: 'How long should I use the Advisor Desk?',
    a: 'There is no minimum term. I recommend giving the Desk about 90 days because the value improves as I learn your priorities, decisions, systems, and operating context. If it is not useful to you, you should not keep paying for it. Cancel anytime before your next billing date.',
  },
  {
    q: 'What is the difference between AI Advisor and Fractional AI Advisor?',
    a: 'AI Advisor for Business ($99/month) is ongoing watch and advisory access for focused questions as decisions come up. Fractional AI Advisor ($1,250/month) is a closer executive advisory relationship with two monthly working sessions, ongoing async decision support, and selected decision artifacts tied to your priorities. If you need someone watching and thinking with you, start here. If you need someone working through multiple interconnected decisions with you, see Fractional AI Advisor.',
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

const watchTerritories = [
  {
    icon: TrendingUp,
    title: 'Opportunity',
    desc: 'Where could AI create material value? New revenue, increased capacity, lower operating cost, faster workflows, customer experience, new services, previously impractical capabilities, removing repetitive work, or improving a constrained process.',
    principle: 'An opportunity is useful only when the economics, workflow, and operating reality support it.',
  },
  {
    icon: Telescope,
    title: 'Advancements',
    desc: 'What became possible that was not practical before? Model capability changes, agents, voice, multimodal systems, automation, inference cost, integrations, enterprise AI platforms, and emerging technical patterns.',
    principle: 'A decision that was wrong last year may be right today. A project that looked attractive last year may also have become unnecessary.',
  },
  {
    icon: Building2,
    title: 'Market',
    desc: 'Relevant vendors, product releases, pricing, platform shifts, competitors, acquisitions, industry adoption, customer expectations, and material ecosystem changes.',
    principle: 'I watch for changes that could affect your options. I do not imply continuous real-time competitive intelligence unless the system actually provides it.',
  },
  {
    icon: Shield,
    title: 'Risk',
    desc: 'AI security, privacy, sensitive data, vendor dependency, architecture, permissions, uncontrolled or shadow AI, human oversight, operational failure, hallucination and reliability where relevant, and third-party AI exposure.',
    principle: 'Risk is not a reason to avoid AI. It is a reason to understand what exposure you are accepting before you accept it.',
  },
  {
    icon: Scale,
    title: 'Law and Compliance',
    desc: 'New AI laws, changes in applicable law, regulatory guidance, enforcement developments, jurisdiction changes, potential compliance exposure, control gaps, documentation and evidence requirements, and AI use in areas such as hiring where rules may matter.',
    principle: 'I watch for regulatory changes and signals that may change your obligations or reveal a gap worth examining. I do not detect legal violations. I do not prevent penalties. I do not provide legal advice.',
  },
  {
    icon: MessageSquare,
    title: 'Your Decisions',
    desc: 'Intelligence moves both directions. A proposed AI vendor, an automation idea, an AI feature, a workflow bottleneck, an architecture proposal, a build-versus-buy question, a data or permission question, a policy decision, a proposed AI investment, an executive request, a customer AI request, or a tool someone wants approved.',
    principle: 'You do not have to wait for me to find something. Bring the Desk what is already moving inside your organization.',
  },
]

const decisionFramework = [
  { label: 'VALUE', q: 'What materially improves?' },
  { label: 'FIT', q: 'Is this the right problem?' },
  { label: 'FEASIBILITY', q: 'Can it work in this environment?' },
  { label: 'OPTIONS', q: 'Buy, configure, connect, build, wait, or stop?' },
  { label: 'DEPENDENCIES', q: 'What are we becoming dependent on?' },
  { label: 'CONTROL', q: 'What stays human and what is AI allowed to do?' },
  { label: 'RISK', q: 'What security, operational, regulatory, governance, or compliance exposure are we accepting?' },
  { label: 'EVIDENCE', q: 'What would prove the decision worked?' },
]

const systemsBehindDesk = [
  {
    icon: Layers,
    title: 'Organizational Context and Watchlist',
    desc: 'Persistent context that helps keep the intelligence and advice relevant. Your priorities, systems, workflows, vendors, constraints, and jurisdictions stay on file and stay editable.',
  },
  {
    icon: MessageSquare,
    title: 'Human Advisory',
    desc: 'Focused AI questions and decisions reviewed by Subodh. Most focused questions receive a reviewed response within 72 hours.',
  },
  {
    icon: Shield,
    title: 'HAIEC Advisor Essentials',
    desc: 'Structured support for AI readiness, governance, vendor review, regulatory applicability, and selected control and evidence questions. Does not imply legal certification or guaranteed compliance.',
  },
  {
    icon: Phone,
    title: 'Kestrel AI Number Basic',
    desc: 'Access to an operating AI phone capability so members can experience and evaluate an actual production AI workflow rather than only discuss one.',
  },
  {
    icon: Wrench,
    title: 'Decision and Research Tools',
    desc: 'Selected tools and frameworks used for AI opportunity, architecture, risk, and implementation decisions.',
  },
]

const commercialLadder = [
  {
    step: 'WATCH',
    name: 'AI Advisor Desk',
    price: '$99/month',
    desc: 'Someone watching and thinking with you.',
  },
  {
    step: 'INVESTIGATE',
    name: 'AI Workflow Decision Review',
    price: '$500 per workflow',
    desc: 'A focused decision on one opportunity or workflow. Positioned for Advisor members.',
  },
  {
    step: 'ADVISE',
    name: 'Fractional AI Advisor',
    price: '$1,250/month',
    desc: 'Someone working through multiple interconnected decisions with you.',
  },
  {
    step: 'ARCHITECT / BUILD',
    name: 'Custom scoped',
    price: 'Scoped when earned',
    desc: 'When the decision has earned implementation.',
  },
]

const boundaries = [
  'Reasonable-use focused advisory. No per-question metering, but this is not an unlimited consulting engagement.',
  'Most focused questions are reviewed within 72 hours. No guaranteed emergency support, no 24/7 monitoring, no managed incident response.',
  'Deeper research, document review, architecture work, or implementation is not silently billed. I flag it before any additional work begins and offer a scoped option.',
  'The AI Workflow Decision Review exists for deeper single-workflow investigation. Fractional AI Advisor exists for sustained, interconnected work.',
  'No legal advice. For regulatory compliance obligations, consult a licensed attorney.',
  'No guaranteed compliance. No guaranteed business outcome.',
]

export default function AIAdvisorPage() {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ============================================
          HERO: 60/40 desktop, positioning + price + CTA + visual model
          ============================================ */}
      <section className="page-padding pt-16 md:pt-21 pb-12 md:pb-16 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="section-container relative z-10">
          <div className="grid lg:grid-cols-[3fr_2fr] gap-8 md:gap-12 lg:gap-16 items-center">
            {/* Left: positioning, price, CTA */}
            <div className="space-y-6 md:space-y-8">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
                <span className="text-sm font-medium text-primary">Your AI Advisor Desk</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                You don&apos;t need to track everything changing in AI. <span className="gradient-text">You need to know when something changes your options.</span>
              </h1>

              <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                I learn your business, then watch for developments that could create an opportunity, change an assumption, introduce risk, or make something newly possible. When something matters, I help you decide what to do.
              </p>

              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl md:text-4xl font-bold">$99<span className="text-lg font-normal text-muted-foreground">/month</span></span>
                  <span className="text-sm text-muted-foreground">Up to 3 people</span>
                </div>
                <p className="text-sm text-muted-foreground">Month-to-month. Cancel anytime.</p>
              </div>

              <AdvisorHeroCTA />
            </div>

            {/* Right: Context -> Watch -> Find -> Decide -> Act visual model */}
            <div className="relative">
              <Reveal delay={200} style="up">
                <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-4 md:p-6 lg:p-8 space-y-1">
                  <div className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3 md:mb-4 text-center">
                    How the Advisor Desk works
                  </div>

                  {[
                    { label: 'YOUR BUSINESS', sub: null, tone: 'neutral' },
                    { label: 'CONTEXT', sub: 'Priorities, systems, workflows, vendors, constraints, jurisdictions', tone: 'context' },
                    { label: 'WATCH', sub: 'Opportunity, advancements, market, vendors, risk, regulation', tone: 'watch' },
                    { label: 'FIND', sub: 'Opportunity, exposure, dependency, changed assumption, decision', tone: 'find' },
                    { label: 'DECIDE', sub: 'Buy, configure, connect, build, wait, stop', tone: 'decide' },
                    { label: 'ACT / RECORD', sub: null, tone: 'act' },
                  ].map((stage, i) => (
                    <div key={i}>
                      {i > 0 && (
                        <div className="flex justify-center py-0.5 md:py-1" aria-hidden="true">
                          <ArrowRight className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground rotate-90" />
                        </div>
                      )}
                      <div
                        className={`rounded-lg px-3 md:px-4 py-2 md:py-3 text-center ${
                          stage.tone === 'neutral'
                            ? 'bg-muted/40 border border-border'
                            : stage.tone === 'context'
                            ? 'bg-primary/5 border border-primary/20'
                            : stage.tone === 'watch'
                            ? 'bg-accent/5 border border-accent/20'
                            : stage.tone === 'find'
                            ? 'bg-primary/10 border border-primary/30'
                            : stage.tone === 'decide'
                            ? 'bg-primary/15 border border-primary/40'
                            : 'bg-muted/60 border border-border'
                        }`}
                      >
                        <div className="text-xs md:text-sm font-bold tracking-wide">{stage.label}</div>
                        {stage.sub && (
                          <div className="hidden md:block text-xs text-muted-foreground mt-1 leading-relaxed">{stage.sub}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Capability line: territory covered */}
      <div className="page-padding pb-8">
        <div className="section-container">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground border-y border-border py-3 md:py-4">
            {['Opportunity', 'Advancements', 'Decisions', 'Vendors', 'Architecture', 'Risk', 'Law & Compliance'].map((tag, i) => (
              <span key={tag} className="flex items-center gap-2 md:gap-3">
                <span className="font-medium text-foreground/80">{tag}</span>
                {i < 6 && <span className="text-border hidden sm:inline" aria-hidden="true">/</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================
          1. WHY THIS EXISTS
          ============================================ */}
      <Section
        subtitle="Why this exists"
        title="AI changes quickly. Your business does not need to chase all of it."
        sectionNum="01"
      >
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-lg text-muted-foreground leading-relaxed">
            A model improves. A capability that was impractical six months ago becomes economical. A vendor changes pricing, architecture, or terms. A competitor changes how it operates. A new security issue appears. A law, rule, or enforcement position changes. An existing AI workflow creates potential compliance exposure.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Most changes will not materially affect your business. Some will.
          </p>
          <p className="text-xl font-medium text-foreground leading-relaxed pt-2">
            My job is to help identify the difference.
          </p>
        </div>
      </Section>

      {/* ============================================
          WHO IS THIS FOR
          ============================================ */}
      <Section
        subtitle="Who this is for"
        title="Is this the right relationship for you?"
        sectionNum="02"
      >
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Founders and CEOs', desc: 'Who want someone watching AI developments that could create or threaten value, without becoming the AI expert themselves.' },
              { title: 'CTOs and technology leaders', desc: 'Who need a sounding board on vendor decisions, architecture, build-versus-buy, and what just became practical.' },
              { title: 'Operations leaders', desc: 'Who suspect AI could improve a constrained workflow but need help separating real opportunities from noise.' },
              { title: 'Executives in regulated industries', desc: 'Who need to understand when AI regulation changes something that applies to them, and when it does not.' },
            ].map((persona) => (
              <div key={persona.title} className="border-l-2 border-primary/40 pl-4 py-1">
                <h3 className="text-sm font-semibold mb-1">{persona.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{persona.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground pt-2 text-center">
            If you have an AI decision moving inside your organization, this is for you.
          </p>
        </div>
      </Section>

      {/* ============================================
          3. WHAT I WATCH FOR
          ============================================ */}
      <Section
        subtitle="What I watch for"
        title="Six territories that could change your options."
        sectionNum="03"
        className="bg-secondary/20"
      >
        <div className="max-w-5xl mx-auto space-y-6">
          {watchTerritories.map((territory, i) => {
            const Icon = territory.icon
            return (
              <Reveal key={territory.title} delay={i * 40} style="up">
                <div className="flex flex-col md:flex-row gap-4 md:gap-6 border-b border-border pb-6 last:border-b-0">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-semibold">{territory.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{territory.desc}</p>
                    <p className="text-sm font-medium text-foreground/80 italic">{territory.principle}</p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </Section>

      {/* ============================================
          3. HOW THE ADVISOR DESK WORKS
          ============================================ */}
      <Section
        subtitle="How the Advisor Desk works"
        title="Context, watch, and judgment. The systems strengthen the relationship. They are not the reason for the relationship."
        sectionNum="04"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">1</div>
              <div>
                <h3 className="font-semibold mb-1">I learn your context</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">After you subscribe, you complete an Organizational AI Context Profile. Priorities, systems, workflows, vendors, constraints, jurisdictions, and the decisions already in play. This takes 5 to 10 minutes and is always editable.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">2</div>
              <div>
                <h3 className="font-semibold mb-1">I watch what matters</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">From your context, I watch for developments across the six territories that could change your options. You receive relevant AI signal: what changed, why it matters, what it could change, and what I would do next.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">3</div>
              <div>
                <h3 className="font-semibold mb-1">I give you a point of view</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">When something matters, you get a practical point of view, not a summary. You can also bring the Desk decisions that are already moving inside your organization: a vendor proposal, an automation idea, a build-versus-buy question, a policy decision.</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ============================================
          5. WHAT HAPPENS AFTER PURCHASE
          ============================================ */}
      <Section
        subtitle="What happens after purchase"
        title="From signup to your first point of view."
        sectionNum="05"
        className="bg-secondary/20"
      >
        <div className="max-w-3xl mx-auto space-y-1">
          {[
            { step: 'Day 0', title: 'You subscribe', desc: 'Checkout takes 2 minutes. You get a confirmation and a welcome email with next steps.' },
            { step: 'Day 0-1', title: 'Context intake', desc: 'You complete a 5 to 10 minute Organizational AI Context Profile. Priorities, systems, workflows, vendors, constraints, jurisdictions.' },
            { step: 'Day 1-3', title: 'Watchlist seeded', desc: 'From your context, I draft a starting watchlist. You review it. I calibrate it on the activation call.' },
            { step: 'Day 1-7', title: 'Activation call', desc: '15-minute call (30-minute slot held as padding). We calibrate the watchlist and clarify decisions already in play.' },
            { step: 'Ongoing', title: 'Watch and advise', desc: 'I watch for developments across six territories. When something matters, you get a point of view. You can bring decisions any time.' },
            { step: 'Day 90', title: 'Context calibration', desc: 'Around 90 days, we check whether priorities, systems, vendors, and jurisdictions are still correct.' },
          ].map((item, i) => (
            <Reveal key={i} delay={i * 30} style="up">
              <div className="flex items-start gap-4 py-4 border-b border-border last:border-b-0">
                <div className="flex-shrink-0 w-20 md:w-24 text-xs font-bold text-primary uppercase pt-1">{item.step}</div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ============================================
          5. WHY SUBODH (moved early)
          ============================================ */}
      <Section
        subtitle="Why Subodh"
        title="Why have me watching this with you?"
        sectionNum="06"
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

      {/* Mid-page CTA */}
      <div className="page-padding py-8">
        <div className="section-container">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 md:p-8 text-center space-y-3">
            <p className="text-lg font-medium text-foreground">Ready to stop tracking everything and start knowing what matters?</p>
            <Link href="#start">
              <Button size="lg" className="group">
                Start My Advisor Desk
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">$99/month, up to 3 people. Month-to-month. Cancel anytime.</p>
          </div>
        </div>
      </div>

      {/* ============================================
          7. DECISION FRAMEWORK
          ============================================ */}
      <Section
        subtitle="Decision framework"
        title="The framework behind the advice"
        sectionNum="07"
        className="bg-secondary/20"
      >
        <div className="max-w-3xl mx-auto space-y-4">
          {decisionFramework.map((item, i) => (
            <Reveal key={item.label} delay={i * 30} style="up">
              <div className="flex flex-col sm:flex-row items-start gap-1 sm:gap-4 border-b border-border pb-3 last:border-b-0">
                <div className="flex-shrink-0 w-full sm:w-24 text-xs font-bold tracking-widest text-primary uppercase pt-1">{item.label}</div>
                <p className="text-sm text-foreground/90 flex-1">{item.q}</p>
              </div>
            </Reveal>
          ))}
          <p className="text-lg font-medium text-foreground pt-4 leading-relaxed">
            If expected value does not materially justify the cost, complexity, and risk, I do not recommend the project.
          </p>
        </div>
      </Section>

      {/* ============================================
          7. WHAT EXISTS INSIDE THE DESK
          ============================================ */}
      <Section
        subtitle="What exists inside the Desk"
        title="The systems behind your Advisor Desk"
        sectionNum="08"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-lg text-muted-foreground leading-relaxed">
            You are not buying software instead of an advisor. The software strengthens the advisor.
          </p>
          <div className="space-y-4">
            {systemsBehindDesk.map((system, i) => {
              const Icon = system.icon
              return (
                <Reveal key={system.title} delay={i * 40} style="up">
                  <div className="flex items-start gap-4 border-l-2 border-primary/30 pl-4">
                    <Icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-sm mb-1">{system.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{system.desc}</p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </Section>

      {/* ============================================
          8. MEMBER-ONLY WORKFLOW DECISION REVIEW ($500)
          ============================================ */}
      <Section
        subtitle="When something deserves deeper investigation"
        title="AI Workflow Decision Review"
        sectionNum="09"
        className="bg-secondary/20"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Some decisions need more than an advisory answer. Advisor members can commission a focused AI Workflow Decision Review for one workflow or opportunity.
          </p>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 space-y-3">
            <div className="flex items-baseline justify-between">
              <h3 className="text-lg font-semibold">AI Workflow Decision Review</h3>
              <span className="text-2xl font-bold">$500<span className="text-sm font-normal text-muted-foreground"> /workflow</span></span>
            </div>
            <p className="text-sm text-muted-foreground">Positioned for Advisor members. A focused decision on one opportunity or workflow.</p>
            <div className="grid sm:grid-cols-2 gap-2 pt-2">
              {[
                'Current process and actual problem',
                'AI opportunity and options',
                'Buy, configure, connect, build, or keep current',
                'Business value and implementation effort',
                'Operating economics where evidence allows',
                'Data, integrations, and technical feasibility',
                'Dependencies and security',
                'Governance and regulatory considerations',
                'Human fallback and success measures',
                'Recommendation: proceed, investigate, defer, or stop',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-lg font-medium text-foreground leading-relaxed">
            The objective is not to produce another AI report. It is to answer: should we do this, and what is the most sensible path?
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/ai-automation">
              <Button variant="outline" size="sm">
                Learn about the Workflow Decision Review
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </Section>

      {/* ============================================
          9. ADVISOR DESK vs FRACTIONAL
          ============================================ */}
      <Section
        subtitle="Advisor Desk vs Fractional"
        title="Which relationship do you need?"
        sectionNum="10"
      >
        <div className="max-w-3xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-primary">
              <CardHeader>
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 mb-2 w-fit">
                  <span className="text-xs font-medium text-primary">Start here</span>
                </div>
                <CardTitle className="text-xl">AI Advisor Desk</CardTitle>
                <CardDescription className="text-base">$99/month, up to 3 people</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">Someone watching and thinking with you.</p>
                <ul className="space-y-1.5 text-sm">
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />Ongoing watch across six territories</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />Organizational AI Context Profile</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />Personalized Watchlist</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />Human advisory access</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />HAIEC Advisor Essentials</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />Kestrel AI Number Basic</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />Activation call included</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3 py-1 mb-2 w-fit">
                  <span className="text-xs font-medium text-muted-foreground">When stakes are higher</span>
                </div>
                <CardTitle className="text-xl">Fractional AI Advisor</CardTitle>
                <CardDescription className="text-base">$1,250/month</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">Someone working through the decisions with you, not just watching for you.</p>
                <p className="text-xs text-muted-foreground mb-3 italic">The difference is depth of involvement, not a bigger feature package.</p>
                <ul className="space-y-1.5 text-sm">
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />Two monthly working sessions (60 min)</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />Priority async advisory</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />Decision and Opportunity Workspace</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />Monthly Decision and Opportunity Brief</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />Vendor, roadmap, and architecture review</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />Selected decision artifacts</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />HAIEC SCAN access</li>
                </ul>
                <Link href="/advisory" className="block mt-4">
                  <Button variant="outline" size="sm" className="w-full">See Fractional AI Advisor</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* ============================================
          10. COMMERCIAL LADDER
          ============================================ */}
      <Section
        subtitle="The commercial ladder"
        title="The model, from watch to build"
        sectionNum="11"
        className="bg-secondary/20"
      >
        <div className="max-w-3xl mx-auto space-y-1">
          {commercialLadder.map((rung, i) => (
            <Reveal key={rung.step} delay={i * 50} style="up">
              <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 py-4 border-b border-border last:border-b-0">
                <div className="flex-shrink-0 w-full sm:w-28 text-xs font-bold tracking-widest text-primary uppercase pt-1">{rung.step}</div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4">
                    <h3 className="font-semibold text-sm sm:text-base">{rung.name}</h3>
                    <span className="text-sm font-medium text-muted-foreground flex-shrink-0">{rung.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{rung.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
          <p className="text-sm text-muted-foreground pt-4">
            These represent increasing depth, not equal product cards.
          </p>
        </div>
      </Section>

      {/* ============================================
          11. 90-DAY VALUE
          ============================================ */}
      <Section
        subtitle="90-day value"
        title="How long should I use the Advisor Desk?"
        sectionNum="12"
      >
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-lg text-muted-foreground leading-relaxed">
            There is no minimum term. I recommend giving the Desk about 90 days because the value improves as I learn your priorities, decisions, systems, and operating context. If it is not useful to you, you should not keep paying for it.
          </p>
          <div className="rounded-lg border border-border bg-secondary/20 p-6 space-y-3">
            <h3 className="font-semibold text-sm">90-day Context Calibration</h3>
            <p className="text-sm text-muted-foreground">Around the 90-day mark, I prompt a lightweight calibration:</p>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />Are priorities still correct?</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />What changed?</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />What decisions closed?</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />What new decisions appeared?</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />Vendors or systems changed?</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />Jurisdictions changed?</li>
            </ul>
            <p className="text-sm text-muted-foreground pt-2">This creates a natural retention and value cycle without artificial lock-in.</p>
          </div>
        </div>
      </Section>

      {/* ============================================
          12. SIGNAL DELIVERY
          ============================================ */}
      <Section
        subtitle="Signal delivery"
        title="Relevant AI Signal"
        sectionNum="13"
        className="bg-secondary/20"
      >
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-lg text-muted-foreground leading-relaxed">
            The subscription is not primarily a newsletter. If weekly intelligence exists, it is one delivery mechanism. What you receive is:
          </p>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="text-sm font-bold mb-3">Relevant AI Signal</div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2"><ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />What changed</div>
              <div className="flex items-start gap-2"><ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />Why it matters</div>
              <div className="flex items-start gap-2"><ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />What it could change</div>
              <div className="flex items-start gap-2"><ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />What I would do next</div>
            </div>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1.5">
            <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />Regular personalized intelligence summary</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />Material signals when identified</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />Monthly or periodic point of view</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />Business-context relevance</li>
          </ul>
          <p className="text-sm text-muted-foreground">I do not promise real-time or 24/7 monitoring unless technically and operationally true.</p>
        </div>
      </Section>

      {/* ============================================
          13. SERVICE BOUNDARIES + FAQ
          ============================================ */}
      <Section
        subtitle="Boundaries and FAQ"
        title="What this is, and common questions"
        sectionNum="14"
      >
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Boundaries */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Service boundaries</h3>
            {boundaries.map((b, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">{i + 1}</span>
                <p className="text-sm text-muted-foreground">{b}</p>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Common questions</h3>
            <FAQAccordion items={faqs} />
          </div>
        </div>
      </Section>

      {/* ============================================
          FINAL CTA + CHECKOUT
          ============================================ */}
      <div id="start">
        <AdvisorCheckoutCTA
          title="Start My Advisor Desk"
          description="$99/month. I learn your context, watch what matters, and give you a point of view when something deserves attention. Up to 3 team members. Month-to-month. Cancel anytime."
          bullets={getCheckoutBullets('ai_advisor_desk')}
        />
      </div>

      {/* Sticky mobile CTA */}
      <AdvisorStickyCTA />
    </>
  )
}
