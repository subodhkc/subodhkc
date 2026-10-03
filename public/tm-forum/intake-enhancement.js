(() => {
  const root = document.getElementById("tmf-p0-intake-root");
  if (!root) return;

  const STORAGE_KEY = "tmf-2026-p0-intake-v1";
  const groups = [
    ["Connectivity", [
      "AgentCore outbound HTTPS?",
      "ServiceNow outbound HTTPS?",
      "External HAIEC MCP allowed?",
      "Must MCP be internal?",
      "DNS/egress restrictions?",
      "Latency/timeouts?",
      "Supported secret path?",
      "Real synchronous refusal hook?"
    ]],
    ["Telemetry", [
      "OTel programmatic access?",
      "CloudWatch groups/query access?",
      "Gateway logs?",
      "AICT traces?",
      "Digital Twin/KPI source?"
    ]],
    ["Identity", [
      "Authoritative run ID?",
      "Authoritative RUN_START?",
      "Trace/span IDs?",
      "Session ID?",
      "Agent execution ID?",
      "Model/tool invocation ID?",
      "Retry identity?",
      "AgentCore runtime IDs?",
      "AWS native IDs?",
      "ServiceNow sys_ids?",
      "Gateway IDs?"
    ]],
    ["Time", [
      "eventTime field?",
      "observedAt field?",
      "ingestedAt field?",
      "Timezone / UTC offset?",
      "Clock domain / sourceClock?",
      "Timestamp precision?",
      "Sync source/mechanism?",
      "Known skew?",
      "Safe cross-system comparisons?"
    ]],
    ["Control / evidence contract", [
      "Authoritative C7/C9/C16 definitions?",
      "Authoritative evidence schemas?",
      "Are immersion-session numerical examples illustrative?"
    ]],
    ["Source / deployment", [
      "Organizer repository available?",
      "Source folder/archive?",
      "CloudShell workspace?",
      "Deployment package?",
      "Commit/snapshot digest?",
      "Build/deployment identity?",
      "ODA CR/change identity?",
      "Deployed AgentCore/ServiceNow asset ID?"
    ]],
    ["C7 facts", [
      "Expected event manifest?",
      "Required zones?",
      "Required enforcement points?",
      "Event IDs/order?",
      "Timing fields?",
      "Cross-source join keys?"
    ]],
    ["C9 facts", [
      "KPI?",
      "Units/direction?",
      "Baseline/version?",
      "Comparable-window rule?",
      "Alert mechanism?",
      "Named recipient/queue?",
      "Required response?"
    ]],
    ["C16 facts", [
      "Token fields?",
      "Accounting scope?",
      "Retry semantics?",
      "Provider call ID?",
      "Cap?",
      "Gateway/refusal hook?",
      "Actual usage source?",
      "Reservation/no-overshoot status?"
    ]],
    ["Mirrored telemetry", [
      "Which sources mirror the same event?",
      "Stable dedupe ID?",
      "Primary source?",
      "Corroborating sources?",
      "Retry-vs-mirror distinction?"
    ]],
    ["Preservation", [
      "When does lab access expire?",
      "What can be exported?",
      "What must be saved before shutdown?"
    ]]
  ];

  root.innerHTML = `
    <style>
      #tmf-p0-intake{max-width:1180px;margin:22px auto 34px;padding:24px;border:2px solid #16d088;border-radius:18px;background:linear-gradient(145deg,rgba(22,208,136,.08),#34373d);color:#ebe6d8;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
      #tmf-p0-intake *{box-sizing:border-box}
      #tmf-p0-intake .p0-kicker{font:800 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;color:#16d088;letter-spacing:.13em}
      #tmf-p0-intake h1{font-size:clamp(26px,4vw,42px);line-height:1.05;margin:10px 0 10px;color:#fff}
      #tmf-p0-intake .p0-lede{max-width:900px;color:#bbb5a9;line-height:1.6}
      #tmf-p0-intake .p0-locks{display:flex;gap:8px;flex-wrap:wrap;margin:16px 0}
      #tmf-p0-intake .p0-locks code{font:700 10px/1.3 ui-monospace,SFMono-Regular,Menlo,monospace;color:#8ee8c4;border:1px solid rgba(22,208,136,.24);border-radius:999px;padding:6px 8px;background:#2b2e33}
      #tmf-p0-intake .p0-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:18px 0}
      #tmf-p0-intake button,#tmf-p0-intake .p0-file-label{border:1px solid rgba(235,230,216,.16);border-radius:9px;padding:9px 11px;background:#2b2e33;color:#ebe6d8;cursor:pointer;font-weight:700;font-size:12px}
      #tmf-p0-intake button:hover,#tmf-p0-intake .p0-file-label:hover{border-color:#16d088}
      #tmf-p0-intake .danger{border-color:rgba(239,140,131,.35);color:#ef8c83}
      #tmf-p0-intake input[type=file]{display:none}
      #tmf-p0-intake .saved{margin-left:auto;color:#8f8a81;font:11px/1.3 ui-monospace,SFMono-Regular,Menlo,monospace}
      #tmf-p0-intake .p0-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
      #tmf-p0-intake .p0-group{border:1px solid rgba(235,230,216,.12);border-radius:12px;padding:14px;background:#303338}
      #tmf-p0-intake .p0-group h2{font-size:16px;margin:0 0 10px;color:#16d088}
      #tmf-p0-intake .p0-row{display:grid;grid-template-columns:minmax(170px,.85fr) 1.15fr;gap:10px;align-items:start;padding:8px 0;border-top:1px solid rgba(235,230,216,.08)}
      #tmf-p0-intake .p0-row:first-of-type{border-top:none}
      #tmf-p0-intake label{font-size:12px;line-height:1.4;color:#bbb5a9}
      #tmf-p0-intake textarea{width:100%;min-height:54px;resize:vertical;border:1px solid rgba(235,230,216,.14);border-radius:8px;background:#2b2e33;color:#ebe6d8;padding:8px;font:12px/1.45 ui-monospace,SFMono-Regular,Menlo,monospace}
      #tmf-p0-intake textarea:focus{outline:2px solid rgba(22,208,136,.25);border-color:#16d088}
      #tmf-p0-intake .p0-note{margin-top:16px;padding:12px;border-left:3px solid #e6bd66;background:rgba(230,189,102,.06);font-size:12px;color:#bbb5a9;line-height:1.55}
      #tmf-p0-intake .p0-note b{color:#e6bd66}
      @media(max-width:820px){#tmf-p0-intake{margin:12px;padding:16px}#tmf-p0-intake .p0-grid{grid-template-columns:1fr}#tmf-p0-intake .p0-row{grid-template-columns:1fr}#tmf-p0-intake .saved{width:100%;margin-left:0}}
    </style>
    <section id="tmf-p0-intake" aria-label="TM Forum first-hour P0 intake">
      <div class="p0-kicker">FIRST-HOUR / P0 · LIVE ENVIRONMENT INTAKE</div>
      <h1>Capture facts before assessed runs.</h1>
      <p class="p0-lede">This operator layer sits above the source-preserving intake. Record only verified environment facts. Use <b>ONSITE VERIFY</b>, <b>UNKNOWN</b>, <b>LIMITED</b>, or <b>BLOCKED</b> when the environment has not established an answer.</p>
      <div class="p0-locks">
        <code>DISPLAY NAME != EVIDENCE IDENTITY</code>
        <code>INGEST TIME != EVENT TIME</code>
        <code>TIMESTAMP PROXIMITY != RUN MEMBERSHIP</code>
        <code>MULTIPLE RECORDS != MULTIPLE ACTIONS</code>
        <code>DO NOT STORE SECRETS HERE</code>
      </div>
      <div class="p0-actions">
        <button type="button" id="p0-export-json">Export Answers JSON</button>
        <button type="button" id="p0-export-md">Export Answers Markdown</button>
        <label class="p0-file-label" for="p0-import">Import / Restore</label>
        <input id="p0-import" type="file" accept=".json,application/json">
        <button type="button" id="p0-reset" class="danger">Clear / Reset</button>
        <span class="saved" id="p0-saved">Not yet saved</span>
      </div>
      <div class="p0-grid" id="p0-grid"></div>
      <div class="p0-note"><b>Threshold rule:</b> CALIBRATE BEFORE FREEZE. Never tune a threshold from assessed results. If a threshold changes after freeze: NEW POLICY VERSION → NEW RUN. This intake must not contain passwords, secret access keys, tokens, private keys, session cookies, or other credentials.</div>
    </section>
  `;

  const grid = document.getElementById("p0-grid");
  const savedEl = document.getElementById("p0-saved");
  const fields = [];

  function keyFor(group, question) {
    return (group + "__" + question).toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
  }

  groups.forEach(([group, questions]) => {
    const card = document.createElement("section");
    card.className = "p0-group";
    const title = document.createElement("h2");
    title.textContent = group;
    card.appendChild(title);

    questions.forEach((question) => {
      const key = keyFor(group, question);
      const row = document.createElement("div");
      row.className = "p0-row";
      const label = document.createElement("label");
      label.setAttribute("for", "p0-" + key);
      label.textContent = question;
      const area = document.createElement("textarea");
      area.id = "p0-" + key;
      area.dataset.key = key;
      area.dataset.group = group;
      area.dataset.question = question;
      area.placeholder = "Verified value / UNKNOWN / ONSITE VERIFY / gap + source reference";
      row.append(label, area);
      card.appendChild(row);
      fields.push(area);
    });

    grid.appendChild(card);
  });

  function snapshot() {
    const answers = {};
    fields.forEach((el) => {
      answers[el.dataset.key] = {
        group: el.dataset.group,
        question: el.dataset.question,
        value: el.value
      };
    });
    return {
      schema: "tmf-p0-intake-v1",
      savedAt: new Date().toISOString(),
      warning: "Secrets must not be stored in this file.",
      answers
    };
  }

  function save() {
    const data = snapshot();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    savedEl.textContent = "Last saved: " + new Date(data.savedAt).toLocaleString();
  }

  function restore(data) {
    if (!data || data.schema !== "tmf-p0-intake-v1" || !data.answers) throw new Error("Unsupported intake file");
    fields.forEach((el) => {
      const entry = data.answers[el.dataset.key];
      if (entry) el.value = String(entry.value || "");
    });
    save();
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      restore(data);
      if (data.savedAt) savedEl.textContent = "Last saved: " + new Date(data.savedAt).toLocaleString();
    } catch (error) {
      console.warn("Unable to restore P0 intake", error);
    }
  }

  let timer;
  fields.forEach((el) => el.addEventListener("input", () => {
    clearTimeout(timer);
    savedEl.textContent = "Saving…";
    timer = setTimeout(save, 250);
  }));

  function download(name, type, content) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  document.getElementById("p0-export-json").addEventListener("click", () => {
    const data = snapshot();
    save();
    download("tmf-first-hour-intake.json", "application/json", JSON.stringify(data, null, 2));
  });

  document.getElementById("p0-export-md").addEventListener("click", () => {
    const data = snapshot();
    const lines = [
      "# TM Forum First-Hour / P0 Intake",
      "",
      `Saved: ${data.savedAt}`,
      "",
      "> Secrets must not be stored in this file.",
      ""
    ];
    groups.forEach(([group]) => {
      lines.push(`## ${group}`, "");
      Object.values(data.answers)
        .filter((entry) => entry.group === group)
        .forEach((entry) => lines.push(`- **${entry.question}** ${entry.value || "UNANSWERED"}`));
      lines.push("");
    });
    save();
    download("tmf-first-hour-intake.md", "text/markdown", lines.join("\n"));
  });

  document.getElementById("p0-import").addEventListener("change", async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    try {
      restore(JSON.parse(await file.text()));
    } catch (error) {
      alert("Unable to import this intake file: " + String(error.message || error));
    } finally {
      event.target.value = "";
    }
  });

  document.getElementById("p0-reset").addEventListener("click", () => {
    if (!confirm("Clear all saved FIRST-HOUR / P0 intake answers on this browser?")) return;
    localStorage.removeItem(STORAGE_KEY);
    fields.forEach((el) => { el.value = ""; });
    savedEl.textContent = "Cleared";
  });

  load();
})();
