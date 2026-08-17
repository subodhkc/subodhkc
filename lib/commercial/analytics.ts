/**
 * Privacy-conscious conversion event tracking.
 * No sensitive client content is stored — only funnel event names and non-sensitive metadata.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export type ConversionEventName =
  | 'public_offer_viewed'
  | 'pricing_viewed'
  | 'checkout_started'
  | 'checkout_completed'
  | 'checkout_abandoned'
  | 'onboarding_started'
  | 'onboarding_completed'
  | 'included_product_activation_started'
  | 'included_product_activated'
  | 'advisor_request_created'
  | 'advisor_response_delivered'
  | 'fractional_desk_item_created'
  | 'working_session_completed'
  | 'artifact_published'
  | 'monthly_brief_published'
  | 'subscription_cancelled'
  // Advisor Desk funnel events
  | 'advisor_hero_cta_click'
  | 'advisor_checkout_started'
  | 'advisor_login_required'
  | 'advisor_org_created'
  | 'advisor_purchase_completed'
  | 'advisor_annual_selected'
  | 'advisor_context_started'
  | 'advisor_context_completed'
  | 'advisor_watchlist_created'
  | 'advisor_activation_schedule_started'
  | 'advisor_activation_scheduled'
  | 'advisor_question_submitted'
  // AI Work Order funnel
  | 'workflow_review_viewed'
  | 'workflow_review_started'
  | 'workflow_review_purchased'
  // Fractional AI Advisor funnel events
  | 'fractional_hero_cta'
  | 'fractional_discuss_fit'
  | 'fractional_checkout_started'
  | 'fractional_purchase_completed'
  | 'fractional_context_started'
  | 'fractional_context_completed'
  | 'fractional_activation_schedule_started'
  | 'fractional_activation_scheduled'
  | 'fractional_first_working_session_scheduled'
  | 'fractional_advisor_desk_lighter_cta'
  | 'fractional_architecture_scope_cta'
  | 'fractional_90_day_review_completed'
  // Cross-offer
  | 'fractional_cta_clicked'

/**
 * Track a conversion event. Non-blocking.
 * Safe to call from server-side code (API routes, webhook).
 */
export async function trackEvent(opts: {
  eventName: ConversionEventName
  organizationId?: string
  userId?: string
  offerKey?: string
  billingPeriod?: string
  sessionId?: string
  pagePath?: string
  metadata?: Record<string, any>
}): Promise<void> {
  try {
    const sc = createClient(supabaseUrl, serviceRoleKey)
    await sc.from('conversion_events').insert({
      event_name: opts.eventName,
      organization_id: opts.organizationId || null,
      user_id: opts.userId || null,
      offer_key: opts.offerKey || null,
      billing_period: opts.billingPeriod || null,
      session_id: opts.sessionId || null,
      page_path: opts.pagePath || null,
      metadata: opts.metadata || null,
    })
  } catch (err) {
    // Non-blocking — don't break the user flow for analytics
    console.error('[conversion_events] Failed to track event:', err)
  }
}
