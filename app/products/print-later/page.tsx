'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Download,
  Github,
  Shield,
  Zap,
  Printer,
  FileText,
  Layers,
  Monitor,
  CheckCircle2,
  Lock,
  Eye,
  Server,
  Code,
  UserX,
  ArrowRight,
  Mail,
  Briefcase,
  X,
  Calculator,
  Home,
  GraduationCap,
  Users,
} from 'lucide-react'

export default function PrintLaterPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [downloadUnlocked, setDownloadUnlocked] = useState(false)
  const [error, setError] = useState('')

  const features = [
    {
      icon: Zap,
      title: 'Two Ways to Save Pages',
      description: 'Method 1: Click the Print Later icon in your browser toolbar and hit Save. The page is captured instantly. Method 2: Press Ctrl+P in any browser, select "Microsoft Print to PDF", save the file, then import it into Print Later. Both methods get you to the same organized queue.'
    },
    {
      icon: FileText,
      title: 'Your Print To-Do List',
      description: 'Everything you saved sits in one list. Search by name, sort by date, filter by status (pending, printed, failed). Add tags to organize documents by project, class, or client. Think of it as a to-do list for your printer.'
    },
    {
      icon: Layers,
      title: 'Pick Only the Pages You Need',
      description: 'Only need pages 3 through 5 from a 50-page document? Select just those pages. Stop wasting paper on cover pages and table of contents you do not need.'
    },
    {
      icon: Printer,
      title: 'Combine Pages Into One Print Job',
      description: 'Take pages from different websites and existing PDFs on your computer. Combine them into a single print job. Perfect for meeting handouts, research packets, and study materials.'
    },
    {
      icon: FileText,
      title: 'Import Existing PDFs Too',
      description: 'Print Later is not just for web pages. Import PDF files from your computer and treat them the same way - pick pages, combine with web pages, and batch print everything together.'
    },
    {
      icon: Monitor,
      title: 'Always Running, Never In the Way',
      description: 'Print Later sits quietly in the corner of your screen. Click it anytime to see your saved pages. It does not slow down your computer.'
    },
    {
      icon: Lock,
      title: 'Your Files Stay on Your Computer',
      description: 'Nothing leaves your computer. No cloud uploads, no tracking, no account needed. Your saved pages are yours alone.'
    },
    {
      icon: Printer,
      title: 'Print to Paper or Save as PDF',
      description: 'Send your saved pages to any printer on your computer. Or save them as a PDF file instead. Choose color or black and white, single or double-sided, and how many copies you need.'
    }
  ]

  const securityFeatures = [
    { icon: Server, text: 'No cloud uploads - Your documents stay on your computer' },
    { icon: Eye, text: 'No tracking - Zero data collection, zero analytics' },
    { icon: UserX, text: 'No account needed - Works completely offline' },
    { icon: Code, text: 'Open source - Anyone can read the code and verify it is safe' },
    { icon: Lock, text: 'No admin rights - Installs without special permissions' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          source: 'print-later',
          product: 'Print Later'
        })
      })

      if (res.ok) {
        setDownloadUnlocked(true)
        setShowModal(false)
      } else {
        const data = await res.json()
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-500 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span>100% Free</span>
            <span className="w-1 h-1 rounded-full bg-green-500" />
            <span>Open Source</span>
            <span className="w-1 h-1 rounded-full bg-green-500" />
            <span>No Account Needed</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Save Web Pages Now.
            <br />
            <span className="gradient-text">Print Them When Ready.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Stop printing entire websites you do not need. Save web pages and PDFs with one click, pick only the pages you actually want, and print them all at once when it works for you.
          </p>

          {/* Value strip: FREE / SECURED / SPEED */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-500">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Free Forever</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 text-blue-500">
              <Shield className="h-5 w-5" />
              <span className="font-medium">100% Private</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 text-amber-500">
              <Zap className="h-5 w-5" />
              <span className="font-medium">Saves Time & Paper</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            {downloadUnlocked ? (
              <>
                <a 
                  href="https://github.com/subodhkc/Print-Later/releases/download/v1.0.0/Print.Later.Setup.1.0.0.exe"
                  className="inline-flex"
                >
                  <Button size="lg" className="text-lg px-8 gap-2">
                    <Download className="h-5 w-5" />
                    Download for Windows
                  </Button>
                </a>
                <a 
                  href="https://github.com/subodhkc/Print-Later"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button size="lg" variant="outline" className="text-lg px-8 gap-2">
                    <Github className="h-5 w-5" />
                    View on GitHub
                  </Button>
                </a>
              </>
            ) : (
              <>
                <Button 
                  size="lg" 
                  className="text-lg px-8 gap-2"
                  onClick={() => setShowModal(true)}
                >
                  <Download className="h-5 w-5" />
                  Get Free Download
                </Button>
                <a 
                  href="https://github.com/subodhkc/Print-Later"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button size="lg" variant="outline" className="text-lg px-8 gap-2">
                    <Github className="h-5 w-5" />
                    View Source Code
                  </Button>
                </a>
              </>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            Windows 10/11 • 93 MB • Takes 30 seconds to install
          </p>

          {/* Screenshot */}
          <div className="mt-12 rounded-2xl overflow-hidden border border-border shadow-2xl">
            <Image
              src="/products/print-later/screenshot.png"
              alt="Print Later app showing saved web pages ready to print"
              width={1200}
              height={675}
              className="w-full"
              priority
            />
          </div>
        </div>
      </section>

      {/* 3-Step Install Guide - right after hero for non-technical users */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              How to Get Started in 30 Seconds
            </h2>
            <p className="text-muted-foreground">No technical skills needed. Three simple steps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Download and Install</h3>
              <p className="text-muted-foreground text-sm">
                Click "Get Free Download" above. Open the file and follow the simple setup wizard. Done in under a minute.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Save Pages You Want</h3>
              <p className="text-muted-foreground text-sm">
                Two ways to save: Click the Print Later icon in your browser toolbar and hit "Save to Print Queue" for instant capture. Or press Ctrl+P, select "Microsoft Print to PDF", save the file, and import it into the app. You can also import any existing PDF from your computer.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Print When Ready</h3>
              <p className="text-muted-foreground text-sm">
                Open Print Later. Pick the pages you need from each saved page. Combine them into one print job and send to your printer.
              </p>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-8">
            <strong>Note:</strong> Windows may show a "Windows protected your PC" message because the app is free and not code-signed. 
            Click "More info" then "Run anyway" to continue. The app is safe and open source - you can verify the code on GitHub.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              A Smarter Way to Print From the Web
            </h2>
            <p className="text-lg text-muted-foreground">
              Print Later is not just a print queue. It is a productivity tool that helps you save time, waste less paper, and stay organized.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="bg-background/50 hover:bg-background transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Shield className="h-4 w-4" />
                Your Privacy Comes First
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Your Documents Never Leave Your Computer
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                We built Print Later because we were tired of apps that spy on you. 
                Your documents are your business. Nothing gets uploaded, nothing gets tracked, and no one needs your email to use the app.
              </p>

              <div className="space-y-4">
                {securityFeatures.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30">
                      <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-green-500" />
                      </div>
                      <span className="text-foreground">{item.text}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <Card className="p-8 bg-gradient-to-br from-green-500/5 to-primary/5">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                  <Lock className="h-10 w-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Promise to You</h3>
                <p className="text-muted-foreground mb-6">
                  Print Later is built on a simple idea: your documents belong to you. 
                  We have no access to your files, no tracking, and no interest in your data. Ever.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-green-500">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Open Source - Anyone Can Verify This</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Three simple steps from browsing to printed pages. No complicated setup, no technical knowledge needed.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Save Pages While You Browse</h3>
              <p className="text-muted-foreground">
                Two ways to save. Fast way: Click the Print Later icon in your browser toolbar and hit "Save to Print Queue" - the page is captured instantly. Classic way: Press Ctrl+P, choose "Microsoft Print to PDF", save the file, then import it into Print Later. You can also import any existing PDF from your computer. Keep browsing and save as many pages as you want.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Organize and Pick Your Pages</h3>
              <p className="text-muted-foreground">
                Open Print Later anytime. See all your saved pages in one list. Search by name, sort by date, filter by status (pending, printed, failed), and add tags to organize by project or client. Pick exactly which pages you want from each document. Skip the cover pages and junk you do not need.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Print Everything at Once</h3>
              <p className="text-muted-foreground">
                Combine pages from different websites and PDFs into one print job. Choose color or black and white, single or double-sided, and how many copies. Click print and get a clean, organized stack of paper. Or save it all as one PDF file instead.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Objection Handling: Why not just Save as PDF? */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Not Just Use "Save as PDF"?
            </h2>
            <p className="text-lg text-muted-foreground">
              Save as PDF is fine for one page. Print Later is built for the real world where you need multiple pages from multiple sites.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-background/50">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <CardTitle className="text-xl">Save as PDF</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground text-sm">
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>One file per page. No way to combine them later.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>No way to pick specific pages from a long document.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Files scattered across your Downloads folder.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>No search, no sorting, no organization.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>You still have to open each file and print it one by one.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-background/50 border-green-500/30">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                  <Printer className="h-6 w-6 text-green-500" />
                </div>
                <CardTitle className="text-xl">Print Later</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Save pages from different sites into one organized list.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Pick only the pages you need from each document.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Search and sort all your saved pages in one place.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Combine pages into one print job and print once.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Saves paper, saves time, keeps you organized.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <p className="text-center text-muted-foreground mt-8">
            Think of it this way: Save as PDF is a stapler. Print Later is a filing cabinet with a printer attached.
          </p>
        </div>
      </section>

      {/* Better Than Screenshots Section */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Better Than Taking Screenshots
            </h2>
            <p className="text-lg text-muted-foreground">
              Screenshots capture images. Print Later captures real text that prints cleanly.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-background/50">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
                  <Monitor className="h-6 w-6 text-muted-foreground" />
                </div>
                <CardTitle className="text-xl">Screenshots</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground text-sm">
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Image only - text is not selectable or searchable.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Low quality when printed - looks blurry on paper.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>One image per screenshot. No way to combine them.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Long pages get cut off or need multiple screenshots.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Files scattered in your screenshot folder with random names.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-background/50 border-green-500/30">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-green-500" />
                </div>
                <CardTitle className="text-xl">Print Later</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Captures real text - prints sharp and clear on paper.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Full page captured, no matter how long.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Searchable list - find any saved page by name.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Combine multiple pages into one clean print job.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Pick only the pages you need. No wasted paper.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Interface Tour Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              A Clean Interface to Manage Everything
            </h2>
            <p className="text-lg text-muted-foreground">
              Open Print Later anytime to see all your saved pages, organize them, and print when ready.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-background/50">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                  <Monitor className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle className="text-lg">Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  See an overview of your print queue at a glance. Quick actions to print, preview, or delete. Know exactly what is pending and what is already printed.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background/50">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-purple-500" />
                </div>
                <CardTitle className="text-lg">Print Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  All your saved pages in one list. Search by name, sort by date, filter by status. Add tags to organize by project, class, or client. Click any item to preview, print, or delete.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background/50">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                  <Layers className="h-6 w-6 text-amber-500" />
                </div>
                <CardTitle className="text-lg">Packet Builder</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Combine pages from different documents into one print job. Pick which pages to include from each. Name your packet and print it all at once. Perfect for meetings and research.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background/50">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                  <Printer className="h-6 w-6 text-green-500" />
                </div>
                <CardTitle className="text-lg">Print Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Choose your default printer. Set color or black and white, single or double-sided, and number of copies. Print to paper or save as PDF. Configure once and forget it.
                </p>
              </CardContent>
            </Card>
          </div>
          <p className="text-center text-muted-foreground mt-8 text-sm">
            Print Later runs in your system tray (bottom-right corner of Windows). Right-click the icon for quick access to your queue, or double-click to open the full interface.
          </p>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Who Uses Print Later
            </h2>
            <p className="text-lg text-muted-foreground">
              Built for anyone who prints from the web and wants to do it smarter.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-background/50">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle className="text-lg">Students</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Save articles and reference pages while you research. Print only the pages you need for class instead of printing everything you find.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background/50">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-purple-500" />
                </div>
                <CardTitle className="text-lg">Office Workers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Save reports, invoices, and meeting materials from different websites. Print them all at once instead of one at a time.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background/50">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-amber-500" />
                </div>
                <CardTitle className="text-lg">Legal Professionals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Save case documents and reference materials throughout the day. Put together organized print packets for court and client meetings.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background/50">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                  <Layers className="h-6 w-6 text-green-500" />
                </div>
                <CardTitle className="text-lg">Anyone Who Prints</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Stop wasting paper on full-page prints when you only need one section. Stop losing track of what you wanted to print. Print Later fixes both.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background/50">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
                  <Calculator className="h-6 w-6 text-cyan-500" />
                </div>
                <CardTitle className="text-lg">Accountants</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Save receipts, invoices, and tax documents as you find them. Print everything for your expense report in one organized batch.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background/50">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center mb-4">
                  <Home className="h-6 w-6 text-rose-500" />
                </div>
                <CardTitle className="text-lg">Real Estate Agents</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Save listing pages, contracts, and property details from different sites. Print a clean packet for client meetings and showings.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background/50">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-indigo-500" />
                </div>
                <CardTitle className="text-lg">Teachers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Save worksheets, articles, and reference materials from different sites. Combine into one print job for your class handout packet.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background/50">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-teal-500" />
                </div>
                <CardTitle className="text-lg">HR Teams</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Save policy pages, training materials, and compliance documents. Print onboarding packets with only the pages each employee needs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How Print Later Compares
            </h2>
            <p className="text-lg text-muted-foreground">
              The honest differences. Pick the right tool for your workflow.
            </p>
          </div>
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Print Later vs. Save as PDF</h3>
                <p className="text-sm text-muted-foreground">
                  <strong>Print Later wins:</strong> Queue multiple pages, pick exact pages from
                  each, combine into one print job. Save as PDF creates one file per page - no
                  queue, no page selection, no batch printing.
                  <br />
                  <strong>Save as PDF wins:</strong> Built into every browser, no install needed.
                  If you just need to save one page as a PDF file, use Save as PDF. If you need to
                  organize and batch print multiple pages, use Print Later.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Print Later vs. Pocket / Read Later Apps</h3>
                <p className="text-sm text-muted-foreground">
                  <strong>Print Later wins:</strong> Designed for printing. Page selection, packet
                  builder, batch printing to a physical printer. 100% local - no cloud, no account.
                  <br />
                  <strong>Pocket wins:</strong> Cross-device sync, mobile apps, offline reading on
                  phone/tablet. If your goal is reading later on multiple devices, use Pocket. If
                  your goal is printing organized packets from web pages, use Print Later.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Print Later vs. Vovsoft Print Multiple Web Pages</h3>
                <p className="text-sm text-muted-foreground">
                  <strong>Print Later wins:</strong> Free and open source. Browser extension for
                  one-click save. Page selection within documents. Packet builder for combining
                  pages. No trial limitations.
                  <br />
                  <strong>Vovsoft wins:</strong> Can print from a list of URLs without opening each
                  page. If you need to batch print URLs you haven&apos;t visited yet, Vovsoft may
                  fit better. Print Later is designed for the &quot;save while browsing, print
                  later&quot; workflow.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is Print Later really free?</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Yes. Print Later is 100% free and open source. No premium tier, no hidden costs, no in-app purchases. The source code is available on GitHub for anyone to audit or contribute to.
                </p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Does Print Later work offline?</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Yes. Print Later runs entirely on your local machine. No internet connection is required after installation. Your saved pages and print queue are stored locally on your computer.
                </p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I save pages from any browser?</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Yes. The Print Later browser extension works with Chrome and Edge for one-click saving. For Firefox or any other browser, press Ctrl+P, select "Microsoft Print to PDF", save the file, then import it into Print Later. All pages go into the same queue regardless of which browser you used. You can also import any existing PDF from your computer.
                </p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How is my data stored?</CardTitle>
                <p className="text-muted-foreground text-sm">
                  All captured pages are stored locally on your computer in your user directory. Nothing is uploaded to the cloud, no telemetry is sent, and no account is required. You can delete your queue at any time.
                </p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What operating systems are supported?</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Print Later currently supports Windows 10 and Windows 11 (64-bit). Mac and Linux versions are being considered for future releases.
                </p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Why does Windows show a warning when I install?</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Print Later is free and open source, so it is not code-signed with an expensive Microsoft certificate. Click "More info" then "Run anyway" to install. The app is safe - you can read the source code on GitHub to verify.
                </p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How is this different from Save as PDF?</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Save as PDF creates one file per page with no way to combine them later. Print Later lets you save multiple pages from different sites, pick exact pages from each document, combine them into one print job, and batch print to a physical printer. Think of it as a productivity tool for printing, not just a PDF saver.
                </p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I print only specific pages from a long document?</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Yes. Open any saved document in Print Later and select exactly which pages you want. If you only need pages 3-5 from a 50-page PDF, select just those pages. Stop wasting paper on cover pages, tables of contents, and sections you do not need.
                </p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is this a good Pocket alternative for printing?</CardTitle>
                <p className="text-muted-foreground text-sm">
                  If your goal is reading articles later on your phone, Pocket is better - it syncs across devices. If your goal is organizing web pages and printing them as clean packets on paper, Print Later is better. It is purpose-built for the print workflow with page selection, packet building, and batch printing.
                </p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is Print Later just a print queue or a productivity tool?</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Print Later is a productivity tool, not just a print queue. It helps you save time by collecting pages while you browse, waste less paper by picking only the pages you need, and stay organized by keeping everything in one searchable list. Think of it as a to-do list for your printer.
                </p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I import existing PDF files from my computer?</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Yes. Print Later is not just for web pages. You can import PDF files from your computer and treat them the same way as saved web pages. Pick specific pages, combine them with web pages, and batch print everything together in one job.
                </p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How is this better than taking screenshots?</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Screenshots capture images, which means the text is not selectable or searchable, and they look blurry when printed. Print Later captures the actual page content as real text, so it prints sharp and clear. You also get a searchable list, page selection, and the ability to combine multiple pages into one print job.
                </p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I save pages as PDF instead of printing to paper?</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Yes. When you are ready to print, choose "Microsoft Print to PDF" as your printer. Print Later will save your pages or packets as a PDF file instead of sending them to a physical printer. You get the organization benefits of Print Later with the portability of PDF.
                </p>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Is Print Later really free?',
                acceptedAnswer: { '@type': 'Answer', text: 'Yes. Print Later is 100% free and open source. No premium tier, no hidden costs, no in-app purchases. The source code is available on GitHub for anyone to audit or contribute to.' },
              },
              {
                '@type': 'Question',
                name: 'Does Print Later work offline?',
                acceptedAnswer: { '@type': 'Answer', text: 'Yes. Print Later runs entirely on your local machine. No internet connection is required after installation. Your saved pages and print queue are stored locally on your computer.' },
              },
              {
                '@type': 'Question',
                name: 'Can I save pages from any browser?',
                acceptedAnswer: { '@type': 'Answer', text: 'Yes. The Print Later browser extension works with Chrome and Edge for one-click saving. For Firefox or any other browser, press Ctrl+P, select "Microsoft Print to PDF", save the file, then import it into Print Later. All pages go into the same queue regardless of which browser you used. You can also import any existing PDF from your computer.' },
              },
              {
                '@type': 'Question',
                name: 'How is my data stored?',
                acceptedAnswer: { '@type': 'Answer', text: 'All captured pages are stored locally on your computer in your user directory. Nothing is uploaded to the cloud, no telemetry is sent, and no account is required. You can delete your queue at any time.' },
              },
              {
                '@type': 'Question',
                name: 'What operating systems are supported?',
                acceptedAnswer: { '@type': 'Answer', text: 'Print Later currently supports Windows 10 and Windows 11 (64-bit). Mac and Linux versions are being considered for future releases.' },
              },
              {
                '@type': 'Question',
                name: 'Why does Windows SmartScreen show a warning?',
                acceptedAnswer: { '@type': 'Answer', text: 'Print Later is open source and not code-signed with an expensive Microsoft certificate. Click "More info" then "Run anyway" to install. The app is safe - you can verify the source code on GitHub.' },
              },
              {
                '@type': 'Question',
                name: 'How is this different from Save as PDF?',
                acceptedAnswer: { '@type': 'Answer', text: 'Save as PDF creates one file per page with no way to combine them later. Print Later lets you save multiple pages from different sites, pick exact pages from each document, combine them into one print job, and batch print to a physical printer. Think of it as a productivity tool for printing, not just a PDF saver.' },
              },
              {
                '@type': 'Question',
                name: 'Can I print only specific pages from a long document?',
                acceptedAnswer: { '@type': 'Answer', text: 'Yes. Open any saved document in Print Later and select exactly which pages you want. If you only need pages 3-5 from a 50-page PDF, select just those pages. Stop wasting paper on cover pages, tables of contents, and sections you do not need.' },
              },
              {
                '@type': 'Question',
                name: 'Is this a good Pocket alternative for printing?',
                acceptedAnswer: { '@type': 'Answer', text: 'If your goal is reading articles later on your phone, Pocket is better - it syncs across devices. If your goal is organizing web pages and printing them as clean packets on paper, Print Later is better. It is purpose-built for the print workflow with page selection, packet building, and batch printing.' },
              },
              {
                '@type': 'Question',
                name: 'Is Print Later just a print queue or a productivity tool?',
                acceptedAnswer: { '@type': 'Answer', text: 'Print Later is a productivity tool, not just a print queue. It helps you save time by collecting pages while you browse, waste less paper by picking only the pages you need, and stay organized by keeping everything in one searchable list. Think of it as a to-do list for your printer.' },
              },
              {
                '@type': 'Question',
                name: 'Can I import existing PDF files from my computer?',
                acceptedAnswer: { '@type': 'Answer', text: 'Yes. Print Later is not just for web pages. You can import PDF files from your computer and treat them the same way as saved web pages. Pick specific pages, combine them with web pages, and batch print everything together in one job.' },
              },
              {
                '@type': 'Question',
                name: 'How is this better than taking screenshots?',
                acceptedAnswer: { '@type': 'Answer', text: 'Screenshots capture images, which means the text is not selectable or searchable, and they look blurry when printed. Print Later captures the actual page content as real text, so it prints sharp and clear. You also get a searchable list, page selection, and the ability to combine multiple pages into one print job.' },
              },
              {
                '@type': 'Question',
                name: 'Can I save pages as PDF instead of printing to paper?',
                acceptedAnswer: { '@type': 'Answer', text: 'Yes. When you are ready to print, choose "Microsoft Print to PDF" as your printer. Print Later will save your pages or packets as a PDF file instead of sending them to a physical printer. You get the organization benefits of Print Later with the portability of PDF.' },
              },
            ],
          }),
        }}
      />

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Printing Smarter Today
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Download Print Later for free. Save time, waste less paper, and stay organized. 
            No signup needed for the app - just enter your email once to get the download link.
          </p>

          {downloadUnlocked ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://github.com/subodhkc/Print-Later/releases/download/v1.0.0/Print.Later.Setup.1.0.0.exe"
                className="inline-flex"
              >
                <Button size="lg" className="text-lg px-8 gap-2">
                  <Download className="h-5 w-5" />
                  Download for Windows (93 MB)
                </Button>
              </a>
            </div>
          ) : (
            <Button 
              size="lg" 
              className="text-lg px-8 gap-2"
              onClick={() => setShowModal(true)}
            >
              <Download className="h-5 w-5" />
              Get Free Download
            </Button>
          )}

          <div className="mt-8 p-4 bg-background/50 rounded-xl inline-block">
            <p className="text-sm text-muted-foreground mb-2">
              <strong>System Requirements</strong>
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm text-muted-foreground">
              <span>Windows 10/11 (64-bit)</span>
              <span>•</span>
              <span>4 GB RAM</span>
              <span>•</span>
              <span>200 MB disk space</span>
              <span>•</span>
              <span>Chrome or Edge</span>
            </div>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            <strong>Note:</strong> Windows may show a "Windows protected your PC" warning because the app is free and not code-signed. 
            Click "More info" then "Run anyway" to install. The app is safe and open source.
          </p>
        </div>
      </section>

      {/* Open Source Community Section */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Code className="h-4 w-4" />
            <span>Open Source on GitHub</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built in the Open. Improved by Everyone.
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Print Later is 100% open source. The full code is on GitHub for anyone to read, verify, and improve. 
            If you have a GitHub account, fork the repo and make it better. Found a bug or have an idea? Open an issue and let us know.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://github.com/subodhkc/Print-Later"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button size="lg" variant="outline" className="text-lg px-8 gap-2">
                <Github className="h-5 w-5" />
                View the Code
              </Button>
            </a>
            <a 
              href="https://github.com/subodhkc/Print-Later/fork"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button size="lg" variant="outline" className="text-lg px-8 gap-2">
                <Code className="h-5 w-5" />
                Fork on GitHub
              </Button>
            </a>
            <a 
              href="https://github.com/subodhkc/Print-Later/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button size="lg" variant="outline" className="text-lg px-8 gap-2">
                <Mail className="h-5 w-5" />
                Share Feedback
              </Button>
            </a>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            Every star, fork, and issue helps Print Later reach more people who waste less paper. 
            If you find it useful, give it a star on GitHub.
          </p>
        </div>
      </section>

      {/* Related Tool - CourtCase */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-gradient-to-br from-amber-500/5 to-orange-500/5 border-amber-500/20">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  Public Beta
                </div>
                <h3 className="text-2xl font-bold mb-2">CourtCase</h3>
                <p className="text-muted-foreground mb-4">
                  Organize your legal documents with ease. CourtCase helps you manage case files,
                  track deadlines, and prepare document packets - all locally on your computer.
                </p>
                <Link href="/products/courtcase">
                  <Button variant="outline" className="gap-2">
                    Learn More
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="w-32 h-32 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                <FileText className="h-16 w-16 text-amber-500" />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Email Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <Card className="relative z-10 w-full max-w-md p-6">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Get Print Later Free</h3>
              <p className="text-sm text-muted-foreground">
                Enter your email to unlock the download. We&apos;ll also notify you about updates and new tools.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-500 mt-2">{error}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Unlock Download'}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                No spam, ever. Unsubscribe anytime.
              </p>
            </form>

            <div className="mt-4 pt-4 border-t border-border text-center">
              <button
                onClick={() => {
                  setDownloadUnlocked(true)
                  setShowModal(false)
                }}
                className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-2"
              >
                No thanks, just give me the download
              </button>
            </div>
          </Card>
        </div>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Print Later',
            description: 'Free Windows app to save web pages and PDFs, pick exact pages, combine them into one print job, and batch print when ready. 100% local, no cloud, no tracking. Open source.',
            applicationCategory: 'ProductivityApplication',
            operatingSystem: 'Windows 10/11',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            author: {
              '@type': 'Person',
              name: 'Subodh KC',
              url: 'https://subodhkc.com',
            },
            url: 'https://subodhkc.com/products/print-later',
            downloadUrl: 'https://github.com/subodhkc/Print-Later/releases',
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
              { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://subodhkc.com/products' },
              { '@type': 'ListItem', position: 3, name: 'Print Later', item: 'https://subodhkc.com/products/print-later' },
            ],
          }),
        }}
      />
    </div>
  )
}
