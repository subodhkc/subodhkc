import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LeadMagnetCard } from '@/components/LeadMagnetCard'
import { StreamlitArchitectureDiagram } from '@/components/diagrams/StreamlitArchitectureDiagram'
import { MCPArchitectureDiagram } from '@/components/diagrams/MCPArchitectureDiagram'
import { FrameworkDecisionTree } from '@/components/diagrams/FrameworkDecisionTree'
import { DeliveryRoadmapTimeline } from '@/components/diagrams/DeliveryRoadmapTimeline'
import { Database, Search, Shield, Bot, FileText, AlertTriangle, CheckCircle2, Layers, Zap, Eye, Code, Server, Workflow, GitBranch, ArrowRight, Scale } from 'lucide-react'
import Link from 'next/link'
import Grid from '@/components/Grid'

export const metadata = {
  title: 'Build Internal AI Apps with Streamlit, RAG and MCP | Subodh KC',
  description:
    'Learn how to build internal AI applications with Streamlit, OpenAI, RAG, custom tools and MCP—plus security, architecture choices and a practical delivery roadmap.',
  alternates: {
    canonical: 'https://subodhkc.com/build-internal-ai-applications-streamlit-rag-mcp',
  },
  openGraph: {
    title: 'Build Internal AI Apps with Streamlit, RAG and MCP',
    description:
      'A practical architecture guide for teams that need useful internal software—not another AI demonstration. Streamlit, OpenAI, RAG, MCP, security and delivery roadmap.',
    url: 'https://subodhkc.com/build-internal-ai-applications-streamlit-rag-mcp',
    type: 'article',
    authors: ['Subodh KC'],
    publishedTime: '2026-07-14',
    modifiedTime: '2026-07-14',
    tags: ['Streamlit', 'MCP', 'RAG', 'OpenAI', 'Internal AI', 'Python'],
    images: ['https://subodhkc.com/og-default.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Build Internal AI Apps with Streamlit, RAG and MCP',
    description:
      'A practical architecture guide for teams that need useful internal software—not another AI demonstration.',
    images: ['https://subodhkc.com/og-default.png'],
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
  keywords: [
    'how to build internal AI applications with Streamlit',
    'Streamlit OpenAI application architecture',
    'Streamlit RAG chatbot tutorial',
    'build an AI application without an agent framework',
    'how to create an MCP server in Python',
    'Streamlit MCP integration',
    'Streamlit versus Gradio',
    'Streamlit versus FastAPI',
    'secure internal AI application architecture',
    'how to add RLS to a Streamlit application',
    'Model Context Protocol tutorial',
    'Streamlit agentic workflow',
    'internal AI application security',
    'Subodh KC Streamlit',
  ],
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Build Internal AI Applications with Streamlit: RAG, AI Chat, MCP and Custom OpenAI Workflows',
  description:
    'A practical architecture guide for building internal AI applications with Streamlit, OpenAI, RAG, custom tools and MCP—plus security, architecture choices and a delivery roadmap.',
  author: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com/person/subodh-kc' },
  publisher: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
  datePublished: '2026-07-14',
  dateModified: '2026-07-14',
  url: 'https://subodhkc.com/build-internal-ai-applications-streamlit-rag-mcp',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://subodhkc.com/build-internal-ai-applications-streamlit-rag-mcp' },
  image: 'https://subodhkc.com/og-default.png',
  inLanguage: 'en',
  articleSection: 'AI Architecture',
  wordCount: 8500,
  keywords: ['Streamlit', 'MCP', 'RAG', 'OpenAI', 'internal AI', 'Python', 'agentic workflow', 'row-level security'],
  about: ['Internal AI application architecture', 'Streamlit for AI applications', 'Model Context Protocol', 'RAG implementation', 'AI application security', 'Row-level security for AI'],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'Writing', item: 'https://subodhkc.com/writing' },
    { '@type': 'ListItem', position: 3, name: 'Build Internal AI Apps with Streamlit', item: 'https://subodhkc.com/build-internal-ai-applications-streamlit-rag-mcp' },
  ],
}

const faqs = [
  { q: 'Is Streamlit suitable for enterprise AI applications?', a: 'Streamlit can support enterprise internal applications when durable state, authentication, authorization, RLS, monitoring and backend services are implemented correctly. It is best suited to controlled, Python-heavy, data-oriented workflows rather than every type of public software product.' },
  { q: 'Can Streamlit build an AI agent?', a: 'Yes. Streamlit can provide the interface for an agentic application. The agent loop, tools, state, authorization and workflow execution may run in Python modules or a separate backend service.' },
  { q: 'Do I need an agent framework to use OpenAI?', a: 'No. You can call the OpenAI API directly, provide system instructions, request structured output and define function tools. Agent frameworks become useful when orchestration, handoffs and state management grow more complex.' },
  { q: 'What is an MCP server in simple terms?', a: 'An MCP server is a program that exposes data, reusable prompts or executable tools through a standard protocol that AI applications can discover and use.' },
  { q: 'Is an MCP server an AI model?', a: 'No. An MCP server may contain no model at all. It normally exposes capabilities to an AI host, while the model operates inside the host application.' },
  { q: 'Does MCP replace an API?', a: 'No. An MCP server often wraps an existing API and exposes it in a standardized format for AI clients. The underlying API may remain the actual system interface.' },
  { q: 'Can I create my own MCP server?', a: 'Yes. Official SDKs are available for Python, TypeScript and several other languages. In Python, the MCP SDK and FastMCP can expose tools, resources and prompts. In TypeScript, the official package is @modelcontextprotocol/sdk.' },
  { q: 'Should I build an MCP server or use function calling?', a: 'Use direct function calling for application-specific functions maintained in the same system. Consider MCP when a capability must be reused across multiple AI applications or maintained as an independent integration.' },
  { q: 'Can Streamlit connect to several MCP servers?', a: 'Yes. The application can maintain MCP clients for several servers, or use a compatible model API to access approved remote servers. Each server should have separate authorization, ownership and risk review.' },
  { q: 'Can MCP tools take actions?', a: 'Yes. MCP tools can expose executable operations, including API calls and database actions. Sensitive actions should require server-side authorization and, where appropriate, explicit human approval.' },
  { q: 'What model is required for MCP?', a: 'MCP does not require a specific model. The host application can use a model capable of interpreting tool definitions and selecting tools, while the MCP server remains model-independent.' },
  { q: 'What is the difference between MCP tools and MCP resources?', a: 'A tool performs an action or computation. A resource exposes readable context. A tool might create a ticket; a resource might return the ticket schema or a policy document.' },
  { q: 'What transport does MCP use?', a: 'Local MCP integrations often use standard input/output. Shared remote servers commonly use Streamable HTTP with normal web authentication controls.' },
  { q: 'Is Streamlit better than Gradio?', a: 'Streamlit is generally better for broader internal workflows combining data, forms, dashboards and chat. Gradio is often faster for focused model demonstrations and conversational or multimodal AI interfaces.' },
  { q: 'Is Streamlit better than Dash?', a: 'Streamlit is often faster to build. Dash provides a more explicit callback architecture and is particularly strong for complex analytics applications and Plotly-based dashboards.' },
  { q: 'Is Streamlit better than FastAPI?', a: 'They serve different roles. Streamlit provides a user interface. FastAPI provides reusable backend APIs. Many production applications should use both.' },
  { q: 'When should Streamlit be replaced with React or Next.js?', a: 'Consider a dedicated frontend when the application becomes customer-facing, requires highly customized UX, has complex client-side behavior or must support several different frontend clients.' },
  { q: 'Can Streamlit handle RAG?', a: 'Yes. Streamlit can manage the user and evidence interface. Document ingestion, embeddings, vector storage, RLS and retrieval should usually run in controlled modules or backend services.' },
  { q: 'Can Streamlit use MongoDB?', a: 'Yes. A Python MongoDB client can be used from Streamlit or from a backend service. The application should construct tenant and security filters from authenticated identity rather than user input.' },
  { q: 'Can Streamlit query Databricks?', a: 'Yes. Streamlit can query approved Databricks SQL endpoints, APIs or backend services. Access should be governed through the organization\'s Databricks and identity controls.' },
  { q: 'How should Streamlit handle long-running AI jobs?', a: 'Submit long-running work to an external worker, queue or workflow service. Store the job state durably and use Streamlit to display progress and results.' },
  { q: 'Is Streamlit Session State permanent?', a: 'No. Session State is intended to preserve per-session interface values across reruns. Durable business and audit records should be stored externally.' },
  { q: 'How do I prevent data leakage through Streamlit caching?', a: 'Avoid globally caching sensitive user-specific data. Scope cache keys carefully, use Session State for per-session values and enforce access again when retrieving authoritative data.' },
  { q: 'How do I secure an internal Streamlit AI application?', a: 'Use enterprise authentication, backend authorization, database RLS, server-side secrets, tool allow-lists, structured validation, logging, human approval and adversarial testing.' },
  { q: 'Should internal AI applications undergo a security review?', a: 'Yes. Internal applications may have broad access to sensitive enterprise data and systems. Review prompt injection, RAG poisoning, tool permissions, tenant isolation, logging, retention and incident response before production use.' },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
}

const tocItems = [
  { label: 'Why Streamlit Works for Internal AI', href: '#why-streamlit' },
  { label: 'The Simplest Mental Model', href: '#mental-model' },
  { label: 'Key AI Terms Explained', href: '#key-ai-terms' },
  { label: 'Using OpenAI Without an Agent Framework', href: '#openai-no-framework' },
  { label: 'Custom Orchestration', href: '#custom-orchestration' },
  { label: 'What MCP Actually Is', href: '#what-is-mcp' },
  { label: 'MCP Explained Through a Scenario', href: '#mcp-scenario' },
  { label: 'What an MCP Server Exposes', href: '#mcp-exposes' },
  { label: 'MCP Is Model-Independent', href: '#mcp-model-independent' },
  { label: 'Build vs Use Existing MCP Server', href: '#mcp-build-vs-use' },
  { label: 'How to Build an MCP Server in Python', href: '#mcp-python' },
  { label: 'MCP Server in TypeScript', href: '#mcp-typescript' },
  { label: 'Local vs Remote MCP Servers', href: '#mcp-local-remote' },
  { label: 'Function Calling or MCP', href: '#function-vs-mcp' },
  { label: 'Using MCP Through OpenAI', href: '#mcp-openai' },
  { label: 'Where RAG Fits in Streamlit', href: '#rag-in-streamlit' },
  { label: 'Streamlit State Is Not Your System of Record', href: '#state-not-record' },
  { label: 'Be Careful With Streamlit Caching', href: '#caching' },
  { label: 'Authentication, Authorization and RLS', href: '#auth-rls' },
  { label: 'RLS for RAG and AI Chat', href: '#rls-rag' },
  { label: 'Long-Running Work', href: '#long-running' },
  { label: 'Streamlit Is Not the Only Option', href: '#other-frameworks' },
  { label: 'Framework Selection Guide', href: '#framework-guide' },
  { label: 'Practical Delivery Roadmap', href: '#delivery-roadmap' },
  { label: 'Security and Compliance', href: '#security-compliance' },
  { label: 'Common Architecture Mistakes', href: '#common-mistakes' },
  { label: 'Final Perspective', href: '#final-perspective' },
  { label: 'Related Guides', href: '#related-guides' },
  { label: 'FAQ', href: '#faq' },
]

export default function StreamlitRAGMCPPage() {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Hero
        title="How to Build Internal AI Applications with Streamlit"
        subtitle="A practical architecture guide for teams that need useful internal software—not another AI demonstration."
      />

      <Section className="pt-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><FileText className="h-4 w-4" /> July 14, 2026</span>
            <span className="flex items-center gap-1.5"><Eye className="h-4 w-4" /> 30 min read</span>
            <span>By Subodh KC</span>
          </div>
          <div className="mt-3 rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground space-y-1">
            <p><strong className="text-foreground">Last reviewed:</strong> July 14, 2026</p>
            <p><strong className="text-foreground">Scope:</strong> Architecture guide for internal AI applications using Streamlit, OpenAI, RAG, and MCP — covering security, state management, framework selection, and delivery roadmap</p>
          </div>
          <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/20 p-3">
            <p className="text-xs text-amber-900 dark:text-amber-200">
              <strong>Educational notice:</strong> This guide explains architecture patterns in practical terms. Production deployments should undergo organization-specific security review, compliance assessment, and operational validation.
            </p>
          </div>
        </div>
      </Section>

      {/* Table of Contents */}
      <Section className="pt-4">
        <div className="max-w-4xl mx-auto">
          <details className="rounded-lg border border-border bg-muted/20 p-4">
            <summary className="cursor-pointer text-sm font-semibold text-foreground">Table of Contents ({tocItems.length} sections)</summary>
            <div className="mt-3 grid gap-1 sm:grid-cols-2 text-sm">
              {tocItems.map((item) => (
                <a key={item.href} href={item.href} className="text-muted-foreground hover:text-primary hover:underline py-0.5">{item.label}</a>
              ))}
            </div>
          </details>
        </div>
      </Section>

      {/* Synopsis */}
      <Section className="pt-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-accent/5 to-background p-6 md:p-8">
            <h2 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">Synopsis</h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/90">
              Streamlit is one of the fastest ways to build internal AI applications — combining chat, forms, dashboards, file workflows, and tool execution in Python. But the interface is not the architecture. This guide covers the complete picture: using OpenAI without an agent framework, custom orchestration, what MCP actually is and when to use it, RAG with row-level security, Session State versus durable storage, caching risks, authentication and authorization, framework selection (Streamlit vs Gradio vs Dash vs React), a seven-phase delivery roadmap, and the security review that should not be deferred. For teams that need useful internal software — not another AI demonstration.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Python teams building internal AI', 'Architects evaluating Streamlit', 'Engineering leads planning AI deployments', 'Security teams reviewing AI applications', 'Developers evaluating MCP', 'Anyone building RAG with Streamlit'].map((audience) => (
                <span key={audience} className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">{audience}</span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Intro */}
      <Section className="pt-4">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <p>An employee opens an internal application and asks:</p>
          <blockquote className="border-l-4 border-primary pl-6 py-2 text-lg font-medium italic text-foreground">
            &ldquo;Why did support incidents increase after the previous release, and what remediation was approved?&rdquo;
          </blockquote>
          <p>A useful application should not simply send that question to a language model.</p>
          <p>It may need to:</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              'Query the incident database',
              'Calculate the increase using structured data',
              'Retrieve the associated release notes',
              'Locate the approved remediation document',
              'Confirm that the employee is authorized to see those records',
              'Present the result with source references',
              'Offer an approved action, such as creating a follow-up task',
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
          <p>This is not merely an AI chatbot. It is an internal application that combines analytics, retrieval, business rules, authorization and AI.</p>
          <p>Streamlit can be one of the fastest ways to build the interface for that application. It allows Python developers to create forms, chat experiences, file-upload workflows, tables, charts and administrative screens without first building a separate JavaScript frontend.</p>
          <p>But Streamlit should not be mistaken for the complete architecture.</p>
          <blockquote className="border-l-4 border-primary pl-6 py-2 text-base font-medium italic">
            Streamlit can make internal AI accessible. The surrounding architecture determines whether it remains reliable, secure and maintainable.
          </blockquote>
          <p>This guide explains how the pieces fit together, what the common AI terms actually mean, where Model Context Protocol belongs, and when another application framework may be the better choice.</p>
        </div>
      </Section>

      {/* Key Takeaways */}
      <Section className="pt-4">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-6">
            <h2 className="text-lg font-bold mb-3">Key Takeaways</h2>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /><span><strong>Streamlit is the interface, not the architecture.</strong> It excels at combining chat, forms, dashboards and file workflows — but durable state, security and authorization belong in backend services.</span></li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /><span><strong>You don&apos;t need an agent framework.</strong> Call the OpenAI API directly, define your own tools, and own the orchestration loop. Add a framework only when complexity justifies it.</span></li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /><span><strong>MCP standardizes tool discovery, not authorization.</strong> Use it when multiple applications need the same capability. Use direct function calling for app-specific tools.</span></li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /><span><strong>RLS must be enforced before retrieval.</strong> The model should never receive unauthorized context. See the <Link href="/secure-enterprise-rag-architecture" className="text-primary hover:underline">secure enterprise RAG architecture guide</Link> for the full security model.</span></li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /><span><strong>Session State is not a database.</strong> Use it for interface continuity. Store approvals, audit evidence and workflow state in durable storage.</span></li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /><span><strong>Choose the framework by the product requirements</strong> — not by what the prototype was built in. See the <Link href="/guides" className="text-primary hover:underline">AI compliance guides</Link> for regulatory context.</span></li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Why Streamlit */}
      <Section className="pt-4" id="why-streamlit">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Why Streamlit Works Well for Internal AI Applications</h2>
          <p>Many internal applications are not conventional software products.</p>
          <p>Their users may need to:</p>
          <div className="grid gap-2 sm:grid-cols-2 text-sm">
            {['Upload technical logs', 'Search company policies', 'Review customer or operational records', 'Ask questions about reports', 'Generate structured findings', 'Compare documents', 'Approve recommendations', 'Assign remediation', 'Export evidence', 'Monitor model or workflow performance'].map((item) => (
              <div key={item} className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-primary flex-shrink-0" /><span>{item}</span></div>
            ))}
          </div>
          <p>These applications are usually heavy on Python, data and business logic but relatively light on complex frontend behavior. That is where Streamlit creates leverage.</p>
          <p>Its chat components can display user and assistant messages, stream responses and include tables, charts, images and other application elements inside a conversation. Its Session State mechanism allows values to persist across script reruns for an individual user session.</p>
          <p>A Streamlit application can therefore combine conversational AI, traditional forms, dashboards, file analysis, review queues, approval screens and administrative configuration. That matters because not every AI workflow should be forced into a chat window.</p>
          <p>A compliance assessment may work better as a guided questionnaire. A log analyzer may need a file panel, timeline and evidence table. An analytics assistant may need charts beside its explanation. Streamlit allows these interaction styles to coexist.</p>
        </div>
      </Section>

      {/* Mental Model with Architecture Diagram */}
      <Section className="pt-4" id="mental-model">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">The Simplest Mental Model</h2>
          <p>A practical internal AI architecture can be understood through six layers.</p>
        </div>
        <div className="max-w-4xl mx-auto mt-4">
          <h3 className="text-center text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Six-Layer Internal AI Architecture</h3>
          <StreamlitArchitectureDiagram />
          <p className="text-center text-xs text-muted-foreground mt-2">Figure 1 — Each layer has a distinct responsibility. Security, evidence and monitoring span all layers as a cross-cutting concern.</p>
        </div>
        <div className="max-w-4xl mx-auto space-y-4 mt-4">
          <div className="grid gap-3 md:grid-cols-2">
            <Card className="border-l-4 border-l-primary/40"><CardHeader><CardTitle className="text-sm flex items-center gap-2"><Layers className="h-4 w-4 text-primary" /> 1. Interface</CardTitle><CardDescription className="text-xs">What the user sees: chat input, forms, filters, buttons, file uploads, tables, charts, approval screens, status updates.</CardDescription></CardHeader></Card>
            <Card className="border-l-4 border-l-primary/40"><CardHeader><CardTitle className="text-sm flex items-center gap-2"><Code className="h-4 w-4 text-primary" /> 2. Application logic</CardTitle><CardDescription className="text-xs">Ordinary Python code: workflow steps, business rules, validation, routing, error handling, approval requirements.</CardDescription></CardHeader></Card>
            <Card className="border-l-4 border-l-accent/40"><CardHeader><CardTitle className="text-sm flex items-center gap-2"><Bot className="h-4 w-4 text-primary" /> 3. AI services</CardTitle><CardDescription className="text-xs">Language models, embedding models, rerankers, speech models, vision models.</CardDescription></CardHeader></Card>
            <Card className="border-l-4 border-l-accent/40"><CardHeader><CardTitle className="text-sm flex items-center gap-2"><Search className="h-4 w-4 text-primary" /> 4. Retrieval and tools</CardTitle><CardDescription className="text-xs">Documents, SQL databases, vector indexes, internal APIs, analytics systems, ticketing systems, MCP servers.</CardDescription></CardHeader></Card>
            <Card className="border-l-4 border-l-primary/40"><CardHeader><CardTitle className="text-sm flex items-center gap-2"><Database className="h-4 w-4 text-primary" /> 5. Enterprise systems</CardTitle><CardDescription className="text-xs">Authoritative systems of record: PostgreSQL, MongoDB, Databricks, SharePoint, ServiceNow, Salesforce, Azure DevOps.</CardDescription></CardHeader></Card>
            <Card className="border-l-4 border-l-primary/40"><CardHeader><CardTitle className="text-sm flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> 6. Controls</CardTitle><CardDescription className="text-xs">Who can use the application, which information they may access, which actions they may perform, what must be approved, what evidence must be retained.</CardDescription></CardHeader></Card>
          </div>
          <p>This separation prevents the user interface from becoming the entire application.</p>
        </div>
      </Section>

      {/* Key AI Terms */}
      <Section className="pt-4" id="key-ai-terms">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Key AI Terms, Explained Through One Scenario</h2>
          <p>Assume a company wants an internal application that helps engineers investigate production incidents. The user asks:</p>
          <blockquote className="border-l-4 border-primary pl-6 py-2 text-base font-medium italic">
            &ldquo;Find incidents similar to this error, explain the likely cause and prepare a remediation ticket.&rdquo;
          </blockquote>
          <p>Several different AI and software concepts may participate.</p>

          <h3 className="text-xl font-semibold mt-4">Large Language Model</h3>
          <p>A large language model, or LLM, is the component that interprets language and generates language. It can understand the engineer&apos;s request, summarize technical records, compare evidence, explain likely relationships, and draft the remediation ticket.</p>
          <p>It should not automatically receive unrestricted access to the incident database. The model is the reasoning and language component — not the database, authorization system or workflow engine.</p>

          <h3 className="text-xl font-semibold mt-4">System Instructions</h3>
          <p>System instructions define the model&apos;s operating expectations.</p>
          <div className="relative"><span className="absolute top-2 right-3 text-xs text-muted-foreground/60 font-mono">Text</span><pre className="rounded-lg bg-muted/50 p-4 overflow-x-auto text-sm"><code>{`You are an internal incident-analysis assistant.

Use only evidence returned by approved tools.
Separate observed facts from hypotheses.
Do not create or update tickets without human approval.`}</code></pre></div>
          <p>Instructions shape behavior, but they are not a security boundary. A prompt can tell a model not to reveal restricted records. It cannot replace database permissions or server-side authorization.</p>

          <h3 className="text-xl font-semibold mt-4">Structured Output</h3>
          <p>A normal model response may be free-form text. An application often needs predictable fields:</p>
          <div className="relative"><span className="absolute top-2 right-3 text-xs text-muted-foreground/60 font-mono">JSON</span><pre className="rounded-lg bg-muted/50 p-4 overflow-x-auto text-sm"><code>{`{
  "probable_cause": "string",
  "confidence": "low | medium | high",
  "supporting_incidents": [],
  "recommended_actions": [],
  "requires_human_review": true
}`}</code></pre></div>
          <p>Structured Outputs allow developers to require responses that follow a supplied JSON Schema, reducing errors such as missing keys or invalid field values.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-l-4 border-l-primary/40"><CardHeader><CardTitle className="text-sm">When it helps</CardTitle><CardDescription className="text-sm">Use structured output when the result must populate a table, create a report, feed another API, pass validation, drive a workflow, or be stored consistently.</CardDescription></CardHeader></Card>
            <Card className="border-l-4 border-l-accent/40"><CardHeader><CardTitle className="text-sm">Simple logic</CardTitle><CardDescription className="text-sm">Free-form answer &rarr; Good for humans. Structured answer &rarr; Better for software.</CardDescription></CardHeader></Card>
          </div>

          <h3 className="text-xl font-semibold mt-4">Function Calling or Tool Calling</h3>
          <p>Function calling allows a model to request an approved function. For example, you define <code className="rounded bg-muted px-1.5 py-0.5 text-sm">find_similar_incidents(error_code, application, date_range)</code>. The model may decide that this function is necessary and request arguments.</p>
          <p>Your application then: (1) confirms the function exists, (2) validates the arguments, (3) checks the user&apos;s permission, (4) executes the query, (5) logs the action, (6) returns the result to the model.</p>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
            <h4 className="text-sm font-semibold flex items-center gap-2 mb-1"><AlertTriangle className="h-4 w-4 text-amber-500" /> The important distinction</h4>
            <p className="text-sm">The model <strong>requests</strong> the tool. Your code <strong>authorizes and executes</strong> it. The model should never be the final authorization authority.</p>
          </div>

          <h3 className="text-xl font-semibold mt-4">Retrieval-Augmented Generation</h3>
          <p>Retrieval-augmented generation, or RAG, is used when the model needs unstructured knowledge. For the incident-analysis application, RAG might retrieve historical RCA reports, troubleshooting guides, release notes, architecture documentation, and known-error records.</p>
          <p>The process is: Question &rarr; Search approved knowledge &rarr; Retrieve relevant sections &rarr; Send those sections to the model &rarr; Generate a grounded answer.</p>
          <p>RAG is different from querying structured operational data. Use RAG for policies, procedures, manuals, reports, contracts, and technical narratives. Use SQL or governed analytics for counts, totals, current status, aggregations, and time-series metrics. A strong internal application may use both.</p>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm">For a comprehensive guide on RAG architecture, vector databases, hybrid search and row-level security, see the <Link href="/secure-enterprise-rag-architecture" className="text-primary hover:underline">Secure Enterprise RAG Architecture</Link> article.</p>
          </div>

          <h3 className="text-xl font-semibold mt-4">Embedding</h3>
          <p>An embedding is a numerical representation of meaning. The sentence &ldquo;The media stream closed unexpectedly&rdquo; may be mathematically close to &ldquo;The WebSocket connection terminated before completion&rdquo; even though the wording is different. Embedding models allow the application to find conceptually similar documents.</p>

          <h3 className="text-xl font-semibold mt-4">Vector Database or Vector Index</h3>
          <p>A vector index stores embeddings and allows the application to search for nearby vectors. The vector store could be PostgreSQL with <code className="rounded bg-muted px-1.5 py-0.5 text-sm">pgvector</code>, MongoDB Vector Search, Databricks AI Search, Elasticsearch or OpenSearch, or a dedicated platform such as Pinecone, Qdrant, Weaviate or Milvus.</p>
          <p>A separate vector database is not always necessary. If the application already uses PostgreSQL or MongoDB and the scale is reasonable, adding native vector capabilities may reduce synchronization and security complexity.</p>

          <h3 className="text-xl font-semibold mt-4">Agentic Workflow</h3>
          <p>A conventional workflow follows steps defined entirely by the developer. An agentic workflow allows the model to choose among approved paths.</p>
          <blockquote className="border-l-4 border-primary pl-6 py-2 text-base font-medium italic">
            The word <strong>agentic</strong> does not mean uncontrolled autonomy. A practical enterprise agent should operate inside approved tools, deterministic authorization, defined stopping conditions, rate limits, human approval, logging, and error handling.
          </blockquote>
          <p>Most useful internal systems are hybrid: the model interprets and recommends. Deterministic code authorizes and executes.</p>
        </div>
      </Section>

      {/* Using OpenAI Without an Agent Framework */}
      <Section className="pt-4" id="openai-no-framework">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Using OpenAI Without an Agent Framework</h2>
          <p>You do not need a managed agent platform or an agent SDK to build an AI-enabled Streamlit application. The simplest integration uses the OpenAI SDK and Responses API directly.</p>
          <div className="relative"><span className="absolute top-2 right-3 text-xs text-muted-foreground/60 font-mono">Python</span><pre className="rounded-lg bg-muted/50 p-4 overflow-x-auto text-sm"><code>{`import streamlit as st
from openai import OpenAI

client = OpenAI(api_key=st.secrets["OPENAI_API_KEY"])

st.title("Internal Operations Assistant")

question = st.chat_input("Ask a question")

if question:
    with st.chat_message("user"):
        st.write(question)

    response = client.responses.create(
        model="YOUR_APPROVED_MODEL",
        instructions=(
            "Answer using concise business language. "
            "Do not invent unavailable facts."
        ),
        input=question,
    )

    with st.chat_message("assistant"):
        st.write(response.output_text)`}</code></pre></div>
          <p>This creates an AI chat interface. It is not automatically an AI agent. You can then add capabilities incrementally:</p>
          <div className="grid gap-2 sm:grid-cols-2 text-sm">
            {['Structured output', 'Document retrieval', 'Function tools', 'Persistent state', 'Human approval', 'Multi-step orchestration', 'MCP integrations'].map((item, i) => (
              <div key={item} className="flex items-center gap-2"><span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{i + 1}</span><span>{item}</span></div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">OpenAI supports normal SDKs, its Responses API, an optional Agents SDK, or direct HTTP integration. The Agents SDK is an orchestration option rather than a prerequisite for using the models.</p>
        </div>
      </Section>

      {/* Custom Orchestration */}
      <Section className="pt-4" id="custom-orchestration">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Custom Orchestration Without an Agent SDK</h2>
          <p>Suppose the application exposes three functions: <code className="rounded bg-muted px-1.5 py-0.5 text-sm">search_documents()</code>, <code className="rounded bg-muted px-1.5 py-0.5 text-sm">query_incident_database()</code>, and <code className="rounded bg-muted px-1.5 py-0.5 text-sm">create_remediation_ticket()</code>. Your Python logic can manage the loop:</p>
          <div className="space-y-2 text-sm">
            {['Send the user request and available tool definitions to the model', 'Receive a tool request', 'Validate the tool and arguments', 'Authorize it against the current user', 'Execute the function', 'Send the result back to the model', 'Continue until the model returns a final answer'].map((step, i) => (
              <div key={i} className="flex items-center gap-2"><span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{i + 1}</span><span>{step}</span></div>
            ))}
          </div>
          <p>You may use <code className="rounded bg-muted px-1.5 py-0.5 text-sm">openai</code> for the model API, <code className="rounded bg-muted px-1.5 py-0.5 text-sm">pydantic</code> for typed validation, <code className="rounded bg-muted px-1.5 py-0.5 text-sm">fastapi</code> for reusable backend APIs, PostgreSQL or MongoDB for durable state, Redis or a queue for asynchronous work, and your own Python state machine for workflow control.</p>
          <p>The application, not a framework, owns: state, authorization, tool registry, retry logic, approval, audit logging, and termination conditions.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-l-4 border-l-green-500/40"><CardHeader><CardTitle className="text-sm flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> When this approach is appropriate</CardTitle><CardDescription className="text-sm">Few tools, understandable workflow, control and transparency matter, team already owns the backend, framework abstraction would add more complexity than value.</CardDescription></CardHeader></Card>
            <Card className="border-l-4 border-l-amber-500/40"><CardHeader><CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-500" /> When an agent framework may help</CardTitle><CardDescription className="text-sm">Many tools to coordinate, tasks pause and resume, work lasts minutes or hours, multiple specialist agents collaborate, state must survive failures, complex handoffs, organization needs built-in tracing.</CardDescription></CardHeader></Card>
          </div>
          <blockquote className="border-l-4 border-primary pl-6 py-2 text-base font-medium italic">
            The framework should solve an identified orchestration problem. It should not be added merely so the application can be described as &ldquo;agentic.&rdquo;
          </blockquote>
        </div>
      </Section>

      {/* What is MCP */}
      <Section className="pt-4" id="what-is-mcp">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">What Model Context Protocol Actually Is</h2>
          <p>Model Context Protocol, or MCP, is often described vaguely as a way to &ldquo;connect AI to tools.&rdquo; A more precise definition is:</p>
          <blockquote className="border-l-4 border-primary pl-6 py-2 text-base font-medium italic">
            MCP is a standardized client–server protocol through which AI applications can discover and use external data, reusable prompts and executable tools.
          </blockquote>
          <p>MCP does not replace the language model, the AI application, authentication, authorization, RAG, or the underlying business API. It standardizes the connection between the AI application and external capabilities.</p>
          <p>The official MCP architecture uses three participants:</p>
          <div className="grid gap-3 md:grid-cols-3">
            <Card className="text-center"><CardHeader><CardTitle className="text-sm flex items-center justify-center gap-2"><Server className="h-4 w-4 text-primary" /> Host</CardTitle><CardDescription className="text-xs">The AI application coordinating the experience</CardDescription></CardHeader></Card>
            <Card className="text-center"><CardHeader><CardTitle className="text-sm flex items-center justify-center gap-2"><GitBranch className="h-4 w-4 text-primary" /> Client</CardTitle><CardDescription className="text-xs">The component maintaining a connection to a specific MCP server</CardDescription></CardHeader></Card>
            <Card className="text-center"><CardHeader><CardTitle className="text-sm flex items-center justify-center gap-2"><Workflow className="h-4 w-4 text-primary" /> Server</CardTitle><CardDescription className="text-xs">The program exposing capabilities to that client</CardDescription></CardHeader></Card>
          </div>
        </div>
        <div className="max-w-4xl mx-auto mt-4">
          <h3 className="text-center text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">MCP Architecture</h3>
          <MCPArchitectureDiagram />
          <p className="text-center text-xs text-muted-foreground mt-2">Figure 2 — The host application owns the model, authorization and tool registry. The MCP server exposes tools, resources and prompts to the host through a standardized protocol. The server is model-independent.</p>
        </div>
      </Section>

      {/* MCP Scenario */}
      <Section className="pt-4" id="mcp-scenario">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">MCP Explained Through a Simple Scenario</h2>
          <p>Assume the Streamlit application must access ServiceNow. Without MCP, you might write a custom integration: Streamlit &rarr; Custom ServiceNow client &rarr; ServiceNow API. That may be completely appropriate.</p>
          <p>With MCP, the architecture becomes: Streamlit application or AI host &rarr; MCP client &rarr; ServiceNow MCP server &rarr; ServiceNow API. The MCP server may expose tools such as <code className="rounded bg-muted px-1.5 py-0.5 text-sm">search_incidents</code>, <code className="rounded bg-muted px-1.5 py-0.5 text-sm">read_incident</code>, <code className="rounded bg-muted px-1.5 py-0.5 text-sm">create_ticket</code>, and <code className="rounded bg-muted px-1.5 py-0.5 text-sm">update_ticket</code>. The application can discover these tools rather than having each integration hardcoded into the model layer.</p>
        </div>
      </Section>

      {/* MCP Exposes */}
      <Section className="pt-4" id="mcp-exposes">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">What an MCP Server Exposes</h2>
          <p>An MCP server can expose three principal types of capability.</p>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-l-4 border-l-primary/40"><CardHeader><CardTitle className="text-sm flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> Tools</CardTitle><CardDescription className="text-sm">Perform work: query a database, create a ticket, run a calculation, send an approved notification, retrieve current system status.</CardDescription></CardHeader></Card>
            <Card className="border-l-4 border-l-accent/40"><CardHeader><CardTitle className="text-sm flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Resources</CardTitle><CardDescription className="text-sm">Expose readable context: a database schema, a policy document, a configuration file, a customer record, an API response.</CardDescription></CardHeader></Card>
            <Card className="border-l-4 border-l-primary/40"><CardHeader><CardTitle className="text-sm flex items-center gap-2"><Layers className="h-4 w-4 text-primary" /> Prompts</CardTitle><CardDescription className="text-sm">Reusable interaction templates: &ldquo;Analyze this incident using the company RCA format&rdquo; or &ldquo;Prepare a compliance-gap assessment.&rdquo;</CardDescription></CardHeader></Card>
          </div>
          <p className="text-sm text-muted-foreground">The MCP specification defines tools, resources and prompts as core server primitives. It also allows clients to discover available capabilities before using them.</p>
        </div>
      </Section>

      {/* MCP Model-Independent */}
      <Section className="pt-4" id="mcp-model-independent">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">MCP Is Model-Independent</h2>
          <p>An MCP server does not need to contain an OpenAI model, Anthropic model or any model at all. The server may simply expose <code className="rounded bg-muted px-1.5 py-0.5 text-sm">get_customer_status()</code>. The model usually lives inside the host application.</p>
          <p>This separation is valuable because the same MCP server could be used by a Streamlit application, an IDE, a desktop AI assistant, another internal agent, or a different model provider. MCP standardizes context exchange; it does not dictate how the host selects or operates its language model.</p>
        </div>
      </Section>

      {/* Build vs Use MCP */}
      <Section className="pt-4" id="mcp-build-vs-use">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Do You Use an Existing MCP Server or Build Your Own?</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-l-4 border-l-green-500/40"><CardHeader><CardTitle className="text-sm flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Use an existing server</CardTitle><CardDescription className="text-sm">When the software vendor maintains it, it exposes the capabilities you need, its authorization model meets your requirements, its tool definitions are trustworthy, and its deployment and support model are acceptable. Review: who publishes it, what information it accesses, which actions it can take, how credentials are handled, whether approvals are supported, whether tool descriptions could be malicious, and how updates are controlled.</CardDescription></CardHeader></Card>
            <Card className="border-l-4 border-l-primary/40"><CardHeader><CardTitle className="text-sm flex items-center gap-2"><Code className="h-4 w-4 text-primary" /> Build your own</CardTitle><CardDescription className="text-sm">When the data is internal, the workflow is company-specific, existing APIs need a governed AI interface, you need custom RLS or tenant controls, you require specialized approval logic, or multiple internal AI applications need the same capability. The server becomes an AI-facing integration boundary around existing systems.</CardDescription></CardHeader></Card>
          </div>
        </div>
      </Section>

      {/* MCP Python */}
      <Section className="pt-4" id="mcp-python">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">How to Build an MCP Server in Python</h2>
          <p>The official MCP Python SDK provides <code className="rounded bg-muted px-1.5 py-0.5 text-sm">FastMCP</code>, which can expose tools, resources and prompts and can run through local or remote transports.</p>
          <div className="relative"><span className="absolute top-2 right-3 text-xs text-muted-foreground/60 font-mono">Python</span><pre className="rounded-lg bg-muted/50 p-4 overflow-x-auto text-sm"><code>{`from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Internal Incident Service", json_response=True)

@mcp.tool()
def get_incident(incident_id: str) -> dict:
    """Retrieve an incident the current service identity may access."""
    # Validate incident_id
    # Resolve authorization
    # Call internal API
    # Return approved fields
    return {
        "incident_id": incident_id,
        "status": "validated",
        "summary": "Example result"
    }

@mcp.resource("incident-schema://current")
def incident_schema() -> str:
    """Return the approved incident data schema."""
    return "incident_id, status, owner, summary"

@mcp.prompt()
def prepare_rca(incident_id: str) -> str:
    """Provide the approved RCA analysis template."""
    return (
        f"Analyze incident {incident_id}. "
        "Separate facts, hypotheses, impact and remediation."
    )

if __name__ == "__main__":
    mcp.run(transport="streamable-http")`}</code></pre></div>
          <p>The package and server framework do not determine which model you use. The consuming host may use OpenAI, another hosted model, a self-hosted model, or different models for different requests.</p>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <h3 className="text-sm font-semibold mb-2">Useful Python components</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm">
              {['mcp — official MCP Python SDK', 'FastMCP — higher-level server interface', 'pydantic — typed validation', 'fastapi — optional REST service layer', 'httpx — asynchronous API client', 'sqlalchemy — relational database access'].map((item) => (
                <div key={item} className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-primary flex-shrink-0" /><span>{item}</span></div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* MCP TypeScript */}
      <Section className="pt-4" id="mcp-typescript">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Building an MCP Server in TypeScript</h2>
          <p>The official TypeScript SDK uses:</p>
          <div className="relative"><span className="absolute top-2 right-3 text-xs text-muted-foreground/60 font-mono">Bash</span><pre className="rounded-lg bg-muted/50 p-4 overflow-x-auto text-sm"><code>{`npm install @modelcontextprotocol/sdk zod`}</code></pre></div>
          <p>The SDK supports servers and clients, tool schemas, resources, prompts and local or remote transports. Its current documentation recommends Streamable HTTP for remote servers and <code className="rounded bg-muted px-1.5 py-0.5 text-sm">stdio</code> for locally spawned integrations.</p>
          <p>TypeScript may be preferable when the underlying service is already Node.js, the integration team works in TypeScript, the server shares types with a web application, or the capability is deployed inside an existing JavaScript platform. The language choice should follow the system being exposed — not the language of the model provider.</p>
        </div>
      </Section>

      {/* Local vs Remote MCP */}
      <Section className="pt-4" id="mcp-local-remote">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Local Versus Remote MCP Servers</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-l-4 border-l-primary/40"><CardHeader><CardTitle className="text-sm">Local MCP server</CardTitle><CardDescription className="text-sm">Runs on the same machine as the host, communicates using standard input and output. Use for developer tooling, desktop applications, local file access, controlled workstation workflows.</CardDescription></CardHeader></Card>
            <Card className="border-l-4 border-l-accent/40"><CardHeader><CardTitle className="text-sm">Remote MCP server</CardTitle><CardDescription className="text-sm">Runs as a network service. Use for shared enterprise capabilities, multiple consumers, centralized updates, governed authentication, scalable deployment.</CardDescription></CardHeader></Card>
          </div>
          <p className="text-sm text-muted-foreground">MCP documentation distinguishes <code className="rounded bg-muted px-1 py-0.5 text-xs">stdio</code> for local process communication from Streamable HTTP for remote communication.</p>
        </div>
      </Section>

      {/* Function Calling vs MCP */}
      <Section className="pt-4" id="function-vs-mcp">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Function Calling or MCP: Which Should You Use?</h2>
          <p>They solve related but different problems.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-l-4 border-l-primary/40"><CardHeader><CardTitle className="text-sm">Use direct function calling when</CardTitle><CardDescription className="text-sm">One application owns the tools, there are only a few functions, the functions live in the same codebase, reuse across AI clients is unlikely, simplicity matters.</CardDescription></CardHeader></Card>
            <Card className="border-l-4 border-l-accent/40"><CardHeader><CardTitle className="text-sm">Use MCP when</CardTitle><CardDescription className="text-sm">Multiple applications need the same capability, tools must be discoverable, integrations are maintained independently, model-provider portability matters, local and remote clients must use one interface, tool ownership belongs to another team.</CardDescription></CardHeader></Card>
          </div>
          <p>A Streamlit application might use direct functions for application-specific behavior and MCP for shared enterprise systems. MCP is not automatically better. A two-function internal prototype does not necessarily need a protocol server, separate deployment and capability-discovery layer.</p>
        </div>
      </Section>

      {/* MCP through OpenAI */}
      <Section className="pt-4" id="mcp-openai">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Using MCP Through OpenAI</h2>
          <p>OpenAI&apos;s Responses API can connect to remote MCP servers, allowing models to use tools exposed by those servers. Developers can configure tool calls for automatic use or require explicit approval.</p>
          <p>A more controlled architecture may instead keep the MCP client inside your backend: Streamlit &rarr; Custom FastAPI service &rarr; OpenAI + MCP client &rarr; MCP server. This approach may provide greater control over authentication, token handling, approval, logging, data transformation, error recovery, and provider portability.</p>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-1"><AlertTriangle className="h-4 w-4 text-amber-500" /> Security concern</h3>
            <p className="text-sm">Prompt injection deserves particular attention when models can access MCP servers capable of reading sensitive data or executing actions. OpenAI&apos;s MCP guidance specifically identifies this as a security concern.</p>
          </div>
        </div>
      </Section>

      {/* RAG in Streamlit */}
      <Section className="pt-4" id="rag-in-streamlit">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Where RAG Fits in a Streamlit Application</h2>
          <p>RAG is a retrieval capability — not the entire application. A useful Streamlit RAG experience may allow users to select a knowledge domain, upload approved documents, ask questions, see source passages, review document versions, apply business filters, correct an answer, and flag outdated information.</p>
          <p>The architecture should separate ingestion from questioning.</p>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-l-4 border-l-primary/40"><CardHeader><CardTitle className="text-sm">Ingestion pipeline</CardTitle><CardDescription className="text-xs">Receiving files, scanning uploads, extracting text, identifying structure, classifying sensitivity, dividing content into chunks, generating embeddings, updating the vector index, propagating deletions, recording versions.</CardDescription></CardHeader></Card>
            <Card className="border-l-4 border-l-accent/40"><CardHeader><CardTitle className="text-sm">Query pipeline</CardTitle><CardDescription className="text-xs">Authenticating the user, resolving groups and tenant, building retrieval filters, running hybrid or vector search, reranking results, constructing model context, returning citations, logging evidence.</CardDescription></CardHeader></Card>
            <Card className="border-l-4 border-l-primary/40"><CardHeader><CardTitle className="text-sm">Streamlit interface</CardTitle><CardDescription className="text-xs">Collecting the question, displaying the answer, showing evidence, capturing feedback, presenting approval options.</CardDescription></CardHeader></Card>
          </div>
          <p className="text-sm text-muted-foreground">This is a cleaner design than rebuilding the vector index during a user&apos;s Streamlit session. For the full RAG architecture guide, see <Link href="/secure-enterprise-rag-architecture" className="text-primary hover:underline">Secure Enterprise RAG Architecture</Link>.</p>
        </div>
      </Section>

      {/* State Not Record */}
      <Section className="pt-4" id="state-not-record">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Streamlit State Is Not Your System of Record</h2>
          <p>Streamlit reruns the application script when users interact with widgets. Session State preserves values for the individual session across those reruns.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-l-4 border-l-green-500/40"><CardHeader><CardTitle className="text-sm flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Session State is useful for</CardTitle><CardDescription className="text-sm">Chat messages currently displayed, selected filters, current page, temporary form values, a draft that has not been submitted.</CardDescription></CardHeader></Card>
            <Card className="border-l-4 border-l-red-500/40"><CardHeader><CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-red-500" /> Should not be authoritative storage for</CardTitle><CardDescription className="text-sm">Approvals, completed transactions, audit evidence, durable chat history, workflow state, customer records, generated reports. Those belong in a database or durable service.</CardDescription></CardHeader></Card>
          </div>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-1"><AlertTriangle className="h-4 w-4 text-amber-500" /> A common mistake</h3>
            <p className="text-sm"><code className="rounded bg-muted px-1 py-0.5 text-xs">st.session_state[&quot;approved&quot;] = True</code> may update the interface. It does not create an approval record, a timestamp, an approver identity, a tamper-evident history, or a recoverable workflow state. For consequential activity, write the decision to durable storage.</p>
          </div>
        </div>
      </Section>

      {/* Caching */}
      <Section className="pt-4" id="caching">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Be Careful With Streamlit Caching</h2>
          <p>Caching can improve performance by avoiding repeated work. Good candidates include database connection pools, model clients, static configuration, public reference data, and expensive non-sensitive calculations.</p>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-1"><AlertTriangle className="h-4 w-4 text-amber-500" /> Do not globally cache sensitive user-specific results</h3>
            <p className="text-sm">Streamlit notes that cached values may be available across users, while Session State is scoped to an individual session. Risky examples include PHI, tenant-specific documents, customer records, authorization decisions, restricted query results, and private conversation context. Caching is a performance feature, not an access-control mechanism.</p>
          </div>
        </div>
      </Section>

      {/* Auth and RLS */}
      <Section className="pt-4" id="auth-rls">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Authentication, Authorization and RLS</h2>
          <p>These three concepts are related but distinct.</p>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-l-4 border-l-primary/40"><CardHeader><CardTitle className="text-sm flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> Authentication</CardTitle><CardDescription className="text-xs">&ldquo;Who is this user?&rdquo; Examples: Microsoft Entra ID, Okta, Google Workspace, Auth0, Enterprise SSO.</CardDescription></CardHeader></Card>
            <Card className="border-l-4 border-l-accent/40"><CardHeader><CardTitle className="text-sm flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Authorization</CardTitle><CardDescription className="text-xs">&ldquo;What may this user do?&rdquo; Examples: may use the compliance application, may upload documents, may execute a report, may create remediation, may approve a change.</CardDescription></CardHeader></Card>
            <Card className="border-l-4 border-l-primary/40"><CardHeader><CardTitle className="text-sm flex items-center gap-2"><Database className="h-4 w-4 text-primary" /> Row-level security</CardTitle><CardDescription className="text-xs">&ldquo;Which specific records may this user see?&rdquo; Examples: only their business unit, only their region, only their customer tenant, only non-PHI records, only incidents assigned to their team.</CardDescription></CardHeader></Card>
          </div>
          <p>A user may be authenticated and authorized to use the application while still being restricted to a subset of the underlying records.</p>
          <div className="rounded-lg bg-muted/30 p-4 text-center text-sm font-mono text-muted-foreground">
            Enterprise login &rarr; Authenticated identity &rarr; Role and group resolution &rarr; Database or API authorization &rarr; RLS and metadata filters &rarr; Approved result
          </div>
          <p className="text-sm text-muted-foreground">The Streamlit interface may hide inaccessible pages or actions, but the backend and data system must enforce the restriction.</p>
        </div>
      </Section>

      {/* RLS for RAG */}
      <Section className="pt-4" id="rls-rag">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">RLS for RAG and AI Chat</h2>
          <p>RLS must be applied before retrieval.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-l-4 border-l-red-500/40"><CardHeader><CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-red-500" /> Unsafe</CardTitle><CardDescription className="text-sm">Search every document &rarr; Send everything to model &rarr; Ask model not to reveal restricted data.</CardDescription></CardHeader></Card>
            <Card className="border-l-4 border-l-green-500/40"><CardHeader><CardTitle className="text-sm flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Safer</CardTitle><CardDescription className="text-sm">Authenticate user &rarr; Resolve tenant and groups &rarr; Apply database and vector filters &rarr; Retrieve approved chunks only &rarr; Send those chunks to model.</CardDescription></CardHeader></Card>
          </div>
          <p>The model should never receive unauthorized context. For every searchable chunk, consider metadata such as:</p>
          <div className="relative"><span className="absolute top-2 right-3 text-xs text-muted-foreground/60 font-mono">JSON</span><pre className="rounded-lg bg-muted/50 p-4 overflow-x-auto text-sm"><code>{`{
  "tenant_id": "business-unit-a",
  "allowed_groups": ["quality", "engineering"],
  "classification": "confidential",
  "contains_phi": false,
  "document_version": 4
}`}</code></pre></div>
          <p className="text-sm text-muted-foreground">The server — not the user prompt — should determine the effective tenant and group filters. For the complete RLS implementation guide, see <Link href="/secure-enterprise-rag-architecture" className="text-primary hover:underline">Secure Enterprise RAG Architecture</Link>.</p>
        </div>
      </Section>

      {/* Long-Running Work */}
      <Section className="pt-4" id="long-running">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Where Long-Running Work Should Run</h2>
          <p>Some tasks complete in seconds: generate a summary, search five documents, classify one record. Others may take minutes: process a large file set, run an evaluation suite, generate hundreds of embeddings, build a large report, execute a security scan.</p>
          <p>Long-running work should generally run outside the immediate Streamlit request flow. Use a background worker, a queue, a durable workflow system, a separate service, or a scheduled Databricks or cloud job.</p>
          <p>Streamlit can display: job submitted, current stage, percentage complete, errors, and final output. But the job state should survive a browser refresh or application restart.</p>
          <p className="text-sm text-muted-foreground">A FastAPI service can support reusable application APIs, while queues and workers can handle durable execution. Dash also provides explicit background-callback patterns for longer-running tasks using external worker backends.</p>
        </div>
      </Section>

      {/* Other Frameworks */}
      <Section className="pt-4" id="other-frameworks">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Streamlit Is Not the Only Option</h2>
          <p>Streamlit is useful, but the right framework depends on the interface and operating model.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-l-4 border-l-primary/40"><CardHeader><CardTitle className="text-sm">Gradio</CardTitle><CardDescription className="text-sm">Strong for model demonstrations, AI chat interfaces, multimodal input, rapid experimentation, shareable model applications. Choose Gradio when the model interaction is the center of the experience.</CardDescription></CardHeader></Card>
            <Card className="border-l-4 border-l-accent/40"><CardHeader><CardTitle className="text-sm">Dash</CardTitle><CardDescription className="text-sm">Strong for complex analytics dashboards, explicit reactive callbacks, rich Plotly visualization, carefully controlled UI updates, background callbacks and job queues. Choose Dash when analytics and interactive visualization are the primary product.</CardDescription></CardHeader></Card>
            <Card className="border-l-4 border-l-primary/40"><CardHeader><CardTitle className="text-sm">Panel</CardTitle><CardDescription className="text-sm">Well suited to PyData applications, scientific workflows, data exploration, complex Python dashboards, chat mixed with tables, plots, images and PDFs. Choose Panel when the team already works heavily with notebooks, HoloViz and scientific Python.</CardDescription></CardHeader></Card>
            <Card className="border-l-4 border-l-accent/40"><CardHeader><CardTitle className="text-sm">NiceGUI</CardTitle><CardDescription className="text-sm">An event-driven Python UI framework that can create browser-based interfaces from Python. Choose NiceGUI when the team wants to stay in Python, more interface control is required, and event-driven behavior is preferable to full script reruns.</CardDescription></CardHeader></Card>
            <Card className="border-l-4 border-l-primary/40"><CardHeader><CardTitle className="text-sm">Reflex</CardTitle><CardDescription className="text-sm">A full-stack Python application framework. Choose Reflex when the application needs more polished product behavior, Python-only full-stack development is a priority, and the interface will grow beyond a simple internal dashboard.</CardDescription></CardHeader></Card>
            <Card className="border-l-4 border-l-accent/40"><CardHeader><CardTitle className="text-sm">FastAPI Plus React or Next.js</CardTitle><CardDescription className="text-sm">For larger or public-facing software. Choose this architecture when the application is customer-facing, branding and UX matter, several clients use the same backend, mobile or external integrations are expected, or frontend and backend need independent scaling.</CardDescription></CardHeader></Card>
          </div>
        </div>
      </Section>

      {/* Framework Selection Guide with Diagram */}
      <Section className="pt-4" id="framework-guide">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Framework Selection Guide</h2>
        </div>
        <div className="max-w-4xl mx-auto mt-4">
          <h3 className="text-center text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Framework Decision Tree</h3>
          <FrameworkDecisionTree />
          <p className="text-center text-xs text-muted-foreground mt-2">Figure 3 — Decision tree for choosing a Python AI application framework based on product requirements.</p>
        </div>
        <div className="max-w-4xl mx-auto mt-4">
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr><th className="text-left p-3 font-semibold">Need</th><th className="text-left p-3 font-semibold">Strong starting option</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ['Internal AI workflow with forms, charts and chat', 'Streamlit'],
                  ['Fast model or chatbot demonstration', 'Gradio'],
                  ['Complex analytics dashboard', 'Dash'],
                  ['Scientific or PyData application', 'Panel'],
                  ['Event-driven Python interface', 'NiceGUI'],
                  ['Full-stack application primarily in Python', 'Reflex'],
                  ['Customer-facing product with custom UX', 'Next.js/React plus FastAPI'],
                  ['Reusable backend services', 'FastAPI'],
                  ['Shared AI tools across applications', 'MCP server'],
                  ['Durable long-running workflow', 'Queue or workflow engine'],
                ].map(([need, option]) => (
                  <tr key={need}><td className="p-3 text-foreground/90">{need}</td><td className="p-3 font-medium text-primary">{option}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">The framework should follow the product requirements. Do not select Streamlit only because the first prototype was written in Python.</p>
        </div>
      </Section>

      {/* Delivery Roadmap with Diagram */}
      <Section className="pt-4" id="delivery-roadmap">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">A Practical Delivery Roadmap</h2>
          <p>Building the interface is the easy part. The project should be managed as a controlled product and architecture initiative.</p>
        </div>
        <div className="max-w-4xl mx-auto mt-4">
          <h3 className="text-center text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Delivery Roadmap Timeline</h3>
          <DeliveryRoadmapTimeline />
          <p className="text-center text-xs text-muted-foreground mt-2">Figure 4 — Seven phases from definition through operation. Each phase has measurable exit criteria.</p>
        </div>
        <div className="max-w-4xl mx-auto space-y-4 mt-4">
          <div className="grid gap-3 md:grid-cols-2">
            <Card className="border-l-4 border-l-primary/40"><CardHeader><CardTitle className="text-sm">Phase 0: Define the Decision</CardTitle><CardDescription className="text-xs">Identify target users, define the decision or workflow, document current process, measure current effort, identify authoritative data sources, classify data, define what AI may and may not do, select success metrics. Exit: the team can state the intended outcome without using &ldquo;AI,&rdquo; &ldquo;agent&rdquo; or &ldquo;chatbot.&rdquo;</CardDescription></CardHeader></Card>
            <Card className="border-l-4 border-l-primary/40"><CardHeader><CardTitle className="text-sm">Phase 1: Architecture and Control Design</CardTitle><CardDescription className="text-xs">Select interface framework, define boundaries, choose model integration, determine RAG/SQL needs, design auth and RLS, identify tools, decide on MCP, define logging and evidence. Exit: every sensitive data path and executable action has an identified control owner.</CardDescription></CardHeader></Card>
            <Card className="border-l-4 border-l-primary/40"><CardHeader><CardTitle className="text-sm">Phase 2: Build a Vertical Slice</CardTitle><CardDescription className="text-xs">Prove one complete workflow end to end. Build Streamlit interface, integrate one model, connect one data source, implement one retrieval path, add citations, capture feedback. Exit: the system creates measurable user value and completes the full control path.</CardDescription></CardHeader></Card>
            <Card className="border-l-4 border-l-primary/40"><CardHeader><CardTitle className="text-sm">Phase 3: Production Foundation</CardTitle><CardDescription className="text-xs">Move secrets to managed storage, centralize auth, implement authorization and RLS, move durable state to database, separate ingestion from query, add typed schemas, timeouts, retry, structured logging, monitoring, rate and cost controls. Exit: application can restart without losing authoritative state.</CardDescription></CardHeader></Card>
            <Card className="border-l-4 border-l-primary/40"><CardHeader><CardTitle className="text-sm">Phase 4: Add RAG, Tools and MCP</CardTitle><CardDescription className="text-xs">Add approved document sources, build ingestion pipelines, add vector or hybrid retrieval, build golden tests, add function tools, define tool-level authorization, evaluate MCP servers, test prompt injection. Exit: every tool and knowledge source has an owner, scope, test evidence and removal path.</CardDescription></CardHeader></Card>
            <Card className="border-l-4 border-l-primary/40"><CardHeader><CardTitle className="text-sm">Phase 5: Verification and Pilot</CardTitle><CardDescription className="text-xs">Functional testing, negative-access testing, cross-tenant isolation, incorrect and ambiguous questions, unavailable sources, model and API failures, duplicate submissions, long-running work, UAT, security and compliance review. Exit: business, technical and security owners accept residual risk.</CardDescription></CardHeader></Card>
            <Card className="border-l-4 border-l-primary md:col-span-2"><CardHeader><CardTitle className="text-sm">Phase 6: Launch, Operate and Improve</CardTitle><CardDescription className="text-xs">Controlled rollout, monitor adoption and failure, track answer and retrieval quality, track latency and cost, review denied tool calls, monitor model and data drift, review user feedback, maintain incident response, revalidate after changes, retire stale tools and knowledge. Useful metrics: task-completion rate, time saved, retrieval success, unsupported-answer rate, user correction rate, tool-call success, denied-action rate, access-control failures, cost per task, average latency, adoption.</CardDescription></CardHeader></Card>
          </div>
        </div>
      </Section>

      {/* Security and Compliance */}
      <Section className="pt-4" id="security-compliance">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Security and Compliance Should Not Be Deferred</h2>
          <p>Internal applications are often treated as lower risk because they are not public. That assumption is weak. Internal tools may have broader access to customer data, employee data, source code, security incidents, health information, financial records, and administrative APIs.</p>
          <p>The risk increases when the application combines RAG, file uploads, tools and MCP.</p>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <h3 className="text-sm font-semibold mb-2">A security review should examine:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm">
              {['Prompt injection', 'RAG poisoning', 'Untrusted documents', 'Authentication gaps', 'Missing RLS', 'Cross-tenant retrieval', 'Excessive tool privileges', 'Tool-description manipulation', 'Sensitive logging', 'Credential handling', 'Approval bypass', 'Data retention', 'Model-vendor exposure', 'Incident response'].map((item) => (
                <div key={item} className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-primary flex-shrink-0" /><span>{item}</span></div>
              ))}
            </div>
          </div>
          <p>HAIEC&apos;s <Link href="/solutions/haiec" className="text-primary hover:underline">AI security capabilities</Link> currently include deterministic analysis for prompt injection, RAG poisoning, tool abuse, authentication gaps and tenant-isolation weaknesses, alongside runtime adversarial testing and evidence-grade outputs. For broader AI compliance guidance, see the <Link href="/guides" className="text-primary hover:underline">AI compliance guides</Link>.</p>
          <blockquote className="border-l-4 border-primary pl-6 py-2 text-base font-medium italic">
            Review the complete AI application, not only the model call. Most real failures occur in the integrations, permissions, retrieval layers and surrounding code.
          </blockquote>
        </div>
      </Section>

      {/* Common Mistakes */}
      <Section className="pt-4" id="common-mistakes">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Common Architecture Mistakes</h2>
          <div className="space-y-3">
            <Card className="border-l-4 border-l-amber-500/40"><CardHeader><CardTitle className="text-sm">Calling every AI feature an agent</CardTitle><CardDescription className="text-xs">A model that answers a prompt is not necessarily an agent. Use more precise language: AI-assisted application, RAG assistant, tool-enabled workflow, agentic workflow, multi-agent system.</CardDescription></CardHeader></Card>
            <Card className="border-l-4 border-l-amber-500/40"><CardHeader><CardTitle className="text-sm">Building an MCP server before proving reuse</CardTitle><CardDescription className="text-xs">An MCP server makes sense when several applications need the same capability. For a single application and two local functions, it may add unnecessary deployment and security overhead.</CardDescription></CardHeader></Card>
            <Card className="border-l-4 border-l-amber-500/40"><CardHeader><CardTitle className="text-sm">Keeping business rules inside prompts</CardTitle><CardDescription className="text-xs">A prompt saying &ldquo;Only managers may approve remediation&rdquo; is not enough. The API must independently verify that the user is a manager. Prompts explain expected behavior. Code enforces rules.</CardDescription></CardHeader></Card>
            <Card className="border-l-4 border-l-amber-500/40"><CardHeader><CardTitle className="text-sm">Using Streamlit Session State as a database</CardTitle><CardDescription className="text-xs">Session State is useful for interface continuity. It is not a durable transaction, approval or audit store.</CardDescription></CardHeader></Card>
            <Card className="border-l-4 border-l-amber-500/40"><CardHeader><CardTitle className="text-sm">Adding RAG when SQL is the correct answer</CardTitle><CardDescription className="text-xs">Do not retrieve text fragments to calculate official operational metrics. Use the governed data layer.</CardDescription></CardHeader></Card>
            <Card className="border-l-4 border-l-amber-500/40"><CardHeader><CardTitle className="text-sm">Allowing the model to create database queries without limits</CardTitle><CardDescription className="text-xs">For model-assisted SQL: use read-only credentials, restrict schemas and tables, validate queries, apply timeouts, limit result size, enforce RLS, prefer governed semantic views.</CardDescription></CardHeader></Card>
            <Card className="border-l-4 border-l-amber-500/40"><CardHeader><CardTitle className="text-sm">Moving to a complex frontend too early</CardTitle><CardDescription className="text-xs">A polished React application cannot rescue an unproven workflow. Prove user value first. Then invest in product-level UX when the requirement is real.</CardDescription></CardHeader></Card>
          </div>
        </div>
      </Section>

      {/* Final Perspective */}
      <Section className="pt-4" id="final-perspective">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Final Perspective</h2>
          <p>Streamlit is valuable because it lowers the distance between an idea and a usable internal application. A Python team can quickly combine data, AI chat, RAG, forms, charts, review workflows, tool execution, and human approval.</p>
          <p>But speed of interface development should not be confused with completeness of architecture. A reliable internal AI application still requires:</p>
          <div className="rounded-lg bg-muted/30 p-4 text-center text-sm font-mono text-muted-foreground">
            An authoritative source + a clear business workflow + controlled model access + typed outputs + approved tools + deterministic authorization + durable state + evidence + operational ownership
          </div>
          <p>You do not need a managed agent platform to build this. You can use the OpenAI API directly, define your own instructions and tools, implement custom orchestration and expose existing capabilities through ordinary Python APIs. You also do not need MCP for every integration. Use MCP when standardized, reusable access to tools and context creates real value.</p>
          <p>And use Streamlit when the primary need is to place a useful, data-heavy AI workflow in front of internal users quickly.</p>
          <blockquote className="border-l-4 border-primary pl-6 py-2 text-lg font-medium italic text-foreground">
            The most important question is not &ldquo;Which AI framework are we using?&rdquo; It is: &ldquo;What decision or action are we improving, and how will we prove the application remains correct, authorized and controlled?&rdquo;
          </blockquote>
          <p>Readers can also use the AI chat available through <Link href="/" className="text-primary hover:underline">my public profile</Link> to explore which architecture — Streamlit, a custom frontend, RAG, MCP or direct tool integration — best fits their specific use case. For advisory on implementing internal AI applications, see <Link href="/services" className="text-primary hover:underline">services</Link> or learn more <Link href="/about" className="text-primary hover:underline">about my background</Link>.</p>
        </div>
      </Section>

      {/* Lead Magnet */}
      <Section className="pt-8">
        <div className="max-w-4xl mx-auto">
          <LeadMagnetCard
            title="Free Internal AI Application Architecture Checklist"
            description="Get a practical checklist covering framework selection, OpenAI integration, MCP decisions, RAG in Streamlit, RLS, caching risks, security review and delivery roadmap phases — based on the framework in this article."
            resourceName="Internal AI Application Architecture Checklist"
          />
        </div>
      </Section>

      {/* Related Guides */}
      <Section className="pt-4" id="related-guides">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Related Guides & Resources</h2>
          <Grid cols={2} gap="md">
            <Link href="/secure-enterprise-rag-architecture" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Search className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">Secure Enterprise RAG Architecture</CardTitle>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">
                    Comprehensive guide to RAG with vector databases, hybrid search, row-level security, tenant isolation, and evidence-grade retrieval.
                  </CardDescription>
                  <span className="text-sm text-primary inline-flex items-center gap-1 mt-2">
                    Read guide <ArrowRight className="h-3 w-3" />
                  </span>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/does-texas-ai-law-apply-to-my-business" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Scale className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">Does the Texas AI Law Apply to My Business?</CardTitle>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">
                    Plain-English TRAIGA guide with interactive applicability checker, disclosure rules, penalties, and a ten-step readiness plan for small businesses.
                  </CardDescription>
                  <span className="text-sm text-primary inline-flex items-center gap-1 mt-2">
                    Read guide <ArrowRight className="h-3 w-3" />
                  </span>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/guides/texas-ai-law" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">Full TRAIGA / HB 149 Compliance Guide</CardTitle>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">
                    Section-by-section analysis of the Texas AI law, including developer and deployer duties, regulatory sandbox, Texas AI Council, and defense pathways.
                  </CardDescription>
                  <span className="text-sm text-primary inline-flex items-center gap-1 mt-2">
                    Read guide <ArrowRight className="h-3 w-3" />
                  </span>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/solutions/haiec" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">HAIEC AI Security & Compliance Platform</CardTitle>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">
                    Deterministic analysis for prompt injection, RAG poisoning, tool abuse, authentication gaps, tenant isolation, and evidence-grade compliance outputs.
                  </CardDescription>
                  <span className="text-sm text-primary inline-flex items-center gap-1 mt-2">
                    Explore platform <ArrowRight className="h-3 w-3" />
                  </span>
                </CardHeader>
              </Card>
            </Link>
          </Grid>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="pt-8" id="faq">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {faqs.map((item, i) => (
              <details key={i} className="rounded-lg border border-border bg-muted/20 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-foreground">{item.q}</summary>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="pt-8 pb-16">
        <div className="max-w-4xl mx-auto">
          <CTA
            title="Need an Internal AI Application Architecture?"
            description="Get an architecture assessment, security review, or implementation roadmap for your internal AI application — from Subodh KC, co-founder of the HAIEC AI security and compliance engine."
            primaryButton={{ text: 'Book a Consultation', href: '/contact' }}
            secondaryButton={{ text: 'Explore Research', href: '/research' }}
          />
        </div>
      </Section>
    </>
  )
}
