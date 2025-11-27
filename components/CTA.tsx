import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

interface CTAProps {
  title: string
  description: string
  primaryButton?: {
    text: string
    href: string
  }
  secondaryButton?: {
    text: string
    href: string
  }
}

export default function CTA({ title, description, primaryButton, secondaryButton }: CTAProps) {
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
              {primaryButton && (
                <Link href={primaryButton.href}>
                  <Button size="lg" className="group">
                    {primaryButton.text}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              )}
              {secondaryButton && (
                <Link href={secondaryButton.href}>
                  <Button size="lg" variant="outline">
                    {secondaryButton.text}
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Decorative gradient orbs */}
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        </div>
      </div>
    </section>
  )
}
