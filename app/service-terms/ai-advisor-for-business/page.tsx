import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import Section from '@/components/Section'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'AI Advisor for Business — Service Terms | Subodh KC',
  description: 'Service terms and schedule for AI Advisor for Business subscriptions.',
  alternates: {
    canonical: 'https://subodhkc.com/service-terms/ai-advisor-for-business',
  },
  robots: { index: true, follow: true },
}

export default function AIAdvisorServiceTermsPage() {
  return (
    <>
      <Hero
        title="AI Advisor for Business — Service Terms"
        subtitle="Service Schedule v2026-08 · Last updated: August 2026"
      />

      <Section>
        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="bg-secondary/20">
            <CardHeader>
              <CardTitle className="text-lg">Quick Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <a href="#scope" className="text-primary hover:underline">1. Service Scope</a>
                <a href="#advisory-access" className="text-primary hover:underline">2. Advisory Access</a>
                <a href="#response" className="text-primary hover:underline">3. Response Expectations</a>
                <a href="#included-products" className="text-primary hover:underline">4. Included Products</a>
                <a href="#team" className="text-primary hover:underline">5. Team Members</a>
                <a href="#billing" className="text-primary hover:underline">6. Billing & Cancellation</a>
                <a href="#out-of-scope" className="text-primary hover:underline">7. Out of Scope</a>
                <a href="#data" className="text-primary hover:underline">8. Data & Confidentiality</a>
                <a href="#ip" className="text-primary hover:underline">9. Intellectual Property</a>
                <a href="#termination" className="text-primary hover:underline">10. Termination</a>
                <a href="#changes" className="text-primary hover:underline">11. Changes to Terms</a>
                <a href="#contact" className="text-primary hover:underline">12. Contact</a>
              </nav>
            </CardContent>
          </Card>

          <Card id="scope">
            <CardHeader>
              <CardTitle>1. Service Scope</CardTitle>
              <CardDescription>
                AI Advisor for Business is an ongoing human AI advisory subscription for leaders, founders, and technical teams. It provides weekly AI intelligence briefs, AI Controls Review, regulatory monitoring, vendor and tool guidance, hiring and policy support, opportunity discovery, and human advisory access for focused questions as decisions come up.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card id="advisory-access">
            <CardHeader>
              <CardTitle>2. Advisory Access</CardTitle>
              <CardContent className="pt-0 space-y-2 text-sm text-muted-foreground">
                <p>Advisory access is provided through the Advisory Desk workspace. No dedicated Slack, Teams, text, or phone channel is included.</p>
                <p>Advisory access is provided under a reasonable use model. There is no per-question metering. Brief guidance is included. If a request turns into substantive research, document review, architecture, or implementation, that work is separately scoped and priced. You approve scope and cost before any additional work begins.</p>
              </CardContent>
            </CardHeader>
          </Card>

          <Card id="response">
            <CardHeader>
              <CardTitle>3. Response Expectations</CardTitle>
              <CardContent className="pt-0 space-y-2 text-sm text-muted-foreground">
                <p>Most focused advisory questions are reviewed within 72 hours.</p>
                <p>No guaranteed emergency support. No 24/7 support. No managed incident response.</p>
                <p>Annual subscribers receive priority response queue placement.</p>
              </CardContent>
            </CardHeader>
          </Card>

          <Card id="included-products">
            <CardHeader>
              <CardTitle>4. Included Product Access</CardTitle>
              <CardContent className="pt-0 space-y-3 text-sm text-muted-foreground">
                <p><strong className="text-foreground">HAIEC SCAN:</strong> AI Law Finder, Check AI Apps vendor review, AI Readiness Assessment, CSM6 Governance Scorecard, Self-Audit, selected compliance assessments, limited static AI security scanning, one saved AI system context, web results and history. Excludes CI/CD, runtime adversarial testing, Compliance Twin, Evidence Vault, signed enterprise evidence bundles, unlimited scans, broad HAIEC team access, and managed compliance services.</p>
                <p><strong className="text-foreground">Kestrel Starter Phone ($5 plan):</strong> One AI phone number, basic AI answering, 20 included monthly credits, self-service configuration. Additional usage or upgrades are governed by Kestrel plan limits and are purchased separately within Kestrel.</p>
                <p><strong className="text-foreground">Selected Member Tools:</strong> Selected SubodhKC production-ready internal tools and utilities. Additional tools are added as they become available.</p>
                <p>HAIEC and Kestrel maintain their own product limits, acceptable-use terms, and upgrade paths. This advisory subscription does not create additional uptime or SLA guarantees for those products. Additional usage or upgrades are separate purchases within each product.</p>
              </CardContent>
            </CardHeader>
          </Card>

          <Card id="team">
            <CardHeader>
              <CardTitle>5. Team Members</CardTitle>
              <CardContent className="pt-0 text-sm text-muted-foreground">
                <p>Up to 3 team members may be added to the organization. Each team member receives workspace access subject to the organization&apos;s entitlement. No per-seat charges.</p>
              </CardContent>
            </CardHeader>
          </Card>

          <Card id="billing">
            <CardHeader>
              <CardTitle>6. Billing and Cancellation</CardTitle>
              <CardContent className="pt-0 space-y-2 text-sm text-muted-foreground">
                <p>Monthly: $99/month, billed monthly. Cancel before your next billing date and you will not be charged again.</p>
                <p>Annual: $990/year, billed annually. Equivalent of two months free compared to monthly billing.</p>
                <p>Cancellation takes effect at the end of the current billing period. Access continues until that date.</p>
                <p>Payment failure may result in suspension of access after Stripe&apos;s retry cycle is exhausted.</p>
              </CardContent>
            </CardHeader>
          </Card>

          <Card id="out-of-scope">
            <CardHeader>
              <CardTitle>7. Out of Scope</CardTitle>
              <CardContent className="pt-0 space-y-2 text-sm text-muted-foreground">
                <p>The following are not included in the $99/month subscription and require separate engagement:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Deeper research, document review, architecture work, or implementation</li>
                  <li>Continuous monitoring or managed services</li>
                  <li>Legal advice (consult a licensed attorney for regulatory compliance obligations)</li>
                  <li>Dedicated executive advisory with working sessions (see Fractional AI Advisor)</li>
                  <li>Emergency or 24/7 support</li>
                </ul>
                <p>If a request turns into out-of-scope work, I will identify that before doing additional work and offer a scoped option. No automatic charges. No surprise scope.</p>
              </CardContent>
            </CardHeader>
          </Card>

          <Card id="data">
            <CardHeader>
              <CardTitle>8. Data and Confidentiality</CardTitle>
              <CardContent className="pt-0 space-y-2 text-sm text-muted-foreground">
                <p>Information you share through the workspace is used to provide advisory context. You control what context is shared and can edit it at any time.</p>
                <p>Client-provided materials are treated as confidential. They are not shared with third parties without consent.</p>
                <p>See the Privacy Policy for details on data handling.</p>
              </CardContent>
            </CardHeader>
          </Card>

          <Card id="ip">
            <CardHeader>
              <CardTitle>9. Intellectual Property</CardTitle>
              <CardContent className="pt-0 space-y-2 text-sm text-muted-foreground">
                <p>Advisor methodologies, frameworks, and tools remain the intellectual property of Subodh KC. You retain ownership of all client-provided materials and your organizational context.</p>
                <p>Advisory content provided to you may be used internally within your organization. Redistribution or resale of advisor methodologies, frameworks, or tools is not permitted without separate agreement.</p>
              </CardContent>
            </CardHeader>
          </Card>

          <Card id="termination">
            <CardHeader>
              <CardTitle>10. Termination and Post-Cancellation Access</CardTitle>
              <CardContent className="pt-0 space-y-2 text-sm text-muted-foreground">
                <p>You may cancel at any time. Cancellation takes effect at the end of the current billing period.</p>
                <p>After cancellation, you retain standard account data access. Included HAIEC and Kestrel entitlements end according to the applicable subscription or product termination logic.</p>
                <p>Subodh KC may terminate access for violation of acceptable use terms or Terms of Service.</p>
              </CardContent>
            </CardHeader>
          </Card>

          <Card id="changes">
            <CardHeader>
              <CardTitle>11. Changes to These Terms</CardTitle>
              <CardContent className="pt-0 text-sm text-muted-foreground">
                <p>Material changes to these service terms will be communicated to active subscribers. Continued use after the effective date constitutes acceptance. The version label indicates the current version.</p>
              </CardContent>
            </CardHeader>
          </Card>

          <Card id="contact">
            <CardHeader>
              <CardTitle>12. Contact</CardTitle>
              <CardContent className="pt-0 text-sm text-muted-foreground">
                <p>Questions about these service terms: <a href="mailto:subodhkc@subodhkc.com" className="text-primary hover:underline">subodhkc@subodhkc.com</a></p>
              </CardContent>
            </CardHeader>
          </Card>

          <Card className="bg-secondary/20">
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground">
                This Service Schedule is incorporated into and governed by the Subodh KC Terms of Service. In the event of a conflict between this Schedule and the general Terms, this Schedule controls for AI Advisor for Business subscriptions.
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  )
}
