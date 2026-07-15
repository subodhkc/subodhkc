'use client'

import { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RotateCcw, Zap, Shield, AlertTriangle, TrendingUp } from 'lucide-react'
import Link from 'next/link'

type DataType = 'none' | 'public' | 'internal' | 'confidential' | 'phi' | 'biometric'
type UserScale = 'small' | 'medium' | 'large' | 'enterprise'
type ToolAccess = 'readonly' | 'write' | 'action' | 'admin'
type Deployment = 'local' | 'internal-server' | 'cloud' | 'public'

const dataTypes: { value: DataType; label: string; weight: number }[] = [
  { value: 'none', label: 'No sensitive data', weight: 0 },
  { value: 'public', label: 'Public information only', weight: 1 },
  { value: 'internal', label: 'Internal business data', weight: 3 },
  { value: 'confidential', label: 'Confidential / financial / proprietary', weight: 6 },
  { value: 'phi', label: 'Protected health information (PHI)', weight: 9 },
  { value: 'biometric', label: 'Biometric identifiers', weight: 9 },
]

const userScales: { value: UserScale; label: string; weight: number }[] = [
  { value: 'small', label: '1–10 users', weight: 1 },
  { value: 'medium', label: '11–100 users', weight: 3 },
  { value: 'large', label: '101–1,000 users', weight: 5 },
  { value: 'enterprise', label: '1,000+ users', weight: 8 },
]

const toolAccessLevels: { value: ToolAccess; label: string; weight: number }[] = [
  { value: 'readonly', label: 'Read-only queries (search, retrieve, summarize)', weight: 1 },
  { value: 'write', label: 'Write operations (create records, update fields)', weight: 5 },
  { value: 'action', label: 'Action execution (send emails, call APIs, transfer funds)', weight: 8 },
  { value: 'admin', label: 'Administrative actions (manage users, change configs, delete data)', weight: 10 },
]

const deploymentModels: { value: Deployment; label: string; weight: number }[] = [
  { value: 'local', label: 'Local / single workstation', weight: 1 },
  { value: 'internal-server', label: 'Internal server / VPN only', weight: 2 },
  { value: 'cloud', label: 'Cloud-hosted, authenticated access', weight: 4 },
  { value: 'public', label: 'Public-facing or minimally gated', weight: 7 },
]

export function AIBlastRadiusCalculator() {
  const [dataType, setDataType] = useState<DataType>('none')
  const [userScale, setUserScale] = useState<UserScale>('small')
  const [toolAccess, setToolAccess] = useState<ToolAccess>('readonly')
  const [deployment, setDeployment] = useState<Deployment>('local')
  const [mcpConnected, setMcpConnected] = useState(false)
  const [ragEnabled, setRagEnabled] = useState(false)
  const [autoApproval, setAutoApproval] = useState(false)

  const score = useMemo(() => {
    const data = dataTypes.find((d) => d.value === dataType)?.weight ?? 0
    const users = userScales.find((u) => u.value === userScale)?.weight ?? 0
    const tools = toolAccessLevels.find((t) => t.value === toolAccess)?.weight ?? 0
    const deploy = deploymentModels.find((d) => d.value === deployment)?.weight ?? 0
    let total = data + users + tools + deploy
    if (mcpConnected) total += 3
    if (ragEnabled) total += 2
    if (autoApproval) total += 5
    return total
  }, [dataType, userScale, toolAccess, deployment, mcpConnected, ragEnabled, autoApproval])

  const riskLevel = useMemo(() => {
    if (score <= 6) return { label: 'Low', color: 'green', icon: Shield, description: 'Limited exposure surface. Basic controls and documentation are likely sufficient.' }
    if (score <= 15) return { label: 'Moderate', color: 'amber', icon: AlertTriangle, description: 'Meaningful exposure. Formal security review, RLS, and tool authorization are recommended.' }
    if (score <= 25) return { label: 'High', color: 'orange', icon: AlertTriangle, description: 'Significant exposure. Mandatory security review, human approval for actions, and evidence-grade logging required.' }
    return { label: 'Critical', color: 'red', icon: Zap, description: 'High blast radius. Full governance program, adversarial testing, and continuous monitoring are essential.' }
  }, [score])

  const Icon = riskLevel.icon
  const colorClasses: Record<string, string> = {
    green: 'border-green-500 bg-green-500/5 text-green-600',
    amber: 'border-amber-500 bg-amber-500/5 text-amber-600',
    orange: 'border-orange-500 bg-orange-500/5 text-orange-600',
    red: 'border-red-500 bg-red-500/5 text-red-600',
  }

  return (
    <Card className="border-l-4 border-l-primary/40">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          AI Blast Radius Calculator
        </CardTitle>
        <CardDescription className="text-sm mt-1">
          Estimate the potential exposure surface of an internal AI application based on data sensitivity, user count, tool access, and deployment model.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">What kind of data does the AI system access?</label>
          <div className="grid gap-2">
            {dataTypes.map((d) => (
              <button
                key={d.value}
                onClick={() => setDataType(d.value)}
                className={`text-left text-sm rounded-lg border p-3 transition-colors ${dataType === d.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">How many users interact with the system?</label>
          <div className="grid gap-2 sm:grid-cols-2">
            {userScales.map((u) => (
              <button
                key={u.value}
                onClick={() => setUserScale(u.value)}
                className={`text-left text-sm rounded-lg border p-3 transition-colors ${userScale === u.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}
              >
                {u.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">What can the AI system do?</label>
          <div className="grid gap-2">
            {toolAccessLevels.map((t) => (
              <button
                key={t.value}
                onClick={() => setToolAccess(t.value)}
                className={`text-left text-sm rounded-lg border p-3 transition-colors ${toolAccess === t.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">How is the system deployed?</label>
          <div className="grid gap-2 sm:grid-cols-2">
            {deploymentModels.map((d) => (
              <button
                key={d.value}
                onClick={() => setDeployment(d.value)}
                className={`text-left text-sm rounded-lg border p-3 transition-colors ${deployment === d.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground block">Additional risk factors</label>
          {[
            { label: 'Connected to MCP servers (external tool discovery)', state: mcpConnected, set: setMcpConnected },
            { label: 'RAG enabled (retrieves from document corpus)', state: ragEnabled, set: setRagEnabled },
            { label: 'Automatic tool execution (no human approval)', state: autoApproval, set: setAutoApproval },
          ].map((factor) => (
            <label key={factor.label} className="flex items-center gap-3 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={factor.state}
                onChange={(e) => factor.set(e.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              <span className="text-muted-foreground">{factor.label}</span>
            </label>
          ))}
        </div>

        <div className={`rounded-lg border-2 p-4 ${colorClasses[riskLevel.color]}`}>
          <div className="flex items-center gap-3 mb-2">
            <Icon className="h-6 w-6" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide">Blast Radius: {riskLevel.label}</p>
              <p className="text-xs opacity-80">Score: {score} / 50</p>
            </div>
          </div>
          <p className="text-sm text-foreground/90">{riskLevel.description}</p>
        </div>

        {score > 15 && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm text-foreground/90">
              <strong>Recommended next steps:</strong> Conduct a formal security review covering prompt injection, RAG poisoning, tool authorization, RLS, and tenant isolation. Consider the{' '}
              <Link href="/solutions/haiec" className="text-primary font-medium hover:underline">HAIEC AI security assessment</Link>{' '}
              for automated analysis, or{' '}
              <Link href="/contact" className="text-primary font-medium hover:underline">contact Subodh KC</Link>{' '}
              for an architecture review.
            </p>
          </div>
        )}

        <Button variant="outline" size="sm" onClick={() => { setDataType('none'); setUserScale('small'); setToolAccess('readonly'); setDeployment('local'); setMcpConnected(false); setRagEnabled(false); setAutoApproval(false) }} className="w-full">
          <RotateCcw className="h-4 w-4 mr-2" /> Reset
        </Button>
      </CardContent>
    </Card>
  )
}
