'use client'

import { useState, useEffect } from 'react'
import { UserCog, Plus, AlertCircle } from 'lucide-react'
import type { SchoolContext } from '@/lib/auth/school-resolver'

interface StaffManagementClientProps {
  ctx: SchoolContext
}

interface StaffMember {
  id: string
  role: string
  status: string
  user_id: string
  profiles: { email: string; display_name: string | null; avatar_url: string | null }
}

interface OrgMember {
  user_id: string
  role: string
  profiles: { email: string; display_name: string | null }
}

const ROLES = [
  { value: 'school_admin', label: 'School Admin' },
  { value: 'dismissal_manager', label: 'Dismissal Manager' },
  { value: 'scanner', label: 'Scanner' },
  { value: 'teacher', label: 'Teacher' },
]

export function StaffManagementClient({ ctx }: StaffManagementClientProps) {
  const apiBase = `/api/school-pickup/${ctx.organization.organization.slug}/${ctx.site.slug}`

  const [staff, setStaff] = useState<StaffMember[]>([])
  const [members, setMembers] = useState<OrgMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [selectedUser, setSelectedUser] = useState('')
  const [selectedRole, setSelectedRole] = useState('dismissal_manager')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch(`${apiBase}/staff`).then(r => r.json()),
      fetch(`${apiBase}/staff/members`).then(r => r.json()),
    ]).then(([staffData, memberData]) => {
      setStaff(staffData.staff || [])
      setMembers(memberData.members || [])
    }).catch(() => {
      setError('Failed to load staff data')
    }).finally(() => setLoading(false))
  }, [apiBase])

  async function handleAdd() {
    if (!selectedUser) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`${apiBase}/staff`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: selectedUser, role: selectedRole }),
      })
      if (!res.ok) {
        const data = await res.json()
        if (data.error === 'already_assigned') {
          setError('This person is already assigned to this role.')
        } else if (data.error === 'user_not_org_member') {
          setError('This person is not a member of your organization.')
        } else {
          setError('Failed to assign staff member.')
        }
        return
      }
      setShowAdd(false)
      setSelectedUser('')
      // Refresh
      const res2 = await fetch(`${apiBase}/staff`)
      const data2 = await res2.json()
      setStaff(data2.staff || [])
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  async function handleRoleChange(assignmentId: string, newRole: string) {
    setError(null)
    try {
      const res = await fetch(`${apiBase}/staff`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignment_id: assignmentId, role: newRole }),
      })
      if (!res.ok) {
        const data = await res.json()
        if (data.error === 'cannot_change_own_role') {
          setError('You cannot change your own role.')
        } else if (data.error === 'cannot_remove_last_admin') {
          setError('Cannot deactivate the last school admin.')
        } else {
          setError('Failed to update role.')
        }
        return
      }
      // Refresh
      const res2 = await fetch(`${apiBase}/staff`)
      const data2 = await res2.json()
      setStaff(data2.staff || [])
    } catch {
      setError('Network error')
    }
  }

  async function handleStatusToggle(assignmentId: string, currentStatus: string) {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    setError(null)
    try {
      const res = await fetch(`${apiBase}/staff`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignment_id: assignmentId, status: newStatus }),
      })
      if (!res.ok) {
        const data = await res.json()
        if (data.error === 'cannot_remove_last_admin') {
          setError('Cannot deactivate the last school admin.')
        } else {
          setError('Failed to update status.')
        }
        return
      }
      const res2 = await fetch(`${apiBase}/staff`)
      const data2 = await res2.json()
      setStaff(data2.staff || [])
    } catch {
      setError('Network error')
    }
  }

  const assignedUserIds = new Set(staff.filter(s => s.status === 'active').map(s => s.user_id))
  const availableMembers = members.filter(m => !assignedUserIds.has(m.user_id))

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold">Staff</h1>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add Staff
        </button>
      </div>

      {error && (
        <div className="border border-destructive/50 rounded-lg p-3 text-sm text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Add staff form */}
      {showAdd && (
        <div className="border rounded-lg p-4 space-y-3">
          <h2 className="font-semibold text-sm">Assign Staff Member</h2>
          {availableMembers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              All organization members are already assigned. Invite new members from the
              organization page first.
            </p>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 gap-3">
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="px-3 py-2 bg-card border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select person...</option>
                  {availableMembers.map(m => (
                    <option key={m.user_id} value={m.user_id}>
                      {m.profiles.display_name || m.profiles.email}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-3 py-2 bg-card border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {ROLES.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  disabled={!selectedUser || saving}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? 'Assigning...' : 'Assign'}
                </button>
                <button
                  onClick={() => setShowAdd(false)}
                  className="px-4 py-2 border rounded-lg text-sm hover:bg-accent/50"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Staff list */}
      {staff.length === 0 ? (
        <div className="border rounded-lg p-8 text-center space-y-3">
          <UserCog className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h2 className="font-semibold">No staff assigned</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Add staff members to manage this school site.
            </p>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-accent/30">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Name</th>
                <th className="text-left px-4 py-2 font-medium">Email</th>
                <th className="text-left px-4 py-2 font-medium">Role</th>
                <th className="text-left px-4 py-2 font-medium">Status</th>
                <th className="text-left px-4 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map(s => (
                <tr key={s.id} className="border-t">
                  <td className="px-4 py-2.5 font-medium">
                    {s.profiles.display_name || s.profiles.email.split('@')[0]}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{s.profiles.email}</td>
                  <td className="px-4 py-2.5">
                    <select
                      value={s.role}
                      onChange={(e) => handleRoleChange(s.id, e.target.value)}
                      className="px-2 py-1 bg-card border rounded text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      {ROLES.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      s.status === 'active'
                        ? 'bg-accent/20 text-accent'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <button
                      onClick={() => handleStatusToggle(s.id, s.status)}
                      className="text-xs text-primary hover:underline"
                    >
                      {s.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Role descriptions */}
      <div className="border rounded-lg p-4 space-y-2 text-sm">
        <h2 className="font-semibold">Role Permissions</h2>
        <ul className="space-y-1 text-muted-foreground">
          <li><strong className="text-foreground">School Admin</strong>: Full access to roster, staff, credentials, and settings.</li>
          <li><strong className="text-foreground">Dismissal Manager</strong>: Manage students, classrooms, and credentials. No staff management.</li>
          <li><strong className="text-foreground">Scanner</strong>: Scan QR codes and manage pickup queue only.</li>
          <li><strong className="text-foreground">Teacher</strong>: View pickup queue for their classroom.</li>
        </ul>
      </div>
    </div>
  )
}
