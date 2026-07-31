import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://subodhkc.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/'],
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/'],
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/'],
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/'],
      },
      {
        userAgent: 'Claude-Web',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/'],
      },
      {
        userAgent: 'Perplexity-User',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/'],
      },
      {
        userAgent: 'CCBot',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/'],
      },
      {
        userAgent: 'FacebookBot',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/'],
      },
      {
        userAgent: 'Meta-ExternalAgent',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/'],
      },
      {
        userAgent: 'Applebot',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/'],
      },
      {
        userAgent: 'Applebot-Extended',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/'],
      },
      {
        userAgent: 'Bytespider',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/'],
      },
      {
        userAgent: 'Diffbot',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/'],
      },
      {
        userAgent: 'Omgilibot',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/'],
      },
      {
        userAgent: 'Omgili',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/'],
      },
      {
        userAgent: 'YouBot',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/'],
      },
      {
        userAgent: 'Amazonbot',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/'],
      },
      {
        userAgent: 'AI2Bot',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/'],
      },
      {
        userAgent: 'PiplBot',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/'],
      },
      {
        userAgent: 'cohere-ai',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
