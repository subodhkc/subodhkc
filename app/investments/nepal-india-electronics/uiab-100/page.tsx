"use client";
import {useState} from "react";
import Link from "next/link";
import "./uiab.css";

const base="/investments/nepal-india-electronics";
type DemoMode="cold"|"pump";
const bill=[
 ["Edge gateway","Seeed reComputer R1125-10","113991334","1","$230–$313","Isolated RS485, dual Ethernet; confirm stock"],
 ["Temperature / humidity","DFRobot RS485 Modbus sensor","SEN0438","1","$30","12–36V DC; condensation considerations"],
 ["Power","MEAN WELL 24V 1.5A DIN PSU","HDR-30-24","1","$15–$23","Qualified AC installation or certified bench DC"],
 ["Mechanical","Rated enclosure + DIN rail","Application-specific","1","$30–$60","Thermal, service access and environment"],
 ["Electrical","Terminal, protection, connectors","Engineer-specified","Lot","$20–$40","Fuse/wire sizes require reviewed drawings"],
 ["Cabling","RS485, Cat6, DC leads","Compatibility checked","Lot","$10–$20","Polarity, shield and termination"],
 ["Bench DI source","Isolated input simulator","5–24V compatible","1","$10–$30","No direct mains or motor switching"]
];
const layers=[
 {number:"01",tag:"Sense",title:"Industrial inputs",body:"RS485/Modbus RTU sensor, safe digital-input simulator and optional read-only Modbus TCP.",detail:"Input allowlist, timestamps and data freshness."},
 {number:"02",tag:"Decide",title:"Local edge intelligence",body:"Python + PyModbus, local deterministic rules, dwell, hysteresis and SQLite WAL event queue.",detail:"Works during internet loss; no LLM in alarm path."},
 {number:"03",tag:"Deliver",title:"Customer workflows",body:"TLS outbound sync, signed webhooks, email, optional SMS, MQTT and application APIs.",detail:"Retries and idempotency prevent silent message loss."},
 {number:"04",tag:"Prove",title:"Evidence and operations",body:"Rule versions, event transitions, acknowledgements, device health and audit export.",detail:"HAIEC assessment integration is reserved, not active."}
];
const editions=[
 {name:"STARTER",tag:"First pilot",price:"$899–$1,199",saas:"$29–$49 / month",items:["1 edge appliance + compatible sensor","5 deterministic rules","Email and signed webhook","30-day event history","1 site / 1 device"]},
 {name:"PRO",tag:"Multi-asset monitoring",price:"$1,199–$1,499 + options",saas:"$79–$149 / month",items:["Additional qualified sensors","20 rules and escalations","Usage-billed SMS capability","90-day event history","Integration templates"]},
 {name:"MANAGED",tag:"Integrator / operator",price:"Quoted by BOM",saas:"From $199 / site / month",items:["Optional qualified LTE / backup","Fleet console and RBAC","Custom integration SOW","Service response commitments","Extended retention options"]},
 {name:"OEM",tag:"White-label platform",price:"Volume / NRE quote",saas:"License and support agreement",items:["Branded enclosure and portal","Provisioning automation","Custom connector packages","Firmware / support lifecycle","Engineering and qualification scope"]}
];
const gates=[
 ["00","Design freeze","Orderable gateway, sensor register map, approved wiring and costed BOM"],
 ["01","Edge foundation","Device identity, input reading, local SQLite persistence"],
 ["02","Event reliability","Dwell, hysteresis, stale sensor state, retry and deduplication"],
 ["03","Customer setup","Web wizard, rules, signed webhook, email and acknowledgement"],
 ["04","Field pilot","72-hour soak, outage/recovery, false alarms and site acceptance"],
 ["05","Commercial release","Installation guide, tested support, qualification and full cost accounting"]
];
const sourceLinks=[
 ["Seeed R1125-10","https://www.seeedstudio.com/reComputer-R1125-10-p-6256.html"],
 ["Seeed gateway integration manual","https://wiki.seeedstudio.com/recomputer_r1100_intro/"],
 ["DFRobot SEN0438","https://www.dfrobot.com/product-2279.html"],
 ["MEAN WELL supply reference","https://www.digikey.com/en/products/detail/mean-well-usa-inc/HDR-30-24/7703799"],
 ["NIST SP 800-82 Rev. 3","https://csrc.nist.gov/pubs/sp/800/82/r3/final"]
];
export default function UIABBlueprintPage(){
 const [mode,setMode]=useState<DemoMode>("cold");
 const [offline,setOffline]=useState(false);
 const [temp,setTemp]=useState(7);
 const [threshold,setThreshold]=useState(8);
 const [pump,setPump]=useState(false);
 const [selectedLayer,setSelectedLayer]=useState(1);
 const [showSpecs,setShowSpecs]=useState(false);
 const alerted=mode==="cold"?temp>=threshold:pump;
 const signal=mode==="cold"?temp+"°C":pump?"FAULT":"RUNNING";
 const label=mode==="cold"?(alerted?"HIGH TEMPERATURE":"NORMAL TEMPERATURE"):(alerted?"PUMP STATUS ALERT":"NORMAL OPERATION");
 return <main className="uib">
  <nav className="uib-nav"><Link href={base} className="uib-logo"><span className="uib-logo-mark">U</span> UIAB<span className="uib-mono"> / 100</span></Link><div className="uib-navlinks"><a href="#architecture">Architecture</a><a href="#simulator">Simulator</a><a href="#hardware">Hardware</a><a href="#packages">Packages</a><a href="#delivery">Roadmap</a></div><Link href={base+"/catalog"} className="uib-nav-cta">Product catalog ↗</Link></nav>
  <section className="uib-hero">
   <div className="uib-container uib-hero-grid">
    <div className="uib-hero-copy">
     <div className="uib-kicker"><span className="uib-dot"/> PROTOTYPE ENGINEERING BLUEPRINT / v1.1</div>
     <h1>Industrial alerts.<br/><em>Ready out of the box.</em></h1>
     <p className="uib-lead">A configurable edge appliance that transforms machine signals into reliable notifications, application events and evidence. Designed for facilities, cold storage and equipment operators.</p>
     <div className="uib-tags"><span>Read-only OT</span><span>Offline-first rules</span><span>RS485 + Ethernet</span><span>Signed webhooks</span></div>
     <div className="uib-hero-ctas"><a href="#simulator" className="uib-button uib-primary">Explore simulated operation <span>↗</span></a><a href="#hardware" className="uib-button uib-outline">Review prototype BOM</a></div>
     <p className="uib-hero-footnote">Design concept. Not a shipping, certified, field-validated or safety-rated product. Illustrative software interactions below use simulated data.</p>
    </div>
    <div className="uib-machine-visual" role="img" aria-label="Conceptual industrial alert box receiving sensor signals, processing rules, and issuing an alert">
      <div className="uib-visual-label">FIELD DEVICE / CONCEPTUAL VIEW</div>
      <svg viewBox="0 0 540 390" width="100%" aria-hidden="true">
       <defs><linearGradient id="uiabBody" x1="0" x2="1"><stop offset="0" stopColor="#263f46"/><stop offset="1" stopColor="#132930"/></linearGradient><linearGradient id="uiabLine" x1="0" x2="1"><stop offset="0" stopColor="#5d947e"/><stop offset="1" stopColor="#d5ea9a"/></linearGradient></defs>
       <g className="uib-connection"><path d="M45 109 H143 V159" fill="none" stroke="#678b85" strokeWidth="2" strokeDasharray="5 7"/><path d="M399 172 H490 V110" fill="none" stroke="#678b85" strokeWidth="2" strokeDasharray="5 7"/><circle r="5" fill="#b0e6aa"><animateMotion dur="3s" repeatCount="indefinite" path="M45 109 H143 V159"/></circle><circle r="5" fill="#c0e7a0"><animateMotion dur="3.4s" repeatCount="indefinite" path="M399 172 H490 V110"/></circle></g>
       <g><rect x="8" y="72" width="120" height="73" rx="9" fill="#0e252d" stroke="#60827b"/><text x="23" y="100" fontSize="12" fill="#bde2cf">RS485 SENSOR</text><text x="23" y="125" fontSize="18" fill="#f7f6e9">07.0 °C</text></g>
       <g><rect x="416" y="70" width="117" height="74" rx="9" fill="#0e252d" stroke="#60827b"/><text x="428" y="100" fontSize="12" fill="#bde2cf">ALERT EVENT</text><text x="428" y="125" fontSize="18" fill="#f7f6e9">WEBHOOK ↗</text></g>
       <g><rect x="142" y="142" width="262" height="184" rx="14" fill="url(#uiabBody)" stroke="#8baca2" strokeWidth="2"/><rect x="155" y="155" width="236" height="151" rx="7" fill="#122a31" stroke="#436d69"/><circle cx="177" cy="178" r="4" fill="#bde6a6" className="uib-led"/><text x="193" y="183" fill="#b4e2c4" fontSize="10" letterSpacing="2">SYSTEM HEALTHY</text><text x="176" y="225" fill="#f1f5e9" fontSize="23" fontWeight="700">UIAB—100</text><text x="177" y="247" fill="#b8cac5" fontSize="11">INDUSTRIAL EDGE MONITOR</text><path d="M176 265 H369" stroke="#476560"/><text x="177" y="284" fill="#a3d7b5" fontSize="10">RS485  ·  MODBUS  ·  ETH  ·  DI</text><rect x="170" y="326" width="22" height="15" rx="3" fill="#243e45" stroke="#77918b"/><rect x="201" y="326" width="22" height="15" rx="3" fill="#243e45" stroke="#77918b"/><rect x="232" y="326" width="22" height="15" rx="3" fill="#243e45" stroke="#77918b"/><rect x="318" y="326" width="51" height="15" rx="3" fill="#243e45" stroke="#77918b"/></g>
       <g fill="#96b6ab" fontSize="10"><text x="35" y="161">INPUT</text><text x="433" y="161">OUTPUT</text><text x="183" y="370">DIN RAIL · 24V DC · ISOLATED I/O</text></g>
      </svg>
      <div className="uib-screen-footer"><span><i className="uib-statuslight"/> EDGE PROCESSING ACTIVE</span><span>OUTPUTS DISABLED</span></div>
    </div>
   </div>
  </section>
  <section className="uib-stripe"><div className="uib-container uib-stripe-grid"><div><small>REFERENCE CONTROLLER</small><strong>R1125-10</strong></div><div><small>LOCAL RULE ENGINE</small><strong>Deterministic</strong></div><div><small>PROPOSED ASSEMBLED HARDWARE</small><strong>$450–$650</strong></div><div><small>FIRST VALIDATION</small><strong>Cold room + pump status</strong></div></div></section>
  <section id="architecture" className="uib-section uib-container"><div className="uib-head"><div><span className="uib-eyebrow">01 / SYSTEM DESIGN</span><h2>Four layers. One reliable event.</h2></div><p>Instrumentation remains distinct from decisions and customer notifications. Every transition creates a traceable record.</p></div>
   <div className="uib-flow" aria-label="System data flow">
    {layers.map((layer,i)=><button key={layer.number} className={"uib-flow-card "+(selectedLayer===i?"selected":"")} onClick={()=>setSelectedLayer(i)} aria-pressed={selectedLayer===i}><span className="uib-flow-step">{layer.number} / {layer.tag}</span><strong>{layer.title}</strong><span>{layer.body}</span><span className="uib-flow-indicator">{i===3?"●":"→"}</span></button>)}
   </div>
   <div className="uib-flow-detail"><div><span>SELECTED LAYER / {layers[selectedLayer].number}</span><strong>{layers[selectedLayer].title}</strong></div><p>{layers[selectedLayer].detail}</p></div>
   <div className="uib-boundary"><div className="uib-boundary-icon">!</div><p><strong>Industrial safety boundary:</strong> v1 collects signals and sends notifications. PLC writes, actuator operations, remote shutdown and interlock overrides are not implemented. Loss of internet cannot disable local monitoring.</p></div>
  </section>
  <section id="simulator" className="uib-sim-section"><div className="uib-container"><div className="uib-head"><div><span className="uib-eyebrow">02 / INTERACTIVE CONCEPT DEMO</span><h2>See the alert lifecycle.</h2></div><p>Change a sensor value or disconnect cloud access to see the expected system states. Simulation only; not a connected physical device.</p></div>
   <div className="uib-simulator">
    <div className="uib-sim-sidebar"><div className="uib-sim-label">SCENARIO</div><div className="uib-switches"><button className={mode==="cold"?"active":""} onClick={()=>setMode("cold")}>Cold-storage temperature</button><button className={mode==="pump"?"active":""} onClick={()=>setMode("pump")}>Pump status alert</button></div><div className="uib-sim-control">{mode==="cold"?<><label htmlFor="uib-temp">Simulated sensor temperature <strong>{temp}°C</strong></label><input id="uib-temp" type="range" min="-5" max="20" step="1" value={temp} onChange={e=>setTemp(Number(e.target.value))}/><label htmlFor="uib-limit">Alert threshold <strong>{threshold}°C</strong></label><input id="uib-limit" type="range" min="0" max="15" value={threshold} onChange={e=>setThreshold(Number(e.target.value))}/></>:<><label>Simulate pump fault</label><button className={"uib-toggle "+(pump?"on":"")} onClick={()=>setPump(!pump)} aria-pressed={pump}>{pump?"Fault asserted":"Normal → trigger fault"}</button></>}</div><div className="uib-sim-label">NETWORK</div><button className={"uib-network "+(offline?"offline":"")} onClick={()=>setOffline(!offline)} aria-pressed={offline}><span className="uib-net-dot"/>{offline?"Cloud uplink disconnected":"Cloud uplink connected"}<span>{offline?"Restore":"Disconnect"}</span></button><p className="uib-sim-small">When offline, events are retained locally and queued for later transmission. This is intended behavior, pending physical reliability tests.</p></div>
    <div className="uib-sim-main"><div className="uib-sim-top"><span className="uib-sim-brand">UIAB / EVENT CONSOLE</span><span className="uib-sim-demo">SIMULATED DATA</span></div><div className="uib-sim-status-grid"><div><small>INPUT READING</small><strong>{signal}</strong><span>{mode==="cold"?"RS485 / MODBUS RTU":"ISOLATED DIGITAL INPUT"}</span></div><div><small>RULE EVALUATION</small><strong className={alerted?"uib-warn":""}>{alerted?"TRIGGERED":"NORMAL"}</strong><span>{label}</span></div><div><small>CLOUD DELIVERY</small><strong className={offline?"uib-warn":""}>{offline?"QUEUED":alerted?"READY TO SEND":"IDLE"}</strong><span>{offline?"Stored locally; retry on reconnect":"Outbound integration available"}</span></div></div>
     <div className="uib-event-path">{["SENSOR","LOCAL RULE","DURABLE EVENT","CUSTOMER ALERT"].map((x,i)=><div key={x} className={(alerted&&i<3)?"lit":(alerted&&!offline&&i===3)?"lit":""}><i/>{x}</div>)}</div>
     <div className="uib-event-log"><div><span>EVENT TRACE / EXAMPLE</span><span>UIAB-DEMO-001</span></div><code>01 &nbsp; sensor.read → {signal}</code><code>02 &nbsp; rule.evaluate → {alerted?"ALARM_TRUE":"ALARM_FALSE"}</code><code>03 &nbsp; local.store → {alerted?"EVENT_PERSISTED":"TELEMETRY_PERSISTED"}</code><code>04 &nbsp; delivery → {offline?"QUEUED_OFFLINE":alerted?"WEBHOOK_PENDING":"NO_ALERT_REQUIRED"}</code><code>05 &nbsp; actuation → DISABLED</code></div>
    </div>
   </div>
  </div></section>
  <section id="hardware" className="uib-section uib-container"><div className="uib-head"><div><span className="uib-eyebrow">03 / PROCUREMENT + ELECTRICAL</span><h2>Prototype bill of materials.</h2></div><p>Exact reference models and scoped cost estimates. No blanket claims that a component's certification covers a finished custom appliance.</p></div>
   <div className="uib-bom-top"><div><small>PARTS ESTIMATE</small><strong>$345–$516</strong><span>Before shipping, tax and labor</span></div><div><small>ASSEMBLED BENCH PILOT</small><strong>$450–$650</strong><span>Engineering and certification excluded</span></div><div><small>PROCUREMENT GATE</small><strong>Confirm stock</strong><span>R1125-10 availability not guaranteed</span></div></div>
   <div className="uib-table-scroll"><table className="uib-table"><thead><tr><th>Component</th><th>Reference / model</th><th>MPN</th><th>Qty</th><th>Budget</th></tr></thead><tbody>{bill.map(b=><tr key={b[0]}><td><strong>{b[0]}</strong><small>{b[5]}</small></td><td>{b[1]}</td><td className="uib-mono">{b[2]}</td><td>{b[3]}</td><td>{b[4]}</td></tr>)}</tbody></table></div>
   <button className="uib-spec-toggle" aria-expanded={showSpecs} onClick={()=>setShowSpecs(!showSpecs)}>{showSpecs?"Hide":"Show"} interface and wiring design constraints <span>{showSpecs?"−":"+"}</span></button>
   {showSpecs&&<div className="uib-specs"><article><strong>RS485-1 / Sensor</strong><p>Modbus RTU read polling. Confirm baud, register map, polarity, termination, isolation and cable-shield scheme.</p></article><article><strong>DI1 / Pump simulator</strong><p>Isolated compatible 5–24V PNP input source, tested against the hardware manual; no mains or motor-control circuit.</p></article><article><strong>ETH1 / LAN</strong><p>Customer-approved read-only access, destination ACLs and outbound-only uplink. No inbound internet port forwarding.</p></article><article><strong>DO1 / DO2</strong><p>Unwired, disabled and reserved for future review. No control or emergency-stop functionality in v1.</p></article></div>}
  </section>
  <section className="uib-code-section"><div className="uib-container"><div className="uib-head"><div><span className="uib-eyebrow">04 / SOFTWARE + CUSTOMIZATION</span><h2>One firmware base. Multiple industries.</h2></div><p>Prebuilt profiles prevent every installation from becoming a custom software project.</p></div>
   <div className="uib-custom-grid"><div className="uib-custom-card"><span>PROFILE A</span><h3>Cold storage and HVAC</h3><p>Temperature/humidity Modbus profile, threshold dwell, stale data alarm and escalation rules.</p><div className="uib-custom-tags"><i>Sensor profile</i><i>Temperature rules</i><i>Email/SMS</i></div></div><div className="uib-custom-card"><span>PROFILE B</span><h3>Pumps and generators</h3><p>Read-only run/fault status, runtime counters, communication loss detection and maintenance ticket webhooks.</p><div className="uib-custom-tags"><i>DI profile</i><i>Run-state</i><i>CMMS webhook</i></div></div><div className="uib-custom-card"><span>PROFILE C / NEXT</span><h3>OEM application connector</h3><p>Customer-defined webhook schema, tenant branding, device pairing, alert routing and field mapping.</p><div className="uib-custom-tags"><i>API mapping</i><i>White label</i><i>RBAC</i></div></div></div>
   <div className="uib-stack"><div><small>EDGE</small><strong>Python · PyModbus · SQLite WAL · systemd</strong></div><div><small>CLOUD</small><strong>HTTPS/MQTT · API · Postgres · tenant RBAC</strong></div><div><small>USER EXPERIENCE</small><strong>Next.js · rule builder · alert history · exports</strong></div><div><small>SECURITY</small><strong>Device identity · signed webhook · least privilege</strong></div></div>
  </div></section>
  <section id="packages" className="uib-section uib-container"><div className="uib-head"><div><span className="uib-eyebrow">05 / COMMERCIAL PACKAGES</span><h2>Appliance + recurring operations.</h2></div><p>These are proposed price points for customer discovery, not current purchase offers or proven gross-margin outcomes.</p></div>
   <div className="uib-pricing">{editions.map((e,i)=><article key={e.name} className={i===0?"featured":""}><span className="uib-edition">{e.name}</span><small>{e.tag}</small><strong className="uib-price">{e.price}</strong><span className="uib-saas">{e.saas}</span><ul>{e.items.map(t=><li key={t}>{t}</li>)}</ul></article>)}</div>
   <p className="uib-notice">Hardware sale price and subscription exclude engineering amortization, cloud usage, payment fees, SMS overages, installation, certification, field support, warranty and channel margin. Pilot contribution must be reconciled before commercial launch.</p>
  </section>
  <section id="delivery" className="uib-roadmap"><div className="uib-container"><div className="uib-head"><div><span className="uib-eyebrow">06 / PROTOTYPE EXECUTION</span><h2>Build gates, not calendar promises.</h2></div><p>Each phase exits with evidence before advancing to site installation or inventory commitments.</p></div><div className="uib-timeline">{gates.map(g=><article key={g[0]}><span>{g[0]}</span><div><h3>{g[1]}</h3><p>{g[2]}</p></div></article>)}</div><div className="uib-test-banner"><strong>72-HOUR BENCH SOAK / MINIMUM</strong><p>Power loss, connectivity outage, sensor disconnection, offline queue replay, duplicate delivery, stale alarms and rule-change audit are all explicit test cases.</p></div></div></section>
  <section className="uib-section uib-container"><div className="uib-head"><div><span className="uib-eyebrow">07 / ASSURANCE BOUNDARY</span><h2>HAIEC-ready. Kill switch deferred.</h2></div><p>Preserve independent evidence and capability separation from day one; do not confuse oversight with electrical or machinery safety.</p></div><div className="uib-assurance-grid"><article><span>NOW / PROTOTYPE</span><h3>Evidence export</h3><p>Signed/traceable sequence of sensor readings, rule versions, evaluations, delivery attempts, acknowledgements and device health.</p></article><article><span>NOW / DESIGN CONTRACT</span><h3>Authority inventory</h3><p>Record permitted sensor reads, disabled outputs, connectors, destinations, tenants and credential scopes.</p></article><article><span>LATER / SEPARATE PROJECT</span><h3>HAIEC enforcement gate</h3><p>A versioned, default-disabled authorization interface for any future writable capability. No remote shutdown or safety interlock bypass in this version.</p></article></div><div className="uib-final-cta"><div><small>NEXT ENGINEERING MILESTONE</small><h3>Validate one cold-room alert from sensor to customer webhook.</h3><p>Then prove the same event survives disconnect and reconnect with no silent loss.</p></div><div><a href="https://www.haiec.com/" target="_blank" rel="noopener noreferrer" className="uib-button uib-outline">Explore HAIEC ↗</a><Link href={base} className="uib-button uib-primary">Back to investment strategy ↗</Link></div></div></section>
  <footer className="uib-footer"><div className="uib-container"><div><strong>UIAB-100</strong><span>Prototype engineering blueprint · 06 Nov 2026 · v1.1</span></div><p>Not certified, not a safety system and not yet a commercial hardware product. Follow qualified electrical engineering and relevant local compliance assessments.</p><div className="uib-sources">{sourceLinks.map(s=><a key={s[0]} href={s[1]} target="_blank" rel="noopener noreferrer">{s[0]} ↗</a>)}</div></div></footer>
 </main>;
}
