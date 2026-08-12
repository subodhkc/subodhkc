'use client'

import Link from 'next/link'
import { Users, GraduationCap, QrCode, UserCog, CheckCircle2, Circle, ArrowRight, Zap, ListChecks, Layers, HelpCircle } from 'lucide-react'
import type { SchoolContext } from '@/lib/auth/school-resolver'
import type { SiteSetupState } from '@/lib/auth/school-resolver'

interface SiteDashboardClientProps {
  ctx: SchoolContext
  setupState: SiteSetupState
}

export function SiteDashboardClient({ ctx, setupState }: SiteDashboardClientProps) {
  const { site, canManageStaff, canManageSettings } = ctx
  const basePath = `/app/${ctx.organization.organization.slug}/school-pickup/${site.slug}`

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
      <div>
        <h1 className="text-2xl font-bold">{site.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">{site.timezone}</p>
      </div>

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
          hint={setupState.hasStudents ? undefined : 'No students yet'}
        />
        <StatCard
          icon={GraduationCap}
          label="Classrooms"
          href={`${basePath}/students`}
          hint={setupState.hasClassrooms ? undefined : 'No classrooms yet'}
        />
        <StatCard
          icon={QrCode}
          label="Active Credentials"
          href={`${basePath}/credentials`}
          hint={setupState.hasCredentials ? undefined : 'No credentials issued'}
        />
        {canManageStaff && (
          <StatCard
            icon={UserCog}
            label="Staff"
            href={`${basePath}/staff`}
            hint={setupState.hasStaff ? undefined : 'No staff assigned'}
          />
        )}
      </div>

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
