import { redirect } from 'next/navigation'
import {
  getAuthenticatedUser,
  AuthError,
} from '@/lib/auth/organization-resolver'
import {
  resolveSchoolContext,
  getUserSchoolSites,
  SchoolAuthError,
} from '@/lib/auth/school-resolver'
import { SchoolPickupLayout } from '@/components/app/SchoolPickupLayout'
import { DismissalGroupsClient } from '@/components/app/school-pickup/DismissalGroupsClient'
import { DismissalSchedulesClient } from '@/components/app/school-pickup/DismissalSchedulesClient'
import { createServiceClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function DismissalGroupsPage({
  params,
}: {
  params: Promise<{ orgSlug: string; siteSlug: string }>
}) {
  const { orgSlug, siteSlug } = await params
  const user = await getAuthenticatedUser()
  if (!user) redirect(`/login?next=/app/${orgSlug}/school-pickup/${siteSlug}/groups`)

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
            <a href={`/app/${orgSlug}/school-pickup/${siteSlug}`} className="text-sm text-primary hover:underline block">
              Back to site
            </a>
          </div>
        </div>
      )
    }
    throw err
  }

  const sites = await getUserSchoolSites(user, ctx.organization.organization.id)

  // Load groups for the schedules component
  const serviceClient = createServiceClient()
  let groups: { id: string; name: string }[] = []
  if (serviceClient) {
    const { data } = await serviceClient
      .from('pickup_groups')
      .select('id, name')
      .eq('organization_id', ctx.organization.organization.id)
      .eq('school_site_id', ctx.site.id)
      .is('archived_at', null)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })
    groups = data || []
  }

  return (
    <SchoolPickupLayout user={user} ctx={ctx} sites={sites}>
      <div className="space-y-8">
        <DismissalGroupsClient
          orgSlug={orgSlug}
          siteSlug={siteSlug}
          canEdit={ctx.canEditRoster}
        />
        <DismissalSchedulesClient
          orgSlug={orgSlug}
          siteSlug={siteSlug}
          canManage={ctx.canManageSettings}
          groups={groups}
        />
      </div>
    </SchoolPickupLayout>
  )
}
