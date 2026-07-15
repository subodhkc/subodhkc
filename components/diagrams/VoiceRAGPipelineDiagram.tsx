export function VoiceRAGPipelineDiagram() {
  return (
    <div className="my-8 w-full overflow-x-auto">
      <svg
        viewBox="0 0 820 360"
        className="w-full min-w-[700px] h-auto"
        role="img"
        aria-label="RAG pipeline diagram showing four stages: ingestion from website scraping, FAQ, and Google Drive; storage in Postgres with pgvector and RLS; retrieval via keyword trigger, embedding, and cosine similarity search; refresh via SHA-256 hashing and stale detection"
      >
        <title>Voice Agent RAG Pipeline Diagram</title>
        <defs>
          <linearGradient id="rag-grad-ingest" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0.15)" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.05)" />
          </linearGradient>
          <linearGradient id="rag-grad-store" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--accent) / 0.15)" />
            <stop offset="100%" stopColor="hsl(var(--accent) / 0.05)" />
          </linearGradient>
          <linearGradient id="rag-grad-retrieve" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0.12)" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.03)" />
          </linearGradient>
          <linearGradient id="rag-grad-refresh" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--accent) / 0.12)" />
            <stop offset="100%" stopColor="hsl(var(--accent) / 0.03)" />
          </linearGradient>
          <marker id="rag-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground) / 0.6)" />
          </marker>
        </defs>

        {/* Stage labels */}
        <text x="110" y="22" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Ingestion</text>
        <text x="310" y="22" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Storage</text>
        <text x="510" y="22" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Retrieval</text>
        <text x="710" y="22" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Refresh</text>

        {/* Stage 1: Ingestion */}
        <rect x="20" y="32" width="180" height="240" rx="12" fill="url(#rag-grad-ingest)" stroke="hsl(var(--primary) / 0.15)" strokeWidth="1" />

        <rect x="40" y="52" width="140" height="50" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1.5" />
        <text x="110" y="74" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>Website Scraping</text>
        <text x="110" y="90" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>SSRF-protected</text>

        <rect x="40" y="112" width="140" height="50" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1.5" />
        <text x="110" y="134" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>FAQ Ingestion</text>
        <text x="110" y="150" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Tenant config FAQs</text>

        <rect x="40" y="172" width="140" height="50" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1.5" />
        <text x="110" y="194" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>Google Drive</text>
        <text x="110" y="210" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Folder indexing</text>

        <rect x="40" y="232" width="140" height="30" rx="6" fill="hsl(var(--primary) / 0.1)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1.5" />
        <text x="110" y="252" textAnchor="middle" className="fill-foreground" style={{ fontSize: 10, fontWeight: 600 }}>Chunk · 500 tokens · 50 overlap</text>

        {/* Arrow */}
        <line x1="200" y1="152" x2="220" y2="152" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#rag-arrow)" />

        {/* Stage 2: Storage */}
        <rect x="220" y="32" width="180" height="240" rx="12" fill="url(#rag-grad-store)" stroke="hsl(var(--accent) / 0.15)" strokeWidth="1" />

        <rect x="240" y="52" width="140" height="60" rx="8" fill="hsl(var(--accent) / 0.1)" stroke="hsl(var(--accent) / 0.4)" strokeWidth="1.5" />
        <text x="310" y="76" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>Postgres + pgvector</text>
        <text x="310" y="92" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>1536-dim embeddings</text>
        <text x="310" y="106" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>ivfflat ANN index</text>

        <rect x="240" y="122" width="140" height="50" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--accent) / 0.3)" strokeWidth="1.5" />
        <text x="310" y="144" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>Row-Level Security</text>
        <text x="310" y="160" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Tenant-scoped access</text>

        <rect x="240" y="182" width="140" height="50" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--accent) / 0.3)" strokeWidth="1.5" />
        <text x="310" y="204" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>Metadata</text>
        <text x="310" y="220" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Source · Type · Hash</text>

        <rect x="240" y="242" width="140" height="24" rx="6" fill="hsl(var(--background))" stroke="hsl(var(--muted) / 0.3)" strokeWidth="1" strokeDasharray="4 2" />
        <text x="310" y="258" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>website_content_chunks table</text>

        {/* Arrow */}
        <line x1="400" y1="152" x2="420" y2="152" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#rag-arrow)" />

        {/* Stage 3: Retrieval */}
        <rect x="420" y="32" width="180" height="240" rx="12" fill="url(#rag-grad-retrieve)" stroke="hsl(var(--primary) / 0.15)" strokeWidth="1" />

        <rect x="440" y="52" width="140" height="50" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1.5" />
        <text x="510" y="74" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>Keyword Trigger</text>
        <text x="510" y="90" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Detected in user speech</text>

        <rect x="440" y="112" width="140" height="50" rx="8" fill="hsl(var(--primary) / 0.1)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1.5" />
        <text x="510" y="134" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>Embed Query</text>
        <text x="510" y="150" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Same embedding model</text>

        <rect x="440" y="172" width="140" height="50" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1.5" />
        <text x="510" y="194" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>Cosine Similarity</text>
        <text x="510" y="210" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Threshold ≥ 0.65 · Top-5</text>

        <rect x="440" y="232" width="140" height="30" rx="6" fill="hsl(var(--primary) / 0.1)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1.5" />
        <text x="510" y="252" textAnchor="middle" className="fill-foreground" style={{ fontSize: 10, fontWeight: 600 }}>Inject context → AI prompt</text>

        {/* Arrow */}
        <line x1="600" y1="152" x2="620" y2="152" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#rag-arrow)" />

        {/* Stage 4: Refresh */}
        <rect x="620" y="32" width="180" height="240" rx="12" fill="url(#rag-grad-refresh)" stroke="hsl(var(--accent) / 0.15)" strokeWidth="1" />

        <rect x="640" y="52" width="140" height="50" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--accent) / 0.3)" strokeWidth="1.5" />
        <text x="710" y="74" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>SHA-256 Hashing</text>
        <text x="710" y="90" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Change detection</text>

        <rect x="640" y="112" width="140" height="50" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--accent) / 0.3)" strokeWidth="1.5" />
        <text x="710" y="134" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>Stale Detection</text>
        <text x="710" y="150" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>7-day threshold</text>

        <rect x="640" y="172" width="140" height="50" rx="8" fill="hsl(var(--background))" stroke="hsl(var(--accent) / 0.3)" strokeWidth="1.5" />
        <text x="710" y="194" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>Biweekly Reminders</text>
        <text x="710" y="210" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Tenant email prompts</text>

        <rect x="640" y="232" width="140" height="30" rx="6" fill="hsl(var(--accent) / 0.1)" stroke="hsl(var(--accent) / 0.4)" strokeWidth="1.5" />
        <text x="710" y="252" textAnchor="middle" className="fill-foreground" style={{ fontSize: 10, fontWeight: 600 }}>Manual re-scrape endpoint</text>

        {/* Bottom flow label */}
        <rect x="100" y="290" width="620" height="24" rx="4" fill="hsl(var(--background))" stroke="hsl(var(--muted) / 0.3)" strokeWidth="1" strokeDasharray="4 2" />
        <text x="410" y="306" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Per-tenant · Opt-out · Frontend API first → Supabase RPC fallback · Mode-compatible (adaptive, realtime)</text>

        {/* Loop-back arrow from refresh to ingestion */}
        <path d="M 710 262 Q 710 330 410 330 Q 110 330 110 272" fill="none" stroke="hsl(var(--muted-foreground) / 0.3)" strokeWidth="1" strokeDasharray="4 3" markerEnd="url(#rag-arrow)" />
        <text x="410" y="345" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>Re-ingest on content change</text>
      </svg>
    </div>
  )
}
