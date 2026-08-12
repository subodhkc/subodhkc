import { redirect } from 'next/navigation'
import {
  getAuthenticatedUser,
  resolveOrganizationContext,
  AuthError,
  type OrganizationContext,
  type AuthenticatedUser,
} from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'
import { MembersClient } from '@/components/app/MembersClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function MembersPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const user = await getAuthenticatedUser()
  if (!user) redirect(`/login?next=/app/${orgSlug}/members`)

  let ctx: OrganizationContext
  try {
    ctx = await resolveOrganizationContext(user, orgSlug)
  } catch (err) {
    if (err instanceof AuthError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center space-y-2">
            <h1 className="text-xl font-bold">Access Denied</h1>
            <p className="text-sm text-muted-foreground">{err.message}</p>
            <a href="/app" className="text-sm text-primary hover:underline">Back to organizations</a>
          </div>
        </div>
      )
    }
    throw err
  }

  const isAdmin = ctx.organizationRole === 'owner' || ctx.organizationRole === 'admin' || ctx.isPlatformAdmin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-bold">Admin Access Required</h1>
          <p className="text-sm text-muted-foreground">You need owner or admin role to manage members.</p>
          <a href={`/app/${orgSlug}`} className="text-sm text-primary hover:underline">Back to organization</a>
        </div>
      </div>
    )
  }

  // Fetch members and invitations
  const serviceClient = createServiceClient()
  if (!serviceClient) redirect('/login?error=config')

  const { data: members } = await serviceClient
    .from('organization_memberships')
    .select(`
      id,
      user_id,
      role,
      status,
      joined_at,
      profiles!inner(email, display_name)
    `)
    .eq('organization_id', ctx.organization.id)
    .order('joined_at')

  const { data: invitations } = await serviceClient
    .from('organization_invitations')
    .select('id, email, role, expires_at, accepted_at, revoked_at, created_at')
    .eq('organization_id', ctx.organization.id)
    .order('created_at', { ascending: false })

  // Fetch access requests
  const { data: accessRequests } = await serviceClient
    .from('join_requests')
    .select(`
      id, status, requested_role, created_at, reviewed_at, reviewer_notes,
      user_id, profiles!inner(email, display_name, avatar_url)
    `)
    .eq('organization_id', ctx.organization.id)
    .order('created_at', { ascending: false })

  return (
    <MembersClient
      user={user}
      ctx={ctx}
      members={(members || []).map((m: any) => ({
        id: m.id,
        user_id: m.user_id,
        email: m.profiles?.email || '',
        display_name: m.profiles?.display_name || '',
        role: m.role,
        status: m.status,
        joined_at: m.joined_at,
      }))}
      invitations={(invitations || []).map((i: any) => ({
        id: i.id,
        email: i.email,
        role: i.role,
        expires_at: i.expires_at,
        accepted_at: i.accepted_at,
        revoked_at: i.revoked_at,
        created_at: i.created_at,
      }))}
      accessRequests={(accessRequests || []).map((r: any) => ({
        id: r.id,
        status: r.status,
        requested_role: r.requested_role,
        created_at: r.created_at,
        reviewed_at: r.reviewed_at,
        reviewer_notes: r.reviewer_notes,
        user_id: r.user_id,
        profiles: {
          email: r.profiles?.email || '',
          display_name: r.profiles?.display_name || null,
          avatar_url: r.profiles?.avatar_url || null,
        },
      }))}
    />
  )
}
