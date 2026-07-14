import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import Grid from '@/components/Grid'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LeadMagnetCard } from '@/components/LeadMagnetCard'
import {
  Shield,
  AlertTriangle,
  Building2,
  Layers,
  CheckCircle2,
  FileText,
  FlaskConical,
  ArrowRight,
  Globe,
} from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'EU AI Act Compliance & Readiness Guide | Subodh KC',
  description:
    'Complete guide to the EU AI Act — risk classification, high-risk AI requirements, conformity assessment, penalties, and compliance checklist. Learn how the Instruction Stack Audit Framework (ISAF) maps to EU AI Act Article 9. By Subodh KC.',
  alternates: {
    canonical: 'https://subodhkc.com/guides/eu-ai-act',
  },
  openGraph: {
    title: 'EU AI Act Compliance & Readiness Guide | Subodh KC',
    description:
      'Complete guide to the EU AI Act. Risk classification, high-risk AI requirements, penalties, compliance checklist, and ISAF framework mapping.',
    url: 'https://subodhkc.com/guides/eu-ai-act',
    type: 'article',
    authors: ['Subodh KC'],
    publishedTime: '2026-07-14',
    modifiedTime: '2026-07-14',
  },
  keywords: [
    'EU AI Act',
    'EU AI Act compliance',
    'EU AI Act readiness',
    'EU AI Act risk classification',
    'EU AI Act high-risk AI',
    'EU AI Act requirements',
    'EU AI Act conformity assessment',
    'EU AI Act penalties',
    'EU AI Act effective date',
    'AI Act Article 9',
    'ISAF framework',
    'AI compliance guide',
    'Subodh KC AI compliance',
  ],
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'EU AI Act Compliance & Readiness Guide',
  description:
    'Complete guide to the EU AI Act — risk classification, high-risk AI requirements, conformity assessment, penalties, and compliance checklist.',
  author: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com/person/subodh-kc' },
  publisher: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
  datePublished: '2026-07-14',
  dateModified: '2026-07-14',
  url: 'https://subodhkc.com/guides/eu-ai-act',
  keywords: ['EU AI Act', 'AI compliance', 'risk classification', 'ISAF', 'AI governance'],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://subodhkc.com/guides' },
    { '@type': 'ListItem', position: 3, name: 'EU AI Act', item: 'https://subodhkc.com/guides/eu-ai-act' },
  ],
}

const faqs = [
  {
    q: 'What is the EU AI Act?',
    a: 'The EU AI Act (Regulation 2024/1689) is the world\'s first comprehensive AI regulation. It establishes a risk-based framework for all AI systems placed on the EU market, regardless of where the provider is located. The Act classifies AI into four risk levels: unacceptable (banned), high-risk (strict requirements), limited-risk (transparency obligations), and minimal-risk (no obligations).',
  },
  {
    q: 'When does the EU AI Act take effect?',
    a: 'The EU AI Act entered into force on August 1, 2024, with phased application. Prohibited practices apply from February 2, 2025. General-purpose AI model obligations apply from August 2, 2025. Full enforcement for high-risk AI systems applies from August 2, 2026. National AI authorities must be designated by August 2, 2025.',
  },
  {
    q: 'Who needs to comply with the EU AI Act?',
    a: 'The EU AI Act applies to any provider placing an AI system on the EU market, regardless of where the provider is established. It also applies to deployers of AI systems in the EU, importers, distributors, and manufacturers. Non-EU companies offering AI to EU users must comply. This is an extraterritorial regulation similar to the GDPR.',
  },
  {
    q: 'What are the EU AI Act penalties?',
    a: 'Penalties for prohibited AI practices: up to €35 million or 7% of global annual turnover, whichever is higher. For non-compliance with high-risk AI obligations: up to €15 million or 3% of global annual turnover. For supplying incorrect information: up to €7.5 million or 1% of global annual turnover. SMEs face proportional penalties.',
  },
  {
    q: 'What are the EU AI Act risk levels?',
    a: 'Four risk levels: (1) Unacceptable — banned entirely (social scoring, real-time biometric ID, manipulation). (2) High-risk — strict requirements including risk management, data governance, human oversight, and conformity assessment. (3) Limited risk — transparency obligations (users must know they interact with AI). (4) Minimal risk — no specific obligations.',
  },
  {
    q: 'Does the EU AI Act have a cure period?',
    a: 'No. Unlike the Texas TRAIGA, the EU AI Act does not provide a cure period. Non-compliance can result in immediate penalties. This makes proactive compliance preparation essential before the August 2026 full enforcement deadline.',
  },
  {
    q: 'How does the ISAF framework map to the EU AI Act?',
    a: 'The Instruction Stack Audit Framework (ISAF), published by Subodh KC in Zenodo, maps directly to EU AI Act Article 9 (Risk Management System) requirements across nine abstraction layers. ISAF provides a practical methodology for tracing AI accountability and generating audit-grade evidence that satisfies the Act\'s technical documentation requirements.',
  },
  {
    q: 'Does the EU AI Act apply to US companies?',
    a: 'Yes. The EU AI Act has extraterritorial scope. Any company placing AI systems on the EU market or whose AI output is used in the EU must comply, regardless of where the company is headquartered. This is similar to how the GDPR applies to US companies handling EU user data.',
  },
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

export default function EUAIActPage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Hero
        subtitle="Compliance Guide"
        title={
          <>
            EU AI Act
            <br />
            <span className="gradient-text">Readiness Guide</span>
          </>
        }
        description="The EU AI Act is the world's first comprehensive AI law. If your AI touches the EU, here's what you must do — explained in plain English."
      />

      {/* ─── What is the EU AI Act ─── */}
      <Section
        subtitle="Overview"
        title="What is the EU AI Act?"
        id="what-is-eu-ai-act"
      >
        <div className="max-w-3xl space-y-4">
          <p className="text-lg text-muted-foreground leading-relaxed">
            The EU AI Act (<strong>Regulation 2024/1689</strong>) is the world's first comprehensive AI
            regulation. It establishes a risk-based framework for all AI systems placed on the EU market,
            regardless of where the provider is located. The Act classifies AI into four risk levels and
            imposes obligations proportional to the risk level.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Like the GDPR, the EU AI Act has <strong>extraterritorial scope</strong> — US companies offering
            AI to EU users must comply. The Act entered into force on August 1, 2024, with phased application
            culminating in full enforcement for high-risk AI systems on <strong>August 2, 2026</strong>.
          </p>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-medium text-primary mb-1">Key Facts</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><strong>Regulation:</strong> EU Regulation 2024/1689</li>
              <li><strong>Entered into force:</strong> August 1, 2024</li>
              <li><strong>Full enforcement:</strong> August 2, 2026</li>
              <li><strong>Scope:</strong> All AI placed on EU market (extraterritorial)</li>
              <li><strong>Max penalty:</strong> €35M or 7% of global annual turnover</li>
              <li><strong>Cure period:</strong> None</li>
              <li><strong>Enforcement:</strong> National AI authorities + EU AI Office</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* ─── Risk Classification ─── */}
      <Section
        subtitle="Risk Framework"
        title="EU AI Act Risk Classification"
        description="The Act classifies AI systems into four risk levels. Your obligations depend on which level your AI system falls into."
        id="risk-classification"
        className="bg-secondary/20"
      >
        <div className="max-w-4xl mx-auto space-y-4">
          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <CardTitle className="text-base mb-1">Unacceptable Risk — Banned</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    AI systems that pose a clear threat to safety, livelihoods, or rights are prohibited.
                    Includes social scoring by public authorities, real-time remote biometric identification
                    in public spaces (with exceptions), AI that manipulates human behavior to circumvent
                    free will, and AI that exploits vulnerabilities of specific groups (children, persons
                    with disabilities).
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <CardTitle className="text-base mb-1">High Risk — Strict Requirements</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    AI systems that could negatively affect safety or fundamental rights. Includes AI used
                    in critical infrastructure, education, employment, essential services, law enforcement,
                    migration, and justice. Subject to the full set of requirements under Article 9-15.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Globe className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <CardTitle className="text-base mb-1">Limited Risk — Transparency Obligations</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    AI systems that interact with humans, generate content, or are used for emotion
                    recognition or biometric categorization must inform users they are interacting with AI.
                    Deepfakes and AI-generated content must be labeled as such.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <CardTitle className="text-base mb-1">Minimal Risk — No Obligations</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    The majority of AI systems (spam filters, inventory optimization, video game AI, etc.)
                    fall into this category. No specific obligations under the Act. Providers may voluntarily
                    adopt codes of conduct.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </Section>

      {/* ─── High-Risk Requirements ─── */}
      <Section
        subtitle="Articles 9-15"
        title="High-Risk AI Requirements"
        description="If your AI system is classified as high-risk, you must comply with the full set of requirements under Articles 9-15 of the EU AI Act."
        id="high-risk-requirements"
      >
        <div className="max-w-4xl mx-auto">
          <Grid cols={2} gap="md">
            {[
              { title: 'Risk Management System', desc: 'Establish, implement, document, and maintain a risk management system throughout the AI system lifecycle.', article: 'Art. 9' },
              { title: 'Data Governance', desc: 'Training, validation, and testing data must be relevant, representative, free of errors, and complete to the extent possible.', article: 'Art. 10' },
              { title: 'Technical Documentation', desc: 'Maintain technical documentation demonstrating conformity with requirements before market placement.', article: 'Art. 11' },
              { title: 'Record-Keeping', desc: 'AI system must automatically record events (logs) during operation to ensure traceability.', article: 'Art. 12' },
              { title: 'Transparency & Instructions', desc: 'Provide clear instructions for use, enabling deployers to interpret system output and use it appropriately.', article: 'Art. 13' },
              { title: 'Human Oversight', desc: 'Design system to allow effective human oversight during operation, including the ability to override or interrupt.', article: 'Art. 14' },
              { title: 'Accuracy, Robustness & Cybersecurity', desc: 'Achieve appropriate levels of accuracy, robustness, and cybersecurity throughout the lifecycle.', article: 'Art. 15' },
              { title: 'Conformity Assessment', desc: 'Understand conformity assessment before market placement. High-risk AI requires either internal control or third-party assessment depending on the system type.', article: 'Art. 43' },
            ].map((req, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-base">{req.title}</CardTitle>
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">{req.article}</span>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">{req.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </Grid>
        </div>
      </Section>

      {/* ─── Penalties ─── */}
      <Section
        subtitle="Enforcement"
        title="EU AI Act Penalties"
        description="The EU AI Act has the most severe penalties of any AI regulation in the world. There is no cure period."
        id="penalties"
        className="bg-secondary/20"
      >
        <div className="max-w-4xl mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-primary/20">
                  <th className="text-left py-3 px-4 font-semibold">Violation Type</th>
                  <th className="text-left py-3 px-4 font-semibold">Max Penalty</th>
                  <th className="text-left py-3 px-4 font-semibold">Cure Period</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-3 px-4">Prohibited AI practices</td>
                  <td className="py-3 px-4 font-medium text-red-600">€35M or 7% of global turnover</td>
                  <td className="py-3 px-4">None</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Non-compliance with high-risk obligations</td>
                  <td className="py-3 px-4 font-medium text-amber-600">€15M or 3% of global turnover</td>
                  <td className="py-3 px-4">None</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Incorrect information to authorities</td>
                  <td className="py-3 px-4 font-medium text-amber-600">€7.5M or 1% of global turnover</td>
                  <td className="py-3 px-4">None</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-900">
                SMEs and startups face proportional penalties, but the regulatory burden of compliance
                documentation is the same regardless of company size. Proactive preparation is essential.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── ISAF Connection ─── */}
      <Section
        subtitle="Practical Implementation"
        title="How ISAF Maps to EU AI Act Requirements"
        description="The Instruction Stack Audit Framework (ISAF), published by Subodh KC in Zenodo, provides a practical methodology for tracing AI accountability across nine abstraction layers — directly mapping to Article 9 risk management requirements."
        id="isaf-mapping"
      >
        <div className="max-w-3xl space-y-4">
          <p className="text-lg text-muted-foreground leading-relaxed">
            The EU AI Act requires a risk management system (Article 9) that identifies, analyzes, and
            mitigates risks throughout the AI system lifecycle. ISAF operationalizes this by providing
            a nine-layer audit framework that traces accountability from the instruction layer (prompts,
            system messages) through the model, data, infrastructure, and governance layers.
          </p>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-medium text-primary mb-2">ISAF to Article 9 mapping:</p>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li><strong>Layer 1-3 (Instruction, Context, Model):</strong> Maps to risk identification and analysis (Art. 9(2)(a)-(b))</li>
              <li><strong>Layer 4-6 (Data, Pipeline, Infrastructure):</strong> Maps to data governance requirements (Art. 10) and technical documentation (Art. 11)</li>
              <li><strong>Layer 7-9 (Monitoring, Governance, Accountability):</strong> Maps to human oversight (Art. 14), accuracy and robustness (Art. 15), and post-market monitoring (Art. 72)</li>
            </ul>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <FileText className="h-4 w-4 text-primary" />
            <Link href="https://zenodo.org/records/18080355" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Read the ISAF paper on Zenodo →
            </Link>
          </div>
        </div>
      </Section>

      {/* ─── Compliance Checklist ─── */}
      <Section
        subtitle="Action Items"
        title="EU AI Act Compliance Checklist"
        description="A practical checklist for preparing for EU AI Act compliance before the August 2026 full enforcement deadline."
        id="compliance-checklist"
        className="bg-secondary/20"
      >
        <div className="max-w-3xl mx-auto">
          <div className="space-y-3">
            {[
              { phase: 'Classify', items: [
                'Determine which risk level your AI system falls into (unacceptable, high, limited, minimal)',
                'If high-risk, identify which Annex III category applies (critical infrastructure, education, employment, essential services, law enforcement, migration, justice)',
                'Determine if your system is a general-purpose AI model with systemic risk',
              ]},
              { phase: 'Implement', items: [
                'Establish a risk management system (Art. 9) covering the entire lifecycle',
                'Implement data governance for training, validation, and testing data (Art. 10)',
                'Maintain technical documentation demonstrating conformity (Art. 11)',
                'Implement automatic logging and record-keeping (Art. 12)',
                'Prepare clear instructions for use for deployers (Art. 13)',
                'Design for effective human oversight (Art. 14)',
                'Achieve appropriate accuracy, robustness, and cybersecurity (Art. 15)',
              ]},
              { phase: 'Assess', items: [
                'Determine conformity assessment pathway (internal control vs. third-party notified body)',
                'If third-party assessment required, engage a notified body early',
                'Prepare EU declaration of conformity and CE marking',
              ]},
              { phase: 'Monitor', items: [
                'Establish post-market monitoring system (Art. 72)',
                'Implement serious incident reporting process (Art. 73)',
                'Designate an EU authorized representative if established outside the EU',
                'Track national AI authority designations and guidance',
              ]},
            ].map((group, gi) => (
              <div key={gi} className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-semibold text-primary mb-3 text-sm uppercase tracking-wide">{group.phase}</h3>
                <div className="space-y-2">
                  {group.items.map((item, ii) => (
                    <div key={ii} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── Lead Magnet ─── */}
      <Section
        subtitle="Free Resource"
        title="Get the EU AI Act Readiness Checklist"
        id="lead-magnet"
      >
        <div className="max-w-xl mx-auto">
          <LeadMagnetCard
            title="Free EU AI Act Readiness Checklist"
            description="A practical, printable checklist covering EU AI Act risk classification, high-risk AI requirements, conformity assessment, and post-market monitoring — informed by the ISAF framework published in Zenodo."
            resourceName="EU AI Act Readiness Checklist"
          />
        </div>
      </Section>

      {/* ─── How Subodh KC Can Help ─── */}
      <Section
        subtitle="Expertise"
        title="How Subodh KC Can Help"
        description="My Instruction Stack Audit Framework (ISAF), published in Zenodo, maps directly to EU AI Act Article 9 requirements across nine abstraction layers."
        id="expertise"
        className="bg-secondary/20"
      >
        <div className="max-w-4xl mx-auto">
          <Grid cols={3} gap="md">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Layers className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">Risk Classification</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  Determine your AI system's risk level under the EU AI Act and identify applicable Annex III
                  categories and obligations.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FlaskConical className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">ISAF Implementation</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  Implement the Instruction Stack Audit Framework to satisfy Article 9 risk management
                  requirements and generate audit-grade technical documentation.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">Conformity Preparation</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  Prepare for conformity assessment — internal control or third-party notified body —
                  with complete technical documentation and EU declaration of conformity.
                </CardDescription>
              </CardHeader>
            </Card>
          </Grid>
          <div className="mt-6 text-sm text-muted-foreground text-center">
            <p>
              <Link href="/contact" className="text-primary hover:underline">Contact Subodh KC</Link> for
              EU AI Act compliance advisory, or explore <Link href="/advisory" className="text-primary hover:underline">advisory services</Link>.
            </p>
          </div>
        </div>
      </Section>

      {/* ─── Related Guides ─── */}
      <Section
        subtitle="Related Guides"
        title="Other AI Compliance Guides"
        id="related-guides"
      >
        <div className="max-w-4xl mx-auto">
          <Grid cols={2} gap="md">
            <Link href="/guides/texas-ai-law" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">Texas AI Law (TRAIGA) Guide</CardTitle>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">
                    Texas Responsible AI Governance Act (HB 149). Effective January 2026.
                    Penalties $10K-$200K. 60-day cure period.
                  </CardDescription>
                  <span className="text-sm text-primary inline-flex items-center gap-1 mt-2">
                    Read guide <ArrowRight className="h-3 w-3" />
                  </span>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/guides/nyc-local-law-144" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">NYC Local Law 144 Guide</CardTitle>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">
                    Bias audit requirements for automated employment decision tools. Active enforcement
                    since July 2023. $500-$1,500/day per violation.
                  </CardDescription>
                  <span className="text-sm text-primary inline-flex items-center gap-1 mt-2">
                    Read guide <ArrowRight className="h-3 w-3" />
                  </span>
                </CardHeader>
              </Card>
            </Link>
          </Grid>
        </div>
      </Section>

      {/* ─── FAQ ─── */}
      <Section
        subtitle="FAQ"
        title="Frequently Asked Questions"
        id="faq"
        className="bg-secondary/20"
      >
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((item, i) => (
            <Card key={i} className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="text-lg mb-2">{item.q}</CardTitle>
                <CardDescription className="text-base leading-relaxed">{item.a}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Section>

      {/* ─── CTA ─── */}
      <CTA
        title="Prepare for EU AI Act Compliance"
        description="Full enforcement begins August 2026. Get an EU AI Act risk assessment or compliance roadmap from Subodh KC — author of the ISAF framework published in Zenodo."
        primaryButton={{ text: 'Contact Subodh KC', href: '/contact' }}
        secondaryButton={{ text: 'View Advisory Services', href: '/advisory' }}
      />

      <div className="page-padding pb-8">
        <div className="section-container max-w-3xl">
          <p className="text-xs text-muted-foreground">
            This guide is for informational purposes and does not constitute legal advice. For
            jurisdiction-specific compliance guidance, contact Subodh KC for advisory services. Last
            updated: July 2026.
          </p>
        </div>
      </div>
    </>
  )
}
