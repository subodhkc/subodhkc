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
  { id: 'ks-layer1', x: 40, y: 40, w: 520, h: 80, title: '1. Direct Configuration', subtitle: 'Hours · Service areas · Transfer numbers', fill: 'url(#ks-layer1)', stroke: 'hsl(var(--primary) / 0.2)', details: ['Hours, service areas, transfer numbers', 'Business identity and appointment settings', 'Best for: stable facts the business owner already knows', 'Highest priority — overrides all other sources'] },
  { id: 'ks-layer2', x: 40, y: 135, w: 520, h: 80, title: '2. Approved FAQs', subtitle: 'Common questions with stable answers', fill: 'url(#ks-layer2)', stroke: 'hsl(var(--accent) / 0.2)', details: ['Common questions with pre-written answers', 'Tenant-configured, not auto-generated', 'Best for: predictable Q&A already answered many times', 'Second priority after direct config'] },
  { id: 'ks-layer3', x: 40, y: 230, w: 520, h: 80, title: '3. RAG & Website Knowledge', subtitle: 'Tenant-scoped sources · Vector retrieval', fill: 'url(#ks-layer3)', stroke: 'hsl(var(--primary) / 0.2)', details: ['Tenant-scoped sources with chunks and embeddings', 'Vector retrieval with refresh tracking and content hashes', 'Best for: broader information from websites and documents', 'Must be managed — not uploaded once and forgotten'] },
  { id: 'ks-layer4', x: 40, y: 325, w: 520, h: 80, title: '4. Live Business Tools', subtitle: 'Appointment availability · Customer status', fill: 'url(#ks-layer4)', stroke: 'hsl(var(--accent) / 0.2)', details: ['Appointment availability and booking results', 'Customer status and current business records', 'Best for: changing information checked at call time', 'Never cached — always live query'] },
  { id: 'ks-lifecycle', x: 600, y: 40, w: 160, h: 365, title: 'Lifecycle', subtitle: 'Source → Refresh → Replace', fill: 'hsl(var(--muted) / 0.15)', stroke: 'hsl(var(--border))', details: ['Approved Source → Ingestion → Retrieval → Review → Refresh → Replace/Delete', 'Each stage has explicit ownership and audit', 'Content hashes detect changes automatically'] },
]

export function KestrelKnowledgeStackDiagram() {
  const svgRef = useRef<SVGSVGElement>(null)
  const { activeNode, showNode, hideNode, toggleNode } = useDiagramTooltip()

  return (
    <div className="my-8 w-full overflow-x-auto" style={{ position: 'relative' }}>
      <svg ref={svgRef} viewBox="0 0 800 520" className="w-full min-w-[600px] h-auto" role="img" aria-label="Kestrel Voice knowledge stack showing four layers: direct configuration, approved FAQs, RAG and website knowledge, and live business tools, with a knowledge lifecycle arrow">
        <title>Kestrel Voice Knowledge Stack</title>
        <defs>
          <linearGradient id="ks-layer1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="hsl(var(--primary) / 0.15)" /><stop offset="100%" stopColor="hsl(var(--primary) / 0.05)" /></linearGradient>
          <linearGradient id="ks-layer2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="hsl(var(--accent) / 0.15)" /><stop offset="100%" stopColor="hsl(var(--accent) / 0.05)" /></linearGradient>
          <linearGradient id="ks-layer3" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="hsl(var(--primary) / 0.12)" /><stop offset="100%" stopColor="hsl(var(--primary) / 0.03)" /></linearGradient>
          <linearGradient id="ks-layer4" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="hsl(var(--accent) / 0.12)" /><stop offset="100%" stopColor="hsl(var(--accent) / 0.03)" /></linearGradient>
          <marker id="ks-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground) / 0.6)" /></marker>
        </defs>

        <text x="400" y="22" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Knowledge Stack — Four Layers</text>

        <line x1="560" y1="200" x2="600" y2="200" stroke="hsl(var(--muted-foreground) / 0.3)" strokeWidth="1.5" strokeDasharray="4 2" markerEnd="url(#ks-arrow)" />

        {/* Interactive nodes */}
        {nodes.map((n) => (
          <g key={n.id} {...nodeHandlers(n, showNode, hideNode, toggleNode)} data-active={activeNode?.id === n.id ? 'true' : undefined}>
            <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="10" fill={n.fill ?? 'hsl(var(--background))'} stroke={n.stroke ?? 'hsl(var(--primary) / 0.2)'} strokeWidth="1.5" />
            <text x={n.x + n.w / 2} y={n.y + n.h / 2 - 4} textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 700, pointerEvents: 'none' }}>{n.title}</text>
            {n.subtitle && <text x={n.x + n.w / 2} y={n.y + n.h / 2 + 12} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10, pointerEvents: 'none' }}>{n.subtitle}</text>}
          </g>
        ))}

        <rect x="40" y="430" width="720" height="70" rx="8" fill="hsl(var(--primary) / 0.05)" stroke="hsl(var(--primary) / 0.15)" strokeWidth="1" />
        <text x="400" y="452" textAnchor="middle" className="fill-foreground" style={{ fontSize: 10, fontWeight: 600 }}>RAG does not automatically make an answer accurate.</text>
        <text x="400" y="470" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>If a website contains an outdated service area, the AI can accurately retrieve the wrong information.</text>
        <text x="400" y="486" textAnchor="middle" className="fill-primary" style={{ fontSize: 9, fontWeight: 600 }}>Knowledge must be managed — not uploaded once and forgotten.</text>
      </svg>
      <DiagramTooltip viewBoxW={800} viewBoxH={520} active={activeNode} svgRef={svgRef} onClose={hideNode} />
    </div>
  )
}
