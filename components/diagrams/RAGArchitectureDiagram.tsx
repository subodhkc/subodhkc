export function RAGArchitectureDiagram() {
  return (
    <div className="my-8 w-full overflow-x-auto">
      <svg
        viewBox="0 0 800 720"
        className="w-full min-w-[600px] h-auto"
        role="img"
        aria-label="Enterprise RAG architecture diagram showing the flow from data sources through processing, embedding, storage, retrieval, and generation"
      >
        <defs>
          <linearGradient id="grad-ingest" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0.15)" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.05)" />
          </linearGradient>
          <linearGradient id="grad-store" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--accent) / 0.15)" />
            <stop offset="100%" stopColor="hsl(var(--accent) / 0.05)" />
          </linearGradient>
          <linearGradient id="grad-retrieve" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0.12)" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.03)" />
          </linearGradient>
          <linearGradient id="grad-generate" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--accent) / 0.12)" />
            <stop offset="100%" stopColor="hsl(var(--accent) / 0.03)" />
          </linearGradient>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground) / 0.6)" />
          </marker>
        </defs>

        {/* Phase labels */}
        <text x="400" y="24" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Ingestion</text>
        <text x="400" y="224" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Storage</text>
        <text x="400" y="374" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Retrieval</text>
        <text x="400" y="544" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Generation</text>

        {/* Phase 1: Ingestion */}
        <rect x="50" y="32" width="700" height="180" rx="12" fill="url(#grad-ingest)" stroke="hsl(var(--primary) / 0.15)" strokeWidth="1" />

        {/* Data sources */}
        <rect x="80" y="52" width="140" height="56" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1.5" />
        <text x="150" y="76" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 600 }}>Documents</text>
        <text x="150" y="92" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>PDF, DOCX, HTML</text>

        <rect x="80" y="120" width="140" height="56" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1.5" />
        <text x="150" y="144" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 600 }}>Databases</text>
        <text x="150" y="160" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>SQL, NoSQL, APIs</text>

        {/* Arrow */}
        <line x1="220" y1="114" x2="280" y2="114" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />

        {/* Parse & Clean */}
        <rect x="290" y="86" width="130" height="56" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1.5" />
        <text x="355" y="110" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 600 }}>Parse & Clean</text>
        <text x="355" y="126" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Classify, deduplicate</text>

        {/* Arrow */}
        <line x1="420" y1="114" x2="480" y2="114" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />

        {/* Chunk */}
        <rect x="490" y="86" width="120" height="56" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1.5" />
        <text x="550" y="110" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 600 }}>Chunk</text>
        <text x="550" y="126" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Logical sections</text>

        {/* Arrow */}
        <line x1="610" y1="114" x2="670" y2="114" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />

        {/* Embed */}
        <rect x="680" y="86" width="100" height="56" rx="8" fill="hsl(var(--primary) / 0.1)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1.5" />
        <text x="730" y="110" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 600 }}>Embed</text>
        <text x="730" y="126" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Vector model</text>

        {/* Down arrow to storage */}
        <line x1="730" y1="142" x2="730" y2="192" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
        <line x1="730" y1="192" x2="400" y2="192" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="400" y1="192" x2="400" y2="238" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />

        {/* Phase 2: Storage */}
        <rect x="50" y="232" width="700" height="130" rx="12" fill="url(#grad-store)" stroke="hsl(var(--accent) / 0.15)" strokeWidth="1" />

        {/* Vector store */}
        <rect x="100" y="252" width="180" height="90" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--accent) / 0.3)" strokeWidth="1.5" />
        <text x="190" y="276" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 600 }}>Vector Index</text>
        <text x="190" y="294" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Embeddings + distance</text>
        <text x="190" y="310" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>HNSW / IVFFlat / ANN</text>
        <text x="190" y="326" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>pgvector / MongoDB / Databricks</text>

        {/* Metadata */}
        <rect x="310" y="252" width="180" height="90" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--accent) / 0.3)" strokeWidth="1.5" />
        <text x="400" y="276" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 600 }}>Metadata</text>
        <text x="400" y="294" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Tenant, classification</text>
        <text x="400" y="310" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Version, owner, groups</text>
        <text x="400" y="326" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Effective date, status</text>

        {/* RLS */}
        <rect x="520" y="252" width="180" height="90" rx="8" fill="hsl(var(--accent) / 0.1)" stroke="hsl(var(--accent) / 0.4)" strokeWidth="1.5" />
        <text x="610" y="276" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 600 }}>Row-Level Security</text>
        <text x="610" y="294" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Tenant isolation</text>
        <text x="610" y="310" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Access policies</text>
        <text x="610" y="326" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Enforced before retrieval</text>

        {/* Down arrow to retrieval */}
        <line x1="400" y1="362" x2="400" y2="388" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />

        {/* Phase 3: Retrieval */}
        <rect x="50" y="382" width="700" height="150" rx="12" fill="url(#grad-retrieve)" stroke="hsl(var(--primary) / 0.15)" strokeWidth="1" />

        {/* User question */}
        <rect x="100" y="402" width="140" height="56" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1.5" />
        <text x="170" y="426" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 600 }}>User Question</text>
        <text x="170" y="442" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Authenticated</text>

        {/* Arrow */}
        <line x1="240" y1="430" x2="300" y2="430" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />

        {/* Auth + Filter */}
        <rect x="310" y="402" width="150" height="56" rx="8" fill="hsl(var(--primary) / 0.1)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1.5" />
        <text x="385" y="426" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 600 }}>Auth + Filter</text>
        <text x="385" y="442" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Tenant, role, groups</text>

        {/* Arrow */}
        <line x1="460" y1="430" x2="520" y2="430" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />

        {/* Hybrid Search */}
        <rect x="530" y="402" width="150" height="56" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1.5" />
        <text x="605" y="426" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 600 }}>Hybrid Search</text>
        <text x="605" y="442" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Vector + keyword</text>

        {/* Arrow down */}
        <line x1="605" y1="458" x2="605" y2="490" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />

        {/* Rerank */}
        <rect x="530" y="494" width="150" height="30" rx="6" fill="hsl(var(--primary) / 0.1)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1.5" />
        <text x="605" y="514" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>Rerank</text>

        {/* Down arrow to generation */}
        <line x1="605" y1="524" x2="605" y2="548" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="605" y1="548" x2="400" y2="548" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="400" y1="548" x2="400" y2="560" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />

        {/* Phase 4: Generation */}
        <rect x="50" y="552" width="700" height="150" rx="12" fill="url(#grad-generate)" stroke="hsl(var(--accent) / 0.15)" strokeWidth="1" />

        {/* Approved context */}
        <rect x="100" y="572" width="140" height="56" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--accent) / 0.3)" strokeWidth="1.5" />
        <text x="170" y="596" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 600 }}>Approved Context</text>
        <text x="170" y="612" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Filtered evidence</text>

        {/* Arrow */}
        <line x1="240" y1="600" x2="300" y2="600" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />

        {/* Generation model */}
        <rect x="310" y="572" width="150" height="56" rx="8" fill="hsl(var(--accent) / 0.1)" stroke="hsl(var(--accent) / 0.4)" strokeWidth="1.5" />
        <text x="385" y="596" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 600 }}>Generation Model</text>
        <text x="385" y="612" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>LLM with evidence</text>

        {/* Arrow */}
        <line x1="460" y1="600" x2="520" y2="600" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />

        {/* Answer + Citations */}
        <rect x="530" y="572" width="150" height="56" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--accent) / 0.3)" strokeWidth="1.5" />
        <text x="605" y="596" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 600 }}>Answer + Citations</text>
        <text x="605" y="612" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Source references</text>

        {/* Audit log */}
        <rect x="200" y="650" width="400" height="36" rx="6" fill="hsl(var(--background))" stroke="hsl(var(--muted) / 0.3)" strokeWidth="1" strokeDasharray="4 2" />
        <text x="400" y="673" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 11 }}>Audit Log: user, query, filters, sources, model version, output</text>
      </svg>
    </div>
  )
}
