import Link from 'next/link'
import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import Grid from '@/components/Grid'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import {
  Workflow,
  Search,
  FileText,
  CheckCircle2,
  ArrowRight,
  DollarSign,
  Zap,
  ClipboardCheck,
  Code,
  FlaskConical,
  ShieldCheck,
} from 'lucide-react'
import { BlueprintQualificationCTA } from '@/components/commercial/BlueprintQualificationCTA'

export const metadata = {
  title: 'AI Work Order | $500 Scoped AI Work | Subodh KC',
  description:
    'An AI Work Order is a bounded piece of work with one defined outcome. $500 standard scoped work order. It might be one workflow, one research question, one architecture decision, one implementation slice, or another focused unit of work. Available through the AI Advisor relationship.',
  alternates: {
    canonical: 'https://subodhkc.com/ai-automation',
  },
  openGraph: {
    title: 'AI Work Order | $500 Scoped AI Work | Subodh KC',
    description:
      'One defined outcome. Scoped before work begins. $500 standard scoped work order. Available through the AI Advisor relationship.',
    url: 'https://subodhkc.com/ai-automation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Work Order | $500 Scoped AI Work',
    description: 'One defined outcome. Scoped before work begins. $500 standard work order.',
  },
  keywords: [
    'AI work order',
    'AI opportunity assessment',
    'AI workflow assessment',
    'AI workflow analysis',
    'AI automation strategy',
    'should I automate this workflow',
    'build vs buy AI',
    'configure vs connect',
    'AI automation roadmap',
    'AI feasibility',
    'AI vendor evaluation',
    'AI architecture decision',
    'scoped AI work',
    'Subodh KC',
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'AI Work Order', item: 'https://subodhkc.com/ai-automation' },
  ],
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'AI Work Order',
  description: 'A standard scoped unit of AI work with one defined outcome. $500. May include workflow analysis, design, research, architecture decision, vendor evaluation, bounded implementation, or another focused deliverable. Available through the AI Advisor relationship.',
  url: 'https://subodhkc.com/ai-automation',
  provider: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
  serviceType: 'AI Work Order',
  areaServed: 'Global',
  offers: {
    '@type': 'Offer',
    price: '500',
    priceCurrency: 'USD',
  },
}

const workOrderExamples = [
  { icon: Workflow, title: 'Workflow', description: 'Map, analyze, or improve one intake or operational workflow.' },
  { icon: Code, title: 'Build', description: 'Implement one bounded AI-assisted workflow or component.' },
  { icon: Search, title: 'Research', description: 'Investigate one technical or business question and return findings.' },
  { icon: ClipboardCheck, title: 'Architecture', description: 'Design one bounded architecture decision or integration slice.' },
  { icon: ShieldCheck, title: 'Vendor', description: 'Evaluate a defined vendor or tool decision.' },
  { icon: FlaskConical, title: 'Evaluation', description: 'Create or test one bounded evaluation, control, or proof of concept.' },
]

const decisionQuestions = [
  'What are we trying to improve?',
  'Should AI be involved?',
  'Should we build, buy, configure, connect, simplify, wait, or stop?',
  'What should remain human?',
  'What does the architecture require?',
  'What are the dependencies and failure modes?',
  'What is worth doing next?',
]

const fullQuestions = [
  'What business outcome are we actually trying to improve?',
  'What exactly are we automating or investigating?',
  'Is AI appropriate for this workflow?',
  'How does the process work today?',
  'Where does manual effort, delay, friction or opportunity exist?',
  'What should remain human?',
  'What should be automated?',
  'Can existing software handle this instead of custom development?',
  'What systems are involved?',
  'What integrations already exist?',
  'What integrations would be required?',
  'What event starts the workflow?',
  'What information enters the workflow?',
  'What should the system produce or change?',
  'What business rules must remain intact?',
  'What exceptions occur?',
  'Who must approve or intervene?',
  'What happens when AI is uncertain?',
  'What happens when AI is unavailable?',
  'What is the human fallback?',
  'What data does AI need to process?',
  'What sensitive information is involved?',
  'What security, privacy or compliance questions deserve review?',
  'What external dependencies exist?',
  'What assumptions are we making?',
  'How will success be measured?',
  'What should a pilot demonstrate?',
  'Should we buy, configure, automate, custom build, or keep the current process?',
  'What is the realistic implementation cost range?',
  'What should happen first?',
]

const startingPoints = [
  'Customer onboarding or intake',
  'Manual data entry or reconciliation',
  'Document review or classification',
  'Scheduling or dispatch',
  'Report generation',
  'Quality checks or compliance review',
  'Invoice or order processing',
  'Email or call triage',
]

const validOutcomes = ['Build', 'Buy', 'Configure', 'Integrate', 'Automate', 'Simplify', 'Wait', 'Keep current', 'Do not use AI']

export default function AIAutomationPage() {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <Hero
        subtitle="AI Work Order · $500 standard scoped work order"
        title={
          <>
            One defined outcome.
            <br />
            <span className="gradient-text">Scoped before work begins.</span>
          </>
        }
        description="An AI Work Order is a bounded piece of work with a defined outcome. It might be one workflow, one research question, one architecture decision, one implementation slice, or another focused unit of work. The scope is agreed before work begins. If the work is larger, I will tell you before it starts. $500 standard work order. Available through the AI Advisor relationship."
      >
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="#start">
            <Button size="lg" className="group animate-glow">
              Start My Work Order
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/ai-advisor">
            <Button size="lg" variant="outline">
              Join AI Advisor Desk ($99/mo)
            </Button>
          </Link>
        </div>
      </Hero>

      {/* What fits */}
      <Section
        subtitle="What Fits"
        title="What can fit into an AI Work Order?"
        sectionNum="00"
        className="bg-secondary/20"
      >
        <div className="max-w-5xl mx-auto">
          <p className="text-base text-muted-foreground mb-6">
            A Work Order is flexible. It is not narrowly a review, an assessment, or implementation.
            It is a standard bounded unit of work. The actual output depends on agreed scope.
          </p>
          <Grid cols={3}>
            {workOrderExamples.map((item, i) => {
              const Icon = item.icon
              return (
                <Reveal key={i} delay={i * 60} style="up">
                  <Card className="h-full">
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
          <p className="text-sm text-muted-foreground mt-6 text-center">
            These are examples, not an exhaustive list. A larger project may require multiple Work Orders or a custom scoped engagement.
          </p>
        </div>
      </Section>

      {/* Valid Outcomes */}
      <Section
        subtitle="Valid Outcomes"
        title="The honest answer might not be build."
        sectionNum="01"
      >
        <div className="max-w-4xl mx-auto">
          <p className="text-base text-muted-foreground mb-6">
            A Work Order can end in any of these recommendations. All of them are valid outcomes.
            The answer is allowed to be no.
          </p>
          <div className="flex flex-wrap gap-3">
            {validOutcomes.map((outcome, i) => (
              <span key={i} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {outcome}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* Starting Points */}
      <Section
        subtitle="Starting Points"
        title="Common workflows worth investigating."
        sectionNum="02"
        className="bg-secondary/20"
      >
        <div className="max-w-4xl mx-auto">
          <p className="text-base text-muted-foreground mb-6">
            Not sure if your workflow is a good fit? These are common starting points. If yours is not on the list, describe it in the intake. For a broader framework on how to identify where AI actually belongs in your business, read <Link href="/blog/where-should-company-use-ai" className="text-primary font-medium hover:underline">where should our company actually use AI</Link>.
          </p>
          <div className="flex flex-wrap gap-3">
            {startingPoints.map((s, i) => (
              <span key={i} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {s}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* Decision Methodology */}
      <Section
        subtitle="Decision Methodology"
        title="Seven questions. One clear path."
        sectionNum="03"
        className="bg-secondary/20"
      >
        <div className="max-w-4xl mx-auto">
          <p className="text-base text-muted-foreground mb-6">
            When the Work Order involves a workflow or build decision, these questions shape the analysis.
            Not every Work Order uses all of them. The scope determines which apply.
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            {decisionQuestions.map((q, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-3">
                <span className="text-primary mt-0.5 flex-shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                <span className="text-sm text-foreground">{q}</span>
              </div>
            ))}
          </div>
          <details className="mt-6">
            <summary className="cursor-pointer text-sm font-medium text-primary hover:underline">
              See the full set of 30+ questions used for workflow assessments
            </summary>
            <div className="grid md:grid-cols-2 gap-3 mt-4">
              {fullQuestions.map((q, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <span className="text-primary mt-0.5 flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <span className="text-sm text-foreground">{q}</span>
                </div>
              ))}
            </div>
          </details>
        </div>
      </Section>

      {/* Scope */}
      <Section
        subtitle="Scope"
        title="How scope works."
        sectionNum="04"
      >
        <div className="max-w-3xl mx-auto space-y-4">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-lg">One Work Order, one defined outcome</CardTitle>
              <CardDescription className="text-base">
                A standard Work Order covers one bounded piece of work. The scope is agreed before work begins.
                You know what is included, what is excluded, and what the intended deliverable is.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-lg">If the work is larger</CardTitle>
              <CardDescription className="text-base">
                If your request looks larger than one standard Work Order, I will tell you before it starts.
                We can break it into additional Work Orders or scope a larger engagement.
                No surprise change orders.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-lg">The deliverable depends on scope</CardTitle>
              <CardDescription className="text-base">
                A Work Order may produce analysis, research, a design, a recommendation, a configuration,
                a bounded implementation, or another scoped deliverable. The output matches the agreed scope,
                not a fixed template.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      {/* Trust */}
      <Section
        subtitle="Why Trust This"
        title="Independent recommendations. Real implementation experience."
        sectionNum="05"
        className="bg-secondary/20"
      >
        <div className="max-w-4xl mx-auto space-y-4">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-lg">The best solution is sometimes simpler than a custom build</CardTitle>
              <CardDescription className="text-base">
                If existing software, a standard deployment, or another appropriate tool can solve the problem
                efficiently, the Work Order recommends that path. Independence of recommendation is an advantage,
                not a limitation.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-lg">Real implementation, not slides</CardTitle>
              <CardDescription className="text-base">
                I have built production AI automations including voice agents that handle live calls,
                compliance platforms that process evidence pipelines, and content systems that generate
                and publish autonomously. The Work Order methodology comes from real implementations.
              </CardDescription>
            </CardHeader>
          </Card>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/ai-voice-agent">
              <Button variant="outline" size="sm">AI Voice Agent <ArrowRight className="ml-2 h-3 w-3" /></Button>
            </Link>
            <Link href="/ai-security-compliance">
              <Button variant="outline" size="sm">Security & Compliance Review <ArrowRight className="ml-2 h-3 w-3" /></Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" size="sm">All Services <ArrowRight className="ml-2 h-3 w-3" /></Button>
            </Link>
          </div>
        </div>
      </Section>

      <div id="start">
        <BlueprintQualificationCTA
          title="Start your AI Work Order."
          description="Describe what you need. You will see scope and membership options before payment. If you are already an AI Advisor member, you can continue to checkout. If not, you can join the AI Advisor Desk to commission this Work Order."
        />
      </div>
    </>
  )
}
