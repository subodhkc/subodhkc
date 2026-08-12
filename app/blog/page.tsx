import { getAllPosts } from '@/lib/blog'
import { BlogIndexClient } from '@/components/blog/BlogIndexClient'

export const revalidate = 3600

export const metadata = {
  title: 'AI Governance & Architecture Blog | Articles by Yeti AI Writer',
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
    'Yeti AI Writer'
  ],
  alternates: {
    canonical: 'https://subodhkc.com/blog',
  },
  openGraph: {
    title: 'AI Governance & Architecture Blog | Yeti AI Writer',
    description: 'In-depth articles on AI governance, compliance automation, enterprise AI architecture, and production AI systems.',
    url: 'https://subodhkc.com/blog',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Governance & Architecture Blog | Yeti AI Writer',
    description: 'In-depth articles on AI governance, compliance automation, enterprise AI architecture, and production AI systems.',
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
    name: 'Yeti AI Writer - AI Governance & Architecture Blog',
    description: 'Practical articles on AI governance, compliance automation, enterprise AI architecture, and production AI systems.',
    url: 'https://subodhkc.com/blog',
    author: {
      '@type': 'Person',
      name: 'Yeti AI Writer',
      url: 'https://subodhkc.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Yeti AI Writer',
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

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://subodhkc.com/blog' },
    ],
  }

  return <BlogIndexClient posts={posts} blogJsonLd={blogJsonLd} breadcrumbJsonLd={breadcrumbJsonLd} />
}
