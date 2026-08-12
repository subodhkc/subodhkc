import { redirect } from 'next/navigation'
import {
  getAuthenticatedUser,
  resolveOrganizationContext,
  requireOfferingAccess,
  AuthError,
  type OrganizationContext,
  type AuthenticatedUser,
} from '@/lib/auth/organization-resolver'
import { OfferingAccessClient } from '@/components/app/OfferingAccessClient'

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

  let ctx: OrganizationContext
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
            <div className="text-xs text-muted-foreground bg-accent p-2 rounded">
              Error code: <code>{err.code}</code>
            </div>
            <a href={`/app/${orgSlug}`} className="text-sm text-primary hover:underline block">
              Back to {orgSlug}
            </a>
          </div>
        </div>
      )
    }
    throw err
  }

  return <OfferingAccessClient user={user} ctx={ctx} offeringKey={offeringKey} />
}
