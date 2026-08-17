import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Section from '@/components/Section'
import Grid from '@/components/Grid'
import {
  Shield,
  Briefcase,
  Award,
  Mail,
  Linkedin,
  Globe,
  MapPin,
  Code2,
  TrendingUp,
  Mic,
  Github,
  ArrowRight,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Executive Bio | Subodh KC - AI Advisor & AI Systems Architect',
  description: 'Subodh KC is an AI advisor and AI systems architect with 16+ years across program leadership, production AI systems, manufacturing reliability, and technology commercialization. 5 patent-pending AI assurance frameworks. Former Sr. Program Manager at HP Inc. (Fortune 50).',
  keywords: [
    'Subodh KC',
    'Subodh KC AI advisor',
    'AI Advisor',
    'AI advisor HEB',
    'AI advisor Dallas Fort Worth',
    'AI systems architect enterprise',
    'AI program management Fortune 50',
    'AI governance program manager',
    'patent-pending AI compliance frameworks',
    'AI drift detection frameworks',
    'enterprise AI portfolio management',
    'AI systems architect Dallas Fort Worth',
    'manufacturing AI reliability engineering',
    'Six Sigma AI program management',
    'technology commercialization AI',
    'fractional AI executive',
    'Director of AI Programs',
    'Head of AI',
    'VP of AI Strategy',
    'AI assurance',
    'production AI deployment',
  ],
  alternates: {
    canonical: 'https://subodhkc.com/executive-bio',
  },
  openGraph: {
    title: 'Executive Bio | Subodh KC - AI Advisor & AI Systems Architect',
    description: '16+ years across program leadership, production AI systems, manufacturing reliability, and technology commercialization. 5 patent-pending AI assurance frameworks. Former Sr. Program Manager at HP Inc. (Fortune 50).',
    url: 'https://subodhkc.com/executive-bio',
    type: 'profile',
    images: [
      {
        url: 'https://subodhkc.com/portrait.jpeg',
        width: 1200,
        height: 630,
        alt: 'Subodh KC | AI Advisor & AI Systems Architect',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Executive Bio | Subodh KC - AI Advisor & AI Systems Architect',
    description: '16+ years across program leadership, production AI systems, manufacturing reliability, and technology commercialization.',
  },
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Subodh KC',
  alternateName: ['Subodh K.C.', 'Subodh Khatri Chhetri', 'Subodh Kumar KC'],
  givenName: 'Subodh',
  familyName: 'KC',
  jobTitle: 'AI Advisor | AI Systems Architect',
  description: 'AI advisor and AI systems architect with 16+ years across technology, program and portfolio leadership, product development, continuous improvement, and production AI systems.',
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
    'Enterprise AI Strategy',
    'AI Governance',
    'AI Program Management',
    'AI Compliance Frameworks',
    'Drift Detection',
    'Manufacturing Execution Systems',
    'Technology Commercialization',
    'Portfolio Management',
    'Continuous Improvement',
    'AI Assurance',
    'AI Architecture',
    'Agentic AI Systems',
    'RAG & Enterprise Knowledge Systems',
    'MCP & API Integrations',
    'Voice AI Operations',
    'EU AI Act',
    'NIST AI RMF',
    'ISO 42001',
    'NYC Local Law 144',
    'Texas TRAIGA (HB 149)',
    'AI Regulatory Compliance',
    'Audit Readiness',
    'AI Risk Management',
    'Production AI Deployment',
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
      name: 'AI Advisor & AI Systems Architect',
      occupationLocation: { '@type': 'Place', name: 'Dallas-Fort Worth, TX, United States' },
      description: 'Advising organizations on AI opportunity discovery, decisions, architecture, and production AI deployment. From possibility to decision, from decision to production.',
    },
    {
      '@type': 'Occupation',
      name: 'Sr. Program Manager - AI Implementation & Governance',
      occupationLocation: { '@type': 'Place', name: 'HP Inc., United States' },
      startDate: '2025',
      endDate: '2026',
      description: 'Driving strategic AI implementation across enterprise systems. Architecting governance frameworks that enable innovation without regulatory risk.',
    },
    {
      '@type': 'Occupation',
      name: 'Core Team Lead - Platform Enabling Applications',
      occupationLocation: { '@type': 'Place', name: 'HP Inc., United States' },
      startDate: '2023',
      endDate: '2025',
      description: 'Led the core team for platform enabling applications, coordinating across product, engineering, quality, and operations.',
    },
    {
      '@type': 'Occupation',
      name: 'Technical Program Manager',
      occupationLocation: { '@type': 'Place', name: 'HP Inc., United States' },
      startDate: '2022',
      endDate: '2025',
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
      description: 'MES implementation across 400+ production stations.',
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
      name: 'B.S. Computer Information Systems',
      recognizedBy: { '@type': 'CollegeOrUniversity', name: 'Louisiana Tech University' },
    },
    {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'certification',
      name: 'Six Sigma Green Belt',
    },
  ],
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Louisiana Tech University',
  },
  founder: [
    {
      '@type': 'Organization',
      name: 'HAIEC',
      url: 'https://haiec.com',
      description: 'AI assurance and governance platform',
    },
    {
      '@type': 'Organization',
      name: 'Kestrel Voice',
      url: 'https://kestrelvoice.com',
      description: 'AI communications and workflow platform',
    },
  ],
  award: ["Dean's Honor List", "President's Honor List", 'University Coding Competition Winner', 'Global Business Strategy Competition - Top 3 Global'],
  knowsLanguage: ['English', 'Nepali'],
  nationality: { '@type': 'Country', name: 'United States' },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Dallas-Fort Worth',
    addressRegion: 'TX',
    addressCountry: 'US',
  },
  seeks: {
    '@type': 'Demand',
    description: 'Open to Director of AI Programs, Head of AI, VP of AI Strategy, Senior Program Manager, advisory, and board opportunities.',
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://subodhkc.com/executive-bio',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'Executive Bio', item: 'https://subodhkc.com/executive-bio' },
  ],
}

export default function ExecutiveBioPage() {
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
      <section className="section-container py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Subodh KC
          </h1>

          <p className="text-xl md:text-2xl text-foreground font-semibold mb-2">
            AI Advisor + AI Systems Architect
          </p>

          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Program leadership · Production AI systems · Manufacturing reliability · Technology commercialization
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <a href="mailto:subodhkc@subodhkc.com">
              <Button variant="outline" className="gap-2">
                <Mail className="h-4 w-4" />
                subodhkc@subodhkc.com
              </Button>
            </a>
            <a href="https://linkedin.com/in/subodhkc" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Button>
            </a>
            <a href="https://subodhkc.com">
              <Button variant="outline" className="gap-2">
                <Globe className="h-4 w-4" />
                subodhkc.com
              </Button>
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Dallas-Fort Worth, TX
            </span>
          </div>
        </div>
      </section>

      {/* Short Bio */}
      <Section className="bg-secondary/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Short Bio</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Subodh KC is an AI advisor and AI systems architect based in Dallas-Fort Worth, TX. Over 16+ years he has led enterprise technology programs, production AI systems, manufacturing reliability, and technology commercialization. He advises leaders on AI opportunity, decisions, and architecture while building tools that make AI systems observable, testable, and defensible. His work spans HP Inc. (Fortune 50), founder-led AI products, and patent-pending assurance frameworks. He holds an M.S. in Engineering and Technology Management from Louisiana Tech University and is a Six Sigma Green Belt.
          </p>
        </div>
      </Section>

      {/* Executive Bio */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Executive Bio</h2>
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Subodh KC is an AI advisor and AI systems architect with 16+ years across technology, program and portfolio leadership, product development, continuous improvement, and production AI systems. He turns AI ambiguity into possibilities, evidence-backed decisions, and systems organizations can actually operate.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              His career has been built from the operational level up. He has worked across public-sector technology, manufacturing systems, production reliability, small-business transformation, enterprise software, and artificial intelligence. That range gives him a practical understanding of transformation from both sides: what leadership expects from an investment and what engineering and operations must do to make it work.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At HP Inc. (Fortune 50), Subodh led enterprise technology programs across a portfolio of 53 applications. He joined as Technical Program Manager in 2022, served as Core Team Lead for Platform Enabling Applications, and was promoted to Sr. Program Manager, AI Implementation & Governance in 2025. His work brought together product, engineering, quality, operations, vendors, risk functions, and senior leadership. His responsibilities included portfolio planning, program execution, dependency management, release readiness, risk management, stakeholder alignment, executive communication, and continuous improvement across large-scale technology environments.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Earlier in his career, he worked in manufacturing technology and reliability engineering, including Manufacturing Execution System environments supporting more than 400 production stations. He has also worked with small and midsized businesses across Dallas-Fort Worth on technology implementation, business process improvement, automation, and program delivery. His experience at Louisiana Tech University's Office of Intellectual Property & Commercialization added exposure to invention assessment, intellectual property, market opportunity, and technology commercialization.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Subodh is also a founder and hands-on builder of applied AI systems. He created <Link href="/solutions/haiec" className="text-primary hover:underline font-semibold">HAIEC</Link>, an AI assurance and governance platform focused on evaluation, controls, evidence, monitoring, and responsible deployment. He also built <Link href="/solutions/kestrelvoice" className="text-primary hover:underline font-semibold">Kestrel Voice</Link>, an AI communications and workflow platform that combines voice agents, business knowledge, scheduling, automation, integrations, escalation, and operational controls. His open-source and research work includes <Link href="/products/llmverify" className="text-primary hover:underline font-semibold">llmverify</Link> and five patent-pending systems related to AI assurance, behavioral drift, traceability, compliance automation, and system monitoring.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              He developed Cognitive Systems Management (CSM), a governance methodology with four domains and six execution functions, published in 2025 and extended in CSM 2.0 with machine-readable contracts and 16 governance components for enterprise AI deployment.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Subodh holds a B.S. in Computer Information Systems and an M.S. in Engineering and Technology Management from Louisiana Tech University. He is a Six Sigma Green Belt with additional education in AI ethics and governance. Based in Dallas-Fort Worth, he advises leaders, founders, and technical teams on AI opportunity discovery, decisions, and architecture while building tools that make AI systems more observable, testable, and defensible.
            </p>
          </div>
        </div>
      </Section>

      {/* Career Highlights */}
      <Section className="bg-secondary/20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Career Highlights</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="text-center border-2 border-primary/20">
              <CardHeader>
                <div className="text-5xl font-bold text-primary mb-2">83+</div>
                <CardTitle className="text-lg">Projects Delivered</CardTitle>
              </CardHeader>
            </Card>

            <Card className="text-center border-2 border-primary/20">
              <CardHeader>
                <div className="text-5xl font-bold text-primary mb-2">53</div>
                <CardTitle className="text-lg">Enterprise Applications</CardTitle>
              </CardHeader>
            </Card>

            <Card className="text-center border-2 border-primary/20">
              <CardHeader>
                <div className="text-5xl font-bold text-primary mb-2">400+</div>
                <CardTitle className="text-lg">MES Stations</CardTitle>
              </CardHeader>
            </Card>

            <Card className="text-center border-2 border-primary/20">
              <CardHeader>
                <div className="text-5xl font-bold text-primary mb-2">5</div>
                <CardTitle className="text-lg">Patent-Pending Frameworks</CardTitle>
              </CardHeader>
            </Card>

            <Card className="text-center border-2 border-primary/20">
              <CardHeader>
                <div className="text-5xl font-bold text-primary mb-2">16+</div>
                <CardTitle className="text-lg">Years Experience</CardTitle>
              </CardHeader>
            </Card>

            <Card className="text-center border-2 border-primary/20">
              <CardHeader>
                <div className="text-5xl font-bold text-primary mb-2">2</div>
                <CardTitle className="text-lg">Companies Founded</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>
      </Section>

      {/* Career Timeline */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Career Timeline</h2>
          <div className="space-y-4">
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="text-xl">AI Advisor & AI Systems Architect</CardTitle>
                <CardDescription className="text-sm text-muted-foreground mb-2">Present</CardDescription>
                <CardDescription className="text-base">
                  Advising organizations on AI opportunity discovery, decisions, architecture, and production AI deployment. Independent practice based in Dallas-Fort Worth, TX.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="text-xl">HP Inc. (Fortune 50) · Sr. Program Manager, AI Implementation & Governance</CardTitle>
                <CardDescription className="text-sm text-muted-foreground mb-2">2025 · 2026</CardDescription>
                <CardDescription className="text-base">
                  Led strategic AI implementation across enterprise systems. Architected governance frameworks aligned to EU AI Act, NIST AI RMF, and ISO 42001. Coordinated across product, engineering, quality, operations, vendors, risk functions, and senior leadership.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="text-xl">HP Inc. (Fortune 50) · Core Team Lead, Platform Enabling Applications</CardTitle>
                <CardDescription className="text-sm text-muted-foreground mb-2">2023 · 2025</CardDescription>
                <CardDescription className="text-base">
                  Led the core team for platform enabling applications. Coordinated delivery across product, engineering, quality, and operations for the education, manageability, and conferencing portfolios.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="text-xl">HP Inc. (Fortune 50) · Technical Program Manager</CardTitle>
                <CardDescription className="text-sm text-muted-foreground mb-2">2022 · 2025</CardDescription>
                <CardDescription className="text-base">
                  Directed development and release cycles for 53 enterprise applications. Led cross-functional teams through Agile delivery at Fortune 50 scale. Managed dependency, release readiness, risk, and stakeholder alignment.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="text-xl">Founder · HAIEC</CardTitle>
                <CardDescription className="text-sm text-muted-foreground mb-2">2020 · Present</CardDescription>
                <CardDescription className="text-base">
                  Built HAIEC as an AI assurance and governance platform focused on evaluation, controls, evidence, monitoring, and responsible deployment. Includes an AI Governance Execution Framework, a forensic audit toolkit, and modernization pathways for legacy systems.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="text-xl">Founder · KestrelVoice</CardTitle>
                <CardDescription className="text-sm text-muted-foreground mb-2">2023 · Present</CardDescription>
                <CardDescription className="text-base">
                  Built an AI communications and workflow platform combining voice agents, business knowledge, scheduling, automation, integrations, escalation, and operational controls. Addresses latency, integration failures, data boundaries, and escalation to human responsibility.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="text-xl">Earlier Technical Roles</CardTitle>
                <CardDescription className="text-base space-y-2">
                  <p>ACTIVE Network · System Engineer II: Release automation, QA, incident workflows, production reliability</p>
                  <p>Cummins (via TCS) · System Analyst: MES implementation across 400+ production stations</p>
                  <p>Centaurus · Business Systems Analyst: Red Hat & AWS platform delivery</p>
                  <p>Louisiana Tech University · IP Strategist: Invention assessment and commercialization</p>
                  <p>Dallas ISD · Field Ops Lead: Technology modernization in education environments</p>
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="text-xl">Education & Certification</CardTitle>
                <CardDescription className="text-base space-y-2">
                  <p>M.S. Engineering & Technology Management · Louisiana Tech University</p>
                  <p>B.S. Computer Information Systems · Louisiana Tech University</p>
                  <p>Six Sigma Green Belt</p>
                  <p>Additional education in AI ethics and governance</p>
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </Section>

      {/* Current Work */}
      <Section className="bg-secondary/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Current Work</h2>
          <div className="space-y-4">
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  AI Advisory & Systems Architecture
                </CardTitle>
                <CardDescription className="text-base">
                  Advises leaders, founders, and technical teams on AI opportunity discovery, evidence-backed decisions, and architecture. Focuses on environments where strategy must become execution and multiple teams must move together.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  HAIEC · AI Assurance & Governance Platform
                </CardTitle>
                <CardDescription className="text-base">
                  Founder and chief architect. Platform for evaluation, controls, evidence, monitoring, and responsible deployment of AI systems. Supports CSM governance activities and audit readiness.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-primary" />
                  KestrelVoice · AI Communications & Workflow Platform
                </CardTitle>
                <CardDescription className="text-base">
                  Founder. Combines voice agents, business knowledge, scheduling, automation, integrations, escalation, and operational controls. Addresses real deployment challenges: latency, integration failures, data boundaries, and human escalation.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Open Source & Research
                </CardTitle>
                <CardDescription className="text-base">
                  Open-source tools including <Link href="/products/llmverify" className="text-primary hover:underline">llmverify</Link> for LLM verification. Five patent-pending systems related to AI assurance, behavioral drift, traceability, compliance automation, and system monitoring. Published Cognitive Systems Management (CSM) methodology in 2025, extended as CSM 2.0.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </Section>

      {/* Areas of Work */}
      <Section>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Areas of Work</h2>
          <Grid cols={2} gap="md">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>AI Opportunity & Strategy</CardTitle>
                <CardDescription className="text-base">
                  AI opportunity discovery, evidence-backed decision support, and strategy translation into executable programs. Helps leadership move from possibility to decision with defensible reasoning.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Code2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>AI Systems Architecture</CardTitle>
                <CardDescription className="text-base">
                  Architecture for agentic AI, RAG pipelines, MCP integrations, and voice AI operations. Designs systems that are observable, testable, and operable in production.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Program & Portfolio Leadership</CardTitle>
                <CardDescription className="text-base">
                  Enterprise program and portfolio management across 53 applications. Dependency management, release readiness, stakeholder alignment, and continuous improvement at Fortune 50 scale.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Production AI</CardTitle>
                <CardDescription className="text-base">
                  Production deployment of AI systems with monitoring, drift detection, and operational controls. Manufacturing reliability discipline applied to AI operations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Governance & Risk</CardTitle>
                <CardDescription className="text-base">
                  AI governance aligned to EU AI Act, NIST AI RMF, ISO 42001, NYC Local Law 144, and Texas TRAIGA. Audit readiness, risk scoring, and compliance automation.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Technical Decision Support</CardTitle>
                <CardDescription className="text-base">
                  Evidence-oriented technical decision support for executives and boards. Build vs. buy analysis, vendor evaluation, architecture review, and risk assessment with honest uncertainty.
                </CardDescription>
              </CardHeader>
            </Card>
          </Grid>
        </div>
      </Section>

      {/* Patent-Pending Frameworks */}
      <Section className="bg-secondary/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Patent-Pending Frameworks</h2>
          <div className="space-y-4">
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Adversarial Project Twin
                </CardTitle>
                <CardDescription className="text-base">
                  Drift and sabotage simulation framework that identifies AI system vulnerabilities before production deployment.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Precision Drift Detector
                </CardTitle>
                <CardDescription className="text-base">
                  Numerical anomaly detection system for AI model performance monitoring. Identifies behavioral drift patterns before they affect business outcomes.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  AI Compliance Twin
                </CardTitle>
                <CardDescription className="text-base">
                  Regulatory enforcement engine that validates AI systems against EU AI Act, GDPR, and sector-specific compliance requirements.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Modular Audit Engine
                </CardTitle>
                <CardDescription className="text-base">
                  AI fairness and transparency scoring system with modular architecture. Provides evidence-grade documentation for enterprise deployments.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Compliance Fingerprint Layer
                </CardTitle>
                <CardDescription className="text-base">
                  Tamper-evident traceability system for AI decision-making. Creates immutable audit trails for regulatory compliance and forensic analysis.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </Section>

      {/* Speaking & Media Bio */}
      <Section>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Speaking & Media Bio</h2>
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardDescription className="text-base space-y-4">
                <p className="text-foreground font-semibold flex items-center gap-2">
                  <Mic className="h-5 w-5 text-primary" />
                  Short reusable boilerplate
                </p>
                <p>
                  Subodh KC is an AI advisor and AI systems architect based in Dallas-Fort Worth, TX. He has 16+ years across enterprise program leadership, production AI systems, manufacturing reliability, and technology commercialization. He is a former Sr. Program Manager at HP Inc. (Fortune 50), founder of HAIEC and KestrelVoice, and author of five patent-pending AI assurance frameworks. He holds an M.S. in Engineering and Technology Management from Louisiana Tech University and is a Six Sigma Green Belt. He speaks on AI governance, production AI reliability, program leadership, and the operational discipline required to deploy AI that works.
                </p>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      {/* Links */}
      <Section className="bg-secondary/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Links</h2>
          <p className="text-lg text-muted-foreground mb-8">
            For recruiters, executive search, journalists, conference organizers, partners, and board or advisory opportunities.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/portfolio">
              <Button size="lg" variant="outline" className="gap-2">
                <Globe className="h-5 w-5" />
                Portfolio
              </Button>
            </Link>
            <Link href="/speaking">
              <Button size="lg" variant="outline" className="gap-2">
                <Mic className="h-5 w-5" />
                Speaking
              </Button>
            </Link>
            <a href="https://linkedin.com/in/subodhkc" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="gap-2">
                <Linkedin className="h-5 w-5" />
                LinkedIn
              </Button>
            </a>
            <a href="https://github.com/subodhkc" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="gap-2">
                <Github className="h-5 w-5" />
                GitHub
              </Button>
            </a>
            <a href="https://frontofai.com" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="gap-2">
                <ArrowRight className="h-5 w-5" />
                Discuss AI
              </Button>
            </a>
          </div>

          <div className="text-center mt-8">
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1">
              <Mail className="h-4 w-4" />
              subodhkc@subodhkc.com
            </Link>
            <span className="mx-2 text-muted-foreground/30">·</span>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Page</Link>
            <span className="mx-2 text-muted-foreground/30">·</span>
            <Link href="/person/subodh-kc" className="text-sm text-muted-foreground hover:text-primary transition-colors">Person Profile</Link>
          </div>
        </div>
      </Section>
    </>
  )
}
