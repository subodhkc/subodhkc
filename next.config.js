/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.babylovegrowth.ai' },
      { protocol: 'https', hostname: 'api.babylovegrowth.ai' },
      { protocol: 'https', hostname: '**.babylovegrowth.ai' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://hebtx.chambermaster.com https://assets.calendly.com; style-src 'self' 'unsafe-inline' https://assets.calendly.com; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://hebtx.chambermaster.com https://calendly.com https://assets.calendly.com https://*.supabase.co; frame-src 'self' https://calendly.com https://calendly.com https://accounts.google.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
          },
          {
            key: 'Permissions-Policy',
            value: 'unload=(), clipboard-read=(), clipboard-write=(self)'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      { source: '/rss.xml', destination: '/feed.xml', permanent: true },
      { source: '/rss', destination: '/feed.xml', permanent: true },
      { source: '/feed', destination: '/feed.xml', permanent: true },
      { source: '/atom.xml', destination: '/feed.xml', permanent: true },
      // 301 redirects for consolidated duplicate articles (keyword cannibalization fix)
      { source: '/blog/12-ai-pilot-readiness-checks', destination: '/blog/12-production-readiness-checks-for-ai-pilots', statusCode: 301 },
      { source: '/blog/12-ai-pilot-readiness-checks-for-production', destination: '/blog/12-production-readiness-checks-for-ai-pilots', statusCode: 301 },
      { source: '/blog/12-checks-for-ai-pilot-readiness', destination: '/blog/12-production-readiness-checks-for-ai-pilots', statusCode: 301 },
      { source: '/blog/12-ai-pilot-readiness-checks-for-deployment', destination: '/blog/12-production-readiness-checks-for-ai-pilots', statusCode: 301 },
      // 301 redirects for purged thin content (consolidated into stronger pages)
      { source: '/blog/securing-ai-systems-after-openai-containment-breach', destination: '/how-to-secure-and-govern-ai', statusCode: 301 },
      { source: '/blog/ai-compliance-guide-addressing-hugging-face-risks', destination: '/blog/seven-layers-ai-compliance-nist-iso-soc2', statusCode: 301 },
      // 301 redirect for consolidated HAIEC pages (single canonical page)
      { source: '/haiec', destination: '/solutions/haiec', statusCode: 301 },
      // 301 redirect for CSM short URL
      { source: '/csm', destination: '/cognitive-systems-management', statusCode: 301 },
      // 301 redirect for retired CSM6 name
      { source: '/csm6', destination: '/cognitive-systems-management', statusCode: 301 },
      { source: '/csm6/:path*', destination: '/cognitive-systems-management', statusCode: 301 },
      // 301 redirect for retired public advisor-desk dashboard (consolidated into /ai-advisor product page)
      { source: '/advisor-desk', destination: '/ai-advisor', statusCode: 301 },
      // 301 redirect for consolidated tenant isolation page into SaaS & AI Security Review
      { source: '/services/saas-tenant-isolation-audit', destination: '/saas-security-review', statusCode: 301 },
    ]
  },
}

module.exports = nextConfig
