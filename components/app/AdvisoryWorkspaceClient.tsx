'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  LogOut, ArrowLeft, ArrowRight, Briefcase, Calendar, FileText, Lightbulb, Users,
  Plus, CheckCircle2, Clock, AlertCircle, ChevronRight, Target,
  Boxes, ExternalLink, Loader2,
  Compass, ClipboardList, Building2, FlaskConical, TrendingUp,
  AlertTriangle, Handshake, Layers, History, Award, ListChecks,
  Download, Send, Zap, MessageSquare,
} from 'lucide-react'
import type { AuthenticatedUser, OrganizationContext } from '@/lib/auth/organization-resolver'
import { getEngagementTypeLabel, getEngagementStatusLabel } from '@/lib/auth/dashboard-types'
import { MemberToolsSection } from './MemberToolsSection'

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

interface IncludedEntitlement {
  id: string
  tierOrPlan: string
  seats: number
  credits: number | null
  entitlementStatus: string
  provisioningStatus: string
  externalUserId: string | null
  provisioningError: string | null
  sourceOfferKey: string
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
  includedEntitlement: IncludedEntitlement | null
}

interface MemberToolsIncluded {
  accessLevel: string
  entitlementStatus: string
}

interface AdvisoryWorkspaceClientProps {
  user: AuthenticatedUser
  ctx: OrganizationContext
  /** S4: Fractional access state — 'active' (RW), 'readonly' (30-day window), 'expired' (deny) */
  fractionalAccessState?: 'active' | 'readonly' | 'expired'
  /** S4: Human-readable access message (e.g. read-only expiry date) */
  fractionalAccessMessage?: string | null
  engagements: Engagement[]
  onboarding: OnboardingData | null
  decisions: Decision[]
  subscriptionStatus: string | null
  billingPeriodStart: string | null
  billingPeriodEnd: string | null
  products?: ProductInfo[]
  memberToolsIncluded?: MemberToolsIncluded | null
  intakeRecords?: any[]
  opportunities?: any[]
  evidence?: any[]
  workingSessions?: any[]
  monthlyBriefs?: any[]
  priorities?: any[]
  actions?: any[]
  artifacts?: any[]
  outcomes?: any[]
  advisorAffiliations?: any[]
  sessionUsage?: {
    currentMonth: string
    includedSessions: number
    usedSessions: number
    rolledOverFromPrev: number
    availableSessions: number
    maxRollover: number
  } | null
  workOrders?: Array<{
    id: string
    workOrderNumber: string
    title: string
    workType: string
    status: string
    statusLabel: string
    desiredOutcome: string | null
    createdAt: string
  }>
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

// Bring Something to the Desk — 8 intake types
const intakeTypes = [
  { icon: MessageSquare, label: 'Ask a Question', value: 'ask_question', description: 'Get a point of view on an AI decision.' },
  { icon: Compass, label: 'Explore an Opportunity', value: 'explore_opportunity', description: 'Something worth investigating.' },
  { icon: Target, label: 'Make/Review a Decision', value: 'review_decision', description: 'A decision is on the table.' },
  { icon: Building2, label: 'Review a Vendor', value: 'review_vendor', description: 'Evaluating an AI tool or vendor.' },
  { icon: Layers, label: 'Review a System or Architecture', value: 'review_system', description: 'Pressure-test a design or system.' },
  { icon: Handshake, label: 'Explore a Partnership', value: 'explore_partnership', description: 'A partnership or external opportunity.' },
  { icon: FileText, label: 'Share a Report/Evidence', value: 'share_report', description: 'Send context or research.' },
  { icon: AlertCircle, label: 'Something Changed', value: 'something_changed', description: 'A shift that affects priorities.' },
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
  memberToolsIncluded,
  intakeRecords = [],
  opportunities = [],
  evidence = [],
  workingSessions = [],
  monthlyBriefs = [],
  priorities = [],
  actions = [],
  artifacts = [],
  outcomes = [],
  advisorAffiliations = [],
  sessionUsage = null,
  workOrders = [],
}: AdvisoryWorkspaceClientProps) {
  const { organization, organizationRole, isPlatformAdmin } = ctx
  const basePath = `/app/${organization.slug}`

  const [showOnboarding, setShowOnboarding] = useState(false)
  const [decisionList, setDecisionList] = useState<Decision[]>(decisions)
  const [showAddDecision, setShowAddDecision] = useState(false)
  const [newDecisionTitle, setNewDecisionTitle] = useState('')
  const [newDecisionDescription, setNewDecisionDescription] = useState('')
  const [intakeType, setIntakeType] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [activatingProduct, setActivatingProduct] = useState<string | null>(null)
  const [productList, setProductList] = useState<ProductInfo[]>(products)

  // Operating records state
  const [intakeList, setIntakeList] = useState(intakeRecords)
  const [opportunityList, setOpportunityList] = useState(opportunities)
  const [evidenceList, setEvidenceList] = useState(evidence)
  const [sessionList, setSessionList] = useState(workingSessions)
  const [briefList, setBriefList] = useState(monthlyBriefs)
  const [priorityList, setPriorityList] = useState(priorities)
  const [actionList, setActionList] = useState(actions)
  const [artifactList, setArtifactList] = useState(artifacts)
  const [outcomeList, setOutcomeList] = useState(outcomes)
  const [affiliationList, setAffiliationList] = useState(advisorAffiliations)
  const [recordSubmitting, setRecordSubmitting] = useState(false)
  const [showAddRecord, setShowAddRecord] = useState<string | null>(null)

  // Scheduling links state
  const [schedulingLinks, setSchedulingLinks] = useState<any[]>([])
  const [schedulingLoading, setSchedulingLoading] = useState(true)

  // Fetch scheduling links on mount
  useEffect(() => {
    let cancelled = false
    async function fetchSchedulingLinks() {
      try {
        const res = await fetch(`/api/scheduling/links?orgSlug=${encodeURIComponent(organization.slug)}`)
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled) {
          setSchedulingLinks(data.links || [])
        }
      } catch {
        // Silently fail
      } finally {
        if (!cancelled) setSchedulingLoading(false)
      }
    }
    fetchSchedulingLinks()
    return () => { cancelled = true }
  }, [organization.slug])

  // Determine Fractional access state from entitlements
  const fractionalEnt = ctx.entitlements.find(
    e => e.offering_key === 'fractional_ai_advisor' || e.offering_key === 'advisory'
  )
  const isReadOnly = fractionalEnt?.effective_status === 'expired' && fractionalEnt?.valid_until
  const readonlyUntilDate = isReadOnly && fractionalEnt?.valid_until
    ? new Date(new Date(fractionalEnt.valid_until).getTime() + 30 * 24 * 60 * 60 * 1000)
    : null
  const showReadOnlyBanner = isReadOnly && readonlyUntilDate && new Date() <= readonlyUntilDate
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

  async function handleExport() {
    setExporting(true)
    try {
      const res = await fetch(`/api/fractional/export?orgSlug=${encodeURIComponent(organization.slug)}`)
      if (res.ok) {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = window.document.createElement('a')
        a.href = url
        a.download = `advisory-workspace-${organization.slug}-${new Date().toISOString().split('T')[0]}.json`
        window.document.body.appendChild(a)
        a.click()
        window.document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }
    } catch (err) {
      console.error('Export failed:', err)
    }
    setExporting(false)
  }

  async function handleActivateProduct(offeringKey: string) {
    setActivatingProduct(offeringKey)
    try {
      const res = await fetch('/api/included-products/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgSlug: organization.slug, productKey: offeringKey }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setProductList(prev => prev.map(p =>
          p.offeringKey === offeringKey && p.includedEntitlement
            ? {
                ...p,
                includedEntitlement: {
                  ...p.includedEntitlement,
                  entitlementStatus: 'active',
                  provisioningStatus: 'provisioned',
                  externalUserId: data.externalUserId || p.includedEntitlement.externalUserId,
                }
              }
            : p
        ))
      } else if (data.requiresManualAction) {
        setProductList(prev => prev.map(p =>
          p.offeringKey === offeringKey && p.includedEntitlement
            ? {
                ...p,
                includedEntitlement: {
                  ...p.includedEntitlement,
                  entitlementStatus: 'provisioning_failed',
                  provisioningStatus: 'failed',
                  provisioningError: data.message || 'Manual activation required',
                }
              }
            : p
        ))
      }
    } catch (err) {
      console.error('Failed to activate product:', err)
    }
    setActivatingProduct(null)
  }

  async function handleCreateRecord(
    type: string,
    data: Record<string, unknown>,
    onSuccess?: (record: any) => void
  ) {
    setRecordSubmitting(true)
    try {
      const res = await fetch('/api/fractional/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgSlug: organization.slug,
          type,
          action: 'create',
          data,
        }),
      })
      const result = await res.json()
      if (res.ok && result.success && result.record) {
        // Update the appropriate list
        switch (type) {
          case 'intake': setIntakeList(prev => [result.record, ...prev]); break
          case 'opportunities': setOpportunityList(prev => [result.record, ...prev]); break
          case 'evidence': setEvidenceList(prev => [result.record, ...prev]); break
          case 'sessions': setSessionList(prev => [result.record, ...prev]); break
          case 'briefs': setBriefList(prev => [result.record, ...prev]); break
          case 'priorities': setPriorityList(prev => [...prev, result.record]); break
          case 'actions': setActionList(prev => [result.record, ...prev]); break
          case 'artifacts': setArtifactList(prev => [result.record, ...prev]); break
          case 'outcomes': setOutcomeList(prev => [result.record, ...prev]); break
          case 'affiliations': setAffiliationList(prev => [result.record, ...prev]); break
        }
        onSuccess?.(result.record)
      }
    } catch (err) {
      console.error('Failed to create record:', err)
    }
    setRecordSubmitting(false)
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
        {/* Read-only banner for post-cancellation 30-day window */}
        {showReadOnlyBanner && (
          <div className="border border-amber-500/30 bg-amber-500/5 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-amber-700">Fractional Engagement Ended — Read-Only Access</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Your Fractional engagement has ended. Your workspace remains available for read/download access until{' '}
                  <strong>{readonlyUntilDate?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>.
                  New advisor requests, decisions, and edits are disabled. Export is available below.
                </p>
              </div>
            </div>
          </div>
        )}

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

        {/* Compact status line — replaces 3-card grid */}
        <div className="flex items-center gap-3 flex-wrap text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {billingPeriodStart && billingPeriodEnd
              ? `${new Date(billingPeriodStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(billingPeriodEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
              : 'Active subscription'}
          </span>
          <span className="text-muted-foreground/40">·</span>
          <span>2 working sessions/month</span>
        </div>

        {/* 1b. Scheduling */}
        <section>
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            Scheduling
          </h2>
          <div className="border rounded-lg p-4 space-y-3">
            {schedulingLoading ? (
              <p className="text-sm text-muted-foreground">Loading scheduling information...</p>
            ) : (() => {
              const activationLinks = schedulingLinks.filter(
                (l: any) => l.link_type === 'activation_call'
              )
              const pendingActivation = activationLinks.find(
                (l: any) => l.status === 'pending'
              )
              const scheduledActivation = activationLinks.find(
                (l: any) => l.status === 'scheduled'
              )
              const completedActivation = activationLinks.find(
                (l: any) => l.status === 'completed'
              )
              const scheduledWorkingSessions = schedulingLinks
                .filter(
                  (l: any) =>
                    l.link_type === 'working_session' && l.status === 'scheduled'
                )
                .sort(
                  (a: any, b: any) =>
                    new Date(a.scheduled_at).getTime() -
                    new Date(b.scheduled_at).getTime()
                )
              const nextWorkingSession = scheduledWorkingSessions[0]

              return (
                <div className="space-y-3">
                  {/* Activation Call states */}
                  {completedActivation ? (
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Activation Call completed</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Your activation call has been completed. Working sessions can now be scheduled.
                        </p>
                      </div>
                    </div>
                  ) : scheduledActivation ? (
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Activation Call scheduled</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(scheduledActivation.scheduled_at).toLocaleString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </p>
                        <a
                          href={scheduledActivation.scheduling_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
                        >
                          Reschedule
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  ) : pendingActivation ? (
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Schedule Your Activation Call</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Book your activation call to kick off the advisory relationship.
                        </p>
                        <a
                          href={pendingActivation.scheduling_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 mt-2"
                        >
                          Schedule Your Activation Call
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  ) : null}

                  {/* Next Working Session */}
                  {nextWorkingSession && (
                    <div className="flex items-start gap-3 pt-3 border-t">
                      <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Next Working Session</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(nextWorkingSession.scheduled_at).toLocaleString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* If activation is done but no working session scheduled, offer self-scheduling */}
                  {completedActivation && !nextWorkingSession && (
                    <div className="pt-3 border-t">
                      <p className="text-sm font-medium">Schedule Your Next Working Session</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        60 minutes. Book directly.
                      </p>
                      <a
                        href="https://calendly.com/subodhkc/30min"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 border border-border text-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-accent/10 mt-2"
                      >
                        Schedule Working Session
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}

                  {!pendingActivation && !scheduledActivation && !completedActivation && !nextWorkingSession && (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium">Schedule Your Activation Call</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          20 minutes, complimentary. Validate priorities, confirm decisions, establish cadence.
                        </p>
                        <a
                          href="https://calendly.com/subodhkc/30min"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 mt-2"
                        >
                          Schedule Activation Call
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <div className="pt-3 border-t">
                        <p className="text-sm font-medium">Schedule Your First Working Session</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          60 minutes. The first real working session on your priorities.
                        </p>
                        <a
                          href="https://calendly.com/subodhkc/30min"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 border border-border text-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-accent/10 mt-2"
                        >
                          Schedule Working Session
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )
            })()}
          </div>
        </section>

        {/* TODAY — operational view */}
        <h2 className="text-xl font-bold tracking-tight pt-2">Today</h2>

        {/* 2. What Needs Your Attention */}
        <section>
          <h3 className="text-base font-semibold flex items-center gap-2 mb-3">
            <AlertCircle className="h-4 w-4 text-primary" />
            Needs Your Attention
          </h3>
          <div className="border rounded-lg p-4 space-y-3">
            {(() => {
              const openDecisions = decisionList.filter(d => d.status === 'open')
              const newIntake = intakeList.filter((r: any) => r.status === 'new')
              const now = new Date()
              const pastDueActions = actionList.filter((a: any) => a.status === 'open' && a.due_date && new Date(a.due_date) < now)
              const total = openDecisions.length + newIntake.length + pastDueActions.length
              if (total === 0) {
                return <p className="text-sm text-muted-foreground">Nothing needs your attention right now. Open decisions, new intake records, and past-due actions will appear here.</p>
              }
              return (
                <div className="space-y-3">
                  {openDecisions.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Open Decisions ({openDecisions.length})</p>
                      {openDecisions.map(d => (
                        <div key={d.id} className="flex items-start justify-between gap-2 py-1">
                          <p className="text-sm font-medium">{d.title}</p>
                          <span className="text-xs bg-blue-500/10 text-blue-700 px-2 py-0.5 rounded flex-shrink-0">Open</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {newIntake.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">New Intake ({newIntake.length})</p>
                      {newIntake.map((r: any) => (
                        <div key={r.id} className="flex items-start justify-between gap-2 py-1">
                          <p className="text-sm font-medium">{r.title}</p>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded flex-shrink-0">New</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {pastDueActions.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Past Due Actions ({pastDueActions.length})</p>
                      {pastDueActions.map((a: any) => (
                        <div key={a.id} className="flex items-start justify-between gap-2 py-1">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{a.title}</p>
                            {a.due_date && <p className="text-xs text-muted-foreground mt-0.5">Due: {a.due_date}</p>}
                          </div>
                          <span className="text-xs bg-red-500/10 text-red-700 px-2 py-0.5 rounded flex-shrink-0">Past Due</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })()}
          </div>
        </section>

        {/* Current Work Orders — part of Today view */}
        {workOrders.length > 0 && (
          <section>
            <h3 className="text-base font-semibold flex items-center gap-2 mb-3 justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Work Orders
              </span>
              <Link href={`${basePath}/work-orders`} className="text-xs text-primary hover:underline">
                View all
              </Link>
            </h3>
            <div className="border border-border rounded-lg divide-y divide-border">
              {workOrders.slice(0, 5).map(wo => (
                <Link
                  key={wo.id}
                  href={`${basePath}/work-orders/${wo.id}`}
                  className={`block p-3 hover:bg-accent/5 transition-colors group ${
                    wo.status === 'needs_client_input' ? 'bg-orange-50/50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70">{wo.workOrderNumber}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          wo.status === 'needs_client_input' ? 'bg-orange-500/10 text-orange-600' :
                          wo.status === 'delivered' || wo.status === 'completed' ? 'bg-green-500/10 text-green-600' :
                          wo.status === 'in_progress' || wo.status === 'in_review' ? 'bg-blue-500/10 text-blue-600' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {wo.statusLabel}
                        </span>
                      </div>
                      <p className="text-sm font-medium truncate mt-1">{wo.title}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 3. Decisions in Play (Decision Desk) */}
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

        {/* 4. Opportunities in Play */}
        <section>
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 justify-between">
            <span className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-primary" />
              Opportunities in Play
            </span>
            {!showReadOnlyBanner && (
              <button onClick={() => setShowAddRecord('opportunities')} className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                <Plus className="h-3 w-3" /> Add
              </button>
            )}
          </h2>
          <div className="border rounded-lg p-4">
            {(() => {
              const activeOpportunities = opportunityList.filter((o: any) => !['closed', 'rejected', 'deferred'].includes(o.status))
              if (activeOpportunities.length > 0) {
                return (
                  <div className="space-y-2">
                    {activeOpportunities.map((o: any) => (
                      <div key={o.id} className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{o.opportunity}</p>
                          {o.why_it_matters && <p className="text-xs text-muted-foreground mt-0.5">{o.why_it_matters}</p>}
                        </div>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded flex-shrink-0">{o.status}</span>
                      </div>
                    ))}
                  </div>
                )
              }
              return (
                <p className="text-sm text-muted-foreground">
                  No opportunities in play right now. AI possibilities and improvement opportunities identified during the engagement will appear here.
                </p>
              )
            })()}
          </div>
        </section>

        {/* 5. Bring Something to the Desk */}
        <section className={`border rounded-lg p-6 ${showReadOnlyBanner ? 'border-muted bg-muted/10 opacity-60' : 'border-primary/30 bg-primary/5'}`}>
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
            <Zap className="h-5 w-5 text-primary" />
            Bring Something to the Desk
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            {showReadOnlyBanner
              ? 'Workspace is in read-only mode. New intake is disabled.'
              : 'What do you want to work on? Pick the intake type that fits. I will review and prepare before our next session or async response.'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {intakeTypes.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  if (showReadOnlyBanner) return
                  setIntakeType(item.value)
                  setShowAddRecord('intake')
                }}
                disabled={!!showReadOnlyBanner}
                className="border rounded-lg p-3 text-left hover:bg-accent transition-colors group disabled:cursor-not-allowed disabled:opacity-50"
              >
                <item.icon className="h-4 w-4 text-primary mb-2" />
                <h3 className="text-xs font-medium">{item.label}</h3>
                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
              </button>
            ))}
          </div>
          {intakeList.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Recent Intake</h3>
              {intakeList.slice(0, 5).map((rec: any) => (
                <div key={rec.id} className="border rounded-lg p-3 flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{rec.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {intakeTypes.find(t => t.value === rec.intake_type)?.label || rec.intake_type}
                    </p>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded flex-shrink-0">{rec.status}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 6. Current Priorities */}
        <section>
          <h2 className="text-base font-semibold mb-3 flex items-center justify-between">
            Current Priorities
            {!showReadOnlyBanner && (
              <button
                onClick={() => setShowAddRecord('priorities')}
                className="text-xs text-primary hover:underline inline-flex items-center gap-1"
              >
                <Plus className="h-3 w-3" /> Add
              </button>
            )}
          </h2>
          <div className="border rounded-lg p-4">
            {priorityList.length > 0 ? (
              <div className="space-y-2">
                {priorityList.map((p: any) => (
                  <div key={p.id} className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{p.title}</p>
                      {p.description && <p className="text-xs text-muted-foreground mt-0.5">{p.description}</p>}
                      {p.owner && <p className="text-xs text-muted-foreground mt-0.5">Owner: {p.owner}</p>}
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded flex-shrink-0">{p.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                The 2-4 matters that deserve attention will be tracked here as the engagement progresses.
              </p>
            )}
          </div>
        </section>

        {/* 7. Evidence & Inputs */}
        <section>
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 justify-between">
            <span className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-primary" />
              Evidence & Inputs
            </span>
            {!showReadOnlyBanner && (
              <button onClick={() => setShowAddRecord('evidence')} className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                <Plus className="h-3 w-3" /> Add
              </button>
            )}
          </h2>
          <div className="border rounded-lg p-4">
            {evidenceList.length > 0 ? (
              <div className="space-y-2">
                {evidenceList.slice(0, 5).map((e: any) => (
                  <div key={e.id} className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{e.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{e.evidence_type} · {e.provenance}</p>
                      {e.link_url && <a href={e.link_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-0.5 inline-block">Open link</a>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Research, benchmarks, test results, and client-provided evidence used to inform decisions.
              </p>
            )}
            <div className="mt-3 rounded-md bg-amber-500/5 border border-amber-500/20 p-3">
              <p className="text-xs text-amber-700 font-medium mb-1">Sensitive data warning</p>
              <p className="text-xs text-muted-foreground">
                Do not submit passwords, API keys, payment card data, medical information, or regulated/specially protected data unless a secure handling arrangement has been explicitly agreed.
              </p>
            </div>
          </div>
        </section>

        {/* 8. Monthly Decision & Opportunity Brief */}
        <section>
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-primary" />
            Monthly Decision & Opportunity Brief
          </h2>
          <div className="border rounded-lg p-4">
            {briefList.length > 0 ? (
              (() => {
                const brief = briefList[0]
                return (
                  <div className="space-y-3">
                    {brief.period_label && (
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{brief.period_label}</p>
                    )}
                    {brief.what_changed && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">What Changed</p>
                        <p className="text-sm">{brief.what_changed}</p>
                      </div>
                    )}
                    {brief.what_matters && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">What Matters</p>
                        <p className="text-sm">{brief.what_matters}</p>
                      </div>
                    )}
                    {brief.decisions_in_play && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Decisions in Play</p>
                        <p className="text-sm">{brief.decisions_in_play}</p>
                      </div>
                    )}
                    {brief.opportunities_in_play && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Opportunities in Play</p>
                        <p className="text-sm">{brief.opportunities_in_play}</p>
                      </div>
                    )}
                    {brief.next_focus && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Next Focus</p>
                        <p className="text-sm">{brief.next_focus}</p>
                      </div>
                    )}
                  </div>
                )
              })()
            ) : (
              <p className="text-sm text-muted-foreground">
                Your monthly brief will appear here once generated. It summarizes what changed, what matters, decisions and opportunities in play, and the next focus for the period.
              </p>
            )}
          </div>
        </section>

        {/* 9. Actions & Commitments */}
        <section>
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 justify-between">
            <span className="flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-primary" />
              Actions & Commitments
            </span>
            {!showReadOnlyBanner && (
              <button onClick={() => setShowAddRecord('actions')} className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                <Plus className="h-3 w-3" /> Add
              </button>
            )}
          </h2>
          <div className="border rounded-lg p-4">
            {actionList.length > 0 ? (
              <div className="space-y-2">
                {actionList.slice(0, 5).map((a: any) => (
                  <div key={a.id} className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{a.title}</p>
                      {a.assignee_label && <p className="text-xs text-muted-foreground mt-0.5">Owner: {a.assignee_label}</p>}
                      {a.due_date && <p className="text-xs text-muted-foreground mt-0.5">Due: {a.due_date}</p>}
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded flex-shrink-0">{a.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Open actions, owners, and deadlines tracked across the engagement. Updated after each session and async exchange.
              </p>
            )}
          </div>
        </section>

        {/* 10. Decision Artifacts */}
        <section>
          <h2 className="text-base font-semibold mb-3">Decision Artifacts</h2>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              Decision briefs, vendor comparisons, architecture reviews, and decision records will appear here as they are produced.
            </p>
          </div>
        </section>

        {/* 11. Organization Context */}
        <section>
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Building2 className="h-5 w-5 text-primary" />
            Organization Context
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="border rounded-lg p-4">
              <h3 className="text-xs font-medium text-muted-foreground">Organization</h3>
              <p className="text-sm mt-1">{organization.name}</p>
              {organizationRole && <p className="text-xs text-muted-foreground mt-1">Your role: {organizationRole}</p>}
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="text-xs font-medium text-muted-foreground">Plan</h3>
              <p className="text-sm mt-1">{fractionalEnt?.offering_name || 'Fractional AI Advisor'}</p>
              <p className="text-xs text-muted-foreground mt-1">2 working sessions/month · Priority async advisory</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="text-xs font-medium text-muted-foreground">Team Seats</h3>
              <p className="text-sm mt-1">1 seat included</p>
              <p className="text-xs text-muted-foreground mt-1">Additional seats available on request</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="text-xs font-medium text-muted-foreground">Response Time</h3>
              <p className="text-sm mt-1">Priority async advisory</p>
              <p className="text-xs text-muted-foreground mt-1">Responses within 1 business day</p>
            </div>
          </div>
        </section>

        {/* 12. Included Capabilities */}
        {productList.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Boxes className="h-5 w-5 text-primary" />
              Included Capabilities
            </h2>
            <div className="space-y-3">
              {productList.map(product => {
                const ent = product.includedEntitlement
                const isIncluded = ent && ent.entitlementStatus !== 'ended'
                const isActive = ent?.entitlementStatus === 'active' && ent?.provisioningStatus === 'provisioned'
                const isProvisioning = ent?.entitlementStatus === 'provisioning'
                const isFailed = ent?.entitlementStatus === 'provisioning_failed'
                const isReadyToActivate = ent?.entitlementStatus === 'ready_to_activate'

                return (
                  <div key={product.offeringKey} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                        {isIncluded && (
                          <p className="text-xs text-primary mt-1 font-medium">
                            Included with Fractional AI Advisor
                            {ent?.seats && ent.seats > 1 ? ` · ${ent.seats} seats` : ' · 1 seat'}
                            {ent?.credits != null && ` · ${ent.credits} monthly credits`}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                          <Link
                            href={product.learnMoreHref}
                            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                          >
                            Learn More
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                          {isActive && (
                            <span className="text-xs bg-green-500/10 text-green-700 px-2 py-0.5 rounded font-medium">
                              Active
                            </span>
                          )}
                          {isProvisioning && (
                            <span className="text-xs bg-blue-500/10 text-blue-700 px-2 py-0.5 rounded font-medium">
                              Provisioning...
                            </span>
                          )}
                          {isFailed && (
                            <span className="text-xs bg-red-500/10 text-red-700 px-2 py-0.5 rounded font-medium">
                              Needs Attention
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {isActive ? (
                          <a
                            href={product.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                          >
                            Open
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : isProvisioning ? (
                          <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Provisioning
                          </span>
                        ) : isFailed ? (
                          <button
                            onClick={() => handleActivateProduct(product.offeringKey)}
                            disabled={activatingProduct === product.offeringKey}
                            className="inline-flex items-center gap-1 text-sm text-primary hover:underline disabled:opacity-50"
                          >
                            {activatingProduct === product.offeringKey ? (
                              <><Loader2 className="h-3 w-3 animate-spin" /> Retrying...</>
                            ) : (
                              <>Retry</>
                            )}
                          </button>
                        ) : isReadyToActivate || (isIncluded && !isActive) ? (
                          <button
                            onClick={() => handleActivateProduct(product.offeringKey)}
                            disabled={activatingProduct === product.offeringKey}
                            className="inline-flex items-center gap-1 text-sm text-primary hover:underline disabled:opacity-50"
                          >
                            {activatingProduct === product.offeringKey ? (
                              <><Loader2 className="h-3 w-3 animate-spin" /> Activating...</>
                            ) : (
                              <>Activate</>
                            )}
                          </button>
                        ) : null}
                      </div>
                    </div>
                    {isFailed && ent?.provisioningError && (
                      <p className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                        {ent.provisioningError}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
            {memberToolsIncluded && memberToolsIncluded.entitlementStatus !== 'ended' && (
              <div className="border rounded-lg p-4 mt-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">
                      {memberToolsIncluded.accessLevel === 'library' ? 'Member Tool Library' : 'Selected Member Tools'}
                    </h3>
                    <p className="text-xs text-primary mt-1 font-medium">
                      Included with Fractional AI Advisor
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {memberToolsIncluded.accessLevel === 'library'
                        ? 'Full library of production-ready internal decision, architecture, research, and technical utilities.'
                        : 'Selected SubodhKC production-ready internal tools and utilities.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* 12b. Member Tools */}
        <MemberToolsSection orgSlug={organization.slug} canAccess={true} />

        {/* 13. Plan & Billing */}
        <section>
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            Plan & Billing
          </h2>
          <div className="border rounded-lg p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-medium">{fractionalEnt?.offering_name || 'Fractional AI Advisor'}</h3>
                <p className="text-sm text-muted-foreground mt-1">$99/month · 2 working sessions + priority async advisory</p>
                {subscriptionStatus && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Subscription status: <span className="font-medium">{subscriptionStatus}</span>
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Billing period:{' '}
                  {billingPeriodStart && billingPeriodEnd
                    ? `${new Date(billingPeriodStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(billingPeriodEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                    : 'Active subscription'}
                </p>
              </div>
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
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors flex-shrink-0"
              >
                <Briefcase className="h-4 w-4" />
                Manage Billing
              </button>
            </div>
          </div>
        </section>

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

        {/* Working Sessions */}
        <section>
          <h2 className="text-base font-semibold mb-3">Working Sessions</h2>
          <div className="border rounded-lg p-4">
            {/* Session usage summary */}
            {sessionUsage && (
              <div className="mb-3 p-3 rounded-md bg-primary/5 border border-primary/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Session Usage — {sessionUsage.currentMonth}
                    </p>
                    <p className="text-sm mt-1">
                      <strong>{sessionUsage.availableSessions}</strong> of{' '}
                      {sessionUsage.includedSessions + sessionUsage.rolledOverFromPrev} available
                      {sessionUsage.rolledOverFromPrev > 0 && (
                        <span className="text-xs text-muted-foreground ml-1">
                          (includes {sessionUsage.rolledOverFromPrev} rolled over)
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {sessionUsage.usedSessions} used
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Max rollover: {sessionUsage.maxRollover}
                    </p>
                  </div>
                </div>
              </div>
            )}
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

        {/* Advisor Affiliations */}
        <section>
          <h2 className="text-lg font-semibold mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Handshake className="h-5 w-5 text-primary" />
              Approved Advisor Affiliation
            </span>
            {!showReadOnlyBanner && (
              <button
                onClick={() => setShowAddRecord('affiliations')}
                className="text-xs text-primary hover:underline inline-flex items-center gap-1"
              >
                <Plus className="h-3 w-3" /> Add
              </button>
            )}
          </h2>
          <div className="border rounded-lg p-4">
            {affiliationList.length > 0 ? (
              <div className="space-y-2">
                {affiliationList.map((aff: any) => (
                  <div key={aff.id} className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{aff.affiliate_name}</p>
                      {aff.affiliate_role && <p className="text-xs text-muted-foreground mt-0.5">{aff.affiliate_role}</p>}
                      {aff.affiliate_company && <p className="text-xs text-muted-foreground mt-0.5">{aff.affiliate_company}</p>}
                      {aff.notes && <p className="text-xs text-muted-foreground mt-1">{aff.notes}</p>}
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded flex-shrink-0">{aff.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No approved advisor affiliations recorded yet. External advisors and partners introduced through this engagement will be tracked here.
              </p>
            )}
          </div>
        </section>

        {/* Workspace Export */}
        <section className="border rounded-lg p-4 bg-secondary/20">
          <div className="flex items-start gap-3">
            <Download className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold">Export Your Workspace</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Download your decision records, opportunity records, client-provided inputs, advisor artifacts, and action/history records. Available anytime during your subscription and for 30 days after cancellation.
              </p>
              <button
                onClick={handleExport}
                disabled={exporting}
                className="mt-3 inline-flex items-center gap-2 text-sm text-primary hover:underline disabled:opacity-50"
              >
                {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                {exporting ? 'Preparing export...' : 'Export Workspace Data'}
              </button>
            </div>
          </div>
        </section>

        {/* Operating Records */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Operating Records</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* AI Systems & Vendor Inventory */}
            <section>
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                AI Systems & Vendor Inventory
              </h3>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  Current AI tools, vendors, models, and systems in use or under evaluation. Tracked with status, cost, and risk notes.
                </p>
              </div>
            </section>

            {/* Assumptions & Risks */}
            <section>
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                Assumptions & Risks
              </h3>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  Key assumptions and risks tracked across active decisions and opportunities. Updated as evidence comes in.
                </p>
              </div>
            </section>

            {/* Partnership / External Opportunity Record */}
            <section>
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
                <Handshake className="h-4 w-4 text-muted-foreground" />
                Partnership / External Opportunity
              </h3>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  Strategic partnerships, technology partnerships, vendors, programs, and external opportunities identified for exploration or evaluation.
                </p>
              </div>
            </section>

            {/* Initiative Portfolio */}
            <section>
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
                <Layers className="h-4 w-4 text-muted-foreground" />
                Initiative Portfolio
              </h3>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  Active and planned AI initiatives tracked with status, dependencies, and sequencing recommendations.
                </p>
              </div>
            </section>

            {/* Working Session Records */}
            <section>
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
                Working Session Records
              </h3>
              <div className="border rounded-lg p-4">
                {sessionList.length > 0 ? (
                  <div className="space-y-2">
                    {sessionList.slice(0, 5).map((s: any) => (
                      <div key={s.id} className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {s.session_type === 'activation_call' ? 'Activation Call' : 'Working Session'}
                            {s.scheduled_at && ` — ${new Date(s.scheduled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                          </p>
                          {s.agenda && <p className="text-xs text-muted-foreground mt-0.5">{s.agenda}</p>}
                          {s.rolled_over_from_month && <p className="text-xs text-muted-foreground mt-0.5">Rolled over from {s.rolled_over_from_month}</p>}
                        </div>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded flex-shrink-0">{s.status}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Notes, decisions, and action items from each working session. Persistent record of what was discussed and agreed.
                  </p>
                )}
              </div>
            </section>

            {/* Decision History */}
            <section>
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
                <History className="h-4 w-4 text-muted-foreground" />
                Decision History
              </h3>
              <div className="border rounded-lg p-4">
                {decisionList.length > 0 ? (
                  <div className="space-y-2">
                    {decisionList.slice(0, 5).map((d) => (
                      <div key={d.id} className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{d.title}</p>
                          {d.decided_at && <p className="text-xs text-muted-foreground mt-0.5">Decided: {new Date(d.decided_at).toLocaleDateString()}</p>}
                        </div>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded flex-shrink-0">{d.status}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Full chronological record of decisions made, deferred, or superseded. Includes context and rationale.
                  </p>
                )}
              </div>
            </section>

            {/* Outcome / Learning */}
            <section>
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-2 justify-between">
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  Outcome / Learning
                </span>
                {!showReadOnlyBanner && (
                  <button onClick={() => setShowAddRecord('outcomes')} className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                    <Plus className="h-3 w-3" /> Add
                  </button>
                )}
              </h3>
              <div className="border rounded-lg p-4">
                {outcomeList.length > 0 ? (
                  <div className="space-y-2">
                    {outcomeList.slice(0, 5).map((o: any) => (
                      <div key={o.id} className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{o.title}</p>
                          {o.description && <p className="text-xs text-muted-foreground mt-0.5">{o.description}</p>}
                        </div>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded flex-shrink-0">{o.status}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Tracked outcomes of past decisions. What worked, what did not, and what was learned.
                  </p>
                )}
              </div>
            </section>

            {/* Value Record */}
            <section>
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                Value Record
              </h3>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  Client-verified value evidence: time saved, cost avoided, risk reduced, revenue enabled. Updated as outcomes are confirmed.
                </p>
              </div>
            </section>

            {/* Open Loops */}
            <section>
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Open Loops
              </h3>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  Unresolved questions, pending follow-ups, and items awaiting client input or external response.
                </p>
              </div>
            </section>
          </div>
        </div>

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

        {/* Record Creation Modal */}
        {showAddRecord && (
          <RecordCreationModal
            recordType={showAddRecord}
            intakeType={intakeType}
            onClose={() => {
              setShowAddRecord(null)
              setIntakeType(null)
            }}
            onSubmit={async (data) => {
              await handleCreateRecord(showAddRecord, data, () => {
                setShowAddRecord(null)
                setIntakeType(null)
              })
            }}
            submitting={recordSubmitting}
          />
        )}
      </main>
    </div>
  )
}

// ============================================
// Record Creation Modal
// ============================================
function RecordCreationModal({
  recordType,
  intakeType,
  onClose,
  onSubmit,
  submitting,
}: {
  recordType: string
  intakeType: string | null
  onClose: () => void
  onSubmit: (data: Record<string, unknown>) => void
  submitting: boolean
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [whyItMatters, setWhyItMatters] = useState('')
  const [desiredOutcome, setDesiredOutcome] = useState('')
  const [deadline, setDeadline] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [affiliateName, setAffiliateName] = useState('')
  const [affiliateRole, setAffiliateRole] = useState('')
  const [affiliateCompany, setAffiliateCompany] = useState('')
  const [artifactType, setArtifactType] = useState('document')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data: Record<string, unknown> = { title: title.trim() }
    if (description) data.description = description
    if (whyItMatters) data.why_it_matters = whyItMatters
    if (desiredOutcome) data.desired_outcome = desiredOutcome
    if (deadline) data.deadline = deadline
    if (linkUrl) data.link_url = linkUrl

    // Type-specific fields
    if (recordType === 'intake') {
      data.intake_type = intakeType || 'ask_question'
      data.what_is_happening = description
    }
    if (recordType === 'opportunities') {
      data.opportunity = title.trim()
      if (whyItMatters) data.why_it_matters = whyItMatters
    }
    if (recordType === 'evidence') {
      data.evidence_type = 'note'
      if (linkUrl) data.link_url = linkUrl
    }
    if (recordType === 'priorities') {
      data.priority_order = 0
    }
    if (recordType === 'artifacts') {
      data.artifact_type = artifactType
      if (linkUrl) data.external_url = linkUrl
      data.status = 'draft'
    }
    if (recordType === 'affiliations') {
      data.affiliate_name = affiliateName.trim() || title.trim()
      if (affiliateRole) data.affiliate_role = affiliateRole
      if (affiliateCompany) data.affiliate_company = affiliateCompany
      data.relationship_type = 'approved_advisor'
      data.status = 'approved'
    }
    if (recordType === 'outcomes') {
      if (description) data.what_happened = description
      data.status = 'recorded'
    }

    onSubmit(data)
  }

  const titleLabel = recordType === 'opportunities' ? 'Opportunity' : recordType === 'evidence' ? 'Title' : 'Title'
  const descLabel = recordType === 'intake' ? 'What is happening?' : recordType === 'opportunities' ? 'Why it matters' : 'Description'

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-background border rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-semibold mb-4">
          {recordType === 'intake' && intakeType ? `New: ${intakeTypes.find(t => t.value === intakeType)?.label}` : `Add ${recordType.replace(/_/g, ' ')}`}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm font-medium block mb-1">{titleLabel}</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="w-full border rounded-md px-3 py-2 text-sm"
              placeholder="Enter title..."
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">{descLabel}</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full border rounded-md px-3 py-2 text-sm"
              placeholder="Enter details..."
            />
          </div>
          {recordType === 'intake' && (
            <>
              <div>
                <label className="text-sm font-medium block mb-1">Why it matters</label>
                <textarea value={whyItMatters} onChange={e => setWhyItMatters(e.target.value)} rows={2} className="w-full border rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Desired outcome</label>
                <input type="text" value={desiredOutcome} onChange={e => setDesiredOutcome(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Deadline / needed by</label>
                <input type="text" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" placeholder="e.g., end of month" />
              </div>
            </>
          )}
          {recordType === 'evidence' && (
            <div>
              <label className="text-sm font-medium block mb-1">Link URL (optional)</label>
              <input type="url" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" placeholder="https://..." />
            </div>
          )}
          {recordType === 'artifacts' && (
            <>
              <div>
                <label className="text-sm font-medium block mb-1">Artifact Type</label>
                <select value={artifactType} onChange={e => setArtifactType(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm">
                  <option value="document">Document</option>
                  <option value="decision_brief">Decision Brief</option>
                  <option value="vendor_comparison">Vendor Comparison</option>
                  <option value="architecture_review">Architecture Review</option>
                  <option value="opportunity_analysis">Opportunity Analysis</option>
                  <option value="roadmap">Roadmap</option>
                  <option value="operating_recommendation">Operating Recommendation</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Link URL (optional)</label>
                <input type="url" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" placeholder="https://..." />
              </div>
            </>
          )}
          {recordType === 'affiliations' && (
            <>
              <div>
                <label className="text-sm font-medium block mb-1">Advisor Name</label>
                <input type="text" value={affiliateName} onChange={e => setAffiliateName(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" placeholder="Full name" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Role (optional)</label>
                <input type="text" value={affiliateRole} onChange={e => setAffiliateRole(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" placeholder="e.g., CFO, Technical Advisor" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Company (optional)</label>
                <input type="text" value={affiliateCompany} onChange={e => setAffiliateCompany(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm" placeholder="Company name" />
              </div>
            </>
          )}
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={submitting || !title.trim()} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50">
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-sm border hover:bg-accent">
              Cancel
            </button>
          </div>
        </form>
      </div>
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
