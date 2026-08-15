'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Briefcase, Code, Users, ChevronRight, ExternalLink,
  Loader2, AlertCircle, Zap,
} from 'lucide-react'

interface BriefStory {
  id: string
  title: string
  summaryShort: string
  summaryManager: string | null
  sourceName: string
  sourceUrl: string
  publishedAt: string | null
  scrapedAt: string | null
  impactScore: number
  impactLevel: 'critical' | 'high' | 'medium' | 'low'
  category: { slug: string; label: string; icon: string }
  whyItMatters: string | null
  actionItem: string | null
  actionOwner: string | null
}

type PersonaKey = 'exec' | 'cto' | 'pm' | 'dev'

interface PersonaConfig {
  key: PersonaKey
  label: string
  icon: typeof Briefcase
  description: string
  color: string
}

const personas: PersonaConfig[] = [
  {
    key: 'exec',
    label: 'Executive Brief',
    icon: Briefcase,
    description: 'Strategic decisions and business impact',
    color: 'border-indigo-500/30 bg-indigo-500/5',
  },
  {
    key: 'cto',
    label: 'CTO / Tech Brief',
    icon: Zap,
    description: 'Architecture, security, and platform decisions',
    color: 'border-amber-500/30 bg-amber-500/5',
  },
  {
    key: 'pm',
    label: 'Product / PM Brief',
    icon: Users,
    description: 'Product strategy and roadmap implications',
    color: 'border-emerald-500/30 bg-emerald-500/5',
  },
  {
    key: 'dev',
    label: 'Dev / Ops Brief',
    icon: Code,
    description: 'Implementation, tooling, and operations',
    color: 'border-blue-500/30 bg-blue-500/5',
  },
]

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function ExecutiveBriefs() {
  const [activePersona, setActivePersona] = useState<PersonaKey>('exec')
  const [stories, setStories] = useState<BriefStory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBriefs = useCallback(async (persona: PersonaKey) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        persona,
        timeframe: '7d',
        limit: '5',
      })
      const res = await fetch(`/api/briefing/stories?${params}`, { cache: 'no-store' })
      const data = await res.json()
      if (data.success) {
        setStories(data.stories)
      } else {
        setError(data.error || 'Failed to load briefs')
        setStories([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load briefs')
      setStories([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBriefs(activePersona)
  }, [activePersona, fetchBriefs])

  const currentPersona = personas.find((p) => p.key === activePersona)!
  const PersonaIcon = currentPersona.icon

  return (
    <section>
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <Briefcase className="h-5 w-5" />
        Executive Briefs
      </h2>

      {/* Persona tabs */}
      <div className="flex flex-wrap gap-1 mb-4 border-b">
        {personas.map((persona) => {
          const Icon = persona.icon
          const isActive = activePersona === persona.key
          return (
            <button
              key={persona.key}
              onClick={() => setActivePersona(persona.key)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {persona.label}
            </button>
          )
        })}
      </div>

      {/* Active persona description */}
      <p className="text-xs text-muted-foreground mb-4">
        {currentPersona.description}
      </p>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Loading {currentPersona.label}...
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className={`rounded-lg border p-4 text-sm flex items-start gap-2 ${currentPersona.color}`}>
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Could not load {currentPersona.label}</p>
            <p className="text-xs mt-1 opacity-80">{error}</p>
          </div>
        </div>
      )}

      {/* Briefs list */}
      {!loading && !error && (
        <>
          {stories.length === 0 ? (
            <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
              No stories relevant to this persona in the last 7 days.
            </div>
          ) : (
            <div className="space-y-2">
              {stories.map((story, index) => (
                <div
                  key={story.id}
                  className={`rounded-lg border p-4 ${currentPersona.color} ${
                    story.impactLevel === 'critical' ? 'ring-1 ring-red-500/20' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Priority indicator */}
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-bold text-muted-foreground">
                          #{index + 1}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-background border">
                          {story.category.icon} {story.category.label}
                        </span>
                        {story.impactLevel === 'critical' && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/10 text-red-700 border border-red-500/30">
                            CRITICAL
                          </span>
                        )}
                        {story.impactLevel === 'high' && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-700 border border-orange-500/30">
                            HIGH
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-semibold mb-1.5">
                        {story.title}
                      </h3>

                      {/* Manager summary if available, otherwise short summary */}
                      <p className="text-xs text-muted-foreground line-clamp-3">
                        {story.summaryManager || story.summaryShort}
                      </p>

                      {/* Why it matters */}
                      {story.whyItMatters && (
                        <div className="mt-2 pt-2 border-t border-border/50">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">
                            Why It Matters
                          </p>
                          <p className="text-xs line-clamp-2">{story.whyItMatters}</p>
                        </div>
                      )}

                      {/* Action item */}
                      {story.actionItem && (
                        <div className="mt-2 pt-2 border-t border-border/50">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-0.5">
                            Action
                          </p>
                          <p className="text-xs line-clamp-2">{story.actionItem}</p>
                          {story.actionOwner && (
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              Owner: {story.actionOwner}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Source */}
                      <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                        <span>{formatDate(story.scrapedAt || story.publishedAt)}</span>
                        <span>·</span>
                        <span className="truncate">{story.sourceName}</span>
                        {story.sourceUrl && (
                          <a
                            href={story.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-auto inline-flex items-center gap-0.5 text-primary hover:underline"
                          >
                            Source
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}
