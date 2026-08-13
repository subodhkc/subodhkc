import { redirect } from 'next/navigation'
import { getAuthenticatedUser, getUserOrganizations } from '@/lib/auth/organization-resolver'
import { AccountClient } from '@/components/app/AccountClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function AccountPage() {
  const user = await getAuthenticatedUser()
  if (!user) redirect('/login?next=/app/account')

  const organizations = await getUserOrganizations(user)

  return <AccountClient user={user} organizations={organizations} />
}
