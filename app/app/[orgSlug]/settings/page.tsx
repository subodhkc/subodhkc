import { redirect } from 'next/navigation'
import {
  getAuthenticatedUser,
  resolveOrganizationContext,
  AuthError,
  type OrganizationContext,
  type AuthenticatedUser,
} from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'
import { OrgSettingsClient } from '@/components/app/OrgSettingsClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function OrgSettingsPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const user = await getAuthenticatedUser()
  if (!user) redirect(`/login?next=/app/${orgSlug}/settings`)

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
          <a href={`/app/${orgSlug}`} className="text-sm text-primary hover:underline">Back to organization</a>
        </div>
      </div>
    )
  }

  const serviceClient = createServiceClient()
  if (!serviceClient) redirect('/login?error=config')

  // Get all offerings for entitlement management
  const { data: offerings } = await serviceClient
    .from('offerings')
    .select('id, offering_key, name, offering_kind, status')
    .eq('status', 'active')
    .order('name')

  // Get current entitlements with offering details
  const { data: entitlements } = await serviceClient
    .from('organization_entitlements')
    .select(`
      id,
      offering_id,
      status,
      source_type,
      valid_from,
      valid_until,
      offerings!inner(offering_key, name)
    `)
    .eq('organization_id', ctx.organization.id)

  // Get all members for role management
  const { data: members } = await serviceClient
    .from('organization_memberships')
    .select(`
      id,
      user_id,
      role,
      status,
      profiles!inner(email, display_name)
    `)
    .eq('organization_id', ctx.organization.id)
    .eq('status', 'active')

  return (
    <OrgSettingsClient
      user={user}
      ctx={ctx}
      offerings={offerings || []}
      entitlements={(entitlements || []).map((e: any) => ({
        id: e.id,
        offering_id: e.offering_id,
        offering_key: e.offerings.offering_key,
        offering_name: e.offerings.name,
        status: e.status,
        source_type: e.source_type,
        valid_from: e.valid_from,
        valid_until: e.valid_until,
      }))}
      members={(members || []).map((m: any) => ({
        id: m.id,
        user_id: m.user_id,
        email: m.profiles?.email || '',
        display_name: m.profiles?.display_name || '',
        role: m.role,
      }))}
    />
  )
}
