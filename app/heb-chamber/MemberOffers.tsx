"use client";

import { useState } from "react";
import Link from "next/link";
import { AdvisorCheckoutCTA } from "@/components/commercial/AdvisorCheckoutCTA";
import { FractionalAdvisorCheckoutCTA } from "@/components/commercial/FractionalAdvisorCheckoutCTA";
import { getCheckoutBullets } from "@/lib/commercial/offers";

const OFFERS = [
  ["AI Advisor Desk", "$99/month", "Ongoing human AI advisory, relevant signal, and decision support for small teams."],
  ["AI Work Order", "$500 standard scope", "One defined outcome that deserves focused research, analysis, or decision support."],
  ["Fractional AI Advisor", "$1,250/month", "Continuing executive AI judgment across interconnected decisions."],
  ["AI Voice / Workflow Systems", "Scoped", "Voice, intake, booking, routing, escalation, and selected workflow integration."],
  ["Technical Reviews", "Scoped", "Selected AI application, SaaS security, architecture, and evidence reviews."],
] as const;

export function MemberOffers() {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <>
      <section className="page-padding terminal-section">
        <div className="section-container">
          <div className="rounded-xl border border-primary/25 bg-primary/5 p-6 md:p-8">
            <label className="flex cursor-pointer items-start gap-3">
              <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} className="mt-1 h-4 w-4" />
              <span>
                <strong className="block text-sm">Eligibility confirmation</strong>
                <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">I confirm that I represent a nonprofit organization or am an active HEB Chamber of Commerce member.</span>
              </span>
            </label>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {OFFERS.map(([name, price, description]) => (
              <article key={name} className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-xl font-semibold">{name}</h2>
                <p className="mt-2 font-mono text-xs text-primary">{price}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </article>
            ))}
          </div>

          {!confirmed && <p className="mt-8 text-sm text-muted-foreground">Confirm eligibility to reveal purchase and inquiry routes.</p>}

          {confirmed && (
            <div className="mt-10 space-y-10">
              <AdvisorCheckoutCTA title="Start the AI Advisor Desk" description="Productized advisory for eligible nonprofit organizations and active HEB Chamber members." bullets={getCheckoutBullets("ai_advisor_desk")} />
              <FractionalAdvisorCheckoutCTA title="Start Fractional AI Advisory" description="Continuing judgment for eligible organizations with interconnected AI decisions." bullets={getCheckoutBullets("fractional_ai_advisor")} />
              <div className="grid gap-4 md:grid-cols-3">
                <Link href="/ai-automation" className="rounded-lg border border-border p-5 text-sm font-medium hover:border-primary">Commission an AI Work Order →</Link>
                <Link href="/ai-voice-agent" className="rounded-lg border border-border p-5 text-sm font-medium hover:border-primary">Discuss AI Voice / Workflow Systems →</Link>
                <Link href="/contact?subject=member-technical-review" className="rounded-lg border border-border p-5 text-sm font-medium hover:border-primary">Request a Technical Review →</Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
