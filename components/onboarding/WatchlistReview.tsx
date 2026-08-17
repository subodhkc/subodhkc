'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2, Sparkles, ArrowRight, Info } from 'lucide-react'

interface WatchlistItem {
  id: string
  category: string
  title: string
  source: string | null
  relevance: string | null
  status: string
  recommended_next_action: string | null
  is_draft: boolean
}

interface WatchlistReviewProps {
  orgSlug: string
  items: WatchlistItem[]
  contextCompleted: boolean
  onReviewed: () => void
  saving: boolean
}

const categoryLabels: Record<string, string> = {
  opportunity: 'Opportunities to Watch',
  decision: 'Decisions in Play',
  technology_vendor: 'Technologies / Vendors to Watch',
  risk_governance: 'Risk and Governance',
  law_regulatory: 'Law / Regulatory Areas',
  open_question: 'Open Questions',
}

const categoryOrder = ['opportunity', 'decision', 'technology_vendor', 'risk_governance', 'law_regulatory', 'open_question']

export function WatchlistReview({
  orgSlug,
  items,
  contextCompleted,
  onReviewed,
  saving,
}: WatchlistReviewProps) {
  const [reviewed, setReviewed] = useState(false)

  // Group items by category
  const grouped: Record<string, WatchlistItem[]> = {}
  for (const item of items) {
    if (!grouped[item.category]) grouped[item.category] = []
    grouped[item.category].push(item)
  }

  const hasItems = items.length > 0

  function handleMarkReviewed() {
    setReviewed(true)
    onReviewed()
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6 space-y-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Advisor Watchlist
        </h3>
        <p className="text-sm text-muted-foreground">
          This is your starting watchlist. Items drafted from your context intake are labeled as draft and will be calibrated by Subodh. This establishes what deserves attention, not fabricated insights.
        </p>
      </div>

      {!contextCompleted && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            Complete your Context Profile first. The watchlist is seeded from your context.
          </p>
        </div>
      )}

      {hasItems ? (
        <div className="space-y-6">
          {categoryOrder.map(cat => {
            const catItems = grouped[cat]
            if (!catItems || catItems.length === 0) return null
            return (
              <div key={cat} className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">{categoryLabels[cat] || cat}</h4>
                <div className="space-y-2">
                  {catItems.map(item => (
                    <div
                      key={item.id}
                      className={`rounded-lg border p-4 ${
                        item.is_draft
                          ? 'border-primary/20 bg-primary/5'
                          : 'border-border bg-card'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground">{item.title}</p>
                            {item.is_draft && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                                Draft
                              </span>
                            )}
                          </div>
                          {item.recommended_next_action && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Next action: {item.recommended_next_action}
                            </p>
                          )}
                          {item.relevance && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Relevance: {item.relevance}
                            </p>
                          )}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
                          item.status === 'watching' ? 'bg-blue-500/10 text-blue-600' :
                          item.status === 'active' ? 'bg-amber-500/10 text-amber-600' :
                          item.status === 'addressed' ? 'bg-green-500/10 text-green-600' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-secondary/20 p-8 text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            {contextCompleted
              ? 'Your watchlist will be seeded from your context profile. If you do not see items yet, Subodh will calibrate them after reviewing your intake.'
              : 'Complete your Context Profile to seed your watchlist.'}
          </p>
        </div>
      )}

      {/* Mark as reviewed */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          onClick={handleMarkReviewed}
          disabled={saving || !contextCompleted}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          I&apos;ve Reviewed the Watchlist
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
