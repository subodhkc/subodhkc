export function KestrelKnowledgeStackDiagram() {
  return (
    <div className="my-8 w-full overflow-x-auto">
      <svg
        viewBox="0 0 800 520"
        className="w-full min-w-[600px] h-auto"
        role="img"
        aria-label="Kestrel Voice knowledge stack showing four layers: direct configuration, approved FAQs, RAG and website knowledge, and live business tools, with a knowledge lifecycle arrow"
      >
        <title>Kestrel Voice Knowledge Stack</title>
        <defs>
          <linearGradient id="ks-layer1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0.15)" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.05)" />
          </linearGradient>
          <linearGradient id="ks-layer2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--accent) / 0.15)" />
            <stop offset="100%" stopColor="hsl(var(--accent) / 0.05)" />
          </linearGradient>
          <linearGradient id="ks-layer3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0.12)" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.03)" />
          </linearGradient>
          <linearGradient id="ks-layer4" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--accent) / 0.12)" />
            <stop offset="100%" stopColor="hsl(var(--accent) / 0.03)" />
          </linearGradient>
          <marker id="ks-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground) / 0.6)" />
          </marker>
        </defs>

        {/* Title */}
        <text x="400" y="22" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Knowledge Stack — Four Layers</text>

        {/* Layer 1: Direct Configuration */}
        <rect x="40" y="40" width="520" height="80" rx="10" fill="url(#ks-layer1)" stroke="hsl(var(--primary) / 0.2)" strokeWidth="1.5" />
        <text x="60" y="62" className="fill-foreground" style={{ fontSize: 12, fontWeight: 700 }}>1. Direct Configuration</text>
        <text x="60" y="80" className="fill-muted-foreground" style={{ fontSize: 10 }}>Hours · Service areas · Transfer numbers · Business identity · Appointment settings</text>
        <text x="60" y="98" className="fill-muted-foreground" style={{ fontSize: 9 }}>Best for: stable facts the business owner already knows</text>

        {/* Layer 2: Approved FAQs */}
        <rect x="40" y="135" width="520" height="80" rx="10" fill="url(#ks-layer2)" stroke="hsl(var(--accent) / 0.2)" strokeWidth="1.5" />
        <text x="60" y="157" className="fill-foreground" style={{ fontSize: 12, fontWeight: 700 }}>2. Approved FAQs</text>
        <text x="60" y="175" className="fill-muted-foreground" style={{ fontSize: 10 }}>Common questions with stable, pre-written answers</text>
        <text x="60" y="193" className="fill-muted-foreground" style={{ fontSize: 9 }}>Best for: predictable Q&A the business has already answered many times</text>

        {/* Layer 3: RAG / Website Knowledge */}
        <rect x="40" y="230" width="520" height="80" rx="10" fill="url(#ks-layer3)" stroke="hsl(var(--primary) / 0.2)" strokeWidth="1.5" />
        <text x="60" y="252" className="fill-foreground" style={{ fontSize: 12, fontWeight: 700 }}>3. RAG &amp; Website Knowledge</text>
        <text x="60" y="270" className="fill-muted-foreground" style={{ fontSize: 10 }}>Tenant-scoped sources · Chunks · Vector retrieval · Refresh tracking · Content hashes</text>
        <text x="60" y="288" className="fill-muted-foreground" style={{ fontSize: 9 }}>Best for: broader information from websites and documents — must be managed, not uploaded once</text>

        {/* Layer 4: Live Business Tools */}
        <rect x="40" y="325" width="520" height="80" rx="10" fill="url(#ks-layer4)" stroke="hsl(var(--accent) / 0.2)" strokeWidth="1.5" />
        <text x="60" y="347" className="fill-foreground" style={{ fontSize: 12, fontWeight: 700 }}>4. Live Business Tools</text>
        <text x="60" y="365" className="fill-muted-foreground" style={{ fontSize: 10 }}>Appointment availability · Customer status · Booking results · Current business records</text>
        <text x="60" y="383" className="fill-muted-foreground" style={{ fontSize: 9 }}>Best for: changing information that must be checked at call time, not cached</text>

        {/* Knowledge Lifecycle — right side */}
        <text x="690" y="22" textAnchor="middle" className="fill-foreground" style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Lifecycle</text>

        <rect x="600" y="40" width="160" height="365" rx="10" fill="hsl(var(--muted) / 0.15)" stroke="hsl(var(--border))" strokeWidth="1" />

        {/* Lifecycle steps */}
        {[
          { y: 60, label: 'Approved Source' },
          { y: 120, label: 'Ingestion' },
          { y: 180, label: 'Retrieval' },
          { y: 240, label: 'Review' },
          { y: 300, label: 'Refresh' },
          { y: 360, label: 'Replace / Delete' },
        ].map((step, i, arr) => (
          <g key={step.label}>
            <rect x="615" y={step.y} width="130" height="36" rx="6" fill="hsl(var(--background))" stroke="hsl(var(--primary) / 0.2)" strokeWidth="1" />
            <text x="680" y={step.y + 22} textAnchor="middle" className="fill-foreground" style={{ fontSize: 10, fontWeight: 600 }}>{step.label}</text>
            {i < arr.length - 1 && (
              <line x1="680" y1={step.y + 36} x2="680" y2={step.y + 54} stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#ks-arrow)" />
            )}
          </g>
        ))}

        {/* Arrow from layers to lifecycle */}
        <line x1="560" y1="200" x2="600" y2="200" stroke="hsl(var(--muted-foreground) / 0.3)" strokeWidth="1.5" strokeDasharray="4 2" markerEnd="url(#ks-arrow)" />

        {/* Bottom note */}
        <rect x="40" y="430" width="720" height="70" rx="8" fill="hsl(var(--primary) / 0.05)" stroke="hsl(var(--primary) / 0.15)" strokeWidth="1" />
        <text x="400" y="452" textAnchor="middle" className="fill-foreground" style={{ fontSize: 10, fontWeight: 600 }}>RAG does not automatically make an answer accurate.</text>
        <text x="400" y="470" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>If a website contains an outdated service area, the AI can accurately retrieve the wrong information.</text>
        <text x="400" y="486" textAnchor="middle" className="fill-primary" style={{ fontSize: 9, fontWeight: 600 }}>Knowledge must be managed — not uploaded once and forgotten.</text>
      </svg>
    </div>
  )
}
