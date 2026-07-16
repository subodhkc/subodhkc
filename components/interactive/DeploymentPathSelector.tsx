'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Phone, Settings, Cpu, CheckCircle2, ArrowRight } from 'lucide-react'

interface PathData {
  id: number
  name: string
  icon: typeof Phone
  tagline: string
  bestFor: string[]
  includes: string[]
  setupTime: string
  color: string
  borderColor: string
  bgColor: string
}

const paths: PathData[] = [
  {
    id: 0,
    name: 'Self-Service AI Receptionist',
    icon: Phone,
    tagline: 'Configure through the dashboard — no coding required',
    bestFor: [
      'Basic answering and FAQs',
      'Lead capture and message taking',
      'After-hours coverage',
      'Simple appointment workflows',
      'Human transfer',
    ],
    includes: [
      'Business identity and greeting',
      'Voice and tone selection',
      'Business hours and after-hours rules',
      'Services and service areas',
      'Approved FAQs',
      'Transfer destinations',
      'Phone number setup',
      'Test calling',
    ],
    setupTime: 'Minutes to hours',
    color: 'text-green-600',
    borderColor: 'border-green-500/30',
    bgColor: 'bg-green-500/10',
  },
  {
    id: 1,
    name: 'Supported Customization',
    icon: Settings,
    tagline: 'Hosted platform with implementation support for complex workflows',
    bestFor: [
      'Multiple locations',
      'Detailed call scripts',
      'Industry-specific intake',
      'Emergency workflows',
      'Custom business knowledge (RAG)',
      'Complicated appointment rules',
    ],
    includes: [
      'Everything in Self-Service, plus:',
      'Custom conversation workflows',
      'RAG source preparation and refresh',
      'Emergency scenario configuration',
      'Routing rules for multi-location',
      'Dashboard configuration',
      'Operational review setup',
    ],
    setupTime: 'Days to weeks',
    color: 'text-amber-600',
    borderColor: 'border-amber-500/30',
    bgColor: 'bg-amber-500/10',
  },
  {
    id: 2,
    name: 'Custom Integration & Managed Deployment',
    icon: Cpu,
    tagline: 'API-assisted integration with managed implementation',
    bestFor: [
      'Proprietary CRMs and scheduling',
      'Enterprise databases',
      'Regulated data workflows',
      'Complex lead routing',
      'Outbound programs',
      'High-impact write actions',
      'Evidence and compliance requirements',
    ],
    includes: [
      'Everything in Supported, plus:',
      'Tenant-scoped API keys',
      'Custom CRM and calendar integration',
      'Compliance-scoped deployment',
      'HAIEC assessment and evidence mapping',
      'Adversarial testing',
      'Operational support and SLA',
    ],
    setupTime: 'Weeks (scoped to complexity)',
    color: 'text-blue-600',
    borderColor: 'border-blue-500/30',
    bgColor: 'bg-blue-500/10',
  },
]

const useCaseQuestions = [
  { id: 0, label: 'I need basic call answering and lead capture', path: 0 },
  { id: 1, label: 'I need after-hours coverage and message taking', path: 0 },
  { id: 2, label: 'I need appointment booking with calendar sync', path: 0 },
  { id: 3, label: 'I need multiple locations or custom routing', path: 1 },
  { id: 4, label: 'I need industry-specific intake and emergency rules', path: 1 },
  { id: 5, label: 'I need RAG from my website and documents', path: 1 },
  { id: 6, label: 'I need CRM or custom system integration', path: 2 },
  { id: 7, label: 'I need compliance-scoped or regulated deployment', path: 2 },
  { id: 8, label: 'I need outbound campaigns or high-impact actions', path: 2 },
]

export function DeploymentPathSelector() {
  const [selectedPath, setSelectedPath] = useState<number>(0)
  const [matchedUseCase, setMatchedUseCase] = useState<number | null>(null)
  const current = paths.find((p) => p.id === selectedPath)!

  return (
    <Card className="border-l-4 border-l-primary/40">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Find Your Deployment Path
        </CardTitle>
        <CardDescription className="text-sm mt-1">
          Select a use case below to see which deployment path fits, or click a path directly to explore what it includes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Use case buttons */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Select your primary need</p>
          <div className="flex flex-wrap gap-2">
            {useCaseQuestions.map((q) => (
              <button
                key={q.id}
                onClick={() => {
                  setMatchedUseCase(q.id)
                  setSelectedPath(q.path)
                }}
                className={`rounded-lg border px-3 py-2 text-xs text-left transition-all ${
                  matchedUseCase === q.id
                    ? 'border-primary/40 bg-primary/10 ring-1 ring-primary/20 text-foreground'
                    : 'border-border bg-muted/20 hover:border-primary/30 text-muted-foreground'
                }`}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {/* Path selector tabs */}
        <div className="grid grid-cols-3 gap-2">
          {paths.map((path) => {
            const Icon = path.icon
            const isSelected = selectedPath === path.id
            return (
              <button
                key={path.id}
                onClick={() => {
                  setSelectedPath(path.id)
                  setMatchedUseCase(null)
                }}
                className={`rounded-lg border p-3 text-center transition-all ${
                  isSelected
                    ? `${path.borderColor} ${path.bgColor} ring-1 ring-primary/20`
                    : 'border-border bg-muted/20 hover:border-primary/30'
                }`}
              >
                <Icon className={`h-6 w-6 mx-auto mb-2 ${isSelected ? path.color : 'text-muted-foreground'}`} />
                <p className={`text-xs font-semibold ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>{path.name}</p>
              </button>
            )
          })}
        </div>

        {/* Selected path details */}
        <div className={`rounded-lg border ${current.borderColor} ${current.bgColor} p-4 space-y-3`}>
          <div className="flex items-center gap-2">
            <current.icon className={`h-5 w-5 ${current.color}`} />
            <h4 className="text-sm font-bold text-foreground">{current.name}</h4>
          </div>
          <p className="text-xs text-muted-foreground">{current.tagline}</p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Best For</p>
              <ul className="space-y-1">
                {current.bestFor.map((item) => (
                  <li key={item} className="text-xs text-foreground/90 flex items-start gap-2">
                    <CheckCircle2 className={`h-3.5 w-3.5 flex-shrink-0 mt-0.5 ${current.color}`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">What's Included</p>
              <ul className="space-y-1">
                {current.includes.map((item) => (
                  <li key={item} className="text-xs text-foreground/90 flex items-start gap-2">
                    <ArrowRight className={`h-3.5 w-3.5 flex-shrink-0 mt-0.5 ${current.color}`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-border/50">
            <span className="text-xs font-medium text-muted-foreground">Typical setup time:</span>
            <span className={`text-xs font-bold ${current.color}`}>{current.setupTime}</span>
          </div>
        </div>

        {/* Progression note */}
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
          <p className="text-xs text-foreground/80">
            <strong>Every path starts with the hosted dashboard.</strong> You can begin with self-service and move to supported customization or managed deployment as your needs grow — without rebuilding from scratch.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
