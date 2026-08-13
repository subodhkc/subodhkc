import { redirect } from 'next/navigation'
import { getAuthenticatedUser, resolveOrganizationContext } from '@/lib/auth/organization-resolver'
import { getEngagementFullData } from '@/lib/engagement/queries'
import { EngagementWorkspaceClient } from '@/components/app/advisor/EngagementWorkspaceClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function EngagementDetailPage({
  params,
}: {
  params: Promise<{ engagementId: string }>
}) {
  const { engagementId } = await params
  const user = await getAuthenticatedUser()
  if (!user) redirect(`/login?next=/app/advisor/engagements/${engagementId}`)

  const data = await getEngagementFullData(engagementId)
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold">Engagement Not Found</h1>
          <a href="/app/advisor" className="text-sm text-[#d4a017] hover:underline mt-2 inline-block">
            Back to Advisor Console
          </a>
        </div>
      </div>
    )
  }

  // Verify user has access to the engagement's organization
  let isAdvisor = false
  try {
    const ctx = await resolveOrganizationContext(user, data.charter.organization_id)
    isAdvisor = ctx.organizationRole === 'admin' || ctx.organizationRole === 'owner' || ctx.isPlatformAdmin
  } catch {
    // User might not have org membership but could be platform admin
    isAdvisor = user.isPlatformAdmin
  }

  if (!isAdvisor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold">Access Denied</h1>
          <p className="text-sm text-[#888] mt-2">You need advisor access to view this engagement.</p>
          <a href="/app/advisor" className="text-sm text-[#d4a017] hover:underline mt-2 inline-block">
            Back to Advisor Console
          </a>
        </div>
      </div>
    )
  }

  return <EngagementWorkspaceClient user={user} data={data} isAdvisor={isAdvisor} />
}
