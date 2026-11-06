import type { Metadata } from "next";
import Link from "next/link";
import { CorridorDiagram } from "@/components/investments/CorridorDiagram";
import { MarketSignalStrip } from "@/components/investments/MarketOpportunity";
import { InvestmentVideo } from "@/components/investments/InvestmentVideo";

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
    description: "Review supplier relationships, Asian manufacturing capabilities and engineering-led scale.",
    href: "/investments/nepal-india-electronics/suppliers",
    cta: "Explore sourcing intelligence",
  },
  {
    label: "04 / INTERNATIONAL GROWTH",
    title: "Future market pathways",
    description: "Compare Asian supplier regions with U.S. and Canadian industrial AI equipment opportunities.",
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
          <h1 className="iv-serif iv-reveal">A new era of machines.<br/><em>Intelligence at the industrial edge.</em></h1>
          <p className="iv-hub-lead iv-reveal">
            AI is opening another industrial equipment cycle, bringing sensing, edge computing and machine-level intelligence into factories and infrastructure. The proposed platform starts with India/Nepal distribution, develops configurable AI-ready hardware and expands into U.S. and Canadian industrial markets.
          </p>
          <div className="iv-hub-actions iv-reveal">
            <Link className="iv-btn" href="/investments/nepal-india-electronics">Explore the featured investment <span aria-hidden="true">↗</span></Link>
            
          </div>
          <div className="iv-rule" />
          <div className="iv-hub-feature">
            <article className="iv-feature-card iv-reveal">
              <div className="iv-eyebrow">Featured opportunity / Nepal · India · Asia</div>
              <h2 className="iv-serif">Electronics & AI<br/>Hardware Corridor</h2>
              <p>
                The initial business builds electronics purchasing leverage and inventory turnover. The larger opportunity is engineered AI-ready equipment, industrial integration and durable support relationships across global markets.
              </p>
              <Link href="/investments/nepal-india-electronics" className="iv-btn" style={{marginTop:12}}>
                Explore the distribution opportunity <span aria-hidden="true">↗</span>
              </Link>
              <div className="iv-feature-commercial"><Link href="/investments/nepal-india-electronics#sales-strategy">Wholesale sales levels, buyer acquisition and service contracts ↗</Link></div>
              <div className="iv-feature-metrics">
                <div><strong>$1M</strong><span>Initial investment estimate · multiple investors</span></div>
                <div><strong>3</strong><span>Revenue engines: trade, engineered systems and services</span></div>
                <div><strong>U.S. + CA</strong><span>Future engineered equipment markets</span></div>
              </div>
            </article>
            <div className="iv-reveal"><CorridorDiagram /></div>
          </div>
        </div>
      </section>
      <section className="iv-film-section" aria-label="AI at the Industrial Edge film"><div className="iv-wrap"><InvestmentVideo /></div></section>
      <section className="iv-hub-market"><div className="iv-wrap"><MarketSignalStrip /><div className="iv-hub-market-cta"><p>As AI moves from software into physical equipment, industrial customers require sensors, local compute, tested controls and integrated engineering. This is the longer-range opportunity beyond distribution.</p><Link href="/investments/nepal-india-electronics#market">Explore market size and growth drivers ↗</Link></div></div></section>
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
