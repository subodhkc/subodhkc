import { redirect } from 'next/navigation'
import {
  getAuthenticatedUser,
  resolveOrganizationContext,
  AuthError,
  type OrganizationContext,
} from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'
import { AdvisorOnboardingClient } from '@/components/onboarding/AdvisorOnboardingClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const metadata = {
  title: 'Onboarding | AI Advisor Desk | SubodhKC',
  robots: { index: false, follow: false },
}

export default async function AdvisorOnboardingPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const user = await getAuthenticatedUser()
  if (!user) redirect(`/login?next=/app/${orgSlug}/advisor-desk/onboarding`)

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

  const hasEntitlement =
    ctx.entitlements.some(
      e => e.offering_key === 'ai_advisor_desk' && e.effective_status === 'active'
    ) || ctx.isPlatformAdmin

  if (!hasEntitlement) {
    redirect(`/app/${orgSlug}/advisor-desk`)
  }

  const sc = createServiceClient()
  if (!sc) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">Configuration error. Please try again.</p>
      </div>
    )
  }

  // Fetch existing context profile
  const { data: contextProfile } = await sc
    .from('advisor_context_profiles')
    .select('*')
    .eq('organization_id', ctx.organization.id)
    .single()

  // Fetch existing watchlist items
  const { data: watchlistItems } = await sc
    .from('advisor_watchlist_items')
    .select('*')
    .eq('organization_id', ctx.organization.id)
    .order('created_at', { ascending: false })

  // Fetch scheduling links for activation call
  const { data: schedulingLinks } = await sc
    .from('scheduling_links')
    .select('*')
    .eq('organization_id', ctx.organization.id)
    .eq('link_type', 'activation_call')
    .order('created_at', { ascending: false })
    .limit(1)

  // Fetch lifecycle state for onboarding steps
  const { data: lifecycle } = await sc
    .from('customer_lifecycle_states')
    .select('advisor_onboarding_steps, onboarding_complete')
    .eq('organization_id', ctx.organization.id)
    .single()

  const onboardingSteps = lifecycle?.advisor_onboarding_steps || {
    context_intake: 'not_started',
    watchlist_review: 'not_started',
    activation_call: 'not_started',
  }

  return (
    <AdvisorOnboardingClient
      user={user}
      orgSlug={orgSlug}
      orgName={ctx.organization.name}
      contextProfile={contextProfile || null}
      watchlistItems={watchlistItems || []}
      schedulingLink={schedulingLinks?.[0] || null}
      onboardingSteps={onboardingSteps}
      onboardingComplete={lifecycle?.onboarding_complete || false}
    />
  )
}
