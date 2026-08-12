import Link from 'next/link'
import Hero from '@/components/Hero'
import Section from '@/components/Section'
import { Button } from '@/components/ui/button'
import ProductsGrid from './products-grid'

import { 
  Printer, 
  Scale, 
  Clock, 
  EyeOff, 
  Activity,
  ArrowRight,
  Shield,
  Zap,
  Lock,
  FileText
} from 'lucide-react'

export const metadata = {
  title: 'Privacy-First AI Tools & Products | Subodh KC',
  description:
    'Open-source and free AI tools: LLM output monitoring, PDF redaction, print queue manager, document timeline generator, log analyzer, and legal case management. 100% local processing.',
  alternates: {
    canonical: 'https://subodhkc.com/products',
  },
  openGraph: {
    title: 'Privacy-First AI Tools & Products | Subodh KC',
    description:
      'Open-source and free AI tools with 100% local processing. No cloud uploads. No tracking.',
    url: 'https://subodhkc.com/products',
    type: 'website',
  },
  keywords: [
    'AI tools',
    'privacy-first tools',
    'open source AI',
    'LLM monitoring',
    'PDF redaction',
    'print queue',
    'document timeline',
    'log analyzer',
    'legal case management',
    'local processing',
    'Subodh KC products',
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://subodhkc.com/products' },
  ],
}

const products = [
  {
    name: 'llmverify',
    href: '/products/llmverify',
    description: 'Open-source LLM output monitoring, risk scoring, and classification for Node.js. Local-first guardrails that work without sending data to third parties.',
    icon: Shield,
    badge: 'Open Source',
    badgeColor: 'bg-blue-500/10 text-blue-500',
    features: ['Prompt injection detection', 'PII redaction', 'Hallucination scoring', 'Zero telemetry'],
    cta: 'View Package'
  },
  {
    name: 'AI Article Generator',
    href: '/products/ai-article-generator',
    description: 'Automated AI content engine that fetches news from authoritative sources, categorizes with OpenAI GPT-4o, and publishes MDX articles to your site. Open source, GitHub Actions ready.',
    icon: FileText,
    badge: 'Open Source',
    badgeColor: 'bg-blue-500/10 text-blue-500',
    features: ['RSS to MDX', 'GPT-4o powered', 'GitHub Actions', 'Config-driven'],
    cta: 'View on GitHub'
  },
  {
    name: 'Print Later',
    href: '/products/print-later',
    description: 'Save web pages now, print them later. A free, open-source Windows app that lets you build a print queue and print when you\'re ready.',
    icon: Printer,
    badge: 'Free',
    badgeColor: 'bg-green-500/10 text-green-500',
    features: ['One-click save', 'Print queue', 'Browser extension', '100% local'],
    cta: 'Get Free Download'
  },
  {
    name: 'PDF Redactor',
    href: '/products/pdf-redactor',
    description: 'AI-powered sensitive data removal. Automatically detect and permanently redact SSNs, credit cards, names, and 50+ PII types from your PDFs.',
    icon: EyeOff,
    badge: 'Free',
    badgeColor: 'bg-green-500/10 text-green-500',
    features: ['AI detection', 'Permanent redaction', 'Batch processing', 'Local processing'],
    cta: 'Get Free Download'
  },
  {
    name: 'Doc Timeline Generator',
    href: '/products/doc-timeline',
    description: 'Transform thousands of documents into clear, chronological timelines. AI-powered extraction for legal discovery, insurance claims, and compliance audits.',
    icon: Clock,
    badge: 'Enterprise',
    badgeColor: 'bg-blue-500/10 text-blue-500',
    features: ['AI extraction', 'Cross-document analysis', 'Gap detection', 'SOC 2 compliant'],
    cta: 'Request Pricing'
  },
  {
    name: 'SKC Log Analyser',
    href: '/products/skc-log-analyser',
    description: 'Find the needle in a billion haystacks. AI-powered log analysis that turns terabytes of data into actionable insights.',
    icon: Activity,
    badge: 'Early Access',
    badgeColor: 'bg-purple-500/10 text-purple-500',
    features: ['Pattern detection', 'Real-time alerts', 'Root cause analysis', 'On-premise'],
    cta: 'Join Early Access'
  },
  {
    name: 'CourtCase',
    href: '/products/courtcase',
    description: 'Organize your legal documents with ease. Manage case files, track deadlines, and prepare document packets - all locally on your computer.',
    icon: Scale,
    badge: 'Coming Soon',
    badgeColor: 'bg-amber-500/10 text-amber-500',
    features: ['Case organization', 'Deadline tracking', 'Document packets', '100% local'],
    cta: 'Join Waitlist'
  }
]

export default function ProductsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Hero
        subtitle="Privacy-First Tools"
        title={
          <>
            Tools That Respect
            <br />
            <span className="gradient-text">Your Data</span>
          </>
        }
        description="Every product we build follows the same principle: your data stays on your computer. No cloud uploads. No tracking. No compromises."
      />

      <Section
        subtitle="Principles"
        title="Built Different"
      >
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-green-500" />
            <span>100% Local Processing</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-500" />
            <span>No Cloud Uploads</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-green-500" />
            <span>Open Source Available</span>
          </div>
        </div>
      </Section>

      <Section
        subtitle="Products"
        title="All Tools"
        id="products-grid"
      >
        <div className="max-w-6xl mx-auto">
          <ProductsGrid products={products} />
        </div>
      </Section>

      <Section
        subtitle="Ideas"
        title="Have a Product Idea?"
        className="bg-secondary/20"
      >
        <div className="max-w-md mx-auto text-center">
          <p className="text-muted-foreground mb-6">
            We&apos;re always looking for new tools to build. If you have an idea for a privacy-first 
            productivity tool, we&apos;d love to hear it.
          </p>
          <Link href="/contact">
            <Button variant="outline" className="gap-2">
              Get in Touch
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Section>
    </>
  )
}
