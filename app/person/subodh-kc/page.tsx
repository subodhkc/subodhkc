import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Grid from '@/components/Grid'
import { CheckCircle2, GraduationCap, Briefcase, Award, Building2 } from 'lucide-react'

export const metadata = {
  title: 'Subodh KC — AI Systems Architect & Governance Expert | Person Profile',
  description:
    'Subodh KC is an AI Systems Architect and Governance Expert with 16+ years of experience. Sr. Program Manager at HP Inc. (Fortune 50). Founder of KestrelVoice, co-founder of HAIEC. 5 patent-pending AI compliance frameworks.',
  alternates: {
    canonical: 'https://subodhkc.com/person/subodh-kc',
  },
  openGraph: {
    title: 'Subodh KC — AI Systems Architect & Governance Expert',
    description:
      'Person profile for Subodh KC — AI Systems Architect, Governance Expert, founder, and patent-pending innovator.',
    url: 'https://subodhkc.com/person/subodh-kc',
    type: 'profile',
  },
  keywords: [
    'Subodh KC',
    'Subodh KC AI architect',
    'Subodh KC governance',
    'Subodh KC HAIEC',
    'Subodh KC KestrelVoice',
    'AI Systems Architect',
    'AI Governance Expert',
  ],
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Subodh KC',
  alternateName: ['Subodh K.C.', 'Subodh Khatri Chhetri'],
  givenName: 'Subodh',
  familyName: 'KC',
  jobTitle: 'AI Systems Architect & Governance Expert',
  description:
    'AI Systems Architect and Governance Expert with 16+ years of experience building production AI systems at enterprise scale. Sr. Program Manager — AI Implementation & Governance at HP Inc. (Fortune 50). Founder of KestrelVoice, co-founder of HAIEC. 5 patent-pending frameworks in AI compliance and drift detection.',
  url: 'https://subodhkc.com',
  email: 'subodh.kc@haiec.com',
  image: 'https://subodhkc.com/portrait.jpeg',
  sameAs: [
    'https://www.wikidata.org/wiki/Q140546484',
    'https://www.linkedin.com/in/subodhkc',
    'https://twitter.com/subodhkc',
    'https://github.com/subodhkc',
    'https://medium.com/@subodhkc',
    'https://kestrelvoice.com',
    'https://frontofai.com',
    'https://haiec.com',
  ],
  knowsAbout: [
    'AI Architecture',
    'Agentic AI Systems',
    'RAG & Enterprise Knowledge Systems',
    'MCP & API Integrations',
    'Voice AI Operations',
    'AI Governance',
    'EU AI Act',
    'NIST AI RMF',
    'ISO 42001',
    'NYC Local Law 144',
    'AI Regulatory Compliance',
    'Drift Detection',
    'Audit Readiness',
    'Cognitive Systems Management',
  ],
  alumniOf: {
    '@type': 'Organization',
    name: 'Louisiana Tech University',
  },
  worksFor: {
    '@type': 'Organization',
    name: 'HP Inc.',
  },
  founder: {
    '@type': 'Organization',
    name: 'KestrelVoice',
    url: 'https://kestrelvoice.com',
    description: 'AI voice operations platform',
  },
  coFounder: {
    '@type': 'Organization',
    name: 'HAIEC',
    url: 'https://haiec.com',
    description: 'Enterprise AI governance and compliance platform',
  },
  award: ["Dean's Honor List", "President's Honor List"],
  knowsLanguage: ['English', 'Nepali'],
  nationality: { '@type': 'Country', name: 'United States' },
  birthPlace: {
    '@type': 'Place',
    name: 'Kathmandu',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'Nepal',
    },
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Dallas',
    addressRegion: 'TX',
    addressCountry: 'US',
  },
}

const profilePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  mainEntity: personSchema,
  dateCreated: '2026-07-14',
  dateModified: '2026-07-14',
}

export default function PersonPage() {
  const career = [
    { period: '2024 – Present', role: 'Sr. Program Manager — AI Implementation & Governance', org: 'HP Inc. (Fortune 50)', description: 'Driving strategic AI transformation across enterprise systems. Architecting governance frameworks that enable innovation without regulatory risk.' },
    { period: '2023 – 2024', role: 'Founder', org: 'KestrelVoice', description: 'Built AI voice operations platform — answers every call, books appointments, runs the front desk 24/7.' },
    { period: '2023 – Present', role: 'Co-founder', org: 'HAIEC', description: 'Built enterprise AI governance and compliance platform for EU AI Act, NIST AI RMF, ISO 42001, NYC LL 144.' },
    { period: '2020 – 2024', role: 'AI Strategy & Program Leadership', org: 'Enterprise', description: 'Led AI transformation programs across Fortune 50 environments. Developed CSM framework adopted across multiple pilots.' },
    { period: '2008 – 2020', role: 'Full-Stack Engineer → Program Manager', org: 'Various', description: '16 years from field technician to system engineer to program manager. Ground floor to executive strategy.' },
  ]

  const education = [
    { degree: 'M.Sc. Engineering & Technology Management', institution: 'Louisiana Tech University' },
    { degree: 'B.S. Computer & Information Systems Security', institution: 'Louisiana Tech University' },
    { degree: 'Six Sigma Green Belt', institution: 'Certified' },
  ]

  const patents = [
    { name: 'Adversarial Project Twin', description: 'Drift and sabotage simulation framework for AI systems.' },
    { name: 'AI Compliance Twin', description: 'Real-time regulatory enforcement engine for AI systems.' },
    { name: 'Modular Audit Engine', description: 'AI fairness and transparency scoring with audit-grade documentation.' },
    { name: 'Precision Drift Detector', description: 'Numerical anomaly detection for AI model performance monitoring.' },
    { name: 'Compliance Fingerprint Layer', description: 'Tamper-evident traceability for AI decision-making.' },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />

      <Hero
        subtitle="Person Profile"
        title={
          <>
            Subodh KC
            <br />
            <span className="gradient-text">AI Systems Architect & Governance Expert</span>
          </>
        }
        description="A canonical entity profile for Subodh KC — AI Systems Architect, Governance Expert, founder, and patent-pending innovator with 16+ years building production AI systems at enterprise scale."
      />

      <Section subtitle="Biography" title="About Subodh KC">
        <div className="max-w-3xl mx-auto">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardDescription className="text-base leading-relaxed space-y-4">
                <p>
                  Subodh KC is an AI Systems Architect and Governance Expert currently serving as Sr. Program
                  Manager — AI Implementation & Governance at HP Inc., a Fortune 50 company. He drives
                  strategic AI transformation across enterprise systems and architects governance frameworks
                  that enable innovation without regulatory risk.
                </p>
                <p>
                  He is the founder of KestrelVoice, an AI voice operations platform, and co-founder of HAIEC,
                  an enterprise AI governance and compliance platform. He has developed 5 patent-pending
                  methodologies for AI compliance, drift detection, and behavioral verification.
                </p>
                <p>
                  His career spans 16+ years from field technician to Fortune 50 AI strategy leader. Born in
                  Kathmandu, Nepal, he later moved to the United States and holds an M.Sc. in Engineering &
                  Technology Management and a B.S. in Computer & Information Systems Security from Louisiana
                  Tech University. He is based in Dallas, Texas.
                </p>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      <Section subtitle="Career" title="Professional Timeline" className="bg-secondary/20">
        <div className="max-w-3xl mx-auto space-y-4">
          {career.map((item, index) => (
            <Card key={index} className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-primary mb-1">{item.period}</p>
                    <CardTitle className="text-lg mb-1">{item.role}</CardTitle>
                    <p className="text-sm font-semibold text-foreground mb-2">{item.org}</p>
                    <CardDescription className="text-sm">{item.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Section>

      <Section subtitle="Education" title="Academic Background">
        <div className="max-w-3xl mx-auto space-y-4">
          {education.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <GraduationCap className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <CardTitle className="text-base">{item.degree}</CardTitle>
                    <CardDescription className="text-sm">{item.institution}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Section>

      <Section subtitle="Innovation" title="Patent-Pending Frameworks" className="bg-secondary/20">
        <div className="max-w-3xl mx-auto space-y-4">
          {patents.map((patent, index) => (
            <Card key={index} className="border-l-4 border-l-accent">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <CardTitle className="text-base mb-1">{patent.name}</CardTitle>
                    <CardDescription className="text-sm">{patent.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Section>

      <Section subtitle="Organizations" title="Founded & Co-Founded">
        <div className="max-w-3xl mx-auto">
          <Grid cols={2}>
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <CardTitle className="text-base mb-1">KestrelVoice</CardTitle>
                    <CardDescription className="text-sm">
                      AI voice operations platform. Answers every call, books appointments, runs the front desk 24/7.
                    </CardDescription>
                    <p className="text-xs text-primary mt-2">Founder</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <CardTitle className="text-base mb-1">HAIEC</CardTitle>
                    <CardDescription className="text-sm">
                      Enterprise AI governance and compliance platform. EU AI Act, NIST AI RMF, ISO 42001, NYC LL 144.
                    </CardDescription>
                    <p className="text-xs text-primary mt-2">Co-founder</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Grid>
        </div>
      </Section>

      <CTA
        title="Work With Subodh KC"
        description="Available for consulting, advisory, fractional executive roles, and full-time leadership positions. Project-based, retainer, and fractional engagements available."
        primaryButton={{ text: 'Get in Touch', href: '/contact' }}
        secondaryButton={{ text: 'View Services', href: '/services' }}
      />
    </>
  )
}
