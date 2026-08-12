import { redirect } from 'next/navigation'
import { getAuthenticatedUser, getUserOrganizations, type OrganizationRole } from '@/lib/auth/organization-resolver'
import { AppShellClient } from '@/components/app/AppShellClient'
import { createServiceClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function AppShellPage() {
  const user = await getAuthenticatedUser()
  if (!user) redirect('/login?next=/app')

  const organizations = await getUserOrganizations(user)

  // Get platform admin organizations view (all orgs if platform admin)
  let allOrganizations: typeof organizations = []
  if (user.isPlatformAdmin) {
    const serviceClient = createServiceClient()
    if (serviceClient) {
      const { data: orgs } = await serviceClient
        .from('organizations')
        .select('id, name, slug, organization_kind, status')
        .order('name')
      allOrganizations = (orgs || []).map((o: any) => ({
        ...o,
        role: 'admin' as OrganizationRole,
      }))
    }
  }

  return (
    <AppShellClient
      user={user}
      organizations={organizations}
      allOrganizations={allOrganizations}
    />
  )
}
