import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://subodhkc.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/private/', '/resume/', '/dashboard/'],
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/', '/private/', '/resume/', '/dashboard/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ['/api/', '/private/', '/resume/', '/dashboard/'],
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: ['/api/', '/private/', '/resume/', '/dashboard/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/api/', '/private/', '/resume/', '/dashboard/'],
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
        disallow: ['/api/', '/private/', '/resume/', '/dashboard/'],
      },
      {
        userAgent: 'Claude-Web',
        allow: '/',
        disallow: ['/api/', '/private/', '/resume/', '/dashboard/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/api/', '/private/', '/resume/', '/dashboard/'],
      },
      {
        userAgent: 'Perplexity-User',
        allow: '/',
        disallow: ['/api/', '/private/', '/resume/', '/dashboard/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/api/', '/private/', '/resume/', '/dashboard/'],
      },
      {
        userAgent: 'CCBot',
        allow: '/',
        disallow: ['/api/', '/private/', '/resume/', '/dashboard/'],
      },
      {
        userAgent: 'FacebookBot',
        allow: '/',
        disallow: ['/api/', '/private/', '/resume/', '/dashboard/'],
      },
      {
        userAgent: 'Meta-ExternalAgent',
        allow: '/',
        disallow: ['/api/', '/private/', '/resume/', '/dashboard/'],
      },
      {
        userAgent: 'Applebot',
        allow: '/',
        disallow: ['/api/', '/private/', '/resume/', '/dashboard/'],
      },
      {
        userAgent: 'Applebot-Extended',
        allow: '/',
        disallow: ['/api/', '/private/', '/resume/', '/dashboard/'],
      },
      {
        userAgent: 'Bytespider',
        allow: '/',
        disallow: ['/api/', '/private/', '/resume/', '/dashboard/'],
      },
      {
        userAgent: 'Diffbot',
        allow: '/',
        disallow: ['/api/', '/private/', '/resume/', '/dashboard/'],
      },
      {
        userAgent: 'Omgilibot',
        allow: '/',
        disallow: ['/api/', '/private/', '/resume/', '/dashboard/'],
      },
      {
        userAgent: 'Omgili',
        allow: '/',
        disallow: ['/api/', '/private/', '/resume/', '/dashboard/'],
      },
      {
        userAgent: 'YouBot',
        allow: '/',
        disallow: ['/api/', '/private/', '/resume/', '/dashboard/'],
      },
      {
        userAgent: 'Amazonbot',
        allow: '/',
        disallow: ['/api/', '/private/', '/resume/', '/dashboard/'],
      },
      {
        userAgent: 'AI2Bot',
        allow: '/',
        disallow: ['/api/', '/private/', '/resume/', '/dashboard/'],
      },
      {
        userAgent: 'PiplBot',
        allow: '/',
        disallow: ['/api/', '/private/', '/resume/', '/dashboard/'],
      },
      {
        userAgent: 'cohere-ai',
        allow: '/',
        disallow: ['/api/', '/private/', '/resume/', '/dashboard/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
