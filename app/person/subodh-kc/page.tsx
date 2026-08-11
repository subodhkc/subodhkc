import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Grid from '@/components/Grid'
import Link from 'next/link'
import { CheckCircle2, GraduationCap, Briefcase, Award, Building2, Shield, Code2, Cpu } from 'lucide-react'

export const metadata = {
  title: 'Subodh KC - Director of AI Programs, AI Systems Architect & Governance Expert',
  description:
    'Subodh KC is a Director-level AI Programs leader and AI Systems Architect with 16+ years of experience. Sr. Program Manager at HP Inc. (Fortune 50). Founder of KestrelVoice and HAIEC. 5 patent-pending AI compliance frameworks. $50M+ portfolio oversight. 53 enterprise applications governed. 100+ stakeholders aligned.',
  alternates: {
    canonical: 'https://subodhkc.com/person/subodh-kc',
  },
  openGraph: {
    title: 'Subodh KC - Director of AI Programs & AI Systems Architect',
    description:
      'Sr. Program Manager at HP Inc. (Fortune 50). 16+ years building production AI systems. Founder of KestrelVoice and HAIEC. 5 patent-pending frameworks. $50M+ portfolio oversight.',
    url: 'https://subodhkc.com/person/subodh-kc',
    type: 'profile',
    images: [
      {
        url: 'https://subodhkc.com/portrait.jpeg',
        width: 1200,
        height: 630,
        alt: 'Subodh KC - Director of AI Programs & AI Systems Architect',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Subodh KC - Director of AI Programs & AI Systems Architect',
    description: 'Sr. Program Manager at HP Inc. (Fortune 50). 16+ years building production AI systems. 5 patent-pending frameworks. $50M+ portfolio oversight.',
    images: ['https://subodhkc.com/portrait.jpeg'],
  },
  keywords: [
    'Subodh KC',
    'Subodh KC AI architect',
    'Subodh KC governance',
    'Subodh KC HAIEC',
    'Subodh KC KestrelVoice',
    'AI Systems Architect',
    'AI Governance Expert',
    'Director of AI Programs',
    'Head of AI',
    'VP of AI Strategy',
    'Senior Program Manager AI',
    'AI program management Fortune 50',
    'HP Inc AI program manager',
    'enterprise AI strategy leader',
    'AI transformation leader',
    'AI compliance frameworks inventor',
    'AI drift detection',
    'AI governance director',
    'fractional AI executive',
    'AI advisory board',
    'AI program director Dallas Fort Worth',
    'enterprise AI portfolio management',
    'AI systems design architect',
    'production AI deployment',
    'AI regulatory compliance EU AI Act NIST',
    'agentic AI systems architect',
    'RAG pipeline architecture',
    'MCP integrations',
    'voice AI operations',
    'AI risk management',
    'AI audit readiness',
    'Six Sigma AI program management',
    'manufacturing AI reliability engineering',
    'technology commercialization AI',
  ],
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Subodh KC',
  alternateName: ['Subodh K.C.', 'Subodh Khatri Chhetri', 'Subodh Kumar KC'],
  givenName: 'Subodh',
  familyName: 'KC',
  jobTitle: 'Director of AI Programs | AI Systems Architect & Governance Expert',
  description:
    'Director-level AI programs leader and AI Systems Architect with 16+ years building production AI systems at enterprise scale. Sr. Program Manager - AI Implementation & Governance at HP Inc. (Fortune 50). Founder of KestrelVoice and HAIEC. 5 patent-pending frameworks in AI compliance, drift detection, and behavioral verification. $50M+ portfolio oversight across 53 enterprise applications.',
  url: 'https://subodhkc.com',
  email: 'subodhkc@subodhkc.com',
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
    'Texas TRAIGA (HB 149)',
    'AI Regulatory Compliance',
    'Drift Detection',
    'Audit Readiness',
    'Cognitive Systems Management',
    'Enterprise AI Strategy',
    'AI Program Management',
    'Portfolio Management',
    'Manufacturing Execution Systems',
    'Technology Commercialization',
    'Continuous Improvement',
    'AI Assurance',
    'Production AI Deployment',
    'AI Risk Management',
    'Stakeholder Alignment',
    'Executive Communication',
  ],
  skills: [
    'AI Architecture & Integration',
    'Agentic AI Systems Design',
    'RAG Pipeline Architecture',
    'MCP Server Development',
    'Voice AI Operations',
    'AI Governance & Compliance',
    'EU AI Act Compliance',
    'NIST AI RMF Implementation',
    'ISO 42001 Implementation',
    'NYC Local Law 144 Compliance',
    'Texas TRAIGA Compliance',
    'AI Drift Detection & Monitoring',
    'AI Audit Readiness',
    'Enterprise Program Management',
    'Portfolio Management',
    'Stakeholder Alignment',
    'Risk Management',
    'Release Readiness',
    'Dependency Management',
    'Executive Communication',
    'Cross-functional Leadership',
    'Agile Delivery',
    'Six Sigma Green Belt',
    'Manufacturing Execution Systems',
    'Technology Commercialization',
    'Python',
    'TypeScript',
    'Next.js',
    'FastAPI',
    'PostgreSQL',
    'Vector Databases',
    'Docker',
    'CI/CD',
  ],
  hasOccupation: [
    {
      '@type': 'Occupation',
      name: 'Sr. Program Manager - AI Implementation & Governance',
      occupationLocation: { '@type': 'Place', name: 'HP Inc., United States' },
      startDate: '2025',
      description: 'Driving strategic AI transformation across enterprise systems. Architecting governance frameworks that enable innovation without regulatory risk.',
    },
    {
      '@type': 'Occupation',
      name: 'Technical Program Manager',
      occupationLocation: { '@type': 'Place', name: 'HP Inc., United States' },
      startDate: '2022',
      description: 'Directed development and release cycles for 53 enterprise applications. Led cross-functional teams through Agile delivery at Fortune 50 scale.',
    },
    {
      '@type': 'Occupation',
      name: 'System Engineer II',
      occupationLocation: { '@type': 'Place', name: 'ACTIVE Network, United States' },
      description: 'Release automation, QA, incident workflows, production reliability.',
    },
    {
      '@type': 'Occupation',
      name: 'System Analyst',
      occupationLocation: { '@type': 'Place', name: 'Cummins (via TCS), United States' },
      description: '$10M MES implementation across 400+ production stations.',
    },
  ],
  hasCredential: [
    {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'degree',
      name: 'M.Sc. Engineering & Technology Management',
      recognizedBy: { '@type': 'CollegeOrUniversity', name: 'Louisiana Tech University' },
    },
    {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'degree',
      name: 'B.S. Computer & Information Systems Security',
      recognizedBy: { '@type': 'CollegeOrUniversity', name: 'Louisiana Tech University' },
    },
    {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'certification',
      name: 'Six Sigma Green Belt',
    },
  ],
  alumniOf: [
    {
      '@type': 'CollegeOrUniversity',
      name: 'Louisiana Tech University',
    },
  ],
  worksFor: {
    '@type': 'Organization',
    name: 'HP Inc.',
    description: 'Fortune 50 technology company',
    url: 'https://www.hp.com',
  },
  founder: [
    {
      '@type': 'Organization',
      name: 'KestrelVoice',
      url: 'https://kestrelvoice.com',
      description: 'AI voice operations platform',
    },
    {
      '@type': 'Organization',
      name: 'HAIEC',
      url: 'https://haiec.com',
      description: 'Enterprise AI governance and compliance platform',
    },
  ],
  award: ["Dean's Honor List", "President's Honor List", 'University Coding Competition Winner', 'Global Business Strategy Competition - Top 3 Global'],
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
    addressLocality: 'Dallas-Fort Worth',
    addressRegion: 'TX',
    addressCountry: 'US',
  },
  seeks: {
    '@type': 'Demand',
    description: 'Open to Director of AI Programs, Head of AI, VP of AI Strategy, Senior Program Manager, and fractional AI executive roles.',
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://subodhkc.com/person/subodh-kc',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'Person', item: 'https://subodhkc.com/person' },
    { '@type': 'ListItem', position: 3, name: 'Subodh KC', item: 'https://subodhkc.com/person/subodh-kc' },
  ],
}

const profilePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  mainEntity: personSchema,
  dateCreated: '2026-07-14',
  dateModified: '2026-08-11',
}

export default function PersonPage() {
  const career = [
    {
      period: '2025 - Present',
      role: 'Sr. Program Manager - AI Implementation & Governance',
      org: 'HP Inc. (Fortune 50)',
      description: 'Driving strategic AI transformation across enterprise systems. Architecting governance frameworks that enable innovation without regulatory risk. Orchestrating enterprise-wide AI rollouts with 100+ stakeholders. Managing $50M+ AI and technology portfolio. Developing five patent-pending compliance and drift frameworks. Reducing audit preparation from months to weeks.',
      achievements: ['$50M+ portfolio oversight', '53 enterprise applications governed', '100+ stakeholders aligned', '5 patent-pending frameworks developed'],
    },
    {
      period: '2022 - 2025',
      role: 'Technical Program Manager',
      org: 'HP Inc. (Fortune 50)',
      description: 'Directed development and release cycles for 53 enterprise applications including Power Manager and enterprise software portfolio. Led cross-functional teams through Agile delivery at Fortune 50 scale. Coordinated across product, engineering, quality, operations, vendors, risk functions, and senior leadership.',
      achievements: ['53 enterprise applications managed', 'Agile delivery at Fortune 50 scale', 'Cross-functional team leadership'],
    },
    {
      period: '2023 - Present',
      role: 'Founder',
      org: 'KestrelVoice',
      description: 'Built AI voice operations platform combining voice agents, business knowledge, scheduling, automation, integrations, escalation, and operational controls. Confronts real deployment challenges: latency, integration failures, customer expectations, data boundaries, and knowing when automation should hand responsibility back to a person.',
      achievements: ['Production AI voice platform', 'Multi-channel AI operations', '24/7 automated receptionist'],
    },
    {
      period: '2020 - Present',
      role: 'Founder & CEO',
      org: 'HAIEC',
      description: 'Built enterprise AI governance and compliance platform for EU AI Act, NIST AI RMF, ISO 42001, NYC LL 144, and Texas TRAIGA. Introduced AI Governance Execution Framework with six operational functions, forensic audit toolkit, and modernization pathways for legacy systems.',
      achievements: ['Multi-regulation compliance engine', 'AI governance execution framework', 'Enterprise audit readiness platform'],
    },
    {
      period: '2010 - 2022',
      role: 'Engineer to Program Manager',
      org: 'ACTIVE Network, Cummins (TCS), Centaurus, Louisiana Tech, Dallas ISD',
      description: '16+ years from field technician to system engineer to program manager. System Engineer II at ACTIVE Network (release automation, QA, incident workflows). System Analyst at Cummins via TCS ($10M MES implementation, 400+ stations). Business Systems Analyst at Centaurus (Red Hat and AWS platform delivery). IP Strategist at Louisiana Tech (invention assessment and commercialization). Field Ops Lead at Dallas ISD (technology modernization in education).',
      achievements: ['$10M MES implementation', '400+ production stations deployed', 'Global business strategy competition top 3'],
    },
  ]

  const education = [
    { degree: 'M.Sc. Engineering & Technology Management', institution: 'Louisiana Tech University' },
    { degree: 'B.S. Computer & Information Systems Security', institution: 'Louisiana Tech University' },
    { degree: 'Six Sigma Green Belt', institution: 'Certified' },
    { degree: 'AI Ethics & Governance', institution: 'Additional Study' },
  ]

  const patents = [
    { name: 'Adversarial Project Twin', description: 'Drift and sabotage simulation framework that proactively identifies AI system vulnerabilities before production deployment.' },
    { name: 'AI Compliance Twin', description: 'Real-time regulatory enforcement engine that validates AI systems against EU AI Act, GDPR, and sector-specific compliance requirements.' },
    { name: 'Modular Audit Engine', description: 'AI fairness and transparency scoring with modular architecture. Provides audit-grade documentation for enterprise deployments.' },
    { name: 'Precision Drift Detector', description: 'Numerical anomaly detection for AI model performance monitoring. Identifies behavioral drift patterns before they affect business outcomes.' },
    { name: 'Compliance Fingerprint Layer', description: 'Tamper-evident traceability for AI decision-making. Creates immutable audit trails for regulatory compliance and forensic analysis.' },
  ]

  const competencies = [
    { icon: Shield, title: 'AI Governance & Compliance', items: ['EU AI Act, NIST AI RMF, ISO 42001, NYC LL 144, Texas TRAIGA', 'Model documentation, risk scoring, audit automation', 'Drift detection and behavioral monitoring', 'Governance structures for multi-application ecosystems'] },
    { icon: Briefcase, title: 'Enterprise Program & Portfolio Leadership', items: ['53 enterprise applications across education, manageability, conferencing', '50+ AI programs delivered with $50M+ portfolio oversight', 'Cross-functional alignment across 100+ stakeholders', 'Dependency management, release readiness, continuous improvement'] },
    { icon: Cpu, title: 'AI Architecture & Systems Design', items: ['Agentic AI systems, multi-agent orchestration, tool-use pipelines', 'RAG pipelines, vector databases, enterprise knowledge architectures', 'MCP servers, API orchestration, secure data connectors', 'Voice AI platforms, telephony, adaptive orchestration'] },
    { icon: Code2, title: 'Product Development & Commercialization', items: ['Founder of HAIEC (AI governance) and Kestrel Voice (AI communications)', 'Open-source tools including llmverify for LLM verification', 'Invention assessment and intellectual property evaluation', 'Technology commercialization from university research to market'] },
  ]

  const impactMetrics = [
    { value: '53', label: 'Applications Governed' },
    { value: '50+', label: 'AI Projects Delivered' },
    { value: '$50M+', label: 'Portfolio Oversight' },
    { value: '100+', label: 'Stakeholders Aligned' },
    { value: '5', label: 'Patent-Pending Frameworks' },
    { value: '400+', label: 'MES Stations Deployed' },
    { value: '16+', label: 'Years of Experience' },
    { value: '2', label: 'Companies Founded' },
  ]

  const coreSkills = [
    'AI Architecture', 'Agentic AI Systems', 'RAG Pipelines', 'MCP Integrations', 'Voice AI Operations',
    'AI Governance', 'EU AI Act', 'NIST AI RMF', 'ISO 42001', 'NYC LL 144', 'Texas TRAIGA',
    'Drift Detection', 'Audit Readiness', 'AI Risk Management', 'AI Assurance',
    'Enterprise Program Management', 'Portfolio Management', 'Stakeholder Alignment',
    'Risk Management', 'Release Readiness', 'Dependency Management', 'Executive Communication',
    'Cross-functional Leadership', 'Agile Delivery', 'Six Sigma', 'Continuous Improvement',
    'Python', 'TypeScript', 'Next.js', 'FastAPI', 'PostgreSQL', 'Vector Databases', 'Docker', 'CI/CD',
    'Manufacturing Execution Systems', 'Technology Commercialization', 'Intellectual Property',
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
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Hero
        subtitle="Person Profile"
        title={
          <>
            Subodh KC
            <br />
            <span className="gradient-text">Director of AI Programs | AI Systems Architect</span>
          </>
        }
        description="Sr. Program Manager at HP Inc. (Fortune 50). 16+ years building production AI systems at enterprise scale. Founder of KestrelVoice and HAIEC. 5 patent-pending frameworks. $50M+ portfolio oversight across 53 enterprise applications."
      />

      <Section subtitle="Biography" title="About Subodh KC">
        <div className="max-w-3xl mx-auto">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardDescription className="text-base leading-relaxed space-y-4">
                <p>
                  Subodh KC is a Director-level AI programs leader and AI Systems Architect currently serving as
                  Sr. Program Manager - AI Implementation & Governance at HP Inc., a Fortune 50 company. He
                  drives strategic AI transformation across enterprise systems and architects governance
                  frameworks that enable innovation without regulatory risk.
                </p>
                <p>
                  He manages a $50M+ technology portfolio spanning 53 enterprise applications, aligning 100+
                  stakeholders across product, engineering, quality, operations, vendors, risk functions, and
                  senior leadership. He is the founder of KestrelVoice, an AI voice operations platform, and
                  founder of HAIEC, an enterprise AI governance and compliance platform. He has developed 5
                  patent-pending methodologies for AI compliance, drift detection, and behavioral verification.
                </p>
                <p>
                  His career spans 16+ years from field technician to Fortune 50 AI strategy leader, with
                  experience across public-sector technology, manufacturing systems (Cummins, 400+ MES
                  stations), production reliability (ACTIVE Network), technology commercialization (Louisiana
                  Tech IP Office), and enterprise program leadership (HP Inc.). Born in Kathmandu, Nepal, he
                  holds an M.Sc. in Engineering & Technology Management and a B.S. in Computer & Information
                  Systems Security from Louisiana Tech University. He is based in Dallas-Fort Worth, Texas.
                </p>
                <p className="italic text-muted-foreground/80">
                  His name, Subodh, comes from Sanskrit: <strong className="not-italic text-foreground">su</strong> (good or easy) and <strong className="not-italic text-foreground">bodh</strong> (knowledge or understanding). It translates roughly to "one who understands easily" or "one who brings clear understanding."
                </p>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      <Section subtitle="Impact" title="Quantified Achievements" className="bg-secondary/20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {impactMetrics.map((metric, index) => (
            <Card key={index} className="text-center border-2 border-primary/20">
              <CardHeader>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{metric.value}</div>
                <CardTitle className="text-sm md:text-lg">{metric.label}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Section>

      <Section subtitle="Expertise" title="Core Competencies">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          {competencies.map((comp, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <comp.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{comp.title}</CardTitle>
                </div>
                <CardDescription className="text-sm space-y-1">
                  {comp.items.map((item, i) => (
                    <p key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </p>
                  ))}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Section>

      <Section subtitle="Career" title="Professional Timeline" className="bg-secondary/20">
        <div className="max-w-3xl mx-auto space-y-4">
          {career.map((item, index) => (
            <Card key={index} className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div className="w-full">
                    <p className="text-sm font-medium text-primary mb-1">{item.period}</p>
                    <CardTitle className="text-lg mb-1">{item.role}</CardTitle>
                    <p className="text-sm font-semibold text-foreground mb-2">{item.org}</p>
                    <CardDescription className="text-sm mb-3">{item.description}</CardDescription>
                    {item.achievements && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.achievements.map((ach, i) => (
                          <span key={i} className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                            <CheckCircle2 className="h-3 w-3" />
                            {ach}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Section>

      <Section subtitle="Skills" title="Technical & Leadership Skills">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2">
            {coreSkills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border border-border bg-card text-foreground hover:border-primary/40 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </Section>

      <Section subtitle="Education" title="Academic Background & Credentials" className="bg-secondary/20">
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

      <Section subtitle="Innovation" title="Patent-Pending Frameworks">
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

      <Section subtitle="Organizations" title="Founded & Co-Founded" className="bg-secondary/20">
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
                    <p className="text-xs text-primary mt-2">Founder</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Grid>
        </div>
      </Section>

      <Section subtitle="Compliance Guides" title="AI Compliance Law Guides">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-muted-foreground mb-6">
            Complete guides to the AI regulations that matter most - informed by the HAIEC compliance engine and Zenodo-published research.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/guides/texas-ai-law" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="text-base mb-2">Texas AI Law (TRAIGA)</CardTitle>
                  <CardDescription className="text-sm">
                    HB 149. Effective Jan 2026. Built on the HAIEC TRAIGA compliance engine.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/guides/eu-ai-act" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="text-base mb-2">EU AI Act</CardTitle>
                  <CardDescription className="text-sm">
                    Risk-tiered regulation. Mapped to the ISAF framework published in Zenodo.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/guides/nyc-local-law-144" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="text-base mb-2">NYC Local Law 144</CardTitle>
                  <CardDescription className="text-sm">
                    AEDT bias audits. Informed by deterministic bias detection research.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </Section>

      <CTA
        title="Open to Leadership Opportunities"
        description="Available for Director of AI Programs, Head of AI, VP of AI Strategy, Senior Program Manager, and fractional AI executive roles. Full-time, advisory, and fractional engagements considered."
        primaryButton={{ text: 'Get in Touch', href: '/contact' }}
        secondaryButton={{ text: 'View Executive Bio', href: '/executive-bio' }}
      />
    </>
  )
}
