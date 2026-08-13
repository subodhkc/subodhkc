import { redirect } from 'next/navigation'
import { getAuthenticatedUser, getUserOrganizations } from '@/lib/auth/organization-resolver'
import { NewEngagementWizardClient } from '@/components/app/advisor/NewEngagementWizardClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function NewEngagementPage() {
  const user = await getAuthenticatedUser()
  if (!user) redirect('/login?next=/app/advisor/new-engagement')

  const orgs = await getUserOrganizations(user)
  const advisorOrgs = orgs.filter(o => o.role === 'admin' || o.role === 'owner')

  if (advisorOrgs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-sm">
          <h1 className="text-xl font-bold">Advisor Access Required</h1>
          <p className="text-sm text-[#888] mt-2">You need to be an admin or owner of an organization to create engagements.</p>
          <a href="/app/advisor" className="text-sm text-[#d4a017] hover:underline mt-4 inline-block">Back to Advisor Console</a>
        </div>
      </div>
    )
  }

  return <NewEngagementWizardClient user={user} organizations={advisorOrgs} />
}
