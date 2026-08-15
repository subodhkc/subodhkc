import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import Section from '@/components/Section'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Terms of Service - Subodh KC',
  description: 'Terms of Service for subodhkc.com, including acceptable use, intellectual property, and service terms.',
  alternates: {
    canonical: 'https://subodhkc.com/terms',
  },
  openGraph: {
    title: 'Terms of Service - Subodh KC',
    description: 'Terms of Service for subodhkc.com',
    url: 'https://subodhkc.com/terms',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function TermsPage() {
  return (
    <>
      <Hero
        title="Terms of Service"
        subtitle="Last updated: August 2026"
      />

      <Section>
        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="bg-secondary/20">
            <CardHeader>
              <CardTitle className="text-lg">Quick Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <a href="#acceptance" className="text-primary hover:underline">1. Acceptance of Terms</a>
                <a href="#services" className="text-primary hover:underline">2. Description of Services</a>
                <a href="#accounts" className="text-primary hover:underline">3. Accounts & Access</a>
                <a href="#acceptable-use" className="text-primary hover:underline">4. Acceptable Use</a>
                <a href="#ip" className="text-primary hover:underline">5. Intellectual Property</a>
                <a href="#user-content" className="text-primary hover:underline">6. User Content</a>
                <a href="#disclaimer" className="text-primary hover:underline">7. Disclaimer</a>
                <a href="#liability" className="text-primary hover:underline">8. Limitation of Liability</a>
                <a href="#indemnity" className="text-primary hover:underline">9. Indemnification</a>
                <a href="#termination" className="text-primary hover:underline">10. Termination</a>
                <a href="#changes" className="text-primary hover:underline">11. Changes to Terms</a>
                <a href="#contact" className="text-primary hover:underline">12. Contact</a>
              </nav>
            </CardContent>
          </Card>

          <Card id="acceptance">
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
              <CardDescription>
                By accessing or using subodhkc.com, you agree to be bound by these Terms of Service.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>If you do not agree to these terms, you must not access or use the website or any services provided.</p>
              <p>These terms apply to all visitors, including browsers, registered users, and clients of our products and services.</p>
            </CardContent>
          </Card>

          <Card id="services">
            <CardHeader>
              <CardTitle>2. Description of Services</CardTitle>
              <CardDescription>
                Subodh KC provides AI governance advisory, compliance tools, and operational software.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p><strong className="text-foreground">Website:</strong> Public content including articles, guides, research, and contact forms.</p>
              <p><strong className="text-foreground">Application Platform:</strong> Authenticated workspace providing tools including but not limited to School Pickup management, compliance frameworks, and analytics.</p>
              <p><strong className="text-foreground">Advisory & Consulting:</strong> AI governance, compliance, and strategy services delivered under separate engagement agreements.</p>
              <p>Specific product terms may supplement these Terms. In case of conflict, the specific product terms govern for that product.</p>
            </CardContent>
          </Card>

          <Card id="accounts">
            <CardHeader>
              <CardTitle>3. Accounts & Access</CardTitle>
              <CardDescription>
                Access to authenticated services requires an authorized account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p><strong className="text-foreground">Authentication:</strong> Accounts are created through Google OAuth or by invitation from an organization administrator.</p>
              <p><strong className="text-foreground">Authorization:</strong> Your access level is determined by your organization membership, role, and entitlements. Unauthorized access attempts are prohibited.</p>
              <p><strong className="text-foreground">Account Security:</strong> You are responsible for maintaining the security of your authentication credentials and for all activities under your account.</p>
              <p><strong className="text-foreground">Multi-Tenant Isolation:</strong> You may only access data within organizations and sites where you have been explicitly granted access.</p>
            </CardContent>
          </Card>

          <Card id="acceptable-use">
            <CardHeader>
              <CardTitle>4. Acceptable Use</CardTitle>
              <CardDescription>
                You agree not to misuse the services or engage in prohibited activities.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>You agree not to:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Access data outside your authorized organizations or sites</li>
                <li>Attempt to bypass security controls, RLS policies, or authentication</li>
                <li>Use the services for any unlawful purpose</li>
                <li>Reverse engineer, decompile, or disassemble any part of the platform</li>
                <li>Scrape, crawl, or systematically extract data without permission</li>
                <li>Introduce malware, viruses, or harmful code</li>
                <li>Share, transfer, or sell your account access to third parties</li>
                <li>Use the services in a manner that could damage, disable, or impair the platform</li>
              </ul>
            </CardContent>
          </Card>

          <Card id="ip">
            <CardHeader>
              <CardTitle>5. Intellectual Property</CardTitle>
              <CardDescription>
                All content and software on this platform is protected by intellectual property laws.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p><strong className="text-foreground">Ownership:</strong> The website, application platform, content, software, frameworks (including CSM, HAIEC), and brand are owned by Subodh KC.</p>
              <p><strong className="text-foreground">License:</strong> You are granted a limited, non-exclusive, non-transferable license to use the services for their intended purpose during your authorized access period.</p>
              <p><strong className="text-foreground">Frameworks:</strong> Governance frameworks published on this site (CSM, HAIEC) may have separate licensing terms. Refer to their respective documentation.</p>
              <p><strong className="text-foreground">Third-Party Content:</strong> Third-party tools and libraries are governed by their respective licenses.</p>
            </CardContent>
          </Card>

          <Card id="user-content">
            <CardHeader>
              <CardTitle>6. User Content</CardTitle>
              <CardDescription>
                Content you submit to the platform is subject to these terms.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p><strong className="text-foreground">Definition:</strong> User content includes contact form submissions, organization data, student records, staff assignments, and any information uploaded to authenticated services.</p>
              <p><strong className="text-foreground">Responsibility:</strong> You are responsible for the accuracy and legality of data you submit. For school pickup services, you are responsible for obtaining necessary consents for storing student information.</p>
              <p><strong className="text-foreground">License:</strong> You grant Subodh KC a license to process, store, and display your content as necessary to provide the services.</p>
              <p><strong className="text-foreground">Data Retention:</strong> See our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a> for data retention practices.</p>
            </CardContent>
          </Card>

          <Card id="disclaimer">
            <CardHeader>
              <CardTitle>7. Disclaimer of Warranties</CardTitle>
              <CardDescription>
                The services are provided "as is" without warranties of any kind.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>To the fullest extent permitted by law, Subodh KC disclaims all warranties, express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.</p>
              <p>We do not warrant that the services will be uninterrupted, error-free, or secure. We do not warrant the accuracy, completeness, or reliability of any content.</p>
              <p>AI governance frameworks and advisory content are informational and do not constitute legal advice. Consult qualified legal counsel for compliance obligations.</p>
            </CardContent>
          </Card>

          <Card id="liability">
            <CardHeader>
              <CardTitle>8. Limitation of Liability</CardTitle>
              <CardDescription>
                Our liability is limited to the extent permitted by law.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>To the fullest extent permitted by law, Subodh KC shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, arising from your use of the services.</p>
              <p>Our total liability for any claim arising from these terms shall not exceed the amount you paid for the services in the twelve (12) months preceding the claim, or one hundred dollars ($100), whichever is greater.</p>
            </CardContent>
          </Card>

          <Card id="indemnity">
            <CardHeader>
              <CardTitle>9. Indemnification</CardTitle>
              <CardDescription>
                You agree to indemnify Subodh KC against certain claims.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>You agree to indemnify and hold harmless Subodh KC from and against any claims, damages, losses, and expenses (including reasonable attorney fees) arising from your violation of these terms or your misuse of the services.</p>
            </CardContent>
          </Card>

          <Card id="termination">
            <CardHeader>
              <CardTitle>10. Termination</CardTitle>
              <CardDescription>
                We may suspend or terminate access at any time.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>We may suspend or terminate your access to the services at any time, with or without cause, and with or without notice.</p>
              <p>Upon termination, your right to use the services ceases immediately. Organization data may be retained according to our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.</p>
              <p>You may stop using the services at any time. If you wish to delete your account and data, contact us at <a href="mailto:admin@subodhkc.com" className="text-primary hover:underline">admin@subodhkc.com</a>.</p>
            </CardContent>
          </Card>

          <Card id="changes">
            <CardHeader>
              <CardTitle>11. Changes to These Terms</CardTitle>
              <CardDescription>
                We may update these terms from time to time.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>We will update the "Last updated" date at the top of this page whenever we make changes. For significant changes, we will provide notice through the website or via email. Continued use of the services after changes constitutes acceptance of the updated terms.</p>
            </CardContent>
          </Card>

          <Card id="contact">
            <CardHeader>
              <CardTitle>12. Contact</CardTitle>
              <CardDescription>
                Questions about these terms? Contact us.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Subodh KC - AI Systems Architect &amp; Governance Expert</p>
              <p>Dallas, Texas, USA</p>
              <p>Email: <a href="mailto:admin@subodhkc.com" className="text-primary hover:underline">admin@subodhkc.com</a></p>
              <p>Website: <a href="https://subodhkc.com" className="text-primary hover:underline">subodhkc.com</a></p>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  )
}
