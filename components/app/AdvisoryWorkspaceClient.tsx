'use client'

import Link from 'next/link'
import { LogOut, ArrowLeft, Briefcase, Calendar, FileText, Lightbulb, Users } from 'lucide-react'
import type { AuthenticatedUser, OrganizationContext } from '@/lib/auth/organization-resolver'
import { getEngagementTypeLabel, getEngagementStatusLabel } from '@/lib/auth/dashboard-types'

interface Engagement {
  id: string
  engagement_type: string
  status: string
  starts_at: string | null
  ends_at: string | null
}

interface AdvisoryWorkspaceClientProps {
  user: AuthenticatedUser
  ctx: OrganizationContext
  engagements: Engagement[]
}

export function AdvisoryWorkspaceClient({ user, ctx, engagements }: AdvisoryWorkspaceClientProps) {
  const { organization, organizationRole, isPlatformAdmin } = ctx
  const basePath = `/app/${organization.slug}`

  const activeEngagements = engagements.filter(e => e.status === 'active')
  const pastEngagements = engagements.filter(e => e.status !== 'active')

  async function handleLogout() {
    await fetch('/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2 min-w-0">
            <Link href="/app" className="font-semibold text-sm flex-shrink-0">SubodhKC</Link>
            <span className="text-muted-foreground text-sm">/</span>
            <Link href={basePath} className="text-sm truncate">{organization.name}</Link>
            <span className="text-muted-foreground text-sm">/</span>
            <span className="text-sm font-medium">Advisory</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 hover:bg-accent rounded-md"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Advisory</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Strategic counsel and governance advisory for {organization.name}
          </p>
        </div>

        {/* Active engagements */}
        {activeEngagements.length > 0 ? (
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Active Engagement
            </h2>
            <div className="space-y-3">
              {activeEngagements.map((eng) => (
                <div key={eng.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-sm">{getEngagementTypeLabel(eng.engagement_type)}</h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs bg-green-500/10 text-green-700 px-2 py-0.5 rounded">
                          {getEngagementStatusLabel(eng.status)}
                        </span>
                        {eng.starts_at && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(eng.starts_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section>
            <div className="border rounded-lg p-8 text-center">
              <Briefcase className="h-10 w-10 text-primary mx-auto mb-3" />
              <h2 className="text-lg font-semibold">No Active Advisory Engagement</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Your organization has advisory access. Once an engagement is set up, details will appear here.
              </p>
            </div>
          </section>
        )}

        {/* What you get */}
        <section>
          <h2 className="text-lg font-semibold mb-3">What&apos;s Included</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="border rounded-lg p-4">
              <Lightbulb className="h-5 w-5 text-primary mb-2" />
              <h3 className="font-medium text-sm">Strategic Guidance</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Architecture decisions, technology selection, and roadmap planning sessions.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <FileText className="h-5 w-5 text-primary mb-2" />
              <h3 className="font-medium text-sm">Governance Review</h3>
              <p className="text-xs text-muted-foreground mt-1">
                AI governance framework reviews, policy recommendations, and compliance guidance.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <Users className="h-5 w-5 text-primary mb-2" />
              <h3 className="font-medium text-sm">Stakeholder Alignment</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Leadership briefings and cross-functional alignment on AI initiatives.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <Briefcase className="h-5 w-5 text-primary mb-2" />
              <h3 className="font-medium text-sm">Ongoing Support</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Priority access for questions, reviews, and ad-hoc consultations.
              </p>
            </div>
          </div>
        </section>

        {/* Past engagements */}
        {pastEngagements.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3">Past Engagements</h2>
            <div className="space-y-2">
              {pastEngagements.map((eng) => (
                <div key={eng.id} className="border rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">{getEngagementTypeLabel(eng.engagement_type)}</span>
                    {eng.ends_at && (
                      <span className="text-xs text-muted-foreground ml-2">
                        Ended {new Date(eng.ends_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                  <span className="text-xs bg-accent px-2 py-0.5 rounded">
                    {getEngagementStatusLabel(eng.status)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        <div>
          <Link href={basePath} className="text-sm text-primary hover:underline inline-flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" />
            Back to {organization.name}
          </Link>
        </div>
      </main>
    </div>
  )
}
