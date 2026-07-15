export function VoiceAgentArchitectureDiagram() {
  return (
    <div className="my-8 w-full overflow-x-auto">
      <svg
        viewBox="0 0 800 520"
        className="w-full min-w-[600px] h-auto"
        role="img"
        aria-label="AI voice agent architecture diagram showing five layers: presentation, voice runtime, telephony, demand engine, and data layer"
      >
        <title>AI Voice Agent Architecture Diagram</title>
        <defs>
          <linearGradient id="va-grad-pres" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0.15)" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.05)" />
          </linearGradient>
          <linearGradient id="va-grad-runtime" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--accent) / 0.15)" />
            <stop offset="100%" stopColor="hsl(var(--accent) / 0.05)" />
          </linearGradient>
          <linearGradient id="va-grad-infra" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0.12)" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.03)" />
          </linearGradient>
          <marker id="va-arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground) / 0.6)" />
          </marker>
        </defs>

        {/* Layer labels */}
        <text x="400" y="22" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Presentation</text>
        <text x="400" y="142" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Voice Runtime</text>
        <text x="400" y="322" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Infrastructure &amp; Data</text>

        {/* Layer 1: Presentation */}
        <rect x="50" y="30" width="700" height="100" rx="12" fill="url(#va-grad-pres)" stroke="hsl(var(--primary) / 0.15)" strokeWidth="1" />

        <rect x="120" y="50" width="200" height="60" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1.5" />
        <text x="220" y="74" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 600 }}>Next.js Dashboard</text>
        <text x="220" y="92" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Configuration · RAG Management</text>

        <rect x="360" y="50" width="160" height="60" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1.5" />
        <text x="440" y="74" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 600 }}>Analytics &amp; Reports</text>
        <text x="440" y="92" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Call logs · Scorecards</text>

        <rect x="560" y="50" width="160" height="60" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1.5" />
        <text x="640" y="74" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 600 }}>WebRTC Client</text>
        <text x="640" y="92" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Browser-based calling</text>

        {/* Arrow down */}
        <line x1="400" y1="130" x2="400" y2="150" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#va-arrowhead)" />

        {/* Layer 2: Voice Runtime */}
        <rect x="50" y="150" width="700" height="160" rx="12" fill="url(#va-grad-runtime)" stroke="hsl(var(--accent) / 0.15)" strokeWidth="1" />

        <rect x="80" y="170" width="130" height="56" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--accent) / 0.3)" strokeWidth="1.5" />
        <text x="145" y="194" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 600 }}>Tenant Resolution</text>
        <text x="145" y="210" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Number → tenant config</text>

        <rect x="230" y="170" width="130" height="56" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--accent) / 0.3)" strokeWidth="1.5" />
        <text x="295" y="194" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 600 }}>Mode Selection</text>
        <text x="295" y="210" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Realtime · Adaptive · Gather</text>

        <rect x="380" y="170" width="130" height="56" rx="8" fill="hsl(var(--accent) / 0.1)" stroke="hsl(var(--accent) / 0.4)" strokeWidth="1.5" />
        <text x="445" y="194" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 600 }}>L1 / L2 / L3 Router</text>
        <text x="445" y="210" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Interrupt · Fast path · AI</text>

        <rect x="530" y="170" width="130" height="56" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--accent) / 0.3)" strokeWidth="1.5" />
        <text x="595" y="194" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 600 }}>Tools &amp; RAG</text>
        <text x="595" y="210" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Calendar · CRM · Knowledge</text>

        {/* Sub-row: guardrails */}
        <rect x="80" y="240" width="280" height="50" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--accent) / 0.2)" strokeWidth="1" strokeDasharray="4 2" />
        <text x="220" y="262" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>Guardrails &amp; Degradation</text>
        <text x="220" y="278" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Circuit breaker · Credit checks · Duration caps</text>

        <rect x="380" y="240" width="280" height="50" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--accent) / 0.2)" strokeWidth="1" strokeDasharray="4 2" />
        <text x="520" y="262" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>Post-Call Pipeline</text>
        <text x="520" y="278" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Intelligence · Actions · Webhooks · Evidence</text>

        {/* Arrow down */}
        <line x1="400" y1="310" x2="400" y2="330" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#va-arrowhead)" />

        {/* Layer 3: Infrastructure & Data — 3 columns */}
        <rect x="50" y="330" width="700" height="170" rx="12" fill="url(#va-grad-infra)" stroke="hsl(var(--primary) / 0.15)" strokeWidth="1" />

        {/* Telephony */}
        <rect x="80" y="350" width="200" height="130" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1.5" />
        <text x="180" y="374" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 600 }}>Telephony (Twilio)</text>
        <text x="180" y="394" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Programmable Voice</text>
        <text x="180" y="410" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Media Streams · TwiML</text>
        <text x="180" y="426" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>SMS · WebRTC Client</text>
        <text x="180" y="442" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Signature Validation</text>
        <text x="180" y="462" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Number Provisioning</text>

        {/* Demand Engine */}
        <rect x="300" y="350" width="200" height="130" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1.5" />
        <text x="400" y="374" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 600 }}>Demand Engine</text>
        <text x="400" y="394" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>CRM · Contacts · Leads</text>
        <text x="400" y="410" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Onboarding · Provisioning</text>
        <text x="400" y="426" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Analytics · Dashboard</text>
        <text x="400" y="442" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Usage · Reporting</text>
        <text x="400" y="462" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Appointments · Calendar</text>

        {/* Data Layer */}
        <rect x="520" y="350" width="200" height="130" rx="8" fill="hsl(var(--primary) / 0.1)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1.5" />
        <text x="620" y="374" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 600 }}>Data (Supabase)</text>
        <text x="620" y="394" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Postgres + pgvector</text>
        <text x="620" y="410" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Row-Level Security</text>
        <text x="620" y="426" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Tenant Configs · Call Logs</text>
        <text x="620" y="442" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>RAG Chunks · Embeddings</text>
        <text x="620" y="462" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Auth · Realtime Subscriptions</text>

        {/* Deployment badge */}
        <rect x="250" y="496" width="300" height="20" rx="4" fill="hsl(var(--background))" stroke="hsl(var(--muted) / 0.3)" strokeWidth="1" strokeDasharray="4 2" />
        <text x="400" y="510" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Deployed on Modal (serverless) · Vercel (frontend)</text>
      </svg>
    </div>
  )
}
