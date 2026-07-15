'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { RotateCcw, Eye, Pencil, Cog, Shield, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

type Capability = 'read' | 'write' | 'action' | 'admin'
type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

const capabilityLabels: Record<Capability, { label: string; icon: typeof Eye; desc: string }> = {
  read: { label: 'Read', icon: Eye, desc: 'Retrieve data, search, summarize, answer questions' },
  write: { label: 'Write', icon: Pencil, desc: 'Create or update records, generate content, modify state' },
  action: { label: 'Action', icon: Cog, desc: 'Execute operations: send emails, call APIs, transfer data' },
  admin: { label: 'Admin', icon: Shield, desc: 'Manage users, change configuration, delete data, override controls' },
}

const resourceTypes = [
  'Public knowledge base',
  'Internal documents (non-sensitive)',
  'Internal documents (confidential)',
  'Customer records',
  'Employee records',
  'Financial data',
  'Health information (PHI)',
  'Biometric identifiers',
  'Source code / IP',
  'Security incidents',
  'Administrative configs',
  'External APIs (email, payments, ticketing)',
]

const riskMatrix: Record<Capability, Record<number, RiskLevel>> = {
  read: { 0: 'low', 1: 'low', 2: 'medium', 3: 'high', 4: 'high', 5: 'critical', 6: 'critical', 7: 'critical', 8: 'critical', 9: 'critical', 10: 'critical', 11: 'critical' },
  write: { 0: 'low', 1: 'medium', 2: 'medium', 3: 'high', 4: 'high', 5: 'critical', 6: 'critical', 7: 'critical', 8: 'critical', 9: 'critical', 10: 'critical', 11: 'critical' },
  action: { 0: 'medium', 1: 'medium', 2: 'high', 3: 'high', 4: 'critical', 5: 'critical', 6: 'critical', 7: 'critical', 8: 'critical', 9: 'critical', 10: 'critical', 11: 'critical' },
  admin: { 0: 'high', 1: 'high', 2: 'high', 3: 'critical', 4: 'critical', 5: 'critical', 6: 'critical', 7: 'critical', 8: 'critical', 9: 'critical', 10: 'critical', 11: 'critical' },
}

const riskColors: Record<RiskLevel, string> = {
  low: 'bg-green-500/10 text-green-600 border-green-500/30',
  medium: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
  high: 'bg-orange-500/10 text-orange-600 border-orange-500/30',
  critical: 'bg-red-500/10 text-red-600 border-red-500/30',
}

const riskDescriptions: Record<RiskLevel, string> = {
  low: 'Minimal risk. Standard logging and access controls are sufficient.',
  medium: 'Moderate risk. Requires RLS, authorization checks, and audit logging.',
  high: 'High risk. Requires human approval, server-side authorization, and evidence-grade logging.',
  critical: 'Critical risk. Requires mandatory human approval, multi-party authorization, full audit trail, and adversarial testing.',
}

export function AgentReadWriteActionMatrix() {
  const [matrix, setMatrix] = useState<Record<string, Set<Capability>>>(
    Object.fromEntries(resourceTypes.map((r) => [r, new Set<Capability>()]))
  )

  const toggle = (resource: string, cap: Capability) => {
    setMatrix((prev) => {
      const next = { ...prev }
      const current = new Set(next[resource])
      if (current.has(cap)) current.delete(cap)
      else current.add(cap)
      next[resource] = current
      return next
    })
  }

  const reset = () => {
    setMatrix(Object.fromEntries(resourceTypes.map((r) => [r, new Set<Capability>()])))
  }

  const getRisk = (resource: string, cap: Capability): RiskLevel | null => {
    if (!matrix[resource]?.has(cap)) return null
    const idx = resourceTypes.indexOf(resource)
    return riskMatrix[cap][idx] ?? 'low'
  }

  const activeCount = Object.values(matrix).reduce((sum, caps) => sum + caps.size, 0)
  const criticalCount = Object.entries(matrix).reduce((sum, [resource, caps]) => {
    const idx = resourceTypes.indexOf(resource)
    return sum + Array.from(caps).filter((cap) => riskMatrix[cap][idx] === 'critical').length
  }, 0)

  return (
    <Card className="border-l-4 border-l-primary/40">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Cog className="h-5 w-5 text-primary" />
          AI Agent Read / Write / Action Matrix
        </CardTitle>
        <CardDescription className="text-sm mt-1">
          Map what your AI agent can do with each resource type. The matrix automatically classifies risk level based on capability and data sensitivity.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeCount > 0 && (
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="rounded-lg border border-border bg-muted/30 px-3 py-1.5">
              <strong className="text-foreground">{activeCount}</strong> active capabilities
            </span>
            {criticalCount > 0 && (
              <span className="rounded-lg border border-red-500/30 bg-red-500/5 px-3 py-1.5 text-red-600">
                <AlertTriangle className="h-3 w-3 inline mr-1" />
                <strong>{criticalCount}</strong> critical-risk combinations
              </span>
            )}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead>
              <tr>
                <th className="text-left p-2 font-semibold sticky left-0 bg-background">Resource</th>
                {(['read', 'write', 'action', 'admin'] as Capability[]).map((cap) => {
                  const Icon = capabilityLabels[cap].icon
                  return (
                    <th key={cap} className="p-2 font-semibold text-center min-w-[80px]">
                      <div className="flex flex-col items-center gap-1">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span>{capabilityLabels[cap].label}</span>
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {resourceTypes.map((resource, idx) => (
                <tr key={resource}>
                  <td className="p-2 font-medium text-foreground sticky left-0 bg-background">
                    <span className={idx >= 5 ? 'text-red-600' : ''}>{resource}</span>
                  </td>
                  {(['read', 'write', 'action', 'admin'] as Capability[]).map((cap) => {
                    const risk = getRisk(resource, cap)
                    const isActive = !!risk
                    return (
                      <td key={cap} className="p-2 text-center">
                        <button
                          onClick={() => toggle(resource, cap)}
                          className={`w-full rounded-md border p-2 text-xs font-medium transition-all ${
                            isActive ? riskColors[risk] : 'border-border bg-muted/20 text-muted-foreground hover:border-primary/40'
                          }`}
                        >
                          {isActive ? risk!.charAt(0).toUpperCase() + risk!.slice(1) : '—'}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-1 text-xs text-muted-foreground">
          <p><strong className="text-foreground">How to use:</strong> Click a cell to toggle that capability for that resource. Risk is automatically classified based on the combination.</p>
          <p><strong className="text-foreground">Risk levels:</strong></p>
          <ul className="ml-4 space-y-0.5">
            <li className="list-disc"><span className="text-green-600 font-medium">Low</span> — {riskDescriptions.low}</li>
            <li className="list-disc"><span className="text-amber-600 font-medium">Medium</span> — {riskDescriptions.medium}</li>
            <li className="list-disc"><span className="text-orange-600 font-medium">High</span> — {riskDescriptions.high}</li>
            <li className="list-disc"><span className="text-red-600 font-medium">Critical</span> — {riskDescriptions.critical}</li>
          </ul>
        </div>

        {criticalCount > 0 && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <p className="text-sm text-foreground/90">
              <AlertTriangle className="h-4 w-4 inline mr-1 text-red-600" />
              <strong>Critical risk detected.</strong> Any agent with admin or action access to sensitive resources requires mandatory human approval, server-side authorization, and full audit logging. Consider the{' '}
              <Link href="/solutions/haiec" className="text-primary font-medium hover:underline">HAIEC security assessment</Link>{' '}
              for automated tool-permission analysis.
            </p>
          </div>
        )}

        <button
          onClick={reset}
          className="w-full rounded-lg border border-border py-2 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="h-4 w-4" /> Reset Matrix
        </button>
      </CardContent>
    </Card>
  )
}
