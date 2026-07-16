import Link from 'next/link'
import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ArrowRight, Sparkles, CheckCircle2, ExternalLink, FileText, Shield, Code, TrendingUp, Users } from 'lucide-react'

export default function FrontOfAIPage() {
  const products = [
    {
      icon: FileText,
      title: 'AI Briefing',
      description: 'Weekly AI intelligence for IT leaders. 40+ sources monitored, impact-scored stories, role-based views.',
      href: '/solutions/ai-briefing',
      external: 'https://frontofai.com/briefing',
      badge: 'Free'
    },
    {
      icon: Shield,
      title: 'CourtCase',
      description: 'AI-assisted court evidence builder. Document analysis, timeline generation, and case packet creation.',
      href: '/solutions/courtcase',
      external: 'https://courtcase.frontofai.com',
      badge: 'Beta'
    },
    {
      icon: Code,
      title: 'LLMVerify',
      description: 'Validate LLM outputs with schema validation, safety filters, and PII detection. MIT licensed.',
      href: '/products/llmverify',
      external: 'https://www.npmjs.com/package/llmverify',
      badge: 'Open Source'
    },
    {
      icon: TrendingUp,
      title: 'Root Cause Analysis',
      description: 'AI-powered log analysis that lives inside your network. Pattern detection and fix suggestions.',
      href: '/products/skc-log-analyser',
      external: 'https://frontofai.com/products/log-rca',
      badge: 'Enterprise'
    }
  ]

  const principles = [
    {
      title: 'Compliance First',
      description: 'Every tool is vetted for enterprise constraints: auditability, data handling, and regulatory requirements.',
      icon: Shield
    },
    {
      title: 'Production Ready',
      description: 'Clear inputs/outputs, explicit failure modes, and deployable integrations. No assembly required.',
      icon: CheckCircle2
    },
    {
      title: 'Executive Ready',
      description: 'Designed for managers and executives. Clear insights, actionable intelligence, zero technical overhead.',
      icon: Users
    }
  ]

  const features = [
    'Turnkey AI workflows',
    'Compliance-first design',
    'Production-ready tools',
    'Enterprise security',
    'Clear documentation',
    'Explicit failure modes',
    'Audit trails built-in',
    'No vendor lock-in'
  ]

  return (
    <>
      <Hero
        subtitle="Enterprise AI Solutions Platform"
        title={
          <>
            Stop Drowning in AI Noise.
            <br />
            <span className="gradient-text">Start Making Decisions.</span>
          </>
        }
        description="Turnkey AI workflows, compliance tools, and intelligence platforms. Everything an executive needs to lead through the AI era. Built for IT leaders who need signal, not noise."
      >
        <div
          className="flex flex-wrap gap-4 justify-center"
        >
          <a href="https://frontofai.com" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="group animate-glow">
              Explore FrontOfAI
              <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </a>
          <Link href="/contact">
            <Button size="lg" variant="outline">
              Contact Us
            </Button>
          </Link>
        </div>
      </Hero>

      <Section className="bg-secondary/20" sectionNum="§01">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">The Problem</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Your team is overwhelmed by AI updates, vendor pitches, and security alerts. 
            We filter the noise into actionable intelligence and production-ready tools.
          </p>
        </div>
      </Section>

      <Section
        subtitle="Products & Tools"
        title="Developer & Enterprise Tools"
        description="AI infrastructure trusted by legal, engineering, and DevOps teams at scale"
        sectionNum="§02"
      >
        <div className="grid md:grid-cols-2 gap-6">
          {products.map((product, index) => {
            const Icon = product.icon
            return (
              <Reveal key={index} delay={index * 80} style="up">
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                        {product.badge}
                      </span>
                    </div>
                    <CardTitle className="mb-2">{product.title}</CardTitle>
                    <CardDescription className="text-base mb-4">{product.description}</CardDescription>
                    <div className="flex gap-3">
                      <Link href={product.href}>
                        <Button variant="outline" size="sm" className="group">
                          Learn More
                          <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                      <a href={product.external} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="group">
                          Visit
                          <ExternalLink className="ml-2 h-3 w-3" />
                        </Button>
                      </a>
                    </div>
                  </CardHeader>
                </Card>
              </Reveal>
            )
          })}
        </div>
      </Section>

      <Section
        subtitle="Our Principles"
        title="Built for Enterprise Reality"
        description="No prompt toys. No experiments. Just production-ready AI that works within your constraints."
        sectionNum="§03"
      >
        <div className="grid md:grid-cols-3 gap-6">
          {principles.map((principle, index) => {
            const Icon = principle.icon
            return (
              <Reveal key={index} delay={index * 80} style="scale">
                <Card className="h-full text-center p-6 hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{principle.title}</h3>
                  <p className="text-muted-foreground">{principle.description}</p>
                </Card>
              </Reveal>
            )
          })}
        </div>
      </Section>

      <Section className="bg-secondary/20" sectionNum="§04">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Why FrontOfAI?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <Reveal key={index} delay={index * 50} style="left"
                className="flex items-center gap-3"
              >
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">{feature}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Section sectionNum="§05">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Intelligence Sources</h2>
          <Card className="p-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-primary">Government & Regulatory</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• White House AI Policy</li>
                  <li>• EU Commission</li>
                  <li>• FTC & SEC</li>
                  <li>• NIST & CISA</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-primary">Research Institutions</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• MIT CSAIL</li>
                  <li>• Stanford HAI</li>
                  <li>• UC Berkeley AI</li>
                  <li>• Oxford FHI</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-primary">Industry Leaders</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• OpenAI & Anthropic</li>
                  <li>• Google DeepMind</li>
                  <li>• Microsoft AI</li>
                  <li>• Meta & Amazon</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </Section>

      <CTA
        title="Ready to Get Started?"
        description="Join teams building the future of intelligent workflows. Explore our products and see how FrontOfAI can help your organization."
        primaryButton={{ text: 'Explore Products', href: 'https://frontofai.com/products' }}
        secondaryButton={{ text: 'Contact Us', href: '/contact' }}
      />
    </>
  )
}
