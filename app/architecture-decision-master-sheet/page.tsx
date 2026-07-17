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
  image: 'https://subodhkc.com/og-default.png',
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
    {
      '@type': 'Question',
      name: 'Does the tool save my progress?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. When you assign owners, statuses, sprints, or ADR references in the PM Tracking tab, your edits are saved automatically to your browser via localStorage. Your data persists across sessions on the same browser. Use the Export CSV or JSON buttons to share your tracking data with your team, or the Reset button to start fresh.' },
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
  { q: 'Does the tool save my progress?', a: 'Yes. When you assign owners, statuses, sprints, or ADR references in the PM Tracking tab, your edits are saved automatically to your browser via localStorage. Your data persists across sessions on the same browser. Use the Export CSV or JSON buttons to share your tracking data with your team, or the Reset button to start fresh.' },
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
              The Architecture Decision Master Sheet covers 25 architecture layers across 7 groups — from product scope to governance. Each layer includes purpose, criticality, phase, decision options, RACI (Responsible, Accountable, Consulted, Informed), risks, AI development risks, documents for architects and PMs, and a Definition of Done. Aligned with the{' '}
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

      {/* Article: What Is the Architecture Decision Master Sheet */}
      <Section className="pt-4">
        <div className="max-w-3xl mx-auto space-y-4 prose-article">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">What Is the <span className="gradient-text">Architecture Decision Master Sheet</span>?</h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            The Architecture Decision Master Sheet is an interactive reference covering <strong className="text-foreground">25 architecture layers</strong> that every software development project must consider — from product scope to governance. It is designed for <strong className="text-primary">PMs, architects, and tech leads</strong> who need a structured way to track decisions, risks, and deliverables across the full lifecycle of a software project, whether or not AI is part of the product.
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Each layer answers <strong className="text-foreground">seven questions</strong>: <span className="text-primary font-medium">Why</span> does it matter? <span className="text-primary font-medium">Who</span> is responsible? <span className="text-primary font-medium">How</span> is it implemented? <span className="text-primary font-medium">When</span> should it be addressed? <span className="text-primary font-medium">What</span> are the risks? <span className="text-primary font-medium">What</span> does bad look like? And <span className="text-primary font-medium">what documents</span> should architects and PMs produce?
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            The sheet also includes <strong className="text-red-500">AI development risks</strong> for every layer — not just the AI-specific layers (Group E). If your team uses AI tools to write code, or if your product includes AI features, these risks apply to you.
          </p>
          <div className="rounded-lg border border-purple-300 bg-purple-50 dark:bg-purple-950/20 p-4">
            <p className="text-sm text-purple-900 dark:text-purple-200">
              <strong>CSM-Aligned:</strong> Every layer maps to one of the four pillars of <Link href="/haiec" className="font-medium hover:underline">Cognitive Systems Management (CSM)</Link> — <span className="font-semibold">Strategic Alignment</span>, <span className="font-semibold">Technical Implementation</span>, <span className="font-semibold">Governance & Risk</span>, and <span className="font-semibold">Operational Excellence</span>. Use the CSM Pillar View in the interactive tool to see how the sheet operationalizes the framework.
            </p>
          </div>
        </div>
      </Section>

      {/* Quick Start */}
      <Section className="pt-4">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-accent/5 to-background p-6 md:p-8">
            <h2 className="text-sm font-semibold text-primary uppercase tracking-wide mb-4">Quick Start — 5 Steps</h2>
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">1</span>
                  <h3 className="text-sm font-semibold">Pick a scenario</h3>
                </div>
                <p className="text-xs text-muted-foreground">Select the card that matches your project: web app, AI product, AI tools, audit, or pilot recovery.</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">2</span>
                  <h3 className="text-sm font-semibold">Filter & explore</h3>
                </div>
                <p className="text-xs text-muted-foreground">Filter by phase, CSM pillar, criticality, or keyword. Click any layer for 6 tabs of detail.</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">3</span>
                  <h3 className="text-sm font-semibold">Assign owners</h3>
                </div>
                <p className="text-xs text-muted-foreground">Open the PM Tracking tab per layer. Set status, sprint, owner, and ADR reference. Edits save to your browser.</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">4</span>
                  <h3 className="text-sm font-semibold">Review AI risks</h3>
                </div>
                <p className="text-xs text-muted-foreground">Switch to AI Risk View. Check AI pitfalls and quality gates for every layer — especially if using AI code assistants.</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">5</span>
                  <h3 className="text-sm font-semibold">Export & share</h3>
                </div>
                <p className="text-xs text-muted-foreground">Export CSV or JSON with all 25 layers, risks, DoD, and tracking data. Import into your PM tool or spreadsheet.</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Who Is This For? */}
      <Section className="pt-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Who Is This <span className="gradient-text">For</span>?</h2>
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

      {/* Interactive Tool */}
      <Section className="pt-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Interactive <span className="gradient-text">Decision Sheet</span></h2>
          <p className="text-sm text-muted-foreground mb-6">Filter by group, criticality, phase, CSM pillar, or keyword. Click any layer to see full details across 6 tabs. Use the floating <strong className="text-foreground">?</strong> button at the bottom-right to open the glossary. Your tracking edits save automatically to your browser.</p>
          <ArchitectureDecisionSheet />
        </div>
      </Section>

      {/* Visual Layer Stack Diagram */}
      <Section className="pt-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">The 25 Layers at a <span className="gradient-text">Glance</span></h2>
          <div className="space-y-1.5">
            {[
              { label: 'Group A — Foundation & Scope', layers: '1–4', color: 'bg-blue-500/80', text: 'text-white', csm: 'Strategic Alignment' },
              { label: 'Group B — Interface & Interaction', layers: '5–7', color: 'bg-cyan-500/80', text: 'text-white', csm: 'Technical' },
              { label: 'Group C — Logic & Data', layers: '8–11', color: 'bg-teal-500/80', text: 'text-white', csm: 'Technical' },
              { label: 'Group D — Integration & Async', layers: '12–14', color: 'bg-green-500/80', text: 'text-white', csm: 'Technical' },
              { label: 'Group E — AI Layer (Conditional)', layers: '15–17', color: 'bg-red-500/80', text: 'text-white', csm: 'Technical' },
              { label: 'Group F — Quality & Security', layers: '18–21', color: 'bg-purple-500/80', text: 'text-white', csm: 'Governance & Risk' },
              { label: 'Group G — Operations & Delivery', layers: '22–25', color: 'bg-amber-500/80', text: 'text-white', csm: 'Operational Excellence' },
            ].map((g, i) => (
              <div key={i} className={`flex items-center justify-between rounded-lg ${g.color} ${g.text} px-4 py-2.5 shadow-sm`} style={{ marginLeft: `${i * 8}px`, marginRight: `${(7 - i) * 8}px` }}>
                <span className="text-sm font-medium">{g.label}</span>
                <span className="text-xs opacity-90">Layers {g.layers} · {g.csm}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">Each group maps to a CSM pillar. Group E (red) is conditional — only if your product includes AI features.</p>
        </div>
      </Section>

      {/* Article: The 7 Layer Groups */}
      <Section className="pt-4">
        <div className="max-w-3xl mx-auto space-y-6 prose-article">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">The <span className="gradient-text">7 Layer Groups</span> Explained</h2>

          {[
            { group: 'Group A — Foundation & Scope (Layers 1–4)', csm: 'Strategic Alignment', desc: 'These layers define what you are building and why. They are the highest-leverage decisions in the entire sheet. Getting these wrong means every downstream layer inherits the wrong assumptions.', items: ['Product & Scope — What problem are you solving?', 'Domain Modeling — Core business entities and rules', 'Tech Stack & Framework — Technologies and constraints', 'Build vs Buy Strategy — In-house vs SaaS decisions'] },
            { group: 'Group B — Interface & Interaction (Layers 5–7)', csm: 'Technical Implementation', desc: 'These layers define how users interact with the system. Key decisions include rendering strategy, state management, and API gateway design.', items: ['Client / UI Layer — Rendering, design system, accessibility', 'UI State Management — Global vs server vs local state', 'API & Gateway — Contract between frontend and backend'] },
            { group: 'Group C — Logic & Data (Layers 8–11)', csm: 'Technical Implementation', desc: 'These layers define where business logic lives and how data is stored. This is where most one-way doors live — schema migrations and domain model changes are expensive to reverse.', items: ['Service Layer — Centralized business logic', 'Controllers / Routing — Thin controllers', 'Data & Persistence — Schema, indexes, migrations', 'Caching & Performance — Invalidation strategy, TTL'] },
            { group: 'Group D — Integration & Async (Layers 12–14)', csm: 'Technical Implementation', desc: 'These layers define how external services connect and how background work gets done. The adapter pattern isolates vendor risk.', items: ['Integration / Adapters — Isolate vendor calls', 'Events & Async — Queue topology, idempotency, DLQ (Dead Letter Queue)', 'Middleware — Cross-cutting concerns'] },
            { group: 'Group E — AI Layer (Layers 15–17, Conditional)', csm: 'Technical Implementation', desc: 'These layers are only applicable if your product includes AI features. They carry the highest risk in the entire sheet — this is where most AI pilots fail.', items: ['AI / RAG Pipeline — Retrieval, chunking, embeddings, guardrails', 'AI Agent Architecture — Tool use, autonomy, escalation', 'AI Output Validation — Multi-layer validation, bias detection'] },
            { group: 'Group F — Quality & Security (Layers 18–21)', csm: 'Governance & Risk', desc: 'These layers define how you protect the system and verify correctness. AI introduces new attack surfaces that traditional security does not cover.', items: ['Security & Policy — Auth, encryption, RLS (Row-Level Security), audit logging', 'Validation & Integrity — Schema validation, sanitization', 'Testing Strategy — Unit, integration, e2e, AI evaluation', 'Code Review & Quality Gates — PR review, CI gates, AI code policy'] },
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

      {/* Article: Real-World Example */}
      <Section className="pt-4">
        <div className="max-w-3xl mx-auto space-y-4 prose-article">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Real-World Example: Building an <span className="gradient-text">AI-Powered Customer Support Tool</span></h2>
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
        <div className="max-w-3xl mx-auto space-y-4 prose-article">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight"><span className="gradient-text">AI Development Risks</span>: What Is Different</h2>
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
        <div className="max-w-3xl mx-auto space-y-4 prose-article">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Documents Every <span className="gradient-text">PM and Architect</span> Needs</h2>
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
        <div className="max-w-3xl mx-auto space-y-4 prose-article">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight"><span className="gradient-text">CSM Alignment</span>: How This Sheet Maps to the Four Pillars</h2>
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
        <div className="max-w-3xl mx-auto space-y-4 prose-article">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight"><span className="gradient-text">Definition of Done</span>: Why It Matters</h2>
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
        <div className="max-w-3xl mx-auto space-y-4 prose-article">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Common <span className="text-red-500">Anti-Patterns</span></h2>
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

      {/* Article: How This Compares to Other Frameworks */}
      <Section className="pt-4">
        <div className="max-w-3xl mx-auto space-y-4 prose-article">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">How This Compares to Other <span className="gradient-text">Architecture Frameworks</span></h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Several architecture frameworks exist. This sheet is not a replacement for any of them — it is a <strong className="text-foreground">complementary tool</strong> that operationalizes their principles into a trackable, layer-by-layer checklist with AI risks and PM deliverables.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse border border-border rounded-lg overflow-hidden">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 font-semibold text-foreground">Framework</th>
                  <th className="text-left py-2 px-3 font-semibold text-foreground">Best For</th>
                  <th className="text-left py-2 px-3 font-semibold text-foreground">AI Risks</th>
                  <th className="text-left py-2 px-3 font-semibold text-foreground">PM Deliverables</th>
                  <th className="text-left py-2 px-3 font-semibold text-foreground">DoD per Layer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-2 px-3 font-medium text-primary">This Sheet</td>
                  <td className="py-2 px-3 text-muted-foreground">AI-native projects, PMs + architects</td>
                  <td className="py-2 px-3"><span className="text-green-500 font-medium">Yes (5 fields per layer)</span></td>
                  <td className="py-2 px-3"><span className="text-green-500 font-medium">Yes (arch + PM docs)</span></td>
                  <td className="py-2 px-3"><span className="text-green-500 font-medium">Yes</span></td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">TOGAF</td>
                  <td className="py-2 px-3 text-muted-foreground">Enterprise architecture, large orgs</td>
                  <td className="py-2 px-3 text-muted-foreground">No</td>
                  <td className="py-2 px-3 text-muted-foreground">Partial</td>
                  <td className="py-2 px-3 text-muted-foreground">No</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">C4 Model</td>
                  <td className="py-2 px-3 text-muted-foreground">Visualizing architecture at 4 levels</td>
                  <td className="py-2 px-3 text-muted-foreground">No</td>
                  <td className="py-2 px-3 text-muted-foreground">No</td>
                  <td className="py-2 px-3 text-muted-foreground">No</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">AWS Well-Architected</td>
                  <td className="py-2 px-3 text-muted-foreground">Cloud infrastructure review</td>
                  <td className="py-2 px-3 text-muted-foreground">Partial (ML lens)</td>
                  <td className="py-2 px-3 text-muted-foreground">No</td>
                  <td className="py-2 px-3 text-muted-foreground">No</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">arc42</td>
                  <td className="py-2 px-3 text-muted-foreground">Documenting architecture decisions</td>
                  <td className="py-2 px-3 text-muted-foreground">No</td>
                  <td className="py-2 px-3 text-muted-foreground">No</td>
                  <td className="py-2 px-3 text-muted-foreground">No</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Key difference:</strong> This sheet is the only framework that pairs every layer with AI development risks (both AI-in-product and AI-tools-in-process), PM-specific deliverables, and a testable Definition of Done. It is designed to be used alongside TOGAF (for enterprise context), C4 (for visualization), and AWS Well-Architected (for cloud review) — not to replace them.
          </p>
        </div>
      </Section>

      {/* Social Proof */}
      <Section className="pt-4">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-background p-6 md:p-8 text-center">
            <p className="text-lg md:text-xl font-medium text-foreground leading-relaxed">
              "We used this sheet to audit a stalled AI pilot and found <span className="text-primary font-bold">3 missing layers</span> in 20 minutes — output validation, observability, and governance. The Definition of Done alone saved us from shipping another hallucination."
            </p>
            <p className="text-sm text-muted-foreground mt-4">— Architecture review team, AI customer support pilot</p>
          </div>
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
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Frequently Asked <span className="gradient-text">Questions</span></h2>
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
          <h2 className="text-xl font-bold tracking-tight mb-4">Related <span className="gradient-text">Resources</span></h2>
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
