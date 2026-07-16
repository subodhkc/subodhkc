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

const phases: NodeDef[] = [
  { id: 'dr-0', x: 40, y: 80, w: 100, h: 80, title: '0 · Define', subtitle: 'Business value & decision', details: ['Define the business value and decision the AI will support', 'Identify stakeholders and success criteria', 'Exit: measurable business outcome defined'] },
  { id: 'dr-1', x: 150, y: 80, w: 100, h: 80, title: '1 · Architecture', subtitle: 'Control design & boundaries', details: ['Design control boundaries and security layers', 'Choose frameworks and infrastructure', 'Exit: architecture diagram with security layers approved'] },
  { id: 'dr-2', x: 260, y: 80, w: 100, h: 80, title: '2 · Vertical Slice', subtitle: 'One complete workflow', details: ['Build one complete end-to-end workflow', 'Includes auth, RAG, tools, and audit', 'Exit: one workflow working in a controlled environment'] },
  { id: 'dr-3', x: 370, y: 80, w: 100, h: 80, title: '3 · Production', subtitle: 'Remove prototype shortcuts', details: ['Remove prototype shortcuts and hardcoded values', 'Add monitoring, alerting, and evidence pipeline', 'Exit: production-grade deployment with full controls'] },
  { id: 'dr-4', x: 480, y: 80, w: 100, h: 80, title: '4 · Expand', subtitle: 'RAG, tools & MCP selectively', details: ['Add RAG sources, tools, and MCP connections selectively', 'Each addition goes through security review', 'Exit: expanded capabilities with maintained control posture'] },
  { id: 'dr-5', x: 590, y: 80, w: 100, h: 80, title: '5 · Verify & Pilot', subtitle: 'Real users, realistic conditions', details: ['Test with real users under realistic conditions', 'Measure accuracy, safety, and user satisfaction', 'Exit: pilot results meet success criteria'] },
  { id: 'dr-6', x: 700, y: 80, w: 100, h: 80, title: '6 · Launch & Operate', subtitle: 'Monitor, improve, retire', details: ['Full launch with ongoing monitoring', 'Continuous improvement based on metrics', 'Plan for retirement when system becomes obsolete'] },
]

export function DeliveryRoadmapTimeline() {
  const svgRef = useRef<SVGSVGElement>(null)
  const { activeNode, showNode, hideNode, toggleNode } = useDiagramTooltip()

  return (
    <div className="my-8 w-full overflow-x-auto" style={{ position: 'relative' }}>
      <svg ref={svgRef} viewBox="0 0 840 280" className="w-full min-w-[750px] h-auto" role="img" aria-label="Delivery roadmap timeline with seven phases from Define through Launch and Operate">
        <title>Delivery Roadmap — Seven Phases</title>
        <defs>
          <linearGradient id="dr-grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="hsl(var(--primary) / 0.15)" /><stop offset="100%" stopColor="hsl(var(--accent) / 0.15)" /></linearGradient>
          <marker id="dr-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground) / 0.5)" /></marker>
        </defs>

        <rect x="30" y="120" width="780" height="4" rx="2" fill="url(#dr-grad)" />

        {/* Interactive phase nodes */}
        {phases.map((p, i) => (
          <g key={p.id} {...nodeHandlers(p, showNode, hideNode, toggleNode)} data-active={activeNode?.id === p.id ? 'true' : undefined}>
            <circle cx={p.x + 50} cy={122} r={18} fill="hsl(var(--background))" stroke="hsl(var(--primary) / 0.4)" strokeWidth="2" />
            <text x={p.x + 50} y={127} textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 700, pointerEvents: 'none' }}>{p.title.split(' · ')[0]}</text>
            <text x={p.x + 50} y={162} textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600, pointerEvents: 'none' }}>{p.title.split(' · ')[1]}</text>
            <text x={p.x + 50} y={178} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9, pointerEvents: 'none' }}>{p.subtitle}</text>
            {i < phases.length - 1 && (
              <line x1={p.x + 68} y1={122} x2={p.x + 132} y2={122} stroke="hsl(var(--muted-foreground) / 0.3)" strokeWidth="1" markerEnd="url(#dr-arrow)" />
            )}
          </g>
        ))}

        <rect x="30" y="200" width="780" height="60" rx="8" fill="hsl(var(--primary) / 0.05)" stroke="hsl(var(--primary) / 0.15)" strokeWidth="1" strokeDasharray="4 2" />
        <text x="420" y="222" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>Exit Criteria</text>
        <text x="420" y={240} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Each phase has measurable exit criteria — the application is not &quot;done&quot; until it is operating, controlled and improvable</text>
        <text x="420" y={254} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Business, technical and security owners must accept residual risk before go-live</text>
      </svg>
      <DiagramTooltip viewBoxW={840} viewBoxH={280} active={activeNode} svgRef={svgRef} onClose={hideNode} />
    </div>
  )
}
