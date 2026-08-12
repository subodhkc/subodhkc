import { redirect } from 'next/navigation'
import { getAuthenticatedUser, AuthError } from '@/lib/auth/organization-resolver'
import { resolveSchoolContext, getUserSchoolSites, SchoolAuthError } from '@/lib/auth/school-resolver'
import { createServiceClient } from '@/lib/supabase'
import { SchoolPickupLayout } from '@/components/app/SchoolPickupLayout'
import { AddStudentClient } from '@/components/app/school-pickup/AddStudentClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function AddStudentPage({
  params,
}: {
  params: Promise<{ orgSlug: string; siteSlug: string }>
}) {
  const { orgSlug, siteSlug } = await params
  const user = await getAuthenticatedUser()
  if (!user) redirect(`/login?next=/app/${orgSlug}/school-pickup/${siteSlug}/students/new`)

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

  let classrooms: Array<{ id: string; name: string; grade_label: string | null }> = []
  const serviceClient = createServiceClient()
  if (serviceClient) {
    const { data } = await serviceClient
      .from('school_classrooms')
      .select('id, name, grade_label')
      .eq('organization_id', ctx.organization.organization.id)
      .eq('school_site_id', ctx.site.id)
      .order('name')
    classrooms = data || []
  }

  return (
    <SchoolPickupLayout user={user} ctx={ctx} sites={sites}>
      <AddStudentClient ctx={ctx} classrooms={classrooms} />
    </SchoolPickupLayout>
  )
}
