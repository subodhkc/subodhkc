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
  { id: 'mp-dev-api', x: 30, y: 40, w: 130, h: 80, title: 'Developer Voice API', subtitle: 'Max flexibility · Buyer builds all', fill: 'url(#mp-approach)', stroke: 'hsl(var(--muted-foreground) / 0.2)', details: ['Vapi, Retell SDK', 'Maximum flexibility — buyer builds everything', 'No hosted runtime, no orchestration', 'Best for teams with deep voice AI expertise'] },
  { id: 'mp-visual-builder', x: 175, y: 40, w: 130, h: 80, title: 'Visual No-Code Builder', subtitle: 'Fast flow design · Buyer maintains', fill: 'url(#mp-approach)', stroke: 'hsl(var(--muted-foreground) / 0.2)', details: ['Synthflow and similar', 'Drag-and-drop flow design', 'Buyer must maintain and update flows', 'No RAG, guardrails, or evidence pipeline'] },
  { id: 'mp-fixed-receptionist', x: 320, y: 40, w: 130, h: 80, title: 'Fixed AI Receptionist', subtitle: 'Simple package · Limited control', fill: 'url(#mp-approach)', stroke: 'hsl(var(--muted-foreground) / 0.2)', details: ['Answering services with AI', 'Simple package with limited configuration', 'No custom orchestration or tools', 'Best for very simple call handling'] },
  { id: 'mp-contact-center', x: 465, y: 40, w: 130, h: 80, title: 'Contact-Center Platform', subtitle: 'Scale & QA · Enterprise program', fill: 'url(#mp-approach)', stroke: 'hsl(var(--muted-foreground) / 0.2)', details: ['Retell and others', 'Scale and QA capabilities', 'Enterprise implementation program', 'Large budget and long deployment cycle'] },
  { id: 'mp-managed-enterprise', x: 610, y: 40, w: 130, h: 80, title: 'Managed Enterprise', subtitle: 'End-to-end delivery · Large budget', fill: 'url(#mp-approach)', stroke: 'hsl(var(--muted-foreground) / 0.2)', details: ['Bland, FDEs', 'End-to-end delivery and management', 'Largest budget requirement', 'Best for enterprises wanting full outsourcing'] },
  { id: 'mp-kestrel', x: 175, y: 150, w: 430, h: 100, title: 'Kestrel Voice', subtitle: 'No-code launch + hosted runtime + custom orchestration', fill: 'url(#mp-kestrel)', stroke: 'hsl(var(--primary) / 0.4)', details: ['No-code launch + hosted runtime + custom orchestration', 'RAG + guardrails + dashboards + supported customization', 'Spans from self-service to managed', 'Buyer responsibility: business configuration + ongoing review'] },
]

export function KestrelMarketPositionDiagram() {
  const svgRef = useRef<SVGSVGElement>(null)
  const { activeNode, showNode, hideNode, toggleNode } = useDiagramTooltip()

  return (
    <div className="my-8 w-full overflow-x-auto" style={{ position: 'relative' }}>
      <svg ref={svgRef} viewBox="0 0 800 460" className="w-full min-w-[600px] h-auto" role="img" aria-label="Voice-AI market positioning diagram showing five approaches and where Kestrel Voice sits between no-code setup and custom orchestration">
        <title>Kestrel Voice Market Position</title>
        <defs>
          <linearGradient id="mp-kestrel" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="hsl(var(--primary) / 0.25)" /><stop offset="100%" stopColor="hsl(var(--primary) / 0.08)" /></linearGradient>
          <linearGradient id="mp-approach" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="hsl(var(--muted) / 0.4)" /><stop offset="100%" stopColor="hsl(var(--muted) / 0.1)" /></linearGradient>
        </defs>

        <text x="400" y="22" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Voice-AI Market Spectrum</text>

        {/* Connecting lines */}
        <line x1="95" y1="120" x2="175" y2="150" stroke="hsl(var(--muted-foreground) / 0.2)" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="240" y1="120" x2="240" y2="150" stroke="hsl(var(--muted-foreground) / 0.2)" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="385" y1="120" x2="390" y2="150" stroke="hsl(var(--muted-foreground) / 0.2)" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="530" y1="120" x2="530" y2="150" stroke="hsl(var(--muted-foreground) / 0.2)" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="675" y1="120" x2="605" y2="150" stroke="hsl(var(--muted-foreground) / 0.2)" strokeWidth="1" strokeDasharray="3 2" />

        {/* Interactive nodes */}
        {nodes.map((n) => (
          <g key={n.id} {...nodeHandlers(n, showNode, hideNode, toggleNode)} data-active={activeNode?.id === n.id ? 'true' : undefined}>
            <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="8" fill={n.fill ?? 'hsl(var(--background))'} stroke={n.stroke ?? 'hsl(var(--primary) / 0.3)'} strokeWidth="1.5" />
            <text x={n.x + n.w / 2} y={n.y + n.h / 2 - 8} textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 700, pointerEvents: 'none' }}>{n.title}</text>
            {n.subtitle && <text x={n.x + n.w / 2} y={n.y + n.h / 2 + 8} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10, pointerEvents: 'none' }}>{n.subtitle}</text>}
          </g>
        ))}

        <text x="390" y="236" textAnchor="middle" className="fill-primary" style={{ fontSize: 9, fontWeight: 600 }}>Self-Service → Supported → Custom → Managed</text>

        {/* Buyer responsibility spectrum */}
        <text x="400" y="280" textAnchor="middle" className="fill-foreground" style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Buyer Responsibility</text>
        <rect x="30" y="295" width="710" height="24" rx="4" fill="hsl(var(--muted) / 0.3)" />
        <rect x="30" y="295" width="710" height="24" rx="4" fill="none" stroke="hsl(var(--border))" strokeWidth="1" />
        <text x="95" y="311" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 8 }}>Architecture, workflow, UI, ops</text>
        <text x="240" y="311" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 8 }}>Design &amp; maintain flows</text>
        <text x="385" y="311" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 8 }}>Limited configuration</text>
        <text x="530" y="311" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 8 }}>Implementation program</text>
        <text x="675" y="311" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 8 }}>Budget &amp; cycle</text>

        <rect x="175" y="330" width="430" height="24" rx="4" fill="hsl(var(--primary) / 0.1)" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1" />
        <text x="390" y="346" textAnchor="middle" className="fill-primary" style={{ fontSize: 9, fontWeight: 600 }}>Business configuration + ongoing review</text>

        <text x="95" y="380" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>Vapi, Retell SDK</text>
        <text x="240" y="380" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>Synthflow</text>
        <text x="385" y="380" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>Answering services</text>
        <text x="530" y="380" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>Retell, others</text>
        <text x="675" y="380" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>Bland, FDEs</text>

        <rect x="100" y="400" width="600" height="44" rx="8" fill="hsl(var(--primary) / 0.05)" stroke="hsl(var(--primary) / 0.15)" strokeWidth="1" />
        <text x="400" y="420" textAnchor="middle" className="fill-foreground" style={{ fontSize: 10, fontWeight: 600 }}>Kestrel's differentiation is not one isolated feature.</text>
        <text x="400" y="436" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>It is the combination: fast setup + hosted infra + orchestration + controls + evidence + support</text>
      </svg>
      <DiagramTooltip viewBoxW={800} viewBoxH={460} active={activeNode} svgRef={svgRef} onClose={hideNode} />
    </div>
  )
}
