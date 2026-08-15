import { NextRequest, NextResponse } from 'next/server'
import {
  getAuthenticatedUser,
  resolveOrganizationContext,
  AuthError,
} from '@/lib/auth/organization-resolver'
import { checkMutationAllowed } from '@/lib/auth/fractional-access'
import { createServiceClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/fractional/onboarding?orgSlug=...
 * Returns the onboarding status for the authenticated user's organization.
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
  if (!sc) return NextResponse.json({ error: 'service_unavailable' }, { status: 500 })

  const { data: onboarding } = await sc
    .from('fractional_onboarding')
    .select('*')
    .eq('organization_id', ctx.organization.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return NextResponse.json({ onboarding: onboarding || null })
}

/**
 * POST /api/fractional/onboarding
 * Submit or update onboarding data.
 */
export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json()
  const {
    orgSlug,
    orgDescription,
    topOutcomes,
    aiStage,
    decisionsText,
    systemLinks,
    stakeholders,
    preferredSessionTimes,
  } = body as {
    orgSlug: string
    orgDescription?: string
    topOutcomes?: string
    aiStage?: string
    decisionsText?: string
    systemLinks?: string
    stakeholders?: string
    preferredSessionTimes?: string
  }

  if (!orgSlug) return NextResponse.json({ error: 'orgSlug required' }, { status: 400 })

  let ctx
  try {
    ctx = await resolveOrganizationContext(user, orgSlug)
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.code }, { status: 403 })
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  // Enforce read-only state — no mutations during 30-day post-cancellation window
  const mutationCheck = checkMutationAllowed(ctx)
  if (!mutationCheck.allowed) {
    return NextResponse.json(
      { error: mutationCheck.error, message: mutationCheck.message },
      { status: mutationCheck.status }
    )
  }

  const sc = createServiceClient()
  if (!sc) return NextResponse.json({ error: 'service_unavailable' }, { status: 500 })

  // Check if onboarding already exists for this org
  const { data: existing } = await sc
    .from('fractional_onboarding')
    .select('id, status')
    .eq('organization_id', ctx.organization.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // Find the fractional engagement if one exists
  const { data: engagement } = await sc
    .from('engagements')
    .select('id')
    .eq('organization_id', ctx.organization.id)
    .eq('engagement_type', 'retainer')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const onboardingData = {
    organization_id: ctx.organization.id,
    engagement_id: engagement?.id || null,
    user_id: user.id,
    status: 'completed' as const,
    org_description: orgDescription || null,
    top_outcomes: topOutcomes || null,
    ai_stage: aiStage || null,
    decisions_text: decisionsText || null,
    system_links: systemLinks || null,
    stakeholders: stakeholders || null,
    preferred_session_times: preferredSessionTimes || null,
    completed_at: new Date().toISOString(),
  }

  if (existing) {
    const { data: updated, error } = await sc
      .from('fractional_onboarding')
      .update(onboardingData)
      .eq('id', existing.id)
      .select('id')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Audit event
    await sc.rpc('write_audit_event', {
      audit_action: 'fractional.onboarding_completed',
      audit_entity_type: 'fractional_onboarding',
      audit_org_id: ctx.organization.id,
      audit_entity_id: updated.id,
      audit_actor_id: user.id,
      audit_metadata: { ai_stage: aiStage || null } as any,
    })

    // Send internal notification email
    try {
      const { sendFractionalOnboardingCompleteEmail } = await import('@/lib/email')
      await sendFractionalOnboardingCompleteEmail({
        orgName: ctx.organization.name,
        orgSlug: ctx.organization.slug,
        customerEmail: user.email || '',
        customerName: user.displayName || user.email || '',
        topOutcomes: topOutcomes || '',
        decisionsText: decisionsText || '',
        preferredSessionTimes: preferredSessionTimes || '',
      })
    } catch (err) {
      console.error('Failed to send onboarding notification:', err)
    }

    return NextResponse.json({ success: true, onboardingId: updated.id })
  }

  const { data: created, error } = await sc
    .from('fractional_onboarding')
    .insert(onboardingData)
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Audit event
  await sc.rpc('write_audit_event', {
    audit_action: 'fractional.onboarding_completed',
    audit_entity_type: 'fractional_onboarding',
    audit_org_id: ctx.organization.id,
    audit_entity_id: created.id,
    audit_actor_id: user.id,
    audit_metadata: { ai_stage: aiStage || null } as any,
  })

  // Send internal notification email
  try {
    const { sendFractionalOnboardingCompleteEmail } = await import('@/lib/email')
    await sendFractionalOnboardingCompleteEmail({
      orgName: ctx.organization.name,
      orgSlug: ctx.organization.slug,
      customerEmail: user.email || '',
      customerName: user.displayName || user.email || '',
      topOutcomes: topOutcomes || '',
      decisionsText: decisionsText || '',
      preferredSessionTimes: preferredSessionTimes || '',
    })
  } catch (err) {
    console.error('Failed to send onboarding notification:', err)
  }

  return NextResponse.json({ success: true, onboardingId: created.id })
}
