'use client'

import { useState } from 'react'
import { ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { OrganizationSelectionStep } from '@/components/commercial/OrganizationSelectionStep'
import { useFractionalAnalytics } from '@/components/commercial/useFractionalAnalytics'

interface FractionalAdvisorCheckoutCTAProps {
  title: string
  description: string
  bullets?: string[]
}

export function FractionalAdvisorCheckoutCTA({ title, description, bullets }: FractionalAdvisorCheckoutCTAProps) {
  const [selectedOrg, setSelectedOrg] = useState<{ id: string; name: string; slug: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { track } = useFractionalAnalytics()

  async function handleCheckout(period: 'monthly' | 'annual') {
    if (!selectedOrg) return
    setLoading(true)
    setError(null)
    track('fractional_checkout_started', { period })
    try {
      const res = await fetch('/api/commercial/fractional-advisor/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period, organizationId: selectedOrg.id }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else if (data.error === 'already_active') {
        setError(data.message || 'Already subscribed')
        if (data.workspaceUrl) {
          setTimeout(() => { window.location.href = data.workspaceUrl }, 2000)
        }
      } else if (data.error === 'Authentication required' || data.error === 'unauthorized') {
        setError('Sign in to continue to checkout.')
      } else {
        setError(data.message || data.error || 'Failed to start checkout')
      }
    } catch {
      setError('Network error. Please try again.')
    }
    setLoading(false)
  }

  return (
    <section className="page-padding">
      <div className="section-container">
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-accent/5 to-background p-8 md:p-12 lg:p-16">
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              {title}
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{description}</p>

            {bullets && bullets.length > 0 && (
              <div className="mb-8">
                <div className="grid sm:grid-cols-2 gap-2 max-w-2xl">
                  {bullets.map((bullet, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!selectedOrg ? (
              <OrganizationSelectionStep onOrganizationSelected={setSelectedOrg} />
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
                  Purchasing for <strong>{selectedOrg.name}</strong>{' '}
                  <button
                    onClick={() => setSelectedOrg(null)}
                    className="text-xs text-muted-foreground hover:text-foreground underline ml-2"
                  >
                    Change
                  </button>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={() => handleCheckout('monthly')}
                    disabled={loading}
                    size="lg"
                    className="group"
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Start Fractional AI Advisor: $1,250/month
                    {!loading && <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
                  </Button>
                  <Button
                    onClick={() => handleCheckout('annual')}
                    disabled={loading}
                    size="lg"
                    variant="outline"
                  >
                    $12,500/year (save 2 months)
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  By proceeding to checkout, you agree to the{' '}
                  <a href="/terms" className="text-primary hover:underline" target="_blank" rel="noopener">Terms of Service</a>
                  {' '}and{' '}
                  <a href="/service-terms/fractional-ai-advisor" className="text-primary hover:underline" target="_blank" rel="noopener">Fractional AI Advisor Service Terms</a>.
                  {' '}Stripe checkout will require explicit terms acceptance.
                </p>
                {error && <p className="text-sm text-red-600">{error}</p>}
              </div>
            )}
          </div>
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        </div>
      </div>
    </section>
  )
}
