import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LeadMagnetCard } from '@/components/LeadMagnetCard'
import { FileText, Shield, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'AI Risk Register Template | Subodh KC',
  description:
    'A structured AI risk register template for tracking AI system risks, likelihood, impact, controls, and remediation status across your AI portfolio.',
  alternates: {
    canonical: 'https://subodhkc.com/ai-risk-register',
  },
  openGraph: {
    title: 'AI Risk Register Template',
    description: 'A structured template for tracking AI system risks, likelihood, impact, controls, and remediation status.',
    url: 'https://subodhkc.com/ai-risk-register',
    type: 'article',
    authors: ['Subodh KC'],
    tags: ['AI Risk Register', 'AI Risk Management', 'AI Governance', 'NIST AI RMF'],
    images: ['https://subodhkc.com/og-default.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Risk Register Template',
    description: 'A structured template for tracking AI system risks, likelihood, impact, controls, and remediation status.',
  },
  robots: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  keywords: ['AI risk register', 'AI risk template', 'AI risk management', 'AI governance template', 'NIST AI RMF risk register', 'AI risk tracking', 'shadow AI risk', 'unauthorized AI use policy', 'AI hiring compliance risk', 'AI hallucination liability', 'AI model drift risk', 'AI vendor risk assessment', 'AI discrimination risk register', 'AI security risk matrix'],
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'AI Risk Register Template',
  description: 'A structured template for tracking AI system risks, likelihood, impact, controls, and remediation status across your AI portfolio.',
  author: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
  publisher: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
  datePublished: '2026-07-15',
  dateModified: '2026-07-15',
  url: 'https://subodhkc.com/ai-risk-register',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How is an AI risk register different from a traditional IT risk register?',
      acceptedAnswer: { '@type': 'Answer', text: 'Traditional IT risk registers focus on infrastructure, access control, and data breaches. An AI risk register must additionally cover prompt injection (where the attack vector is natural language), RAG poisoning (where the data source itself is the attack vector), tool abuse (where the model is manipulated into taking actions), model-driven authorization bypass (where the application trusts model output for access decisions), and supply-chain risks from MCP servers and model vendors. These risks do not exist in traditional software.' },
    },
    {
      '@type': 'Question',
      name: 'Should every AI application have its own risk register?',
      acceptedAnswer: { '@type': 'Answer', text: 'Small, low-risk applications (e.g., a single-user summarization tool with no sensitive data) can share a portfolio-level register. Any application with access to confidential data, more than 10 users, or action/admin tools should have its own register entry with application-specific risks, controls, and owners.' },
    },
    {
      '@type': 'Question',
      name: 'How do I know when to add a new risk to the register?',
      acceptedAnswer: { '@type': 'Answer', text: 'Add a new risk whenever: (1) a new data source is connected, (2) a new tool or MCP server is integrated, (3) the user population expands significantly, (4) the deployment model changes, (5) a security incident occurs (even if caught before impact), or (6) a new regulatory requirement applies. Review the register quarterly and after any architecture change.' },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between likelihood and impact?',
      acceptedAnswer: { '@type': 'Answer', text: 'Likelihood is the probability that the risk will materialize given your current controls and architecture. Impact is the severity of consequences if it does materialize — considering data sensitivity, number of users affected, financial cost, regulatory exposure, and reputational damage. A risk with Low likelihood but Critical impact (e.g., PHI exposure) still demands immediate attention.' },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'AI Security Tools', item: 'https://subodhkc.com/ai-security-tools' },
    { '@type': 'ListItem', position: 3, name: 'AI Risk Register', item: 'https://subodhkc.com/ai-risk-register' },
  ],
}

const riskCategories = [
  { category: 'Data & Privacy', risks: [
    { id: 'R-01', risk: 'Unauthorized data access through RAG retrieval without RLS', likelihood: 'Medium', impact: 'High', controls: 'Tenant filters before retrieval, metadata-based access control', owner: 'Data Engineering', status: 'Open' },
    { id: 'R-02', risk: 'Sensitive data leakage through global caching', likelihood: 'Medium', impact: 'High', controls: 'Session-scoped cache keys, no global cache for sensitive data', owner: 'Platform Team', status: 'Open' },
    { id: 'R-03', risk: 'PHI exposure in model prompts sent to external API', likelihood: 'Low', impact: 'Critical', controls: 'DLP scanning, data minimization in prompts, on-premise model option', owner: 'Security', status: 'Open' },
  ]},
  { category: 'Prompt Injection & Manipulation', risks: [
    { id: 'R-04', risk: 'Direct prompt injection overriding system instructions', likelihood: 'High', impact: 'High', controls: 'Server-side authorization, structured output validation, pattern detection', owner: 'Application Security', status: 'Open' },
    { id: 'R-05', risk: 'Indirect injection via poisoned RAG documents', likelihood: 'Medium', impact: 'Critical', controls: 'Content sanitization, document provenance, human approval for actions', owner: 'Data Engineering', status: 'Open' },
    { id: 'R-06', risk: 'Injection via MCP tool descriptions', likelihood: 'Low', impact: 'High', controls: 'Tool description review, trusted MCP servers only, tool allow-list', owner: 'Platform Team', status: 'Open' },
  ]},
  { category: 'Tool & Action Security', risks: [
    { id: 'R-07', risk: 'Excessive tool permissions (principle of least privilege violation)', likelihood: 'High', impact: 'High', controls: 'Tool allow-list per use case, regular permission audit', owner: 'Engineering', status: 'Open' },
    { id: 'R-08', risk: 'Automatic action execution without human approval', likelihood: 'Medium', impact: 'Critical', controls: 'Human approval for action/admin tools, server-side approval workflow', owner: 'Engineering', status: 'Open' },
    { id: 'R-09', risk: 'Model output trusted as authorization decision', likelihood: 'Medium', impact: 'Critical', controls: 'Server-side authorization independent of model, identity provider verification', owner: 'Security', status: 'Open' },
  ]},
  { category: 'Infrastructure & Supply Chain', risks: [
    { id: 'R-10', risk: 'Compromised MCP server exfiltrating data', likelihood: 'Low', impact: 'Critical', controls: 'Trusted publishers, network egress restrictions, sandbox MCP servers', owner: 'Security', status: 'Open' },
    { id: 'R-11', risk: 'Model vendor retaining sensitive prompts', likelihood: 'Medium', impact: 'High', controls: 'DPA with vendor, DLP scanning, on-premise fallback for sensitive data', owner: 'Legal & Security', status: 'Open' },
    { id: 'R-12', risk: 'Session State used as authoritative storage', likelihood: 'Medium', impact: 'Medium', controls: 'Durable storage for all consequential state, external database for audit', owner: 'Engineering', status: 'Open' },
  ]},
  { category: 'Shadow AI & Unauthorized Usage', risks: [
    { id: 'R-13', risk: 'Employees using personal ChatGPT/Claude/Gemini with company confidential data', likelihood: 'High', impact: 'High', controls: 'Acceptable use policy, DLP on egress traffic, sanctioned AI tool provision, employee training, monitoring for unsanctioned AI usage', owner: 'Security & HR', status: 'Open' },
    { id: 'R-14', risk: 'Teams adopting unsanctioned SaaS AI tools without security or legal review', likelihood: 'High', impact: 'Medium', controls: 'Procurement policy requiring security review for AI tools, SaaS discovery scanning, quarterly AI tool inventory audit, credit card expense review for AI subscriptions', owner: 'IT & Security', status: 'Open' },
    { id: 'R-15', risk: 'Employees pasting source code, financial data, or PII into public AI chatbots', likelihood: 'High', impact: 'Critical', controls: 'Data classification policy, DLP scanning for AI chatbot domains, employee training with real examples, sanctioned enterprise AI with no-training-on-data clause', owner: 'Security', status: 'Open' },
    { id: 'R-16', risk: 'Shadow AI usage creating undocumented data flows to unvetted third parties', likelihood: 'Medium', impact: 'High', controls: 'Network egress monitoring for AI API endpoints, data flow mapping, vendor due diligence on discovered tools, remediation plan for unauthorized tools', owner: 'Security', status: 'Open' },
  ]},
  { category: 'AI in Hiring & Employment Decisions', risks: [
    { id: 'R-17', risk: 'AI hiring tool used without independent bias audit (NYC LL 144 violation)', likelihood: 'Medium', impact: 'Critical', controls: 'Annual independent bias audit by qualified third party, public posting of audit summary, candidate notice 10 business days before use, audit retention per NYC DCWP requirements', owner: 'HR & Legal', status: 'Open' },
    { id: 'R-18', risk: 'Candidates not notified of AI use in hiring decisions (multi-state violation)', likelihood: 'Medium', impact: 'High', controls: 'Candidate notification template covering NYC LL 144, Illinois AIVIA, California FEHA, Colorado SB 189, EU AI Act Article 50; notification in job posting and before assessment; consent for video interview AI analysis', owner: 'HR & Legal', status: 'Open' },
    { id: 'R-19', risk: 'Algorithmic discrimination through biased training data or model behavior', likelihood: 'Medium', impact: 'Critical', controls: 'Disparate impact testing (four-fifths rule), demographic data collection where legally permitted, human review for all adverse decisions, appeal process for rejected candidates, California FEHA 4-year record retention', owner: 'HR & Compliance', status: 'Open' },
    { id: 'R-20', risk: 'Unauthorized biometric analysis (facial expression, voice emotion) in video interviews', likelihood: 'Low', impact: 'Critical', controls: 'Prohibit emotion recognition AI in hiring (EU AI Act Article 5 ban), verify vendor does not use biometric categorization, Illinois BIPA compliance, Maryland HB 1202 consent requirements, documented vendor attestation', owner: 'HR & Legal', status: 'Open' },
    { id: 'R-21', risk: 'AI employment decisions made without human oversight or appeal mechanism', likelihood: 'Medium', impact: 'High', controls: 'Human-in-the-loop for all hiring decisions, documented override authority, candidate appeal process, EU AI Act Article 26-27 compliance (human oversight + fundamental rights impact assessment), GDPR Article 22 right to human review', owner: 'HR & Legal', status: 'Open' },
    { id: 'R-22', risk: 'AI vendor changes model or training data without bias re-audit notification', likelihood: 'Medium', impact: 'High', controls: 'Contract clause requiring vendor notification on model updates, right to re-audit on model change, version pinning where possible, annual re-evaluation regardless of vendor notifications', owner: 'HR & Procurement', status: 'Open' },
  ]},
  { category: 'Model Behavior & Output Risks', risks: [
    { id: 'R-26', risk: 'AI hallucination causing real-world harm (fabricated citations, invented medical advice, false financial data)', likelihood: 'Medium', impact: 'High', controls: 'Output validation against source data, grounding requirements, human review for consequential outputs, citation verification, disclaimer on AI-generated content, user training on hallucination risks', owner: 'Engineering & Legal', status: 'Open' },
    { id: 'R-27', risk: 'Model drift or performance degradation over time without detection', likelihood: 'Medium', impact: 'Medium', controls: 'Continuous model performance monitoring, drift detection alerts, scheduled re-evaluation, vendor notification on model updates, A/B testing against baseline outputs', owner: 'Engineering', status: 'Open' },
    { id: 'R-28', risk: 'AI-generated content infringing third-party copyright or IP', likelihood: 'Medium', impact: 'High', controls: 'Output similarity scanning, vendor indemnification for IP claims, training data provenance disclosure, opt-out from training on copyrighted data, content attribution where possible', owner: 'Legal & Engineering', status: 'Open' },
    { id: 'R-29', risk: 'Third-party model provider outage or degradation with no fallback', likelihood: 'Low', impact: 'High', controls: 'Multi-provider architecture, cached response capability, degraded mode operation, SLA with provider, incident response playbook for provider outage', owner: 'Engineering', status: 'Open' },
  ]},
  { category: 'Organizational & Human Factors', risks: [
    { id: 'R-30', risk: 'Lack of AI literacy and training for end users (blind trust in AI outputs)', likelihood: 'High', impact: 'Medium', controls: 'Mandatory AI literacy training, documented AI limitations, output review checkpoints, feedback mechanism for incorrect outputs, role-based training on when to trust vs. verify AI outputs', owner: 'HR & Security', status: 'Open' },
    { id: 'R-31', risk: 'Cross-jurisdictional regulatory misalignment (compliant in one state/country but non-compliant in another)', likelihood: 'Medium', impact: 'High', controls: 'Jurisdictional compliance matrix, multi-state regulatory tracking, per-jurisdiction notification templates, legal review for cross-border deployments, modular compliance controls by region', owner: 'Legal & Compliance', status: 'Open' },
  ]},
  { category: 'Compliance & Governance', risks: [
    { id: 'R-32', risk: 'Missing AI system documentation for regulatory disclosure', likelihood: 'Medium', impact: 'High', controls: 'AI system registry, disclosure review process, automated documentation', owner: 'Compliance', status: 'Open' },
    { id: 'R-33', risk: 'No incident response plan for AI security events', likelihood: 'Medium', impact: 'High', controls: 'AI incident response playbook, evidence preservation checklist, tabletop exercises', owner: 'Security', status: 'Open' },
    { id: 'R-34', risk: 'Bias or discrimination in consequential AI decisions (non-hiring: lending, insurance, healthcare)', likelihood: 'Low', impact: 'High', controls: 'Bias testing, human review for consequential decisions, appeal process, NIST AI RMF alignment, ECOA/Regulation B compliance for lending, CFPB guidance adherence', owner: 'Compliance', status: 'Open' },
  ]},
]

const impactColors: Record<string, string> = {
  Low: 'text-green-600',
  Medium: 'text-amber-600',
  High: 'text-orange-600',
  Critical: 'text-red-600',
}

export default function AIRiskRegisterPage() {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Hero
        subtitle="AI Governance Resource"
        title={
          <>
            AI Risk Register
            <br />
            <span className="gradient-text">Template</span>
          </>
        }
        description="A structured template for tracking AI system risks, likelihood, impact, controls, and remediation status across your AI portfolio."
      />

      <Section className="pt-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><FileText className="h-4 w-4" /> July 15, 2026</span>
            <span>By Subodh KC</span>
          </div>
          <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/20 p-3">
            <p className="text-xs text-amber-900 dark:text-amber-200">
              <strong>Educational notice:</strong> This template provides a starting framework for AI risk management. Production deployments should undergo organization-specific risk assessment with qualified security and compliance professionals. Risks and controls should be tailored to your specific architecture, data types, and regulatory environment.
            </p>
          </div>
        </div>
      </Section>

      <Section className="pt-4">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-accent/5 to-background p-6 md:p-8">
            <h2 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">Synopsis</h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/90">
              A risk register is the foundation of AI governance. This template covers data and privacy risks, prompt injection vectors, tool and action security, infrastructure and supply chain threats, model behavior and output risks, organizational factors, and compliance gaps — aligned with the NIST AI RMF functions of Govern, Map, Measure, and Manage. Each risk includes likelihood, impact, recommended controls, an owner, and status tracking. Use it alongside the{' '}
              <Link href="/ai-security-tools" className="text-primary font-medium hover:underline">AI Security Tools</Link>,{' '}
              the{' '}
              <Link href="/ai-vendor-due-diligence-checklist" className="text-primary font-medium hover:underline">Vendor Due-Diligence Checklist</Link>,{' '}
              the{' '}
              <Link href="/ai-incident-evidence-checklist" className="text-primary font-medium hover:underline">Incident Evidence Checklist</Link>,{' '}
              and the{' '}
              <Link href="/build-internal-ai-applications-streamlit-rag-mcp" className="text-primary font-medium hover:underline">Streamlit architecture guide</Link>.
            </p>
          </div>
        </div>
      </Section>

      {/* Risk Prioritization Framework */}
      <Section className="pt-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Risk Prioritization Framework</h2>
          <p className="text-sm text-muted-foreground">Not all risks are equal. Use this framework to decide what to fix first.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-l-4 border-l-red-500/40">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  Fix immediately (Critical impact)
                </CardTitle>
                <CardDescription className="text-sm mt-1 space-y-1.5">
                  <span className="block">Any risk with Critical impact — regardless of likelihood — deserves immediate attention. A single occurrence could cause irreversible harm: PHI exposure, unauthorized fund transfers, or cross-tenant data breach.</span>
                  <span className="block"><strong className="text-foreground">Action:</strong> Implement controls before the next release. Block deployment if the control is not in place.</span>
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-orange-500/40">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  Fix this quarter (High likelihood + High impact)
                </CardTitle>
                <CardDescription className="text-sm mt-1 space-y-1.5">
                  <span className="block">Risks that are both likely and impactful. These are not emergencies but will cause real incidents if left unaddressed. Direct prompt injection (R-04) and excessive tool permissions (R-07) typically fall here.</span>
                  <span className="block"><strong className="text-foreground">Action:</strong> Assign owner, set target date within 90 days, track in weekly review.</span>
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-amber-500/40">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  Plan and monitor (Medium likelihood + Medium impact)
                </CardTitle>
                <CardDescription className="text-sm mt-1 space-y-1.5">
                  <span className="block">Risks that are possible but not immediately threatening. Session State misuse (R-12) and missing documentation (R-32) fall here. These can escalate if the architecture changes.</span>
                  <span className="block"><strong className="text-foreground">Action:</strong> Add to roadmap, review quarterly, escalate if likelihood increases.</span>
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-green-500/40">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Accept and document (Low likelihood + Low impact)
                </CardTitle>
                <CardDescription className="text-sm mt-1 space-y-1.5">
                  <span className="block">Risks that are unlikely and low-impact. Document the decision to accept, the reasoning, and the conditions that would trigger re-evaluation.</span>
                  <span className="block"><strong className="text-foreground">Action:</strong> Document acceptance rationale. Review annually or after architecture changes.</span>
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </Section>

      {/* NIST AI RMF Mapping */}
      <Section className="pt-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">NIST AI RMF Mapping</h2>
          <p className="text-sm text-muted-foreground">This risk register aligns with the four functions of the NIST AI Risk Management Framework. Use this mapping to integrate the register into your broader AI governance program.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-l-4 border-l-primary/40">
              <CardHeader>
                <CardTitle className="text-sm">Govern — Policies, procedures, and accountability</CardTitle>
                <CardDescription className="text-sm mt-1">Risks R-32 through R-34 (documentation, incident response, bias in consequential decisions). Establish who owns AI risk decisions, how risks are escalated, and what the organization's risk tolerance is. The risk register itself is a Govern artifact.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-primary/40">
              <CardHeader>
                <CardTitle className="text-sm">Map — Context and risk identification</CardTitle>
                <CardDescription className="text-sm mt-1">Risks R-01 through R-03 (data and privacy), R-13 through R-16 (shadow AI), R-30 through R-31 (organizational factors). Understand where AI is used, what data it touches, who uses it, and what could go wrong. The blast radius calculator supports this function.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-primary/40">
              <CardHeader>
                <CardTitle className="text-sm">Measure — Assessment and testing</CardTitle>
                <CardDescription className="text-sm mt-1">Risks R-04 through R-09 (prompt injection, tool abuse), R-17 through R-22 (hiring compliance), R-26 through R-27 (hallucination, drift). Quantify and track risks through testing, bias audits, and monitoring. The agent matrix and scenario library support this function.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-primary/40">
              <CardHeader>
                <CardTitle className="text-sm">Manage — Mitigation and response</CardTitle>
                <CardDescription className="text-sm mt-1">Risks R-10 through R-12 (supply chain, vendor, session state), R-23 through R-25 (vendor changes), R-28 through R-29 (IP, provider outage). Implement controls, monitor effectiveness, and respond to incidents. The vendor checklist and incident evidence checklist support this function.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </Section>

      {/* Scenario Example */}
      <Section className="pt-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Scenario: From Risk Identification to Remediation</h2>
          <div className="rounded-lg border border-border p-6 space-y-4">
            <p className="text-sm text-muted-foreground">A financial services firm builds an internal AI assistant using Streamlit and RAG. The engineering lead runs through the risk register and identifies the following chain:</p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/10 text-red-600 text-xs font-bold flex items-center justify-center">1</span>
                <div className="text-sm text-muted-foreground"><strong className="text-foreground">Identify:</strong> R-05 (Indirect injection via poisoned RAG documents) — Likelihood: Medium, Impact: Critical. The firm allows analysts to upload research notes to the RAG corpus. A malicious or compromised analyst could inject instructions into a document that the model retrieves and follows.</div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/10 text-orange-600 text-xs font-bold flex items-center justify-center">2</span>
                <div className="text-sm text-muted-foreground"><strong className="text-foreground">Assess:</strong> The blast radius is significant — the RAG corpus is shared across 200+ analysts, and the model has action tools (send email, create trade ticket). An injected instruction could cause the model to email restricted research to an external address.</div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold flex items-center justify-center">3</span>
                <div className="text-sm text-muted-foreground"><strong className="text-foreground">Control:</strong> Implement document provenance tracking (each upload is attributed to a named user with timestamp), content scanning for injection patterns before indexing, and mandatory human approval for the send-email tool. Remove automatic execution for all action tools.</div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/10 text-green-600 text-xs font-bold flex items-center justify-center">4</span>
                <div className="text-sm text-muted-foreground"><strong className="text-foreground">Verify:</strong> Run negative-access tests: upload a document containing hidden instructions and verify the model does not follow them. Confirm the send-email tool requires human approval. Update the risk register status from Open to Mitigated.</div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">5</span>
                <div className="text-sm text-muted-foreground"><strong className="text-foreground">Monitor:</strong> Add alerting on documents matching injection patterns. Review the risk register entry quarterly. Re-assess if the user population expands, new tools are added, or the upload policy changes.</div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section className="pt-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/20 p-4">
            <p className="text-sm text-amber-900 dark:text-amber-200">
              <AlertTriangle className="h-4 w-4 inline mr-1" />
              <strong>How to use:</strong> Copy this structure into a spreadsheet or governance tool. Assign owners, set target dates, and update status as controls are implemented. Review quarterly or after significant architecture changes.
            </p>
          </div>

          {riskCategories.map((cat) => (
            <div key={cat.category}>
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                {cat.category}
              </h3>
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-xs md:text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-2 font-semibold">ID</th>
                      <th className="text-left p-2 font-semibold">Risk</th>
                      <th className="text-left p-2 font-semibold">Likelihood</th>
                      <th className="text-left p-2 font-semibold">Impact</th>
                      <th className="text-left p-2 font-semibold">Controls</th>
                      <th className="text-left p-2 font-semibold">Owner</th>
                      <th className="text-left p-2 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {cat.risks.map((r) => (
                      <tr key={r.id} className="hover:bg-muted/20">
                        <td className="p-2 font-mono text-xs text-muted-foreground">{r.id}</td>
                        <td className="p-2 text-foreground/90">{r.risk}</td>
                        <td className={`p-2 font-medium ${impactColors[r.likelihood]}`}>{r.likelihood}</td>
                        <td className={`p-2 font-medium ${impactColors[r.impact]}`}>{r.impact}</td>
                        <td className="p-2 text-muted-foreground">{r.controls}</td>
                        <td className="p-2 text-muted-foreground">{r.owner}</td>
                        <td className="p-2">
                          <span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/5 px-2 py-0.5 text-xs text-amber-600">{r.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="pt-8">
        <div className="max-w-4xl mx-auto">
          <LeadMagnetCard
            title="Download the AI Risk Register Spreadsheet"
            description="Get the complete risk register as a structured spreadsheet with formulas, dropdowns, and conditional formatting — ready to import into your governance tool."
            resourceName="AI Risk Register Spreadsheet"
          />
        </div>
      </Section>

      {/* FAQ */}
      <Section className="pt-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-xl font-bold tracking-tight mb-4">FAQ</h2>
          {[
            {
              q: 'How is an AI risk register different from a traditional IT risk register?',
              a: 'Traditional IT risk registers focus on infrastructure, access control, and data breaches. An AI risk register must additionally cover prompt injection (where the attack vector is natural language), RAG poisoning (where the data source itself is the attack vector), tool abuse (where the model is manipulated into taking actions), model-driven authorization bypass (where the application trusts model output for access decisions), and supply-chain risks from MCP servers and model vendors. These risks do not exist in traditional software.',
            },
            {
              q: 'Should every AI application have its own risk register?',
              a: 'Small, low-risk applications (e.g., a single-user summarization tool with no sensitive data) can share a portfolio-level register. Any application with access to confidential data, more than 10 users, or action/admin tools should have its own register entry with application-specific risks, controls, and owners.',
            },
            {
              q: 'How do I know when to add a new risk to the register?',
              a: 'Add a new risk whenever: (1) a new data source is connected, (2) a new tool or MCP server is integrated, (3) the user population expands significantly, (4) the deployment model changes, (5) a security incident occurs (even if caught before impact), or (6) a new regulatory requirement applies. Review the register quarterly and after any architecture change.',
            },
            {
              q: 'What is the difference between likelihood and impact?',
              a: 'Likelihood is the probability that the risk will materialize given your current controls and architecture. Impact is the severity of consequences if it does materialize — considering data sensitivity, number of users affected, financial cost, regulatory exposure, and reputational damage. A risk with Low likelihood but Critical impact (e.g., PHI exposure) still demands immediate attention.',
            },
          ].map((faq) => (
            <details key={faq.q} className="rounded-lg border border-border p-4 group">
              <summary className="text-sm font-medium text-foreground cursor-pointer flex items-center justify-between">
                {faq.q}
                <span className="text-muted-foreground group-open:rotate-180 transition-transform">⌄</span>
              </summary>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section className="pt-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold tracking-tight mb-4">Related Resources</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/ai-security-tools" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-sm">AI Security Tools</CardTitle>
                  </div>
                  <CardDescription className="text-sm">Interactive blast radius calculator, agent matrix, and prompt-injection scenario library.</CardDescription>
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
                  <CardDescription className="text-sm">60-item checklist for evaluating AI vendors before procurement.</CardDescription>
                  <span className="text-sm text-primary inline-flex items-center gap-1 mt-2">Open checklist <ArrowRight className="h-3 w-3" /></span>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </Section>

      <CTA
        title="Need Help Building Your AI Risk Register?"
        description="Get a tailored AI risk assessment and governance framework — from Subodh KC, co-founder of the HAIEC AI security and compliance engine."
        primaryButton={{ text: 'Book a Consultation', href: '/contact' }}
        secondaryButton={{ text: 'Explore HAIEC Platform', href: '/solutions/haiec' }}
      />
    </>
  )
}
