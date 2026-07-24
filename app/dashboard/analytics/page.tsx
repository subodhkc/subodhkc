import { cookies } from 'next/headers'
import { LoginForm } from './login-form'
import { AnalyticsDashboard } from './dashboard'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function Page() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get('analytics_auth')
  const expectedToken = process.env.ANALYTICS_API_TOKEN

  const isAuthenticated = !!expectedToken && authCookie?.value === expectedToken

  if (!isAuthenticated) {
    return <LoginForm />
  }

  return <AnalyticsDashboard />
}
