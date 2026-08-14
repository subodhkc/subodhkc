import { redirect } from 'next/navigation'
import { getAuthenticatedUser, resolveOrganizationContext, AuthError, requireOfferingAccess } from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'
import { ManagedVoiceWorkspaceClient } from '@/components/app/ManagedVoiceWorkspaceClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface PageProps {
  params: Promise<{ orgSlug: string }>
}

export default async function ManagedVoicePage({ params }: PageProps) {
  const { orgSlug } = await params
  const user = await getAuthenticatedUser()
  if (!user) redirect(`/login?redirect=/app/${orgSlug}/managed-voice`)

  let ctx
  try {
    ctx = await resolveOrganizationContext(user, orgSlug)
  } catch (err) {
    if (err instanceof AuthError) redirect('/dashboard')
    throw err
  }

  try {
    await requireOfferingAccess(ctx, 'managed_voice')
  } catch {
    redirect(`/app/${orgSlug}`)
  }

  const sc = createServiceClient()
  if (!sc) redirect('/dashboard')

  // Find the managed voice engagement
  const { data: offeringData } = await sc
    .from('offerings')
    .select('id')
    .eq('offering_key', 'managed_voice')
    .single()

  let engagement: any = null
  if (offeringData) {
    const { data: orgEngagements } = await sc
      .from('engagements')
      .select('id')
      .eq('organization_id', ctx.organization.id)
    const engIds = (orgEngagements || []).map(e => e.id)
    let engOffering: { engagement_id: string } | null = null
    if (engIds.length > 0) {
      const { data: links } = await sc
        .from('engagement_offerings')
        .select('engagement_id')
        .in('engagement_id', engIds)
        .eq('offering_id', offeringData.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      engOffering = links
    }

    if (engOffering) {
      const { data: eng } = await sc
        .from('engagements')
        .select('id, engagement_type, status, current_phase, title, statement, starts_at, ends_at, health_status, health_reason')
        .eq('id', engOffering.engagement_id)
        .single()
      engagement = eng
    }
  }

  // Check for intake request status
  const { data: intakeRequests } = await sc
    .from('voice_intake_requests')
    .select('id, status, created_at, advisor_notes, proposed_scope')
    .or(`email.eq.${user.email},organization_id.eq.${ctx.organization.id}`)
    .order('created_at', { ascending: false })
    .limit(1)

  const intakeRequest = intakeRequests?.[0] || null

  return (
    <ManagedVoiceWorkspaceClient
      orgSlug={orgSlug}
      orgName={ctx.organization.name}
      engagement={engagement}
      intakeRequest={intakeRequest}
    />
  )
}
