import { redirect } from 'next/navigation'
import { getAuthenticatedUser, AuthError } from '@/lib/auth/organization-resolver'
import { resolveSchoolContext, getUserSchoolSites, SchoolAuthError } from '@/lib/auth/school-resolver'
import { SchoolPickupLayout } from '@/components/app/SchoolPickupLayout'
import { SettingsClient } from '@/components/app/school-pickup/SettingsClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ orgSlug: string; siteSlug: string }>
}) {
  const { orgSlug, siteSlug } = await params
  const user = await getAuthenticatedUser()
  if (!user) redirect(`/login?next=/app/${orgSlug}/school-pickup/${siteSlug}/settings`)

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
          </div>
        </div>
      )
    }
    throw err
  }

  if (!ctx.canManageSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-bold">Access Denied</h1>
          <p className="text-sm text-muted-foreground">You do not have permission to manage settings.</p>
        </div>
      </div>
    )
  }

  const sites = await getUserSchoolSites(user, ctx.organization.organization.id)

  return (
    <SchoolPickupLayout user={user} ctx={ctx} sites={sites}>
      <SettingsClient ctx={ctx} />
    </SchoolPickupLayout>
  )
}
