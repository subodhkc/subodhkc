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
  { id: 'ef-complaint', x: 60, y: 40, w: 150, h: 60, title: 'Consumer Complaint', subtitle: 'Filed with AG', fill: 'url(#ef-grad)', stroke: 'hsl(var(--primary) / 0.2)', details: ['Consumer files complaint with Texas AG', 'Complaint triggers investigation process', 'AG office reviews and triages'] },
  { id: 'ef-investigation', x: 220, y: 40, w: 150, h: 60, title: 'AG Investigation', subtitle: 'Review and triage', fill: 'url(#ef-grad)', stroke: 'hsl(var(--primary) / 0.2)', details: ['AG reviews complaint details', 'Determines if TRAIGA violation is likely', 'May request system documentation'] },
  { id: 'ef-cid', x: 400, y: 40, w: 150, h: 60, title: 'Civil Investigative Demand', subtitle: 'System documentation', fill: 'url(#ef-grad)', stroke: 'hsl(var(--primary) / 0.2)', details: ['AG issues Civil Investigative Demand (CID)', 'Requests AI system documentation and evidence', 'Business must respond within specified timeframe'] },
  { id: 'ef-notice', x: 600, y: 40, w: 150, h: 60, title: 'Written Notice', subtitle: 'Alleged violation identified', fill: 'url(#ef-grad)', stroke: 'hsl(var(--primary) / 0.2)', details: ['AG sends written notice of alleged violation', 'Notice identifies specific TRAIGA provision violated', 'Starts the 60-day cure period clock'] },
  { id: 'ef-cure', x: 220, y: 180, w: 150, h: 60, title: '60-Day Cure Period', subtitle: 'Business may remedy', fill: 'url(#ef-grad-highlight)', stroke: 'hsl(var(--accent) / 0.3)', details: ['Business has 60 days to cure the violation', 'Must provide written cure documentation', 'This is the key protection for businesses'] },
  { id: 'ef-cure-doc', x: 400, y: 180, w: 150, h: 60, title: 'Cure Documentation', subtitle: 'Written statement + evidence', fill: 'url(#ef-grad)', stroke: 'hsl(var(--primary) / 0.2)', details: ['Business submits written cure statement', 'Includes evidence of remediation steps taken', 'AG reviews cure documentation'] },
  { id: 'ef-closure', x: 580, y: 180, w: 150, h: 60, title: 'Closure', subtitle: 'No enforcement action', fill: 'url(#ef-grad-positive)', stroke: 'hsl(142 70% 40% / 0.3)', details: ['AG accepts cure documentation', 'Case closed — no enforcement action', 'Business remains on file for future reference'] },
  { id: 'ef-enforcement', x: 580, y: 300, w: 150, h: 60, title: 'Enforcement Action', subtitle: 'Penalties, injunction, fees', fill: 'url(#ef-grad-negative)', stroke: 'hsl(0 70% 50% / 0.3)', details: ['Cure failed or insufficient', 'AG brings enforcement action', 'Penalties: civil fines, injunction, attorney fees'] },
]

export function TRAIGAEnforcementFlow() {
  const svgRef = useRef<SVGSVGElement>(null)
  const { activeNode, showNode, hideNode, toggleNode } = useDiagramTooltip()

  return (
    <div className="my-8 w-full overflow-x-auto" style={{ position: 'relative' }}>
      <svg ref={svgRef} viewBox="0 0 760 380" className="w-full min-w-[650px] h-auto" role="img" aria-label="TRAIGA enforcement process showing the flow from consumer complaint through AG investigation, civil investigative demand, written notice, 60-day cure period, and either closure or enforcement action">
        <title>TRAIGA Enforcement Process</title>
        <defs>
          <linearGradient id="ef-grad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="hsl(var(--primary) / 0.12)" /><stop offset="100%" stopColor="hsl(var(--primary) / 0.03)" /></linearGradient>
          <linearGradient id="ef-grad-highlight" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="hsl(var(--accent) / 0.15)" /><stop offset="100%" stopColor="hsl(var(--accent) / 0.05)" /></linearGradient>
          <linearGradient id="ef-grad-positive" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="hsl(142 70% 40% / 0.12)" /><stop offset="100%" stopColor="hsl(142 70% 40% / 0.03)" /></linearGradient>
          <linearGradient id="ef-grad-negative" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="hsl(0 70% 50% / 0.12)" /><stop offset="100%" stopColor="hsl(0 70% 50% / 0.03)" /></linearGradient>
          <marker id="ef-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground) / 0.5)" /></marker>
          <marker id="ef-arrow-positive" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="hsl(142 70% 40% / 0.6)" /></marker>
          <marker id="ef-arrow-negative" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="hsl(0 70% 50% / 0.6)" /></marker>
        </defs>

        {/* Arrows */}
        <line x1="170" y1="70" x2="220" y2="70" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#ef-arrow)" />
        <line x1="350" y1="70" x2="400" y2="70" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#ef-arrow)" />
        <line x1="550" y1="70" x2="600" y2="70" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#ef-arrow)" />
        <line x1="660" y1="90" x2="660" y2="140" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="660" y1="140" x2="300" y2="140" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="300" y1="140" x2="300" y2="180" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#ef-arrow)" />
        <line x1="350" y1="210" x2="400" y2="210" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#ef-arrow)" />
        <line x1="530" y1="210" x2="580" y2="210" stroke="hsl(142 70% 40% / 0.5)" strokeWidth="1.5" markerEnd="url(#ef-arrow-positive)" />
        <line x1="465" y1="230" x2="465" y2="300" stroke="hsl(0 70% 50% / 0.4)" strokeWidth="1.5" strokeDasharray="4 2" />
        <line x1="465" y1="300" x2="580" y2="300" stroke="hsl(0 70% 50% / 0.4)" strokeWidth="1.5" markerEnd="url(#ef-arrow-negative)" />
        <text x="470" y="270" className="fill-muted-foreground" style={{ fontSize: 9, fontWeight: 600 }}>Cure failed</text>

        {/* Interactive nodes */}
        {nodes.map((n) => (
          <g key={n.id} {...nodeHandlers(n, showNode, hideNode, toggleNode)} data-active={activeNode?.id === n.id ? 'true' : undefined}>
            <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="10" fill={n.fill ?? 'hsl(var(--background))'} stroke={n.stroke ?? 'hsl(var(--primary) / 0.2)'} strokeWidth="1.5" />
            <text x={n.x + n.w / 2} y={n.y + 25} textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 700, pointerEvents: 'none' }}>{n.title}</text>
            {n.subtitle && <text x={n.x + n.w / 2} y={n.y + 44} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9, pointerEvents: 'none' }}>{n.subtitle}</text>}
          </g>
        ))}

        <text x="60" y="360" className="fill-muted-foreground" style={{ fontSize: 10, fontStyle: 'italic' }}>
          The AG must generally give written notice and wait 60 days before bringing an enforcement action.
        </text>
      </svg>
      <DiagramTooltip viewBoxW={760} viewBoxH={380} active={activeNode} svgRef={svgRef} onClose={hideNode} />
    </div>
  )
}
