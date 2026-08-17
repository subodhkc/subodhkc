import { NextRequest, NextResponse } from 'next/server'
import { requirePlatformAdmin } from '@/lib/auth/organization-resolver'
import { fetchAdvisoryClients, fetchAttentionQueue, fetchClientHealth, fetchAdvisorWorkOrders, type AdvisoryFilter } from '@/lib/commercial/advisor-operations'
import { rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const limited = rateLimit(request)
  if (limited) return limited

  try {
    await requirePlatformAdmin()
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const view = searchParams.get('view') || 'clients'
  const filter = (searchParams.get('filter') as AdvisoryFilter | null) || undefined

  try {
    if (view === 'queue') {
      const items = await fetchAttentionQueue()
      return NextResponse.json({ items, count: items.length })
    }

    if (view === 'health') {
      const health = await fetchClientHealth()
      return NextResponse.json({ health })
    }

    if (view === 'work-orders') {
      const workOrders = await fetchAdvisorWorkOrders()
      return NextResponse.json({ workOrders, count: workOrders.length })
    }

    // Default: clients view
    const clients = await fetchAdvisoryClients(filter || undefined)
    return NextResponse.json({ clients, count: clients.length })
  } catch (err: any) {
    console.error('[advisor-operations] Error:', err)
    return NextResponse.json({ error: 'Failed to fetch advisory operations data' }, { status: 500 })
  }
}
