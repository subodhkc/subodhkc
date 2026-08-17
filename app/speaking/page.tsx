import Hero from '@/components/Hero'
import Section from '@/components/Section'
import Grid from '@/components/Grid'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import CTA from '@/components/CTA'
import { Mic, Users, Briefcase, GraduationCap, Compass, Shield, CheckCircle2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Speaking | AI Decisions, Systems & Program Leadership | Subodh KC',
  description:
    'Book Subodh KC for keynotes, workshops, and technical talks on AI decisions, production AI systems, governance, enterprise program leadership, and Cognitive Systems Management.',
  keywords: [
    'AI keynote speaker',
    'AI decisions speaker',
    'AI architecture speaker',
    'enterprise AI speaker',
    'AI governance speaker',
    'AI workshop',
    'AI strategy speaker',
    'AI systems architect',
    'technical program leadership',
    'Cognitive Systems Management',
    'Subodh KC',
  ],
  alternates: {
    canonical: 'https://subodhkc.com/speaking',
  },
  openGraph: {
    title: 'Speaking | Subodh KC',
    description: 'Keynotes, workshops, and technical talks on AI decisions, production systems, governance, and program leadership at scale.',
    url: 'https://subodhkc.com/speaking',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Speaking | Subodh KC',
    description: 'Keynotes and workshops on AI decisions, systems, and program leadership.',
  },
}

export default function SpeakingPage() {
  const topics = [
    {
      icon: Compass,
      title: 'From Possibility to Decision',
      description:
        'How to move from the excitement of AI possibilities to the decisions that actually deserve action. A framework for filtering signal from noise when everything seems possible.',
      audience: 'C-suite, boards, executive teams',
      format: 'Keynote (45-60 min)',
      keyTakeaways: [
        'A decision filter for AI opportunities',
        'When to say no to a pilot',
        'The cost of reversible vs irreversible AI decisions',
        'Building organizational muscle for AI judgment',
      ],
    },
    {
      icon: Briefcase,
      title: 'AI Decisions That Are Expensive to Reverse',
      description:
        'Some AI decisions can be undone cheaply. Others create lock-in, compliance exposure, or operational dependency that is expensive to unwind. How to tell the difference before you commit.',
      audience: 'Executives, technology leaders, risk officers',
      format: 'Keynote (45-60 min) or Workshop (2-3 hours)',
      keyTakeaways: [
        'Reversibility as a decision criterion',
        'Architecture choices that create lock-in',
        'Governance decisions that are hard to undo',
        'Vendor and model dependency analysis',
      ],
    },
    {
      icon: Users,
      title: 'Why AI Pilots Fail in Production',
      description:
        'Systematic analysis of the architectural, organizational, and strategic failures that turn AI initiatives into expensive experiments that never reach production.',
      audience: 'Technical leaders, architects, program managers',
      format: 'Keynote (45-60 min) or Technical Deep-Dive (90 min)',
      keyTakeaways: [
        'The failure patterns in enterprise AI',
        'What production-grade AI actually requires',
        'Organizational anti-patterns that kill pilots',
        'Decision frameworks for AI at scale',
      ],
    },
    {
      icon: Shield,
      title: 'The Architecture Behind Responsible AI',
      description:
        'Responsible AI is not a policy document. It is an architecture. How governance, evidence, controls, and oversight show up in the actual system design.',
      audience: 'Architects, security teams, governance leaders',
      format: 'Technical Deep-Dive (90 min) or Workshop (half-day)',
      keyTakeaways: [
        'Governance as architecture, not paperwork',
        'Evidence and auditability in system design',
        'Controls that survive production pressure',
        'Cognitive Systems Management in practice',
      ],
    },
    {
      icon: GraduationCap,
      title: 'Cognitive Systems Management',
      description:
        'A four-domain governance methodology connecting Enterprise, Project, Code and UX so that governance handoffs remain visible across the AI lifecycle.',
      audience: 'Program managers, AI teams, governance leaders',
      format: 'Workshop (half-day or full-day)',
      keyTakeaways: [
        'Four CSM domains: Enterprise, Project, Code, UX',
        'Six execution functions across the lifecycle',
        'Connecting governance across organizational handoffs',
        'Translating CSM into an operating model',
      ],
    },
    {
      icon: Mic,
      title: 'Technical Program Leadership at Scale',
      description:
        'Lessons from driving complex, multi-stakeholder programs across Fortune 50 environments. What separates execution from activity.',
      audience: 'TPMs, engineering leaders, project managers',
      format: 'Keynote (45-60 min) or Fireside Chat (30-45 min)',
      keyTakeaways: [
        'Stakeholder alignment at scale',
        'Managing dependencies across organizations',
        'Measuring impact vs activity',
        'Portfolio governance across many applications',
      ],
    },
  ]

  const formats = [
    {
      type: 'Keynote',
      duration: '45-60 minutes',
      description: 'Strategic presentations for conferences, corporate events, and summits.',
      idealFor: 'Large audiences (100+), opening/closing sessions',
    },
    {
      type: 'Workshop',
      duration: 'Half-day or Full-day',
      description: 'Interactive, hands-on sessions with frameworks and practical application.',
      idealFor: 'Teams and leadership groups (20-50 people)',
    },
    {
      type: 'Fireside Chat',
      duration: '30-45 minutes',
      description: 'Conversational format with Q&A, exploring topics in depth.',
      idealFor: 'Intimate settings, executive roundtables',
    },
    {
      type: 'Panel Moderator',
      duration: '45-60 minutes',
      description: 'Facilitated discussions with industry experts on AI strategy and governance.',
      idealFor: 'Multi-perspective discussions, industry events',
    },
  ]

  const audiences = [
    {
      type: 'Conferences & Summits',
      description: 'Industry conferences, AI summits, technology events',
      topics: 'AI decisions, production AI, enterprise strategy',
    },
    {
      type: 'Corporate Events',
      description: 'Internal company events, leadership offsites, team gatherings',
      topics: 'Technical leadership, program management, AI strategy',
    },
    {
      type: 'Universities & Institutions',
      description: 'Academic institutions, research centers, student groups',
      topics: 'Career development, AI ethics, technical leadership',
    },
    {
      type: 'Community Events',
      description: 'Meetups, user groups, community-driven gatherings',
      topics: 'Open-source governance, mentorship, field practice',
    },
  ]

  return (
    <>
      <Hero
        subtitle="Speaking"
        title={
          <>
            Talks on AI Decisions,
            <br />
            <span className="gradient-text">Systems & Leadership</span>
          </>
        }
        description="Practical talks from building AI systems and driving programs at Fortune 50 scale. No buzzwords. Field-tested frameworks and real failure patterns."
      >
        <Link href="/contact?subject=speaking">
          <Button size="lg" className="group">
            Book for your event
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </Hero>

      <Section
        id="topics"
        subtitle="Topics"
        title="What I Talk About"
        description="Talks span AI decisions, production systems, governance architecture, and program leadership. Each can be customized to your audience and objectives."
      >
        <div className="space-y-8">
          {topics.map((topic, index) => {
            const Icon = topic.icon
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{topic.title}</CardTitle>
                      <CardDescription className="mb-4">{topic.description}</CardDescription>
                      <div className="grid md:grid-cols-3 gap-4 text-sm mb-4">
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">Audience</h4>
                          <p className="text-muted-foreground">{topic.audience}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">Format</h4>
                          <p className="text-muted-foreground">{topic.format}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
                    Key Takeaways
                  </h4>
                  <Grid cols={2} gap="sm">
                    {topic.keyTakeaways.map((takeaway, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{takeaway}</span>
                      </div>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )
          })}
        </div>
        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">
            Have a specific topic in mind? I can customize talks to your audience and objectives.
          </p>
          <Link href="/contact?subject=speaking">
            <Button variant="outline">Discuss custom topic</Button>
          </Link>
        </div>
      </Section>

      <Section subtitle="Formats" title="How I Present" className="bg-secondary/20">
        <Grid cols={2}>
          {formats.map((format, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 mb-3 w-fit">
                  <span className="text-xs font-medium text-primary">{format.duration}</span>
                </div>
                <CardTitle className="text-xl">{format.type}</CardTitle>
                <CardDescription className="mb-2">{format.description}</CardDescription>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Ideal for:</span> {format.idealFor}
                </p>
              </CardHeader>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section subtitle="Audiences" title="Where I Speak">
        <Grid cols={2}>
          {audiences.map((audience, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-xl">{audience.type}</CardTitle>
                <CardDescription className="mb-2">{audience.description}</CardDescription>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Topics:</span> {audience.topics}
                </p>
              </CardHeader>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section subtitle="What You Get" title="When You Book Me">
        <div className="max-w-4xl mx-auto">
          <Grid cols={2} gap="md">
            {[
              'Pre-event consultation to align on objectives',
              'Customized content for your audience',
              'Slide decks and supporting materials',
              'Post-event Q&A and follow-up',
              'Recording-friendly (when permitted)',
              'Professional and reliable delivery',
              'Actionable insights, not theory',
              'Frameworks audiences can use the next day',
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground">{item}</p>
              </div>
            ))}
          </Grid>
        </div>
      </Section>

      <CTA
        title="Book Me for Your Next Event"
        description="Whether it is a keynote for 500 or a workshop for your leadership team, I bring practical frameworks and real takeaways that audiences can use."
        primaryButton={{ text: 'Check availability', href: '/contact?subject=speaking' }}
        secondaryButton={{ text: 'View topics', href: '#topics' }}
      />
    </>
  )
}
