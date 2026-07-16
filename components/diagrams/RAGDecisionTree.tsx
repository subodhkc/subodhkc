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
  { id: 'dt-root', x: 280, y: 16, w: 260, h: 50, title: 'What will the system support?', subtitle: 'Impact level determines controls', fill: 'url(#dt-grad-q)', stroke: 'hsl(var(--primary) / 0.3)', details: ['Root decision: what decisions will the AI system support?', 'Impact level determines required controls and guardrails', 'Drives all downstream architecture choices'] },
  { id: 'dt-low', x: 60, y: 110, w: 180, h: 44, title: 'Low Impact', subtitle: 'FAQ, docs, general info', details: ['Low-risk use cases: FAQs, documentation, general info', 'Minimal controls required', 'Still needs tenant isolation and audit'] },
  { id: 'dt-medium', x: 320, y: 110, w: 180, h: 44, title: 'Medium Impact', subtitle: 'Operations, support', details: ['Medium-risk: operations, customer support', 'Requires approval workflows', 'Needs RLS and tool authorization'] },
  { id: 'dt-high', x: 580, y: 110, w: 180, h: 44, title: 'High Impact', subtitle: 'Legal, clinical, financial', details: ['High-risk: legal, clinical, financial decisions', 'Full 4-layer security required', 'Human approval mandatory for actions'] },
  { id: 'dt-search-method', x: 280, y: 204, w: 260, h: 50, title: 'What search method fits?', subtitle: 'Match method to data type', fill: 'url(#dt-grad-q)', stroke: 'hsl(var(--primary) / 0.3)', details: ['Choose search method based on data type and query pattern', 'SQL for structured counts and metrics', 'Keyword for exact IDs and codes', 'Vector for semantic meaning', 'Hybrid for mixed intent'] },
  { id: 'dt-sql', x: 30, y: 298, w: 140, h: 50, title: 'SQL', subtitle: 'Counts, totals, metrics', details: ['Structured queries for counts, totals, metrics', 'Fastest path for quantitative questions', 'No embedding overhead'] },
  { id: 'dt-keyword', x: 237, y: 298, w: 140, h: 50, title: 'Keyword Search', subtitle: 'IDs, codes, exact terms', details: ['Exact match for IDs, codes, and specific terms', 'BM25 or similar ranking', 'Complements vector search in hybrid mode'] },
  { id: 'dt-vector', x: 443, y: 298, w: 140, h: 50, title: 'Vector Search', subtitle: 'Semantic meaning', details: ['Semantic similarity via embeddings', 'Handles paraphrased or fuzzy queries', 'Requires embedding model and vector index'] },
  { id: 'dt-hybrid', x: 650, y: 298, w: 140, h: 50, title: 'Hybrid / Agentic', subtitle: 'Mixed intent', fill: 'hsl(var(--accent) / 0.1)', stroke: 'hsl(var(--accent) / 0.4)', details: ['Combines SQL, keyword, and vector search', 'Agent decides which method per query', 'Most flexible but most complex to govern'] },
  { id: 'dt-storage', x: 270, y: 398, w: 280, h: 50, title: 'Where should vectors live?', subtitle: 'Existing DB vs dedicated platform', fill: 'url(#dt-grad-q)', stroke: 'hsl(var(--primary) / 0.3)', details: ['Decide: keep vectors in existing DB or add dedicated platform', 'Existing DB: simpler security, joins, backup', 'Dedicated: independent scaling, but sync required'] },
  { id: 'dt-existing-db', x: 100, y: 492, w: 220, h: 56, title: 'Keep Vectors in Existing DB', subtitle: 'pgvector / MongoDB Vector Search', fill: 'url(#dt-grad-s)', stroke: 'hsl(var(--accent) / 0.3)', details: ['pgvector for PostgreSQL or MongoDB Vector Search', 'Simpler security model — same RLS policies', 'Joins with business data, unified backup', 'Best for moderate scale (< 10M vectors)'] },
  { id: 'dt-dedicated', x: 500, y: 492, w: 220, h: 56, title: 'Add Dedicated Vector Platform', subtitle: 'Databricks AI Search / sidecar', fill: 'url(#dt-grad-s)', stroke: 'hsl(var(--accent) / 0.3)', details: ['Databricks AI Search or sidecar vector DB', 'Independent scaling for large vector workloads', 'Requires sync pipeline between DB and vector store', 'Best for > 10M vectors or specialized ANN'] },
  { id: 'dt-security', x: 180, y: 598, w: 460, h: 64, title: 'Apply 4-Layer Security', subtitle: 'Source · Retrieval · App · Generation', fill: 'hsl(var(--primary) / 0.08)', stroke: 'hsl(var(--primary) / 0.35)', details: ['Source: DB permissions + secure views', 'Retrieval: Tenant + classification filters', 'App: Auth + tool authorization', 'Generation: Prompt guardrails and output validation'] },
]

export function RAGDecisionTree() {
  const svgRef = useRef<SVGSVGElement>(null)
  const { activeNode, showNode, hideNode, toggleNode } = useDiagramTooltip()

  return (
    <div className="my-8 w-full overflow-x-auto" style={{ position: 'relative' }}>
      <svg ref={svgRef} viewBox="0 0 820 680" className="w-full min-w-[700px] h-auto" role="img" aria-label="Decision tree for choosing RAG architecture: question type determines search method, which determines storage and security requirements">
        <title>RAG Decision Tree</title>
        <defs>
          <linearGradient id="dt-grad-q" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="hsl(var(--primary) / 0.12)" /><stop offset="100%" stopColor="hsl(var(--primary) / 0.03)" /></linearGradient>
          <linearGradient id="dt-grad-s" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="hsl(var(--accent) / 0.12)" /><stop offset="100%" stopColor="hsl(var(--accent) / 0.03)" /></linearGradient>
          <marker id="dt-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground) / 0.5)" /></marker>
          <marker id="dt-arrow-yes" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--primary) / 0.6)" /></marker>
          <marker id="dt-arrow-no" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground) / 0.4)" /></marker>
        </defs>

        {/* Branch lines */}
        <line x1="410" y1="66" x2="410" y2="86" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="150" y1="86" x2="670" y2="86" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="150" y1="86" x2="150" y2="106" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#dt-arrow)" />
        <line x1="410" y1="86" x2="410" y2="106" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#dt-arrow)" />
        <line x1="670" y1="86" x2="670" y2="106" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#dt-arrow)" />
        <line x1="150" y1="154" x2="150" y2="180" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="410" y1="154" x2="410" y2="180" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="670" y1="154" x2="670" y2="180" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="150" y1="180" x2="670" y2="180" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="410" y1="180" x2="410" y2="200" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#dt-arrow)" />
        <line x1="410" y1="254" x2="410" y2="274" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="100" y1="274" x2="720" y2="274" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="100" y1="274" x2="100" y2="294" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#dt-arrow)" />
        <line x1="307" y1="274" x2="307" y2="294" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#dt-arrow)" />
        <line x1="513" y1="274" x2="513" y2="294" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#dt-arrow)" />
        <line x1="720" y1="274" x2="720" y2="294" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#dt-arrow)" />
        <line x1="100" y1="348" x2="100" y2="374" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="307" y1="348" x2="307" y2="374" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="513" y1="348" x2="513" y2="374" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="720" y1="348" x2="720" y2="374" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="100" y1="374" x2="720" y2="374" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="410" y1="374" x2="410" y2="394" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#dt-arrow)" />
        <line x1="410" y1="448" x2="410" y2="468" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="210" y1="468" x2="610" y2="468" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="210" y1="468" x2="210" y2="488" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1.5" markerEnd="url(#dt-arrow-yes)" />
        <line x1="610" y1="468" x2="610" y2="488" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#dt-arrow-no)" />
        <text x="250" y="464" className="fill-muted-foreground" style={{ fontSize: 10, fontWeight: 600 }}>Yes — existing DB works</text>
        <text x="530" y="464" className="fill-muted-foreground" style={{ fontSize: 10, fontWeight: 600 }}>No — need scale/specialization</text>
        <line x1="210" y1="548" x2="210" y2="574" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="610" y1="548" x2="610" y2="574" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="210" y1="574" x2="610" y2="574" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="410" y1="574" x2="410" y2="594" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#dt-arrow)" />

        {/* Interactive nodes */}
        {nodes.map((n) => (
          <g key={n.id} {...nodeHandlers(n, showNode, hideNode, toggleNode)} data-active={activeNode?.id === n.id ? 'true' : undefined}>
            <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="8" fill={n.fill ?? 'hsl(var(--background))'} stroke={n.stroke ?? 'hsl(var(--primary) / 0.25)'} strokeWidth="1.5" />
            <text x={n.x + n.w / 2} y={n.y + n.h / 2 - 4} textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600, pointerEvents: 'none' }}>{n.title}</text>
            {n.subtitle && <text x={n.x + n.w / 2} y={n.y + n.h / 2 + 10} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10, pointerEvents: 'none' }}>{n.subtitle}</text>}
          </g>
        ))}
      </svg>
      <DiagramTooltip viewBoxW={820} viewBoxH={680} active={activeNode} svgRef={svgRef} onClose={hideNode} />
    </div>
  )
}
