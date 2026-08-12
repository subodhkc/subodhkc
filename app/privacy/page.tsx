import Hero from '@/components/Hero'
import Section from '@/components/Section'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

const privacySchema = {
  '@context': 'https://schema.org',
  '@type': 'LegalDocument',
  name: 'Privacy Policy',
  description: 'GDPR and CCPA compliant privacy policy for subodhkc.com covering data collection, use, storage, and user rights.',
  url: 'https://subodhkc.com/privacy',
  datePublished: '2026-07-01',
  dateModified: '2026-07-29',
  publisher: {
    '@type': 'Person',
    name: 'Subodh KC',
    email: 'subodhkc@subodhkc.com',
    url: 'https://subodhkc.com'
  },
  jurisdiction: ['GDPR', 'CCPA'],
  inLanguage: 'en-US'
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What personal information do you collect?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We collect information you provide directly through forms, including name, email, company, and message content. We also collect privacy-conscious analytics data including page views, referrers, and session IDs with hashed IP addresses.'
      }
    },
    {
      '@type': 'Question',
      name: 'Do you sell my personal information?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, we do not sell, rent, or share your personal information with third parties for marketing purposes. We only share data with service providers necessary to operate our website and deliver services.'
      }
    },
    {
      '@type': 'Question',
      name: 'How can I delete my data?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can request deletion of your data by contacting us at subodhkc@subodhkc.com. We will respond to your request within 30 days for GDPR/CCPA compliance.'
      }
    },
    {
      '@type': 'Question',
      name: 'How long do you retain my data?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Analytics data is retained for up to 90 days. Email and newsletter data is retained until you unsubscribe or request deletion. Contact form submissions are retained for up to 12 months.'
      }
    },
    {
      '@type': 'Question',
      name: 'Do you use tracking cookies?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We use sessionStorage to generate anonymous session IDs for analytics, which is cleared when you close your browser. We do not use third-party tracking cookies, advertising cookies, or social media pixels.'
      }
    }
  ]
}

export const metadata = {
  title: 'Privacy Policy - Subodh KC',
  description: 'Learn how Subodh KC collects, uses, and protects your data. GDPR and CCPA compliant privacy policy covering analytics, email, and contact forms.',
  keywords: [
    'privacy policy',
    'data privacy',
    'privacy protection',
    'data security',
    'GDPR compliance',
    'CCPA compliance',
    'privacy statement',
    'user data protection',
    'privacy practices',
    'data retention',
    'cookie policy'
  ],
  alternates: {
    canonical: 'https://subodhkc.com/privacy',
  },
  openGraph: {
    title: 'Privacy Policy - Subodh KC',
    description: 'GDPR and CCPA compliant privacy policy for subodhkc.com',
    url: 'https://subodhkc.com/privacy',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy - Subodh KC',
    description: 'GDPR and CCPA compliant privacy policy for subodhkc.com',
  },
}

export default function PrivacyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Hero
        title="Privacy Policy"
        subtitle="Last updated: July 2026"
      />

      <Section>
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Table of Contents */}
          <Card className="bg-secondary/20">
            <CardHeader>
              <CardTitle className="text-lg">Quick Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <a href="#information-collect" className="text-primary hover:underline">1. Information We Collect</a>
                <a href="#how-use" className="text-primary hover:underline">2. How We Use Information</a>
                <a href="#data-storage" className="text-primary hover:underline">3. Data Storage & Security</a>
                <a href="#cookies" className="text-primary hover:underline">4. Cookies</a>
                <a href="#rights" className="text-primary hover:underline">5. Your Rights</a>
                <a href="#retention" className="text-primary hover:underline">6. Data Retention</a>
                <a href="#children" className="text-primary hover:underline">7. Children&apos;s Privacy</a>
                <a href="#changes" className="text-primary hover:underline">8. Changes to Policy</a>
                <a href="#legal-basis" className="text-primary hover:underline">10. Legal Basis</a>
                <a href="#international" className="text-primary hover:underline">11. International Transfers</a>
                <a href="#breach" className="text-primary hover:underline">12. Breach Notification</a>
                <a href="#portability" className="text-primary hover:underline">13. Data Portability</a>
                <a href="#object" className="text-primary hover:underline">14. Right to Object</a>
                <a href="#california" className="text-primary hover:underline">15. California Residents</a>
                <a href="#dnt" className="text-primary hover:underline">16. Do Not Track</a>
                <a href="#third-party" className="text-primary hover:underline">17. Third-Party Services</a>
                <a href="#contact" className="text-primary hover:underline">18. Contact</a>
              </nav>
            </CardContent>
          </Card>

          <Card id="information-collect">
            <CardHeader>
              <CardTitle>1. Information We Collect</CardTitle>
              <CardDescription>
                We collect information you provide directly to us through forms, newsletter subscriptions,
                and contact submissions. This may include your name, email address, company, and message content.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p><strong className="text-foreground">Analytics Data:</strong> We collect privacy-conscious analytics including page views, referrers, session IDs, and event interactions. IP addresses are hashed and never stored in plain text.</p>
              <p><strong className="text-foreground">Contact Form:</strong> When you submit the contact form, we collect your name, email, company, area of interest, and message.</p>
              <p><strong className="text-foreground">Newsletter:</strong> When you subscribe, we store your email address with our email provider (Resend) to deliver newsletter content.</p>
              <p><strong className="text-foreground">Product Downloads &amp; Waitlists:</strong> When you request a product download (e.g., Print Later, PDF Redactor) or join a waitlist (e.g., CourtCase, SKC Log Analyser), we collect your email address to deliver the download link or notify you when the product is available. For enterprise pricing requests (e.g., Doc Timeline Generator), we also collect your name, company, use case, and expected volume.</p>
              <p><strong className="text-foreground">Webinar &amp; Course Registration:</strong> When you register for a webinar or course, we collect your name, email, and any questions you submit.</p>
              <p><strong className="text-foreground">School Pickup Operations:</strong> For organizations using the School Pickup application, we store school site information, staff assignments, student records (name, grade, classroom, dismissal group), pickup credentials (QR codes), dismissal session data, and queue events. Student data is entered by authorized school staff. We do not collect student data directly from students or parents at this time.</p>
              <p><strong className="text-foreground">Calendly Scheduling:</strong> The contact page includes a Calendly embed for scheduling consultations. Calendly may set its own cookies when you interact with the scheduling widget. See <a href="https://calendly.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Calendly&apos;s privacy policy</a> for details.</p>
            </CardContent>
          </Card>

          <Card id="how-use">
            <CardHeader>
              <CardTitle>2. How We Use Your Information</CardTitle>
              <CardDescription>
                We use your information to respond to inquiries, deliver newsletter content, improve our website, and analyze traffic patterns.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
              <p>We use your data to:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Respond to your contact form submissions</li>
                <li>Deliver newsletter emails you have opted into</li>
                <li>Analyze website traffic in aggregate (no individual tracking)</li>
                <li>Improve our content and user experience</li>
              </ul>
            </CardContent>
          </Card>

          <Card id="data-storage">
            <CardHeader>
              <CardTitle>3. Data Storage &amp; Security</CardTitle>
              <CardDescription>
                Your data is stored securely with trusted providers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p><strong className="text-foreground">Email Service:</strong> We use Resend (resend.com) for email delivery and contact management. Resend is GDPR-compliant and SOC 2 Type II certified.</p>
              <p><strong className="text-foreground">Analytics:</strong> Analytics data is stored in Supabase (supabase.com) with row-level security. IP addresses are hashed and cannot be reversed.</p>
              <p><strong className="text-foreground">Hosting:</strong> This website is hosted on Vercel (vercel.com) with HTTPS encryption.</p>
            </CardContent>
          </Card>

          <Card id="cookies">
            <CardHeader>
              <CardTitle>4. Cookies</CardTitle>
              <CardDescription>
                We use minimal cookies and local storage for session tracking.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>We use <code className="bg-secondary px-1.5 py-0.5 rounded text-xs">sessionStorage</code> to generate anonymous session IDs for analytics. This data is cleared when you close your browser.</p>
              <p>We do not use third-party tracking cookies, advertising cookies, or social media pixels.</p>
            </CardContent>
          </Card>

          <Card id="rights">
            <CardHeader>
              <CardTitle>5. Your Rights</CardTitle>
              <CardDescription>
                You have the right to access, correct, or delete your personal data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p><strong className="text-foreground">Unsubscribe:</strong> You can unsubscribe from our newsletter at any time using the unsubscribe link in any email or by visiting our <a href="/unsubscribe" className="text-primary hover:underline">unsubscribe page</a>.</p>
              <p><strong className="text-foreground">Data Deletion:</strong> To request deletion of your data, contact us at <a href="mailto:subodhkc@subodhkc.com" className="text-primary hover:underline">subodhkc@subodhkc.com</a>.</p>
              <p><strong className="text-foreground">GDPR/CCPA:</strong> If you are located in the EU or California, you have additional rights under GDPR or CCPA. We will respond to your request within 30 days.</p>
            </CardContent>
          </Card>

          <Card id="retention">
            <CardHeader>
              <CardTitle>6. Data Retention</CardTitle>
              <CardDescription>
                We retain your data only as long as necessary for the purposes described in this policy.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p><strong className="text-foreground">Analytics Data:</strong> Retained for up to 90 days, after which it is automatically purged.</p>
              <p><strong className="text-foreground">Email &amp; Newsletter Data:</strong> Retained until you unsubscribe or request deletion. Product download and waitlist emails are retained for the duration of the product&apos;s lifecycle or until you request removal.</p>
              <p><strong className="text-foreground">Contact Form Submissions:</strong> Retained for up to 12 months to respond to inquiries and for record-keeping.</p>
            </CardContent>
          </Card>

          <Card id="children">
            <CardHeader>
              <CardTitle>7. Children&apos;s Privacy</CardTitle>
              <CardDescription>
                Our website is not directed to children under 13.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child, please contact us and we will promptly delete it.</p>
            </CardContent>
          </Card>

          <Card id="changes">
            <CardHeader>
              <CardTitle>8. Changes to This Policy</CardTitle>
              <CardDescription>
                We may update this privacy policy from time to time.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>We will update the &quot;Last updated&quot; date at the top of this page whenever we make changes. For significant changes, we will notify you via email or a prominent notice on the website.</p>
            </CardContent>
          </Card>

          <Card id="legal-basis">
            <CardHeader>
              <CardTitle>10. Legal Basis for Processing</CardTitle>
              <CardDescription>
                We process your data on specific legal grounds as required by GDPR.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p><strong className="text-foreground">Contractual Necessity:</strong> When you submit a contact form, register for a webinar/course, or request product information, we process your data to fulfill your request and provide the services you requested.</p>
              <p><strong className="text-foreground">Legitimate Interest:</strong> We process analytics data to improve our website, understand user behavior, and ensure security. We use hashed IP addresses and anonymous session IDs to minimize privacy impact.</p>
              <p><strong className="text-foreground">Consent:</strong> When you subscribe to our newsletter, we process your email address based on your explicit consent. You may withdraw consent at any time by unsubscribing.</p>
            </CardContent>
          </Card>

          <Card id="international">
            <CardHeader>
              <CardTitle>11. International Data Transfers</CardTitle>
              <CardDescription>
                Your data may be transferred to and processed in countries outside your jurisdiction.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>We use third-party service providers that may store and process your data in the United States and other countries. These providers include:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Resend</strong> - Email delivery (United States)</li>
                <li><strong>Supabase</strong> - Analytics storage (United States)</li>
                <li><strong>Vercel</strong> - Website hosting (United States)</li>
                <li><strong>Calendly</strong> - Scheduling widget (United States)</li>
              </ul>
              <p>When we transfer data outside the European Economic Area, we ensure appropriate safeguards are in place, including EU Standard Contractual Clauses (SCCs) where applicable, and that the receiving country provides an adequate level of data protection.</p>
            </CardContent>
          </Card>

          <Card id="breach">
            <CardHeader>
              <CardTitle>12. Data Breach Notification</CardTitle>
              <CardDescription>
                We will notify you in the event of a data security breach.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p><strong className="text-foreground">GDPR:</strong> If a breach poses a risk to your rights and freedoms, we will notify you without undue delay and within 72 hours of becoming aware of the breach.</p>
              <p><strong className="text-foreground">CCPA:</strong> If a breach compromises your personal information, we will notify you within 30 days of discovery.</p>
              <p>We will describe the nature of the breach, the categories of data involved, the steps we are taking to address the breach, and how you can protect yourself.</p>
            </CardContent>
          </Card>

          <Card id="portability">
            <CardHeader>
              <CardTitle>13. Data Portability</CardTitle>
              <CardDescription>
                You have the right to receive a copy of your personal data in a structured format.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Upon request, we will provide you with a machine-readable copy of the personal data we hold about you, including contact form submissions, newsletter subscription status, and product waitlist information. To request your data, contact us at <a href="mailto:subodhkc@subodhkc.com" className="text-primary hover:underline">subodhkc@subodhkc.com</a>.</p>
            </CardContent>
          </Card>

          <Card id="object">
            <CardHeader>
              <CardTitle>14. Right to Object</CardTitle>
              <CardDescription>
                You have the right to object to certain types of data processing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>You may object to processing based on legitimate interest at any time. We will stop processing your data unless we can demonstrate compelling legitimate grounds for the processing that override your interests, rights, and freedoms, or for the establishment, exercise, or defense of legal claims.</p>
              <p>To exercise your right to object, contact us at <a href="mailto:subodhkc@subodhkc.com" className="text-primary hover:underline">subodhkc@subodhkc.com</a>.</p>
            </CardContent>
          </Card>

          <Card id="california">
            <CardHeader>
              <CardTitle>15. California Residents</CardTitle>
              <CardDescription>
                Additional rights for California residents under the California Consumer Privacy Act (CCPA).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p><strong className="text-foreground">Right to Know:</strong> You have the right to request disclosure of the categories and specific pieces of personal information we have collected about you.</p>
              <p><strong className="text-foreground">Right to Delete:</strong> You have the right to request deletion of your personal information, subject to certain exceptions.</p>
              <p><strong className="text-foreground">Right to Opt-Out:</strong> We do not sell your personal information. If we were to sell personal information in the future, you would have the right to opt-out.</p>
              <p><strong className="text-foreground">Non-Discrimination:</strong> We will not discriminate against you for exercising your CCPA rights.</p>
              <p>To exercise your CCPA rights, contact us at <a href="mailto:subodhkc@subodhkc.com" className="text-primary hover:underline">subodhkc@subodhkc.com</a>.</p>
            </CardContent>
          </Card>

          <Card id="dnt">
            <CardHeader>
              <CardTitle>16. Do Not Track</CardTitle>
              <CardDescription>
                Our response to Do Not Track signals.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>We do not respond to browser Do Not Track signals. However, we do not use third-party tracking cookies or advertising pixels, so your browsing activity on our website is not tracked for advertising purposes regardless of your DNT setting.</p>
            </CardContent>
          </Card>

          <Card id="third-party">
            <CardHeader>
              <CardTitle>17. Third-Party Services</CardTitle>
              <CardDescription>
                We use third-party services to operate our website and deliver services.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>We do not sell your personal information to third parties. We only share data with the following service providers as necessary to operate our website and deliver services:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Resend</strong> - Email delivery and newsletter management</li>
                <li><strong>Supabase</strong> - Analytics data storage</li>
                <li><strong>Vercel</strong> - Website hosting and infrastructure</li>
                <li><strong>Calendly</strong> - Appointment scheduling (only when you interact with the widget)</li>
              </ul>
              <p>Each of these providers has its own privacy policy governing its use of your data. We encourage you to review their policies.</p>
            </CardContent>
          </Card>

          <Card id="contact">
            <CardHeader>
              <CardTitle>18. Contact</CardTitle>
              <CardDescription>
                Questions about this privacy policy? Contact us.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Subodh KC - AI Systems Architect &amp; Governance Expert</p>
              <p>Dallas, Texas, USA</p>
              <p>Email: <a href="mailto:subodhkc@subodhkc.com" className="text-primary hover:underline">subodhkc@subodhkc.com</a></p>
              <p>Website: <a href="https://subodhkc.com" className="text-primary hover:underline">subodhkc.com</a></p>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-3xl mx-auto mt-12 flex flex-wrap items-center justify-center gap-4">
          <span className="text-xs uppercase tracking-wider text-muted-foreground mr-2">Listed on</span>
          <a
            href="https://startupbase.io/products/ai-advisor-subodh-kc?utm_source=startupbase&utm_medium=badge&utm_campaign=featured-badge-dark"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://statics.startupbase.io/site/badges/featured-on-sb-dark.svg"
              alt="Featured on StartupBase"
              style={{ height: 32, width: "auto" }}
            />
          </a>
          <a
            href="https://postyourstartup.co/startup/subodh-kc?ref=badge"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://postyourstartup.co/api/badge/subodh-kc?theme=dark"
              alt="Featured on PostYourStartup"
              width={212}
              height={55}
              style={{ height: 55, width: "auto" }}
            />
          </a>
        </div>
      </Section>
    </>
  )
}
