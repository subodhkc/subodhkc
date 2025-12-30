'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import Grid from '@/components/Grid'
import NewsletterSignup from '@/components/NewsletterSignup'
import LeadMagnetModal from '@/components/LeadMagnetModal'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ArrowRight, Shield, Zap, Users, TrendingUp, CheckCircle2, BookOpen, Sparkles } from 'lucide-react'

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
    '12+ years Fortune 50 AI compliance experience',
    'Published researcher: EU AI Act, NYC LL144, NIST AI RMF',
    'Founder: Human AI Ethics Council (HAIEC)',
    'Available for consulting & advisory engagements',
    'Proven track record: AI pilots → production systems',
    'Expert witness & regulatory compliance advisor',
  ]

  const clientResults = [
    {
      metric: '100%',
      label: 'Regulatory Compliance',
      description: 'NYC Local Law 144 audit readiness achieved',
    },
    {
      metric: '6 months',
      label: 'Time to Production',
      description: 'AI pilot to compliant production system',
    },
    {
      metric: '$2.4M',
      label: 'Risk Mitigation',
      description: 'Avoided regulatory penalties & rework costs',
    },
  ]

  const recentWork = [
    {
      category: 'Technical Report',
      title: 'Instruction Stack Audit Framework (ISAF)',
      description:
        '9-layer technical specification for AI accountability. Demonstrates EU AI Act, NIST AI RMF, ISO 42001 compliance.',
      href: '/research',
    },
    {
      category: 'Technical Report',
      title: 'Deterministic Bias Detection for NYC LL144',
      description:
        'Reproducibility-first architecture for regulatory compliance. Rule-based pattern matching with cryptographic evidence.',
      href: '/research',
    },
    {
      category: 'Framework',
      title: 'Cognitive Systems Management (CSM)',
      description:
        'Enterprise playbook bridging AI strategy, implementation, and governance for Fortune 50 scale.',
      href: '/research',
    },
  ]

  return (
    <>
      <Hero
        subtitle="AI Compliance Architect"
        title={
          <>
            Turn AI Pilots Into
            <br />
            <span className="gradient-text">Production Systems.</span>
            <br />
            Without Regulatory Risk.
          </>
        }
        description="Enterprise leaders waste millions on AI experiments that never ship. I build the compliance architecture that lets you move fast—legally. Fortune 50 proven."
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Link href="/contact">
            <Button size="lg" className="group animate-glow">
              Start Your Transformation
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/about">
            <Button size="lg" variant="outline">
              See The Framework
            </Button>
          </Link>
        </motion.div>
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
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/50">
                  <CardHeader>
                    <motion.div 
                      className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Icon className="h-6 w-6 text-primary" />
                    </motion.div>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            )
          })}
        </Grid>
      </Section>

      <Section
        subtitle="Client Results"
        title="Measurable Impact on Enterprise AI Programs"
        className="bg-secondary/20 relative overflow-hidden"
      >
        <Grid cols={3} className="mb-12">
          {clientResults.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="text-center p-6 h-full border-2 hover:border-primary/50 transition-all duration-300">
                <motion.div
                  className="text-4xl font-bold text-primary mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                >
                  {result.metric}
                </motion.div>
                <div className="text-lg font-semibold mb-2">{result.label}</div>
                <p className="text-sm text-muted-foreground">{result.description}</p>
              </Card>
            </motion.div>
          ))}
        </Grid>

        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold mb-6 text-center">Experience & Credentials</h3>
          <Grid cols={2} gap="md">
            {achievements.map((achievement, index) => (
              <motion.div 
                key={index} 
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5 animate-pulse-glow" />
                <p className="text-muted-foreground">{achievement}</p>
              </motion.div>
            ))}
          </Grid>
        </div>
      </Section>

      <Section subtitle="Recent Work" title="Insights & Frameworks">
        <Grid cols={3}>
          {recentWork.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              whileHover={{ y: -8 }}
            >
              <Card className="h-full transition-all duration-300 hover:shadow-xl hover:border-primary/50">
                <CardHeader>
                  <motion.div 
                    className="inline-flex items-center rounded-full border border-accent/20 bg-accent/10 px-3 py-1 mb-3 w-fit"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-xs font-medium text-accent">{item.category}</span>
                  </motion.div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{item.description}</p>
                  <Link
                    href={item.href}
                    className="text-primary hover:text-accent transition-colors inline-flex items-center text-sm font-medium group"
                  >
                    Read more
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Grid>
      </Section>

      <Section subtitle="HAIEC Platform" title="The AI Compliance Engine">
        <div className="grid md:grid-cols-2 gap-12 items-center relative">
          <motion.div
            className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
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
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-8 animate-float">
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
          </motion.div>
        </div>
      </Section>

      {/* Lead Magnet CTA */}
      <Section className="bg-secondary/20 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-5"
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage: 'conic-gradient(from 0deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))',
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <h2 className="text-3xl font-bold">
                Get the AI Compliance Framework Guide
              </h2>
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            </div>
            <p className="text-lg text-muted-foreground mb-6">
              Download our comprehensive guide featuring the Cognitive Systems Management (CSM) Framework, 
              5 patent-pending methodologies, and enterprise implementation strategies.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                onClick={() => setIsLeadMagnetOpen(true)}
                className="text-lg px-8 animate-glow"
              >
                Download Free Guide
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
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
