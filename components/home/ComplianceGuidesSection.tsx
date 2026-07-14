import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Scale, Shield, Building2, ArrowRight } from 'lucide-react'

const guides = [
  {
    icon: Scale,
    href: '/guides/texas-ai-law',
    title: 'Texas AI Law (TRAIGA)',
    description: 'HB 149. Effective Jan 2026. Penalties $10K-$200K. 60-day cure period.',
  },
  {
    icon: Shield,
    href: '/guides/eu-ai-act',
    title: 'EU AI Act',
    description: 'Risk-tiered regulation. Full enforcement Aug 2026. Penalties up to €35M.',
  },
  {
    icon: Building2,
    href: '/guides/nyc-local-law-144',
    title: 'NYC Local Law 144',
    description: 'AEDT bias audits. Active enforcement since July 2023.',
  },
]

export function ComplianceGuidesSection() {
  return (
    <section style={{ maxWidth: 1240, margin: '0 auto', padding: '48px 28px' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>
          AI Compliance Law Guides
        </h2>
        <p style={{ fontSize: '1.125rem', color: 'var(--muted)', maxWidth: 600, margin: '0 auto' }}>
          Comprehensive guides to the AI regulations that matter most — informed by the HAIEC compliance engine and Zenodo-published research.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
        {guides.map((guide) => {
          const Icon = guide.icon
          return (
            <Link key={guide.href} href={guide.href} style={{ textDecoration: 'none' }}>
              <Card style={{ height: '100%', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                <CardHeader>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--chip)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon style={{ width: 20, height: 20, color: 'var(--primary)' }} />
                    </div>
                    <CardTitle style={{ fontSize: '1rem' }}>{guide.title}</CardTitle>
                  </div>
                  <CardDescription style={{ fontSize: '0.875rem' }}>{guide.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </div>

      <div style={{ textAlign: 'center' }}>
        <Link href="/guides" style={{ fontSize: '0.875rem', color: 'var(--primary)', textDecoration: 'none' }}>
          View all compliance guides <ArrowRight style={{ width: 12, height: 12, display: 'inline', marginLeft: 4 }} />
        </Link>
      </div>
    </section>
  )
}
