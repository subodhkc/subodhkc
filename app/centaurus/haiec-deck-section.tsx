'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Shield, Download, FileText } from 'lucide-react'
import { useCallback } from 'react'

const DECK_PATH = '/centaurus/haiec-technical-architecture-defensibility-brief.pptx'

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
    <div className="border-t pt-6">
      <h3 className="font-semibold text-slate-900 mb-1">HAIEC Technical Architecture Brief</h3>
      <p className="text-xs text-slate-500 mb-4">
        Evidence-native AI security validation platform — technical diligence deck
      </p>

      <Card className="border-emerald-200 bg-emerald-50/50 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600/10 flex items-center justify-center flex-shrink-0">
              <Shield className="h-5 w-5 text-emerald-700" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 mb-1">
                Technical Diligence Deck
              </div>
              <CardTitle className="text-base text-slate-900">
                HAIEC Technical Architecture &amp; Defensibility Brief
              </CardTitle>
              <CardDescription className="text-slate-600 text-sm mt-1">
                14-slide technical brief covering platform architecture, evidence lifecycle,
                framework mapping, decision pipeline, and strategic defensibility.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2 mb-4 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1">
              <FileText className="h-3 w-3" />
              14 slides (11 + 3 appendix)
            </span>
            <span className="text-slate-300">|</span>
            <span>Format: PowerPoint (.pptx)</span>
            <span className="text-slate-300">|</span>
            <span>Version: v1.0</span>
            <span className="text-slate-300">|</span>
            <span>Confidential</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={DECK_PATH}
              download="haiec-technical-architecture-defensibility-brief.pptx"
              className="flex-1"
              onClick={handleDownload}
            >
              <Button size="lg" className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700">
                <Download className="h-5 w-5" />
                Download Technical Deck
              </Button>
            </Link>
            <Link
              href={DECK_PATH}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
              onClick={handleView}
            >
              <Button size="lg" variant="outline" className="w-full gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                <FileText className="h-5 w-5" />
                View in Browser
              </Button>
            </Link>
          </div>

          <p className="text-xs text-slate-500 mt-3">
            Covers: Static analysis (188 rules) · Runtime testing (269 templates) ·
            Evidence architecture · 13 compliance frameworks · Decision Pipeline (DIS) ·
            Compliance Twin · Kill Switch
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
