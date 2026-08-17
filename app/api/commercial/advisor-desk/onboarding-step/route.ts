import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, resolveOrganizationContext, AuthError } from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/commercial/advisor-desk/onboarding-step
 * Update a single onboarding step in customer_lifecycle_states.
 * Body: { orgSlug, step, status }
 */
export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json()
  const { orgSlug, step, status } = body as {
    orgSlug: string
    step: 'context_intake' | 'watchlist_review' | 'activation_call'
    status: 'not_started' | 'in_progress' | 'completed'
  }

  if (!orgSlug || !step || !status) {
    return NextResponse.json({ error: 'orgSlug, step, and status are required' }, { status: 400 })
  }

  let ctx
  try {
    ctx = await resolveOrganizationContext(user, orgSlug)
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.code }, { status: 403 })
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  const sc = createServiceClient()
  if (!sc) return NextResponse.json({ error: 'config' }, { status: 500 })

  // Fetch current lifecycle state
  const { data: lifecycle } = await sc
    .from('customer_lifecycle_states')
    .select('id, advisor_onboarding_steps')
    .eq('organization_id', ctx.organization.id)
    .single()

  const currentSteps = lifecycle?.advisor_onboarding_steps || {
    context_intake: 'not_started',
    watchlist_review: 'not_started',
    activation_call: 'not_started',
  }

  const updatedSteps = {
    ...currentSteps,
    [step]: status,
  }

  const allComplete =
    updatedSteps.context_intake === 'completed' &&
    updatedSteps.watchlist_review === 'completed' &&
    updatedSteps.activation_call === 'completed'

  if (lifecycle) {
    const { error } = await sc
      .from('customer_lifecycle_states')
      .update({
        advisor_onboarding_steps: updatedSteps,
        onboarding_complete: allComplete,
      })
      .eq('id', lifecycle.id)

    if (error) return NextResponse.json({ error: 'failed_to_update' }, { status: 500 })
  } else {
    // Create lifecycle state if it doesn't exist
    const { error } = await sc
      .from('customer_lifecycle_states')
      .insert({
        organization_id: ctx.organization.id,
        offer_key: 'ai_advisor_desk',
        state: 'ACTIVE_SETUP_REQUIRED',
        advisor_onboarding_steps: updatedSteps,
        onboarding_complete: allComplete,
      })

    if (error) return NextResponse.json({ error: 'failed_to_create' }, { status: 500 })
  }

  return NextResponse.json({ steps: updatedSteps, onboardingComplete: allComplete })
}
