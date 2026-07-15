'use client'

import { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RotateCcw, ArrowRight, CheckCircle2, Shield, AlertTriangle, Zap, Phone, HeartPulse, FileText, Lock } from 'lucide-react'
import Link from 'next/link'

type UseCase = 'answering-faq' | 'lead-capture' | 'appointment-booking' | 'outbound-campaigns' | 'healthcare-intake' | 'emergency-routing'
type CallVolume = 'low' | 'medium' | 'high'
type DataSensitivity = 'public' | 'internal' | 'pii' | 'phi'
type AgentAction = 'inform-only' | 'collect-info' | 'book-appointments' | 'process-payments' | 'issue-refunds' | 'clinical-advice'
type ComplianceNeed = 'none-known' | 'tcpa' | 'hipaa' | 'traiga' | 'multi-jurisdiction' | 'soc2'

interface ChecklistItem {
  name: string
  reason: string
  priority: 'start-here' | 'next' | 'ongoing'
}

const useCaseOptions: { value: UseCase; label: string; desc: string }[] = [
  { value: 'answering-faq', label: 'Answering & FAQ', desc: 'Basic call answering, business hours, service questions' },
  { value: 'lead-capture', label: 'Lead capture', desc: 'Capture contact details and qualify inbound leads' },
  { value: 'appointment-booking', label: 'Appointment booking', desc: 'Schedule, modify, or cancel appointments' },
  { value: 'outbound-campaigns', label: 'Outbound campaigns', desc: 'Marketing, reminders, or follow-up calls' },
  { value: 'healthcare-intake', label: 'Healthcare intake', desc: 'Patient scheduling, health questions, PHI' },
  { value: 'emergency-routing', label: 'Emergency routing', desc: 'Service business with urgent or safety-critical calls' },
]

const volumeOptions: { value: CallVolume; label: string; desc: string }[] = [
  { value: 'low', label: 'Low', desc: 'Fewer than 50 calls per day' },
  { value: 'medium', label: 'Medium', desc: '50–500 calls per day' },
  { value: 'high', label: 'High', desc: 'More than 500 calls per day' },
]

const dataOptions: { value: DataSensitivity; label: string; desc: string }[] = [
  { value: 'public', label: 'Public information', desc: 'Business hours, services, general info only' },
  { value: 'internal', label: 'Internal business data', desc: 'Pricing, schedules, staff info, internal policies' },
  { value: 'pii', label: 'Customer PII', desc: 'Names, phone numbers, addresses, account details' },
  { value: 'phi', label: 'Health information (PHI)', desc: 'Protected health information, medical details' },
]

const actionOptions: { value: AgentAction; label: string; desc: string }[] = [
  { value: 'inform-only', label: 'Inform only', desc: 'Answer questions, no data changes' },
  { value: 'collect-info', label: 'Collect info', desc: 'Capture messages, contact details, callback requests' },
  { value: 'book-appointments', label: 'Book appointments', desc: 'Create, modify, or cancel calendar entries' },
  { value: 'process-payments', label: 'Process payments', desc: 'Charge cards, process transactions' },
  { value: 'issue-refunds', label: 'Issue refunds', desc: 'Reverse charges, modify financial records' },
  { value: 'clinical-advice', label: 'Clinical/medical advice', desc: 'Provide health-related guidance or triage' },
]

const complianceOptions: { value: ComplianceNeed; label: string; desc: string }[] = [
  { value: 'none-known', label: 'None known', desc: 'No specific regulatory requirements identified yet' },
  { value: 'tcpa', label: 'TCPA / telemarketing', desc: 'Outbound calls, consent, do-not-call compliance' },
  { value: 'hipaa', label: 'HIPAA / healthcare', desc: 'Protected health information safeguards' },
  { value: 'traiga', label: 'Texas TRAIGA', desc: 'Texas AI law disclosure and documentation' },
  { value: 'multi-jurisdiction', label: 'Multi-jurisdiction', desc: 'Operating across multiple states or countries' },
  { value: 'soc2', label: 'Customer SOC 2 requirement', desc: 'Enterprise customers require SOC 2 evidence' },
]

export function VoiceAgentReadinessChecker() {
  const [useCase, setUseCase] = useState<UseCase | null>(null)
  const [volume, setVolume] = useState<CallVolume | null>(null)
  const [dataSensitivity, setDataSensitivity] = useState<DataSensitivity | null>(null)
  const [agentAction, setAgentAction] = useState<AgentAction | null>(null)
  const [compliance, setCompliance] = useState<ComplianceNeed | null>(null)
  const [showResults, setShowResults] = useState(false)

  const result = useMemo(() => {
    const isHealthcare = useCase === 'healthcare-intake' || dataSensitivity === 'phi' || compliance === 'hipaa'
    const isHighRisk = agentAction === 'process-payments' || agentAction === 'issue-refunds' || agentAction === 'clinical-advice' || useCase === 'emergency-routing'
    const isOutbound = useCase === 'outbound-campaigns' || compliance === 'tcpa'
    const hasWriteActions = agentAction === 'book-appointments' || agentAction === 'process-payments' || agentAction === 'issue-refunds'
    const isHighVolume = volume === 'high'
    const isMultiJurisdiction = compliance === 'multi-jurisdiction'

    let deploymentPath = 'Self-Service'
    let pathReason = 'A straightforward use case that can be configured through the dashboard without custom code.'
    if (hasWriteActions || isHighVolume || isHealthcare || isMultiJurisdiction || compliance === 'soc2') {
      deploymentPath = 'API-Assisted'
      pathReason = 'Integrations, tenant isolation, or compliance evidence require API-level configuration.'
    }
    if (isHighRisk || isHealthcare || (isOutbound && isHighVolume)) {
      deploymentPath = 'Managed Custom'
      pathReason = 'Consequential actions, regulated data, or complex workflows require custom orchestration and managed deployment.'
    }

    let riskLevel = 'Low'
    let riskColor = 'text-green-600'
    let riskBg = 'bg-green-500/10 border-green-500/30'
    if (hasWriteActions || dataSensitivity === 'pii' || isOutbound) {
      riskLevel = 'Moderate'
      riskColor = 'text-amber-600'
      riskBg = 'bg-amber-500/10 border-amber-500/30'
    }
    if (isHighRisk || isHealthcare || isHighVolume) {
      riskLevel = 'High'
      riskColor = 'text-orange-600'
      riskBg = 'bg-orange-500/10 border-orange-500/30'
    }
    if ((isHighRisk && isHealthcare) || (isHighRisk && isHighVolume)) {
      riskLevel = 'Critical'
      riskColor = 'text-red-600'
      riskBg = 'bg-red-500/10 border-red-500/30'
    }

    const checklist: ChecklistItem[] = []

    checklist.push({
      name: 'Define the voice call contract',
      reason: 'Document greeting, intent, required fields, tools, confirmations, transfer points, and failure paths for each supported intent.',
      priority: 'start-here',
    })

    if (hasWriteActions) {
      checklist.push({
        name: 'Implement tool-result verification',
        reason: 'The agent must confirm an action succeeded only after the authoritative system returns success — never because it attempted the action.',
        priority: 'start-here',
      })
    }

    if (dataSensitivity === 'pii' || dataSensitivity === 'phi') {
      checklist.push({
        name: 'Enforce read-back validation for identifiers',
        reason: 'Phone numbers, addresses, and account details must be read back digit by digit before use to prevent transcription-driven failures.',
        priority: 'start-here',
      })
    }

    if (useCase === 'emergency-routing') {
      checklist.push({
        name: 'Configure deterministic emergency interrupts',
        reason: 'Emergency phrases (gas leak, medical distress, fire) must trigger immediate deterministic handling — not conversational model judgment.',
        priority: 'start-here',
      })
    }

    checklist.push({
      name: 'Set up deterministic fast paths',
      reason: 'Hours, service areas, routine FAQs, and opt-outs should bypass the model entirely for consistency and cost control.',
      priority: 'next',
    })

    if (dataSensitivity === 'internal' || dataSensitivity === 'pii' || dataSensitivity === 'phi') {
      checklist.push({
        name: 'Establish RAG source lifecycle',
        reason: 'Track source, tenant, owner, effective date, content hash, refresh status, and version for all knowledge documents.',
        priority: 'next',
      })
    }

    if (isOutbound) {
      checklist.push({
        name: 'Review TCPA consent and identification rules',
        reason: 'Outbound AI voice calls fall under TCPA artificial-voice provisions. Consent, identification, opt-out, and do-not-call compliance are required.',
        priority: 'next',
      })
    }

    if (compliance === 'traiga' || isMultiJurisdiction) {
      checklist.push({
        name: 'Map TRAIGA and multi-jurisdiction obligations',
        reason: 'Document purpose, data, outputs, performance, limitations, monitoring, and safeguards — the evidence TRAIGA may request during an investigation.',
        priority: 'next',
      })
    }

    if (isHealthcare) {
      checklist.push({
        name: 'Implement healthcare disclosure and PHI safeguards',
        reason: 'TRAIGA requires disclosure when AI is used in relation to healthcare services. HIPAA safeguards, retention rules, and professional review apply.',
        priority: 'next',
      })
    }

    checklist.push({
      name: 'Configure degraded mode and fallback',
      reason: 'When the realtime AI path fails, the call should degrade to Gather, IVR, or human transfer — not disconnect.',
      priority: 'ongoing',
    })

    checklist.push({
      name: 'Set up outcome-based metrics',
      reason: 'Track cost per verified completed outcome (appointment, lead, transfer) — not just calls answered or minutes handled.',
      priority: 'ongoing',
    })

    if (isHighVolume || isHighRisk) {
      checklist.push({
        name: 'Enable fraud controls and cost guardrails',
        reason: 'Credit checks, per-call budget limits, call-duration rules, country-level controls, and telephony cost tracking prevent denial-of-wallet and toll fraud.',
        priority: 'ongoing',
      })
    }

    checklist.push({
      name: 'Establish a human correction loop',
      reason: 'Review recordings (not only transcripts), identify failures, correct FAQs or rules, test, and redeploy. The dashboard is part of governance.',
      priority: 'ongoing',
    })

    return { deploymentPath, pathReason, riskLevel, riskColor, riskBg, checklist }
  }, [useCase, volume, dataSensitivity, agentAction, compliance])

  const allAnswered = useCase && volume && dataSensitivity && agentAction && compliance

  const reset = () => {
    setUseCase(null)
    setVolume(null)
    setDataSensitivity(null)
    setAgentAction(null)
    setCompliance(null)
    setShowResults(false)
  }

  const renderOptions = <T extends string>(
    options: { value: T; label: string; desc: string }[],
    value: T | null,
    setter: (v: T) => void
  ) => (
    <div className="grid sm:grid-cols-2 gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setter(opt.value)}
          className={`rounded-lg border p-3 text-left transition-all ${
            value === opt.value
              ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
              : 'border-border bg-muted/20 hover:border-primary/30'
          }`}
        >
          <p className="text-sm font-medium text-foreground">{opt.label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
        </button>
      ))}
    </div>
  )

  return (
    <Card className="border-l-4 border-l-primary/40">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Phone className="h-5 w-5 text-primary" />
          AI Voice Agent Readiness Checker
        </CardTitle>
        <CardDescription className="text-sm mt-1">
          Answer five questions about your planned AI voice deployment. Get a deployment path recommendation, risk level, and prioritized control checklist.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {!showResults && (
          <>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">1. What is the primary use case?</p>
              {renderOptions(useCaseOptions, useCase, setUseCase)}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">2. What is the expected call volume?</p>
              {renderOptions(volumeOptions, volume, setVolume)}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">3. What data will the agent access?</p>
              {renderOptions(dataOptions, dataSensitivity, setDataSensitivity)}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">4. What actions will the agent perform?</p>
              {renderOptions(actionOptions, agentAction, setAgentAction)}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">5. What compliance needs apply?</p>
              {renderOptions(complianceOptions, compliance, setCompliance)}
            </div>

            {allAnswered && (
              <Button
                className="w-full"
                size="lg"
                onClick={() => setShowResults(true)}
              >
                Get recommendations <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </>
        )}

        {showResults && allAnswered && (
          <>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="rounded-lg border border-border bg-muted/20 p-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Deployment Path</p>
                <p className="text-lg font-bold text-foreground">{result.deploymentPath}</p>
                <p className="text-xs text-muted-foreground mt-1">{result.pathReason}</p>
              </div>
              <div className={`rounded-lg border p-4 ${result.riskBg}`}>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Risk Level</p>
                <p className={`text-lg font-bold ${result.riskColor}`}>{result.riskLevel}</p>
                <p className="text-xs text-muted-foreground mt-1">Based on use case, data, actions, and compliance needs.</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Prioritized control checklist:</p>
              {[...result.checklist].sort((a, b) => {
                const order = { 'start-here': 0, 'next': 1, 'ongoing': 2 }
                return order[a.priority] - order[b.priority]
              }).map((item) => {
                const priorityLabel = item.priority === 'start-here' ? 'Start here' : item.priority === 'next' ? 'Next' : 'Ongoing'
                const priorityColor = item.priority === 'start-here' ? 'text-blue-600 dark:text-blue-400' : item.priority === 'next' ? 'text-primary' : 'text-muted-foreground'
                return (
                  <div key={item.name} className="rounded-lg border border-border bg-muted/20 p-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <p className="text-sm font-semibold text-foreground">{item.name}</p>
                      <span className={`text-xs font-medium ${priorityColor}`}>· {priorityLabel}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 ml-6">{item.reason}</p>
                  </div>
                )
              })}
            </div>

            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-2">
              <p className="text-sm font-medium text-foreground">Recommended next steps:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-3 w-3 mt-1 text-primary flex-shrink-0" />
                  <span>Read the full{' '}
                    <Link href="/does-texas-ai-law-apply-to-my-business" className="text-primary font-medium hover:underline">TRAIGA guide</Link>{' '}
                    if Texas AI law applies to your deployment</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-3 w-3 mt-1 text-primary flex-shrink-0" />
                  <span>Review the{' '}
                    <Link href="/how-to-secure-and-govern-ai" className="text-primary font-medium hover:underline">AI security and governance framework</Link>{' '}
                    for NIST, ISO, and SOC 2 alignment</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-3 w-3 mt-1 text-primary flex-shrink-0" />
                  <span>Use the{' '}
                    <Link href="/ai-security-tools" className="text-primary font-medium hover:underline">AI security tools</Link>{' '}
                    for blast radius and prompt-injection analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-3 w-3 mt-1 text-primary flex-shrink-0" />
                  <span>Explore{' '}
                    <Link href="/solutions/kestrelvoice" className="text-primary font-medium hover:underline">Kestrel Voice</Link>{' '}
                    for deployment or{' '}
                    <Link href="/solutions/haiec" className="text-primary font-medium hover:underline">HAIEC</Link>{' '}
                    for compliance assessment</span>
                </li>
              </ul>
            </div>

            <button
              onClick={reset}
              className="w-full rounded-lg border border-border py-2 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="h-4 w-4" /> Start over
            </button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
