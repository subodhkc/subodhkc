'use client'

import { useState } from 'react'
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
}

interface TeamMember {
  id: string
  role: string
  userId: string
  email: string
  fullName: string | null
}

interface AdvisorDeskWorkspaceClientProps {
  user: AuthenticatedUser
  ctx: OrganizationContext
  questions: Question[]
  remaining: number
  allowance: number
  currentPeriod: string
  members: TeamMember[]
  teamSeatLimit: number
  subscriptionStatus: string | null
  subscriptionMetadata: Record<string, unknown>
  entitlementValidUntil: string | null
  entitlementStatus: string
}

const statusLabels: Record<string, string> = {
  submitted: 'Received',
  under_review: 'Reviewing',
  answered: 'Answered',
  closed: 'Closed',
}

const statusColors: Record<string, string> = {
  submitted: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  under_review: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  answered: 'bg-green-500/10 text-green-600 border-green-500/20',
  closed: 'bg-muted text-muted-foreground border-border',
}

const attentionItems = [
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

const recommendedActions = [
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
  remaining,
  allowance,
  currentPeriod,
  members,
  teamSeatLimit,
  subscriptionStatus,
  subscriptionMetadata,
  entitlementValidUntil,
  entitlementStatus,
}: AdvisorDeskWorkspaceClientProps) {
  const { organization } = ctx
  const basePath = `/app/${organization.slug}`

  const [subject, setSubject] = useState('')
  const [question, setQuestion] = useState('')
  const [context, setContext] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [localQuestions, setLocalQuestions] = useState(questions)
  const [localRemaining, setLocalRemaining] = useState(remaining)
  const [portalLoading, setPortalLoading] = useState(false)

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
        body: JSON.stringify({ orgSlug: organization.slug }),
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
        if (data.error === 'allowance_exceeded') {
          setSubmitError(data.message || 'Your advisor question has been used for this billing period.')
        } else {
          setSubmitError(data.error || 'Failed to submit question')
        }
        setSubmitting(false)
        return
      }

      // Prepend new question to local state
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
        },
        ...prev,
      ])
      setLocalRemaining(data.remaining)
      setSubject('')
      setQuestion('')
      setContext('')
    } catch {
      setSubmitError('Network error. Please try again.')
    }
    setSubmitting(false)
  }

  const periodDate = new Date(currentPeriod + '-01')
  const periodLabel = periodDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const nextPeriodDate = new Date(periodDate.getFullYear(), periodDate.getMonth() + 1, 1)
  const nextPeriodLabel = nextPeriodDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

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
            <span className="text-sm font-medium">AI Advisor Desk</span>
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
          <h1 className="text-2xl font-bold tracking-tight">AI Advisor Desk</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ongoing AI guidance for {organization.name}
          </p>
        </div>

        {/* This Week */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            This Week
          </h2>
          <div className="border rounded-lg p-5 bg-card space-y-3">
            <p className="text-sm text-muted-foreground">
              Review areas that may need your attention this week. Use the tools below to check your posture.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/ai-risk-register"
                className="flex items-center justify-between border rounded-lg p-3 hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium">AI Risk Register</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link
                href="/ai-incident-evidence-checklist"
                className="flex items-center justify-between border rounded-lg p-3 hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Incident Evidence Checklist</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </div>
          </div>
        </section>

        {/* Worth Your Attention */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Worth Your Attention
          </h2>
          <div className="space-y-3">
            {attentionItems.map((item, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <item.icon className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    <Link
                      href={item.action.href}
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
                    >
                      {item.action.label}
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recommended Actions */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
            Recommended Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recommendedActions.map((action, i) => (
              <Link
                key={i}
                href={action.href}
                className="flex items-center gap-3 border rounded-lg p-3 hover:bg-accent transition-colors"
              >
                <action.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm font-medium">{action.label}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
              </Link>
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
              Have a focused AI decision that deserves a human look?
            </p>
            <p className="text-sm text-muted-foreground">
              Your plan includes one advisor-reviewed question each billing month.
            </p>

            {localRemaining > 0 ? (
              <form onSubmit={handleSubmitQuestion} className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1.5">
                    Subject
                  </label>
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
                  <label className="text-sm font-medium block mb-1.5">
                    Question
                  </label>
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
                  <label className="text-sm font-medium block mb-1.5">
                    Optional context
                  </label>
                  <input
                    type="text"
                    value={context}
                    onChange={e => setContext(e.target.value)}
                    placeholder="Relevant link or short context"
                    className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {submitError && (
                  <p className="text-sm text-red-600">{submitError}</p>
                )}

                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {localRemaining} advisor question{localRemaining !== 1 ? 's' : ''} available this billing period
                  </p>
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
            ) : (
              <div className="border rounded-lg p-4 bg-muted/30">
                <p className="text-sm text-muted-foreground">
                  Your included advisor question has been used.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  The next one becomes available on {nextPeriodLabel}.
                </p>
              </div>
            )}
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
                No questions yet. Ask your first question above.
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
                    {new Date(q.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
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
                          {new Date(q.responded_at).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric',
                          })}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
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
                    <p className="text-sm font-medium truncate">
                      {m.fullName || m.email}
                    </p>
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
