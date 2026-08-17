'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

/**
 * Restrained sticky mobile CTA for the /advisory page.
 * Appears after the user scrolls past the hero.
 * Hides on scroll up, respects safe-area-inset-bottom, hides on desktop.
 */
export function FractionalStickyCTA() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (dismissed) return

    let lastScrollY = window.scrollY
    let ticking = false

    const HERO_HEIGHT = 600

    function update() {
      const currentY = window.scrollY
      if (currentY > HERO_HEIGHT) {
        if (currentY < lastScrollY - 20) {
          setVisible(false)
        } else if (currentY > lastScrollY + 5) {
          setVisible(true)
        }
      } else {
        setVisible(false)
      }
      lastScrollY = currentY
      ticking = false
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [dismissed])

  if (dismissed) return null

  return (
    <>
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ${
          visible ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
        role="complementary"
        aria-label="Start Fractional AI Advisor"
      >
        <div className="bg-background/95 backdrop-blur-sm border-t border-border shadow-lg">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex-shrink-0">
              <div className="text-sm font-semibold leading-tight">Start Fractional AI Advisor</div>
              <div className="text-xs text-muted-foreground">$1,250/mo, month-to-month</div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setDismissed(true)}
                className="text-xs text-muted-foreground hover:text-foreground px-2 py-1"
                aria-label="Dismiss"
              >
                Later
              </button>
              <Link
                href="#start"
                onClick={() => setVisible(false)}
                className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Start
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
