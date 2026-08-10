import Link from 'next/link'
import { FileText, Printer, ExternalLink, ArrowRight } from 'lucide-react'
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
  title: 'Cognitive Systems Management 2.0 — Framework & Governance Specification | Subodh KC',
  description:
    'Full versioned CSM 2.0 Framework Guide: four governance domains, six execution functions, governance contracts, state model, evidence and decision schemas, handoffs, reassessment and proportionality.',
  alternates: {
    canonical:
      'https://subodhkc.com/cognitive-systems-management/framework-guide',
  },
  openGraph: {
    title: 'CSM 2.0 Framework & Governance Specification | Subodh KC',
    description:
      'Full versioned CSM 2.0 Framework Guide with four domains, six execution functions, governance contracts, evidence schemas and implementation guidance.',
    url: 'https://subodhkc.com/cognitive-systems-management/framework-guide',
    type: 'article',
    authors: ['Subodh KC'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CSM 2.0 Framework Guide | Subodh KC',
    description:
      'Full versioned CSM 2.0 Framework Guide with four domains, six execution functions, governance contracts and implementation guidance.',
  },
}

export default function CSMFrameworkGuide() {
  return (
    <article className="print-friendly">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Header */}
        <header className="space-y-4 border-b border-border pb-6">
          <div className="flex items-center justify-between">
            <Link
              href="/cognitive-systems-management"
              className="text-sm text-primary hover:underline inline-flex items-center gap-1"
            >
              <ArrowRight className="h-3 w-3 rotate-180" /> Back to CSM
            </Link>
            <button
              onClick={() => window.print()}
              className="text-sm text-primary hover:underline inline-flex items-center gap-1 print:hidden"
            >
              <Printer className="h-4 w-4" /> Print / Save as PDF
            </button>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Cognitive Systems Management 2.0
          </h1>
          <p className="text-base text-muted-foreground">Framework &amp; Governance Specification</p>
          <p className="text-sm text-muted-foreground">
            By {csmProvenance.author} &middot; Current revision: {csmGuideVersion.currentRevisionDate}{' '}
            (v{csmGuideVersion.version}) &middot; Spec v2.0.0
          </p>
        </header>

        {/* Executive Summary */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Executive Summary</h2>
          <p className="text-sm text-foreground/90 leading-relaxed">{csmFramework.directDefinition}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{csmFramework.description}</p>
          <p className="text-sm text-foreground/90 leading-relaxed">{csmFramework.problemStatement}</p>
          <p className="text-sm text-foreground font-medium">{csmFramework.valueStatement}</p>
          <div className="border-l-4 border-primary/40 pl-4 py-2 bg-muted/20 rounded-r-lg mt-3">
            <p className="text-sm text-foreground">
              <strong>CSM 2.0</strong> preserves the original four governance domains and adds an operational specification: governance contracts, a determinism boundary, explicit state models, evidence and decision schemas, handoff contracts, reassessment triggers and a reference evaluator.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Four governance domains. Six execution functions. Explicit decisions and evidence. Deterministic evaluation applies to objective governance rules; interpretive decisions require explicit human review.
            </p>
            <div className="flex gap-2 mt-2">
              <Link href="/cognitive-systems-management/v2" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                CSM 2.0 Specification <ArrowRight className="h-3 w-3" />
              </Link>
              <Link href="/cognitive-systems-management/contracts" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                Governance Contracts <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </section>

        {/* Original Provenance */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Original Provenance</h2>
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Original article title:</strong>{' '}
            &ldquo;{csmProvenance.originalArticleTitle}&rdquo;
          </p>
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Author:</strong> {csmProvenance.author}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Publication:</strong> {csmProvenance.publication}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Publication date:</strong>{' '}
            {csmGuideVersion.originalPublicationDate}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Source URL:</strong>{' '}
            <a
              href={csmProvenance.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              {csmProvenance.sourceUrl} <ExternalLink className="h-3 w-3" />
            </a>
          </p>
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Naming note:</strong> The exact published article title uses
            &ldquo;Cognitive System Management&rdquo; (singular). The framework is referred to as
            &ldquo;Cognitive Systems Management (CSM)&rdquo; in the publication. Current SubodhKC.com
            branding normalizes to <strong>Cognitive Systems Management (CSM)</strong>.
          </p>
        </section>

        {/* Framework Assumptions */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Framework Assumptions</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            CSM is based on the observation that AI systems may exhibit characteristics that differ from
            conventional software, including probabilistic outputs, adaptive behavior and emergent
            capabilities. Some AI systems may change because of model updates, provider changes,
            prompts/configuration, retrieval data, training/fine-tuning, changing operational data or
            tools/integrations. Not every deployed AI model continuously learns. Governance should account
            for these possibilities proportionately rather than assuming universal characteristics.
          </p>
        </section>

        {/* Four Domains */}
        {csmDomains.map((domain) => (
          <section key={domain.id} className="space-y-4">
            <h2 className="text-xl font-semibold border-b border-border pb-2">
              {domain.displayName}
            </h2>
            <p className="text-sm font-medium text-foreground italic">{domain.tagline}</p>
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Core question:</strong> {domain.centralQuestion}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">{domain.problem}</p>

            <h3 className="text-sm font-semibold text-foreground">Verified original components</h3>
            <div className="space-y-2">
              {domain.originalComponents.map((comp) => (
                <div key={comp.name} className="pl-4 border-l-2 border-primary/30">
                  <p className="text-sm font-medium text-foreground">{comp.name}</p>
                  <p className="text-xs text-muted-foreground">{comp.description}</p>
                </div>
              ))}
            </div>

            <h3 className="text-sm font-semibold text-foreground">Current implementation examples</h3>
            <p className="text-xs text-muted-foreground italic">
              Current implementation interpretation. Not explicitly present in the original 2025 article.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {domain.currentImplementationExamples.map((ex) => (
                <div key={ex.name} className="pl-3 border-l border-border">
                  <p className="text-xs font-medium text-foreground">{ex.name}</p>
                  <p className="text-xs text-muted-foreground">{ex.description}</p>
                </div>
              ))}
            </div>

            <h3 className="text-sm font-semibold text-foreground">Example artifacts</h3>
            <p className="text-xs text-muted-foreground">
              {domain.exampleArtifacts.join(' \u00B7 ')}
            </p>

            <h3 className="text-sm font-semibold text-foreground">Typical roles</h3>
            <p className="text-xs text-muted-foreground">{domain.typicalRoles.join(' \u00B7 ')}</p>

            {domain.handoffs.length > 0 && (
              <>
                <h3 className="text-sm font-semibold text-foreground">Handoffs</h3>
                <ul className="space-y-1 ml-4">
                  {domain.handoffs.map((h, i) => (
                    <li key={i} className="list-disc text-xs text-muted-foreground">
                      <strong>{h.from}</strong> &rarr; <strong>{h.to}</strong>: {h.description}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <h3 className="text-sm font-semibold text-foreground">Common failure modes</h3>
            <ul className="space-y-0.5 ml-4">
              {domain.failureModes.map((fm) => (
                <li key={fm} className="list-disc text-xs text-muted-foreground">{fm}</li>
              ))}
            </ul>

            <h3 className="text-sm font-semibold text-foreground">Reassessment triggers</h3>
            <ul className="space-y-0.5 ml-4">
              {domain.reassessmentTriggers.map((rt) => (
                <li key={rt} className="list-disc text-xs text-muted-foreground">{rt}</li>
              ))}
            </ul>

            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Value:</strong> {domain.value}
            </p>
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Limitations:</strong> {domain.limitations}
            </p>
          </section>
        ))}

        {/* Governance Handoffs */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Governance Handoffs</h2>
          {csmHandoffs.map((h, i) => (
            <div key={i} className="pl-4 border-l-2 border-primary/30">
              <p className="text-sm font-medium text-foreground">
                {h.from} &rarr; {h.to}
              </p>
              <p className="text-xs text-muted-foreground">{h.description}</p>
            </div>
          ))}
        </section>

        {/* Implementation Guidance */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Implementation Guidance
          </h2>
          <p className="text-xs text-muted-foreground italic">
            {csmImplementationGuidance.label}
          </p>
          {csmImplementationGuidance.phases.map((phase) => (
            <div key={phase.name} className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground">{phase.name}</h3>
              <ul className="space-y-0.5 ml-4">
                {phase.activities.map((a) => (
                  <li key={a} className="list-disc text-xs text-muted-foreground">{a}</li>
                ))}
              </ul>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">{csmImplementationGuidance.note}</p>
        </section>

        {/* Proportionality */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            {csmProportionality.title}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {csmProportionality.statement}
          </p>
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Factors:</strong>{' '}
            {csmProportionality.factors.join(' \u00B7 ')}
          </p>
          <p className="text-xs text-muted-foreground">{csmProportionality.note}</p>
        </section>

        {/* Limitations */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Limitations</h2>
          <p className="text-sm text-foreground/90 leading-relaxed">
            {csmFramework.limitationStatement}
          </p>
          <p className="text-xs text-muted-foreground">
            CSM is not peer reviewed. CSM is not an industry standard. It is a practitioner-developed
            governance methodology.
          </p>
        </section>

        {/* What CSM Is Not */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">What CSM Is Not</h2>
          <ul className="space-y-0.5 ml-4">
            {csmFramework.whatCSMIsNot.map((item) => (
              <li key={item} className="list-disc text-sm text-muted-foreground">{item}</li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">CSM is:</strong> {csmFramework.whatCSMIs}
          </p>
        </section>

        {/* Current Framework Relationship */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Relationship to the AI Governance Execution Framework
          </h2>
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">CSM</strong> answers WHERE governance responsibilities
            operate: {csmRelationshipToExecutionFramework.csmDomains.join(', ')}.
          </p>
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">AI Governance Execution Framework</strong> answers WHAT
            operating functions should continuously occur across those domains.
          </p>
          <ol className="space-y-0.5 ml-4">
            {csmRelationshipToExecutionFramework.executionFrameworkFunctions.map((f, i) => (
              <li key={f} className="list-decimal text-xs text-muted-foreground">
                {f}
              </li>
            ))}
          </ol>
          <p className="text-sm text-foreground font-medium">
            {csmRelationshipToExecutionFramework.relationship}
          </p>
          <p className="text-xs text-muted-foreground italic">
            {csmRelationshipToExecutionFramework.label}
          </p>
        </section>

        {/* CSM → Execution Framework → HAIEC */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            CSM, Execution Framework, and HAIEC
          </h2>
          {csmToHaiec.layers.map((layer) => (
            <div key={layer.name} className="pl-4 border-l-2 border-primary/30">
              <p className="text-sm font-medium text-foreground">{layer.name}</p>
              <p className="text-xs text-muted-foreground">{layer.role}</p>
            </div>
          ))}
          <p className="text-xs text-muted-foreground italic">{csmToHaiec.note}</p>
        </section>

        {/* Source / References */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Source and References</h2>
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Original publication:</strong>{' '}
            &ldquo;{csmProvenance.originalArticleTitle}&rdquo; by {csmProvenance.author},{' '}
            {csmProvenance.publication}, {csmGuideVersion.originalPublicationDate}.
          </p>
          <a
            href={csmProvenance.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
          >
            {csmProvenance.sourceUrl} <ExternalLink className="h-3 w-3" />
          </a>
        </section>

        {/* Version / Change History */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Version and Change History
          </h2>
          <div className="space-y-2">
            <div className="pl-4 border-l-2 border-primary/30">
              <p className="text-sm font-medium text-foreground">
                Original publication — {csmGuideVersion.originalPublicationDate}
              </p>
              <p className="text-xs text-muted-foreground">
                &ldquo;{csmProvenance.originalArticleTitle}&rdquo; published on {csmProvenance.publication}.
              </p>
            </div>
            <div className="pl-4 border-l-2 border-primary/30">
              <p className="text-sm font-medium text-foreground">
                Current Framework Guide — {csmGuideVersion.currentRevisionDate} (v{csmGuideVersion.version})
              </p>
              <p className="text-xs text-muted-foreground">{csmGuideVersion.note}</p>
            </div>
          </div>
        </section>

        {/* Claims Intentionally Excluded */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Claims Intentionally Excluded
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The original Medium article contained anonymous practical-application examples
            (financial-services, healthcare-system, technology-company and manufacturing-company
            examples). These have not been republished on SubodhKC.com as verified customer case studies.
            The original article also contained marketing claims such as &ldquo;NIST Audit Ready&rdquo;,
            universal compliance claims and unsupported statistics. These have not been reproduced.
          </p>
        </section>

        <footer className="border-t border-border pt-4 text-center">
          <p className="text-xs text-muted-foreground">
            {csmFramework.name} Framework Guide &middot; v{csmGuideVersion.version} &middot;{' '}
            {csmGuideVersion.currentRevisionDate} &middot; Subodh KC
          </p>
        </footer>
      </div>
    </article>
  )
}
