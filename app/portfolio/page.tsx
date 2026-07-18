'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import BookViewer from './BookViewer';

const BOOK_CSS = `
:root{
  --navy:#0a2035;--navy2:#102f49;--blue:#2563eb;--teal:#0f766e;--cyan:#0e8fb7;
  --gold:#bb7a20;--ink:#172433;--muted:#5d6977;--paper:#fbfaf7;--mist:#eef3f7;
  --softblue:#eaf1ff;--softteal:#e9f6f3;--softgold:#fbf2df;--line:#d6dfe7;--white:#fff;
  --shadow:0 18px 50px rgba(10,32,53,.16);
}
*{box-sizing:border-box}
html{background:#dfe6ec}
body{margin:0;color:var(--ink);font-family:"Aptos","Segoe UI",Arial,sans-serif;background:#dfe6ec;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
.toolbar{position:sticky;top:0;z-index:999;display:flex;justify-content:space-between;align-items:center;padding:10px 18px;background:rgba(10,32,53,.98);color:#fff;box-shadow:0 5px 22px rgba(0,0,0,.22)}
.toolbar strong{font-size:13px}.toolbar .actions{display:flex;gap:8px}.toolbar button,.toolbar a{border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.08);color:#fff;border-radius:999px;padding:8px 13px;font-weight:750;font-size:12px;cursor:pointer}.toolbar a{background:#fff;color:var(--navy)}
.book{padding:28px 0 60px}
.page{position:relative;width:8.5in;height:11in;margin:0 auto 24px;background:var(--paper);overflow:hidden;box-shadow:var(--shadow);break-after:page;page-break-after:always}
.page:last-child{break-after:auto;page-break-after:auto}
.page:before{content:"";position:absolute;left:0;right:0;top:0;height:6px;background:linear-gradient(90deg,var(--blue) 0 42%,var(--teal) 42% 76%,var(--gold) 76%)}
.page-grid{position:absolute;inset:0;opacity:.25;background-image:linear-gradient(rgba(10,32,53,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(10,32,53,.035) 1px,transparent 1px);background-size:26px 26px;pointer-events:none}
.page-inner{position:relative;z-index:2;height:100%;padding:.45in .48in .38in;display:flex;flex-direction:column}
.running{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line);padding-bottom:9px;margin-bottom:17px;color:var(--muted);font-size:8.2px;letter-spacing:.11em;text-transform:uppercase;font-weight:850}
.running b{color:var(--navy)}
.pg{position:absolute;right:.48in;bottom:.22in;font-size:8px;color:#8793a0;font-weight:800}
.kicker{font-size:9px;letter-spacing:.16em;text-transform:uppercase;font-weight:900;color:var(--blue);margin:0 0 8px}
h1,h2,h3,h4{font-family:Georgia,"Times New Roman",serif;color:var(--navy);margin:0}
h1{font-size:43px;line-height:.97;letter-spacing:-.047em}
h2{font-size:31px;line-height:1.01;letter-spacing:-.038em}
h3{font-size:18px;line-height:1.1;letter-spacing:-.02em}
h4{font-size:13px;line-height:1.15}
p{margin:0;color:var(--ink);font-size:10.5px;line-height:1.48}
.lead{font-size:15px;line-height:1.35;color:var(--navy2);font-weight:700}
.small{font-size:8.7px;line-height:1.4;color:var(--muted)}
.muted{color:var(--muted)}
.rule{height:1px;background:var(--line);margin:14px 0}
.columns-2{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.columns-3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.card{border:1px solid #ced9e3;background:#fff;border-radius:12px;padding:14px;box-shadow:0 4px 12px rgba(10,32,53,.045)}
.card h3{margin-bottom:6px}.card p{font-size:9.3px}.card ul{margin:8px 0 0;padding-left:16px}.card li{font-size:8.7px;line-height:1.4;margin:3px 0;color:var(--muted)}
.tag{display:inline-block;border-radius:999px;border:1px solid var(--line);background:#fff;padding:5px 8px;color:var(--navy2);font-size:7.5px;font-weight:850;letter-spacing:.03em}
.tag.blue{background:var(--softblue);border-color:#c7d8ff;color:#1949b5}.tag.teal{background:var(--softteal);border-color:#c6e6df;color:#0b675f}.tag.gold{background:var(--softgold);border-color:#ead4a8;color:#8b5713}
.quote{border-left:4px solid var(--blue);padding:12px 0 12px 16px;font-family:Georgia,"Times New Roman",serif;font-size:20px;line-height:1.25;color:var(--navy)}
.source{margin-top:auto;padding-top:8px;border-top:1px solid var(--line);font-size:7.4px;line-height:1.32;color:#6f7d8b}
.diagram{border:1px solid #c9d6e2;background:linear-gradient(145deg,#fff,#f5f8fb);border-radius:14px;padding:16px;box-shadow:0 5px 14px rgba(10,32,53,.035)}
.flow{display:flex;align-items:stretch;gap:6px}.flow .step{flex:1;position:relative;border:1px solid var(--line);border-radius:12px;background:#fff;padding:10px 8px;text-align:center}.flow .step:not(:last-child):after{content:"\\203A";position:absolute;right:-8px;top:50%;transform:translateY(-50%);font-size:18px;color:#97a4b0;font-weight:900;z-index:3}.flow .num{width:24px;height:24px;border-radius:8px;margin:0 auto 5px;background:var(--navy);color:#fff;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:900}.flow b{display:block;color:var(--navy);font-size:8.6px}.flow span{display:block;color:var(--muted);font-size:6.8px;line-height:1.2;margin-top:3px}
.metrics{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.metric{border:1px solid var(--line);border-radius:16px;background:#fff;padding:16px 14px;min-height:115px}.metric .value{font-family:Georgia,"Times New Roman",serif;font-size:34px;line-height:1;color:var(--navy);font-weight:700}.metric .label{margin-top:7px;font-size:9px;color:var(--blue);font-weight:900;text-transform:uppercase;letter-spacing:.08em}.metric p{margin-top:5px;font-size:8.5px;color:var(--muted);line-height:1.35}
.timeline{position:relative;padding-left:32px}.timeline:before{content:"";position:absolute;left:10px;top:4px;bottom:4px;width:2px;background:linear-gradient(var(--blue),var(--teal),var(--gold))}.time-item{position:relative;margin:0 0 16px}.time-item:before{content:"";position:absolute;left:-28px;top:3px;width:12px;height:12px;border:3px solid var(--paper);border-radius:50%;background:var(--blue);box-shadow:0 0 0 1px var(--line)}.time-item:nth-child(3n+2):before{background:var(--teal)}.time-item:nth-child(3n):before{background:var(--gold)}.time-item b{display:block;color:var(--navy);font-size:10px}.time-item span{display:block;margin-top:2px;color:var(--muted);font-size:8.4px;line-height:1.35}
.caseband{display:grid;grid-template-columns:.78fr 1.22fr;gap:20px;align-items:stretch}.case-label{border-radius:18px;padding:18px;background:linear-gradient(160deg,var(--navy),#0f4363);color:#fff;display:flex;flex-direction:column;justify-content:space-between}.case-label h2,.case-label h3{color:#fff}.case-label p{color:rgba(255,255,255,.82);font-size:9.4px}.case-label .big{font-family:Georgia,"Times New Roman",serif;font-size:54px;line-height:.9}.case-content{display:flex;flex-direction:column;gap:12px}.case-content .card{padding:13px}
.mock{border:1px solid #cdd8e2;border-radius:18px;background:#fff;overflow:hidden;box-shadow:0 12px 28px rgba(10,32,53,.08)}.mock-top{height:28px;background:#e9eef3;border-bottom:1px solid #d8e0e7;display:flex;align-items:center;gap:5px;padding:0 10px}.dot{width:7px;height:7px;border-radius:50%;background:#b7c0c9}.mock-body{padding:14px}.mock-row{display:grid;grid-template-columns:26px 1fr auto;gap:9px;align-items:center;padding:8px 0;border-bottom:1px solid #edf1f4}.mock-row:last-child{border-bottom:0}.mock-icon{width:26px;height:26px;border-radius:8px;background:var(--softblue);display:flex;align-items:center;justify-content:center;font-weight:900;color:var(--blue);font-size:8px}.mock-row b{font-size:8.5px;color:var(--navy)}.mock-row span{font-size:7px;color:var(--muted)}.pill{border-radius:999px;padding:4px 7px;background:var(--softteal);color:var(--teal);font-size:6px;font-weight:900}
.status{font-size:6.8px;font-weight:900;letter-spacing:.09em;text-transform:uppercase;color:var(--teal)}
.four{display:grid;grid-template-columns:1fr 1fr;gap:12px}.mini{border-radius:14px;border:1px solid var(--line);padding:13px;background:#fff}.mini .icon{width:30px;height:30px;border-radius:10px;background:var(--softblue);color:var(--blue);display:flex;align-items:center;justify-content:center;font-weight:900;margin-bottom:8px}.mini h3{font-size:14px;margin-bottom:4px}.mini p{font-size:8.3px;color:var(--muted)}
.article-list{display:grid;grid-template-columns:1fr 1fr;gap:12px}.article{border:1px solid var(--line);background:#fff;border-radius:14px;padding:14px}.article .type{font-size:6.8px;color:var(--blue);text-transform:uppercase;letter-spacing:.12em;font-weight:900}.article h3{font-size:15px;margin:5px 0}.article p{font-size:8.4px;color:var(--muted)}
.contact-grid{display:grid;grid-template-columns:1.35fr .65fr;gap:20px;align-items:center}.qrbox{border:1px solid var(--line);background:#fff;border-radius:18px;padding:14px;text-align:center}.qrbox img{width:150px;height:150px}.qrbox p{font-size:7.5px;color:var(--muted);margin-top:8px}
/* Cover */
.cover{background:linear-gradient(145deg,#071b2d 0%,#0b2f4a 55%,#0f5b68 100%);color:#fff}.cover:before{height:8px}.cover .page-grid{opacity:.2;background-image:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)}
.cover-inner{height:100%;position:relative;z-index:2;overflow:hidden}.cover-copy{position:absolute;left:0;top:0;bottom:0;width:52%;padding:.62in .18in .55in .55in;display:flex;flex-direction:column;z-index:3}.cover-copy .edition{font-size:8px;letter-spacing:.18em;text-transform:uppercase;font-weight:900;color:#9fd7df}.cover h1{font-size:70px;color:#fff;line-height:.86;margin-top:auto}.cover h1 span{display:block;color:#9fddda}.cover .sub{margin-top:18px;font-size:15.5px;line-height:1.38;color:#e9f4f6;font-weight:700;max-width:3.65in}.cover .name{margin-top:auto;font-family:Georgia,"Times New Roman",serif;font-size:25px;color:#fff}.cover .role{margin-top:5px;color:#b7dce1;font-size:8.6px;font-weight:700;line-height:1.4;max-width:3.65in}.cover-photo{position:absolute;right:0;top:0;bottom:0;width:48%;overflow:hidden}.cover-photo:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#0b2f4a 0%,rgba(11,47,74,.2) 36%,rgba(11,47,74,0) 70%),linear-gradient(0deg,rgba(7,27,45,.85),transparent 36%)}.cover-photo img{width:100%;height:100%;object-fit:cover;object-position:48% 20%;filter:saturate(.88) contrast(1.02)}.cover-tags{display:flex;flex-wrap:wrap;gap:7px;margin-top:15px;max-width:3.7in}.cover-tags span{border:1px solid rgba(255,255,255,.25);border-radius:999px;padding:6px 9px;color:#eaf7f8;font-size:7.2px;font-weight:800;background:rgba(255,255,255,.06)}
/* Back cover */
.back{background:linear-gradient(145deg,#071b2d,#0e3c57);color:#fff}.back:before{height:8px}.back .page-inner{justify-content:center;padding:.72in}.back h1{color:#fff;font-size:55px;max-width:6.6in}.back .closing{margin-top:26px;font-size:18px;line-height:1.5;color:#c8e4e7}.back .footerline{margin-top:auto;display:flex;justify-content:space-between;align-items:end;border-top:1px solid rgba(255,255,255,.22);padding-top:16px}.back .footerline p{color:#d9ebee;font-size:9px}.back .footerline img{width:92px;height:92px;border-radius:8px;background:#fff;padding:6px}
@media print{
  html,body{background:#fff}.toolbar{display:none!important}.book{padding:0}.page{margin:0;box-shadow:none}
  @page{size:Letter;margin:0}
}
@media screen and (max-width:900px){.page{transform-origin:top center}.book{padding-left:8px;padding-right:8px}.toolbar{position:relative}.page{width:min(8.5in,100%);height:auto;min-height:11in}.page-inner{padding:32px}.cover-copy{position:relative;width:100%;min-height:6.2in}.cover-photo{position:relative;width:100%;min-height:450px}.columns-2,.columns-3,.caseband,.contact-grid{grid-template-columns:1fr}.flow{flex-wrap:wrap}.flow .step{min-width:30%}}
`;

const BOOK_HTML = `
<!-- 1 -->
<section class="page cover" id="cover"><div class="page-grid"></div><div class="cover-inner">
  <div class="cover-copy"><div class="edition">Executive portfolio / 2026 edition</div>
    <h1>AI THAT <span>WORKS</span></h1>
    <div class="sub">Strategy. Programs. Platforms. Governance.<br/>Turning AI ambition into operating systems, measurable value, and evidence that survives scrutiny.</div>
    <div class="cover-tags"><span>AI Strategy</span><span>Program &amp; Portfolio Leadership</span><span>Production AI</span><span>Governance &amp; Reliability</span><span>Dallas–Fort Worth</span></div>
    <div class="name">Subodh KC</div><div class="role">AI Strategy &amp; Transformation Leader<br/>Enterprise Portfolio Operator · AI Systems Architect · Product &amp; Governance Builder</div>
  </div>
  <div class="cover-photo"><img src="/portrait.jpeg" alt="Subodh KC portrait"/></div>
</div></section>

<!-- 2 -->
<section class="page" id="thesis"><div class="page-grid"></div><div class="page-inner">
  <div class="running"><b>AI THAT WORKS</b><span>Operating belief</span></div>
  <p class="kicker">The operating thesis</p><h1>AI strategy matters only when the organization can run it.</h1>
  <div class="rule"></div>
  <div class="columns-2" style="align-items:start;gap:28px">
    <div><div class="quote">The hardest part of AI is not calling a model. It is deciding what the system should know, what it may do, when a person must intervene, how success is measured, and what evidence remains afterward.</div></div>
    <div><p class="lead">My work sits at the intersection of strategy, program execution, systems architecture, product development, and governance.</p><p style="margin-top:14px">I have led complex enterprise application portfolios, delivered AI and technology initiatives, built customer-facing and governance platforms, developed open-source controls, and created original frameworks for drift, assurance, and auditability.</p><p style="margin-top:12px">The discipline stays the same at any scale: choose the right opportunity, build an executable program around it, ship a system that survives real operations, and keep enough evidence to defend or improve the decision later.</p></div>
  </div>
  <div class="diagram" style="margin-top:24px">
    <div class="flow"><div class="step"><div class="num">1</div><b>Opportunity</b><span>business result</span></div><div class="step"><div class="num">2</div><b>Strategy</b><span>priority and case</span></div><div class="step"><div class="num">3</div><b>Program</b><span>owners and sequence</span></div><div class="step"><div class="num">4</div><b>Platform</b><span>working system</span></div><div class="step"><div class="num">5</div><b>Governance</b><span>limits and control</span></div><div class="step"><div class="num">6</div><b>Evidence</b><span>measure and adapt</span></div></div>
  </div>
  <div class="columns-3" style="margin-top:18px">
    <div class="mini"><div class="icon">1</div><h3 style="font-size:12.5px">One capability per page</h3><p>Strategy, program leadership, product systems, or operational governance - never blended into a vague claim.</p></div>
    <div class="mini"><div class="icon" style="background:var(--softteal);color:var(--teal)">2</div><h3 style="font-size:12.5px">Evidence over adjectives</h3><p>Every claim traces to a resume line, a live product, a published framework, or a named engagement.</p></div>
    <div class="mini"><div class="icon" style="background:var(--softgold);color:var(--gold)">3</div><h3 style="font-size:12.5px">Status labeled honestly</h3><p>Live, private beta, open source, and research-stage work are marked as such throughout, not blurred together.</p></div>
  </div>
  <div class="columns-2" style="margin-top:14px;grid-template-columns:repeat(4,1fr)">
    <div><span class="tag blue">Strategy</span><p class="small" style="margin-top:6px">Pages 7-9</p></div>
    <div><span class="tag teal">Programs</span><p class="small" style="margin-top:6px">Pages 8-10</p></div>
    <div><span class="tag gold">Platforms</span><p class="small" style="margin-top:6px">Pages 11-18</p></div>
    <div><span class="tag">Governance</span><p class="small" style="margin-top:6px">Pages 14-15, 21</p></div>
  </div>
  <div class="source">Evidence standard: professional scope is grounded in resume and program records; products are maturity-labeled; research is identified by publication type; legal and standards mappings are not presented as certification.</div><div class="pg">02</div>
</div></section>

<!-- 3 -->
<section class="page" id="principles"><div class="page-grid"></div><div class="page-inner">
  <div class="running"><b>AI THAT WORKS</b><span>Operating principles</span></div>
  <p class="kicker">The decision rules behind the work</p><h1>Five rules for building AI that earns its place.</h1>
  <p class="lead" style="margin-top:12px">Strategy, product, and governance aren't three different jobs. They're the same instinct - build things that survive contact with reality - applied at three altitudes. These are the rules that instinct runs on.</p>
  <div class="four" style="margin-top:20px">
    <div class="mini"><div class="icon">1</div><h3>Configure before you customize. Connect before you rebuild.</h3><p>Most "AI transformation" is buying novelty instead of buying leverage. Before I write a line of code or scope a platform, I check whether an existing tool already does 80% of the job.</p></div>
    <div class="mini"><div class="icon" style="background:var(--softteal);color:var(--teal)">2</div><h3>If a human can't stop it, it isn't ready.</h3><p>Systems with operational authority need an explicit human owner, escalation path, and safe-stop mechanism. Autonomy without an off-ramp is unmanaged exposure.</p></div>
    <div class="mini"><div class="icon" style="background:var(--softgold);color:var(--gold)">3</div><h3>Evidence beats confidence.</h3><p>"It works" is an opinion. A versioned test log, a dated metric, and a named owner are a fact. I build the second kind, even when it's slower.</p></div>
    <div class="mini"><div class="icon">4</div><h3>Small systems that remove expensive friction beat big systems that remove none.</h3><p>A log analyzer that saves four hours a week is worth more than a platform nobody adopts. I'd rather ship the narrow thing that gets used.</p></div>
  </div>
  <div class="card" style="margin-top:12px;background:linear-gradient(145deg,var(--softgold),#fff)"><h3>5. Label the status honestly, or don't ship it.</h3><p>Live, private beta, open source, and research-stage are different claims with different weight. Blurring them to sound bigger is how trust gets spent before it's earned - which is why every product and framework in this book carries a status tag.</p></div>
  <div class="quote" style="margin-top:20px">Strategy, product, and governance aren't three different jobs I do. They're the same instinct - build things that survive contact with reality - applied at three different altitudes.</div>
  <div class="card" style="margin-top:14px;background:linear-gradient(145deg,var(--softblue),#fff)"><h3>These rules, in practice</h3><p>Rule 1 built Kestrel's streaming pipeline instead of buying a platform (page 11). Rule 2 is HAIEC's entire premise (page 14). Rule 5 is why every product in this book carries a status tag - check them all in The Field Guide, page 23.</p></div>
  <div class="source">Principles synthesized from career pattern, product decisions, and published writing - not a formal manifesto, but the consistent thread across them.</div><div class="pg">03</div>
</div></section>

<!-- 4 -->
<section class="page" id="profile"><div class="page-grid"></div><div class="page-inner">
  <div class="running"><b>SUBODH KC</b><span>Executive profile</span></div>
  <div class="caseband">
    <div class="case-label"><div><p class="kicker" style="color:#9edbe1">Executive position</p><h2>Portfolio leader.<br/>Systems architect.<br/>Operator.</h2></div><p>I turn AI strategy into selected investments, accountable programs, deployed systems, and defensible evidence.</p></div>
    <div class="case-content">
      <p class="lead">AI Strategy &amp; Transformation Leader with a ground-up career spanning field operations, manufacturing technology, reliability engineering, enterprise portfolio leadership, cross-border AI strategy, product development, and governance.</p>
      <div class="columns-2">
        <div class="card"><h3>Strategy &amp; investment</h3><p>Opportunity selection, business cases, build-buy-partner decisions, roadmaps, portfolio balance, cost discipline, and executive decision support.</p></div>
        <div class="card"><h3>Programs &amp; execution</h3><p>Senior Technical Program Manager and Core Team Lead directing portfolio execution through multiple program managers, with responsibility for dependencies, release readiness, risk escalation, and decision cadence.</p></div>
        <div class="card"><h3>Platforms &amp; products</h3><p>Voice AI, RAG, workflow automation, developer controls, multi-tenant applications, dashboards, and connected operational systems.</p></div>
        <div class="card"><h3>Governance &amp; reliability</h3><p>Authority limits, human review, drift and failure analysis, security testing, legal applicability, evidence, and continuous monitoring.</p></div>
      </div>
    </div>
  </div>
  <div class="diagram" style="margin-top:16px;padding:14px 18px">
    <svg viewBox="0 0 700 108" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block">
      <text x="0" y="14" font-family="Georgia,serif" font-size="10" fill="#172433" font-weight="700">Strategy</text>
      <rect x="0" y="20" width="700" height="9" rx="4.5" fill="#eef3f7"/><rect x="0" y="20" width="616" height="9" rx="4.5" fill="#2563eb"/>
      <text x="0" y="42" font-family="Georgia,serif" font-size="10" fill="#172433" font-weight="700">Program leadership</text>
      <rect x="0" y="48" width="700" height="9" rx="4.5" fill="#eef3f7"/><rect x="0" y="48" width="658" height="9" rx="4.5" fill="#0f766e"/>
      <text x="0" y="70" font-family="Georgia,serif" font-size="10" fill="#172433" font-weight="700">Platforms &amp; products</text>
      <rect x="0" y="76" width="700" height="9" rx="4.5" fill="#eef3f7"/><rect x="0" y="76" width="588" height="9" rx="4.5" fill="#bb7a20"/>
      <text x="0" y="98" font-family="Georgia,serif" font-size="10" fill="#172433" font-weight="700">Governance &amp; reliability</text>
      <rect x="0" y="104" width="700" height="9" rx="4.5" fill="#eef3f7"/><rect x="0" y="104" width="644" height="9" rx="4.5" fill="#0e8fb7"/>
    </svg>
  </div>
  <div class="rule"></div>
  <div class="columns-3">
    <div><span class="tag blue">Education</span><p style="margin-top:8px"><b>M.S. Engineering &amp; Technology Management</b><br/>B.S. technology / information systems discipline<br/>Louisiana Tech University</p></div>
    <div><span class="tag teal">Professional discipline</span><p style="margin-top:8px"><b>Six Sigma Green Belt</b><br/>AI ethics and governance study<br/>Failure analysis and systems thinking</p></div>
    <div><span class="tag gold">Leadership arc</span><p style="margin-top:8px"><b>53-application enterprise portfolio</b><br/>Commercial Software AI Strategy Initiative<br/>Kestrel Voice · HAIEC · llmverify</p></div>
  </div>
  <div class="card" style="margin-top:12px;background:linear-gradient(145deg,var(--softblue),#fff)"><h3>See these pillars at work</h3><p><b>Platforms:</b> Kestrel's origin story, page 11 · <b>Governance:</b> HAIEC's evidence layer, page 14 · <b>Everything, indexed:</b> The Field Guide, page 23.</p></div>
  <div class="source">Profile synthesized from uploaded resumes, SubodhKC.com, GitHub, KestrelVoice.com, HAIEC.com, and prior project records. Bar lengths are illustrative emphasis, not a measured survey.</div><div class="pg">04</div>
</div></section>

<!-- 5 -->
<section class="page" id="scale"><div class="page-grid"></div><div class="page-inner">
  <div class="running"><b>SUBODH KC</b><span>Scale of responsibility</span></div>
  <p class="kicker">Scale, with the role boundaries intact</p><h2>Portfolio leadership measured across systems, teams, deployment, and invention.</h2>
  <p class="lead" style="margin-top:12px">These figures represent different dimensions of responsibility: portfolio scale, delivery scope, stakeholder orchestration, user consequence, operational deployment, and invention.</p>
  <div class="metrics" style="margin-top:20px">
    <div class="metric"><div class="value">53</div><div class="label">Enterprise applications</div><p>Managed as Senior Technical Program Manager and Core Team Lead, directing portfolio execution through multiple program managers.</p></div>
    <div class="metric"><div class="value">50+</div><div class="label">AI &amp; technology initiatives</div><p>Resume-recorded portfolio of enterprise, automation, reliability, and founder-led initiatives; exact role varied by program.</p></div>
    <div class="metric"><div class="value">$50M+</div><div class="label">Organizational portfolio scope</div><p>Aggregate program environment and executive visibility - not a claim of personal budget authority.</p></div>
    <div class="metric"><div class="value">100+</div><div class="label">Cross-functional network</div><p>Product, engineering, quality, operations, vendors, program managers, and leadership aligned across the portfolio.</p></div>
    <div class="metric"><div class="value">Global</div><div class="label">Commercial software reach</div><p>Applications serving a global device and customer ecosystem, with reliability and disciplined change as operating requirements.</p></div>
    <div class="metric"><div class="value">5</div><div class="label">AI invention filings</div><p>User-recorded provisional and non-provisional filings spanning drift, compliance twins, audit automation, and traceability.</p></div>
    <div class="metric"><div class="value">400+</div><div class="label">MES automation stations</div><p>Operational deployment in manufacturing environments - where adoption and failure handling are visible immediately.</p></div>
    <div class="metric"><div class="value">14</div><div class="label">Tools &amp; frameworks documented</div><p>Every one status-labeled and indexed in The Field Guide, page 23 - live, open source, or research-stage, named honestly.</p></div>
  </div>
  <div class="source">Evidence basis: professional resume, program records, and user-confirmed scope. Public editions preserve role boundaries: led and managed the portfolio; organizational scope is not personal budget ownership; global reach describes the application environment.</div><div class="pg">05</div>
</div></section>

<!-- 6 -->
<section class="page" id="career"><div class="page-grid"></div><div class="page-inner">
  <div class="running"><b>SUBODH KC</b><span>Career journey</span></div>
  <p class="kicker">Systems leadership learned from the ground up</p><h2>A career built where strategy meets operational consequence.</h2>
  <div class="columns-2" style="margin-top:22px;grid-template-columns:.9fr 1.1fr">
    <div><div class="quote">I design transformation programs from both directions: the value they should create and the failure modes that could prevent that value from reaching production.</div><p style="margin-top:16px">This failure-aware perspective is not theoretical. It was formed in classrooms and field environments, manufacturing systems, production support, enterprise release programs, and customer-facing AI operations.</p></div>
    <div class="timeline">
      <div class="time-item"><b>Field technology and public-sector operations</b><span>Worked directly with underfunded and operationally constrained environments where reliability mattered more than elegance.</span></div>
      <div class="time-item"><b>Manufacturing systems and MES</b><span>Supported modernization and automation across 400+ stations, connecting data, processes, equipment, and users.</span></div>
      <div class="time-item"><b>Reliability and production engineering</b><span>Built telemetry, incident workflows, anomaly analysis, and root-cause discipline for high-volume systems.</span></div>
      <div class="time-item"><b>Enterprise technical program leadership</b><span>Served as Senior Technical Program Manager and Core Team Lead for 53 applications, managing portfolio execution through multiple program managers and cross-functional teams.</span></div>
      <div class="time-item"><b>Commercial Software AI strategy leadership</b><span>Led a cross-border AI Strategy Initiative from team formation and opportunity selection through project prioritization, execution governance, and deployment.</span></div>
      <div class="time-item"><b>AI platforms and governance</b><span>Built Kestrel Voice, HAIEC, llmverify, and frameworks for AI assurance, drift, and evidence.</span></div>
      <div class="time-item"><b>Strategic advisory</b><span>Help businesses identify the valuable workflow before choosing the product, vendor, or architecture.</span></div>
    </div>
  </div>
  <div class="quote" style="margin-top:16px">Every stage on this timeline taught the same lesson from a different angle: value that can't survive contact with reality isn't value yet. See how that lesson turned into working rules on page 3.</div>
  <div class="source">Selected career arc grounded in resume and user-confirmed professional scope. Confidential product names, internal artifacts, financial details, and personnel information are intentionally omitted.</div><div class="pg">06</div>
</div></section>

<!-- 7 -->
<section class="page" id="strategy"><div class="page-grid"></div><div class="page-inner">
  <div class="running"><b>AI STRATEGY</b><span>Signature method</span></div>
  <p class="kicker">From ambition to an investable portfolio</p><h2>Select the right AI move before scaling the wrong one.</h2>
  <p class="lead" style="margin-top:12px">AI strategy is a portfolio discipline. It requires deciding which opportunities deserve attention, which should wait, and which should never become projects.</p>
  <div class="diagram" style="margin-top:22px">
    <div class="flow"><div class="step"><div class="num">1</div><b>Understand</b><span>business outcome and constraint</span></div><div class="step"><div class="num">2</div><b>Prioritize</b><span>value, urgency, readiness</span></div><div class="step"><div class="num">3</div><b>Sequence</b><span>dependencies and learning order</span></div><div class="step"><div class="num">4</div><b>Fund / Build</b><span>configure, connect, buy, or build</span></div><div class="step"><div class="num">5</div><b>Measure</b><span>baseline, target, adoption</span></div><div class="step"><div class="num">6</div><b>Adapt</b><span>stop, improve, or scale</span></div></div>
  </div>
  <div class="columns-2" style="margin-top:18px">
    <div class="card"><h3>Value screen</h3><ul><li>Revenue, capacity, speed, margin, or risk protected</li><li>Frequency and severity of the current friction</li><li>Time to value and opportunity cost</li><li>Expected adoption and owner accountability</li></ul></div>
    <div class="card"><h3>Feasibility screen</h3><ul><li>Data quality, access, and permissions</li><li>Process clarity and exception volume</li><li>System integration and vendor constraints</li><li>Human fallback and acceptable failure</li></ul></div>
    <div class="card"><h3>Investment discipline</h3><ul><li>Configure before customizing</li><li>Connect before rebuilding</li><li>Prove with the smallest useful pilot</li><li>Keep operating cost visible from day one</li></ul></div>
    <div class="card"><h3>Decision discipline</h3><ul><li>Define explicit success and stop criteria</li><li>Separate excitement from strategic fit</li><li>Measure adoption, not only technical output</li><li>Scale from evidence, not optimism</li></ul></div>
  </div>
  <div class="card" style="margin-top:14px;background:linear-gradient(145deg,var(--softgold),#fff)"><h3>Where this method runs live</h3><p>Applied at enterprise scale across a 53-application portfolio (page 9), and compressed into a single-business engagement in the Advisory Method (page 22).</p></div>
  <div class="source">Portfolio management perspective: strategy becomes executable through prioritization, sequencing, resource alignment, governance, and performance measures.</div><div class="pg">07</div>
</div></section>

<!-- 8 -->
<section class="page" id="programs"><div class="page-grid"></div><div class="page-inner">
  <div class="running"><b>PROGRAM LEADERSHIP</b><span>Strategy execution</span></div>
  <p class="kicker">Programs are the execution architecture</p><h2>Strategy becomes real when decisions have owners, sequence, and consequence.</h2>
  <div class="columns-2" style="margin-top:18px;grid-template-columns:1.1fr .9fr">
    <div class="diagram"><h3>Portfolio funnel</h3><div style="margin-top:14px;display:flex;flex-direction:column;gap:9px">
      <div style="padding:11px;border-radius:12px;background:var(--softblue);border:1px solid #ccdaff"><b>Ideas and demand</b><p class="small">Use cases, pain points, obligations, vendor proposals, and executive priorities.</p></div>
      <div style="padding:11px;border-radius:12px;background:var(--softteal);border:1px solid #cde8e2;margin:0 8%"><b>Evaluation and trade-offs</b><p class="small">Strategic fit, value, feasibility, risk, dependencies, and capacity.</p></div>
      <div style="padding:11px;border-radius:12px;background:var(--softgold);border:1px solid #ead6ad;margin:0 18%"><b>Selected roadmap</b><p class="small">Sequenced initiatives with owners, baselines, milestones, and stop criteria.</p></div>
    </div></div>
    <div class="case-content">
      <div class="card"><h3>Program charter</h3><p>Purpose, outcomes, non-goals, stakeholders, decision rights, measures, and constraints.</p></div>
      <div class="card"><h3>Dependency architecture</h3><p>Technical, organizational, vendor, release, data, and policy dependencies made visible early.</p></div>
      <div class="card"><h3>Executive cadence</h3><p>Decisions separated from status updates; risks escalated with options, owners, and dates.</p></div>
      <div class="card"><h3>Change and adoption</h3><p>Role changes, training, operating procedures, human fallback, usage, and ownership after launch.</p></div>
    </div>
  </div>
  <div class="quote" style="margin-top:22px">Project management is not the calendar around the strategy. It is the operating discipline that turns strategic intent into coordinated action.</div>
  <div class="card" style="margin-top:14px;background:linear-gradient(145deg,var(--softblue),#fff)"><h3>What this discipline produces</h3><p>An operating cadence built from these four habits, in detail, on page 10 - and proof it runs at scale in the 53-application portfolio on page 9.</p></div>
  <div class="source">This portfolio uses "strategic program and portfolio leadership" rather than reducing the work to task or schedule management.</div><div class="pg">08</div>
</div></section>

<!-- 9 -->
<section class="page" id="enterprise-case"><div class="page-grid"></div><div class="page-inner">
  <div class="running"><b>ENTERPRISE CASE</b><span>53-application portfolio</span></div>
  <div class="caseband">
    <div class="case-label"><div><p class="kicker" style="color:#9edbe1">Scale</p><div class="big">53</div><h3>enterprise applications</h3></div><p>Cross-functional execution across applications used within a global, millions-user environment.</p></div>
    <div class="case-content">
      <h2>Leading a 53-application portfolio through a team of program managers</h2>
      <p class="lead">The challenge was not one product or one release. As Core Team Lead and Senior Technical Program Manager, I managed the 53-application portfolio through several program managers - creating the visibility, escalation paths, dependency discipline, and decision rhythm needed for many applications to move together.</p>
      <div class="columns-2">
        <div class="card"><h3>The environment</h3><ul><li>Distributed product and engineering teams</li><li>Shared services and release dependencies</li><li>Quality, validation, and customer-impact decisions</li><li>Executive and cross-functional stakeholders</li></ul></div>
        <div class="card"><h3>The leadership work</h3><ul><li>Set portfolio roadmap and operating cadence</li><li>Directed execution through multiple program managers</li><li>Owned risk, issue, and dependency escalation</li><li>Drove release-readiness and decision quality</li><li>Established cross-team accountability and evidence</li></ul></div>
      </div>
    </div>
  </div>
  <div class="diagram" style="margin-top:18px">
    <h3>Sanitized portfolio view</h3>
    <div style="margin-top:12px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px">
      <div class="mini"><div class="icon">A</div><h3>Applications</h3><p>Product lines, owners, release state, and customer footprint.</p></div>
      <div class="mini"><div class="icon" style="background:var(--softteal);color:var(--teal)">D</div><h3>Dependencies</h3><p>Shared components, validation gates, upstream and downstream risk.</p></div>
      <div class="mini"><div class="icon" style="background:var(--softgold);color:var(--gold)">R</div><h3>Risk</h3><p>Likelihood, impact, mitigation, owner, date, and decision required.</p></div>
      <div class="mini"><div class="icon">E</div><h3>Evidence</h3><p>Status, test results, decisions, release notes, and follow-through.</p></div>
    </div>
  </div>
  <div class="quote" style="margin-top:14px">Fifty-three applications don't fail together. They fail one dependency at a time - which is exactly why the decision rhythm on the next page exists.</div>
  <div class="source">Leadership case grounded in resume and user-confirmed role scope. Confidential product names, internal systems, personnel data, and proprietary artifacts are excluded.</div><div class="pg">09</div>
</div></section>

<!-- 10 -->
<section class="page" id="execution"><div class="page-grid"></div><div class="page-inner">
  <div class="running"><b>PROGRAM LEADERSHIP</b><span>Execution system</span></div>
  <p class="kicker">Turning complexity into a decision rhythm</p><h2>Convert fragmented signals into accountable release decisions.</h2>
  <div class="diagram" style="margin-top:20px">
    <div class="flow"><div class="step"><div class="num">S</div><b>Signal</b><span>issue, change, or opportunity</span></div><div class="step"><div class="num">D</div><b>Dependency</b><span>what else moves or breaks</span></div><div class="step"><div class="num">O</div><b>Owner</b><span>accountable decision maker</span></div><div class="step"><div class="num">X</div><b>Decision</b><span>options, trade-offs, date</span></div><div class="step"><div class="num">E</div><b>Evidence</b><span>tests, facts, and rationale</span></div><div class="step"><div class="num">R</div><b>Release</b><span>go, hold, mitigate, learn</span></div></div>
  </div>
  <div class="columns-2" style="margin-top:18px">
    <div class="card"><h3>RAID that drives action</h3><p>Risks, assumptions, issues, and dependencies are useful only when tied to impact, owner, decision date, and consequence of delay.</p></div>
    <div class="card"><h3>Executive communication</h3><p>Replace activity reporting with decision-ready briefs: what changed, why it matters, options, recommendation, and next irreversible date.</p></div>
    <div class="card"><h3>Release readiness</h3><p>Combine engineering status, quality evidence, operational support, rollback, customer impact, and unresolved risk into one decision frame.</p></div>
    <div class="card"><h3>Root-cause discipline</h3><p>Trace failures through symptoms, dependencies, state, environment, data, process, and control gaps rather than settling for the first plausible cause.</p></div>
  </div>
  <div class="quote" style="margin-top:20px">The goal is not more meetings. It is fewer unresolved decisions and less hidden work between teams.</div>
  <div class="card" style="margin-top:14px;background:linear-gradient(145deg,var(--softteal),#fff)"><h3>Where this ran</h3><p>This is the operating rhythm behind the 53-application enterprise case on page 9 - the same signal-to-release loop, just described as a system instead of a story.</p></div>
  <div class="source">Core strength: transforming fragmented signals and competing priorities into an accountable operating cadence.</div><div class="pg">10</div>
</div></section>

<!-- 11 -->
<section class="page" id="kestrel-origin"><div class="page-grid"></div><div class="page-inner">
  <div class="running"><b>KESTREL VOICE</b><span>Origin story</span></div>
  <p class="kicker">Why Kestrel Voice exists</p><h2>Voice AI becomes real when the call survives the edge cases.</h2>
  <p class="lead" style="margin-top:12px">Every AI voice platform on the market looked ready. Workflow tools had Twilio integrations out of the box. Specialized voice AI platforms had raised funding and shipped SDKs. The assumption was that the infrastructure layer was solved and the logic could be built on top of it. That assumption held for about three weeks of production testing.</p>
  <div class="diagram" style="margin-top:18px">
    <h3>What broke, layer by layer</h3>
    <div style="margin-top:12px;display:flex;flex-direction:column;gap:8px">
      <div style="padding:10px 14px;border-radius:12px;background:var(--softblue);border:1px solid #ccdaff;display:flex;justify-content:space-between;align-items:center"><div><b>Workflow automation (n8n, Make, Zapier)</b><p class="small">Sequential HTTP calls between nodes - fine for background jobs, fatal for live conversation.</p></div><span class="tag blue">800-1,400ms per turn</span></div>
      <div style="padding:10px 14px;border-radius:12px;background:var(--softteal);border:1px solid #cde8e2;margin-left:6%;display:flex;justify-content:space-between;align-items:center"><div><b>Specialized voice platforms (VAPI, Bland, Retell)</b><p class="small">Better latency, but a customization ceiling on end-of-turn logic, escalation, and auditable state - and per-minute fees that break unit economics at scale.</p></div><span class="tag teal">400-600ms, hits a wall</span></div>
      <div style="padding:10px 14px;border-radius:12px;background:var(--softgold);border:1px solid #ead6ad;margin-left:12%;display:flex;justify-content:space-between;align-items:center"><div><b>Custom Python / FastAPI streaming pipeline</b><p class="small">Own the whole path: telephony, transcription, generation, and speech, streamed instead of request-response.</p></div><span class="tag gold">~200ms perceived</span></div>
    </div>
  </div>
  <div class="quote" style="margin-top:18px">There's a specific kind of frustration you only feel when a tool is almost good enough - not broken, not obviously wrong, just one infuriating abstraction layer away from what you actually need.</div>
  <div class="columns-2" style="margin-top:16px">
    <div class="card"><h3>What's still being hardened</h3><p>Barge-in detection, acoustic echo cancellation, end-of-turn timing, conference attachment, recording continuity, and calendar handoff remain active production-engineering concerns.</p></div>
    <div class="card"><h3>What shipped instead</h3><p>A deployed private-beta streaming platform spanning AI Phone, Public AI Profile, Website Chat, and Meeting Assistant - with direct ownership of telephony, model orchestration, escalation, evidence, and failure recovery.</p></div>
  </div>
  <div class="card" style="margin-top:14px;background:linear-gradient(145deg,var(--softgold),#fff)"><h3>The product this became</h3><p>See the platform this pipeline powers - problems it targets, surfaces it ships, and what production taught along the way - on pages 12-13.</p></div>
  <div class="source">Origin account condensed from Subodh KC's March 2026 engineering essay. Comparative latency figures are treated as development observations, not universal third-party benchmarks.</div><div class="pg">11</div>
</div></section>

<!-- 12 -->
<section class="page" id="kestrel-product"><div class="page-grid"></div><div class="page-inner">
  <div class="running"><b>KESTREL VOICE</b><span>Product strategy</span></div>
  <p class="kicker">Customer-response operating layer</p><h2>Every customer interaction should end in a usable business outcome.</h2>
  <div class="columns-2" style="margin-top:18px;grid-template-columns:.9fr 1.1fr">
    <div class="case-content">
      <div class="card"><span class="status">Platform thesis</span><h3 style="margin-top:6px">Move beyond voicemail and isolated bots</h3><p>Kestrel connects customer conversations to approved business knowledge, appointments, transfers, follow-up, workflows, and operating intelligence - across phone, chat, and a public AI profile.</p></div>
      <div class="card"><h3>Target operating problems</h3><ul><li>After-hours and overflow demand</li><li>Repeated questions and inconsistent intake</li><li>Manual appointment and callback handoffs</li><li>Unstructured transcripts and weak follow-up</li><li>Disconnected phone, chat, calendar, and CRM activity</li></ul></div>
      <div class="card"><h3>Deployed private-beta surfaces</h3><p><b>Operational:</b> AI Phone and customer-intake workflows. <b>Beta:</b> Public AI Profile and Website Chat. <b>Active hardening:</b> Meeting Assistant, calendar handoff, recording continuity, transcript reliability, and advanced escalation.</p></div>
    </div>
    <div class="mock"><div class="mock-top"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div><div class="mock-body">
      <p class="kicker">Illustrative interaction queue</p>
      <div class="mock-row"><div class="mock-icon">01</div><div><b>After-hours service request</b><br/><span>Need, location, urgency, callback preference</span></div><div class="pill">Priority</div></div>
      <div class="mock-row"><div class="mock-icon">02</div><div><b>Appointment request</b><br/><span>Availability checked, context preserved</span></div><div class="pill">Booked</div></div>
      <div class="mock-row"><div class="mock-icon">03</div><div><b>Routine customer question</b><br/><span>Answer grounded in approved knowledge</span></div><div class="pill">Resolved</div></div>
      <div class="mock-row"><div class="mock-icon">04</div><div><b>Escalation to team</b><br/><span>Summary, transcript, reason, and urgency</span></div><div class="pill">Transferred</div></div>
      <div style="margin-top:16px;padding:14px;border-radius:14px;background:linear-gradient(145deg,var(--navy),#13526d);color:#fff"><h3 style="color:#fff">One knowledge layer</h3><p style="color:#dbecef;margin-top:6px;font-size:8.5px">Phone · Website chat · Public AI profile · Meeting intelligence · Workflow actions</p></div>
    </div>
  </div>
  <div class="source">Evidence basis: public product surfaces plus internal call, telephony, transcript, booking, recording, and deployment records. Capability status is intentionally separated from platform availability.</div><div class="pg">12</div>
</div></section>

<!-- 13 -->
<section class="page" id="kestrel-architecture"><div class="page-grid"></div><div class="page-inner">
  <div class="running"><b>KESTREL VOICE</b><span>Platform architecture</span></div>
  <p class="kicker">From conversation to business action</p><h2>The conversation is only the interface. The outcome is the product.</h2>
  <div class="diagram" style="margin-top:20px">
    <div class="flow"><div class="step"><div class="num">1</div><b>Reach</b><span>call, chat, or profile</span></div><div class="step"><div class="num">2</div><b>Understand</b><span>intent and context</span></div><div class="step"><div class="num">3</div><b>Answer</b><span>approved knowledge</span></div><div class="step"><div class="num">4</div><b>Act</b><span>book, capture, transfer</span></div><div class="step"><div class="num">5</div><b>Notify</b><span>summary and outcome</span></div><div class="step"><div class="num">6</div><b>Learn</b><span>patterns and improvement</span></div></div>
  </div>
  <div class="columns-3" style="margin-top:18px">
    <div class="card"><h3>Conversation layer</h3><ul><li>Phone and web channels</li><li>Voice and interaction configuration</li><li>Spam and routing logic</li><li>Transcripts and recording controls</li></ul></div>
    <div class="card"><h3>Knowledge and action</h3><ul><li>Business information and RAG</li><li>Appointments and calendar logic</li><li>Transfer and escalation</li><li>CRM, webhooks, and follow-up</li></ul></div>
    <div class="card"><h3>Operations layer</h3><ul><li>Usage and cost visibility</li><li>Summaries and intelligence</li><li>Human fallback and exception handling</li><li>Workflow monitoring and improvement</li></ul></div>
  </div>
  <div class="columns-2" style="margin-top:18px">
    <div class="card" style="background:var(--softblue)"><h3>What production taught me</h3><p>Correct escalation beats sounding human. Business rules get defined before they get automated. Cost, monitoring, and failure recovery are product features, not afterthoughts.</p></div>
    <div class="card" style="background:var(--softteal)"><h3>Strategic expansion path</h3><p>Answer the interaction first. Then connect the next action. Add intelligence and custom workflows only once the operating case is visible in the data.</p></div>
  </div>
  <div class="source">Kestrel is evidence of end-to-end product ownership: product strategy, multi-tenant architecture, telephony, RAG, customer operations, AI cost control, incident analysis, and production hardening.</div><div class="pg">13</div>
</div></section>
<!-- 14 -->
<section class="page" id="haiec-product"><div class="page-grid"></div><div class="page-inner">
  <div class="running"><b>HAIEC</b><span>Product strategy</span></div>
  <p class="kicker">Holistic AI Ethics &amp; Compliance · Evidence layer for operational AI</p><h2>AI adoption moves fast. Defensible evidence usually arrives late.</h2>
  <div class="columns-2" style="margin-top:18px">
    <div class="case-content">
      <div class="card"><span class="status">Problem</span><h3 style="margin-top:6px">Policy is not proof</h3><p>AI systems may not be inventoried. Vendor claims substitute for internal evidence. Testing happens late. Ownership, authority, and human review are unclear. Artifacts remain scattered across teams.</p></div>
      <div class="card"><span class="status">Platform thesis</span><h3 style="margin-top:6px">Connect business use, technical exposure, controls, and evidence</h3><p>HAIEC is designed to help an organization answer both: "Are we using AI this way responsibly?" and "Can we demonstrate how the decision was reviewed and controlled?"</p></div>
      <div class="card"><span class="status">Differentiation</span><h3 style="margin-top:6px">Deterministic where reproduction matters</h3><p>Use reproducible checks and versioned evidence where consistency matters; use AI-assisted analysis and expert review where context adds value.</p></div>
    </div>
    <div class="diagram"><h3>Exposure-to-evidence map</h3><div style="margin-top:14px;display:grid;gap:9px">
      <div style="padding:12px;border:1px solid #cbd9ff;background:var(--softblue);border-radius:12px"><b>What exists?</b><p class="small">Systems, vendors, users, models, business purposes, and data.</p></div>
      <div style="padding:12px;border:1px solid #cce8e2;background:var(--softteal);border-radius:12px"><b>What can it do?</b><p class="small">Outputs, actions, decisions, authority, and human oversight.</p></div>
      <div style="padding:12px;border:1px solid #ead6ad;background:var(--softgold);border-radius:12px"><b>What was tested?</b><p class="small">Static exposure, runtime behavior, failure cases, and limitations.</p></div>
      <div style="padding:12px;border:1px solid var(--line);background:#fff;border-radius:12px"><b>What can be proved?</b><p class="small">Findings, decisions, remediation, owners, versions, and monitoring.</p></div>
    </div></div>
  </div>
  <div class="quote" style="margin-top:16px">The moment that shaped HAIEC: auditing my own compliance-pack implementation and finding a clean-looking facade sitting on top of detection logic that wasn't actually there. A dashboard that reports "compliant" is not the same thing as a system that checked.</div>
  <div class="source">Publicly deployed governance platform under active development. HAIEC supports structured assessment, security analysis, evidence generation, and framework mapping; it is not a guarantee of legal compliance, certification, or a replacement for counsel.</div><div class="pg">14</div>
</div></section>

<!-- 15 -->
<section class="page" id="haiec-architecture"><div class="page-grid"></div><div class="page-inner">
  <div class="running"><b>HAIEC</b><span>Platform architecture</span></div>
  <p class="kicker">Discover. Assess. Test. Control. Prove. Monitor.</p><h2>Governance works when evidence follows the system through its lifecycle.</h2>
  <div class="diagram" style="margin-top:20px">
    <div class="flow"><div class="step"><div class="num">1</div><b>Discover</b><span>inventory and purpose</span></div><div class="step"><div class="num">2</div><b>Assess</b><span>applicability and exposure</span></div><div class="step"><div class="num">3</div><b>Test</b><span>static and runtime evidence</span></div><div class="step"><div class="num">4</div><b>Control</b><span>owners, limits, approvals</span></div><div class="step"><div class="num">5</div><b>Prove</b><span>versioned artifacts</span></div><div class="step"><div class="num">6</div><b>Monitor</b><span>change, incidents, drift</span></div></div>
  </div>
  <div class="columns-3" style="margin-top:18px">
    <div class="card"><h3>Business and legal context</h3><ul><li>AI inventory and role classification</li><li>Applicability and exemption analysis</li><li>Purpose, data, output, and authority mapping</li><li>Obligation and disclosure planning</li></ul></div>
    <div class="card"><h3>Technical assurance</h3><ul><li>Static security and configuration checks</li><li>Prompt injection and runtime testing</li><li>RAG, tool, and data-exposure analysis</li><li>Known limitations and failure scenarios</li></ul></div>
    <div class="card"><h3>Evidence lifecycle</h3><ul><li>Versioned findings and decisions</li><li>Remediation owners and due dates</li><li>Framework mapping and export packages</li><li>Continuous monitoring and change history</li></ul></div>
  </div>
  <div class="mock" style="margin-top:18px"><div class="mock-top"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div><div class="mock-body" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
    <div><span class="status">System record</span><h3 style="margin-top:5px">Customer intake agent</h3><p class="small">Purpose, users, vendor, data, outputs, and owner.</p></div>
    <div><span class="status">Testing</span><h3 style="margin-top:5px">12 scenarios</h3><p class="small">Normal, edge, injection, data leakage, escalation, and stop conditions.</p></div>
    <div><span class="status">Evidence</span><h3 style="margin-top:5px">Decision package</h3><p class="small">Findings, guardrails, limitations, remediation, and approval record.</p></div>
  </div></div>
  <div class="source">Architecture view combines implemented core capabilities with the governed lifecycle HAIEC is building toward. Public outputs distinguish implemented checks, roadmap modules, preliminary readiness analysis, and legal advice.</div><div class="pg">15</div>
</div></section>

<!-- 16 -->
<section class="page" id="llmverify"><div class="page-grid"></div><div class="page-inner">
  <div class="running"><b>LLMVERIFY</b><span>Developer controls</span></div>
  <p class="kicker">Turning governance principles into code</p><h2>Local, inspectable guardrails for the failure modes teams keep rebuilding.</h2>
  <div class="columns-2" style="margin-top:18px;grid-template-columns:1.05fr .95fr">
    <div>
      <div style="border-radius:18px;background:#081a2b;color:#dbeafe;padding:18px;font-family:Consolas,monospace;font-size:10px;line-height:1.6;box-shadow:0 12px 26px rgba(10,32,53,.18)">
        <span style="color:#7dd3fc">const</span> { verify, isInputSafe, redactPII } = <span style="color:#fde68a">require</span>(<span style="color:#86efac">'llmverify'</span>);<br/><br/>
        <span style="color:#7dd3fc">if</span> (!isInputSafe(userMessage)) {<br/> &nbsp;&nbsp;<span style="color:#7dd3fc">return</span> { error: <span style="color:#86efac">'Blocked'</span> };<br/>}<br/><br/>
        <span style="color:#7dd3fc">const</span> result = <span style="color:#7dd3fc">await</span> verify(aiResponse);<br/>
        <span style="color:#7dd3fc">const</span> safeLog = redactPII(aiResponse);
      </div>
      <p class="lead" style="margin-top:18px">Built because production LLM features repeatedly needed the same controls - input safety, output validation, and PII hygiene. llmverify places reproducible local checks around application behavior, with control references aligned to NIST AI RMF concepts and the OWASP LLM Top 10.</p>
    </div>
    <div class="four">
      <div class="mini"><div class="icon">IN</div><h3>Injection checks</h3><p>Detect suspicious instructions and jailbreak patterns before model execution.</p></div>
      <div class="mini"><div class="icon" style="background:var(--softteal);color:var(--teal)">PII</div><h3>Privacy checks</h3><p>Find and redact common personal or secret data before logging or storage.</p></div>
      <div class="mini"><div class="icon" style="background:var(--softgold);color:var(--gold)">JSON</div><h3>Output reliability</h3><p>Validate and repair malformed structured output that can break downstream systems.</p></div>
      <div class="mini"><div class="icon">OPS</div><h3>Monitoring &amp; audit</h3><p>Track latency, consistency, drift indicators, risk signals, and local audit events.</p></div>
    </div>
  </div>
  <div class="metrics" style="margin-top:16px;grid-template-columns:repeat(3,1fr)">
    <div class="metric" style="min-height:auto;padding:12px 14px"><div class="value" style="font-size:24px">360</div><div class="label">tests reported passing</div><p>First-party CI claim; publish with commit SHA.</p></div>
    <div class="metric" style="min-height:auto;padding:12px 14px"><div class="value" style="font-size:24px">Local</div><div class="label">default processing model</div><p>No mandatory hosted verifier.</p></div>
    <div class="metric" style="min-height:auto;padding:12px 14px"><div class="value" style="font-size:24px">MIT</div><div class="label">open-source license</div><p>Package and source intended for inspection.</p></div>
  </div>
  <div class="columns-3" style="margin-top:14px">
    <div class="card"><h3>Local-first</h3><p>Verification is designed to run without telemetry or mandatory external inference.</p></div>
    <div class="card"><h3>Provider-independent</h3><p>Controls should sit around the application behavior, not depend on one model vendor.</p></div>
    <div class="card"><h3>Transparent limitations</h3><p>Deterministic checks are reproducible, but they should state what was and was not assessed.</p></div>
  </div>
  <div class="source">Open-source evidence: public package documentation, source materials, and first-party test reporting. Adoption counts belong only in dated editions after direct registry verification.</div><div class="pg">16</div>
</div></section>

<!-- 17 -->
<section class="page" id="selected-systems"><div class="page-grid"></div><div class="page-inner">
  <div class="running"><b>SELECTED SYSTEMS</b><span>Builder portfolio</span></div>
  <p class="kicker">Small systems that remove expensive friction</p><h2>Build where control creates leverage. Configure everywhere else.</h2>
  <div class="four" style="margin-top:20px">
    <div class="mini"><span class="tag blue">Open source / active</span><h3 style="margin-top:10px">PM Orchestrator</h3><p>Specification-driven coordination for multiple AI coding agents, using separated roles, scheduled check-ins, Git safety, and explicit success criteria.</p><div class="rule"></div><p class="small"><b>Proves:</b> agent orchestration, program logic, safety constraints, and developer workflow design.</p></div>
    <div class="mini"><span class="tag teal">Applied tool</span><h3 style="margin-top:10px">SKC Log Analyser</h3><p>Multi-log root-cause analysis, comparison, clustering, anomaly detection, and export for faster investigation of complex system failures.</p><div class="rule"></div><p class="small"><b>Proves:</b> reliability thinking, data analysis, RCA, and practical internal-tool development.</p></div>
    <div class="mini"><span class="tag gold">Assessment platform</span><h3 style="margin-top:10px">AI Readiness Scorecard</h3><p>An executive assessment spanning strategy, data, infrastructure, governance, talent, and use-case readiness with reporting and maturity views.</p><div class="rule"></div><p class="small"><b>Proves:</b> advisory productization, scoring systems, dashboards, and executive communication.</p></div>
    <div class="mini"><span class="tag blue">Privacy-first utility</span><h3 style="margin-top:10px">Print Later</h3><p>A local Windows utility for capturing, organizing, and printing web content without unnecessary cloud processing or tracking.</p><div class="rule"></div><p class="small"><b>Proves:</b> product simplicity, local-first principles, and solving a narrow workflow well.</p></div>
  </div>
  <div class="diagram" style="margin-top:20px"><h3>Configure, connect, customize, or build?</h3><div class="flow" style="margin-top:12px"><div class="step"><div class="num">C</div><b>Configure</b><span>existing product fits</span></div><div class="step"><div class="num">X</div><b>Connect</b><span>value trapped between tools</span></div><div class="step"><div class="num">U</div><b>Customize</b><span>rules and experience differ</span></div><div class="step"><div class="num">B</div><b>Build</b><span>control or advantage matters</span></div></div></div>
  <div class="source">Excluded from the magazine: empty boilerplates, placeholders, and side projects that do not strengthen the strategy-program-platform-governance narrative.</div><div class="pg">17</div>
</div></section>

<!-- 18 -->
<section class="page" id="privacy-tools"><div class="page-grid"></div><div class="page-inner">
  <div class="running"><b>SELECTED SYSTEMS</b><span>Privacy and access tools</span></div>
  <p class="kicker">Privacy-first tools for work that cannot tolerate careless handling</p><h2>Enterprise discipline, applied to high-consequence everyday workflows.</h2>
  <div class="columns-3" style="margin-top:20px;align-items:stretch">
    <div class="mini" style="display:flex;flex-direction:column"><span class="tag gold">Free tool</span><h3 style="margin-top:10px">PDF Redactor</h3><p>AI-powered detection and <i>permanent</i> redaction of SSNs, credit card numbers, names, and 50+ other PII types from PDFs - batch processing, fully local execution, no upload required.</p><div class="rule"></div><p class="small"><b>Proves:</b> privacy-by-design product thinking and shipping a genuinely free, cloud-free utility for a problem people usually solve by hoping nobody looks too closely.</p></div>
    <div class="mini" style="display:flex;flex-direction:column"><span class="tag">Enterprise prototype</span><h3 style="margin-top:10px">Doc Timeline</h3><p>AI-assisted extraction designed to turn unstructured document sets into chronological, cross-referenced timelines with gap and conflict detection for legal, insurance, and compliance workflows.</p><div class="rule"></div><p class="small"><b>Proves:</b> enterprise document-intelligence architecture and productizing a workflow that is otherwise manual and difficult to audit. SOC 2 readiness is a design objective, not a certification claim.</p></div>
    <div class="mini" style="display:flex;flex-direction:column"><span class="tag teal">Waitlist</span><h3 style="margin-top:10px">SKC CourtCase</h3><p>Local case-file organization, deadline tracking, and document-packet preparation built specifically for self-represented litigants - runs entirely on-device.</p><div class="rule"></div><p class="small"><b>Proves:</b> access-to-justice product instinct - building for someone representing themselves in court with the same rigor as a Fortune 50 compliance team.</p></div>
  </div>
  <div class="card" style="margin-top:16px;background:linear-gradient(145deg,var(--softblue),#fff)"><h3>Why these exist alongside the enterprise work</h3><p>Self-represented litigants lose cases to disorganization as often as to the merits. A missed deadline costs a local service business the same way a compliance gap costs an enterprise real exposure - the tools change, the discipline behind them doesn't.</p></div>
  <div class="source">Public product registry: subodhkc.com/products. Statuses reflect evidence available in July 2026; product presence is not presented as customer adoption, certification, or independently measured performance.</div><div class="pg">18</div>
</div></section>

<!-- 19 -->
<section class="page" id="research"><div class="page-grid"></div><div class="page-inner">
  <div class="running"><b>RESEARCH &amp; IP</b><span>Methods behind the systems</span></div>
  <p class="kicker">Original frameworks and selected writing</p><h2>Research is useful when it exposes the method behind the system.</h2>
  <div class="article-list" style="margin-top:20px">
    <div class="article"><div class="type">Framework</div><h3>Cognitive Systems Management</h3><p>A management model for treating AI as a socio-technical operating system rather than a standalone model or automation feature.</p></div>
    <div class="article"><div class="type">Audit method</div><h3>Instruction Stack Audit Framework</h3><p>A structured way to examine competing system, policy, developer, context, and user instructions that influence AI behavior.</p></div>
    <div class="article"><div class="type">Reliability / invention filing</div><h3>Precision Drift Detection</h3><p>Methods for detecting behavioral changes, hidden degradation, and risk paths before they become visible failures.</p></div>
    <div class="article"><div class="type">Governance / invention filings</div><h3>Compliance Twin &amp; Fingerprint</h3><p>A system-level record connecting requirements, controls, technical state, evidence, change, and traceability.</p></div>
    <div class="article"><div class="type">Applied article</div><h3>From AI Pilots to Regulatory Readiness</h3><p>Why readiness must be built into ownership, data, testing, and operations instead of added after deployment.</p></div>
    <div class="article"><div class="type">Applied article</div><h3>Why Enterprise AI Integration Strategies Fail</h3><p>Failure patterns in workflows, data, accountability, system boundaries, adoption, and production ownership.</p></div>
  </div>
  <div class="diagram" style="margin-top:18px">
    <h3>ISAF: nine layers, one audit trail</h3>
    <p class="small" style="margin-top:6px">From voltage thresholds to emergent output - the instruction stack ISAF traces, with a 127-checkpoint protocol behind it.</p>
    <div style="margin-top:12px;display:grid;grid-template-columns:repeat(9,1fr);gap:4px">
      <div style="background:#0a2035;color:#fff;border-radius:6px;padding:6px 3px;text-align:center;font-size:6.6px;font-weight:800">HARDWARE</div>
      <div style="background:#102f49;color:#fff;border-radius:6px;padding:6px 3px;text-align:center;font-size:6.6px;font-weight:800">FIRMWARE</div>
      <div style="background:#0e8fb7;color:#fff;border-radius:6px;padding:6px 3px;text-align:center;font-size:6.6px;font-weight:800">OS / RUNTIME</div>
      <div style="background:#2563eb;color:#fff;border-radius:6px;padding:6px 3px;text-align:center;font-size:6.6px;font-weight:800">MODEL WEIGHTS</div>
      <div style="background:#0f766e;color:#fff;border-radius:6px;padding:6px 3px;text-align:center;font-size:6.6px;font-weight:800">OBJECTIVE FN</div>
      <div style="background:#0f766e;color:#fff;border-radius:6px;padding:6px 3px;text-align:center;font-size:6.6px;font-weight:800">SYSTEM PROMPT</div>
      <div style="background:#bb7a20;color:#fff;border-radius:6px;padding:6px 3px;text-align:center;font-size:6.6px;font-weight:800">POLICY / DEV</div>
      <div style="background:#bb7a20;color:#fff;border-radius:6px;padding:6px 3px;text-align:center;font-size:6.6px;font-weight:800">CONTEXT / RAG</div>
      <div style="background:#8b5713;color:#fff;border-radius:6px;padding:6px 3px;text-align:center;font-size:6.6px;font-weight:800">USER / OUTPUT</div>
    </div>
    <div class="columns-2" style="margin-top:14px">
      <div><h3>Five named AI invention filings</h3><p class="small" style="margin-top:8px">Adversarial Project Twin · Precision Drift Detector · AI Compliance Twin · Modular Audit Engine · Compliance Fingerprint Layer. Filing type and status should be read against the private filing register.</p></div>
      <div><h3>Editorial rule</h3><p class="small" style="margin-top:8px">Use exact status labels: technical report, working paper, published framework, patent application filed, or patent pending. Do not imply peer review where it did not occur.</p></div>
    </div>
  </div>
  <div class="source">DOI-registered technical scholarship, publicly archived through CERN's open research infrastructure: ISAF - 10.5281/zenodo.18080355; Deterministic Bias Detection - 10.5281/zenodo.18056133; Industrial Electrification to AI Governance - 10.5281/zenodo.18664344. Repository publication provides a durable scholarly record; peer review is not implied.</div><div class="pg">19</div>
</div></section>

<!-- 20 -->
<section class="page" id="origin-stories"><div class="page-grid"></div><div class="page-inner">
  <div class="running"><b>RESEARCH &amp; IP</b><span>Origin stories</span></div>
  <p class="kicker">Frameworks aren't invented in a vacuum</p><h2>The methods came from operating failures that made the missing control visible.</h2>
  <div class="card" style="margin-top:16px"><span class="status">Cognitive Systems Management</span><h3 style="margin-top:6px">When delivery mechanics are correct but adoption still fails</h3><p>CSM began with a recurring enterprise pattern: requirements can be documented, integrations completed, testing passed, and a release declared successful - while the people expected to rely on the system still do not trust, understand, or consistently use it. Traditional delivery frameworks manage the technology; CSM extends the operating model to human judgment, authority, evidence, adaptation, and ownership.</p></div>
  <div class="columns-2" style="margin-top:14px">
    <div class="card"><span class="status">Enterprise portfolio leadership</span><h3 style="margin-top:6px">53 applications exposed the cost of hidden dependencies</h3><p>Managing a portfolio through several program managers made one lesson unavoidable: applications rarely fail together. They fail one dependency, one ownership gap, or one delayed decision at a time. That experience shaped the signal-to-decision operating rhythm used throughout this book.</p></div>
    <div class="card"><span class="status">Kestrel Voice</span><h3 style="margin-top:6px">A working demo is not an operating system</h3><p>Telephony conferences, AI attachment, transcript persistence, recording callbacks, persona configuration, booking, and escalation each worked as separate features before they worked reliably as one service. Kestrel turned those failures into architecture: explicit state, evidence, recovery, cost visibility, and human fallback.</p></div>
  </div>
  <div class="columns-2" style="margin-top:14px">
    <div class="card" style="background:linear-gradient(145deg,var(--softteal),#fff)"><span class="status">HAIEC</span><h3 style="margin-top:6px">A clean compliance screen can still be empty evidence</h3><p>An internal audit found a polished compliance-pack experience sitting above detection logic that did not yet justify the result. That discovery became HAIEC's governing principle: never let presentation outrun the check, the evidence, or the limitation statement.</p></div>
    <div class="card" style="background:linear-gradient(145deg,var(--softgold),#fff)"><span class="status">ISAF and llmverify</span><h3 style="margin-top:6px">Trace the instruction; operationalize the control</h3><p>ISAF follows influence across nine abstraction layers; llmverify translates a narrower set of recurring application controls into inspectable local code. One explains where accountability can break. The other shows how part of that discipline can run with the system.</p></div>
  </div>
  <div class="source">Grounded origin stories: professional portfolio leadership, documented Kestrel engineering incidents, HAIEC implementation audit, DOI-registered ISAF methodology, and public llmverify materials. Anonymous financial scenarios from earlier essays are not presented here as verified client cases.</div><div class="pg">20</div>
</div></section>

<!-- 21 -->
<section class="page" id="governance"><div class="page-grid"></div><div class="page-inner">
  <div class="running"><b>OPERATIONAL GOVERNANCE</b><span>Perspective</span></div>
  <p class="kicker">AI becomes infrastructure</p><h2>You cannot govern an AI system you have not operationally defined.</h2>
  <p class="lead" style="margin-top:12px">Law is one part of the exposure. The operating questions are broader and more useful:</p>
  <div class="columns-2" style="margin-top:18px">
    <div class="mini"><div class="icon">P</div><h3>1. Purpose</h3><p>What business outcome does the system serve, and what is outside its intended use?</p></div>
    <div class="mini"><div class="icon" style="background:var(--softteal);color:var(--teal)">D</div><h3>2. Data</h3><p>What information does it receive, create, retain, expose, or send to vendors?</p></div>
    <div class="mini"><div class="icon" style="background:var(--softgold);color:var(--gold)">A</div><h3>3. Authority</h3><p>What may it answer, recommend, decide, change, purchase, schedule, or communicate?</p></div>
    <div class="mini"><div class="icon">T</div><h3>4. Testing</h3><p>Which normal, edge, adversarial, and failure scenarios were evaluated before launch?</p></div>
    <div class="mini"><div class="icon" style="background:var(--softteal);color:var(--teal)">H</div><h3>5. Human responsibility</h3><p>Who reviews, approves, receives escalations, stops the system, and owns remediation?</p></div>
    <div class="mini"><div class="icon" style="background:var(--softgold);color:var(--gold)">E</div><h3>6. Evidence</h3><p>What record remains of purpose, configuration, tests, limits, decisions, incidents, and change?</p></div>
  </div>
  <div class="quote" style="margin-top:20px">Create value first - but design the controls necessary for that value to survive.</div>
  <div class="columns-2" style="margin-top:16px">
    <div><span class="tag gold">Texas AI</span><p class="small" style="margin-top:8px">Texas applicability and exposure should be analyzed by use case, role, location, data, and action. A readiness review is not a legal opinion or certification.</p></div>
    <div><span class="tag teal">Business value</span><p class="small" style="margin-top:8px">Strong governance can accelerate safer approval, standardize employee use, reduce tool sprawl, improve questionnaires, and prevent valuable projects from stalling.</p></div>
  </div>
  <div class="card" style="margin-top:14px;background:linear-gradient(145deg,var(--softgold),#fff)"><h3>This framework, productized</h3><p>These six questions are the exact spine of HAIEC's evidence platform - see it built out on pages 14-15, including the origin moment that shaped it.</p></div>
  <div class="source">This page summarizes the operating model behind the Texas AI + HAIEC insert and the Texas AI Use &amp; Defensibility Snapshot.</div><div class="pg">21</div>
</div></section>

<!-- 22 -->
<section class="page" id="advisory"><div class="page-grid"></div><div class="page-inner">
  <div class="running"><b>ADVISORY METHOD</b><span>From review to scale</span></div>
  <p class="kicker">Find the valuable workflow before buying the tool</p><h2>Start with one costly friction point and one decision the pilot must earn.</h2>
  <div class="diagram" style="margin-top:20px"><div class="flow"><div class="step"><div class="num">1</div><b>Outcome</b><span>what should improve</span></div><div class="step"><div class="num">2</div><b>Workflow</b><span>current steps and friction</span></div><div class="step"><div class="num">3</div><b>Baseline</b><span>volume, time, cost, quality</span></div><div class="step"><div class="num">4</div><b>Score</b><span>value and readiness</span></div><div class="step"><div class="num">5</div><b>Risk gate</b><span>data, authority, consequence</span></div><div class="step"><div class="num">6</div><b>Pilot</b><span>30-day proof</span></div><div class="step"><div class="num">7</div><b>Decision</b><span>stop, improve, scale</span></div></div></div>
  <div class="caseband" style="margin-top:20px;grid-template-columns:1.05fr .95fr">
    <div class="case-content">
      <h3>Illustrative service-business journey</h3>
      <div class="card"><b>Current state</b><p>Calls arrive while staff are occupied. Lead details are inconsistent. Follow-up depends on the owner. Calendar and CRM are disconnected.</p></div>
      <div class="card"><b>Sequence</b><p>Opportunity Snapshot → Kestrel AI Phone pilot → measure outcomes → connect CRM → apply HAIEC controls → decide whether to scale.</p></div>
      <div class="card"><b>Proof</b><p>Baseline, target, owner, human fallback, test cases, adoption, cost, failure criteria, and next decision date.</p></div>
    </div>
    <div class="case-label" style="background:linear-gradient(160deg,#0d4d57,#0f766e)"><div><p class="kicker" style="color:#bcece5">Ways to work together</p><h3>Strategy through execution</h3></div><ul style="margin:6px 0 0;padding-left:16px;color:rgba(255,255,255,.9);font-size:9.5px;line-height:1.9"><li>AI opportunity and portfolio review</li><li>Strategic program leadership</li><li>Focused AI pilot</li><li>Custom AI system</li><li>Texas AI defensibility review</li><li>Fractional AI leadership</li></ul></div>
  </div>
  <div class="card" style="margin-top:14px;background:linear-gradient(145deg,var(--softblue),#fff)"><h3>Not sure where to start?</h3><p>The Field Guide (page 23) indexes every tool and framework in this book in one line each. Skeptical about the fit? Page 24 answers the questions directly.</p></div>
  <div class="source">Engagements are scoped around business outcomes and decision value. Current pricing belongs on live offer pages, not in a timeless executive portfolio.</div><div class="pg">22</div>
</div></section>

<!-- 23 -->
<section class="page" id="field-guide"><div class="page-grid"></div><div class="page-inner">
  <div class="running"><b>THE FIELD GUIDE</b><span>Every tool and framework, one line each</span></div>
  <p class="kicker">The portfolio registry</p><h2>Every system and framework, defined by purpose and maturity.</h2>
  <div class="diagram" style="margin-top:16px;padding:14px 18px">
    <div style="display:grid;grid-template-columns:1.15fr 2fr .8fr;gap:10px;padding-bottom:8px;border-bottom:2px solid var(--navy)"><b style="font-size:8px;text-transform:uppercase;letter-spacing:.06em;color:var(--blue)">Name</b><b style="font-size:8px;text-transform:uppercase;letter-spacing:.06em;color:var(--blue)">What it is</b><b style="font-size:8px;text-transform:uppercase;letter-spacing:.06em;color:var(--blue)">Status</b></div>
<div style="display:grid;grid-template-columns:1.15fr 2fr .8fr;gap:10px;padding:8px 0;border-bottom:1px solid var(--line);align-items:center"><b style="font-size:9.2px;color:var(--navy)">Kestrel Voice</b><p class="small" style="font-size:8.4px">AI voice/chat operating layer that answers calls, captures demand, supports booking, and routes escalation.</p><span class="tag teal" style="justify-self:start">Deployed private beta</span></div>
<div style="display:grid;grid-template-columns:1.15fr 2fr .8fr;gap:10px;padding:8px 0;border-bottom:1px solid var(--line);align-items:center"><b style="font-size:9.2px;color:var(--navy)">HAIEC</b><p class="small" style="font-size:8.4px">Governance and evidence platform connecting AI use, technical exposure, controls, findings, and versioned artifacts.</p><span class="tag blue" style="justify-self:start">Operational / evolving</span></div>
<div style="display:grid;grid-template-columns:1.15fr 2fr .8fr;gap:10px;padding:8px 0;border-bottom:1px solid var(--line);align-items:center"><b style="font-size:9.2px;color:var(--navy)">llmverify</b><p class="small" style="font-size:8.4px">Open-source, local-first Node.js package for LLM output validation - injection detection, PII redaction, output repair.</p><span class="tag gold" style="justify-self:start">Open source</span></div>
<div style="display:grid;grid-template-columns:1.15fr 2fr .8fr;gap:10px;padding:8px 0;border-bottom:1px solid var(--line);align-items:center"><b style="font-size:9.2px;color:var(--navy)">CSM</b><p class="small" style="font-size:8.4px">Cognitive Systems Management - a framework treating AI as an operated system, not a one-time deployment.</p><span class="tag " style="justify-self:start">Published framework</span></div>
<div style="display:grid;grid-template-columns:1.15fr 2fr .8fr;gap:10px;padding:8px 0;border-bottom:1px solid var(--line);align-items:center"><b style="font-size:9.2px;color:var(--navy)">ISAF</b><p class="small" style="font-size:8.4px">Instruction Stack Audit Framework - nine-layer, 127-checkpoint methodology for auditing AI instruction propagation, not just outputs.</p><span class="tag " style="justify-self:start">Technical report</span></div>
<div style="display:grid;grid-template-columns:1.15fr 2fr .8fr;gap:10px;padding:8px 0;border-bottom:1px solid var(--line);align-items:center"><b style="font-size:9.2px;color:var(--navy)">Precision Drift Detection</b><p class="small" style="font-size:8.4px">Early-warning methods for model behavioral drift before it surfaces in outputs.</p><span class="tag teal" style="justify-self:start">Research / filing</span></div>
<div style="display:grid;grid-template-columns:1.15fr 2fr .8fr;gap:10px;padding:8px 0;border-bottom:1px solid var(--line);align-items:center"><b style="font-size:9.2px;color:var(--navy)">AI Compliance Twin &amp; Fingerprint</b><p class="small" style="font-size:8.4px">Versioned system-of-record linking requirements, controls, evidence, and change history.</p><span class="tag teal" style="justify-self:start">Research / filings</span></div>
<div style="display:grid;grid-template-columns:1.15fr 2fr .8fr;gap:10px;padding:8px 0;border-bottom:1px solid var(--line);align-items:center"><b style="font-size:9.2px;color:var(--navy)">PM Orchestrator</b><p class="small" style="font-size:8.4px">Coordination layer for multiple AI coding agents working the same codebase.</p><span class="tag gold" style="justify-self:start">Open source</span></div>
<div style="display:grid;grid-template-columns:1.15fr 2fr .8fr;gap:10px;padding:8px 0;border-bottom:1px solid var(--line);align-items:center"><b style="font-size:9.2px;color:var(--navy)">SKC Log Analyser</b><p class="small" style="font-size:8.4px">AI-assisted multi-log root-cause analysis and anomaly detection, on-premise.</p><span class="tag teal" style="justify-self:start">Early access</span></div>
<div style="display:grid;grid-template-columns:1.15fr 2fr .8fr;gap:10px;padding:8px 0;border-bottom:1px solid var(--line);align-items:center"><b style="font-size:9.2px;color:var(--navy)">AI Readiness Scorecard</b><p class="small" style="font-size:8.4px">Executive assessment of strategy, data, governance, and talent readiness for AI adoption.</p><span class="tag " style="justify-self:start">In use</span></div>
<div style="display:grid;grid-template-columns:1.15fr 2fr .8fr;gap:10px;padding:8px 0;border-bottom:1px solid var(--line);align-items:center"><b style="font-size:9.2px;color:var(--navy)">Print Later</b><p class="small" style="font-size:8.4px">Local Windows app for saving and queuing web pages to print later.</p><span class="tag gold" style="justify-self:start">Free / open source</span></div>
<div style="display:grid;grid-template-columns:1.15fr 2fr .8fr;gap:10px;padding:8px 0;border-bottom:1px solid var(--line);align-items:center"><b style="font-size:9.2px;color:var(--navy)">PDF Redactor</b><p class="small" style="font-size:8.4px">AI-powered, permanent PII redaction across PDFs, processed entirely on-device.</p><span class="tag gold" style="justify-self:start">Free</span></div>
<div style="display:grid;grid-template-columns:1.15fr 2fr .8fr;gap:10px;padding:8px 0;border-bottom:1px solid var(--line);align-items:center"><b style="font-size:9.2px;color:var(--navy)">Doc Timeline</b><p class="small" style="font-size:8.4px">AI-assisted extraction designed to turn document sets into chronological, cross-referenced case timelines.</p><span class="tag " style="justify-self:start">Enterprise prototype</span></div>
<div style="display:grid;grid-template-columns:1.15fr 2fr .8fr;gap:10px;padding:8px 0;border-bottom:1px solid var(--line);align-items:center"><b style="font-size:9.2px;color:var(--navy)">SKC CourtCase</b><p class="small" style="font-size:8.4px">Local case-organization tool for self-represented litigants - deadlines, files, and packets.</p><span class="tag teal" style="justify-self:start">Waitlist</span></div>
  </div>
  <div class="source">Maturity labels reflect evidence available in July 2026. "Deployed" describes an operating surface; it does not by itself claim paid adoption, independent certification, or error-free production maturity.</div><div class="pg">23</div>
</div></section>

<!-- 24 -->
<section class="page" id="evaluation"><div class="page-grid"></div><div class="page-inner">
  <div class="running"><b>HOW TO EVALUATE THE WORK</b><span>Evidence before interpretation</span></div>
  <p class="kicker">A portfolio should withstand inspection</p><h2>Separate leadership scope, deployed capability, research contribution, and commercial proof.</h2>
  <div class="columns-2" style="margin-top:16px">
    <div class="card"><h3>Why so many separate products and sites?</h3><p>Each solves a different problem for a different buyer - HAIEC sells to compliance teams, Kestrel sells to service-business owners, llmverify is a free tool for developers. Bundling them under one brand would make the pitch cleaner and the products worse.</p></div>
    <div class="card"><h3>Isn't this just consulting with extra steps?</h3><p>Consulting produces a recommendation. What's here produces a working system, an open-source package, or a versioned piece of evidence - things that keep working after the engagement ends.</p></div>
    <div class="card"><h3>What's operational versus research-stage?</h3><p>Operational or deployed: HAIEC core capabilities, Kestrel private-beta surfaces, llmverify, and selected utilities. Early access or prototype: SKC Log Analyser, Doc Timeline, and SKC CourtCase. Research and invention work: ISAF, Precision Drift Detection, and the Compliance Twin/Fingerprint methods.</p></div>
    <div class="card"><h3>Fortune 50 and small-business tools in one book - which is it?</h3><p>Both, on purpose. The enterprise program background is where the discipline came from; the small-business tools are where that same discipline gets applied at a price a local business can afford. The rigor doesn't change - the price and paperwork do.</p></div>
  </div>
  <div class="card" style="margin-top:14px;background:linear-gradient(145deg,var(--softteal),#fff)"><h3>Why should a DFW business trust enterprise-scale credentials?</h3><p>Because the failure modes are the same size, relative to the business, even when the dollar figures aren't. A missed call costs a local service business real revenue the same way a compliance gap costs an enterprise real exposure - Kestrel, the Readiness Scorecard, and the Texas AI review exist to bring that same rigor down to a timeline and price a local business can use.</p></div>
  <div class="source">Evaluation rule: professional records establish leadership scope; working systems establish implementation; DOI records establish durable public scholarship; filing receipts establish IP status; customer and performance claims require direct commercial evidence.</div><div class="pg">24</div>
</div></section>

<!-- 25 -->
<section class="page" id="proof-map"><div class="page-grid"></div><div class="page-inner">
  <div class="running"><b>PROOF MAP</b><span>Selected sources and contact</span></div>
  <p class="kicker">Verify the work. Then test the fit.</p><h2>Leadership, systems, scholarship, and evidence - each with its own proof.</h2>
  <div class="contact-grid" style="margin-top:20px">
    <div class="case-content">
      <div class="columns-2">
        <div class="mini"><div class="icon">✓</div><h3 style="font-size:13px">Professional</h3><p><b>Resume and career:</b> subodhkc.com/about<br/><b>LinkedIn:</b> linkedin.com/in/subodhkc<br/><b>Portfolio:</b> subodhkc.com</p></div>
        <div class="mini"><div class="icon" style="background:var(--softteal);color:var(--teal)">✓</div><h3 style="font-size:13px">Code and products</h3><p><b>GitHub:</b> github.com/subodhkc<br/><b>Kestrel:</b> kestrelvoice.com<br/><b>HAIEC:</b> haiec.com</p></div>
        <div class="mini"><div class="icon" style="background:var(--softgold);color:var(--gold)">✓</div><h3 style="font-size:13px">Research and IP</h3><p><b>Research:</b> subodhkc.com/research<br/><b>Open source:</b> llmverify and selected repositories<br/><b>Patent status:</b> filing references available</p></div>
        <div class="mini"><div class="icon">✓</div><h3 style="font-size:13px">Credentials</h3><p>M.S. Engineering &amp; Technology Management<br/>Six Sigma Green Belt<br/>AI ethics and governance education</p></div>
      </div>
      <div class="card" style="background:linear-gradient(145deg,var(--softblue),#fff)"><h3>Evidence and maturity key</h3><p><span class="tag blue">Operational</span> <span class="tag teal">Private beta / prototype</span> <span class="tag gold">Open source</span> <span class="tag">Research / filing</span></p><p class="small" style="margin-top:8px">Leadership: resume and professional records. Research: DOI and venue. IP: filing receipt. Product adoption and performance: dated registry, analytics, test, or customer evidence.</p></div>
      <div class="card" style="background:linear-gradient(145deg,var(--softgold),#fff)"><h3>Local roots, enterprise discipline</h3><p>Based in Euless, Dallas-Fort Worth · Member, HEB Area Chamber of Commerce · Available for project, fractional, partnership, speaking, workshop, and senior AI transformation opportunities - locally and nationally.</p></div>
    </div>
    <div class="qrbox"><img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://subodhkc.com/portfolio" alt="QR code to subodhkc.com/portfolio"/><p>Scan to view this portfolio online</p></div>
  </div>
  <div class="source">Evidence base: professional resume and program records; LinkedIn public positioning; subodhkc.com; kestrelvoice.com; haiec.com; GitHub and package materials; DOI-registered Zenodo technical reports; internal product and incident records; patent filing records. Self-published sources establish authorship and public positioning, not independent validation.</div><div class="pg">25</div>
</div></section>

<!-- 26 -->
<section class="page back" id="back-cover"><div class="page-grid"></div><div class="page-inner">
  <p class="kicker" style="color:#8fd3da">Subodh KC / AI Strategy &amp; Transformation / Dallas-Fort Worth</p>
  <h1>Turn the right AI opportunity into an operating advantage.</h1>
  <div class="closing">Choose the right opportunity.<br/>Align the program.<br/>Build the system.<br/>Measure the outcome.<br/>Preserve the evidence.</div>
  <div class="footerline"><p><b>Subodh KC</b><br/>Euless · Dallas-Fort Worth<br/>subodhkc.com · subodhkc@subodhkc.com</p><img src="https://api.qrserver.com/v1/create-qr-code/?size=92x92&data=https://subodhkc.com" alt="QR code"/></div>
</div></section>
`;

export default function PortfolioPage() {
  const [mode, setMode] = useState<'flip' | 'scroll'>('flip');

  const pages = useMemo(() => {
    const html = BOOK_HTML.trim();
    const matches = html.match(/<section[^>]*class="page[^"]*"[^>]*>[\s\S]*?<\/section>/g);
    return matches || [html];
  }, []);

  return (
    <>
      <style jsx global>{BOOK_CSS}</style>
      <style jsx global>{`
        .mode-toggle {
          border: 1px solid rgba(255,255,255,.25);
          background: rgba(255,255,255,.08);
          color: #fff;
          border-radius: 999px;
          padding: 8px 13px;
          font-weight: 750;
          font-size: 12px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .mode-toggle:hover { background: rgba(255,255,255,.15); }
        .print-only { display: none; }
        @media print {
          .flip-mode { display: none !important; }
          .print-only { display: block !important; }
        }
      `}</style>
      <div className="toolbar" role="toolbar" aria-label="Portfolio actions">
        <strong>AI That Works — Executive Portfolio</strong>
        <div className="actions">
          <button onClick={() => window.print()} aria-label="Print or save portfolio as PDF">Print / Save as PDF</button>
          <button
            className="mode-toggle"
            onClick={() => setMode(mode === 'flip' ? 'scroll' : 'flip')}
            aria-label="Toggle between flip book and scroll mode"
          >
            {mode === 'flip' ? '☰ Scroll' : '📖 Flip'}
          </button>
          <Link href="/resume" aria-label="View resume page">View Resume</Link>
          <Link href="/local-ai-review" aria-label="Request an AI review">Request a Review</Link>
        </div>
      </div>

      {mode === 'flip' ? (
        <div className="flip-mode">
          <BookViewer pages={pages} pageCss={BOOK_CSS} />
        </div>
      ) : (
        <div className="book" dangerouslySetInnerHTML={{ __html: BOOK_HTML }} />
      )}

      {/* Print fallback: always render scroll mode for print regardless of screen mode */}
      <div className="book print-only" dangerouslySetInnerHTML={{ __html: BOOK_HTML }} />
    </>
  );
}
