'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  AlertCircle, Users, Activity, Calendar, Clock, AlertTriangle,
  CheckCircle2, Loader2, RefreshCw, ExternalLink, HeartPulse,
  Inbox, Filter, FileText, Sun, MessageSquare, Send, Play,
  Upload, Package, Check, X, ChevronRight,
} from 'lucide-react'

// ---------- Types ----------

interface AdvisorClient {
  id: string
  organization: string
  orgSlug: string
  customer: string
  plan: string
  billing: string
  status: string
  onboarding: string
  haiec: string
  kestrel: string
  latestRequest: string | null
  responseAging: string
  nextSession: string | null
  decisions: number
  opportunities: number
  actionsOverdue: number
  brief: string
  lifecycleState: string
  lastInteraction: string | null
}

interface QueueItem {
  id: string
  organization: string
  orgSlug: string
  type: string
  priority: 'high' | 'medium' | 'low'
  age: string
  ageHours: number
  targetDate: string | null
  status: string
  title: string
  link: string
}

interface HealthIndicator {
  label: string
  value: string
  severity: 'ok' | 'warning' | 'critical' | 'info'
}

interface HealthOrg {
  id: string
  organization: string
  orgSlug: string
  indicators: HealthIndicator[]
}

interface AdvisorWorkOrder {
  id: string
  work_order_number: string
  organization_id: string
  organization_name: string
  organization_slug: string
  title: string
  work_type: string
  status: string
  scope_status: string
  desired_outcome: string | null
  standard_price_cents: number | null
  created_at: string
  scope_accepted_at: string | null
  delivered_at: string | null
  completed_at: string | null
  customer_email: string | null
}

type ClientFilter =
  | 'all'
  | 'needs_attention'
  | 'advisor_desk'
  | 'fractional'
  | 'new_customers'
  | 'waiting_on_client'
  | 'waiting_on_advisor'
  | 'provisioning_failed'
  | 'payment_issue'
  | 'canceling'
  | 'read_only'

// ---------- Component ----------

export function AdvisorOperationsClient() {
  const [activeView, setActiveView] = useState<'today' | 'clients' | 'queue' | 'health' | 'work-orders'>('today')
  const [filter, setFilter] = useState<ClientFilter>('all')

  const [clients, setClients] = useState<AdvisorClient[]>([])
  const [clientsLoading, setClientsLoading] = useState(false)
  const [clientsError, setClientsError] = useState<string | null>(null)

  const [queue, setQueue] = useState<QueueItem[]>([])
  const [queueLoading, setQueueLoading] = useState(false)
  const [queueError, setQueueError] = useState<string | null>(null)

  const [health, setHealth] = useState<HealthOrg[]>([])
  const [healthLoading, setHealthLoading] = useState(false)
  const [healthError, setHealthError] = useState<string | null>(null)

  const [workOrders, setWorkOrders] = useState<AdvisorWorkOrder[]>([])
  const [workOrdersLoading, setWorkOrdersLoading] = useState(false)
  const [workOrdersError, setWorkOrdersError] = useState<string | null>(null)

  // Action panel state
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  const fetchClients = useCallback(async (f: ClientFilter) => {
    setClientsLoading(true)
    setClientsError(null)
    try {
      const res = await fetch(`/api/admin/advisor-operations?view=clients&filter=${f}`)
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Failed to load clients (${res.status})`)
      }
      const data = await res.json()
      setClients(Array.isArray(data.clients) ? data.clients : [])
    } catch (err: unknown) {
      setClientsError(err instanceof Error ? err.message : 'Failed to load clients')
      setClients([])
    } finally {
      setClientsLoading(false)
    }
  }, [])

  const fetchQueue = useCallback(async () => {
    setQueueLoading(true)
    setQueueError(null)
    try {
      const res = await fetch('/api/admin/advisor-operations?view=queue')
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Failed to load queue (${res.status})`)
      }
      const data = await res.json()
      setQueue(Array.isArray(data.items) ? data.items : [])
    } catch (err: unknown) {
      setQueueError(err instanceof Error ? err.message : 'Failed to load queue')
      setQueue([])
    } finally {
      setQueueLoading(false)
    }
  }, [])

  const fetchHealth = useCallback(async () => {
    setHealthLoading(true)
    setHealthError(null)
    try {
      const res = await fetch('/api/admin/advisor-operations?view=health')
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Failed to load health (${res.status})`)
      }
      const data = await res.json()
      setHealth(Array.isArray(data.orgs) ? data.orgs : [])
    } catch (err: unknown) {
      setHealthError(err instanceof Error ? err.message : 'Failed to load health')
      setHealth([])
    } finally {
      setHealthLoading(false)
    }
  }, [])

  const fetchWorkOrders = useCallback(async () => {
    setWorkOrdersLoading(true)
    setWorkOrdersError(null)
    try {
      const res = await fetch('/api/admin/advisor-operations?view=work-orders')
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Failed to load work orders (${res.status})`)
      }
      const data = await res.json()
      setWorkOrders(Array.isArray(data.workOrders) ? data.workOrders : [])
    } catch (err: unknown) {
      setWorkOrdersError(err instanceof Error ? err.message : 'Failed to load work orders')
      setWorkOrders([])
    } finally {
      setWorkOrdersLoading(false)
    }
  }, [])

  // Fetch clients on mount and when filter changes
  useEffect(() => {
    if (activeView === 'clients') {
      fetchClients(filter)
    }
  }, [filter, activeView, fetchClients])

  // Today view fetches both queue and work orders on mount
  useEffect(() => {
    if (activeView === 'today') {
      fetchQueue()
      fetchWorkOrders()
    }
  }, [activeView, fetchQueue, fetchWorkOrders])

  // Fetch queue/health/work-orders when their tab is first opened
  useEffect(() => {
    if (activeView === 'queue' && queue.length === 0 && !queueLoading && !queueError) {
      fetchQueue()
    }
    if (activeView === 'health' && health.length === 0 && !healthLoading && !healthError) {
      fetchHealth()
    }
    if (activeView === 'work-orders' && workOrders.length === 0 && !workOrdersLoading && !workOrdersError) {
      fetchWorkOrders()
    }
  }, [activeView, queue.length, queueLoading, queueError, health.length, healthLoading, healthError, fetchQueue, fetchHealth, workOrders.length, workOrdersLoading, workOrdersError, fetchWorkOrders])

  const highCount = queue.filter(q => q.priority === 'high').length

  return (
    <div className="space-y-4">
      {/* View tabs */}
      <div className="flex gap-1 border-b overflow-x-auto">
        <ViewTab
          active={activeView === 'today'}
          onClick={() => setActiveView('today')}
          icon={Sun}
          label={`Today${highCount > 0 ? ` (${highCount})` : ''}`}
        />
        <ViewTab
          active={activeView === 'clients'}
          onClick={() => setActiveView('clients')}
          icon={Users}
          label="Clients"
        />
        <ViewTab
          active={activeView === 'queue'}
          onClick={() => setActiveView('queue')}
          icon={Inbox}
          label={`Attention Queue${highCount > 0 ? ` (${highCount})` : ''}`}
        />
        <ViewTab
          active={activeView === 'health'}
          onClick={() => setActiveView('health')}
          icon={HeartPulse}
          label="Health"
        />
        <ViewTab
          active={activeView === 'work-orders'}
          onClick={() => setActiveView('work-orders')}
          icon={FileText}
          label="Work Orders"
        />
      </div>

      {/* Today view */}
      {activeView === 'today' && (
        <TodayView
          queue={queue}
          queueLoading={queueLoading}
          queueError={queueError}
          workOrders={workOrders}
          workOrdersLoading={workOrdersLoading}
          workOrdersError={workOrdersError}
          onRefresh={() => { fetchQueue(); fetchWorkOrders() }}
          onOpenQuestion={(id) => { setSelectedQuestionId(id); setSelectedWorkOrderId(null) }}
          onOpenWorkOrder={(id) => { setSelectedWorkOrderId(id); setSelectedQuestionId(null) }}
        />
      )}

      {/* Action panels */}
      {selectedQuestionId && (
        <QuestionActionPanel
          questionId={selectedQuestionId}
          onClose={() => { setSelectedQuestionId(null); setActionError(null); setActionSuccess(null) }}
          onSuccess={(msg) => { setActionSuccess(msg); fetchQueue(); fetchWorkOrders() }}
        />
      )}
      {selectedWorkOrderId && (
        <WorkOrderActionPanel
          workOrderId={selectedWorkOrderId}
          workOrders={workOrders}
          onClose={() => { setSelectedWorkOrderId(null); setActionError(null); setActionSuccess(null) }}
          onSuccess={(msg) => { setActionSuccess(msg); fetchQueue(); fetchWorkOrders() }}
        />
      )}
      {actionSuccess && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-700 flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          <span>{actionSuccess}</span>
          <button onClick={() => setActionSuccess(null)} className="ml-2 opacity-60 hover:opacity-100">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Clients view */}
      {activeView === 'clients' && (
        <div className="space-y-4">
          {/* Filter buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
              <Filter className="h-3 w-3" />
              Filter:
            </span>
            <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} label="All" />
            <FilterButton active={filter === 'needs_attention'} onClick={() => setFilter('needs_attention')} label="Needs Attention" />
            <FilterButton active={filter === 'advisor_desk'} onClick={() => setFilter('advisor_desk')} label="$99 Advisor" />
            <FilterButton active={filter === 'fractional'} onClick={() => setFilter('fractional')} label="Fractional" />
            <FilterButton active={filter === 'new_customers'} onClick={() => setFilter('new_customers')} label="New Customers" />
            <FilterButton active={filter === 'waiting_on_client'} onClick={() => setFilter('waiting_on_client')} label="Waiting on Client" />
            <FilterButton active={filter === 'waiting_on_advisor'} onClick={() => setFilter('waiting_on_advisor')} label="Waiting on Advisor" />
            <FilterButton active={filter === 'provisioning_failed'} onClick={() => setFilter('provisioning_failed')} label="Provisioning Failed" />
            <FilterButton active={filter === 'payment_issue'} onClick={() => setFilter('payment_issue')} label="Payment Issue" />
            <FilterButton active={filter === 'canceling'} onClick={() => setFilter('canceling')} label="Canceling" />
            <FilterButton active={filter === 'read_only'} onClick={() => setFilter('read_only')} label="Read-Only" />
          </div>

          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">
              Advisory Clients {clients.length > 0 && `(${clients.length})`}
            </h3>
            <button
              onClick={() => fetchClients(filter)}
              disabled={clientsLoading}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className={`h-3 w-3 ${clientsLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {clientsLoading && (
            <div className="border rounded-lg p-8 text-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading clients...</p>
            </div>
          )}

          {clientsError && !clientsLoading && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Failed to load clients</p>
                <p className="text-xs mt-1 opacity-90">{clientsError}</p>
                <button
                  onClick={() => fetchClients(filter)}
                  className="text-xs underline mt-2"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {!clientsLoading && !clientsError && clients.length === 0 && (
            <div className="border rounded-lg p-8 text-center">
              <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No clients match this filter.</p>
            </div>
          )}

          {!clientsLoading && !clientsError && clients.length > 0 && (
            <div className="border rounded-lg overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b">
                  <tr className="text-left text-xs text-muted-foreground">
                    <Th>Organization</Th>
                    <Th>Customer</Th>
                    <Th>Plan</Th>
                    <Th>Billing</Th>
                    <Th>Status</Th>
                    <Th>Onboarding</Th>
                    <Th>HAIEC</Th>
                    <Th>Kestrel</Th>
                    <Th>Latest Request</Th>
                    <Th>Response Aging</Th>
                    <Th>Next Session</Th>
                    <Th>Decisions</Th>
                    <Th>Opportunities</Th>
                    <Th>Actions Overdue</Th>
                    <Th>Brief</Th>
                    <Th>Lifecycle State</Th>
                    <Th>Last Interaction</Th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((c) => (
                    <tr key={c.id} className="border-b last:border-0 hover:bg-accent/5">
                      <Td>
                        <a href={`/app/${c.orgSlug}`} className="text-primary hover:underline font-medium">
                          {c.organization}
                        </a>
                      </Td>
                      <Td>{c.customer}</Td>
                      <Td>{c.plan}</Td>
                      <Td>{c.billing}</Td>
                      <Td>
                        <StatusBadge status={c.status} />
                      </Td>
                      <Td>{c.onboarding}</Td>
                      <Td>{c.haiec}</Td>
                      <Td>{c.kestrel}</Td>
                      <Td>{c.latestRequest || '—'}</Td>
                      <Td>
                        <ResponseAgingBadge value={c.responseAging} />
                      </Td>
                      <Td>{c.nextSession || '—'}</Td>
                      <Td>{c.decisions}</Td>
                      <Td>{c.opportunities}</Td>
                      <Td>
                        <span className={c.actionsOverdue > 0 ? 'text-red-600 font-medium' : ''}>
                          {c.actionsOverdue}
                        </span>
                      </Td>
                      <Td className="max-w-[200px] truncate" title={c.brief}>{c.brief}</Td>
                      <Td>{c.lifecycleState}</Td>
                      <Td>{c.lastInteraction || '—'}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Attention Queue view */}
      {activeView === 'queue' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">
              Attention Queue {queue.length > 0 && `(${queue.length})`}
            </h3>
            <button
              onClick={() => fetchQueue()}
              disabled={queueLoading}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className={`h-3 w-3 ${queueLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {queueLoading && (
            <div className="border rounded-lg p-8 text-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading queue...</p>
            </div>
          )}

          {queueError && !queueLoading && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Failed to load queue</p>
                <p className="text-xs mt-1 opacity-90">{queueError}</p>
                <button
                  onClick={() => fetchQueue()}
                  className="text-xs underline mt-2"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {!queueLoading && !queueError && queue.length === 0 && (
            <div className="border rounded-lg p-8 text-center">
              <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Queue is clear. Nothing needs attention.</p>
            </div>
          )}

          {!queueLoading && !queueError && queue.length > 0 && (
            <div className="border rounded-lg overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b">
                  <tr className="text-left text-xs text-muted-foreground">
                    <Th>Organization</Th>
                    <Th>Type</Th>
                    <Th>Priority</Th>
                    <Th>Age</Th>
                    <Th>Target Date</Th>
                    <Th>Status</Th>
                    <Th>Title</Th>
                    <Th>Link</Th>
                  </tr>
                </thead>
                <tbody>
                  {queue.map((q) => (
                    <tr key={q.id} className="border-b last:border-0 hover:bg-accent/5">
                      <Td>
                        <a href={`/app/${q.orgSlug}`} className="text-primary hover:underline font-medium">
                          {q.organization}
                        </a>
                      </Td>
                      <Td>{q.type}</Td>
                      <Td>
                        <PriorityBadge priority={q.priority} />
                      </Td>
                      <Td>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {q.age}
                        </span>
                      </Td>
                      <Td>
                        {q.targetDate ? (
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {q.targetDate}
                          </span>
                        ) : '—'}
                      </Td>
                      <Td>
                        <StatusBadge status={q.status} />
                      </Td>
                      <Td className="max-w-[260px] truncate" title={q.title}>{q.title}</Td>
                      <Td>
                        <a
                          href={q.link}
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          Open
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Health view */}
      {activeView === 'health' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm">Client Health Indicators</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Transparent operational facts, not AI scores.
              </p>
            </div>
            <button
              onClick={() => fetchHealth()}
              disabled={healthLoading}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className={`h-3 w-3 ${healthLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {healthLoading && (
            <div className="border rounded-lg p-8 text-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading health...</p>
            </div>
          )}

          {healthError && !healthLoading && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Failed to load health</p>
                <p className="text-xs mt-1 opacity-90">{healthError}</p>
                <button
                  onClick={() => fetchHealth()}
                  className="text-xs underline mt-2"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {!healthLoading && !healthError && health.length === 0 && (
            <div className="border rounded-lg p-8 text-center">
              <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No health data available.</p>
            </div>
          )}

          {!healthLoading && !healthError && health.length > 0 && (
            <div className="space-y-3">
              {health.map((org) => (
                <div key={org.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <a
                      href={`/app/${org.orgSlug}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {org.organization}
                    </a>
                    <span className="text-xs text-muted-foreground">
                      {org.indicators.length} indicators
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {org.indicators.map((ind, idx) => (
                      <div
                        key={`${org.id}-${idx}`}
                        className="flex items-center justify-between rounded-md border px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">{ind.label}</p>
                          <p className="text-sm font-medium truncate">{ind.value}</p>
                        </div>
                        <SeverityBadge severity={ind.severity} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeView === 'work-orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm">AI Work Orders</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                All Work Orders across all organizations.
              </p>
            </div>
            <button
              onClick={() => fetchWorkOrders()}
              disabled={workOrdersLoading}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className={`h-3 w-3 ${workOrdersLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {workOrdersLoading && (
            <div className="border rounded-lg p-8 text-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading Work Orders...</p>
            </div>
          )}

          {workOrdersError && !workOrdersLoading && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Failed to load Work Orders</p>
                <p className="text-xs mt-1 opacity-90">{workOrdersError}</p>
                <button onClick={() => fetchWorkOrders()} className="text-xs underline mt-2">
                  Try again
                </button>
              </div>
            </div>
          )}

          {!workOrdersLoading && !workOrdersError && workOrders.length === 0 && (
            <div className="border rounded-lg p-8 text-center">
              <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No Work Orders yet.</p>
            </div>
          )}

          {!workOrdersLoading && !workOrdersError && workOrders.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-xs text-muted-foreground">
                  <tr>
                    <th className="text-left p-3 font-medium">WO #</th>
                    <th className="text-left p-3 font-medium">Organization</th>
                    <th className="text-left p-3 font-medium">Title</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Scope</th>
                    <th className="text-left p-3 font-medium">Created</th>
                    <th className="text-left p-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {workOrders.map(wo => (
                    <tr key={wo.id} className="hover:bg-muted/30">
                      <td className="p-3 font-mono text-xs">{wo.work_order_number}</td>
                      <td className="p-3">
                        <a href={`/app/${wo.organization_slug}`} className="text-primary hover:underline">
                          {wo.organization_name}
                        </a>
                      </td>
                      <td className="p-3 max-w-xs truncate">{wo.title}</td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          wo.status === 'needs_client_input' ? 'bg-orange-100 text-orange-700' :
                          wo.status === 'delivered' || wo.status === 'completed' ? 'bg-green-100 text-green-700' :
                          wo.status === 'in_progress' || wo.status === 'in_review' ? 'bg-blue-100 text-blue-700' :
                          wo.status === 'payment_pending' ? 'bg-amber-100 text-amber-700' :
                          wo.status === 'awaiting_scope' ? 'bg-purple-100 text-purple-700' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {wo.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground">{wo.scope_status.replace(/_/g, ' ')}</td>
                      <td className="p-3 text-xs text-muted-foreground">{new Date(wo.created_at).toLocaleDateString()}</td>
                      <td className="p-3">
                        <a href={`/app/${wo.organization_slug}/work-orders/${wo.id}`} className="text-xs text-primary hover:underline">
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ---------- Today View ----------

function TodayView({
  queue, queueLoading, queueError,
  workOrders, workOrdersLoading, workOrdersError,
  onRefresh, onOpenQuestion, onOpenWorkOrder,
}: {
  queue: QueueItem[]
  queueLoading: boolean
  queueError: string | null
  workOrders: AdvisorWorkOrder[]
  workOrdersLoading: boolean
  workOrdersError: string | null
  onRefresh: () => void
  onOpenQuestion: (id: string) => void
  onOpenWorkOrder: (id: string) => void
}) {
  const loading = queueLoading || workOrdersLoading
  const error = queueError || workOrdersError

  // Group queue items
  const highPriority = queue.filter(q => q.priority === 'high')
  const todayItems = queue.filter(q => q.priority === 'medium')
  const waitingOnClient = queue.filter(q => q.priority === 'low')

  // Group work orders by actionable status
  const woNeedsScope = workOrders.filter(wo => wo.status === 'awaiting_scope' || wo.status === 'draft')
  const woPaidNotStarted = workOrders.filter(wo => wo.status === 'paid' || wo.status === 'scoped')
  const woInProgress = workOrders.filter(wo => wo.status === 'in_progress' || wo.status === 'in_review')
  const woNeedsInput = workOrders.filter(wo => wo.status === 'needs_client_input')
  const woDelivered = workOrders.filter(wo => wo.status === 'delivered')

  if (loading && queue.length === 0 && workOrders.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Loading today's queue...</p>
      </div>
    )
  }

  if (error && queue.length === 0 && workOrders.length === 0) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive flex items-start gap-2">
        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium">Failed to load</p>
          <p className="text-xs mt-1 opacity-90">{error}</p>
          <button onClick={onRefresh} className="text-xs underline mt-2">Try again</button>
        </div>
      </div>
    )
  }

  const isEmpty = highPriority.length === 0 && todayItems.length === 0 && waitingOnClient.length === 0
    && woNeedsScope.length === 0 && woPaidNotStarted.length === 0 && woInProgress.length === 0
    && woNeedsInput.length === 0 && woDelivered.length === 0

  if (isEmpty) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">All clear. Nothing needs attention today.</p>
        <button onClick={onRefresh} className="text-xs text-muted-foreground hover:text-foreground mt-3 inline-flex items-center gap-1">
          <RefreshCw className="h-3 w-3" /> Refresh
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm">Today's Operating Queue</h3>
          <p className="text-xs text-muted-foreground mt-0.5">What needs my attention right now.</p>
        </div>
        <button onClick={onRefresh} disabled={loading} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* HIGH PRIORITY */}
      {highPriority.length > 0 && (
        <TodayGroup title="High Priority" count={highPriority.length} accent="red">
          {highPriority.map(q => (
            <TodayQueueRow key={q.id} item={q} onOpenQuestion={onOpenQuestion} />
          ))}
        </TodayGroup>
      )}

      {/* WORK ORDERS NEEDING SCOPE */}
      {woNeedsScope.length > 0 && (
        <TodayGroup title="Work Orders — Scope Needed" count={woNeedsScope.length} accent="purple">
          {woNeedsScope.map(wo => (
            <TodayWorkOrderRow key={wo.id} wo={wo} onOpen={onOpenWorkOrder} actionLabel="Compose Scope" actionIcon={FileText} />
          ))}
        </TodayGroup>
      )}

      {/* PAID NOT STARTED */}
      {woPaidNotStarted.length > 0 && (
        <TodayGroup title="Paid — Ready to Start" count={woPaidNotStarted.length} accent="blue">
          {woPaidNotStarted.map(wo => (
            <TodayWorkOrderRow key={wo.id} wo={wo} onOpen={onOpenWorkOrder} actionLabel="Start Work" actionIcon={Play} />
          ))}
        </TodayGroup>
      )}

      {/* TODAY ITEMS */}
      {todayItems.length > 0 && (
        <TodayGroup title="Today" count={todayItems.length} accent="amber">
          {todayItems.map(q => (
            <TodayQueueRow key={q.id} item={q} onOpenQuestion={onOpenQuestion} />
          ))}
        </TodayGroup>
      )}

      {/* IN PROGRESS */}
      {woInProgress.length > 0 && (
        <TodayGroup title="In Progress" count={woInProgress.length} accent="blue">
          {woInProgress.map(wo => (
            <TodayWorkOrderRow key={wo.id} wo={wo} onOpen={onOpenWorkOrder} actionLabel="Open" actionIcon={ChevronRight} />
          ))}
        </TodayGroup>
      )}

      {/* NEEDS CLIENT INPUT */}
      {woNeedsInput.length > 0 && (
        <TodayGroup title="Waiting on Client Input" count={woNeedsInput.length} accent="orange">
          {woNeedsInput.map(wo => (
            <TodayWorkOrderRow key={wo.id} wo={wo} onOpen={onOpenWorkOrder} actionLabel="Open" actionIcon={ChevronRight} />
          ))}
        </TodayGroup>
      )}

      {/* DELIVERED — NEEDS COMPLETION */}
      {woDelivered.length > 0 && (
        <TodayGroup title="Delivered — Awaiting Completion" count={woDelivered.length} accent="green">
          {woDelivered.map(wo => (
            <TodayWorkOrderRow key={wo.id} wo={wo} onOpen={onOpenWorkOrder} actionLabel="Open" actionIcon={ChevronRight} />
          ))}
        </TodayGroup>
      )}

      {/* WAITING ON CLIENT */}
      {waitingOnClient.length > 0 && (
        <TodayGroup title="Waiting on Client" count={waitingOnClient.length} accent="muted">
          {waitingOnClient.map(q => (
            <TodayQueueRow key={q.id} item={q} onOpenQuestion={onOpenQuestion} />
          ))}
        </TodayGroup>
      )}
    </div>
  )
}

function TodayGroup({ title, count, accent, children }: { title: string; count: number; accent: string; children: React.ReactNode }) {
  const accentCls =
    accent === 'red' ? 'text-red-700' :
    accent === 'purple' ? 'text-purple-700' :
    accent === 'blue' ? 'text-blue-700' :
    accent === 'amber' ? 'text-amber-700' :
    accent === 'orange' ? 'text-orange-700' :
    accent === 'green' ? 'text-green-700' :
    'text-muted-foreground'
  return (
    <div>
      <div className={`text-xs font-semibold uppercase tracking-wide ${accentCls} mb-2`}>{title} ({count})</div>
      <div className="space-y-1.5">{children}</div>
    </div>
  )
}

function TodayQueueRow({ item, onOpenQuestion }: { item: QueueItem; onOpenQuestion: (id: string) => void }) {
  const isQuestion = item.type === 'new_advisor_question' || item.type === 'New Advisor question'
  return (
    <div className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent/5 group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <a href={`/app/${item.orgSlug}`} className="text-xs text-primary hover:underline font-medium">{item.organization}</a>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">{item.type}</span>
        </div>
        <p className="text-sm truncate mt-0.5">{item.title}</p>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {item.age}</span>
          <PriorityBadge priority={item.priority} />
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        {isQuestion && (
          <button
            onClick={() => onOpenQuestion(item.id)}
            className="text-xs px-3 py-1.5 rounded-md border border-border bg-background hover:bg-accent inline-flex items-center gap-1 whitespace-nowrap"
          >
            <MessageSquare className="h-3 w-3" /> Respond
          </button>
        )}
        <a
          href={item.link}
          className="text-xs px-3 py-1.5 rounded-md border border-border bg-background hover:bg-accent inline-flex items-center gap-1 whitespace-nowrap"
        >
          Open <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  )
}

function TodayWorkOrderRow({ wo, onOpen, actionLabel, actionIcon: Icon }: { wo: AdvisorWorkOrder; onOpen: (id: string) => void; actionLabel: string; actionIcon: any }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent/5 group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <a href={`/app/${wo.organization_slug}`} className="text-xs text-primary hover:underline font-medium">{wo.organization_name}</a>
          <span className="text-xs text-muted-foreground font-mono">{wo.work_order_number}</span>
        </div>
        <p className="text-sm truncate mt-0.5">{wo.title}</p>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <span>{wo.status.replace(/_/g, ' ')}</span>
          <span>·</span>
          <span>{wo.work_type}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => onOpen(wo.id)}
          className="text-xs px-3 py-1.5 rounded-md border border-border bg-background hover:bg-accent inline-flex items-center gap-1 whitespace-nowrap"
        >
          <Icon className="h-3 w-3" /> {actionLabel}
        </button>
      </div>
    </div>
  )
}

// ---------- Question Action Panel ----------

function QuestionActionPanel({
  questionId, onClose, onSuccess,
}: {
  questionId: string
  onClose: () => void
  onSuccess: (msg: string) => void
}) {
  const [question, setQuestion] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [response, setResponse] = useState('')
  const [category, setCategory] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const res = await fetch(`/api/admin/advisor-operations?view=question&id=${questionId}`)
        if (!res.ok) throw new Error('Failed to load question')
        const data = await res.json()
        if (!cancelled) {
          setQuestion(data.question || null)
          if (data.question?.request_category) setCategory(data.question.request_category)
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [questionId])

  async function handleRespond() {
    if (!response.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`/api/commercial/advisor-desk/questions/${questionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'answered', advisorResponse: response.trim(), requestCategory: category || undefined }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to respond')
      }
      onSuccess('Response sent to customer')
      onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleNeedContext() {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`/api/commercial/advisor-desk/questions/${questionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'under_review', advisorResponse: response.trim() || undefined }),
      })
      if (!res.ok) throw new Error('Failed to request context')
      onSuccess('Context request sent')
      onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleRecommendWorkOrder() {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/advisor-questions/${questionId}/recommend-work-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suggestedWorkType: 'research', suggestedOutcome: question?.subject || '' }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to create Work Order draft')
      }
      const data = await res.json()
      onSuccess(`Work Order ${data.workOrderNumber || 'draft'} created from question`)
      onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleClose() {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`/api/commercial/advisor-desk/questions/${questionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'closed' }),
      })
      if (!res.ok) throw new Error('Failed to close question')
      onSuccess('Question closed')
      onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-background rounded-lg border shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto mt-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="font-semibold text-sm">Advisor Question</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-4 space-y-4">
          {loading && <div className="py-8 text-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto" /></div>}
          {error && !loading && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p>{error}</p>
                <button onClick={() => setError(null)} className="text-xs underline mt-1">Dismiss</button>
              </div>
            </div>
          )}
          {question && !loading && (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <a href={`/app/${question.organization_slug}`} className="text-primary hover:underline font-medium">{question.organization_name}</a>
                  <span>·</span>
                  <span>{question.requester_name || question.requester_email || 'Unknown'}</span>
                  <span>·</span>
                  <span>{new Date(question.created_at).toLocaleString()}</span>
                </div>
                <h4 className="text-base font-semibold">{question.subject}</h4>
                {question.question && <p className="text-sm text-muted-foreground whitespace-pre-wrap">{question.question}</p>}
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Response</label>
                <textarea
                  value={response}
                  onChange={e => setResponse(e.target.value)}
                  rows={6}
                  placeholder="Type your advisor response..."
                  className="w-full rounded-md border border-border bg-background p-3 text-sm resize-y focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Category (optional)</label>
                <input
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  placeholder="e.g. vendor_review, architecture, governance"
                  className="w-full rounded-md border border-border bg-background p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <button
                  onClick={handleRespond}
                  disabled={submitting || !response.trim()}
                  className="text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Respond
                </button>
                <button
                  onClick={handleNeedContext}
                  disabled={submitting}
                  className="text-sm px-4 py-2 rounded-md border border-border bg-background hover:bg-accent disabled:opacity-50 inline-flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" /> Need More Context
                </button>
                <button
                  onClick={handleRecommendWorkOrder}
                  disabled={submitting}
                  className="text-sm px-4 py-2 rounded-md border border-border bg-background hover:bg-accent disabled:opacity-50 inline-flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" /> Recommend Work Order
                </button>
                <button
                  onClick={handleClose}
                  disabled={submitting}
                  className="text-sm px-4 py-2 rounded-md border border-border bg-background hover:bg-accent disabled:opacity-50 ml-auto inline-flex items-center gap-2"
                >
                  <X className="h-4 w-4" /> Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ---------- Work Order Action Panel ----------

function WorkOrderActionPanel({
  workOrderId, workOrders, onClose, onSuccess,
}: {
  workOrderId: string
  workOrders: AdvisorWorkOrder[]
  onClose: () => void
  onSuccess: (msg: string) => void
}) {
  const wo = workOrders.find(w => w.id === workOrderId)
  const [detail, setDetail] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scopeData, setScopeData] = useState({ title: '', workType: 'research', desiredOutcome: '', scopeIncluded: '', scopeExcluded: '', requiredInputs: '', deliverableDescription: '', targetTiming: '', price: 500 })
  const [updateText, setUpdateText] = useState('')
  const [updateIsInternal, setUpdateIsInternal] = useState(false)
  const [deliverable, setDeliverable] = useState({ title: '', description: '', artifactType: 'document', url: '', clientVisible: true })
  const [inputRequest, setInputRequest] = useState({ title: '', whatIsNeeded: '', whyItMatters: '', dueDate: '' })
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<'scope' | 'execution' | 'deliverable' | 'input'>('scope')

  useEffect(() => {
    if (wo) {
      setScopeData({
        title: wo.title,
        workType: wo.work_type || 'research',
        desiredOutcome: wo.desired_outcome || '',
        scopeIncluded: '', scopeExcluded: '', requiredInputs: '',
        deliverableDescription: '', targetTiming: '',
        price: wo.standard_price_cents ? wo.standard_price_cents / 100 : 500,
      })
      // Determine which tab to show based on status
      if (wo.status === 'awaiting_scope' || wo.status === 'draft') setActiveTab('scope')
      else if (wo.status === 'paid' || wo.status === 'scoped' || wo.status === 'in_progress' || wo.status === 'in_review') setActiveTab('execution')
      else if (wo.status === 'needs_client_input') setActiveTab('input')
      else if (wo.status === 'delivered') setActiveTab('deliverable')
    }
  }, [wo])

  if (!wo) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
        <div className="bg-background rounded-lg border shadow-xl p-6" onClick={e => e.stopPropagation()}>
          <p className="text-sm text-muted-foreground">Work Order not found in current list.</p>
          <a href={`/app/admin`} className="text-xs text-primary hover:underline mt-2 block">Open Admin →</a>
          <button onClick={onClose} className="text-xs underline mt-3">Close</button>
        </div>
      </div>
    )
  }

  async function apiCall(url: string, method: string, body: any) {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Failed (${res.status})`)
      }
      const data = await res.json().catch(() => ({}))
      return data
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSaveScope(send: boolean) {
    try {
      await apiCall(`/api/admin/work-orders/${workOrderId}/scope`, 'PATCH', {
        scopeTitle: scopeData.title,
        scopeIncluded: scopeData.scopeIncluded,
        scopeExcluded: scopeData.scopeExcluded,
        requiredInputs: scopeData.requiredInputs,
        deliverableDescription: scopeData.deliverableDescription,
        desiredOutcome: scopeData.desiredOutcome,
        workType: scopeData.workType,
        targetTiming: scopeData.targetTiming,
        priceCents: Math.round(scopeData.price * 100),
        sendToClient: send,
      })
      onSuccess(send ? 'Scope sent to customer' : 'Scope draft saved')
      onClose()
    } catch (err: any) { setError(err.message) }
  }

  async function handleStatusTransition(newStatus: string, label: string) {
    try {
      await apiCall(`/api/admin/work-orders/${workOrderId}/status`, 'PATCH', { status: newStatus })
      onSuccess(`Work Order ${label}`)
      onClose()
    } catch (err: any) { setError(err.message) }
  }

  async function handlePublishUpdate() {
    if (!updateText.trim()) return
    try {
      await apiCall(`/api/admin/work-orders/${workOrderId}/updates`, 'POST', {
        body: updateText.trim(),
        isClientVisible: !updateIsInternal,
        updateType: updateIsInternal ? 'internal_note' : 'client_update',
      })
      onSuccess(updateIsInternal ? 'Internal note saved' : 'Client update published')
      setUpdateText('')
      setUpdateIsInternal(false)
    } catch (err: any) { setError(err.message) }
  }

  async function handlePublishDeliverable() {
    if (!deliverable.title.trim()) return
    try {
      await apiCall(`/api/admin/work-orders/${workOrderId}/deliverables`, 'POST', {
        title: deliverable.title,
        description: deliverable.description,
        artifactType: deliverable.artifactType,
        artifactUrl: deliverable.url,
        isClientVisible: deliverable.clientVisible,
      })
      onSuccess('Deliverable published')
      setDeliverable({ title: '', description: '', artifactType: 'document', url: '', clientVisible: true })
    } catch (err: any) { setError(err.message) }
  }

  async function handleRequestInput() {
    if (!inputRequest.title.trim()) return
    try {
      await apiCall(`/api/admin/work-orders/${workOrderId}/request-input`, 'POST', {
        requestTitle: inputRequest.title,
        whatIsNeeded: inputRequest.whatIsNeeded,
        whyItMatters: inputRequest.whyItMatters,
        dueDate: inputRequest.dueDate || undefined,
      })
      onSuccess('Client input requested')
      setInputRequest({ title: '', whatIsNeeded: '', whyItMatters: '', dueDate: '' })
    } catch (err: any) { setError(err.message) }
  }

  async function handleSplit() {
    try {
      const data = await apiCall(`/api/admin/work-orders/${workOrderId}/split`, 'POST', {})
      onSuccess(`Split into ${data.children?.length || 2} Work Orders`)
      onClose()
    } catch (err: any) { setError(err.message) }
  }

  const orgSlug = wo.organization_slug
  const detailHref = `/app/${orgSlug}/work-orders/${workOrderId}`

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-background rounded-lg border shadow-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto mt-4" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <a href={`/app/${orgSlug}`} className="text-primary hover:underline">{wo.organization_name}</a>
              <span className="font-mono">{wo.work_order_number}</span>
            </div>
            <h3 className="font-semibold text-sm mt-1">{wo.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 rounded bg-muted">{wo.status.replace(/_/g, ' ')}</span>
              <span className="text-xs text-muted-foreground">{wo.scope_status.replace(/_/g, ' ')}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href={detailHref} className="text-xs text-primary hover:underline inline-flex items-center gap-1">
              Full page <ExternalLink className="h-3 w-3" />
            </a>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-4 mt-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <p>{error}</p>
              <button onClick={() => setError(null)} className="text-xs underline mt-1">Dismiss</button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 border-b px-4 pt-2 overflow-x-auto">
          {(['scope', 'execution', 'deliverable', 'input'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap capitalize ${
                activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'input' ? 'Client Input' : tab}
            </button>
          ))}
        </div>

        <div className="p-4 space-y-4">
          {/* SCOPE TAB */}
          {activeTab === 'scope' && (
            <div className="space-y-3">
              <ScopeField label="Title" value={scopeData.title} onChange={v => setScopeData({ ...scopeData, title: v })} />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Work Type</label>
                  <select value={scopeData.workType} onChange={e => setScopeData({ ...scopeData, workType: e.target.value })}
                    className="w-full rounded-md border border-border bg-background p-2 text-sm">
                    {['research', 'analysis', 'design', 'build', 'configuration', 'integration', 'evaluation', 'investigation', 'workflow', 'vendor_review', 'architecture', 'other'].map(t => (
                      <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Price ($)</label>
                  <input type="number" value={scopeData.price} onChange={e => setScopeData({ ...scopeData, price: Number(e.target.value) })}
                    className="w-full rounded-md border border-border bg-background p-2 text-sm" />
                </div>
              </div>
              <ScopeField label="Defined Outcome" value={scopeData.desiredOutcome} onChange={v => setScopeData({ ...scopeData, desiredOutcome: v })} textarea />
              <ScopeField label="Included Work" value={scopeData.scopeIncluded} onChange={v => setScopeData({ ...scopeData, scopeIncluded: v })} textarea />
              <ScopeField label="Excluded Work" value={scopeData.scopeExcluded} onChange={v => setScopeData({ ...scopeData, scopeExcluded: v })} textarea />
              <ScopeField label="Client Inputs / Dependencies" value={scopeData.requiredInputs} onChange={v => setScopeData({ ...scopeData, requiredInputs: v })} textarea />
              <ScopeField label="Deliverable" value={scopeData.deliverableDescription} onChange={v => setScopeData({ ...scopeData, deliverableDescription: v })} textarea />
              <ScopeField label="Target Timing" value={scopeData.targetTiming} onChange={v => setScopeData({ ...scopeData, targetTiming: v })} />

              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <button onClick={() => handleSaveScope(false)} disabled={submitting}
                  className="text-sm px-4 py-2 rounded-md border border-border bg-background hover:bg-accent disabled:opacity-50 inline-flex items-center gap-2">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />} Save Draft
                </button>
                <button onClick={() => handleSaveScope(true)} disabled={submitting}
                  className="text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-2">
                  <Send className="h-4 w-4" /> Send Scope
                </button>
                <button onClick={handleSplit} disabled={submitting}
                  className="text-sm px-4 py-2 rounded-md border border-border bg-background hover:bg-accent disabled:opacity-50 inline-flex items-center gap-2 ml-auto">
                  Split Work Order
                </button>
              </div>
            </div>
          )}

          {/* EXECUTION TAB */}
          {activeTab === 'execution' && (
            <div className="space-y-4">
              {/* Status transitions */}
              <div className="flex flex-wrap gap-2">
                {wo.status === 'paid' && (
                  <button onClick={() => handleStatusTransition('in_progress', 'started')} disabled={submitting}
                    className="text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-2">
                    <Play className="h-4 w-4" /> Start Work
                  </button>
                )}
                {(wo.status === 'in_progress' || wo.status === 'in_review') && (
                  <>
                    <button onClick={() => handleStatusTransition('in_review', 'moved to review')} disabled={submitting}
                      className="text-sm px-4 py-2 rounded-md border border-border bg-background hover:bg-accent disabled:opacity-50 inline-flex items-center gap-2">
                      Move to Review
                    </button>
                    <button onClick={() => handleStatusTransition('delivered', 'delivered')} disabled={submitting}
                      className="text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-2">
                      <Package className="h-4 w-4" /> Mark Delivered
                    </button>
                  </>
                )}
                {wo.status === 'delivered' && (
                  <button onClick={() => handleStatusTransition('completed', 'completed')} disabled={submitting}
                    className="text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-2">
                    <Check className="h-4 w-4" /> Mark Completed
                  </button>
                )}
              </div>

              {/* Publish update */}
              <div className="border-t pt-3">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  {updateIsInternal ? 'Internal Note (private)' : 'Client Update (visible)'}
                </label>
                <textarea
                  value={updateText}
                  onChange={e => setUpdateText(e.target.value)}
                  rows={3}
                  placeholder={updateIsInternal ? 'Private note for advisor...' : 'Update for customer...'}
                  className="w-full rounded-md border border-border bg-background p-3 text-sm resize-y focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <div className="flex items-center gap-3 mt-2">
                  <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                    <input type="checkbox" checked={updateIsInternal} onChange={e => setUpdateIsInternal(e.target.checked)} className="rounded" />
                    Internal note (not visible to client)
                  </label>
                  <button onClick={handlePublishUpdate} disabled={submitting || !updateText.trim()}
                    className="text-sm px-3 py-1.5 rounded-md border border-border bg-background hover:bg-accent disabled:opacity-50 inline-flex items-center gap-2 ml-auto">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {updateIsInternal ? 'Save Note' : 'Publish Update'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* DELIVERABLE TAB */}
          {activeTab === 'deliverable' && (
            <div className="space-y-3">
              <ScopeField label="Deliverable Title" value={deliverable.title} onChange={v => setDeliverable({ ...deliverable, title: v })} />
              <ScopeField label="Description" value={deliverable.description} onChange={v => setDeliverable({ ...deliverable, description: v })} textarea />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Artifact Type</label>
                  <select value={deliverable.artifactType} onChange={e => setDeliverable({ ...deliverable, artifactType: e.target.value })}
                    className="w-full rounded-md border border-border bg-background p-2 text-sm">
                    {['document', 'memo', 'report', 'diagram', 'pdf', 'repository', 'code', 'configuration', 'evaluation', 'other'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Link / URL</label>
                  <input value={deliverable.url} onChange={e => setDeliverable({ ...deliverable, url: e.target.value })}
                    placeholder="https://..."
                    className="w-full rounded-md border border-border bg-background p-2 text-sm" />
                </div>
              </div>
              <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                <input type="checkbox" checked={deliverable.clientVisible} onChange={e => setDeliverable({ ...deliverable, clientVisible: e.target.checked })} className="rounded" />
                Visible to client
              </label>
              <div className="flex gap-2 pt-2 border-t">
                <button onClick={handlePublishDeliverable} disabled={submitting || !deliverable.title.trim()}
                  className="text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-2">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Package className="h-4 w-4" />} Attach Deliverable
                </button>
                {wo.status === 'in_progress' || wo.status === 'in_review' ? (
                  <button onClick={() => handleStatusTransition('delivered', 'delivered')} disabled={submitting}
                    className="text-sm px-4 py-2 rounded-md border border-border bg-background hover:bg-accent disabled:opacity-50 inline-flex items-center gap-2">
                    <Package className="h-4 w-4" /> Mark Delivered
                  </button>
                ) : null}
              </div>
            </div>
          )}

          {/* INPUT TAB */}
          {activeTab === 'input' && (
            <div className="space-y-3">
              <ScopeField label="What I Need" value={inputRequest.title} onChange={v => setInputRequest({ ...inputRequest, title: v })} />
              <ScopeField label="Details" value={inputRequest.whatIsNeeded} onChange={v => setInputRequest({ ...inputRequest, whatIsNeeded: v })} textarea />
              <ScopeField label="Why It Matters" value={inputRequest.whyItMatters} onChange={v => setInputRequest({ ...inputRequest, whyItMatters: v })} textarea />
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Due Date (optional)</label>
                <input type="date" value={inputRequest.dueDate} onChange={e => setInputRequest({ ...inputRequest, dueDate: e.target.value })}
                  className="w-full rounded-md border border-border bg-background p-2 text-sm" />
              </div>
              <div className="flex gap-2 pt-2 border-t">
                <button onClick={handleRequestInput} disabled={submitting || !inputRequest.title.trim()}
                  className="text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-2">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />} Request Client Input
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ScopeField({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={3}
          className="w-full rounded-md border border-border bg-background p-2.5 text-sm resize-y focus:outline-none focus:ring-1 focus:ring-primary" />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)}
          className="w-full rounded-md border border-border bg-background p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
      )}
    </div>
  )
}

// ---------- Sub-components ----------

function ViewTab({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
        active
          ? 'border-primary text-primary'
          : 'border-transparent text-muted-foreground hover:text-foreground'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}

function FilterButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs rounded-full px-3 py-1 border transition-colors whitespace-nowrap ${
        active
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-background text-muted-foreground border-border hover:bg-accent'
      }`}
    >
      {label}
    </button>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-3 py-2 font-medium whitespace-nowrap">{children}</th>
}

function Td({ children, className = '', title }: { children: React.ReactNode; className?: string; title?: string }) {
  return <td className={`px-3 py-2 align-top ${className}`} title={title}>{children}</td>
}

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase()
  let cls = 'bg-muted text-muted-foreground'
  if (s === 'active' || s === 'ok' || s === 'completed') cls = 'bg-green-500/10 text-green-700'
  else if (s === 'pending' || s === 'waiting' || s === 'provisioning') cls = 'bg-amber-500/10 text-amber-700'
  else if (s === 'failed' || s === 'error' || s === 'canceled' || s === 'cancelled' || s === 'suspended') cls = 'bg-red-500/10 text-red-700'
  else if (s === 'read_only' || s === 'read-only' || s === 'paused') cls = 'bg-blue-500/10 text-blue-700'
  return <span className={`text-xs px-2 py-0.5 rounded whitespace-nowrap ${cls}`}>{status}</span>
}

function PriorityBadge({ priority }: { priority: 'high' | 'medium' | 'low' }) {
  const cls =
    priority === 'high' ? 'bg-red-500/10 text-red-700' :
    priority === 'medium' ? 'bg-amber-500/10 text-amber-700' :
    'bg-blue-500/10 text-blue-700'
  const Icon = priority === 'high' ? AlertTriangle : priority === 'medium' ? AlertCircle : CheckCircle2
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded whitespace-nowrap ${cls}`}>
      <Icon className="h-3 w-3" />
      {priority}
    </span>
  )
}

function ResponseAgingBadge({ value }: { value: string }) {
  const v = value.toLowerCase()
  let cls = 'bg-muted text-muted-foreground'
  if (v.includes('overdue') || v.includes('critical') || v.includes('late')) cls = 'bg-red-500/10 text-red-700'
  else if (v.includes('aging') || v.includes('due') || v.includes('soon')) cls = 'bg-amber-500/10 text-amber-700'
  else if (v === 'ok' || v === 'current' || v === 'on track' || v.includes('fresh')) cls = 'bg-green-500/10 text-green-700'
  return <span className={`text-xs px-2 py-0.5 rounded whitespace-nowrap ${cls}`}>{value}</span>
}

function SeverityBadge({ severity }: { severity: 'ok' | 'warning' | 'critical' | 'info' }) {
  const cls =
    severity === 'ok' ? 'bg-green-500/10 text-green-700' :
    severity === 'warning' ? 'bg-amber-500/10 text-amber-700' :
    severity === 'critical' ? 'bg-red-500/10 text-red-700' :
    'bg-blue-500/10 text-blue-700'
  const Icon =
    severity === 'ok' ? CheckCircle2 :
    severity === 'warning' ? AlertCircle :
    severity === 'critical' ? AlertTriangle :
    Activity
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded whitespace-nowrap ${cls}`}>
      <Icon className="h-3 w-3" />
      {severity}
    </span>
  )
}
