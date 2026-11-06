"use client";
import {useState} from "react";
import {aiIndustrialMarket,aiHardwareStack,structuralWedge,engineeredRevenueMix,investmentRaise,regionalScaleExample,northAmericaScaleSensitivity,calculateWeightedGrossMargin,unitMarginAssumptions} from "@/lib/investments/ai-industrial";
import {upsideForecastRows} from "@/lib/investments/electronics";
const cash=(n:number)=>"$"+Math.round(n).toLocaleString("en-US");
const millions=(n:number)=>"$"+n.toFixed(2)+"M";

export function AIIndustrialThesis(){
 return <div className="iv-ai-thesis">
  <div className="iv-ai-head"><span className="iv-eyebrow">The industrialization of the AI era / Investment thesis</span><h3>Industrial machines are gaining intelligence. Their hardware needs are changing with them.</h3>
   <p>Earlier waves of industrialization expanded demand for machining equipment, CNC systems, automation and electrical controls. AI introduces another equipment transition: machines need sensing, localized computing, data connections and safe interfaces to physical control systems. AI software creates new possibilities; configured hardware and engineering make them operational.</p></div>
  <div className="iv-ai-market-data">
   <article><span>Global industrial automation · 2025</span><strong>$226.8B</strong><small>Industry estimate</small></article>
   <article><span>Global industrial automation · 2033</span><strong>$504.4B</strong><small>Independent industry forecast</small></article>
   <article><span>U.S. + Canada automation · 2033</span><strong>$128.8B</strong><small>Combined country forecasts, broad sector</small></article>
  </div>
  <div className="iv-ai-sources"><a href={aiIndustrialMarket.global.url} target="_blank" rel="noopener noreferrer">Global outlook ↗</a><a href={aiIndustrialMarket.us.url} target="_blank" rel="noopener noreferrer">U.S. outlook ↗</a><a href={aiIndustrialMarket.canada.url} target="_blank" rel="noopener noreferrer">Canada outlook ↗</a></div>
  <div className="iv-ai-stack-heading"><span className="iv-eyebrow">Physical AI equipment stack</span><h4>Four layers turn AI from software into industrial capability.</h4></div>
  <div className="iv-ai-stack">{aiHardwareStack.map(x=><article key={x.number}><div><span>{x.number}</span><b>{x.value}</b></div><h5>{x.title}</h5><p>{x.products}</p><small>{x.engineering}</small></article>)}</div>
  <div className="iv-ai-wedge">{structuralWedge.map((x,i)=><div key={x.title}><span>0{i+1}</span><strong>{x.title}</strong><p>{x.detail}</p></div>)}</div>
  <p className="iv-ai-bottomline"><strong>Proposed investment wedge:</strong> launch with qualified distribution and high-turnover inventory, then use supplier access to deliver configurable AI-ready hardware, tested engineered systems and technical support. Existing automation companies are substantial competitors; the opportunity is in cross-vendor, application-specific integration.</p>
 </div>;
}

export function ThreeEngineEconomics(){
 const [yearIndex,setYearIndex]=useState(0);
 const [wholesale,setWholesale]=useState<number>(unitMarginAssumptions.wholesale);
 const [engineered,setEngineered]=useState<number>(unitMarginAssumptions.engineered);
 const [services,setServices]=useState<number>(unitMarginAssumptions.services);
 const r=engineeredRevenueMix[yearIndex];
 const gross=calculateWeightedGrossMargin(r,{wholesale,engineered,services});
 const ebitda=r.revenueM*1e6*gross/100-r.opexK*1000;
 const up=upsideForecastRows[yearIndex];
 return <div className="iv-engine-financials">
  <div className="iv-ai-head"><span className="iv-eyebrow">Operating economics / Three separate commercial engines</span><h3>Trading generates cash velocity. Engineering expands gross margin. Service contracts increase lifetime value.</h3><p>We separate straightforward component resale from custom AI-enabled equipment and ongoing technical contracts. The mix must earn its way into the financial forecast; a distribution-only year cannot silently use engineering economics.</p></div>
  <div className="iv-engine-lanes">
   <article><span>01 / Launch</span><h4>Wholesale distribution</h4><strong>12% model</strong><p>Stock acquisition and resale, channel pricing, repeat transactions and working-capital velocity.</p></article>
   <article><span>02 / Expansion</span><h4>AI-engineered hardware</h4><strong>28% model</strong><p>Configured edge computers, vision systems, control panels, sensor kits, application-specific assemblies and test documentation.</p></article>
   <article><span>03 / Repeat value</span><h4>Engineering & support</h4><strong>35% model</strong><p>Customization, commissioning, monitoring, spare-parts programs and support under separate service agreements.</p></article>
  </div>
  <div className="iv-engine-controls">
   <div className="iv-engine-control-panel"><div className="iv-eyebrow">Adjust gross margin assumptions</div>
    <div className="iv-engine-year-tabs">{engineeredRevenueMix.map((x,i)=><button key={x.year} type="button" aria-pressed={yearIndex===i} className={yearIndex===i?"selected":""} onClick={()=>setYearIndex(i)}>{x.year}</button>)}</div>
    <label>Wholesale margin <b>{wholesale}%</b><input aria-label="Wholesale margin" type="range" min="5" max="20" step="1" value={wholesale} onChange={e=>setWholesale(+e.target.value)}/></label>
    <label>Engineered hardware margin <b>{engineered}%</b><input aria-label="Engineered hardware margin" type="range" min="15" max="45" step="1" value={engineered} onChange={e=>setEngineered(+e.target.value)}/></label>
    <label>Technical services margin <b>{services}%</b><input aria-label="Technical services margin" type="range" min="20" max="60" step="1" value={services} onChange={e=>setServices(+e.target.value)}/></label>
   </div>
   <div className="iv-engine-output"><div className="iv-eyebrow">Year {r.year} / Revenue mix scenario</div>
    <div className="iv-engine-mixbar" role="img" aria-label={r.wholesalePct+" percent distribution, "+r.engineeredPct+" percent engineered products, "+r.servicePct+" percent services"}><span style={{width:r.wholesalePct+"%"}}/><i style={{width:r.engineeredPct+"%"}}/><b style={{width:r.servicePct+"%"}}/></div>
    <div className="iv-engine-legend"><span>Distribution {r.wholesalePct}%</span><span>Engineered {r.engineeredPct}%</span><span>Services {r.servicePct}%</span></div>
    <div className="iv-engine-results"><div><small>Revenue</small><strong>{millions(r.revenueM)}</strong></div><div><small>Blended gross margin</small><strong>{gross.toFixed(1)}%</strong></div><div><small>Gross profit</small><strong>{cash(r.revenueM*1e6*gross/100)}</strong></div><div><small>EBITDA</small><strong>{cash(ebitda)}</strong></div></div>
    <p><strong>Engineering-upside sensitivity:</strong> at the earlier {up[2]}% margin assumption and the same sales/operating costs, EBITDA would be {cash(up[1]*1e6*up[2]/100-up[3]*1000)}. Higher margins must come from an evidenced product/service mix, not generic resale.</p>
   </div>
  </div>
  <div className="iv-engine-snapshot"><table><thead><tr><th>Year</th><th>Sales scenario</th><th>Wholesale mix</th><th>Engineered mix</th><th>Services mix</th><th>Base gross margin</th><th>Base EBITDA</th><th>Engineering-upside EBITDA</th></tr></thead><tbody>{engineeredRevenueMix.map((x,i)=>{const m=calculateWeightedGrossMargin(x),u=upsideForecastRows[i];return <tr key={x.year}><td>{x.year}</td><td>{millions(x.revenueM)}</td><td>{x.wholesalePct}%</td><td>{x.engineeredPct}%</td><td>{x.servicePct}%</td><td>{m.toFixed(1)}%</td><td>{cash(x.revenueM*1e6*m/100-x.opexK*1000)}</td><td>{cash(u[1]*1e6*u[2]/100-u[3]*1000)}</td></tr>})}</tbody></table></div>
  <p className="iv-engine-note">Base assumptions: 12% wholesale, 28% configured hardware, 35% services. The selected-year sliders are sensitivities only; the table retains the fixed base values. The prior 18%/21%/23% gross margins are presented as an upside scenario. Revenue, costs and contract mix remain unverified assumptions.</p>
 </div>;
}

export function InvestorSyndicateAndScale(){
 const total=investmentRaise.estimatedUsd;
 const base=aiIndustrialMarket.us.baseUsdBn+aiIndustrialMarket.canada.baseUsdBn;
 const forecast=aiIndustrialMarket.us.forecastUsdBn+aiIndustrialMarket.canada.forecastUsdBn;
 const scaled=regionalScaleExample.reduce((sum,x)=>sum+x.sales,0);
 return <div className="iv-investor-capital">
  <div className="iv-investor-ask"><div><span className="iv-eyebrow">Proposed seed-stage capital structure / Multiple investors</span><h3>An estimated $1 million initial investment, syndicated across multiple investors.</h3><p>The proposed capital budget finances distribution access, opening and revolving inventory, trade infrastructure and early engineering capacity. Investors can participate in a shared funding round rather than requiring a single $1 million check.</p></div><div className="iv-investor-ask-metric"><span>Initial investment estimate</span><strong>$1.0M</strong><small>Multiple investors · Terms to be negotiated</small></div></div>
  <div className="iv-investor-usefunds">{investmentRaise.deployment.map(x=><article key={x.name}><span>{x.name}</span><strong>{cash(x.usd)}</strong><div className="iv-investor-fundbar"><i style={{width:(x.usd/total*100)+"%"}}/></div><p>{x.detail}</p></article>)}</div>
  <p className="iv-investor-note">{investmentRaise.caution}</p>
  <div className="iv-na-growth">
   <div className="iv-ai-head"><span className="iv-eyebrow">Long-range growth / United States and Canada</span><h3>The larger opportunity is a North American AI-ready industrial equipment business.</h3><p>Use Asian sourcing and established India/Nepal trade channels to develop a capability for supplying sensor, edge inference, industrial controls and assembled equipment to U.S. and Canadian integrators and manufacturers. The opportunity is specialized systems—not replacing national parts catalogs.</p></div>
   <div className="iv-na-size-grid"><div><span>U.S. + Canada automation · 2025 estimate</span><strong>{millions(base*1000)}</strong><small>Broad controls and automation industry</small></div><div><span>U.S. + Canada automation · 2033 forecast</span><strong>{millions(forecast*1000)}</strong><small>Independent industry forecasts</small></div></div>
   <div className="iv-na-sensitivities"><div className="iv-eyebrow">Scale illustration / Share of 2033 broad sector</div>{northAmericaScaleSensitivity.map(x=><div key={x.sharePct}><span>{x.sharePct.toFixed(2)}% of broad U.S. + Canada sector</span><strong>{millions(x.revenueUsdM)}</strong></div>)}</div>
   <p className="iv-na-caution">These percentage calculations illustrate market scale, not a forecast, accessible SAM or expected market capture. The underlying market includes PLCs, robotics, DCS and SCADA outside this venture's proposed scope.</p>
   <div className="iv-na-model"><div><span className="iv-eyebrow">Bottom-up multi-market scale sensitivity</span><h4>From trading transactions to systems and service contracts.</h4></div><div className="iv-na-lineitems">{regionalScaleExample.map(x=><div key={x.metric}><span>{x.metric}<small>{x.units.toLocaleString()} transactions/contracts × {cash(x.ticket)}</small></span><strong>{millions(x.sales/1e6)}</strong></div>)}<div className="iv-na-total"><span>Illustrative annual revenue at maturity</span><strong>{millions(scaled/1e6)}</strong></div></div><p>This is a hypothetical transaction architecture, not a dated sales forecast. Growth would require qualified suppliers, technical and regulatory capabilities, additional capital, channel partners and repeatable execution.</p></div>
  </div>
 </div>;
}
