'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Phone, Clock, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ManagedVoiceWorkspaceClientProps {
  orgSlug: string
  orgName: string
  engagement: {
    id: string
    engagement_type: string
    status: string
    current_phase: string
    title: string
    statement: string | null
    starts_at: string | null
    ends_at: string | null
    health_status: string
    health_reason: string | null
  } | null
  intakeRequest: {
    id: string
    status: string
    created_at: string
    advisor_notes: string | null
    proposed_scope: string | null
  } | null
}

const PHASE_LABELS: Record<string, string> = {
  discovery: 'Discovery & Fit',
  scoping: 'Scoping',
  build: 'Build & Configure',
  testing: 'Testing & Hardening',
  deployment: 'Deployment',
  live: 'Live',
  support: 'Ongoing Support',
}

const STATUS_LABELS: Record<string, string> = {
  submitted: 'Request Submitted',
  reviewing: 'Under Review',
  qualified: 'Qualified',
  offered: 'Proposal Sent',
  accepted: 'Accepted',
  declined: 'Declined',
  archived: 'Archived',
}

export function ManagedVoiceWorkspaceClient({
  orgSlug,
  orgName,
  engagement,
  intakeRequest,
}: ManagedVoiceWorkspaceClientProps) {
  // No engagement and no intake request
  if (!engagement && !intakeRequest) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Managed AI Voice</h1>
          <p className="text-muted-foreground mt-1">{orgName}</p>
        </div>
        <Card>
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Start Your Voice Deployment</CardTitle>
            <CardDescription>
              Tell me about your call patterns, business rules, and what systems you need connected.
              I will tell you whether standard deployment covers it or you need a custom workflow.
              Deployments are limited and depend on availability.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/ai-voice-agent#request">
              <Button className="group">
                Request a Fit Call
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Intake submitted but no engagement yet
  if (!engagement && intakeRequest) {
    const statusLabel = STATUS_LABELS[intakeRequest.status] || intakeRequest.status
    const isProgressing = ['reviewing', 'qualified', 'offered'].includes(intakeRequest.status)

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Managed AI Voice</h1>
          <p className="text-muted-foreground mt-1">{orgName}</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              {isProgressing ? (
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              )}
              <div>
                <CardTitle className="text-lg">{statusLabel}</CardTitle>
                <CardDescription>
                  Submitted on {new Date(intakeRequest.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your request is in the queue. I will send an email with next steps, including a fit call
              invitation if your use case matches the deployment model.
            </p>

            {intakeRequest.advisor_notes && (
              <div className="rounded-lg border border-border p-4 bg-secondary/20">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Notes from Subodh</p>
                <p className="text-sm">{intakeRequest.advisor_notes}</p>
              </div>
            )}

            {intakeRequest.proposed_scope && (
              <div className="rounded-lg border border-border p-4">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Proposed Scope</p>
                <p className="text-sm">{intakeRequest.proposed_scope}</p>
              </div>
            )}

            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>
                Deployment slots are limited and depend on availability. If your request is accepted, you
                receive a custom proposal with scope and pricing via Stripe invoice.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Active engagement
  if (engagement) {
    const phaseLabel = PHASE_LABELS[engagement.current_phase] || engagement.current_phase
    const phases = ['discovery', 'scoping', 'build', 'testing', 'deployment', 'live']
    const currentPhaseIndex = phases.indexOf(engagement.current_phase)

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{engagement.title || 'Managed AI Voice'}</h1>
          <p className="text-muted-foreground mt-1">{orgName}</p>
        </div>

        {/* Phase Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Deployment Progress</CardTitle>
            <CardDescription>Current phase: {phaseLabel}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {phases.map((phase, i) => {
                const isComplete = i < currentPhaseIndex
                const isCurrent = i === currentPhaseIndex
                return (
                  <div key={phase} className="flex items-center gap-2 flex-shrink-0">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                        isComplete
                          ? 'bg-green-600 text-white'
                          : isCurrent
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {isComplete ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                    </div>
                    <span className={`text-xs ${isCurrent ? 'font-semibold' : 'text-muted-foreground'}`}>
                      {PHASE_LABELS[phase] || phase}
                    </span>
                    {i < phases.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground mx-1" />}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Engagement Details */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium capitalize">{engagement.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium capitalize">{engagement.engagement_type.replace(/_/g, ' ')}</span>
              </div>
              {engagement.starts_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Started</span>
                  <span className="font-medium">{new Date(engagement.starts_at).toLocaleDateString()}</span>
                </div>
              )}
              {engagement.ends_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Target End</span>
                  <span className="font-medium">{new Date(engagement.ends_at).toLocaleDateString()}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium capitalize">{engagement.health_status.replace(/_/g, ' ')}</span>
              </div>
              {engagement.health_reason && (
                <p className="text-muted-foreground text-xs mt-2">{engagement.health_reason}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {engagement.statement && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Deployment Scope</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{engagement.statement}</p>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return null
}
