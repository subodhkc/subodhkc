'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  EyeOff, 
  FileText, 
  Zap, 
  Shield,
  Lock,
  CheckCircle2,
  ArrowRight,
  Mail,
  Cpu,
  Fingerprint,
  AlertTriangle,
  FileSearch,
  Layers,
  Download,
  Clock,
  X,
  Server
} from 'lucide-react'

export default function PDFRedactorPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [downloadUnlocked, setDownloadUnlocked] = useState(false)
  const [error, setError] = useState('')

  const features = [
    {
      icon: Cpu,
      title: 'AI-Powered Detection',
      description: 'Automatically identifies SSNs, credit cards, phone numbers, emails, names, addresses, and 50+ PII patterns. No manual searching required.'
    },
    {
      icon: EyeOff,
      title: 'True Redaction',
      description: 'Not just black boxes over text. Our redaction permanently removes data from the PDF — no hidden layers, no metadata leaks, no recovery possible.'
    },
    {
      icon: Fingerprint,
      title: 'Pattern Recognition',
      description: 'Create custom patterns for industry-specific data. Medical record numbers, case IDs, internal codes — if it has a pattern, we can find it.'
    },
    {
      icon: Layers,
      title: 'Batch Processing',
      description: 'Redact hundreds of documents at once. Apply the same rules across your entire document set with one click.'
    },
    {
      icon: FileSearch,
      title: 'Audit Trail',
      description: 'Complete logging of every redaction. Know exactly what was removed, when, and by whom. Perfect for compliance requirements.'
    },
    {
      icon: Lock,
      title: '100% Local Processing',
      description: 'Your documents never leave your computer. All AI processing happens locally. Zero cloud uploads. Zero data exposure risk.'
    }
  ]

  const piiTypes = [
    'Social Security Numbers',
    'Credit Card Numbers',
    'Bank Account Numbers',
    'Phone Numbers',
    'Email Addresses',
    'Physical Addresses',
    'Names & Signatures',
    'Dates of Birth',
    'Driver\'s License Numbers',
    'Passport Numbers',
    'Medical Record Numbers',
    'IP Addresses',
    'Custom Patterns'
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
          source: 'pdf-redactor',
          product: 'PDF Redactor'
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
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-background to-red-500/5">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="h-4 w-4" />
            <span>Privacy-First Document Security</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Redact Sensitive Data.
            <br />
            <span className="text-red-500">Permanently.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            One data breach costs an average of $4.45 million. PDF Redactor uses AI to automatically detect and 
            permanently remove sensitive information from your documents — all processed locally on your machine. 
            No cloud. No risk. No trace.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            {downloadUnlocked ? (
              <>
                <a href="https://github.com/subodhkc/PDF-Redactor/releases" target="_blank" rel="noopener noreferrer" className="inline-flex">
                  <Button size="lg" className="text-lg px-8 gap-2 bg-red-600 hover:bg-red-700">
                    <Download className="h-5 w-5" />
                    Download for Windows
                  </Button>
                </a>
                <a href="https://github.com/subodhkc/PDF-Redactor" target="_blank" rel="noopener noreferrer" className="inline-flex">
                  <Button size="lg" variant="outline" className="text-lg px-8 gap-2">
                    View on GitHub
                  </Button>
                </a>
              </>
            ) : (
              <>
                <Button 
                  size="lg" 
                  className="text-lg px-8 gap-2 bg-red-600 hover:bg-red-700"
                  onClick={() => setShowModal(true)}
                >
                  <Download className="h-5 w-5" />
                  Get Free Download
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 gap-2">
                  See How It Works
                </Button>
              </>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            Windows • Free tier available • No account required
          </p>

          {/* Visual Demo */}
          <div className="mt-12 max-w-4xl mx-auto">
            <Card className="p-6 bg-gradient-to-br from-background to-red-500/5 border-red-500/20">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-left">
                  <div className="text-sm font-medium text-muted-foreground mb-2">BEFORE</div>
                  <div className="bg-gray-900 p-4 rounded-lg border font-mono text-sm space-y-2">
                    <p>Name: <span className="bg-yellow-900 px-1">John Smith</span></p>
                    <p>SSN: <span className="bg-yellow-900 px-1">123-45-6789</span></p>
                    <p>Email: <span className="bg-yellow-900 px-1">john@email.com</span></p>
                    <p>Card: <span className="bg-yellow-900 px-1">4532-1234-5678-9012</span></p>
                    <p>Phone: <span className="bg-yellow-900 px-1">(555) 123-4567</span></p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-amber-500">
                    <AlertTriangle className="h-3 w-3" />
                    <span>5 PII instances detected</span>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-muted-foreground mb-2">AFTER</div>
                  <div className="bg-gray-900 p-4 rounded-lg border font-mono text-sm space-y-2">
                    <p>Name: <span className="bg-black text-black px-1 rounded">████████</span></p>
                    <p>SSN: <span className="bg-black text-black px-1 rounded">███████████</span></p>
                    <p>Email: <span className="bg-black text-black px-1 rounded">██████████████</span></p>
                    <p>Card: <span className="bg-black text-black px-1 rounded">███████████████████</span></p>
                    <p>Phone: <span className="bg-black text-black px-1 rounded">██████████████</span></p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-green-500">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>All PII permanently removed</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="py-16 px-4 bg-red-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">$4.45M</div>
              <div className="text-white/80">Average cost of a data breach</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">277 days</div>
              <div className="text-white/80">Average time to identify a breach</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">83%</div>
              <div className="text-white/80">Of breaches involve human error</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Enterprise-Grade Redaction. Zero Complexity.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Drag. Drop. Redact. It&apos;s that simple. But under the hood, you get the same 
              technology used by Fortune 500 legal teams.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="hover:border-red-500/50 transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-red-500" />
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

      {/* PII Types Section */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Detects 50+ Types of Sensitive Data
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our AI is trained on millions of document patterns. It finds what humans miss — 
                and does it in seconds, not hours.
              </p>
              <div className="flex flex-wrap gap-2">
                {piiTypes.map((type, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-background border border-border rounded-full text-sm"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
            <Card className="p-8 bg-gradient-to-br from-red-500/5 to-background">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                  <EyeOff className="h-10 w-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4">True Permanent Redaction</h3>
                <p className="text-muted-foreground mb-6">
                  Unlike simple black boxes, our redaction removes data at the byte level. 
                  No hidden layers. No metadata traces. No recovery possible — ever.
                </p>
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Removes from all PDF layers</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Clears document metadata</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Flattens all annotations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Court-admissible output</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-gradient-to-br from-green-500/5 to-primary/5 border-green-500/20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  <Server className="h-4 w-4" />
                  100% Local Processing
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  Your Documents Never Leave Your Machine
                </h3>
                <p className="text-muted-foreground mb-6">
                  In a world of cloud breaches, we took a different approach. PDF Redactor runs 
                  entirely on your computer. No uploads. No cloud processing. No third-party access.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>All AI models run locally</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>No internet required after install</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Zero telemetry or tracking</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Open source core available</span>
                  </li>
                </ul>
              </div>
              <div className="flex justify-center">
                <div className="w-40 h-40 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Lock className="h-20 w-20 text-green-500" />
                </div>
              </div>
            </div>
          </Card>
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
              Four steps from raw document to court-admissible redacted PDF.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-red-500">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-3">Drag & Drop</h3>
              <p className="text-muted-foreground text-sm">
                Drop any PDF into PDF Redactor. The tool accepts single files or batch uploads for enterprise workflows.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-red-500">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-3">AI Auto-Detects PII</h3>
              <p className="text-muted-foreground text-sm">
                The AI engine scans your document and highlights all sensitive data — SSNs, credit cards, names, addresses, and 50+ other PII types.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-red-500">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-3">Review & Confirm</h3>
              <p className="text-muted-foreground text-sm">
                Review every detected item. Add custom patterns for industry-specific data. Remove false positives with one click.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-red-500">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-3">Export Redacted PDF</h3>
              <p className="text-muted-foreground text-sm">
                Get a permanently redacted PDF with all sensitive data removed at the byte level. No hidden layers, no metadata leaks, no recovery possible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for Your Industry
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From legal discovery to healthcare compliance — PDF Redactor handles the sensitive data your industry demands.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:border-red-500/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-red-500" />
                </div>
                <CardTitle className="text-lg">Legal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Redact client names, case numbers, and privileged information from court filings, discovery documents, and evidence packets. Court-admissible output.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:border-red-500/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-red-500" />
                </div>
                <CardTitle className="text-lg">Healthcare</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Remove PHI from medical records, insurance claims, and patient correspondence. HIPAA-compliant redaction with local processing — no data ever leaves your facility.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:border-red-500/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                  <Layers className="h-6 w-6 text-red-500" />
                </div>
                <CardTitle className="text-lg">Financial</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Redact account numbers, SSNs, and transaction details from bank statements, loan documents, and financial reports. GDPR and GLBA compliant.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:border-red-500/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                  <FileSearch className="h-6 w-6 text-red-500" />
                </div>
                <CardTitle className="text-lg">Government & FOIA</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Prepare documents for Freedom of Information Act responses. Remove classified information, personal details, and exempt content with full audit trails.
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
                <CardTitle className="text-lg">Is the redaction permanent?</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Yes. Unlike simple black boxes that just cover text, PDF Redactor removes data at the byte level. There are no hidden layers, no metadata traces, and no way to recover the original content. The redaction is permanent and court-admissible.
                </p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can redacted text be recovered?</CardTitle>
                <p className="text-muted-foreground text-sm">
                  No. PDF Redactor flattens all annotations, clears document metadata, and removes data from all PDF layers. Once redacted, the sensitive information is gone — not hidden, not obscured, permanently deleted.
                </p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Does it work offline?</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Yes. PDF Redactor runs entirely on your local machine. All AI processing happens on your computer. No internet connection is required after installation, and no document data is ever transmitted.
                </p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What file types are supported?</CardTitle>
                <p className="text-muted-foreground text-sm">
                  PDF Redactor currently supports PDF files. The AI engine can detect PII in both text-based and scanned PDFs. Additional file formats are being evaluated for future releases.
                </p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is it really free?</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Yes. PDF Redactor is free with a tier of 50 pages per month. The core redaction engine is open source and available on GitHub. A Pro version with unlimited pages and batch processing is planned.
                </p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How does it compare to Adobe Acrobat redaction?</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Adobe Acrobat requires a subscription and cloud processing. PDF Redactor is free, runs locally, and uses AI to auto-detect PII — no manual searching. Acrobat requires you to manually find and mark each sensitive item. PDF Redactor finds them for you.
                </p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is it HIPAA and GDPR compliant?</CardTitle>
                <p className="text-muted-foreground text-sm">
                  PDF Redactor is designed to help you meet HIPAA and GDPR requirements for document redaction. Because all processing is local, no PHI or personal data is transmitted to third parties. The audit trail feature provides documentation for compliance reporting.
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
                name: 'Is the redaction permanent?',
                acceptedAnswer: { '@type': 'Answer', text: 'Yes. Unlike simple black boxes that just cover text, PDF Redactor removes data at the byte level. There are no hidden layers, no metadata traces, and no way to recover the original content. The redaction is permanent and court-admissible.' },
              },
              {
                '@type': 'Question',
                name: 'Can redacted text be recovered?',
                acceptedAnswer: { '@type': 'Answer', text: 'No. PDF Redactor flattens all annotations, clears document metadata, and removes data from all PDF layers. Once redacted, the sensitive information is gone — not hidden, not obscured, permanently deleted.' },
              },
              {
                '@type': 'Question',
                name: 'Does it work offline?',
                acceptedAnswer: { '@type': 'Answer', text: 'Yes. PDF Redactor runs entirely on your local machine. All AI processing happens on your computer. No internet connection is required after installation, and no document data is ever transmitted.' },
              },
              {
                '@type': 'Question',
                name: 'What file types are supported?',
                acceptedAnswer: { '@type': 'Answer', text: 'PDF Redactor currently supports PDF files. The AI engine can detect PII in both text-based and scanned PDFs. Additional file formats are being evaluated for future releases.' },
              },
              {
                '@type': 'Question',
                name: 'Is it really free?',
                acceptedAnswer: { '@type': 'Answer', text: 'Yes. PDF Redactor is free with a tier of 50 pages per month. The core redaction engine is open source and available on GitHub. A Pro version with unlimited pages and batch processing is planned.' },
              },
              {
                '@type': 'Question',
                name: 'How does it compare to Adobe Acrobat redaction?',
                acceptedAnswer: { '@type': 'Answer', text: 'Adobe Acrobat requires a subscription and cloud processing. PDF Redactor is free, runs locally, and uses AI to auto-detect PII — no manual searching. Acrobat requires you to manually find and mark each sensitive item. PDF Redactor finds them for you.' },
              },
              {
                '@type': 'Question',
                name: 'Is it HIPAA and GDPR compliant?',
                acceptedAnswer: { '@type': 'Answer', text: 'PDF Redactor is designed to help you meet HIPAA and GDPR requirements for document redaction. Because all processing is local, no PHI or personal data is transmitted to third parties. The audit trail feature provides documentation for compliance reporting.' },
              },
            ],
          }),
        }}
      />

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-red-500/10 to-background" id="download">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stop Risking Data Exposure
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Download PDF Redactor free. Protect your documents. Sleep better at night.
          </p>

          {downloadUnlocked ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://github.com/subodhkc/PDF-Redactor/releases" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="text-lg px-8 gap-2 bg-red-600 hover:bg-red-700">
                    <Download className="h-5 w-5" />
                    Download for Windows
                  </Button>
                </a>
                <a href="https://github.com/subodhkc/PDF-Redactor" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="text-lg px-8 gap-2">
                    View Source on GitHub
                  </Button>
                </a>
              </div>
              <p className="text-sm text-muted-foreground">
                Open source • Mac version coming soon
              </p>
            </div>
          ) : (
            <Button 
              size="lg" 
              className="text-lg px-8 gap-2 bg-red-600 hover:bg-red-700"
              onClick={() => setShowModal(true)}
            >
              <Download className="h-5 w-5" />
              Get Free Download
            </Button>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>2-minute setup</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>No account required</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>Free tier: 50 pages/month</span>
            </div>
          </div>
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
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <EyeOff className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Get PDF Redactor Free</h3>
              <p className="text-sm text-muted-foreground">
                Enter your email to unlock the download. We&apos;ll also notify you about updates and the Pro version.
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
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary border border-border focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-colors"
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-500 mt-2">{error}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Unlock Download'}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                No spam, ever. Unsubscribe anytime.
              </p>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
