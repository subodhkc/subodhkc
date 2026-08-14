'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Shield, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface SecurityReviewIntakeStatusProps {
  reviewTitle: string
  intakeRequest: {
    id: string
    status: string
    created_at: string
    advisor_notes: string | null
    proposed_scope: string | null
    proposed_price_cents: number | null
  } | null
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

export function SecurityReviewIntakeStatus({
  reviewTitle,
  intakeRequest,
}: SecurityReviewIntakeStatusProps) {
  if (!intakeRequest) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{reviewTitle}</h1>
        </div>
        <Card>
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Request a Security Review</CardTitle>
            <CardDescription>
              Tell me about your application, AI features, and regulatory environment. I will tell
              you whether a focused, multi-tenant, or full SaaS + AI security review fits. Reviews
              are limited and scoped based on architecture.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/saas-security-review#request">
              <Button className="group">
                Request a Review
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusLabel = STATUS_LABELS[intakeRequest.status] || intakeRequest.status
  const isProgressing = ['reviewing', 'qualified', 'offered'].includes(intakeRequest.status)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{reviewTitle}</h1>
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
            Your request is in the queue. I will send an email with next steps, including scope
            confirmation and a custom proposal if your application fits the review model.
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
              Security review slots are limited and depend on availability. If your request is accepted, you
              receive a custom proposal with scope and pricing via Stripe invoice.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
