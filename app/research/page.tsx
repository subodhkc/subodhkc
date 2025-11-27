import Hero from '@/components/Hero'
import Section from '@/components/Section'
import Grid from '@/components/Grid'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import CTA from '@/components/CTA'
import { FileText, TrendingUp, Shield, Layers, AlertTriangle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Research',
  description:
    'Research and frameworks on AI compliance, precision drift detection, Cognitive Systems Management, LegacyShift, and Red Audit methodologies for enterprise AI governance.',
}

export default function ResearchPage() {
  const frameworks = [
    {
      icon: TrendingUp,
      title: 'Precision Drift Detection',
      description:
        'Advanced methodology for detecting subtle degradation patterns in production AI systems. Goes beyond basic statistical drift to identify concept drift, performance degradation, and silent failures before they impact users.',
      keyContributions: [
        'Multi-dimensional drift analysis framework',
        'Early warning signal detection',
        'Context-aware threshold adaptation',
        'Production incident correlation',
      ],
      status: 'Active Research',
      year: '2024-2025',
    },
    {
      icon: Layers,
      title: 'Cognitive Systems Management (CSM)',
      description:
        'Comprehensive methodology for AI implementation that bridges strategy, technical execution, and governance. The foundational framework underlying HAIEC platform and approach to enterprise AI deployment.',
      keyContributions: [
        'Four-pillar implementation model',
        'Strategic-to-operational alignment',
        'Risk-integrated decision frameworks',
        'Continuous governance methodology',
      ],
      status: 'Published Framework',
      year: '2023-2025',
    },
    {
      icon: Shield,
      title: 'Red Audit Kit™',
      description:
        'Systematic assessment framework for AI systems covering models, data pipelines, infrastructure, and governance. Provides structured methodology for identifying compliance gaps and risk exposure.',
      keyContributions: [
        'Multi-layer audit methodology',
        'Risk scoring and prioritization',
        'Regulatory mapping automation',
        'Remediation roadmap generation',
      ],
      status: 'Active Framework',
      year: '2024-2025',
    },
    {
      icon: FileText,
      title: 'LegacyShift™ Methodology',
      description:
        'Structured approach to modernizing legacy AI systems. Addresses technical debt, compliance gaps, and operational inefficiencies while minimizing risk and maintaining business continuity.',
      keyContributions: [
        'Zero-downtime migration patterns',
        'Incremental modernization strategy',
        'Risk-managed transitions',
        'Compliance preservation frameworks',
      ],
      status: 'Active Framework',
      year: '2024-2025',
    },
  ]

  const researchAreas = [
    {
      area: 'AI Regulatory Compliance',
      focus: [
        'EU AI Act implementation strategies',
        'Cross-jurisdiction compliance frameworks',
        'Automated compliance monitoring',
        'Policy-to-implementation mapping',
      ],
    },
    {
      area: 'Enterprise AI Governance',
      focus: [
        'Multi-model governance at scale',
        'Organizational governance structures',
        'Stakeholder alignment frameworks',
        'Governance automation',
      ],
    },
    {
      area: 'AI Risk Management',
      focus: [
        'Silent failure detection',
        'Cascading risk analysis',
        'Risk quantification methodologies',
        'Real-time risk monitoring',
      ],
    },
    {
      area: 'System Modernization',
      focus: [
        'Legacy AI migration patterns',
        'Technical debt assessment',
        'Modernization without disruption',
        'Compliance-preserving refactoring',
      ],
    },
  ]

  const publications = [
    {
      title: 'From AI Pilots to Regulatory Readiness',
      venue: 'AI Governance Playbook',
      type: 'Framework Paper',
      year: '2025',
      summary:
        'Practical framework for transitioning from AI experimentation to production-grade, compliant systems.',
    },
    {
      title: 'Why Enterprise AI Integration Strategies Fail',
      venue: 'Design Bootcamp',
      type: 'Analysis',
      year: '2025',
      summary:
        'Systematic analysis of common architectural and organizational failures in enterprise AI adoption.',
    },
    {
      title: 'Cognitive Systems Management: A Unified Approach',
      venue: 'HAIEC Research',
      type: 'Methodology',
      year: '2024',
      summary:
        'Comprehensive methodology bridging AI strategy, implementation, and governance for enterprise scale.',
    },
  ]

  return (
    <>
      <Hero
        subtitle="Research & Frameworks"
        title={
          <>
            Building the Science of
            <br />
            <span className="gradient-text">AI Governance</span>
          </>
        }
        description="Research-backed frameworks and methodologies for enterprise AI compliance, governance, and risk management. Built from real-world implementation experience."
      />

      <Section
        subtitle="Core Frameworks"
        title="Research Contributions"
        description="Frameworks and methodologies developed through years of enterprise AI implementation. Each addresses critical gaps in traditional approaches to AI governance."
      >
        <div className="space-y-8">
          {frameworks.map((framework, index) => {
            const Icon = framework.icon
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <CardTitle className="text-2xl">{framework.title}</CardTitle>
                        <div className="flex flex-col items-end gap-1">
                          <div className="inline-flex items-center rounded-full border border-accent/20 bg-accent/10 px-3 py-1">
                            <span className="text-xs font-medium text-accent">
                              {framework.status}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">{framework.year}</span>
                        </div>
                      </div>
                      <CardDescription className="mb-4">{framework.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
                    Key Contributions
                  </h4>
                  <Grid cols={2} gap="sm">
                    {framework.keyContributions.map((contribution, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{contribution}</span>
                      </div>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </Section>

      <Section
        subtitle="Research Focus"
        title="Active Research Areas"
        className="bg-secondary/20"
      >
        <Grid cols={2}>
          {researchAreas.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-xl">{item.area}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {item.focus.map((focus, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                      <span className="text-muted-foreground">{focus}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section subtitle="Publications" title="Published Work">
        <div className="space-y-4">
          {publications.map((pub, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{pub.title}</CardTitle>
                    <CardDescription>{pub.summary}</CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1">
                      <span className="text-xs font-medium text-primary">{pub.type}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{pub.year}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Published in: {pub.venue}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section subtitle="Collaboration" title="Research Partnerships">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <p className="text-lg text-muted-foreground leading-relaxed">
            I collaborate with organizations on applied AI governance research. If you're working on problems in compliance automation, risk quantification, or governance at scale, let's talk.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg">Discuss collaboration</Button>
            </Link>
            <Link href="/advisory">
              <Button size="lg" variant="outline">
                Advisory services
              </Button>
            </Link>
          </div>
        </div>
      </Section>

      <CTA
        title="Apply These Frameworks to Your Organization"
        description="These aren't just academic exercises. They're battle-tested frameworks built from real-world enterprise implementation. Available through HAIEC platform and advisory engagements."
        primaryButton={{ text: 'Explore HAIEC', href: '/haiec' }}
        secondaryButton={{ text: 'Advisory services', href: '/advisory' }}
      />
    </>
  )
}
