'use client'

import { CheckoutButton } from '@/components/commercial/CheckoutButton'

interface AdvisorCheckoutCTAProps {
  title: string
  description: string
}

export function AdvisorCheckoutCTA({ title, description }: AdvisorCheckoutCTAProps) {
  return (
    <section className="page-padding">
      <div className="section-container">
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-accent/5 to-background p-8 md:p-12 lg:p-16">
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              {title}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{description}</p>
            <div className="flex flex-wrap gap-4">
              <CheckoutButton
                apiEndpoint="/api/commercial/advisor-desk/checkout"
                body={{ period: 'annual' }}
                text="Start AI Advisor Desk — $990/year"
                className="group"
              />
              <CheckoutButton
                apiEndpoint="/api/commercial/advisor-desk/checkout"
                body={{ period: 'monthly' }}
                text="$99/month"
                variant="outline"
                showArrow={false}
              />
            </div>
          </div>
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        </div>
      </div>
    </section>
  )
}
