'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Search, Plus, Upload, Users, ChevronRight } from 'lucide-react'
import type { SchoolContext } from '@/lib/auth/school-resolver'

interface StudentsListClientProps {
  ctx: SchoolContext
  classrooms: Array<{ id: string; name: string; grade_label: string | null }>
}

interface Student {
  id: string
  first_name: string
  last_name: string
  external_student_id: string | null
  classroom_id: string | null
  status: string
  school_classrooms?: { name: string; grade_label: string | null }[] | null
}

export function StudentsListClient({ ctx, classrooms }: StudentsListClientProps) {
  const basePath = `/app/${ctx.organization.organization.slug}/school-pickup/${ctx.site.slug}`
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('active')
  const [classroomFilter, setClassroomFilter] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 50

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (statusFilter !== 'active') params.set('status', statusFilter)
      if (classroomFilter) params.set('classroom_id', classroomFilter)
      params.set('page', String(page))
      params.set('limit', String(limit))

      const apiBase = `/api/school-pickup/${ctx.organization.organization.slug}/${ctx.site.slug}`
      const res = await fetch(`${apiBase}/students?${params}`)
      if (!res.ok) throw new Error('Failed to load students')
      const data = await res.json()
      setStudents(data.students || [])
      setTotal(data.total || 0)
    } catch (err) {
      setError('Failed to load students')
    } finally {
      setLoading(false)
    }
  }, [basePath, search, statusFilter, classroomFilter, page])

  useEffect(() => {
    const timer = setTimeout(fetchStudents, search ? 300 : 0)
    return () => clearTimeout(timer)
  }, [fetchStudents])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold">Students</h1>
        <div className="flex gap-2">
          {ctx.canEditRoster && (
            <>
              <Link
                href={`${basePath}/students/import`}
                className="flex items-center gap-1.5 px-3 py-2 border rounded-lg text-sm hover:bg-accent/50 transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Import CSV</span>
              </Link>
              <Link
                href={`${basePath}/students/new`}
                className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Plus className="h-4 w-4" />
                <span>Add Student</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-10 pr-3 py-2 bg-card border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Search students"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className="px-3 py-2 bg-card border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Filter by status"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="all">All</option>
        </select>
        <select
          value={classroomFilter}
          onChange={(e) => { setClassroomFilter(e.target.value); setPage(1) }}
          className="px-3 py-2 bg-card border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Filter by classroom"
        >
          <option value="">All Classrooms</option>
          {classrooms.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {loading ? 'Loading...' : `${total} student${total !== 1 ? 's' : ''}`}
      </p>

      {/* Error state */}
      {error && (
        <div className="border border-destructive/50 rounded-lg p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && students.length === 0 && (
        <div className="border rounded-lg p-8 text-center space-y-4">
          <Users className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h2 className="font-semibold">No students yet</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {search || classroomFilter || statusFilter !== 'active'
                ? 'No students match your filters.'
                : 'Add your first student or import a CSV roster.'}
            </p>
          </div>
          {ctx.canEditRoster && !search && !classroomFilter && statusFilter === 'active' && (
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link
                href={`${basePath}/students/new`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90"
              >
                <Plus className="h-4 w-4" /> Add Student
              </Link>
              <Link
                href={`${basePath}/students/import`}
                className="inline-flex items-center gap-1.5 px-4 py-2 border rounded-lg text-sm hover:bg-accent/50"
              >
                <Upload className="h-4 w-4" /> Import CSV
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Student list - mobile cards / desktop table */}
      {!loading && !error && students.length > 0 && (
        <>
          {/* Mobile cards */}
          <div className="grid gap-2 sm:hidden">
            {students.map(s => {
              const classroom = s.school_classrooms?.[0]
              return (
                <Link
                  key={s.id}
                  href={`${basePath}/students/${s.id}`}
                  className="border rounded-lg p-3 hover:bg-accent/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{s.last_name}, {s.first_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.external_student_id && <span>{s.external_student_id} · </span>}
                        {classroom?.name || 'No classroom'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {s.status !== 'active' && (
                        <span className="text-xs bg-yellow-500/10 text-yellow-700 px-2 py-0.5 rounded">
                          {s.status}
                        </span>
                      )}
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-accent/30">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">Name</th>
                  <th className="text-left px-4 py-2 font-medium">External ID</th>
                  <th className="text-left px-4 py-2 font-medium">Classroom</th>
                  <th className="text-left px-4 py-2 font-medium">Status</th>
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => {
                  const classroom = s.school_classrooms?.[0]
                  return (
                    <tr key={s.id} className="border-t hover:bg-accent/20">
                      <td className="px-4 py-2.5">
                        <Link href={`${basePath}/students/${s.id}`} className="hover:underline font-medium">
                          {s.last_name}, {s.first_name}
                        </Link>
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {s.external_student_id || '-'}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {classroom?.name || '-'}
                      </td>
                      <td className="px-4 py-2.5">
                        {s.status === 'active' ? (
                          <span className="text-accent">Active</span>
                        ) : (
                          <span className="text-xs bg-yellow-500/10 text-yellow-700 px-2 py-0.5 rounded">
                            {s.status}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        <Link href={`${basePath}/students/${s.id}`}>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50 hover:bg-accent/50"
              >
                Previous
              </button>
              <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50 hover:bg-accent/50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
