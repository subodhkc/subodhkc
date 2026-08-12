'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import {
  Search, Filter, Wifi, WifiOff, RefreshCw, AlertTriangle,
  CheckCircle2, Clock, Users, ChevronRight, X, Zap,
  ListChecks, Monitor, History,
} from 'lucide-react'

interface QueueItem {
  id: string
  sequence_number: number
  current_status: string
  created_at: string
  updated_at: string
  completed_at: string | null
  exception_flag: boolean
  exception_reason: string | null
  release_eligible_at: string | null
  release_override_reason: string | null
  student_id: string
  school_students: {
    id: string
    first_name: string
    last_name: string
    external_student_id: string | null
    classroom_id: string | null
    school_classrooms: { id: string; name: string } | null
  }
  arrival_id: string
  pickup_arrivals: {
    id: string
    checkin_source: string
    pickup_group_id: string
    pickup_groups: { label: string }
  }
}

interface QueueCounts {
  arrived: number
  preparing: number
  ready: number
  completed: number
  exception: number
  cancelled: number
}

interface SessionInfo {
  id: string
  service_date: string
  status: string
  opened_at: string | null
  closed_at: string | null
}

type ConnectionStatus = 'live' | 'reconnecting' | 'offline'

const STATUS_LABELS: Record<string, string> = {
  arrived: 'Arrived',
  preparing: 'Preparing',
  ready: 'Ready',
  completed: 'Completed',
  exception: 'Exception',
  cancelled: 'Cancelled',
}

const STATUS_COLORS: Record<string, string> = {
  arrived: 'bg-blue-100 text-blue-800 border-blue-200',
  preparing: 'bg-amber-100 text-amber-800 border-amber-200',
  ready: 'bg-green-100 text-green-800 border-green-200',
  completed: 'bg-gray-100 text-gray-600 border-gray-200',
  exception: 'bg-red-100 text-red-800 border-red-200',
  cancelled: 'bg-gray-100 text-gray-500 border-gray-200',
}

const WAIT_THRESHOLDS = {
  attention: 5 * 60 * 1000,
  long: 10 * 60 * 1000,
}

function formatWaitTime(ms: number): string {
  if (ms < 60_000) return `${Math.floor(ms / 1000)}s`
  const mins = Math.floor(ms / 60_000)
  if (mins < 60) return `${mins} min`
  const hrs = Math.floor(mins / 60)
  return `${hrs}h ${mins % 60}m`
}

function getWaitLevel(ms: number): 'normal' | 'attention' | 'long' {
  if (ms >= WAIT_THRESHOLDS.long) return 'long'
  if (ms >= WAIT_THRESHOLDS.attention) return 'attention'
  return 'normal'
}

const POLL_INTERVAL = 15_000

export interface QueueMonitorClientProps {
  orgSlug: string
  siteSlug: string
  siteName: string
  schoolRole: string | null
  canManageQueue: boolean
}

export function QueueMonitorClient({
  orgSlug,
  siteSlug,
  siteName,
  schoolRole,
  canManageQueue,
}: QueueMonitorClientProps) {
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [counts, setCounts] = useState<QueueCounts>({
    arrived: 0, preparing: 0, ready: 0, completed: 0, exception: 0, cancelled: 0,
  })
  const [session, setSession] = useState<SessionInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showCompleted, setShowCompleted] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('live')
  const [transitioning, setTransitioning] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [displayMode, setDisplayMode] = useState<'standard' | 'monitor'>('standard')
  const [now, setNow] = useState(Date.now())
  const [isMobile, setIsMobile] = useState(false)

  const channelRef = useRef<ReturnType<typeof createBrowserClient>['channel'] | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const supabaseRef = useRef<ReturnType<typeof createBrowserClient> | null>(null)

  const apiBase = `/api/school-pickup/${orgSlug}/${siteSlug}`

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}/sessions?date=today`)
      if (!res.ok) return null
      const data = await res.json()
      const todaySession = data.sessions?.find((s: SessionInfo) => s.status === 'open') || null
      return todaySession
    } catch {
      return null
    }
  }, [apiBase])

  const fetchQueue = useCallback(async (sessionId: string) => {
    try {
      const params = new URLSearchParams({ session_id: sessionId })
      if (showCompleted) params.set('include_completed', 'true')
      if (statusFilter !== 'all') params.set('status', statusFilter)
      if (search) params.set('search', search)

      const res = await fetch(`${apiBase}/queue?${params}`)
      if (!res.ok) throw new Error('fetch failed')
      const data = await res.json()
      setQueue(data.queue || [])
      setCounts(data.counts || {})
      setConnectionStatus('live')
      setError(null)
    } catch {
      setConnectionStatus('offline')
      setError('Failed to fetch queue')
    } finally {
      setLoading(false)
    }
  }, [apiBase, showCompleted, statusFilter, search])

  const initialize = useCallback(async () => {
    setLoading(true)
    const sess = await fetchSession()
    setSession(sess)
    if (sess) {
      await fetchQueue(sess.id)
    } else {
      setLoading(false)
    }
  }, [fetchSession, fetchQueue])

  useEffect(() => {
    initialize()
  }, [initialize])

  // Realtime subscription
  useEffect(() => {
    if (!session) return

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseKey) return

    let supabase: ReturnType<typeof createBrowserClient> | null = null
    try {
      supabase = createBrowserClient(supabaseUrl, supabaseKey)
    } catch {
      return
    }
    if (!supabase) return
    supabaseRef.current = supabase

    const channel = supabase
      .channel(`queue:${session.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pickup_queue_items',
          filter: `session_id=eq.${session.id}`,
        },
        () => {
          setConnectionStatus('live')
          fetchQueue(session.id)
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pickup_arrivals',
          filter: `session_id=eq.${session.id}`,
        },
        () => {
          fetchQueue(session.id)
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pickup_sessions',
          filter: `id=eq.${session.id}`,
        },
        (payload: any) => {
          if (payload.new?.status && payload.new.status !== 'open') {
            setSession(payload.new)
          }
        }
      )
      .subscribe(
        (status: string) => {
          if (status === 'SUBSCRIBED') {
            setConnectionStatus('live')
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            setConnectionStatus('reconnecting')
          } else if (status === 'CLOSED') {
            setConnectionStatus('offline')
          }
        }
      )

    channelRef.current = channel

    return () => {
      supabase?.removeChannel(channel)
      channelRef.current = null
    }
  }, [session?.id, fetchQueue])

  // Polling fallback
  useEffect(() => {
    if (connectionStatus === 'live' || !session) {
      if (pollRef.current) {
        clearInterval(pollRef.current)
        pollRef.current = null
      }
      return
    }

    pollRef.current = setInterval(() => {
      fetchQueue(session.id)
    }, POLL_INTERVAL)

    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [connectionStatus, session, fetchQueue])

  // Reconnect on visibility change
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && session) {
        setConnectionStatus('reconnecting')
        fetchQueue(session.id)
        fetchSession().then(s => {
          if (s) setSession(s)
        })
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [session, fetchQueue, fetchSession])

  // Group items by arrival for pickup group display
  const groupedQueue = useMemo(() => {
    const groups = new Map<string, QueueItem[]>()
    for (const item of queue) {
      const existing = groups.get(item.arrival_id) || []
      existing.push(item)
      groups.set(item.arrival_id, existing)
    }
    return Array.from(groups.entries()).map(([arrivalId, items]) => ({
      arrivalId,
      items: items.sort((a, b) => a.sequence_number - b.sequence_number),
      minSeq: Math.min(...items.map(i => i.sequence_number)),
      arrivalStatus: items[0]?.current_status || 'arrived',
      checkinSource: items[0]?.pickup_arrivals?.checkin_source || 'qr',
      groupLabel: items[0]?.pickup_arrivals?.pickup_groups?.label || '',
      allCompleted: items.every(i => i.current_status === 'completed'),
      hasException: items.some(i => i.exception_flag || i.current_status === 'exception'),
    }))
  }, [queue])

  const activeGroups = groupedQueue.filter(g => !g.allCompleted || showCompleted)

  async function handleTransition(
    itemId: string,
    newStatus: string,
    expectedStatus?: string
  ) {
    setTransitioning(itemId)
    setError(null)
    try {
      const res = await fetch(`${apiBase}/queue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'transition_item',
          queue_item_id: itemId,
          new_status: newStatus,
          expected_current_status: expectedStatus,
        }),
      })

      if (res.status === 409) {
        const data = await res.json()
        setError(`Concurrent modification: ${data.actual_status} → refresh needed`)
        if (session) await fetchQueue(session.id)
        return
      }

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Transition failed')
        return
      }

      if (session) await fetchQueue(session.id)
    } catch {
      setError('Network error during transition')
      setConnectionStatus('offline')
    } finally {
      setTransitioning(null)
    }
  }

  async function handleGroupTransition(
    arrivalId: string,
    newStatus: string,
    expectedStatus?: string
  ) {
    setTransitioning(`group:${arrivalId}`)
    setError(null)
    try {
      const res = await fetch(`${apiBase}/queue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'transition_arrival',
          arrival_id: arrivalId,
          new_status: newStatus,
          expected_current_status: expectedStatus,
        }),
      })

      if (res.status === 409) {
        setError('Concurrent modification — refreshing queue')
        if (session) await fetchQueue(session.id)
        return
      }

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Transition failed')
        return
      }

      if (session) await fetchQueue(session.id)
    } catch {
      setError('Network error')
      setConnectionStatus('offline')
    } finally {
      setTransitioning(null)
    }
  }

  async function handleException(itemId: string, reason?: string) {
    setTransitioning(itemId)
    try {
      const res = await fetch(`${apiBase}/queue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'flag_exception',
          queue_item_id: itemId,
          reason: reason || null,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      if (session) await fetchQueue(session.id)
    } catch {
      setError('Failed to flag exception')
    } finally {
      setTransitioning(null)
    }
  }

  async function handleResolveException(itemId: string) {
    setTransitioning(itemId)
    try {
      const res = await fetch(`${apiBase}/queue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'resolve_exception',
          queue_item_id: itemId,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      if (session) await fetchQueue(session.id)
    } catch {
      setError('Failed to resolve exception')
    } finally {
      setTransitioning(null)
    }
  }

  function getNextStatus(current: string): string | null {
    const flow: Record<string, string> = {
      arrived: 'preparing',
      preparing: 'ready',
      ready: 'completed',
    }
    return flow[current] || null
  }

  function canTransition(current: string, newStatus: string): boolean {
    if (!canManageQueue) {
      if (schoolRole === 'teacher') return ['preparing', 'ready'].includes(newStatus)
      if (schoolRole === 'scanner') return ['preparing', 'ready', 'completed'].includes(newStatus)
      return false
    }
    return true
  }

  const sessionClosed = !!(session && session.status !== 'open')
  const totalActive = counts.arrived + counts.preparing + counts.ready + counts.exception
  const oldestWait = queue.length > 0 && !showCompleted
    ? Math.max(...queue.filter(i => i.current_status !== 'completed').map(i => now - new Date(i.created_at).getTime()))
    : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Loading queue...
      </div>
    )
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No active dismissal session for today.</p>
        <a
          href={`/app/${orgSlug}/school-pickup/${siteSlug}/dismissal`}
          className="text-primary hover:underline"
        >
          Go to Dismissal Management →
        </a>
      </div>
    )
  }

  return (
    <div className={displayMode === 'monitor' ? 'max-w-4xl mx-auto' : ''}>
      {/* Session Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h1 className="text-lg font-semibold">
            {siteName} — Dismissal Queue
          </h1>
          <p className="text-sm text-muted-foreground">
            {new Date(session.service_date).toLocaleDateString()} ·
            <span className={`ml-1 font-medium ${
              session.status === 'open' ? 'text-green-600' : 'text-red-600'
            }`}>
              {session.status === 'open' ? 'OPEN' : session.status.toUpperCase()}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ConnectionIndicator status={connectionStatus} />
          <button
            onClick={() => setDisplayMode(m => m === 'standard' ? 'monitor' : 'standard')}
            className="flex items-center gap-1 px-2 py-1 border rounded-md text-xs hover:bg-accent"
            title="Toggle large display mode"
          >
            <Monitor className="h-3.5 w-3.5" />
            {displayMode === 'monitor' ? 'Standard' : 'Monitor'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm rounded-md px-4 py-2 mb-3 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)} className="shrink-0"><X className="h-3 w-3" /></button>
        </div>
      )}

      {sessionClosed && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-md px-4 py-3 mb-4 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Dismissal is {session.status}. No new changes can be made.
        </div>
      )}

      {/* Live Counts */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
        <CountCard label="Arrived" value={counts.arrived} color="blue" />
        <CountCard label="Preparing" value={counts.preparing} color="amber" />
        <CountCard label="Ready" value={counts.ready} color="green" />
        <CountCard label="Completed" value={counts.completed} color="gray" />
        <CountCard label="Active" value={totalActive} color="purple" />
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
        {oldestWait > 0 && (
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Longest wait: {formatWaitTime(oldestWait)}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {queue.length} total checked in
        </span>
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search student or classroom..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border rounded-md text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm"
        >
          <option value="all">All Active</option>
          <option value="arrived">Arrived</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready</option>
          <option value="exception">Exception</option>
        </select>
        <button
          onClick={() => setShowCompleted(s => !s)}
          className={`flex items-center gap-1 px-3 py-2 border rounded-md text-sm ${
            showCompleted ? 'bg-accent' : 'hover:bg-accent'
          }`}
        >
          <History className="h-3.5 w-3.5" />
          {showCompleted ? 'Hide Completed' : 'Show Completed'}
        </button>
      </div>

      {/* Queue */}
      {activeGroups.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <ListChecks className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No students in queue.</p>
          <p className="text-xs mt-1">Scanned arrivals will appear here in real-time.</p>
        </div>
      ) : isMobile ? (
        <MobileQueueView
          groups={activeGroups}
          now={now}
          sessionClosed={sessionClosed}
          transitioning={transitioning}
          onTransition={handleTransition}
          onGroupTransition={handleGroupTransition}
          onException={handleException}
          onResolveException={handleResolveException}
          canTransition={canTransition}
          getNextStatus={getNextStatus}
          displayMode={displayMode}
        />
      ) : (
        <DesktopQueueView
          groups={activeGroups}
          now={now}
          sessionClosed={sessionClosed}
          transitioning={transitioning}
          onTransition={handleTransition}
          onGroupTransition={handleGroupTransition}
          onException={handleException}
          onResolveException={handleResolveException}
          canTransition={canTransition}
          getNextStatus={getNextStatus}
          displayMode={displayMode}
        />
      )}
    </div>
  )
}

function ConnectionIndicator({ status }: { status: ConnectionStatus }) {
  const config = {
    live: { icon: Wifi, text: 'Live', color: 'text-green-600 bg-green-50' },
    reconnecting: { icon: RefreshCw, text: 'Reconnecting', color: 'text-amber-600 bg-amber-50' },
    offline: { icon: WifiOff, text: 'Offline', color: 'text-red-600 bg-red-50' },
  }
  const { icon: Icon, text, color } = config[status]
  return (
    <span className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${color} ${
      status === 'reconnecting' ? 'animate-pulse' : ''
    }`}>
      <Icon className="h-3 w-3" />
      {text}
    </span>
  )
}

function CountCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    blue: 'border-blue-200 bg-blue-50 text-blue-900',
    amber: 'border-amber-200 bg-amber-50 text-amber-900',
    green: 'border-green-200 bg-green-50 text-green-900',
    gray: 'border-gray-200 bg-gray-50 text-gray-600',
    purple: 'border-purple-200 bg-purple-50 text-purple-900',
  }
  return (
    <div className={`border rounded-lg p-3 text-center ${colors[color]}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs font-medium mt-0.5">{label}</div>
    </div>
  )
}

interface QueueViewProps {
  groups: Array<{
    arrivalId: string
    items: QueueItem[]
    minSeq: number
    arrivalStatus: string
    checkinSource: string
    groupLabel: string
    allCompleted: boolean
    hasException: boolean
  }>
  now: number
  sessionClosed: boolean
  transitioning: string | null
  onTransition: (itemId: string, newStatus: string, expectedStatus?: string) => void
  onGroupTransition: (arrivalId: string, newStatus: string, expectedStatus?: string) => void
  onException: (itemId: string, reason?: string) => void
  onResolveException: (itemId: string) => void
  canTransition: (current: string, newStatus: string) => boolean
  getNextStatus: (current: string) => string | null
  displayMode: string
}

function getSourceLabel(source: string): string {
  if (source === 'qr') return 'Staff Scan'
  if (source === 'manual') return 'Manual'
  if (source === 'parent_app') return 'Self Check-In'
  return source
}

function DesktopQueueView({
  groups, now, sessionClosed, transitioning,
  onTransition, onGroupTransition, onException, onResolveException,
  canTransition, getNextStatus, displayMode,
}: QueueViewProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 border-b">
          <tr>
            <th className="text-left px-3 py-2 font-medium w-16">Queue #</th>
            <th className="text-left px-3 py-2 font-medium">Student / Group</th>
            <th className="text-left px-3 py-2 font-medium hidden md:table-cell">Classroom</th>
            <th className="text-left px-3 py-2 font-medium hidden lg:table-cell">Source</th>
            <th className="text-left px-3 py-2 font-medium hidden md:table-cell">Release</th>
            <th className="text-left px-3 py-2 font-medium w-20">Wait</th>
            <th className="text-left px-3 py-2 font-medium w-28">Status</th>
            <th className="text-right px-3 py-2 font-medium w-40">Action</th>
          </tr>
        </thead>
        <tbody>
          {groups.map(group => {
            const waitMs = now - new Date(group.items[0].created_at).getTime()
            const waitLevel = getWaitLevel(waitMs)
            const nextStatus = getNextStatus(group.arrivalStatus)
            const isTransitioning = transitioning === `group:${group.arrivalId}` ||
              group.items.some(i => transitioning === i.id)
            const canTransitionNext = nextStatus && canTransition(group.arrivalStatus, nextStatus) && !sessionClosed

            return (
              <tr
                key={group.arrivalId}
                className={`border-b last:border-0 hover:bg-accent/30 ${
                  group.hasException ? 'bg-red-50/50' : ''
                } ${displayMode === 'monitor' ? 'h-14' : ''}`}
              >
                <td className="px-3 py-2">
                  <span className={`font-bold ${displayMode === 'monitor' ? 'text-lg' : ''}`}>
                    #{group.minSeq}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <div className="font-medium">
                    {group.items.map(i => `${i.school_students.first_name} ${i.school_students.last_name}`).join(', ')}
                  </div>
                  {group.items.length > 1 && (
                    <span className="text-xs text-muted-foreground">
                      {group.items.length} students · {group.groupLabel}
                    </span>
                  )}
                  {group.hasException && (
                    <span className="text-xs text-red-600 flex items-center gap-1 mt-0.5">
                      <AlertTriangle className="h-3 w-3" />
                      {group.items.find(i => i.exception_reason)?.exception_reason || 'Exception flagged'}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 hidden md:table-cell text-muted-foreground">
                  {group.items.map(i => i.school_students.school_classrooms?.name || '—').join(', ')}
                </td>
                <td className="px-3 py-2 hidden lg:table-cell">
                  <span className="text-xs text-muted-foreground">
                    {getSourceLabel(group.checkinSource)}
                  </span>
                </td>
                <td className="px-3 py-2 hidden md:table-cell">
                  <ReleaseBadge item={group.items[0]} now={now} />
                </td>
                <td className="px-3 py-2">
                  <WaitBadge ms={waitMs} level={waitLevel} />
                </td>
                <td className="px-3 py-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[group.arrivalStatus]}`}>
                    {STATUS_LABELS[group.arrivalStatus]}
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {canTransitionNext && (
                      <button
                        onClick={() => onGroupTransition(group.arrivalId, nextStatus!, group.arrivalStatus)}
                        disabled={isTransitioning}
                        className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-medium hover:bg-primary/90 disabled:opacity-50"
                      >
                        {isTransitioning ? '...' : STATUS_LABELS[nextStatus!]}
                      </button>
                    )}
                    {canManageQueue(group.arrivalStatus, 'exception') && !group.hasException && !sessionClosed && (
                      <button
                        onClick={() => onException(group.items[0].id)}
                        className="px-1.5 py-1 border rounded text-xs hover:bg-accent"
                        title="Flag exception"
                      >
                        <AlertTriangle className="h-3 w-3" />
                      </button>
                    )}
                    {group.hasException && (
                      <button
                        onClick={() => onResolveException(group.items[0].id)}
                        className="px-1.5 py-1 border rounded text-xs hover:bg-accent"
                        title="Resolve exception"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )

  function canManageQueue(current: string, action: string): boolean {
    return true
  }
}

function MobileQueueView({
  groups, now, sessionClosed, transitioning,
  onTransition, onGroupTransition, onException, onResolveException,
  canTransition, getNextStatus, displayMode,
}: QueueViewProps) {
  return (
    <div className="space-y-3">
      {groups.map(group => {
        const waitMs = now - new Date(group.items[0].created_at).getTime()
        const waitLevel = getWaitLevel(waitMs)
        const nextStatus = getNextStatus(group.arrivalStatus)
        const isTransitioning = transitioning === `group:${group.arrivalId}` ||
          group.items.some(i => transitioning === i.id)
        const canTransitionNext = nextStatus && canTransition(group.arrivalStatus, nextStatus) && !sessionClosed
        const largeText = displayMode === 'monitor'

        return (
          <div
            key={group.arrivalId}
            className={`border rounded-lg p-4 ${group.hasException ? 'border-red-200 bg-red-50/30' : 'bg-card'}`}
          >
            {/* Top row: queue number + wait time */}
            <div className="flex items-center justify-between mb-2">
              <span className={`font-bold ${largeText ? 'text-2xl' : 'text-xl'}`}>
                #{group.minSeq}
              </span>
              <WaitBadge ms={waitMs} level={waitLevel} />
            </div>

            {/* Students */}
            <div className={largeText ? 'text-lg' : ''}>
              {group.items.map(item => (
                <div key={item.id} className="font-medium">
                  {item.school_students.first_name} {item.school_students.last_name}
                  {item.school_students.school_classrooms && (
                    <span className="text-muted-foreground text-sm ml-2">
                      {item.school_students.school_classrooms.name}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Source + exception */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">
                {getSourceLabel(group.checkinSource)}
              </span>
              {group.hasException && (
                <span className="text-xs text-red-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {group.items.find(i => i.exception_reason)?.exception_reason || 'Exception'}
                </span>
              )}
            </div>

            {/* Status + action */}
            <div className="flex items-center justify-between mt-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${STATUS_COLORS[group.arrivalStatus]}`}>
                {STATUS_LABELS[group.arrivalStatus]}
              </span>

              <div className="flex items-center gap-2">
                {canTransitionNext && (
                  <button
                    onClick={() => onGroupTransition(group.arrivalId, nextStatus!, group.arrivalStatus)}
                    disabled={isTransitioning}
                    className={`px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium ${
                      largeText ? 'text-base' : 'text-sm'
                    } hover:bg-primary/90 disabled:opacity-50 active:scale-95 transition-transform`}
                  >
                    {isTransitioning ? '...' : STATUS_LABELS[nextStatus!]}
                  </button>
                )}
                {!group.hasException && !sessionClosed && (
                  <button
                    onClick={() => onException(group.items[0].id)}
                    className="p-2 border rounded-lg hover:bg-accent"
                    title="Flag exception"
                  >
                    <AlertTriangle className="h-4 w-4" />
                  </button>
                )}
                {group.hasException && (
                  <button
                    onClick={() => onResolveException(group.items[0].id)}
                    className="p-2 border rounded-lg hover:bg-accent"
                    title="Resolve exception"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function WaitBadge({ ms, level }: { ms: number; level: 'normal' | 'attention' | 'long' }) {
  const config = {
    normal: { color: 'text-muted-foreground', icon: null },
    attention: { color: 'text-amber-600', icon: <Clock className="h-3 w-3" /> },
    long: { color: 'text-red-600', icon: <AlertTriangle className="h-3 w-3" /> },
  }
  const { color, icon } = config[level]
  return (
    <span className={`flex items-center gap-1 text-xs font-medium ${color}`}>
      {icon}
      {formatWaitTime(ms)}
    </span>
  )
}

function ReleaseBadge({ item, now }: { item: QueueItem; now: number }) {
  if (!item.release_eligible_at) {
    return <span className="text-xs text-muted-foreground">—</span>
  }
  const eligibleTime = new Date(item.release_eligible_at).getTime()
  const isEligible = now >= eligibleTime
  if (isEligible) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded">
        <CheckCircle2 className="h-3 w-3" />
        Eligible
      </span>
    )
  }
  const remaining = Math.ceil((eligibleTime - now) / 60000)
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
      <Clock className="h-3 w-3" />
      {remaining}m
    </span>
  )
}
