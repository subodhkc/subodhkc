'use client'

import { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RotateCcw, ArrowRight, CheckCircle2, Award, FileText, Shield, ClipboardCheck, Layers } from 'lucide-react'
import Link from 'next/link'

type BusinessType = 'small-business' | 'internal-enterprise' | 'saas-provider' | 'healthcare' | 'financial' | 'hr-hiring'
type DataSensitivity = 'public' | 'internal' | 'confidential' | 'phi' | 'biometric'
type CustomerDemand = 'none' | 'security-questionnaire' | 'soc2-required' | 'iso-required' | 'multi-jurisdiction'
type AIUseCase = 'chatbot' | 'rag-assistant' | 'agent-actions' | 'hiring-screening' | 'clinical-decision' | 'lending-credit'

interface Recommendation {
  name: string
  required: boolean
  reason: string
  icon: typeof Award
}

export function AIFrameworkDecisionTool() {
  const [businessType, setBusinessType] = useState<BusinessType | null>(null)
  const [dataSensitivity, setDataSensitivity] = useState<DataSensitivity | null>(null)
  const [customerDemand, setCustomerDemand] = useState<CustomerDemand | null>(null)
  const [aiUseCase, setAIUseCase] = useState<AIUseCase | null>(null)
  const [showResults, setShowResults] = useState(false)

  const recommendations = useMemo<Recommendation[]>(() => {
    const recs: Recommendation[] = []
    const isHighRisk = aiUseCase === 'clinical-decision' || aiUseCase === 'hiring-screening' || aiUseCase === 'lending-credit'
    const isSaaS = businessType === 'saas-provider'
    const isHealthcare = businessType === 'healthcare' || dataSensitivity === 'phi'
    const hasSensitiveData = dataSensitivity === 'confidential' || dataSensitivity === 'phi' || dataSensitivity === 'biometric'
    const hasAgentActions = aiUseCase === 'agent-actions'

    // NIST AI RMF — recommended for everyone, required for higher risk
    recs.push({
      name: 'NIST AI RMF',
      required: isHighRisk || hasSensitiveData || isSaaS,
      reason: isHighRisk
        ? 'Essential for organizing AI risk management for consequential-decision systems.'
        : hasSensitiveData
        ? 'Recommended for systems handling sensitive data to structure risk governance.'
        : 'Good starting point for any AI system to establish governance and risk management.',
      icon: Layers,
    })

    // ISO/IEC 42001
    const isoNeeded = isSaaS || customerDemand === 'iso-required' || customerDemand === 'multi-jurisdiction' || isHighRisk
    recs.push({
      name: 'ISO/IEC 42001',
      required: isoNeeded,
      reason: isoNeeded
        ? 'Formal AI management-system certification provides assurance for customers and regulators.'
        : 'Consider if customers request formal AI management certification or if operating across multiple jurisdictions.',
      icon: Award,
    })

    // SOC 2
    const soc2Needed = isSaaS || customerDemand === 'soc2-required' || customerDemand === 'security-questionnaire'
    recs.push({
      name: 'SOC 2',
      required: soc2Needed,
      reason: soc2Needed
        ? 'Enterprise customers typically require SOC 2 for service organizations processing their data.'
        : 'Not typically needed for internal-only AI tools unless customer-facing.',
      icon: ClipboardCheck,
    })

    // ISO/IEC 27001
    const iso27001Needed = hasSensitiveData || isSaaS || isHealthcare
    recs.push({
      name: 'ISO/IEC 27001',
      required: iso27001Needed,
      reason: iso27001Needed
        ? 'Information-security management system is foundational when handling sensitive or regulated data.'
        : 'Recommended baseline for any organization, but especially when handling sensitive data.',
      icon: Shield,
    })

    // OWASP GenAI + MITRE ATLAS testing
    const testingNeeded = hasAgentActions || aiUseCase === 'rag-assistant' || isHighRisk || hasSensitiveData
    recs.push({
      name: 'OWASP GenAI + MITRE ATLAS Testing',
      required: testingNeeded,
      reason: testingNeeded
        ? hasAgentActions
          ? 'Critical for agent systems — test prompt injection, tool abuse, excessive agency, and RAG poisoning.'
          : 'Important for testing AI-specific vulnerabilities like prompt injection and retrieval poisoning.'
        : 'Recommended for any AI application to validate against AI-specific attack vectors.',
      icon: FileText,
    })

    // Legal/sector-specific
    const legalNeeded = isHealthcare || aiUseCase === 'hiring-screening' || aiUseCase === 'lending-credit' || customerDemand === 'multi-jurisdiction'
    const legalLabel = isHealthcare
      ? 'Healthcare AI laws (HIPAA, TRAIGA healthcare disclosure, state medical AI)'
      : aiUseCase === 'hiring-screening'
      ? 'Employment AI laws (NYC LL 144, state bias-audit requirements, EEOC)'
      : aiUseCase === 'lending-credit'
      ? 'Financial AI laws (ECOA, FCRA, fair lending, CFPB guidance)'
      : customerDemand === 'multi-jurisdiction'
      ? 'Multi-jurisdiction AI laws (EU AI Act, TRAIGA, state laws)'
      : 'Applicable AI and sector laws'
    recs.push({
      name: legalLabel,
      required: legalNeeded,
      reason: legalNeeded
        ? 'Sector-specific legal requirements apply based on use case, data, and jurisdiction.'
        : 'Conduct a basic legal applicability review for your jurisdiction and use case.',
      icon: FileText,
    })

    return recs
  }, [businessType, dataSensitivity, customerDemand, aiUseCase])

  const allAnswered = businessType && dataSensitivity && customerDemand && aiUseCase

  const reset = () => {
    setBusinessType(null)
    setDataSensitivity(null)
    setCustomerDemand(null)
    setAIUseCase(null)
    setShowResults(false)
  }

  const businessTypes: { value: BusinessType; label: string; desc: string }[] = [
    { value: 'small-business', label: 'Small business', desc: 'Local or regional business using AI tools' },
    { value: 'internal-enterprise', label: 'Enterprise (internal AI)', desc: 'Large org with internal-only AI tools' },
    { value: 'saas-provider', label: 'AI SaaS provider', desc: 'Selling AI services to enterprise customers' },
    { value: 'healthcare', label: 'Healthcare organization', desc: 'Medical practice or health-tech company' },
    { value: 'financial', label: 'Financial services', desc: 'Banking, lending, insurance, or fintech' },
    { value: 'hr-hiring', label: 'HR / hiring tech', desc: 'Using AI for resume screening or hiring decisions' },
  ]

  const dataTypes: { value: DataSensitivity; label: string; desc: string }[] = [
    { value: 'public', label: 'Public information', desc: 'No sensitive data involved' },
    { value: 'internal', label: 'Internal business data', desc: 'Proprietary or operational data' },
    { value: 'confidential', label: 'Confidential / financial', desc: 'Customer financial data, trade secrets' },
    { value: 'phi', label: 'Protected health information', desc: 'PHI, medical records, patient data' },
    { value: 'biometric', label: 'Biometric identifiers', desc: 'Face, voice, fingerprint data' },
  ]

  const customerDemands: { value: CustomerDemand; label: string; desc: string }[] = [
    { value: 'none', label: 'No customer demands', desc: 'Internal use, no external assurance needed' },
    { value: 'security-questionnaire', label: 'Security questionnaires', desc: 'Customers ask about security practices' },
    { value: 'soc2-required', label: 'SOC 2 required', desc: 'Enterprise customers explicitly require SOC 2' },
    { value: 'iso-required', label: 'ISO certification required', desc: 'Customers or regulators require ISO certification' },
    { value: 'multi-jurisdiction', label: 'Multi-jurisdiction', desc: 'Operating across EU, US states, and other regions' },
  ]

  const aiUseCases: { value: AIUseCase; label: string; desc: string }[] = [
    { value: 'chatbot', label: 'Chatbot / assistant', desc: 'Read-only Q&A or content generation' },
    { value: 'rag-assistant', label: 'RAG assistant', desc: 'Retrieves from document corpus to answer questions' },
    { value: 'agent-actions', label: 'AI agent with actions', desc: 'AI can create, modify, send, or delete data' },
    { value: 'hiring-screening', label: 'Hiring / resume screening', desc: 'AI influences employment decisions' },
    { value: 'clinical-decision', label: 'Clinical decision support', desc: 'AI assists with medical diagnosis or treatment' },
    { value: 'lending-credit', label: 'Lending / credit decisions', desc: 'AI influences credit, insurance, or financial decisions' },
  ]

  const optionButton = <T extends string>(current: T | null, value: T, label: string, desc: string, setter: (v: T) => void) => (
    <button
      onClick={() => setter(value)}
      className={`text-left rounded-lg border p-3 transition-colors ${current === value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}
    >
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
    </button>
  )

  return (
    <Card className="border-l-4 border-l-primary/40">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          Which AI Framework Do I Need?
        </CardTitle>
        <CardDescription className="text-sm mt-1">
          Answer four questions to get a tailored recommendation of which AI governance frameworks, certifications, and testing apply to your situation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {!showResults && (
          <>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">1. What best describes your organization?</label>
              <div className="grid gap-2 sm:grid-cols-2">
                {businessTypes.map((bt) => optionButton(businessType, bt.value, bt.label, bt.desc, setBusinessType))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">2. What kind of data does your AI system access?</label>
              <div className="grid gap-2 sm:grid-cols-2">
                {dataTypes.map((dt) => optionButton(dataSensitivity, dt.value, dt.label, dt.desc, setDataSensitivity))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">3. What do your customers or partners require?</label>
              <div className="grid gap-2">
                {customerDemands.map((cd) => optionButton(customerDemand, cd.value, cd.label, cd.desc, setCustomerDemand))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">4. What does your AI system do?</label>
              <div className="grid gap-2 sm:grid-cols-2">
                {aiUseCases.map((uc) => optionButton(aiUseCase, uc.value, uc.label, uc.desc, setAIUseCase))}
              </div>
            </div>

            <Button
              className="w-full"
              disabled={!allAnswered}
              onClick={() => setShowResults(true)}
            >
              Get recommendations <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </>
        )}

        {showResults && allAnswered && (
          <>
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Based on your answers, here are the frameworks and controls you should consider:</p>
              {recommendations.map((rec) => {
                const Icon = rec.icon
                return (
                  <div key={rec.name} className={`rounded-lg border p-4 ${rec.required ? 'border-primary/30 bg-primary/5' : 'border-border bg-muted/20'}`}>
                    <div className="flex items-start gap-3">
                      <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${rec.required ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">{rec.name}</p>
                          {rec.required ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-primary"><CheckCircle2 className="h-3 w-3" /> Recommended</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground"><ArrowRight className="h-3 w-3" /> Optional</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{rec.reason}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm text-foreground/90">
                <strong>Next steps:</strong> Start with an <Link href="/ai-security-tools" className="text-primary font-medium hover:underline">AI Blast Radius assessment</Link>, then build your <Link href="/ai-risk-register" className="text-primary font-medium hover:underline">AI risk register</Link>. For a scoped readiness program, consider the <Link href="/solutions/haiec" className="text-primary font-medium hover:underline">HAIEC AI Secure &amp; Govern Assessment</Link>.
              </p>
            </div>

            <div className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/20 p-3">
              <p className="text-xs text-amber-900 dark:text-amber-200">
                <strong>Disclaimer:</strong> This tool provides general guidance based on common patterns. It is not legal advice. Applicability depends on specific facts, contracts, jurisdictions, and use cases.
              </p>
            </div>

            <Button variant="outline" size="sm" onClick={reset} className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" /> Start over
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
