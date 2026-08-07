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
  CheckCircle2,
  FileText,
  Search,
  Lock,
  ClipboardList,
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

const lawGuides = [
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

const technicalGuides = [
  {
    icon: Lock,
    href: '/how-to-secure-and-govern-ai',
    title: 'How to Secure and Govern AI',
    description:
      'Seven-layer compliance stack covering NIST AI RMF, ISO 42001, SOC 2, security testing, and continuous evidence. Includes CSM6 operating framework and HAIEC integration patterns.',
    tag: 'Security & Governance',
  },
  {
    icon: Search,
    href: '/solutions/haiec/exposure-assessment',
    title: 'HAIEC AI Exposure Assessment',
    description:
      'Deterministic security analysis covering prompt injection testing, RAG poisoning detection, tool abuse analysis, and evidence-grade compliance outputs. The assessment engine behind HAIEC.',
    tag: 'HAIEC Platform',
    canonical: 'https://subodhkc.com/solutions/haiec/exposure-assessment',
  },
  {
    icon: FileText,
    href: '/blog/hidden-seo-risk-ai-assisted-frontend-development',
    title: 'The Hidden SEO Risk in AI-Assisted Frontend Development',
    description:
      'Technical position paper on how client-only rendering in AI-assisted Next.js and React apps reduces crawlability, delays Google indexing, and obscures public web content from search engines.',
    tag: 'Technical Whitepaper',
  },
  {
    icon: ClipboardList,
    href: '/ai-security-tools',
    title: 'AI Security Tools & Checklists',
    description:
      'Interactive tools — blast radius calculator, agent read/write/action matrix, prompt-injection scenario library. Plus downloadable risk register, vendor due-diligence checklist, and incident evidence checklist.',
    tag: 'Interactive Tools',
  },
]

const authorityCards = [
  {
    icon: Scale,
    title: 'HAIEC TRAIGA Engine',
    description:
      'Subodh KC co-founded HAIEC and built the TRAIGA compliance engine — a 9-section deterministic assessment wizard covering Chapters 551-554 of the Texas Business and Commerce Code.',
    link: '/solutions/haiec',
    linkText: 'Explore HAIEC',
  },
  {
    icon: Shield,
    title: 'ISAF Framework',
    description:
      'The Instruction Stack Audit Framework, published in Zenodo, maps to EU AI Act Article 9 requirements across nine abstraction layers — providing practical implementation guidance.',
    link: 'https://zenodo.org/records/18080355',
    linkText: 'View paper',
    external: true,
  },
  {
    icon: CheckCircle2,
    title: 'Deterministic Bias Detection',
    description:
      'SSRN-published research on deterministic bias detection for NYC LL144 addresses the reproducibility requirements that auditors need for defensible audit evidence.',
    link: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5968116',
    linkText: 'View paper',
    external: true,
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

      {/* ─── Compliance Law Guides (Sticky Notes) ─── */}
      <Section
        subtitle="Regulatory Compliance"
        title="AI Law Compliance Guides"
        description="Three AI regulations with different scopes, penalties, and timelines. Pick the one that applies to your organization — or compare them all below."
        id="guides"
      >
        <div className="blog-notes-board" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {lawGuides.map((guide, i) => {
            const rotations = [-1.5, 1.2, -0.8]
            const colors = ['blog-note-tinted', 'blog-note-warm', 'blog-note-cool']
            const titleStyles = ['blog-note-title-serif', 'blog-note-title-mono', 'blog-note-title-sans']
            const pinTypes = ['', 'blog-note-taped', '']
            const Icon = guide.icon

            return (
              <Link
                key={i}
                href={guide.href}
                className={`blog-sticky-note ${colors[i]} ${pinTypes[i]}`}
                style={{ transform: `rotate(${rotations[i]}deg)` }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <Icon className="h-5 w-5" style={{ color: 'var(--op-accent)' }} />
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: guide.badgeColor,
                  }}>
                    {guide.badge}
                  </span>
                </div>
                <h3 className={titleStyles[i]} style={{ fontSize: 'clamp(18px, 2.5vw, 24px)' }}>
                  {guide.title}
                </h3>
                <p className="blog-note-excerpt">{guide.description}</p>
                <span className="blog-note-tag">read guide →</span>
              </Link>
            )
          })}
        </div>
      </Section>

      {/* ─── Technical Guides & Tools (Sticky Notes) ─── */}
      <Section
        subtitle="Practical Implementation"
        title="Technical Guides & Security Tools"
        description="Beyond legal compliance — the engineering guides, assessment tools, and frameworks you need to actually implement AI governance in production."
        id="technical-guides"
        className="bg-secondary/20"
      >
        <div className="blog-notes-board" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {technicalGuides.map((guide, i) => {
            const rotations = [-1.2, 0.8, -2.0, 1.5]
            const colors = ['blog-note-stark', 'blog-note-paper', 'blog-note-default', 'blog-note-tinted']
            const titleStyles = ['blog-note-title-sans', 'blog-note-title-serif', 'blog-note-title-mono', 'blog-note-title-italic']
            const pinTypes = ['blog-note-taped', '', 'blog-note-taped', '']
            const Icon = guide.icon

            return (
              <Link
                key={i}
                href={guide.href}
                className={`blog-sticky-note ${colors[i]} ${pinTypes[i]}`}
                style={{ transform: `rotate(${rotations[i]}deg)` }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <Icon className="h-5 w-5" style={{ color: 'var(--op-accent)' }} />
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: 'var(--op-accent)',
                    background: 'rgba(22,208,136,0.1)',
                    padding: '2px 8px',
                    borderRadius: 3,
                  }}>
                    {guide.tag}
                  </span>
                </div>
                <h3 className={titleStyles[i]} style={{ fontSize: 'clamp(16px, 2vw, 20px)' }}>
                  {guide.title}
                </h3>
                <p className="blog-note-excerpt">{guide.description}</p>
                <span className="blog-note-tag">open guide →</span>
              </Link>
            )
          })}
        </div>
      </Section>

      {/* ─── Cross-Law Comparison ─── */}
      <Section
        subtitle="At a Glance"
        title="Cross-Law Comparison"
        description="Quick reference comparing the three major AI compliance regulations. Use this to determine which laws apply to your organization."
        id="comparison"
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
        className="bg-secondary/20"
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
      >
        <div className="max-w-4xl mx-auto">
          <Grid cols={3} gap="md">
            {authorityCards.map((card, i) => {
              const Icon = card.icon
              return (
                <Card key={i} className="hover:border-primary/40 transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-base">{card.title}</CardTitle>
                    </div>
                    <CardDescription className="text-sm leading-relaxed">
                      {card.description}
                    </CardDescription>
                    <Link
                      href={card.link}
                      target={card.external ? '_blank' : undefined}
                      rel={card.external ? 'noopener noreferrer' : undefined}
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1 mt-3"
                    >
                      {card.linkText} <ArrowRight className="h-3 w-3" />
                    </Link>
                  </CardHeader>
                </Card>
              )
            })}
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
