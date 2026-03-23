'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ArrowRight, Phone, CheckCircle2, ExternalLink, Clock, Calendar, Shield, Zap, Users, TrendingUp } from 'lucide-react'

export default function KestrelVoicePage() {
  const features = [
    {
      icon: Zap,
      title: 'Instant Response',
      description: '200ms response time. Your AI answers before the second ring, every time.'
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Autonomous appointment booking integrated with your calendar and CRM systems.'
    },
    {
      icon: Shield,
      title: 'Emergency Detection',
      description: 'Intelligent routing for urgent calls with priority escalation protocols.'
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Never miss a call again. Your AI assistant works around the clock.'
    }
  ]

  const benefits = [
    'Never miss a client call again',
    'Autonomous intake and qualification',
    'Territory-aware routing',
    'Natural conversation flow',
    'CRM integration ready',
    'Call analytics and insights',
    'Enterprise security standards',
    'Multi-language support'
  ]

  const useCases = [
    {
      title: 'Service Businesses',
      description: 'HVAC, plumbing, electrical, and home services that need 24/7 call coverage and appointment booking.',
      icon: Users,
      stats: '30-60% of calls missed without AI'
    },
    {
      title: 'Freelancers & Consultants',
      description: 'Independent professionals who need professional call handling while focusing on client work.',
      icon: Phone,
      stats: 'Recover missed revenue opportunities'
    },
    {
      title: 'Startups',
      description: 'Early-stage companies that need enterprise-grade phone presence without hiring staff.',
      icon: TrendingUp,
      stats: 'Scale customer service instantly'
    }
  ]

  return (
    <>
      <Hero
        subtitle="AI Voice Operations Platform"
        title={
          <>
            Your Phone.
            <br />
            <span className="gradient-text">Answered by AI.</span>
          </>
        }
        description="AI-powered voice operations for service businesses. Answer every call, book appointments automatically, recover missed revenue. 200ms response, 24/7 coverage."
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <a href="https://www.kestrelvoice.com" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="group animate-glow">
              Try KestrelVoice
              <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </a>
          <Link href="/contact">
            <Button size="lg" variant="outline">
              Schedule Demo
            </Button>
          </Link>
        </motion.div>
      </Hero>

      <Section className="bg-secondary/20">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">The Problem</h2>
          <p className="text-xl text-muted-foreground">
            Most businesses miss <span className="text-primary font-semibold">30-60% of their calls</span>. 
            Every missed call is lost revenue, frustrated customers, and opportunities for competitors.
          </p>
        </div>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">The Solution</h2>
          <p className="text-xl text-muted-foreground">
            One AI phone number. Instant answers. Smart scheduling. Territory-aware routing. 
            Your customers get professional service, you get more business.
          </p>
        </div>
      </Section>

      <Section
        subtitle="Key Features"
        title="What Callers Experience"
        description="Professional, intelligent call handling that feels natural"
      >
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </Section>

      <Section>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Everything You Need</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative shadow-2xl">
                <Image
                  src="/voice-card-showcase.png.png"
                  alt="KestrelVoice Showcase"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      <Section
        subtitle="Perfect For"
        title="Who Uses KestrelVoice?"
        description="Built for professionals who can't afford to miss calls"
        className="bg-secondary/20"
      >
        <div className="grid md:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="h-full p-6 hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                  <p className="text-muted-foreground mb-3">{useCase.description}</p>
                  <p className="text-sm text-primary font-medium">{useCase.stats}</p>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </Section>

      <CTA
        title="Ready to Never Miss a Call Again?"
        description="Join thousands of professionals using KestrelVoice to capture every opportunity. Set up in minutes, start answering calls instantly."
        primaryButton={{ text: 'Start Free Trial', href: 'https://www.kestrelvoice.com' }}
        secondaryButton={{ text: 'Contact Sales', href: '/contact' }}
      />
    </>
  )
}
