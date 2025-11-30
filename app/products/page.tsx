'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Printer, 
  Scale, 
  Clock, 
  EyeOff, 
  Activity,
  ArrowRight,
  Shield,
  Zap,
  Lock
} from 'lucide-react'
import { cn } from '@/lib/utils'

const products = [
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
    description: 'Organize your legal documents with ease. Manage case files, track deadlines, and prepare document packets — all locally on your computer.',
    icon: Scale,
    badge: 'Coming Soon',
    badgeColor: 'bg-amber-500/10 text-amber-500',
    features: ['Case organization', 'Deadline tracking', 'Document packets', '100% local'],
    cta: 'Join Waitlist'
  }
]

export default function ProductsPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            <span>Privacy-First Tools</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Tools That Respect
            <span className="gradient-text block">Your Data</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Every product we build follows the same principle: your data stays on your computer. 
            No cloud uploads. No tracking. No compromises.
          </p>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-16 text-sm text-muted-foreground">
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

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const Icon = product.icon
            return (
              <Card key={product.name} className="flex flex-col hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <span className={cn("text-xs px-3 py-1 rounded-full font-medium", product.badgeColor)}>
                      {product.badge}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-muted-foreground mb-4 flex-1">
                    {product.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {product.features.map((feature, index) => (
                      <span 
                        key={index}
                        className="text-xs px-2 py-1 bg-secondary rounded-full text-muted-foreground"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <Link href={product.href}>
                    <Button className="w-full gap-2">
                      {product.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 inline-block">
            <h2 className="text-2xl font-bold mb-4">Have a Product Idea?</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              We&apos;re always looking for new tools to build. If you have an idea for a privacy-first 
              productivity tool, we&apos;d love to hear it.
            </p>
            <Link href="/contact">
              <Button variant="outline" className="gap-2">
                Get in Touch
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
