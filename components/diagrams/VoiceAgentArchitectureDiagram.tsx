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
  highlight?: boolean
}

const nodes: NodeDef[] = [
  {
    id: 'nextjs-dashboard',
    x: 120, y: 50, w: 200, h: 60,
    title: 'Next.js Dashboard',
    subtitle: 'Configuration · RAG Management',
    details: [
      'Tenant configuration UI for hours, services, transfer rules',
      'RAG source management — approve, review, refresh, delete',
      'Built on Next.js app router, deployed on Vercel',
    ],
  },
  {
    id: 'analytics',
    x: 360, y: 50, w: 160, h: 60,
    title: 'Analytics & Reports',
    subtitle: 'Call logs · Scorecards',
    details: [
      'Real-time call dashboard with transcripts and tool calls',
      'Scorecards: resolution rate, avg duration, fallback count',
      'Exportable evidence for compliance audits',
    ],
  },
  {
    id: 'webrtc-client',
    x: 560, y: 50, w: 160, h: 60,
    title: 'WebRTC Client',
    subtitle: 'Browser-based calling',
    details: [
      'In-browser calling via Twilio WebRTC SDK',
      'Fallback for tenants without phone numbers',
      'Supports call transfer and hold',
    ],
  },
  {
    id: 'tenant-resolution',
    x: 80, y: 170, w: 130, h: 56,
    title: 'Tenant Resolution',
    subtitle: 'Number → tenant config',
    details: [
      'Resolves inbound phone number to tenant UUID',
      'Loads business config: hours, services, transfer rules',
      'Falls back to default tenant if unmatched',
    ],
  },
  {
    id: 'mode-selection',
    x: 230, y: 170, w: 130, h: 56,
    title: 'Mode Selection',
    subtitle: 'Realtime · Adaptive · Gather',
    details: [
      'Chooses AI mode based on plan tier and credit balance',
      'Realtime: full duplex conversation',
      'Adaptive: switches between modes mid-call',
      'Gather: structured data collection only',
    ],
  },
  {
    id: 'router',
    x: 380, y: 170, w: 130, h: 56,
    title: 'L1 / L2 / L3 Router',
    subtitle: 'Interrupt · Fast path · AI',
    fill: 'hsl(var(--accent) / 0.1)',
    stroke: 'hsl(var(--accent) / 0.4)',
    highlight: true,
    details: [
      'L1: deterministic hard interrupts (hours, transfer)',
      'L2: fast-path answers from tenant config',
      'L3: realtime AI reasoning with RAG',
      'Routes by intent classification, not random',
    ],
  },
  {
    id: 'tools-rag',
    x: 530, y: 170, w: 130, h: 56,
    title: 'Tools & RAG',
    subtitle: 'Calendar · CRM · Knowledge',
    details: [
      'Calendar: check availability, create bookings',
      'CRM: create/update contacts, log calls',
      'RAG: tenant-scoped vector retrieval from approved sources',
    ],
  },
  {
    id: 'guardrails',
    x: 80, y: 240, w: 280, h: 50,
    title: 'Guardrails & Degradation',
    subtitle: 'Circuit breaker · Credit checks · Duration caps',
    details: [
      'Circuit breaker: stops AI if repeated failures',
      'Credit checks: verifies tenant balance before each call',
      'Duration caps: hard limit on call length',
      'Four-level degradation: AI → fast-path → voicemail → hang-up',
    ],
  },
  {
    id: 'post-call',
    x: 380, y: 240, w: 280, h: 50,
    title: 'Post-Call Pipeline',
    subtitle: 'Intelligence · Actions · Webhooks · Evidence',
    details: [
      'Extracts structured outcomes: intent, resolution, sentiment',
      'Executes deferred actions: follow-up SMS, CRM updates',
      'Fires webhooks to tenant integrations',
      'Stores full evidence: transcript, tool calls, prompt hashes',
    ],
  },
  {
    id: 'telephony',
    x: 80, y: 350, w: 200, h: 130,
    title: 'Telephony (Twilio)',
    subtitle: 'Programmable Voice · Media Streams',
    details: [
      'Programmable Voice for inbound and outbound calls',
      'Media Streams for realtime audio to AI pipeline',
      'TwiML for call control and routing',
      'Signature validation on all webhooks',
      'Number provisioning per tenant',
    ],
  },
  {
    id: 'demand-engine',
    x: 300, y: 350, w: 200, h: 130,
    title: 'Demand Engine',
    subtitle: 'CRM · Onboarding · Analytics',
    details: [
      'CRM: contacts, leads, pipeline management',
      'Onboarding: tenant provisioning, number assignment',
      'Analytics: usage tracking, reporting dashboards',
      'Appointments: calendar sync, booking management',
    ],
  },
  {
    id: 'data-layer',
    x: 520, y: 350, w: 200, h: 130,
    title: 'Data (Supabase)',
    subtitle: 'Postgres + pgvector',
    fill: 'hsl(var(--primary) / 0.1)',
    stroke: 'hsl(var(--primary) / 0.4)',
    highlight: true,
    details: [
      'Postgres with pgvector for embeddings',
      'Row-Level Security for tenant isolation',
      'Tenant configs, call logs, RAG chunks, embeddings',
      'Auth and Realtime subscriptions for live updates',
    ],
  },
]

export function VoiceAgentArchitectureDiagram() {
  const svgRef = useRef<SVGSVGElement>(null)
  const { activeNode, showNode, hideNode, toggleNode } = useDiagramTooltip()

  return (
    <div className="my-8 w-full overflow-x-auto" style={{ position: 'relative' }}>
      <svg
        ref={svgRef}
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
        <text x="400" y="322" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Telephony · Demand Engine · Data</text>

        {/* Layer backgrounds */}
        <rect x="50" y="30" width="700" height="100" rx="12" fill="url(#va-grad-pres)" stroke="hsl(var(--primary) / 0.15)" strokeWidth="1" />
        <rect x="50" y="150" width="700" height="160" rx="12" fill="url(#va-grad-runtime)" stroke="hsl(var(--accent) / 0.15)" strokeWidth="1" />
        <rect x="50" y="330" width="700" height="170" rx="12" fill="url(#va-grad-infra)" stroke="hsl(var(--primary) / 0.15)" strokeWidth="1" />

        {/* Arrows */}
        <line x1="400" y1="130" x2="400" y2="150" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#va-arrowhead)" />
        <line x1="400" y1="310" x2="400" y2="330" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#va-arrowhead)" />

        {/* Interactive nodes */}
        {nodes.map((n) => (
          <g
            key={n.id}
            {...nodeHandlers(n, showNode, hideNode, toggleNode)}
            data-active={activeNode?.id === n.id ? 'true' : undefined}
          >
            <rect
              x={n.x}
              y={n.y}
              width={n.w}
              height={n.h}
              rx="8"
              fill={n.fill ?? 'hsl(var(--background))'}
              stroke={n.stroke ?? 'hsl(var(--primary) / 0.3)'}
              strokeWidth="1.5"
            />
            <text
              x={n.x + n.w / 2}
              y={n.y + n.h / 2 - 4}
              textAnchor="middle"
              className="fill-foreground"
              style={{ fontSize: 12, fontWeight: 600, pointerEvents: 'none' }}
            >
              {n.title}
            </text>
            {n.subtitle && (
              <text
                x={n.x + n.w / 2}
                y={n.y + n.h / 2 + 12}
                textAnchor="middle"
                className="fill-muted-foreground"
                style={{ fontSize: 10, pointerEvents: 'none' }}
              >
                {n.subtitle}
              </text>
            )}
          </g>
        ))}

        {/* Deployment badge */}
        <rect x="250" y="496" width="300" height="20" rx="4" fill="hsl(var(--background))" stroke="hsl(var(--muted) / 0.3)" strokeWidth="1" strokeDasharray="4 2" />
        <text x="400" y="510" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Deployed on Modal (serverless) · Vercel (frontend)</text>
      </svg>

      <DiagramTooltip
        viewBoxW={800}
        viewBoxH={520}
        active={activeNode}
        svgRef={svgRef}
        onClose={hideNode}
      />
    </div>
  )
}
