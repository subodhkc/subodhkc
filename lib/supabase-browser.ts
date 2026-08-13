import { createBrowserClient as ssrCreateBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

export function createBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) return null
  return ssrCreateBrowserClient(supabaseUrl, supabaseAnonKey)
}
