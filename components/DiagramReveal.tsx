'use client'

import { useEffect, useRef, ReactNode } from 'react'

interface DiagramRevealProps {
  children: ReactNode
  className?: string
}

export function DiagramReveal({ children, className = '' }: DiagramRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      el.setAttribute('data-diagram-visible', 'true')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.setAttribute('data-diagram-visible', 'true')
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.2, rootMargin: '0px 0px -60px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const updateActive = () => {
      const hasActive = el.querySelector('svg g[data-node][data-active="true"]')
      el.setAttribute('data-has-active', hasActive ? 'true' : 'false')
    }

    const mo = new MutationObserver(updateActive)
    mo.observe(el, { attributes: true, attributeFilter: ['data-active'], subtree: true })
    updateActive()

    return () => mo.disconnect()
  }, [])

  return (
    <div ref={ref} className={`diagram-reveal ${className}`}>
      {children}
    </div>
  )
}
