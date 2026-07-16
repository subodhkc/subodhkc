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
  { id: 'fdt-root', x: 300, y: 16, w: 260, h: 50, title: 'Internal or public-facing?', subtitle: 'Determines UX and scaling needs', fill: 'url(#fdt-grad-q)', stroke: 'hsl(var(--primary) / 0.3)', details: ['Root decision: who is the audience?', 'Internal: simpler auth, smaller scale, faster dev', 'Public: custom UX, branding, horizontal scaling'] },
  { id: 'fdt-data-model', x: 60, y: 110, w: 240, h: 50, title: 'Data-heavy or model-centric?', subtitle: 'Broad workflow vs focused AI', fill: 'url(#fdt-grad-q)', stroke: 'hsl(var(--primary) / 0.3)', details: ['Data-heavy: dashboards, tables, charts, forms', 'Model-centric: chat, inference, multimodal', 'Determines framework complexity needs'] },
  { id: 'fdt-nextjs', x: 560, y: 110, w: 240, h: 50, title: 'Next.js + FastAPI', subtitle: 'Custom UX, branding, scaling', fill: 'url(#fdt-grad-leaf)', stroke: 'hsl(var(--accent) / 0.3)', details: ['Full-stack framework for public-facing apps', 'Custom UX, branding, SEO, horizontal scaling', 'FastAPI backend for AI services', 'Most flexible but highest dev cost'] },
  { id: 'fdt-analytics', x: 10, y: 204, w: 160, h: 50, title: 'Analytics focus?', subtitle: 'Dashboards, plots', fill: 'url(#fdt-grad-q)', stroke: 'hsl(var(--primary) / 0.3)', details: ['Is the primary use case analytics dashboards?', 'Dash: Plotly integration, callbacks', 'Streamlit: simpler but less control'] },
  { id: 'fdt-gradio', x: 220, y: 204, w: 120, h: 50, title: 'Gradio', subtitle: 'ChatInterface, multimodal', fill: 'url(#fdt-grad-leaf)', stroke: 'hsl(var(--accent) / 0.3)', details: ['Best for model-centric demos and tools', 'ChatInterface for conversational AI', 'Multimodal support: image, audio, video', 'Fastest path from model to UI'] },
  { id: 'fdt-dash', x: 5, y: 298, w: 90, h: 50, title: 'Dash', subtitle: 'Plotly, callbacks', fill: 'url(#fdt-grad-leaf)', stroke: 'hsl(var(--accent) / 0.3)', details: ['Plotly-based analytics dashboards', 'Callback system for interactivity', 'Best for data-heavy analytics apps'] },
  { id: 'fdt-event-driven', x: 100, y: 298, w: 120, h: 50, title: 'Event-driven?', subtitle: 'vs script rerun', fill: 'url(#fdt-grad-q)', stroke: 'hsl(var(--primary) / 0.3)', details: ['Does the app need event-driven architecture?', 'Yes: NiceGUI for reactive UI', 'No: Streamlit for script-rerun pattern'] },
  { id: 'fdt-nicegui', x: 75, y: 392, w: 90, h: 50, title: 'NiceGUI', subtitle: 'Event-driven', fill: 'url(#fdt-grad-leaf)', stroke: 'hsl(var(--accent) / 0.3)', details: ['Event-driven Python UI framework', 'Reactive components without page reload', 'Best for real-time or interactive apps'] },
  { id: 'fdt-full-product', x: 180, y: 392, w: 120, h: 50, title: 'Full product?', subtitle: 'Polished app', fill: 'url(#fdt-grad-q)', stroke: 'hsl(var(--primary) / 0.3)', details: ['Is this a polished product or a tool?', 'Yes: Reflex for full-stack Python', 'No: Streamlit for rapid internal tools'] },
  { id: 'fdt-reflex', x: 155, y: 486, w: 90, h: 50, title: 'Reflex', subtitle: 'Full-stack Python', fill: 'url(#fdt-grad-leaf)', stroke: 'hsl(var(--accent) / 0.3)', details: ['Full-stack Python framework', 'Compiles to Next.js frontend', 'Best for polished products in pure Python'] },
  { id: 'fdt-streamlit', x: 235, y: 486, w: 90, h: 50, title: 'Streamlit', subtitle: 'Forms, chat, data', fill: 'url(#fdt-grad-leaf)', stroke: 'hsl(var(--accent) / 0.3)', details: ['Script-rerun pattern — simplest mental model', 'Forms, chat, data tables, charts', 'Best for internal tools and prototypes', 'Largest community and ecosystem'] },
  { id: 'fdt-panel', x: 340, y: 298, w: 90, h: 50, title: 'Panel', subtitle: 'PyData, notebooks', fill: 'url(#fdt-grad-leaf)', stroke: 'hsl(var(--accent) / 0.3)', details: ['PyData ecosystem integration', 'Works with Jupyter notebooks', 'Best for data science teams'] },
  { id: 'fdt-mcp-server', x: 460, y: 204, w: 160, h: 50, title: 'MCP Server', subtitle: 'Shared tools across apps', fill: 'hsl(var(--primary) / 0.08)', stroke: 'hsl(var(--primary) / 0.3)', details: ['Model Context Protocol server', 'Shared tool access across multiple apps', 'Standardized interface for enterprise tools'] },
]

export function FrameworkDecisionTree() {
  const svgRef = useRef<SVGSVGElement>(null)
  const { activeNode, showNode, hideNode, toggleNode } = useDiagramTooltip()

  return (
    <div className="my-8 w-full overflow-x-auto" style={{ position: 'relative' }}>
      <svg ref={svgRef} viewBox="0 0 860 560" className="w-full min-w-[700px] h-auto" role="img" aria-label="Decision tree for choosing a Python AI application framework: internal vs public, data-heavy vs model-centric, analytics vs general, leading to Streamlit, Gradio, Dash, Panel, NiceGUI, Reflex, or Next.js plus FastAPI">
        <title>Framework Selection Decision Tree</title>
        <defs>
          <linearGradient id="fdt-grad-q" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="hsl(var(--primary) / 0.12)" /><stop offset="100%" stopColor="hsl(var(--primary) / 0.03)" /></linearGradient>
          <linearGradient id="fdt-grad-leaf" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="hsl(var(--accent) / 0.10)" /><stop offset="100%" stopColor="hsl(var(--accent) / 0.03)" /></linearGradient>
          <marker id="fdt-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground) / 0.5)" /></marker>
          <marker id="fdt-arrow-yes" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--primary) / 0.6)" /></marker>
        </defs>

        {/* Branch lines */}
        <line x1="430" y1="66" x2="430" y2="86" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="180" y1="86" x2="680" y2="86" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="180" y1="86" x2="180" y2="106" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1.5" markerEnd="url(#fdt-arrow-yes)" />
        <line x1="680" y1="86" x2="680" y2="106" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#fdt-arrow)" />
        <text x="230" y="82" className="fill-muted-foreground" style={{ fontSize: 10, fontWeight: 600 }}>Internal</text>
        <text x="620" y="82" className="fill-muted-foreground" style={{ fontSize: 10, fontWeight: 600 }}>Public / customer-facing</text>
        <line x1="180" y1="160" x2="180" y2="180" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="80" y1="180" x2="280" y2="180" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="80" y1="180" x2="80" y2="200" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1.5" markerEnd="url(#fdt-arrow-yes)" />
        <line x1="280" y1="180" x2="280" y2="200" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#fdt-arrow)" />
        <text x="110" y="176" className="fill-muted-foreground" style={{ fontSize: 10, fontWeight: 600 }}>Data-heavy</text>
        <text x="230" y="176" className="fill-muted-foreground" style={{ fontSize: 10, fontWeight: 600 }}>Model-centric</text>
        <line x1="90" y1="254" x2="90" y2="274" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="40" y1="274" x2="140" y2="274" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="40" y1="274" x2="40" y2="294" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1.5" markerEnd="url(#fdt-arrow-yes)" />
        <line x1="140" y1="274" x2="140" y2="294" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#fdt-arrow)" />
        <text x="45" y="270" className="fill-muted-foreground" style={{ fontSize: 9, fontWeight: 600 }}>Yes</text>
        <text x="120" y="270" className="fill-muted-foreground" style={{ fontSize: 9, fontWeight: 600 }}>No</text>
        <line x1="160" y1="348" x2="160" y2="368" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="120" y1="368" x2="200" y2="368" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="120" y1="368" x2="120" y2="388" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1.5" markerEnd="url(#fdt-arrow-yes)" />
        <line x1="200" y1="368" x2="200" y2="388" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#fdt-arrow)" />
        <text x="125" y="364" className="fill-muted-foreground" style={{ fontSize: 9, fontWeight: 600 }}>Yes</text>
        <text x="175" y="364" className="fill-muted-foreground" style={{ fontSize: 9, fontWeight: 600 }}>No</text>
        <line x1="240" y1="442" x2="240" y2="462" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="200" y1="462" x2="280" y2="462" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="200" y1="462" x2="200" y2="482" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1.5" markerEnd="url(#fdt-arrow-yes)" />
        <line x1="280" y1="462" x2="280" y2="482" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#fdt-arrow)" />
        <text x="205" y="458" className="fill-muted-foreground" style={{ fontSize: 9, fontWeight: 600 }}>Yes</text>
        <text x="255" y="458" className="fill-muted-foreground" style={{ fontSize: 9, fontWeight: 600 }}>No</text>
        <line x1="140" y1="274" x2="385" y2="274" stroke="hsl(var(--muted-foreground) / 0.3)" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="385" y1="274" x2="385" y2="298" stroke="hsl(var(--muted-foreground) / 0.3)" strokeWidth="1" strokeDasharray="3 2" markerEnd="url(#fdt-arrow)" />
        <text x="360" y="270" className="fill-muted-foreground" style={{ fontSize: 9 }}>PyData team?</text>
        <line x1="430" y1="86" x2="540" y2="86" stroke="hsl(var(--muted-foreground) / 0.3)" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="540" y1="86" x2="540" y2="204" stroke="hsl(var(--muted-foreground) / 0.3)" strokeWidth="1" strokeDasharray="3 2" markerEnd="url(#fdt-arrow)" />
        <text x="545" y="100" className="fill-muted-foreground" style={{ fontSize: 9 }}>Reuse needed?</text>

        {/* Interactive nodes */}
        {nodes.map((n) => (
          <g key={n.id} {...nodeHandlers(n, showNode, hideNode, toggleNode)} data-active={activeNode?.id === n.id ? 'true' : undefined}>
            <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="8" fill={n.fill ?? 'hsl(var(--background))'} stroke={n.stroke ?? 'hsl(var(--primary) / 0.25)'} strokeWidth="1.5" />
            <text x={n.x + n.w / 2} y={n.y + n.h / 2 - 4} textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 700, pointerEvents: 'none' }}>{n.title}</text>
            {n.subtitle && <text x={n.x + n.w / 2} y={n.y + n.h / 2 + 10} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10, pointerEvents: 'none' }}>{n.subtitle}</text>}
          </g>
        ))}
      </svg>
      <DiagramTooltip viewBoxW={860} viewBoxH={560} active={activeNode} svgRef={svgRef} onClose={hideNode} />
    </div>
  )
}
