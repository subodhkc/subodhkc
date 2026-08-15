import Link from 'next/link'
import Hero from '@/components/Hero'
import Section from '@/components/Section'
import Grid from '@/components/Grid'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import {
  Shield,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Mail,
  Clock,
  Zap,
  FileText,
  Compass,
  Eye,
  Lightbulb,
  Brain,
  Building2,
  Users,
} from 'lucide-react'
import { AdvisorCheckoutCTA } from '@/components/commercial/AdvisorCheckoutCTA'

export const metadata = {
  title: 'AI Advisor Desk | AI Intelligence, Opportunity Discovery & Human Advisory',
  description:
    'An AI advisor in your corner. Ongoing AI intelligence, opportunity discovery, and human advisory access. See what is changing, what it could mean for you, and what deserves action. $99/month, up to 3 team members.',
  alternates: {
    canonical: 'https://subodhkc.com/ai-advisor',
  },
  openGraph: {
    title: 'AI Advisor Desk | AI Intelligence, Opportunity Discovery & Human Advisory',
    description:
      'An AI advisor in your corner. Ongoing AI intelligence, curated signals, and human advisory access. $99/month, up to 3 team members.',
    url: 'https://subodhkc.com/ai-advisor',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Advisor Desk | AI Intelligence & Human Advisory',
    description: 'An AI advisor in your corner. Ongoing AI intelligence, curated signals, and human advisory access. $99/month, up to 3 team members.',
  },
  keywords: [
    'AI advisor',
    'human AI advisor',
    'AI business advisor',
    'AI strategy advisor',
    'AI implementation advisor',
    'AI advisor for founders',
    'AI advisor for SaaS',
    'AI advisor for startups',
    'AI technology advisor',
    'AI decision support',
    'AI opportunity assessment',
    'AI use case assessment',
    'AI executive briefing',
    'AI automation advisor',
    'Dallas AI advisor',
    'DFW AI consultant',
    'Texas AI advisor',
    'AI advisor for small business',
    'AI advisor desk',
    'Subodh KC',
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'AI Advisor Desk', item: 'https://subodhkc.com/ai-advisor' },
  ],
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'AI Advisor Desk',
  description: 'Ongoing AI intelligence, opportunity discovery, and human advisory access. Curated signals across models, tools, research, security, regulation, and real-world adoption. $99/month, up to 3 team members.',
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

const buyerQuestions = [
  {
    category: 'Your team uses AI tools',
    questions: [
      'Which tools deserve review?',
      'What data questions should we ask?',
      'Do we have appropriate ownership and controls?',
    ],
  },
  {
    category: 'You are evaluating an AI vendor',
    questions: [
      'What should we review before relying on it?',
      'What security and data questions should we ask?',
      'What red flags should we watch for?',
    ],
  },
  {
    category: 'You use AI in hiring',
    questions: [
      'Do the job description, resume-screening process or AI-assisted workflow raise bias/control questions?',
      'What documentation should we maintain?',
    ],
  },
  {
    category: 'AI rules are changing',
    questions: [
      'Which developments deserve attention?',
      'Which regulations apply to us?',
      'What should we do now vs later?',
    ],
  },
  {
    category: 'Your team wants to automate a process',
    questions: [
      'Is this a good candidate for AI?',
      'Does it need a Blueprint?',
    ],
  },
  {
    category: 'Management asks what to do next',
    questions: [
      'What deserves action now?',
      'What can wait?',
      'What should we stop doing?',
    ],
  },
]

const whatYouGet = [
  {
    icon: TrendingUp,
    title: 'Weekly AI Intelligence Brief',
    description: 'What changed. Why it matters. What may deserve action. Curated across models, tools, research, security, regulation, and real-world adoption — with executive, management, and technical lenses.',
  },
  {
    icon: Shield,
    title: 'AI Controls Review',
    description: 'A periodic review of your AI tools, vendor agreements, and internal practices. Identifies gaps before they become incidents.',
  },
  {
    icon: FileText,
    title: 'AI-Related Regulatory Monitoring',
    description: 'Track AI regulations and frameworks relevant to your industry and business size. Know which rules apply and which developments deserve attention.',
  },
  {
    icon: Zap,
    title: 'AI Tools and Vendor Guidance',
    description: 'Ask which AI tools fit your workflow, what to check before signing a vendor contract, and how to evaluate security claims.',
  },
  {
    icon: Clock,
    title: 'AI Hiring and Policy Support',
    description: 'Selected checks on AI-related job descriptions, resume-screening processes, and AI-assisted workflows. Get help writing AI usage policies and setting boundaries.',
  },
  {
    icon: Mail,
    title: 'Human Advisory Access',
    description: 'When an AI decision matters, bring it to the Desk. I review the context, pressure-test the options, and give you a practical point of view on what deserves action. Most focused questions receive a thoughtfully reviewed response within 72 hours.',
  },
]

const boundaries = [
  'This is not a full consulting engagement. It is focused human guidance for specific AI decisions as they come up.',
  'This is not continuous monitoring or managed services. For that, see our advisory engagements.',
  'This is not legal advice. For regulatory compliance obligations, consult a licensed attorney.',
  'Deeper research, document review, architecture work, or implementation requires a separately scoped engagement. I will flag that before any additional work begins.',
]

const faqs = [
  {
    q: 'How is this different from asking ChatGPT?',
    a: 'ChatGPT gives you generic answers. The AI Advisor Desk gives you specific, contextual guidance reviewed by a human specialist who has deployed AI systems in production and built compliance frameworks used by enterprises. Every answer is grounded in your actual business context, not a generic prompt.',
  },
  {
    q: 'What happens if my question is complex?',
    a: 'When a question deserves deeper research, document review, architecture work, or implementation, I will identify that before additional work begins and recommend the right next step. Deeper work is billed at a member rate per hour, or as a fixed-price engagement like an AI Automation Blueprint ($500). No automatic charges. No surprise scope. You approve cost before any work begins.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. The subscription is month-to-month. Cancel before your next billing date and you will not be charged again. The annual plan ($990) saves you two months.',
  },
  {
    q: 'How many questions can we ask?',
    a: 'The Advisor Desk is designed for a few focused questions as decisions come up rather than a fixed one-question quota. Brief guidance is included under reasonable use. If a request turns into substantive research, analysis, document review, architecture or implementation, I will identify that before doing additional work and offer a scoped option.',
  },
]

const capabilityStack = [
  {
    icon: TrendingUp,
    title: 'AI Intelligence Engine',
    description: 'I monitor developments across models, tools, research, security, regulation, and real-world adoption. You receive curated signals without having to track the landscape yourself.',
  },
  {
    icon: Shield,
    title: 'Governance Methodology',
    description: 'The AI Controls Review is grounded in a published governance methodology covering Enterprise, Project, Code, and UX domains. Applied in production AI deployments.',
  },
  {
    icon: Zap,
    title: 'Production AI Experience',
    description: 'Not a researcher. Not a blogger. I have architected and deployed production AI systems including voice agents, compliance platforms, and enterprise governance tools.',
  },
  {
    icon: Mail,
    title: 'Human Advisory Access',
    description: 'When an AI decision matters, bring it to the Desk. I review the context, pressure-test the options, and give you a practical point of view on what deserves action.',
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

export default function AIAdvisorPage() {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Hero
        subtitle="AI Advisor Desk"
        title={
          <>
            An AI advisor
            <br />
            <span className="gradient-text">in your corner.</span>
          </>
        }
        description="Stay focused on your organization while I keep watch on AI. I monitor new models, tools, research, security developments, regulation, and real-world adoption, then curate what deserves your attention and help you understand what it could mean for your organization. $99/month · Up to 3 team members · Human advisory access"
      >
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/contact?subject=ai-advisor-desk">
            <Button size="lg" className="group animate-glow">
              Start AI Advisor Desk
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/ai-automation">
            <Button size="lg" variant="outline">
              Need a one-time assessment? ($500)
            </Button>
          </Link>
        </div>
      </Hero>

      {/* Questions We Help Answer */}
      <Section
        subtitle="Questions We Help Answer"
        title="Your team has AI questions. You should not need a full-time AI specialist to answer them."
        sectionNum="01"
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {buyerQuestions.map((group, i) => (
              <Reveal key={i} delay={i * 60} style="up">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{i + 1}</span>
                      {group.category}
                    </CardTitle>
                    <ul className="mt-3 space-y-2">
                      {group.questions.map((q, j) => (
                        <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-0.5">&rarr;</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </CardHeader>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* Capability Stack */}
      <Section
        subtitle="Capability Stack"
        title="What the Desk brings to your team"
        description="Four capabilities working together: intelligence monitoring, governance methodology, production experience, and human advisory access."
        sectionNum="04"
        className="bg-secondary/20"
      >
        <Grid cols={2}>
          {capabilityStack.map((item, i) => {
            const Icon = item.icon
            return (
              <Reveal key={i} delay={i * 60} style="up">
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{item.title}</CardTitle>
                        <CardDescription className="text-sm mt-1">{item.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Reveal>
            )
          })}
        </Grid>
      </Section>

      {/* Business Situations */}
      <Section
        subtitle="Where better AI decisions create leverage"
        title="Common scenarios where the Desk earns its place"
        description="A $99/month subscription can save you from a costly mistake, a month of indecision, or a missed opportunity. Human advisory access means you can ask focused questions as decisions come up."
        sectionNum="02"
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Your team wants to adopt a new AI tool',
                desc: 'You need someone to review the vendor, check data handling, and help you understand the data, security, contractual, and operational considerations before adoption.',
              },
              {
                title: 'A customer or partner asks about your AI policy',
                desc: 'You need a defensible answer about how your team uses AI, what controls you have, and what you have reviewed.',
              },
              {
                title: 'A new AI regulation applies to your industry',
                desc: 'You need to know which rules apply to your business size, what documentation to maintain, and what to do now vs later.',
              },
              {
                title: 'You are evaluating AI for hiring or HR',
                desc: 'AI-assisted hiring raises bias and documentation questions. You need to know what to check and what records to keep.',
              },
              {
                title: 'Management asks what to do about AI',
                desc: 'You need a prioritized view of what deserves action, what can wait, and what to stop doing.',
              },
              {
                title: 'You want to automate a workflow but are not sure how',
                desc: 'Before spending on development, get a read on whether AI is the right approach and what the Blueprint would cover.',
              },
            ].map((situation, i) => (
              <Reveal key={i} delay={i * 60} style="up">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{i + 1}</span>
                      {situation.title}
                    </CardTitle>
                    <CardDescription className="text-sm mt-2">{situation.desc}</CardDescription>
                  </CardHeader>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* What You Get */}
      <Section
        subtitle="What You Receive"
        title="What is included for $99/month"
        description="One subscription. No hidden fees, no per-seat charges, no usage metering. Human advisory access included under reasonable use."
        sectionNum="03"
        className="bg-secondary/20"
      >
        <Grid cols={3}>
          {whatYouGet.map((item, i) => {
            const Icon = item.icon
            return (
              <Reveal key={i} delay={i * 60} style="up">
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">{item.title}</CardTitle>
                    <CardDescription className="text-sm mt-1">{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Reveal>
            )
          })}
        </Grid>
      </Section>

      {/* How Signals Become Value */}
      <Section
        subtitle="How Signals Become Value"
        title="See what is changing. Understand what it means. Discover what it could unlock. Decide what deserves action."
        sectionNum="05"
        className="bg-secondary/20"
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Eye, step: 'SEE', desc: 'Curated signals across models, tools, research, security, regulation, and real-world adoption.' },
              { icon: Brain, step: 'UNDERSTAND', desc: 'I interpret what each development means and why it matters for your context.' },
              { icon: Lightbulb, step: 'DISCOVER', desc: 'Surface possibilities and opportunities the signal could unlock for your organization.' },
              { icon: Compass, step: 'DECIDE', desc: 'When a decision deserves action, you already have an advisor who understands the context.' },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <Reveal key={i} delay={i * 80} style="up">
                  <Card className="h-full text-center">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 mx-auto">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-sm font-bold tracking-wide">{item.step}</CardTitle>
                      <CardDescription className="text-sm mt-2">{item.desc}</CardDescription>
                    </CardHeader>
                  </Card>
                </Reveal>
              )
            })}
          </div>
        </div>
      </Section>

      {/* Role-Based Intelligence */}
      <Section
        subtitle="Role-Based Intelligence"
        title="Same signal. Different decision."
        description="The same AI development can mean different things depending on who is asking. The Desk provides lenses for each role."
        sectionNum="06"
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Building2,
                role: 'Executive',
                question: 'What could this change for the business?',
                focus: ['Strategy', 'Competition', 'Investment', 'Customer impact', 'Timing', 'Material opportunity and risk'],
              },
              {
                icon: Users,
                role: 'Management',
                question: 'What could this change in the way we work?',
                focus: ['Workflow', 'People', 'Adoption', 'Operations', 'Policy', 'Execution and measurement'],
              },
              {
                icon: Shield,
                role: 'Technical',
                question: 'What should we evaluate or prepare for?',
                focus: ['Architecture', 'Models', 'Agents', 'RAG and data', 'Security', 'Integration and trade-offs'],
              },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <Reveal key={i} delay={i * 80} style="up">
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-base">{item.role}</CardTitle>
                      </div>
                      <p className="text-sm font-medium text-foreground mt-2">{item.question}</p>
                      <ul className="mt-3 space-y-1.5">
                        {item.focus.map((f, j) => (
                          <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-0.5">&rarr;</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </CardHeader>
                  </Card>
                </Reveal>
              )
            })}
          </div>
        </div>
      </Section>

      {/* Opportunity Discovery */}
      <Section
        subtitle="Opportunity Discovery"
        title="What could AI make possible?"
        description="Opportunity discovery is a core benefit of the Desk. These are the kinds of questions worth exploring together."
        sectionNum="07"
        className="bg-secondary/20"
      >
        <div className="max-w-3xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Where could AI give your team back time or capacity?',
              'What are customers waiting for that could happen faster?',
              'What information do you already have but struggle to use?',
              'What could become a better product, service, or new source of revenue?',
              'What could you build today that was not practical twelve months ago?',
              'Which AI investment deserves your budget — and which should wait?',
              'What should AI handle, and where should people remain in control?',
              'What would you test first before committing serious budget?',
            ].map((q, i) => (
              <Reveal key={i} delay={i * 40} style="up">
                <div className="flex items-start gap-3 rounded-lg border border-border p-4 bg-card">
                  <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">{q}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* The Advisor Relationship */}
      <Section
        subtitle="The Advisor Relationship"
        title="The more I understand your organization, the more useful the Desk becomes."
        sectionNum="08"
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {[
              {
                icon: TrendingUp,
                title: 'Weekly',
                desc: 'AI intelligence brief arrives in your inbox. Curated signals across models, tools, research, security, regulation, and real-world adoption.',
              },
              {
                icon: Shield,
                title: 'Monthly',
                desc: 'Controls review check-in. I review your current AI tools, vendor agreements, and internal practices. Gaps get flagged before they become incidents.',
              },
              {
                icon: Mail,
                title: 'On-Demand',
                desc: 'When a decision comes up, bring it to the Desk. Most focused questions receive a reviewed response within 72 hours.',
              },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <Reveal key={i} delay={i * 80} style="up">
                  <Card className="h-full">
                    <CardHeader>
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-base">{item.title}</CardTitle>
                      <CardDescription className="text-sm mt-1">{item.desc}</CardDescription>
                    </CardHeader>
                  </Card>
                </Reveal>
              )
            })}
          </div>
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardDescription className="text-base">
                Over time, I learn your existing tools, your risk tolerance, and your priorities.
                When a new AI vendor appears, I can flag whether it fits. When a regulation shifts,
                I can tell you if it applies. That continuity is the difference between an advisor
                and a search engine.
              </CardDescription>
            </CardHeader>
          </Card>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Generic AI advice starts from zero. The Desk does not have to. You remain in control
            of what context is shared, and it is always editable.
          </p>
        </div>
      </Section>

      {/* Why Trust This */}
      <Section
        subtitle="Why Trust This"
        title="Built on real AI governance work"
        sectionNum="09"
        className="bg-secondary/20"
      >
        <div className="max-w-4xl mx-auto space-y-4">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-lg">Published Governance Methodology</CardTitle>
              <CardDescription className="text-base">
                The AI Controls Review is grounded in a published AI governance methodology covering
                Enterprise, Project, Code, and UX domains. Applied in production AI deployments.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-lg">AI Intelligence Engine</CardTitle>
              <CardDescription className="text-base">
                I use an AI intelligence engine to monitor developments across models, tools, research,
                security, regulation, and real-world adoption. You receive curated signals without
                having to track the landscape yourself.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-lg">Production AI Experience</CardTitle>
              <CardDescription className="text-base">
                Not a researcher. Not a blogger. I have architected and deployed production AI systems
                including voice agents, compliance platforms, and enterprise governance tools. Every answer
                is grounded in real implementation experience.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      {/* Pricing */}
      <Section
        subtitle="Pricing"
        title="Simple, Transparent, Cancelable"
        sectionNum="10"
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-primary">
              <CardHeader>
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 mb-2 w-fit">
                  <span className="text-xs font-medium text-primary">Monthly</span>
                </div>
                <CardTitle className="text-2xl">$99<span className="text-base font-normal text-muted-foreground">/month</span></CardTitle>
                <CardDescription>Flexibility to cancel anytime</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {['Human advisory access (reasonable use)', 'Weekly AI intelligence brief', 'AI Controls Review', 'AI regulatory monitoring', 'Up to 3 team members', 'AI tools and vendor guidance', 'AI hiring and policy support'].map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/contact?subject=ai-advisor-desk-monthly" className="block mt-4">
                  <Button className="w-full">Start Monthly</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-primary">
              <CardHeader>
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 mb-2 w-fit">
                  <span className="text-xs font-medium text-primary">Best Value</span>
                </div>
                <CardTitle className="text-2xl">$990<span className="text-base font-normal text-muted-foreground">/year</span></CardTitle>
                <CardDescription>Save 2 months. Annual billing.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {['Everything in Monthly', '2 months free', 'Priority response queue', 'Annual AI Controls Review report', 'Quarterly trend briefing', 'Up to 3 team members'].map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/contact?subject=ai-advisor-desk-annual" className="block mt-4">
                  <Button className="w-full">Start Annual</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
          <p className="text-sm text-muted-foreground mt-6 text-center max-w-2xl mx-auto">
            When a question turns into deeper work, members receive priority scheduling and a member rate on hourly engagements. Fixed-price engagements like Automation Blueprints ($500) and security reviews remain at their published prices. You approve scope and cost before any additional work begins.
          </p>
        </div>
      </Section>

      {/* Boundaries & FAQ */}
      <Section
        subtitle="Boundaries & FAQ"
        title="What This Is Not — and Common Questions"
        sectionNum="11"
        className="bg-secondary/20"
      >
        <div className="max-w-3xl mx-auto">
          <div className="space-y-3">
            {boundaries.map((b, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">{i + 1}</span>
                <p className="text-sm text-muted-foreground">{b}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/advisory">
              <Button variant="outline" size="sm">Full Advisory Engagements <ArrowRight className="ml-2 h-3 w-3" /></Button>
            </Link>
            <Link href="/ai-automation">
              <Button variant="outline" size="sm">AI Automation Blueprint ($500) <ArrowRight className="ml-2 h-3 w-3" /></Button>
            </Link>
            <Link href="/ai-security-compliance">
              <Button variant="outline" size="sm">AI Security & Compliance Review <ArrowRight className="ml-2 h-3 w-3" /></Button>
            </Link>
          </div>

          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Common Questions</h3>
            {faqs.map((faq, i) => (
              <Reveal key={i} delay={i * 40} style="up">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{faq.q}</CardTitle>
                    <CardDescription className="text-sm mt-2">{faq.a}</CardDescription>
                  </CardHeader>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <AdvisorCheckoutCTA
        title="Get a specialist in your corner."
        description="$99/month. Human advisory access, curated intelligence, opportunity discovery, and a clear next step when deeper work is needed. Cancel anytime."
      />
    </>
  )
}
