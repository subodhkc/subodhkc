import { redirect } from 'next/navigation'
import {
  getAuthenticatedUser,
  resolveOrganizationContext,
  AuthError,
  type OrganizationContext,
  type AuthenticatedUser,
} from '@/lib/auth/organization-resolver'
import { OrgShellClient } from '@/components/app/OrgShellClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function OrgPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const user = await getAuthenticatedUser()
  if (!user) redirect(`/login?next=/app/${orgSlug}`)

  let ctx: OrganizationContext
  try {
    ctx = await resolveOrganizationContext(user, orgSlug)
  } catch (err) {
    if (err instanceof AuthError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center space-y-2">
            <h1 className="text-xl font-bold">Access Denied</h1>
            <p className="text-sm text-muted-foreground">{err.message}</p>
            <a href="/app" className="text-sm text-primary hover:underline">
              Back to organizations
            </a>
          </div>
        </div>
      )
    }
    throw err
  }

  return <OrgShellClient user={user} ctx={ctx} />
}
