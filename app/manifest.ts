import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Subodh KC - AI Compliance Architect',
    short_name: 'Subodh KC',
    description: 'Leading AI Compliance Architect at Fortune 50, HAIEC founder, and Enterprise Technical Program Manager',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A1929',
    theme_color: '#2563EB',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
