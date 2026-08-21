import { getAllPosts, type BlogPostSummary } from './blog'

export interface SearchEntry {
  title: string
  description: string
  href: string
  category: string
  keywords: string
}

interface StaticPage {
  title: string
  description: string
  href: string
  category: string
  keywords: string
}

const staticPages: StaticPage[] = [
  { title: 'About', description: 'Professional background, career timeline, and expertise', href: '/about', category: 'Page', keywords: 'about subodh kc career timeline bio background experience' },
  { title: 'Contact', description: 'Get in touch for consulting, speaking, or collaboration', href: '/contact', category: 'Page', keywords: 'contact email hire consulting speaking' },
  { title: 'Services', description: 'AI governance consulting, compliance automation, and architecture review', href: '/services', category: 'Page', keywords: 'services consulting governance compliance automation architecture review audit' },
  { title: 'Work', description: 'Work hub: enterprise program leadership, AI systems, founder-built products, open-source technical controls, and frameworks', href: '/work', category: 'Page', keywords: 'work portfolio projects enterprise program leadership ai systems open source haiec kestrelvoice mcp llmverify csm' },
  { title: 'Insights', description: 'Writing, research, frameworks, magazine, guides, and tools. How Subodh thinks about AI.', href: '/insights', category: 'Page', keywords: 'insights writing research frameworks magazine guides tools ai systems decisions governance' },
  { title: 'Portfolio', description: 'Selected projects and case studies across AI, compliance, and enterprise software', href: '/portfolio', category: 'Page', keywords: 'portfolio projects case studies work experience' },
  { title: 'Executive Bio', description: 'Executive biography for speaking engagements and board materials', href: '/executive-bio', category: 'Page', keywords: 'executive bio biography speaker board leadership' },
  { title: 'Resume', description: 'Detailed resume with experience, skills, and achievements', href: '/resume', category: 'Page', keywords: 'resume cv experience skills achievements hp program manager' },
  { title: 'Person: Subodh KC', description: 'Structured person profile with career timeline and credentials', href: '/person/subodh-kc', category: 'Profile', keywords: 'subodh kc person profile career timeline credentials education patents' },
  { title: 'Speaking', description: 'Speaking topics, past talks, and booking information', href: '/speaking', category: 'Page', keywords: 'speaking talks conference keynote workshop booking' },
  { title: 'Research', description: 'Research papers, frameworks, and analysis on AI governance', href: '/research', category: 'Page', keywords: 'research papers frameworks analysis governance compliance' },
  { title: 'Writing', description: 'Long-form writing and articles on AI systems and governance', href: '/writing', category: 'Page', keywords: 'writing articles long-form essays ai systems governance' },
  { title: 'FAQ', description: 'Frequently asked questions about AI governance and compliance', href: '/faq', category: 'Page', keywords: 'faq questions answers governance compliance ai' },
  { title: 'Course: AI Governance Masterclass', description: 'Live masterclass covering AI architecture, governance, and audit readiness', href: '/course', category: 'Course', keywords: 'course masterclass training ai governance compliance audit eu ai act nist iso 42001' },

  { title: 'Blog', description: 'AI governance and architecture articles', href: '/blog', category: 'Resource', keywords: 'blog articles posts ai governance architecture compliance' },
  { title: 'Guides', description: 'AI compliance guides for EU AI Act, Texas AI Law, NYC LL 144', href: '/guides', category: 'Resource', keywords: 'guides compliance eu ai act texas nyc local law 144' },
  { title: 'Guide: EU AI Act', description: 'Complete guide to EU AI Act compliance requirements', href: '/guides/eu-ai-act', category: 'Guide', keywords: 'eu ai act guide compliance requirements high-risk obligations' },
  { title: 'Guide: NYC Local Law 144', description: 'Bias audit requirements for automated employment decision tools', href: '/guides/nyc-local-law-144', category: 'Guide', keywords: 'nyc local law 144 aedt bias audit hiring employment' },
  { title: 'Guide: Texas AI Law', description: 'Texas HB 149 compliance guide for AI systems', href: '/guides/texas-ai-law', category: 'Guide', keywords: 'texas ai law hb 149 compliance guide' },
  { title: 'Does Texas AI Law Apply to My Business?', description: 'Interactive tool to determine Texas AI Law applicability', href: '/does-texas-ai-law-apply-to-my-business', category: 'Tool', keywords: 'texas ai law hb 149 applicability checker business' },

  { title: 'LLMVerify', description: 'Local-first LLM output verification and guardrails. Prompt injection, PII redaction, hallucination risk signals, JSON repair, runtime monitoring. MIT licensed.', href: '/products/llmverify', category: 'Product', keywords: 'llmverify llm verification guardrails prompt injection pii redaction hallucination runtime monitoring npm open source local-first zero telemetry' },
  { title: 'AI AppSec', description: 'Evidence-backed AppSec for AI applications and agents. 122 detectors, 79 security checks, coverage receipts, proof-of-fix, MCP integration. MIT licensed.', href: '/products/ai-appsec', category: 'Product', keywords: 'ai appsec ai application security scanner ai agent security ai code security llm application security mcp security tool evidence-backed scan receipts proof-of-fix npm open source' },
  { title: 'MCP Tenant Isolation', description: '57 deterministic rules for tenant boundaries across multi-tenant SaaS and MCP server code. IDOR, RLS, cache, storage, MCP-specific security. MIT licensed.', href: '/products/mcp-tenant-isolation', category: 'Product', keywords: 'mcp tenant isolation tenant isolation scanner multi-tenant saas security cross-tenant data leakage idor rls mcp server security mcp security scanner npm open source' },
  { title: 'AI AppSec + MCP Tenant Isolation Release', description: 'Introducing AI AppSec and MCP Tenant Isolation: MIT-licensed security tools for AI applications, coding agents, MCP servers, and multi-tenant SaaS.', href: '/insights/ai-appsec-mcp-tenant-isolation-release', category: 'Resource', keywords: 'ai appsec mcp tenant isolation release ai developer security ai coding agent security mcp security tools haiec developer security open source release' },
  { title: 'Print Later', description: 'Save web pages and print when ready', href: '/products/print-later', category: 'Product', keywords: 'print later save web pages print browser extension free' },
  { title: 'PDF Redactor', description: 'AI-powered sensitive data removal from PDFs', href: '/products/pdf-redactor', category: 'Product', keywords: 'pdf redactor redaction sensitive data pii removal free' },
  { title: 'Doc Timeline', description: 'Document timeline extraction tool', href: '/products/doc-timeline', category: 'Product', keywords: 'doc timeline document extraction timeline enterprise' },
  { title: 'SKC Log Analyser', description: 'AI log analysis and anomaly detection', href: '/products/skc-log-analyser', category: 'Product', keywords: 'log analyser ai log analysis anomaly detection early access' },
  { title: 'CourtCase', description: 'Legal document organization and evidence builder', href: '/products/courtcase', category: 'Product', keywords: 'courtcase legal document evidence builder coming soon' },
  { title: 'AI Article Generator', description: 'AI-powered article generation tool for content teams', href: '/products/ai-article-generator', category: 'Product', keywords: 'ai article generator content generation writing tool' },

  { title: 'AI Advisor for Business', description: 'Ongoing human AI advisory. Weekly signal, monthly point of view, and human advice when a decision matters. $99/month.', href: '/ai-advisor', category: 'Service', keywords: 'ai advisor for business ai advisor human advisory ongoing ai advisory ai intelligence opportunity discovery controls review regulatory monitoring subscription' },
  { title: 'AI Work Order', description: 'A bounded piece of AI work with one defined outcome. $500 standard scoped work order. Available through the AI Advisor relationship.', href: '/ai-automation', category: 'Service', keywords: 'ai work order scoped ai work ai opportunity assessment ai workflow assessment ai automation strategy build vs buy configure vs connect workflow analysis feasibility vendor evaluation architecture decision' },
  { title: 'Fractional AI Advisor', description: 'Executive AI advisory for higher-stakes decisions. $1,250/month.', href: '/advisory', category: 'Service', keywords: 'fractional ai advisor executive ai advisory ai strategy advisor ai architecture review vendor evaluation build vs buy roadmap' },
  { title: 'HAIEC', description: 'AI compliance and governance platform', href: '/solutions/haiec', category: 'Solution', keywords: 'haiec ai compliance governance platform enterprise eu ai act nist iso 42001 nyc ll 144 holistic ai ethics compliance high-eck hi-yek hi ai high tech pronunciation' },
  { title: 'KestrelVoice', description: 'AI voice operations platform for front desk automation', href: '/solutions/kestrelvoice', category: 'Solution', keywords: 'kestrelvoice ai voice operations front desk receptionist phone calls appointments' },
  { title: 'FrontOfAI', description: 'Enterprise AI solutions platform', href: '/solutions/frontofai', category: 'Solution', keywords: 'frontofai enterprise ai solutions platform' },
  { title: 'CourtCase Solution', description: 'AI-assisted court evidence builder', href: '/solutions/courtcase', category: 'Solution', keywords: 'courtcase ai court evidence legal beta' },
  { title: 'AI Briefing', description: 'Weekly AI intelligence briefing for IT leaders', href: '/solutions/ai-briefing', category: 'Solution', keywords: 'ai briefing weekly intelligence it leaders newsletter' },

  { title: 'Architecture Decision Master Sheet', description: 'Interactive 25-layer architecture decision sheet', href: '/architecture-decision-master-sheet', category: 'Tool', keywords: 'architecture decision master sheet interactive 25-layer ai architecture' },
  { title: 'AI Security Tools', description: 'Blast radius, agent matrix, and prompt injection library', href: '/ai-security-tools', category: 'Tool', keywords: 'ai security tools blast radius agent matrix prompt injection library' },
  { title: 'AI Risk Register', description: '34+ AI-specific risks with controls and tracking', href: '/ai-risk-register', category: 'Tool', keywords: 'ai risk register 34 risks controls tracking governance' },
  { title: 'AI Vendor Due-Diligence Checklist', description: '60-item AI vendor evaluation checklist', href: '/ai-vendor-due-diligence-checklist', category: 'Tool', keywords: 'ai vendor due diligence checklist 60-item evaluation procurement' },
  { title: 'AI Incident Evidence Checklist', description: '4-phase AI security incident response checklist', href: '/ai-incident-evidence-checklist', category: 'Tool', keywords: 'ai incident evidence checklist security incident response 4-phase' },

  { title: 'SaaS & AI Security Review', description: 'Tenant isolation, AI app security, and enterprise-readiness evidence', href: '/saas-security-review', category: 'Service', keywords: 'saas security review tenant isolation audit multi-tenant rls supabase postgres ai security' },
  { title: 'AI Voice Agent Architecture', description: 'Production architecture for AI voice agents', href: '/ai-voice-agent-architecture', category: 'Resource', keywords: 'ai voice agent architecture production realtime modal fastapi' },
  { title: 'Why AI Voice Agents Fail in Production', description: 'Common failure modes and fixes for AI voice agents', href: '/why-ai-voice-agents-fail-in-production', category: 'Resource', keywords: 'ai voice agents fail production failure modes latency' },
  { title: 'How to Secure and Govern AI', description: 'Guide to securing and governing AI systems', href: '/how-to-secure-and-govern-ai', category: 'Resource', keywords: 'secure govern ai security governance frameworks' },
  { title: 'Build Internal AI Applications', description: 'Streamlit, RAG, and MCP patterns for internal AI apps', href: '/build-internal-ai-applications-streamlit-rag-mcp', category: 'Resource', keywords: 'internal ai applications streamlit rag mcp build enterprise' },
  { title: 'Secure Enterprise RAG Architecture', description: 'RAG architecture patterns for enterprise search', href: '/secure-enterprise-rag-architecture', category: 'Resource', keywords: 'secure enterprise rag architecture retrieval augmented generation' },
  { title: 'Dallas / DFW AI Advisor', description: 'Local AI review for Dallas-Fort Worth businesses. Practical AI opportunities, voice automation, and compliance readiness.', href: '/local-ai-review', category: 'Service', keywords: 'dallas dfw ai advisor local ai review texas ai business automation kestrel voice haiec small business' },
  { title: 'Magazine', description: 'Interactive magazine format of selected content', href: '/magazine', category: 'Resource', keywords: 'magazine interactive flipbook publication' },
  { title: 'Centaurus', description: 'AI governance and compliance platform overview', href: '/centaurus', category: 'Solution', keywords: 'centaurus ai governance compliance platform haiec' },
  { title: 'Kestrel Voice AI Receptionist Platform', description: 'AI receptionist platform details and architecture', href: '/kestrel-voice-ai-receptionist-platform', category: 'Resource', keywords: 'kestrel voice ai receptionist platform architecture voice agent' },
]

export function buildSearchIndex(): SearchEntry[] {
  const posts: BlogPostSummary[] = getAllPosts()

  const blogEntries: SearchEntry[] = posts.map((post) => ({
    title: post.title,
    description: post.excerpt || post.metaDescription || '',
    href: `/blog/${post.slug}`,
    category: 'Blog',
    keywords: (post.keywords || []).join(' '),
  }))

  const staticEntries: SearchEntry[] = staticPages.map((page) => ({
    title: page.title,
    description: page.description,
    href: page.href,
    category: page.category,
    keywords: page.keywords,
  }))

  return [...blogEntries, ...staticEntries]
}
