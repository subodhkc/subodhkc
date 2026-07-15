'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertTriangle, Shield, ArrowRight, ArrowLeft, RotateCcw, Info } from 'lucide-react'
import Link from 'next/link'

type Step = 0 | 1 | 2 | 3 | 4 | 5

const step4Options = [
  'Government consumer interaction',
  'Healthcare service or treatment',
  'Diagnostic or treatment recommendation',
  'Facial, fingerprint, iris, or voice identification',
  'Hiring, lending, insurance, housing, education, or another consequential decision',
  'System designed to influence vulnerable users',
  'Self-harm, violence, or criminal-content risk',
  'Generative sexual or deepfake content',
  'Child-directed conversational system',
  'Government social scoring',
  'System that may impair constitutional rights',
  'Customer, employee, or consumer personal data',
  'AI that can independently call tools or perform actions',
]

export function TRAIGAApplicabilityChecker() {
  const [step, setStep] = useState<Step>(0)
  const [texasConnection, setTexasConnection] = useState<boolean | null>(null)
  const [aiDefinition, setAiDefinition] = useState<boolean | null>(null)
  const [role, setRole] = useState<'developer' | 'deployer' | 'both' | null>(null)
  const [useCases, setUseCases] = useState<string[]>([])

  const toggleUseCase = (uc: string) => {
    setUseCases((prev) => (prev.includes(uc) ? prev.filter((u) => u !== uc) : [...prev, uc]))
  }

  const reset = () => {
    setStep(0)
    setTexasConnection(null)
    setAiDefinition(null)
    setRole(null)
    setUseCases([])
  }

  const result = (() => {
    if (texasConnection === false) return 'A'
    if (texasConnection === true && aiDefinition === false) return 'A'
    if (texasConnection === true && aiDefinition === true && useCases.length === 0) return 'B'
    if (texasConnection === true && aiDefinition === true && useCases.length > 0) {
      const elevated = useCases.some((uc) =>
        ['Healthcare service or treatment', 'Diagnostic or treatment recommendation', 'Facial, fingerprint, iris, or voice identification', 'Hiring, lending, insurance, housing, education, or another consequential decision', 'Child-directed conversational system', 'System that may impair constitutional rights'].includes(uc),
      )
      return elevated ? 'D' : 'C'
    }
    return null
  })()

  const resultConfig = {
    A: {
      title: 'Result A — Likely outside TRAIGA\u2019s direct scope',
      color: 'border-l-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-950/20',
      icon: Info,
      iconColor: 'text-blue-600',
      description: 'Either there is no meaningful Texas connection, or the software is likely deterministic automation rather than an AI system under TRAIGA.',
      actions: [
        'Other state, federal, contractual, or industry requirements may still apply.',
        'Document the analysis for future reference.',
      ],
    },
    B: {
      title: 'Result B — Within scope, but no obvious direct TRAIGA trigger identified',
      color: 'border-l-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-950/20',
      icon: CheckCircle2,
      iconColor: 'text-amber-600',
      description: 'The business may be within TRAIGA\u2019s broad scope, but the final law does not impose a general registration, impact-assessment, or chatbot-disclosure requirement merely because the business uses AI.',
      actions: [
        'Record the tool, purpose, data, owner, and restrictions.',
        'Prevent sensitive information from being entered without approval.',
        'Review vendor terms and data retention.',
        'Train employees on acceptable use.',
      ],
    },
    C: {
      title: 'Result C — A specific TRAIGA duty or prohibition may apply',
      color: 'border-l-orange-500',
      bg: 'bg-orange-50 dark:bg-orange-950/20',
      icon: AlertTriangle,
      iconColor: 'text-orange-600',
      description: 'The identified use case triggers provision-specific review under TRAIGA. The business should identify the relevant statutory section and implement controls.',
      actions: [
        'Identify the relevant statutory section.',
        'Implement controls and testing.',
        'Document intent, data, limitations, monitoring, and safeguards.',
        'Obtain legal review where the consequences are material.',
      ],
    },
    D: {
      title: 'Result D — Elevated regulated-use review needed',
      color: 'border-l-red-500',
      bg: 'bg-red-50 dark:bg-red-950/20',
      icon: Shield,
      iconColor: 'text-red-600',
      description: 'AI affects healthcare, employment, lending, insurance, children, biometrics, government services, constitutional rights, or other high-impact areas. TRAIGA may be only one part of the legal analysis.',
      actions: [
        'Conduct a full regulated-use legal review.',
        'Implement all Result C controls.',
        'Evaluate HIPAA, employment law, biometric law, and sector-specific requirements.',
        'Maintain comprehensive AI System Records.',
        'Obtain qualified legal counsel.',
      ],
    },
  }

  const steps = [
    { label: 'Texas Connection', num: 1 },
    { label: 'AI Definition', num: 2 },
    { label: 'Your Role', num: 3 },
    { label: 'Use Case Review', num: 4 },
    { label: 'Result', num: 5 },
  ]

  return (
    <div className="rounded-xl border border-border bg-card p-6 md:p-8">
      {/* Progress indicator */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center gap-2 flex-shrink-0">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                step >= s.num ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {s.num}
            </div>
            <span className={`text-xs font-medium ${step >= s.num ? 'text-foreground' : 'text-muted-foreground'} hidden sm:inline`}>
              {s.label}
            </span>
            {i < steps.length - 1 && <div className={`h-0.5 w-4 ${step > s.num ? 'bg-primary' : 'bg-muted'}`} />}
          </div>
        ))}
      </div>

      {/* Step 0: Intro */}
      {step === 0 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold mb-2">Quick TRAIGA Applicability Checker</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This checker provides a preliminary classification. It is designed to identify issues requiring further review, not to provide a legal conclusion.
            </p>
          </div>
          <div className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/20 p-3">
            <p className="text-xs text-amber-900 dark:text-amber-200">
              <strong>Educational notice:</strong> Applicability can depend on facts, contracts, industry rules, and other federal or state laws. This is not a substitute for legal advice.
            </p>
          </div>
          <Button onClick={() => setStep(1)} className="w-full sm:w-auto">
            Begin Assessment <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Step 1: Texas Connection */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold mb-1">Step 1: Is there a Texas connection?</h3>
            <p className="text-sm text-muted-foreground">Answer <strong>yes</strong> when any of the following is true:</p>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1.5 ml-4">
            <li className="list-disc">Your company conducts business in Texas.</li>
            <li className="list-disc">You advertise or promote services in Texas.</li>
            <li className="list-disc">Texas residents use your product or service.</li>
            <li className="list-disc">You develop AI that is offered or provided in Texas.</li>
            <li className="list-disc">You put an AI system into use in Texas.</li>
          </ul>
          <div className="flex gap-3 pt-2">
            <Button
              variant={texasConnection === true ? 'default' : 'outline'}
              onClick={() => {
                setTexasConnection(true)
                setStep(2)
              }}
            >
              Yes
            </Button>
            <Button
              variant={texasConnection === false ? 'default' : 'outline'}
              onClick={() => {
                setTexasConnection(false)
                setStep(5)
              }}
            >
              No
            </Button>
            <Button variant="ghost" onClick={() => setStep(0)}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: AI Definition */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold mb-1">Step 2: Does the system meet the AI definition?</h3>
            <p className="text-sm text-muted-foreground">Ask whether the system infers from inputs to generate:</p>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1.5 ml-4">
            <li className="list-disc"><strong>Content</strong></li>
            <li className="list-disc"><strong>Decisions</strong></li>
            <li className="list-disc"><strong>Predictions</strong></li>
            <li className="list-disc"><strong>Recommendations</strong></li>
          </ul>
          <p className="text-sm text-muted-foreground">And whether those outputs can influence a physical or virtual environment.</p>
          <div className="flex gap-3 pt-2">
            <Button
              variant={aiDefinition === true ? 'default' : 'outline'}
              onClick={() => {
                setAiDefinition(true)
                setStep(3)
              }}
            >
              Yes or uncertain
            </Button>
            <Button
              variant={aiDefinition === false ? 'default' : 'outline'}
              onClick={() => {
                setAiDefinition(false)
                setStep(5)
              }}
            >
              No
            </Button>
            <Button variant="ghost" onClick={() => setStep(1)}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Role */}
      {step === 3 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold mb-1">Step 3: What is your role?</h3>
            <p className="text-sm text-muted-foreground">A business may be both a developer and deployer.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <button
              onClick={() => { setRole('developer'); setStep(4) }}
              className={`text-left p-4 rounded-lg border transition-all ${role === 'developer' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}
            >
              <p className="font-semibold text-sm">Developer</p>
              <p className="text-xs text-muted-foreground mt-1">You create an AI system that is offered, sold, leased, given, or otherwise provided in Texas.</p>
            </button>
            <button
              onClick={() => { setRole('deployer'); setStep(4) }}
              className={`text-left p-4 rounded-lg border transition-all ${role === 'deployer' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}
            >
              <p className="font-semibold text-sm">Deployer</p>
              <p className="text-xs text-muted-foreground mt-1">You put an AI system into use in Texas.</p>
            </button>
            <button
              onClick={() => { setRole('both'); setStep(4) }}
              className={`text-left p-4 rounded-lg border transition-all ${role === 'both' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}
            >
              <p className="font-semibold text-sm">Both</p>
              <p className="text-xs text-muted-foreground mt-1">A business may develop and deploy its own internal or customer-facing system.</p>
            </button>
          </div>
          <Button variant="ghost" onClick={() => setStep(2)}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </div>
      )}

      {/* Step 4: Use Cases */}
      {step === 4 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold mb-1">Step 4: Does the use case trigger a specific concern?</h3>
            <p className="text-sm text-muted-foreground">Mark every applicable category. A checked category does not automatically mean a violation exists — it means the use case deserves provision-specific review.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {step4Options.map((opt) => (
              <button
                key={opt}
                onClick={() => toggleUseCase(opt)}
                className={`text-left p-3 rounded-lg border text-sm transition-all ${
                  useCases.includes(opt) ? 'border-primary bg-primary/5 text-foreground' : 'border-border text-muted-foreground hover:border-primary/40'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className={`mt-0.5 h-4 w-4 rounded border flex-shrink-0 flex items-center justify-center ${useCases.includes(opt) ? 'border-primary bg-primary' : 'border-muted-foreground/30'}`}>
                    {useCases.includes(opt) && <CheckCircle2 className="h-3 w-3 text-primary-foreground" />}
                  </div>
                  <span>{opt}</span>
                </div>
              </button>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={() => setStep(5)}>
              See Result <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="ghost" onClick={() => setStep(3)}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </div>
        </div>
      )}

      {/* Step 5: Result */}
      {step === 5 && result && (
        <div className="space-y-4">
          {(() => {
            const cfg = resultConfig[result as keyof typeof resultConfig]
            const Icon = cfg.icon
            return (
              <div className={`rounded-lg border-l-4 ${cfg.color} ${cfg.bg} p-5 space-y-4`}>
                <div className="flex items-start gap-3">
                  <Icon className={`h-6 w-6 ${cfg.iconColor} flex-shrink-0 mt-0.5`} />
                  <div>
                    <h3 className="text-lg font-bold">{cfg.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{cfg.description}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-2">Recommended action:</p>
                  <ul className="text-sm text-muted-foreground space-y-1.5 ml-4">
                    {cfg.actions.map((a, i) => (
                      <li key={i} className="list-disc">{a}</li>
                    ))}
                  </ul>
                </div>

                {(result === 'C' || result === 'D') && (
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 mt-2">
                    <p className="text-sm text-foreground">
                      A structured version of this assessment can be delivered through the{' '}
                      <Link href="/solutions/haiec" className="text-primary font-semibold hover:underline">HAIEC Texas AI Readiness Assessment</Link>
                      , including applicability analysis, system inventory, disclosure review, prohibited-use testing, evidence gaps, and a cure-response package.
                    </p>
                  </div>
                )}

                {result === 'A' && (
                  <div className="rounded-lg border border-border bg-muted/30 p-3 mt-2">
                    <p className="text-xs text-muted-foreground">
                      TRAIGA may not directly apply, but other state, federal, contractual, or industry requirements may still apply. Consider reviewing your AI use under broader governance frameworks.
                    </p>
                  </div>
                )}

                {result === 'B' && (
                  <div className="rounded-lg border border-border bg-muted/30 p-3 mt-2">
                    <p className="text-xs text-muted-foreground">
                      For the full statutory guide, see the{' '}
                      <Link href="/guides/texas-ai-law" className="text-primary font-medium hover:underline">Texas AI Law (TRAIGA / HB 149) Compliance Guide</Link>.
                    </p>
                  </div>
                )}
              </div>
            )
          })()}

          <div className="flex gap-3">
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-2" /> Start Over
            </Button>
            <Link href="/guides/texas-ai-law">
              <Button variant="ghost">
                Full TRAIGA Guide <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground italic">
            This preliminary assessment is for educational purposes and does not constitute legal advice. Applicability depends on specific facts and circumstances.
          </p>
        </div>
      )}
    </div>
  )
}
