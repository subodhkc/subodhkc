'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import type { SchoolContext } from '@/lib/auth/school-resolver'

interface AddStudentClientProps {
  ctx: SchoolContext
  classrooms: Array<{ id: string; name: string; grade_label: string | null }>
}

export function AddStudentClient({ ctx, classrooms }: AddStudentClientProps) {
  const router = useRouter()
  const apiBase = `/api/school-pickup/${ctx.organization.organization.slug}/${ctx.site.slug}`
  const basePath = `/app/${ctx.organization.organization.slug}/school-pickup/${ctx.site.slug}`

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [externalId, setExternalId] = useState('')
  const [classroomId, setClassroomId] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim()) return
    setSaving(true)
    setError(null)

    try {
      const res = await fetch(`${apiBase}/students/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          external_student_id: externalId.trim() || null,
          classroom_id: classroomId || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        if (data.error === 'duplicate_external_id') {
          setError('A student with this external ID already exists.')
        } else if (data.error === 'unauthorized') {
          setError('You do not have permission to add students.')
        } else {
          setError('Failed to add student. Please try again.')
        }
        return
      }

      router.push(`${basePath}/students`)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-2">
        <Link href={`${basePath}/students`} className="p-2 hover:bg-accent rounded-md">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold">Add Student</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium mb-1">
              First Name <span className="text-destructive">*</span>
            </label>
            <input
              id="first_name"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 bg-card border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium mb-1">
              Last Name <span className="text-destructive">*</span>
            </label>
            <input
              id="last_name"
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 bg-card border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              autoComplete="off"
            />
          </div>
        </div>

        <div>
          <label htmlFor="external_id" className="block text-sm font-medium mb-1">
            External Student ID
          </label>
          <input
            id="external_id"
            type="text"
            value={externalId}
            onChange={(e) => setExternalId(e.target.value)}
            placeholder="Optional - e.g., student number from SIS"
            className="w-full px-3 py-2 bg-card border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            autoComplete="off"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Must be unique within this school site.
          </p>
        </div>

        <div>
          <label htmlFor="classroom" className="block text-sm font-medium mb-1">
            Classroom
          </label>
          <select
            id="classroom"
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
          {classrooms.length === 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              No classrooms yet. You can assign one later.
            </p>
          )}
        </div>

        {error && (
          <div className="border border-destructive/50 rounded-lg p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Add Student'}
          </button>
          <Link
            href={`${basePath}/students`}
            className="px-4 py-2 border rounded-lg text-sm hover:bg-accent/50"
          >
            Cancel
          </Link>
        </div>
      </form>

      <div className="text-sm text-muted-foreground border rounded-lg p-4 bg-accent/10">
        <p>A default pickup group will be created automatically for this student.</p>
      </div>
    </div>
  )
}
