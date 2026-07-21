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

function htmlToMarkdown(html) {
  let md = html
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
  return md.trim()
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

  let slugsToProcess = []

  if (slugArg) {
    slugsToProcess = [slugArg]
  } else if (missingMode) {
    const tracker = loadTracker()
    const allSlugs = getAllSlugs()
    slugsToProcess = allSlugs.filter((s) => !tracker[s])
  } else {
    console.error('Usage: node scripts/cross-post-devto.mjs --slug=<slug> | --missing')
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

    const markdown = htmlToMarkdown(post.contentHtml)
    const tags = post.keywords.slice(0, 4).map((kw) =>
      kw.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 20)
    ).filter((t) => t.length > 0)

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
