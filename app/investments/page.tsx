import type { Metadata } from "next";
import Link from "next/link";
import { CorridorDiagram } from "@/components/investments/CorridorDiagram";
import { MarketSignalStrip } from "@/components/investments/MarketOpportunity";

export const metadata: Metadata = {
  title: "Investment Opportunities | Regional Electronics & Industrial Growth",
  description: "Explore cross-border electronics distribution, manufacturing and AI hardware investment opportunities with scalable sourcing economics.",
  alternates: { canonical: "https://subodhkc.com/investments" },
};

const pathways = [
  {
    label: "01 / INVESTMENT THESIS",
    title: "The investment opportunity",
    description: "Explore the regional strategy, commercial model, growth scenarios and capital deployment approach.",
    href: "/investments/nepal-india-electronics",
    cta: "View investment proposal",
  },
  {
    label: "02 / PRODUCT ECONOMICS",
    title: "Wholesale product intelligence",
    description: "Examine target acquisition costs, resale economics, product categories and trade working-capital scenarios.",
    href: "/investments/nepal-india-electronics/catalog",
    cta: "Explore product catalog",
  },
  {
    label: "03 / SOURCING & SCALE",
    title: "Asian manufacturing partnerships",
    description: "Review manufacturer benchmarks, supplier ecosystems, volume opportunities and scalable purchasing scenarios.",
    href: "/investments/nepal-india-electronics/suppliers",
    cta: "Explore sourcing intelligence",
  },
  {
    label: "04 / INTERNATIONAL GROWTH",
    title: "Future market pathways",
    description: "Compare Bangladesh, Southeast Asia and U.S. opportunities, including market sizing, distributor competition and preferred entry roles.",
    href: "/investments/nepal-india-electronics#future-markets",
    cta: "Explore global expansion",
  },
];

export default function InvestmentsPage() {
  return (
    <main className="iv-hub">
      <section className="iv-hub-hero">
        <div className="iv-wrap">
          <div className="iv-eyebrow iv-reveal">Subodh KC / Strategic investment opportunities</div>
          <h1 className="iv-serif iv-reveal">Capital meets<br/><em>operating leverage.</em></h1>
          <p className="iv-hub-lead iv-reveal">
            A distribution-led regional electronics platform: secure manufacturer and distributor relationships, acquire a focused opening inventory assortment, and compound purchasing leverage through repeat wholesale resale. Future paths include Southeast Asia and the United States.
          </p>
          <div className="iv-hub-actions iv-reveal">
            <Link className="iv-btn" href="/investments/nepal-india-electronics">Explore the featured investment <span aria-hidden="true">↗</span></Link>
            <Link className="iv-btn iv-outline" href="/contact?subject=investment-partnership">Discuss a partnership</Link>
          </div>
          <div className="iv-rule" />
          <div className="iv-hub-feature">
            <article className="iv-feature-card iv-reveal">
              <div className="iv-eyebrow">Featured opportunity / Nepal · India · Asia</div>
              <h2 className="iv-serif">Electronics & AI<br/>Hardware Corridor</h2>
              <p>
                A regional electronics trade platform built around distributor access and fast-turn inventory in India and Nepal. Scale through repeat stock cycles, then extend into specialist industrial products and new international markets.
              </p>
              <Link href="/investments/nepal-india-electronics" className="iv-btn" style={{marginTop:12}}>
                Explore the distribution opportunity <span aria-hidden="true">↗</span>
              </Link>
              <div className="iv-feature-metrics">
                <div><strong>10</strong><span>Priority product families</span></div>
                <div><strong>23</strong><span>Supplier research references</span></div>
                <div><strong>6</strong><span>Supplier regions evaluated</span></div>
              </div>
            </article>
            <div className="iv-reveal"><CorridorDiagram /></div>
          </div>
        </div>
      </section>
      <section className="iv-hub-market"><div className="iv-wrap"><MarketSignalStrip /><div className="iv-hub-market-cta"><p>India's industrial automation and electronics ecosystems are expanding. The investment case focuses on the specialized product and integration channels that can serve this demand.</p><Link href="/investments/nepal-india-electronics#market">Explore market size and growth drivers ↗</Link></div></div></section>
      <section className="iv-hub-section">
        <div className="iv-wrap">
          <div className="iv-eyebrow">Research and opportunity intelligence</div>
          <h2 className="iv-serif">Explore the launch model and future markets.</h2>
          <div className="iv-path-grid">
            {pathways.map((item) => (
              <Link key={item.href} className="iv-path iv-reveal" href={item.href}>
                <small>{item.label}</small>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="iv-arrow">{item.cta} <span aria-hidden="true">↗</span></span>
              </Link>
            ))}
          </div>
          <p style={{fontSize:12,color:"#69776d",marginTop:28,lineHeight:1.7}}>
            Industry figures frame a market-entry thesis, while planned customer relationships and supplier agreements will determine the venture's operating performance. Supplier pricing,
            customer commitments and investment terms are established through commercial diligence.
          </p>
        </div>
      </section>
    </main>
  );
}
