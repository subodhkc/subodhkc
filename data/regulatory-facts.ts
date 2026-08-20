/**
 * Canonical Regulatory Fact Registry
 *
 * Single source of truth for regulatory facts (effective dates, penalties,
 * enforcement bodies, cure periods) used across /guides, /webinar,
 * /does-texas-ai-law-apply-to-my-business, /ai-security-compliance, and llms.txt.
 *
 * This registry exists to prevent fact drift across surfaces. When a date,
 * penalty figure, or enforcement body changes, update it here and all
 * consuming pages should reference this source.
 */

export interface RegulatoryFact {
  id: string
  regulation: string
  citation: string
  effectiveDate: string
  enforcementBody: string
  penalties: string
  curePeriod: string
  scope: string
  keyProvisions: string[]
  sourcePage: string
  lastVerified: string
}

export const regulatoryFacts: RegulatoryFact[] = [
  {
    id: 'RF-001',
    regulation: 'Texas Responsible AI Governance Act (TRAIGA)',
    citation: 'Texas Business & Commerce Code Chapters 551-554, HB 149',
    effectiveDate: 'January 1, 2026',
    enforcementBody: 'Texas Attorney General (exclusive)',
    penalties: '$10K-$12K curable, $80K-$200K uncurable per violation',
    curePeriod: '60 days after AG written notice',
    scope: 'Any entity with a Texas nexus (does business in Texas, produces products/services used by TX residents, or develops/deploys AI in Texas)',
    keyProvisions: [
      'Prohibited AI practices (harm, crime, discrimination, illegal content)',
      'Healthcare AI disclosure requirements',
      'Biometric compliance under Chapter 553',
      'Regulatory sandbox up to 36 months',
      'NIST AI RMF good-faith compliance as defense',
      'No private right of action',
      'No small-business exemption',
      'No general registration requirement',
    ],
    sourcePage: '/guides/texas-ai-law',
    lastVerified: '2026-07-15',
  },
  {
    id: 'RF-002',
    regulation: 'EU AI Act',
    citation: 'EU Regulation 2024/1689',
    effectiveDate: 'August 1, 2024 (entered into force); high-risk obligations August 2, 2026 (staged through August 2, 2027)',
    enforcementBody: 'National AI authorities + EU AI Office',
    penalties: 'Up to EUR 35M or 7% of global annual turnover',
    curePeriod: 'None',
    scope: 'All AI systems placed on the EU market (extraterritorial)',
    keyProvisions: [
      'Risk-based classification (unacceptable, high, limited, minimal)',
      'High-risk AI system obligations from August 2, 2026',
      'Conformity assessment requirements',
      'Article 9 risk management system',
      'Article 10 & 11 data governance and record-keeping',
      'Transparency obligations for limited-risk AI',
      'Staged implementation through August 2, 2027',
    ],
    sourcePage: '/guides/eu-ai-act',
    lastVerified: '2026-07-15',
  },
  {
    id: 'RF-003',
    regulation: 'NYC Local Law 144',
    citation: 'NYC Administrative Code, Local Law 144 of 2021',
    effectiveDate: 'July 5, 2023 (active enforcement)',
    enforcementBody: 'NYC Department of Consumer and Worker Protection (DCWP)',
    penalties: '$500 first violation, $1,500 subsequent, per day',
    curePeriod: 'None',
    scope: 'Automated Employment Decision Tools (AEDTs) used for NYC-based positions',
    keyProvisions: [
      'Annual independent third-party bias audit',
      'Candidate notice 10 business days before use',
      'Audit summary publication requirements',
      'No exemptions for small employers',
      'Active enforcement with violations being issued',
    ],
    sourcePage: '/guides/nyc-local-law-144',
    lastVerified: '2026-07-15',
  },
]

/**
 * Convenience: lookup by regulation short name
 */
export function getRegulatoryFact(regulation: string): RegulatoryFact | undefined {
  const lower = regulation.toLowerCase()
  return regulatoryFacts.find(
    (f) =>
      f.regulation.toLowerCase().includes(lower) ||
      f.citation.toLowerCase().includes(lower)
  )
}

/**
 * All regulations referenced in the webinar
 */
export const webinarRegulations = ['EU AI Act', 'NIST AI RMF', 'NYC LL144', 'TRAIGA']
