import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, getCurrentUser } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST: Claim guardian invitation after authentication
export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const body = await request.json()
  const { token } = body

  if (!token) return NextResponse.json({ error: 'missing_token' }, { status: 400 })

  const supabase = await createServerClient()
  if (!supabase) return NextResponse.json({ error: 'config' }, { status: 500 })

  const authEmail = user.email || ''
  if (!authEmail) return NextResponse.json({ error: 'no_email' }, { status: 400 })

  const { data, error } = await supabase.rpc('claim_guardian_invitation', {
    p_token: token,
    p_auth_email: authEmail,
  })

  if (error) {
    const msg = error.message || ''
    if (msg.includes('UNAUTHENTICATED')) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
    if (msg.includes('INVITATION_NOT_FOUND')) return NextResponse.json({ error: 'invitation_not_found' }, { status: 404 })
    if (msg.includes('INVITATION_REVOKED')) return NextResponse.json({ error: 'invitation_revoked' }, { status: 403 })
    if (msg.includes('INVITATION_EXPIRED')) return NextResponse.json({ error: 'invitation_expired' }, { status: 410 })
    if (msg.includes('INVITATION_ALREADY_ACCEPTED')) return NextResponse.json({ error: 'already_accepted' }, { status: 409 })
    if (msg.includes('EMAIL_MISMATCH')) return NextResponse.json({ error: 'email_mismatch' }, { status: 403 })
    if (msg.includes('GUARDIAN_NOT_FOUND')) return NextResponse.json({ error: 'guardian_not_found' }, { status: 404 })
    return NextResponse.json({ error: 'claim_failed' }, { status: 500 })
  }

  return NextResponse.json(data)
}
