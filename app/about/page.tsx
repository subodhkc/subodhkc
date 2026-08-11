import Link from 'next/link'
import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Grid from '@/components/Grid'
import { Award, GraduationCap, Briefcase, Heart, Shield, CheckCircle2, TrendingUp, Zap, Users, FileText, BookOpen, User, Newspaper, MapPin, Code2 } from 'lucide-react'

export const metadata = {
  title: 'About Subodh KC | AI Advisor and Systems Architect | Founder',
  description:
    'Learn about Subodh KC, AI Advisor and Systems Architect, former Fortune 50 AI Strategy CTL, founder of KestrelVoice, founder of HAIEC. 16+ years building production AI systems from pilot to enterprise scale.',
  keywords: [
    'Subodh KC',
    'AI systems architect',
    'AI governance expert',
    'Fortune 50 AI strategy',
    'KestrelVoice founder',
    'HAIEC founder',
    'AI compliance',
    'technical program manager',
    'HP Inc AI',
    'enterprise AI leadership',
  ],
  alternates: {
    canonical: 'https://subodhkc.com/about',
  },
  openGraph: {
    title: 'About Subodh KC | AI Advisor and Systems Architect | Founder',
    description:
      'Learn about Subodh KC, AI Advisor and Systems Architect, former Fortune 50 AI Strategy CTL, founder of KestrelVoice, founder of HAIEC. 16+ years building production AI systems from pilot to enterprise scale.',
    url: 'https://subodhkc.com/about',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Subodh KC | AI Advisor and Systems Architect | Founder',
    description: 'AI Advisor and Systems Architect, former Fortune 50 AI Strategy CTL, founder of KestrelVoice, founder of HAIEC.',
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

export default function AboutPage() {
  const values = [
    {
      icon: Briefcase,
      title: 'Strategic Execution',
      description:
        'Complex problems require surgical precision. I build systems and frameworks that work at scale.',
    },
    {
      icon: Award,
      title: 'Excellence as Standard',
      description:
        'From Dean\'s Honor List to enterprise leadership, high standards aren\'t optional. They\'re the baseline.',
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
        'It\'s not about the number of programs shipped. It\'s about the problems solved and value created.',
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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
        description="My career has followed one pattern: fix problems inside individual systems, then work across production environments, enterprise portfolios, AI systems, and communities. The scale changes. The work does not."
      />

      <Section
        subtitle="The Story"
        title="From Field Operations to AI Governance"
        description="The scale of the systems has changed. The underlying work has not."
      >
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Intro */}
          <p className="text-lg text-muted-foreground leading-relaxed">
            I have built my career around <strong className="text-foreground">continuous improvement</strong>: understanding how systems work, finding where they break down, and building better ways for people and organizations to operate.
          </p>
          <p className="text-base text-muted-foreground/80 leading-relaxed">
            That instinct has carried me through public-sector technology, manufacturing, intellectual property and commercialization, small-business transformation, enterprise program leadership, artificial intelligence, entrepreneurship, research, and community involvement.
          </p>
          <p className="text-base text-muted-foreground/80 leading-relaxed">
            Long before AI became the center of my work, I was interested in the relationship between technology and practical outcomes.
          </p>

          {/* Name Meaning */}
          <div className="mt-6 p-5 rounded-lg bg-muted/30 border border-border/50">
            <p className="text-base text-muted-foreground/80 leading-relaxed italic">
              My name, Subodh, comes from Sanskrit: <strong className="not-italic text-foreground">su</strong> (good or easy) and <strong className="not-italic text-foreground">bodh</strong> (knowledge or understanding). It translates roughly to "one who understands easily" or "one who brings clear understanding." I have always treated it as a professional obligation, not just a label.
            </p>
          </div>

          {/* Education */}
          <div className="border-l-2 border-primary/30 pl-6 mt-8">
            <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              Education and Early Lessons
            </h3>
            <p className="text-base text-muted-foreground/80 leading-relaxed mb-4">
              While earning my undergraduate degree in Computer Information Systems, I balanced school with remote technology work that helped pay for college. I earned academic scholarships, appeared on the President's and Dean's Lists, and won a university coding competition. But some of my most formative experiences happened outside the classroom.
            </p>
            <p className="text-base text-muted-foreground/80 leading-relaxed mb-4">
              In a global business strategy competition involving tens of thousands of university students, I helped lead Louisiana Tech to a top-three global ranking, at the time the university's strongest performance in the competition. The experience reinforced something that would become increasingly important in my career: technical ability mattered, but strategy, resource allocation, competitive positioning, and execution determined the outcome.
            </p>
            <p className="text-base text-muted-foreground/80 leading-relaxed">
              I later served as Secretary of Louisiana Tech's Graduate Student Council while completing my M.S. in Engineering and Technology Management, adding another dimension to an education that increasingly sat between engineering, business, and organizational leadership.
            </p>
          </div>

          {/* Early Career */}
          <div className="border-l-2 border-primary/30 pl-6 mt-8">
            <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              Starting Close to the People Using Technology
            </h3>
            <p className="text-base text-muted-foreground/80 leading-relaxed mb-4">
              My professional career began close to the people using technology. Working in Dallas-area education environments, including Dallas ISD during the No Child Left Behind era, I supported distributed technology operations where failures were not abstract technical problems. They affected classrooms, administrators, teachers, and students. It was an early lesson in a principle that would follow me throughout my career: technology succeeds only when it works inside the institution that depends on it.
            </p>
            <p className="text-base text-muted-foreground/80 leading-relaxed mb-4">
              At Louisiana Tech, I later worked with the university's <strong className="text-foreground">Office of Intellectual Property and Commercialization</strong>, gaining exposure to another side of technology: evaluating inventions not only for their technical merit, but for their potential application, market relevance, intellectual property value, and path to commercialization.
            </p>
          </div>

          {/* Manufacturing and Reliability */}
          <div className="border-l-2 border-primary/30 pl-6 mt-8">
            <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Manufacturing, Reliability, and Small Business
            </h3>
            <p className="text-base text-muted-foreground/80 leading-relaxed mb-4">
              From there, my work expanded into business systems, infrastructure, manufacturing technology, and reliability engineering. At Cummins, through TCS, I worked within a manufacturing execution environment spanning more than 400 production stations, where software, machines, processes, data, and people had to function as one operational system. At ACTIVE Network, my work moved deeper into production reliability, telemetry, incident analysis, and the discipline required to keep high-volume technology platforms operating consistently.
            </p>
            <p className="text-base text-muted-foreground/80 leading-relaxed">
              I also spent several years working with small and midsized organizations across Dallas-Fort Worth on technology implementation, process improvement, automation, and program execution. Those environments presented a different kind of challenge from large enterprises. Smaller companies rarely lacked ambition or ideas. More often, they lacked time, specialized resources, and the margin for expensive technology mistakes. That experience gave me an appreciation for solutions that are useful before they are sophisticated, a perspective that would later influence my work with AI and automation for smaller businesses.
            </p>
          </div>

          {/* HP */}
          <div className="border-l-2 border-primary/30 pl-6 mt-8">
            <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Enterprise Scale at HP
            </h3>
            <p className="text-base text-muted-foreground/80 leading-relaxed mb-4">
              In 2023, I joined HP, where the scale and complexity of my work expanded substantially. As a technical program leader and Core Team Lead, I coordinated programs across a portfolio of 53 enterprise applications and more than 100 stakeholders spanning product, engineering, quality, operations, vendors, risk functions, and senior leadership.
            </p>
            <p className="text-base text-muted-foreground/80 leading-relaxed">
              My responsibilities increasingly moved beyond individual project delivery into the systems behind execution itself: portfolio prioritization, dependency management, release readiness, risk escalation, governance, stakeholder alignment, executive communication, and the operating cadence required to move complex technology programs from strategy into production.
            </p>
          </div>

          {/* AI */}
          <div className="border-l-2 border-primary/30 pl-6 mt-8">
            <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              The AI Question
            </h3>
            <p className="text-base text-muted-foreground/80 leading-relaxed mb-4">
              That progression led naturally into artificial intelligence. As organizations accelerated AI adoption, I became interested in a gap that was becoming increasingly difficult to ignore: the difference between what an AI system could demonstrate and what an organization could reliably operate.
            </p>
            <p className="text-base text-muted-foreground/80 leading-relaxed mb-4">
              A model could produce an impressive answer. But could a company determine when its behavior had changed? Could it reproduce an important decision? Could it understand what controls were actually working? Could it show evidence of how a system had been tested? And when an AI system became part of a real business process, who was accountable when it failed?
            </p>
            <p className="text-base text-muted-foreground/80 leading-relaxed">
              Those questions became the foundation for <Link href="/solutions/haiec" className="text-primary hover:underline font-semibold">HAIEC</Link>, an AI assurance and governance platform focused on making AI systems more observable, testable, controlled, and defensible. My related research and invention work spans behavioral drift, deterministic assurance, AI evaluation, compliance automation, adversarial testing, traceability, monitoring, and evidence systems. Several of those ideas have developed into patent-pending systems and methodologies.
            </p>
          </div>

          {/* Kestrel and llmverify */}
          <div className="border-l-2 border-primary/30 pl-6 mt-8">
            <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <Code2 className="h-4 w-4 text-primary" />
              Kestrel Voice and llmverify
            </h3>
            <p className="text-base text-muted-foreground/80 leading-relaxed mb-4">
              I also built <Link href="/solutions/kestrelvoice" className="text-primary hover:underline font-semibold">Kestrel Voice</Link>, approaching AI from the opposite side of the problem: not simply how to control intelligent systems, but how to make them perform useful work. Kestrel combines AI voice agents, business knowledge, scheduling, workflow automation, integrations, transcripts, escalation, and operational controls. Building the platform has meant confronting the realities that disappear in demonstrations: latency, integration failures, customer expectations, data boundaries, recovery paths, and knowing when automation should hand responsibility back to a person.
            </p>
            <p className="text-base text-muted-foreground/80 leading-relaxed">
              My open-source work, including <Link href="/products/llmverify" className="text-primary hover:underline font-semibold">llmverify</Link>, extends the same thinking into practical tools for developers working with language models.
            </p>
          </div>

          {/* Writing */}
          <div className="border-l-2 border-primary/30 pl-6 mt-8">
            <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Writing and Frameworks
            </h3>
            <p className="text-base text-muted-foreground/80 leading-relaxed mb-4">
              I also write and develop frameworks around AI assurance, software reliability, enterprise adoption, governance, and the operational consequences of emerging technology. My writing is less concerned with predicting what AI may eventually become than with understanding what organizations must do to use it responsibly and effectively today.
            </p>
            <p className="text-base text-muted-foreground/80 leading-relaxed">
              Across these efforts, my work now sits at the intersection of <strong className="text-foreground">AI strategy, enterprise transformation, program and portfolio leadership, continuous improvement, operating-model design, product development, technology commercialization, and responsible AI deployment</strong>.
            </p>
          </div>

          {/* Community */}
          <div className="border-l-2 border-primary/30 pl-6 mt-8">
            <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Community and Civic Involvement
            </h3>
            <p className="text-base text-muted-foreground/80 leading-relaxed mb-4">
              Increasingly, that interest in systems and institutions has moved beyond companies. Based in Euless, Texas, I am active in the Hurst-Euless-Bedford business and civic community. I participate in the HEB Chamber of Commerce and volunteer with <strong className="text-foreground">6 Stones</strong>, including initiatives supporting local students and families.
            </p>
            <p className="text-base text-muted-foreground/80 leading-relaxed mb-4">
              I have also joined HEB ISD's <strong className="text-foreground">Adopt-A-School program with Wilshire Elementary</strong>, where my daughter attends school. Rather than approaching the relationship only through sponsorship, I have offered the skills I know best: helping teachers and staff explore useful automation, supporting technology and AI learning opportunities for students, mentoring, and contributing professional expertise where it can make a practical difference.
            </p>
            <p className="text-base text-muted-foreground/80 leading-relaxed">
              I remain engaged in local civic affairs and increasingly interested in the intersection of technology, education, entrepreneurship, economic development, and effective public institutions.
            </p>
          </div>

          {/* Credentials */}
          <div className="border-l-2 border-primary/30 pl-6 mt-8">
            <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              Education and Credentials
            </h3>
            <p className="text-base text-muted-foreground/80 leading-relaxed">
              I hold a B.S. in Computer Information Systems and an M.S. in Engineering and Technology Management from Louisiana Tech University. I am a Six Sigma Green Belt and have completed additional study in AI ethics and governance.
            </p>
          </div>

          {/* The Pattern */}
          <div className="mt-10 p-6 rounded-xl bg-primary/5 border border-primary/20">
            <p className="text-base text-muted-foreground/80 leading-relaxed mb-4">
              Looking across the different stages of my career, what can appear to be a broad collection of experiences follows a fairly consistent pattern.
            </p>
            <p className="text-base text-muted-foreground/80 leading-relaxed mb-4">
              I began by fixing problems inside individual systems. Then I worked across production environments, business processes, and manufacturing operations. Later came enterprise portfolios, AI systems, products, and companies. Today, that same instinct is extending toward the institutions and communities around me.
            </p>
            <p className="text-lg text-foreground font-semibold leading-relaxed">
              The scale of the systems has changed. The underlying work has not: understand how things work, improve what can be improved, and leave the system stronger than I found it.
            </p>
          </div>

          {/* Buttons */}
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
            <Link href="/resume">
              <Button size="lg" variant="outline" className="gap-2">
                <FileText className="h-5 w-5" />
                View Resume
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
                Provides audit-grade documentation and compliance reporting for enterprise deployments.
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
                Subodh developed Cognitive Systems Management (CSM), a four-domain governance methodology spanning Enterprise, Project, Code and UX, first published in 2025.{' '}
                <Link href="/cognitive-systems-management" className="text-primary hover:underline">Explore the framework</Link>.
              </CardDescription>
            </CardHeader>
          </Card>
        </Grid>
      </Section>

      <Section subtitle="Compliance Guides" title="AI Compliance Law Guides" className="bg-secondary/20">
        <div className="max-w-4xl mx-auto mb-8">
          <p className="text-base text-muted-foreground text-center">
            Comprehensive guides to the AI regulations that matter most, informed by the HAIEC compliance engine and Zenodo-published research.
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
                  World's first comprehensive AI regulation. Risk-tiered framework for all AI on the EU market. Penalties up to 35M euros or 7% of global revenue.
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

      <Section subtitle="What Makes Me Different" title="Why Teams Trust Me">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle>I See Failure Modes Before They Emerge</CardTitle>
              <CardDescription className="text-base">
                Years of drift detection, RCA, and governance work have trained me to anticipate what most teams 
                discover only after outages or audit failures. I protect organizations from invisible risks before 
                they become front-page news.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle>I Design Frameworks That Survive Contact With Real Organizations</CardTitle>
              <CardDescription className="text-base">
                Compliance is useless if engineers won't follow it. Engineering is dangerous if compliance can't see it. 
                My systems bridge both worlds, creating governance structures that scale across dozens of teams without 
                breaking velocity.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle>I Make Ambiguity Executable</CardTitle>
              <CardDescription className="text-base">
                When teams don't know how to proceed, I create structures that turn confusion into predictable delivery. 
                I've operated at every altitude: from field technician to system engineer to program manager to founder to 
                enterprise AI strategist. I understand every layer of the stack, technical and human.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle>I Don't Accept Chaos as "The Way Things Are"</CardTitle>
              <CardDescription className="text-base">
                Where others see regulatory pressure as a blocker, I see it as a blueprint. Where others ship models, 
                I ship systems that protect organizations from failure modes they didn't even know existed. This discipline 
                has shaped every framework, patent, and program I've delivered.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      <Section subtitle="Testimonials" title="What People Say" className="bg-secondary/20">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardDescription className="text-base italic text-foreground mb-4">
                "We were drowning in AI compliance requirements and honestly did not know where to start. Subodh sat with us, broke everything down into plain language, and helped us build a governance framework that our team could actually follow day to day. What used to be a scramble before audits is now just part of our normal workflow."
              </CardDescription>
              <CardTitle className="text-sm font-normal">
                <span className="font-semibold">Director of Engineering</span>
                <br />
                <span className="text-muted-foreground">Healthcare technology company</span>
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardDescription className="text-base italic text-foreground mb-4">
                "Subodh is not the kind of consultant who hands you a slide deck and leaves. He stayed engaged through the messy parts of rolling out AI across our business units and helped us think through edge cases we would have missed on our own. The framework he built with us is still in use and still adapting."
              </CardDescription>
              <CardTitle className="text-sm font-normal">
                <span className="font-semibold">VP of AI Strategy</span>
                <br />
                <span className="text-muted-foreground">Enterprise SaaS company</span>
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardDescription className="text-base italic text-foreground mb-4">
                "What stood out to me was how Subodh balanced moving fast with staying compliant. He understood the regulatory pressure we were under but never let it slow things down to a halt. He has a way of making compliance feel less like a roadblock and more like a design constraint you can work with."
              </CardDescription>
              <CardTitle className="text-sm font-normal">
                <span className="font-semibold">CTO</span>
                <br />
                <span className="text-muted-foreground">Financial services firm</span>
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </Section>

      <Section subtitle="Why This Work Matters" title="The Personal Note" className="bg-primary/5">
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-lg text-muted-foreground leading-relaxed">
            I grew up navigating systems that weren't designed for people like me. So I became someone who designs better systems.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Not just faster or smarter, but <strong>safer, fairer, more accountable.</strong>
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            AI will shape the next century. My mission is to ensure it does so without repeating the failures of the last one: 
            hidden bias, silent drift, ungoverned decisions, and operational fragility.
          </p>
          <p className="text-lg text-foreground font-semibold leading-relaxed">
            Everything I build, frameworks, programs, platforms, patents, follows one philosophy:
          </p>
          <p className="text-xl text-foreground font-bold leading-relaxed text-center py-4">
            If a system can harm people, it must be governed as seriously as it is engineered.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed text-center">
            This isn't just my work. It's my discipline.
          </p>
        </div>
      </Section>

      <CTA
        title="Let's Work Together"
        description="Whether you need advisory on AI compliance, executive coaching, or help driving a complex technical program, I bring strategic thinking and proven execution to the table."
        primaryButton={{ text: 'Get in touch', href: '/contact' }}
        secondaryButton={{ text: 'View services', href: '/advisory' }}
      />
    </>
  )
}
