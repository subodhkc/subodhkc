#!/usr/bin/env node

/**
 * cross-post-devto.mjs — Cross-post blog articles to Dev.to as drafts.
 *
 * Uses the Dev.to API to create draft articles with canonical URLs
 * pointing back to subodhkc.com. This gives you:
 * - Backlinks from a high-DA developer community
 * - Reach to a developer audience
 * - SEO credit preserved via canonical_url
 *
 * Usage:
 *   node scripts/cross-post-devto.mjs --slug=<slug>     # Cross-post specific article
 *   node scripts/cross-post-devto.mjs --missing          # Cross-post all articles not yet on Dev.to
 *   node scripts/cross-post-devto.mjs --slug=<slug> --publish  # Publish immediately (not just draft)
 *
 * Requires DEVTO_API_KEY in .env.local or environment.
 * Get your API key at: https://dev.to/settings/extensions
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')
const POSTS_DIR = path.join(PROJECT_ROOT, 'data', 'blog', 'posts')
const TRACKER_PATH = path.join(PROJECT_ROOT, 'data', 'blog', 'devto-posted.json')
const SITE_URL = 'https://subodhkc.com'

function loadEnvLocal() {
  const envPath = path.join(PROJECT_ROOT, '.env.local')
  if (!fs.existsSync(envPath)) return
  const content = fs.readFileSync(envPath, 'utf-8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    let value = trimmed.slice(eqIdx + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = value
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
  fs.writeFileSync(TRACKER_PATH, JSON.stringify(tracker, null, 2))
}

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

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function htmlToMarkdown(html, slug) {
  // Convert relative internal links to absolute URLs for cross-posting
  let md = html
  md = md.replace(/href=["']\/blog\/([^"']+)["']/gi, (match, blogSlug) => {
    return `href="https://subodhkc.com/blog/${blogSlug}"`
  })
  md = md.replace(/href=["']\/(?!blog\/)/gi, 'href="https://subodhkc.com/')
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n# $1\n')
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n## $1\n')
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n### $1\n')
  md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '\n#### $1\n')
  md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
  md = md.replace(/<ul[^>]*>/gi, '\n')
  md = md.replace(/<\/ul>/gi, '\n')
  md = md.replace(/<ol[^>]*>/gi, '\n')
  md = md.replace(/<\/ol>/gi, '\n')
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '\n$1\n')
  md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
  md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
  md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
  md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
  md = md.replace(/<a[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)<\/a>/gi, '[$2]($1)')
  md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
  md = md.replace(/<pre[^>]*>(.*?)<\/pre>/gi, '\n```\n$1\n```\n')
  md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '\n> $1\n')
  md = md.replace(/<br\s*\/?>/gi, '\n')
  md = md.replace(/<[^>]+>/g, '')
  md = md.replace(/\n{3,}/g, '\n\n')
  md = md.trim()

  // Add SEO footer with canonical link and contextual platform links
  const lowerTitle = html.toLowerCase()
  const mentionsHAIEC = lowerTitle.includes('haiec') || lowerTitle.includes('governance framework') || lowerTitle.includes('compliance framework')
  const mentionsKestrelVoice = lowerTitle.includes('kestrelvoice') || lowerTitle.includes('voice agent') || lowerTitle.includes('voice operations')

  let footer = `\n\n---\n\n*Originally published at [subodhkc.com](https://subodhkc.com/blog/${slug}).`

  if (mentionsHAIEC) {
    footer += ` Learn more about the [HAIEC AI Governance Platform](https://haiec.com).`
  }
  if (mentionsKestrelVoice) {
    footer += ` Explore [KestrelVoice AI Voice Operations](https://kestrelvoice.com).`
  }

  footer += ` Follow for more on AI governance, enterprise architecture, and compliance engineering.*`

  md += footer

  return md
}

async function fetchExistingDevtoArticles(apiKey) {
  const response = await fetch('https://dev.to/api/articles/me/published?per_page=100', {
    headers: { 'api-key': apiKey },
  })
  if (!response.ok) return []
  const articles = await response.json()
  const map = new Map()
  for (const article of articles) {
    if (article.canonical_url) {
      map.set(article.canonical_url, { id: article.id, url: article.url, title: article.title })
    }
  }
  return map
}

async function createDevtoArticle(apiKey, articleData) {
  const response = await fetch('https://dev.to/api/articles', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ article: articleData }),
  })

  const data = await response.json()

  if (response.status === 422 && JSON.stringify(data).toLowerCase().includes('canonical')) {
    return { duplicate: true }
  }

  if (!response.ok) {
    throw new Error(`Dev.to API error ${response.status}: ${JSON.stringify(data)}`)
  }

  return { duplicate: false, id: data.id, url: data.url }
}

async function publishExistingDraft(apiKey, articleId) {
  const response = await fetch(`https://dev.to/api/articles/${articleId}`, {
    method: 'PUT',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      article: {
        published: true,
      },
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(`Dev.to API error ${response.status}: ${JSON.stringify(data)}`)
  }

  return { id: data.id, url: data.url }
}

async function updateExistingDraft(apiKey, articleId, articleData) {
  const response = await fetch(`https://dev.to/api/articles/${articleId}`, {
    method: 'PUT',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ article: articleData }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(`Dev.to API error ${response.status}: ${JSON.stringify(data)}`)
  }

  return { id: data.id, url: data.url }
}

async function main() {
  loadEnvLocal()

  const apiKey = process.env.DEVTO_API_KEY
  if (!apiKey) {
    console.error('DEVTO_API_KEY is not set. Get your API key at https://dev.to/settings/extensions')
    process.exit(1)
  }

  const args = process.argv.slice(2)
  const slugArg = args.find((a) => a.startsWith('--slug='))?.split('=')[1]
  const missingMode = args.includes('--missing')
  const publishImmediately = args.includes('--publish')
  const publishDraftMode = args.includes('--publish-draft')
  const publishNextMode = args.includes('--publish-next')

  // --publish-draft: Publish an existing draft by slug (uses PUT API)
  if (publishDraftMode && slugArg) {
    const tracker = loadTracker()
    const entry = tracker[slugArg]
    if (!entry || !entry.id) {
      console.error(`  ✗ ${slugArg}: no draft found in tracker. Run --missing first to create drafts.`)
      process.exit(1)
    }
    if (entry.published) {
      console.log(`  ⊘ ${slugArg}: already published at ${entry.url}`)
      return
    }
    console.log(`Publishing existing draft for ${slugArg} (ID: ${entry.id})...`)
    try {
      const result = await publishExistingDraft(apiKey, entry.id)
      tracker[slugArg] = { ...entry, published: true, date: new Date().toISOString() }
      saveTracker(tracker)
      console.log(`  ✓ Published at ${result.url}`)
    } catch (err) {
      console.error(`  ✗ ${err.message}`)
    }
    return
  }

  // --publish-next: Publish the oldest unpublished draft (staggered publishing)
  if (publishNextMode) {
    const tracker = loadTracker()
    const unpublished = Object.entries(tracker)
      .filter(([, v]) => !v.published)
      .sort((a, b) => new Date(a[1].date) - new Date(b[1].date))

    if (unpublished.length === 0) {
      console.log('No unpublished drafts found.')
      return
    }

    const [slug, entry] = unpublished[0]
    console.log(`Publishing next draft: ${slug} (ID: ${entry.id})...`)

    // Update draft content with latest footer before publishing
    const post = getPostBySlug(slug)
    if (post) {
      const lowerContent = (post.contentMarkdown || post.contentHtml || '').toLowerCase()
      const mentionsHAIEC = lowerContent.includes('haiec') || lowerContent.includes('governance framework') || lowerContent.includes('compliance framework')
      const mentionsKestrelVoice = lowerContent.includes('kestrelvoice') || lowerContent.includes('voice agent') || lowerContent.includes('voice operations')

      let footerText = `\n\n---\n\n*Originally published at [subodhkc.com](https://subodhkc.com/blog/${slug}).`
      if (mentionsHAIEC) {
        footerText += ` Learn more about the [HAIEC AI Governance Platform](https://haiec.com).`
      }
      if (mentionsKestrelVoice) {
        footerText += ` Explore [KestrelVoice AI Voice Operations](https://kestrelvoice.com).`
      }
      footerText += ` Follow for more on AI governance, enterprise architecture, and compliance engineering.*`

      const markdown = post.contentMarkdown
        ? post.contentMarkdown + footerText
        : htmlToMarkdown(post.contentHtml, slug)

      const tags = []
      const preferredTagMap = {
        'ai compliance': 'aicompliance',
        'ai governance': 'aigovernance',
        'ai security': 'aisecurity',
        'hipaa': 'hipaa',
        'rag': 'rag',
        'rag architecture': 'rag',
        'nist ai rmf': 'nistai',
        'iso 42001': 'iso42001',
        'soc 2': 'soc2',
        'ai voice agents': 'aivoice',
        'ai voice architecture': 'aivoice',
        'enterprise architecture': 'architecture',
        'row-level security': 'security',
        'multi-tenant ai': 'multitenant',
        'legal document automation': 'legaltech',
        'ai audit': 'audit',
        'ai risk': 'airisk',
        'ai containment': 'aisecurity',
        'kestrelvoice': 'aivoice',
        'haiec': 'aigovernance',
      }
      for (const kw of post.keywords) {
        const lower = kw.toLowerCase()
        const mapped = preferredTagMap[lower]
        if (mapped && !tags.includes(mapped) && tags.length < 4) {
          tags.push(mapped)
        }
      }
      for (const kw of post.keywords) {
        if (tags.length >= 4) break
        const cleaned = kw.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 20)
        if (cleaned && !tags.includes(cleaned)) {
          tags.push(cleaned)
        }
      }

      const updateData = {
        body_markdown: markdown,
        tags,
        published: true,
      }

      try {
        const result = await updateExistingDraft(apiKey, entry.id, updateData)
        tracker[slug] = { ...entry, published: true, date: new Date().toISOString() }
        saveTracker(tracker)
        console.log(`  ✓ Published at ${result.url}`)
        const remaining = unpublished.length - 1
        console.log(`  ${remaining} draft(s) remaining for future publishing.`)
      } catch (err) {
        console.error(`  ✗ ${err.message}`)
      }
    } else {
      // Fallback: just publish without content update
      try {
        const result = await publishExistingDraft(apiKey, entry.id)
        tracker[slug] = { ...entry, published: true, date: new Date().toISOString() }
        saveTracker(tracker)
        console.log(`  ✓ Published at ${result.url}`)
        const remaining = unpublished.length - 1
        console.log(`  ${remaining} draft(s) remaining for future publishing.`)
      } catch (err) {
        console.error(`  ✗ ${err.message}`)
      }
    }
    return
  }

  let slugsToProcess = []

  if (slugArg) {
    slugsToProcess = [slugArg]
  } else if (missingMode) {
    const tracker = loadTracker()
    const allSlugs = getAllSlugs()
    slugsToProcess = allSlugs.filter((s) => !tracker[s])
  } else {
    console.error('Usage: node scripts/cross-post-devto.mjs --slug=<slug> | --missing | --publish-draft --slug=<slug> | --publish-next')
    process.exit(1)
  }

  if (slugsToProcess.length === 0) {
    console.log('No articles to cross-post.')
    return
  }

  console.log(`Cross-posting ${slugsToProcess.length} article(s) to Dev.to...\n`)

  const existingArticles = await fetchExistingDevtoArticles(apiKey)
  const tracker = loadTracker()

  for (const slug of slugsToProcess) {
    const post = getPostBySlug(slug)
    if (!post) {
      console.error(`  ✗ ${slug}: post not found`)
      continue
    }

    const canonicalUrl = `${SITE_URL}/blog/${slug}`

    if (existingArticles.has(canonicalUrl)) {
      console.log(`  ⊘ ${slug}: already on Dev.to (${existingArticles.get(canonicalUrl).url})`)
      tracker[slug] = existingArticles.get(canonicalUrl)
      saveTracker(tracker)
      continue
    }

    if (tracker[slug]) {
      console.log(`  ⊘ ${slug}: already tracked in devto-posted.json`)
      continue
    }

    // Use contentMarkdown if available (better formatting), otherwise convert HTML
    // Add SEO footer with contextual platform links
    const lowerContent = (post.contentMarkdown || post.contentHtml || '').toLowerCase()
    const mentionsHAIEC = lowerContent.includes('haiec') || lowerContent.includes('governance framework') || lowerContent.includes('compliance framework')
    const mentionsKestrelVoice = lowerContent.includes('kestrelvoice') || lowerContent.includes('voice agent') || lowerContent.includes('voice operations')

    let footerText = `\n\n---\n\n*Originally published at [subodhkc.com](https://subodhkc.com/blog/${slug}).`
    if (mentionsHAIEC) {
      footerText += ` Learn more about the [HAIEC AI Governance Platform](https://haiec.com).`
    }
    if (mentionsKestrelVoice) {
      footerText += ` Explore [KestrelVoice AI Voice Operations](https://kestrelvoice.com).`
    }
    footerText += ` Follow for more on AI governance, enterprise architecture, and compliance engineering.*`

    const markdown = post.contentMarkdown
      ? post.contentMarkdown + footerText
      : htmlToMarkdown(post.contentHtml, slug)

    // Select the 4 most SEO-valuable tags for Dev.to
    // Dev.to tags: max 4, lowercase, alphanumeric, max 20 chars
    const preferredTagMap = {
      'ai compliance': 'aicompliance',
      'ai governance': 'aigovernance',
      'ai security': 'aisecurity',
      'hipaa': 'hipaa',
      'rag': 'rag',
      'rag architecture': 'rag',
      'nist ai rmf': 'nistai',
      'iso 42001': 'iso42001',
      'soc 2': 'soc2',
      'ai voice agents': 'aivoice',
      'ai voice architecture': 'aivoice',
      'enterprise architecture': 'architecture',
      'row-level security': 'security',
      'multi-tenant ai': 'multitenant',
      'legal document automation': 'legaltech',
      'ai audit': 'audit',
      'ai risk': 'airisk',
      'ai containment': 'aisecurity',
      'kestrelvoice': 'aivoice',
      'haiec': 'aigovernance',
    }
    const tags = []
    for (const kw of post.keywords) {
      const lower = kw.toLowerCase()
      const mapped = preferredTagMap[lower]
      if (mapped && !tags.includes(mapped) && tags.length < 4) {
        tags.push(mapped)
      }
    }
    // Fallback: if we don't have 4 tags yet, add from keywords directly
    for (const kw of post.keywords) {
      if (tags.length >= 4) break
      const cleaned = kw.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 20)
      if (cleaned && !tags.includes(cleaned)) {
        tags.push(cleaned)
      }
    }

    const articleData = {
      title: post.title,
      published: publishImmediately,
      body_markdown: markdown,
      tags,
      canonical_url: canonicalUrl,
      description: post.excerpt || post.metaDescription,
    }

    if (post.heroImageUrl) {
      articleData.main_image = post.heroImageUrl
    }

    try {
      const result = await createDevtoArticle(apiKey, articleData)

      if (result.duplicate) {
        console.log(`  ⊘ ${slug}: duplicate canonical URL — already exists on Dev.to`)
        continue
      }

      tracker[slug] = { id: result.id, url: result.url, published: publishImmediately, date: new Date().toISOString() }
      saveTracker(tracker)

      console.log(`  ✓ ${slug}: ${publishImmediately ? 'published' : 'draft created'} at ${result.url}`)

      await new Promise((resolve) => setTimeout(resolve, 3500))
    } catch (err) {
      console.error(`  ✗ ${slug}: ${err.message}`)
    }
  }

  console.log('\nDone.')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
