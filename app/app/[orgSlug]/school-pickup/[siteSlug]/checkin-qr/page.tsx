import { getAuthenticatedUser } from '@/lib/auth/organization-resolver'
import { resolveSchoolContext, getUserSchoolSites, SchoolAuthError } from '@/lib/auth/school-resolver'
import { SchoolPickupLayout } from '@/components/app/SchoolPickupLayout'
import { CheckInQRClient } from '@/components/app/school-pickup/CheckInQRClient'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function CheckInQRPage({
  params,
}: {
  params: Promise<{ orgSlug: string; siteSlug: string }>
}) {
  const { orgSlug, siteSlug } = await params
  const user = await getAuthenticatedUser()
  if (!user) redirect(`/login?next=/app/${orgSlug}/school-pickup/${siteSlug}/checkin-qr`)

  let ctx
  try {
    ctx = await resolveSchoolContext(user, orgSlug, siteSlug)
  } catch (err) {
    if (err instanceof SchoolAuthError) redirect('/app')
    throw err
  }

  const sites = await getUserSchoolSites(user, ctx.organization.organization.id)

  return (
    <SchoolPickupLayout user={user} ctx={ctx} sites={sites}>
      <CheckInQRClient
        orgSlug={orgSlug}
        siteSlug={siteSlug}
        siteName={ctx.site.name}
      />
    </SchoolPickupLayout>
  )
}
