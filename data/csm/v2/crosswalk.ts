/**
 * CSM 2.0 Informative Crosswalk to NIST AI RMF and ISO/IEC 42001
 *
 * This is an informative crosswalk, NOT:
 * - equivalence
 * - certification
 * - compliance guarantee
 *
 * Uses public high-level functions/concepts and citation references.
 * Does not duplicate copyrighted standard text.
 */

export interface CrosswalkEntry {
  csmComponentId: string
  csmDomain: string
  nistFunction: string
  nistReference: string
  isoClause: string
  isoReference: string
  relationship: 'supports' | 'partially-maps' | 'informative'
  notes: string
}

export const nistIsoCrosswalk: CrosswalkEntry[] = [
  {
    csmComponentId: 'ENT-POLICY',
    csmDomain: 'Enterprise',
    nistFunction: 'Govern',
    nistReference: 'NIST AI RMF 1.0 - Govern (GV): Policies, procedures, processes, and practices',
    isoClause: 'Clause 5 - Organizational context, Clause 6 - Planning',
    isoReference: 'ISO/IEC 42001:2023 - Context and leadership',
    relationship: 'supports',
    notes: 'CSM Policy Framework establishes organizational AI policies. NIST Govern and ISO Clauses 5-6 address organizational context and policy establishment.',
  },
  {
    csmComponentId: 'ENT-RISK',
    csmDomain: 'Enterprise',
    nistFunction: 'Map',
    nistReference: 'NIST AI RMF 1.0 - Map (MP): Context and risk identification',
    isoClause: 'Clause 6.1 - Actions to address risks and opportunities',
    isoReference: 'ISO/IEC 42001:2023 - Risk-based planning',
    relationship: 'supports',
    notes: 'CSM Risk Assessment identifies AI-specific risks. NIST Map and ISO 6.1 address risk identification and treatment.',
  },
  {
    csmComponentId: 'ENT-DATA',
    csmDomain: 'Enterprise',
    nistFunction: 'Map',
    nistReference: 'NIST AI RMF 1.0 - Map (MP.2.2): Data provenance and quality',
    isoClause: 'Clause 7.3 - Data for AI systems',
    isoReference: 'ISO/IEC 42001:2023 - Data management',
    relationship: 'partially-maps',
    notes: 'CSM Data Stewardship covers data governance. NIST and ISO address data quality and provenance at the system level.',
  },
  {
    csmComponentId: 'ENT-MANDATE',
    csmDomain: 'Enterprise',
    nistFunction: 'Govern',
    nistReference: 'NIST AI RMF 1.0 - Govern (GV.2): Accountability structures',
    isoClause: 'Clause 5.3 - Roles, responsibilities and authorities',
    isoReference: 'ISO/IEC 42001:2023 - Leadership and accountability',
    relationship: 'supports',
    notes: 'CSM Strategic Mandate defines accountability. NIST and ISO address accountability structures.',
  },
  {
    csmComponentId: 'PRJ-BUSINESS',
    csmDomain: 'Project',
    nistFunction: 'Map',
    nistReference: 'NIST AI RMF 1.0 - Map (MP.1): Context establishment',
    isoClause: 'Clause 8.1 - Operational planning and control',
    isoReference: 'ISO/IEC 42001:2023 - AI system operational planning',
    relationship: 'partially-maps',
    notes: 'CSM Business Case defines the project hypothesis. NIST Map establishes context. ISO 8.1 addresses operational planning.',
  },
  {
    csmComponentId: 'PRJ-TESTING',
    csmDomain: 'Project',
    nistFunction: 'Measure',
    nistReference: 'NIST AI RMF 1.0 - Measure (MS): Assessing and tracking AI risks',
    isoClause: 'Clause 8.3 - AI system impact assessment',
    isoReference: 'ISO/IEC 42001:2023 - Impact assessment and testing',
    relationship: 'supports',
    notes: 'CSM Controlled Testing evaluates risks before scale. NIST Measure tracks and assesses. ISO 8.3 requires impact assessment.',
  },
  {
    csmComponentId: 'PRJ-SCALE',
    csmDomain: 'Project',
    nistFunction: 'Manage',
    nistReference: 'NIST AI RMF 1.0 - Manage (MG): Responding to AI risks',
    isoClause: 'Clause 8.4 - AI system change management',
    isoReference: 'ISO/IEC 42001:2023 - Change and deployment management',
    relationship: 'partially-maps',
    notes: 'CSM Scale Decision is a governance gate. NIST Manage responds to risks. ISO 8.4 addresses change management.',
  },
  {
    csmComponentId: 'PRJ-PLAYBOOK',
    csmDomain: 'Project',
    nistFunction: 'Govern',
    nistReference: 'NIST AI RMF 1.0 - Govern (GV.3): Documentation and transparency',
    isoClause: 'Clause 7.5 - Documented information',
    isoReference: 'ISO/IEC 42001:2023 - Documentation requirements',
    relationship: 'supports',
    notes: 'CSM Playbook transfers knowledge. NIST and ISO address documentation and transparency.',
  },
  {
    csmComponentId: 'CODE-STANDARDS',
    csmDomain: 'Code',
    nistFunction: 'Manage',
    nistReference: 'NIST AI RMF 1.0 - Manage (MG.2): Enhancing AI system quality',
    isoClause: 'Clause 8.2 - AI system development controls',
    isoReference: 'ISO/IEC 42001:2023 - Development controls',
    relationship: 'supports',
    notes: 'CSM Development Standards govern AI-assisted code. NIST and ISO address development controls.',
  },
  {
    csmComponentId: 'CODE-SECURITY',
    csmDomain: 'Code',
    nistFunction: 'Measure',
    nistReference: 'NIST AI RMF 1.0 - Measure (MS.2.8): Security and robustness',
    isoClause: 'Clause 8.2 - AI system development controls (security)',
    isoReference: 'ISO/IEC 42001:2023 - Security in development',
    relationship: 'supports',
    notes: 'CSM Security Protocols address AI-generated code vulnerabilities. NIST and ISO address security testing.',
  },
  {
    csmComponentId: 'CODE-HUMAN',
    csmDomain: 'Code',
    nistFunction: 'Manage',
    nistReference: 'NIST AI RMF 1.0 - Manage (MG.3): Human-AI configuration',
    isoClause: 'Clause 8.3 - Human oversight',
    isoReference: 'ISO/IEC 42001:2023 - Human oversight requirements',
    relationship: 'supports',
    notes: 'CSM Human Oversight ensures proportionate review. NIST and ISO address human-AI configuration and oversight.',
  },
  {
    csmComponentId: 'CODE-TRACE',
    csmDomain: 'Code',
    nistFunction: 'Measure',
    nistReference: 'NIST AI RMF 1.0 - Measure (MS.2.10): Tracking and logging',
    isoClause: 'Clause 7.5 - Documented information (records)',
    isoReference: 'ISO/IEC 42001:2023 - Records and traceability',
    relationship: 'supports',
    notes: 'CSM Traceability Logging records AI-assisted changes. NIST and ISO address logging and records.',
  },
  {
    csmComponentId: 'UX-IMPACT',
    csmDomain: 'UX',
    nistFunction: 'Map',
    nistReference: 'NIST AI RMF 1.0 - Map (MP.3): Potential impacts',
    isoClause: 'Clause 8.3 - AI system impact assessment',
    isoReference: 'ISO/IEC 42001:2023 - Impact assessment',
    relationship: 'supports',
    notes: 'CSM Impact Analysis assesses effects on individuals. NIST Map addresses potential impacts. ISO 8.3 requires impact assessment.',
  },
  {
    csmComponentId: 'UX-EXPLAIN',
    csmDomain: 'UX',
    nistFunction: 'Manage',
    nistReference: 'NIST AI RMF 1.0 - Manage (MG.3.2): Transparency and explainability',
    isoClause: 'Clause 8.5 - Transparency and information for users',
    isoReference: 'ISO/IEC 42001:2023 - Transparency requirements',
    relationship: 'supports',
    notes: 'CSM Explainability Design addresses user understanding. NIST and ISO address transparency.',
  },
  {
    csmComponentId: 'UX-CAPABILITY',
    csmDomain: 'UX',
    nistFunction: 'Govern',
    nistReference: 'NIST AI RMF 1.0 - Govern (GV.4): Workforce development',
    isoClause: 'Clause 7.2 - Competence and training',
    isoReference: 'ISO/IEC 42001:2023 - Competence requirements',
    relationship: 'partially-maps',
    notes: 'CSM Capability Development builds user skills. NIST addresses workforce. ISO addresses competence and training.',
  },
  {
    csmComponentId: 'UX-ADOPTION',
    csmDomain: 'UX',
    nistFunction: 'Measure',
    nistReference: 'NIST AI RMF 1.0 - Measure (MS.3): Feedback and monitoring',
    isoClause: 'Clause 9.1 - Monitoring, measurement, analysis and evaluation',
    isoReference: 'ISO/IEC 42001:2023 - Monitoring and evaluation',
    relationship: 'supports',
    notes: 'CSM Adoption Measurement monitors usage and feedback. NIST Measure addresses monitoring. ISO 9.1 requires monitoring.',
  },
]

export const crosswalkDisclaimer =
  'This crosswalk is informative. It does not constitute equivalence, certification, or a compliance guarantee. CSM 2.0 is an independent governance methodology. NIST AI RMF and ISO/IEC 42001 are separate frameworks with their own scopes, definitions and requirements. Organizations seeking certification or compliance with NIST or ISO should consult the original standards and qualified assessors.'
