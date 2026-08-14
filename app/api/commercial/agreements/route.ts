import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, resolveOrganizationContext, AuthError } from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'
import { getOffer, type OfferKey } from '@/lib/commercial/offers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/commercial/agreements?orgSlug=<slug>&offerKey=<key>
 * Returns the active agreement for the org + offering.
 */
export async function GET(req: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const orgSlug = searchParams.get('orgSlug')
  const offerKey = searchParams.get('offerKey') as OfferKey | null

  if (!orgSlug) return NextResponse.json({ error: 'orgSlug required' }, { status: 400 })

  let ctx
  try {
    ctx = await resolveOrganizationContext(user, orgSlug)
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 403 })
    throw err
  }

  const sc = createServiceClient()
  if (!sc) return NextResponse.json({ error: 'config' }, { status: 500 })

  let query = sc
    .from('agreements')
    .select(`
      *,
      agreement_templates!inner(template_key, name, body_markdown, version)
    `)
    .eq('organization_id', ctx.organization.id)

  if (offerKey) {
    const offer = getOffer(offerKey)
    if (offer?.requiresAgreement) {
      // Convention: template key matches offer key
      query = query.eq('template_key', `${offerKey}_agreement`)
    }
  }

  const { data: agreements } = await query.order('created_at', { ascending: false })

  return NextResponse.json({ agreements: agreements || [] })
}

/**
 * POST /api/commercial/agreements
 * Create an agreement from a template, or accept an existing agreement.
 */
export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json()
  const { orgSlug, templateKey, action } = body as {
    orgSlug: string
    templateKey?: string
    action: 'create' | 'accept'
  }

  if (!orgSlug || !action) {
    return NextResponse.json({ error: 'orgSlug and action required' }, { status: 400 })
  }

  let ctx
  try {
    ctx = await resolveOrganizationContext(user, orgSlug)
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 403 })
    throw err
  }

  const sc = createServiceClient()
  if (!sc) return NextResponse.json({ error: 'config' }, { status: 500 })

  if (action === 'create') {
    if (!templateKey) {
      return NextResponse.json({ error: 'templateKey required for create' }, { status: 400 })
    }

    // Get the template
    const { data: template } = await sc
      .from('agreement_templates')
      .select('*')
      .eq('template_key', templateKey)
      .eq('is_active', true)
      .single()

    if (!template) {
      return NextResponse.json({ error: 'template_not_found' }, { status: 404 })
    }

    // Check if an active agreement already exists for this template
    const { data: existing } = await sc
      .from('agreements')
      .select('id, status')
      .eq('organization_id', ctx.organization.id)
      .eq('template_key', templateKey)
      .eq('status', 'active')
      .limit(1)

    if (existing && existing.length > 0) {
      // Return existing agreement
      const { data: existingAgreement } = await sc
        .from('agreements')
        .select('*')
        .eq('id', existing[0].id)
        .single()
      return NextResponse.json({ agreement: existingAgreement })
    }

    // No agreement exists yet - create one from template
    const { data: newAgreement } = await sc
      .from('agreements')
      .insert({
        organization_id: ctx.organization.id,
        template_key: templateKey,
        document_type: template.document_type,
        template_version: template.version,
        title: template.name,
        body_text: template.body_markdown,
        status: 'pending',
      })
      .select('*')
      .single()

    if (!newAgreement) return NextResponse.json({ error: 'failed_to_create' }, { status: 500 })

    return NextResponse.json({ agreement: newAgreement })
  } else if (action === 'accept') {
    // Accept an existing pending agreement
    const { agreementId } = body as { agreementId?: string }

    if (!agreementId) {
      return NextResponse.json({ error: 'agreementId required for accept' }, { status: 400 })
    }

    const { data, error } = await sc
      .from('agreements')
      .update({
        status: 'accepted',
        accepted_by: user.id,
        accepted_at: new Date().toISOString(),
      })
      .eq('id', agreementId)
      .eq('organization_id', ctx.organization.id)
      .eq('status', 'pending')
      .select('*')
      .single()

    if (error) return NextResponse.json({ error: 'failed_to_accept' }, { status: 500 })

    // Audit event
    await sc.rpc('write_audit_event', {
      audit_action: 'agreement.accepted',
      audit_entity_type: 'agreement',
      audit_org_id: ctx.organization.id,
      audit_actor_id: user.id,
      audit_entity_id: agreementId,
      audit_metadata: { template_key: data.template_key } as any,
    })

    return NextResponse.json({ agreement: data })
  }

  return NextResponse.json({ error: 'invalid_action' }, { status: 400 })
}
