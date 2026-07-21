import { getAllPosts } from '@/lib/blog'
import { BlogIndexClient } from '@/components/blog/BlogIndexClient'

export const revalidate = 3600

export default function BlogIndexPage() {
  const posts = getAllPosts()

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Subodh KC — AI Governance & Architecture Blog',
    description: 'Practical articles on AI governance, compliance automation, enterprise AI architecture, and production AI systems.',
    url: 'https://subodhkc.com/blog',
    author: {
      '@type': 'Person',
      name: 'Subodh KC',
      url: 'https://subodhkc.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Subodh KC',
      url: 'https://subodhkc.com',
    },
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `https://subodhkc.com/blog/${p.slug}`,
      datePublished: p.createdAt,
      description: p.metaDescription,
    })),
  }

  return <BlogIndexClient posts={posts} blogJsonLd={blogJsonLd} />
}
