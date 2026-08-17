'use client'

import { useState, useEffect, useCallback } from 'react'
import { Building2, Plus, ArrowRight, Loader2, Check } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase-browser'
import { useAdvisorAnalytics } from '@/components/commercial/useAdvisorAnalytics'

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
  const [fetching, setFetching] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [newOrgName, setNewOrgName] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [unauthenticated, setUnauthenticated] = useState(false)
  const { track } = useAdvisorAnalytics()

  const fetchOrgs = useCallback(async () => {
    // Check auth state via browser client first to avoid 401 console errors
    const browserClient = createBrowserClient()
    if (!browserClient) {
      setUnauthenticated(true)
      setFetching(false)
      return
    }
    const { data: { session } } = await browserClient.auth.getSession()
    if (!session) {
      setUnauthenticated(true)
      setFetching(false)
      return
    }

    setFetching(true)
    try {
      const res = await fetch('/api/commercial/organizations')
      if (res.status === 401) {
        setUnauthenticated(true)
        setFetching(false)
        return
      }
      const data = await res.json()
      if (data.organizations) {
        setOrgs(data.organizations)
        // If exactly one org, auto-select and notify parent
        if (data.organizations.length === 1) {
          setSelectedId(data.organizations[0].id)
          onOrganizationSelected(data.organizations[0])
        }
      }
    } catch {
      setError('Failed to load workspaces')
    }
    setFetching(false)
  }, [onOrganizationSelected])

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
        track('advisor_org_created', { orgId: data.organization.id })
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

  // Unauthenticated - show sign-in prompt
  if (unauthenticated) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-medium mb-1">Sign in required.</p>
          <p className="text-xs text-muted-foreground mb-3">
            You need an account to proceed. This keeps your workspace and purchases secure.
          </p>
          <a
            href={`/login?next=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/')}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowRight className="h-4 w-4" />
            Sign In
          </a>
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    )
  }

  // No organizations - show organization/business name entry
  if (orgs.length === 0 && !showCreate) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-medium mb-1">Who is this Advisor Desk for?</p>
          <p className="text-xs text-muted-foreground mb-3">
            Enter the organization or business you want this Advisor Desk to support.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <Plus className="h-4 w-4" />
            Continue to Checkout
          </button>
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    )
  }

  // Organization / business name entry form
  if (showCreate) {
    return (
      <div className="space-y-3">
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3">
          <p className="text-sm font-medium">Who is this Advisor Desk for?</p>
          <div>
            <label className="text-xs font-medium block mb-1">Organization / Business Name</label>
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
              Continue to Checkout
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
              Workspace: <strong>{orgs[0].name}</strong>
            </p>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm font-medium">Who is this Advisor Desk for?</p>
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
            Add a different organization
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
