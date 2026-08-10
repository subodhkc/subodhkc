import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import Grid from '@/components/Grid'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import {
  Building2,
  Briefcase,
  Code2,
  Users,
  ArrowRight,
  ArrowDown,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  BookOpen,
  FileText,
  Printer,
  ExternalLink,
  Shield,
  Layers,
  Scale,
  GitBranch,
} from 'lucide-react'
import {
  csmFramework,
  csmDomains,
  csmHandoffs,
  csmImplementationGuidance,
  csmProportionality,
  csmRelationshipToExecutionFramework,
  csmToHaiec,
  csmProvenance,
  csmGuideVersion,
} from '@/data/csm'

export const metadata = {
  title:
    'Cognitive Systems Management 2.0: Deterministic AI Governance | Subodh KC',
  description:
    'CSM 2.0 is a deterministic-by-design governance operating model for AI systems. It preserves the original Enterprise, Project, Code and UX domains and adds six cross-functional execution functions plus versioned governance contracts for decisions, evidence, handoffs and reassessment.',
  alternates: {
    canonical: 'https://subodhkc.com/cognitive-systems-management',
  },
  openGraph: {
    title:
      'Cognitive Systems Management 2.0 | Subodh KC',
    description:
      'A deterministic-by-design governance operating model for AI systems. Four governance domains. Six execution functions. Explicit decisions and evidence.',
    url: 'https://subodhkc.com/cognitive-systems-management',
    type: 'article',
    authors: ['Subodh KC'],
    publishedTime: '2025-08-29',
    modifiedTime: '2026-08-10',
    tags: ['AI governance', 'Cognitive Systems Management', 'CSM 2.0', 'AI governance framework', 'deterministic governance'],
    images: ['https://subodhkc.com/portrait.jpeg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cognitive Systems Management 2.0 | Subodh KC',
    description:
      'A deterministic-by-design governance operating model for AI systems. Four domains. Six execution functions. Explicit decisions and evidence.',
  },
  keywords: [
    'Cognitive Systems Management',
    'CSM 2.0',
    'CSM framework',
    'AI governance',
    'deterministic governance',
    'Enterprise AI governance',
    'AI project governance',
    'AI code governance',
    'AI UX governance',
    'Subodh KC',
    'AI Governance Execution Framework',
    'governance contracts',
  ],
}

const domainIcons: Record<string, typeof Building2> = {
  'csm-enterprise': Building2,
  'csm-project': Briefcase,
  'csm-code': Code2,
  'csm-ux': Users,
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline:
    'Cognitive Systems Management 2.0: A Deterministic-by-Design Governance Operating Model for AI Systems',
  author: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
  datePublished: '2025-08-29',
  dateModified: '2026-08-10',
  publisher: { '@type': 'Organization', name: 'Subodh KC', url: 'https://subodhkc.com' },
  mainEntityOfPage: 'https://subodhkc.com/cognitive-systems-management',
  description:
    'CSM 2.0 is a deterministic-by-design governance operating model for AI systems. It preserves the original Enterprise, Project, Code and UX governance domains and adds six cross-functional execution functions plus versioned governance contracts.',
  about: {
    '@type': 'DefinedTerm',
    name: 'Cognitive Systems Management 2.0',
    description: 'A deterministic-by-design governance operating model for AI systems.',
  },
  version: '2.0.0',
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'Research', item: 'https://subodhkc.com/research' },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Cognitive Systems Management',
      item: 'https://subodhkc.com/cognitive-systems-management',
    },
  ],
}

export default function CSMPage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Hero
        subtitle="AI Governance Framework · Version 2.0"
        title={
          <>
            Cognitive Systems Management 2.0
            <br />
            <span className="gradient-text">(CSM)</span>
          </>
        }
        description="Govern AI through explicit decisions, evidence, handoffs and reassessment, not disconnected checklists."
      />

      {/* V2 Introduction */}
      <Section className="pt-8 pb-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-lg text-foreground/90 leading-relaxed">
            CSM 2.0 preserves the original Enterprise, Project, Code and UX domains and adds an operational specification for how governance decisions are evaluated, evidenced, transferred between teams and reopened when conditions change.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            Four governance domains. Six execution functions. Explicit decisions and evidence. Deterministic evaluation applies to objective governance rules; interpretive decisions require explicit human review.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/cognitive-systems-management/v2"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Explore CSM 2.0 <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/cognitive-systems-management/contracts"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted/50 transition-colors"
            >
              Governance Contracts <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/cognitive-systems-management/assessment"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted/50 transition-colors"
            >
              Reference Assessment <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </Section>

      {/* Direct Definition */}
      <Section className="pt-8 pb-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-lg text-foreground/90 leading-relaxed">
            {csmFramework.directDefinition}
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            {csmFramework.description}
          </p>

          {/* Provenance */}
          <div className="border-l-4 border-primary/40 pl-4 py-2 bg-muted/20 rounded-r-lg">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Original 2025 Framework:</strong>{' '}
              &ldquo;{csmProvenance.originalArticleTitle}&rdquo; by {csmProvenance.author},{' '}
              {csmProvenance.publication}, {csmGuideVersion.originalPublicationDate}.
              CSM 2.0 is based on and evolved from this original publication.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              <a
                href={csmProvenance.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                Read the original article <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>
        </div>
      </Section>

      {/* The Problem */}
      <Section className="pt-4" subtitle="The Problem" title="Governance Fragments at Handoffs">
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-base text-foreground/90 leading-relaxed">
            {csmFramework.problemStatement}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              'Policy exists but project criteria do not reflect it',
              'Project approval exists but implementation differs from approved assumptions',
              'Technical controls exist but users do not understand appropriate reliance',
              'Operational feedback never returns to policy or project decisions',
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-2 p-3 rounded-lg border border-border bg-muted/20"
              >
                <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-base text-foreground font-medium pt-2">
            CSM makes those handoffs visible.
          </p>
          <p className="text-sm text-muted-foreground">{csmFramework.valueStatement}</p>
        </div>
      </Section>

      {/* Four Domains Overview */}
      <Section
        className="pt-8"
        subtitle="The Four Domains"
        title="Where Governance Responsibilities Operate"
        sectionNum="§01"
      >
        <Grid cols={2} className="gap-4">
          {csmDomains.map((domain) => {
            const Icon = domainIcons[domain.id] || Building2
            return (
              <Card key={domain.id} className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-1">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">{domain.displayName}</CardTitle>
                  </div>
                  <CardDescription className="text-sm italic">
                    {domain.tagline}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{domain.centralQuestion}</p>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-foreground">Original components:</p>
                    {domain.originalComponents.map((comp) => (
                      <p key={comp.name} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-primary/60 flex-shrink-0 mt-0.5" />
                        {comp.name}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </Grid>
      </Section>

      {/* Domain Deep Dives */}
      {csmDomains.map((domain, index) => {
        const Icon = domainIcons[domain.id] || Building2
        return (
          <Section
            key={domain.id}
            className="pt-8"
            id={domain.id}
            subtitle={`Domain ${index + 1} of 4`}
            title={domain.displayName}
            sectionNum={`§${index + 2}`}
          >
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Tagline and Question */}
              <div className="border-l-4 border-primary pl-4">
                <p className="text-lg text-foreground font-medium">{domain.tagline}</p>
                <p className="text-base text-muted-foreground mt-2">
                  <strong className="text-foreground">Core question:</strong> {domain.centralQuestion}
                </p>
              </div>

              {/* Problem */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Problem this domain addresses</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{domain.problem}</p>
              </div>

              {/* Original Components */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Verified original components
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {domain.originalComponents.map((comp) => (
                    <Card key={comp.name} className="border-l-4 border-l-primary/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">{comp.name}</CardTitle>
                        <CardDescription className="text-xs">{comp.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Current Implementation Examples */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  Current implementation examples
                </h3>
                <p className="text-xs text-muted-foreground mb-3 italic">
                  Current implementation interpretation. These examples were not explicitly present in the original 2025 article.
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {domain.currentImplementationExamples.map((ex) => (
                    <div key={ex.name} className="flex items-start gap-2 p-2.5 rounded-lg border border-border bg-muted/20">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary/60 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-foreground">{ex.name}</p>
                        <p className="text-xs text-muted-foreground">{ex.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Example Artifacts */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Example artifacts</h3>
                <div className="flex flex-wrap gap-1.5">
                  {domain.exampleArtifacts.map((art) => (
                    <span
                      key={art}
                      className="inline-flex items-center rounded-full border border-border bg-muted/30 px-2.5 py-0.5 text-xs"
                    >
                      {art}
                    </span>
                  ))}
                </div>
              </div>

              {/* Roles */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Typical roles involved</h3>
                <div className="flex flex-wrap gap-1.5">
                  {domain.typicalRoles.map((role) => (
                    <span
                      key={role}
                      className="inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-2.5 py-0.5 text-xs text-primary"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* Handoffs */}
              {domain.handoffs.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Handoffs to other CSM domains</h3>
                  <div className="space-y-2">
                    {domain.handoffs.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-foreground">{h.from}</span>
                        <ArrowRight className="h-3 w-3 text-primary" />
                        <span className="font-medium text-foreground">{h.to}</span>
                        <span className="text-muted-foreground">: {h.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Failure Modes */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Common failure modes</h3>
                <ul className="space-y-1 ml-4">
                  {domain.failureModes.map((fm) => (
                    <li key={fm} className="list-disc text-sm text-muted-foreground">{fm}</li>
                  ))}
                </ul>
              </div>

              {/* Reassessment Triggers */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Reassessment triggers</h3>
                <ul className="space-y-1 ml-4">
                  {domain.reassessmentTriggers.map((rt) => (
                    <li key={rt} className="list-disc text-sm text-muted-foreground">{rt}</li>
                  ))}
                </ul>
              </div>

              {/* Value */}
              <div className="border-l-4 border-primary/40 pl-4 py-2 bg-muted/20 rounded-r-lg">
                <p className="text-sm font-medium text-foreground">Intended organizational value</p>
                <p className="text-sm text-muted-foreground mt-1">{domain.value}</p>
              </div>

              {/* Limitations */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">Limitations / proportionality</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{domain.limitations}</p>
              </div>
            </div>
          </Section>
        )
      })}

      {/* How CSM Works as a System */}
      <Section
        className="pt-8"
        subtitle="System View"
        title="How CSM Works as a System"
        sectionNum="§06"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-base text-foreground/90">
            CSM domains are not four sequential phases. They are interconnected governance lenses.
          </p>
          <div className="space-y-3">
            {[
              { name: 'Enterprise', desc: 'Defines purpose, ownership and boundaries.' },
              { name: 'Project', desc: 'Turns those decisions into business criteria, testing and a scale decision.' },
              { name: 'Code', desc: 'Implements the system under engineering and security controls.' },
              { name: 'UX', desc: 'Defines how people use, interpret, challenge and oversee outcomes.' },
              { name: 'Feedback', desc: 'Operational learning returns to Project and Enterprise.' },
            ].map((step, i, arr) => (
              <div key={step.name}>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/20">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{step.name}</p>
                    <p className="text-xs text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div className="flex justify-center py-1">
                    <ArrowDown className="h-4 w-4 text-primary/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Governance Handoffs */}
      <Section
        className="pt-8"
        subtitle="Handoff Model"
        title="Governance Handoffs"
        sectionNum="§07"
      >
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-base text-foreground/90">
            One of CSM&rsquo;s most valuable explanatory concepts is making governance handoffs explicit.
          </p>
          {csmHandoffs.map((h, i) => (
            <Card key={i} className="border-l-4 border-l-primary/30">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-foreground">{h.from}</span>
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">{h.to}</span>
                </div>
                <p className="text-sm text-muted-foreground">{h.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Implementation Guidance */}
      <Section
        className="pt-8"
        subtitle="Getting Started"
        title="Implementation Guidance"
        sectionNum="§08"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-xs text-muted-foreground italic">
            {csmImplementationGuidance.label}
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {csmImplementationGuidance.phases.map((phase, i) => (
              <Card key={phase.name}>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <CardTitle className="text-sm">{phase.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 ml-3">
                    {phase.activities.map((a) => (
                      <li key={a} className="list-disc text-xs text-muted-foreground">{a}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{csmImplementationGuidance.note}</p>
        </div>
      </Section>

      {/* Proportionality */}
      <Section
        className="pt-8"
        subtitle="Right-Sizing"
        title={csmProportionality.title}
        sectionNum="§09"
      >
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-base text-foreground/90 leading-relaxed">
            {csmProportionality.statement}
          </p>
          <div className="flex flex-wrap gap-2">
            {csmProportionality.factors.map((f) => (
              <span
                key={f}
                className="inline-flex items-center rounded-full border border-border bg-muted/30 px-2.5 py-0.5 text-xs"
              >
                {f}
              </span>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{csmProportionality.note}</p>
        </div>
      </Section>

      {/* What CSM Is Not */}
      <Section
        className="pt-8"
        subtitle="Boundaries"
        title="What CSM Is Not"
        sectionNum="§10"
      >
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="grid gap-2 sm:grid-cols-3">
            {csmFramework.whatCSMIsNot.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-muted/20"
              >
                <span className="text-xs text-muted-foreground line-through">{item}</span>
              </div>
            ))}
          </div>
          <div className="border-l-4 border-primary pl-4 py-2 bg-muted/20 rounded-r-lg">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">CSM is:</strong> {csmFramework.whatCSMIs}
            </p>
          </div>
        </div>
      </Section>

      {/* Relationship to Execution Framework */}
      <Section
        className="pt-8"
        subtitle="Current Architecture"
        title="CSM and the AI Governance Execution Framework"
        sectionNum="§11"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border-l-4 border-l-primary/40">
              <CardHeader>
                <CardTitle className="text-sm">CSM</CardTitle>
                <CardDescription className="text-xs">
                  {csmRelationshipToExecutionFramework.csmRole}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {csmRelationshipToExecutionFramework.csmDomains.map((d) => (
                    <span key={d} className="inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-2 py-0.5 text-xs text-primary">
                      {d}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-primary/40">
              <CardHeader>
                <CardTitle className="text-sm">AI Governance Execution Framework</CardTitle>
                <CardDescription className="text-xs">
                  {csmRelationshipToExecutionFramework.executionFrameworkRole}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-0.5 ml-4">
                  {csmRelationshipToExecutionFramework.executionFrameworkFunctions.map((f, i) => (
                    <li key={f} className="list-decimal text-xs text-muted-foreground">
                      {f}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
          <div className="border-l-4 border-primary pl-4 py-2 bg-muted/20 rounded-r-lg">
            <p className="text-sm text-foreground">{csmRelationshipToExecutionFramework.relationship}</p>
          </div>
          <p className="text-xs text-muted-foreground italic">
            {csmRelationshipToExecutionFramework.label}
          </p>
        </div>
      </Section>

      {/* CSM → Execution Framework → HAIEC */}
      <Section
        className="pt-8"
        subtitle="Layered Architecture"
        title="CSM, Execution Framework, and HAIEC"
        sectionNum="§12"
      >
        <div className="max-w-3xl mx-auto space-y-4">
          {csmToHaiec.layers.map((layer, i, arr) => (
            <div key={layer.name}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{layer.name}</CardTitle>
                  <CardDescription className="text-xs">{layer.role}</CardDescription>
                </CardHeader>
              </Card>
              {i < arr.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowDown className="h-4 w-4 text-primary/40" />
                </div>
              )}
            </div>
          ))}
          <p className="text-xs text-muted-foreground italic">{csmToHaiec.note}</p>
        </div>
      </Section>

      {/* Limitation */}
      <Section
        className="pt-8"
        subtitle="Honest Assessment"
        title="Limitations"
        sectionNum="§13"
      >
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="border-l-4 border-amber-500/40 pl-4 py-2 bg-amber-500/5 rounded-r-lg">
            <p className="text-sm text-foreground leading-relaxed">
              {csmFramework.limitationStatement}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Do not call CSM peer reviewed. Do not call it an industry standard. It is a practitioner-developed governance methodology.
          </p>
        </div>
      </Section>

      {/* Artifacts */}
      <Section
        className="pt-8"
        subtitle="Resources"
        title="CSM 2.0 Framework Resources"
        sectionNum="§14"
      >
        <div className="max-w-3xl mx-auto">
          <Grid cols={2} className="gap-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-1">
                  <Layers className="h-5 w-5 text-primary" />
                  <CardTitle className="text-sm">CSM 2.0 Specification</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Full versioned specification: domains, execution functions, governance contracts, state model, determinism boundary, evidence and decision schemas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/cognitive-systems-management/v2"
                  className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1"
                >
                  View specification <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-1">
                  <GitBranch className="h-5 w-5 text-primary" />
                  <CardTitle className="text-sm">Governance Contracts</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Browsable reference for all 16 component governance contracts with IDs, core questions, inputs, decisions, evidence and handoffs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/cognitive-systems-management/contracts"
                  className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1"
                >
                  View contracts <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-1">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle className="text-sm">Framework Guide</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Full versioned framework guide with all domains, components, handoffs, implementation guidance and provenance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/cognitive-systems-management/framework-guide"
                  className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1"
                >
                  View guide <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-1">
                  <Printer className="h-5 w-5 text-primary" />
                  <CardTitle className="text-sm">Quick Reference</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Concise printable reference: four domains, six execution functions, governance contract model.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/cognitive-systems-management/quick-reference"
                  className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1"
                >
                  View reference <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-1">
                  <Scale className="h-5 w-5 text-primary" />
                  <CardTitle className="text-sm">Reference Assessment</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Interactive reference evaluator. Provide structured system facts and receive applicable CSM requirements, evidence gaps and human review items.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/cognitive-systems-management/assessment"
                  className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1"
                >
                  Try assessment <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-1">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle className="text-sm">Machine-Readable Spec</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  JSON specification and schema for programmatic consumption. Generated from canonical TypeScript source.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <a
                  href="/frameworks/csm/2.0/csm-2.0.json"
                  className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1"
                >
                  View JSON <ExternalLink className="h-3 w-3" />
                </a>
              </CardContent>
            </Card>
          </Grid>
        </div>
      </Section>

      {/* Source / References */}
      <Section
        className="pt-8"
        subtitle="Provenance"
        title="Source and References"
        sectionNum="§15"
      >
        <div className="max-w-3xl mx-auto space-y-3">
          <Card>
            <CardHeader>
              <div className="flex items-start gap-3">
                <BookOpen className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <CardTitle className="text-sm">
                    {csmProvenance.originalArticleTitle}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {csmProvenance.author} &middot; {csmProvenance.publication} &middot;{' '}
                    {csmGuideVersion.originalPublicationDate}
                  </CardDescription>
                  <a
                    href={csmProvenance.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-2"
                  >
                    Read original article <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </CardHeader>
          </Card>
          <p className="text-xs text-muted-foreground">
            Current Framework Guide revision: {csmGuideVersion.currentRevisionDate} (v{csmGuideVersion.version}).
            {csmGuideVersion.note}
          </p>
        </div>
      </Section>

      <CTA
        title="Explore CSM 2.0"
        description="Dive deeper into the full specification, governance contracts, reference assessment, or explore how CSM 2.0 connects to the AI Governance Execution Framework and HAIEC."
        primaryButton={{
          text: 'CSM 2.0 Specification',
          href: '/cognitive-systems-management/v2',
        }}
        secondaryButton={{ text: 'Explore HAIEC', href: '/solutions/haiec' }}
      />
    </>
  )
}
