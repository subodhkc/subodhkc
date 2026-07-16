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

  return (
    <div ref={ref} className={`diagram-reveal ${className}`}>
      {children}
    </div>
  )
}
