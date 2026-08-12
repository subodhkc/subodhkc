'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Trash2, GripVertical, Loader2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

interface DismissalGroup {
  id: string
  name: string
  label: string | null
  description: string | null
  sort_order: number
  status: string
}

interface DismissalGroupsClientProps {
  orgSlug: string
  siteSlug: string
  canEdit: boolean
}

export function DismissalGroupsClient({ orgSlug, siteSlug, canEdit }: DismissalGroupsClientProps) {
  const [groups, setGroups] = useState<DismissalGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const loadGroups = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/school-pickup/${orgSlug}/${siteSlug}/groups`)
      if (res.ok) {
        const data = await res.json()
        setGroups(data.groups || [])
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [orgSlug, siteSlug])

  useEffect(() => {
    loadGroups()
  }, [loadGroups])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch(`/api/school-pickup/${orgSlug}/${siteSlug}/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), description: newDescription.trim() || undefined }),
      })
      if (res.ok) {
        const data = await res.json()
        setGroups([...groups, data.group])
        setNewName('')
        setNewDescription('')
        setShowForm(false)
      } else {
        const data = await res.json()
        setError(data.error === 'duplicate_name' ? 'A group with this name already exists.' : 'Failed to create group.')
      }
    } catch {
      setError('Network error.')
    } finally {
      setSubmitting(false)
    }
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
            <Users className="h-5 w-5" />
            Dismissal Groups
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Groups allow differentiated dismissal timing and routing. Optional — students without a group use the site default.
          </p>
        </div>
        {canEdit && !showForm && (
          <Button onClick={() => setShowForm(true)} size="sm" variant="outline">
            <Plus className="h-4 w-4" /> Add Group
          </Button>
        )}
      </div>

      {showForm && canEdit && (
        <Card>
          <CardContent className="pt-4 space-y-3">
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-sm font-medium block mb-1">Group Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g., Car Riders, Bus Riders, Walkers"
                  required
                  maxLength={100}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Description (optional)</label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Brief description of this group"
                  maxLength={200}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
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

      {groups.length === 0 ? (
        <Card className="bg-muted/30">
          <CardContent className="pt-6 text-center text-muted-foreground text-sm">
            No dismissal groups configured. The system works without groups — all students use the site default schedule.
            {canEdit && ' Create groups if you need differentiated dismissal timing.'}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {groups.map((group) => (
            <Card key={group.id}>
              <CardContent className="pt-4 flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{group.name}</span>
                    {group.label && group.label !== group.name && (
                      <span className="text-xs text-muted-foreground">({group.label})</span>
                    )}
                  </div>
                  {group.description && (
                    <p className="text-sm text-muted-foreground ml-6">{group.description}</p>
                  )}
                </div>
                <span className="text-xs bg-secondary px-2 py-1 rounded">{group.status}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
