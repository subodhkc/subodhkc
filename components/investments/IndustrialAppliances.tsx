"use client";
import { useState } from "react";
import Link from "next/link";

/** Concepts, not commercialized devices, validated quotes or established compliance results. */
const applianceCatalog = [
 {
  id:"AI-ALERT-01", name:"Universal Industrial Alert Box", tier:"01 / First pilot candidate",
  hw:"Industrial RS485/Ethernet gateway, isolated inputs, optional cellular modem, DIN-rail enclosure",
  sw:"Configurable Modbus/MQTT ingestion, local threshold rules, event queue, dashboard, alert routing and authenticated webhooks",
  integrations:"REST API, MQTT, webhooks, email; SMS requires a contracted provider",
  customer:"HVAC, cold storage, pumps, generators, facilities",
  deployment:"Start read-only; non-safety-critical notification; no unattended actuator commands",
  unitCost:250,unitSale:799,monthly:"$29–$79",
  risks:"Customer protocol mapping, cybersecurity hardening, alert delivery reliability, false alarms, firmware updates",
  source:"https://wiki.seeedstudio.com/recomputer_r1100_intro/",
  proof:"Device identity, configuration version, connector permissions, alert delivery receipts, event logs"
 },
 {
  id:"AI-MONITOR-01", name:"AI Machine Monitor", tier:"02 / Predictive maintenance pilot",
  hw:"Industrial gateway, vibration sensor, temperature probe and current monitoring with suitable electrical isolation",
  sw:"Time-series collection, calibration records, baseline learning, anomaly thresholds, service alerts and trend dashboards",
  integrations:"MQTT, OPC UA via qualified adapters, REST/webhooks; CMMS integration by project",
  customer:"Workshops, pump operators, factories, compressors and maintenance providers",
  deployment:"Advisory alerts only until field validation; no claims of guaranteed failure prediction",
  unitCost:380,unitSale:1199,monthly:"$39–$99",
  risks:"Sensor placement and calibration, operating-condition drift, false alerts, electrical qualification",
  source:"https://wiki.seeedstudio.com/recomputer_r1100_intro/",
  proof:"Sensor provenance, threshold changes, model version, alert disposition, incident history"
 },
 {
  id:"AI-VISION-01", name:"AI Vision Inspection Box", tier:"03 / Higher-value engineered pilot",
  hw:"Production-qualified Jetson-class computer, industrial camera, controlled lighting, power and enclosure",
  sw:"On-device vision inference, defect classification, operator review, quality event storage, model update controls",
  integrations:"MES/ERP connectors, REST API, MQTT events, reviewed export for manufacturing systems",
  customer:"Packaging, electronics assembly and quality inspection",
  deployment:"Human-reviewed reject recommendations; safety-critical or autonomous machine control requires separate engineering",
  unitCost:1100,unitSale:3500,monthly:"Custom software/support SOW",
  risks:"Labeled defect datasets, recall/precision, lighting variance, site acceptance, equipment safety",
  source:"https://docs.nvidia.com/jetson/orin-nano-devkit/user-guide/latest/",
  proof:"Model checksum, dataset lineage, decision trace, override record, production version and acceptance tests"
 }
] as const;
const usd=(n:number)=>"$"+Math.round(n).toLocaleString("en-US");

export function IndustrialAppliances({compact=false}:{compact?:boolean}) {
 return <section id="ready-to-deploy-ai-appliances" aria-labelledby="appliance-heading" style={{maxWidth:1200,margin:"36px auto",padding:"28px 22px",border:"1px solid #355058",borderRadius:16,background:"#10262d",color:"#edf7f3"}}>
  <div style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"#9ce2c0"}}>Product architecture / Hardware + software + support</div>
  <h2 id="appliance-heading" style={{fontFamily:"Georgia,serif",fontSize:"clamp(25px,3vw,37px)",margin:"12px 0"}}>Turn sourced components into ready-to-deploy industrial AI products.</h2>
  <p style={{maxWidth:950,color:"#bed1d1",lineHeight:1.65,margin:"0 0 22px"}}>Purchase finished gateways, sensors, edge computers and enclosures from qualified suppliers. Assemble and configure them, install our software, connect to customer applications and offer optional managed support. No in-house electronics manufacturing. These are proposed product concepts, not shipping products. Supplier hardware references identify capability classes, not complete or approved bills of materials.</p>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:14}}>
   {applianceCatalog.map(a=><article key={a.id} style={{padding:20,background:"#17343b",border:"1px solid #486168",borderRadius:12}}>
    <div style={{fontSize:11,letterSpacing:1.5,color:"#a6e6c5"}}>{a.tier}</div>
    <h3 style={{fontFamily:"Georgia,serif",fontSize:22,margin:"10px 0"}}>{a.name}</h3>
    <p style={{fontSize:12,color:"#acc8cb"}}>{a.id} · Proposed bundled product</p>
    <p style={{fontSize:13,lineHeight:1.65}}><strong>Hardware:</strong> {a.hw}</p>
    <p style={{fontSize:13,lineHeight:1.65}}><strong>Our software:</strong> {a.sw}</p>
    {!compact&&<p style={{fontSize:13,lineHeight:1.65}}><strong>Connectivity:</strong> {a.integrations}</p>}
    <p style={{fontSize:13,lineHeight:1.65}}><strong>Best-fit buyer:</strong> {a.customer}</p>
    <div style={{borderTop:"1px solid #3d5a5b",marginTop:13,paddingTop:14,display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
     <div><small style={{display:"block",color:"#a9c2c6"}}>Modeled hardware + assembly</small><strong style={{fontSize:20}}>{usd(a.unitCost)}</strong></div>
     <div><small style={{display:"block",color:"#a9c2c6"}}>Target appliance selling price</small><strong style={{fontSize:20}}>{usd(a.unitSale)}</strong></div>
    </div>
    <p style={{fontSize:12,color:"#a5ddbd",margin:"12px 0"}}>Optional software/support: {a.monthly}</p>
    <p style={{fontSize:12,color:"#b5c8c8",lineHeight:1.6}}><strong>Deployment boundary:</strong> {a.deployment}</p>
    {!compact&&<p style={{fontSize:12,color:"#b5c8c8",lineHeight:1.6}}><strong>Cost and engineering risks:</strong> {a.risks}</p>}
    {a.id==="AI-ALERT-01"&&<Link href="/investments/nepal-india-electronics/uiab-100" style={{display:"block",fontSize:13,fontWeight:700,margin:"10px 0 14px",color:"#a9f1c2",textDecoration:"underline"}}>Explore UIAB-100 interactive prototype blueprint ↗</Link>}
    <a href={a.source} target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:"#b1e8c7",textDecoration:"underline"}}>Manufacturer technical reference ↗</a>
   </article>)}
  </div>
  <div style={{marginTop:22,padding:20,borderRadius:12,background:"#091e24",border:"1px solid #315459"}}>
   <h3 style={{fontSize:22,fontFamily:"Georgia,serif",margin:"0 0 12px"}}>HAIEC: assurance layer for the device-to-AI-to-action chain</h3>
   <p style={{fontSize:14,lineHeight:1.7,color:"#c4d8d6"}}>HAIEC can be positioned as a separate, independently scoped assurance workflow for these proposed systems: inventory capabilities and credentials; distinguish requested, approved, technically available and observed actions; test connector permissions and tenant isolation; and retain traceable evidence of model decisions, alert delivery and configuration changes.</p>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12}}>
    {applianceCatalog.map(a=><div key={a.id} style={{padding:12,border:"1px solid #36545a",borderRadius:9}}><strong style={{fontSize:13}}>{a.name}</strong><p style={{fontSize:12,color:"#aec5c5",lineHeight:1.55,marginBottom:0}}>{a.proof}</p></div>)}
   </div>
   <p style={{fontSize:12,color:"#afc5c3",lineHeight:1.65}}>Assurance evidence is not a certification, guarantee of safety or proof of regulatory conformity. Determine applicable industrial electrical, EMC, cybersecurity, machinery safety, privacy and AI obligations by product design, destination market and intended use. Safety-related actuation requires engineered interlocks and appropriate independent assessment.</p>
   <div style={{display:"flex",gap:18,flexWrap:"wrap"}}><a href="https://www.haiec.com/" target="_blank" rel="noopener noreferrer" style={{color:"#ace8c9",textDecoration:"underline"}}>Explore HAIEC assurance ↗</a><Link href="/investments/nepal-india-electronics/catalog" style={{color:"#ace8c9",textDecoration:"underline"}}>Compare proposed product SKUs ↗</Link></div>
  </div>
  <p style={{fontSize:12,lineHeight:1.6,color:"#b2c7c7",margin:"18px 0 0"}}>Unit targets reflect hypothetical purchased hardware and assembly allowances; they exclude recurring software costs, one-time development, distribution commissions, tariffs, certification, site installation and full warranty/field-support obligations. Do not interpret the hardware spread as realized gross margin or compare these USD scenario figures with INR catalog cases as converted quotes.</p>
 </section>;
}
export function ApplianceScenario() {
 const [scenario,setScenario]=useState("base");
 const cases=[
 {id:"downside",name:"Conservative / existing plan",revenue:1800000,margin:15.07,opex:250000,description:"Current modeled mix; does not presume appliance traction."},
 {id:"base",name:"Product-led target",revenue:2500000,margin:22,opex:375000,description:"Higher bundled-appliance and service mix; requires validated production and customer orders."},
 {id:"stretch",name:"Accelerated execution",revenue:3500000,margin:26,opex:550000,description:"Significant volume ramp, installed support capacity and funded sales execution required."}
 ];
 const x=cases.find(y=>y.id===scenario)||cases[1];
 return <section id="product-led-2027" style={{maxWidth:1200,margin:"30px auto",padding:"26px 22px",background:"#132b33",border:"1px solid #35545a",borderRadius:14,color:"#eff8f4"}}>
  <span style={{fontSize:11,letterSpacing:2,color:"#9bdec0"}}>2027 sensitivity / Not included in base forecast</span>
  <h2 style={{fontFamily:"Georgia,serif",fontSize:30,margin:"10px 0"}}>What changes if engineered products sell earlier?</h2>
  <p style={{fontSize:14,color:"#c2d3d1",lineHeight:1.6}}>A separate, explicitly speculative revenue-mix sensitivity. The original 2027 financial base remains unchanged. Higher bundled hardware and software margins are not earned until component, labor, channel, cloud and support costs are validated.</p>
  <div style={{display:"flex",flexWrap:"wrap",gap:9,margin:"18px 0"}}>{cases.map(c=><button type="button" key={c.id} onClick={()=>setScenario(c.id)} aria-pressed={scenario===c.id} style={{padding:"10px 13px",border:"1px solid #679182",borderRadius:7,background:scenario===c.id?"#a0dfbd":"transparent",color:scenario===c.id?"#09241d":"#edfaf3",cursor:"pointer"}}>{c.name}</button>)}</div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(125px,1fr))",gap:12}}>{[["Revenue",usd(x.revenue)],["Gross margin",x.margin+"%"],["Gross profit",usd(x.revenue*x.margin/100)],["Operating expenses",usd(x.opex)],["Illustrative EBITDA",usd(x.revenue*x.margin/100-x.opex)]].map(([label,value])=><div key={label} style={{padding:13,border:"1px solid #436169",borderRadius:8}}><small style={{display:"block",color:"#adc5c7"}}>{label}</small><strong style={{fontSize:19}}>{value}</strong></div>)}</div>
  <p style={{fontSize:13,color:"#bdd2d0",marginTop:16}}>{x.description} EBITDA excludes financing, taxes, product development capitalization, working-capital needs and one-off launch expenses not included in operating costs.</p>
 </section>;
}
