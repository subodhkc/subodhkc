import { Metadata } from 'next'
import ContractsClient from './contracts-client'

export const metadata: Metadata = {
  title: 'CSM 2.0 Governance Contracts | Subodh KC',
  description:
    'Browsable reference for all 16 CSM 2.0 governance contracts. Filter by domain, execution function or component.',
  alternates: {
    canonical: 'https://subodhkc.com/cognitive-systems-management/contracts',
  },
}

export default function ContractsPage() {
  return <ContractsClient />
}
