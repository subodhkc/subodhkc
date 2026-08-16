import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const DEMO_EMAIL = process.env.DEMO_USER_EMAIL || 'demo-junekc@subodhkc.com'
const DEMO_PASSWORD = process.env.DEMO_USER_PASSWORD || ''

export async function POST(request: NextRequest) {
  const limited = rateLimit(request)
  if (limited) return limited

  const body = await request.json().catch(() => ({}))
  const { username, password } = body

  if (!username || !password) {
    return NextResponse.json(
      { error: 'Username and password are required' },
      { status: 400 }
    )
  }

  // Normalize: username "JuneKc" maps to demo email
  const normalizedUsername = username.trim().toLowerCase()
  if (normalizedUsername !== 'junekc') {
    return NextResponse.json(
      { error: 'Invalid demo credentials' },
      { status: 401 }
    )
  }

  if (password !== 'pre-k') {
    return NextResponse.json(
      { error: 'Invalid demo credentials' },
      { status: 401 }
    )
  }

  if (!DEMO_PASSWORD) {
    return NextResponse.json(
      { error: 'Demo login not configured' },
      { status: 503 }
    )
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    )
  }

  const response = NextResponse.json({ success: true })

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  const { data, error } = await supabase.auth.signInWithPassword({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  })

  if (error || !data.user) {
    return NextResponse.json(
      { error: 'Invalid demo credentials' },
      { status: 401 }
    )
  }

  return response
}
