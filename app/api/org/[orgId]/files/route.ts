import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, resolveOrganizationContext, AuthError } from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'
import { createSignedUploadUrl, listOrgFiles, deleteOrgFile } from '@/lib/storage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST: Get a signed upload URL for a file
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  const { orgId } = await params
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  let ctx
  try {
    ctx = await resolveOrganizationContext(user, orgId)
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.code }, { status: 403 })
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  const isAdmin = ctx.organizationRole === 'owner' || ctx.organizationRole === 'admin' || ctx.isPlatformAdmin
  if (!isAdmin) return NextResponse.json({ error: 'unauthorized' }, { status: 403 })

  const body = await request.json()
  const { filePath, contentType, action } = body

  if (action === 'list') {
    const files = await listOrgFiles({ orgId, folder: body.folder })
    return NextResponse.json({ files })
  }

  if (action === 'delete') {
    if (!filePath) return NextResponse.json({ error: 'missing_filePath' }, { status: 400 })
    const success = await deleteOrgFile({ orgId, filePath })
    if (!success) return NextResponse.json({ error: 'delete_failed' }, { status: 500 })

    const serviceClient = createServiceClient()
    if (serviceClient) {
      await serviceClient.from('audit_events').insert({
        organization_id: orgId,
        actor_user_id: user.id,
        action: 'file.deleted',
        entity_type: 'storage',
        entity_id: filePath,
      })
    }

    return NextResponse.json({ success: true })
  }

  // Default action: create signed upload URL
  if (!filePath || !contentType) {
    return NextResponse.json({ error: 'missing_filePath_or_contentType' }, { status: 400 })
  }

  const result = await createSignedUploadUrl({ orgId, filePath, contentType })
  if (!result) return NextResponse.json({ error: 'upload_url_failed' }, { status: 500 })

  const serviceClient = createServiceClient()
  if (serviceClient) {
    await serviceClient.from('audit_events').insert({
      organization_id: orgId,
      actor_user_id: user.id,
      action: 'file.upload_url_created',
      entity_type: 'storage',
      entity_id: result.path,
      metadata: { contentType },
    })
  }

  return NextResponse.json({
    signedUrl: result.url,
    path: result.path,
  })
}

// GET: Get a signed download URL for a file
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  const { orgId } = await params
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  let ctx
  try {
    ctx = await resolveOrganizationContext(user, orgId)
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.code }, { status: 403 })
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const filePath = searchParams.get('path')

  if (!filePath) return NextResponse.json({ error: 'missing_path' }, { status: 400 })

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  const { data } = await serviceClient
    .storage
    .from('org-files')
    .createSignedUrl(`${orgId}/${filePath}`, 3600)

  if (!data?.signedUrl) return NextResponse.json({ error: 'url_failed' }, { status: 500 })

  return NextResponse.json({ signedUrl: data.signedUrl })
}
