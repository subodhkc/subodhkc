'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Info } from 'lucide-react'
import type { AuthenticatedUser, OrganizationContext } from '@/lib/auth/organization-resolver'
import { getOfferingLabel, getOfferingDescription, getOfferingKindLabel } from '@/lib/auth/dashboard-types'

interface OfferingAccessClientProps {
  user: AuthenticatedUser
  ctx: OrganizationContext
  offeringKey: string
}

export function OfferingAccessClient({ user, ctx, offeringKey }: OfferingAccessClientProps) {
  const router = useRouter()
  const entitlement = ctx.entitlements.find(e => e.offering_key === offeringKey)
  const role = ctx.offeringRoles.find(r => r.offering_key === offeringKey)

  useEffect(() => {
    if (offeringKey === 'school_pickup' && entitlement?.effective_status === 'active') {
      router.replace(`/app/${ctx.organization.slug}/school-pickup`)
    }
  }, [offeringKey, entitlement, ctx.organization.slug, router])

  const offeringName = entitlement?.offering_name || getOfferingLabel(offeringKey)
  const offeringDesc = getOfferingDescription(offeringKey)
  const isExternal = offeringKey === 'kestrel' || offeringKey === 'haiec'

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
          <span className="text-sm font-medium">{offeringName}</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{offeringName}</h1>
          {offeringDesc && (
            <p className="text-sm text-muted-foreground mt-1">{offeringDesc}</p>
          )}
        </div>

        <div className="border rounded-lg p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Organization</span>
            <span>{ctx.organization.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Access Status</span>
            <span className={entitlement?.effective_status === 'active' ? 'text-green-600' : 'text-yellow-600'}>
              {entitlement?.effective_status || 'none'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Your Role</span>
            <span>{role?.role || 'none'}</span>
          </div>
        </div>

        {isExternal ? (
          <div className="border rounded-lg p-4 bg-accent/30 space-y-2">
            <div className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-primary" />
              <h2 className="font-medium text-sm">External Platform</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {offeringName} is managed as an external engagement. Access is provided through your organization&apos;s
              subscription. Contact your account manager for platform credentials and onboarding.
            </p>
          </div>
        ) : (
          <div className="border rounded-lg p-4 bg-accent/30 space-y-2">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              <h2 className="font-medium text-sm">Access Verified</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              You have verified access to {offeringName} for {ctx.organization.name}.
              This {getOfferingKindLabel(offeringKey).toLowerCase()} is part of your organization&apos;s active services.
            </p>
          </div>
        )}

        <div>
          <Link
            href={`/app/${ctx.organization.slug}`}
            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to {ctx.organization.name}
          </Link>
        </div>
      </main>
    </div>
  )
}
