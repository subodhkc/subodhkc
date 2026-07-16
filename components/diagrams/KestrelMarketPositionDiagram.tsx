export function KestrelMarketPositionDiagram() {
  return (
    <div className="my-8 w-full overflow-x-auto">
      <svg
        viewBox="0 0 800 460"
        className="w-full min-w-[600px] h-auto"
        role="img"
        aria-label="Voice-AI market positioning diagram showing five approaches and where Kestrel Voice sits between no-code setup and custom orchestration"
      >
        <title>Kestrel Voice Market Position</title>
        <defs>
          <linearGradient id="mp-kestrel" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0.25)" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.08)" />
          </linearGradient>
          <linearGradient id="mp-approach" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--muted) / 0.4)" />
            <stop offset="100%" stopColor="hsl(var(--muted) / 0.1)" />
          </linearGradient>
        </defs>

        {/* Spectrum label */}
        <text x="400" y="22" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Voice-AI Market Spectrum</text>

        {/* Approach 1: Developer API */}
        <rect x="30" y="40" width="130" height="80" rx="8" fill="url(#mp-approach)" stroke="hsl(var(--muted-foreground) / 0.2)" strokeWidth="1" />
        <text x="95" y="62" textAnchor="middle" className="fill-foreground" style={{ fontSize: 10, fontWeight: 600 }}>Developer</text>
        <text x="95" y="76" textAnchor="middle" className="fill-foreground" style={{ fontSize: 10, fontWeight: 600 }}>Voice API</text>
        <text x="95" y="96" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 8 }}>Max flexibility</text>
        <text x="95" y="108" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 8 }}>Buyer builds all</text>

        {/* Approach 2: Visual Builder */}
        <rect x="175" y="40" width="130" height="80" rx="8" fill="url(#mp-approach)" stroke="hsl(var(--muted-foreground) / 0.2)" strokeWidth="1" />
        <text x="240" y="62" textAnchor="middle" className="fill-foreground" style={{ fontSize: 10, fontWeight: 600 }}>Visual No-Code</text>
        <text x="240" y="76" textAnchor="middle" className="fill-foreground" style={{ fontSize: 10, fontWeight: 600 }}>Builder</text>
        <text x="240" y="96" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 8 }}>Fast flow design</text>
        <text x="240" y="108" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 8 }}>Buyer maintains flows</text>

        {/* Approach 3: Fixed Receptionist */}
        <rect x="320" y="40" width="130" height="80" rx="8" fill="url(#mp-approach)" stroke="hsl(var(--muted-foreground) / 0.2)" strokeWidth="1" />
        <text x="385" y="62" textAnchor="middle" className="fill-foreground" style={{ fontSize: 10, fontWeight: 600 }}>Fixed AI</text>
        <text x="385" y="76" textAnchor="middle" className="fill-foreground" style={{ fontSize: 10, fontWeight: 600 }}>Receptionist</text>
        <text x="385" y="96" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 8 }}>Simple package</text>
        <text x="385" y="108" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 8 }}>Limited control</text>

        {/* Approach 4: Contact Center */}
        <rect x="465" y="40" width="130" height="80" rx="8" fill="url(#mp-approach)" stroke="hsl(var(--muted-foreground) / 0.2)" strokeWidth="1" />
        <text x="530" y="62" textAnchor="middle" className="fill-foreground" style={{ fontSize: 10, fontWeight: 600 }}>Contact-Center</text>
        <text x="530" y="76" textAnchor="middle" className="fill-foreground" style={{ fontSize: 10, fontWeight: 600 }}>Platform</text>
        <text x="530" y="96" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 8 }}>Scale &amp; QA</text>
        <text x="530" y="108" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 8 }}>Enterprise program</text>

        {/* Approach 5: Managed Enterprise */}
        <rect x="610" y="40" width="130" height="80" rx="8" fill="url(#mp-approach)" stroke="hsl(var(--muted-foreground) / 0.2)" strokeWidth="1" />
        <text x="675" y="62" textAnchor="middle" className="fill-foreground" style={{ fontSize: 10, fontWeight: 600 }}>Managed</text>
        <text x="675" y="76" textAnchor="middle" className="fill-foreground" style={{ fontSize: 10, fontWeight: 600 }}>Enterprise</text>
        <text x="675" y="96" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 8 }}>End-to-end delivery</text>
        <text x="675" y="108" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 8 }}>Large budget</text>

        {/* Kestrel box — spans from no-code to custom orchestration */}
        <rect x="175" y="150" width="430" height="100" rx="12" fill="url(#mp-kestrel)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="2" />
        <text x="390" y="178" textAnchor="middle" className="fill-foreground" style={{ fontSize: 14, fontWeight: 700 }}>Kestrel Voice</text>
        <text x="390" y="198" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>No-code launch + hosted runtime + custom orchestration</text>
        <text x="390" y="214" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>+ RAG + guardrails + dashboards + supported customization</text>

        {/* Progression arrows */}
        <text x="390" y="236" textAnchor="middle" className="fill-primary" style={{ fontSize: 9, fontWeight: 600 }}>Self-Service → Supported → Custom → Managed</text>

        {/* Connecting lines from approaches to Kestrel */}
        <line x1="95" y1="120" x2="175" y2="150" stroke="hsl(var(--muted-foreground) / 0.2)" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="240" y1="120" x2="240" y2="150" stroke="hsl(var(--muted-foreground) / 0.2)" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="385" y1="120" x2="390" y2="150" stroke="hsl(var(--muted-foreground) / 0.2)" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="530" y1="120" x2="530" y2="150" stroke="hsl(var(--muted-foreground) / 0.2)" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="675" y1="120" x2="605" y2="150" stroke="hsl(var(--muted-foreground) / 0.2)" strokeWidth="1" strokeDasharray="3 2" />

        {/* Buyer responsibility spectrum */}
        <text x="400" y="280" textAnchor="middle" className="fill-foreground" style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Buyer Responsibility</text>

        <rect x="30" y="295" width="710" height="24" rx="4" fill="hsl(var(--muted) / 0.3)" />
        <rect x="30" y="295" width="710" height="24" rx="4" fill="none" stroke="hsl(var(--border))" strokeWidth="1" />
        <text x="95" y="311" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 8 }}>Architecture, workflow, UI, ops</text>
        <text x="240" y="311" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 8 }}>Design &amp; maintain flows</text>
        <text x="385" y="311" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 8 }}>Limited configuration</text>
        <text x="530" y="311" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 8 }}>Implementation program</text>
        <text x="675" y="311" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 8 }}>Budget &amp; cycle</text>

        {/* Kestrel buyer responsibility */}
        <rect x="175" y="330" width="430" height="24" rx="4" fill="hsl(var(--primary) / 0.1)" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1" />
        <text x="390" y="346" textAnchor="middle" className="fill-primary" style={{ fontSize: 9, fontWeight: 600 }}>Business configuration + ongoing review</text>

        {/* Bottom labels */}
        <text x="95" y="380" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>Vapi, Retell SDK</text>
        <text x="240" y="380" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>Synthflow</text>
        <text x="385" y="380" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>Answering services</text>
        <text x="530" y="380" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>Retell, others</text>
        <text x="675" y="380" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>Bland, FDEs</text>

        {/* Key insight */}
        <rect x="100" y="400" width="600" height="44" rx="8" fill="hsl(var(--primary) / 0.05)" stroke="hsl(var(--primary) / 0.15)" strokeWidth="1" />
        <text x="400" y="420" textAnchor="middle" className="fill-foreground" style={{ fontSize: 10, fontWeight: 600 }}>Kestrel's differentiation is not one isolated feature.</text>
        <text x="400" y="436" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>It is the combination: fast setup + hosted infra + orchestration + controls + evidence + support</text>
      </svg>
    </div>
  )
}
