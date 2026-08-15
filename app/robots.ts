import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://subodhkc.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/', '/app/'],
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/', '/app/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/', '/app/'],
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/', '/app/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/', '/app/'],
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/', '/app/'],
      },
      {
        userAgent: 'Claude-Web',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/', '/app/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/', '/app/'],
      },
      {
        userAgent: 'Perplexity-User',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/', '/app/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/', '/app/'],
      },
      {
        userAgent: 'CCBot',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/', '/app/'],
      },
      {
        userAgent: 'FacebookBot',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/', '/app/'],
      },
      {
        userAgent: 'Meta-ExternalAgent',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/', '/app/'],
      },
      {
        userAgent: 'Applebot',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/', '/app/'],
      },
      {
        userAgent: 'Applebot-Extended',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/', '/app/'],
      },
      {
        userAgent: 'Bytespider',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/', '/app/'],
      },
      {
        userAgent: 'Diffbot',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/', '/app/'],
      },
      {
        userAgent: 'Omgilibot',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/', '/app/'],
      },
      {
        userAgent: 'Omgili',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/', '/app/'],
      },
      {
        userAgent: 'YouBot',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/', '/app/'],
      },
      {
        userAgent: 'Amazonbot',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/', '/app/'],
      },
      {
        userAgent: 'AI2Bot',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/', '/app/'],
      },
      {
        userAgent: 'PiplBot',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/', '/app/'],
      },
      {
        userAgent: 'cohere-ai',
        allow: '/',
        disallow: ['/api/', '/private/', '/dashboard/', '/centaurus/', '/app/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
