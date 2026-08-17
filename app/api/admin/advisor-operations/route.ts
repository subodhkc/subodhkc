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
  const questionId = searchParams.get('id')

  try {
    if (view === 'question' && questionId) {
      const { createClient } = await import('@supabase/supabase-js')
      const sc = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
      const { data: question } = await sc
        .from('advisor_questions')
        .select('id, organization_id, title, subject, question_body, status, request_category, created_at, answered_at, submitted_by, organizations!inner(name, slug)')
        .eq('id', questionId)
        .single()
      if (!question) return NextResponse.json({ error: 'not_found' }, { status: 404 })
      // Get requester info
      let requesterName = null
      let requesterEmail = null
      if (question.submitted_by) {
        const { data: profile } = await sc.from('profiles').select('email, full_name').eq('id', question.submitted_by).single()
        requesterName = profile?.full_name || null
        requesterEmail = profile?.email || null
      }
      const org = (question as any).organizations
      return NextResponse.json({
        question: {
          ...question,
          organization_name: org?.name,
          organization_slug: org?.slug,
          requester_name: requesterName,
          requester_email: requesterEmail,
        }
      })
    }

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
