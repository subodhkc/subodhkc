'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Building2, Briefcase, Code2, Users, ArrowRight, RefreshCw, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { csmDomains, csmProvenance } from '@/data/csm'

const domainIcons: Record<string, typeof Building2> = {
  'csm-enterprise': Building2,
  'csm-project': Briefcase,
  'csm-code': Code2,
  'csm-ux': Users,
}

const domainHeadlines: Record<string, string> = {
  'csm-enterprise': 'Establish the decision context before projects improvise it.',
  'csm-project': 'Make scaling an explicit decision.',
  'csm-code': 'Keep AI-assisted development accountable.',
  'csm-ux': 'Keep human judgment connected to the system.',
}

const domainValues: Record<string, string> = {
  'csm-enterprise':
    'Gives projects and technical teams clearer organizational direction, ownership and governance boundaries.',
  'csm-project':
    'Creates a deliberate decision boundary between experimentation and operational commitment.',
  'csm-code':
    'Extends normal engineering review, security and accountability into AI-assisted development.',
  'csm-ux':
    'Connects governance to real human use and creates feedback for improving the wider system.',
}

const domainAccents: Record<string, string> = {
  'csm-enterprise': '#2563eb',
  'csm-project': '#7c3aed',
  'csm-code': '#0891b2',
  'csm-ux': '#db2777',
}

const flowSteps = [
  { name: 'Enterprise', desc: 'Defines purpose, ownership and boundaries.' },
  { name: 'Project', desc: 'Turns those decisions into business criteria, testing and a scale decision.' },
  { name: 'Code', desc: 'Implements the system under engineering and security controls.' },
  { name: 'UX', desc: 'Defines how people use, interpret, challenge and oversee outcomes.' },
  { name: 'Feedback', desc: 'Operational learning returns to Project and Enterprise.' },
]

const handoffLines = [
  'Enterprise decisions inform Project criteria.',
  'Project criteria inform Code.',
  'Implementation reality shapes UX.',
  'Operational and user feedback flows back into Project and Enterprise governance.',
]

export function CSMFrameworkSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Only auto-advance when the section is actually on screen
  useEffect(() => {
    if (!sectionRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.3 }
    )
    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (reducedMotion || isPaused || !isInView) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % csmDomains.length)
    }, 5000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [reducedMotion, isPaused, isInView])

  return (
    <section ref={sectionRef} id="csm" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary/80">
            CSM 2.0 · Based on the Original 2025 Framework
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Cognitive Systems Management 2.0
          </h2>
          <p className="text-lg text-foreground/90 max-w-2xl mx-auto leading-relaxed">
            <strong>Four governance domains. Six execution functions. Explicit decisions and evidence.</strong>
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Version 2 adds deterministic governance contracts, evidence requirements and reassessment rules.
          </p>
        </div>

        {/* Domain Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          {csmDomains.map((domain, index) => {
            const Icon = domainIcons[domain.id] || Building2
            const isActive = index === activeIndex
            const accent = domainAccents[domain.id] || '#2563eb'
            return (
              <Card
                key={domain.id}
                className={cn(
                  'h-full transition-all duration-300 cursor-pointer relative overflow-hidden',
                  isActive ? 'ring-2 scale-[1.02]' : 'opacity-70 hover:opacity-100'
                )}
                style={isActive ? { boxShadow: `0 0 0 2px ${accent}`, borderColor: accent } : undefined}
                onMouseEnter={() => {
                  setActiveIndex(index)
                  setIsPaused(true)
                }}
                onMouseLeave={() => setIsPaused(false)}
                onFocus={() => {
                  setActiveIndex(index)
                  setIsPaused(true)
                }}
                onBlur={() => setIsPaused(false)}
                onClick={() => setActiveIndex(index)}
                tabIndex={0}
                role="button"
                aria-label={`${domain.displayName}: ${domainHeadlines[domain.id]}`}
              >
                {isActive && (
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ background: accent }}
                  />
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon
                      className="h-4 w-4"
                      style={{ color: accent }}
                    />
                    <CardTitle className="text-sm">{domain.displayName}</CardTitle>
                  </div>
                  <p className="text-xs font-medium text-foreground">
                    {domainHeadlines[domain.id]}
                  </p>
                </CardHeader>
                <CardContent className={cn(
                  'overflow-hidden transition-all duration-300',
                  isActive ? 'max-h-96' : 'max-h-0'
                )}>
                  <p className="text-xs text-muted-foreground mb-2">
                    <strong className="text-foreground">Question:</strong> {domain.centralQuestion}
                  </p>
                  <div className="space-y-0.5 mb-2">
                    {domain.originalComponents.map((comp) => (
                      <p key={comp.name} className="text-xs text-muted-foreground flex items-start gap-1">
                        <span className="mt-0.5" style={{ color: accent }}>&bull;</span>
                        {comp.name}
                      </p>
                    ))}
                  </div>
                  <p className="text-xs text-foreground/80 italic">
                    {domainValues[domain.id]}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Flow Diagram */}
        <div className="max-w-3xl mx-auto mb-8 rounded-lg border border-border/60 bg-muted/20 p-6">
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            {flowSteps.map((step, i, arr) => (
              <div key={step.name} className="flex items-center gap-2">
                <span className={cn(
                  'px-3 py-1.5 rounded-full border text-xs font-medium',
                  step.name === 'Feedback'
                    ? 'border-primary/30 bg-primary/5 text-primary'
                    : 'border-border bg-background text-foreground'
                )}>
                  {step.name}
                </span>
                {i < arr.length - 1 && (
                  <ArrowRight className="h-3 w-3 text-primary/40" />
                )}
              </div>
            ))}
            <RefreshCw className="h-3 w-3 text-primary/40" />
          </div>
          <p className="text-center text-xs text-muted-foreground mt-3">
            The domains are governance lenses, not sequential project phases.
          </p>
        </div>

        {/* Handoff Value */}
        <div className="max-w-2xl mx-auto mb-10 space-y-2">
          {handoffLines.map((line) => (
            <p key={line} className="text-sm text-muted-foreground text-center">
              {line}
            </p>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/cognitive-systems-management"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Explore CSM 2.0 <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={csmProvenance.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Read the Original Publication <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </section>
  )
}
