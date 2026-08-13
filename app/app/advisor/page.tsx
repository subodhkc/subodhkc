import { redirect } from 'next/navigation'
import { getAuthenticatedUser } from '@/lib/auth/organization-resolver'
import { getAdvisorPortfolio } from '@/lib/engagement/queries'
import { AdvisorConsoleClient } from '@/components/app/advisor/AdvisorConsoleClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function AdvisorConsolePage() {
  const user = await getAuthenticatedUser()
  if (!user) redirect('/login?next=/app/advisor')

  const portfolio = await getAdvisorPortfolio(user.id)

  return <AdvisorConsoleClient user={user} portfolio={portfolio} />
}
