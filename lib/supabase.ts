import { createBrowserClient as ssrCreateBrowserClient } from '@supabase/ssr'
import { createServerClient as ssrCreateServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// ============================================
// BROWSER CLIENT (client-side, uses @supabase/ssr for cookie sync)
// ============================================
export function createBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) return null
  return ssrCreateBrowserClient(supabaseUrl, supabaseAnonKey)
}

// ============================================
// SERVER CLIENT (server-side with user session, uses @supabase/ssr)
// ============================================
export async function createServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) return null
  const cookieStore = await cookies()
  return ssrCreateServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Called from a Server Component - middleware handles refresh
        }
      },
    },
  })
}

// ============================================
// SERVICE CLIENT (service-role key, bypasses RLS)
// Server-only. Never expose to browser.
// ============================================
export function createServiceClient() {
  if (!supabaseUrl || !supabaseServiceKey) return null
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// ============================================
// AUTH HELPERS
// ============================================
export async function getCurrentUser() {
  const client = await createServerClient()
  if (!client) return null
  const { data: { user } } = await client.auth.getUser()
  return user
}

export async function requirePlatformAdmin() {
  const user = await getCurrentUser()
  if (!user) return null

  const serviceClient = createServiceClient()
  if (!serviceClient) return null

  const { data: role } = await serviceClient
    .from('platform_user_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('role', 'platform_admin')
    .single()

  if (!role) return null
  return user
}
