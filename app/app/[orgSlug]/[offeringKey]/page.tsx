import { redirect } from 'next/navigation'
import {
  getAuthenticatedUser,
  resolveOrganizationContext,
  requireOfferingAccess,
  AuthError,
  type OrganizationContext,
} from '@/lib/auth/organization-resolver'
import { OfferingAccessClient } from '@/components/app/OfferingAccessClient'
import { getOfferingRoute } from '@/lib/auth/dashboard-resolver'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function OfferingPage({
  params,
}: {
  params: Promise<{ orgSlug: string; offeringKey: string }>
}) {
  const { orgSlug, offeringKey } = await params
  const user = await getAuthenticatedUser()
  if (!user) redirect(`/login?next=/app/${orgSlug}/${offeringKey}`)

  let ctx: OrganizationContext | undefined
  try {
    ctx = await resolveOrganizationContext(user, orgSlug)
    requireOfferingAccess(ctx, offeringKey)
  } catch (err) {
    if (err instanceof AuthError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center space-y-2 max-w-sm">
            <h1 className="text-xl font-bold">Access Denied</h1>
            <p className="text-sm text-muted-foreground">{err.message}</p>
            <a href={`/app/${orgSlug}`} className="text-sm text-primary hover:underline block">
              Back to {ctx?.organization.name || orgSlug}
            </a>
          </div>
        </div>
      )
    }
    throw err
  }

  // Redirect known offerings to their dedicated routes
  const route = getOfferingRoute(orgSlug, offeringKey)
  if (route) {
    redirect(route)
  }

  // For offerings without dedicated routes, show a purposeful access page
  return <OfferingAccessClient user={user} ctx={ctx} offeringKey={offeringKey} />
}
