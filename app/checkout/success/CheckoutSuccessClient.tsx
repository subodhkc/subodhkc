'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, Clock, AlertCircle, ArrowRight, FileText, ListChecks, Calendar } from 'lucide-react'

interface CheckoutSuccessClientProps {
  status: 'success' | 'pending' | 'error'
  offerName: string
  workspaceUrl: string
  message: string
  offerKey?: string
  orgSlug?: string
  workOrderNumber?: string
}

export default function CheckoutSuccessClient({
  status,
  offerName,
  workspaceUrl,
  message,
  offerKey,
  orgSlug,
  workOrderNumber,
}: CheckoutSuccessClientProps) {
  const autoRedirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [redirecting, setRedirecting] = useState(false)

  const isAdvisorDesk = offerKey === 'ai_advisor_desk'
  const isFractional = offerKey === 'fractional_ai_advisor'
  const onboardingUrl = orgSlug ? `/app/${orgSlug}/advisor-desk/onboarding` : workspaceUrl

  useEffect(() => {
    if (status === 'success' && !isAdvisorDesk && !isFractional && workspaceUrl) {
      // For offers without a dedicated onboarding flow, auto-redirect after 3 seconds
      autoRedirectTimer.current = setTimeout(() => {
        window.location.href = workspaceUrl
      }, 3000)
    }
    return () => {
      if (autoRedirectTimer.current) clearTimeout(autoRedirectTimer.current)
    }
  }, [status, workspaceUrl, isAdvisorDesk, isFractional])

  const icon =
    status === 'success' ? <CheckCircle2 className="h-12 w-12 text-green-500" /> :
    status === 'pending' ? <Clock className="h-12 w-12 text-amber-500" /> :
    <AlertCircle className="h-12 w-12 text-red-500" />

  const title =
    status === 'success' && isAdvisorDesk ? 'Your AI Advisor Desk is active.' :
    status === 'success' && isFractional ? 'Your Fractional AI Advisor engagement is active.' :
    status === 'success' ? 'You are in.' :
    status === 'pending' ? 'Payment received.' :
    'Something went wrong.'

  const subtitle =
    status === 'success' && isFractional
      ? 'Let\u2019s get the context right and schedule the first sessions.'
      : status === 'success' && offerName
      ? `Your ${offerName} relationship is active.`
      : status === 'pending' && offerName
      ? `Your ${offerName} purchase is being confirmed.`
      : ''

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="max-w-lg w-full text-center space-y-6">
        <div className="flex justify-center">{icon}</div>

        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>

        {message && (
          <p className="text-sm text-muted-foreground bg-secondary/30 rounded-lg p-4">{message}</p>
        )}

        {/* Advisor Desk: 3-step onboarding checklist */}
        {status === 'success' && isAdvisorDesk && (
          <div className="text-left space-y-4 bg-secondary/20 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-center">Get started in 3 steps</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">1</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium text-foreground">Give me the context</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Complete your Organizational AI Context Profile. 5 to 10 minutes.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">2</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <ListChecks className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium text-foreground">Build your Watchlist</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Review and calibrate what we should watch.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">3</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium text-foreground">Meet your advisor</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Schedule your complimentary 15-minute Activation Call. 30-minute slot held as padding.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fractional: 4-step onboarding checklist */}
        {status === 'success' && isFractional && (
          <div className="text-left space-y-4 bg-secondary/20 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-center">Get started in 4 steps</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">1</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium text-foreground">Complete organizational context</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Strategy, AI portfolio, decisions in play, architecture, governance, roadmap, stakeholders.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">2</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <ListChecks className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium text-foreground">Identify the first decisions in play</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">1 to 3 immediate decisions with owners, deadlines, and significance.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">3</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium text-foreground">Schedule your Activation Call</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">20 minutes, complimentary. Validate priorities, confirm decisions, establish cadence.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">4</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium text-foreground">Schedule your first Working Session</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">60 minutes. The first real working session on your priorities.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {status === 'success' && !isAdvisorDesk && !isFractional && (
          <p className="text-xs text-muted-foreground">
            Redirecting to your workspace automatically...
          </p>
        )}

        <div className="flex flex-col gap-3 pt-4">
          {status === 'success' && isAdvisorDesk ? (
            <Link
              href={onboardingUrl}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Go to My Advisor Desk
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : status === 'success' && isFractional ? (
            <Link
              href={workspaceUrl}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Open Advisory Workspace
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : workspaceUrl && status !== 'error' ? (
            <Link
              href={workspaceUrl}
              onClick={() => setRedirecting(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {redirecting ? 'Redirecting...' : 'Go to Workspace'}
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : null}
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
