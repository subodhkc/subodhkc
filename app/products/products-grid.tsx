// app/products/products-grid.tsx - Client component with icon name mapping
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowRight,
  Shield,
  FileText,
  Printer,
  EyeOff,
  Clock,
  Activity,
  Scale,
  Mic,
  Lock,
  Code,
  Boxes,
  Wrench,
  FlaskConical,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type ProductCategory = 'Products' | 'Open Source / Packages' | 'Technical Tools' | 'Experiments / Beta'

export type Product = {
  name: string
  href: string
  description: string
  iconName: string
  status: string
  statusColor: string
  category: ProductCategory
  features: string[]
  cta: string
  external?: boolean
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield,
  FileText,
  Printer,
  EyeOff,
  Clock,
  Activity,
  Scale,
  Mic,
  Lock,
  Code,
  Boxes,
  Wrench,
  FlaskConical,
}

const filters: { label: string; value: ProductCategory | 'All' }[] = [
  { label: 'All', value: 'All' },
  { label: 'Products', value: 'Products' },
  { label: 'Open Source', value: 'Open Source / Packages' },
  { label: 'Technical Tools', value: 'Technical Tools' },
  { label: 'Experiments', value: 'Experiments / Beta' },
]

export default function ProductsGrid({ products }: { products: Product[] }) {
  const [activeFilter, setActiveFilter] = useState<ProductCategory | 'All'>('All')

  const filtered = activeFilter === 'All'
    ? products
    : products.filter(p => p.category === activeFilter)

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              activeFilter === f.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((product) => {
          const Icon = ICON_MAP[product.iconName] || Boxes
          return (
            <Card key={product.name} className="flex flex-col hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <span className={cn('text-xs px-3 py-1 rounded-full font-medium', product.statusColor)}>
                    {product.status}
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
                <Link href={product.href} target={product.external ? '_blank' : undefined} rel={product.external ? 'noopener noreferrer' : undefined}>
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

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          No systems in this category yet.
        </p>
      )}
    </>
  )
}
