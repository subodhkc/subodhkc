'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Send, CheckCircle2, FileText, Clock } from 'lucide-react'
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

  const needsInput = workOrder.status === 'needs_client_input'
  const isDelivered = workOrder.status === 'delivered' || workOrder.status === 'completed'
  const showCheckout = workOrder.status === 'ready_for_checkout' || workOrder.status === 'awaiting_approval'

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

        {/* Checkout CTA */}
        {showCheckout && (
          <section className="border border-primary/30 rounded-lg p-5 bg-primary/5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Ready for checkout</h2>
                <p className="text-sm text-muted-foreground mt-1">$500 standard Work Order. Scope has been accepted.</p>
              </div>
              <Link
                href="/ai-automation"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
              >
                Continue to Payment
              </Link>
            </div>
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
        {isDelivered && (
          <section className="border border-green-300 rounded-lg p-5 bg-green-50/50">
            <h2 className="font-semibold flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Delivered
            </h2>
            <p className="text-sm text-muted-foreground">
              {workOrder.delivered_at
                ? `Delivered on ${new Date(workOrder.delivered_at).toLocaleDateString()}`
                : 'This Work Order has been delivered.'}
            </p>
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
      </div>
    </div>
  )
}
