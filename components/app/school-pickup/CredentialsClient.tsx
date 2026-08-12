'use client'

import { useState, useEffect } from 'react'
import { QrCode, RefreshCw, Ban, AlertCircle, Copy, Check, Printer, X, LayoutGrid, Tag } from 'lucide-react'
import type { SchoolContext } from '@/lib/auth/school-resolver'
import { CredentialPrintCard } from './CredentialPrintCard'

interface CredentialsClientProps {
  ctx: SchoolContext
}

interface Credential {
  id: string
  status: string
  issued_at: string
  revoked_at: string | null
  revoked_reason: string | null
  replaced_by: string | null
  pickup_group_id: string
  pickup_groups: {
    id: string
    label: string
    pickup_group_students: Array<{
      student_id: string
      status: string
      school_students: {
        id: string
        first_name: string
        last_name: string
        external_student_id: string | null
        status: string
      }
    }>
  }
}

export function CredentialsClient({ ctx }: CredentialsClientProps) {
  const apiBase = `/api/school-pickup/${ctx.organization.organization.slug}/${ctx.site.slug}`

  const [credentials, setCredentials] = useState<Credential[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newToken, setNewToken] = useState<{ token: string; group_label: string; students: string[] } | null>(null)
  const [copied, setCopied] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [printLayout, setPrintLayout] = useState<'card' | 'label'>('card')
  const [showPrintPreview, setShowPrintPreview] = useState(false)

  useEffect(() => {
    fetchCredentials()
  }, [])

  async function fetchCredentials() {
    setLoading(true)
    try {
      const res = await fetch(`${apiBase}/credentials`)
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setCredentials(data.credentials || [])
    } catch {
      setError('Failed to load credentials')
    } finally {
      setLoading(false)
    }
  }

  async function handleIssue(groupId: string, groupLabel: string) {
    setActionLoading(`issue-${groupId}`)
    setError(null)
    try {
      const res = await fetch(`${apiBase}/credentials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pickup_group_id: groupId }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to issue credential')
        return
      }
      const data = await res.json()
      const students = groupStudentsMap.get(groupId) || []
      setNewToken({ token: data.token, group_label: groupLabel, students })
      setShowPrintPreview(true)
      fetchCredentials()
    } catch {
      setError('Network error')
    } finally {
      setActionLoading(null)
    }
  }

  async function handleRevoke(credentialId: string) {
    if (!confirm('Revoke this credential? The QR code will stop working immediately.')) return
    setActionLoading(`revoke-${credentialId}`)
    setError(null)
    try {
      const res = await fetch(`${apiBase}/credentials/${credentialId}/revoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Revoked by admin' }),
      })
      if (!res.ok) {
        setError('Failed to revoke credential')
        return
      }
      fetchCredentials()
    } catch {
      setError('Network error')
    } finally {
      setActionLoading(null)
    }
  }

  async function handleReplace(credentialId: string) {
    if (!confirm('Replace this credential? The old QR code will be revoked and a new one issued.')) return
    setActionLoading(`replace-${credentialId}`)
    setError(null)
    try {
      const res = await fetch(`${apiBase}/credentials/${credentialId}/replace`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Replaced by admin' }),
      })
      if (!res.ok) {
        setError('Failed to replace credential')
        return
      }
      const data = await res.json()
      const cred = credentials.find(c => c.id === credentialId)
      const students = cred?.pickup_groups.pickup_group_students
        .filter(s => s.status === 'active')
        .map(s => `${s.school_students.first_name} ${s.school_students.last_name}`) || []
      setNewToken({ token: data.token, group_label: cred?.pickup_groups.label || 'Unknown', students })
      setShowPrintPreview(true)
      fetchCredentials()
    } catch {
      setError('Network error')
    } finally {
      setActionLoading(null)
    }
  }

  function copyToken() {
    if (newToken) {
      navigator.clipboard.writeText(newToken.token)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Group credentials by pickup group
  const groupedByGroup = new Map<string, { label: string; students: string[]; creds: Credential[] }>()
  const groupStudentsMap = new Map<string, string[]>()
  for (const cred of credentials) {
    const groupId = cred.pickup_group_id
    if (!groupedByGroup.has(groupId)) {
      const students = cred.pickup_groups.pickup_group_students
        .filter(s => s.status === 'active')
        .map(s => `${s.school_students.first_name} ${s.school_students.last_name}`)
      groupedByGroup.set(groupId, {
        label: cred.pickup_groups.label,
        students,
        creds: [],
      })
      groupStudentsMap.set(groupId, students)
    }
    groupedByGroup.get(groupId)!.creds.push(cred)
  }

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading...</div>
  }

  return (
    <div className={`space-y-6 ${showPrintPreview ? 'print:hidden' : ''}`}>
      <h1 className="text-2xl font-bold">QR / Pickup Credentials</h1>

      {error && (
        <div className="border border-destructive/50 rounded-lg p-3 text-sm text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* New token display with print preview */}
      {newToken && !showPrintPreview && (
        <div className="border-2 border-accent rounded-lg p-6 space-y-4 bg-accent/5">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-accent" />
            <h2 className="font-semibold">Credential Issued for {newToken.group_label}</h2>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-2">QR Token (save this now - it will not be shown again):</p>
            <div className="flex items-center gap-2">
              <code className="text-xs font-mono break-all flex-1 bg-muted px-3 py-2 rounded">
                {newToken.token}
              </code>
              <button
                onClick={copyToken}
                className="p-2 hover:bg-accent rounded-md shrink-0"
                title="Copy token"
              >
                {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPrintPreview(true)}
              className="flex items-center gap-1.5 px-4 py-2 border rounded-lg text-sm hover:bg-accent/50"
            >
              <Printer className="h-4 w-4" /> Print Preview
            </button>
            <button
              onClick={() => setNewToken(null)}
              className="px-4 py-2 border rounded-lg text-sm hover:bg-accent/50"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Print preview modal */}
      {newToken && showPrintPreview && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 print:hidden">
          <div className="bg-card border rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-4 border-b print:hidden">
              <h2 className="font-semibold">Print Preview</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPrintLayout('card')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${printLayout === 'card' ? 'bg-primary text-primary-foreground' : 'border hover:bg-accent/50'}`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" /> Card
                </button>
                <button
                  onClick={() => setPrintLayout('label')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${printLayout === 'label' ? 'bg-primary text-primary-foreground' : 'border hover:bg-accent/50'}`}
                >
                  <Tag className="h-3.5 w-3.5" /> Label
                </button>
                <button
                  onClick={() => { setShowPrintPreview(false); setNewToken(null) }}
                  className="p-1.5 hover:bg-muted rounded-lg"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="print:hidden mb-4 text-sm text-muted-foreground">
                Preview of the credential {printLayout === 'card' ? 'card' : 'label'} that will be printed. Click "Print" to send to your printer.
              </div>
              <CredentialPrintCard
                token={newToken.token}
                groupLabel={newToken.group_label}
                students={newToken.students}
                siteName={ctx.site.name}
                orgName={ctx.organization.organization.name}
                layout={printLayout}
              />
            </div>
            <div className="flex items-center justify-between p-4 border-t print:hidden">
              <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Copy className="h-3 w-3" />
                <button
                  onClick={copyToken}
                  className="hover:text-foreground"
                >
                  {copied ? 'Copied!' : 'Copy token'}
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90"
                >
                  <Printer className="h-4 w-4" /> Print
                </button>
                <button
                  onClick={() => { setShowPrintPreview(false); setNewToken(null) }}
                  className="px-4 py-2 border rounded-lg text-sm hover:bg-accent/50"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Credentials by group */}
      {groupedByGroup.size === 0 ? (
        <div className="border rounded-lg p-8 text-center space-y-3">
          <QrCode className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h2 className="font-semibold">No credentials issued</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Credentials are created automatically when you add students. Issue a QR code
              for each pickup group to enable scanning.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {Array.from(groupedByGroup.entries()).map(([groupId, group]) => {
            const activeCred = group.creds.find(c => c.status === 'active')
            return (
              <div key={groupId} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="font-medium">{group.label}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {group.students.join(', ') || 'No students'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {ctx.canIssueCredentials && !activeCred && (
                      <button
                        onClick={() => handleIssue(groupId, group.label)}
                        disabled={actionLoading === `issue-${groupId}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 disabled:opacity-50"
                      >
                        <QrCode className="h-3.5 w-3.5" />
                        {actionLoading === `issue-${groupId}` ? 'Issuing...' : 'Issue QR'}
                      </button>
                    )}
                    {ctx.canIssueCredentials && activeCred && (
                      <>
                        <button
                          onClick={() => handleReplace(activeCred.id)}
                          disabled={actionLoading === `replace-${activeCred.id}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs hover:bg-accent/50 disabled:opacity-50"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          {actionLoading === `replace-${activeCred.id}` ? 'Replacing...' : 'Replace'}
                        </button>
                        <button
                          onClick={() => handleRevoke(activeCred.id)}
                          disabled={actionLoading === `revoke-${activeCred.id}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-destructive/30 text-destructive rounded-lg text-xs hover:bg-destructive/5 disabled:opacity-50"
                        >
                          <Ban className="h-3.5 w-3.5" />
                          {actionLoading === `revoke-${activeCred.id}` ? 'Revoking...' : 'Revoke'}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Credential history */}
                {group.creds.length > 0 && (
                  <div className="space-y-1">
                    {group.creds.map(c => (
                      <div key={c.id} className="flex items-center justify-between text-xs py-1.5 border-t">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded ${
                            c.status === 'active'
                              ? 'bg-accent/20 text-accent'
                              : c.status === 'revoked'
                              ? 'bg-destructive/10 text-destructive'
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {c.status}
                          </span>
                          <span className="text-muted-foreground">
                            Issued {new Date(c.issued_at).toLocaleDateString()}
                          </span>
                          {c.revoked_reason && (
                            <span className="text-muted-foreground">· {c.revoked_reason}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Security note */}
      <div className="border rounded-lg p-4 text-sm bg-accent/10 space-y-2">
        <h2 className="font-semibold">Security Notes</h2>
        <ul className="space-y-1 text-muted-foreground">
          <li>QR tokens are shown only once at issuance. Store them securely.</li>
          <li>Revoking a credential immediately invalidates the QR code.</li>
          <li>Replacing creates a new credential and revokes the old one.</li>
          <li>Tokens contain no student PII - they are opaque random identifiers.</li>
        </ul>
      </div>
    </div>
  )
}
