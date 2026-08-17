import Link from 'next/link'
import Hero from '@/components/Hero'
import Section from '@/components/Section'
import { Button } from '@/components/ui/button'
import ProductsGrid, { type Product } from './products-grid'
import { ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Open Source & Systems | Subodh KC',
  description:
    'Products, packages, and technical systems I have built across AI operations, governance, developer tooling, security, and workflow automation. Inspectable technical work by Subodh KC.',
  alternates: {
    canonical: 'https://subodhkc.com/products',
  },
  openGraph: {
    title: 'Open Source & Systems | Subodh KC',
    description:
      'Products, packages, and technical systems. Inspectable technical work in the same areas I advise on.',
    url: 'https://subodhkc.com/products',
    type: 'website',
  },
  keywords: [
    'open source AI',
    'AI tools',
    'AI systems',
    'LLM monitoring',
    'MCP tenant isolation',
    'PDF redaction',
    'document timeline',
    'log analyzer',
    'legal case management',
    'print queue',
    'Subodh KC systems',
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'Open Source & Systems', item: 'https://subodhkc.com/products' },
  ],
}

const products: Product[] = [
  // Products
  {
    name: 'HAIEC',
    href: '/solutions/haiec',
    description: 'AI governance, assurance, and evidence system. Governance architecture, deterministic checks, evidence collection, and AI risk/control thinking. Built for organizations that need inspectable governance.',
    iconName: 'Shield',
    status: 'PRODUCT / ACTIVE',
    statusColor: 'bg-blue-500/10 text-blue-500',
    category: 'Products',
    features: ['Governance platform', 'Evidence architecture', 'AI risk controls', 'TRAIGA engine'],
    cta: 'Explore HAIEC',
  },
  {
    name: 'KestrelVoice',
    href: '/solutions/kestrelvoice',
    description: 'Voice AI and workflow operations platform. Production voice systems, real-time AI, workflow integration, and human escalation. Built for operational voice workflows.',
    iconName: 'Mic',
    status: 'PRODUCT / LIVE',
    statusColor: 'bg-green-500/10 text-green-500',
    category: 'Products',
    features: ['Production voice AI', 'Workflow operations', 'Human escalation', 'Real-time processing'],
    cta: 'Explore KestrelVoice',
  },
  // Open Source / Packages
  {
    name: 'llmverify',
    href: '/products/llmverify',
    description: 'Open-source LLM output monitoring, risk scoring, and classification for Node.js. Local-first guardrails that work without sending data to third parties.',
    iconName: 'Shield',
    status: 'OPEN SOURCE',
    statusColor: 'bg-blue-500/10 text-blue-500',
    category: 'Open Source / Packages',
    features: ['Prompt injection detection', 'PII redaction', 'Hallucination scoring', 'Zero telemetry'],
    cta: 'View Package',
  },
  {
    name: 'MCP Tenant Isolation',
    href: 'https://github.com/subodhkc/mcp-tenant-isolation',
    description: 'Deterministic analysis for multi-tenant SaaS and MCP isolation risks. 57 deterministic rules covering tenant isolation, IDOR, RLS, query isolation, and MCP-specific security. SARIF output for CI.',
    iconName: 'Lock',
    status: 'OPEN SOURCE',
    statusColor: 'bg-blue-500/10 text-blue-500',
    category: 'Open Source / Packages',
    features: ['57 deterministic rules', 'SARIF output', 'GitHub Code Scanning', 'MCP server support'],
    cta: 'View on GitHub',
    external: true,
  },
  {
    name: 'AI Article Generator',
    href: '/products/ai-article-generator',
    description: 'Automated AI content engine that fetches news from authoritative sources, categorizes with OpenAI GPT-4o, and publishes MDX articles. Open source, GitHub Actions ready.',
    iconName: 'FileText',
    status: 'OPEN SOURCE',
    statusColor: 'bg-blue-500/10 text-blue-500',
    category: 'Open Source / Packages',
    features: ['RSS to MDX', 'GPT-4o powered', 'GitHub Actions', 'Config-driven'],
    cta: 'View on GitHub',
  },
  {
    name: 'ISAF Logger',
    href: 'https://github.com/subodhkc/isaf-logger',
    description: 'Python package for instruction stack audit logging. Supports the ISAF framework published in Zenodo. Deterministic audit trail for LLM instruction stacks.',
    iconName: 'Code',
    status: 'OPEN SOURCE PACKAGE',
    statusColor: 'bg-blue-500/10 text-blue-500',
    category: 'Open Source / Packages',
    features: ['Python package', 'PyPI published', 'Instruction stack logging', 'ISAF compatible'],
    cta: 'View on PyPI',
    external: true,
  },
  // Technical Tools
  {
    name: 'PDF Redactor',
    href: '/products/pdf-redactor',
    description: 'AI-powered sensitive data removal. Automatically detect and permanently redact SSNs, credit cards, names, and 50+ PII types from PDFs. Local processing.',
    iconName: 'EyeOff',
    status: 'FREE TOOL',
    statusColor: 'bg-green-500/10 text-green-500',
    category: 'Technical Tools',
    features: ['AI detection', 'Permanent redaction', 'Batch processing', 'Local processing'],
    cta: 'Get Free Download',
  },
  {
    name: 'Doc Timeline Generator',
    href: '/products/doc-timeline',
    description: 'Transform thousands of documents into clear, chronological timelines. AI-powered extraction for legal discovery, insurance claims, and compliance audits.',
    iconName: 'Clock',
    status: 'TOOL',
    statusColor: 'bg-blue-500/10 text-blue-500',
    category: 'Technical Tools',
    features: ['AI extraction', 'Cross-document analysis', 'Gap detection', 'Chronological mapping'],
    cta: 'Learn More',
  },
  {
    name: 'SKC Log Analyser',
    href: '/products/skc-log-analyser',
    description: 'AI-powered log analysis that turns terabytes of data into actionable insights. Pattern detection, real-time alerts, and root cause analysis.',
    iconName: 'Activity',
    status: 'TOOL',
    statusColor: 'bg-blue-500/10 text-blue-500',
    category: 'Technical Tools',
    features: ['Pattern detection', 'Real-time alerts', 'Root cause analysis', 'On-premise'],
    cta: 'Learn More',
  },
  {
    name: 'Print Later',
    href: '/products/print-later',
    description: 'Save web pages now, print them later. A free, open-source Windows app that lets you build a print queue and print when you are ready.',
    iconName: 'Printer',
    status: 'FREE TOOL',
    statusColor: 'bg-green-500/10 text-green-500',
    category: 'Technical Tools',
    features: ['One-click save', 'Print queue', 'Browser extension', '100% local'],
    cta: 'Get Free Download',
  },
  // Experiments / Beta
  {
    name: 'CourtCase',
    href: '/products/courtcase',
    description: 'Organize legal documents with ease. Manage case files, track deadlines, and prepare document packets. All locally on your computer.',
    iconName: 'Scale',
    status: 'BETA',
    statusColor: 'bg-amber-500/10 text-amber-500',
    category: 'Experiments / Beta',
    features: ['Case organization', 'Deadline tracking', 'Document packets', '100% local'],
    cta: 'Join Waitlist',
  },
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
        subtitle="Open Source & Systems"
        title={
          <>
            Open Source
            <br />
            <span className="gradient-text">& Systems</span>
          </>
        }
        description="Products, packages, and technical systems I have built across AI operations, governance, developer tooling, security, and workflow automation. Inspectable technical work in the same areas I advise on."
      />

      <Section
        subtitle="Categories"
        title="What Is Here"
      >
        <div className="max-w-3xl mx-auto text-center space-y-2 text-sm text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">Products</span> are operating systems and platforms I am actively building and maintaining.
          </p>
          <p>
            <span className="font-semibold text-foreground">Open Source / Packages</span> are published packages you can install, inspect, and use.
          </p>
          <p>
            <span className="font-semibold text-foreground">Technical Tools</span> are downloadable tools for specific workflows.
          </p>
          <p>
            <span className="font-semibold text-foreground">Experiments / Beta</span> are current genuine projects still in development.
          </p>
        </div>
      </Section>

      <Section
        subtitle="All Systems"
        title="Products, Packages & Tools"
        id="products-grid"
      >
        <div className="max-w-6xl mx-auto">
          <ProductsGrid products={products} />
        </div>
      </Section>

      <Section
        subtitle="GitHub"
        title="See the Code"
        className="bg-secondary/20"
      >
        <div className="max-w-md mx-auto text-center">
          <p className="text-muted-foreground mb-6">
            Most of my open-source work is public on GitHub. Inspect the code, open issues, or fork it.
          </p>
          <Link href="https://github.com/subodhkc" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="gap-2">
              View GitHub Profile
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Section>
    </>
  )
}
