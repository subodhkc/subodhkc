import { redirect } from 'next/navigation'
import {
  getAuthenticatedUser,
  resolveOrganizationContext,
  AuthError,
  type OrganizationContext,
} from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'
import { getOffer } from '@/lib/commercial/offers'
import { getAdvisorBillingPeriod } from '@/lib/commercial/billing-period'
import { AdvisorDeskWorkspaceClient } from '@/components/app/AdvisorDeskWorkspaceClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const metadata = {
  title: 'AI Advisor Desk | SubodhKC',
  robots: { index: false, follow: false },
}

export default async function AdvisorDeskPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const user = await getAuthenticatedUser()
  if (!user) redirect(`/login?next=/app/${orgSlug}/advisor-desk`)

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

  const offer = getOffer('ai_advisor_desk')
  const hasEntitlement =
    ctx.entitlements.some(
      e => e.offering_key === 'ai_advisor_desk' && e.effective_status === 'active'
    ) || ctx.isPlatformAdmin

  if (!hasEntitlement) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-3 max-w-md">
          <h1 className="text-xl font-bold">AI Advisor Desk</h1>
          <p className="text-sm text-muted-foreground">
            Your organization does not have an active AI Advisor Desk subscription.
          </p>
          <a
            href={offer?.landingPage ?? '/ai-advisor'}
            className="inline-block text-sm text-primary hover:underline"
          >
            Learn about AI Advisor Desk
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

  const { periodKey: currentPeriod } = await getAdvisorBillingPeriod(ctx.organization.id)

  // Fetch advisor questions
  const { data: questions } = await sc
    .from('advisor_questions')
    .select(`
      id, subject, question, status, advisor_response,
      billing_period_key, created_at, responded_at, context
    `)
    .eq('organization_id', ctx.organization.id)
    .order('created_at', { ascending: false })

  // Count questions used this billing period (not closed)
  const usedThisPeriod = (questions || []).filter(
    q => q.billing_period_key === currentPeriod && q.status !== 'closed'
  ).length

  const allowance = offer?.advisorQuestionsPerPeriod ?? 1
  const remaining = Math.max(0, allowance - usedThisPeriod)

  // Fetch team members
  const { data: members } = await sc
    .from('organization_memberships')
    .select(`
      id, role, status, joined_at,
      user_id
    `)
    .eq('organization_id', ctx.organization.id)
    .eq('status', 'active')
    .order('joined_at', { ascending: true })

  // Fetch profiles for members
  const memberUserIds = (members || []).map(m => m.user_id).filter(Boolean)
  let memberProfiles: Record<string, { email: string; full_name: string | null }> = {}
  if (memberUserIds.length > 0) {
    const { data: profiles } = await sc
      .from('profiles')
      .select('id, email, full_name')
      .in('id', memberUserIds)
    for (const p of profiles || []) {
      memberProfiles[p.id] = { email: p.email, full_name: p.full_name }
    }
  }

  // Fetch subscription status for billing section
  const { data: subLink } = await sc
    .from('external_system_links')
    .select('external_id, metadata, status')
    .eq('organization_id', ctx.organization.id)
    .eq('system_key', 'stripe_subscription')
    .single()

  // Fetch entitlement for valid_until info
  const advisorEntitlement = ctx.entitlements.find(
    e => e.offering_key === 'ai_advisor_desk'
  )

  return (
    <AdvisorDeskWorkspaceClient
      user={user}
      ctx={ctx}
      questions={questions || []}
      remaining={remaining}
      allowance={allowance}
      currentPeriod={currentPeriod}
      members={(members || []).map(m => ({
        id: m.id,
        role: m.role,
        userId: m.user_id,
        email: memberProfiles[m.user_id]?.email ?? '',
        fullName: memberProfiles[m.user_id]?.full_name ?? null,
      }))}
      teamSeatLimit={offer?.teamSeatLimit ?? 3}
      subscriptionStatus={subLink?.status ?? null}
      subscriptionMetadata={subLink?.metadata ?? {}}
      entitlementValidUntil={advisorEntitlement?.valid_until ?? null}
      entitlementStatus={advisorEntitlement?.effective_status ?? 'active'}
    />
  )
}
