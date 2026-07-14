export function MCPArchitectureDiagram() {
  return (
    <div className="my-8 w-full overflow-x-auto">
      <svg
        viewBox="0 0 820 420"
        className="w-full min-w-[650px] h-auto"
        role="img"
        aria-label="MCP architecture showing Host application containing the model and MCP client, connecting to an MCP server which exposes tools, resources, and prompts to an enterprise API"
      >
        <title>MCP Architecture — Host, Client, and Server</title>
        <defs>
          <linearGradient id="mcp-grad-host" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0.12)" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.03)" />
          </linearGradient>
          <linearGradient id="mcp-grad-server" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--accent) / 0.12)" />
            <stop offset="100%" stopColor="hsl(var(--accent) / 0.03)" />
          </linearGradient>
          <marker id="mcp-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground) / 0.5)" />
          </marker>
        </defs>

        {/* Host boundary */}
        <rect x="20" y="20" width="380" height="380" rx="14" fill="url(#mcp-grad-host)" stroke="hsl(var(--primary) / 0.2)" strokeWidth="1.5" strokeDasharray="6 3" />
        <text x="210" y="44" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 700 }}>Host (Your Application)</text>

        {/* Streamlit UI */}
        <rect x="50" y="60" width="140" height="50" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1.5" />
        <text x="120" y="82" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>Streamlit UI</text>
        <text x="120" y="98" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>Chat, forms, tables</text>

        {/* OpenAI Model */}
        <rect x="220" y="60" width="140" height="50" rx="8" fill="hsl(var(--primary) / 0.1)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1.5" />
        <text x="290" y="82" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>Language Model</text>
        <text x="290" y="98" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>OpenAI / other provider</text>

        {/* Application Auth */}
        <rect x="50" y="130" width="140" height="50" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1.5" />
        <text x="120" y="152" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>Auth &amp; Authorization</text>
        <text x="120" y="168" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>User identity, roles, RLS</text>

        {/* MCP Client */}
        <rect x="220" y="130" width="140" height="50" rx="8" fill="hsl(var(--primary) / 0.1)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1.5" />
        <text x="290" y="152" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>MCP Client</text>
        <text x="290" y="168" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>Discovers capabilities</text>

        {/* Tool Registry */}
        <rect x="135" y="210" width="140" height="50" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1.5" />
        <text x="205" y="232" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>Tool Registry</text>
        <text x="205" y="248" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>Approved functions</text>

        {/* Audit & State */}
        <rect x="50" y="290" width="310" height="40" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--muted) / 0.3)" strokeWidth="1" strokeDasharray="4 2" />
        <text x="205" y="315" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Audit Log · Session State · Durable Storage</text>

        {/* Connection arrows inside host */}
        <line x1="120" y1="110" x2="120" y2="130" stroke="hsl(var(--muted-foreground) / 0.3)" strokeWidth="1" markerEnd="url(#mcp-arrow)" />
        <line x1="290" y1="110" x2="290" y2="130" stroke="hsl(var(--muted-foreground) / 0.3)" strokeWidth="1" markerEnd="url(#mcp-arrow)" />
        <line x1="190" y1="155" x2="220" y2="155" stroke="hsl(var(--muted-foreground) / 0.3)" strokeWidth="1" markerEnd="url(#mcp-arrow)" />
        <line x1="205" y1="180" x2="205" y2="210" stroke="hsl(var(--muted-foreground) / 0.3)" strokeWidth="1" markerEnd="url(#mcp-arrow)" />

        {/* Protocol connection */}
        <line x1="360" y1="155" x2="460" y2="155" stroke="hsl(var(--primary) / 0.5)" strokeWidth="2" markerEnd="url(#mcp-arrow)" />
        <text x="410" y="148" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9, fontWeight: 600 }}>MCP Protocol</text>

        {/* MCP Server boundary */}
        <rect x="460" y="60" width="340" height="340" rx="14" fill="url(#mcp-grad-server)" stroke="hsl(var(--accent) / 0.2)" strokeWidth="1.5" strokeDasharray="6 3" />
        <text x="630" y="84" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 700 }}>MCP Server</text>

        {/* Tools */}
        <rect x="490" y="100" width="130" height="56" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--accent) / 0.3)" strokeWidth="1.5" />
        <text x="555" y="124" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>Tools</text>
        <text x="555" y="140" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>Query, create, execute</text>

        {/* Resources */}
        <rect x="640" y="100" width="130" height="56" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--accent) / 0.3)" strokeWidth="1.5" />
        <text x="705" y="124" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>Resources</text>
        <text x="705" y="140" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>Schemas, policies, configs</text>

        {/* Prompts */}
        <rect x="565" y="180" width="130" height="56" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--accent) / 0.3)" strokeWidth="1.5" />
        <text x="630" y="204" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>Prompts</text>
        <text x="630" y="220" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>Reusable templates</text>

        {/* Enterprise API */}
        <rect x="490" y="270" width="280" height="50" rx="8" fill="hsl(var(--accent) / 0.1)" stroke="hsl(var(--accent) / 0.4)" strokeWidth="1.5" />
        <text x="630" y="292" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>Enterprise API</text>
        <text x="630" y="308" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>ServiceNow · Database · Internal service</text>

        {/* Arrows inside server */}
        <line x1="630" y1="236" x2="630" y2="270" stroke="hsl(var(--muted-foreground) / 0.3)" strokeWidth="1" markerEnd="url(#mcp-arrow)" />
        <line x1="555" y1="156" x2="555" y2="270" stroke="hsl(var(--muted-foreground) / 0.2)" strokeWidth="1" />
        <line x1="705" y1="156" x2="705" y2="270" stroke="hsl(var(--muted-foreground) / 0.2)" strokeWidth="1" />

        {/* Model-independent note */}
        <text x="630" y="380" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10, fontStyle: 'italic' }}>MCP server is model-independent — the host owns the model</text>
      </svg>
    </div>
  )
}
