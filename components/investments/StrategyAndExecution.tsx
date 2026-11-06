import Link from "next/link";
import { swot, competitionForces, investmentWedges, externalDrivers, principalRisks, deliveryPhases, launchMeasures, analysisSources } from "@/lib/investments/strategy";
import { baselineQuarterlyAcquisition, initialTradeCapital } from "@/lib/investments/electronics";

const dollars=(n:number)=>"$"+Math.round(n).toLocaleString("en-US");

/** Evaluative strategy for investors; all pressure assessments are qualitative judgments. */
export function StrategicInvestmentAnalysis() {
  return (
    <div className="iv-strategy-suite">
      <div className="iv-strategy-lead">
        <span className="iv-eyebrow">SWOT / Position and action</span>
        <h3>Where the business can win—and what must be built.</h3>
        <p>The opening commercial engine is distribution: establish supplier rights, acquire liquid inventory and build a repeatable buy–sell–reorder cycle. This SWOT pairs commercial advantages and risks with a practical operating response.</p>
      </div>
      <div className="iv-swot-grid">
        {swot.map(item=>(
          <article className={"iv-swot-card iv-swot-"+item.tone} key={item.id}>
            <div className="iv-swot-top"><span className="iv-swot-letter" aria-hidden="true">{item.symbol}</span><div><h4>{item.title}</h4><small>{item.subtitle}</small></div></div>
            <ul>{item.points.map(p=><li key={p}>{p}</li>)}</ul>
            <div className="iv-swot-action"><span>Strategic response</span><p>{item.response}</p></div>
          </article>
        ))}
      </div>
      <div className="iv-strategy-priority">
        <div><span className="iv-eyebrow">Opportunity selection</span><h3>Lead with fast-moving inventory. Turn distributor access into long-term advantage.</h3><p>The first phase concentrates on inventory with observable resale demand, traceable supply and workable gross-to-net margins. Authorized channel relationships and engineered solutions expand the model over time.</p></div>
        <div className="iv-wedge-grid">
          {investmentWedges.map((w,i)=><article className="iv-wedge-card" key={w.label}>
            <div className="iv-wedge-head"><span>{w.label}</span><b>0{i+1}</b></div>
            <h4>{w.title}</h4><p>{w.why}</p>
            <div><small>Commercial qualification</small><p>{w.proof}</p></div>
            <div><small>Inventory / capital approach</small><p>{w.capital}</p></div>
          </article>)}
        </div>
      </div>
      <details className="iv-strategy-details">
        <summary><span><strong>Industry structure</strong><small>Competitive forces and operating environment</small></span><span className="iv-details-plus" aria-hidden="true">+</span></summary>
        <div className="iv-forces">
          <div className="iv-analysis-title"><span className="iv-eyebrow">Porter's Five Forces / Qualitative pressure assessment</span><h4>Compete through focused stock availability and stronger supplier economics.</h4></div>
          {competitionForces.map(force=><article className="iv-force" key={force.name}>
            <div className="iv-force-name"><strong>{force.name}</strong><span>{force.level}</span></div>
            <div className="iv-force-meter" role="img" aria-label={force.name+": "+force.level+" competitive pressure"}>
              {Array.from({length:5},(_,i)=><i key={i} className={i<force.strength?"active":""}/>)}
            </div>
            <p>{force.why}</p>
            <div className="iv-force-play"><b>Response</b> {force.play}</div>
          </article>)}
          <p className="iv-analysis-caption">Pressure ratings are founder-planning judgments; they are not third-party market scores or measurements of the proposed company's performance.</p>
        </div>
        <div className="iv-external">
          <div className="iv-analysis-title"><span className="iv-eyebrow">External conditions / PESTL</span><h4>Policy, capital, customer and compliance sensitivities.</h4></div>
          <div className="iv-external-grid">{externalDrivers.map(item=><article key={item.code}>
            <span className="iv-external-code">{item.code}</span><h5>{item.name}</h5><p>{item.signal}</p><strong>{item.move}</strong>
          </article>)}</div>
          <div className="iv-analysis-source"><span>Industry context:</span> {analysisSources.map((source,i)=><a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{i>0?" · ":""}{source.label} ↗</a>)}</div>
        </div>
      </details>
    </div>
  );
}

/** Milestone-based plan and evidence gates for launch to repeatable operations. */
export function InvestmentDeliveryRoadmap() {
  const firstCycleWithLogistics=baselineQuarterlyAcquisition*1.05;
  const firstCycleVariance=firstCycleWithLogistics-initialTradeCapital;
  return <div className="iv-execution">
    <div className="iv-execution-intro"><span className="iv-eyebrow">Program execution / First 18 months</span><h3>Five phases: distribution access to repeat inventory turnover and expansion.</h3><p>Establish distributor and supplier relationships first, acquire an initial tranche of resalable SKUs, and build successive inventory turns. Later phases add broader channels, engineered products and additional countries.</p></div>
    <div className="iv-project-track">
      {deliveryPhases.map((phase,i)=><article className="iv-project-phase" key={phase.code}>
        <div className="iv-phase-index">{phase.code}</div>
        <div className="iv-phase-content"><div className="iv-phase-header"><span>{phase.window}</span><h4>{phase.title}</h4></div>
          <p>{phase.focus}</p>
          <ul>{phase.deliverables.map(x=><li key={x}>{x}</li>)}</ul>
          <div className="iv-phase-gate"><strong>Capital progression milestone</strong><span>{phase.gate}</span></div>
        </div>
        {i<deliveryPhases.length-1&&<span className="iv-phase-connector" aria-hidden="true"/>}
      </article>)}
    </div>
    <div className="iv-execution-bottom">
      <div className="iv-capital-panel">
        <span className="iv-eyebrow">Capital sequencing / Illustration</span>
        <h4>Build cash velocity from the first inventory cycle.</h4>
        <p>At the original modeled quarterly volumes, purchasing across all ten families totals <strong>{dollars(baselineQuarterlyAcquisition)}</strong> before logistics. A 5% handling allowance lifts the comparison case to <strong>{dollars(firstCycleWithLogistics)}</strong>, versus <strong>{dollars(initialTradeCapital)}</strong> earmarked for inventory and revolving trade capital in the initial investment scenario.</p>
        <p>That <strong>{dollars(firstCycleVariance)}</strong> difference is a full-portfolio planning sensitivity, not the intended opening order. Begin with a limited first-stock mix, sell through existing reseller and wholesale channels, and replenish only after observing realized margin and cash conversion. Supplier credit and subsequent trade facilities can accelerate scale.</p>
        <Link href="/investments/nepal-india-electronics/suppliers#scale">Explore inventory-turn and financing scenarios ↗</Link>
      </div>
      <div className="iv-measures-panel">
        <span className="iv-eyebrow">Operating scorecard / Four management signals</span>
        {launchMeasures.map(x=><div className="iv-measure" key={x.name}><span>{x.category}</span><strong>{x.name}</strong><p>{x.target}</p></div>)}
      </div>
    </div>
    <details className="iv-strategy-details iv-risks-details">
      <summary><span><strong>Execution risk register</strong><small>Exposure, early signals and proposed responses</small></span><span className="iv-details-plus" aria-hidden="true">+</span></summary>
      <div className="iv-risk-list">
        {principalRisks.map(risk=><article key={risk.risk}><div><strong>{risk.risk}</strong><span>{risk.exposure} exposure</span></div><p>{risk.indicator}</p><p><b>Management response</b> {risk.action}</p></article>)}
      </div>
      <p className="iv-analysis-caption">Risk classifications and milestone targets are proposed execution controls. They should be updated as buyers, supplier terms and country-specific regulatory guidance are obtained.</p>
    </details>
  </div>;
}
