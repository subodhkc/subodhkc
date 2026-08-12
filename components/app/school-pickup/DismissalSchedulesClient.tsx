'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Trash2, Clock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const SCHOOL_DAYS = [1, 2, 3, 4, 5] // Mon-Fri

interface Schedule {
  id: string
  pickup_group_id: string | null
  day_of_week: number
  dismissal_time: string
  release_lead_minutes: number
  is_active: boolean
}

interface DismissalGroup {
  id: string
  name: string
}

interface DismissalSchedulesClientProps {
  orgSlug: string
  siteSlug: string
  canManage: boolean
  groups: DismissalGroup[]
}

export function DismissalSchedulesClient({ orgSlug, siteSlug, canManage, groups }: DismissalSchedulesClientProps) {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    pickup_group_id: '',
    day_of_week: '1',
    dismissal_time: '15:00',
    release_lead_minutes: '0',
  })

  const loadSchedules = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/school-pickup/${orgSlug}/${siteSlug}/schedules`)
      if (res.ok) {
        const data = await res.json()
        setSchedules(data.schedules || [])
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [orgSlug, siteSlug])

  useEffect(() => {
    loadSchedules()
  }, [loadSchedules])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch(`/api/school-pickup/${orgSlug}/${siteSlug}/schedules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickup_group_id: form.pickup_group_id || null,
          day_of_week: parseInt(form.day_of_week),
          dismissal_time: form.dismissal_time,
          release_lead_minutes: parseInt(form.release_lead_minutes) || 0,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setSchedules([...schedules, data.schedule])
        setShowForm(false)
      } else {
        const data = await res.json()
        setError(data.error === 'duplicate_schedule' ? 'A schedule already exists for this day and group.' : 'Failed to create schedule.')
      }
    } catch {
      setError('Network error.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/school-pickup/${orgSlug}/${siteSlug}/schedules?id=${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setSchedules(schedules.filter(s => s.id !== id))
      }
    } catch {
      // ignore
    }
  }

  function formatTime(time: string) {
    const [h, m] = time.split(':')
    const hour = parseInt(h)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:${m} ${ampm}`
  }

  function groupName(id: string | null) {
    if (!id) return 'Site Default'
    const g = groups.find(g => g.id === id)
    return g ? g.name : 'Unknown Group'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Dismissal Schedules
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Optional. Configure dismissal times per day of week. Group-specific schedules override the site default.
          </p>
        </div>
        {canManage && !showForm && (
          <Button onClick={() => setShowForm(true)} size="sm" variant="outline">
            <Plus className="h-4 w-4" /> Add Schedule
          </Button>
        )}
      </div>

      {showForm && canManage && (
        <Card>
          <CardContent className="pt-4">
            <form onSubmit={handleCreate} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium block mb-1">Applies To</label>
                  <select
                    value={form.pickup_group_id}
                    onChange={(e) => setForm({ ...form, pickup_group_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="">Site Default (all groups)</option>
                    {groups.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Day of Week</label>
                  <select
                    value={form.day_of_week}
                    onChange={(e) => setForm({ ...form, day_of_week: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    {DAYS.map((day, i) => (
                      <option key={i} value={i}>{day}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Dismissal Time</label>
                  <input
                    type="time"
                    value={form.dismissal_time}
                    onChange={(e) => setForm({ ...form, dismissal_time: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Release Lead (minutes early)</label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={form.release_lead_minutes}
                    onChange={(e) => setForm({ ...form, release_lead_minutes: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="flex gap-2">
                <Button type="submit" disabled={submitting} size="sm">
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Create
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => { setShowForm(false); setError('') }}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {schedules.length === 0 ? (
        <Card className="bg-muted/30">
          <CardContent className="pt-6 text-center text-muted-foreground text-sm">
            No schedules configured. Sessions can still be started manually at any time.
            {canManage && ' Add schedules to enable automatic session creation and release timing.'}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-2">
          {schedules
            .sort((a, b) => a.day_of_week - b.day_of_week || a.pickup_group_id?.localeCompare(b.pickup_group_id || '') || 0)
            .map((schedule) => (
              <Card key={schedule.id}>
              <CardContent className="pt-3 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-sm">
                    <span className="font-medium">{DAYS[schedule.day_of_week]}</span>
                    <span className="text-muted-foreground ml-2">{formatTime(schedule.dismissal_time)}</span>
                    {schedule.release_lead_minutes > 0 && (
                      <span className="text-xs bg-secondary px-1.5 py-0.5 rounded ml-2">
                        {schedule.release_lead_minutes}min early
                      </span>
                    )}
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                    {groupName(schedule.pickup_group_id)}
                  </span>
                </div>
                {canManage && (
                  <button
                    onClick={() => handleDelete(schedule.id)}
                    className="p-1.5 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive"
                    title="Delete schedule"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
