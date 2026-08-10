import Link from 'next/link'
import { Printer, ArrowRight, ExternalLink } from 'lucide-react'
import { csmDomains, csmHandoffs, csmProvenance, csmGuideVersion } from '@/data/csm'
import { executionFunctions } from '@/data/csm/v2/spec'

export const metadata = {
  title: 'CSM 2.0 Quick Reference | Subodh KC',
  description:
    'Printable quick reference for CSM 2.0: four domains (WHERE), six execution functions (WHAT), governance contract model (HOW), and the objective/human-review boundary.',
  alternates: {
    canonical:
      'https://subodhkc.com/cognitive-systems-management/quick-reference',
  },
  openGraph: {
    title: 'CSM 2.0 Quick Reference | Subodh KC',
    description:
      'Printable quick reference for CSM 2.0: four domains, six execution functions, governance contract model.',
    url: 'https://subodhkc.com/cognitive-systems-management/quick-reference',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CSM 2.0 Quick Reference | Subodh KC',
    description:
      'Printable quick reference: four domains, six execution functions, governance contract model.',
  },
}

export default function CSMQuickReference() {
  return (
    <article className="print-friendly">
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <header className="space-y-3 border-b border-border pb-4">
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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Cognitive Systems Management 2.0 — Quick Reference
          </h1>
          <p className="text-xs text-muted-foreground">
            Derived from the canonical CSM data. This is a reference artifact, not the canonical framework definition.
          </p>
        </header>

        {/* Four Domains — WHERE */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Four Domains <span className="text-sm text-muted-foreground font-normal">— WHERE</span></h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-lg">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 border-b border-border font-semibold">Domain</th>
                  <th className="text-left p-3 border-b border-border font-semibold">Central Question</th>
                  <th className="text-left p-3 border-b border-border font-semibold">Original Components</th>
                  <th className="text-left p-3 border-b border-border font-semibold">Primary Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {csmDomains.map((domain) => (
                  <tr key={domain.id}>
                    <td className="p-3 font-medium text-foreground align-top">
                      {domain.displayName}
                    </td>
                    <td className="p-3 text-muted-foreground align-top text-xs">
                      {domain.centralQuestion}
                    </td>
                    <td className="p-3 text-muted-foreground align-top text-xs">
                      <ul className="space-y-0.5">
                        {domain.originalComponents.map((c) => (
                          <li key={c.name}>&bull; {c.name}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-3 text-muted-foreground align-top text-xs">
                      {domain.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Six Execution Functions — WHAT */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Six Execution Functions <span className="text-sm text-muted-foreground font-normal">— WHAT</span></h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-lg">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 border-b border-border font-semibold">ID</th>
                  <th className="text-left p-3 border-b border-border font-semibold">Function</th>
                  <th className="text-left p-3 border-b border-border font-semibold">Question</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {executionFunctions.map((ef) => (
                  <tr key={ef.id}>
                    <td className="p-3 font-mono text-xs text-primary align-top">{ef.id}</td>
                    <td className="p-3 font-medium text-foreground align-top text-xs">{ef.name}</td>
                    <td className="p-3 text-muted-foreground align-top text-xs">{ef.question}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Governance Contract — HOW */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Governance Contract <span className="text-sm text-muted-foreground font-normal">— HOW</span></h2>
          <p className="text-sm text-muted-foreground">
            Every component has a contract specifying purpose, applicability, objective rules, human judgment points, evidence requirements, handoffs and reassessment triggers.
          </p>
          <div className="border-l-4 border-primary/40 pl-4 py-2 bg-muted/20 rounded-r-lg space-y-1">
            <p className="text-sm text-foreground font-medium">Objective rules → deterministic evaluation</p>
            <p className="text-sm text-foreground font-medium">Interpretive decisions → explicit human review</p>
          </div>
          <Link href="/cognitive-systems-management/contracts" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
            View all 16 contracts <ArrowRight className="h-3 w-3" />
          </Link>
        </section>

        {/* Handoffs */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Major Handoffs</h2>
          <div className="space-y-2">
            {csmHandoffs.map((h, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="font-medium text-foreground">{h.from}</span>
                <ArrowRight className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                <span className="font-medium text-foreground">{h.to}</span>
                <span className="text-muted-foreground text-xs">: {h.description}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Source Citation */}
        <section className="space-y-2 border-t border-border pt-4">
          <h2 className="text-lg font-semibold">Original Source</h2>
          <p className="text-xs text-muted-foreground">
            &ldquo;{csmProvenance.originalArticleTitle}&rdquo; by {csmProvenance.author},{' '}
            {csmProvenance.publication}, {csmGuideVersion.originalPublicationDate}.
          </p>
          <a
            href={csmProvenance.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline inline-flex items-center gap-1"
          >
            {csmProvenance.sourceUrl} <ExternalLink className="h-3 w-3" />
          </a>
          <p className="text-xs text-muted-foreground mt-2">
            Quick Reference v{csmGuideVersion.version} &middot; {csmGuideVersion.currentRevisionDate}
          </p>
        </section>
      </div>
    </article>
  )
}
