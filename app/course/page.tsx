import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import Grid from '@/components/Grid'
import { CheckCircle2, Calendar, Clock, Users, GraduationCap, Shield, Cpu, Radio, Award, MessageSquare } from 'lucide-react'

export const metadata = {
  title: 'AI Governance & Compliance Masterclass | Live Course by Subodh KC',
  description:
    'Live online masterclass on AI governance, compliance, and production AI architecture. EU AI Act, NIST AI RMF, ISO 42001, drift detection, and audit readiness. 1st & 3rd Thursday of every month, 8 PM CST. Message to join.',
  alternates: {
    canonical: 'https://subodhkc.com/course',
  },
  openGraph: {
    title: 'AI Governance & Compliance Masterclass | Subodh KC',
    description:
      'Live online course covering AI architecture, governance, compliance automation, and audit readiness. 1st & 3rd Thursday monthly, 8 PM CST.',
    url: 'https://subodhkc.com/course',
    type: 'website',
  },
  keywords: [
    'AI governance course',
    'AI compliance training',
    'AI architecture course',
    'enterprise AI training',
    'EU AI Act training',
    'NIST AI RMF course',
    'ISO 42001 training',
    'AI audit preparation course',
    'AI compliance certification',
    'production AI course',
    'Subodh KC course',
  ],
}

const courseSchema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'AI Governance & Compliance Masterclass',
  description:
    'Live online masterclass covering AI architecture, governance frameworks, compliance automation, and audit readiness. EU AI Act, NIST AI RMF, ISO 42001, drift detection, and production AI deployment.',
  provider: {
    '@type': 'Organization',
    name: 'Subodh KC',
    url: 'https://subodhkc.com',
    sameAs: 'https://subodhkc.com',
  },
  instructor: {
    '@type': 'Person',
    name: 'Subodh KC',
    jobTitle: 'AI Systems Architect & Governance Expert',
    worksFor: {
      '@type': 'Organization',
      name: 'HP Inc.',
    },
    alumniOf: {
      '@type': 'Organization',
      name: 'Louisiana Tech University',
    },
    sameAs: [
      'https://www.wikidata.org/wiki/Q140546484',
      'https://www.linkedin.com/in/subodhkc',
      'https://subodhkc.com/person/subodh-kc',
    ],
  },
  educationalLevel: 'Intermediate to Advanced',
  educationalCredentialAwarded: 'Certificate of Completion',
  courseCode: 'SKC-AI-GOV-001',
  url: 'https://subodhkc.com/course',
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'Online',
    courseWorkload: 'PT2H',
    location: {
      '@type': 'VirtualLocation',
      url: 'https://subodhkc.com/course',
    },
    instructor: {
      '@type': 'Person',
      name: 'Subodh KC',
    },
    eventSchedule: {
      '@type': 'Schedule',
      byDay: ['Thursday'],
      byMonthDay: [1, 3],
      startTime: '20:00',
      endTime: '22:00',
      scheduleTimezone: 'America/Chicago',
      repeatFrequency: 'P1M',
    },
  },
  about: [
    'AI Architecture',
    'AI Governance',
    'AI Compliance',
    'EU AI Act',
    'NIST AI RMF',
    'ISO 42001',
    'Drift Detection',
    'Audit Readiness',
  ],
  teaches: [
    'Designing production AI systems with agentic workflows and RAG',
    'Implementing EU AI Act, NIST AI RMF, and ISO 42001 compliance',
    'Building evidence architecture for audit-grade documentation',
    'Deploying drift detection and monitoring in CI/CD pipelines',
    'Creating governance operating models that scale across organizations',
  ],
}

const eventSchema = {
  '@context': 'https://schema.org',
  '@type': 'EducationEvent',
  name: 'AI Governance & Compliance Masterclass — Monthly Session',
  description:
    'Live online masterclass session covering AI architecture, governance, compliance, and audit readiness. Held on the 1st and 3rd Thursday of every month at 8 PM CST.',
  url: 'https://subodhkc.com/course',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
  location: {
    '@type': 'VirtualLocation',
    url: 'https://subodhkc.com/course',
  },
  organizer: {
    '@type': 'Person',
    name: 'Subodh KC',
    url: 'https://subodhkc.com',
  },
  performer: {
    '@type': 'Person',
    name: 'Subodh KC',
    jobTitle: 'AI Systems Architect & Governance Expert',
  },
  eventSchedule: {
    '@type': 'Schedule',
    byDay: ['Thursday'],
    byMonthDay: [1, 3],
    startTime: '20:00',
    endTime: '22:00',
    scheduleTimezone: 'America/Chicago',
    repeatFrequency: 'P1M',
  },
  isAccessibleForFree: false,
  inLanguage: 'en',
}

export default function CoursePage() {
  const modules = [
    {
      icon: Cpu,
      number: 'Module 01',
      title: 'AI Architecture Fundamentals',
      description:
        'Designing production AI systems from the ground up. Agentic workflows, RAG pipelines, MCP integrations, and enterprise knowledge architectures.',
      topics: [
        'Multi-agent orchestration and tool-use pipelines',
        'RAG architecture: vector databases, embeddings, retrieval strategies',
        'Model Context Protocol (MCP) servers and API orchestration',
        'Workflow and data architecture for production AI',
      ],
    },
    {
      icon: Radio,
      number: 'Module 02',
      title: 'Production Deployment & Operations',
      description:
        'Taking AI from pilot to production. Voice agents, monitoring, observability, and the operational hardening that keeps systems running.',
      topics: [
        'Deploying voice AI and chat agents in customer-facing operations',
        'Real-time monitoring, drift detection, and automated alerting',
        'Production hardening: load testing, failure modes, readiness reviews',
        'Human escalation architecture and context preservation',
      ],
    },
    {
      icon: Shield,
      number: 'Module 03',
      title: 'AI Governance Frameworks',
      description:
        'Building governance structures that scale. EU AI Act, NIST AI RMF, ISO 42001, NYC LL 144 — what applies, what doesn\'t, and how to implement.',
      topics: [
        'EU AI Act: risk classification, conformity assessment, obligations',
        'NIST AI RMF: govern, map, measure, manage functions',
        'ISO 42001: AI management system implementation',
        'NYC Local Law 144: bias audit requirements for automated tools',
      ],
    },
    {
      icon: CheckCircle2,
      number: 'Module 04',
      title: 'Compliance Automation & Evidence',
      description:
        'Automating compliance so it doesn\'t slow you down. Evidence architecture, documentation pipelines, and CI/CD quality gates.',
      topics: [
        'Audit-grade evidence generation and documentation pipelines',
        'Compliance evidence repositories and audit trails',
        'Automated quality gates in CI/CD (HAIEC Action)',
        'Patent-pending drift detection frameworks in practice',
      ],
    },
    {
      icon: Award,
      number: 'Module 05',
      title: 'Audit Readiness & Governance Operations',
      description:
        'Preparing for and passing AI audits. Governance operating models, committee structures, and policies that survive contact with real organizations.',
      topics: [
        'Audit preparation checklist and documentation requirements',
        'Governance committee structures and operating models',
        'Policy frameworks that engineers will actually follow',
        'Case studies: Fortune 50 audit readiness in practice',
      ],
    },
  ]

  const schedule = [
    { label: 'Frequency', value: '1st & 3rd Thursday of every month', icon: Calendar },
    { label: 'Time', value: '8:00 PM – 10:00 PM CST', icon: Clock },
    { label: 'Format', value: 'Live online (virtual)', icon: GraduationCap },
    { label: 'Class Size', value: 'Limited — message to join', icon: Users },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />

      <Hero
        subtitle="Live Course"
        title={
          <>
            AI Governance & Compliance
            <br />
            <span className="gradient-text">Masterclass</span>
          </>
        }
        description="A live, instructor-led masterclass covering AI architecture, governance frameworks, compliance automation, and audit readiness. Built for engineers, architects, and leaders who need to ship AI systems that pass scrutiny."
      />

      <Section subtitle="Details" title="Course Schedule & Format">
        <div className="max-w-4xl mx-auto">
          <Grid cols={2}>
            {schedule.map((item, index) => {
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

      <Section subtitle="Curriculum" title="What You'll Learn" className="bg-secondary/20">
        <div className="space-y-6">
          {modules.map((module, index) => {
            const Icon = module.icon
            return (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-primary mb-1">{module.number}</p>
                      <CardTitle className="text-xl mb-2">{module.title}</CardTitle>
                      <CardDescription className="text-base mb-4">{module.description}</CardDescription>
                      <CardContent>
                        <ul className="space-y-2">
                          {module.topics.map((topic, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-muted-foreground">{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </Section>

      <Section subtitle="Instructor" title="Who Teaches This Course">
        <div className="max-w-3xl mx-auto">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-xl mb-2">Subodh KC</CardTitle>
              <p className="text-sm font-medium text-primary mb-3">
                AI Systems Architect & Governance Expert · Sr. Program Manager, HP Inc. (Fortune 50)
              </p>
              <CardDescription className="text-base space-y-3">
                <p>
                  Subodh KC is currently Sr. Program Manager — AI Implementation & Governance at HP Inc.,
                  where he drives strategic AI transformation across enterprise systems and architects
                  governance frameworks for Fortune 50 scale.
                </p>
                <p>
                  He has developed 5 patent-pending methodologies for AI compliance, drift detection, and
                  behavioral verification. He is the founder of KestrelVoice (AI voice operations) and
                  co-founder of HAIEC (AI compliance platform). 16+ years from field technician to Fortune 50
                  AI strategy leader.
                </p>
                <p>
                  <strong className="text-foreground">Credentials:</strong> M.Sc. Engineering & Technology
                  Management (Louisiana Tech), B.S. Computer & Information Systems Security, Six Sigma Green
                  Belt, Dean's Honor List.
                </p>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      <Section subtitle="Who Should Join" title="Is This Course Right For You?" className="bg-secondary/20">
        <div className="max-w-4xl mx-auto">
          <Grid cols={2}>
            {[
              'AI engineers and architects building production systems',
              'Compliance officers and risk managers responsible for AI',
              'Technical program managers leading AI initiatives',
              'CTOs and VPs of Engineering evaluating AI governance',
              'Legal teams navigating AI regulatory landscape',
              'Consultants advising clients on AI compliance',
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground">{item}</p>
              </div>
            ))}
          </Grid>
        </div>
      </Section>

      <Section subtitle="How to Join" title="Enrollment Process">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardDescription className="text-base space-y-4">
                <p>
                  This course is limited in class size to ensure quality interaction. To enroll, send a
                  message using the form below and you'll receive:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Confirmation of your spot in the next session</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Access link and prep materials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Course outline and recommended prerequisites</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Direct contact with Subodh for any questions</span>
                  </li>
                </ul>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      <CTA
        title="Join the Next Session"
        description="Message Subodh KC to enroll in the AI Governance & Compliance Masterclass. Limited spots — 1st & 3rd Thursday of every month, 8 PM CST."
        primaryButton={{ text: 'Message to Join', href: '/contact' }}
        secondaryButton={{ text: 'View Services', href: '/services' }}
      />
    </>
  )
}
