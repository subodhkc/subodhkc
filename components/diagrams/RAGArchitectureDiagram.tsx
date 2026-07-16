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
  { id: 'documents', x: 80, y: 52, w: 140, h: 56, title: 'Documents', subtitle: 'PDF, DOCX, HTML', details: ['Source files for ingestion pipeline', 'Supported: PDF, DOCX, HTML, TXT', 'Classified by sensitivity level'] },
  { id: 'databases', x: 80, y: 120, w: 140, h: 56, title: 'Databases', subtitle: 'SQL, NoSQL, APIs', details: ['Structured data sources', 'Direct connector or API integration', 'Field-level access control mapping'] },
  { id: 'parse-clean', x: 290, y: 86, w: 130, h: 56, title: 'Parse & Clean', subtitle: 'Classify, deduplicate', details: ['Extract text from source formats', 'Remove duplicates and boilerplate', 'Classify by sensitivity and tenant'] },
  { id: 'chunk', x: 490, y: 86, w: 120, h: 56, title: 'Chunk', subtitle: 'Logical sections', details: ['Split into 500-token chunks with 50 overlap', 'Preserve section boundaries', 'Maintain source provenance per chunk'] },
  { id: 'embed', x: 680, y: 86, w: 100, h: 56, title: 'Embed', subtitle: 'Vector model', fill: 'hsl(var(--primary) / 0.1)', stroke: 'hsl(var(--primary) / 0.4)', details: ['Generate 1536-dim embeddings', 'Same model for ingestion and retrieval', 'Batched for throughput'] },
  { id: 'vector-index', x: 100, y: 252, w: 180, h: 90, title: 'Vector Index', subtitle: 'Embeddings + distance', details: ['HNSW or IVFFlat ANN index', 'Cosine similarity search', 'pgvector, MongoDB, or Databricks', 'Tuned for sub-100ms retrieval'] },
  { id: 'metadata', x: 310, y: 252, w: 180, h: 90, title: 'Metadata', subtitle: 'Tenant, classification', details: ['Tenant ID, source, type, owner', 'Version, effective date, status', 'Enables pre-retrieval filtering'] },
  { id: 'rls', x: 520, y: 252, w: 180, h: 90, title: 'Row-Level Security', subtitle: 'Tenant isolation', fill: 'hsl(var(--accent) / 0.1)', stroke: 'hsl(var(--accent) / 0.4)', details: ['Database-enforced tenant isolation', 'Access policies per role and group', 'Applied before retrieval — not in app layer'] },
  { id: 'user-question', x: 100, y: 402, w: 140, h: 56, title: 'User Question', subtitle: 'Authenticated', details: ['User is authenticated with tenant + role', 'Question is logged for audit', 'Rate-limited per tenant'] },
  { id: 'auth-filter', x: 310, y: 402, w: 150, h: 56, title: 'Auth + Filter', subtitle: 'Tenant, role, groups', fill: 'hsl(var(--primary) / 0.1)', stroke: 'hsl(var(--primary) / 0.4)', details: ['Apply tenant and role filters', 'Restrict to allowed document groups', 'Enforce classification-level access'] },
  { id: 'hybrid-search', x: 530, y: 402, w: 150, h: 56, title: 'Hybrid Search', subtitle: 'Vector + keyword', details: ['Combine semantic vector search with keyword BM25', 'Weighted fusion of results', 'Top-K candidates retrieved'] },
  { id: 'rerank', x: 530, y: 494, w: 150, h: 30, title: 'Rerank', subtitle: 'Cross-encoder', fill: 'hsl(var(--primary) / 0.1)', stroke: 'hsl(var(--primary) / 0.4)', details: ['Cross-encoder reranking for precision', 'Re-scores top candidates against query', 'Final top-5 selected'] },
  { id: 'approved-context', x: 100, y: 572, w: 140, h: 56, title: 'Approved Context', subtitle: 'Filtered evidence', details: ['Only RLS-approved chunks reach the model', 'Source citations preserved', 'Token budget managed'] },
  { id: 'generation-model', x: 310, y: 572, w: 150, h: 56, title: 'Generation Model', subtitle: 'LLM with evidence', fill: 'hsl(var(--accent) / 0.1)', stroke: 'hsl(var(--accent) / 0.4)', details: ['LLM generates answer from approved context', 'Prompt includes source references', 'Guardrails prevent hallucination beyond context'] },
  { id: 'answer-citations', x: 530, y: 572, w: 150, h: 56, title: 'Answer + Citations', subtitle: 'Source references', details: ['Answer includes inline citations', 'User can verify source chunks', 'Confidence score displayed'] },
]

export function RAGArchitectureDiagram() {
  const svgRef = useRef<SVGSVGElement>(null)
  const { activeNode, showNode, hideNode, toggleNode } = useDiagramTooltip()

  return (
    <div className="my-8 w-full overflow-x-auto" style={{ position: 'relative' }}>
      <svg ref={svgRef} viewBox="0 0 800 720" className="w-full min-w-[600px] h-auto" role="img" aria-label="Enterprise RAG architecture diagram showing the flow from data sources through processing, embedding, storage, retrieval, and generation">
        <title>Enterprise RAG Architecture Diagram</title>
        <defs>
          <linearGradient id="grad-ingest" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="hsl(var(--primary) / 0.15)" /><stop offset="100%" stopColor="hsl(var(--primary) / 0.05)" /></linearGradient>
          <linearGradient id="grad-store" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="hsl(var(--accent) / 0.15)" /><stop offset="100%" stopColor="hsl(var(--accent) / 0.05)" /></linearGradient>
          <linearGradient id="grad-retrieve" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="hsl(var(--primary) / 0.12)" /><stop offset="100%" stopColor="hsl(var(--primary) / 0.03)" /></linearGradient>
          <linearGradient id="grad-generate" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="hsl(var(--accent) / 0.12)" /><stop offset="100%" stopColor="hsl(var(--accent) / 0.03)" /></linearGradient>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground) / 0.6)" /></marker>
        </defs>

        <text x="400" y="24" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Ingestion</text>
        <text x="400" y="224" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Storage</text>
        <text x="400" y="374" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Retrieval</text>
        <text x="400" y="544" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Generation</text>

        <rect x="50" y="32" width="700" height="180" rx="12" fill="url(#grad-ingest)" stroke="hsl(var(--primary) / 0.15)" strokeWidth="1" />
        <rect x="50" y="232" width="700" height="130" rx="12" fill="url(#grad-store)" stroke="hsl(var(--accent) / 0.15)" strokeWidth="1" />
        <rect x="50" y="382" width="700" height="150" rx="12" fill="url(#grad-retrieve)" stroke="hsl(var(--primary) / 0.15)" strokeWidth="1" />
        <rect x="50" y="552" width="700" height="150" rx="12" fill="url(#grad-generate)" stroke="hsl(var(--accent) / 0.15)" strokeWidth="1" />

        {/* Arrows */}
        <line x1="220" y1="114" x2="280" y2="114" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
        <line x1="420" y1="114" x2="480" y2="114" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
        <line x1="610" y1="114" x2="670" y2="114" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
        <line x1="730" y1="142" x2="730" y2="192" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
        <line x1="730" y1="192" x2="400" y2="192" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="400" y1="192" x2="400" y2="238" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
        <line x1="400" y1="362" x2="400" y2="388" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
        <line x1="240" y1="430" x2="300" y2="430" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
        <line x1="460" y1="430" x2="520" y2="430" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
        <line x1="605" y1="458" x2="605" y2="490" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
        <line x1="605" y1="524" x2="605" y2="548" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="605" y1="548" x2="400" y2="548" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="400" y1="548" x2="400" y2="560" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
        <line x1="240" y1="600" x2="300" y2="600" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
        <line x1="460" y1="600" x2="520" y2="600" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />

        {/* Interactive nodes */}
        {nodes.map((n) => (
          <g key={n.id} {...nodeHandlers(n, showNode, hideNode, toggleNode)} data-active={activeNode?.id === n.id ? 'true' : undefined}>
            <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="8" fill={n.fill ?? 'hsl(var(--background))'} stroke={n.stroke ?? 'hsl(var(--primary) / 0.3)'} strokeWidth="1.5" />
            <text x={n.x + n.w / 2} y={n.y + n.h / 2 - 4} textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 600, pointerEvents: 'none' }}>{n.title}</text>
            {n.subtitle && <text x={n.x + n.w / 2} y={n.y + n.h / 2 + 12} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10, pointerEvents: 'none' }}>{n.subtitle}</text>}
          </g>
        ))}

        {/* Audit log */}
        <rect x="200" y="650" width="400" height="36" rx="6" fill="hsl(var(--background))" stroke="hsl(var(--muted) / 0.3)" strokeWidth="1" strokeDasharray="4 2" />
        <text x="400" y="673" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 11 }}>Audit Log: user, query, filters, sources, model version, output</text>
      </svg>
      <DiagramTooltip viewBoxW={800} viewBoxH={720} active={activeNode} svgRef={svgRef} onClose={hideNode} />
    </div>
  )
}
