import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LeadMagnetCard } from '@/components/LeadMagnetCard'
import { FileText, Shield, ArrowRight, CheckCircle2, AlertTriangle, XCircle, Layers } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'AI Vendor Due-Diligence Checklist | Subodh KC',
  description:
    'A comprehensive checklist for evaluating AI vendors: data handling, security posture, model transparency, compliance, incident response, and contractual protections.',
  alternates: {
    canonical: 'https://subodhkc.com/ai-vendor-due-diligence-checklist',
  },
  openGraph: {
    title: 'AI Vendor Due-Diligence Checklist',
    description: 'A comprehensive checklist for evaluating AI vendors: data handling, security posture, model transparency, compliance, and contractual protections.',
    url: 'https://subodhkc.com/ai-vendor-due-diligence-checklist',
    type: 'article',
    authors: ['Subodh KC'],
    tags: ['AI Vendor Due Diligence', 'AI Procurement', 'AI Security', 'AI Compliance'],
    images: ['https://subodhkc.com/og-default.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Vendor Due-Diligence Checklist',
    description: 'A comprehensive checklist for evaluating AI vendors: data handling, security, model transparency, compliance, and contracts.',
  },
  robots: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  keywords: ['AI vendor due diligence', 'AI vendor checklist', 'AI procurement checklist', 'AI vendor security assessment', 'AI vendor evaluation', 'AI vendor compliance', 'AI vendor risk assessment template', 'AI vendor security questionnaire', 'AI vendor contract requirements', 'AI vendor SOC 2 requirements', 'AI startup vendor evaluation', 'AI vendor bias audit requirements', 'AI vendor data processing agreement', 'AI vendor continuous monitoring'],
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'AI Vendor Due-Diligence Checklist',
  description: 'A comprehensive checklist for evaluating AI vendors: data handling, security posture, model transparency, compliance, incident response, and contractual protections.',
  author: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
  publisher: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
  datePublished: '2026-07-15',
  dateModified: '2026-07-15',
  url: 'https://subodhkc.com/ai-vendor-due-diligence-checklist',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'When should I re-evaluate an existing AI vendor?',
      acceptedAnswer: { '@type': 'Answer', text: 'Re-evaluate annually at minimum. Additionally, re-evaluate when: the vendor is acquired or changes ownership, the vendor announces a new model or architecture change, your data scope expands (e.g., you start sending PHI when you previously only sent public data), a security incident occurs at the vendor, your regulatory obligations change, or the vendor sub-processor list changes without notification.' },
    },
    {
      '@type': 'Question',
      name: 'What if the vendor is a startup without SOC 2 yet?',
      acceptedAnswer: { '@type': 'Answer', text: 'Startups may not have SOC 2 Type II yet, but they should have a clear timeline and evidence of progress. Require: a signed security plan with target dates, a completed security questionnaire (e.g., CAIQ), penetration test results, and contractual commitments for certification within 12 months. Weigh the risk against the business value — a startup handling PHI without SOC 2 is a different risk profile than one handling public data.' },
    },
    {
      '@type': 'Question',
      name: 'Should I require the vendor to support on-premise deployment?',
      acceptedAnswer: { '@type': 'Answer', text: 'For highly sensitive data (PHI, biometric, financial records, source code), on-premise or customer-managed cloud deployment significantly reduces data exposure. If the vendor cannot support this, require: DLP scanning on outbound prompts, a DPA with strict no-training-on-data clauses, customer-managed encryption keys (CMEK), and a documented data deletion process with verification.' },
    },
    {
      '@type': 'Question',
      name: 'How do I evaluate a vendor that uses third-party models (e.g., OpenAI, Anthropic)?',
      acceptedAnswer: { '@type': 'Answer', text: 'The vendor should disclose which third-party models they use and provide the model provider security documentation. You need to evaluate both the vendor (your direct contractor) and the model provider (a sub-processor). Ensure the vendor DPA covers sub-processor obligations, and that data flow to the model provider is documented. If the vendor cannot disclose the model provider, that is a red flag.' },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'AI Security Tools', item: 'https://subodhkc.com/ai-security-tools' },
    { '@type': 'ListItem', position: 3, name: 'AI Vendor Due-Diligence Checklist', item: 'https://subodhkc.com/ai-vendor-due-diligence-checklist' },
  ],
}

const checklistSections = [
  {
    title: 'Data Handling & Privacy',
    items: [
      'What data does the vendor collect from your organization (prompts, documents, metadata, logs)?',
      'Where is data stored (region, data center, sub-processor locations)?',
      'How long is data retained after processing?',
      'Is data used to train or fine-tune the vendor models? If so, can you opt out?',
      'Does the vendor support data residency requirements (e.g., EU, US, specific regions)?',
      'What encryption is applied in transit and at rest?',
      'Does the vendor have a DPA (Data Processing Agreement) template?',
      'What is the vendor data deletion process upon contract termination?',
      'Does the vendor support customer-managed encryption keys (CMEK)?',
      'What is the breach notification timeline and process?',
    ],
  },
  {
    title: 'Security Posture',
    items: [
      'Does the vendor have SOC 2 Type II, ISO 27001, or equivalent certification?',
      'Has the vendor undergone a third-party penetration test in the last 12 months?',
      'Does the vendor support SSO/SAML integration with your identity provider?',
      'Does the vendor enforce role-based access control (RBAC)?',
      'Does the vendor support API key rotation and scoped permissions?',
      'What is the vendor vulnerability disclosure policy?',
      'Does the vendor provide audit logs for all API calls and administrative actions?',
      'Does the vendor isolate customer data at the tenant level (not just logical separation)?',
      'What network security controls are in place (WAF, DDoS protection, egress filtering)?',
      'Does the vendor have a documented security incident response plan?',
    ],
  },
  {
    title: 'Model Transparency & AI Specifics',
    items: [
      'What model(s) power the service? Are they proprietary, open-source, or third-party?',
      'Can the vendor disclose the model version and update cadence?',
      'Does the vendor provide model cards or documentation of capabilities and limitations?',
      'What guardrails and safety filters are applied to model inputs and outputs?',
      'Does the vendor support custom system instructions or configuration?',
      'Can you bring your own model or fine-tune on your data?',
      'What is the model performance monitoring and drift detection process?',
      'Does the vendor provide bias audit results or fairness evaluations?',
      'How does the vendor handle model deprecation and migration?',
      'Does the vendor expose tool/function calling, MCP, or agent capabilities? If so, what are the security controls?',
      'Does the vendor conduct adversarial testing or red-teaming on their own models? What is the cadence and scope?',
      'Can the vendor disclose training data provenance — what data was used to train the model, and whether any copyrighted or licensed data is included?',
      'Does the vendor use open-source models (e.g., HuggingFace, Ollama)? If so, what are the license terms and attribution requirements?',
    ],
  },
  {
    title: 'Compliance & Regulatory',
    items: [
      'Does the vendor comply with relevant regulations (GDPR, CCPA, HIPAA, EU AI Act, TRAIGA)?',
      'Can the vendor provide a compliance matrix mapping to your regulatory requirements?',
      'Does the vendor support data processing impact assessments (DPIAs)?',
      'Does the vendor have an AI governance framework (e.g., NIST AI RMF alignment)?',
      'What is the vendor approach to AI system disclosure and transparency obligations?',
      'Does the vendor maintain an AI system registry or inventory?',
      'Can the vendor provide evidence for audit, regulatory inquiry, or litigation hold?',
      'Does the vendor have insurance coverage for AI-related liabilities?',
      'What jurisdictions does the vendor operate in and are there cross-border data transfer implications?',
      'Does the vendor have a process for handling government or law enforcement data requests?',
      'Does the vendor maintain a model versioning policy with backward compatibility guarantees? What happens when the model is updated or deprecated?',
    ],
  },
  {
    title: 'Contractual Protections',
    items: [
      'Are data ownership and IP rights clearly defined (you own your data, outputs, and derivatives)?',
      'Are liability caps and indemnification clauses adequate for AI-related harm?',
      'Is there a right to audit clause?',
      'Are service levels (uptime, latency, support response) defined and enforceable?',
      'Is there a termination and data return/deletion clause with defined timelines?',
      'Are sub-processors listed and is there a notification requirement for changes?',
      'Is there a confidentiality and non-use clause that prevents the vendor from using your data for marketing?',
      'Are there restrictions on the vendor using your data to train models?',
      'Is there a change-of-control clause that triggers re-evaluation on acquisition?',
      'Are there clauses addressing AI-specific risks (model deprecation, bias, hallucination liability)?',
      'Does the vendor disclose whether their own sub-processors use AI on your data? If so, what are the controls and notification requirements?',
    ],
  },
  {
    title: 'Operational & Incident Response',
    items: [
      'What is the vendor uptime history over the past 12 months?',
      'Does the vendor provide status pages and incident notifications?',
      'What is the support model (hours, channels, response times, escalation)?',
      'Does the vendor have a documented AI incident response process?',
      'How quickly can the vendor disable a compromised integration or API key?',
      'Does the vendor provide post-incident reports after security events?',
      'What is the vendor disaster recovery and business continuity plan?',
      'Does the vendor conduct regular tabletop exercises for AI security incidents?',
      'What is the process for reporting vulnerabilities or security concerns?',
      'Does the vendor provide a dedicated security contact or CISO liaison?',
    ],
  },
]

export default function AIVendorDueDiligenceChecklistPage() {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Hero
        subtitle="AI Procurement Resource"
        title={
          <>
            AI Vendor Due-Diligence
            <br />
            <span className="gradient-text">Checklist</span>
          </>
        }
        description="A comprehensive checklist for evaluating AI vendors across data handling, security posture, model transparency, compliance, contracts, and incident response."
      />

      <Section className="pt-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><FileText className="h-4 w-4" /> July 15, 2026</span>
            <span>By Subodh KC</span>
          </div>
          <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/20 p-3">
            <p className="text-xs text-amber-900 dark:text-amber-200">
              <strong>Educational notice:</strong> This checklist is a starting point for vendor evaluation, not a legal document. Adapt it to your jurisdiction, industry, and risk tolerance. Have your legal team review all contractual provisions before signing. Some items may not apply to your use case — document why if you skip them.
            </p>
          </div>
        </div>
      </Section>

      <Section className="pt-4">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-accent/5 to-background p-6 md:p-8">
            <h2 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">Synopsis</h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/90">
              Selecting an AI vendor is not just a procurement decision — it is a security, compliance, and liability decision. This checklist covers six domains: data handling and privacy, security posture, model transparency, regulatory compliance, contractual protections, and operational incident response. Use it before signing any AI vendor contract, and revisit it annually or when the vendor architecture changes.
            </p>
          </div>
        </div>
      </Section>

      {/* Industry-Tiered Approach */}
      <Section className="pt-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Not Every Check Applies to Every Business</h2>
          <p className="text-sm text-muted-foreground">The full 60-item checklist is the maximum bar for enterprises handling sensitive data at scale. Smaller organizations or lower-risk use cases should scope down — but document what they skipped and why.</p>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-l-4 border-l-red-500/40">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4 text-red-600" />
                  Tier 1: Full checklist (60 items)
                </CardTitle>
                <CardDescription className="text-sm mt-1 space-y-1.5">
                  <span className="block"><strong className="text-foreground">Who:</strong> Healthcare (PHI), financial services (financial data), HR/hiring (PII + biometric), legal (privileged data), enterprises (1,000+ users), public companies, regulated industries, EU operations.</span>
                  <span className="block"><strong className="text-foreground">When:</strong> Vendor processes sensitive data, has action/admin tool access, or is used in regulated decisions (hiring, lending, clinical, legal).</span>
                  <span className="block"><strong className="text-foreground">All 60 items apply.</strong> No exemptions. Require SOC 2 Type II, DPA, right to audit, breach notification, and full contractual protections.</span>
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-amber-500/40">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4 text-amber-600" />
                  Tier 2: Core checklist (~35 items)
                </CardTitle>
                <CardDescription className="text-sm mt-1 space-y-1.5">
                  <span className="block"><strong className="text-foreground">Who:</strong> Mid-size companies (50–500 employees) handling internal business data (not PHI/financial/biometric), SaaS AI tools for internal productivity, non-regulated use cases.</span>
                  <span className="block"><strong className="text-foreground">Skip:</strong> CMEK, on-premise deployment, sub-processor geographic restrictions (unless EU customers), disaster recovery plan review, dedicated CISO liaison, tabletop exercise requirements.</span>
                  <span className="block"><strong className="text-foreground">Must keep:</strong> Data handling, DPA, encryption, SOC 2 (or equivalent), breach notification, API key rotation, audit logs, data deletion on termination, no-training-on-data clause.</span>
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-green-500/40">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  Tier 3: Essential checklist (~15 items)
                </CardTitle>
                <CardDescription className="text-sm mt-1 space-y-1.5">
                  <span className="block"><strong className="text-foreground">Who:</strong> Small businesses (&lt;50 employees) using AI for internal productivity with no sensitive data, no regulated decisions, no external customer data exposure.</span>
                  <span className="block"><strong className="text-foreground">Skip:</strong> SOC 2 (accept SOC 2 Type I or security questionnaire), penetration test, CMEK, on-premise, RBAC requirements (if single-tenant), sub-processor review, insurance verification, right to audit.</span>
                  <span className="block"><strong className="text-foreground">Must keep:</strong> Data ownership, no-training-on-data opt-out, breach notification, basic encryption, data deletion on termination, API key rotation. Document why other items were skipped.</span>
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
          <div className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/20 p-4">
            <p className="text-sm text-amber-900 dark:text-amber-200">
              <AlertTriangle className="h-4 w-4 inline mr-1" />
              <strong>Important:</strong> Tier 3 does NOT apply if you handle PHI, financial records, biometric data, hiring decisions, or operate in the EU. A small business handling PHI still needs the full Tier 1 checklist — the data sensitivity determines the tier, not just the company size.
            </p>
          </div>
        </div>
      </Section>

      {/* Alternatives for New Vendors */}
      <Section className="pt-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">When the Vendor Is New or Unproven</h2>
          <p className="text-sm text-muted-foreground">Startups and early-stage AI vendors may not have SOC 2, penetration tests, or a compliance track record. If the business value justifies the risk, use these alternative verification and protection mechanisms.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-l-4 border-l-primary/40">
              <CardHeader>
                <CardTitle className="text-sm">Cyber liability insurance with AI coverage</CardTitle>
                <CardDescription className="text-sm mt-1">Require the vendor to carry cyber liability insurance that explicitly covers AI-related harm (hallucination, bias, data leakage). Minimum coverage should match your liability cap. Request a certificate of insurance with your company named as an additional insured. If the vendor cannot obtain AI-specific coverage, require a general cyber policy with a stated AI endorsement or exclusion review.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-primary/40">
              <CardHeader>
                <CardTitle className="text-sm">Source code or data escrow</CardTitle>
                <CardDescription className="text-sm mt-1">Require the vendor to deposit source code, model weights, or critical configuration in an escrow account with a third-party escrow agent. If the vendor goes out of business, is acquired, or fails to meet SLAs, you gain access to the escrowed materials. This is especially important for AI vendors where model continuity matters — if the vendor disappears, you need the ability to continue operations or migrate.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-primary/40">
              <CardHeader>
                <CardTitle className="text-sm">Milestone-based contracting</CardTitle>
                <CardDescription className="text-sm mt-1">Instead of a multi-year contract, structure the agreement in 90-day or 6-month milestones with renewal gates. Each gate requires the vendor to demonstrate progress on security certifications, complete a security questionnaire, and provide evidence of controls. This limits exposure while the vendor matures their security program. Include a termination-for-convenience clause for the first 12 months.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-primary/40">
              <CardHeader>
                <CardTitle className="text-sm">Performance bond or letter of credit</CardTitle>
                <CardDescription className="text-sm mt-1">For high-value contracts, require a performance bond or irrevocable letter of credit from a reputable financial institution. This ensures funds are available to cover damages if the vendor breaches contract or causes AI-related harm. The bond amount should cover your estimated maximum loss from a worst-case AI incident (data breach, regulatory fine, litigation cost).</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-primary/40">
              <CardHeader>
                <CardTitle className="text-sm">Third-party security attestation</CardTitle>
                <CardDescription className="text-sm mt-1">If SOC 2 is not yet available, require a completed CAIQ (Consensus Assessments Initiative Questionnaire), a SIG (Standardized Information Gathering) questionnaire, or a letter of attestation from a reputable security firm. These are lighter than SOC 2 but demonstrate security awareness. Set a contractual deadline for SOC 2 Type II (typically 12–18 months) with termination rights if not achieved.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-primary/40">
              <CardHeader>
                <CardTitle className="text-sm">Data residency and processing guarantees</CardTitle>
                <CardDescription className="text-sm mt-1">For new vendors, require contractual guarantees on data residency (specific regions), processing location, and sub-processor disclosure. Include audit rights for data handling practices — even if full SOC 2 is not yet available, the vendor should allow you to verify how your data is stored, processed, and deleted. Require a data flow diagram and a signed DPA before any data is shared.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-primary/40">
              <CardHeader>
                <CardTitle className="text-sm">Indemnification for AI-specific harm</CardTitle>
                <CardDescription className="text-sm mt-1">Standard indemnification clauses often do not cover AI-specific harm. Add explicit indemnification for: hallucination-related damages, algorithmic bias or discrimination claims, unauthorized data training on your data, and regulatory fines caused by the vendor's AI system. Cap the indemnification at a meaningful amount (not just the contract value) and ensure it survives contract termination.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-primary/40">
              <CardHeader>
                <CardTitle className="text-sm">Reference customers and pilot testing</CardTitle>
                <CardDescription className="text-sm mt-1">Require the vendor to provide 2–3 reference customers you can contact. Ask specifically about security incidents, data handling, and whether the vendor met its contractual commitments. Conduct a limited-scope pilot (30–60 days) with non-sensitive data before full deployment. Document pilot results and require remediation of any identified issues before production rollout.</CardDescription>
              </CardHeader>
            </Card>
          </div>
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">When to walk away from a new vendor:</strong> If they refuse to sign a DPA, will not provide any security documentation, cannot name a single reference customer, have no plan for SOC 2 or equivalent, and resist milestone-based contracting — the risk is not manageable. No AI tool is worth an unmanageable security and compliance exposure.
            </p>
          </div>
        </div>
      </Section>

      {/* Red Flags */}
      <Section className="pt-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Red Flags That Should Stop Procurement</h2>
          <p className="text-sm text-muted-foreground">If a vendor exhibits any of these, pause and escalate to security leadership before proceeding.</p>
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-6 space-y-3">
            {[
              'Cannot or will not sign a Data Processing Agreement (DPA) — walk away',
              'Uses your data to train their models and cannot opt out — this is a data leakage and IP risk',
              'No SOC 2 Type II or equivalent certification, and no plans to obtain one',
              'Cannot provide model cards, capability documentation, or limitation disclosures',
              'No documented incident response process — if they cannot handle their own incidents, they cannot protect your data',
              'Refuses right-to-audit or limits it to self-assessment only',
              'Liability caps that do not cover AI-specific harm (hallucination, bias, data leakage)',
              'No breach notification timeline commitment, or timeline exceeds your regulatory requirements',
              'Sub-processors are not disclosed or cannot be reviewed before contract signing',
              'No API key rotation or scoped permissions — this indicates an immature security program',
            ].map((flag) => (
              <div key={flag} className="flex items-start gap-3">
                <XCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground/90">{flag}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Continuous Monitoring */}
      <Section className="pt-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Continuous Vendor Monitoring — After the Contract Is Signed</h2>
          <p className="text-sm text-muted-foreground">Due diligence does not end at contract signing. AI vendors change models, add sub-processors, and evolve their architecture continuously. Set up these monitoring practices to catch issues before they become incidents.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-l-4 border-l-primary/40">
              <CardHeader>
                <CardTitle className="text-sm">Annual re-evaluation</CardTitle>
                <CardDescription className="text-sm mt-1">Re-run the full checklist at least once per year. Schedule it on contract anniversary. Include updated SOC 2 reports, new penetration test results, and any architecture changes. Document the re-evaluation results and compare against the prior year — track regressions.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-primary/40">
              <CardHeader>
                <CardTitle className="text-sm">Sub-processor change monitoring</CardTitle>
                <CardDescription className="text-sm mt-1">Subscribe to the vendor&apos;s sub-processor notification list. When a new sub-processor is added, review their security posture and data access scope. If the sub-processor is an AI model provider, evaluate them as you would any AI vendor. Contractually require 30 days notice before new sub-processors are activated.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-primary/40">
              <CardHeader>
                <CardTitle className="text-sm">Vendor incident notification</CardTitle>
                <CardDescription className="text-sm mt-1">Contractually require the vendor to notify you within 24 hours of any security incident that could affect your data. Include AI-specific incidents: model poisoning, training data leakage, prompt injection vulnerabilities discovered in their platform, and bias audit failures. Require a post-incident report within 14 days.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-primary/40">
              <CardHeader>
                <CardTitle className="text-sm">Model change impact assessment</CardTitle>
                <CardDescription className="text-sm mt-1">When the vendor announces a model update or architecture change, assess the impact on your use case before the update is applied. Require a 30-day notice period for model changes. Test your prompts and workflows against the new model in a staging environment. If the vendor cannot provide a staging environment, require version pinning for your contract.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-primary/40">
              <CardHeader>
                <CardTitle className="text-sm">SLA compliance tracking</CardTitle>
                <CardDescription className="text-sm mt-1">Track the vendor&apos;s uptime, latency, and support response times against the contracted SLAs. Log every deviation. If SLA breaches accumulate, invoke service credits or termination clauses. For AI-specific SLAs (model availability, token throughput, response quality), track separately from infrastructure SLAs.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-primary/40">
              <CardHeader>
                <CardTitle className="text-sm">Bias audit and compliance renewal</CardTitle>
                <CardDescription className="text-sm mt-1">For vendors used in hiring, lending, or other regulated decisions, track bias audit expiration dates. Require the vendor to provide updated audit results before the current audit expires. If the vendor&apos;s audit lapses, suspend use of the tool until a new audit is completed — continuing to use an unaudited tool is a regulatory violation.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </Section>

      {/* Scoring Guidance */}
      <Section className="pt-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Scoring Guidance</h2>
          <p className="text-sm text-muted-foreground">Assign each item a score to compare vendors objectively.</p>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-l-4 border-l-green-500/40">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Meets (2 points)
                </CardTitle>
                <CardDescription className="text-sm mt-1">The vendor fully satisfies the requirement with documented evidence (certification, policy, contract clause, or technical demonstration).</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-amber-500/40">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  Partially meets (1 point)
                </CardTitle>
                <CardDescription className="text-sm mt-1">The vendor has a plan or partial implementation. Document the gap, the vendor commitment, and the target date. Re-evaluate before renewal.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-red-500/40">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  Does not meet (0 points)
                </CardTitle>
                <CardDescription className="text-sm mt-1">The vendor cannot or will not satisfy the requirement. Any 0-score item in Data Handling, Security Posture, or Contractual Protections should escalate to security leadership.</CardDescription>
              </CardHeader>
            </Card>
          </div>
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Interpreting the total:</strong> 100–110 = low risk, proceed with standard contracting. 80–99 = moderate risk, require remediation plan before signing. 60–79 = high risk, require senior leadership approval and contractual commitments with deadlines. Below 60 = unacceptable risk — do not proceed without compensating controls or a different vendor.
            </p>
          </div>
        </div>
      </Section>

      <Section className="pt-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {checklistSections.map((section) => (
            <Card key={section.title} className="border-l-4 border-l-primary/40">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <div className="px-6 pb-6">
                <ul className="space-y-2">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground/90">
                      <span className="flex-shrink-0 w-5 h-5 rounded border-2 border-border mt-0.5 flex items-center justify-center">
                        <CheckCircle2 className="h-3 w-3 text-transparent" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="pt-8">
        <div className="max-w-4xl mx-auto">
          <LeadMagnetCard
            title="Download the AI Vendor Due-Diligence Checklist"
            description="Get the complete checklist as a structured spreadsheet with scoring, risk weighting, and vendor comparison columns — ready for your procurement process."
            resourceName="AI Vendor Due-Diligence Checklist"
          />
        </div>
      </Section>

      {/* FAQ */}
      <Section className="pt-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-xl font-bold tracking-tight mb-4">FAQ</h2>
          {[
            {
              q: 'When should I re-evaluate an existing AI vendor?',
              a: 'Re-evaluate annually at minimum. Additionally, re-evaluate when: the vendor is acquired or changes ownership, the vendor announces a new model or architecture change, your data scope expands (e.g., you start sending PHI when you previously only sent public data), a security incident occurs at the vendor, your regulatory obligations change, or the vendor sub-processor list changes without notification.',
            },
            {
              q: 'What if the vendor is a startup without SOC 2 yet?',
              a: 'Startups may not have SOC 2 Type II yet, but they should have a clear timeline and evidence of progress. Require: a signed security plan with target dates, a completed security questionnaire (e.g., CAIQ), penetration test results, and contractual commitments for certification within 12 months. Weigh the risk against the business value — a startup handling PHI without SOC 2 is a different risk profile than one handling public data.',
            },
            {
              q: 'Should I require the vendor to support on-premise deployment?',
              a: 'For highly sensitive data (PHI, biometric, financial records, source code), on-premise or customer-managed cloud deployment significantly reduces data exposure. If the vendor cannot support this, require: DLP scanning on outbound prompts, a DPA with strict no-training-on-data clauses, customer-managed encryption keys (CMEK), and a documented data deletion process with verification.',
            },
            {
              q: 'How do I evaluate a vendor that uses third-party models (e.g., OpenAI, Anthropic)?',
              a: 'The vendor should disclose which third-party models they use and provide the model provider security documentation. You need to evaluate both the vendor (your direct contractor) and the model provider (a sub-processor). Ensure the vendor DPA covers sub-processor obligations, and that data flow to the model provider is documented. If the vendor cannot disclose the model provider, that is a red flag.',
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
            <Link href="/ai-risk-register" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-sm">AI Risk Register</CardTitle>
                  </div>
                  <CardDescription className="text-sm">Structured template for tracking AI system risks, controls, and remediation status.</CardDescription>
                  <span className="text-sm text-primary inline-flex items-center gap-1 mt-2">Open template <ArrowRight className="h-3 w-3" /></span>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/ai-incident-evidence-checklist" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-sm">Incident Evidence Checklist</CardTitle>
                  </div>
                  <CardDescription className="text-sm">Four-phase checklist for preserving evidence after an AI security incident.</CardDescription>
                  <span className="text-sm text-primary inline-flex items-center gap-1 mt-2">Open checklist <ArrowRight className="h-3 w-3" /></span>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/architecture-decision-master-sheet" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Layers className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-sm">Architecture Decision Master Sheet</CardTitle>
                  </div>
                  <CardDescription className="text-sm">Interactive 25-layer architecture decision sheet with AI development risks and CSM pillar mapping.</CardDescription>
                  <span className="text-sm text-primary inline-flex items-center gap-1 mt-2">Open sheet <ArrowRight className="h-3 w-3" /></span>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </Section>

      <CTA
        title="Need Help Evaluating an AI Vendor?"
        description="Get a professional AI vendor security assessment — from Subodh KC, co-founder of the HAIEC AI security and compliance engine."
        primaryButton={{ text: 'Book a Consultation', href: '/contact' }}
        secondaryButton={{ text: 'Explore HAIEC Platform', href: '/solutions/haiec' }}
      />
    </>
  )
}
