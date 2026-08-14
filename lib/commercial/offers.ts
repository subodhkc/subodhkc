/**
 * Canonical commercial offer configuration.
 * Single source of truth for pricing, billing, and entitlement rules.
 * Do not duplicate these values in components or pages.
 */

export type OfferKey =
  | 'ai_advisor_desk'
  | 'ai_automation_blueprint'
  | 'managed_voice'
  | 'ai_security_compliance'
  | 'saas_security_review'

export type BillingMode = 'subscription' | 'one_time' | 'custom_scoped'

export interface CommercialOffer {
  key: OfferKey
  name: string
  displayName: string
  billingMode: BillingMode
  /** Monthly price in cents (USD). Null for custom-scoped. */
  monthlyPriceCents: number | null
  /** Annual price in cents (USD). Null if no annual option. */
  annualPriceCents: number | null
  /** One-time price in cents (USD). Null for subscription-only. */
  oneTimePriceCents: number | null
  /** Starting price label for display (e.g., "from $950"). */
  startingPriceLabel: string | null
  /** Max team seats for subscription offers. */
  teamSeatLimit: number | null
  /** Advisor questions allowed per billing period (monthly or annual cycle). */
  advisorQuestionsPerPeriod: number | null
  /** Landing page URL. */
  landingPage: string
  /** Whether this offer creates an engagement on purchase. */
  createsEngagement: boolean
  /** Engagement type if createsEngagement is true. */
  engagementType: string | null
  /** Whether qualification is required before checkout. */
  requiresQualification: boolean
  /** Whether an agreement (order/MSA/SOW) is required. */
  requiresAgreement: boolean
  /** Whether security review authorization is required. */
  requiresSecurityAuthorization: boolean
  /** Description for checkout session line item. */
  checkoutDescription: string
}

export const COMMERCIAL_OFFERS: Record<OfferKey, CommercialOffer> = {
  ai_advisor_desk: {
    key: 'ai_advisor_desk',
    name: 'AI Advisor Desk',
    displayName: 'AI Advisor Desk',
    billingMode: 'subscription',
    monthlyPriceCents: 9900, // $99/month
    annualPriceCents: 99000, // $990/year
    oneTimePriceCents: null,
    startingPriceLabel: '$99/month',
    teamSeatLimit: 3,
    advisorQuestionsPerPeriod: 1,
    landingPage: '/ai-advisor',
    createsEngagement: false,
    engagementType: null,
    requiresQualification: false,
    requiresAgreement: false,
    requiresSecurityAuthorization: false,
    checkoutDescription: 'AI Advisor Desk subscription — monthly advisory access',
  },

  ai_automation_blueprint: {
    key: 'ai_automation_blueprint',
    name: 'AI Automation Blueprint',
    displayName: 'AI Automation Blueprint',
    billingMode: 'one_time',
    monthlyPriceCents: null,
    annualPriceCents: null,
    oneTimePriceCents: 50000, // $500
    startingPriceLabel: '$500',
    teamSeatLimit: null,
    advisorQuestionsPerPeriod: null,
    landingPage: '/ai-automation',
    createsEngagement: true,
    engagementType: 'project',
    requiresQualification: true,
    requiresAgreement: true,
    requiresSecurityAuthorization: false,
    checkoutDescription: 'AI Automation Blueprint — fixed-scope automation analysis',
  },

  managed_voice: {
    key: 'managed_voice',
    name: 'Managed AI Voice Deployment',
    displayName: 'Managed AI Voice Deployment',
    billingMode: 'subscription',
    monthlyPriceCents: 49900, // from $499/month
    annualPriceCents: null,
    oneTimePriceCents: null,
    startingPriceLabel: 'from $499/month',
    teamSeatLimit: null,
    advisorQuestionsPerPeriod: null,
    landingPage: '/ai-voice-agent',
    createsEngagement: true,
    engagementType: 'retainer',
    requiresQualification: true,
    requiresAgreement: true,
    requiresSecurityAuthorization: false,
    checkoutDescription: 'Managed AI Voice Deployment — monthly voice automation service',
  },

  ai_security_compliance: {
    key: 'ai_security_compliance',
    name: 'AI Security & Compliance Review',
    displayName: 'AI Security & Compliance Review',
    billingMode: 'custom_scoped',
    monthlyPriceCents: null,
    annualPriceCents: null,
    oneTimePriceCents: null,
    startingPriceLabel: 'Custom scoped',
    teamSeatLimit: null,
    advisorQuestionsPerPeriod: null,
    landingPage: '/ai-security-compliance',
    createsEngagement: true,
    engagementType: 'project',
    requiresQualification: true,
    requiresAgreement: true,
    requiresSecurityAuthorization: true,
    checkoutDescription: 'AI Security & Compliance Review — scoped security assessment',
  },

  saas_security_review: {
    key: 'saas_security_review',
    name: 'SaaS & AI Security Review',
    displayName: 'SaaS & AI Security Review',
    billingMode: 'one_time',
    monthlyPriceCents: null,
    annualPriceCents: null,
    oneTimePriceCents: 95000, // from $950
    startingPriceLabel: 'from $950',
    teamSeatLimit: null,
    advisorQuestionsPerPeriod: null,
    landingPage: '/saas-security-review',
    createsEngagement: true,
    engagementType: 'project',
    requiresQualification: true,
    requiresAgreement: true,
    requiresSecurityAuthorization: true,
    checkoutDescription: 'SaaS & AI Security Review — focused application security review',
  },
}

export function getOffer(key: string): CommercialOffer | null {
  return COMMERCIAL_OFFERS[key as OfferKey] ?? null
}

export function getOfferByStripePriceId(priceId: string): CommercialOffer | null {
  for (const offer of Object.values(COMMERCIAL_OFFERS)) {
    if (
      offer.monthlyPriceCents !== null &&
      process.env[`STRIPE_PRICE_${offer.key.toUpperCase()}_MONTHLY`] === priceId
    ) {
      return offer
    }
    if (
      offer.annualPriceCents !== null &&
      process.env[`STRIPE_PRICE_${offer.key.toUpperCase()}_ANNUAL`] === priceId
    ) {
      return offer
    }
    if (
      offer.oneTimePriceCents !== null &&
      process.env[`STRIPE_PRICE_${offer.key.toUpperCase()}_ONETIME`] === priceId
    ) {
      return offer
    }
  }
  return null
}

/**
 * Get the Stripe price ID for an offer and billing period.
 * Reads from environment variables.
 */
export function getStripePriceId(
  offerKey: OfferKey,
  period: 'monthly' | 'annual' | 'one_time'
): string | null {
  const envKey = `STRIPE_PRICE_${offerKey.toUpperCase()}_${period.toUpperCase()}`
  return process.env[envKey] ?? null
}

/**
 * Compute the current billing period key for advisor questions.
 * Format: YYYY-MM (e.g., "2026-08")
 */
export function getCurrentBillingPeriodKey(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}
