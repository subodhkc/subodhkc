import { redirect } from 'next/navigation'
import {
  getAuthenticatedUser,
  resolveOrganizationContext,
  AuthError,
  type OrganizationContext,
  type AuthenticatedUser,
} from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'
import { ClientWorkspaceClient } from '@/components/app/ClientWorkspaceClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export interface OrgEngagement {
  id: string
  engagement_type: string
  status: string
  starts_at: string | null
  ends_at: string | null
}

export interface OrgMember {
  id: string
  user_id: string
  email: string
  display_name: string | null
  avatar_url: string | null
  role: string
  status: string
}

export default async function OrgPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const user = await getAuthenticatedUser()
  if (!user) redirect(`/login?next=/app/${orgSlug}`)

  let ctx: OrganizationContext
  try {
    ctx = await resolveOrganizationContext(user, orgSlug)
  } catch (err) {
    if (err instanceof AuthError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center space-y-2 max-w-sm">
            <h1 className="text-xl font-bold">Access Denied</h1>
            <p className="text-sm text-muted-foreground">{err.message}</p>
            <a href="/app" className="text-sm text-primary hover:underline block">
              Back to My SubodhKC
            </a>
          </div>
        </div>
      )
    }
    throw err
  }

  // Fetch engagement and member data for this org
  const serviceClient = createServiceClient()

  let engagements: OrgEngagement[] = []
  let members: OrgMember[] = []

  if (serviceClient) {
    const { data: engData } = await serviceClient
      .from('engagements')
      .select('id, engagement_type, status, starts_at, ends_at')
      .eq('organization_id', ctx.organization.id)
      .order('created_at', { ascending: false })

    engagements = (engData || []) as OrgEngagement[]

    const { data: memberData } = await serviceClient
      .from('organization_memberships')
      .select(`
        id,
        user_id,
        role,
        status,
        profiles!inner(email, display_name, avatar_url)
      `)
      .eq('organization_id', ctx.organization.id)
      .eq('status', 'active')
      .order('role', { ascending: false })

    members = (memberData || []).map((m: any) => ({
      id: m.id,
      user_id: m.user_id,
      email: m.profiles.email,
      display_name: m.profiles.display_name,
      avatar_url: m.profiles.avatar_url,
      role: m.role,
      status: m.status,
    }))
  }

  return (
    <ClientWorkspaceClient
      user={user}
      ctx={ctx}
      engagements={engagements}
      members={members}
    />
  )
}
