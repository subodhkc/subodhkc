import { redirect } from 'next/navigation'
import { resolveDashboardData } from '@/lib/auth/dashboard-resolver'
import { GlobalDashboardClient } from '@/components/app/GlobalDashboardClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function AppShellPage() {
  const data = await resolveDashboardData()
  if (!data) redirect('/login?next=/app')

  return <GlobalDashboardClient data={data} />
}
