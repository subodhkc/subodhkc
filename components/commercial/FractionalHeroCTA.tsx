'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useFractionalAnalytics } from '@/components/commercial/useFractionalAnalytics'

/**
 * Client-side hero CTA buttons for /advisory.
 * Tracks fractional_hero_cta and fractional_discuss_fit clicks.
 */
export function FractionalHeroCTA() {
  const { track } = useFractionalAnalytics()

  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-2">
      <Link href="#start" onClick={() => track('fractional_hero_cta')}>
        <Button size="lg" className="group w-full sm:w-auto">
          Start Fractional AI Advisor
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </Link>
      <Link href="/contact" onClick={() => track('fractional_discuss_fit')}>
        <Button size="lg" variant="outline" className="w-full sm:w-auto">
          Discuss Fit
        </Button>
      </Link>
    </div>
  )
}
