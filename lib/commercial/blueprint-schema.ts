/**
 * Canonical Blueprint Qualification Schema
 *
 * Shared between frontend, API, DB mapping, fit logic, and tests.
 * This is the single source of truth for Blueprint qualification field names.
 *
 * DB column mapping (legacy → canonical):
 *   workflow_problem  → opportunity_or_problem
 *   team_functions    → team_context
 *   All others share the same name.
 */

export interface BlueprintQualification {
  business_objective: string
  opportunity_or_problem: string
  current_process: string
  systems_involved: string
  team_context: string
  desired_outcome: string
  sensitive_data: boolean
  timeline: string
}

export type FitDecision = 'standard_blueprint' | 'expanded_scope_review' | 'not_a_fit'

export interface FitResult {
  decision: FitDecision
  reason: string
}

/**
 * Qualification field definitions for frontend intake forms.
 * Ordered for opportunity-first framing.
 */
export const QUALIFICATION_FIELDS = [
  {
    key: 'business_objective',
    label: 'What business outcome are you trying to improve?',
    placeholder: 'e.g., reduce customer onboarding time, eliminate manual data entry, scale without hiring',
    required: true,
  },
  {
    key: 'opportunity_or_problem',
    label: 'What opportunity or problem prompted this?',
    placeholder: 'e.g., team spends 10 hours/week on manual review, customers complain about response time',
    required: true,
  },
  {
    key: 'current_process',
    label: 'How does the process work today?',
    placeholder: 'e.g., intake form → manual review → spreadsheet → email notification',
    required: false,
  },
  {
    key: 'systems_involved',
    label: 'What tools or systems are involved?',
    placeholder: 'e.g., HubSpot, QuickBooks, Google Sheets, internal app',
    required: false,
  },
  {
    key: 'team_context',
    label: 'How many people touch this process?',
    placeholder: 'e.g., 2-5, 6-10, 10+',
    required: false,
  },
  {
    key: 'desired_outcome',
    label: 'What outcome would make this Blueprint valuable?',
    placeholder: 'e.g., reduce manual hours by 50%, eliminate errors, scale without adding headcount',
    required: false,
  },
  {
    key: 'sensitive_data',
    label: 'Does this involve sensitive data (PII, PHI, financial, credentials)?',
    placeholder: 'e.g., yes, no, not sure',
    required: false,
  },
  {
    key: 'timeline',
    label: 'What is your timeline for acting on the Blueprint?',
    placeholder: 'e.g., immediately, 1-3 months, exploring',
    required: false,
  },
] as const

export const REQUIRED_FIELDS = QUALIFICATION_FIELDS.filter(f => f.required).map(f => f.key)
export const MIN_REQUIRED_FILLED = 2

/**
 * Parse and validate raw form responses into canonical BlueprintQualification.
 * Accepts the canonical field keys directly.
 * Returns null if required fields are missing.
 */
export function parseQualification(
  raw: Record<string, string>
): BlueprintQualification | null {
  const filled = REQUIRED_FIELDS.every(
    key => (raw[key] || '').trim().length >= 3
  )
  if (!filled) return null

  return {
    business_objective: (raw.business_objective || '').trim(),
    opportunity_or_problem: (raw.opportunity_or_problem || '').trim(),
    current_process: (raw.current_process || '').trim(),
    systems_involved: (raw.systems_involved || '').trim(),
    team_context: (raw.team_context || '').trim(),
    desired_outcome: (raw.desired_outcome || '').trim(),
    sensitive_data: parseBoolean(raw.sensitive_data),
    timeline: (raw.timeline || '').trim(),
  }
}

function parseBoolean(val: string): boolean {
  const lower = (val || '').toLowerCase().trim()
  return lower === 'true' || lower === 'yes' || lower === 'y'
}

/**
 * Determine fit decision based on qualification responses.
 * Opportunity-first model: does NOT reject for missing workflow_problem.
 * Only rejects if both required fields are too short to be meaningful.
 */
export function evaluateFit(q: BlueprintQualification): FitResult {
  // Expanded scope if sensitive data or complex integrations
  if (q.sensitive_data) {
    return {
      decision: 'expanded_scope_review',
      reason: 'Sensitive data detected — Blueprint will include additional security review scope.',
    }
  }

  const systemCount = q.systems_involved.split(',').map(s => s.trim()).filter(Boolean).length
  if (systemCount > 5) {
    return {
      decision: 'expanded_scope_review',
      reason: 'Multiple system integrations detected — Blueprint will include expanded integration analysis.',
    }
  }

  // Not a fit only if both required fields are extremely short (gibberish detection)
  if (q.business_objective.length < 3 && q.opportunity_or_problem.length < 3) {
    return {
      decision: 'not_a_fit',
      reason: 'Not enough context to assess. Please provide more detail about your objective and opportunity.',
    }
  }

  return {
    decision: 'standard_blueprint',
    reason: 'Qualification responses provide sufficient context for a standard Blueprint assessment.',
  }
}

/**
 * Map canonical BlueprintQualification to DB column names.
 * Legacy mapping: opportunity_or_problem → workflow_problem, team_context → team_functions
 */
export function toDbColumns(q: BlueprintQualification) {
  return {
    business_objective: q.business_objective,
    workflow_problem: q.opportunity_or_problem,
    current_process: q.current_process || null,
    systems_involved: q.systems_involved || null,
    team_functions: q.team_context || null,
    sensitive_data: q.sensitive_data,
    desired_outcome: q.desired_outcome || null,
    timeline: q.timeline || null,
  }
}
