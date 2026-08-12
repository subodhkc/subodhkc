import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
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

  // Hash the token to compare with stored hash
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
    return NextResponse.json({ error: 'acceptance_failed' }, { status: 500 })
  }

  return NextResponse.json({ success: true, membership_id: data })
}
