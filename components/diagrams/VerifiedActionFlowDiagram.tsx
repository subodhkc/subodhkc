'use client'

import { useRef } from 'react'
import { DiagramTooltip, useDiagramTooltip, nodeHandlers, type DiagramNodeData } from '@/components/DiagramTooltip'

interface NodeDef extends DiagramNodeData {
  x: number
  y: number
  w: number
  h: number
  fill?: string
  stroke?: string
}

const weakNodes: NodeDef[] = [
  { id: 'vaf-weak-1', x: 40, y: 40, w: 200, h: 60, title: 'User Request', subtitle: '"Delete all customer records"', fill: 'url(#vaf-weak)', stroke: 'hsl(0 70% 50% / 0.3)', details: ['User makes a request with broad impact', 'No intent classification or scope check', 'Request goes directly to the model'] },
  { id: 'vaf-weak-2', x: 40, y: 120, w: 200, h: 60, title: 'AI Interprets', subtitle: 'No scope or guardrails', fill: 'url(#vaf-weak)', stroke: 'hsl(0 70% 50% / 0.3)', details: ['AI interprets the request literally', 'No guardrails or scope enforcement', 'No human approval required'] },
  { id: 'vaf-weak-3', x: 40, y: 200, w: 200, h: 60, title: 'Tool Executes', subtitle: 'Direct DB access, no filter', fill: 'url(#vaf-weak)', stroke: 'hsl(0 70% 50% / 0.3)', details: ['Tool executes with full database access', 'No tenant or role filtering', 'No audit trail or evidence capture'] },
  { id: 'vaf-weak-4', x: 40, y: 280, w: 200, h: 60, title: 'Data Lost', subtitle: 'No rollback, no audit', fill: 'hsl(0 70% 50% / 0.08)', stroke: 'hsl(0 70% 50% / 0.3)', details: ['Data is permanently deleted', 'No rollback capability', 'No audit trail of what happened'] },
]

const controlledNodes: NodeDef[] = [
  { id: 'vaf-ctrl-1', x: 360, y: 40, w: 200, h: 60, title: 'User Request', subtitle: '"Delete all customer records"', fill: 'url(#vaf-ctrl)', stroke: 'hsl(142 70% 40% / 0.3)', details: ['User makes a request with broad impact', 'Request is logged with user identity and timestamp', 'Intent classification runs before any action'] },
  { id: 'vaf-ctrl-2', x: 360, y: 120, w: 200, h: 60, title: 'Scope Check', subtitle: 'Intent + tenant + role filter', fill: 'url(#vaf-ctrl)', stroke: 'hsl(142 70% 40% / 0.3)', details: ['Intent classified: destructive operation detected', 'Tenant and role filters applied', 'Operation flagged for human approval'] },
  { id: 'vaf-ctrl-3', x: 360, y: 200, w: 200, h: 60, title: 'Human Approval', subtitle: 'Reviewer confirms scope', fill: 'hsl(142 70% 40% / 0.08)', stroke: 'hsl(142 70% 40% / 0.3)', details: ['Reviewer sees exact scope and impact', 'Approval required before execution', 'Approval logged with reviewer identity'] },
  { id: 'vaf-ctrl-4', x: 360, y: 280, w: 200, h: 60, title: 'Scoped Execution', subtitle: 'Filtered + audited + reversible', fill: 'url(#vaf-ctrl)', stroke: 'hsl(142 70% 40% / 0.3)', details: ['Execution scoped to approved criteria only', 'Full audit trail: who, what, when, why', 'Reversible: soft-delete with rollback window'] },
]

export function VerifiedActionFlowDiagram() {
  const svgRef = useRef<SVGSVGElement>(null)
  const { activeNode, showNode, hideNode, toggleNode } = useDiagramTooltip()
  const allNodes = [...weakNodes, ...controlledNodes]

  return (
    <div className="my-8 w-full overflow-x-auto" style={{ position: 'relative' }}>
      <svg ref={svgRef} viewBox="0 0 600 380" className="w-full min-w-[500px] h-auto" role="img" aria-label="Comparison of weak and controlled AI action flows, showing how guardrails, human approval, and audit trails prevent uncontrolled data deletion">
        <title>Verified Action Flow — Weak vs Controlled</title>
        <defs>
          <linearGradient id="vaf-weak" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="hsl(0 70% 50% / 0.08)" /><stop offset="100%" stopColor="hsl(0 70% 50% / 0.02)" /></linearGradient>
          <linearGradient id="vaf-ctrl" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="hsl(142 70% 40% / 0.08)" /><stop offset="100%" stopColor="hsl(142 70% 40% / 0.02)" /></linearGradient>
          <marker id="vaf-arrow-weak" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="hsl(0 70% 50% / 0.5)" /></marker>
          <marker id="vaf-arrow-ctrl" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="hsl(142 70% 40% / 0.5)" /></marker>
        </defs>

        <text x="140" y="22" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>Weak Flow</text>
        <text x="460" y="22" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>Controlled Flow</text>

        {/* Arrows */}
        <line x1="140" y1="100" x2="140" y2="120" stroke="hsl(0 70% 50% / 0.4)" strokeWidth="1.5" markerEnd="url(#vaf-arrow-weak)" />
        <line x1="140" y1="180" x2="140" y2="200" stroke="hsl(0 70% 50% / 0.4)" strokeWidth="1.5" markerEnd="url(#vaf-arrow-weak)" />
        <line x1="140" y1="260" x2="140" y2="280" stroke="hsl(0 70% 50% / 0.4)" strokeWidth="1.5" markerEnd="url(#vaf-arrow-weak)" />
        <line x1="460" y1="100" x2="460" y2="120" stroke="hsl(142 70% 40% / 0.4)" strokeWidth="1.5" markerEnd="url(#vaf-arrow-ctrl)" />
        <line x1="460" y1="180" x2="460" y2="200" stroke="hsl(142 70% 40% / 0.4)" strokeWidth="1.5" markerEnd="url(#vaf-arrow-ctrl)" />
        <line x1="460" y1="260" x2="460" y2="280" stroke="hsl(142 70% 40% / 0.4)" strokeWidth="1.5" markerEnd="url(#vaf-arrow-ctrl)" />

        {/* Interactive nodes */}
        {allNodes.map((n) => (
          <g key={n.id} {...nodeHandlers(n, showNode, hideNode, toggleNode)} data-active={activeNode?.id === n.id ? 'true' : undefined}>
            <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="8" fill={n.fill ?? 'hsl(var(--background))'} stroke={n.stroke ?? 'hsl(var(--primary) / 0.3)'} strokeWidth="1.5" />
            <text x={n.x + n.w / 2} y={n.y + n.h / 2 - 4} textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600, pointerEvents: 'none' }}>{n.title}</text>
            {n.subtitle && <text x={n.x + n.w / 2} y={n.y + n.h / 2 + 12} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10, pointerEvents: 'none' }}>{n.subtitle}</text>}
          </g>
        ))}

        <text x="300" y="365" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10, fontStyle: 'italic' }}>The difference is not the AI model — it is the guardrails around it.</text>
      </svg>
      <DiagramTooltip viewBoxW={600} viewBoxH={380} active={activeNode} svgRef={svgRef} onClose={hideNode} />
    </div>
  )
}
