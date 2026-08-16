import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getAuthenticatedUser, resolveOrganizationContext } from '@/lib/auth/organization-resolver'
import { rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: NextRequest) {
  const limited = rateLimit(request)
  if (limited) return limited

  try {
    const user = await getAuthenticatedUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const orgSlug = searchParams.get('orgSlug')
    if (!orgSlug) return NextResponse.json({ error: 'Missing orgSlug' }, { status: 400 })

    const ctx = await resolveOrganizationContext(user, orgSlug)
    if (!ctx) return NextResponse.json({ error: 'Organization not found' }, { status: 404 })

    const sc = createClient(supabaseUrl, serviceRoleKey)

    // Get the organization's active entitlement to determine plan
    const { data: entitlement } = await sc
      .from('organization_entitlements')
      .select('offering_key')
      .eq('organization_id', ctx.organization.id)
      .eq('effective_status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single() as { data: any }

    const planKey = entitlement?.offering_key || null

    // Fetch member tools that are production-ready, visible, and allowed for this plan
    const { data: tools } = await sc
      .from('member_tools')
      .select('*')
      .eq('production_ready', true)
      .eq('visible_to_client', true)
      .order('display_order', { ascending: true })

    // Filter to tools allowed for this plan
    const filtered = (tools || []).filter((tool: any) => {
      // Never expose ADMIN_ONLY or EXPERIMENTAL
      if (tool.access_level === 'ADMIN_ONLY' || tool.access_level === 'EXPERIMENTAL') return false
      // Check if plan is allowed
      if (!planKey) return false
      return tool.allowed_plans?.includes(planKey)
    })

    return NextResponse.json({ tools: filtered, plan: planKey })
  } catch (err: any) {
    console.error('[member-tools] Error:', err)
    return NextResponse.json({ error: 'Failed to fetch member tools' }, { status: 500 })
  }
}
