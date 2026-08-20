/**
 * Canonical Product Fact Registry
 *
 * Single source of truth for product-level facts that multiple surfaces
 * (marketing pages, legal pages, structured data, AI/LLM files, emails)
 * must agree with.
 *
 * This is NOT a CMS. It does not store page-specific prose.
 * It stores only the atomic facts that must be consistent everywhere.
 *
 * Pricing and entitlement details live in lib/commercial/offers.ts.
 * This registry references those values and adds product-level metadata
 * (relationship type, eligibility rules, forbidden claims).
 */

import { COMMERCIAL_OFFERS, type OfferKey } from './offers'

// ─── Types ───────────────────────────────────────────────────────────

export type ProductCategory = 'relationship' | 'transaction' | 'custom_scoped'

export interface ProductFact {
  /** Canonical key matching OfferKey in offers.ts */
  key: OfferKey
  /** Customer-visible product name (what appears on public pages) */
  publicName: string
  /** Internal/historical name (for code references, not customer-facing) */
  internalName: string
  /** Category: relationship = ongoing, transaction = bounded, custom_scoped = bespoke */
  category: ProductCategory
  /** Primary price label for display (e.g., "$99/month", "$500", "Custom scoped") */
  priceLabel: string
  /** Whether this product requires an active Advisor/Fractional relationship */
  requiresActiveRelationship: boolean
  /** Whether trialing status is sufficient for eligibility */
  trialingEligible: boolean
  /** Short factual description (1-2 sentences, no marketing language) */
  factualDescription: string
  /** Canonical landing page route */
  landingPage: string
  /** Service terms route (if applicable) */
  serviceTermsRoute: string | null
  /** Whether this product has a fixed public price */
  hasFixedPrice: boolean
}

// ─── Product Facts ───────────────────────────────────────────────────

export const PRODUCT_FACTS: Record<OfferKey, ProductFact> = {
  ai_advisor_desk: {
    key: 'ai_advisor_desk',
    publicName: 'AI Advisor for Business',
    internalName: 'AI Advisor Desk',
    category: 'relationship',
    priceLabel: '$99/month',
    requiresActiveRelationship: false,
    trialingEligible: true,
    factualDescription:
      'Ongoing human AI advisory subscription. Weekly intelligence, monthly point of view, human-reviewed email advisory. Up to 3 service seats. Organization membership is not limited to 3.',
    landingPage: '/ai-advisor',
    serviceTermsRoute: '/service-terms/ai-advisor-for-business',
    hasFixedPrice: true,
  },

  ai_automation_blueprint: {
    key: 'ai_automation_blueprint',
    publicName: 'AI Work Order',
    internalName: 'AI Work Order',
    category: 'transaction',
    priceLabel: '$500',
    requiresActiveRelationship: true,
    trialingEligible: false,
    factualDescription:
      'One defined outcome. Scoped before work begins. $500 standard. One bounded piece of work. Available through an active AI Advisor or Fractional AI Advisor relationship. Trialing status is not sufficient for eligibility.',
    landingPage: '/ai-automation',
    serviceTermsRoute: null,
    hasFixedPrice: true,
  },

  fractional_ai_advisor: {
    key: 'fractional_ai_advisor',
    publicName: 'Fractional AI Advisor',
    internalName: 'Fractional AI Advisor',
    category: 'relationship',
    priceLabel: '$1,250/month',
    requiresActiveRelationship: false,
    trialingEligible: true,
    factualDescription:
      'Executive AI advisory subscription. Two monthly working sessions, priority async advisory, decision and opportunity workspace. For organizations with multiple interconnected AI decisions.',
    landingPage: '/advisory',
    serviceTermsRoute: '/service-terms/fractional-ai-advisor',
    hasFixedPrice: true,
  },

  managed_voice: {
    key: 'managed_voice',
    publicName: 'Managed AI Voice Deployment',
    internalName: 'Managed AI Voice Deployment',
    category: 'custom_scoped',
    priceLabel: 'Custom scoped',
    requiresActiveRelationship: false,
    trialingEligible: false,
    factualDescription:
      'Managed AI voice agent deployment. Calls, intake, booking, and escalation. Custom scoped based on requirements.',
    landingPage: '/ai-voice-agent',
    serviceTermsRoute: null,
    hasFixedPrice: false,
  },

  ai_security_compliance: {
    key: 'ai_security_compliance',
    publicName: 'AI Security & Compliance Review',
    internalName: 'AI Security & Compliance Review',
    category: 'custom_scoped',
    priceLabel: 'Custom scoped',
    requiresActiveRelationship: false,
    trialingEligible: false,
    factualDescription:
      'AI security assessment, controls review, vendor risk, and audit-ready documentation. Custom scoped.',
    landingPage: '/ai-security-compliance',
    serviceTermsRoute: null,
    hasFixedPrice: false,
  },

  saas_security_review: {
    key: 'saas_security_review',
    publicName: 'SaaS & AI Security Review',
    internalName: 'SaaS & AI Security Review',
    category: 'custom_scoped',
    priceLabel: 'Custom scoped',
    requiresActiveRelationship: false,
    trialingEligible: false,
    factualDescription:
      'Tenant isolation and AI application security review for B2B SaaS and AI-built products. Custom scoped.',
    landingPage: '/saas-security-review',
    serviceTermsRoute: null,
    hasFixedPrice: false,
  },
}

// ─── Forbidden Claims ────────────────────────────────────────────────

/**
 * Claims that must NEVER appear on any surface.
 * CI tests should check for these strings in public-facing files.
 */
export const FORBIDDEN_CLAIMS = [
  'AI chat',
  'third-party analytics',
  'IP address capture',
  'IP-derived identity',
  'COPPA compliance',
  'FERPA compliance',
  'legal counsel reviewed',
  'Sovereign AI Pragmatist',
  'Defensive AI Architecture',
] as const

/**
 * Legacy terms that should not appear in customer-facing copy
 * but may remain in internal code, database keys, or analytics event names.
 */
export const LEGACY_TERMS_IN_PUBLIC_COPY = [
  'Blueprint',
  'AI Opportunity Assessment',
  'AI Automation Blueprint',
] as const

// ─── Validation Helpers ──────────────────────────────────────────────

/**
 * Get a product fact by offer key.
 */
export function getProductFact(key: OfferKey): ProductFact {
  return PRODUCT_FACTS[key]
}

/**
 * Get all products in a category.
 */
export function getProductsByCategory(category: ProductCategory): ProductFact[] {
  return Object.values(PRODUCT_FACTS).filter((f) => f.category === category)
}

/**
 * Get all relationship-type products (ongoing advisory).
 */
export function getRelationshipProducts(): ProductFact[] {
  return getProductsByCategory('relationship')
}

/**
 * Get all transaction-type products (bounded work).
 */
export function getTransactionProducts(): ProductFact[] {
  return getProductsByCategory('transaction')
}

/**
 * Verify that the product fact registry is consistent with the offers registry.
 * Returns an array of discrepancies (empty = consistent).
 */
export function validateRegistryConsistency(): string[] {
  const errors: string[] = []

  for (const key of Object.keys(PRODUCT_FACTS) as OfferKey[]) {
    const fact = PRODUCT_FACTS[key]
    const offer = COMMERCIAL_OFFERS[key]

    if (!offer) {
      errors.push(`Product fact "${key}" has no matching offer in COMMERCIAL_OFFERS`)
      continue
    }

    // Check landing page consistency
    if (fact.landingPage !== offer.landingPage) {
      errors.push(
        `Landing page mismatch for "${key}": product-facts says "${fact.landingPage}", offers says "${offer.landingPage}"`
      )
    }

    // Check service terms consistency
    const offerTermsRoute = offer.serviceTerms
      ? `/service-terms/${offer.serviceTerms.scheduleSlug}`
      : null
    if (fact.serviceTermsRoute !== offerTermsRoute) {
      errors.push(
        `Service terms route mismatch for "${key}": product-facts says "${fact.serviceTermsRoute}", offers says "${offerTermsRoute}"`
      )
    }

    // Check price label consistency for fixed-price products
    if (fact.hasFixedPrice && offer.startingPriceLabel) {
      const offerLabel = offer.startingPriceLabel
      if (fact.priceLabel !== offerLabel) {
        errors.push(
          `Price label mismatch for "${key}": product-facts says "${fact.priceLabel}", offers says "${offerLabel}"`
        )
      }
    }
  }

  return errors
}

/**
 * Check if a string contains any forbidden claims.
 * Returns the matching forbidden terms (empty = clean).
 */
export function findForbiddenClaims(text: string): string[] {
  const lower = text.toLowerCase()
  return FORBIDDEN_CLAIMS.filter((claim) => lower.includes(claim.toLowerCase()))
}

/**
 * Check if a string contains legacy terms that should not appear
 * in customer-facing copy.
 */
export function findLegacyTermsInPublicCopy(text: string): string[] {
  return LEGACY_TERMS_IN_PUBLIC_COPY.filter((term) => text.includes(term))
}

/**
 * Check if a product key requires an active (non-trialing) relationship
 * for eligibility.
 */
export function requiresActiveRelationshipForKey(key: OfferKey): boolean {
  return PRODUCT_FACTS[key]?.requiresActiveRelationship ?? false
}
