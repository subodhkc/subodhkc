'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Loader2, CheckCircle2, Clock, QrCode, LogOut, AlertCircle, Sparkles } from 'lucide-react'

interface QueueItem {
  queue_item_id: string
  student_id: string
  sequence_number: number
  status: string
  student_name: string
}

interface FamilyStudent {
  link_id: string
  student_id: string
  first_name: string
  last_name: string
  external_student_id: string | null
  relationship_label: string | null
  self_checkin_allowed: boolean
  pickup_groups: Array<{
    group_id: string
    label: string
    dismissal_time: string | null
    today_status: {
      queue_item_id: string
      status: string
      sequence_number: number
    } | null
  }>
}

interface FamilyData {
  students: FamilyStudent[]
  site_name: string
  today: string
}

interface CheckinResult {
  outcome: string
  message?: string
  arrival_id?: string
  queue_items?: QueueItem[]
  eligible_groups?: Array<{
    group_id: string
    label: string
    students: Array<{ student_id: string; first_name: string; last_name: string }>
  }>
}

export function FamilyPortalClient({
  siteId,
  siteName,
  orgSlug,
  siteSlug,
  initialData,
  checkinCode,
}: {
  siteId: string
  siteName: string
  orgSlug: string
  siteSlug: string
  initialData: FamilyData
  checkinCode: string | null
}) {
  const [data, setData] = useState<FamilyData>(initialData)
  const [loading, setLoading] = useState(false)
  const [checkinResult, setCheckinResult] = useState<CheckinResult | null>(null)
  const [error, setError] = useState('')
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)

  const refreshData = useCallback(async () => {
    try {
      const res = await fetch(`/api/family?site_id=${siteId}`)
      if (res.ok) {
        const fresh = await res.json()
        setData(fresh)
      }
    } catch {
      // Silent refresh failure
    }
  }, [siteId])

  // Auto-refresh every 15 seconds for status updates
  useEffect(() => {
    const interval = setInterval(refreshData, 15000)
    return () => clearInterval(interval)
  }, [refreshData])

  // If checkin code is present, auto-initiate check-in
  useEffect(() => {
    if (checkinCode) {
      handleCheckin(checkinCode, null)
    }
  }, [checkinCode])

  async function handleCheckin(code: string, groupId: string | null) {
    setLoading(true)
    setError('')
    setCheckinResult(null)

    try {
      const res = await fetch('/api/family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site_id: siteId,
          checkin_code: code,
          pickup_group_id: groupId,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        const errorMap: Record<string, string> = {
          code_invalid: 'This QR code is not valid. Please scan the current Wilshire pickup QR.',
          checkin_not_open: 'Check-in isn\'t open yet. Check-in opens during the school\'s dismissal window.',
          session_closed: 'Check-in has ended for today.',
          no_eligible_groups: 'You don\'t have any students eligible for self check-in.',
          group_not_authorized: 'You\'re not authorized to check in for this group.',
          group_not_active: 'This pickup group is not currently active.',
          no_active_students: 'No active students found in this pickup group.',
          no_guardian_access: 'Your family access has been revoked or is not active.',
          unauthenticated: 'Your session has expired. Please sign in again.',
        }
        setError(errorMap[result.error] || 'Check-in could not be completed. Please try again.')
        setLoading(false)
        return
      }

      setCheckinResult(result)

      if (result.outcome === 'select_group' && result.eligible_groups) {
        // Need group selection
        setLoading(false)
        return
      }

      // Success or duplicate: refresh data
      await refreshData()
    } catch {
      setError('Check-in not confirmed. Please check your connection and try again.')
    }

    setLoading(false)
  }

  function handleLogout() {
    window.location.href = '/login?context=family'
  }

  const hasSelfCheckinEnabled = data.students.some(s =>
    s.self_checkin_allowed && s.pickup_groups.some(pg => pg.today_status === null)
  )

  const allCheckedIn = data.students.every(s =>
    s.pickup_groups.some(pg => pg.today_status !== null)
  )

  const statusLabels: Record<string, string> = {
    arrived: 'Checked In',
    preparing: 'Preparing',
    ready: 'Ready',
    completed: 'Completed',
  }

  const statusColors: Record<string, string> = {
    arrived: 'text-blue-600',
    preparing: 'text-amber-600',
    ready: 'text-green-600',
    completed: 'text-blue-400',
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-background">
      {/* Header */}
      <header className="border-b border-sky-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/wilshire/logo-badge.svg"
              alt="Wilshire"
              width={28}
              height={28}
            />
            <span className="font-bold text-sm text-blue-900">{siteName}</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-blue-700 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Today's date */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
            <Sparkles className="h-3 w-3" />
            Family Pickup
          </div>
          <p className="text-sm text-blue-800/70 font-medium">
            {new Date(data.today).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm rounded-lg px-4 py-3 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Check-in result */}
        {checkinResult && checkinResult.outcome === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">You&apos;re checked in.</span>
            </div>
            {checkinResult.queue_items?.map((item) => {
              const student = data.students.find(s => s.student_id === item.student_id)
              const dismissalTime = student?.pickup_groups.find(pg => pg.group_id === data.students.find(s => s.student_id === item.student_id)?.pickup_groups.find(p => p.today_status?.queue_item_id === item.queue_item_id)?.group_id)?.dismissal_time
              return (
                <div key={item.queue_item_id} className="text-sm text-green-600">
                  <span className="font-medium">{item.student_name}</span>
                  {dismissalTime && <span className="text-green-500"> - Dismissal: {dismissalTime}</span>}
                </div>
              )
            })}
          </div>
        )}

        {checkinResult && checkinResult.outcome === 'duplicate' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-blue-700">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Already checked in.</span>
            </div>
            <p className="text-sm text-blue-600">Your check-in is already active. You don&apos;t need to scan again.</p>
          </div>
        )}

        {/* Group selection */}
        {checkinResult?.outcome === 'select_group' && checkinResult.eligible_groups && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-center">Who are you picking up today?</h2>
            {checkinResult.eligible_groups.map((group) => (
              <button
                key={group.group_id}
                onClick={() => {
                  setSelectedGroupId(group.group_id)
                  if (checkinCode) handleCheckin(checkinCode, group.group_id)
                }}
                disabled={loading}
                className="w-full border rounded-lg p-4 text-left hover:bg-accent transition-colors disabled:opacity-50"
              >
                <div className="font-medium text-sm">{group.label}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {group.students.map(s => `${s.first_name} ${s.last_name}`).join(', ')}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Students */}
        <div className="space-y-4">
          {data.students.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border-2 border-blue-50">
              <Image
                src="/wilshire/mascot-owl.svg"
                alt=""
                width={80}
                height={80}
                className="mx-auto mb-3 opacity-60"
              />
              <p className="text-sm text-blue-800/70">
                No students are linked to your account yet. Please contact the school office.
              </p>
            </div>
          ) : (
            data.students.map((student) => (
              <div key={student.student_id} className="bg-white border-2 border-blue-50 rounded-2xl p-4 space-y-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-700 font-bold text-sm">
                      {student.first_name.charAt(0)}{student.last_name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base text-blue-950">
                      {student.first_name} {student.last_name}
                    </h3>
                    {student.relationship_label && (
                      <p className="text-xs text-blue-700/60">{student.relationship_label}</p>
                    )}
                  </div>
                </div>

                {student.pickup_groups.map((pg) => {
                  const status = pg.today_status
                  return (
                    <div key={pg.group_id} className="flex items-center justify-between text-sm">
                      <div>
                        <span className="text-muted-foreground">{pg.label}</span>
                        {pg.dismissal_time && (
                          <span className="text-muted-foreground ml-2">
                            <Clock className="inline h-3 w-3 mr-0.5" />
                            {pg.dismissal_time}
                          </span>
                        )}
                      </div>
                      <div className="font-medium">
                        {status ? (
                          <span className={statusColors[status.status] || 'text-muted-foreground'}>
                            {statusLabels[status.status] || status.status}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Not checked in</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))
          )}
        </div>

        {/* Self check-in guidance */}
        {hasSelfCheckinEnabled && !allCheckedIn && !checkinResult && !loading && (
          <div className="bg-gradient-to-b from-blue-50 to-sky-50 border-2 border-blue-100 rounded-2xl p-5 text-center space-y-3">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto">
              <QrCode className="h-7 w-7 text-white" />
            </div>
            <p className="text-sm font-medium text-blue-900">
              Scan the Wilshire pickup QR when you reach the pickup line
            </p>
            <p className="text-xs text-blue-700/60">
              Checking in lets staff know you&apos;ve arrived. School pickup and release procedures remain unchanged.
            </p>
          </div>
        )}

        {allCheckedIn && !loading && (
          <div className="bg-gradient-to-b from-green-50 to-emerald-50 border-2 border-green-100 rounded-2xl p-5 text-center space-y-2">
            <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto" />
            <p className="text-sm font-medium text-green-900">
              Your check-in is already active. You don&apos;t need to scan again.
            </p>
          </div>
        )}

        {/* Terms */}
        <div className="border-t border-blue-100 pt-4 text-center">
          <p className="text-xs text-blue-700/60">
            By using this service, you agree to the{' '}
            <a href="/terms" className="underline hover:text-blue-900 font-medium">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="underline hover:text-blue-900 font-medium">Privacy Policy</a>.
          </p>
        </div>
      </main>
    </div>
  )
}
