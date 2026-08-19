'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Send, CheckCircle2, FileText, Clock, Loader2, ExternalLink, Package } from 'lucide-react'
import {
  type WorkOrder,
  type WorkOrderUpdate,
  type WorkOrderScopeAcceptance,
} from '@/lib/commercial/work-order-types'

interface Props {
  orgSlug: string
  workOrder: WorkOrder
  updates: WorkOrderUpdate[]
  scopeAcceptance: WorkOrderScopeAcceptance | null
  statusLabel: string
  userId: string
}

interface Deliverable {
  id: string
  title: string
  description: string | null
  artifact_type: string
  artifact_url: string | null
  is_client_visible: boolean
  created_at: string
}

export default function WorkOrderDetailClient({
  orgSlug,
  workOrder,
  updates,
  scopeAcceptance,
  statusLabel: statusText,
  userId,
}: Props) {
  const [inputText, setInputText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [inputError, setInputError] = useState<string | null>(null)
  const [localUpdates, setLocalUpdates] = useState<WorkOrderUpdate[]>(updates)
  const [deliverables, setDeliverables] = useState<Deliverable[]>([])
  const [deliverablesLoading, setDeliverablesLoading] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [completeLoading, setCompleteLoading] = useState(false)
  const [completeError, setCompleteError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)
  const [scopeVersion, setScopeVersion] = useState<{
    id: string
    version_number: number
    scope_snapshot: {
      title?: string
      desired_outcome?: string
      scope_included?: string
      scope_excluded?: string
      required_inputs?: string
      deliverable_description?: string
      price_cents?: number
      currency?: string
      assumptions?: string[]
    }
    version_status: string
  } | null>(null)
  const [scopeLoading, setScopeLoading] = useState(false)
  const [acceptLoading, setAcceptLoading] = useState(false)
  const [acceptError, setAcceptError] = useState<string | null>(null)

  const needsInput = workOrder.status === 'needs_client_input'
  const isDelivered = workOrder.status === 'delivered'
  const isCompleted = workOrder.status === 'completed'
  const showCheckout = workOrder.status === 'ready_for_checkout'
  const awaitingAcceptance = workOrder.status === 'awaiting_client_acceptance' || workOrder.status === 'awaiting_approval'

  // Fetch deliverables when delivered or completed
  useEffect(() => {
    if (isDelivered || isCompleted) {
      setDeliverablesLoading(true)
      fetch(`/api/commercial/work-orders/${workOrder.id}/deliverables?orgSlug=${orgSlug}`)
        .then(r => r.ok ? r.json() : { deliverables: [] })
        .then(data => setDeliverables(Array.isArray(data.deliverables) ? data.deliverables : []))
        .catch(() => setDeliverables([]))
        .finally(() => setDeliverablesLoading(false))
    }
  }, [workOrder.id, orgSlug, isDelivered, isCompleted])

  // Fetch the current offered scope version when awaiting client acceptance
  useEffect(() => {
    if (awaitingAcceptance) {
      setScopeLoading(true)
      fetch(`/api/commercial/work-orders/${workOrder.id}/scope?orgSlug=${orgSlug}`)
        .then(r => r.ok ? r.json() : { currentScopeVersion: null })
        .then(data => setScopeVersion(data.currentScopeVersion || null))
        .catch(() => setScopeVersion(null))
        .finally(() => setScopeLoading(false))
    }
  }, [workOrder.id, orgSlug, awaitingAcceptance])

  async function submitInput() {
    if (!inputText.trim()) return
    setSubmitting(true)
    setInputError(null)
    try {
      const res = await fetch(`/api/commercial/work-orders/${workOrder.id}/input`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgSlug, body: inputText.trim() }),
      })
      if (!res.ok) {
        const data = await res.json()
        setInputError(data.error || 'Failed to submit')
        return
      }
      // Add to local state
      setLocalUpdates(prev => [...prev, {
        id: `temp-${Date.now()}`,
        work_order_id: workOrder.id,
        author_user_id: userId,
        author_role: 'client',
        update_type: 'client_input',
        body: inputText.trim(),
        previous_status: null,
        new_status: null,
        is_client_visible: true,
        created_at: new Date().toISOString(),
      }])
      setInputText('')
    } catch {
      setInputError('Network error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Back link */}
        <Link
          href={`/app/${orgSlug}/work-orders`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Work Orders
        </Link>

        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-muted-foreground">{workOrder.work_order_number}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              needsInput ? 'bg-orange-100 text-orange-700' :
              isDelivered ? 'bg-green-100 text-green-700' :
              workOrder.status === 'in_progress' || workOrder.status === 'in_review' ? 'bg-blue-100 text-blue-700' :
              'bg-muted text-muted-foreground'
            }`}>
              {statusText}
            </span>
          </div>
          <h1 className="text-2xl font-bold">{workOrder.title}</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="capitalize">{workOrder.work_type.replace(/_/g, ' ')}</span>
            <span>·</span>
            <span>Created {new Date(workOrder.created_at).toLocaleDateString()}</span>
            {workOrder.target_date && (
              <>
                <span>·</span>
                <span>Target: {new Date(workOrder.target_date).toLocaleDateString()}</span>
              </>
            )}
          </div>
        </div>

        {/* Defined Outcome */}
        {workOrder.desired_outcome && (
          <section className="border rounded-lg p-5 bg-card">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Defined Outcome</h2>
            <p className="text-sm">{workOrder.desired_outcome}</p>
          </section>
        )}

        {/* Scope */}
        {(workOrder.scope_included || workOrder.scope_excluded || workOrder.required_inputs || workOrder.deliverable_description) && (
          <section className="border rounded-lg p-5 bg-card space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Scope</h2>
            {workOrder.scope_included && (
              <div>
                <h3 className="text-xs font-medium text-green-700 mb-1">What is Included</h3>
                <p className="text-sm">{workOrder.scope_included}</p>
              </div>
            )}
            {workOrder.scope_excluded && (
              <div>
                <h3 className="text-xs font-medium text-red-700 mb-1">What is Excluded</h3>
                <p className="text-sm">{workOrder.scope_excluded}</p>
              </div>
            )}
            {workOrder.required_inputs && (
              <div>
                <h3 className="text-xs font-medium text-blue-700 mb-1">What I Need From You</h3>
                <p className="text-sm">{workOrder.required_inputs}</p>
              </div>
            )}
            {workOrder.deliverable_description && (
              <div>
                <h3 className="text-xs font-medium text-purple-700 mb-1">Expected Deliverable</h3>
                <p className="text-sm">{workOrder.deliverable_description}</p>
              </div>
            )}
            {scopeAcceptance && (
              <div className="pt-2 border-t text-xs text-muted-foreground">
                Scope accepted on {new Date(scopeAcceptance.accepted_at).toLocaleDateString()} · ${(scopeAcceptance.price_cents / 100).toFixed(0)} {scopeAcceptance.currency}
              </div>
            )}
          </section>
        )}

        {/* Scope acceptance — customer must explicitly accept the exact
            immutable scope version before checkout is allowed (Section D) */}
        {awaitingAcceptance && (
          <section className="border border-primary/30 rounded-lg p-5 bg-primary/5 space-y-4">
            <h2 className="font-semibold">Review and accept your scope</h2>
            <p className="text-sm text-muted-foreground">
              Your scope has been prepared. Review it carefully. You must accept this exact scope before payment. The scope cannot be changed after acceptance without a new version.
            </p>
            {scopeLoading ? (
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading scope...
              </div>
            ) : scopeVersion ? (
              <div className="space-y-3 border rounded-lg p-4 bg-background">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-muted-foreground">Scope v{scopeVersion.version_number}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">{scopeVersion.version_status.replace(/_/g, ' ')}</span>
                </div>
                {scopeVersion.scope_snapshot?.title && (
                  <div><h3 className="text-xs font-medium text-muted-foreground mb-1">Title</h3><p className="text-sm">{scopeVersion.scope_snapshot.title}</p></div>
                )}
                {scopeVersion.scope_snapshot?.desired_outcome && (
                  <div><h3 className="text-xs font-medium text-muted-foreground mb-1">Defined Outcome</h3><p className="text-sm">{scopeVersion.scope_snapshot.desired_outcome}</p></div>
                )}
                {scopeVersion.scope_snapshot?.scope_included && (
                  <div><h3 className="text-xs font-medium text-green-700 mb-1">What is Included</h3><p className="text-sm">{scopeVersion.scope_snapshot.scope_included}</p></div>
                )}
                {scopeVersion.scope_snapshot?.scope_excluded && (
                  <div><h3 className="text-xs font-medium text-red-700 mb-1">What is Excluded</h3><p className="text-sm">{scopeVersion.scope_snapshot.scope_excluded}</p></div>
                )}
                {scopeVersion.scope_snapshot?.required_inputs && (
                  <div><h3 className="text-xs font-medium text-blue-700 mb-1">What I Need From You</h3><p className="text-sm">{scopeVersion.scope_snapshot.required_inputs}</p></div>
                )}
                {scopeVersion.scope_snapshot?.deliverable_description && (
                  <div><h3 className="text-xs font-medium text-purple-700 mb-1">Expected Deliverable</h3><p className="text-sm">{scopeVersion.scope_snapshot.deliverable_description}</p></div>
                )}
                {scopeVersion.scope_snapshot?.assumptions && scopeVersion.scope_snapshot.assumptions.length > 0 && (
                  <div>
                    <h3 className="text-xs font-medium text-muted-foreground mb-1">Assumptions</h3>
                    <ul className="text-sm list-disc pl-5 space-y-1">
                      {scopeVersion.scope_snapshot.assumptions.map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                  </div>
                )}
                <div className="pt-2 border-t text-sm font-medium">
                  Price: ${(scopeVersion.scope_snapshot?.price_cents ? scopeVersion.scope_snapshot.price_cents / 100 : 500).toFixed(0)} {scopeVersion.scope_snapshot?.currency || 'USD'}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No scope version is currently available.</p>
            )}
            {acceptError && <p className="text-xs text-red-600">{acceptError}</p>}
            <button
              onClick={async () => {
                if (!scopeVersion) return
                setAcceptLoading(true)
                setAcceptError(null)
                try {
                  const res = await fetch(`/api/commercial/work-orders/${workOrder.id}/scope/accept`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orgSlug, scopeVersionId: scopeVersion.id, accept: true }),
                  })
                  if (!res.ok) {
                    const data = await res.json().catch(() => ({}))
                    throw new Error(data.error || data.message || 'Failed to accept scope')
                  }
                  setActionSuccess('Scope accepted. Redirecting...')
                  setTimeout(() => window.location.reload(), 1200)
                } catch (err: any) {
                  setAcceptError(err.message)
                } finally {
                  setAcceptLoading(false)
                }
              }}
              disabled={acceptLoading || !scopeVersion}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {acceptLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Accept This Scope
            </button>
          </section>
        )}

        {/* Checkout CTA */}
        {showCheckout && (
          <section className="border border-primary/30 rounded-lg p-5 bg-primary/5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Ready for checkout</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  ${(workOrder.standard_price_cents ? workOrder.standard_price_cents / 100 : 500).toFixed(0)} Work Order. Scope has been prepared.
                </p>
              </div>
              <button
                onClick={async () => {
                  setCheckoutLoading(true)
                  setCheckoutError(null)
                  try {
                    const res = await fetch('/api/commercial/work-orders/checkout', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ orgSlug, workOrderId: workOrder.id }),
                    })
                    if (!res.ok) {
                      const data = await res.json().catch(() => ({}))
                      throw new Error(data.error || 'Checkout failed')
                    }
                    const data = await res.json()
                    if (data.url) {
                      window.location.href = data.url
                    }
                  } catch (err: any) {
                    setCheckoutError(err.message)
                  } finally {
                    setCheckoutLoading(false)
                  }
                }}
                disabled={checkoutLoading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
              >
                {checkoutLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Continue to Payment
              </button>
            </div>
            {checkoutError && <p className="text-xs text-red-600 mt-2">{checkoutError}</p>}
          </section>
        )}

        {/* Needs Input — dominant action */}
        {needsInput && (
          <section className="border border-orange-300 rounded-lg p-5 bg-orange-50/50">
            <h2 className="font-semibold flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-orange-500" />
              Your input is needed
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Subodh has requested additional information to continue this Work Order.
            </p>
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Provide the requested information..."
              className="w-full min-h-24 p-3 border rounded-lg text-sm resize-y bg-background"
              disabled={submitting}
            />
            {inputError && <p className="text-xs text-red-600 mt-2">{inputError}</p>}
            <button
              onClick={submitInput}
              disabled={submitting || !inputText.trim()}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Sending...' : 'Send Response'}
            </button>
          </section>
        )}

        {/* Deliverable / Result */}
        {(isDelivered || isCompleted) && (
          <section className="border border-green-300 rounded-lg p-5 bg-green-50/50 space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              {isCompleted ? 'Completed' : 'Delivered'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {workOrder.delivered_at
                ? `Delivered on ${new Date(workOrder.delivered_at).toLocaleDateString()}`
                : 'This Work Order has been delivered.'}
            </p>

            {/* Deliverables list */}
            {deliverablesLoading ? (
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading deliverables...
              </div>
            ) : deliverables.length > 0 ? (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Deliverables</h3>
                {deliverables.map(d => (
                  <div key={d.id} className="border rounded-lg p-3 bg-background">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <h4 className="text-sm font-medium">{d.title}</h4>
                        </div>
                        {d.description && <p className="text-xs text-muted-foreground mt-1">{d.description}</p>}
                        <span className="text-xs text-muted-foreground capitalize mt-1 inline-block">{d.artifact_type.replace(/_/g, ' ')}</span>
                      </div>
                      {d.artifact_url && (
                        <a
                          href={d.artifact_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline inline-flex items-center gap-1 flex-shrink-0"
                        >
                          Open <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {/* Mark complete button — only when delivered, not yet completed */}
            {isDelivered && !isCompleted && (
              <div className="pt-2 border-t">
                <button
                  onClick={async () => {
                    setCompleteLoading(true)
                    setCompleteError(null)
                    try {
                      const res = await fetch(`/api/commercial/work-orders/${workOrder.id}/complete`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ orgSlug }),
                      })
                      if (!res.ok) {
                        const data = await res.json().catch(() => ({}))
                        throw new Error(data.error || 'Failed to mark complete')
                      }
                      setActionSuccess('Work Order marked as complete')
                      // Reload to show completed state
                      setTimeout(() => window.location.reload(), 1500)
                    } catch (err: any) {
                      setCompleteError(err.message)
                    } finally {
                      setCompleteLoading(false)
                    }
                  }}
                  disabled={completeLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                >
                  {completeLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Mark as Complete
                </button>
                {completeError && <p className="text-xs text-red-600 mt-2">{completeError}</p>}
              </div>
            )}
          </section>
        )}

        {/* Updates / History */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Updates</h2>
          {localUpdates.length === 0 ? (
            <p className="text-sm text-muted-foreground">No updates yet.</p>
          ) : (
            <div className="space-y-3">
              {localUpdates.map(update => (
                <div key={update.id} className="border rounded-lg p-4 bg-card">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      update.author_role === 'advisor' || update.author_role === 'platform_admin'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {update.author_role === 'client' ? 'You' : update.author_role === 'advisor' ? 'Advisor' : 'System'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(update.created_at).toLocaleString()}
                    </span>
                    {update.new_status && update.previous_status && (
                      <span className="text-xs text-muted-foreground">
                        · {update.previous_status} → {update.new_status}
                      </span>
                    )}
                  </div>
                  {update.body && <p className="text-sm">{update.body}</p>}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Input form for non-needs-input states */}
        {!needsInput && !showCheckout && !isDelivered && workOrder.status !== 'draft' && workOrder.status !== 'awaiting_scope' && (
          <section className="border rounded-lg p-5 bg-card">
            <h2 className="text-sm font-semibold mb-2">Add a comment</h2>
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Add context, ask a question, or provide information..."
              className="w-full min-h-20 p-3 border rounded-lg text-sm resize-y bg-background"
              disabled={submitting}
            />
            {inputError && <p className="text-xs text-red-600 mt-2">{inputError}</p>}
            <button
              onClick={submitInput}
              disabled={submitting || !inputText.trim()}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Sending...' : 'Send'}
            </button>
          </section>
        )}

        {/* Success toast */}
        {actionSuccess && (
          <div className="fixed bottom-4 right-4 z-50 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-700 flex items-center gap-2 shadow-lg">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}
      </div>
    </div>
  )
}
