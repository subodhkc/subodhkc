import fs from 'fs'
import path from 'path'

export interface BlogPost {
  id: number
  title: string
  slug: string
  metaDescription: string
  contentHtml: string
  contentMarkdown: string
  heroImageUrl: string | null
  jsonLd: Record<string, unknown> | null
  faqJsonLd: Record<string, unknown> | null
  languageCode: string
  createdAt: string
  keywords: string[]
  seedKeyword: string | null
  excerpt: string | null
}

export interface BlogPostSummary {
  id: number
  title: string
  slug: string
  metaDescription: string
  heroImageUrl: string | null
  excerpt: string | null
  createdAt: string
  keywords: string[]
  seedKeyword: string | null
}

const POSTS_DIR = path.join(process.cwd(), 'data', 'blog', 'posts')

function readPostFile(slug: string): BlogPost | null {
  const filePath = path.join(POSTS_DIR, `${slug}.json`)
  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw) as BlogPost
  } catch {
    return null
  }
}

export function getAllPosts(): BlogPostSummary[] {
  try {
    const files = fs.readdirSync(POSTS_DIR)
    const posts: BlogPostSummary[] = []

    for (const file of files) {
      if (!file.endsWith('.json')) continue
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8')
      const post: BlogPost = JSON.parse(raw)
      posts.push({
        id: post.id,
        title: post.title,
        slug: post.slug,
        metaDescription: post.metaDescription,
        heroImageUrl: post.heroImageUrl,
        excerpt: post.excerpt,
        createdAt: post.createdAt,
        keywords: post.keywords || [],
        seedKeyword: post.seedKeyword || null,
      })
    }

    posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return posts
  } catch {
    return []
  }
}

export function getPostBySlug(slug: string): BlogPost | null {
  return readPostFile(slug)
}

export function getAllSlugs(): string[] {
  try {
    const files = fs.readdirSync(POSTS_DIR)
    return files
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.replace('.json', ''))
  } catch {
    return []
  }
}
