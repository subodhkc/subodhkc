'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  AlertCircle, Users, Activity, Calendar, Clock, AlertTriangle,
  CheckCircle2, Loader2, RefreshCw, ExternalLink, HeartPulse,
  Inbox, Filter,
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

type ClientFilter =
  | 'all'
  | 'needs_attention'
  | 'advisor_99'
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
  const [activeView, setActiveView] = useState<'clients' | 'queue' | 'health'>('clients')
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

  // Fetch clients on mount and when filter changes
  useEffect(() => {
    if (activeView === 'clients') {
      fetchClients(filter)
    }
  }, [filter, activeView, fetchClients])

  // Fetch queue/health when their tab is first opened
  useEffect(() => {
    if (activeView === 'queue' && queue.length === 0 && !queueLoading && !queueError) {
      fetchQueue()
    }
    if (activeView === 'health' && health.length === 0 && !healthLoading && !healthError) {
      fetchHealth()
    }
  }, [activeView, queue.length, queueLoading, queueError, health.length, healthLoading, healthError, fetchQueue, fetchHealth])

  const highCount = queue.filter(q => q.priority === 'high').length

  return (
    <div className="space-y-4">
      {/* View tabs */}
      <div className="flex gap-1 border-b overflow-x-auto">
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
      </div>

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
            <FilterButton active={filter === 'advisor_99'} onClick={() => setFilter('advisor_99')} label="$99 Advisor" />
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
