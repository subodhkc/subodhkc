import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LeadMagnetCard } from '@/components/LeadMagnetCard'
import { ArchitectureDecisionSheet } from '@/components/interactive/ArchitectureDecisionSheet'
import { FileText, Shield, AlertTriangle, CheckCircle2, ArrowRight, Layers, Building, Cpu, ClipboardCheck, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Architecture Decision Master Sheet | Subodh KC',
  description:
    'An interactive 25-layer architecture decision master sheet for software development PMs, architects, and tech leads — with AI development risks, CSM pillar mapping, documents per step, and Definition of Done for every layer.',
  alternates: {
    canonical: 'https://subodhkc.com/architecture-decision-master-sheet',
  },
  openGraph: {
    title: 'Architecture Decision Master Sheet',
    description: 'Interactive 25-layer architecture decision sheet with AI development risks, CSM alignment, documents per step, and Definition of Done — for PMs, architects, and tech leads.',
    url: 'https://subodhkc.com/architecture-decision-master-sheet',
    type: 'article',
    authors: ['Subodh KC'],
    tags: ['Architecture Decision Master Sheet', 'Architecture Decision Records', 'AI Development Risks', 'CSM Framework', 'Software Architecture', 'AI Governance', 'Tech Lead Guide', 'PM Architecture Guide'],
    images: ['https://subodhkc.com/og-default.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Architecture Decision Master Sheet',
    description: 'Interactive 25-layer architecture decision sheet with AI development risks, CSM alignment, documents per step, and Definition of Done.',
  },
  robots: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  keywords: [
    'architecture decision master sheet',
    'architecture decision records',
    'ADR template',
    'software architecture layers',
    'AI development risks',
    'AI code assistant risks',
    'CSM framework',
    'Cognitive Systems Management',
    'architecture decision matrix',
    'PM architecture guide',
    'tech lead architecture decisions',
    'AI RAG pipeline architecture',
    'AI agent architecture decisions',
    'software architecture checklist',
    'definition of done architecture',
    'architecture anti-patterns',
    'build vs buy strategy',
    'domain modeling architecture',
    'AI governance architecture',
    'HAIEC platform',
  ],
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Architecture Decision Master Sheet',
  description: 'An interactive 25-layer architecture decision master sheet for software development PMs, architects, and tech leads — with AI development risks, CSM pillar mapping, documents per step, and Definition of Done for every layer.',
  author: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
  publisher: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
  datePublished: '2026-07-17',
  dateModified: '2026-07-17',
  url: 'https://subodhkc.com/architecture-decision-master-sheet',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is an Architecture Decision Master Sheet?',
      acceptedAnswer: { '@type': 'Answer', text: 'An Architecture Decision Master Sheet is an interactive reference covering 25 architecture layers that every software development project must consider — from product scope to governance. Each layer answers seven questions: Why does it matter? Who is responsible? How is it implemented? When should it be addressed? What are the risks? What does bad look like? And what documents should architects and PMs produce?' },
    },
    {
      '@type': 'Question',
      name: 'How does this sheet handle AI development risks?',
      acceptedAnswer: { '@type': 'Answer', text: 'Every layer includes AI development risks in two dimensions: AI in the product (Layers 15–17 cover RAG pipeline, agent architecture, and output validation) and AI tools in the development process (all 25 layers include AI pitfalls, risks of using AI to build, mitigation approaches, and quality gates). This means even if your product has no AI features, the sheet covers risks from using AI code assistants like Copilot, Cursor, or Claude.' },
    },
    {
      '@type': 'Question',
      name: 'What is the CSM pillar mapping and why does it matter?',
      acceptedAnswer: { '@type': 'Answer', text: 'Every layer maps to one of the four pillars of Cognitive Systems Management (CSM): Strategic Alignment (Layers 1–4), Technical Implementation (Layers 5–17), Governance & Risk (Layers 18–21), and Operational Excellence (Layers 22–25). CSM is the framework underlying the HAIEC platform. The mapping ensures every technical decision is connected to business strategy, governance, and operations.' },
    },
    {
      '@type': 'Question',
      name: 'What documents does each layer specify?',
      acceptedAnswer: { '@type': 'Answer', text: 'Each layer specifies two document lists: Architect Documents (ADRs, design documents, diagrams, specifications) and PM Documents (sprint plans, review schedules, staffing plans, compliance timelines). These are the concrete deliverables that prove a decision was made, reviewed, and approved. If a layer has no documents, it has not been decided.' },
    },
    {
      '@type': 'Question',
      name: 'Can I use this sheet for projects without AI features?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. The sheet includes a "Web app without AI" scenario that filters to Layers 1–14 and 18–25, skipping the conditional AI layers (Group E). However, if your team uses AI code assistants (Copilot, Cursor, Claude), the AI development risks on all layers still apply — they cover risks from using AI tools to write code, not just AI features in the product.' },
    },
    {
      '@type': 'Question',
      name: 'How is the Definition of Done (DoD) different from a checklist item?',
      acceptedAnswer: { '@type': 'Answer', text: 'The DoD is a gate, not a checkbox. It is a specific, testable criterion that must be met before a layer is considered complete. For example, the DoD for Security & Policy is: "Security architecture documented; RLS implemented; encryption verified; audit logging active; security scan passing in CI." This prevents the common failure mode where teams believe a layer is "done" when it is merely "started."' },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'AI Security Tools', item: 'https://subodhkc.com/ai-security-tools' },
    { '@type': 'ListItem', position: 3, name: 'Architecture Decision Master Sheet', item: 'https://subodhkc.com/architecture-decision-master-sheet' },
  ],
}

const csmPillarData = [
  { pillar: 'Strategic Alignment', layers: '1–4 (Group A)', icon: Building, focus: 'Business objectives, risk-reward, stakeholder alignment. What are we building and why?' },
  { pillar: 'Technical Implementation', layers: '5–17 (Groups B–E)', icon: Cpu, focus: 'Architecture decisions, infrastructure, integration patterns. How are we building it?' },
  { pillar: 'Governance & Risk', layers: '18–21 (Group F)', icon: Shield, focus: 'Policy frameworks, compliance, continuous monitoring. How do we protect it?' },
  { pillar: 'Operational Excellence', layers: '22–25 (Group G)', icon: TrendingUp, focus: 'Performance, incident response, continuous improvement. How do we run it?' },
]

const antiPatterns = [
  { layer: 'Layer 1', pattern: '"Add AI" as a requirement', impact: 'No success metrics, no failure criteria. Cannot tell if AI feature is working or hallucinating.' },
  { layer: 'Layer 2', pattern: 'No documented invariants', impact: 'Business logic scattered across layers. Silent data corruption.' },
  { layer: 'Layer 3', pattern: 'Choosing tech because it is trendy', impact: 'No rationale, no skill gap analysis. Hiring becomes impossible.' },
  { layer: 'Layer 7', pattern: 'No API versioning', impact: 'Breaking changes in production. Frontend and backend disagree.' },
  { layer: 'Layer 15', pattern: 'No retrieval for knowledge tasks', impact: 'Prompt-only approaches for tasks that require RAG. Hallucinations in production.' },
  { layer: 'Layer 16', pattern: 'No escalation path for agents', impact: 'Agents can call any tool, take unauthorized actions, loop infinitely.' },
  { layer: 'Layer 17', pattern: 'No output validation', impact: 'AI outputs go directly to users. Hallucinations, bias, harmful content reach users.' },
  { layer: 'Layer 18', pattern: 'No RLS in multi-tenant', impact: 'Shared credentials, no audit log. Data breaches, regulatory penalties.' },
  { layer: 'Layer 25', pattern: 'No ADRs; decisions made in Slack', impact: 'Nobody knows why decisions were made. New team members repeat mistakes.' },
]

const faqs = [
  { q: 'What is an Architecture Decision Master Sheet?', a: 'An interactive reference covering 25 architecture layers that every software development project must consider — from product scope to governance. Each layer answers seven questions: Why does it matter? Who is responsible? How is it implemented? When should it be addressed? What are the risks? What does bad look like? And what documents should architects and PMs produce?' },
  { q: 'How does this sheet handle AI development risks?', a: 'Every layer includes AI development risks in two dimensions: AI in the product (Layers 15–17 cover RAG pipeline, agent architecture, and output validation) and AI tools in the development process (all 25 layers include AI pitfalls, risks of using AI to build, mitigation approaches, and quality gates). This means even if your product has no AI features, the sheet covers risks from using AI code assistants like Copilot, Cursor, or Claude.' },
  { q: 'What is the CSM pillar mapping and why does it matter?', a: 'Every layer maps to one of the four pillars of Cognitive Systems Management (CSM): Strategic Alignment (Layers 1–4), Technical Implementation (Layers 5–17), Governance & Risk (Layers 18–21), and Operational Excellence (Layers 22–25). CSM is the framework underlying the HAIEC platform. The mapping ensures every technical decision is connected to business strategy, governance, and operations.' },
  { q: 'What documents does each layer specify?', a: 'Each layer specifies two document lists: Architect Documents (ADRs, design documents, diagrams, specifications) and PM Documents (sprint plans, review schedules, staffing plans, compliance timelines). These are the concrete deliverables that prove a decision was made, reviewed, and approved. If a layer has no documents, it has not been decided.' },
  { q: 'Can I use this sheet for projects without AI features?', a: 'Yes. The sheet includes a "Web app without AI" scenario that filters to Layers 1–14 and 18–25, skipping the conditional AI layers (Group E). However, if your team uses AI code assistants (Copilot, Cursor, Claude), the AI development risks on all layers still apply — they cover risks from using AI tools to write code, not just AI features in the product.' },
  { q: 'How is the Definition of Done (DoD) different from a checklist item?', a: 'The DoD is a gate, not a checkbox. It is a specific, testable criterion that must be met before a layer is considered complete. For example, the DoD for Security & Policy is: "Security architecture documented; RLS implemented; encryption verified; audit logging active; security scan passing in CI." This prevents the common failure mode where teams believe a layer is "done" when it is merely "started."' },
]

export default function ArchitectureDecisionMasterSheetPage() {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Hero
        subtitle="Interactive Architecture Tool"
        title={
          <>
            Architecture Decision
            <br />
            <span className="gradient-text">Master Sheet</span>
          </>
        }
        description="An interactive 25-layer architecture decision sheet for software development PMs, architects, and tech leads — with AI development risks, CSM pillar mapping, documents per step, and Definition of Done for every layer."
      />

      <Section className="pt-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><FileText className="h-4 w-4" /> July 17, 2026</span>
            <span>By Subodh KC</span>
          </div>
          <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/20 p-3">
            <p className="text-xs text-amber-900 dark:text-amber-200">
              <strong>Educational notice:</strong> This master sheet provides a comprehensive framework for architecture decisions. Production deployments should undergo organization-specific architecture review with qualified architects and security professionals. Decisions should be tailored to your specific tech stack, team composition, and regulatory environment.
            </p>
          </div>
        </div>
      </Section>

      <Section className="pt-4">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-accent/5 to-background p-6 md:p-8">
            <h2 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">Synopsis</h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/90">
              The Architecture Decision Master Sheet covers 25 architecture layers across 7 groups — from product scope to governance. Each layer includes purpose, criticality, phase, decision options, RACI, risks, AI development risks, documents for architects and PMs, and a Definition of Done. Aligned with the{' '}
              <Link href="/haiec" className="text-primary font-medium hover:underline">Cognitive Systems Management (CSM)</Link>{' '}
              framework, it bridges strategy, execution, governance, and operations. Use it alongside the{' '}
              <Link href="/ai-risk-register" className="text-primary font-medium hover:underline">AI Risk Register</Link>,{' '}
              <Link href="/ai-security-tools" className="text-primary font-medium hover:underline">AI Security Tools</Link>,{' '}
              and the{' '}
              <Link href="/ai-incident-evidence-checklist" className="text-primary font-medium hover:underline">Incident Evidence Checklist</Link>.
            </p>
          </div>
        </div>
      </Section>

      {/* Interactive Tool */}
      <Section className="pt-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Interactive Decision Sheet</h2>
          <p className="text-sm text-muted-foreground mb-6">Filter by group, criticality, phase, CSM pillar, or keyword. Click any layer to see full details across 6 tabs. Use the floating <strong className="text-foreground">?</strong> button at the bottom-right to open the glossary.</p>
          <ArchitectureDecisionSheet />
        </div>
      </Section>

      {/* Quick Start */}
      <Section className="pt-4">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-accent/5 to-background p-6 md:p-8">
            <h2 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">Quick Start</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h3 className="text-sm font-semibold mb-1">1. Pick a scenario</h3>
                <p className="text-xs text-muted-foreground">Select the card that matches your project (web app, AI product, AI tools, audit, or pilot recovery).</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1">2. Filter & explore</h3>
                <p className="text-xs text-muted-foreground">Filter by phase, CSM pillar, or keyword. Click any layer for 6 tabs of detail.</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1">3. Export & assign</h3>
                <p className="text-xs text-muted-foreground">Export CSV/JSON, assign owners, and track decisions per sprint.</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Who Is This For? */}
      <Section className="pt-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Who Is This For?</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-l-4 border-l-primary/40">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2"><ClipboardCheck className="h-4 w-4 text-primary" /> Project Managers</CardTitle>
                <CardDescription className="text-sm mt-2">Track which architecture decisions are pending, who owns them, and what documents are needed per sprint. Use the PM Tracking tab to assign owners and statuses. Export the sheet to share with stakeholders.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-primary/40">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2"><Layers className="h-4 w-4 text-primary" /> Architects</CardTitle>
                <CardDescription className="text-sm mt-2">Review all 25 layers before design begins. Document ADRs for each decision. Use the Decision Details tab to capture options, tools, and reversibility. Identify one-way doors before they become expensive.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-primary/40">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2"><Cpu className="h-4 w-4 text-primary" /> Tech Leads</CardTitle>
                <CardDescription className="text-sm mt-2">Use the Phase Matrix to sequence work across sprints. Check dependencies and blockers before committing to a sprint plan. Review anti-patterns to avoid common mistakes.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-red-500/40">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-red-500" /> AI Leads</CardTitle>
                <CardDescription className="text-sm mt-2">Focus on Layers 15–17 (AI Pipeline, Agents, Validation). Use the AI Risk View to see AI-specific risks across all layers. Ensure quality gates are enforced in CI before AI features ship.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-amber-500/40">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="h-4 w-4 text-amber-500" /> DevOps & SRE</CardTitle>
                <CardDescription className="text-sm mt-2">Focus on Layers 22–25 (Observability, DevOps, Performance, Governance). Ensure rollback strategies are tested. Set up AI-specific monitoring (drift, cost, quality) before launch.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-purple-500/40">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2"><Shield className="h-4 w-4 text-purple-500" /> Security & Compliance</CardTitle>
                <CardDescription className="text-sm mt-2">Focus on Layers 18–21 (Security, Validation, Testing, Code Review). Use the CSM Pillar View to filter by Governance & Risk. Map controls to NIST AI RMF, ISO 42001, and regulatory requirements.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </Section>

      {/* Article: What Is the Architecture Decision Master Sheet */}
      <Section className="pt-8">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">What Is the Architecture Decision Master Sheet?</h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            The Architecture Decision Master Sheet is an interactive reference covering <strong className="text-foreground">25 architecture layers</strong> that every software development project must consider — from product scope to governance. It is designed for <strong className="text-foreground">PMs, architects, and tech leads</strong> who need a structured way to track decisions, risks, and deliverables across the full lifecycle of a software project, whether or not AI is part of the product.
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Each layer answers seven questions: <strong className="text-foreground">Why</strong> does it matter? <strong className="text-foreground">Who</strong> is responsible? <strong className="text-foreground">How</strong> is it implemented? <strong className="text-foreground">When</strong> should it be addressed? <strong className="text-foreground">What</strong> are the risks? <strong className="text-foreground">What</strong> does bad look like? And <strong className="text-foreground">what documents</strong> should architects and PMs produce?
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            The sheet also includes <strong className="text-foreground">AI development risks</strong> for every layer — not just the AI-specific layers (Group E). If your team uses AI tools to write code, or if your product includes AI features, these risks apply to you.
          </p>
          <div className="rounded-lg border border-purple-300 bg-purple-50 dark:bg-purple-950/20 p-4">
            <p className="text-sm text-purple-900 dark:text-purple-200">
              <strong>CSM-Aligned:</strong> Every layer maps to one of the four pillars of <Link href="/haiec" className="font-medium hover:underline">Cognitive Systems Management (CSM)</Link> — Strategic Alignment, Technical Implementation, Governance & Risk, and Operational Excellence. Use the CSM Pillar View in the interactive tool to see how the sheet operationalizes the framework.
            </p>
          </div>
        </div>
      </Section>

      {/* Article: The 7 Layer Groups */}
      <Section className="pt-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">The 7 Layer Groups Explained</h2>

          {[
            { group: 'Group A — Foundation & Scope (Layers 1–4)', csm: 'Strategic Alignment', desc: 'These layers define what you are building and why. They are the highest-leverage decisions in the entire sheet. Getting these wrong means every downstream layer inherits the wrong assumptions.', items: ['Product & Scope — What problem are you solving?', 'Domain Modeling — Core business entities and rules', 'Tech Stack & Framework — Technologies and constraints', 'Build vs Buy Strategy — In-house vs SaaS decisions'] },
            { group: 'Group B — Interface & Interaction (Layers 5–7)', csm: 'Technical Implementation', desc: 'These layers define how users interact with the system. Key decisions include rendering strategy, state management, and API gateway design.', items: ['Client / UI Layer — Rendering, design system, accessibility', 'UI State Management — Global vs server vs local state', 'API & Gateway — Contract between frontend and backend'] },
            { group: 'Group C — Logic & Data (Layers 8–11)', csm: 'Technical Implementation', desc: 'These layers define where business logic lives and how data is stored. This is where most one-way doors live — schema migrations and domain model changes are expensive to reverse.', items: ['Service Layer — Centralized business logic', 'Controllers / Routing — Thin controllers', 'Data & Persistence — Schema, indexes, migrations', 'Caching & Performance — Invalidation strategy, TTL'] },
            { group: 'Group D — Integration & Async (Layers 12–14)', csm: 'Technical Implementation', desc: 'These layers define how external services connect and how background work gets done. The adapter pattern isolates vendor risk.', items: ['Integration / Adapters — Isolate vendor calls', 'Events & Async — Queue topology, idempotency, DLQ', 'Middleware — Cross-cutting concerns'] },
            { group: 'Group E — AI Layer (Layers 15–17, Conditional)', csm: 'Technical Implementation', desc: 'These layers are only applicable if your product includes AI features. They carry the highest risk in the entire sheet — this is where most AI pilots fail.', items: ['AI / RAG Pipeline — Retrieval, chunking, embeddings, guardrails', 'AI Agent Architecture — Tool use, autonomy, escalation', 'AI Output Validation — Multi-layer validation, bias detection'] },
            { group: 'Group F — Quality & Security (Layers 18–21)', csm: 'Governance & Risk', desc: 'These layers define how you protect the system and verify correctness. AI introduces new attack surfaces that traditional security does not cover.', items: ['Security & Policy — Auth, encryption, RLS, audit logging', 'Validation & Integrity — Schema validation, sanitization', 'Testing Strategy — Unit, integration, e2e, AI evaluation', 'Code Review & Quality Gates — PR review, CI gates, AI code policy'] },
            { group: 'Group G — Operations & Delivery (Layers 22–25)', csm: 'Operational Excellence', desc: 'These layers define how you ship, monitor, and govern the system in production. AI features need specialized monitoring that standard observability does not provide.', items: ['Observability — Logs, metrics, traces, AI monitoring', 'DevOps & Delivery — CI/CD, environments, rollback', 'Performance & Cost — Load testing, auto-scaling, AI cost limits', 'Ownership & Governance — ADRs, decision log, ownership matrix'] },
          ].map(g => (
            <div key={g.group}>
              <h3 className="text-lg font-semibold">{g.group}</h3>
              <p className="text-sm text-muted-foreground mt-1">{g.desc}</p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">CSM Pillar: {g.csm}</p>
              <ul className="mt-2 space-y-1">
                {g.items.map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Article: How to Use This Sheet */}
      <Section className="pt-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">How to Use This Sheet: Step-by-Step</h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">The interactive tool above is designed to be used as a living checklist throughout your project. Here is how to get the most out of it:</p>
          <ol className="space-y-3">
            {[
              { step: '1', title: 'Pick a scenario', desc: 'Select the scenario card that matches your situation (Web app without AI, AI-powered product, Using AI tools to develop, Auditing existing system, or Recovering stalled AI pilot).' },
              { step: '2', title: 'Filter by phase or CSM pillar', desc: 'Use the filter chips to narrow by project phase or by CSM pillar (Strategic Alignment, Technical Implementation, Governance & Risk, Operational Excellence).' },
              { step: '3', title: 'Assign owners', desc: 'Click each layer row to open the detail popup. Go to the PM Tracking tab and assign an owner, sprint, and status. Update the ADR reference when a decision is made.' },
              { step: '4', title: 'Review AI development risks', desc: 'Switch to the AI Risk View to see AI-specific risks for every layer. Pay attention to the "Risk Using AI to Build" field if your team uses AI code assistants.' },
              { step: '5', title: 'Check the CSM Pillar View', desc: 'Switch to the CSM Pillar View to see how your architecture decisions map to the four pillars of Cognitive Systems Management.' },
              { step: '6', title: 'Export and share', desc: 'Use the Export CSV or Export JSON buttons to share the current state with your team. Import into your project management tool or spreadsheet.' },
              { step: '7', title: 'Update regularly', desc: 'The sheet is a living document. Update status, owners, and risks per sprint. Review the Definition of Done for each layer before marking it complete.' },
            ].map(s => (
              <li key={s.step} className="flex items-start gap-3">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">{s.step}</span>
                <div>
                  <strong className="text-sm md:text-base">{s.title}.</strong>{' '}
                  <span className="text-sm text-muted-foreground">{s.desc}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* Article: Real-World Example */}
      <Section className="pt-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Real-World Example: Building an AI-Powered Customer Support Tool</h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Here is how a 5-person team would use this sheet to build an AI-powered customer support tool from scratch:
          </p>

          <div className="space-y-3">
            <div className="rounded-lg border border-border p-4">
              <h3 className="text-sm font-semibold text-primary mb-1">Sprint 0 — Discovery</h3>
              <p className="text-sm text-muted-foreground">The PM selects the <strong className="text-foreground">"AI-powered product"</strong> scenario. The team reviews Layers 1–4 (Foundation & Scope): they write a PRD with success metrics (deflection rate, CSAT, cost per ticket), document the domain model (tickets, users, knowledge base articles), choose Next.js + Postgres + pgvector, and decide to use OpenAI API (build-vs-buy decision). The architect writes ADR-001 (tech stack) and ADR-002 (AI vendor). The PM creates a sprint plan and staffing matrix.</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <h3 className="text-sm font-semibold text-primary mb-1">Sprint 1 — Design</h3>
              <p className="text-sm text-muted-foreground">The team filters by <strong className="text-foreground">Phase: Design</strong>. They address Layers 5–7 (UI, State, API), Layer 10 (Data — including vector schema for embeddings), Layer 15 (AI/RAG Pipeline — chunking strategy, embedding model, retrieval pipeline), and Layer 18 (Security — RLS for multi-tenant, audit logging). The AI Lead writes the AI pipeline design document. The architect reviews the reversibility column: domain model and schema are <strong className="text-foreground">one-way doors</strong> — they get these right before building.</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <h3 className="text-sm font-semibold text-primary mb-1">Sprint 2 — Build</h3>
              <p className="text-sm text-muted-foreground">The team filters by <strong className="text-foreground">Phase: Build</strong>. They address Layers 8–9 (Services, Controllers), Layer 11 (Caching — with AI response caching + validation), Layer 12–13 (Integration with OpenAI via adapter pattern, async queue for embeddings), Layer 16 (Agent Architecture — tool use for ticket actions, escalation to human), Layer 17 (Output Validation — LLM-as-judge for response quality, content filtering), Layer 19 (Input validation), Layer 22 (Observability — AI-specific monitoring for drift, cost, hallucination rate). The team checks the <strong className="text-foreground">AI Risk View</strong> to verify they have mitigations for every AI pitfall.</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <h3 className="text-sm font-semibold text-primary mb-1">Sprint 3 — Launch</h3>
              <p className="text-sm text-muted-foreground">The team filters by <strong className="text-foreground">Phase: Launch</strong>. They address Layer 20 (Testing — including AI evaluation suite for response quality), Layer 21 (Code Review — AI code policy), Layer 23 (DevOps — CI/CD with rollback, feature flags for gradual rollout), Layer 24 (Performance — load testing, AI cost limits with alerts). They run the <strong className="text-foreground">Definition of Done</strong> checklist for every layer before launch. The PM exports the final sheet as CSV and shares it with stakeholders.</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <h3 className="text-sm font-semibold text-primary mb-1">Operate — Ongoing</h3>
              <p className="text-sm text-muted-foreground">The team uses the <strong className="text-foreground">CSM Pillar View</strong> in quarterly reviews. They check Operational Excellence (Layers 22–25) for drift, cost trends, and incident response readiness. They update the sheet when new tools are added, when the AI vendor changes models, or when new compliance requirements emerge. The sheet becomes the living record of their architecture decisions.</p>
            </div>
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm text-foreground">
              <strong>Key takeaway:</strong> The sheet is not a one-time exercise. It evolves with the project. The team uses it in sprint planning, architecture reviews, and quarterly audits. Every decision is documented, every risk has a mitigation, and every layer has a Definition of Done.
            </p>
          </div>
        </div>
      </Section>

      {/* Article: AI Development Risks */}
      <Section className="pt-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">AI Development Risks: What Is Different</h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Building software with AI — whether AI is in the product or AI tools write the code — introduces risks that traditional architecture decision frameworks do not cover. This sheet addresses both dimensions:
          </p>
          <h3 className="text-lg font-semibold">AI in the Product (Layers 15–17)</h3>
          <p className="text-sm text-muted-foreground">If your product includes AI features, three additional layers apply. These are conditional — skip them only if your product has no AI components. The risks here are existential: hallucinations in production, runaway agents, compliance violations, and cost spirals.</p>
          <h3 className="text-lg font-semibold">AI Tools in the Development Process (All Layers)</h3>
          <p className="text-sm text-muted-foreground">Even if your product has no AI features, if your team uses AI code assistants (Copilot, Cursor, Claude), every layer carries additional risk. AI-generated code:</p>
          <ul className="space-y-2">
            {[
              'Looks correct but contains subtle bugs — handles the happy path but fails on edge cases, race conditions, and transaction boundaries.',
              'Does not know your architecture decisions — generates code that violates existing ADRs because it has no context about your decisions.',
              'Introduces security vulnerabilities — missing auth, over-permissive CORS, SQL injection, prompt injection, insecure crypto.',
              'Generates tautological tests — coverage goes up while real validation stays flat. Tests pass but do not validate behavior.',
              'Recommends deprecated or incompatible packages — libraries that are no longer maintained or that conflict with your existing stack.',
            ].map((item, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm text-foreground">
              <strong>Quality Gate Approach:</strong> Every layer includes an <em>AI Quality Gate</em> — a specific, testable checkpoint that must pass before AI-generated code or AI features are deployed. These gates are enforced in CI, not in code review alone.
            </p>
          </div>
        </div>
      </Section>

      {/* Article: Documents Every PM and Architect Needs */}
      <Section className="pt-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Documents Every PM and Architect Needs</h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Each of the 25 layers specifies two document lists: <strong className="text-foreground">Architect Documents</strong> and <strong className="text-foreground">PM Documents</strong>. These are the concrete deliverables that prove a decision was made, reviewed, and approved.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-l-4 border-l-primary/40">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Layers className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-sm">Architect Documents</CardTitle>
                </div>
                <CardDescription className="text-sm">
                  Technical artifacts: ADRs, design documents, diagrams, specifications. They capture <em>what was decided and why</em>. Examples: technology decision ADR, domain model document, security architecture, AI pipeline design.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-amber-500/40">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <ClipboardCheck className="h-5 w-5 text-amber-500" />
                  </div>
                  <CardTitle className="text-sm">PM Documents</CardTitle>
                </div>
                <CardDescription className="text-sm">
                  Project management artifacts: sprint plans, review schedules, staffing plans, compliance timelines. They capture <em>when and by whom</em>. Examples: PRD with metrics, team skill matrix, pen test schedule, AI cost dashboard.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm text-foreground">
              <strong>Rule of thumb:</strong> If a layer has no documents, it has not been decided. The documents are the evidence that the decision was made, reviewed, and is being maintained.
            </p>
          </div>
        </div>
      </Section>

      {/* Article: CSM Alignment */}
      <Section className="pt-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">CSM Alignment: How This Sheet Maps to the Four Pillars</h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            The Architecture Decision Master Sheet operationalizes the <Link href="/haiec" className="text-primary font-medium hover:underline">Cognitive Systems Management (CSM)</Link> framework — the methodology underlying the HAIEC platform. CSM bridges AI strategy, technical execution, and governance into a single operating model with four pillars:
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {csmPillarData.map(p => {
              const Icon = p.icon
              return (
                <Card key={p.pillar} className="border-l-4 border-l-purple-500/40">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <CardTitle className="text-sm">{p.pillar}</CardTitle>
                        <p className="text-xs text-muted-foreground">{p.layers}</p>
                      </div>
                    </div>
                    <CardDescription className="text-sm">{p.focus}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
          <div className="rounded-lg border border-purple-300 bg-purple-50 dark:bg-purple-950/20 p-4">
            <p className="text-sm text-purple-900 dark:text-purple-200">
              <strong>Why CSM matters:</strong> Most architecture frameworks stop at technical decisions. CSM ensures that every technical decision is connected to business strategy, governance, and operations. The Architecture Decision Master Sheet is the practical tool that makes this connection explicit — every layer has a CSM pillar, and every pillar has concrete deliverables.
            </p>
          </div>
        </div>
      </Section>

      {/* Article: Definition of Done */}
      <Section className="pt-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Definition of Done: Why It Matters</h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Each of the 25 layers includes a <strong className="text-foreground">Definition of Done (DoD)</strong> — a specific, testable criterion that must be met before the layer is considered complete. The DoD is not a checklist item; it is a gate. Examples:
          </p>
          <ul className="space-y-2">
            {[
              'Product & Scope: PRD signed by Product Owner; success metrics defined and measurable; constraints documented; team briefed.',
              'Security & Policy: Security architecture documented; RLS implemented; encryption verified; audit logging active; security scan passing in CI.',
              'AI / RAG Pipeline: Pipeline tested end-to-end; evaluation suite passing; guardrails implemented; cost model validated; compliance reviewed.',
              'Ownership & Governance: Governance framework documented; ADR process active; ownership matrix published; decision log maintained; review cadence scheduled.',
            ].map((item, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            The DoD prevents the most common failure mode in software projects: <strong className="text-foreground">teams believe a layer is "done" when it is merely "started."</strong> The DoD makes the difference explicit and testable.
          </p>
        </div>
      </Section>

      {/* Article: Common Anti-Patterns */}
      <Section className="pt-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Common Anti-Patterns</h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Every layer includes an <strong className="text-foreground">anti-pattern</strong> field — a description of what bad looks like. Here are the top anti-patterns across all 25 layers:
          </p>
          <div className="space-y-2">
            {antiPatterns.map((ap, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm"><strong>{ap.layer}:</strong> {ap.pattern}</p>
                  <p className="text-xs text-muted-foreground mt-1">{ap.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Article: From Decisions to Delivery */}
      <Section className="pt-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">From Decisions to Delivery: How the Sheet Evolves</h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            The Architecture Decision Master Sheet is not a one-time exercise. It evolves through the project lifecycle:
          </p>
          {[
            { phase: 'Sprint 0 (Discovery)', desc: 'Address layers 1–4 (Foundation & Scope), 18 (Security), 23 (DevOps), and 25 (Governance). Document the PRD, domain model, tech stack ADR, and governance framework.' },
            { phase: 'Sprint 1 (Design)', desc: 'Address layers 5–7 (Interface), 10 (Data), 14 (Middleware), 20 (Testing), 21 (Code Review). Make API, rendering, and data architecture decisions. Set up CI gates and testing strategy.' },
            { phase: 'Sprint 2 (Build)', desc: 'Address layers 8–9 (Logic), 11 (Caching), 12–13 (Integration & Async), 15 (AI Pipeline), 19 (Validation), 22 (Observability). Implement services, integrations, and AI pipeline. Set up monitoring.' },
            { phase: 'Sprint 3 (Launch)', desc: 'Address layers 16–17 (AI Agents & Validation), 24 (Performance). Finalize agent architecture, output validation, load testing, and cost monitoring. Run the full evaluation suite.' },
            { phase: 'Operate (Ongoing)', desc: 'Review all layers quarterly. Update status, owners, and risks. Re-evaluate AI vendor contracts, compliance requirements, and performance budgets. The sheet is the living record of your architecture decisions.' },
          ].map(s => (
            <div key={s.phase}>
              <h3 className="text-base font-semibold">{s.phase}</h3>
              <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Lead Magnet */}
      <Section className="pt-8">
        <div className="max-w-2xl mx-auto">
          <LeadMagnetCard
            title="Free CSM Framework Guide"
            description="Get the Cognitive Systems Management (CSM) framework guide — the four-pillar methodology underlying the HAIEC platform that bridges AI strategy, technical execution, and governance into a single operating model."
            resourceName="CSM Framework Guide"
          />
        </div>
      </Section>

      {/* FAQ */}
      <Section className="pt-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="group rounded-lg border border-border p-4">
                <summary className="text-sm font-medium text-foreground cursor-pointer flex items-center justify-between">
                  {faq.q}
                  <span className="text-muted-foreground group-open:rotate-180 transition-transform">⌄</span>
                </summary>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      {/* Related Resources */}
      <Section className="pt-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold tracking-tight mb-4">Related Resources</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/ai-risk-register" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-sm">AI Risk Register</CardTitle>
                  </div>
                  <CardDescription className="text-sm">Track risks identified in this sheet with a structured template covering 34+ AI-specific risks.</CardDescription>
                  <span className="text-sm text-primary inline-flex items-center gap-1 mt-2">Open template <ArrowRight className="h-3 w-3" /></span>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/ai-security-tools" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-sm">AI Security Tools</CardTitle>
                  </div>
                  <CardDescription className="text-sm">Interactive blast radius calculator, agent action matrix, and prompt-injection scenario library.</CardDescription>
                  <span className="text-sm text-primary inline-flex items-center gap-1 mt-2">Open tools <ArrowRight className="h-3 w-3" /></span>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/ai-incident-evidence-checklist" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-sm">Incident Evidence Checklist</CardTitle>
                  </div>
                  <CardDescription className="text-sm">Four-phase checklist for preserving evidence after an AI security incident.</CardDescription>
                  <span className="text-sm text-primary inline-flex items-center gap-1 mt-2">Open checklist <ArrowRight className="h-3 w-3" /></span>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/ai-vendor-due-diligence-checklist" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-sm">Vendor Due-Diligence Checklist</CardTitle>
                  </div>
                  <CardDescription className="text-sm">60-item checklist for evaluating AI vendors — for Layer 4 (Build vs Buy) and Layer 12 (Integration).</CardDescription>
                  <span className="text-sm text-primary inline-flex items-center gap-1 mt-2">Open checklist <ArrowRight className="h-3 w-3" /></span>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/how-to-secure-and-govern-ai" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-sm">How to Secure and Govern AI</CardTitle>
                  </div>
                  <CardDescription className="text-sm">Seven layers of AI compliance — NIST AI RMF, ISO 42001, SOC 2, and continuous evidence.</CardDescription>
                  <span className="text-sm text-primary inline-flex items-center gap-1 mt-2">Read guide <ArrowRight className="h-3 w-3" /></span>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/haiec" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Cpu className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-sm">HAIEC Platform</CardTitle>
                  </div>
                  <CardDescription className="text-sm">The CSM framework and AI governance platform — bridges strategy, execution, and operations.</CardDescription>
                  <span className="text-sm text-primary inline-flex items-center gap-1 mt-2">Explore platform <ArrowRight className="h-3 w-3" /></span>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </Section>

      <CTA
        title="Need Help With Your Architecture Decisions?"
        description="Get a tailored architecture review and decision framework — from Subodh KC, co-founder of the HAIEC AI security and compliance engine."
        primaryButton={{ text: 'Book a Consultation', href: '/contact' }}
        secondaryButton={{ text: 'Explore HAIEC Platform', href: '/solutions/haiec' }}
      />
    </>
  )
}
