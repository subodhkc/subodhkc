import { Metadata } from 'next'
import AssessmentClient from './assessment-client'

export const metadata: Metadata = {
  title: 'CSM 2.0 Reference Assessment | Subodh KC',
  description:
    'Interactive reference evaluator for CSM 2.0. Provide structured system facts and receive applicable requirements, evidence gaps and human review items.',
  alternates: {
    canonical: 'https://subodhkc.com/cognitive-systems-management/assessment',
  },
}

export default function AssessmentPage() {
  return <AssessmentClient />
}
