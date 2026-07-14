import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import Grid from '@/components/Grid'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LeadMagnetCard } from '@/components/LeadMagnetCard'
import {
  Scale,
  Shield,
  AlertTriangle,
  Building2,
  HeartPulse,
  Fingerprint,
  Gavel,
  CheckCircle2,
  FileText,
  FlaskConical,
  Landmark,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Texas AI Law (TRAIGA / HB 149) Compliance Guide | Subodh KC',
  description:
    'Complete guide to the Texas Responsible AI Governance Act (TRAIGA, HB 149). Effective January 1, 2026. Applicability tests, prohibited practices, disclosure duties, penalties, defense pathways, and compliance checklist by Subodh KC — co-founder of HAIEC.',
  alternates: {
    canonical: 'https://subodhkc.com/guides/texas-ai-law',
  },
  openGraph: {
    title: 'Texas AI Law (TRAIGA / HB 149) Compliance Guide | Subodh KC',
    description:
      'Complete guide to the Texas Responsible AI Governance Act. Effective January 1, 2026. Applicability, prohibited practices, penalties, defense pathways, and compliance checklist.',
    url: 'https://subodhkc.com/guides/texas-ai-law',
    type: 'article',
    authors: ['Subodh KC'],
    publishedTime: '2026-07-14',
    modifiedTime: '2026-07-14',
  },
  keywords: [
    'Texas AI law',
    'TRAIGA',
    'HB 149',
    'Texas AI governance act',
    'Texas AI law compliance',
    'Texas AI law effective date',
    'Texas AI law penalties',
    'Texas AI sandbox',
    'Dallas AI compliance',
    'Texas AI law small business',
    'Texas Responsible AI Governance Act',
    'Texas Attorney General AI',
    'NIST AI RMF Texas',
    'Subodh KC AI compliance',
  ],
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Texas AI Law (TRAIGA / HB 149) Compliance Guide',
  description:
    'Complete guide to the Texas Responsible AI Governance Act (TRAIGA, HB 149). Applicability tests, prohibited practices, disclosure duties, penalties, defense pathways, and compliance checklist.',
  author: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com/person/subodh-kc' },
  publisher: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
  datePublished: '2026-07-14',
  dateModified: '2026-07-14',
  url: 'https://subodhkc.com/guides/texas-ai-law',
  keywords: ['Texas AI law', 'TRAIGA', 'HB 149', 'AI compliance', 'AI governance'],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://subodhkc.com/guides' },
    { '@type': 'ListItem', position: 3, name: 'Texas AI Law', item: 'https://subodhkc.com/guides/texas-ai-law' },
  ],
}

const faqs = [
  {
    q: 'What is the Texas AI law?',
    a: 'The Texas Responsible AI Governance Act (TRAIGA), enacted as House Bill 149, is a comprehensive state law regulating the development and deployment of artificial intelligence systems in Texas. It covers Chapters 551-554 of the Texas Business and Commerce Code and takes effect on January 1, 2026.',
  },
  {
    q: 'When does the Texas AI law take effect?',
    a: 'TRAIGA takes effect on January 1, 2026. Organizations developing, deploying, or offering AI systems with a Texas nexus should begin compliance preparations now, given the complexity of applicability assessments and documentation requirements.',
  },
  {
    q: 'Who enforces the Texas AI law?',
    a: 'The Texas Attorney General has exclusive enforcement authority over Chapter 552 violations. The AG can issue civil investigative demands, complaints, and pursue civil penalties. There is no private right of action under TRAIGA.',
  },
  {
    q: 'What are the penalties under the Texas AI law?',
    a: 'Curable violations carry civil penalties of $10,000 to $12,000 per violation. Uncurable violations of prohibited AI practices carry penalties of $80,000 to $200,000 per violation. The AG may not collect civil penalties for AI systems that have not been deployed.',
  },
  {
    q: 'Does the Texas AI law apply to my company?',
    a: 'TRAIGA applies if you have a "Texas nexus" — meaning any one of these is true: (1) you do business in Texas, (2) you produce a product or service used by Texas residents, or (3) you develop or deploy AI in Texas. Any one of these is enough. If you\'re not sure, an applicability assessment is worth doing before the January 2026 deadline.',
  },
  {
    q: 'Is there a cure period under the Texas AI law?',
    a: 'Yes. After receiving written notice from the AG, you have 60 days to cure the violation. If cured within 60 days with the required written statement and supporting documentation, no action is taken. This is more lenient than the EU AI Act, which has no cure period.',
  },
  {
    q: 'Can NIST AI RMF compliance help under the Texas AI law?',
    a: 'Yes. If you follow the NIST AI RMF or NIST Generative AI Profile in good faith, it can serve as a defense if you\'re ever investigated. It\'s not a safe harbor or certification — but it shows you took reasonable steps. The key: your internal review process must be the one that actually caught the issue.',
  },
  {
    q: 'Does the Texas AI law have a regulatory sandbox?',
    a: 'Yes. Chapter 553 establishes a regulatory sandbox program allowing participants to test AI systems for up to 36 months under an application-based approval. Sandbox participants remain subject to non-waivable Chapter 552 Subchapter B prohibitions.',
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

export default function TexasAILawPage() {
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
            Texas AI Law
            <br />
            <span className="gradient-text">TRAIGA (HB 149)</span>
          </>
        }
        description="Texas is the first US state with a comprehensive AI law. TRAIGA takes effect January 1, 2026 — here's what your business needs to do."
      />

      {/* ─── What is TRAIGA ─── */}
      <Section
        subtitle="Overview"
        title="What is the Texas Responsible AI Governance Act?"
        id="what-is-traiga"
      >
        <div className="max-w-3xl space-y-4">
          <p className="text-lg text-muted-foreground leading-relaxed">
            The Texas Responsible AI Governance Act (TRAIGA), enacted as <strong>House Bill 149</strong>,
            is a comprehensive state law regulating the development and deployment of artificial intelligence
            systems in Texas. It spans <strong>Chapters 551-554</strong> of the Texas Business and Commerce
            Code, with cross-references to the Texas Data Privacy and Security Act (TDPSA), the Capture or
            Use of Biometric Identifier Act (CUBI), and the Texas Government Code.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            TRAIGA establishes applicability criteria, defines prohibited AI practices, creates disclosure
            duties for governmental agencies and healthcare providers, sets enforcement authority with the
            Texas Attorney General, provides a 60-day cure period, and creates a regulatory sandbox program
            under Chapter 553.
          </p>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-medium text-primary mb-1">Key Facts</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><strong>Effective date:</strong> January 1, 2026</li>
              <li><strong>Enforcement:</strong> Texas Attorney General (exclusive)</li>
              <li><strong>Penalties:</strong> $10K-$12K curable, $80K-$200K uncurable</li>
              <li><strong>Cure period:</strong> 60 days after AG notice</li>
              <li><strong>Sandbox:</strong> Up to 36 months (Chapter 553)</li>
              <li><strong>Private right of action:</strong> None</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* ─── Does TRAIGA Apply to You ─── */}
      <Section
        subtitle="Applicability"
        title="Does TRAIGA apply to you?"
        description="TRAIGA applies if your AI system meets the statutory definition and you have a Texas nexus. Three independent nexus tests — any one is sufficient."
        id="applicability"
        className="bg-secondary/20"
      >
        <div className="max-w-4xl mx-auto">
          <Grid cols={3} gap="md">
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">Nexus Test 1</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  You promote, advertise, or conduct business in Texas.
                </CardDescription>
                <p className="text-xs text-muted-foreground mt-1">Tex. Bus. &amp; Com. Code § 551.002</p>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">Nexus Test 2</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  You produce a product or service used by Texas residents.
                </CardDescription>
                <p className="text-xs text-muted-foreground mt-1">Tex. Bus. &amp; Com. Code § 551.002</p>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Scale className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">Nexus Test 3</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  You develop or deploy an AI system in Texas.
                </CardDescription>
                <p className="text-xs text-muted-foreground mt-1">Tex. Bus. &amp; Com. Code § 551.002</p>
              </CardHeader>
            </Card>
          </Grid>

          <div className="mt-8 rounded-lg border border-amber-300 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900">
                <p className="font-semibold mb-1">AI System Definition (§ 551.001)</p>
                <p>
                  TRAIGA defines an AI system as a machine-based system that, for explicit or implicit
                  objectives, infers from the inputs it receives how to generate outputs that can influence
                  physical or virtual environments. If your system does not meet this definition, TRAIGA may
                  not apply.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Roles Under TRAIGA</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Multiple roles may apply simultaneously. TRAIGA does not force a single role classification.
            </p>
            <Grid cols={2} gap="md">
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span><strong>Developer</strong> — develops AI offered, sold, leased, or provided in Texas</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span><strong>Deployer</strong> — deploys AI for use in Texas</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span><strong>Governmental entity</strong> — state or political subdivision (excludes hospital districts and higher education)</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span><strong>Healthcare provider</strong> — licensed, registered, or certified individual</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span><strong>Controller</strong> — under TDPSA (Chapter 541)</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span><strong>Processor</strong> — under TDPSA (Chapter 541)</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span><strong>State agency</strong> — subject to AI inventory and reporting</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span><strong>Sandbox applicant</strong> — Chapter 553 participant</span>
                </div>
              </div>
            </Grid>
          </div>
        </div>
      </Section>

      {/* ─── Prohibited Practices ─── */}
      <Section
        subtitle="Chapter 552, Subchapter B"
        title="Prohibited AI Practices"
        description="TRAIGA prohibits specific AI practices. Each prohibition is tested independently using its exact statutory elements. Intent is central — disparate impact alone is insufficient."
        id="prohibited-practices"
      >
        <div className="max-w-4xl mx-auto space-y-4">
          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <CardTitle className="text-base mb-1">Harmful Manipulation</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    Prohibits developing or deploying AI with intent to incite or encourage self-harm,
                    harm to another, or criminal activity. The intent element is central — disparate
                    impact alone is insufficient.
                  </CardDescription>
                  <p className="text-xs text-muted-foreground mt-1">Tex. Bus. &amp; Com. Code § 552.052</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <CardTitle className="text-base mb-1">Social Scoring (Government Only)</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    Prohibits governmental entities from developing or deploying AI to evaluate or classify
                    natural persons based on social behavior or personal characteristics, with intent to
                    assign a social score causing detrimental treatment or rights infringement. Does not
                    apply to non-governmental actors.
                  </CardDescription>
                  <p className="text-xs text-muted-foreground mt-1">Tex. Bus. &amp; Com. Code § 552.053</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <CardTitle className="text-base mb-1">Constitutional Rights Impairment</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    Prohibits developing or deploying AI with the sole intent to impair, infringe, or
                    violate a constitutional right. The sole intent element is critical — if the system
                    has other primary purposes, this prohibition may not apply.
                  </CardDescription>
                  <p className="text-xs text-muted-foreground mt-1">Tex. Bus. &amp; Com. Code § 552.055</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <CardTitle className="text-base mb-1">Unlawful Discrimination</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    Prohibits developing or deploying AI with intent to unlawfully discriminate against
                    a protected class. Disparate impact alone does not satisfy the intent element, though
                    other civil-rights laws may still apply. Narrow exceptions exist for regulated insurance
                    entities (§ 552.056(d)) and federally insured financial institutions (§ 552.056(e)).
                  </CardDescription>
                  <p className="text-xs text-muted-foreground mt-1">Tex. Bus. &amp; Com. Code § 552.056</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <CardTitle className="text-base mb-1">Sexual Content and Deepfakes</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    Prohibits specified intentional development or distribution of AI for unlawful sexual
                    visual material, deepfake sexual content, or sexual text interaction imitating a child.
                    Incorporates Texas Penal Code offenses and definitions.
                  </CardDescription>
                  <p className="text-xs text-muted-foreground mt-1">Tex. Bus. &amp; Com. Code § 552.057</p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </Section>

      {/* ─── Disclosure Duties ─── */}
      <Section
        subtitle="Section 552.051"
        title="Disclosure Duties"
        description="TRAIGA creates mandatory disclosure obligations for governmental agencies and healthcare providers using AI systems."
        id="disclosure-duties"
        className="bg-secondary/20"
      >
        <div className="max-w-4xl mx-auto">
          <Grid cols={2} gap="md">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Landmark className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">Governmental Agencies</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed space-y-2">
                  <p>
                    When a governmental agency offers an AI system intended to interact with consumers,
                    disclosure is required <strong>before or at the time of interaction</strong>.
                  </p>
                  <p>The disclosure must be:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Clear and conspicuous</li>
                    <li>In plain language</li>
                    <li>Free of dark patterns or manipulative design</li>
                  </ul>
                  <p>If a hyperlink is used, it must satisfy the clear and conspicuous standard.</p>
                </CardDescription>
                <p className="text-xs text-muted-foreground mt-1">Tex. Bus. &amp; Com. Code § 552.051(b)-(e)</p>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <HeartPulse className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">Healthcare Providers</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed space-y-2">
                  <p>
                    When a licensed, registered, or certified healthcare provider uses AI in relation to
                    a service or treatment, disclosure is required by the <strong>first date of service</strong>.
                  </p>
                  <p>
                    In an emergency, disclosure must be provided as soon as reasonably possible — not
                    necessarily by the first date of service.
                  </p>
                  <p>The provider must document the disclosure date and recipient.</p>
                </CardDescription>
                <p className="text-xs text-muted-foreground mt-1">Tex. Bus. &amp; Com. Code § 552.051(f)</p>
              </CardHeader>
            </Card>
          </Grid>
        </div>
      </Section>

      {/* ─── Biometrics ─── */}
      <Section
        subtitle="Cross-Law Routing"
        title="Biometric Data and CUBI"
        description="If your AI system captures, stores, processes, or possesses biometric identifiers, TRAIGA creates a cross-law routing to the Capture or Use of Biometric Identifier Act (CUBI)."
        id="biometrics"
      >
        <div className="max-w-3xl space-y-4">
          <p className="text-lg text-muted-foreground leading-relaxed">
            A CUBI violation under Section 503.001 is also a Section 552.054 violation under TRAIGA.
            The statutory definitions differ:
          </p>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3">
            <div>
              <p className="text-sm font-medium text-primary">CUBI (§ 503.001) — narrower</p>
              <p className="text-sm text-muted-foreground">
                Retina/iris scan, fingerprint, voiceprint, hand/face geometry record. Notice and consent
                required before commercial capture. Destruction within one year of purpose expiration.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-primary">TRAIGA (§ 552.054) — broader</p>
              <p className="text-sm text-muted-foreground">
                Broader biometric data definition for government biometric provisions. A CUBI violation
                automatically triggers a § 552.054 violation.
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
            <p className="text-sm text-amber-900">
              <strong>AI training exemption caveat:</strong> The CUBI AI-training exemption is lost when
              the AI is used or deployed to uniquely identify a specific individual. A later commercial
              use of previously non-commercial biometric data may reactivate CUBI duties.
            </p>
          </div>
        </div>
      </Section>

      {/* ─── Enforcement & Penalties ─── */}
      <Section
        subtitle="Enforcement"
        title="Penalties and Enforcement"
        description="The Texas Attorney General has exclusive enforcement authority. There is no private right of action under TRAIGA."
        id="enforcement"
        className="bg-secondary/20"
      >
        <div className="max-w-4xl mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-primary/20">
                  <th className="text-left py-3 px-4 font-semibold">Violation Type</th>
                  <th className="text-left py-3 px-4 font-semibold">Penalty Range</th>
                  <th className="text-left py-3 px-4 font-semibold">Cure Available</th>
                  <th className="text-left py-3 px-4 font-semibold">Citation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-3 px-4">Curable violations</td>
                  <td className="py-3 px-4 font-medium text-amber-600">$10,000 - $12,000 per violation</td>
                  <td className="py-3 px-4">Yes — 60 days</td>
                  <td className="py-3 px-4 text-muted-foreground">§ 552.105</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Uncurable violations (prohibited practices)</td>
                  <td className="py-3 px-4 font-medium text-red-600">$80,000 - $200,000 per violation</td>
                  <td className="py-3 px-4">No</td>
                  <td className="py-3 px-4 text-muted-foreground">§ 552.105</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Undeployed systems</td>
                  <td className="py-3 px-4 text-muted-foreground">No penalty collection</td>
                  <td className="py-3 px-4">N/A</td>
                  <td className="py-3 px-4 text-muted-foreground">§ 552.105(f)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <Gavel className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold mb-1">Enforcement Process</p>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>AG receives complaint or identifies potential violation</li>
                  <li>AG issues civil investigative demand (CID) or complaint</li>
                  <li>60-day cure period begins (for curable violations)</li>
                  <li>If cured: no action with required written statement and documentation</li>
                  <li>If not cured: AG pursues civil penalty</li>
                </ol>
                <p className="mt-2 text-muted-foreground">
                  The AG may request detailed system documentation including purpose, intended use,
                  deployment context, data types, metrics, limitations, monitoring, and safeguards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── Defense Pathway ─── */}
      <Section
        subtitle="Defense Strategy"
        title="NIST AI RMF Defense Pathway"
        description="TRAIGA uniquely provides a defense pathway for organizations that adopt the NIST AI RMF or NIST Generative AI Profile."
        id="defense-pathway"
      >
        <div className="max-w-3xl space-y-4">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Under <strong>Section 552.105(e)(2)(D)</strong>, substantial compliance with the current NIST
            Generative AI Profile or another recognized framework can support the internal-review discovery
            pathway. This is a <strong>defense candidate</strong>, not a certification or safe harbor.
          </p>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-medium text-primary mb-2">How the defense pathway works:</p>
            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2">
              <li>Adopt NIST AI RMF or NIST GenAI Profile and version-pin the framework</li>
              <li>Conduct a qualifying internal review using the framework</li>
              <li>The internal review discovers an issue through feedback, red teaming, agency guidance, or qualifying internal review</li>
              <li>Preserve the internal review documentation that discovered the issue</li>
              <li>If all conditions are met, the defendant may avoid liability</li>
            </ol>
          </div>
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
            <p className="text-sm text-amber-900">
              <strong>Important:</strong> NIST mapping produces a DEFENSE_CANDIDATE, not certification or
              safe-harbor approval. The internal review that actually discovered the issue must be preserved.
              Third-party misuse may also support a defense under listed conditions.
            </p>
          </div>
        </div>
      </Section>

      {/* ─── Sandbox ─── */}
      <Section
        subtitle="Chapter 553"
        title="Regulatory Sandbox"
        description="TRAIGA creates a regulatory sandbox program allowing participants to test AI systems under application-based approval."
        id="sandbox"
        className="bg-secondary/20"
      >
        <div className="max-w-3xl space-y-4">
          <p className="text-lg text-muted-foreground leading-relaxed">
            The Chapter 553 sandbox program allows participants to test AI systems for up to
            <strong> 36 months</strong> under an application-based approval. Sandbox participants remain
            subject to non-waivable Chapter 552 Subchapter B prohibitions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm font-medium mb-1">What the sandbox provides</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Testing window up to 36 months</li>
                <li>Application-based approval</li>
                <li>Quarterly reporting requirements</li>
                <li>Waiver of certain provisions</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm font-medium mb-1">What the sandbox does NOT waive</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Prohibited practices (§ 552.052-.057)</li>
                <li>Disclosure duties (§ 552.051)</li>
                <li>Biometric restrictions (§ 552.054)</li>
                <li>AG enforcement authority</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── Companion Laws ─── */}
      <Section
        subtitle="Related Texas Legislation"
        title="Companion Texas AI Laws"
        description="TRAIGA is part of a broader Texas AI legislative framework. These companion laws may apply alongside TRAIGA."
        id="companion-laws"
      >
        <div className="max-w-4xl mx-auto">
          <Grid cols={2} gap="md">
            <Card>
              <CardHeader>
                <CardTitle className="text-base mb-2">SB 1964 — Government AI Use</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  Amends the Texas Government Code Chapter 2054. Creates code of ethics compliance,
                  minimum standards, impact assessment, and vendor obligations for government AI use.
                </CardDescription>
                <p className="text-xs text-muted-foreground mt-1">Tex. Gov. Code Ch. 2054</p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base mb-2">SB 1188 — Healthcare AI</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  Amends the Texas Health and Safety Code Chapter 183. Creates EHR location,
                  safeguards, AI review, and diagnostic disclosure duties for healthcare AI use.
                </CardDescription>
                <p className="text-xs text-muted-foreground mt-1">Tex. Health &amp; Safety Code Ch. 183</p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base mb-2">State Agency AI Inventory</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  State agencies must maintain AI inventory, conduct considered-use evaluations,
                  operational reviews, and Sunset review evidence. Conditional funding provisions apply.
                </CardDescription>
                <p className="text-xs text-muted-foreground mt-1">Tex. Gov. Code §§ 325.011, 2054.068, 2054.0965</p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base mb-2">TDPSA (Chapter 541)</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  TRAIGA amends TDPSA processor assistance where AI collects, stores, or processes
                  personal data. Controller/processor applicability must be run separately under TDPSA.
                </CardDescription>
                <p className="text-xs text-muted-foreground mt-1">Tex. Bus. &amp; Com. Code § 541.104</p>
              </CardHeader>
            </Card>
          </Grid>
        </div>
      </Section>

      {/* ─── Compliance Checklist ─── */}
      <Section
        subtitle="Action Items"
        title="Texas AI Law Compliance Checklist"
        description="A practical checklist for preparing for TRAIGA compliance before the January 1, 2026 effective date."
        id="compliance-checklist"
        className="bg-secondary/20"
      >
        <div className="max-w-3xl mx-auto">
          <div className="space-y-3">
            {[
              { phase: 'Assess', items: [
                'Determine whether your system meets the § 551.001 AI system definition',
                'Evaluate Texas nexus under all three § 551.002 tests',
                'Classify all applicable roles (developer, deployer, governmental entity, healthcare provider, controller/processor)',
                'Screen for Chapter 552 Subchapter B prohibited practices',
              ]},
              { phase: 'Document', items: [
                'Maintain deployment records capable of generating AG evidence fields (purpose, intended use, deployment context, data types, metrics, limitations, monitoring, safeguards)',
                'Document AI system version and objective inference mechanism',
                'Record evidence quality (direct, asserted, inferred, unknown, fact conflict)',
                'Preserve all internal review documentation',
              ]},
              { phase: 'Implement', items: [
                'Adopt NIST AI RMF or NIST GenAI Profile and version-pin the framework',
                'Implement disclosure mechanisms for governmental and healthcare AI use',
                'Run CUBI biometric analysis if system captures biometric identifiers',
                'Evaluate TDPSA controller/processor obligations if processing personal data',
              ]},
              { phase: 'Monitor', items: [
                'Conduct qualifying internal reviews using the adopted framework',
                'Establish feedback and red team channels for issue discovery',
                'Track AG guidance and enforcement actions',
                'Prepare 60-day cure response process and documentation templates',
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
        title="Get the Texas AI Law Compliance Checklist"
        id="lead-magnet"
      >
        <div className="max-w-xl mx-auto">
          <LeadMagnetCard
            title="Free Texas AI Law Compliance Checklist"
            description="A practical, printable checklist covering TRAIGA applicability tests, prohibited practices, disclosure duties, defense pathways, and companion laws — based on the HAIEC TRAIGA compliance engine."
            resourceName="Texas AI Law Compliance Checklist"
          />
        </div>
      </Section>

      {/* ─── How Subodh KC Can Help ─── */}
      <Section
        subtitle="Expertise"
        title="How Subodh KC Can Help"
        description="I co-founded HAIEC and built the TRAIGA compliance engine — a 9-section deterministic assessment wizard covering Chapters 551-554 of the Texas Business and Commerce Code."
        id="expertise"
        className="bg-secondary/20"
      >
        <div className="max-w-4xl mx-auto">
          <Grid cols={3} gap="md">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Scale className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">TRAIGA Assessment</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  Walk through the 9-section applicability assessment covering nexus, roles, prohibited
                  practices, disclosure duties, biometrics, enforcement, and defense posture.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FlaskConical className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">NIST AI RMF Implementation</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  Implement the NIST AI RMF or GenAI Profile to establish the § 552.105(e)(2)(D) defense
                  pathway. Version-pin your framework and preserve internal review documentation.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">Evidence Architecture</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  Build audit-grade evidence generation pipelines that produce AG-ready documentation
                  covering purpose, intended use, deployment context, data types, and monitoring.
                </CardDescription>
              </CardHeader>
            </Card>
          </Grid>

          <div className="mt-6 text-sm text-muted-foreground text-center">
            <p>
              Based in Dallas, Texas. <Link href="/contact" className="text-primary hover:underline">Contact Subodh KC</Link> for
              TRAIGA compliance advisory, or explore <Link href="/advisory" className="text-primary hover:underline">advisory services</Link>.
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
            <Link href="/guides/eu-ai-act" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">EU AI Act Guide</CardTitle>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">
                    Risk-tiered regulation for all AI placed on the EU market. Effective August 2026.
                    Penalties up to €35M or 7% of global revenue.
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
        title="Prepare for TRAIGA Compliance"
        description="The January 1, 2026 deadline is approaching. Get a TRAIGA applicability assessment or compliance roadmap from Subodh KC — co-founder of the HAIEC TRAIGA compliance engine."
        primaryButton={{ text: 'Contact Subodh KC', href: '/contact' }}
        secondaryButton={{ text: 'View Advisory Services', href: '/advisory' }}
      />

      <div className="page-padding pb-8">
        <div className="section-container max-w-3xl">
          <p className="text-xs text-muted-foreground">
            This guide is for informational purposes and does not constitute legal advice. For
            jurisdiction-specific compliance guidance, contact Subodh KC for advisory services. Last
            updated: July 2026. Legal version: TRAIGA-HAIEC-v3.0-ERRATA-1.
          </p>
        </div>
      </div>
    </>
  )
}
