const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://subodhkc.com/#person",
  name: "Subodh KC",
  url: "https://subodhkc.com",
  image: "https://subodhkc.com/portrait.jpeg",
  jobTitle: "Enterprise AI Advisor and AI Systems Architect",
  description: "Enterprise AI advisor and systems architect working across strategic diagnostics, executive decisions, production architecture, and evidence-bound AI assurance.",
  email: "mailto:subodhkc@subodhkc.com",
  sameAs: [
    "https://www.linkedin.com/in/subodhkc",
    "https://github.com/subodhkc",
    "https://medium.com/@subodhkc",
    "https://www.wikidata.org/wiki/Q140546484",
  ],
  knowsAbout: [
    "Enterprise AI strategy",
    "AI systems architecture",
    "AI action assurance",
    "AI application security",
    "AI agents",
    "Retrieval-augmented generation",
    "AI voice systems",
    "Multi-tenant security",
    "Technical program management",
  ],
  founder: [
    { "@type": "Organization", name: "HAIEC", url: "https://www.haiec.com" },
    { "@type": "Organization", name: "KestrelVoice", url: "https://kestrelvoice.com" },
  ],
};

const site = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://subodhkc.com/#website",
  url: "https://subodhkc.com",
  name: "Subodh KC | Enterprise AI Advisor & AI Systems Architect",
  description: "Decisions. Systems. Evidence.",
  publisher: { "@id": "https://subodhkc.com/#person" },
};

const services = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Subodh KC Engagements",
  itemListElement: [
    ["Strategic Diagnostic Intensives", "/diagnostics", "Bounded executive diagnostics that expose hidden opportunity, constraints, operating friction, and decision conflict."],
    ["Executive AI Advisory", "/advisory", "Independent judgment for consequential AI investment, vendor, architecture, roadmap, and operating-model decisions."],
    ["AI Systems Architecture & Implementation", "/services", "Production architecture and implementation for agents, RAG, voice, data, integrations, controls, and operational handoff."],
    ["HAIEC Enterprise Assurance", "/solutions/haiec", "Evidence-bound assurance for consequential AI systems."],
  ].map(([name, path, description], index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Service",
      name,
      url: `https://subodhkc.com${path}`,
      description,
      provider: { "@id": "https://subodhkc.com/#person" },
      areaServed: "Global",
    },
  })),
};

const haiec = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "HAIEC",
  alternateName: "High Assurance In Every Consequence",
  applicationCategory: "SecurityApplication",
  operatingSystem: "Web",
  url: "https://www.haiec.com",
  description: "Evidence-bound assurance for consequential AI. HAIEC binds evaluated scope, evidence, capability, authority, and explicit unknowns into bounded assurance decisions.",
  author: { "@id": "https://subodhkc.com/#person" },
};

export default function StructuredData() {
  return (
    <>
      {[person, site, services, haiec].map((schema, index) => (
        <script key={index} type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
    </>
  );
}
