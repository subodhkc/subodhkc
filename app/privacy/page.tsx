import Hero from '@/components/Hero'
import Section from '@/components/Section'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export const metadata = {
  title: 'Privacy Policy — Subodh KC',
  description: 'Privacy policy for subodhkc.com. How we collect, use, and protect your data.',
  keywords: [
    'privacy policy',
    'data privacy',
    'privacy protection',
    'data security',
    'GDPR compliance',
    'privacy statement',
    'user data protection',
    'privacy practices'
  ],
  alternates: {
    canonical: 'https://subodhkc.com/privacy',
  },
}

export default function PrivacyPage() {
  return (
    <>
      <Hero
        title="Privacy Policy"
        subtitle="Last updated: July 2026"
      />

      <Section>
        <div className="max-w-3xl mx-auto space-y-6">
          <Card>
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
              <p><strong className="text-foreground">Calendly Scheduling:</strong> The contact page includes a Calendly embed for scheduling consultations. Calendly may set its own cookies when you interact with the scheduling widget. See <a href="https://calendly.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Calendly&apos;s privacy policy</a> for details.</p>
            </CardContent>
          </Card>

          <Card>
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

          <Card>
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

          <Card>
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

          <Card>
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

          <Card>
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

          <Card>
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

          <Card>
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

          <Card>
            <CardHeader>
              <CardTitle>9. Contact</CardTitle>
              <CardDescription>
                Questions about this privacy policy? Contact us.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Subodh KC — AI Systems Architect &amp; Governance Expert</p>
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
