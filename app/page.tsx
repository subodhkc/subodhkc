'use client'

import { useState } from 'react'
import Link from 'next/link'
import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import Grid from '@/components/Grid'
import NewsletterSignup from '@/components/NewsletterSignup'
import LeadMagnetModal from '@/components/LeadMagnetModal'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ArrowRight, Shield, Zap, Users, TrendingUp, CheckCircle2, BookOpen } from 'lucide-react'

export default function Home() {
  const [isLeadMagnetOpen, setIsLeadMagnetOpen] = useState(false)
  const expertise = [
    {
      icon: Shield,
      title: 'AI Compliance Architecture',
      description:
        'Building enterprise-grade AI governance frameworks that meet regulatory requirements while enabling innovation at scale.',
    },
    {
      icon: Zap,
      title: 'Technical Program Leadership',
      description:
        'Driving complex, multi-stakeholder programs across global enterprise environments with precision execution.',
    },
    {
      icon: TrendingUp,
      title: 'Cognitive Systems Management',
      description:
        'Pioneering methodologies that bridge AI implementation strategy with operational governance and risk management.',
    },
    {
      icon: Users,
      title: 'Executive Advisory',
      description:
        'Strategic counsel for C-suite leaders navigating AI adoption, compliance readiness, and digital transformation.',
    },
  ]

  const achievements = [
    'Leading AI strategy at Fortune 50 enterprise',
    'Founder and leader of Human AI Ethics Council (HAIEC)',
    '12+ years driving enterprise-scale technical programs',
    'Published thought leader on AI governance and compliance',
    'Dean\'s Honor List & President\'s Honor List recognition',
    'Advisor to organizations on AI regulatory readiness',
  ]

  const recentWork = [
    {
      category: 'Research',
      title: 'From AI Pilots to Regulatory Readiness',
      description:
        'The governance framework enterprise leaders are adopting to transition from experimentation to production-grade AI systems.',
      href: '/writing',
    },
    {
      category: 'Thought Leadership',
      title: 'Why Enterprise AI Integration Strategies Fail',
      description:
        'Analyzing the common pitfalls in enterprise AI adoption and the architectural decisions that separate success from expensive experiments.',
      href: '/writing',
    },
    {
      category: 'Framework',
      title: 'Cognitive Systems Management (CSM)',
      description:
        'An all-in-one playbook for AI implementation that addresses governance, risk, and operational excellence.',
      href: '/research',
    },
  ]

  return (
    <>
      <Hero
        subtitle="AI Compliance Architect"
        title={
          <>
            Strategic Systems.
            <br />
            <span className="gradient-text">Sharp Execution.</span>
            <br />
            AI Compliance at Scale.
          </>
        }
        description="Leading AI strategy and compliance at Fortune 50. Building governance frameworks that enable innovation while meeting enterprise regulatory requirements."
      >
        <Link href="/contact">
          <Button size="lg" className="group">
            Work with me
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
        <Link href="/about">
          <Button size="lg" variant="outline">
            Learn more
          </Button>
        </Link>
      </Hero>

      <Section
        subtitle="Core Expertise"
        title="Building AI Systems That Scale. Securely."
        description="At the intersection of technical program management, AI governance, and enterprise compliance."
      >
        <Grid cols={2}>
          {expertise.map((item, index) => {
            const Icon = item.icon
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </Grid>
      </Section>

      <Section
        subtitle="Track Record"
        title="Proven Results Across Enterprise & Startup"
        className="bg-secondary/20"
      >
        <div className="max-w-4xl">
          <Grid cols={2} gap="md">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground">{achievement}</p>
              </div>
            ))}
          </Grid>
        </div>
      </Section>

      <Section subtitle="Recent Work" title="Insights & Frameworks">
        <Grid cols={3}>
          {recentWork.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="inline-flex items-center rounded-full border border-accent/20 bg-accent/10 px-3 py-1 mb-3 w-fit">
                  <span className="text-xs font-medium text-accent">{item.category}</span>
                </div>
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{item.description}</p>
                <Link
                  href={item.href}
                  className="text-primary hover:text-accent transition-colors inline-flex items-center text-sm font-medium"
                >
                  Read more
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section subtitle="HAIEC Platform" title="The AI Compliance Engine">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-semibold mb-4">
              Human AI Ethics Council
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              HAIEC is a comprehensive platform for AI governance, compliance, and ethical deployment at enterprise scale. Built on years of real-world implementation experience, it provides the tools, frameworks, and audit capabilities organizations need to deploy AI responsibly.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Precision drift detection and monitoring</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Red Audit Kit for comprehensive assessments</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">LegacyShift framework for modernization</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Cognitive Systems Management methodology</span>
              </li>
            </ul>
            <Link href="/haiec">
              <Button className="group">
                Explore HAIEC
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          <Card className="p-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wider">
                  Core Modules
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-sm text-muted-foreground">Compliance Engine</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-accent" />
                    <span className="text-sm text-muted-foreground">Audit & Assessment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-sm text-muted-foreground">Risk Management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-accent" />
                    <span className="text-sm text-muted-foreground">Governance Frameworks</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground italic">
                  "Bridging the gap between AI innovation and regulatory compliance for global enterprises."
                </p>
              </div>
            </div>
          </Card>
        </div>
      </Section>

      {/* Lead Magnet CTA */}
      <Section className="bg-secondary/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Get the AI Compliance Framework Guide
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Download our comprehensive guide featuring the Cognitive Systems Management (CSM) Framework, 
            5 patent-pending methodologies, and enterprise implementation strategies.
          </p>
          <Button 
            size="lg" 
            onClick={() => setIsLeadMagnetOpen(true)}
            className="text-lg px-8"
          >
            Download Free Guide
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </Section>

      {/* Newsletter Signup */}
      <Section>
        <NewsletterSignup />
      </Section>

      <CTA
        title="Ready to Build Compliant AI at Scale?"
        description="Whether you're starting your AI governance journey or scaling existing systems, I can help you navigate the complexity and build frameworks that work."
        primaryButton={{ text: 'Schedule a consultation', href: '/contact' }}
        secondaryButton={{ text: 'View advisory services', href: '/advisory' }}
      />

      {/* Lead Magnet Modal */}
      <LeadMagnetModal 
        isOpen={isLeadMagnetOpen} 
        onClose={() => setIsLeadMagnetOpen(false)} 
      />
    </>
  )
}
