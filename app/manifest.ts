import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Subodh KC - AI Compliance Architect',
    short_name: 'Subodh KC',
    description: 'Leading AI Compliance Architect at Fortune 50, HAIEC founder, and Enterprise Technical Program Manager',
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
