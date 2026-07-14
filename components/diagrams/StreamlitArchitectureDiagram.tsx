export function StreamlitArchitectureDiagram() {
  return (
    <div className="my-8 w-full overflow-x-auto">
      <svg
        viewBox="0 0 800 620"
        className="w-full min-w-[600px] h-auto"
        role="img"
        aria-label="Six-layer architecture for internal AI applications: User, Interface, Application Logic, AI and Retrieval Services, Enterprise Systems, and Security/Evidence/Monitoring"
      >
        <title>Internal AI Application Architecture — Six Layers</title>
        <defs>
          <linearGradient id="sa-grad-1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0.15)" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.05)" />
          </linearGradient>
          <linearGradient id="sa-grad-2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--accent) / 0.15)" />
            <stop offset="100%" stopColor="hsl(var(--accent) / 0.05)" />
          </linearGradient>
          <marker id="sa-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground) / 0.6)" />
          </marker>
        </defs>

        {/* Security side band */}
        <rect x="700" y="40" width="50" height="520" rx="8" fill="hsl(var(--primary) / 0.06)" stroke="hsl(var(--primary) / 0.2)" strokeWidth="1" strokeDasharray="4 2" />
        <text x="725" y="300" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10, fontWeight: 600 }} transform="rotate(90, 725, 300)">Security · Evidence · Monitoring</text>

        {/* Layer 1: User */}
        <rect x="200" y="40" width="480" height="60" rx="10" fill="url(#sa-grad-1)" stroke="hsl(var(--primary) / 0.2)" strokeWidth="1.5" />
        <text x="440" y="65" textAnchor="middle" className="fill-foreground" style={{ fontSize: 13, fontWeight: 700 }}>User</text>
        <text x="440" y="84" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Engineer, analyst, reviewer, administrator</text>

        {/* Arrow */}
        <line x1="440" y1="100" x2="440" y2="120" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#sa-arrow)" />

        {/* Layer 2: Interface (Streamlit) */}
        <rect x="100" y="124" width="580" height="80" rx="10" fill="url(#sa-grad-2)" stroke="hsl(var(--accent) / 0.2)" strokeWidth="1.5" />
        <text x="390" y="148" textAnchor="middle" className="fill-foreground" style={{ fontSize: 13, fontWeight: 700 }}>Interface (Streamlit)</text>
        <text x="390" y="166" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Chat · Forms · File upload · Tables · Charts · Approval screens</text>
        <text x="390" y="182" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Session State for per-session continuity</text>

        {/* Arrow */}
        <line x1="390" y1="204" x2="390" y2="224" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#sa-arrow)" />

        {/* Layer 3: Application Logic */}
        <rect x="100" y="228" width="580" height="80" rx="10" fill="url(#sa-grad-1)" stroke="hsl(var(--primary) / 0.2)" strokeWidth="1.5" />
        <text x="390" y="252" textAnchor="middle" className="fill-foreground" style={{ fontSize: 13, fontWeight: 700 }}>Application Logic (Python)</text>
        <text x="390" y="270" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Workflow steps · Business rules · Validation · Routing · Error handling</text>
        <text x="390" y="286" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Approval requirements · Tool authorization</text>

        {/* Arrow */}
        <line x1="390" y1="308" x2="390" y2="328" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#sa-arrow)" />

        {/* Layer 4: AI and Retrieval Services */}
        <rect x="100" y="332" width="580" height="80" rx="10" fill="url(#sa-grad-2)" stroke="hsl(var(--accent) / 0.2)" strokeWidth="1.5" />
        <text x="390" y="356" textAnchor="middle" className="fill-foreground" style={{ fontSize: 13, fontWeight: 700 }}>AI &amp; Retrieval Services</text>
        <text x="390" y="374" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>LLM · Embeddings · Reranker · RAG · Function calling · MCP client</text>
        <text x="390" y="390" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Structured output · Tool registry</text>

        {/* Arrow */}
        <line x1="390" y1="412" x2="390" y2="432" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#sa-arrow)" />

        {/* Layer 5: Enterprise Systems */}
        <rect x="100" y="436" width="580" height="80" rx="10" fill="url(#sa-grad-1)" stroke="hsl(var(--primary) / 0.2)" strokeWidth="1.5" />
        <text x="390" y="460" textAnchor="middle" className="fill-foreground" style={{ fontSize: 13, fontWeight: 700 }}>Enterprise Systems (Source of Truth)</text>
        <text x="390" y="478" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>PostgreSQL · MongoDB · Databricks · ServiceNow · SharePoint</text>
        <text x="390" y="494" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Salesforce · Azure DevOps · Internal APIs · Data warehouses</text>

        {/* Arrow */}
        <line x1="390" y1="516" x2="390" y2="536" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#sa-arrow)" />

        {/* Layer 6: Controls */}
        <rect x="200" y="540" width="480" height="60" rx="10" fill="hsl(var(--primary) / 0.08)" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1.5" />
        <text x="440" y="565" textAnchor="middle" className="fill-foreground" style={{ fontSize: 13, fontWeight: 700 }}>Controls</text>
        <text x="440" y="584" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Auth · RLS · Audit log · Evidence · Rate limits · Human approval</text>
      </svg>
    </div>
  )
}
