import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Shield, Cpu, Building2, User } from 'lucide-react'

export const metadata = {
  title: 'FAQ | AI Governance, Compliance & Architecture | Subodh KC',
  description:
    'Frequently asked questions about AI governance, compliance frameworks, AI architecture, RAG, LLM monitoring, AI regulations for small business, and hiring Subodh KC as your AI Systems Architect.',
  alternates: {
    canonical: 'https://subodhkc.com/faq',
  },
  openGraph: {
    title: 'FAQ | AI Governance & Compliance | Subodh KC',
    description:
      'Answers to common questions about AI governance, compliance, architecture, regulations, and working with Subodh KC.',
    url: 'https://subodhkc.com/faq',
    type: 'website',
  },
  keywords: [
    'AI governance FAQ',
    'AI compliance FAQ',
    'AI architecture FAQ',
    'AI regulations small business',
    'AI audit preparation',
    'RAG AI explained',
    'LLM monitoring',
    'agentic AI systems',
    'hire AI architect',
    'Subodh KC FAQ',
  ],
}

const faqs = [
  {
    category: 'AI Governance',
    icon: Shield,
    items: [
      {
        q: 'What is AI governance and why does it matter?',
        a: 'AI governance is the framework of policies, processes, and controls that ensure AI systems operate safely, fairly, and in compliance with regulations. It matters because unchecked AI can introduce bias, drift, security vulnerabilities, and regulatory violations that result in fines, reputational damage, or harm to users. Without governance, organizations face legal exposure under the EU AI Act, NIST AI RMF, ISO 42001, and NYC Local Law 144.',
      },
      {
        q: 'What frameworks should my organization follow for AI compliance?',
        a: 'The primary frameworks are EU AI Act (for any organization touching EU users), NIST AI RMF (US federal and enterprise standard), ISO 42001 (international AI management system), and NYC Local Law 144 (for automated employment decision tools). Your applicable framework depends on your industry, geography, and use case. Subodh KC offers readiness and applicability assessments to determine exactly which frameworks apply to your organization.',
      },
      {
        q: 'How do I prepare for an AI audit?',
        a: 'Start by documenting your AI inventory, data lineage, model training processes, and decision-making workflows. Implement evidence architecture that generates audit-grade documentation automatically. Run bias testing and drift detection. Map each system to applicable regulatory requirements. Subodh KC\'s Modular Audit Engine framework automates much of this process, reducing audit preparation time from months to weeks.',
      },
    ],
  },
  {
    category: 'AI Architecture',
    icon: Cpu,
    items: [
      {
        q: 'What is RAG and how does it work?',
        a: 'Retrieval-Augmented Generation (RAG) combines a retrieval system (usually vector database + embeddings) with an LLM. Instead of relying on the model\'s training data, RAG retrieves relevant documents from your knowledge base and feeds them as context to the LLM. This grounds responses in your data, reduces hallucinations, and enables enterprise knowledge systems that are accurate and verifiable.',
      },
      {
        q: 'How do I monitor my LLM application in production?',
        a: 'Use runtime health monitors like llmverify (available on npm and PyPI) to track drift, hallucination risk, latency, and output quality. Set up automated alerts for anomaly detection. Implement CI/CD quality gates that fail builds on policy drift. Subodh KC\'s Precision Drift Detector framework provides numerical anomaly detection for model performance, identifying drift patterns before they impact business outcomes.',
      },
      {
        q: 'What are agentic AI systems?',
        a: 'Agentic AI systems are multi-agent architectures where AI agents orchestrate tool use, make autonomous decisions, and execute workflows with guardrails. Unlike single-model chatbots, agentic systems decompose complex tasks across specialized agents that collaborate, escalate, and self-correct. They require careful architecture for orchestration, context management, human escalation, and safety guardrails.',
      },
      {
        q: 'What is MCP (Model Context Protocol)?',
        a: 'Model Context Protocol (MCP) is a standard for connecting AI models to external data sources and tools. MCP servers act as secure data connectors that let AI systems access databases, APIs, and enterprise knowledge without exposing raw credentials. This enables production AI integrations that are secure, auditable, and maintainable.',
      },
    ],
  },
  {
    category: 'AI for Small Business',
    icon: Building2,
    items: [
      {
        q: 'Do small businesses need to comply with AI regulations?',
        a: 'Yes. If your small business uses AI for customer-facing decisions, automated screening, or processes data from EU residents, you are subject to AI regulations. The EU AI Act applies extraterritorially — any company offering AI systems to EU users must comply. NYC Local Law 144 applies to automated employment decision tools. Start with an AI inventory and applicability assessment to understand your specific obligations.',
      },
      {
        q: 'How can small businesses afford AI compliance?',
        a: 'Start with a readiness assessment to identify only the regulations that apply to you. Use open-source tools like HAIEC Action (GitHub Action for CI compliance scanning) and llmverify (runtime monitoring for LLM apps). Prioritize documentation and evidence architecture early — it is cheaper to build compliance in than retrofit it. Subodh KC offers a free monthly webinar on AI laws for small businesses to help you get started.',
      },
      {
        q: 'What AI policies should my small business have?',
        a: 'At minimum, you need an AI usage policy for employees (what AI tools are approved, what data can be shared), a data governance policy (how AI systems handle customer data), and a risk assessment process for new AI tools. Subodh KC\'s monthly webinar covers practical policy templates and frameworks designed specifically for small businesses.',
      },
    ],
  },
  {
    category: 'About Subodh KC',
    icon: User,
    items: [
      {
        q: 'Who is Subodh KC?',
        a: 'Subodh KC is an AI Systems Architect and Governance Expert with 16+ years of experience. He currently serves as Sr. Program Manager — AI Implementation & Governance at HP Inc. (Fortune 50). He is the founder of KestrelVoice (AI voice operations platform) and co-founder of HAIEC (AI compliance platform). He holds 5 patent-pending frameworks in AI compliance and drift detection, and holds M.Sc. and B.S. degrees from Louisiana Tech University.',
      },
      {
        q: 'What services does Subodh KC offer?',
        a: 'Three pillars: (1) AI Architecture & Integration — agentic systems, RAG, MCP integrations, workflow architecture; (2) AI Operations & Deployment — voice agents, monitoring, production hardening; (3) AI Governance & Assurance — compliance implementation (EU AI Act, NIST AI RMF, ISO 42001, NYC LL 144), evidence architecture, drift controls. Engagement models include project-based ($25K-$150K), retainer, and fractional executive ($10K-$25K/month).',
      },
      {
        q: 'How do I hire Subodh KC?',
        a: 'Use the contact form at subodhkc.com/contact or email subodh.kc@haiec.com directly. Subodh offers project-based engagements (3-6 months, $25K-$150K), retainers (6-12 months), and fractional executive roles (12+ months, $10K-$25K/month). Consulting rate is $300-$500/hour with project minimums. He is also open to full-time Director/VP roles at Fortune 500, Series B+ startups, and AI-first companies.',
      },
      {
        q: 'Does Subodh KC offer training or courses?',
        a: 'Yes. Subodh KC teaches a live AI Governance & Compliance Masterclass on the 1st and 3rd Thursday of every month at 8 PM CST. He also hosts a free monthly webinar on AI Laws and Policies for Small Business on the 2nd Monday of every month. Both are conducted online. Visit subodhkc.com/course or subodhkc.com/webinar/ai-laws-small-business for details.',
      },
    ],
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.flatMap((category) =>
    category.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    }))
  ),
}

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Hero
        subtitle="FAQ"
        title={
          <>
            Frequently Asked
            <br />
            <span className="gradient-text">Questions</span>
          </>
        }
        description="Answers to common questions about AI governance, compliance, architecture, regulations, and working with Subodh KC."
      />

      {faqs.map((category, catIndex) => {
        const Icon = category.icon
        return (
          <Section
            key={catIndex}
            subtitle={category.category}
            title={`${category.category} Questions`}
            className={catIndex % 2 === 1 ? 'bg-secondary/20' : undefined}
          >
            <div className="max-w-4xl mx-auto space-y-4">
              {category.items.map((item, itemIndex) => (
                <Card key={itemIndex} className="border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg mb-2">{item.q}</CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                          {item.a}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </Section>
        )
      })}

      <CTA
        title="Still Have Questions?"
        description="If you didn't find what you were looking for, reach out directly. Subodh KC responds personally to inquiries about AI governance, compliance, architecture, and engagement opportunities."
        primaryButton={{ text: 'Contact Subodh KC', href: '/contact' }}
        secondaryButton={{ text: 'View Services', href: '/services' }}
      />
    </>
  )
}
