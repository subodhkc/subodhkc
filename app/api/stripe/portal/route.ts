import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, resolveOrganizationContext, AuthError } from '@/lib/auth/organization-resolver'
import { getStripeCustomerId } from '@/lib/stripe/checkout'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/stripe/portal
 * Create a Stripe Customer Portal session for the authenticated user's organization.
 * Redirects the customer to Stripe-hosted billing management.
 */
export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json()
  const { orgSlug } = body as { orgSlug: string }
  if (!orgSlug) return NextResponse.json({ error: 'orgSlug required' }, { status: 400 })

  let ctx
  try {
    ctx = await resolveOrganizationContext(user, orgSlug)
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.code }, { status: 403 })
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  // Restrict billing portal to owners and admins (platform admins bypass)
  if (!ctx.isPlatformAdmin) {
    const role = ctx.organizationRole
    if (role !== 'owner' && role !== 'admin') {
      return NextResponse.json(
        { error: 'insufficient_role', message: 'Only organization owners or admins can access billing' },
        { status: 403 }
      )
    }
  }

  const customerId = await getStripeCustomerId(ctx.organization.id)
  if (!customerId) {
    return NextResponse.json({ error: 'no_stripe_customer' }, { status: 404 })
  }

  const { getStripe } = await import('@/lib/stripe/client')
  const stripe = getStripe()
  if (!stripe) return NextResponse.json({ error: 'stripe_not_configured' }, { status: 500 })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://subodhkc.com'

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${siteUrl}/app/${orgSlug}/advisor-desk`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Customer Portal session error:', err.message)
    return NextResponse.json({ error: 'portal_session_failed' }, { status: 500 })
  }
}
