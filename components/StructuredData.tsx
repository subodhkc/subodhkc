export default function StructuredData() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': ['Person', 'ProfessionalService'],
    name: 'Subodh KC',
    alternateName: ['Subodh K.C.', 'Subodh Khatri Chhetri'],
    jobTitle: 'AI Systems Architect & Governance Expert',
    description:
      'AI Systems Architect and Governance Expert. Former Fortune 50 AI Strategy CTL, founder of KestrelVoice, co-founder of HAIEC. 16+ years architecting, deploying, and governing production AI systems — including agentic workflows, RAG, voice AI, and compliance automation at enterprise scale.',
    url: 'https://subodhkc.com',
    email: 'Subodh.kc@haiec.com',
    image: 'https://subodhkc.com/portrait.jpeg',
    sameAs: [
      'https://www.wikidata.org/wiki/Q140546484',
      'https://www.linkedin.com/in/subodhkc',
      'https://twitter.com/subodhkc',
      'https://github.com/subodhkc',
      'https://medium.com/@subodhkc',
      'https://kestrelvoice.com',
      'https://frontofai.com',
    ],
    knowsAbout: [
      'AI Architecture',
      'Agentic AI Systems',
      'RAG & Enterprise Knowledge Systems',
      'MCP & API Integrations',
      'Voice AI Operations',
      'AI Governance',
      'Technical Program Management',
      'Enterprise AI Strategy',
      'Cognitive Systems Management',
      'AI Regulatory Compliance',
      'Compliance Architecture',
      'AI Risk Management',
      'AI Ethics',
      'Enterprise AI Implementation',
      'AI Governance Frameworks',
      'Fortune 50 AI Leadership',
    ],
    hasOccupation: {
      '@type': 'Occupation',
      name: 'AI Systems Architect',
      occupationLocation: {
        '@type': 'Country',
        name: 'United States',
      },
      estimatedSalary: {
        '@type': 'MonetaryAmountDistribution',
        name: 'AI Systems Architect & Governance Expert',
        currency: 'USD',
      },
      description: 'Expert in AI architecture, governance, compliance automation, and enterprise AI deployment',
    },
    alumniOf: {
      '@type': 'Organization',
      name: 'Louisiana Tech University',
    },
    worksFor: {
      '@type': 'Organization',
      name: 'Fortune 50 Company',
    },
    founder: {
      '@type': 'Organization',
      name: 'KestrelVoice',
      description: 'AI voice operations platform',
      url: 'https://kestrelvoice.com',
    },
    award: [
      'Dean\'s Honor List',
      'President\'s Honor List',
    ],
    knowsLanguage: ['English', 'Nepali'],
    birthPlace: {
      '@type': 'Place',
      name: 'Kathmandu',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'Nepal',
      },
    },
  }

  const profilePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: 'Subodh KC',
      url: 'https://subodhkc.com',
      jobTitle: 'AI Systems Architect & Governance Expert',
      description:
        'AI Systems Architect and Governance Expert. Former Fortune 50 AI Strategy CTL, founder of KestrelVoice, co-founder of HAIEC.',
    },
    dateCreated: '2009-01-01',
    dateModified: '2026-07-14',
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Subodh KC — AI Systems Architect & Governance Expert',
    url: 'https://subodhkc.com',
    description:
      'AI Systems Architect and Governance Expert. Production AI systems — architecture, deployment, and governance at enterprise scale.',
    author: {
      '@type': 'Person',
      name: 'Subodh KC',
    },
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'HAIEC',
    description:
      'Human AI Ethics Council - Enterprise-grade AI compliance and governance platform',
    url: 'https://subodhkc.com/haiec',
    founder: {
      '@type': 'Person',
      name: 'Subodh KC',
      description: 'Co-founder of HAIEC',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'Subodh.kc@haiec.com',
      contactType: 'Customer Service',
    },
  }

  const serviceSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'AI Architecture & Integration',
      name: 'AI Architecture & Integration',
      description:
        'Agentic AI systems, RAG pipelines, MCP integrations, workflow architecture, and AI pilot recovery for enterprise-scale production systems.',
      provider: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
      areaServed: { '@type': 'Country', name: 'United States' },
      url: 'https://subodhkc.com/services',
      offers: {
        '@type': 'Offer',
        price: '300',
        priceCurrency: 'USD',
        description: 'Consulting from $300/hour (project minimums apply)',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'AI Operations & Deployment',
      name: 'AI Operations & Deployment',
      description:
        'Voice and chat agents, customer intake automation, human escalation architecture, monitoring, observability, and production hardening for AI systems.',
      provider: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
      areaServed: { '@type': 'Country', name: 'United States' },
      url: 'https://subodhkc.com/services',
      offers: {
        '@type': 'Offer',
        price: '300',
        priceCurrency: 'USD',
        description: 'Consulting from $300/hour (project minimums apply)',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'AI Governance & Assurance',
      name: 'AI Governance & Assurance',
      description:
        'AI readiness assessments, EU AI Act / NIST AI RMF / ISO 42001 / NYC LL 144 compliance implementation, evidence architecture, drift controls, and governance operating models.',
      provider: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
      areaServed: { '@type': 'Country', name: 'United States' },
      url: 'https://subodhkc.com/services',
      offers: {
        '@type': 'Offer',
        price: '300',
        priceCurrency: 'USD',
        description: 'Consulting from $300/hour (project minimums apply)',
      },
    },
  ]

  const softwareApplicationSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'HAIEC',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: 'Enterprise AI governance and compliance platform for EU AI Act, NIST AI RMF, ISO 42001, and NYC LL 144.',
      url: 'https://subodhkc.com/solutions/haiec',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Enterprise pricing' },
      author: { '@type': 'Person', name: 'Subodh KC' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'KestrelVoice',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: 'AI voice operations platform — answers every call, books appointments, runs the front desk 24/7.',
      url: 'https://subodhkc.com/solutions/kestrelvoice',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Subscription pricing' },
      author: { '@type': 'Person', name: 'Subodh KC' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'llmverify',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Cross-platform',
      description: 'Runtime health monitor for LLM apps — drift detection, hallucination risk, latency, JSON quality.',
      url: 'https://subodhkc.com/products/llmverify',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free and open source (MIT)' },
      author: { '@type': 'Person', name: 'Subodh KC' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Doc Timeline',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: 'AI-powered document timeline extraction — converts thousands of documents into one chronological timeline.',
      url: 'https://subodhkc.com/products/doc-timeline',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Enterprise (SOC 2)' },
      author: { '@type': 'Person', name: 'Subodh KC' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'PDF Redactor',
      applicationCategory: 'SecurityApplication',
      operatingSystem: 'Cross-platform',
      description: 'AI detection and permanent redaction of SSNs, cards, names, and 50+ PII types with local processing.',
      url: 'https://subodhkc.com/products/pdf-redactor',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free' },
      author: { '@type': 'Person', name: 'Subodh KC' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'SKC Log Analyser',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      description: 'AI pattern detection across terabytes of logs — finds anomalies in massive log datasets.',
      url: 'https://subodhkc.com/products/skc-log-analyser',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Beta (Early Access)' },
      author: { '@type': 'Person', name: 'Subodh KC' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'CourtCase',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: 'AI-assisted court evidence builder — case files, deadlines, document packets management.',
      url: 'https://subodhkc.com/products/courtcase',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Public beta' },
      author: { '@type': 'Person', name: 'Subodh KC' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'FrontOfAI Briefing',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: 'Daily AI intelligence platform for CTOs — strategic briefings on what shipped, what shifted, what matters.',
      url: 'https://subodhkc.com/solutions/frontofai',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Subscription' },
      author: { '@type': 'Person', name: 'Subodh KC' },
    },
  ]

  const reviewSchemas = [
    {
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      author: { '@type': 'Person', name: 'Enterprise AI Leader' },
      reviewBody:
        'Subodh\'s governance framework transformed how we approach AI compliance. We went from no formal process to passing our first audit in 90 days.',
    },
    {
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      author: { '@type': 'Person', name: 'CTO, SaaS Startup' },
      reviewBody:
        'The AI architecture Subodh designed for our RAG pipeline cut hallucinations by 80% and made our system production-ready in weeks, not months.',
    },
    {
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      author: { '@type': 'Person', name: 'VP Engineering, Fortune 500' },
      reviewBody:
        'Subodh bridges engineering, legal, and executive stakeholders like nobody I\'ve worked with. His CSM framework is now our standard for AI programs.',
    },
    {
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      author: { '@type': 'Person', name: 'Compliance Director' },
      reviewBody:
        'HAIEC and the Modular Audit Engine saved us months of documentation work. The evidence architecture alone is worth the investment.',
    },
    {
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      author: { '@type': 'Person', name: 'Product Manager, AI Startup' },
      reviewBody:
        'llmverify caught a drift issue in our production LLM that we would have missed for weeks. Subodh\'s tools are practical, not theoretical.',
    },
  ]

  const aggregateRatingSchema = {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    itemReviewed: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
    ratingValue: '5',
    bestRating: '5',
    ratingCount: '5',
    reviewCount: '5',
  }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Production Systems by Subodh KC',
    description: 'AI platforms, tools, and open-source packages built by Subodh KC.',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'HAIEC', url: 'https://subodhkc.com/solutions/haiec' },
      { '@type': 'ListItem', position: 2, name: 'KestrelVoice', url: 'https://subodhkc.com/solutions/kestrelvoice' },
      { '@type': 'ListItem', position: 3, name: 'llmverify', url: 'https://subodhkc.com/products/llmverify' },
      { '@type': 'ListItem', position: 4, name: 'Doc Timeline', url: 'https://subodhkc.com/products/doc-timeline' },
      { '@type': 'ListItem', position: 5, name: 'PDF Redactor', url: 'https://subodhkc.com/products/pdf-redactor' },
      { '@type': 'ListItem', position: 6, name: 'SKC Log Analyser', url: 'https://subodhkc.com/products/skc-log-analyser' },
      { '@type': 'ListItem', position: 7, name: 'CourtCase', url: 'https://subodhkc.com/products/courtcase' },
      { '@type': 'ListItem', position: 8, name: 'FrontOfAI Briefing', url: 'https://subodhkc.com/solutions/frontofai' },
    ],
  }

  const patentFrameworkSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: 'Adversarial Project Twin',
      description: 'Drift and sabotage simulation framework that proactively identifies AI system vulnerabilities before production impact.',
      author: { '@type': 'Person', name: 'Subodh KC' },
      url: 'https://subodhkc.com/about',
      keywords: 'AI drift detection, adversarial testing, AI vulnerability simulation',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: 'AI Compliance Twin',
      description: 'Real-time regulatory enforcement engine that continuously validates AI systems against EU AI Act, GDPR, and sector-specific compliance requirements.',
      author: { '@type': 'Person', name: 'Subodh KC' },
      url: 'https://subodhkc.com/about',
      keywords: 'AI compliance, regulatory enforcement, EU AI Act, GDPR compliance',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: 'Modular Audit Engine',
      description: 'AI fairness and transparency scoring system with modular architecture for audit-grade documentation and compliance reporting.',
      author: { '@type': 'Person', name: 'Subodh KC' },
      url: 'https://subodhkc.com/about',
      keywords: 'AI audit, fairness scoring, transparency, compliance reporting',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: 'Precision Drift Detector',
      description: 'Numerical anomaly detection system for AI model performance monitoring that identifies drift patterns before they impact business outcomes.',
      author: { '@type': 'Person', name: 'Subodh KC' },
      url: 'https://subodhkc.com/about',
      keywords: 'AI drift detection, anomaly detection, model monitoring',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: 'Compliance Fingerprint Layer',
      description: 'Tamper-evident traceability system for AI decision-making that creates immutable audit trails for regulatory compliance and forensic analysis.',
      author: { '@type': 'Person', name: 'Subodh KC' },
      url: 'https://subodhkc.com/about',
      keywords: 'AI traceability, audit trail, compliance, forensic analysis',
    },
  ]

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Architect, Deploy, and Govern AI Systems',
    description:
      'A three-pillar approach to building production AI systems: architecture, operations, and governance.',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'AI Architecture & Integration',
        text: 'Design the AI system architecture including agentic workflows, RAG pipelines, MCP integrations, and data architecture. Define the system boundaries, data flows, and integration points.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'AI Operations & Deployment',
        text: 'Deploy the AI system to production with monitoring, observability, drift detection, and human escalation. Harden the system with load testing, failure mode analysis, and operational readiness reviews.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'AI Governance & Assurance',
        text: 'Implement governance frameworks (EU AI Act, NIST AI RMF, ISO 42001), build evidence architecture for audit readiness, and establish governance operating models with policies and committees.',
      },
    ],
    totalTime: 'P3M',
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: '25000' },
    provider: { '@type': 'Person', name: 'Subodh KC', url: 'https://subodhkc.com' },
  }

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {serviceSchemas.map((schema, i) => (
        <script
          key={`service-${i}`}
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {softwareApplicationSchemas.map((schema, i) => (
        <script
          key={`app-${i}`}
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {reviewSchemas.map((review, i) => (
        <script
          key={`review-${i}`}
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Review', ...review }) }}
        />
      ))}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      {patentFrameworkSchemas.map((schema, i) => (
        <script
          key={`patent-${i}`}
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
    </>
  )
}
