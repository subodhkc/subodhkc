import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GridProps {
  children: ReactNode
  cols?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Grid({ children, cols = 3, gap = 'lg', className }: GridProps) {
  const colsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  const gapClass = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  }

  return (
    <div className={cn('grid', colsClass[cols], gapClass[gap], className)}>
      {children}
    </div>
  )
}
