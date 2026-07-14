import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Subodh KC - AI Systems Architect & Governance Expert',
    short_name: 'Subodh KC',
    description: 'AI Systems Architect and Governance Expert. Former Fortune 50 AI Strategy CTL, founder of KestrelVoice, co-founder of HAIEC. Production AI systems at enterprise scale.',
    start_url: '/',
    display: 'standalone',
    background_color: '#2b2e33',
    theme_color: '#2b2e33',
    icons: [
      {
        src: '/icon-32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
