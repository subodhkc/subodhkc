import { redirect } from 'next/navigation'
import { getAuthenticatedUser, resolveOrganizationContext, AuthError } from '@/lib/auth/organization-resolver'
import { getClientVisibleEngagementData } from '@/lib/engagement/queries'
import { ClientEngagementViewClient } from '@/components/app/client/ClientEngagementViewClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function ClientEngagementPage({
  params,
}: {
  params: Promise<{ orgSlug: string; engagementId: string }>
}) {
  const { orgSlug, engagementId } = await params
  const user = await getAuthenticatedUser()
  if (!user) redirect(`/login?next=/app/${orgSlug}/engagements/${engagementId}`)

  let ctx
  try {
    ctx = await resolveOrganizationContext(user, orgSlug)
  } catch (err) {
    if (err instanceof AuthError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center space-y-2 max-w-sm">
            <h1 className="text-xl font-bold">Access Denied</h1>
            <p className="text-sm text-muted-foreground">{err.message}</p>
            <a href="/app" className="text-sm text-primary hover:underline block">Back to Dashboard</a>
          </div>
        </div>
      )
    }
    throw err
  }

  const data = await getClientVisibleEngagementData(engagementId)
  if (!data || data.charter.organization_id !== ctx.organization.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold">Engagement Not Found</h1>
          <a href={`/app/${orgSlug}`} className="text-sm text-[#d4a017] hover:underline mt-2 inline-block">
            Back to Workspace
          </a>
        </div>
      </div>
    )
  }

  return <ClientEngagementViewClient user={user} orgSlug={orgSlug} data={data} />
}
