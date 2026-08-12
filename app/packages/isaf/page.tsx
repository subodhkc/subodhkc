import Link from 'next/link'
import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import { Reveal } from '@/components/Reveal'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import {
  Shield,
  FileCheck,
  Code2,
  Lock,
  Terminal,
  Download,
  ExternalLink,
  CheckCircle2,
  Boxes,
  Database,
  Hash,
  Layers,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'ISAF - Instruction Stack Audit Framework | Subodh KC',
  description:
    'ISAF Logger adds automatic compliance logging to AI training pipelines in 3 lines of code. Cryptographic hash chains, EU AI Act Article 10 & 11, NIST AI RMF, ISO 42001, Colorado AI Act ready. Open source Python package by HAIEC.',
  alternates: {
    canonical: 'https://subodhkc.com/packages/isaf',
  },
  openGraph: {
    title: 'ISAF - Instruction Stack Audit Framework',
    description:
      'Automatic compliance logging for AI systems. 3 lines of code, cryptographic verification, EU AI Act-ready documentation.',
    url: 'https://subodhkc.com/packages/isaf',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ISAF - Instruction Stack Audit Framework',
    description: 'Automatic compliance logging for AI systems. 3 lines of code, cryptographic verification.',
  },
  keywords: [
    'ISAF',
    'Instruction Stack Audit Framework',
    'AI compliance logging',
    'EU AI Act Article 10',
    'AI audit trail',
    'cryptographic verification',
    'AI governance',
    'ML training documentation',
    'HAIEC',
    'tamper-evident audit',
    'ISO 42001',
    'NIST AI RMF',
  ],
}

export default function ISAFPage() {
  return (
    <>
      <Hero
        title="ISAF Logger"
        subtitle="Instruction Stack Audit Framework"
        description="Automatic compliance logging for AI systems. Add 3 lines of code, get EU AI Act-ready documentation with cryptographic verification. Works with PyTorch, TensorFlow, JAX, and scikit-learn."
      >
        <div className="flex flex-wrap gap-3 mt-6">
          <Link
            href="https://github.com/haiec/isaf-logger"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <ExternalLink className="h-4 w-4" />
            View on GitHub
          </Link>
          <Link
            href="https://pypi.org/project/haiec-isaf-logger/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-foreground/20 rounded-full text-sm font-medium hover:bg-foreground/5 transition-colors"
          >
            <Download className="h-4 w-4" />
            pip install haiec-isaf-logger
          </Link>
        </div>
      </Hero>

      {/* Why ISAF */}
      <Section>
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-2xl font-bold tracking-tight mb-3">Why ISAF Logger?</h2>
          <p className="text-muted-foreground">
            AI regulations are here. EU AI Act, Colorado AI Act, NYC Local Law 144 all require documentation of how your AI systems were trained. ISAF automates this.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Code2, title: '3 Lines of Code', desc: 'Add compliance logging to any ML training pipeline with minimal code changes. Works with your existing workflow.' },
            { icon: Layers, title: 'Full Stack Coverage', desc: 'Automatically logs Layer 6 (Framework), Layer 7 (Data), and Layer 8 (Objectives) of the instruction stack.' },
            { icon: Hash, title: 'Cryptographic Verification', desc: 'SHA-256 hash chains prove lineage integrity. Tamper-evident audit trails that regulators trust.' },
            { icon: FileCheck, title: 'Compliance Ready', desc: 'Maps directly to EU AI Act Article 10 & 11, NIST AI RMF, ISO 42001, and Colorado AI Act requirements.' },
            { icon: Boxes, title: 'Framework Agnostic', desc: 'Works with PyTorch, TensorFlow, JAX, and scikit-learn. Auto-detects your ML framework.' },
            { icon: Database, title: 'Flexible Storage', desc: 'SQLite for local development, MLflow integration for production. Export to JSON anytime.' },
          ].map((f) => (
            <Reveal key={f.title}>
              <Card className="h-full">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{f.title}</CardTitle>
                  <CardDescription className="text-sm">{f.desc}</CardDescription>
                </CardHeader>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Quick Start */}
      <Section className="bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight mb-2">Quick Start</h2>
            <p className="text-muted-foreground">Get compliance logging in under 5 minutes</p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">1</span>
                Install
              </h3>
              <pre className="bg-code rounded-lg p-4 overflow-x-auto text-sm font-mono"><code>{`pip install haiec-isaf-logger`}</code></pre>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">2</span>
                Add to Your Code
              </h3>
              <pre className="bg-code rounded-lg p-4 overflow-x-auto text-sm font-mono"><code>{`import isaf

# Initialize ISAF (one line)
isaf.init()

# Add decorators to your training functions
@isaf.log_data(source="customer_data", version="3.2.1")
def load_training_data():
    return pd.read_csv("data.csv")

@isaf.log_objective(
    name="binary_crossentropy",
    constraints=["fairness < 0.05"]
)
def train_model(data):
    model = create_model()
    model.fit(data)
    return model

# Run training as normal
data = load_training_data()
model = train_model(data)

# Export compliance report (one line)
isaf.export("compliance_report.json")`}</code></pre>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">3</span>
                What Gets Logged
              </h3>
              <div className="grid gap-3 sm:grid-cols-3">
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Layer 6: ML Framework</p>
                    <p className="text-sm">Framework versions, CUDA availability, default parameters, numerical precision</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Layer 7: Training Data</p>
                    <p className="text-sm">Data source, version, shape, dtypes, missing values, preprocessing operations</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Layer 8: Objective Function</p>
                    <p className="text-sm">Loss function, mathematical form, constraints, hyperparameters, justification</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10">
              <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold">Cryptographic Hash Chain</p>
                <p className="text-sm text-muted-foreground">Every layer is linked with SHA-256 hashes. Tamper-evident audit trail.</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Regulatory Compliance Mappings */}
      <Section>
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-2xl font-bold tracking-tight mb-2">Regulatory Compliance Mappings</h2>
          <p className="text-muted-foreground">ISAF automatically maps your logged data to specific regulatory requirements</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'EU AI Act', items: ['Article 10 - Data Governance', 'Article 11 - Technical Documentation'] },
            { title: 'NIST AI RMF', items: ['MEASURE-2.2 - Evaluation metrics', 'GOVERN-1.1 - AI policies'] },
            { title: 'ISO 42001', items: ['Section 8.4 - Control of externally provided AI'] },
            { title: 'Colorado AI Act', items: ['SB24-205 - Impact Assessment Documentation'] },
          ].map((reg) => (
            <Reveal key={reg.title}>
              <Card className="h-full">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{reg.title}</CardTitle>
                  <div className="space-y-1.5 mt-2">
                    {reg.items.map((item) => (
                      <div key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardHeader>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* CLI Tools */}
      <Section className="bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight mb-2">CLI Tools</h2>
            <p className="text-muted-foreground">Inspect and verify lineage files from the command line</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: Terminal, title: 'Inspect', desc: 'View formatted report of lineage file with audit ID, timestamp, and logged layers.' },
              { icon: Hash, title: 'Verify', desc: 'Verify cryptographic integrity of hash chain. Confirms data hasn\'t been tampered with.' },
              { icon: Download, title: 'Export', desc: 'Export lineage from SQLite database to ISAF-compliant JSON format.' },
            ].map((tool) => (
              <Card key={tool.title}>
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <tool.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{tool.title}</CardTitle>
                  <CardDescription className="text-sm">{tool.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Research Foundation */}
      <Section>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight mb-2">Research Foundation</h2>
            <p className="text-muted-foreground">ISAF is based on a technical methodology published as a preprint on Zenodo with a registered DOI</p>
          </div>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <p className="text-sm font-semibold">Published Whitepaper</p>
                <p className="text-sm text-muted-foreground mt-1">
                  The Instruction Stack Audit Framework (ISAF): A Technical Methodology for Tracing AI Accountability Across Nine Abstraction Layers
                </p>
                <p className="text-xs text-muted-foreground mt-2 font-mono">
                  KC, S. (2025). Version 1.0. Zenodo. DOI: 10.5281/zenodo.18080355
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                This framework addresses the fundamental traceability gap in AI governance by providing technical specifications for documenting the full instruction stack from hardware substrate to emergent behavior. Includes a 127-checkpoint audit protocol and cryptographic verification methodology.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="https://zenodo.org/records/18080355"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-foreground/20 rounded-full text-sm font-medium hover:bg-foreground/5 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Read Full Paper
                </Link>
                <Link
                  href="https://www.haiec.com/research"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-foreground/20 rounded-full text-sm font-medium hover:bg-foreground/5 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  View All Research
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* CTA */}
      <CTA
        title="Ready to Add Compliance Logging?"
        description="ISAF Logger is open source and free to use. Get started in minutes."
        primaryButton={{ text: 'GitHub Repository', href: 'https://github.com/haiec/isaf-logger' }}
        secondaryButton={{ text: 'Enterprise Support', href: 'https://www.haiec.com/contact' }}
      />

      <div className="text-center pb-8">
        <p className="text-xs text-muted-foreground">
          Built by{' '}
          <Link href="/solutions/haiec" className="underline hover:text-foreground font-medium">
            HAIEC
          </Link>
          {' '} - Holistic AI Ethics & Compliance
        </p>
      </div>
    </>
  )
}
