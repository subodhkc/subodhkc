'use client'

import Link from 'next/link'
import {
  LogOut,
  ArrowLeft,
  MapPin,
  Target,
  Search,
  Lightbulb,
  CheckCircle2,
  Circle,
  ArrowRight,
  FileText,
} from 'lucide-react'
import type { AuthenticatedUser, OrganizationContext } from '@/lib/auth/organization-resolver'

interface BlueprintEngagement {
  id: string
  engagement_type: string
  status: string
  starts_at: string | null
  ends_at: string | null
  title: string | null
  statement: string | null
  in_scope: string | null
  out_of_scope: string | null
  client_lead: string | null
  advisor_lead: string | null
  current_phase: string
  health_status: string
  health_reason: string | null
  completed_at: string | null
  completed_reason: string | null
}

interface BlueprintWorkspaceClientProps {
  user: AuthenticatedUser
  ctx: OrganizationContext
  engagement: BlueprintEngagement
  stage: string
}

const stages = ['Intake', 'Workflow Analysis', 'Recommendation', 'Delivered']

const stageIcons: Record<string, typeof Circle> = {
  'Intake': Circle,
  'Workflow Analysis': Search,
  'Recommendation': Lightbulb,
  'Delivered': CheckCircle2,
}

export function BlueprintWorkspaceClient({
  user,
  ctx,
  engagement,
  stage,
}: BlueprintWorkspaceClientProps) {
  const { organization } = ctx
  const basePath = `/app/${organization.slug}`
  const currentStageIndex = stages.indexOf(stage)

  async function handleLogout() {
    await fetch('/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2 min-w-0">
            <Link href="/app" className="font-semibold text-sm flex-shrink-0">SubodhKC</Link>
            <span className="text-muted-foreground text-sm">/</span>
            <Link href={basePath} className="text-sm truncate">{organization.name}</Link>
            <span className="text-muted-foreground text-sm">/</span>
            <span className="text-sm font-medium">Blueprint</span>
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

      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-10">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Automation Blueprint</h1>
          <p className="text-sm text-muted-foreground mt-1">
            One workflow. A clear recommendation before implementation.
          </p>
        </div>

        {/* Where We Are */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            Where We Are
          </h2>
          <div className="border rounded-lg p-5 bg-card">
            <div className="flex items-center gap-2 flex-wrap">
              {stages.map((s, i) => {
                const StageIcon = stageIcons[s] || Circle
                const isComplete = i < currentStageIndex
                const isCurrent = i === currentStageIndex
                return (
                  <div key={s} className="flex items-center">
                    {i > 0 && <div className={`w-8 h-px ${isComplete ? 'bg-primary' : 'bg-border'}`} />}
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded ${isCurrent ? 'bg-primary/10' : ''}`}>
                      {isComplete ? (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      ) : (
                        <StageIcon className={`h-4 w-4 ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`} />
                      )}
                      <span className={`text-sm ${isCurrent ? 'font-medium text-primary' : isComplete ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {s}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Blueprint Scope */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-muted-foreground" />
            Blueprint Scope
          </h2>
          <div className="border rounded-lg p-5 bg-card space-y-4">
            {engagement.title && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Business Objective</p>
                <p className="text-sm mt-1">{engagement.title}</p>
              </div>
            )}
            {engagement.statement && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Workflow Being Evaluated</p>
                <p className="text-sm mt-1">{engagement.statement}</p>
              </div>
            )}
            {engagement.in_scope && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Systems Involved</p>
                <p className="text-sm mt-1">{engagement.in_scope}</p>
              </div>
            )}
            {engagement.out_of_scope && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Primary Constraints</p>
                <p className="text-sm mt-1">{engagement.out_of_scope}</p>
              </div>
            )}
            {engagement.client_lead && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Your Lead</p>
                <p className="text-sm mt-1">{engagement.client_lead}</p>
              </div>
            )}
            {engagement.advisor_lead && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Advisor Lead</p>
                <p className="text-sm mt-1">{engagement.advisor_lead}</p>
              </div>
            )}
            {!engagement.title && !engagement.statement && !engagement.in_scope && (
              <p className="text-sm text-muted-foreground">
                Scope details will appear here once intake is complete.
              </p>
            )}
          </div>
        </section>

        {/* What We Are Evaluating */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            What We Are Evaluating
          </h2>
          <div className="border rounded-lg p-5 bg-card">
            <p className="text-sm text-muted-foreground mb-4">
              This Blueprint evaluates one workflow end-to-end to determine whether automation makes sense and what approach to take.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {[
                'Current workflow',
                'Friction / opportunity',
                'What should remain human',
                'What can be automated',
                'Existing software options',
                'Systems & integrations',
                'Business rules',
                'Exceptions',
                'Failure / fallback behavior',
                'Data / security considerations',
                'Measurement / success condition',
                'Cost / complexity range',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Circle className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recommendation */}
        {currentStageIndex >= 2 && (
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Recommendation
            </h2>
            <div className="border rounded-lg p-5 bg-card">
              {engagement.completed_reason ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">{engagement.completed_reason}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your advisor has completed the analysis. See the deliverable below for the full recommendation and rationale.
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Your recommendation will appear here once analysis is complete.
                </p>
              )}
            </div>
          </section>
        )}

        {/* Next Step */}
        {currentStageIndex >= 2 && (
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              Next Step
            </h2>
            <div className="border rounded-lg p-5 bg-card">
              <p className="text-sm text-muted-foreground">
                Your advisor will outline the recommended next step, which may include standard deployment, custom implementation pilot, security review, or no implementation recommended.
              </p>
            </div>
          </section>
        )}

        {/* Deliverable */}
        {currentStageIndex >= 3 && (
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              Deliverable
            </h2>
            <div className="border rounded-lg p-5 bg-card">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm font-medium">AI Automation Blueprint</p>
                  <p className="text-xs text-muted-foreground">
                    Published {engagement.completed_at
                      ? new Date(engagement.completed_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                      : ''}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                The full Blueprint document with recommendation, rationale, and implementation guidance will be available here.
              </p>
            </div>
          </section>
        )}

        {/* Back */}
        <div>
          <Link
            href={basePath}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {organization.name}
          </Link>
        </div>
      </main>
    </div>
  )
}
