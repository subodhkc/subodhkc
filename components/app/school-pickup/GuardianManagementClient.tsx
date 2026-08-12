'use client'

import { useState, useCallback, useEffect } from 'react'
import { Loader2, Mail, UserPlus, Send, Ban, RotateCcw, X, Users, ShieldCheck, ShieldOff } from 'lucide-react'
import type { SchoolContext } from '@/lib/auth/school-resolver'

interface StudentLink {
  id: string
  student_id: string
  relationship_label: string | null
  portal_access: boolean
  self_checkin_allowed: boolean
  status: string
}

interface Guardian {
  id: string
  email_normalized: string
  display_name: string | null
  status: string
  created_at: string
  activated_at: string | null
  revoked_at: string | null
  student_guardian_links: StudentLink[]
  invitation: { id: string; status: string; created_at: string; expires_at: string } | null
}

interface Student {
  id: string
  first_name: string
  last_name: string
  external_student_id: string | null
  status: string
}

export function GuardianManagementClient({
  ctx,
  students,
}: {
  ctx: SchoolContext
  students: Student[]
}) {
  const [guardians, setGuardians] = useState<Guardian[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [showBulkForm, setShowBulkForm] = useState(false)

  // Add form state
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [relationship, setRelationship] = useState('')
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [sendInvite, setSendInvite] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const apiBase = `/api/school-pickup/${ctx.organization.organization.slug}/${ctx.site.slug}/guardians`

  const fetchGuardians = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(apiBase)
      if (res.ok) {
        const data = await res.json()
        setGuardians(data.guardians || [])
      }
    } catch {
      setError('Failed to load guardians')
    }
    setLoading(false)
  }, [apiBase])

  useEffect(() => {
    fetchGuardians()
  }, [fetchGuardians])

  async function handleAdd() {
    if (!email || selectedStudents.length === 0) return
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch(apiBase, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          display_name: displayName || undefined,
          relationship: relationship || undefined,
          student_ids: selectedStudents,
          send_invitation: sendInvite,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to add guardian')
        setSubmitting(false)
        return
      }

      // Reset form
      setEmail('')
      setDisplayName('')
      setRelationship('')
      setSelectedStudents([])
      setSendInvite(true)
      setShowAddForm(false)
      await fetchGuardians()
    } catch {
      setError('Network error')
    }
    setSubmitting(false)
  }

  async function handleManage(guardianId: string, action: string, extra?: Record<string, any>) {
    try {
      const res = await fetch(`${apiBase}/manage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guardian_id: guardianId, action, ...extra }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Action failed')
        return
      }
      await fetchGuardians()
    } catch {
      setError('Network error')
    }
  }

  async function handleLinkUpdate(linkId: string, action: string, extra?: Record<string, any>) {
    try {
      const res = await fetch(`${apiBase}/manage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link_id: linkId, action, ...extra }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Update failed')
        return
      }
      await fetchGuardians()
    } catch {
      setError('Network error')
    }
  }

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; className: string }> = {
      pending: { label: 'Pending', className: 'bg-amber-100 text-amber-700' },
      active: { label: 'Active', className: 'bg-green-100 text-green-700' },
      suspended: { label: 'Suspended', className: 'bg-orange-100 text-orange-700' },
      revoked: { label: 'Revoked', className: 'bg-red-100 text-red-700' },
    }
    const s = map[status] || { label: status, className: 'bg-gray-100 text-gray-600' }
    return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.className}`}>{s.label}</span>
  }

  const invitationBadge = (status: string | null) => {
    if (!status) return null
    const map: Record<string, { label: string; className: string }> = {
      pending: { label: 'Invitation Sent', className: 'bg-blue-50 text-blue-600' },
      accepted: { label: 'Invitation Accepted', className: 'bg-green-50 text-green-600' },
      revoked: { label: 'Invitation Revoked', className: 'bg-red-50 text-red-600' },
      expired: { label: 'Invitation Expired', className: 'bg-gray-100 text-gray-500' },
      failed: { label: 'Email Failed', className: 'bg-red-50 text-red-600' },
    }
    const s = map[status] || { label: status, className: 'bg-gray-100 text-gray-500' }
    return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.className}`}>{s.label}</span>
  }

  const studentName = (studentId: string) => {
    const s = students.find(s => s.id === studentId)
    return s ? `${s.first_name} ${s.last_name}` : 'Unknown'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-blue-950">Family Access</h1>
          <p className="text-sm text-blue-700/60 mt-1">
            Manage guardian accounts and student linking for {ctx.site.name}.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setShowBulkForm(!showBulkForm); setShowAddForm(false) }}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm border-2 border-blue-100 text-blue-700 rounded-xl hover:bg-blue-50 transition-colors font-medium"
          >
            <Users className="h-4 w-4" />
            Bulk Import
          </button>
          <button
            onClick={() => { setShowAddForm(!showAddForm); setShowBulkForm(false) }}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-sm"
          >
            <UserPlus className="h-4 w-4" />
            Add Guardian
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Add Guardian Form */}
      {showAddForm && (
        <div className="border rounded-lg p-4 space-y-4 bg-card">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Add Guardian</h2>
            <button onClick={() => setShowAddForm(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parent@example.com"
                className="w-full mt-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Display Name (optional)</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full mt-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Relationship (optional)</label>
            <input
              type="text"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="Parent, Guardian, Grandparent..."
              className="w-full mt-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Link to Students</label>
            <div className="max-h-48 overflow-y-auto space-y-1 border rounded-lg p-2">
              {students.filter(s => s.status === 'active').map((s) => (
                <label key={s.id} className="flex items-center gap-2 text-sm py-1 px-2 hover:bg-accent rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(s.id)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedStudents([...selectedStudents, s.id])
                      else setSelectedStudents(selectedStudents.filter(id => id !== s.id))
                    }}
                    className="rounded"
                  />
                  <span>{s.first_name} {s.last_name}</span>
                  {s.external_student_id && <span className="text-xs text-muted-foreground">({s.external_student_id})</span>}
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={sendInvite}
              onChange={(e) => setSendInvite(e.target.checked)}
              className="rounded"
            />
            <span>Send invitation email</span>
          </label>

          <button
            onClick={handleAdd}
            disabled={submitting || !email || selectedStudents.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Add & {sendInvite ? 'Invite' : 'Save'}
          </button>
        </div>
      )}

      {/* Bulk Import Form */}
      {showBulkForm && (
        <div className="border rounded-lg p-4 space-y-4 bg-card">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Bulk Import Guardians</h2>
            <button onClick={() => setShowBulkForm(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            Upload a CSV file with columns: <code className="text-xs bg-muted px-1 py-0.5 rounded">email, display_name, relationship, student_external_id</code>
          </p>
          <BulkImportForm
            apiBase={apiBase}
            students={students}
            onDone={fetchGuardians}
          />
        </div>
      )}

      {/* Guardians List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : guardians.length === 0 ? (
        <div className="text-center py-12 border-2 border-blue-50 rounded-2xl bg-white">
          <Mail className="h-10 w-10 text-blue-200 mx-auto mb-3" />
          <p className="text-sm text-blue-800/70 font-medium">No guardians have been added yet.</p>
          <p className="text-xs text-blue-700/50 mt-1">Click &quot;Add Guardian&quot; to invite a family member.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {guardians.map((g) => (
            <div key={g.id} className="bg-white border-2 border-blue-50 rounded-2xl p-4 space-y-3 hover:border-blue-200 transition-colors">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{g.display_name || g.email_normalized}</span>
                    {statusBadge(g.status)}
                    {invitationBadge(g.invitation?.status || null)}
                  </div>
                  <div className="text-xs text-muted-foreground">{g.email_normalized}</div>
                </div>
                <div className="flex gap-1">
                  {g.status === 'active' && (
                    <>
                      <button
                        onClick={() => handleManage(g.id, 'suspend')}
                        className="p-1.5 text-muted-foreground hover:text-orange-600 hover:bg-orange-50 rounded"
                        title="Suspend"
                      >
                        <Ban className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleManage(g.id, 'revoke', { reason: 'Revoked by admin' })}
                        className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded"
                        title="Revoke"
                      >
                        <ShieldOff className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  {g.status === 'suspended' && (
                    <button
                      onClick={() => handleManage(g.id, 'reactivate')}
                      className="p-1.5 text-muted-foreground hover:text-green-600 hover:bg-green-50 rounded"
                      title="Reactivate"
                    >
                      <ShieldCheck className="h-4 w-4" />
                    </button>
                  )}
                  {g.status === 'revoked' && (
                    <button
                      onClick={() => handleManage(g.id, 'reactivate')}
                      className="p-1.5 text-muted-foreground hover:text-green-600 hover:bg-green-50 rounded"
                      title="Reactivate"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  )}
                  {g.invitation?.status === 'pending' && (
                    <button
                      onClick={() => handleManage(g.id, 'resend_invitation')}
                      className="p-1.5 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 rounded"
                      title="Resend invitation"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Student Links */}
              {g.student_guardian_links && g.student_guardian_links.length > 0 && (
                <div className="space-y-2 pt-2 border-t">
                  {g.student_guardian_links.map((link) => (
                    <div key={link.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span>{studentName(link.student_id)}</span>
                        {link.relationship_label && (
                          <span className="text-xs text-muted-foreground">({link.relationship_label})</span>
                        )}
                        {link.status === 'revoked' && (
                          <span className="text-xs text-red-500">unlinked</span>
                        )}
                      </div>
                      {link.status === 'active' && (
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1 text-xs text-muted-foreground cursor-pointer">
                            <input
                              type="checkbox"
                              checked={link.portal_access}
                              onChange={(e) => handleLinkUpdate(link.id, 'update_link', { portal_access: e.target.checked })}
                              className="rounded"
                            />
                            Portal
                          </label>
                          <label className="flex items-center gap-1 text-xs text-muted-foreground cursor-pointer">
                            <input
                              type="checkbox"
                              checked={link.self_checkin_allowed}
                              onChange={(e) => handleLinkUpdate(link.id, 'update_link', { self_checkin_allowed: e.target.checked })}
                              className="rounded"
                            />
                            Self Check-in
                          </label>
                          <button
                            onClick={() => handleLinkUpdate(link.id, 'unlink')}
                            className="text-xs text-muted-foreground hover:text-red-500"
                          >
                            Unlink
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function BulkImportForm({
  apiBase,
  students,
  onDone,
}: {
  apiBase: string
  students: Student[]
  onDone: () => void
}) {
  const [csvText, setCsvText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ success: number; failed: number; errors: string[] } | null>(null)

  async function handleImport() {
    if (!csvText.trim()) return
    setSubmitting(true)
    setResult(null)

    const lines = csvText.trim().split('\n')
    const headers = lines[0].toLowerCase().split(',').map(h => h.trim())

    let success = 0
    let failed = 0
    const errors: string[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      const row: Record<string, string> = {}
      headers.forEach((h, idx) => { row[h] = values[idx] || '' })

      if (!row.email) {
        failed++
        errors.push(`Row ${i + 1}: Missing email`)
        continue
      }

      // Find student by external_student_id
      let studentIds: string[] = []
      if (row.student_external_id) {
        const matched = students.filter(s =>
          s.external_student_id === row.student_external_id && s.status === 'active'
        )
        studentIds = matched.map(s => s.id)
      }

      if (studentIds.length === 0) {
        failed++
        errors.push(`Row ${i + 1}: No matching student for "${row.student_external_id || 'N/A'}"`)
        continue
      }

      try {
        const res = await fetch(apiBase, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: row.email,
            display_name: row.display_name || undefined,
            relationship: row.relationship || undefined,
            student_ids: studentIds,
            send_invitation: true,
          }),
        })

        if (res.ok) {
          success++
        } else {
          failed++
          const data = await res.json()
          errors.push(`Row ${i + 1}: ${data.error || 'Failed'}`)
        }
      } catch {
        failed++
        errors.push(`Row ${i + 1}: Network error`)
      }
    }

    setResult({ success, failed, errors })
    setSubmitting(false)
    if (success > 0) onDone()
  }

  return (
    <div className="space-y-3">
      <textarea
        value={csvText}
        onChange={(e) => setCsvText(e.target.value)}
        placeholder="email,display_name,relationship,student_external_id&#10;parent@example.com,Jane Doe,Parent,STU001&#10;dad@example.com,John Doe,Father,STU002"
        className="w-full h-32 px-3 py-2 text-xs font-mono border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
      <button
        onClick={handleImport}
        disabled={submitting || !csvText.trim()}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Import & Send Invitations
      </button>
      {result && (
        <div className="text-sm space-y-1">
          <span className="text-green-600">{result.success} imported successfully.</span>
          {result.failed > 0 && <span className="text-red-600 ml-2">{result.failed} failed.</span>}
          {result.errors.length > 0 && (
            <ul className="text-xs text-red-500 mt-2 space-y-0.5">
              {result.errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
