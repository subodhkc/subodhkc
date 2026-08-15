'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  LogOut, ArrowLeft, Briefcase, Calendar, FileText, Lightbulb, Users,
  Plus, CheckCircle2, Clock, AlertCircle, ChevronRight, Target,
  Boxes, ExternalLink, Loader2,
} from 'lucide-react'
import type { AuthenticatedUser, OrganizationContext } from '@/lib/auth/organization-resolver'
import { getEngagementTypeLabel, getEngagementStatusLabel } from '@/lib/auth/dashboard-types'

interface Engagement {
  id: string
  engagement_type: string
  status: string
  starts_at: string | null
  ends_at: string | null
}

interface OnboardingData {
  id: string
  status: string
  org_description: string | null
  top_outcomes: string | null
  ai_stage: string | null
  decisions_text: string | null
  system_links: string | null
  stakeholders: string | null
  preferred_session_times: string | null
}

interface Decision {
  id: string
  title: string
  description: string | null
  status: string
  decision_owner: string | null
  needed_by: string | null
  decided_at: string | null
  created_at: string
}

interface ProductInfo {
  offeringKey: string
  name: string
  description: string
  externalUrl: string
  learnMoreHref: string
  hasEntitlement: boolean
  requestStatus: string | null
  requestId: string | null
}

interface AdvisoryWorkspaceClientProps {
  user: AuthenticatedUser
  ctx: OrganizationContext
  engagements: Engagement[]
  onboarding: OnboardingData | null
  decisions: Decision[]
  subscriptionStatus: string | null
  billingPeriodStart: string | null
  billingPeriodEnd: string | null
  products?: ProductInfo[]
}

const DECISION_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new: { label: 'New', color: 'bg-blue-500/10 text-blue-700' },
  reviewing: { label: 'Reviewing', color: 'bg-purple-500/10 text-purple-700' },
  evidence_needed: { label: 'Evidence Needed', color: 'bg-amber-500/10 text-amber-700' },
  next_session: { label: 'Next Session', color: 'bg-indigo-500/10 text-indigo-700' },
  decision_ready: { label: 'Decision Ready', color: 'bg-green-500/10 text-green-700' },
  decided: { label: 'Decided', color: 'bg-green-600/10 text-green-800' },
  closed: { label: 'Closed', color: 'bg-gray-500/10 text-gray-600' },
  open: { label: 'Open', color: 'bg-blue-500/10 text-blue-700' },
  deferred: { label: 'Deferred', color: 'bg-gray-500/10 text-gray-600' },
  superseded: { label: 'Superseded', color: 'bg-gray-500/10 text-gray-600' },
}

const AI_STAGES = [
  'Exploring possibilities',
  'Prioritizing opportunities',
  'Evaluating vendors/tools',
  'Building or integrating',
  'Moving something toward production',
  'Already operating AI systems',
  'Several of the above',
]

export function AdvisoryWorkspaceClient({
  user,
  ctx,
  engagements,
  onboarding,
  decisions,
  subscriptionStatus,
  billingPeriodStart,
  billingPeriodEnd,
  products = [],
}: AdvisoryWorkspaceClientProps) {
  const { organization, organizationRole, isPlatformAdmin } = ctx
  const basePath = `/app/${organization.slug}`

  const [showOnboarding, setShowOnboarding] = useState(false)
  const [decisionList, setDecisionList] = useState<Decision[]>(decisions)
  const [showAddDecision, setShowAddDecision] = useState(false)
  const [newDecisionTitle, setNewDecisionTitle] = useState('')
  const [newDecisionDescription, setNewDecisionDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [onboardingComplete, setOnboardingComplete] = useState(
    onboarding?.status === 'completed'
  )

  const activeEngagements = engagements.filter(e => e.status === 'active')
  const pastEngagements = engagements.filter(e => e.status !== 'active')

  const onboardingNotComplete = !onboardingComplete

  async function handleLogout() {
    await fetch('/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  async function handleAddDecision() {
    if (!newDecisionTitle.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/fractional/decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgSlug: organization.slug,
          title: newDecisionTitle,
          description: newDecisionDescription || undefined,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.decision) {
          setDecisionList([...decisionList, data.decision])
        }
        setNewDecisionTitle('')
        setNewDecisionDescription('')
        setShowAddDecision(false)
      }
    } catch (err) {
      console.error('Failed to add decision:', err)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleStatusChange(decisionId: string, newStatus: string) {
    try {
      const res = await fetch('/api/fractional/decisions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgSlug: organization.slug,
          decisionId,
          status: newStatus,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.decision) {
          setDecisionList(decisionList.map(d =>
            d.id === decisionId ? { ...d, ...data.decision } : d
          ))
        }
      }
    } catch (err) {
      console.error('Failed to update decision:', err)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2 min-w-0">
            <Link href="/app" className="font-semibold text-sm flex-shrink-0">SubodhKC</Link>
            <span className="text-muted-foreground text-sm">/</span>
            <Link href={basePath} className="text-sm truncate">{organization.name}</Link>
            <span className="text-muted-foreground text-sm">/</span>
            <span className="text-sm font-medium">Fractional AI Advisor</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 hover:bg-accent rounded-md"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fractional AI Advisor</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Executive AI Advisory for {organization.name}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs bg-green-500/10 text-green-700 px-2 py-0.5 rounded font-medium">
              Active
            </span>
            {subscriptionStatus && (
              <span className="text-xs text-muted-foreground">
                Subscription: {subscriptionStatus}
              </span>
            )}
          </div>
        </div>

        {/* Top section: billing period + core relationship */}
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="border rounded-lg p-4">
            <Calendar className="h-4 w-4 text-muted-foreground mb-2" />
            <h3 className="text-xs font-medium text-muted-foreground">Current billing period</h3>
            <p className="text-sm mt-1">
              {billingPeriodStart && billingPeriodEnd
                ? `${new Date(billingPeriodStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(billingPeriodEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                : 'Active subscription'}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <Briefcase className="h-4 w-4 text-muted-foreground mb-2" />
            <h3 className="text-xs font-medium text-muted-foreground">Core relationship</h3>
            <p className="text-sm mt-1">2 working sessions/month</p>
            <p className="text-xs text-muted-foreground">Priority async advisory + selected artifacts</p>
          </div>
          <div className="border rounded-lg p-4">
            <Users className="h-4 w-4 text-muted-foreground mb-2" />
            <h3 className="text-xs font-medium text-muted-foreground">Manage billing</h3>
            <button
              onClick={async () => {
                const res = await fetch('/api/stripe/portal', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ orgSlug: organization.slug, returnTo: 'advisory' }),
                })
                if (res.ok) {
                  const data = await res.json()
                  if (data.url) window.location.href = data.url
                }
              }}
              className="text-sm text-primary hover:underline mt-1 block"
            >
              Stripe Customer Portal
            </button>
          </div>
        </div>

        {/* Onboarding state */}
        {onboardingNotComplete && !showOnboarding && (
          <section className="border border-primary/30 rounded-lg p-6 bg-primary/5">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h2 className="text-base font-semibold">Help me understand what matters first</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete your advisory context so I can prepare before our first working session. It takes about five minutes.
                </p>
                <button
                  onClick={() => setShowOnboarding(true)}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Complete Setup
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Onboarding form */}
        {showOnboarding && (
          <OnboardingForm
            orgSlug={organization.slug}
            existingData={onboarding}
            onComplete={() => {
              setOnboardingComplete(true)
              setShowOnboarding(false)
            }}
            onCancel={() => setShowOnboarding(false)}
          />
        )}

        {/* Decision Desk */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Target className="h-5 w-5" />
              Decisions in Play
            </h2>
            <button
              onClick={() => setShowAddDecision(!showAddDecision)}
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <Plus className="h-4 w-4" />
              Add a Decision
            </button>
          </div>

          {showAddDecision && (
            <div className="border rounded-lg p-4 mb-4 space-y-3">
              <input
                type="text"
                placeholder="What decision is in front of you?"
                value={newDecisionTitle}
                onChange={e => setNewDecisionTitle(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <textarea
                placeholder="Optional: add context, options, or what is blocking the decision"
                value={newDecisionDescription}
                onChange={e => setNewDecisionDescription(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddDecision}
                  disabled={!newDecisionTitle.trim() || submitting}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Decision'}
                </button>
                <button
                  onClick={() => setShowAddDecision(false)}
                  className="rounded-lg border border-border px-4 py-2 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {decisionList.length > 0 ? (
            <div className="space-y-2">
              {decisionList.map((decision) => {
                const statusInfo = DECISION_STATUS_LABELS[decision.status] || DECISION_STATUS_LABELS.open
                return (
                  <div key={decision.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm">{decision.title}</h3>
                        {decision.description && (
                          <p className="text-xs text-muted-foreground mt-1">{decision.description}</p>
                        )}
                        {decision.needed_by && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Needed by: {new Date(decision.needed_by).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs px-2 py-0.5 rounded ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                        <select
                          value={decision.status}
                          onChange={e => handleStatusChange(decision.id, e.target.value)}
                          className="text-xs border border-border rounded px-1 py-0.5 bg-background"
                        >
                          {Object.entries(DECISION_STATUS_LABELS).map(([key, info]) => (
                            <option key={key} value={key}>{info.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="border rounded-lg p-8 text-center">
              <Target className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No decisions on the table yet. Add the first one to get started.
              </p>
            </div>
          )}
        </section>

        {/* Four smaller areas */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Current Priorities */}
          <section>
            <h2 className="text-base font-semibold mb-3">Current Priorities</h2>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                The 2-4 matters that deserve attention will be tracked here as the engagement progresses.
              </p>
            </div>
          </section>

          {/* Working Sessions */}
          <section>
            <h2 className="text-base font-semibold mb-3">Working Sessions</h2>
            <div className="border rounded-lg p-4">
              {activeEngagements.length > 0 ? (
                <div className="space-y-2">
                  {activeEngagements.map(eng => (
                    <div key={eng.id} className="flex items-center justify-between">
                      <span className="text-sm">{getEngagementTypeLabel(eng.engagement_type)}</span>
                      <span className="text-xs bg-green-500/10 text-green-700 px-2 py-0.5 rounded">
                        {getEngagementStatusLabel(eng.status)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Your first working session will be scheduled after onboarding.
                </p>
              )}
            </div>
          </section>

          {/* Decision Artifacts */}
          <section>
            <h2 className="text-base font-semibold mb-3">Decision Artifacts</h2>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                Decision briefs, vendor comparisons, architecture reviews, and decision records will appear here as they are produced.
              </p>
            </div>
          </section>

          {/* Ask / Send Context */}
          <section>
            <h2 className="text-base font-semibold mb-3">Ask / Send Context</h2>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-3">
                Something changed before our next session? Add a decision, send context, or flag something for review.
              </p>
              <button
                onClick={() => setShowAddDecision(true)}
                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                Add a decision
              </button>
            </div>
          </section>
        </div>

        {/* Products & Platforms */}
        {products.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Boxes className="h-5 w-5 text-primary" />
              Products & Platforms
            </h2>
            <div className="space-y-3">
              {products.map(product => (
                <div key={product.offeringKey} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <Link
                          href={product.learnMoreHref}
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          Learn More
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                        {product.hasEntitlement && (
                          <span className="text-xs bg-green-500/10 text-green-700 px-2 py-0.5 rounded font-medium">
                            Active
                          </span>
                        )}
                        {product.requestStatus === 'requested' && (
                          <span className="text-xs bg-amber-500/10 text-amber-700 px-2 py-0.5 rounded font-medium">
                            Access Requested
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {product.hasEntitlement ? (
                        <a
                          href={product.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          Open Platform
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : product.requestStatus === 'requested' || product.requestStatus === 'approved' ? (
                        <span className="text-xs text-muted-foreground">Pending</span>
                      ) : (
                        <Link
                          href="/contact?subject=product-access"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          Request Access
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Past engagements */}
        {pastEngagements.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3">Past Engagements</h2>
            <div className="space-y-2">
              {pastEngagements.map(eng => (
                <div key={eng.id} className="border rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">{getEngagementTypeLabel(eng.engagement_type)}</span>
                    {eng.ends_at && (
                      <span className="text-xs text-muted-foreground ml-2">
                        Ended {new Date(eng.ends_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                  <span className="text-xs bg-accent px-2 py-0.5 rounded">
                    {getEngagementStatusLabel(eng.status)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        <div>
          <Link href={basePath} className="text-sm text-primary hover:underline inline-flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" />
            Back to {organization.name}
          </Link>
        </div>
      </main>
    </div>
  )
}

// ============================================
// Onboarding Form Component
// ============================================

function OnboardingForm({
  orgSlug,
  existingData,
  onComplete,
  onCancel,
}: {
  orgSlug: string
  existingData: OnboardingData | null
  onComplete: () => void
  onCancel: () => void
}) {
  const [orgDescription, setOrgDescription] = useState(existingData?.org_description || '')
  const [topOutcomes, setTopOutcomes] = useState(existingData?.top_outcomes || '')
  const [aiStage, setAiStage] = useState(existingData?.ai_stage || '')
  const [decisionsText, setDecisionsText] = useState(existingData?.decisions_text || '')
  const [systemLinks, setSystemLinks] = useState(existingData?.system_links || '')
  const [stakeholders, setStakeholders] = useState(existingData?.stakeholders || '')
  const [preferredSessionTimes, setPreferredSessionTimes] = useState(existingData?.preferred_session_times || '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/fractional/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgSlug,
          orgDescription,
          topOutcomes,
          aiStage,
          decisionsText,
          systemLinks,
          stakeholders,
          preferredSessionTimes,
        }),
      })
      if (res.ok) {
        onComplete()
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to submit')
      }
    } catch (err) {
      setError('Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="border rounded-lg p-6 space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Advisory Setup</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Give me enough context that our first working session starts with the decisions, not introductions.
        </p>
      </div>

      {/* Organization context */}
      <div className="space-y-2">
        <label className="text-sm font-medium">What does your organization do?</label>
        <textarea
          value={orgDescription}
          onChange={e => setOrgDescription(e.target.value)}
          rows={2}
          placeholder="Brief description of your organization, industry, and what you do."
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">What are the 1-3 outcomes that matter most right now?</label>
        <textarea
          value={topOutcomes}
          onChange={e => setTopOutcomes(e.target.value)}
          rows={3}
          placeholder="The outcomes that would make this advisory relationship valuable."
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Current AI picture */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Which best describes where you are?</label>
        <div className="space-y-1">
          {AI_STAGES.map(stage => (
            <label key={stage} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="aiStage"
                value={stage}
                checked={aiStage === stage}
                onChange={e => setAiStage(e.target.value)}
                className="h-4 w-4"
              />
              <span className="text-sm">{stage}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Decisions on the table */}
      <div className="space-y-2">
        <label className="text-sm font-medium">What decisions are already in front of you?</label>
        <textarea
          value={decisionsText}
          onChange={e => setDecisionsText(e.target.value)}
          rows={4}
          placeholder="Vendor selection, build vs buy, workflow opportunity, architecture, roadmap, AI strategy, implementation problem, operating model..."
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Systems / documents */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Systems / documents (optional)</label>
        <textarea
          value={systemLinks}
          onChange={e => setSystemLinks(e.target.value)}
          rows={2}
          placeholder="Add links, architecture, proposal, vendor material or notes that would help me understand the decision."
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Stakeholders */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Who else should be part of relevant working sessions?</label>
        <textarea
          value={stakeholders}
          onChange={e => setStakeholders(e.target.value)}
          rows={2}
          placeholder="Names, roles, or teams that should be involved."
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* First session */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Give me a few times that work for your first working session.</label>
        <textarea
          value={preferredSessionTimes}
          onChange={e => setPreferredSessionTimes(e.target.value)}
          rows={3}
          placeholder="e.g. Tuesday Aug 25 10-11am CT, Wednesday Aug 26 2-3pm CT..."
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Complete Setup'}
        </button>
        <button
          onClick={onCancel}
          className="rounded-lg border border-border px-6 py-2 text-sm"
        >
          Cancel
        </button>
      </div>
    </section>
  )
}
