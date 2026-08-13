import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  Users,
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
  MapPin,
  Server,
  Palette,
  GraduationCap,
  GitBranch,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Wilshire Elementary School Pickup',
  description:
    'A simpler, safer way to coordinate Wilshire Elementary pickup. Families check in with a quick scan, staff see a live view of arrivals and student readiness, and everyone stays on the same page.',
  robots: { index: false, follow: false },
}

const NAVY = '#1a3a5c'
const NAVY_DEEP = '#0f2a44'
const NAVY_LIGHT = '#2d5a82'
const GOLD = '#d4a017'
const GOLD_LIGHT = '#f0c040'
const CREAM = '#faf6ee'

export default function WilshireLandingPage() {
  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(to bottom, ${CREAM}, #ffffff, #f0f4f8)` }}>
      {/* Beta Proposal Banner */}
      <div
        className="text-center px-4 py-2.5 text-xs sm:text-sm font-medium text-white"
        style={{ background: `linear-gradient(to right, ${GOLD}, ${GOLD_LIGHT}, ${GOLD})` }}
      >
        <span className="font-bold">Beta Proposal</span>
        <span className="hidden sm:inline"> — Built by June KC&apos;s dad for Wilshire Elementary. Non-commercial, not for sale.</span>
        <span className="sm:hidden"> — Non-commercial. Not for sale.</span>
      </div>

      {/* Header */}
      <header
        className="border-b sticky top-0 z-20 backdrop-blur-sm"
        style={{ borderColor: 'rgba(26,58,92,0.15)', background: 'rgba(255,255,255,0.92)' }}
      >
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/school-pickup/wilshire" className="flex items-center gap-2.5">
            <Image
              src="/wilshire/logo-color.png"
              alt="Wilshire Elementary"
              width={36}
              height={36}
              priority
            />
            <span className="font-bold text-sm" style={{ color: NAVY }}>
              Wilshire Elementary <span style={{ color: NAVY_LIGHT, fontWeight: 400 }}>Pickup</span>
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3 text-sm">
            <a href="#how-it-works" className="hidden lg:inline font-medium hover:underline" style={{ color: NAVY_LIGHT }}>
              How It Works
            </a>
            <a href="#for-families" className="hidden lg:inline font-medium hover:underline" style={{ color: NAVY_LIGHT }}>
              For Families
            </a>
            <a
              href="/login?context=family"
              className="px-3 py-2 font-medium hidden sm:inline hover:underline"
              style={{ color: NAVY_LIGHT }}
            >
              Family Sign In
            </a>
            <a
              href="/demo"
              className="px-3 py-2 font-medium hidden sm:inline hover:underline"
              style={{ color: GOLD }}
            >
              Try Demo
            </a>
            <a
              href="/login?next=/app&context=wilshire"
              className="px-4 py-2 text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
              style={{ background: NAVY }}
            >
              Sign In
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full opacity-30 blur-2xl" style={{ background: GOLD_LIGHT }} />
        <div className="absolute top-20 right-20 w-40 h-40 rounded-full opacity-20 blur-2xl" style={{ background: NAVY_LIGHT }} />

        <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24 relative">
          <div className="grid sm:grid-cols-2 gap-8 items-center">
            <div className="text-center sm:text-left space-y-6">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border"
                style={{ background: `${NAVY}10`, color: NAVY, borderColor: `${NAVY}25` }}
              >
                <Sparkles className="h-3 w-3" />
                Wilshire Elementary School
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight" style={{ color: NAVY_DEEP }}>
                Pickup time,{' '}
                <span style={{ color: GOLD }}>made simple.</span>
              </h1>
              <p className="text-base sm:text-lg max-w-xl leading-relaxed" style={{ color: NAVY }}>
                Families check in with a quick scan, staff get a live view of arrivals and student readiness, and everyone stays on the same page during that busy end-of-day moment.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
                <a
                  href="/login?next=/app&context=wilshire"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white rounded-full font-semibold hover:opacity-90 transition-opacity shadow-lg"
                  style={{ background: NAVY, boxShadow: `0 4px 20px ${NAVY}30` }}
                >
                  Staff Sign In
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="/login?context=family"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white rounded-full font-semibold hover:bg-gray-50 transition-colors border-2"
                  style={{ color: NAVY, borderColor: `${NAVY}30` }}
                >
                  <Heart className="h-4 w-4" />
                  Family Sign In
                </a>
              </div>
              <p className="text-xs font-medium" style={{ color: NAVY_LIGHT }}>
                Access is limited to invited or approved families and staff.
              </p>
              <div
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}40`, color: '#8a6d10' }}
              >
                <Sparkles className="h-3.5 w-3.5 flex-shrink-0" />
                <span>
                  Want to look around?{' '}
                  <a href="/demo" className="font-semibold underline hover:opacity-80">
                    Try the demo
                  </a>
                  {' '}— username <code className="font-mono font-bold">JuneKc</code>, password <code className="font-mono font-bold">pre-k</code>
                </span>
              </div>
            </div>

            <div className="flex justify-center sm:justify-end">
              <div className="relative">
                <Image
                  src="/wilshire/mascot-cat.svg"
                  alt="Wilshire the Wildcat"
                  width={220}
                  height={220}
                  priority
                  className="drop-shadow-xl"
                />
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full px-3 py-1 shadow-lg border" style={{ borderColor: `${NAVY}20` }}>
                  <span className="text-xs font-bold" style={{ color: NAVY }}>Wilshire the Wildcat</span>
                </div>
              </div>
            </div>
          </div>
        </div>

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
      <section
        id="how-it-works"
        className="py-16 sm:py-20"
        style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_DEEP})` }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              How Wilshire Pickup Works
            </h2>
            <p className="max-w-2xl mx-auto" style={{ color: `${GOLD_LIGHT}cc` }}>
              From arrival to completed pickup, here is what happens during a typical dismissal.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Car, title: 'Family arrives', desc: 'A family pulls into the Wilshire pickup line and joins the queue of cars.' },
              { icon: ScanLine, title: 'Quick check-in', desc: 'Family scans the QR sign posted at the pickup entrance, or a staff member scans the family\'s QR code from their phone. Either way, the check-in is instant.' },
              { icon: ListOrdered, title: 'Live queue builds', desc: 'The student appears in the live dismissal queue instantly. Staff see the full sequence of 20, 30, even 50+ cars down the line and know exactly which child is next.' },
              { icon: Eye, title: 'Staff see it live', desc: 'Teachers, dismissal staff, and front office all share the same real-time view. No more walkie-talkie relays or guessing who has arrived.' },
              { icon: Clock, title: 'Status updates', desc: 'Each student moves through Arrived, Preparing, and Ready. Staff advance statuses with one tap, and everyone sees the update immediately.' },
              { icon: CheckCircle2, title: 'Pickup complete', desc: 'Student is released to the family. The session records the completed pickup with a timestamp for later review if needed.' },
            ].map((step, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 rounded-bl-full" style={{ background: `${GOLD}10` }} />
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 relative"
                  style={{ background: i % 2 === 0 ? NAVY : GOLD }}
                >
                  <step.icon className="h-6 w-6 text-white" />
                </div>
                <div className="absolute top-3 right-3 text-3xl font-black" style={{ color: `${NAVY}15` }}>
                  {i + 1}
                </div>
                <h3 className="font-bold text-sm mb-1" style={{ color: NAVY_DEEP }}>{step.title}</h3>
                <p className="text-sm" style={{ color: NAVY }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Families */}
      <section id="for-families" className="py-16 sm:py-20" style={{ background: `linear-gradient(to bottom, #ffffff, ${CREAM})` }}>
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
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border"
                style={{ background: '#fce4ec', color: '#c2185b', borderColor: '#f8bbd0' }}
              >
                <Heart className="h-3 w-3" />
                For Families
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: NAVY_DEEP }}>
                What families experience
              </h2>
              <p className="leading-relaxed" style={{ color: NAVY }}>
                Families continue following Wilshire&apos;s normal pickup and release procedures. The technology works behind the scenes to give staff a clearer shared picture of arrivals and readiness.
              </p>
              <div className="space-y-2">
                {[
                  'Scan the Wilshire QR sign when you reach the pickup line',
                  'See your child\'s status update in real time on your phone',
                  'No app to download, works in any browser',
                  'School pickup and release procedures remain unchanged',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm" style={{ color: NAVY }}>
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: '#4caf50' }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <a
                href="/login?context=family"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
                style={{ background: NAVY }}
              >
                <Heart className="h-4 w-4" />
                Family Sign In
              </a>
              <p className="text-xs font-medium" style={{ color: NAVY_LIGHT }}>
                Family access must be approved by the school office.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What staff see */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 border"
              style={{ background: `${NAVY}10`, color: NAVY, borderColor: `${NAVY}25` }}
            >
              <School className="h-3 w-3" />
              For Staff
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: NAVY_DEEP }}>
              What staff see
            </h2>
            <p className="max-w-2xl mx-auto" style={{ color: NAVY }}>
              One shared live view that keeps everyone coordinated during dismissal.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: ListOrdered, title: 'Live arrival sequence', desc: 'See who arrived and in what order.' },
              { icon: Eye, title: 'Student readiness', desc: 'Staff share the same Arrived, Preparing and Ready status.' },
              { icon: AlertCircle, title: 'Wait visibility', desc: 'Long waits and exceptions become easier to notice.' },
              { icon: Smartphone, title: 'Mobile operation', desc: 'Works across phones, tablets, Chromebooks and laptops.' },
              { icon: Settings2, title: 'Manual flexibility', desc: 'Staff can still manually check in students or handle exceptions.' },
              { icon: ScanLine, title: 'Scanner built in', desc: 'Scan QR codes or check in manually from any device.' },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 hover:shadow-md transition-shadow border-2"
                style={{ borderColor: `${NAVY}10` }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${NAVY}08`, color: NAVY }}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm mb-1" style={{ color: NAVY_DEEP }}>{item.title}</h3>
                <p className="text-sm" style={{ color: NAVY }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QR Scan section */}
      <section className="py-16" style={{ background: `linear-gradient(to right, ${CREAM}, #f0f4f8)` }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 order-2 sm:order-1">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border"
                style={{ background: '#e8f5e9', color: '#2e7d32', borderColor: '#a5d6a7' }}
              >
                <QrCode className="h-3 w-3" />
                Self Check-In
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: NAVY_DEEP }}>
                A quick scan is all it takes
              </h2>
              <p className="leading-relaxed" style={{ color: NAVY }}>
                When families reach the Wilshire pickup line, they scan the QR sign posted at the entrance. This lets staff know they have arrived, without changing any of the school&apos;s existing pickup and release procedures.
              </p>
              <div className="space-y-2">
                {[
                  'No app to download, works in any phone browser',
                  'QR codes use opaque identifiers, no student names embedded',
                  'Idempotent scanning means duplicate scans are harmless',
                  'Staff can always override or manually check in',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm" style={{ color: NAVY }}>
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: '#4caf50' }} />
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
      <section className="py-16 sm:py-20" style={{ background: `linear-gradient(to bottom, ${CREAM}, #ffffff)` }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: NAVY_DEEP }}>
            Designed to stay out of the way
          </h2>
          <p className="leading-relaxed mb-4" style={{ color: NAVY }}>
            The system automates routine steps where that helps, but does not make automation a dependency.
          </p>
          <p className="leading-relaxed" style={{ color: NAVY }}>
            Schools can use scheduled dismissal times or start manually. A QR remains active until staff choose to replace it. The goal is fewer required actions, not another workflow staff have to manage.
          </p>
        </div>
      </section>

      {/* QR Generation & Scanning Explained */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 border"
              style={{ background: `${GOLD}15`, color: '#8a6d10', borderColor: `${GOLD}40` }}
            >
              <QrCode className="h-3 w-3" />
              QR Codes & Scanning
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: NAVY_DEEP }}>
              How QR codes work in practice
            </h2>
            <p className="max-w-2xl mx-auto" style={{ color: NAVY }}>
              Two scanning modes. Same live queue. No app downloads for anyone.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {/* Mode 1: Family scans shared QR */}
            <div className="rounded-2xl p-6 border-2" style={{ borderColor: `${NAVY}15`, background: `${NAVY}05` }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: NAVY }}>
                  <ScanLine className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold" style={{ color: NAVY_DEEP }}>Family scans the QR sign</h3>
              </div>
              <p className="text-sm mb-3" style={{ color: NAVY }}>
                A shared QR code sign is posted at the pickup line entrance. When a family reaches the front of the line, they scan it with their phone camera. No app needed, works in any browser.
              </p>
              <p className="text-sm" style={{ color: NAVY_LIGHT }}>
                The QR code contains only a rotating token, no student names or personal data. Staff can rotate or revoke the code at any time.
              </p>
            </div>

            {/* Mode 2: Staff scans family QR */}
            <div className="rounded-2xl p-6 border-2" style={{ borderColor: `${GOLD}30`, background: `${GOLD}08` }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: GOLD }}>
                  <QrCode className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold" style={{ color: NAVY_DEEP }}>Staff scans family QR</h3>
              </div>
              <p className="text-sm mb-3" style={{ color: NAVY }}>
                Each family receives a personal QR pickup credential. A staff member with a phone or tablet scans the family\'s QR code as their car approaches. The student instantly appears in the queue.
              </p>
              <p className="text-sm" style={{ color: NAVY_LIGHT }}>
                This mode works well for younger grades where families may not scan themselves, or for staff who prefer to control the check-in process.
              </p>
            </div>
          </div>

          {/* Car sequence explanation */}
          <div className="rounded-2xl p-6 border-2" style={{ borderColor: `${NAVY}10`, background: `${CREAM}` }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: NAVY }}>
                <ListOrdered className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold mb-2" style={{ color: NAVY_DEEP }}>See 20, 30, even 50+ cars down the line</h3>
                <p className="text-sm mb-3" style={{ color: NAVY }}>
                  As each family checks in, the live queue shows the full sequence of arrivals. Staff can see that car 12 has the Smith family, car 15 has the Chen family, and car 23 is next. Teachers inside the building know which students to prepare and in what order.
                </p>
                <p className="text-sm" style={{ color: NAVY_LIGHT }}>
                  No more guessing from walkie-talkie calls. The sequence is recorded as families arrive and stays visible throughout the dismissal session.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal data, maximum value */}
      <section className="py-16" style={{ background: `linear-gradient(to bottom, #ffffff, ${CREAM})` }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 border"
            style={{ background: `${NAVY}10`, color: NAVY, borderColor: `${NAVY}25` }}
          >
            <Users className="h-3 w-3" />
            Minimal Data
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: NAVY_DEEP }}>
            No detailed student records needed
          </h2>
          <p className="leading-relaxed mb-4" style={{ color: NAVY }}>
            The system works with just a student\'s first name and grade level. No photos, no medical records, no home addresses. Schools can add more detail if they choose, but the core workflow needs only the basics.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 max-w-lg mx-auto mt-6">
            {[
              { label: 'First name', required: true },
              { label: 'Grade level', required: true },
              { label: 'Classroom (optional)', required: false },
            ].map((field) => (
              <div
                key={field.label}
                className="rounded-lg px-3 py-2 text-sm font-medium border"
                style={field.required
                  ? { background: `${NAVY}08`, borderColor: `${NAVY}20`, color: NAVY_DEEP }
                  : { background: `${GOLD}08`, borderColor: `${GOLD}30`, color: '#8a6d10' }
                }
              >
                {field.label}
                {field.required
                  ? <span className="ml-1 text-xs" style={{ color: '#2e7d32' }}>required</span>
                  : <span className="ml-1 text-xs" style={{ color: NAVY_LIGHT }}>optional</span>
                }
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hosting options */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 border"
              style={{ background: '#e8f5e9', color: '#2e7d32', borderColor: '#a5d6a7' }}
            >
              <Server className="h-3 w-3" />
              Deployment
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: NAVY_DEEP }}>
              Three ways to host it
            </h2>
            <p className="max-w-2xl mx-auto" style={{ color: NAVY }}>
              Wilshire chooses what works best. The system runs the same regardless of where it lives.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Server, title: 'Hosted by me', desc: 'I run it on isolated, tenant-scoped infrastructure I maintain. Zero cost to the school. Fastest to set up.' },
              { icon: School, title: 'School servers', desc: 'Deploy on Wilshire\'s own infrastructure. Full data sovereignty. I help with setup and configuration.' },
              { icon: GitBranch, title: 'Local / on-prem', desc: 'Run locally on a staff machine or school network. No external dependencies. Good for pilot testing.' },
            ].map((option) => (
              <div
                key={option.title}
                className="rounded-2xl p-5 border-2 text-center"
                style={{ borderColor: `${NAVY}10` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: `${NAVY}08`, color: NAVY }}
                >
                  <option.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-sm mb-2" style={{ color: NAVY_DEEP }}>{option.title}</h3>
                <p className="text-sm" style={{ color: NAVY_LIGHT }}>{option.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future enhancements */}
      <section className="py-16" style={{ background: `linear-gradient(135deg, ${NAVY_DEEP}, ${NAVY})` }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 border"
              style={{ background: `${GOLD}20`, color: GOLD_LIGHT, borderColor: `${GOLD}40` }}
            >
              <Sparkles className="h-3 w-3" />
              Roadmap
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Future enhancements
            </h2>
            <p className="max-w-2xl mx-auto" style={{ color: `${GOLD_LIGHT}cc` }}>
              The beta covers the core dismissal workflow. These features are on the roadmap based on feedback from staff and families.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: MapPin, title: 'Geofence auto check-in', desc: 'Families who opt in get automatically checked in when their phone enters the school pickup zone. No scanning needed.' },
              { icon: Palette, title: 'Full customization', desc: 'Adjust workflows per grade, release group, or teacher recommendation. Different pickup rules for kindergarten vs fifth grade.' },
              { icon: Clock, title: 'Scheduled dismissals', desc: 'Set recurring dismissal times per day of the week. Sessions auto-start and auto-close on schedule.' },
              { icon: Smartphone, title: 'Push notifications', desc: 'Families get a notification when their child is ready for pickup. Staff get alerts for exceptions or long waits.' },
              { icon: Layers, title: 'Multi-lane support', desc: 'Handle multiple pickup lanes or entrances. Each lane has its own queue view and check-in point.' },
              { icon: History, title: 'Analytics & reporting', desc: 'Average pickup times, peak congestion windows, and session summaries to help optimize dismissal over time.' },
            ].map((item) => (
              <div key={item.title} className="flex gap-3 items-start">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${GOLD}30` }}
                >
                  <item.icon className="h-5 w-5" style={{ color: GOLD_LIGHT }} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white mb-1">{item.title}</h3>
                  <p className="text-sm" style={{ color: `${GOLD_LIGHT}bb` }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beta & customization note */}
      <section className="py-16" style={{ background: `linear-gradient(to bottom, ${CREAM}, #ffffff)` }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 border"
            style={{ background: `${GOLD}15`, color: '#8a6d10', borderColor: `${GOLD}40` }}
          >
            <Sparkles className="h-3 w-3" />
            Beta Phase
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: NAVY_DEEP }}>
            This is a beta. Full customization available.
          </h2>
          <p className="leading-relaxed mb-4" style={{ color: NAVY }}>
            The current version covers the core dismissal workflow. Every school runs pickup differently, so the system is built to adapt. Workflows can be customized per release group, per grade level, or based on individual teacher recommendations.
          </p>
          <p className="leading-relaxed" style={{ color: NAVY_LIGHT }}>
            Have a specific need? The system is designed to flex around Wilshire\'s actual process, not the other way around.
          </p>
        </div>
      </section>

      {/* What improves beneath the surface */}
      <section className="py-16" style={{ background: `linear-gradient(135deg, ${NAVY_DEEP}, ${NAVY})` }}>
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
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: i % 2 === 0 ? NAVY_LIGHT : GOLD }}
                >
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white mb-1">{item.title}</h3>
                  <p className="text-sm" style={{ color: `${GOLD_LIGHT}bb` }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 border"
              style={{ background: '#e8f5e9', color: '#2e7d32', borderColor: '#a5d6a7' }}
            >
              <ShieldCheck className="h-3 w-3" />
              Privacy & Security
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: NAVY_DEEP }}>
              Access stays scoped to the people who need it
            </h2>
            <p className="leading-relaxed" style={{ color: NAVY }}>
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
              <div
                key={claim}
                className="flex items-center gap-2 text-sm rounded-lg px-3 py-2"
                style={{ color: NAVY_DEEP, background: `${NAVY}06` }}
              >
                <ShieldCheck className="h-4 w-4 flex-shrink-0" style={{ color: '#2e7d32' }} />
                <span>{claim}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-16" style={{ background: `linear-gradient(to bottom, #ffffff, ${CREAM})` }}>
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center" style={{ color: NAVY_DEEP }}>
            Architecture
          </h2>
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border-2" style={{ borderColor: `${NAVY}10` }}>
            <div className="space-y-3 text-sm font-mono text-center">
              <div className="px-4 py-3 rounded-xl font-semibold" style={{ background: `${NAVY}08`, border: `1px solid ${NAVY}20`, color: NAVY_DEEP }}>
                Google or Magic Link sign-in
              </div>
              <div style={{ color: NAVY_LIGHT }} className="text-lg">{'\u2193'}</div>
              <div className="px-4 py-3 rounded-xl font-semibold" style={{ background: `${NAVY}08`, border: `1px solid ${NAVY}20`, color: NAVY_DEEP }}>
                Authorized organization (Wilshire)
              </div>
              <div style={{ color: NAVY_LIGHT }} className="text-lg">{'\u2193'}</div>
              <div className="px-4 py-3 rounded-xl font-semibold" style={{ background: `${NAVY}08`, border: `1px solid ${NAVY}20`, color: NAVY_DEEP }}>
                Wilshire Elementary school site
              </div>
              <div style={{ color: NAVY_LIGHT }} className="text-lg">{'\u2193'}</div>
              <div className="px-4 py-3 rounded-xl font-semibold" style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}30`, color: NAVY_DEEP }}>
                Staff role or Guardian access
              </div>
              <div style={{ color: NAVY_LIGHT }} className="text-lg">{'\u2193'}</div>
              <div className="px-4 py-3 rounded-xl font-semibold text-white" style={{ background: NAVY }}>
                Students / Credentials / Sessions / Queue
              </div>
            </div>
          </div>
          <p className="leading-relaxed mt-4 text-center text-sm" style={{ color: NAVY }}>
            Identity, organization membership, school access and operational permissions are separate layers. Each request is checked against the context it actually needs.
          </p>
        </div>
      </section>

      {/* Personal story / Attribution */}
      <section className="py-16 text-center" style={{ background: `linear-gradient(to bottom, ${CREAM}, #ffffff)` }}>
        <div className="max-w-3xl mx-auto px-4">
          <Image
            src="/wilshire/school-building.svg"
            alt="Wilshire Elementary School"
            width={400}
            height={300}
            className="mx-auto rounded-2xl shadow-lg mb-8"
          />
          <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: NAVY_DEEP }}>
            Built for Wilshire, with gratitude.
          </h2>
          <p className="leading-relaxed max-w-xl mx-auto mb-4" style={{ color: NAVY }}>
            The idea came during Meet the Teacher night. Watching the pickup line swell with cars, seeing staff juggle walkie-talkies and mental lists of who had arrived, I realized there had to be a better way.
          </p>
          <p className="leading-relaxed max-w-xl mx-auto mb-4" style={{ color: NAVY }}>
            Wilshire is where my kid started their foundational years. This is my way of giving something back to the school community, a small tool to make one busy part of the day a little easier for the families and staff who make Wilshire what it is.
          </p>
          <p className="text-xs font-medium mt-4" style={{ color: NAVY_LIGHT }}>
            Independently built for the Wilshire community. Non-commercial, not for sale.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16" style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY_DEEP})` }}>
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Ready to get started?
          </h2>
          <p style={{ color: `${GOLD_LIGHT}cc` }}>
            Staff and families can sign in below. Access is limited to approved users.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/login?next=/app&context=wilshire"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white rounded-full font-semibold hover:bg-gray-50 transition-colors shadow-lg"
              style={{ color: NAVY }}
            >
              Staff Sign In
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/login?context=family"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white rounded-full font-semibold hover:opacity-90 transition-opacity border-2"
              style={{ background: NAVY_LIGHT, borderColor: NAVY_LIGHT }}
            >
              <Heart className="h-4 w-4" />
              Family Sign In
            </a>
          </div>
        </div>
      </section>

      {/* Wilshire Footer (self-contained, no SubodhKC footer) */}
      <footer className="border-t py-8" style={{ borderColor: `${NAVY}15`, background: '#ffffff' }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Image
                src="/wilshire/logo-color.png"
                alt="Wilshire Elementary"
                width={28}
                height={28}
              />
              <span className="font-bold text-sm" style={{ color: NAVY }}>
                Wilshire Elementary Pickup
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs" style={{ color: NAVY_LIGHT }}>
              <a href="/login?context=family" className="hover:underline">Family Sign In</a>
              <a href="/login?next=/app&context=wilshire" className="hover:underline">Staff Sign In</a>
              <a href="/demo" className="hover:underline">Try Demo</a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t text-center" style={{ borderColor: `${NAVY}10` }}>
            <p className="text-xs" style={{ color: NAVY_LIGHT }}>
              By using this service, you agree to the{' '}
              <Link href="/terms" className="underline hover:opacity-80">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="underline hover:opacity-80">Privacy Policy</Link>.
            </p>
            <p className="text-xs mt-2" style={{ color: `${NAVY}80` }}>
              Independently built for the Wilshire community. Non-commercial, not for sale.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
