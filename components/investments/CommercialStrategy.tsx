"use client";

import {useState} from "react";
import Link from "next/link";
import {wholesaleTiers,serviceOfferings,supportLevels,acquisitionChannels,accountStages,planningGuardrails} from "@/lib/investments/commercial";
import {forecastRows} from "@/lib/investments/electronics";

const pct=(n:number)=>n.toFixed(1)+"%";

/** Channel strategy for investors; proposed sales/service terms are not live customer offers. */
export function CommercialStrategy(){
 const [wholesaleMargin,setWholesaleMargin]=useState(12);
 const [servicesMargin,setServicesMargin]=useState(35);
 const [serviceShare,setServiceShare]=useState(20);
 const blend=wholesaleMargin*(1-serviceShare/100)+servicesMargin*serviceShare/100;
 const requiredShare=(target:number)=>servicesMargin>wholesaleMargin?Math.max(0,Math.min(100,(target-wholesaleMargin)/(servicesMargin-wholesaleMargin)*100)):null;
 return <div className="iv-commercial">
   <div className="iv-commercial-hero">
    <div><span className="iv-eyebrow">Commercial architecture / Distributor-led entry</span>
    <h3>Three wholesale account levels. Optional services that grow with the installed base.</h3>
    <p>Initial revenue is driven by buying traceable stock at qualified distributor prices, selling through wholesale/reseller channels, collecting cash and replenishing fast-turn SKUs. Configuration, deployment and support contracts become a separate margin engine as technical delivery capacity develops.</p></div>
    <div className="iv-commercial-split"><div><span>Launch</span><strong>Wholesale distribution</strong><small>Orders → cash → reorder</small></div><div><span>Expand</span><strong>Technical service contracts</strong><small>Scope → deliver → support</small></div></div>
   </div>

   <div className="iv-commercial-block">
    <div className="iv-commercial-title"><span className="iv-eyebrow">01 / Wholesale sales levels</span><h4>Sell stock through repeatable trade accounts.</h4><p>Wholesale is not a single customer type. The account levels below create a clear path from first purchase to recurring distribution volume.</p></div>
    <div className="iv-wholesale-grid">{wholesaleTiers.map(tier=><article key={tier.id} className="iv-wholesale-tier">
      <div className="iv-wholesale-top"><span>{tier.level} / COMMERCIAL LEVEL</span><strong>{tier.name}</strong></div>
      <div className="iv-wholesale-body"><p className="iv-wholesale-buyer">{tier.buyer}</p>
      <div><b>Primary order type</b><p>{tier.order}</p></div><div><b>Commercial terms</b><p>{tier.pricing}</p></div><div><b>What the customer receives</b><p>{tier.promise}</p></div></div>
      <footer>{tier.growth}</footer>
    </article>)}</div>
    <p className="iv-commercial-disclosure">Trade pricing, MOQs, stock allocation, return rights, credit and warranty obligations are negotiated per product and counterparty. The levels are proposed packages, not already authorized reseller agreements.</p>
   </div>

   <div className="iv-commercial-block">
    <div className="iv-commercial-title"><span className="iv-eyebrow">02 / Services versus product sales</span><h4>Service contracts are separate from hardware resale.</h4><p>A wholesale invoice covers the product, agreed dispatch and applicable manufacturer warranty. Technical services require their own SOW, staffing and acceptance criteria.</p></div>
    <div className="iv-services-grid">{serviceOfferings.map(o=><article key={o.id} className="iv-service-card"><span>{o.category}</span><h5>{o.name}</h5><p>{o.scope}</p><dl><div><dt>Contract model</dt><dd>{o.contract}</dd></div><div><dt>Delivery commitment</dt><dd>{o.service}</dd></div><div><dt>Boundary</dt><dd>{o.exclusions}</dd></div></dl></article>)}</div>
    <div className="iv-commercial-subtitle"><h5>Proposed service/support contract levels</h5><span>Acknowledgment targets, not guaranteed repairs or 24-hour resolution</span></div>
    <div className="iv-support-grid">{supportLevels.map(l=><article key={l.id} className="iv-support-tier"><span className="iv-support-label">{l.availability}</span><h5>{l.name}</h5><div className="iv-support-response"><small>Initial response target</small><strong>{l.response}</strong></div><p>{l.coverage}</p><div><b>Commercial format</b><span>{l.cadence}</span></div><small>{l.terms}</small></article>)}</div>
    <p className="iv-commercial-disclosure">No support contract is presented as currently sold or staffed. Warranty service, uptime, onsite response, emergency coverage, exclusions and liability limits must be separately negotiated. Actual contractual SLAs would require operational capacity and local compliance.</p>
   </div>

   <div className="iv-commercial-block" id="commercial-acquisition">
    <div className="iv-commercial-title"><span className="iv-eyebrow">03 / Finding suppliers and buyers</span><h4>Two acquisition funnels, not generic lead generation.</h4><p>Build the supply side first, then activate resale demand through existing trade channels. Record company, buyer role, SKU fit, price validity, payment terms and repeat order potential.</p></div>
    <div className="iv-channels-grid">{acquisitionChannels.map((ch,i)=><article key={i}><span>{ch.lane}</span><h5>{ch.name}</h5><p>{ch.method}</p><div><b>Evidence</b><small>{ch.proof}</small></div>{ch.link&&<a href={ch.link} target="_blank" rel="noopener noreferrer">Channel reference ↗</a>}</article>)}</div>
    <div className="iv-funnel">
      <div className="iv-eyebrow">Trade funnel / Stages and management metrics</div>
      <div className="iv-funnel-steps">{accountStages.map(stage=><article key={stage.step}><span>{stage.step}</span><h5>{stage.name}</h5><p>{stage.trigger}</p><small>{stage.measure}</small></article>)}</div>
    </div>
   </div>

   <div className="iv-commercial-block iv-margin-section">
    <div className="iv-commercial-title"><span className="iv-eyebrow">04 / Sales mix and forecast reconciliation</span><h4>Wholesale turnover and higher service margins must reconcile.</h4><p>The existing 2027–2029 forecast assumes blended margins of 18%, 21% and 23%. These are more ambitious than a commodity-heavy distribution start. Test what share of sales needs to come from higher-margin contracts to support the forecast.</p></div>
    <div className="iv-margin-grid">
      <div className="iv-margin-controls">
        <label>Wholesale gross margin <strong>{wholesaleMargin}%</strong><input type="range" min="5" max="22" step="1" value={wholesaleMargin} onChange={e=>setWholesaleMargin(+e.target.value)}/></label>
        <label>Service gross margin <strong>{servicesMargin}%</strong><input type="range" min="20" max="55" step="1" value={servicesMargin} onChange={e=>setServicesMargin(+e.target.value)}/></label>
        <label>Service share of sales <strong>{serviceShare}%</strong><input type="range" min="0" max="65" step="5" value={serviceShare} onChange={e=>setServiceShare(+e.target.value)}/></label>
        <p>Both wholesale and service margins are assumptions. Neither is verified by supplier quotes, customers or historical financial results.</p>
      </div>
      <div className="iv-margin-results">
        <span>Modeled blended gross margin</span><strong>{pct(blend)}</strong>
        <div className="iv-margin-split"><span style={{width:100-serviceShare+"%"}}/><i style={{width:serviceShare+"%"}}/></div>
        <p>{100-serviceShare}% product resale + {serviceShare}% service revenue. This is a revenue mix, not an allocation of gross profit.</p>
        <div className="iv-margin-forecast">{forecastRows.map(([yr,rev,target])=><div key={yr}><span>{yr} forecast · {target}% gross margin</span><b>{requiredShare(target)===null?"Not solvable":pct(requiredShare(target)!)} service sales needed</b></div>)}</div>
      </div>
    </div>
    <div className="iv-margin-warning"><strong>Investment-model implication</strong><p>With wholesale at 12% gross margin and services at 35%, the original 18% first-year blended margin requires approximately 26% of revenue from services. Reaching 23% would require roughly 48% service revenue. A pure-distribution year should therefore be evaluated under a lower-margin base case until the contract mix is established.</p></div>
    <div className="iv-commercial-risks">{planningGuardrails.map(x=><div key={x.title}><strong>{x.title}</strong><p>{x.detail}</p></div>)}</div>
   </div>
   <p className="iv-commercial-footnote">This is a proposed commercial operating plan. Business levels, service response targets and profit mixes are illustrative and do not represent current contracts, actual gross margins, or guaranteed outcomes. <Link href="/investments/nepal-india-electronics/suppliers#roadmap">See execution and inventory roadmap ↗</Link></p>
 </div>;
}
