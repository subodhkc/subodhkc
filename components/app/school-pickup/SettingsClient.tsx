'use client'

import { useState } from 'react'
import { Save, AlertCircle, Check } from 'lucide-react'
import type { SchoolContext } from '@/lib/auth/school-resolver'

interface SettingsClientProps {
  ctx: SchoolContext
}

const COMMON_TIMEZONES = [
  'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'America/Phoenix', 'America/Anchorage', 'America/Toronto', 'America/Vancouver',
  'UTC',
]

export function SettingsClient({ ctx }: SettingsClientProps) {
  const apiBase = `/api/school-pickup/${ctx.organization.organization.slug}/${ctx.site.slug}`

  const [name, setName] = useState(ctx.site.name)
  const [timezone, setTimezone] = useState(ctx.site.timezone)
  const [status, setStatus] = useState(ctx.site.status)
  const [addressLine1, setAddressLine1] = useState(ctx.site.address_line1 || '')
  const [addressLine2, setAddressLine2] = useState(ctx.site.address_line2 || '')
  const [city, setCity] = useState(ctx.site.city || '')
  const [stateProvince, setStateProvince] = useState(ctx.site.state_province || '')
  const [postalCode, setPostalCode] = useState(ctx.site.postal_code || '')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    setError(null)
    setSaved(false)

    try {
      const res = await fetch(`${apiBase}/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          timezone,
          status,
          address_line1: addressLine1 || null,
          address_line2: addressLine2 || null,
          city: city || null,
          state_province: stateProvince || null,
          postal_code: postalCode || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        if (data.error === 'invalid_timezone') {
          setError('Invalid timezone. Please select a valid timezone.')
        } else if (data.error === 'invalid_status') {
          setError('Invalid status value.')
        } else if (data.error === 'unauthorized') {
          setError('You do not have permission to change settings.')
        } else {
          setError('Failed to save settings.')
        }
        return
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {error && (
        <div className="border border-destructive/50 rounded-lg p-3 text-sm text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {saved && (
        <div className="border border-accent/50 rounded-lg p-3 text-sm text-accent flex items-center gap-2">
          <Check className="h-4 w-4 shrink-0" />
          Settings saved successfully.
        </div>
      )}

      {/* Site info */}
      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="font-semibold">Site Information</h2>

        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Site Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-card border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label htmlFor="timezone" className="block text-sm font-medium mb-1">
            Timezone
          </label>
          <select
            id="timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full px-3 py-2 bg-card border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {COMMON_TIMEZONES.includes(timezone) ? null : (
              <option value={timezone}>{timezone}</option>
            )}
            {COMMON_TIMEZONES.map(tz => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground mt-1">
            Used for dismissal session scheduling and reporting.
          </p>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 bg-card border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="archived">Archived</option>
          </select>
          <p className="text-xs text-muted-foreground mt-1">
            Inactive sites are hidden from staff. Archived sites are read-only.
          </p>
        </div>
      </div>

      {/* Address */}
      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="font-semibold">Address (Optional)</h2>

        <div>
          <label htmlFor="addr1" className="block text-sm font-medium mb-1">Address Line 1</label>
          <input
            id="addr1"
            type="text"
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            className="w-full px-3 py-2 bg-card border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label htmlFor="addr2" className="block text-sm font-medium mb-1">Address Line 2</label>
          <input
            id="addr2"
            type="text"
            value={addressLine2}
            onChange={(e) => setAddressLine2(e.target.value)}
            className="w-full px-3 py-2 bg-card border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 bg-card border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium mb-1">State / Province</label>
            <input
              id="state"
              type="text"
              value={stateProvince}
              onChange={(e) => setStateProvince(e.target.value)}
              className="w-full px-3 py-2 bg-card border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div>
          <label htmlFor="postal" className="block text-sm font-medium mb-1">Postal Code</label>
          <input
            id="postal"
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="w-full px-3 py-2 bg-card border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Save button */}
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Danger zone */}
      <div className="border border-destructive/30 rounded-lg p-6 space-y-2">
        <h2 className="font-semibold text-destructive">Danger Zone</h2>
        <p className="text-sm text-muted-foreground">
          Archiving a site makes it read-only and hides it from all staff. This cannot be undone.
        </p>
        {status !== 'archived' && (
          <button
            onClick={() => {
              if (confirm('Archive this site? It will become read-only.')) {
                setStatus('archived')
              }
            }}
            className="text-sm text-destructive border border-destructive/30 px-4 py-2 rounded-lg hover:bg-destructive/5"
          >
            Archive Site
          </button>
        )}
      </div>
    </div>
  )
}
