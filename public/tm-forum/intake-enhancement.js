(() => {
  const root = document.getElementById("tmf-p0-intake-root");
  if (!root) return;

  const STORAGE_KEY = "tmf-2026-full-intake-v2";
  const customFields = [
    ["event-gates", "Event gates", "Nemotron agent binding; AWS↔AICT connector; gateway/OTel/CloudWatch record proven; team SPOC/Teams room; blockers."],
    ["identity", "Identity & run binding", "Authoritative run/session/RUN_START; trace/span; agent execution; model/tool invocation; gateway; AWS native IDs; ServiceNow sys_ids/connector ID."],
    ["time", "Time integrity", "eventTime / observedAt / ingestedAt; timezone/UTC offset; precision; clock domain/sync; known skew; cross-source comparability."],
    ["c7", "C7 freeze inputs", "Expected-event basis; required zones/enforcement points; event identity/order; gap limit; exception allowance; evidence sources."],
    ["c9", "C9 freeze inputs", "KPI; producer; unit/direction; calibration; baseline snapshot; comparable window; threshold; allowance; alert recipient/ServiceNow path."],
    ["c16", "C16 freeze inputs", "Provider call IDs; input/output/cache token semantics; retries; cost/token basis; hard cap; refusal hook; executed-call definition."],
    ["aws", "AWS / AgentCore / gateway", "Account/region; agent/runtime/deployment IDs; gateway endpoint; sanctioned export/egress; synchronous enforcement hook; source limitations."],
    ["snow", "ServiceNow AICT", "Unique HAIEC connector name/ID; AWS binding; CloudWatch log group; discovered agent sys_ids/native IDs; sessions/traces available; model/trace discovery gaps; human-loop evidence."],
    ["nemotron", "Nemotron compliance", "Actual model identity of supplied agents. If Nemotron-backed, evidence the binding. If creating/replacing an agent, record chosen Nemotron model, deployment ID and invocation evidence. HAIEC evaluator remains deterministic."],
    ["source", "Source/deployment binding", "Exact repository/snapshot/commit if available; deployment/runtime binding; CODE_CAPABLE established/not established; copied repo is not deployed-source proof."],
    ["freeze", "Freeze record", "Discovery complete? calibration source? governing policy version/digest? exact scope? source profile? baseline/cap/threshold frozen? assessed-run selection rule? freeze time/owner?"],
    ["support", "Support / blockers", "SPOC; Teams room; organizer/mentor answer; help-desk action; unresolved Blocker items; owner and next action."],
  ];

  root.innerHTML = `
    <style>
      #tmf-p0-intake-root{font-family:system-ui,sans-serif;background:#24272c;color:#ebe6d8;border-bottom:2px solid #16d088}
      .tmfp0{max-width:1180px;margin:auto;padding:24px 22px 30px}.tmfp0 h1{font-size:30px;margin:0 0 8px}.tmfp0 p{color:#bbb5a9;line-height:1.55}.tmfp0 .warn{border:1px solid #e6bd66;background:#332f23;padding:12px 14px;border-radius:10px;color:#ead9ab}.tmfp0 .gates{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:16px 0}.tmfp0 .gate{border:1px solid #404349;background:#303339;padding:13px;border-radius:10px}.tmfp0 .gate b{display:block;color:#16d088;font:800 11px ui-monospace,monospace;margin-bottom:6px}.tmfp0 .gate small{color:#bbb5a9;line-height:1.5}.tmfp0 .grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:16px}.tmfp0 .f{border:1px solid #404349;background:#303339;padding:12px;border-radius:10px}.tmfp0 label{display:block;font-weight:800;font-size:12px;color:#e6e1d5;margin-bottom:6px}.tmfp0 textarea{width:100%;min-height:78px;resize:vertical;border:1px solid #50545b;border-radius:8px;background:#22252a;color:#f2eee5;padding:9px;font:13px/1.45 ui-monospace,monospace}.tmfp0 .tools{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:14px}.tmfp0 button,.tmfp0 .link{border:1px solid #50545b;border-radius:8px;background:#303339;color:#ebe6d8;padding:8px 10px;font-weight:700;cursor:pointer;text-decoration:none;font-size:12px}.tmfp0 button.primary{border-color:#16d088;color:#16d088}.tmfp0 .saved{color:#8ee8c4;font-size:12px;margin-left:auto}.tmfp0 .freeze{margin-top:14px;padding:12px;border-left:3px solid #e6bd66;background:#2e2b24;font:700 12px/1.6 ui-monospace,monospace;color:#e6d7aa}@media(max-width:800px){.tmfp0 .grid,.tmfp0 .gates{grid-template-columns:1fr}}
    </style>
    <div class="tmfp0">
      <div style="font:800 11px ui-monospace,monospace;color:#16d088;letter-spacing:.1em">FIRST-HOUR / P0 OPERATING INTAKE · FULL-DOCUMENT AUTOSAVE</div>
      <h1>Discover first. Freeze only what the live environment establishes.</h1>
      <p>This layer is the event-day short form. <strong>All editable fields in the full reference below are now autosaved and included in export/restore too.</strong> Use the detailed worksheet when you need depth; use this layer to keep the critical path visible.</p>
      <div class="warn"><strong>DO NOT STORE SECRETS HERE.</strong> Record secret location/reference only. Never paste AWS secret keys, bearer tokens, passwords, private keys, session cookies or other credentials into this page or its exports.</div>
      <div class="gates">
        <div class="gate"><b>GATE A · NEMOTRON</b><small>Organizer validity requirement applies to the agent path. Verify the actual model identity. Supplied Nemotron-backed agents can satisfy the path if confirmed; new/replacement agents must use Nemotron. HAIEC verdict remains deterministic.</small></div>
        <div class="gate"><b>GATE B · AWS ↔ AICT</b><small>Create a unique HAIEC connector and prove agent discovery. Capture connector ID, AWS binding, CloudWatch log group, sys_ids/native IDs and any model/trace discovery limitations.</small></div>
        <div class="gate"><b>GATE C · TELEMETRY</b><small>Prove one real gateway + OTel/CloudWatch record before freeze. Determine direct HAIEC ingestion vs LogSense normalization/export fallback.</small></div>
      </div>
      <div class="freeze">HAIEC CODE BASELINE = READY / KEEP STABLE<br>EVENT GOVERNING POLICY = NOT YET FROZEN<br>DISCOVER → QUALIFY → CALIBRATE → DECLARE → FREEZE → RUN → EVIDENCE → CONTROL TEST</div>
      <div class="grid">
        ${customFields.map(([id,label,ph]) => `<div class="f"><label for="tmf-${id}">${label}</label><textarea id="tmf-${id}" data-tmf-custom="${id}" placeholder="${ph.replace(/"/g,"&quot;")}"></textarea></div>`).join("")}
      </div>
      <div class="tools">
        <button class="primary" id="tmf-save">Save now</button>
        <button id="tmf-export-json">Export JSON</button>
        <button id="tmf-export-md">Export Markdown</button>
        <button id="tmf-import">Import / Restore</button>
        <button id="tmf-clear">Clear / Reset</button>
        <a class="link" href="/tm-forum-challenge">Hub</a>
        <a class="link" href="/tm-forum/field-guide">Canonical Field Guide</a>
        <span class="saved" id="tmf-saved">Not saved yet</span>
        <input id="tmf-file" type="file" accept="application/json,.json" hidden>
      </div>
    </div>`;

  const $ = (s, ctx=document) => ctx.querySelector(s);
  const $$ = (s, ctx=document) => Array.from(ctx.querySelectorAll(s));

  function originalEditableNodes(){
    return $$('input,textarea,select').filter(el => !root.contains(el) && el.type !== 'file' && el.type !== 'button' && el.type !== 'submit');
  }
  function statusGroups(){ return $$('.status-pills').filter(g => !root.contains(g)); }

  function snapshot(){
    return {
      version: 2,
      savedAt: new Date().toISOString(),
      custom: Object.fromEntries($$('[data-tmf-custom]', root).map(el => [el.dataset.tmfCustom, el.value])),
      originalFields: originalEditableNodes().map((el, i) => ({
        i,
        tag: el.tagName,
        type: el.type || '',
        value: (el.type === 'checkbox' || el.type === 'radio') ? !!el.checked : el.value,
        name: el.name || '',
        id: el.id || '',
      })),
      statusGroups: statusGroups().map((g, i) => ({ i, status: ($('.spill.active', g)?.dataset.status || 'open') })),
    };
  }

  function apply(data){
    if (!data || typeof data !== 'object') return;
    Object.entries(data.custom || {}).forEach(([k,v]) => { const el = $(`[data-tmf-custom="${CSS.escape(k)}"]`, root); if(el) el.value = String(v ?? ''); });
    const nodes = originalEditableNodes();
    (data.originalFields || []).forEach(rec => { const el = nodes[rec.i]; if(!el) return; if(el.type === 'checkbox' || el.type === 'radio') el.checked = !!rec.value; else el.value = rec.value ?? ''; });
    const groups = statusGroups();
    (data.statusGroups || []).forEach(rec => { const g = groups[rec.i]; if(!g) return; $$('.spill', g).forEach(p => p.classList.toggle('active', p.dataset.status === rec.status)); });
  }

  function save(){
    try{ const data=snapshot(); localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); $('#tmf-saved').textContent='Saved '+new Date(data.savedAt).toLocaleTimeString(); }
    catch(err){ $('#tmf-saved').textContent='Save failed: '+String(err.message||err); }
  }
  let timer;
  function queueSave(){ clearTimeout(timer); timer=setTimeout(save,250); }

  function download(name, text, type){ const blob=new Blob([text],{type}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500); }
  function markdown(data){
    const lines=['# TM Forum 2026 — HAIEC + LogSense Intake Export','',`Saved: ${data.savedAt}`,'','## Critical event intake'];
    customFields.forEach(([id,label])=>{ lines.push('',`### ${label}`,String(data.custom?.[id]||'').trim()||'_blank_'); });
    lines.push('','## Full reference worksheet fields');
    const current=originalEditableNodes();
    (data.originalFields||[]).forEach(rec=>{ const el=current[rec.i]; if(!el) return; const card=el.closest('.q-card'); const qid=card?.querySelector('.q-id')?.textContent?.trim(); const q=card?.querySelector('.q-text')?.textContent?.trim(); const label=qid||q||el.id||el.name||`field-${rec.i}`; if(String(rec.value??'').trim() || rec.value===true) lines.push(`- **${label}:** ${String(rec.value)}`); });
    lines.push('','## Status selections');
    const groups=statusGroups();
    (data.statusGroups||[]).forEach(rec=>{ const card=groups[rec.i]?.closest('.q-card'); const label=card?.querySelector('.q-id')?.textContent?.trim()||card?.querySelector('.q-text')?.textContent?.trim()||`status-${rec.i}`; lines.push(`- **${label}:** ${rec.status}`); });
    return lines.join('\n');
  }

  document.addEventListener('input', e => { if(e.target.matches('input,textarea,select')) queueSave(); }, true);
  document.addEventListener('change', queueSave, true);
  document.addEventListener('click', e => { if(e.target.closest('.spill')) setTimeout(queueSave,0); }, true);
  $('#tmf-save').addEventListener('click', save);
  $('#tmf-export-json').addEventListener('click',()=>{const d=snapshot();save();download(`tmf-intake-${new Date().toISOString().replace(/[:.]/g,'-')}.json`,JSON.stringify(d,null,2),'application/json')});
  $('#tmf-export-md').addEventListener('click',()=>{const d=snapshot();save();download(`tmf-intake-${new Date().toISOString().replace(/[:.]/g,'-')}.md`,markdown(d),'text/markdown')});
  $('#tmf-import').addEventListener('click',()=>$('#tmf-file').click());
  $('#tmf-file').addEventListener('change',async e=>{const f=e.target.files?.[0]; if(!f)return; try{const d=JSON.parse(await f.text());apply(d);save();alert('Intake restored. Review values before relying on them.');}catch(err){alert('Unable to restore: '+String(err.message||err));} e.target.value='';});
  $('#tmf-clear').addEventListener('click',()=>{if(!confirm('Clear all saved TM Forum intake values, including the full reference worksheet?'))return; localStorage.removeItem(STORAGE_KEY); $$('[data-tmf-custom]',root).forEach(el=>el.value=''); originalEditableNodes().forEach(el=>{if(el.type==='checkbox'||el.type==='radio')el.checked=false;else el.value=''}); statusGroups().forEach(g=>$$('.spill',g).forEach((p,i)=>p.classList.toggle('active',p.dataset.status==='open'||(!g.querySelector('[data-status="open"]')&&i===0)))); $('#tmf-saved').textContent='Reset';});

  try{const raw=localStorage.getItem(STORAGE_KEY); if(raw){const d=JSON.parse(raw);apply(d);$('#tmf-saved').textContent='Restored '+(d.savedAt?new Date(d.savedAt).toLocaleString():'saved data');}}catch(err){console.warn('TMF intake restore failed',err)}
})();
