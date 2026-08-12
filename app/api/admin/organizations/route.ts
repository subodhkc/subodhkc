import { NextRequest, NextResponse } from 'next/server'
import { requirePlatformAdmin } from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    await requirePlatformAdmin()
  } catch {
    return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
  }

  const body = await request.json()
  const { name, slug, organization_kind } = body

  if (!name || typeof name !== 'string') {
    return NextResponse.json({ error: 'name_required' }, { status: 400 })
  }

  const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  if (!finalSlug || !/^[a-z0-9-]+$/.test(finalSlug)) {
    return NextResponse.json({ error: 'invalid_slug' }, { status: 400 })
  }

  const validKinds = ['business', 'school', 'nonprofit', 'individual', 'internal', 'other']
  if (!validKinds.includes(organization_kind)) {
    return NextResponse.json({ error: 'invalid_kind' }, { status: 400 })
  }

  const serviceClient = createServiceClient()
  if (!serviceClient) return NextResponse.json({ error: 'config' }, { status: 500 })

  const { data: org, error } = await serviceClient
    .from('organizations')
    .insert({
      name,
      slug: finalSlug,
      organization_kind,
    })
    .select('id, slug')
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'slug_taken' }, { status: 409 })
    }
    return NextResponse.json({ error: 'create_failed' }, { status: 500 })
  }

  return NextResponse.json({ success: true, id: org.id, slug: org.slug })
}
