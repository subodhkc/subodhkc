import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { getAuthenticatedUser } from '@/lib/auth/organization-resolver'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { artifact_id, engagement_id, organization_id, response, comment } = body

  if (!artifact_id || !engagement_id || !organization_id || !response) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (!['acknowledged', 'changes_requested'].includes(response)) {
    return NextResponse.json({ error: 'Invalid response value' }, { status: 400 })
  }

  const sc = createServiceClient()
  if (!sc) return NextResponse.json({ error: 'Service client unavailable' }, { status: 500 })

  // Verify user is org member
  const { data: membership } = await sc
    .from('organization_memberships')
    .select('role, status')
    .eq('organization_id', organization_id)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  if (!membership && !user.isPlatformAdmin) {
    return NextResponse.json({ error: 'Organization membership required' }, { status: 403 })
  }

  // Verify artifact is published
  const { data: artifact } = await sc
    .from('engagement_artifacts')
    .select('status, requires_acknowledgment')
    .eq('id', artifact_id)
    .single()

  if (!artifact || artifact.status !== 'published') {
    return NextResponse.json({ error: 'Artifact not available for acknowledgment' }, { status: 400 })
  }

  // Upsert acknowledgment (unique on artifact_id + user_id)
  const { error } = await sc
    .from('engagement_acknowledgments')
    .upsert({
      artifact_id,
      engagement_id,
      organization_id,
      user_id: user.id,
      response,
      comment: comment || null,
    }, {
      onConflict: 'artifact_id,user_id',
    })

  if (error) {
    return NextResponse.json({ error: 'Failed to record acknowledgment', detail: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
