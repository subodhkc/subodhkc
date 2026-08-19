'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  LogOut,
  ArrowLeft,
  Calendar,
  AlertTriangle,
  Users,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  ChevronRight,
  ExternalLink,
  ArrowRight,
  Boxes,
  Building2,
  Loader2,
} from 'lucide-react'
import type { AuthenticatedUser, OrganizationContext } from '@/lib/auth/organization-resolver'
import { MemberToolsSection } from './MemberToolsSection'

interface Question {
  id: string
  subject: string
  question: string
  status: string
  advisor_response: string | null
  billing_period_key: string
  created_at: string
  responded_at: string | null
  context: Record<string, unknown> | null
  request_category: string | null
  effort_class: string | null
  recommended_next_step: string | null
  recommended_offer_key: string | null
}

interface TeamMember {
  id: string
  role: string
  userId: string
  email: string
  fullName: string | null
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

interface WatchlistItem {
  id: string
  category: string
  title: string
  source: string | null
  relevance: string | null
  status: string
  recommended_next_action: string | null
  is_draft: boolean
  created_at: string
}

interface SchedulingLink {
  id: string
  scheduling_url: string
  status: string
  scheduled_at: string | null
  link_type: string
}

interface OnboardingSteps {
  context_intake: string
  watchlist_review: string
  activation_call: string
}

interface WorkOrderSummary {
  id: string
  workOrderNumber: string
  title: string
  workType: string
  status: string
  statusLabel: string
  desiredOutcome: string | null
  createdAt: string
}

interface AdvisorDeskWorkspaceClientProps {
  user: AuthenticatedUser
  ctx: OrganizationContext
  questions: Question[]
  members: TeamMember[]
  teamSeatLimit: number
  subscriptionStatus: string | null
  subscriptionMetadata: Record<string, unknown>
  entitlementValidUntil: string | null
  entitlementStatus: string
  products: ProductInfo[]
  memberToolsIncluded?: MemberToolsIncluded | null
  watchlistItems?: WatchlistItem[]
  schedulingLink?: SchedulingLink | null
  onboardingSteps?: OnboardingSteps | null
  onboardingComplete?: boolean
  workOrders?: WorkOrderSummary[]
}

const statusLabels: Record<string, string> = {
  submitted: 'Received',
  under_review: 'Reviewing',
  answered: 'Answered',
  deeper_work_recommended: 'Deeper Work Recommended',
  closed: 'Closed',
}

const statusColors: Record<string, string> = {
  submitted: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  under_review: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  answered: 'bg-green-500/10 text-green-600 border-green-500/20',
  deeper_work_recommended: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  closed: 'bg-muted text-muted-foreground border-border',
}

export function AdvisorDeskWorkspaceClient({
  user,
  ctx,
  questions,
  members,
  teamSeatLimit,
  subscriptionStatus,
  subscriptionMetadata,
  entitlementValidUntil,
  entitlementStatus,
  products,
  memberToolsIncluded,
  watchlistItems = [],
  schedulingLink = null,
  onboardingSteps = null,
  onboardingComplete = false,
  workOrders = [],
}: AdvisorDeskWorkspaceClientProps) {
  const { organization } = ctx
  const basePath = `/app/${organization.slug}`

  const [subject, setSubject] = useState('')
  const [question, setQuestion] = useState('')
  const [context, setContext] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [localQuestions, setLocalQuestions] = useState(questions)
  const [portalLoading, setPortalLoading] = useState(false)
  const [portalError, setPortalError] = useState<string | null>(null)
  const [productList, setProductList] = useState<ProductInfo[]>(products)
  const [activatingProduct, setActivatingProduct] = useState<string | null>(null)

  const cancellationScheduled = entitlementStatus === 'active' && entitlementValidUntil

  // Derived Today view data
  const unansweredQuestions = localQuestions.filter(q =>
    q.status === 'submitted' || q.status === 'under_review'
  )
  const answeredQuestions = localQuestions.filter(q =>
    q.status === 'answered' || q.status === 'deeper_work_recommended'
  )
  const workOrdersNeedingInput = workOrders.filter(wo => wo.status === 'needs_client_input')
  const workOrdersActive = workOrders.filter(wo =>
    wo.status === 'in_progress' || wo.status === 'in_review' || wo.status === 'paid' || wo.status === 'scoped'
  )
  const workOrdersDelivered = workOrders.filter(wo =>
    wo.status === 'delivered' || wo.status === 'completed'
  )

  const hasTodayContent =
    workOrders.length > 0 ||
    unansweredQuestions.length > 0 ||
    answeredQuestions.length > 0 ||
    watchlistItems.length > 0

  async function handleLogout() {
    await fetch('/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  async function handleManageBilling() {
    setPortalLoading(true)
    setPortalError(null)
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgSlug: organization.slug, returnTo: 'advisor-desk' }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setPortalError(data.error || 'Unable to open billing portal. Please try again.')
      }
    } catch {
      setPortalError('Network error opening billing portal. Please try again.')
    }
    setPortalLoading(false)
  }

  async function handleSubmitQuestion(e: React.FormEvent) {
    e.preventDefault()
    if (!subject.trim() || !question.trim()) return
    setSubmitting(true)
    setSubmitError(null)

    try {
      const res = await fetch('/api/commercial/advisor-desk/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgSlug: organization.slug,
          subject: subject.trim(),
          question: question.trim(),
          context: context.trim() ? { note: context.trim() } : undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setSubmitError(data.error || 'Failed to submit question')
        setSubmitting(false)
        return
      }

      setLocalQuestions(prev => [
        {
          id: data.question.id,
          subject: data.question.subject,
          question: data.question.question,
          status: 'submitted',
          advisor_response: null,
          billing_period_key: data.question.billing_period_key,
          created_at: data.question.created_at,
          responded_at: null,
          context: null,
          request_category: null,
          effort_class: 'BRIEF',
          recommended_next_step: null,
          recommended_offer_key: null,
        },
        ...prev,
      ])
      setSubject('')
      setQuestion('')
      setContext('')
    } catch {
      setSubmitError('Network error. Please try again.')
    }
    setSubmitting(false)
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2 min-w-0">
            <Link href="/app" className="font-semibold text-sm flex-shrink-0">SubodhKC</Link>
            <span className="text-muted-foreground text-sm">/</span>
            <Link href={basePath} className="text-sm truncate">{organization.name}</Link>
            <span className="text-muted-foreground text-sm">/</span>
            <span className="text-sm font-medium">Advisor Desk</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 hover:bg-accent/10 rounded-md"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-10">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Advisor Desk</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ongoing AI advisory for {organization.name}
          </p>
        </div>

        {/* Onboarding banner — only if incomplete */}
        {!onboardingComplete && (
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 space-y-3">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold">Get started in 3 steps</h3>
                <p className="text-xs text-muted-foreground mt-1">Complete your context profile, review your watchlist, and schedule your activation call.</p>
                <div className="flex items-center gap-4 mt-3 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    {onboardingSteps?.context_intake === 'completed' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                    )}
                    <span className="text-xs text-muted-foreground">Context</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {onboardingSteps?.watchlist_review === 'completed' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                    )}
                    <span className="text-xs text-muted-foreground">Watchlist</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {onboardingSteps?.activation_call === 'completed' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                    )}
                    <span className="text-xs text-muted-foreground">Activation Call</span>
                  </div>
                </div>
                <Link
                  href={`${basePath}/advisor-desk/onboarding`}
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-3 font-medium"
                >
                  Continue Onboarding
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TODAY — operational view */}
        <section aria-labelledby="today-heading">
          <h2 id="today-heading" className="text-lg font-semibold mb-4">Today</h2>

          {!hasTodayContent && (
            <div className="border border-border rounded-lg p-6">
              <p className="text-sm text-muted-foreground">
                No material change currently alters your priorities.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                When you have Work Orders in progress, advisor questions awaiting response, or watchlist items, they will appear here.
              </p>
            </div>
          )}

          {/* Work Orders needing input — highest priority */}
          {workOrdersNeedingInput.length > 0 && (
            <div className="mb-5">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500" aria-hidden="true" />
                Needs your input
              </h3>
              <div className="border border-border rounded-lg divide-y divide-border">
                {workOrdersNeedingInput.map(wo => (
                  <Link
                    key={wo.id}
                    href={`${basePath}/work-orders/${wo.id}`}
                    className="block p-3 hover:bg-accent/5 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70">{wo.workOrderNumber}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-orange-500/10 text-orange-600">
                            {wo.statusLabel}
                          </span>
                        </div>
                        <p className="text-sm font-medium truncate mt-1">{wo.title}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent flex-shrink-0 mt-0.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Unanswered questions */}
          {unansweredQuestions.length > 0 && (
            <div className="mb-5">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" aria-hidden="true" />
                Awaiting advisor response
              </h3>
              <div className="border border-border rounded-lg divide-y divide-border">
                {unansweredQuestions.map(q => (
                  <div key={q.id} className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium truncate">{q.subject}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded border flex-shrink-0 ${statusColors[q.status] || statusColors.submitted}`}>
                        {statusLabels[q.status] || q.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(q.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Answered questions to review */}
          {answeredQuestions.length > 0 && (
            <div className="mb-5">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" aria-hidden="true" />
                Recently answered
              </h3>
              <div className="border border-border rounded-lg divide-y divide-border">
                {answeredQuestions.slice(0, 3).map(q => (
                  <div key={q.id} className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium truncate">{q.subject}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded border flex-shrink-0 ${statusColors[q.status] || statusColors.answered}`}>
                        {statusLabels[q.status] || q.status}
                      </span>
                    </div>
                    {q.advisor_response && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{q.advisor_response}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {q.responded_at && new Date(q.responded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Work Orders */}
          {workOrdersActive.length > 0 && (
            <div className="mb-5">
              <h3 className="text-sm font-semibold mb-2">In progress</h3>
              <div className="border border-border rounded-lg divide-y divide-border">
                {workOrdersActive.map(wo => (
                  <Link
                    key={wo.id}
                    href={`${basePath}/work-orders/${wo.id}`}
                    className="block p-3 hover:bg-accent/5 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70">{wo.workOrderNumber}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-500/10 text-blue-600">
                            {wo.statusLabel}
                          </span>
                        </div>
                        <p className="text-sm font-medium truncate mt-1">{wo.title}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent flex-shrink-0 mt-0.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Delivered Work Orders */}
          {workOrdersDelivered.length > 0 && (
            <div className="mb-5">
              <h3 className="text-sm font-semibold mb-2">Delivered</h3>
              <div className="border border-border rounded-lg divide-y divide-border">
                {workOrdersDelivered.slice(0, 3).map(wo => (
                  <Link
                    key={wo.id}
                    href={`${basePath}/work-orders/${wo.id}`}
                    className="block p-3 hover:bg-accent/5 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70">{wo.workOrderNumber}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-500/10 text-green-600">
                            {wo.statusLabel}
                          </span>
                        </div>
                        <p className="text-sm font-medium truncate mt-1">{wo.title}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent flex-shrink-0 mt-0.5" />
                    </div>
                  </Link>
                ))}
              </div>
              {workOrders.length > 3 && (
                <Link href={`${basePath}/work-orders`} className="block text-sm text-primary hover:underline pt-2">
                  View all {workOrders.length} Work Orders
                </Link>
              )}
            </div>
          )}

          {/* Watchlist */}
          {watchlistItems.length > 0 && (
            <div className="mb-5">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                Watchlist
              </h3>
              <div className="border border-border rounded-lg divide-y divide-border">
                {watchlistItems.slice(0, 5).map(item => (
                  <div key={item.id} className={`p-3 ${item.is_draft ? 'bg-primary/5' : ''}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">{item.title}</p>
                          {item.is_draft && <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium flex-shrink-0">Draft</span>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 capitalize">{item.category.replace(/_/g, ' ')}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
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
              {watchlistItems.length > 5 && (
                <Link href={`${basePath}/advisor-desk/onboarding`} className="block text-sm text-primary hover:underline pt-2">
                  View all {watchlistItems.length} items
                </Link>
              )}
            </div>
          )}

          {/* Activation call — only if not yet scheduled */}
          {(!schedulingLink || schedulingLink.status === 'cancelled') && (
            <div className="mb-5">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Activation Call
              </h3>
              <div className="border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  Schedule your 15-minute Activation Call to calibrate your watchlist and clarify the decisions already in play.
                </p>
                <Link
                  href={`${basePath}/advisor-desk/onboarding`}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 mt-3"
                >
                  <Calendar className="h-4 w-4" />
                  Schedule Activation Call
                </Link>
              </div>
            </div>
          )}

          {/* Scheduled activation call summary */}
          {schedulingLink && schedulingLink.status !== 'cancelled' && (
            <div className="mb-5">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Activation Call
              </h3>
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <p className="text-sm font-medium">
                    {schedulingLink.status === 'completed' ? 'Activation call completed' : 'Activation call scheduled'}
                  </p>
                </div>
                {schedulingLink.scheduled_at && (
                  <p className="text-xs text-muted-foreground mt-1.5">
                    {new Date(schedulingLink.scheduled_at).toLocaleString('en-US', {
                      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
                    })}
                  </p>
                )}
                {schedulingLink.status !== 'completed' && (
                  <a
                    href={schedulingLink.scheduling_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                  >
                    Reschedule
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          )}
        </section>

        {/* ASK ADVISOR */}
        <section aria-labelledby="ask-heading">
          <h2 id="ask-heading" className="text-lg font-semibold mb-4">Ask Your Advisor</h2>
          <div className="border border-border rounded-lg p-5 space-y-4">
            <p className="text-sm text-muted-foreground">
              When an AI decision matters, bring it here. I review the context, pressure-test
              the options, and give you a practical point of view on what deserves action.
              Most focused questions receive a thoughtfully reviewed response within 72 hours.
            </p>
            <p className="text-sm text-muted-foreground">
              When a question deserves deeper research, document review, architecture work, or
              implementation, I will identify that before additional work begins and offer a clearly
              scoped next step.
            </p>

            <form onSubmit={handleSubmitQuestion} className="space-y-4">
              <div>
                <label htmlFor="question-subject" className="text-sm font-medium block mb-1.5">Subject</label>
                <input
                  id="question-subject"
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="What decision are you working through?"
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor="question-body" className="text-sm font-medium block mb-1.5">Question</label>
                <textarea
                  id="question-body"
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  placeholder="Briefly describe the decision, options or concern."
                  rows={4}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  required
                />
              </div>
              <div>
                <label htmlFor="question-context" className="text-sm font-medium block mb-1.5">Optional context</label>
                <input
                  id="question-context"
                  type="text"
                  value={context}
                  onChange={e => setContext(e.target.value)}
                  placeholder="Relevant link or short context"
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {submitError && <p className="text-sm text-red-600" role="alert">{submitError}</p>}

              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  disabled={submitting || !subject.trim() || !question.trim()}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                  {submitting ? 'Sending...' : 'Ask Your Advisor'}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* QUESTION HISTORY */}
        <section aria-labelledby="history-heading">
          <h2 id="history-heading" className="text-lg font-semibold mb-4">Question History</h2>
          {localQuestions.length === 0 ? (
            <div className="border border-border rounded-lg p-6 text-center">
              <p className="text-sm text-muted-foreground">
                No questions yet. Send your first question above.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {localQuestions.map(q => (
                <div key={q.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-sm font-medium">{q.subject}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded border flex-shrink-0 ${statusColors[q.status] || statusColors.submitted}`}>
                      {statusLabels[q.status] || q.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{q.question}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(q.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  {q.advisor_response && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-xs font-medium">Advisor Response</span>
                      </div>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{q.advisor_response}</p>
                      {q.responded_at && (
                        <p className="text-xs text-muted-foreground mt-1.5">
                          {new Date(q.responded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      )}
                    </div>
                  )}
                  {q.recommended_next_step && (
                    <div className="mt-3 pt-3 border-t border-purple-500/20">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <ArrowRight className="h-4 w-4 text-purple-600" />
                        <span className="text-xs font-medium text-purple-600">Recommended Next Step</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{q.recommended_next_step}</p>
                      <p className="text-xs text-purple-600/70 mt-1.5">
                        Deeper work is scoped as an AI Work Order ($500 standard) or a custom engagement. No automatic charges. You approve scope and cost before any work begins.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* WORK ORDERS — compact launcher */}
        <section aria-labelledby="wo-heading">
          <h2 id="wo-heading" className="text-lg font-semibold mb-4">Work Orders</h2>
          <div className="border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              A focused $500 investigation of one workflow or opportunity. Goes deeper than an advisory answer.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Link
                href={`${basePath}/work-orders`}
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                View all Work Orders
                <ChevronRight className="h-3 w-3" />
              </Link>
              <Link
                href="/ai-automation"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                Start a Work Order
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </section>

        {/* INCLUDED CAPABILITIES */}
        <section aria-labelledby="capabilities-heading">
          <h2 id="capabilities-heading" className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Boxes className="h-5 w-5 text-muted-foreground" />
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
                <div key={product.offeringKey} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                      {isIncluded && (
                        <p className="text-xs text-primary mt-1 font-medium">
                          Included with Advisor Desk
                          {ent?.seats && ent.seats > 1 ? ` · ${ent.seats} seats` : ' · 1 seat'}
                          {ent?.credits != null && ` · ${ent.credits} monthly credits`}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
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
                    <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border">
                      {ent.provisioningError}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
          {memberToolsIncluded && memberToolsIncluded.entitlementStatus !== 'ended' && (
            <div className="border border-border rounded-lg p-4 mt-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Boxes className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Selected Member Tools</h3>
                  <p className="text-xs text-primary mt-1 font-medium">
                    Included with Advisor Desk
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Selected SubodhKC production-ready internal tools and utilities. Additional tools are added as they become available.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* MEMBER TOOLS */}
        <MemberToolsSection orgSlug={organization.slug} canAccess={true} />

        {/* TEAM & BILLING */}
        <section aria-labelledby="team-heading">
          <h2 id="team-heading" className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            Team &amp; Billing
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Team */}
            <div className="border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold mb-2">Team</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Advisor seats: {members.length} / {teamSeatLimit} used
              </p>
              <div className="space-y-2">
                {members.map(m => (
                  <div key={m.id} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{m.fullName || m.email}</p>
                      {m.fullName && m.email && (
                        <p className="text-xs text-muted-foreground truncate">{m.email}</p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground capitalize flex-shrink-0">{m.role}</span>
                  </div>
                ))}
              </div>
              {members.length < teamSeatLimit && (
                <Link
                  href={`${basePath}/members`}
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-3"
                >
                  Invite Member
                  <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>

            {/* Billing */}
            <div className="border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold mb-2">Plan &amp; Billing</h3>
              {cancellationScheduled ? (
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">Active until</span>{' '}
                    {new Date(entitlementValidUntil!).toLocaleDateString('en-US', {
                      month: 'long', day: 'numeric', year: 'numeric',
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Your subscription will end at the close of the current billing period.
                  </p>
                </div>
              ) : (
                <p className="text-sm">
                  <span className="font-medium">Active</span> — $99/month
                </p>
              )}
              {portalError && (
                <p className="text-xs text-red-600 mt-2" role="alert">{portalError}</p>
              )}
              <button
                onClick={handleManageBilling}
                disabled={portalLoading}
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-3 disabled:opacity-50"
              >
                {portalLoading ? 'Opening...' : 'Manage Billing'}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Back */}
        <div>
          <Link
            href={basePath}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {organization.name}
          </Link>
        </div>
      </main>
    </div>
  )
}
