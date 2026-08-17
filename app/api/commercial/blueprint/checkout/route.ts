import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/organization-resolver'
import { createOneTimeCheckout } from '@/lib/stripe/checkout'
import { getOffer, type OfferKey } from '@/lib/commercial/offers'
import { validateOrganizationForPurchase, hasActiveEntitlement } from '@/lib/commercial/purchase-auth'
import { createServiceClient } from '@/lib/supabase'
import { rateLimit } from '@/lib/rate-limit'
import { parseQualification, evaluateFit, toDbColumns } from '@/lib/commercial/blueprint-schema'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const limited = rateLimit(req)
  if (limited) return limited

  const user = await getAuthenticatedUser()
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const body = await req.json()
  const {
    qualificationResponses,
    organizationId,
    agreementAccepted,
  } = body as {
    qualificationResponses?: Record<string, string>
    organizationId?: string
    agreementAccepted?: boolean
  }

  // Organization selection is required
  if (!organizationId || typeof organizationId !== 'string') {
    return NextResponse.json(
      { error: 'organization_required', message: 'Organization selection is required' },
      { status: 400 }
    )
  }

  // Qualification is required for Blueprint — parse and validate using canonical schema
  if (!qualificationResponses || Object.keys(qualificationResponses).length === 0) {
    return NextResponse.json({ error: 'Qualification responses required' }, { status: 400 })
  }

  const qualification = parseQualification(qualificationResponses)
  if (!qualification) {
    return NextResponse.json({
      error: 'qualification_insufficient',
      message: 'Please answer both required questions with at least a few words.',
    }, { status: 422 })
  }

  const offerKey: OfferKey = 'ai_automation_blueprint'
  const offer = getOffer(offerKey)
  if (!offer) {
    return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
  }

  // Validate organization membership and authority
  const orgValidation = await validateOrganizationForPurchase(user, organizationId)
  if ('code' in orgValidation) {
    return NextResponse.json(
      { error: orgValidation.code, message: orgValidation.message },
      { status: orgValidation.status }
    )
  }

  const { organization } = orgValidation

  // ============================================
  // MEMBERSHIP ENTITLEMENT CHECK
  // ============================================
  // AI Work Orders are available through the AI Advisor relationship.
  // User must have an ACTIVE AI Advisor Desk OR Fractional AI Advisor entitlement.
  // This check is placed at the transactional point, not before intake.
  const hasAdvisorDesk = await hasActiveEntitlement(organization.id, 'ai_advisor_desk')
  const hasFractional = await hasActiveEntitlement(organization.id, 'fractional_ai_advisor')
  if (!hasAdvisorDesk && !hasFractional) {
    return NextResponse.json({
      error: 'membership_required',
      message: 'AI Work Orders are available through the AI Advisor relationship.',
      advisorDeskUrl: '/ai-advisor',
      advisoryUrl: '/advisory',
      signInUrl: '/login?next=/ai-automation',
    }, { status: 403 })
  }

  // Determine fit decision using canonical schema (opportunity-first model)
  const fitResult = evaluateFit(qualification)
  const fitDecision = fitResult.decision

  if (fitDecision === 'not_a_fit') {
    return NextResponse.json({
      error: 'not_a_fit',
      message: fitResult.reason,
    }, { status: 422 })
  }

  // Expanded scope cannot silently enter standard $500 checkout.
  // Queue for advisor review instead of charging.
  if (fitDecision === 'expanded_scope_review') {
    return NextResponse.json({
      error: 'custom_scope_required',
      message: 'This looks larger than one standard Work Order. I will review the scope before you are asked to pay. You can narrow the first Work Order, define multiple Work Orders, or we can discuss a larger scope.',
      fitDecision,
    }, { status: 422 })
  }

  const sc = createServiceClient()
  if (!sc) {
    return NextResponse.json({ error: 'service_unavailable' }, { status: 500 })
  }

  // ============================================
  // AGREEMENT ENFORCEMENT (fail-closed)
  // ============================================
  // Blueprint requires an agreement. This check is fail-closed:
  // - Service client must be available (checked above)
  // - Organization must be validated (checked above)
  // - Active template must exist
  // - Agreement must be in 'accepted' or 'signed' status
  // - If no accepted agreement, create a pending one and require acceptance
  if (offer.requiresAgreement) {
    // Check for existing accepted/signed agreement for this org + offer
    const { data: acceptedAgreement } = await sc
      .from('agreements')
      .select('id, status, template_version')
      .eq('organization_id', organization.id)
      .eq('template_key', `${offerKey}_agreement`)
      .in('status', ['accepted', 'signed'])
      .limit(1)

    if (!acceptedAgreement || acceptedAgreement.length === 0) {
      // No accepted agreement - check for pending
      const { data: pendingAgreement } = await sc
        .from('agreements')
        .select('id, status, body_text')
        .eq('organization_id', organization.id)
        .eq('template_key', `${offerKey}_agreement`)
        .eq('status', 'pending')
        .limit(1)

      if (pendingAgreement && pendingAgreement.length > 0) {
        // Pending agreement exists - require acceptance
        if (!agreementAccepted) {
          return NextResponse.json({
            error: 'agreement_required',
            message: 'Please review and accept the agreement before proceeding to checkout.',
            agreementId: pendingAgreement[0].id,
            agreementBody: pendingAgreement[0].body_text || null,
          }, { status: 403 })
        }

        // Mark agreement as accepted
        const { error: acceptError } = await sc
          .from('agreements')
          .update({
            status: 'accepted',
            signed_at: new Date().toISOString(),
            signed_by: user.id,
          })
          .eq('id', pendingAgreement[0].id)

        if (acceptError) {
          console.error('Failed to accept agreement:', acceptError.message)
          return NextResponse.json({ error: 'agreement_accept_failed' }, { status: 500 })
        }
      } else {
        // No agreement exists at all - create from template, then require acceptance
        const { data: template } = await sc
          .from('agreement_templates')
          .select('id, name, body_markdown, version, document_type, status')
          .eq('template_key', `${offerKey}_agreement`)
          .or('is_active.eq.true,status.eq.active')
          .single()

        if (!template) {
          // Fail-closed: no template means checkout cannot proceed
          console.error(`Agreement template not found: ${offerKey}_agreement`)
          return NextResponse.json({
            error: 'agreement_template_missing',
            message: 'Required agreement template is not configured. Please contact support.',
          }, { status: 500 })
        }

        const { data: newAgreement, error: createError } = await sc
          .from('agreements')
          .insert({
            organization_id: organization.id,
            template_key: `${offerKey}_agreement`,
            document_type: template.document_type,
            template_version: template.version,
            title: template.name,
            body_text: template.body_markdown,
            status: 'pending',
          })
          .select('id')
          .single()

        if (createError || !newAgreement) {
          console.error('Failed to create agreement:', createError?.message)
          return NextResponse.json({ error: 'agreement_creation_failed' }, { status: 500 })
        }

        // Require acceptance of the newly created agreement
        if (!agreementAccepted) {
          return NextResponse.json({
            error: 'agreement_required',
            message: 'Please review and accept the agreement before proceeding to checkout.',
            agreementId: newAgreement.id,
            agreementBody: template.body_markdown || null,
          }, { status: 403 })
        }

        // Mark agreement as accepted
        const { error: acceptError } = await sc
          .from('agreements')
          .update({
            status: 'accepted',
            signed_at: new Date().toISOString(),
            signed_by: user.id,
          })
          .eq('id', newAgreement.id)

        if (acceptError) {
          console.error('Failed to accept agreement:', acceptError.message)
          return NextResponse.json({ error: 'agreement_accept_failed' }, { status: 500 })
        }
      }
    }
  }

  // ============================================
  // QUALIFICATION RECORD (with organization_id) - FAIL CLOSED
  // ============================================
  // If qualification persistence fails, do NOT proceed to Stripe checkout.
  // Never permit qualification_record_id = '' for a new Work Order checkout.
  const { data: qualRecord, error: qualError } = await sc
    .from('blueprint_qualifications')
    .insert({
      organization_id: organization.id,
      user_email: user.email ?? '',
      user_id: user.id,
      ...toDbColumns(qualification),
      fit_decision: fitDecision,
      status: 'checkout_started',
    })
    .select('id')
    .single()

  if (qualError || !qualRecord) {
    console.error('Qualification persistence failed:', qualError?.message)
    return NextResponse.json({
      error: 'qualification_persistence_failed',
      message: 'Failed to save your intake. Please try again.',
    }, { status: 500 })
  }

  const qualificationRecordId = qualRecord.id

  // ============================================
  // STRIPE CHECKOUT (metadata contains only identifiers, no free-text)
  // ============================================
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://subodhkc.com'
  const successUrl = `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`
  const cancelUrl = `${siteUrl}${offer.landingPage}?checkout=cancelled`

  const result = await createOneTimeCheckout({
    offerKey,
    successUrl,
    cancelUrl,
    customerEmail: user.email ?? undefined,
    metadata: {
      user_id: user.id,
      organization_id: organization.id,
      offer_key: offerKey,
      qualification_record_id: qualificationRecordId ?? '',
      fit_decision: fitDecision,
    },
  })

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  return NextResponse.json({ url: result.url, sessionId: result.sessionId, fitDecision })
}
