import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LeadMagnetCard } from '@/components/LeadMagnetCard'
import { FileText, Shield, ArrowRight, CheckCircle2 } from 'lucide-react'
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
  keywords: ['AI vendor due diligence', 'AI vendor checklist', 'AI procurement checklist', 'AI vendor security assessment', 'AI vendor evaluation', 'AI vendor compliance'],
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

      <Section className="pt-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold tracking-tight mb-4">Related Resources</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/ai-security-tools" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-sm">AI Security Tools & Calculators</CardTitle>
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
                    <CardTitle className="text-sm">AI Risk Register Template</CardTitle>
                  </div>
                  <CardDescription className="text-sm">Structured template for tracking AI system risks, controls, and remediation status.</CardDescription>
                  <span className="text-sm text-primary inline-flex items-center gap-1 mt-2">Open template <ArrowRight className="h-3 w-3" /></span>
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
