import type { Metadata } from "next";
import { cookies } from "next/headers";
import Hero from "@/components/Hero";
import { HEB_ACCESS_COOKIE, verifyHebAccessToken } from "@/lib/heb-access";
import { unlockHebChamber } from "./actions";
import { MemberOffers } from "./MemberOffers";

export const metadata: Metadata = {
  title: "HEB Chamber & Nonprofit Member Access | Subodh KC",
  description: "Private offer access for nonprofit organizations and active HEB Chamber of Commerce members.",
  robots: { index: false, follow: false, nocache: true },
};

export default async function HebChamberPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const store = await cookies();
  const unlocked = verifyHebAccessToken(store.get(HEB_ACCESS_COOKIE)?.value);
  const { error } = await searchParams;

  if (!unlocked) {
    return (
      <>
        <Hero subtitle="Private Community Access" title={<>HEB Chamber &<br /><span className="gradient-text">Nonprofit Offers</span></>} description="For nonprofit organizations and active HEB Chamber of Commerce members only." />
        <section className="page-padding terminal-section">
          <div className="section-container">
            <form action={unlockHebChamber} className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-7 md:p-9">
              <h2 className="text-2xl font-semibold">Enter the shared member password</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">This lightweight gate limits the catalog to the intended community. It does not protect sensitive information or privileged account functions.</p>
              <label htmlFor="heb-password" className="mt-7 block text-sm font-medium">Member password</label>
              <input id="heb-password" name="password" type="password" required autoComplete="current-password" className="mt-2 w-full rounded-md border border-input bg-background px-4 py-3 text-foreground" />
              {error === "invalid" && <p role="alert" className="mt-3 text-sm text-red-600">The password was not recognized.</p>}
              <button type="submit" className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">Access Member Offers</button>
              <p className="mt-5 text-xs leading-relaxed text-muted-foreground">Eligibility is confirmed again before purchase. Use of this route does not create or imply HEB Chamber endorsement.</p>
            </form>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Hero subtitle="Qualified Community Access" title={<>Productized AI advisory<br /><span className="gradient-text">for the HEB community.</span></>} description="Lower-friction access for nonprofit organizations and active HEB Chamber of Commerce members. Enterprise diagnostics and bespoke engagements remain separately scoped." />
      <MemberOffers />
    </>
  );
}
