import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Grid from '@/components/Grid'
import { Shield, Briefcase, Users, Zap, CheckCircle2, TrendingUp, Target, Award } from 'lucide-react'

export const metadata = {
  title: 'Services - AI Governance & Program Leadership',
  description: 'Enterprise AI compliance, governance frameworks, technical program management, and executive advisory services. From POC to production-grade systems.',
}

export default function ServicesPage() {
  const services = [
    {
      icon: Shield,
      title: 'AI Compliance & Governance',
      description: 'Enterprise-grade governance frameworks that meet regulatory requirements while enabling innovation.',
      features: [
        'EU AI Act, GDPR, NIST compliance implementation',
        'Audit readiness programs (60% time reduction)',
        'Real-time regulatory enforcement systems',
        'Model documentation and risk scoring',
      ],
      deliverables: 'Compliance frameworks, audit documentation, governance playbooks',
    },
    {
      icon: Briefcase,
      title: 'Technical Program Leadership',
      description: 'End-to-end program management for complex AI initiatives at Fortune 50 scale.',
      features: [
        'Multi-stakeholder program orchestration (100+ teams)',
        '$50M+ portfolio management',
        'Global deployment coordination',
        'Risk mitigation and strategic execution',
      ],
      deliverables: 'Program roadmaps, execution frameworks, stakeholder alignment',
    },
    {
      icon: Zap,
      title: 'AI Proof-of-Concept (POC) Projects',
      description: 'Rapid validation of AI use cases with production-ready architecture from day one.',
      features: [
        'Use case validation and feasibility analysis',
        'Prototype development with compliance built-in',
        'Production readiness assessment',
        'Scalability and risk evaluation',
      ],
      deliverables: 'Working prototypes, technical documentation, production roadmap',
    },
    {
      icon: Users,
      title: 'Executive Advisory & Coaching',
      description: 'Strategic guidance for executives navigating AI transformation and regulatory complexity.',
      features: [
        'AI strategy development and roadmap planning',
        'Regulatory landscape navigation',
        'Organizational readiness assessment',
        'Executive coaching and mentorship',
      ],
      deliverables: 'Strategic plans, risk assessments, executive briefings',
    },
    {
      icon: TrendingUp,
      title: 'Drift Detection & Monitoring',
      description: 'Patent-pending frameworks for identifying AI system degradation before it impacts users.',
      features: [
        'Precision drift detection implementation',
        'Real-time monitoring dashboards',
        'Automated alerting and remediation',
        'Root cause analysis frameworks',
      ],
      deliverables: 'Monitoring systems, alert configurations, RCA playbooks',
    },
    {
      icon: Target,
      title: 'Fractional Leadership',
      description: 'Part-time executive leadership for organizations needing AI governance expertise.',
      features: [
        'VP/Director-level strategic oversight',
        'Team building and capability development',
        'Framework implementation and adoption',
        'Vendor evaluation and technology selection',
      ],
      deliverables: 'Strategic direction, team development, operational frameworks',
    },
  ]

  const engagementModels = [
    {
      icon: CheckCircle2,
      title: 'Project-Based',
      description: 'Fixed-scope engagements with clear deliverables and timelines.',
      duration: '3-6 months',
      ideal: 'POC projects, compliance implementations, framework development',
    },
    {
      icon: Award,
      title: 'Retainer',
      description: 'Ongoing advisory and strategic guidance with flexible scope.',
      duration: '6-12 months',
      ideal: 'Executive advisory, continuous improvement, strategic planning',
    },
    {
      icon: Users,
      title: 'Fractional Executive',
      description: 'Part-time leadership role embedded in your organization.',
      duration: '12+ months',
      ideal: 'Building AI governance function, team development, long-term transformation',
    },
  ]

  return (
    <>
      <Hero
        title={
          <>
            Services That Bridge
            <br />
            <span className="gradient-text">AI Ambition & Reality</span>
          </>
        }
        description="From POC to production-grade systems. From regulatory chaos to operational maturity. I help organizations build AI systems that work at scale—safely, compliantly, and reliably."
      />

      <Section subtitle="What I Offer" title="Core Services">
        <div className="max-w-6xl mx-auto space-y-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                      <CardDescription className="text-base mb-4">
                        {service.description}
                      </CardDescription>
                      
                      <div className="grid md:grid-cols-2 gap-6 mt-4">
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">What's Included:</h4>
                          <ul className="space-y-1">
                            {service.features.map((feature, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Deliverables:</h4>
                          <p className="text-sm text-muted-foreground">{service.deliverables}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </Section>

      <Section subtitle="How We Work" title="Engagement Models" className="bg-secondary/20">
        <Grid cols={3}>
          {engagementModels.map((model, index) => {
            const Icon = model.icon
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{model.title}</CardTitle>
                  <CardDescription className="space-y-3">
                    <p>{model.description}</p>
                    <div className="pt-2 border-t border-border">
                      <p className="text-sm"><strong>Duration:</strong> {model.duration}</p>
                      <p className="text-sm mt-2"><strong>Ideal for:</strong> {model.ideal}</p>
                    </div>
                  </CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </Grid>
      </Section>

      <Section subtitle="Investment" title="Pricing">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="text-2xl mb-2">Consulting & Advisory</CardTitle>
                <div className="text-4xl font-bold text-primary mb-4">$300 - $500<span className="text-lg text-muted-foreground">/hour</span></div>
                <CardDescription className="text-base space-y-2">
                  <p>• Project minimums apply</p>
                  <p>• Volume discounts available</p>
                  <p>• Retainer options for ongoing work</p>
                  <p className="pt-2 text-foreground"><strong>Typical Projects:</strong> $25K - $150K</p>
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="text-2xl mb-2">Fractional Executive</CardTitle>
                <div className="text-4xl font-bold text-primary mb-4">Custom<span className="text-lg text-muted-foreground"> pricing</span></div>
                <CardDescription className="text-base space-y-2">
                  <p>• Based on time commitment (20-40%)</p>
                  <p>• Equity options available</p>
                  <p>• Minimum 6-month engagement</p>
                  <p className="pt-2 text-foreground"><strong>Typical Range:</strong> $10K - $25K/month</p>
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card className="mt-8 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-center">Full-Time Opportunities</CardTitle>
              <CardDescription className="text-base text-center">
                Also open to Director/VP roles at Fortune 500, Series B+ startups, and AI-first companies.
                <br />
                <strong className="text-foreground">Target compensation:</strong> $250K - $400K+ (base + equity/bonus)
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      <Section subtitle="Why Work With Me" title="What Makes This Different" className="bg-secondary/20">
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
              <CardTitle>I've Operated at Every Altitude</CardTitle>
              <CardDescription className="text-base">
                From field technician → system engineer → program manager → founder → enterprise AI strategist. 
                I understand every layer of the stack, technical and human. This means I can translate between 
                engineering, legal, risk, and executive stakeholders.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle>No Buzzwords. Just Systems That Work.</CardTitle>
              <CardDescription className="text-base">
                If I say a program will take 6 months, it takes 6 months. If I say we can reduce audit time by 60%, 
                we do. My reputation is built on delivery, not promises. Everything I build is battle-tested at 
                Fortune 50 scale.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      <CTA
        title="Let's Discuss Your AI Challenge"
        description="Whether you need help with compliance, program leadership, or building frameworks that scale—I bring 15 years of experience, 5 patent-pending methodologies, and a track record of delivering results in the most demanding environments."
        primaryButton={{ text: 'Schedule a Conversation', href: '/contact' }}
        secondaryButton={{ text: 'View Executive Bio', href: '/executive-bio' }}
      />
    </>
  )
}
