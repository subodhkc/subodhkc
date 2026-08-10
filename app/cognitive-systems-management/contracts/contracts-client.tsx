'use client'

import { useState, useMemo } from 'react'
import Section from '@/components/Section'
import Hero from '@/components/Hero'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { governanceContracts } from '@/data/csm/v2/contracts'
import { executionFunctions } from '@/data/csm/v2/spec'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

const domainLabels: Record<string, string> = {
  ENT: 'Enterprise',
  PRJ: 'Project',
  CODE: 'Code',
  UX: 'UX',
}

export default function ContractsClient() {
  const [domainFilter, setDomainFilter] = useState<string>('ALL')
  const [efFilter, setEfFilter] = useState<string>('ALL')

  const filtered = useMemo(() => {
    return governanceContracts.filter((c) => {
      if (domainFilter !== 'ALL' && c.domain !== domainFilter) return false
      if (efFilter !== 'ALL' && !c.executionFunctionMappings.includes(efFilter as any)) return false
      return true
    })
  }, [domainFilter, efFilter])

  return (
    <>
      <Hero
        subtitle="CSM 2.0 Reference"
        title={
          <>
            Governance Contracts
            <br />
            <span className="gradient-text">All 16 Components</span>
          </>
        }
        description="Browsable reference for every CSM 2.0 governance contract. Filter by domain or execution function."
      />

      <Section className="pt-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-foreground">Domain:</span>
              <div className="flex flex-wrap gap-1">
                {['ALL', 'ENT', 'PRJ', 'CODE', 'UX'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDomainFilter(d)}
                    className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                      domainFilter === d
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-muted/20 text-muted-foreground hover:bg-muted/40'
                    }`}
                  >
                    {d === 'ALL' ? 'All' : domainLabels[d]}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-foreground">Execution Function:</span>
              <div className="flex flex-wrap gap-1">
                {['ALL', ...executionFunctions.map((ef) => ef.id)].map((ef) => (
                  <button
                    key={ef}
                    onClick={() => setEfFilter(ef)}
                    className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                      efFilter === ef
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-muted/20 text-muted-foreground hover:bg-muted/40'
                    }`}
                  >
                    {ef === 'ALL' ? 'All' : ef.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Showing {filtered.length} of {governanceContracts.length} contracts
          </p>

          {/* Contract Cards */}
          <div className="space-y-4">
            {filtered.map((contract) => (
              <Card key={contract.id}>
                <CardHeader>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-primary">{contract.id}</span>
                    <CardTitle className="text-sm">{contract.name}</CardTitle>
                    <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded">
                      {domainLabels[contract.domain]}
                    </span>
                  </div>
                  <CardDescription className="text-xs">{contract.purpose}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Core Question */}
                  <div>
                    <p className="text-xs font-medium text-foreground mb-0.5">Core Question</p>
                    <p className="text-xs text-muted-foreground italic">{contract.coreQuestion}</p>
                  </div>

                  {/* Key Inputs */}
                  <div>
                    <p className="text-xs font-medium text-foreground mb-1">Key Inputs ({contract.requiredInputs.length})</p>
                    <div className="flex flex-wrap gap-1">
                      {contract.requiredInputs.map((inp) => (
                        <span key={inp.id} className="text-xs font-mono text-muted-foreground bg-muted/30 px-1.5 py-0.5 rounded">
                          {inp.id}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Objective Rules */}
                  <div>
                    <p className="text-xs font-medium text-foreground mb-1">Objective Rules ({contract.objectiveRules.length})</p>
                    <div className="space-y-0.5">
                      {contract.objectiveRules.map((rule) => (
                        <p key={rule.id} className="text-xs text-muted-foreground">
                          <span className="font-mono text-primary/70">{rule.id}</span>: {rule.description}
                          {rule.blocking && <span className="text-red-600 ml-1">[BLOCKING]</span>}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Human Judgment */}
                  {contract.humanJudgmentPoints.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-foreground mb-1">Human Judgment Points ({contract.humanJudgmentPoints.length})</p>
                      <div className="space-y-0.5">
                        {contract.humanJudgmentPoints.map((hjp) => (
                          <p key={hjp.id} className="text-xs text-muted-foreground">
                            <span className="font-mono text-amber-600">{hjp.id}</span>: {hjp.question}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Decisions */}
                  {contract.requiredDecisions.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-foreground mb-1">Required Decisions ({contract.requiredDecisions.length})</p>
                      <div className="space-y-0.5">
                        {contract.requiredDecisions.map((dec) => (
                          <p key={dec.id} className="text-xs text-muted-foreground">
                            <span className="font-mono text-primary/70">{dec.id}</span>: {dec.question}
                            <span className="ml-1 text-muted-foreground/60">({dec.decisionType})</span>
                            {dec.blocking && <span className="text-red-600 ml-1">[BLOCKING]</span>}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Evidence */}
                  <div>
                    <p className="text-xs font-medium text-foreground mb-1">Required Evidence ({contract.requiredEvidence.length})</p>
                    <div className="space-y-0.5">
                      {contract.requiredEvidence.map((ev) => (
                        <p key={ev.id} className="text-xs text-muted-foreground">
                          <span className="font-mono text-primary/70">{ev.id}</span>: {ev.label}
                          {ev.expiresByDefault && <span className="text-muted-foreground/60 ml-1">(expires: {ev.defaultExpiryDays}d)</span>}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Outputs */}
                  <div>
                    <p className="text-xs font-medium text-foreground mb-1">Outputs ({contract.outputs.length})</p>
                    <div className="flex flex-wrap gap-1">
                      {contract.outputs.map((out) => (
                        <span key={out} className="text-xs text-muted-foreground bg-muted/30 px-1.5 py-0.5 rounded">{out}</span>
                      ))}
                    </div>
                  </div>

                  {/* Handoffs */}
                  {contract.handoffTargets.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-foreground mb-1">Handoff Targets</p>
                      <div className="space-y-0.5">
                        {contract.handoffTargets.map((ht, i) => (
                          <p key={i} className="text-xs text-muted-foreground">
                            <span className="font-mono text-primary/70">{ht.targetDomain}</span>
                            {ht.targetComponent && <span className="font-mono text-primary/70">/{ht.targetComponent}</span>}
                            : {ht.requiredOutputs.join(', ')}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reassessment */}
                  <div>
                    <p className="text-xs font-medium text-foreground mb-1">Reassessment Triggers ({contract.reassessmentTriggers.length})</p>
                    <div className="flex flex-wrap gap-1">
                      {contract.reassessmentTriggers.map((rt) => (
                        <span key={rt} className="text-xs font-mono text-muted-foreground bg-muted/30 px-1.5 py-0.5 rounded">{rt}</span>
                      ))}
                    </div>
                  </div>

                  {/* Execution Functions */}
                  <div>
                    <p className="text-xs font-medium text-foreground mb-1">Execution Functions</p>
                    <div className="flex flex-wrap gap-1">
                      {contract.executionFunctionMappings.map((ef) => (
                        <span key={ef} className="text-xs font-mono text-primary bg-primary/5 px-1.5 py-0.5 rounded">{ef}</span>
                      ))}
                    </div>
                  </div>

                  {/* Roles */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs font-medium text-foreground mb-0.5">Responsible</p>
                      <p className="text-xs text-muted-foreground">{contract.responsibleRoles.join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground mb-0.5">Accountable</p>
                      <p className="text-xs text-muted-foreground">{contract.accountableRole}</p>
                    </div>
                  </div>

                  {/* Dependencies */}
                  {contract.dependencies.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-foreground mb-0.5">Dependencies</p>
                      <div className="flex flex-wrap gap-1">
                        {contract.dependencies.map((dep) => (
                          <span key={dep} className="text-xs font-mono text-muted-foreground bg-muted/30 px-1.5 py-0.5 rounded">{dep}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Provenance */}
                  <p className="text-xs text-muted-foreground/60 italic border-t border-border pt-2">{contract.sourceProvenance}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <Link
              href="/cognitive-systems-management/v2"
              className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1"
            >
              Back to CSM 2.0 Specification <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </Section>
    </>
  )
}
