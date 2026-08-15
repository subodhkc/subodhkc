'use client'

import { useState, useEffect, useCallback } from 'react'
import { Building2, Plus, ArrowRight, Loader2, Check } from 'lucide-react'

interface EligibleOrg {
  id: string
  name: string
  slug: string
}

interface OrganizationSelectionStepProps {
  /** Called when user has selected or created an organization */
  onOrganizationSelected: (org: { id: string; name: string; slug: string }) => void
  /** Whether the parent is processing checkout */
  loading?: boolean
}

export function OrganizationSelectionStep({
  onOrganizationSelected,
  loading = false,
}: OrganizationSelectionStepProps) {
  const [orgs, setOrgs] = useState<EligibleOrg[]>([])
  const [fetching, setFetching] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [newOrgName, setNewOrgName] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrgs = useCallback(async () => {
    setFetching(true)
    try {
      const res = await fetch('/api/commercial/organizations')
      const data = await res.json()
      if (data.organizations) {
        setOrgs(data.organizations)
        // If exactly one org, auto-select it
        if (data.organizations.length === 1) {
          setSelectedId(data.organizations[0].id)
        }
      }
    } catch {
      setError('Failed to load organizations')
    }
    setFetching(false)
  }, [])

  useEffect(() => {
    fetchOrgs()
  }, [fetchOrgs])

  async function handleCreate() {
    if (!newOrgName.trim() || newOrgName.trim().length < 2) {
      setError('Organization name must be at least 2 characters')
      return
    }

    setCreating(true)
    setError(null)
    try {
      const res = await fetch('/api/commercial/create-organization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newOrgName.trim() }),
      })
      const data = await res.json()
      if (data.organization) {
        setOrgs(prev => [...prev, data.organization])
        setSelectedId(data.organization.id)
        setShowCreate(false)
        setNewOrgName('')
      } else {
        setError(data.error || 'Failed to create organization')
      }
    } catch {
      setError('Network error creating organization')
    }
    setCreating(false)
  }

  function handleConfirm() {
    const org = orgs.find(o => o.id === selectedId)
    if (org) {
      onOrganizationSelected(org)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading your organizations...
      </div>
    )
  }

  // No organizations - show workspace creation
  if (orgs.length === 0 && !showCreate) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-medium mb-1">Let&apos;s set up your workspace.</p>
          <p className="text-xs text-muted-foreground mb-3">
            You need a workspace to manage your subscription and access the Advisor Desk.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <Plus className="h-4 w-4" />
            Create Workspace
          </button>
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    )
  }

  // Workspace creation form
  if (showCreate) {
    return (
      <div className="space-y-3">
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3">
          <p className="text-sm font-medium">Create a new workspace</p>
          <div>
            <label className="text-xs font-medium block mb-1">Organization name</label>
            <input
              type="text"
              value={newOrgName}
              onChange={e => setNewOrgName(e.target.value)}
              placeholder="e.g., Acme Inc."
              className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={creating || !newOrgName.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {creating && <Loader2 className="h-4 w-4 animate-spin" />}
              Create &amp; Continue
            </button>
            {orgs.length > 0 && (
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 text-sm font-medium rounded-md border hover:bg-accent/10"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Organization selection
  return (
    <div className="space-y-4">
      {orgs.length === 1 ? (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium">
              This purchase is for <strong>{orgs[0].name}</strong>.
            </p>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm font-medium">Which organization is this for?</p>
          <div className="space-y-2">
            {orgs.map(org => (
              <label
                key={org.id}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedId === org.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-accent/5'
                }`}
              >
                <input
                  type="radio"
                  name="org-select"
                  value={org.id}
                  checked={selectedId === org.id}
                  onChange={() => setSelectedId(org.id)}
                  className="sr-only"
                />
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium flex-1">{org.name}</span>
                {selectedId === org.id && <Check className="h-4 w-4 text-primary" />}
              </label>
            ))}
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-3 w-3" />
            Create new workspace
          </button>
        </>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}

      <button
        onClick={handleConfirm}
        disabled={!selectedId || loading}
        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Continue to Checkout
        {!loading && <ArrowRight className="h-4 w-4" />}
      </button>
    </div>
  )
}
