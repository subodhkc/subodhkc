'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Hero from '@/components/Hero'
import Section from '@/components/Section'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ArrowRight, Shield, Phone, Sparkles, Scale, FileText, ExternalLink } from 'lucide-react'

export default function SolutionsPage() {
  const solutions = [
    {
      name: 'HAIEC',
      tagline: 'AI Compliance & Governance Platform',
      description: 'Evidence-first frameworks for behavioral AI governance. CSM6 framework and AI readiness assessments for enterprise compliance.',
      icon: Shield,
      href: '/solutions/haiec',
      external: 'https://www.haiec.com',
      badge: 'Enterprise',
      features: [
        'EU AI Act Compliance',
        'Risk Management System',
        'Audit-Grade Evidence',
        'Runtime Adversarial Testing'
      ],
      color: 'indigo'
    },
    {
      name: 'KestrelVoice',
      tagline: 'AI Voice Operations Platform',
      description: 'AI-powered voice operations for service businesses. Answer every call, book appointments automatically, recover missed revenue with 200ms response time.',
      icon: Phone,
      href: '/solutions/kestrelvoice',
      external: 'https://www.kestrelvoice.com',
      badge: 'Production',
      features: [
        'Autonomous Intake',
        'Smart Scheduling',
        'Emergency Detection',
        '24/7 Availability'
      ],
      color: 'emerald'
    },
    {
      name: 'FrontOfAI',
      tagline: 'Enterprise AI Solutions Platform',
      description: 'Turnkey AI workflows, compliance tools, and intelligence platforms. Everything an executive needs to lead through the AI era.',
      icon: Sparkles,
      href: '/solutions/frontofai',
      external: 'https://frontofai.com',
      badge: 'Live',
      features: [
        'AI Briefing Service',
        'Developer Tools',
        'Compliance First',
        'Production Ready'
      ],
      color: 'cyan'
    },
    {
      name: 'CourtCase',
      tagline: 'AI-Assisted Court Evidence Builder',
      description: 'Transform chaotic evidence into professionally formatted court packets with AI-powered timeline building, OCR, and exhibit management.',
      icon: Scale,
      href: '/solutions/courtcase',
      external: 'https://courtcase.frontofai.com',
      badge: 'Beta',
      features: [
        'Document Processing',
        'Timeline Generation',
        'OCR Engine',
        'Secure & Private'
      ],
      color: 'orange'
    },
    {
      name: 'AI Briefing',
      tagline: 'Weekly AI Intelligence for IT Leaders',
      description: 'Stop reading 50 newsletters. Get one weekly brief that tells you what changed, why it matters, who should care, and what to do next.',
      icon: FileText,
      href: '/solutions/ai-briefing',
      external: 'https://frontofai.com/briefing',
      badge: 'Free',
      features: [
        '45+ Sources Monitored',
        'Impact-Scored Stories',
        'Role-Based Views',
        'Weekly Delivery'
      ],
      color: 'green'
    },
  ]

  return (
    <>
      <Hero
        subtitle="Web Applications Portfolio"
        title={
          <>
            Production-Ready
            <br />
            <span className="gradient-text">AI Solutions</span>
            <br />
            Built for Enterprise Scale
          </>
        }
        description="Explore the suite of AI-powered applications I've built and deployed. From compliance platforms to voice infrastructure, each solution solves real enterprise challenges."
      />

      <Section
        subtitle="Solutions Portfolio"
        title="Enterprise AI Applications"
        description="Production-ready applications serving thousands of users across compliance, voice operations, and AI intelligence."
      >
        <div className="space-y-8">
          {solutions.map((solution, index) => {
            const Icon = solution.icon
            return (
              <motion.div
                key={solution.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 p-6">
                      <CardHeader className="p-0 mb-4">
                        <div className="flex items-start gap-4 mb-3">
                          <div className={`w-14 h-14 rounded-xl bg-${solution.color}-500/10 flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`h-7 w-7 text-${solution.color}-500`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <CardTitle className="text-2xl">{solution.name}</CardTitle>
                              <span className={`text-xs px-3 py-1 rounded-full bg-${solution.color}-500/10 text-${solution.color}-500 font-medium`}>
                                {solution.badge}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">{solution.tagline}</p>
                          </div>
                        </div>
                        <CardDescription className="text-base leading-relaxed">
                          {solution.description}
                        </CardDescription>
                      </CardHeader>

                      <div className="flex flex-wrap gap-3 mb-4">
                        {solution.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-3 py-1.5 rounded-full bg-secondary text-foreground border border-border"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Link href={solution.href}>
                          <Button variant="default" className="group">
                            Learn More
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </Link>
                        <a href={solution.external} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" className="group">
                            Visit Live Site
                            <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </a>
                      </div>
                    </div>

                    <div className={`bg-gradient-to-br from-${solution.color}-500/10 to-${solution.color}-500/5 p-6 flex items-center justify-center`}>
                      <div className="text-center">
                        <Icon className={`h-24 w-24 text-${solution.color}-500/30 mx-auto mb-4`} />
                        <p className="text-sm text-muted-foreground">Production Application</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </Section>

      <Section className="bg-secondary/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            I build production-ready AI applications for enterprise clients. From concept to deployment, 
            I can help you create scalable, compliant solutions tailored to your needs.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="group">
                Discuss Your Project
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline">
                View Services
              </Button>
            </Link>
          </div>
        </div>
      </Section>
    </>
  )
}
