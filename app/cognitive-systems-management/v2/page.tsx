import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowRight, ExternalLink, GitBranch, Shield, Scale, Layers, RefreshCw, AlertTriangle, CheckCircle2, FileText, Cpu } from 'lucide-react'
import {
  CSM_SPEC_VERSION,
  CSM_SPEC_DATE,
  csmChangelog,
  csmDomains,
  csmComponents,
  executionFunctions,
  operationalMapping,
  handoffContracts,
  reassessmentTriggers,
  componentDependencies,
  csmV2Provenance,
  GOVERNANCE_DEPTH_DEFINITIONS,
  PROPORTIONALITY_FACTORS,
  REQUIREMENT_STATE_DEFINITIONS,
  DOMAIN_STATE_DEFINITIONS,
  SYSTEM_STATE_DEFINITIONS,
  DETERMINISTIC_DECISIONS,
  HUMAN_JUDGMENT_DECISIONS,
  FORBIDDEN_OUTPUT_STATES,
  FORBIDDEN_SCORE_NAMES,
} from '@/data/csm/v2/spec'
import { governanceContracts } from '@/data/csm/v2/contracts'
import { nistIsoCrosswalk, crosswalkDisclaimer } from '@/data/csm/v2/crosswalk'

export const metadata = {
  title: 'CSM 2.0 Specification | Cognitive Systems Management | Subodh KC',
  description:
    'The versioned CSM 2.0 specification: four governance domains, six execution functions, governance contracts, state model, determinism boundary, evidence and decision schemas, handoffs, reassessment triggers and proportionality.',
  alternates: {
    canonical: 'https://subodhkc.com/cognitive-systems-management/v2',
  },
  openGraph: {
    title: 'CSM 2.0 Specification | Subodh KC',
    description:
      'Versioned deterministic-by-design governance operating model for AI systems.',
    url: 'https://subodhkc.com/cognitive-systems-management/v2',
    type: 'article',
    authors: ['Subodh KC'],
    publishedTime: '2025-08-29',
    modifiedTime: '2026-08-10',
    tags: ['CSM 2.0', 'CSM specification', 'governance contracts', 'deterministic governance', 'AI governance specification'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CSM 2.0 Specification | Subodh KC',
    description:
      'Versioned deterministic-by-design governance operating model for AI systems.',
  },
  keywords: [
    'CSM 2.0',
    'CSM specification',
    'governance contracts',
    'deterministic governance',
    'AI governance specification',
    'evidence schema',
    'decision records',
    'reassessment triggers',
  ],
}

const techArticleSchema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Cognitive Systems Management 2.0 - Framework & Governance Specification',
  author: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
  datePublished: '2025-08-29',
  dateModified: '2026-08-10',
  publisher: { '@type': 'Organization', name: 'Subodh KC', url: 'https://subodhkc.com' },
  mainEntityOfPage: 'https://subodhkc.com/cognitive-systems-management/v2',
  version: '2.0.0',
  about: {
    '@type': 'DefinedTerm',
    name: 'Cognitive Systems Management 2.0',
    description: 'A deterministic-by-design governance operating model for AI systems.',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'Research', item: 'https://subodhkc.com/research' },
    { '@type': 'ListItem', position: 3, name: 'Cognitive Systems Management', item: 'https://subodhkc.com/cognitive-systems-management' },
    { '@type': 'ListItem', position: 4, name: 'V2 Specification', item: 'https://subodhkc.com/cognitive-systems-management/v2' },
  ],
}

export default function CSMV2SpecPage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Hero
        subtitle={`Specification v${CSM_SPEC_VERSION} · ${CSM_SPEC_DATE}`}
        title={
          <>
            CSM 2.0 Specification
            <br />
            <span className="gradient-text">Framework &amp; Governance</span>
          </>
        }
        description="The versioned, deterministic-by-design governance operating model for AI systems."
      />

      {/* 1. Why V2 Exists */}
      <Section className="pt-8" subtitle="Context" title="Why CSM 2.0 Exists" sectionNum="01">
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-base text-foreground/90 leading-relaxed">
            The original 2025 CSM publication defined four governance domains and sixteen components. It described what governance responsibilities exist but did not formalize how those responsibilities are evaluated, evidenced, transferred between teams or reopened when conditions change.
          </p>
          <p className="text-base text-foreground/90 leading-relaxed">
            CSM 2.0 adds an operational specification layer: governance contracts, a determinism boundary, explicit state models, evidence and decision schemas, handoff contracts, reassessment triggers and a reference evaluator. The original domains, components and their names are preserved unchanged.
          </p>
        </div>
      </Section>

      {/* 2. What Remained from V1 */}
      <Section className="pt-8" subtitle="Continuity" title="What Remained from V1" sectionNum="02">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              'Four governance domains: Enterprise, Project, Code, UX',
              'Sixteen original components (4 per domain)',
              'Original component names and descriptions',
              'Proportionality principle: governance depth scales with risk',
              'Handoff visibility as a core value',
              'Original provenance and authorship',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 p-3 rounded-lg border border-border bg-muted/20">
                <CheckCircle2 className="h-4 w-4 text-primary/60 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
          <div className="border-l-4 border-primary/40 pl-4 py-2 bg-muted/20 rounded-r-lg">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">CSM 2.0 is based on and evolved from the original 2025 CSM publication.</strong>{' '}
              &ldquo;{csmV2Provenance.originalArticleTitle}&rdquo; by {csmV2Provenance.originalAuthor},{' '}
              {csmV2Provenance.originalPublication}, {csmV2Provenance.originalPublicationDate}.
            </p>
            <a
              href={csmV2Provenance.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-2"
            >
              Read original article <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </Section>

      {/* 3. Four-Domain Model */}
      <Section className="pt-8" subtitle="WHERE" title="Four Governance Domains" sectionNum="03">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {csmDomains.map((domain) => (
              <Card key={domain.id}>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-primary">{domain.id}</span>
                    <CardTitle className="text-sm">{domain.displayName}</CardTitle>
                  </div>
                  <CardDescription className="text-xs italic">{domain.tagline}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{domain.centralQuestion}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {domain.componentIds.map((cid) => (
                      <span key={cid} className="text-xs font-mono text-muted-foreground/80">{cid}</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* 4. Six Execution Functions */}
      <Section className="pt-8" subtitle="WHAT" title="Six Execution Functions" sectionNum="04">
        <div className="max-w-4xl mx-auto space-y-3">
          {executionFunctions.map((ef) => (
            <Card key={ef.id}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-primary">{ef.id}</span>
                  <CardTitle className="text-sm">{ef.name}</CardTitle>
                </div>
                <CardDescription className="text-xs">{ef.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground"><strong className="text-foreground">Question:</strong> {ef.question}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* 5. Governance Contract Model */}
      <Section className="pt-8" subtitle="HOW" title="Governance Contract Model" sectionNum="05">
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-base text-foreground/90 leading-relaxed">
            Every CSM component has a governance contract that formalizes its purpose, applicability, objective rules, human judgment points, evidence requirements, handoffs and reassessment behavior.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              'Purpose & core question',
              'Applicability conditions',
              'Required & optional inputs',
              'Objective rules (deterministic)',
              'Human judgment points (interpretive)',
              'Required decisions',
              'Required evidence with expiry',
              'Responsible & accountable roles',
              'Outputs',
              'Blocking conditions',
              'Allowed exceptions with scope & duration',
              'Handoff targets & outputs',
              'Reassessment triggers',
              'Execution function mappings',
              'Source provenance',
              'Component dependencies',
            ].map((field) => (
              <div key={field} className="flex items-start gap-2 p-2.5 rounded-lg border border-border bg-muted/20">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary/60 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-muted-foreground">{field}</span>
              </div>
            ))}
          </div>
          <Link
            href="/cognitive-systems-management/contracts"
            className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1"
          >
            View all 16 governance contracts <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </Section>

      {/* 6. State Model */}
      <Section className="pt-8" subtitle="States" title="State Model" sectionNum="06">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Requirement States (10)</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {Object.entries(REQUIREMENT_STATE_DEFINITIONS).map(([key, def]) => (
                <div key={key} className="p-2.5 rounded-lg border border-border bg-muted/20">
                  <p className="text-xs font-mono text-primary">{key}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{def}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Domain States (5)</h3>
            <div className="grid gap-2 sm:grid-cols-3">
              {Object.entries(DOMAIN_STATE_DEFINITIONS).map(([key, def]) => (
                <div key={key} className="p-2.5 rounded-lg border border-border bg-muted/20">
                  <p className="text-xs font-mono text-primary">{key}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{def}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">System States (5)</h3>
            <div className="grid gap-2 sm:grid-cols-3">
              {Object.entries(SYSTEM_STATE_DEFINITIONS).map(([key, def]) => (
                <div key={key} className="p-2.5 rounded-lg border border-border bg-muted/20">
                  <p className="text-xs font-mono text-primary">{key}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{def}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* 7. Determinism Boundary */}
      <Section className="pt-8" subtitle="Determinism" title="Determinism Boundary" sectionNum="07">
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-base text-foreground/90 leading-relaxed">
            For a fixed CSM specification version, organizational policy configuration, explicit assessment date and normalized input record, objective CSM evaluation must produce the same computed requirement set and statuses.
          </p>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Deterministic Decisions (10)</h3>
            <div className="grid gap-1 sm:grid-cols-2">
              {DETERMINISTIC_DECISIONS.map((d) => (
                <div key={d} className="flex items-start gap-2 p-2 rounded-lg border border-green-500/20 bg-green-500/5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-muted-foreground">{d}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Human Judgment Decisions (10)</h3>
            <div className="grid gap-1 sm:grid-cols-2">
              {HUMAN_JUDGMENT_DECISIONS.map((d) => (
                <div key={d} className="flex items-start gap-2 p-2 rounded-lg border border-amber-500/20 bg-amber-500/5">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-muted-foreground">{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* 8. Human Review Boundary */}
      <Section className="pt-8" subtitle="Human Review" title="Human Review Boundary" sectionNum="08">
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-base text-foreground/90 leading-relaxed">
            When a rule cannot be resolved objectively, the evaluator returns <code className="text-xs bg-muted px-1.5 py-0.5 rounded">HUMAN_REVIEW_REQUIRED</code> and provides: the question requiring review, the responsible role, the evidence needed and the affected components.
          </p>
          <p className="text-sm text-muted-foreground">
            The evaluator does not call OpenAI or another model to resolve human judgment decisions. A human authority may separately record <code className="text-xs bg-muted px-1.5 py-0.5 rounded">APPROVED_FOR_&lt;PURPOSE&gt;</code> as a decision record, not an engine inference.
          </p>
        </div>
      </Section>

      {/* 9. Evidence Model */}
      <Section className="pt-8" subtitle="Evidence" title="Evidence Model" sectionNum="09">
        <div className="max-w-3xl mx-auto space-y-3">
          <p className="text-base text-foreground/90 leading-relaxed">
            Evidence records are versioned, have explicit effective and expiry dates, and link to specific requirement IDs.
          </p>
          <div className="p-4 rounded-lg border border-border bg-muted/20 font-mono text-xs space-y-1">
            <p className="text-primary">EvidenceRecord {`{`}</p>
            <p className="ml-4">evidenceId, type, title, source, owner</p>
            <p className="ml-4">createdAt, effectiveAt, expiresAt?</p>
            <p className="ml-4">systemVersion?, artifactVersion?</p>
            <p className="ml-4">uri?, hash?</p>
            <p className="ml-4">relatedRequirementIds[]</p>
            <p className="ml-4">status: active | expired | superseded</p>
            <p className="text-primary">{`}`}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Hash is optional and supports integrity checking. An artifact with a hash is not called &ldquo;immutable.&rdquo;
          </p>
        </div>
      </Section>

      {/* 10. Decision Records */}
      <Section className="pt-8" subtitle="Decisions" title="Decision Records" sectionNum="10">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="p-4 rounded-lg border border-border bg-muted/20 font-mono text-xs space-y-1">
            <p className="text-primary">DecisionRecord {`{`}</p>
            <p className="ml-4">decisionId, requirementId, question</p>
            <p className="ml-4">decision, decisionType</p>
            <p className="ml-4">reviewer, reviewerRole, rationale</p>
            <p className="ml-4">evidenceRefs[]</p>
            <p className="ml-4">decidedAt, effectiveAt, expiresAt?</p>
            <p className="ml-4">specVersion, policyVersion</p>
            <p className="text-primary">{`}`}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">decisionType</strong> distinguishes: objective_computation, human_approval, legal_review, exception, risk_acceptance
          </p>
        </div>
      </Section>

      {/* 11. Exceptions */}
      <Section className="pt-8" subtitle="Exceptions" title="Exceptions" sectionNum="11">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="p-4 rounded-lg border border-border bg-muted/20 font-mono text-xs space-y-1">
            <p className="text-primary">ExceptionRecord {`{`}</p>
            <p className="ml-4">exceptionId, requirementId, reason</p>
            <p className="ml-4">approver, approverRole</p>
            <p className="ml-4">compensatingControls[]</p>
            <p className="ml-4">issuedAt, expiresAt, scope</p>
            <p className="ml-4">evidenceRefs[], reassessmentTrigger</p>
            <p className="text-primary">{`}`}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Expired exceptions must not remain silently valid. The evaluator checks <code className="text-xs bg-muted px-1 py-0.5 rounded">expiresAt</code> against the explicit <code className="text-xs bg-muted px-1 py-0.5 rounded">assessmentAsOf</code> date.
          </p>
        </div>
      </Section>

      {/* 12. Handoffs */}
      <Section className="pt-8" subtitle="Handoffs" title="Handoff Contracts" sectionNum="12">
        <div className="max-w-4xl mx-auto space-y-3">
          <p className="text-sm text-muted-foreground">Handoffs are bidirectional feedback loops, not a waterfall.</p>
          {handoffContracts.map((hc) => (
            <Card key={hc.id}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-primary">{hc.id}</span>
                  <CardTitle className="text-sm">{hc.name}</CardTitle>
                </div>
                <CardDescription className="text-xs">{hc.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-primary">{hc.fromDomain}</span>
                  <ArrowRight className="h-3 w-3 text-primary" />
                  <span className="font-mono text-primary">{hc.toDomain}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {hc.requiredFields.map((f) => (
                    <span key={f} className="text-xs font-mono text-muted-foreground/80 bg-muted/30 px-1.5 py-0.5 rounded">{f}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* 13. Reassessment */}
      <Section className="pt-8" subtitle="Reassessment" title="Reassessment Triggers" sectionNum="13">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="text-sm text-muted-foreground mb-3">
            18 triggers. Each specifies which domains and components reopen. Triggers do not automatically reopen all 16 components unless necessary.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {reassessmentTriggers.map((trigger) => (
              <div key={trigger.id} className="p-2.5 rounded-lg border border-border bg-muted/20">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-3.5 w-3.5 text-primary/60 flex-shrink-0" />
                  <span className="text-xs font-mono text-primary">{trigger.id}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{trigger.label}</p>
                <p className="text-xs text-muted-foreground/70 mt-0.5">{trigger.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 14. Proportionality */}
      <Section className="pt-8" subtitle="Proportionality" title="Governance Depth & Proportionality" sectionNum="14">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {Object.entries(GOVERNANCE_DEPTH_DEFINITIONS).map(([key, def]) => (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="text-sm">{key}</CardTitle>
                  <CardDescription className="text-xs">{def}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Proportionality Factors (10)</h3>
            <div className="flex flex-wrap gap-1.5">
              {PROPORTIONALITY_FACTORS.map((f) => (
                <span key={f.id} className="inline-flex items-center rounded-full border border-border bg-muted/30 px-2.5 py-0.5 text-xs" title={f.description}>
                  {f.label}
                </span>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            The framework supplies recommended factors. The organization defines actual policy thresholds. Once thresholds are configured, evaluation is deterministic.
          </p>
        </div>
      </Section>

      {/* 15. Machine-Readable Specification */}
      <Section className="pt-8" subtitle="Machine-Readable" title="Machine-Readable Specification" sectionNum="15">
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-base text-foreground/90 leading-relaxed">
            The CSM 2.0 specification is generated from canonical TypeScript source. No manually maintained duplicate JSON.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle className="text-sm">JSON Specification</CardTitle>
                </div>
                <CardDescription className="text-xs">Full machine-readable spec with all domains, components, contracts, triggers and crosswalk.</CardDescription>
              </CardHeader>
              <CardContent>
                <a href="/frameworks/csm/2.0/csm-2.0.json" className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1">
                  csm-2.0.json <ExternalLink className="h-3 w-3" />
                </a>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle className="text-sm">JSON Schema</CardTitle>
                </div>
                <CardDescription className="text-xs">JSON Schema for validation and tooling integration.</CardDescription>
              </CardHeader>
              <CardContent>
                <a href="/frameworks/csm/2.0/csm-2.0.schema.json" className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1">
                  csm-2.0.schema.json <ExternalLink className="h-3 w-3" />
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* 16. Reference Evaluator */}
      <Section className="pt-8" subtitle="Evaluator" title="Reference Evaluator" sectionNum="16">
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-base text-foreground/90 leading-relaxed">
            A pure deterministic reference evaluator implements the CSM 2.0 rules. It uses no LLM calls, no randomness, no external API and no implicit clock.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              'No LLM calls',
              'No randomness',
              'No external API dependencies',
              'No implicit current-time (uses explicit assessmentAsOf)',
              'Stable normalized inputs',
              'Stable lexicographic output ordering',
              'Explicit spec version',
              'Explicit policy version',
            ].map((req) => (
              <div key={req} className="flex items-start gap-2 p-2.5 rounded-lg border border-border bg-muted/20">
                <Cpu className="h-3.5 w-3.5 text-primary/60 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-muted-foreground">{req}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            The evaluator is a reference implementation. It is NOT HAIEC itself.
          </p>
        </div>
      </Section>

      {/* 17. Example Test Scenarios */}
      <Section className="pt-8" subtitle="Test Fixtures" title="Example Test Scenarios" sectionNum="17">
        <div className="max-w-3xl mx-auto space-y-3">
          <p className="text-sm text-muted-foreground">8 golden test fixtures covering representative scenarios. All are test fixtures, not real customers.</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { id: 'fixture-1', label: 'Low-impact internal AI assistant (BASELINE)' },
              { id: 'fixture-2', label: 'External customer-facing AI assistant (ENHANCED)' },
              { id: 'fixture-3', label: 'AI-assisted software-development workflow (BASELINE)' },
              { id: 'fixture-4', label: 'High-impact decision-support scenario (INTENSIVE)' },
              { id: 'fixture-5', label: 'Agent with tool authority (ENHANCED)' },
              { id: 'fixture-6', label: 'Expired governance exception (BASELINE)' },
              { id: 'fixture-7', label: 'Human/legal applicability review (INTENSIVE)' },
              { id: 'fixture-8', label: 'Material provider/model change (ENHANCED)' },
            ].map((fx) => (
              <div key={fx.id} className="p-2.5 rounded-lg border border-border bg-muted/20">
                <p className="text-xs font-mono text-primary">{fx.id}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{fx.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 18. Limitations */}
      <Section className="pt-8" subtitle="Limitations" title="Limitations" sectionNum="18">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="border-l-4 border-amber-500/40 pl-4 py-2 bg-amber-500/5 rounded-r-lg">
            <p className="text-sm text-foreground leading-relaxed">
              CSM 2.0 is a practitioner-developed governance methodology, versioned for public scrutiny and implementation. It is not a regulatory standard, certification, peer-reviewed standard or legal framework.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              'Does not determine legal compliance',
              'Does not replace qualified legal review',
              'Does not guarantee governance outcomes',
              'Does not produce composite scores or ratings',
              'Human judgment decisions require qualified reviewers',
              'Proportionality thresholds are organization-defined',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 p-2.5 rounded-lg border border-border bg-muted/20">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 19. Version History */}
      <Section className="pt-8" subtitle="Versioning" title="Version History" sectionNum="19">
        <div className="max-w-3xl mx-auto space-y-3">
          {csmChangelog.map((entry) => (
            <Card key={entry.version}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-primary">v{entry.version}</span>
                  <CardTitle className="text-sm">{entry.label}</CardTitle>
                  <span className="text-xs text-muted-foreground ml-auto">{entry.date}</span>
                </div>
                <CardDescription className="text-xs">{entry.summary}</CardDescription>
              </CardHeader>
              {entry.added.length > 0 && (
                <CardContent>
                  <p className="text-xs font-medium text-foreground mb-1">Added:</p>
                  <ul className="space-y-0.5 ml-3">
                    {entry.added.map((a) => (
                      <li key={a} className="list-disc text-xs text-muted-foreground">{a}</li>
                    ))}
                  </ul>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </Section>

      {/* 20. Original Publication Source */}
      <Section className="pt-8" subtitle="Provenance" title="Original Publication Source" sectionNum="20">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <CardTitle className="text-sm">{csmV2Provenance.originalArticleTitle}</CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {csmV2Provenance.originalAuthor} · {csmV2Provenance.originalPublication} · {csmV2Provenance.originalPublicationDate}
                  </CardDescription>
                  <a
                    href={csmV2Provenance.sourceUrl}
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
          <p className="text-xs text-muted-foreground mt-3">
            {csmV2Provenance.legalDisclaimer}
          </p>
        </div>
      </Section>

      {/* Forbidden Output States */}
      <Section className="pt-8" subtitle="Forbidden" title="Forbidden Output States" sectionNum="21">
        <div className="max-w-3xl mx-auto space-y-3">
          <p className="text-sm text-muted-foreground">The evaluator must never produce these states:</p>
          <div className="flex flex-wrap gap-2">
            {FORBIDDEN_OUTPUT_STATES.map((s) => (
              <span key={s} className="inline-flex items-center rounded-full border border-red-500/30 bg-red-500/5 px-2.5 py-0.5 text-xs text-red-600 font-mono">
                {s}
              </span>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">The evaluator must never produce these score names:</p>
          <div className="flex flex-wrap gap-2">
            {FORBIDDEN_SCORE_NAMES.map((s) => (
              <span key={s} className="inline-flex items-center rounded-full border border-red-500/30 bg-red-500/5 px-2.5 py-0.5 text-xs text-red-600 font-mono">
                {s}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* NIST/ISO Crosswalk */}
      <Section className="pt-8" subtitle="Informative Mapping" title="NIST AI RMF & ISO/IEC 42001 Crosswalk" sectionNum="22">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="border-l-4 border-blue-500/40 pl-4 py-2 bg-blue-500/5 rounded-r-lg">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Informative Mapping.</strong> {crosswalkDisclaimer}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 font-medium text-foreground">CSM Component</th>
                  <th className="text-left p-2 font-medium text-foreground">NIST Function</th>
                  <th className="text-left p-2 font-medium text-foreground">ISO Clause</th>
                  <th className="text-left p-2 font-medium text-foreground">Relationship</th>
                </tr>
              </thead>
              <tbody>
                {nistIsoCrosswalk.map((entry) => (
                  <tr key={entry.csmComponentId} className="border-b border-border/50">
                    <td className="p-2 font-mono text-primary">{entry.csmComponentId}</td>
                    <td className="p-2 text-muted-foreground">{entry.nistFunction}</td>
                    <td className="p-2 text-muted-foreground">{entry.isoClause}</td>
                    <td className="p-2">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                        entry.relationship === 'supports' ? 'border border-green-500/30 bg-green-500/5 text-green-600' :
                        entry.relationship === 'partially-maps' ? 'border border-amber-500/30 bg-amber-500/5 text-amber-600' :
                        'border border-blue-500/30 bg-blue-500/5 text-blue-600'
                      }`}>
                        {entry.relationship}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <CTA
        title="Explore CSM 2.0 Further"
        description="Browse all 16 governance contracts, try the reference assessment, or return to the main CSM page."
        primaryButton={{
          text: 'Governance Contracts',
          href: '/cognitive-systems-management/contracts',
        }}
        secondaryButton={{ text: 'Back to CSM', href: '/cognitive-systems-management' }}
      />
    </>
  )
}
