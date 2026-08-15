import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripe, getStripeWebhookSecret } from '@/lib/stripe/client'
import {
  isEventProcessed,
  resolveOrCreateOrganization,
  activateEntitlement,
  deactivateEntitlement,
  recordPayment,
} from '@/lib/stripe/webhooks'
import { getOfferByStripePriceId, getOffer, type OfferKey } from '@/lib/commercial/offers'
import { createServiceClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const webhookSecret = getStripeWebhookSecret()
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  // Get raw body for signature verification
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Idempotency check - if already processed, skip
  const alreadyProcessed = await isEventProcessed(event.id)
  if (alreadyProcessed) {
    return NextResponse.json({ received: true, duplicate: true })
  }

  // Mark event as processing to prevent concurrent duplicate processing
  const sc = createServiceClient()
  if (!sc) {
    return NextResponse.json({ error: 'Service client unavailable' }, { status: 500 })
  }
  const { error: insertError } = await sc
    .from('webhook_idempotency')
    .insert({ event_id: event.id, event_type: event.type })
  if (insertError) {
    // Another worker may have already inserted it
    return NextResponse.json({ received: true, duplicate: true })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event)
        break
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event)
        break
      case 'invoice.paid':
        await handleInvoicePaid(event)
        break
      case 'invoice.payment_failed':
        await handlePaymentFailed(event)
        break
      default:
        // Unhandled event type - acknowledge but don't process
        break
    }

    // Event successfully processed - idempotency record already inserted
    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error(`Webhook processing error for ${event.type} (${event.id}):`, err.message)
    // Remove idempotency mark so Stripe can retry
    await sc.from('webhook_idempotency').delete().eq('event_id', event.id)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}

/**
 * Handle checkout.session.completed - the primary entitlement activation event.
 */
async function handleCheckoutCompleted(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session
  const offerKey = session.metadata?.offer_key as OfferKey | undefined
  if (!offerKey) {
    // No offer_key means this event is from another app (HAIEC, Kestrel, etc.)
    return
  }

  // Extra guard: skip events from other apps sharing this Stripe account
  const appSource = session.metadata?.app_source
  if (appSource && appSource !== 'subodhkc') return

  const offer = getOffer(offerKey)
  if (!offer) {
    console.error('Unknown offer key:', offerKey)
    return
  }

  const customerEmail = session.customer_details?.email
  const customerName = session.customer_details?.name ?? undefined
  const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id

  if (!customerEmail || !customerId) {
    console.error('Missing customer email or ID in session', session.id)
    return
  }

  // Extract user_id and organization_id from session metadata
  // organization_id is the canonical binding from checkout (P0 commercial identity)
  const userId = session.metadata?.user_id as string | undefined
  const organizationId = session.metadata?.organization_id as string | undefined

  // Resolve or create organization
  const orgResult = await resolveOrCreateOrganization({
    customerEmail,
    customerName,
    customerId,
    userId,
    organizationId,
  })

  if ('error' in orgResult) {
    console.error('Failed to resolve org:', orgResult.error)
    return
  }

  const { orgId, orgSlug, created } = orgResult

  // Record payment
  const amountTotal = session.amount_total ?? 0
  await recordPayment({
    orgId,
    offerKey,
    stripePaymentIntentId: session.payment_intent as string ?? undefined,
    amountCents: amountTotal,
    currency: session.currency || 'usd',
    status: session.payment_status === 'paid' ? 'succeeded' : 'pending',
    type: offer.billingMode === 'subscription' ? 'subscription' : 'one_time',
    metadata: { session_id: session.id, created_org: created },
  })

  // Activate entitlement
  let validUntil: string | null = null
  if (offer.billingMode === 'subscription') {
    // For subscriptions, valid_until is null (managed by subscription lifecycle)
    validUntil = null
  } else {
    // For one-time purchases, entitlement is permanent
    validUntil = null
  }

  const entResult = await activateEntitlement({
    orgId,
    offerKey,
    userId,
    sourceType: offer.billingMode === 'subscription' ? 'subscription' : 'purchase',
    validUntil,
    metadata: { session_id: session.id, stripe_customer_id: customerId },
  })

  if ('error' in entResult) {
    console.error('Failed to activate entitlement:', entResult.error)
    return
  }

  // Store subscription ID if applicable
  if (offer.billingMode === 'subscription' && session.subscription) {
    const sc = createServiceClient()
    if (sc) {
      const subId = typeof session.subscription === 'string' ? session.subscription : session.subscription.id
      await sc
        .from('external_system_links')
        .upsert(
          {
            organization_id: orgId,
            system_key: 'stripe_subscription',
            external_id: subId,
            status: 'active',
            metadata: { offer_key: offerKey },
          },
          { onConflict: 'organization_id,system_key' }
        )
    }
  }

  // Create engagement if the offer requires it
  if (offer.createsEngagement && offer.engagementType) {
    await createEngagementForOffer(orgId, offerKey, offer.engagementType, customerEmail, session.metadata as Record<string, string | undefined> | undefined)
  }

  // Write audit event
  const sc = createServiceClient()
  if (sc) {
    await sc.rpc('write_audit_event', {
      audit_action: 'commercial.purchase_completed',
      audit_entity_type: 'payment',
      audit_org_id: orgId,
      audit_entity_id: session.id,
      audit_metadata: {
        offer_key: offerKey,
        amount_cents: amountTotal,
        currency: session.currency,
        new_org: created,
      } as any,
    })
  }

  // Send welcome/notification email based on offer type
  try {
    if (offerKey === 'ai_advisor_desk') {
      const { sendAdvisorWelcomeEmail } = await import('@/lib/email')
      await sendAdvisorWelcomeEmail({
        to: customerEmail,
        customerName,
        orgSlug,
      })
    } else if (offerKey === 'ai_automation_blueprint') {
      const { sendBlueprintPurchasedEmail } = await import('@/lib/email')
      // Fetch business_objective from qualification record, not Stripe metadata
      let objective = 'AI automation analysis'
      const qualRecordId = session.metadata?.qualification_record_id as string | undefined
      if (qualRecordId && sc) {
        const { data: qualRecord } = await sc
          .from('blueprint_qualifications')
          .select('business_objective')
          .eq('id', qualRecordId)
          .single()
        if (qualRecord?.business_objective) {
          objective = qualRecord.business_objective
        }
      }
      await sendBlueprintPurchasedEmail({
        to: customerEmail,
        customerName,
        orgSlug,
        businessObjective: objective,
      })
    } else if (offerKey === 'fractional_ai_advisor') {
      const { sendFractionalAdvisorWelcomeEmail } = await import('@/lib/email')
      await sendFractionalAdvisorWelcomeEmail({
        to: customerEmail,
        customerName,
        orgSlug,
      })
    } else if (offerKey === 'saas_security_review' || offerKey === 'ai_security_compliance') {
      const { sendSecurityReviewActivatedEmail } = await import('@/lib/email')
      const scope = session.metadata?.scope_summary || 'Application security review'
      await sendSecurityReviewActivatedEmail({
        to: customerEmail,
        customerName,
        orgSlug,
        scopeSummary: scope,
      })
    }
  } catch (err) {
    console.error('Failed to send purchase notification email:', err)
  }
}

/**
 * Handle subscription updates (plan changes, reactivation).
 */
async function handleSubscriptionUpdated(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription
  const offerKey = subscription.metadata?.offer_key as OfferKey | undefined
  if (!offerKey) return

  // Skip events from other apps sharing this Stripe account
  const appSource = subscription.metadata?.app_source
  if (appSource && appSource !== 'subodhkc') return

  const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id
  const sc = createServiceClient()
  if (!sc) return

  // Find org by Stripe customer ID
  const { data: link } = await sc
    .from('external_system_links')
    .select('organization_id')
    .eq('system_key', 'stripe_customer')
    .eq('external_id', customerId)
    .eq('status', 'active')
    .single()

  if (!link) return

  const orgId = link.organization_id

  if (subscription.status === 'active' || subscription.status === 'trialing') {
    const subUserId = subscription.metadata?.user_id as string | undefined
    await activateEntitlement({
      orgId,
      offerKey,
      userId: subUserId,
      sourceType: 'subscription',
      metadata: { subscription_id: subscription.id, status: subscription.status },
    })
  } else if (subscription.status === 'past_due' || subscription.status === 'unpaid') {
    // Don't deactivate immediately - Stripe will retry
    await sc.rpc('write_audit_event', {
      audit_action: 'commercial.subscription_past_due',
      audit_entity_type: 'subscription',
      audit_org_id: orgId,
      audit_entity_id: subscription.id,
      audit_metadata: { status: subscription.status } as any,
    })
  }

  // Update subscription link
  await sc
    .from('external_system_links')
    .upsert(
      {
        organization_id: orgId,
        system_key: 'stripe_subscription',
        external_id: subscription.id,
        status: subscription.status === 'canceled' ? 'inactive' : 'active',
        metadata: { offer_key: offerKey, status: subscription.status },
      },
      { onConflict: 'organization_id,system_key' }
    )
}

/**
 * Handle subscription cancellation - deactivate entitlement at period end.
 */
async function handleSubscriptionDeleted(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription
  const offerKey = subscription.metadata?.offer_key as OfferKey | undefined
  if (!offerKey) return

  // Skip events from other apps sharing this Stripe account
  const appSource = subscription.metadata?.app_source
  if (appSource && appSource !== 'subodhkc') return

  const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id
  const sc = createServiceClient()
  if (!sc) return

  const { data: link } = await sc
    .from('external_system_links')
    .select('organization_id')
    .eq('system_key', 'stripe_customer')
    .eq('external_id', customerId)
    .eq('status', 'active')
    .single()

  if (!link) return

  const orgId = link.organization_id

  // Deactivate entitlement - valid_until = current period end
  const validUntil = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : new Date().toISOString()

  await deactivateEntitlement({
    orgId,
    offerKey,
    reason: 'subscription_cancelled',
    validUntil,
  })

  // Update subscription link status
  await sc
    .from('external_system_links')
    .update({ status: 'inactive' })
    .eq('organization_id', orgId)
    .eq('system_key', 'stripe_subscription')

  // Audit event
  await sc.rpc('write_audit_event', {
    audit_action: 'commercial.subscription_cancelled',
    audit_entity_type: 'subscription',
    audit_org_id: orgId,
    audit_entity_id: subscription.id,
    audit_metadata: { valid_until: validUntil } as any,
  })
}

/**
 * Handle failed invoice payment.
 */
async function handlePaymentFailed(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice
  const sc = createServiceClient()
  if (!sc) return

  // Skip events from other apps sharing this Stripe account
  const appSource = invoice.metadata?.app_source
  if (appSource && appSource !== 'subodhkc') return

  // Find org by customer ID
  const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id
  if (!customerId) return
  const { data: link } = await sc
    .from('external_system_links')
    .select('organization_id')
    .eq('system_key', 'stripe_customer')
    .eq('external_id', customerId)
    .eq('status', 'active')
    .single()

  if (!link) return

  await sc.rpc('write_audit_event', {
    audit_action: 'commercial.payment_failed',
    audit_entity_type: 'invoice',
    audit_org_id: link.organization_id,
    audit_entity_id: invoice.id,
    audit_metadata: { attempt_count: invoice.attempt_count } as any,
  })

  // Send subscription issue email
  try {
    const { data: org } = await sc
      .from('organizations')
      .select('slug')
      .eq('id', link.organization_id)
      .single()

    if (org?.slug && invoice.customer_email) {
      const { sendSubscriptionIssueEmail } = await import('@/lib/email')
      await sendSubscriptionIssueEmail({
        to: invoice.customer_email,
        orgSlug: org.slug,
        issue: `Payment attempt ${invoice.attempt_count} failed. Stripe will retry automatically.`,
      })
    }
  } catch (err) {
    console.error('Failed to send subscription issue email:', err)
  }
}

/**
 * Handle invoice.paid - records recurring subscription payments.
 * This fires on every successful invoice payment, including recurring renewals.
 */
async function handleInvoicePaid(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice
  const sc = createServiceClient()
  if (!sc) return

  // Skip events from other apps sharing this Stripe account
  const appSource = invoice.metadata?.app_source
  if (appSource && appSource !== 'subodhkc') return

  // Find org by customer ID
  const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id
  if (!customerId) return

  const { data: link } = await sc
    .from('external_system_links')
    .select('organization_id')
    .eq('system_key', 'stripe_customer')
    .eq('external_id', customerId)
    .eq('status', 'active')
    .single()

  if (!link) return

  const orgId = link.organization_id

  const invoiceOfferKey = invoice.metadata?.offer_key as OfferKey | undefined
  if (!invoiceOfferKey) return

  // Record the payment
  await recordPayment({
    orgId,
    offerKey: invoiceOfferKey,
    stripePaymentIntentId: invoice.payment_intent as string ?? undefined,
    amountCents: invoice.amount_paid,
    currency: invoice.currency || 'usd',
    status: 'succeeded',
    type: 'subscription',
    metadata: { invoice_id: invoice.id, billing_reason: invoice.billing_reason },
  })

  // Ensure entitlement stays active
  const offerKey = invoice.metadata?.offer_key as OfferKey | undefined
  if (!offerKey) return
  await activateEntitlement({
    orgId,
    offerKey,
    sourceType: 'subscription',
    metadata: { invoice_id: invoice.id, billing_reason: invoice.billing_reason },
  })

  // Audit event
  await sc.rpc('write_audit_event', {
    audit_action: 'commercial.invoice_paid',
    audit_entity_type: 'invoice',
    audit_org_id: orgId,
    audit_entity_id: invoice.id,
    audit_metadata: {
      amount_cents: invoice.amount_paid,
      currency: invoice.currency,
      billing_reason: invoice.billing_reason,
    } as any,
  })
}

/**
 * Create an engagement for offers that require it (Blueprint, Security Review, etc.)
 * Prevents duplicate engagements by checking offering_id, not just org_id.
 * For Blueprint, populates charter fields from qualification metadata.
 */
async function createEngagementForOffer(
  orgId: string,
  offerKey: OfferKey,
  engagementType: string,
  customerEmail: string,
  sessionMetadata?: Record<string, string | undefined>
): Promise<void> {
  const sc = createServiceClient()
  if (!sc) return

  const offer = getOffer(offerKey)
  if (!offer) return

  // Get offering ID
  const { data: offering } = await sc
    .from('offerings')
    .select('id')
    .eq('offering_key', offerKey)
    .single()

  if (!offering) return

  // Check if engagement already exists for this org + offering (prevent duplicates)
  // engagement_offerings doesn't have organization_id, so we query engagements first
  const { data: existingEngagements } = await sc
    .from('engagements')
    .select('id')
    .eq('organization_id', orgId)
  const existingEngIds = (existingEngagements || []).map(e => e.id)
  let existing: { engagement_id: string }[] | null = null
  if (existingEngIds.length > 0) {
    const { data: existingLinks } = await sc
      .from('engagement_offerings')
      .select('engagement_id')
      .in('engagement_id', existingEngIds)
      .eq('offering_id', offering.id)
    existing = existingLinks
  }

  if (existing && existing.length > 0) {
    // Engagement already exists for this offering - don't create a duplicate
    return
  }

  // Build engagement fields based on offer type
  const engagementFields: Record<string, unknown> = {
    organization_id: orgId,
    engagement_type: engagementType,
    status: 'active',
    title: offer.displayName,
    current_phase: 'discovery',
    health_status: 'on_track',
  }

  // For Blueprint, populate charter from qualification record (not Stripe metadata)
  if (offerKey === 'ai_automation_blueprint') {
    const qualRecordId = sessionMetadata?.qualification_record_id
    if (qualRecordId) {
      const { data: qualRecord } = await sc
        .from('blueprint_qualifications')
        .select('business_objective, workflow_problem, systems_involved')
        .eq('id', qualRecordId)
        .single()

      if (qualRecord) {
        engagementFields.title = qualRecord.business_objective || offer.displayName
        engagementFields.statement = qualRecord.workflow_problem || 'AI automation analysis'
        engagementFields.in_scope = qualRecord.systems_involved || null
      }
    }
    engagementFields.current_phase = 'discovery'
  }

  // For security reviews, start in scoping phase
  if (offerKey === 'saas_security_review' || offerKey === 'ai_security_compliance') {
    engagementFields.current_phase = 'scoping'
    engagementFields.statement = 'Security review of application and AI infrastructure'
  }

  // For Fractional AI Advisor, start in discovery with advisory context
  if (offerKey === 'fractional_ai_advisor') {
    engagementFields.current_phase = 'discovery'
    engagementFields.statement = 'Fractional AI Advisor — executive AI advisory engagement'
  }

  // Create engagement
  const { data: eng, error: engError } = await sc
    .from('engagements')
    .insert(engagementFields)
    .select('id')
    .single()

  if (engError || !eng) {
    console.error('Failed to create engagement:', engError?.message)
    return
  }

  // Link engagement to offering
  await sc
    .from('engagement_offerings')
    .insert({
      engagement_id: eng.id,
      offering_id: offering.id,
    })

  // For security reviews, seed coverage areas
  if (offerKey === 'saas_security_review' || offerKey === 'ai_security_compliance') {
    const coverageAreas = [
      { area_key: 'tenant_isolation', area_label: 'Tenant Isolation', display_order: 1 },
      { area_key: 'authn_authz', area_label: 'Authentication & Authorization', display_order: 2 },
      { area_key: 'data_encryption', area_label: 'Data Encryption (Rest & Transit)', display_order: 3 },
      { area_key: 'api_security', area_label: 'API Security', display_order: 4 },
      { area_key: 'ai_rag_security', area_label: 'AI / RAG / Agent Security', display_order: 5 },
      { area_key: 'secrets_management', area_label: 'Secrets & Key Management', display_order: 6 },
      { area_key: 'input_validation', area_label: 'Input Validation & Injection', display_order: 7 },
      { area_key: 'logging_monitoring', area_label: 'Logging, Monitoring & Detection', display_order: 8 },
      { area_key: 'dependency_security', area_label: 'Dependency & Supply Chain Security', display_order: 9 },
      { area_key: 'rate_limiting', area_label: 'Rate Limiting & Abuse Prevention', display_order: 10 },
      { area_key: 'incident_response', area_label: 'Incident Response Readiness', display_order: 11 },
    ]

    for (const area of coverageAreas) {
      await sc
        .from('security_coverage_areas')
        .insert({
          organization_id: orgId,
          engagement_id: eng.id,
          area_key: area.area_key,
          area_label: area.area_label,
          display_order: area.display_order,
          status: 'pending',
        })
    }
  }

  // Audit event
  await sc.rpc('write_audit_event', {
    audit_action: 'engagement.created',
    audit_entity_type: 'engagement',
    audit_org_id: orgId,
    audit_entity_id: eng.id,
    audit_metadata: { offer_key: offerKey, title: engagementFields.title } as any,
  })
}
