import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, resolveOrganizationContext, AuthError } from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'
import { trackEvent } from '@/lib/commercial/analytics'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/commercial/advisor-desk/context-profile?orgSlug=<slug>
 * Returns the organization's advisor context profile (for save/resume).
 */
export async function GET(req: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const orgSlug = searchParams.get('orgSlug')
  if (!orgSlug) return NextResponse.json({ error: 'orgSlug required' }, { status: 400 })

  let ctx
  try {
    ctx = await resolveOrganizationContext(user, orgSlug)
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.code }, { status: 403 })
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  const sc = createServiceClient()
  if (!sc) return NextResponse.json({ error: 'config' }, { status: 500 })

  const { data: profile } = await sc
    .from('advisor_context_profiles')
    .select('*')
    .eq('organization_id', ctx.organization.id)
    .single()

  return NextResponse.json({ profile: profile || null })
}

/**
 * PUT /api/commercial/advisor-desk/context-profile
 * Save or update the context profile (supports save/resume).
 * Body: { orgSlug, profileData, status? }
 */
export async function PUT(req: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json()
  const { orgSlug, profileData, status } = body as {
    orgSlug: string
    profileData: Record<string, unknown>
    status?: 'not_started' | 'in_progress' | 'completed'
  }

  if (!orgSlug || !profileData) {
    return NextResponse.json({ error: 'orgSlug and profileData are required' }, { status: 400 })
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

  const now = new Date().toISOString()
  const newStatus = status || 'in_progress'

  // Upsert the profile
  const { data: profile, error } = await sc
    .from('advisor_context_profiles')
    .upsert(
      {
        organization_id: ctx.organization.id,
        profile_data: profileData,
        status: newStatus,
        last_saved_at: now,
        completed_at: newStatus === 'completed' ? now : null,
      },
      { onConflict: 'organization_id' }
    )
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: 'failed_to_save' }, { status: 500 })

  // Track event
  const eventName = newStatus === 'completed' ? 'advisor_context_completed' : 'advisor_context_started'
  await trackEvent({
    eventName: eventName as any,
    organizationId: ctx.organization.id,
    userId: user.id,
    offerKey: 'ai_advisor_desk',
    pagePath: `/app/${orgSlug}/advisor-desk/onboarding`,
  })

  // Update onboarding step in customer_lifecycle_states
  try {
    const { data: lifecycle } = await sc
      .from('customer_lifecycle_states')
      .select('id, advisor_onboarding_steps')
      .eq('organization_id', ctx.organization.id)
      .single()

    if (lifecycle) {
      const steps = lifecycle.advisor_onboarding_steps || {}
      await sc
        .from('customer_lifecycle_states')
        .update({
          advisor_onboarding_steps: {
            ...steps,
            context_intake: newStatus === 'completed' ? 'completed' : 'in_progress',
          },
          onboarding_complete: newStatus === 'completed' && steps.watchlist_review === 'completed' && steps.activation_call === 'completed',
        })
        .eq('id', lifecycle.id)
    }
  } catch {
    // Non-blocking: lifecycle state update is best-effort
  }

  return NextResponse.json({ profile })
}
