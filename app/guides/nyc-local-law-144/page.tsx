import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import Grid from '@/components/Grid'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LeadMagnetCard } from '@/components/LeadMagnetCard'
import {
  Building2,
  Shield,
  AlertTriangle,
  Users,
  CheckCircle2,
  FileText,
  FlaskConical,
  ArrowRight,
  Calendar,
} from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'NYC Local Law 144 Compliance Guide | Subodh KC',
  description:
    'Complete guide to NYC Local Law 144 — bias audit requirements for automated employment decision tools (AEDTs). Who must comply, audit requirements, candidate notice, penalties, and compliance checklist. By Subodh KC.',
  alternates: {
    canonical: 'https://subodhkc.com/guides/nyc-local-law-144',
  },
  openGraph: {
    title: 'NYC Local Law 144 Compliance Guide | Subodh KC',
    description:
      'Complete guide to NYC Local Law 144. Bias audit requirements, candidate notice, penalties, and compliance checklist for automated employment decision tools.',
    url: 'https://subodhkc.com/guides/nyc-local-law-144',
    type: 'article',
    authors: ['Subodh KC'],
    publishedTime: '2026-07-14',
    modifiedTime: '2026-07-14',
  },
  keywords: [
    'NYC Local Law 144',
    'NYC LL144',
    'NYC LL144 compliance',
    'AEDT bias audit',
    'NYC AI hiring law',
    'NYC LL144 penalties',
    'NYC LL144 candidate notice',
    'NYC LL144 independent audit',
    'automated employment decision tool',
    'AI bias audit NYC',
    'NYC Department of Consumer and Worker Protection',
    'Subodh KC AI compliance',
  ],
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'NYC Local Law 144 Compliance Guide',
  description:
    'Complete guide to NYC Local Law 144 — bias audit requirements for automated employment decision tools (AEDTs). Who must comply, audit requirements, candidate notice, penalties, and compliance checklist.',
  author: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com/person/subodh-kc' },
  publisher: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
  datePublished: '2026-07-14',
  dateModified: '2026-07-14',
  url: 'https://subodhkc.com/guides/nyc-local-law-144',
  keywords: ['NYC Local Law 144', 'AEDT', 'bias audit', 'AI hiring', 'AI compliance'],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://subodhkc.com/guides' },
    { '@type': 'ListItem', position: 3, name: 'NYC Local Law 144', item: 'https://subodhkc.com/guides/nyc-local-law-144' },
  ],
}

const faqs = [
  {
    q: 'What is NYC Local Law 144?',
    a: 'NYC Local Law 144, enforced by the NYC Department of Consumer and Worker Protection (DCWP), regulates the use of automated employment decision tools (AEDTs) in hiring and promotion decisions. It requires annual independent bias audits, candidate notification at least 10 business days before use, and public disclosure of audit results. Enforcement began July 5, 2023.',
  },
  {
    q: 'Who needs to comply with NYC Local Law 144?',
    a: 'The law applies to any employer or employment agency that uses an automated employment decision tool to substantially assist in hiring or promotion decisions for candidates applying for positions located in New York City. This includes companies headquartered outside NYC that use AEDTs for NYC-based roles.',
  },
  {
    q: 'What are the NYC LL144 penalties?',
    a: 'Violations carry civil penalties of $500 for the first violation and $1,500 for each subsequent violation, per day of non-compliance. There is no cap on total penalties. The DCWP can also seek injunctive relief to stop the use of non-compliant AEDTs.',
  },
  {
    q: 'What is an AEDT under NYC Local Law 144?',
    a: 'An Automated Employment Decision Tool (AEDT) is any computational process derived from machine learning, artificial intelligence, or other statistical modeling that generates a simplified output (score, classification, or recommendation) used to substantially assist in hiring or promotion decisions. The law applies when the tool substantially assists — meaning it is a principal factor in the decision.',
  },
  {
    q: 'What does a NYC LL144 bias audit require?',
    a: 'An independent bias audit must be conducted annually by an impartial third-party auditor. The audit must assess the tool\'s impact on protected categories (sex, race/ethnicity) using selection rates and impact ratios. Results must be publicly available on the employer\'s website. The audit must include information about the tool\'s distribution and the number of individuals assessed.',
  },
  {
    q: 'When must candidates be notified under NYC LL144?',
    a: 'Candidates must be notified at least 10 business days before the AEDT is used. Notification must include: (1) that an AEDT will be used, (2) the job categories for which it will be used, and (3) instructions for requesting an alternative selection process or reasonable accommodation. Notification can be via the employer\'s website, in the job posting, or via US mail.',
  },
  {
    q: 'Does NYC LL144 have a cure period?',
    a: 'No. NYC Local Law 144 does not provide a cure period. Non-compliance can result in immediate penalties. The DCWP has been actively enforcing the law since July 5, 2023, and has already issued violations to companies for non-compliance.',
  },
  {
    q: 'How does deterministic bias detection help with NYC LL144?',
    a: 'Bias audits must produce the same results every time they\'re run — otherwise the audit evidence is weak. Deterministic methods (fixed calculations, no randomness) guarantee identical results on repeated runs. Probabilistic or AI-generated assessments may give different answers each time, which undermines audit defensibility. Subodh KC\'s Zenodo publication addresses this directly.',
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

export default function NYCLL144Page() {
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
            NYC Local Law 144
            <br />
            <span className="gradient-text">AEDT Bias Audit Guide</span>
          </>
        }
        description="NYC requires bias audits for AI hiring tools — and enforcement is already happening. Here's what you need to do to comply."
      />

      {/* ─── What is NYC LL144 ─── */}
      <Section
        subtitle="Overview"
        title="What is NYC Local Law 144?"
        id="what-is-nyc-ll144"
      >
        <div className="max-w-3xl space-y-4">
          <p className="text-lg text-muted-foreground leading-relaxed">
            NYC Local Law 144, enforced by the <strong>NYC Department of Consumer and Worker Protection
            (DCWP)</strong>, regulates the use of automated employment decision tools (AEDTs) in hiring
            and promotion decisions. It was the first US municipal law to require independent bias audits
            for AI-powered hiring tools.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            The law requires <strong>annual independent bias audits</strong>, <strong>candidate
            notification</strong> at least 10 business days before AEDT use, and <strong>public
            disclosure</strong> of audit results. Enforcement began on <strong>July 5, 2023</strong>, and
            the DCWP has been actively issuing violations.
          </p>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-medium text-primary mb-1">Key Facts</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><strong>Enforcement:</strong> NYC Department of Consumer and Worker Protection (DCWP)</li>
              <li><strong>Effective date:</strong> July 5, 2023 (active enforcement)</li>
              <li><strong>Scope:</strong> AEDTs used for NYC-based positions</li>
              <li><strong>Penalties:</strong> $500 first violation, $1,500 subsequent, per day</li>
              <li><strong>Bias audit:</strong> Annual, independent third-party</li>
              <li><strong>Candidate notice:</strong> 10 business days before use</li>
              <li><strong>Cure period:</strong> None</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* ─── Does LL144 Apply to You ─── */}
      <Section
        subtitle="Applicability"
        title="Does NYC LL144 apply to you?"
        description="The law applies if you use an AEDT to substantially assist in hiring or promotion decisions for NYC-based positions."
        id="applicability"
        className="bg-secondary/20"
      >
        <div className="max-w-4xl mx-auto">
          <Grid cols={2} gap="md">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">Employer or Employment Agency</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  Any employer or employment agency that uses an AEDT in hiring or promotion decisions.
                  This includes companies headquartered outside NYC that use AEDTs for NYC-based roles.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">NYC-Based Positions</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  The law applies to candidates applying for positions located in New York City. Remote
                  positions may also be covered if the employer is NYC-based.
                </CardDescription>
              </CardHeader>
            </Card>
          </Grid>

          <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-medium text-primary mb-2">What is an AEDT?</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              An <strong>Automated Employment Decision Tool</strong> is any computational process derived
              from machine learning, artificial intelligence, or other statistical modeling that generates
              a simplified output (score, classification, or recommendation) used to <strong>substantially
              assist</strong> in hiring or promotion decisions. "Substantially assist" means the tool is a
              principal factor in the decision — not merely a minor input.
            </p>
          </div>

          <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-900">
                <strong>Exclusions:</strong> The law does not apply to tools that do not use machine learning,
                AI, or statistical modeling (e.g., keyword search filters that simply match terms). It also
                does not apply to tools used solely for internal employee management without hiring or
                promotion impact.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── Bias Audit Requirements ─── */}
      <Section
        subtitle="Core Requirement"
        title="Bias Audit Requirements"
        description="An independent bias audit must be conducted annually by an impartial third-party auditor. The audit must assess the tool's impact on protected categories."
        id="bias-audit"
      >
        <div className="max-w-3xl space-y-4">
          <div className="space-y-3">
            {[
              { title: 'Independent Auditor', desc: 'The audit must be conducted by an impartial third-party auditor who was not involved in the development of the AEDT. The auditor cannot be employed by the employer or the AEDT vendor.' },
              { title: 'Protected Categories', desc: 'The audit must assess the tool\'s impact on sex and race/ethnicity categories. The auditor must calculate selection rates and impact ratios for each category.' },
              { title: 'Selection Rate', desc: 'The proportion of individuals in a category who are selected, recommended, or classified by the AEDT. Must be calculated for each protected category.' },
              { title: 'Impact Ratio', desc: 'The selection rate for a category divided by the selection rate for the most selected category. An impact ratio below 0.8 (the four-fifths rule) may indicate adverse impact.' },
              { title: 'Distribution Information', desc: 'The audit must include information about the tool\'s distribution — the number of individuals assessed, categorized, or selected by the tool.' },
              { title: 'Public Disclosure', desc: 'Audit results must be publicly available on the employer\'s website. The summary must include the date of the audit, the auditor\'s name, and the results for each category.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── Candidate Notice ─── */}
      <Section
        subtitle="Transparency Requirement"
        title="Candidate Notification Requirements"
        description="Candidates must be notified at least 10 business days before the AEDT is used. Notification must include specific information."
        id="candidate-notice"
        className="bg-secondary/20"
      >
        <div className="max-w-3xl space-y-4">
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="h-5 w-5 text-primary" />
              <p className="font-medium">10 Business Days Before Use</p>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              The notification must include:
            </p>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>That an AEDT will be used to evaluate the candidate</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>The job categories for which the AEDT will be used</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Instructions for requesting an alternative selection process or reasonable accommodation</span>
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm font-medium mb-2">Notification Methods (any one):</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>On the employer&apos;s website (career page or job posting)</li>
              <li>In the job posting itself</li>
              <li>By US mail (if the candidate has provided an address)</li>
              <li>By email (if the candidate has provided an email address)</li>
              <li>In the employment application materials</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* ─── Penalties ─── */}
      <Section
        subtitle="Enforcement"
        title="NYC LL144 Penalties"
        description="The DCWP has been actively enforcing NYC LL144 since July 2023. There is no cure period."
        id="penalties"
      >
        <div className="max-w-4xl mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-primary/20">
                  <th className="text-left py-3 px-4 font-semibold">Violation</th>
                  <th className="text-left py-3 px-4 font-semibold">Penalty</th>
                  <th className="text-left py-3 px-4 font-semibold">Cure Period</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-3 px-4">First violation</td>
                  <td className="py-3 px-4 font-medium text-amber-600">$500 per day</td>
                  <td className="py-3 px-4">None</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Subsequent violations</td>
                  <td className="py-3 px-4 font-medium text-red-600">$1,500 per day</td>
                  <td className="py-3 px-4">None</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Injunctive relief</td>
                  <td className="py-3 px-4 text-muted-foreground">DCWP may seek court order to stop AEDT use</td>
                  <td className="py-3 px-4">N/A</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-900">
                Penalties accrue <strong>per day</strong> of non-compliance, with no cap on total penalties.
                A company using a non-compliant AEDT for 30 days could face $15,000-$45,000 in fines.
                The DCWP has already issued violations to multiple companies.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── Deterministic Bias Detection ─── */}
      <Section
        subtitle="Research Connection"
        title="Deterministic Bias Detection for NYC LL144"
        description="Subodh KC's Zenodo publication addresses the reproducibility requirements that auditors need — why deterministic methods matter more than accuracy for audit defensibility."
        id="deterministic-bias-detection"
        className="bg-secondary/20"
      >
        <div className="max-w-3xl space-y-4">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Bias audits under NYC LL144 must produce <strong>reproducible results</strong>. If an auditor
            runs the same bias assessment twice and gets different results, the audit evidence is
            undermined. Deterministic methods produce identical results on repeated runs — which is
            critical for audit defensibility.
          </p>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-medium text-primary mb-2">Key insight from the paper:</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Probabilistic or AI-generated bias assessments may produce different results on each run
              due to random initialization, sampling, or model stochasticity. This makes them unsuitable
              for regulatory audits where reproducibility is essential. Deterministic bias detection
              methods — using fixed seeds, exact calculations, and transparent logic — produce the same
              output every time, making them defensible in regulatory proceedings.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <FileText className="h-4 w-4 text-primary" />
            <Link href="https://zenodo.org/records/18056133" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Read the deterministic bias detection paper on Zenodo →
            </Link>
          </div>
        </div>
      </Section>

      {/* ─── Compliance Checklist ─── */}
      <Section
        subtitle="Action Items"
        title="NYC LL144 Compliance Checklist"
        description="A practical checklist for achieving and maintaining NYC Local Law 144 compliance."
        id="compliance-checklist"
      >
        <div className="max-w-3xl mx-auto">
          <div className="space-y-3">
            {[
              { phase: 'Identify', items: [
                'Determine whether your hiring/promotion tool qualifies as an AEDT under the law',
                'Identify all NYC-based positions for which the AEDT is used',
                'Confirm whether the AEDT "substantially assists" in hiring or promotion decisions',
              ]},
              { phase: 'Audit', items: [
                'Engage an independent third-party auditor (not involved in AEDT development)',
                'Ensure the audit assesses impact on sex and race/ethnicity categories',
                'Calculate selection rates and impact ratios for each protected category',
                'Include distribution information (number of individuals assessed)',
                'Publish audit results summary on your website',
              ]},
              { phase: 'Notify', items: [
                'Implement candidate notification at least 10 business days before AEDT use',
                'Include all required information (AEDT use, job categories, accommodation instructions)',
                'Choose a notification method (website, job posting, email, or US mail)',
                'Update job postings to include AEDT disclosure',
              ]},
              { phase: 'Maintain', items: [
                'Schedule annual bias audits (not more than 12 months apart)',
                'Update audit results on your website after each annual audit',
                'Track DCWP enforcement actions and guidance updates',
                'Maintain records of candidate notifications and audit results',
                'Review AEDT vendor compliance documentation',
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
        title="Get the NYC LL144 Compliance Checklist"
        id="lead-magnet"
        className="bg-secondary/20"
      >
        <div className="max-w-xl mx-auto">
          <LeadMagnetCard
            title="Free NYC LL144 Compliance Checklist"
            description="A practical, printable checklist covering AEDT identification, bias audit requirements, candidate notification, and ongoing compliance maintenance — informed by deterministic bias detection research published in Zenodo."
            resourceName="NYC LL144 Compliance Checklist"
          />
        </div>
      </Section>

      {/* ─── How Subodh KC Can Help ─── */}
      <Section
        subtitle="Expertise"
        title="How Subodh KC Can Help"
        description="My Zenodo publication on deterministic bias detection for NYC Local Law 144 addresses the reproducibility requirements that auditors need."
        id="expertise"
      >
        <div className="max-w-4xl mx-auto">
          <Grid cols={3} gap="md">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">AEDT Assessment</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  Determine whether your hiring tool qualifies as an AEDT and whether it "substantially
                  assists" in decisions — the threshold for LL144 applicability.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FlaskConical className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">Bias Audit Preparation</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  Implement deterministic bias detection methods that produce reproducible results —
                  essential for audit defensibility and regulatory proceedings.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">Compliance Documentation</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  Build evidence architecture for audit results, candidate notification records, and
                  ongoing compliance documentation that satisfies DCWP requirements.
                </CardDescription>
              </CardHeader>
            </Card>
          </Grid>
          <div className="mt-6 text-sm text-muted-foreground text-center">
            <p>
              <Link href="/contact" className="text-primary hover:underline">Contact Subodh KC</Link> for
              NYC LL144 compliance advisory, or explore <Link href="/advisory" className="text-primary hover:underline">advisory services</Link>.
            </p>
          </div>
        </div>
      </Section>

      {/* ─── Related Guides ─── */}
      <Section
        subtitle="Related Guides"
        title="Other AI Compliance Guides"
        id="related-guides"
        className="bg-secondary/20"
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
            <Link href="/guides/eu-ai-act" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
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
          </Grid>
        </div>
      </Section>

      {/* ─── FAQ ─── */}
      <Section
        subtitle="FAQ"
        title="Frequently Asked Questions"
        id="faq"
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
        title="Achieve NYC LL144 Compliance"
        description="Enforcement is already underway. Get an AEDT assessment or bias audit preparation consultation from Subodh KC — author of the Zenodo publication on deterministic bias detection for NYC LL144."
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
