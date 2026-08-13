import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createServiceClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

async function resolveSmartRedirect(userId: string, fallback: string): Promise<string> {
  const serviceClient = createServiceClient()
  if (!serviceClient) return fallback

  // Get user's org memberships
  const { data: memberships } = await serviceClient
    .from('organization_memberships')
    .select('organization_id, role, organizations!inner(slug, organization_kind)')
    .eq('user_id', userId)
    .eq('status', 'active')

  if (!memberships || memberships.length === 0) return fallback

  // If user belongs to the Wilshire Demo org, go to school pickup
  const demoOrg = memberships.find((m: any) => m.organizations?.slug === 'wilshire-demo')
  if (demoOrg) {
    return `/app/wilshire-demo/school-pickup`
  }

  // Otherwise go to the first org's page
  const firstOrg = memberships[0] as any
  if (firstOrg?.organizations?.slug) {
    return `/app/${firstOrg.organizations.slug}`
  }

  return fallback
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const nextParam = requestUrl.searchParams.get('next') || '/app'

  // Prevent open redirect: only allow relative paths starting with / but not //
  const isSafeNext = nextParam.startsWith('/') && !nextParam.startsWith('//')
  const fallback = isSafeNext ? nextParam : '/app'

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(new URL('/login?error=config', request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', request.url))
  }

  // Exchange code for session first
  const tempResponse = NextResponse.next()
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          tempResponse.cookies.set(name, value, options)
        })
      },
    },
  })

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
  }

  // Smart routing: if no explicit next (default /app), resolve based on org membership
  let target = fallback
  if (!isSafeNext || fallback === '/app') {
    if (data.user?.id) {
      target = await resolveSmartRedirect(data.user.id, fallback)
    }
  }

  // Build final redirect response with cookies from temp response
  const response = NextResponse.redirect(new URL(target, request.url))
  tempResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value, cookie)
  })

  return response
}
