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
  { id: 'sa-user', x: 200, y: 40, w: 480, h: 60, title: 'User', subtitle: 'Engineer, analyst, reviewer, administrator', details: ['Roles: engineer, analyst, reviewer, administrator', 'Each role has different tool access and approval rights', 'Identity propagated through all layers for audit'] },
  { id: 'sa-interface', x: 100, y: 124, w: 580, h: 80, title: 'Interface (Streamlit)', subtitle: 'Chat · Forms · File upload · Tables · Charts', fill: 'hsl(var(--accent) / 0.1)', stroke: 'hsl(var(--accent) / 0.3)', details: ['Chat interface for conversational AI interactions', 'Forms for structured input and configuration', 'File upload for document ingestion', 'Tables and charts for data display', 'Approval screens for human-in-the-loop workflows', 'Session State for per-session continuity'] },
  { id: 'sa-logic', x: 100, y: 228, w: 580, h: 80, title: 'Application Logic (Python)', subtitle: 'Workflow · Rules · Validation · Routing', details: ['Workflow steps orchestrate multi-turn interactions', 'Business rules enforce domain constraints', 'Validation on all inputs before AI processing', 'Routing to appropriate tools and models', 'Error handling with graceful degradation', 'Approval requirements and tool authorization'] },
  { id: 'sa-ai-services', x: 100, y: 332, w: 580, h: 80, title: 'AI & Retrieval Services', subtitle: 'LLM · Embeddings · RAG · MCP', fill: 'hsl(var(--accent) / 0.1)', stroke: 'hsl(var(--accent) / 0.3)', details: ['LLM for generation and reasoning', 'Embeddings for semantic search', 'Reranker for precision improvement', 'RAG for grounded responses with citations', 'Function calling for tool execution', 'MCP client for standardized tool access', 'Structured output enforcement', 'Tool registry for approved capabilities'] },
  { id: 'sa-enterprise', x: 100, y: 436, w: 580, h: 80, title: 'Enterprise Systems (Source of Truth)', subtitle: 'PostgreSQL · MongoDB · Databricks · ServiceNow', details: ['PostgreSQL for transactional data', 'MongoDB for document stores', 'Databricks for analytics and ML', 'ServiceNow for IT service management', 'SharePoint for document collaboration', 'Salesforce for CRM', 'Azure DevOps for project management', 'Internal APIs and data warehouses'] },
  { id: 'sa-controls', x: 200, y: 540, w: 480, h: 60, title: 'Controls', subtitle: 'Auth · RLS · Audit · Evidence · Rate limits', fill: 'hsl(var(--primary) / 0.08)', stroke: 'hsl(var(--primary) / 0.3)', details: ['Authentication and authorization', 'Row-Level Security for data access', 'Audit log for all actions and decisions', 'Evidence capture for compliance', 'Rate limits to prevent abuse', 'Human approval for high-impact actions'] },
]

export function StreamlitArchitectureDiagram() {
  const svgRef = useRef<SVGSVGElement>(null)
  const { activeNode, showNode, hideNode, toggleNode } = useDiagramTooltip()

  return (
    <div className="my-8 w-full overflow-x-auto" style={{ position: 'relative' }}>
      <svg ref={svgRef} viewBox="0 0 800 620" className="w-full min-w-[600px] h-auto" role="img" aria-label="Six-layer architecture for internal AI applications: User, Interface, Application Logic, AI and Retrieval Services, Enterprise Systems, and Security/Evidence/Monitoring">
        <title>Internal AI Application Architecture — Six Layers</title>
        <defs>
          <linearGradient id="sa-grad-1" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="hsl(var(--primary) / 0.15)" /><stop offset="100%" stopColor="hsl(var(--primary) / 0.05)" /></linearGradient>
          <linearGradient id="sa-grad-2" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="hsl(var(--accent) / 0.15)" /><stop offset="100%" stopColor="hsl(var(--accent) / 0.05)" /></linearGradient>
          <marker id="sa-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground) / 0.6)" /></marker>
        </defs>

        <rect x="700" y="40" width="50" height="520" rx="8" fill="hsl(var(--primary) / 0.06)" stroke="hsl(var(--primary) / 0.2)" strokeWidth="1" strokeDasharray="4 2" />
        <text x="725" y="300" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10, fontWeight: 600 }} transform="rotate(90, 725, 300)">Security · Evidence · Monitoring</text>

        <line x1="440" y1="100" x2="440" y2="120" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#sa-arrow)" />
        <line x1="390" y1="204" x2="390" y2="224" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#sa-arrow)" />
        <line x1="390" y1="308" x2="390" y2="328" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#sa-arrow)" />
        <line x1="390" y1="412" x2="390" y2="432" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#sa-arrow)" />
        <line x1="390" y1="516" x2="390" y2="536" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#sa-arrow)" />

        {/* Interactive nodes */}
        {nodes.map((n) => (
          <g key={n.id} {...nodeHandlers(n, showNode, hideNode, toggleNode)} data-active={activeNode?.id === n.id ? 'true' : undefined}>
            <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="10" fill={n.fill ?? 'url(#sa-grad-1)'} stroke={n.stroke ?? 'hsl(var(--primary) / 0.2)'} strokeWidth="1.5" />
            <text x={n.x + n.w / 2} y={n.y + n.h / 2 - 4} textAnchor="middle" className="fill-foreground" style={{ fontSize: 13, fontWeight: 700, pointerEvents: 'none' }}>{n.title}</text>
            {n.subtitle && <text x={n.x + n.w / 2} y={n.y + n.h / 2 + 14} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10, pointerEvents: 'none' }}>{n.subtitle}</text>}
          </g>
        ))}
      </svg>
      <DiagramTooltip viewBoxW={800} viewBoxH={620} active={activeNode} svgRef={svgRef} onClose={hideNode} />
    </div>
  )
}
