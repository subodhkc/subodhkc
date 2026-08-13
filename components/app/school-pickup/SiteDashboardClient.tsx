'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Users, GraduationCap, QrCode, UserCog, CheckCircle2, Circle, ArrowRight, Zap, ListChecks, Layers, HelpCircle, FlaskConical, RotateCcw, X, ScanLine, Car, Clock, ShieldCheck } from 'lucide-react'
import type { SchoolContext } from '@/lib/auth/school-resolver'
import type { SiteSetupState } from '@/lib/auth/school-resolver'

interface SiteDashboardClientProps {
  ctx: SchoolContext
  setupState: SiteSetupState
}

const DEMO_TOUR_STEPS = [
  { title: 'Overview', desc: 'You are here. This dashboard shows setup status and quick actions.', href: '' },
  { title: 'Dismissal', desc: 'Start or manage a pickup session. A live session is already running with demo data.', href: '/dismissal' },
  { title: 'Queue', desc: 'See the live pickup queue with arrivals in various statuses (arrived, preparing, ready, completed).', href: '/queue' },
  { title: 'Scanner', desc: 'Scan QR codes to check in families. Try scanning to see the queue update in real-time.', href: '/scanner' },
  { title: 'Students', desc: 'Browse students across classrooms, including sibling groups.', href: '/students' },
  { title: 'Family Access', desc: 'Manage guardians and family invitations.', href: '/family-access' },
  { title: 'Credentials', desc: 'View and manage QR pickup credentials. One credential is revoked with a replacement issued.', href: '/credentials' },
  { title: 'Check-In QR', desc: 'The shared QR sign families scan at the pickup line entrance.', href: '/checkin-qr' },
]

export function SiteDashboardClient({ ctx, setupState }: SiteDashboardClientProps) {
  const { site, canManageStaff, canManageSettings } = ctx
  const basePath = `/app/${ctx.organization.organization.slug}/school-pickup/${site.slug}`
  const isDemo = ctx.organization.organization.slug.includes('demo') || ctx.organization.organization.name.includes('Demo')
  const isWilshire = site.name.toLowerCase().includes('wilshire') || ctx.organization.organization.slug.includes('wilshire')
  const [tourOpen, setTourOpen] = useState(true)
  const [tourStep, setTourStep] = useState(0)
  const [resetting, setResetting] = useState(false)
  const [resetMsg, setResetMsg] = useState<string | null>(null)

  // Wilshire brand colors
  const NAVY = '#1a3a5c'
  const NAVY_DEEP = '#0f2a44'
  const NAVY_LIGHT = '#2d5a82'
  const GOLD = '#d4a017'
  const GOLD_LIGHT = '#f0c040'
  const CREAM = '#faf6ee'

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
        <div className="flex items-center gap-3">
          {isWilshire && (
            <Image
              src="/wilshire/logo-color.png"
              alt={site.name}
              width={48}
              height={48}
              className="rounded-lg"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold" style={isWilshire ? { color: NAVY_DEEP } : undefined}>{site.name}</h1>
            <p className="text-sm mt-1" style={isWilshire ? { color: NAVY_LIGHT } : undefined}>{site.timezone}</p>
          </div>
        </div>
        {isDemo && (
          <button
            onClick={handleReset}
            disabled={resetting}
            aria-label="Reset demo data to baseline"
            className="flex items-center gap-1.5 px-3 py-2 border rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
            style={isWilshire ? { borderColor: `${GOLD}50`, background: `${GOLD}10`, color: '#8a6d10' } : undefined}
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

      {/* Welcome banner for Wilshire */}
      {isWilshire && (
        <div className="rounded-2xl p-6 shadow-sm" style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_DEEP})` }}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/wilshire/mascot-owl.svg"
                alt=""
                width={56}
                height={56}
              />
              <div>
                <h2 className="text-lg font-bold text-white">Welcome back to Pickup Dashboard</h2>
                <p className="text-sm" style={{ color: `${GOLD_LIGHT}cc` }}>Manage dismissal sessions, monitor the queue, and coordinate pickup in real time.</p>
              </div>
            </div>
            {isSetupComplete && (
              <Link
                href={`${basePath}/dismissal`}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap"
                style={{ background: GOLD, color: NAVY_DEEP }}
              >
                <Zap className="h-4 w-4" />
                Start Dismissal
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Demo Tour */}
      {isDemo && tourOpen && (
        <div className="border-2 rounded-lg p-4 sm:p-6" style={isWilshire ? { borderColor: `${GOLD}40`, background: `${GOLD}08` } : { borderColor: '#fde68a', background: '#fffbeb' }}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5" style={isWilshire ? { color: GOLD } : { color: '#b45309' }} />
              <h2 className="font-semibold" style={isWilshire ? { color: NAVY_DEEP } : { color: '#78350f' }}>Demo Tour</h2>
            </div>
            <button onClick={() => setTourOpen(false)} style={isWilshire ? { color: GOLD } : { color: '#b45309' }} aria-label="Close demo tour">
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
                    i === tourStep ? 'w-6' : i < tourStep ? 'w-1.5' : 'w-1.5'
                  }`}
                  style={isWilshire ? {
                    background: i === tourStep ? GOLD : i < tourStep ? `${GOLD}80` : `${GOLD}30`,
                  } : {
                    background: i === tourStep ? '#d97706' : i < tourStep ? '#fbbf24' : '#fde68a',
                  }}
                />
              ))}
            </div>

            <div className="bg-white border rounded-lg p-4" style={isWilshire ? { borderColor: `${GOLD}30` } : { borderColor: '#fde68a' }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold" style={isWilshire ? { color: GOLD } : { color: '#b45309' }}>Step {tourStep + 1} of {DEMO_TOUR_STEPS.length}</span>
                <span className="text-xs" style={isWilshire ? { color: NAVY_LIGHT } : { color: '#d97706' }}>·</span>
                <span className="text-sm font-semibold" style={isWilshire ? { color: NAVY_DEEP } : { color: '#78350f' }}>{DEMO_TOUR_STEPS[tourStep].title}</span>
              </div>
              <p className="text-sm mb-3" style={isWilshire ? { color: NAVY } : { color: '#92400e' }}>{DEMO_TOUR_STEPS[tourStep].desc}</p>
              <div className="flex items-center gap-2">
                {DEMO_TOUR_STEPS[tourStep].href && (
                  <Link
                    href={`${basePath}${DEMO_TOUR_STEPS[tourStep].href}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-white rounded-md text-xs font-medium"
                    style={isWilshire ? { background: NAVY } : { background: '#d97706' }}
                  >
                    Go there <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
                {tourStep < DEMO_TOUR_STEPS.length - 1 ? (
                  <button
                    onClick={() => setTourStep(s => s + 1)}
                    className="px-3 py-1.5 border rounded-md text-xs font-medium"
                    style={isWilshire ? { borderColor: `${NAVY}20`, color: NAVY } : { borderColor: '#fde68a', color: '#92400e' }}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={() => setTourOpen(false)}
                    className="px-3 py-1.5 border rounded-md text-xs font-medium"
                    style={isWilshire ? { borderColor: `${NAVY}20`, color: NAVY } : { borderColor: '#fde68a', color: '#92400e' }}
                  >
                    Done
                  </button>
                )}
                {tourStep > 0 && (
                  <button
                    onClick={() => setTourStep(s => s - 1)}
                    className="text-xs"
                    style={isWilshire ? { color: NAVY_LIGHT } : { color: '#b45309' }}
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
        <div className="border rounded-lg p-4 sm:p-6" style={isWilshire ? { background: `${NAVY}08`, borderColor: `${NAVY}15` } : undefined}>
          <h2 className="font-semibold mb-1" style={isWilshire ? { color: NAVY_DEEP } : undefined}>Setup Progress</h2>
          <p className="text-sm mb-4" style={isWilshire ? { color: NAVY_LIGHT } : undefined}>
            Complete these steps to get ready for dismissal.
          </p>
          <div className="space-y-2">
            {setupSteps.map(step => (
              <div key={step.key} className="flex items-center gap-3">
                {step.done ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0" style={isWilshire ? { color: GOLD } : undefined} />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                )}
                <span className={`text-sm ${step.done ? 'text-muted-foreground line-through' : 'font-medium'}`} style={isWilshire && !step.done ? { color: NAVY_DEEP } : undefined}>
                  {step.label}
                </span>
                {!step.done && step.key !== 'site' && (
                  <Link
                    href={`${basePath}/${step.key === 'credentials' ? 'credentials' : step.key === 'students' ? 'students' : step.key === 'staff' ? 'staff' : 'students'}`}
                    className="ml-auto text-xs hover:underline flex items-center gap-1"
                    style={isWilshire ? { color: GOLD } : undefined}
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
        <div className="border rounded-lg p-4 sm:p-6" style={isWilshire ? { background: `${NAVY}08`, borderColor: `${NAVY}15` } : undefined}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" style={isWilshire ? { color: GOLD } : undefined} />
            <h2 className="font-semibold" style={isWilshire ? { color: NAVY_DEEP } : undefined}>Setup Complete</h2>
          </div>
          <p className="text-sm mt-1" style={isWilshire ? { color: NAVY_LIGHT } : undefined}>
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
          hint={setupState.hasStudents ? 'Configured' : 'No students yet'}
          isWilshire={isWilshire}
        />
        <StatCard
          icon={GraduationCap}
          label="Classrooms"
          href={`${basePath}/students`}
          hint={setupState.hasClassrooms ? 'Configured' : 'No classrooms yet'}
          isWilshire={isWilshire}
        />
        <StatCard
          icon={QrCode}
          label="Active Credentials"
          href={`${basePath}/credentials`}
          hint={setupState.hasCredentials ? 'Configured' : 'No credentials issued'}
          isWilshire={isWilshire}
        />
        {canManageStaff && (
          <StatCard
            icon={UserCog}
            label="Staff"
            href={`${basePath}/staff`}
            hint={setupState.hasStaff ? 'Configured' : 'No staff assigned'}
            isWilshire={isWilshire}
          />
        )}
      </div>

      {/* Demo quick links */}
      {isDemo && (
        <div className="border-2 rounded-lg p-4 sm:p-6" style={isWilshire ? { borderColor: `${NAVY}15`, background: `${NAVY}05` } : { borderColor: '#dbeafe', background: '#eff6ff' }}>
          <h2 className="font-semibold text-sm mb-3 flex items-center gap-2" style={isWilshire ? { color: NAVY_DEEP } : { color: '#1e3a8a' }}>
            <ScanLine className="h-4 w-4" style={isWilshire ? { color: NAVY } : { color: '#2563eb' }} />
            Demo Quick Links
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <Link href={`${basePath}/queue`} className="flex items-center justify-between p-3 bg-white border rounded-lg transition-colors" style={isWilshire ? { borderColor: `${NAVY}10` } : { borderColor: '#dbeafe' }}>
              <span className="text-sm font-medium" style={isWilshire ? { color: NAVY_DEEP } : { color: '#1e3a8a' }}>Live Queue</span>
              <ArrowRight className="h-4 w-4" style={isWilshire ? { color: NAVY_LIGHT } : { color: '#93c5fd' }} />
            </Link>
            <Link href={`${basePath}/dismissal`} className="flex items-center justify-between p-3 bg-white border rounded-lg transition-colors" style={isWilshire ? { borderColor: `${NAVY}10` } : { borderColor: '#dbeafe' }}>
              <span className="text-sm font-medium" style={isWilshire ? { color: NAVY_DEEP } : { color: '#1e3a8a' }}>Active Session</span>
              <ArrowRight className="h-4 w-4" style={isWilshire ? { color: NAVY_LIGHT } : { color: '#93c5fd' }} />
            </Link>
            <Link href={`${basePath}/scanner`} className="flex items-center justify-between p-3 bg-white border rounded-lg transition-colors" style={isWilshire ? { borderColor: `${NAVY}10` } : { borderColor: '#dbeafe' }}>
              <span className="text-sm font-medium" style={isWilshire ? { color: NAVY_DEEP } : { color: '#1e3a8a' }}>QR Scanner</span>
              <ArrowRight className="h-4 w-4" style={isWilshire ? { color: NAVY_LIGHT } : { color: '#93c5fd' }} />
            </Link>
            <Link href={`${basePath}/students`} className="flex items-center justify-between p-3 bg-white border rounded-lg transition-colors" style={isWilshire ? { borderColor: `${NAVY}10` } : { borderColor: '#dbeafe' }}>
              <span className="text-sm font-medium" style={isWilshire ? { color: NAVY_DEEP } : { color: '#1e3a8a' }}>Students</span>
              <ArrowRight className="h-4 w-4" style={isWilshire ? { color: NAVY_LIGHT } : { color: '#93c5fd' }} />
            </Link>
            <Link href={`${basePath}/family-access`} className="flex items-center justify-between p-3 bg-white border rounded-lg transition-colors" style={isWilshire ? { borderColor: `${NAVY}10` } : { borderColor: '#dbeafe' }}>
              <span className="text-sm font-medium" style={isWilshire ? { color: NAVY_DEEP } : { color: '#1e3a8a' }}>Family Access</span>
              <ArrowRight className="h-4 w-4" style={isWilshire ? { color: NAVY_LIGHT } : { color: '#93c5fd' }} />
            </Link>
            <Link href={`${basePath}/checkin-qr`} className="flex items-center justify-between p-3 bg-white border rounded-lg transition-colors" style={isWilshire ? { borderColor: `${NAVY}10` } : { borderColor: '#dbeafe' }}>
              <span className="text-sm font-medium" style={isWilshire ? { color: NAVY_DEEP } : { color: '#1e3a8a' }}>Shared Check-In QR</span>
              <ArrowRight className="h-4 w-4" style={isWilshire ? { color: NAVY_LIGHT } : { color: '#93c5fd' }} />
            </Link>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="border rounded-lg p-4 sm:p-6" style={isWilshire ? { borderColor: `${NAVY}15` } : undefined}>
        <h2 className="font-semibold mb-3" style={isWilshire ? { color: NAVY_DEEP } : undefined}>Quick Actions</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {isSetupComplete && (
            <Link
              href={`${basePath}/dismissal`}
              className="flex items-center justify-between p-3 border-2 rounded-lg transition-colors"
              style={isWilshire ? { borderColor: GOLD, background: `${GOLD}08` } : undefined}
            >
              <span className="text-sm font-medium flex items-center gap-2" style={isWilshire ? { color: NAVY_DEEP } : undefined}>
                <Zap className="h-4 w-4" style={isWilshire ? { color: GOLD } : undefined} />
                Start Dismissal
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          )}
          {isSetupComplete && (
            <Link
              href={`${basePath}/queue`}
              className="flex items-center justify-between p-3 border rounded-lg transition-colors"
              style={isWilshire ? { borderColor: `${NAVY}15` } : undefined}
            >
              <span className="text-sm font-medium flex items-center gap-2" style={isWilshire ? { color: NAVY_DEEP } : undefined}>
                <ListChecks className="h-4 w-4" style={isWilshire ? { color: NAVY } : undefined} />
                View Queue
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          )}
          <Link
            href={`${basePath}/students/new`}
            className="flex items-center justify-between p-3 border rounded-lg transition-colors"
            style={isWilshire ? { borderColor: `${NAVY}15` } : undefined}
          >
            <span className="text-sm font-medium" style={isWilshire ? { color: NAVY_DEEP } : undefined}>Add Student</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
          <Link
            href={`${basePath}/students/import`}
            className="flex items-center justify-between p-3 border rounded-lg transition-colors"
            style={isWilshire ? { borderColor: `${NAVY}15` } : undefined}
          >
            <span className="text-sm font-medium" style={isWilshire ? { color: NAVY_DEEP } : undefined}>Import CSV</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
          <Link
            href={`${basePath}/credentials`}
            className="flex items-center justify-between p-3 border rounded-lg transition-colors"
            style={isWilshire ? { borderColor: `${NAVY}15` } : undefined}
          >
            <span className="text-sm font-medium" style={isWilshire ? { color: NAVY_DEEP } : undefined}>Manage Credentials</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
          {canManageStaff && (
            <Link
              href={`${basePath}/staff`}
              className="flex items-center justify-between p-3 border rounded-lg transition-colors"
              style={isWilshire ? { borderColor: `${NAVY}15` } : undefined}
            >
              <span className="text-sm font-medium" style={isWilshire ? { color: NAVY_DEEP } : undefined}>Manage Staff</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          )}
          {ctx.canEditRoster && (
            <Link
              href={`${basePath}/groups`}
              className="flex items-center justify-between p-3 border rounded-lg transition-colors"
              style={isWilshire ? { borderColor: `${NAVY}15` } : undefined}
            >
              <span className="text-sm font-medium flex items-center gap-2" style={isWilshire ? { color: NAVY_DEEP } : undefined}>
                <Layers className="h-4 w-4" style={isWilshire ? { color: NAVY } : undefined} />
                Dismissal Groups
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          )}
        </div>
      </div>

      {/* Contextual help */}
      {isSetupComplete && (
        <div className="border rounded-lg p-4" style={isWilshire ? { background: `${NAVY}05`, borderColor: `${NAVY}10` } : undefined}>
          <h2 className="font-semibold text-sm flex items-center gap-2 mb-2" style={isWilshire ? { color: NAVY_DEEP } : undefined}>
            <HelpCircle className="h-4 w-4" style={isWilshire ? { color: NAVY_LIGHT } : undefined} />
            How Dismissal Works
          </h2>
          <ol className="text-sm space-y-1.5 ml-4 list-decimal" style={isWilshire ? { color: NAVY } : undefined}>
            <li>Go to <strong style={isWilshire ? { color: NAVY_DEEP } : undefined}>Dismissal</strong> and open a session (or it opens automatically when you scan).</li>
            <li>Scan a parent&apos;s QR code at <strong style={isWilshire ? { color: NAVY_DEEP } : undefined}>Scanner</strong> — the student appears in the queue.</li>
            <li>Monitor live status at <strong style={isWilshire ? { color: NAVY_DEEP } : undefined}>Queue</strong> — advance students through Preparing to Ready to Completed.</li>
            <li>Close the session when dismissal is done. Stale sessions auto-close safely.</li>
          </ol>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon: Icon, label, href, hint, isWilshire }: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  label: string
  href: string
  hint?: string
  isWilshire?: boolean
}) {
  const NAVY = '#1a3a5c'
  const NAVY_DEEP = '#0f2a44'
  const NAVY_LIGHT = '#2d5a82'
  const GOLD = '#d4a017'
  return (
    <Link
      href={href}
      className="border rounded-lg p-4 transition-colors"
      style={isWilshire ? { borderColor: `${NAVY}15` } : undefined}
    >
      <Icon className="h-5 w-5 mb-2" style={isWilshire ? { color: NAVY } : undefined} />
      <p className="text-sm font-medium" style={isWilshire ? { color: NAVY_DEEP } : undefined}>{label}</p>
      {hint && <p className="text-xs mt-0.5" style={isWilshire ? { color: NAVY_LIGHT } : undefined}>{hint}</p>}
    </Link>
  )
}
