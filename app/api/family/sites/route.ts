import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient, getCurrentUser } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET: Get all sites where the authenticated user has guardian access
export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  const { data, error } = await serviceClient.rpc('get_guardian_sites')

  if (error) {
    return NextResponse.json({ error: 'query_failed' }, { status: 500 })
  }

  return NextResponse.json({ sites: data || [] })
}
