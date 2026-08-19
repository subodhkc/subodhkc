import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { rateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/invite/accept
 *
 * S2: Complete invitation acceptance workflow.
 *
 * Body: { token, email }
 *
 * Flow:
 *   1. Rate limit
 *   2. Authenticate user (must be logged in or signed up)
 *   3. Validate authenticated email matches invited email
 *   4. Hash the token (never send plaintext to DB)
 *   5. Call accept_invitation RPC (atomic: validate + create membership + assign seats + mark consumed)
 *   6. Return membership_id + org_slug for redirect
 *
 * Error handling:
 *   - invitation_invalid (404) — token+email not found
 *   - invitation_already_accepted (409) — token reused
 *   - invitation_revoked (403) — admin revoked
 *   - invitation_expired (410) — past 7-day window
 *   - email_mismatch (403) — wrong authenticated account
 *   - user_not_found (500) — email not registered (must sign up first)
 *
 * Seat assignment:
 *   - Requested seats are assigned best-effort. If a seat became unavailable
 *     between invite and acceptance, the membership is still created but the
 *     seat assignment is skipped (recorded in seat_results).
 */
export async function POST(request: NextRequest) {
  const limited = rateLimit(request)
  if (limited) return limited

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: 'config' }, { status: 500 })
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll() {},
    },
  })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
  }

  const body = await request.json()
  const { token, email } = body

  if (!token || !email) {
    return NextResponse.json({ error: 'missing_params' }, { status: 400 })
  }

  // Verify the authenticated user's email matches the invited email
  const invitedEmail = email.toLowerCase()
  const userEmail = (user.email || '').toLowerCase()
  if (userEmail !== invitedEmail) {
    return NextResponse.json({
      error: 'email_mismatch',
      message: 'This invitation was sent to a different email address. Sign in using the invited account or ask the administrator to resend the invitation.',
    }, { status: 403 })
  }

  // Hash the token to compare with stored hash (never store plaintext tokens)
  const crypto = await import('crypto')
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

  const { data, error } = await supabase.rpc('accept_invitation', {
    inv_token: tokenHash,
    inv_email: email.toLowerCase(),
  })

  if (error) {
    const message = error.message
    if (message.includes('invitation_invalid')) {
      return NextResponse.json({ error: 'invitation_invalid' }, { status: 404 })
    }
    if (message.includes('invitation_already_accepted')) {
      return NextResponse.json({ error: 'invitation_already_accepted' }, { status: 409 })
    }
    if (message.includes('invitation_revoked')) {
      return NextResponse.json({ error: 'invitation_revoked' }, { status: 403 })
    }
    if (message.includes('invitation_expired')) {
      return NextResponse.json({ error: 'invitation_expired' }, { status: 410 })
    }
    if (message.includes('user_not_found')) {
      return NextResponse.json({
        error: 'user_not_found',
        message: 'No account found with this email. Please sign up first, then return to the invitation.',
      }, { status: 400 })
    }
    return NextResponse.json({ error: 'acceptance_failed', message }, { status: 500 })
  }

  // The RPC returns { membership_id, already_member, org_slug, seat_results }
  const result = data as {
    membership_id: string
    already_member: boolean
    org_slug: string
    seat_results: Array<{ offering_key: string; assigned: boolean; reason?: string }>
  }

  return NextResponse.json({
    success: true,
    membership_id: result.membership_id,
    already_member: result.already_member,
    org_slug: result.org_slug,
    seat_results: result.seat_results,
    redirect_url: `/app/${result.org_slug}`,
  })
}
