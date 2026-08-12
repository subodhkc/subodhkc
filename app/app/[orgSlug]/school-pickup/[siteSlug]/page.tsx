import { redirect } from 'next/navigation'
import {
  getAuthenticatedUser,
  AuthError,
} from '@/lib/auth/organization-resolver'
import {
  resolveSchoolContext,
  getUserSchoolSites,
  getSiteSetupState,
  SchoolAuthError,
} from '@/lib/auth/school-resolver'
import { SchoolPickupLayout } from '@/components/app/SchoolPickupLayout'
import { SiteDashboardClient } from '@/components/app/school-pickup/SiteDashboardClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function SiteDashboardPage({
  params,
}: {
  params: Promise<{ orgSlug: string; siteSlug: string }>
}) {
  const { orgSlug, siteSlug } = await params
  const user = await getAuthenticatedUser()
  if (!user) redirect(`/login?next=/app/${orgSlug}/school-pickup/${siteSlug}`)

  let ctx
  try {
    ctx = await resolveSchoolContext(user, orgSlug, siteSlug)
  } catch (err) {
    if (err instanceof SchoolAuthError || err instanceof AuthError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center space-y-2 max-w-sm">
            <h1 className="text-xl font-bold">Access Denied</h1>
            <p className="text-sm text-muted-foreground">{err.message}</p>
            <a href={`/app/${orgSlug}/school-pickup`} className="text-sm text-primary hover:underline block">
              Back to School Pickup
            </a>
          </div>
        </div>
      )
    }
    throw err
  }

  const sites = await getUserSchoolSites(user, ctx.organization.organization.id)
  const setupState = await getSiteSetupState(ctx.organization.organization.id, ctx.site.id)

  return (
    <SchoolPickupLayout user={user} ctx={ctx} sites={sites}>
      <SiteDashboardClient ctx={ctx} setupState={setupState} />
    </SchoolPickupLayout>
  )
}
