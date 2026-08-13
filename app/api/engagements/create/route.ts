import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceClient } from '@/lib/supabase'
import { getAuthenticatedUser } from '@/lib/auth/organization-resolver'
import { ENGAGEMENT_TEMPLATES, ACCELERATOR_CATALOG } from '@/lib/engagement/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const {
    organization_id,
    title,
    statement,
    in_scope,
    out_of_scope,
    executive_sponsor,
    client_lead,
    advisor_lead,
    engagement_type,
    review_cadence,
    current_phase,
    starts_at,
    ends_at,
    template_key,
  } = body

  if (!organization_id || !title) {
    return NextResponse.json({ error: 'organization_id and title are required' }, { status: 400 })
  }

  const sc = createServiceClient()
  if (!sc) return NextResponse.json({ error: 'Service client unavailable' }, { status: 500 })

  // Verify user is admin/owner of the org
  const { data: membership } = await sc
    .from('organization_memberships')
    .select('role, status')
    .eq('organization_id', organization_id)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  if (!membership || !['admin', 'owner'].includes(membership.role)) {
    if (!user.isPlatformAdmin) {
      return NextResponse.json({ error: 'Advisor access required' }, { status: 403 })
    }
  }

  // Create the engagement
  const { data: eng, error: engError } = await sc
    .from('engagements')
    .insert({
      organization_id,
      engagement_type: engagement_type || 'program',
      status: 'active',
      title,
      statement: statement || null,
      in_scope: in_scope || null,
      out_of_scope: out_of_scope || null,
      executive_sponsor: executive_sponsor || null,
      client_lead: client_lead || null,
      advisor_lead: advisor_lead || null,
      review_cadence: review_cadence || 'weekly',
      current_phase: current_phase || 'discovery',
      health_status: 'on_track',
      starts_at: starts_at || null,
      ends_at: ends_at || null,
    })
    .select('id')
    .single()

  if (engError || !eng) {
    return NextResponse.json({ error: 'Failed to create engagement', detail: engError?.message }, { status: 500 })
  }

  const engId = eng.id

  // Add advisor as participant
  await sc
    .from('engagement_participants')
    .insert({
      engagement_id: engId,
      organization_id,
      user_id: user.id,
      responsibility: 'advisor',
      display_name: user.displayName || user.email,
    })

  // Apply template if selected
  if (template_key && template_key !== 'blank') {
    const template = ENGAGEMENT_TEMPLATES.find(t => t.key === template_key)
    if (template) {
      // Create outcomes
      for (let i = 0; i < template.outcomes.length; i++) {
        const o = template.outcomes[i]
        await sc.from('engagement_outcomes').insert({
          engagement_id: engId,
          organization_id,
          title: o.title,
          description: o.description,
          display_order: i,
        })
      }

      // Create workstreams
      const wsIds: string[] = []
      for (let i = 0; i < template.workstreams.length; i++) {
        const w = template.workstreams[i]
        const { data: ws } = await sc.from('engagement_workstreams').insert({
          engagement_id: engId,
          organization_id,
          name: w.name,
          description: w.description,
          display_order: i,
        }).select('id').single()
        if (ws) wsIds.push(ws.id)
      }

      // Link accelerators
      for (let i = 0; i < template.accelerators.length; i++) {
        const accKey = template.accelerators[i]
        const acc = ACCELERATOR_CATALOG.find(a => a.key === accKey)
        if (acc) {
          await sc.from('engagement_accelerators').insert({
            engagement_id: engId,
            organization_id,
            accelerator_key: acc.key,
            accelerator_name: acc.name,
            reference_url: acc.url,
            display_order: i,
          })
        }
      }
    }
  }

  // Audit event
  await sc.rpc('write_audit_event', {
    audit_action: 'engagement.created',
    audit_entity_type: 'engagement',
    audit_org_id: organization_id,
    audit_actor_id: user.id,
    audit_entity_id: engId,
    audit_metadata: { title } as any,
  })

  return NextResponse.json({ id: engId })
}
