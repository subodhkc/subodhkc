'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, QrCode, Users } from 'lucide-react'
import type { SchoolContext } from '@/lib/auth/school-resolver'

interface StudentDetailClientProps {
  ctx: SchoolContext
  studentId: string
  classrooms: Array<{ id: string; name: string; grade_label: string | null }>
}

interface StudentDetail {
  id: string
  first_name: string
  last_name: string
  external_student_id: string | null
  classroom_id: string | null
  status: string
  created_at: string
  updated_at: string
  archived_at: string | null
  school_classrooms?: { id: string; name: string; grade_label: string | null; teacher_display_label: string | null }[] | null
}

interface PickupGroup {
  id: string
  label: string
  status: string
  membership_status: string
}

interface Credential {
  id: string
  status: string
  issued_at: string
  revoked_at: string | null
  revoked_reason: string | null
  pickup_group_id: string
}

export function StudentDetailClient({ ctx, studentId, classrooms }: StudentDetailClientProps) {
  const router = useRouter()
  const apiBase = `/api/school-pickup/${ctx.organization.organization.slug}/${ctx.site.slug}`
  const basePath = `/app/${ctx.organization.organization.slug}/school-pickup/${ctx.site.slug}`

  const [student, setStudent] = useState<StudentDetail | null>(null)
  const [groups, setGroups] = useState<PickupGroup[]>([])
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Edit form state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [externalId, setExternalId] = useState('')
  const [classroomId, setClassroomId] = useState('')
  const [status, setStatus] = useState('active')

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await fetch(`${apiBase}/students/${studentId}`)
        if (!res.ok) throw new Error('Failed to load')
        const data = await res.json()
        setStudent(data.student)
        setGroups(data.pickup_groups || [])
        setCredentials(data.credentials || [])
        setFirstName(data.student.first_name)
        setLastName(data.student.last_name)
        setExternalId(data.student.external_student_id || '')
        setClassroomId(data.student.classroom_id || '')
        setStatus(data.student.status)
      } catch {
        setError('Failed to load student details')
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [apiBase, studentId])

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`${apiBase}/students/${studentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          external_student_id: externalId.trim() || null,
          classroom_id: classroomId || null,
          status,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        if (data.error === 'duplicate_external_id') {
          setError('A student with this external ID already exists.')
          return
        }
        throw new Error('Update failed')
      }
      setEditing(false)
      // Refresh
      const detailRes = await fetch(`${apiBase}/students/${studentId}`)
      if (detailRes.ok) {
        const data = await detailRes.json()
        setStudent(data.student)
      }
    } catch {
      setError('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading...</div>
  }

  if (!student) {
    return (
      <div className="text-center py-8 space-y-2">
        <p className="text-muted-foreground">Student not found.</p>
        <Link href={`${basePath}/students`} className="text-primary hover:underline text-sm">
          Back to Students
        </Link>
      </div>
    )
  }

  const classroom = student.school_classrooms?.[0]

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Link href={`${basePath}/students`} className="p-2 hover:bg-accent rounded-md">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold">
          {student.last_name}, {student.first_name}
        </h1>
        {student.status !== 'active' && (
          <span className="text-xs bg-yellow-500/10 text-yellow-700 px-2 py-0.5 rounded">
            {student.status}
          </span>
        )}
      </div>

      {error && (
        <div className="border border-destructive/50 rounded-lg p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Student info / edit form */}
      <div className="border rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Student Information</h2>
          {ctx.canEditRoster && !editing && (
            <button
              onClick={() => setEditing(true)}
              className="text-sm text-primary hover:underline"
            >
              Edit
            </button>
          )}
        </div>

        {editing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 bg-card border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 bg-card border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">External ID</label>
              <input
                type="text"
                value={externalId}
                onChange={(e) => setExternalId(e.target.value)}
                className="w-full px-3 py-2 bg-card border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Classroom</label>
              <select
                value={classroomId}
                onChange={(e) => setClassroomId(e.target.value)}
                className="w-full px-3 py-2 bg-card border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">No classroom</option>
                {classrooms.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}{c.grade_label ? ` (${c.grade_label})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-card border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="transferred">Transferred</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => {
                  setEditing(false)
                  setError(null)
                }}
                className="px-4 py-2 border rounded-lg text-sm hover:bg-accent/50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">External ID</dt>
              <dd className="font-medium">{student.external_student_id || '-'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Classroom</dt>
              <dd className="font-medium">{classroom?.name || '-'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Status</dt>
              <dd className="font-medium capitalize">{student.status}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Added</dt>
              <dd className="font-medium">{new Date(student.created_at).toLocaleDateString()}</dd>
            </div>
          </dl>
        )}
      </div>

      {/* Pickup groups */}
      <div className="border rounded-lg p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-semibold">Pickup Groups</h2>
        </div>
        {groups.length === 0 ? (
          <p className="text-sm text-muted-foreground">No pickup groups assigned.</p>
        ) : (
          <div className="space-y-2">
            {groups.map(g => (
              <div key={g.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">{g.label}</p>
                  <p className="text-xs text-muted-foreground">
                    Group status: {g.status} · Membership: {g.membership_status}
                  </p>
                </div>
                <Link href={`${basePath}/credentials`} className="text-sm text-primary hover:underline">
                  View credentials
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Credentials */}
      <div className="border rounded-lg p-6 space-y-3">
        <div className="flex items-center gap-2">
          <QrCode className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-semibold">Pickup Credentials</h2>
        </div>
        {credentials.length === 0 ? (
          <div className="text-sm text-muted-foreground space-y-2">
            <p>No credentials issued for this student's pickup groups.</p>
            {ctx.canIssueCredentials && groups.length > 0 && (
              <Link
                href={`${basePath}/credentials`}
                className="inline-block text-primary hover:underline"
              >
                Issue credential
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {credentials.map(c => (
              <div key={c.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium capitalize">
                    {c.status}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Issued: {new Date(c.issued_at).toLocaleDateString()}
                    {c.revoked_at && ` · Revoked: ${new Date(c.revoked_at).toLocaleDateString()}`}
                  </p>
                  {c.revoked_reason && (
                    <p className="text-xs text-muted-foreground">Reason: {c.revoked_reason}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
