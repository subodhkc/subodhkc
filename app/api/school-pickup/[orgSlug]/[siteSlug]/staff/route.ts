import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/organization-resolver'
import { resolveSchoolContext, SchoolAuthError } from '@/lib/auth/school-resolver'
import { createServiceClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orgSlug: string; siteSlug: string }> }
) {
  const { orgSlug, siteSlug } = await params
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  let ctx
  try {
    ctx = await resolveSchoolContext(user, orgSlug, siteSlug)
  } catch (err) {
    if (err instanceof SchoolAuthError) {
      return NextResponse.json({ error: err.code }, { status: 403 })
    }
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  if (!ctx.canManageStaff) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
  }

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  const { data, error } = await serviceClient
    .from('school_staff_assignments')
    .select(`
      id, role, status, created_at, updated_at,
      user_id,
      profiles!inner(email, display_name, avatar_url)
    `)
    .eq('organization_id', ctx.organization.organization.id)
    .eq('school_site_id', ctx.site.id)
    .order('created_at')

  if (error) {
    return NextResponse.json({ error: 'query_failed' }, { status: 500 })
  }

  return NextResponse.json({ staff: data || [] })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orgSlug: string; siteSlug: string }> }
) {
  const { orgSlug, siteSlug } = await params
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  let ctx
  try {
    ctx = await resolveSchoolContext(user, orgSlug, siteSlug)
  } catch (err) {
    if (err instanceof SchoolAuthError) {
      return NextResponse.json({ error: err.code }, { status: 403 })
    }
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  if (!ctx.canManageStaff) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
  }

  const body = await request.json()
  const { user_id, role } = body

  if (!user_id) {
    return NextResponse.json({ error: 'missing_user_id' }, { status: 400 })
  }

  const validRoles = ['school_admin', 'dismissal_manager', 'scanner', 'teacher']
  if (!validRoles.includes(role)) {
    return NextResponse.json({ error: 'invalid_role' }, { status: 400 })
  }

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  // Verify user is org member
  const { data: membership } = await serviceClient
    .from('organization_memberships')
    .select('id')
    .eq('organization_id', ctx.organization.organization.id)
    .eq('user_id', user_id)
    .eq('status', 'active')
    .single()

  if (!membership) {
    return NextResponse.json({ error: 'user_not_org_member' }, { status: 400 })
  }

  // Check for existing assignment (same site + user + role)
  const { data: existing } = await serviceClient
    .from('school_staff_assignments')
    .select('id, status')
    .eq('school_site_id', ctx.site.id)
    .eq('user_id', user_id)
    .eq('role', role)
    .single()

  if (existing) {
    if (existing.status === 'active') {
      return NextResponse.json({ error: 'already_assigned' }, { status: 409 })
    }
    // Reactivate
    const { error: updateError } = await serviceClient
      .from('school_staff_assignments')
      .update({ status: 'active' })
      .eq('id', existing.id)

    if (updateError) {
      return NextResponse.json({ error: 'assign_failed' }, { status: 500 })
    }

    await serviceClient.from('audit_events').insert({
      organization_id: ctx.organization.organization.id,
      actor_user_id: user.id,
      action: 'staff.assigned',
      entity_type: 'staff_assignment',
      entity_id: existing.id,
      metadata: { user_id, role, site_id: ctx.site.id },
    })

    return NextResponse.json({ success: true, assignment_id: existing.id })
  }

  // Create new assignment
  const { data: assignment, error } = await serviceClient
    .from('school_staff_assignments')
    .insert({
      organization_id: ctx.organization.organization.id,
      school_site_id: ctx.site.id,
      user_id,
      role,
      status: 'active',
    })
    .select('id')
    .single()

  if (error) {
    return NextResponse.json({ error: 'assign_failed' }, { status: 500 })
  }

  await serviceClient.from('audit_events').insert({
    organization_id: ctx.organization.organization.id,
    actor_user_id: user.id,
    action: 'staff.assigned',
    entity_type: 'staff_assignment',
    entity_id: assignment.id,
    metadata: { user_id, role, site_id: ctx.site.id },
  })

  return NextResponse.json({ success: true, assignment_id: assignment.id })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orgSlug: string; siteSlug: string }> }
) {
  const { orgSlug, siteSlug } = await params
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  let ctx
  try {
    ctx = await resolveSchoolContext(user, orgSlug, siteSlug)
  } catch (err) {
    if (err instanceof SchoolAuthError) {
      return NextResponse.json({ error: err.code }, { status: 403 })
    }
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  if (!ctx.canManageStaff) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
  }

  const body = await request.json()
  const { assignment_id, role, status } = body

  if (!assignment_id) {
    return NextResponse.json({ error: 'missing_assignment_id' }, { status: 400 })
  }

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  // Prevent self-escalation: user can't change their own role
  if (assignment_id) {
    const { data: assignment } = await serviceClient
      .from('school_staff_assignments')
      .select('user_id, role, status')
      .eq('id', assignment_id)
      .eq('school_site_id', ctx.site.id)
      .eq('organization_id', ctx.organization.organization.id)
      .single()

    if (!assignment) {
      return NextResponse.json({ error: 'assignment_not_found' }, { status: 404 })
    }

    if (assignment.user_id === user.id && role && role !== assignment.role) {
      return NextResponse.json({ error: 'cannot_change_own_role' }, { status: 403 })
    }

    // Check last school_admin protection
    if (assignment.role === 'school_admin' && status === 'inactive') {
      const { count } = await serviceClient
        .from('school_staff_assignments')
        .select('id', { count: 'exact', head: true })
        .eq('school_site_id', ctx.site.id)
        .eq('role', 'school_admin')
        .eq('status', 'active')

      if ((count ?? 0) <= 1) {
        return NextResponse.json({ error: 'cannot_remove_last_admin' }, { status: 400 })
      }
    }
  }

  const updates: Record<string, any> = {}
  if (role) updates.role = role
  if (status) updates.status = status

  const { error } = await serviceClient
    .from('school_staff_assignments')
    .update(updates)
    .eq('id', assignment_id)
    .eq('school_site_id', ctx.site.id)
    .eq('organization_id', ctx.organization.organization.id)

  if (error) {
    return NextResponse.json({ error: 'update_failed' }, { status: 500 })
  }

  await serviceClient.from('audit_events').insert({
    organization_id: ctx.organization.organization.id,
    actor_user_id: user.id,
    action: 'staff.role_changed',
    entity_type: 'staff_assignment',
    entity_id: assignment_id,
    metadata: { role, status },
  })

  return NextResponse.json({ success: true })
}
