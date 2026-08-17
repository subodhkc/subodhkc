import { redirect } from 'next/navigation'
import {
  getAuthenticatedUser,
  resolveOrganizationContext,
  AuthError,
  type OrganizationContext,
} from '@/lib/auth/organization-resolver'
import {
  getWorkOrder,
  listWorkOrderUpdates,
  getScopeAcceptance,
  statusLabel,
} from '@/lib/commercial/work-orders'
import WorkOrderDetailClient from './WorkOrderDetailClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const metadata = {
  title: 'AI Work Order | SubodhKC',
  robots: { index: false, follow: false },
}

export default async function WorkOrderDetailPage({
  params,
}: {
  params: Promise<{ orgSlug: string; workOrderId: string }>
}) {
  const { orgSlug, workOrderId } = await params
  const user = await getAuthenticatedUser()
  if (!user) redirect(`/login?next=/app/${orgSlug}/work-orders/${workOrderId}`)

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
            <a href="/app" className="text-sm text-primary hover:underline block">Back to dashboard</a>
          </div>
        </div>
      )
    }
    throw err
  }

  const wo = await getWorkOrder(workOrderId)
  if (!wo || (wo.organization_id !== ctx.organization.id && !ctx.isPlatformAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-2 max-w-sm">
          <h1 className="text-xl font-bold">Work Order not found</h1>
          <a href={`/app/${orgSlug}/work-orders`} className="text-sm text-primary hover:underline block">
            Back to Work Orders
          </a>
        </div>
      </div>
    )
  }

  const [updates, scopeAcceptance] = await Promise.all([
    listWorkOrderUpdates(workOrderId, ctx.isPlatformAdmin),
    getScopeAcceptance(workOrderId),
  ])

  return (
    <WorkOrderDetailClient
      orgSlug={orgSlug}
      workOrder={wo}
      updates={updates}
      scopeAcceptance={scopeAcceptance}
      statusLabel={statusLabel(wo.status)}
      userId={user.id}
    />
  )
}
