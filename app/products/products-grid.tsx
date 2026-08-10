'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Product = {
  name: string
  href: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  badge: string
  badgeColor: string
  features: string[]
  cta: string
}

const filters = [
  { label: 'Open Source', value: 'Open Source' },
  { label: 'All', value: 'All' },
  { label: 'Free', value: 'Free' },
  { label: 'Enterprise', value: 'Enterprise' },
  { label: 'Early Access', value: 'Early Access' },
  { label: 'Coming Soon', value: 'Coming Soon' },
]

export default function ProductsGrid({ products }: { products: Product[] }) {
  const [activeFilter, setActiveFilter] = useState('Open Source')

  const filtered = activeFilter === 'All'
    ? products
    : products.filter(p => p.badge === activeFilter)

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
          const Icon = product.icon
          return (
            <Card key={product.name} className="flex flex-col hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <span className={cn('text-xs px-3 py-1 rounded-full font-medium', product.badgeColor)}>
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

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          No products in this category yet.
        </p>
      )}
    </>
  )
}
