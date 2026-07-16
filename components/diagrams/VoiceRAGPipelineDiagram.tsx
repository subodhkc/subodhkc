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
  { id: 'website-scraping', x: 40, y: 52, w: 140, h: 50, title: 'Website Scraping', subtitle: 'SSRF-protected', details: ['Fetches and parses tenant website content', 'SSRF protection blocks internal IPs', 'Respects robots.txt and rate limits'] },
  { id: 'faq-ingestion', x: 40, y: 112, w: 140, h: 50, title: 'FAQ Ingestion', subtitle: 'Tenant config FAQs', details: ['Pre-approved Q&A pairs from tenant config', 'Highest priority source — no embedding needed', 'Direct match before vector search'] },
  { id: 'google-drive', x: 40, y: 172, w: 140, h: 50, title: 'Google Drive', subtitle: 'Folder indexing', details: ['Indexes approved Drive folders', 'OAuth-scoped to tenant-selected directories', 'Re-indexed on schedule or manual trigger'] },
  { id: 'chunk-config', x: 40, y: 232, w: 140, h: 30, title: 'Chunk · 500 tokens · 50 overlap', fill: 'hsl(var(--primary) / 0.1)', stroke: 'hsl(var(--primary) / 0.4)', details: ['500-token chunks with 50-token overlap', 'Preserves semantic boundaries'] },
  { id: 'postgres-pgvector', x: 240, y: 52, w: 140, h: 60, title: 'Postgres + pgvector', subtitle: '1536-dim · ivfflat', fill: 'hsl(var(--accent) / 0.1)', stroke: 'hsl(var(--accent) / 0.4)', details: ['1536-dimensional embeddings stored in pgvector', 'IVFFlat ANN index for fast similarity search', 'Co-located with business data for joins'] },
  { id: 'rag-rls', x: 240, y: 122, w: 140, h: 50, title: 'Row-Level Security', subtitle: 'Tenant-scoped access', details: ['Postgres RLS policies enforce tenant isolation', 'Applied at database level — cannot be bypassed', 'Role-based access within tenant'] },
  { id: 'rag-metadata', x: 240, y: 182, w: 140, h: 50, title: 'Metadata', subtitle: 'Source · Type · Hash', details: ['Source URL, document type, content hash', 'Enables change detection and refresh', 'Tenant ID for filtering'] },
  { id: 'keyword-trigger', x: 440, y: 52, w: 140, h: 50, title: 'Keyword Trigger', subtitle: 'Detected in user speech', details: ['Realtime keyword detection in speech stream', 'Triggers RAG retrieval without full query', 'Low-latency path for common questions'] },
  { id: 'embed-query', x: 440, y: 112, w: 140, h: 50, title: 'Embed Query', subtitle: 'Same embedding model', fill: 'hsl(var(--primary) / 0.1)', stroke: 'hsl(var(--primary) / 0.4)', details: ['Embeds user query using same model as ingestion', 'Ensures vector space compatibility', 'Batched for efficiency'] },
  { id: 'cosine-similarity', x: 440, y: 172, w: 140, h: 50, title: 'Cosine Similarity', subtitle: 'Threshold ≥ 0.65 · Top-5', details: ['Cosine similarity against pgvector index', 'Threshold 0.65 — below is discarded', 'Returns top-5 matching chunks'] },
  { id: 'inject-context', x: 440, y: 232, w: 140, h: 30, title: 'Inject context → AI prompt', fill: 'hsl(var(--primary) / 0.1)', stroke: 'hsl(var(--primary) / 0.4)', details: ['Retrieved chunks injected into system prompt', 'Source citations preserved for evidence'] },
  { id: 'sha256-hashing', x: 640, y: 52, w: 140, h: 50, title: 'SHA-256 Hashing', subtitle: 'Change detection', details: ['Content hash per chunk for change detection', 'Compares current vs stored hash', 'Only re-embeds changed chunks'] },
  { id: 'stale-detection', x: 640, y: 112, w: 140, h: 50, title: 'Stale Detection', subtitle: '7-day threshold', details: ['Flags chunks older than 7 days', 'Sends refresh reminders to tenant', 'Dashboard shows stale source count'] },
  { id: 'biweekly-reminders', x: 640, y: 172, w: 140, h: 50, title: 'Biweekly Reminders', subtitle: 'Tenant email prompts', details: ['Automated email to tenant admin', 'Lists stale sources and last-refresh dates', 'One-click link to dashboard'] },
  { id: 'manual-rescrape', x: 640, y: 232, w: 140, h: 30, title: 'Manual re-scrape endpoint', fill: 'hsl(var(--accent) / 0.1)', stroke: 'hsl(var(--accent) / 0.4)', details: ['Admin can trigger immediate re-scrape', 'Bypasses the scheduled refresh cycle'] },
]

export function VoiceRAGPipelineDiagram() {
  const svgRef = useRef<SVGSVGElement>(null)
  const { activeNode, showNode, hideNode, toggleNode } = useDiagramTooltip()

  return (
    <div className="my-8 w-full overflow-x-auto" style={{ position: 'relative' }}>
      <svg ref={svgRef} viewBox="0 0 820 360" className="w-full min-w-[700px] h-auto" role="img" aria-label="RAG pipeline diagram showing four stages: ingestion from website scraping, FAQ, and Google Drive; storage in Postgres with pgvector and RLS; retrieval via keyword trigger, embedding, and cosine similarity search; refresh via SHA-256 hashing and stale detection">
        <title>Voice Agent RAG Pipeline Diagram</title>
        <defs>
          <linearGradient id="rag-grad-ingest" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="hsl(var(--primary) / 0.15)" /><stop offset="100%" stopColor="hsl(var(--primary) / 0.05)" /></linearGradient>
          <linearGradient id="rag-grad-store" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="hsl(var(--accent) / 0.15)" /><stop offset="100%" stopColor="hsl(var(--accent) / 0.05)" /></linearGradient>
          <linearGradient id="rag-grad-retrieve" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="hsl(var(--primary) / 0.12)" /><stop offset="100%" stopColor="hsl(var(--primary) / 0.03)" /></linearGradient>
          <linearGradient id="rag-grad-refresh" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="hsl(var(--accent) / 0.12)" /><stop offset="100%" stopColor="hsl(var(--accent) / 0.03)" /></linearGradient>
          <marker id="rag-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground) / 0.6)" /></marker>
        </defs>

        <text x="110" y="22" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Ingestion</text>
        <text x="310" y="22" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Storage</text>
        <text x="510" y="22" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Retrieval</text>
        <text x="710" y="22" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Refresh</text>

        <rect x="20" y="32" width="180" height="240" rx="12" fill="url(#rag-grad-ingest)" stroke="hsl(var(--primary) / 0.15)" strokeWidth="1" />
        <rect x="220" y="32" width="180" height="240" rx="12" fill="url(#rag-grad-store)" stroke="hsl(var(--accent) / 0.15)" strokeWidth="1" />
        <rect x="420" y="32" width="180" height="240" rx="12" fill="url(#rag-grad-retrieve)" stroke="hsl(var(--primary) / 0.15)" strokeWidth="1" />
        <rect x="620" y="32" width="180" height="240" rx="12" fill="url(#rag-grad-refresh)" stroke="hsl(var(--accent) / 0.15)" strokeWidth="1" />

        <line x1="200" y1="152" x2="220" y2="152" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#rag-arrow)" />
        <line x1="400" y1="152" x2="420" y2="152" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#rag-arrow)" />
        <line x1="600" y1="152" x2="620" y2="152" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#rag-arrow)" />

        {/* Interactive nodes */}
        {nodes.map((n) => (
          <g key={n.id} {...nodeHandlers(n, showNode, hideNode, toggleNode)} data-active={activeNode?.id === n.id ? 'true' : undefined}>
            <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="8" fill={n.fill ?? 'hsl(var(--background))'} stroke={n.stroke ?? 'hsl(var(--primary) / 0.3)'} strokeWidth="1.5" />
            <text x={n.x + n.w / 2} y={n.y + n.h / 2 - 4} textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600, pointerEvents: 'none' }}>{n.title}</text>
            {n.subtitle && <text x={n.x + n.w / 2} y={n.y + n.h / 2 + 10} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10, pointerEvents: 'none' }}>{n.subtitle}</text>}
          </g>
        ))}

        <rect x="100" y="290" width="620" height="24" rx="4" fill="hsl(var(--background))" stroke="hsl(var(--muted) / 0.3)" strokeWidth="1" strokeDasharray="4 2" />
        <text x="410" y="306" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Per-tenant · Opt-out · Frontend API first → Supabase RPC fallback · Mode-compatible (adaptive, realtime)</text>
        <path d="M 710 262 Q 710 330 410 330 Q 110 330 110 272" fill="none" stroke="hsl(var(--muted-foreground) / 0.3)" strokeWidth="1" strokeDasharray="4 3" markerEnd="url(#rag-arrow)" />
        <text x="410" y="345" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>Re-ingest on content change</text>
      </svg>
      <DiagramTooltip viewBoxW={820} viewBoxH={360} active={activeNode} svgRef={svgRef} onClose={hideNode} />
    </div>
  )
}
