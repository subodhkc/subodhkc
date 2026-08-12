import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser, createServiceClient } from '@/lib/supabase'
import { FamilyPortalClient } from '@/components/family/FamilyPortalClient'

export const metadata: Metadata = {
  title: 'Family Pickup',
  description: 'Access your approved family pickup information.',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function FamilyPortalPage({
  searchParams,
}: {
  searchParams: Promise<{ site?: string; code?: string }>
}) {
  const user = await getCurrentUser()
  if (!user) {
    const params = new URLSearchParams()
    params.set('next', '/family')
    params.set('context', 'family')
    redirect(`/login?${params.toString()}`)
  }

  const { site, code } = await searchParams

  const serviceClient = createServiceClient()
  if (!serviceClient) return <div className="p-8 text-center text-muted-foreground">Configuration error.</div>

  // Get guardian sites
  const { data: sites } = await serviceClient.rpc('get_guardian_sites')

  if (!sites || sites.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-sm text-center space-y-4">
          <h1 className="text-xl font-semibold">No Family Access</h1>
          <p className="text-sm text-muted-foreground">
            You don&apos;t have any approved family pickup access yet.
            Please contact your school administrator if you believe this is an error.
          </p>
          <a
            href="/login?context=family"
            className="inline-block text-sm text-primary underline"
          >
            Sign in with a different account
          </a>
        </div>
      </div>
    )
  }

  // If site param provided, use it; otherwise if only one site, use it
  let selectedSite = null
  if (site) {
    selectedSite = sites.find((s: any) => s.site_slug === site || s.site_id === site)
  } else if (sites.length === 1) {
    selectedSite = sites[0]
  }

  if (!selectedSite && sites.length > 1) {
    // Multiple sites: show site selector
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-sm mx-auto px-4 py-12">
          <h1 className="text-xl font-semibold mb-6 text-center">Select School</h1>
          <div className="space-y-3">
            {sites.map((s: any) => (
              <a
                key={s.site_id}
                href={`/family?site=${s.site_id}`}
                className="block border rounded-lg p-4 hover:bg-accent transition-colors"
              >
                <div className="font-medium text-sm">{s.site_name}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.org_name}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!selectedSite) {
    return <div className="p-8 text-center text-muted-foreground">Site not found.</div>
  }

  // Get family data for selected site
  const { data: familyData } = await serviceClient.rpc('get_guardian_family_data', {
    p_site_id: selectedSite.site_id,
  })

  if (!familyData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-sm text-center space-y-4">
          <h1 className="text-xl font-semibold">Access Pending</h1>
          <p className="text-sm text-muted-foreground">
            Your family access hasn&apos;t been activated yet. Please contact your school administrator.
          </p>
        </div>
      </div>
    )
  }

  return (
    <FamilyPortalClient
      siteId={selectedSite.site_id}
      siteName={selectedSite.site_name}
      orgSlug={selectedSite.org_slug}
      siteSlug={selectedSite.site_slug}
      initialData={familyData}
      checkinCode={code || null}
    />
  )
}
