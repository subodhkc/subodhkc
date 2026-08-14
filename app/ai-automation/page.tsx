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
} from 'lucide-react'
import { BlueprintQualificationCTA } from '@/components/commercial/BlueprintQualificationCTA'

export const metadata = {
  title: 'AI Automation Consultant for Small Business | Dallas–Fort Worth',
  description:
    '$500 AI Automation Blueprint. A fixed-scope assessment of one business workflow with automation recommendations, implementation roadmap, and buy/configure/build recommendation.',
  alternates: {
    canonical: 'https://subodhkc.com/ai-automation',
  },
  openGraph: {
    title: 'AI Automation Consultant for Small Business | Dallas–Fort Worth',
    description:
      '$500 AI Automation Blueprint. A fixed-scope assessment of one business workflow with automation recommendations, implementation roadmap, and buy/configure/build recommendation.',
    url: 'https://subodhkc.com/ai-automation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Automation Consultant for Small Business | Dallas–Fort Worth',
    description: '$500 fixed-scope AI Automation Blueprint. One workflow analyzed, one roadmap delivered.',
  },
  keywords: [
    'AI automation consultant',
    'AI automation for small business',
    'business process automation',
    'AI workflow automation',
    'AI automation services',
    'AI automation blueprint',
    'AI workflow analysis',
    'AI automation strategy',
    'AI process optimization',
    'Subodh KC',
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'AI Automation Blueprint', item: 'https://subodhkc.com/ai-automation' },
  ],
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'AI Automation Blueprint',
  description: 'Fixed-scope $500 assessment of one business workflow with AI automation recommendations, implementation roadmap, and buy/configure/build recommendation.',
  url: 'https://subodhkc.com/ai-automation',
  provider: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
  serviceType: 'AI Automation Assessment',
  areaServed: 'Global',
  offers: {
    '@type': 'Offer',
    price: '500',
    priceCurrency: 'USD',
  },
}

const blueprintQuestions = [
  'What business outcome are we actually trying to improve?',
  'What exactly are we automating?',
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
  'What happens when another integration is unavailable?',
  'What is the human fallback?',
  'What data does AI need to process?',
  'What sensitive information is involved?',
  'What security, privacy or compliance questions deserve review?',
  'What external dependencies exist?',
  'What assumptions are we making?',
  'How will success be measured?',
  'Do baseline data exist?',
  'What should a pilot demonstrate?',
  'Should we buy, configure, automate, custom build, or keep the current process?',
  'What is the realistic implementation cost range?',
  'What should happen first?',
]

const deliverables = [
  {
    icon: Search,
    title: 'Current Workflow Map',
    description: 'A detailed breakdown of your current workflow: inputs, outputs, bottlenecks, human decision points, and automation opportunities.',
  },
  {
    icon: ClipboardCheck,
    title: 'Buy / Configure / Build Recommendation',
    description: 'A clear recommendation: should you buy existing software, configure a standard deployment, automate with AI, custom build, or keep the current process? The best solution is sometimes simpler than a custom build.',
  },
  {
    icon: Workflow,
    title: 'Recommended Future Workflow',
    description: 'A step-by-step automation design showing how AI fits into your workflow. Includes human vs automation responsibilities, data flow, and fallback procedures.',
  },
  {
    icon: FileText,
    title: 'Implementation Roadmap',
    description: 'A phased implementation plan with estimated timelines, costs, and resource requirements. You will know exactly what to build first, what to test, and when to deploy.',
  },
  {
    icon: DollarSign,
    title: 'Cost-Benefit Analysis',
    description: 'Where measurable: hours, dollars, error rates. Includes a break-even calculation and implementation cost range. We do not promise savings where measurement is not available.',
  },
  {
    icon: Zap,
    title: 'Failure / Fallback Design',
    description: 'What happens when AI is uncertain, unavailable, or when an integration fails. Human fallback design, business-rule exceptions, and security considerations.',
  },
]

const process = [
  { step: '1', title: 'Submit Your Workflow', description: 'After starting, you receive a structured intake form. Describe the workflow you want automated: what it does, who runs it, how often, and what tools you currently use.' },
  { step: '2', title: 'Analysis Call (45 min)', description: 'A 45-minute call to walk through your workflow in detail, ask clarifying questions, and understand constraints. Recorded for reference.' },
  { step: '3', title: 'Blueprint Delivery (5 business days)', description: 'You receive a written Blueprint document with all deliverables. Includes a review and walkthrough call to discuss findings and answer questions.' },
  { step: '4', title: 'Optional Implementation', description: 'If you want help implementing the Blueprint, we can scope a separate engagement. The Blueprint is yours to keep and implement independently.' },
]

const boundaries = [
  'This covers one workflow. If you need multiple workflows analyzed, contact us for custom scoping.',
  'This is an assessment and roadmap, not implementation. Building the automation is a separate engagement.',
  'The 45-minute call and 5-business-day turnaround assume you submit the intake form within 3 business days of payment.',
  'No refunds after the analysis call has been conducted, as the work is performed.',
]

export default function AIAutomationPage() {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <Hero
        subtitle="AI Automation Blueprint"
        title={
          <>
            Find the right AI automation
            <br />
            <span className="gradient-text">before you pay to build it.</span>
          </>
        }
        description="$500 fixed. One workflow analyzed. A complete Blueprint with buy/configure/build recommendation, architecture, cost-benefit, and implementation roadmap. Delivered in 5 business days."
      >
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/contact?subject=ai-automation-blueprint">
            <Button size="lg" className="group animate-glow">
              Start My Blueprint
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/ai-advisor">
            <Button size="lg" variant="outline">
              Prefer ongoing guidance? ($99/mo)
            </Button>
          </Link>
        </div>
      </Hero>

      {/* What Your Blueprint Answers */}
      <Section
        subtitle="What Your Blueprint Answers"
        title="Clarity before implementation."
        sectionNum="§01"
      >
        <div className="max-w-4xl mx-auto">
          <p className="text-base text-muted-foreground mb-6">
            The Blueprint reduces uncertainty. It does not sell a meeting, a generic assessment, or consulting hours.
            It sells a clear answer: should you automate this, and if so, how?
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            {blueprintQuestions.map((q, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-3">
                <span className="text-primary mt-0.5 flex-shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                <span className="text-sm text-foreground">{q}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* What You Get */}
      <Section
        subtitle="Your Deliverable"
        title="A written Blueprint you can act on."
        description="You receive a written document with everything you need to automate your workflow or hand it to your team for implementation."
        sectionNum="§02"
        className="bg-secondary/20"
      >
        <Grid cols={3}>
          {deliverables.map((item, i) => {
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

      {/* Process */}
      <Section
        subtitle="How It Works"
        title="Four Steps. Five Business Days."
        sectionNum="§03"
      >
        <div className="max-w-3xl mx-auto">
          <div className="space-y-3">
            {process.map((phase) => (
              <div key={phase.step} className="flex items-start gap-4 rounded-lg border border-border p-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">{phase.step}</span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{phase.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{phase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Trust */}
      <Section
        subtitle="Why Trust This"
        title="Independent recommendations. Real implementation experience."
        sectionNum="§04"
        className="bg-secondary/20"
      >
        <div className="max-w-4xl mx-auto space-y-4">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-lg">The best solution is sometimes simpler than a custom build</CardTitle>
              <CardDescription className="text-base">
                If existing software, a standard deployment, or another appropriate tool can solve the problem
                efficiently, the Blueprint recommends that path. Independence of recommendation is an advantage,
                not a limitation.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-lg">Real automation, not slides</CardTitle>
              <CardDescription className="text-base">
                I have built production AI automations including voice agents that handle live calls,
                compliance platforms that process evidence pipelines, and content systems that generate
                and publish autonomously. The Blueprint methodology comes from real implementations.
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

      {/* Boundary */}
      <Section
        subtitle="Boundaries"
        title="What This Is Not"
        sectionNum="§05"
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
        </div>
      </Section>

      <BlueprintQualificationCTA
        title="One workflow. One Blueprint. $500."
        description="Stop wondering if AI can automate your workflow. Get a specific, actionable Blueprint with a buy/configure/build recommendation, architecture, and implementation roadmap."
      />
    </>
  )
}
