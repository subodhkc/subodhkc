'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Info, Shield, Pencil, Calendar, RefreshCw, AlertTriangle, Ban, Eye, Lock } from 'lucide-react'
import Link from 'next/link'

interface LevelData {
  level: number
  capability: string
  example: string
  controls: string[]
  color: string
  borderColor: string
  bgColor: string
  icon: typeof Info
}

const levels: LevelData[] = [
  {
    level: 0,
    capability: 'Inform',
    example: 'Explain hours, services, or policies',
    controls: ['Approved knowledge source', 'Tenant-bound configuration', 'No write tools'],
    color: 'text-green-600',
    borderColor: 'border-green-500/30',
    bgColor: 'bg-green-500/10',
    icon: Info,
  },
  {
    level: 1,
    capability: 'Collect',
    example: 'Capture contact details, message, or callback request',
    controls: ['Read-back validation for phone numbers', 'Field-format verification', 'Message storage with tenant scope'],
    color: 'text-green-600',
    borderColor: 'border-green-500/30',
    bgColor: 'bg-green-500/5',
    icon: Eye,
  },
  {
    level: 2,
    capability: 'Recommend',
    example: 'Suggest appointment times or service options',
    controls: ['Authoritative availability lookup', 'Only valid options offered', 'No fabricated slots'],
    color: 'text-amber-600',
    borderColor: 'border-amber-500/30',
    bgColor: 'bg-amber-500/10',
    icon: Calendar,
  },
  {
    level: 3,
    capability: 'Prepare',
    example: 'Prepare a booking or callback for caller confirmation',
    controls: ['Caller confirmation required', 'Prepared action held until approved', 'Clear summary before execution'],
    color: 'text-amber-600',
    borderColor: 'border-amber-500/30',
    bgColor: 'bg-amber-500/5',
    icon: Pencil,
  },
  {
    level: 4,
    capability: 'Reversible action',
    example: 'Create or modify an appointment',
    controls: ['Caller authentication', 'Full audit logging', 'Rollback capability', 'Idempotency for retries'],
    color: 'text-orange-600',
    borderColor: 'border-orange-500/30',
    bgColor: 'bg-orange-500/10',
    icon: RefreshCw,
  },
  {
    level: 5,
    capability: 'Consequential action',
    example: 'Issue a refund or change an account record',
    controls: ['Strong identity verification', 'Transaction limits and thresholds', 'Human review for high-value', 'Complete evidence trail'],
    color: 'text-red-600',
    borderColor: 'border-red-500/30',
    bgColor: 'bg-red-500/10',
    icon: AlertTriangle,
  },
  {
    level: 6,
    capability: 'High-impact action',
    example: 'Clinical, legal, payment authorization, or access decision',
    controls: ['Mandatory human approval', 'Prohibit automated execution', 'Licensed professional review', 'Full incident-grade evidence'],
    color: 'text-red-700',
    borderColor: 'border-red-600/40',
    bgColor: 'bg-red-600/10',
    icon: Ban,
  },
]

export function VoiceControlLadder() {
  const [selected, setSelected] = useState<number>(0)
  const current = levels.find((l) => l.level === selected)!

  return (
    <Card className="border-l-4 border-l-primary/40">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          AI Voice Control Ladder
        </CardTitle>
        <CardDescription className="text-sm mt-1">
          Click each level to see the capability, example, and minimum controls required. Higher levels carry greater risk and require stronger guardrails.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          {levels.map((lvl) => {
            const Icon = lvl.icon
            const isSelected = selected === lvl.level
            return (
              <button
                key={lvl.level}
                onClick={() => setSelected(lvl.level)}
                className={`w-full rounded-lg border p-3 text-left transition-all flex items-center gap-3 ${
                  isSelected
                    ? `${lvl.borderColor} ${lvl.bgColor} ring-1 ring-primary/20`
                    : 'border-border bg-muted/20 hover:border-primary/30'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isSelected ? lvl.bgColor : 'bg-muted/40'}`}>
                  <Icon className={`h-5 w-5 ${isSelected ? lvl.color : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-bold ${isSelected ? lvl.color : 'text-muted-foreground'}`}>L{lvl.level}</span>
                    <span className="text-sm font-semibold text-foreground">{lvl.capability}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{lvl.example}</p>
                </div>
              </button>
            )
          })}
        </div>

        <div className={`rounded-lg border ${current.borderColor} ${current.bgColor} p-4 space-y-3`}>
          <div className="flex items-center gap-2">
            <current.icon className={`h-5 w-5 ${current.color}`} />
            <h4 className="text-sm font-bold text-foreground">Level {current.level}: {current.capability}</h4>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Example</p>
            <p className="text-sm text-foreground">{current.example}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Minimum Controls</p>
            <ul className="space-y-1">
              {current.controls.map((ctrl) => (
                <li key={ctrl} className="text-sm text-foreground/90 flex items-start gap-2">
                  <span className={`mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 ${current.color.replace('text', 'bg')}`} />
                  {ctrl}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm text-foreground/90">
            <Shield className="h-4 w-4 inline mr-1 text-primary" />
            <strong>Read and write tools should be separated.</strong> The model may request a tool, but the application should enforce caller authorization, tenant scope, required fields, transaction limits, confirmation, idempotency, retry limits, and audit evidence. See the{' '}
            <Link href="/ai-security-tools" className="text-primary font-medium hover:underline">AI security tools</Link>{' '}
            for interactive agent-capability analysis.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
