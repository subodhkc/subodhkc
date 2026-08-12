import { redirect } from 'next/navigation'
import {
  getAuthenticatedUser,
  resolveOrganizationContext,
  requireOfferingAccess,
  AuthError,
} from '@/lib/auth/organization-resolver'
import { getUserSchoolSites } from '@/lib/auth/school-resolver'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function SchoolPickupPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const user = await getAuthenticatedUser()
  if (!user) redirect(`/login?next=/app/${orgSlug}/school-pickup`)

  let orgCtx
  try {
    orgCtx = await resolveOrganizationContext(user, orgSlug)
    requireOfferingAccess(orgCtx, 'school_pickup')
  } catch (err) {
    if (err instanceof AuthError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center space-y-2 max-w-sm">
            <h1 className="text-xl font-bold">Access Denied</h1>
            <p className="text-sm text-muted-foreground">{err.message}</p>
            <a href={`/app/${orgSlug}`} className="text-sm text-primary hover:underline block">
              Back to {orgSlug}
            </a>
          </div>
        </div>
      )
    }
    throw err
  }

  const sites = await getUserSchoolSites(user, orgCtx.organization.id)

  if (sites.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="px-4 h-14 flex items-center gap-2">
            <a href="/app" className="font-semibold text-sm">SubodhKC</a>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm">{orgCtx.organization.name}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-medium">School Pickup</span>
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Welcome to School Pickup</h1>
            <p className="text-muted-foreground text-sm">
              No school sites have been set up yet. A platform administrator needs to create
              your first school site to get started.
            </p>
            {user.isPlatformAdmin && (
              <div className="border rounded-lg p-6 text-left space-y-4 mt-6">
                <h2 className="font-semibold">Create Your First School Site</h2>
                <p className="text-sm text-muted-foreground">
                  As a platform admin, you can create school sites and assign school administrators.
                </p>
                <a
                  href="/app/admin"
                  className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90"
                >
                  Go to Admin Console
                </a>
              </div>
            )}
          </div>
        </main>
      </div>
    )
  }

  // Redirect to single site
  if (sites.length === 1) {
    redirect(`/app/${orgSlug}/school-pickup/${sites[0].slug}`)
  }

  // Show site selector
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="px-4 h-14 flex items-center gap-2">
          <a href="/app" className="font-semibold text-sm">SubodhKC</a>
          <span className="text-muted-foreground">/</span>
          <a href={`/app/${orgSlug}`} className="text-sm">{orgCtx.organization.name}</a>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">School Pickup</span>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Select a School Site</h1>
        <div className="grid gap-3">
          {sites.map(site => (
            <a
              key={site.id}
              href={`/app/${orgSlug}/school-pickup/${site.slug}`}
              className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{site.name}</h3>
                  <p className="text-xs text-muted-foreground">{site.timezone}</p>
                </div>
                {site.status !== 'active' && (
                  <span className="text-xs bg-yellow-500/10 text-yellow-700 px-2 py-0.5 rounded">
                    {site.status}
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  )
}
