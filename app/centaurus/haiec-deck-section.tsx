'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Download, Eye } from 'lucide-react'
import { useCallback } from 'react'

const DECK_PATH = '/centaurus/haiec-technical-architecture-defensibility-brief.pptx'
const DECK_GSLIDES_URL = 'https://docs.google.com/presentation/d/1gZiggHG99JgkjSE6yADWVhIkIOYedb_q/edit?usp=sharing&ouid=111506782395919709798&rtpof=true&sd=true'

function trackDeckClick(action: 'view' | 'download') {
  const sessionId = typeof window !== 'undefined'
    ? sessionStorage.getItem('sk_analytics_session') ?? ''
    : ''

  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'click',
      path: '/centaurus',
      sessionId,
      meta: {
        label: 'centaurus_haiec_technical_deck_clicked',
        action,
        source: 'centaurus_resource_card',
      },
    }),
  }).catch(() => {})
}

export function HaiecDeckSection() {
  const handleView = useCallback(() => {
    trackDeckClick('view')
  }, [])

  const handleDownload = useCallback(() => {
    trackDeckClick('download')
  }, [])

  return (
    <div className="border-t border-slate-200 pt-8">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
        Technical Diligence Deck
      </div>
      <h2 className="text-lg font-semibold text-slate-900 mb-2">
        HAIEC Technical Architecture &amp; Defensibility Brief
      </h2>
      <p className="text-sm text-slate-600 mb-4">
        15-slide technical brief covering platform architecture, evidence lifecycle,
        framework mapping, decision pipeline, and strategic defensibility.
      </p>

      {/* Meta info */}
      <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-slate-500">
        <span>15 slides (12 + 3 appendix)</span>
        <span className="text-slate-300">|</span>
        <span>PowerPoint (.pptx)</span>
        <span className="text-slate-300">|</span>
        <span>v1.0</span>
        <span className="text-slate-300">|</span>
        <span>Confidential</span>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href={DECK_PATH}
          download="haiec-technical-architecture-defensibility-brief.pptx"
          onClick={handleDownload}
        >
          <Button className="gap-2 bg-slate-900 text-white hover:bg-slate-700 border border-slate-900">
            <Download className="h-4 w-4" />
            Download Technical Deck
          </Button>
        </Link>
        <a
          href={DECK_GSLIDES_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleView}
        >
          <Button variant="outline" className="gap-2 border-slate-400 text-slate-900 hover:bg-slate-100">
            <Eye className="h-4 w-4" />
            View in Browser
          </Button>
        </a>
      </div>

      <p className="text-xs text-slate-500 mt-4">
        Covers: Static analysis (91 Semgrep + 15 TS + 82 rulepack) · Runtime testing (269 templates) ·
        Evidence architecture · 13 compliance frameworks · Decision Pipeline (DIS) ·
        Compliance Twin · Kill Switch
      </p>
    </div>
  )
}
