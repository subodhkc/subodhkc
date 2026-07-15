'use client'

import { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RotateCcw, Zap, Shield, AlertTriangle, TrendingUp } from 'lucide-react'
import Link from 'next/link'

type DataType = 'none' | 'public' | 'internal' | 'confidential' | 'pii' | 'phi' | 'biometric'
type UserScale = 'small' | 'medium' | 'large' | 'enterprise'
type ToolAccess = 'readonly' | 'write' | 'action' | 'admin'
type Deployment = 'local' | 'internal-server' | 'cloud' | 'public'

const dataTypes: { value: DataType; label: string; weight: number }[] = [
  { value: 'none', label: 'No sensitive data', weight: 0 },
  { value: 'public', label: 'Public information only', weight: 1 },
  { value: 'internal', label: 'Internal business data', weight: 3 },
  { value: 'confidential', label: 'Confidential / financial / proprietary', weight: 6 },
  { value: 'pii', label: 'Personally identifiable information (PII / SSN, DL, financial account)', weight: 7 },
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
  const [multiTenant, setMultiTenant] = useState(false)

  const score = useMemo(() => {
    const data = dataTypes.find((d) => d.value === dataType)?.weight ?? 0
    const users = userScales.find((u) => u.value === userScale)?.weight ?? 0
    const tools = toolAccessLevels.find((t) => t.value === toolAccess)?.weight ?? 0
    const deploy = deploymentModels.find((d) => d.value === deployment)?.weight ?? 0
    let total = data + users + tools + deploy
    if (mcpConnected) total += 3
    if (ragEnabled) total += 2
    if (autoApproval) total += 5
    if (multiTenant) total += 4
    return total
  }, [dataType, userScale, toolAccess, deployment, mcpConnected, ragEnabled, autoApproval, multiTenant])

  const riskLevel = useMemo(() => {
    if (score <= 7) return {
      label: 'Low',
      color: 'green',
      icon: Shield,
      description: 'Limited exposure surface. Basic controls and documentation are likely sufficient.',
      recommendations: [
        'Document the AI system in your AI inventory with data types and user populations',
        'Enable basic audit logging for all model interactions and tool calls',
        'Review access controls quarterly — ensure only intended users can reach the application',
        'Keep the tool allow-list minimal: remove any tool that is not actively used',
      ],
    }
    if (score <= 17) return {
      label: 'Moderate',
      color: 'amber',
      icon: AlertTriangle,
      description: 'Meaningful exposure. Formal security review, RLS, and tool authorization are recommended.',
      recommendations: [
        'Conduct a formal security review covering prompt injection, tool authorization, and data access paths',
        'Implement row-level security (RLS) before retrieval — never rely on the model to filter restricted content',
        'Add human approval for any tool that writes, sends, or modifies data',
        'Scope cache keys with tenant and user identity to prevent cross-tenant leakage',
        'Create an AI risk register entry for this application and assign an owner',
      ],
    }
    if (score <= 29) return {
      label: 'High',
      color: 'orange',
      icon: AlertTriangle,
      description: 'Significant exposure. Mandatory security review, human approval for actions, and evidence-grade logging required.',
      recommendations: [
        'Mandatory security review before production deployment — do not defer to post-launch',
        'Human approval required for all action and admin tools — no automatic execution',
        'Server-side authorization independent of model output for every sensitive operation',
        'Evidence-grade logging: prompts, outputs, tool calls, authorization decisions, approver identity',
        'Negative-access testing for cross-tenant data leakage before each release',
        'Incident response playbook specific to this application, with evidence preservation checklist',
        'Consider a HAIEC AI Exposure Assessment for deterministic analysis and adversarial testing',
      ],
    }
    return {
      label: 'Critical',
      color: 'red',
      icon: Zap,
      description: 'High blast radius. Full governance program, adversarial testing, and continuous monitoring are essential.',
      recommendations: [
        'Do not deploy without a completed AI security assessment — the blast radius is too large for informal review',
        'Full governance program: AI system registry, risk register, disclosure review, and compliance documentation',
        'Mandatory adversarial testing: prompt injection, RAG poisoning, tool abuse, auth bypass, and cross-tenant access',
        'Dual authorization for high-value actions (two humans must approve)',
        'Continuous monitoring with alerting on anomalous tool calls, unusual retrieval patterns, and authorization failures',
        'Quarterly security review and after any architecture change, new MCP integration, or data source expansion',
        'Regulatory compliance assessment: TRAIGA, EU AI Act, HIPAA, NYC LL 144 — depending on data types and jurisdictions',
        'Engage HAIEC for a comprehensive AI Exposure Assessment with evidence-grade outputs',
      ],
    }
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
            { label: 'Multi-tenant architecture (shared infrastructure across organizations)', state: multiTenant, set: setMultiTenant },
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
              <p className="text-xs opacity-80">Score: {score} / 48</p>
            </div>
          </div>
          <p className="text-sm text-foreground/90">{riskLevel.description}</p>
          <ul className="mt-3 space-y-1">
            {riskLevel.recommendations.map((rec) => (
              <li key={rec} className="flex items-start gap-2 text-xs text-foreground/80">
                <span className="text-primary flex-shrink-0 mt-0.5">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
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

        {/* Score Explanation */}
        <details className="rounded-lg border border-border p-3 group">
          <summary className="text-xs font-medium text-muted-foreground cursor-pointer flex items-center justify-between">
            How is this score calculated?
            <span className="text-muted-foreground group-open:rotate-180 transition-transform">⌄</span>
          </summary>
          <div className="mt-3 space-y-2 text-xs text-muted-foreground">
            <p>The score is the sum of weighted factors:</p>
            <ul className="ml-4 space-y-1">
              <li className="list-disc"><strong className="text-foreground">Data type</strong> (0–9): No sensitive data = 0, Public = 1, Internal = 3, Confidential = 6, PII = 7, PHI/Biometric = 9</li>
              <li className="list-disc"><strong className="text-foreground">User scale</strong> (1–8): 1–10 users = 1, 11–100 = 3, 101–1,000 = 5, 1,000+ = 8</li>
              <li className="list-disc"><strong className="text-foreground">Tool access</strong> (1–10): Read-only = 1, Write = 5, Action = 8, Admin = 10</li>
              <li className="list-disc"><strong className="text-foreground">Deployment</strong> (1–7): Local = 1, Internal server = 2, Cloud = 4, Public = 7</li>
              <li className="list-disc"><strong className="text-foreground">MCP connected</strong>: +3 (external tool discovery expands attack surface)</li>
              <li className="list-disc"><strong className="text-foreground">RAG enabled</strong>: +2 (document corpus is an injection vector)</li>
              <li className="list-disc"><strong className="text-foreground">Automatic execution</strong>: +5 (no human checkpoint before actions)</li>
              <li className="list-disc"><strong className="text-foreground">Multi-tenant</strong>: +4 (cross-tenant leakage risk)</li>
            </ul>
            <p className="mt-2">Risk bands: 0–7 Low, 8–17 Moderate, 18–29 High, 30+ Critical.</p>
          </div>
        </details>

        {/* Industry Scenarios */}
        <div className="border-t border-border pt-4 space-y-3">
          <p className="text-sm font-medium text-foreground">Industry scenarios — click to load:</p>
          <div className="grid gap-2">
            {[
              { label: 'Healthcare: clinical AI assistant (PHI, 500+ users, action tools, RAG)', config: { d: 'phi' as DataType, u: 'large' as UserScale, t: 'action' as ToolAccess, dep: 'internal-server' as Deployment, mcp: true, rag: true, auto: false } },
              { label: 'Financial services: research assistant (confidential, 200+ users, action tools, RAG)', config: { d: 'confidential' as DataType, u: 'large' as UserScale, t: 'action' as ToolAccess, dep: 'internal-server' as Deployment, mcp: false, rag: true, auto: true } },
              { label: 'HR / Hiring: AI resume screener (PII, 50+ users, admin, cloud)', config: { d: 'pii' as DataType, u: 'medium' as UserScale, t: 'admin' as ToolAccess, dep: 'cloud' as Deployment, mcp: false, rag: true, auto: true } },
              { label: 'Legal: case document assistant (confidential, 100+ users, read-only, RAG)', config: { d: 'confidential' as DataType, u: 'medium' as UserScale, t: 'readonly' as ToolAccess, dep: 'internal-server' as Deployment, mcp: false, rag: true, auto: false } },
              { label: 'Retail: customer support chatbot (public, 1000+ users, read-only, public)', config: { d: 'public' as DataType, u: 'enterprise' as UserScale, t: 'readonly' as ToolAccess, dep: 'public' as Deployment, mcp: false, rag: false, auto: false } },
              { label: 'Small business: internal summarizer (internal, 5 users, read-only, local)', config: { d: 'internal' as DataType, u: 'small' as UserScale, t: 'readonly' as ToolAccess, dep: 'local' as Deployment, mcp: false, rag: false, auto: false } },
              { label: 'Government: citizen services AI (PII, 1000+ users, action tools, cloud, multi-tenant)', config: { d: 'pii' as DataType, u: 'enterprise' as UserScale, t: 'action' as ToolAccess, dep: 'cloud' as Deployment, mcp: true, rag: true, auto: false } },
              { label: 'Education: student advising AI (PII + FERPA, 500+ users, read-only, cloud)', config: { d: 'pii' as DataType, u: 'large' as UserScale, t: 'readonly' as ToolAccess, dep: 'cloud' as Deployment, mcp: false, rag: true, auto: false } },
              { label: 'Insurance: claims processing AI (PII + financial, 200+ users, action tools, RAG)', config: { d: 'pii' as DataType, u: 'large' as UserScale, t: 'action' as ToolAccess, dep: 'internal-server' as Deployment, mcp: false, rag: true, auto: true } },
            ].map((scenario) => (
              <button
                key={scenario.label}
                onClick={() => {
                  setDataType(scenario.config.d)
                  setUserScale(scenario.config.u)
                  setToolAccess(scenario.config.t)
                  setDeployment(scenario.config.dep)
                  setMcpConnected(scenario.config.mcp)
                  setRagEnabled(scenario.config.rag)
                  setAutoApproval(scenario.config.auto)
                }}
                className="text-left text-xs rounded-lg border border-border p-2.5 hover:border-primary/40 hover:bg-primary/5 transition-colors text-muted-foreground"
              >
                {scenario.label}
              </button>
            ))}
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={() => { setDataType('none'); setUserScale('small'); setToolAccess('readonly'); setDeployment('local'); setMcpConnected(false); setRagEnabled(false); setAutoApproval(false); setMultiTenant(false) }} className="w-full">
          <RotateCcw className="h-4 w-4 mr-2" /> Reset
        </Button>
      </CardContent>
    </Card>
  )
}
