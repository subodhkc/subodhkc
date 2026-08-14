import Link from 'next/link'
import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import Grid from '@/components/Grid'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import {
  Phone,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle2,
  Building2,
  Stethoscope,
  Calendar,
  Clock,
  Globe,
} from 'lucide-react'

export const metadata = {
  title: 'AI Voice Agent for Small Business | AI Receptionist Dallas–Fort Worth',
  description:
    'Turn more incoming calls into completed customer actions. Managed AI voice deployment from $499/month. Standard and custom workflows. Dallas–Fort Worth based.',
  alternates: {
    canonical: 'https://subodhkc.com/ai-voice-agent',
  },
  openGraph: {
    title: 'AI Voice Agent for Small Business | AI Receptionist Dallas–Fort Worth',
    description:
      'Turn more incoming calls into completed customer actions. Managed AI voice deployment from $499/month. Standard and custom workflows.',
    url: 'https://subodhkc.com/ai-voice-agent',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Voice Agent for Small Business | AI Receptionist Dallas–Fort Worth',
    description: 'Managed AI voice deployment from $499/month. Standard and custom workflows. Dallas–Fort Worth based.',
  },
  keywords: [
    'AI voice agent',
    'AI receptionist',
    'AI phone answering',
    'AI appointment booking',
    'AI voice agent for small business',
    'AI receptionist Dallas',
    'AI receptionist DFW',
    'AI call automation',
    'voice AI solutions',
    'Subodh KC',
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'AI Voice Agent Deployment', item: 'https://subodhkc.com/ai-voice-agent' },
  ],
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'AI Voice Agent Deployment',
  description: 'Managed AI voice agent deployment for small business. Standard and custom workflows. From $499/month. Dallas–Fort Worth based.',
  url: 'https://subodhkc.com/ai-voice-agent',
  provider: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
  serviceType: 'AI Voice Agent Deployment',
  areaServed: 'Global',
}

const voiceQuestions = [
  'Which calls should AI handle?',
  'Which calls should reach a person?',
  'What questions should it answer?',
  'What information should it collect?',
  'Should it qualify callers?',
  'Are there urgency rules?',
  'Are there geographic or service-area rules?',
  'Does it need appointment or calendar access?',
  'Does it need CRM access?',
  'Does it need dispatch or work-order integration?',
  'What business rules exist?',
  'What happens after hours?',
  'How does human escalation work?',
  'What happens when AI is uncertain?',
  'What happens if an integration is unavailable?',
  'What customer data is retained?',
  'What notices, privacy and security considerations apply?',
  'What outcome will define success?',
  'Does the business need standard deployment or custom workflow engineering?',
]

const standardFeatures = [
  'Simple answering and call routing',
  'FAQ responses from your knowledge base',
  'Appointment booking and calendar integration',
  'Appropriate human handoff for complex calls',
  'After-hours coverage',
  'Call logging and basic analytics',
]

const customFeatures = [
  'Custom caller qualification workflows',
  'CRM actions and record updates',
  'Dispatch and work-order integration',
  'Multi-system workflow automation',
  'Business-rule automation (urgency, service area, routing)',
  'Multiple locations',
  'Custom escalation and approval flows',
]

const capabilities = [
  { icon: Zap, title: 'Instant Response', description: 'Zero rings. Every call answered immediately, no hold music, no waiting queue.' },
  { icon: Calendar, title: 'Smart Scheduling', description: 'Books, reschedules, and cancels appointments directly in your calendar system.' },
  { icon: Shield, title: 'Emergency Detection', description: 'Identifies urgent calls and escalates to human staff with context and priority.' },
  { icon: Clock, title: '24/7 Availability', description: 'After-hours, weekends, holidays. Your business never stops answering the phone.' },
  { icon: Globe, title: 'Multi-Language', description: 'Handles calls in multiple languages with natural conversation flow.' },
  { icon: Building2, title: 'CRM Integration', description: 'Logs every call, updates records, and triggers workflows in your existing tools.' },
]

const deploymentSteps = [
  { step: '1', title: 'Fit Call (20–30 min)', description: 'A short call to understand your call patterns, business rules, and integration needs. The purpose is to determine whether you need standard deployment or a custom workflow. Standard is sufficient for most businesses.' },
  { step: '2', title: 'Standard or Custom Scoping', description: 'Based on the fit call, we recommend the right path. Standard deployment covers answering, FAQ, routing, and booking. Custom covers CRM actions, dispatch, multi-system workflows, and business-rule automation.' },
  { step: '3', title: 'Build & Configure', description: 'We configure the voice platform for your business: custom prompts, knowledge base, tool connections, scheduling logic, and escalation rules.' },
  { step: '4', title: 'Security Hardening', description: 'Prompt injection defenses, PII handling, call recording policies, and compliance alignment for your industry.' },
  { step: '5', title: 'Testing & Deployment', description: 'Adversarial testing of conversation flows, edge cases, and failure modes. Go-live with monitoring and operational handoff.' },
]

const industries = [
  { icon: Stethoscope, name: 'Healthcare', description: 'Appointment scheduling, prescription refill requests, insurance verification, and HIPAA-compliant call handling.' },
  { icon: Building2, name: 'Professional Services', description: 'Client intake, consultation scheduling, matter routing, and after-hours coverage for law firms, accounting, and consulting.' },
  { icon: Phone, name: 'Field Services', description: 'Dispatch coordination, appointment confirmation, emergency triage, and customer status updates for HVAC, plumbing, and electrical.' },
]

export default function AIVoiceAgentPage() {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <Hero
        subtitle="AI Voice Agent"
        title={
          <>
            Turn more incoming calls
            <br />
            <span className="gradient-text">into completed customer actions.</span>
          </>
        }
        description="Managed AI voice deployment from $499/month. Standard answering, FAQ, routing, and booking. Custom workflows for CRM, dispatch, and multi-system integration. Dallas–Fort Worth based."
      >
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/contact?subject=ai-voice-agent-fit-call">
            <Button size="lg" className="group animate-glow">
              Book a Fit Call
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/ai-automation">
            <Button size="lg" variant="outline">
              Need a workflow analysis? ($500)
            </Button>
          </Link>
        </div>
      </Hero>

      {/* What the Deployment Answers */}
      <Section
        subtitle="What the Deployment Answers"
        title="The right voice deployment starts with the right questions."
        sectionNum="§01"
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-3">
            {voiceQuestions.map((q, i) => (
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

      {/* Standard vs Custom Routing */}
      <Section
        subtitle="Standard or Custom?"
        title="Two paths. One fit call determines which."
        sectionNum="§02"
        className="bg-secondary/20"
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-primary">
              <CardHeader>
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 mb-2 w-fit">
                  <span className="text-xs font-medium text-primary">Standard</span>
                </div>
                <CardTitle className="text-xl">Standard Deployment</CardTitle>
                <CardDescription className="text-base mt-1">from $499/month</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {standardFeatures.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground mt-4">
                  Sufficient for most small businesses. The fit call may conclude standard is all you need.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="inline-flex items-center rounded-full border border-muted-foreground/20 bg-muted-foreground/10 px-3 py-1 mb-2 w-fit">
                  <span className="text-xs font-medium text-muted-foreground">Custom</span>
                </div>
                <CardTitle className="text-xl">Custom Workflow</CardTitle>
                <CardDescription className="text-base mt-1">requires Blueprint + SOW</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {customFeatures.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground mt-4">
                  Starts with a $500 AI Automation Blueprint to map the workflow, followed by a fixed SOW.
                  Custom workflow engineering may start around $1,500.
                </p>
                <Link href="/ai-automation" className="block mt-3">
                  <Button variant="outline" size="sm">Start with a Blueprint <ArrowRight className="ml-2 h-3 w-3" /></Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* Deployment Process */}
      <Section
        subtitle="How It Works"
        title="From fit call to go-live"
        sectionNum="§03"
      >
        <div className="max-w-3xl mx-auto">
          <div className="space-y-3">
            {deploymentSteps.map((phase) => (
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

      {/* Industries */}
      <Section
        subtitle="Industries"
        title="Deployed where it matters"
        sectionNum="§04"
        className="bg-secondary/20"
      >
        <Grid cols={3}>
          {industries.map((industry, i) => {
            const Icon = industry.icon
            return (
              <Reveal key={i} delay={i * 60} style="up">
                <Card className="h-full">
                  <CardHeader>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">{industry.name}</CardTitle>
                    <CardDescription className="text-sm mt-1">{industry.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Reveal>
            )
          })}
        </Grid>
      </Section>

      {/* Trust */}
      <Section
        subtitle="Why Trust This"
        title="Production voice platform, not a demo"
        sectionNum="§05"
      >
        <div className="max-w-4xl mx-auto space-y-4">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-lg">Production voice platform</CardTitle>
              <CardDescription className="text-base">
                A production AI voice receptionist platform with custom Python orchestration,
                realtime AI, RAG, business tool integrations, fallback modes, and operational analytics.
                Not a demo. Not a prototype. A deployed system handling real calls.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-lg">Security and compliance built in</CardTitle>
              <CardDescription className="text-base">
                Prompt injection defenses, PII handling, call recording policies, and compliance
                alignment for your industry. Security is not an add-on.
              </CardDescription>
            </CardHeader>
          </Card>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/ai-security-compliance">
              <Button variant="outline" size="sm">Security & Compliance Review <ArrowRight className="ml-2 h-3 w-3" /></Button>
            </Link>
            <Link href="/ai-automation">
              <Button variant="outline" size="sm">AI Automation Blueprint <ArrowRight className="ml-2 h-3 w-3" /></Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" size="sm">All Services <ArrowRight className="ml-2 h-3 w-3" /></Button>
            </Link>
          </div>
        </div>
      </Section>

      <CTA
        title="Book a 20-minute fit call"
        description="Find out whether standard deployment is sufficient or whether you need a custom workflow. The fit call builds buyer confidence, not scope."
        primaryButton={{ text: 'Check My Fit', href: '/contact?subject=ai-voice-agent-fit-call' }}
        secondaryButton={{ text: 'Book a 20-Minute Fit Call', href: '/contact?subject=ai-voice-agent-fit-call' }}
      />
    </>
  )
}
