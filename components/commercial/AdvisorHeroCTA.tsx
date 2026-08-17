'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useAdvisorAnalytics } from '@/components/commercial/useAdvisorAnalytics'

/**
 * Client-side hero CTA button for /ai-advisor.
 * Tracks advisor_hero_cta clicks.
 */
export function AdvisorHeroCTA() {
  const { track } = useAdvisorAnalytics()

  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-2">
      <Link href="#start" onClick={() => track('advisor_hero_cta')}>
        <Button size="lg" className="group w-full sm:w-auto">
          Start My Advisor Desk
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </Link>
    </div>
  )
}
