#!/usr/bin/env node

/**
 * outreach-generator.mjs — Generate outreach opportunities for each blog post.
 *
 * For each article, this script:
 * 1. Identifies Quora questions to answer (based on keywords)
 * 2. Identifies Reddit subreddits to post in
 * 3. Identifies backlink targets (compliance guides, resource pages)
 * 4. Generates personalized outreach email templates
 * 5. Outputs a markdown report with actionable next steps
 *
 * Usage:
 *   node scripts/outreach-generator.mjs --slug=<slug>   # Generate for specific article
 *   node scripts/outreach-generator.mjs                 # Generate for latest article
 *   node scripts/outreach-generator.mjs --all           # Generate for all articles
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
const SITE_URL = 'https://subodhkc.com'

function getAllSlugs() {
  if (!fs.existsSync(POSTS_DIR)) return []
  return fs.readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''))
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

const SUBREDDIT_MAP = {
  'AI governance': ['MachineLearning', 'artificial', 'EnterpriseAI', 'AIethics'],
  'AI compliance': ['compliance', 'MachineLearning', 'artificial', 'cybersecurity'],
  'AI security': ['cybersecurity', 'netsec', 'MachineLearning'],
  'enterprise AI': ['EnterpriseAI', 'MachineLearning', 'artificial'],
  'RAG': ['MachineLearning', 'LocalLLaMA', 'artificial'],
  'voice agent': ['VoiceAI', 'artificial', 'MachineLearning'],
  'compliance': ['compliance', 'regulatory', 'cybersecurity'],
  'EU AI Act': ['artificial', 'EU_Law', 'AIethics'],
  'GDPR': ['privacy', 'gdpr', 'compliance'],
  'NIST': ['cybersecurity', 'compliance', 'riskmanagement'],
  'SOC 2': ['compliance', 'cybersecurity', 'SaaS'],
  'prompt injection': ['MachineLearning', 'cybersecurity', 'AIethics'],
  'hallucination': ['MachineLearning', 'artificial', 'AIethics'],
  'LLM': ['LocalLLaMA', 'MachineLearning', 'artificial'],
  'Streamlit': ['Python', 'datascience', 'MachineLearning'],
  'MCP': ['MachineLearning', 'artificial', 'APIs'],
}

const QUORA_TOPIC_MAP = {
  'AI governance': 'AI Governance',
  'AI compliance': 'AI Compliance',
  'AI security': 'AI Security',
  'enterprise AI': 'Enterprise AI',
  'RAG': 'Retrieval Augmented Generation',
  'voice agent': 'AI Voice Agents',
  'compliance': 'Regulatory Compliance',
  'EU AI Act': 'EU AI Act',
  'GDPR': 'GDPR',
  'NIST': 'NIST Cybersecurity Framework',
  'SOC 2': 'SOC 2 Compliance',
  'prompt injection': 'Prompt Injection AI',
  'hallucination': 'AI Hallucinations',
  'LLM': 'Large Language Models',
}

function findSubreddits(keywords) {
  const subreddits = new Set()
  for (const kw of keywords) {
    const lower = kw.toLowerCase()
    for (const [match, subs] of Object.entries(SUBREDDIT_MAP)) {
      if (lower.includes(match.toLowerCase())) {
        subs.forEach((s) => subreddits.add(s))
      }
    }
  }
  return [...subreddits].slice(0, 5)
}

function findQuoraTopics(keywords) {
  const topics = new Set()
  for (const kw of keywords) {
    const lower = kw.toLowerCase()
    for (const [match, topic] of Object.entries(QUORA_TOPIC_MAP)) {
      if (lower.includes(match.toLowerCase())) {
        topics.add(topic)
      }
    }
  }
  return [...topics].slice(0, 3)
}

function generateBacklinkTargets(post) {
  const targets = []

  if (post.keywords.some((k) => k.toLowerCase().includes('eu ai act'))) {
    targets.push({
      type: 'Resource Page',
      target: 'AI law firms and compliance consultancies',
      action: 'Email outreach offering your EU AI Act guide as a resource',
      url: `${SITE_URL}/guides/eu-ai-act`,
    })
  }

  if (post.keywords.some((k) => k.toLowerCase().includes('nyc') || k.toLowerCase().includes('local law 144'))) {
    targets.push({
      type: 'Resource Page',
      target: 'HR tech companies and employment law blogs',
      action: 'Offer NYC LL144 guide as a reference resource',
      url: `${SITE_URL}/guides/nyc-local-law-144`,
    })
  }

  if (post.keywords.some((k) => k.toLowerCase().includes('texas'))) {
    targets.push({
      type: 'Resource Page',
      target: 'Texas business associations and legal blogs',
      action: 'Share Texas AI law guide with Texas-focused legal/business sites',
      url: `${SITE_URL}/guides/texas-ai-law`,
    })
  }

  if (post.keywords.some((k) => k.toLowerCase().includes('rag') || k.toLowerCase().includes('retrieval'))) {
    targets.push({
      type: 'Developer Community',
      target: 'AI engineering blogs and RAG-focused newsletters',
      action: 'Submit to AI newsletters (The Rundown, TLDR AI, AI Tinkerers)',
      url: `${SITE_URL}/blog/${post.slug}`,
    })
  }

  targets.push({
    type: 'Directory',
    target: 'AI tool directories (already listed: Product Hunt, AlternativeTo, SourceForge)',
    action: 'Submit article URL to Hacker News (https://news.ycombinator.com/submit)',
    url: `${SITE_URL}/blog/${post.slug}`,
  })

  targets.push({
    type: 'Social Bookmarking',
    target: 'Bookmarking sites',
    action: 'Submit to: Hacker News, Lobste.rs, Daily.dev',
    url: `${SITE_URL}/blog/${post.slug}`,
  })

  return targets
}

function generateOutreachEmails(post) {
  const articleUrl = `${SITE_URL}/blog/${post.slug}`
  const title = post.title
  const excerpt = post.excerpt || post.metaDescription

  return [
    {
      recipient: 'Newsletter editors (The Rundown AI, TLDR AI, AI Tinkerers Weekly)',
      subject: `Article pitch: ${title}`,
      body: `Hi [Name],

I'm Subodh KC, former Fortune 50 AI Strategy CTL. I just published a new article that I think would resonate with your readers:

"${title}"
${articleUrl}

Key takeaways:
- ${excerpt}

Would this be a fit for an upcoming issue? Happy to provide a shortened summary or exclusive angle for your newsletter.

Best,
Subodh KC
https://subodhkc.com
https://linkedin.com/in/subodhkc`,
    },
    {
      recipient: 'AI law/compliance blogs (for guest post / resource exchange)',
      subject: `Resource suggestion: ${title}`,
      body: `Hi [Name],

I've been following [Site Name] and noticed you cover AI compliance topics. I've put together a comprehensive resource that might be a good addition to your resources page:

"${title}"
${articleUrl}

It covers practical, enterprise-grade implementation guidance — not theory. Would you consider linking to it from your [resources/guides] page?

I'm also open to guest contributions if you're accepting them.

Best,
Subodh KC
https://subodhkc.com`,
    },
  ]
}

function generateReport(post) {
  const subreddits = findSubreddits(post.keywords)
  const quoraTopics = findQuoraTopics(post.keywords)
  const backlinkTargets = generateBacklinkTargets(post)
  const outreachEmails = generateOutreachEmails(post)
  const articleUrl = `${SITE_URL}/blog/${post.slug}`

  let md = `# Outreach Plan: ${post.title}\n\n`
  md += `**URL:** ${articleUrl}\n`
  md += `**Generated:** ${new Date().toISOString().split('T')[0]}\n`
  md += `**Keywords:** ${post.keywords.join(', ')}\n\n`

  md += `## Reddit Posting\n\n`
  if (subreddits.length > 0) {
    md += `Target subreddits:\n`
    for (const sub of subreddits) {
      md += `- r/${sub} — https://reddit.com/r/${sub}\n`
    }
    md += `\n**Approach:**\n`
    md += `1. Check subreddit rules before posting\n`
    md += `2. Use the Reddit post generated in data/social/${post.slug}.md\n`
    md += `3. Post as self-post (not link post) for r/MachineLearning\n`
    md += `4. Engage with comments within first 2 hours\n\n`
  } else {
    md += `No matching subreddits found for keywords. Consider posting to r/artificial or r/MachineLearning.\n\n`
  }

  md += `## Quora Answer Strategy\n\n`
  if (quoraTopics.length > 0) {
    md += `Target Quora topics:\n`
    for (const topic of quoraTopics) {
      md += `- ${topic} — https://www.quora.com/topic/${topic.replace(/\s+/g, '-')}\n`
    }
    md += `\n**Approach:**\n`
    md += `1. Search Quora for questions about: ${post.keywords.slice(0, 3).join(', ')}\n`
    md += `2. Write a 200-300 word answer that provides genuine value\n`
    md += `3. Link to the full article as "I wrote a deeper analysis here: ${articleUrl}"\n`
    md += `4. Follow up on answers within 24 hours\n\n`
  } else {
    md += `No matching Quora topics. Search Quora directly for your keywords.\n\n`
  }

  md += `## Backlink Opportunities\n\n`
  md += `| Type | Target | Action | URL |\n`
  md += `|------|--------|--------|-----|\n`
  for (const t of backlinkTargets) {
    md += `| ${t.type} | ${t.target} | ${t.action} | ${t.url} |\n`
  }
  md += `\n`

  md += `## Outreach Email Templates\n\n`
  for (const email of outreachEmails) {
    md += `### To: ${email.recipient}\n\n`
    md += `**Subject:** ${email.subject}\n\n`
    md += `\`\`\`\n${email.body}\n\`\`\`\n\n`
  }

  md += `## Distribution Checklist\n\n`
  md += `- [ ] Post to LinkedIn (automated via post-linkedin.mjs)\n`
  md += `- [ ] Post Twitter/X thread (copy from data/social/${post.slug}.md)\n`
  md += `- [ ] Submit to Hacker News\n`
  md += `- [ ] Post to Reddit (${subreddits.map((s) => `r/${s}`).join(', ')})\n`
  md += `- [ ] Cross-post to Dev.to (node scripts/cross-post-devto.mjs --slug=${post.slug})\n`
  md += `- [ ] Send Medium import reminder (node scripts/cross-post-medium.mjs --slug=${post.slug})\n`
  md += `- [ ] Answer 2-3 Quora questions in: ${quoraTopics.join(', ') || 'relevant topics'}\n`
  md += `- [ ] Send outreach emails to newsletter editors\n`
  md += `- [ ] Submit to AI newsletters (The Rundown, TLDR AI)\n`
  md += `- [ ] Check backlink targets above\n`

  return md
}

async function main() {
  const args = process.argv.slice(2)
  const slugArg = args.find((a) => a.startsWith('--slug='))?.split('=')[1]
  const allMode = args.includes('--all')

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
  }

  console.log(`\nDone. Review the plans in data/outreach/ and act on them.`)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
