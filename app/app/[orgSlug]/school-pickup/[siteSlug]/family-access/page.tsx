import { redirect } from 'next/navigation'
import { getAuthenticatedUser, AuthError } from '@/lib/auth/organization-resolver'
import { resolveSchoolContext, getUserSchoolSites, SchoolAuthError } from '@/lib/auth/school-resolver'
import { createServiceClient } from '@/lib/supabase'
import { SchoolPickupLayout } from '@/components/app/SchoolPickupLayout'
import { GuardianManagementClient } from '@/components/app/school-pickup/GuardianManagementClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function FamilyAccessPage({
  params,
}: {
  params: Promise<{ orgSlug: string; siteSlug: string }>
}) {
  const { orgSlug, siteSlug } = await params
  const user = await getAuthenticatedUser()
  if (!user) redirect(`/login?next=/app/${orgSlug}/school-pickup/${siteSlug}/family-access`)

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

  const sites = await getUserSchoolSites(user, ctx.organization.organization.id)

  // Fetch students for linking
  const serviceClient = createServiceClient()
  let students: Array<{ id: string; first_name: string; last_name: string; external_student_id: string | null; status: string }> = []
  if (serviceClient) {
    const { data } = await serviceClient
      .from('school_students')
      .select('id, first_name, last_name, external_student_id, status')
      .eq('organization_id', ctx.organization.organization.id)
      .eq('school_site_id', ctx.site.id)
      .order('last_name')
    students = data || []
  }

  return (
    <SchoolPickupLayout user={user} ctx={ctx} sites={sites}>
      <GuardianManagementClient
        ctx={ctx}
        students={students}
      />
    </SchoolPickupLayout>
  )
}
