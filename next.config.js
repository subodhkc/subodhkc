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
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://hebtx.chambermaster.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://hebtx.chambermaster.com https://calendly.com; frame-src 'self' https://calendly.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
          },
          {
            key: 'Permissions-Policy',
            value: 'unload=(), clipboard-read=(), clipboard-write=(self)'
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
    ]
  },
}

module.exports = nextConfig
