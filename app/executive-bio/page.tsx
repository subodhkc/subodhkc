import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Section from '@/components/Section'
import Grid from '@/components/Grid'
import { 
  Shield, 
  Briefcase, 
  Users, 
  Award, 
  GraduationCap, 
  TrendingUp, 
  Zap,
  CheckCircle2,
  Mail,
  Linkedin,
  Globe,
  Download,
  ArrowRight
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Executive Bio - Subodh KC',
  description: 'AI Compliance Architect | Enterprise Technical Program Leader | HAIEC Founder. 15 years architecting enterprise programs, 5 patent-pending AI compliance frameworks.',
}

export default function ExecutiveBioPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="section-container py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 mb-6">
            <span className="text-sm font-medium text-primary">Executive Biography</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Subodh KC
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            AI Compliance Architect | Enterprise Technical Program Leader | HAIEC Founder
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <a href="mailto:Subodh.kc@haiec.com">
              <Button variant="outline" className="gap-2">
                <Mail className="h-4 w-4" />
                Subodh.kc@haiec.com
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
            <span>📍 Dallas/Austin, TX</span>
            <span>•</span>
            <span>🌐 Remote, Hybrid, or Relocation</span>
            <span>•</span>
            <span>✅ Open to Opportunities</span>
          </div>
        </div>
      </section>

      {/* Executive Summary */}
      <Section className="bg-secondary/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Executive Summary</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              I build AI systems that work at scale—not just in theory, but in production environments 
              serving millions of users under the scrutiny of global regulators.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              With 15 years architecting enterprise programs and 5 patent-pending AI compliance frameworks, 
              I've learned that the hardest problems in AI aren't technical—they're organizational. How do 
              you deploy AI across 50+ business units while staying compliant with evolving regulations? 
              How do you manage $50M budgets with 100+ stakeholders across time zones? How do you balance 
              innovation velocity with regulatory requirements?
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              I've solved these problems at Fortune 50 scale. And I've built frameworks that others can use to do the same.
            </p>
          </div>
        </div>
      </Section>

      {/* Core Expertise */}
      <Section>
        <h2 className="text-3xl font-bold mb-8 text-center">Core Expertise</h2>
        <Grid cols={3}>
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>AI Compliance Architecture</CardTitle>
              <CardDescription className="space-y-2">
                <p>• Enterprise governance frameworks</p>
                <p>• EU AI Act, GDPR compliance</p>
                <p>• Audit readiness programs</p>
                <p>• Real-time regulatory enforcement</p>
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Technical Program Management</CardTitle>
              <CardDescription className="space-y-2">
                <p>• 50+ enterprise AI programs</p>
                <p>• $50M+ program portfolios</p>
                <p>• Global stakeholder coordination</p>
                <p>• Agile delivery at Fortune 50 scale</p>
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Innovation & Patents</CardTitle>
              <CardDescription className="space-y-2">
                <p>• 5 patent-pending frameworks</p>
                <p>• CSM Framework methodology</p>
                <p>• SKC ResetFrame™</p>
                <p>• HAIEC platform founder</p>
              </CardDescription>
            </CardHeader>
          </Card>
        </Grid>
      </Section>

      {/* Patent-Pending Frameworks */}
      <Section className="bg-secondary/20">
        <h2 className="text-3xl font-bold mb-8 text-center">Patent-Pending AI Compliance Frameworks</h2>
        <div className="max-w-4xl mx-auto space-y-4">
          <Card className="border-l-4 border-l-primary">
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

          <Card className="border-l-4 border-l-primary">
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

          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Modular Audit Engine
              </CardTitle>
              <CardDescription>
                AI fairness and transparency scoring system with modular architecture. Provides audit-grade 
                documentation and compliance reporting for enterprise deployments.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Precision Drift Detector
              </CardTitle>
              <CardDescription>
                Numerical anomaly detection system for AI model performance monitoring. Identifies drift 
                patterns before they impact business outcomes.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Compliance Fingerprint Layer
              </CardTitle>
              <CardDescription>
                Tamper-evident traceability system for AI decision-making. Creates immutable audit trails 
                for regulatory compliance and forensic analysis.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      {/* Measurable Impact */}
      <Section>
        <h2 className="text-3xl font-bold mb-8 text-center">Measurable Impact</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <CardTitle className="text-lg">Enterprise AI Programs</CardTitle>
              <CardDescription>Delivered on time and budget</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="text-4xl font-bold text-primary mb-2">$50M+</div>
              <CardTitle className="text-lg">Program Portfolios</CardTitle>
              <CardDescription>Managed across Fortune 50</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="text-4xl font-bold text-primary mb-2">100+</div>
              <CardTitle className="text-lg">Stakeholder Teams</CardTitle>
              <CardDescription>Coordinated globally</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="text-4xl font-bold text-primary mb-2">60%</div>
              <CardTitle className="text-lg">Audit Time Reduction</CardTitle>
              <CardDescription>Months to weeks</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      {/* Career Highlights */}
      <Section className="bg-secondary/20">
        <h2 className="text-3xl font-bold mb-8 text-center">Career Highlights</h2>
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                HP Inc. (Fortune 50) | 2023 - Present
              </CardTitle>
              <CardDescription className="text-base space-y-2 mt-2">
                <p className="font-semibold text-foreground">Sr Program Manager - AI Implementation & Governance</p>
                <p>• Lead strategic AI initiatives across enterprise systems serving millions of users</p>
                <p>• Developed 5 patent-pending frameworks for AI compliance and drift detection</p>
                <p>• Manage Core Team of TPMs overseeing 53 applications across multiple platforms</p>
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Human AI Ethics Council (HAIEC) | 2020 - Present
              </CardTitle>
              <CardDescription className="text-base space-y-2 mt-2">
                <p className="font-semibold text-foreground">Founder & CEO</p>
                <p>• Built comprehensive platform for AI governance, compliance, and ethical deployment</p>
                <p>• Created CSM Framework, SKC ResetFrame™, Red Audit Kit, and LegacyShift methodology</p>
                <p>• Serve Fortune 500 clients with proven compliance frameworks</p>
                <p>• Reduce audit preparation time by 60% while managing $150M+ in AI spend</p>
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                15 Years of Enterprise Experience
              </CardTitle>
              <CardDescription className="text-base space-y-2 mt-2">
                <p>• <strong>2018-2022</strong>: Entrepreneur - Business Process Automation & Software Development</p>
                <p>• <strong>2017-2018</strong>: System Engineer II at ACTIVE Network</p>
                <p>• <strong>2016-2017</strong>: System Analyst at Cummins Inc. (Led $10M+ MES implementation)</p>
                <p>• <strong>2013-2016</strong>: Business System Analyst at Centaurus Technology Partners</p>
                <p>• <strong>2010-2011</strong>: Technical Field Operations Lead at Dallas ISD (Gov Contract)</p>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      {/* Education */}
      <Section>
        <h2 className="text-3xl font-bold mb-8 text-center">Education & Certifications</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                M.Sc. Engineering & Technology Management
              </CardTitle>
              <CardDescription className="text-base">
                Louisiana Tech University | 2022
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                B.S. Computer & Information Systems Security
              </CardTitle>
              <CardDescription className="text-base space-y-1">
                <p>Louisiana Tech University | 2014</p>
                <p>• Dean's Honor List & President's Honor List (4.0 GPA)</p>
                <p>• Bulldog Scholarship Recipient</p>
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Certifications
              </CardTitle>
              <CardDescription className="text-base">
                Six Sigma Green Belt • Computer Security Certifications • SSL Understanding
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      {/* What Makes Me Different */}
      <Section className="bg-secondary/20">
        <h2 className="text-3xl font-bold mb-8 text-center">What Makes Me Different</h2>
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>I've Been in the Trenches</CardTitle>
              <CardDescription className="text-base">
                I started as a field technician for a government contractor, worked my way through system 
                engineering and analysis roles, built my own business, and now lead AI strategy at a Fortune 50 
                company. I understand technology from the ground up—not just from the boardroom.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>I Build Frameworks, Not Just Programs</CardTitle>
              <CardDescription className="text-base">
                The CSM Framework, SKC ResetFrame™, and my 5 patent-pending methodologies aren't academic 
                exercises. They're battle-tested systems born from real-world challenges I've encountered and solved.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>I Don't Oversell</CardTitle>
              <CardDescription className="text-base">
                If I say a program will take 6 months, it takes 6 months. If I say we can reduce audit time 
                by 60%, we do. My reputation is built on delivery, not promises.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>I Believe in Leverage</CardTitle>
              <CardDescription className="text-base">
                Whether it's a governance framework that protects millions of users, a program that ships months 
                ahead of schedule, or a mentorship that unlocks someone's potential—the goal is always maximum 
                impact with minimum waste.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      {/* What I'm Looking For */}
      <Section>
        <h2 className="text-3xl font-bold mb-8 text-center">What I'm Looking For</h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Executive Roles
                </CardTitle>
                <CardDescription className="text-base space-y-2">
                  <p>Currently exploring VP/Director positions in:</p>
                  <p>• AI Compliance & Governance Leadership</p>
                  <p>• Enterprise Technical Program Management</p>
                  <p>• AI Strategy & Implementation</p>
                  <p>• Digital Transformation Leadership</p>
                  <p className="pt-2"><strong>Target:</strong> Fortune 500, Series B+ Startups, AI-First Companies</p>
                  <p><strong>Compensation:</strong> $250K - $400K+ (base + equity/bonus)</p>
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Consulting & Advisory
                </CardTitle>
                <CardDescription className="text-base space-y-2">
                  <p>Available for:</p>
                  <p>• AI Proof-of-Concept (POC) Projects</p>
                  <p>• Compliance Framework Implementation</p>
                  <p>• Executive Advisory & Coaching</p>
                  <p>• Fractional Leadership Roles</p>
                  <p className="pt-2"><strong>Engagement:</strong> Project-based, Retainer, or Fractional Executive</p>
                  <p><strong>Rate:</strong> $300 - $500/hour (project minimums apply)</p>
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="text-center text-xl">Why Work With Me</CardTitle>
              <CardDescription className="text-base text-center max-w-3xl mx-auto">
                If you need someone to navigate the complexity of AI compliance at enterprise scale, manage 
                multi-million dollar programs with precision execution, build frameworks that actually work in 
                production, balance innovation velocity with regulatory requirements, and lead global teams 
                through ambiguity and change—then let's talk.
                <br /><br />
                I bring 15 years of experience, 5 patent-pending frameworks, and a track record of delivering 
                results in the most demanding environments. No buzzwords. No fluff. Just strategic systems that 
                work, executed with precision.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      {/* Testimonials */}
      <Section className="bg-secondary/20">
        <h2 className="text-3xl font-bold mb-8 text-center">Testimonials</h2>
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardDescription className="text-base italic text-foreground mb-4">
                "Subodh has an exceptional ability to take complex AI compliance requirements and translate them 
                into actionable frameworks. His work on our enterprise AI governance program reduced our audit 
                preparation time from months to weeks while maintaining the highest standards of regulatory compliance."
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
                "Working with Subodh on AI implementation strategy was transformative. He doesn't just manage 
                programs—he architects systems that actually work at scale. His CSM Framework helped us navigate 
                the complexity of deploying AI across 50+ business units while staying compliant with evolving regulations."
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
                "Subodh's technical program management skills are unmatched. He led our $40M AI compliance initiative 
                with precision, managing 100+ stakeholders across multiple time zones. His ability to balance innovation 
                velocity with regulatory requirements is exactly what enterprises need in the AI era."
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

      {/* Contact CTA */}
      <Section>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Let's Connect</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Ready to discuss how I can help your organization navigate AI compliance, lead enterprise programs, 
            or implement proven frameworks? Let's start a conversation.
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
            <Link href="/">
              <Button size="lg" variant="outline" className="gap-2">
                <Globe className="h-5 w-5" />
                View Full Website
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground mt-8">
            Last Updated: November 2025
          </p>
        </div>
      </Section>
    </>
  )
}
