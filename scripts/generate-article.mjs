#!/usr/bin/env node

/**
 * Daily AI Article Generator
 *
 * Uses OpenAI to generate a SEO-optimized blog post in the subodhkc.com niche:
 * AI governance, enterprise AI architecture, AI compliance, AI security.
 *
 * Usage:
 *   node scripts/generate-article.mjs                    # Auto-pick next topic
 *   node scripts/generate-article.mjs --topic="EU AI Act risk classification"
 *   node scripts/generate-article.mjs --frontofai         # Generate from FrontOfAI top stories
 *   node scripts/generate-article.mjs --dry-run           # Generate but don't save
 *
 * Requires: OPENAI_API_KEY environment variable
 * Optional:  FRONTOFAI_API_KEY for FrontOfAI data source
 * Outputs:  data/blog/posts/<slug>.json
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

const SITE_URL = 'https://subodhkc.com'

function loadEnvLocal() {
  const envPath = path.join(ROOT, '.env.local')
  if (!fs.existsSync(envPath)) return
  const content = fs.readFileSync(envPath, 'utf-8')
  for (const line of content.split('\n')) {
    const match = line.match(/^([A-Z_]+)=(.*)$/)
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, '')
    }
  }
}

loadEnvLocal()

function getAllPosts() {
  const postsDir = path.join(ROOT, 'data', 'blog', 'posts')
  if (!fs.existsSync(postsDir)) return []
  return fs.readdirSync(postsDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const content = fs.readFileSync(path.join(postsDir, f), 'utf-8')
      return JSON.parse(content)
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

function getNextId(posts) {
  const maxId = posts.reduce((max, p) => Math.max(max, p.id || 0), 1000)
  return maxId + 1
}

function getExistingSlugs(posts) {
  return new Set(posts.map((p) => p.slug))
}

function getExistingTitles(posts) {
  return posts.map((p) => p.title.toLowerCase())
}

function stripHtmlForCount(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

// Content pillars and topic queue — cycles through these
// Strategy-aligned: Law-to-Code Translations, Tool Reviews, Proprietary Frameworks,
// plus core governance/architecture/security and regulatory updates.
const CONTENT_PILLARS = [
  {
    pillar: 'Law-to-Code Translations',
    topics: [
      'How to build a logging pipeline for EU AI Act Article 12 compliance',
      'Implementing immutable audit trails for SOC 2 AI compliance',
      'TRAIGA HB 149 technical implementation for SaaS applications',
      'Building a conformity assessment evidence system for EU AI Act',
      'Designing automated bias audit pipelines for NYC Local Law 144',
      'Implementing AI risk classification automation for EU AI Act',
      'Building post-market monitoring infrastructure for high-risk AI',
      'GDPR Article 22 automated decision-making technical safeguards',
      'HIPAA Security Rule AI compliance architecture',
      'Texas AI Law disclosure automation for SaaS platforms',
      'Building a DPIA pipeline for AI systems under GDPR',
      'Implementing human-in-the-loop checkpoints for AI compliance',
      'Automated AI model registry for regulatory inventory management',
      'Building a data provenance tracking system for AI training data',
      'Implementing AI incident reporting automation for EU AI Act',
    ],
  },
  {
    pillar: 'Tool & Architecture Reviews',
    topics: [
      'LlamaIndex vs LangChain for secure enterprise RAG architecture',
      'TruLens vs Arize for precision drift detection in production AI',
      'Best document AI platforms for legal automation in 2026',
      'pgvector vs Pinecone vs Weaviate for enterprise RAG',
      'LangSmith vs Langfuse for LLM observability comparison',
      'Guardrails AI vs NeMo Guardrails for output validation',
      'Enterprise AI gateway comparison Kong vs Portkey vs Helicone',
      'OpenAI Evals vs DeepEval for LLM evaluation pipelines',
      'Best AI compliance automation tools comparison 2026',
      'Llama Guard vs Llama Prompt Guard for input filtering',
      'Enterprise vector search comparison Azure AI Search vs Elasticsearch',
      'AI monitoring tools comparison WhyLabs vs Fiddler vs Arize',
      'Best MLOps platforms for compliance-heavy AI deployments',
      'RAG evaluation tools comparison RAGAS vs TruLens vs DeepEval',
      'AI governance platforms comparison Credo AI vs Holistic AI vs Saidot',
    ],
  },
  {
    pillar: 'Proprietary Framework Breakdowns',
    topics: [
      'HAIEC six-phase AI exposure assessment implementation manual',
      'HAIEC compliance engine architecture how it works',
      'SKC ResetFrame methodology a technical playbook',
      'LegacyShift AI migration architecture decision framework',
      'Building an AI governance committee charter template',
      'AI vendor due diligence automated scoring framework',
      'HAIEC risk scoring algorithm design and implementation',
      'ResetFrame phase 1 discovery audit technical guide',
      'LegacyShift codebase assessment for AI integration',
      'HAIEC exposure matrix building and configuring',
      'Building a compliance evidence collector with HAIEC',
      'ResetFrame phase 2 architecture redesign patterns',
      'LegacyShift data migration strategy for AI readiness',
      'HAIEC continuous monitoring loop implementation',
      'Open-source AI governance toolkit from subodhkc.com',
    ],
  },
  {
    pillar: 'AI Governance Frameworks',
    topics: [
      'EU AI Act risk classification how to categorize your AI system',
      'EU AI Act high-risk obligations what you need to do',
      'EU AI Act conformity assessment step by step',
      'EU AI Act post-market monitoring requirements',
      'NIST AI RMF govern function implementation guide',
      'NIST AI RMF map function practical steps',
      'NIST AI RMF measure function metrics that matter',
      'NIST AI RMF manage function incident response',
      'ISO 42001 certification roadmap from zero to audit',
      'ISO 42001 AI management system controls checklist',
      'How NIST AI RMF maps to EU AI Act requirements',
      'How ISO 42001 maps to SOC 2 controls',
      'Cross-framework AI governance mapping',
      'AI governance committee structure and charter',
      'AI policy template for enterprise organizations',
    ],
  },
  {
    pillar: 'Enterprise AI Architecture',
    topics: [
      'Production RAG architecture patterns hybrid search',
      'RAG row-level security for enterprise multi-tenant',
      'Agentic retrieval architecture with governance boundaries',
      'Multi-agent orchestration patterns for enterprise',
      'AI architecture decision records ADR template',
      'Observability for AI systems the missing layer',
      'AI architecture fitness functions',
      'Model selection criteria for enterprise AI',
      'AI data pipeline architecture for compliance',
      'Enterprise AI deployment patterns blue-green canary',
      'AI gateway pattern for governance and rate limiting',
      'Vector database selection criteria for enterprise RAG',
      'Embedding model evaluation framework',
      'AI inference optimization for production',
      'Building an AI platform team structure and responsibilities',
    ],
  },
  {
    pillar: 'AI Security & Risk',
    topics: [
      'AI incident response playbook step by step',
      'AI risk register template with examples',
      'Prompt injection attacks and defenses',
      'RAG poisoning prevention strategies',
      'Model extraction attacks and protection',
      'AI security controls checklist OWASP LLM top 10',
      'MITRE ATLAS adversarial testing for AI systems',
      'AI bill of materials AIBOM what to track',
      'Governance as code with OPA Rego for AI',
      'AI model card template for enterprise',
      'AI red team methodology and tools',
      'Data poisoning detection in training pipelines',
      'AI supply chain security risks and controls',
      'AI access control patterns ABAC for models',
      'Secure AI deployment with zero-trust architecture',
    ],
  },
  {
    pillar: 'Regulatory Updates',
    topics: [
      'Texas AI Law compliance guide for businesses',
      'NYC Local Law 144 bias audit requirements',
      'Colorado AI Act what it means for employers',
      'California AI transparency Act SB 942',
      'State by state AI legislation tracker 2026',
      'HIPAA Security Rule updates for AI',
      'GDPR AI processing impact assessment',
      'EU AI Act enforcement timeline and penalties',
      'FDA AI medical device regulation updates',
      'SEC AI disclosure requirements for public companies',
    ],
  },
]

function pickNextTopic(posts) {
  const existingSlugs = getExistingSlugs(posts)
  const existingTitles = getExistingTitles(posts)
  const existingKeywords = new Set(posts.flatMap((p) => p.keywords || []))

  // Flatten all topics with pillar info
  const allTopics = []
  for (const pillar of CONTENT_PILLARS) {
    for (const topic of pillar.topics) {
      allTopics.push({ topic, pillar: pillar.pillar })
    }
  }

  // Find first topic not already covered
  for (const item of allTopics) {
    const potentialSlug = slugify(item.topic)
    const titleMatch = existingTitles.some(
      (t) => t.includes(item.topic.toLowerCase().slice(0, 30)) ||
             t.includes(item.pillar.toLowerCase().slice(0, 20))
    )

    if (!existingSlugs.has(potentialSlug) && !titleMatch) {
      return item
    }
  }

  // If all topics covered, pick a variation
  return {
    topic: 'AI governance trends and updates ' + new Date().toISOString().split('T')[0],
    pillar: 'AI Governance Frameworks',
  }
}

const FRONTOFAI_URL = 'https://frontofai.com'

async function fetchFrontOfAIStories() {
  const apiKey = process.env.FRONTOFAI_API_KEY
  if (!apiKey) {
    console.error('ERROR: FRONTOFAI_API_KEY not set')
    process.exit(1)
  }

  console.log('Fetching top stories from FrontOfAI...')

  const url = `${FRONTOFAI_URL}/api/briefing/v1/haiec?limit=20&sort=impact&days=7&min_impact=6`
  const response = await fetch(url, {
    headers: { 'x-haiec-key': apiKey },
  })

  if (!response.ok) {
    const error = await response.text()
    console.error(`FrontOfAI API error (${response.status}): ${error}`)
    process.exit(1)
  }

  const result = await response.json()
  return result.data || []
}

function selectFrontOfAIStory(stories, posts) {
  const existingTitles = getExistingTitles(posts)
  const existingSlugs = getExistingSlugs(posts)

  // Filter out stories we've already covered (by title similarity)
  const unused = stories.filter((s) => {
    const titleLower = (s.title || '').toLowerCase()
    return !existingTitles.some((t) => t.includes(titleLower.slice(0, 40))) &&
           !existingSlugs.has(slugify(s.title || ''))
  })

  if (unused.length === 0) {
    // All covered — pick highest impact that's at least 3 days old
    return stories[0]
  }

  // Pick highest impact unused story
  return unused[0]
}

function isRegulatoryStory(story) {
  const regulatoryKeywords = [
    'bill', 'law', 'regulation', 'act', 'compliance', 'enforcement',
    'penalty', 'legislation', 'senate', 'congress', 'parliament',
    'directive', 'mandate', 'ruling', 'court', 'ftc', 'fda', 'sec',
    'eu ai act', 'gdpr', 'hipaa', 'nist', 'iso 42001', 'soc 2',
    'traiga', 'colorado ai act', 'nyc local law', 'california ai',
    'texas ai', 'regulatory', 'governance', 'audit', 'certification',
  ]
  const text = `${story.title || ''} ${story.summary_short || ''} ${story.summary_extended || ''} ${story.why_this_matters || ''} ${(story.category_details || []).map((c) => c.name).join(' ')}`.toLowerCase()
  return regulatoryKeywords.some((kw) => text.includes(kw))
}

async function generateArticleFromFrontOfAI(story, posts) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    console.error('ERROR: OPENAI_API_KEY not set')
    process.exit(1)
  }

  const existingPostsContext = posts
    .slice(0, 10)
    .map((p) => `- ${p.title} (slug: ${p.slug}, keywords: ${(p.keywords || []).join(', ')})`)
    .join('\n')

  const storyData = {
    title: story.title || '',
    summary: story.summary_short || '',
    extendedSummary: story.summary_extended || '',
    whyItMatters: story.why_this_matters || '',
    actionItem: story.action_item || '',
    actionOwner: story.action_owner || '',
    actionTimeline: story.action_timeline || '',
    impactScore: story.it_impact_score || 0,
    source: story.source_name || '',
    sourceUrl: story.source_url || '',
    categories: (story.category_details || []).map((c) => c.name).join(', '),
    publishedAt: story.published_at || '',
  }

  const regulatory = isRegulatoryStory(story)
  if (regulatory) {
    console.log('  >> Regulatory story detected — using Law-to-Code prompt')
  }

  const contentInstructions = regulatory
    ? `LAW-TO-CODE TRANSLATION MODE:
You are writing a Law-to-Code translation, NOT general analysis. Structure the article as:
1. What the Law Says — plain English summary of the regulation/ruling
2. What It Means for System Architecture — technical implications (data flows, logging, access controls, audit trails)
3. Technical Implementation Steps — specific engineering steps to comply (pipelines, schemas, APIs, infrastructure)
4. Code and Pipeline Patterns — concrete technical patterns (e.g., immutable logging, evidence collection, bias audit pipelines)
5. Audit Evidence You Will Need — what regulators will ask for and how to collect it automatically
6. What This Means for You — specific action items for CTOs/CISOs/compliance officers

Focus on HOW to build compliance infrastructure, not WHAT the law is. Readers should come away knowing what to engineer.`
    : `INSTRUCTIONS:
1. Write 1500-2500 words of original analysis and commentary on this news story
2. Do NOT just restate the news — provide expert analysis, implications, and actionable guidance
3. Structure with clear H2 and H3 headings
4. Include practical steps, frameworks, or templates that readers can apply
5. Connect the news to broader AI governance, compliance, or architecture themes
6. Reference the source story and provide attribution
7. Include a "What This Means for You" section with specific action items
8. End with a practical takeaway`

  const prompt = `You are an expert AI governance and enterprise architecture writer. Write a comprehensive, SEO-optimized blog post for subodhkc.com based on a real news story from FrontOfAI.

CONTENT NICHE: AI governance, enterprise AI architecture, AI compliance, AI security, legal tech AI
TARGET AUDIENCE: CTOs, CISOs, AI program leaders, enterprise architects, compliance officers
AUTHOR: Subodh KC
TONE: Practical, no fluff, frameworks and steps you can apply. Not "what is X" but "how to do X."

COPYWRITING GUARDRAILS:
- DO NOT use em-dashes (—) anywhere. Use regular hyphens (-) or restructure sentences.
- DO NOT use AI writing tells: "Here's what I've learned", "After working across", "In my experience", "I've seen firsthand", "Let me share", "Here's the thing", "It's worth noting", "Needless to say", "At the end of the day", "The reality is", "Let's dive in", "Let's explore", "Let's break this down", "Here's a breakdown", "Here's why", "Here's how", "The bottom line is", "It comes down to", "That's where", "This is where", "This isn't just about", "Let's be clear", "One thing is clear", "A key takeaway is", "Picture this", "Imagine", "Fast forward", "Spoiler alert", "Plot twist", "Here's the deal", "But here's the catch", "Which brings us to"
- DO NOT fabricate personal claims - no "signed a client", "we deployed", "a company I worked with", "in a recent engagement"
- DO NOT use em-dashes as punctuation. Use periods, commas, or colons instead.
- Content must be factual and based on the source story. No hallucinated facts, numbers, or events.
- Write about the topic, the news, the how-to. Not about personal experience or fabricated case studies.

SOURCE NEWS STORY (from FrontOfAI):
Title: ${storyData.title}
Source: ${storyData.source}
Impact Score: ${storyData.impactScore}/10
Categories: ${storyData.categories}
Published: ${storyData.publishedAt}
Summary: ${storyData.summary}
Extended Summary: ${storyData.extendedSummary}
Why It Matters: ${storyData.whyItMatters}
Recommended Action: ${storyData.actionItem} (${storyData.actionOwner} - ${storyData.actionTimeline})
Source URL: ${storyData.sourceUrl}

EXISTING POSTS (for internal linking — reference where relevant):
${existingPostsContext}

${contentInstructions}

9. Optimize for SEO: natural keyword usage
10. Generate 6-10 relevant keywords/tags
11. Write a compelling metaDescription (under 160 chars) that includes the primary keyword
12. Write a 1-2 sentence excerpt
13. Include 2-3 internal links to existing posts where relevant (use format: <a href="/blog/slug">anchor text</a>)
14. Include a FAQ section at the end with 3-5 questions and answers (wrapped in <h3> for questions, <p> for answers)

SEO TITLE RULES:
- Title must be under 60 characters
- Title must include the primary keyword naturally
- Title should be ${regulatory ? 'implementation-oriented (how to comply, technical steps, what to build)' : 'analysis-oriented, not just restating the news'}
- Title should indicate expertise (${regulatory ? 'implementation guide, technical breakdown, what to build' : 'analysis, implications, what it means, etc.'})

SEO META DESCRIPTION RULES:
- Must be under 160 characters
- Must include the primary keyword
- Must be compelling enough to drive clicks
- Must accurately describe the content

OUTPUT FORMAT — return a JSON object with these exact fields:
{
  "title": "SEO-optimized title (under 60 chars) — should be ${regulatory ? 'implementation-oriented, not just restating the news' : 'analysis-oriented, not just restating the news'}",
  "metaDescription": "Compelling meta description under 160 chars",
  "contentHtml": "Full HTML content with <h2>, <h3>, <p>, <ul>, <li>, <blockquote>, <strong>, <a> tags. No class attributes. No script tags. Start with an <h2> not an <h1>. Include internal links as <a href=\"/blog/slug\">text</a>. End with a FAQ section.",
  "keywords": ["keyword1", "keyword2", ...],
  "seedKeyword": "primary target keyword",
  "excerpt": "1-2 sentence article excerpt",
  "faqJsonLd": {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Question text here",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Answer text here"
        }
      }
    ]
  }
}

Do NOT include id, slug, createdAt, or any other fields — only the fields listed above.
Return ONLY the JSON object, no markdown code fences, no preamble.`

  console.log(`Generating article from FrontOfAI story: ${storyData.title}`)
  console.log(`Source: ${storyData.source} | Impact: ${storyData.impactScore}/10`)

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert content writer specializing in AI governance, enterprise AI architecture, and AI compliance. You write practical, implementation-focused content for technical leaders. You analyze news stories and provide expert commentary and actionable guidance. You never use em-dashes. You never use AI writing patterns like "Here\'s what I\'ve learned" or "After working across". You never fabricate personal experiences or claims. You stick to facts from the source material. You return only valid JSON.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 8000,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error(`OpenAI API error (${response.status}): ${error}`)
    process.exit(1)
  }

  const data = await response.json()
  const content = data.choices[0]?.message?.content

  if (!content) {
    console.error('OpenAI returned empty response (possibly truncated by max_tokens)')
    console.error('Finish reason:', data.choices[0]?.finish_reason)
    process.exit(1)
  }

  const jsonStr = content.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '').trim()

  let article
  try {
    article = JSON.parse(jsonStr)
  } catch (e) {
    console.error('Failed to parse OpenAI response as JSON')
    console.error('Response:', content.slice(0, 500))
    process.exit(1)
  }

  return article
}

async function generateArticle(topic, pillar, posts) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    console.error('ERROR: OPENAI_API_KEY not set')
    process.exit(1)
  }

  // Build context about existing posts for internal linking
  const existingPostsContext = posts
    .slice(0, 10)
    .map((p) => `- ${p.title} (slug: ${p.slug}, keywords: ${(p.keywords || []).join(', ')})`)
    .join('\n')

  const prompt = `You are an expert AI governance and enterprise architecture writer. Write a comprehensive, SEO-optimized blog post for subodhkc.com.

CONTENT NICHE: AI governance, enterprise AI architecture, AI compliance, AI security, legal tech AI
TARGET AUDIENCE: CTOs, CISOs, AI program leaders, enterprise architects, compliance officers
AUTHOR: Subodh KC
TONE: Practical, no fluff, frameworks and steps you can apply. Not "what is X" but "how to do X."

COPYWRITING GUARDRAILS:
- DO NOT use em-dashes (—) anywhere. Use regular hyphens (-) or restructure sentences.
- DO NOT use AI writing tells: "Here's what I've learned", "After working across", "In my experience", "I've seen firsthand", "Let me share", "Here's the thing", "It's worth noting", "Needless to say", "At the end of the day", "The reality is", "Let's dive in", "Let's explore", "Let's break this down", "Here's a breakdown", "Here's why", "Here's how", "The bottom line is", "It comes down to", "That's where", "This is where", "This isn't just about", "Let's be clear", "One thing is clear", "A key takeaway is", "Picture this", "Imagine", "Fast forward", "Spoiler alert", "Plot twist", "Here's the deal", "But here's the catch", "Which brings us to"
- DO NOT fabricate personal claims - no "signed a client", "we deployed", "a company I worked with", "in a recent engagement"
- Content must be factual. No hallucinated facts, numbers, or events.
- Write about the topic, the how-to. Not about personal experience or fabricated case studies.

TOPIC: ${topic}
CONTENT PILLAR: ${pillar}

EXISTING POSTS (for internal linking — reference where relevant):
${existingPostsContext}

REQUIREMENTS:
1. Write 1500-2500 words of original, high-quality content
2. Structure with clear H2 and H3 headings
3. Include practical steps, frameworks, or templates
4. Use specific examples and numbers, not vague generalities
5. Include a brief intro that hooks the reader (not a question)
6. End with a practical takeaway or action item
7. Optimize for SEO: natural keyword usage, no keyword stuffing
8. Generate 6-10 relevant keywords/tags
9. Write a compelling metaDescription (under 160 chars) that includes the primary keyword
10. Write a 1-2 sentence excerpt
11. Include 2-3 internal links to existing posts where relevant (use format: <a href="/blog/slug">anchor text</a>)
12. Include a FAQ section at the end with 3-5 questions and answers (wrapped in <h3> for questions, <p> for answers)

SEO TITLE RULES:
- Title must be under 60 characters
- Title must include the primary keyword naturally
- Title should be compelling and specific (not generic)
- Title should indicate the content type (guide, analysis, checklist, etc.)

SEO META DESCRIPTION RULES:
- Must be under 160 characters
- Must include the primary keyword
- Must be compelling enough to drive clicks
- Must accurately describe the content

OUTPUT FORMAT — return a JSON object with these exact fields:
{
  "title": "SEO-optimized title (under 60 chars)",
  "metaDescription": "Compelling meta description under 160 chars",
  "contentHtml": "Full HTML content with <h2>, <h3>, <p>, <ul>, <li>, <blockquote>, <strong>, <a> tags. No class attributes. No script tags. Start with an <h2> not an <h1>. Include internal links as <a href=\"/blog/slug\">text</a>. End with a FAQ section.",
  "keywords": ["keyword1", "keyword2", ...],
  "seedKeyword": "primary target keyword",
  "excerpt": "1-2 sentence article excerpt",
  "faqJsonLd": {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Question text here",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Answer text here"
        }
      }
    ]
  }
}

Do NOT include id, slug, createdAt, or any other fields — only the fields listed above.
Return ONLY the JSON object, no markdown code fences, no preamble.`

  console.log(`Generating article: ${topic}`)
  console.log(`Pillar: ${pillar}`)

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert content writer specializing in AI governance, enterprise AI architecture, and AI compliance. You write practical, implementation-focused content for technical leaders. You never use em-dashes. You never use AI writing patterns like "Here\'s what I\'ve learned" or "After working across". You never fabricate personal experiences or claims. You stick to facts. You return only valid JSON.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 8000,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error(`OpenAI API error (${response.status}): ${error}`)
    process.exit(1)
  }

  const data = await response.json()
  const content = data.choices[0]?.message?.content

  if (!content) {
    console.error('OpenAI returned empty response (possibly truncated by max_tokens)')
    console.error('Finish reason:', data.choices[0]?.finish_reason)
    process.exit(1)
  }

  // Strip markdown code fences if present
  const jsonStr = content.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '').trim()

  let article
  try {
    article = JSON.parse(jsonStr)
  } catch (e) {
    console.error('Failed to parse OpenAI response as JSON')
    console.error('Response:', content.slice(0, 500))
    process.exit(1)
  }

  return article
}

async function generateChecklist(article, slug) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  const prompt = `You are an expert AI compliance consultant. Based on the blog post below, generate a practical, downloadable checklist in Markdown format that a reader can use to implement the guidance from the article.

TITLE: ${article.title}
KEYWORDS: ${(article.keywords || []).join(', ')}
EXCERPT: ${article.excerpt || ''}

CONTENT (first 3000 chars):
${(article.contentHtml || '').replace(/<[^>]+>/g, ' ').slice(0, 3000)}

REQUIREMENTS:
1. Generate a Markdown checklist (100-300 lines) that is actionable and specific
2. Use Markdown checkboxes: - [ ] item
3. Organize into logical sections with ## headers
4. Include specific technical steps, not vague advice
5. Include a "Preparation" section, an "Implementation" section, and a "Verification" section
6. Add a "Evidence to Collect" section listing what audit artifacts to save
7. Do NOT include em-dashes. Use regular hyphens.
8. Do NOT include AI writing tells or fabricated personal claims.
9. Start with a brief 2-3 line description of what this checklist covers
10. End with a "## About" section: "Generated from: ${SITE_URL}/blog/${slug}"

Return ONLY the Markdown content, no code fences, no preamble.`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert AI compliance consultant who creates practical, actionable checklists. You return only valid Markdown. You never use em-dashes.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    })

    if (!response.ok) {
      console.warn(`Checklist generation failed (${response.status}) — skipping`)
      return null
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content
    if (!content) return null

    return content.replace(/^```markdown?\s*/i, '').replace(/\s*```$/i, '').trim()
  } catch (err) {
    console.warn(`Checklist generation error: ${err.message} — skipping`)
    return null
  }
}

async function main() {
  const args = process.argv.slice(2)
  const topicArg = args.find((a) => a.startsWith('--topic='))?.split('=')[1]
  const useFrontOfAI = args.includes('--frontofai')
  const dryRun = args.includes('--dry-run')

  const posts = getAllPosts()
  console.log(`Found ${posts.length} existing posts`)

  let article, frontOfAIStory

  if (useFrontOfAI) {
    // Fetch top stories from FrontOfAI
    const stories = await fetchFrontOfAIStories()
    console.log(`Fetched ${stories.length} stories from FrontOfAI`)

    if (stories.length === 0) {
      console.error('No stories returned from FrontOfAI — falling back to topic queue')
      const picked = pickNextTopic(posts)
      article = await generateArticle(picked.topic, picked.pillar, posts)
    } else {
      // Select best unused story
      frontOfAIStory = selectFrontOfAIStory(stories, posts)
      console.log(`\nSelected story: ${frontOfAIStory.title}`)
      console.log(`Impact: ${frontOfAIStory.it_impact_score}/10 | Source: ${frontOfAIStory.source_name}`)

      article = await generateArticleFromFrontOfAI(frontOfAIStory, posts)
    }
  } else if (topicArg) {
    console.log(`\nTopic: ${topicArg}`)
    console.log(`Pillar: Custom`)
    article = await generateArticle(topicArg, 'Custom', posts)
  } else {
    const picked = pickNextTopic(posts)
    console.log(`\nTopic: ${picked.topic}`)
    console.log(`Pillar: ${picked.pillar}`)
    article = await generateArticle(picked.topic, picked.pillar, posts)
  }

  // Validate generated article
  const warnings = []
  if (article.title && article.title.length > 60) {
    warnings.push(`Title is ${article.title.length} chars (recommended: under 60)`)
  }
  if (article.metaDescription && article.metaDescription.length > 160) {
    warnings.push(`Meta description is ${article.metaDescription.length} chars (recommended: under 160)`)
  }
  const wordCount = stripHtmlForCount(article.contentHtml || '').split(/\s+/).filter(Boolean).length
  if (wordCount < 1000) {
    warnings.push(`Content is only ${wordCount} words (recommended: 1500+). Content may be too thin for SEO.`)
  }
  if (!article.keywords || article.keywords.length < 3) {
    warnings.push(`Only ${article.keywords?.length || 0} keywords (recommended: 6-10)`)
  }
  if (!article.excerpt) {
    warnings.push('No excerpt generated')
  }

  if (warnings.length > 0) {
    console.log('\n  ⚠ SEO Warnings:')
    for (const w of warnings) {
      console.log(`    - ${w}`)
    }
  } else {
    console.log('\n  ✓ All SEO checks passed')
  }

  console.log(`  Word count: ~${wordCount}`)

  // Build full post object
  const id = getNextId(posts)
  const slug = slugify(article.title)

  // Ensure slug is unique
  const existingSlugs = getExistingSlugs(posts)
  let uniqueSlug = slug
  let counter = 2
  while (existingSlugs.has(uniqueSlug)) {
    uniqueSlug = `${slug}-${counter}`
    counter++
  }

  const post = {
    id,
    title: article.title,
    slug: uniqueSlug,
    metaDescription: article.metaDescription,
    contentHtml: article.contentHtml,
    contentMarkdown: '',
    heroImageUrl: null,
    jsonLd: null,
    faqJsonLd: article.faqJsonLd || null,
    languageCode: 'en',
    createdAt: new Date().toISOString(),
    keywords: article.keywords || [],
    seedKeyword: article.seedKeyword || null,
    excerpt: article.excerpt || null,
    downloadableUrl: null,
    downloadableLabel: null,
  }

  console.log(`\nGenerated post:`)
  console.log(`  ID: ${post.id}`)
  console.log(`  Title: ${post.title}`)
  console.log(`  Slug: ${post.slug}`)
  console.log(`  Keywords: ${post.keywords.join(', ')}`)
  console.log(`  Content length: ${post.contentHtml.length} chars`)

  if (dryRun) {
    console.log('\n--dry-run: not saving file')
    console.log('\nContent preview (first 500 chars):')
    console.log(post.contentHtml.slice(0, 500))
    return
  }

  // Save post
  const postsDir = path.join(ROOT, 'data', 'blog', 'posts')
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true })
  }

  const outputPath = path.join(postsDir, `${post.slug}.json`)
  fs.writeFileSync(outputPath, JSON.stringify(post, null, 2), 'utf-8')
  console.log(`\nSaved to: data/blog/posts/${post.slug}.json`)

  // Generate downloadable checklist
  if (!dryRun) {
    console.log('\nGenerating downloadable checklist...')
    const checklist = await generateChecklist(article, post.slug)
    if (checklist) {
      const downloadsDir = path.join(ROOT, 'public', 'downloads')
      if (!fs.existsSync(downloadsDir)) {
        fs.mkdirSync(downloadsDir, { recursive: true })
      }
      const checklistPath = path.join(downloadsDir, `${post.slug}-checklist.md`)
      fs.writeFileSync(checklistPath, checklist, 'utf-8')
      console.log(`  ✓ Checklist saved to public/downloads/${post.slug}-checklist.md`)

      // Update post with downloadable fields
      post.downloadableUrl = `/downloads/${post.slug}-checklist.md`
      post.downloadableLabel = `Download the ${article.title.split(' ').slice(0, 4).join(' ')} Checklist`
      fs.writeFileSync(outputPath, JSON.stringify(post, null, 2), 'utf-8')
      console.log(`  ✓ Post updated with downloadable URL`)
    } else {
      console.log('  ⚠ Checklist generation skipped — post saved without downloadable')
    }
  }

  // Generate hero image with DALL-E 3
  if (!dryRun && process.env.OPENAI_API_KEY) {
    console.log('\nGenerating hero image with DALL-E 3...')
    try {
      const { execSync } = await import('child_process')
      execSync(`node scripts/generate-hero-image.mjs --slug=${post.slug}`, {
        cwd: ROOT,
        stdio: 'inherit',
      })
    } catch (err) {
      console.warn(`Hero image generation failed: ${err.message}`)
      console.warn('Post saved successfully — image can be generated later with: node scripts/generate-hero-image.mjs --slug=' + post.slug)
    }
  }

  console.log(`\nNext steps:`)
  console.log(`  1. Review the generated article`)
  console.log(`  2. The GitHub Action will auto-generate social content`)
  console.log(`  3. IndexNow + Google Indexing API will auto-ping on push`)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
