import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requirePlatformAdmin } from '@/lib/auth/organization-resolver'
import { rateLimit } from '@/lib/rate-limit'
import { resolveFailure, markFailureRetried } from '@/lib/commercial/failures'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * GET /api/admin/failures?resolved=false
 * Returns commercial failures for admin visibility.
 */
export async function GET(request: NextRequest) {
  const limited = rateLimit(request)
  if (limited) return limited

  try {
    await requirePlatformAdmin()
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const resolved = searchParams.get('resolved') !== 'false'

  const sc = createClient(supabaseUrl, serviceRoleKey)
  let query = sc
    .from('commercial_failures')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (!resolved) {
    query = query.is('resolved_at', null)
  }

  const { data: failures, error } = await query as { data: any; error: any }

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch failures' }, { status: 500 })
  }

  return NextResponse.json({ failures: failures || [] })
}

/**
 * PATCH /api/admin/failures
 * Resolve or retry a failure.
 * Body: { failureId, action: 'resolve' | 'retry' }
 */
export async function PATCH(request: NextRequest) {
  const limited = rateLimit(request)
  if (limited) return limited

  try {
    const user = await requirePlatformAdmin()
    const body = await request.json()
    const { failureId, action } = body

    if (!failureId || !action) {
      return NextResponse.json({ error: 'Missing failureId or action' }, { status: 400 })
    }

    if (action === 'resolve') {
      await resolveFailure(failureId, user.id)
      return NextResponse.json({ success: true })
    } else if (action === 'retry') {
      await markFailureRetried(failureId)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err: any) {
    if (err.code === 'AUTH_ERROR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    console.error('[admin/failures] Error:', err)
    return NextResponse.json({ error: 'Failed to update failure' }, { status: 500 })
  }
}
