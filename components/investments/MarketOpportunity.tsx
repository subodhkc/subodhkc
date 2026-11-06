"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { demandDrivers, marketEvidence, targetAccountScenarios } from "@/lib/investments/market";

const usd=(n:number)=>"$"+Math.round(n).toLocaleString("en-US");
const usdMillions=(n:number)=>"$"+(n/1_000_000).toFixed(2)+"M";

function SourceLink({url,label}:{url:string;label:string}) {
  return <a className="iv-market-source" href={url} target="_blank" rel="noopener noreferrer">{label}<span aria-hidden="true"> ↗</span></a>;
}

/** Executive signal strip; compatible with the overall investment index. */
export function MarketSignalStrip() {
  const e=marketEvidence;
  return <section className="iv-market-strip" aria-label="Published industry market signals">
    <div className="iv-market-strip-header">
      <span className="iv-eyebrow">Published industry indicators / 2025–26</span>
      <strong>Growth in the operating environment</strong>
    </div>
    <div className="iv-market-strip-grid">
      <div className="iv-market-strip-card"><span>India electronics output · FY 2025–26</span><strong>₹13.11 <em>lakh crore</em></strong><small>15.8% increase over FY 2024–25</small><SourceLink url={e.electronics.url} label="MeitY / PIB"/></div>
      <div className="iv-market-strip-card"><span>India automation market · 2025</span><strong>$9.33 <em>billion</em></strong><small>Third-party market-size estimate</small><SourceLink url={e.automation.url} label="Grand View Research"/></div>
      <div className="iv-market-strip-card"><span>India automation market · 2033</span><strong>$26.11 <em>billion</em></strong><small>Third-party forecast, not a guaranteed outcome</small><SourceLink url={e.automation.url} label="Grand View Research"/></div>
    </div>
    <p>Sources combine government production statistics and independent market research. Revenue projections are developed separately from targeted customer relationships and purchase volumes.</p>
  </section>;
}

/** Detailed market-size visual for the main investment thesis. */
export function MarketDeepDive() {
  const e=marketEvidence;
  return <div className="iv-market-deep">
    <div className="iv-market-deep-lead">
      <div className="iv-eyebrow">Market dynamics / Where the opportunity comes from</div>
      <h3>A growing electronics base. <span>More demand for specialized systems.</span></h3>
      <p>Three market layers matter: the scale of India&apos;s electronics economy, the more relevant automation market, and the policies encouraging deeper component and sub-assembly production. The proposed route to market emphasizes industrial controls, configured electronics and integration services, where a focused B2B platform can deliver differentiated value.</p>
    </div>
    <div className="iv-market-three">
      <article className="iv-market-kpi">
        <span>Overall industry output</span>
        <strong>₹13.11 <small>lakh crore</small></strong>
        <p>Indian electronics production, FY 2025–26; +15.8% year over year.</p>
        <SourceLink url={e.electronics.url} label="Government of India"/>
      </article>
      <article className="iv-market-kpi">
        <span>More targeted industrial demand</span>
        <strong>$9.33 <small>billion</small></strong>
        <p>India industrial automation and control systems, 2025 market estimate.</p>
        <SourceLink url={e.automation.url} label="Grand View Research"/>
      </article>
      <article className="iv-market-kpi">
        <span>Component investment pipeline</span>
        <strong>106 <small>projects</small></strong>
        <p>Third-party ECMS approvals representing ₹69,548 crore of planned investment as of Aug 2026.</p>
        <SourceLink url={e.components.url} label="Government of India"/>
      </article>
    </div>
    <div className="iv-market-charts">
      <div className="iv-market-chart-panel">
        <div className="iv-market-chart-title"><div><span className="iv-eyebrow">Observed manufacturing growth</span><h4>India electronics production</h4></div><span>₹ lakh crore</span></div>
        <div className="iv-market-bar-row"><span>FY 2024–25</span><div className="iv-market-bar-track"><i style={{width:"86.35%"}}/></div><strong>11.32</strong></div>
        <div className="iv-market-bar-row"><span>FY 2025–26</span><div className="iv-market-bar-track"><i style={{width:"100%"}}/></div><strong>13.11</strong></div>
        <p>Published actual output; the industry includes mobile phones and consumer products beyond this business&apos;s proposed offering. <SourceLink url={e.electronics.url} label="Source"/></p>
      </div>
      <div className="iv-market-chart-panel">
        <div className="iv-market-chart-title"><div><span className="iv-eyebrow">Independent industry outlook</span><h4>India industrial automation market</h4></div><span>USD billions</span></div>
        <div className="iv-market-bar-row"><span>2025 · Estimate</span><div className="iv-market-bar-track"><i style={{width:"35.74%"}}/></div><strong>9.33</strong></div>
        <div className="iv-market-bar-row"><span>2033 · Forecast</span><div className="iv-market-bar-track"><i className="iv-market-forecast-bar" style={{width:"100%"}}/></div><strong>26.11</strong></div>
        <p>Grand View Research forecasts 13.7% annual growth for 2026–2033. This is not a company forecast. <SourceLink url={e.automation.url} label="Source"/></p>
      </div>
    </div>
    <div className="iv-industrial-segments"><div className="iv-industrial-intro"><span className="iv-eyebrow">Relevant manufacturing categories / Historical output</span><h4>Industrial electronics and components already represent multibillion-dollar categories.</h4></div><div className="iv-industrial-values"><div><strong>$12.5B</strong><span>India industrial electronics output · FY 2023–24</span></div><div><strong>$10.5B</strong><span>India electronic components output · FY 2023–24</span></div></div><p>Historical domestic production estimates reported by NITI Aayog from MeitY data. The categories are adjacent to the proposed products, not a claim of directly accessible sales or additive TAM. <SourceLink url={e.industrial.url} label="NITI Aayog sector analysis"/></p></div>
    <div className="iv-market-bottom">
      <div><strong>Broader policy ambition</strong><p>NITI Aayog outlined a pathway to <b>$500 billion in electronics production by 2030</b>, conditional on major structural improvements. This is a policy target, not an achieved size or a guaranteed market forecast.</p><SourceLink url={e.ambition.url} label="NITI Aayog"/></div>
      <div><strong>Cross-border foundation</strong><p>India–Nepal merchandise trade totaled approximately <b>$9.39 billion in FY 2025–26</b>. The bilateral figure covers all merchandise, not electronics. Origin, tax and tariff eligibility must be validated product by product.</p><SourceLink url={e.nepalIndia.url} label="Embassy of India"/></div>
    </div>
  </div>;
}

export function MarketCatalysts() {
  return <div className="iv-catalysts">
    {demandDrivers.map(driver=><article className="iv-catalyst" key={driver.number}>
      <span>{driver.number} / DEMAND DRIVER</span>
      <h3>{driver.title}</h3>
      <p>{driver.description}</p>
      <strong>{driver.example}</strong>
      <SourceLink url={driver.source} label="Industry reference"/>
    </article>)}
  </div>;
}

/** Bottom-up account count x annual spend model; explicitly hypothetical before launch. */
export function MarketEntryPlanner() {
  const [index,setIndex]=useState(0);
  const row=targetAccountScenarios[index];
  const [accounts,setAccounts]=useState<number>(row.accounts);
  const [spend,setSpend]=useState<number>(row.annualSpendUsd);
  const [months,setMonths]=useState<number>([6,9,12][index]);
  const effectiveAccounts=accounts*months/12;
  const modeledRevenue=effectiveAccounts*spend;
  const planRevenue=row.accounts*row.annualSpendUsd;
  const delta=modeledRevenue-planRevenue;
  const grossProfit=modeledRevenue*row.marginPercent/100;
  const requiredAccounts=Math.ceil(planRevenue/(spend*months/12));
  const selectYear=(next:number)=>{setIndex(next);setAccounts(targetAccountScenarios[next].accounts);setSpend(targetAccountScenarios[next].annualSpendUsd);setMonths([6,9,12][next]);};
  const totalPlan=useMemo(()=>targetAccountScenarios.map(x=>x.accounts*x.annualSpendUsd),[]);
  return <div className="iv-entry-model">
    <div className="iv-entry-head"><div><div className="iv-eyebrow">Commercial planning / Customer acquisition and duration</div><h3>Convert account targets into recognized annual sales.</h3><p>An annual account-spend target assumes a full year of activity. Adjust the average number of purchasing months to reflect when accounts start buying and the impact of ramp-up on the annual forecast.</p></div><Link href="/investments/nepal-india-electronics#sales-strategy" className="iv-entry-link">Review wholesale acquisition strategy ↗</Link></div>
    <div className="iv-entry-years" role="group" aria-label="Forecast year">
      {targetAccountScenarios.map((scenario,i)=><button key={scenario.year} className={i===index?"active":""} type="button" aria-pressed={i===index} onClick={()=>selectYear(i)}><span>{scenario.year}</span><strong>{usdMillions(totalPlan[i])}</strong><small>Existing planning target</small></button>)}
    </div>
    <div className="iv-entry-grid">
      <div className="iv-entry-controls">
        <label>Purchasing accounts <strong>{accounts.toLocaleString("en-US")}</strong><input aria-label="Purchasing accounts" type="range" min="1" max="200" step="1" value={accounts} onChange={e=>setAccounts(+e.target.value)}/></label>
        <label>Average annualized purchasing / account <strong>{usd(spend)}</strong><input aria-label="Annualized purchases per account" type="range" min="25000" max="300000" step="5000" value={spend} onChange={e=>setSpend(+e.target.value)}/></label>
        <label>Average active purchasing months <strong>{months} / 12</strong><input aria-label="Average months of purchasing activity per account" type="range" min="1" max="12" step="1" value={months} onChange={e=>setMonths(+e.target.value)}/></label>
        <p>Scenario assumes uniform account spend while active. Real purchasing is uneven, and customer acquisition is unverified. Wholesale and service revenues should also be modeled separately.</p>
      </div>
      <div className="iv-entry-outcomes">
        <div><span>Illustrative annual sales after ramp</span><strong>{usdMillions(modeledRevenue)}</strong><small>{accounts} accounts × {usd(spend)} annual rate × {months}/12</small></div>
        <div><span>Accounts required for {row.year} plan</span><strong>{requiredAccounts}</strong><small>At the selected spend and average active months, versus {accounts} in this scenario</small></div>
        <div><span>Gross profit at {row.marginPercent}% blended forecast margin</span><strong>{usdMillions(grossProfit)}</strong><small>Illustrative margin assumption; excludes fixed operating, financing and taxes</small></div>
        <div><span>Gap to {row.year} revenue target</span><strong>{delta===0?"On plan":(delta>0?"+":"−")+usdMillions(Math.abs(delta))}</strong><small>Accounts and spend must both be achieved to realize the plan</small></div>
      </div>
    </div>
    <p className="iv-entry-note">Illustration: 24 accounts at $75k annual spending achieve $1.8M only if they each purchase throughout all 12 months. At six average active months the same accounts yield $900k; roughly 48 accounts are needed for $1.8M if average spending is unchanged. These are prospective calculations, not contracted buyers.</p>
  </div>;
}
