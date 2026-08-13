import { redirect } from 'next/navigation'
import {
  getAuthenticatedUser,
  resolveOrganizationContext,
  requireOfferingAccess,
  AuthError,
  type OrganizationContext,
} from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'
import { FractionalAIWorkspaceClient } from '@/components/app/FractionalAIWorkspaceClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function FractionalAIPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const user = await getAuthenticatedUser()
  if (!user) redirect(`/login?next=/app/${orgSlug}/fractional-ai`)

  let ctx: OrganizationContext | undefined
  try {
    ctx = await resolveOrganizationContext(user, orgSlug)
    requireOfferingAccess(ctx, 'fractional_ai')
  } catch (err) {
    if (err instanceof AuthError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center space-y-2 max-w-sm">
            <h1 className="text-xl font-bold">Access Denied</h1>
            <p className="text-sm text-muted-foreground">{err.message}</p>
            <a href={`/app/${orgSlug}`} className="text-sm text-primary hover:underline block">
              Back to {ctx?.organization.name || orgSlug}
            </a>
          </div>
        </div>
      )
    }
    throw err
  }

  // Fetch engagements for this org
  const serviceClient = createServiceClient()
  let engagements: Array<{
    id: string
    engagement_type: string
    status: string
    starts_at: string | null
    ends_at: string | null
  }> = []

  if (serviceClient) {
    const { data: engData } = await serviceClient
      .from('engagements')
      .select('id, engagement_type, status, starts_at, ends_at')
      .eq('organization_id', ctx.organization.id)
      .order('created_at', { ascending: false })

    engagements = (engData || []).map((e: any) => ({
      id: e.id,
      engagement_type: e.engagement_type,
      status: e.status,
      starts_at: e.starts_at,
      ends_at: e.ends_at,
    }))
  }

  return <FractionalAIWorkspaceClient user={user} ctx={ctx} engagements={engagements} />
}
