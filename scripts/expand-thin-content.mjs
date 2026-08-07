#!/usr/bin/env node

/**
 * Expand Thin Content
 *
 * Uses OpenAI to expand existing blog posts that are under 700 words.
 * Reads the thin-content-remediation.md recommendations and applies
 * targeted expansions with the same quality guardrails as new articles.
 *
 * Usage:
 *   node scripts/expand-thin-content.mjs                    # Expand all thin posts
 *   node scripts/expand-thin-content.mjs --slug=specific-slug  # Expand one post
 *   node scripts/expand-thin-content.mjs --dry-run           # Preview without saving
 *   node scripts/expand-thin-content.mjs --refresh-keywords   # Only fix keyword-stuffed posts
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

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

const postsDir = path.join(ROOT, 'data', 'blog', 'posts')

// Thin content configuration - updated after duplicate purge
// Removed: securing-ai-systems-after-openai-containment-breach (deleted, 301 redirected)
// Removed: ai-compliance-guide-addressing-hugging-face-risks (deleted, 301 redirected)
const THIN_POSTS = [
  {
    slug: 'ai-voice-agent-architecture-kestrelvoice',
    targetWords: 1500,
    instructions: 'Add architecture diagram (text-based), latency breakdown, failure recovery patterns, degradation modes. Focus on KestrelVoice-specific implementation details (telephony layer, adaptive orchestration). Differentiate from the general /ai-voice-agent-architecture page by focusing on product-specific implementation. Add external citations to Twilio docs and WebRTC specifications.',
    type: 'expand',
  },
  {
    slug: 'haiec-modular-ai-governance-framework',
    targetWords: 1500,
    instructions: 'Add HAIEC phase breakdown, evidence schema, control mapping table. Expand each phase with specific inputs, outputs, and evidence artifacts. Add a HAIEC implementation checklist. Add external citations to NIST AI RMF and ISO 42001.',
    type: 'expand',
  },
  {
    slug: 'implementing-immutable-audit-trails-for-soc-2-ai-compliance',
    targetWords: 1200,
    instructions: 'Add append-only log architecture, cryptographic chaining code example (Node.js or Python), cite AIC SOC 2 Trust Services Criteria. Add a log schema artifact. Add internal link to /blog/build-a-logging-pipeline-for-eu-ai-act-compliance. Add external citation to AIC SOC 2 Trust Services Criteria documentation.',
    type: 'expand',
  },
  {
    slug: 'implementing-rag-row-level-security-for-multi-tenant-ai',
    targetWords: 1200,
    instructions: 'Add RLS policy code examples (Postgres/Supabase), tenant isolation architecture diagram (text-based), tenant onboarding checklist. Add internal link to /secure-enterprise-rag-architecture. Add external citations to PostgreSQL RLS documentation and Supabase docs.',
    type: 'expand',
  },
  {
    slug: 'seven-layers-ai-compliance-nist-iso-soc2',
    targetWords: 1500,
    instructions: 'Add cross-framework control mapping table. Cite NIST AI RMF 1.0, ISO/IEC 42001:2023, AIC SOC 2 TSC. Add internal links to /guides/eu-ai-act, /guides/texas-ai-law, /guides/nyc-local-law-144. Add a compliance crosswalk artifact. Add external citations to NIST, ISO, and AIC primary sources.',
    type: 'expand',
  },
  {
    slug: 'production-rag-architecture-patterns-for-hybrid-search',
    targetWords: 1200,
    instructions: 'Focus exclusively on hybrid search implementation (BM25 + vector search comparison). Add retrieval evaluation framework. Add code example for hybrid search scoring. Differentiate from /secure-enterprise-rag-architecture which covers overall RAG security. Add internal link to /secure-enterprise-rag-architecture. Add external citations to BM25 paper and vector search documentation.',
    type: 'expand',
  },
  {
    slug: 'build-a-logging-pipeline-for-eu-ai-act-compliance',
    targetWords: 1200,
    instructions: 'Add code examples for logging pipeline (Node.js or Python), log schema artifact, cite EU AI Act Article 12 text directly. Add internal links to /guides/eu-ai-act and /blog/implementing-immutable-audit-trails-for-soc-2-ai-compliance. Add external citation to the official EU AI Act text on EUR-Lex.',
    type: 'expand',
  },
  {
    slug: 'recover-a-stalled-ai-pilot-in-30-days',
    targetWords: 1200,
    instructions: 'Add a detailed 30-day recovery timeline with specific weekly milestones. Include diagnostic framework for identifying stall causes (data quality, model drift, user adoption, integration failures). Add internal links to /blog/12-production-readiness-checks-for-ai-pilots and /advisory. Add external citations to NIST AI RMF and OWASP.',
    type: 'expand',
  },
]

// Keyword refresh configuration
const KEYWORD_REFRESH = [
  {
    slug: 'hipaa-compliant-ai',
    instructions: 'Reduce keywords from 18 to 8-10 most relevant. Add citations to 45 CFR Part 164 (HIPAA Security Rule). Add internal links to /guides and /blog/seven-layers-ai-compliance-nist-iso-soc2. Add a HIPAA AI compliance checklist artifact.',
    type: 'refresh',
  },
  {
    slug: 'legal-document-automation',
    instructions: 'Reduce keywords from 20 to 8-10 most relevant. Add original analysis of at least one legal document automation platform. Add internal links. Consider refocusing on AI-assisted legal document generation architecture.',
    type: 'refresh',
  },
]

const COPYWRITING_GUARDRAILS = `COPYWRITING GUARDRAILS (NON-NEGOTIABLE):
- DO NOT use em-dashes or en-dashes anywhere. Use regular hyphens (-), periods, commas, or colons instead.
- DO NOT use AI writing tells: "Here's what I've learned", "After working across", "In my experience", "I've seen firsthand", "Let me share", "Here's the thing", "It's worth noting", "Needless to say", "At the end of the day", "The reality is", "Let's dive in", "Let's explore", "Let's break this down", "Here's a breakdown", "Here's why", "Here's how", "The bottom line is", "It comes down to", "That's where", "This is where", "This isn't just about", "Let's be clear", "One thing is clear", "A key takeaway is", "Picture this", "Imagine", "Fast forward", "Spoiler alert", "Plot twist", "Here's the deal", "But here's the catch", "Which brings us to", "Delve into", "Navigate the complexities", "In the realm of", "A testament to", "Paving the way", "Revolutionize", "Game-changer", "Paradigm shift", "Cutting-edge", "Harness the power", "Unlock the potential", "Empower", "Seamless", "Robust" (as filler), "Leverage" (as verb for "use"), "Streamline", "Foster", "Facilitate", "Underscore", "Underpin", "Bolster"
- DO NOT fabricate personal claims or invent statistics
- Content must be factual and based on real technical and regulatory knowledge.`

function getAllPosts() {
  if (!fs.existsSync(postsDir)) return []
  return fs.readdirSync(postsDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(postsDir, f), 'utf-8')))
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

function validateExpandedContent(contentHtml) {
  const errors = []
  const warnings = []

  if (contentHtml.includes('\u2014') || contentHtml.includes('\u2013')) {
    errors.push('Content contains em-dashes or en-dashes')
  }

  const aiTells = [
    "Here's what I've learned", "After working across", "In my experience",
    "I've seen firsthand", "Let me share", "Here's the thing",
    "It's worth noting", "Needless to say", "At the end of the day",
    "The reality is", "Let's dive in", "Let's explore",
    "Let's break this down", "Here's a breakdown", "Here's why",
    "Here's how", "The bottom line is", "It comes down to",
    "That's where", "This is where", "This isn't just about",
    "Let's be clear", "One thing is clear", "A key takeaway is",
    "Picture this", "Imagine", "Fast forward", "Spoiler alert",
    "Plot twist", "Here's the deal", "But here's the catch",
    "Which brings us to", "Delve into", "Navigate the complexities",
    "In the realm of", "A testament to", "Paving the way",
    "Revolutionize", "Game-changer", "Paradigm shift",
    "Cutting-edge", "Harness the power", "Unlock the potential",
    "Empower", "Seamless", "Streamline", "Foster", "Facilitate",
    "Underscore", "Underpin", "Bolster",
  ]
  const contentLower = contentHtml.toLowerCase()
  const foundTells = aiTells.filter((tell) => contentLower.includes(tell.toLowerCase()))
  if (foundTells.length > 0) {
    errors.push(`AI writing tells detected: ${foundTells.join(', ')}`)
  }

  const forbiddenClaims = [
    'peer-reviewed', 'industry standard', 'legally defensible',
    'guaranteed compliance', 'audit proof', 'eliminates ai risk',
    '100% accurate', 'proven at fortune 50 scale', 'adopted across the industry',
  ]
  const foundForbidden = forbiddenClaims.filter((claim) => contentLower.includes(claim))
  if (foundForbidden.length > 0) {
    errors.push(`Forbidden claims detected: ${foundForbidden.join(', ')}`)
  }

  return { errors, warnings }
}

async function expandPost(post, config, dryRun) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    console.error('ERROR: OPENAI_API_KEY not set')
    process.exit(1)
  }

  const currentWordCount = stripHtmlForCount(post.contentHtml).split(/\s+/).filter(Boolean).length
  console.log(`  Current word count: ${currentWordCount}`)
  console.log(`  Target word count: ${config.targetWords || 'N/A'}`)
  console.log(`  Instructions: ${config.instructions.slice(0, 100)}...`)

  const prompt = `You are an expert AI systems architect. Expand and improve an existing blog post for subodhkc.com.

TITLE: ${post.title}
SLUG: ${post.slug}
CURRENT WORD COUNT: ${currentWordCount}
${config.targetWords ? `TARGET WORD COUNT: ${config.targetWords}` : ''}

CURRENT CONTENT:
${post.contentHtml}

EXPANSION INSTRUCTIONS:
${config.instructions}

${COPYWRITING_GUARDRAILS}

REQUIREMENTS:
1. Preserve the existing structure and content that is good
2. Add substantial new content following the expansion instructions
3. Maintain the same HTML format: <h2>, <h3>, <p>, <ul>, <li>, <blockquote>, <strong>, <a>, <table>
4. No class attributes. No script tags. No em-dashes.
5. Keep existing internal links and CTAs. Add new internal links where specified in instructions.
6. Do NOT change the title unless the instructions specifically say to refocus
7. Do NOT remove existing FAQ sections - expand them if needed
8. The output must be the complete expanded HTML content, not a diff

${config.type === 'refresh' ? 'Also reduce the keywords to 8-10 most relevant terms. Return the updated keywords separately.' : ''}

OUTPUT FORMAT - return a JSON object:
{
  "title": "${post.title}",
  "contentHtml": "Full expanded HTML content",
  "keywords": ${config.type === 'refresh' ? '["keyword1", "keyword2", ...]' : JSON.stringify(post.keywords || [])},
  "metaDescription": "${post.metaDescription || ''}"
}

Return ONLY the JSON object, no markdown code fences, no preamble.`

  console.log('  Calling OpenAI...')

  let response
  const maxRetries = 3
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-2024-11-20',
          messages: [
            {
              role: 'system',
              content: 'You are an expert AI systems architect who expands and improves existing technical content. You return only valid JSON.',
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 16384,
        }),
      })

      if (response.ok) break

      if (response.status === 429 || response.status >= 500) {
        console.warn(`  API error ${response.status} (attempt ${attempt}/${maxRetries})`)
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 5000
          console.log(`  Retrying in ${delay / 1000}s...`)
          await new Promise((resolve) => setTimeout(resolve, delay))
          continue
        }
      }

      const error = await response.text()
      console.error(`  OpenAI API error (${response.status}): ${error.slice(0, 200)}`)
      return false
    } catch (err) {
      console.warn(`  Network error (attempt ${attempt}/${maxRetries}): ${err.message}`)
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 5000
        await new Promise((resolve) => setTimeout(resolve, delay))
        continue
      }
      console.error(`  Network error after ${maxRetries} attempts: ${err.message}`)
      return false
    }
  }

  const data = await response.json()
  const content = data.choices[0]?.message?.content
  const finishReason = data.choices[0]?.finish_reason

  if (!content) {
    console.error('  OpenAI returned empty response')
    console.error('  Finish reason:', finishReason)
    return false
  }

  if (finishReason === 'length') {
    console.warn('  OpenAI response was truncated (finish_reason: length). Attempting JSON repair...')
  }

  const jsonStr = content.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '').trim()

  let expanded
  try {
    expanded = JSON.parse(jsonStr)
  } catch (e) {
    console.warn('  Initial JSON parse failed. Attempting repair of truncated response...')
    let repaired = jsonStr
    const lastQuote = repaired.lastIndexOf('"')
    const lastBrace = repaired.lastIndexOf('}')
    if (lastQuote > lastBrace) {
      repaired = repaired.slice(0, lastQuote + 1) + '}]}}'
    }
    const openBraces = (repaired.match(/{/g) || []).length
    const closeBraces = (repaired.match(/}/g) || []).length
    const openBrackets = (repaired.match(/\[/g) || []).length
    const closeBrackets = (repaired.match(/\]/g) || []).length
    repaired += '}'.repeat(Math.max(0, openBraces - closeBraces))
    repaired += ']'.repeat(Math.max(0, openBrackets - closeBrackets))

    try {
      expanded = JSON.parse(repaired)
      console.warn('  JSON repair succeeded - content may have truncated sections')
    } catch (e2) {
      console.error('  Failed to parse OpenAI response as JSON')
      console.error('  Finish reason:', finishReason)
      console.error('  Response:', content.slice(0, 200))
      return false
    }
  }

  // Validate expanded content
  const { errors, warnings } = validateExpandedContent(expanded.contentHtml || '')
  if (errors.length > 0) {
    console.error('  VALIDATION ERRORS:')
    for (const e of errors) {
      console.error(`    - ${e}`)
    }
    return false
  }

  const newWordCount = stripHtmlForCount(expanded.contentHtml || '').split(/\s+/).filter(Boolean).length
  console.log(`  New word count: ${newWordCount}`)
  console.log(`  Improvement: +${newWordCount - currentWordCount} words`)

  if (dryRun) {
    console.log('  DRY RUN: would save changes')
    return true
  }

  // Update post
  post.contentHtml = expanded.contentHtml
  if (expanded.keywords && expanded.keywords.length > 0) {
    post.keywords = expanded.keywords
  }
  if (expanded.metaDescription) {
    post.metaDescription = expanded.metaDescription
  }

  const outputPath = path.join(postsDir, `${post.slug}.json`)
  fs.writeFileSync(outputPath, JSON.stringify(post, null, 2), 'utf-8')
  console.log(`  SAVED: data/blog/posts/${post.slug}.json`)
  return true
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const slugArg = args.find((a) => a.startsWith('--slug='))?.split('=')[1]
  const refreshOnly = args.includes('--refresh-keywords')
  const skipRefresh = args.includes('--skip-refresh')

  console.log('Expand Thin Content')
  console.log('===================')
  if (dryRun) console.log('Mode: DRY RUN (no files will be saved)\n')

  const posts = getAllPosts()
  console.log(`Found ${posts.length} blog posts\n`)

  let configs
  if (refreshOnly) {
    configs = KEYWORD_REFRESH
  } else if (skipRefresh) {
    configs = THIN_POSTS
  } else {
    configs = [...THIN_POSTS, ...KEYWORD_REFRESH]
  }

  if (slugArg) {
    configs = configs.filter((c) => c.slug === slugArg)
  }

  if (configs.length === 0) {
    console.log('No matching posts found.')
    process.exit(1)
  }

  let successCount = 0
  let failCount = 0

  for (const config of configs) {
    const post = posts.find((p) => p.slug === config.slug)
    if (!post) {
      console.log(`\nSKIP: ${config.slug} - post not found`)
      failCount++
      continue
    }

    console.log(`\nProcessing: ${post.slug} (${config.type})`)
    const success = await expandPost(post, config, dryRun)
    if (success) {
      successCount++
    } else {
      failCount++
    }
  }

  console.log(`\nDone. ${successCount} expanded, ${failCount} failed.`)

  if (failCount > 0 && successCount === 0) {
    process.exit(1)
  }
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
