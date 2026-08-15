'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  LogOut,
  ArrowLeft,
  Calendar,
  AlertTriangle,
  Shield,
  Users,
  Scale,
  Gauge,
  Lock,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  ChevronRight,
  ExternalLink,
  ArrowRight,
  Lightbulb,
  Boxes,
  Sparkles,
  Loader2,
} from 'lucide-react'
import type { AuthenticatedUser, OrganizationContext } from '@/lib/auth/organization-resolver'

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
  entitlementStatus: string  // included, ready_to_activate, provisioning, active, provisioning_failed, suspended, ended
  provisioningStatus: string  // pending, in_progress, provisioned, failed, not_applicable
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

// Worth Knowing — intelligence and advisory items
const worthKnowingItems = [
  {
    icon: Lightbulb,
    title: 'New AI Possibilities',
    description: 'Capabilities that may be newly practical for your organization. Ask your advisor whether any of these fit your current priorities.',
  },
  {
    icon: Eye,
    title: 'Market Signals',
    description: 'Vendor moves, regulatory shifts, and adoption patterns worth tracking. Bring anything relevant to your next advisory question.',
  },
  {
    icon: Gauge,
    title: 'AI Readiness Check',
    description: 'Quick self-assessment to see where your organization stands on AI adoption maturity.',
    action: { label: 'Take Assessment', href: '/cognitive-systems-management/assessment' },
  },
]

// Possibilities Worth Considering
const possibilitiesItems = [
  {
    icon: Sparkles,
    title: 'Workflow Automation Opportunity',
    description: 'If a repetitive decision or process is consuming team time, an AI Opportunity & Workflow Assessment can identify whether automation is worth it.',
    action: { label: 'Explore Assessment', href: '/ai-automation' },
  },
  {
    icon: Users,
    title: 'Fractional AI Advisor',
    description: 'When decisions get bigger and more frequent, upgrading to a fractional advisory relationship gives you dedicated working sessions and decision artifacts.',
    action: { label: 'Learn More', href: '/advisory' },
  },
  {
    icon: Shield,
    title: 'AI Security & Controls Review',
    description: 'If you are moving AI toward production, a focused security review can identify gaps before they become incidents.',
    action: { label: 'Explore Review', href: '/ai-security-compliance' },
  },
]

// Governance & Controls — separated, NOT removed
const governanceItems = [
  {
    icon: Shield,
    title: 'AI Vendor Consideration',
    description: 'Reviewing a new AI tool? Check data handling, model transparency, and contractual protections before procurement.',
    action: { label: 'Vendor Due-Diligence Checklist', href: '/ai-vendor-due-diligence-checklist' },
  },
  {
    icon: Scale,
    title: 'Regulatory Development',
    description: 'AI regulations continue to evolve. Confirm which laws apply to your business and what they require.',
    action: { label: 'Check AI Law Applicability', href: '/does-texas-ai-law-apply-to-my-business' },
  },
  {
    icon: Lock,
    title: 'AI Controls Follow-Up',
    description: 'If you have AI systems in production, verify that governance controls are documented and enforced.',
    action: { label: 'How to Secure and Govern AI', href: '/how-to-secure-and-govern-ai' },
  },
]

const governanceTools = [
  { icon: AlertTriangle, label: 'AI Risk Register', href: '/ai-risk-register' },
  { icon: FileText, label: 'Incident Evidence Checklist', href: '/ai-incident-evidence-checklist' },
  { icon: Gauge, label: 'AI Readiness Assessment', href: '/cognitive-systems-management/assessment' },
  { icon: Shield, label: 'Vendor / Tool Check', href: '/ai-vendor-due-diligence-checklist' },
  { icon: Lock, label: 'AI Controls Review', href: '/how-to-secure-and-govern-ai' },
  { icon: Scale, label: 'AI Law Applicability', href: '/does-texas-ai-law-apply-to-my-business' },
  { icon: Users, label: 'Hiring / JD / Resume Check', href: '/guides/nyc-local-law-144' },
]

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
  const [productList, setProductList] = useState<ProductInfo[]>(products)
  const [requestingProduct, setRequestingProduct] = useState<string | null>(null)
  const [activatingProduct, setActivatingProduct] = useState<string | null>(null)

  const cancellationScheduled = entitlementStatus === 'active' && entitlementValidUntil

  async function handleLogout() {
    await fetch('/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  async function handleManageBilling() {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgSlug: organization.slug, returnTo: 'advisor-desk' }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      // Silently fail - user can retry
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

  async function handleRequestProduct(offeringKey: string) {
    setRequestingProduct(offeringKey)
    try {
      const res = await fetch('/api/products/access-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgSlug: organization.slug, offeringKey }),
      })
      if (res.ok) {
        // Update product list to show requested status
        setProductList(prev => prev.map(p =>
          p.offeringKey === offeringKey
            ? { ...p, requestStatus: 'requested' }
            : p
        ))
      }
    } catch (err) {
      console.error('Failed to request product:', err)
    }
    setRequestingProduct(null)
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
        // Update product to show as active/provisioned
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
        // Mark as provisioning_failed but keep entitlement
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
      <header className="border-b bg-card sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2 min-w-0">
            <Link href="/app" className="font-semibold text-sm flex-shrink-0">SubodhKC</Link>
            <span className="text-muted-foreground text-sm">/</span>
            <Link href={basePath} className="text-sm truncate">{organization.name}</Link>
            <span className="text-muted-foreground text-sm">/</span>
            <span className="text-sm font-medium">AI Advisor for Business</span>
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

      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-10">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Advisor for Business</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your Advisor Desk — ongoing AI intelligence and human advisory for {organization.name}
          </p>
        </div>

        {/* Worth Knowing */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Worth Knowing
          </h2>
          <div className="space-y-3">
            {worthKnowingItems.map((item, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <item.icon className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    {item.action && (
                      <Link
                        href={item.action.href}
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
                      >
                        {item.action.label}
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Possibilities Worth Considering */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Possibilities Worth Considering
          </h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {possibilitiesItems.map((item, i) => (
              <div key={i} className="border rounded-lg p-4 flex flex-col">
                <item.icon className="h-5 w-5 text-primary mb-2" />
                <h3 className="text-sm font-medium">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 flex-1">{item.description}</p>
                <Link
                  href={item.action.href}
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-3"
                >
                  {item.action.label}
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Ask Your Advisor */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Ask Your Advisor
          </h2>
          <div className="border rounded-lg p-5 bg-card space-y-4">
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
                <label className="text-sm font-medium block mb-1.5">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="What decision are you working through?"
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">Question</label>
                <textarea
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  placeholder="Briefly describe the decision, options or concern."
                  rows={4}
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">Optional context</label>
                <input
                  type="text"
                  value={context}
                  onChange={e => setContext(e.target.value)}
                  placeholder="Relevant link or short context"
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {submitError && <p className="text-sm text-red-600">{submitError}</p>}

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

        {/* Question History */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            Question History
          </h2>
          {localQuestions.length === 0 ? (
            <div className="border rounded-lg p-6 text-center">
              <p className="text-sm text-muted-foreground">
                No questions yet. Send your first question above.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {localQuestions.map(q => (
                <div key={q.id} className="border rounded-lg p-4">
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
                    <div className="mt-3 pt-3 border-t">
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
                        Deeper work is billed at a member rate per hour. No automatic charges. You approve scope and cost before any work begins.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Included Capabilities */}
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
                          Included with AI Advisor for Business
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
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Selected Member Tools</h3>
                  <p className="text-xs text-primary mt-1 font-medium">
                    Included with AI Advisor for Business
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Selected SubodhKC production-ready internal tools and utilities. Additional tools are added as they become available.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Governance & Controls — separated, NOT removed */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            Governance & Controls
          </h2>
          <div className="border rounded-lg p-5 bg-card space-y-4">
            <p className="text-sm text-muted-foreground">
              AI governance, compliance, and risk management resources. These are available as additional features alongside your advisory subscription.
            </p>

            {/* Governance attention items */}
            <div className="space-y-3">
              {governanceItems.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <item.icon className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium">{item.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                    <Link
                      href={item.action.href}
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-1.5"
                    >
                      {item.action.label}
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Governance tools grid */}
            <div className="pt-3 border-t">
              <h3 className="text-xs font-medium text-muted-foreground mb-3">Governance Tools</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {governanceTools.map((tool, i) => (
                  <Link
                    key={i}
                    href={tool.href}
                    className="flex items-center gap-2 border rounded-lg p-2.5 hover:bg-accent transition-colors"
                  >
                    <tool.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs font-medium">{tool.label}</span>
                    <ChevronRight className="h-3 w-3 text-muted-foreground ml-auto" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            Team
          </h2>
          <div className="border rounded-lg p-5 bg-card">
            <p className="text-sm text-muted-foreground mb-3">
              Up to {teamSeatLimit} organization members.
            </p>
            <div className="space-y-2">
              {members.map(m => (
                <div key={m.id} className="flex items-center justify-between py-2 border-b last:border-0">
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
        </section>

        {/* Billing */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            Billing
          </h2>
          <div className="border rounded-lg p-5 bg-card">
            {cancellationScheduled ? (
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Active until</span>{' '}
                  {new Date(entitlementValidUntil!).toLocaleDateString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric',
                  })}
                </p>
                <p className="text-sm text-muted-foreground">
                  Your subscription will end at the close of the current billing period.
                </p>
              </div>
            ) : (
              <p className="text-sm">
                <span className="font-medium">Active</span> — $99/month
              </p>
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
