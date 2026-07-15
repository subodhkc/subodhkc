import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { LeadMagnetCard } from '@/components/LeadMagnetCard'
import Link from 'next/link'
import Grid from '@/components/Grid'
import { VoiceAgentArchitectureDiagram } from '@/components/diagrams/VoiceAgentArchitectureDiagram'
import { VoiceRAGPipelineDiagram } from '@/components/diagrams/VoiceRAGPipelineDiagram'
import {
  Phone, PhoneCall, Shield, Zap, Database, Cpu, Webhook, Gauge,
  RefreshCw, AlertTriangle, Lock, CheckCircle2,
  Layers, Server, Cloud, FileText, Users, Calendar, Ban, Video,
  MessageSquare, MonitorSmartphone, Brain, Workflow, Building2, ArrowRight,
} from 'lucide-react'
import {
  faqs, tocItems, callSteps, fourModes, adaptiveLayers,
  fallbackTable, intelligenceFields, learningSteps, learningGuardrails,
  beyondInboundFeatures, multiChannelFeatures, securityDomains,
  techDecisions, limitations, relatedResources,
} from './data'

export const metadata = {
  title: 'AI Voice Agent Architecture: How Kestrel Voice Works | Subodh KC',
  description: 'See how Kestrel Voice combines telephony, custom Python orchestration, realtime AI, RAG, business tools, fallback modes, and operational analytics in a production voice agent platform.',
  alternates: { canonical: 'https://subodhkc.com/ai-voice-agent-architecture' },
  openGraph: {
    title: 'AI Voice Agent Architecture: How Kestrel Voice Works',
    description: 'Custom Python orchestration, realtime voice, deterministic guardrails, RAG, business tools, fallback modes, and operational evidence.',
    url: 'https://subodhkc.com/ai-voice-agent-architecture',
    type: 'article', authors: ['Subodh KC'],
    publishedTime: '2026-07-15', modifiedTime: '2026-07-15',
    tags: ['AI voice agent architecture', 'voice agent RAG', 'AI telephony', 'Kestrel Voice', 'HAIEC', 'voice orchestration', 'AI voice guardrails'],
    images: ['https://subodhkc.com/og-default.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Voice Agent Architecture: How Kestrel Voice Works',
    description: 'Custom Python orchestration, realtime voice, deterministic guardrails, RAG, business tools, fallback modes, and operational evidence.',
    images: ['https://subodhkc.com/og-default.png'],
  },
  robots: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  keywords: [
    'AI voice agent architecture', 'voice agent orchestration',
    'AI voice platform design', 'realtime voice AI',
    'adaptive AI voice agent', 'voice agent RAG',
    'AI voice guardrails', 'voice agent fallback modes',
    'AI voice tenant isolation', 'multi-tenant voice AI',
    'AI voice post-call intelligence', 'voice agent learning pipeline',
    'AI copilot for calls', 'AI voice outbound dialer',
    'AI meeting bridge', 'AI voice security',
    'AI voice spam protection', 'AI voice fraud prevention',
    'TCPA AI voice compliance', 'AI voice degraded mode',
    'custom Python voice orchestration', 'Kestrel Voice architecture',
    'HAIEC AI compliance', 'AI voice evidence pipeline',
    'AI voice action engine', 'voice agent circuit breaker',
    'AI voice cost protection', 'AI voice sequential ring',
    'AI voice WebRTC', 'AI voice SMS integration',
  ],
  about: ['AI voice agents', 'voice orchestration', 'AI telephony', 'Kestrel Voice', 'RAG', 'HAIEC'],
}

const articleSchema = {
  '@context': 'https://schema.org', '@type': 'TechArticle',
  headline: 'AI Voice Agent Architecture: How Kestrel Voice Works',
  description: 'See how Kestrel Voice combines telephony, custom Python orchestration, realtime AI, RAG, business tools, fallback modes, and operational analytics.',
  author: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com/person/subodh-kc' },
  publisher: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
  datePublished: '2026-07-15', dateModified: '2026-07-15',
  url: 'https://subodhkc.com/ai-voice-agent-architecture',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://subodhkc.com/ai-voice-agent-architecture' },
  image: 'https://subodhkc.com/og-default.png', inLanguage: 'en',
  articleSection: 'AI Voice Architecture', wordCount: 7500,
  about: { '@type': 'SoftwareApplication', name: 'Kestrel Voice', applicationCategory: 'Voice AI Platform' },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'Writing', item: 'https://subodhkc.com/writing' },
    { '@type': 'ListItem', position: 3, name: 'AI Voice Agent Architecture', item: 'https://subodhkc.com/ai-voice-agent-architecture' },
  ],
}

const faqSchema = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })),
}

const modeIcons = [Phone, Zap, Layers, PhoneCall]
const adaptiveIcons = [Ban, Zap, Cpu]
const adaptiveColors = ['text-red-600', 'text-amber-600', 'text-blue-600']
const adaptiveBgs = ['bg-red-500/10', 'bg-amber-500/10', 'bg-blue-500/10']
const beyondInboundIcons = [PhoneCall, Users, Brain, Phone]
const multiChannelIcons = [MessageSquare, Video, MonitorSmartphone]
const securityIcons = [Webhook, Lock, Shield, Gauge, FileText, Building2]
const techIcons = [Cpu, Brain, Phone, Database, Cloud, Server]
const relatedIcons = [Phone, Zap, Shield, Database, Lock, AlertTriangle]

export default function AIVoiceAgentArchitecturePage() {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Hero
        subtitle="AI Voice Architecture"
        title={<>AI Voice Agent Architecture:<br /><span className="gradient-text">How Kestrel Voice Works</span></>}
        description="Custom Python orchestration, realtime voice, deterministic guardrails, RAG, business tools, fallback modes, and operational evidence — the complete architecture behind a production voice agent platform."
      />

      {/* Metadata + Disclosure */}
      <Section className="pt-8 pb-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-muted-foreground mb-1">By Subodh KC · July 15, 2026 · 30 min read</p>
          <div className="mt-2 rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground space-y-1">
            <p><strong className="text-foreground">Last reviewed:</strong> July 15, 2026</p>
            <p><strong className="text-foreground">Scope:</strong> Production architecture for AI voice agent platforms — telephony, orchestration, RAG, tools, security, fallback modes, post-call intelligence, learning, and multi-channel coverage</p>
            <p><strong className="text-foreground">Disclosure:</strong> Kestrel Voice and HAIEC are platforms developed by Subodh KC. This article refers to Kestrel as the product through which these architectural principles have been applied directly, and HAIEC as the companion AI security, governance, and compliance-readiness platform. Neither platform eliminates AI risk. Their purpose is to make that risk more visible, controlled, testable, and supportable with evidence.</p>
          </div>
          <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/20 p-3">
            <p className="text-xs text-amber-900 dark:text-amber-200"><strong>Educational notice:</strong> This article provides general information about AI voice agent architecture. Legal and regulatory applicability depends on the use case, jurisdiction, data, call purpose, and caller population. Telephony-specific obligations such as TCPA, HIPAA, and state biometric laws require case-by-case analysis.</p>
          </div>
        </div>
      </Section>

      {/* TOC */}
      <Section className="pb-4">
        <div className="max-w-4xl mx-auto">
          <details className="rounded-lg border border-border bg-muted/20 p-4">
            <summary className="cursor-pointer text-sm font-semibold text-foreground">Table of Contents</summary>
            <div className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
              {tocItems.map((item) => (
                <a key={item.id} href={`#${item.id}`} className="text-muted-foreground hover:text-primary transition-colors py-0.5">{item.label}</a>
              ))}
            </div>
          </details>
        </div>
      </Section>

      {/* Synopsis */}
      <Section className="pb-4">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-5">
            <h2 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">Synopsis</h2>
            <p className="text-sm text-foreground/90 leading-relaxed">
              A production AI voice agent is not a model connected to a phone number. It is a layered operational system coordinating telephony, tenant identity, deterministic rules, realtime AI, retrieval-augmented knowledge, tool execution, fallback modes, post-call intelligence, learning, and evidence. This article documents the architecture behind Kestrel Voice — the platform I built to handle real calls for service businesses — covering inbound and outbound call flows, adaptive orchestration, RAG, security, compliance, and the operational pipeline that makes the system trustworthy enough to answer a phone.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['AI Voice Agents', 'Voice Orchestration', 'RAG', 'Security', 'Multi-Channel', 'Kestrel Voice'].map((tag) => (
                <span key={tag} className="rounded-full border border-border bg-muted/30 px-2.5 py-0.5 text-xs text-muted-foreground">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Opening Narrative */}
      <Section className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">Most AI voice agent architecture discussions start and end with the model. Which frontier model powers the conversation? How natural is the voice? How low is the latency?</p>
          <p className="text-sm text-muted-foreground leading-relaxed">These questions matter. But they are the smallest part of a production system.</p>
          <p className="text-sm text-muted-foreground leading-relaxed">When I built Kestrel Voice, the model was the first decision I made and the easiest one to change. The harder work was everything around it: how to resolve which business a call belongs to, how to answer differently for a plumber versus a veterinary clinic, how to handle emergencies before the model speaks, how to ground answers in business-specific knowledge, how to verify that a booking actually succeeded before telling the caller it did, how to degrade gracefully when the realtime API fails, how to prevent toll fraud, how to record calls with proper consent, how to learn from patterns without introducing unsafe behavior, and how to produce evidence that a human can review after the call ends.</p>
          <blockquote className="border-l-4 border-primary/40 pl-4 py-2 my-4">
            <p className="text-sm font-medium text-foreground/90 italic">The model handles the conversation. The architecture handles the business.</p>
          </blockquote>
          <p className="text-sm text-muted-foreground leading-relaxed">This article documents that architecture — not as an abstract framework, but as the actual system running in production today.</p>
        </div>
      </Section>

      {/* Section 1: Direct Answer */}
      <Section id="direct-answer" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">The Direct Answer</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">Kestrel Voice is a multi-tenant AI voice agent platform built on FastAPI, deployed on Modal, and backed by Supabase and Postgres. When a call arrives, the system resolves the called number to a tenant, loads that tenant business configuration, selects an AI mode based on plan and credits, and routes the call through a layered orchestration pipeline: deterministic hard interrupts first, fast-path answers second, and realtime AI reasoning third. RAG grounds the model in tenant-specific knowledge. Tools execute bookings and CRM operations with result verification. A four-level degradation system handles failures. Post-call intelligence extracts structured outcomes. A learning pipeline promotes recurring patterns into fast paths. And every step produces evidence — transcripts, tool calls, prompt hashes, and outcome records — that a human can review.</p>
          <p className="text-sm text-muted-foreground leading-relaxed">The architecture is not a demo. It is an operational system handling real calls for real businesses.</p>
        </div>
      </Section>

      {/* Section 2: Architecture at a Glance */}
      <Section id="architecture-glance" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Architecture at a Glance</h2>
          <VoiceAgentArchitectureDiagram />
          <p className="text-center text-xs text-muted-foreground mt-2">Figure 1 — Five-layer architecture: Presentation (Next.js), Voice Runtime (FastAPI on Modal), Telephony (Twilio), Demand Engine, and Data (Supabase/Postgres with pgvector).</p>
          <p className="text-sm text-muted-foreground leading-relaxed">The diagram shows the five layers of the system. Telephony (Twilio) handles the phone call and media stream. The Voice Runtime (FastAPI on Modal) processes the call through tenant resolution, mode selection, deterministic intercepts, AI conversation, and tool execution. The Data Layer (Supabase/Postgres with pgvector) stores tenant configurations, call logs, RAG chunks, and analytics. The Demand Engine handles CRM, onboarding, and reporting. The Presentation Layer (Next.js) provides the dashboard, RAG management, and configuration UI.</p>
          <p className="text-sm text-muted-foreground leading-relaxed">These are logically separated services with a consolidated deployment option — the voice runtime, demand engine, and scrapers share a single Modal container for cost efficiency, while the frontend runs on Vercel. The separation is logical, not physical, which simplifies operations without sacrificing isolation.</p>
        </div>
      </Section>

      {/* Section 3: Call Arrival */}
      <Section id="call-arrival" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">What Happens When a Call Arrives</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">A call arrives at a Twilio phone number. What happens next is a nine-step sequence that runs before the AI ever speaks.</p>
          <div className="space-y-3">
            {callSteps.map((s) => (
              <Card key={s.step}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{s.step}</div>
                    <div>
                      <CardTitle className="text-sm">{s.title}</CardTitle>
                      <CardDescription className="text-xs mt-1 leading-relaxed">{s.desc}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">Steps 1 through 5 happen in under a second. Step 6 runs on every user utterance. Steps 7 and 8 happen in real time during the conversation. Step 9 runs after the call ends without blocking teardown.</p>
        </div>
      </Section>

      {/* Section 4: Four Modes */}
      <Section id="four-modes" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Four Ways Kestrel Can Handle Calls</h2>
          <Grid cols={2} gap="md">
            {fourModes.map((mode, i) => {
              const Icon = modeIcons[i]
              return (
                <Card key={mode.title}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-base">{mode.title}</CardTitle>
                    </div>
                    <CardDescription className="text-sm leading-relaxed">{mode.desc}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </Grid>
          <p className="text-sm text-muted-foreground leading-relaxed">The mode is selected per call based on the tenant plan, available credits, and configuration. A smart mode router can escalate or downgrade mid-call based on conversation signals — for example, switching from adaptive to gather if the realtime API degrades.</p>
        </div>
      </Section>

      {/* Section 5: Adaptive Orchestration */}
      <Section id="adaptive" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Adaptive Orchestration</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">Adaptive mode is the most architecturally interesting mode. It runs a realtime AI session but intercepts every user utterance through a three-layer router before the model processes it. The goal: answer deterministic questions deterministically, reserve the model for reasoning.</p>
          <div className="space-y-3">
            {adaptiveLayers.map((layer, i) => {
              const Icon = adaptiveIcons[i]
              return (
                <Card key={layer.title}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg ${adaptiveBgs[i]} flex items-center justify-center`}>
                        <Icon className={`h-5 w-5 ${adaptiveColors[i]}`} />
                      </div>
                      <CardTitle className="text-base">{layer.title}</CardTitle>
                    </div>
                    <CardDescription className="text-sm leading-relaxed">{layer.desc}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
          <Card className="border-l-4 border-l-amber-500/40">
            <CardHeader>
              <CardTitle className="text-sm">Circuit Breaker</CardTitle>
              <CardDescription className="text-xs mt-1">If the realtime WebSocket fails three times for a tenant within a five-minute window, a circuit breaker trips. Subsequent calls for that tenant bypass realtime mode and route directly to Gather (turn-based) mode. The breaker recovers after a cooldown period, and the system automatically retries realtime.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-l-blue-500/40">
            <CardHeader>
              <CardTitle className="text-sm">Gather Fallback</CardTitle>
              <CardDescription className="text-xs mt-1">On any WebSocket failure during a realtime or adaptive call, the call falls back to Gather mode without dropping the caller. The conversation continues in turn-based mode until the call ends.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      {/* Section 6: Tenant Runtime */}
      <Section id="tenant-runtime" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Tenant-Specific Business Runtime</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">Every tenant has a unique business configuration stored in Postgres: business name, industry type, greeting, communication style, services offered, service areas, business hours, transfer destination, emergency behavior, appointment settings, and FAQ entries. This configuration is assembled into a system prompt using a three-tier hierarchy.</p>
          <div className="space-y-2">
            {['Tenant-specific override — If the tenant has a custom prompt, it takes precedence.', 'Industry template default — If no custom prompt, the system loads an industry template (HVAC, restaurant, veterinary, dental, legal, etc.) with pre-configured prompts, L2 intent patterns, and FAQ templates.', 'Safe fallback — If neither is available, a generic voice agent prompt is used.'].map((tier, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="flex-shrink-0 w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{i + 1}</span>
                <span className="leading-relaxed">{tier}</span>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <h3 className="text-sm font-semibold mb-2">Prompt Evidence Logged</h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div><strong className="text-foreground">Tenant ID</strong> — Which business the prompt belongs to</div>
              <div><strong className="text-foreground">Source</strong> — Tenant-specific, template, or fallback</div>
              <div><strong className="text-foreground">Template name</strong> — Industry template used (if any)</div>
              <div><strong className="text-foreground">Business name</strong> — Identity injected into prompt</div>
              <div><strong className="text-foreground">Prompt hash</strong> — SHA-256 hash for version tracking</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">The prompt includes temporal context — today date and time — injected automatically to prevent the model from hallucinating dates. "What is your earliest appointment?" gets an answer grounded in the actual calendar, not the model training data.</p>
        </div>
      </Section>

      {/* Section 7: Deterministic vs Generative */}
      <Section id="deterministic-vs-generative" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Deterministic vs Generative Answers</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">A common architecture mistake is sending every user utterance to the model. This increases cost, latency, and hallucination risk. Kestrel separates answers into three categories:</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-border rounded-lg">
              <thead className="bg-muted/30">
                <tr>
                  <th className="text-left p-2 font-semibold text-foreground">Question Type</th>
                  <th className="text-left p-2 font-semibold text-foreground">Answer Source</th>
                  <th className="text-left p-2 font-semibold text-foreground">AI Involved?</th>
                  <th className="text-left p-2 font-semibold text-foreground">Example</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr><td className="p-2 text-muted-foreground">Hours, location, service area</td><td className="p-2 text-muted-foreground">Canonical tenant configuration</td><td className="p-2 text-muted-foreground">No</td><td className="p-2 text-muted-foreground italic">"What time do you close?"</td></tr>
                <tr><td className="p-2 text-muted-foreground">Availability, booking</td><td className="p-2 text-muted-foreground">Live calendar system</td><td className="p-2 text-muted-foreground">No (tool call)</td><td className="p-2 text-muted-foreground italic">"Can I book for Tuesday?"</td></tr>
                <tr><td className="p-2 text-muted-foreground">Policies, warranties, services</td><td className="p-2 text-muted-foreground">RAG (tenant-specific knowledge)</td><td className="p-2 text-muted-foreground">Yes (grounded)</td><td className="p-2 text-muted-foreground italic">"What is your warranty on repairs?"</td></tr>
                <tr><td className="p-2 text-muted-foreground">Ambiguous, multi-part, contextual</td><td className="p-2 text-muted-foreground">AI reasoning</td><td className="p-2 text-muted-foreground">Yes (model)</td><td className="p-2 text-muted-foreground italic">"I think my AC is making a weird noise"</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">The deterministic layer means "What are your hours?" never goes to the model. The answer comes from the tenant configured business hours, injected as a fast-path response. This costs zero AI tokens and returns in zero model-response time. The model is reserved for questions that actually require reasoning — and when it does answer, RAG grounds it in the tenant own knowledge base rather than the model training data.</p>
        </div>
      </Section>

      {/* Section 8: Governed RAG */}
      <Section id="governed-rag" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Governed RAG</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">Kestrel Voice includes a retrieval-augmented generation system that grounds the AI in tenant-specific knowledge. The pipeline has four stages: ingestion, storage, retrieval, and refresh.</p>
          <VoiceRAGPipelineDiagram />
          <p className="text-center text-xs text-muted-foreground mt-2">Figure 2 — RAG pipeline: ingestion from three source types, tenant-scoped storage with RLS, keyword-triggered retrieval with similarity threshold, and SHA-256-based refresh tracking.</p>
          <Grid cols={2} gap="md">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Database className="h-5 w-5 text-primary" /></div>
                  <CardTitle className="text-base">Stage 1: Ingestion</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed space-y-1">
                  <span className="block"><strong>Website scraping</strong> — The tenant provides a URL. The system scrapes the page, extracts text content, and validates the URL to prevent server-side request forgery (private IPs, localhost, and internal domains are blocked).</span>
                  <span className="block"><strong>FAQ ingestion</strong> — FAQ entries from the tenant configuration are chunked and embedded with metadata identifying them as FAQ source type.</span>
                  <span className="block"><strong>Google Drive folder</strong> — Tenants can designate a Drive folder as a knowledge source. The system indexes the content and tracks storage usage.</span>
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center"><Server className="h-5 w-5 text-accent-foreground" /></div>
                  <CardTitle className="text-base">Stage 2: Storage</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">Chunks are stored in Postgres with the pgvector extension. Each chunk includes: content text, embedding vector (1536 dimensions), tenant ID, source URL, source type (website, FAQ, feedback), content hash for versioning, and metadata. An approximate nearest neighbor index enables fast similarity search. Row-level security ensures tenants can only access their own chunks.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Zap className="h-5 w-5 text-primary" /></div>
                  <CardTitle className="text-base">Stage 3: Retrieval</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">During a call, the system detects knowledge-seeking keywords in the user speech ("warranty", "pricing", "policy", "hours") and triggers a retrieval. The user utterance is embedded, and a Postgres RPC function performs cosine similarity search against the tenant chunks — filtered by tenant ID and optional source type. A minimum similarity threshold excludes low-quality matches. The top results are formatted as context and injected into the model prompt. RAG works in adaptive and realtime modes, not in Gather or IVR.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center"><RefreshCw className="h-5 w-5 text-accent-foreground" /></div>
                  <CardTitle className="text-base">Stage 4: Refresh</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">Content changes are detected via SHA-256 content hashing. Sources older than seven days are marked as stale. Biweekly reminders prompt tenants to refresh their content. A manual re-scrape endpoint allows on-demand updates. FAQ re-indexing is triggered when the tenant updates their FAQ configuration.</CardDescription>
              </CardHeader>
            </Card>
          </Grid>
          <p className="text-sm text-muted-foreground leading-relaxed">RAG is per-tenant and opt-out. Each tenant RAG enablement is checked and cached. The retrieval path tries the frontend API first, then falls back to a direct database RPC — ensuring retrieval works even if the frontend is temporarily unavailable.</p>
        </div>
      </Section>

      {/* Section 9: Tools and Verified Actions */}
      <Section id="tools-actions" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Tools and Verified Actions</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">When a caller asks to book an appointment, the system follows a strict sequence to ensure the action is real, not assumed.</p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {['Caller requests', 'AI gathers fields', 'Caller confirms', 'Booking API executes', 'Authoritative result', 'AI reports success/failure'].map((step, i, arr) => (
              <span key={step} className="flex items-center gap-2">
                <span className="rounded-lg border border-border bg-muted/30 px-3 py-1.5 font-medium text-foreground">{step}</span>
                {i < arr.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground/50" />}
              </span>
            ))}
          </div>
          <Grid cols={3} gap="md">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Calendar className="h-5 w-5 text-primary" /></div>
                  <CardTitle className="text-sm">Calendar Service</CardTitle>
                </div>
                <CardDescription className="text-xs leading-relaxed">Book, reschedule, and cancel appointments with Google Calendar sync. The AI gathers required fields (name, phone, service, date), the caller confirms, and the booking API executes. The AI reports the result based on the tool return value — not its own assumption. The system prompt explicitly instructs the model to confirm bookings only after tool success.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Users className="h-5 w-5 text-primary" /></div>
                  <CardTitle className="text-sm">CRM Integration</CardTitle>
                </div>
                <CardDescription className="text-xs leading-relaxed">Create and update leads in the tenant CRM. Phone numbers are normalized to E.164 format. The system stores leads in Postgres and is extensible to Salesforce and HubSpot.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Workflow className="h-5 w-5 text-primary" /></div>
                  <CardTitle className="text-sm">Extraction-to-Booking</CardTitle>
                </div>
                <CardDescription className="text-xs leading-relaxed">After a call, extracted data (caller name, requested service, preferred time) can be automatically drafted into a booking with confidence scoring. High-confidence extractions can auto-book; low-confidence ones require human review.</CardDescription>
              </CardHeader>
            </Card>
          </Grid>
        </div>
      </Section>

      {/* Section 10: Degraded Modes */}
      <Section id="degraded-modes" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Failure and Degraded Modes</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">Production systems fail. The architecture must handle failure without dropping the caller or producing unsafe behavior. Kestrel has a four-level degradation system.</p>
          <div className="space-y-2">
            {[
              { level: 'Level 0: Full AI', color: 'bg-green-500/80', desc: 'Frontier model with premium voice synthesis. Best quality. Used when all services are healthy.' },
              { level: 'Level 1: Fast AI', color: 'bg-amber-500/80', desc: 'Cost-efficient model with standard voice synthesis. Reduced latency and cost. Used when the frontier model API is degraded or rate-limited.' },
              { level: 'Level 2: Rule-Based', color: 'bg-orange-500/80', desc: 'State machine only. No language model. Handles greetings, basic intent routing, and voicemail capture. Used when AI APIs are unavailable.' },
              { level: 'Level 3: Human Transfer', color: 'bg-red-500/80', desc: 'Transfer to a human or voicemail. Last resort. Used when all automated modes have failed.' },
            ].map((item) => (
              <div key={item.level} className="flex items-stretch gap-3">
                <div className={`w-2 rounded-full ${item.color}`} />
                <div className="flex-1 rounded-lg border border-border bg-muted/20 p-3">
                  <p className="text-sm font-semibold text-foreground">{item.level}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-border rounded-lg">
              <thead className="bg-muted/30">
                <tr>
                  <th className="text-left p-2 font-semibold text-foreground">Failure</th>
                  <th className="text-left p-2 font-semibold text-foreground">Response</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {fallbackTable.map(([failure, response]) => (
                  <tr key={failure}><td className="p-2 text-muted-foreground">{failure}</td><td className="p-2 text-muted-foreground">{response}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">The system tracks success and failure metrics at each level and can automatically recover when service health returns. Manual override is available for operators who need to force a specific level.</p>
        </div>
      </Section>

      {/* Section 11: Post-Call Operations */}
      <Section id="post-call" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Post-Call Operations</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">After a call ends, an asynchronous pipeline runs without blocking call teardown. Two stages: intelligence extraction and action dispatch.</p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {['Call ends', 'Post-call intelligence', 'Action engine', 'Webhook + email + dashboard'].map((step, i, arr) => (
              <span key={step} className="flex items-center gap-2">
                <span className="rounded-lg border border-border bg-muted/30 px-3 py-1.5 font-medium text-foreground">{step}</span>
                {i < arr.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground/50" />}
              </span>
            ))}
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Intelligence Extracted</CardTitle>
              <div className="mt-2 grid sm:grid-cols-2 gap-2">
                {intelligenceFields.map((field) => (
                  <div key={field.label} className="flex items-start gap-2 text-xs">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">{field.label}</strong> — <span className="text-muted-foreground">{field.desc}</span></span>
                  </div>
                ))}
              </div>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-l-primary/40">
            <CardHeader>
              <CardTitle className="text-sm">Action Engine</CardTitle>
              <CardDescription className="text-xs mt-1">The action engine maps intelligence output to persistent call actions. High-priority items trigger email alerts. If the tenant has configured a webhook, the engine dispatches the intelligence payload with three retries and exponential backoff. All actions are deduplicated and stored for dashboard review.</CardDescription>
            </CardHeader>
          </Card>
          <p className="text-sm text-muted-foreground leading-relaxed">The call also produces a transcript, optional recording, tool call logs, prompt evidence with hash, and outcome classification. Calls can be replayed with audio and transcript sync, tagged for categorization, and reviewed in the dashboard.</p>
        </div>
      </Section>

      {/* Section 12: Learning Pipeline */}
      <Section id="learning-pipeline" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Learning Pipeline</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">Kestrel Voice learns from call patterns. The learning pipeline promotes recurring fast-path patterns into active fast actions — but with guardrails.</p>
          <div className="grid sm:grid-cols-4 gap-3">
            {learningSteps.map((s) => (
              <Card key={s.step}>
                <CardHeader>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary mb-2">{s.step}</div>
                  <CardTitle className="text-sm">{s.title}</CardTitle>
                  <CardDescription className="text-xs mt-1 leading-relaxed">{s.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          <Card className="border-l-4 border-l-primary/40">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm">Learning Guardrails</CardTitle>
              </div>
              <ul className="space-y-1">
                {learningGuardrails.map((g) => (
                  <li key={g} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-l-accent/40">
            <CardHeader>
              <CardTitle className="text-sm">Template FAQs</CardTitle>
              <CardDescription className="text-xs mt-1">Separately from learned patterns, industry template FAQs provide pre-written answers for common questions in each business type. A restaurant template includes FAQs about party size, reservations, and menu questions. An HVAC template includes FAQs about service calls, estimates, and emergency dispatch. These template FAQs are injected into the system prompt and matched against user input — no AI call needed.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-l-blue-500/40">
            <CardHeader>
              <CardTitle className="text-sm">Pattern Versioning</CardTitle>
              <CardDescription className="text-xs mt-1">A pattern versioning system allows database-stored patterns to merge with hardcoded template patterns, with an approval workflow (draft, pending, approved, rejected). This enables safe pattern evolution without code changes.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      {/* Section 13: Beyond Inbound */}
      <Section id="beyond-inbound" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Beyond Inbound: Outbound, Meetings, and Copilot</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">Kestrel Voice handles more than inbound calls. The platform supports outbound dialing, meeting bridges, live AI copilot, and sequential ring — each with its own state machine and guardrails.</p>
          <Grid cols={2} gap="md">
            {beyondInboundFeatures.map((feature, i) => {
              const Icon = beyondInboundIcons[i]
              return (
                <Card key={feature.title}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-base">{feature.title}</CardTitle>
                    </div>
                    <CardDescription className="text-sm leading-relaxed">{feature.desc}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </Grid>
        </div>
      </Section>

      {/* Section 14: Multi-Channel */}
      <Section id="multi-channel" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Multi-Channel: SMS, Video, and WebRTC</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">Voice is the primary channel, but Kestrel Voice also supports SMS, video sessions, and browser-based calling.</p>
          <Grid cols={3} gap="md">
            {multiChannelFeatures.map((feature, i) => {
              const Icon = multiChannelIcons[i]
              return (
                <Card key={feature.title}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-sm">{feature.title}</CardTitle>
                    </div>
                    <CardDescription className="text-xs leading-relaxed">{feature.desc}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </Grid>
          <Card className="border-l-4 border-l-amber-500/40">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-sm">Compliance</CardTitle>
              </div>
              <CardDescription className="text-xs mt-1">Call recording consent is handled per state law. Two-party consent states receive a consent prompt before recording begins. The system maps area codes to states and generates the appropriate TwiML consent prompt. SMS complies with TCPA opt-out handling.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      {/* Section 15: Security Architecture */}
      <Section id="security-architecture" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Security Architecture</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">Security in a voice agent platform spans telephony, API, data, and compliance. Kestrel implements defense-in-depth across six domains.</p>
          <Grid cols={2} gap="md">
            {securityDomains.map((domain, i) => {
              const Icon = securityIcons[i]
              return (
                <Card key={domain.title}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-sm">{domain.title}</CardTitle>
                    </div>
                    <CardDescription className="text-xs leading-relaxed">{domain.desc}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </Grid>
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <h3 className="text-sm font-semibold mb-3">Tenant Isolation — Five Concentric Layers</h3>
            <div className="space-y-1.5">
              {['ASGI Middleware — Extracts tenant ID from JWT on every request', 'Parameter Scoping — All database queries pass tenant ID as a parameter', 'RLS Policies — Postgres row-level security enforces tenant-scoped access', 'Auth Extraction — Server-side, never trusts client-provided tenant IDs', 'Internal API — Separate authentication path for service-to-service calls'].map((layer, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground" style={{ paddingLeft: `${i * 16}px` }}>
                  <div className="w-4 h-4 rounded-full border-2 border-primary/30 flex-shrink-0" />
                  <span>{layer}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">Additional measures include CORS policies restricting origins to the application domain, API documentation disabled in production, file upload security with MIME type whitelisting and virus scanning, and SSRF prevention in the RAG scraper (blocking private IPs, localhost, and internal domains).</p>
        </div>
      </Section>

      {/* Section 16: Technology Decisions */}
      <Section id="technology-decisions" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Technology Decisions</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">The key technology decisions and why they were made. This is not an exhaustive dependency list — it covers the decisions that shaped the architecture.</p>
          <Grid cols={2} gap="md">
            {techDecisions.map((decision, i) => {
              const Icon = techIcons[i]
              return (
                <Card key={decision.title}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-sm">{decision.title}</CardTitle>
                    </div>
                    <CardDescription className="text-xs leading-relaxed">{decision.desc}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </Grid>
        </div>
      </Section>

      {/* Section 17: Limitations */}
      <Section id="limitations" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">What the Architecture Does Not Guarantee</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">Honest architecture documentation includes what the system does not guarantee. The following limitations are inherent to AI voice agent platforms, including Kestrel Voice:</p>
          <div className="space-y-2">
            {limitations.map((item) => (
              <div key={item.title} className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 p-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Section 18: FAQ */}
      <Section id="faq" className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {faqs.map((item) => (
              <details key={item.q} className="rounded-lg border border-border bg-muted/20 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-foreground">{item.q}</summary>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      {/* Related Resources */}
      <Section className="pb-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Related Resources</h2>
          <Grid cols={3} gap="md">
            {relatedResources.map((resource, i) => {
              const Icon = relatedIcons[i]
              return (
                <Link key={resource.href} href={resource.href}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <CardTitle className="text-sm">{resource.title}</CardTitle>
                      </div>
                      <CardDescription className="text-xs leading-relaxed">{resource.desc}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1">Read article <ArrowRight className="h-3 w-3" /></span>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </Grid>
        </div>
      </Section>

      {/* Lead Magnet */}
      <Section className="pb-4">
        <div className="max-w-4xl mx-auto">
          <LeadMagnetCard
            title="AI Voice Agent Architecture Checklist"
            description="Get a practical checklist covering call flow design, deterministic vs generative answer mapping, RAG pipeline setup, tool verification, degradation planning, security controls, and evidence requirements for production AI voice agents."
            resourceName="AI Voice Agent Architecture Checklist"
          />
        </div>
      </Section>

      {/* Cross-link */}
      <Section className="pt-4">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
            <p>For the failure modes this architecture prevents, read <Link href="/why-ai-voice-agents-fail-in-production" className="text-primary font-medium hover:underline">Why AI Voice Agents Fail in Production</Link>. For the RAG governance framework behind the retrieval pipeline, read <Link href="/secure-enterprise-rag-architecture" className="text-primary font-medium hover:underline">Secure Enterprise RAG Architecture</Link>. For the full AI compliance stack — NIST, ISO, SOC 2 — read <Link href="/how-to-secure-and-govern-ai" className="text-primary font-medium hover:underline">How to Secure and Govern AI</Link>.</p>
          </div>
        </div>
      </Section>

      <CTA
        title="Ready to Deploy a Production-Grade AI Voice Agent?"
        description="Kestrel Voice handles the call. HAIEC handles the assurance. Start with a self-service setup or schedule a managed deployment consultation."
        primaryButton={{ text: 'Try Kestrel Voice', href: 'https://www.kestrelvoice.com' }}
        secondaryButton={{ text: 'Explore HAIEC', href: '/solutions/haiec' }}
      />
    </>
  )
}
