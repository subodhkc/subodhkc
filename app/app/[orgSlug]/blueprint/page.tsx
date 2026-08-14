import { redirect } from 'next/navigation'
import {
  getAuthenticatedUser,
  resolveOrganizationContext,
  AuthError,
  type OrganizationContext,
} from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'
import { BlueprintWorkspaceClient } from '@/components/app/BlueprintWorkspaceClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const metadata = {
  title: 'AI Automation Blueprint | SubodhKC',
  robots: { index: false, follow: false },
}

export default async function BlueprintPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const user = await getAuthenticatedUser()
  if (!user) redirect(`/login?next=/app/${orgSlug}/blueprint`)

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
            <a href={`/app`} className="text-sm text-primary hover:underline block">
              Back to dashboard
            </a>
          </div>
        </div>
      )
    }
    throw err
  }

  const hasEntitlement =
    ctx.entitlements.some(
      e => e.offering_key === 'ai_automation_blueprint' && e.effective_status === 'active'
    ) || ctx.isPlatformAdmin

  if (!hasEntitlement) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-3 max-w-md">
          <h1 className="text-xl font-bold">AI Automation Blueprint</h1>
          <p className="text-sm text-muted-foreground">
            Your organization does not have an active Blueprint.
          </p>
          <a href="/ai-automation" className="inline-block text-sm text-primary hover:underline">
            Learn about AI Automation Blueprint
          </a>
        </div>
      </div>
    )
  }

  const sc = createServiceClient()
  if (!sc) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">Configuration error. Please try again.</p>
      </div>
    )
  }

  // Find the blueprint engagement
  const { data: offeringData } = await sc
    .from('offerings')
    .select('id')
    .eq('offering_key', 'ai_automation_blueprint')
    .single()

  let engagement: any = null
  if (offeringData) {
    const { data: engOffering } = await sc
      .from('engagement_offerings')
      .select('engagement_id')
      .eq('organization_id', ctx.organization.id)
      .eq('offering_id', offeringData.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (engOffering) {
      const { data: eng } = await sc
        .from('engagements')
        .select(`
          id, engagement_type, status, starts_at, ends_at,
          title, statement, in_scope, out_of_scope,
          client_lead, advisor_lead, current_phase,
          health_status, health_reason, completed_at, completed_reason
        `)
        .eq('id', engOffering.engagement_id)
        .single()
      engagement = eng
    }
  }

  if (!engagement) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-3 max-w-md">
          <h1 className="text-xl font-bold">AI Automation Blueprint</h1>
          <p className="text-sm text-muted-foreground">
            Your Blueprint is being set up. Check back shortly.
          </p>
        </div>
      </div>
    )
  }

  // Map engagement phases to customer-friendly stages
  const phaseMap: Record<string, string> = {
    discovery: 'Intake',
    analysis: 'Workflow Analysis',
    delivery: 'Recommendation',
    completed: 'Delivered',
  }
  const stage = phaseMap[engagement.current_phase] || 'Intake'

  // Fetch engagement artifacts (deliverables)
  const { data: artifacts } = await sc
    .from('engagement_artifacts')
    .select('id, artifact_type, title, description, file_url, status, published_at, created_at')
    .eq('engagement_id', engagement.id)
    .order('created_at', { ascending: false })

  // Fetch engagement milestones
  const { data: milestones } = await sc
    .from('engagement_milestones')
    .select('id, title, description, status, due_date, completed_at')
    .eq('engagement_id', engagement.id)
    .order('created_at', { ascending: true })

  return (
    <BlueprintWorkspaceClient
      user={user}
      ctx={ctx}
      engagement={engagement}
      stage={stage}
      artifacts={artifacts || []}
      milestones={milestones || []}
    />
  )
}
