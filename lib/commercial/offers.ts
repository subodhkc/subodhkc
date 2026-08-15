/**
 * Canonical commercial offer configuration.
 * Single source of truth for pricing, billing, and entitlement rules.
 * Do not duplicate these values in components or pages.
 */

export type OfferKey =
  | 'ai_advisor_desk'
  | 'ai_automation_blueprint'
  | 'fractional_ai_advisor'
  | 'managed_voice'
  | 'ai_security_compliance'
  | 'saas_security_review'

export type BillingMode = 'subscription' | 'one_time' | 'custom_scoped'

/**
 * Included product entitlement spec for advisory offers.
 * This is the canonical source of truth for what HAIEC/Kestrel access
 * each advisory subscription grants. Do not duplicate in marketing copy
 * or checkout metadata without referencing this.
 */
export interface IncludedProductAccess {
  /** HAIEC entitlement tier key, or null if no HAIEC access. */
  haiecTier: 'advisor_essentials' | 'scan' | null
  /** HAIEC seat count. */
  haiecSeats: number
  /** Kestrel plan key, or null if no Kestrel access. */
  kestrelPlan: 'ai_number_basic' | 'kestrel_standard' | null
  /** Kestrel monthly credits. */
  kestrelCredits: number
  /** Whether SubodhKC Member Tools are included. */
  memberTools: boolean
}

export interface ServiceTermsRef {
  /** Service schedule slug (e.g., 'ai-advisor-for-business', 'fractional-ai-advisor'). */
  scheduleSlug: string
  /** Current version label of the service schedule. */
  version: string
}

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
  /** Advisor questions allowed per billing period. Null = no hard quota (reasonable use model). */
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
  /** Included product access (HAIEC, Kestrel, Member Tools). Null for non-advisory offers. */
  includedProducts: IncludedProductAccess | null
  /** Service terms schedule reference. Null for non-advisory offers. */
  serviceTerms: ServiceTermsRef | null
  /** Concise checkout bullet list (canonical — use in checkout UI and pricing cards). */
  checkoutBullets: string[]
}

export const COMMERCIAL_OFFERS: Record<OfferKey, CommercialOffer> = {
  ai_advisor_desk: {
    key: 'ai_advisor_desk',
    name: 'AI Advisor Desk',
    displayName: 'AI Advisor for Business',
    billingMode: 'subscription',
    monthlyPriceCents: 9900, // $99/month
    annualPriceCents: 99000, // $990/year
    oneTimePriceCents: null,
    startingPriceLabel: '$99/month',
    teamSeatLimit: 3,
    advisorQuestionsPerPeriod: null,
    landingPage: '/ai-advisor',
    createsEngagement: false,
    engagementType: null,
    requiresQualification: false,
    requiresAgreement: false,
    requiresSecurityAuthorization: false,
    checkoutDescription: 'AI Advisor for Business subscription — ongoing human AI advisory, weekly intelligence, and human advisory access',
    includedProducts: {
      haiecTier: 'advisor_essentials',
      haiecSeats: 1,
      kestrelPlan: 'ai_number_basic',
      kestrelCredits: 20,
      memberTools: true,
    },
    serviceTerms: {
      scheduleSlug: 'ai-advisor-for-business',
      version: '2026-08',
    },
    checkoutBullets: [
      'Human AI advisory access',
      'Weekly AI intelligence brief',
      'AI Controls + regulatory monitoring',
      'Opportunity and vendor guidance',
      'HAIEC Advisor Essentials',
      'Kestrel AI Number Basic',
      'Selected Member Tools',
      'Up to 3 team members',
    ],
  },

  ai_automation_blueprint: {
    key: 'ai_automation_blueprint',
    name: 'AI Automation Blueprint',
    displayName: 'AI Opportunity & Workflow Assessment',
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
    checkoutDescription: 'AI Opportunity & Workflow Assessment — fixed-scope assessment with AI Automation Blueprint deliverable',
    includedProducts: null,
    serviceTerms: null,
    checkoutBullets: [],
  },

  fractional_ai_advisor: {
    key: 'fractional_ai_advisor',
    name: 'Fractional AI Advisor',
    displayName: 'Fractional AI Advisor',
    billingMode: 'subscription',
    monthlyPriceCents: 125000, // $1,250/month
    annualPriceCents: 1250000, // $12,500/year
    oneTimePriceCents: null,
    startingPriceLabel: '$1,250/month',
    teamSeatLimit: 5,
    advisorQuestionsPerPeriod: null,
    landingPage: '/advisory',
    createsEngagement: true,
    engagementType: 'retainer',
    requiresQualification: false,
    requiresAgreement: false,
    requiresSecurityAuthorization: false,
    checkoutDescription: 'Fractional AI Advisor — executive AI advisory subscription',
    includedProducts: {
      haiecTier: 'scan',
      haiecSeats: 1,
      kestrelPlan: 'kestrel_standard',
      kestrelCredits: 150,
      memberTools: true,
    },
    serviceTerms: {
      scheduleSlug: 'fractional-ai-advisor',
      version: '2026-08',
    },
    checkoutBullets: [
      'Two 60-minute working sessions/month',
      'Priority async advisory',
      'Decision + Opportunity Workspace',
      'Monthly Decision & Opportunity Brief',
      'Vendor, roadmap + architecture review',
      'Selected decision artifacts',
      'HAIEC SCAN access',
      'Kestrel Standard (150 credits/mo)',
      'Member Tool Library',
    ],
  },

  managed_voice: {
    key: 'managed_voice',
    name: 'Managed AI Voice Deployment',
    displayName: 'Managed AI Voice Deployment',
    billingMode: 'custom_scoped',
    monthlyPriceCents: null,
    annualPriceCents: null,
    oneTimePriceCents: null,
    startingPriceLabel: null,
    teamSeatLimit: null,
    advisorQuestionsPerPeriod: null,
    landingPage: '/ai-voice-agent',
    createsEngagement: true,
    engagementType: 'retainer',
    requiresQualification: true,
    requiresAgreement: true,
    requiresSecurityAuthorization: false,
    checkoutDescription: 'Managed AI Voice Deployment — monthly voice automation service',
    includedProducts: null,
    serviceTerms: null,
    checkoutBullets: [],
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
    includedProducts: null,
    serviceTerms: null,
    checkoutBullets: [],
  },

  saas_security_review: {
    key: 'saas_security_review',
    name: 'SaaS & AI Security Review',
    displayName: 'SaaS & AI Security Review',
    billingMode: 'custom_scoped',
    monthlyPriceCents: null,
    annualPriceCents: null,
    oneTimePriceCents: null,
    startingPriceLabel: null,
    teamSeatLimit: null,
    advisorQuestionsPerPeriod: null,
    landingPage: '/saas-security-review',
    createsEngagement: true,
    engagementType: 'project',
    requiresQualification: true,
    requiresAgreement: true,
    requiresSecurityAuthorization: true,
    checkoutDescription: 'SaaS & AI Security Review — focused application security review',
    includedProducts: null,
    serviceTerms: null,
    checkoutBullets: [],
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
      process.env[`STRIPE_PRICE_${offer.key.toUpperCase()}_ONE_TIME`] === priceId
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

/**
 * Get the included product access spec for an offer.
 * Returns null for offers that do not include HAIEC/Kestrel/Member Tools.
 */
export function getIncludedProducts(offerKey: OfferKey): IncludedProductAccess | null {
  return COMMERCIAL_OFFERS[offerKey]?.includedProducts ?? null
}

/**
 * Get the service terms schedule reference for an offer.
 * Returns null for offers that do not have a service schedule.
 */
export function getServiceTerms(offerKey: OfferKey): ServiceTermsRef | null {
  return COMMERCIAL_OFFERS[offerKey]?.serviceTerms ?? null
}

/**
 * Get the canonical checkout bullet list for an offer.
 */
export function getCheckoutBullets(offerKey: OfferKey): string[] {
  return COMMERCIAL_OFFERS[offerKey]?.checkoutBullets ?? []
}
