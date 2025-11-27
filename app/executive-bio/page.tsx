import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Section from '@/components/Section'
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
  Globe
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Executive Bio - Subodh KC | Director of AI Programs',
  description: 'Builder of Systems That Don\'t Break. 15 years from field operations to Fortune 50 AI strategy. 5 patent-pending frameworks. $50M+ portfolios. This is the story behind the systems.',
}

export default function ExecutiveBioPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="section-container py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            SUBODH KC
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground font-semibold mb-2">
            Director of AI Programs | AI Compliance Architect
          </p>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Builder of Systems That Don't Break
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
            <span>📍 Dallas / Austin, TX</span>
            <span>•</span>
            <span>🌐 Open to Remote or Relocation</span>
          </div>
        </div>
      </section>

      {/* The Story */}
      <Section className="bg-secondary/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Executive Profile — The Story Behind the Systems</h2>
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Some leaders arrive through prestige.</strong><br />
              <strong className="text-foreground">Others arrive through survival.</strong>
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              I entered technology on the ground floor: fixing computers in underfunded schools, documenting broken systems, 
              learning—up close—how much damage a bad workflow or a single misconfigured system can cause. I wasn't groomed 
              for leadership. I earned it one failure mode at a time.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              From those early field operations, I developed a trait that has shaped my entire career:{' '}
              <strong className="text-foreground">I don't accept chaos as "the way things are." I build structures that eliminate it.</strong>
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Fast forward 15 years.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              I now architect AI governance frameworks for a Fortune 50 company, manage multimillion-dollar AI portfolios, 
              deploy systems used by millions, and design compliance architectures that withstand legal, operational, and 
              engineering scrutiny. I built a governance platform (HAIEC) from scratch—quietly adopted in enterprise settings—and 
              authored five patent-pending frameworks in drift detection, audit automation, and real-time AI enforcement.
            </p>
            <p className="text-lg text-foreground font-semibold leading-relaxed">
              I bridge the world between AI ambition and organizational reality.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Most people see growing regulatory pressure as a blocker.<br />
              I see it as a blueprint.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Where others ship models, I ship systems that protect organizations from the failure modes they didn't even know existed.
            </p>
            <p className="text-xl text-foreground font-bold leading-relaxed">
              This is why teams trust me to lead the programs that matter.
            </p>
          </div>
        </div>
      </Section>

      {/* Signature Value */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Signature Value</h2>
          <Card className="border-2 border-primary bg-primary/5">
            <CardHeader>
              <CardDescription className="text-lg text-foreground text-center">
                <strong>I protect organizations from invisible risks before they become front-page news.</strong>
                <br /><br />
                My frameworks predict drift, detect sabotage paths, expose hidden compliance debt, and create governance 
                structures that scale across dozens of teams.
                <br /><br />
                I've done this inside Fortune 50 engineering orgs, in high-stake product ecosystems, and in global deployments 
                with legal, engineering, security, and PMO all watching closely.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      {/* Capabilities */}
      <Section className="bg-secondary/20">
        <h2 className="text-3xl font-bold mb-8 text-center">Capabilities</h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>AI Compliance & Governance</CardTitle>
              <CardDescription className="text-base space-y-2">
                <p>• Enterprise AI oversight aligned to EU AI Act, GDPR, NIST, NYC 144</p>
                <p>• Model documentation, risk scoring, audit automation</p>
                <p>• Precision drift detection</p>
                <p>• Governance structures for multi-application ecosystems</p>
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Enterprise Technical Program Leadership</CardTitle>
              <CardDescription className="text-base space-y-2">
                <p>• Led 53 enterprise applications spanning Education, Manageability & Conferencing</p>
                <p>• Delivered 50+ AI programs, managing $50M+ portfolios</p>
                <p>• Built multi-team execution engines across 100+ stakeholders</p>
                <p>• Created cross-org alignment frameworks used in global operations</p>
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
                <p>• Designed AI systems serving millions across Fortune 50 platforms</p>
                <p>• Built traceability, explainability, and compliance fingerprinting layers</p>
                <p>• Deep expertise in operational risk, regulatory enforcement, and system integrity</p>
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Innovation & Patents</CardTitle>
              <CardDescription className="text-base space-y-2">
                <p><strong>5 Patent-Pending Systems:</strong></p>
                <p>• Adversarial Project Twin™</p>
                <p>• Precision Drift Detector™</p>
                <p>• AI Compliance Twin™</p>
                <p>• Modular Audit Engine™</p>
                <p>• Compliance Fingerprint Layer™</p>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      {/* The Career */}
      <Section>
        <h2 className="text-3xl font-bold mb-8 text-center">The Career (Told Clearly)</h2>
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-xl">HP INC. (FORTUNE 50) — Senior Program Manager, AI Implementation & Governance</CardTitle>
              <CardDescription className="text-sm text-muted-foreground mb-4">2023–Present</CardDescription>
              <CardDescription className="text-base space-y-3">
                <p className="text-foreground">
                  At HP, I'm responsible for something simple in description, brutal in execution:<br />
                  <strong>Make AI safe, compliant, scalable, and reliable across 53 global applications.</strong>
                </p>
                <p>My work includes:</p>
                <p>• Orchestrating enterprise-wide AI rollouts with 100+ stakeholders</p>
                <p>• Managing a combined $50M+ AI portfolio</p>
                <p>• Developing five patent-pending compliance and drift frameworks</p>
                <p>• Reducing audit preparation from months to weeks</p>
                <p>• Leading TPMs across Education, Manageability, and Conferencing ecosystems</p>
                <p>• Setting strategy for AI governance during regulatory uncertainty</p>
                <p className="text-foreground italic pt-2">
                  I operate at a quiet but critical tier: where engineering meets legal, meets risk, meets executive expectation.
                </p>
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-xl">HAIEC — Founder & Chief Architect</CardTitle>
              <CardDescription className="text-sm text-muted-foreground mb-4">2020–Present</CardDescription>
              <CardDescription className="text-base space-y-3">
                <p className="text-foreground">
                  HAIEC is not a startup story.<br />
                  <strong>It's a systems story.</strong>
                </p>
                <p>
                  I built HAIEC because AI governance was becoming chaos across the industry—scattered standards, 
                  inconsistent documentation, no visibility into drift, no shared accountability.
                </p>
                <p>HAIEC introduced:</p>
                <p>• <strong>CSM6™</strong>: A governance model for enterprise AI delivery</p>
                <p>• <strong>Red Audit Kit™</strong>: A forensic toolkit for compliance blind spots</p>
                <p>• <strong>LegacyShift™</strong>: Modernization pathways for legacy systems used by global teams</p>
                <p>• Frameworks that reduced compliance prep by 60%</p>
                <p className="text-foreground italic pt-2">
                  This platform is used by enterprise teams to turn regulatory pressure into operational maturity.
                </p>
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-xl">Earlier Technical Roles (Condensed but Relevant)</CardTitle>
              <CardDescription className="text-base space-y-2">
                <p>• <strong>ACTIVE Network</strong> – System Engineer II: Release automation, QA, incident workflows</p>
                <p>• <strong>Cummins (via TCS)</strong> – System Analyst: $10M MES implementation, 400+ stations deployed</p>
                <p>• <strong>Centaurus</strong> – Business Systems Analyst: Red Hat & AWS platform delivery</p>
                <p>• <strong>Louisiana Tech</strong> – IP Strategist: IP valuation & commercialization</p>
                <p>• <strong>Dallas ISD</strong> – Field Ops Lead: Government contractor; tech modernization initiative</p>
                <p className="text-foreground italic pt-2">
                  Each of these roles taught me something different: scale, reliability, risk, ambiguity, and how to lead people through all of it.
                </p>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      {/* Measurable Impact */}
      <Section className="bg-secondary/20">
        <h2 className="text-3xl font-bold mb-8 text-center">Measurable Impact</h2>
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
              <div className="text-5xl font-bold text-primary mb-2">60%</div>
              <CardTitle className="text-lg">Audit Prep Reduction</CardTitle>
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
              <CardTitle className="text-lg">Stakeholders Orchestrated</CardTitle>
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
              <div className="text-5xl font-bold text-primary mb-2">Millions</div>
              <CardTitle className="text-lg">Users Protected</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </Section>

      {/* What Makes Me Different */}
      <Section>
        <h2 className="text-3xl font-bold mb-8 text-center">What Makes Me Different</h2>
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle>1. I See Failure Modes Before They Emerge</CardTitle>
              <CardDescription className="text-base">
                Years of drift detection, RCA, and governance work have trained me to anticipate what most teams 
                discover only after outages or audit failures.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle>2. I Design Frameworks That Survive Contact With Real Organizations</CardTitle>
              <CardDescription className="text-base">
                Compliance is useless if engineers won't follow it.<br />
                Engineering is dangerous if compliance can't see it.<br />
                My systems bridge both worlds.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle>3. I Make Ambiguity Executable</CardTitle>
              <CardDescription className="text-base">
                When teams don't know how to proceed, I create structures that turn confusion into predictable delivery.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle>4. I've Operated at Every Altitude</CardTitle>
              <CardDescription className="text-base">
                From field technician → system engineer → program manager → founder → enterprise AI strategist.<br />
                I understand every layer of the stack, technical and human.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      {/* Roles I Am Built For */}
      <Section className="bg-secondary/20">
        <h2 className="text-3xl font-bold mb-8 text-center">Roles I Am Built For</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Director / Senior Director
              </CardTitle>
              <CardDescription className="text-base space-y-2">
                <p>• AI Programs</p>
                <p>• AI Governance & Risk</p>
                <p>• Engineering Operations</p>
                <p>• Responsible AI / Compliance Tech</p>
                <p className="pt-2"><strong>Compensation:</strong> $250K - $400K+ (base + equity/bonus)</p>
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Consulting / Fractional
              </CardTitle>
              <CardDescription className="text-base space-y-2">
                <p>• AI Governance Architecture</p>
                <p>• Risk & Compliance Acceleration</p>
                <p>• Enterprise Drift Detection</p>
                <p>• POC Delivery & Executive Advisory</p>
                <p className="pt-2"><strong>Rate:</strong> $300 - $500/hour (project minimums apply)</p>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      {/* The Personal Note */}
      <Section className="bg-primary/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">The Personal Note (Why This Work Matters to Me)</h2>
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              I grew up navigating systems that weren't designed for people like me.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              So I became someone who designs better systems.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Not just faster or smarter—<strong className="text-foreground">safer, fairer, more accountable.</strong>
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              AI will shape the next century. My mission is to ensure it does so without repeating the failures of the last one: 
              hidden bias, silent drift, ungoverned decisions, and operational fragility.
            </p>
            <p className="text-lg text-foreground font-semibold leading-relaxed">
              Everything I build—frameworks, programs, platforms, patents—follows one philosophy:
            </p>
            <p className="text-2xl text-foreground font-bold leading-relaxed text-center py-6">
              If a system can harm people, it must be governed as seriously as it is engineered.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed text-center">
              This isn't just my work.<br />
              <strong className="text-foreground">It's my discipline.</strong>
            </p>
          </div>
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
