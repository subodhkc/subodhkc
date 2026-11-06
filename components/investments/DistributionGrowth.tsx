"use client";

import { useState } from "react";
import Link from "next/link";
import { firstInventoryPolicy, deliveryPhases } from "@/lib/investments/strategy";
import { initialTradeCapital } from "@/lib/investments/electronics";
import { coreMarkets, futureMarkets, usMarket } from "@/lib/investments/expansion";

const money=(n:number)=>"$"+Math.round(n).toLocaleString("en-US");

export function DistributionLaunchPlan() {
  const [openingBudget,setOpeningBudget]=useState(120000);
  const insideAllocation=Math.min(openingBudget,initialTradeCapital);
  const remaining=Math.max(0,initialTradeCapital-openingBudget);
  const extra=Math.max(0,openingBudget-initialTradeCapital);
  const percent=(insideAllocation/initialTradeCapital*100);
  return <div className="iv-distribution-launch">
    <div className="iv-launch-hero">
      <div>
        <span className="iv-eyebrow">Go-to-market / Distribution-first operating model</span>
        <h3>Secure supply. Buy selectively. Turn inventory. Reinvest.</h3>
        <p>Begin with direct manufacturer, authorized distributor and wholesale stockist relationships in India and Nepal. Establish favorable purchasing, warranty and replenishment terms, obtain an initial set of resalable electronics inventory, then increase inventory purchasing as sell-through and collections are demonstrated.</p>
        <div className="iv-launch-tags"><span>Distributor access</span><span>4–8 opening SKUs (target)</span><span>Rapid resale channels</span><span>Revolving purchasing capital</span></div>
      </div>
      <div className="iv-launch-cycle" role="img" aria-label="Trading cycle: qualified distributor to initial inventory to reseller channels to cash collection and replenishment">
        {["Qualified distributors","First inventory","Channel sell-through","Cash and reorder"].map((step,i)=><div key={step}><span>0{i+1}</span><strong>{step}</strong></div>)}
      </div>
    </div>
    <div className="iv-launch-grid">
      <div className="iv-launch-steps">
        <div className="iv-eyebrow">First 90 days / Priority sequence</div>
        {deliveryPhases.slice(0,3).map(phase=><article key={phase.code}>
          <div className="iv-launch-step-top"><span>{phase.window}</span><h4>{phase.title}</h4></div>
          <p>{phase.focus}</p>
          <ul>{phase.deliverables.slice(0,3).map(item=><li key={item}>{item}</li>)}</ul>
        </article>)}
      </div>
      <div className="iv-launch-finance">
        <span className="iv-eyebrow">Inventory purchase planning / USD</span>
        <h4>Control the first purchase cycle without constraining scale.</h4>
        <p>The initial investment plan earmarks {money(initialTradeCapital)} for inventory and revolving trade capital. Set a first inventory purchase budget; the balance is available for replenishment, payments and working-capital needs.</p>
        <label htmlFor="iv-opening-budget">Illustrative opening inventory budget</label>
        <input id="iv-opening-budget" type="number" min="0" step="10000" value={openingBudget} onChange={e=>setOpeningBudget(Math.max(0,Math.min(1000000000,Number(e.target.value)||0)))}/>
        <div className="iv-launch-capital-bar" aria-label="Proportion of initial trade capital in opening inventory">
          <span style={{width:percent+"%"}}/>
        </div>
        <div className="iv-launch-capital-rows">
          <div><span>Initial purchase allocation</span><strong>{money(openingBudget)}</strong></div>
          <div><span>Trade capital left for working capital / reorders</span><strong>{money(remaining)}</strong></div>
          {extra>0&&<div><span>Additional trade finance beyond initial allocation</span><strong>{money(extra)}</strong></div>}
        </div>
        <p className="iv-launch-finance-note">An illustrative opening release of 10–25% ({money(initialTradeCapital*.1)}–{money(initialTradeCapital*.25)}) is a planning starting point, not a financing ceiling or a confirmed purchase. The actual mix requires current channel pricing and resalability checks.</p>
        <Link href="/investments/nepal-india-electronics/suppliers#scale">Open broader inventory and financing scenarios ↗</Link>
      </div>
    </div>
    <div className="iv-inventory-screen">
      <div className="iv-eyebrow">Quick-turn stock selection / Commercial filters</div>
      <h4>Choose inventory for resale liquidity, not only headline margin.</h4>
      <div className="iv-inventory-grid">
        {[
          ["01 / Channel fit","More than one potential resale route: B2B wholesalers, authorized resellers or specialist trade accounts."],
          ["02 / Traceability","Exact manufacturer part number, genuine serial provenance, territory and warranty eligibility."],
          ["03 / Landed economics","Quoted acquisition plus shipping, tax, financing, marketplace fees and expected RMA exposure."],
          ["04 / Price resilience","Current competitive resale quotes, low shelf-life exposure and explicit stock-age/repricing rules."],
        ].map(([label,desc])=><article key={label}><span>{label}</span><p>{desc}</p></article>)}
      </div>
      <p className="iv-inventory-note"><strong>Indicative first-stock categories:</strong> standardized storage/memory, networking accessories and selected high-velocity compute SKUs where distributor economics and channel availability are verified. Custom industrial panels and bespoke assemblies are later line extensions, not prerequisites for opening stock. {firstInventoryPolicy.preferredStock}.</p>
    </div>
  </div>;
}

export function RegionalExpansionPaths() {
  return <div className="iv-expansion-suite">
    <div className="iv-expansion-intro">
      <span className="iv-eyebrow">Geographic strategy / Future paths</span>
      <h3>Build the distribution base first. Expand where channel economics justify it.</h3>
      <p>India and Nepal are the initial operating markets. Other countries serve different purposes: prospective distribution customers, supplier diversification, contract manufacturing and later industrial specialist sales. Each entry path follows proven purchasing and resale economics rather than simultaneous country launches.</p>
    </div>
    <div className="iv-market-roles">
      {coreMarkets.map(m=><article key={m.name}><span>{m.position} MARKET</span><h4>{m.name}</h4><strong>{m.role}</strong><p>{m.description}</p><small>{m.strategicValue}</small></article>)}
    </div>
    <div className="iv-expansion-head"><span className="iv-eyebrow">Asia / Adjacent opportunities</span><p>Initial emphasis: partner channels in Bangladesh; supplier and manufacturing relationships across Thailand, Vietnam and Malaysia. Indonesia and Saudi Arabia remain later partner-led options.</p></div>
    <div className="iv-market-future-grid">
      {futureMarkets.map(m=><article className="iv-market-future" key={m.name}>
        <div className="iv-market-future-top"><span>{m.flag}</span><span>{m.phase}</span></div>
        <h4>{m.name}</h4><strong>{m.role}</strong>
        <p>{m.case}</p>
        <div className="iv-market-signal"><span>Industry evidence</span><b>{m.signal}</b>{m.url&&<a href={m.url} target="_blank" rel="noopener noreferrer">{m.source} ↗</a>}</div>
        <div className="iv-market-future-bottom"><span>Potential products</span><p>{m.offer}</p><span>Market-entry consideration</span><p>{m.constraint}</p></div>
      </article>)}
    </div>
    <div className="iv-us-expansion">
      <div className="iv-us-head"><span className="iv-eyebrow">United States / Future strategic market</span><h3>A larger automation market, with far tougher distribution competition.</h3><p>Explore the U.S. as a specialist distribution and integration route after supplier economics, technical documentation and operating processes are proven. Broad catalog competition against national distributors is not the intended entry point.</p></div>
      <div className="iv-us-metrics">
        <div><span>U.S. automation & controls · 2025 estimate</span><strong>$51.84B</strong></div>
        <div><span>U.S. automation & controls · 2033 projection</span><strong>$113.98B</strong></div>
        <div><span>Independent forecast CAGR · 2026–2033</span><strong>10.4%</strong></div>
      </div>
      <a href={usMarket.url} target="_blank" rel="noopener noreferrer" className="iv-us-source">Source: {usMarket.source} ↗</a>
      <div className="iv-us-two">
        <div><h4>More attractive market niches</h4><ul>{usMarket.promisingLanes.map(x=><li key={x}>{x}</li>)}</ul></div>
        <div><h4>Competitive reality</h4>{usMarket.competition.map(c=><div className="iv-us-competitor" key={c.name}><strong>{c.name}</strong><p>{c.focus}</p><span>{c.response}</span></div>)}</div>
      </div>
      <p className="iv-us-note">{usMarket.conditions} {usMarket.interpretation}</p>
    </div>
    <div className="iv-expansion-foot"><strong>Phased expansion principle</strong><p>Phase 1: India and Nepal distributor agreements, first stock purchases and repeated turnover. Phase 2: Bangladesh wholesale channels plus diversified Southeast Asian supply. Phase 3: differentiated U.S. and West Asian industrial opportunities through qualified local partners.</p></div>
  </div>;
}
