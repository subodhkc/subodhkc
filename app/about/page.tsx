import Link from 'next/link'
import Hero from '@/components/Hero'
import Section from '@/components/Section'
import Timeline from '@/components/Timeline'
import CTA from '@/components/CTA'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Grid from '@/components/Grid'
import { Award, GraduationCap, Briefcase, Heart, Shield, CheckCircle2, TrendingUp, Zap, Users, Download } from 'lucide-react'

export const metadata = {
  title: 'About',
  description:
    'Learn about Subodh KC - AI Compliance Architect, Technical Program Manager, and founder of HAIEC. From Louisiana Tech to leading AI strategy at Fortune 50.',
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
        'From Dean\'s Honor List to enterprise leadership, high standards aren\'t optional—they\'re the baseline.',
    },
    {
      icon: GraduationCap,
      title: 'Continuous Learning',
      description:
        'Technology evolves. Regulations shift. Staying ahead means never stopping the pursuit of deeper expertise.',
    },
    {
      icon: Heart,
      title: 'Impact Over Activity',
      description:
        'It\'s not about the number of programs shipped. It\'s about the problems solved and value created.',
    },
  ]

  const journey = [
    {
      date: '2025 - Present',
      title: 'Sr Program Manager - AI Implementation & Governance',
      subtitle: 'HP Inc. - Core Team Lead',
      description:
        'Leading strategic AI initiatives across enterprise systems. Accelerating AI adoption while ensuring responsible implementation aligned with organizational values. Developed 5 patent-pending frameworks for AI compliance and drift detection.',
    },
    {
      date: '2023 - 2025',
      title: 'Core Team Lead - Platform Enabling Applications',
      subtitle: 'HP Inc. - 53 Applications Portfolio',
      description:
        'Led Core Team of TPMs managing 53 applications across Education, Manageability, and Conferencing platforms. Drove end-to-end program management for enterprise software solutions.',
    },
    {
      date: '2023 - Present',
      title: 'Technical Program Manager',
      subtitle: 'HP Inc.',
      description:
        'Managed development and release of Power Manager and enterprise software solutions. Led cross-functional teams through Agile delivery, stakeholder engagement, and risk mitigation at Fortune 50 scale.',
    },
    {
      date: '2020 - Present',
      title: 'Founder & CEO',
      subtitle: 'Human AI Ethics Council (HAIEC)',
      description:
        'Built comprehensive platform for AI governance, compliance, and ethical deployment. Created Cognitive Systems Management (CSM) Framework, SKC Meeting ResetFrame™, Red Audit Kit, and LegacyShift methodology.',
    },
    {
      date: '2022',
      title: 'M.Sc. Engineering & Technology Management',
      subtitle: 'Louisiana Tech University',
      description:
        'Completed Master\'s degree focusing on engineering management, technology strategy, and organizational leadership.',
    },
    {
      date: '2018 - 2022',
      title: 'Entrepreneur - Project Manager',
      subtitle: 'Business Process Automation & Software Development',
      description:
        'Performed business analysis and software development to automate business processes. Managed project timelines using Agile Scrum Framework. Provided Business Process Improvement and UI Enhancement services.',
    },
    {
      date: '2017 - 2018',
      title: 'System Engineer II',
      subtitle: 'ACTIVE Network',
      description:
        'Collaborated with software development engineers on web-based applications. Wrote test cases and conducted automation testing. Used PowerShell scripting to automate daily operations and wrote complex SQL queries.',
    },
    {
      date: '2016 - 2017',
      title: 'System Analyst',
      subtitle: 'Cummins Inc. @ TCS',
      description:
        'Led implementation of Manufacturing Execution System (MES). Managed $10M+ project lifecycle. Deployed 400+ stations in MES. Worked on migration from Mainframe to Windows Platform and Atoms to MES.',
    },
    {
      date: '2014',
      title: 'B.S. Computer & Information Systems Security',
      subtitle: 'Louisiana Tech University - Graduated',
      description:
        'Graduated with Bachelor\'s degree. Dean\'s Honor List, President\'s Honor List, Bulldog Scholarship recipient. Six Sigma Green Belt certified.',
    },
    {
      date: '2014',
      title: 'Technology Strategist',
      subtitle: 'Office of Intellectual Property & Commercialization - Louisiana Tech',
      description:
        'Conducted intellectual property valuation and market research. Led marketing initiatives for new product introduction. Coordinated with IP lawyers on patents and legal matters.',
    },
    {
      date: '2013 - 2016',
      title: 'Business System Analyst',
      subtitle: 'Centaurus Technology Partners',
      description:
        'Worked on Red Hat Enterprise Linux infrastructure. Designed Puppet modules for automation. Managed AWS cloud applications. Handled 24x7 support rotation and recruited future analysts.',
    },
    {
      date: '2010 - 2011',
      title: 'Technical Field Operations Lead',
      subtitle: 'Dallas Independent School District - No Child Left Behind (Gov Contract)',
      description:
        'Government contractor for No Child Left Behind project. Managed onsite and offshore teams covering DFW Metroplex. Provided 24x7 support for multiple school districts.',
    },
  ]

  return (
    <>
      <Hero
        subtitle="About"
        title={
          <>
            Building AI Systems
            <br />
            <span className="gradient-text">That Work. At Scale.</span>
          </>
        }
        description="From Louisiana Tech to leading AI compliance at Fortune 50. My path has been defined by one principle: strategic systems, sharp execution."
      />

      <Section
        subtitle="The Story"
        title="From Field Operations to Fortune 50 AI Strategy"
        description="Some leaders arrive through prestige. Others arrive through survival."
      >
        <div className="prose max-w-none">
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            I entered technology on the ground floor: fixing computers in underfunded schools, documenting broken systems, 
            learning—up close—how much damage a bad workflow or a single misconfigured system can cause. I wasn't groomed 
            for leadership. I earned it one failure mode at a time.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            From those early field operations, I developed a trait that has shaped my entire career: <strong>I don't accept 
            chaos as "the way things are." I build structures that eliminate it.</strong>
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            Fast forward 15 years. I now architect AI governance frameworks for a Fortune 50 company, manage multimillion-dollar 
            AI portfolios, deploy systems used by millions, and design compliance architectures that withstand legal, operational, 
            and engineering scrutiny. I built a governance platform (HAIEC) from scratch—quietly adopted in enterprise settings—and 
            authored five patent-pending frameworks in drift detection, audit automation, and real-time AI enforcement.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            <strong>I bridge the world between AI ambition and organizational reality.</strong>
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            Most people see growing regulatory pressure as a blocker. I see it as a blueprint. Where others ship models, 
            I ship systems that protect organizations from the failure modes they didn't even know existed.
          </p>
          <p className="text-lg text-foreground font-semibold leading-relaxed mb-6">
            This is why teams trust me to lead the programs that matter.
          </p>
          
          <div className="flex justify-center mt-8">
            <Link href="/executive-bio">
              <Button size="lg" variant="outline" className="gap-2">
                <Download className="h-5 w-5" />
                View Executive Bio
              </Button>
            </Link>
          </div>
        </div>
      </Section>

      <Section subtitle="Journey" title="Career Milestones" className="bg-secondary/20">
        <Timeline items={journey} />
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
                CSM Framework & SKC ResetFrame™
              </CardTitle>
              <CardDescription>
                Cognitive Systems Management methodology and Meeting ResetFrame for enterprise AI program delivery. 
                Deployed in multiple Fortune 50 pilots with proven results.
              </CardDescription>
            </CardHeader>
          </Card>
        </Grid>
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
                My systems bridge both worlds—creating governance structures that scale across dozens of teams without 
                breaking velocity.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle>I Make Ambiguity Executable</CardTitle>
              <CardDescription className="text-base">
                When teams don't know how to proceed, I create structures that turn confusion into predictable delivery. 
                I've operated at every altitude: from field technician → system engineer → program manager → founder → 
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
                "Subodh has an exceptional ability to take complex AI compliance requirements and translate them into actionable frameworks. His work on our enterprise AI governance program reduced our audit preparation time from months to weeks while maintaining the highest standards of regulatory compliance."
              </CardDescription>
              <CardTitle className="text-sm font-normal">
                <span className="font-semibold">Senior Engineering Director</span>
                <br />
                <span className="text-muted-foreground">Fortune 50 Technology Company</span>
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardDescription className="text-base italic text-foreground mb-4">
                "Working with Subodh on AI implementation strategy was transformative. He doesn't just manage programs—he architects systems that actually work at scale. His CSM Framework helped us navigate the complexity of deploying AI across 50+ business units while staying compliant with evolving regulations."
              </CardDescription>
              <CardTitle className="text-sm font-normal">
                <span className="font-semibold">VP of AI Strategy</span>
                <br />
                <span className="text-muted-foreground">Enterprise Software Company</span>
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardDescription className="text-base italic text-foreground mb-4">
                "Subodh's technical program management skills are unmatched. He led our $40M AI compliance initiative with precision, managing 100+ stakeholders across multiple time zones. His ability to balance innovation velocity with regulatory requirements is exactly what enterprises need in the AI era."
              </CardDescription>
              <CardTitle className="text-sm font-normal">
                <span className="font-semibold">Chief Technology Officer</span>
                <br />
                <span className="text-muted-foreground">Financial Services Firm</span>
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
            Not just faster or smarter—<strong>safer, fairer, more accountable.</strong>
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            AI will shape the next century. My mission is to ensure it does so without repeating the failures of the last one: 
            hidden bias, silent drift, ungoverned decisions, and operational fragility.
          </p>
          <p className="text-lg text-foreground font-semibold leading-relaxed">
            Everything I build—frameworks, programs, platforms, patents—follows one philosophy:
          </p>
          <p className="text-xl text-foreground font-bold leading-relaxed text-center py-4">
            If a system can harm people, it must be governed as seriously as it is engineered.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed text-center">
            This isn't just my work. It's my discipline.
          </p>
        </div>
      </Section>

      <Section subtitle="Opportunities" title="Open to New Challenges" className="bg-secondary/20">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Executive Roles
                </CardTitle>
                <CardDescription className="space-y-3 text-base">
                  <p>Currently exploring VP/Director positions in:</p>
                  <ul className="space-y-2 ml-4">
                    <li>• AI Compliance & Governance Leadership</li>
                    <li>• Enterprise Technical Program Management</li>
                    <li>• AI Strategy & Implementation</li>
                    <li>• Digital Transformation Leadership</li>
                  </ul>
                  <p className="pt-2"><strong>Target:</strong> Fortune 500, Series B+ Startups, AI-First Companies</p>
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Consulting & Advisory
                </CardTitle>
                <CardDescription className="space-y-3 text-base">
                  <p>Available for:</p>
                  <ul className="space-y-2 ml-4">
                    <li>• AI Proof-of-Concept (POC) Projects</li>
                    <li>• Compliance Framework Implementation</li>
                    <li>• Executive Advisory & Coaching</li>
                    <li>• Fractional Leadership Roles</li>
                  </ul>
                  <p className="pt-2"><strong>Engagement:</strong> Project-based, Retainer, or Fractional Executive</p>
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Location</p>
                <p className="font-semibold text-foreground">Remote, Hybrid, or Relocation</p>
                <p className="text-xs text-muted-foreground mt-1">Open to Dallas/Austin area</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Compensation (Full-Time)</p>
                <p className="font-semibold text-foreground">$250K - $400K+</p>
                <p className="text-xs text-muted-foreground mt-1">Base + equity/bonus</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Consulting Rate</p>
                <p className="font-semibold text-foreground">$300 - $500/hour</p>
                <p className="text-xs text-muted-foreground mt-1">Project minimums apply</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <CTA
        title="Let's Work Together"
        description="Whether you need advisory on AI compliance, executive coaching, or help driving a complex technical program, I bring strategic thinking and proven execution."
        primaryButton={{ text: 'Get in touch', href: '/contact' }}
        secondaryButton={{ text: 'View services', href: '/advisory' }}
      />
    </>
  )
}
