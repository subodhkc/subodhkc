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
import ProfileCard from '@/components/ProfileCard'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ArrowRight, Shield, Zap, Users, TrendingUp, CheckCircle2, BookOpen, Sparkles, FileText, Download, ExternalLink, Award, Building2, Code } from 'lucide-react'

export default function Home() {
  const [isLeadMagnetOpen, setIsLeadMagnetOpen] = useState(false)

  const services = [
    {
      icon: Shield,
      title: 'AI Governance Architecture',
      description:
        'Building governance systems that make compliance your competitive advantage—not your bottleneck. EU AI Act, NIST AI RMF, ISO 42001 translated into frameworks that accelerate deployment.',
    },
    {
      icon: Zap,
      title: 'Strategic AI Advisory',
      description:
        'Advising C-suite and boards on AI strategy that balances velocity with responsibility. From vision to production, I help leaders make decisions that compound over time.',
    },
    {
      icon: Code,
      title: 'Enterprise AI Systems',
      description:
        'Deploying production systems that prove governance works at scale. Voice AI, compliance automation, intelligence platforms—built to perform under regulatory scrutiny.',
    },
    {
      icon: Building2,
      title: 'Platform Engineering',
      description:
        'Engineering platforms that balance innovation speed with operational excellence. Sixteen years building systems that scale—from startups to Fortune 50.',
    },
  ]

  const credentials = [
    'Former Fortune 50 AI Strategy CTL',
    'M.Sc. Engineering & Technology Management, Louisiana Tech',
    '16+ years full-stack engineering experience',
    'Published AI compliance researcher',
    'Founder: HAIEC (Holistic AI Ethics and Compliance)',
    'Father of two daughters | Dallas, Texas',
  ]

  const achievements = [
    {
      metric: '100%',
      label: 'Regulatory Compliance',
      description: 'Zero audit findings across NYC LL144 assessments',
    },
    {
      metric: '16+',
      label: 'Years Experience',
      description: 'Backend to boardroom—full-stack perspective',
    },
    {
      metric: 'Fortune 50',
      label: 'Enterprise Scale',
      description: 'Led AI strategy where mistakes cost millions',
    },
  ]

  const whitepapers = [
    {
      title: 'From Industrial Electrification to Artificial Intelligence',
      subtitle: 'Institutional Lessons from Construction Governance for AI Risk Regulation',
      description: 'Analyzes historical evolution of construction governance and maps these trajectories to contemporary AI governance developments. AI resembles industrial electrification: infrastructure-like, horizontally embedded, and systemically consequential.',
      topics: ['AI Governance', 'Regulatory Frameworks', 'Institutional Theory', 'General-Purpose Technology'],
      pages: '28 pages',
      date: 'February 2025',
      downloadUrl: 'https://zenodo.org/records/18664344',
      icon: FileText
    },
    {
      title: 'The CSM6 Framework',
      subtitle: 'A New Standard for AI Compliance',
      description: 'Comprehensive guide to the CSM6 (Compliance State Machine 6) framework. Learn how deterministic state machines ensure reproducible compliance assessments.',
      topics: ['CSM6 Architecture', 'State Machine Design', 'Readiness Rules', 'Evidence Generation'],
      pages: '42 pages',
      date: 'December 2024',
      downloadUrl: 'https://www.haiec.com/resources/whitepapers',
      icon: Shield
    },
    {
      title: 'Deterministic Compliance',
      subtitle: 'Why AI-Testing-AI Fails',
      description: 'Research paper proving why using AI to test AI creates circular dependencies and false confidence. Introduces deterministic Python engines as the solution.',
      topics: ['AI Testing Limitations', 'Deterministic Engines', 'Reproducibility', 'Court-Defensible Evidence'],
      pages: '28 pages',
      date: 'November 2024',
      downloadUrl: 'https://www.haiec.com/resources/whitepapers',
      icon: Award
    },
    {
      title: 'Bias Detection Methods',
      subtitle: 'Statistical vs. Deterministic',
      description: 'Comparative analysis of bias detection approaches. Covers disparate impact testing, statistical parity, and deterministic pattern matching.',
      topics: ['Disparate Impact', 'Statistical Parity', 'Pattern Detection', 'NYC LL144 Compliance'],
      pages: '35 pages',
      date: 'October 2024',
      downloadUrl: 'https://www.haiec.com/resources/whitepapers',
      icon: TrendingUp
    },
  ]

  const solutions = [
    {
      name: 'HAIEC',
      description: 'AI Compliance & Governance Platform',
      href: '/solutions/haiec',
      external: 'https://www.haiec.com',
      badge: 'Enterprise'
    },
    {
      name: 'KestrelVoice',
      description: 'AI Voice Operations Platform',
      href: '/solutions/kestrelvoice',
      external: 'https://www.kestrelvoice.com',
      badge: 'Production'
    },
    {
      name: 'FrontOfAI',
      description: 'Enterprise AI Solutions',
      href: '/solutions/frontofai',
      external: 'https://frontofai.com',
      badge: 'Live'
    },
  ]

  return (
    <>
      <Hero
        subtitle="Former Fortune 50 AI Strategy CTL"
        title={
          <>
            <ProfileCard />
          </>
        }
        description="AI governance is the new competitive advantage. I help organizations turn regulatory complexity into strategic velocity—building frameworks that enable innovation at scale, not slow it down."
        imageSrc="/profile-photo.jpeg"
        imageAlt="Subodh Kumar Kc - AI Compliance Architect and SaaS Developer"
        layout="split"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-wrap gap-4 justify-center lg:justify-start"
        >
          <Link href="/contact">
            <Button size="lg" className="group animate-glow">
              Let's Talk
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/solutions">
            <Button size="lg" variant="outline">
              See My Work
            </Button>
          </Link>
        </motion.div>
      </Hero>

      <Section className="bg-secondary/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-center">The Vision</h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                The organizations that win aren't moving fastest—they're building frameworks that let them move fast indefinitely. 
                AI governance isn't a brake. It's an accelerator.
              </p>
              <p>
                This is where strategy meets execution. Where regulatory requirements become competitive moats. Where compliance 
                frameworks unlock innovation velocity that competitors can't match.
              </p>
              <p>
                My work bridges Fortune 50 strategy, peer-reviewed research, and production systems serving thousands. Based in Dallas. 
                M.Sc. in Engineering & Technology Management. Founder of HAIEC—the platform redefining AI governance.
              </p>
            </div>
          </motion.div>
        </div>
      </Section>

      <Section
        subtitle="How I Work"
        title="Turning Compliance Into Competitive Advantage"
        description="Four pillars of strategic AI governance"
      >
        <Grid cols={2}>
          {services.map((item, index) => {
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
                    <CardDescription className="text-base leading-relaxed">{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            )
          })}
        </Grid>
      </Section>

      <Section
        subtitle="Experience"
        title="Track Record"
        className="bg-secondary/20 relative overflow-hidden"
      >
        <Grid cols={3} className="mb-12">
          {achievements.map((result, index) => (
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
      </Section>

      <Section
        subtitle="Thought Leadership"
        title="Research That Moves Markets"
        description="Peer-reviewed frameworks shaping how organizations deploy AI"
      >
        <div className="grid md:grid-cols-2 gap-6">
          {whitepapers.map((paper, index) => {
            const Icon = paper.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/50">
                  <CardHeader>
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">{paper.title}</CardTitle>
                        <p className="text-sm text-muted-foreground font-medium">{paper.subtitle}</p>
                      </div>
                    </div>
                    <CardDescription className="text-base leading-relaxed mb-4">
                      {paper.description}
                    </CardDescription>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {paper.topics.map((topic, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 rounded-full bg-secondary text-foreground border border-border"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span>{paper.pages}</span>
                      <span>{paper.date}</span>
                    </div>
                    <a href={paper.downloadUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full group">
                        <Download className="mr-2 h-4 w-4" />
                        Download Free
                        <ExternalLink className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </a>
                  </CardHeader>
                </Card>
              </motion.div>
            )
          })}
        </div>
        <div className="text-center mt-8">
          <a href="https://www.haiec.com/resources/whitepapers" target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="outline" className="group">
              View All Whitepapers
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </a>
        </div>
      </Section>

      <Section className="bg-secondary/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Proof of Concept → Production</h2>
            <p className="text-lg text-muted-foreground">
              Platforms demonstrating governance at scale
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="text-center">
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
                      {solution.badge}
                    </span>
                    <h3 className="text-xl font-bold mb-2">{solution.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{solution.description}</p>
                    <div className="flex gap-2">
                      <Link href={solution.href} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          Details
                        </Button>
                      </Link>
                      <a href={solution.external} target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button size="sm" className="w-full">
                          Visit
                        </Button>
                      </a>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/solutions">
              <Button size="lg" className="group">
                View All Solutions
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
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
              HAIEC: Holistic AI Ethics and Compliance
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

      <Section>
        <NewsletterSignup />
      </Section>

      <CTA
        title="Ready to Turn Compliance Into Competitive Advantage?"
        description="Organizations that master AI governance today will dominate their markets tomorrow. Whether you're navigating EU AI Act compliance, preparing for regulatory audits, or building AI strategy from scratch—let's talk."
        primaryButton={{ text: 'Schedule a Strategic Call', href: '/contact' }}
        secondaryButton={{ text: 'Explore Platforms', href: '/solutions' }}
      />

      <LeadMagnetModal 
        isOpen={isLeadMagnetOpen} 
        onClose={() => setIsLeadMagnetOpen(false)} 
      />
    </>
  )
}
