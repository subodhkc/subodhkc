import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface HeroProps {
  title: string | ReactNode
  subtitle?: string
  description?: string
  children?: ReactNode
  className?: string
}

export default function Hero({ title, subtitle, description, children, className }: HeroProps) {
  return (
    <section className={cn('page-padding pt-32', className)}>
      <div className="section-container">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {subtitle && (
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
              <span className="text-sm font-medium text-primary">{subtitle}</span>
            </div>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
            {title}
          </h1>

          {description && (
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          )}

          {children && <div className="flex flex-wrap gap-4 justify-center pt-4">{children}</div>}
        </div>
      </div>
    </section>
  )
}
