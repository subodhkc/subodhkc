'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  LogOut,
  ArrowLeft,
  Shield,
  Target,
  CheckCircle2,
  AlertCircle,
  Bug,
  FileText,
  ChevronDown,
  ChevronRight,
  Lock,
  Eye,
  RefreshCw,
  Scale,
  ExternalLink,
} from 'lucide-react'
import type { AuthenticatedUser, OrganizationContext } from '@/lib/auth/organization-resolver'

interface Authorization {
  id: string
  status: string
  scope_description: string
  in_scope_systems: string[]
  out_of_scope_systems: string[]
  testing_methods: string[]
  authorized_at: string | null
  expires_at: string | null
}

interface Finding {
  id: string
  title: string
  description: string
  severity: string
  category: string | null
  affected_component: string | null
  status: string
  remediation: string | null
  evidence_reference: string | null
  retest_notes: string | null
  retested_at: string | null
  display_order: number
}

interface ChecklistItem {
  id: string
  checklist_item: string
  item_type: string
  status: string
  notes: string | null
  display_order: number
}

interface ReviewRecord {
  id: string
  title: string
  summary: string | null
  scope_description: string | null
  status: string
  published_at: string | null
  finding_count: number
  critical_count: number
  high_count: number
  medium_count: number
  low_count: number
  informational_count: number
}

interface CoverageArea {
  id: string
  area_key: string
  area_label: string
  status: string
  notes: string | null
  display_order: number
}

interface SecurityReviewWorkspaceClientProps {
  user: AuthenticatedUser
  ctx: OrganizationContext
  reviewTitle: string
  engagement: {
    id: string
    status: string
    current_phase: string
    title: string | null
    statement: string | null
    starts_at: string | null
    ends_at: string | null
  }
  authorization: Authorization | null
  findings: Finding[]
  checklist: ChecklistItem[]
  reviewRecords: ReviewRecord[]
  coverageAreas?: CoverageArea[]
}

const severityColors: Record<string, string> = {
  critical: 'bg-red-500/10 text-red-600 border-red-500/20',
  high: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  medium: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  low: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  informational: 'bg-muted text-muted-foreground border-border',
}

const findingStatusLabels: Record<string, string> = {
  finding_open: 'Open',
  fix_reported: 'Remediation in Progress',
  ready_for_retest: 'Ready for Retest',
  retest_verified: 'Retest Verified',
  additional_work_recommended: 'Additional Work Recommended',
  risk_accepted: 'Risk Accepted',
  not_retested: 'Not Retested',
}

const findingStatusColors: Record<string, string> = {
  finding_open: 'bg-red-500/10 text-red-600 border-red-500/20',
  fix_reported: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  ready_for_retest: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  retest_verified: 'bg-green-500/10 text-green-600 border-green-500/20',
  additional_work_recommended: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  risk_accepted: 'bg-muted text-muted-foreground border-border',
  not_retested: 'bg-muted text-muted-foreground border-border',
}

const checklistStatusLabels: Record<string, string> = {
  pending: 'Needs Input',
  provided: 'Provided',
  not_applicable: 'Not Applicable',
  blocked: 'Blocked',
}

const checklistStatusColors: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  provided: 'bg-green-500/10 text-green-600 border-green-500/20',
  not_applicable: 'bg-muted text-muted-foreground border-border',
  blocked: 'bg-red-500/10 text-red-600 border-red-500/20',
}

const coverageStatusLabels: Record<string, string> = {
  pending: 'Pending',
  reviewed: 'Reviewed',
  verified: 'Verified',
  improvement_identified: 'Improvement Identified',
  needs_evidence: 'Needs Additional Evidence',
  not_applicable: 'Not Applicable',
  out_of_scope: 'Outside Current Scope',
}

const coverageStatusColors: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  reviewed: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  verified: 'bg-green-500/10 text-green-600 border-green-500/20',
  improvement_identified: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  needs_evidence: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  not_applicable: 'bg-muted text-muted-foreground border-border',
  out_of_scope: 'bg-muted text-muted-foreground border-border',
}

const defaultCoverageAreas = [
  { label: 'Authentication', key: 'auth' },
  { label: 'Authorization', key: 'authz' },
  { label: 'Tenant Isolation', key: 'tenant' },
  { label: 'APIs', key: 'api' },
  { label: 'Storage', key: 'storage' },
  { label: 'Background Operations', key: 'background' },
  { label: 'Realtime', key: 'realtime' },
  { label: 'AI / RAG', key: 'ai_rag' },
  { label: 'AI Tool Permissions', key: 'ai_tools' },
  { label: 'Data Handling', key: 'data' },
  { label: 'Evidence / Logging', key: 'evidence' },
]

const tenantBoundaries = [
  'Database', 'API', 'Files / Storage', 'Roles',
  'Exports', 'Background Jobs', 'Realtime', 'Search / Cache', 'AI / RAG Retrieval',
]

const aiSecurityAreas = [
  'Prompt / Instruction Controls',
  'RAG Authorization',
  'Tool / Function Authorization',
  'Sensitive Data Handling',
  'AI Provider Usage',
  'Output / Action Validation',
  'Human Fallback',
]

const controlMappings = [
  { framework: 'OWASP', relation: 'Aligned with' },
  { framework: 'NIST AI RMF', relation: 'Mapped to' },
  { framework: 'ISO/IEC 42001', relation: 'Supports evidence for' },
  { framework: 'ISO/IEC 27001', relation: 'Supports evidence for' },
  { framework: 'SOC 2 Readiness', relation: 'Supports evidence for' },
]

export function SecurityReviewWorkspaceClient({
  user,
  ctx,
  reviewTitle,
  engagement,
  authorization,
  findings,
  checklist,
  reviewRecords,
  coverageAreas: coverageAreasProp,
}: SecurityReviewWorkspaceClientProps) {
  const { organization } = ctx
  const basePath = `/app/${organization.slug}`
  const [showRoE, setShowRoE] = useState(false)
  const [showAIDetail, setShowAIDetail] = useState(false)
  const [showTenantDetail, setShowTenantDetail] = useState(false)

  async function handleLogout() {
    await fetch('/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  const authStatusLabel: Record<string, string> = {
    pending: 'Pending',
    authorized: 'Authorized',
    revoked: 'Revoked',
    expired: 'Expired',
  }

  const authStatusColor: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    authorized: 'bg-green-500/10 text-green-600 border-green-500/20',
    revoked: 'bg-red-500/10 text-red-600 border-red-500/20',
    expired: 'bg-muted text-muted-foreground border-border',
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
            <span className="text-sm font-medium">Security Review</span>
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
          <h1 className="text-2xl font-bold tracking-tight">{reviewTitle}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Evidence-backed security review for {organization.name}
          </p>
        </div>

        {/* Review Overview */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            Review Overview
          </h2>
          <div className="border rounded-lg p-5 bg-card space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">What Is Being Reviewed</p>
                <p className="text-sm mt-1">{engagement.title || 'Application security review'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Current Stage</p>
                <p className="text-sm mt-1 capitalize">{engagement.current_phase?.replace(/_/g, ' ') || 'Discovery'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Review Date</p>
                <p className="text-sm mt-1">
                  {engagement.starts_at
                    ? new Date(engagement.starts_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                    : 'To be scheduled'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</p>
                <p className="text-sm mt-1 capitalize">{engagement.status}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Review Scope */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-muted-foreground" />
            Review Scope
          </h2>
          <div className="border rounded-lg p-5 bg-card space-y-4">
            {authorization ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Authorization State</p>
                    <span className={`inline-block text-xs px-2 py-0.5 rounded border mt-1 ${authStatusColor[authorization.status] || authStatusColor.pending}`}>
                      {authStatusLabel[authorization.status] || authorization.status}
                    </span>
                  </div>
                  {authorization.expires_at && (
                    <div className="text-right">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Valid Until</p>
                      <p className="text-sm mt-1">
                        {new Date(authorization.expires_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  )}
                </div>

                {authorization.scope_description && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Systems Included</p>
                    <p className="text-sm mt-1">{authorization.scope_description}</p>
                  </div>
                )}

                {authorization.in_scope_systems?.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">In-Scope Systems</p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {authorization.in_scope_systems.map((s, i) => (
                        <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {authorization.testing_methods?.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Approved Review Methods</p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {authorization.testing_methods.map((m, i) => (
                        <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded">{m}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expandable Rules of Engagement */}
                <button
                  onClick={() => setShowRoE(!showRoE)}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  {showRoE ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  Detailed Rules of Engagement
                </button>
                {showRoE && authorization.out_of_scope_systems?.length > 0 && (
                  <div className="pl-5 border-l-2 border-border">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Out-of-Scope Systems</p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {authorization.out_of_scope_systems.map((s, i) => (
                        <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Authorization pending. Your advisor will send testing authorization for your review.
              </p>
            )}
          </div>
        </section>

        {/* Access Checklist */}
        {checklist.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5 text-muted-foreground" />
              Access Requirements
            </h2>
            <div className="border rounded-lg p-5 bg-card">
              <p className="text-sm text-muted-foreground mb-3">
                Items your team needs to provide for the review to proceed.
              </p>
              <div className="space-y-2">
                {checklist.map(item => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{item.checklist_item}</p>
                      {item.notes && <p className="text-xs text-muted-foreground mt-0.5">{item.notes}</p>}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded border flex-shrink-0 ${checklistStatusColors[item.status] || checklistStatusColors.pending}`}>
                      {checklistStatusLabels[item.status] || item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Coverage */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
            Coverage
          </h2>
          <div className="border rounded-lg p-5 bg-card">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(coverageAreasProp && coverageAreasProp.length > 0
                ? coverageAreasProp.map(a => ({ key: a.area_key, label: a.area_label, status: a.status, notes: a.notes }))
                : defaultCoverageAreas.map(a => ({ ...a, status: 'pending', notes: null }))
              ).map(area => (
                <div key={area.key} className="flex items-center justify-between border rounded-lg p-3">
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium">{area.label}</span>
                    {area.notes && (
                      <p className="text-xs text-muted-foreground mt-0.5">{area.notes}</p>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded border flex-shrink-0 ${coverageStatusColors[area.status || 'pending'] || coverageStatusColors.pending}`}>
                    {coverageStatusLabels[area.status || 'pending'] || area.status || 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tenant Isolation */}
        <section>
          <button
            onClick={() => setShowTenantDetail(!showTenantDetail)}
            className="flex items-center gap-2 text-lg font-semibold w-full"
          >
            {showTenantDetail ? <ChevronDown className="h-5 w-5 text-muted-foreground" /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />}
            Tenant Isolation
          </button>
          {showTenantDetail && (
            <div className="border rounded-lg p-5 bg-card mt-3">
              <p className="text-sm text-muted-foreground mb-3">
                Reviewed boundaries where applicable:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {tenantBoundaries.map(b => (
                  <div key={b} className="flex items-center gap-2 border rounded-lg p-2">
                    <CheckCircle2 className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* AI Application Security */}
        <section>
          <button
            onClick={() => setShowAIDetail(!showAIDetail)}
            className="flex items-center gap-2 text-lg font-semibold w-full"
          >
            {showAIDetail ? <ChevronDown className="h-5 w-5 text-muted-foreground" /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />}
            AI Application Security
          </button>
          {showAIDetail && (
            <div className="border rounded-lg p-5 bg-card mt-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {aiSecurityAreas.map(area => (
                  <div key={area} className="flex items-center gap-2 border rounded-lg p-2">
                    <CheckCircle2 className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{area}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Findings */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Bug className="h-5 w-5 text-muted-foreground" />
            Findings
          </h2>
          {findings.length === 0 ? (
            <div className="border rounded-lg p-6 text-center">
              <p className="text-sm text-muted-foreground">
                No findings reported yet. Findings will appear here once the review begins.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {findings.map(f => (
                <div key={f.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-sm font-medium">{f.title}</h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded border capitalize ${severityColors[f.severity] || severityColors.informational}`}>
                        {f.severity}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded border ${findingStatusColors[f.status] || findingStatusColors.finding_open}`}>
                        {findingStatusLabels[f.status] || f.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{f.description}</p>
                  {f.affected_component && (
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Affected:</span> {f.affected_component}
                    </p>
                  )}
                  {f.remediation && (
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-xs font-medium text-muted-foreground">Remediation</p>
                      <p className="text-sm text-muted-foreground mt-1">{f.remediation}</p>
                    </div>
                  )}
                  {f.evidence_reference && (
                    <p className="text-xs text-muted-foreground mt-2">
                      <span className="font-medium">Evidence:</span> {f.evidence_reference}
                    </p>
                  )}
                  {f.retested_at && (
                    <div className="mt-2 pt-2 border-t flex items-center gap-1.5">
                      <RefreshCw className="h-3 w-3 text-green-600" />
                      <p className="text-xs text-muted-foreground">
                        Retest verified on {new Date(f.retested_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Remediation & Retest */}
        {findings.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-muted-foreground" />
              Remediation & Retest
            </h2>
            <div className="border rounded-lg p-5 bg-card">
              <div className="space-y-2">
                {findings.filter(f => f.status !== 'finding_open').map(f => (
                  <div key={f.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <span className="text-sm">{f.title}</span>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{findingStatusLabels[f.status] || f.status}</span>
                      {f.retested_at && (
                        <span>{new Date(f.retested_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      )}
                    </div>
                  </div>
                ))}
                {findings.filter(f => f.status !== 'finding_open').length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Remediation tracking will appear here as findings are addressed.
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Control Mapping */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Scale className="h-5 w-5 text-muted-foreground" />
            Control Mapping
          </h2>
          <div className="border rounded-lg p-5 bg-card">
            <div className="space-y-2">
              {controlMappings.map(cm => (
                <div key={cm.framework} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm font-medium">{cm.framework}</span>
                  <span className="text-xs text-muted-foreground">{cm.relation}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Verified framework references only. Mappings reflect what was actually assessed during this review.
            </p>
          </div>
        </section>

        {/* Buyer-Shareable Summary */}
        {reviewRecords.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              Buyer-Shareable Summary
            </h2>
            <div className="space-y-3">
              {reviewRecords.map(rec => (
                <div key={rec.id} className="border rounded-lg p-5 bg-card">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-sm font-medium">{rec.title}</h3>
                    {rec.status === 'published' && (
                      <span className="text-xs bg-green-500/10 text-green-600 border border-green-500/20 px-2 py-0.5 rounded flex-shrink-0">
                        Published
                      </span>
                    )}
                  </div>
                  {rec.summary && <p className="text-sm text-muted-foreground mb-3">{rec.summary}</p>}
                  {rec.published_at && (
                    <p className="text-xs text-muted-foreground mb-3">
                      Published {new Date(rec.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {rec.critical_count > 0 && <span className="text-xs bg-red-500/10 text-red-600 px-2 py-0.5 rounded">{rec.critical_count} Critical</span>}
                    {rec.high_count > 0 && <span className="text-xs bg-orange-500/10 text-orange-600 px-2 py-0.5 rounded">{rec.high_count} High</span>}
                    {rec.medium_count > 0 && <span className="text-xs bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded">{rec.medium_count} Medium</span>}
                    {rec.low_count > 0 && <span className="text-xs bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded">{rec.low_count} Low</span>}
                    {rec.informational_count > 0 && <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">{rec.informational_count} Informational</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Contains only approved, shareable information suitable for customer diligence.
                  </p>
                </div>
              ))}
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
