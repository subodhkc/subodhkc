#!/usr/bin/env node

/**
 * Generate a hero image for a blog post using DALL-E 3.
 *
 * Creates an infographic-style image that visually represents the article's
 * key concepts. Images are saved to /public/blog-images/<slug>.png and
 * the blog post JSON is updated with the heroImageUrl.
 *
 * Usage:
 *   node scripts/generate-hero-image.mjs --slug=my-article
 *   node scripts/generate-hero-image.mjs --slug=my-article --regenerate
 *   node scripts/generate-hero-image.mjs --missing    # Generate for all posts missing images
 *
 * Requires: OPENAI_API_KEY environment variable
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

const SITE_URL = 'https://subodhkc.com'
const OPENAI_API = 'https://api.openai.com/v1'
const IMAGES_DIR = path.join(ROOT, 'public', 'blog-images')

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

/**
 * Build a DALL-E 3 prompt for an infographic-style hero image.
 * Uses the article title, keywords, and excerpt to create a relevant visual.
 */
function buildImagePrompt(post) {
  const title = post.title
  const keywords = (post.keywords || []).slice(0, 5).join(', ')
  const excerpt = post.excerpt || post.metaDescription || ''

  return `Create a professional infographic-style hero image for a blog article titled "${title}". 

The article covers: ${excerpt}

Key topics: ${keywords}

Design requirements:
- Clean, modern infographic style with a dark navy and electric blue color scheme
- Include 3-4 visual elements representing the key concepts (icons, flowcharts, or layered diagrams)
- Professional enterprise tech aesthetic — think McKinsey/Deloitte report visuals
- No text or words in the image (the title is rendered separately by the website)
- Abstract but recognizable — geometric shapes, connected nodes, layered architecture
- 16:9 aspect ratio composition
- High contrast, crisp lines, suitable for display at 1200x630px on social media`
}

/**
 * Generate an image using DALL-E 3 and return the image URL.
 */
async function generateImage(prompt) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not set')
  }

  const response = await fetch(`${OPENAI_API}/images/generations`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1792x1024',
      quality: 'standard',
      response_format: 'url',
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenAI image API error (${response.status}): ${error}`)
  }

  const data = await response.json()
  return data.data[0].url
}

/**
 * Download an image from a URL and save it locally.
 */
async function downloadImage(url, outputPath) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to download image (${response.status})`)
  }

  const buffer = Buffer.from(await response.arrayBuffer())
  const dir = path.dirname(outputPath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(outputPath, buffer)
  return outputPath
}

/**
 * Generate and save a hero image for a single blog post.
 * Updates the post JSON with the heroImageUrl.
 */
async function generateHeroImage(slug, regenerate = false) {
  const postPath = path.join(ROOT, 'data', 'blog', 'posts', `${slug}.json`)
  if (!fs.existsSync(postPath)) {
    console.error(`Blog post not found: data/blog/posts/${slug}.json`)
    return false
  }

  const post = JSON.parse(fs.readFileSync(postPath, 'utf-8'))

  if (post.heroImageUrl && !regenerate) {
    console.log(`  ${slug}: Already has hero image — skipping (use --regenerate to override)`)
    return false
  }

  console.log(`  ${slug}: Generating hero image...`)
  const prompt = buildImagePrompt(post)

  try {
    const imageUrl = await generateImage(prompt)
    const localPath = path.join(IMAGES_DIR, `${slug}.png`)

    console.log(`  Downloading image...`)
    await downloadImage(imageUrl, localPath)

    // Update the blog post JSON with the hero image URL
    post.heroImageUrl = `${SITE_URL}/blog-images/${slug}.png`
    fs.writeFileSync(postPath, JSON.stringify(post, null, 2), 'utf-8')

    console.log(`  Saved: public/blog-images/${slug}.png`)
    console.log(`  Updated heroImageUrl: ${post.heroImageUrl}`)
    return true
  } catch (err) {
    console.error(`  Failed to generate image for ${slug}: ${err.message}`)
    return false
  }
}

/**
 * Find all blog posts without hero images.
 */
function findPostsWithoutImages() {
  const postsDir = path.join(ROOT, 'data', 'blog', 'posts')
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.json'))
  const missing = []

  for (const file of files) {
    const post = JSON.parse(fs.readFileSync(path.join(postsDir, file), 'utf-8'))
    if (!post.heroImageUrl) {
      missing.push(post.slug)
    }
  }

  return missing
}

async function main() {
  const args = process.argv.slice(2)
  const slugArg = args.find((a) => a.startsWith('--slug='))?.split('=')[1]
  const missingOnly = args.includes('--missing')
  const regenerate = args.includes('--regenerate')

  if (!slugArg && !missingOnly) {
    console.error('Usage: node scripts/generate-hero-image.mjs --slug=<slug> [--regenerate]')
    console.error('       node scripts/generate-hero-image.mjs --missing')
    process.exit(1)
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error('ERROR: OPENAI_API_KEY not set')
    process.exit(1)
  }

  let slugs = []
  if (missingOnly) {
    slugs = findPostsWithoutImages()
    if (slugs.length === 0) {
      console.log('All blog posts already have hero images!')
      return
    }
    console.log(`Found ${slugs.length} post(s) without hero images:`)
  } else {
    slugs = [slugArg]
  }

  let success = 0
  let failed = 0

  for (const slug of slugs) {
    const ok = await generateHeroImage(slug, regenerate)
    if (ok) success++
    else failed++
  }

  console.log(`\nDone: ${success} generated, ${failed} skipped/failed`)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
