'use client'

import Link from 'next/link'
import { Plus, FileText, Clock, CheckCircle2, Archive, AlertCircle } from 'lucide-react'
import { statusLabel, type WorkOrder } from '@/lib/commercial/work-order-types'

interface Props {
  orgSlug: string
  orgName: string
  needsInput: WorkOrder[]
  inProgress: WorkOrder[]
  delivered: WorkOrder[]
  drafts: WorkOrder[]
  history: WorkOrder[]
  totalCount: number
}

export default function WorkOrdersListClient({
  orgSlug,
  orgName,
  needsInput,
  inProgress,
  delivered,
  drafts,
  history,
  totalCount,
}: Props) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">AI Work Orders</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {orgName} · {totalCount} {totalCount === 1 ? 'Work Order' : 'Work Orders'}
            </p>
          </div>
          <Link
            href="/ai-automation"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New AI Work Order
          </Link>
        </div>

        {/* Needs Your Input */}
        {needsInput.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Needs Your Input
            </h2>
            <div className="space-y-3">
              {needsInput.map(wo => (
                <WorkOrderCard key={wo.id} wo={wo} orgSlug={orgSlug} highlight />
              ))}
            </div>
          </section>
        )}

        {/* In Progress */}
        {inProgress.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              In Progress
            </h2>
            <div className="space-y-3">
              {inProgress.map(wo => (
                <WorkOrderCard key={wo.id} wo={wo} orgSlug={orgSlug} />
              ))}
            </div>
          </section>
        )}

        {/* Drafts / Awaiting scope */}
        {drafts.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-muted-foreground" />
              Drafts &amp; Awaiting Scope
            </h2>
            <div className="space-y-3">
              {drafts.map(wo => (
                <WorkOrderCard key={wo.id} wo={wo} orgSlug={orgSlug} />
              ))}
            </div>
          </section>
        )}

        {/* Delivered */}
        {delivered.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Delivered
            </h2>
            <div className="space-y-3">
              {delivered.map(wo => (
                <WorkOrderCard key={wo.id} wo={wo} orgSlug={orgSlug} />
              ))}
            </div>
          </section>
        )}

        {/* History */}
        {history.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Archive className="w-5 h-5 text-muted-foreground" />
              History
            </h2>
            <div className="space-y-3">
              {history.map(wo => (
                <WorkOrderCard key={wo.id} wo={wo} orgSlug={orgSlug} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {totalCount === 0 && (
          <div className="text-center py-16 space-y-4">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">No Work Orders yet</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                AI Work Orders are bounded pieces of work with a defined outcome. $500 standard scope. Available through your AI Advisor relationship.
              </p>
            </div>
            <Link
              href="/ai-automation"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Start Your First Work Order
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function WorkOrderCard({ wo, orgSlug, highlight }: { wo: WorkOrder; orgSlug: string; highlight?: boolean }) {
  return (
    <Link
      href={`/app/${orgSlug}/work-orders/${wo.id}`}
      className={`block border rounded-lg p-4 hover:border-primary/50 transition-colors ${
        highlight ? 'border-orange-300 bg-orange-50/50' : 'border-border bg-card'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground">{wo.work_order_number}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              wo.status === 'needs_client_input' ? 'bg-orange-100 text-orange-700' :
              wo.status === 'delivered' || wo.status === 'completed' ? 'bg-green-100 text-green-700' :
              wo.status === 'in_progress' || wo.status === 'in_review' ? 'bg-blue-100 text-blue-700' :
              'bg-muted text-muted-foreground'
            }`}>
              {statusLabel(wo.status)}
            </span>
          </div>
          <h3 className="font-medium truncate">{wo.title}</h3>
          {wo.desired_outcome && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{wo.desired_outcome}</p>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="capitalize">{wo.work_type.replace(/_/g, ' ')}</span>
            <span>·</span>
            <span>{new Date(wo.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
