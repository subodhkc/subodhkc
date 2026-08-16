/**
 * Session usage tracking and rollover logic for Fractional AI Advisor.
 *
 * Fractional includes 2 working sessions per month.
 * One unused session may roll into the immediately following month only.
 */

import { createServiceClient } from '@/lib/supabase'

export const INCLUDED_SESSIONS_PER_MONTH = 2
export const MAX_ROLLOVER = 1

/**
 * Get or create the session usage record for a given org and billing period month.
 */
export async function getOrCreateSessionUsage(
  orgId: string,
  engagementId: string | null,
  billingPeriodMonth: string,
  periodStart?: string,
  periodEnd?: string
) {
  const sc = createServiceClient()
  if (!sc) return null

  // Try to fetch existing
  const { data: existing } = await sc
    .from('fractional_session_usage')
    .select('*')
    .eq('organization_id', orgId)
    .eq('billing_period_month', billingPeriodMonth)
    .single()

  if (existing) return existing

  // Compute rollover from previous month
  const prevMonth = getPreviousMonth(billingPeriodMonth)
  const { data: prevUsage } = await sc
    .from('fractional_session_usage')
    .select('*')
    .eq('organization_id', orgId)
    .eq('billing_period_month', prevMonth)
    .single()

  let rolledOverFromPrev = 0
  if (prevUsage) {
    const prevAvailable = prevUsage.included_sessions + prevUsage.rolled_over_from_prev - prevUsage.used_sessions
    rolledOverFromPrev = Math.min(Math.max(prevAvailable, 0), prevUsage.max_rollover)

    // Update previous month's rolled_over_to_next
    if (rolledOverFromPrev > 0 && prevUsage.rolled_over_to_next === 0) {
      await sc
        .from('fractional_session_usage')
        .update({ rolled_over_to_next: rolledOverFromPrev })
        .eq('id', prevUsage.id)
    }
  }

  // Create new usage record
  const { data: newRecord, error } = await sc
    .from('fractional_session_usage')
    .insert({
      organization_id: orgId,
      engagement_id: engagementId,
      billing_period_month: billingPeriodMonth,
      included_sessions: INCLUDED_SESSIONS_PER_MONTH,
      used_sessions: 0,
      rolled_over_from_prev: rolledOverFromPrev,
      rolled_over_to_next: 0,
      max_rollover: MAX_ROLLOVER,
      period_start: periodStart || null,
      period_end: periodEnd || null,
    })
    .select('*')
    .single()

  if (error) {
    console.error('Failed to create session usage record:', error.message)
    return null
  }

  return newRecord
}

/**
 * Increment session usage when a working session is scheduled/completed.
 * Returns the updated usage record or null if no sessions are available.
 */
export async function incrementSessionUsage(
  orgId: string,
  billingPeriodMonth: string
): Promise<{ success: boolean; available: number; used: number; message?: string }> {
  const sc = createServiceClient()
  if (!sc) return { success: false, available: 0, used: 0, message: 'Service unavailable' }

  // Get the active engagement
  const { data: engagement } = await sc
    .from('engagements')
    .select('id')
    .eq('organization_id', orgId)
    .eq('engagement_type', 'retainer')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const usage = await getOrCreateSessionUsage(orgId, engagement?.id || null, billingPeriodMonth)
  if (!usage) return { success: false, available: 0, used: 0, message: 'Could not create usage record' }

  const available = usage.included_sessions + usage.rolled_over_from_prev - usage.used_sessions
  if (available <= 0) {
    return {
      success: false,
      available: 0,
      used: usage.used_sessions,
      message: `No sessions remaining for ${billingPeriodMonth}. Included: ${usage.included_sessions}, Rollover: ${usage.rolled_over_from_prev}, Used: ${usage.used_sessions}.`,
    }
  }

  const { data: updated, error } = await sc
    .from('fractional_session_usage')
    .update({ used_sessions: usage.used_sessions + 1 })
    .eq('id', usage.id)
    .select('*')
    .single()

  if (error) {
    return { success: false, available, used: usage.used_sessions, message: error.message }
  }

  const newAvailable = updated.included_sessions + updated.rolled_over_from_prev - updated.used_sessions
  return { success: true, available: newAvailable, used: updated.used_sessions }
}

/**
 * Get the current month in YYYY-MM format.
 */
export function getCurrentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

/**
 * Get the previous month in YYYY-MM format.
 */
export function getPreviousMonth(month: string): string {
  const [year, m] = month.split('-').map(Number)
  const date = new Date(year, m - 1, 1)
  date.setMonth(date.getMonth() - 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

/**
 * Get session usage summary for an organization.
 * Returns current month usage with computed available sessions.
 */
export async function getSessionUsageSummary(orgId: string) {
  const sc = createServiceClient()
  if (!sc) return null

  const currentMonth = getCurrentMonth()

  // Get the active engagement
  const { data: engagement } = await sc
    .from('engagements')
    .select('id')
    .eq('organization_id', orgId)
    .eq('engagement_type', 'retainer')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const usage = await getOrCreateSessionUsage(orgId, engagement?.id || null, currentMonth)
  if (!usage) return null

  const available = usage.included_sessions + usage.rolled_over_from_prev - usage.used_sessions
  const rolloverEligible = Math.max(available, 0)

  return {
    currentMonth,
    includedSessions: usage.included_sessions,
    usedSessions: usage.used_sessions,
    rolledOverFromPrev: usage.rolled_over_from_prev,
    rolledOverToNext: usage.rolled_over_to_next,
    availableSessions: available,
    rolloverEligible: Math.min(rolloverEligible, usage.max_rollover),
    maxRollover: usage.max_rollover,
  }
}
