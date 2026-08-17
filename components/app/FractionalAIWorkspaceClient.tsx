'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LogOut, ArrowLeft, Briefcase, Calendar, Code, Cpu, GitBranch, Zap, Sun, AlertCircle, FileText, CheckCircle2, Clock, ArrowRight } from 'lucide-react'
import type { AuthenticatedUser, OrganizationContext } from '@/lib/auth/organization-resolver'
import { getEngagementTypeLabel, getEngagementStatusLabel } from '@/lib/auth/dashboard-types'

interface Engagement {
  id: string
  engagement_type: string
  status: string
  starts_at: string | null
  ends_at: string | null
}

interface FractionalAIWorkspaceClientProps {
  user: AuthenticatedUser
  ctx: OrganizationContext
  engagements: Engagement[]
}

export function FractionalAIWorkspaceClient({ user, ctx, engagements }: FractionalAIWorkspaceClientProps) {
  const { organization, organizationRole, isPlatformAdmin } = ctx
  const basePath = `/app/${organization.slug}`

  const activeEngagements = engagements.filter(e => e.status === 'active')
  const pastEngagements = engagements.filter(e => e.status !== 'active')

  // Today view data
  const [todayData, setTodayData] = useState<{
    decisions: any[]
    workOrders: any[]
    actions: any[]
    sessions: any[]
  }>({ decisions: [], workOrders: [], actions: [], sessions: [] })
  const [todayLoading, setTodayLoading] = useState(true)

  useEffect(() => {
    async function fetchToday() {
      setTodayLoading(true)
      try {
        const [woRes] = await Promise.all([
          fetch(`/api/commercial/work-orders?orgSlug=${organization.slug}`).then(r => r.ok ? r.json() : { workOrders: [] }).catch(() => ({ workOrders: [] })),
        ])
        const wos = Array.isArray(woRes.workOrders) ? woRes.workOrders : []
        const active = wos.filter((w: any) => ['in_progress', 'in_review', 'paid', 'scoped', 'needs_client_input', 'delivered'].includes(w.status))
        const needsInput = wos.filter((w: any) => w.status === 'needs_client_input')
        const delivered = wos.filter((w: any) => w.status === 'delivered')
        setTodayData({
          decisions: [],
          workOrders: active,
          actions: needsInput,
          sessions: [],
        })
      } catch {
        // silent
      } finally {
        setTodayLoading(false)
      }
    }
    fetchToday()
  }, [organization.slug])

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
            <span className="text-sm font-medium">Fractional AI</span>
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
          <h1 className="text-2xl font-bold tracking-tight">Fractional AI</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Embedded AI leadership and hands-on engineering for {organization.name}
          </p>
        </div>

        {/* Today view */}
        <section>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Sun className="h-5 w-5" />
            Today
          </h2>
          {todayLoading ? (
            <div className="border rounded-lg p-6 text-center text-sm text-muted-foreground">Loading...</div>
          ) : todayData.workOrders.length === 0 && todayData.actions.length === 0 ? (
            <div className="border rounded-lg p-6 text-center">
              <CheckCircle2 className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Nothing needs attention right now.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Work Orders */}
              {todayData.workOrders.length > 0 && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-medium">Work Orders ({todayData.workOrders.length})</h3>
                  </div>
                  <div className="space-y-1.5">
                    {todayData.workOrders.map((wo: any) => (
                      <Link key={wo.id} href={`${basePath}/work-orders/${wo.id}`}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-accent/5 group">
                        <span className="text-xs font-mono text-muted-foreground">{wo.work_order_number}</span>
                        <span className="text-sm flex-1 truncate">{wo.title}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-muted capitalize">{wo.status.replace(/_/g, ' ')}</span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {/* Actions needing input */}
              {todayData.actions.length > 0 && (
                <div className="border rounded-lg p-4 border-amber-500/20 bg-amber-500/5">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <h3 className="text-sm font-medium">Needs Your Input ({todayData.actions.length})</h3>
                  </div>
                  <div className="space-y-1.5">
                    {todayData.actions.map((wo: any) => (
                      <Link key={wo.id} href={`${basePath}/work-orders/${wo.id}`}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-amber-500/10 group">
                        <span className="text-xs font-mono text-muted-foreground">{wo.work_order_number}</span>
                        <span className="text-sm flex-1 truncate">{wo.title}</span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-amber-600" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

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
              <h2 className="text-lg font-semibold">No Active Fractional AI Engagement</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Your organization has fractional AI access. Once an engagement is set up, details will appear here.
              </p>
            </div>
          </section>
        )}

        {/* What you get */}
        <section>
          <h2 className="text-lg font-semibold mb-3">What&apos;s Included</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="border rounded-lg p-4">
              <Cpu className="h-5 w-5 text-primary mb-2" />
              <h3 className="font-medium text-sm">AI Architecture</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Hands-on design and implementation of AI systems, pipelines, and infrastructure.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <Code className="h-5 w-5 text-primary mb-2" />
              <h3 className="font-medium text-sm">Engineering Leadership</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Technical direction, code review, and team mentorship on AI best practices.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <GitBranch className="h-5 w-5 text-primary mb-2" />
              <h3 className="font-medium text-sm">Delivery &amp; Roadmap</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Sprint planning, technical debt management, and delivery accountability.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <Zap className="h-5 w-5 text-primary mb-2" />
              <h3 className="font-medium text-sm">Rapid Prototyping</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Fast iteration on proofs of concept, prototypes, and production-ready features.
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
