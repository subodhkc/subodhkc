import { redirect } from 'next/navigation'
import { requirePlatformAdmin, type AuthenticatedUser } from '@/lib/auth/organization-resolver'
import { createServiceClient } from '@/lib/supabase'
import { PlatformAdminClient } from '@/components/app/PlatformAdminClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function PlatformAdminPage() {
  let user: AuthenticatedUser
  try {
    user = await requirePlatformAdmin()
  } catch {
    redirect('/app')
  }

  const serviceClient = createServiceClient()
  if (!serviceClient) redirect('/login?error=config')

  const { data: organizations } = await serviceClient
    .from('organizations')
    .select('id, name, slug, organization_kind, status, created_at')
    .order('created_at', { ascending: false })

  const { data: offerings } = await serviceClient
    .from('offerings')
    .select('id, offering_key, name, offering_kind, status')
    .order('name')

  return (
    <PlatformAdminClient
      user={user}
      organizations={organizations || []}
      offerings={offerings || []}
    />
  )
}
