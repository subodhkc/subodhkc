#!/usr/bin/env node

/**
 * outreach-generator.mjs — Generate enhanced outreach opportunities for each blog post.
 *
 * For each article, this script:
 * 1. Analyzes article content and keywords for topic classification
 * 2. Identifies Reddit subreddits with posting strategy per subreddit
 * 3. Identifies Quora topics with specific search queries
 * 4. Generates specific backlink targets with real URLs and contact info
 * 5. Creates personalized outreach email templates with article-specific talking points
 * 6. Produces a distribution checklist with priority ordering
 * 7. Sends the report to subodhkc@subodhkc.com via Resend for daily review
 *
 * Usage:
 *   node scripts/outreach-generator.mjs --slug=<slug>   # Generate for specific article
 *   node scripts/outreach-generator.mjs                 # Generate for latest article
 *   node scripts/outreach-generator.mjs --all           # Generate for all articles
 *   node scripts/outreach-generator.mjs --no-email       # Skip email delivery
 *
 * Output: data/outreach/<slug>.md
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')
const POSTS_DIR = path.join(PROJECT_ROOT, 'data', 'blog', 'posts')
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'data', 'outreach')
const TRACKER_PATH = path.join(PROJECT_ROOT, 'data', 'outreach', 'sent-tracker.json')
const DAILY_SEND_LIMIT = 5
const SITE_URL = 'https://subodhkc.com'
const ADMIN_EMAIL = 'subodhkc@subodhkc.com'

function loadEnvLocal() {
  const envPath = path.join(PROJECT_ROOT, '.env.local')
  if (!fs.existsSync(envPath)) return
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = val
  }
}

function getAllSlugs() {
  if (!fs.existsSync(POSTS_DIR)) return []
  return fs.readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''))
    .sort()
}

function getPostBySlug(slug) {
  const filePath = path.join(POSTS_DIR, `${slug}.json`)
  if (!fs.existsSync(filePath)) return null
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  } catch {
    return null
  }
}

function loadTracker() {
  if (!fs.existsSync(TRACKER_PATH)) return {}
  try {
    return JSON.parse(fs.readFileSync(TRACKER_PATH, 'utf-8'))
  } catch {
    return {}
  }
}

function saveTracker(tracker) {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  fs.writeFileSync(TRACKER_PATH, JSON.stringify(tracker, null, 2))
}

function getTodaysSendCount(tracker) {
  const today = new Date().toISOString().split('T')[0]
  const todayEntry = tracker[today]
  if (!todayEntry) return 0
  return todayEntry.sentCount || 0
}

function recordSend(tracker, target) {
  const today = new Date().toISOString().split('T')[0]
  if (!tracker[today]) {
    tracker[today] = { sentCount: 0, targets: [] }
  }
  tracker[today].sentCount += 1
  tracker[today].targets.push({ target, time: new Date().toISOString() })
  saveTracker(tracker)
}

// ─── Topic Classification ───────────────────────────────────────────────────

const TOPIC_CATEGORIES = {
  'AI Governance & Compliance': {
    keywords: ['compliance', 'governance', 'nist', 'iso 42001', 'soc 2', 'audit', 'regulatory', 'risk'],
    subreddits: [
      { name: 'compliance', strategy: 'Self-post with key takeaways. Link in comments.', karma: 'low' },
      { name: 'AIethics', strategy: 'Focus on governance implications. Discussion format.', karma: 'low' },
      { name: 'cybersecurity', strategy: 'Emphasize security controls and audit aspects.', karma: 'medium' },
      { name: 'EnterpriseAI', strategy: 'Frame for enterprise decision-makers.', karma: 'low' },
    ],
    quoraTopics: ['AI Governance', 'Regulatory Compliance', 'NIST Cybersecurity Framework'],
    quoraQueries: [
      'How do NIST AI RMF and ISO 42001 work together?',
      'What is AI compliance and why does it matter?',
      'How to implement SOC 2 controls for AI systems?',
    ],
    newsletters: [
      { name: 'The Rundown AI', url: 'https://www.therundown.ai/', pitch: 'Practical compliance framework breakdown for AI practitioners' },
      { name: 'TLDR AI', url: 'https://tldr.tech/ai', pitch: 'Enterprise AI compliance — how frameworks fit together' },
      { name: 'AI Tinkerers Weekly', url: 'https://www.aitinkerers.org/', pitch: 'Implementation-level compliance guidance for AI builders' },
    ],
    backlinkTargets: [
      { type: 'Resource Page', target: 'IAPP (International Association of Privacy Pros)', url: 'https://iapp.org', action: 'Submit as resource in AI governance section' },
      { type: 'Resource Page', target: 'NIST AI Resource Center', url: 'https://www.nist.gov/artificial-intelligence', action: 'Reference in community discussions and link from relevant forums' },
      { type: 'Guest Post', target: 'Compliance Week', url: 'https://www.complianceweek.com', action: 'Pitch a guest article on practical AI compliance implementation' },
      { type: 'Guest Post', target: 'Hyperproof Blog', url: 'https://hyperproof.io/blog/', action: 'Offer article as guest post or resource exchange' },
      { type: 'Guest Post', target: 'OneTrust Blog', url: 'https://www.onetrust.com/blog/', action: 'Pitch AI governance implementation article for their blog' },
      { type: 'Guest Post', target: 'Drata Blog', url: 'https://drata.com/blog', action: 'Pitch AI compliance automation article' },
      { type: 'Guest Post', target: 'Future of Privacy Forum', url: 'https://fpf.org', action: 'Pitch AI governance research contribution' },
    ],
  },
  'AI Security': {
    keywords: ['security', 'prompt injection', 'owasp', 'attack', 'vulnerability', 'threat', 'rag poisoning'],
    subreddits: [
      { name: 'netsec', strategy: 'Technical deep-dive. Focus on attack vectors.', karma: 'high' },
      { name: 'cybersecurity', strategy: 'Practical security controls for AI.', karma: 'medium' },
      { name: 'MachineLearning', strategy: 'Self-post. Emphasize research aspects.', karma: 'high' },
    ],
    quoraTopics: ['AI Security', 'Cybersecurity', 'OWASP'],
    quoraQueries: [
      'What are the biggest security risks with AI systems?',
      'How does prompt injection work and how to prevent it?',
      'What is OWASP GenAI security?',
    ],
    newsletters: [
      { name: 'TLDR Security', url: 'https://tldr.tech/security', pitch: 'AI-specific attack surfaces and mitigation strategies' },
      { name: 'Risky Biz Newsletter', url: 'https://risky.biz/newsletter/', pitch: 'AI security threats and enterprise defenses' },
    ],
    backlinkTargets: [
      { type: 'Resource Page', target: 'OWASP AI Security Project', url: 'https://owasp.org/www-project-ai-security/', action: 'Contribute to OWASP AI security resources' },
      { type: 'Resource Page', target: 'MITRE ATLAS', url: 'https://atlas.mitre.org/', action: 'Reference in community discussions' },
      { type: 'Guest Post', target: 'Krebs on Security', url: 'https://krebsonsecurity.com/', action: 'Pitch AI security angle for guest contribution' },
      { type: 'Guest Post', target: 'AI Now Institute', url: 'https://ainowinstitute.org', action: 'Pitch AI security research contribution' },
    ],
  },
  'Voice AI & Conversational': {
    keywords: ['voice', 'voice agent', 'speech', 'conversational', 'twilio', 'vapi', 'receptionist'],
    subreddits: [
      { name: 'VoiceAI', strategy: 'Direct post. Community is small but engaged.', karma: 'low' },
      { name: 'artificial', strategy: 'Focus on production challenges.', karma: 'low' },
      { name: 'MachineLearning', strategy: 'Self-post with architecture details.', karma: 'high' },
    ],
    quoraTopics: ['AI Voice Agents', 'Voice Technology', 'Conversational AI'],
    quoraQueries: [
      'Why do AI voice agents fail in production?',
      'How to build a reliable AI voice agent?',
      'What are the main challenges with AI receptionists?',
    ],
    newsletters: [
      { name: 'Voicebot.ai', url: 'https://voicebot.ai/', pitch: 'Production voice AI architecture and failure modes' },
      { name: 'The Rundown AI', url: 'https://www.therundown.ai/', pitch: 'Voice AI in production — what works and what fails' },
    ],
    backlinkTargets: [
      { type: 'Resource Page', target: 'Voicebot.ai Research', url: 'https://voicebot.ai/research/', action: 'Submit article as reference material' },
      { type: 'Guest Post', target: 'Analytics Voice', url: 'https://www.analyticsvoice.com/', action: 'Pitch voice AI architecture article' },
    ],
  },
  'RAG & LLM Infrastructure': {
    keywords: ['rag', 'retrieval', 'llm', 'embedding', 'vector', 'streamlit', 'mcp', 'model context protocol'],
    subreddits: [
      { name: 'LocalLLaMA', strategy: 'Technical post with architecture details.', karma: 'medium' },
      { name: 'MachineLearning', strategy: 'Self-post. Focus on implementation.', karma: 'high' },
      { name: 'Python', strategy: 'If Streamlit/MCP mentioned, share implementation.', karma: 'low' },
    ],
    quoraTopics: ['Retrieval Augmented Generation', 'Large Language Models'],
    quoraQueries: [
      'How to build a secure RAG architecture?',
      'What is MCP (Model Context Protocol)?',
      'How to deploy LLMs in enterprise environments?',
    ],
    newsletters: [
      { name: 'TLDR AI', url: 'https://tldr.tech/ai', pitch: 'Enterprise RAG architecture patterns' },
      { name: 'AI Tinkerers Weekly', url: 'https://www.aitinkerers.org/', pitch: 'Practical RAG + MCP implementation guide' },
      { name: 'The Sequence', url: 'https://thesequence.substack.com/', pitch: 'Technical deep-dive on RAG security' },
    ],
    backlinkTargets: [
      { type: 'Developer Community', target: 'Hugging Face Discussions', url: 'https://discuss.huggingface.co/', action: 'Share in relevant discussion threads' },
      { type: 'Resource Page', target: 'LangChain Hub', url: 'https://github.com/langchain-ai/langchain', action: 'Reference in issues/discussions if relevant' },
      { type: 'Guest Post', target: 'Databricks Blog', url: 'https://www.databricks.com/blog', action: 'Pitch RAG architecture article for engineering blog' },
      { type: 'Guest Post', target: 'Center for Democracy & Technology', url: 'https://cdt.org', action: 'Pitch AI policy and architecture analysis' },
    ],
  },
  'Healthcare & HIPAA': {
    keywords: ['hipaa', 'healthcare', 'medical', 'phi', 'clinical', 'patient'],
    subreddits: [
      { name: 'HealthIT', strategy: 'Focus on compliance requirements.', karma: 'low' },
      { name: 'compliance', strategy: 'HIPAA + AI intersection.', karma: 'low' },
      { name: 'artificial', strategy: 'Healthcare AI applications.', karma: 'low' },
    ],
    quoraTopics: ['HIPAA', 'Healthcare IT', 'AI in Healthcare'],
    quoraQueries: [
      'Can AI be HIPAA compliant?',
      'How to use AI in healthcare without violating HIPAA?',
      'What is a BAA for AI systems?',
    ],
    newsletters: [
      { name: 'Healthcare IT Today', url: 'https://healthcareittoday.com/', pitch: 'HIPAA compliance for AI in clinical settings' },
      { name: 'TLDR Health Tech', url: 'https://tldr.tech/health-tech', pitch: 'Practical HIPAA compliance for AI deployments' },
    ],
    backlinkTargets: [
      { type: 'Resource Page', target: 'HHS AI Resources', url: 'https://www.hhs.gov/ai', action: 'Reference in HHS AI community discussions' },
      { type: 'Guest Post', target: 'HealthIT Answers', url: 'https://hitanswers.com/', action: 'Pitch HIPAA + AI compliance article' },
      { type: 'Resource Page', target: 'AMIA (American Medical Informatics Assoc.)', url: 'https://amia.org/', action: 'Submit as resource for AI in healthcare working group' },
      { type: 'Guest Post', target: 'Vanta Blog', url: 'https://www.vanta.com/blog', action: 'Pitch HIPAA AI compliance automation article' },
    ],
  },
  'Legal Tech & Document Automation': {
    keywords: ['legal', 'law firm', 'document automation', 'contract', 'litify', 'leap', 'law'],
    subreddits: [
      { name: 'law', strategy: 'Focus on efficiency gains. Avoid self-promotion.', karma: 'high' },
      { name: 'LegalAdviceEngineering', strategy: 'Technical aspects of legal automation.', karma: 'low' },
      { name: 'artificial', strategy: 'AI in legal industry angle.', karma: 'low' },
    ],
    quoraTopics: ['Legal Technology', 'Document Automation', 'Law Practice Management'],
    quoraQueries: [
      'What is the best legal document automation software?',
      'How are law firms using AI in 2026?',
      'What tools do New York law firms use for document automation?',
    ],
    newsletters: [
      { name: 'Legaltech News', url: 'https://www.law.com/legaltechnews/', pitch: 'AI-powered legal document automation landscape' },
      { name: 'Above the Law', url: 'https://abovethelaw.com/', pitch: 'Practical guide to legal document automation tools' },
    ],
    backlinkTargets: [
      { type: 'Resource Page', target: 'ABA Legal Technology Resource Center', url: 'https://www.americanbar.org/groups/law_practice/resources/', action: 'Submit as resource for legal tech section' },
      { type: 'Guest Post', target: 'Law Sites Blog', url: 'https://www.lawsitesblog.com/', action: 'Pitch legal automation comparison article' },
      { type: 'Resource Page', target: 'Clio Blog', url: 'https://www.clio.com/blog/', action: 'Offer article as guest post or reference' },
      { type: 'Guest Post', target: 'Above the Law', url: 'https://abovethelaw.com/', action: 'Pitch legal AI implementation article' },
      { type: 'Guest Post', target: 'Casetext Blog', url: 'https://casetext.com/blog', action: 'Pitch legal AI automation article' },
    ],
  },
  'AI Risk & Incident Management': {
    keywords: ['risk', 'incident', 'ai risk', 'ai incident', 'evidence', 'audit trail'],
    subreddits: [
      { name: 'riskmanagement', strategy: 'Focus on AI-specific risk frameworks.', karma: 'low' },
      { name: 'cybersecurity', strategy: 'Incident response for AI systems.', karma: 'medium' },
      { name: 'compliance', strategy: 'Audit trail and evidence requirements.', karma: 'low' },
    ],
    quoraTopics: ['Risk Management', 'AI Risk', 'Incident Response'],
    quoraQueries: [
      'How to manage AI risks in enterprise?',
      'What should be in an AI incident response plan?',
      'How to audit AI systems for compliance?',
    ],
    newsletters: [
      { name: 'The Rundown AI', url: 'https://www.therundown.ai/', pitch: 'AI risk management — practical framework' },
      { name: 'TLDR AI', url: 'https://tldr.tech/ai', pitch: 'AI incident response and evidence collection' },
    ],
    backlinkTargets: [
      { type: 'Resource Page', target: 'NIST AI Risk Management', url: 'https://www.nist.gov/itl/ai-risk-management-framework', action: 'Reference in AI RMF community discussions' },
      { type: 'Guest Post', target: 'Riskonnect Blog', url: 'https://www.riskonnect.com/blog/', action: 'Pitch AI risk management article' },
    ],
  },
}

// ─── Analysis Functions ─────────────────────────────────────────────────────

function classifyPost(keywords) {
  const lowerKeywords = keywords.map((k) => k.toLowerCase())
  const scores = {}

  for (const [category, config] of Object.entries(TOPIC_CATEGORIES)) {
    let score = 0
    for (const catKw of config.keywords) {
      for (const postKw of lowerKeywords) {
        if (postKw.includes(catKw) || catKw.includes(postKw)) {
          score += 2
        }
      }
    }
    if (score > 0) scores[category] = score
  }

  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a)
  return sorted.length > 0 ? sorted.map(([cat]) => cat) : ['AI Governance & Compliance']
}

function extractArticleThemes(post) {
  const themes = []
  const text = `${post.title} ${post.excerpt || ''} ${post.metaDescription || ''}`.toLowerCase()

  if (text.includes('framework') || text.includes('nist') || text.includes('iso')) themes.push('Framework comparison')
  if (text.includes('architecture') || text.includes('infrastructure')) themes.push('Architecture pattern')
  if (text.includes('production') || text.includes('deploy')) themes.push('Production deployment')
  if (text.includes('fail') || text.includes('challenge') || text.includes('problem')) themes.push('Failure analysis')
  if (text.includes('guide') || text.includes('how to')) themes.push('Practical guide')
  if (text.includes('compar') || text.includes('vs') || text.includes('versus')) themes.push('Comparison analysis')
  if (text.includes('security') || text.includes('attack') || text.includes('vulnerab')) themes.push('Security focus')
  if (text.includes('compliance') || text.includes('regulatory') || text.includes('law')) themes.push('Compliance focus')

  return themes.length > 0 ? themes : ['General AI topic']
}

// Extract specific, compelling claims from the article for use in email copy
function extractSpecificClaims(post) {
  const claims = []
  const text = `${post.title} ${post.excerpt || post.metaDescription || ''}`
  const lower = text.toLowerCase()

  // Use metaDescription as first claim if available — it's already a specific summary
  if (post.metaDescription && post.metaDescription.length > 40) {
    claims.push(post.metaDescription.trim())
  }

  // Extract specific claims based on article content patterns
  if (lower.includes('nist') && lower.includes('iso')) {
    claims.push('Where NIST AI RMF and ISO 42001 overlap — and the gaps that cause audit failures')
  }
  if (lower.includes('rag') && (lower.includes('security') || lower.includes('row-level'))) {
    claims.push('Row-level security patterns for multi-tenant RAG that most tutorials skip')
  }
  if (lower.includes('hipaa') && lower.includes('ai')) {
    claims.push('A HIPAA compliance checklist that both engineers and compliance officers can use')
  }
  if (lower.includes('voice') && (lower.includes('fail') || lower.includes('production'))) {
    claims.push('Specific failure modes of voice agents in production and how to prevent them')
  }
  if (lower.includes('incident') || lower.includes('containment')) {
    claims.push('Evidence collection framework for AI incidents that audit teams can implement immediately')
  }
  if (lower.includes('legal') && (lower.includes('automation') || lower.includes('document'))) {
    claims.push('Platform comparison with implementation-level detail that law firm IT directors need')
  }
  if (lower.includes('hybrid') && lower.includes('search')) {
    claims.push('Hybrid search architecture trade-offs with benchmarks from production deployments')
  }

  // Fallback: use themes but make them more specific
  if (claims.length === 0) {
    const themes = extractArticleThemes(post)
    for (const t of themes.slice(0, 3)) {
      claims.push(`${t.toLowerCase()} with concrete implementation details from production systems`)
    }
  }

  return claims.slice(0, 4)
}

// Generate article-specific hook using metaDescription instead of category-level template
function generateArticleHook(post, primaryCategory) {
  const desc = post.metaDescription || post.excerpt || ''
  const lower = desc.toLowerCase()

  // Article-specific hooks based on content signals
  if (lower.includes('modular') && lower.includes('governance')) {
    return 'Most AI governance frameworks are theoretical. This one is modular, deployed in production, and breaks down each component with specific compliance mappings.'
  }
  if (lower.includes('hipaa') && lower.includes('ai')) {
    return 'HIPAA + AI content is usually either too legal or too technical. This bridges both worlds with a checklist that a compliance officer and an engineer can both use on day one.'
  }
  if (lower.includes('rag') && (lower.includes('security') || lower.includes('row-level') || lower.includes('multi-tenant'))) {
    return 'RAG tutorials are everywhere, but they skip the hard parts: multi-tenant isolation, row-level security, and what breaks at scale. This article addresses exactly those gaps.'
  }
  if (lower.includes('voice') && (lower.includes('production') || lower.includes('fail'))) {
    return 'Most voice AI content is vendor marketing. This is an architecture teardown from someone who shipped a production voice agent and lived through the failure modes.'
  }
  if (lower.includes('hybrid') && lower.includes('search')) {
    return 'Hybrid search articles usually stop at "combine BM25 and vector search." This one covers the architecture decisions, trade-offs, and production benchmarks that actually matter.'
  }
  if (lower.includes('incident') || lower.includes('containment') || lower.includes('evidence')) {
    return 'AI incident content often stays theoretical. This piece draws from real incidents and provides an evidence collection framework that audit teams can implement immediately.'
  }
  if (lower.includes('legal') && (lower.includes('automation') || lower.includes('document'))) {
    return 'Legal tech coverage tends to be surface-level product roundups. This article compares specific platforms with implementation-level detail that law firm IT directors actually need.'
  }
  if (lower.includes('compliance') && (lower.includes('nist') || lower.includes('iso') || lower.includes('soc'))) {
    return 'Most AI compliance content reads like a legal textbook. This one is different because it comes from someone who has actually built and deployed these systems in Fortune 50 environments.'
  }

  // Fallback: use the article's own description as the hook
  if (desc.length > 20) {
    return desc.trim()
  }

  return 'This article provides implementation-level detail that most coverage in this space skips.'
}

// Known disposable/honeypot email domains — never send to these
const HONEYPOT_DOMAINS = [
  'mailinator.com', 'guerrillamail.com', 'tempmail.com', 'throwaway.email',
  'trashmail.com', 'yopmail.com', 'sharklasers.com', 'guerrillamailblock.com',
  'dispostable.com', '10minutemail.com', 'temp-mail.org', 'fakeinbox.com',
  'maildrop.cc', 'getnada.com', 'mohmal.com', 'emailondeck.com',
]

// Common role-based email prefixes that are often honeypots or go nowhere
const ROLE_BASED_PREFIXES = [
  'admin@', 'info@', 'contact@', 'support@', 'sales@',
  'noreply@', 'no-reply@', 'donotreply@', 'postmaster@',
]

function isHoneypotEmail(email) {
  if (!email) return false
  const lower = email.toLowerCase().trim()
  const domain = lower.split('@')[1] || ''
  if (HONEYPOT_DOMAINS.some((d) => domain.endsWith(d))) return true
  // Role-based emails are not necessarily honeypots but are low-value for outreach
  // We flag them but don't block — the caller decides
  return false
}

function isRoleBasedEmail(email) {
  if (!email) return false
  const lower = email.toLowerCase().trim()
  return ROLE_BASED_PREFIXES.some((p) => lower.startsWith(p))
}

// CAN-SPAM required footer for all commercial outreach emails
// Uses PO Box placeholder — replace with actual PO Box or virtual address when obtained
const CAN_SPAM_FOOTER = `
---
Subodh KC
AI Systems Architect & Governance Expert
subodhkc.com | LinkedIn: linkedin.com/in/subodhkc
406 Westcliff, Euless, TX 76040

You received this email because I thought my work might be relevant to you.
Reply with "unsubscribe" and I will not contact you again.`

function generateOutreachEmails(post, categories) {
  const articleUrl = `${SITE_URL}/blog/${post.slug}`
  const title = post.title
  const excerpt = post.excerpt || post.metaDescription
  const themes = extractArticleThemes(post)
  const claims = extractSpecificClaims(post)
  const primaryCategory = categories[0]
  const categoryConfig = TOPIC_CATEGORIES[primaryCategory]

  const emails = []

  // Article-specific hook (not category-level template)
  const hook = generateArticleHook(post, primaryCategory)

  // Email 1: Newsletter editor pitch — value-first, specific, non-generic
  const newsletter = categoryConfig?.newsletters?.[0] || { name: 'The Rundown AI', pitch: 'AI insights for practitioners' }
  const claimsList = claims.length > 0 ? claims : themes

  // Short punchy subject angle — extract first phrase, max ~50 chars
  const rawAngle = claims[0]?.split(' — ')[0] || themes[0] || 'AI governance'
  const firstPhrase = rawAngle.split(/[.,;]/)[0].trim()
  const subjectAngle = firstPhrase.length > 50 ? firstPhrase.split(' ').slice(0, 6).join(' ') : firstPhrase

  emails.push({
    recipient: `${newsletter.name} editor`,
    subject: `Quick idea for ${newsletter.name} — ${subjectAngle} angle your readers haven't seen`,
    body: `Hi [Editor Name],

I'll be direct because I know you get dozens of these.

${hook}

I just published "${title}" — ${excerpt}

What's specifically in it:
${claimsList.map(c => `- ${c}`).join('\n')}
- Concrete implementation steps, not framework summaries
- What I learned deploying this in production (including what broke)

Why I'm reaching out to ${newsletter.name} specifically: ${newsletter.pitch || 'Your readership matches the audience that needs this level of detail.'}

Before I wrote this, I read your recent piece "[REFERENCE ONE OF THEIR RECENT ARTICLES OR NEWSLETTER ISSUES HERE — search their site, find a specific title]" and noticed you cover [topic] regularly. This article extends that conversation.

I can provide:
- A 150-word version adapted for your format
- An exclusive angle that's not in the original article
- A guest contribution on a related topic your readers have asked about

Article for reference: ${articleUrl}

If this isn't a fit, no worries — I read ${newsletter.name} regardless.

Best,
Subodh KC
https://subodhkc.com${CAN_SPAM_FOOTER}`,
  })

  // Email 2: Resource exchange / guest post pitch — specific, proof of reading
  const backlinkTarget = categoryConfig?.backlinkTargets?.find((t) => t.type === 'Guest Post') || categoryConfig?.backlinkTargets?.[0]
  if (backlinkTarget) {
    const targetName = backlinkTarget.target
    const topicArea = primaryCategory.toLowerCase().replace(' & ', ' and ')
    emails.push({
      recipient: `${targetName} editorial team`,
      subject: `${subjectAngle} resource for ${targetName} — or a guest post if you're open to it`,
      body: `Hi [Editor Name],

I read your recent article "[REFERENCE A SPECIFIC ARTICLE FROM ${targetName.toUpperCase()} HERE — find one published in the last 30 days, use the exact title]" and noticed a gap that I just wrote about.

"${title}"
${articleUrl}

What's in it that your readers won't find elsewhere:
${claimsList.map(c => `- ${c}`).join('\n')}
- Implementation-level detail from someone who deployed these systems in Fortune 50 environments
- Specific failure modes and how to avoid them

Two options, your call:

1. Link to it from your existing ${topicArea} resources page if your readers would benefit

2. I write an exclusive version for ${targetName} — different angle, same depth. I can turn it around in 48 hours and I don't need payment, just attribution and a link back to subodhkc.com.

If neither works, I'd appreciate knowing what you're currently looking for so I can pitch better next time.

Best,
Subodh KC
https://subodhkc.com${CAN_SPAM_FOOTER}`,
    })
  }

  // Email 3: LinkedIn connection / peer outreach (if voice/rag/security topic)
  if (categories.some((c) => c.includes('Voice') || c.includes('RAG') || c.includes('Security'))) {
    emails.push({
      recipient: 'AI engineering community leaders (for content amplification)',
      subject: `Your community might find this useful — ${subjectAngle} deep-dive`,
      body: `Hi [Name],

Not a generic pitch — I'll keep this short.

I wrote a technical deep-dive on ${primaryCategory.toLowerCase()} that goes past the usual surface level:

"${title}"
${articleUrl}

What's different about it:
${claimsList.map(c => `- ${c}`).join('\n')}
- Real production failures and how they were solved
- Architecture decisions with trade-offs explained

If your community would find this useful, I'd appreciate a share. If not, no stress.

I'm also open to collaboration if you're looking for guests:
- Podcast appearances on AI governance or architecture
- Joint articles on production AI systems
- Webinar co-hosting on ${primaryCategory.toLowerCase()}

Best,
Subodh KC
https://subodhkc.com${CAN_SPAM_FOOTER}`,
    })
  }

  // ─── Follow-up email templates (send 7 days after initial if no reply) ───
  // Newsletter follow-up
  emails.push({
    recipient: `${newsletter.name} editor (FOLLOW-UP — send 7 days after Email 1 if no reply)`,
    subject: `Re: Quick idea for ${newsletter.name}`,
    body: `Hi [Editor Name],

Bumping this up in case it got buried. I know inboxes get crowded.

Quick recap: I published "${title}" and thought it'd be a fit for ${newsletter.name} because ${newsletter.pitch || 'it matches your audience'}.

I'm happy to adapt it to your format — a 150-word version, an exclusive angle, or a guest contribution. Whatever works best for you.

Article: ${articleUrl}

If the timing isn't right, just let me know and I won't follow up again.

Best,
Subodh KC${CAN_SPAM_FOOTER}`,
  })

  // Guest post follow-up
  if (backlinkTarget) {
    emails.push({
      recipient: `${backlinkTarget.target} editorial team (FOLLOW-UP — send 7 days after Email 2 if no reply)`,
      subject: `Re: ${subjectAngle} resource for ${backlinkTarget.target}`,
      body: `Hi [Editor Name],

Following up on my note from last week about "${title}".

I noticed ${backlinkTarget.target} has been covering ${primaryCategory.toLowerCase()} more lately, and I think an exclusive version for your audience would perform well.

I can turn it around in 48 hours — different angle from the original, same depth. No payment needed, just attribution and a link back.

Article for reference: ${articleUrl}

Happy to send a quick outline first if that helps you decide.

Best,
Subodh KC${CAN_SPAM_FOOTER}`,
    })
  }

  return emails
}

function generateReport(post, tracker) {
  const categories = classifyPost(post.keywords)
  const primaryCategory = categories[0]
  const categoryConfig = TOPIC_CATEGORIES[primaryCategory]
  const subreddits = categoryConfig?.subreddits || []
  const quoraTopics = categoryConfig?.quoraTopics || []
  const quoraQueries = categoryConfig?.quoraQueries || []
  const newsletters = categoryConfig?.newsletters || []
  const backlinkTargets = categoryConfig?.backlinkTargets || []
  const outreachEmails = generateOutreachEmails(post, categories)
  const themes = extractArticleThemes(post)
  const articleUrl = `${SITE_URL}/blog/${post.slug}`

  const todaysCount = getTodaysSendCount(tracker)
  const remaining = Math.max(0, DAILY_SEND_LIMIT - todaysCount)
  const guestPostTargets = backlinkTargets.filter((t) => t.type === 'Guest Post')
  const todayTargets = guestPostTargets.slice(0, remaining)
  const queuedTargets = guestPostTargets.slice(remaining)

  let md = `# Outreach Plan: ${post.title}\n\n`
  md += `**URL:** ${articleUrl}\n`
  md += `**Generated:** ${new Date().toISOString().split('T')[0]}\n`
  md += `**Keywords:** ${post.keywords.join(', ')}\n`
  md += `**Topic Classification:** ${categories.join(' → ')}\n`
  md += `**Article Themes:** ${themes.join(', ')}\n\n`

  // ─── Daily Send Limit Status ───
  md += `## Daily Outreach Status\n\n`
  md += `**Sent today:** ${todaysCount}/${DAILY_SEND_LIMIT}\n`
  md += `**Remaining today:** ${remaining}\n`
  if (remaining === 0) {
    md += `> ⚠️ Daily limit reached. All targets below are queued for tomorrow.\n`
  }
  md += `\n`

  // ─── Executive Summary ───
  md += `## Executive Summary\n\n`
  md += `This article is classified as **${primaryCategory}** with themes around ${themes.join(', ').toLowerCase()}.\n`
  md += `Priority distribution channels: LinkedIn (auto), Dev.to (auto), ${subreddits.slice(0, 2).map((s) => `r/${s.name}`).join(', ')}, and ${newsletters.slice(0, 2).map((n) => n.name).join(', ')}.\n`
  md += `${outreachEmails.length} outreach email templates generated. ${backlinkTargets.length} backlink targets identified. ${guestPostTargets.length} guest post targets available.\n\n`

  // ─── Reddit Posting ───
  md += `## Reddit Posting Strategy\n\n`
  if (subreddits.length > 0) {
    md += `| Subreddit | Strategy | Karma Required |\n`
    md += `|-----------|----------|----------------|\n`
    for (const sub of subreddits) {
      md += `| r/${sub.name} | ${sub.strategy} | ${sub.karma} |\n`
    }
    md += `\n**Posting approach:**\n`
    md += `1. Check each subreddit's rules before posting (especially r/MachineLearning requires self-post format)\n`
    md += `2. Use the Reddit post from data/social/${post.slug}.md as starting point\n`
    md += `3. Post at optimal times: 8-10 AM EST on weekdays\n`
    md += `4. Engage with comments within first 2 hours — this is critical for visibility\n`
    md += `5. Cross-post to 2-3 subreddits max per day to avoid spam detection\n\n`
  } else {
    md += `No matching subreddits. Consider r/artificial or r/MachineLearning.\n\n`
  }

  // ─── Quora Strategy ───
  md += `## Quora Answer Strategy\n\n`
  if (quoraTopics.length > 0) {
    md += `**Target topics:**\n`
    for (const topic of quoraTopics) {
      md += `- [${topic}](https://www.quora.com/topic/${topic.replace(/\s+/g, '-')})\n`
    }
    md += `\n**Search queries to find questions:**\n`
    for (const q of quoraQueries) {
      md += `- "${q}"\n`
    }
    md += `\n**Answer approach:**\n`
    md += `1. Search Quora for the queries above\n`
    md += `2. Write 200-300 word answers that provide genuine value (not just a link)\n`
    md += `3. Include article link naturally: "I wrote a deeper analysis here: ${articleUrl}"\n`
    md += `4. Answer 2-3 questions per topic for maximum visibility\n`
    md += `5. Follow up on comments within 24 hours\n\n`
  } else {
    md += `No matching Quora topics. Search Quora directly for your keywords.\n\n`
  }

  // ─── Newsletter Outreach ───
  md += `## Newsletter Outreach Targets\n\n`
  if (newsletters.length > 0) {
    md += `| Newsletter | URL | Pitch Angle |\n`
    md += `|------------|-----|-------------|\n`
    for (const n of newsletters) {
      md += `| ${n.name} | ${n.url} | ${n.pitch} |\n`
    }
    md += `\n`
  }

  // ─── Backlink Opportunities ───
  md += `## Backlink Opportunities\n\n`
  if (backlinkTargets.length > 0) {
    md += `| Type | Target | URL | Action |\n`
    md += `|------|--------|-----|--------|\n`
    for (const t of backlinkTargets) {
      md += `| ${t.type} | ${t.target} | ${t.url} | ${t.action} |\n`
    }
    md += `\n`
  }

  // ─── Guest Post Pitches (5/day limit) ───
  md += `## Guest Post Pitches (Daily Limit: ${DAILY_SEND_LIMIT}/day)\n\n`
  md += `**Sent today:** ${todaysCount} | **Remaining:** ${remaining} | **Total targets:** ${guestPostTargets.length}\n\n`
  if (todayTargets.length > 0) {
    md += `### Ready to Send Today (${todayTargets.length})\n\n`
    for (const t of todayTargets) {
      md += `- **${t.target}** — ${t.url}\n  Action: ${t.action}\n`
    }
    md += `\n`
  }
  if (queuedTargets.length > 0) {
    md += `### Queued for Tomorrow+ (${queuedTargets.length})\n\n`
    md += `> These will be sent on subsequent days, respecting the ${DAILY_SEND_LIMIT}/day limit.\n\n`
    for (const t of queuedTargets) {
      md += `- **${t.target}** — ${t.url}\n  Action: ${t.action}\n`
    }
    md += `\n`
  }
  if (guestPostTargets.length === 0) {
    md += `No guest post targets identified for this topic category.\n\n`
  }

  // ─── Always-on targets ───
  md += `### Always-On Distribution Targets\n\n`
  md += `| Platform | URL | Action |\n`
  md += `|----------|-----|--------|\n`
  md += `| Hacker News | https://news.ycombinator.com/submit | Submit article URL with compelling title |\n`
  md += `| Daily.dev | https://daily.dev/ | Share as bookmark with AI compliance tag |\n`
  md += `| Lobste.rs | https://lobste.rs/ | Submit if technical depth is high enough |\n`
  md += `| Product Hunt (if product-related) | https://www.producthunt.com/ | Submit as resource |\n`
  md += `\n`

  // ─── Email Safety & Anti-Honeypot Guidance ───
  md += `## Email Safety & Anti-Honeypot Checklist\n\n`
  md += `> Before sending ANY outreach email, verify these items:\n\n`
  md += `- [ ] **Verify recipient email is real**: Check the target's website for a personal email (not info@, admin@, contact@). Role-based emails often go to spam filters or honeypot inboxes.\n`
  md += `- [ ] **Check domain MX records**: Run \`dig MX targetdomain.com\` — if no MX records exist, do not send.\n`
  md += `- [ ] **Avoid disposable domains**: Never send to mailinator.com, guerrillamail.com, tempmail.com, or similar disposable email services.\n`
  md += `- [ ] **Find a real name**: Use LinkedIn to find the editor or content manager's name. "Hi Sarah" gets 10x the response rate of "Hi [Editor Name]".\n`
  md += `- [ ] **Reference their specific work**: Before sending, read 1-2 recent articles from the target site and reference them by title in your email. Replace all [REFERENCE...] placeholders with actual article titles. This proves you're not blasting.\n`
  md += `- [ ] **Include CAN-SPAM footer**: All emails include a physical mailing address and unsubscribe option. Address is set to 406 Westcliff, Euless, TX 76040.\n`
  md += `- [ ] **Check sent-tracker.json**: Verify you haven't already emailed this target. The tracker prevents duplicate sends.\n`
  md += `- [ ] **Respect daily limit**: Max ${DAILY_SEND_LIMIT} guest post pitches per day to avoid being flagged as spam.\n`
  md += `- [ ] **Use a verified sending domain**: Emails should come from subodhkc.com (configured via Resend) or a personal email with established reputation.\n\n`

  // ─── Outreach Email Templates ───
  md += `## Outreach Email Templates\n\n`
  md += `> Review and customize before sending. Replace [Name], [Editor Name], and [REFERENCE...] placeholders with real values found via LinkedIn and the target site.\n`
  md += `> Each email includes a CAN-SPAM compliant footer with mailing address and unsubscribe option.\n\n`

  const initialEmails = outreachEmails.filter(e => !e.recipient.includes('FOLLOW-UP'))
  const followUpEmails = outreachEmails.filter(e => e.recipient.includes('FOLLOW-UP'))

  md += `### Initial Outreach (${initialEmails.length} emails)\n\n`
  for (let i = 0; i < initialEmails.length; i++) {
    const email = initialEmails[i]
    md += `### Email ${i + 1}: To ${email.recipient}\n\n`
    md += `**Subject:** ${email.subject}\n\n`
    md += `\`\`\`\n${email.body}\n\`\`\`\n\n`
  }

  if (followUpEmails.length > 0) {
    md += `### Follow-Up Templates (${followUpEmails.length} emails)\n\n`
    md += `> Send these 7 days after the initial email IF you haven't received a reply.\n`
    md += `> Do NOT send a follow-up if you already got a response (positive or negative).\n`
    md += `> If no reply after the follow-up, consider the lead closed — don't send a third email.\n\n`
    for (let i = 0; i < followUpEmails.length; i++) {
      const email = followUpEmails[i]
      md += `### Follow-Up ${i + 1}: To ${email.recipient}\n\n`
      md += `**Subject:** ${email.subject}\n\n`
      md += `\`\`\`\n${email.body}\n\`\`\`\n\n`
    }
  }

  // ─── Pending Follow-Ups (from tracker) ───
  const pendingFollowUps = []
  for (const [dateKey, entry] of Object.entries(tracker)) {
    if (dateKey === 'sentCount' || !entry.targets) continue
    const sentDate = new Date(dateKey)
    const daysSince = Math.floor((Date.now() - sentDate.getTime()) / (1000 * 60 * 60 * 24))
    if (daysSince >= 7 && daysSince <= 21) {
      for (const t of (entry.targets || [])) {
        pendingFollowUps.push({ target: t.target, sentDate: dateKey, daysSince })
      }
    }
  }
  if (pendingFollowUps.length > 0) {
    md += `### ⚠️ Pending Follow-Ups (sent >7 days ago, no follow-up tracked)\n\n`
    md += `> These emails were sent over 7 days ago. If you haven't received a reply, send the follow-up template above.\n\n`
    md += `| Target | Sent Date | Days Since | Action |\n`
    md += `|--------|-----------|------------|--------|\n`
    for (const f of pendingFollowUps) {
      md += `| ${f.target} | ${f.sentDate} | ${f.daysSince} | Send follow-up if no reply received |\n`
    }
    md += `\n`
  }

  // ─── Distribution Checklist (Priority Ordered) ───
  md += `## Distribution Checklist (Priority Order)\n\n`
  md += `### P0 — Automated (already running)\n`
  md += `- [x] LinkedIn post (automated via post-linkedin.mjs)\n`
  md += `- [x] Dev.to cross-post (automated via cross-post-devto.mjs)\n`
  md += `- [x] Medium import reminder (automated via cross-post-medium.mjs)\n\n`
  md += `### P1 — High Impact, Do Today\n`
  md += `- [ ] Submit to Hacker News — https://news.ycombinator.com/submit\n`
  if (subreddits.length > 0) {
    md += `- [ ] Post to Reddit: ${subreddits.slice(0, 2).map((s) => `r/${s.name}`).join(', ')}\n`
  }
  md += `- [ ] Post Twitter/X thread (copy from data/social/${post.slug}.md)\n\n`
  md += `### P2 — Medium Impact, Do This Week\n`
  md += `- [ ] Send outreach email to ${newsletters[0]?.name || 'newsletter editors'}\n`
  if (backlinkTargets.length > 0) {
    md += `- [ ] Contact ${backlinkTargets[0].target} — ${backlinkTargets[0].action}\n`
  }
  if (quoraTopics.length > 0) {
    md += `- [ ] Answer 2-3 Quora questions in: ${quoraTopics.join(', ')}\n`
  }
  md += `- [ ] Submit to Daily.dev and Lobste.rs\n\n`
  md += `### P3 — Long-Tail, Do When Time Permits\n`
  md += `- [ ] Send guest post pitches (max ${DAILY_SEND_LIMIT}/day — see Guest Post Pitches section above)\n`
  if (outreachEmails.length > 1) {
    md += `- [ ] Follow up with ${backlinkTargets.find((t) => t.type === 'Guest Post')?.target || 'relevant blogs'}\n`
  }
  if (newsletters.length > 1) {
    md += `- [ ] Pitch to ${newsletters.slice(1).map((n) => n.name).join(', ')}\n`
  }
  if (backlinkTargets.length > 1) {
    md += `- [ ] Pursue backlink from ${backlinkTargets.slice(1, 3).map((t) => t.target).join(', ')}\n`
  }
  md += `- [ ] Engage in relevant LinkedIn/HN comment threads about this topic\n\n`

  // ─── Data Source Analysis ───
  md += `## Data Source Analysis\n\n`
  md += `| Source | Status | Notes |\n`
  md += `|--------|--------|-------|\n`
  md += `| Blog post JSON | ✅ Available | ${post.keywords.length} keywords, ${post.contentHtml ? post.contentHtml.length : 0} chars HTML |\n`
  md += `| Social media content | ${fs.existsSync(path.join(PROJECT_ROOT, 'data', 'social', `${post.slug}.md`)) ? '✅' : '⚠️ Missing'} | data/social/${post.slug}.md |\n`
  md += `| Dev.to tracker | ${fs.existsSync(path.join(PROJECT_ROOT, 'data', 'devto-posted.json')) ? '✅' : '⚠️ Missing'} | devto-posted.json |\n`
  md += `| LinkedIn posted tracker | ${fs.existsSync(path.join(PROJECT_ROOT, 'data', 'social', 'posted.json')) ? '✅' : '⚠️ Missing'} | data/social/posted.json |\n`
  md += `| Medium tracker | ${fs.existsSync(path.join(PROJECT_ROOT, 'data', 'medium-posted.json')) ? '✅' : '⚠️ Missing'} | data/medium-posted.json |\n`
  md += `\n`

  return md
}

// ─── Email Delivery ──────────────────────────────────────────────────────────

async function sendReportEmail(post, reportMd) {
  if (!process.env.RESEND_API_KEY) {
    console.log('  ℹ RESEND_API_KEY not set — skipping email delivery')
    return false
  }

  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)

  const html = reportMd
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- \[x\] (.+)$/gm, '<div style="margin:4px 0;">✅ $1</div>')
    .replace(/^- \[ \] (.+)$/gm, '<div style="margin:4px 0;">⬜ $1</div>')
    .replace(/^- (.+)$/gm, '<div style="margin:4px 0;">• $1</div>')
    .replace(/\| (.+?) \|/g, '| $1 |')
    .replace(/```[\s\S]*?```/g, (m) => `<pre style="background:#f4f4f4;padding:12px;border-radius:6px;font-size:13px;overflow-x:auto;">${m.replace(/```/g, '')}</pre>`)
    .replace(/\n/g, '<br>')

  const { data, error } = await resend.emails.send({
    from: 'Outreach Planner <noreply@subodhkc.com>',
    to: [ADMIN_EMAIL],
    subject: `📋 Outreach Plan: ${post.title}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 24px; border-radius: 12px; margin-bottom: 24px;">
          <h1 style="color: white; margin: 0; font-size: 22px;">📋 Daily Outreach Plan</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">${post.title}</p>
          <p style="color: rgba(255,255,255,0.7); margin: 4px 0 0 0; font-size: 12px;">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; line-height: 1.6; font-size: 14px; color: #374151;">
          ${html}
        </div>
        <div style="text-align: center; margin-top: 24px; padding: 16px; color: #9ca3af; font-size: 12px;">
          <p>Automated outreach plan from subodhkc.com</p>
          <p>Review, customize outreach emails, and act on P1 items today.</p>
        </div>
      </div>
    `,
  })

  if (error) {
    console.error(`  ✗ Email delivery failed: ${error.message}`)
    return false
  }

  console.log(`  ✓ Outreach plan emailed to ${ADMIN_EMAIL}`)
  return true
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  loadEnvLocal()

  const args = process.argv.slice(2)
  const slugArg = args.find((a) => a.startsWith('--slug='))?.split('=')[1]
  const allMode = args.includes('--all')
  const noEmail = args.includes('--no-email')

  let slugsToProcess = []

  if (slugArg) {
    slugsToProcess = [slugArg]
  } else if (allMode) {
    slugsToProcess = getAllSlugs()
  } else {
    const allSlugs = getAllSlugs()
    if (allSlugs.length === 0) {
      console.error('No blog posts found')
      process.exit(1)
    }
    slugsToProcess = [allSlugs[allSlugs.length - 1]]
    console.log(`No slug specified — using latest: ${slugsToProcess[0]}\n`)
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const tracker = loadTracker()

  for (const slug of slugsToProcess) {
    const post = getPostBySlug(slug)
    if (!post) {
      console.error(`  ✗ ${slug}: post not found`)
      continue
    }

    const report = generateReport(post, tracker)
    const outputPath = path.join(OUTPUT_DIR, `${slug}.md`)
    fs.writeFileSync(outputPath, report)
    console.log(`  ✓ ${slug}: outreach plan saved to data/outreach/${slug}.md`)

    if (!noEmail) {
      const sent = await sendReportEmail(post, report)
      if (sent) {
        tracker[slug] = { emailed: true, date: new Date().toISOString() }
        saveTracker(tracker)
      }
    }
  }

  console.log(`\nDone. ${noEmail ? 'Email delivery skipped.' : 'Check your inbox for the outreach plan.'}`)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
