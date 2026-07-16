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
  { id: 'mcp-streamlit-ui', x: 50, y: 60, w: 140, h: 50, title: 'Streamlit UI', subtitle: 'Chat, forms, tables', details: ['User-facing interface built with Streamlit', 'Chat, forms, tables, and approval screens', 'Session state for per-user continuity'] },
  { id: 'mcp-language-model', x: 220, y: 60, w: 140, h: 50, title: 'Language Model', subtitle: 'OpenAI / other provider', fill: 'hsl(var(--primary) / 0.1)', stroke: 'hsl(var(--primary) / 0.4)', details: ['LLM owned by the host application', 'OpenAI, Anthropic, or other provider', 'Model-independent from MCP server'] },
  { id: 'mcp-auth', x: 50, y: 130, w: 140, h: 50, title: 'Auth & Authorization', subtitle: 'User identity, roles, RLS', details: ['User identity propagated from auth provider', 'Role-based access control', 'Row-Level Security enforced at data layer'] },
  { id: 'mcp-client', x: 220, y: 130, w: 140, h: 50, title: 'MCP Client', subtitle: 'Discovers capabilities', fill: 'hsl(var(--primary) / 0.1)', stroke: 'hsl(var(--primary) / 0.4)', details: ['Discovers server capabilities via MCP protocol', 'Manages connection lifecycle', 'Routes tool calls to MCP server'] },
  { id: 'mcp-tool-registry', x: 135, y: 210, w: 140, h: 50, title: 'Tool Registry', subtitle: 'Approved functions', details: ['Registry of approved tools and functions', 'Enforces allowlist before execution', 'Audits all tool invocations'] },
  { id: 'mcp-tools', x: 490, y: 100, w: 130, h: 56, title: 'Tools', subtitle: 'Query, create, execute', details: ['Exposed functions: query, create, execute', 'Each tool has input schema and auth requirements', 'Returns structured output to host'] },
  { id: 'mcp-resources', x: 640, y: 100, w: 130, h: 56, title: 'Resources', subtitle: 'Schemas, policies, configs', details: ['Static resources: schemas, policies, configs', 'Read-only data exposed to the model', 'Versioned and tenant-scoped'] },
  { id: 'mcp-prompts', x: 565, y: 180, w: 130, h: 56, title: 'Prompts', subtitle: 'Reusable templates', details: ['Reusable prompt templates', 'Standardized interaction patterns', 'Customizable per tenant or use case'] },
  { id: 'mcp-enterprise-api', x: 490, y: 270, w: 280, h: 50, title: 'Enterprise API', subtitle: 'ServiceNow · Database · Internal service', fill: 'hsl(var(--accent) / 0.1)', stroke: 'hsl(var(--accent) / 0.4)', details: ['Connects to ServiceNow, databases, internal services', 'Translates MCP tool calls to API requests', 'Handles auth, retry, and error mapping'] },
]

export function MCPArchitectureDiagram() {
  const svgRef = useRef<SVGSVGElement>(null)
  const { activeNode, showNode, hideNode, toggleNode } = useDiagramTooltip()

  return (
    <div className="my-8 w-full overflow-x-auto" style={{ position: 'relative' }}>
      <svg ref={svgRef} viewBox="0 0 820 420" className="w-full min-w-[650px] h-auto" role="img" aria-label="MCP architecture showing Host application containing the model and MCP client, connecting to an MCP server which exposes tools, resources, and prompts to an enterprise API">
        <title>MCP Architecture — Host, Client, and Server</title>
        <defs>
          <linearGradient id="mcp-grad-host" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="hsl(var(--primary) / 0.12)" /><stop offset="100%" stopColor="hsl(var(--primary) / 0.03)" /></linearGradient>
          <linearGradient id="mcp-grad-server" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="hsl(var(--accent) / 0.12)" /><stop offset="100%" stopColor="hsl(var(--accent) / 0.03)" /></linearGradient>
          <marker id="mcp-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground) / 0.5)" /></marker>
        </defs>

        <rect x="20" y="20" width="380" height="380" rx="14" fill="url(#mcp-grad-host)" stroke="hsl(var(--primary) / 0.2)" strokeWidth="1.5" strokeDasharray="6 3" />
        <text x="210" y="44" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 700 }}>Host (Your Application)</text>
        <rect x="460" y="60" width="340" height="340" rx="14" fill="url(#mcp-grad-server)" stroke="hsl(var(--accent) / 0.2)" strokeWidth="1.5" strokeDasharray="6 3" />
        <text x="630" y="84" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 700 }}>MCP Server</text>

        <rect x="50" y="290" width="310" height="40" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--muted) / 0.3)" strokeWidth="1" strokeDasharray="4 2" />
        <text x="205" y="315" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Audit Log · Session State · Durable Storage</text>

        <line x1="120" y1="110" x2="120" y2="130" stroke="hsl(var(--muted-foreground) / 0.3)" strokeWidth="1" markerEnd="url(#mcp-arrow)" />
        <line x1="290" y1="110" x2="290" y2="130" stroke="hsl(var(--muted-foreground) / 0.3)" strokeWidth="1" markerEnd="url(#mcp-arrow)" />
        <line x1="190" y1="155" x2="220" y2="155" stroke="hsl(var(--muted-foreground) / 0.3)" strokeWidth="1" markerEnd="url(#mcp-arrow)" />
        <line x1="205" y1="180" x2="205" y2="210" stroke="hsl(var(--muted-foreground) / 0.3)" strokeWidth="1" markerEnd="url(#mcp-arrow)" />
        <line x1="360" y1="155" x2="460" y2="155" stroke="hsl(var(--primary) / 0.5)" strokeWidth="2" markerEnd="url(#mcp-arrow)" />
        <text x="410" y="148" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9, fontWeight: 600 }}>MCP Protocol</text>
        <line x1="630" y1="236" x2="630" y2="270" stroke="hsl(var(--muted-foreground) / 0.3)" strokeWidth="1" markerEnd="url(#mcp-arrow)" />
        <line x1="555" y1="156" x2="555" y2="270" stroke="hsl(var(--muted-foreground) / 0.2)" strokeWidth="1" />
        <line x1="705" y1="156" x2="705" y2="270" stroke="hsl(var(--muted-foreground) / 0.2)" strokeWidth="1" />

        {/* Interactive nodes */}
        {nodes.map((n) => (
          <g key={n.id} {...nodeHandlers(n, showNode, hideNode, toggleNode)} data-active={activeNode?.id === n.id ? 'true' : undefined}>
            <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="8" fill={n.fill ?? 'hsl(var(--background))'} stroke={n.stroke ?? 'hsl(var(--primary) / 0.3)'} strokeWidth="1.5" />
            <text x={n.x + n.w / 2} y={n.y + n.h / 2 - 4} textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600, pointerEvents: 'none' }}>{n.title}</text>
            {n.subtitle && <text x={n.x + n.w / 2} y={n.y + n.h / 2 + 10} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9, pointerEvents: 'none' }}>{n.subtitle}</text>}
          </g>
        ))}

        <text x="630" y="380" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10, fontStyle: 'italic' }}>MCP server is model-independent — the host owns the model</text>
      </svg>
      <DiagramTooltip viewBoxW={820} viewBoxH={420} active={activeNode} svgRef={svgRef} onClose={hideNode} />
    </div>
  )
}
