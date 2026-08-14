/**
 * Canonical Commercial Offer Pricing
 *
 * Single source of truth for public offer pricing across the site.
 * Import from this file instead of hardcoding prices in page components.
 */

export interface CommercialOffer {
  id: string
  name: string
  route: string
  pricingLabel: string
  pricingDetail: string
  annualLabel?: string
  description: string
  category: 'primary' | 'specific' | 'enterprise'
}

export const commercialOffers: CommercialOffer[] = [
  {
    id: 'advisor-desk',
    name: 'AI Advisor Desk',
    route: '/ai-advisor',
    pricingLabel: '$99/month',
    annualLabel: '$990/year',
    pricingDetail: 'Up to 3 team members. Cancel anytime.',
    description: 'Ongoing AI guidance, controls review, regulatory monitoring, and recommended next actions.',
    category: 'primary',
  },
  {
    id: 'automation-blueprint',
    name: 'AI Automation Blueprint',
    route: '/ai-automation',
    pricingLabel: '$500 fixed',
    pricingDetail: 'One workflow analyzed. Written Blueprint with buy/configure/build recommendation.',
    description: 'A fixed-scope assessment of one business workflow with automation recommendations, architecture, and implementation roadmap.',
    category: 'primary',
  },
  {
    id: 'voice-agent',
    name: 'AI Voice Agent',
    route: '/ai-voice-agent',
    pricingLabel: 'from $499/month',
    pricingDetail: 'Standard and custom workflows. Fit call determines path.',
    description: 'Managed AI voice deployment. Standard: answering, FAQ, routing, booking. Custom: CRM, dispatch, multi-system workflows.',
    category: 'specific',
  },
  {
    id: 'security-compliance',
    name: 'AI Security & Compliance',
    route: '/ai-security-compliance',
    pricingLabel: 'Custom scoped',
    pricingDetail: 'Scoped to your architecture and regulatory environment.',
    description: 'AI security assessment, compliance review, vendor risk, hiring bias, and evidence-grade documentation.',
    category: 'specific',
  },
  {
    id: 'saas-security',
    name: 'SaaS & AI Security Review',
    route: '/saas-security-review',
    pricingLabel: 'from $950',
    pricingDetail: 'Multi-tenant, AI/RAG and broader reviews scoped to architecture. Remediation & Retest scoped from findings.',
    description: 'Tenant isolation, AI application security, reproducible evidence, and buyer-shareable security records.',
    category: 'specific',
  },
  {
    id: 'fractional-advisor',
    name: 'Fractional AI Advisor / Lead',
    route: '/advisory',
    pricingLabel: 'Custom scoped',
    pricingDetail: 'Direct human advisory and embedded leadership for enterprises.',
    description: 'Fractional AI Advisor for ongoing direct judgment. Fractional AI Lead for embedded ownership and leadership.',
    category: 'enterprise',
  },
]

export const primaryOffers = commercialOffers.filter((o) => o.category === 'primary')
export const specificOffers = commercialOffers.filter((o) => o.category === 'specific')
export const enterpriseOffers = commercialOffers.filter((o) => o.category === 'enterprise')

export function getOffer(id: string): CommercialOffer | undefined {
  return commercialOffers.find((o) => o.id === id)
}
