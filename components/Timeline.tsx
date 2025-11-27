import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TimelineItem {
  date: string
  title: string
  subtitle?: string
  description?: string | ReactNode
}

interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

export default function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn('relative', className)}>
      {/* Vertical line */}
      <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border md:-ml-px" />

      <div className="space-y-12">
        {items.map((item, index) => (
          <div
            key={index}
            className={cn(
              'relative grid md:grid-cols-2 gap-8 md:gap-12',
              index % 2 === 0 ? 'md:text-right' : 'md:flex-row-reverse'
            )}
          >
            {/* Content */}
            <div
              className={cn(
                'pl-8 md:pl-0',
                index % 2 === 0 ? 'md:pr-12' : 'md:col-start-2 md:pl-12'
              )}
            >
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 mb-3">
                <span className="text-xs font-medium text-primary">{item.date}</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-1">{item.title}</h3>
              {item.subtitle && (
                <p className="text-sm text-muted-foreground mb-2">{item.subtitle}</p>
              )}
              {item.description && (
                <div className="text-muted-foreground">{item.description}</div>
              )}
            </div>

            {/* Dot */}
            <div
              className={cn(
                'absolute left-0 md:left-1/2 w-4 h-4 rounded-full border-4 border-background bg-primary',
                'md:-ml-2 -ml-2'
              )}
              style={{ top: '0.5rem' }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
