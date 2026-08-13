import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth/organization-resolver'
import { resolveSchoolContext, SchoolAuthError } from '@/lib/auth/school-resolver'
import { createServerClient, createServiceClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orgSlug: string; siteSlug: string; credentialId: string }> }
) {
  const { orgSlug, siteSlug, credentialId } = await params
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  let ctx
  try {
    ctx = await resolveSchoolContext(user, orgSlug, siteSlug)
  } catch (err) {
    if (err instanceof SchoolAuthError) {
      return NextResponse.json({ error: err.code }, { status: 403 })
    }
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  if (!ctx.canIssueCredentials) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
  }

  const body = await request.json().catch(() => ({}))
  const { reason } = body

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  // Verify credential belongs to this site
  const { data: cred, error: credError } = await serviceClient
    .from('pickup_credentials')
    .select('id, status')
    .eq('id', credentialId)
    .eq('organization_id', ctx.organization.organization.id)
    .eq('school_site_id', ctx.site.id)
    .single()

  if (credError || !cred) {
    return NextResponse.json({ error: 'credential_not_found' }, { status: 404 })
  }

  if (cred.status !== 'active') {
    return NextResponse.json({ error: 'credential_not_active' }, { status: 400 })
  }

  const supabase = await createServerClient()
  if (!supabase) return NextResponse.json({ error: 'config' }, { status: 500 })

  const { error } = await supabase.rpc('revoke_credential', {
    p_credential_id: credentialId,
    p_reason: reason || 'Revoked by admin',
  })

  if (error) {
    if (error.message.includes('UNAUTHORIZED')) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
    }
    return NextResponse.json({ error: 'revoke_failed' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
