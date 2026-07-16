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

const nodes: NodeDef[] = [
  { id: 'nist-govern', x: 20, y: 20, w: 350, h: 190, title: 'Govern', subtitle: 'Accountability & policy', fill: 'url(#nl-grad-primary)', stroke: 'hsl(var(--primary) / 0.2)', details: ['Assign an AI owner — one person accountable', 'Approve acceptable uses explicitly', 'Define prohibited data and actions', 'Maintain vendor and system records'] },
  { id: 'nist-map', x: 400, y: 20, w: 350, h: 190, title: 'Map', subtitle: 'Context & risk identification', fill: 'url(#nl-grad-accent)', stroke: 'hsl(var(--accent) / 0.2)', details: ['Identify users and affected people', 'Understand the business context', 'Classify data by sensitivity', 'Identify possible harm and legal overlap'] },
  { id: 'nist-measure', x: 20, y: 220, w: 350, h: 190, title: 'Measure', subtitle: 'Test & evaluate', fill: 'url(#nl-grad-accent)', stroke: 'hsl(var(--accent) / 0.2)', details: ['Test accuracy on representative data', 'Test harmful prompts and jailbreaks', 'Review discrimination and bias', 'Test security and access controls', 'Record known limitations'] },
  { id: 'nist-manage', x: 400, y: 220, w: 350, h: 190, title: 'Manage', subtitle: 'Controls & response', fill: 'url(#nl-grad-primary)', stroke: 'hsl(var(--primary) / 0.2)', details: ['Add controls based on measured risk', 'Require approval where needed', 'Monitor incidents and respond', 'Correct failures promptly', 'Retire unsafe or obsolete systems'] },
]

export function NISTLiteFramework() {
  const svgRef = useRef<SVGSVGElement>(null)
  const { activeNode, showNode, hideNode, toggleNode } = useDiagramTooltip()

  return (
    <div className="my-8 w-full overflow-x-auto" style={{ position: 'relative' }}>
      <svg ref={svgRef} viewBox="0 0 780 460" className="w-full min-w-[650px] h-auto" role="img" aria-label="NIST AI Risk Management Framework lite approach for small businesses: four functions — Govern, Map, Measure, and Manage — each with practical activities">
        <title>NIST-Lite Framework for Small Businesses</title>
        <defs>
          <linearGradient id="nl-grad-primary" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="hsl(var(--primary) / 0.12)" /><stop offset="100%" stopColor="hsl(var(--primary) / 0.03)" /></linearGradient>
          <linearGradient id="nl-grad-accent" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="hsl(var(--accent) / 0.12)" /><stop offset="100%" stopColor="hsl(var(--accent) / 0.03)" /></linearGradient>
        </defs>

        <text x="390" y="225" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>NIST AI RMF</text>
        <text x="390" y="242" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>Small-Business Lite</text>
        <line x1="390" y1="20" x2="390" y2="440" stroke="hsl(var(--border) / 0.5)" strokeWidth="1" strokeDasharray="4 3" />
        <line x1="20" y1="220" x2="760" y2="220" stroke="hsl(var(--border) / 0.5)" strokeWidth="1" strokeDasharray="4 3" />

        {/* Interactive nodes */}
        {nodes.map((n) => (
          <g key={n.id} {...nodeHandlers(n, showNode, hideNode, toggleNode)} data-active={activeNode?.id === n.id ? 'true' : undefined}>
            <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="12" fill={n.fill ?? 'hsl(var(--background))'} stroke={n.stroke ?? 'hsl(var(--primary) / 0.2)'} strokeWidth="1.5" />
            <text x={n.x + n.w / 2} y={n.y + 30} textAnchor="middle" className="fill-foreground" style={{ fontSize: 14, fontWeight: 700, pointerEvents: 'none' }}>{n.title}</text>
            {n.subtitle && <text x={n.x + n.w / 2} y={n.y + 48} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10, pointerEvents: 'none' }}>{n.subtitle}</text>}
          </g>
        ))}

        <text x="390" y="445" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10, fontStyle: 'italic' }}>
          A small company does not need to imitate a Fortune 100 governance office — it needs deliberate ownership and reasonable controls.
        </text>
      </svg>
      <DiagramTooltip viewBoxW={780} viewBoxH={460} active={activeNode} svgRef={svgRef} onClose={hideNode} />
    </div>
  )
}
