import Hero from '@/components/Hero'
import Section from '@/components/Section'
import Grid from '@/components/Grid'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import CTA from '@/components/CTA'
import { Mic, Users, Briefcase, GraduationCap, CheckCircle2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Speaking',
  description:
    'Book Subodh KC for keynotes, workshops, and technical talks on AI compliance, governance, enterprise program management, and strategic execution at scale.',
}

export default function SpeakingPage() {
  const topics = [
    {
      icon: Briefcase,
      title: 'From AI Pilots to Production',
      description:
        'How enterprise leaders are building governance frameworks that enable the transition from experimentation to compliant, production-grade AI systems.',
      audience: 'C-suite, VPs of Engineering, AI leaders',
      format: 'Keynote (45-60 min) or Workshop (2-3 hours)',
      keyTakeaways: [
        'Common pitfalls in AI pilot-to-production transitions',
        'Governance frameworks that scale',
        'Regulatory compliance without sacrificing velocity',
        'Real-world case studies from Fortune 50',
      ],
    },
    {
      icon: Users,
      title: 'Why Enterprise AI Integration Fails',
      description:
        'Systematic analysis of the architectural, organizational, and strategic failures that turn AI initiatives into expensive experiments.',
      audience: 'Technical leaders, architects, TPMs',
      format: 'Keynote (45-60 min) or Technical Deep-Dive (90 min)',
      keyTakeaways: [
        'The 5 failure patterns in enterprise AI',
        'What actually works: proven architectures',
        'Organizational anti-patterns to avoid',
        'Decision frameworks for AI at scale',
      ],
    },
    {
      icon: GraduationCap,
      title: 'Cognitive Systems Management',
      description:
        'The comprehensive methodology for AI implementation that bridges strategy, technical execution, and governance for enterprise scale.',
      audience: 'Program managers, AI teams, governance leaders',
      format: 'Workshop (half-day or full-day)',
      keyTakeaways: [
        'Four-pillar CSM framework',
        'Strategic-to-operational alignment',
        'Risk-integrated decision making',
        'Hands-on framework application',
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
        'Measuring impact vs. activity',
        'Career growth for technical leaders',
      ],
    },
  ]

  const formats = [
    {
      type: 'Keynote',
      duration: '45-60 minutes',
      description: 'High-impact presentations for conferences, corporate events, and summits.',
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
      description: 'Conversational format with Q&A, exploring topics in-depth.',
      idealFor: 'Intimate settings, executive roundtables',
    },
    {
      type: 'Panel Moderator',
      duration: '45-60 minutes',
      description: 'Facilitate discussions with industry experts on AI governance and strategy.',
      idealFor: 'Multi-perspective discussions, industry events',
    },
  ]

  const pastEngagements = [
    {
      event: 'Enterprise AI Summit',
      topic: 'Regulatory Readiness for Production AI',
      audience: '500+ attendees',
      type: 'Keynote',
    },
    {
      event: 'Fortune 50 Leadership Forum',
      topic: 'Strategic Program Management at Scale',
      audience: 'Executive leadership',
      type: 'Fireside Chat',
    },
    {
      event: 'AI Governance Workshop Series',
      topic: 'Implementing CSM Methodology',
      audience: 'Technical teams',
      type: 'Full-day Workshop',
    },
  ]

  const audiences = [
    {
      type: 'Conferences & Summits',
      description: 'Industry conferences, AI summits, technology events',
      topics: 'AI governance, compliance, enterprise strategy',
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
      topics: 'Open-source governance, mentorship, Nepal tech community',
    },
  ]

  return (
    <>
      <Hero
        subtitle="Speaking"
        title={
          <>
            High-Impact Talks on
            <br />
            <span className="gradient-text">AI Governance & Strategy</span>
          </>
        }
        description="No buzzwords. No fluff. Strategic insights from 12+ years building AI systems and driving programs at Fortune 50 scale."
      >
        <Link href="/contact">
          <Button size="lg" className="group">
            Book for your event
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </Hero>

      <Section
        subtitle="Topics"
        title="What I Talk About"
        description="Practical, actionable insights from real-world experience implementing AI compliance and driving technical programs at enterprise scale."
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
          <Link href="/contact">
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

      <Section subtitle="Experience" title="Past Speaking Engagements">
        <div className="max-w-3xl mx-auto space-y-4">
          {pastEngagements.map((engagement, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="inline-flex items-center rounded-full border border-accent/20 bg-accent/10 px-3 py-1 mb-2 w-fit">
                      <span className="text-xs font-medium text-accent">{engagement.type}</span>
                    </div>
                    <CardTitle className="text-xl mb-1">{engagement.event}</CardTitle>
                    <CardDescription className="mb-2">{engagement.topic}</CardDescription>
                    <p className="text-sm text-muted-foreground">{engagement.audience}</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
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
              'High-quality slide decks and materials',
              'Post-event Q&A and follow-up',
              'Promotion of your event on my channels',
              'Recording-friendly (when permitted)',
              'Professional and reliable delivery',
              'Actionable insights, not theory',
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
        description="Whether it's a keynote for 500 or a workshop for your leadership team, I bring strategic insights and practical takeaways that audiences remember."
        primaryButton={{ text: 'Check availability', href: '/contact' }}
        secondaryButton={{ text: 'View topics', href: '#topics' }}
      />
    </>
  )
}
