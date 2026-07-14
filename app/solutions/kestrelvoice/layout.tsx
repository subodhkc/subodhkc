import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'KestrelVoice — AI Voice Operations & Receptionist | Subodh KC',
  description:
    'KestrelVoice: production AI voice operations platform. Answer every call, book appointments, run the front desk 24/7. Built for customer-facing operations at scale.',
  alternates: {
    canonical: 'https://subodhkc.com/solutions/kestrelvoice',
  },
}

export default function KestrelVoiceLayout({ children }: { children: React.ReactNode }) {
  return children
}
