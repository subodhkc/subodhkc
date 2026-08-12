import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export function createBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) return null
  return createClient(supabaseUrl, supabaseAnonKey)
}

export function createServerClient() {
  if (!supabaseUrl || !supabaseServiceKey) return null
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export async function createAuthClient() {
  if (!supabaseUrl || !supabaseAnonKey) return null
  const cookieStore = await cookies()
  const token = cookieStore.get('sb-access-token')?.value

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  if (token) {
    await client.auth.setSession({
      access_token: token,
      refresh_token: cookieStore.get('sb-refresh-token')?.value || '',
    })
  }

  return client
}

export async function getCurrentUser() {
  const client = await createAuthClient()
  if (!client) return null
  const { data: { user } } = await client.auth.getUser()
  return user
}

export async function requireAdmin() {
  const user = await getCurrentUser()
  if (!user) return null

  const serverClient = createServerClient()
  if (!serverClient) return null

  const { data: profile } = await serverClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') return null
  return user
}
