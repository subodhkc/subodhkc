import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import Grid from '@/components/Grid'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Shield,
  FileCheck,
  TrendingUp,
  AlertTriangle,
  Layers,
  GitBranch,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'HAIEC - Human AI Ethics Council',
  description:
    'Comprehensive AI governance, compliance, and ethical deployment platform. Built on years of real-world experience. Features precision drift detection, Red Audit Kit, and Cognitive Systems Management.',
}

export default function HAIECPage() {
  const modules = [
    {
      icon: Shield,
      title: 'Compliance Engine',
      description:
        'Real-time monitoring and enforcement of AI governance policies. Automated compliance checks against GDPR, AI Act, and industry-specific regulations.',
      features: [
        'Policy enforcement automation',
        'Regulatory mapping',
        'Compliance reporting',
        'Audit trail generation',
      ],
    },
    {
      icon: FileCheck,
      title: 'Red Audit Kit™',
      description:
        'Comprehensive assessment framework for AI systems. Evaluates models, data pipelines, and deployment infrastructure against compliance and risk criteria.',
      features: [
        'Multi-layer system audits',
        'Risk scoring methodology',
        'Remediation roadmaps',
        'Compliance gap analysis',
      ],
    },
    {
      icon: TrendingUp,
      title: 'Precision Drift Detection',
      description:
        'Advanced monitoring for model drift, data drift, and concept drift. Goes beyond basic metrics to identify subtle degradation patterns before they impact production.',
      features: [
        'Statistical drift detection',
        'Performance monitoring',
        'Alert configuration',
        'Historical analysis',
      ],
    },
    {
      icon: Layers,
      title: 'LegacyShift™',
      description:
        'Structured methodology for modernizing legacy AI systems. Addresses technical debt, compliance gaps, and operational inefficiencies in aging ML infrastructure.',
      features: [
        'Migration planning',
        'Risk assessment',
        'Incremental modernization',
        'Zero-downtime transitions',
      ],
    },
  ]

  const csm = {
    title: 'Cognitive Systems Management',
    description:
      'The comprehensive methodology underlying HAIEC. CSM bridges strategy, implementation, and governance for enterprise AI.',
    pillars: [
      {
        name: 'Strategic Alignment',
        points: [
          'Business objectives mapping',
          'Risk-reward analysis',
          'Stakeholder management',
        ],
      },
      {
        name: 'Technical Implementation',
        points: [
          'Architecture decisions',
          'Infrastructure design',
          'Integration patterns',
        ],
      },
      {
        name: 'Governance & Risk',
        points: [
          'Policy frameworks',
          'Compliance automation',
          'Continuous monitoring',
        ],
      },
      {
        name: 'Operational Excellence',
        points: [
          'Performance optimization',
          'Incident response',
          'Continuous improvement',
        ],
      },
    ],
  }

  const useCases = [
    {
      industry: 'Financial Services',
      challenge: 'Meeting AI Act compliance while maintaining model performance',
      solution:
        'Implemented HAIEC compliance engine with automated policy enforcement and continuous monitoring',
      result: '100% regulatory compliance with <2% impact on model latency',
    },
    {
      industry: 'Healthcare',
      challenge: 'Auditing legacy AI systems for HIPAA and FDA requirements',
      solution:
        'Deployed Red Audit Kit with LegacyShift methodology for systematic modernization',
      result: 'Achieved full compliance certification in 8 months vs. 18-month baseline',
    },
    {
      industry: 'Enterprise SaaS',
      challenge: 'Detecting and managing model drift across 50+ production models',
      solution:
        'Integrated precision drift detection with automated alerting and remediation workflows',
      result: '95% reduction in undetected drift incidents, 60% faster response time',
    },
  ]

  return (
    <>
      <Hero
        subtitle="HAIEC Platform"
        title={
          <>
            AI Governance.
            <br />
            <span className="gradient-text">Built for Enterprise.</span>
          </>
        }
        description="Comprehensive platform for AI compliance, governance, and ethical deployment. From pilots to production, HAIEC provides the frameworks and tools enterprise leaders need."
      >
        <Link href="/contact">
          <Button size="lg" className="group">
            Request demo
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
        <Link href="/research">
          <Button size="lg" variant="outline">
            View research
          </Button>
        </Link>
      </Hero>

      <Section
        subtitle="Core Modules"
        title="Enterprise-Grade AI Governance"
        description="Built from real-world experience implementing AI compliance at Fortune 50 scale. Each module addresses critical gaps in traditional governance approaches."
      >
        <Grid cols={2}>
          {modules.map((module, index) => {
            const Icon = module.icon
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {module.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </Grid>
      </Section>

      <Section
        subtitle="Methodology"
        title="Cognitive Systems Management"
        description={csm.description}
        className="bg-secondary/20"
      >
        <Grid cols={2}>
          {csm.pillars.map((pillar, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-xl">{pillar.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {pillar.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                      <span className="text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </Grid>
        <div className="mt-12 max-w-3xl mx-auto text-center">
          <p className="text-lg text-muted-foreground leading-relaxed">
            CSM is the all-in-one playbook for AI implementation. It addresses the full lifecycle from strategic planning through production deployment, ensuring governance is embedded at every stage—not bolted on afterward.
          </p>
        </div>
      </Section>

      <Section subtitle="Proven Results" title="Real-World Impact">
        <div className="space-y-8">
          {useCases.map((useCase, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="inline-flex items-center rounded-full border border-accent/20 bg-accent/10 px-3 py-1 mb-3 w-fit">
                  <span className="text-xs font-medium text-accent">{useCase.industry}</span>
                </div>
                <CardTitle className="text-xl">Challenge</CardTitle>
                <CardDescription>{useCase.challenge}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wider">
                    Solution
                  </h4>
                  <p className="text-muted-foreground">{useCase.solution}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wider">
                    Result
                  </h4>
                  <p className="text-primary font-medium">{useCase.result}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section subtitle="Platform Access" title="Choose Your Engagement">
        <Grid cols={3}>
          <Card>
            <CardHeader>
              <CardTitle>Platform License</CardTitle>
              <CardDescription>
                Self-service access to HAIEC platform and tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-3xl font-bold">Custom</p>
                <p className="text-sm text-muted-foreground">Based on scale</p>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Full platform access</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Technical documentation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Community support</span>
                </li>
              </ul>
              <Link href="/contact">
                <Button className="w-full">Contact sales</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-primary">
            <CardHeader>
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 mb-2 w-fit">
                <span className="text-xs font-medium text-primary">Most Popular</span>
              </div>
              <CardTitle>Guided Implementation</CardTitle>
              <CardDescription>
                Platform access plus implementation support
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-3xl font-bold">Custom</p>
                <p className="text-sm text-muted-foreground">3-6 month engagement</p>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Everything in Platform</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Implementation support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Custom framework adaptation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Team training</span>
                </li>
              </ul>
              <Link href="/contact">
                <Button className="w-full">Get started</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Enterprise Partnership</CardTitle>
              <CardDescription>
                Full strategic engagement with ongoing support
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-3xl font-bold">Custom</p>
                <p className="text-sm text-muted-foreground">Long-term partnership</p>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Everything in Guided</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Executive advisory</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Dedicated support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Custom development</span>
                </li>
              </ul>
              <Link href="/contact">
                <Button variant="outline" className="w-full">
                  Discuss partnership
                </Button>
              </Link>
            </CardContent>
          </Card>
        </Grid>
      </Section>

      <CTA
        title="Ready to Deploy AI with Confidence?"
        description="HAIEC provides the frameworks, tools, and methodologies to move from AI pilots to production-grade systems that meet enterprise compliance requirements."
        primaryButton={{ text: 'Request demo', href: '/contact' }}
        secondaryButton={{ text: 'View case studies', href: '/research' }}
      />
    </>
  )
}
