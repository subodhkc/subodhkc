import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getAuthenticatedUser, resolveOrganizationContext } from '@/lib/auth/organization-resolver'
import { rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * GET /api/scheduling/links?orgSlug=...&type=activation_call|working_session
 * Returns scheduling links for the organization.
 */
export async function GET(request: NextRequest) {
  const limited = rateLimit(request)
  if (limited) return limited

  try {
    const user = await getAuthenticatedUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const orgSlug = searchParams.get('orgSlug')
    const linkType = searchParams.get('type') // 'activation_call' | 'working_session' | null (all)
    if (!orgSlug) return NextResponse.json({ error: 'Missing orgSlug' }, { status: 400 })

    const ctx = await resolveOrganizationContext(user, orgSlug)
    if (!ctx) return NextResponse.json({ error: 'Organization not found' }, { status: 404 })

    const sc = createClient(supabaseUrl, serviceRoleKey)
    let query = sc
      .from('scheduling_links')
      .select('*')
      .eq('organization_id', ctx.organization.id)
      .order('created_at', { ascending: false })

    if (linkType) {
      query = query.eq('link_type', linkType)
    }

    const { data: links } = await query as { data: any }

    return NextResponse.json({ links: links || [] })
  } catch (err: any) {
    console.error('[scheduling] Error:', err)
    return NextResponse.json({ error: 'Failed to fetch scheduling links' }, { status: 500 })
  }
}

/**
 * POST /api/scheduling/links
 * Create or update a scheduling link.
 * Body: { orgSlug, linkType, schedulingUrl, scheduledAt?, durationMinutes?, notes? }
 */
export async function POST(request: NextRequest) {
  const limited = rateLimit(request)
  if (limited) return limited

  try {
    const user = await getAuthenticatedUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { orgSlug, linkType, schedulingUrl, scheduledAt, durationMinutes, notes, status } = body

    if (!orgSlug || !linkType || !schedulingUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const ctx = await resolveOrganizationContext(user, orgSlug)
    if (!ctx) return NextResponse.json({ error: 'Organization not found' }, { status: 404 })

    const sc = createClient(supabaseUrl, serviceRoleKey)

    // For activation_call, only allow one pending/scheduled link at a time
    if (linkType === 'activation_call') {
      const { data: existing } = await sc
        .from('scheduling_links')
        .select('id, status')
        .eq('organization_id', ctx.organization.id)
        .eq('link_type', 'activation_call')
        .in('status', ['pending', 'scheduled'])
        .limit(1) as { data: any }

      if (existing && existing.length > 0) {
        // Update existing instead of creating duplicate
        const { data: updated } = await sc
          .from('scheduling_links')
          .update({
            scheduling_url: schedulingUrl,
            scheduled_at: scheduledAt || null,
            duration_minutes: durationMinutes || 20,
            status: status || 'scheduled',
            notes: notes || null,
          })
          .eq('id', existing[0].id)
          .select()
          .single() as { data: any }
        return NextResponse.json({ link: updated })
      }
    }

    const { data: link, error } = await (sc
      .from('scheduling_links') as any)
      .insert({
        organization_id: ctx.organization.id,
        link_type: linkType,
        scheduling_url: schedulingUrl,
        scheduled_at: scheduledAt || null,
        duration_minutes: durationMinutes || (linkType === 'activation_call' ? 20 : 60),
        status: status || 'scheduled',
        notes: notes || null,
      })
      .select()
      .single()

    if (error) {
      console.error('[scheduling] Insert error:', error)
      return NextResponse.json({ error: 'Failed to create scheduling link' }, { status: 500 })
    }

    return NextResponse.json({ link })
  } catch (err: any) {
    console.error('[scheduling] Error:', err)
    return NextResponse.json({ error: 'Failed to create scheduling link' }, { status: 500 })
  }
}

/**
 * PATCH /api/scheduling/links
 * Update a scheduling link status (e.g., mark as completed).
 * Body: { linkId, status, scheduledAt? }
 */
export async function PATCH(request: NextRequest) {
  const limited = rateLimit(request)
  if (limited) return limited

  try {
    const user = await getAuthenticatedUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { linkId, status, scheduledAt } = body

    if (!linkId || !status) {
      return NextResponse.json({ error: 'Missing linkId or status' }, { status: 400 })
    }

    const sc = createClient(supabaseUrl, serviceRoleKey)

    // Verify the link belongs to an org the user is a member of
    const { data: link } = await sc
      .from('scheduling_links')
      .select('organization_id')
      .eq('id', linkId)
      .single() as { data: any }

    if (!link) return NextResponse.json({ error: 'Link not found' }, { status: 404 })

    // Verify membership
    const { data: membership } = await sc
      .from('organization_memberships')
      .select('id')
      .eq('organization_id', link.organization_id)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .limit(1)

    if (!membership || membership.length === 0) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { data: updated, error } = await (sc
      .from('scheduling_links') as any)
      .update({
        status,
        scheduled_at: scheduledAt || undefined,
      })
      .eq('id', linkId)
      .select()
      .single()

    if (error) {
      console.error('[scheduling] Update error:', error)
      return NextResponse.json({ error: 'Failed to update scheduling link' }, { status: 500 })
    }

    return NextResponse.json({ link: updated })
  } catch (err: any) {
    console.error('[scheduling] Error:', err)
    return NextResponse.json({ error: 'Failed to update scheduling link' }, { status: 500 })
  }
}
