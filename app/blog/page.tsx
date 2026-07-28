import { getAllPosts } from '@/lib/blog'
import { BlogIndexClient } from '@/components/blog/BlogIndexClient'

export const revalidate = 3600

export const metadata = {
  title: 'AI Governance & Architecture Blog | Articles by Subodh KC',
  description: 'In-depth articles on AI governance, compliance automation, enterprise AI architecture, production AI systems, EU AI Act, NIST AI RMF, and AI systems design.',
  keywords: [
    'AI governance blog',
    'AI compliance articles',
    'AI architecture blog',
    'enterprise AI',
    'AI systems design',
    'production AI systems',
    'AI governance framework',
    'AI compliance automation',
    'EU AI Act',
    'NIST AI RMF',
    'AI systems architect',
    'Subodh KC'
  ],
  alternates: {
    canonical: 'https://subodhkc.com/blog',
  },
  openGraph: {
    title: 'AI Governance & Architecture Blog | Subodh KC',
    description: 'In-depth articles on AI governance, compliance automation, enterprise AI architecture, and production AI systems.',
    url: 'https://subodhkc.com/blog',
    type: 'website',
    images: [
      {
        url: 'https://subodhkc.com/og/blog.png',
        width: 1200,
        height: 630,
        alt: 'AI Blog'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Governance & Architecture Blog | Subodh KC',
    description: 'In-depth articles on AI governance, compliance automation, enterprise AI architecture, and production AI systems.',
    images: ['https://subodhkc.com/og/blog.png']
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1
  }
}

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
