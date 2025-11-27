export default function StructuredData() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': ['Person', 'ProfessionalService'],
    name: 'Subodh KC',
    alternateName: ['Subodh K.C.', 'Subodh Khatri Chhetri'],
    jobTitle: 'AI Compliance Architect & Enterprise Technical Program Manager',
    description:
      'Leading AI Compliance Architect at Fortune 50 company, HAIEC founder, and Enterprise Technical Program Manager with 12+ years of experience driving complex AI programs globally. Expert in AI governance, regulatory compliance, and cognitive systems management.',
    url: 'https://subodhkc.com',
    email: 'Subodh.kc@haiec.com',
    image: 'https://subodhkc.com/profile-image.jpg',
    sameAs: [
      'https://www.linkedin.com/in/subodhkc',
      'https://twitter.com/subodhkc',
      'https://github.com/subodhkc',
    ],
    knowsAbout: [
      'Artificial Intelligence Compliance',
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
      name: 'AI Compliance Architect',
      occupationLocation: {
        '@type': 'Country',
        name: 'United States',
      },
      estimatedSalary: {
        '@type': 'MonetaryAmountDistribution',
        name: 'Senior AI Compliance Architect',
        currency: 'USD',
      },
      description: 'Expert in AI governance, compliance architecture, and enterprise AI strategy',
    },
    alumniOf: {
      '@type': 'Organization',
      name: 'Your University', // Update with actual university
    },
    worksFor: {
      '@type': 'Organization',
      name: 'Fortune 50 Company', // Keep generic for privacy
    },
    founder: {
      '@type': 'Organization',
      name: 'HAIEC',
      description: 'Human AI Ethics Council',
      url: 'https://subodhkc.com/haiec',
    },
    award: [
      'Dean\'s Honor List',
      'President\'s Honor List',
    ],
    knowsLanguage: ['English', 'Nepali'],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Subodh KC',
    url: 'https://subodhkc.com',
    description:
      'Strategic Systems. Sharp Execution. AI Compliance at Enterprise Scale.',
    author: {
      '@type': 'Person',
      name: 'Subodh KC',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://subodhkc.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
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
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'Subodh.kc@haiec.com',
      contactType: 'Customer Service',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </>
  )
}
