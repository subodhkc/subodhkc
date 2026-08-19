/**
 * Commercial failure tracking and observability.
 * Persists operational failures for admin visibility and retry.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export type FailureType =
  | 'checkout'
  | 'webhook'
  | 'entitlement'
  | 'haiec_provisioning'
  | 'kestrel_provisioning'
  | 'email'
  | 'onboarding'
  | 'advisor_request'
  | 'artifact'
  | 'portal'
  | 'cancellation'
  | 'scheduling'
  | 'session_usage'
  | 'invitation'

export type Severity = 'warning' | 'error' | 'critical'

/**
 * Record a commercial failure to the database for admin visibility.
 * Non-blocking — if the insert fails, just log to console.
 */
export async function recordFailure(opts: {
  organizationId?: string
  userId?: string
  failureType: FailureType
  severity?: Severity
  message: string
  details?: Record<string, any>
  stripeEventId?: string
  retryable?: boolean
}): Promise<void> {
  try {
    const sc = createClient(supabaseUrl, serviceRoleKey)
    await sc.from('commercial_failures').insert({
      organization_id: opts.organizationId || null,
      user_id: opts.userId || null,
      failure_type: opts.failureType,
      severity: opts.severity || 'error',
      message: opts.message,
      details: opts.details || null,
      stripe_event_id: opts.stripeEventId || null,
      retryable: opts.retryable || false,
    })
  } catch (err) {
    console.error('[commercial_failures] Failed to record failure:', err)
  }
}

/**
 * Mark a failure as resolved.
 */
export async function resolveFailure(failureId: string, resolvedBy: string): Promise<void> {
  const sc = createClient(supabaseUrl, serviceRoleKey)
  await sc
    .from('commercial_failures')
    .update({ resolved_at: new Date().toISOString(), resolved_by: resolvedBy })
    .eq('id', failureId)
}

/**
 * Mark a failure as retried.
 */
export async function markFailureRetried(failureId: string): Promise<void> {
  const sc = createClient(supabaseUrl, serviceRoleKey)
  await sc
    .from('commercial_failures')
    .update({ retried_at: new Date().toISOString() })
    .eq('id', failureId)
}
