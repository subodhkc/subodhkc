import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Section from '@/components/Section'
import { 
  Shield, 
  Briefcase, 
  Award, 
  TrendingUp, 
  Mail,
  Linkedin,
  Globe,
  MapPin,
  Code2,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Subodh KC | AI Advisor & Enterprise AI Governance Leader',
  description: 'Subodh KC is an AI advisor and enterprise AI governance leader with 12+ years across program leadership, AI governance, manufacturing reliability, and technology commercialization. 5 patent-pending AI compliance frameworks. Former Sr. Program Manager at HP Inc. (Fortune 50).',
  keywords: [
    'Subodh KC',
    'Subodh KC AI advisor',
    'AI Advisor',
    'AI advisor HEB',
    'AI advisor Dallas Fort Worth',
    'enterprise AI governance leader',
    'AI program management Fortune 50',
    'AI governance program manager',
    'patent-pending AI compliance frameworks',
    'AI drift detection frameworks',
    'enterprise AI portfolio management',
    'AI systems architect Dallas Fort Worth',
    'manufacturing AI reliability engineering',
    'Six Sigma AI program management',
    'technology commercialization AI',
    'AI transformation leader Texas',
    'fractional AI executive',
    'Director of AI Programs',
    'Head of AI',
    'VP of AI Strategy',
  ],
  alternates: {
    canonical: 'https://subodhkc.com/executive-bio',
  },
  openGraph: {
    title: 'Subodh KC | AI Advisor & Enterprise AI Governance Leader',
    description: '12+ years across program leadership, AI governance, manufacturing reliability, and technology commercialization. 5 patent-pending AI compliance frameworks. Former Sr. Program Manager at HP Inc. (Fortune 50).',
    url: 'https://subodhkc.com/executive-bio',
    type: 'profile',
    images: [
      {
        url: 'https://subodhkc.com/portrait.jpeg',
        width: 1200,
        height: 630,
        alt: 'Subodh KC | AI Advisor & Enterprise AI Governance Leader',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Subodh KC | AI Advisor & Enterprise AI Governance Leader',
    description: '12+ years across program leadership, AI governance, manufacturing reliability, and technology commercialization.',
  },
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Subodh KC',
  alternateName: ['Subodh K.C.', 'Subodh Khatri Chhetri', 'Subodh Kumar KC'],
  givenName: 'Subodh',
  familyName: 'KC',
  jobTitle: 'AI Advisor | Enterprise AI Strategy & Governance Leader',
  description: 'AI advisor and enterprise AI governance leader with 12+ years across technology, program and portfolio leadership, digital transformation, product development, continuous improvement, and AI governance.',
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
      name: 'AI Advisor & Enterprise AI Governance Consultant',
      occupationLocation: { '@type': 'Place', name: 'Dallas-Fort Worth, TX, United States' },
      startDate: '2026',
      description: 'Advising enterprises on AI governance, compliance, and production AI deployment. Helping organizations navigate EU AI Act, NIST AI RMF, ISO 42001, and emerging state regulations.',
    },
    {
      '@type': 'Occupation',
      name: 'Sr. Program Manager - AI Implementation & Governance',
      occupationLocation: { '@type': 'Place', name: 'HP Inc., United States' },
      startDate: '2025',
      endDate: '2026',
      description: 'Driving strategic AI transformation across enterprise systems. Architecting governance frameworks that enable innovation without regulatory risk.',
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
    description: 'Open to Director of AI Programs, Head of AI, VP of AI Strategy, Senior Program Manager, and fractional AI executive roles.',
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

      {/* Hero Section */}
      <section className="section-container py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            SUBODH KC
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground font-semibold mb-2">
            AI Advisor & Enterprise AI Governance Leader
          </p>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            12+ years across program leadership, AI governance, manufacturing reliability, and technology commercialization
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

      {/* Professional Bio */}
      <Section className="bg-secondary/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Professional Background</h2>
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Subodh KC is an AI advisor and enterprise AI governance leader with more than 12 years of experience across technology, program and portfolio leadership, digital transformation, product development, continuous improvement, and AI governance.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              His career has been built from the operational level up. He has worked across public-sector technology, manufacturing systems, production reliability, small-business transformation, enterprise software, and artificial intelligence. That range gives him a practical understanding of transformation from both sides: what leadership expects from an investment and what engineering and operations must do to make it work.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At HP, Subodh led complex enterprise technology programs across a portfolio of 53 applications and more than 100 stakeholders. His work brought together product, engineering, quality, operations, vendors, risk functions, and senior leadership. His responsibilities included portfolio planning, program execution, dependency management, release readiness, risk management, stakeholder alignment, executive communication, and continuous improvement across large-scale technology environments. He was promoted from Technical Program Manager to Sr. Program Manager during his tenure.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Earlier in his career, he worked in manufacturing technology and reliability engineering, including Manufacturing Execution System environments supporting more than 400 production stations. He has also worked with small and midsized businesses across Dallas-Fort Worth on technology implementation, business process improvement, automation, and program delivery. His experience at Louisiana Tech University's Office of Intellectual Property & Commercialization added exposure to invention assessment, intellectual property, market opportunity, and technology commercialization.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Subodh is also a founder and hands-on builder of applied AI systems. He created <Link href="/solutions/haiec" className="text-primary hover:underline font-semibold">HAIEC</Link>, an AI assurance and governance platform focused on evaluation, controls, evidence, monitoring, and responsible deployment. He also built <Link href="/solutions/kestrelvoice" className="text-primary hover:underline font-semibold">Kestrel Voice</Link>, an AI communications and workflow platform that combines voice agents, business knowledge, scheduling, automation, integrations, escalation, and operational controls. His open-source and research work includes <Link href="/products/llmverify" className="text-primary hover:underline font-semibold">llmverify</Link> and multiple patent-pending systems related to AI assurance, behavioral drift, traceability, compliance automation, and system monitoring.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              His work today sits at the intersection of <strong className="text-foreground">enterprise AI strategy, AI transformation, program and portfolio management, operating-model design, product and platform strategy, continuous improvement, technology commercialization, and AI governance</strong>.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Subodh holds a B.S. in Computer Information Systems and an M.S. in Engineering and Technology Management from Louisiana Tech University. He is a Six Sigma Green Belt with additional education in AI ethics and governance.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Based in Dallas-Fort Worth, Subodh advises enterprises on AI governance and compliance while building tools that make AI systems more observable, testable, and defensible. He is most effective in complex environments where strategy must become execution, multiple teams must move together, and new technology has to deliver measurable business value without losing operational discipline.
            </p>
          </div>
        </div>
      </Section>

      {/* Capabilities */}
      <Section>
        <h2 className="text-3xl font-bold mb-8 text-center">Areas of Expertise</h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>AI Governance & Compliance</CardTitle>
              <CardDescription className="text-base space-y-2">
                <p>Enterprise AI oversight aligned to EU AI Act, GDPR, NIST AI RMF, and NYC Local Law 144</p>
                <p>Model documentation, risk scoring, and audit automation</p>
                <p>Drift detection and behavioral monitoring for production AI systems</p>
                <p>Governance structures for multi-application enterprise ecosystems</p>
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Enterprise Program & Portfolio Leadership</CardTitle>
              <CardDescription className="text-base space-y-2">
                <p>Led 53 enterprise applications across education, manageability, and conferencing portfolios at HP</p>
                <p>50+ AI programs delivered with $50M+ in portfolio oversight</p>
                <p>Cross-functional alignment across 100+ stakeholders, vendors, and senior leadership</p>
                <p>Dependency management, release readiness, and continuous improvement at scale</p>
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Systems Architecture & Reliability</CardTitle>
              <CardDescription className="text-base space-y-2">
                <p>Designed AI systems serving enterprise scale across Fortune 50 platforms</p>
                <p>Built traceability, explainability, and compliance fingerprinting layers</p>
                <p>Manufacturing Execution System experience across 400+ production stations</p>
                <p>Operational risk, regulatory enforcement, and system integrity</p>
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Code2 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Product Development & Commercialization</CardTitle>
              <CardDescription className="text-base space-y-2">
                <p>Founder of HAIEC (AI governance) and Kestrel Voice (AI communications)</p>
                <p>Open-source tools including llmverify for LLM verification</p>
                <p>Invention assessment and intellectual property evaluation experience</p>
                <p>Technology commercialization from university research to market</p>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      {/* Career Timeline */}
      <Section className="bg-secondary/20">
        <h2 className="text-3xl font-bold mb-8 text-center">Career Highlights</h2>
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-xl">HP Inc. (Fortune 50) — Technical Program Manager → Sr. Program Manager (Promoted)</CardTitle>
              <CardDescription className="text-sm text-muted-foreground mb-4">2022 - 2026</CardDescription>
              <CardDescription className="text-base space-y-3">
                <p>
                  Joined HP as Technical Program Manager in 2022, promoted to Sr. Program Manager - AI Implementation & Governance in 2025. Led enterprise technology programs across a portfolio of 53 applications with 100+ stakeholders. Coordinated across product, engineering, quality, operations, vendors, risk functions, and senior leadership.
                </p>
                <p className="font-semibold text-foreground">Key contributions:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Orchestrating enterprise-wide AI rollouts with 100+ stakeholders</li>
                  <li>Managing a combined $50M+ AI and technology portfolio</li>
                  <li>Developing five patent-pending compliance and drift frameworks</li>
                  <li>Reducing audit preparation from months to weeks</li>
                  <li>Leading TPMs across education, manageability, and conferencing ecosystems</li>
                </ul>
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-xl">HAIEC - Founder & Chief Architect</CardTitle>
              <CardDescription className="text-sm text-muted-foreground mb-4">2020 - Present</CardDescription>
              <CardDescription className="text-base space-y-3">
                <p>
                  Built HAIEC as an AI assurance and governance platform focused on evaluation, controls, evidence, monitoring, and responsible deployment. The platform introduced an AI Governance Execution Framework with six operational functions, a forensic audit toolkit for compliance blind spots, and modernization pathways for legacy systems.
                </p>
                <p>Used by enterprise teams to turn regulatory pressure into operational maturity.</p>
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-xl">Kestrel Voice - Founder</CardTitle>
              <CardDescription className="text-sm text-muted-foreground mb-4">2023 - Present</CardDescription>
              <CardDescription className="text-base space-y-3">
                <p>
                  Built an AI communications and workflow platform combining voice agents, business knowledge, scheduling, automation, integrations, escalation, and operational controls. The platform confronts real deployment challenges: latency, integration failures, customer expectations, data boundaries, and knowing when automation should hand responsibility back to a person.
                </p>
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-xl">Earlier Technical Roles</CardTitle>
              <CardDescription className="text-base space-y-2">
                <p>ACTIVE Network - System Engineer II: Release automation, QA, incident workflows</p>
                <p>Cummins (via TCS) - System Analyst: $10M MES implementation, 400+ stations deployed</p>
                <p>Centaurus - Business Systems Analyst: Red Hat & AWS platform delivery</p>
                <p>Louisiana Tech University - IP Strategist: Invention assessment and commercialization</p>
                <p>Dallas ISD - Field Ops Lead: Technology modernization in education environments</p>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      {/* Measurable Impact */}
      <Section>
        <h2 className="text-3xl font-bold mb-8 text-center">Quantified Impact</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <Card className="text-center border-2 border-primary/20">
            <CardHeader>
              <div className="text-5xl font-bold text-primary mb-2">53</div>
              <CardTitle className="text-lg">Applications Governed</CardTitle>
            </CardHeader>
          </Card>

          <Card className="text-center border-2 border-primary/20">
            <CardHeader>
              <div className="text-5xl font-bold text-primary mb-2">50+</div>
              <CardTitle className="text-lg">AI Projects Delivered</CardTitle>
            </CardHeader>
          </Card>

          <Card className="text-center border-2 border-primary/20">
            <CardHeader>
              <div className="text-5xl font-bold text-primary mb-2">$50M+</div>
              <CardTitle className="text-lg">Portfolio Oversight</CardTitle>
            </CardHeader>
          </Card>

          <Card className="text-center border-2 border-primary/20">
            <CardHeader>
              <div className="text-5xl font-bold text-primary mb-2">100+</div>
              <CardTitle className="text-lg">Stakeholders Aligned</CardTitle>
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
              <div className="text-5xl font-bold text-primary mb-2">400+</div>
              <CardTitle className="text-lg">MES Stations Deployed</CardTitle>
            </CardHeader>
          </Card>

          <Card className="text-center border-2 border-primary/20">
            <CardHeader>
              <div className="text-5xl font-bold text-primary mb-2">12+</div>
              <CardTitle className="text-lg">Years of Experience</CardTitle>
            </CardHeader>
          </Card>

          <Card className="text-center border-2 border-primary/20">
            <CardHeader>
              <div className="text-5xl font-bold text-primary mb-2">2</div>
              <CardTitle className="text-lg">Companies Founded</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </Section>

      {/* Patent-Pending Frameworks */}
      <Section className="bg-secondary/20">
        <h2 className="text-3xl font-bold mb-8 text-center">Patent-Pending Frameworks</h2>
        <div className="max-w-4xl mx-auto space-y-4">
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
                Real-time regulatory enforcement engine that validates AI systems against EU AI Act, GDPR, and sector-specific compliance requirements.
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
                AI fairness and transparency scoring system with modular architecture. Provides audit-grade documentation for enterprise deployments.
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
      </Section>

      {/* Education & Credentials */}
      <Section>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Education & Credentials</h2>
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardDescription className="text-base space-y-3">
                <p><strong className="text-foreground">M.S. Engineering and Technology Management</strong> — Louisiana Tech University</p>
                <p><strong className="text-foreground">B.S. Computer Information Systems</strong> — Louisiana Tech University</p>
                <p><strong className="text-foreground">Six Sigma Green Belt</strong> — Certified</p>
                <p>Additional education in AI ethics and governance</p>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      {/* CSM Framework */}
      <Section className="bg-secondary/20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Cognitive Systems Management (CSM)</h2>
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardDescription className="text-base space-y-3">
                <p>
                  Subodh developed Cognitive Systems Management (CSM), a governance methodology with four domains:
                  CSM-Enterprise, CSM-Project, CSM-Code, and CSM-UX. Six execution functions span purpose, mapping,
                  risk, delivery, oversight, and compliance.
                </p>
                <p>
                  CSM 2.0 (spec version 2.0.0) extends the original 2025 publication with machine-readable contracts
                  and 16 governance components for enterprise AI deployment.
                </p>
                <Link href="/cognitive-systems-management" className="text-primary hover:underline">Explore the framework →</Link>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      {/* Personal Note */}
      <Section className="bg-primary/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Personal Note</h2>
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              His name, Subodh, comes from Sanskrit: <strong className="text-foreground">su</strong> (good) and <strong className="text-foreground">bodh</strong> (understanding). He has always treated it as a professional obligation, not just a label.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              He started in technology fixing computers in underfunded schools. That work taught him something he carries into every program he leads today: technology succeeds only when it works inside the institution that depends on it. A broken system in a classroom is not an abstract problem. It affects real people trying to do their jobs.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              That principle scaled from school districts to manufacturing floors to Fortune 50 engineering organizations. The systems got larger. The stakes got higher. The core question stayed the same: does this actually work for the people who depend on it?
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              AI adds a new dimension to that question. When a system can make decisions that affect people's lives, the obligation to govern it properly is not optional. Hidden bias, silent drift, and ungoverned automated decisions are not theoretical risks. They are operational failures waiting for the right conditions.
            </p>
            <p className="text-lg text-foreground font-semibold leading-relaxed text-center py-4">
              If a system can harm people, it must be governed as seriously as it is engineered.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed text-center">
              That is the standard he holds for his own work and the standard he brings to every organization he works with.
            </p>
          </div>
        </div>
      </Section>

      {/* Contact CTA */}
      <Section>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Connect</h2>
          <p className="text-lg text-muted-foreground mb-8">
            For advisory, consulting, or leadership opportunities, reach out through any of the channels below.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="gap-2">
                <Mail className="h-5 w-5" />
                Get in Touch
              </Button>
            </Link>
            <a href="https://linkedin.com/in/subodhkc" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="gap-2">
                <Linkedin className="h-5 w-5" />
                Connect on LinkedIn
              </Button>
            </a>
            <Link href="/portfolio">
              <Button size="lg" variant="outline" className="gap-2">
                <Globe className="h-5 w-5" />
                View Portfolio
              </Button>
            </Link>
          </div>

          <div className="text-center mt-8">
            <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Page →</Link>
            <span className="mx-2 text-muted-foreground/30">|</span>
            <Link href="/person/subodh-kc" className="text-sm text-muted-foreground hover:text-primary transition-colors">Person Profile →</Link>
          </div>
        </div>
      </Section>
    </>
  )
}
