'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ArrowRight, Scale, CheckCircle2, ExternalLink, FileText, Clock, Lock, Zap, Upload, Eye, Download } from 'lucide-react'

export default function CourtCasePage() {
  const features = [
    {
      icon: Upload,
      title: 'Upload Evidence',
      description: 'Drag and drop documents, photos, emails, texts, and any evidence files. Supports all major formats.'
    },
    {
      icon: Zap,
      title: 'Smart Processing',
      description: 'AI-powered OCR, classification, and metadata extraction. Claude AI analyzes content automatically.'
    },
    {
      icon: Clock,
      title: 'Timeline Generation',
      description: 'Automatically builds chronological timelines from your evidence. Review and adjust as needed.'
    },
    {
      icon: Download,
      title: 'Generate Packet',
      description: 'Export professionally formatted court packets with exhibits, timelines, and documentation.'
    }
  ]

  const engines = [
    {
      name: 'OCR Engine',
      description: 'Extract text from images and scanned documents with high accuracy'
    },
    {
      name: 'Claude AI Analysis',
      description: 'Intelligent document understanding and content classification'
    },
    {
      name: 'Classification Engine',
      description: 'Automatically categorize evidence by type and relevance'
    },
    {
      name: 'Metadata Engine',
      description: 'Extract dates, parties, and key information from documents'
    },
    {
      name: 'Packet Engine',
      description: 'Generate court-ready formatted documents and exhibits'
    },
    {
      name: '35+ MCP Engines',
      description: 'Specialized processing for different evidence types'
    }
  ]

  const useCases = [
    {
      title: 'Personal Injury',
      description: 'Organize medical records, accident reports, and insurance communications into compelling case packets.',
      icon: FileText
    },
    {
      title: 'Employment Disputes',
      description: 'Build timelines from emails, texts, and HR documents to demonstrate workplace issues.',
      icon: Scale
    },
    {
      title: 'Family Law',
      description: 'Compile evidence for custody, divorce, or support cases with clear chronological organization.',
      icon: Eye
    }
  ]

  const security = [
    'End-to-end encryption',
    'No AI training on your data',
    '10-day auto-delete policy',
    'US-based servers',
    'SOC 2 compliant infrastructure',
    'Privacy-focused design'
  ]

  return (
    <>
      <Hero
        subtitle="AI-Assisted Court Evidence Builder"
        title={
          <>
            Discover Your Claims.
            <br />
            <span className="gradient-text">Organize Your Evidence.</span>
            <br />
            Be Prepared.
          </>
        }
        description="Transform chaotic evidence into professionally formatted court packets with AI-powered timeline building, OCR, and exhibit management. Built for individuals and legal professionals."
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <a href="https://courtcase.frontofai.com" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="group animate-glow">
              Try CourtCase Beta
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

      <Section className="bg-secondary/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Not Sure If You Have a Case?</h2>
          <p className="text-xl text-muted-foreground mb-6">
            Get a free case evaluation in minutes. Upload your evidence and let AI help you understand 
            the strength of your potential claims.
          </p>
          <Card className="p-6 bg-primary/5 border-primary/20">
            <p className="text-lg font-medium mb-2">Quick Facts</p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-semibold text-primary">Free Evaluation</p>
                <p className="text-muted-foreground">No credit card required</p>
              </div>
              <div>
                <p className="font-semibold text-primary">5-10 Minutes</p>
                <p className="text-muted-foreground">Average processing time</p>
              </div>
              <div>
                <p className="font-semibold text-primary">100% Private</p>
                <p className="text-muted-foreground">Your data, your control</p>
              </div>
            </div>
          </Card>
        </div>
      </Section>

      <Section
        subtitle="How It Works"
        title="Four Simple Steps"
        description="From evidence chaos to court-ready packets in minutes"
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
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-3xl font-bold text-primary/20">{index + 1}</span>
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
          <h2 className="text-3xl font-bold text-center mb-4">Document Processing Engines</h2>
          <p className="text-center text-muted-foreground mb-8">
            Powered by cutting-edge AI and specialized processing engines
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {engines.map((engine, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
              >
                <Card className="p-4 hover:shadow-md transition-all duration-300">
                  <h3 className="font-semibold mb-1">{engine.name}</h3>
                  <p className="text-sm text-muted-foreground">{engine.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section
        subtitle="Use Cases"
        title="Example Use Cases"
        description="Built for various legal scenarios"
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Your Data is Secure & Private</h2>
            <p className="text-lg text-muted-foreground">
              We take your privacy seriously. Your sensitive legal documents are protected with enterprise-grade security.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {security.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="flex items-center gap-3"
              >
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-secondary/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <Card className="p-8">
            <div className="mb-6">
              <p className="text-4xl font-bold mb-2">Free Beta Access</p>
              <p className="text-muted-foreground">Limited time offer for early users</p>
            </div>
            <ul className="space-y-3 mb-6 text-left max-w-md mx-auto">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Unlimited document uploads</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>AI-powered timeline generation</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Professional packet exports</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Priority support</span>
              </li>
            </ul>
            <a href="https://courtcase.frontofai.com" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="w-full max-w-sm">
                Join Beta Now
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </Card>
        </div>
      </Section>

      <CTA
        title="Ready to Build Your Case Packet?"
        description="Join individuals and legal professionals using CourtCase to organize evidence and build compelling case packets. Start your free beta access today."
        primaryButton={{ text: 'Start Building', href: 'https://courtcase.frontofai.com' }}
        secondaryButton={{ text: 'Contact Support', href: '/contact' }}
      />
    </>
  )
}
