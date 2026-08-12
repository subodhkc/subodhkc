import { redirect } from 'next/navigation'
import { getAuthenticatedUser } from '@/lib/auth/organization-resolver'
import { InviteAcceptClient } from '@/components/app/InviteAcceptClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function InvitePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; email?: string }>
}) {
  const params = await searchParams
  const user = await getAuthenticatedUser()

  if (!user) {
    const loginUrl = new URL('/login', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
    loginUrl.searchParams.set('next', `/invite?token=${params.token || ''}&email=${params.email || ''}`)
    redirect(loginUrl.toString())
  }

  return (
    <InviteAcceptClient
      token={params.token || ''}
      email={params.email || ''}
    />
  )
}
