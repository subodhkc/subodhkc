import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionProps {
  title?: string
  subtitle?: string
  description?: string
  children: ReactNode
  className?: string
  id?: string
}

export default function Section({
  title,
  subtitle,
  description,
  children,
  className,
  id,
}: SectionProps) {
  return (
    <section id={id} className={cn('page-padding', className)}>
      <div className="section-container">
        {(title || subtitle || description) && (
          <div className="max-w-3xl mb-12">
            {subtitle && (
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 mb-4">
                <span className="text-sm font-medium text-primary">{subtitle}</span>
              </div>
            )}
            {title && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
