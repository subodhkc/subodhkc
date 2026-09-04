import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(__dirname, "..", "..");
const read = (path: string) => readFileSync(join(root, path), "utf8");

let passed = 0;
const failures: string[] = [];

function assert(condition: boolean, message: string) {
  if (condition) passed += 1;
  else failures.push(message);
}

const primaryPublicFiles = [
  "app/page.tsx",
  "components/hero/HeroInteractive.tsx",
  "components/home/WaysToWork.tsx",
  "components/home/FinalCTA.tsx",
  "components/SiteNavigation.tsx",
  "components/SiteFooter.tsx",
  "app/services/page.tsx",
  "app/advisory/page.tsx",
  "app/ai-advisor/page.tsx",
  "app/contact/client.tsx",
  "app/faq/page.tsx",
  "app/solutions/haiec/page.tsx",
  "components/StructuredData.tsx",
  "lib/search-index.ts",
  "public/ai.txt",
  "public/llms.txt",
  "public/llms-full.txt",
];

const combined = primaryPublicFiles.map(read).join("\n");

assert(!combined.includes("Holistic AI Ethics & Compliance"), "legacy HAIEC expansion must be absent from primary public surfaces");
assert(!combined.includes("$99/month"), "low-price Advisor Desk anchor must be absent from primary public surfaces");
assert(!combined.includes("$1,250/month"), "low-price Fractional anchor must be absent from primary public surfaces");
assert(!combined.includes("Text Message (Fastest)"), "contact funnel must not lead with text messaging");
assert(combined.includes("High Assurance In Every Consequence"), "canonical HAIEC expansion must be present");
assert(combined.includes("Strategic Diagnostic"), "diagnostic entry must be present");
assert(combined.includes("Executive AI Advisory"), "executive advisory path must be present");
assert(combined.includes("AI Systems Architecture"), "architecture path must be present");
assert(combined.includes("Evidence-Bound Assurance"), "assurance category must be present");

assert(existsSync(join(root, "app/diagnostics/page.tsx")), "diagnostics route must exist");
assert(existsSync(join(root, "app/heb-chamber/page.tsx")), "HEB member route must exist");
assert(existsSync(join(root, "app/advisory/page.tsx")), "legacy advisory URL must remain functional");
assert(existsSync(join(root, "app/ai-advisor/page.tsx")), "legacy AI advisor URL must remain functional");
assert(existsSync(join(root, "app/services/page.tsx")), "legacy services URL must remain functional");

const hebPage = read("app/heb-chamber/page.tsx");
const memberOffers = read("app/heb-chamber/MemberOffers.tsx");
const hebAction = read("app/heb-chamber/actions.ts");
assert(hebPage.includes("index: false") && hebPage.includes("follow: false"), "HEB page must be noindex and nofollow");
assert(memberOffers.includes("nonprofit organization") && memberOffers.includes("active HEB Chamber"), "HEB checkout reveal must require eligibility confirmation");
assert(hebAction.includes("httpOnly: true"), "HEB access cookie must be HttpOnly");
assert(!memberOffers.includes("hebchamber2026"), "HEB password must not ship in the client component");
assert(!read("app/sitemap.ts").includes("${baseUrl}/heb-chamber"), "HEB route must be omitted from sitemap");
assert(!read("lib/search-index.ts").includes("href: '/heb-chamber'"), "HEB route must be omitted from public search");
assert(read("app/robots.ts").includes('"/heb-chamber"'), "HEB route must be disallowed in robots");

const haiecPage = read("app/solutions/haiec/page.tsx");
assert(haiecPage.includes("/contact?subject=haiec-enterprise-poc"), "enterprise assurance CTA must enter qualification");
assert(!haiecPage.includes("/api/commercial") && !haiecPage.includes("CheckoutButton"), "enterprise assurance must not create checkout");
assert(haiecPage.includes("$25,000 to $75,000"), "enterprise POC range must be explicit");
assert(haiecPage.includes("Developer & Open Source"), "developer path must be preserved");
assert(haiecPage.includes("Partner & Agency"), "partner path must be preserved");

assert(existsSync(join(root, "app/api/commercial/advisor-desk/checkout/route.ts")), "Advisor Desk checkout must remain");
assert(existsSync(join(root, "app/api/commercial/fractional-advisor/checkout/route.ts")), "Fractional checkout must remain");
assert(read("lib/commercial/offers.ts").includes("monthlyPriceCents: 9900"), "Advisor Desk entitlement price owner must remain");
assert(read("lib/commercial/offers.ts").includes("monthlyPriceCents: 125000"), "Fractional entitlement price owner must remain");

console.log(`Website convergence: ${passed} passed, ${failures.length} failed`);
if (failures.length) {
  for (const failure of failures) console.error(`FAIL: ${failure}`);
  process.exit(1);
}
