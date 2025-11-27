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
        subtitle="Background"
        title="At the Intersection of Strategy & Execution"
        description="I don't just manage programs. I architect systems that solve real problems while meeting the highest standards of compliance and governance."
      >
        <div className="prose max-w-none">
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            My career has been built at the intersection of technical program management, AI governance, and enterprise-scale execution. With 15 years of experience driving complex programs across Fortune 50 enterprises and high-growth startups, I've learned that success in AI isn't just about the technology—it's about the frameworks, governance structures, and strategic thinking that enable innovation while managing risk.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            At HP, I lead AI strategy and compliance for our core team, navigating the complexity of deploying AI systems that must meet rigorous regulatory requirements while delivering business value. This role demands both technical depth and strategic vision—understanding not just how to build AI systems, but how to build them responsibly.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            Through HAIEC (Human AI Ethics Council), I've channeled years of experience into practical frameworks and tools that help organizations move from AI pilots to production-grade systems. The Red Audit Kit, LegacyShift methodology, and Cognitive Systems Management approach are all born from real-world challenges I've encountered and solved.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            My approach is simple: no buzzwords, no fluff. Just strategic systems that work, executed with precision.
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

      <Section subtitle="Core Values" title="What Drives My Work">
        <Grid cols={2}>
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{value.title}</CardTitle>
                  <CardDescription>{value.description}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </Grid>
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

      <Section subtitle="Beyond Work" title="Personal Mission">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <p className="text-lg text-muted-foreground leading-relaxed">
            I'm passionate about mentoring the next generation of builders, particularly those from Nepal. Digital governance, AI compliance, and technical leadership aren't just career paths—they're opportunities to shape how technology serves society.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            I believe in building systems that create leverage. Whether it's a governance framework that protects millions of users, a program that ships months ahead of schedule, or a mentorship that unlocks someone's potential—the goal is always maximum impact.
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
