import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import Grid from '@/components/Grid'
import { CheckCircle2, Calendar, Clock, Users, Scale, Building2, Video, MessageSquare } from 'lucide-react'

export const metadata = {
  title: 'AI Laws and Policies for Small Business | Free Monthly Webinar by Subodh KC',
  description:
    'Free monthly webinar on AI laws and policies for small businesses. EU AI Act, NIST AI RMF, NYC LL 144, state-level AI regulations, and practical compliance checklists. 2nd Monday of every month. Register to attend.',
  alternates: {
    canonical: 'https://subodhkc.com/webinar/ai-laws-small-business',
  },
  openGraph: {
    title: 'AI Laws and Policies for Small Business | Monthly Webinar',
    description:
      'Free monthly webinar covering AI regulations, compliance checklists, and policies every small business needs. 2nd Monday of every month.',
    url: 'https://subodhkc.com/webinar/ai-laws-small-business',
    type: 'website',
  },
  keywords: [
    'AI laws small business',
    'AI compliance webinar',
    'AI policy small business',
    'AI regulation webinar',
    'EU AI Act small business',
    'NIST AI RMF small business',
    'NYC Local Law 144',
    'AI governance webinar',
    'AI compliance for small business',
    'Subodh KC webinar',
  ],
}

const eventSchema = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'AI Laws and Policies for Small Business — Monthly Webinar',
  description:
    'Free monthly webinar covering AI laws, regulations, and policies that impact small businesses. EU AI Act, NIST AI RMF, NYC Local Law 144, state-level AI regulations, and practical compliance checklists. Held on the 2nd Monday of every month.',
  url: 'https://subodhkc.com/webinar/ai-laws-small-business',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
  location: {
    '@type': 'VirtualLocation',
    url: 'https://subodhkc.com/webinar/ai-laws-small-business',
  },
  organizer: {
    '@type': 'Person',
    name: 'Subodh KC',
    url: 'https://subodhkc.com',
    email: 'subodh.kc@haiec.com',
  },
  performer: {
    '@type': 'Person',
    name: 'Subodh KC',
    jobTitle: 'AI Systems Architect & Governance Expert',
  },
  eventSchedule: {
    '@type': 'Schedule',
    byDay: ['Monday'],
    byMonthDay: [8, 9, 10, 11, 12, 13, 14],
    startTime: '12:00',
    endTime: '13:30',
    scheduleTimezone: 'America/Chicago',
    repeatFrequency: 'P1M',
  },
  isAccessibleForFree: true,
  inLanguage: 'en',
  audience: {
    '@type': 'Audience',
    audienceType: 'Small Business Owners',
  },
  about: [
    'AI Law',
    'AI Policy',
    'EU AI Act',
    'NIST AI RMF',
    'NYC Local Law 144',
    'AI Compliance',
    'Small Business',
  ],
}

export default function WebinarPage() {
  const topics = [
    {
      icon: Scale,
      title: 'EU AI Act Impact on US Small Businesses',
      description:
        'The EU AI Act has extraterritorial reach. Learn which provisions apply to your small business, even if you\'re US-based, and what you need to do now.',
    },
    {
      icon: Building2,
      title: 'NIST AI RMF for Small Teams',
      description:
        'The NIST AI Risk Management Framework isn\'t just for enterprises. Learn how to apply the Govern, Map, Measure, and Manage functions with limited resources.',
    },
    {
      icon: CheckCircle2,
      title: 'NYC Local Law 144 & State AI Laws',
      description:
        'If you use AI for hiring, promotions, or automated decisions, NYC LL 144 may apply. Plus state-level AI regulations emerging across the US.',
    },
    {
      icon: MessageSquare,
      title: 'AI Usage Policies for Employees',
      description:
        'Practical templates and frameworks for creating AI usage policies that protect your business without stifling productivity.',
    },
  ]

  const takeaways = [
    'Understand which AI regulations apply to your small business',
    'Get a practical compliance checklist you can implement immediately',
    'Learn about free and low-cost tools for AI compliance (HAIEC Action, llmverify)',
    'Receive an AI usage policy template for your employees',
    'Ask questions specific to your business and industry',
    'Walk away with a 90-day compliance action plan',
  ]

  const details = [
    { label: 'Frequency', value: '2nd Monday of every month', icon: Calendar },
    { label: 'Duration', value: '12:00 PM – 1:30 PM CST', icon: Clock },
    { label: 'Format', value: 'Live online webinar', icon: Video },
    { label: 'Cost', value: 'Free', icon: Users },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />

      <Hero
        subtitle="Free Monthly Webinar"
        title={
          <>
            AI Laws and Policies
            <br />
            <span className="gradient-text">for Small Business</span>
          </>
        }
        description="A free monthly webinar breaking down the AI regulations, compliance requirements, and policies every small business needs to know. No legal jargon. Just practical guidance you can act on."
      />

      <div className="max-w-4xl mx-auto px-6 -mt-4 mb-4">
        <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
          <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              Next session: 2nd Monday of every month, 12:00 PM CST
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Free registration — spots are limited to ensure quality Q&amp;A time
            </p>
          </div>
        </div>
      </div>

      <Section subtitle="Details" title="Webinar Schedule & Format">
        <div className="max-w-4xl mx-auto">
          <Grid cols={2}>
            {details.map((item, index) => {
              const Icon = item.icon
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        <p className="font-semibold text-foreground">{item.value}</p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              )
            })}
          </Grid>
        </div>
      </Section>

      <Section subtitle="Topics" title="What We Cover" className="bg-secondary/20">
        <Grid cols={2}>
          {topics.map((topic, index) => {
            const Icon = topic.icon
            return (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{topic.title}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">{topic.description}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </Grid>
      </Section>

      <Section subtitle="What You Get" title="Key Takeaways">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardContent>
              <ul className="space-y-3 pt-4">
                {takeaways.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">{item}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section subtitle="Who Should Attend" title="Is This Webinar Right For You?" className="bg-secondary/20">
        <div className="max-w-4xl mx-auto">
          <Grid cols={2}>
            {[
              'Small business owners using AI tools or considering AI adoption',
              'Startups building AI-powered products or features',
              'Business managers responsible for compliance or risk',
              'HR professionals using AI for hiring or screening',
              'Consultants and advisors serving small business clients',
              'Anyone who wants to understand AI regulations in plain language',
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground">{item}</p>
              </div>
            ))}
          </Grid>
        </div>
      </Section>

      <Section subtitle="About the Speaker" title="Your Host">
        <div className="max-w-3xl mx-auto">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-xl mb-2">Subodh KC</CardTitle>
              <p className="text-sm font-medium text-primary mb-3">
                AI Systems Architect & Governance Expert · Sr. Program Manager, HP Inc. (Fortune 50)
              </p>
              <CardDescription className="text-base space-y-3">
                <p>
                  Subodh KC architects AI governance frameworks for a Fortune 50 company and has developed 5
                  patent-pending methodologies for AI compliance and drift detection. He is the co-founder of
                  HAIEC, an AI compliance platform, and founder of KestrelVoice, an AI voice operations platform.
                </p>
                <p>
                  He created this webinar because most AI regulation content is written for enterprises with
                  dedicated compliance teams. Small businesses are subject to the same laws but have fewer
                  resources to navigate them. This webinar bridges that gap.
                </p>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      <CTA
        title="Register for the Next Webinar"
        description="Free monthly webinar — 2nd Monday of every month. Register to receive the access link and prep materials. Limited spots for quality Q&A."
        primaryButton={{ text: 'Register Now', href: '/contact' }}
        secondaryButton={{ text: 'View All Services', href: '/services' }}
      />
    </>
  )
}
