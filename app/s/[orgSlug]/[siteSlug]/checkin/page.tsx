import { redirect } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function SharedCheckinRedirect({
  params,
  searchParams,
}: {
  params: Promise<{ orgSlug: string; siteSlug: string }>
  searchParams: Promise<{ t?: string }>
}) {
  const { orgSlug, siteSlug } = await params
  const { t: token } = await searchParams

  if (!token) {
    redirect('/login?context=family&error=no_code')
  }

  const serviceClient = createServiceClient()
  if (!serviceClient) {
    redirect('/login?context=family&error=config')
  }

  // Verify the token belongs to this site
  const { data: org } = await serviceClient
    .from('organizations')
    .select('id')
    .eq('slug', orgSlug)
    .eq('status', 'active')
    .single()

  if (!org) {
    redirect('/login?context=family&error=invalid')
  }

  const { data: site } = await serviceClient
    .from('school_sites')
    .select('id')
    .eq('organization_id', org.id)
    .eq('slug', siteSlug)
    .eq('status', 'active')
    .single()

  if (!site) {
    redirect('/login?context=family&error=invalid')
  }

  // Redirect to family portal with the checkin code
  // Family portal will handle auth redirect if not signed in
  redirect(`/family?site=${site.id}&code=${token}`)
}
