'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ArrowRight, Shield, CheckCircle2, ExternalLink, FileText, AlertTriangle, Lock, Zap } from 'lucide-react'

export default function HAIECPage() {
  const features = [
    {
      icon: Shield,
      title: 'EU AI Act Compliance',
      description: 'Complete compliance framework for EU AI Act requirements with automated evidence generation.'
    },
    {
      icon: Lock,
      title: 'Risk Management System',
      description: 'Comprehensive risk assessment and mitigation strategies for AI systems at scale.'
    },
    {
      icon: FileText,
      title: 'Audit-Grade Evidence',
      description: 'Generate defensible documentation and evidence trails for regulatory audits.'
    },
    {
      icon: Zap,
      title: 'Runtime Testing',
      description: 'Continuous adversarial testing and monitoring of AI system behavior in production.'
    }
  ]

  const capabilities = [
    'Static AI Security Analysis',
    'Runtime Adversarial Testing',
    'Audit-Grade Evidence Generation',
    'EU AI Act Compliance Reports',
    'NYC LL144 Bias Audit Attestation',
    'Risk Management Framework',
    'Data Governance Tools',
    'Technical Documentation',
    'Transparency & Instructions',
    'EU Declaration of Conformity'
  ]

  const useCases = [
    {
      title: 'Enterprise Compliance',
      description: 'Fortune 500 companies deploying AI systems that require regulatory compliance and audit readiness.',
      icon: Shield
    },
    {
      title: 'Government Contractors',
      description: 'Organizations working with government agencies requiring strict AI governance and security standards.',
      icon: Lock
    },
    {
      title: 'Regulated Industries',
      description: 'Financial services, healthcare, and legal sectors with stringent compliance requirements.',
      icon: AlertTriangle
    }
  ]

  return (
    <>
      <Hero
        subtitle="AI Compliance & Governance Platform"
        title={
          <>
            Your AI is Making Decisions.
            <br />
            <span className="gradient-text">Can You Defend Them?</span>
          </>
        }
        description="Evidence-first frameworks for behavioral AI governance. CSM6 framework and AI readiness assessments for enterprise compliance. Not a dashboard - an evidence layer."
        imageSrc="/Haiec.png"
        imageAlt="HAIEC Platform Overview"
        layout="split"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <a href="https://www.haiec.com" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="group animate-glow">
              Visit HAIEC Platform
              <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </a>
          <Link href="/contact">
            <Button size="lg" variant="outline">
              Request Demo
            </Button>
          </Link>
        </motion.div>
      </Hero>

      <Section
        subtitle="Core Features"
        title="Comprehensive AI Governance"
        description="Everything you need to deploy AI systems with confidence and regulatory compliance."
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

      <Section className="bg-secondary/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Platform Capabilities</h2>
          <p className="text-center text-muted-foreground mb-8">
            HAIEC provides a complete suite of tools for AI compliance and governance
          </p>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              {capabilities.map((capability, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{capability}</span>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img
                src="/haiec process.png"
                alt="HAIEC Compliance Process Flow"
                className="w-full h-auto rounded-lg shadow-xl border border-border"
              />
            </motion.div>
          </div>
        </div>
      </Section>

      <Section
        subtitle="Use Cases"
        title="Who Uses HAIEC?"
        description="Built for organizations that need defensible AI governance"
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
                <Card className="h-full text-center p-6 hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                  <p className="text-muted-foreground">{useCase.description}</p>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </Section>

      <Section>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Why HAIEC?</h2>
          <div className="grid md:grid-cols-2 gap-8 items-start mb-12">
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-3">Evidence-First Approach</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Dashboards are not evidence. HAIEC generates audit-grade documentation that stands up to regulatory scrutiny. 
                  Every claim is backed by deterministic testing and cryptographic proof.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-3">Production-Ready</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Not a research project. HAIEC is deployed in Fortune 50 environments, managing compliance for 
                  production AI systems at enterprise scale.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-3">Framework Aligned</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Built on peer-reviewed research and aligned with EU AI Act, NIST AI RMF, ISO 42001, and NYC Local Law 144. 
                  Open source core with deterministic engines you can verify.
                </p>
              </Card>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="sticky top-24"
            >
              <img
                src="/Ai Security Process flow.png"
                alt="AI Security Process Flow"
                className="w-full h-auto rounded-lg shadow-xl border border-border"
              />
            </motion.div>
          </div>
        </div>
      </Section>

      <CTA
        title="Ready to Verify Your AI Controls?"
        description="Join enterprise teams building compliant AI systems with HAIEC. Schedule a demo to see how we can help your organization."
        primaryButton={{ text: 'Visit HAIEC.com', href: 'https://www.haiec.com' }}
        secondaryButton={{ text: 'Contact for Demo', href: '/contact' }}
      />
    </>
  )
}
