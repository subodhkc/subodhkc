'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Newspaper, ChevronDown, ExternalLink, AlertCircle,
  Loader2, Filter, RefreshCw,
} from 'lucide-react'

interface Story {
  id: string
  title: string
  summaryShort: string
  summaryExtended: string | null
  summaryManager: string | null
  sourceName: string
  sourceUrl: string
  publishedAt: string | null
  scrapedAt: string | null
  impactScore: number
  impactLevel: 'critical' | 'high' | 'medium' | 'low'
  category: { slug: string; label: string; icon: string }
  relevantRoles: string[]
  whyItMatters: string | null
  actionItem: string | null
  actionOwner: string | null
}

interface NewsCardGridProps {
  /** Initial limit of stories to show */
  initialLimit?: number
}

const impactConfig: Record<string, { label: string; border: string; badge: string }> = {
  critical: {
    label: 'CRITICAL',
    border: 'border-l-4 border-l-red-500',
    badge: 'bg-red-500/10 text-red-700 border border-red-500/30',
  },
  high: {
    label: 'HIGH',
    border: 'border-l-4 border-l-orange-500',
    badge: 'bg-orange-500/10 text-orange-700 border border-orange-500/30',
  },
  medium: {
    label: 'MEDIUM',
    border: 'border-l-4 border-l-blue-500',
    badge: 'bg-blue-500/10 text-blue-700 border border-blue-500/30',
  },
  low: {
    label: 'LOW',
    border: 'border-l-4 border-l-gray-300',
    badge: 'bg-gray-500/10 text-gray-600 border border-gray-500/30',
  },
}

const roleLabels: Record<string, string> = {
  it_ops: 'IT Ops',
  devops: 'DevOps',
  sre: 'SRE',
  security: 'Security',
  data: 'Data',
  product: 'Product',
  cto: 'CTO',
  tpm: 'TPM',
  pm: 'PM',
  exec: 'Exec',
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const diffHrs = (now.getTime() - d.getTime()) / (1000 * 60 * 60)
  if (diffHrs < 1) return 'Just now'
  if (diffHrs < 24) return `${Math.floor(diffHrs)}h ago`
  if (diffHrs < 48) return 'Yesterday'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function NewsCardGrid({ initialLimit = 12 }: NewsCardGridProps) {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filter, setFilter] = useState({
    persona: 'all',
    timeframe: '7d',
  })

  const fetchStories = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        persona: filter.persona,
        timeframe: filter.timeframe,
        limit: String(initialLimit),
      })
      const res = await fetch(`/api/briefing/stories?${params}`, { cache: 'no-store' })
      const data = await res.json()
      if (data.success) {
        setStories(data.stories)
      } else {
        setError(data.error || 'Failed to load stories')
        setStories([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stories')
      setStories([])
    } finally {
      setLoading(false)
    }
  }, [filter, initialLimit])

  useEffect(() => {
    fetchStories()
  }, [fetchStories])

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          AI Intelligence Feed
        </h2>
        <button
          onClick={fetchStories}
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          disabled={loading}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Filter className="h-3.5 w-3.5" />
        </div>
        <select
          value={filter.persona}
          onChange={(e) => setFilter({ ...filter, persona: e.target.value })}
          className="text-xs px-2.5 py-1.5 rounded-md border bg-background"
        >
          <option value="all">All Roles</option>
          <option value="exec">Executive</option>
          <option value="cto">CTO / Tech</option>
          <option value="pm">Product / PM</option>
          <option value="dev">Dev / Ops</option>
        </select>
        <select
          value={filter.timeframe}
          onChange={(e) => setFilter({ ...filter, timeframe: e.target.value })}
          className="text-xs px-2.5 py-1.5 rounded-md border bg-background"
        >
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="all">All time</option>
        </select>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Loading AI intelligence...
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-700 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Could not load AI intelligence feed</p>
            <p className="text-xs mt-1 text-amber-600">{error}</p>
          </div>
        </div>
      )}

      {/* News card grid */}
      {!loading && !error && (
        <>
          {stories.length === 0 ? (
            <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
              No AI intelligence stories found for this filter.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {stories.map((story) => {
                const impact = impactConfig[story.impactLevel]
                const isExpanded = expandedId === story.id

                return (
                  <div
                    key={story.id}
                    className={`bg-card border rounded-lg overflow-hidden transition-all ${impact.border} ${
                      isExpanded ? 'sm:col-span-2 lg:col-span-3' : ''
                    }`}
                  >
                    <div
                      onClick={() => setExpandedId(isExpanded ? null : story.id)}
                      className="p-4 cursor-pointer hover:bg-accent/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs px-2 py-0.5 rounded bg-muted font-medium">
                          {story.category.icon} {story.category.label}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${impact.badge}`}>
                          {impact.label}
                        </span>
                      </div>

                      <h3 className="text-sm font-semibold mb-2 line-clamp-2">
                        {story.title}
                      </h3>

                      {!isExpanded && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {story.summaryShort}
                        </p>
                      )}

                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-2">
                        <span>{formatDate(story.scrapedAt || story.publishedAt)}</span>
                        <span>·</span>
                        <span className="truncate">{story.sourceName}</span>
                        <span className="ml-auto flex items-center gap-0.5">
                          <ChevronDown className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </span>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-3 border-t pt-3">
                        {story.summaryExtended && (
                          <div className="rounded-md bg-muted/30 p-3">
                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                              What Changed
                            </h4>
                            <p className="text-xs">{story.summaryExtended}</p>
                          </div>
                        )}

                        {story.whyItMatters && (
                          <div className="rounded-md bg-muted/30 p-3">
                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                              Why It Matters
                            </h4>
                            <p className="text-xs">{story.whyItMatters}</p>
                          </div>
                        )}

                        {story.actionItem && (
                          <div className="rounded-md bg-primary/5 border border-primary/20 p-3">
                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">
                              Recommended Action
                            </h4>
                            <p className="text-xs">{story.actionItem}</p>
                            {story.actionOwner && (
                              <p className="text-[10px] text-muted-foreground mt-1">
                                Owner: {story.actionOwner}
                              </p>
                            )}
                          </div>
                        )}

                        {story.relevantRoles.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {story.relevantRoles.map((role) => (
                              <span
                                key={role}
                                className="text-[10px] px-2 py-0.5 rounded-full bg-background border"
                              >
                                {roleLabels[role] || role}
                              </span>
                            ))}
                          </div>
                        )}

                        {story.sourceUrl && (
                          <a
                            href={story.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            Read source
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </section>
  )
}
