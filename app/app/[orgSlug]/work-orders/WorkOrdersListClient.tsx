'use client'

import Link from 'next/link'
import { Plus, FileText, Clock, CheckCircle2, Archive, AlertCircle, ArrowRight } from 'lucide-react'
import { statusLabel, statusActionLabel, type WorkOrder } from '@/lib/commercial/work-order-types'

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
                A Work Order is a focused investigation of one workflow or opportunity. $500 standard scope.
                If the work is larger, it will be scoped before additional work begins.
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
      className={`block border rounded-lg p-4 hover:bg-accent/5 transition-colors group ${
        highlight ? 'border-orange-300/50 bg-orange-50/30' : 'border-border'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70">{wo.work_order_number}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              wo.status === 'needs_client_input' ? 'bg-orange-500/10 text-orange-600' :
              wo.status === 'delivered' || wo.status === 'completed' ? 'bg-green-500/10 text-green-600' :
              wo.status === 'in_progress' || wo.status === 'in_review' ? 'bg-blue-500/10 text-blue-600' :
              'bg-muted text-muted-foreground'
            }`}>
              {statusLabel(wo.status)}
            </span>
          </div>
          <h3 className="font-medium text-sm truncate">{wo.title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{statusActionLabel(wo.status)}</p>
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <span className="capitalize">{wo.work_type.replace(/_/g, ' ')}</span>
            <span className="text-muted-foreground/40">·</span>
            <span>Updated {new Date(wo.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-0.5" />
      </div>
    </Link>
  )
}
