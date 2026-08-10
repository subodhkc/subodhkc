'use client'

import { useState } from 'react'
import Section from '@/components/Section'
import Hero from '@/components/Hero'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { AlertTriangle, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, FileText } from 'lucide-react'
import Link from 'next/link'
import { evaluateCsmV2 } from '@/data/csm/v2/evaluator'
import { CSM_SPEC_VERSION } from '@/data/csm/v2/spec'
import type { AssessmentInput, AssessmentOutput } from '@/data/csm/v2/spec'

interface FormData {
  systemId: string
  intendedPurpose: string
  businessOwner: string
  technicalOwner: string
  governanceDepth: 'BASELINE' | 'ENHANCED' | 'INTENSIVE'
  aiPolicyDocumented: boolean
  riskAssessmentCompleted: boolean
  securityScanningActive: boolean
  impactAnalysisCompleted: boolean
  explainabilityDesigned: boolean
  hasDataSources: boolean
  hasModels: boolean
  hasTools: boolean
  hasAgents: boolean
}

const initialState: FormData = {
  systemId: '',
  intendedPurpose: '',
  businessOwner: '',
  technicalOwner: '',
  governanceDepth: 'BASELINE',
  aiPolicyDocumented: false,
  riskAssessmentCompleted: false,
  securityScanningActive: false,
  impactAnalysisCompleted: false,
  explainabilityDesigned: false,
  hasDataSources: false,
  hasModels: false,
  hasTools: false,
  hasAgents: false,
}

function buildAssessmentInput(form: FormData): AssessmentInput {
  const assessmentAsOf = new Date().toISOString().split('T')[0]
  const evidence: AssessmentInput['evidence'] = []
  const decisions: AssessmentInput['decisions'] = []

  if (form.aiPolicyDocumented) {
    evidence.push({
      evidenceId: 'ev-policy',
      type: 'document' as const,
      title: 'AI Policy',
      source: 'governance-team',
      owner: form.businessOwner || 'Unknown',
      createdAt: assessmentAsOf,
      effectiveAt: assessmentAsOf,
      relatedRequirementIds: ['ENT-POLICY-E1'],
      status: 'active' as const,
    })
  }
  if (form.riskAssessmentCompleted) {
    evidence.push({
      evidenceId: 'ev-risk',
      type: 'risk-assessment' as const,
      title: 'Risk assessment',
      source: 'risk-team',
      owner: form.businessOwner || 'Unknown',
      createdAt: assessmentAsOf,
      effectiveAt: assessmentAsOf,
      expiresAt: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
      relatedRequirementIds: ['ENT-RISK-E1'],
      status: 'active' as const,
    })
  }
  if (form.securityScanningActive) {
    evidence.push({
      evidenceId: 'ev-security',
      type: 'security-scan' as const,
      title: 'Security scan results',
      source: 'ci-cd',
      owner: form.technicalOwner || 'Unknown',
      createdAt: assessmentAsOf,
      effectiveAt: assessmentAsOf,
      expiresAt: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      relatedRequirementIds: ['CODE-SECURITY-E1'],
      status: 'active' as const,
    })
  }
  if (form.impactAnalysisCompleted) {
    evidence.push({
      evidenceId: 'ev-impact',
      type: 'impact-analysis' as const,
      title: 'Impact analysis',
      source: 'ux-team',
      owner: form.businessOwner || 'Unknown',
      createdAt: assessmentAsOf,
      effectiveAt: assessmentAsOf,
      expiresAt: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
      relatedRequirementIds: ['UX-IMPACT-E1'],
      status: 'active' as const,
    })
  }
  if (form.explainabilityDesigned) {
    evidence.push({
      evidenceId: 'ev-explain',
      type: 'explainability-design' as const,
      title: 'Explainability design',
      source: 'ux-team',
      owner: form.businessOwner || 'Unknown',
      createdAt: assessmentAsOf,
      effectiveAt: assessmentAsOf,
      relatedRequirementIds: ['UX-EXPLAIN-E1'],
      status: 'active' as const,
    })
  }

  return {
    systemId: form.systemId || 'assessment-system',
    systemVersion: '1.0.0',
    assessmentAsOf,
    intendedPurpose: form.intendedPurpose || 'Not specified',
    businessOwner: form.businessOwner || 'Unknown',
    technicalOwner: form.technicalOwner || 'Unknown',
    affectedStakeholders: ['users'],
    deploymentContext: 'unspecified',
    models: form.hasModels ? [{ id: 'm1', name: 'model', version: '1.0', provider: 'provider', type: 'llm' as const }] : [],
    providers: [],
    dataSources: form.hasDataSources ? [{ id: 'd1', name: 'data', type: 'database' as const, sensitivity: 'internal' as const }] : [],
    tools: form.hasTools ? [{ id: 't1', name: 'tool', authority: 'read-only' as const }] : [],
    agents: form.hasAgents ? [{ id: 'a1', name: 'agent', tools: [], autonomyLevel: 'supervised' as const }] : [],
    integrations: [],
    autonomyCharacteristics: { canActWithoutHumanApproval: false, actionScope: 'unspecified' },
    reversibilityCharacteristics: { actionsReversible: true, reversalComplexity: 'trivial' as const },
    dataSensitivityContext: { processesPersonalData: false, processesSensitiveData: false, dataCategories: [] },
    externalImpactContext: { affectsExternalCustomers: false, affectsIndividualsRights: false, affectedPopulationSize: 'small' as const },
    organizationPolicyProfile: {
      profileName: form.governanceDepth.toLowerCase(),
      governanceDepth: form.governanceDepth,
      activatedFactors: [],
    },
    evidence,
    decisions,
    exceptions: [],
  }
}

function ExplainRow({ label, value, reason }: { label: string; value: string; reason: string }) {
  return (
    <div className="p-2.5 rounded-lg border border-border bg-muted/20">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-foreground">{label}</span>
        <span className="text-xs font-mono text-primary">{value}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">{reason}</p>
    </div>
  )
}

export default function AssessmentClient() {
  const [form, setForm] = useState<FormData>(initialState)
  const [result, setResult] = useState<AssessmentOutput | null>(null)

  const handleEvaluate = () => {
    const input = buildAssessmentInput(form)
    const output = evaluateCsmV2(
      input,
      [],
      [],
      [],
      { profileName: form.governanceDepth.toLowerCase(), governanceDepth: form.governanceDepth },
      input.assessmentAsOf,
      CSM_SPEC_VERSION,
    )
    setResult(output)
  }

  const handleReset = () => {
    setForm(initialState)
    setResult(null)
  }

  return (
    <>
      <Hero
        subtitle="CSM 2.0 Reference Evaluator"
        title={
          <>
            Reference Assessment
            <br />
            <span className="gradient-text">Try the Evaluator</span>
          </>
        }
        description="Provide structured system facts and receive applicable CSM requirements, evidence gaps, human review items and blockers."
      />

      <Section className="pt-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Disclaimer */}
          <div className="border-l-4 border-amber-500/40 pl-4 py-3 bg-amber-500/5 rounded-r-lg">
            <p className="text-sm text-foreground">
              <strong>The assessment evaluates the CSM 2.0 governance specification.</strong> It does not determine legal compliance or replace qualified review.
            </p>
          </div>

          {!result && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">System Information</CardTitle>
                <CardDescription className="text-xs">Provide basic facts about the AI system being assessed. No personal data is required. No account is needed.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-foreground">System Name / ID</label>
                    <input
                      type="text"
                      value={form.systemId}
                      onChange={(e) => setForm({ ...form, systemId: e.target.value })}
                      placeholder="e.g. customer-support-bot"
                      className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground">Intended Purpose</label>
                    <input
                      type="text"
                      value={form.intendedPurpose}
                      onChange={(e) => setForm({ ...form, intendedPurpose: e.target.value })}
                      placeholder="e.g. Customer support chatbot"
                      className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground">Business Owner</label>
                    <input
                      type="text"
                      value={form.businessOwner}
                      onChange={(e) => setForm({ ...form, businessOwner: e.target.value })}
                      placeholder="e.g. Jane Doe"
                      className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground">Technical Owner</label>
                    <input
                      type="text"
                      value={form.technicalOwner}
                      onChange={(e) => setForm({ ...form, technicalOwner: e.target.value })}
                      placeholder="e.g. John Smith"
                      className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground">Governance Depth Profile</label>
                  <div className="flex gap-2 mt-1">
                    {(['BASELINE', 'ENHANCED', 'INTENSIVE'] as const).map((depth) => (
                      <button
                        key={depth}
                        onClick={() => setForm({ ...form, governanceDepth: depth })}
                        className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                          form.governanceDepth === depth
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border bg-muted/20 text-muted-foreground hover:bg-muted/40'
                        }`}
                      >
                        {depth}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-foreground mb-2">Evidence Available</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[
                      { key: 'aiPolicyDocumented', label: 'AI policy documented' },
                      { key: 'riskAssessmentCompleted', label: 'Risk assessment completed' },
                      { key: 'securityScanningActive', label: 'Security scanning active' },
                      { key: 'impactAnalysisCompleted', label: 'Impact analysis completed' },
                      { key: 'explainabilityDesigned', label: 'Explainability designed' },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center gap-2 p-2 rounded-lg border border-border bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors">
                        <input
                          type="checkbox"
                          checked={form[item.key as keyof FormData] as boolean}
                          onChange={(e) => setForm({ ...form, [item.key]: e.target.checked })}
                          className="h-4 w-4 rounded border-border"
                        />
                        <span className="text-xs text-muted-foreground">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-foreground mb-2">System Characteristics</p>
                  <div className="grid gap-2 sm:grid-cols-4">
                    {[
                      { key: 'hasModels', label: 'Has AI models' },
                      { key: 'hasDataSources', label: 'Has data sources' },
                      { key: 'hasTools', label: 'Has tools' },
                      { key: 'hasAgents', label: 'Has agents' },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center gap-2 p-2 rounded-lg border border-border bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors">
                        <input
                          type="checkbox"
                          checked={form[item.key as keyof FormData] as boolean}
                          onChange={(e) => setForm({ ...form, [item.key]: e.target.checked })}
                          className="h-4 w-4 rounded border-border"
                        />
                        <span className="text-xs text-muted-foreground">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleEvaluate}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Evaluate <ArrowRight className="h-4 w-4" />
                </button>
              </CardContent>
            </Card>
          )}

          {result && (
            <div className="space-y-6">
              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Assessment Summary</CardTitle>
                  <CardDescription className="text-xs">
                    Spec v{result.specVersion} · Assessed {result.assessmentAsOf} · Profile: {result.governanceProfile}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-4">
                    <div className="text-center p-3 rounded-lg border border-border bg-muted/20">
                      <p className="text-2xl font-bold text-primary">{result.summary.satisfied}</p>
                      <p className="text-xs text-muted-foreground">Satisfied</p>
                    </div>
                    <div className="text-center p-3 rounded-lg border border-border bg-muted/20">
                      <p className="text-2xl font-bold text-amber-600">{result.summary.partial}</p>
                      <p className="text-xs text-muted-foreground">Partial</p>
                    </div>
                    <div className="text-center p-3 rounded-lg border border-border bg-muted/20">
                      <p className="text-2xl font-bold text-red-600">{result.summary.blockers}</p>
                      <p className="text-xs text-muted-foreground">Blockers</p>
                    </div>
                    <div className="text-center p-3 rounded-lg border border-border bg-muted/20">
                      <p className="text-2xl font-bold text-blue-600">{result.summary.humanReviewRequired}</p>
                      <p className="text-xs text-muted-foreground">Human Review</p>
                    </div>
                  </div>
                  <div className="mt-3 p-3 rounded-lg border border-border bg-muted/20">
                    <p className="text-xs font-medium text-foreground">System State: <span className="font-mono text-primary">{result.summary.systemState}</span></p>
                    <p className="text-xs text-muted-foreground mt-1">Evidence coverage: {result.summary.evidenceCoverage}%</p>
                  </div>
                </CardContent>
              </Card>

              {/* Blockers */}
              {result.blockers.length > 0 && (
                <Card className="border-l-4 border-l-red-500/40">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <CardTitle className="text-sm">Blockers ({result.blockers.length})</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {result.blockers.map((b) => (
                      <ExplainRow
                        key={b.componentId + b.ruleId}
                        label={`${b.componentId} · ${b.ruleId}`}
                        value="BLOCKED"
                        reason={`Why this status: ${b.description}. Remediation: ${b.remediation}`}
                      />
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Human Reviews */}
              {result.humanReviewsRequired.length > 0 && (
                <Card className="border-l-4 border-l-amber-500/40">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <CardTitle className="text-sm">Human Review Required ({result.humanReviewsRequired.length})</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {result.humanReviewsRequired.map((hr) => (
                      <ExplainRow
                        key={hr.componentId + hr.judgmentId}
                        label={`${hr.componentId} · ${hr.judgmentId}`}
                        value="HUMAN_REVIEW_REQUIRED"
                        reason={`Why this status: ${hr.question}. This decision requires a qualified human reviewer with documented rationale and evidence.`}
                      />
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Evidence Gaps */}
              {result.evidenceGaps.length > 0 && (
                <Card className="border-l-4 border-l-blue-500/40">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <CardTitle className="text-sm">Evidence Gaps ({result.evidenceGaps.length})</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {result.evidenceGaps.map((eg) => (
                      <ExplainRow
                        key={eg.componentId + eg.evidenceRequirementId}
                        label={`${eg.componentId} · ${eg.evidenceRequirementId}`}
                        value="MISSING"
                        reason={`Why this status: ${eg.description}. Provide this evidence to satisfy the requirement.`}
                      />
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Component Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Component Results (16)</CardTitle>
                  <CardDescription className="text-xs">Every component with its current state and explanation.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-1.5">
                  {result.componentResults.map((cr) => (
                    <div key={cr.componentId} className="flex items-center justify-between p-2 rounded-lg border border-border bg-muted/20">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-primary">{cr.componentId}</span>
                        {cr.state === 'SATISFIED' && <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />}
                        {cr.state === 'BLOCKED' && <AlertCircle className="h-3.5 w-3.5 text-red-600" />}
                        {cr.state === 'HUMAN_REVIEW_REQUIRED' && <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />}
                        {cr.state === 'NOT_ASSESSED' && <span className="h-3.5 w-3.5 rounded-full border border-muted-foreground/30" />}
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">{cr.state}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Domain Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Domain States</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {result.domainResults.map((dr) => (
                      <div key={dr.domainId} className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-muted/20">
                        <span className="text-xs font-mono text-primary">{dr.domainId}</span>
                        <span className="text-xs font-mono text-muted-foreground">{dr.state}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted/50 transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> New Assessment
                </button>
                <Link
                  href="/cognitive-systems-management/v2"
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted/50 transition-colors"
                >
                  View Specification <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </Section>
    </>
  )
}
