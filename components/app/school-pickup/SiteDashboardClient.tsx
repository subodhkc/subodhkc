'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Users, GraduationCap, QrCode, UserCog, CheckCircle2, Circle, ArrowRight, Zap, ListChecks, Layers, HelpCircle, FlaskConical, RotateCcw, X, ScanLine } from 'lucide-react'
import type { SchoolContext } from '@/lib/auth/school-resolver'
import type { SiteSetupState } from '@/lib/auth/school-resolver'

interface SiteDashboardClientProps {
  ctx: SchoolContext
  setupState: SiteSetupState
}

const DEMO_TOUR_STEPS = [
  { title: 'Overview', desc: 'You are here. This dashboard shows setup status and quick actions.', href: '' },
  { title: 'Dismissal', desc: 'Start or manage a pickup session. A live session is already running with demo data.', href: '/dismissal' },
  { title: 'Queue', desc: 'See the live pickup queue with 28 arrivals in various statuses (arrived, preparing, ready, completed).', href: '/queue' },
  { title: 'Scanner', desc: 'Scan QR codes to check in families. Try scanning to see the queue update in real-time.', href: '/scanner' },
  { title: 'Students', desc: 'Browse 120 synthetic students across 10 classrooms, including sibling groups.', href: '/students' },
  { title: 'Family Access', desc: 'Manage guardians and family invitations. 20 guardians with various statuses.', href: '/family-access' },
  { title: 'Credentials', desc: 'View and manage QR pickup credentials. One credential is revoked with a replacement issued.', href: '/credentials' },
  { title: 'Check-In QR', desc: 'The shared QR sign families scan at the pickup line entrance.', href: '/checkin-qr' },
]

export function SiteDashboardClient({ ctx, setupState }: SiteDashboardClientProps) {
  const { site, canManageStaff, canManageSettings } = ctx
  const basePath = `/app/${ctx.organization.organization.slug}/school-pickup/${site.slug}`
  const isDemo = ctx.organization.organization.slug.includes('demo') || ctx.organization.organization.name.includes('Demo')
  const [tourOpen, setTourOpen] = useState(true)
  const [tourStep, setTourStep] = useState(0)
  const [resetting, setResetting] = useState(false)
  const [resetMsg, setResetMsg] = useState<string | null>(null)

  async function handleReset() {
    if (!confirm('Reset all demo data to baseline? This will clear and re-seed all synthetic students, groups, sessions, and queue items.')) return
    setResetting(true)
    setResetMsg(null)
    try {
      const res = await fetch('/api/demo/reset', { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        setResetMsg('Demo data reset successfully. Refreshing...')
        setTimeout(() => window.location.reload(), 1500)
      } else {
        setResetMsg(data.error || 'Reset failed')
      }
    } catch {
      setResetMsg('Network error during reset')
    } finally {
      setResetting(false)
    }
  }

  const setupSteps = [
    { key: 'site', label: 'School Site', done: true },
    { key: 'classrooms', label: 'Classrooms', done: setupState.hasClassrooms },
    { key: 'staff', label: 'Staff', done: setupState.hasStaff },
    { key: 'students', label: 'Students', done: setupState.hasStudents },
    { key: 'credentials', label: 'Pickup Credentials', done: setupState.hasCredentials },
  ]

  const isSetupComplete = setupState.pendingSteps.length === 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{site.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{site.timezone}</p>
        </div>
        {isDemo && (
          <button
            onClick={handleReset}
            disabled={resetting}
            className="flex items-center gap-1.5 px-3 py-2 border border-amber-300 bg-amber-50 text-amber-800 rounded-lg text-xs font-medium hover:bg-amber-100 transition-colors disabled:opacity-50"
          >
            <RotateCcw className={`h-3.5 w-3.5 ${resetting ? 'animate-spin' : ''}`} />
            {resetting ? 'Resetting...' : 'Reset Demo Data'}
          </button>
        )}
      </div>

      {/* Reset message */}
      {resetMsg && (
        <div className={`text-sm rounded-md px-4 py-2 ${resetMsg.includes('success') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {resetMsg}
        </div>
      )}

      {/* Demo Tour */}
      {isDemo && tourOpen && (
        <div className="border-2 border-amber-200 bg-amber-50 rounded-lg p-4 sm:p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-amber-700" />
              <h2 className="font-semibold text-amber-900">Demo Tour</h2>
            </div>
            <button onClick={() => setTourOpen(false)} className="text-amber-700 hover:text-amber-900">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3">
            {/* Progress dots */}
            <div className="flex items-center gap-1.5">
              {DEMO_TOUR_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === tourStep ? 'w-6 bg-amber-600' : i < tourStep ? 'w-1.5 bg-amber-400' : 'w-1.5 bg-amber-200'
                  }`}
                />
              ))}
            </div>

            <div className="bg-white border border-amber-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-amber-700">Step {tourStep + 1} of {DEMO_TOUR_STEPS.length}</span>
                <span className="text-xs text-amber-600">·</span>
                <span className="text-sm font-semibold text-amber-900">{DEMO_TOUR_STEPS[tourStep].title}</span>
              </div>
              <p className="text-sm text-amber-800 mb-3">{DEMO_TOUR_STEPS[tourStep].desc}</p>
              <div className="flex items-center gap-2">
                {DEMO_TOUR_STEPS[tourStep].href && (
                  <Link
                    href={`${basePath}${DEMO_TOUR_STEPS[tourStep].href}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-600 text-white rounded-md text-xs font-medium hover:bg-amber-700"
                  >
                    Go there <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
                {tourStep < DEMO_TOUR_STEPS.length - 1 ? (
                  <button
                    onClick={() => setTourStep(s => s + 1)}
                    className="px-3 py-1.5 border border-amber-300 text-amber-800 rounded-md text-xs font-medium hover:bg-amber-100"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={() => setTourOpen(false)}
                    className="px-3 py-1.5 border border-amber-300 text-amber-800 rounded-md text-xs font-medium hover:bg-amber-100"
                  >
                    Done
                  </button>
                )}
                {tourStep > 0 && (
                  <button
                    onClick={() => setTourStep(s => s - 1)}
                    className="px-3 py-1.5 text-amber-700 text-xs hover:text-amber-900"
                  >
                    Back
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Setup progress */}
      {!isSetupComplete && (
        <div className="border rounded-lg p-4 sm:p-6 bg-accent/10">
          <h2 className="font-semibold mb-1">Setup Progress</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Complete these steps to get ready for dismissal.
          </p>
          <div className="space-y-2">
            {setupSteps.map(step => (
              <div key={step.key} className="flex items-center gap-3">
                {step.done ? (
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                )}
                <span className={`text-sm ${step.done ? 'text-muted-foreground line-through' : 'font-medium'}`}>
                  {step.label}
                </span>
                {!step.done && step.key !== 'site' && (
                  <Link
                    href={`${basePath}/${step.key === 'credentials' ? 'credentials' : step.key === 'students' ? 'students' : step.key === 'staff' ? 'staff' : 'students'}`}
                    className="ml-auto text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    Set up <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {isSetupComplete && (
        <div className="border rounded-lg p-4 sm:p-6 bg-accent/10">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-accent" />
            <h2 className="font-semibold">Setup Complete</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Your school is ready for dismissal sessions.
          </p>
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={Users}
          label="Active Students"
          href={`${basePath}/students`}
          hint={setupState.hasStudents ? '120 students' : 'No students yet'}
        />
        <StatCard
          icon={GraduationCap}
          label="Classrooms"
          href={`${basePath}/students`}
          hint={setupState.hasClassrooms ? '10 classrooms' : 'No classrooms yet'}
        />
        <StatCard
          icon={QrCode}
          label="Active Credentials"
          href={`${basePath}/credentials`}
          hint={setupState.hasCredentials ? '96 active' : 'No credentials issued'}
        />
        {canManageStaff && (
          <StatCard
            icon={UserCog}
            label="Staff"
            href={`${basePath}/staff`}
            hint={setupState.hasStaff ? '4 active staff' : 'No staff assigned'}
          />
        )}
      </div>

      {/* Demo quick links */}
      {isDemo && (
        <div className="border-2 border-blue-100 bg-blue-50/50 rounded-lg p-4 sm:p-6">
          <h2 className="font-semibold text-sm text-blue-900 mb-3 flex items-center gap-2">
            <ScanLine className="h-4 w-4 text-blue-600" />
            Demo Quick Links
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <Link href={`${basePath}/queue`} className="flex items-center justify-between p-3 bg-white border border-blue-100 rounded-lg hover:border-blue-300 transition-colors">
              <span className="text-sm font-medium text-blue-900">Live Queue (28 arrivals)</span>
              <ArrowRight className="h-4 w-4 text-blue-400" />
            </Link>
            <Link href={`${basePath}/dismissal`} className="flex items-center justify-between p-3 bg-white border border-blue-100 rounded-lg hover:border-blue-300 transition-colors">
              <span className="text-sm font-medium text-blue-900">Active Session</span>
              <ArrowRight className="h-4 w-4 text-blue-400" />
            </Link>
            <Link href={`${basePath}/scanner`} className="flex items-center justify-between p-3 bg-white border border-blue-100 rounded-lg hover:border-blue-300 transition-colors">
              <span className="text-sm font-medium text-blue-900">QR Scanner</span>
              <ArrowRight className="h-4 w-4 text-blue-400" />
            </Link>
            <Link href={`${basePath}/students`} className="flex items-center justify-between p-3 bg-white border border-blue-100 rounded-lg hover:border-blue-300 transition-colors">
              <span className="text-sm font-medium text-blue-900">Students (120)</span>
              <ArrowRight className="h-4 w-4 text-blue-400" />
            </Link>
            <Link href={`${basePath}/family-access`} className="flex items-center justify-between p-3 bg-white border border-blue-100 rounded-lg hover:border-blue-300 transition-colors">
              <span className="text-sm font-medium text-blue-900">Family Access (20 guardians)</span>
              <ArrowRight className="h-4 w-4 text-blue-400" />
            </Link>
            <Link href={`${basePath}/checkin-qr`} className="flex items-center justify-between p-3 bg-white border border-blue-100 rounded-lg hover:border-blue-300 transition-colors">
              <span className="text-sm font-medium text-blue-900">Shared Check-In QR</span>
              <ArrowRight className="h-4 w-4 text-blue-400" />
            </Link>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="border rounded-lg p-4 sm:p-6">
        <h2 className="font-semibold mb-3">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {isSetupComplete && (
            <Link
              href={`${basePath}/dismissal`}
              className="flex items-center justify-between p-3 border-2 border-accent rounded-lg hover:bg-accent/50 transition-colors bg-accent/5"
            >
              <span className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4 text-accent" />
                Start Dismissal
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          )}
          {isSetupComplete && (
            <Link
              href={`${basePath}/queue`}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <span className="text-sm font-medium flex items-center gap-2">
                <ListChecks className="h-4 w-4" />
                View Queue
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          )}
          <Link
            href={`${basePath}/students/new`}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
          >
            <span className="text-sm font-medium">Add Student</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
          <Link
            href={`${basePath}/students/import`}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
          >
            <span className="text-sm font-medium">Import CSV</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
          <Link
            href={`${basePath}/credentials`}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
          >
            <span className="text-sm font-medium">Manage Credentials</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
          {canManageStaff && (
            <Link
              href={`${basePath}/staff`}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <span className="text-sm font-medium">Manage Staff</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          )}
          {ctx.canEditRoster && (
            <Link
              href={`${basePath}/groups`}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <span className="text-sm font-medium flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Dismissal Groups
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          )}
        </div>
      </div>

      {/* Contextual help */}
      {isSetupComplete && (
        <div className="border rounded-lg p-4 bg-muted/30">
          <h2 className="font-semibold text-sm flex items-center gap-2 mb-2">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
            How Dismissal Works
          </h2>
          <ol className="text-sm text-muted-foreground space-y-1.5 ml-4 list-decimal">
            <li>Go to <strong className="text-foreground">Dismissal</strong> and open a session (or it opens automatically when you scan).</li>
            <li>Scan a parent&apos;s QR code at <strong className="text-foreground">Scanner</strong> — the student appears in the queue.</li>
            <li>Monitor live status at <strong className="text-foreground">Queue</strong> — advance students through Preparing to Ready to Completed.</li>
            <li>Close the session when dismissal is done. Stale sessions auto-close safely.</li>
          </ol>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon: Icon, label, href, hint }: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  href: string
  hint?: string
}) {
  return (
    <Link
      href={href}
      className="border rounded-lg p-4 hover:bg-accent/30 transition-colors"
    >
      <Icon className="h-5 w-5 text-muted-foreground mb-2" />
      <p className="text-sm font-medium">{label}</p>
      {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
    </Link>
  )
}
