import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/organization-resolver'
import { createOneTimeCheckout } from '@/lib/stripe/checkout'
import { getOffer, type OfferKey } from '@/lib/commercial/offers'
import { createServiceClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser()

  const body = await req.json()
  const { qualificationResponses } = body as { qualificationResponses?: Record<string, string> }

  // Qualification is required for Blueprint
  if (!qualificationResponses || Object.keys(qualificationResponses).length === 0) {
    return NextResponse.json({ error: 'Qualification responses required' }, { status: 400 })
  }

  const offerKey: OfferKey = 'ai_automation_blueprint'
  const offer = getOffer(offerKey)
  if (!offer) {
    return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
  }

  // Determine fit decision based on qualification responses
  const businessObjective = (qualificationResponses.business_objective || '').toLowerCase()
  const workflowProblem = (qualificationResponses.workflow_problem || '').toLowerCase()
  const sensitiveData = qualificationResponses.sensitive_data === 'true' || qualificationResponses.sensitive_data === 'yes'
  const systemsInvolved = qualificationResponses.systems_involved || ''

  let fitDecision: 'standard_blueprint' | 'expanded_scope_review' | 'not_a_fit' = 'standard_blueprint'

  // Expanded scope if sensitive data or complex integrations
  if (sensitiveData || systemsInvolved.split(',').length > 5) {
    fitDecision = 'expanded_scope_review'
  }

  // Not a fit if no clear workflow problem
  if (!workflowProblem || workflowProblem.length < 10) {
    fitDecision = 'not_a_fit'
  }

  if (fitDecision === 'not_a_fit') {
    return NextResponse.json({
      error: 'not_a_fit',
      message: 'Based on your responses, the AI Automation Blueprint may not be the right fit. Consider booking a fit call first.',
    }, { status: 422 })
  }

  const sc = createServiceClient()

  // If the offer requires an agreement, verify an accepted agreement exists
  // Only check if user is authenticated and has an existing organization
  if (offer.requiresAgreement && sc && user) {
    // Find user's org
    const { data: membership } = await sc
      .from('organization_memberships')
      .select('organization_id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single() as any

    const orgId = membership?.organization_id

    if (orgId) {
      const { data: acceptedAgreement } = await sc
        .from('agreements')
        .select('id, status')
        .eq('organization_id', orgId)
        .eq('template_key', `${offerKey}_agreement`)
        .eq('status', 'accepted')
        .limit(1)

      if (!acceptedAgreement || acceptedAgreement.length === 0) {
        // Check if a pending agreement exists
        const { data: pendingAgreement } = await sc
          .from('agreements')
          .select('id, status')
          .eq('organization_id', orgId)
          .eq('template_key', `${offerKey}_agreement`)
          .eq('status', 'pending')
          .limit(1)

        if (pendingAgreement && pendingAgreement.length > 0) {
          return NextResponse.json({
            error: 'agreement_required',
            message: 'Please accept the agreement before proceeding to checkout.',
            agreementId: pendingAgreement[0].id,
          }, { status: 403 })
        }

        // No agreement exists yet - create one from template
        const { data: template } = await sc
          .from('agreement_templates')
          .select('id, name, body_markdown, version, document_type')
          .eq('template_key', `${offerKey}_agreement`)
          .eq('is_active', true)
          .single()

        if (template) {
          const { data: newAgreement } = await sc
            .from('agreements')
            .insert({
              organization_id: orgId,
              template_key: `${offerKey}_agreement`,
              document_type: template.document_type,
              template_version: template.version,
              title: template.name,
              body_text: template.body_markdown,
              status: 'pending',
            })
            .select('id')
            .single()

          if (newAgreement) {
            return NextResponse.json({
              error: 'agreement_required',
              message: 'Please review and accept the agreement before proceeding to checkout.',
              agreementId: newAgreement.id,
            }, { status: 403 })
          }
        }
      }
    }
  }
  if (sc) {
    await sc
      .from('blueprint_qualifications')
      .insert({
        user_email: user?.email ?? '',
        user_id: user?.id ?? null,
        business_objective: qualificationResponses.business_objective || '',
        workflow_problem: qualificationResponses.workflow_problem || '',
        current_process: qualificationResponses.current_process || null,
        systems_involved: qualificationResponses.systems_involved || null,
        known_integrations: qualificationResponses.known_integrations || null,
        team_functions: qualificationResponses.team_functions || null,
        sensitive_data: sensitiveData,
        desired_outcome: qualificationResponses.desired_outcome || null,
        timeline: qualificationResponses.timeline || null,
        fit_decision: fitDecision,
        status: 'checkout_started',
      })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://subodhkc.com'
  const successUrl = `${siteUrl}/app?checkout=success&offer=${offerKey}`
  const cancelUrl = `${siteUrl}${offer.landingPage}?checkout=cancelled`

  const result = await createOneTimeCheckout({
    offerKey,
    successUrl,
    cancelUrl,
    customerEmail: user?.email ?? undefined,
    metadata: {
      ...(user ? { user_id: user.id } : {}),
      offer_key: offerKey,
      qualification: JSON.stringify(qualificationResponses),
      business_objective: qualificationResponses.business_objective || '',
      workflow_problem: qualificationResponses.workflow_problem || '',
      systems_involved: qualificationResponses.systems_involved || '',
      fit_decision: fitDecision,
    },
  })

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  return NextResponse.json({ url: result.url, sessionId: result.sessionId, fitDecision })
}
