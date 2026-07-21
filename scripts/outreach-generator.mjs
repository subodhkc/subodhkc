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

function generateOutreachEmails(post, categories) {
  const articleUrl = `${SITE_URL}/blog/${post.slug}`
  const title = post.title
  const excerpt = post.excerpt || post.metaDescription
  const themes = extractArticleThemes(post)
  const primaryCategory = categories[0]
  const categoryConfig = TOPIC_CATEGORIES[primaryCategory]

  const emails = []

  // Email 1: Newsletter editor pitch — customized per category
  const newsletter = categoryConfig?.newsletters?.[0] || { name: 'The Rundown AI', pitch: 'AI insights for practitioners' }
  emails.push({
    recipient: `${newsletter.name} editor`,
    subject: `Article pitch: ${title}`,
    body: `Hi [Editor Name],

I'm Subodh KC — former Fortune 50 AI Strategy CTL, now building AI governance tools at subodhkc.com.

I just published "${title}" and think it would resonate with ${newsletter.name} readers.

What makes it different:
- ${themes.join('\n- ')}
- Written from implementation experience, not theory
- ${excerpt}

The article: ${articleUrl}

${newsletter.pitch ? `Why it fits ${newsletter.name}: ${newsletter.pitch}` : ''}

Happy to provide a 100-word summary, exclusive angle, or adapted version for your newsletter.

Best,
Subodh KC
https://subodhkc.com
https://linkedin.com/in/subodhkc`,
  })

  // Email 2: Resource exchange / guest post pitch
  const backlinkTarget = categoryConfig?.backlinkTargets?.find((t) => t.type === 'Guest Post') || categoryConfig?.backlinkTargets?.[0]
  if (backlinkTarget) {
    emails.push({
      recipient: `${backlinkTarget.target} editorial team`,
      subject: `Resource suggestion / guest post: ${title}`,
      body: `Hi [Editor Name],

I've been following ${backlinkTarget.target} and noticed your coverage of ${primaryCategory.toLowerCase().replace(' & ', ' and ')} topics.

I've put together a comprehensive resource that might complement your existing content:

"${title}"
${articleUrl}

What it covers:
- ${themes.join('\n- ')}
- Practical, enterprise-grade guidance from someone who's implemented these systems

Two ways I can help:
1. Would you consider linking to it from your resources/guides page?
2. I'm available for guest contributions — I can adapt the content into an exclusive piece for ${backlinkTarget.target} if you're accepting submissions.

${backlinkTarget.action}

Best,
Subodh KC
AI Systems Architect & Governance Expert
https://subodhkc.com
https://linkedin.com/in/subodhkc`,
    })
  }

  // Email 3: LinkedIn connection / peer outreach (if voice/rag/security topic)
  if (categories.some((c) => c.includes('Voice') || c.includes('RAG') || c.includes('Security'))) {
    emails.push({
      recipient: 'AI engineering community leaders (for content amplification)',
      subject: `Sharing implementation deep-dive: ${title}`,
      body: `Hi [Name],

I'm Subodh KC, AI Systems Architect. I just published a technical deep-dive that your community might find useful:

"${title}"
${articleUrl}

Key themes:
- ${themes.join('\n- ')}
- Real production challenges and how to solve them

I'd appreciate it if you could share it with your network or community if you find it valuable. Happy to reciprocate — I share useful content from my connections regularly.

Also open to collaboration: podcast appearances, joint articles, or co-hosting a webinar on ${primaryCategory.toLowerCase()}.

Best,
Subodh KC
https://subodhkc.com
https://linkedin.com/in/subodhkc`,
    })
  }

  return emails
}

function generateReport(post) {
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

  let md = `# Outreach Plan: ${post.title}\n\n`
  md += `**URL:** ${articleUrl}\n`
  md += `**Generated:** ${new Date().toISOString().split('T')[0]}\n`
  md += `**Keywords:** ${post.keywords.join(', ')}\n`
  md += `**Topic Classification:** ${categories.join(' → ')}\n`
  md += `**Article Themes:** ${themes.join(', ')}\n\n`

  // ─── Executive Summary ───
  md += `## Executive Summary\n\n`
  md += `This article is classified as **${primaryCategory}** with themes around ${themes.join(', ').toLowerCase()}.\n`
  md += `Priority distribution channels: LinkedIn (auto), Dev.to (auto), ${subreddits.slice(0, 2).map((s) => `r/${s.name}`).join(', ')}, and ${newsletters.slice(0, 2).map((n) => n.name).join(', ')}.\n`
  md += `${outreachEmails.length} outreach email templates generated. ${backlinkTargets.length} backlink targets identified.\n\n`

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

  // ─── Always-on targets ───
  md += `### Always-On Distribution Targets\n\n`
  md += `| Platform | URL | Action |\n`
  md += `|----------|-----|--------|\n`
  md += `| Hacker News | https://news.ycombinator.com/submit | Submit article URL with compelling title |\n`
  md += `| Daily.dev | https://daily.dev/ | Share as bookmark with AI compliance tag |\n`
  md += `| Lobste.rs | https://lobste.rs/ | Submit if technical depth is high enough |\n`
  md += `| Product Hunt (if product-related) | https://www.producthunt.com/ | Submit as resource |\n`
  md += `\n`

  // ─── Outreach Email Templates ───
  md += `## Outreach Email Templates\n\n`
  md += `> Review and customize before sending. Replace [Name], [Editor Name], etc. with real names.\n\n`
  for (let i = 0; i < outreachEmails.length; i++) {
    const email = outreachEmails[i]
    md += `### Email ${i + 1}: To ${email.recipient}\n\n`
    md += `**Subject:** ${email.subject}\n\n`
    md += `\`\`\`\n${email.body}\n\`\`\`\n\n`
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
  if (outreachEmails.length > 1) {
    md += `- [ ] Send guest post pitch to ${backlinkTargets.find((t) => t.type === 'Guest Post')?.target || 'relevant blogs'}\n`
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

    const report = generateReport(post)
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
