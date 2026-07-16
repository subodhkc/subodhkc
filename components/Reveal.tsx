'use client'

import { useEffect, useRef, ReactNode } from 'react'

type RevealStyle = 'up' | 'left' | 'right' | 'scale' | 'fade'

interface RevealProps {
  children: ReactNode
  style?: RevealStyle
  delay?: number
  className?: string
  as?: 'div' | 'li' | 'span'
}

export function Reveal({
  children,
  style = 'up',
  delay = 0,
  className = '',
  as: Tag = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      el.setAttribute('data-revealed', 'true')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            window.setTimeout(() => {
              el.setAttribute('data-revealed', 'true')
            }, delay)
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return (
    <Tag
      ref={ref as any}
      data-reveal-style={style}
      className={`reveal ${className}`}
    >
      {children}
    </Tag>
  )
}
