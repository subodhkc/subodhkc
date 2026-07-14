import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import Grid from '@/components/Grid'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Shield,
  Building2,
  Scale,
  ArrowRight,
  Globe,
  Calendar,
  Gavel,
  CheckCircle2,
} from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'AI Compliance Laws Guide | Subodh KC',
  description:
    'Comprehensive guides to AI compliance laws — EU AI Act, NYC Local Law 144, and Texas TRAIGA (HB 149). Compare applicability, requirements, penalties, and defense pathways. By Subodh KC, co-founder of HAIEC.',
  alternates: {
    canonical: 'https://subodhkc.com/guides',
  },
  openGraph: {
    title: 'AI Compliance Laws Guide | Subodh KC',
    description:
      'Comprehensive guides to EU AI Act, NYC Local Law 144, and Texas TRAIGA. Compare applicability, requirements, penalties, and defense pathways.',
    url: 'https://subodhkc.com/guides',
    type: 'website',
  },
  keywords: [
    'AI compliance laws',
    'AI regulations guide',
    'AI laws 2026',
    'AI compliance checklist',
    'AI governance regulations',
    'EU AI Act guide',
    'NYC Local Law 144 guide',
    'Texas AI law guide',
    'TRAIGA guide',
    'AI compliance comparison',
    'Subodh KC AI compliance',
  ],
}

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Texas AI Law (TRAIGA / HB 149) Compliance Guide',
      url: 'https://subodhkc.com/guides/texas-ai-law',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'EU AI Act Compliance & Readiness Guide',
      url: 'https://subodhkc.com/guides/eu-ai-act',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'NYC Local Law 144 Compliance Guide',
      url: 'https://subodhkc.com/guides/nyc-local-law-144',
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://subodhkc.com/guides' },
  ],
}

const guides = [
  {
    icon: Scale,
    href: '/guides/texas-ai-law',
    title: 'Texas AI Law (TRAIGA / HB 149)',
    description:
      'Texas Responsible AI Governance Act. Effective January 1, 2026. Covers applicability tests, prohibited practices, disclosure duties, penalties ($10K-$200K), 60-day cure period, NIST AI RMF defense pathway, and regulatory sandbox.',
    badge: 'Effective Jan 2026',
    badgeColor: 'text-amber-600',
  },
  {
    icon: Shield,
    href: '/guides/eu-ai-act',
    title: 'EU AI Act',
    description:
      'World\'s first comprehensive AI regulation. Risk-tiered framework for all AI on the EU market. Full enforcement August 2026. Penalties up to €35M or 7% of global revenue. Mapped to the ISAF framework published in Zenodo.',
    badge: 'Full enforcement Aug 2026',
    badgeColor: 'text-amber-600',
  },
  {
    icon: Building2,
    href: '/guides/nyc-local-law-144',
    title: 'NYC Local Law 144',
    description:
      'Bias audit requirements for automated employment decision tools (AEDTs). Active enforcement since July 2023. Annual independent bias audits, 10-day candidate notice, $500-$1,500/day penalties. Informed by deterministic bias detection research.',
    badge: 'Active enforcement',
    badgeColor: 'text-red-600',
  },
]

export default function GuidesIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Hero
        subtitle="Compliance Guides"
        title={
          <>
            AI Compliance
            <br />
            <span className="gradient-text">Laws Guide</span>
          </>
        }
        description="Three AI laws are reshaping how companies build and deploy AI. Here's what each one requires — and which ones apply to you."
      />

      {/* ─── Guide Cards ─── */}
      <Section
        subtitle="Start Here"
        title="Choose Your Compliance Guide"
        id="guides"
      >
        <div className="max-w-5xl mx-auto">
          <Grid cols={3} gap="md">
            {guides.map((guide, i) => {
              const Icon = guide.icon
              return (
                <Link key={i} href={guide.href} className="block">
                  <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <span className={`text-xs font-medium ${guide.badgeColor} mb-2 block`}>
                        {guide.badge}
                      </span>
                      <CardTitle className="text-lg mb-2">{guide.title}</CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        {guide.description}
                      </CardDescription>
                      <span className="text-sm text-primary inline-flex items-center gap-1 mt-3">
                        Read guide <ArrowRight className="h-3 w-3" />
                      </span>
                    </CardHeader>
                  </Card>
                </Link>
              )
            })}
          </Grid>
        </div>
      </Section>

      {/* ─── Cross-Law Comparison ─── */}
      <Section
        subtitle="At a Glance"
        title="Cross-Law Comparison"
        description="Quick reference comparing the three major AI compliance regulations. Use this to determine which laws apply to your organization."
        id="comparison"
        className="bg-secondary/20"
      >
        <div className="max-w-5xl mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-primary/20">
                  <th className="text-left py-3 px-4 font-semibold">Feature</th>
                  <th className="text-left py-3 px-4 font-semibold">EU AI Act</th>
                  <th className="text-left py-3 px-4 font-semibold">NYC LL144</th>
                  <th className="text-left py-3 px-4 font-semibold">Texas TRAIGA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-3 px-4 font-medium">Effective Date</td>
                  <td className="py-3 px-4">Aug 2, 2026 (full)</td>
                  <td className="py-3 px-4">Jul 5, 2023</td>
                  <td className="py-3 px-4">Jan 1, 2026</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Scope</td>
                  <td className="py-3 px-4">All AI on EU market</td>
                  <td className="py-3 px-4">AI in NYC hiring</td>
                  <td className="py-3 px-4">All AI systems in Texas</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Risk Approach</td>
                  <td className="py-3 px-4">Tiered (4 levels)</td>
                  <td className="py-3 px-4">Single category (AEDTs)</td>
                  <td className="py-3 px-4">Prohibited practices list</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Key Prohibitions</td>
                  <td className="py-3 px-4">Social scoring, biometric ID, manipulation</td>
                  <td className="py-3 px-4">Using AEDT without bias audit</td>
                  <td className="py-3 px-4">Manipulation, social scoring (gov), discrimination, deepfakes</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Max Penalty</td>
                  <td className="py-3 px-4 font-medium text-red-600">€35M or 7% revenue</td>
                  <td className="py-3 px-4 font-medium text-amber-600">$1,500/day</td>
                  <td className="py-3 px-4 font-medium text-red-600">$200,000/violation</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Enforcement</td>
                  <td className="py-3 px-4">National AI authorities + EU AI Office</td>
                  <td className="py-3 px-4">NYC DCWP</td>
                  <td className="py-3 px-4">Texas Attorney General</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Cure Period</td>
                  <td className="py-3 px-4 text-red-500">No</td>
                  <td className="py-3 px-4 text-red-500">No</td>
                  <td className="py-3 px-4 text-green-600">Yes — 60 days</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">NIST AI RMF</td>
                  <td className="py-3 px-4 text-muted-foreground">Not required</td>
                  <td className="py-3 px-4 text-muted-foreground">Not required</td>
                  <td className="py-3 px-4 text-green-600">Defense pathway</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Disclosure Duty</td>
                  <td className="py-3 px-4">Transparency for limited-risk AI</td>
                  <td className="py-3 px-4">Candidate notice 10 days before</td>
                  <td className="py-3 px-4">Gov/healthcare AI disclosure</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Sandbox</td>
                  <td className="py-3 px-4 text-green-600">Yes (Art. 57)</td>
                  <td className="py-3 px-4 text-red-500">No</td>
                  <td className="py-3 px-4 text-green-600">Yes (Ch. 553, 36 months)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Private Right of Action</td>
                  <td className="py-3 px-4 text-red-500">No</td>
                  <td className="py-3 px-4 text-red-500">No</td>
                  <td className="py-3 px-4 text-red-500">No</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* ─── Which Laws Apply ─── */}
      <Section
        subtitle="Decision Framework"
        title="Which AI Laws Apply to You?"
        description="A quick decision framework to determine which regulations may apply to your organization."
        id="which-laws-apply"
      >
        <div className="max-w-3xl space-y-4">
          <div className="space-y-3">
            {[
              {
                law: 'EU AI Act',
                applies: 'You place AI systems on the EU market, or your AI output is used in the EU — regardless of where your company is headquartered.',
                icon: Globe,
              },
              {
                law: 'NYC Local Law 144',
                applies: 'You use an automated employment decision tool (AEDT) for hiring or promotion decisions for positions located in New York City.',
                icon: Building2,
              },
              {
                law: 'Texas TRAIGA',
                applies: 'You develop, deploy, or offer AI systems with a Texas nexus — you conduct business in TX, produce products used by TX residents, or develop/deploy AI in TX.',
                icon: Scale,
              },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="flex items-start gap-3 p-4 rounded-lg border border-border">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm mb-1">{item.law}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.applies}</p>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-900">
                <strong>Multiple laws can apply simultaneously.</strong> A company using AI for hiring in
                NYC while also serving EU customers and operating in Texas could be subject to all three
                regulations. Each law has independent applicability criteria.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── Authority ─── */}
      <Section
        subtitle="Why Trust These Guides"
        title="Built on Real Compliance Engineering"
        description="These guides are informed by the HAIEC compliance platform and Zenodo-published research — not just legal analysis."
        id="authority"
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
                  <CardTitle className="text-base">HAIEC TRAIGA Engine</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  Subodh KC co-founded HAIEC and built the TRAIGA compliance engine — a 9-section
                  deterministic assessment wizard covering Chapters 551-554 of the Texas Business and
                  Commerce Code.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">ISAF Framework</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  The Instruction Stack Audit Framework, published in Zenodo, maps to EU AI Act Article 9
                  requirements across nine abstraction layers — providing practical implementation guidance.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">Deterministic Bias Detection</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  Zenodo-published research on deterministic bias detection for NYC LL144 addresses the
                  reproducibility requirements that auditors need for defensible audit evidence.
                </CardDescription>
              </CardHeader>
            </Card>
          </Grid>
          <div className="mt-6 text-center">
            <Link href="/research" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
              Explore all research publications <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </Section>

      {/* ─── CTA ─── */}
      <CTA
        title="Not Sure Which Laws Apply to You?"
        description="Get a comprehensive AI compliance applicability assessment from Subodh KC. Identify which regulations apply to your organization, what your obligations are, and build a compliance roadmap."
        primaryButton={{ text: 'Contact Subodh KC', href: '/contact' }}
        secondaryButton={{ text: 'View Advisory Services', href: '/advisory' }}
      />

      <div className="page-padding pb-8">
        <div className="section-container max-w-3xl">
          <p className="text-xs text-muted-foreground">
            These guides are for informational purposes and do not constitute legal advice. For
            jurisdiction-specific compliance guidance, contact Subodh KC for advisory services. Last
            updated: July 2026.
          </p>
        </div>
      </div>
    </>
  )
}
