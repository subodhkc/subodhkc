export function RAGDecisionTree() {
  return (
    <div className="my-8 w-full overflow-x-auto">
      <svg
        viewBox="0 0 820 680"
        className="w-full min-w-[700px] h-auto"
        role="img"
        aria-label="Decision tree for choosing RAG architecture: question type determines search method, which determines storage and security requirements"
      >
        <title>RAG Decision Tree</title>
        <defs>
          <linearGradient id="dt-grad-q" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0.12)" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.03)" />
          </linearGradient>
          <linearGradient id="dt-grad-s" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--accent) / 0.12)" />
            <stop offset="100%" stopColor="hsl(var(--accent) / 0.03)" />
          </linearGradient>
          <marker id="dt-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground) / 0.5)" />
          </marker>
          <marker id="dt-arrow-yes" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--primary) / 0.6)" />
          </marker>
          <marker id="dt-arrow-no" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground) / 0.4)" />
          </marker>
        </defs>

        {/* Root: What decision will the system support? */}
        <rect x="280" y="16" width="260" height="50" rx="10" fill="url(#dt-grad-q)" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1.5" />
        <text x="410" y="38" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 700 }}>What will the system support?</text>
        <text x="410" y="54" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Impact level determines controls</text>

        {/* Branch lines from root */}
        <line x1="410" y1="66" x2="410" y2="86" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="150" y1="86" x2="670" y2="86" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="150" y1="86" x2="150" y2="106" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#dt-arrow)" />
        <line x1="410" y1="86" x2="410" y2="106" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#dt-arrow)" />
        <line x1="670" y1="86" x2="670" y2="106" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#dt-arrow)" />

        {/* Low impact */}
        <rect x="60" y="110" width="180" height="44" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--primary) / 0.25)" strokeWidth="1.5" />
        <text x="150" y="130" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>Low Impact</text>
        <text x="150" y="146" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>FAQ, docs, general info</text>

        {/* Medium impact */}
        <rect x="320" y="110" width="180" height="44" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--primary) / 0.25)" strokeWidth="1.5" />
        <text x="410" y="130" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>Medium Impact</text>
        <text x="410" y="146" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Operations, support</text>

        {/* High impact */}
        <rect x="580" y="110" width="180" height="44" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--primary) / 0.25)" strokeWidth="1.5" />
        <text x="670" y="130" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>High Impact</text>
        <text x="670" y="146" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Legal, clinical, financial</text>

        {/* Arrows down to search method question */}
        <line x1="150" y1="154" x2="150" y2="180" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="410" y1="154" x2="410" y2="180" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="670" y1="154" x2="670" y2="180" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="150" y1="180" x2="670" y2="180" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="410" y1="180" x2="410" y2="200" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#dt-arrow)" />

        {/* What search method fits? */}
        <rect x="280" y="204" width="260" height="50" rx="10" fill="url(#dt-grad-q)" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1.5" />
        <text x="410" y="226" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 700 }}>What search method fits?</text>
        <text x="410" y="242" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Match method to data type</text>

        {/* Branch lines */}
        <line x1="410" y1="254" x2="410" y2="274" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="100" y1="274" x2="720" y2="274" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="100" y1="274" x2="100" y2="294" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#dt-arrow)" />
        <line x1="307" y1="274" x2="307" y2="294" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#dt-arrow)" />
        <line x1="513" y1="274" x2="513" y2="294" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#dt-arrow)" />
        <line x1="720" y1="274" x2="720" y2="294" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#dt-arrow)" />

        {/* SQL */}
        <rect x="30" y="298" width="140" height="50" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--accent) / 0.25)" strokeWidth="1.5" />
        <text x="100" y="320" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>SQL</text>
        <text x="100" y="336" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Counts, totals, metrics</text>

        {/* Keyword */}
        <rect x="237" y="298" width="140" height="50" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--accent) / 0.25)" strokeWidth="1.5" />
        <text x="307" y="320" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>Keyword Search</text>
        <text x="307" y="336" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>IDs, codes, exact terms</text>

        {/* Vector */}
        <rect x="443" y="298" width="140" height="50" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--accent) / 0.25)" strokeWidth="1.5" />
        <text x="513" y="320" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>Vector Search</text>
        <text x="513" y="336" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Semantic meaning</text>

        {/* Hybrid/Agentic */}
        <rect x="650" y="298" width="140" height="50" rx="8" fill="hsl(var(--accent) / 0.1)" stroke="hsl(var(--accent) / 0.4)" strokeWidth="1.5" />
        <text x="720" y="320" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>Hybrid / Agentic</text>
        <text x="720" y="336" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Mixed intent</text>

        {/* Arrows down to storage question */}
        <line x1="100" y1="348" x2="100" y2="374" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="307" y1="348" x2="307" y2="374" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="513" y1="348" x2="513" y2="374" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="720" y1="348" x2="720" y2="374" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="100" y1="374" x2="720" y2="374" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="410" y1="374" x2="410" y2="394" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#dt-arrow)" />

        {/* Where should vectors live? */}
        <rect x="270" y="398" width="280" height="50" rx="10" fill="url(#dt-grad-q)" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1.5" />
        <text x="410" y="420" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 700 }}>Where should vectors live?</text>
        <text x="410" y="436" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Existing DB vs dedicated platform</text>

        {/* Yes/No branch */}
        <line x1="410" y1="448" x2="410" y2="468" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="210" y1="468" x2="610" y2="468" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="210" y1="468" x2="210" y2="488" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1.5" markerEnd="url(#dt-arrow-yes)" />
        <line x1="610" y1="468" x2="610" y2="488" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#dt-arrow-no)" />

        <text x="250" y="464" className="fill-muted-foreground" style={{ fontSize: 10, fontWeight: 600 }}>Yes — existing DB works</text>
        <text x="530" y="464" className="fill-muted-foreground" style={{ fontSize: 10, fontWeight: 600 }}>No — need scale/specialization</text>

        {/* Existing DB */}
        <rect x="100" y="492" width="220" height="56" rx="8" fill="url(#dt-grad-s)" stroke="hsl(var(--accent) / 0.3)" strokeWidth="1.5" />
        <text x="210" y="514" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>Keep Vectors in Existing DB</text>
        <text x="210" y="530" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>pgvector / MongoDB Vector Search</text>
        <text x="210" y="542" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Simpler security, joins, backup</text>

        {/* Dedicated platform */}
        <rect x="500" y="492" width="220" height="56" rx="8" fill="url(#dt-grad-s)" stroke="hsl(var(--accent) / 0.3)" strokeWidth="1.5" />
        <text x="610" y="514" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>Add Dedicated Vector Platform</text>
        <text x="610" y="530" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Databricks AI Search / sidecar</text>
        <text x="610" y="542" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Independent scaling, sync required</text>

        {/* Arrows down to security */}
        <line x1="210" y1="548" x2="210" y2="574" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="610" y1="548" x2="610" y2="574" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="210" y1="574" x2="610" y2="574" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="410" y1="574" x2="410" y2="594" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#dt-arrow)" />

        {/* Security layer */}
        <rect x="180" y="598" width="460" height="64" rx="10" fill="hsl(var(--primary) / 0.08)" stroke="hsl(var(--primary) / 0.35)" strokeWidth="1.5" />
        <text x="410" y="620" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 700 }}>Apply 4-Layer Security</text>
        <text x="410" y="638" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Source: DB permissions + Secure views</text>
        <text x="410" y="652" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Retrieval: Tenant + classification filters</text>
        <text x="410" y="666" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>App: Auth + tool authorization | Gen: Prompt guardrails</text>
      </svg>
    </div>
  )
}
