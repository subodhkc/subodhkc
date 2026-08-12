import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { SiteFooter } from '@/components/SiteFooter'
import {
  ArrowRight,
  Users,
  ClipboardCheck,
  ListOrdered,
  Eye,
  Smartphone,
  Settings2,
  ShieldCheck,
  QrCode,
  History,
  Layers,
  Clock,
  CheckCircle2,
  AlertCircle,
  Heart,
  Sparkles,
  Car,
  School,
  ScanLine,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Wilshire Elementary School Pickup',
  description:
    'A simpler, safer way to coordinate Wilshire Elementary pickup. Families check in with a quick scan, staff see a live view of arrivals and student readiness, and everyone stays on the same page.',
  robots: { index: false, follow: false },
}

export default function WilshireLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-background to-background">
      {/* Header */}
      <header className="border-b border-sky-100 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/school-pickup/wilshire" className="flex items-center gap-2">
            <Image
              src="/wilshire/logo-badge.svg"
              alt="Wilshire Elementary"
              width={32}
              height={32}
              priority
            />
            <span className="font-bold text-sm text-blue-900">
              Wilshire Elementary
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3 text-sm">
            <a href="#how-it-works" className="text-blue-700 hover:text-blue-900 hidden lg:inline font-medium">
              How It Works
            </a>
            <a href="#for-families" className="text-blue-700 hover:text-blue-900 hidden lg:inline font-medium">
              For Families
            </a>
            <a
              href="/login?context=family"
              className="px-3 py-2 text-blue-700 hover:text-blue-900 font-medium hidden sm:inline"
            >
              Family Sign In
            </a>
            <a
              href="/login?next=/app&context=wilshire"
              className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Sign In
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-200 rounded-full opacity-40 blur-2xl" />
        <div className="absolute top-20 right-20 w-40 h-40 bg-blue-200 rounded-full opacity-40 blur-2xl" />
        <div className="absolute bottom-10 left-1/3 w-24 h-24 bg-green-200 rounded-full opacity-30 blur-2xl" />

        <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24 relative">
          <div className="grid sm:grid-cols-2 gap-8 items-center">
            <div className="text-center sm:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                <Sparkles className="h-3 w-3" />
                Wilshire Elementary School
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-blue-950 leading-tight">
                Pickup time,{' '}
                <span className="text-blue-600">made simple.</span>
              </h1>
              <p className="text-base sm:text-lg text-blue-800/70 max-w-xl leading-relaxed">
                Families check in with a quick scan, staff get a live view of arrivals and student readiness, and everyone stays on the same page during that busy end-of-day moment.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
                <a
                  href="/login?next=/app&context=wilshire"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                >
                  Staff Sign In
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="/login?context=family"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-700 border-2 border-blue-200 rounded-full font-semibold hover:bg-blue-50 transition-colors"
                >
                  <Heart className="h-4 w-4" />
                  Family Sign In
                </a>
              </div>
              <p className="text-xs text-blue-700/60">
                Access is limited to invited or approved families and staff.
              </p>
            </div>

            {/* Mascot */}
            <div className="flex justify-center sm:justify-end">
              <div className="relative">
                <Image
                  src="/wilshire/mascot-owl.svg"
                  alt="Hooty the Wilshire Owl"
                  width={220}
                  height={220}
                  priority
                  className="drop-shadow-xl"
                />
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full px-3 py-1 shadow-lg border border-blue-100">
                  <span className="text-xs font-bold text-blue-700">Hooty the Owl</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="relative h-12 -mb-px">
          <Image
            src="/wilshire/wave-divider.svg"
            alt=""
            fill
            className="object-cover"
            sizes="1200px"
          />
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-blue-600 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              How Wilshire Pickup Works
            </h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
              From arrival to completed pickup, here is what happens during a typical dismissal.
            </p>
          </div>

          {/* Steps */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Car, title: 'Family arrives', desc: 'A family pulls into the Wilshire pickup line.', color: 'bg-blue-500' },
              { icon: ScanLine, title: 'Quick check-in', desc: 'Family scans the Wilshire QR sign or staff checks them in.', color: 'bg-sky-500' },
              { icon: ListOrdered, title: 'Student enters queue', desc: 'The student appears in the live dismissal queue instantly.', color: 'bg-indigo-500' },
              { icon: Eye, title: 'Staff see it live', desc: 'Everyone with access sees the same real-time status.', color: 'bg-blue-400' },
              { icon: Clock, title: 'Status updates', desc: 'Arrived, then Preparing, then Ready, visible to all authorized staff.', color: 'bg-sky-400' },
              { icon: CheckCircle2, title: 'Pickup complete', desc: 'Student is released and the session records the completed pickup.', color: 'bg-green-500' },
            ].map((step, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full" />
                <div className={`w-12 h-12 ${step.color} rounded-xl flex items-center justify-center mb-4 relative`}>
                  <step.icon className="h-6 w-6 text-white" />
                </div>
                <div className="absolute top-3 right-3 text-3xl font-black text-blue-100">
                  {i + 1}
                </div>
                <h3 className="font-bold text-sm text-blue-950 mb-1">{step.title}</h3>
                <p className="text-sm text-blue-700/70">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Families */}
      <section id="for-families" className="py-16 sm:py-20 bg-gradient-to-b from-background to-sky-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center">
              <Image
                src="/wilshire/family-pickup.svg"
                alt="Family at Wilshire pickup"
                width={200}
                height={200}
                className="drop-shadow-lg"
              />
            </div>
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-semibold">
                <Heart className="h-3 w-3" />
                For Families
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-950">
                What families experience
              </h2>
              <p className="text-blue-800/70 leading-relaxed">
                Families continue following Wilshire&apos;s normal pickup and release procedures. The technology works behind the scenes to give staff a clearer shared picture of arrivals and readiness.
              </p>
              <div className="space-y-2">
                {[
                  'Scan the Wilshire QR sign when you reach the pickup line',
                  'See your child\'s status update in real time on your phone',
                  'No app to download, works in any browser',
                  'School pickup and release procedures remain unchanged',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-blue-800">
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <a
                href="/login?context=family"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                <Heart className="h-4 w-4" />
                Family Sign In
              </a>
              <p className="text-xs text-blue-700/60">
                Family access must be approved by the school office.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What staff see */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold mb-3">
              <School className="h-3 w-3" />
              For Staff
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 mb-3">
              What staff see
            </h2>
            <p className="text-blue-800/70 max-w-2xl mx-auto">
              One shared live view that keeps everyone coordinated during dismissal.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: ListOrdered, title: 'Live arrival sequence', desc: 'See who arrived and in what order.', color: 'text-blue-600 bg-blue-50' },
              { icon: Eye, title: 'Student readiness', desc: 'Staff share the same Arrived, Preparing and Ready status.', color: 'text-indigo-600 bg-indigo-50' },
              { icon: AlertCircle, title: 'Wait visibility', desc: 'Long waits and exceptions become easier to notice.', color: 'text-amber-600 bg-amber-50' },
              { icon: Smartphone, title: 'Mobile operation', desc: 'Works across phones, tablets, Chromebooks and laptops.', color: 'text-purple-600 bg-purple-50' },
              { icon: Settings2, title: 'Manual flexibility', desc: 'Staff can still manually check in students or handle exceptions.', color: 'text-green-600 bg-green-50' },
              { icon: ScanLine, title: 'Scanner built in', desc: 'Scan QR codes or check in manually from any device.', color: 'text-sky-600 bg-sky-50' },
            ].map((item, i) => (
              <div key={i} className="bg-white border-2 border-blue-50 rounded-2xl p-5 hover:border-blue-200 transition-colors">
                <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center mb-3`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm text-blue-950 mb-1">{item.title}</h3>
                <p className="text-sm text-blue-700/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QR Scan section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-sky-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 order-2 sm:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                <QrCode className="h-3 w-3" />
                Self Check-In
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-950">
                A quick scan is all it takes
              </h2>
              <p className="text-blue-800/70 leading-relaxed">
                When families reach the Wilshire pickup line, they scan the QR sign posted at the entrance. This lets staff know they have arrived, without changing any of the school&apos;s existing pickup and release procedures.
              </p>
              <div className="space-y-2">
                {[
                  'No app to download, works in any phone browser',
                  'QR codes use opaque identifiers, no student names embedded',
                  'Idempotent scanning means duplicate scans are harmless',
                  'Staff can always override or manually check in',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-blue-800">
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center order-1 sm:order-2">
              <Image
                src="/wilshire/qr-scan.svg"
                alt="QR code check-in on phone"
                width={180}
                height={180}
                className="drop-shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Designed to stay out of the way */}
      <section className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 mb-4">
            Designed to stay out of the way
          </h2>
          <p className="text-blue-800/70 leading-relaxed mb-4">
            The system automates routine steps where that helps, but does not make automation a dependency.
          </p>
          <p className="text-blue-800/70 leading-relaxed">
            Schools can use scheduled dismissal times or start manually. A QR remains active until staff choose to replace it. The goal is fewer required actions, not another workflow staff have to manage.
          </p>
        </div>
      </section>

      {/* What improves beneath the surface */}
      <section className="py-16 bg-blue-950">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-10 text-center">
            What improves beneath the surface
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: Layers, title: 'One shared source of truth', desc: 'Staff work from the same live queue instead of separate mental lists.' },
              { icon: ListOrdered, title: 'Consistent sequencing', desc: 'Arrival order is recorded centrally and remains available throughout the session.' },
              { icon: Users, title: 'Less repeated coordination', desc: 'Staff can see changes directly instead of repeatedly asking who has arrived.' },
              { icon: History, title: 'Operational history', desc: 'Authorized staff can review completed pickups and status changes when needed.' },
              { icon: AlertCircle, title: 'Easier exception visibility', desc: 'Long waits and unusual cases stand out instead of disappearing inside a busy line.' },
              { icon: Settings2, title: 'Flexibility without complexity', desc: 'Use simple defaults and introduce groups, schedules or QR scopes only when useful.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-blue-200/70">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold mb-3">
              <ShieldCheck className="h-3 w-3" />
              Privacy & Security
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 mb-4">
              Access stays scoped to the people who need it
            </h2>
            <p className="text-blue-800/70 leading-relaxed">
              Access requires an authenticated account and explicit authorization. Organization, school-site and operational permissions are enforced at both the application and database layers.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 max-w-xl mx-auto">
            {[
              'Row-level database authorization',
              'Role-based access',
              'Site isolation',
              'Tenant-aware relationships',
              'Audit history',
              'QR privacy (no student names in codes)',
            ].map((claim) => (
              <div key={claim} className="flex items-center gap-2 text-sm text-blue-900 bg-blue-50 rounded-lg px-3 py-2">
                <ShieldCheck className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span>{claim}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-16 bg-gradient-to-b from-background to-blue-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 mb-6 text-center">
            Architecture
          </h2>
          <div className="bg-white border-2 border-blue-50 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="space-y-3 text-sm font-mono text-center">
              <div className="px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-900 font-semibold">
                Google or Magic Link sign-in
              </div>
              <div className="text-blue-300 text-lg">{'\u2193'}</div>
              <div className="px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-900 font-semibold">
                Authorized organization (Wilshire)
              </div>
              <div className="text-blue-300 text-lg">{'\u2193'}</div>
              <div className="px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-900 font-semibold">
                Wilshire Elementary school site
              </div>
              <div className="text-blue-300 text-lg">{'\u2193'}</div>
              <div className="px-4 py-3 bg-blue-100 border border-blue-200 rounded-xl text-blue-900 font-semibold">
                Staff role or Guardian access
              </div>
              <div className="text-blue-300 text-lg">{'\u2193'}</div>
              <div className="px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold">
                Students / Credentials / Sessions / Queue
              </div>
            </div>
          </div>
          <p className="text-blue-800/70 leading-relaxed mt-4 text-center text-sm">
            Identity, organization membership, school access and operational permissions are separate layers. Each request is checked against the context it actually needs.
          </p>
        </div>
      </section>

      {/* Attribution */}
      <section className="py-16 text-center bg-gradient-to-b from-blue-50 to-background">
        <div className="max-w-3xl mx-auto px-4">
          <Image
            src="/wilshire/school-building.svg"
            alt="Wilshire Elementary School"
            width={400}
            height={300}
            className="mx-auto rounded-2xl shadow-lg mb-8"
          />
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-950 mb-4">
            Built for Wilshire, with gratitude.
          </h2>
          <p className="text-blue-800/70 leading-relaxed max-w-xl mx-auto">
            This started as a small way to give something useful back to the Wilshire community, built by June KC&apos;s dad with the hope of making one busy part of the school day a little easier for families and staff.
          </p>
          <p className="text-xs text-blue-700/50 mt-4">
            Independently built for the Wilshire community.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Ready to get started?
          </h2>
          <p className="text-blue-100">
            Staff and families can sign in below. Access is limited to approved users.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/login?next=/app&context=wilshire"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-full font-semibold hover:bg-blue-50 transition-colors shadow-lg"
            >
              Staff Sign In
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/login?context=family"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white border-2 border-blue-400 rounded-full font-semibold hover:bg-blue-400 transition-colors"
            >
              <Heart className="h-4 w-4" />
              Family Sign In
            </a>
          </div>
        </div>
      </section>

      {/* Terms / Privacy */}
      <section className="border-t border-blue-100 py-6 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-xs text-blue-700/60">
            By using this service, you agree to the{' '}
            <Link href="/terms" className="underline hover:text-blue-900 font-medium">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="underline hover:text-blue-900 font-medium">Privacy Policy</Link>.
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
