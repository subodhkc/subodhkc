'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  FileText,
  ListChecks,
  Calendar,
  Loader2,
  Save,
  ExternalLink,
  Sparkles,
} from 'lucide-react'
import type { AuthenticatedUser } from '@/lib/auth/organization-resolver'
import { ContextIntakeForm, type ContextProfileData } from './ContextIntakeForm'
import { WatchlistReview } from './WatchlistReview'
import { useAdvisorAnalytics } from '@/components/commercial/useAdvisorAnalytics'

interface SchedulingLink {
  id: string
  scheduling_url: string
  status: string
  scheduled_at: string | null
}

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

interface OnboardingSteps {
  context_intake: string
  watchlist_review: string
  activation_call: string
}

interface AdvisorOnboardingClientProps {
  user: AuthenticatedUser
  orgSlug: string
  orgName: string
  contextProfile: { id: string; status: string; profile_data: ContextProfileData } | null
  watchlistItems: WatchlistItem[]
  schedulingLink: SchedulingLink | null
  onboardingSteps: OnboardingSteps
  onboardingComplete: boolean
}

type Step = 'context_intake' | 'watchlist_review' | 'activation_call'

const stepConfig: { key: Step; label: string; icon: typeof FileText; desc: string }[] = [
  { key: 'context_intake', label: 'Give me the context', icon: FileText, desc: 'Complete your Organizational AI Context Profile. 5 to 10 minutes.' },
  { key: 'watchlist_review', label: 'Build your Watchlist', icon: ListChecks, desc: 'Review and calibrate what we should watch.' },
  { key: 'activation_call', label: 'Meet your advisor', icon: Calendar, desc: 'Schedule your complimentary 15-minute Activation Call. We hold a 30-minute slot so we have room if the conversation needs it.' },
]

export function AdvisorOnboardingClient({
  user,
  orgSlug,
  orgName,
  contextProfile,
  watchlistItems,
  schedulingLink,
  onboardingSteps,
  onboardingComplete,
}: AdvisorOnboardingClientProps) {
  const [activeStep, setActiveStep] = useState<Step>(
    onboardingSteps.context_intake !== 'completed' ? 'context_intake' :
    onboardingSteps.watchlist_review !== 'completed' ? 'watchlist_review' :
    'activation_call'
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profileStatus, setProfileStatus] = useState(contextProfile?.status || 'not_started')
  const [steps, setSteps] = useState<OnboardingSteps>(onboardingSteps)
  const { track } = useAdvisorAnalytics()

  const deskUrl = `/app/${orgSlug}/advisor-desk`

  const handleSaveProfile = useCallback(async (data: ContextProfileData, status: 'in_progress' | 'completed') => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/commercial/advisor-desk/context-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgSlug, profileData: data, status }),
      })
      const result = await res.json()
      if (result.profile) {
        setProfileStatus(result.profile.status)
        if (status === 'completed') {
          setSteps(prev => ({ ...prev, context_intake: 'completed' }))
          // Auto-advance to watchlist
          setActiveStep('watchlist_review')
        }
      } else {
        setError(result.error || 'Failed to save')
      }
    } catch {
      setError('Network error. Please try again.')
    }
    setSaving(false)
  }, [orgSlug])

  const handleWatchlistReviewed = useCallback(async () => {
    setSaving(true)
    setError(null)
    try {
      // Update lifecycle step
      const res = await fetch('/api/commercial/advisor-desk/onboarding-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgSlug, step: 'watchlist_review', status: 'completed' }),
      })
      if (res.ok) {
        setSteps(prev => ({ ...prev, watchlist_review: 'completed' }))
        setActiveStep('activation_call')
      }
    } catch {
      setError('Network error. Please try again.')
    }
    setSaving(false)
  }, [orgSlug])

  const handleActivationScheduled = useCallback(async () => {
    // "Schedule later" defers activation - does not complete it.
    // Service remains usable, but activation meeting is not marked complete.
    try {
      const res = await fetch('/api/commercial/advisor-desk/onboarding-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgSlug, step: 'activation_call', status: 'deferred' }),
      })
      if (res.ok) {
        setSteps(prev => ({ ...prev, activation_call: 'deferred' }))
      }
    } catch {
      // Non-blocking
    }
  }, [orgSlug])

  const stepStatus = (step: Step) => steps[step]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={deskUrl} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold">Advisor Desk Onboarding</h1>
              <p className="text-xs text-muted-foreground">{orgName}</p>
            </div>
          </div>
          <Link
            href={deskUrl}
            className="text-sm text-primary hover:underline"
          >
            Go to My Advisor Desk
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold">Your AI Advisor Desk is active.</h2>
          <p className="text-muted-foreground">Let&apos;s get the context right so I can watch what matters.</p>
        </div>

        {/* Progress checklist */}
        <div className="grid md:grid-cols-3 gap-4">
          {stepConfig.map((step) => {
            const Icon = step.icon
            const status = stepStatus(step.key)
            const isActive = activeStep === step.key
            return (
              <button
                key={step.key}
                onClick={() => setActiveStep(step.key)}
                className={`text-left rounded-xl border p-4 transition-all ${
                  isActive
                    ? 'border-primary bg-primary/5'
                    : status === 'completed'
                    ? 'border-green-500/30 bg-green-500/5'
                    : 'border-border hover:border-primary/30'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {status === 'completed' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-sm font-semibold">{step.label}</h3>
                <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
              </button>
            )
          })}
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Step content */}
        {activeStep === 'context_intake' && (
          <ContextIntakeForm
            initialData={contextProfile?.profile_data || null}
            currentStatus={profileStatus}
            onSave={(data) => handleSaveProfile(data, 'in_progress')}
            onComplete={(data) => handleSaveProfile(data, 'completed')}
            saving={saving}
          />
        )}

        {activeStep === 'watchlist_review' && (
          <WatchlistReview
            orgSlug={orgSlug}
            items={watchlistItems}
            contextCompleted={steps.context_intake === 'completed'}
            onReviewed={handleWatchlistReviewed}
            saving={saving}
          />
        )}

        {activeStep === 'activation_call' && (
          <ActivationCallStep
            orgSlug={orgSlug}
            orgName={orgName}
            schedulingLink={schedulingLink}
            onScheduled={handleActivationScheduled}
          />
        )}

        {/* Completion state - service is usable after context + watchlist, activation can be deferred */}
        {onboardingComplete || (steps.context_intake === 'completed' && steps.watchlist_review === 'completed' && (steps.activation_call === 'completed' || steps.activation_call === 'deferred' || steps.activation_call === 'scheduled')) ? (
          <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-6 text-center space-y-3">
            <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto" />
            <h3 className="text-lg font-semibold">Your Advisor Desk is ready.</h3>
            <p className="text-sm text-muted-foreground">
              {steps.activation_call === 'completed'
                ? 'Your Advisor Desk is set up. I have your context, your watchlist is calibrated, and your activation call is complete.'
                : 'Your Advisor Desk is set up. I have your context and your watchlist is calibrated. Schedule your activation call when ready.'}
            </p>
            <Link
              href={deskUrl}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Go to My Advisor Desk
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  )
}

// ============================================
// Activation Call Step
// ============================================
function ActivationCallStep({
  orgSlug,
  orgName,
  schedulingLink,
  onScheduled,
}: {
  orgSlug: string
  orgName: string
  schedulingLink: SchedulingLink | null
  onScheduled: () => void
}) {
  const { track } = useAdvisorAnalytics()
  // Default Calendly link for activation calls (15 min)
  // This uses Subodh's existing Calendly setup
  const defaultCalendlyUrl = 'https://calendly.com/subodhkc/30min'
  const calendlyUrl = schedulingLink?.scheduling_url || defaultCalendlyUrl
  const isScheduled = schedulingLink?.status === 'scheduled' || schedulingLink?.status === 'completed'

  function handleScheduleClick() {
    // Clicking the scheduling link only tracks that scheduling was started.
    // It does NOT mark activation as scheduled or completed.
    // A confirmed booking (via webhook or manual advisor action) marks 'scheduled'.
    // A completed meeting marks 'completed'.
    track('advisor_activation_schedule_started')
  }

  function handleScheduleLater() {
    // "Schedule later" defers activation - does not complete it.
    track('advisor_activation_deferred')
    onScheduled()
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">Schedule your 15-minute Advisor Activation Call</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Your context gives me the starting point. This short call is for calibrating the watchlist, clarifying the decisions already in play, and making sure I am watching the right things. The meeting is 15 minutes. I hold a 30-minute slot on the calendar so we have room if the conversation needs it.
        </p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />15-minute meeting, 30-minute slot held as padding</p>
          <p className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />Complimentary, included with your subscription</p>
          <p className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />Does not count as a paid AI Work Order</p>
          <p className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />Strongly recommended but not required to access the service</p>
        </div>

        {isScheduled ? (
          <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <p className="text-sm font-medium text-foreground">
                {schedulingLink?.status === 'completed' ? 'Activation call completed.' : 'Activation call scheduled.'}
              </p>
            </div>
            {schedulingLink?.scheduled_at && (
              <p className="text-xs text-muted-foreground">
                {new Date(schedulingLink.scheduled_at).toLocaleString('en-US', {
                  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
                })}
              </p>
            )}
            {schedulingLink?.status !== 'completed' && (
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                Reschedule
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleScheduleClick}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Calendar className="h-4 w-4" />
              Schedule Activation Call
              <ExternalLink className="h-3 w-3" />
            </a>
            <div>
              <button
                onClick={handleScheduleLater}
                className="text-xs text-muted-foreground hover:text-foreground underline"
              >
                I&apos;ll schedule later
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
