import Hero from '@/components/Hero'
import Section from '@/components/Section'
import CTA from '@/components/CTA'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LeadMagnetCard } from '@/components/LeadMagnetCard'
import { TRAIGAApplicabilityChecker } from '@/components/traiga/TRAIGAApplicabilityChecker'
import { TRAIGAEnforcementFlow } from '@/components/diagrams/TRAIGAEnforcementFlow'
import { NISTLiteFramework } from '@/components/diagrams/NISTLiteFramework'
import { DiagramReveal } from '@/components/DiagramReveal'
import { Scale, Shield, AlertTriangle, Building2, HeartPulse, Fingerprint, CheckCircle2, FileText, Users, Zap, ArrowRight, Phone } from 'lucide-react'
import Link from 'next/link'
import Grid from '@/components/Grid'

export const metadata = {
  title: 'Does the Texas AI Law Apply to My Business? TRAIGA Guide | Subodh KC',
  description:
    'A plain-English Texas AI law guide for small businesses. Check whether TRAIGA applies, review disclosure rules, penalties, examples, and final-law changes.',
  alternates: {
    canonical: 'https://subodhkc.com/does-texas-ai-law-apply-to-my-business',
  },
  openGraph: {
    title: 'Does the Texas AI Law Apply to My Business? TRAIGA Guide',
    description:
      'A plain-English Texas AI law guide for small businesses. Check whether TRAIGA applies, review disclosure rules, penalties, examples, and final-law changes.',
    url: 'https://subodhkc.com/does-texas-ai-law-apply-to-my-business',
    type: 'article',
    authors: ['Subodh KC'],
    publishedTime: '2026-07-15',
    modifiedTime: '2026-07-15',
    tags: ['Texas AI Law', 'TRAIGA', 'HB 149', 'AI Compliance', 'Small Business', 'Healthcare AI'],
    images: ['https://subodhkc.com/og-default.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Does the Texas AI Law Apply to My Business? TRAIGA Guide',
    description:
      'A plain-English Texas AI law guide for small businesses. Check whether TRAIGA applies, review disclosure rules, penalties, examples, and final-law changes.',
    images: ['https://subodhkc.com/og-default.png'],
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
  keywords: [
    'does the Texas AI law apply to my business',
    'Texas AI law for small businesses',
    'TRAIGA compliance checklist',
    'Texas HB 149 requirements',
    'Texas AI chatbot disclosure law',
    'Texas AI law healthcare disclosure',
    'Texas AI law penalties',
    'Texas AI law hiring tools',
    'Texas biometric AI law',
    'is there a TRAIGA small-business exemption',
    'Texas AI law applicability checker',
    'Texas AI law final version versus draft',
    'Texas Responsible AI Governance Act',
    'Subodh KC Texas AI law',
  ],
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Does the Texas AI Law Apply to My Business? A Plain-English TRAIGA Guide for Small and Midsize Businesses',
  description:
    'A plain-English Texas AI law guide for small businesses. Check whether TRAIGA applies, review disclosure rules, penalties, examples, and final-law changes.',
  author: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com/person/subodh-kc' },
  publisher: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
  datePublished: '2026-07-15',
  dateModified: '2026-07-15',
  url: 'https://subodhkc.com/does-texas-ai-law-apply-to-my-business',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://subodhkc.com/does-texas-ai-law-apply-to-my-business' },
  image: 'https://subodhkc.com/og-default.png',
  inLanguage: 'en',
  articleSection: 'AI Compliance',
  wordCount: 6500,
  keywords: ['Texas AI law', 'TRAIGA', 'HB 149', 'small business', 'AI compliance', 'applicability checker', 'healthcare AI', 'biometric AI'],
  about: ['Texas Responsible Artificial Intelligence Governance Act', 'Texas HB 149', 'AI compliance for small businesses', 'Texas AI law applicability'],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
    { '@type': 'ListItem', position: 2, name: 'Writing', item: 'https://subodhkc.com/writing' },
    { '@type': 'ListItem', position: 3, name: 'Does the Texas AI Law Apply to My Business?', item: 'https://subodhkc.com/does-texas-ai-law-apply-to-my-business' },
  ],
}

const faqs = [
  { q: 'Does the Texas AI law apply to small businesses?', a: 'Yes, potentially. The final TRAIGA text does not contain an express small-business exemption. Applicability depends on the company\u2019s Texas connection and the AI system\u2019s use\u2014not only company size.' },
  { q: 'Is there a revenue threshold under TRAIGA?', a: 'No general revenue threshold appears in the final enacted TRAIGA applicability provision. Other Texas privacy laws may have their own scope and exemptions, but those should not be confused with TRAIGA.' },
  { q: 'Does using ChatGPT make my company subject to TRAIGA?', a: 'Using ChatGPT or another AI product may make the business a deployer of an AI system in Texas, depending on how it is put into use. However, use alone does not trigger a general registration, impact-assessment, or disclosure requirement. The use case and conduct determine which substantive provisions matter.' },
  { q: 'Do I have to register my AI system with Texas?', a: 'TRAIGA does not establish a general registration requirement for private-business AI systems. The regulatory sandbox has a separate application process for organizations seeking to participate in that program.' },
  { q: 'Does Texas require an AI impact assessment?', a: 'TRAIGA does not impose a general mandatory impact assessment on every private developer or deployer. Maintaining similar information is still prudent because the Attorney General may request purpose, data, output, performance, limitation, monitoring, and safeguard documentation during an investigation.' },
  { q: 'Does my private website chatbot need an AI disclosure?', a: 'Not under TRAIGA as a universal rule. The statute expressly requires consumer-interaction disclosure for government agencies and disclosure when AI is used in relation to healthcare services or treatment.' },
  { q: 'Should a private business disclose its AI chatbot voluntarily?', a: 'Often, yes. Voluntary disclosure may improve customer trust, reduce confusion, support recording or privacy notices, and make escalation expectations clearer. That is a business and governance recommendation\u2014not a universal TRAIGA requirement.' },
  { q: 'Does an AI phone receptionist need disclosure in Texas?', a: 'TRAIGA does not create a general disclosure rule for every private AI phone receptionist. Healthcare use, government use, call-recording rules, consumer-protection law, and other sector requirements may change the answer.' },
  { q: 'Does TRAIGA apply to employee hiring tools?', a: 'Potentially. Employees and applicants acting in an employment context are excluded from TRAIGA\u2019s \u201cconsumer\u201d definition, but the law\u2019s intent-based unlawful-discrimination prohibition applies more broadly to developers and deployers.' },
  { q: 'Does TRAIGA require a bias audit?', a: 'No general bias-audit requirement appears in the final law. Testing remains a strong risk-control measure, particularly for hiring, lending, insurance, healthcare, and other consequential uses.' },
  { q: 'Is disparate impact a TRAIGA violation?', a: 'Disparate impact alone is not sufficient to prove discriminatory intent under TRAIGA\u2019s unlawful-discrimination provision. Other civil-rights laws may apply different standards.' },
  { q: 'Does TRAIGA apply to healthcare AI?', a: 'Yes, in relevant circumstances. AI used in relation to healthcare services or treatment triggers a disclosure requirement. Diagnostic AI may also be regulated under Texas SB 1188.' },
  { q: 'Does HIPAA replace TRAIGA?', a: 'No. HIPAA governs protected health information and covered healthcare relationships. TRAIGA regulates specified AI conduct and disclosure. A healthcare AI system may need to satisfy both, along with other medical and professional requirements.' },
  { q: 'Does TRAIGA regulate facial recognition?', a: 'Yes, through restrictions on certain government biometric identification and through its connection to Texas\u2019s existing commercial biometric-identifier law.' },
  { q: 'Is an ordinary photograph considered biometric data?', a: 'Not necessarily. TRAIGA\u2019s biometric-data definition excludes ordinary photographs, video, audio, and data generated from them unless the relevant data constitutes a unique biological pattern used to identify a specific individual.' },
  { q: 'Can consumers sue my business directly under TRAIGA?', a: 'No. TRAIGA expressly states that it does not create a private right of action. The Texas Attorney General is the primary enforcement authority. Other laws may still permit private lawsuits based on the same underlying conduct.' },
  { q: 'What happens if someone files a TRAIGA complaint?', a: 'The Attorney General may investigate and issue a civil investigative demand requesting system documentation. If a violation is alleged, the business generally receives notice and a 60-day opportunity to cure before an enforcement action.' },
  { q: 'What are the penalties?', a: 'Potential penalties range from $10,000\u2013$12,000 for specified uncured curable violations, $80,000\u2013$200,000 for uncurable violations, and $2,000\u2013$40,000 per day for continuing violations.' },
  { q: 'Does NIST compliance guarantee immunity?', a: 'No. Substantial NIST alignment may support the statute\u2019s non-liability provisions in specified circumstances, but it is not automatic immunity.' },
  { q: 'What is the minimum documentation a small business should maintain?', a: 'At minimum: system name and owner, purpose, users, data inputs, outputs, vendor and model, known limitations, testing, human oversight, monitoring, safeguards, disclosures, and incident contact. These fields substantially overlap with information the Attorney General may request.' },
  { q: 'How often should TRAIGA compliance be reviewed?', a: 'Review whenever the business changes AI model, vendor, data source, intended use, user group, decision authority, tool access, disclosure, safety controls, or applicable law. A periodic annual review is also prudent even though TRAIGA does not generally mandate one.' },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
}

const howToSteps = [
  'Inventory the AI',
  'Assign an owner',
  'Determine your role',
  'Classify the use case',
  'Map the data',
  'Review disclosures',
  'Test prohibited behavior',
  'Document limitations and oversight',
  'Prepare for complaints',
  'Prepare a 60-day cure-response package',
]

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Ten-Step TRAIGA Readiness Plan for Small Businesses',
  description: 'A practical ten-step plan to prepare a small or midsize business for Texas AI law (TRAIGA) compliance.',
  step: howToSteps.map((step, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: step,
  })),
}

const tocItems = [
  { id: 'direct-answer', label: 'The Direct Answer' },
  { id: 'at-a-glance', label: 'Texas AI Law at a Glance' },
  { id: 'ai-system-definition', label: 'What Counts as an AI System?' },
  { id: 'out-of-state', label: 'Does TRAIGA Apply Out-of-State?' },
  { id: 'applicability-checker', label: 'Quick TRAIGA Applicability Checker' },
  { id: 'what-to-watch', label: 'What Private Businesses Need to Watch' },
  { id: 'chatbot-disclosure', label: 'Does Every Chatbot Need Disclosure?' },
  { id: 'healthcare-ai', label: 'Healthcare AI Requirements' },
  { id: 'biometrics', label: 'Biometrics and AI' },
  { id: 'hiring-ai', label: 'Hiring and Employee AI' },
  { id: 'final-vs-draft', label: 'Final Law vs Earlier Drafts' },
  { id: 'ag-documentation', label: 'AG Documentation Requests' },
  { id: 'enforcement', label: 'Enforcement, Cure Period, and Penalties' },
  { id: 'nist-safe-harbor', label: 'Is NIST Compliance a Safe Harbor?' },
  { id: 'business-scenarios', label: 'Practical Business Scenarios' },
  { id: 'readiness-plan', label: 'Ten-Step Readiness Plan' },
  { id: 'faq', label: 'FAQ' },
  { id: 'source-hierarchy', label: 'Official Source Hierarchy' },
  { id: 'final-takeaway', label: 'Final Takeaway' },
  { id: 'related-guides', label: 'Related Guides' },
]

export default function DoesTexasAILawApplyPage() {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <Hero
        subtitle="Plain-English Legal Guide"
        title={
          <>
            Does the Texas AI Law
            <br />
            <span className="gradient-text">Apply to My Business?</span>
          </>
        }
        description="A plain-English TRAIGA guide for small and midsize businesses — applicability checker, disclosure rules, penalties, examples, and final-law-vs-draft matrix."
      />

      {/* Byline + TOC */}
      <Section className="pt-8 pb-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-muted-foreground mb-1">By Subodh KC · July 15, 2026 · 30 min read</p>
          <div className="mt-2 rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground space-y-1">
            <p><strong className="text-foreground">Last legally reviewed:</strong> July 15, 2026</p>
            <p><strong className="text-foreground">Law reviewed:</strong> Texas Business &amp; Commerce Code Chapters 551\u2013554, enacted through HB 149</p>
            <p><strong className="text-foreground">Effective date:</strong> January 1, 2026</p>
          </div>
          <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/20 p-3">
            <p className="text-xs text-amber-900 dark:text-amber-200">
              <strong>Educational notice:</strong> This guide explains the statute in practical terms. Applicability can depend on facts, contracts, industry rules, and other federal or state laws. It is not a substitute for legal advice.
            </p>
          </div>
          <details className="mt-4 rounded-lg border border-border bg-muted/30 p-4">
            <summary className="cursor-pointer text-sm font-semibold text-foreground">Table of Contents</summary>
            <nav className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1">
              {tocItems.map((item) => (
                <a key={item.id} href={`#${item.id}`} className="text-sm text-muted-foreground hover:text-primary transition-colors py-0.5">
                  {item.label}
                </a>
              ))}
            </nav>
          </details>
        </div>
      </Section>

      {/* Synopsis */}
      <Section className="pt-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-accent/5 to-background p-6 md:p-8">
            <h2 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">Synopsis</h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/90">
              The Texas Responsible Artificial Intelligence Governance Act (TRAIGA), enacted through HB 149 and effective January 1, 2026, can apply to businesses of any size — but it is narrower than most commentary suggests. There is no small-business exemption, no general registration requirement, no mandatory impact assessment, and no universal private-chatbot disclosure rule. The law targets specific prohibited conduct (harm, crime, discrimination, illegal content), healthcare AI disclosure, biometric compliance, and Attorney General enforcement with a 60-day cure period. This guide explains what the final statute actually says, what it does not say, and what small and midsize businesses should do about it.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Texas-based businesses', 'Out-of-state companies serving Texas', 'Healthcare practices using AI', 'Employers using AI hiring tools', 'SaaS companies selling AI in Texas', 'Any business using AI chatbots'].map((audience) => (
                <span key={audience} className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">{audience}</span>
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            For the full statutory compliance guide with section-by-section analysis, see the{' '}
            <Link href="/guides/texas-ai-law" className="text-primary font-medium hover:underline">Texas AI Law (TRAIGA / HB 149) Compliance Guide</Link>.
          </p>
        </div>
      </Section>

      {/* Direct Answer */}
      <Section className="pt-4" id="direct-answer">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">The Direct Answer</h2>
          <p>The Texas Responsible Artificial Intelligence Governance Act, commonly called <strong>TRAIGA</strong>, can apply to businesses of any size.</p>
          <p>The final law does not contain an express small-business exemption or minimum revenue threshold. Its scope includes persons conducting business in Texas, producing products or services used by Texas residents, or developing or deploying an AI system in Texas.</p>
          <p>That does <strong>not</strong> mean every small business using ChatGPT, an AI receptionist, or an automated marketing tool must register its AI, conduct an annual impact assessment, or disclose every chatbot.</p>
          <p>The final law is broad in potential reach but comparatively narrow in the commercial conduct it directly regulates.</p>
          <p>For most private businesses, TRAIGA focuses on:</p>
          <ul className="ml-4 space-y-1.5 text-muted-foreground">
            <li className="list-disc">Intentional encouragement of self-harm, harm to others, or crime</li>
            <li className="list-disc">Intentional unlawful discrimination</li>
            <li className="list-disc">AI intended to impair federal constitutional rights</li>
            <li className="list-disc">Certain illegal sexual, deepfake, and child-related content</li>
            <li className="list-disc">Healthcare AI disclosure</li>
            <li className="list-disc">Biometric-data compliance</li>
            <li className="list-disc">Documentation that may be requested during an Attorney General investigation</li>
          </ul>
          <blockquote className="border-l-4 border-l-primary pl-4 italic text-foreground">
            <p className="text-base">The practical rule: Do not ask only, &ldquo;Does my company use AI?&rdquo; Ask, &ldquo;What is the AI doing, whose data does it use, who may be affected, and which decisions or actions can it influence?&rdquo;</p>
          </blockquote>
        </div>
      </Section>

      {/* At a Glance */}
      <Section className="pt-4" id="at-a-glance">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Texas AI Law at a Glance</h2>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr><th className="text-left p-3 font-semibold w-1/2">Question</th><th className="text-left p-3 font-semibold">Plain-English answer</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ['What is the law called?', 'Texas Responsible Artificial Intelligence Governance Act, or TRAIGA'],
                  ['Which bill enacted it?', 'House Bill 149'],
                  ['When did it take effect?', 'January 1, 2026'],
                  ['Can it apply to small businesses?', 'Yes. The final text contains no express small-business exemption'],
                  ['Does every private chatbot require disclosure?', 'No, not under TRAIGA as a general rule'],
                  ['Is healthcare AI disclosure required?', 'Yes, when AI is used in relation to healthcare services or treatment'],
                  ['Are annual AI impact assessments generally required?', 'No'],
                  ['Does Texas classify private systems as \u201chigh-risk AI\u201d?', 'Not under the final TRAIGA framework'],
                  ['Can consumers sue directly under TRAIGA?', 'No. TRAIGA creates no private right of action'],
                  ['Who enforces it?', 'The Texas Attorney General, with limited additional sanctions by licensing agencies'],
                  ['Is there a cure period?', 'Generally, 60 days after written notice'],
                  ['Maximum stated penalty for an uncurable violation?', '$200,000 for each violation'],
                  ['Can continuing violations create daily penalties?', 'Yes, up to $40,000 per day'],
                ].map(([q, a]) => (
                  <tr key={q}><td className="p-3 font-medium text-foreground">{q}</td><td className="p-3 text-muted-foreground">{a}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground">The Texas Legislature lists January 1, 2026, as the effective date, and the Attorney General\u2019s current guidance identifies the prohibited practices, disclosure requirements, penalties, and complaint mechanism.</p>
        </div>
      </Section>

      {/* AI System Definition */}
      <Section className="pt-4" id="ai-system-definition">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">What Counts as an AI System Under Texas Law?</h2>
          <p>TRAIGA defines an AI system as a machine-based system that infers from its inputs how to generate outputs\u2014including content, decisions, predictions, or recommendations\u2014that can influence physical or virtual environments.</p>
          <p>That definition can include more than generative chatbots.</p>
          <h3 className="text-lg font-semibold mt-4">Likely examples</h3>
          <ul className="ml-4 space-y-1 text-muted-foreground">
            {['AI website chatbot', 'AI phone receptionist', 'Resume-ranking system', 'Predictive fraud model', 'Recommendation engine', 'Generative image or video tool', 'Clinical decision-support system', 'Customer-scoring model', 'Automated content generator', 'Facial or voice identification system', 'Agent that calls APIs or performs business actions', 'AI system that recommends prices, treatments, products, or decisions'].map((item) => (
              <li key={item} className="list-disc">{item}</li>
            ))}
          </ul>
          <h3 className="text-lg font-semibold mt-4">Systems that may not qualify</h3>
          <p>Ordinary deterministic software may fall outside the definition when it follows fixed rules without inferring how to generate decisions, predictions, recommendations, or content.</p>
          <ul className="ml-4 space-y-1 text-muted-foreground">
            {['Basic calculator', 'Static decision tree', 'Traditional form validation', 'Fixed \u201cif\u2013then\u201d workflow', 'Standard database lookup', 'Non-adaptive scheduling rules'].map((item) => (
              <li key={item} className="list-disc">{item}</li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground">The distinction is not whether a vendor markets a product as &ldquo;AI.&rdquo; The question is how the system actually produces its outputs.</p>
        </div>
      </Section>

      {/* Out-of-State */}
      <Section className="pt-4" id="out-of-state">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Does TRAIGA Apply to Out-of-State Businesses?</h2>
          <p>Potentially.</p>
          <p>The statute is not limited to companies incorporated or headquartered in Texas. It reaches a person who:</p>
          <ol className="ml-4 space-y-1.5 text-muted-foreground">
            <li className="list-decimal">Promotes, advertises, or conducts business in Texas;</li>
            <li className="list-decimal">Produces a product or service used by Texas residents; or</li>
            <li className="list-decimal">Develops or deploys an AI system in Texas.</li>
          </ol>
          <p>An out-of-state SaaS company selling an AI product to Texas customers may therefore fall within the statutory scope.</p>
          <p>The next question is whether a particular TRAIGA duty or prohibition is triggered.</p>
          <blockquote className="border-l-4 border-l-primary pl-4 italic text-foreground">
            <p className="text-base">Being within the law\u2019s scope does not mean every provision applies to every system.</p>
          </blockquote>
        </div>
      </Section>

      {/* Applicability Checker */}
      <Section className="pt-4" id="applicability-checker">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Quick TRAIGA Applicability Checker</h2>
          <p>This checker provides a preliminary classification. It is designed to identify issues requiring further review, not to provide a legal conclusion.</p>
        </div>
        <div className="max-w-4xl mx-auto mt-4">
          <TRAIGAApplicabilityChecker />
        </div>
      </Section>

      {/* What to Watch */}
      <Section className="pt-4" id="what-to-watch">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">What Private Businesses Actually Need to Watch</h2>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <CardTitle className="text-base">1. AI designed to encourage harm or criminal activity</CardTitle>
                  <CardDescription className="text-sm mt-2 leading-relaxed">
                    A person may not develop or deploy an AI system in a manner that intentionally aims to encourage physical self-harm (including suicide), harm to another person, or criminal activity.
                  </CardDescription>
                </div>
              </div>
              <div className="mt-3 ml-12 space-y-2 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Example</p>
                <p>A general customer-support assistant is not prohibited merely because a user asks a harmful question. The concern is whether the system is intentionally designed or deployed to encourage that conduct.</p>
                <p className="font-medium text-foreground mt-2">Practical control: test whether the system gives actionable self-harm instructions, encourages violence, assists criminal planning, escalates vulnerable users toward harmful conduct, or uses manipulative engagement to prolong harmful conversations.</p>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <CardTitle className="text-base">2. Intentional unlawful discrimination</CardTitle>
                  <CardDescription className="text-sm mt-2 leading-relaxed">
                    TRAIGA prohibits developing or deploying an AI system with the intent to unlawfully discriminate against a protected class. The statute states that disparate impact, by itself, is not sufficient to prove discriminatory intent.
                  </CardDescription>
                </div>
              </div>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Example</p>
                <p>A staffing business deliberately configures a resume-ranking tool to reject applicants over a particular age. That presents a much clearer TRAIGA issue than an unintentional statistical disparity discovered during testing.</p>
                <p className="font-medium text-foreground mt-2">Important distinction: The TRAIGA intent standard does not eliminate obligations under other employment, lending, housing, healthcare, or civil-rights laws. Those laws may use different liability standards.</p>
                <p className="mt-2">Practical controls: test decision outcomes by relevant groups, document the intended decision logic, remove protected attributes and close proxies, maintain human review for consequential decisions, investigate unexplained disparities, and record corrections and approvals.</p>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <Scale className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <CardTitle className="text-base">3. Constitutional-rights interference</CardTitle>
                  <CardDescription className="text-sm mt-2 leading-relaxed">
                    A person may not develop or deploy an AI system with the sole intent that the system infringe, restrict, or otherwise impair rights guaranteed under the United States Constitution. The use of &ldquo;sole intent&rdquo; makes this a narrow provision.
                  </CardDescription>
                </div>
              </div>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Example</p>
                <p>A social-media content-moderation AI that is solely designed to suppress lawful political speech would be closer to this prohibition than a general-purpose AI that occasionally flags content under a vendor&rsquo;s standard policy.</p>
                <p className="font-medium text-foreground mt-2">Practical control: document the system&rsquo;s intended purpose, review moderation rules for viewpoint neutrality, maintain human appeal channels, and avoid configurations whose sole function is to restrict protected expression.</p>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <CardTitle className="text-base">4. Illegal sexual, deepfake, and child-related content</CardTitle>
                  <CardDescription className="text-sm mt-2 leading-relaxed">
                    The law prohibits intentionally developing or distributing AI systems for specified illegal sexual material, unlawful deepfakes, child pornography, or explicit text conversations that impersonate or imitate a child. Particularly relevant to image generators, video-generation platforms, companion chatbots, role-playing systems, and platforms serving minors.
                  </CardDescription>
                </div>
              </div>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Example</p>
                <p>A companion-chatbot platform that allows users to generate explicit content impersonating minors would fall squarely within this prohibition. A general-purpose image generator with safety filters and age-gating is not the same as a system intentionally designed for that purpose.</p>
                <p className="font-medium text-foreground mt-2">Practical controls: implement content filters, age verification, minor-safety guardrails, impersonation protections, reporting mechanisms, and human review of flagged outputs.</p>
              </div>
            </CardHeader>
          </Card>
        </div>
      </Section>

      {/* Chatbot Disclosure */}
      <Section className="pt-4" id="chatbot-disclosure">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Does Every Private AI Chatbot Require Disclosure?</h2>
          <p className="text-lg text-muted-foreground">No\u2014not under TRAIGA as a general rule.</p>
          <p>The general consumer-interaction disclosure in Section 552.051 applies to a governmental agency that makes an AI system available to interact with consumers. A separate provision applies when AI is used in relation to healthcare services or treatment.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-l-4 border-l-primary/40">
              <CardHeader>
                <CardTitle className="text-sm">HVAC company with an AI receptionist</CardTitle>
                <CardDescription className="text-sm mt-1">TRAIGA does not impose a general disclosure requirement solely because a private HVAC company uses an AI receptionist. The company may still choose to disclose for transparency, customer expectations, recording consent, or other legal reasons.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-primary/40">
              <CardHeader>
                <CardTitle className="text-sm">Retail website chatbot</CardTitle>
                <CardDescription className="text-sm mt-1">No universal private-business TRAIGA disclosure requirement applies merely because the website uses AI chat.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-amber-500">
              <CardHeader>
                <CardTitle className="text-sm">City-government chatbot</CardTitle>
                <CardDescription className="text-sm mt-1">The government disclosure requirement applies. The notice must be clear, conspicuous, written in plain language, and not use a dark pattern.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-amber-500">
              <CardHeader>
                <CardTitle className="text-sm">Medical-practice assistant</CardTitle>
                <CardDescription className="text-sm mt-1">If the AI is used in relation to healthcare services or treatment, the healthcare disclosure provision may apply.</CardDescription>
              </CardHeader>
            </Card>
          </div>
          <blockquote className="border-l-4 border-l-primary pl-4 italic text-foreground">
            <p className="text-base">Do not copy a blanket statement saying &ldquo;Texas requires every chatbot to identify itself.&rdquo; The final law does not say that.</p>
          </blockquote>
        </div>
      </Section>

      {/* Healthcare AI */}
      <Section className="pt-4" id="healthcare-ai">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Healthcare AI Requirements</h2>
          <p>Healthcare requires separate analysis because TRAIGA overlaps with another Texas law enacted in 2025.</p>
          <h3 className="text-lg font-semibold mt-4">TRAIGA healthcare disclosure</h3>
          <p>When an AI system is used in relation to a healthcare service or treatment, the provider must disclose the use to the recipient or the recipient\u2019s representative no later than the date the service or treatment is first provided. In an emergency, disclosure must be made as soon as reasonably possible.</p>
          <h3 className="text-lg font-semibold mt-4">Texas SB 1188 diagnostic-AI requirements</h3>
          <p>A separate law, SB 1188, permits a healthcare practitioner to use AI for diagnostic purposes\u2014including recommendations concerning diagnosis or treatment based on a patient\u2019s medical record\u2014when the practitioner acts within scope, the use is not otherwise prohibited, and the practitioner reviews AI-created records consistently with Texas Medical Board standards. The practitioner must also disclose diagnostic AI use to patients.</p>
          <h3 className="text-lg font-semibold mt-4">Healthcare scenarios</h3>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr><th className="text-left p-3 font-semibold">Use case</th><th className="text-left p-3 font-semibold">Practical interpretation</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ['AI only schedules appointments', 'TRAIGA\u2019s healthcare-treatment wording may require fact-specific review; ordinary scheduling is less clearly a treatment use'],
                  ['AI answers general office-hours questions', 'Likely closer to administrative support than clinical decision support'],
                  ['AI drafts a clinical note', 'Review, medical-record accuracy, PHI security, and disclosure questions arise'],
                  ['AI recommends a diagnosis', 'SB 1188 directly addresses diagnostic AI and patient disclosure'],
                  ['AI recommends treatment', 'Practitioner scope, review, disclosure, and medical-record controls apply'],
                  ['AI summarizes a patient record', 'PHI, accuracy, access, vendor, and human-review controls are critical'],
                  ['AI triages emergency symptoms', 'High safety impact; disclosure, escalation, clinical oversight, and other healthcare law require review'],
                ].map(([uc, interp]) => (
                  <tr key={uc}><td className="p-3 font-medium text-foreground">{uc}</td><td className="p-3 text-muted-foreground">{interp}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground">Healthcare organizations must also evaluate HIPAA, Texas medical-privacy laws, medical-record rules, professional licensing standards, contracts, and security requirements. TRAIGA compliance alone does not establish healthcare compliance.</p>
        </div>
      </Section>

      {/* Biometrics */}
      <Section className="pt-4" id="biometrics">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Biometrics and AI</h2>
          <p>Texas already regulated commercial biometric identifiers through Business &amp; Commerce Code Section 503.001. HB 149 amended that law and connected violations of Section 503.001 to TRAIGA\u2019s biometric provision.</p>
          <h3 className="text-lg font-semibold mt-4">Biometric identifiers include</h3>
          <ul className="ml-4 space-y-1 text-muted-foreground">
            {['Retina or iris scans', 'Fingerprints', 'Voiceprints', 'Records of hand or face geometry'].map((item) => (
              <li key={item} className="list-disc">{item}</li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground">The mere existence of an image or other media on the internet does not automatically establish notice and consent for commercial biometric capture unless the individual made the material publicly available.</p>
          <h3 className="text-lg font-semibold mt-4">AI-training treatment</h3>
          <p>The amended biometric statute contains an exclusion for training, processing, or storing biometric identifiers to develop, train, evaluate, disseminate, or offer AI models or systems\u2014unless the system is used to uniquely identify a specific individual. If an identifier collected for AI training is later used for another commercial purpose, the law\u2019s possession, destruction, and penalty provisions may apply.</p>
          <h3 className="text-lg font-semibold mt-4">Small-business scenarios</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { title: 'Gym using facial recognition for entry', desc: 'Review consent, purpose, storage, sharing, retention, destruction, and vendor access.' },
              { title: 'Call center using voiceprints for identity verification', desc: 'A voiceprint can be a biometric identifier. Ordinary call audio is not automatically the same as a voiceprint used to identify a person.' },
              { title: 'Retailer analyzing security-camera images', desc: 'Determine whether the system is performing ordinary object detection or uniquely identifying individuals through face geometry.' },
              { title: 'Employer using fingerprint time clocks', desc: 'TRAIGA may overlap with the existing Texas biometric statute even when the primary system is not generative AI.' },
            ].map((scenario) => (
              <Card key={scenario.title} className="border-l-4 border-l-primary/40">
                <CardHeader>
                  <CardTitle className="text-sm">{scenario.title}</CardTitle>
                  <CardDescription className="text-sm mt-1">{scenario.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Hiring and Employee AI */}
      <Section className="pt-4" id="hiring-ai">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Hiring and Employee AI</h2>
          <p>The TRAIGA definition of &ldquo;consumer&rdquo; excludes an individual acting in an employment or commercial context. That does not mean employment AI is automatically outside the entire law.</p>
          <p>The unlawful-discrimination prohibition applies broadly to a person developing or deploying AI with discriminatory intent.</p>
          <p className="font-medium">A Texas employer uses AI to:</p>
          <ul className="ml-4 space-y-1 text-muted-foreground">
            {['Rank resumes', 'Score interviews', 'Analyze employee behavior', 'Recommend promotion', 'Identify workers for termination'].map((item) => (
              <li key={item} className="list-disc">{item}</li>
            ))}
          </ul>
          <p>TRAIGA does not impose a general Texas applicant-notice, annual bias-audit, or impact-assessment requirement on these systems. However:</p>
          <ul className="ml-4 space-y-1 text-muted-foreground">
            {['Intentional unlawful discrimination is prohibited.', 'Federal and Texas employment laws remain relevant.', 'Biometric rules may apply to voice, facial, or fingerprint analysis.', 'Employee monitoring can create privacy and labor concerns.', 'Vendor documentation and human review remain prudent.'].map((item) => (
              <li key={item} className="list-disc">{item}</li>
            ))}
          </ul>
          <blockquote className="border-l-4 border-l-primary pl-4 italic text-foreground">
            <p className="text-base">TRAIGA is not the complete employment-AI rulebook.</p>
          </blockquote>
        </div>
      </Section>

      {/* Final Law vs Draft */}
      <Section className="pt-4" id="final-vs-draft">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">The Final Law Versus Earlier Drafts</h2>
          <p>Texas AI commentary is unusually confusing because at least three different documents are often treated as though they were the same law.</p>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-l-4 border-l-muted-foreground/40">
              <CardHeader>
                <CardTitle className="text-sm">Stage 1: Circulated pre-filing policy draft</CardTitle>
                <CardDescription className="text-sm mt-1">A widely circulated 2024 policy draft contained a much broader framework with high-risk AI systems, impact assessments, human oversight, and broader developer and deployer duties. That document was a policy draft\u2014not the law now in force.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-primary/40">
              <CardHeader>
                <CardTitle className="text-sm">Stage 2: Official introduced HB 149</CardTitle>
                <CardDescription className="text-sm mt-1">The official introduced bill moved away from risk-classification. It did not use &ldquo;high-risk,&rdquo; &ldquo;impact assessment,&rdquo; or &ldquo;small business.&rdquo; It contained consumer appeal rights, political-viewpoint restrictions, and a deceptive-trade-practices provision that were later removed.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="text-sm">Stage 3: Final enacted law</CardTitle>
                <CardDescription className="text-sm mt-1">The enrolled law narrowed the framework around targeted intent-based prohibitions, government and healthcare disclosure, biometric amendments, AG enforcement, a 60-day cure process, a regulatory sandbox, a Texas AI Council, and conditional non-liability provisions.</CardDescription>
              </CardHeader>
            </Card>
          </div>
          <h3 className="text-lg font-semibold mt-4">Final-law comparison matrix</h3>
          <div className="rounded-lg border border-border overflow-hidden overflow-x-auto">
            <table className="w-full text-xs md:text-sm min-w-[700px]">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-semibold">Issue</th>
                  <th className="text-left p-3 font-semibold">Circulated pre-filing proposal</th>
                  <th className="text-left p-3 font-semibold">Official introduced HB 149</th>
                  <th className="text-left p-3 font-semibold">Final enacted TRAIGA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ['High-risk AI classification', 'Included', 'Not included', 'Not included'],
                  ['General impact assessments', 'Included', 'Not included', 'Not included'],
                  ['Express small-business exemption', 'Discussed', 'Not included', 'Not included'],
                  ['General private chatbot notice', 'Broad summaries created confusion', 'Government disclosure; healthcare less developed', 'Government disclosure plus healthcare-service/treatment disclosure'],
                  ['Consumer appeal and explanation right', 'Part of broader discussions', 'Included for certain adverse AI decisions', 'Removed'],
                  ['Political-viewpoint discrimination', 'Present in early approaches', 'Included', 'Removed; replaced by narrower federal constitutional-rights provision'],
                  ['Deceptive-practices manipulation', 'Included in broader proposal', 'Included', 'Removed as standalone TRAIGA provision'],
                  ['Unlawful discrimination', 'Broader governance framework', 'Intent-based; disparate impact alone insufficient', 'Intent-based prohibition retained'],
                  ['Cure period', 'Earlier summaries described 30 days', '60 days', '60 days'],
                  ['AI risk-framework defense', 'Broader compliance language', 'NIST, ISO 42001, or recognized framework tied to discovery and cure', 'Revised non-liability language referencing feedback, testing, guidance, or internal review with substantial NIST or other framework compliance'],
                  ['Consumer private lawsuit', 'Proposed materials varied', 'No broad private enforcement mechanism', 'Expressly no private right of action'],
                ].map(([issue, draft, introduced, final]) => (
                  <tr key={issue}>
                    <td className="p-3 font-medium text-foreground">{issue}</td>
                    <td className="p-3 text-muted-foreground">{draft}</td>
                    <td className="p-3 text-muted-foreground">{introduced}</td>
                    <td className="p-3 text-foreground font-medium">{final}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <blockquote className="border-l-4 border-l-red-500 pl-4 italic text-foreground">
            <p className="text-base">Do not use an article about the 2024 pre-filing proposal as evidence of what Texas businesses must do under the 2026 law.</p>
          </blockquote>
        </div>
      </Section>

      {/* AG Documentation */}
      <Section className="pt-4" id="ag-documentation">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">What Documentation Can the Attorney General Request?</h2>
          <p>TRAIGA does not require every company to file an annual AI impact assessment. However, after receiving a complaint, the Attorney General may issue a civil investigative demand and request extensive system documentation.</p>
          <p>The requested information can include:</p>
          <ol className="ml-4 space-y-1 text-muted-foreground">
            {['A high-level description of the system\u2019s purpose', 'Intended uses', 'Deployment context', 'Associated benefits', 'Types of data used to program or train the system', 'Categories of input data', 'Categories of outputs', 'Performance metrics', 'Known limitations', 'Post-deployment monitoring', 'User safeguards', 'For deployers, oversight, use, and learning processes', 'Other relevant documents reasonably necessary for the investigation'].map((item, i) => (
              <li key={i} className="list-decimal">{item}</li>
            ))}
          </ol>
          <p className="text-sm text-muted-foreground">TRAIGA may not mandate a formal impact assessment for every business, but it authorizes the Attorney General to request much of the information that a responsible AI assessment would normally contain. A business should therefore maintain a concise <strong>AI System Record</strong>.</p>
          <h3 className="text-lg font-semibold mt-4">Minimum AI System Record</h3>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr><th className="text-left p-3 font-semibold">Field</th><th className="text-left p-3 font-semibold">What to document</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ['System name', 'Product and internal name'],
                  ['Business owner', 'Person accountable for the use case'],
                  ['Technical owner', 'Person responsible for implementation'],
                  ['Role', 'Developer, deployer, or both'],
                  ['Purpose', 'Business problem the AI addresses'],
                  ['Users', 'Employees, consumers, patients, customers, or public'],
                  ['Decisions influenced', 'Recommendations, approvals, rankings, actions'],
                  ['Data used', 'Input, training, customer, personal, biometric, or health data'],
                  ['Outputs', 'Content, scores, decisions, predictions, or actions'],
                  ['Vendor/model', 'Provider, model, version, and hosting'],
                  ['Known limitations', 'Accuracy, bias, hallucination, latency, or coverage'],
                  ['Human oversight', 'Reviewer, approval point, and escalation'],
                  ['Testing', 'Safety, discrimination, security, and performance tests'],
                  ['Monitoring', 'Incidents, complaints, drift, failures, and user feedback'],
                  ['Safeguards', 'Access, filters, moderation, logging, and tool restrictions'],
                  ['Disclosures', 'Whether notice is required or voluntarily provided'],
                  ['Retention', 'How long prompts, outputs, and evidence are retained'],
                  ['Incident owner', 'Who handles complaints and suspected violations'],
                ].map(([field, what]) => (
                  <tr key={field}><td className="p-3 font-medium text-foreground">{field}</td><td className="p-3 text-muted-foreground">{what}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground">This is the strongest practical foundation for a Texas small-business AI compliance program.</p>
        </div>
      </Section>

      {/* Enforcement */}
      <Section className="pt-4" id="enforcement">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Enforcement, Cure Period, and Penalties</h2>
          <p>The Texas Attorney General has exclusive authority to enforce TRAIGA, except for limited additional licensing-agency sanctions after the required findings and recommendation. TRAIGA expressly states that it does not create a private right of action.</p>
          <h3 className="text-lg font-semibold mt-4">Enforcement process</h3>
          <div className="max-w-4xl mx-auto">
            <h4 className="text-center text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">TRAIGA Enforcement Flow</h4>
            <DiagramReveal>
              <TRAIGAEnforcementFlow />
            </DiagramReveal>
            <p className="text-center text-xs text-muted-foreground mt-2">Figure 1 \u2014 The AG must generally give written notice and wait 60 days before bringing an enforcement action.</p>
          </div>
          <p>Before bringing an action, the Attorney General generally must give written notice identifying the alleged violation and wait 60 days. An action may be avoided when the business cures the violation within the period, provides a written statement confirming the cure, supplies supporting documentation, and makes necessary policy changes reasonably designed to prevent recurrence.</p>
          <h3 className="text-lg font-semibold mt-4">Civil penalties</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-l-4 border-l-amber-500">
              <CardHeader>
                <CardTitle className="text-sm">Curable violation or breach of cure statement</CardTitle>
                <CardDescription className="text-sm mt-1 font-semibold text-foreground">$10,000\u2013$12,000 per violation</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-red-500">
              <CardHeader>
                <CardTitle className="text-sm">Uncurable violation</CardTitle>
                <CardDescription className="text-sm mt-1 font-semibold text-foreground">$80,000\u2013$200,000 per violation</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader>
                <CardTitle className="text-sm">Continuing violation</CardTitle>
                <CardDescription className="text-sm mt-1 font-semibold text-foreground">$2,000\u2013$40,000 for each day it continues</CardDescription>
              </CardHeader>
            </Card>
          </div>
          <p className="text-sm text-muted-foreground">The Attorney General may also seek injunctive relief, attorney\u2019s fees, court costs, and investigative expenses. Certain licensed or regulated persons may also face agency sanctions\u2014including license suspension or revocation and monetary penalties of up to $100,000\u2014after a TRAIGA violation is found and the Attorney General recommends additional enforcement.</p>
        </div>
      </Section>

      {/* NIST Safe Harbor */}
      <Section className="pt-4" id="nist-safe-harbor">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Is NIST Compliance a TRAIGA Safe Harbor?</h2>
          <p>Calling it a blanket safe harbor is too broad.</p>
          <p>The final law provides circumstances in which a defendant may not be found liable, including when another person misuses the affiliated AI system or when the defendant discovers a violation through feedback, adversarial or red-team testing, state-agency guidance, or an internal review process while substantially complying with the NIST Generative AI Profile or another nationally or internationally recognized AI risk-management framework.</p>
          <p>The provision is not written as automatic immunity for every company that says it follows NIST.</p>
          <blockquote className="border-l-4 border-l-primary pl-4 italic text-foreground">
            <p className="text-base">Substantial alignment with a recognized AI risk framework, combined with effective testing, feedback, review, and remediation processes, can strengthen a TRAIGA defense. It does not replace compliance with the statute.</p>
          </blockquote>
          <p>NIST\u2019s AI Risk Management Framework organizes AI risk activities through four functions: <strong>Govern</strong>, <strong>Map</strong>, <strong>Measure</strong>, and <strong>Manage</strong>. Its Generative AI Profile adapts those activities to risks associated with generative systems.</p>
          <div className="max-w-4xl mx-auto">
            <h4 className="text-center text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">NIST-Lite Framework for Small Businesses</h4>
            <DiagramReveal>
              <NISTLiteFramework />
            </DiagramReveal>
            <p className="text-center text-xs text-muted-foreground mt-2">Figure 2 \u2014 A practical four-function approach adapted for small organizations.</p>
          </div>
          <p className="text-sm text-muted-foreground">A small company does not need to imitate a Fortune 100 governance office. It does need to demonstrate deliberate ownership and reasonable controls.</p>
        </div>
      </Section>

      {/* Business Scenarios */}
      <Section className="pt-4" id="business-scenarios">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Practical Business Scenarios</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { icon: 'Building2', title: 'AI receptionist for a local service company', position: 'The company may be a deployer. No general private-chatbot disclosure requirement exists under TRAIGA. The system must not intentionally encourage harm, crime, or unlawful discrimination.', controls: ['Identify the business clearly', 'Consider voluntarily identifying the system as AI', 'Restrict emergency, legal, financial, or medical advice', 'Define escalation to a human', 'Control appointment, payment, and transfer tools', 'Retain call and action evidence appropriately'] },
              { icon: 'HeartPulse', title: 'Medical or dental office using AI', position: 'Healthcare disclosure may apply when AI is used in relation to healthcare service or treatment. Diagnostic AI can trigger additional requirements under SB 1188. Medical-record and privacy rules also apply.', controls: ['Patient disclosure', 'Practitioner review', 'PHI and vendor controls', 'Role-based access', 'Output verification', 'Clinical escalation', 'Audit evidence'] },
              { icon: 'Users', title: 'Staffing company using resume-ranking AI', position: 'The employment context is excluded from the definition of \u201cconsumer.\u201d The intent-based unlawful-discrimination prohibition can still apply. TRAIGA does not impose a general bias audit or applicant notice.', controls: ['Human review', 'Outcome testing', 'Documented job criteria', 'Proxy-variable review', 'Vendor transparency', 'Existing employment-law analysis'] },
              { icon: 'Fingerprint', title: 'Retailer using facial recognition', position: 'Texas biometric law and TRAIGA\u2019s biometric provision may apply. Public images alone do not necessarily establish consent. Unique identification creates greater risk than ordinary image analysis.', controls: ['Written consent analysis', 'Narrow purpose', 'Retention and destruction schedule', 'Vendor restrictions', 'Access controls', 'Alternative process for customers who decline'] },
              { icon: 'Zap', title: 'SaaS company selling an AI assistant', position: 'The company may be a developer if the system is provided in Texas. Customers may separately be deployers. There is no universal registration or impact-assessment requirement.', controls: ['System documentation', 'Clear intended-use boundaries', 'Customer configuration guidance', 'Prohibited-use controls', 'Safety testing', 'Monitoring', 'Contract allocation of responsibilities'] },
              { icon: 'FileText', title: 'Marketing agency using generative AI', position: 'Ordinary drafting and content generation do not automatically create a special TRAIGA filing or disclosure obligation. Risk increases when the agency generates deceptive impersonations, illegal sexual deepfakes, discriminatory targeting, harmful or criminal instructions, or unauthorized biometric identification.', controls: ['Human review', 'Rights and consent checks', 'Deepfake and impersonation policy', 'Approved data use', 'Client disclosure where contractually required', 'Records of high-risk campaigns'] },
            ].map((scenario) => {
              const Icon = { Building2, HeartPulse, Users, Fingerprint, Zap, FileText }[scenario.icon] ?? Building2
              return (
                <Card key={scenario.title} className="border-l-4 border-l-primary/40">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-sm">{scenario.title}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-2 leading-relaxed"><strong className="text-foreground">Likely TRAIGA position:</strong> {scenario.position}</p>
                        <div className="mt-2">
                          <p className="text-xs font-medium text-foreground mb-1">Recommended controls:</p>
                          <ul className="text-xs text-muted-foreground space-y-0.5 ml-3">
                            {scenario.controls.map((c) => (
                              <li key={c} className="list-disc">{c}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </Section>

      {/* 10-Step Readiness Plan */}
      <Section className="pt-4" id="readiness-plan">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Ten-Step TRAIGA Readiness Plan for Small Businesses</h2>
          <p className="text-sm text-muted-foreground">
            A structured version of this process can be delivered through the{' '}
            <Link href="/solutions/haiec" className="text-primary font-medium hover:underline">HAIEC Texas AI Readiness Assessment</Link>
            , including applicability analysis, system inventory, disclosure review, prohibited-use testing, evidence gaps, and a cure-response package.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { num: 1, title: 'Inventory the AI', items: ['Public AI tools', 'Employee AI tools', 'Embedded vendor AI', 'Automated decision systems', 'AI voice and chat', 'Biometric systems', 'Agents and tool-calling workflows'] },
              { num: 2, title: 'Assign an owner', items: ['Business owner', 'Technical owner', 'Vendor owner', 'Incident contact'] },
              { num: 3, title: 'Determine your role', items: ['Developer', 'Deployer', 'Both', 'Customer of a third-party system'] },
              { num: 4, title: 'Classify the use case', items: ['Healthcare', 'Employment', 'Biometrics', 'Children', 'Protected classes', 'Public services', 'Financial or insurance decisions', 'Safety', 'Constitutional rights'] },
              { num: 5, title: 'Map the data', items: ['Inputs', 'Outputs', 'Personal information', 'Health information', 'Biometric information', 'Sensitive business data', 'Retention and sharing'] },
              { num: 6, title: 'Review disclosures', items: ['Required by TRAIGA', 'Required by another law', 'Required by contract', 'Recommended for trust', 'Not relevant'] },
              { num: 7, title: 'Test prohibited behavior', items: ['Self-harm and violence', 'Criminal assistance', 'Discrimination', 'Deepfake and sexual content', 'Child-safety failures', 'Constitutional-rights concerns', 'Unauthorized tool actions'] },
              { num: 8, title: 'Document limitations and oversight', items: ['Known failure modes', 'Human review', 'Escalation', 'Approval points', 'Monitoring', 'Corrective action'] },
              { num: 9, title: 'Prepare for complaints', items: ['Complaint intake', 'Investigation owner', 'Evidence-preservation procedure', 'Vendor-notification process', 'Remediation workflow', 'Executive escalation'] },
              { num: 10, title: 'Prepare a 60-day cure-response package', items: ['Alleged issue', 'Root cause', 'Affected users', 'Immediate containment', 'Corrective action', 'Supporting test evidence', 'Policy changes', 'Recurrence-prevention controls', 'Responsible owner and due date'] },
            ].map((step) => (
              <Card key={step.num} className="border-l-4 border-l-primary/40">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">{step.num}</div>
                    <CardTitle className="text-sm">{step.title}</CardTitle>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-0.5 ml-3">
                    {step.items.map((item) => (
                      <li key={item} className="list-disc">{item}</li>
                    ))}
                  </ul>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Related Guides */}
      <Section className="pt-4" id="related-guides">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Related AI Compliance Guides</h2>
          <Grid cols={2} gap="md">
            <Link href="/guides/texas-ai-law" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Scale className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">Full TRAIGA Compliance Guide</CardTitle>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">
                    Section-by-section analysis of the Texas AI law, including developer and deployer duties, regulatory sandbox, Texas AI Council, and defense pathways.
                  </CardDescription>
                  <span className="text-sm text-primary inline-flex items-center gap-1 mt-2">
                    Read guide <ArrowRight className="h-3 w-3" />
                  </span>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/guides/eu-ai-act" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">EU AI Act Guide</CardTitle>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">
                    Risk-tiered regulation for all AI placed on the EU market. Effective August 2026. Penalties up to &euro;35M or 7% of global revenue.
                  </CardDescription>
                  <span className="text-sm text-primary inline-flex items-center gap-1 mt-2">
                    Read guide <ArrowRight className="h-3 w-3" />
                  </span>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/guides/nyc-local-law-144" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">NYC Local Law 144 Guide</CardTitle>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">
                    Bias audit requirements for automated employment decision tools. Active enforcement since July 2023. $500&ndash;$1,500/day per violation.
                  </CardDescription>
                  <span className="text-sm text-primary inline-flex items-center gap-1 mt-2">
                    Read guide <ArrowRight className="h-3 w-3" />
                  </span>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/solutions/haiec" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">HAIEC AI Compliance Platform</CardTitle>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">
                    Automate AI system inventory, disclosure review, prohibited-use testing, evidence gaps, and cure-response package preparation.
                  </CardDescription>
                  <span className="text-sm text-primary inline-flex items-center gap-1 mt-2">
                    Explore platform <ArrowRight className="h-3 w-3" />
                  </span>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/how-to-secure-and-govern-ai" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">Why AI Voice Agents Fail in Production</CardTitle>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">
                    Ten failure modes, production architecture, AI voice control ladder, TCPA and TRAIGA compliance for voice, and a six-phase deployment plan. Includes an interactive readiness checker.
                  </CardDescription>
                  <span className="text-sm text-primary inline-flex items-center gap-1 mt-2">
                    Read article <ArrowRight className="h-3 w-3" />
                  </span>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/how-to-secure-and-govern-ai" className="block">
              <Card className="hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">How to Secure and Govern AI</CardTitle>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">
                    Seven layers of AI compliance — NIST AI RMF, ISO/IEC 42001, SOC 2, OWASP GenAI, and continuous evidence. Includes interactive framework decision tool.
                  </CardDescription>
                  <span className="text-sm text-primary inline-flex items-center gap-1 mt-2">
                    Read guide <ArrowRight className="h-3 w-3" />
                  </span>
                </CardHeader>
              </Card>
            </Link>
          </Grid>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="pt-4" id="faq">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
          {faqs.map((item, i) => (
            <Card key={i} className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="text-base mb-2">{item.q}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">{item.a}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Section>

      {/* Source Hierarchy */}
      <Section className="pt-4" id="source-hierarchy">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Official Source Hierarchy</h2>
          <p>For future updates, use this order:</p>
          <div className="grid gap-2 md:grid-cols-2">
            {[
              { num: 1, title: 'Current Texas Business & Commerce Code', desc: 'The enacted statutory text' },
              { num: 2, title: 'Enrolled HB 149 text', desc: 'The bill as passed by the legislature' },
              { num: 3, title: 'Texas Attorney General TRAIGA guidance', desc: 'AG enforcement guidance and complaint procedures' },
              { num: 4, title: 'Texas Department of Information Resources guidance', desc: 'Sandbox and implementation guidance' },
              { num: 5, title: 'Enrolled related statutes, including SB 1188', desc: 'Healthcare diagnostic AI and other related laws' },
              { num: 6, title: 'NIST AI Risk Management Framework', desc: 'Voluntary framework for AI risk management' },
              { num: 7, title: 'Secondary legal commentary', desc: 'Analysis and interpretation by qualified practitioners' },
            ].map((src) => (
              <Card key={src.num} className="border-l-4 border-l-primary/40">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">{src.num}</span>
                    <div>
                      <CardTitle className="text-sm">{src.title}</CardTitle>
                      <CardDescription className="text-xs mt-0.5">{src.desc}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">Do not rely on an article about a pre-filing proposal without checking whether the discussed provision survived into the final law.</p>
        </div>
      </Section>

      {/* Final Takeaway */}
      <Section className="pt-4" id="final-takeaway">
        <div className="max-w-4xl mx-auto space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Final Takeaway</h2>
          <p>Texas did not enact a Colorado-style comprehensive high-risk AI governance regime. It enacted a more targeted law.</p>
          <p>TRAIGA can reach small and midsize businesses, but it does not require every company using AI to register, complete an annual impact assessment, or identify every private chatbot.</p>
          <p>The real compliance work is more practical:</p>
          <ul className="ml-4 space-y-1.5 text-muted-foreground">
            {['Know which AI systems you use.', 'Understand what they do.', 'Identify sensitive and regulated use cases.', 'Prevent prohibited conduct.', 'Disclose healthcare AI where required.', 'Control biometric information.', 'Test consequential systems.', 'Maintain enough evidence to respond to a complaint.', 'Correct problems quickly.'].map((item) => (
              <li key={item} className="list-disc">{item}</li>
            ))}
          </ul>
          <p>The best first step is not a 100-page policy. It is an accurate AI inventory and a clear answer to five questions:</p>
          <ol className="ml-4 space-y-1.5 text-muted-foreground">
            <li className="list-decimal">What is the system intended to do?</li>
            <li className="list-decimal">What data does it use?</li>
            <li className="list-decimal">Who can be affected?</li>
            <li className="list-decimal">What decisions or actions can it influence?</li>
            <li className="list-decimal">What evidence proves it is being used responsibly?</li>
          </ol>
          <p className="text-lg text-muted-foreground">That is the foundation of TRAIGA readiness\u2014and responsible AI governance more broadly.</p>
        </div>
      </Section>

      {/* Lead Magnet */}
      <Section className="pt-4">
        <div className="max-w-4xl mx-auto">
          <LeadMagnetCard
            title="AI Governance & Compliance Framework Guide"
            description="Get a structured framework for AI governance, risk management, and compliance \u2014 aligned with NIST AI RMF, EU AI Act, and TRAIGA. Includes templates for AI system records, disclosure reviews, and cure-response packages."
            resourceName="AI Governance & Compliance Framework Guide"
          />
        </div>
      </Section>

      {/* CTA */}
      <CTA
        title="Prepare for TRAIGA Compliance"
        description="Get a TRAIGA applicability assessment or compliance roadmap from Subodh KC \u2014 co-founder of the HAIEC TRAIGA compliance engine. Based in Dallas, Texas."
        primaryButton={{ text: 'Contact Subodh KC', href: '/contact' }}
        secondaryButton={{ text: 'Explore HAIEC Platform', href: '/solutions/haiec' }}
      />

      {/* Disclaimer */}
      <div className="page-padding pb-8">
        <div className="section-container max-w-3xl">
          <p className="text-xs text-muted-foreground">
            This guide is for informational purposes and does not constitute legal advice. Applicability can depend on facts, contracts, industry rules, and other federal or state laws. For jurisdiction-specific compliance guidance, contact Subodh KC for advisory services. Last legally reviewed: July 15, 2026. Law reviewed: Texas Business &amp; Commerce Code Chapters 551\u2013554, enacted through HB 149.
          </p>
        </div>
      </div>
    </>
  )
}
