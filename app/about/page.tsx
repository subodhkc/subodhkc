import Link from 'next/link'
import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Grid from '@/components/Grid'
import { Award, GraduationCap, Briefcase, Heart, Shield, CheckCircle2, TrendingUp, Zap, Users, BookOpen, User, Newspaper, MapPin, Code2 } from 'lucide-react'

export const metadata = {
  title: 'About Subodh KC | AI Advisor & Enterprise AI Governance Leader',
  description:
    'Subodh KC is an AI advisor and enterprise AI governance leader with 12+ years across program leadership, manufacturing reliability, technology commercialization, and AI governance. Founder of HAIEC and Kestrel Voice. 5 patent-pending frameworks.',
  keywords: [
    'Subodh KC',
    'Subodh KC AI advisor',
    'AI Advisor',
    'AI advisor HEB',
    'AI advisor Dallas Fort Worth',
    'enterprise AI governance leader',
    'AI program management Fortune 50',
    'HP Inc AI program manager',
    'HAIEC founder',
    'Kestrel Voice founder',
    'AI drift detection frameworks',
    'manufacturing AI reliability engineering',
    'technology commercialization AI',
    'AI transformation leader Dallas Fort Worth',
    'Six Sigma AI program management',
    'AI compliance frameworks inventor',
    'fractional AI executive',
    'Director of AI Programs',
    'Head of AI',
    'VP of AI Strategy',
  ],
  alternates: {
    canonical: 'https://subodhkc.com/about',
  },
  openGraph: {
    title: 'About Subodh KC | AI Advisor & Enterprise AI Governance Leader',
    description:
      '12+ years across program leadership, manufacturing reliability, technology commercialization, and AI governance. Founder of HAIEC and Kestrel Voice. 5 patent-pending frameworks.',
    url: 'https://subodhkc.com/about',
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
    title: 'About Subodh KC | AI Advisor & Enterprise AI Governance Leader',
    description: '12+ years across program leadership, AI governance, manufacturing reliability, and technology commercialization.',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'About', item: 'https://subodhkc.com/about' },
  ],
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
  email: 'admin@subodhkc.com',
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
    '@id': 'https://subodhkc.com/about',
  },
}

export default function AboutPage() {
  const values = [
    {
      icon: Briefcase,
      title: 'Strategic Execution',
      description:
        'Complex problems require surgical precision. He builds systems and frameworks that work at scale.',
    },
    {
      icon: Award,
      title: 'Standards as Baseline',
      description:
        'From academic scholarships to enterprise leadership, high standards are the starting point, not the goal.',
    },
    {
      icon: GraduationCap,
      title: 'Continuous Learning',
      description:
        'Technology evolves. Regulations shift. Markets transform. Sustained leadership requires relentless learning and adaptation.',
    },
    {
      icon: Heart,
      title: 'Impact Over Activity',
      description:
        'The number of programs shipped matters less than the problems solved and value created.',
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <Hero
        subtitle="About"
        title={
          <>
            Understand how things work.
            <br />
            <span className="gradient-text">Improve what can be improved.</span>
          </>
        }
        description="12+ years across public-sector technology, manufacturing reliability, small-business transformation, enterprise program leadership, and AI governance. The scale changes. The work does not."
      />

      <Section
        subtitle="The Story"
        title="From Field Operations to AI Governance"
        description="The scale of the systems has changed. The underlying work has not."
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Subodh KC has built his career around <strong className="text-foreground">continuous improvement</strong>: understanding how systems work, finding where they break down, and building better ways for people and organizations to operate.
          </p>
          <p className="text-base text-muted-foreground/80 leading-relaxed">
            That instinct has carried him through public-sector technology, manufacturing, intellectual property and commercialization, small-business transformation, enterprise program leadership, artificial intelligence, entrepreneurship, research, and community involvement.
          </p>
          <p className="text-base text-muted-foreground/80 leading-relaxed">
            Long before AI became the center of his work, he was interested in the relationship between technology and practical outcomes.
          </p>

          <div className="mt-6 p-5 rounded-lg bg-muted/30 border border-border/50">
            <p className="text-base text-muted-foreground/80 leading-relaxed italic">
              His name, Subodh, comes from Sanskrit: <strong className="not-italic text-foreground">su</strong> (good or easy) and <strong className="not-italic text-foreground">bodh</strong> (knowledge or understanding). It translates roughly to "one who understands easily" or "one who brings clear understanding." He has always treated it as a professional obligation, not just a label.
            </p>
          </div>

          <div className="border-l-2 border-primary/30 pl-6 mt-8">
            <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              Education and Early Lessons
            </h3>
            <p className="text-base text-muted-foreground/80 leading-relaxed mb-4">
              While earning his undergraduate degree in Computer Information Systems, Subodh balanced school with remote technology work that helped pay for college. He earned academic scholarships, appeared on the President's and Dean's Lists, and won a university coding competition. But some of his most formative experiences happened outside the classroom.
            </p>
            <p className="text-base text-muted-foreground/80 leading-relaxed mb-4">
              In a global business strategy competition involving tens of thousands of university students, he helped lead Louisiana Tech to a top-three global ranking, at the time the university's strongest performance in the competition. The experience reinforced something that would become increasingly important in his career: technical ability mattered, but strategy, resource allocation, competitive positioning, and execution determined the outcome.
            </p>
            <p className="text-base text-muted-foreground/80 leading-relaxed">
              He later served as Secretary of Louisiana Tech's Graduate Student Council while completing his M.S. in Engineering and Technology Management, adding another dimension to an education that increasingly sat between engineering, business, and organizational leadership.
            </p>
          </div>

          <div className="border-l-2 border-primary/30 pl-6 mt-8">
            <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              Starting Close to the People Using Technology
            </h3>
            <p className="text-base text-muted-foreground/80 leading-relaxed mb-4">
              His professional career began close to the people using technology. Working in Dallas-area education environments, including Dallas ISD during the No Child Left Behind era, he supported distributed technology operations where failures were not abstract technical problems. They affected classrooms, administrators, teachers, and students. It was an early lesson in a principle that would follow him throughout his career: technology succeeds only when it works inside the institution that depends on it.
            </p>
            <p className="text-base text-muted-foreground/80 leading-relaxed mb-4">
              At Louisiana Tech, he later worked with the university's <strong className="text-foreground">Office of Intellectual Property and Commercialization</strong>, gaining exposure to another side of technology: evaluating inventions not only for their technical merit, but for their potential application, market relevance, intellectual property value, and path to commercialization.
            </p>
          </div>

          <div className="border-l-2 border-primary/30 pl-6 mt-8">
            <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Manufacturing, Reliability, and Small Business
            </h3>
            <p className="text-base text-muted-foreground/80 leading-relaxed mb-4">
              From there, his work expanded into business systems, infrastructure, manufacturing technology, and reliability engineering. At Cummins, through TCS, he worked within a manufacturing execution environment spanning more than 400 production stations, where software, machines, processes, data, and people had to function as one operational system. At ACTIVE Network, his work moved deeper into production reliability, telemetry, incident analysis, and the discipline required to keep high-volume technology platforms operating consistently.
            </p>
            <p className="text-base text-muted-foreground/80 leading-relaxed">
              He also spent several years working with small and midsized organizations across Dallas-Fort Worth on technology implementation, process improvement, automation, and program execution. Those environments presented a different kind of challenge from large enterprises. Smaller companies rarely lacked ambition or ideas. More often, they lacked time, specialized resources, and the margin for expensive technology mistakes. That experience gave him an appreciation for solutions that are useful before they are sophisticated, a perspective that would later influence his work with AI and automation for smaller businesses.
            </p>
          </div>

          <div className="border-l-2 border-primary/30 pl-6 mt-8">
            <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Enterprise Scale at HP
            </h3>
            <p className="text-base text-muted-foreground/80 leading-relaxed mb-4">
              In 2022, Subodh joined HP as a Technical Program Manager and was later promoted to Sr. Program Manager - AI Implementation & Governance. The scale and complexity of his work expanded substantially. As a technical program leader and Core Team Lead, he coordinated programs across a portfolio of 53 enterprise applications and more than 100 stakeholders spanning product, engineering, quality, operations, vendors, risk functions, and senior leadership.
            </p>
            <p className="text-base text-muted-foreground/80 leading-relaxed">
              His responsibilities increasingly moved beyond individual project delivery into the systems behind execution itself: portfolio prioritization, dependency management, release readiness, risk escalation, governance, stakeholder alignment, executive communication, and the operating cadence required to move complex technology programs from strategy into production.
            </p>
          </div>

          <div className="border-l-2 border-primary/30 pl-6 mt-8">
            <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              The AI Question
            </h3>
            <p className="text-base text-muted-foreground/80 leading-relaxed mb-4">
              That progression led naturally into artificial intelligence. As organizations accelerated AI adoption, he became interested in a gap that was becoming increasingly difficult to ignore: the difference between what an AI system could demonstrate and what an organization could reliably operate.
            </p>
            <p className="text-base text-muted-foreground/80 leading-relaxed mb-4">
              A model could produce an impressive answer. But could a company determine when its behavior had changed? Could it reproduce an important decision? Could it understand what controls were actually working? Could it show evidence of how a system had been tested? And when an AI system became part of a real business process, who was accountable when it failed?
            </p>
            <p className="text-base text-muted-foreground/80 leading-relaxed">
              Those questions became the foundation for <Link href="/solutions/haiec" className="text-primary hover:underline font-semibold">HAIEC</Link>, an AI assurance and governance platform focused on making AI systems more observable, testable, controlled, and defensible. His related research and invention work spans behavioral drift, deterministic assurance, AI evaluation, compliance automation, adversarial testing, traceability, monitoring, and evidence systems. Several of those ideas have developed into patent-pending systems and methodologies.
            </p>
          </div>

          <div className="border-l-2 border-primary/30 pl-6 mt-8">
            <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <Code2 className="h-4 w-4 text-primary" />
              Kestrel Voice and llmverify
            </h3>
            <p className="text-base text-muted-foreground/80 leading-relaxed mb-4">
              He also built <Link href="/solutions/kestrelvoice" className="text-primary hover:underline font-semibold">Kestrel Voice</Link>, approaching AI from the opposite side of the problem: not simply how to control intelligent systems, but how to make them perform useful work. Kestrel combines AI voice agents, business knowledge, scheduling, workflow automation, integrations, transcripts, escalation, and operational controls. Building the platform has meant confronting the realities that disappear in demonstrations: latency, integration failures, customer expectations, data boundaries, recovery paths, and knowing when automation should hand responsibility back to a person.
            </p>
            <p className="text-base text-muted-foreground/80 leading-relaxed">
              His open-source work, including <Link href="/products/llmverify" className="text-primary hover:underline font-semibold">llmverify</Link>, extends the same thinking into practical tools for developers working with language models.
            </p>
          </div>

          <div className="border-l-2 border-primary/30 pl-6 mt-8">
            <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Writing and Frameworks
            </h3>
            <p className="text-base text-muted-foreground/80 leading-relaxed mb-4">
              He also writes and develops frameworks around AI assurance, software reliability, enterprise adoption, governance, and the operational consequences of emerging technology. His writing is less concerned with predicting what AI may eventually become than with understanding what organizations must do to use it responsibly and effectively today.
            </p>
            <p className="text-base text-muted-foreground/80 leading-relaxed">
              Across these efforts, his work now sits at the intersection of <strong className="text-foreground">AI strategy, enterprise transformation, program and portfolio leadership, continuous improvement, operating-model design, product development, technology commercialization, and responsible AI deployment</strong>.
            </p>
          </div>

          <div className="border-l-2 border-primary/30 pl-6 mt-8">
            <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Community and Civic Involvement
            </h3>
            <p className="text-base text-muted-foreground/80 leading-relaxed mb-4">
              Increasingly, that interest in systems and institutions has moved beyond companies. Based in Euless, Texas, Subodh is active in the Hurst-Euless-Bedford business and civic community. He participates in the HEB Chamber of Commerce and volunteers with <strong className="text-foreground">6 Stones</strong>, including initiatives supporting local students and families.
            </p>
            <p className="text-base text-muted-foreground/80 leading-relaxed mb-4">
              He has also joined HEB ISD's <strong className="text-foreground">Adopt-A-School program with Wilshire Elementary</strong>, where his daughter attends school. Rather than approaching the relationship only through sponsorship, he has offered the skills he knows best: helping teachers and staff explore useful automation, supporting technology and AI learning opportunities for students, mentoring, and contributing professional expertise where it can make a practical difference.
            </p>
            <p className="text-base text-muted-foreground/80 leading-relaxed">
              He remains engaged in local civic affairs and increasingly interested in the intersection of technology, education, entrepreneurship, economic development, and effective public institutions.
            </p>
          </div>

          <div className="border-l-2 border-primary/30 pl-6 mt-8">
            <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              Education and Credentials
            </h3>
            <p className="text-base text-muted-foreground/80 leading-relaxed">
              He holds a B.S. in Computer Information Systems and an M.S. in Engineering and Technology Management from Louisiana Tech University. He is a Six Sigma Green Belt and has completed additional study in AI ethics and governance.
            </p>
          </div>

          <div className="mt-10 p-6 rounded-xl bg-primary/5 border border-primary/20">
            <p className="text-base text-muted-foreground/80 leading-relaxed mb-4">
              Looking across the different stages of his career, what can appear to be a broad collection of experiences follows a fairly consistent pattern.
            </p>
            <p className="text-base text-muted-foreground/80 leading-relaxed mb-4">
              He began by fixing problems inside individual systems. Then he worked across production environments, business processes, and manufacturing operations. Later came enterprise portfolios, AI systems, products, and companies. Today, that same instinct is extending toward the institutions and communities around him.
            </p>
            <p className="text-lg text-foreground font-semibold leading-relaxed">
              The scale of the systems has changed. The underlying work has not: understand how things work, improve what can be improved, and leave the system stronger than it was found.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link href="/portfolio">
              <Button size="lg" className="gap-2">
                <BookOpen className="h-5 w-5" />
                View Executive Portfolio
              </Button>
            </Link>
            <Link href="/magazine">
              <Button size="lg" variant="outline" className="gap-2">
                <Newspaper className="h-5 w-5" />
                Read the Magazine
              </Button>
            </Link>
            <Link href="/executive-bio">
              <Button size="lg" variant="outline" className="gap-2">
                <User className="h-5 w-5" />
                View Executive Bio
              </Button>
            </Link>
          </div>
        </div>
      </Section>

      <Section subtitle="Innovation" title="Patent-Pending AI Compliance Frameworks">
        <div className="max-w-4xl mx-auto mb-8">
          <p className="text-lg text-muted-foreground text-center">
            Developed 5 patent-pending methodologies for AI compliance, drift detection, and governance at enterprise scale.
          </p>
        </div>
        <Grid cols={2}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Adversarial Project Twin
              </CardTitle>
              <CardDescription>
                Drift and sabotage simulation framework that proactively identifies AI system vulnerabilities 
                before they impact production. Enables real-time monitoring and automated remediation.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                AI Compliance Twin
              </CardTitle>
              <CardDescription>
                Real-time regulatory enforcement engine that continuously validates AI systems against 
                EU AI Act, GDPR, and sector-specific compliance requirements.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Modular Audit Engine
              </CardTitle>
              <CardDescription>
                AI fairness and transparency scoring system with modular architecture. 
                Provides documentation suitable for audits and compliance reporting for enterprise deployments.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Precision Drift Detector
              </CardTitle>
              <CardDescription>
                Numerical anomaly detection system for AI model performance monitoring. 
                Identifies drift patterns before they impact business outcomes.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Compliance Fingerprint Layer
              </CardTitle>
              <CardDescription>
                Tamper-evident traceability system for AI decision-making. 
                Creates immutable audit trails for regulatory compliance and forensic analysis.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                CSM Framework & SKC ResetFrame
              </CardTitle>
              <CardDescription>
                Subodh developed Cognitive Systems Management (CSM), a governance methodology with four domains: CSM-Enterprise, CSM-Project, CSM-Code, and CSM-UX. Six execution functions span purpose, mapping, risk, delivery, oversight, and compliance. CSM 2.0 (spec version 2.0.0) extends the original 2025 publication with machine-readable contracts and 16 governance components for enterprise AI deployment.{' '}
                <Link href="/cognitive-systems-management" className="text-primary hover:underline">Explore the framework</Link>.
              </CardDescription>
            </CardHeader>
          </Card>
        </Grid>
      </Section>

      <Section subtitle="Compliance Guides" title="AI Compliance Law Guides" className="bg-secondary/20">
        <div className="max-w-4xl mx-auto mb-8">
          <p className="text-base text-muted-foreground text-center">
            Complete guides to the AI regulations that matter most, informed by the HAIEC compliance engine and Zenodo-published research.
          </p>
        </div>
        <Grid cols={3}>
          <Link href="/guides/texas-ai-law">
            <Card className="hover:border-primary/40 transition-all h-full">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium text-amber-600">Effective Jan 2026</span>
                </div>
                <CardTitle className="text-base">Texas AI Law (TRAIGA / HB 149)</CardTitle>
                <CardDescription className="text-sm">
                  Texas Responsible AI Governance Act. Applicability tests, prohibited practices, disclosure duties, penalties, and NIST AI RMF defense pathway.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/guides/eu-ai-act">
            <Card className="hover:border-primary/40 transition-all h-full">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium text-amber-600">Full enforcement Aug 2026</span>
                </div>
                <CardTitle className="text-base">EU AI Act</CardTitle>
                <CardDescription className="text-sm">
                  World's first complete AI regulation. Risk-tiered framework for all AI on the EU market. Penalties up to 35M euros or 7% of global revenue.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/guides/nyc-local-law-144">
            <Card className="hover:border-primary/40 transition-all h-full">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium text-red-600">Active enforcement</span>
                </div>
                <CardTitle className="text-base">NYC Local Law 144</CardTitle>
                <CardDescription className="text-sm">
                  Bias audit requirements for automated employment decision tools. Annual independent bias audits, 10-day candidate notice, daily penalties.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </Grid>
        <div className="text-center mt-8">
          <Link href="/guides" className="text-sm text-primary hover:underline">
            View all compliance guides and technical resources →
          </Link>
        </div>
      </Section>

      <Section subtitle="Why This Work Matters" title="Personal Note" className="bg-primary/5">
        <div className="max-w-3xl mx-auto space-y-6">
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
      </Section>

      <CTA
        title="Let's Work Together"
        description="Whether you need advisory on AI compliance, executive coaching, or help driving a complex technical program, Subodh brings strategic thinking and proven execution to the table."
        primaryButton={{ text: 'Get in touch', href: '/contact' }}
        secondaryButton={{ text: 'View services', href: '/advisory' }}
      />
      <div className="text-center pb-8">
        <Link href="/person/subodh-kc" className="text-sm text-muted-foreground hover:text-primary transition-colors">Person Profile →</Link>
      </div>
    </>
  )
}
