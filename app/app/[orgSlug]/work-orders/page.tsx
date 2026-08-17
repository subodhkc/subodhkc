import { redirect } from 'next/navigation'
import {
  getAuthenticatedUser,
  resolveOrganizationContext,
  AuthError,
  type OrganizationContext,
} from '@/lib/auth/organization-resolver'
import { listWorkOrdersForOrg, statusLabel, type WorkOrder, type WorkOrderStatus } from '@/lib/commercial/work-orders'
import WorkOrdersListClient from './WorkOrdersListClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const metadata = {
  title: 'AI Work Orders | SubodhKC',
  robots: { index: false, follow: false },
}

export default async function WorkOrdersPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const user = await getAuthenticatedUser()
  if (!user) redirect(`/login?next=/app/${orgSlug}/work-orders`)

  let ctx: OrganizationContext | undefined
  try {
    ctx = await resolveOrganizationContext(user, orgSlug)
  } catch (err) {
    if (err instanceof AuthError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center space-y-2 max-w-sm">
            <h1 className="text-xl font-bold">Access Denied</h1>
            <p className="text-sm text-muted-foreground">{err.message}</p>
            <a href="/app" className="text-sm text-primary hover:underline block">
              Back to dashboard
            </a>
          </div>
        </div>
      )
    }
    throw err
  }

  // Work Orders require active Advisor or Fractional membership
  const hasAdvisor = ctx.entitlements.some(
    e => e.offering_key === 'ai_advisor_desk' && e.effective_status === 'active'
  )
  const hasFractional = ctx.entitlements.some(
    e => e.offering_key === 'fractional_ai_advisor' && e.effective_status === 'active'
  )

  if (!hasAdvisor && !hasFractional && !ctx.isPlatformAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-xl font-bold">AI Advisor membership required</h1>
          <p className="text-sm text-muted-foreground">
            AI Work Orders are available through an active AI Advisor or Fractional AI Advisor relationship.
          </p>
          <div className="flex gap-3 justify-center">
            <a href="/ai-advisor" className="text-sm text-primary hover:underline">Join AI Advisor Desk ($99/mo)</a>
            <a href="/advisory" className="text-sm text-primary hover:underline">Explore Fractional Advisory</a>
          </div>
        </div>
      </div>
    )
  }

  const workOrders = await listWorkOrdersForOrg(ctx.organization.id)

  // Group by status category
  const needsInput = workOrders.filter(wo => wo.status === 'needs_client_input')
  const inProgress = workOrders.filter(wo =>
    ['paid', 'scoped', 'in_progress', 'in_review', 'payment_pending'].includes(wo.status)
  )
  const delivered = workOrders.filter(wo =>
    ['delivered', 'completed'].includes(wo.status)
  )
  const drafts = workOrders.filter(wo =>
    ['draft', 'awaiting_scope', 'awaiting_approval', 'ready_for_checkout'].includes(wo.status)
  )
  const history = workOrders.filter(wo =>
    ['cancelled', 'refunded'].includes(wo.status)
  )

  return (
    <WorkOrdersListClient
      orgSlug={orgSlug}
      orgName={ctx.organization.name}
      needsInput={needsInput}
      inProgress={inProgress}
      delivered={delivered}
      drafts={drafts}
      history={history}
      totalCount={workOrders.length}
    />
  )
}
