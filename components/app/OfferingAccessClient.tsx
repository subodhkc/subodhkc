'use client'

import Link from 'next/link'
import type { AuthenticatedUser, OrganizationContext } from '@/lib/auth/organization-resolver'

interface OfferingAccessClientProps {
  user: AuthenticatedUser
  ctx: OrganizationContext
  offeringKey: string
}

export function OfferingAccessClient({ user, ctx, offeringKey }: OfferingAccessClientProps) {
  const entitlement = ctx.entitlements.find(e => e.offering_key === offeringKey)
  const role = ctx.offeringRoles.find(r => r.offering_key === offeringKey)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="px-4 h-14 flex items-center gap-4">
          <Link href="/app" className="font-semibold text-sm">SubodhKC</Link>
          <span className="text-muted-foreground">/</span>
          <Link href={`/app/${ctx.organization.slug}`} className="text-sm">
            {ctx.organization.name}
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">{entitlement?.offering_name || offeringKey}</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">
          {entitlement?.offering_name || offeringKey}
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Offering access verified for {ctx.organization.name}
        </p>

        <div className="border rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Organization</span>
            <span>{ctx.organization.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Entitlement Status</span>
            <span className={entitlement?.effective_status === 'active' ? 'text-green-600' : 'text-yellow-600'}>
              {entitlement?.effective_status || 'none'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Your Role</span>
            <span>{role?.role || 'none'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Org Role</span>
            <span>{ctx.organizationRole || 'admin (platform)'}</span>
          </div>
        </div>

        <div className="mt-6 border rounded-lg p-4 bg-accent/30">
          <p className="text-sm text-muted-foreground">
            This is a placeholder for the <strong>{offeringKey}</strong> offering.
            Domain-specific functionality will be built here once the control plane is verified.
          </p>
        </div>
      </main>
    </div>
  )
}
