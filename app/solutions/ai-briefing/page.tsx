'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ArrowRight, FileText, CheckCircle2, ExternalLink, TrendingUp, Users, Shield, Zap, Globe, Building } from 'lucide-react'

export default function AIBriefingPage() {
  const features = [
    {
      icon: Globe,
      title: '45+ Sources Monitored',
      description: 'From MIT to TechCrunch to White House briefings. Comprehensive coverage of AI developments.',
      stat: '45+'
    },
    {
      icon: TrendingUp,
      title: 'Impact-Scored Stories',
      description: 'Every item rated 1-10 for IT relevance. Focus on what actually matters to your organization.',
      stat: '1-10'
    },
    {
      icon: Users,
      title: 'Role-Based Views',
      description: 'CTO, TPM, or Executive—get what matters to you. Customized intelligence for your role.',
      stat: '3+'
    },
    {
      icon: Zap,
      title: 'Weekly Delivery',
      description: 'One comprehensive brief every week. No daily noise, just actionable intelligence.',
      stat: '1/week'
    }
  ]

  const sources = [
    {
      category: 'Government & Regulatory',
      items: ['White House AI Policy', 'EU Commission', 'FTC & SEC', 'NIST & CISA', 'DOJ & FDA', 'UK Government', 'China MIIT']
    },
    {
      category: 'Research Institutions',
      items: ['MIT CSAIL', 'Stanford HAI', 'UC Berkeley AI', 'CMU ML', 'Oxford FHI', 'Cambridge LCFI', 'Mila Quebec', 'Tsinghua AI']
    },
    {
      category: 'Industry Leaders',
      items: ['OpenAI', 'Anthropic', 'Google DeepMind', 'Microsoft AI', 'Meta AI', 'Amazon AWS AI', 'NVIDIA AI', 'Apple ML']
    },
    {
      category: 'Security & Compliance',
      items: ['CVE/MITRE', 'OWASP AI', 'AI Incident DB', 'MITRE ATLAS', 'Security Research']
    },
    {
      category: 'Academic & Technical',
      items: ['ArXiv AI', 'Nature AI', 'IEEE AI', 'ACM Digital', 'NeurIPS', 'ICML', 'Distill', 'Semantic Scholar']
    },
    {
      category: 'Industry News',
      items: ['TechCrunch AI', 'Wired AI', 'MIT Tech Review', 'VentureBeat', 'The Verge']
    }
  ]

  const benefits = [
    'Stop reading 50 newsletters',
    'Get one weekly brief',
    'Know what changed',
    'Understand why it matters',
    'See who should care',
    'Learn what to do next',
    'Save 5+ hours per week',
    'Make informed decisions'
  ]

  const roles = [
    {
      title: 'CTO View',
      description: 'Technical architecture decisions, infrastructure impacts, and engineering implications.',
      icon: Shield
    },
    {
      title: 'TPM View',
      description: 'Program planning, timeline impacts, resource allocation, and cross-functional coordination.',
      icon: Users
    },
    {
      title: 'Executive View',
      description: 'Strategic implications, competitive landscape, regulatory risks, and business opportunities.',
      icon: Building
    }
  ]

  return (
    <>
      <Hero
        subtitle="Weekly AI Intelligence for IT Leaders"
        title={
          <>
            Stop Reading 50 Newsletters.
            <br />
            <span className="gradient-text">Get One Weekly Brief.</span>
          </>
        }
        description="Get one weekly brief that tells you what changed, why it matters, who should care, and what to do next. Built for IT leaders who need signal, not noise."
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <a href="https://frontofai.com/briefing" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="group animate-glow">
              Try AI Briefing Free
              <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </a>
          <a href="https://frontofai.com/briefing/weekly" target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="outline">
              See Sample Brief
            </Button>
          </a>
        </motion.div>
      </Hero>

      <Section className="bg-secondary/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">The Problem</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Your team is overwhelmed by AI updates, vendor pitches, and security alerts. 
            You're subscribed to 50+ newsletters but still miss critical developments.
          </p>
          <h2 className="text-3xl font-bold mb-4">The Solution</h2>
          <p className="text-xl text-muted-foreground">
            One weekly brief. Impact-scored. Role-filtered. Actionable. 
            Everything you need to stay ahead, nothing you don't.
          </p>
        </div>
      </Section>

      <Section
        subtitle="Key Features"
        title="What You Get"
        description="Comprehensive AI intelligence delivered weekly"
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
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-2xl font-bold text-primary">{feature.stat}</span>
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
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Why AI Briefing?</h2>
          <div className="grid md:grid-cols-2 gap-4">
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
        </div>
      </Section>

      <Section
        subtitle="Tailored Intelligence"
        title="Role-Based Views"
        description="Get the information that matters for your role"
        className="bg-secondary/20"
      >
        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((role, index) => {
            const Icon = role.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="h-full text-center p-6 hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{role.title}</h3>
                  <p className="text-muted-foreground">{role.description}</p>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </Section>

      <Section>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Intelligence Sources</h2>
          <p className="text-center text-muted-foreground mb-8">
            We monitor 45+ authoritative sources so you don't have to
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {sources.map((source, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="p-6 h-full">
                  <h3 className="font-semibold mb-3 text-primary">{source.category}</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {source.items.map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-secondary/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Example Brief Items</h2>
          <div className="space-y-4">
            <Card className="p-6 text-left">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">OpenAI releases GPT-5 with enterprise security features</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">Impact: 9/10</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Affects: API integrations, security policies
              </p>
              <p className="text-sm text-muted-foreground">
                What to do: Review current OpenAI integrations, assess security policy updates needed
              </p>
            </Card>
            <Card className="p-6 text-left">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">EU AI Act enforcement timeline announced</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">Impact: 8/10</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Affects: Compliance, legal review
              </p>
              <p className="text-sm text-muted-foreground">
                What to do: Schedule compliance audit, engage legal counsel for EU operations
              </p>
            </Card>
            <Card className="p-6 text-left">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">New vector database benchmark results</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">Impact: 6/10</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Affects: Infrastructure planning
              </p>
              <p className="text-sm text-muted-foreground">
                What to do: Review current vector DB performance, consider migration if applicable
              </p>
            </Card>
          </div>
        </div>
      </Section>

      <CTA
        title="Ready to Stay Ahead?"
        description="Join IT leaders who trust AI Briefing for their weekly AI intelligence. Free to subscribe, invaluable for decision-making."
        primaryButton={{ text: 'Subscribe Free', href: 'https://frontofai.com/briefing' }}
        secondaryButton={{ text: 'See Sample', href: 'https://frontofai.com/briefing/weekly' }}
      />
    </>
  )
}
