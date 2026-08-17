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
        .select('id, organization_id, subject, question, context, status, request_category, created_at, responded_at, submitted_by, organizations!inner(name, slug)')
        .eq('id', questionId)
        .single()
      if (!question) return NextResponse.json({ error: 'not_found' }, { status: 404 })
      // Get requester info
      let requesterName = null
      let requesterEmail = null
      if (question.submitted_by) {
        const { data: profile } = await sc.from('profiles').select('email, display_name').eq('id', question.submitted_by).single()
        requesterName = profile?.display_name || null
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
      const rawItems = await fetchAttentionQueue()
      // Map snake_case backend fields to camelCase frontend interface
      const items = rawItems.map((item, idx) => ({
        id: item.entity_id || `${item.organization_id}-${item.item_type}-${idx}`,
        organization: item.organization_name,
        orgSlug: item.organization_slug,
        type: item.item_type,
        priority: item.priority,
        age: item.age_hours < 24 ? `${item.age_hours}h` : `${Math.floor(item.age_hours / 24)}d`,
        ageHours: item.age_hours,
        targetDate: item.target_date,
        status: item.status,
        title: item.title,
        link: item.direct_link,
      }))
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

    if (view === 'commercial') {
      const { createClient } = await import('@supabase/supabase-js')
      const sc = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

      // Active customers
      const { data: advisorEnts } = await sc.from('organization_entitlements').select('id, offering_key, effective_status, source_metadata').eq('offering_key', 'ai_advisor_desk').eq('effective_status', 'active')
      const { data: fractionalEnts } = await sc.from('organization_entitlements').select('id, offering_key, effective_status, source_metadata').eq('offering_key', 'fractional_ai_advisor').eq('effective_status', 'active')

      let advisorMRR = 0
      for (const e of advisorEnts || []) { const m = (e.source_metadata as any)?.amount_cents; if (m) advisorMRR += m / 100 }
      let fractionalMRR = 0
      for (const e of fractionalEnts || []) { const m = (e.source_metadata as any)?.amount_cents; if (m) fractionalMRR += m / 100 }

      // Work Orders
      const { data: wos } = await sc.from('ai_work_orders').select('id, status, standard_price_cents, created_at, scope_accepted_at').order('created_at', { ascending: false }).limit(500)
      const woList = wos || []
      const newThisMonth = woList.filter(w => new Date(w.created_at) >= new Date(monthStart)).length
      // Use scope_accepted_at as proxy for "paid" since there's no paid_at column
      // Work orders that are paid or further along have scope_accepted_at set
      const paidStatuses = ['paid', 'scoped', 'in_progress', 'in_review', 'needs_client_input', 'delivered', 'completed']
      const paidThisMonth = woList.filter(w => paidStatuses.includes(w.status) && w.scope_accepted_at && new Date(w.scope_accepted_at) >= new Date(monthStart)).length
      const revenueThisMonth = woList.filter(w => paidStatuses.includes(w.status) && w.scope_accepted_at && new Date(w.scope_accepted_at) >= new Date(monthStart)).reduce((s, w) => s + (w.standard_price_cents || 0), 0) / 100
      const awaitingScope = woList.filter(w => w.status === 'awaiting_scope' || w.status === 'draft').length
      const awaitingPayment = woList.filter(w => w.status === 'ready_for_checkout' || w.status === 'payment_pending' || w.status === 'awaiting_approval').length
      const inProgress = woList.filter(w => w.status === 'in_progress' || w.status === 'in_review' || w.status === 'paid' || w.status === 'scoped').length
      const delivered = woList.filter(w => w.status === 'delivered').length

      // Funnel
      const funnel = {
        intakeStarted: woList.length,
        scopePrepared: woList.filter(w => w.status !== 'draft' && w.status !== 'awaiting_scope').length,
        scopeAccepted: woList.filter(w => ['ready_for_checkout', 'payment_pending', 'paid', 'scoped', 'in_progress', 'in_review', 'needs_client_input', 'delivered', 'completed'].includes(w.status)).length,
        paid: woList.filter(w => ['paid', 'scoped', 'in_progress', 'in_review', 'needs_client_input', 'delivered', 'completed'].includes(w.status)).length,
        delivered: woList.filter(w => ['delivered', 'completed'].includes(w.status)).length,
      }

      // Failures
      const { count: provisioningFailures } = await sc.from('included_product_entitlements').select('id', { count: 'exact', head: true }).eq('provisioning_status', 'provisioning_failed')
      const { count: paymentFailures } = await sc.from('organization_entitlements').select('id', { count: 'exact', head: true }).in('effective_status', ['suspended', 'past_due'])

      return NextResponse.json({
        advisorCount: advisorEnts?.length || 0,
        fractionalCount: fractionalEnts?.length || 0,
        advisorMRR: Math.round(advisorMRR),
        fractionalMRR: Math.round(fractionalMRR),
        workOrders: { newThisMonth, paidThisMonth, revenueThisMonth: Math.round(revenueThisMonth), awaitingScope, awaitingPayment, inProgress, delivered },
        funnel,
        failures: { provisioning: provisioningFailures || 0, payment: paymentFailures || 0, fulfillment: 0 },
      })
    }

    // Default: clients view
    const clients = await fetchAdvisoryClients(filter || undefined)
    return NextResponse.json({ clients, count: clients.length })
  } catch (err: any) {
    console.error('[advisor-operations] Error:', err)
    return NextResponse.json({ error: 'Failed to fetch advisory operations data' }, { status: 500 })
  }
}
