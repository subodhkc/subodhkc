import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import Section from '@/components/Section'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Fractional AI Advisor — Service Terms | Subodh KC',
  description: 'Service terms and schedule for Fractional AI Advisor subscriptions.',
  alternates: {
    canonical: 'https://subodhkc.com/service-terms/fractional-ai-advisor',
  },
  robots: { index: false, follow: true },
}

export default function FractionalAdvisorServiceTermsPage() {
  return (
    <>
      <Hero
        title="Fractional AI Advisor — Service Terms"
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
                <a href="#activation" className="text-primary hover:underline">2. Activation Call</a>
                <a href="#sessions" className="text-primary hover:underline">3. Working Sessions</a>
                <a href="#async" className="text-primary hover:underline">4. Async Advisory</a>
                <a href="#included" className="text-primary hover:underline">5. Included Products</a>
                <a href="#affiliation" className="text-primary hover:underline">6. Advisor Affiliation</a>
                <a href="#billing" className="text-primary hover:underline">7. Billing & Cancellation</a>
                <a href="#out-of-scope" className="text-primary hover:underline">8. Out of Scope</a>
                <a href="#confidentiality" className="text-primary hover:underline">9. Confidentiality</a>
                <a href="#ip" className="text-primary hover:underline">10. Intellectual Property</a>
                <a href="#termination" className="text-primary hover:underline">11. Termination & Exit</a>
                <a href="#conflicts" className="text-primary hover:underline">12. Conflicts</a>
                <a href="#relationship" className="text-primary hover:underline">13. Relationship</a>
                <a href="#changes" className="text-primary hover:underline">14. Changes</a>
              </nav>
            </CardContent>
          </Card>

          <Card id="scope">
            <CardHeader>
              <CardTitle>1. Service Scope</CardTitle>
              <CardDescription>
                Fractional AI Advisor is an executive AI advisory subscription for higher-stakes, interconnected, and ongoing AI decisions. It includes two 60-minute working sessions per month, priority async advisory, persistent organizational context, Decision Registry, Opportunity Registry, evidence and context intake, vendor evaluation, build/buy/configure/wait analysis, architecture review, roadmap review, operating-model guidance, implementation sequencing, selected written decision artifacts, Monthly Decision and Opportunity Brief, actions and commitments, decision history, outcome and learning records, and value record where supported by client-verified evidence.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card id="activation">
            <CardHeader>
              <CardTitle>2. Complimentary Activation Call</CardTitle>
              <CardContent className="pt-0 space-y-2 text-sm text-muted-foreground">
                <p>After payment, the relationship begins with digital context setup and a complimentary 20-minute Activation Call, followed by the first real working session.</p>
                <p>The Activation Call does not count against the two monthly working sessions. It is used to establish current priorities, 1-3 decisions in play, 1-3 opportunities worth investigating, current AI systems and vendors, important stakeholders, immediate deadlines, and communication expectations.</p>
                <p>The Activation Call is not a consulting session.</p>
              </CardContent>
            </CardHeader>
          </Card>

          <Card id="sessions">
            <CardHeader>
              <CardTitle>3. Working Sessions</CardTitle>
              <CardContent className="pt-0 space-y-2 text-sm text-muted-foreground">
                <p>Two 60-minute executive or technical working sessions are included each month.</p>
                <p>One unused session may carry into the immediately following month. It expires after that month. Sessions do not accumulate indefinitely.</p>
                <p>Rescheduling requires reasonable advance notice.</p>
                <p>Sessions are scheduled calls. The workspace remains the system of record between sessions.</p>
              </CardContent>
            </CardHeader>
          </Card>

          <Card id="async">
            <CardHeader>
              <CardTitle>4. Asynchronous Advisory Expectations</CardTitle>
              <CardContent className="pt-0 space-y-2 text-sm text-muted-foreground">
                <p>Priority asynchronous requests are normally acknowledged within one business day.</p>
                <p>Substantive responses are normally provided within two business days when reasonably within Fractional advisory scope.</p>
                <p>This is not an SLA. This is an Advisory Service Expectation.</p>
                <p>Fractional AI Advisor is not 24/7 support, managed incident response, or emergency technical support.</p>
              </CardContent>
            </CardHeader>
          </Card>

          <Card id="included">
            <CardHeader>
              <CardTitle>5. Included Product Access</CardTitle>
              <CardContent className="pt-0 space-y-3 text-sm text-muted-foreground">
                <p><strong className="text-foreground">HAIEC SCAN:</strong> One HAIEC SCAN-level entitlement seat, aligned to the current HAIEC SCAN product. Higher HAIEC tiers, additional seats, runtime testing, CI/CD, enterprise evidence bundles, implementation, and managed compliance remain separately purchased or scoped.</p>
                <p><strong className="text-foreground">Kestrel AI Number Basic:</strong> One AI phone number with basic AI answering, 20 included monthly credits, self-service configuration. Additional usage or upgrades are governed by Kestrel plan limits and are purchased separately within Kestrel.</p>
                <p><strong className="text-foreground">Member Tool Library:</strong> Production-ready internal decision, architecture, research, and technical utilities available to advisory clients.</p>
                <p>HAIEC and Kestrel maintain their own product limits, acceptable-use terms, and upgrade paths. This advisory subscription does not create additional uptime or SLA guarantees for those products.</p>
              </CardContent>
            </CardHeader>
          </Card>

          <Card id="affiliation">
            <CardHeader>
              <CardTitle>6. Advisor Affiliation</CardTitle>
              <CardContent className="pt-0 space-y-2 text-sm text-muted-foreground">
                <p>An active Fractional client may, with approval, identify Subodh KC as Fractional AI Advisor or External AI Advisor in appropriate materials, including team pages, proposals, partner discussions, investor materials, customer materials, and internal leadership materials.</p>
                <p>The relationship can include identifying and evaluating strategic partnerships, technology partnerships, vendors, programs, external opportunities, and introductions where appropriate. This is exploration and evaluation support, not a promise of introductions or partnerships.</p>
                <p>This does not create employment, officer status, agency, fiduciary authority, or authority to bind either party.</p>
                <p>Public quotes, press releases, logos, or alternative titles require approval.</p>
              </CardContent>
            </CardHeader>
          </Card>

          <Card id="billing">
            <CardHeader>
              <CardTitle>7. Billing and Cancellation</CardTitle>
              <CardContent className="pt-0 space-y-2 text-sm text-muted-foreground">
                <p>Monthly: $1,250/month, billed monthly. Cancel before your next billing date and you will not be charged again.</p>
                <p>Annual: $12,500/year, billed annually. Twelve months for the equivalent of ten monthly payments.</p>
                <p>Cancellation takes effect at the end of the current billing period.</p>
                <p>Payment failure may result in suspension of access after Stripe&apos;s retry cycle is exhausted.</p>
              </CardContent>
            </CardHeader>
          </Card>

          <Card id="out-of-scope">
            <CardHeader>
              <CardTitle>8. Out of Scope</CardTitle>
              <CardContent className="pt-0 space-y-2 text-sm text-muted-foreground">
                <p>The following are not included in the $1,250/month core relationship and require separate agreement and pricing:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Deeper research, extended document analysis, or broader architecture work beyond the core monthly scope</li>
                  <li>Implementation and systems architecture work</li>
                  <li>Program ownership</li>
                  <li>24/7 support, managed incident response, or emergency technical support</li>
                  <li>Legal advice (consult a licensed attorney for regulatory compliance obligations)</li>
                </ul>
                <p>Expanded scope is explicitly agreed before additional work begins. No automatic charges. No surprise scope.</p>
              </CardContent>
            </CardHeader>
          </Card>

          <Card id="confidentiality">
            <CardHeader>
              <CardTitle>9. Confidentiality and Client Material</CardTitle>
              <CardContent className="pt-0 space-y-2 text-sm text-muted-foreground">
                <p>Client-provided materials are confidential and are not disclosed to unrelated third parties except as necessary to provide the service through disclosed service providers/subprocessors, as authorized by the client, or as required by law.</p>
                <p><strong className="text-foreground">Sensitive data warning:</strong> Do not submit passwords, API keys, payment card data, medical information, or regulated/specially protected data through the workspace unless a secure handling arrangement has been explicitly agreed.</p>
                <p>You control what context is shared in the workspace and can edit it at any time.</p>
                <p>See the Privacy Policy for details on data handling.</p>
              </CardContent>
            </CardHeader>
          </Card>

          <Card id="ip">
            <CardHeader>
              <CardTitle>10. Intellectual Property</CardTitle>
              <CardContent className="pt-0 space-y-3 text-sm text-muted-foreground">
                <p><strong className="text-foreground">Background IP:</strong> Subodh KC methodologies, frameworks, templates, software, tools, and general know-how remain the intellectual property of Subodh KC or the appropriate entity.</p>
                <p><strong className="text-foreground">Client Materials:</strong> All materials you provide remain your property.</p>
                <p><strong className="text-foreground">Client-Specific Deliverables:</strong> You receive a perpetual right to use and share client-specific deliverables (such as customized Decision Briefs, vendor comparisons, architecture reviews, or analyses) internally and with relevant professional advisors, investors, partners, or stakeholders for your business purposes. Resale or redistribution of underlying proprietary frameworks, templates, and software is not permitted without separate agreement.</p>
                <p className="text-xs italic">This IP section is draft language marked for attorney review before final legal use.</p>
              </CardContent>
            </CardHeader>
          </Card>

          <Card id="termination">
            <CardHeader>
              <CardTitle>11. Termination and Post-Cancellation Access</CardTitle>
              <CardContent className="pt-0 space-y-2 text-sm text-muted-foreground">
                <p>You may cancel at any time. Cancellation takes effect at the end of the current billing period.</p>
                <p>After paid service ends, you receive 30 days of read and download access to your workspace, including decision records, opportunity records, client-provided inputs, advisor artifacts, and action and history records.</p>
                <p>You may export your data during this 30-day window. After the window closes, workspace access is removed.</p>
                <p>Included HAIEC and Kestrel entitlements tied to this subscription end according to the applicable subscription or product termination logic.</p>
                <p>Subodh KC may terminate access for violation of acceptable use terms or Terms of Service.</p>
              </CardContent>
            </CardHeader>
          </Card>

          <Card id="conflicts">
            <CardHeader>
              <CardTitle>12. Conflicts</CardTitle>
              <CardContent className="pt-0 text-sm text-muted-foreground">
                <p>If a conflict of interest arises, Subodh KC will disclose it promptly. You may determine how to proceed, including whether to continue or terminate the relationship.</p>
              </CardContent>
            </CardHeader>
          </Card>

          <Card id="relationship">
            <CardHeader>
              <CardTitle>13. Independent Contractor Relationship</CardTitle>
              <CardContent className="pt-0 space-y-2 text-sm text-muted-foreground">
                <p>Subodh KC is an independent contractor. This relationship does not create employment, officer status, agency, fiduciary authority, or authority to bind either party.</p>
                <p>Advisor affiliation rights (Section 6) are a limited permission to identify the relationship, not a grant of authority.</p>
              </CardContent>
            </CardHeader>
          </Card>

          <Card id="changes">
            <CardHeader>
              <CardTitle>14. Changes to These Terms</CardTitle>
              <CardContent className="pt-0 text-sm text-muted-foreground">
                <p>Material changes to these service terms will be communicated to active subscribers. Continued use after the effective date constitutes acceptance. The version label indicates the current version.</p>
              </CardContent>
            </CardHeader>
          </Card>

          <Card className="bg-secondary/20">
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground">
                This Service Schedule is incorporated into and governed by the Subodh KC Terms of Service. In the event of a conflict between this Schedule and the general Terms, this Schedule controls for Fractional AI Advisor subscriptions.
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  )
}
